/**
 * 
 * @author JOSIAS SIE
 *  Since 23 - 05 - 2025
 * 
 */

const xRefTest      = "STO_REF_CAC";
const xDescription  = "Créer un emplacement avec une catégorie";
const xIdTest       =  9737;
const xVersion      = '3.3';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'STOCK',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['plateforme','categorie','nomZone','nomAllee','usage'],
	fileName    : __filename
}

//----------------------------------------------------------------------------------------

import { expect, test, type Page} from '@playwright/test';

import { TestFunctions }          from "@helpers/functions";
import { Log }                    from "@helpers/log";
import { Help }                   from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }              from "@pom/STO/menu.page";
import { ReferentielEmplacements }from '@pom/STO/referentiel-emplacements.page';
import { CartoucheInfo }          from '@commun/types';

//----------------------------------------------------------------------------------------

let page             : Page;

let menu             : MenuStock;
let pageRefEmpl      : ReferentielEmplacements;

const log            = new Log();
const fonction       = new TestFunctions(log);

//----------------------------------------------------------------------------------------
var oData:any        = fonction.importJdd();

const plateforme     = fonction.getInitParam('plateforme', 'Cremlog');
var sCategorie       = fonction.getInitParam('categorie', 'Dynamique');
const sNomZone       = fonction.getInitParam('nomZone', 'Z1');
const sNomAllee      = fonction.getInitParam('nomAllee', 'A');
var   sUsage         = fonction.getInitParam('usage', 'Picking');

const sNomEmplacement= fonction.getLocalConfig('nomCategorieEmplacement');

const iLongueur      = 120;
const iLargeur       = 80;
const iHauteur       = 177;

if (oData !== undefined) {  // On est dans le cadre d'un E2E. Récupération des données temporaires
    sCategorie = oData.categorie; 
    log.set('E2E - catégorie : ' + sCategorie);
}

