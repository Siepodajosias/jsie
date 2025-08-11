/**
 * @author JC CALVIERA
 */

const xRefTest      = "NOM_IHM_GLB";
const xDescription  = "Examen de l'IHM Nomenclature";
const xIdTest       =  1095;
const xVersion      = '3.11';

var info:CartoucheInfo = {
	desc    	: xDescription,
	appli   	: 'NOMENCLATURE',
	version 	: xVersion,
	refTest 	: [xRefTest],
	idTest  	: xIdTest,
	help    	: [],
	params  	: [],
	fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page } 			        from '@playwright/test';

import { Help }                    	        from '@helpers/helpers.js';
import { TestFunctions }           	        from '@helpers/functions.js';
import { Log }                              from '@helpers/log.js';

import { MenuNomenclature }        	        from '@pom/NOM/menu.page.js';
import { Nomenclature }            	        from '@pom/NOM/nomenclature.page.js';
import { Article }                 	        from '@pom/NOM/articles.page.js';
import { Caracteristique }         	        from '@pom/NOM/caracteristiques.page.js';
import { Composition }             	        from '@pom/NOM/composition.page.js';
import { GroupeArticle }           	        from '@pom/NOM/groupe-article.page.js';

import { CartoucheInfo, TypeListOfElements }from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
let log             : Log;
// Chargement des Pages Objects
let menu            : MenuNomenclature;

let pageNomenclature: Nomenclature;
let pageArticle     : Article;
let pageGpArticle   : GroupeArticle;
let pageCaracterist : Caracteristique;    
let pageComposition : Composition; 

// Chargement des helpers    
const fonction      = new TestFunctions(log);

fonction.recordDatas(false);		//-- Inutile de créer une fiche de données

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page            = await browser.newPage();
	log             = new Log();
	menu            = new MenuNomenclature(page, fonction);	
	pageNomenclature= new Nomenclature(page);
	pageArticle     = new Article(page);
    pageGpArticle   = new GroupeArticle(page);
	pageCaracterist = new Caracteristique(page);
	pageComposition = new Composition(page);
	const helper    = new Help(info, testInfo, page);
	await helper.init();
});

