/**
 * 
 * FACTURATION APPLICATION > Demandes d'avoir client.
 * 
 * @author JOSIAS SIE
 * @since 2025-06-18
 */

const xRefTest      = "FAC_REG_DAV";
const xDescription  = "Régulariser une demande d'avoir";
const xIdTest       =  93;
const xVersion      = '3.0';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'FACTURATION',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['label','groupeArticle','rayon','plateforme'],
	fileName    : __filename
}

//-------------------------------------------------------------------------------------------------------------------

import { expect, test, type Page }          from '@playwright/test';

import { Help }                             from '@helpers/helpers';
import { TestFunctions }                    from '@helpers/functions';
import { Log }                              from '@helpers/log';
import { MenuFacturation }                  from '@pom/FAC/menu.page';

import { RegulationDemandeAvoirPage }       from '@pom/FAC/regularisation-demande_avoir.page';
import { CartoucheInfo, TypeListOfElements }from '@commun/types';

//-------------------------------------------------------------------------------------------------------------------

let page                      : Page;

let menu                      : MenuFacturation;
let regulationDemandeAvoirPage: RegulationDemandeAvoirPage;
const log                     = new Log();
const fonction                = new TestFunctions(log);

//------------------------------------------------------------------------------------

var oData:any           = fonction.importJdd(); //Import du JDD pour le bout en bout  

var sPtfDistribution    = fonction.getInitParam('plateforme', 'Cremlog');
const sRayon            = fonction.getInitParam('rayon', 'Crèmerie');
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Coupe / Corner');
const sResponsabilite   = fonction.getInitParam('label', 'Centrale d\'achat');  

//------------------------------------------------------------------------------------
const sPrixCession      = 1;
const sMessageInfo      = `En cas de régularisation, cette demande d\'avoir générera :`
//------------------------------------------------------------------------------------

