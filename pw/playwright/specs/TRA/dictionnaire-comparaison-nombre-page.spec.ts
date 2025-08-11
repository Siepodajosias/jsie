/**
 * 
 * @author JOSIAS SIE
 * @since 2025-01-03
 */

const xRefTest      = "TRA_DIC_CPA";
const xDescription  = "COMPARAISON DU NOMBRE DE PAGES";
const xIdTest       =  7246;
const xVersion      = '3.0';

var info:CartoucheInfo = {
	desc    : xDescription,
	appli   : 'TRADUCTION',
	version : xVersion,
	refTest : [xRefTest],
	idTest  : xIdTest,
	help    : [],
	params  : [],
	fileName: __filename
}

//-------------------------------------------------------------------------------------//  

import { expect, test, type Page }from '@playwright/test';
import { CartoucheInfo}           from '@commun/types';

import { Help }                   from '@helpers/helpers';
import { TestFunctions }          from '@helpers/functions';
import { Log }                    from '@helpers/log';

import { MenuTraduction }         from '@pom/TRA/menu.page';
import { Dictionnaire }           from '@pom/TRA/dictionnaire.page';

//--------------------------------------------------------------------------------------//

let page                : Page;
let pageDictionnaire    : Dictionnaire;
let menu                : MenuTraduction;

const log               = new Log();
const fonction          = new TestFunctions(log);

//--------------------------------------------------------------------------------------//

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage();    
	menu                = new MenuTraduction(page, fonction);
	pageDictionnaire    = new Dictionnaire(page);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async({}, testInfo) => {
	await fonction.close(testInfo);
})
//-------------------------------------------------------------------------------------//

test.describe.serial ('[' + xRefTest + '] - ' + xDescription + ' :', () => {

	test('Ouverture URL :' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test ('Connexion', async () =>  {
		await fonction.connexion(page);
	})

	test.describe ('Page [DICTIONNAIRE]', async () => {

		var sNomPage:string = 'dictionnaire';
		test('Menu [' + sNomPage.toUpperCase() + '] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		var sNomCasdeTest:string = "Comparer le nombre de page en fonction de l'état de traduction";
		test.describe ('[' + sNomCasdeTest.toUpperCase() + ']', async () => {

			test('Differentes comparaisons du nombre de page', async () => {

				//--Premier clique [Tous les éléments]------------------------------------------------------
				await fonction.clickElement(pageDictionnaire.buttonPaginationDernierePage);

				//---------Nombre de page-------------------------------------------------------------------

				var iNbr = await pageDictionnaire.buttonPaginationValeurDernierePage.textContent();
				log.set(iNbr);

				//--Deuxième clique [Elements traduits]-----------------------------------------------------

				await fonction.clickElement(pageDictionnaire.dataGidCheckboxEtatTraduction);
				await fonction.clickElement(pageDictionnaire.buttonPaginationDernierePage);

				//---------Nombre de pages traduites-------------------------------------------------------

				var iNbr1 = await pageDictionnaire.buttonPaginationValeurDernierePage.textContent();
				log.set(iNbr1);

				//---------Comparaison avec le nombre de page précedent------------------------------------

				expect(iNbr1).not.toContain(iNbr);
				
				//--Troisième clique [Non traduit] -------------------------------------------------

				await fonction.clickElement(pageDictionnaire.dataGidCheckboxEtatTraduction);
				await fonction.clickElement(pageDictionnaire.buttonPaginationDernierePage);

				var iNbr2 = await pageDictionnaire.buttonPaginationValeurDernierePage.textContent();
				log.set(iNbr2);

				//---------Comparaison avec le nombre de page précedent------------------------------------
				expect(iNbr2).not.toContain(iNbr1);
			})
		})
	})

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})