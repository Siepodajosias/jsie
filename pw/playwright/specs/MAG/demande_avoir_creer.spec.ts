/**
 *
 * @author JOSIAS SIE
 * @since 2025-06-16
 * 
 */
const xRefTest      = "MAG_FAC_DAV";
const xDescription  = "Créer une demande d'avoir Crèmerie";
const xIdTest       =  9929;
const xVersion      = '3.1';

//------------------------------------------------------------------------------------

var info:CartoucheInfo = {
	desc       : xDescription,
	appli      : 'MAGASIN',
	version    : xVersion,
	refTest    : [xRefTest],
	idTest     : xIdTest,
	help       : [],
	params     : ['ville','groupeArticle'],
	fileName   : __filename
}

//------------------------------------------------------------------------------------
  
import { expect, test, type Page }                        from '@playwright/test';

import { TestFunctions }                                  from "@helpers/functions";
import { Log }                                            from "@helpers/log";
import { Help }                                           from '@helpers/helpers';
import { AutoComplete, CartoucheInfo, TypeListOfElements }from '@commun/types';
import { MenuMagasin }                                    from '@pom/MAG/menu.page';

import { FaturationDemandeAvoir }                         from '@pom/MAG/facturation-demande_avoir.page'; 

//-------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuMagasin;

let pageFactuAvoir	    : FaturationDemandeAvoir; 

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------
var oData:any           = fonction.importJdd();

const sMagasin          = fonction.getInitParam('ville', 'Chaponnay (F720)'); //Bergerac (G550)
const sGroupeArticle    = fonction.getInitParam('groupeArticle','Coupe / Corner');

//------------------------------------------------------------------------------------

const sType        :string= 'Qualité'
const sMotif       :string= 'Impropre à la vente'
var iQuantite      :any   = 1
const sObservations:string= 'TA_preccess de demande d\'avoir. ' + fonction.getToday('FR') + fonction.getBadChars();
//------------------------------------------------------------------------------------
process.env.ROLE          = 'RESPONSABLE RAYON';// Connexion par défaut avec le profil ayant le Role RESPONSABLE RAYON
//------------------------------------------------------------------------------------

if (oData !== undefined) {  // On est dans le cadre d'un E2E. Récupération des données temporaires
	var iDateLivraison= oData.iDateLivraison;                               
	var iNumeroBL     = oData.iNumeroBL;       
	var sCodeArticle  = oData.sCodeArticle;
	var sCodeArt      = oData.sCodeArt;  	 
	var iQuantite     = oData.iQuantite;
	var iQuantiteUD   = oData.iQuantiteUD;
	var iQuantite_UD  = oData.iQuantite_UD;
    var iQuantiteColis= oData.iQuantiteColis;
	
	log.set('E2E - Date de livraison : ' + iDateLivraison);
	log.set('E2E - Numéro BL : ' + iNumeroBL);
	log.set('E2E - Code article : ' + sCodeArticle); 
} 

//-----------------------------------------------------------------------------------

const sMessageValid :string = "Votre demande d'avoir comporte des articles qui nécessitent la validation d'un responsable. Elle sera transmise à la centrale d'achat uniquement s'il l'accepte."
const sMessageConfir:string = `${sCodeArticle} : À la validation, les quantités demandées en avoir seront déduites de votre stock.`
const sMessageError :string = `Création de la demande d\'avoir impossible. Le bon de livraison définitif a été reçu il y a plus de 70 jour(s)`

