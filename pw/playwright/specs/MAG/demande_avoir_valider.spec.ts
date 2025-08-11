/**
 *
 * @author JOSIAS SIE
 * @since 2025-06-17
 * 
 */
const xRefTest      = "MAG_DAV_VAL";
const xDescription  = "Valider une demande d'avoir";
const xIdTest       =  8094;
const xVersion      = '3.1';

//------------------------------------------------------------------------------------

var info:CartoucheInfo = {
	desc       : xDescription,
	appli      : 'MAGASIN',
	version    : xVersion,
	refTest    : [xRefTest],
	idTest     : xIdTest,
	help       : [],
	params     : ['ville','groupeArticle'],
	fileName   : __filename
}

//------------------------------------------------------------------------------------
  
import { expect, test, type Page }from '@playwright/test';

import { TestFunctions }          from "@helpers/functions";
import { Log }                    from "@helpers/log";
import { Help }                   from '@helpers/helpers';
import { CartoucheInfo, TypeEsb } from '@commun/types';
import { MenuMagasin }            from '@pom/MAG/menu.page';
import { StockStock }             from '@pom/MAG/stock-stock.page';
import { TableauDeBord }          from '@pom/MAG/tableau-de-bord.page';
import { EsbFunctions }           from '@helpers/esb';

//-------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuMagasin;

let pageTableauDeBord   : TableauDeBord;
let pageStockStock	    : StockStock; 
let esb                 : EsbFunctions;
const log            = new Log();
const fonction       = new TestFunctions(log);

//------------------------------------------------------------------------------------
var oData:any        = fonction.importJdd();

const sMagasin       = fonction.getInitParam('ville', 'Chaponnay (F720)'); //Bergerac (G550)
const sGroupeArticle = fonction.getInitParam('groupeArticle','Coupe / Corner');

//------------------------------------------------------------------------------------

process.env.ROLE     = 'CHEF SECTEUR';// Connexion par défaut avec le profil ayant le Role CHEF SECTEUR

const today          = fonction.getToday('FR',0, '/');
//------------------------------------------------------------------------------------

var data = {
	iDateLivraison: "",
	iNumeroBL     : "",
	sCodeArticle  : "",
	iQuantite     : "",
	sCodeClient   : ""
}

//-----------------------------------------------------------------------------------

if (oData !== undefined) {  // On est dans le cadre d'un E2E. Récupération des données temporaires
	var iDateLivraison= oData.iDateLivraison;                               
	data.iNumeroBL    = oData.iNumeroBL; 
	var sCodeArticle  = oData.sCodeArticle 	    
	data.iQuantite    = oData.iQuantite;    

	log.set('E2E - Date de livraison : ' + iDateLivraison);
	log.set('E2E - Code article : ' + sCodeArticle); 
} 

const sMessageConfir  = `Veuillez confirmer la validation de la demande d\'avoir du magasin`

