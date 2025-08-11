/**
 * 
 * @author JOSIAS SIE
 * @since 2024-12-17
 *  
 */
const xRefTest      = "DON_BEN_REC";
const xDescription  = "Rechercher un Bénéficiaire";
const xIdTest       = 6567;
const xVersion      = '3.0';

var info: CartoucheInfo = {
	desc        : xDescription,
	appli       : 'DONS',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,    
	help        : [],
	params      : ['nom','ville'],
	fileName    : __filename
}

//------------------------------------------------------------------------------------

import { expect, test, type Page }from '@playwright/test';

import { Help }                   from '@helpers/helpers';
import { TestFunctions }          from '@helpers/functions';
import { Log }                    from '@helpers/log';

import { MenuDon }                from '@pom/DON/menu.page';
import { BeneficiaireDons }       from '@pom/DON/beneficiares-beneficiaires.page';

import { CartoucheInfo }          from '@commun/types/index';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuDon;

let pageBenefBenef      : BeneficiaireDons;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------ 

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

//----------------------------------------------------------------------------------//

const sJddFile          = fonction.getLocalConfig('jddBeneficiaire');
const data              = fonction.readFile(sJddFile);

//----------------------------------------------------------------------------------//

var sNomBenefRechercher = fonction.getInitParam('nom', 'Ta_beneficiaire. '+ fonction.getToday('FR'));
var sVilleBenef         = fonction.getInitParam('ville', data.sVilleBenef);
var sSocietedonatrice   = fonction.getInitParam('societeDonatrice', 'Prosol sas');

//----------------------------------------------------------------------------------//

test.describe.serial('[' + xRefTest + '] - ' + xDescription + ' : ', () =>  {

	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();		
		await fonction.openUrl(page);
	})

	test ('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe ('Page [BENEFICIAIRES]', async () => {

		var sNomPage:string = 'beneficiaires';

		test('Page [BENEFICIAIRES] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		test.describe ('Onglet [BENEFICIAIRES]', async () => {

			test('InputFiltre [NOM DU BENEFICIAIRE] = "' + sNomBenefRechercher + '"', async () => {
				await fonction.sendKeys(pageBenefBenef.dataGridInputNomBeneficiaire, sNomBenefRechercher, false, 'Désignation');
			})

			test('Input [VILLE] = "' + sVilleBenef + '"', async () => {
				await fonction.sendKeys(pageBenefBenef.dataGridInputVille, sVilleBenef, false, 'Ville'); 
				await fonction.wait(page,800); 
		   })

			var nNomCasdeTest:string = 'RECHERCHER UN BENEFICIAIRE';
			var sTexte:string;
			test.describe ('[' + nNomCasdeTest + ']', async () => {
				test('Column [NOM BENEFICIAIRE] = "' + sNomBenefRechercher + '" - Check', async () => {  
					sTexte = await pageBenefBenef.dataGridDonneeBeneficiaire.locator('tr td:nth-child(3)').textContent();
					expect(sTexte).toContain(sNomBenefRechercher);
				})

				test('Column [VILLE] = "' + sVilleBenef + '" - Check', async () => {  
					sTexte = await pageBenefBenef.dataGridDonneeBeneficiaire.locator('tr td:nth-child(4)').textContent();
					expect(sTexte).toContain(sVilleBenef);
				})

				test('Column [Societe] = "' + sSocietedonatrice + '" - Check', async () => {  
					sTexte = await pageBenefBenef.dataGridDonneeBeneficiaire.locator('tr td:nth-child(6)').textContent();
					expect(sTexte).toContain(sSocietedonatrice);
				})
			})
		})
	})

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})