//-----------------------------------------------------------------------------------
test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage(); 
	menu                = new MenuMagasin(page, fonction);
	pageFactuAvoir      = new FaturationDemandeAvoir(page);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {
  
	test('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})
	
	test('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe('Page [ACCUEIL]', async () => {
		test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
			await fonction.waitTillHTMLRendered(page);
			var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
			if (isVisible) {
				await menu.removeArlerteMessage(page);
			} else {
				log.set('Link [BROWSER SECURITY WARNING] - Click: ACTION ANNULEE');
				test.skip();
			}
		})
	})

   test.describe ('Page [FACTURATION]', async () => {

		var pageName:string = 'facturation';

		test('Menu [FACTURATION] - Click', async () => {
			await menu.click(pageName, page); 
		}) 

		test('ListBox [VILLE] = "' + sMagasin + '"', async () => {  // On sélectionne le magasin cible.
			await menu.selectVille(sMagasin, page);
			log.set('Magasin : ' + sMagasin);
		})
	
		test.describe ('Onglet [DEMANDE D\'AVOIR]', async () => {

			test('Onglet [DEMANDE D\'AVOIR] - Click', async () => {
				await menu.clickOnglet(pageName, 'demandeAvoir', page);
			})
	
			test('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test('** Wait Until Spinner Off #1 **', async () => {
				await fonction.waitForSpinner(pageFactuAvoir.spinnerLoading, 180000);
			})

			test('DatePicker and input [Is - visible] - Is displayed', async () => {
				await fonction.isDisplayed(pageFactuAvoir.datePickerPeriode); 
				await fonction.isDisplayed(pageFactuAvoir.inputFiltreCodeArticle);            
				await fonction.isDisplayed(pageFactuAvoir.inputFiltreArticle);            
				await fonction.isDisplayed(pageFactuAvoir.inputFiltreConditionnement); 
			}) 

			test('DataGrid [LISTE ARTICLES] - Is displayed', async () => {      
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageFactuAvoir.dataGridListeArticles,    
					desc        : 'DataGrid [LISTE ARTICLES]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'',
							'Date demande',
							'Date BL',
							'Code article',
							'Article',
							'Conditionnement',
							'Qté fact.',
							'Qté dem.',
							'Poids dem. (g)',
							'Qté accept.',
							'Poids accept. (g)',
							'Montant',
							'Type',
							'Motif',
							'PVC Cassé frais',
							'Observations',
							'Statut',
							'Infos de la centrale',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			}) 

			test('Button  [Is - visible] - Is displayed', async () => {         
				await fonction.isDisplayed(pageFactuAvoir.buttonCreer);                                                                                                                  
				await fonction.isDisplayed(pageFactuAvoir.buttonVoirPhotos); 
			})

			test('Button [CREER] #1 - Click', async () => {
				await fonction.clickAndWait(pageFactuAvoir.buttonCreer, page);
			})

			var sNomPopin:string = "CREATION D\'UNE DEMANDE D\'AVOIR";
			test.describe ('Popin [' + sNomPopin.toUpperCase() + '] #1', async () => {

				test('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 
	
				test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin, true);
				})
				
				test('Input [ARTICLE] = "' + sGroupeArticle + '"', async () => {
					await pageFactuAvoir.pPlistBoxGroupeArticle.selectOption({label: sGroupeArticle});  
				})

				test('Button, InpuField, listBox, textArea and datePicker [Is - visible] - Is displayed', async () => {
					await fonction.checkListBox(pageFactuAvoir.pPlistBoxGroupeArticle);
					await fonction.isDisplayed(pageFactuAvoir.pPinputArticle);
					await fonction.isDisplayed(pageFactuAvoir.pPdatePickerLivraison);
					await fonction.isDisplayed(pageFactuAvoir.pInputNumeroLotfournisseur);
					await fonction.isDisplayed(pageFactuAvoir.pInputNumeroBLLogistique);
					await fonction.isDisplayed(pageFactuAvoir.pSpanDateDlcfournisseur)
					await fonction.isDisplayed(pageFactuAvoir.pPbuttonRechercherBLDef);
					//-------------------------------------------------------------------
					await fonction.isDisplayed(pageFactuAvoir.pPlistBoxTypeDAV);
					await fonction.isDisplayed(pageFactuAvoir.pInputDemandeColis);
					await fonction.isDisplayed(pageFactuAvoir.pInputUnite);
					//-------------------------------------------------------------------
					await fonction.isDisplayed(pageFactuAvoir.pPinputQuantiteDemandee); 
					await fonction.isDisplayed(pageFactuAvoir.pPlistBoxMotifDAV);
					await fonction.isDisplayed(pageFactuAvoir.pPtextAreaObservations);
					await fonction.isDisplayed(pageFactuAvoir.pPbuttonAjouter);
				})

				test('DataGrid [LISTE DES DEMANDES D\'AVOIR] [Is -visible] - Is displayed', async () => {
					var oDataGrid:TypeListOfElements = {
						element     : pageFactuAvoir.pPdataGridListeDAV,    
						desc        : 'DataGrid [LISTE DES DEMANDES D\'AVOIR]',
						verbose     : false,
						column      :  
							[
								'N° BL',
								'N° lot',
								'Code',
								'Désignation',
								'Conditionnement',
								'DLC',
								'Type',
								'Motif',
								'Observations',
								'Qté dem.',
								'Qté dem. Unités',
								'Poids dem. (grammes)',
								'Prix du colis',
								'Prix de cession en UD',
								'Montant total',
								'Actions',
							]
					}   
					await fonction.dataGridHeaders(oDataGrid); 
				})
	
				test('Button [ENVOYER] - Is Disabled', async () => {
					await expect(pageFactuAvoir.pPbuttonEnregistrer).toBeDisabled();     
				})

				test.describe ('Div [RECHERCHE ET VERIFICATION DU BL ENREGISTRER]', async () => {
										
					test('Input [AUTOCOMPLETE][ARTICLE] = "' + sCodeArticle + '"', async () => {
						var oData:AutoComplete = {
							libelle         :'SOCIETE',
							inputLocator    : pageFactuAvoir.pPinputArticle,
							inputValue      : sCodeArticle,
							choiceSelector  : 'li.gfit-autocomplete-result',
							choicePosition  : 0,
							typingDelay     : 100,
							waitBefore      : 500,
							page            : page,
						}
						await fonction.autoComplete(oData);
					})

					test('Span [DATE DE LIVRAISON] - Click', async () => {
						await fonction.clickAndWait(pageFactuAvoir.pPdatePickerLivraison.locator('span'), page);  
					})

					test('Input [DATE DE LIVRAISON] = "' + iDateLivraison + '"', async () => {
						await fonction.clickAndWait(pageFactuAvoir.pPdatePickerDay.locator('th.prev'), page); 
						await fonction.clickElement(pageFactuAvoir.pPdatePickerDay.locator('td[class=day]:text-is("'+(parseInt(iDateLivraison.slice(0,2)) + 1)+'")')); 
					})

					test('Button [RECHERCHER UN BL DEFINITIF] - Click', async () => {
						await fonction.clickAndWait(pageFactuAvoir.pPbuttonRechercherBLDef, page);  
					})

					test('DataGrid [LISTE DES BON DE LIVRAISON] [Is - visible] - Is displayed', async () => {
						var oDataGrid:TypeListOfElements = {
							element     : pageFactuAvoir.pPdataGridListeBL.locator('span'),    
							desc        : 'DataGrid [LISTE DES BON DE LIVRAISON]',
							verbose     : false,
							column      :  
								[
									'1',
									'N° BL',
									'Code',
									'Désignation',
									'Conditionnement',
									'N° lot',
									'DLCs',
									'N° lots fournisseurs',
									'Fournisseur',
									'N° BL logis.',
									'Qté facturée',
									'Prix du colis',
									'Prix de cession en UD',
									'Montant total'
								]
						}   
						await fonction.dataGridHeaders(oDataGrid); 
					})

					test('Td [N° BL] = "' + iNumeroBL + '"', async () => {
						expect(await pageFactuAvoir.pSpanNumeroBL.textContent()).toEqual(iNumeroBL);  
					})
				})
	
				test('ListBox [TYPE] = "' + sType + '"', async () => {
					await pageFactuAvoir.pPlistBoxTypeDAV.selectOption({label:sType});     
				})

				test('Input [QUANTITE DEMANDEE] = "' + iQuantite + '"', async () => {
					await fonction.sendKeys(pageFactuAvoir.pPinputQuantiteDemandee, iQuantite, false, 'Quantité demandée');     
				})

				test('Input [POIDS REEL DEMANDE] = "' + iQuantiteUD + '"', async () => {
					if(await pageFactuAvoir.pPinputPoidReelDemandee.isVisible()){
						var iPoidsReel = parseFloat(iQuantiteUD.replace(',', '.').split()[0]);
					   await fonction.sendKeys(pageFactuAvoir.pPinputPoidReelDemandee, Math.ceil(iPoidsReel), false, 'Poids réeldemandé'); 
					}    
				})

				test('ListBox [MOTIF] = "' + sMotif + '"', async () => {
				   await pageFactuAvoir.pPlistBoxMotifDAV.selectOption({label:sMotif});    
				})

				test('TextArea [OBSERVATIONS] = "' + sObservations + '"', async () => {
					await fonction.sendKeys(pageFactuAvoir.pPtextAreaObservations, sObservations, false, 'Observation'); 
					await fonction.wait(page, 250);    
				})

				//-----------------------------------------------------------------------------------------------------
				test('Button [AJOUTER] - Is Enabled', async () => {
					await expect(pageFactuAvoir.pPbuttonAjouter).toBeEnabled();     
				})

				test('Button [AJOUTER] - Click', async () => {
					await fonction.clickAndWait(pageFactuAvoir.pPbuttonAjouter, page);     
				})

				test('Tr [DEMANDE D\'AVOIR] = 1', async () => {
					expect(await pageFactuAvoir.pPTrDemandeAvoir.count()).toBe(1);     
				}) 

				test('Div [MESSAGE VALIDATION] #1 - Is Equal', async () => {
					expect(await pageFactuAvoir.pPDivMessageValidation.textContent()).toEqual(sMessageValid);     
				})

				//-----------------------------------------------------------------------------------------------------
				test('Button [ENVOYER] - Is Enabled', async () => {
					await expect(pageFactuAvoir.pPbuttonEnregistrer).toBeEnabled();     
				})

				test('Button [ENVOYER] #1 - Click', async () => {
					await fonction.clickAndWait(pageFactuAvoir.pPbuttonEnregistrer, page);     
				})

				test('Div [MESSAGE CONFIRMATION] #1 - Is Equal', async () => {
					expect(await pageFactuAvoir.pPDivMessageConfirmation.textContent()).toEqual(sMessageConfir);      
				})

				//-----------------------------------------------------------------------------------------------------
				test('A [ANNULER] - Click', async () => {
					await fonction.clickAndWait(pageFactuAvoir.pPAAnnuler, page);     
				})

				test('Div [MESSAGE VALIDATION] #2 - Is Equal', async () => {
					expect(await pageFactuAvoir.pPDivMessageValidation.textContent()).toEqual(sMessageValid);     
				})

				//-----------------------------------------------------------------------------------------------------
				test('Button [ENVOYER] #2 - Click', async () => {
					await fonction.clickAndWait(pageFactuAvoir.pPbuttonEnregistrer, page);     
				})

				test('Div [MESSAGE CONFIRMATION] #2 - Is Equal', async () => {
					expect(await pageFactuAvoir.pPDivMessageConfirmation.textContent()).toEqual(sMessageConfir);      
				})

				test('A [VALIDER] - Click', async () => {
					await fonction.clickAndWait(pageFactuAvoir.pPAValider, page);     
				})

				test('Popin [' + sNomPopin.toUpperCase() + '] - Is not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin, false);
				})
			})  // End Describe  

			test.describe ('DataGrid [LISTE DEMANDE D\'AVOIR]', async () => { 
				test('** Wait Until Spinner Off #1 **', async () => {
					await fonction.waitForSpinner(pageFactuAvoir.spinnerLoading, 180000);
				})

				test('Input [CODE ARTICLE] = "' + sCodeArticle + '"', async () => {
				   await fonction.sendKeys(pageFactuAvoir.pInputCodeArticle, sCodeArticle, false ,'Code article');
				   await fonction.waitForDomStable(page);
				}) 

				test('Tr [DEMANDE D\'AVOIR] >= 1', async () => {
				   expect(await pageFactuAvoir.pPTrListeDamandeAvoir.count()).toBeGreaterThanOrEqual(1);
				})     

				test('I [STATUT] = A valider', async () => {
				   await expect(pageFactuAvoir.pPTrListeDamandeAvoir.first().locator('td.center i.fa-question-circle')).toHaveAttribute('title','A valider');
				})
			}) 

			test('Button [CREER] #2 - Click', async () => {
				await fonction.clickAndWait(pageFactuAvoir.buttonCreer, page);
			})

			test.describe ('Popin [' + sNomPopin.toUpperCase() + '] #2', async () => {

				test('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 
	
				test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin, true);
				})

				test('Input [ARTICLE] = "' + sGroupeArticle + '"', async () => {
					await pageFactuAvoir.pPlistBoxGroupeArticle.selectOption({label: sGroupeArticle});  
				})

				test('Input [AUTOCOMPLETE][ARTICLE] = "' + sCodeArt + '"', async () => {
					var oData:AutoComplete = {
						libelle         :'CODE ARTICLE',
						inputLocator    : pageFactuAvoir.pPinputArticle,
						inputValue      : sCodeArt,
						choiceSelector  : 'li.gfit-autocomplete-result',
						choicePosition  : 0,
						typingDelay     : 100,
						waitBefore      : 500,
						page            : page,
					}
					await fonction.autoComplete(oData);
				})

				test('Span [DATE DE LIVRAISON] - Click', async () => {
					await fonction.clickAndWait(pageFactuAvoir.pPdatePickerLivraison.locator('span'), page);  
				})

				test('Input [DATE DE LIVRAISON] - Click', async () => {
					// On clique 4 fois pour revenir 4 mois en arrière et sélectionner le 10 du mois.
					const iToday = (parseInt(oData.sDateLivr.slice(0,2)) + 1);
					for(let i=0; i < 4; i++){
					  await fonction.clickAndWait(pageFactuAvoir.pPdatePickerDay.locator('th.prev'), page); 
					}
					  await fonction.clickElement(pageFactuAvoir.pPdatePickerDay.locator('td[class=day]:NOT(.new):text-is("'+iToday+'")')); 
				})

				test('Button [RECHERCHER UN BL DEFINITIF] - Click', async () => {
					await fonction.clickAndWait(pageFactuAvoir.pPbuttonRechercherBLDef, page);  
				})

				test('Input [TYPE] = "' + sType + '"', async () => {
					await pageFactuAvoir.pPlistBoxTypeDAV.selectOption({label:sType});     
				})

				test('Button [QUANTITE DEMANDEE] = "' + iQuantiteColis + '"', async () => {
					await fonction.sendKeys(pageFactuAvoir.pPinputQuantiteDemandee, iQuantiteColis, false, 'Quantité demandée');     
				})

				test('Input [POIDS REEL DEMANDE] = "' + iQuantite_UD + '"', async () => {
					if(await pageFactuAvoir.pPinputPoidReelDemandee.isVisible()){
						var iPoidsReel = parseFloat(iQuantite_UD.replace(',', '.').split()[0]);
					   await fonction.sendKeys(pageFactuAvoir.pPinputPoidReelDemandee, Math.ceil(iPoidsReel), false, 'Poids réeldemandé'); 
					}    
				})

				test('Button [MOTIF] = "' + sMotif + '"', async () => {
				   await pageFactuAvoir.pPlistBoxMotifDAV.selectOption({label:sMotif});    
				})

				test('TextArea [OBSERVATIONS] = "' + sObservations + '"', async () => {
					await fonction.sendKeys(pageFactuAvoir.pPtextAreaObservations, sObservations, false, 'Observation'); 
					await fonction.wait(page, 250);    
				})

				//-----------------------------------------------------------------------------------------------------

				test('Button [AJOUTER] - Click', async () => {
					await fonction.clickAndWait(pageFactuAvoir.pPbuttonAjouter, page);     
				})

				test('Div [MESSAGE ERROR] - Is Equal', async () => {
					expect(await pageFactuAvoir.pPDivMessageError.textContent()).toEqual(sMessageError);     
				})

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pageFactuAvoir.pPbuttonFermer);     
				})

				test('Popin [' + sNomPopin.toUpperCase() + '] - Is not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin, false);
				})
			})  // End Describe  
		})  // Onglet DEMANDE D'AVOIR
	}) // End describe Page

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

}) // End describe