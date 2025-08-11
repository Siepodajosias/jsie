/**
 * @author JC CALVIERA
 * @description Créer un approvisionnement automatique
 * @since   2024-03-15
 * 
 */
const xRefTest      = "ACH_REA_AUC";
const xDescription  = "Créer un approvisionnement automatique";
const xIdTest       =  201;
const xVersion      = '3.1';
 
var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'ACH',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,  
	help        : [],         
	params      : [],
	fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { test, type Page}   			from '@playwright/test';

import { Help }             			from '@helpers/helpers';
import { TestFunctions }    			from '@helpers/functions';
import { Log }              			from '@helpers/log';

import { MenuAchats }       			from '@pom/ACH/menu.page'; 
import { PageRefAppAut }    			from '@pom/ACH/referentiel_approvisionnement-auto.page';

import { AutoComplete, CartoucheInfo } 	from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;
let pageRef         : PageRefAppAut;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page            = await browser.newPage();
	menu            = new MenuAchats(page, fonction);
	pageRef         = new PageRefAppAut(page); 
	const helper    = new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------  

const sIntitule     = 'TA_' + fonction.getToday('US');
const sFournisseur  = 'Fruidor lyon';
const sPaltefoDistri= 'Chaponnay';
const sRayon        = 'Fruits et légumes';
const iDelai        = 1;
const sArticle      = 'che';        // Bout de chaîne de carcatère déclenchant l'autocomplete
const rPrixTransport= 8.88;
const rFraisDouane  = 7.77;    
const rPrixAchat    = 5.55;

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', async () => {  
	
	test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	});

	test('Connexion', async () => {
		await fonction.connexion(page);
	});

	test.describe('Page [REFERENTIEL]', async () => {

		var sNomPage = 'referentiel'; 

		test('ListBox [RAYON] = "' + sRayon + '"', async () => {                    
			await menu.selectRayonByName(sRayon, page);
		})
		
		test ('Page [REFERENTIEL] - Click', async() => {
			await menu.click(sNomPage, page, 60000);                
		})
		
		test.describe('Onglet [APPROVISIONNEMENT AUTOMATIQUE]', async () => { 

			test('Onglet [APPROVISIONNEMENT AUTOMATIQUE] - Click', async () => {
				menu.clickOnglet(sNomPage, 'approvisionnementAuto', page);
			})  

			test ('Message [ERREUR] - Is NOT Visible', async() => {
				await fonction.isErrorDisplayed(false, page);                
			})

			test ('Button [CREER] - Click', async() => {
				await fonction.clickElement(pageRef.buttonCreer);                
			})

			var sNomPopin = 'CREATION D\'UN APPROVISIONNEMENT AUTOMATIQUE';
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async() => {       
					await fonction.popinVisible(page, sNomPopin);
				})

				test ('Message [ERREUR] - Is NOT Visible', async() => {
					await fonction.isErrorDisplayed(false, page);                
				})

				test ('InputField [INTITULE] = "' + sIntitule +'"', async() => {
					await fonction.sendKeys(pageRef.pPinputIntitule, sIntitule + '-' + fonction.getHMS(), false, 'Intitulé');       
					log.set('INTITULE : ' + sIntitule + '-' + fonction.getHMS());         
				})

				test ('AutoComplete [FOURNISSEUR] = rnd', async () =>  {

					const autoComplete:AutoComplete = {
						libelle         : 'FOURNISSEUR',
						inputLocator    : pageRef.pPinputFournisseur,
						inputValue      : sFournisseur,
						choiceSelector  : 'button.dropdown-item',
						choicePosition  : 0,
						verbose         : true,
						typingDelay     : 0,
						waitBefore      : 250,
						page            : page
					}
		
					await fonction.autoComplete(autoComplete);

				})

				test('ListBox [PLATEFORME DE DISTRIBUTION] = "' + sPaltefoDistri + '"', async() => {
					await fonction.clickElement(pageRef.pPlistBoxDistribution);
					await fonction.wait(page, 250);
					await fonction.clickElement(page.locator('p-dropdownitem li span:text-is("' + sPaltefoDistri + '")'));   
					await fonction.addDataSheet('ListBox', 'Ptf. Distrib.', sPaltefoDistri);
				})

				test('ListBox [DELAI APPROVISIONNEMENT] = "' + iDelai.toString() + '"', async() => {
					await fonction.clickElement(pageRef.pPlistBoxDelaiAppro.nth(1));
					await fonction.wait(page, 250);
					await fonction.clickElement(page.locator('p-dropdownitem li span:text-is("' + iDelai.toString() + '")')); 
					await fonction.addDataSheet('ListBox', 'Délai Appro.', iDelai.toString());
				})

				test('ListBox [HEURE DE TRAITEMENT][rnd] - Select', async() => {
					await fonction.wait(page, 250); //-- On attend que la LB précédente soir refermée
					await fonction.selectRandomListBoxLi(pageRef.pPlistBoxHeureTraitement.nth(1), false, page, 'p-dropdownitem li span');
				})

				test('Date Picker [DATE DE DEBUT D\'APPLICATION] - Click', async() => {
					await fonction.clickElement(pageRef.pPdatePickerDebuApplication);
				})

				test('Day [AUJOURD\'HUI] - Click', async() => {
					await fonction.clickElement(pageRef.pPdatePickerToday);
				})

				test('CheckBox [MAGASIN SERVI][rnd] - Click', async() => {
					const iNbMagasins = await pageRef.pPcheckBoxListeMagServi.count();
					const rnd = Math.floor(fonction.random() * iNbMagasins);
					await fonction.clickElement(pageRef.pPcheckBoxListeMagServi.nth(rnd));
				})

				test ('AutoComplete [ARTICLE] = rnd', async () =>  {
					await fonction.wait(page, 350);
					const autoComplete:AutoComplete = {
						libelle         : 'Article',
						inputLocator    : pageRef.pPinputArticle,
						inputValue      : sArticle,
						choiceSelector  : 'ngb-typeahead-window button',
						choicePosition  : 0,
						verbose         : false,
						typingDelay     : 200,
						waitBefore      : 2500,
						page            : page
					}
		
					await fonction.autoComplete(autoComplete);

				})

				test ('Button [ + ] - Click', async() => {
					await fonction.clickAndWait(pageRef.pPbuttonPlus, page);                
				})

				test('ListBox [ORIGINE][rnd] - Select', async() => {
					var sOrigine = await pageRef.pPlistBoxOrigine.textContent();
					if (sOrigine === '') {
						await fonction.selectRandomListBoxLi(pageRef.pPlistBoxOrigine, false, page, 'p-dropdownitem li span');
						sOrigine = await pageRef.pPlistBoxOrigine.textContent();
						await fonction.addDataSheet('ListBox', 'Origine', sOrigine);
					}
					log.set('Origine : ' + sOrigine);                                       
				})

				test('ListBox [CALIBRE][rnd] - Select', async() => {
					var sCalibre =await pageRef.pPlistBoxCalibre.textContent();
					if (sCalibre === '') {
						await fonction.selectRandomListBoxLi(pageRef.pPlistBoxCalibre, false, page, 'p-dropdownitem li span');
						sCalibre =await pageRef.pPlistBoxCalibre.textContent();
						await fonction.addDataSheet('ListBox', 'Calibre', sCalibre);
					}
					log.set('Calibre : ' + sCalibre);                      
				})

				test('ListBox [CONDITIONNEMENT][rnd] - Select', async() => {
					var sConditionnement = await pageRef.pPlistBoxConditionnement.textContent();
					if (sConditionnement === '') {
						await fonction.selectRandomListBoxLi(pageRef.pPlistBoxConditionnement, false, page, 'p-dropdownitem li span');
						sConditionnement = await pageRef.pPlistBoxConditionnement.textContent();
						await fonction.addDataSheet('ListBox', 'Conditionnement', sConditionnement);
					} 
					log.set('Conditionnement : ' + sConditionnement);                                         
				})

				test('ListBox [PLATEFORME RECEPTION][rnd] - Select', async() => {
					await fonction.wait(page, 250); //-- On attend que la LB précédente soir refermée
					await fonction.selectRandomListBoxLi(pageRef.pPlistBoxPlateformeRecp, false, page, 'p-dropdownitem li span');
				})

				test('ListBox [INCOTERM][rnd] - Select', async() => {
					await fonction.wait(page, 250); //-- On attend que la LB précédente soir refermée
					await fonction.selectRandomListBoxLi(pageRef.pPlistBoxIncoterm, false, page, 'p-dropdownitem li span');
				})

				test('ListBox [UNITE ACHAT][rnd] - Select', async() => {
					await fonction.wait(page, 250); //-- On attend que la LB précédente soir refermée
					await fonction.selectRandomListBoxLi(pageRef.pPlistBoxUniteAchat, false, page, 'p-dropdownitem li span');
				})

				test ('InputField [PRIX TRANSPORT] = "' + rPrixTransport +'"', async() => {
					await fonction.sendKeys(pageRef.pPinputPrixTransport, rPrixTransport, false, 'Prix Transport');       
					log.set('PRIX TRANSPORT : ' + rPrixTransport );         
				})

				test ('InputField [FRAIS DE DOUANE] = "' + rFraisDouane +'"', async() => {
					await fonction.sendKeys(pageRef.pPinputFraisDouane, rFraisDouane, false, 'Frais Douane');       
					log.set('FRAIS DE DOUANE : ' + rFraisDouane );         
				})

				test ('InputField [PRIX ACHAT] = "' + rPrixAchat +'"', async() => {
					await fonction.sendKeys(pageRef.pPinputPrixAchat, rPrixAchat, false, 'Prix Achat');       
					log.set('PRIX ACHAT : ' + rPrixAchat );         
				})

				test('Button [ENREGISTRER] - Click', async() => {
					await fonction.clickAndWait(pageRef.pPbuttonEnregistrer, page);                
				})

			})

		})

	}) // end test.describe Page

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

}) 