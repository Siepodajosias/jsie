/**
 * @author JC CALVIERA
 */

const xRefTest      = "STO_IHM_GLB";
const xDescription  = "STOCK Examen Global IHM";
const xIdTest       =  486;
const xVersion      = '3.20';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'STOCK',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['plateforme', 'langue'],
	fileName    : __filename
}

//------------------------------------------------------------------------------------

import {test, type Page, expect }           from '@playwright/test';

import {Help}                               from '@helpers/helpers';
import {TestFunctions}                      from '@helpers/functions';
import { Log }              				from '@helpers/log';

import { CartoucheInfo, TypeListOfElements }from '@commun/types';

//-- PageObject ----------------------------------------------------------------------

import {MenuStock}                          from '@pom/STO/menu.page'; 

import {ReceptionAttendue}                  from '@pom/STO/reception-attendue.page';
import {ReceptionEnCours}                   from '@pom/STO/reception-en_cours.page'; 
import {ReceptionTermine}                   from '@pom/STO/reception-terminee.page';         
import {ReceptionAgreer}                    from '@pom/STO/reception-agreer.page';    
import {ReceptionRefus}                     from '@pom/STO/reception-refus.page';    

import {ExpeditionPrevue}                   from '@pom/STO/expedition-prevue.page';        
import {ExpeditionEnCours}                  from '@pom/STO/expedition-en_cours.page';        
import {ExpeditionTermine}                  from '@pom/STO/expedition-terminee.page';  

import {StockEmplacements}                  from '@pom/STO/stock-emplacements.page'; 
import {StockMouvements}                    from '@pom/STO/stock-mouvements.page'; 
import {StockStock}                         from '@pom/STO/stock-stock.page';  
import {StockSituation}                     from '@pom/STO/stock-situation-palettes.page';   
import {StockDons}                          from '@pom/STO/stock-dons.page'; 
import {StockAlertesBlocages}               from '@pom/STO/stock-alertes_blocages.page';              
import {StockRefus}                         from '@pom/STO/stock-refus.page';     

import {InventaireInventaire}               from '@pom/STO/inventaire-inventaire.page'; 
import {InventaireEcarts}                   from '@pom/STO/inventaire-ecarts.page'; 

import {ReapproSupervision}                 from '@pom/STO/reappro-supervision.page'; 
import {ReapproAFaire}                      from '@pom/STO/reappro-a_faire.page'; 
import {ReapproEnCours}                     from '@pom/STO/reappro-en_cours.page'; 
import {ReapproTermne}                      from '@pom/STO/reappro-termine.page'; 
import {ReapproAnnule}                      from '@pom/STO/reappro-annule.page'; 

import {EmballageRestitution}               from '@pom/STO/emballage-restitution.page';
import {EmballageMouvementsEmballages}      from '@pom/STO/emballage-mouvements_emballages.page';    
import {EmballageReferentiel}               from '@pom/STO/emballage-referentiel.page';      

import {ReferentielArticles}                from '@pom/STO/referentiel-articles.page';      
import {ReferentielParametres}              from '@pom/STO/referentiel-parametres.page'; 
import {ReferentielEmplacements}            from '@pom/STO/referentiel-emplacements.page';  
import {ReferentielPlanPlateForme}          from '@pom/STO/referentiel-plan_plateforme.page';          
import {ReferentielParametrageRefusAgreage} from '@pom/STO/referentiel-parametrage_refus_agreage.page';          
import {ReferentielDimensionColisAValider}  from '@pom/STO/referentiel-dimension_colis_a_valider.page'; 
import {ReferentielRangement}               from '@pom/STO/referentiel-rangement.page'; 
import {AdminCategorieEmplacement}          from '@pom/STO/admin-categorie_emplacement.page'

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuStock;

let pageAtt             : ReceptionAttendue;
let pageCours           : ReceptionEnCours;
let pageAgreer          : ReceptionAgreer;
let pageTermine         : ReceptionTermine;
let pageRefus           : ReceptionRefus;

let pageExpPrev         : ExpeditionPrevue;
let pageExpEnCours      : ExpeditionEnCours;
let pageExpTermine      : ExpeditionTermine;

let pageStockEmplac     : StockEmplacements;
let pageStockMouv       : StockMouvements;
let pageStockStock      : StockStock;
let pageStockSitu       : StockSituation;
let pageStockDons       : StockDons;
let pageStockBlocage    : StockAlertesBlocages;
let pageStockRefus      : StockRefus;

let pageInventInv       : InventaireInventaire;
let pageInventEcart     : InventaireEcarts;

let pageReaprSuperv     : ReapproSupervision;
let pageReaprAFaire     : ReapproAFaire;
let pageReaprEnCours    : ReapproEnCours;
let pageReaprTermine    : ReapproTermne;
let pageReaprAnnule     : ReapproAnnule;

let pageStockRest       : EmballageRestitution;
let pageStockMvtEmb     : EmballageMouvementsEmballages;
let pageStockEmb        : EmballageReferentiel;

let pageRefArticle      : ReferentielArticles;
let pageRefParamImp     : ReferentielParametres;
let pageRefEmpla        : ReferentielEmplacements;
let pageRefPlan         : ReferentielPlanPlateForme;
let pageRefRefus        : ReferentielParametrageRefusAgreage;
let pageRefDimension    : ReferentielDimensionColisAValider;
let pageRefRangement    : ReferentielRangement;
let pageAdminCategorie  : AdminCategorieEmplacement;

var log             	= new Log();
var fonction        	= new TestFunctions(log);

// Variables -------------------------------------------------------------------------

const idPlateforme:string= fonction.getInitParam('plateforme','Chaponnay');
const sLangue:string	= fonction.getInitParam('langue', 'fr');

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {

	page               = await browser.newPage();
	menu               = new MenuStock(page, fonction);
	pageAtt            = new ReceptionAttendue(page);
	pageCours          = new ReceptionEnCours(page);    
	pageTermine        = new ReceptionTermine(page);    
	pageAgreer         = new ReceptionAgreer(page);    
	pageRefus          = new ReceptionRefus(page);  

	pageExpPrev        = new ExpeditionPrevue(page);      
	pageExpEnCours     = new ExpeditionEnCours(page);      
	pageExpTermine     = new ExpeditionTermine(page);       

	pageStockEmplac    = new StockEmplacements(page);
	pageStockMouv      = new StockMouvements(page); 
	pageStockStock     = new StockStock(page); 
	pageStockSitu      = new StockSituation(page);   
	pageStockDons      = new StockDons(page);   
	pageStockBlocage   = new StockAlertesBlocages(page);                 
	pageStockRefus     = new StockRefus(page);                 

	pageInventInv      = new InventaireInventaire(page);
	pageInventEcart    = new InventaireEcarts(page); 

	pageReaprSuperv    = new ReapproSupervision(page); 
	pageReaprAFaire    = new ReapproAFaire(page); 
	pageReaprEnCours   = new ReapproEnCours(page); 
	pageReaprTermine   = new ReapproTermne(page); 
	pageReaprAnnule    = new ReapproAnnule(page); 

	pageStockRest      = new EmballageRestitution(page);
	pageStockEmb       = new EmballageReferentiel(page);
	pageStockMvtEmb    = new EmballageMouvementsEmballages(page);

	pageRefArticle     = new ReferentielArticles(page);       
	pageRefParamImp    = new ReferentielParametres(page); 
	pageRefEmpla       = new ReferentielEmplacements(page);   
	pageRefPlan        = new ReferentielPlanPlateForme(page);       
	pageRefRefus       = new ReferentielParametrageRefusAgreage(page);       
	pageRefDimension   = new ReferentielDimensionColisAValider(page);
	pageRefRangement   = new ReferentielRangement(page);
	pageAdminCategorie = new AdminCategorieEmplacement(page);
	const helper       = new Help(info, testInfo, page);
	await helper.init();

})

//------------------------------------------------------------------------------------

test.beforeEach(async ({}, testInfo) => {
	await fonction.trace(testInfo);
	await fonction.checkConsole(page, testInfo, false);
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})
  
