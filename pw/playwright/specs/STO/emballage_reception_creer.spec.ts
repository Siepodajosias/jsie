/**
 * @author  Josias SIE
 * @since   21-06-2024
 * 
 */
const xRefTest      = "STO_EMB_REC";  
const xDescription  = "Réceptionner des emballages magasin";
const xIdTest       =  9259;
const xVersion      = '3.6'; 
  
var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'STOCK',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,  
	help        : [],        
	params      : ['plateForme','chauffeur','expediteur','numeroBl','transporteur', 'receptionnaire'],
	fileName    : __filename
}
   
//------------------------------------------------------------------------------------

import { test, type Page, expect }     from '@playwright/test';
import { Help }                        from '@helpers/helpers';
import { TestFunctions }               from '@helpers/functions';
import { Log }                         from '@helpers/log';
import { CartoucheInfo }               from '@commun/types';
//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                   from '@pom/STO/menu.page'; 
import { ReceptionEmballageMagasin   } from '@pom/STO/reception-emballage_magasin.page';
import {EmballageMouvementsEmballages} from '@pom/STO/emballage-mouvements_emballages.page';
import { Credential }                  from '@conf/credential.conf';
import { Authentificationpage }        from '@pom/COMMUN/authentification.page';

//------------------------------------------------------------------------------------

let page                  : Page;
let menu                  : MenuStock;
let pageEmballage         : ReceptionEmballageMagasin;
let pageEmballageMouv     : EmballageMouvementsEmballages;
let pageObjectAuth        : Authentificationpage;
const log                 = new Log();
const fonction            = new TestFunctions(log);

// Exploitation des paramètres passés dans le JDD E2E -OU- passés en argument OU ceux présents dans le fichier de configuration Local

fonction.importJdd();

const sPlateforme         = fonction.getInitParam('plateForme', 'Chaponnay');
const sChauffeur          = fonction.getInitParam('chauffeur', 'TA_chauffeur'); 
const sExpediteur         = fonction.getInitParam('expediteur','ALS Fresh Food');
const sTransporteur       = fonction.getInitParam('transporteur', 'ALS Fresh Food');
const sNumeroBl           = fonction.getInitParam('numeroBl','TA_numeroBl');
const sReceptionnaire     = fonction.getInitParam('receptionnaire','TA_réceptionnaire');

//------------------------------------------------------------------------------------
var sStatut               = 'En cours';

var oData = {
	sChauffeur     : '',
	sExpediteur    : '',
	sTransporteur  : '',
	sNumeroBl      : '',
	sReceptionnaire: ''
}

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	 page                 = await browser.newPage();
	 pageObjectAuth       = new Authentificationpage(page);
	 menu                 = new MenuStock(page, fonction);
	 pageEmballage        = new ReceptionEmballageMagasin(page);
	 pageEmballageMouv    = new EmballageMouvementsEmballages(page);
	 const helper         = new Help(info, testInfo, page);
	 await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})
  
//------------------------------------------------------------------------------------

const sProfilGestionnaireEmb= 'jcc-recette5';// profil Gestionnaire d'emballage
const sProfilReceptionnaire = 'veste';       // profil réceptionnaire

