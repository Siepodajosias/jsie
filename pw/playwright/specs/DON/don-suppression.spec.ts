/**
 * 
 * @author JOSIAS SIE
 * @since 2024-12-16
 *  
 */
const xRefTest      = "DON_DET_SUD";
const xDescription  = "Supprimer Un DON";
const xIdTest       = 4714;
const xVersion      = '3.2.1';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'DONS',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,    
	help        : [],
	params      : ['societeDonatrice', 'beneficiaire'],
	fileName    : __filename
}

//------------------------------------------------------------------------------------// 

import {test, type Page }             from '@playwright/test';

import { Help }                       from '@helpers/helpers';
import { TestFunctions }              from '@helpers/functions';
import { Log }                        from '@helpers/log';

import { MenuDon }                    from '@pom/DON/menu.page';
import { DetailDons }                 from '@pom/DON/dons-detail-dons.page';

import { AutoComplete, CartoucheInfo }from '@commun/types';

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

var sSocieteDonatrice   = fonction.getInitParam('societeDonatrice', 'ALENFRUITS');
var sBeneficiaire       = fonction.getInitParam('beneficiaire', data.sBeneficiaire);

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

//-----------------------------------------------------------------------------------//

test.describe.serial ('[' + xRefTest + ']', () => {

	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();		
		await fonction.openUrl(page);
	})

	test ('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe('Page [DONS]', async () => {

		var sNomPage:string = 'dons';

		test ('Page [DONS] - Click', async () => {
			await menu.click(sNomPage, page);
		})    

		var sNomOnglet:string = 'DETAIL DES DONS';
		test.describe ('Onglet [' + sNomOnglet + ']', async () => {

			test ('InputField [SOCIETE DONATRICE] = "' + sSocieteDonatrice + '"', async () => {
				var oData:AutoComplete = {
					libelle         :'SOCIETE DONATRICE',
					inputLocator    : pageDonsDetail.inputSocieteDonatriceDetailDon,
					inputValue      : sSocieteDonatrice,
					choiceSelector  : 'button.dropdown-item:NOT(.btn-link)',
					choicePosition  : 0,
					typingDelay     : 10,
					waitBefore      : 500,
					page            : page
				}
				await fonction.autoComplete(oData);
			})

			test ('InputField [BENEFICIAIRE] = "' + sBeneficiaire + '"', async () => {
				var oData:AutoComplete = {
					libelle         :'BENEFICIAIRE',
					inputLocator    : pageDonsDetail.inputBeneficiaireDetailDon,
					inputValue      : sBeneficiaire,
					choiceSelector  : 'button.dropdown-item:NOT(.btn-link)',
					choicePosition  : 0,
					typingDelay     : 10,
					waitBefore      : 500,
					page            : page
				}
				await fonction.autoComplete(oData);
			})

			test ('Button [RECHERCHER LE DON] - Click', async () => {            
				await fonction.clickAndWait(pageDonsDetail.buttonRechercherlesDons, page);             
			})

			test ('CheckBox [LISTE DONS][0] - Click', async () => {
				await fonction.clickElement(pageDonsDetail.checboxListedesDons.nth(0));
			})

			test ('Button [SUPPRIMER] - Click', async () => {
				await fonction.clickAndWait(pageDonsDetail.buttonSupprimerDon, page);
			})

			var sNomPopin:string = "Suppression d'un don";
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})

				test ('Button [SUPPRIMER] - Click', async () => {            
					await fonction.clickAndWait(pageDonsDetail.pPsdButtonSupprimer, page);                        
				})

				test ('** Wait Until Spinner Off **', async () => {
					await fonction.waitForSpinner(pageDonsDetail.pPspinner);
				});

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
