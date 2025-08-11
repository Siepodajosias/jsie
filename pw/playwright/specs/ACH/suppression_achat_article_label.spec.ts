/**
 * 
 * @author JOSIAS SIE
 * @since 2025-03-03
 * 
 */
const xRefTest      = "ACH_FRS_SLL";
const xDescription  = "Supprimer un article avec label d'un achat (1 ou 2 ligne(s) d'achat)";
const xIdTest       =  7178;
const xVersion      = '3.4';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'ACHATS',
	version     : xVersion,    
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['fournisseur','plateformeReception','plateformeDistribution','listeArticles','nbColisEstimes','rayon','listeMagasins'],
	fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, expect, type Page }             from '@playwright/test';

import { Help }                                from '@helpers/helpers';
import { TestFunctions }                       from '@helpers/functions';
import { EsbFunctions }                        from '@helpers/esb';
import { Log }                                 from '@helpers/log';

import { PageAchAchFour }                      from '@pom/ACH/achats_achats-fournisseurs.page';
import { MenuAchats }                          from '@pom/ACH/menu.page';

import { AutoComplete, CartoucheInfo, TypeEsb }from '@commun/types';

//------------------------------------------------------------------------------------
let page            : Page;
let pageAchAchFour  : PageAchAchFour;
let menu            : MenuAchats;
let esb             : EsbFunctions;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------
var iNbColis          		= fonction.getInitParam('nbColisEstimes', '10');
const sFournisseur    		= fonction.getInitParam('fournisseur', 'A.C.D.S'); 
var sPtfDistribut     		= fonction.getInitParam('plateformeDistribution', 'Chaponnay');
var sPtfReception     		= fonction.getInitParam('plateformeReception', 'Chaponnay');
const sCodeArticles   		= fonction.getInitParam('listeArticles', '7001, 7001');
const sRayon          		= fonction.getInitParam('rayon', 'Fruits et légumes');
const sListeMagasins:string	= fonction.getInitParam('listeMagasins', 'Bergerac,Bron');

const rPrixAchat      		= 1.000;
const sUniteAchat     		= 'Colis';
var sIncoterm         		= ''; 
var aListeMagasins:string[]	= sListeMagasins.split(',');

var iNbMagasin = aListeMagasins.length;
if(iNbMagasin > 0){
	iNbColis = (parseInt(iNbColis)*iNbMagasin).toString();
}
sPtfReception = sPtfReception.charAt(0).toUpperCase() + sPtfReception.slice(1).toLowerCase();

if(sPtfReception == sPtfDistribut){
	sIncoterm = 'D - Départ exp.';
} else {
	sIncoterm = 'P - Départ PF';
}

const sCategorie    = 'Extra';
var aCodesArticles  = sCodeArticles.split(',');

