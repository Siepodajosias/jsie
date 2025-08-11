/**
 * @author JOSIAS SIE
 *  Since 2025-07-22
 */

const xRefTest      = "PRI_SIM_AJP";
const xDescription  = "Ajouter une promotion à la simulation faite à J";
const xIdTest       =  8096;
const xVersion      = '3.0';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'PRICING',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['rayon','nom','plateforme','codeArticle','code'],
	fileName    : __filename
}

//----------------------------------------------------------------------------------------

import { test, expect, type Page}    from '@playwright/test';
import { AutoComplete, CartoucheInfo}from '@commun/types';
import { TestFunctions }             from '@helpers/functions';
import { Log }                       from '@helpers/log';
import { Help }                      from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuPricing }               from '@pom/PRI/menu.page';
import { SimulationPrixPage }        from '@pom/PRI/tarification_simulation-prix.page';
import { TarificationPage }          from '@pom/PRI/tarification_tarification.page';
//----------------------------------------------------------------------------------------

let page               : Page;
let menu               : MenuPricing;
let pageTarifSimulation: SimulationPrixPage;
let pageTarif          : TarificationPage;
const log              = new Log();
const fonction         = new TestFunctions(log);

//----------------------------------------------------------------------------------------
const sRayon           = fonction.getInitParam('rayon','Crèmerie');
const sPlateforme      = fonction.getInitParam('plateforme','Cremlog');
var sNomPromotion      = fonction.getInitParam('nom','TA_PROMO. ' + fonction.getToday());
var sCodeArticleAvecVMH= fonction.getInitParam('codeArticle','C1AA');
var sCodeArticleSansVMH= fonction.getInitParam('code','L1WE');
const today: Date      = new Date();
const dateDuJour       = today.getDate();

//----------------------------------------------------------------------------------------

var sPrixAchat         :string = "";
var sPrixRevientTh	   :string = "";
var sPvcTTC            :string = "";
var sPrixCessionAC     :string = "";
var sGroupeMagasin     :string = "";
var iDureePromotion    :number = 5; // Durée de la promotion en jours

