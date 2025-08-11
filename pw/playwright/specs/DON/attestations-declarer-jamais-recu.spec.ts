/**
 * 
 * @author JOSIAS SIE
 * @since 2025-01-01
 *  
 */
const xRefTest      = "DON_SAT_DJR";
const xDescription  = "Declarer Une Attestation Jamais Reçue";
const xIdTest       = 4733;
const xVersion      = '3.0';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'DONS',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : [],
	fileName    : __filename
}

//--------------------------------------------------------------------------------------------// 

import { test, type Page }      from '@playwright/test';

import { Help }                 from '@helpers/helpers';
import { TestFunctions }        from '@helpers/functions';
import { Log }                  from '@helpers/log';

import { MenuDon }              from '@pom/DON/menu.page';
import { SuiviAttestationsDons }from '@pom/DON/beneficiaire-suivi-attestations.page';
import { CartoucheInfo }        from '@commun/types/index';

//--------------------------------------------------------------------------------------------//

let page                : Page;
let menu                : MenuDon;

let pageBenefSuiviAttest: SuiviAttestationsDons;

const log               = new Log();
const fonction          = new TestFunctions(log);

//-------------------------------------------------------------------------------------------//

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage();
	menu                = new MenuDon(page, fonction);    
	pageBenefSuiviAttest= new SuiviAttestationsDons(page);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------//

test.describe.serial ('[' + xRefTest + '] - ' + xDescription + ' : ', function () {

	test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();		
		await fonction.openUrl(page);
	})

	test('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe ('Page [BENEFICIAIRES]', async () => {

		var sNomPage:string = 'beneficiaires';

		test('Page [BENEFICIAIRES] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		var sNomOnglet:string = 'SUIVI DES ATTESTATIONS';
		test.describe ('Onglet [' + sNomOnglet + ']', async () => {

			test('Onglet [' + sNomOnglet + '] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'suiviAttestations', page);
			})

			test('Header [STATUS] - Click x 2 ', async () => {
				await fonction.clickElement(pageBenefSuiviAttest.dataGridListBoxStatut);   
			})

			test('CheckBox [STATUS:ENVOYER] - Click ', async () => {
				await fonction.clickElement(pageBenefSuiviAttest.checkBoxStatutEnvoye);
			}) 

			test('CheckBox [LISTE DES ATTESTATIONS][0]  - Click', async () => {
				await fonction.wait(page, 500);
				await fonction.clickElement(pageBenefSuiviAttest.checkBoxAttestations.nth(0));
			})

			var sNomPopin:string = 'DECLARER JAMAIS RECU';
			test.describe ('Popin [' + sNomPopin + ']', async () => {

				test('Button [DECLARER JAMAIS RECU] - Click', async () => {
					await fonction.clickAndWait(pageBenefSuiviAttest.buttonDeclarerJamaisRecu, page);
				})

				test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})

				test('Button [CONFIRMER] - Click', async () => {
					await fonction.clickAndWait(pageBenefSuiviAttest.pPdajrButtonConfirmer, page);
				})

				test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , false);
				})
			})
		})
	})

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})