if (oData !== undefined) {  // On est dans le cadre d'un E2E. Récupération des données temporaires      
	var sCodeClient   = oData.sCodeClient 	 
    var sCodeArticle  = oData.sCodeArticle 
	
	log.set('E2E - Code client : ' + sCodeClient); 
} 

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page                      = await browser.newPage();
	menu                      = new MenuFacturation(page, fonction) ;
	regulationDemandeAvoirPage= new RegulationDemandeAvoirPage(page);
	const helper              = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', async () => {

	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({context}) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test ('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe ('Page [REGULARISATION]', async () => {    
	  
		let sCurrentPage:string = 'regularisation';

		test('Page [REGULARISATION] - Click', async () => {
			await menu.click(sCurrentPage, page);
		})

		test('ListBox [PLATEFORME] ="' + sPtfDistribution + '"', async () => {
			await menu.selectPlateformeByLabel(sPtfDistribution, page);
		})

		test('ListBox [RAYON - GROUPE ARTICLE] = "' + sRayon + ' - ' + sGroupeArticle + '"', async () => {            
			await menu.selectRayonGroupeArticle(sRayon, sGroupeArticle, page); // Sélection du rayon passé en paramètre
		})

		test.describe ('Onglet [DEMANDES D\'AVOIR CLIENT]', async () => {

			test('Onglet [DEMANDES D\'AVOIR CLIENT] - Click', async () => {
				await menu.clickOnglet(sCurrentPage, 'demandesAvoirClient', page);
			})

			test('** Wait Until Spinner Off #1 **', async () => {
				await fonction.waitForSpinner(regulationDemandeAvoirPage.spinnerLoading.nth(0), 180000);
			})
			
			//------------------------------------------------------------------------------------------------- 
			test('DataGrid [CLIENTS AVEC DEMANDE D\'AVOIR] - Is Displayed', async () => {
				var oDataGrid:TypeListOfElements = {
					element     : regulationDemandeAvoirPage.dataGridClients,    
					desc        : 'DataGrid [CLIENTS AVEC DEMANDE D\'AVOIR]',
					verbose      : false, column      :   
						[
							'0',
							'Code client',
							'Désignation client',
							'Nombre demandes',   
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			
			test('DataGrid [DEMANDE D\'AVOIR] - Is Displayed', async () => {
				var oDataGrid = {
					element     : regulationDemandeAvoirPage.dataGridDemandedAvoir,    
					desc        : 'DataGrid [DEMANDE D\'AVOIR]',
					verbose     : false, 
					column      :   
						[
							'0',
							'Date expédition client',
							'Date demande',
							'Type demande',
							'Motif',
							'Client',
							'Code article',
							'Désignation article',
							'Code fournisseur',
							'Désignation fournisseur',
							'N° lot',
							'Quantité livrée',
							'Quantité demandée en avoir',
							'Quantité demandée en avoir (en kg)',
							'Statut',
							'',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			//------------------------------------------------------------------------------------------------- 
			test('Tr [CLIENTS] = Demandes non traitées', async () => {
				await regulationDemandeAvoirPage.listBoxDemandes.selectOption({label:'Demandes non traitées'}); 
				await fonction.wait(page, 250);
			})

			test('Tr [CLIENTS][DEMANDE D\'AVOIR] = "' + sCodeClient + '"', async () => {
				await fonction.clickAndWait(regulationDemandeAvoirPage.trClientDemandedAvoir.locator('span:text-is("'+sCodeClient+'")'), page); 
			})

			test('** Wait Until Spinner Off #2 **', async () => {
				await fonction.waitForSpinner(regulationDemandeAvoirPage.spinnerLoading.nth(1), 180000);
			})

			test('Input [CODE ARTICLE] = "' + sCodeArticle + '"', async () => {
				await fonction.sendKeys(regulationDemandeAvoirPage.inputSearchArticle.locator('input'), sCodeArticle,  false, 'Code article'); 
				await fonction.waitForDomStable(page);
			})

			test('Td [DATE DE DEMANDE] - Click x2', async () => {
				await fonction.clickElement(regulationDemandeAvoirPage.tdDateDemande);
				await fonction.clickElement(regulationDemandeAvoirPage.tdDateDemande);
			})

			test('Tr [DEMANDE D\'AVOIR][First] - Click', async () => {
				await fonction.clickAndWait(regulationDemandeAvoirPage.trDemandedAvoir.first(), page); 
			})

			test('Button [REGULARISER] - Click', async () => {
				await fonction.clickAndWait(regulationDemandeAvoirPage.buttonRegulariser, page);
			})

			var sNomPopin:string = "REGULATION D\'UNE DEMANDE D\'AVOIR";
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {
				test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin, true);
				})

				test('Checkbox [ACCEPTATION DE LA DEMANDE] - Is visible', async () => {
					await fonction.isDisplayed(regulationDemandeAvoirPage.pPRadiobuttonAcceptationDemande.nth(0));
					await fonction.isDisplayed(regulationDemandeAvoirPage.pPRadiobuttonAcceptationDemande.nth(1));
				})

				test('Span [CONSIGNE] - Is visible', async () => {
					await fonction.isDisplayed(regulationDemandeAvoirPage.pSpanConsigne); 
				})
							
				test('Input [QUANTITE ACCEPTEE] - Is visible', async () => {
					await fonction.isDisplayed(regulationDemandeAvoirPage.pInputQuantiteAcceptee);
				})

				test('Checkbox [RESPONSABILITE] - Is visible', async () => {
					await fonction.isDisplayed(regulationDemandeAvoirPage.pPRadiobuttonResponsabilite.nth(0));
					await fonction.isDisplayed(regulationDemandeAvoirPage.pPRadiobuttonResponsabilite.nth(1));
				})
							   
				test('Input [NOUVEAU PRIX DE CESSION] - Is visible', async () => {
					await fonction.isDisplayed(regulationDemandeAvoirPage.pInputNouveauPrixCession); 
				})

				test('Button [ENREGISTRER TYPE ET MOTIF] - Is visible', async () => {
					await fonction.isDisplayed(regulationDemandeAvoirPage.pButtonEnregsitrerTypeMof); 
				})
				
				test('Button [REGULARISER] - Is visible', async () => {
					await fonction.isDisplayed(regulationDemandeAvoirPage.pButtonRegulariser); 
				})
				
				test('Button [ANNULER] - Is visible', async () => {
					await fonction.isDisplayed(regulationDemandeAvoirPage.pButtonAnnuler); 
				})

				//---------------------------------------------------------------------------------------------

				test('Span [TYPE DE DEMANDE] - Is visible', async () => {
					await fonction.isDisplayed(regulationDemandeAvoirPage.pSpanTypeDemande);
				})

				test('Div [MOTIF] - Is visible', async () => {
					await fonction.isDisplayed(regulationDemandeAvoirPage.pDivMotif);
				})

				test('Textarea [COMMENTAIRE] - Is visible', async () => {
					await fonction.isDisplayed(regulationDemandeAvoirPage.pTextareaCommentaire);
				}) 

				//---------------------------------------------------------------------------------------------

				test('Checkbox [RESPONSABILITE] - Click', async () => {
					if(sResponsabilite == "Centrale d'achat"){
					  await fonction.clickElement(regulationDemandeAvoirPage.pPRadiobuttonResponsabilite.nth(0));
					}else{
					  await fonction.clickElement(regulationDemandeAvoirPage.pPRadiobuttonResponsabilite.nth(1));
					}
				})
				
				test('Input [NOUVEAU PRIX DE CESSION] = "' + sPrixCession + '"', async () => {
					if(await regulationDemandeAvoirPage.pInputNouveauPrixCession.isEditable()){
					await fonction.sendKeys(regulationDemandeAvoirPage.pInputNouveauPrixCession, sPrixCession, false, 'Nouveau prix de cession');
					await fonction.waitForDomStable(page); 
					}
				})

				test('Div [MESSAGE D\'INFO] - Is Contain', async () => {
					expect(await regulationDemandeAvoirPage.pDivMessageInfo.textContent()).toContain(sMessageInfo);
				})

				test('Button [REGULARISER] - Is Enabled', async () => {
					await expect(regulationDemandeAvoirPage.pButtonRegulariser).toBeEnabled(); 
				})
				 
				//---------------------------------------------------------------------------------------------

				test('Button [REGULARISER] - Click', async () => {  
					await fonction.clickAndWait(regulationDemandeAvoirPage.pButtonRegulariser, page); 
				})

				test('Popin [' + sNomPopin.toUpperCase() + '] - Is not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin, false);
				})
			})  // End Describe Popin

			//------------------------------------------------------------------------------------------------- 
			
			test('Tr [CLIENTS]#2 = Toutes les demandes', async () => {
				await regulationDemandeAvoirPage.listBoxDemandes.selectOption({label:'Toutes les demandes'}); 
				await fonction.wait(page, 250);
			})

			test('Tr [CLIENTS][DEMANDE D\'AVOIR] #2 = "' + sCodeClient + '"', async () => {
				if(parseInt(await regulationDemandeAvoirPage.dataGridClients.locator('span').nth(0).textContent()) < 1){
				   await fonction.clickAndWait(regulationDemandeAvoirPage.trClientDemandedAvoir.locator('span:text-is("'+sCodeClient+'")'), page); 
				}
			})

			test('I [VIDER] - Click', async () => {
				await fonction.clickElement(regulationDemandeAvoirPage.iVider); 
			})

			test('Input [CODE ARTICLE] #2 = "' + sCodeArticle + '"', async () => {
				await fonction.sendKeys(regulationDemandeAvoirPage.inputSearchArticle.locator('input'), sCodeArticle,  false, 'Code article'); 
				await fonction.waitForDomStable(page);
			})

			test('Td [DATE DE DEMANDE] #2 - Click x2', async () => {
				await fonction.clickElement(regulationDemandeAvoirPage.tdDateDemande);
				await fonction.clickElement(regulationDemandeAvoirPage.tdDateDemande);
			})

			test('** Wait Until Spinner Off #3 **', async () => {
				await fonction.waitForSpinner(regulationDemandeAvoirPage.spinnerLoading.nth(1), 180000);
			})

			test('Tr [DEMANDE D\'AVOIR][SATUT] - Expect', async () => {
				await regulationDemandeAvoirPage.trDemandedAvoir.first().hover({timeout:1000}); 
				expect(regulationDemandeAvoirPage.trDemandedAvoir.first().locator('td.datagrid-acceptation span')).toHaveClass('icon-black icon-thumbs-up');
			})
		})  // End describe Onglet  
	})  //-- End Describe Page

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})