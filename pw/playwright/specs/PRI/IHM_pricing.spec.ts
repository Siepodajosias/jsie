/**
 * 
 * PRICING APPLICATION > CONTENU
 * 
 * @author Vazoumana Diarrassouba
 * @since 2023/09/22
 * 
 */

const xRefTest      = "PRI_IHM_GLB";
const xDescription  = "Examen de l'IHM Pricing";
const xIdTest       =  567;
const xVersion      = '3.21';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'PRICING',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : [],
	fileName    : __filename
}

//----------------------------------------------------------------------------------------

import { test, type Page }                  from '@playwright/test';

import { Help }                             from '@helpers/helpers.js';
import { TestFunctions }                    from '@helpers/functions.js';
import { Log }                              from '@helpers/log.js';

import { MenuPricing }                      from '@pom/PRI/menu.page.js';
import { TarificationPage }                 from '@pom/PRI/tarification_tarification.page.js';
import { SimulationPrixPage }               from '@pom/PRI/tarification_simulation-prix.page.js';
import { PlanPromoPromotions } 				from '@pom/PRI/plan-promo_promotions.page';
import { PlanPromoCommunication } 			from '@pom/PRI/plan-promo_communication.page';
import { AlignementsPage }                  from '@pom/PRI/alignements.page.js';
import { GestionsMagasinPage }              from '@pom/PRI/gestions_magasins.page.js';
import { StrategiesArticlesPage }           from '@pom/PRI/strategies_articles.page.js';
import { AdminParametrage }                 from '@pom/PRI/admin_parametrage.page.js';

import { CartoucheInfo, TypeListOfElements }from '@commun/types';
import { describe } from 'node:test';

//------------------------------------------------------------------------------------

let page                : Page;
let menu            	: MenuPricing;

let pageTarif           : TarificationPage;
let pageTarifSimulation : SimulationPrixPage;
let pagePlanPromo		: PlanPromoPromotions;
let pagePlanCom			: PlanPromoCommunication;
let pageAlignement      : AlignementsPage;
let pageGestion         : GestionsMagasinPage;
let pageStrategies      : StrategiesArticlesPage;
let pageAdminParametrage: AdminParametrage;

const log               = new Log();
const fonction          = new TestFunctions(log);

