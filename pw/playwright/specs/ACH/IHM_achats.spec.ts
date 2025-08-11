/**
 * 
 * 
 * @author JC CALVIERA
 * @since 2023-09-26
 * 
 */

const xRefTest      = "ACH_IHM_GLB";
const xDescription  = "Examen de l'IHM Achats";
const xIdTest       =  361;
const xVersion      = '3.17';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'ACH',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['langue'],
	fileName    : __filename
};

//------------------------------------------------------------------------------------

import { expect, test, type Page }  			from '@playwright/test';
import { CartoucheInfo, TypeListOfElements } 	from '@commun/types';

//-- Helpers

import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { Log }              from '@helpers/log.js';

//-- Pages Objects

import { MenuAchats }       from '@pom/ACH/menu.page.js';

import { PageAccReclot }    from '@pom/ACH/accueil_recherche-lot.page.js';
import { PageAccSynAch }    from '@pom/ACH/accueil_synthese-achats-courants.page.js';
 
import { PageAchAnalyse }   from '@pom/ACH/achats_analyse-journee.page.js';
import { PageAchCalApp }    from '@pom/ACH/achats_calendrier-approvisionnement.page.js';
import { PageAchAchFour }   from '@pom/ACH/achats_achats-fournisseurs.page.js';
import { PageAchFraiFac }   from '@pom/ACH/achats_frais-factures-a-part.page.js';

import { PageBesBesMag }    from '@pom/ACH/besoins_besoins-magasin.page.js';
import { PageBesVenArt }    from '@pom/ACH/besoins_ventilation-articles.page.js';
import { PageBesVenMag }    from '@pom/ACH/besoins_ventilation-magasins.page.js';
import { PageBesConFou }    from '@pom/ACH/besoins_besoins-consolides-fournisseur.page.js';

import { PageAspAsp }       from '@pom/ACH/achats-sur_place_achats-sur-place.page.js';
import { PageAspGld }       from '@pom/ACH/achats-sur_place_groupes-livraison-directe.page.js';

import { PageLitLitMan }    from '@pom/ACH/litiges_litiges-manuels.page.js';
import { PageLitLitAut }    from '@pom/ACH/litiges_litiges-automatiques.page.js';
import { PageLitDemAvo }    from '@pom/ACH/litiges_demandes-avoir.page.js';

import { PageHisArrLot }    from '@pom/ACH/historique_arrivages-lots.page.js';
import { PageHisLotRec }    from '@pom/ACH/historique_lots-receptionnes-non-factures.page.js'; 

import { PageAnaCmp }       from '@pom/ACH/analyse_campagne.page.js';
import { PageAnaEvaPri }    from '@pom/ACH/analyse_evaluation-prix-revient.page.js';

import { PageRefArt }       from '@pom/ACH/referentiel_articles.page.js';
import { PageRefFou }       from '@pom/ACH/referentiel_fournisseurs.page.js';
import { PageRefForPal }    from '@pom/ACH/referentiel_format-palette.page.js';
import { PageRefGen }       from '@pom/ACH/referentiel_gencods.page.js';
import { PageRefEmb }       from '@pom/ACH/referentiel_emballages.page.js';
import { PageRefCond }      from '@pom/ACH/referentiel_conditionnements.page.js';
import { PageRefDosAch }    from '@pom/ACH/referentiel_dossiers-achats.page.js';
import { PageRefFrais }     from '@pom/ACH/referentiel_frais.page.js';
import { PageRefAppAut }    from '@pom/ACH/referentiel_approvisionnement-auto.page.js';
import { PageRefUniTrp }    from '@pom/ACH/referentiel_unites-transport.page.js';
import { PageRefFraTrp }    from '@pom/ACH/referentiel_frais-transport.page.js';

import { PageAdmDif }          from '@pom/ACH/admin_diffusion.page.js';
import { PageAdmParametrages } from '@pom/ACH/admin_parametrage.page.js';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;

var log             = new Log();
const fonction      = new TestFunctions(log);

let pageAccRecLot   : PageAccReclot;
let pageAccSynAch   : PageAccSynAch;

let pageAchAnalyse  : PageAchAnalyse; 
let pageAchCalApp   : PageAchCalApp;
let pageAchAchFour  : PageAchAchFour;
let pageAchFraiFac  : PageAchFraiFac;

let pageBesBesMag   : PageBesBesMag;
let pageBesVenArt   : PageBesVenArt;
let pageBesVenMag   : PageBesVenMag;
let pageBesConFou   : PageBesConFou;

let pageAspAsp      : PageAspAsp;   
let pageAspGld      : PageAspGld;

let pageLitMan      : PageLitLitMan;
let pageLitAut      : PageLitLitAut;
let pageLitAvoir    : PageLitDemAvo;

let pageHisLot      : PageHisArrLot;
let pageHisRec      : PageHisLotRec;

let pageAnaCmp      : PageAnaCmp;
let pageAnaEvaPri   : PageAnaEvaPri;

let pageRefArticle  : PageRefArt;
let pageRefFourn    : PageRefFou;
let pageRefFormPal  : PageRefForPal;
let pageRefGencod   : PageRefGen;
let pageRefEmbal    : PageRefEmb;
let pageRefCond     : PageRefCond;
let pageRefDosAch   : PageRefDosAch;
let pageRefFrais    : PageRefFrais;
let pagerefApprAuto : PageRefAppAut;
let pageRefUniTrp   : PageRefUniTrp;
let pageRefFraisTrp : PageRefFraTrp;

let pageAdminDif    : PageAdmDif;
let pageAdmPara     : PageAdmParametrages;
//------------------------------------------------------------------------------------

fonction.recordDatas(false);		//-- Inutile de créer une fiche de données

