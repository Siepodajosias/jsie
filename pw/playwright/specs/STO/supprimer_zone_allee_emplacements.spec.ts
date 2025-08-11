/**
 * 
 * @author JOSIAS SIE
 *  Since 27 - 11 - 2024
 * 
 */

const xRefTest      = "STO_REF_SUP";
const xDescription  = "Suppression d'une Allée, ou/et d'un nouvel Emplacement";
const xIdTest       =  1698;
const xVersion      = '3.2';

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

import { test, type Page}         from '@playwright/test';
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
const plateforme       = fonction.getInitParam('plateforme', 'Chaponnay');

const sNomZoneModifier = fonction.getLocalConfig('nomZoneModifier');
const sNomAlleeModifier= fonction.getLocalConfig('nomAlleeModifier');
const sNomEmplacement  = fonction.getLocalConfig('nomEmplacement');
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
		await menu.selectPlateforrme(page, plateforme); // Sélection d'une plateforme par défaut
	})

	test.describe('Page [REFERENTIEL]', async() => {    

		var currentPage:string = 'referentiel';
		test('Page [REFERENTIEL] - Click', async () => {
			await menu.click(currentPage, page);
		})
	   
		test.describe('Onglet [EMPLACEMENTS]', async () =>  {        
			
			test('Onglet [EMPLACEMENTS] - Click', async () => {
				await menu.clickOnglet(currentPage, 'emplacements', page);
			})   

			test('InputField [ZONES] ="' + sNomZoneModifier + '"', async () => {
				await fonction.sendKeys(pageRefEmpl.inputFiedDesignation.nth(0),sNomZoneModifier, false, 'Zone modifiée');
				var isVisible = await pageRefEmpl.trListeZoneAlleeEmplacement.nth(0).isVisible();
				if(isVisible){
					await fonction.wait(page,300);
					await fonction.clickAndWait(pageRefEmpl.trListeZoneAlleeEmplacement.nth(0), page);
				}          
			})

			test('** Wait Until Spinner Off **', async () => {
				await fonction.waitForSpinner(pageRefEmpl.pPspinner.nth(0));
			})

			test.describe ('*** [SUPPRESSION D\'UN EMPLACEMENT] ***', async() => {
				
				test('InputField [EMPLACEMENT] - Click', async () => {
					await fonction.sendKeys(pageRefEmpl.inputFiedDesignation.nth(1), sNomEmplacement, false, 'Emplacement');
					var isVisible = await pageRefEmpl.trListeZoneAlleeEmplacement.nth(1).isVisible();
					if(isVisible){
						await fonction.wait(page,250);
						await pageRefEmpl.trListeZoneAlleeEmplacement.nth(1).hover({timeout:1000});
						await fonction.clickAndWait(pageRefEmpl.iconSupprimer.nth(0), page);
					}          
				})

				test('** Wait Until Spinner Off **', async () => {
					await fonction.waitForSpinner(pageRefEmpl.pPspinner.nth(0));
				})
	
				test.describe ('Popin [SUPPRESSION D\'UN EMPLACEMENT] ', async () => {
	
					test('Popin [SUPPRESSION D\'UN EMPLACEMENT - Is Visible] - Is Visible - Check', async () => {
						await fonction.popinVisible(page, 'SUPPRESSION D\'UN EMPLACEMENT - Is Visible', true);
					})
	
					test('Button [SUPPRESSION] - Click', async () => {
						await fonction.clickAndWait(pageRefEmpl.buttonConfirmer, page);
					})
	
					test('** Wait Until Spinner Off **', async () => {
						await fonction.waitForSpinner(pageRefEmpl.pPspinner.nth(0));
					})
					
					test('Popin [SUPPRESSION D\'UN EMPLACEMENT - Is Visible] - Is Not Visible - Check', async () => {
						await fonction.popinVisible(page, 'SUPPRESSION D\'UN EMPLACEMENT - Is Visible', false);
					})                
				})
			})

			test.describe ('*** [SUPPRESSION D\'UNE ALLEE] ***', async() => {
				
				test('InputField [ALLEE] - Click', async () => {
					await fonction.sendKeys(pageRefEmpl.inputFiedDesignation.nth(2), sNomAlleeModifier, false, 'Allée modifiée');
					var isVisible = await pageRefEmpl.trListeZoneAlleeEmplacement.nth(1).isVisible();
					if(isVisible){
						await fonction.wait(page,250);
						await pageRefEmpl.trListeZoneAlleeEmplacement.nth(1).hover({timeout:1000});
						await fonction.clickElement(pageRefEmpl.iconSupprimerAllee);
					} 
				})

				test.describe ('Popin [SUPPRESSION D\'UNE ALLEE] ', async() => {
	
					test('Popin [SUPPRESSION D\'UNE ALLEE - Is Visible] - Is Visible - Check', async () => {
						await fonction.popinVisible(page, 'SUPPRESSION D\'UNE ALLEE - Is Visible', true);
					})
		
					test('Button [SUPPRESSION] - Click', async () => {
						await fonction.clickAndWait(pageRefEmpl.buttonConfirmer, page);
					})
	
					test('Popin [SUPPRESSION D\'UNE ALLEE - Is Visible] - Is Not Visible - Check', async () => {
						await fonction.popinVisible(page, 'SUPPRESSION D\'UNE ALLEE - Is Visible', false);
					})                
				})
			})

			test.describe ('*** [SUPPRESSION D\'UNE ZONE] ***', async() => {
				test('InputField [ZONES] - Click', async () => {
					await pageRefEmpl.trListeZoneAlleeEmplacement.nth(0).hover({timeout:1000});
					await fonction.clickElement(pageRefEmpl.iconSupprimer.nth(0));
				})

				test.describe ('Popin [SUPPRESSION D\'UNE ZONE] ', async() => {
	
					test('Popin [SUPPRESSION D\'UNE ZONE - Is Visible] - Is Visible - Check', async () => {
						await fonction.popinVisible(page, 'SUPPRESSION D\'UNE ZONE', true);
					})
	
					test('Button [SUPPRESSION] - Click', async () => {
						await fonction.clickAndWait(pageRefEmpl.buttonConfirmer, page);
					})
	
					test('Popin [SUPPRESSION D\'UNE ZONE - Is Visible] - Is Not Visible - Check', async () => {
						await fonction.popinVisible(page, 'SUPPRESSION D\'UNE ZONE', false);
					})                
				})
			}) 
		})  //-- End Describe Onglet
	})  //-- End Describe Page

	test('Déconnexion', async () => {
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