test.beforeAll(async ({ browser }, testInfo) => {
	page               = await browser.newPage(); 
	menu               = new MenuPricing(page, fonction);
	pageTarifSimulation= new SimulationPrixPage(page);
	pageTarif          = new TarificationPage(page);
	const helper       = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

	test('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe ('Page [ACCUEIL]', async () => {   
		
		test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
			await fonction.isErrorDisplayed(false, page);
		})   

		test('ListBox [RAYON] = "' + sRayon + '"', async () => {     
			await menu.selectRayonByName(sRayon, page);         // Sélection du rayon passé en paramètre
		})  
	})  //-- End Describe Page


	test.describe ('Page [TARIFICATION]', async () => {   
		var pageName:string = 'tarification';

		test('Page [TARIFICATION] - Click', async () => {
			await menu.click(pageName, page);
		})

		test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
			await fonction.isErrorDisplayed(false, page);
		})

		test('** Wait Until Spinner Off **', async () => {
			await fonction.waitForSpinner(pageTarifSimulation.spinnerLoading.first());
		})

		test.describe ('Onglet [SIMULATION PRIX]', async () => {
	
			var sNomPopin:string = 'Ajouter une ligne au simulateur';
			test('Onglet [SIMULATION PRIX] - Click', async () => {
				await menu.clickOnglet(pageName, 'simulationPrix', page);
			})

			test('Datepicker [DATE SIMULATION] #1 - Click', async () => {
			   await fonction.clickAndWait(pageTarifSimulation.datePickerSimulation,page);
		    })

			test('Td [DATE DU JOUR] = "'+ dateDuJour +'"', async () => {
			   await fonction.clickAndWait(pageTarifSimulation.datePickerSimulationDay.getByText(dateDuJour.toString()), page);
			})

			test('Button [RECHERCHER] - Click', async () => {
				await fonction.clickAndWait(pageTarifSimulation.buttonRechercher, page);  
			})

			test('** Wait Until Spinner Off **', async () => {
				await fonction.waitForSpinner(pageTarifSimulation.spinnerLoading.first(), 180000);
			})

			test('Tr [SIMULATION PRIX] > 0', async () => {
				expect(await pageTarifSimulation.dataGridTrSimulation.count()).toBeGreaterThan(0);
			})

			test.describe ('Div [AJOUT D\'UNE PROMOTION AVEC UN ARTICLE AYANT UNE VMH]', async () => {
				var sLabelNouvelleMarge :string = '';
				var sLabelMargeActiuelle:string = '';
				test('Input [CODE ARTICLE] = "' + sCodeArticleAvecVMH + '"', async () => {
					await fonction.sendKeys(pageTarifSimulation.inputCodeArticle, sCodeArticleAvecVMH, false, "Code article avec VMH");
					await fonction.waitForDomStable(page);
					log.set('Code article avec VMH : ' + sCodeArticleAvecVMH);
			    })

				test('Tr [SIMULATION PRIX] = 1', async () => {
					expect(await pageTarifSimulation.dataGridTrSimulation.count()).toBeGreaterThan(1);
					sPrixAchat    = await pageTarifSimulation.dataGridTrSimulation.first().locator('td.text-right.row-group-column').nth(2).textContent();
					sPrixRevientTh= await pageTarifSimulation.dataGridTrSimulation.first().locator('td.text-right.ellipse.row-group-column .ng-star-inserted').first().textContent();
					sGroupeMagasin= await pageTarifSimulation.dataGridTrSimulation.first().locator('td.text-left.sticky-column:NOT(.row-group-column)').first().textContent();

					sPrixCessionAC= await pageTarifSimulation.dataGridTrSimulation.first().locator('td.text-right:NOT(.row-group-column)').nth(0).textContent();
					sPvcTTC       = await pageTarifSimulation.dataGridTrSimulation.first().locator('td.text-right:NOT(.row-group-column)').nth(5).textContent();

					//--------------------------------------------------------------------------------------------------------------------------------------------------------

					sPrixAchat    = sPrixAchat.match(/\d+([.,]\d+)?/g)?.map(x => Number(x.replace(',', '.'))).toString();
					//sPrixRevientTh= sPrixRevientTh.replace(',', '.');
					sPrixCessionAC= sPrixCessionAC.replace(',', '.');
					sPvcTTC       = sPvcTTC.replace(',', '.');

                    //--------------------------------------------------------------------------------------------------------------------------------------------------------

					sLabelNouvelleMarge = await pageTarifSimulation.labelNouvelleMarge.textContent();
					sLabelMargeActiuelle= await pageTarifSimulation.labelMargeActiuelle.textContent();

					sLabelNouvelleMarge = sLabelNouvelleMarge.match(/\d+([.,]\d+)?/g)?.map(x => Number(x.replace(/\s/g,""))).toString();
					sLabelMargeActiuelle= sLabelMargeActiuelle.match(/\d+([.,]\d+)?/g)?.map(x => Number(x.replace(/\s/g,""))).toString();

			    })

				test.describe ('Popin [' + sNomPopin.toLocaleUpperCase() + ']', async () => {
					test('Button [AJOUTER UNE LIGNE] - Click', async () => {
						await fonction.clickAndWait(pageTarifSimulation.buttonAjouterLigne, page);  
					})

					test('Popin [' + sNomPopin.toLocaleUpperCase() + '] - Is Visible', async () => {
						await fonction.popinVisible(page, sNomPopin, true);
					}) 

					test('Li [PROMOTION] - Is Visible', async () => {
						await expect(pageTarifSimulation.liPromotion).toHaveClass('p-highlight ng-star-inserted');
					})

					test('InputField [CODE ARTICLE] = "' + sCodeArticleAvecVMH + '"', async () => {
						var oData:AutoComplete = {
							libelle         :'CODE ARTICLE',
							inputLocator    : pageTarifSimulation.pInputCodeArticle.first(),
							inputValue      : sCodeArticleAvecVMH,
							choiceSelector  : '.dropdown-menu button',
							choicePosition  : 0,
							typingDelay     : 100,
							waitBefore      : 500,
							page            : page,
						}
						await fonction.autoComplete(oData);
					})

					test('Input [NOM PROMOTION]= "' + sNomPromotion + '"', async () => {
						await fonction.sendKeys(pageTarifSimulation.pInputNomPromotion, sNomPromotion, false, "Nom de la promotion");
						log.set('Nom de la promotion : ' + sNomPromotion);
					})

					test('Input [TYPE DE PROMOTION] - Click', async () => {
						await fonction.clickAndWait(pageTarifSimulation.pInputTypePromotion, page);
						await fonction.clickElement(pageTarifSimulation.pDropdownItem.nth(1));
					})

					test('Input [PRIX ACHAT]  - Saisie du prix achat', async () => {
						await fonction.sendKeys(pageTarifSimulation.pInputPrixAchat, Math.round(Number(sPrixAchat) - 2), false, "Prix achat");
						log.set('Prix achat : ' + sPrixAchat);
					})

					test('Input [PRIX DE REVIENT] - Is Equal', async () => {
						expect(await pageTarifSimulation.pInputPrixRevient.inputValue()).toEqual(sPrixRevientTh);
					})

					test('Input [PRIX DE CESSION]  - Saisie du prix de cession', async () => {
						await fonction.sendKeys(pageTarifSimulation.pInputPrixCession, Math.round(Number(sPrixCessionAC) - 2), false, "Prix de cession");
						log.set('Prix de cession : ' + sPrixCessionAC);
					})

					test('Input [PRIX TTC]  - Saisie du prix TTC', async () => {
						await fonction.sendKeys(pageTarifSimulation.pInputPvcTTC, Math.round(Number(sPvcTTC) - 2), false, "Prix TTC");
						log.set('Prix TTC : ' + sPvcTTC);
					})

					test('Input [DUREE DE LA PROMOTION] = "' + iDureePromotion.toString() + '"', async () => {
						await fonction.sendKeys(pageTarifSimulation.pInputDureePromotion, iDureePromotion.toString(), false, "Durée de la promotion");
						log.set('Durée de la promotion : ' + iDureePromotion);
					})

					test('Input [PLATEFORME] = "' + sPlateforme + '" - Click', async () => {
						await fonction.clickAndWait(pageTarifSimulation.pMultipleSelectSizePlateformes, page);
						await fonction.sendKeys(pageTarifSimulation.pInputFiltrePlateformesGroupeArticle, sPlateforme, false, "Plateforme");
						log.set('Plateforme : ' + sPlateforme);
					})

					test('Li [PLATEFORME] - Click', async () => {
						await fonction.waitForDomStable(page);
						await fonction.clickAndWait(pageTarifSimulation.pMultipleSelectItemPlateformesGroupeArticle, page);
					})

					test('Td [PLATEFORME] = "' + sPlateforme + '"', async () => {
						for (let i = 0; i < 15; i++) {
							expect(await pageTarifSimulation.pTdPlateformes.nth(i).textContent()).toContain(sPlateforme);
						}
					})

					test('Input [GROUPE MAGASIN] = "' + sGroupeMagasin + '" - Click', async () => {
						await fonction.clickAndWait(pageTarifSimulation.pMultipleSelectSizeGroupeArticle, page);
						await fonction.sendKeys(pageTarifSimulation.pInputFiltrePlateformesGroupeArticle, sGroupeMagasin.trim(), false, "Groupe magasin");
						log.set('Groupe magasin : ' + sGroupeMagasin);
					})

					test('Li [GROUPE MAGASIN] - Click', async () => {
						await fonction.waitForDomStable(page);
						await fonction.clickAndWait(pageTarifSimulation.pMultipleSelectItemPlateformesGroupeArticle, page);
					})

					test('Checkbox [GROUPE MAGASIN] - Click', async () => {
						for (let i = 0; i < 3; i++) {
							await fonction.clickAndWait(pageTarifSimulation.pCheckboxeMagasin.nth(i), page);
						}
					})

					test('Button [AJOUTER] - Click', async () => {
						await fonction.clickAndWait(pageTarifSimulation.pButtonAjouterLigne, page);
					})

					test('Popin [' + sNomPopin.toLocaleUpperCase() + '] - Is Not Visible', async () => { 
						await fonction.popinVisible(page, sNomPopin, false);
					})
				})

				test.describe ('Datagrid [SIMULATION PRIX] #1', async () => {

					test('Multiselect [STRATEGIE] - Click', async () => {
						await fonction.clickAndWait(pageTarifSimulation.selectStrategie, page);  
						await fonction.sendKeys(pageTarifSimulation.inputStrategie, sNomPromotion, false, "Stratégie");
					})

					test('Li [STRATEGIE] - Click', async () => {
						await fonction.clickAndWait(pageTarifSimulation.dataGridThMultiSelectItemStrategie, page);
					})

					test('Button [RECHERCHER] - Click', async () => {
						await fonction.clickAndWait(pageTarifSimulation.buttonRechercher, page);  
					})

					test('** Wait Until Spinner Off **', async () => {
						await fonction.waitForSpinner(pageTarifSimulation.spinnerLoading.first(), 180000);
					})

					test('Tr [SIMULATION PRIX] = Aucun résultat.', async () => {
						expect(await pageTarifSimulation.dataGridTrSimulation.locator('span').textContent()).toEqual("Aucun résultat.");
					})

					test.describe ('Popin [PARAMETRAGE]', async () => {

						test('Button [PARAMETRAGE] - Click', async () => {
							await fonction.clickAndWait(pageTarifSimulation.buttonParametrage.nth(1), page);
						})

						test('Checkbox [INCLURE PROMOTION] - Click', async () => {
							await fonction.clickAndWait(pageTarifSimulation.checkBoxInclurePromotion, page);
						})

						test('Button [APPLIQUER] - Click', async () => {
							await fonction.clickAndWait(pageTarifSimulation.buttonParametrageAppliquer, page);
						})

						test('** Wait Until Spinner Off **', async () => {
							await fonction.waitForSpinner(pageTarifSimulation.spinnerLoading.first(), 180000);
						})
					})

					test('Tr [SIMULATION PRIX] = 1', async () => {
						expect(await pageTarifSimulation.dataGridTrSimulation.count()).toBe(1);
					})

					test('Input [NOUVEAU PRIX ACHAT]  = "'+ sPrixAchat +'"', async () => {
						expect(parseInt(await pageTarifSimulation.dataGridInputNouveauPrixAchat.inputValue())).toEqual(Math.round(Number(sPrixAchat) - 2));
					})

					test('Input [NOUVEAU PRIX CESSION] = "' + sPrixCessionAC + '"', async () => {
						expect(parseInt(await pageTarifSimulation.dataGridInputNouveauPrixCession.inputValue())).toEqual(Math.round(Number(sPrixCessionAC) - 2));
					})

					test('Input [NOUVEAU PVC TTC] = "' + sPvcTTC + '"', async () => {
						expect(parseInt(await pageTarifSimulation.dataGridInputNouveauPvc.inputValue())).toEqual(Math.round(Number(sPvcTTC) - 2));
					})
				})

				test('Label [NOUVELLE MARGE MAGASIN][MARGE ACTUELLE] = 0', async () => {
					let sLabelNouvelleMarge = await pageTarifSimulation.labelNouvelleMarge.textContent();
					let sLabelMargeActiuelle= await pageTarifSimulation.labelMargeActiuelle.textContent();

					sLabelNouvelleMarge = sLabelNouvelleMarge.match(/\d+([.,]\d+)?/g)?.map(x => Number(x.replace(/\s/g,""))).toString();
					sLabelMargeActiuelle= sLabelMargeActiuelle.match(/\d+([.,]\d+)?/g)?.map(x => Number(x.replace(/\s/g,""))).toString();

					expect(sLabelNouvelleMarge).toBeGreaterThan(sLabelNouvelleMarge);
					expect(sLabelMargeActiuelle).toBeGreaterThan(sLabelMargeActiuelle);
				})
			})

			test.describe.skip('Div [AJOUT D\'UNE PROMOTION AVEC UN ARTICLE N\'AYANT PAS UNE VMH]', async () => {
				test.describe ('Datagrid [SIMULATION PRIX] #1', async () => {
					test('Input [CODE ARTICLE] = "' + sCodeArticleSansVMH + '"', async () => {
						await fonction.sendKeys(pageTarifSimulation.inputCodeArticle, sCodeArticleSansVMH, false, "Code article sans VMH");
						await fonction.waitForDomStable(page);
						log.set('Code article sans VMH : ' + sCodeArticleSansVMH);
					})

					test('Tr [SIMULATION PRIX] > 0', async () => {
						expect(await pageTarifSimulation.dataGridTrSimulation.count()).toBeGreaterThan(0);
						sPrixAchat    = await pageTarifSimulation.dataGridTrSimulation.first().locator('td.text-right.row-group-column').nth(3).textContent();
						sGroupeMagasin= await pageTarifSimulation.dataGridTrSimulation.first().locator('td.text-left.sticky-column:NOT(.row-group-column)').first().textContent();

						sPrixCessionAC= await pageTarifSimulation.dataGridTrSimulation.first().locator('td.text-right:NOT(.row-group-column)').nth(0).textContent();
						sPvcTTC       = await pageTarifSimulation.dataGridTrSimulation.first().locator('td.text-right:NOT(.row-group-column)').nth(5).textContent();
					})
				})

				test.describe ('Popin [' + sNomPopin.toLocaleUpperCase() + ']', async () => {
					test('Button [AJOUTER UNE LIGNE] - Click', async () => {
						await fonction.clickAndWait(pageTarifSimulation.buttonAjouterLigne, page);  
					})

					test('Popin [' + sNomPopin.toLocaleUpperCase() + '] - Is Visible', async () => {
						await fonction.popinVisible(page, sNomPopin, true);
					}) 

					test('InputField [CODE ARTICLE] = "' + sCodeArticleSansVMH + '"', async () => {
						var oData:AutoComplete = {
							libelle         :'CODE ARTICLE',
							inputLocator    : pageTarifSimulation.pInputCodeArticle.first(),
							inputValue      : sCodeArticleSansVMH,
							choiceSelector  : '.dropdown-menu button',
							choicePosition  : 0,
							typingDelay     : 100,
							waitBefore      : 500,
							page            : page,
						}
						await fonction.autoComplete(oData);
					})

					test('Input [NOM PROMOTION] = "' + sNomPromotion + '"', async () => {
						await fonction.sendKeys(pageTarifSimulation.pInputNomPromotion, sNomPromotion+fonction.getHMS(), false, "Nom de la promotion");
						log.set('Nom de la promotion : ' + sNomPromotion);
					})

					test('Input [TYPE DE PROMOTION] - Click', async () => {
						await fonction.clickAndWait(pageTarifSimulation.pInputTypePromotion, page);
						await fonction.clickElement(pageTarifSimulation.pDropdownItem.nth(1));
					})

					test('Input [PRIX ACHAT] = "' + sPrixAchat + '"', async () => {
						await fonction.sendKeys(pageTarifSimulation.pInputPrixAchat, Number(sPrixAchat) - 1, false, "Prix achat");
						log.set('Prix achat : ' + sPrixAchat);
					})

					test('Input [PRIX DE REVIENT] > 0', async () => {
						expect(await pageTarifSimulation.pInputPrixRevient.inputValue()).not.toBeNull();
					})

					test('Input [PRIX DE CESSION] = "' + sPrixCessionAC + '"', async () => {
						await fonction.sendKeys(pageTarifSimulation.pInputPrixCession, Number(sPrixCessionAC) - 1, false, "Prix de cession");
						log.set('Prix de cession : ' + sPrixCessionAC);
					})

					test('Input [PRIX TTC] = "' + sPvcTTC + '"', async () => {
						await fonction.sendKeys(pageTarifSimulation.pInputPvcTTC, Number(sPvcTTC) - 1, false, "Prix TTC");
						log.set('Prix TTC : ' + sPvcTTC);
					})

					test('Input [DUREE DE LA PROMOTION] = "' + iDureePromotion.toString() + '"', async () => {
						await fonction.sendKeys(pageTarifSimulation.pInputDureePromotion, iDureePromotion.toString(), false, "Durée de la promotion");
						log.set('Durée de la promotion : ' + iDureePromotion);
					})

					test('Input [PLATEFORME] = "' + sPlateforme + '" - Click', async () => {
						await fonction.clickAndWait(pageTarifSimulation.pMultipleSelectSizePlateformes, page);
						await fonction.sendKeys(pageTarifSimulation.pInputFiltrePlateformesGroupeArticle, sPlateforme, false, "Plateforme");
						log.set('Plateforme : ' + sPlateforme);
					})

					test('Li [PLATEFORME] - Click', async () => {
						await fonction.waitForDomStable(page);
						await fonction.clickAndWait(pageTarifSimulation.pMultipleSelectItemPlateformesGroupeArticle, page);
					})

					test('Input [GROUPE MAGASIN] = "' + sGroupeMagasin + '" - Click', async () => {
						await fonction.clickAndWait(pageTarifSimulation.pMultipleSelectSizeGroupeArticle, page);
						await fonction.sendKeys(pageTarifSimulation.pInputFiltrePlateformesGroupeArticle, sGroupeMagasin, false, "Groupe magasin");
						log.set('Groupe magasin : ' + sGroupeMagasin);
					})

					test('Li [GROUPE MAGASIN] - Click', async () => {
						await fonction.waitForDomStable(page);
						await fonction.clickAndWait(pageTarifSimulation.pMultipleSelectItemPlateformesGroupeArticle, page);
					})

					test('Checkbox [GROUPE MAGASIN] - Click', async () => {
						for (let i = 0; i < 3; i++) {
							await fonction.clickElement(pageTarifSimulation.pCheckboxeMagasin.nth(i));
						}
					})

					test('Button [AJOUTER] - Click', async () => {
						await fonction.clickAndWait(pageTarifSimulation.pButtonAjouterLigne, page);
					})

					test('Popin [' + sNomPopin.toLocaleUpperCase() + '] - Is Not Visible', async () => { 
						await fonction.popinVisible(page, sNomPopin, false);
					})
				})

				test.describe('Datagrid [SIMULATION PRIX] #2', async () => {

					test('Button [RECHARGER LES MARGES MAGASIN] - Click', async () => {
						await fonction.clickAndWait(pageTarifSimulation.buttonRechargerMargeMagasin, page);
					})

					test('** Wait Until Spinner Off #1 **', async () => {
						await fonction.waitForSpinner(pageTarifSimulation.spinnerLoading.first(), 180000);
					})

					test.describe ('Popin [PARAMETRAGE]', async () => {
						test('Button [PARAMETRAGE] - Click', async () => {
							await fonction.clickAndWait(pageTarifSimulation.buttonParametrage.nth(1), page);
						})

						test('Checkbox [ARTICLES INACTIFS] - Is Checked', async () => {
						   await expect(pageTarifSimulation.checkBoxArticlesInActifs).toHaveClass('p-inputswitch p-component p-inputswitch-checked');
						})
					})

					test('Multiselect [STRATEGIE] - Click', async () => {
						await fonction.clickAndWait(pageTarifSimulation.selectStrategie, page);  
						await fonction.sendKeys(pageTarifSimulation.inputStrategie, sNomPromotion+fonction.getHMS(), false, "Stratégie");
						await fonction.waitForDomStable(page);
					})

					test('Li [STRATEGIE] - Click', async () => {
						await fonction.clickAndWait(pageTarifSimulation.dataGridThMultiSelectItemStrategie.first(), page);
					})

					test('Button [RECHERCHER] - Click', async () => {
					   await fonction.clickAndWait(pageTarifSimulation.buttonRechercher, page);  
					})

					test('** Wait Until Spinner Off #2 **', async () => {
						await fonction.waitForSpinner(pageTarifSimulation.spinnerLoading.first(), 180000);
					})

					test('Tr [SIMULATION PRIX] = 0', async () => {
						expect(await pageTarifSimulation.dataGridTrSimulation.count()).toBe(0);
					})

					test('Inpu [MARGE MAGASIN] = 0', async () => {
						expect(await pageTarifSimulation.dataGridInputMargeMagasin.inputValue()).toBe('0');
					})

					test.skip('Label [NOUVELLE MARGE MAGASIN][MARGE ACTUELLE] = 0', async () => {
						expect(await pageTarifSimulation.labelNouvelleMarge.textContent()).toBe('0');
						expect(await pageTarifSimulation.labelMargeActiuelle.textContent()).toBe('0');
					})
				})
			})

			test('Button [EXPORTER] - Click', async () => {
				await fonction.clickAndWait(pageTarifSimulation.buttonExporter, page); 
			})
		})	//-- Onglet SIMULATION PRIX
	})  //-- End Describe Page

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})

