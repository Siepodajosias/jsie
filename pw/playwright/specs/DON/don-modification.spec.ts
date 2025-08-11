/**
 * 
 * @author JOSIAS SIE
 * @since 2024-12-13
 *  
 */
const xRefTest      = "DON_DET_MOD";
const xDescription  = "Modifier Un DON";
const xIdTest       = 5660;
const xVersion      = '3.1.1';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'DONS',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,    
	help        : [],
	params      : ['societeDonatrice', 'beneficiaire', 'montant','commentaire'],
	fileName    : __filename
}

//------------------------------------------------------------------------------------//

import { test, type Page }           from '@playwright/test';

import { Help }                      from '@helpers/helpers';
import { TestFunctions }             from '@helpers/functions';
import { Log }                       from '@helpers/log';

import { MenuDon }                   from '@pom/DON/menu.page';
import { DetailDons }                from '@pom/DON/dons-detail-dons.page';

import { AutoComplete, CartoucheInfo}from '@commun/types/index';

//------------------------------------------------------------------------------------//

let page                : Page;
let menu                : MenuDon;
let pageDonsDetail      : DetailDons;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------//

const sJddFile          = fonction.getLocalConfig('jddDetailDon');
const data              = fonction.readFile(sJddFile);

//-----------------------------------------------------------------------------------//

const sSociete          = data.sSocieteDonatrice;
const sBenef            = data.sBeneficiaire;

var sSocieteDonatrice   = fonction.getInitParam('societeDonatrice', 'ALENFRUITS');
var iMontantDon         = fonction.getInitParam('montant', 10);
var sCommentaire        = fonction.getInitParam('commentaire', ' Modifié le ' + fonction.getToday('FR'));

//-----------------------------------------------------------------------------------//

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage();
	menu                = new MenuDon(page, fonction);    
	pageDonsDetail      = new DetailDons(page);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

test.describe.serial ('[' + xRefTest + ']', () => {

	test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();		
		await fonction.openUrl(page);
	})

	test('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe('Page [DONS]', async () => {

		var sNomPage:string = 'dons';

		test('Page [DONS] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		var sNomOnglet:string = 'DETAIL DES DONS';
		test.describe('Onglet [' + sNomOnglet + ']', async () => {

			test('InputField [SOCIETE DONATRICE] = "' + sSociete + '"', async () => {
				var oData:AutoComplete = {
					libelle         :'SOCIETE DONATRICE',
					inputLocator    : pageDonsDetail.inputSocieteDonatriceDetailDon,
					inputValue      : sSociete,
					choiceSelector  : 'button.dropdown-item:NOT(.btn-link)',
					choicePosition  : 0,
					typingDelay     : 100,
					waitBefore      : 500,
					page            : page
				}
				await fonction.autoComplete(oData);
			})

			test('InputField [BENEFICIAIRE] = "' + sBenef + '"', async () => {
				var oData:AutoComplete = {
					libelle         :'BENEFICIAIRE',
					inputLocator    : pageDonsDetail.inputBeneficiaireDetailDon,
					inputValue      : sBenef,
					choiceSelector  : 'button.dropdown-item:NOT(.btn-link)',
					choicePosition  : 0,
					typingDelay     : 100,
					waitBefore      : 500,
					page            : page
				}
				await fonction.autoComplete(oData);
			})

			test('Button [RECHERCHER LE DON] - Click', async () => {            
				await fonction.clickAndWait(pageDonsDetail.buttonRechercherlesDons, page);             
			})

			test ('Header [DATE] - Click x 2', async () => {
				await fonction.clickElement(pageDonsDetail.dataGridDate);
				await fonction.clickElement(pageDonsDetail.dataGridDate);
			})

			test('CheckBox [LISTE DONS][0] - Click', async () => {
				await fonction.clickElement(pageDonsDetail.checboxListedesDons.nth(0));
			})

			var sNomPopin:string = 'MODIFIER UN DON';
			test.describe ('[' + sNomPopin + ']', async () => {

				test('Button [MODIFIER] - Click', async () => {
					await fonction.clickAndWait(pageDonsDetail.buttonModifierDon, page);
				})

				test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})

				test('InputField [SOCIETE DONATRICE] = "' + sSocieteDonatrice + '"', async () => {
					var oData:AutoComplete = {
						libelle         :'SOCIETE DONATRICE',
						inputLocator    : pageDonsDetail.pPmdInputSocieteDonatrice,
						inputValue      : sSocieteDonatrice,
						clear           : true,
						choiceSelector  : 'button.dropdown-item:NOT(.btn-link)',
						choicePosition  : 0,
						typingDelay     : 100,
						waitBefore      : 500,
						page            : page
					}
					await fonction.autoComplete(oData);
				})

				test('DatePicker [DATE] = "Aujourd\'hui"', async () => {
					await fonction.clickElement(pageDonsDetail.pPmddatePickerModifierDon);
					await fonction.clickElement(pageDonsDetail.datePickermdButtonAjourdhui);
				})

				test('InputField [MONTANT DU DON] = "' + iMontantDon + '"', async () => {
					await fonction.sendKeys(pageDonsDetail.pPmdInputMontantduDon, iMontantDon);
				})

				test('TexteArea [COMMENTAIRE] += "' + sCommentaire + '"', async () => {
					await fonction.sendKeys(pageDonsDetail.pPtextAreaCommentaire, sCommentaire);
				})

				test('Button [ENREGISTER] - Click', async () => {
					await fonction.clickAndWait(pageDonsDetail.pPmdButtonEnregistrer, page);
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