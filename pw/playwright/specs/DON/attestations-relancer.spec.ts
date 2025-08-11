/**
 * 
 * @author JOSIAS SIE
 * @since 2025-01-01
 *  
 */
const xRefTest      = "DON_SAT_REA";
const xDescription  = "Relancer Envoi Attestation";
const xIdTest       = 4729;
const xVersion      = '3.1';

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

//---------------------------------------------------------------------------------------------//

let page                : Page;
let menu                : MenuDon;

let pageBenefSuiviAttest: SuiviAttestationsDons;

const log               = new Log();
const fonction          = new TestFunctions(log);

//---------------------------------------------------------------------------------------------//

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

//--------------------------------------------------------------------------------------------//

test.describe.serial ('[' + xRefTest + '] - ' + xDescription + ' : ', () => {

	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();		
		await fonction.openUrl(page);
	})

	test ('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe ('Page [BENEFICIAIRES]', async () => {

		var sNomPage:string = 'beneficiaires';

		test ('Page [BENEFICIAIRES] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		var sNomOnglet:string = 'SUIVI DES ATTESTATIONS';
		test.describe ('Onglet [' + sNomOnglet + ']', async () => {

			test ('Onglet [' + sNomOnglet + '] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'suiviAttestations', page);
			})

			test ('Header [STATUS] - Click', async () => {
				await fonction.clickElement(pageBenefSuiviAttest.dataGridStatut);
			})

			test ('CheckBox [LISTE DES ATTESTATIONS][0] - Click', async () => {
				await fonction.clickElement(pageBenefSuiviAttest.checkBoxAttestations.nth(0));
			})
		
			var sNomPopin:string = 'CONFIRMATION DE LA RELANCE';
			test.describe ('Popin [' + sNomPopin + ']', async () => { 

				test ('Button [RELANCER] - Click', async () => {
					await fonction.clickAndWait(pageBenefSuiviAttest.buttonRelancer, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})
			   
				test ('Button [CONFIRMER] - Click', async () => {  
					await fonction.clickAndWait(pageBenefSuiviAttest.pPcrButtonConfirmer, page);
				})

				test ('** Wait Until Spinner Off **', async () => {
					await fonction.waitForSpinner(pageBenefSuiviAttest.pPcrSpinner);
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
