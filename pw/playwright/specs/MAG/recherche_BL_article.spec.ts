/**
 *
 * @author JOSIAS SIE
 * @since 2025-06-13
 * 
 */
const xRefTest      = "MAG_DAV_RCH";
const xDescription  = "Rechercher un BL définitif & un article";
const xIdTest       =  10010;
const xVersion      = '3.1';

//------------------------------------------------------------------------------------

var info:CartoucheInfo = {
	desc       : xDescription,
	appli      : 'MAGASIN',
	version    : xVersion,
	refTest    : [xRefTest],
	idTest     : xIdTest,
	help       : [],
	params     : ['ville','groupeArticle'],
	fileName   : __filename
}

//------------------------------------------------------------------------------------
  
import { expect, test, type Page }          from '@playwright/test';

import { TestFunctions }                    from "@helpers/functions";
import { Log }                              from "@helpers/log";
import { Help }                             from '@helpers/helpers';
import { CartoucheInfo, TypeListOfElements }from '@commun/types';
import { MenuMagasin }                      from '@pom/MAG/menu.page';

import { FacturationBlDefinitif }           from '@pom/MAG/facturation-bl_definitif.page'; 

//-------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuMagasin;
let pageFactuDefintestif: FacturationBlDefinitif; 

const log            = new Log();
const fonction       = new TestFunctions(log);

//------------------------------------------------------------------------------------
fonction.importJdd();

const sMagasin       = fonction.getInitParam('ville', 'Chaponnay (F720)'); //Bergerac (G550)
const sGroupeArticle = fonction.getInitParam('groupeArticle','Coupe / Corner');

const today:Date     = new Date();

//------------------------------------------------------------------------------------

/**
 * Sélectionner des dates :  Choisir une semaine d'il y a un mois. (Exemple si nous sommes le 11/06/2025, choisir la semaine du 11/05/2025 au 18/05/2025)
 * 
 * @returns {iDateDebut, iDateFin}
 */
var getSemaineIlyaUnMois = () => {
    // On initialise la date de début avec le dernier jour du mois précédent
    const iDateDebut  = new Date(today.getFullYear(), today.getMonth(), 0);

    // On récupère le réel jour de la date de debut en fonction du dernier jour du mois précédent et le jour actuel
    const iJourDateDebut = Math.min(today.getDate(), iDateDebut.getDate());
    iDateDebut.setDate(iJourDateDebut); // On asigne le jour correct
    const iDateFin= new Date(iDateDebut); // On détermine la date de fin à partir du jour de début 
    iDateFin.setDate(iDateDebut.getDate() + 7);

    return {iDateDebut: iDateDebut, iDateFin  : iDateFin} 
}

