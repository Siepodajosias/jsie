/**
 * 
 * @author JOSIAS SIE
 * @since 2024-12-31
 *  
 */
const xRefTest      = "DON_BEN_BLO";
const xDescription  = "Bloquer un Bénéficiaire";
const xIdTest       = 5934;
const xVersion      = '3.0';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'DONS',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['nom'],
	fileName    : __filename
}

//------------------------------------------------------------------------------------// 

import { test, type Page } from '@playwright/test';

import { Help }            from '@helpers/helpers';
import { TestFunctions }   from '@helpers/functions';
import { Log }             from '@helpers/log';

import { MenuDon }         from '@pom/DON/menu.page';
import { BeneficiaireDons }from '@pom/DON/beneficiares-beneficiaires.page';

import { CartoucheInfo }   from '@commun/types/index';

//------------------------------------------------------------------------------------//

let page                : Page;
let menu                : MenuDon;

let pageBenefBenef      : BeneficiaireDons;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------//

var sNomBenefrechercher = fonction.getInitParam('nom', 'TA_Beneficiaire. ' + fonction.getToday('FR'));

//------------------------------------------------------------------------------------//

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage();
	menu                = new MenuDon(page, fonction);    
	pageBenefBenef      = new BeneficiaireDons(page);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------//

test.describe.serial ('[' + xRefTest + '] - ' + xDescription + ' : ', () => {

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

		test.describe ('Onglet [BENEFICIAIRES]', async () => {

			var sNomPopin:string = 'BLOQUER UN BENEFICIAIRE';

			test.describe ('Button [' + sNomPopin + ']', async () => {
				test('InputFiltre [NOM DU BENEFICIAIRE] = "' + sNomBenefrechercher + '"',  async () => {
					await fonction.sendKeys(pageBenefBenef.dataGridInputNomBeneficiaire, sNomBenefrechercher, false, "Nom du bénéficiaire");
					await fonction.wait(page, 800);
				})
	
				test('CheckBox [LISTE BENEFICIARES][first] - Click',  async () => {
					await fonction.clickElement(pageBenefBenef.checboxListeBeneficiaire.first());
				})

				test('Button [BLOQUER] - Click', async () => {
					await fonction.clickElement(pageBenefBenef.buttonBloquerBeneficiaire);
				})
			})
		})
	})

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})