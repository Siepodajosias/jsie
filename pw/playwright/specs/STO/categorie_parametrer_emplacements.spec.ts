/**
 * 
 * @author JOSIAS SIE
 *  Since 21 - 05 - 2025
 * 
 */

const xRefTest      = "STO_ADM_PCE";
const xDescription  = "Paramétrer une catégorie d'emplacement pour une plateforme";
const xIdTest       =  9734;
const xVersion      = '3.3';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'STOCK',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['plateforme','categorie'],
	fileName    : __filename
}

//----------------------------------------------------------------------------------------

import { expect, test, type Page}          from '@playwright/test';

import { TestFunctions }                   from "@helpers/functions";
import { Log }                             from "@helpers/log";
import { Help }                            from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                       from "@pom/STO/menu.page";

import { CartoucheInfo, TypeListOfElements}from '@commun/types';
import { AdminCategorieEmplacement }       from '@pom/STO/admin-categorie_emplacement.page';

//----------------------------------------------------------------------------------------

let page              : Page;

let menu              : MenuStock;
let pageAdminCategorie: AdminCategorieEmplacement;

const log           = new Log();
const fonction      = new TestFunctions(log);

//----------------------------------------------------------------------------------------
fonction.importJdd();

var sPlateforme     = fonction.getInitParam('plateforme', 'Cremlog');
var sCategorie      = fonction.getInitParam('categorie',  'Dynamique');
//----------------------------------------------------------------------------------------
var oData = {
	categorie  : ''
}

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage(); 
	menu                = new MenuStock(page, fonction);
	pageAdminCategorie  = new AdminCategorieEmplacement(page);
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

	test.describe ('Page [ADMINISTRATEUR]', async() => {    

		var currentPage:string = 'admin';
		test('Page [ADMINISTRATEUR] - Click', async () => {
			await menu.click(currentPage, page);
		})
	   
		test.describe ('Onglet [CATEGORIE D\'EMPLACEMENTS]', async() => {        
			
			test('Onglet [CATEGORIE EMPLACEMENT] - Click', async () => {
				await menu.clickOnglet(currentPage, 'categorieEmplacement', page);
			})   

			test('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test('DataGrid [CATEGORIE EMPLACEMENT] - Is visble', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAdminCategorie.dataGridCategorieEmpl,    
					desc        : 'DataGrid [CATEGORIE EMPLACEMENT]',
					verbose     : false,
					column      :   
						[
							'Plateforme',
							'Catégorie',
							'Rack dynamique',
							'Longueur (cm)',
							'Largeur (cm)',
							'Hauteur (cm)',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			test('Button [CREER] - Is Activated', async () => {
				await expect(pageAdminCategorie.buttonCreer).toBeEnabled();
			})

			test('Button [MODIFIER] - Is Disabled', async () => {
				await expect(pageAdminCategorie.buttonModifier).toBeDisabled();
			})

			var sNomPopin:string = 'Création d\'une nouvelle catégorie';
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', () => {   

				test('Button [CREER] - Click', async () => {
					await fonction.clickAndWait(pageAdminCategorie.buttonCreer, page);
				})

				test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin, true);
				}) 

				test.describe ('Popin [CHAMPS DE SAISIES]', async () => {
					test('Input [PLATEFORME] - Is Visible', async () => {
						await fonction.isDisplayed(pageAdminCategorie.pDropdownPlateforme);
					})

					test('Input [CATEGORIE] - Is Visible', async () => {
						await fonction.isDisplayed(pageAdminCategorie.pDropdownCategorie);
					})

					test('Span [RACK DYNAMIQUE] - Is Visible', async () => {
						await fonction.isDisplayed(pageAdminCategorie.pSpanRackDynamique);
					})

					test('Input [LONGUEUR] - Is Visible', async () => {
						await fonction.isDisplayed(pageAdminCategorie.pInputLongueur);
					})

					test('Input [LARGEUR] - Is Visible', async () => {
						await fonction.isDisplayed(pageAdminCategorie.pInputLargeur);
					})

					test('Input [HAUTEUR] - Is Visible', async () => {
						await fonction.isDisplayed(pageAdminCategorie.pInputHauteur);
					})

					test('CheckBox [RECEPTION] - Is Visible', async () => {
						await fonction.isDisplayed(pageAdminCategorie.pCheckBoxUsagesAutorises.nth(0));
					})

					test('CheckBox [PICKING] - Is Visible', async () => {
						await fonction.isDisplayed(pageAdminCategorie.pCheckBoxUsagesAutorises.nth(1));
					})

					test('CheckBox [STOCKAGE] - Is Visible', async () => {
						await fonction.isDisplayed(pageAdminCategorie.pCheckBoxUsagesAutorises.nth(2));
					})

					test('CheckBox [PREPARATION] - Is Visible', async () => {
						await fonction.isDisplayed(pageAdminCategorie.pCheckBoxUsagesAutorises.nth(3));
					})
	
					test('Button [ENREGISTRER] - Is Activated', async () => {
						await expect(pageAdminCategorie.pButtonEnregistrer).toBeEnabled();
					})
				}) 

				test('Input [PLATEFORME] = "'+  sPlateforme + '"', async () => {
					await fonction.clickAndWait(pageAdminCategorie.pDropdownPlateforme, page);
					await fonction.sendKeys(pageAdminCategorie.pInputFieldPlateCateg, sPlateforme, false, 'Plateforme');
					await fonction.clickElement(pageAdminCategorie.pLiPlateformeAndCateg);
					log.set('Plateforme :' + sPlateforme);
				})

				test('Input [CATEGORIE]= "'+  sCategorie + '"', async () => {
					await fonction.clickAndWait(pageAdminCategorie.pDropdownCategorie, page);
					await fonction.sendKeys(pageAdminCategorie.pInputFieldPlateCateg, sCategorie, false, 'Catégorie');
					await fonction.clickElement(pageAdminCategorie.pLiPlateformeAndCateg.first());
					oData.categorie = sCategorie
					log.set('Catégorie :' + sCategorie);
				})

				test.describe ('Div [USAGES AUTORISES]', async () => {
					test('CheckBox [PICKING] - Click', async () => {
						await fonction.clickElement(pageAdminCategorie.pCheckBoxUsagesAutorises.nth(1));
					})

					test('CheckBox [STOCKAGE] - Click', async () => {
						await fonction.clickElement(pageAdminCategorie.pCheckBoxUsagesAutorises.nth(2));
					})
				})

				test('Button [ENREGISTRER] - Click', async () => {
					await fonction.clickAndWait(pageAdminCategorie.pButtonEnregistrer, page);
				})

				test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin, false);
				})                      
			})

			test.describe ('Datagrid [CATEGORIE D\'EMPLACEMENTS]', async () => {

				test.describe ('Datagrid [FILTRE]', async () => {
					test('Input [PLATEFORME] = "'+  sPlateforme + '"', async () => {
						await fonction.clickAndWait(pageAdminCategorie.mutiselectPlateCateg.nth(0), page);
						await fonction.sendKeys(pageAdminCategorie.inputFieldPlateCateg, sPlateforme, false, 'Plateforme');
						await fonction.clickElement(pageAdminCategorie.checkboxPlateCateg.first());
					})

					test('Input [CATEGORIE] = "'+  sCategorie + '"', async () => {
						await fonction.clickAndWait(pageAdminCategorie.mutiselectPlateCateg.nth(1), page);
						await fonction.sendKeys(pageAdminCategorie.inputFieldPlateCateg, sCategorie, false, 'Catégorie');
						await fonction.clickElement(pageAdminCategorie.checkboxPlateCateg.first());
					})

					test('Button [CLOSE CATEGORIE] - Click', async () => {
						await fonction.clickAndWait(pageAdminCategorie.buttonClose,page);
					})
				})

				test('Span [PLATEFORME] = "'+  sPlateforme + '"', async () => {
					expect(await pageAdminCategorie.spanPlateforme.textContent()).toEqual(sPlateforme);
				})

				test('Span [CATEGORIE] = "'+  sCategorie + '"', async () => {
					expect(await pageAdminCategorie.spanCategorie.textContent()).toEqual(sCategorie);
				})

				test('Tr [CATEGORIE EMPLACEMENT] - Click', async () => {
					await fonction.clickAndWait(pageAdminCategorie.trCategorieEmpl, page);
				})

				test('Button [MODIFIER] - Is Activated', async () => {
					await expect(pageAdminCategorie.buttonModifier).toBeEnabled();
				})
			})
		})  //-- End Describe Onglet

		await fonction.writeData(oData);
	})  //-- End Describe Page

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})