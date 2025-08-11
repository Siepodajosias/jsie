/**
 * 
 * @author JOSIAS SIE
 * @since 2024-12-30
 *  
 */
const xRefTest      = "DON_BEN_EAT";
const xDescription  = "Envoyer une Attestation";
const xIdTest       = 4725;
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

//--------------------------------------------------------------------------------------------//

test.describe.serial ('[' + xRefTest + '] - ' + xDescription + ' : ', () => {

	test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();		
		await fonction.openUrl(page);
	})

	test('Connexion', async () => {
		await fonction.connexion(page);
	})
	
	test.describe ('Page [BENEFICIAIRES]',  async () => {

		var sNomPage:string = 'beneficiaires';

		test('Page [BENEFICIAIRES] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		test.describe ('Onglet [BENEFICIAIRES]',  async () => {

			test('InputFiltre [NOM DU BENEFICIAIRE] = "' + sNomBeneficiaire + '"',  async () => {
				await fonction.sendKeys(pageBenefBenef.dataGridInputNomBeneficiaire, sNomBeneficiaire, false, "Nom du bénéficiaire");
				await fonction.wait(page, 800);
			})

			test('CheckBox [LISTE BENEFICIARES][first] - Click',  async () => {
				var isVisible = await pageBenefBenef.checboxListeBeneficiaire.first().isVisible();
				if(isVisible){
					await fonction.clickElement(pageBenefBenef.checboxListeBeneficiaire.nth(0));
				}
			})

			test('Button [ENVOYER ATTESTATIONS ] - Click',  async () => {
				await fonction.clickAndWait(pageBenefBenef.buttonEnvoyerAttestion, page);
			})

			var sNomPopin:string = "ENVOIE D'UNE ATTESTATION";
			test.describe ('Popin [' + sNomPopin + ']',  async () => {            
				test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})

				test('DatePicker [DATE] = "Aujourd\'hui"',  async () => {
					await fonction.clickElement(pageBenefBenef.pPeadatePicker);
					await fonction.clickElement(pageBenefBenef.pPeadatePickerAujourdhui);    
				})

				test('DatePicker [DATE] - UnClick',  async () => {
					await fonction.clickElement(pageBenefBenef.pPeadatePicker);           
				})
  
				test('Button [ENVOYER] - Click',  async () => {    
					await fonction.clickAndWait(pageBenefBenef.pPeaButtonEnvoyer, page);
					var isVisible = await pageBenefBenef.pPmbDivAlert.isVisible();
					if(isVisible){
						await fonction.clickElement(pageBenefBenef.pPeaButtonAnnuler);
					}else{
						log.set("Attestation Envoyée avec succès");
					}
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