const sLangue:string= fonction.getInitParam('langue', 'fr');

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {

	page            = await browser.newPage();

	pageAccRecLot   = new PageAccReclot(page);
	pageAccSynAch   = new PageAccSynAch(page);

	pageAchAnalyse  = new PageAchAnalyse(page);
	pageAchCalApp   = new PageAchCalApp(page);
	pageAchAchFour  = new PageAchAchFour(page);
	pageAchFraiFac  = new PageAchFraiFac(page);

	pageBesBesMag   = new PageBesBesMag(page);
	pageBesVenArt   = new PageBesVenArt(page);
	pageBesVenMag   = new PageBesVenMag(page);
	pageBesConFou   = new PageBesConFou(page);

	pageAspAsp      = new PageAspAsp(page);
	pageAspGld      = new PageAspGld(page);

	pageLitMan      = new PageLitLitMan(page);
	pageLitAut      = new PageLitLitAut(page);
	pageLitAvoir    = new PageLitDemAvo(page);

	pageHisLot      = new PageHisArrLot(page);
	pageHisRec      = new PageHisLotRec(page);

	pageAnaCmp      = new PageAnaCmp(page);
	pageAnaEvaPri   = new PageAnaEvaPri(page);

	pageRefArticle  = new PageRefArt(page);
	pageRefFourn    = new PageRefFou(page);
	pageRefFormPal  = new PageRefForPal(page);
	pageRefGencod   = new PageRefGen(page);
	pageRefEmbal    = new PageRefEmb(page);
	pageRefCond     = new PageRefCond(page);
	pageRefDosAch   = new PageRefDosAch(page);
	pageRefFrais    = new PageRefFrais(page);
	pagerefApprAuto = new PageRefAppAut(page);
	pageRefUniTrp   = new PageRefUniTrp(page);
	pageRefFraisTrp = new PageRefFraTrp(page);

	pageAdminDif    = new PageAdmDif(page);
	pageAdmPara     = new PageAdmParametrages(page);
	
	menu			= new MenuAchats(page,fonction);

	const helper	= new Help(info, testInfo, page);
	
	await menu.searchNewElements(testInfo);
	await helper.init();

});

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
	});

	test ('Connexion', async () => {
		await fonction.connexion(page);
		if (sLangue !== 'fr') {
			await menu.selectLang(sLangue, page);
			fonction.setCheckTraductions(true);
		}
	});

	test.describe ('Page [ACCUEIL]', async() => {

		var pageName = 'accueil';

		var sNomOnglet = "Recherche lot";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('ListBox [RAYON] = "Fruits et légumes"', async() => {
				await menu.selectRayonByName('Fruits et légumes', page);
			})

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'rechercheLot', page);
			});

			test ('Input [NUMERO ACHAT] - Is Visible', async() => {  
				await fonction.isDisplayed(pageAccRecLot.inputNumAchat); 
			});

			test ('Input [NUMERO LOT] - Is Visible', async() => {  
				await fonction.isDisplayed(pageAccRecLot.inputNumLot); 
			});
			
			test ('DataGrid [ACHATS] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements = {
					element     : pageAccRecLot.dataGridListeachats,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'N° achat',
							'Fournisseur',
							'Date de réception',
							'Statut',
							'Réaffecté',
							'Numéros de lot',
							'Actions'   
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

		})

		sNomOnglet = "Synthèse achats courants";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'syntheseAchatsCourants', page);
			});

			test ('Input [FOURNISSEUR] - Check', async() => {  
				await fonction.isDisplayed(pageAccSynAch.inputFournisseur); 
			});

			test ('Input [ARTICLE] - Check', async() => {  
				await fonction.isDisplayed(pageAccSynAch.inputArticle); 
			});

			test ('ListBox [PLATEFORME DISTRIBUTION] - Check', async() => {  
				await fonction.isDisplayed(pageAccSynAch.listBoxPlateformeDistrib); 
			});
			
			test ('ListBox [ACHETEUR] - Check', async() => {  
				await fonction.isDisplayed(pageAccSynAch.listBoxAcheteur); 
			});

			test ('ListBox [DOSSIER D\'ACHAT] - Check', async() => {  
				await fonction.isDisplayed(pageAccSynAch.listBoxDossierAchat); 
			});

			test ('CheckBox [ACHATS NON RECEPTIONNES] - Check', async() => {  
				await fonction.isDisplayed(pageAccSynAch.checkBoxAchatNonReceptionne); 
			});

			test ('Button [RECHERCHER] - Check', async() => {  
				await fonction.isDisplayed(pageAccSynAch.buttonRechercher); 
			});

			test ('Button [VISUALISER] - Check', async() => {  
				await fonction.isDisplayed(pageAccSynAch.buttonVisualiser); 
			});

			test ('DataGrid [LISTE ACHATS] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements = {
					element     : pageAccSynAch.dataGridAchats,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'Numéro d\'Achat',
							'Acheteur',
							'Fournisseur',
							'Début de réception',
							'Plateforme de réception',
							'Date expédition',
							'Statut',
							'Plateforme de distribution',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
		})
	})

	test.describe ('Page [ACHATS]', async() => {

		var pageName = 'achats';

		test ('Page [ACHATS] - Click', async() => {
			await menu.click(pageName, page);
		});

		var sNomOnglet = "ANALYSE JOURNEE";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'analyseJournee', page);         
			});

			test ('Wait [SPINNER] - Is NOT Visible',async() => {
				await pageAchAnalyse.spinner.isHidden({timeout:10000});
			})

			test ('Button [MODIFIER] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchAnalyse.buttonModifier);
			})

			test ('Button [EXPORTER] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchAnalyse.buttonExporter);
			})

			test ('Button [TRANSMETTRE LES VOLUMES] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchAnalyse.buttonTransmettre);
			})

			test ('Button [DATEPICKER] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchAnalyse.buttonDatePicker);
			})

			test ('ListBox [PLATEFORME] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchAnalyse.selectBoxPlateforme);
			})

			test ('ListBox [DOSSIER D\'ACHAT] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchAnalyse.listBoxDossierAchat);
			})

			test ('InputField [CODE ARTICLE] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchAnalyse.inputFiltreIdArticle);
			})

			test ('InputField [LIBELLE ARTICLE] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchAnalyse.inputFiltreLibArticle);
			})
			
			test ('Toggle [DETAIL PAR PLATEFORME] - Is Visible',async() => {
				await pageAchAnalyse.buttonParametrage.hover({timeout:1000});
				await fonction.isDisplayed(pageAchAnalyse.checkBoxDetailPtfDistri);
			})

			test ('Toggle [AFFICHER LE PREVISIONNEL] - Is Visible',async() => {
				await pageAchAnalyse.buttonParametrage.hover({timeout:1000});
				await fonction.isDisplayed(pageAchAnalyse.checkBoxAfficherPrevisionnel);
			})

			test ('Toggle [AFFICHER CONSIGNES] - Is Visible',async() => {
				await pageAchAnalyse.buttonParametrage.hover({timeout:1000});
				await fonction.isDisplayed(pageAchAnalyse.checkBoxAfficherConsignes);
			})

			test ('Toggle [AFFICHER TOUS LES ARTICLES] - Is Visible',async() => {
				await pageAchAnalyse.buttonParametrage.hover({timeout:1000});
				await fonction.isDisplayed(pageAchAnalyse.checkBoxAfficherTout);
			})

			test ('ListBox [COMMANDES CUMULES] - Is Visible',async() => {
				await pageAchAnalyse.buttonParametrage.hover({timeout:1000});
				await fonction.isDisplayed(pageAchAnalyse.listBoxCmdesCumules);
			})
			test ('ListBox [PREVISIONS CUMULES] - Is Visible',async() => {
				await pageAchAnalyse.buttonParametrage.hover({timeout:1000});
				await fonction.isDisplayed(pageAchAnalyse.listBoxPrevisionsCumules);
			})

			test ('DataGrid [LISTE DOSSIERS] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements = {
					element     : pageAchAnalyse.dataGridDossiers,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'Dossier',
							'Code 1',
							'Article',
							'Conditionnement',
							'Plateforme 2',
							'Stock Mag',
							'Cdes Mag',
							'Stock restant',
							'Solde',
							'Prév. Mag.',
							'Acheté',
							'Confirmé',
							'Estimé',
							'Refusé',
							'Agréé',
							'Non affecté',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

		})

		var sNomOnglet = "CALENDRIER D\'APPROVISIONNEMENT";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'calendrierAppro', page);
			});

			test ('InputField [FOURNISSEUR] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchCalApp.inputCodeFournisseur);
			})

			test ('ListBox [DOSSIER D\'ACHAT] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchCalApp.listBoxDossierAchat);
			})

			test ('ListBox [CENTRALE D\'ACHAT] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchCalApp.listBoxCentraleAchat);
			})

			test ('DatePicker [ACHATS A EFFECTUER DU] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchCalApp.datePickerAchatsDu);
			})

			test ('Toogle [VOIR AUTRES FOURNISSEURS] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchCalApp.toggleAutresFourn);
			})

		})

		var sNomOnglet = "ACHATS AUX FOURNISSEURS";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'achatsAuxFournisseurs', page);
			});

			test ('Wait [SPINNER] - Is NOT Visible',async() => {
				await pageAchAchFour.spinner.isHidden({timeout:10000});
			})

			test ('Button [CREER ACHAT] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchAchFour.buttonCreerAchat);
			})

			test ('Button [MODIFIER] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchAchFour.buttonModifier);
			})

			test ('Button [VOIR DETAIL] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchAchFour.buttonVoirDetail);
			})

			test ('Button [IMPRIMER BC] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchAchFour.buttonImprimerBC);
			})

			test ('Button [ENVOYER BC PAR MAIL] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchAchFour.buttonEnvoyerBCparMail);
			})

			test ('Button [MODIFIER LE COMMENTAIRE DE L\'ACHAT] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchAchFour.buttonModifierCommAchat);
			})

			test ('Button [FRAIS DE PRESTATION] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchAchFour.buttonFraisPrestation);
			})

			test ('Button [TOUS LES ACHATS POUR LE FOURNISSEUR] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchAchFour.buttonTousAchatsPourFourn);
			})

			test ('Button [SUPPRIMER] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchAchFour.buttonSupprimer);
			})

		})

		var sNomOnglet = "FRAIS FACTURES A PART";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'fraisFactures', page);
			});

			test ('Button [ACHETER DES FRAIS] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchFraiFac.buttonAcheterDesFrais);
			})

			test ('Button [MODIFIER DES FRAIS] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchFraiFac.buttonModifierDesFrais);
			})

			test ('Button [REPARTIR DES FRAIS] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchFraiFac.buttonRepartirLesFrais);
			})

			test ('Button [RECHERCHER] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchFraiFac.buttonRechercher);
			})

			test ('Button [DATE PICKER] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchFraiFac.buttondatePicker);
			})

			test ('DataGrid [LISTE DES FRAIS] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageAchFraiFac.dataGridAchats,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'Numéro d\'achat',
							'Date d\'achat',
							'Acheteur',
							'Fournisseur',
							'Plateforme de réception',
							'Type(s)',
							'Frais répartis sur',
							'Total HT (€)',
							'N° Facture / N° BL',
							'Facturé',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			test ('ListBox [ACHETEURS] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchFraiFac.listBoxAcheteurs);
			})

			test ('InputField [CODE OU DESIGNATION FOURNISSEUR] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchFraiFac.inputDesignFournisseur);
			})

			test ('InputField [NUMERO DE FACTURE] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchFraiFac.inputNumFacture);
			})

			test ('Filtre [BL] - Is Visible',async() => {
				await fonction.isDisplayed(pageAchFraiFac.inputFiltreBL);
			})
		})
	})

	test.describe ('Page [BESOINS MAGASIN]', async() => {

		var pageName = 'besoins';

		test ('Page [BESOINS MAGASIN] - Click', async() => {
			await menu.click(pageName, page);
		}); 

		var sNomOnglet = "BESOINS MAGASIN";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Button [MAGASINS SANS COMMANDES] - Is Visible',async() => {                
				await fonction.isDisplayed(pageBesBesMag.buttonMagasinsSansCommande);
			})

			test ('Button [EXPORTER BESOINS] - Is Visible',async() => {
				await fonction.isDisplayed(pageBesBesMag.buttonExporterBesoins);
			})

			test ('InputField [REFERENCE DE GAMME] - Is Visible',async() => {
				await fonction.isDisplayed(pageBesBesMag.inputReferenceGamme);
			})

			test ('InputField [ARTICLE] - Is Visible',async() => {
				await fonction.isDisplayed(pageBesBesMag.inputCodeArticle);
			})

			test ('ListBox [STRATEGIE] - Is Visible',async() => {
				await fonction.isDisplayed(pageBesBesMag.listBoxStrategie);
			})

			test ('CheckBox [EXTERNE OUI] - Is Visible',async() => {
				await fonction.isDisplayed(pageBesBesMag.checkBoxFiltreExterneOui);
			})

			test ('CheckBox [EXTERNE NON] - Is Visible',async() => {
				await fonction.isDisplayed(pageBesBesMag.checkBoxFiltreExterneNon);
			})

			test ('ListBox [VENTILATION DES MAGASINS] - Is Visible',async() => {
				await fonction.isDisplayed(pageBesBesMag.listBoxVentilMag);
			})

			test ('ListBox [REGION GEOGRAPHIQUE] - Is Visible',async() => {
				await fonction.isDisplayed(pageBesBesMag.listBoxRegionGeographique);
			})

			test ('ListBox [SECTEUR PROSOL] - Is Visible',async() => {
				await fonction.isDisplayed(pageBesBesMag.listBoxSecteurProsol);
			})

			test ('ListBox [REGION PROSOL] - Is Visible',async() => {
				await fonction.isDisplayed(pageBesBesMag.listBoxRegionProsol);
			})

			test ('ListBox [CARACTERISTIQUES] - Is Visible',async() => {
				await fonction.isDisplayed(pageBesBesMag.listBoxCaracteristiqueMag);
			})

			test ('Button [AJOUTER] - Is Visible', async() => {
				await fonction.isDisplayed(pageBesBesMag.buttonAjouter);
			})

			//-------------------------------------------------------------------------------------------------------------------------- 
			test ('DataGrid [BESOINS MAGASIN] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageBesBesMag.dataGridBesoinMagasin,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'Plateforme de distribution',
							'Code magasin',
							'Magasin',
							'Stock magasin',
							'Prévision de commande à J-1',
							'Commande',
							'',
							'Prévision de commande à J+1',
							'Estimé à J+2',
							'Substitution',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			//-------------------------------------------------------------------------------------------------------------------------- 
			test ('DataGrid [BESOINS MAGASIN TOTAL] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageBesBesMag.dataGridBesoinMagasinTotal,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'Plateforme de distribution',
							'Code magasin',
							'Magasin',
							'Stock magasin',
							'Prévision de commande à J-1',
							'Commande',
							'',
							'Prévision de commande à J+1',
							'Estimé à J+2',
							'Substitution',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			//-------------------------------------------------------------------------------------------------------------------------- 

			var sNomPopin = "LISTE MAGASINS SANS BESOINS";
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {
				
				test ('Button [MAGASIN SANS COMMANDES] - Click', async() => {  
					const iDelai:number = 60000;
					test.setTimeout(iDelai);
					await fonction.clickAndWait(pageBesBesMag.buttonMagasinsSansCommande, page, iDelai);        
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async() => {          
					await fonction.popinVisible(page, sNomPopin);
				})				

				test ('** Wait Until Spinner Off **', async () => {
					var iDelaiTest = 120000;
					test.setTimeout(iDelaiTest);
					await expect(pageBesBesMag.pPspinner.first()).not.toBeVisible({timeout:iDelaiTest});
				})

				test ('Button [FERMER] - Click', async() => {  
					await fonction.clickAndWait(pageBesBesMag.buttonPPFermer, page);  
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async() => {          
					await fonction.popinVisible(page, sNomPopin, false);
				})

			})

		})

		var sNomOnglet = "VENTILATIONS DES ARTICLES";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [VENTILATIONS DES ARTICLES] - Click', async() => {
				await menu.clickOnglet(pageName, 'ventilationsArticles', page);
			});

			test ('Button [CREER UNE VENTILATION] - Is Visible', async() => {
				await fonction.isDisplayed(pageBesVenArt.buttonCreerUneVentilation);
			})

			test ('Button [MODIFIER UNE VENTILATION] - Is Visible', async() => {
				await fonction.isDisplayed(pageBesVenArt.buttonModifierUneVentilation);
			})

			test ('Button [ATTRIBUER UN ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageBesVenArt.buttonAttribuerArticle);
			})

			test ('Button [RETIRER UN ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageBesVenArt.buttonRetirerArticle);
			})

			test ('InputField [RETIRER UN ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageBesVenArt.inputArticleVentilation);
			})

			test ('InputField [ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageBesVenArt.inputArticleArticle);
			})

			test ('InputField [FOURNISSEUR] - Is Visible', async() => {
				await fonction.isDisplayed(pageBesVenArt.inputFournisseur);
			})

			test ('ListBox [GROUPES ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageBesVenArt.listBoxGroupe);
			})

			test ('InputField [ARTICLE (bloc 1)] - Is Visible', async() => {
				await fonction.isDisplayed(pageBesVenArt.inputArticleSelectionne);
			})


			//-------------------------------------------------------------------------------------------------------------------------- 
			test ('DataGrid [LISTE DES VENTILATIONS] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageBesVenArt.dataGridListeVentilations,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'Nom de la ventilation',
							'Nb. articles',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			//-------------------------------------------------------------------------------------------------------------------------- 
			test ('DataGrid [LISTE DES ARTICLES] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageBesVenArt.dataGridListeArticles,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'Code article',
							'Designation article',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			//-------------------------------------------------------------------------------------------------------------------------- 
			test ('DataGrid [LISTE DES VENTILATIONS 2] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageBesVenArt.dataGridListeArticlesSelected,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'Code article',
							'Designation article',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//-------------------------------------------------------------------------------------------------------------------------- 


			var sNomPopin = "Création d'une ventilation article";
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

				test ('Button [CREER UNE VENTILATION] - Click', async() => {
					await fonction.clickElement(pageBesVenArt.buttonCreerUneVentilation);                
					await fonction.popinVisible(page, sNomPopin); 
				})

				test ('Button [ENREGISTRER] - Is Visible', async() => {
					await fonction.isDisplayed(pageBesVenArt.pPbuttonEnregistrer);
				})

				test ('InputField [DESIGNATION] - Is Visible', async() => {
					await fonction.isDisplayed(pageBesVenArt.pPinputDesignation);
				})

				test ('Button [FERMER] - Click', async() => {
					await fonction.clickElement(pageBesVenArt.pPbuttonFermer);   
					await fonction.popinVisible(page, sNomPopin, false);              
				})

			})

		})

		var sNomOnglet = "VENTILATIONS DES MAGASINS";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [VENTILATIONS DES MAGASINS] - Click', async() => {
				await menu.clickOnglet(pageName, 'ventilationsMagasins', page);
			});

			test ('Button [CREER UNE VENTILATION MAGASIN] - Is Visible', async() => {
				await fonction.isDisplayed(pageBesVenMag.buttonCreerVentilationMag);
			})

			test ('Button [MODIFIER UNE VENTILATION MAGASIN] - Is Visible', async() => {
				await fonction.isDisplayed(pageBesVenMag.buttonModifierVentilationMag);
			})

			test ('Button [ATTRUBUER MAGASIN] - Is Visible', async() => {
				await fonction.isDisplayed(pageBesVenMag.buttonAttribuerMagasin);
			})

			test ('Button [MODIFIER MAGASIN] - Is Visible', async() => {
				await fonction.isDisplayed(pageBesVenMag.buttonModifierMagasin);
			})

			test ('InputField [MAGASIN] - Is Visible', async() => {
				await fonction.isDisplayed(pageBesVenMag.inputMagasin);
			})

			//-------------------------------------------------------------------------------------------------------------------------- 
			test ('DataGrid [LISTE DES VENTILATIONS] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageBesVenMag.dataGridListeVentilations,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'Nom de la ventilation',
							'Nb. magasins',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//-------------------------------------------------------------------------------------------------------------------------- 

			var sNomPopin = "CREATION D'UNE VENTILATION MAGASIN";
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

				test ('Button [CREER UNE VENTILATION] - Click', async() => {
					await fonction.clickElement(pageBesVenMag.buttonCreerVentilationMag);         
					await fonction.popinVisible(page, sNomPopin);        
				})

				test ('Button [ENREGISTRER] - Is Visible', async() => {
					await fonction.isDisplayed(pageBesVenMag.pPbuttonEnregistrer);
				})

				test ('InputField [DESIGNATION] - Is Visible', async() => {
					await fonction.isDisplayed(pageBesVenMag.pPinputDesignation);
				})

				test ('Button [FERMER] - Click', async() => {
					await fonction.clickElement(pageBesVenMag.pPbuttonFermer);                
					await fonction.popinVisible(page, sNomPopin, false); 
				})

			})
		})

		var sNomOnglet = "BESOINS CONSOLIDES FOURNISSEUR";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [BESOINS CONSOLIDES FOURNISSEUR] - Click', async() => {
				await menu.clickOnglet(pageName, 'besoinsConsolidesFournisseur', page); 
			});

			test ('Button [CREER BESOIN CONSOLIDE FROUNISSEUR] - Is Visible', async() => {
				await fonction.isDisplayed(pageBesConFou.buttonCreerBesoinConsolFourn);
			})

			test ('Button [MODIFIER BESOIN CONSOLIDE FROUNISSEUR] - Is Visible', async() => {
				await fonction.isDisplayed(pageBesConFou.buttonModifBesoinConsolFourn);
			})

			//-------------------------------------------------------------------------------------------------------------------------- 
			test ('DataGrid [LISTE DES VENTILATIONS] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageBesConFou.dataGridListeBesoins,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'Libellé',
							'Identifiant client',
							'Code fournisseur',
							'Fournisseur',
							'Plateforme de distribution',
							'Type d\'envoi',
							'Durée de réception anticipée',
							'Tenir compte du stock plateforme',
							'Transmission PVC',
							'Mode de transmission',
							'Nombre d\'articles',
							'Nombre de magasins',
							'Actif',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//-------------------------------------------------------------------------------------------------------------------------- 

			var sNomPopin = "Création d'un besoin consolidé fournisseur";
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

				test ('Button [' + sNomPopin.toUpperCase() + '] - Click', async() => {
					//await pageBesConFou.buttonCreerBesoinConsolFourn.click();    
					//await fonction.waitTillHTMLRendered(page);  
					await fonction.clickAndWait(pageBesConFou.buttonCreerBesoinConsolFourn, page);
					await fonction.popinVisible(page, sNomPopin);
				})

				test ('Button [ENREGISTRER] - Is Visible', async() => {
					await fonction.isDisplayed(pageBesConFou.pButtonEnregistrer);
				})

				test ('Button [ANNULER] - Is Visible', async() => {
					await fonction.isDisplayed(pageBesConFou.pButtonAnnuler);
				})

				test ('InputField [LIBELLE] - Is Visible', async() => {
					await fonction.isDisplayed(pageBesConFou.pPinputLibelle);
				})

				test ('InputField [GLN CLIENT] - Is Visible', async() => {
					await fonction.isDisplayed(pageBesConFou.pPinputGLNclient);
				})

				test ('InputField [IDENTIFIANT CLIENT] - Is Visible', async() => {
					await fonction.isDisplayed(pageBesConFou.pPinputIdentifiantClient);
				})

				test ('InputField [FOURNISSEUR] - Is Visible', async() => {
					await fonction.isDisplayed(pageBesConFou.pPinputFoursisseur);
				})

				test ('InputField [DUREE RECEPTION ANTICIPE] - Is Visible', async() => {
					await fonction.isDisplayed(pageBesConFou.pPinputDureeReceptionAnticipe);
				})

				test ('ListBox [PLATEFORME] - Is Visible', async() => {
					await fonction.isDisplayed(pageBesConFou.pPlistBoxPlateforme);
				})

				test ('ListBox [VENTILLATION ARTICLE] - Is Visible', async() => {
					await fonction.isDisplayed(pageBesConFou.pPlistBoxVentilationArticle);
				})

				test ('ListBox [VENTILLATION MAGASIN] - Is Visible', async() => {
					await fonction.isDisplayed(pageBesConFou.pPlistBoxVentilationMagasins);
				})

				test ('Switch [ACTIF] - Is Visible', async() => {
					await fonction.isDisplayed(pageBesConFou.pToggleSwitchActif);
				})

				test ('Switch [TENIR COMPTE STOCK PLATEFORME] - Is Visible', async() => {
					await fonction.isDisplayed(pageBesConFou.pToggleSwitchStockPlateforme);
				})

				test ('Switch [TRANSMISSION VPC] - Is Visible', async() => {
					await fonction.isDisplayed(pageBesConFou.pToggleSwitchTransmissionPVC);
				})

				test ('Switch [STRATEGIE SANS PRIX] - Is Visible', async() => {
					await fonction.isDisplayed(pageBesConFou.pToggleSwitchStrategieSansPrix);
				})

				test ('Switch [CROSS DOCK] - Is Visible', async() => {
					await fonction.isDisplayed(pageBesConFou.pToggleSwitchCrossDock);
				})

				test ('Toggle [MODE TRANSMISSION] = EDI - Is Visible', async() => {
					await fonction.isDisplayed(pageBesConFou.pToggleTransmissionEDI);
				})

				test ('Toggle [MODE TRANSMISSION] = FLUX - Is Visible', async() => {
					await fonction.isDisplayed(pageBesConFou.pToggleTransmissionFlux);
				})

				test ('Toggle [MODE TRANSMISSION] = EMAIL - Is Visible', async() => {
					await fonction.isDisplayed(pageBesConFou.pToggleTransmissionEmail);
				})

				test ('Button [ANNULER] - Click', async() => {
					await fonction.clickElement(pageBesConFou.pButtonAnnuler);                
					await fonction.popinVisible(page, sNomPopin, false); 
				})
			})
		})
	})

	test.describe ('Page [ACHATS SUR PLACE]', async() => {

		var pageName = 'achatsSurPlace';

		test ('Page [ACHATS SUR PLACE] - Click', async() => {
			await menu.click(pageName, page);
		});

		var sNomOnglet = "Achats sur place";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'achatsSurPlace', page);
			});

			test ('DatePicker [DATE ACHAT] - Is Visible', async() => {
				await fonction.isDisplayed(pageAspAsp.datePickerAchat);
			})

			test ('InputField [CODE ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageAspAsp.inputFieldFiltreCodeArticle);
			})

			test ('InputField [CODE FOURNISSEUR] - Is Visible', async() => {
				await fonction.isDisplayed(pageAspAsp.inputFieldFiltreFournisseur);
			})

			test ('InputField [MAGASIN] - Is Visible', async() => {
				await fonction.isDisplayed(pageAspAsp.inputFieldFiltreMagasin);
			})

			test ('Button [CREER] - Is Visible', async() => {
				await fonction.isDisplayed(pageAspAsp.buttonCreer);
			})

			//-------------------------------------------------------------------------------------------------------------------------- 
			test ('DataGrid [LISTE DES VENTILATIONS] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageAspAsp.dataGridAchatsSurPlace,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'Numéro d\'achat',
							'N° lot',
							'Code article',
							'Désignation article',
							'Catégorie',
							'Variété',
							'Code fournisseur',
							'Désignation fournisseur',
							'Code magasin',
							'Désignation magasin',
							'Calibre',
							'Conditionnement',
							'Quantité',
							'Dernier prix d\'achat',
							'Prix d\'achat',
							'Unité d\'achat',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//-------------------------------------------------------------------------------------------------------------------------- 

			var sNomPopin = "Création d'un achat sur place";
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

				test ('Button [CREER] - Click', async() => {
					await fonction.clickElement(pageAspAsp.buttonCreer);
					await fonction.popinVisible(page, sNomPopin);
				});  
				
				test ('DatePicker [RECEPTION MAGASIN] - Is Visible', async() => {
					await fonction.isDisplayed(pageAspAsp.pPdatePickerReceoptionMagasin);
				})
				
				test ('Button [ENREGISTRER] - Is Visible', async() => {
					await fonction.isDisplayed(pageAspAsp.pPbuttonEnregistrer);
				})
				
				test ('Button [ANNULER] - Is Visible', async() => {
					await fonction.isDisplayed(pageAspAsp.pPbuttonAnnuler);
				})
				
				test ('Button [ + ] - Is Visible', async() => {
					await fonction.isDisplayed(pageAspAsp.pPbuttonPlus);
				})
				
				test ('InputField [DESIGNATION ARTICLE] - Is Visible', async() => {
					await fonction.isDisplayed(pageAspAsp.pPinputDesignationArticle);
				})
				
				test ('InputField [DESIGNATION FOURNISSEUR] - Is Visible', async() => {
					await fonction.isDisplayed(pageAspAsp.pPinputDesignationFournisseur);
				})
				
				test ('InputField [DESIGNATION MAGASIN] - Is Visible', async() => {
					await fonction.isDisplayed(pageAspAsp.pPinputDesignationMagasin);
				})
				
				test ('InputField BON LIVRAISON] - Is Visible', async() => {
					await fonction.isDisplayed(pageAspAsp.pPinputBonLivraison);
				})

				//-------------------------------------------------------------------------------------------------------------------------- 
				test ('DataGrid [CREATION ACHATS SUR PLACE] - Check', async ({}, testInfo) => {
					var oDataGrid:TypeListOfElements =  
					{
						element     : pageAspAsp.pPdataGridCreationAchatSurPlace,    
						desc        : testInfo.line.toString(),
						verbose     : false,
						column      :   
							[
								'Date réception',
								'Code article',
								'Désignation article',
								'Cat.',
								'Variété',
								'Fournisseur',
								'Centrale d\'achat',
								'Code magasin',
								'Désignation magasin',
								'Calibre',
								'Conditionnement',
								'Origine',
								'Unité d\'achat',
								'Prix d\'achat',
								'Unité de détail',
								'Prix de cession',
								'Qté',
								'Poids',
								'BL',
								'',
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				})
				//-------------------------------------------------------------------------------------------------------------------------- 
 
				test ('Button [ANNULER] - Click', async() => {
					await fonction.clickElement(pageAspAsp.pPbuttonAnnuler);
					await fonction.popinVisible(page, sNomPopin, false);
				});  


			})

		})

		var sNomOnglet = "Groupes de livraison directe";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'groupesLivraisonDirecte', page);
			});

			test ('InputField [CODE MAGASIN] - Is Visible', async() => {
				await fonction.isDisplayed(pageAspGld.inputCodeMagasin);
			})

			test ('Button [CREER GROUPE] - Is Visible', async() => {
				await fonction.isDisplayed(pageAspGld.buttonCreerGroupe);
			})

			test ('Button [MODIFIER GROUPE] - Is Visible', async() => {
				await fonction.isDisplayed(pageAspGld.buttonModifierGroupe);
			})

			test ('Button [ENREGISTRER] - Is Visible', async() => {
				await fonction.isDisplayed(pageAspGld.buttonEnregistrer);
			})

			//-------------------------------------------------------------------------------------------------------------------------- 
			test ('DataGrid [GROUPES DE LIVRAISON DIRECTE] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageAspGld.dataGridGroupeLivraisonDirecte,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'Nom du groupe',
							'Actif',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//-------------------------------------------------------------------------------------------------------------------------- 
			test ('DataGrid [LISTE MAGASINS] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageAspGld.dataGridListeMagasins,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'Code magasin',
							'Désignation magasin',
							'Externe ?',
							'Région géographique',
							'Secteur',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//-------------------------------------------------------------------------------------------------------------------------- 

			var sNomPopin = "Création d'un groupe de livraison directe";
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

				test ('Button [CREER] - Click', async() => {
					await fonction.clickElement(pageAspGld.buttonCreerGroupe);
					await fonction.popinVisible(page, sNomPopin);
				});

				test ('CheckBox [ACTIF] - Is Visible', async() => {
					await fonction.isDisplayed(pageAspGld.pPCheckBoxActif);
				})

				test ('InputField [DESIGNATION] - Is Visible', async() => {
					await fonction.isDisplayed(pageAspGld.pPinputDesignation);
				})

				test ('Button [ENREGISTRER] - Is Visible', async() => {
					await fonction.isDisplayed(pageAspGld.pPbuttonEnregistrer);
				})

				test ('Button [FERMER] - Click', async() => {
					await fonction.clickElement(pageAspGld.pPbuttonFermer);     
					await fonction.popinVisible(page, sNomPopin, false);
				})
			})
		})
	})

	test.describe ('Page [LITIGES]', async() => {

		var pageName = 'litiges';

		test ('Page [LITIGES] - Click', async() => {
			await menu.click(pageName, page);
		});

		var sNomOnglet = "LITIGES AUTOMATIQUES";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'litigeAuto', page);
			});

			test ('DatePicker [DU] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAut.datePickerFrom);
			})

			test ('DatePicker [AU] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAut.datePickerTo);
			})

			test ('Checkbox [AFFICHER TOUS LES LITIGES] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAut.checkBoxToutAfficher);
			})

			test ('Bouton [GENERER UNE DAV] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAut.buttonGenererDAV);
			})

			test ('Bouton [ABANDONNER LITIGE] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAut.buttonAbandonnerLitige);
			})

			test ('Bouton [ANNULER UN ABANDON] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAut.buttonAnnulerAbandon);
			})

			test ('Bouton [IMPRIMER UN BON DE REPRISE] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAut.buttonimprimerBonReprise);
			})

			test ('Bouton [InputField [LOT]] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAut.inputFieldLot);
			})

			test ('InputField [ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAut.inputFieldArticle);
			})

			test ('InputField [FOURNISSEUR] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAut.inputFieldFournisseur);
			})

			test ('InputField [PLATEFORME] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAut.inputFieldPlateforme);
			})

			test ('InputField [BON DE LIVRAISON] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAut.inputFieldNumeroBonLivraison);
			})

			//-------------------------------------------------------------------------------------------------------------------------- 
			test ('DataGrid [LITIGES AUTOMATIQUES] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageLitAut.dataGridAchatsSurPlace,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'Date du litige',
							'Plateforme de réception',
							'N° lot',
							'Code article',
							'Désignation article',
							'Code fournisseur',
							'Désignation fournisseur',
							'Conditionnement',
							'Prix d\'achat',
							'Unité d\'achat',
							'Quantité initiale',
							'Quantité en litige',
							'Nature du litige',
							'Demande d\'avoir',
							'Abandon ?',
							'Facture reçue',
							'BL concernés',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//-------------------------------------------------------------------------------------------------------------------------- 

		})

		var sNomOnglet = "LITIGES MANUELS";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'litigeManu', page);
			})

			test ('InputField [LOT] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitMan.inputFieldFiltreCodeLot);
			})

			test ('InputField [ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitMan.inputFieldFiltreCodeArticle);
			})

			test ('InputField [PLATEFORME] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitMan.inputFieldFiltrePlateforme);
			})

			test ('InputField [FOURNISSEUR] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitMan.inputFieldFiltreFournisseur);
			})

			test ('InputField [MAGASIN] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitMan.inputFieldFiltreMagasin);
			})

			test ('InputField [RECHERCHER] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitMan.buttonRechercher);
			})

			test ('InputField [CREER UNE DEMANDE D\'AVOIR] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitMan.buttonCreerUneDAV);
			})

			//-------------------------------------------------------------------------------------------------------------------------- 
			test ('DataGrid [LITIGES AUTOMATIQUES] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageLitAut.dataGridAchatsSurPlace,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'',
							'',
							'N° lot',
							'Code article',
							'Désignation article',
							'Code fournisseur',
							'Désignation fournisseur',
							'Centrale d\'achat',
							'Plateforme de réception',
							'Magasin',
							'Date de réception',
							'Quantité confirmée',
							'Quantité réceptionnée',
							'Quantité agréée',
							'Prix d\'achat',
							'Unité d\'achat',
							'Poids total (Kg)',
							'BL concernés',
							'Actions',
							'',
							'Quantité (UA)',
							'Quantité (colis)',
							'Prix d\'achat (UA)',
							'Montant ()'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//-------------------------------------------------------------------------------------------------------------------------- 

		});

		var sNomOnglet = "Demandes d'avoir";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'demandeAvoir', page);
			});

			test ('CheckBox [TOUT AFFICHER] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAvoir.checkBoxToutAfficher);
			})

			test ('Button [APPROUVER] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAvoir.buttonApprouver);
			})

			test ('Button [IMPRIMER UNE DEMANDE D\'AVOIR] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAvoir.buttonImprimerUneDAV);
			})

			test ('Button [ABANDONNER UNE DEMANDE D\'AVOIR] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAvoir.buttonAbandonnerUneDAV);
			})

			test ('Button [RETABLIR UNE DEMANDE D\'AVOIR] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAvoir.buttonRetablirUneDAV);
			})

			test ('InputField [FILTRE LOT] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAvoir.inputFieldFiltreLot);
			})

			test ('InputField [FILTRE ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAvoir.inputFieldFiltreCodeArticle);
			})

			test ('InputField [FILTRE FOURNISSEUR] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAvoir.inputFieldFiltreFournisseur);
			})

			test ('InputField [FILTRE PLATEFORME] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAvoir.inputFieldFiltrePlateforme);
			})

			test ('InputField [FILTRE DEMANDE D\'AVOIR] - Is Visible', async() => {
				await fonction.isDisplayed(pageLitAvoir.inputFieldFiltreDemandeAvoir);
			})

			//-------------------------------------------------------------------------------------------------------------------------- 
			test ('DataGrid [DEMLANDE D\'AVOIR] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageLitAvoir.dataGridlisteDemandesAvoir,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'Date de la demande',
							'N° demande',
							'Plateforme de réception',
							'N° lot',                        
							'Code article',
							'Désignation article',
							'Code fournisseur',
							'Désignation fournisseur',
							'Montant',
							'Quantité litige',
							'Type',
							'Raison',
							'Statut',
							'Facture reçue',
							'BL concernés',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//-------------------------------------------------------------------------------------------------------------------------- 
		})
	})

	test.describe ('Page [HISTORIQUE]', async() => {

		var pageName = 'historique';

		test ('Page [HISTORIQUE] - Click', async() => {
			await menu.click(pageName, page);
		});

		var sNomOnglet = "Arrivages lots";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'arrivagesLots', page);
			});

			test ('ListBox [GROUPE ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisLot.listBoxGroupeArticle);
			})

			test ('DatePicker [RECEPTION DU] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisLot.datePickerRecepFrom);
			})

			test ('DatePicker [RECEPTION AU] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisLot.datePickerRecepTo);
			})

			test ('InputField [FOURNISSEUR : COMMANDE] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisLot.inputFournCommande);
			})

			test ('InputField [FOURNISSEUR : FACTURE] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisLot.inputFournFacture);
			})

			test ('InputField [ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisLot.inputFiltreArticle);
			})

			test ('InputField [ACHAT] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisLot.inputFiltreAchat);
			})

			test ('InputField [BL] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisLot.inputFiltreBL);
			})

			test ('InputField [FACTURE] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisLot.inputFiltreFacture);
			})

			test ('Button [RECHERCHER] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisLot.buttonRechercher);
			})

			test ('Button [GENERER DEB] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisLot.buttonGenererDEB);
			})

			test ('Button [MODIFIER LE BL] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisLot.buttonModifierBL);
			})

			test ('Button [MODIFIER LE PAYS D\'INTRODUCTION] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisLot.buttonModifierPaysInt);
			})

			test ('Button [PRECISER FOURNISSEUR FACTURANT] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisLot.buttonFournFacturant);
			})

			test ('CheckBox [ARRIVAGE AVEC DEMANDE D\'AVOIR] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisLot.checkBoxArrivageAvecDA);
			})

			test ('CheckBox [ARRIVAGE SANS FACTURE] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisLot.checkBoxArrivageSansFacture);
			})

			//-------------------------------------------------------------------------------------------------------------------------- 
			test ('DataGrid [ACHATS] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageHisLot.dataGridAchats,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'Achat',
							'Code article',
							'Désignation article',
							'Commandé à',
							'Facturé par',
							'N° LA',
							'Lot',
							'ASP',
							'Date de réception',
							'BL',
							'Nombre de colis',
							'Quantité en UA',
							'UA',
							'Prix unitaire',
							'Montant HT déduit',
							'Demande d\'avoir HT',
							'Montant HT',
							'Numéro de Facture',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//--------------------------------------------------------------------------------------------------------------------------
		 
		})

		var sNomOnglet = "Lots réceptionnés non facturés";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'lotsReceptionnes', page);
			});

			test ('ListBox [GROUPE ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisRec.listBoxGroupeArticle);
			})

			test ('DatePicker [RECEPTION DU] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisRec.datePickerRecepFrom);
			})

			test ('DatePicker [RECEPTION AU] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisRec.datePickerRecepTo);
			})

			test ('InputField [CODE OU DESIGNATION] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisRec.inputCodeDesignation);
			})

			test ('InputField [ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisRec.inputFiltreArticle);
			})

			test ('InputField [FOURNISSEUR] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisRec.inputFournissseur);
			})

			test ('InputField [LOT] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisRec.inputFournFactureLot);
			})

			test ('InputField [ACHAT] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisRec.inputAchat);
			})

			test ('Button [RECHERCHER] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisRec.buttonRechercher);
			})

			test ('Button [SOLDER (x) LOT] - Is Visible', async() => {
				await fonction.isDisplayed(pageHisRec.buttonSolderLots);
			})

			//-------------------------------------------------------------------------------------------------------------------------- 
			test ('DataGrid [LOTS RECEPTIONNES] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageHisRec.dataGridAchats,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'Code article',
							'Désignation article',
							'Code fournisseur',
							'Désignation fournisseur',
							'Lot',
							'Numéro d\'achat',
							'Quantité',
							'Montant HT',
							'Date de réception',
							'ASP',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//--------------------------------------------------------------------------------------------------------------------------
		})
	})

	test.describe ('Page [ANALYSE]', async() => {

		var pageName = 'analyse';

		test ('Page [ANALYSE] - Click', async() => {
			await menu.click(pageName, page);
		});

		var sNomOnglet = "campagne";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'campagne', page);
			});

			test ('DatePicker [CAMPAGNE] - Is Visible', async() => {
				await fonction.isDisplayed(pageAnaCmp.datePickerSearchCampagne);
			})

			test ('InputField [FOURNISSEUR] - Is Visible', async() => {
				await fonction.isDisplayed(pageAnaCmp.inputSearchFournisseur);
			})

			test ('InputField [ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageAnaCmp.inputSearchArticle);
			})

			test ('InputField [ACHETEUR] - Is Visible', async() => {
				await fonction.isDisplayed(pageAnaCmp.inputSearchAcheteur);
			})

			test ('Button [RECHERCHER] - Is Visible', async() => {
				await fonction.isDisplayed(pageAnaCmp.buttonSearchRechercher);
			})

			test ('Button [CREER] - Is Visible', async() => {
				await fonction.isDisplayed(pageAnaCmp.buttonCreer);
			})

			test ('Button [VISUALISER] - Is Visible', async() => {
				await fonction.isDisplayed(pageAnaCmp.buttonVisualiser);
			})

			test ('Button [MODIFIER] - Is Visible', async() => {
				await fonction.isDisplayed(pageAnaCmp.buttonModifier);
			})

			test ('Button [COPIER] - Is Visible', async() => {
				await fonction.isDisplayed(pageAnaCmp.buttonCopier);
			})

			test ('Button [BILAN CAMPAGNE] - Is Visible', async() => {
				await fonction.isDisplayed(pageAnaCmp.buttonBilanCampagne);
			})

			test ('Button [TELECHARGER BILAN] - Is Visible', async() => {
				await fonction.isDisplayed(pageAnaCmp.buttonTelechargerBilan);
			})

			//-------------------------------------------------------------------------------------------------------------------------- 
			test ('DataGrid [CAMPAGNES] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageAnaCmp.dataGridCampagnes,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'Acheteur',
							'Nom de la campagne',
							'Fournisseur',
							'Date de début',
							'Date de fin',
							'Statut',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//--------------------------------------------------------------------------------------------------------------------------
	   
			var sNomPopin = "Ajout d'une campagne";
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {
				
				test ('Button [CREER] - Click', async() => {
					await fonction.clickElement(pageAnaCmp.buttonCreer);
					await fonction.popinVisible(page, sNomPopin);
				});

				test ('InputField [CAMPAGNE] - Is Visible', async() => {
					await fonction.isDisplayed(pageAnaCmp.pPajoutCpgneInputNomCampagne);
				})

				test ('InputField [FOURNISSEUR] - Is Visible', async() => {
					await fonction.isDisplayed(pageAnaCmp.pPajoutCpgneInputFournisseur);
				})

				test ('InputField [ARTICLE] - Is Visible', async() => {
					await fonction.isDisplayed(pageAnaCmp.pPajoutCpgneInputArticle);
				})

				test ('InputField [QUANTITE] - Is Visible', async() => {
					await fonction.isDisplayed(pageAnaCmp.pPajoutCpgneInputQuantite);
				})

				test ('InputField [PRIX] - Is Visible', async() => {
					await fonction.isDisplayed(pageAnaCmp.pPajoutCpgneInputPrix);
				})

				test ('InputField [MONTANT TOTAL] - Is Visible', async() => {
					await fonction.isDisplayed(pageAnaCmp.pPajoutCpgneInputMontantTotal);
				})

				test ('DatePicker [DATE DEBUT] - Is Visible', async() => {
					await fonction.isDisplayed(pageAnaCmp.pPajoutCpgneDatePickerDebut);
				})

				test ('DatePicker [DATE FIN] - Is Visible', async() => {
					await fonction.isDisplayed(pageAnaCmp.pPajoutCpgneDatePickerFin);
				})

				test ('ListBox [UNITE] - Is Visible', async() => {
					await fonction.isDisplayed(pageAnaCmp.pPajoutCpgneListBoxUnite);
				})

				test ('Button [ENREGISTRER] - Is Visible', async() => {
					await fonction.isDisplayed(pageAnaCmp.pPajoutCpgneButtonEnregistrer);
				})

				test ('Link [ANNULER] - Is Visible', async() => {
					await fonction.isDisplayed(pageAnaCmp.pPajoutCpgneLinkNon);
				})     

				//-------------------------------------------------------------------------------------------------------------------------- 
				test ('DataGrid [ARTICLES] - Check', async ({}, testInfo) => {
					var oDataGrid:TypeListOfElements =  
					{
						element     : pageAnaCmp.pPajoutCpgneDataGridArticles,    
						desc        : testInfo.line.toString(),
						verbose     : false,
						column      :   
							[
								'0',
								'Code article',
								'Désignation article',
								'Unité d\'achat',
								'Quantité',
								'Prix d\'achat',
								'Montant total',
								'Actions',
							]
					}
					await fonction.dataGridHeaders(oDataGrid);
				})
				//--------------------------------------------------------------------------------------------------------------------------

				test ('Button [ANNULER] - Click', async() => {
					await fonction.clickElement(pageAnaCmp.pPajoutCpgneLinkNon);
					await fonction.popinVisible(page, sNomPopin, false);
				}); 

			})

		})

		var sNomOnglet = "Evaluation des prix de revient";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'evaluationPrixRevient', page);
			});

			test ('InputField [ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageAnaEvaPri.inputArticle);
			}) 

			test ('InputField [PRIX ACHAT] - Is Visible', async() => {
				await fonction.isDisplayed(pageAnaEvaPri.inputPrixAchats);
			}) 

			test ('ListBox [UNITE D\'ACHAT] - Is Visible', async() => {
				await fonction.isDisplayed(pageAnaEvaPri.listBoxUniteAchat);
			}) 

			test ('ListBox [CALIBRE] - Is Visible', async() => {
				await fonction.isDisplayed(pageAnaEvaPri.listBoxCalibre);
			}) 

			test ('ListBox [CONDITIONNEMENT] - Is Visible', async() => {
				await fonction.isDisplayed(pageAnaEvaPri.listBoxConditionnement);
			}) 

			test ('ListBox [PLATEFORME DE RECEPTION] - Is Visible', async() => {
				await fonction.isDisplayed(pageAnaEvaPri.listBoxPtfReception);
			}) 

			test ('ListBox [PLATEFORME DE TRANSIT] - Is Visible', async() => {
				await fonction.isDisplayed(pageAnaEvaPri.listBoxPtfTransit);
			}) 

			test ('ListBox [PLATEFORME DE DISTRIBUTION] - Is Visible', async() => {
				await fonction.isDisplayed(pageAnaEvaPri.listBoxPtfDistribution);
			}) 

			//-------------------------------------------------------------------------------------------------------------------------- 
			test ('DataGrid [EVALUATION PRIX] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageAnaEvaPri.dgPlateformes,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'Plateforme de réception',
							'Plateforme de transit',
							'Plateforme de distribution',
							'Prix de revient UA',
							'Prix de revient UD',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//--------------------------------------------------------------------------------------------------------------------------

		})
	})

	test.describe ('Page [REFERENTIEL]', async() => {

		var pageName = 'referentiel';

		test ('Page [REFERENTIEL] - Click', async() => {
			await menu.click(pageName, page);
		});

		var sNomOnglet = "ARTICLES";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'articles', page);
			});

			test ('Button [MODIFIER] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefArticle.buttonModifier);
			})

			test ('Button [RECHERCHER] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefArticle.buttonRechercher);
			})

			test ('InputField [FILTRE ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefArticle.inputFiltreArticle);
			})

			test ('InputField [FILTRE FOURNISSEUR] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefArticle.inputFiltreFournisseur);
			})

			test ('InputField [GENCOD] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefArticle.inputFiltreGencod);
			})

			test ('ListBox [GROUPE ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefArticle.listBoxGroupeArticle);
			})

			test ('ListBox [ARTICLES INCOMPLETS] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefArticle.checkBoxArticleIncomplet);
			})

			//-------------------------------------------------------------------------------------------------------------------------- 
			test ('Toggle [ARTICLE ACTIF] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageRefArticle.toggleButtonActif,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'Tous',
							'Oui',
							'Non'
						]
				}
				fonction.toggleContent(oDataGrid);
			})
			//--------------------------------------------------------------------------------------------------------------------------
			test ('Toggle [ARTICLE ACHETABLE] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageRefArticle.toggleButtonAchetable,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'Tous',
							'Oui',
							'Non'
						]
				}
				fonction.toggleContent(oDataGrid);
			})
			//--------------------------------------------------------------------------------------------------------------------------
			test ('DataGrid [ARTICLES] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageRefArticle.dataGridArticles,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'Groupe article',
							'Code article',
							'Désignation article',
							'Fournisseur(s)',
							'Unité de détail',
							'Gencod(s)',
							'Conditionnement(s)',
							'Achetable',
							'Actif',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//--------------------------------------------------------------------------------------------------------------------------     

		})

		sNomOnglet = "FOURNISSEURS";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'fournisseurs', page);
			});

			test ('Button [CREER] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefFourn.buttonCreer);
			})
			
			test ('Button [MODIFIER] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefFourn.buttonModifier);
			})
			
			test ('Button [REFERENCE ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefFourn.buttonReferenceArticle);
			})
			
			/*
			test ('Button [REMISE] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefFourn.buttonRemise);
			})
			*/
			
			test ('Button [SAISIES AUTOMATIQUES] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefFourn.buttonSaisieAuto);
			})
			
			test ('Button [CALENDRIER] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefFourn.buttonCalendrier);
			})
			
			test ('Button [EXPORTER TOUS LES FOURNISSEURS] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefFourn.buttonExportFournisseurs);
			})

			test ('InputField [FILTRE ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefFourn.inputFiltreArticle);
			})

			//--------------------------------------------------------------------------------------------------------------------------
			test ('DataGrid [ARTICLES] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageRefFourn.dataGridArticles,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'Code',
							'Fournisseur',
							'Centrale d\'Achat',
							'Pays',
							'Email(s) d\'achat',
							'Contact principal',
							'Tél. fixe contact',
							'Tél. portable contact',
							'Email contact',
							'Agréage auto.',
							'Actif',
							'HVE',
							'** skip **',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//--------------------------------------------------------------------------------------------------------------------------    

			test ('Checkbox [LIST FOURNISSEURS][1] - Click', async() => {
				await fonction.clickElement(pageRefFourn.checkBoxListeFournisseurs.nth(1));                
			})

			var sNomPopin = "Création d'un fournisseur";
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

				test ('Button [CREER] - Click', async() => {
					await fonction.clickAndWait(pageRefFourn.buttonCreer, page);
					await fonction.popinVisible(page, sNomPopin);
				})
			  
				test ('InputField [NOM SOCIETE] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefFourn.pInputNomSocieteFourn);
				})
			  
				test ('InputField [ADRESSE] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefFourn.pInputAdresseFourn);
				})
			  
				test ('InputField [TELEPHONE] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefFourn.pInputTelFourn);
				})
			  
				test ('InputField [CODE POSTAL] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefFourn.pInputCodePostalFourn);
				})
			  
				test ('InputField [EMAIL] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefFourn.pInputEmailFourn);
				})
			  
				test ('InputField [FAX] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefFourn.pInputFaxFourn);
				})
			  
				test ('InputField [CODE FOURNISSEUR] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefFourn.pInputCodeFourn);
				})
			  
				test ('InputField [COMPLEMENT] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefFourn.pInputComplementFourn);
				})
			  
				test ('InputField [VILLE] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefFourn.pInputVilleFourn);
				})
			  
				test ('InputField [EDI] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefFourn.pInputEdiFourn);
				})
			  
				test ('InputField [TVA INTRA] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefFourn.pInputTvaIntraFourn);
				})
			  
				test ('InputField [SIREN] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefFourn.pInputSirenFourn);
				})
			  
				test ('ListBox [PAYS] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefFourn.plistBoxPaysFourn);
				})
			  
				test ('ListBox [DEVISE] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefFourn.pListBoxDeviseFourn);
				})
			  
				test ('ListBox [LANGUE] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefFourn.pListBoxLangueFourn);
				})
			  
				test ('ListBox [MARCHANDISE] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefFourn.pListBoxMarchandiseFourn);
				})
			  
				test ('ListBox [COLLECTIF] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefFourn.pListBoxCollectifFourn);
				})
			  
				test ('ListBox [REGIME DE TVA] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefFourn.pListBoxRegimeTvaFourn);
				})
			  
				test ('TextArea [COMMENTAIRE] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefFourn.pTextAreaComFourn);
				})
			  
				test ('Button [ENREGISTRER] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefFourn.pButtonEnregistrerFourn);
				})
			
				test ('Button [ANULER] - Click', async() => {
					await fonction.clickElement(pageRefFourn.pLinkAnnulerFourn);
					await fonction.popinVisible(page, sNomPopin, false);
				})

			})

		})

		sNomOnglet = "FORMAT DE PALETTE";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'formatPalette', page);
			});

			test ('InputField [CODE OU DESIGNATION] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefFormPal.inputFiltreDesignation);
			})

			//--------------------------------------------------------------------------------------------------------------------------
			test ('DataGrid [FORMATS PALETTES] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageRefFormPal.dataGridFormats,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'',
							'Code conditionnement',
							'Désignation conditionnement',
							'Calibre',
							'Abréviation emballage',
							'Emballage',
							'PCB',
							'Unité',
							'Poids moyen du colis',
							'Plateformes',
							'Etage de palettes',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//-------------------------------------------------------------------------------------------------------------------------- 

		})

		sNomOnglet = "GENCODS";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'gencods', page);
			});

			test ('InputField [FILTRE ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefGencod.inputFiltreArticle);
			})

			test ('InputField [FILTRE GENCODS] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefGencod.inputFiltreGencod);
			})

			test ('Button [CREER] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefGencod.buttonCreer);
			})

			test ('Button [MODIFIER] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefGencod.buttonModifier);
			})

			test ('Button [SUPPRIMER] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefGencod.buttonSupprimer);
			})

			//--------------------------------------------------------------------------------------------------------------------------
			test ('DataGrid [GENCODS] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageRefGencod.dataGridGencods,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'GencodArticle',
							'Code article',
							'Article',
							'Fournisseur',
							'Qté pack',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//-------------------------------------------------------------------------------------------------------------------------- 
			test ('DataGrid [ARTICLES] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageRefGencod.dataGridArticles,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'Code article',
							'Article'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//-------------------------------------------------------------------------------------------------------------------------- 

		})

		sNomOnglet = "EMBALLAGES";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'emballages', page);
			});

			test ('Button [CREER] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefEmbal.buttonCreer);
			})

			test ('Button [MODIFIER] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefEmbal.buttonModifier);
			})

			test ('Button [SUPPRIMER] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefEmbal.buttonSupprimer);
			})

			//--------------------------------------------------------------------------------------------------------------------------
			test ('DataGrid [EMBALLAGES] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageRefEmbal.dataGridEmballages,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'Abréviation',
							'Emballage',
							'Frais unitaire',
							'Volume fixe',
							'Longueur',
							'Largeur',
							'Hauteur',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//-------------------------------------------------------------------------------------------------------------------------- 

			var sNomPopin = "Création d'un emballage";
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

				test ('Button [CREER] - Click', async() => {
					await fonction.clickAndWait(pageRefEmbal.buttonCreer, page);
					await fonction.popinVisible(page, sNomPopin);
				})

				test ('InputField [ABREVIATION EMBALLAGE] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefEmbal.pInputAbreviation);
				})

				test ('InputField [DESIGNATION] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefEmbal.pInputDesignation);
				})

				test ('InputField [FRAIS UNITAIRES] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefEmbal.pInputFraisUnitaires);
				})

				test ('InputField [FRAIS VOLUME FIXE] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefEmbal.pCheckBoxVolumeFixe);
				})

				test ('InputField [LONGUEUR] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefEmbal.pInputLongueur);
				})

				test ('InputField [LARGEUR] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefEmbal.pInputLargeur);
				})

				test ('InputField [HAUTEUR] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefEmbal.pInputHauteur);
				})

				test ('Button [ANNULER] - Click', async() => {
					await fonction.clickElement(pageRefEmbal.pLinkAnnuler);
					await fonction.popinVisible(page, sNomPopin, false);
				})                

			})

		})

		sNomOnglet = "CONDITIONNEMENTS";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'conditionnements', page);
			});

			test ('Button [CREER] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefCond.buttonCreer);
			})

			test ('Button [MODIFIER] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefCond.buttonModifier);
			})

			test ('Button [INACTIVER] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefCond.buttonInactiver);
			})

			//--------------------------------------------------------------------------------------------------------------------------
			test ('DataGrid [CONDITIONNEMENTS] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageRefCond.dataGridArticles,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'Code article',
							'Désignation',
							'Article',
							'Calibre',
							'Abréviation emballage',
							'Emballage',
							'PCB',
							'Unité',
							'Poids moyen du colis',
							'Colis par couche',
							'Couches par palette',
							'Unité d\'emballage applicable',
							'Descriptif',
							'Nombre UD/UE',
							'Unité d\'emballage',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//-------------------------------------------------------------------------------------------------------------------------- 

			var sNomPopin = "Création d'un conditionnement";
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

				test ('Button [CREATION D\'UN CONDITIONNEMENT] - Click', async() => {
					await fonction.clickAndWait(pageRefCond.buttonCreer, page);               
					await fonction.popinVisible(page, sNomPopin);  
				})

				test ('InputField [DESIGNATION] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefCond.pInputDesignationCond);
				})

				test ('InputField [ARTICLE] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefCond.pInputArticleCond);
				})

				test ('InputField [PCB] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefCond.pInputPcbCond);
				})

				test ('InputField [POIDS MOYEN COLIS] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefCond.pInputPoidsMoyenColisCond);
				})

				test ('InputField [COLIS PAR COUCHE] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefCond.pInputColisParCoucheCond);
				})

				test ('InputField [COUCHES PAR PALETTE] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefCond.pInputCouchesParPaletteCond);
				})

				test ('InputField [EAN 14] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefCond.pInputEan14Cond);
				})

				test ('ListBox [CALIBRE] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefCond.pListBoxCalibreCond);
				})

				test ('ListBox [EMBALLAGE] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefCond.pListBoxEmballageCond);
				})

				test ('ListBox [UNITE DETAIL UD] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefCond.pListBoxUniteDetailCond);
				})

				test ('ListBox [DESCRIPTIF] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefCond.pListBoxDescriptifCond);
				})

				test ('ListBox [UNITE SOUS EMBALLAGE] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefCond.pListBoxUniteSousEmballageCond);
				})

				test ('CheckBox [UNITE EMBALLAGE APPLICABLE] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefCond.pCheckBoxUniteEmballageCond);
				})

				test ('Button [CREER] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefCond.pButtonCreerCond);
				})

				test ('Button [VIDER] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefCond.pButtonViderCond);
				})

				test ('Button [ANNULER] - Click', async() => {
					await fonction.clickElement(pageRefCond.pLinkAnnuler);          
					await fonction.popinVisible(page, sNomPopin, false);       
				})                

			})
		})

		sNomOnglet = "Création d'un conditionnement";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'dossiersAchat', page);
			});

			test ('Button [REAFFECTER ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefDosAch.buttonReaffecterArticle);
			})

			test ('Button [CREER DOSSIER] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefDosAch.buttonCreerDossier);
			})

			test ('Button [MODIFIER DOSSIER] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefDosAch.buttonModifierDossier);
			})

			test ('Button [SUPPRIMER DOSSIER VIDE] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefDosAch.buttonSupprimerDossierVide);
			})

			test ('ListBox [DOSSIER D\'ACHAT] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefDosAch.listBoxDossierAchat);
			})

			test ('InputField [FILTRE CODE ARTICLE] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefDosAch.inputFiltreArticle);
			})

			//--------------------------------------------------------------------------------------------------------------------------
			test ('DataGrid [DOSSIERS D\'ACHAT] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageRefDosAch.dataGridDossierAchat,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'Code article',
							'Désignation article',
							'Plateforme de distribution',
							'Nom du dossier',
							'Acheteur',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//-------------------------------------------------------------------------------------------------------------------------- 

		})

		sNomOnglet = "FRAIS";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'frais', page);
			});

			test ('InputField [CODE OU DESIGNATION] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefFrais.inputFiltreArticleStructure);
			})

			test ('InputField [FILTRE PLATEFORME] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefFrais.inputFiltreArticlePlateforme);
			})

			//--------------------------------------------------------------------------------------------------------------------------           
			test ('DataGrid [EXCEPTIONS AU FRAIS DE TRANSPORT] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageRefFrais.dataGridFraistransport,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'Code article',
							'Désignation article',
							'Plateforme de réception',
							'Plateforme de distribution',
							'Frais de transport'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})    
		})

		sNomOnglet = "APPROVISIONNEMENT AUTOMATIQUE";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'approvisionnementAuto', page);
			});

			test ('InputField [FILTRE LIBELLE] - Is Visible', async() => {
				await fonction.isDisplayed(pagerefApprAuto.inputFiltreLibelle);
			})
			
			test ('InputField [FILTRE DESIGNATION FOURNISSEUR] - Is Visible', async() => {
				await fonction.isDisplayed(pagerefApprAuto.inputFiltreDesignForunisseur);
			})
			
			test ('InputField [FILTRE CENTRALE ACHAT] - Is Visible', async() => {
				await fonction.isDisplayed(pagerefApprAuto.inputFiltreCentraleAchat);
			})
			
			test ('InputField [FILTRE PLATEFORME DISTRIBUTION] - Is Visible', async() => {
				await fonction.isDisplayed(pagerefApprAuto.inputFiltrePtfDistribution);
			})
			
			test ('InputField [FILTRE PREPARE] - Is Visible', async() => {
				await fonction.isDisplayed(pagerefApprAuto.inputFiltrePrepare);
			})
			
			test ('InputField [FILTRE AUTO CONFIRME] - Is Visible', async() => {
				await fonction.isDisplayed(pagerefApprAuto.inputFiltreAutoconfirme);
			})
			
			test ('InputField [FILTRE ACTIF] - Is Visible', async() => {
				await fonction.isDisplayed(pagerefApprAuto.inputFiltreActif);
			})
			
			test ('Button [CREER] - Is Visible', async() => {
				await fonction.isDisplayed(pagerefApprAuto.buttonCreer);
			})
			
			test ('Button [MODIFIER] - Is Visible', async() => {
				await fonction.isDisplayed(pagerefApprAuto.buttonModifier);
			})

			//--------------------------------------------------------------------------------------------------------------------------
			test ('DataGrid [DOSSIERS D\'ACHAT] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pagerefApprAuto.dataGridFraisStructure,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'Intitulé',
							'Code fournisseur',
							'Désignation fournisseur',
							'Centrale d\'achat',
							'Plateforme de distribution',
							'Délai d\'appro.',
							'Préparé',
							'Auto confirmé',
							'Actif',
							'Nombre de magasins',
							'Nombre d\'articles',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//-------------------------------------------------------------------------------------------------------------------------- 

		})

		sNomOnglet = "UNITES DE TRANSPORT";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'unitesTransport', page);
			});
	 
			test ('Button [CREER UNE UNITE DE TRANSPORT] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefUniTrp.buttonCreerUniteTransport);
			})
	 
			test ('Button [MODIFIER UNITE DE TRANSPORT] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefUniTrp.buttonModifierUniteTransport);
			})
	 
			test ('Button [SUPPRIMER UNITE DE TRANSPORT] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefUniTrp.buttonSupprimerUniteTransport);
			})
	 
			test ('Button [CREER UN PARAMETRAGE] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefUniTrp.buttonCreerParametrage);
			})
	 
			test ('Button [MODIFIER UN PARAMETRAGE] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefUniTrp.buttonModifierParametrage);
			})
	 
			test ('Button [SUPPRIMER UN PARAMETRAGE] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefUniTrp.buttonSupprimerParametrage);
			})

			//--------------------------------------------------------------------------------------------------------------------------
			test ('DataGrid [UNITES DE TRANSPORT] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageRefUniTrp.dataGridUniteTransport,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'Nom',
							'Volume',
							'Actions'
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//--------------------------------------------------------------------------------------------------------------------------                                                           
			test ('DataGrid [PARAMETRAGE DES UNITES DE TRANSPORT] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageRefUniTrp.dataGridUniteTransportParam,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'0',
							'Actif',
							'Groupe',
							'Plateforme',
							'Unité transport',
							'Coef. foisonnement',
							'Nature de marchandise',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			var nomPopin = 'Création d\'une unité de transport';
			test.describe ('Popin [' + nomPopin + ']', async () => {

				test ('Button [CREER UN PARAMETRAGE] - Click', async() => {
					await fonction.clickAndWait(pageRefUniTrp.buttonCreerUniteTransport, page);
				})

				test ('Popin [' + nomPopin + '] - Is Visible', async () => {
					await fonction.popinVisible(page, nomPopin, true);
				})

				test ('Input [NOM] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefUniTrp.pPinputAddNom);
				})

				test ('Input [VOLUME] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefUniTrp.pPinputAddVolume);
				})

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pageRefUniTrp.pPlinkAddAnnuler);
				})

				test ('Popin [' + nomPopin + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, nomPopin, false);  
				}) 
			})// End Popin

			var nomPopin = 'Création paramétrage unité transport';
			test.describe ('Popin [' + nomPopin + ']', async () => {

				test ('Button [CREER UN PARAMETRAGE] - Click', async() => {
					await fonction.clickAndWait(pageRefUniTrp.buttonCreerParametrage, page);
				})

				test ('Popin [' + nomPopin + '] - Is Visible', async () => {
					await fonction.popinVisible(page, nomPopin, true);
				})

				test ('P-dropdown [GROUPE] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefUniTrp.pPlistBoxAddParamGroupe);
				})

				test ('P-dropdown [PLATEFORME A AJOUTER] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefUniTrp.pPlistBoxAddParamPlateforme);
				})

				test ('P-dropdown [UNITES DE TRANSPORT] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefUniTrp.pPlistBoxAddParamUniteTransp);
				})

				test ('P-dropdown [NATURE DE MARCHANDISE] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefUniTrp.pPlistBoxAddParamNature);
				})

				test ('Input [COEFFICIENT DE FOISONNEMENT] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefUniTrp.pPinputAddParamCoef);
				})

				test ('p-checkbox [ACTIF] - Is Visible', async() => {
					await fonction.isDisplayed(pageRefUniTrp.pPcheckBoxAddParamActif);
				})

				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pageRefUniTrp.pPLinkAddParamAnnuler);
				})

				test ('Popin [' + nomPopin + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, nomPopin, false);  
				}) 
			})// End Popin
		})

		sNomOnglet = "FRAIS DE TRANSPORT";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'fraisTransport', page);
			});

			test ('Button [CREER UN FRAIS DE TRANSPORT] - Is Visible', async() => {
				await fonction.isDisplayed(pageRefFraisTrp.buttonAjouterNouveauFrais);
			})

			//--------------------------------------------------------------------------------------------------------------------------
			test ('DataGrid [FRAIS DE TRANSPORT] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageRefFraisTrp.dataGridFraisTransport,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'Plateforme de réception / Lieu de livraison',
							'Plateforme de réception / Plateforme de distribution',
							'Montant des frais',
							'Actions',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
			//--------------------------------------------------------------------------------------------------------------------------    

		})

	})

	test.describe ('Page [ADMIN]', async() => {

		var pageName = 'admin';

		test ('Page [ADMIN] - Click', async() => {
			await menu.click(pageName, page);
		});

		var sNomOnglet = "DIFFUSION";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'diffusion', page);
			});

			test ('Button [DIFFUSER GENCODS] - Is Visible', async() => {
				await fonction.isDisplayed(pageAdminDif.buttonDifGencods);
			})

			test ('Button [DIFFUSER CONDITIONNEMENTS] - Is Visible', async() => {
				await fonction.isDisplayed(pageAdminDif.buttonDifCond);
			})

			test ('Button [DIFFUSER FOURNISSEURS] - Is Visible', async() => {
				await fonction.isDisplayed(pageAdminDif.buttonDifFournisseurs);
			})

			test ('Button [DIFFUSER EMBALLAGES] - Is Visible', async() => {
				await fonction.isDisplayed(pageAdminDif.buttonDifEmballages);
			})

			test ('Button [DIFFUSER DOSSIERS ACHATS] - Is Visible', async() => {
				await fonction.isDisplayed(pageAdminDif.buttonDifDossierAchat);
			})

			test ('Button [DIFFUSER EMBALLAGES ET SOUS-EMBALLAGES] - Is Visible', async() => {
				await fonction.isDisplayed(pageAdminDif.buttonDifTradEmballages);
			})

			test ('Button [DIFFUSER TOUS LES CONDITIONNEMENTS] - Is Visible', async() => {
				await fonction.isDisplayed(pageAdminDif.buttonDifTradEmballages);
			})

			test ('ListBox [RAYON] - Is Visible', async() => {
				await fonction.isDisplayed(pageAdminDif.listeBoxRayon);
			})

			test ('ListBox [FOURNISSEURS] - Is Visible', async() => {
				await fonction.isDisplayed(pageAdminDif.listeBoxFournisseur);
			})
		})

		sNomOnglet = "CHANGELOG";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'Changelog', page);
			})
		})

		sNomOnglet = "PARAMETRAGES";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'parametrages', page);
			});

			test ('Button [ENREGISTRER] - Is Visible', async() => {
				await fonction.isDisplayed(pageAdmPara.buttonEnregistrer);
			})

			//--------------------------------------------------------------------------------------------------------------------------
			test ('DataGrid [PARAMETRAGES] - Check', async ({}, testInfo) => {
				var oDataGrid:TypeListOfElements =  
				{
					element     : pageAdmPara.dataGridParametrage,    
					desc        : testInfo.line.toString(),
					verbose     : false,
					column      :   
						[
							'Code',
							'Désignation',
							'Valeur',
						]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})
		})

		sNomOnglet = "PARAMETRAGES DES PLATEFORMES";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'parametragesPlateformes', page);
			});
		})

		sNomOnglet = "COMMUNICATION UTILISATEURS";
		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async() => {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async() => {
				await menu.clickOnglet(pageName, 'communicationUtilisateurs', page);
			});
		})
	})

	test ('Déconnexion', async() => {
		await fonction.deconnexion(page);
	});
	
})