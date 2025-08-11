/**
 * @author Josias SIE, JC CALVIERA, Vazoumana Diarrassouba
 */

const xRefTest      = "MAG_IHM_GLB";
const xDescription  = "Examen de l'IHM de l'application SIGALE Magasin";
const xIdTest       =  428;
const xVersion      = '3.54';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'MAGASIN',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['ville', 'langue'],
	fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page, expect }          from '@playwright/test';

import { Help }                             from '@helpers/helpers';
import { TestFunctions }                    from '@helpers/functions';
import { Log }                              from '@helpers/log';

import { GlobalConfigFile }                 from '@conf/commun.conf';

import { AutoComplete, CartoucheInfo, TypeListOfElements } from '@commun/types';

// Pages Object ---------------------------------------------------------------------
import { MenuMagasin }                      from '@pom/MAG/menu.page';

import { AccueilCommandes}                  from '@pom/MAG/accueil-commandes.page';
import { AccueilEngagements }               from '@pom/MAG/accueil-engagements.page';

import { CommandesCommande }                from '@pom/MAG/commandes-commande.page';
import { CommandesCommandeDirecte }         from '@pom/MAG/commandes-commande_directe.page';
import { CommandesEngagements }             from '@pom/MAG/commandes-engagements.page';
import { CommandesOpportunites }            from '@pom/MAG/commandes-opportunites.page';
import { CommandesCommandeSelonModele }     from '@pom/MAG/commandes-commande_selon_modele.page';

import { StockLivraison }                   from '@pom/MAG/stock-livraisons.page';    
import { StockStock }                       from '@pom/MAG/stock-stock.page';  
import { StockStockASurveiller }            from '@pom/MAG/stock-stock_a_surveiller.page';      
import { StockCasse }                       from '@pom/MAG/stock-casse.page';  
import { StockDons }                        from '@pom/MAG/stock-dons.page';  
import { StockHistorique }                  from '@pom/MAG/stock-historique.page'; 
import { Stockimplantation }                from '@pom/MAG/stock-implantation.page';      
import { StockStockFinJournee }             from '@pom/MAG/stock-stock_fin_journee.page';      

import { PrixGestion }                      from '@pom/MAG/prix-gestion.page';  
import { PrixImpressionEtiquettes }         from '@pom/MAG/prix-impression_etiquettes.page';  

import { FacturationBlDefinitif }           from '@pom/MAG/facturation-bl_definitif.page'; 
import { FaturationDemandeAvoir }           from '@pom/MAG/facturation-demande_avoir.page'; 
import { FacturationDemandeEchange }        from '@pom/MAG/facturation-demande_echange.page';     

import { VentesJournee }                    from '@pom/MAG/ventes-journee.page';          
import { VentesEvenementsExceptionneles }   from '@pom/MAG/ventes-evenements_exceptionneles.page';

import { EmballagesStock }                  from '@pom/MAG/emballages-stock.page';  
import { EmballagesSuivi }                  from '@pom/MAG/emballages-suivi.page';  

import { ReferentielModifierEngagements }   from '@pom/MAG/referentiel-modifier-engagements.page';
import { ReferentielSupprimerCdes }         from '@pom/MAG/referentiel-supprimer-cdes.page';
import { ReferentielRenvoyerCdes }          from '@pom/MAG/referentiel-renvoyer-cdes.page';
import { ReferentielUtilisateurs }          from '@pom/MAG/referentiel-utilisateurs.page';
import { ReferentielStockDlc }              from '@pom/MAG/referentiel_stock-DLC.page';
import { ReferentielLDV }                   from '@pom/MAG/referentiel-LDV.page';
import { ReferentielExecutors }             from '@pom/MAG/referentiel-executors.page';
import { ReferentielParametrage }           from '@pom/MAG/referentiel-parametrage.page';
import { ReferentielVerrous }               from '@pom/MAG/referentiel-verrous.page';

import { AutorisationsLivraisonsDirectes }  from '@pom/MAG/autorisations-livraisons_directes.page';  
import { AutorisationsAchatsCentrale  }     from '@pom/MAG/autorisations-achats_centrale.page';  
import { AutorisationsModelesAssortiment}   from '@pom/MAG/autorisations-modeles_assortiment.page';  
import { AutorisationsEngagements }         from '@pom/MAG/autorisations-engagements.page';  
import { AutorisationsOppotunites }         from '@pom/MAG/autorisations-opportunites.page';  
import { AutorisationsModelesCommande }     from '@pom/MAG/autorisations-modeles_commande.page';      
import { AutorisationsParametrage }         from '@pom/MAG/autorisations-parametrage.page';  
import { AutorisationsBlocage }             from '@pom/MAG/autorisations-blocage.page';  
import { AutorisationsEchanges }            from '@pom/MAG/autorisations-echanges.page';  
import { AutorisationsGroupeMagasins }      from '@pom/MAG/autorisations-groupe_magasins.page';
import { AutorisationsGammes } 			    from '@pom/MAG/autorisations-gammes.page';
import { AutorisationsRecomOuverture }      from '@pom/MAG/autorisations-recommandations_ouverture.page';
import { AutorisationsPrixLocaux}           from '@pom/MAG/autorisations-prix_locaux.page';    
import{ AutorisationsActualite }            from '@pom/MAG/autorisations-actualite.page';

import { AlertesSuivi }                     from '@pom/MAG/alertes-suivi.page'; 
import { AlertesHistoriqueCentrale }        from '@pom/MAG/alertes-historique_centrale.page'; 
import { AlertesModeleAlertes }             from '@pom/MAG/alertes-modele_alertes.page'; 
import { AlertesSuiviInfoQualite }          from '@pom/MAG/alertes-suivi_infos_qualite.page'; 
import { AltertesTraitement }               from '@pom/MAG/alertes-traitement.page'; 
import { AlertesHistoriqueMagasin }         from '@pom/MAG/alertes-historique_magasin.page'; 
import { AlertesInfosQualite }              from '@pom/MAG/alertes-infos_qualite.page'; 

import { Preparation  }                     from '@pom/MAG/preparation.page'; 
import { TableauDeBord }                    from '@pom/MAG/tableau-de-bord.page';
import { Communication }                    from '@pom/MAG/communication.page';
import { GenerationAutomatique }            from '@pom/MAG/generation-automatique.page';
import { SuiviGenerationsAC }               from '@pom/MAG/suivi-generations-ac.page';

import { AccueilActualites } 				from '@pom/MAG/accueil-actualites.page';
import { AccueilSuiviEngagements } 			from '@pom/MAG/accueil-suivi_engagements.page';

//------------------------------------------------------------------------------------

let page                      : Page;
let menu                      : MenuMagasin;
let GlobalData                : GlobalConfigFile;

// Pages Object ---------------------------------------------------------------------
let pageAccueilCom            : AccueilCommandes;
let pageAccueilEng            : AccueilEngagements;
let pageAccueilAct			  : AccueilActualites;
let pageAccueilSEng	  		  : AccueilSuiviEngagements;

let pageCmd     	          : CommandesCommande;
let pageCmdASP                : CommandesCommandeDirecte;
let pageCmdEng                : CommandesEngagements;
let pageCmdOpp                : CommandesOpportunites;
let pageCmdSelMod             : CommandesCommandeSelonModele;

let pageStockLivraison        : StockLivraison;    
let pageStockStock	          : StockStock;  
let pageStockStockAno         : StockStockASurveiller;      
let pageStockCasse	          : StockCasse;  
let pageStockDons	          : StockDons;  
let pageStockHisto	          : StockHistorique; 
let pageStockImplant          : Stockimplantation;      
let pageStockFinJournee       : StockStockFinJournee;      

let pagePrix     	          : PrixGestion;  
let pageEtiquettes            : PrixImpressionEtiquettes;  

let pageFactuDefintestif      : FacturationBlDefinitif; 
let pageFactuAvoir	          : FaturationDemandeAvoir; 
let pageFactuEchange          : FacturationDemandeEchange;          

let pageVenteJournee          : VentesJournee;          
let pageVenteEvExcep	      : VentesEvenementsExceptionneles;

let pageEmballageBon          : EmballagesStock;  
let pageEmballageSuivi        : EmballagesSuivi;  

let pageAutoAchSurPlace       : AutorisationsLivraisonsDirectes;  
let pageAutoAchCentrale       : AutorisationsAchatsCentrale;  
let pageAutoModAss            : AutorisationsModelesAssortiment;  
let pageAutoEng               : AutorisationsEngagements;  
let pageAutoOpp               : AutorisationsOppotunites;  
let pageAutoModele            : AutorisationsModelesCommande;      
let pageAutoParam             : AutorisationsParametrage;  
let pageAutoBlocage           : AutorisationsBlocage;  
let pageAutoEchange           : AutorisationsEchanges;  
let pageAutoGrpMag            : AutorisationsGroupeMagasins;
let pageAutoGammes            : AutorisationsGammes;
let pageAutoRecomOuvert       : AutorisationsRecomOuverture;
let pageAutoPrixLocaux        : AutorisationsPrixLocaux;      
let pageAutorisationsActualite: AutorisationsActualite;

let pageAlerteSuivi           : AlertesSuivi; 
let pageAlerteHisto           : AlertesHistoriqueCentrale; 
let pageModeleAlertes         : AlertesModeleAlertes; 
let pageModeleSuiviInfos      : AlertesSuiviInfoQualite; 
let pageAlerteTrait           : AltertesTraitement; 
let pageAlerteHistoMag        : AlertesHistoriqueMagasin; 
let pageAlerteInfos           : AlertesInfosQualite; 

let pagePreparation           : Preparation; 

let pageTableauDeBord         : TableauDeBord;

let pageStockDLC              : ReferentielStockDlc;
let pageLDV                   : ReferentielLDV;
let pageRenvoyerCdes          : ReferentielRenvoyerCdes;
let pageSupprimerCdes         : ReferentielSupprimerCdes;
let pageModifEngagements      : ReferentielModifierEngagements;
let pageReferentielUser       : ReferentielUtilisateurs;
let pageRefExecutor           : ReferentielExecutors;
let pageRefParametrage        : ReferentielParametrage;
let pageReferentielVerrous    : ReferentielVerrous;

let pageCommunication         : Communication;

let pageGenerAuto             : GenerationAutomatique;

let pageSuiviGenerAC          : SuiviGenerationsAC;

//------------------------------------------------------------------------------------

const log               = new Log();
const fonction          = new TestFunctions(log);

fonction.recordDatas(false);		//-- Inutile de créer une fiche de données

// Chargement paramètres globaux
GlobalData              = new GlobalConfigFile();
var globalData          = GlobalData.getData();

// Variables -------------------------------------------------------------------------

const aIdGroupeArticle  = ['15', '00'];             // Liste des cas de tests examinés (Groupe Aricle = "Consommable" puis "FL")

let villeCible:string	= fonction.getInitParam('ville', 'Malemort (G914)');
const sLangue:string    = fonction.getInitParam('langue', 'fr');

var groupeArticle:string 			= 'Fruits et légumes';
var groupeArticleMaree:string 		= 'Marée';
var groupeArticleCoupeCorner:string	= 'Coupe / Corner';
var cible:string           			= 'Crèmerie CPE';
var sCibleNomLong:string			= 'Crèmerie CPE (Coupe / Corner)';
var sTradLivraisonDirectes:string 	= 'Livraisons directes';

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {

  page                  = await browser.newPage();
 
  pageAlerteSuivi       = new AlertesSuivi(page);
  pageAlerteHisto       = new AlertesHistoriqueCentrale(page);
  pageModeleAlertes     = new AlertesModeleAlertes(page);
  pageModeleSuiviInfos  = new AlertesSuiviInfoQualite(page);
  pageAlerteTrait       = new AltertesTraitement(page);
  pageAlerteHistoMag    = new AlertesHistoriqueMagasin(page);
  pageAlerteInfos       = new AlertesInfosQualite(page);

  pagePreparation       = new Preparation(page);

  pageAutoPrixLocaux    = new AutorisationsPrixLocaux(page);
  pageAutoGrpMag        = new AutorisationsGroupeMagasins(page);
  pageAutoEchange       = new AutorisationsEchanges(page);
  pageAutoBlocage       = new AutorisationsBlocage(page);
  pageAutoParam         = new AutorisationsParametrage(page);
  pageAutoModele        = new AutorisationsModelesCommande(page);
  pageAutoOpp           = new AutorisationsOppotunites(page);
  pageAutoEng           = new AutorisationsEngagements(page);
  pageAutoModAss        = new AutorisationsModelesAssortiment(page);
  pageAutoAchCentrale   = new AutorisationsAchatsCentrale(page);
  pageAutoAchSurPlace   = new AutorisationsLivraisonsDirectes(page);
  pageAutoGammes        = new AutorisationsGammes(page);
  pageAutoRecomOuvert   = new AutorisationsRecomOuverture(page);

  pageEmballageSuivi    = new EmballagesSuivi(page);
  pageEmballageBon      = new EmballagesStock(page);

  pageVenteEvExcep      = new VentesEvenementsExceptionneles(page);
  pageVenteJournee      = new VentesJournee(page);

  pageFactuEchange      = new FacturationDemandeEchange(page);
  pageFactuAvoir        = new FaturationDemandeAvoir(page);
  pageFactuDefintestif  = new FacturationBlDefinitif(page);

  pageEtiquettes        = new PrixImpressionEtiquettes(page);
  pagePrix              = new PrixGestion(page, fonction);

  pageStockFinJournee   = new StockStockFinJournee(page);
  pageStockImplant      = new Stockimplantation(page);
  pageStockHisto        = new StockHistorique(page);
  pageStockDons         = new StockDons(page);
  pageStockCasse        = new StockCasse(page);
  pageStockStockAno     = new StockStockASurveiller(page);
  pageStockStock        = new StockStock(page, fonction);
  pageStockLivraison    = new StockLivraison(page);

  pageCmdSelMod         = new CommandesCommandeSelonModele(page);
  pageCmdOpp            = new CommandesOpportunites(page);
  pageCmdEng            = new CommandesEngagements(page);
  pageCmdASP            = new CommandesCommandeDirecte(page);
  pageCmd               = new CommandesCommande(page);

  pageAccueilEng        = new AccueilEngagements(page);
  pageAccueilCom        = new AccueilCommandes(page);
  pageAccueilAct		= new AccueilActualites(page);
  pageAccueilSEng		= new AccueilSuiviEngagements(page);

  pageTableauDeBord     = new TableauDeBord(page);

  pageStockDLC          = new ReferentielStockDlc(page);
  pageLDV               = new ReferentielLDV(page);
  pageRenvoyerCdes      = new ReferentielRenvoyerCdes(page);
  pageSupprimerCdes     = new ReferentielSupprimerCdes(page);
  pageModifEngagements  = new ReferentielModifierEngagements(page);
  pageRefExecutor       = new ReferentielExecutors(page);
  pageRefParametrage    = new ReferentielParametrage(page);
  pageReferentielUser   = new ReferentielUtilisateurs(page);
  pageReferentielVerrous= new ReferentielVerrous(page);

  pageCommunication		= new Communication(page);

  pageGenerAuto			= new GenerationAutomatique(page);

  pageSuiviGenerAC		= new SuiviGenerationsAC(page);
  pageAutorisationsActualite= new AutorisationsActualite(page);

  menu					= new MenuMagasin(page,fonction);  
  await menu.searchNewElements(testInfo);

  const helper			= new Help(info, testInfo, page);
  await helper.init();

});

//------------------------------------------------------------------------------------

test.beforeEach(async ({}, testInfo) => {
	await fonction.trace(testInfo);
	await fonction.checkConsole(page, testInfo, false);
})