fonction.recordDatas(false);		//-- Inutile de créer une fiche de données

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {

	page                = await browser.newPage();

	menu            	= new MenuPricing(page, fonction);
	
	pageTarif           = new TarificationPage(page);
	pageTarifSimulation = new SimulationPrixPage(page);
	pagePlanPromo		= new PlanPromoPromotions(page);
	pagePlanCom			= new PlanPromoCommunication(page);
	pageAlignement      = new AlignementsPage(page);
	pageGestion         = new GestionsMagasinPage(page);
	pageStrategies      = new StrategiesArticlesPage(page);
	pageAdminParametrage= new AdminParametrage(page);

	await menu.searchNewElements(testInfo);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.beforeEach(async ({}, testInfo) => {
	await fonction.trace(testInfo);
	await fonction.checkConsole(page, testInfo, false);
})

test.afterAll(async ({}, testInfo) => {
	await menu.showNewElements();
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

	test.describe ('Page [ACCUEIL]', async () => {

		test ('ListBox [RAYON] = "Fruits et légumes"', async () =>{
			await fonction.isDisplayed(menu.listBoxRayon)
			await menu.selectRayonByName('Fruits et légumes', page);
		})
	})

	test.describe ('Page [TARIFICATION]', async () => {

		var pageName:string = 'tarification';

		test ('Page [TARIFICATION] - Click',async () => {
			await menu.click(pageName, page);
		})

		test.describe ('Onglet [TARIFICATION]', async () => {
			var isVisibButtonTarifMag: boolean = false;

			test ('Button [TARIFICATION] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.buttonTarification); 
			})

			test('Button [COLONNE A AFFICHER] - Click', async () => {
				await fonction.clickAndWait(pageTarif.buttonColonnes, page);
			})

			test('CheckBox [COLONNES A AFFICHER] - Click', async () => {
				var isVisible = await pageTarif.checkBoxColonneAAfficher.isVisible();
				if(!isVisible){
					await fonction.clickAndWait(pageTarif.checkBoxColonneAffiche, page);
				}
			})

			test ('Button [Is Visible] - Check', async () => {
				var isVisible= await pageTarif.spanMessageTransmission.nth(1).isVisible();
				var sTexte   = await pageTarif.spanMessageTransmission.nth(1).textContent();
				if(isVisible && sTexte.includes('Transmission définitive')){
                    log.set('Ces boutons ne peuvent pas être contrôlés car les tarifications ont été transmises.');
				}else{
				    isVisibButtonTarifMag = true;
					await fonction.isDisplayed(pageTarif.buttonEnregistrer);  
					await fonction.isDisplayed(pageTarif.buttonDateFinValidite); 
					await fonction.isDisplayed(pageTarif.buttonValider);
					await fonction.isDisplayed(pageTarif.buttonInvalider); 
					await fonction.isDisplayed(pageTarif.buttonTarifsMagasin);
					await fonction.isDisplayed(pageTarif.checkBoxTarifeValide); 
				}
			})
		
			test ('Button [MARGES GLOBALES] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.buttonMargesGlobales); 
			}) 

			test ('Button [EXPORT CSV] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.buttonExport);  
			})

			test ('Button [EXPORT PVC] - Is Visible', async() =>{
				await pageTarif.buttonExport.hover({timeout:1000});    
				await fonction.isDisplayed(pageTarif.buttonExportPVC);
			})

			test ('Button [EXPORT TARIFICATIONS] - Is Visible', async () =>{
				await pageTarif.buttonExport.hover({timeout:1000});     
				await fonction.isDisplayed(pageTarif.buttonExportTarification);
			})

			test ('Button [HISTORIQUE] - Is Visible', async () =>{     
				await fonction.isDisplayed(pageTarif.buttonHistorique);
			})
	
			test ('DatePicker [EDITION TARIF] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.datePickerEditionTarif);  
			})
		
			test ('ListBox [GROUPE ARTICLE] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.listBoxGroupeArticle);  
			})

			test ('ListBox [GROUPE MAGASINS] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.listBoxGroupeMagasin);  
			})
		
			test ('Toggle Button [SAISIE GROUPEE] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.toogleButtonSaisieGroupee);
			})
		
			test ('Button [COLONNES] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.buttonColonnes);
			})

			test ('InputField [ARTICLE] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputArticle); 
			})  

			test ('InputField [DESIGNATION ARTICLE] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputDesignArticle); 
			})  

			test ('InputField [CA HEBDO] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputCAHebdo); 
			})  

			test ('InputField [NOMBRE MAGASINS LIVRES] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputNbMagLivres); 
			}) 

			test ('InputField [MOYENNE] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputMoyenne); 
			})  

			test ('InputField [PRIX DE REVIENT HT MOYEN PRECEDENT] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputPrixRevHTMoyPrec); 
			})  

			test.skip('InputField [PVC TTC PRECEDENT] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputPVCTTC); 
			})  

			test ('InputField [PVC TTC THEORIQUE] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputPVCTTCTheo); 
			})  

			test ('InputField [MARGE MAGASIN] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputMargeMagasin); 
			})  
			
			test.skip('InputField [PRIX DE CESSION HT] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputPrixCessionHT);
			})
		
			test.skip('InputField [PVC TTC] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputPVCTTC);
			})  
			
			test ('InputField [MARGE PLATEFORME] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.inputMargePlateforme); 
			})

			test ('CheckBox [AFFICHAGE AUTO] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.checkBoxAffichageAuto); 
			})  
		
			test ('CheckBox [TARIFICATION PERMANENTE] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.checkBoxTarificationPerm); 
			}) 

			test ('CheckBox [ALERTES] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.checkBoxAlertes); 
			}) 

			test ('CheckBox [COMPOSITION] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.checkBoxComposition); 
			}) 

			test ('CheckBox [TOUS LES TARIFS] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarif.checkBoxAllTarifs); 
			}) 

			test ('DataGrid [LISTE ARTICLE] - Check', async () => {
				var oDataGrid:TypeListOfElements = {
					element     : pageTarifSimulation.dataGridListeArticles,    
					desc        : 'DataGrid [LISTE ARTICLES]',
					verbose		: false,
					column      :   
						[
							'** skip **',
							'** skip **',
							'** skip **',
							'** skip **',
							'Référence de gamme',
							'Code article',
                            '** skip **',
                            'CA hebdo.',
							'Nb. Mag. Livrés',
							'** skip **',
							'Px rvt HT moy préc',
							'Px rvt HT moy',
							'% Marge Ptf',
							'Prix cession HT',
							'% Marge magasin',
							'PVC TTC préc',
							'PVC TTC théorique',
							'PVC TTC',
							'Par',
							'** skip **',
							'** skip **',
							'** skip **',
							'Permanent',
							'Période',
							'** skip **',
							'Actions'      
						]
				}
				await fonction.dataGridHeaders(oDataGrid);             
			})

			test.describe ('Popin [AJOUT DE TARIFICATION]', async () => {

				test ('Button [FACTURER LES FACTURES DE REGULARISATION] - Click', async () => {
					await fonction.clickAndWait(pageTarif.buttonTarification, page);
				})

				test ('Popin [AJOUT DE TARIFICATION] - Is Visible', async () => {
					await fonction.popinVisible(page, 'AJOUT DE TARIFICATION', true);
				})

				test ('AJOUT DE TARIFICATION - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pPopinAjouttarification); 
				})
				
				test ('Button [ENREGISTRER] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pPbuttonSauvegarder);
				})
				
				test ('Button [ANNULER] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pButtonAnnuler);  
				})
					
				test ('InputField [ARTICLE] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pInputArticle);   
				})                   
					
				test ('Link [PROMOTION] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pLinkPromotion);
				})               
				
				test ('Link [TARIFICATION] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pLinkTarification);
				})
			
				test ('Link [BAISSE TARIFICATION] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pLinkBaisseTarification);
				})
				
				test ('InputField [NOM] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pInputNom);
				})
				
				test ('InputField [PRIX CESSION] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pInputPrixCession);
				})
				
				test ('InputField [PVC] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pInputPVC);
				})
			
				test ('InputField [PVC HORS LOTS] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pInputPVCDetailHorsLots);
				})
				
				test ('InputField [NB OFFERT] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pInputNbOffert);
				})
				
				test ('InputField [NB ACHETE] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pInputNbAchete);
				})
				
				test ('ListBox [TYPE PROMO] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pListBoxTypePromo);
				})
			
				test ('ListBox [NATURE DETAIL] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pListBoxNatureDetail);
				})
				
				test ('DatePicker [FIN PROMO] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pDatePickerFinPromo);
				})
				
				test ('CheckBox [CONDITION TARIFAIRE] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pCheckBoxConditionsTarif);
				})
				
				test ('CheckBox [VENTE DETAIL] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pCheckBoxVenteDetail);
				})
				
				test ('InputField [MAGASIN] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pInputMagasin);
				})
				
				test ('SECTEUR PROSOL', async () => {
					await fonction.checkListBox(pageTarif.pListBoxSecteurProsol);
				})
				
				test ('REGION PROSOL', async () => {
					await fonction.checkListBox(pageTarif.pListBoxRegionProsol);
				})
				
				test ('ListBox [REGION GEOGRAPHIQUE] - Is Visible', async () => {
					await fonction.isDisplayed(pageTarif.pListBoxRegionGeographique); 
				})
			
				test ('REGION GEOGRAPHIQUE#####', async () => {
					await fonction.checkListBox(pageTarif.pListBoxRegionGeographique);
				})
			
				test ('Toggle [SELECTIONNES]', async () => {
					await fonction.isDisplayed(pageTarif.pToggleSelectionnes);
				})
				
				test ('Toggle [NON SELECTIONNES]', async () => {
					await fonction.isDisplayed(pageTarif.pToggleNonSelectionnes);
				})
				
				test ('Toggle [STRATEGIE]', async () => {
					await fonction.nbElementsGreaterThan(pageTarif.pToggleStrategie, 2);
				})
				
				test ('Toggle [PLATEFORME]', async () => {
					await fonction.nbElementsGreaterThan(pageTarif.pTogglePlateforme, 3);
				})
				
				test ('Toggle [GROUPE MAGASIN]', async () => {
					await fonction.nbElementsGreaterThan(pageTarif.pToggleGroupeMagasins, 1);
				})

				test ('DataGrid [LISTE DES MAGASINS] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageTarif.dataGridListeMagasins,    
						desc        : 'DataGrid [LISTE DES MAGASINS]',
						column      :   
							[
								'0',
								'Code',
								'Abréviation',
								'Région géographique',
								'Secteur Prosol',
								'Nouveau',
								'Stratégie',
								'Ouvert le dimanche',             
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				})

				test ('Button [ANNULER] - Click', async() =>{
					await fonction.clickElement(pageTarif.pButtonAnnuler);
				})  

				test ('Popin [AJOUT DE TARIFICATION] - Is Not Visible', async () => {
					await fonction.popinVisible(page, 'AJOUT DE TARIFICATION', false);
				})
			})

			var sNomPopin:string = "CALCUL DES MARGES";
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

				test ('Button [MARGES GLOBALES] - Click', async () => {
					await fonction.clickAndWait(pageTarif.buttonMargesGlobales, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
				})

				test ('Label [ERROR] -  Is Not Visible', async () =>{ 
					await fonction.isErrorDisplayed(false, page)
				})              

				test ('ListBox [ENSEIGNE]', async () => {
					await fonction.isDisplayed(pageTarif.pPcalcMargeListBoxEnseigne);
				})
					
				test ('Switch [INCLURE LES EXTERNES]', async () => {
					await fonction.isDisplayed(pageTarif.pPcalcMargeSwitchLiensExt);
				})    
					
				test ('Button [CALCULER]', async () => {
					await fonction.isDisplayed(pageTarif.pPcalcMargeButtonCalculer);
				})       
			
				test ('Link [FERMER]', async () => {
					await fonction.isDisplayed(pageTarif.pPcalcMargeLinkFermer); 
				})       
				
				test ('InputField [FAMILLE]', async () => {
					await fonction.isDisplayed(pageTarif.pPcalcMargeInputFamille); 
				})       
				
				test ('InputField [SOUS FAMILLE]', async () => {
					await fonction.isDisplayed(pageTarif.pPcalcMargeInputSousFamille); 
				})       
					
				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickElement(pageTarif.pPcalcMargeLinkFermer);
				})                

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin.toUpperCase(), false);
				})

			})  // End describe Popin

			test.describe ('Popin [CONFIRMATION ENVOI DES TARIFICATIONS]', async () => {
				if(isVisibButtonTarifMag){
					test ('Button [TARIFS MAGASINS] - Click', async () => {
						await fonction.clickAndWait(pageTarif.buttonTarifsMagasin, page);
					})
	
					test('Popin [CONFIRMATION ENVOI DES TARIFICATIONS] - Is Visible', async() => {
						await fonction.popinVisible(page, 'CONFIRMATION ENVOI DES TARIFICATIONS', true);
					})
	
					test ('Label [ERROR] -  Is Not Visible', async () => {
						await fonction.isErrorDisplayed(false, page);
					})                         
	
					test ('Button [Is Visible] - Check', async () => {
						await fonction.isDisplayed(pageTarif.pButtonEnvoiPartiel);
						await fonction.isDisplayed(pageTarif.pButtonEnvoiDefinitif);
						await fonction.isDisplayed(pageTarif.pButtonEnvoiAnnuler); 
					})
					
					test ('Button [ANNULER] - Click', async () => {
						await fonction.clickElement(pageTarif.pButtonEnvoiAnnuler);
					})

					test('Popin [CONFIRMATION ENVOI DES TARIFICATIONS] - Is Not Visible', async() => {
						await fonction.popinVisible(page, 'CONFIRMATION ENVOI DES TARIFICATIONS', false);
					})
				}
			})  // End describe Popin

			test.describe ('Popin [HISTORIQUE DES PRIX (HORS PROMOTION)]', async () => {

				test ('Button [HISTORIQUE] - Click', async () => {
					await fonction.clickAndWait(pageTarif.buttonHistorique, page);
				})

				test('Popin [HISTORIQUE DES PRIX (HORS PROMOTION)] - Is Visible', async() => {
					await fonction.popinVisible(page, 'HISTORIQUE DES PRIX (HORS PROMOTION)', true);
				})

				test ('Label [ERROR] -  Is Not Visible', async () =>{
					await fonction.isErrorDisplayed(false, page);
				})                         

				test ('Input [ARTICLE]', async () => {
					await fonction.isDisplayed(pageTarif.pPInputArticle);
				})
				
				test ('DatePicker [DATE DE DEBUT]', async () => {
					await fonction.isDisplayed(pageTarif.pPDatePickerDebut);
				})
				
				test ('DatePicker [DATE DE FIN]', async () => {
					await fonction.isDisplayed(pageTarif.pPDatePickerFin); 
				})
					
				test ('Button [Afficher]', async () => {
					await fonction.isDisplayed(pageTarif.pPButtonAfficher); 
				})

				test ('Button [ANNULER] - Click', async() => {
					await fonction.clickElement(pageTarif.pPlinkFermer);
				})                

				test('Popin [HISTORIQUE DES PRIX (HORS PROMOTION)] - Is Not Visible', async() => {
					await fonction.popinVisible(page, 'HISTORIQUE DES PRIX (HORS PROMOTION)', false);
				})
			})  // End describe Popin
		})	//-- Onglet
	
		test ('ListBox [RAYON] = "Crèmerie"', async () =>{
			await fonction.isDisplayed(menu.listBoxRayon)
			await menu.selectRayonByName("Crèmerie", page);
		})

		test.describe('Onglet [SIMULATION PRIX]', async () => {
	
			test ('Onglet [SIMULATION PRIX] - Click', async () => {
				await menu.clickOnglet(pageName, 'simulationPrix', page);
			})

			test ('Button [ENREGISTRER] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.buttonEnregistrer);  
			})

			test ('Button [EXPORTER] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.buttonExporter);  
			})

			test ('Button [CALCULER LES MARGES] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.buttonCalculerMarges);  
			})

			test ('Button [MODIFIER LES PRIX DE CESSION] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.buttonModifierPrixCession);  
			})

			test ('Button [MODIFIER LES PVC TTC] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.buttonModifierPVCTTC);  
			})

			test ('Button [APPLIQUER LES MODIFICATIONS] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.buttonAppliquerModifications);  
			})

			test ('Button [MODIFIER LES VENTES] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.buttonModifierVentes);  
			})

			test ('Button [AJOUTER UNE LIGNE] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.buttonAjouterLigne);  
			})

			test ('InputField [FOURNISSEUR] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.inputFournisseur);  
			})

			test ('ListBox [ENSEIGNE] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.listBoxEnseigne);  
			})

			test ('CheckBox [AFFICHER UNIQUEMENT LES LIGNES MODIFIEES] - Is Visible', async () => {
				await fonction.isDisplayed(pageTarifSimulation.checkBoxAffUniqLignesModif);  
			})
					
			test ('DataGrid [LISTE ARTICLE] - Check', async () => {
				var oDataGrid:TypeListOfElements = {
					element     : pageTarifSimulation.dataGridListeArticles,    
					desc        : 'DataGrid [LISTE ARTICLES]',
					verbose		: false,
					column      :   
						[
							'',
							'Famille',
							'** skip **',
							'** skip **',
							'Fournisseurs',
							'Prix achat actuel',
							'Nouv. prix achat',
							'Var. prix achat',
							'Prix revient théo.',
							'** skip **',
							'0',
							'** skip **',
							'',
							'',
							'',
							'Prix cession actuel',
							'Marge plateforme actuelle',
							'Nouv. prix cession',
							'Marge plateforme',
							'Var. prix cession',
							'PVC TTC actuel',
							'Marge magasin actuelle',
							'Nouv. PVC TTC',
							'Marge magasin',
							'Var. PVC',
							'Marge magasin €',
							'Nouvelle marge magasin €',
							'Ecart €',
							'Marge globale actuelle',
							'Marge globale',        
						]
				}
				await fonction.dataGridHeaders(oDataGrid);             
			})

		})	//-- Onglet SIMULATION PRIX

	})  //-- End Describe Page

	test.describe ('Page [PLAN PROMO]', async () => {

		var pageName:string = 'planPromo';

		test ('Page [PLAN PROMO] - Click', async () => {
			await menu.click(pageName, page);
		})

		test ('Message [ERREUR] - Is Not Visible', async () => {
			await fonction.isErrorDisplayed(false, page);
		})

		test.describe ('Onglet [PROMOTIONS]', async () => {

			test ('Onglet [PROMOTIONS] - Click', async () => {
				await menu.clickOnglet(pageName, 'promotions', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			})

			test.skip ('Button [YEAR] - Is Visible', async () => {
				await fonction.isDisplayed(pagePlanPromo.buttonYear);
			})

			test ('Input [SEMAINE] - Is Visible', async () => {
				await fonction.isDisplayed(pagePlanPromo.inputFiltreSemaine);
			})

			test ('Button [LEFT] - Is Visible', async () => {
				await fonction.isDisplayed(pagePlanPromo.buttonFiltreAjouterSemaine);
			})

			test ('Button [RIGHT] - Is Visible', async () => {
				await fonction.isDisplayed(pagePlanPromo.buttonFiltreRetirerSemaine);
			})

			test ('DropDown [ENSEIGNE] - Is Visible', async () => {
				await fonction.isDisplayed(pagePlanPromo.dropDownEnseigne);
			})

			test ('Input [MAGASIN] - Is Visible', async () => {
				await fonction.isDisplayed(pagePlanPromo.inputMagasin);
			})

			test ('Button [RECHERCHER] - Is Visible ', async () => {
				await fonction.isDisplayed(pagePlanPromo.buttonRechercher);
			})

			test ('Evênement [CONTAINER] - Is Visible', async () => {
				await fonction.isDisplayed(pagePlanPromo.evenementContainer);
			})

			test('DataGrid [LISTE ARTICLES] - Check', async () => {
				var oDataGrid:TypeListOfElements = {
					element		: pagePlanPromo.dataGridArticles,
					desc		: 'DataGrid [LISTE ARTICLES]',
					verbose		: false,
					column		:
						[
							'** skip **',
							'Rayon',
							'Article1',
							'Fournisseurs',
							'Prix cession',
							'PVC TTC',
							'Nature de l\'offre',
							'Unité',
							'Périmètre',
							'Médias',
							'Date de la promotion',
							'Statut',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			var nomPopin = 'Créer une promotion - Semaine n de yyyy'.toUpperCase();
			test.describe ('Popin [' + nomPopin + ']', async () => {

				test ('Button [CREER UNE PROMOTION] - Click', async () => {
					await fonction.clickAndWait(pagePlanPromo.buttonCreerPromotion, page);
				})

				test ('DropDown [OPERATION] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanPromo.dropDownOperation);  
				})

				test ('Input [NOM DE LA PROMOTION] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanPromo.inputNomPromotion);  
				})

				test ('DropDown [TYPE DE PROMOTION] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanPromo.dropDownTypePromotion);  
				})

				test ('Input [ARTICLE] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanPromo.inputArticle);  
				})	

				test ('DropDown [NATURE DE L\'OFFRE] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanPromo.dropDownNatureOffre);  
				})

				test ('Input [PRIX CESSION] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanPromo.inputPrixCession);  
				})	

				test ('Input [PVC TTC] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanPromo.inputPvcTtc);  
				})	

				test ('Checkbox [PRIX BARRE] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanPromo.checkboxPrixBarre);  
				})

				test ('Checkbox [PROMOTION] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanPromo.checkboxPromotion);
				})

				test ('Input [NOUVEAU PRIX ACHAT] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanPromo.inputNouveauPrixAchat);  
				})	

				test ('Input [NOUVEAU MONTANT TAXES] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanPromo.inputNouveauMontantTaxes);  
				})	

				test ('Input [NOUVEAU PRIX REVIENT] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanPromo.inputNouveauPrixRevient);  
				})	

				test ('Datepicker [DATE D\'APPLICATION DE LA PROMOTION] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanPromo.datePickerPromotion);  
				})

				test ('TextArea [COMMENTAIRE] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanPromo.textAreaCommentaire);  
				})

				test ('Datepicker [PRIX DE CESSION APPLICABLE] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanPromo.datePickerPrixDeCession);  
				})

				test.describe ('Zone [MAGASINS CONCERNES]', async () => {

					test ('DropDown [GROUPE DE MAG.] - Is Visible', async () => {
						await fonction.isDisplayed(pagePlanPromo.dropDownGroupesDeMagasin);  
					})
					
					test ('DropDown [SECTEURS PROSOL] - Is Visible', async () => {
						await fonction.isDisplayed(pagePlanPromo.dropDownSecteursProsol);  
					})

					test ('DropDown [REGIONS PROSOL] - Is Visible', async () => {
						await fonction.isDisplayed(pagePlanPromo.dropDownRegionsProsol);  
					})

					test ('DropDown [ENSEIGNES] - Is Visible', async () => {
						await fonction.isDisplayed(pagePlanPromo.dropDownEnseignes);  
					})

					test ('DropDown [REGIONS GEO] - Is Visible', async () => {
						await fonction.isDisplayed(pagePlanPromo.dropDownRegionGeo);  
					})

					test ('DropDown [HABITUDES ALIM.] - Is Visible', async () => {
						await fonction.isDisplayed(pagePlanPromo.dropDownHabitudesAlim);  
					})

					test ('DropDown [PLATEFORMES] - Is Visible', async () => {
						await fonction.isDisplayed(pagePlanPromo.dropDownPlateformes);  
					})

					test ('Button [SELECTIONNES] - Click', async () => {
						await fonction.isDisplayed(pagePlanPromo.buttonSelectionnes);  
					})

					test ('Button [NON SELECTIONNES] - Click', async () => {
						await fonction.isDisplayed(pagePlanPromo.buttonNonSelectionnes);  
					})

					test('DataGrid [DESIGNATION] - Check', async () => {
						var oDataGrid:TypeListOfElements = {
							element		: pagePlanPromo.dataGridDesignation,
							desc		: 'DataGrid [DESIGNATION]',
							verbose		: false,
							column		:
								[
									'** skip **',
									'Code',
									'Désignation',
									'Ext.',
									'Nouv.',
								]
						}
						await fonction.dataGridHeaders(oDataGrid);
					})

				}) // End describe Zone [MAGASINS CONCERNES]

				test.describe ('Zone [ENGAGEMENT]', async () => {

					test ('Zone [ENGAGEMENT] - Click', async () => {
						await fonction.clickElement(pagePlanPromo.ongletEngagement);
					}) 

					test ('Datepicker [LANCEMENT DE L\'ENGAGEMENT] - Is Visible', async () => {
						await fonction.isDisplayed(pagePlanPromo.datePickerLancementEngagement);  
					})

					test ('Datepicker [PLAGES DE DATE DE REFERENCE] - Is Visible', async () => {
						await fonction.isDisplayed(pagePlanPromo.datePickerPlageDateReference);  
					})

				})

				test ('Button [ENREGISTRER] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanPromo.buttonEnregistrer);
				}) 

				test ('Button [ANNULER] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanPromo.buttonAnnuler);
				}) 			

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pagePlanPromo.buttonFermer);
				})

				test ('Popin [' + nomPopin + '] - Check', async () => {
					await fonction.popinVisible(page, nomPopin, false);  
				}) 				

			})
			
		}) //-- Onglet Promotions

		test.describe ('Onglet [COMMUNICATION]', async () => {

			test ('Onglet [COMMUNICATION] - Click', async () => {
				await menu.clickOnglet(pageName, 'communication', page);
			})

			test ('DatePicker [PERIODE] - Is Visible', async () => {
				await fonction.isDisplayed(pagePlanCom.datePickerPeriode);
			})

			test ('DropDown [ENSEIGNE] - Is Visible', async () => {
				await fonction.isDisplayed(pagePlanCom.dropDownEnseigne);
			})

			test('DataGrid [COMMUNICATION] - Check', async () => {
				var oDataGrid:TypeListOfElements = {
					element		: pagePlanCom.dataGridCom,
					desc		: 'DataGrid [COMMUNICATION]',
					verbose		: false,
					column		:
						[
							'Type',
							'Enseignes',
							'Nom',
							'Date début',
							'Date fin',
							'Médias',
							'Échéance médias',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			test ('Button [DUPPLIQUER L\'OPERATION] - Is Visible', async () => {
				await fonction.isDisplayed(pagePlanCom.buttonDupliquer);
			})

			test ('Button [SUPPRIMER LE TEMPS FORT] - Is Visible', async () => {
				await fonction.isDisplayed(pagePlanCom.buttonSupprimer);
			})

			var nomPopin = 'Créer un temps fort'.toUpperCase();
			test.describe ('Popin [' + nomPopin + ']', async () => {

				test ('Button [CREER UN TEMPS FORT] - Click', async () => {
					await fonction.clickAndWait(pagePlanCom.buttonCreer, page);
				})

				test ('Input [NOM] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanCom.inputNom);  
				})

				test ('DatePicker [DATES] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanCom.datePickerDates);  
				})

				test ('DropDown [ENSEIGNES] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanCom.dropDownEnseigne);  
				})

				test ('Input [COMMENTAIRE] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanCom.inputCommentaire);  
				})

				test ('Button [FRUITS ET LEGUMES] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanCom.buttonFL);  
				})

				test ('Button [POISSONNERIE] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanCom.buttonPoissonnerie);  
				})

				test ('Button [CREMERIE] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanCom.buttonCremerie);  
				})

				test ('Button [EPICERIE] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanCom.buttonEpicerie);  
				})

				test ('Button [BCT] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanCom.buttonBCT);  
				})

				test ('Button [TRAITEUR] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanCom.buttonTraiteur);  
				})

				test ('Button [BOULANGERIE] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanCom.buttonBoulangerie);  
				})

				test('DataGrid [MEDIA] - Check', async () => {
					var oDataGrid:TypeListOfElements = {
						element		: pagePlanCom.dataGridMedia,
						desc		: 'DataGrid [MEDIA]',
						verbose		: false,
						column		:
							[
								'** skip **',
								'Média',
								'Dates de la communication',
								'Date d\'échéance',
								'Commentaire'
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				})

				test ('Button [ENREGISTRER] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanCom.buttonEnregistrer);
				}) 

				test ('Button [ANNULER] - Is Visible', async () => {
					await fonction.isDisplayed(pagePlanCom.buttonAnnuler);
				}) 			

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pagePlanCom.buttonFermer);
				})

				test ('Popin [' + nomPopin + '] - Check', async () => {
					await fonction.popinVisible(page, nomPopin, false);  
				}) 		

			})

		}) //-- Onglet Communication

	})  

	test.describe ('Page [ALIGNEMENTS]', async () => {    
	
		test ('Page [ALIGNEMENTS] - Click', async () => {
			await menu.click('alignements', page);
		})
		
		test ('Label [ERROR] -  Is Not Visible', async () =>{ 
			await fonction.isErrorDisplayed(false, page)
		})  
				 
		test ('Button [ACCORDER]', async () => {
			await fonction.isDisplayed(pageAlignement.buttonAccorder);
		})
		
		test ('DatePicker [ALIGNEMENTS RECUS]', async () => {
			await fonction.isDisplayed(pageAlignement.datePickerAlignementRecus);
		})
		
		test ('InputField [CODE Alignement]', async () => {
			await fonction.isDisplayed(pageAlignement.inputCodeMagasinMagasin);
		})
		
		test ('InputField [MAGASIN Alignement]', async () => {
			await fonction.isDisplayed(pageAlignement.inputCodeArticleMagasin);
		})
	
		test ('InputField [CODE Demandes]', async () => {
			await fonction.isDisplayed(pageAlignement.inputCodeMagasinArticle);
		})
		
		test ('InputField [MAGASIN Demandes]', async () => {
			await fonction.isDisplayed(pageAlignement.inputCodeArticleArticle);
		})
		
		test ('CheckBox [MASQUER MAGASIN SANS ALIGN A TRAITER]', async () => {
			await fonction.isDisplayed(pageAlignement.checkBoxMasquerMagSansAlign);
		})
	
		test ('CheckBox [MASQUER ALIGNEMENTS REPONDUS]', async () => {
			await fonction.isDisplayed(pageAlignement.checkBoxMasquerAlignRepondu);  
		})
		
		test.skip('DataGrid [LISTE MAGASINS] - Check', async () => {
			var dataGrid = await pageAlignement.dataGridListeMagasins.allTextContents();
			for(const header of dataGrid){

				console.log('DataGrid [HEADER] : "' + header + '"');
			}
			var oDataGrid:TypeListOfElements = {
				element     : pageAlignement.dataGridListeMagasins,    
				desc        : 'DataGrid [LISTE MAGASINS]',
				column      :   
					[
						'0',
						'Code',
						'Magasin',
						'Secteur',
						'Région prosol',
						'Nb',
						'Traitées',   
						'Actions',        
					]
			}
			await fonction.dataGridHeaders(oDataGrid);             
		})

		test.skip('DataGrid [LISTE ARTICLES] - Check', async () => {
			var oDataGrid:TypeListOfElements = {
				element     : pageAlignement.dataGridListeArticles,    
				desc        : 'DataGrid [LISTE ARTICLES]',
				column      :   
					[
						'Magasin',
						'Heure',
						'Code',
						'Article',
						'Qualité observée',
						'PvC constaté unité',
						'Concurrent',
						'Vente par',
						'PvC actuel unité',
						'PvC demandé unité',
						'Prix de revient',
						'PvC applicable unité',
						'Réponse',    
						'Actions'   
					]
			}
			await fonction.dataGridHeaders(oDataGrid);            
		})

	})  //-- End Describe Page
	
	test.describe ('Page [GESTION DES MAGASINS]', async () => {    
		
		test ('Page [GESTION DES MAGASINS] - Click', async () => {
			await menu.click('gestion', page);
		})
		
		test ('Label [ERROR] -  Is Not Visible', async () =>{ 
			await fonction.isErrorDisplayed(false, page)
		})                       
											
		test ('Button [CREER GROUPE DE MAGASINS]', async () => {
			await fonction.isDisplayed(pageGestion.buttonCreerGroupeMagasin);
		})
		
		test ('Button [ASSOCIER MAGASIN]', async () => {
			await fonction.isDisplayed(pageGestion.buttonAssocierMagasin);
		}) 
		
		test ('Button [SELECTIONNES] - Is Visible', async () => {
			await fonction.isDisplayed(pageGestion.buttonSelectionnes);
		})

		test ('Button [NON SELECTIONNES] - Is Visible', async () => {
			await fonction.isDisplayed(pageGestion.buttonNonSelectionnes);
		})
	
		test ('DataGrid [LISTE ARTICLES] - Check', async () => {
			var oDataGrid:TypeListOfElements = 
			{
				element     : pageGestion.dataGridListeArticles,    
				desc        : 'DataGrid [LISTE ARTICLES]',
				column      :   
					[
						'Nom du groupe',
						'Nb mag.',
						'Actions',         
					]
			}
			await fonction.dataGridHeaders(oDataGrid); 
		})

		test ('DataGrid [LISTE DES MAGASINS] - Check', async () => {
			var oDataGrid:TypeListOfElements = {
				element     : pageGestion.dataGridListeMagasins,    
				desc        : 'DataGrid [LISTE DES MAGASINS]',
				column      :   
					[
						"",
						"Code",
						"Abréviation",
						"Raison sociale",
						"Nouveau",
						"Externe",
						"Auto.",
						"Région prosol",
						"Secteur prosol",
						"Strategie",
						"Enseigne",
						"Actions",      
					]
			}
			await fonction.dataGridHeaders(oDataGrid); 
		})  

		test.describe ('Popin [CREATION GROUPE DE MAGASIN]', async () => {

			test ('Button [CREER UN GROUPE DE MAGASINS] - Click', async () => {
				await fonction.clickAndWait(pageGestion.buttonCreerGroupeMagasin, page);
			})

			test('Popin [CREATION GROUPE DE MAGASIN] - Is Visible', async() => {
				await fonction.popinVisible(page, 'CREATION GROUPE DE MAGASIN', true);
			})
			
			test ('Label [ERROR] -  Is Not Visible', async () =>{ 
				await fonction.isErrorDisplayed(false, page);
			})                           

			test ('Button [ENREGISTRER]', async () => {
				await fonction.isDisplayed(pageGestion.pButtonGroupeEnregistrer);
			})
					
			test ('Button [ANNULER]', async () => {
				await fonction.isDisplayed(pageGestion.pButtonGroupeAnnuler);
			})         
			
			test ('InputField [NOM]', async () => {
				await fonction.isDisplayed(pageGestion.pInputGroupeNom);
			})
			
			test ('InputField [DESCRIPTION]', async () => {
				await fonction.isDisplayed(pageGestion.pInputGroupeDescription);
			})
			
			test ('InputField [TAUX CALCUL PVC THEO]', async () => {
				await fonction.isDisplayed(pageGestion.pInputGroupeTauxCalculPVC);
			})
			
			test ('InputField [MARGE PLATEFORME]', async () => {
				await fonction.isDisplayed(pageGestion.pInputGroupeMargePlateforme);
			})
			
			test ('InputField [FRAIS LIVRAISON]', async () => {
				await fonction.isDisplayed(pageGestion.pInputGroupeFraisLivraison); 
			})
	
			test ('Button [ANNULER] - Click', async () => {
				await fonction.clickElement(pageGestion.pButtonGroupeAnnuler);
			})                

			test('Popin [CREATION GROUPE DE MAGASIN] - Is Not Visible', async() => {
				await fonction.popinVisible(page, 'CREATION GROUPE DE MAGASIN', false);
			})

		})  // End describe Popin      

	})  //-- End Describe Page

	test.describe ('Page [STRATEGIES ARTICLES]', async () => {    

		test ('Page [STRATEGIES ARTICLES]', async () => {
			await menu.click('strategies', page);
		})

		test ('Label [ERROR] -  Is Not Visible', async () =>{ 
			await fonction.isErrorDisplayed(false, page)
		})                               

		//Check commenté (Dev en cours (Evolution));
		test.skip ('Button [ENREGISTRER]', async () => {
			await fonction.isDisplayed(pageStrategies.buttonEnregistrer);
		})
		
		test ('ListBox [GROUPE ARTICLE]', async () => {
			await fonction.isDisplayed(pageStrategies.listBoxGroupeArticle);
		})
	
		test ('ListBox [GROUPE MAGASIN]', async () => {
			await fonction.isDisplayed(pageStrategies.listBoxGroupeMagasins);
		})
		
		test ('DataGrid [LISTE ARTICLES] - Check', async () => {
			var oDataGrid:TypeListOfElements = {
				element     : pageStrategies.dataGridListeArticles,    
				desc        : 'DataGrid [LISTE ARTICLES]',
				column      :   
					[
						'0',
						'Famille',
       					'Sous-famille',
    				    'Réf. de gamme',
						'Code',
						'Désignation',
						'Vend.',
						'Com.',
						'Nb groupes',
						'Nb magasins',     
					]
			}
			await fonction.dataGridHeaders(oDataGrid);
		})

		test('Tr [GROUPE ARTILCE && MAGASIN][0] - Click', async () => {
			await fonction.clickElement(pageStrategies.dataGridListeArticleMagasin.first());
		})

		test ('DataGrid [LISTE GROUPE MAGASINS] - Check', async () => {
			var oDataGrid:TypeListOfElements = {
				element     : pageStrategies.dataGridListeGroupesMagasins,    
				desc        : 'DataGrid [LISTE GROUPE MAGASIN]',
				column      :   
					[
						'Nom du groupe',
						'Nb magasins',
						'Nb articles pour rayon',      
					]
			}
			await fonction.dataGridHeaders(oDataGrid);
		})
	})  //-- End Describe Page
	
	test.describe ('Page [ADMIN]', async () => {    
		var pageName:string = 'admin';

		test ('Page [ADMIN] - Click', async () => {
			await menu.click(pageName, page);
		})

		test ('Label [ERROR] -  Is Not Visible', async () => { 
			await fonction.isErrorDisplayed(false, page)
		}) 

		test ('Onglet [ADMINISTRATION] - Click', async () => {
			await menu.clickOnglet(pageName, 'administration', page);
		})

		test ('Onglet [COMMUNICATION UTILISATEURS] - Click', async () => {
			await menu.clickOnglet(pageName, 'communicationUtilisateurs', page);
		})

		test ('Onglet [OPERATIONS ADMIN] - Click', async () => {
			await menu.clickOnglet(pageName, 'operationsAdmin', page);
		})

		test ('Onglet [CHANGELOG] - Click', async () => {
			await menu.clickOnglet(pageName, 'changelog', page);
		})

		test.describe("Onglet [PARAMETRAGES]", async() => {

			test ('Onglet [PARAMETRAGES] - Click', async () => {
				await menu.clickOnglet(pageName, 'parametrages', page);                         
			})   
			
			test ('Button [ENREGISTRER]', async () => {
				await fonction.isDisplayed(pageAdminParametrage.buttonEnregistrer);
			})
	
			test ('DataGrid [PARAMETRAGES] - Check', async () => {
				var oDataGrid:TypeListOfElements = {
					element     : pageAdminParametrage.trHeaderParametrages.locator('th'),    
					desc        : 'DataGrid [PARAMETRAGES]',
					column      :   
						[
							'Nom',
							'Description',
							'Valeurs possibles',
							'Valeur'     
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
        })

	})  //-- End Describe Page 

	test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})