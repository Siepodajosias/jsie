/**
 * 
 * @author JOSIAS SIE
 * @since 2024-12-23
 *  
 */
const xRefTest      = "DON_REC_VDE";
const xDescription  = "Visualiser le détail";
const xIdTest       = 5935;
const xVersion      = '3.0.1';

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

import { test, type Page }   from '@playwright/test';

import { Help }              from '@helpers/helpers';
import { TestFunctions }     from '@helpers/functions';
import { Log }               from '@helpers/log';

import { MenuDon }           from '@pom/DON/menu.page';
import { RecapitulatifsDons }from '@pom/DON/dons-recapitulatif.page';

import { CartoucheInfo }     from '@commun/types/index';

//--------------------------------------------------------------------------------------------//

let page                : Page;
let menu                : MenuDon;

let pageDonsRecap       : RecapitulatifsDons;

const log               = new Log();
const fonction          = new TestFunctions(log);

//-------------------------------------------------------------------------------------------//

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

//------------------------------------------------------------------------------------------//

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

		var sNomOnglet:string = 'RECAPITULATIF';
		test.describe('Onglet [' + sNomOnglet + ']', async () => {

			test('Onglet [' + sNomOnglet + '] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'recapitulatifs', page);
			})
	
			test('CheckBox [LISTE DES RECAPITULATIFS][0] - Click', async () => {
				await fonction.clickElement(pageDonsRecap.checkboxListeRecapitulatif.nth(0));
			})

			test('Button [VISUALISER LE DETAIL] - Click', async () => {
				await fonction.clickAndWait(pageDonsRecap.buttonVisualiserDetail, page);
			})

			var sNomPopin:string = 'VISUALISER LE DETAIL';
			test.describe(' [' + sNomPopin + ']', async () => {

				test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})

				test('Button [FERMER] - Click', async () => {
					await fonction.clickElement(pageDonsRecap.pPvrButtonFermer);
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