//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', async () => {

	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test ('Connexion', async () => {
		await fonction.connexion(page);
		if (sLangue !== 'fr') {
			await menu.selectLang(sLangue, page);
			fonction.setCheckTraductions(true);
		}
	})

	test.describe ('Page [RECEPTION]', async () => {  

		var buttonScinderClickable      = false;
		var buttonModifierClickable     = false;
		var buttonReceptionnerClickable = false;            
		var buttonSupprimerClickable    = false;     

		var sNomPage = 'reception';

		test ('Page [RECEPTION] - Click', async () => {
			await menu.click(sNomPage, page);
		}) 

		test ('ListBox [PLATEFORME] = "' + idPlateforme + '"', async () => {
			await menu.selectPlateformeByValue(page, idPlateforme);                       	// Sélection d'une plateforme par défaut
		})

		test ('Error Message - Is Hidden', async () => {
			await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
		}) 

		test.describe ('Onglet [LIVRAISONS ATTENDUES] ', async () => {

			//-- Boutons Footer
			test ('Button [Is visible] - Check', async () => {
				await fonction.isDisplayed(pageAtt.buttonScinder);
				await fonction.isDisplayed(pageAtt.buttonModifier);
				await fonction.isDisplayed(pageAtt.buttonReceptionner);
				await fonction.isDisplayed(pageAtt.buttonSupprimer);
				await fonction.isDisplayed(pageAtt.buttonDetail);
				await fonction.isDisplayed(pageAtt.buttonImprimerBord);
				await fonction.isDisplayed(pageAtt.buttonVisualiserBord); 
			}) 

			test ('ListBox, checkBox and input [Is visible] - Check', async () => {
				await fonction.isDisplayed(pageAtt.listBoxRoutage);
				await fonction.isDisplayed(pageAtt.checkBoxNumBL);
				await fonction.isDisplayed(pageAtt.checkBoxTransporteur);
				await fonction.isDisplayed(pageAtt.checkBoxNumeroAchat);
				await fonction.isDisplayed(pageAtt.checkBoxFournisseur);
				await fonction.isDisplayed(pageAtt.checkBoxAffToutesLivr);     
				await fonction.isDisplayed(pageAtt.inputNumeroBL);     
			})
	
			test ('DataGrid [LIVRAISONS ATTENDUES] [Is visible] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAtt.dataGridLivraisons,    
					desc        : 'DataGrid [LIVRAISONS ATTENDUES]',
					verbose     : false,
					column      :   
						[
							'0',
							'Date d\'arrivée prévue',
							'Heure livraison min.',
							'Heure livraison max.',
							'Numéro de BL',
							'Transporteur',
							'N° achat',
							'Routage',
							'Familles articles',
							'Palettes',
							'Préparation prévue le',
							'Fournisseurs',
							'Acheteur',
							'Confirmée',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			test ('CheckBox [*FIRST ELEMENT*] - Click', async () => {

				await fonction.clickElement(pageAtt.checkBoxLivraisonsAtt.nth(0).locator('input'));
	
				buttonScinderClickable 		= await pageAtt.buttonScinder.isEnabled();               
				buttonModifierClickable 	= await pageAtt.buttonModifier.isEnabled();               
				buttonReceptionnerClickable = await pageAtt.buttonReceptionner.isEnabled();               
				buttonSupprimerClickable 	= await pageAtt.buttonSupprimer.isEnabled();               
				
			})  

		})

		test.describe ('Popin [SCINDER UNE RECEPTION]', async () => {

			if (buttonScinderClickable) {                                       			// Si le bouton Scinder est clickable, on se fait plaisir...

				test ('Button [SCINDER] - Click', async () => {
					await fonction.clickAndWait(pageAtt.buttonScinder, page);
				}) 

				test ('Error Message - Is Hidden', async () => {
					await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
				}) 

				test ('Button and input [Is visible] - Check', async () => {
					await fonction.popinVisible(page, 'SCINDER UNE RECEPTION', true);
		
					await fonction.isDisplayed(pageAtt.pButtonScinderSauvegarder);              
					await fonction.isDisplayed(pageAtt.pButtonScinderAnnuler);
					await fonction.isDisplayed(pageAtt.pInputScinderBL1);
					await fonction.isDisplayed(pageAtt.pInputScinderBL2);
				}) 

				test ('DataGrid [LISTE LOTS] [Is visible] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageAtt.pDataGridScinder,    
						desc        : 'DataGrid [LISTE LOTS]',
						verbose     : false,
						column      :   
							[
								'Numéro Lot',
								'Code article',
								'Désignation article',
								'Palettes initiales',
								'Quantité initiale',
								'Quantité BL 1',
								'Quantité BL 2',
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				}) 

				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickElement(pageAtt.pButtonScinderAnnuler);
				})  

			} else {                        
				log.set('[INFO] : Lot Non Scindable');
			}
			
			test ('Popin [SCINDER UNE RECEPTION] - Check', async () => {
				await fonction.popinVisible(page,'SCINDER UNE RECEPTION', false);
			})  

		})     
		
		test.describe ('Popin [MODIFICATION D\'UNE RECEPTION]', async () => {

			if (buttonModifierClickable) {                                       			// Si le bouton "Modifier" est clickable, on se fait plaisir...

				test ('Button [MODIFIER] - Click', async () => {
					await fonction.clickAndWait(pageAtt.buttonModifier, page);
				}) 
	
				test ('Error Message - Is Hidden', async () => {
					await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
				}) 

				test ('Button and input [MODIFIER] - Click', async () => {
					await fonction.popinVisible(page,'MODIFICATION D\'UNE RECEPTION', true);
	
					await fonction.isDisplayed(pageAtt.pButtonModifSauvegarder);              
					await fonction.isDisplayed(pageAtt.pButtonModifAnnuler);
					await fonction.isDisplayed(pageAtt.pInputModifReferenceBL);
				}) 

				test ('DataGrid [LISTE LOTS][Is visible] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageAtt.pDataGridModifier,    
						desc        : 'DataGrid [LISTE LOTS]',
						verbose     : false,
						column      :   
							[
								'Numéro Lot',
								'Code article',
								'Désignation article',
								'Quantité',
								'Colisage',
								'Colisage palette gerbée',
								'Couleur Emballage',
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				})               
	
				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickElement(pageAtt.pButtonModifAnnuler);
				})                

			} else {                        
				log.set('[INFO] : Lot Non Modifiable');
			}

			test ('Popin [MODIFICATION D\'UNE RECEPTION] - Check', async () => {
				await fonction.popinVisible(page, 'MODIFICATION D\'UNE RECEPTION', false);
			})  

		})        
		
		test.describe ('Popin [RECEPTION (ATTENDUE)]', async () => {

			if (buttonReceptionnerClickable) {                                       		// Si le bouton "Réceptionner" est clickable, on se fait plaisir...

				test ('Button [RECEPTIONNER] - Click', async () => {
					await fonction.clickAndWait(pageAtt.buttonReceptionner, page);
				}) 
	
				test ('Error Message - Is Hidden', async () => {
					await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
				}) 

				test ('Button, input, listBox, textArea and checkBox [Is visible] - Check', async () => {
					await fonction.popinVisible(page, 'RECEPTION (ATTENDU)', true);

		
					await fonction.isDisplayed(pageAtt.pButtonRecepSauvegarder);
					await fonction.isDisplayed(pageAtt.pButtonRecepSauvImprimer);
					await fonction.isDisplayed(pageAtt.pButtonRecepTerminer);                                              
					await fonction.isDisplayed(pageAtt.pButtonRecepAnnuler);
					await fonction.isDisplayed(pageAtt.pButtonRecepAjouter);
					await fonction.isDisplayed(pageAtt.pButtonRecepAppliquer);
					await fonction.isDisplayed(pageAtt.pInputRecepHeureArrivee);
					await fonction.isDisplayed(pageAtt.pInputRecepMinuteArrivee);
					await fonction.isDisplayed(pageAtt.pInputRecepHeureUnload);
					await fonction.isDisplayed(pageAtt.pInputRecepMinuteUnload);                
					await fonction.isDisplayed(pageAtt.pInputRecepReferenceBL);
					await fonction.isDisplayed(pageAtt.pInputRecepTptRear);
					await fonction.isDisplayed(pageAtt.pInputRecepTptMiddle);
					await fonction.isDisplayed(pageAtt.pInputRecepTptBack);
					await fonction.isDisplayed(pageAtt.pInputRecepNbRecus);
					await fonction.isDisplayed(pageAtt.pInputRecepDlcGlobal);
					await fonction.isDisplayed(pageAtt.pInputRecepLotFourn);
					await fonction.isDisplayed(pageAtt.pInputRecepEmplacement);                
					await fonction.isDisplayed(pageAtt.pListBoxRecepReceptionnaire1);
					await fonction.isDisplayed(pageAtt.pListBoxRecepQuai);
					await fonction.isDisplayed(pageAtt.pListBoxRecepTransporteur);
					await fonction.isDisplayed(pageAtt.pTextAreaRecepCommentaire);
					await fonction.isDisplayed(pageAtt.pCheckBoxRecepConforme);
					await fonction.isDisplayed(pageAtt.pCheckBoxRecepNonConforme);
				}) 

				test ('DataGrid [LISTE LOTS] [Is visible] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageAtt.pDataGridRecepLots,    
						desc        : 'DataGrid [LISTE LOTS]',
						verbose     : false,
						column      :   
							[
								'0',
								'Lot',
								'Code article',
								'Désignation article',
								'Calibre',
								'Fournisseur',
								'Colis Att.',
								'Palettes Att.',
								'Colis Reçus',
								'Palettes Reçues',
								'Poids (Kilos)',
								'',
								'',
								'',
								'',
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				}) 

				test ('DataGrid [LISTE PALETTES] [Is visible] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageAtt.pDataGridRecepPalettes,    
						desc        : 'DataGrid [LISTE PALETTES]',
						verbose     : false,
						column      :   
							[
								'Palette',
								'Code article',
								'Colisage',
								'Colis',
								'DLC',
								'Lot fournisseur',
								'Poids net (Kilos)',
								'Emplacement',
								'',
								'Attendus',
								'Reçus',
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				})

				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickElement(pageAtt.pButtonRecepAnnuler);
				})                

			} else {                        
				log.set('[INFO] : Lot Non Réceptionnable');
			}

			test ('Popin [RECEPTION (ATTENDU)] - Check', async () => {
				await fonction.popinVisible(page,'RECEPTION (ATTENDU)', false);
			}) 

		})             

		test.describe ('Popin [SUPPRIMER LA RECEPTION]', async () => {

			if (buttonSupprimerClickable) {                                       			// Si le bouton "Supprimer" est clickable, on se fait plaisir...

				test ('Button [SUPPRIMER] - Click', async () => {
					await fonction.clickAndWait(pageAtt.buttonSupprimer, page);
				}) 
	
				test ('Error Message - Is Hidden', async () => {
					await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
				}) 

				test ('Button [Is - visble] - Check', async () => {
					await fonction.popinVisible(page, 'SUPPRIMER LA RECEPTION', true);
		
					await fonction.isDisplayed(pageAtt.pButtonSupprConfirmer);              
					await fonction.isDisplayed(pageAtt.pButtonSupprAnnuler); 
				}) 
	
				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickElement(pageAtt.pButtonSupprAnnuler);
				})                

			} else {                        
				log.set('[INFO] : Lot Non Supprimable');
			}

			test ('Popin [SUPPRIMER LA RECEPTION] - Check', async () => {
				await fonction.popinVisible(page, 'SUPPRIMER LA RECEPTION', false);
			})     

		}) 
				
		test.describe ('Onglet [RECEPTIONS EN COURS]', async () => {
			
			test ('Onglet [RECEPTIONS EN COURS] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'receptionsEnCours', page);
			})   

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Button [Is - visble] - Check', async () => {

				await fonction.isDisplayed(pageCours.checkBoxNumBL);
				await fonction.isDisplayed(pageCours.checkBoxFournisseur);
				await fonction.isDisplayed(pageCours.inputNumeroBL);

				await fonction.isDisplayed(pageCours.buttonCompleter);
				await fonction.isDisplayed(pageCours.buttonTerminer);
				await fonction.isDisplayed(pageCours.buttonReceptionnerScan);
				await fonction.isDisplayed(pageCours.buttonImprimerEtiq); 
			})

			test ('DataGrid [LISTE RECEPTIONS EN COURS] [Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageCours.dataGridReceptions,    
					desc        : 'DataGrid [LISTE RECEPTIONS EN COURS]',
					verbose     : false,
					column      :   
						[
							'0',
							'Heure d\'arrivée',
							'Numéro de BL',
							'Routage',
							'Familles articles',
							'Fournisseurs',
							'Acheteur',
							'Réceptionnaire(s)',
							'Quai',
							'Nombre palettes',
							'Avancement',
							'Mode de réception',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			}) 

		})

		test.describe ('Onglet [RECEPTIONS TERMINEES]', async () => {
			
			test ('Onglet [RECEPTIONS TERMINEES] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'ReceptionsTerminees', page);
			})   

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Button and datePicker [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageTermine.checkBoxNumBL);
				await fonction.isDisplayed(pageTermine.checkBoxNumeroAchat);
				await fonction.isDisplayed(pageTermine.checkBoxFournisseur);
				await fonction.isDisplayed(pageTermine.inputNumeroBL);
				await fonction.isDisplayed(pageTermine.buttonVoirRecpTerm);
				await fonction.isDisplayed(pageTermine.buttonDeclarerNewRecp);
				await fonction.isDisplayed(pageTermine.buttonImprimerEtiq);
				await fonction.isDisplayed(pageTermine.datePickerReception);
			})   
			
			test ('DataGrid [LISTE RECEPTIONS TERMINEES] (Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageTermine.dataGridReceptions,    
					desc        : 'DataGrid [LISTE RECEPTIONS TERMINEES]',
					verbose     : false,
					column      :   
						[
							'0',
							'Début',
							'Fin',
							'Numéro de BL',
							'N° achat',
							'Routage',
							'Familles articles',
							'Fournisseurs',
							'Acheteurs',
							'Réceptionnaire(s)',
							'Nombre palettes',
							'Nombre colis',
							'Nombre articles',
							'Emplacements palettes',
							'Réception achat',
							'Mode de réception',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})  

		})

		test.describe ('Onglet [LOTS A AGREER]', async () => {
			
			test ('Onglet [LOTS A AGREER] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'LotsAAgreer', page);
			})   

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Button, input and listBox [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageAgreer.buttonAgreer);
				await fonction.isDisplayed(pageAgreer.buttonAgreerTousLesLots);
				await fonction.isDisplayed(pageAgreer.buttonImprimer);
				await fonction.isDisplayed(pageAgreer.inputFiltreAcheteur);
				await fonction.isDisplayed(pageAgreer.listBoxFournisseurs);
			}) 
					
			test ('DataGrid [LISTE RECEPTIONS A AGREER] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAgreer.dataGridReceptions,    
					desc        : 'DataGrid [LISTE RECEPTIONS A AGREER]',
					verbose     : false,
					column      :   
						[
							'0',
							'Date de réception',
							'Plateforme de distribution',
							'Numéro',
							'Fournisseur',
							'Code article',
							'Article',
							'Numéro d\'achat',
							'Colis attendus',
							'Colis reçus',
							'Réserve à la réception',
							'Emplacements palettes',
							'Agréage',
							'Agréé par',
							'Acheteur',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

		})  

	})  //-- End Page

	test.describe ('Page [EXPEDITION]', async () => {    

		var sNomPage = 'expedition';

		test ('Page [EXPEDITION] - Check', async () => {
			await menu.click(sNomPage, page);
		})

		test.describe ('Onglet [PALETTES A EXPEDIER]', async () => {  

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Button, listBox, input and checkBox [Is - visble] - Check', async () => {	
				await fonction.isDisplayed(pageExpPrev.buttonImprimerBordereau);           
				await fonction.isDisplayed(pageExpPrev.buttonExpedier);
				await fonction.isDisplayed(pageExpPrev.buttonNlleExpedition);
				await fonction.isDisplayed(pageExpPrev.buttonDetailPalette);
				await fonction.isDisplayed(pageExpPrev.listBoxPlateforme);
				await fonction.isDisplayed(pageExpPrev.inputFiltreArticle);
				await fonction.isDisplayed(pageExpPrev.checkBoxFiltreArticle);
				await fonction.isDisplayed(pageExpPrev.checkBoxFiltreFournisseur);
				await fonction.isDisplayed(pageExpPrev.checkBoxFiltreExpeFutures);
				await fonction.isDisplayed(pageExpPrev.checkBoxFiltreExpeVides);  
			})

			test ('DataGrid [EXPEDITIONS PREVUES] [Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageExpPrev.dataGridExpePrevues,    
					desc        : 'DataGrid [EXPEDITIONS PREVUES]',
					verbose     : false,
					column      :   
						[
							'0',
							'Date de réception',
							'Journée d\'expédition',
							'N° lot',
							'Code article',
							'Désignation article',
							'Fournisseur',
							'Magasin',
							'Plateforme de distribution',
							'Palettes à expédier',
							'Poids à expédier (tonnes)',
							'Palettes attendues',
							'Palettes agréées',
							'Emplacements palettes',
							'',
							'Actions',                  
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})            

		})

		test.describe ('Onglet [EXPEDITIONS EN COURS]', async () => {        

			test ('Onglet [EXPEDITIONS EN COURS] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'expeditionsEnCours', page);
			})   

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Button [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageExpEnCours.buttonImprimerPlan);
				await fonction.isDisplayed(pageExpEnCours.buttonVisualiserPlan);
				await fonction.isDisplayed(pageExpEnCours.buttonimprimerBL);
				await fonction.isDisplayed(pageExpEnCours.buttonVisualiserBL);
				await fonction.isDisplayed(pageExpEnCours.buttonModifier);
				await fonction.isDisplayed(pageExpEnCours.buttonAbandonner);
				await fonction.isDisplayed(pageExpEnCours.buttonTerminer);
			})

			test ('DataGrid [EXPEDITIONS EN COURS][Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageExpEnCours.dataGridExpeCours,    
					desc        : 'DataGrid [EXPEDITIONS EN COURS]',
					verbose     : false,
					column      :   
						[
							'0',
							'Numéro d\'expédition',
							'Début chargement',
							'Transporteur',
							'Quai',
							'Plateforme de distribution',
							'Heure de départ',
							'Nombre de palettes',
							'Palettes agréées',
							'Chargeur(s)',
							'Statut',
							'Actions'                 
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
	
		})

		test.describe ('Onglet [EXPEDITIONS TERMINEES]', async () => {        
			 
			test ('Onglet [EXPEDITIONS TERMINEES] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'expeditionsTerminees',page);
			})   

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('** Wait Until Spinner [4] Off **', async () => {
				await fonction.isDisplayed(pageExpTermine.buttonImrpimerBL);
				await fonction.isDisplayed(pageExpTermine.buttonVisualiserBL);
				await fonction.isDisplayed(pageExpTermine.buttonConsulterDetail);
			})

			test ('DataGrid [EXPEDITIONS TERMINEES][1][Is - visble] - Check', async () => {
				 var oDataGrid:TypeListOfElements = 
				 {
					 element     : pageExpTermine.dataGridExpeTermine,    
					 desc        : '[1]',
					 verbose     : false,
					 column      :   
						  [
							  '0',
							  'Numéro d\'expédition',
							  'Transporteur',
							  'Numéro de BL',
							  'Plateforme de distribution',
							  'Date et heure de départ',
							  'Nombre de palettes',
							  'Chargeur(s)',
							  'Chauffeur',
							  'Téléphone chauffeur',
							  'Actions'               
						  ]
				 }
				 await fonction.dataGridHeaders(oDataGrid);
			}) 
			
			test ('*** Sélection Premier jour mois précédent ***', async () => {
				// On augmente la période pour être certain d'avoir des données
				await fonction.clickElement(pageExpTermine.datePickerJourneeExpedition);       // Affichage du Calendrier
				await fonction.clickElement(pageExpTermine.datePickerLinkPrev);                // Déplacement sur le mois précédent
				await fonction.clickElement(pageExpTermine.datePickerFirstDay);                // Click sur le premier jour du mois
			})  

		})

	})  //-- End Page

	test.describe ('Page [STOCK]', async () => {    

		var pageName = 'stock';

		test ('Page [STOCK] - Check', async () => {
			await menu.click(pageName, page);
		})

		test.describe ('Onglet [SITUATION DE STOCK]', async () => {        
			 
			test ('Onglet [SITUATION DE STOCK] - Click', async () => {
				await menu.clickOnglet(pageName, 'stock', page);
			})   

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Onglet [SITUATION DE STOCK] - Check', async () => {
				await fonction.isDisplayed(pageStockStock.buttonAfficherMvt);
				await fonction.isDisplayed(pageStockStock.buttonModifierStock);
				await fonction.isDisplayed(pageStockStock.buttonRefuser);
				await fonction.isDisplayed(pageStockStock.buttonImprimerEtiquette);
				await fonction.isDisplayed(pageStockStock.buttonModifPlateformeDistri);
				await fonction.isDisplayed(pageStockStock.inputArticle);
				await fonction.isDisplayed(pageStockStock.inputEmplacement);
				await fonction.isDisplayed(pageStockStock.inputFournisseur);
				await fonction.isDisplayed(pageStockStock.inputNumPalette);
				await fonction.isDisplayed(pageStockStock.inputNumLotFournisseur);
				await fonction.isDisplayed(pageStockStock.inputNumLot);
				await fonction.isDisplayed(pageStockStock.datePickerDLC);
			}) 

			test ('DataGrid [STOCK] [Is - visble] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageStockStock.dataGridStock,    
						desc        : 'DataGrid [STOCK]',
						verbose     : false,
						column      :   
							[
								'0',
								'N° lot',
								'Date de réception',
								'Fournisseur',
								'Code article',
								'Désignation article',
								'Conditionnement',
								'Colis en stock',
								'Palettes en stock',
								'Zones',
								'Allées',
								'Emplacements palettes',
								'DLC',
								'Plateforme de distribution',
								'Actions',                     
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				}) 

			test ('ListBox [PLATEFORME] = "Cremlog"', async () => {
				await menu.selectPlateformeByValue(page, 'Cremlog');                       // Sélection d'une plateforme par défaut
			})

			test ('ListBox [RAYON] = "Poissonnerie"', async () => {
				await fonction.clickElement(pageStockStock.multiSelectRayon);
				await fonction.clickElement(pageStockStock.multiSelectRayon.locator('li span:text-is("Poissonnerie")'));
			})

			test ('Button [RECHERCHER] - Click', async () => {
				await fonction.clickAndWait(pageStockStock.buttonRechercher, page);
			})
			
			test ('** Wait Until Spinner Off **', async () => {
                var iDelaiTest = 300000;
                test.setTimeout(iDelaiTest);
                await pageStockStock.spinnerOn.waitFor({state:'detached',timeout:iDelaiTest});
            })

			test ('CheckBox [LOTS][0] - Click', async () => {
				await fonction.clickElement(pageStockStock.checkBoxListeLots.first());
			}) 

			test.describe ('Popin [HISTORIQUE DES MOUVEMENTS DU XXX]', async () => {

				test ('Button [AFFICHER LES MOUVEMENTS] - Click', async () => {
					await fonction.clickAndWait(pageStockStock.buttonAfficherMvt, page);
				}) 
	 
				test ('Error Message - Is Hidden', async () => {
					await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
				}) 

				test ('Popin [HISTORIQUE DES MOUVEMENTS DU XXX] - Is Visible', async () => {
					await fonction.popinVisible(page, 'HISTORIQUE DES MOUVEMENTS DU XXX', true);
				})

				test ('Button [FERMER] - Is Visble', async () => {
					await fonction.isDisplayed(pageStockStock.pButtonFermer);
				})

				test ('DataGrid [LISTE DES LOTS] [Is - visble] - Check', async () => {                       
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageStockStock.pDataGridHistoriqueMvt,    
						desc        : 'DataGrid [LISTE DES LOTS]',
						verbose     : false,
						column      :   
							[
								'Date',
								'Type mouvement',
								'Mouvement',
								'Quantité',
								'Plateforme',
								'Palettes',
								'Auteurs',
								'Commentaires'
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				})

				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickElement(pageStockStock.pButtonFermer);
				})                
	 
				test ('Popin [HISTORIQUE DES MOUVEMENTS DU XXX]', async () => {
					await fonction.popinVisible(page, 'HISTORIQUE DES MOUVEMENTS DU XXX', false);
				}) 
	 
			})   

			test.describe ('Popin [SAISIE DU STOCK]', async () => {

				test ('Button [MODIFIER LE STOCK] - Click', async () => {
					await fonction.clickAndWait(pageStockStock.buttonModifierStock, page);
				}) 
	 
				test ('Error Message - Is Hidden', async () => {
					await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
				}) 

				test ('Button, listBox, checkBox, textArea and input [Is - visble] - Check', async () => {
					await fonction.popinVisible(page, 'SAISIE DU STOCK', true);
				
					await fonction.isDisplayed(pageStockStock.pButtonSaisieSauvegarder);
					await fonction.isDisplayed(pageStockStock.pButtonSaisieAnnuler);
					await fonction.isDisplayed(pageStockStock.pInputSaisieEmplacement);
					await fonction.isDisplayed(pageStockStock.pCheckBoxEnvoiDirect);
					await fonction.isDisplayed(pageStockStock.pListBoxTypeTiers);
					await fonction.isDisplayed(pageStockStock.pListBoxTiers);
					await fonction.isDisplayed(pageStockStock.pListBoxMotif);
					await fonction.isDisplayed(pageStockStock.pButtonSaisieAnnuler);
					await fonction.isDisplayed(pageStockStock.pTextAreaSaisieCommentaire);
				}) 

				test ('DataGrid [ETAT DU STOCK] [Is - visble] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageStockStock.pDataGridEtatStock,    
						desc        : 'DataGrid [ETAT DU STOCK]',
						verbose     : false,
						column      :   
							[
								'',
								'Palette',
								'Colis comptés',
								'Emplacement',
								'DLC',
								'Lot fournisseur',
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				}) 

				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickElement(pageStockStock.pButtonSaisieAnnuler);
				})                
	 
				test ('Popin [SAISIE DU STOCK]', async () => {
					await fonction.popinVisible(page,'SAISIE DU STOCK', false);
				}) 

			})     
			 
			test.describe ('Popin [IMPRESSION DES ETIQUETTES]', async () => {

				test ('Button [IMPRIMER LES ETIQUETTES] - Click', async () => {
					await fonction.clickAndWait(pageStockStock.buttonImprimerEtiquette, page);
				}) 
	
				test ('Error Message - Is Hidden', async () => {
					await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
				}) 

				test ('Button and listBox [Is - visble] - Check', async () => {
					await fonction.popinVisible(page, 'IMPRESSION DES ETIQUETTES', true);
					await fonction.isDisplayed(pageStockStock.pButtonImprimerEtiquettes);
					await fonction.isDisplayed(pageStockStock.pButtonAnnulerEtiquettes);
					await fonction.isDisplayed(pageStockStock.pListBoxImprimante);
				})        

				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickElement(pageStockStock.pButtonAnnulerEtiquettes);
				})                
	
				test ('[IMPRESSION DES ETIQUETTES]', async () => {
					await fonction.popinVisible(page,'IMPRESSION DES ETIQUETTES', false);
				}) 
	
			})             

			test.describe ('Popin [MODIFICATION DE LA PLATEFORME DE DISTRIBUTION DU LOT XXXX]', async () => {

				test ('Button [MODIFIER LA PLATEFORME DE DISTRIBUTION DU LOT] - Click', async () => {
					await fonction.clickAndWait(pageStockStock.buttonModifPlateformeDistri, page);
				}) 
	
				test ('Error Message - Is Hidden', async () => {
					await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
				}) 

				test ('Button, listBox and input [Is - visble] - Check', async () => {
					await fonction.popinVisible(page, 'MODIFICATION DE LA PLATEFORME DE DISTRIBUTION DU LOT XXXX', true);
					await fonction.isDisplayed(pageStockStock.pButtonPlateformeModifier);
					await fonction.isDisplayed(pageStockStock.pButtonPlateformeAnnuler);
					await fonction.isDisplayed(pageStockStock.pInputNbrImpressionsPltfrm);
					await fonction.isDisplayed(pageStockStock.pListBoxChoixPalteforme);
					await fonction.isDisplayed(pageStockStock.pListBoxChoixImprimante);
				})

				test ('DataGrid [PALETTES DU LOT] [Is - visble] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageStockStock.pDataGridPalettesDuLot,    
						desc        : '',
						verbose     : false,
						column      :   
							[
								'0',
								'N° palette',
								'Nombre de colis',
								'Emplacement',
								'Nombre de colis à transférer',
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				})                       

				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickElement(pageStockStock.pButtonPlateformeAnnuler);
				})                
	
				test ('[MODIFICATION DE LA PLATEFORME DE DISTRIBUTION DU LOT XXXX]', async () => {
					await fonction.popinVisible(page, 'MODIFICATION DE LA PLATEFORME DE DISTRIBUTION DU LOT XXXX', false);
				}) 

			})  

		})	// End ONGLET   

		test.describe ('Onglet [SITUATION DES PALETTES]', async () => {        
			 
			test ('Onglet [SITUATION DES PALETTES] - Click', async () => {
				await menu.clickOnglet(pageName, 'situation', page);
			})   

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Input, toggle and button [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageStockSitu.inputPalette);
				await fonction.isDisplayed(pageStockSitu.inputNumLot);
				await fonction.isDisplayed(pageStockSitu.inputArticle);
				await fonction.isDisplayed(pageStockSitu.toggleManquante);
				await fonction.isDisplayed(pageStockSitu.buttonRechercher);
				await fonction.isDisplayed(pageStockSitu.buttonAfficherDeplacement);
				await fonction.isDisplayed(pageStockSitu.buttonMettreEnAttente);
				await fonction.isDisplayed(pageStockSitu.buttonRendreDisponible);
			})

			test ('DataGrid [PALETTES] [Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageStockSitu.dataGridListePalettes,    
					desc        : 'DataGrid [PALETTES]',
					verbose     : false,
					column      :   
						[
							"0",
							"Date de réception",
							'Palette',
							'Numéro de lot',
							'Fournisseur',
							'Code article',
							'Désignation article',
							'Nombre de colis',
							'Nombre de colis bloqués',
							'Zone',
							'Allée',
							'Emp.',
							'DLC',
							'Etat',
							'Depuis le',
							'Par',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			 //-------------------------------------------------------------------------------------------------------------------------      
			 
			test ('Toggle [BLOQUEE] - Click', async () =>{
				await fonction.clickElement(pageStockSitu.toggleBloquee);
			})            
			 
			test ('Toggle [EN ATTENTE] - Click', async () =>{
				await fonction.clickElement(pageStockSitu.toggleEnAttente);
			})            

			test ('Button [RECHERCHER] - Click', async () => {
				await fonction.clickAndWait(pageStockSitu.buttonRechercher, page);
			})
			 
			test ('** Wait Until Spinner Off **', async () => {
				await fonction.waitForSpinner(pageStockSitu.spinner);
			});

			test ('CheckBox [MASQUER LES PALETTES] - Click', async () => {
				await fonction.clickAndWait(pageStockSitu.buttonMasquerPalettes, page);
			})

			test ('CheckBox [PALETTES][0] - Click', async () => {
				await fonction.clickElement(pageStockSitu.trListePalettes.nth(0));
			})

			test ('Button [AFFICHER LES DEPLACEMENTS] - Click', async () => {
				await fonction.clickAndWait(pageStockSitu.buttonAfficherDeplacement, page);
			})

			test.describe ('Popin [HISTORIQUE DES MOUVEMENTS DE LA PALETTE]', async () => {

				test ('Toggle and link [Is - visble] - Check', async () => {
					await fonction.popinVisible(page, 'HISTORIQUE DES MOUVEMENTS DE LA PALETTE', true);

					await fonction.isDisplayed(pageStockSitu.pToggleDeplacement);
					await fonction.isDisplayed(pageStockSitu.pToggleMouvement);
					await fonction.isDisplayed(pageStockSitu.pLinkFermer);
				})

				test ('DataGrid [MOUVEMENTS] [Is - visble] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageStockSitu.pDataGridMvtPalettes,    
						desc        : 'DataGrid [MOUVEMENTS]',
						verbose     : false,
						column      :   
							[
								'Date',
								'Déplacement de palette',
								'Mouvement de stock',
								'Emplacement de destination',
								'Ecart',
								"État",
								'Plateforme',
								'Auteur',
								'Commentaire',
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				})

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pageStockSitu.pLinkFermer);
				})

				test ('Popin [HISTORIQUE DEDS MOUVEMENTS DE LA PALETTE]', async () => {
					await fonction.popinVisible(page, 'HISTORIQUE DEDS MOUVEMENTS DE LA PALETTE', false);
				})

			})

		})	// End ONGLET               
				
		test.describe ('Onglet [REFUS]', async () => {

			test ('ListBox [PLATEFORME] [REFUS] = "' + idPlateforme + '"', async () => {
				await menu.selectPlateformeByValue(page, idPlateforme);                       // Sélection d'une plateforme par défaut
			});

			test ('Onglet [REFUS] - Click', async () => {
				await menu.clickOnglet(pageName, 'refus', page);                
			})   

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('DatePicker, button, input and listBox [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageStockRefus.datePickerRefusDu);
				await fonction.isDisplayed(pageStockRefus.datePickerRefusAu);          
				await fonction.isDisplayed(pageStockRefus.buttonImprimerBonReprise);  
				await fonction.isDisplayed(pageStockRefus.buttonDeclarerReprise);  
				await fonction.isDisplayed(pageStockRefus.buttonSaisirConsigne);  
				await fonction.isDisplayed(pageStockRefus.buttonRechercher);    
				await fonction.isDisplayed(pageStockRefus.inputNumLot);  
				await fonction.isDisplayed(pageStockRefus.inputNumPalette);  
				await fonction.isDisplayed(pageStockRefus.inputCodeArticle);  
				await fonction.isDisplayed(pageStockRefus.inputArticle);  
				await fonction.isDisplayed(pageStockRefus.inputFournisseur);  
				await fonction.isDisplayed(pageStockRefus.inputAuteur);  
				await fonction.isDisplayed(pageStockRefus.inputQuantiteRefusee);   
				await fonction.isDisplayed(pageStockRefus.listBoxMotif);  
				await fonction.isDisplayed(pageStockRefus.listBoxTypeReprise); 
			})

			test ('DataGrid [RECEPTIONS REFUSEES] [Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageStockRefus.dataGridRefus,    
					desc        : 'DataGrid [RECEPTIONS REFUSEES]',
					verbose     : false,
					column      :   
						[
							'0',
							'Date du refus',
							'Motif',
							'N° lot',
							'N° palette',
							'Code article',
							'Article',
							'Fournisseur',
							'Auteur',
							'Qté refusée',
							'Poids refusé (kg)',
							'DLC',
							'Emp.',
							'Cs',
							'Date reprise',
							'Type reprise',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			 
		})	// End ONGLET    

		test.describe ('Onglet [DONS] ', async () => {        

			test ('Onglet [DONS] - Click', async () => {               
				await menu.clickOnglet(pageName, 'dons', page);
			})   

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('ListBox, datePicker, checkBox and button [Is - visble] - Check', async () => { 
				await fonction.isDisplayed(pageStockDons.buttonRechercher);            
				await fonction.isDisplayed(pageStockDons.buttonCreerDon);  
				await fonction.isDisplayed(pageStockDons.buttonCreerRecu);  
				await fonction.isDisplayed(pageStockDons.buttonImprimerRecu);  
				await fonction.isDisplayed(pageStockDons.buttonImprimerRecap);  
				await fonction.isDisplayed(pageStockDons.buttonTransformerEnCasse);  
				await fonction.isDisplayed(pageStockDons.datePickerFrom);              
				await fonction.isDisplayed(pageStockDons.datePickerTo);
				await fonction.isDisplayed(pageStockDons.checkBoxMasquerDons);
				await fonction.isDisplayed(pageStockDons.listBoxDonateur);
				await fonction.isDisplayed(pageStockDons.listBoxBeneficiaire);
				await fonction.isDisplayed(pageStockDons.listBoxGroupeArticle);
				await fonction.isDisplayed(pageStockDons.checkBoxMasquerDons);
			}) 

			test ('DataGrid [DONS] [Is - visble] - Check', async () => { 
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageStockDons.dataGridDons,    
					desc        : 'DataGrid [DONS]',
					verbose     : false,
					column      :   
						[
							'0',
							'Numéro du reçu',
							'Date',
							'Donateur',
							'Bénéficiaire',
							'Groupe',
							'Code article',
							'Désignation article',
							'Numéro de lot',
							'DLC',
							'Quantité en colis',
							'Quantité en unité',
							'Poids (kg)',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			}) 

			var nomPopin = 'CREATION DE DONS';
			test.describe ('Popin [' + nomPopin + ']', async () => {

				test ('Button [CREER UN DON] - Click', async () => {
					await fonction.clickAndWait(pageStockDons.buttonCreerDon, page);
				})

				test ('Button, input and link [Is - visble] - Check', async () => {
					await fonction.popinVisible(page, nomPopin, true);

					await fonction.isDisplayed(pageStockDons.pPinputArticleDon);
					await fonction.isDisplayed(pageStockDons.pPinputFournisseurDon);
					await fonction.isDisplayed(pageStockDons.pPinputNumLotDon);   
					await fonction.isDisplayed(pageStockDons.pPinputPaletteDon);                     
					await fonction.isDisplayed(pageStockDons.pPbuttonRechercherDon); 
					await fonction.isDisplayed(pageStockDons.pPbuttonEnregistrerDon);
					await fonction.isDisplayed(pageStockDons.pPlinkAnnulerDon); 
				})                    

				test ('DataGrid [1] [Is - visble] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageStockDons.pPdataGrid1,    
						desc        : 'DataGrid [1]',
						verbose     : false,
						column      :   
							[
								'0',
								'Numéro de lot',
								'Fournisseur',
								'Code article',
								'Désignation article',
								'Emplacement',
								'Palette',
								'DLC',
								'Quantités (colis)',
								'Quantité à donner (colis)',
								'Quantité à donner (unité)',
								'Poids à donner (kg)',
								'Actions',
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				})

				test ('DataGrid [2] [Is - visble] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageStockDons.pPdataGrid2,    
						desc        : 'DataGrid [2]',
						verbose     : false,
						column      :   
							[
								'0',
								'Numéro de lot',
								'Fournisseur',
								'Code article',
								'Désignation article',
								'Emplacement',
								'Palette',
								'DLC',
								'Quantités (colis)',
								'Quantité à donner (colis)',
								'Quantité à donner (unité)',
								'Poids à donner (kg)',
								'Actions',
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				})
			
				test ('Link [ANNULER] - Click', async () => {
					await fonction.clickElement(pageStockDons.pPlinkAnnulerDon);
				})                

				test ('Popin [CREATION DE DONS]', async () => {
					await fonction.popinVisible(page, nomPopin, false);
				})
			}) 

		})	// End ONGLET   
		 
		test.describe ('Onglet [ALERTES SANITAIRES]', async () => {        

			test ('Onglet [ALERTES SANITAIRES] - Click', async () => {
				await menu.clickOnglet(pageName, 'alertesEtBlocages', page);
			})   

			test ('Toggle, datePicker, listBox and button [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageStockBlocage.buttonRechercher); 
				await fonction.isDisplayed(pageStockBlocage.buttonCreer); 
				await fonction.isDisplayed(pageStockBlocage.buttonTraiter);                        
				await fonction.isDisplayed(pageStockBlocage.buttonImprimerBilan);                        
				await fonction.isDisplayed(pageStockBlocage.buttonDonnerSuite);                        
				await fonction.isDisplayed(pageStockBlocage.buttonSupprimer);                        
				await fonction.isDisplayed(pageStockBlocage.toggleATraiter);                        
				await fonction.isDisplayed(pageStockBlocage.togglEnCours);    
				await fonction.isDisplayed(pageStockBlocage.toggleTraitee);                
				await fonction.isDisplayed(pageStockBlocage.datePickerFrom);  
				await fonction.isDisplayed(pageStockBlocage.datePickerTo); 
				await fonction.isDisplayed(pageStockBlocage.listBoxGroupeArticle);
			}) 

			test ('DataGrid [ALERTES] [Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageStockBlocage.dataGridAlertes,    
					desc        : 'DataGrid [ALERTES]',
					verbose     : false,
					column      :   
						[
							'0',
							'Date de l\'alerte',
							'Numéro',
							'Qualification',
							'Code article',
							'Désignation article',
							'Fournisseur',
							'N° lot Sigale',
							'DLC',
							'N° lot fournisseur',
							'Quantité totale',
							'Poids total',
							'Statut',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})  
   
		})	// End ONGLET   

		test.describe ('Onglet [HISTORIQUE DES MOUVEMENTS]', async () => {        
			
			test ('Onglet [HISTORIQUE DES MOUVEMENTS] - Click', async () => {
				await menu.clickOnglet(pageName, 'historique', page);
			})   

			test ('Button, input and datePicker [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageStockMouv.buttonAfficherMvt);
				await fonction.isDisplayed(pageStockMouv.buttonRechercher);
				await fonction.isDisplayed(pageStockMouv.inputFiltreNumLot);
				await fonction.isDisplayed(pageStockMouv.inputFiltreArticle);
				await fonction.isDisplayed(pageStockMouv.pMultiselectPlateformeDist);
				await fonction.isDisplayed(pageStockMouv.datePickerReceptionFrom);
				await fonction.isDisplayed(pageStockMouv.datePickerReceptionTo); 
			})      

			test ('DataGrid [LOTS] [Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageStockMouv.dataGridLots,    
					desc        : 'DataGrid [LOTS]',
					verbose     : false,
					column      :   
						[
							'Date réception prévue',
							'Numéro de lot',
							'Code article',
							'Désignation article',
							'Conditionnement',
							'Fournisseur',
							'DLC',
							'Plateforme de distribution',
							'Actions',              
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

		})	// End ONGLET   

		test.describe ('Onglet [OCCUPATION DES EMPLACEMENTS]', async () => {        
			
			test ('Onglet [OCCUPATION DES EMPLACEMENTS] - Click', async () => {
				await menu.clickOnglet(pageName, 'emplacements', page);
			})   

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Button [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageStockEmplac.buttonMAJ);
				await fonction.isDisplayed(pageStockEmplac.buttonImpEmplaceVides);
			}) 

			test ('DataGrid [LOTS] [Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageStockEmplac.dataGridEmplacements,    
					desc        : 'DataGrid [LOTS]',
					verbose     : false,
					column      :   
						[
							'Zone',
							'Emplacement',
							'Palette',                           
						]
				}
				await fonction.dataGridHeaders(oDataGrid);            
			})
			
			//Test.noHtmlInNewTab('EMPLACEMENTS VIDES',               PageStockEmplac.buttonImpEmplaceVides);
		})	// End ONGLET

	})  //-- End Page

	test.describe ('Page [INVENTAIRE]', async () => {    

		var nomPage = 'inventaire';

		test ('Page [INVENTAIRE] - Check', async () => {
			await menu.click(nomPage, page);
		})

		test.describe ('Onglet [SAISIE DE L\'INVENTAIRE]', async () => {

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Button and input [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageInventInv.buttonFormInventaire);
				await fonction.isDisplayed(pageInventInv.buttonPalNonInvent);
				await fonction.isDisplayed(pageInventInv.buttonPalPartielInvent);
				await fonction.isDisplayed(pageInventInv.buttonPalDLCCourtes);
				await fonction.isDisplayed(pageInventInv.buttonStock);
				await fonction.isDisplayed(pageInventInv.buttonTerminerInvent);                                                            
				await fonction.isDisplayed(pageInventInv.inputNumPalette);
			})

			test ('DataGrid [ZONES][Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageInventInv.dataGridZone,    
					desc        : 'DataGrid [ZONES]',
					verbose     : false,
					column      :   
						[
							'Zone',
							'' 
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			test ('DataGrid [ALLEES] [Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageInventInv.dataGridAllee,    
					desc        : 'DataGrid [ALLEES]',
					verbose     : false,
					column      :   
						[
							'Allée'          
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			test ('DataGrid [EMPLACEMENTS] [Is - visble] - Check', async () => {
				var  oDataGrid = 
				{
					element     : pageInventInv.dataGridEmplacement,    
					desc        : 'DataGrid [EMPLACEMENTS]',
					verbose     : false,
					column      :   
						[
							'Emplacement',
							''              
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			test ('DataGrid [ARTICLES] [Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageInventInv.dataGridArticle,    
					desc        : 'DataGrid [ARTICLES]',
					verbose     : false,
					column      :   
						[
							'Article',
							'Calibre',
							'Emballage',
							'Couleur',
							'Marque',
							'Fournisseur',
							'Palette',
							'Quantité',
							'Emplacement',
							'Actions'               
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			test ('DataGrid [ZONE][0] - Click', async () => {
				var nbEmplacement = await pageInventInv.dataGridEmplaceLignes.count();
				await pageInventInv.dataGridZoneLignes.count().then(async (nbZone) => {
					if(nbZone !=0 && nbEmplacement ==0){
						await fonction.clickElement(pageInventInv.dataGridZoneLignes.first());
					}
				})
			})

			test ('DataGrid [EMPLACEMENT][0] - Click', async () => {
				await fonction.clickElement(pageInventInv.dataGridEmplaceLignes.first());
			})            
			
			test ('Button [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageInventInv.buttonDeclarerPalNum);
				await fonction.isDisplayed(pageInventInv.buttonDeclarerPalAno);
				await fonction.isDisplayed(pageInventInv.buttonSauvegarder);
			}) 

			test.describe ('Popin [DECLARATION D\UNE PALETTE ETIQUETEE] :', async () => {

				test ('Button [DECLARER UNE PALETTE NUMEROTEE]', async () =>{ 
					await fonction.clickAndWait(pageInventInv.buttonDeclarerPalNum, page);
				})

				test ('Button and input [Is - visble] - Check', async () =>{ 
					await fonction.popinVisible(page, 'DECALARATION D\'UNE PALETTE ETIQUETEE', true);

					await fonction.isDisplayed(pageInventInv.pInputNumPalette);
					await fonction.isDisplayed(pageInventInv.pInputQuantite);
					await fonction.isDisplayed(pageInventInv.pButtonRechercher);
					await fonction.isDisplayed(pageInventInv.pButtonSauvegarder);
					await fonction.isDisplayed(pageInventInv.pLinkAnnuler);
				})

				test ('DataGrid [PALETTES] [Is - visble] - Check', async () =>{ 
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageInventInv.pDataGridPalette,    
						desc        : 'DataGrid [PALETTES]',
						verbose     : false,
						column      :   
							[
								'Code article',
								'Désignation article',
								'Calibre',
								'Emballage',
								'Couleur',
								'Marque',
								'Fournisseur'             
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				})

				test ('Link [ANNULER]', async () =>{ 
					await fonction.clickElement(pageInventInv.pLinkAnnuler);
				})

				test ('Popin [DECLARATION D\UNE PALETTE ETIQUETEE]', async () =>{ 
					await fonction.popinVisible(page, 'DECLARATION D\UNE PALETTE ETIQUETEE', false);
				})

			})

			test.describe ('Popin [DECLARATION D\'UNE PALETTE SUR l\'EMPLACEMENT] :', async () => {

				test ('Button [DECLARER UNE PALETTE ANONYME]', async () =>{ 
					await fonction.clickAndWait(pageInventInv.buttonDeclarerPalAno, page);
				})

				test ('Button, button, link and input [Is - visble] - Check', async () =>{ 
					await fonction.popinVisible(page, 'DECLARATION D\'UNE PALETTE SUR l\'EMPLACEMENT', true);

					await fonction.isDisplayed(pageInventInv.pInputArticle);
					await fonction.isDisplayed(pageInventInv.pInputFournisseur);
					await fonction.isDisplayed(pageInventInv.pInputEmballage);
					await fonction.isDisplayed(pageInventInv.pInputCouleur);
					await fonction.isDisplayed(pageInventInv.pInputCalibre);
					await fonction.isDisplayed(pageInventInv.pInputMarque);
					await fonction.isDisplayed(pageInventInv.pInputNbJours);
					await fonction.isDisplayed(pageInventInv.pInputNbColis);
					await fonction.isDisplayed(pageInventInv.pInputCouleurEmballage);
					await fonction.isDisplayed(pageInventInv.pInputColisage);
					await fonction.isDisplayed(pageInventInv.pButtonRechercherArriv);
					await fonction.isDisplayed(pageInventInv.pButtonSauvegarderAno);
					await fonction.isDisplayed(pageInventInv.pLinkAnnulerArriv);
				})

				test ('DataGrid [ARRIVAGES] [Is - visble] - Check', async () =>{ 
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageInventInv.pDataGridArrivages,    
						desc        : 'DataGrid [ARRIVAGES]',
						verbose     : false,
						column      :   
							[
								'0',
								'Code article',
								'Désignation article',
								'Fournisseur',
								'N° lot',
								'Arrivée',
								'Emballage',
								'Couleur',
								'Calibre',
								'Marque',
								'DLC'            
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				})
				
				test ('Link [ANNULER]', async () =>{ 
					await fonction.clickElement(pageInventInv.pLinkAnnulerArriv);
				})             

				test ('Popin [DECLARATION D\'UNE PALETTE SUR l\'EMPLACEMENT]', async () =>{ 
					await fonction.popinVisible(page, 'DECLARATION D\'UNE PALETTE SUR l\'EMPLACEMENT', false);
				})

			})

			test.describe ('Popin [IMPRESSION DU RAPPORT DES PALETTES A DLC COURTES]', async () => {

				test ('Button [PALETTES A DLC COURTES] - Click', async () => {
					await fonction.clickAndWait(pageInventInv.buttonPalDLCCourtes, page);
				}) 

				test ('Error Message - Is Hidden', async () => {
					await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
				}) 

				test ('Button and input [Is - visble] - Check', async () => {
					await fonction.popinVisible(page, 'IMPRESSION DU RAPPORT DES PALETTES A DLC COURTES', true);
				
					await fonction.isDisplayed(pageInventInv.pButtonImprimer);
					await fonction.isDisplayed(pageInventInv.pButtonFermer);
					await fonction.isDisplayed(pageInventInv.pInputNbjoursInf);               
					await fonction.isDisplayed(pageInventInv.pInputNbjoursSup); 
					await fonction.isDisplayed(pageInventInv.pCheckBoxImprimer);
					await fonction.isDisplayed(pageInventInv.pInputChoixRayon);
				})

				test ('Button [IMPRIMER] - Click', async () => {                
					await fonction.clickElement(pageInventInv.pButtonFermer);
				})
				// Rq : Inutile de fermer la popin (celle-ci est supprimée lors de l'ouverture du second onglet)
	
				test ('Popin [IMPRESSION DU RAPPORT DES PALETTES A DLC COURTES]', async () => {                
					await fonction.popinVisible(page, 'IMPRESSION DU RAPPORT DES PALETTES A DLC COURTES', false);
				})   

			})             
			//Test.noHtmlInNewTab('STOCK',                        PageInventInv.buttonStock);
		})	// End ONGLET

		test.describe ('Onglet [ANALYSE DES ECARTS]', async () => {        
			
			test ('Onglet [ANALYSE DES ECARTS] - Click', async () => {
				await menu.clickOnglet(nomPage, 'ecarts', page);
			})   

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Button, input, textArea, checkBox and listBox [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageInventEcart.buttonImprimerEcarts);
				await fonction.isDisplayed(pageInventEcart.buttonJustifierSelection);
				await fonction.isDisplayed(pageInventEcart.inputFiltreArticlePalette);
				await fonction.isDisplayed(pageInventEcart.checkBoxArticle);
				await fonction.isDisplayed(pageInventEcart.checkBoxPalette);
				await fonction.isDisplayed(pageInventEcart.listBoxZone);
				await fonction.isDisplayed(pageInventEcart.listBoxJustification);
				await fonction.isDisplayed(pageInventEcart.textAreaCommentaire);
			})

			test ('DataGrid [ECARTS] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageInventEcart.dataGridEcarts,    
					desc        : '[1]',
					verbose     : false,
					column      :   
						[
							'0',                   
							'Date d\'inventaire',  
							'N° de lot',           
							'Code article',        
							'Désignation article', 
							'Palette',             
							'Zone',                
							'Emplacement',         
							'Quantité théorique',  
							'Quantité inventaire', 
							'Ecart',               
							'Actions',                           
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			}) 

			//Test.noHtmlInNewTab('ECARTS',                       PageInventEcart.buttonImprimerEcarts);

		})	// End ONGLET

	})  //-- End Page   

	test.describe ('Page [REAPPRO]', async () => {    

		var nomPage = 'reappro';

		test ('Page [REAPPRO] - Click', async () => {
			await menu.click(nomPage, page);
		})

		test.describe ('Onglet [SUPERVISION]', async () => {

			test ('Onglet [SUPERVISION] - Click', async () => {
				await menu.clickOnglet(nomPage, 'supervision', page);        
			}) 

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Button and datePicker [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageReaprSuperv.buttonRafraichir);    
				await fonction.isDisplayed(pageReaprSuperv.buttonCreerMission);     
				await fonction.isDisplayed(pageReaprSuperv.datePickerDate);      
			}) 

			test ('DataGrid [LISTE REAPPRO SUPERVISION] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageReaprSuperv.dataGridListeReappro,    
					desc        : 'DataGrid [LISTE REAPPRO SUPERVISION]',
					verbose     : false,
					column      :   
						[
							'0',
							'Rayon',
							'Groupe article',
							'Ordre chemin',
							'Chemin',
							'Allée',
							'Ordre empl.',
							'Empl. picking',
							'Code article',
							'Désignation article',
							'Cmd. mag',
							'Réparti',
							'Préparé',
							'À préparer',
							'Stock au picking',
							'Stock autre',
							'À réappro',
							'Réappro en cours',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);      
			}) 

		})	// End ONGLET

		test.describe ('Onglet [REAPPRO A FAIRE]', async () => {

			test ('Onglet [REAPPRO A FAIRE] - Click', async () => {
				await menu.clickOnglet(nomPage, 'aFaire', page);        
			}) 

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Button [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageReaprAFaire.buttonAnnuler);      
			}) 

			test ('DataGrid [LISTE REAPPRO A FAIRE] [Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageReaprAFaire.dataGridListeReappro,    
					desc        : 'DataGrid [LISTE REAPPRO A FAIRE]',
					verbose     : false,
					column      :   
						[
							'0',
							'Heure de création',
							'Chemin de picking',
							'Code article',
							'Désignation article',
							'Emplacement picking',
							'Quantité au picking',
							'Numéro de palette',
							'Emplacement',
							'Quantité palette',
							'Priorité',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			}) 

		})	// End ONGLET

		test.describe ('Onglet [REAPPRO EN COURS]', async () => {

			test ('Onglet [EN COURS] - Click', async () => {
				await menu.clickOnglet(nomPage, 'enCours', page);        
			}) 

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Button [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageReaprEnCours.buttonAnnuler);
			})

			test ('DataGrid [LISTE REAPPRO EN COURS] [Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageReaprEnCours.dataGridListeReappro,    
					desc        : 'DataGrid [LISTE REAPPRO EN COURS]',
					verbose     : false,
					column      :   
						[
							'0',
							'Heure de début',
							'Magasinier',
							'Chemin de picking',
							'Code article',
							'Désignation article',
							'Emplacement picking',
							'Quantité au picking',
							'Numéro de palette',
							'Quantité palette',
							'Priorité',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

		})	// End ONGLET
		
		test.describe ('Onglet [REAPPRO TERMINE]', async () => {

			test ('Onglet [REAPPRO TERMINE] - Click', async () => {
				await menu.clickOnglet(nomPage, 'termine', page);        
			}) 

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                                // Pas d'erreur affichée à priori au chargement de l'onglet      
			})

			//Test.isDisplayed('DatePicker [DATE DES MISSIONS]',          PageReaprTermine.datePickerDateDesMissions);

			test ('DataGrid [LISTE REAPPRO TERMINEE] [Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageReaprTermine.dataGridListeReappro,    
					desc        : 'DataGrid [LISTE REAPPRO TERMINEE]',
					verbose     : false,
					column      :   
						[
							'0',
							'Heure de début',
							'Heure de fin',
							'Magasinier',
							'Chemin de picking',
							'Code article',
							'Désignation article',
							'Emplacement picking',
							'Numéro de palette',
							'Quantité réapprovisionnée',
							'Priorité',
							'Type réappro',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

		})	// End ONGLET
		
		test.describe ('Onglet [REAPPRO ANNULE]', async () => {

			test ('Onglet [REAPPRO ANNULE] - Click', async () => {
				await menu.clickOnglet(nomPage, 'annule', page);        
			}) 

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                                // Pas d'erreur affichée à priori au chargement de l'onglet        
			}) 

			//Test.isDisplayed('DatePicker [DATE DES MISSIONS]',          PageReaprAnnule.datePickerDateDesMissions);

			test ('DataGrid [LISTE REAPPRO ANNULE] [Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageReaprAnnule.dataGridListeReappro,    
					desc        : 'DataGrid [LISTE REAPPRO ANNULE]',
					verbose     : false,
					column      :   
						[
							'0',
							'Heure d\'annulation',
							'Magasinier',
							'Chemin de picking',
							'Code article',
							'Désignation article',
							'Emplacement picking',
							'Numéro de palette',
							'Priorité',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

		})	// End ONGLET

	})	//-- End PAGE

	test.describe ('Page [EMBALLAGE]', async () => {    

		var nomPage = 'emballage';
		test ('Page [EMBALLAGE] - Click', async () => {
			await menu.click(nomPage, page);
		})

		test.describe ('Onglet [RECEPTION]', async () => {

			test.skip ('Onglet [RECEPTION] - Click', async () => {
				await menu.clickOnglet(nomPage, 'reception', page);        
			})    

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Button, toggle, datePicker and input [Is visible] - Check', async () => {
				await fonction.isDisplayed(pageStockRest.buttonRechercher);
				await fonction.isDisplayed(pageStockRest.buttonModifier);
				await fonction.isDisplayed(pageStockRest.buttonAnnuler);
				await fonction.isDisplayed(pageStockRest.buttonVisualiserRecept);
				await fonction.isDisplayed(pageStockRest.buttonImprimerRecept);
				await fonction.isDisplayed(pageStockRest.datePickerFrom);
				await fonction.isDisplayed(pageStockRest.datePickerTo);
				await fonction.isDisplayed(pageStockRest.pPinputFiltreNumBLRestitut);
				await fonction.isDisplayed(pageStockRest.pPinputFiltreTranspRestitut);
				await fonction.isDisplayed(pageStockRest.pPinputFiltreReceptionnaire);      
			}) 

			test ('DataGrid [RESTITUTION] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageStockRest.dataGridRestitution,    
					desc        : 'DataGrid [RESTITUTION]',
					verbose     : false,
					column      :   
						[
							'Date',
							'Expéditeur',
							'Numéro BL',
							'Transporteur',
							'Réceptionnaire',
							'Statut',
							'Actions'                   
						]
				}
				await fonction.dataGridHeaders(oDataGrid);       
			}) 

			var nomPopin = 'CREATION D\'UN BON DE RESTITUTION';
			test.describe ('Popin [' +nomPopin+ ']', async () => {

				test ('Button [CREER UN BL] - Click', async () => {
					await fonction.clickAndWait(pageStockRest.buttonCreer, page);
				})

				test ('Button datePicker, input and textArea [Is visible] - Check', async () => {
					await fonction.popinVisible(page, nomPopin, true);

					await fonction.isDisplayed(pageStockRest.pPbuttonEnregistrer);
					await fonction.isDisplayed(pageStockRest.pPdatePickerEntree);
					await fonction.isDisplayed(pageStockRest.pPinputNumeroBl);
					await fonction.isDisplayed(pageStockRest.pPinputRechercheExpediteur);
					await fonction.isDisplayed(pageStockRest.pPinputChauffeurRestitut);
					await fonction.isDisplayed(pageStockRest.pPinputTransporteurRestitut);
					await fonction.isDisplayed(pageStockRest.pPinputReceptonnaire);
					await fonction.isDisplayed(pageStockRest.pPinputHeureStartRestitut);
					await fonction.isDisplayed(pageStockRest.pPinputHeureEndRestitut);
					await fonction.isDisplayed(pageStockRest.pPtextAreaObsRestitut); 
				})

				test ('Link [ANNULER] - Click', async () => {
					await fonction.clickElement(pageStockRest.pPlinkAnnulerRestitut);
				})

				test ('Popin [CREATION D\'UN BON DE RESTITUTION]', async () => {
					await fonction.popinVisible(page, nomPopin, false);
				})  

			})

		})	// End ONGLET

		test.describe ('Onglet [LIVRAISON]', async () => {

			test ('Onglet [LIVRAISON] - Click', async () => {
				await menu.clickOnglet(nomPage, 'livraison', page);        
			})    

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Button, toggle, datePicker and input [Is visible] - Check', async () => {
				await fonction.isDisplayed(pageStockRest.buttonRechercher);
				await fonction.isDisplayed(pageStockRest.buttonCreerUnBL);
				await fonction.isDisplayed(pageStockRest.buttonModifierUnBL);
				await fonction.isDisplayed(pageStockRest.buttonAnnulerBl);
				await fonction.isDisplayed(pageStockRest.buttonVisualiser);
				await fonction.isDisplayed(pageStockRest.buttonImprimer);
				await fonction.isDisplayed(pageStockRest.multiSelectStatut);
				await fonction.isDisplayed(pageStockRest.datePickerFrom);
				await fonction.isDisplayed(pageStockRest.datePickerTo);
				await fonction.isDisplayed(pageStockRest.pPinputFiltreNumComRestitut);
				await fonction.isDisplayed(pageStockRest.pPinputFiltreNumBLRestitut);
				await fonction.isDisplayed(pageStockRest.pPinputFiltreTranspRestitut);
				await fonction.isDisplayed(pageStockRest.pPinputFiltreChargeRestitut);       
			}) 

			test ('DataGrid [RESTITUTION] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageStockRest.dataGridRestitution,    
					desc        : 'DataGrid [RESTITUTION]',
					verbose     : false,
					column      :   
						[
							'Date',
							'Destinataire',
							'Numéro de commande',
							'Numéro de BL',
							'Transporteur',
							'Chargeur',
							'Statut',
							'Actions',                    
						]
				}
				await fonction.dataGridHeaders(oDataGrid);       
			}) 

			var nomPopin = 'CREATION D\'UN BON DE RESTITUTION';
			test.describe ('Popin [' +nomPopin+ ']', async () => {

				test ('Button [CREER UN BL] - Click', async () => {
					await fonction.clickAndWait(pageStockRest.buttonCreerUnBL, page);
				})

				test ('Button datePicker, input and textArea [Is visible] - Check', async () => {
					await fonction.popinVisible(page, nomPopin, true);

					await fonction.isDisplayed(pageStockRest.pPbuttonEnregistrerRestitut);
					await fonction.isDisplayed(pageStockRest.pPdatePickerRestitut);
					await fonction.isDisplayed(pageStockRest.pPinputNumCommandeRestitut);
					await fonction.isDisplayed(pageStockRest.pPinputChauffeurRestitut);
					await fonction.isDisplayed(pageStockRest.pPinputDestinatRestitut);
					await fonction.isDisplayed(pageStockRest.pPinputTransporteurRestitut);
					await fonction.isDisplayed(pageStockRest.pPinputChargeurRestitut);
					await fonction.isDisplayed(pageStockRest.pPinputHeureStartRestitut);
					await fonction.isDisplayed(pageStockRest.pPinputHeureEndRestitut);
					await fonction.isDisplayed(pageStockRest.pPtextAreaObsRestitut); 
				})

				test ('Link [ANNULER] - Click', async () => {
					await fonction.clickElement(pageStockRest.pPlinkAnnulerRestitut);
				})

				test ('Popin [CREATION D\'UN BON DE RESTITUTION]', async () => {
					await fonction.popinVisible(page, nomPopin, false);
				})  

			})

		})	// End ONGLET

		test.describe ('Onglet [MOUVEMENTS DES EMBALLAGES]', async () => {

			test ('Onglet [MOUVEMENTS DES EMBALLAGES] - Click', async () => {
				await menu.clickOnglet(nomPage, 'mouvementsEmballages', page);        
			}) 

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('MultiSelect, datePicker, button, input filtre, listBox and label [Is visible] - Check', async () => {
				await fonction.isDisplayed(pageStockMvtEmb.datePickerFrom);
				await fonction.isDisplayed(pageStockMvtEmb.datePickerTo);
	                              
				await fonction.isDisplayed(pageStockMvtEmb.buttonExporter);    
				await fonction.isDisplayed(pageStockMvtEmb.buttonCreatRegEmballage);                             
	
				await fonction.isDisplayed(pageStockMvtEmb.multiSelectPlateforme);
				await fonction.isDisplayed(pageStockMvtEmb.multiSelectMouvement);
	
				await fonction.isDisplayed(pageStockMvtEmb.inputFiltreRefAchat);
				await fonction.isDisplayed(pageStockMvtEmb.inputFiltreNumeroBL);
				await fonction.isDisplayed(pageStockMvtEmb.inputFiltreTransporteur);
	
				await fonction.isDisplayed(pageStockMvtEmb.listBoxPlateforme);
				await fonction.isDisplayed(pageStockMvtEmb.listBoxGestionnaire);
				await fonction.isDisplayed(pageStockMvtEmb.listBoxTypeEmballage);
	
				await fonction.isDisplayed(pageStockMvtEmb.labelTotalPalettes);         
			}) 
	
			test ('DataGrid [MOUVEMENTS PALETTES] [Is visible] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageStockMvtEmb.dataGridMouvements,    
					desc        : 'DataGrid [MOUVEMENTS PALETTES]',
					verbose     : false,
					column      :   
						[
							'',
							'Date',
							'Mouvement',
							'Plateforme',
							'Expéditeur',
							'Destinataire',
							'Référence achat',
							'Numéro de BL',
							'Transporteur',
							'Gestionnaire',
							'Type d\'emballage',
							'Qté',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);       
			})

		})  // End ONGLET

		test.describe ('Onglet [REFERENTIEL]', async () => {

			test ('Onglet [REFERENTIEL] - Click', async () => {
				await menu.clickOnglet(nomPage, 'referentiel', page);        
			})    

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Button [Is visible] - Check', async () => {
				await fonction.isDisplayed(pageStockEmb.buttonCreerGestionnaire);
				await fonction.isDisplayed(pageStockEmb.buttonModifierGestionnaire);
				await fonction.isDisplayed(pageStockEmb.buttonCreerTypeEmballage);
				await fonction.isDisplayed(pageStockEmb.buttonCreerModifierEmballage);        
			}) 

			test ('DataGrid [GESTIONNAIRES] [Is visible] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageStockEmb.dataGridGestionnaires,    
					desc        : 'DataGrid [GESTIONNAIRES]',
					verbose     : false,
					column      :   
						[
							'0',
							'Gestionnaires',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);       
			})

			test ('InputField [GESTIONNAIRES][1] - Click', async () =>{
				const bVisible = await pageStockEmb.checkboxListeGestionnaires.nth(1).isVisible();
				if (bVisible) {
					await pageStockEmb.checkboxListeGestionnaires.nth(1).click();          // sélection de la première ligne d'enregistrement
				} else {
					test.skip();
				}
			})

			test ('DataGrid [TYPES \'EMBALLAGE] - Check', async () => {

				await pageStockEmb.dataGridTypesEmballages.first().isVisible().then(async () => {

					var oDataGrid:TypeListOfElements = 
					{
						element     : pageStockEmb.dataGridTypesEmballages,    
						desc        : 'DataGrid [TYPES \'EMBALLAGE]',
						verbose     : false,
						column      :   
							[
								'Gestionnaire',
								'Type d\'emballage',
								'Gérer en stock',
								'Emballages associés',
								'Contrôler emballage à réception',
								'Nb emballage par pile à la l\'expédition',
								'Nb emballage par pile à la réception',
								'Poids (kg)',
								'Emballage reçu en magasin',
								'Actif',
								'Actions'
							]
					}                        
					await fonction.dataGridHeaders(oDataGrid); 
				})
			})

			var nomPopin = 'CREATION D\'UN GESTIONNAIRE';
			test.describe ('Popin ['+nomPopin+']', async () => {

				test ('Button [CREER UN BENEFICIARE] - Click', async () => {
					await fonction.clickAndWait(pageStockEmb.buttonCreerGestionnaire, page);
				})

				test ('Input and Button [Is - visble] - Check', async () => {
					await fonction.popinVisible(page, nomPopin, true);

					await fonction.isDisplayed(pageStockEmb.pPbuttonGestEnregistrer);
					await fonction.isDisplayed(pageStockEmb.pPinputGestCode);
					await fonction.isDisplayed(pageStockEmb.pPinputGestAdresse);
					await fonction.isDisplayed(pageStockEmb.pPinputGestDesignation);
					await fonction.isDisplayed(pageStockEmb.pPinputGestComplement);
					await fonction.isDisplayed(pageStockEmb.pPinputGestRaisonSociale);
					await fonction.isDisplayed(pageStockEmb.pPinputGestCodePostal);
					await fonction.isDisplayed(pageStockEmb.pPinputGestTelephone);
					await fonction.isDisplayed(pageStockEmb.pPinputGestVille);
				})

				test ('Link [ANNULER] - Click', async () => {
					await fonction.clickElement(pageStockEmb.pPlinkGestAnnuler);
				})

				test ('Popin [CREATION D\'UN GESTIONNAIRE]', async () => {
					await fonction.popinVisible(page, nomPopin, false);
				})

			})

		})	// End ONGLET
		
	})  //-- End Page

	test.describe ('Page [REFERENTIEL]', async () => {    

		var sNomPage = 'referentiel';

		test ('Page [REFERENTIEL] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		test.describe ('Onglet [ARTICLES]', async () => {

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Ipnut and listBox [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageRefArticle.inputFiltreArticle);
				await fonction.isDisplayed(pageRefArticle.listBoxGroupeArticle);
				await fonction.isDisplayed(pageRefArticle.listBoxModePreparation);
				await fonction.isDisplayed(pageRefArticle.buttonRechercher);
			})

			test ('DataGrid [ARTICLES] [Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageRefArticle.dataGridReferentiel,    
					desc        : 'DataGrid [ARTICLES]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Code',
							'Désignation',
							'Groupe article',
							'Famille',
							'Emplacement de réception',
							'Type d\'étiquette',
							'Mode de préparation',
							'Seuil de rotation',
							'Aide au rangement',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			test ('Button [RECHERCHER] - Click', async () => {
				await fonction.clickElement(pageRefArticle.buttonRechercher);
			})

			test ('CheckBox [ARTICLE][0] - Click', async () => {
				await fonction.clickElement(pageRefArticle.checkBoxArticles.nth(0));
			})

			test ('Button, input and toggle [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageRefArticle.inputEmplacementReception);
				await fonction.isDisplayed(pageRefArticle.toggleButtonClassiqueReduite);
				await fonction.isDisplayed(pageRefArticle.inputSeuilRotation);
				await fonction.isDisplayed(pageRefArticle.buttonActions);
				await fonction.isDisplayed(pageRefArticle.buttonEnregistrer);
			})  

		})	// End ONGLET

		test.describe ('Onglet [DIMENSIONS COLIS A VALIDER]', async () => {        
			
			test ('Onglet [DIMENSIONS COLIS A VALIDER] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'dimensionColis', page);
			})   

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Button [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageRefDimension.buttonValider);
				await fonction.isDisplayed(pageRefDimension.buttonRefuser);
			})      

			test ('DataGrid [DIMENSIONS] [Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageRefDimension.dataGridHistoriqueImports,    
					desc        : 'DataGrid [DIMENSIONS]',
					verbose     : false,
					column      :   
						[
							'0',
							'Date du contrôle',
							'Contrôleur',
							'Fournisseur',
							'Code article',
							'Désignation article',
							'Conditionnement',
							'Longueur connue (cm)',
							'Longueur mesurée (cm)',
							'Largeur connue (cm)',
							'Largeur mesurée (cm)',
							'Hauteur connue (cm)',
							'Hauteur mesurée (cm)',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			}) 

		})	// End ONGLET

		test.describe ('Onglet [EMPLACEMENTS]', async () => {        
			
			test ('Onglet [EMPLACEMENTS] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'emplacements', page);
			})   

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Button [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageRefEmpla.buttonZones);
				await fonction.isDisplayed(pageRefEmpla.buttonAllees);
				await fonction.isDisplayed(pageRefEmpla.buttonEmplacements);
				await fonction.isDisplayed(pageRefEmpla.buttonRecalculerOrdre);  
			})                   

			test ('DataGrid [ZONES] - Check', async () => {
		  
				var oDataGrid:TypeListOfElements = {
					element     : pageRefEmpla.dataGridZones,    
					desc        : 'DataGrid [ZONES]',
					verbose     : false,
					column      :  
						[
							'0',
							'Zone',
							'Actions',
						]
				}   

				await fonction.dataGridHeaders(oDataGrid); 
			})
			
			test ('Button [CREER] - Is Visible', async () => {
				await pageRefEmpla.buttonZones.hover();
				await pageRefEmpla.buttonCreerZone.isVisible().then(async (isVisible) => {
					expect(isVisible).toBe(true);
				})
			})

			test ('Button [MODIFIER] - Is Visible', async () => {
				await pageRefEmpla.buttonZones.hover();
				await pageRefEmpla.buttonModifierZone.isVisible().then(async (isVisible) => {
						expect(isVisible).toBe(true);
				})
			})  
			
			test ('Button [SUPPRIMER] - Is Visible', async () => {
				await pageRefEmpla.buttonZones.hover();
				await pageRefEmpla.buttonSupprimerZone.isVisible().then(async (isVisible) => {
						expect(isVisible).toBe(true);
				})
			})                  
				
			test.describe ('Popin [CREATION D\'UNE ZONE] - Visible', async () => {

				test ('Button [ZONES][1] - Click', async () => {
					await pageRefEmpla.buttonZones.hover().then(async () =>{
						await fonction.clickElement(pageRefEmpla.buttonCreerZone);  
					});                        
				})

				test ('Button, input and link [Is - visble] - Check', async () => {
					await fonction.popinVisible(page, 'CREATION D\'UNE ZONE', true);

					await fonction.isDisplayed(pageRefEmpla.pInputDesignation);
					await fonction.isDisplayed(pageRefEmpla.pButtonEnregistrer);
					await fonction.isDisplayed(pageRefEmpla.pLinkAnnuler);            
				})

				test ('Link [ANNULER] - Click', async () => {
					await fonction.clickElement(pageRefEmpla.pLinkAnnuler);
				})

				test ('Popin [CREATION D\'UNE ZONE] - Check', async () => {
					await fonction.popinVisible(page, 'CREATION D\'UNE ZONE', false); 
				})              
			})

			test.describe ('Popin [CREATION D\'UNE ALLEE DE STOCKAGE] - Visible', async () => {

				test ('Button [ALLEES] - Click', async () => {
					await pageRefEmpla.buttonAllees.hover().then(async () =>{
						await fonction.clickElement(pageRefEmpla.buttonCreerAllee);  
					})                       
				})

				test ('Button, input and link [Is - visble] - Check', async () => {
					await fonction.popinVisible(page, 'CREATION D\'UNE ALLEE DE STOCKAGE', true);

					await fonction.isDisplayed(pageRefEmpla.pInputDesignationAllee);
					await fonction.isDisplayed(pageRefEmpla.pButtonEnregistrer);
					await fonction.isDisplayed(pageRefEmpla.pLinkAnnuler);            
				})

				test ('Link [ANNULER] - Click', async () => {
					await fonction.clickElement(pageRefEmpla.pLinkAnnuler);
				})

				test ('Popin [CREATION D\'UNE ALLEE DE STOCKAGE] - Check', async () => {
					await fonction.popinVisible(page, 'CREATION D\'UNE ALLEE DE STOCKAGE', false); 
				})              
			})

			test.describe ('Popin [CREATION D\'UN EMPLACEMENTS] - Visible', async () => {

				test ('Button [EMPLACEMENTS] - Click', async () => {
					await pageRefEmpla.buttonEmplacements.hover().then(async () =>{
						await fonction.clickAndWait(pageRefEmpla.buttonCreerEmplacemt, page);  
					})                       
				})

				test ('Button, dropdown, input and link [Is - visble] - Check', async () => {
					await fonction.popinVisible(page, 'CREATION D\'UN EMPLACEMENTS', true);

					await fonction.isDisplayed(pageRefEmpla.pPdropdownZone);
					await fonction.isDisplayed(pageRefEmpla.pPdropdownAllee);
					await fonction.isDisplayed(pageRefEmpla.pInputEmplacement);
					await fonction.isDisplayed(pageRefEmpla.pDropdownOrdreAffichage);
					await fonction.isDisplayed(pageRefEmpla.pInputCapaciteMax);
					await fonction.isDisplayed(pageRefEmpla.pDropdownCategorie);
					await fonction.isDisplayed(pageRefEmpla.pDropdownUsage);
					await fonction.isDisplayed(pageRefEmpla.pDropdownNiveau);
					await fonction.isDisplayed(pageRefEmpla.pSwitchButtonDimPerso);
					await fonction.isDisplayed(pageRefEmpla.pInputLongueur);
					await fonction.isDisplayed(pageRefEmpla.pInputLargeur);
					await fonction.isDisplayed(pageRefEmpla.pInputHauteur);
					await fonction.isDisplayed(pageRefEmpla.pInputActif);
					await fonction.isDisplayed(pageRefEmpla.pButtonEnregistrer);
					await fonction.isDisplayed(pageRefEmpla.pLinkAnnuler);            
				})

				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickElement(pageRefEmpla.pLinkAnnuler);
				})

				test ('Popin [CREATION D\'UN EMPLACEMENTS] - Check', async () => {
					await fonction.popinVisible(page, 'CREATION D\'UN EMPLACEMENTS', false); 
				})              
			}) 

		})	// End ONGLET 

		test.describe ('Onglet [RANGEMENT]', async () => {        
			test ('Onglet [RANGEMENT] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'rangement', page);
			})   

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Button [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageRefRangement.buttonModifier);
			})      

			test ('DataGrid [RANGEMENT] [Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageRefRangement.dataGridRangement,    
					desc        : 'DataGrid [RANGEMENT]',
					verbose     : false,
					column      :   
						[
							'Chemin de picking',
							'Politique de rangement',
							'Zones de rangement',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			}) 
		})	// End ONGLET

		test.describe ('Onglet [PLAN PLATEFORME]', async () => {        
			
			test ('Onglet [PLAN PLATEFORME] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'planPlateforme', page);
			})   

			test ('Alert [Is - visble] - Check', async () => {
				var isPresent = await page.locator('div.alert').first().isVisible();
				test.skip(isPresent === true)
			})     
			
			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Button [IMPORTER UN PLAN PLATEFORME] - Is Visible', async () => {                         
				await fonction.isDisplayed(pageRefPlan.buttonImporterUnPlan); 
			}) 

			test ('Button [EXPORTER UN PLAN PLATEFORME] - Is Visible', async () => {                         
				await fonction.isDisplayed(pageRefPlan.buttonExporterUnPlan); 
			}) 
			
			test ('DataGrid [HISTORIQUE DES IMPORTS] [Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageRefPlan.dataGridHistoriqueImports,    
					desc        : 'DataGrid [HISTORIQUE DES IMPORTS]',
					verbose     : false,
					column      :   
						[
							'0',
							'Date import',
							'Plateforme',
							'Utilisateur',
							'Commentaire',
							'Import',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			}) 

		})	// End ONGLET              

		test.describe ('Onglet [PARAMETRES DES REFUS D\'AGREAGE]', async () => {        
			
			test ('Onglet [PARAMETRES DES REFUS D\'AGREAGE] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'paramRefusAgreage', page);
			})   

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Button, listBox and input [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageRefRefus.buttonEnregistrer);
				await fonction.isDisplayed(pageRefRefus.listBoxImprimOrdreDepl);        
				await fonction.isDisplayed(pageRefRefus.listBoxImprimPaletteRefus);        
				await fonction.isDisplayed(pageRefRefus.listBoxImprimReliquatRefus);        
				await fonction.isDisplayed(pageRefRefus.inputEmplDeposePaletteRefus);        
				await fonction.isDisplayed(pageRefRefus.inputImpressionEtiqPalette);
			})       
		})	// End ONGLET 

		test.describe ('Onglet [PARAMETRES D\'IMPRESSION]', async () => {        
			
			test ('Onglet [PARAMETRES D\'IMPRESSION] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'parametres', page);
			})   

			test ('Button and listBox [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageRefParamImp.buttonEnregistrer);
				await fonction.isDisplayed(pageRefParamImp.listBoxImprimFeuilles);
				await fonction.isDisplayed(pageRefParamImp.listBoxImprimEtiquettes);
				await fonction.isDisplayed(pageRefParamImp.listBoxImprimEtiquettesReduit);
			}) 
		})	// End ONGLET                           
		
	})  //-- End Page

	test.describe ('Page [ADMIN]', async () => {    

		var sNomPage = 'admin';

		test ('Page [ADMIN] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		test.describe ("Onglet [ADMINISTRATION]", async() => {

			test("Onglet [ADMINISTRATION] - Click ", async() => {
				await menu.clickOnglet(sNomPage, 'administration', page);
			})
		})

		test.describe ("Onglet [TRANSITE]", async() => {

			test("Onglet [TRANSITE] - Click ", async() => {
				await menu.clickOnglet(sNomPage, 'transit', page);
			})
		})

		test.describe ("Onglet [STOCK MOBILE]", async() => {

			test("Onglet [STOCK MOBILE] - Click ", async() => {
				await menu.clickOnglet(sNomPage, 'stockMobile', page);
			})
		})

		test.describe ("Onglet [PARAMETRE GROUPE ARTICLE PLATEFORME]", async() => {

			test("Onglet [PARAMETRE GROUPE ARTICLE PLATEFORME] - Click ", async() => {
				await menu.clickOnglet(sNomPage, 'parametre', page);
			})

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Ipnut and button [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageRefArticle.inputPlateForme);
				await fonction.isDisplayed(pageRefArticle.inputGroupeArticle);
				await fonction.isDisplayed(pageRefArticle.buttonEnregistrerParam);
			})

			test ('DataGrid [PARAMETRE GROUPE ARTICLE] [Is - visble] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageRefArticle.dataGridParametreGArticle,    
					desc        : 'DataGrid [GROUPE ARTICLES]',
					verbose     : false,
					column      :   
						[
							'Plateforme',
							'Groupe article',
							'Inventaire prérenseigné',
							'Saisie du poids en réception',
							'Mission de réapprovisionnement de picking',
							'Contrôle des dimensions colis',
							'Saisie de la température obligatoire'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
		})

		test.describe ("Onglet [CHANGELOG]", async() => {

			test("Onglet [CHANGELOG] - Click ", async() => {
				await menu.clickOnglet(sNomPage, 'changelog', page);
			})
		})

		test.describe ("Onglet [COMMUNICATION UTILISATEURS]", async() => {

			test("Onglet [COMMUNICATION UTILISATEURS] - Click ", async() => {
				await menu.clickOnglet(sNomPage, 'commuUtilisateur', page);
			})
		})

		test.describe ("Onglet [CATEGORIE EMPLACEMENT]", async() => {

			test("Onglet [CATEGORIE EMPLACEMENT] - Click ", async() => {
				await menu.clickOnglet(sNomPage, 'categorieEmplacement', page);
			})

			test ('Error Message - Is Hidden', async () => {
				await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
			}) 

			test ('Button [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageAdminCategorie.buttonCreer);
				await fonction.isDisplayed(pageAdminCategorie.buttonModifier);
			})

			test ('DataGrid [CATEGORIE EMPLACEMENT] [Is - visble] - Check', async () => {
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
		})
	})  //-- End Page

	test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})