test.beforeEach(async ({}, testInfo) => {
	await fonction.trace(testInfo);
	await fonction.checkConsole(page, testInfo, false);
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async() => {
       await fonction.connexion(page);
    })

	test.describe('Page [ARTICLES]', () => {

		var pageName:string = 'articles';

		test('Page [ARTICLES] - Click', async () => {
			await menu.click(pageName, page);
		});

		test('Input, button, listBox, checkBox and toggle [Is visible] - Check', async () => {
			fonction.isDisplayed(pageArticle.inputArticle);
			fonction.isDisplayed(pageArticle.inputCodeCaisse);
			fonction.isDisplayed(pageArticle.inputFamille);
			fonction.isDisplayed(pageArticle.inputSousFamille);
			fonction.isDisplayed(pageArticle.inputCaracteristique1);
			fonction.isDisplayed(pageArticle.inputCaracteristique2);
			fonction.isDisplayed(pageArticle.inputValeur1);
			fonction.isDisplayed(pageArticle.inputValeur2);
			fonction.isDisplayed(pageArticle.listBoxRayon);
			fonction.isDisplayed(pageArticle.listBoxGroupe);
			fonction.isDisplayed(pageArticle.toggleArticleAnoNonRens);
			fonction.isDisplayed(pageArticle.toggleArticleAnoOui);
			fonction.isDisplayed(pageArticle.toggleArticleAnoNon);
			fonction.isDisplayed(pageArticle.toggleArticleNonRens);
			fonction.isDisplayed(pageArticle.toggleArticleOui);
			fonction.isDisplayed(pageArticle.toggleArticleNon);
			fonction.isDisplayed(pageArticle.checkBoxValeurNonRens1);
			fonction.isDisplayed(pageArticle.checkBoxValeurNonRens2);
			fonction.isDisplayed(pageArticle.buttonCreer);
			fonction.isDisplayed(pageArticle.buttonModifier);
			fonction.isDisplayed(pageArticle.buttonCopier);
			fonction.isDisplayed(pageArticle.buttonImporter);
			fonction.isDisplayed(pageArticle.buttonExporter);
			fonction.isDisplayed(pageArticle.buttonActiver);
			fonction.isDisplayed(pageArticle.buttonDesactiver);
			fonction.isDisplayed(pageArticle.buttonRechercher);
			fonction.isDisplayed(pageArticle.buttonVider);
		})

	   //-------------------------------------------------------------------------------------------------------------------------- 

		test('DataGrid [LISTE ARTICLES] - Check', async ({}, testInfo) => {
			var oDataGrid = 
			{
				element     : pageArticle.dataGridArticles,    
				desc        : testInfo.line,
				verbose     : false,
				column      :   
					[
						'',
						'Code',
						'Désignation',
						'Rayon',
						'Groupe',
						'Famille',
						'Sous-Famille',
						'Actif',
						'En anomalie',
						'Actions',              
					]
			}
			await fonction.dataGridHeaders(oDataGrid);
		})

		//-------------------------------------------------------------------------------------------------------------------------- 

		test.describe('Popin [CREATION D\'UN ARTICLE]', () => {

			test('Button [CREER] - Click', async () => {
				await fonction.clickAndWait(pageArticle.buttonCreer, page);
			});

			test('Popin [CREATION D\'UN ARTICLE] - Is Visible', async () => {
				await fonction.popinVisible(page, "Création d'un article", true);
			});
			
			test('Button [ENREGISTRER ET NOUVEAU] - Is Visible',async() => {
				await fonction.isDisplayed(pageArticle.pPcreationButtonEnrNouv);
			})
			
			test('Button [ENREGISTRER ET COPIER] - Is Visible',async() => {
				await fonction.isDisplayed(pageArticle.pPcreationButtonEnrCopy);
			})
			
			test('Button [ENREGISTRER] - Is Visible',async() => {
				await fonction.isDisplayed(pageArticle.pPcreationButtonEnreg);
			})
			
			test('InputField [RECHERCHER DANS NOMENCLATURE] - Is Visible',async() => {
				await fonction.isDisplayed(pageArticle.pPcreationInputSearchNom);
			})
			
			test('InputField [RECHERCHER DIRECT A L\'ARTICLE] - Is Visible',async() => {
				await fonction.isDisplayed(pageArticle.pPcreationInputSearchDir);
			})

			test('Button [ANNULER] - Click', async () => {
				await fonction.clickAndWait(pageArticle.pPcreationLinkAnnuler, page);
			});

		})

	})

	test.describe('Page [GROUPE ARTICLE]', () => {

		var pageName:string = 'groupeArticle';

		test('Menu page [GROUPE ARTICLE] - Click', async () => {
			await menu.click(pageName, page);
		});

		test('Button [Is visible] - Check', async () => {
			await fonction.isDisplayed(pageGpArticle.buttonValeursAuto);
			await fonction.isDisplayed(pageGpArticle.buttonDissocier);
			await fonction.isDisplayed(pageGpArticle.buttonPlageCodeArticle);
		})

		//--------------------------------------------------------------------------------------------------------------------------

		test('Li [GROUPE ARTICLE] - Check', async ({}, testInfo) => {
			var oDataGrid:TypeListOfElements = 
			{
				element     : pageGpArticle.nodeGroupesArticles,    
				desc        : testInfo.line.toString(),
				verbose     : false,
				column      :   
					[
                        'BCT',
                        'Affetati e gastronomia',
						"Ancien traiteur BC",
                        'Boucherie',
                        'Charcuterie',
                        'Macelleria',
                        'Boulangerie',
                        'Boulangerie',
                        'Crémerie',
                        'Coupe / Corner',
                        'Frais LS',
                        'IT - Coupe / Corner',
                        'IT - Frais LS',
                        'Epicerie',
                        'Epicerie',
                        'IT - Boulangerie',
                        'IT - Epicerie LS',
                        'IT - Stand',
                        'IT - Surgelés',
                        'Frais Généraux',
                        'Consommable',
                        'IT - Consommable',
                        'IT - Sac',
                        'Matériel informatique',
                        'Sac',
                        'Fruits et légumes',
                        'Fraîche découpe',
                        'Fruits et légumes',
                        'IT - Fraîche découpe',
                        'Poissonnerie',
						'Ancien traiteur de la mer',
                        'IT - Négoce',
                        'IT - Traiteur DM',
                        'Marée',
                        'Négoce',
                        'Traiteur',
                        //'Elaborés',
						'Traiteur de la mer',
						'Traiteur de la terre'
					]
			}
			await fonction.elementInList(oDataGrid);  
		})

		//--------------------------------------------------------------------------------------------------------------------------

		test.describe('Node [IT - Coupe / Corner]', () => {

		 	test('Node [GROUPE ARTICLE] = "IT - Coupe / Corner" - Click', async () => {
				await fonction.clickAndWait(pageGpArticle.nodeGroupesArticle.locator('span:text-is("IT - Coupe / Corner")'), page);
		 	});

			test('Label, button and input [Is visible] - Check', async () => {
				await fonction.isDisplayed(pageGpArticle.labelBreadCrumb);
				await fonction.isDisplayed(pageGpArticle.inputAssocierCarac);
				await fonction.isDisplayed(pageGpArticle.inputCaracteristique);
				await fonction.isDisplayed(pageGpArticle.buttonPlus);
			})

			//-------------------------------------------------------------------------------------------------------------------------- 

			test('DataGrid [CARACTERISTIQUES] - Check', async ({}, testInfo) => {
				var oDataGrid = 
				{
					element     : pageGpArticle.dataGridCarac,    
					desc        : testInfo.line,
					verbose     : false,
					column      :   
						[
							'Caractéristique',
							'Valeurs autorisées',
							'Type',
							'Obligatoire',
							'Saisie conditionnelle',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			//--------------------------------------------------------------------------------------------------------------------------

			test.describe('Popin [PARAMETRAGE DE LA PLAGE DE CODE ARTICLE]', async () => {

				 test('Button [PLAGE DE CODE ARTICLE] - Click', async () => {
					await fonction.clickAndWait(pageGpArticle.buttonPlageCodeArticle, page);
				});

				test('CheckBox, button and input [Is visible] - Check', async () => {
					await fonction.isDisplayed(pageGpArticle.pCheckBoxAlphaNum);
					await fonction.isDisplayed(pageGpArticle.pInputPlageMin);
					await fonction.isDisplayed(pageGpArticle.pInputPlageMax);
					await fonction.isDisplayed(pageGpArticle.pInputCommencePar);
					await fonction.isDisplayed(pageGpArticle.pInputNeCommencePasPar);
					await fonction.isDisplayed(pageGpArticle.pButtonValider);
					await fonction.isDisplayed(pageGpArticle.pButtonAnnuler);
				})

				 test('Link [ANNULER] - Click', async () => {
					await fonction.clickElement(pageGpArticle.pButtonAnnuler);
				});
			});
		})
	})

	test.describe('Page [CARACTERISTIQUES]', () => {

		var pageName:string = 'caracteristiques';

		test('Menu page [CARACTERISTIQUES] - Click', async () => {
			await menu.click(pageName, page);
		});

		test('Button and input [Is visible] - Check', async () => {
			await fonction.isDisplayed(pageCaracterist.buttonCreerCarac);
			await fonction.isDisplayed(pageCaracterist.buttonModifierCarac);
			await fonction.isDisplayed(pageCaracterist.buttonSupprimerCarac);
			await fonction.isDisplayed(pageCaracterist.buttonSupprimerValeur);
			await fonction.isDisplayed(pageCaracterist.inputSearchDesignation);
		})

		//--------------------------------------------------------------------------------------------------------------------------

		test('DataGrid [CARACTERISTIQUES] - Check', async ({}, testInfo) => {
			var  oDataGrid = 
				{
					element     : pageCaracterist.dataGridCarac,    
					desc        : testInfo.line,
					verbose     : false,
					column      :   
						[
							'',
							'Désignation',
							'Description',
							'Type',
							'Actions',             
						]
				}
				await fonction.dataGridHeaders(oDataGrid);      
		})

		//--------------------------------------------------------------------------------------------------------------------------

		test.describe('Popin [CREATION D\'UNE CARACTERISTIQUE]', async () => {

			test('Button [CREER CARACTERISTIQUE] - Click', async () => {
				await fonction.clickElement(pageCaracterist.buttonCreerCarac);
			});

			test('CheckBox, button and input [Is visible] - Check', async () => {
				await fonction.isDisplayed(pageCaracterist.pInputDesignation); 
				//Test.checkListBox(pageCaracterist.pListBoxTypeCarac);
				await fonction.isDisplayed(pageCaracterist.pTexteAreaDescription);                
				await fonction.isDisplayed(pageCaracterist.pButtonCreer);   
				await fonction.isDisplayed(pageCaracterist.pButtonAnnuler); 

			})

			test('Button [ANNULER] - Click', async () => {
				await fonction.clickAndWait(pageCaracterist.pButtonAnnuler, page);
			});

		});
	})

	test.describe('Page [NOMENCLATURE]', () => {

		var pageName:string = 'nomenclature';

		test('Page [NOMENCLATURE] - Click', async () => {
			await menu.click(pageName, page, 10000, false);
		});

		test('button and input [Is visible] - Check', async () => {
			await fonction.isDisplayed(pageNomenclature.inputSearchNomenclature);
			await fonction.isDisplayed(pageNomenclature.inputSearchAccesDirect);
			await fonction.isDisplayed(pageNomenclature.buttonDeplacerArticles);
		})

	})

	test.describe('Page [COMPOSITION]', async () => {

		var pageName:string = 'composition';

		test('Menu page [COMPOSITIOM] - Click', async () => {
			await menu.click(pageName, page);
		});

		test('ListBox, button and input [Is visible] - Check', async () => {
			await fonction.isDisplayed(pageComposition.inputArticle);
			await fonction.isDisplayed(pageComposition.inputFamille);
			await fonction.isDisplayed(pageComposition.inputSousFamille);
			await fonction.isDisplayed(pageComposition.listBoxRayon);
			await fonction.isDisplayed(pageComposition.listBoxGroupe);
			await fonction.isDisplayed(pageComposition.buttonRechercher);
			await fonction.isDisplayed(pageComposition.buttonVider);
			await fonction.isDisplayed(pageComposition.buttonModifCompo);
		})

		//-------------------------------------------------------------------------------------------------------------------------- 

		test('DataGrid [ARTICLES] - Check', async ({}, testInfo) => {
			var oDataGrid = 
			{
				element     : pageComposition.dataGridArticles,    
				desc        : testInfo.line,
				verbose     : false,
				column      :   
					[
						'',
						'Code',
						'Désignation',
						'Rayon',
						'Groupe',
						'Famille',
						'Sous-Famille',
						'Est un ingrédient',
						'Est élaboré',
						'Actions',           
					]
			}
			await fonction.dataGridHeaders(oDataGrid);      
		})

		//--------------------------------------------------------------------------------------------------------------------------
	});

	test.describe('Page [ADMIN]', () => {

		var pageName:string = 'admin';

		test('Menu page [ADMIN] - Click', async () => {
			await menu.click(pageName, page);
		});

		test('Onglet [ADMINISTRATION] - Click', async () => {
			await menu.clickOnglet(pageName, 'administration', page);
		});

		test('Onglet [COMMUNICATION UTILISATEURS] - Click', async () => {
			await menu.clickOnglet(pageName, 'communicationUtlisateurs', page);
		});

		test('Onglet [PARAMETRAGE] - Click', async () => {
			await menu.clickOnglet(pageName, 'parametrage', page);
		});

		test('Onglet [CHANGELOG] - Click', async () => {
			await menu.clickOnglet(pageName, 'Changelog', page);
		});

	})

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})