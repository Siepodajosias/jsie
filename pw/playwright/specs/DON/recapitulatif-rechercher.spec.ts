/**
 * 
 * @author JOSIAS SIE
 * @since 2024-12-23
 *  
 */
const xRefTest      = "DON_REC_RRM";
const xDescription  = "Rechercher récapitulatif mensuel";
const xIdTest       = 4717;
const xVersion      = '3.0';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'DONS',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,      
	help        : [],
	params      : ['societeDonatrice','beneficiaire'],
	fileName    : __filename
}

//--------------------------------------------------------------------------------------------// 

import { expect, test, type Page }    from '@playwright/test';

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

//---------------------------------------------------------------------------------------------//

const sJddFile          = fonction.getLocalConfig('jddRecaptitulatif');
const data              = fonction.readFile(sJddFile);

//---------------------------------------------------------------------------------------------//

var sSocieteDonatrice   = fonction.getInitParam('societeDonatrice',  data.sSocieteDonatrice);
var sBeneficiaire       = fonction.getInitParam('beneficiaire', 'Banque alimentaire du nord');

//---------------------------------------------------------------------------------------------//

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

//---------------------------------------------------------------------------------------------//

test.describe.serial ('[' + xRefTest + ']', () => {

	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();		
		await fonction.openUrl(page);
	})

	test ('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe('Page [DONS]', async () => {

		var sNomPage:string  = 'dons';

		test('Page [DONS] - Click', async () => {
			await menu.click(sNomPage, page);
		})
		
		var sNomOnglet:string= 'RECAPITULATIF';
		var sTexte:string;
		test.describe('Onglet [' + sNomOnglet + ']', async () => {

			test('Onglet [' + sNomOnglet + '] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'recapitulatifs', page);
			})
	
			test('InputField [SOCIETE DONATRICE] = "' + sSocieteDonatrice + '"', async () => {
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

			test('InputField [BENEFICIAIRE] = "' + sBeneficiaire + '"', async () => {
				var oData:AutoComplete = {
					libelle         :'BENEFICIAIRE',
					inputLocator    : pageDonsRecap.inputBeneficiaireRecapitulatif,
					inputValue      : sBeneficiaire,
					choiceSelector  : 'button.dropdown-item:NOT(.btn-link)',
					choicePosition  : 0,
					typingDelay     : 100,
					waitBefore      : 500,
					page            : page
				}
				await fonction.autoComplete(oData);
			})

			test('Button [RECHERCHER LES RECAPITULATIFS] - Click', async () => {            
				await fonction.clickAndWait(pageDonsRecap.buttonRechercherRecapitulatif, page);        
			}) 
			
			test('Label [BENEFICIAIRE (VILLE)] = "' +sBeneficiaire + '" - Check', async () => {
				sTexte = await pageDonsRecap.dataGridListeRecapDonnee.locator('tr td:nth-child(2)').nth(0).textContent();
				expect(sTexte).toContain(sBeneficiaire);
			})

			test('Label [SOCIETE DONATRICE] = "' + sSocieteDonatrice + '" - Check', async () => {
				sTexte = await pageDonsRecap.dataGridListeRecapDonnee.locator('tr td:nth-child(3)').nth(0).textContent();
				expect(sTexte.toUpperCase()).toContain(sSocieteDonatrice);
			})
		})
	})

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})
