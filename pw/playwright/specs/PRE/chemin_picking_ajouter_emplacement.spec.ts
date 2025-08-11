/**
 * 
 * @author JOSIAS SIE
 * @since 2025-05-24
 * 
 */

const xRefTest      = "PRE_REF_AEM";
const xDescription  = "Ajout d'un Emplacement sur un Chemin de picking";
const xIdTest       =  9613;
const xVersion      = '3.6';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'PREPARATION',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['plateforme','article','designation','nom'],
	fileName    : __filename
}

//------------------------------------------------------------------------------------

import { expect, test, type Page }   from '@playwright/test';

import { Help }                      from '@helpers/helpers';
import { TestFunctions }             from '@helpers/functions';
import { Log }                       from '@helpers/log';

import { MenuPreparation }           from '@pom/PRE/menu.page';
import { RefCheminPickingPage }      from '@pom/PRE/referentiel-chemin_picking.page';

import { AutoComplete, CartoucheInfo}from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuPreparation;
let pageChemin          : RefCheminPickingPage;

//------------------------------------------------------------------------------------

const log               = new Log();
const fonction          = new TestFunctions(log);

const sPlateforme       = fonction.getInitParam('plateforme', 'Cremlog');
const sArticle          = fonction.getInitParam('article', 'C0OL');
const sNomEmplacement   = fonction.getInitParam('designation','TA_CATEGORIE_EMPLACEMENT. ' + fonction.getToday('FR'));
const sNomChemin        = fonction.getInitParam('nom','Laits, compotes, pâtes & œufs');

const iOrdre            = Math.floor(fonction.random() * 998) + 1;
//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page        = await browser.newPage();
	menu        = new MenuPreparation(page, fonction);
	pageChemin  = new RefCheminPickingPage(page);
	const helper= new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']' , () => {
	
	test('Ouverture URL : ' + fonction.getApplicationUrl(), async() => {
		await fonction.openUrl(page);
	})

	test('Connexion', async ({ context }) => {
		await context.clearCookies();
		await fonction.connexion(page);
	})

	test.describe('Page [REFERENTIEL]', async () => {   

		var sNomPage:string = 'referentiel';

		test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async() => {
			await menu.selectPlateforme(sPlateforme, page);
			log.set('Plateforme : ' + sPlateforme);
		})

		test('Page [REFERENTIEL] - Click', async () => {
			await menu.click(sNomPage, page);
		})
		
		test('Message [ERREUR] - Is Not Visible', async () => {
			await fonction.isErrorDisplayed(false, page);
		}) 

		var sNomOnglet:string = "CHEMIN DE PICKING";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', () => {

			test('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'cheminPicking', page);
			})

			test('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			})

			test.describe ('Datagrid [CHEMIN DE PICKING]', async () => {
				test('Input [DESIGNATION] = "' + sNomChemin + '"', async () => {
					await fonction.sendKeys(pageChemin.inputSearchChemin, sNomChemin, false, 'Chemin de picking');
					await fonction.waitForDomStable(page);
					log.set('Nom Chemin : ' + sNomChemin);
				})

				test('Tr [CHEMIN DE PICKING] - Click', async () => {
					await fonction.clickElement(pageChemin.trListesChemin);
				})
			})

			test('Button [AJOUTER UN EMPLACEMENT ] - Click', async () => {
				await fonction.clickAndWait(pageChemin.buttonAjouterEmplacement, page);
			})

			test.describe ('Datagrid [EMPLACEMENT]', async () => {

				var sNomPopin:string = 'AJOUT D\'UN EMPLACEMENT SUR LE CHEMIN';
				test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {
							
					test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
						await fonction.popinVisible(page, sNomPopin, true);
					})

					test('Message [ERREUR] - Is Not Visible', async () => {
						await fonction.isErrorDisplayed(false, page);
					})

					test('InputField [EMPLACEMENT] ['+ sNomEmplacement +']', async () => {
						var oDataLV:AutoComplete = {
							libelle         :'EMPLACEMENT',
							inputLocator    : pageChemin.pPautocompleteEmplacement.first(),
							inputValue      : sNomEmplacement,
							choiceSelector  : 'li.p-autocomplete-item',
							choicePosition  : 0,
							typingDelay     : 100,
							waitBefore      : 500,
							page            : page
						}

						await fonction.autoComplete(oDataLV);
						log.set('Nom Emplacemet : ' + sNomEmplacement);
					})

					test('Input [ORDRE] = rnd', async () => {
						await fonction.sendKeys(pageChemin.pPinputOrdre, iOrdre.toString(), false, 'Ordre');
						log.set('Ordre : ' + iOrdre.toString());
					})

					test('InputField [ARTICLE] ['+ sArticle +']', async () => {
						var oDataLV:AutoComplete = {
							libelle         :'ARTICLE',
							inputLocator    : pageChemin.pPautocompleteArticle.first(),
							inputValue      : sArticle,
							choiceSelector  : 'li.p-autocomplete-item',
							choicePosition  : 0,
							typingDelay     : 100,
							waitBefore      : 500,
							page            : page
						}

						await fonction.autoComplete(oDataLV);
						log.set('Article : ' + sArticle);
					})

					test('Button [CREER] - Click', async () => {
						await fonction.clickAndWait(pageChemin.pPbuttonCreer, page);
						var isVisible        = await pageChemin.pErrorMessage.isVisible();
						if(isVisible){
							var sErrorMessage= await pageChemin.pErrorMessage.textContent();
								sErrorMessage= sErrorMessage.slice(0,5);
							if(sErrorMessage == "[401]"){
								await fonction.clickElement(pageChemin.pButtonAnnuler);
							}
						}
					})

					test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
						await fonction.popinVisible(page, sNomPopin, false);
					})
				}) //-- End Popin

				test('Tr [EMPLACEMENT] = "' + sNomEmplacement + '"', async () => {
					expect(await pageChemin.trListesArticleChemin.locator('td.colonne-designationEmplacement span').textContent()).toEqual(sNomEmplacement);
				})
			})
		}) //-- End Onglet
	}) //-- End Describe Page

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})  