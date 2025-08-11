/**
 *
 * @author JOSIAS SIE
 * @since 2025-07-01
 *
 */
 
const xRefTest      = "PRE_PRE_TPC";
const xDescription  = "Terminer une préparation de type feuille ou liste  en cours";
const xIdTest       =  10029;
const xVersion      = '3.0';
 
var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'PREPARATION',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['plateforme','codePreparateur','nom'],
	fileName    : __filename
}

//------------------------------------------------------------------------------------
import { expect, test, type Page }      from '@playwright/test';
 
import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';
 
import { MenuPreparation }              from '@pom/PRE/menu.page';
 
import { CartoucheInfo }                from '@commun/types';
import { ProdGestionPreparateursPage }  from '@pom/PRE/preparateur.page';
import { SuiviEclatfeuilleEnCoursPage } from '@pom/PRE/eclatement-feuilles_en_cours.page';
import { SuiviPickListesEnCours }       from '@pom/PRE/picking-listes_en_cours.page';
//------------------------------------------------------------------------------------
 
let page                           : Page;
let menu                           : MenuPreparation;
let pagePreparateur                : ProdGestionPreparateursPage;
let pageSuiviEclatfeuilleEnCours   : SuiviEclatfeuilleEnCoursPage;
let pagePickingEnCours             : SuiviPickListesEnCours;
//------------------------------------------------------------------------------------
 
const log                           = new Log();
const fonction                      = new TestFunctions(log);
 
//------------------------------------------------------------------------------------
var oData:any                       = fonction.importJdd(); //Import du JDD pour le bout en bout
//------------------------------------------------------------------------------------
var sPlateforme                     = fonction.getInitParam('plateforme', fonction.getLocalConfig('plateforme'));
var sCodePreparateur                = fonction.getInitParam('codePreparateur',fonction.getLocalConfig('codePreparateur'));
var sNomPreparateur                 = fonction.getInitParam('nom',fonction.getLocalConfig('designationPreparateur'));
 
const sStatutFeuillePrepare: string = 'Préparé';
const sEmplacement         : string = "03";
 
let sCodePreparationEnCours:string  = "";
//------------------------------------------------------------------------------------
if(oData !== undefined) {    
	sCodePreparateur = oData.sCodePreparateur       // On est dans le cadre d'un E2E. Récupération des données temporaires
}
// ------------------------------------------------------------------------------------
test.beforeAll(async ({ browser }, testInfo) => {
	page                        = await browser.newPage();
	menu                        = new MenuPreparation(page, fonction);
	pagePreparateur             = new ProdGestionPreparateursPage(page);
	pageSuiviEclatfeuilleEnCours= new SuiviEclatfeuilleEnCoursPage(page);
	pagePickingEnCours          = new SuiviPickListesEnCours(page);
	const helper                = new Help(info, testInfo, page);
	await helper.init();
})
 
