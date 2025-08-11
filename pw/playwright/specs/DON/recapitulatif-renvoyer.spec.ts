/**
 * 
 * @author JOSIAS SIE
 * @since 2024-12-26
 *  
 */
const xRefTest      = "DON_REC_RER";
const xDescription  = "Renvoyer un récapitulatif";
const xIdTest       = 4720;
const xVersion      = '3.3';

var info: CartoucheInfo = {
	desc        : xDescription,
	appli       : 'DONS',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,  
	help        : [],
	params      : ['societeDonatrice'],
	fileName    : __filename
}

//--------------------------------------------------------------------------------------------// 

import { test, type Page }            from '@playwright/test';

import { Help }                       from '@helpers/helpers';
import { TestFunctions }              from '@helpers/functions';
import { Log }                        from '@helpers/log';

import { MenuDon }                    from '@pom/DON/menu.page';
import { RecapitulatifsDons }         from '@pom/DON/dons-recapitulatif.page';

import { AutoComplete, CartoucheInfo }from '@commun/types/index';

//--------------------------------------------------------------------------------------------//

let page                : Page;
let menu                : MenuDon;

let pageDonsRecap       : RecapitulatifsDons;

const log               = new Log();
const fonction          = new TestFunctions(log);

//--------------------------------------------------------------------------------------------//

const sJddFile          = fonction.getLocalConfig('jddRecaptitulatif');
const data              = fonction.readFile(sJddFile);

//--------------------------------------------------------------------------------------------//

var sSocieteDonatrice   = fonction.getInitParam('societeDonatrice', data.sSocieteDonatrice);

//--------------------------------------------------------------------------------------------//

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage();
	menu                = new MenuDon(page, fonction);    
	pageDonsRecap       = new RecapitulatifsDons(page);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//-------------------------------------------------------------------------------------------//

test.describe.serial('[' + xRefTest + '] - ' + xDescription + ' : ',  () => {

	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();		
		await fonction.openUrl(page);
	})

	test ('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe ('Page [DONS]',  async () => {

		var sNomPage:string  = 'dons';

		test ('Page [DONS] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		var sNomOnglet:string = 'RECAPITULATIF';
		test.describe ('Onglet [' + sNomOnglet + ']',  async () => {

			test ('Onglet [' + sNomOnglet + '] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'recapitulatifs', page);
			})
	
			test ('InputField [SOCIETE DONATRICE] = "' + sSocieteDonatrice + '"', async () => {
				var oData:AutoComplete = {
					libelle         :'SOCIETE DONATRICE',
					inputLocator    : pageDonsRecap.inputSocieteDonatriceRecapitulatif,
					inputValue      : sSocieteDonatrice,
					choiceSelector  : 'button.dropdown-item:NOT(.btn-link)',
					choicePosition  : 0,
					typingDelay     : 100,
					waitBefore      : 500,
					page            : page
				}
				await fonction.autoComplete(oData);
			})

			test ('Button [RECHERCHER RECAPITULATIF] - Click', async () => {
				await fonction.clickAndWait(pageDonsRecap.buttonRechercherRecapitulatif, page);                               
			})

			test ('Header [VALORISATION CORRIGEE] - Click', async () => {
				await fonction.clickElement(pageDonsRecap.dataGridValorisationCorrigee); 
			})

			test ('Header [ATTESTATION ENVOYE] - Click', async () => {
				await fonction.clickElement(pageDonsRecap.dataGridAttestationEnvoye); 
				await fonction.wait(page, 800);
			})

			test ('CheckBox [LISTE DES RECAPITULATIFS][rnd] - Click', async () => {
				var iNbRecapitulatifs:number = await pageDonsRecap.checkboxListeRecapitulatif.count();

				var iRnd = Math.floor(fonction.random() * iNbRecapitulatifs);
				log.set('Sélection de l\'élément ' + iRnd +' / ' + iNbRecapitulatifs);

				await fonction.clickElement(pageDonsRecap.checkboxListeRecapitulatif.nth(iRnd));
				await fonction.isDisplayed(pageDonsRecap.iconListeRecapitulatif);

				log.set('Bénéficiaire (ville) : ' + await pageDonsRecap.tdListeRecapitulatif.nth(1).textContent());
				log.set('Société donatrice : ' + await pageDonsRecap.tdListeRecapitulatif.nth(2).textContent());
				log.set('Poids total : ' + await pageDonsRecap.tdListeRecapitulatif.nth(5).textContent());
				log.set('Valorisation initiale : ' + await pageDonsRecap.tdListeRecapitulatif.nth(6).textContent());
			})

			var sNomPopin:string = "Renvoi de récapitulatif(s) de dons";
			test.describe ('Popin [' + sNomPopin.toLocaleUpperCase() + ']',  async () => {

				test ('Button [RENVOYER RECAPITULATIF] - Click',  async () => {
					await fonction.clickAndWait(pageDonsRecap.buttonRenvoyerRecapitulatif, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})
				
				test ('Button [CONFIRMER] - Click',  async () => {
					await fonction.clickAndWait(pageDonsRecap.pPrrdButtonConfirmer, page);
				})

				test ('** Wait Until Spinner Off **', async () => {
					await fonction.waitForSpinner(pageDonsRecap.pPspinner2)
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , false);
				})

			})

		})

	})

	test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})