var doubleCheck = async (iPos:number,iIndex:number) => {
   
	//-- Click sur le Calibre cible
	await fonction.clickElement(pageAchAchFour.listBoxVarie.nth(iPos));
	await fonction.wait(page, 1000);

	 //-- Récupération Nom Conditionnement affiché
	var sNomConditionnement = await pageAchAchFour.fAcheterListBoxCondition.nth(iIndex).textContent();
	log.set('Conditionnement : ' + sNomConditionnement);
	if(sNomConditionnement !='' && sNomConditionnement != 'Aucun résultat trouvé'){
		await fonction.clickElement(pageAchAchFour.fAcheterListBoxCondition.nth(iIndex));
		const iNbeEltm:number = await pageAchAchFour.listBoxVarie.count();
		if(iNbeEltm > 0) {
			await fonction.clickElement(pageAchAchFour.listBoxVarie.last());
		} else {
			await fonction.clickElement(pageAchAchFour.fAcheterListBoxCalibre.nth(iIndex));
			iPos++;
			await doubleCheck(iPos, iIndex);
		}
	} 
}

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page            = await browser.newPage();
	menu            = new MenuAchats(page, fonction);
	pageAchAchFour  = new PageAchAchFour(page);
	esb             = new EsbFunctions(fonction);
	const helper    = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test ('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe ('Page [ACHATS]', async () => {

		test ('ListBox [RAYON] = "' + sRayon + '"', async () => {
			await menu.selectRayonByName(sRayon, page);
		})

		var pageName:string = 'achats';

		test ('Page [ACHATS] - Click', async () => {
			await menu.click(pageName, page);
		})

		var sNomOnglet:string = "ACHATS AUX FOURNISSEURS";
		test.describe ('Onglet [ACHATS AUX FOURNISSEURS]', async () => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
				await menu.clickOnglet(pageName, 'achatsAuxFournisseurs', page);
			})

			test ('Button [CREER ACHAT] - Click', async () => {
				await fonction.clickAndWait(pageAchAchFour.buttonCreerAchat,page);
			})

			test ('InputField [FOURNISSEUR] = "' + sFournisseur + '"', async () => {
				var oData:AutoComplete = {
					libelle         :'Fournisseur',
					inputLocator    : pageAchAchFour.fAcheterInputFournisseur,
					inputValue      : sFournisseur,
					choiceSelector  :'ngb-typeahead-window button',
					choicePosition  : 0,
					typingDelay     : 100,
					waitBefore      : 750,
					page            : page,
				}
				await fonction.autoComplete(oData);
				log.set('Fournisseur : ' + sFournisseur);
			})

			test ('Date Picker [DATE RECEPTION PLATEFORME] - Click', async () => {
			   await fonction.clickElement(pageAchAchFour.fAcheterPictoDateRecepPtf);
			})

			test ('Day [AUJOUR D\'HUI] - Click', async () => {
				await fonction.clickElement(pageAchAchFour.fAcheterDateToday);
			})

			test ('ListBox [PLATEFORME DE RECEPTION] = "' + sPtfReception + '"', async () => {
				await fonction.ngClickListBox(pageAchAchFour.fAcheterListBoxPtfRecep.first(), sPtfReception);
			})

			// Enregistrers Les lots achetés.
			aCodesArticles.forEach(async (sCodeArticle:string, iIndex:number) => {

				test ('InputField [AJOUTETR UN ARTICLE]["'+ iIndex + '"]' + sCodeArticle, async () => {
					var oData:AutoComplete = {
						libelle         :'ARTICLE',
						inputLocator    : pageAchAchFour.fAcheterInputAjoutArticle,
						inputValue      : sCodeArticle,
						choiceSelector  :'app-autocomplete button.dropdown-item',
						choicePosition  : 0,
						typingDelay     : 100,
						waitBefore      : 1000,
						page            : page,
					}
					await fonction.autoComplete(oData);
					log.set('Article : ' + sCodeArticle);
				})
	
				test ('Button [+] ["'+ iIndex + '"]' + sCodeArticle, async () => {
					await fonction.clickAndWait(pageAchAchFour.fAcheterButtonPlus,page);
				}) 

				test ('** Wait Until Spinner Off ** ["'+ iIndex + '"]' + sCodeArticle, async () => {
					await fonction.waitForSpinner(pageAchAchFour.spinnerLoading.first(),180000);
				}) 

				test ('ListBox [CALIBRE][CONDITIONNEMENT]["'+ iIndex + '"]' + sCodeArticle, async () => {
					await fonction.clickElement(pageAchAchFour.fAcheterListBoxCalibre.nth(iIndex));
					await doubleCheck(0,iIndex);
					const sNomCalibre        = await pageAchAchFour.fAcheterListBoxCalibre.nth(iIndex).textContent();
					const sNomConditionnement= await pageAchAchFour.fAcheterListBoxCondition.nth(iIndex).textContent();

					await fonction.addDataSheet('ListBox', 'Calibre', sNomCalibre);
					await fonction.addDataSheet('ListBox', 'Conditionnement', sNomConditionnement);
				})
			
				test ('ListBox [CATEGORIE]["'+ iIndex + '"]' + sCodeArticle, async () => {
					await fonction.clickElement(pageAchAchFour.fAcheterListBoxCategorie.nth(iIndex));
					await pageAchAchFour.listBoxVarie.last().waitFor({state:'visible'});
					const bCategorieVisible = await pageAchAchFour.listBoxVarie.filter({hasText:sCategorie}).nth(0).isVisible();
					if(bCategorieVisible){
						await fonction.clickAndWait(pageAchAchFour.listBoxVarie.filter({hasText:sCategorie}).nth(0), page);
					}
				})

				test ('ListBox [VARIETE][1]["'+ iIndex + '"]' + sCodeArticle, async () => {
					const bIsVisible = await pageAchAchFour.fAcheterListBoxVarDisabled.nth(iIndex).isVisible();
					if(!bIsVisible){
						await fonction.clickElement(pageAchAchFour.fAcheterListBoxVariete.nth(iIndex));
						await pageAchAchFour.listBoxVarie.last().waitFor({state:'visible'});
						const iNbreElmt = await pageAchAchFour.listBoxVarie.count();
						if(iNbreElmt > 1){
							await fonction.clickAndWait(pageAchAchFour.listBoxVarie.nth(1), page);
						}
					}
				})

				test ('ListBox [ORIGINEE]["'+ iIndex + '"]' + sCodeArticle, async () => {
					await fonction.clickElement(pageAchAchFour.fAcheterListBoxOrigine.nth(iIndex));
					const iNbreElmt = await pageAchAchFour.listBoxVarie.count();
					if(iNbreElmt > 0){
						await fonction.clickAndWait(pageAchAchFour.listBoxVarie.nth(0), page);
						if(iNbreElmt === 1){ // Si la listBox contient un seul element, après la selection de l'element, le listBox reste Ouvert.
							await fonction.clickElement(pageAchAchFour.fAcheterListBoxCalibre.nth(iIndex)); // Ce click va fermer cette listbox avant d'aller à l'étape suivante
						}
					}
				})

				test ('ListBox [PLATEFORME DISTRIBUTION]["'+ iIndex + '"]' + sCodeArticle, async () => {
					await fonction.clickElement(pageAchAchFour.listBoxPtfDistribution.nth(iIndex));
					if(iIndex==1){
						sPtfDistribut ='2C Log 10°';
					}
					await fonction.clickAndWait(pageAchAchFour.listBoxVarie.filter({hasText:sPtfDistribut}).nth(0), page);
					await fonction.addDataSheet('ListBox', 'Plateforme Distribution', sPtfDistribut);
				})

				test ('ListBox [INCOTERM]["'+ iIndex + '"]' + sCodeArticle, async () => {
					await fonction.clickElement(pageAchAchFour.fAcheterListBoxIncoterm.nth(iIndex));
					await fonction.clickAndWait(pageAchAchFour.listBoxVarie.filter({hasText:sIncoterm}).nth(0), page);
					await fonction.addDataSheet('ListBox', 'Incoterm', sIncoterm);
				})
				
				test ('ListBox [PRIX ACHAT EN]["'+ iIndex + '"]' + sCodeArticle, async () =>{
					await fonction.clickElement(pageAchAchFour.fAcheterListBoxUniteAchat.nth(iIndex));
					await fonction.clickAndWait(pageAchAchFour.listBoxVarie.filter({hasText:sUniteAchat}).nth(0), page);
					await fonction.addDataSheet('ListBox', 'Prix Unité Achat', sUniteAchat);
				})

				test ('InputField [PRIX ACHAT]["'+ iIndex + '"]' + sCodeArticle, async () => {
					const sDernierPrix = await pageAchAchFour.tdDernierPrixAchat.nth(iIndex).textContent();
					if(sDernierPrix != ''){
						await fonction.clickElement(pageAchAchFour.dataGridAchat.nth(1).locator('.p-selectable-row').nth(iIndex).locator('td .pi-arrow-right').nth(0));
						await fonction.wait(page, 250);
					} else {
						await fonction.sendKeys(pageAchAchFour.inputPrixAchat.nth(iIndex), rPrixAchat, false, 'Prix Achat');
						await fonction.wait(page, 250);
					}
				})
			})

			test ('Button [ENREGISTRER] - Click', async () => {
				await fonction.clickAndWait(pageAchAchFour.fAcheterbuttonEnregistrer, page);
			})

			test ('** Wait Until Spinner Off **', async () => {
				await fonction.waitForSpinner(pageAchAchFour.spinnerLoading.first(), 180000);
			}) 

			// Modification des lots enregistrers.
			aCodesArticles.forEach(async (sCodeArticle:string, iIndex:number) => {
				test.describe ('Popin [DETAIL LOTS]["'+ iIndex + '"]' + sCodeArticle, async () => {
					test ('CheckBox [LOT] - Click', async () => {
						await fonction.clickElement(pageAchAchFour.pPcheckBoxLot.nth(iIndex));
					})
	
					test ('Button [VOIR DETAIL] - Click', async () => {
						await fonction.clickAndWait(pageAchAchFour.pPbuttonDetailLot, page);
					})

					test ('Popin [DETAIL LOTS] - Is Visible', async () =>  {
						await fonction.popinVisible(page, 'DETAIL LOTS', true);
					})
	
					test ('CheckBox [LABELS] - Check', async () => {
						expect(await pageAchAchFour.pPSwitchLabel.nth(0).textContent()).toContain('AOP');
						expect(await pageAchAchFour.pPSwitchLabel.nth(1).textContent()).toContain('TA_CODE_');
					})

					test ('CheckBox [LABELS] - Click', async () => {
						await fonction.clickElement(pageAchAchFour.pPSwitchLabel.nth(1));
					})
	
					test ('Button [ENREGISTRER] - Click', async () => {
						await fonction.clickAndWait(pageAchAchFour.pPbuttonEnregistrerDeLot, page, 28000);
					})

					test ('Button [OUI] - Click Optionnel', async () => {
						const isPresent = await pageAchAchFour.alertErreur.isVisible();
						if(isPresent){
							await fonction.clickAndWait(pageAchAchFour.pPbuttonAlertOuiNon.nth(0), page);
						}
					})

					test ('Popin [DETAIL LOTS] - Is Hidden', async () =>  {
						await fonction.popinVisible(page, 'DETAIL LOTS', false, 3000);
					})
				})
			})

			// Achat des lots.
			aCodesArticles.forEach(async (sCodeArticle:string, iIndex:number) => {
				test ('InputField [COLIS ESTIME]["'+ iIndex + '"]' + sCodeArticle, async () => {
					await fonction.sendKeys(pageAchAchFour.fAcheterInputColisEst.nth(iIndex), iNbColis.toString(), false, 'Colis Estime');
					await fonction.clickElement(pageAchAchFour.trBasculerColisEstime1.nth(iIndex));
					await fonction.wait(page, 250);
				})
			})

			test ('CheckBox [ALL] - Click', async () => {
				await fonction.clickElement(pageAchAchFour.pPcheckBoxAllLot);
			})

			test ('Button [ACHETER] - Click', async () => {
				await fonction.clickAndWait(pageAchAchFour.fAcheterbuttonAcheter, page);
			}) 

			test ('Confirmation [ACHETER] - Click if present', async () => {
				var isElementVisible = await pageAchAchFour.pPconfirmButtonAcheter.isVisible();
				if(isElementVisible){
					await fonction.clickAndWait(pageAchAchFour.pPconfirmButtonAcheter, page);
				}
				await pageAchAchFour.fAcheterLabelNumAchat.waitFor({state:'visible'});
				var sNumAchat = await pageAchAchFour.fAcheterLabelNumAchat.textContent();
				await fonction.addDataSheet('ListBox', 'Numéro Achat', sNumAchat);
			})

			test ('** Wait Until Spinner Off #2 **', async () => {
				await fonction.waitForSpinner(pageAchAchFour.spinner4, 180000);
			})

			const sStatuAcha:string = 'A confirmer';
			test ('Label [STAUT] = "'+ sStatuAcha +'"', async () => {
				expect(await pageAchAchFour.labelStatutAchat.textContent()).toBe(sStatuAcha);
			})

			// Suprresion d'un lot.
			aCodesArticles.forEach(async (sCodeArticle:string, iIndex:number) => {
				test.describe ('Popin [SUPPRESSION DE LOTS]["'+ iIndex + '"]' + sCodeArticle, async () => {
					test ('CheckBox [LOT]['+ sCodeArticle + '] - Click', async () => {
						await fonction.clickElement(pageAchAchFour.pPcheckBoxLot.nth(0));
					})
	
					test ('Button [SUPPRESSION]['+ sCodeArticle + '] - Click', async () => {
						await fonction.clickAndWait(pageAchAchFour.fAcheterbuttonSupprimer, page);
					})

					test ('Button [CONFIRMER]['+ sCodeArticle + '] - Click', async () => {
						await fonction.clickAndWait(pageAchAchFour.pPSuppresButtonSupprimer, page);
					})

					const sStatuAch:string = 'A envoyer';
					test ('Label [STAUT] ["'+ sStatuAch +'"] - Check', async () => {
						expect(await pageAchAchFour.labelStatutAchat.textContent()).toBe(sStatuAch);
					})
				})
			})

			// Modification des prix d'achat des lots.
			test ('InputField [AJOUTETR UN ARTICLE] #2 = "' + aCodesArticles[0] + '"', async () => {
				var oData:AutoComplete = {
					libelle         :'ARTICLE',
					inputLocator    : pageAchAchFour.fAcheterInputAjoutArticle,
					inputValue      : aCodesArticles[0] ,
					choiceSelector  :'app-autocomplete button.dropdown-item',
					choicePosition  : 0,
					typingDelay     : 100,
					waitBefore      : 750,
					page            : page,
				}
				await fonction.autoComplete(oData);
			})

			test ('Button [+] #2 - Click', async () => {
				await fonction.clickAndWait(pageAchAchFour.fAcheterButtonPlus,page);
			})

			aCodesArticles.forEach(async (sCodeArticle:string, iIndex:number) => {
				test ('InputField [PRIX ACHAT]['+ iIndex + '] #3 = "' + rPrixAchat + '"', async () => {
					await fonction.sendKeys(pageAchAchFour.inputPrixAchat.nth(iIndex), iIndex+3, false, 'Prix Achat');
					await fonction.wait(page, 250);
				})

				test ('InputField [COLIS ESTIME]['+ iIndex + '] #3', async () => {
					await fonction.sendKeys(pageAchAchFour.fAcheterInputColisEst.nth(iIndex), 7, false, 'Colis Estime');
					await fonction.clickElement(pageAchAchFour.trBasculerColisEstime1.nth(iIndex));
					await fonction.wait(page, 250);
				})
			})

			test ('Button [ENREGISTRER] #2 - Click', async () => {
				await fonction.clickAndWait(pageAchAchFour.fAcheterbuttonEnregistrer, page);
			})

			test ('CheckBox [ALL] #2 - Click', async () => {
				await fonction.clickElement(pageAchAchFour.pPcheckBoxAllLot);
			})

			test ('Button [ACHETER] #2 - Click', async () => {
				await fonction.clickAndWait(pageAchAchFour.fAcheterbuttonAcheter,page);
			})

			test ('Confirmation [ACHETER]#2 - Click if present', async () => {
				var isElementVisible = await pageAchAchFour.pPconfirmButtonAcheter.isVisible();
				if(isElementVisible){
					await fonction.clickAndWait(pageAchAchFour.pPconfirmButtonAcheter, page);
				}
				await pageAchAchFour.fAcheterLabelNumAchat.waitFor({state:'visible'});
				var sNumAchat = await pageAchAchFour.fAcheterLabelNumAchat.textContent();
				await fonction.addDataSheet('ListBox', 'Numéro Achat', sNumAchat);
			})

			test ('** Wait Until Spinner Off #3 **', async () => {
				await fonction.waitForSpinner(pageAchAchFour.spinnerLoading.first());
			}) 

			const sStatuAcha2:string = 'A confirmer';
			test ('Label [STAUT] #2 = "'+ sStatuAcha2 +'"', async () => {
				expect(await pageAchAchFour.labelStatutAchat.textContent()).toBe(sStatuAcha2);
			})

			// Suprresion des lots achetés
			aCodesArticles.forEach(async (sCodeArticle:string, iIndex:number) => {
				test.describe ('Popin [SUPPRESSION DE LOTS] #2'+ sCodeArticle, async () => {
					test ('CheckBox [LOT]['+ iIndex + '] - Click', async () => {
						await fonction.clickElement(pageAchAchFour.pPcheckBoxLot.nth(0));
					})
					test ('Button [SUPPRESSION]['+ iIndex + '] - Click',async () => {
						await fonction.clickAndWait(pageAchAchFour.fAcheterbuttonSupprimer, page);
					})

					test ('Button [CONFIRMER]['+ iIndex + '] - Click', async () => {
						await fonction.clickAndWait(pageAchAchFour.pPSuppresButtonSupprimer, page);
					})

					const sStatuAch:string = 'A envoyer';
					test ('Label [STAUT]['+ iIndex + '] = "'+ sStatuAch +'"', async () => {
						expect(await pageAchAchFour.labelStatutAchat.textContent()).toBe(sStatuAch);
					})
				})
			})
		})
	})

	test.skip('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

	test.skip('Check Flux :', async () => { 
		var oFlux:TypeEsb   =  { 
			"FLUX" : [ 
				{
					"NOM_FLUX"  : "Diffuser_Lot",
					STOP_ON_FAILURE  : false
				}
			],
			"WAIT_BEFORE"   : 3000,                 // Optionnel
			"VERBOSE_MOD"   : true
		};
		await esb.checkFlux(oFlux,page);
	})

})