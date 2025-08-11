/**
 * 
 * @description Ajouter un label possible sur un article
 * 
 * @author JOSIAS SIE
 *  Since 2025-02-12
 */

const xRefTest      = "NOM_SLP_LPA";
const xDescription  = "Supprimer un label possible sur un article";
const xIdTest       =  9965;
const xVersion      = '3.0';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'NOMEMCLATURE',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['codeArticle', 'groupeArticle', 'label', 'caracteristique'],
	fileName    : __filename
}

//----------------------------------------------------------------------------------------

import { test, type Page, expect }   from '@playwright/test';

import { TestFunctions }             from "@helpers/functions";
import { Log }                       from "@helpers/log";
import { Help }                      from '@helpers/helpers';

import { MenuNomenclature }          from "@pom/NOM/menu.page";
import { Caracteristique }           from '@pom/NOM/caracteristiques.page';
import { GroupeArticle }             from '@pom/NOM/groupe-article.page';
import { Article }                   from "@pom/NOM/articles.page";

import { AutoComplete, CartoucheInfo}from '@commun/types';

//----------------------------------------------------------------------------------------

let page           : Page;
let menu           : MenuNomenclature;
let pageArticle    : Article;
let pageGpArticle  : GroupeArticle;
let pageCaracterist: Caracteristique;

const log          = new Log();
const fonction     = new TestFunctions(log);

