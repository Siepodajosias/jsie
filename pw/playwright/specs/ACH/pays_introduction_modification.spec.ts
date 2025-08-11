/**
 * 
 * @author JOSIAS SIE
 * @since 2024-12-09
 * 
 */
const xRefTest      = "ACH_HIS_PAY";
const xDescription  = "Modification Pays d'Introduction";
const xIdTest       =  9619;
const xVersion      = "3.0";

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'ACHATS',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['fournisseur','rayon'],
	fileName    : __filename
}

//------------------------------------------------------------------------------------

import { expect, test, type Page }    from '@playwright/test';

import { Help }                       from '@helpers/helpers';
import { TestFunctions }              from '@helpers/functions';
import { Log }                        from '@helpers/log';

import { MenuAchats }                 from '@pom/ACH/menu.page';
import { PageHisArrLot }              from '@pom/ACH/historique_arrivages-lots.page';
import { AutoComplete, CartoucheInfo }from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
let pageHisLot      : PageHisArrLot;
var menu            : MenuAchats;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------  

const sRayon        = fonction.getInitParam('rayon','Fruits et légumes');
const sFournisseur  = fonction.getInitParam('fournisseur', '00011');
var   sNomPays      : string = '';
var   sCode         : string = '';

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page            = await browser.newPage();
	menu            = new MenuAchats(page, fonction);    
	pageHisLot      = new PageHisArrLot(page);
	const helper    = new Help(info, testInfo, page);
	await helper.init();
})
 
test.afterAll(async({}, testInfo) => {
	await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

	test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test('Connexion', async () => {
	   await fonction.connexion(page);
	})
  
	test.describe ('Page [HISTORIQUE]', async () => {

		var pageName:string   = 'historique';

		test('ListBox [RAYON] = "' + sRayon + '"', async () => {
			await menu.selectRayonByName(sRayon, page);
		})

		test("Page [HISTORIQUE] - Click ", async () => {
			await menu.click(pageName, page);
		})

		test.describe ('Onglet [ARRIVAGES LOTS]', async() => {

			test('Onglet [ARRIVAGES LOTS] - Click', async () => {
				await menu.clickOnglet(pageName, 'arrivagesLots', page);                
			})   

			test('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
			})

			test('AutoComplete [FOURNISSEUR] = ['+sFournisseur+']', async () => {
				var oData:AutoComplete = {
					libelle         :'FOURNISSEUR',
					inputLocator    : pageHisLot.inputFournCommande,
					inputValue      : sFournisseur,
					choiceSelector  :'.gfit-autocomplete-result',
					choicePosition  : 0,
					typingDelay     : 100,
					waitBefore      : 500,
					page            : page
				}
				await fonction.autoComplete(oData);
			})

			test('Button [RECHERCHER] - Click', async() => {
				await fonction.clickAndWait(pageHisLot.buttonRechercher, page);
			})

			test('Tr [ARRIVAGES LOTS][First] - Click', async() => {
				await fonction.clickElement(pageHisLot.trListeArrivageLots.first(), page);
			})

			test('Button [MODIFIER LE PAYS D\'INTRODUCTION] - Check', async() => {
				await expect(pageHisLot.buttonModifierPaysInt).toBeEnabled();
			}) 

			test('Button [MODIFIER LE PAYS D\'INTRODUCTION] - Click', async() => {
				sCode           = await pageHisLot.tdCodeArticle.first().locator('span').textContent();
				var sDesignation= await pageHisLot.tdDesignationArticle.first().textContent();
				log.set('Code article : ' +sCode+ '; Désignation : ' +sDesignation);
				await fonction.clickAndWait(pageHisLot.buttonModifierPaysInt, page);
			})

			var sNomPopin:string = "Modification des arrivages";
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

				test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})

				test('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test('Input [PAYS][First] - Click', async () =>  {					
					await fonction.clickElement(pageHisLot.pPinputPaysIntroduction);
					await fonction.clickElement(pageHisLot.pPliPaysIntroduction.first());
					sNomPays = await pageHisLot.pPliPaysIntroduction.first().locator('span').textContent();
					log.set('Nouveau pays d\'introduction : ' + sNomPays);
				})

				test('Td [NOUVEAU PAYS D\'INTRODUCTION] - Check', async () =>  {					
					var sTexte = await pageHisLot.tdNouveauPaysIntroduction.textContent();
					sCode      = await pageHisLot.tdCode.textContent();
					expect(sTexte).toEqual(sNomPays);
				})

				test('Button [ENREGISTRER] - Click', async () => {
					await fonction.clickAndWait(pageHisLot.pPButtonEnregistrer, page);     
				})

				test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , false);
				})
			})  //-- End test.describe Popin 

			test('Td [CODE ARTICLE] - Click', async () => {
				await fonction.clickElement(pageHisLot.tdCodeArticle.locator('span:text-is("'+sCode+'")').first());
			})

			test('Button [MODIFIER LE PAYS] - Click', async () => {
				await fonction.clickAndWait(pageHisLot.buttonModifierPaysInt, page);
			})

			test.describe ('Popin [' + sNomPopin.toUpperCase() + '][CHECK]', async () => {

				test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})

				test('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test('Td [PAYS D\'INTRODUCTION ACTUEL] - Check', async () =>  {					
					var sTexte = await pageHisLot.tdPaysIntroductionAct.textContent();
					expect(sTexte).toEqual(sNomPays);
				})

				test('Td [NOUVEAU PAYS D\'INTRODUCTION] - Check', async () =>  {					
					var sTexte = await pageHisLot.tdNouveauPaysIntroduction.textContent();
					expect(sTexte).toEqual('');
				})

				test('Button [ANNULER] - Click', async () => {
					await fonction.clickElement(pageHisLot.pPButtonAnnuler);     
				})

				test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , false);
				})
			})  //-- End test.describe Popin
		})  // End  Onglet
	})  // End  Page

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})  // End describe