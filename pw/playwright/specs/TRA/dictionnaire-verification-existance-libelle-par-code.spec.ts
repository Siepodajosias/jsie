/**
 * 
 * @author JOSIAS SIE
 * @since 2025-01-06
 */

const xRefTest      = "TRA_DIC_VEC";
const xDescription  = "Vérifier l'Existence du libelle d'un Element par son Code";
const xIdTest       = 7248;
const xVersion      = '3.0';

var info:CartoucheInfo = {
	desc    : xDescription,
	appli   : 'TRADUCTION',
	version : xVersion,
	refTest : [xRefTest],
	idTest  : xIdTest,
	help    : [],
	params  : ['codeArticle','libelle'],
	fileName: __filename
}

//------------------------------ MODULES A IMPORTER -------------------------------------------//  

import { test, type Page }from '@playwright/test';
import { CartoucheInfo}   from '@commun/types';

import { Help }           from '@helpers/helpers';
import { TestFunctions }  from '@helpers/functions';
import { Log }            from '@helpers/log';

import { MenuTraduction } from '@pom/TRA/menu.page';
import { Dictionnaire }   from '@pom/TRA/dictionnaire.page';
import { expect }         from '@playwright/test';

//---------------------------------------------------------------------------------------------//

let page                : Page;
let pageDictionnaire    : Dictionnaire;
let menu                : MenuTraduction;

const log               = new Log();
const fonction          = new TestFunctions(log);

//---------------------------------------------------------------------------------------------//
var sCodeArticle        = fonction.getInitParam('codeArticle','8672');
var sLibelleArticle     = fonction.getInitParam('libelle','Cipollina');
//---------------------------------------------------------------------------------------------//
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
//--------------------------------------------------------------------------------------------//

test.describe.serial ('[' + xRefTest + '] - ' + xDescription.toUpperCase() + ' :', () => {

	test('Ouverture URL :' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test('Connexion', async () =>  {
		await fonction.connexion(page);
	})

	test.describe ('Page [DICTIONNAIRE]', async () => {

		var sNomPage:string = 'dictionnaire';
		test('Menu [' + sNomPage.toUpperCase() + '] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		var sNomCasdeTest:string = "Vérifier l'existence d'un élément par son code";
		test.describe ('[' + sNomCasdeTest.toUpperCase() + ']', async () => {

			test('InputField [CODE ARTICLE] = "' + sCodeArticle + '"',async () => {
				await fonction.sendKeys(pageDictionnaire.dataGridInputCode, sCodeArticle, false, 'Code article');
			})

			test('Trdata [ELEMENT A TRADUIRE ] - Click', async () => {
				await fonction.clickElement(pageDictionnaire.dataGridElementAtraduire);
			})

			test('TableTraduction [TRADUCTION] = "' + sLibelleArticle + '"', async () => {
				var sInputValue = await pageDictionnaire.dataGridInputTraduction.nth(0).inputValue();
				expect(sInputValue).toEqual(sLibelleArticle);
			})
		})
	})

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})
