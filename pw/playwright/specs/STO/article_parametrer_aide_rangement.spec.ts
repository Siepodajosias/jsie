/**
 * 
 * @author JOSIAS SIE
 *  Since 26 - 05 - 2025
 * 
 */

const xRefTest      = "STO_REF_PAR";
const xDescription  = "Paramétrer l'aide au rangement par article";
const xIdTest       =  9746;
const xVersion      = '3.0';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'STOCK',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['plateforme','libelle'],
	fileName    : __filename
}

//----------------------------------------------------------------------------------------

import { expect, test, type Page} from '@playwright/test';

import { TestFunctions }          from "@helpers/functions";
import { Log }                    from "@helpers/log";
import { Help }                   from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }              from "@pom/STO/menu.page";
import { CartoucheInfo }          from '@commun/types';
import { ReferentielArticles }    from '@pom/STO/referentiel-articles.page';
//----------------------------------------------------------------------------------------

let page             : Page;

let menu             : MenuStock;
let pageRefArticle   : ReferentielArticles;

const log            = new Log();
const fonction       = new TestFunctions(log);

//----------------------------------------------------------------------------------------
const plateforme      = fonction.getInitParam('plateforme', 'Cremlog');
const sModePreparation= fonction.getInitParam('libelle','Picking');

//----------------------------------------------------------------------------------------
process.env.ROLE      = 'RESPONSABLE LOGISTIQUE';// Connexion par défaut avec le profil ayant le Role RESPONSABLE LOGISTIQUE
//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage(); 
	menu                = new MenuStock(page, fonction);
	pageRefArticle      = new ReferentielArticles(page); 
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

	test.describe ('Page [REFERENTIEL]', async () => {    

		var currentPage:string = 'referentiel';
		test('Page [REFERENTIEL] - Click', async () => {
			await menu.click(currentPage, page);
		})
	
		test.describe ('Onglet [ARTICLE]', async () => {        

			test('ListBox [PLATEFORME] = "' + plateforme + '"', async () => {            
				await menu.selectPlateforrme(page, plateforme);  // Sélection d'une plateforme par défaut
			})

			test('Button [RECHERCHER] #1 - Click', async () => {  
				await fonction.clickAndWait(pageRefArticle.buttonRechercher, page);   
			})

			test('Input [MODE DE PREPARATION] ="' + sModePreparation + '"', async () => {
				await fonction.clickElement(pageRefArticle.listBoxModePreparation);  
				await fonction.sendKeys(pageRefArticle.inputModePreparation, sModePreparation, false, 'Mode de préparation'); 
				await fonction.wait(page, 500);    
			})

			test('Checkbox [MODE DE PREPARATION] - Click', async () => {
				await fonction.clickAndWait(pageRefArticle.checkBoxModePreparat.first(), page);   
			})

			test('Button [RECHERCHER] #2 - Click', async () => {  
				await fonction.clickAndWait(pageRefArticle.buttonRechercher, page);   
			})

			test('Tr [ARTICLE][MODE PREPATATION PICKING] - Check', async () => {  
				expect(await pageRefArticle.trArticleModPReparatPicking.count()).toBeGreaterThan(0);   
			})

			//-- Vérifier que l'aide au rangement est activé pour les articles;
			test('Checkbox [AIDE AU RANGEMENT] - Check', async () => {
				const iNbrCheckbox =  await pageRefArticle.trArticleModPReparatPicking.locator('.colonne-aideRangement div.p-checkbox-box').count();
				for(let i=0; i<iNbrCheckbox; i++){
					await expect(pageRefArticle.trArticleModPReparatPicking.locator('.colonne-aideRangement div.p-checkbox-box').nth(i)).toHaveAttribute('data-p-highlight', 'true');
				}
			})

			test('Button [ENREGISTRER] #1 - Is Disabled', async () => {  
				await expect(pageRefArticle.buttonEnregistrer).toBeDisabled();   
			})

			test('Checkbox [AIDE AU RANGEMENT] - Click', async () => {  
				await fonction.clickAndWait(pageRefArticle.trArticleModPReparatPicking.locator('.colonne-aideRangement div.p-checkbox-box').first(), page);   
			})

			test('Button [ENREGISTRER] #2 - Is Enabled', async () => {  
				await expect(pageRefArticle.buttonEnregistrer).toBeEnabled();   
			})

			test('Button [ENREGISTRER] - Click', async () => {  
				await fonction.clickAndWait(pageRefArticle.buttonEnregistrer, page);   
			})

			//-- Vérifier que l'aide au rangement est désactivé pour le premier articles;
			test('Checkbox [AIDE AU RANGEMENT][first] - Check', async () => {
				await expect(pageRefArticle.trArticleModPReparatPicking.locator('.colonne-aideRangement div.p-checkbox-box').first()).toHaveAttribute('data-p-highlight', 'false');
			})

			test('Button [ENREGISTRER] #3 - Is Disabled', async () => {  
				await expect(pageRefArticle.buttonEnregistrer).toBeDisabled();   
			})

			test.describe ('Div [AIDE AU RANGEMENT]', async () => {
				test('Checkbox [AIDE AU RANGEMENT] - Click', async () => {  
					await fonction.clickAndWait(pageRefArticle.trArticleModPReparatPicking.locator('.colonne-aideRangement div.p-checkbox-box').first(), page);   
				})

				test('Button [ENREGISTRER] - Click', async () => {  
					await fonction.clickAndWait(pageRefArticle.buttonEnregistrer, page);   
				})
			})
		})  //-- End Describe Onglet
	})  //-- End Describe Page

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})