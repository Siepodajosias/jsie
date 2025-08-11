/**
 * 
 * @author CHRIS ANDY YOAN WAOUNWA
 *  Since 29 - 01 - 2025
 */

const xRefTest 		= "MAG_ACT_ADD";
const xDescription 	= "Création d'une actualité";
const xIdTest 		= 9486;
const xVersion 		= '3.0';

var info:CartoucheInfo = {
	desc		: xDescription,
	appli		: 'MAGASIN',
	version		: xVersion,
	refTest		: [xRefTest],
	idTest		: xIdTest,
	help		: [],
	params		: ['titreActualite'],
	fileName	: __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page }          from '@playwright/test';

import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';
import { Help }                     from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }              from '@pom/MAG/menu.page';
import { AutorisationsActualite }   from '@pom/MAG/autorisations-actualite.page';
import { CartoucheInfo } 			from '@commun/types';

//-------------------------------------------------------------------------------------

let page                    	: Page;
let menu                    	: MenuMagasin;
let pageActualites          	: AutorisationsActualite;

const log                   	= new Log();
const fonction              	= new TestFunctions(log);

const sTitre:string        		= fonction.getInitParam('titreActualite', 'TA_Actualité');
const iNbMagasins:number    	= Math.floor(fonction.random() * 10) + 3;

const sCorpstexte:string    	= 'TA : Lorem Ipsum[50]' + fonction.getBadChars();
const aCategories:string 		= fonction.getLocalConfig('actualiteCategories');
const sMagasin:string 			= fonction.getLocalConfig('actualiteMagasin');

const sEngagements:string 		= 'Engagements';
const sApprovisionnement:string	= 'Approvisionnement';

//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page			= await browser.newPage();
	menu			= new MenuMagasin(page, fonction);
	pageActualites 	= new AutorisationsActualite(page);
	const helper 	= new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({ }, testInfo) => {
	await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({context}) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test ('Connexion', async () => {
		await fonction.connexion(page);
		await menu.removeArlerteMessage(page);
	})

	test.describe('Page [ACCUEIL]', async () => {

		test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
			await fonction.waitTillHTMLRendered(page);
			var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
			if (isVisible) {
				await menu.removeArlerteMessage(page);
			} else {
				log.set('Link [BROWSER SECURITY WARNING] - Click: ACTION ANNULEE');
				test.skip();
			}
		})

	})

	test.describe('Page [AUTORISATIONS]', () => {

		var pageName:string = 'autorisations';

		test ('Page [AUTORISATIONS] - Click', async () => {
			await menu.click(pageName, page);
		})
		
		test ('Message [ERREUR] - Is NOT Visible', async () => {
			await fonction.isErrorDisplayed(false, page);
		})

		test.describe('Onglet [ACTUALITE]', async () => {

			test ('Onglet [ACTUALITE] - Click', async () => {
				await menu.clickOnglet(pageName, 'actualite', page);
			});

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			});

		})

		var nomPopin:string = 'Création d\'une actualité'.toUpperCase();
		test.describe('Popin [' + nomPopin + ']', async () => {

			test ('Button [CREER] - Click', async () => {
				await fonction.clickAndWait(pageActualites.buttonCreer, page);
			})

			test ('InputField [TITRE] = "' + sTitre + '"', async () => {
				await fonction.sendKeys(pageActualites.inputTitre,sTitre, false, 'Titre');
			})

			test ('TextField [CORPS DU TEXTE]  = "' + sCorpstexte + '"' , async () => {
				await pageActualites.containertext.pressSequentially('TA : ' + await fonction.getLoremIpsum(50) + fonction.getBadChars());
				await fonction.addDataSheet('TextArea', 'Corps du Texte', sCorpstexte);
			})

			test ('Checkbox [IMPORTANT] - Click', async () => {
				await fonction.clickElement(pageActualites.checkBoxImportant);
			})

			test ('Autocomplete [TAGS] - Click' , async () => {
				await fonction.clickElement(pageActualites.sTagsAutocomplete);
			})

			test ('InputField Tags [AUTOCOMPLETE ENGAGEMENTS] = "Engagements"', async () => {
				const oDataFirstTag = {
					libelle			: 'ENGAGEMENTS',
					inputLocator	: pageActualites.sTagsAutocomplete,
					inputValue		: sEngagements,  
					choiceSelector	: '.p-autocomplete-items',
					choicePosition	: 0,  
					typingDelay		: 150,
					waitBefore		: 1000,
					page: page
				};
				await fonction.autoComplete(oDataFirstTag);
			})

			test ('InputField Tags [AUTOCOMPLETE ] = "Approvisionnement"', async () => {
				const oDataSecondTag = {
						libelle			: 'APPROVISIONNEMENT',
						inputLocator	: pageActualites.sTagsAutocomplete,
						inputValue		: sApprovisionnement, 
						choiceSelector	: '.p-autocomplete-items',
						choicePosition	: 0,  
						typingDelay		: 150,
						waitBefore		: 700,
						page: page
				};				
				await fonction.autoComplete(oDataSecondTag);
			})

		})

		test ('Listbox [GROUPE ARTICLE]  = "rnd"', async () => {
			const randomCategory = aCategories[Math.floor(fonction.random() * aCategories.length)]; 
			await fonction.clickElement(pageActualites.sGrpeArticle);
			await fonction.clickElement(pageActualites.sListboxArticle.filter({ hasText: randomCategory }).nth(0));
			log.set('Groupe Article : ' + randomCategory);
		});

		test ('CheckBox [MAGASIN][1-rnd] - Select', async () => {
			
			//-- Attente de l'affichage des magasins
			await pageActualites.pTdLibeleMagasin.first().waitFor();

			const iNbChoix:number = await pageActualites.pTdLibeleMagasin.count();
			log.set('Sélection de ' + iNbMagasins + '/' + iNbChoix + ' Magasins');

			//cliquer sur Albi
			await fonction.clickElement(pageActualites.pTdLibeleMagasin.filter({ hasText: sMagasin }));
			for (let i:number = 1; i <= iNbMagasins; i++) {
				const iCible:number = Math.floor(fonction.random() * iNbChoix);
				const sMagasinCible = await pageActualites.pTdLibeleMagasin.nth(iCible).innerText();

				//sauter l'itération si on tombe sur Albi
				if(sMagasinCible === sMagasin){
					continue;
				} else {
					await fonction.clickElement(pageActualites.pTdLibeleMagasin.nth(iCible));
					const sMagasinSelectionne = await pageActualites.pTdLibeleMagasin.nth(iCible).innerText();
					log.set('Magasin #' + i + ' : ' + sMagasinSelectionne);
				}
			}
			
		})

		test ('Button [ENREGISTRER] - Click', async () => {
			await fonction.clickElement(pageActualites.pButtonEnregistrerActualite);
		})

		test ('** Wait Until Spinner Off #2 **', async () => {
			await fonction.waitForSpinner(pageActualites.pPspinner);
		})

		test ('Popin [' + nomPopin + '] - Is NOT Visible', async () => {
			await fonction.popinVisible(page, nomPopin, false);  
		})

	}) // End describe Page [AUTORISATIONS]

	test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

}) // End Test