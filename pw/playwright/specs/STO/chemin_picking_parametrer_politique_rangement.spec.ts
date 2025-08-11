/**
 * 
 * @author JOSIAS SIE
 *  Since 27 - 05 - 2025
 * 
 */

const xRefTest      = "STO_RAN_MOD";
const xDescription  = "Paramétrer la politique de rangement pour un chemin de Picking";
const xIdTest       =  9710;
const xVersion      = '3.1';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'STOCK',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['plateforme','designation','nomZone'],
	fileName    : __filename
}

//----------------------------------------------------------------------------------------

import { expect, test, type Page}from '@playwright/test';

import { TestFunctions }         from "@helpers/functions";
import { Log }                   from "@helpers/log";
import { Help }                  from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }             from "@pom/STO/menu.page";

import { CartoucheInfo }         from '@commun/types';
import {ReferentielRangement}    from '@pom/STO/referentiel-rangement.page'; 

//----------------------------------------------------------------------------------------

let page              : Page;

let menu              : MenuStock;
let pageRefRangement  : ReferentielRangement;
const log             = new Log();
const fonction        = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const sPlateforme     = fonction.getInitParam('plateforme', 'Cremlog');
const sNomZone        = fonction.getInitParam('nomZone', 'Z1');
const sNomChemin      = fonction.getInitParam('designation','Laits, compotes, pâtes & œufs');

//----------------------------------------------------------------------------------------
process.env.ROLE      = 'RESPONSABLE LOGISTIQUE';// Connexion par défaut avec le profil ayant le Role RESPONSABLE LOGISTIQUE
//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage(); 
	menu                = new MenuStock(page, fonction);
	pageRefRangement    = new ReferentielRangement(page);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

	test('Ouverture URL :' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test('Connexion', async () => {
		await fonction.connexion(page);
	})

	test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async() => {            
		await menu.selectPlateforrme(page, sPlateforme);                       // Sélection d'une plateforme par défaut
	})

	test.describe ('Page [REFERENTIEL]', async() => {    

		var currentPage:string = 'referentiel';
		test('Page [REFERENTIEL] - Click', async () => {
			await menu.click(currentPage, page);
		})
	   
		test.describe ('Onglet [RANGEMENT]', async () => {        
			
			test('Onglet [RANGEMENT] - Click', async () => {
				await menu.clickOnglet(currentPage, 'rangement', page);
			})   

			test('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);   // Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test('Input [CHEMIN DE PICKING] = "' + sNomChemin + '"', async () => {
				await fonction.sendKeys(pageRefRangement.inputCheminPicking.nth(0), sNomChemin, false, 'Chemin de picking');
				await fonction.waitForDomStable(page);
			})

			test('Tr [CHEMIN DE PICKING] - Click', async () => {
				await fonction.clickElement(pageRefRangement.trCheminPicking);
			})

			test('Button [MODIFIER] - Is activated', async () => {
				await expect(pageRefRangement.buttonModifier).toBeEnabled();
			})

			test('Button [MODIFIER] - Click', async () => {
				await fonction.clickAndWait(pageRefRangement.buttonModifier, page);
			})

			var sNomPopin:string = 'Paramétrage du rangement du chemin de picking';
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', () => {   

				test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin, true);
				}) 

				test('InputField [POLITIQUE DE RANGEMENT] - Click', async () => {
					await fonction.clickAndWait(pageRefRangement.pInputFieldPolitiqueRangement, page);
				})

				test('Li [POLITIQUE DE RANGEMENT] >= 1', async () => {
					expect(await pageRefRangement.pLiPolitiqueRangement.count()).toBeGreaterThanOrEqual(1);
				})

				test('Li [POLITIQUE DE RANGEMENT] - Click', async () => {
					await fonction.clickElement(pageRefRangement.pLiPolitiqueRangement.last());
				})

				test.describe ('Div [ZONE DE RANGEMENT]', async () => {
					test('Input [ZONE] = "' + sNomZone + '"', async () => {
						await fonction.sendKeys(pageRefRangement.pInputZoneRangement, sNomZone, false, 'Zone');
						await fonction.waitForDomStable(page);
					})

					test('CheckBox [PICKING] - Click', async () => {
						await fonction.clickElement(pageRefRangement.pCheckBoxZoneRangement.nth(0));
					})

					test('Button [PICKING] - Click', async () => {
						await fonction.clickAndWait(pageRefRangement.pButtonZoneRangement.nth(0), page);
					})

					test('Svg [PICKING] - Is Visible', async () => {
						await fonction.isDisplayed(pageRefRangement.pSvgZoneRangement.first());
					})
				})

				test('Button [ENREGISTRER] - Click', async () => {
					await fonction.clickAndWait(pageRefRangement.pButtonEnregistrer, page);
				})

				test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin, false);
				})                      
			})
		})  //-- End Describe Onglet
	})  //-- End Describe Page

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})