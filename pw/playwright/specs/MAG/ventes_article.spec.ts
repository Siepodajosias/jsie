  /**
 * 
 * @author Vazoumana DIARRASSOUBA & JOSIAS SIE
 *  Since 27 - 11 - 2023
 */

const xRefTest      = "MAG_VTE_ART";
const xDescription  = "Lister les ventes d'un article";
const xIdTest       =  27;
const xVersion      = '3.3';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'MAGASIN',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['ville', 'codeArticle'],
	fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}       from '@playwright/test';

import { TestFunctions }                from "@helpers/functions";
import { Log }                          from "@helpers/log";
import { Help }                         from '@helpers/helpers';

import { MenuMagasin }                  from '@pom/MAG/menu.page';
import { VentesArticle }                from '@pom/MAG/ventes-article.page';

import { AutoComplete, CartoucheInfo } 	from '@commun/types';

//-------------------------------------------------------------------------------------

let page         : Page;

let menu         : MenuMagasin;
let pageVArticle : VentesArticle;

const log        = new Log();
const fonction   = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const sNomVille     = fonction.getInitParam('ville','Albi (G211)');
const sCodeArticle  = fonction.getInitParam('codeArticle','5710'); 
const sRayon        = fonction.getInitParam('rayon', 'CR');

const aGroupes    = fonction.getLocalConfig('aGroupes');
const aFamilles   = fonction.getLocalConfig('aFamilles');

