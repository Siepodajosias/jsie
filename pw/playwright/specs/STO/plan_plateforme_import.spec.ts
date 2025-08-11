/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 20 - 11 - 2023
 * 
 */

const xRefTest      = "STO_PLA_IMP";
const xDescription  = "Importer un plan plateforme";
const xIdTest       =  2172;
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
}

//----------------------------------------------------------------------------------------

import { expect, test, type Page}   from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                from "@pom/STO/menu.page";
import { ReferentielPlanPlateForme }from '@pom/STO/referentiel-plan_plateforme.page';

import * as path                    from 'path';
import { CartoucheInfo }            from '@commun/types';

//----------------------------------------------------------------------------------------

let page             : Page;

let menu             : MenuStock;
let pageRefPlanPltf  : ReferentielPlanPlateForme

const log            = new Log();
const fonction       = new TestFunctions(log);

//----------------------------------------------------------------------------------------
var sPlateforme      = fonction.getInitParam('plateforme', 'Cremlog');

const sFileToUpload  = fonction.getLocalConfig('fileToUpload');
const sCommentaire   = 'TEST-AUTO_Import Plan Commentaire - ' + fonction.getToday('US')+fonction.getHeure();

var absolutePath     = path.join(__dirname, sFileToUpload); 
//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage(); 
	menu                = new MenuStock(page, fonction);
	pageRefPlanPltf     = new ReferentielPlanPlateForme(page);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

	let sMessageErreur:string  = '';

	test('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test('Connexion', async () => {
		await fonction.connexion(page);
	})

	test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async() => {            
		await menu.selectPlateforrme(page, sPlateforme);                     
	})

	test.describe ('Page [REFERENTIEL]', () => {  

		var currentPage:string = 'referentiel';
		test('Page [REFERENTIEL] - Click', async () => {
			await menu.click(currentPage, page);
		})
	   
		test.describe ('Onglet [PLAN PLATEFORME]', async () => {        
			
			test('Onglet [PLAN PLATEFORME] - Click', async () => {
				await menu.clickOnglet(currentPage, 'planPlateforme', page);
			})               

			var sNomPopin:string = "Importer un plan de la plateforme";
			test.describe ('Popin [' + sNomPopin + ']', async () => {

				test('Button [IMPORTER UN PLAN DE LA PLATEFORME] - Click', async () => {
					await fonction.clickElement(pageRefPlanPltf.buttonImporterUnPlan);
				})
				
				test('Upload [FILE] = "' + sFileToUpload + '\'"', async () => {     
					await pageRefPlanPltf.pPInputFile.setInputFiles(absolutePath);                        
					await fonction.wait(page, 250);
				})

				test('Textarea [COMMENTAIRE] = "' + sCommentaire + '\'"', async () => {     
					await fonction.sendKeys(pageRefPlanPltf.pPtextAreaCommentaire, sCommentaire, false, "Commentaire");                    
					await fonction.wait(page, 250);
				})

				test('Button [ENREGISTRER] - Is Enabled', async () => {
					await expect(pageRefPlanPltf.pPbuttonEnregistrer).toBeEnabled();
				})

				test('Button [ENREGISTRER] - Click', async () => {
					await fonction.clickAndWait(pageRefPlanPltf.pPbuttonEnregistrer, page);
				})

				//-- Aucune erreur 9999 doit être affichée. D'autres erreurs "légitimes" peuvent êtres affichées !
				test('Label [ERREUR] - ??? (optionnel)', async () => {
					if (await pageRefPlanPltf.pPMessageErreur.isVisible()) {
						sMessageErreur = await pageRefPlanPltf.pPMessageErreur.textContent();
						log.set('Message Erreur Affiché : ' + sMessageErreur);
					} else {
						log.set('Aucun Message d\'Erreur Affiché');
					}
				})

				test('Link [ANNULER] - click (optionnel)', async () => {
					if (sMessageErreur !== '') {
						await fonction.clickElement(pageRefPlanPltf.pPlinkAnnuler);
					} else {
						test.skip();
					}
				})                
			})

			test.describe ('Datagrid [HISTORIQUE DES IMPORTS]', async () => {

				test('Td [COMMENTAIRE][Nbr] = 1', async () => {
					expect(await pageRefPlanPltf.dataGridTdCommentaires.locator(`span:text-is("${sCommentaire}")`).count()).toBe(1);
				})

				test('Td [STATUT] - Click', async () => {
					await fonction.clickAndWait(pageRefPlanPltf.dataGridTdCommentaires.locator(`span:text-is("${sCommentaire}")`), page);
					await expect(pageRefPlanPltf.dataGridTdStatut).toHaveClass('tache-import-plan-plateforme icon-ok');
				})
			})
		})  //-- End Describe Onglet              
	})  //-- End Describe Page

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})