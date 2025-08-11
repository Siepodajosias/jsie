/**
 * 
 * @author JOSIAS SIE
 *  Since 22 - 11 - 2024
 * 
 */

const xRefTest      = "STO_REF_CRE";
const xDescription  = "Modification d'une Zone ou/et d'une Allée, ou/et d'un nouvel Emplacement";
const xIdTest       =  1697;
const xVersion      = '3.4.1';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'STOCK',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['plateforme'],
	fileName    : __filename
}

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

let page             	: Page;

let menu             	: MenuStock;
let pageRefEmpl      	: ReferentielEmplacements;

let esb              	: EsbFunctions;
const log            	= new Log();
const fonction      	= new TestFunctions(log);

//----------------------------------------------------------------------------------------
const plateforme     	= fonction.getInitParam('plateforme', 'Chaponnay');

const sNomZone       	= fonction.getLocalConfig('nomZone');
const sNomAllee      	= fonction.getLocalConfig('nomAllee');
const sNomEmplacement	= fonction.getLocalConfig('nomEmplacement');
const sNomZoneModifier  = fonction.getLocalConfig('nomZoneModifier');
const sNomAlleeModifier = fonction.getLocalConfig('nomAlleeModifier');
const iCapacite         = 7;

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

	test ('Ouverture URL :' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test ('Connexion', async () => {
		await fonction.connexion(page);
	})

	test ('ListBox [PLATEFORME] = "' + plateforme + '"', async() => {            
		await menu.selectPlateforrme(page, plateforme);                       // Sélection d'une plateforme par défaut
	})

	test.describe('Page [REFERENTIEL]', async() => {    

		var currentPage:string = 'referentiel';
		test ('Page [REFERENTIEL] - Click', async () => {
			await menu.click(currentPage, page);
		})
	   
		test.describe('Onglet [EMPLACEMENTS]',  async () =>  {        
			
			test ('Onglet [EMPLACEMENTS] - Click', async () => {
				await menu.clickOnglet(currentPage, 'emplacements', page);
			})   

			test ('InputField [ZONES] ="' + sNomZone + '"', async () => {
				await fonction.sendKeys(pageRefEmpl.inputFiedDesignation.nth(0),sNomZone, false, 'Zone');        
			})

			test ('Tr [ZONES][' + sNomZone + '][0] - Click', async () => {
				var isVisible = await pageRefEmpl.trListeZoneAlleeEmplacement.nth(0).isVisible();
				if(isVisible){
					await fonction.wait(page,500);
					await fonction.clickAndWait(pageRefEmpl.trListeZoneAlleeEmplacement.nth(0), page);
				}          
			})

			test.describe ('*** [MODIFICATION D\'UN EMPLACEMENT] ***', async() => {
				
				test ('** Wait Until Spinner Off **', async () => {
					await fonction.waitForSpinner(pageRefEmpl.pPspinner.nth(0));
				})

				test ('InputField [EMPLACEMENT] - Click', async () => {
					await fonction.sendKeys(pageRefEmpl.inputFiedDesignation.nth(1), sNomEmplacement, false, 'Emplacement');
					var isVisible = await pageRefEmpl.trListeZoneAlleeEmplacement.nth(1).isVisible();
					if(isVisible){
						await pageRefEmpl.trListeZoneAlleeEmplacement.nth(1).hover({timeout:1000});
						await fonction.clickAndWait(pageRefEmpl.iconModifier.nth(1), page);
					}          
				})
	
				test.describe ('Popin [MODIFICATION D\'UN EMPLACEMENT] ',  async () =>  {
	
					test ('Popin [MODIFICATION D\'UN EMPLACEMENT] - Is Visible - Check', async () => {
						await fonction.popinVisible(page, 'MODIFICATION D\'UN EMPLACEMENT - Is Visible', true);
					})
	
					test ('** Wait Until Spinner Off **', async () => {
						await fonction.waitForSpinner(pageRefEmpl.pPspinner);
					})

					test ('p-inputswitch [ACTIF/INACTIF] - Click x2', async () => {
						await fonction.clickElement(pageRefEmpl.pInputActif);
						await fonction.clickElement(pageRefEmpl.pInputActif);
					})

					test ('Dropdown [ORDRE D\'AFFICHAGE][last] - Click', async () => {
						await fonction.clickElement(pageRefEmpl.pDropdownOrdreAffichage.locator('button'));
						await fonction.clickElement(pageRefEmpl.pDropdownOrdreAffichItems.last());
					})
	
					test ('Input [CAPACITEMAXIMUM] = "' + iCapacite + "'", async () => {
						await fonction.sendKeys(pageRefEmpl.pInputCapaciteMax,iCapacite, false, 'Capacité');
					})

					test ('Button [ENREGISTRER] - Click', async () => {
						await fonction.clickAndWait(pageRefEmpl.pButtonEnregistrer, page)
					})
	
					test ('Popin [MODIFICATION D\'UN EMPLACEMENT] - Is Not Visible', async () => {
						await fonction.popinVisible(page, 'MODIFICATION D\'UN EMPLACEMENT', false);
					})                
				})
				
				test ('Td [CAPACITE MAXIMUM][' + iCapacite + '] - Click', async () => {
					var sLabel = await pageRefEmpl.trListeZoneAlleeEmplacement.locator('td.colonne-capaciteMaximum span').textContent();
					expect(sLabel).toEqual(iCapacite.toString());
					await fonction.clickElement(pageRefEmpl.iconClear.nth(1));
				})

			})

			test.describe ('*** [MODIFICATION D\'UNE ALLEE] ***', async() => {
				
				test ('InputField [ALLEE] = "' + sNomAllee + '"', async () => {
					await fonction.sendKeys(pageRefEmpl.inputFiedDesignation.nth(2), sNomAllee, false, 'Allée');
				})

				test ('Tr [ALLEE][' + sNomAllee + '] - Click', async () => {
					var isVisible = await pageRefEmpl.trListeZoneAlleeEmplacement.nth(2).isVisible();
					if(isVisible){
						await pageRefEmpl.trListeZoneAlleeEmplacement.nth(2).hover({timeout:1000});
						await fonction.clickAndWait(pageRefEmpl.iconModifierEm, page);
					} 
				})

				test.describe ('Popin [MODIFICATION D\'UNE ALLEE] ', async() => {
	
					test ('Popin [MODIFICATION D\'UNE ALLEE - Is Visible] - Is Visible - Check', async () => {
						await fonction.popinVisible(page, 'MODIFICATION D\'UNE ALLEE - Is Visible', true);
					})
	
					test ('InputField [DESIGNATION] = "' + sNomAlleeModifier + '"', async () => {
						await fonction.sendKeys(pageRefEmpl.pInputDesignationAllee, sNomAlleeModifier, false, 'Allée modifiée');
						log.set('Nom de l\'allée : ' + sNomAlleeModifier);
					})
	
					test ('Button [ENREGISTRER] - Click', async () => {
						await fonction.clickAndWait(pageRefEmpl.pButtonEnregistrer, page)
					})
	
					test ('Popin [MODIFICATION D\'UNE ALLEE] - Is Not Visible', async () => {
						await fonction.popinVisible(page, 'MODIFICATION D\'UNE ALLEE - Is Visible', false);
					}) 

				})
				
				test ('InputField [DESIGNATION ALLEE] = "' + sNomAlleeModifier + '"', async () => {
					await fonction.clickElement(pageRefEmpl.iconClear.nth(1));
					await fonction.sendKeys(pageRefEmpl.inputFiedDesignation.nth(2), sNomAlleeModifier, false, 'Allée modifiée');
				})

				test ('Td [DESIGNATION ALLEE][' + sNomAlleeModifier.trim() +'] - Check', async () => {
					await fonction.wait(page,300);
					var sLabel = await pageRefEmpl.trListeZoneAlleeEmplacement.locator('td.colonne-designation').nth(2).textContent();
					expect(sLabel.trim()).toEqual(sNomAlleeModifier.trim());
				})

			})

			test.describe ('*** [MODIFICATION D\'UNE ZONE] ***', async() => {

				test ('InputField [ZONES] - Click', async () => {
					await pageRefEmpl.trListeZoneAlleeEmplacement.nth(0).hover({timeout:1000});
					await fonction.clickAndWait(pageRefEmpl.iconModifier.nth(0), page);
				})

				test.describe ('Popin [MODDIFICATION D\'UNE ZONE] ', async() => {
	
					test ('Popin [MODDIFICATION D\'UNE ZONE] - Is Visible', async () => {
						await fonction.popinVisible(page, 'MODDIFICATION D\'UNE ZONE', true);
					})
	
					test ('InputField [DESIGNATION] = "' + sNomZoneModifier + '"', async () => {
						await fonction.sendKeys(pageRefEmpl.pInputDesignation, sNomZoneModifier, false, 'Zone moifiée');
						log.set('Nom de la zone : ' + sNomZoneModifier);
					})
	
					test ('Button [ENREGISTRER] - Click', async () => {
						await fonction.clickAndWait(pageRefEmpl.pButtonEnregistrer, page)
					})
	
					test ('Popin [MODDIFICATION D\'UNE ZONE] - Is Not Visible', async () => {
						await fonction.popinVisible(page, 'MODDIFICATION D\'UNE ZONE', false);
					})                
				})
				
				test ('Td [DESIGNATION ZONE]  = "' + sNomZoneModifier + '"', async () => {
					await fonction.clickElement(pageRefEmpl.iconClear.nth(0));
					await fonction.sendKeys(pageRefEmpl.inputFiedDesignation.nth(0),sNomZoneModifier, false, 'Zone modifiée');
				})

				test ('InputField [DESIGNATION ZONE] - Check', async () => {
					await fonction.wait(page,200);
					var sLabel = await pageRefEmpl.trListeZoneAlleeEmplacement.locator('td.colonne-designation span').nth(0).textContent();
					expect(sLabel.trim()).toEqual(sNomZoneModifier.trim());
				})

			}) 

		})  //-- End Describe Onglet

	})  //-- End Describe Page

	test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

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