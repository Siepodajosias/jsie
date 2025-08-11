/**
 * 
 * @author JOSIAS SIE
 *  Since 22 - 05 - 2025
 * 
 */

const xRefTest      = "STO_ADM_MCE";
const xDescription  = "Ajouter des dimensions à une catégorie d'emplacement pour une plateforme";
const xIdTest       =  9735;
const xVersion      = '3.1';

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
var oData:any        = fonction.importJdd();

var sPlateforme     = fonction.getInitParam('plateforme', 'Cremlog');
var sCategorie      = fonction.getInitParam('categorie',  'Dynamique');

const iLongueur     = 120;
const iLargeur      = 80;
const iHauteur      = 177;

if (oData !== undefined) {  // On est dans le cadre d'un E2E. Récupération des données temporaires
    sCategorie = oData.categorie; 
    log.set('E2E - catégorie : ' + sCategorie);
}

//----------------------------------------------------------------------------------------

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

	test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {            
		await menu.selectPlateforrme(page, sPlateforme);                       // Sélection d'une plateforme par défaut
	})

	test.describe ('Page [ADMINISTRATEUR]', async () => {    

		var currentPage:string = 'admin';
		test('Page [ADMINISTRATEUR] - Click', async () => {
			await menu.click(currentPage, page);
		})
	   
		test.describe ('Onglet [CATEGORIE D\'EMPLACEMENTS]', async () => {        
			
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

			test('Button [MODIFIER] - Is Activated', async () => {
				await expect(pageAdminCategorie.buttonModifier).toBeDisabled();
			})

			test.describe ('Datagrid [FILTRE]', async () => {
				test('Input [PLATEFORME] = "'+  sPlateforme + '"', async () => {
					await fonction.clickAndWait(pageAdminCategorie.mutiselectPlateCateg.nth(0), page);
					await fonction.sendKeys(pageAdminCategorie.inputFieldPlateCateg, sPlateforme, false, 'Plateforme');
					await fonction.clickElement(pageAdminCategorie.checkboxPlateCateg);
				})

				test('Input [CATEGORIE] = "'+  sCategorie + '"', async () => {
					await fonction.clickAndWait(pageAdminCategorie.mutiselectPlateCateg.nth(1), page);
					await fonction.sendKeys(pageAdminCategorie.inputFieldPlateCateg, sCategorie, false, 'Catégorie');
					await fonction.clickAndWait(pageAdminCategorie.checkboxPlateCateg, page);
				})

				test('Button [CLOSE CATEGORIE] - Click', async () => {
					await fonction.clickElement(pageAdminCategorie.buttonClose);
				})

				test('Tr [CATEGORIE EMPLACEMENT] - Click', async () => {
					await fonction.clickAndWait(pageAdminCategorie.trCategorieEmpl, page);
				})

				test('Button [MODIFIER] - Click', async () => {
					await fonction.clickAndWait(pageAdminCategorie.buttonModifier, page);
				})
			})

			var sNomPopin:string = 'Création d\'une nouvelle catégorie';
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', () => {   

				test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin, true);
				}) 

				test.describe ('Popin [' + sNomPopin.toUpperCase() + '] - Check', async () => {
					test('Input [PLATEFORME] - Is Visible', async () => {
						await fonction.isDisplayed(pageAdminCategorie.pDropdownPlateforme);
					})

					test('Input [CATEGORIE] - Is Visible', async () => {
						await fonction.isDisplayed(pageAdminCategorie.pDropdownCategorie);
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

					test('Span [RACK DYNAMIQUE] - Is Visible', async () => {
						await fonction.isDisplayed(pageAdminCategorie.pSpanRackDynamique);
					})

					test('Button [ENREGISTRER] - Is Activated', async () => {
						await expect(pageAdminCategorie.pButtonEnregistrer).toBeEnabled();
					})
				}) 

				test('InputField [PLATEFORME] - Click x2', async () => {
					await fonction.clickElement(pageAdminCategorie.pDropdownPlateforme);
					await fonction.clickElement(pageAdminCategorie.pDropdownPlateforme);
					log.set('Plateforme :' + sPlateforme);
				})

				test('Input [LONGUEUR] = "'+  iLongueur + '"', async () => {
					await fonction.sendKeys(pageAdminCategorie.pInputLongueur, iLongueur, false, 'Longueur');
					log.set('Longueur :' + iLongueur);
				})

				test('Input [LARGEUR] = "'+  iLargeur + '"', async () => {
					await fonction.sendKeys(pageAdminCategorie.pInputLargeur, iLargeur, false, 'Largeur');
					log.set('Largeur :' + iLargeur);
				})

				test('Input [HAUTEUR] = "'+  iHauteur + '"', async () => {
					await fonction.sendKeys(pageAdminCategorie.pInputHauteur, iHauteur, false, 'Hauteur');
					log.set('Hauteur :' + iHauteur);
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
					test('Svg [PLATEFORME/CATEGORIE] - Click x2', async () => {
					   await fonction.clickElement(pageAdminCategorie.svgClosePlateCateg.nth(0));
					   await fonction.clickElement(pageAdminCategorie.svgClosePlateCateg.nth(0));
					})

					test('Input [PLATEFORME] = "'+  sPlateforme + '"', async () => {
						await fonction.clickAndWait(pageAdminCategorie.mutiselectPlateCateg.nth(0), page);
						await fonction.sendKeys(pageAdminCategorie.inputFieldPlateCateg, sPlateforme, false, 'Plateforme');
						await fonction.clickElement(pageAdminCategorie.checkboxPlateCateg.first());
					})

					test('Input [CATEGORIE] = "'+  sCategorie + '"', async () => {
						await fonction.clickAndWait(pageAdminCategorie.mutiselectPlateCateg.nth(1), page);
						await fonction.sendKeys(pageAdminCategorie.inputFieldPlateCateg, sCategorie, false, 'Catégorie');
						await fonction.clickAndWait(pageAdminCategorie.checkboxPlateCateg.first(), page);
					})

					test('Button [CLOSE CATEGORIE] - Click', async () => {
						await fonction.clickAndWait(pageAdminCategorie.buttonClose, page);
					})
				})

				test('Span [LONGUEUR] = "'+  iLongueur.toString() + '"', async () => {
					expect(await pageAdminCategorie.spanLongueur.textContent()).toEqual(iLongueur.toString());
				})

				test('Span [LARGEUR] = "'+  iLargeur.toString() + '"', async () => {
					expect(await pageAdminCategorie.spanLargeur.textContent()).toEqual(iLargeur.toString());
				})

				test('Span [HAUTEUR] = "'+  iHauteur.toString() + '"', async () => {
					expect(await pageAdminCategorie.spanHauteur.textContent()).toEqual(iHauteur.toString());
				})
			})
		})  //-- End Describe Onglet
	})  //-- End Describe Page

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})