//------------------------------------------------------------------------------------
test.describe.serial('[' + xRefTest + ']', async () => {  
	
	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();		
		await fonction.openUrl(page);
	})

	test('Connexion (gestionnaie emballage)', async () => {
		const userCredential= new Credential(sProfilGestionnaireEmb);
		var profilData      = userCredential.getData();

		await pageObjectAuth.setJUsername(sProfilGestionnaireEmb);
		await pageObjectAuth.setJPassword(profilData.password);
		await pageObjectAuth.clickConnexionButton(page);

		await fonction.addDataSheet('Profil', 'Login' , sProfilGestionnaireEmb);
	}) // end describe

	test.describe('Page [EMBALLAGE][GESTIONNAIRE EMBALLAGE]', async () => {

		var sNomPage:string = 'emballage';
		test ('Page [EMBALLAGE] - Click', async () => {
			await menu.click(sNomPage, page);
		}) 

		test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {                    
			await menu.selectPlateforrme(page, sPlateforme);
		})

		test.describe('Onglet [RECEPTION]', async () => {
			
			test('Button [CREER] - Click', async () => {
				await fonction.clickAndWait(pageEmballage.buttonCreer, page);
			})

			test('** Wait Until Spinner Off **', async () => {
				await fonction.waitForSpinner(pageEmballageMouv.spinnerMvtEmballage);
			})

			test.describe('Popin [CREATION D\'UNE RECEPTION D\'EMBALLAGE] ', () => {

				test('Input [CHAUFFEUR] = "' + sChauffeur + '"', async () => {
					await fonction.sendKeys(pageEmballage.pInputChauffeur, sChauffeur, false, 'Chauffeur');
				})

				test('InputField [AUTOCOMPLETE][EXPEDITEUR] = "' + sExpediteur + '"',async () => {
					var isVisible: boolean  = await pageEmballage.pAutocompleteExpediteur.isVisible();
					if(isVisible){
						const oData = {
							libelle         :'EXPEDITEUR',
							inputLocator    : pageEmballage.pAutocompleteExpediteur,
							inputValue      : sExpediteur,
							choiceSelector  : '.TRANSPORTEUR.dropdown-item-container ngb-highlight',
							choicePosition  : 1,
							typingDelay     : 150,
							waitBefore      : 700,
							page            : page
						}
						await fonction.autoComplete(oData);
					}
					oData.sExpediteur = sExpediteur;
				})  

				test('Autocomplete [TRANSPORTEUR] = "' + sTransporteur + '"', async () => {
					var isEditable = await pageEmballage.pAutocompleteTransporteur.isEditable();
					if(isEditable){
						await fonction.sendKeys(pageEmballage.pAutocompleteTransporteur, sTransporteur, false, 'Transporteur');
					}
					oData.sTransporteur = sTransporteur;
				})

				test('Input [NUMERO BL] = "' + sNumeroBl + '"', async () => {
					await fonction.sendKeys(pageEmballage.pInputNumeroBl, sNumeroBl, false, 'Numéro BL');
					oData.sNumeroBl = sNumeroBl;
				})

				test('Input [RECEPTIONNAIRE] = "' + sReceptionnaire + '"', async () => {
					await fonction.sendKeys(pageEmballage.pInputReceptionnaire, sReceptionnaire, false, 'Gestionnaire');
				})

				test('Button [TYPE D\'EMBALLAGE][QUANTITE] - Click ', async () => {
					await fonction.clickElement(pageEmballage.pButtonQuantite.nth(0));
				})

				test('Button [ENREGISTRER] - Click', async () => {
					await fonction.clickAndWait(pageEmballage.pButtonEnregistrer, page);
				})
			})

			test.describe('Datagrid [RECEPTION EMBALLAGE]', async () => {

				test('Input [FILTRE][NUMERO BL] = "' + sNumeroBl + '"', async () => {
					await fonction.sendKeys(pageEmballage.tdFiltreNumeroBl, sNumeroBl, false, 'Num BL');
					await fonction.wait(page,350);
				})

				test('Input [FILTRE][RECEPTIONNAIRE] = "' + sReceptionnaire + '"', async () => {
					await fonction.sendKeys(pageEmballage.tdFiltreReceptionnaire, sReceptionnaire, false, 'Receptionnaire');
					await fonction.wait(page,350);
				})

				test('Td [STATUT] = "' + sStatut + '"', async () => {
					const statut  = await pageEmballage.spanStatutReception.textContent();
					expect(statut).toContain(sStatut);
				})
			})
		})
	})

	test('Déconnexion (gestionnaie emballage)', async () => {
		await fonction.deconnexion(page);
	})

	//------------------------------------------------------------------------------------------------------------------------------------------

	test ('Connexion (réceptionnaire)', async () => {
		const userCredential= new Credential(sProfilReceptionnaire);
		var profilData      = userCredential.getData();

		await pageObjectAuth.setJUsername(sProfilReceptionnaire);
		await pageObjectAuth.setJPassword(profilData.password);
		await pageObjectAuth.clickConnexionButton(page);

		await fonction.addDataSheet('Profil', 'Login' , sProfilReceptionnaire);

	}) // end describe

	test.describe('Page [EMBALLAGE][RECEPTIONNAIRE]', async () => {

		var sNomPage:string = 'emballage';
		test ('Page [EMBALLAGE] - Click', async () => {
			await menu.click(sNomPage, page);
		}) 

		test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {                    
			await menu.selectPlateforrme(page, sPlateforme);
		})
		
		test.describe('Onglet [RECEPTION]', async () => {

			test.describe('Datagrid [RECEPTION EMBALLAGE]', async () => {

				test('Input [FILTRE][NUMERO BL] = "' + sNumeroBl + '"', async () => {
					await fonction.sendKeys(pageEmballage.tdFiltreNumeroBl, sNumeroBl, false, 'Num BL');
					await fonction.wait(page,350);
				})

				test('Input [FILTRE][RECEPTIONNAIRE] = "' + sReceptionnaire + '"', async () => {
					await fonction.sendKeys(pageEmballage.tdFiltreReceptionnaire, sReceptionnaire, false, 'Receptionnaire');
					await fonction.wait(page,350);
				})

				test('Tr [RECEPTION] - Click', async () => {
					var isPresent = await pageEmballage.checkboxListeReception.first().isVisible();
					if(isPresent){
					   await fonction.clickElement(pageEmballage.checkboxListeReception.first());
					}
				})
                       
				test('Button [MODIFIER] - Click', async () => {
					await fonction.wait(page,350);
					var isActive = await pageEmballage.buttonModfier.isEnabled();
					if(isActive){
					   await fonction.clickAndWait(pageEmballage.buttonModfier, page);
					}
				})
			})
			
			var sChauffeurModifier:string = sChauffeur +'. '+ fonction.getToday('FR');
			var sReceptionnaireModifier:string = sReceptionnaire +'. '+ fonction.getToday('FR');

			test.describe('Popin [MODIFICATION D\'UNE RECEPTION D\'EMBALLAGE] ', () => {
				
				test('Input [CHAUFFEUR] = "' + sChauffeurModifier + '"', async () => {
					await fonction.sendKeys(pageEmballage.pInputChauffeur, sChauffeurModifier, false, 'Chauffeur');
					oData.sChauffeur = sChauffeurModifier;
				})

				test('Input [RECEPTIONNAIRE] = "' + sReceptionnaireModifier + '"', async () => {
					await fonction.sendKeys(pageEmballage.pInputReceptionnaire, sReceptionnaireModifier, false, 'Receptionnaire');
					oData.sReceptionnaire = sReceptionnaireModifier;
				})

				test('Button [TERMINER] - Click', async () => {
					await fonction.wait(page,250);
					await fonction.clickAndWait(pageEmballage.pButtonTerminer, page);
				})
			})

			test.describe('Datagrid [RECEPTION D\'EMBALLAGE]', async () => {

				test('Input [FILTRE][NUMERO BL] = "' + sNumeroBl + '"', async () => {
					await fonction.sendKeys(pageEmballage.tdFiltreNumeroBl, sNumeroBl, false, "Num BL");
					await fonction.wait(page,350);
				})

				test('Input [FILTRE][RECEPTIONNAIRE] = "' + sReceptionnaireModifier + '"', async () => {
					await fonction.sendKeys(pageEmballage.tdFiltreReceptionnaire, sReceptionnaireModifier, false, 'Réceptionnaire');
					await fonction.wait(page,350);
				})

				test('Td [STATUT] = " Terminé "', async () => {
					sStatut       = 'Terminé';
					const statut  = await pageEmballage.spanStatutReception.textContent();
					expect(statut).toContain(sStatut);
				})

				test.describe('Div [SECTION]', async () => {

					test('CheckBox [RECEPTION] - Click', async () => {
						var isPresent = await pageEmballage.checkboxListeReception.first().isVisible();
						if(isPresent){
						   await fonction.clickElement(pageEmballage.checkboxListeReception.first(), page);
						}
					})
	
					test('Button [VISUALISER] - Click', async () => {
						await fonction.wait(page,250);
						await fonction.noHtmlInNewTab(page, pageEmballage.buttonVisualiser);
					})
	
					test('Button [IMPRIMER] - Click', async () => {
						await fonction.wait(page,250);
						await fonction.clickElement(pageEmballage.buttonImprimer);
					})
				})
			})
		})

		test.describe('Onglet [MOUVEMENTS DES EMBALLAGES]', async () => {

			test ('Onglet [MOUVEMENTS DES EMBALLAGES] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'mouvementsEmballages', page);        
			}) 

			test('** Wait Until Spinner Off **', async () => {
				await fonction.waitForSpinner(pageEmballageMouv.spinnerMvtEmballage);
			})

			test.describe('Datagrid [MOUVEMENTS]', async () => {

				test('Input [FILTRE][MOUVEMENTS] = "' + sReceptionnaire + '"', async () => {
					await fonction.clickElement(pageEmballageMouv.multiSelectMouvement, sReceptionnaire);
					await fonction.wait(page,250);

					var sMuvement        = 'Réception emballage';
					var isClickableCible = await pageEmballageMouv.multiSelectItem.first().isEnabled();
					if(isClickableCible){
						//On sélectionne le choix cible selon son libellé
						await fonction.clickAndWait(pageEmballageMouv.multiSelectItem.locator('span:text-is("'+sMuvement+'")'), page);
					}else{
						log.set('Choix absent');
					}
				})

				test('Input [FILTRE][NUMERO BL] = "' + sNumeroBl + '"', async () => {
					await fonction.sendKeys(pageEmballageMouv.inputFiltreNumeroBL.locator('input'), sNumeroBl, false, 'Num BL');
					await fonction.wait(page,250);
				})

				test('Input [FILTRE][TRANSPORTEUR] = "' + sTransporteur + '"', async () => {
					await fonction.sendKeys(pageEmballageMouv.inputFiltreTransporteur.locator('input'), sTransporteur, false, 'Transporteur');
					await fonction.wait(page,250);
				})

				test('Td [NUMERO BL] = "' + sNumeroBl + '"', async () => {
					const numeroBl   = await pageEmballageMouv.spanNumeroBl.textContent();
					expect(numeroBl).toContain(sNumeroBl);
				})

				test('Td [TRANSPORTEUR] = "' + sTransporteur + '"', async () => {
					await fonction.wait(page,250);
					const transporteur  = await pageEmballageMouv.spanTransporteur.textContent();
					expect(transporteur).toContain(sTransporteur);
				})
			})
		})
		await fonction.writeData(oData);
	})

	test('Déconnexion (réceptionnaire)', async () => {
		await fonction.deconnexion(page);
	})// end describe
	
}) 