test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})
//------------------------------------------------------------------------------------
test.describe.serial ('[' + xRefTest + ']', () => {
 
	test('Ouverture URL : ' + fonction.getApplicationUrl(), async () => {
		await fonction.openUrl(page);
	})
 
	test('Connexion', async ({ context }) => {
		await context.clearCookies();
		await fonction.connexion(page);
	})

	test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {
		await menu.selectPlateforme(sPlateforme, page);
		log.set('Plateforme : ' + sPlateforme);
	})
 
	test.describe ('Page [SUIVI ECLATEMENT]', async () => {
 
		var sCurrentPage:string = 'eclatement';
 
		test ('Menu [SUIVI ECLATEMENT] - Click', async () => {
			await menu.click(sCurrentPage, page);
		})
 
		test.describe ('Onglet [FEUILLES EN COURS]',  async () => {
 
			test('Onglet [FEUILLES EN COURS] - Click',  async () => {
				await menu.clickOnglet(sCurrentPage, 'feuillesEnCours', page);
			})
		   
			test('Label [ERROR] -  Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			})
									   
			test('InputField [PREPARATEUR] = "' + sNomPreparateur + '"', async () => {
				await fonction.sendKeys(pageSuiviEclatfeuilleEnCours.inputSearchAll, sNomPreparateur, false, 'Nom préparateur');
				await page.keyboard.press('Enter'); // Je simule le bouton "Entrer" du clavier
				await fonction.waitForDomStable(page);
			})
 
			test('Tr [FEUILLES EN COURS] > 0', async () => {
				if(await pageSuiviEclatfeuilleEnCours.dataTableFeuillesEnCours.count() > 0 ){
				   await fonction.clickAndWait(pageSuiviEclatfeuilleEnCours.dataTableFeuillesEnCours, page);
				   sCodePreparationEnCours = await pageSuiviEclatfeuilleEnCours.dataTableFeuillesEnCours.locator('td.datagrid-numeroSupportPrepa span').textContent();
				}
			})
		}) // End test.describe Onglet
	}) // Fin onglet describe
 
	test.describe ('Page [SUIVI PICKING]', async () => {
 
		var sCurrentPage: string = 'picking';
 
		test('Menu [SUIVI PICKING] - Click', async () => {
			await menu.click(sCurrentPage, page);
		})
 
		test.describe ('Onglet [LISTES EN COURS]', async () => {
 
			test('Onglet [LISTES EN COURS] - Click', async () => {
				await menu.clickOnglet(sCurrentPage, 'listesEnCours', page);
			})
 
			test('Label [ERROR] -  Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			})
 
			test('InputField [PREPARATEUR] = "' + sNomPreparateur + '"', async () => {
				await fonction.sendKeys(pagePickingEnCours.inputSearchPreparateur, sNomPreparateur, false, 'Nom préparateur');
				await page.keyboard.press('Enter'); // Je simule le bouton "Entrer" du clavier
				await fonction.waitForDomStable(page);
			})
 
			test('Tr [LISTES EN COURS] > 0', async () => {
				if (await pagePickingEnCours.dataGridListesEnCours.count() > 0) {
					await fonction.clickAndWait(pagePickingEnCours.dataGridListesEnCours, page);
					sCodePreparationEnCours = `A${await pagePickingEnCours.dataGridListesEnCours.locator('td.datagrid-numeroSupportPrepa span').textContent()}`;
				}
			})
		}) // End test.describe Onglet
	}) // Fin onglet describe

	test.describe('Page [SCAN BADGE]', async () => {
		var sPageName: string = 'menubadge';             /** La page SCAN D'UN BADGE pointe vers  sur un autre onglet du NAVIGATEUR  */
		test("Menu [SCAN BADGE] - Click", async () => { //Je passe  à un autre onglet (page scan d'un badge) du NAGIVATEUR
			const [newPage] = await Promise.all([
				page.context().waitForEvent('page'),
				menu.click(sPageName, page)
			])
 
			await newPage.waitForLoadState();
			page            = newPage;
			pagePreparateur = new ProdGestionPreparateursPage(page);
		})
  
		test('InputField [CODE PREPARATEUR] = "' + sCodePreparateur + '"', async () => {
			test.skip(!sCodePreparationEnCours || sCodePreparationEnCours === "");
			await fonction.sendKeys(pagePreparateur.inputCodeIdentification, sCodePreparateur, false, 'Matricule Preparateur');
		})
 
		test('Key [ENTER #1] - Press', async () => {
			test.skip(!sCodePreparationEnCours || sCodePreparationEnCours === "");
			await page.keyboard.press('Enter');      // Je simule le bouton "Entrer" du clavier
			await fonction.waitForDomStable(page);
		})
 
		//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		test.describe ('TERMINE UNE PREPARATION EN COURS', async () => {
			
			test('Input [SUPPORT PREPARATION] = "' + sCodePreparationEnCours + '"', async () => {
				test.skip(!sCodePreparationEnCours || sCodePreparationEnCours === "");
				await fonction.sendKeys(pagePreparateur.inputNumeroSupport, sCodePreparationEnCours.toString(), false, 'Code Feuille');
			})

			test('Key [ENTER #2] - Press', async () => {
				test.skip(!sCodePreparationEnCours || sCodePreparationEnCours === "");
				await page.keyboard.press('Enter');         // Je simule le bouton "Entrer" du clavier
				await fonction.waitForDomStable(page);
			})

			test('** Wait Until Spinner Off 1 **', async () => {
				await fonction.waitForSpinner(pagePreparateur.spinner, 18000);
			})

			test('Input [EMPLACEMENT] = "' + sEmplacement + '"', async () => {                     /** Pour certains articles le stock de fin n'est pas egal 0, du coup un champ d'emplacement est affiché */
				if (await pagePreparateur.InputEmplacement.isVisible()) {
					await fonction.sendKeys(pagePreparateur.InputEmplacement, sEmplacement, false, 'Emplacement');
					await fonction.clickAndWait(pagePreparateur.emplacementItem.first(),page);
				} else {
					test.skip();
				}
			})

			test('Button [VALIDER] - Click', async () => {                                      // Je clic sur le bouton "Valider" s'il est affiché sinon je saute l'execution
				if (await pagePreparateur.InputEmplacement.isVisible()) {
					await fonction.clickAndWait(pagePreparateur.buttonValider, page)
				} else {
					test.skip();
				}
			})

			test('** Wait Until Spinner Off  2 **', async () => {
				await fonction.waitForSpinner(pagePreparateur.spinner.first(), 18000);
			})

			test('Td [STATUT PREPARATION] = "' + sStatutFeuillePrepare + '"', async () => {  
				test.skip(!sCodePreparationEnCours || sCodePreparationEnCours === "");
				expect(await pagePreparateur.datgridTdStatut.textContent()).toBe(sStatutFeuillePrepare);
			})
		
			test.describe ('Popup [MODIFICATION DE LA PREPARATION]', async () => { // Si la popup d'erreur s'affiche on clique sur retour sinon on  saute l'execution de l'etape
				test('Button [RETOUR] - Click', async () => {
					if (await pagePreparateur.pPbuttonErrMatriculeRetour.isVisible()) {
						await fonction.clickAndWait(pagePreparateur.pPbuttonErrMatriculeRetour, page);
					}else{
						test.skip();
					}
				})
			}) // Fin onglet describe
		})
	})  // Fin onglet describe
	/** Pas de bouton de déconnexion pour la page de scan Pour SIGALE PREPARATION  */
})