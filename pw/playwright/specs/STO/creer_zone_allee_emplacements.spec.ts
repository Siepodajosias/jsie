/**
 * 
 * @author Vazoumana DIARRASSOUBA & JOSIAS SIE
 *  Since 20 - 11 - 2023
 * 
 */

const xRefTest      = "STO_REF_ZAE";
const xDescription  = "Création d'une nouvelle Zone ou/et d'une Allée, ou/et d'un nouvel Emplacement";
const xIdTest       =  1681;
const xVersion      = '3.4';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'STOCK',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['plateforme'],
	fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { expect, test, type Page} from '@playwright/test';

import { TestFunctions }          from "@helpers/functions";
import { EsbFunctions }           from "@helpers/esb";
import { Log }                    from "@helpers/log";
import { Help }                   from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }              from "@pom/STO/menu.page";
import { ReferentielEmplacements }from '@pom/STO/referentiel-emplacements.page';
import { CartoucheInfo, TypeEsb } from '@commun/types';

//----------------------------------------------------------------------------------------

let page             : Page;

let menu             : MenuStock;
let pageRefEmpl      : ReferentielEmplacements;

let esb              : EsbFunctions;
const log            = new Log();
const fonction       = new TestFunctions(log);

//----------------------------------------------------------------------------------------
const plateforme     = fonction.getInitParam('plateforme', 'Chaponnay');