test.afterAll(async ({}, testInfo) => {
	await menu.showNewElements();
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', async () => {

	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();		
		await fonction.openUrl(page);
	});

	test ('Connexion', async () => {
		await fonction.connexion(page);
		await menu.removeArlerteMessage(page);

		if (sLangue !== 'fr') {
			await menu.selectLang(sLangue);
			fonction.setCheckTraductions(true);
			if (sLangue === 'it') {
				groupeArticle 				= "Frutta e verdura";
				groupeArticleMaree 			= "Pescato";
				sCibleNomLong 				= "Crèmerie CPE (Taglio / Angolo)";
				groupeArticleCoupeCorner	= 'Taglio / Angolo';
				sTradLivraisonDirectes		= 'Consegne dirette';
			}
		}

    });
    
    test.describe ('Page [ACCUEIL]', async () => {

		var pageName = 'accueil';

		test.describe ('Onglet [ETAT DES COMMANDES]', async () => {

			//-- Message d'avertissement (Check Browser) spécifique à l'application SIGALE Magasin
			//-- Click sur le lien de confirmation pour faire disparaître le message d'alerte 
			test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
				 var isVisible = await menu.linkBrowserSecurity.isVisible();
				 if (isVisible) {
					var isActive = await menu.linkBrowserSecurity.isEnabled();
					if(isActive){
						await fonction.clickElement(menu.linkBrowserSecurity);
					}
				 }
			})

			test ('Popin [ACCUEIL] - Click', async () => {
				await menu.removeArlerteMessage(page);
			})
			
			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('ListBox [VILLE] = "' + villeCible + '"', async () => {
				await menu.selectVille(villeCible, page);
			})

			test ('Button, datePicker [ACTUALISER][DATE COMMANDE] - Check', async () => {
				await fonction.isDisplayed(pageAccueilCom.buttonActualiser);
				await fonction.isDisplayed(pageAccueilCom.datePicker);
			});
	
			test ('DataGrid [LISTES ASSORTIMENTS] - Check', async () => {
				var oDataGrid:TypeListOfElements = {
					element     : pageAccueilCom.thHeaderAssortiments,    
					desc        : 'DataGrid [LISTES ASSORTIMENTS]',
					verbose     : false,
					column      :   
						[
							'Groupe article',
							'Assortiment',
							'Statut',
							'Nombre de magasins',
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			});

			test ('DataGrid [LIEUX DE VENTES] - Check', async () => {
				var oDataGrid:TypeListOfElements = {
					element     : pageAccueilCom.thHeaderlieuxDeVentes,    
					desc        : 'DataGrid [LIEUX DE VENTES]',
					verbose     : false,
					column      :   
						[
							'Code',
							'Désignation',
							'Externe',
							'Région géographique',
							'Secteur',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			});

		}); // Onglet ETAT DES COMMANDES

		test.describe ('Onglet [ETAT DES ENGAGEMENTS]', async () => {
	
			test ('Onglet [ETAT DES ENGAGEMENTS] - Click', async () => {
				await menu.clickOnglet(pageName, 'etatEngagements', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('CheckBox [ENGAGEMENT EN COURS DE SAISIE] - Is Visible', async () => {
				await fonction.isDisplayed(pageAccueilEng.checkBoxEngaEnCours);
			})
	
			test ('CheckBox [ENGAGEMENT SPECIFIQUE] - Is Visible', async () => {
				await fonction.isDisplayed(pageAccueilEng.checkBoxEngaSpecifique);
			})
	
			test ('CheckBox [ENGAGEMENT AVEC EXPEDITION SUR LA PERIODE] - Is Visible', async () => {
				await fonction.isDisplayed(pageAccueilEng.checkBoxEngaExpedPeriode);
			})

			test ('DatePicker [ENGAGEMENT] - Is Visible', async () => {            
				await fonction.isDisplayed(pageAccueilEng.datePickerEngagSpecifique);
			})

			test ('Button [VISUALISER] - Is Visible', async () => {            
				await fonction.isDisplayed(pageAccueilEng.buttonActualiser);
			})

			test ('inputField [ENGAGEMENT] - Is Visible', async () => {            
				await fonction.isDisplayed(pageAccueilEng.inputEngaSpecifique);
			})

			test ('DataGrid [LISTES ASSORTIMENTS][2] - Check', async () => {
				var oDataGrid:TypeListOfElements = {
					element     : pageAccueilEng.dataGridAssortiments,    
					desc        : 'DataGrid [LISTES ASSORTIMENTS]',
					verbose     : false,
					column      :   
						[
							'Groupe article',
							'Assortiment',
							'Statut',
							'Nombre de magasins',
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			})

			test ('DataGrid [LISTES ASSORTIMENTS][3] - Check', async () => {	
				var oDataGrid:TypeListOfElements = {
					element     : pageAccueilEng.dataGridMagasins,    
					desc        : 'DataGrid [LISTES ASSORTIMENTS]',
					verbose     : false,
					column      :   
						[
							'Code',
							'Désignation',
							'Externe',
							'Région géographique',
							'Secteur',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);   
			})

		}); // Onglet ETAT DES ENGAGEMENTS

		test.describe ('Onglet [METEO]', async () => {
		
			test ('Onglet [METEO] - Click', async () => {
				await menu.clickOnglet(pageName, 'meteo', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

		}); // Onglet METEO

		test.describe ('Onglet [ACTUALITES]', async () => {
			
			test ('Onglet [ACTUALITES] - Click', async () => {
				await menu.clickOnglet(pageName, 'actualites', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Input [RECHERCHER UNE ACTUALITE] - Is Visible', async () => {
				await fonction.isDisplayed(pageAccueilAct.inputRecherche);
			})

			test ('DatePicker [DATE DE DIFFUSION] - Is Visible', async () => {
				await fonction.isDisplayed(pageAccueilAct.datePickerActSpecifique);
			})

			test ('Select [TAGS] - Is Visible', async () => {
				await fonction.isDisplayed(pageAccueilAct.selectTags);
			})

			test ('Button [NON ARCHIVEES] - Is Visible', async () => {
				await fonction.isDisplayed(pageAccueilAct.buttonNonArchivees);
			})

			test ('Button [ARCHIVEES] - Is Visible', async () => {
				await fonction.isDisplayed(pageAccueilAct.buttonArchivees);
			})

			test ('Button [RECHERCHER] - Is Visible', async () => {
				await fonction.isDisplayed(pageAccueilAct.buttonRechercher);
			})

		}); // Onglet ACTUALITES

		test.describe ('Onglet [SUIVI DES ENGAGEMENTS]', async () => {

			test ('Onglet [SUIVI DES ENGAGEMENTS] - Click', async () => {
				await menu.clickOnglet(pageName, 'suiviEngagements', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			});

			test ('** Wait Until Spinner Off **', async () => {
				await fonction.waitForSpinner(pageAccueilSEng.spinner);
			});

			test('DataGrid [LISTE ARTICLES] - Check', async () => {
				var oDataGrid:TypeListOfElements = {
					element		: pageAccueilSEng.dataGridArticles,
					desc		: 'DataGrid [LISTE ARTICLES]',
					verbose		: false,
					column		:
						[
							'Groupe article 2',
							'Nom de l\'engagement 3',
							'Code article',
							'Article',
							'PVC engagement',
							'Quantité engagée',
							'Infos article',
							'Statut',
							'',
							'Période de saisie 1',
							'Période de livraison',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

		}); // Onglet SUIVI DES ENGAGEMENTS	
		
	});  // Page ACCUEIL

	test.describe ('Page [COMMANDES]', async () => { 

		var pageName = 'commandes';

		test ('Page [COMMANDES] - Click', async () => {
			await menu.click(pageName, page);
		})  

		test.describe ('Onglet [COMMANDES]', async () => {

			test ('Onglet [COMMANDE] - Click', async () => {
				await menu.clickOnglet(pageName, 'commande', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('DatePicker, input and listBox [Is visible] - Check', async () => {
				await fonction.isDisplayed(pageCmd.datePickerCommande);
				await fonction.isDisplayed(pageCmd.inputFamilleArticle);
				await fonction.checkListBox(pageCmd.listBoxGrpArticle); 
			}) 
			
			test ('Toggle Buttons [STATUT] [Is - visble] - Check', async () => {
				var oToggle = 
				{
					element     : pageCmd.toggleStatut,    
					desc        : 'Toggle Buttons [STATUT]',
					verbose     : false,
					column      :   
						[
							'À faire',
							'En cours',
							'Passée',
							'Envoyée CS',
							'Validée CS'
						]
				}
				await fonction.toggleContent(oToggle); 
			})

			test ('DataGrid [LISTES COMMANDES][1] - Check', async () => {
				var oDataGrid:TypeListOfElements = {
					element     : pageCmd.dataGridListesCmd,    
					desc        : 'DataGrid [LISTES COMMANDES]',
					verbose     : false,
					column      :   
						[
							'Commandes',
							'Statut'
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			})

			test ('DataGrid [LIGNES COMMANDES][2] - Check', async () => {
				var oDataGrid:TypeListOfElements = {
					element     : pageCmd.dataGridLignesCmd,    
					desc        : 'DataGrid [LIGNES COMMANDES]',
					verbose     : false,
					column      :  
						[
							'Univers',
							'Code',
							'Désignation',
							'Condtestionnement',
							'PVC',
							'',
							'Ventes projetées',
							'',
							'Livraison',
							'Stock',
							'Livraison + Stock',
							'Commande',
							'',
							'Commande',
							'',
							'Prévision',
							'',
							'Prév.',
							'',
							'Prév.',
							'',
						]
				}   
				//Test.dataGridHeaders(oDataGrid);
			})

			test ('Button [SAISIE STOCK EMBALLAGE][IMPRIMER][SYNTHESE GLOBALE] - Check', async () => {
				//-- Bouton Bas de page
				await fonction.isDisplayed(pageCmd.buttonSaisirStockEmb);
				await fonction.isDisplayed(pageCmd.buttonImprimer);
				await fonction.isDisplayed(pageCmd.buttonSynthese); 
			})

			test ('Button [SAISIE STOCK EMBALLAGE] - Click', async () =>  {
				await fonction.clickAndWait(pageCmd.buttonSaisirStockEmb, page);
			})

			test.describe ('Popin [SAISIR LE STOCK EMBALLAGE]', async () => {

				test ('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test ('Popin [SAISIR LE STOCK EMBALLAGE] - Is Visible', async () =>  {
					await fonction.popinVisible(page, 'SAISIR LE STOCK EMBALLAGE', true);
				})

				test ('InputField [STOCK] - Is Visible', async () =>  {				
					await fonction.isDisplayed(pageCmd.pPinputStock);
				})

				test ('Button [ENREGISTRER] - Is Visible', async () =>  {				
					await fonction.isDisplayed(pageCmd.pPbuttonEnregistrer);
				})

				test ('Link [FERMER] - Is Visible', async () =>  {				
					await fonction.isDisplayed(pageCmd.pPlinkFermer);
				})

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pageCmd.pPlinkFermer);     
				})

				test ('Popin [SAISIR LE STOCK EMBALLAGE] - Is Hidden', async () =>  {
					await fonction.popinVisible(page, 'SAISIR LE STOCK EMBALLAGE', false);
				})

			});  //-- End test.describe Popin 
   
			test.describe ('Popin [SYNTHESE GENERALE]', async () => {

				test ('Button [SYNTHESE GENERALE] - Click', async () => {
					await fonction.clickAndWait(pageCmd.buttonSynthese, page);
				})    
				
				test ('** Wait Until Spinner Off **', async () => {
					await fonction.waitForSpinner(pageCmd.pPspinnerFooterMenu);
				});  

				test ('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test ('Popin [SYNTHESE GENERALE] - Check', async () =>  {
					 await fonction.popinVisible(page, 'SYNTHESE GENERALE', true);
				})

				test ('DataGrid [SYNTHESE COMMANDES DE LA JOURNEE] - Check', async () => {
					var oDataGrid:TypeListOfElements = {
						element     : pageCmd.dataGridSyntheseCmd,    
						desc        : 'DataGrid [SYNTHESE COMMANDES DE LA JOURNEE]',
						verbose     : false,
						column      :  
							[
								'Groupe article',
								'Chiffre d\'affaire',
								'Valeur inventaire / stock théorique',
								'CA du BL',
								'Nombre de palettes',
								'Quantités',
								'Commande',
								'Prévisions',
								'Commande',
								'Prévisions',
								'Commande',
								'Prévisions',
							]
					}   
					await fonction.dataGridHeaders(oDataGrid);               
				})

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickAndWait(pageCmd.pPlinkFermerSynthese, page);     
				})

				test ('Popin [SYNTHESE GENERALE][2] - Check', async () =>  {
					await fonction.popinVisible(page, 'SYNTHESE GENERALE', false);
				})

			});  //-- End test.describe Popin  

			test ('CheckBox [*FIRST ELEMENT*] - Click', async () => {
				//-- Déplacement à une date précédente de façon a être certain d'avoir des données
				await fonction.clickElement(pageCmd.datePickerCommande);                 // dépliage calendrier
				await fonction.clickElement(pageCmd.datePickerLinkPrev);                 // bouton mois précédent du calendrier
				await fonction.clickElement(pageCmd.datePickerFirstDay);                 // premier jour du mois précédent                
				await fonction.clickElement(pageCmd.tdCommandes.first());           
			})    
								 
		});  // Onglet COMMANDES

		test.describe ('Onglet [COMMANDE DIRECTE]', async () => {

			test ('Onglet [COMMANDE DIRECTE] - Click', async () => {
				await menu.clickOnglet(pageName, 'achatSurPlace', page);        // Ex Achat Sur Place
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('DatePicker, input and button [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageCmdASP.datePickerCommande);
				await fonction.isDisplayed(pageCmdASP.datePickerLivraison);
				await fonction.isDisplayed(pageCmdASP.inputFamilleArticle);
				await fonction.checkListBox(pageCmdASP.listBoxFoursisseur);
				await fonction.isDisplayed(pageCmdASP.ButtonPlus); 
			})      

			test ('DataGrid [LISTE COMMANDES][1] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageCmdASP.dataGridListesCmd,    
					desc        : 'DataGrid [LISTE COMMANDES]',
					verbose     : false,
					column      :   
						[
							'Commandes',
							'Statut'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})  

			test ('DataGrid [LISTE COMMANDES][2] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageCmd.dataGridLignesCmd,    
					desc        : 'DataGrid [LIGNES COMMANDES]',
					verbose     : false,
					column      :  
						[
							'Code',
							'Désignation',
							'Conditionnement',
							'PVC',
							'',
							'Ventes projetées',
							'',
							'Livraison',
							'Stock',
							'Livraison + Stock',
							'Commande',
							'',
							'Prix d\'achat',
							'Unité d\'achat',
						]
				}   
				await fonction.dataGridHeaders(oDataGrid); 
			})

			test ('Button [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageCmdASP.buttonImprimer);
				await fonction.isDisplayed(pageCmdASP.buttonImprimerLaCommande);                                   
				await fonction.isDisplayed(pageCmdASP.buttonValiderEtEnvoyer);
				await fonction.isDisplayed(pageCmdASP.buttonSupprimerCommande);
			})

		});  // Onglet COMMANDE DIRECTE

		test.describe ('Onglet [ENGAGEMENTS]', async () => {     

			test ('Onglet [ENGAGEMENTS] - Click', async () =>  { 
				await menu.clickOnglet(pageName, 'engagements', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('ListBox [ENGAGEMENT] - Check', async () =>  { 
				await fonction.checkListBox(pageCmdEng.listBoxEngagement);
			})

			test ('DataGrid [LISTES COMMANDES][3] - Check', async () =>  {  
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageCmdASP.dataGridListesCmd,    
					desc        : 'DataGrid [LISTES COMMANDES]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Engagement(s)',
							'Statut',
						]
				}
			   await fonction.dataGridHeaders(oDataGrid); 
			})

		});  // Onglet ENGAGEMENT

		test.describe ('Onglet [OPPORTUNITES]', async () => {     

			test ('Onglet [OPPORTUNITES] - Click', async () => {     
				await menu.clickOnglet(pageName, 'opportunites', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Button, inputField and listBox [Is - visible]- Check', async () => {  
				await fonction.isDisplayed(pageCmdOpp.buttonEnvoyerLaCommande);
				await fonction.isDisplayed(pageCmdOpp.buttonEnvoyerLaCommande);
				await fonction.isDisplayed(pageCmdOpp.inputFamilleArticle);
				await fonction.checkListBox(pageCmdOpp.listBoxGroupeArticle);
				await fonction.checkListBox(pageCmdOpp.listBoxStatus);
			})

			test ('DataGrid [LISTES OPPORTUNITES] - Check', async () => {    
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageCmdOpp.dataGridListesCmd,    
					desc        : 'DataGrid [LISTES OPPORTUNITES]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Opportunité(s)',
							'Statut',
							''
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			test ('DataGrid [LISTES LIGNES OPPORTUNITES] - Check', async () => {    
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageCmdOpp.dataGridLignesCmd,    
					desc        : 'DataGrid [LISTES LIGNES OPPORTUNITES]',
					verbose     : false,
					column      :   
						[
							'Univers',
							'Code',
							'Désignation',
							'Conditionnement',
							'Prix de cession',
							'PVC',
							'Ventes projetées',
							'',
							'Livraison',
							'Stock',
							'Livraison + Stock',
							'Cde déjà passée',
							'Cde',
							'',
							'',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
	
		}); // Onglet OPPORTUNITES        

		test.describe ('Onglet [COMMANDE SELON MODELE]', async () => {     
		   
			test ('Onglet [COMMANDE SELON MODELE] - Click', async () => { 
				await menu.clickOnglet(pageName, 'commandeSelonModele', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Button, datePicker and listBox [Is - visible] - Check', async () => { 
				await fonction.isDisplayed(pageCmdSelMod.buttonCreer);
				await fonction.isDisplayed(pageCmdSelMod.buttonRechercher);
				await fonction.isDisplayed(pageCmdSelMod.datePickerFrom);
				await fonction.isDisplayed(pageCmdSelMod.datePickerTo);
				await fonction.checkListBox(pageCmdSelMod.listBoxMagasin);
				await fonction.checkListBox(pageCmdSelMod.listBoxGroupeArticle);
			})

			test ('DataGrid [LISTES COMMANDES][4] - Check', async () => {   
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageCmdSelMod.dataGridCommandes,    
					desc        : 'DataGrid [LISTES COMMANDES]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Date d\'expédition',
							'Code magasin',
							'Magasin',
							'Groupe article',
							'Commande selon modèle',
							'Société',
							'Statut',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			test ('Button [CREER] - Click', async () => {
				await fonction.clickAndWait(pageCmdSelMod.buttonCreer, page);
			})
	
			test.describe ('Popin [CREATION COMMANDE SELON MODELE]', async () => {

				test ('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test ('Button, datePicker, link, input and listBox [Is - visible] - Check', async () => {
					await fonction.popinVisible(page, 'CREATION COMMANDE SELON MODELE', true);
					await fonction.isDisplayed(pageCmdSelMod.pButtonCreeCommande);
					await fonction.isDisplayed(pageCmdSelMod.pButtonEnregistrer);
					await fonction.isDisplayed(pageCmdSelMod.pButtonEnvoyer);
					await fonction.isDisplayed(pageCmdSelMod.pDatePickerExpedition);
					await fonction.isDisplayed(pageCmdSelMod.pLinkAnnuler);
					await fonction.isDisplayed(pageCmdSelMod.pInputFieldMagasin);
					await fonction.isDisplayed(pageCmdSelMod.pInputFieldArticle);                
					await fonction.checkListBox(pageCmdSelMod.pListBoxModele);
				})

				test ('Link [ANNULER] - Click', async () => {
					await fonction.clickElement(pageCmdSelMod.pLinkAnnuler);
				})

				test ('Popin[CREATION COMMANDE SELON MODELE] - Check', async () => {
					await fonction.popinVisible(page, 'CREATION COMMANDE SELON MODELE', false);      
				})    

			})  // End test.describe Popin

		})  // Onglet COMMANDE SELON MODELE

	});  // Page COMMANDE

	test.describe ('Page [STOCK]', async () => {

		var currentPage = 'stock'; 

		test ('Page [STOCK] - Click', async () => {
			await menu.click(currentPage, page);
		})    

		test ('Message [ERREUR] - Is Not Visible', async () => {
			await fonction.isErrorDisplayed(false, page);
		}) 

		test.describe ('Onglet [LIVRAISONS]', async () => {

			test ('Onglet [LIVRAISONS] - Click', async () => {
				await menu.clickOnglet(currentPage, 'livraisons', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('DatePicker [LIVRAISON] - Check', async () => {
				await fonction.isDisplayed(pageStockLivraison.datePickerLivraison);
			}) 
			
			test ('DataGrid [LISTES LIVRAISONS] - Check', async () => {
				var dataGridListesCmd = 
				{
					element     : pageStockLivraison.dataGridListesLivraisons,    
					desc        : 'DataGrid [LISTES LIVRAISONS]',
					verbose     : false,
					column      :   
						[
							'Groupe',
							'Date du BL',
							'Numéro de BL',
							'Type',
							'CR effectué',
							'Statut',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(dataGridListesCmd); 
			}) 

			test ('Button [IMPRIMER UN BL][IMPRIMER LES ECARTS][ENREGISTRER][ENREGISTRER ET ENVOYER] - Check', async () => {
				//-- Bouton Bas de page
				await fonction.isDisplayed(pageStockLivraison.buttonImprimerBl);
				await fonction.isDisplayed(pageStockLivraison.buttonImprimerEcarts);
				await fonction.isDisplayed(pageStockLivraison.buttonEnregistrer);
				await fonction.isDisplayed(pageStockLivraison.buttonEnregistrerEnvoyer);
				//Test.isDisplayed('Button [RAS]',                    PageStockLivraison.buttonRAS); 
			}) 
		  

		});  // Onglet LIVRAISONS

		test.describe ('Onglet [STOCK]', async () => {
				
			test ('Onglet [STOCK] - Click', async () =>  {
				await menu.clickOnglet(currentPage, 'stock', page);
			}) 

			test ('ListBox and input [Is - visible] - Check', async () => {
				await fonction.checkListBox(pageStockStock.listBoxGroupeArticle);
				await fonction.isDisplayed(pageStockStock.inputFiltreArticle);
			}) 

			test ('ListBox [GROUPE ARTICLE] = "' + groupeArticle + '"', async () => {
				await pageStockStock.selectGroupeArticle(page, groupeArticle);
			})  

			test ('** Wait Until Spinner Off **', async () => {
				await fonction.waitForSpinner(pageStockStock.spinner);
			});

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 
			
			//--------------------------------------------------------------------------------------------------------------------------

			// S'applique à la ville d'Albi ! /!\
			// Si autre ville, risque de modification de la composition du tableau (colonnes)

			test.skip ('DataGrid [LISTE LIVRAISONS] = "' + groupeArticle + '"', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageStockStock.dataGridStockMagasin,    
					desc        : 'DataGrid [LISTE LIVRAISONS] (' + groupeArticle + ')',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Code article',
							'Désignation article',
							'Conditionnement',
							'Calibre',
							'Dernière réception',
							'Quantité théorique',
							'Poids théorique',
							'Dernière quantité comptée',
							'Dernière quantité comptée colis',
							'Dernière quantité comptée UD',
							'Prix de cession',
							'Valeur totale',
							'',
							'Actions',
							'',
							'Total'
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
				//--------------------------------------------------------------------------------------------------------------------------
			})

			test ('Button [Is - Visible] - Check ', async () => {
					// await fonction.isDisplayed(pageStockStock.buttonDemarrerInventaire);
					await fonction.isDisplayed(pageStockStock.buttonEnregistrerInventaire);
					await fonction.isDisplayed(pageStockStock.buttonValiderInventaire);
					await fonction.isDisplayed(pageStockStock.buttonImprimerPopover);
			})
					
			test ('Buttons [IMPRIMER POUR INVENTAIRE] [Is Visible] - Check', async () => {
				await pageStockStock.buttonImprimerPopover.hover();     // Survol Souris (hover)
				await fonction.wait(page, 250);							// Fondu d'ouverture
				var isPresent = await pageStockStock.buttonImprimerPourInvent.isVisible();
				expect(isPresent).toBe(true); // On verifier la presence du bouton
			})

			test ('ListBox [GROUPE ARTICLE] = "' + groupeArticleMaree + '"', async () => {
			   await pageStockStock.selectGroupeArticle(page, groupeArticleMaree);
			})
			
			test ('** Wait Until Spinner Off #2**', async () => {
				await fonction.waitForSpinner(pageStockStock.spinner);
			});

			test ('DataGrid [LISTE LIVRAISONS] = "' + groupeArticleMaree + '"', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageStockStock.dataGridStockMagasin,    
					desc        : 'DataGrid [LISTE LIVRAISONS] (' + groupeArticleMaree + ')',
					verbose     : false,
					column      :   
					[
						'** skip **',
						'Code article',
						'Désignation article',
						'Conditionnement',
						'Calibre',
						'Dernière réception',
						'Quantité théorique',
						'Poids théorique',
						'Dernière quantité comptée',
						'Dernière quantité comptée colis',
						'Dernière quantité comptée UD',
						'Prix de cession',
						'Valeur totale',
						'',
						'Actions',
						'',
						'Total'
					]
				}
				await fonction.dataGridHeaders(oDataGrid);             
			})
		});  // Onglet STOCK

		test.describe ('Onglet [STOCK A SURVEILLER]',  async () =>  {
			
			test ('Onglet [STOCK A SURVEILLER] - Click',  async () =>  {
				await menu.clickOnglet(currentPage, 'stockASurveiller', page);
			}) 

			test ('** Wait Until Spinner Off **', async () => {
				await fonction.waitForSpinner(pageStockStockAno.spinner);
			});

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Input [CODE ARTICLE] - Is Enabled',  async () =>  {
				// On s'assure que la page a fini de charger quand le bouton est clickable
				await expect(pageStockStockAno.inputFiltreCodeArticle).toBeEnabled();
			})

			test ('Input [LIBELLE ARTICLE] - Is Enabled',  async () =>  {
				// On s'assure que la page a fini de charger quand le bouton est clickable
				await expect(pageStockStockAno.inputFiltreLibelleArticle).toBeEnabled();
			})

			test ('Filter [VENTES SANS STOCK] - Is Visible',  async () =>  {
				await fonction.isDisplayed(pageStockStockAno.linkVentesSansStock);
			})

			test ('Filter [DLC COURTE MANQUANTE] - Is Visible',  async () =>  {
				await fonction.isDisplayed(pageStockStockAno.linkDlcCourteManquante);
			})

			test ('Filter [STOCK IMPORTANT] - Is Visible',  async () =>  {
				await fonction.isDisplayed(pageStockStockAno.linkStockImportant);
			})

			test ('Filter [STOCK NEGATIF] - Is Visible',  async () =>  {
				await fonction.isDisplayed(pageStockStockAno.linkStockNegatif);
			})

			test ('Button [MOUVEMENT DE STOCK] - Is Visible',  async () =>  {
				await fonction.isDisplayed(pageStockStockAno.buttonMouvementsStock);
			})

			test ('Button [IMPRIMER LES DLC A CONTROLER] - Is Visible',  async () =>  {
				await fonction.isDisplayed(pageStockStockAno.buttonImprimerDlcAControler);
			})

			test('DataGrid [LISTE STOCK A SURVEILLER] - Check',  async () =>  {

				// On s'assure que la page a fini de charger quand le bouton est clickable
				await expect(pageStockStockAno.linkVentesSansStock).toBeEnabled();

				var oDataGrid:TypeListOfElements = 
				{
					element     : pageStockStockAno.dataGridAnomalies,    
					desc        : 'DataGrid [LISTE STOCK A SURVEILLER]',
					verbose     : false,
					column      :   
						[
						'',
						'Groupe article',
						'Famille',
						'Code article',
						'Désignation article',
						'Dernière réception',
						'DLC la plus courte',
						'Quantité théorique',
						'Poids théorique (Kg)',
						'Prévisions de ventes avant retrait',
						'Valeur du stock en PVC',
						'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);

			})

			test ('Link [VENTES SANS STOCK] - Click', async () => {
				await fonction.clickAndWait(pageStockStockAno.linkVentesSansStock, page);
			})

			test ('Link [DLC COURTE MANQUANTE] - Click', async () => {
				await fonction.clickAndWait(pageStockStockAno.linkDlcCourteManquante, page);
			})
			
			test ('Link [STOCK IMPORTANT] - Click',  async () => {
			await fonction.clickAndWait(pageStockStockAno.linkStockImportant, page);
			})

			test ('CheckBox [LISTE ANOMALIES][First] - Click',  async () => {
				await fonction.clickElement(pageStockStockAno.checkBoxListeAnomalies.first());
			})

			var nomPopin = 'VISUALISATION DES MOUVEMENTS DE STOCK';
			test.describe ('Popin [' + nomPopin + ']',  async () => {

				test ('Button [MOUVEMENTS DE STOCK] - Click',  async () => {
					await fonction.clickAndWait(pageStockStockAno.buttonMouvementsStock, page);
				})

				test ('Popin [VISUALISATION DES MOUVEMENTS DE STOCK] - Is Visible', async () => {
					await fonction.popinVisible(page, nomPopin, true);
				}) 

				test ('Button and listBox [Is - visible] - Check',  async () => {
					  await fonction.isDisplayed(pageStockStockAno.pPlistBoxConditionnementMvt);                
					  await fonction.isDisplayed(pageStockStockAno.pPbuttonDeplierMvt);                
					  await fonction.isDisplayed(pageStockStockAno.pPbuttonReplierMvt);  
				})              

				test ('DataGrid [LISTE DES MOUVEMENTS DE STOCK] - Check',  async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageStockStockAno.pPDataGridMvt,    
						desc        : 'DataGrid [LISTE DES MOUVEMENTS DE STOCK]',
						verbose     : false,
						column      :   
							[
								'Date',
								'Heure',
								'Quantité initiale',
								'Poids initial',
								'Quantité mouvement',
								'Poids mouvement',
								'Nature',
								'Quantité théorique',
								'Poids théorique',
							]
					}
					await fonction.dataGridHeaders(oDataGrid);  
				})  

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickAndWait(pageStockStockAno.pPLinkFermerMvt, page);
				})

				test ('Popin [VISUALISATION DES MOUVEMENTS DE STOCK] - Is Hidden', async () => {
					await fonction.popinVisible(page, nomPopin, false);
				}) 
			 
			});  // End test.describe Popin

			var nomPopin = 'IMPRIMER LES DLC A CONTROLER';
			test.describe ('Popin [' + nomPopin + ']', async () => {
	
				test ('Button [IMPRIMER LES DLC A CONTROLER] - Click', async () => {
					await fonction.clickAndWait(pageStockStockAno.buttonImprimerDlcAControler, page);
				})

				test ('Popin [IMPRIMER LES DLC A CONTROLER] [VISIBLE] - Check', async () => {
					await fonction.popinVisible(page, nomPopin, true);
				})

				test ('Button, DatePicker, ListBox [Is - visible] - Check', async () => {
					await fonction.isDisplayed(pageStockStockAno.pPimprimerDlcDatePicker);                
					await fonction.isDisplayed(pageStockStockAno.pPimprimerDlcListBoxZones);                
					await fonction.isDisplayed(pageStockStockAno.pPimprimerDlcButtonImprimer); 
				})           

				test ('Link [ANNULER] - Click',  async () => {
				   await fonction.clickAndWait(pageStockStockAno.pPimprimerDlclinkAnnuler, page);
				})

				test ('Popin [IMPRIMER LES DLC A CONTROLER] [INVISIBLE] - Check', async () => {
					await fonction.popinVisible(page, nomPopin, false);
				})            
			});  // End test.describe Popin            
						
			test ('Link [STOCK NEGATIF] - Click', async () => {
				await fonction.clickAndWait(pageStockStockAno.linkStockNegatif, page);
			})

		});  // Onglet STOCK A SURVEILLER

		test.describe ('Onglet [CASSE]', async () => {

			test ('Onglet [CASSE] - Click', async () => {
				await menu.clickOnglet(currentPage, 'casse', page);
			}) 
	
			//-- Effet de bord identifié (Une erreur s'affiche) --
			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 
			
			test ('InputField, button, datePicker, listBox [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageStockCasse.datePickerFrom);
				await fonction.isDisplayed(pageStockCasse.datePickerTo);
				await fonction.isDisplayed(pageStockCasse.listBoxGrpArticle);            
				await fonction.isDisplayed(pageStockCasse.inputArticle);
				await fonction.checkListBox(pageStockCasse.listBoxNature);
				await fonction.isDisplayed(pageStockCasse.inputGencod);
				await fonction.isDisplayed(pageStockCasse.inputCodeArticle);
				await fonction.isDisplayed(pageStockCasse.inputQuantite);
				await fonction.isDisplayed(pageStockCasse.inputPoids);
				await fonction.isDisplayed(pageStockCasse.buttonAjouter);
			}) 

			test ('DataGrid [LISTE CASSE] [Is - visible] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageStockCasse.dataGridListeCasse,    
					desc        : 'DataGrid [LISTE CASSE]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Date',
							'Groupe',
							'Nature',
							'Code article',
							'Désignation article',
							'Code barres',
							'Quantité unitaire',
							'Quantité en UD',
							'PVC de l\'UVC',
							'PVC applicable',
							'Montant TTC',
							'Actions'                       
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			}) 
			
			test ('Button [SUPPRIMER CASSE] - Click', async () => {
				await fonction.isDisplayed(pageStockCasse.buttonSupprimerCasse); 
			}) 
		});  // Onglet CASSE

		test.describe ('Onglet [DONS]', async () => {        

			test ('Onglet [DONS] - Click', async () => {
				await menu.clickOnglet(currentPage, 'dons', page);
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('DatePicker, listBox, inputField and button [Is - visible] - Check', async () => {
				 await fonction.isDisplayed(pageStockDons.datePickerFrom);
				 await fonction.isDisplayed(pageStockDons.datePickerTo);
				 await fonction.isDisplayed(pageStockDons.listBoxGrpArticle);
				 await fonction.checkListBox(pageStockDons.listBoxBeneficiare);
				 await fonction.isDisplayed(pageStockDons.inputBeneficiare);
				 await fonction.isDisplayed(pageStockDons.inputCodeBarre);
				 await fonction.isDisplayed(pageStockDons.inputArticle);
				 await fonction.isDisplayed(pageStockDons.inputQuantite);
				 await fonction.isDisplayed(pageStockDons.inputPoids);
				 await fonction.checkListBox(pageStockDons.listBoxGrpArticleNewBenef);   
				 await fonction.isDisplayed(pageStockDons.buttonAjouterDon); 
			})   

			test ('DataGrid [LISTE DONS] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageStockDons.dataGridListeDons,    
					desc        : 'DataGrid [LISTE DONS]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Numéro du bon',
							'Date',
							'Bénéficiaire',
							'Groupe',
							'Code article',
							'Désignation article',
							'Quantité unitaire',
							'Poids (Kg)',
							'Actions'                      
						]
				}
				await fonction.dataGridHeaders(oDataGrid);  
			})

			test ('Button [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageStockDons.buttonSupprimerDon);
				await fonction.isDisplayed(pageStockDons.buttonTransformerCasse);
				await fonction.isDisplayed(pageStockDons.buttonImprimerBonRemise);
				await fonction.isDisplayed(pageStockDons.buttonImprimRecap);
				await fonction.isDisplayed(pageStockDons.buttonRenseignerBenef);  
			})

		});  // Onglet DONS

		test.describe ('Onglet [HISTORIQUE DES INVENTAIRES]', async () => {        

			test ('Onglet [HISTORIQUE DES INVENTAIRES] - Click', async () => {
				await menu.clickOnglet(currentPage, 'histoInventaire', page);
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('DatePiker [PERIODE DU] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockHisto.datePickerInventaireFrom); 
			})           
			
			test ('DatePiker [AU] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockHisto.datePickerInventaireTo);
			})           
			test ('Button [MODIFIER INVENTAIRE] - Is - visible', async () => {
				await fonction.isDisplayed(pageStockHisto.buttonModifierInventaire);
			})  

			test ('Button [IMPRIMER ECARTS INVENTAIRE] - Check', async () => {
				await fonction.isDisplayed(pageStockHisto.buttonImprimerEcartsInv); 
			})           

			test ('Button [IMPRIMER CONTRE INVENTAIRE] - Check', async () => {
				await fonction.isDisplayed(pageStockHisto.buttonImprimerContreInv); 
			})           

			test ('Input [SEARCH GROUPE ARTICLE] = "' + groupeArticleMaree + '"', async () => {
				await fonction.sendKeys(pageStockHisto.inputGrpArticle, groupeArticleMaree);
				await fonction.wait(page, 500);
			}) 

			test ('CheckBox [HISTORIQUES][0] - Click', async () => {
				await fonction.clickAndWait(pageStockHisto.tdListeInventaires.first(), page);
			})

			test ('Button [COMPTAGES MOBILES] - Check', async () => {
				await fonction.isDisplayed(pageStockHisto.buttonComptagesMobiles); 
			})           

			test ('DataGrid [HISTORIQUE INVENTAIRES] - Check', async () => {

				await fonction.wait(page, 500); // Délai de remise en forme de la DG

				var oDataGrid:TypeListOfElements = 
				{
					element     : pageStockHisto.dataGridInventaires,    
					desc        : 'DataGrid [HISTORIQUE INVENTAIRES]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Groupe article ou zone',
							'Type',
							'Date inventaire',
							'Date/heure validation',
							'Nombre de références',
							'Montant prix de cession HT',
							'Montant PVC',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			})

			test ('DataGrid [LISTE ARTICLES] - Check', async () => {
				   var oDataGrid:TypeListOfElements = 
				   {
					   element     : pageStockHisto.dataGridHistorique,    
					   desc        : 'DataGrid [LISTE ARTICLES]',
					   verbose     : false,
					   column      :   
						   [
								'** skip **',
								'Code article',
								'Désignation article',
								'Conditionnement',          
								'Quantité réserve',
								'Quantité réserve en UD',
								'Quantité magasin',
								'Quantité magasin en UD',
								'Prix de cession',
								'Actions'
						   ]
				   }
				   await fonction.dataGridHeaders(oDataGrid);                       
			})

			test ('Button [MODIFIER INVENTAIRE] - Check', async () => {
				await fonction.isDisplayed(pageStockHisto.buttonModifierInventaire); 
			})

			test ('CheckBox [ARTICLES][0] - Click', async () => {
				await fonction.clickAndWait(pageStockHisto.tdListeArticle.first(), page);
			})

			test ('Button [MOUVEMENTS DE STOCK] - Check', async () => {
				await fonction.isDisplayed(pageStockHisto.buttonMouvementsStock); 
			})  

			test ('Button [COMPTAGES MOBILES] - Click', async () => {
				await fonction.clickAndWait(pageStockHisto.buttonComptagesMobiles, page); 
			})
			
			var sNomPopin:string = 'Visualisation des comptages mobiles du dernier inventaire';
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Check', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})

				test ('InputField[Are - visible] - Check', async () => {
					await fonction.isDisplayed(pageStockHisto.pPInputNomResponsableInv);
					await fonction.isDisplayed(pageStockHisto.pPInputArticle);
				})

				test ('DataGrid [NOM RESPONSABLE INVENTAIRE] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageStockHisto.pPDataGrideRespoInventaire,    
						desc        : 'DataGrid [LISTE ARTICLES]',
						verbose     : false,
						column      :   
							[
								 '** skip **',
								 "Nom du chargé d'inventaire",
								 "Nombre d'articles comptés", 
								 "Statut du comptage",        
								 "Dernière sauvegarde",       
							]
					}
					await fonction.dataGridHeaders(oDataGrid);                       
			 	})

				test ('DataGrid [ARTICLES] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageStockHisto.pPDataGridArticle,    
						desc        : 'DataGrid [LISTE ARTICLES]',
						verbose     : false,
						column      :   
							[
								 '** skip **',
								 "Code",               
								 "Désignation article",
								 "Conditionnement",    
								 "DLC",                
								 "Quantité magasin",   
								 "Quantité magasin UD",
								 "Quantité réserve",   
								 "Quantité réserve UD",      
							]
					}
					await fonction.dataGridHeaders(oDataGrid);                       
			 	})

				test('Td [NOM RESPONSABLE INVENTAIRE][0] - Click', async () => {
					await fonction.clickAndWait(pageStockHisto.pPTdListeRespoInventaire.first(), page);
				})

				test ('DataGrid [ARTICLES] #1 - Check', async () => { //Après avoir choisi un enventaire, la DLC disparait de la dataGrid
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageStockHisto.pPDataGridArticle,    
						desc        : 'DataGrid [LISTE ARTICLES]',
						verbose     : false,
						column      :   
							[
								 '** skip **',
								 "Code",               
								 "Désignation article",
								 "Conditionnement",                   
								 "Quantité magasin",   
								 "Quantité magasin UD",
								 "Quantité réserve",   
								 "Quantité réserve UD",      
							]
					}
					await fonction.dataGridHeaders(oDataGrid);                       
			 	})

				test('Button [FERMER] - Click', async () => {
					await fonction.clickAndWait(pageStockHisto.pPButtonFermer, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , false);
				})

			})

			test ('Button [MOUVEMENT DE STOCK] - Click', async () => {
				await fonction.clickAndWait(pageStockHisto.buttonMouvementsStock, page); 
			})

			var sNomPopin:string = 'Mouvement de stock de l\'article ...';
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Check', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})

				test('ListBox [CONDITIONNEMENT] - Is Visible', async () => {
					await fonction.isDisplayed(pageStockHisto.pPListeBoxConditionnement);
				})

				test('Button [TOUT DEPLIER, REPLIER, RAFRAICHIR] - Are Visible', async () => {
					await fonction.isDisplayed(pageStockHisto.pPButtonToutDeplier);
					await fonction.isDisplayed(pageStockHisto.pPButtonToutReplier);
					await fonction.isDisplayed(pageStockHisto.pPButtonRafraichir);
				})

				test('DatePicker [DATE] - Click', async () => {
					await fonction.isDisplayed(pageStockHisto.pPDatePickerBonLivraison);
				})

				test('InputField [NATURE] - Is Visible', async () => {
					await fonction.clickElement(pageStockHisto.pPMultiselectListBoxNature);
					await fonction.isDisplayed(pageStockHisto.pPInputNature);
				})

				test('CheckBox [NATURE] - Are Visible', async () => {
					await fonction.isDisplayed(pageStockHisto.pPCheckBoxAllNatures);
					await fonction.isDisplayed(pageStockHisto.pPCheckBoxNature.first());
				})

				test ('DataGrid [MOUVEMENT STOCK] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageStockHisto.pPDataGridMvtStock,    
						desc        : 'DataGrid [MOUVEMENT STOCK]',
						verbose     : false,
						column      :   
							[	
								"Date",
								"Heure",
    							"Quantité initiale",
  								"Poids initial",
    							"Quantité mouvement",
								"Poids mouvement",
								"Nature",
								"Quantité théorique",
								"Poids théorique",       
							]
					}
					await fonction.dataGridHeaders(oDataGrid);                       
			 	})

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickAndWait(pageStockStockAno.pPLinkFermerMvt, page);
				})

			})
		});  // Onglet HISTORIQUE

		test.describe ('Onglet [IMPLANTATION]', async () => {        
   
			test ('Onglet [IMPLANTATION] - Click', async () => {
				await menu.clickOnglet(currentPage, 'implantation', page);
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Button [ENREGISTRER] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockImplant.buttonEnregistrer);
			})

			test ('Button [PLUS] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockImplant.buttonPlus);
			})

			test ('Button [IMPRIMER IMPLANTATION] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockImplant.buttonImprimerImplantation);
			})

			test ('Button [MONTER] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockImplant.buttonMonter);
			})

			test ('Button [DESCENDRE] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockImplant.buttonDescendre);
			})

			test ('Button [SUPPRIMER ZONE] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockImplant.buttonZoneSupprimer);
			})

			test ('Button [RENNOMER ZONE] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockImplant.buttonZoneRenommer);
			})

			test ('Button [CHANGER ZONE] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockImplant.buttonZoneChanger);
			})

			test ('Button [CREER ZONE] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockImplant.buttonZoneCreer);
			})

			test ('Button [DEPLACER AVANT] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockImplant.buttonDeplacerAvant);
			})

			test ('Button [DEPLACER APRES] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockImplant.buttonDeplacerApres);
			})

			test ('InputField [ARTICLE] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockImplant.inputArticle);
			})

			test ('InputField [IMPLANTATION CIBLE] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockImplant.inputCibleImplantation);
			})

			test ('InputField [PAGE] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockImplant.inputPage);
			})

			test ('ListBox [RAYON] - Is Visible', async () => {
				await fonction.checkListBox(pageStockImplant.listBoxRayon);
			}) 

			test ('DataGrid [LISTE IMPLANTATIONS] - Check', async () => {
				
				await expect(pageStockImplant.buttonImprimerImplantation).toBeEnabled();   // On attend que la DG soit visible. pour cela on attend qu'au moins un des boutons de la page soit présent

				var oDataGrid:TypeListOfElements = 
				{
					element     : pageStockImplant.dataGridListeImplantations,    
					desc        : 'DataGrid [LISTE IMPLANTATIONS]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Groupe article',
							'Famille',
							'Sous famille',
							'Code',
							'Désignation',
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			}) 
		
		});  // End test.describe Onglet    

		test.describe ('Onglet [STOCK(S) FIN DE JOURNEE]', async () => {        

			test ('Onglet [STOCK(S) FIN DE JOURNEE] - Click', async () => {
				await menu.clickOnglet(currentPage, 'stockFinJournee', page);
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('** Wait Until Spinner Off **', async () => {
				await fonction.waitForSpinner(pageStockFinJournee.spinner);
			});

			test ('Button [ENREGISTRER] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockFinJournee.buttonEnregistrer);
			})

			test ('CheckBox [FIN DE JOURNEE NON RENSEIGNEE] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockFinJournee.checkBoxFinJourneeNonRens);
			})

			test ('CheckBox [FIN DE JOURNEE NON RENSEIGNEE (J/V/S)] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockFinJournee.checkBoxFinJourneeNonRensJV);
			})

			test ('CheckBox [TOUS ARTICLES] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockFinJournee.listBoxGroupeArticle);
			})

			test ('ListBox [GROUPE ARTICLE] - Is Visible', async () => {
				await fonction.isDisplayed(pageStockFinJournee.listBoxGroupeArticle);
			})

			test ('DataGrid [LISTE ARTICLES FIN DE JOURNEE] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageStockFinJournee.dgListeArticles,    
					desc        : 'DataGrid [LISTE ARTICLES FIN DE JOURNEE]',
					verbose     : false,
					column      :   
						[
							'Code article',
							'Désignation article',
							'Stock de fin de journée',
							'Stock de fin de journée je/ve/sa',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

		})

	});  // Page STOCK

	test.describe ('Page [PRIX]', async () => {   

		var pageName = 'prix';

		test ('Page [GESTION DES PRIX] - Click', async () => {
			await menu.click(pageName, page);
		})      
		
		test ('ListBox [GROUPE] = "' + groupeArticle + '"', async () => {
			await pagePrix.selectGroupeArticle(groupeArticle, page);
		})

		test.describe ('Onglet [GESTION DES PRIX]', async () => {

			test ('Onglet [GESTION DES PRIX] - Click', async () => {
				await menu.clickOnglet(pageName, 'gestionPrix', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('InputField [ARTICLE] - Check', async () => {
			   await fonction.isDisplayed(pagePrix.inputArticle);
			})

			test ('DataGrid [PRIX] - Check', async () => {      
				var oDataGrid:TypeListOfElements = 
				{
					element     : pagePrix.dataGridHistorique,    
					desc        : 'DataGrid [PRIX]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Code article',
							'Article',
							'Désignation en magasin',
							'UV',
							'PVC magasin',
							'Lot de',
							'Prix unitaire / coupé',
							'Promo / Opportunité',
							'PVC unitaire centrale',
							'Vente au colis',
							'Modification prix',
							'Mise à jour prix centrale',
							'Actions',       
						]
				}
					await fonction.dataGridHeaders(oDataGrid); 
			})

			test ('InputField and listBox [Is - visible] - Check', async () => {
					await fonction.checkListBox(pagePrix.listBoxGrpArticle);
					await fonction.isDisplayed(pagePrix.buttonImprimer);
					await fonction.isDisplayed(pagePrix.buttonConcurrence);
					await fonction.isDisplayed(pagePrix.buttonOuvrirCaisse);
					await fonction.isDisplayed(pagePrix.buttonCasseFrais);
					await fonction.isDisplayed(pagePrix.buttonFermerCaisse);
					await fonction.isDisplayed(pagePrix.buttonActiver);        
					await fonction.isDisplayed(pagePrix.buttonVenteAuDetail);        
					await fonction.isDisplayed(pagePrix.buttonSupprimerChgtPrix);        
					await fonction.isDisplayed(pagePrix.pictoClearArticle);
			})

			test ('Button [IMPRIMER LES CONCURRENCES] - Is Visible', async () => {
				await pagePrix.buttonImprimer.hover();
				await fonction.wait(page, 250);		
				await pagePrix.buttonImprimerConcurrence.waitFor({state:'visible'});        
			}) 

			test ('Button [IMPRIMER LES CHANGEMENTS] [Is Visible] - Check', async () => {
				await pagePrix.buttonImprimer.hover();
				await fonction.wait(page, 250);							// Fondu d'ouverture
				await pagePrix.buttonImprimerChangement.waitFor({state:'visible'});    
			})        
	  
			test ('Button [IMPRIMER LES ETIQUETTES PRODUIT] - Is Visible', async () => {
				await pagePrix.buttonImprimer.hover();
				await fonction.wait(page, 250);							// Fondu d'ouverture
				await pagePrix.buttonImprimerEtiquette.waitFor({state:'visible'});         
			})  
	  
			test ('Button [IMPRIMER LA LISTE] - Is Visible', async () => {
				await pagePrix.buttonImprimer.hover();
				await fonction.wait(page, 250);							// Fondu d'ouverture
				await pagePrix.buttonImrpimerListe.waitFor({state:'visible'});     
			})

			test ('Button [CONCURRENCE] - Click', async () => {
				await fonction.clickAndWait(pagePrix.buttonConcurrence, page);
			}) 

			test.describe ('Popin [CHANGEMENT DE PRIX DE TYPE CONCURENCE]', async () => {

				test ('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test ('Popin [CHANGEMENT DE PRIX DE TYPE CONCURENCE] [VISIBLE] - Check', async () => {
					await fonction.popinVisible(page, 'CHANGEMENT DE PRIX DE TYPE CONCURENCE', true);
				})

				test ('Button, link and inpuField [Is - visible] - Check', async () => {
					await fonction.isDisplayed(pagePrix.pPinputNomEnseigne);
					await fonction.isDisplayed(pagePrix.pPinputArticle);            
					await fonction.isDisplayed(pagePrix.pPbuttonEnregistrer);
					await fonction.isDisplayed(pagePrix.pPbuttonFermer);
				})

				test ('DataGrid [ARTICLE : CHANGEMENT DE PRIX DE LA CONCURRENCE] - Check', async () => {
					var oDataGrid:TypeListOfElements = {
						element     : pagePrix.pPdataGridConcurrence,    
						desc        : 'DataGrid [ARTICLE : CHANGEMENT DE PRIX DE LA CONCURRENCE]',
						verbose     : false,
						column      :  
							[
								'** skip **',
								'Code article',
								'Article',
								'DLC',
								'Actions',
							]
					}   
					await fonction.dataGridHeaders(oDataGrid); 
				})

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pagePrix.pPbuttonFermer);     
				})

				test ('Popin [CHANGEMENT DE PRIX DE TYPE CONCURENCE][VISIBLE] - Check', async () => {
					await fonction.popinVisible(page, 'CHANGEMENT DE PRIX DE TYPE CONCURENCE', false);
				})

			}); // End test.describe Popin 

			test ('Button [OUVRIR EN CAISSE] - Click', async () => {
				await fonction.clickAndWait(pagePrix.buttonOuvrirCaisse, page);
			})
			
			test.describe ('Popin [OUVERTURE EN CAISSE]', async () => {

				test ('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test ('Popin [OUVERTURE EN CAISSE] [VISIBLE] - Check', async () => {
					await fonction.popinVisible(page, 'OUVERTURE EN CAISSE', true);
				})

				test ('Button, link, inpuField [Is - visible] - Check', async () => {
					await fonction.isDisplayed(pagePrix.pPinputArticleOEC);            
					await fonction.isDisplayed(pagePrix.pPbuttonEnregistrerOEC);
					await fonction.isDisplayed(pagePrix.pPbuttonFermerOEC);
				})

				test ('DataGrid [ARTICLE : OUVERTURE EN CAISSE] - Check', async () => {	
					var oDataGrid:TypeListOfElements = {
						element     : pagePrix.pPdataGridConcurrenceOEC,    
						desc        : 'DataGrid [ARTICLE : OUVERTURE EN CAISSE]',
						verbose     : false,
						column      :  
							[
								'** skip **',
								'Code article',
								'Article',
								'DLC',
								'Actions',
							]
					}   
					await fonction.dataGridHeaders(oDataGrid); 
				})           

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pagePrix.pPbuttonFermerOEC);     
				})

				test ('Popin [OUVERTURE EN CAISSE] [INVISIBLE] - Check', async () => {
					await fonction.popinVisible(page, 'OUVERTURE EN CAISSE', false);
				})

			}); // End test.describe Popin 

			test ('Button [CASSE FRAIS] - Click', async () => {
				await fonction.clickAndWait(pagePrix.buttonCasseFrais, page);
			})

			test.describe ('Popin [CHANGEMENT DE PRIX DE TYPE CASSE FRAIS]', async () => {

				test ('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test ('Popin [CHANGEMENT DE PRIX DE TYPE CASSE FRAIS] - Is Visible', async () => {
					await fonction.popinVisible(page, 'CHANGEMENT DE PRIX DE TYPE CASSE FRAIS', true);
				}) 

				test ('Button, inpuField and link [Is - visible]- Check', async () => {
					await fonction.isDisplayed(pagePrix.pPinputArticleCasseF);            
					await fonction.isDisplayed(pagePrix.pPbuttonEnregistrerCasseF);
					await fonction.isDisplayed(pagePrix.pPbuttonFermerCasseF);
				})

				test ('DataGrid [ARTICLE : CHANGEMENT DE PRIX DE TYPE CASSE FRAIS] [Is -visible] - Check', async () => {					
					var oDataGrid:TypeListOfElements = {
						element     : pagePrix.pPdataGridConcurrenceCasseF,    
						desc        : 'DataGrid [ARTICLE : CHANGEMENT DE PRIX DE TYPE CASSE FRAIS]',
						verbose     : false,
						column      :  
							[
								'** skip **',
								'Code article',
								'Article',
								'DLC',
								'Actions',
							]
					}   
					await fonction.dataGridHeaders(oDataGrid); 
				})

				test ('Link [ANNULER] - Click', async () => {
					await fonction.clickAndWait(pagePrix.pPbuttonFermerCasseF, page);     
				})

				test ('Popin [CHANGEMENT DE PRIX DE TYPE CASSE FRAIS] - Is NOT Visible', async () => {
					await fonction.popinVisible(page, 'CHANGEMENT DE PRIX DE TYPE CASSE FRAIS', false);
				}) 

			}); // End test.describe Popin 

			test ('Button [VENTE AU DETAIL LD] - Click', async () => {
				await fonction.clickAndWait(pagePrix.buttonVenteAuDetail, page); 
			}) 

			var nomPopin = "Changement de prix de type vente au détail livraison directe";
			test.describe ('Popin [' + nomPopin.toUpperCase() + ']', async () =>{

				test ('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				})                

				test ('Popin [' + nomPopin.toUpperCase() + '] - Check', async () => {
					await fonction.popinVisible(page, nomPopin, true);
				})  

				test ('Button, link, inputField [Is - visible] - Check', async () => {
					await fonction.isDisplayed(pagePrix.pPinputFieldArticleVenteLD);
					await fonction.isDisplayed(pagePrix.pPbuttonEnregistrerVenteLD);
					await fonction.isDisplayed(pagePrix.pPbuttonFermerVenteLD);
				}) 

				test ('DataGrid [PRIX] - Check', async () => {      
					var oDataGrid:TypeListOfElements = 
					{
						element     : pagePrix.pPdataGridVenteLD,    
						desc        : 'DataGrid [PRIX]',
						verbose     : false,
						column      :   
							[
								'** skip **',
								'Code article',
								'Article',
								'DLC',
								'Actions',         
							]
					}
					await fonction.dataGridHeaders(oDataGrid); 
				}) 

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pagePrix.pPbuttonFermerVenteLD);     
				})
			});  // End test.describe
		}); // Onglet GESTION DES PRIX

		test.describe ('Onglet [IMPRESSION DES ETIQUETTES]', async () => {

			test ('Onglet [IMPRESSION DES ETIQUETTES] - Click', async () => {
				await menu.clickOnglet(pageName, 'impressionEtiquettes', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Button [IMPRIMER L\'ETIQUETTE] - Check', async () => {
				await fonction.isDisplayed(pageEtiquettes.buttonImprimerEtiquette);
			})
			
			test ('DataGrid [LISTES LIVRAISONS] - Check', async () => {
				var dataGridListesCmd = 
				{
					element     : pageEtiquettes.dataGridEtiquettes,    
					desc        : 'DataGrid [LISTES LIVRAISONS]',
					verbose     : false,
					column      :   
						[
							'',
							'Date de fabrication',
							'Produit fabriqué',
							'Contenu de la fabrication',
							'PVC final',
							'Commande web',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(dataGridListesCmd); 
			}) 

		}); // Onglet IMPRESSION DES ETIQUETTES

	});  // Page PRIX

	test.describe ('Page [FACTURATION]', async () => { 

		var pageName = 'facturation';

		test ('Page [FACTURATION] - Click', async () => {
			await menu.click(pageName, page); 
		}) 

		test.describe ('Onglet [BL DEFINTIFS]', async () => {     

			test ('Onglet [BL DEFINTIFS] - Click', async () => {
				await menu.clickOnglet(pageName, 'blDefinitifs', page);
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('DatePicker, input and listBox [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageFactuDefintestif.datePickerFrom);
				await fonction.isDisplayed(pageFactuDefintestif.datePickerTo);  
				await fonction.isDisplayed(pageFactuDefintestif.inputCritereArticle);
				await fonction.isDisplayed(pageFactuDefintestif.inputFiltreArticle);
				await fonction.isDisplayed(pageFactuDefintestif.inputLotFournBlLogistique);
				await fonction.isDisplayed(pageFactuDefintestif.inputDLCFournisseur);
				await fonction.checkListBox(pageFactuDefintestif.listBoxGrpArticle);
			}) 

			test ('Toggle Buttons [FILTRE] - Check', async () => {
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

			test ('DataGrid [LISTE BL] - Check', async () => { 
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

			test ('DataGrid [LISTE ARTICLES] - Check', async () => {
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

			test ('Button [IMPRIMER LE BL] - Is Visible', async () => {
				await fonction.isDisplayed(pageFactuDefintestif.buttonImprimerBl);
			}) 

		});  // Onglet BL DEFINITIFS

		test.describe ('Onglet [DEMANDE D\'AVOIR]', async () => {

			test ('Onglet [DEMANDE D\'AVOIR] - Click', async () => {
				await menu.clickOnglet(pageName, 'demandeAvoir', page);
			})
	
			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('DatePicker and input [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageFactuAvoir.datePickerPeriode); 
				await fonction.isDisplayed(pageFactuAvoir.inputFiltreCodeArticle);            
				await fonction.isDisplayed(pageFactuAvoir.inputFiltreArticle);            
				await fonction.isDisplayed(pageFactuAvoir.inputFiltreConditionnement); 
			}) 

			test ('DataGrid [LISTE ARTICLES] - Check', async () => {      
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageFactuAvoir.dataGridListeArticles,    
					desc        : 'DataGrid [LISTE ARTICLES]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'',
							'Date demande',
							'Date BL',
							'Code article',
							'Article',
							'Conditionnement',
							'Qté fact.',
							'Qté dem.',
							'Poids dem. (g)',
							'Qté accept.',
							'Poids accept. (g)',
							'Montant',
							'Type',
							'Motif',
							'PVC Cassé frais',
							'Observations',
							'Statut',
							'Infos de la centrale',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			}) 

			test ('Button  [Is - visible] - Check', async () => {         
				await fonction.isDisplayed(pageFactuAvoir.buttonCreer);                                                                                                                  
				await fonction.isDisplayed(pageFactuAvoir.buttonVoirPhotos); 
			})

			test ('Button [CREER] - Click', async () => {
				await fonction.clickAndWait(pageFactuAvoir.buttonCreer, page);
			})

			test.describe ('Popin [CREATION D\'UNE DEMANDE D\'AVOIR]', async () => {

				test ('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 
	
				test ('Popin [CREATION D\'UNE DEMANDE D\'AVOIR] - Is Visible', async () => {
					await fonction.popinVisible(page, 'CREATION D\'UNE DEMANDE D\'AVOIR', true);
				})

				test ('Button, InpuField, listBox, textArea and datePicker [Is - visible] - Check', async () => {
					await fonction.isDisplayed(pageFactuAvoir.pPinputArticle);
					await fonction.isDisplayed(pageFactuAvoir.pPinputQuantiteDemandee);            
					await fonction.isDisplayed(pageFactuAvoir.pPbuttonEnregistrer);
					await fonction.isDisplayed(pageFactuAvoir.pPbuttonFermer);
					await fonction.isDisplayed(pageFactuAvoir.pPbuttonRechercherBLDef);
					await fonction.isDisplayed(pageFactuAvoir.pPbuttonAjouter);
					await fonction.checkListBox(pageFactuAvoir.pPlistBoxGroupeArticle);
					await fonction.isDisplayed(pageFactuAvoir.pPlistBoxTypeDAV);
					await fonction.isDisplayed(pageFactuAvoir.pPlistBoxMotifDAV);
					await fonction.isDisplayed(pageFactuAvoir.pPdatePickerLivraison);
					await fonction.isDisplayed(pageFactuAvoir.pPtextAreaObservations);
				})

				test ('DataGrid [LISTE DES DEMANDES D\'AVOIR] [Is -visible] - Check', async () => {
					var oDataGrid:TypeListOfElements = {
						element     : pageFactuAvoir.pPdataGridListeDAV,    
						desc        : 'DataGrid [LISTE DES DEMANDES D\'AVOIR]',
						verbose     : false,
						column      :  
							[
								'N° BL',
								'N° lot',
								'Code',
								'Désignation',
								'Conditionnement',
								'DLC',
								'Type',
								'Motif',
								'Observations',
								'Qté dem.',
								'Qté dem. Unités',
								'Poids dem. (grammes)',
								'Prix du colis',
								'Prix de cession en UD',
								'Montant total',
								'Actions',
							]
					}   
					await fonction.dataGridHeaders(oDataGrid); 
				})
	
				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pageFactuAvoir.pPbuttonFermer);     
				})
	
				test ('Popin [CREATION D\'UNE DEMANDE D\'AVOIR] - Is NOT Visible', async () => {
					await fonction.popinVisible(page, 'CREATION D\'UNE DEMANDE D\'AVOIR', false);
				})

			});  // End Describe  

		});  // Onglet DEMANDE D'AVOIR

		test.describe ('Onglet [DEMANDE D\'ECHANGE]', async () => {        
	
			test ('Onglet [DEMANDE D\'ECHANGE] - Click', async () => {
				await menu.clickOnglet(pageName, 'demandeEchange', page);
			})   
		
			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('DataGrid [LISTE ARTICLES DEPUIS MAGASIN] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageFactuEchange.dataGridArticleFromMag,    
					desc        : 'DataGrid [LISTE ARTICLES DEPUIS MAGASIN]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Date demande',
							'Date BL',
							'N° demande',
							'Magasin destination',
							'Code',
							'Désignation',
							'N° lot',
							'Conditionnement',
							'DLC',
							'Quantité échangée',
							'Poids échangé (grammes)',
							'Statut',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})  

			test ('DataGrid [LISTE ARTICLES VERS MAGASIN] - Click', async () => {           
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageFactuEchange.dataGridArticleToMag,    
					desc        : 'DataGrid [LISTE ARTICLES VERS MAGASIN]',
					verbose     : false,
					column      :   
						[
							'Date demande',
							'Date BL',
							'N° demande',
							'Magasin origine',
							'Code',
							'Désignation',
							'N° lot',
							'Conditionnement',
							'DLC',
							'Quantité échangée',
							'Poids échangé (grammes)',
							'Statut',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})  

			test ('Button [Is - visible] - Check', async () => { 
				await fonction.isDisplayed(pageFactuEchange.buttonImprimer);
				await fonction.isDisplayed(pageFactuEchange.buttonCreer); 
			})

			test ('Button [CREER] - Click', async () => {
				await fonction.clickAndWait(pageFactuEchange.buttonCreer, page);
			})

			test.describe ('Popin [CREATION D\'UNE DEMANDE D\'ECHANGE]', async () => {

				test ('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test ('Popin [CREATION D\'UNE DEMANDE D\'ECHANGE] - visible', async () => {
					await fonction.popinVisible(page, 'CREATION D\'UNE DEMANDE D\'ECHANGE', true);
				})

				test ('InputField [ARTICLE] - Is Visible', async() => {
					await fonction.isDisplayed(pageFactuEchange.pPinputArticle);
				})

				test ('InputField [QUANTITE CEDEE] - Is Visible', async() => {
					await fonction.isDisplayed(pageFactuEchange.pPinputQuantiteCedee);
				})

				test ('Button [RECHERCHER BL] - Is Visible', async() => {
					await fonction.isDisplayed(pageFactuEchange.pPbuttonRechercherBL);
				})

				test ('Button [AJOUTER] - Is Visible', async() => {
					await fonction.isDisplayed(pageFactuEchange.pPbuttonAjouter);
				})

				test ('Button [ENREGISTRER] - Is Visible', async() => {
					await fonction.isDisplayed(pageFactuEchange.pPbuttonEnregistrer);
				})

				test ('Button [FERMER] - Is Visible', async() => {
					await fonction.isDisplayed(pageFactuEchange.pPbuttonFermer);
				})

				test ('ListBox [GROUPE ARTICLE] - Is Visible', async() => {
					await fonction.isDisplayed(pageFactuEchange.pPlistBoxGroupeArticle);
				})

				test ('ListBox [DESTINATAIRE] - Is Visible', async() => {
					await fonction.isDisplayed(pageFactuEchange.pPlistBoxDestinataire);
				})

				test ('Date Picker [LIVRAISON] - Is Visible', async() => {
					await fonction.isDisplayed(pageFactuEchange.pPdataPickerLivraison);
				})

				test ('DataGrid [LISTE DES DEMANDES D\'ECHANGE] - Check', async () => {
					var oDataGrid:TypeListOfElements = {
						element     : pageFactuEchange.pPdataGridListeDemEchange,    
						desc        : 'DataGrid [LISTE DES DEMANDES D\'ECHANGE]',
						verbose     : false,
						column      :  
							[
								'N° BL',
								'N° lot',
								'Destinataire',
								'Code',
								'Désignation',
								'Conditionnement',
								'DLC',
								'Quantité',
								'Quantité Unités',
								'Poids',
								'Actions',
							]
					}   
					await fonction.dataGridHeaders(oDataGrid);
				})
	
				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pageFactuEchange.pPbuttonFermer);     
				})
	
				test ('Popin [CREATION D\'UNE DEMANDE D\'ECHANGE] [INVISIBLE] - Check', async () => {
					await fonction.popinVisible(page, 'CREATION D\'UNE DEMANDE D\'ECHANGE', false);
				})

			});  // End Describe Popin 

		});  // Onglet CREATION D'UNE DEMANDE D'ECHANGE

	});  // Page FACTURATION

	test.describe ('Page [VENTES]', async () => { 

		var pageName = 'ventes';

		test ('Page [VENTES] - Click', async () => {
			await menu.click(pageName, page);
		})

		test.describe ('Onglet [VENTES D\'UNE JOURNEE]', async () => {        

			test ('Onglet [VENTES D\'UNE JOURNEE] - Click', async () => {
				await menu.clickOnglet(pageName, 'venteJournee', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('InputField, listBox and datePicker [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageVenteJournee.inputSearchArticle);
				await fonction.isDisplayed(pageVenteJournee.listBoxGrpArticle);
				await fonction.isDisplayed(pageVenteJournee.listBoxFamille);
				await fonction.isDisplayed(pageVenteJournee.datePickerVentesFrom);
				await fonction.isDisplayed(pageVenteJournee.datePickerVentesTo);
			})

			test ('DataGrid [LISTE VENTES] [1] - Check', async () => {                 
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageVenteJournee.dataGridListeVentes,    
					desc        : 'DataGrid [LISTE VENTES]',
					verbose     : false,
					column      :   
						[
							"Date",
							'Code article',
							'Article',
							'UV',
							'PVC magasin',
							'Quantité vendue',
							'Promo',
							'Montant TTC',
							'Modification prix',
							//'Vente en ligne',
							'Evénements exceptionnels',
							//'Ruptures'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			
		});  // Onglet VENTES D'UNE JOURNEE

		test.describe ('Onglet [EVENEMENTS EXCEPTIONNELS]', async () => {   

			test ('Onglet [EVENEMENTS EXCEPTIONNELS] - Click', async () => {
				await menu.clickOnglet(pageName, 'evenementsExceptionnels', page);
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Button, input, datePicker and listBox [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageVenteEvExcep.buttonAjouter);
				await fonction.isDisplayed(pageVenteEvExcep.buttonModifier);
				await fonction.isDisplayed(pageVenteEvExcep.buttonSupprimer);
				await fonction.isDisplayed(pageVenteEvExcep.datePickerPeriode);
				await fonction.isDisplayed(pageVenteEvExcep.inputFiltreCodeArticle);
				await fonction.isDisplayed(pageVenteEvExcep.inputFiltreArticle);
				await fonction.isDisplayed(pageVenteEvExcep.inputFiltreCommentaire);
				await fonction.isDisplayed(pageVenteEvExcep.listBoxFiltreGroupeArticle);
				await fonction.isDisplayed(pageVenteEvExcep.listBoxFiltreTypeEvenement);
			})

			test ('DataGrid [LISTE EVENEMENTS EXCEPTIONNELS] - Check', async () => {                
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageVenteEvExcep.dataGreadHeaders,    
					desc        : 'DataGrid [LISTE EVENEMENTS EXCEPTIONNELS]',
					verbose     : false,
					column      :   
						[
							'',
							'Groupe article 2',
							'Code article 3',
							'Article',
							'Début 1',
							'Fin',
							'Type',
							'Commentaire',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

		}); // Onglet EVENEMENT EXEPTIONNEL

	});  // Page VENTES

	test.describe ('Page [EMBALLAGES]', async () => {

		var pageName = 'emballages';

		test ('Page [EMBALLAGES] - Click', async () => {
			await menu.click(pageName, page);
		})

		test.describe ('Onglet [STOCK ET BONS]', async () => {     
 
			test ('Onglet [STOCK ET BONS] - Click', async () => {
				await menu.clickOnglet(pageName, 'stockBons', page);
			})
	
			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('DatePicker  [FROM] - Is Visible', async () => {
				await fonction.isDisplayed(pageEmballageBon.datePickerPeriodeFrom);
			})          

			test ('DatePicker  [TO] - Is Visible', async () => {
				await fonction.isDisplayed(pageEmballageBon.datePickerPeriodeTo); 
			})          

			test ('DataGrid [LISTE ARTICLES] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageEmballageBon.dataGridListeBons,    
					desc        : 'DataGrid [LISTE ARTICLES]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Date',
							'Numéro',
							'Transporteur',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);  
			})              
	 
			test ('Button [I - visible] - Check', async () => {
				await fonction.isDisplayed(pageEmballageBon.buttonCreerBon);
				await fonction.isDisplayed(pageEmballageBon.buttonImprimerBon);
				await fonction.isDisplayed(pageEmballageBon.buttonAnnuler); 
			})   

			test ('Button [CREER BON] - Click', async () => {
				await fonction.clickAndWait(pageEmballageBon.buttonCreerBon, page);
			})

			test.describe ('Popin [CREATION D\'UN BON D\'EMBALLAGE]', async () => {

				test ('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test ('Button, InpuField and textArea [Is - visible] - Check', async () => {
					await fonction.popinVisible(page, 'CREATION D\'UN BON D\'EMBALLAGE', true);

					await fonction.isDisplayed(pageEmballageBon.pPinputTransporteur);
					await fonction.isDisplayed(pageEmballageBon.pPinputNomChauffeur);
					await fonction.isDisplayed(pageEmballageBon.pPinputHeureArrivee);
					await fonction.isDisplayed(pageEmballageBon.pPinputMinuteArrivee);
					await fonction.isDisplayed(pageEmballageBon.pPinputHeureDepart);
					await fonction.isDisplayed(pageEmballageBon.pPinputMinuteDepart);
					await fonction.isDisplayed(pageEmballageBon.pPinputNombrePiles);
					await fonction.isDisplayed(pageEmballageBon.pPinputNombreEmballages);
					await fonction.isDisplayed(pageEmballageBon.pPinputRespChargement);
					await fonction.isDisplayed(pageEmballageBon.pPtextAreaObservationsEmb);
					await fonction.isDisplayed(pageEmballageBon.pPtextAreaObservationsLigne);
					await fonction.isDisplayed(pageEmballageBon.pPbuttonValiderImprimer);
					await fonction.isDisplayed(pageEmballageBon.pPbuttonFermer);
					await fonction.checkListBox(pageEmballageBon.pPlistBoxTypeEmballage);
					await fonction.isDisplayed(pageEmballageBon.pPdataPickerRetour);
				})

				test ('DataGrid [LISTE DES EMBALLAGES] - Check', async () => {
				
					var oDataGrid:TypeListOfElements = {
						element     : pageEmballageBon.pPdataGridListeEmballages,    
						desc        : 'DataGrid [LISTE DES EMBALLAGES]',
						verbose     : false,
						column      :  
							[
								'Type d\'emballage',
								'Nb piles',
								'Nb emballages',
								'Observations',
								'Actions',
							]
					}   
					await fonction.dataGridHeaders(oDataGrid);
				})
	
				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pageEmballageBon.pPbuttonFermer);     
				})

			});  // End Describe Popin
			
			test ('*** Sélection Premier jour mois précédent ***', async () => {
				// On augmente la période pour être certain d'avoir des données
				await fonction.popinVisible(page, 'CREATION D\'UN BON D\'EMBALLAGE', false);

				await fonction.clickElement(pageEmballageBon.datePickerPeriodeFrom);             // Affichage du Calendrier
				await fonction.clickElement(pageEmballageBon.datePickerLinkPrev);                // Déplacement sur le mois précédent
				await fonction.clickElement(pageEmballageBon.datePickerFirstDay);                // Click sur le premier jour du mois
			})

			test ('CheckBox [*FIRST ELEMENT*] - Click', async () => {
				await fonction.clickElement(pageEmballageBon.pPcheckBoxListeBons.nth(0));
			});

			//////////////////////////////////////////////////////////Test.noHtmlInNewTab('BON D\'EMBALLAGE',     PageEmballageBon.buttonImprimerBon);

		});  // Onglet STOCK ET BONS

		test.describe ('Onglet [SUIVI DES BONS]', async () => {

			test ('Onglet [SUIVI DES BONS] - Click', async () => {
				await menu.clickOnglet(pageName, 'suiviBons', page);
			})    

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('DatePicker and input [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageEmballageSuivi.datePickerPeriodeFrom);
				await fonction.isDisplayed(pageEmballageSuivi.datePickerPeriodeTo);            
				await fonction.isDisplayed(pageEmballageSuivi.inputMagasin);            
				await fonction.isDisplayed(pageEmballageSuivi.inputtransporteur); 
			})
  
			test ('DataGrid [LISTE ARTICLES][1] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageEmballageSuivi.toggleButton,    
					desc        : 'DataGrid [LISTE ARTICLES]',
					verbose     : false,
					column      :   
						[
							'Tous',
							'Validés',
							'A valider',
							'Annulés'
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			})
	  
			test ('DataGrid [LISTE ARTICLES][2] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageEmballageSuivi.dataGridListeBon,    
					desc        : 'DataGrid [LISTE ARTICLES]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Date',
							'Heure de départ',
							'Numéro',
							'Transporteur',
							'Départ',
							'Destination',
							'Nb Piles',
							'Détail',
							'Statut',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			})

			test ('Button [CREER BON] - Check', async () => {
				await fonction.isDisplayed(pageEmballageSuivi.buttonValider); 
			})  

		});  // Onglet SUIVI DES BONS

	});  // Page EMBALLAGES

	test.describe ('Page [ALERTES & QUALITE]', async () => {  

		var pageName = 'alertes';

		test ('Page [ALERTES & QUALITE] - Click', async () => {
			await menu.click(pageName, page);
		})

		test.describe ('Onglet [SUIVI CENTRALE]', async () => {      
			  
			test ('Onglet [SUIVI CENTRALE] - Click', async () => {
				await menu.clickOnglet(pageName, 'suiviCentrale', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('ListBox and input [Is - visible] - Check', async () => {
				await fonction.checkListBox(pageAlerteSuivi.listBoxGroupeArticle);
				await fonction.isDisplayed(pageAlerteSuivi.inputFiltreArticle);
			})

			test ('Toggle [STATUT] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAlerteSuivi.toggleStatut,    
					desc        : 'Toggle [STATUT]',
					verbose     : false,
					column      :   
						[
							'Initialisée',
							'Diffusée',
							'En cours'
						]
				}
				await fonction.toggleContent(oDataGrid);
			})

			test ('ListBox [GROUPE ARTICLE] [0] - Select = "' + globalData.idGroupeArticle[aIdGroupeArticle[0]]+ '"', async () => {  
				await pageAlerteSuivi.selectGroupeArticle(page, globalData.idGroupeArticle[aIdGroupeArticle[0]]);       
			})
			
			test ('DataGrid [LISTE ALERTES (' + globalData.idGroupeArticle[aIdGroupeArticle[0]] + ')]', async () => {          	
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAlerteSuivi.dataGridListearticles,    
					desc        : 'DataGrid [LISTE ALERTES (' + globalData.idGroupeArticle[aIdGroupeArticle[0]] + ')]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Pilote(s)',
							'Date',
							'Qualification',
							'Code article',
							'Désignation article',
							'Fournisseur',
							'N° lot SIGALE',
							'N° lot fournisseur',
							'Dlc(s)',
							'Statut',
							'Traitée en magasin',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);    
			})
				   
			test ('ListBox [GROUPE ARTICLE] [1] - Select = "' + groupeArticle + '"', async () => {          
				await pageAlerteSuivi.selectGroupeArticle(page, groupeArticle);        
			})

			test ('DataGrid [LISTE ALERTES (' + groupeArticle + ')] - Check', async () => {	
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAlerteSuivi.dataGridListearticles,    
					desc        : 'DataGrid [LISTE ALERTES (' + groupeArticle + ')]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Pilote(s)',
							'Date',
							'Qualification',
							'Code article',
							'Désignation article',
							'Fournisseur',
							'N° lot SIGALE',
							'Statut',
							'Traitée en magasin',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})   
						
			test ('Button [CREER] - Is Visible', async () => {
				await fonction.isDisplayed(pageAlerteSuivi.buttonCreer);
			})
						
			test ('Button [MODIFIER] - Is Visible', async () => {
				await fonction.isDisplayed(pageAlerteSuivi.buttonModifier);
			})
						
			test ('Button [DIFFUSER] - Is Visible', async () => {
				await fonction.isDisplayed(pageAlerteSuivi.buttonDiffuser);
			})
						
			test ('Button [DEBLOQUER PARTIELLEMENT] - Is Visible', async () => {
				await fonction.isDisplayed(pageAlerteSuivi.buttonDebloquerPartiel);
			})
						
			test ('Button [CHANGER QUALIFICATION] - Is Visible', async () => {
				await fonction.isDisplayed(pageAlerteSuivi.buttonChangerQualif);
			})
						
			test ('Button [VOIR LE SUIVI] - Is Visible', async () => {
				await fonction.isDisplayed(pageAlerteSuivi.buttonVoirSuivi);
			})
						
			test ('Button [SUPPRIMER] - Is Visible', async () => {
				await fonction.isDisplayed(pageAlerteSuivi.buttonSupprimer);
			})
						
			test ('Button [TERMINER] - Is Visible', async () => {
				await fonction.isDisplayed(pageAlerteSuivi.buttonTerminer);
			})

			test ('Button [IMPRIMER LE BILAN] - Is Visible', async () => {                     
				await fonction.isDisplayed(pageAlerteSuivi.buttonImprimerBilan); 
			})              

		});  // Onglet SUIVI CENTRALE

		test.describe ('Onglet [HISTORIQUE CENTRALE]', async () => {        

			test ('Onglet [HISTORIQUE CENTRALE] - Click', async () => {
				await menu.clickOnglet(pageName, 'historiqueCentrale', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 
 
			test ('Input, datePicker, button [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageAlerteHisto.buttonRechercher);

				await fonction.isDisplayed(pageAlerteHisto.datePickerFrom);
				await fonction.isDisplayed(pageAlerteHisto.datePickerTo);
				await fonction.isDisplayed(pageAlerteHisto.datePickerDLC);
				await fonction.checkListBox(pageAlerteHisto.listBoxGroupeArticle);
				await fonction.checkListBox(pageAlerteHisto.listBoxPilote);
				await fonction.isDisplayed(pageAlerteHisto.inputFiltreArticle);
				await fonction.isDisplayed(pageAlerteHisto.inputFiltreFourn);
				await fonction.isDisplayed(pageAlerteHisto.inputFiltreNumLot);
				await fonction.isDisplayed(pageAlerteHisto.inputFiltreNumFourn);
			})

			test ('ListBox [GROUPE ARTICLE][2] - Select = "' + globalData.idGroupeArticle[aIdGroupeArticle[0]]+ '"', async () => {          
				await pageAlerteSuivi.selectGroupeArticle(page, globalData.idGroupeArticle[aIdGroupeArticle[0]]);      
			})
			
			test ('ListBox [GROUPE ARTICLE][3] - Select = "' + globalData.idGroupeArticle[aIdGroupeArticle[0]]+ '"', async () => {           
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAlerteHisto.dataGridListeAlertes,    
					desc        : 'DataGrid [LISTE ARTICLES] (Groupe Article = "' + globalData.idGroupeArticle[aIdGroupeArticle[0]] + '")',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Pilote(s)',
							'Date',
							'Qualification',
							'Code article',
							'Désignation article',
							'Fournisseur',
							'N° lot SIGALE',
							'N° lot fournisseur',
							'Dlc(s)',
							'Quantité totale déclarée',
							'Poids déclaré (kg)',
							'Traitée en magasin',
							'DAV générées',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);      
			})

			test ('ListBox [GROUPE ARTICLE][4] - Select = "' + groupeArticle + '"', async () => {          
				await pageAlerteSuivi.selectGroupeArticle(page, groupeArticle);           
			})            
			
			test ('DataGrid [LISTE ARTICLES] [3] (Groupe Article = "' + groupeArticle + '") - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAlerteHisto.dataGridListeAlertes,    
					desc        : 'DataGrid [LISTE ARTICLES] (Groupe Article = "' + groupeArticle + '")',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Pilote(s)',
							'Date',
							'Qualification',
							'Code article',
							'Désignation article',
							'Fournisseur',
							'N° lot SIGALE',
							'Quantité totale déclarée',
							'Poids déclaré (kg)',
							'Traitée en magasin',
							'DAV générées',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			}) 

		});  // Onglet HISTORIQUE CENTRALE

		test.describe ('Onglet [MODELE ALERTES]', async () => {        

			test ('Onglet [MODELE ALERTES] - Click', async () => {
				await menu.clickOnglet(pageName, 'modeleAlertes', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('ListBox and button [Is - visible] - Check', async () => {
				await fonction.checkListBox(pageModeleAlertes.listBoxGroupeArticle);
				await fonction.isDisplayed(pageModeleAlertes.buttonEnregistrer);
			})

		});  // Onglet MODELE ALERTES

		test.describe ('Onglet [SUIVI INFOS QUALITE]', async () => {        

			test ('Onglet [SUIVI INFOS QUALITE] - Click', async () => {
				await menu.clickOnglet(pageName, 'infosQualite',page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
				await fonction.wait(page, 20000);
			}) 

			test ('DataGrid [SUIVI INFOS QUALITE] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageModeleSuiviInfos.dataGridListeInfos,    
					desc        : 'DataGrid [LISTE INFOS QUALITE]',
					verbose     : false,
					column      :   
						[
							'',
							'Date 1',
							'Code magasin',
							'Magasin 4',
							'N° de lot SIGALE 3',
							'DLC',
							'Code article',
							'Article 2',
							"",
							'Fournisseur',
							'Date de réception',
							'Type',
							'Motif',
							'Quantité (Unité)',
							'Quantité (Colis)',
							'Poids (g)',
							'Observations magasin',
							'Répondu',
							'Comm.',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			
			test ('DatePicker, listBox, checkBox, filtre and Button [Is - visile] - Check', async () => {
				await fonction.isDisplayed(pageModeleSuiviInfos.datePeacker);
				await fonction.isDisplayed(pageModeleSuiviInfos.checkBoxObservation);
				await fonction.isDisplayed(pageModeleSuiviInfos.checkBoxCommentaire);
				await fonction.isDisplayed(pageModeleSuiviInfos.filtreCodeMagasin);
				await fonction.isDisplayed(pageModeleSuiviInfos.filtreMagasin);
				await fonction.isDisplayed(pageModeleSuiviInfos.filtreNumLot);
				await fonction.isDisplayed(pageModeleSuiviInfos.filtreCodeArticle);
				await fonction.isDisplayed(pageModeleSuiviInfos.filtreArticle);
				await fonction.isDisplayed(pageModeleSuiviInfos.listBoxFiltreType);
				await fonction.isDisplayed(pageModeleSuiviInfos.listBoxFiltreMotif);
				await fonction.isDisplayed(pageModeleSuiviInfos.buttonRepondre);
				await fonction.isDisplayed(pageModeleSuiviInfos.buttonCommenter);
				await fonction.isDisplayed(pageModeleSuiviInfos.buttonVoirPhoto);
			})

		}); // Onglet SUIVI INFOS QUALITE

		test.describe ('Onglet [TRAITEMENT MAGASIN]', async () => {        

			test ('Onglet [TRAITEMENT MAGASIN] - Click', async () => {
				await menu.clickOnglet(pageName, 'traitementMagasin',page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('CheckBox [GROUPE ARTICLE] - Check', async () => {
				await fonction.checkListBox(pageAlerteTrait.listBoxGroupeArticle);
			})

			test ('DataGrid [LISTE ALERTES] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAlerteTrait.dataGridListeAlertes,    
					desc        : 'DataGrid [LISTE ALERTES]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Date',
							'Qualification',
							'Code article',
							'Désignation article',
							'Quantité totale',
							'Poids total (kg)',
							'Fournisseur',
							'N° lot SIGALE',
							'N° lot fournisseur',
							'Dlc(s)',
							'Statut',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})   

			test ('Toggle [STATUT] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAlerteTrait.toggleStatut,    
					desc        : 'Toggle [STATUT]',
					verbose     : false,
					column      :   
						[
							'A traiter',
							'En cours',
							'Traitée'
						]
				}
				await fonction.toggleContent(oDataGrid);
			})    

		});  // Onglet TRAITEMENT MAGASIN  

		test.describe ('Onglet [HISTORIQUE MAGASIN]', async () => {        

			test ('Onglet [HISTORIQUE MAGASIN] - Click', async () => {
				await menu.clickOnglet(pageName, 'historiqueMagasin', page);
			})  
		
			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Button, input and datePicker [I - visible] - Check', async () => {
				await fonction.isDisplayed(pageAlerteHistoMag.buttonRechercher);
				await fonction.isDisplayed(pageAlerteHistoMag.datePickerFrom);
				await fonction.isDisplayed(pageAlerteHistoMag.datePickerTo);
				await fonction.isDisplayed(pageAlerteHistoMag.datePickerDLC);
				await fonction.isDisplayed(pageAlerteHistoMag.inputFiltreArticle);
				await fonction.isDisplayed(pageAlerteHistoMag.inputFiltreFourn);
				await fonction.isDisplayed(pageAlerteHistoMag.inputFiltreNumLot);
				await fonction.isDisplayed(pageAlerteHistoMag.inputFiltreNumFourn);
			})

			test ('DataGrid [LISTE ALERTES] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAlerteHistoMag.dataGridListeAlertes,    
					desc        : 'DataGrid [LISTE ALERTES]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Date',
							'Qualification',
							'Code article',
							'Désignation article',
							'Quantité totale saisie',
							'Poids total saisi (kg)',
							'Fournisseur',
							'N° lot SIGALE',
							'N° lot fournisseur',
							'Dlc(s)',
							'DAV générées',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			
			test ('Button [IMPRIMER LA FEUILLE DE BLOCAGE] - Check', async () => {
				await fonction.isDisplayed(pageAlerteHistoMag.buttonImpFeuilleBlocage);
			})
			
			test ('Button [IMPRIMER LE BON DE DESTRUCTION] - Check', async () => {
				await fonction.isDisplayed(pageAlerteHistoMag.buttonImpBonDestruction);
			})
			
			test ('Button [MODIFIER LES QUANTITES] - Check', async () => {
				await fonction.isDisplayed(pageAlerteHistoMag.buttonModifierQuantites);
			})
			
			test ('Button [CONSULTER LES QUANTITES] - Check', async () => {
				await fonction.isDisplayed(pageAlerteHistoMag.buttonConsulterQuantites);
			})

			test ('Button [RECHERCHER] - Click', async () => {
				await fonction.clickAndWait(pageAlerteHistoMag.buttonRechercher, page);				
			})

			test ('td [ALERTE][0] - Click', async () => {
				await fonction.clickAndWait(pageAlerteHistoMag.tdQualification.first(), page);			
			})

			var nomPopin = "Modification de l'alerte";
			test.describe ('Popin [' + nomPopin.toUpperCase() + ']', async () =>{ 

				test ('Button  [MODIFIER LES QUANTITES] - Click', async () => {
					await fonction.clickAndWait(pageAlerteHistoMag.buttonModifierQuantites, page);			
				})

				test ('Popin [' + nomPopin.toUpperCase() + '] - Is Visible', async () =>{ 
					await fonction.popinVisible(page, nomPopin, true);
				})

				test ('Button [FERMER] - Click', async () => {
					await fonction.clickAndWait(pageAlerteHistoMag.pPModifAlerteLinkAnnuler, page);				
				})

				test ('Popin [' + nomPopin.toUpperCase() + '] - Is Hidden', async () =>{ 
					await fonction.popinVisible(page, nomPopin, false);
				})				

			})

		});  // Onglet HISTORIQUE MAGASIN

		test.describe ('Onglet [INFOS QUALITE MAGASIN]', async () => {        

			test ('Onglet [INFOS QUALITE MAGASIN] - Click', async () => {
				await menu.clickOnglet(pageName, 'infoQualiteMagasin', page,);
			})
	
			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('DatePicker [DATE FILRE] - Is Visible', async () => {
				await fonction.isDisplayed(pageAlerteInfos.datePeacker);
			})

			test ('InputField [CODE ARTICLE] - Is Visible', async () => {
				await fonction.isDisplayed(pageAlerteInfos.filtreCodeArticle);
			})

			test ('InputField [ARTICLE] - Is Visible', async () => {
				await fonction.isDisplayed(pageAlerteInfos.filtreArticle);
			})

			test ('ListBox [TYPE] - Is Visible', async () => {
				await fonction.isDisplayed(pageAlerteInfos.listBoxType);
			})

			test ('ListBox [MOTIF] - Is Visible', async () => {
				await fonction.isDisplayed(pageAlerteInfos.listBoxMotif);
			})

			test ('DataGrid [LISTE ALERTES] - Click', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAlerteInfos.dataGridListeInfos,    
					desc        : 'DataGrid [LISTE ALERTES]',
					verbose     : false,
					column      :   
						[
							'Date 1',
							'Code article',
							'Article 2',
							'Type',
							'Motif',
							'Quantité (Unité)',
							'Poids (g)',
							'Observations',
							'Réponse',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
				//--------------------------------------------------------------------------------------------------------------------------
			})

		});  // Onglet INFOS QUALITE MAGASIN

	});  // Page ALERTES

	test.describe ('Page [PREPARATION]', async () => {

		var pageName = 'preparation';

		test ('Page [PREPARATION] - Click', async () => {
			await menu.click(pageName, page);
		});
			
		test ('Message [ERREUR] - Is Not Visible', async () => {
			await fonction.isErrorDisplayed(false, page);
		}) 

		test ('Button, datePicker [Is - visible] - Check', async () => {
			await fonction.isDisplayed(pagePreparation.calendrier);
			await fonction.isDisplayed(pagePreparation.buttonAujourdhui);
			await fonction.isDisplayed(pagePreparation.buttonVoirDetail);
			await fonction.isDisplayed(pagePreparation.buttonImprimerPrepa);
			await fonction.isDisplayed(pagePreparation.buttonImprimerBL);
			await fonction.isDisplayed(pagePreparation.buttonTerminerPrepa);
			await fonction.isDisplayed(pagePreparation.buttonLivrerAuClient);
			await fonction.isDisplayed(pagePreparation.buttonAnnulerCommande);
		})
	
		test ('DataGrid [PREPARATIONS] - Check', async () => {
			var oDataGrid:TypeListOfElements = 
			{
				element     : pagePreparation.dataGridCommandes,    
				desc        : 'DataGrid [PREPARATIONS]',
				verbose     : false,
				column      :   
					[
						'',
						'',
						'N° de commande',
						'Nom client',
						'Livraison 1',
						'Heure de livraison 2',
						'Nombre d\'articles',
						'Montant TTC',
						'Statut',
						'Canal de vente',
						'Actions',
					]
			}
			await fonction.dataGridHeaders(oDataGrid);
		})

	});  // Page PREPARATION

	test.describe ('Page [TABLEAU DE BORD]', async () => {

		var pageName = 'tableauBord'; 

		test ('Page [REFERENCTIEL] - Click', async () => {
			await menu.click(pageName, page);
			await fonction.wait(page, 9000);
		});

		test ('Message [ERREUR] - Is Not Visible', async () => {
			await fonction.isErrorDisplayed(false, page);
		}) 

		test ('DatePicker  and button [Is - visible] - Check', async () => {
			await fonction.isDisplayed(pageTableauDeBord.datePicker);
			await fonction.isDisplayed(pageTableauDeBord.buttonVoirPhotos);
			await fonction.isDisplayed(pageTableauDeBord.buttonValider);
			await fonction.isDisplayed(pageTableauDeBord.buttonRefuser);
		})

		test ('DataGrid [DEMANDES AVOIR] [Is - visible] - Check', async () => {

			var oDataGrid:TypeListOfElements = 
			{
				element     : pageTableauDeBord.dataGridDemandesAvoir,    
				desc        : 'DataGrid [DEMANDES AVOIR]',
				verbose     : false,
				column      :   
					[
						'** skip **',
						'',
						'Code magasin',
						'Magasin',
						'',
						'Date demande',
						'Date BL',
						'Code article',
						'Article',
						'Conditionnement',
						'Qté fact.',
						'Qté dem.',
						'Poids dem. (g)',
						'Qté accept.',
						'Poids accept. (g)',
						'Montant',
						'Type',
						'Motif',
						'PVC Cassé frais',
						'Observations',
						'Statut',
						'Infos de la centrale',
						'Actions',
					]
			}
			await fonction.dataGridHeaders(oDataGrid); 
		})// End Describe Onglet 
	})  // Page TABLEAU DE BORD

	test.describe ('Page [AUTORISATIONS]', async () => { 

		var pageName = 'autorisations';   

		test ('Page [AUTORISATIONS] - Click', async () => {
			await menu.click(pageName, page);
		})

		test.describe ('Onglet [ACHATS CENTRALE]', async () => {      
			
			test ('Onglet [ACHATS CENTRALE] - Click', async () => {
				await menu.clickOnglet(pageName, 'autorisationAchatCentrale', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('InputField [ASSORTIMENT] - Is Visible', async () => {
				await fonction.isDisplayed(pageAutoAchCentrale.inputAssortiment);
			})

			test ('Button [AUTORISATION D\UN MAGASIN] - Is Visible', async () => {
				await fonction.isDisplayed(pageAutoAchCentrale.buttonCloner);
			})

			test ('Button [PREPARER COMMUNICATION] - Is Visible', async () => {
				await fonction.isDisplayed(pageAutoAchCentrale.buttonPreparerComm);
			})

			test ('Button [DEPLACER VERS] - Is Visible', async () => {
				await fonction.isDisplayed(pageAutoAchCentrale.buttonDeplacerVers);
			})

			test ('Button [INITIALISER DES ENGAGEMENTS] - Is Visible', async () => {
				await fonction.isDisplayed(pageAutoAchCentrale.buttonInitialiserEng);
			})

			test ('Button [SUPPRIMER LIGNE] - Is Visible', async () => {
				await fonction.isDisplayed(pageAutoAchCentrale.buttonSupprimerLigne);
			})

			test ('Button [MODIFIER LIGNE] - Is Visible', async () => {
				await fonction.isDisplayed(pageAutoAchCentrale.buttonModifierLigne);
			})

			test ('Button [EXPORTER LE CADENCIER] - Is Visible', async () => {
				await fonction.isDisplayed(pageAutoAchCentrale.buttonExporter);
			})

			test ('Button [REINITIALISER LIGNES] - Is Visible', async () => {
				await fonction.isDisplayed(pageAutoAchCentrale.buttonReinitLignes);
			})

			test ('Button [REINITIALISATION GLOBALE] - Is Visible', async () => {
				await fonction.isDisplayed(pageAutoAchCentrale.buttonReinitGlobale);
			})      

			test ('InputField [ASSORTIMENT] = "'+ cible +'"', async () => {
				await fonction.sendKeys(pageAutoAchCentrale.inputAssortiment, cible);
			}) 

			test ('CheckBox [ASSORTIMENT][first] - Click', async () => {
				await fonction.clickElement(page.locator('td:text("'+sCibleNomLong+'")'));
				await fonction.waitTillHTMLRendered(page);
			})
 
			var nomPopin = ' Communication concernant l\’assortiment XXX';
			test.describe ('Popin [' + nomPopin.toUpperCase() + ']', async () =>{ 

				test ('Button [PREPARER COMMUNICATION] - Click', async () => {
					await fonction.clickAndWait(pageAutoAchCentrale.buttonPreparerComm, page, 40000); 
				})

				test ('Popin [' + nomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, nomPopin, true);
				})

				test ('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test ('Button [DIFFUSER] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pPbuttonDiffuserCom);
				})

				test ('Button [ENREGISTRER] or [DIFFUSER] - Is Visible', async () => {
					const bButtonEnregistrer= await pageAutoAchCentrale.pPbuttonEnregistrerCom.isVisible();
					const bButtonDuffuser 	= await pageAutoAchCentrale.pPbuttonDiffuserCom.isVisible();
					expect(bButtonEnregistrer || bButtonDuffuser).toBeTruthy();
				})

				test ('InputField [ARTICLE] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pPinputFitreArticleCom);
				})

				test ('MultiSelect [ENSEIGNE] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pPmultiSelectEnseigneCom);
				})

				test ('MultiSelect [PLATEFORME] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pPmultiSelectPtfCom);
				})

				test ('Button [PROMOTIONS] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pPbuttonFiltrePromo);
				})

				test ('Button [CHANGEMENTS PRIX] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pPbuttonFiltreChgtPrix);
				})

				test ('Button [INFO LIVRAISON] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pPbuttonFiltreInfoLivraison);
				})

				test ('Button [OUVERTURES] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pPbuttonFiltreOuvertures);
				})

				test ('Button [FERMETURES] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pPbuttonFiltreFermetures);
				})

				test ('Button [INFORMATIONS GENERALSES] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pPbuttonFiltreInfoGal);
				})

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pageAutoAchCentrale.pPlinkAnnuler);
				})

				test ('Popin [' + nomPopin.toUpperCase() + '] - Is NOT Visible', async () => {
					await fonction.popinVisible(page, nomPopin, false);
				})

			});	 // End Describe Popin

			var nomPopin = 'INITIALISER DES ENGAGEMENTS A APRTIR DE L\'ASSORTIMENT XXX';
			test.describe ('Popin [' + nomPopin.toUpperCase() + ']', async () =>{               

				test ('Button [INITIALISER DES ENGAGEMENTS] - Click', async () => {
					await fonction.clickAndWait(pageAutoAchCentrale.buttonInitialiserEng, page, 40000); 
				})

				test ('Popin [' + nomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, nomPopin, true);
				})

				test ('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test ('InputField [ASSORTIMENT] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pInputInitAssortiment);
				}) 

				test ('InputField [ENGAGEMENT] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pInputInitEngagements);
				}) 

				test ('InputField [BASCULE] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pInputInitBascule);
				}) 

				test ('CheckBox [NON OUVERT] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pCheckBoxInitNonOuvert);
				}) 

				test ('Button [FLECHE GAUCHE] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pButtonInitArrowLeft);
				}) 

				test ('DataGrid [ARTICLE DE L\'ASSORTIMENT][1] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageAutoAchCentrale.pDataGridInitAssort,    
						desc        : 'DataGrid [ARTICLE DE L\'ASSORTIMENT]',
						verbose     : false,
						column      :   
							[
								'** skip **',
								'Famille',
								'Sous-famille',
								'Code article',
								'Désignation article'
							]
					}
					await fonction.dataGridHeaders(oDataGrid); 
				})
				   
				test ('Button [FLECHE DROITE] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pButtonInitArrowRight);
				})                 

				test ('DataGrid [ENGAGEMENT] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageAutoAchCentrale.pDataGridInitEngagement,    
						desc        : 'DataGrid [ENGAGEMENT]',
						verbose     : false,
						column      :   
							[
								'** skip **',
								'Engagement(s)'
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				})
			
				test ('Button [VALIDER] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pButtonInitValider);
				}) 

				test ('DataGrid [ARTICLE DE L\'ASSORTIMENT][2] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageAutoAchCentrale.pDataGridInitBascule,    
						desc        : 'DataGrid [ARTICLE DE L\'ASSORTIMENT]',
						verbose     : false,
						column      :   
							[
								'** skip **',
								'Famille',
								'Sous-famille',
								'Code article',
								'Désignation article'
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				})
				
				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pageAutoAchCentrale.pLinkInitFermer);
				})

				test ('Popin [' + nomPopin.toUpperCase() + '] - Is NOT Visible', async () => {
					await fonction.popinVisible(page, nomPopin, false);
				})            

			});  // End Describe Popin

			nomPopin = "Clonage des autorisations";
			test.describe ('Popin [' + nomPopin.toUpperCase() + ']', async () =>{
					
				test ('Button [CLONER LES AUTORISATIONS] - Click', async () => {
					await fonction.clickAndWait(pageAutoAchCentrale.buttonCloner, page); 
				}) 
				
				test ('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test ('Input  [Is - visible] - Is Visible', async () => {
					await fonction.popinVisible(page, nomPopin, true);

					await fonction.isDisplayed(pageAutoAchCentrale.pInputClonageFrom);
					await fonction.isDisplayed(pageAutoAchCentrale.pInputClonageTo);
				})

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pageAutoAchCentrale.pButtonClonerFermer);     
				})

			});  // End Describe Popin

			nomPopin = "Déplacer des articles depuis l'assortiment " + cible;
			test.describe ('Popin [' + nomPopin.toUpperCase() + ']', async () => {

				let aToogleButtonsText:any;

				test ('Button [DEPLACER VERS] - Click', async () => {
					test.setTimeout(50000);
					await fonction.clickAndWait(pageAutoAchCentrale.buttonDeplacerVers, page, 40000); 
				})

				test ('Popin [' + nomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, 'DEPLACER LES ARTICLES', true);
					await fonction.waitTillHTMLRendered(page);
				})

				test ('Label [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test ('Button [DEPLACER ARTICLE] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pButtonDeplacerArticle);
				})

				test ('Button [FERMER] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pButtonFermer);
				})

				test ('ListBox [ASSORTIMENT] - Is Visible', async () => {
					await fonction.checkListBox(pageAutoAchCentrale.pListBoxAssortiment);
				})

				test ('ListBox [SECTEUR] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pListBoxSecteur);
				})

				test ('ListBox [REGION PROSOL] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pListBoxRegionProsol);
				})

				test ('ListBox [ENSEIGNE] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pListBoxEnseigne);
				})

				test ('ListBox [REGION GEOGRAPHIQUE] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pListBoxRegionGeo);
					aToogleButtonsText = await pageAutoAchCentrale.pToggleButtons.allTextContents();
				})

				//--------------------------------------------------------------------------------------------------		

				test.skip ('Toggle [HABITUDES] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageAutoAchCentrale.pToggleHabitudes,    
						desc        : 'Toggle [HABITUDES]',
						verbose     : false,
						column      :   
							[
								"Afrique noire",
								"Asie",
								"Casher",
								"Italie",
								"Nord Afrique",
								"Portugal",
								"Turquie"
							]
					}
					await fonction.toggleContent(oDataGrid);
				})

				test ('Toggle [TAILLE SMEVA] - Check', async () => {

					var oDataGrid:TypeListOfElements = 
					{
						element     : pageAutoAchCentrale.pToggleSmeva,    
						desc        : 'Toggle [TAILLE SMEVA]',
						verbose     : false,
						column      :   
							[
								'4 ',
								'5 ',
								'6 '
							]
					}
					//await fonction.toggleContent(oDataGrid);
					expect(aToogleButtonsText.some(ele => oDataGrid.column.includes(ele))).toBeTruthy();					
				})
						
				test ('Toggle [TAILLE MEUBLE UF] - Check', async () => {
					 var oDataGrid:TypeListOfElements = 
					 {
						 element     : pageAutoAchCentrale.pToggleMeubleUF,    
						 desc        : 'Toggle [TAILLE MEUBLE UF]',
						 verbose     : false,
						 column      :   
							 [
								 ' 4 ',
								 ' 5 ',
								 ' 6 '
							 ]
					 }
					 //await fonction.toggleContent(oDataGrid);
					 console.log(aToogleButtonsText.some(ele => oDataGrid.column.includes(ele)));
				})
 
				test ('Toggle [STRATEGIE] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageAutoAchCentrale.pToggleStrategie,    
						desc        : 'Toggle [STRATEGIE]',
						verbose     : false,
						column      :   
							[
								'Discount ',
								'Standard ',
								'Supérieur ',
								'Premium ',
								'Prestige '
							]
					}
					//await fonction.toggleContent(oDataGrid); 
					expect(aToogleButtonsText.some(ele => oDataGrid.column.includes(ele))).toBeTruthy();
				})

				test ('Toggle [INT. / EXT. / NOUV] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageAutoAchCentrale.pToggleinterneExterne,    
						desc        : 'Toggle [INT. / EXT. / NOUV]',
						verbose     : false,
						column      :   
							[
								'Interne ',
								'Externe ',
								'Nouveau '
							]
					}
					//await fonction.toggleContent(oDataGrid); 
					expect(aToogleButtonsText.some(ele => oDataGrid.column.includes(ele))).toBeTruthy();
				})
						   
				test ('Toggle [SELECTION] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageAutoAchCentrale.pToggleSelectUnselect,    
						desc        : 'Toggle [SELECTION]',
						verbose     : false,
						column      :   
							[
								'Sélectionnés',
								'Non sélectionnés',
							]
					}
					await fonction.toggleContent(oDataGrid); 
				})
						 
				//--------------------------------------------------------------------------------------------------

				test ('DataGrid [LISTE ARTICLES A DEPLACER] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageAutoAchCentrale.pDataGridActicles,    
						desc        : 'DataGrid [LISTE ARTICLES A DEPLACER]',
						verbose     : false,
						column      :   
							[
								'** skip **',
								'Famille',
								'Sous-famille',
								'Code article',
								'Désignation article',
							]
					}
					await fonction.dataGridHeaders(oDataGrid); 
				})
					 
				test ('DataGrid [LISTE DES MAGASINS CIBLE] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageAutoAchCentrale.pDataGridMagasins,    
						desc        : 'DataGrid [LISTE DES MAGASINS CIBLE]',
						verbose     : false,
						column      :   
							[
								'** skip **',
								'Code',
								'** skip **',
								'Ext.',
								'Région géographique',
								'Rég.',
								'Sect.'
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				})

				test.fixme ('Autocomplete [PLATEFORME] > 1', async () => {
					await fonction.nbElementsGreaterThan(pageAutoAchCentrale.pTogglePlaterforme, 1);   
				})

				test.fixme ('Autocomplete [GROUPE DE MAGASIN] > 2', async () => {
					await fonction.nbElementsGreaterThan(pageAutoAchCentrale.pToggleGroupeMagasins, 2);     
				})

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pageAutoAchCentrale.pButtonFermer);
					await fonction.wait(page, 500);     // On laisse le etmps à la page de se raffraîchir
				})
	
				test ('Popin [' + nomPopin.toUpperCase() + '] - Is NOT Visible', async () => {
					await fonction.popinVisible(page, 'DEPLACER LES ARTICLES', false);
				})
				
			});  // End Describe Popin 

			nomPopin = "Exporter le cadencier";
			test.describe ('Popin [' + nomPopin.toUpperCase() + ']', async () => {
	
				test ('Button [EXPORTER CADENCIER] - Click', async () => {
					await fonction.clickElement(pageAutoAchCentrale.buttonExporter); 
				})

				test ('Popin [' + nomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, 'DEPLACER LES ARTICLES', true);
				})

				test ('Label [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 
	
				test ('Button [EXPORTER] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pPbuttonExporter);
				})
	
				test ('Button [FERMER] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pExportButtonFermer);
				})
	
				test ('InputField [MAGASIN] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pInputMagasin);
				})

				test ('Autocomplete [MAGASIN] = "Malemort"', async () => {
					var oData:AutoComplete = {
						libelle         : 'MAGASIN',
						inputLocator    : pageAutoAchCentrale.pInputMagasin,
						inputValue      : 'Malemort',
						choiceSelector  : 'ngb-typeahead-window button',
						choicePosition  : 0,
						typingDelay     : 100,
						waitBefore      : 500,
						page            : page,
					};
					await fonction.autoComplete(oData);   
				})
				
				test ('Link [ANNULER] - Click', async () => {
					await fonction.clickElement(pageAutoAchCentrale.pExportButtonFermer);     
				})

			});  // End Describe Popin 

			nomPopin = "Réinitialisation globale des autorisations à partir d'un modèle".toUpperCase();
			test.describe ('Popin [' + nomPopin + ']', async () =>{

				test ('Button [REINIT GLOBALE VIA MODELE] - Click', async () => {
					await fonction.clickElement(pageAutoAchCentrale.buttonReinitGlobale); 
				}) 

				test ('Popin [' + nomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, 'DEPLACER LES ARTICLES', true);
				})

				test ('Label [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test ('ListBox [MODELE ASSORTIMENT] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoAchCentrale.pListBoxModelAssort);     
				})

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pageAutoAchCentrale.pButtonFermerglobale);     
				})

			});  // End Describe

		});  // Onglet ACHATS CENTRALE
  
		test.describe ('Onglet [MODELES D\'ASSORTIMENTS]', async () => {        
	
			test ('Onglet [MODELES D\'ASSORTIMENTS] - Click', async () => {
				await menu.clickOnglet(pageName, 'modelesAssortiment', page);
			}) 
			
			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			// On fixe un type d'assortiment car influe sur les champs affichés dans la DG
			test ('MultiSelect [GROUPE ARTICLE] = "' + groupeArticleCoupeCorner + '"', async () => {
				await fonction.multiselect(page, groupeArticleCoupeCorner);
				await fonction.wait(page, 500);      // petite temporisation le temps de réorganiser la liste
			})

			test ('Tr [ASSORTIMENT][0] - Click', async () => {
				await fonction.clickAndWait(pageAutoModAss.trAssortiments.first(), page);
			})

			test ('Button and inputField [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageAutoModAss.inputAssortiment);
				await fonction.isDisplayed(pageAutoModAss.inputFamille);
				await fonction.isDisplayed(pageAutoModAss.inputSousFamille);
				await fonction.isDisplayed(pageAutoModAss.inputCodeArticle);
				await fonction.isDisplayed(pageAutoModAss.inputDesignationArticle);
				await fonction.isDisplayed(pageAutoModAss.inputArticle);
				await fonction.isDisplayed(pageAutoModAss.buttonPlus);
				await fonction.isDisplayed(pageAutoModAss.buttonClonerLesAutoristions);
				await fonction.isDisplayed(pageAutoModAss.buttonSupprimerLigne);
				await fonction.isDisplayed(pageAutoModAss.buttonModifierLigne);
				await fonction.isDisplayed(pageAutoModAss.buttonExporterCadencier);
				await fonction.isDisplayed(pageAutoModAss.buttonReinitialisation);
			})
				
			test ('DataGrid [LISTE FAMILLES] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAutoModAss.dataGridListeFamilles,    
					desc        : 'DataGrid [LISTE FAMILLES]',
					verbose     : false,
					column      :   
						[
							'0',
							'',
							'Famille',
							'Sous-famille',
							'Code article',
							'Désignation article',
							'Calibre',
							'Conditionnement',
							'Commande',
							'Prévision',
							'Nb mag',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			})

		});  // Onglet MODELES D'ASSORTIMENTS

		test.describe ('Onglet [LIVRAISONS DIRECTES]', async () => {        
			
			test ('Onglet [LIVRAISONS DIRECTES] - Click', async () => {
				await menu.clickOnglet(pageName, 'autorisationLivraisonsDirectes', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			// On fixe un type d'assortiment car influe sur les champs affichés dans la DG
			test ('MultiSelect [GROUPE ARTICLE] = "' + groupeArticleCoupeCorner + '"', async () => {
				await fonction.multiselect(page, groupeArticleCoupeCorner);
				await fonction.wait(page, 500);      // petite temporisation le temps de réorganiser la liste
			})

			test ('Tr [ASSORTIMENT][0] - Click', async () => {
				await fonction.clickAndWait(pageAutoAchSurPlace.trAssortiments.first(), page);
			})

			test ('InputField and button [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageAutoAchSurPlace.buttonPlus);
				await fonction.isDisplayed(pageAutoAchSurPlace.buttonCloner);            
				await fonction.isDisplayed(pageAutoAchSurPlace.buttonInitEngagement);            
				await fonction.isDisplayed(pageAutoAchSurPlace.buttonSupprimerLigne);            
				await fonction.isDisplayed(pageAutoAchSurPlace.buttonModifierLigne);            
				await fonction.isDisplayed(pageAutoAchSurPlace.buttonAjoutModRemise);            
				await fonction.isDisplayed(pageAutoAchSurPlace.buttonFuturPrix);            
				await fonction.isDisplayed(pageAutoAchSurPlace.buttonExporterCadencier);            
				await fonction.isDisplayed(pageAutoAchSurPlace.inputAssortiment);
				await fonction.isDisplayed(pageAutoAchSurPlace.inputFamille);
				await fonction.isDisplayed(pageAutoAchSurPlace.inputSousFamille);
				await fonction.isDisplayed(pageAutoAchSurPlace.inputCodeArticle);
				await fonction.isDisplayed(pageAutoAchSurPlace.inputDesignationArticle);
			})
		   
			test ('DataGrid [LIGNES ASSORTIMENTS] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAutoAchSurPlace.dataGridLignesAssort,    
					desc        : 'DataGrid [LIGNES ASSORTIMENTS]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'',
							'Famille',
							'Sous-famille',
							'Code article',
							'Désignation article',
							'Calibre',
							'Conditionnement',
							'Prix d\'achat',
							'UA',
							'Remises',
							'Commande',
							'Nb mag',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})        

			test ('Button [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageAutoAchSurPlace.buttonCloner);            
				await fonction.isDisplayed(pageAutoAchSurPlace.buttonInitEngagement);            
				await fonction.isDisplayed(pageAutoAchSurPlace.buttonSupprimerLigne);            
				await fonction.isDisplayed(pageAutoAchSurPlace.buttonModifierLigne);          
				await fonction.isDisplayed(pageAutoAchSurPlace.buttonAjoutModRemise);          
				await fonction.isDisplayed(pageAutoAchSurPlace.buttonFuturPrix);          
				await fonction.isDisplayed(pageAutoAchSurPlace.buttonExporterCadencier);
			})       

		});  // Onglet LIVRAISONS DIRECTES

		test.describe ('Onglet [ENGAGEMENTS]', async () => {        
				
			test ('Onglet [ENGAGEMENTS] - Click', async () => {
				await menu.clickOnglet(pageName, 'engagements',page);
			})
			
			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			// On fixe un type d'assortiment car influe sur les champs affichés dans la DG
			// test ('InputField [ASSORTIMENT] = "Marée"', async () => {
			// 	await fonction.sendKeys(pageAutoEng.inputAssortiment, "Marée");
			// 	await fonction.wait(page, 500);      // petite temporisation le temps de réorganiser la liste
			// })

			test ('Multiselect [GROUPE ARTICLE] = "' + groupeArticleMaree + '"', async() =>{
				await fonction.multiselect(page, groupeArticleMaree);
				await fonction.wait(page, 500);      // petite temporisation le temps de réorganiser la liste
			})

			test ('Tr [ASSORTIMENT][0]#1 - Click', async () => {
				await fonction.clickAndWait(pageAutoEng.trAssortiments.first(), page);
			})

			test ('Button and inputField  [Is - visible] - Check',async () => {
				await fonction.isDisplayed(pageAutoEng.buttonPlus);
				await fonction.isDisplayed(pageAutoEng.inputFamille);
				await fonction.isDisplayed(pageAutoEng.inputSousFamille);
				await fonction.isDisplayed(pageAutoEng.inputCodeArticle);
				await fonction.isDisplayed(pageAutoEng.inputDesignationArticle);
				await fonction.isDisplayed(pageAutoEng.inputArticle);
				await fonction.isDisplayed(pageAutoEng.inputReferenceDeGamme);
			})
		
			test.skip('DataGrid [LIGNES ASSORTIMENTS] - Check', async () => {
				await fonction.waitForSpinner(pageAutoEng.spinner);
				
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAutoEng.dataGridLignesAssort,    
					desc        : 'DataGrid [LIGNES ASSORTIMENTS]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'',
							'Univers',
							'Famille',
							'Sous-famille',
							'Code article',
							'Désignation article',
							'',
							'Calibre',
							'Conditionnement',
							'PVC prévisionnel',
							'Commandes fermes',
							'Nb mag',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			test ('Button  [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageAutoEng.buttonSupprimerLigne);
				await fonction.isDisplayed(pageAutoEng.buttonModifierLigne);                                                   
				await fonction.isDisplayed(pageAutoEng.buttonCloner);                                                   
				await fonction.isDisplayed(pageAutoEng.buttonSupprimerMagasins);                      
				await fonction.isDisplayed(pageAutoEng.buttonReinitLignes);                      
				await fonction.isDisplayed(pageAutoEng.buttonReinitGlobale);                      
				await fonction.isDisplayed(pageAutoEng.buttonTransfertQantite);                      
				await fonction.isDisplayed(pageAutoEng.buttonBasculeCmdeFerme); 
			})                    

			test ('Button [CLONER DEPUIS ASSORTIMENT] - Click', async() => {
				await pageAutoEng.buttonCloner.hover();
				await fonction.wait(page, 250);							// Fondu d'ouverture
				await pageAutoEng.buttonClonerAssort.waitFor({state:'visible'}); // Attendez que le premier élément soit visible
				if(pageAutoEng.buttonClonerAssort != undefined){
					await fonction.clickElement(pageAutoEng.buttonClonerAssort); 
				}            
			})

			test.describe ('Popin [COPIE D\'UN ASSORTIMENT DE TYPE CENTRALE VERS UN ENGAGENENT]', async () => {

				test ('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test ('Button [Is Visible] - Check', async() => {
					await fonction.popinVisible(page, 'COPIE D\'UN ASSORTIMENT DE TYPE CENTRALE VERS UN ENGAGENENT', true);

					await fonction.isDisplayed(pageAutoEng.pPbuttonCopier);
					await fonction.isDisplayed(pageAutoEng.pPbuttonFermer);
				})

				test ('DataGrid [LISTE DES ENGAGEMENTS A INITIALISER] [Is Visible] - Check', async () => {
					var oDataGrid:TypeListOfElements = {
						element     : pageAutoEng.dataGridEngagements,    
						desc        : 'DataGrid [LISTE DES ENGAGEMENTS A INITIALISER]',
						verbose     : false,
						column      :  
							[
								'** skip **',
								'Assortiment',
							]
					}   
		
					await fonction.dataGridHeaders(oDataGrid);  
				})

				test ('DataGrid [LISTE DES AUTORISATIONS ACHAT CENTRALE A COPIER] [Is Visible] - Check', async () => {
					var oDataGrid:TypeListOfElements = {
						element     : pageAutoEng.dataGridAutorisations,    
						desc        : 'DataGrid [LISTE DES AUTORISATIONS ACHAT CENTRALE A COPIER]',
						verbose     : false,
						column      :  
							[
								'** skip **',
								'Assortiment',
							]
					}   
		
					await fonction.dataGridHeaders(oDataGrid);
				})

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pageAutoEng.pPbuttonFermer);     
				})

				test ('Popin [COPIE D\'UN ASSORTIMENT DE TYPE CENTRALE VERS UN ENGAGENENT] - Check', async () => {
					await fonction.popinVisible(page, 'COPIE D\'UN ASSORTIMENT DE TYPE CENTRALE VERS UN ENGAGENENT', false);
				})
	
			});  // End Describe Popin 

			test ('Tr [ASSORTIMENT][0] - Click', async () => {
				await fonction.clickAndWait(pageAutoEng.trAssortiments.first(), page);
			})

			test.describe ('Popin [CLONAGE DES AUTORISATIONS]', async () => {

				test ('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test ('Button [CLONER DEPUIS MAGASIN] - Is Visible', async () => {
					await pageAutoEng.buttonCloner.hover();
					await fonction.wait(page, 250);							// Fondu d'ouverture
					await pageAutoEng.buttonClonerMagasin.waitFor({state:'visible'}); // Attendez que le premier élément soit visible
					if(pageAutoEng.buttonClonerMagasin != undefined){
						await fonction.clickElement(pageAutoEng.buttonClonerMagasin);
					}                 
				})
	
				test ('InputField, Link and button - Check', async () => {
					await fonction.popinVisible(page, 'CLONAGE DES AUTORISATIONS', true);

					await fonction.isDisplayed(pageAutoEng.pPClAutButtonClonerAut);
					await fonction.isDisplayed(pageAutoEng.pPClAutLinkAnnuler);
					await fonction.isDisplayed(pageAutoEng.pPClAutInputAssortiment);
					await fonction.isDisplayed(pageAutoEng.pPClAutInputLDVfrom);
					await fonction.isDisplayed(pageAutoEng.pPClAutInputLDVto);   
				})

				test ('DataGrid [LISTE DES ASSORTIMENTS] - Check', async () => {
					var oDataGrid:TypeListOfElements = {
						element     : pageAutoEng.pPClAutDataGrid,    
						desc        : 'DataGrid [LISTE DES ASSORTIMENTS]',
						verbose     : false,
						column      :  
							[
								'Assortiments',
								'Groupe article'
							]
					}   
					await fonction.dataGridHeaders(oDataGrid);
				})

				test ('Link [ANNULER] - Click', async () => {
					await fonction.clickElement(pageAutoEng.pPClAutLinkAnnuler);     
				})
	
				test ('Popin [CLONAGE DES AUTORISATIONS] - Check', async () => {
					await fonction.popinVisible(page, 'CLONAGE DES AUTORISATIONS', false);
				})

			});  // End Describe Popin 

			test ('Button [CLONER DEPUIS MAGASIN] - Click', async () => {
				await pageAutoEng.buttonCloner.hover();
				await fonction.wait(page, 250);							// Fondu d'ouverture
				await pageAutoEng.buttonClonerEngagement.waitFor({state:'visible'}); // Attendez que le premier élément soit visible
				if(pageAutoEng.buttonClonerEngagement != undefined){
					await fonction.clickElement(pageAutoEng.buttonClonerEngagement);
				}
			})

			test.describe ('Popin [CLONAGE D\'UN ENGAGEMENT VERS UN AUTRE]', async () => {

				test ('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test ('Link and button [Is - visible] - Check', async () => {
					await fonction.popinVisible(page, 'CLONAGE D\'UN ENGAGEMENT VERS UN AUTRE', true);

					await fonction.isDisplayed(pageAutoEng.pPClEngButtonClonerAut);
					await fonction.isDisplayed(pageAutoEng.pPClEngLinkAnnuler);    
				})

				test ('DataGrid [LISTE DES ASSORTIMENTS] - Check', async () => {
					var oDataGrid:TypeListOfElements = {
						element     : pageAutoEng.pPClEngDataGrid,    
						desc        : 'DataGrid [LISTE DES ASSORTIMENTS]',
						verbose     : false,
						column      :  
							[
								'Assortiment',
								'Groupe article',
								'Assortiment'
							]
					}   
					await fonction.dataGridHeaders(oDataGrid);   
				})

				test ('Link [ANNULER] - Click', async () => {
					await fonction.clickElement(pageAutoEng.pPClEngLinkAnnuler);     
				})
	
				test ('Popin [CLONAGE D\'UN ENGAGEMENT VERS UN AUTRE] - Check', async () => {
					await fonction.popinVisible(page, 'CLONAGE D\'UN ENGAGEMENT VERS UN AUTRE', false);
				})
			});  // End Describe Popin 

		});  // Onglet ENGAGEMENTS

		test.describe ('Onglet [OPPORTUNITES]', async () => {        

			test ('Onglet [OPPORTUNITES] - Click', async () => {
				await menu.clickOnglet(pageName, 'opportunites', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 
			
			// On fixe un type d'assortiment car influe sur les champs affichés dans la DG
			test ('MultiSelect [GROUPE ARTICLE] = "' + groupeArticleCoupeCorner + '"', async () => {
				await fonction.multiselect(page, groupeArticleCoupeCorner);
				await fonction.wait(page, 500);      // petite temporisation le temps de réorganiser la liste
			})

			test ('Tr [ASSORTIMENT][0] - Click', async () => {
				await fonction.clickAndWait(pageAutoOpp.trAssortiments.first(), page);
			})

			test ('Button and InputField  [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageAutoOpp.buttonSupprimerLigne);
				await fonction.isDisplayed(pageAutoOpp.buttonModifierLigne);
				await fonction.isDisplayed(pageAutoOpp.buttonExporterCadencier);
				await fonction.isDisplayed(pageAutoOpp.buttonTarifer);
				await fonction.isDisplayed(pageAutoOpp.buttonDiffuser);
				await fonction.isDisplayed(pageAutoOpp.buttonPlus);
				await fonction.isDisplayed(pageAutoOpp.inputFamille);
				await fonction.isDisplayed(pageAutoOpp.inputSousFamille);
				await fonction.isDisplayed(pageAutoOpp.inputCodeArticle);
				await fonction.isDisplayed(pageAutoOpp.inputDesignationArticle);
				await fonction.isDisplayed(pageAutoOpp.inputArticle);
			})

			test ('DataGrid [LISTE ASSORTIMENTS] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAutoOpp.dataGridListeAssortiments,    
					desc        : 'DataGrid [LISTE ASSORTIMENTS]',
					verbose     : false,
					column      :   
						[
							'Assortiment',
							'Diffusée',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
 
			test ('DataGrid [LISTE FAMILLES] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAutoOpp.dataGridListeFamilles,    
					desc        : 'DataGrid [LISTE FAMILLES]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'',
							'Famille',
							'Sous-famille',
							'Code article',
							'Désignation article',
							'Calibre',
							'Conditionnement',
							'Nb mag',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			})
		});  // Onglet OPPORTUNITES               

		test.describe ('Onglet [MODELES DE COMMANDE]', async () => {        
			
			test ('Onglet [MODELES DE COMMANDE] - Click', async () => {
				await menu.clickOnglet(pageName, 'modelesCommande', page);
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Input, listBox and checkBox - Check', async () => {
				await fonction.isDisplayed(pageAutoModele.inputModele);  
				await fonction.checkListBox(pageAutoModele.listBoxGroupeArticle);  
				//await fonction.isDisplayed(pageAutoModele.listBoxDossierAchat);  
				await fonction.isDisplayed(pageAutoModele.checkBoxMasquerInactif); 
			})
					  
			test ('DataGrid [LISTE MODELES] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAutoModele.dataGridListeCommandes,    
					desc        : 'DataGrid [LISTE MODELES]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Modèle',
							'Groupe article',
							'Actif',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			test ('Button [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageAutoModele.buttonEnregistrer);
				await fonction.isDisplayed(pageAutoModele.buttonModifierArticle);            
				await fonction.isDisplayed(pageAutoModele.buttonSupprimerArticle);              
				await fonction.isDisplayed(pageAutoModele.buttonCreerModele);  
				await fonction.isDisplayed(pageAutoModele.buttonExporterModele);  
				await fonction.isDisplayed(pageAutoModele.buttonActiver);  
				await fonction.isDisplayed(pageAutoModele.buttonDesactiver);
			}) 

		});  // Onglet MODELES DE COMMANDE 

		test.describe ('Onglet [ACTUALITE]', async () => {        
			
			test ('Onglet [ACTUALITE] - Click', async () => {
				await menu.clickOnglet(pageName, 'actualite', page);
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Button, Calendar and SelectButton - Check', async () => {
				await fonction.isDisplayed(pageAutorisationsActualite.buttonCreer);  
				await fonction.isDisplayed(pageAutorisationsActualite.buttonModifier);
				await fonction.isDisplayed(pageAutorisationsActualite.calendarPeriodeDiffusion);
				await fonction.isDisplayed(pageAutorisationsActualite.selectbutton);
			})
					  
			test ('DataGrid [ACTUALITE] - Check', async () => {
				var oDataGrid:TypeListOfElements = {
					element     : pageAutorisationsActualite.dataGridListeActualite,    
					desc        : 'DataGrid [ACTUALITE]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Groupe Article',
							'Titre',
							'Enseignes',
							'Date de diffusion',
							"Date d'annulation de la diffusion",
							'Tags',
							'Nombre de magasins',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			var nomPopin = 'Création d\'une actualite'.toUpperCase();
			test.describe ('Popin [' + nomPopin + ']', async () => {

				test ('Button [CREER] - Click', async () => {
					await fonction.clickAndWait(pageAutorisationsActualite.buttonCreer, page);
				})

				//-- La DG ne s'affiche qu'après la sélection d'un Groupe Article
				test.skip ('DataGrid [MAGASINS CONCERNES] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageAutoParam.pPdataGridFdp,    
						desc        : 'DataGrid [MAGASINS CONCERNES]',
						verbose     : false,
						column      :   
							[
								'** skip **',
								'',
								''
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				})

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pageAutorisationsActualite.pPlinkFdpFermer);
				})

				test ('Popin [' + nomPopin + '] - Check', async () => {
					await fonction.popinVisible(page, nomPopin, false);  
				}) 

			})// End Popin

		})  // Onglet ACTUALITE 

		test.describe ('Onglet [PARAMETRAGE]', async () => {        
		
			test ('Onglet [PARAMETRAGE] - Click', async () => {
				await menu.clickOnglet(pageName, 'parametrage', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('CheckBox and inputField [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageAutoParam.checkBoxMasquerActif);
				await fonction.isDisplayed(pageAutoParam.inputFieldFilter);   
			})
		
			test ('DataGrid [LISTE ASSORTIMENTS] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAutoParam.dataGridListeAssort,    
					desc        : 'DataGrid [LISTE ASSORTIMENTS]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Assortiment',
							'Type',
							'Actif',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			})
			
			test ('Button [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageAutoParam.buttonEnregistrer);
				await fonction.isDisplayed(pageAutoParam.buttonCreerAssort);
				await fonction.isDisplayed(pageAutoParam.buttonSupprimerAssort);
				await fonction.isDisplayed(pageAutoParam.buttonCreerGrpCmd);    
				await fonction.isDisplayed(pageAutoParam.buttonAjoutFraisDePort);  
			})
		   
			var nomPopin = 'AJOUT DES FRAIS DE PORT';
			test.describe ('Popin [' + nomPopin + ']', async () =>{

				test ('ListBox [TYPE] = "' + sTradLivraisonDirectes + '"', async () => {
					await fonction.clickElement(pageAutoParam.listBoxTypeAssortiment);
					await pageAutoParam.listBoxTypeAssortiment.selectOption({label: sTradLivraisonDirectes});
					//await fonction.clickElement(pageAutoParam.listBoxTypeAssortiment);
				})

				test ('ListBox [GROUPE ARTICLE] = "' + groupeArticleCoupeCorner + '"', async () => {
					await fonction.clickElement(pageAutoParam.listBoxGroupeArticle);
					await pageAutoParam.listBoxGroupeArticle.selectOption({label: groupeArticleCoupeCorner});
					await fonction.clickElement(pageAutoParam.listBoxGroupeArticle);
				})                

				test ('CheckBox [ASSORTIMENT][0] - Click', async () => {				 

					await pageAutoParam.checkBoxListeAssortiments2.first().waitFor({state:'visible'}); // Attendez que le premier élément soit visible
					if(pageAutoParam.checkBoxListeAssortiments2.first() != undefined){
						var iNbResponses = await pageAutoParam.checkBoxListeAssortiments2.count();

						var rnd = Math.floor(fonction.random() * iNbResponses);

						await pageAutoParam.tdLibelleAssortiment.nth(rnd).waitFor({state:'visible'}); // Attendez que l'élément à la position rnd soit visible
						if(pageAutoParam.tdLibelleAssortiment.nth(rnd) != undefined){

							var sArticle = await pageAutoParam.tdLibelleAssortiment.nth(rnd).textContent();
							log.set('Article : ' + sArticle);
							await fonction.clickElement(pageAutoParam.checkBoxListeAssortiments2.nth(rnd));
						}
					}
				})

				test ('Button [AJOUTER DES FRAIS DE PORT] - Click', async () => {
					//-- Pas disponible pour l'italie
					//if (await pageAutoParam.buttonAjoutFraisDePort.isEnabled()) {                       
					await fonction.clickElement(pageAutoParam.buttonAjoutFraisDePort);
					//}
				})                

				test ('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				//-- InputFields 
				test ('InpuField [PRIX] - Is Visible', async () => {                    
					await fonction.isDisplayed(pageAutoParam.pPinputFdpQuantitePoidsPrix);
				})

				test ('InpuField [QUANTITE (POIDS)] - Is Visible', async () => {                    
					await fonction.isDisplayed(pageAutoParam.pPinputFdpQuantitePoidsQte);
				})

				test ('InpuField [QUANTITE (COLIS)] - Is Visible', async () => {                    
					await fonction.isDisplayed(pageAutoParam.pPinputFdpQuantiteColisQte);
				})

				test ('InpuField [QUANTITES COMMANDES] - Is Visible', async () => {                    
					await fonction.isDisplayed(pageAutoParam.pPinputFdpFixePrix);
				})

				test ('InpuField [QUANTITES COLIS PRIX] - Is Visible', async () => {                    
					await fonction.isDisplayed(pageAutoParam.pPinputFdpQuantiteColisPrix);
				})

				//-- Radio Buttons
				test ('Radio Button [QUANTITE (COLIS)] - Is Visible', async () => {                    
					await fonction.isDisplayed(pageAutoParam.pPradioFdpQuantiteColis);
				})

				test ('Radio Button [QUANTITE (POIDS)] - Is Visible', async () => {                    
					await fonction.isDisplayed(pageAutoParam.pPradioFdpQuantitePoids);
				})

				test ('Radio Button [FIXE] - Is Visible', async () => {                    
					await fonction.isDisplayed(pageAutoParam.pPradioFdpFixe);
				})

				test ('Radio Button [TRANCHE] - Is Visible', async () => {                    
					await fonction.isDisplayed(pageAutoParam.pPradioFdpTranche);
				})

				test ('Button [ENREGISTRER - Is Visible]', async () => {    
					await fonction.isDisplayed(pageAutoParam.pPbuttonFdpEnregistrer); 
				})   

				test ('DataGrid [MAGASINS CONCERNES] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageAutoParam.pPdataGridFdp,    
						desc        : 'DataGrid [MAGASINS CONCERNES]',
						verbose     : false,
						column      :   
							[
								'** skip **',
								'Code',
								'Désignation'
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				})

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pageAutoParam.pPlinkFdpFermer);
				})

				test ('Popin [' + nomPopin + '] - Check', async () => {
					await fonction.popinVisible(page, nomPopin, false);  
				}) 

			}); // End Popin

			var nomPopin = 'Paramétrage de la communication';
			test.describe ('Popin [' + nomPopin + ']', async () => {

				test ('Button [PARAMETRER LA COMMUNICATION] - Click', async () => {
					await fonction.clickAndWait(pageAutoParam.buttonParamCom, page);
				})

				test ('DropDown, Radio, Input et button - Check', async () => {
					await fonction.isDisplayed(pageAutoParam.buttonFermer);  
					await fonction.isDisplayed(pageAutoParam.selectGroupeArticle);  
					await fonction.isDisplayed(pageAutoParam.radioManuel);  
					await fonction.isDisplayed(pageAutoParam.radioAutomatique);  
					await fonction.isDisplayed(pageAutoParam.inputAutHH);  
					await fonction.isDisplayed(pageAutoParam.inputAutMM);  
					await fonction.isDisplayed(pageAutoParam.inputHeureEnvoiActHH);  
					await fonction.isDisplayed(pageAutoParam.inputHeureEnvoiActMM);  
					await fonction.isDisplayed(pageAutoParam.selectEnseigne);  
					await fonction.isDisplayed(pageAutoParam.inputEmail);  
					await fonction.isDisplayed(pageAutoParam.buttonAjouter);  
					await fonction.isDisplayed(pageAutoParam.buttonParamEnregistrer);  
					await fonction.isDisplayed(pageAutoParam.buttonParamAnnuler);  
				})

				test ('DataGrid [EMAIL] - Check', async () => {
					var oDataGrid:TypeListOfElements = {
						element		: pageAutoParam.dataGridMail,
						desc		: 'DataGrid [EMAIL]',
						verbose		: false,
						column		:
							[
								'Email',
								'Actions'
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				})

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pageAutoParam.buttonFermer);
				})

				test ('Popin [' + nomPopin + '] - Check', async () => {
					await fonction.popinVisible(page, nomPopin, false);  
				}) 

			})

		});  // Onglet PARAMETRAGE

		test.describe ('Onglet [BLOCAGE]', async () => {        
				
			test ('Onglet [BLOCAGE] - Check', async () => {
				await menu.clickOnglet(pageName, 'blocage', page);
			})
			
			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 
			
			test ('DataGrid [LISTE ASSORTIMENTS] - Check', async () => {							
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAutoBlocage.dataGridListeAssort,    
					desc        : 'DataGrid [LISTE ASSORTIMENTS]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Groupe article',
							'Bloquée',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			}) 
			
			test ('Button [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageAutoBlocage.buttonBloquer);
				await fonction.isDisplayed(pageAutoBlocage.buttonDebloquer);  
			})  

		});  // Onglet BLOCAGE   

		test.describe ('Onglet [ECHANGES]', async () => {        

			test ('Onglet [ECHANGES] - Click', async () => {
				await menu.clickOnglet(pageName, 'echanges', page);
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Input [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageAutoEchange.inputMagasinCedant);
			})
		});  // Onglet ECHANGES 

		test.describe ('Onglet [GROUPE DE MAGASINS]', async () => {        
			
			test ('Onglet [GROUPE DE MAGASIN] - Click', async () => {
				await menu.clickOnglet(pageName, 'groupeMagasins', page);
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('ListBox [Is - visible] - Check', async () => {
				await fonction.checkListBox(pageAutoGrpMag.listBoxRayon);
				if (sLangue === 'it') {
					await fonction.listBoxByLabel(pageAutoGrpMag.listBoxRayon, groupeArticle.toUpperCase(), page);
				} else {
					await fonction.listBoxByLabel(pageAutoGrpMag.listBoxRayon, groupeArticle, page);
				}				
			})  

			//Commentaire provisoire avant confirmation de la part de Fatma;
			test.skip ('CheckBox - Check', async () => {
				await fonction.isDisplayed(pageAutoGrpMag.checkBoxMasquerInactif);
			})

			test ('CheckBox [GROUPE MAGASINS][0] - Click', async () => {
				await fonction.clickAndWait(pageAutoGrpMag.checkBoxGroupeMagasins.first(), page);
			})

			test ('Input [FILTRE] [Is - Vsible] - Check', async () => {
				await fonction.isDisplayed(pageAutoGrpMag.listBoxFiltreSecteur);
				await fonction.isDisplayed(pageAutoGrpMag.listBoxFiltreRegProsol);
				await fonction.isDisplayed(pageAutoGrpMag.listBoxFiltreRegGeo);
				await fonction.isDisplayed(pageAutoGrpMag.listBoxFiltreEnseigne);
			})

			test ('DataGrid [LISTE GROUPES MAGASINS] - Check', async () => {		
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAutoGrpMag.dataGridListeGroupes,    
					desc        : 'DataGrid [LISTE GROUPES MAGASINS]',
					verbose     : false,
					column      :   
						[
							'1',
							'Groupe de magasins 2',
							'Type',
							'Actif',
							'Actions',
							"",
							"empty",
							"empty",
							"",
							"",
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			test ('DataGrid [LISTE MAGASINS] [Is - visible ] - Check', async () => {						
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAutoGrpMag.dataGridlistMagasin,    
					desc        : 'DataGrid [LISTE MAGASINS]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Code',
							'Désignation',
							'Externe',
							'Région géographique',
							'Secteur'
						]
				}
				//Test.dataGridHeaders(oDataGrid);      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< To Do ???
			})
						
			test ('Button [Is - visible ] - Check', async () => {
				await fonction.isDisplayed(pageAutoGrpMag.buttonCreerGroupe);
				await fonction.isDisplayed(pageAutoGrpMag.buttonModifierGroupe);
				await fonction.isDisplayed(pageAutoGrpMag.buttonEnregistrer);
				await fonction.isDisplayed(pageAutoGrpMag.buttonRenseignerType);
			})

			test ('Button [CREER UN GROUPE] - Click', async () => {
				await fonction.clickAndWait(pageAutoGrpMag.buttonCreerGroupe, page);
			})

			test.describe ('Popin [CREATION D\'UN GROUPE DE MAGASIN]', async () => {

				test ('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test ('Button, inputField and checkBox [Is - visible] - Check', async () => {
					await fonction.popinVisible(page, 'CREATION D\'UN GROUPE DE MAGASIN', true);

					await fonction.isDisplayed(pageAutoGrpMag.pPbuttonEnregistrer);
					await fonction.isDisplayed(pageAutoGrpMag.pPbuttonFermer);
					await fonction.isDisplayed(pageAutoGrpMag.pPinputDesignation);
					await fonction.isDisplayed(pageAutoGrpMag.pPcheckBoxActif);     
				})          

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pageAutoGrpMag.pPbuttonFermer);     
				})

				test ('Popin [CREATION D\'UN GROUPE DE MAGASIN] - Check', async () => {
					await fonction.popinVisible(page, 'CREATION D\'UN GROUPE DE MAGASIN', false);   
				})
			});  // End Popin

		});  // End Describe Onglet   

        test.describe ('Onglet [GAMMES]', async () => {        
			
			test ('Onglet [GAMMES] - Click', async () => {
				await menu.clickOnglet(pageName, 'gammes', page);
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			})

            test ('DataGrid [GAMMES] - Check', async () => {							
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAutoGammes.dataGridListeGammes,    
					desc        : 'DataGrid [LISTE DES GAMMES]',
					verbose     : false,
					column      :   
						[
							'** skip **',
                            'Rayon',
                            'Désignation',
                            'Enseignes',
                            'Contient aussi',
                            'Ne contient pas',
                            'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

            test ('Button [CREER] - Is Visible', async () => {
				await fonction.isDisplayed(pageAutoGammes.buttonCreer);
			})

            test ('Button [MODIFIER] - Is Visible', async () => {
				await fonction.isDisplayed(pageAutoGammes.buttonModifier);
			})

            test ('Button [SUPPRIMER] - Is Visible', async () => {
				await fonction.isDisplayed(pageAutoGammes.buttonSupprimer);
			})

			var nomPopin = "Création d'une gamme";
			test.describe ('Popin [' + nomPopin + ']',  async () => {

				test ('Button [CREER] - Click', async () => {
					await fonction.clickElement(pageAutoGammes.buttonCreer);
				})

				test ('ListBox [RAYON] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoGammes.pPAddListBoxRayon);
				})

				test ('InputField [DESIGNATION] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoGammes.pPAddInputDesignation);
				})

				test ('InputField [ENSEIGNE] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoGammes.pPAddInputEnseigne);
				})

				test ('InputField [CONTIENT MAGASIN] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoGammes.pPAddInputContient);
				})

				test ('InputField [NE CONTIENT PAS MAGASIN] - Is Visible', async () => {
					await fonction.isDisplayed(pageAutoGammes.pPAddInputContientPas);
				})

				test ('Button [ENREGISTRER] - Click', async () => {
					await fonction.isDisplayed(pageAutoGammes.pPAddButtonEnregistrer);
				})

				test ('Link [ANNULER] - Click', async () => {
					await fonction.clickElement(pageAutoGammes.pPAddLinkAnnuler);
				})

			})

        }); // Onglet Gammes

        test.describe ('Onglet [RECOMMANDATIONS D\'OUVERTURE]', async () => {        
			
			test ('Onglet [RECOMMANDATIONS D\'OUVERTURE] - Click', async () => {
				await menu.clickOnglet(pageName, 'recomOuverture', page);
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			})

            test ('DataGrid [RECOMMANDATIONS] - Check', async () => {							
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAutoRecomOuvert.dataGridListeRecom,    
					desc        : 'DataGrid [LISTE DES RECOMMANDATIONS]',
					verbose     : false,
					column      :   
						[
                            'Famille',
                            'Sous-famille',
							'Code',
                            'Article',
                            'Gammes',
							'Plateformes',
							'Stratégies',
							'Clientèle',
							//'Habitudes alim.',
							//'Taille SMEVA CR',
						    //'Taille meuble UF',
							'Régionalisation',
                            'Nb magasins max',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

            test ('Button [ENREGISTRER] - Is Visible', async () => {
				var sTexte = 'Enregistrer';
				await fonction.isDisplayed(pageAutoRecomOuvert.buttonEnregistrer.filter({hasText:sTexte}));
			})

            test ('ListBox [GROUPE ARTICLE] - Is Visible', async () => {
				await fonction.isDisplayed(pageAutoRecomOuvert.listBoxGroupeArticle);
			})

            test ('ListBox [DOSSIER ACHAT] - Is Visible', async () => {
				await fonction.isDisplayed(pageAutoRecomOuvert.multiSelectDossierAchat);
			})

        }); // Onglet Recommandations D'ouverture

		test.describe ('Onglet [PRIX LOCAUX]', async () => {        
	 
			test ('Onglet [PRIX LOCAUX] - Click', async () => {
				await menu.clickOnglet(pageName, 'prixLocaux', page);
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('InputField [CODE / DESIGNATION] - Check', async () => {
				await fonction.isDisplayed(pageAutoPrixLocaux.inputCodeDesignMagasin);
			})

			test ('DataGrid [LISTE DES MAGASINS] - Check', async () => {							
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageAutoPrixLocaux.dataGridListeMagasins,    
					desc        : 'DataGrid [LISTE DES MAGASINS]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Code',
							'Désignation',
							'Externe',
							'Région géographique',
							'Région',
							'Secteur',
							'Nouveau',
							'Stratégie',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
		   
			test ('Button [ENREGISTRER] - Is Visible', async () => {
				await fonction.isDisplayed(pageAutoPrixLocaux.buttonEnregistrer);
			})

		});  // Onglet PRIX LOCAUX 

	});  // Page AUTORISATIONS

	test.describe ('Page [REFERENTIEL]', async () => {

		var pageName = 'referentiel';

		test ('Page [REFERENCTIEL] - Click', async () => {
			await menu.click(pageName, page);
		});    

		test.describe ('Onglet [COMMUNICATION]', async () => {

			test ('Onglet [COMMUNICATION] - Click', async () => {
				await menu.clickOnglet(pageName, 'communication', page);
			})  

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 
			
			test ('Button, textarea and p-select [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageCommunication.textareaMessageFr);
				await fonction.isDisplayed(pageCommunication.textareaMessageIt);
				await fonction.isDisplayed(pageCommunication.pSelectCouleurMessage);
				await fonction.isDisplayed(pageCommunication.buttonTraduireMessage);
				await fonction.isDisplayed(pageCommunication.buttonCommuniquer);
				await fonction.isDisplayed(pageCommunication.buttonSupprimer);
			}) 

		});  // Onglet COMMUNICATION

		test.describe ('Onglet [RENVOYER COMMANDES]', async () => {

			test ('Onglet [RENVOYER COMMANDES] - Click', async () => {
				await menu.clickOnglet(pageName, 'renvoyer', page);
			})  
	
			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Button, datePicker and input [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageRenvoyerCdes.datePickerDateCommande);
				await fonction.isDisplayed(pageRenvoyerCdes.inputGroupeArticle);
				await fonction.isDisplayed(pageRenvoyerCdes.inputAssortiment);
				await fonction.isDisplayed(pageRenvoyerCdes.buttonRechercher);
				await fonction.isDisplayed(pageRenvoyerCdes.buttonRenvoyerCommandesSel);
			})

			test ('DataGrid [ENVOYER COMMANDE] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageRenvoyerCdes.datagridCommandes,    
					desc        : 'DataGrid [STOCK DLC]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Magasin',
							'Statut',
							'Date de livraison',
							'Date du dernier envoi'
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			})

		});  // Onglet RENVOYER COMMANDES

		test.describe ('Onglet [SUPPRIMER]', async () => {
 
			test ('Onglet [SUPPRIMER] - Click', async () => {
				await menu.clickOnglet(pageName, 'suppimer', page);
			}) 
	
			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Input and datePicker [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageSupprimerCdes.datePickerDateCommande);
				await fonction.isDisplayed(pageSupprimerCdes.inputGroupeArticle);
				await fonction.isDisplayed(pageSupprimerCdes.inputCommande);
				await fonction.isDisplayed(pageSupprimerCdes.inputCommandeAssortiment);
				await fonction.isDisplayed(pageSupprimerCdes.inputCodeClientsMagasins);
			})

		});  // Onglet SUPPRIMER

		test.describe ('Onglet [MODIFIER ENGAGEMENTS]', async () => {
 
			test ('Onglet [MODIFIER ENGAGEMENTS] - Click', async () => {
				await menu.clickOnglet(pageName, 'modifEngagement', page);
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Input, checkBox and datePicker [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageModifEngagements.datePickerDateLivraison);
				await fonction.isDisplayed(pageModifEngagements.datePickerNoulDateLivraison);
				await fonction.isDisplayed(pageModifEngagements.inputGroupeArticle);
				await fonction.isDisplayed(pageModifEngagements.inputGroupeArticleRetraiter);
				await fonction.isDisplayed(pageModifEngagements.inputEngagement);
				await fonction.isDisplayed(pageModifEngagements.inputRecalculerEngagement);
				await fonction.isDisplayed(pageModifEngagements.checkBoxRecalculerEngagement);
				await fonction.isDisplayed(pageModifEngagements.checkBoxRenvoyerEngagement);
				await fonction.isDisplayed(pageModifEngagements.inputCodesArticles);
				await fonction.isDisplayed(pageModifEngagements.inputCodeClientsMagasins);
				await fonction.isDisplayed(pageModifEngagements.inputCodesRefGamme);
			})

		});  // Onglet MODIFIER ENGAGEMENTS    

		test.describe ('Onglet [GENERATIONS COMMANDES]', async () => {
			
			test ('Onglet [GENERATIONS COMMANDES] - Click', async () => {
				await menu.clickOnglet(pageName, 'GenerAuto', page);
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 
			
			test ('Button, select, input and datePicker [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageGenerAuto.selectGroupeArticle);
				await fonction.isDisplayed(pageGenerAuto.inputEngagement);
				await fonction.isDisplayed(pageGenerAuto.buttonGenerer);
			}) 
		});      

		test.describe ('Onglet [SUIVI GENERATIONS AC]', async () => {
			
			test ('Onglet [SUIVI GENERATIONS AC] - Click', async () => {
				await menu.clickOnglet(pageName, 'suiviGener', page);
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('DataGrid [GENERATION DE COMMANDES] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageSuiviGenerAC.datagridGenererCommandes,    
					desc        : 'DataGrid [GENERATION DE COMMANDES]',
					verbose     : false,
					column      :   
						[
							'** skip **',
							'Groupe article',
							'Assortiment',
							'Groupe de commande',
							'Date de commande',
							'Début de génération théorique',
							'Résumé',
							'Nb mag. grp. cde',
							'Nb cdes à générer',
							'Nb cdes générées',
							'Nb cdes non générées',
							'Nb cdes non envoyées',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			})

		});  // Onglet SUIVI GENERATION AC 

		test.describe ('Onglet [EXECUTORS]', async () => {

			test ('Onglet [EXECUTORS] - Click', async () => {
				await menu.clickOnglet(pageName, 'executor', page);
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Button [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageRefExecutor.buttonRafaichir);
				await fonction.isDisplayed(pageRefExecutor.buttonExecutorRafaichir);
				await fonction.isDisplayed(pageRefExecutor.buttonSupprimer);
			}) 

			test ('DataGrid [EXECUTORS] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageRefExecutor.datagridExecutors,    
					desc        : 'DataGrid [EXECUTORS]',
					verbose     : false,
					column      :   
						[
							'',
							'** skip **',
							'Temps d\'attente en secondes',
							'Type',
							'Utilisateur',
							'Lieux de vente',
							'Assortiment',
							'Groupe de commande',
							'Codes Magasins',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			})

		});  // Onglet EXECUTORS

		test.describe ('Onglet [CHANGELOG]', async () => {

			test ('Onglet [CHANGELOG] - Click', async () => {
				await menu.clickOnglet(pageName, 'changelog', page);
			})

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

		});  // Onglet CHANGELOG

		test.describe ('Onglet [PARAMETRAGES]', async () => {

			test ('Onglet [PARAMETRAGES] - Click', async () => {
				await menu.clickOnglet(pageName, 'parametrage', page);
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Button [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageRefParametrage.buttonEnregistrer);
			}) 

			test ('DataGrid [PARAMETRAGE] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageRefParametrage.dataGridParametrage,    
					desc        : 'DataGrid [PARAMETRAGE]',
					verbose     : false,
					column      :   
						[
							'Code',
							'Désignation',
							'Valeur'
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			})

		});  // Onglet PARAMETRAGES         

		test.describe ('Onglet [LDV]', async () => {

			test ('Onglet [LDV] - Click', async () => {
				await menu.clickOnglet(pageName, 'LDV', page);
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Button [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageLDV.buttonEnregistrer);
			}) 

			test ('DataGrid [LDV] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageStockDLC.dataGridStockDlc,    
					desc        : 'DataGrid [LDV]',
					verbose     : false,
					column      :   
						[
							'Lieux de vente',
							'Adresse MAC imprimante A8 bluetooth',
							'Adresse MAC imprimante A6 bluetooth',
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			})

		});  // Onglet LDV

		test.describe ('Onglet [STOCK DLC]', async () => {
 
			test ('Onglet [STOCK DLC] - Click', async () => {
				await menu.clickOnglet(pageName, 'stockDLC', page);
			}) 

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Button, input, select [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageStockDLC.buttonAppliquerParametrage);
				await fonction.isDisplayed(pageStockDLC.buttonAjouter);
				await fonction.isDisplayed(pageStockDLC.lieuVente);
				await fonction.isDisplayed(pageStockDLC.groupeArticle);
			}) 

			test ('DataGrid [STOCK DLC] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageStockDLC.dataGridStockDlc,    
					desc        : 'DataGrid [STOCK DLC]',
					verbose     : false,
					column      :   
						[
							'Code lieu de vente',
							'Lieu de vente',
							'Code groupe',
							'Groupe article',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			})

			test ('Button [APPLIQUER LE PARAMETRAGE] - Check', async () => {
				await fonction.clickElement(pageStockDLC.buttonAppliquerParametrage);
			})

			test.describe ('Popin [CONFIRMATION]', async () => {

				test ('Popin [CONFIRMATION] [VISIBLE] - Check', async () => {
					await fonction.popinVisible(page, 'CONFIRMATION', true);
				})

				test ('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test ('Button and link [Is - visible] - Check', async () => {
					await fonction.isDisplayed(pageStockDLC.pButtonConfimer);            
					await fonction.isDisplayed(pageStockDLC.pLinkConfirAnnuler);
				})     
				
				test ('Link [ANNULER] - Click', async () => {
					await fonction.clickElement(pageStockDLC.pLinkConfirAnnuler);     
				})

				test ('Popin [OUVERTURE EN CAISSE] [INVISIBLE] - Check', async () => {
					await fonction.popinVisible(page, 'OUVERTURE EN CAISSE', false);
				})

			}); // End test.describe Popin

		});  // Onglet STOCK DLC       

		test.describe ('Onglet [UTILISATEURS]', async () => {

			test ('Onglet [UTILISATEURS] - Click', async () => {
				await menu.clickOnglet(pageName, 'utilisateurs', page);
			})   

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Button, input [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageReferentielUser.buttonRechercher);
				await fonction.isDisplayed(pageReferentielUser.inputIdentifiant);
				await fonction.isDisplayed(pageReferentielUser.buttonEnregistrer);
			})      

		});  // Onglet UTILISATEURS

		test.describe ('Onglet [VERROUS]', async () => {

			test ('Onglet [VERROUS] - Click', async () => {
				await menu.clickOnglet(pageName, 'verrous', page);
			})   

			test ('Message [ERREUR] - Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Button, input [Is - visble] - Check', async () => {
				await fonction.isDisplayed(pageReferentielVerrous.buttonRafraichir);
				await fonction.isDisplayed(pageReferentielVerrous.buttonSupprimer);
			})   
			
			test ('DataGrid [VERROUS] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageReferentielVerrous.datagridListeVerrous.locator('th'),    
					desc        : 'DataGrid [VERROUS]',
					verbose     : false,
					column      :   
						[
							"0",
							"Date",
							"Type verrou",
							"Groupe article",
							"Type assortiment",
							"Assortiment",
							"Code article",
							"Désignation article",
						    "Utilisateur",
							"Actions"
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			})

		});  // Onglet Verrous

	});  // Page REFERENTIEL

	test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})