//----------------------------------------------------------------------------------------
const sCodeArticle   = fonction.getInitParam('codeArticle','5070');
const sGroupeArticle = fonction.getInitParam('groupeArticle','Fruits et légumes');
const sLabel         = fonction.getInitParam('label','label');
const sCaracteristque= fonction.getInitParam('caracteristique', 'label possible');
//----------------------------------------------------------------------------------------
const sCode          = 'TA_CODE_' + fonction.getToday('FR');
//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page           = await browser.newPage(); 
	menu           = new MenuNomenclature(page, fonction);
	pageGpArticle  = new GroupeArticle(page);
	pageCaracterist= new Caracteristique(page);
	pageArticle    = new Article(page);
	const helper   = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + '] - ' + xDescription , () => {

	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test ('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe ('Page [CARACTERISTIQUE]', async () => {    

		var currentPage:string  = 'caracteristiques';

		test('Page [CARACTERISTIQUE] - Click', async () => {
			await menu.click(currentPage, page); 
		})              
		
		test('InputField [DESIGNATION] = "' + sLabel + '"', async () => {
			await fonction.sendKeys(pageCaracterist.inputSearchDesignation, sLabel, false,'Label');
			await fonction.wait(page,250);
		})

		test('Tr [CARACTERISTIQUE] - Check', async () => {
			expect(await pageCaracterist.trCaracteristique.count()).toBeGreaterThanOrEqual(2);
		})

		test('Tr [CARACTERISTIQUE][LABEL POSSIBLE] - Click', async () => {
			await fonction.clickAndWait(pageCaracterist.trCaracteristique.locator('.col-designation').filter({hasText: sCaracteristque}), page);
		})

		test.describe ('DataGrid [VALEURS]', async () => {            
			test('InputField [CODE][DESIGNATION] = "' + sCode + '"', async () => {
				await fonction.sendKeys(pageCaracterist.inputCodeDesignation, sCode, false, 'Code');
				await fonction.wait(page, 500);
			})

			test('Td [CODE][DESIGNATION] - Click', async () => {
				await pageCaracterist.tdDesignation.hover();
				await fonction.clickElement(pageCaracterist.tdActions);
			})

			test('Button [CONFIRMER] - Click', async () => {
				await fonction.clickElement(pageCaracterist.buttonConfirmer0.nth(0));
			})
		})
	})

	test.describe ('Page [GROUPE ARTICLE]', async () => {    

		var currentPage:string  = 'groupeArticle';

		test('Page [ARTICLE] - Click', async () => {
			await menu.click(currentPage, page); 
		})              
		
		test('Li [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
			await fonction.clickAndWait(pageGpArticle.nodeGroupesArticle.locator('span.p-treenode-label').filter({hasText: sGroupeArticle}), page);
		})

		test('DataGrid [CARACTERISTIQUE] - Check', async () => {
			await fonction.isDisplayed(pageGpArticle.dataGridCaracteristique);
		})

		test('InputField [CARACTERISTIQUE] = "' + sCaracteristque + '"', async () => {
			await fonction.sendKeys(pageGpArticle.inputCaracteristique, sCaracteristque, false, sCaracteristque);
			await fonction.wait(page, 500);
		})

		test('Td [CARACTERISTIQUE] = "' + sCaracteristque + '"', async () => {
			await pageGpArticle.tdCaracteristique.hover();
			await fonction.clickElement(pageGpArticle.tdActions);
		})

		test('Button [CONFIRMER] - Click', async () => {
			await fonction.clickElement(pageGpArticle.buttonConfirmer0.nth(0));
		})
	})

	test.describe ('Page [ARTICLE]', async () => {    

		var currentPage:string  = 'articles';

		test('Page [ARTICLE] - Click', async () => {
			await menu.click(currentPage, page); 
		})              
		
		test('InputField [AUTOCOMPLETE][ARTICLE] = "' + sCodeArticle + '"', async () => {
			var oData:AutoComplete = {
				libelle         :'ARTICLE',
				inputLocator    : pageArticle.inputArticle,
				inputValue      : sCodeArticle,
				choiceSelector  :'button.dropdown-item.ng-star-inserted',
				choicePosition  : 0,
				typingDelay     : 100,
				waitBefore      : 500,
				page            : page,
			}
			await fonction.autoComplete(oData);
		})

		test('Button [RECHERCHER] - Click', async () => {
			await fonction.clickAndWait(pageArticle.buttonRechercher, page);
		})

		test('CheckBox [ARTICLE][0] - Click', async () => {
			await fonction.clickElement(pageArticle.tdListeResultats.first());
		})

		test('Button [MODIFIER] - Click', async () => {
			await fonction.clickAndWait(pageArticle.buttonModifier, page);
		})

		var sNomPopin:string = "Modification de l'article " + sCodeArticle;
		test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {            

			test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
				await fonction.popinVisible(page, sNomPopin, true);
			})

			test.describe('Rubrique [LABEL POSSIBLE]', async () => {
				test('InputField [CARACTERISTIQUE] = "' + sCaracteristque + '"', async () => {
					await fonction.sendKeys(pageArticle.pPmodifArtInputGlobFilt, sCaracteristque, false, 'Caracteristique');
					await fonction.wait(page, 500);
				})
	
				test('Button [VALEUR] - Click', async () => {
					var iNbr = await pageArticle.pPmodifArtButtonValArt.count()
					if(iNbr > 0){
					    await fonction.clickAndWait(pageArticle.pPmodifArtButtonValArt, page);
					}
				})
	
				test('CheckBox [ALL] - Click', async () => {
					var iNbr = await pageArticle.pPmodifArtButtonValArt.count();
					if(iNbr > 0){
						await fonction.clickElement(pageArticle.pModifArtRadioButtonAll);
						await fonction.clickElement(pageArticle.pModifArtRadioButtonAll);
					}
				})
					
				test('Button [OK] - Click', async () => {
					var iNbr = await pageArticle.pPmodifArtButtonValArt.count();
					if(iNbr > 0){
					    await fonction.clickAndWait(pageArticle.pPmodifArtButtonOk, page);
					}
				})
			})

			test.describe('Rubrique [LABEL QUALITE]', async () => {

				test('Button [CLEAR] - Click',async () => {
					await fonction.clickElement(pageArticle.pPmodifClear);
				})

				test('InputField [CARACTERISTIQUE] = Label quatite', async () => {
					await fonction.sendKeys(pageArticle.pPmodifArtInputGlobFilt, 'Label qualite', false, 'Caracteristique');
					await fonction.wait(page, 500);
				})
	
				test('Button [VALEUR] - Click', async () => {
					await fonction.clickAndWait(pageArticle.pPmodifArtButtonValArt, page);
				})
		
				test('CheckBox [ALL] - Click', async () => {
					await fonction.clickElement(pageArticle.pModifArtRadioButtonAll);
					await fonction.clickElement(pageArticle.pModifArtRadioButtonAll);
				})

				test('Button [OK] - Click', async () => {
					await fonction.clickAndWait(pageArticle.pPmodifArtButtonOk, page);
				})
			})

			test('Button [ENREGISTRER] - Click', async () => {
				await fonction.clickAndWait(pageArticle.pPmodifArtButtonEnreg, page);
			})

			test('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () => {
				await fonction.popinVisible(page, sNomPopin, false);
			})
		})
	})

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})