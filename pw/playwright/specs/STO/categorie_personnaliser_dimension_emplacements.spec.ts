/**
 * 
 * @author JOSIAS SIE
 *  Since 23 - 05 - 2025
 * 
 */

const xRefTest      = "STO_REF_PDE";
const xDescription  = "Personnaliser les dimensions d'un emplacement";
const xIdTest       =  9745;
const xVersion      = '3.1';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'STOCK',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['plateforme','nomZone'],
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
const plateforme     = fonction.getInitParam('plateforme', 'Cremlog');
const sNomZone       = fonction.getInitParam('nomZone', 'Z1');

const sNomEmplacement= fonction.getLocalConfig('nomCategorieEmplacement');

const iLongueur      = 130;
const iLargeur       = 77;
const iHauteur       = 188;
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

	test.describe ('Page [REFERENTIEL]', async () => {    

		var currentPage:string = 'referentiel';
		test('Page [REFERENTIEL] - Click', async () => {
			await menu.click(currentPage, page);
		})
	   
		test.describe ('Onglet [EMPLACEMENTS]', async() => {        
			
			test('Onglet [EMPLACEMENTS] - Click', async () => {
				await menu.clickOnglet(currentPage, 'emplacements', page);
			})   

			test('InputField [ZONES] ="' + sNomZone + '"', async () => {
				await fonction.sendKeys(pageRefEmpl.inputFiedDesignation.nth(0), sNomZone, false, 'Zone');        
			})

			test('Tr [ZONES][' + sNomZone + '] - Click', async () => {
				var isVisible = await pageRefEmpl.trListeZoneAlleeEmplacement.nth(0).isVisible();
				if(isVisible){
					await fonction.wait(page,500);
					await fonction.clickAndWait(pageRefEmpl.trListeZoneAlleeEmplacement.nth(0), page);
				}          
			})

			test('Tr [EMPLACEMENTS] - Check', async () => {
				expect(await pageRefEmpl.trListeEmplacement.count()).toBeGreaterThan(0);     
			})

			test.describe ('*** [MODIFICATION D\'UN EMPLACEMENT] ***', async() => {
				
				test('** Wait Until Spinner Off **', async () => {
					await fonction.waitForSpinner(pageRefEmpl.pPspinner.nth(0));
				})

				test('InputField [EMPLACEMENT] - Click', async () => {
					await fonction.sendKeys(pageRefEmpl.inputFiedDesignation.nth(1), sNomEmplacement, false, 'Emplacement');
					var isVisible = await pageRefEmpl.trListeZoneAlleeEmplacement.nth(1).isVisible();
					if(isVisible){
						await fonction.wait(page, 500);
						await pageRefEmpl.trListeZoneAlleeEmplacement.nth(1).hover({timeout:1000});
						await fonction.clickAndWait(pageRefEmpl.iconModifier.nth(1), page);
					}          
				})
	
				test.describe ('Popin [MODIFICATION D\'UN EMPLACEMENT] ',  async () =>  {

					test('Popin [MODIFICATION D\'UN EMPLACEMENT] - Is Visible', async () => {
						await fonction.popinVisible(page, 'MODIFICATION D\'UN EMPLACEMENT', true);
					})
	
					test('** Wait Until Spinner Off **', async () => {
						await fonction.waitForSpinner(pageRefEmpl.pPspinner);
					})

					test('Inputswitch [DIMENSION PERSONNALISEES] - Click', async () => {
						await fonction.clickAndWait(pageRefEmpl.pSwitchButtonDimPerso, page);
					})

					test('Input [LONGUEUR] = "'+  iLongueur + '"', async () => {
						await fonction.sendKeys(pageRefEmpl.pInputLongueur, iLongueur, false, 'Longueur');
						log.set('Longueur :' + iLongueur);
					})
	
					test('Input [LARGEUR] = "'+  iLargeur + '"', async () => {
						await fonction.sendKeys(pageRefEmpl.pInputLargeur, iLargeur, false, 'Largeur');
						log.set('Largeur :' + iLargeur);
					})
	
					test('Input [HAUTEUR] = "'+  iHauteur + '"', async () => {
						await fonction.sendKeys(pageRefEmpl.pInputHauteur, iHauteur, false, 'Hauteur');
						log.set('Hauteur :' + iHauteur);
					})

					test('Button [ENREGISTRER] - Click', async () => {
						await fonction.clickAndWait(pageRefEmpl.pButtonEnregistrer, page)
					})
	
					test('Popin [MODIFICATION D\'UN EMPLACEMENT] - Is Not Visible', async () => {
						await fonction.popinVisible(page, 'MODIFICATION D\'UN EMPLACEMENT', false);
					})                
				})
			})
		})  //-- End Describe Onglet
	})  //-- End Describe Page

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})