const sNomZone       = fonction.getLocalConfig('nomZone');
const sNomAllee      = fonction.getLocalConfig('nomAllee');
const sNomEmplacement= fonction.getLocalConfig('nomEmplacement');
//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	esb                 = new EsbFunctions(fonction);
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
	   
		test.describe('Onglet [EMPLACEMENTS]', async() => {        
			
			test('Onglet [EMPLACEMENTS] - Click', async () => {
				await menu.clickOnglet(currentPage, 'emplacements', page);
			})   

			test.describe ('*** [CREATION D\'UNE ZONE] ***',  async() => {

				test('Button [ZONES] - Click', async () => {
					await pageRefEmpl.buttonZones.hover({timeout:1000});        
					await fonction.clickElement(pageRefEmpl.buttonCreerZone);             
				})
	
				test.describe ('Popin [CREATION D\'UNE ZONE] ', async() => {
	
					test('Popin [CREATION D\'UNE ZONE - Is Visible] - Is Visible - Check', async () => {
						await fonction.popinVisible(page, 'CREATION D\'UNE ZONE', true);
					})
	
					test('InputField [DESIGNATION] = "' + sNomZone + '"', async () => {
						await fonction.sendKeys(pageRefEmpl.pInputDesignation, sNomZone, false, 'Zone');
						log.set('Nom de la zone : ' + sNomZone);
					})
	
					test('Button [ENREGISTRER] - Click', async () => {
						await fonction.clickAndWait(pageRefEmpl.pButtonEnregistrer, page)
					})
	
					test('Popin [CREATION D\'UNE ZONE - Is Visible] - Is Not Visible - Check', async () => {
						await fonction.popinVisible(page, 'CREATION D\'UNE ZONE', false);
					})                
				}) 

				test('Td [DESIGNATION ZONE] = "' + sNomZone + '"', async () => {
					await fonction.sendKeys(pageRefEmpl.inputFiedDesignation.nth(0), sNomZone, false, 'Zone');
				})

				test('Td [DESIGNATION ZONE] - Check', async () => {
					await fonction.wait(page,500);
					var sLabel = await pageRefEmpl.trListeZoneAlleeEmplacement.locator('td.colonne-designation span').nth(0).textContent();
					expect(sLabel.trim()).toEqual(sNomZone.trim());
					await fonction.clickAndWait(pageRefEmpl.trListeZoneAlleeEmplacement.nth(0), page);
				})
			}) 

			test.describe ('*** [CREATION D\'UNE ALLEE] ***', async () => {
				
				test('Button [ALLEE] - Click', async () => {
					await pageRefEmpl.buttonAllees.hover({timeout:1000});        
					await fonction.clickElement(pageRefEmpl.buttonCreerAllee);             
				})
	
				test.describe ('Popin [CREATION D\'UNE ALLEE] ', async () => {
	
					test('Popin [CREATION D\'UNE ALLEE - Is Visible] - Is Visible - Check', async () => {
						await fonction.popinVisible(page, 'CREATION D\'UNE ALLEE - Is Visible', true);
					})
	
					test('InputField [DESIGNATION] = "' + sNomAllee + '"', async () => {
						await fonction.sendKeys(pageRefEmpl.pInputDesignationAllee, sNomAllee, false, 'Allée');
						log.set('Nom de l\allée : ' + sNomAllee);
					})
	
					test('Button [ENREGISTRER] - Click', async () => {
						await fonction.clickAndWait(pageRefEmpl.pButtonEnregistrer, page)
					})
	
					test('Popin [CREATION D\'UNE ALLEE - Is Visible] - Is Not Visible - Check', async () => {
						await fonction.popinVisible(page, 'CREATION D\'UNE ALLEE - Is Visible', false);
					})                
				}) 

				test('Td [DESIGNATION ALLEE] = "' + sNomAllee + '"', async () => {
					await fonction.sendKeys(pageRefEmpl.inputFiedDesignation.nth(2), sNomAllee, false, 'Allée');
				})

				test('Td [DESIGNATION ALLEE] - Check', async () => {
					await fonction.wait(page,500);
					var sLabel = await pageRefEmpl.trListeZoneAlleeEmplacement.locator('td.colonne-designation').nth(1).textContent();
					expect(sLabel.trim()).toEqual(sNomAllee.trim());
				})
			})

			test.describe ('*** [CREATION D\'UN EMPLACEMENT] ***', async () => {
				
				test('Button [EMPLACEMENT] - Click', async () => {
					await pageRefEmpl.buttonEmplacements.hover({timeout:1000});        
					await fonction.clickAndWait(pageRefEmpl.buttonCreerEmplacemt, page);             
				})
	
				test.describe ('Popin [CREATION D\'UN EMPLACEMENT] ', async () => {
	
					test('Popin [CREATION D\'UN EMPLACEMENT - Is Visible] - Is Visible - Check', async () => {
						await fonction.popinVisible(page, 'CREATION D\'UN EMPLACEMENT - Is Visible', true);
					})
	
					test('Svg [CLEAR] - Click', async () => {
						await fonction.clickElement(pageRefEmpl.pSvgClear);
					})

					test('InputField [ZONE] = "' + sNomZone + '"', async () => {
						await fonction.clickElement(pageRefEmpl.pPdropdownZone);
						await fonction.clickElement(pageRefEmpl.pPdropdownZoneAlleeItems.locator('span:text-is("'+sNomZone+'")'));
					})

					test('InputField [DESIGNATION] = "' + sNomEmplacement + '"', async () => {
						await fonction.sendKeys(pageRefEmpl.pInputEmplacement, sNomEmplacement, false, 'Emplacement');
						log.set('Nom de l\'emplacement : ' + sNomEmplacement);
					})

					test('Autocomplete [ORDRE D\'AFFICHAGE][first]', async () => {
						await fonction.clickElement(pageRefEmpl.pDropdownOrdreAffichage.locator('button'));
						await fonction.clickElement(pageRefEmpl.pDropdownOrdreAffichItems.first());
					})
	
					test('Button [ENREGISTRER] - Click', async () => {
						await fonction.clickAndWait(pageRefEmpl.pButtonEnregistrer, page)
					})
	
					test('Popin [CREATION D\'UN EMPLACEMENT - Is Visible] - Is Not Visible - Check', async () => {
						await fonction.popinVisible(page, 'CREATION D\'UN EMPLACEMENT - Is Visible', false);
					})
					
					test('Td [DESIGNATION EMPLACEMENT] = "' + sNomEmplacement + '"', async () => {
						await fonction.sendKeys(pageRefEmpl.inputFiedDesignation.nth(1), sNomEmplacement, false, 'Emplacement');
					})

					test('Td [DESIGNATION EMPLACEMENT] - Check', async () => {
						await fonction.wait(page,500);
						var sLabel = await pageRefEmpl.trListeZoneAlleeEmplacement.locator('td.colonne-designation span').nth(1).textContent();
						expect(sLabel.trim()).toEqual(sNomEmplacement.trim());
					})

					test('Td [DESIGNATION ZONE] - Check', async () => {
						var sLabel = await pageRefEmpl.trListeZoneAlleeEmplacement.locator('td.colonne-zone-designation span').textContent();
						expect(sLabel.trim()).toEqual(sNomZone.trim());
					})
				}) 
			})

		})  //-- End Describe Onglet

	})  //-- End Describe Page

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

	test ('** CHECK FLUX **', async () =>  {
		const oFlux:TypeEsb = { 
			"FLUX" : [
				{
					NOM_FLUX    : "EnvoyerZonePlateforme_Prepa",
					STOP_ON_FAILURE  : false
				},
				{
					NOM_FLUX    : "EnvoyerAlleeStockage_Prepa",
					STOP_ON_FAILURE  : false
				},
				{
					NOM_FLUX    : "EnvoyerEmplacementStockage_Prepa",
					STOP_ON_FAILURE  : false
				}
			],
			WAIT_BEFORE     : 15000, // Optionnel
			STOP_ON_FAILURE : false
		}
		await esb.checkFlux(oFlux, page);
	})
})