//-----------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage(); 
	menu                = new MenuMagasin(page, fonction);
	pageTableauDeBord   = new TableauDeBord(page);
	pageStockStock      = new StockStock(page, fonction);
	esb                 = new EsbFunctions(fonction);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {
  
	test('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})
	
	test('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe('Page [ACCUEIL]', async () => {
		test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
			await fonction.waitTillHTMLRendered(page);
			var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
			if (isVisible) {
				await menu.removeArlerteMessage(page);
			} else {
				log.set('Link [BROWSER SECURITY WARNING] - Click: ACTION ANNULEE');
				test.skip();
			}
		})
	})

	test.describe ('Page [TABLEAU DE BORD]', async () => {

		var pageName:string = 'tableauBord'; 

		test('ListBox [VILLE] = "' + sMagasin + '"', async () => {  // On sélectionne le magasin cible.
			await menu.selectVille(sMagasin, page);
			log.set('Magasin : ' + sMagasin);
		})

		test('Page [TABLEAU DE BORD] - Click', async () => {
			await menu.click(pageName, page);
		})

		test('** Wait Until Spinner Off **', async () => {
			await fonction.waitForSpinner(pageTableauDeBord.spinner, 180000);
		})

		test('Message [ERREUR] - Is Not Visible', async () => {
			await fonction.isErrorDisplayed(false, page);
		}) 

		test('Tr [DEMANDE D\'AVOIR] > 0', async () => {
			expect(await pageTableauDeBord.trListeDamandeAvoir.count()).toBeGreaterThan(0);
		}) 

		test('DatePicker and button [Is - visible] - Is Displayed', async () => {
			await fonction.isDisplayed(pageTableauDeBord.datePicker);
			await fonction.isDisplayed(pageTableauDeBord.multiselectGroupeArticle);
			await fonction.isDisplayed(pageTableauDeBord.buttonVoirPhotos);
			await fonction.isDisplayed(pageTableauDeBord.buttonValider);
			await fonction.isDisplayed(pageTableauDeBord.buttonRefuser);
		})

		test('Multiselect [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
			await fonction.clickAndWait(pageTableauDeBord.multiselectGroupeArticle, page);
			await fonction.sendKeys(pageTableauDeBord.inputGroupeArticle, sGroupeArticle, false, 'Groupe article');
		})

		test('Li [GROUPE ARTICLE] - Click', async () => {
			await fonction.clickAndWait(pageTableauDeBord.liGroupeArticle, page);
		})

		//-----------------------------------------------------------------------------------------------------------
		test('Div [DATE DEMANDE] - Click', async () => {
			await fonction.clickAndWait(pageTableauDeBord.pDivDateDemande, page);
			await fonction.sendKeys(pageTableauDeBord.pInputBL, today.slice(0,4), false, 'Date de demande');
		})

		test('Li [DATE DEMANDE] - Click', async () => {
			await fonction.clickElement(pageTableauDeBord.pLiBL.first());
		})

		//-----------------------------------------------------------------------------------------------------------
		test('Div [DATE BL] = "' + iDateLivraison + '"', async () => {
			await fonction.clickAndWait(pageTableauDeBord.pDivDateBL, page);
			await fonction.sendKeys(pageTableauDeBord.pInputBL, iDateLivraison.replace(/\s/g,""), false, 'Date de livraison');
			data.iDateLivraison = iDateLivraison
		})

		test('Li [DATE BL] - Click', async () => {
			await fonction.clickElement(pageTableauDeBord.pLiBL.first());
		}) 

		//-----------------------------------------------------------------------------------------------------------
		test('Input [CODE ARTICLE] = "' + sCodeArticle + '"', async () => {
			await fonction.sendKeys(pageTableauDeBord.inputCodeArticle.nth(2), sCodeArticle, false, 'Code article');
			await fonction.wait(page, 500);
			data.sCodeArticle = sCodeArticle
		})

		test('I [STATUT] = A valider', async () => {
			await expect(pageTableauDeBord.pIStatutAValider.first()).toHaveAttribute('title',"A valider");
		})

		test('Tr [DEMANDE D\'AVOIR] - Click', async () => {
			await fonction.clickAndWait(pageTableauDeBord.trListeDamandeAvoir.first(), page);
		})

		test('Button [VALIDER] - Click', async () => {
			await fonction.clickAndWait(pageTableauDeBord.buttonValider, page);
		})

		//-----------------------------------------------------------------------------------------------------------
		var sNomPopin:string = "CONFIRMER LA VALIDATION";
		test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {
			test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
				await fonction.popinVisible(page, sNomPopin, true);
			})

			test('P [MESSAGE DE CONFIRMATION] - Expect', async () => {
			   expect(await pageTableauDeBord.pMessageConfirmation.first().textContent()).toContain(sMessageConfir);
			})

			test('Button [OUI] - Is visible', async () => {
			   await fonction.isDisplayed(pageTableauDeBord.buttonOui);
			})

			test('Button [NON] - Is visible', async () => {
			   await fonction.isDisplayed(pageTableauDeBord.buttonNon);
			})

			test('Button [OUI] - Click', async () => {
			   await fonction.clickAndWait(pageTableauDeBord.buttonOui, page);
			})

			test('** Wait Until Spinner Off **', async () => {
				await fonction.waitForSpinner(pageTableauDeBord.spinner, 180000);
			})

			test('Popin [' + sNomPopin.toUpperCase() + '] - Is not Visible', async () => {
				await fonction.popinVisible(page, sNomPopin, false);
			})
		})

		test('I [STATUT] = Envoyée', async () => {
			await expect(pageTableauDeBord.pIStatutEnvoyee).toHaveAttribute('title',"Envoyée");
			data.sCodeClient = await pageTableauDeBord.trListeDamandeAvoir.first().locator('td').nth(2).textContent();
		})
	})  // Page TABLEAU DE BORD

	test.describe ('Page [STOCK]', async () => {

		var currentPage:string = 'stock'; 

		test('Menu [STOCK] - Click', async () => {
			await menu.click(currentPage, page);
		})    

		test('Message [ERREUR] - Is Not Visible', async () => {
			await fonction.isErrorDisplayed(false, page);
		}) 

		test.describe ('Onglet [STOCK]', async () => {
				
			test('Onglet [STOCK] - Click', async () =>  {
				await menu.clickOnglet(currentPage, 'stock', page);
			}) 

			test('** Wait Until Spinner Off #1 **', async () => {
				await fonction.waitForSpinner(pageStockStock.spinner.locator('img'), 180000);
			})

			test('Tr [ARTICLE] > 0', async () => {
				expect(await pageStockStock.trListeArticles.count()).toBeGreaterThan(0);
			}) 

			test('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
				await pageStockStock.selectGroupeArticle(page, sGroupeArticle);
			})
			
			test('** Wait Until Spinner Off #2 **', async () => {
				await fonction.waitForSpinner(pageStockStock.spinner.locator('img'), 180000);
			})

			test('Tr [ARTICLE] >= 1', async () => {
				expect(await pageStockStock.trListeArticles.count()).toBeGreaterThanOrEqual(1);
			}) 

			test('Input [CODE ARTICLE] = "' + sCodeArticle + '"', async () => {
				await fonction.sendKeys(pageStockStock.inputFiltreArticle, sCodeArticle, false, 'Code article');
				await fonction.wait(page, 500);
			}) 

			test('Tr [ARTICLE] = 1', async () => {
				expect(await pageStockStock.trListeArticles.count()).toEqual(1);
			}) 
		})  // Onglet STOCK

		await fonction.writeData(data);
	})  // Page STOCK

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

	test('** CHECK FLUX **', async () => { 
			var oFlux:TypeEsb = { 
				"FLUX" : [
					{
						"NOM_FLUX" : "EnvoyerDemandeAvoirMagasin_Prefac",
						STOP_ON_FAILURE  : false
					}
				],
				"WAIT_BEFORE"      : 5000,
			}
		await esb.checkFlux(oFlux, page);
	})
}) // End describe