const aNomGroupes = aGroupes[sRayon];
const aNomFamilles= aFamilles[sRayon];
//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page            = await browser.newPage(); 
	menu            = new MenuMagasin(page, fonction);
	pageVArticle    = new VentesArticle(page);
	const helper    = new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

	test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test('Connexion', async () => {
		await fonction.connexion(page);
	});

	test.describe('Page [ACCUEIL]', async () => {

		test('Link [BROWSER SECURITY WARNING] - Click', async () => {
			await fonction.waitTillHTMLRendered(page);
			var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
			if(isVisible){
				await menu.removeArlerteMessage(page);
			}else{
				log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
				test.skip();
			}
		})

		test('ListBox [LIEU DE VENTE] = "' + sNomVille + '"', async () => {
			await menu.selectVille(sNomVille, page);
		})
	})

	test.describe('Page [VENTES]', async () => {
		
		var sNomPage = 'ventes';

		test('Page [VENTES] - Click', async () => {
			await menu.click(sNomPage, page);
		})    

		test.describe('Onglet [ANALYSE DES VENTES]', async () => {
   
			test('Label [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 
			
			test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
                await fonction.waitTillHTMLRendered(page);
                var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
                if(isVisible){
                    await menu.removeArlerteMessage(page);
                }else{
                    log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                    test.skip();
                }
            })

			test('InputField [AUTOCOMPLETE][ARTICLE] = "' + sCodeArticle + '"', async () => {
				var oData:AutoComplete = {
					libelle         :'ARTICLE',
					inputLocator    : pageVArticle.inputArticle,
					inputValue      : sCodeArticle,
					choiceSelector  :'li.gfit-autocomplete-result',
					choicePosition  : 0,
					typingDelay     : 100,
					waitBefore      : 500,
					page            : page,
				};
				await fonction.autoComplete(oData);
			})

			test('Button [RECHERCHER] - Click', async () => {
				await fonction.clickAndWait(pageVArticle.buttonRechercher, page);
			})            

			test('Label [Montant TTC total des ventes] > 0 €', async () =>{
				if (await pageVArticle.dataGridListeVentesLine.first().isVisible()){
					var sTexte = await pageVArticle.labelTotalDesVentes.textContent();
					log.set('Code Article : ' + sCodeArticle);
					if(sTexte){
						log.set(sTexte.trim());
						var aBouts   = sTexte.split(' : ');
						var sMontant = aBouts[1];
						sMontant     = sMontant.replace('€', '');
						sMontant     = sMontant.replace(' ', '');
						sMontant     = sMontant.replace(',', '.');
						var iMontant = parseInt(sMontant);
						expect(iMontant).toBeGreaterThan(0);
					}
				}else{
					log.set('Aucune vente pour cette recherche : la verification du montant TTC total des ventes est annulée');
					test.skip();
				}
			})

			//----------------------Remontées des ventes en fonction du PVC Magasin.-----------------------------
			
			test.describe('Div [FILTRE PVC]', async () => {
				test('Td [PVC MAGASIN]', async () => {
					if (await pageVArticle.dataGridListeVentesLine.first().isVisible()){
						var sTexte  = await pageVArticle.tdPvc.first().textContent();
						var sPvcMax = sTexte.trim();
						log.set('Pvc Maximal : ' + sPvcMax);
						if(sTexte){
							await fonction.sendKeys(pageVArticle.inputPVCTo, sPvcMax, false, 'Le pvc maximal');
						}
					}else{
						log.set('Aucune vente pour cette recherche : la vérification du PVC magasin est annulée');
						test.skip();
					}
				})
	
				test('Button [RECHERCHER] - Click', async () => {
					await fonction.clickAndWait(pageVArticle.buttonRechercher, page);
				}) 
	
				test('Label [Montant TTC total des ventes] > 0 €', async () =>{
					if (await pageVArticle.dataGridListeVentesLine.first().isVisible()){
						var sTexte = await pageVArticle.labelTotalDesVentes.textContent();
						if(sTexte){
							log.set(sTexte.trim());
							var aBouts   = sTexte.split(' : ');
							var sMontant = aBouts[1];
							sMontant     = sMontant.replace('€', '');
							sMontant     = sMontant.replace(' ', '');
							sMontant     = sMontant.replace(',', '.');
							var iMontant = parseInt(sMontant);
							expect(iMontant).toBeGreaterThan(0);
						}
					}else{
						log.set('Aucune vente pour cette recherche : la verification du montant TTC total des ventes est annulée');
						test.skip();
					}
				})
	
				test('Input [PVC] - Clear', async () => {
					await pageVArticle.inputPVCTo.clear();
				})
			})

			//----------------------Remontées des ventes sur un  ou plusieurs jours.-----------------------------
			
			test.describe('Div [FILTRE JOURNEE]', async () => {
				test('DatePicker [SUR LA PERIODE DU] - Click', async () => {
					await fonction.clickElement(pageVArticle.datePickerVentesDu);
				})
	
				test('Td [SUR LA PERIODE DU] - Click', async () => {
					await fonction.clickElement(pageVArticle.tdActiveDays.first());
				})
				
				test('Button [RECHERCHER]- Click', async () => {
					await fonction.clickAndWait(pageVArticle.buttonRechercher, page);
				})
	
				test('Label [Montant TTC total des ventes] > 0 €', async () =>{
					if (await pageVArticle.dataGridListeVentesLine.first().isVisible()){
						var sTexte = await pageVArticle.labelTotalDesVentes.textContent();
						if(sTexte){
							log.set(sTexte.trim());
							var aBouts   = sTexte.split(' : ');
							var sMontant = aBouts[1];
							sMontant     = sMontant.replace('€', '');
							sMontant     = sMontant.replace(' ', '');
							sMontant     = sMontant.replace(',', '.');
							var iMontant = parseInt(sMontant);
							expect(iMontant).toBeGreaterThan(0);
						}
					}else{
						log.set('Aucune vente pour cette recherche : la verification du montant TTC total des ventes est annulée');
						test.skip();
					}
				})
			})

			//----------------------Remontées des ventes sur la semaine précédente.------------------------------
			
			test.describe('Div [FILTRE SEMAINE]', async () => {
				test('DatePicker [SUR LA PERIODE DU] - Click', async () => {
					await fonction.clickElement(pageVArticle.datePickerVentesDu);
				})
	
				test('Td [SUR LA PERIODE DU] - Click', async () => {
					var sToDay        = await pageVArticle.tdToDays.last().textContent();
					var iPositionToDay= parseInt(sToDay) - 1;
					if(iPositionToDay > 7){
					   var iPositionLast = iPositionToDay - 7;
					   await fonction.clickElement(pageVArticle.tdActiveDays.nth(iPositionLast));
					}else{
						await fonction.clickElement(pageVArticle.pictoMoisPrecedent);
						var sDateprecedente= fonction.getToday('FR', - 7, ',');
						var sPositPreced=sDateprecedente.split (',');
						const index = parseInt(sPositPreced[0]) - 1;
						await fonction.clickElement(pageVArticle.tdActiveDays.nth(index));
					}
				})
	
				test('Button [RECHERCHER] - Click', async () => {
					await fonction.clickAndWait(pageVArticle.buttonRechercher, page);
				})

				test('Label [Montant TTC total des ventes] > 0 €', async () => {
					if (await pageVArticle.dataGridListeVentesLine.first().isVisible()){
						var sTexte = await pageVArticle.labelTotalDesVentes.textContent();
						if(sTexte){
							log.set(sTexte.trim());
							var aBouts   = sTexte.split(' : ');
							var sMontant = aBouts[1];
							sMontant     = sMontant.replace('€', '');
							sMontant     = sMontant.replace(' ', '');
							sMontant     = sMontant.replace(',', '.');
							var iMontant = parseInt(sMontant);
							expect(iMontant).toBeGreaterThan(0);
						}
					}else{
						log.set('Aucune vente pour cette recherche : la verification du montant TTC total des ventes est annulée');
						test.skip();
					}
				})
			})

			//----------------------Remontées des ventes pour un groupe article et plusieurs familles.-----------

			test.describe('Div [FILTRE GROUPE ARTICLE ET PLUSIEURS FAMILLES]', async () => {
				test('Icon  [GROUPE ARTICLE][CLEAR] - Click', async() => {
					await fonction.clickElement(pageVArticle.iconClear);
				})
	
				test ('ListBox  [GROUPE ARTICLE] - Click', async() => {
					await fonction.clickElement(pageVArticle.listBoxGrpArticle); 
				})
	
				test ('CheckBox [GROUPE ARTICLE] ["' + aNomGroupes[0] + '"] - Click', async() => {  
					var isVisible = await pageVArticle.checkBoxChoix.filter({ hasText: aNomGroupes[0] }).isVisible();
					if (isVisible) {    
						await fonction.clickElement(pageVArticle.checkBoxChoix.filter({ hasText: aNomGroupes[0] }));
						log.set('Groupe Article : ' + aNomGroupes[0] + ' Sélectionné');
					} else {
						log.set('Groupe Article : ' + aNomGroupes[0] + ' Ignoré');
					}
				})
	
				test ('ListBox  [GROUPE ARTICLE] - Close', async() => {
					await fonction.clickAndWait(pageVArticle.pictoCloseSelect,page);                  
				})
		
				test ('ListBox  [FAMILLE][First] - Click', async() => {
					await fonction.clickElement(pageVArticle.listBoxFamille); 
				})

				test ('CheckBox [FAMILLE] ["' + aNomFamilles[0] + '"] - Click', async() => { 
					var isVisible = await pageVArticle.checkBoxChoix.filter({ hasText: aNomFamilles[0] }).isVisible();              
					if (isVisible) {    
						await fonction.clickElement(pageVArticle.checkBoxChoix.filter({ hasText: aNomFamilles[0] }));
						log.set('Famille : ' + aNomFamilles[0] + ' Sélectionné');
					} else {
						log.set('Famille : ' + aNomFamilles[0] + ' Ignoré');
					}
				})
	
				test ('ListBox  [FAMILLE] - Close', async() => {
					await fonction.clickElement(pageVArticle.pictoCloseSelect);                  
				})

				test('Button [RECHERCHER][First] - Click', async () => {
					await fonction.clickAndWait(pageVArticle.buttonRechercher, page);
				})

				test('Label [Montant TTC total des ventes] > 0 €', async () => {
					if (await pageVArticle.dataGridListeVentesLine.first().isVisible()){
						var sTexte = await pageVArticle.labelTotalDesVentes.textContent();
						if(sTexte){
							log.set(sTexte.trim());
							var aBouts   = sTexte.split(' : ');
							var sMontant = aBouts[1];
							sMontant     = sMontant.replace('€', '');
							sMontant     = sMontant.replace(' ', '');
							sMontant     = sMontant.replace(',', '.');
							var iMontant = parseInt(sMontant);
							expect(iMontant).toBeGreaterThan(0);
						}
					}else{
						log.set('Aucune vente pour cette recherche : la verification du montant TTC total des ventes est annulée');
						test.skip();
					}
				})

				//-------------------------------------------------------------------------------------------------

				test ('Icon [FAMILLE][CLEAR] - Click', async() => {
					await fonction.clickElement(pageVArticle.pIctoCloseSelectF);                  
				})

				test ('ListBox  [FAMILLE] - Click', async() => {
					await fonction.clickElement(pageVArticle.listBoxFamille); 
				})

				aNomFamilles.forEach((sNomFamille: any) => {
					test ('CheckBox [FAMILLES] ["' + sNomFamille + '"] - Click', async() => {                      
						if (await pageVArticle.checkBoxChoix.filter({ hasText: sNomFamille }).isVisible()) {    
							await fonction.clickElement(pageVArticle.checkBoxChoix.filter({ hasText: sNomFamille }));
							log.set('Famille : ' + sNomFamille + ' Sélectionné');
						} else {
							log.set('Famille : ' + sNomFamille + ' Ignoré');
						}
					})
				});

				test('Button [RECHERCHER] - Click', async () => {
					await fonction.clickAndWait(pageVArticle.buttonRechercher, page);
				})
			})

			test('Button [EXPORTER] - Click', async() => {
				await fonction.clickAndWait(pageVArticle.buttonExporter, page);
			})

			//----------------------Remontées des ventes en promotion.-------------------------------------------

			test.describe('Div [FILTRE AVEC PROMOTION]', async () => {

				test ('Icon [FAMILLE][CLEAR] - Click', async() => {
					await fonction.clickElement(pageVArticle.pIctoCloseSelectF);                  
				})
	
				test ('Input [AVEC PROMOTION] - Click', async() => {
					await fonction.clickElement(pageVArticle.inputAvecPromotion);                  
				})
	
				test('Button [RECHERCHER] - Click', async () => {
					await fonction.clickAndWait(pageVArticle.buttonRechercher, page);
				})
			})
		}); // end describe

	}); // end describe

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})