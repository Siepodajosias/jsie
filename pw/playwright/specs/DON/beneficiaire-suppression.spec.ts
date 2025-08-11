/**
 * 
 * @author JOSIAS SIE
 * @since 2024-12-20
 *  
 */
const xRefTest      = "DON_BEN_DEL";
const xDescription  = "Supprimer Bénéficiaire";
const xIdTest       = 4724;
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

//--------------------------------------------------------------------------------------------// 

import { test, type Page } from '@playwright/test';

import { Help }            from '@helpers/helpers';
import { TestFunctions }   from '@helpers/functions';
import { Log }             from '@helpers/log';

import { MenuDon }         from '@pom/DON/menu.page';
import { BeneficiaireDons }from '@pom/DON/beneficiares-beneficiaires.page';

import { CartoucheInfo }   from '@commun/types/index';

//---------------------------------------------------------------------------------------------// 

let page                : Page;
let menu                : MenuDon;

let pageBenefBenef      : BeneficiaireDons;

const log               = new Log();
const fonction          = new TestFunctions(log);

//---------------------------------------------------------------------------------------------//

var sNomBeneficiaire    = fonction.getInitParam('nom', 'TA_Beneficiaire. ' + fonction.getToday('FR'));

//---------------------------------------------------------------------------------------------//

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

//---------------------------------------------------------------------------------------------//

test.describe.serial('[' + xRefTest + '] - ' + xDescription + ' : ', () =>  {

	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();		
		await fonction.openUrl(page);
	})

	test ('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe ('Page [BENEFICIAIRES]', async () =>  {
		
		var sNomPage:string = 'beneficiaires';

		test('Page [BENEFICIAIRES] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		test.describe ('Onglet [BENEFICIAIRES]', async () =>  {

			test('InputFiltre [STATUS DU BENEFICIAIRE] - Click', async () =>  {
				await fonction.sendKeys(pageBenefBenef.dataGridInputNomBeneficiaire, sNomBeneficiaire);
				await fonction.wait(page,700);
			})

			test('CheckBox [LISTE DES RECAPITULATIFS][0] - Click', async () =>  {  
				await fonction.clickElement(pageBenefBenef.checboxListeBeneficiaire.nth(0));
			})

			test('Button [SUPPRIMER] - Click', async () =>  {
				await fonction.clickAndWait(pageBenefBenef.buttonSupprimerBeneficiaire, page);
			})

			var sNomPopin:string = 'SUPPRIMER UN BENEFICIAIRE';
			test.describe('Popin [' + sNomPopin + ']', async () =>  {

				test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})

				test('Button [SUPPRIMER] - Click', async () =>  {
					await fonction.clickAndWait(pageBenefBenef.pPsbButtonSupprimer, page);                               
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