//------------------------------------------------------------------------------------
var oData = {
	iDateLivraison: "",
	iNumeroBL     : "",
	sCodeArticle  : "",
	iQuantite     : "",
	iQuantiteUD   : "",
	sDateLivr     : "",
	sCodeArt      : "",
	iQuantiteColis: "",
	iQuantite_UD  : ""
}

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage(); 
	menu                = new MenuMagasin(page, fonction);
	pageFactuDefintestif= new FacturationBlDefinitif(page);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {
  
	test('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})
	
	test('Connexion', async () => {
		await fonction.connexion(page);
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

   test.describe ('Page [FACTURATION]', async () => {

		var pageName   :string= 'facturation';
		var sOngletName:string= 'blDefinitifs';

		test('Page [FACTURATION] - Click', async () => {
			await menu.click(pageName, page); 
		}) 

		test('ListBox [VILLE] = "' + sMagasin + '"', async () => {  // On sélectionne le magasin cible.
			await menu.selectVille(sMagasin, page);
			log.set('Magasin : ' + sMagasin);
		})
	
		test.describe ('Onglet [BL DEFINTIFS]', async () => {     
	
			test('Onglet [BL DEFINTIFS] - Click', async () => {
				await menu.clickOnglet(pageName, sOngletName, page);
			}) 
	
			test('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 
	
			test('DatePicker, input and listBox [Is - visible] - Is Displayed', async () => {
				await fonction.isDisplayed(pageFactuDefintestif.datePickerFrom);
				await fonction.isDisplayed(pageFactuDefintestif.datePickerTo);  
				await fonction.isDisplayed(pageFactuDefintestif.inputCritereArticle);
				await fonction.isDisplayed(pageFactuDefintestif.inputFiltreArticle);
				await fonction.isDisplayed(pageFactuDefintestif.inputLotFournBlLogistique);
				await fonction.isDisplayed(pageFactuDefintestif.inputDLCFournisseur);
				await fonction.checkListBox(pageFactuDefintestif.listBoxGrpArticle);
			}) 
	
			test('Toggle Buttons [FILTRE] - Is visible', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageFactuDefintestif.toggleGroupe,    
					desc        : 'Toggle Buttons [FILTRE]',
					verbose     : false,
					column      :   
						[
							'Tous',
							'Avoirs',
							'Factures'            
						]
				}
				await fonction.toggleContent(oDataGrid); 
			})
	
			test('DataGrid [LISTE BL] - Is visible', async () => { 
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageFactuDefintestif.dataGridListeBL,    
					desc        : 'DataGrid [LISTE BL]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Date',
							'Numéro de BL',
							'Groupe',
							'LD',
							'Total HT',
							'Total PVC',
							'Marge théo.',
							'Nature',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
	
			test('DataGrid [LISTE ARTICLES] - Is visible', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageFactuDefintestif.dataGridListeArticles,    
					desc        : 'DataGrid [LISTE ARTICLES]',
					verbose     : false,
					column      :   
						[
							'Code article',
							'Désignation article',
							'Conditionnement',
							'Numéro de lot',
							'Quantité en colis',
							'Quantité en UD',
							'Prix de cession',
							'Total HT',
							'PVC',
							'Quantité CR',
							'',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			test('I [DATE DE LIVRAISONS][DU] - Click', async () => {
				await fonction.clickElement(pageFactuDefintestif.datePickerFrom.locator('i.input-icon-calendar'));
			})

			test('DatePicker [DATE DE LIVRAISONS][DU] - Click', async () => {
				const initialDay  = getSemaineIlyaUnMois();

			    // Si le mois a changé, on clique sur "mois précédent"
			    await fonction.clickElement(pageFactuDefintestif.datePickerPrevious.locator('th.prev'));

                // Sélection du jour dans le calendrier
				await fonction.clickAndWait(pageFactuDefintestif.datePickerPrevious.locator(`[class="day"]:text-is("${initialDay.iDateDebut.getDate()}")`), page); 
				await fonction.addDataSheet('InputField', 'Date Début', initialDay.iDateDebut.getDate());
			})

			test('I [DATE DE LIVRAISONS][AU] - Click', async () => {
				await fonction.clickElement(pageFactuDefintestif.datePickerTo.locator('i.input-icon-calendar')); 
			})

			test('DatePicker [DATE DE LIVRAISONS][AU] - Click', async () => {
				const initToday   = new Date();
				const initialDay  = getSemaineIlyaUnMois();
			    const moisInitial = initialDay.iDateFin.getMonth();
                const moisCourrant= initToday.getMonth();
	
			    // Si le mois a changé, on clique sur "mois précédent"
                if(moisCourrant !== moisInitial){
			      await fonction.clickElement(pageFactuDefintestif.datePickerPrevious.locator('th.prev'));
				}

                // Sélection du jour dans le calendrier
				await fonction.clickAndWait(pageFactuDefintestif.datePickerPrevious.locator(`[class="day"]:text-is("${initialDay.iDateFin.getDate()}")`), page);
				await fonction.addDataSheet('InputField', 'Date Fin', initialDay.iDateFin.getDate());
			})

			test('** Wait Until Spinner Off **', async () => {
				await fonction.waitForSpinner(pageFactuDefintestif.spinnerLoading.first(), 180000);
			}) 

			test('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
				await pageFactuDefintestif.listBoxGrpArticle.selectOption({label: sGroupeArticle});
			})

			test('Tr [GROUPE ARTICLE] > 0', async () => {
				await fonction.wait(page, 800);
				expect(await pageFactuDefintestif.dataGridListeGroupeArticles.nth(0).locator('tr').count()).toBeGreaterThan(0);
			})

			test('Tr [GROUPE ARTICLE][First] - Click', async () => {
				await fonction.clickAndWait(pageFactuDefintestif.dataGridListeGroupeArticles.nth(0).locator('tr').first(), page);
			})

			test('** Wait Until Spinner Off #2 **', async () => {
				await fonction.waitForSpinner(pageFactuDefintestif.spinnerLoading.nth(1), 180000);
			})

			test('Tr [ARTICLE] > 0', async () => {
				expect(await pageFactuDefintestif.dataGridListeGroupeArticles.nth(1).locator('tr').count()).toBeGreaterThan(0);
			})

			test('Td [DATE DE LIVRAISON][NUMERO DE BL][CODE ARTICLE] - Enregistrement', async () => {
				oData.iDateLivraison= await pageFactuDefintestif.dataGridListeGroupeArticles.nth(0).locator('td.datagrid-journee span').first().textContent();
				oData.iNumeroBL     = await pageFactuDefintestif.dataGridListeGroupeArticles.nth(0).locator('td.datagrid-numero span').first().textContent();
				oData.sCodeArticle  = await pageFactuDefintestif.dataGridListeGroupeArticles.nth(1).locator('td.datagrid-article-code span').first().textContent();
				oData.iQuantite     = await pageFactuDefintestif.dataGridListeGroupeArticles.nth(1).locator('td.datagrid-quantiteFacturee span').first().textContent();
				oData.iQuantiteUD   = await pageFactuDefintestif.dataGridListeGroupeArticles.nth(1).locator('td.datagrid-quantiteUD span').first().textContent();
			})

			//---------------------------------- Récupère un article dont le BL a été reçu il y a plus de 70 jours ----------------------------------------------------

			test('DatePicker [DATE DE LIVRAISONS][DU] #2 - Click', async () => {
				await fonction.clickElement(pageFactuDefintestif.datePickerFrom.locator('i.input-icon-calendar'));
				// On clique 4 fois pour revenir 4 mois en arrière et sélectionner le 10 du mois.
				const itoday = 10;
				for(let i=0; i < 3; i++){
					await fonction.clickElement(pageFactuDefintestif.datePickerPrevious.locator('th.prev')); 
				}
					await fonction.clickAndWait(pageFactuDefintestif.datePickerPrevious.locator('[class="day"]:text-is("'+itoday+'")'), page);
			})

			test('** Wait Until Spinner Off #3 **', async () => {
				await fonction.waitForSpinner(pageFactuDefintestif.spinnerLoading.first(), 180000);
			}) 

			test('Tr [GROUPE ARTICLE][First] #2 - Click', async () => {
				await fonction.clickAndWait(pageFactuDefintestif.dataGridListeGroupeArticles.nth(0).locator('tr').first(), page);

				oData.sDateLivr     = await pageFactuDefintestif.dataGridListeGroupeArticles.nth(0).locator('td.datagrid-journee span').first().textContent();
				oData.sCodeArt      = await pageFactuDefintestif.dataGridListeGroupeArticles.nth(1).locator('td.datagrid-article-code span').first().textContent();
				oData.iQuantiteColis= await pageFactuDefintestif.dataGridListeGroupeArticles.nth(1).locator('td.datagrid-quantiteFacturee span').first().textContent();
				oData.iQuantite_UD  = await pageFactuDefintestif.dataGridListeGroupeArticles.nth(1).locator('td.datagrid-quantiteUD span').first().textContent();
			})

		})  // Onglet BL DEFINITIFS

		await fonction.writeData(oData);
	}) // End describe Page

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
}) // End describe