//----------------------------------------------------------------------------------------
process.env.ROLE     = 'RESPONSABLE LOGISTIQUE';// Connexion par défaut avec le profil ayant le Role RESPONSABLE LOGISTIQUE
//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage(); 
	menu                = new MenuStock(page, fonction);
	pageRefEmpl         = new ReferentielEmplacements(page);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

	test('Ouverture URL :' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test('Connexion', async () => {
		await fonction.connexion(page);
	})

	test('ListBox [PLATEFORME] = "' + plateforme + '"', async() => {            
		await menu.selectPlateforrme(page, plateforme);                       // Sélection d'une plateforme par défaut
	})

	test.describe('Page [REFERENTIEL]', async() => {    

		var currentPage:string = 'referentiel';
		test('Page [REFERENTIEL] - Click', async () => {
			await menu.click(currentPage, page);
		})
	   
		test.describe ('Onglet [EMPLACEMENTS]', async() => {        
			
			test('Onglet [EMPLACEMENTS] - Click', async () => {
				await menu.clickOnglet(currentPage, 'emplacements', page);
			})   

			test('InputField [ZONES] ="' + sNomZone + '"', async () => {
				await fonction.sendKeys(pageRefEmpl.inputFiedDesignation.nth(0),sNomZone, false, 'Zone');        
			})

			test('Tr [ZONES][' + sNomZone + '] - Click', async () => {
				var isVisible = await pageRefEmpl.trListeZoneAlleeEmplacement.nth(0).isVisible();
				if(isVisible){
					await fonction.wait(page,500);
					await fonction.clickAndWait(pageRefEmpl.trListeZoneAlleeEmplacement.nth(0), page);
				}          
			})

			test('Tr [EMPLACEMENTS] > 0', async () => {
				expect(await pageRefEmpl.trListeEmplacement.count()).toBeGreaterThan(0);     
			})

			test.describe ('*** [CREATION D\'UN EMPLACEMENT] ***', async () => {
				var sOrdreAffichage: string = '';
				var sNiveau        : string = '';

				test('Button [EMPLACEMENT] - Click', async () => {
					await pageRefEmpl.buttonEmplacements.hover({timeout:1000});        
					await fonction.clickAndWait(pageRefEmpl.buttonCreerEmplacemt, page);             
				})
	
				test.describe ('Popin [CREATION D\'UN EMPLACEMENT] ', async () => {
	
					test('Popin [CREATION D\'UN EMPLACEMENT] - Is Visible', async () => {
						await fonction.popinVisible(page, 'CREATION D\'UN EMPLACEMENT', true);
					})
	
					test.skip('InputField [USAGE] - Is Disabled', async () => {
						expect(pageRefEmpl.pDropdownUsage.locator('div.p-inputwrapper')).toBeDisabled(); 
					})

					test('InputField [ACTIF] - Is Activated', async () => {
						expect(pageRefEmpl.pInputActif.locator('div.p-inputswitch')).toBeEnabled();  
					})

					test('InputField [ALLEZ] = "' + sNomAllee + '"', async () => {
						await fonction.clickElement(pageRefEmpl.pPdropdownAllee);
						await fonction.clickElement(pageRefEmpl.pPdropdownZoneAlleeItems.locator('span:text-is("'+sNomAllee+'")'));
					})

					test('InputField [DESIGNATION] = "' + sNomEmplacement + '"', async () => {
						await fonction.sendKeys(pageRefEmpl.pInputEmplacement, sNomEmplacement, false, 'Emplacement');
						log.set('Nom de l\'emplacement : ' + sNomEmplacement);
					})

					test('Input [ORDRE D\'AFFICHAGE][first] - Click', async () => {
						await fonction.clickElement(pageRefEmpl.pDropdownOrdreAffichage.locator('button'));
						await fonction.clickAndWait(pageRefEmpl.pDropdownOrdreAffichItems.first(), page);
						sOrdreAffichage = await pageRefEmpl.pDropdownOrdreAffichage.locator('input').inputValue();
					})

					test('Button [ENREGISTRER] - Is Activated', async () => {
						await expect(pageRefEmpl.pButtonEnregistrer).toBeEnabled();
					})
		
					test('InputField [CATEGORIE] = "' + sCategorie + '"', async () => {
						await fonction.clickElement(pageRefEmpl.pDropdownCategorie);
						await fonction.sendKeys(pageRefEmpl.pInputCategorieUsage, sCategorie, false, 'Catégorie');
						await fonction.clickElement(pageRefEmpl.pLiCategorie);
					})

					test.describe ('Div [USAGE]', async () => {

						test('InputField [USAGE] = "'+  sUsage + '"', async () => {
							await fonction.clickAndWait(pageRefEmpl.pDropdownUsage, page);
							await fonction.sendKeys(pageRefEmpl.pInputCategorieUsage, sUsage, false, 'Usage');
							await fonction.clickElement(pageRefEmpl.pLiUsage);
						})

						test('InputField [USAGE] - Click', async () => {
							await fonction.clickElement(pageRefEmpl.pDropdownUsage); 
						})
						
						test('InputField [USAGE][PICKING] - Is Contain', async () => {
							expect(await pageRefEmpl.pLiUsage.locator('span').allTextContents()).toContain('Picking');  
						})

						test('InputField [USAGE][STOCKAGE] - Is Contain', async () => { 
							expect(await pageRefEmpl.pLiUsage.locator('span').allTextContents()).toContain('Stockage'); 
							await fonction.clickElement(pageRefEmpl.pDropdownUsage); 
						})
					})

					test.describe ('Div [DIMENSIONS]', async () => {
						test('InputField [LONGUEUR] = "' + iLongueur.toString() + '"', async () => {
							expect(await pageRefEmpl.pInputLongueur.inputValue()).toEqual(iLongueur.toString());  
						})

						test('InputField [LARGEUR] = "' + iLargeur.toString() + '"', async () => { 
							expect(await pageRefEmpl.pInputLargeur.inputValue()).toEqual(iLargeur.toString());   
						})

						test('InputField [HAUTEUR] = "' + iHauteur.toString() + '"', async () => {
							expect(await pageRefEmpl.pInputHauteur.inputValue()).toEqual(iHauteur.toString());  
						})
					})

					test('Input [NIVEAU][last] - Click', async () => {
						await fonction.clickElement(pageRefEmpl.pDropdownNiveau);
						await fonction.clickAndWait(pageRefEmpl.pPdropdownZoneAlleeItems.last(), page);
						sNiveau = await pageRefEmpl.pDropdownNiveau.locator('span').textContent();
					})

					test('Button [ENREGISTRER] - Click', async () => {
						await fonction.clickAndWait(pageRefEmpl.pButtonEnregistrer, page);
					})

					test('Popin [CREATION D\'UN EMPLACEMENT] - Is Not Visible', async () => {
						await fonction.popinVisible(page, 'CREATION D\'UN EMPLACEMENT', false);
					})
				}) 

				test.describe ('Div [EMPLACEMENTS]', async () => {
					test('Td [DESIGNATION EMPLACEMENT] = "' + sNomEmplacement + '"', async () => {
						await fonction.sendKeys(pageRefEmpl.inputFiedDesignation.nth(1), sNomEmplacement, false, 'Emplacement');
					})

					test('Span [DESIGNATION EMPLACEMENT] = "' + sNomEmplacement.trim() + '"', async () => {
						await fonction.waitForDomStable(page);
						var sLabel = await pageRefEmpl.trListeZoneAlleeEmplacement.locator('td.colonne-designation span').nth(1).textContent();
						expect(sLabel.trim()).toEqual(sNomEmplacement.trim());
					})

					test('Td [DESIGNATION ZONE] = "' + sNomZone.trim() + '"', async () => {
						var sLabel = await pageRefEmpl.trListeZoneAlleeEmplacement.locator('td.colonne-zone-designation span').textContent();
						expect(sLabel.trim()).toEqual(sNomZone.trim());
					})
					
					test('Td [ORDRE] = "' + sOrdreAffichage + '"', async () => {
						var sLabel = await pageRefEmpl.trListeZoneAlleeEmplacement.locator('td.colonne-ordreAffichage span').textContent();
						expect(sLabel.trim()).toEqual(sOrdreAffichage);
					})

					//---------------------------------------------------------------------------------------------------------------------------

					test('Td [DESIGNATION CATEGORIE] = "' + sCategorie + '"', async () => {
						var sLabel = await pageRefEmpl.trListeZoneAlleeEmplacement.locator('td.colonne-categorie-designation span').textContent();
						expect(sLabel.trim()).toEqual(sCategorie);
					})

					test('Td [NIVEAU] = "' + sNiveau + '"', async () => {
						var sLabel = await pageRefEmpl.trListeZoneAlleeEmplacement.locator('td.colonne-niveau span').textContent();
						expect(sLabel.trim()).toEqual(sNiveau);
					})
				})
			})
		})  //-- End Describe Onglet
	})  //-- End Describe Page

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})