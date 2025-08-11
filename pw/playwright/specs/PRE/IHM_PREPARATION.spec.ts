/**
 * 
 * PREPARATION APPLICATION > CONTENU
 * 
 * @author Vazoumana Diarrassouba
 * @since 2023/09/29
 * 
 */

const xRefTest      = "PRE_IHM_GLB";
const xDescription  = "Examen de l'IHM PREPARATION";
const xIdTest       =  568;
const xVersion      = '3.11';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRE',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
}

//------------------------------------------------------------------------------------

import { test, type Page, expect }            from '@playwright/test';

import { Help }                               from '@helpers/helpers.js';
import { TestFunctions }                      from '@helpers/functions.js';
import { Log }                                from '@helpers/log.js';

import { MenuPreparation }                    from '@pom/PRE/menu.page.js';

import { PreparationAccueilPage }             from '@pom/PRE/accueil.page.js';

import { SuiviPickListesAPreparerPage }       from '@pom/PRE/picking-listes_a_preparer.page.js';
import { SuiviPickListesEnCours }             from '@pom/PRE/picking-listes_en_cours.page.js';
import { SuiviPickListesAValider }            from '@pom/PRE/picking-listes_a_valider.page.js';
import { SuiviPickListesPrepareesExPage }     from '@pom/PRE/picking-listes_expediees.page.js'; 
import { SuiviPickListesAnnuleesPage }        from '@pom/PRE/picking-listes_annulees.page.js';

import { SuiviEclatfeuilleAPreparerPage }     from '@pom/PRE/eclatement-feuilles_a_preparer.page.js';
import { SuiviEclatfeuilleEnCoursPage }       from '@pom/PRE/eclatement-feuilles_en_cours.page.js';
import { SuiviEclatfeuilleAnnuleesPage }      from '@pom/PRE/eclatement-feuilles_annulees.page.js';
import { SuiviEclatfeuillesPrepareesExpPage } from '@pom/PRE/eclatement-feuilles_preparees.page.js';

import { ProdGestionPreparateursPage }        from '@pom/PRE/productivite-gestion_preparateurs.page.js';
import { ProdImportTPresencePage }            from '@pom/PRE/productivite-temps_presence.page.js';
import { ProdValidationJrneePrepaPage }       from '@pom/PRE/productivite-validation_journee.page.js';
import { ProdGestionParametresPage }          from '@pom/PRE/productivite-gestion_parametres.page.js';

import { AurtresTacheDuJourPage }             from '@pom/PRE/travaux-taches_jour.page.js';
import { AurtresTravTHistoriquePage }         from '@pom/PRE/travaux-historique.page.js';

import { RefExceptionProductivitePage }       from '@pom/PRE/referentiel-exceptions_productivite.page.js';
import { RefCheminEclatementPage }            from '@pom/PRE/referentiel-chemin_eclatement.page.js';
import { RefCheminPickingPage }               from '@pom/PRE/referentiel-chemin_picking.page.js';
import { RefRTourneePickingPage }             from '@pom/PRE/referentiel-tournees_picking.page.js';
import { RefParametresImpressionPage }        from '@pom/PRE/referentiel-parametres_impression.page.js';
import { RefParametresVocauxPage }            from '@pom/PRE/referentiel-parametres_vocaux.page.js';
import { RefReferentielArticlePage }          from '@pom/PRE/referentiel-referentiel_articles.page.js';
import { RefModePrepaExcepPage }              from '@pom/PRE/referentiel-mode_preparation_exceptions.page.js';

import { CartoucheInfo }                      from '@commun/types';

//------------------------------------------------------------------------------------

let page                                : Page;

let menu                                : MenuPreparation;

let pageAccueil                         : PreparationAccueilPage;

let pageSuiviEclatfeuilleAPreparer      : SuiviEclatfeuilleAPreparerPage;
let pageSuiviEclatfeuilleEnCours        : SuiviEclatfeuilleEnCoursPage;
let pageSuiviEclatfeuillesPrepareesExp  : SuiviEclatfeuillesPrepareesExpPage;
let pageSuiviEclatfeuilleAnnulees       : SuiviEclatfeuilleAnnuleesPage;

let pageSuiviPickListesAPreparer        : SuiviPickListesAPreparerPage;
let pagePickingEnCours                  : SuiviPickListesEnCours;
let pagePickingAValider                 : SuiviPickListesAValider;
let pagePickingExpediee                 : SuiviPickListesPrepareesExPage;
let pagePickingAnnulee                  : SuiviPickListesAnnuleesPage;

let pageProdGestionPreparateurs         : ProdGestionPreparateursPage;
let pageProdImportTPresencePage         : ProdImportTPresencePage;
let pageProdValidationJrneePrepa        : ProdValidationJrneePrepaPage;
let pageProdGestionParametres           : ProdGestionParametresPage;

let pageAurtresTacheDuJour              : AurtresTacheDuJourPage;
let pageAurtresTravTHistorique          : AurtresTravTHistoriquePage;

let pageRefExceptionProductivite        : RefExceptionProductivitePage;
let pageRefCheminEclatement             : RefCheminEclatementPage;
let pageRefCheminPicking                : RefCheminPickingPage;
let pageRefRTourneePicking              : RefRTourneePickingPage;
let pageRefParametresImpression         : RefParametresImpressionPage;
let pageRefParametresVocaux             : RefParametresVocauxPage;
let pageRefReferentielArticle           : RefReferentielArticlePage;
let pageRefModePrepaExcep               : RefModePrepaExcepPage;

const log                               = new Log();
const fonction                          = new TestFunctions(log);

fonction.recordDatas(false);		//-- Inutile de créer une fiche de données

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {

    page                                = await browser.newPage();

    menu                                = new MenuPreparation(page, fonction);

    pageAccueil                         = new PreparationAccueilPage(page);

    pageSuiviEclatfeuilleAPreparer      = new SuiviEclatfeuilleAPreparerPage(page);
    pageSuiviEclatfeuilleEnCours        = new SuiviEclatfeuilleEnCoursPage(page);
    pageSuiviEclatfeuillesPrepareesExp  = new SuiviEclatfeuillesPrepareesExpPage(page);
    pageSuiviEclatfeuilleAnnulees       = new SuiviEclatfeuilleAnnuleesPage(page);

    pageSuiviPickListesAPreparer        = new SuiviPickListesAPreparerPage(page);
    pagePickingEnCours                  = new SuiviPickListesEnCours(page);
    pagePickingAValider                 = new SuiviPickListesAValider(page);
    pagePickingExpediee                 = new SuiviPickListesPrepareesExPage(page);
    pagePickingAnnulee                  = new SuiviPickListesAnnuleesPage(page);

    pageProdGestionPreparateurs         = new ProdGestionPreparateursPage(page);
    pageProdImportTPresencePage         = new ProdImportTPresencePage(page);
    pageProdValidationJrneePrepa        = new ProdValidationJrneePrepaPage(page);
    pageProdGestionParametres           = new ProdGestionParametresPage(page);

    pageAurtresTacheDuJour              = new AurtresTacheDuJourPage(page);
    pageAurtresTravTHistorique          = new AurtresTravTHistoriquePage(page);

    pageRefExceptionProductivite        = new RefExceptionProductivitePage(page);
    pageRefCheminEclatement             = new RefCheminEclatementPage(page);
    pageRefCheminPicking                = new RefCheminPickingPage(page);
    pageRefRTourneePicking              = new RefRTourneePickingPage(page);
    pageRefParametresImpression         = new RefParametresImpressionPage(page);
    pageRefParametresVocaux             = new RefParametresVocauxPage(page);
    pageRefReferentielArticle           = new RefReferentielArticlePage(page);
    pageRefModePrepaExcep               = new RefModePrepaExcepPage(page);

    const helper                        = new Help(info, testInfo, page);
    await helper.init();

})

test.beforeEach(async ({}, testInfo) => {
    await fonction.trace(testInfo);
    await fonction.checkConsole(page, testInfo, false);
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------


test.describe.serial ('[' + xRefTest + ']', async () => {

    test('Ouverture URL : '+ fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
        await fonction.waitTillHTMLRendered(page)
    })

    test.describe.skip ('Page [ACCUEIL]',  async () => {    

        test ('ListBox [PLATEFORME] - Is Visible', async () => {
            await menu.listBoxPlateforme.isVisible();                             
        })

        test ('Label [ERROR] -  Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);                            
        })

        test ('Button [RAFRAICHIR] - Is Visible', async () => {
            await fonction.isDisplayed(pageAccueil.buttonRafraichir);
        })
  
        test ('DatePicker [JOURNEE] - Is Visible', async () => {
            await fonction.isDisplayed(pageAccueil.datePickerJournee);
        })
    
        test ('ListBox [GROUPE ARTICLE] - Is Visible', async () => {
            await fonction.isDisplayed(pageAccueil.listBoxGroupeArticle.first());
        })

        test ('UNITES DE PREPARATION - Is Visible', async () => {
            await fonction.isDisplayed(pageAccueil.listBoxUnitesPrepa);
        })
 
        test ('InputField [HEURE] - Is Visible', async () => {
            await fonction.isDisplayed(pageAccueil.inputHeure);
        })

        test ('InputField [MINUTE] - Is Visible', async () => {
            await fonction.isDisplayed(pageAccueil.inputMinute); 
        }) 

        test ('DataGrid [RECAPITULATIF ECLATEMENT] - Check', async () => {

            var oDataGrid = {
                element     : pageAccueil.recapEclatementCourant,    
                desc        : 'RECAPITULATIF ECLATEMENT',
                verbose     : false, 
                column      : [
                    'Eclatement',
                    'Estimé',
                    'Réparti',
                    'Imprimé',
                    'Annulé',
                    'En cours',
                    'Préparé',
                    'A préparer',  
                ]
            }
            await fonction.dataGridHeaders(oDataGrid);
        })   

        test ('DataGrid [RECAPITULATIF PICKING] - Check', async () => {

            var oDataGrid = {
                element     : pageAccueil.recapPickingCourant,    
                desc        : 'RECAPITULATIF PICKING',
                verbose     : false, 
                column      : [
                    'Picking',
                    'Estimé', 
                    'Réparti',
                    'En cours',
                    'A valider',
                    'Préparé',
                    'A préparer',       
                ]
            }
            await fonction.dataGridHeaders(oDataGrid);
        })  
    })  // End test.describe Page

    test.describe.skip ('Page [SUIVI ECLATEMENT]',  async () => {    

        var sCurrentPage = 'eclatement';

        test ('Page [SUIVI ECLATEMENT] - Click', async () => {
            await menu.click(sCurrentPage, page);
        })
     
        test.describe('Onglet [FEUILLES A PREPARER]',  async () => {

            test ('Onglet [FEUILLES A PREPARER] - Click',  async () => {
                await menu.clickOnglet(sCurrentPage, 'feuillesAPreparer', page);
            })

            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page); 
            })
         
            test ('InputField [SEARCH MAGASIN] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.inputSearchMagasin);
            })
           
            test ('InputField [SEARCH ALL] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.inputSearchAll);
            })
          
            test ('ListBox [VAGUE] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.listBoxVague.first());
            })
         
            test ('ListBox [GROUPE ARTICLE] - Check', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.listBoxGroupeArticle.first());
            })
           
            test ('Button [FILTERS] - Click',  async () =>{
                await fonction.clickAndWait(pageSuiviEclatfeuilleAPreparer.buttonFilters, page);
            })
            test ('CheckBox [NUM FEUILLE] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.checkBoxNumFeuille);
            })
           
            test ('CheckBox [ARTICLE] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.checkBoxArticle);
            })
      
            test ('CheckBox [FOURNISSEUR] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.checkBoxFournisseur);
            })

            test ('CheckBox [NUM BL] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.checkBoxNumBL);
            })
            
            test ('CheckBox [NUM PALETTE] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.checkBoxNumPalette);
            })
           
            test ('CheckBox [NUM LOT] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.checkBoxNumLot);
            })
           
            test ('Link [FERMER] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.linkFermer);
            })

            test ('Link [FERMER] - Click', async () => {
                await fonction.clickElement(pageSuiviEclatfeuilleAPreparer.linkFermer);
            })

            test ('CheckBox [MASQUER FEUILLE MERES] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.checkBoxMasquerFeuilleMere);
            })
          
            test ('CheckBox [MASQUER FEUILLES IMPRIMEES] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.checkBoxMasquerFeuilleImp);
            })
           
            test ('CheckBox [MASQUER FEUILLES SANS MARCHANDIES] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.checkBoxMasquerFeuilleSansMarchandise);
            })

            test ('DataGrid [FEUILLES A PREPARER] - Check', async () => {

                var oDataGrid = 
                {
                    element     : pageSuiviEclatfeuilleAPreparer.dataGridTableAPreparer,    
                    desc        : 'FEUILLES A PREPARER',
                    verbose     :  false , 
                    column      : [
                        '0',
                        'Statut',
                        'Consigne palette',
                        'Feuille',
                        'Vagues',
                        'Code article',
                        'Désignation article',
                        'Fournisseur',
                        'Date d\'arrivage',
                        'Conditionnement',
                        'Nb colis couche',
                        'Emplacements',
                        'N° BL',
                        'Poids (kg)',
                        'Palettes',
                        'Colis à répartir',
                        'Stock fin',
                        'Magasins',
                        'Complète',
                        'Actions',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })


            //-- Bouton Bas de page
            test ('Button [IMPRIMER] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.buttonImprimer);
            })
          
            test ('Button [VISUALISER] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.buttonVisualiser);
            })
            
            test ('Button [SCINDER] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.buttonScinder);
            })
           
            test ('Button [ANNULER SCISSION] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.buttonAnnulerScission);
            })
     
            test ('Button [PREPARER VOCAL] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.buttonPreparerVocal);
            })
            
            test ('Button [PREPARER MANUELLEMENT] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.buttonPreparerManuellement);
            })
            
            test ('Button [FUSIONNER] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.buttonFusionner);
            })

            test ('Button [ANNULER LA FUSION] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAPreparer.buttonAnnulerFusion);
            })          
        })  // End test.describe Onglet

        test.describe('Onglet [FEUILLES EN COURS]',  async () => {

            test ('Onglet [FEUILLES EN COURS] - Click',  async () => {
                await menu.clickOnglet(sCurrentPage, 'feuillesEnCours', page);
            })
            
            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })
                                      
            test ('Button [IMPRIMER] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleEnCours.buttonImprimer);  
            })
     
            test ('Button [VISUALISER] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleEnCours.buttonVisualiser);
            })
    
            test ('InputField [SEARCH MAGASIN] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleEnCours.inputSearchMagasin);
            })
       
            test ('InputField [SEARCH ALL] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleEnCours.inputSearchAll);
            })
     
            test ('ListBox [VAGUE] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleEnCours.listBoxVague.first());
            })
         
            test ('ListBox [GROUPE ARTICLE] - Check', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleEnCours.listBoxGroupeArticle.first());
            })
            
            test ('Button [FILTERS] - Click',  async () =>{
                await fonction.clickAndWait(pageSuiviEclatfeuilleEnCours.buttonFilters, page);              
            })

            test ('CheckBox [PREPARATEUR]', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleEnCours.checkBoxPreparateur);
            })

            test ('CheckBox [NUM FEUILLE]', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleEnCours.checkBoxNumFeuille);
            })
            
            test ('CheckBox [ARTICLE]', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleEnCours.checkBoxArticle); 
            })
 
            test ('CheckBox [FOURNISSEUR]', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleEnCours.checkBoxFournisseur);
            })
            
            test ('CheckBox [NUM LOT]', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleEnCours.checkBoxNumLot);
            })
           
            test ('Link [FERMER] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleEnCours.linkFermer); 
            })
                     
            test ('Link [FERMER] - Click', async () => {
                await fonction.clickElement(pageSuiviEclatfeuilleEnCours.linkFermer); 
            })

            test ('DataGrid [FEUILLES EN COURS] - Check', async () => {

                var oDataGrid = 
                {
                    element     : pageSuiviEclatfeuilleEnCours.dataGridFeuillesEnCours,    
                    desc        : 'FEUILLES EN COURS',
                    verbose     :  false , 
                    column      : [
                        '0',
                        'Statut',
                        'Préparateur',
                        'Consigne palette',
                        'Feuille',
                        'Vagues',
                        'Code article',
                        'Désignation article',
                        'Fournisseur',
                        'Date d\'arrivage',
                        'Emplacements',
                        'Poids (kg)',
                        'Palettes',
                        'Colis à répartir',
                        'Magasins',
                        'Heure début',
                        'Pause',
                        'Actions',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid); 
            })         
            
        }) // End test.describe Onglet

        test.describe('Onglet [FEUILLES PREPAREES]',  async () => {

            test ('Onglet [FEUILLES PREPAREES] - Click',  async () => {
                await menu.clickOnglet(sCurrentPage, 'feuillesPreparees', page);
            })

            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })

            test ('Button [IMPRIMER] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuillesPrepareesExp.buttonImprimer);
            })
            
            test ('Button [VISUALISER] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuillesPrepareesExp.buttonVisualiser);
            })
            
            test ('Button [SYNTHESE DES CORRECTION DE PREPARATION] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuillesPrepareesExp.buttonSyntCorrectPrepa);
            }) 

            test ('InputField [SEARCH MAGASIN] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuillesPrepareesExp.inputSearchMagasin);
            })
            
            test ('InputField [SEARCH ALL] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuillesPrepareesExp.inputSearchAll);
            })
            
            test ('ListBox [GROUPE ARTICLE] - Check', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuillesPrepareesExp.listBoxGroupeArticle.first());
            })
            
            test ('Listbox [UNITES DE PREPARATION] - Check', async () => {
                await fonction.checkListBox(pageSuiviEclatfeuillesPrepareesExp.listBoxUnitesPreparation,  true);
            })

            test ('Button [FILTERS] - Click',  async () =>{
                await fonction.clickAndWait(pageSuiviEclatfeuillesPrepareesExp.buttonFilters, page);                
            })

            test ('CheckBox [PREPARATEUR] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuillesPrepareesExp.checkBoxPreparateur);
            })
       
            test ('CheckBox [NUM FEUILLE] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuillesPrepareesExp.checkBoxNumFeuille);
            })
            
            test ('CheckBox [ARTICLE] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuillesPrepareesExp.checkBoxArticle);
            })
            
            test ('CheckBox [FOURNISSEUR] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuillesPrepareesExp.checkBoxFournisseur);
            })
           
            test ('CheckBox [NUM LOT] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuillesPrepareesExp.checkBoxNumLot);
            })
          
            test ('CheckBox [NUM PALETTE] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuillesPrepareesExp.checkBoxNumPalette);
            })
            
            test ('Link [FERMER] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuillesPrepareesExp.linkFermer);
            })
            
            test ('Link [FERMER] - Click', async () => {
                await fonction.clickElement(pageSuiviEclatfeuillesPrepareesExp.linkFermer);
            })

            test ('DataGrid [FEUILLES PREPAREES A EXPEDIER] - Check', async () => {
                
                var oDataGrid = 
                {
                    element     : pageSuiviEclatfeuillesPrepareesExp.dataGridFeuillesPreparees,    
                    desc        : 'FEUILLES PREPAREES A EXPEDIER',
                    verbose     :  false , 
                    column      : [
                        '0',
                        '',
                        '',
                        'Préparateur',
                        'Consigne palette',
                        'Feuille',
                        'Feuille fusionnée',
                        'Code article',
                        'Désignation article',
                        'Fournisseur',
                        'Date d\'arrivage',
                        'Empl.',
                        'Poids (kg)',
                        'Palettes',
                        'Colis à répartir',
                        'Magasins',
                        'Date de préparation',
                        'Heure début',
                        'Heure fin',
                        'Durée',
                        'Pause',
                        'Actions',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })    
            
        }) // End test.describe Onglet

        test.describe('Onglet [FEUILLES ANNULEES]',  async () => {

            test ('Onglet [FEUILLES ANNULEES] - Click',  async () => {
                await menu.clickOnglet(sCurrentPage, 'feuillesAnnulees', page);
            })

            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);                    
            })
         
            test ('Button [IMPRIMER] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAnnulees.buttonImprimer);
            })
           
            test ('Button [VISUALISER] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAnnulees.buttonVisualiser); 
            })
          
            test ('InputField [SEARCH ALL] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAnnulees.inputSearchAll);
            })
          
            test ('ListBox [GROUPE ARTICLE] - Check', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAnnulees.listBoxGroupeArticle.first());
            })

            test ('Button [FILTERS] - Click',  async () =>{
                fonction.clickAndWait(pageSuiviEclatfeuilleAnnulees.buttonFilters, page);          
            })

            test ('CheckBox [PREPARATEUR] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAnnulees.checkBoxPreparateur);
            })
            
            test ('CheckBox [NUM FEUILLE] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAnnulees.checkBoxNumFeuille);
            })
           
            test ('CheckBox [ARTICLE] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAnnulees.checkBoxArticle);
            })
            
            test ('CheckBox [FOURNISSEUR] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAnnulees.checkBoxFournisseur);
            })
            
            test ('CheckBox [NUM LOT] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAnnulees.checkBoxNumLot);
            })
            
            test ('Link [FERMER] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviEclatfeuilleAnnulees.linkFermer);
            })

            test ('Link [FERMER] - Click', async () => {
                await fonction.clickElement(pageSuiviEclatfeuilleAnnulees.linkFermer);
            })

            test ('DataGrid [FEUILLES ANNULEES] - Check', async () => {

                var oDataGrid = 
                {
                    element     : pageSuiviEclatfeuilleAnnulees.dataGridFeuillesAnnulees,    
                    desc        : 'FEUILLES ANNULEES',
                    verbose     :  false , 
                    column      :  [
                        '0',
                        'Statut',
                        'Consigne palette',
                        'Feuille',
                        'Annulé à',
                        'Préparateur',
                        'Heure début',
                        'Heure fin',
                        'Code article',
                        'Désignation article',
                        'Fournisseur',
                        'Date d\'arrivage',
                        'Conditionnement',
                        'Emplacements',
                        'Poids (kg)',
                        'Palettes',
                        'Colis à répartir',
                        'Magasins',
                        'Actions',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })  
 
        }) // End test.describe Onglet

    })  // End test.describe Page

    test.describe.skip ('Page [SUIVI PICKING]',  async () => {

        var sCurrentPage = 'picking';

        test ('Page [SUIVI PICKING] - Click', async () => {
            await menu.click(sCurrentPage, page);    
        })
    
        test.describe('Onglet [LISTES A PREPARER]',  async () => {

            test ('Onglet [LISTES A PREPARER] - Click',  async () => {
                await menu.clickOnglet(sCurrentPage, 'listesAPreparer', page);
            })

            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page); 
            })
                                 
            test ('Button [IMPRIMER] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviPickListesAPreparer.buttonImprimer);
            })
            
            test ('Button [VISUALISER] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviPickListesAPreparer.buttonVisualiser);
            })
            
            test ('Button [PREPARER VOCAL] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviPickListesAPreparer.buttonPreparerVocal);
            })
           
            test ('Button [PREPARER MANUELLEMENT] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviPickListesAPreparer.buttonPreparerManuellement);
            })
              
            test ('InputField [SEARCH ALL] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviPickListesAPreparer.inputSearchAll);
            })          
            
            test ('Button [FILTERS] - Click',  async () =>{
                await fonction.clickAndWait(pageSuiviPickListesAPreparer.buttonFilters, page);
            })

            test ('CheckBox [TOURNEE] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviPickListesAPreparer.checkBoxTournee);
            })
           
            test ('CheckBox [NUM LISTE] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviPickListesAPreparer.checkBoxNumListe);
            })
            
            test ('CheckBox [CHEMIN] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviPickListesAPreparer.checkBoxChemin);
            })
         
            test ('CheckBox [MAGASIN] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviPickListesAPreparer.checkBoxMagasin); 
            })
        
            test ('Link [FERMER] - Is Visible', async () => {
                await fonction.isDisplayed(pageSuiviPickListesAPreparer.linkFermer);
            })

            test ('Link [FERMER] - Click', async () => {
                await fonction.clickAndWait(pageSuiviPickListesAPreparer.linkFermer, page);
            })
            

            test ('DataGrid [LISTES A PREPARER] - Check', async () => {

                var oDataGrid = 
                {
                    element     : pageSuiviPickListesAPreparer.dataGridFeuillesAPreparer,    
                    desc        : 'LISTES A PREPARER',
                    verbose     :  false , 
                    column      : [
                        '0',
                        'Statut',
                        '',
                        'Ordre',
                        'Liste à servir',
                        'Chemin',
                        'Code mag.',
                        'Magasin',
                        'Nb articles',
                        'Nb colis',
                        'Actions',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })          
 
        })  // End test.describe Onglet             

        test.describe('Onglet [LISTES EN COURS]',  async () => {

            test ('Onglet [LISTES EN COURS] - Click',  async () => {
                await menu.clickOnglet(sCurrentPage, 'listesEnCours', page);
            })

            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);                          
            })
      
            test ('Button [IMPRIMER] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingEnCours.buttonImprimer);
            })
            
            test ('Button [VISUALISER] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingEnCours.buttonVisualiser); 
            })
            
            test ('InputField [SEARCH ALL] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingEnCours.inputSearchAll);
            })         
                                                                                                                                                                       
            test ('Button [FILTERS] - Click',  async () =>{
                await fonction.clickAndWait(pagePickingEnCours.buttonFilters, page);               
            })
            test ('CheckBox [PREPARATEUR] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingEnCours.checkBoxPreparateur);    
            })
          
            test ('CheckBox [TOURNEE] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingEnCours.checkBoxTournee);
            })        
     
            test ('CheckBox [NUM LISTE] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingEnCours.checkBoxNumListe);
            })
            
            test ('CheckBox [CHEMIN] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingEnCours.checkBoxChemin);
            })
           
            test ('CheckBox [MAGASIN] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingEnCours.checkBoxMagasin);
            })
     
            test ('Link [FERMER] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingEnCours.linkFermer);
            })

            test ('Link [FERMER] - Click', async () => {
                await fonction.clickAndWait(pagePickingEnCours.linkFermer, page);
            })

            test ('DataGrid [LISTES EN COURS] - Check', async () => {

                var oDataGrid = 
                {
                    element     :pagePickingEnCours.dataGridFeuillesEnCours,    
                    desc        : 'LISTES EN COURS',
                    verbose     :  false , 
                    column      : [
                        '0',
                        '',
                        'Préparateur',
                        'Ordre',
                        'Liste à servir',
                        'Chemin',
                        'Code mag.',
                        'Magasin',
                        'Nb articles',
                        'Nb colis',
                        'Début',
                        'Pause',
                        'Actions',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })        
 
        }) // End test.describe Onglet

        test.describe('Onglet [LISTES A VALIDER]',  async () => {

            test ('Onglet [LISTES A VALIDER] - Click',  async () => {
                await menu.clickOnglet(sCurrentPage, 'listesAValider', page);
            })

            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })

            test ('Button [IMPRIMER] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingAValider.buttonImprimer);
            })
            
            test ('Button [VISUALISER] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingAValider.buttonVisualiser); 
            })
             
            test ('Button [VALIDER] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingAValider.buttonValider);  
            })
            
            test ('Button [SYNTHESE DES ARTICLES MANQUANTS] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingAValider.buttonSynthese); 
            })
            
            test ('InputField [SEARCH ALL] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingAValider.inputSearchAll);
            })                                

            test ('Button [FILTERS] - Click',  async () =>{
                await fonction.clickAndWait(pagePickingAValider.buttonFilters, page);           
            })
            test ('CheckBox [PREPARATEUR] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingAValider.checkBoxPreparateur);
            })
          
            test ('CheckBox [TOURNEE] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingAValider.checkBoxTournee);
            })          
           
            test ('CheckBox [NUM LISTE] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingAValider.checkBoxNumListe);
            })
            
            test ('CheckBox [CHEMIN] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingAValider.checkBoxChemin);
            })
          
            test ('CheckBox [MAGASIN] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingAValider.checkBoxMagasin);
            })
        
            test ('Link [FERMER] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingAValider.linkFermer);
            })

            test ('Link [FERMER] - Click', async () => {
                await fonction.clickElement(pagePickingAValider.linkFermer);
            })
                        
            test ('DataGrid [LISTES EN COURS] - Check', async () => {

                var oDataGrid = 
                {
                    element     : pagePickingAValider.dataGridListesAValider,    
                    desc        : 'LISTES EN COURS',
                    verbose     :  false , 
                    column      : [
                        '0',
                        '',
                        '',
                        'Préparateur',
                        'Ordre',
                        'Liste à servir',
                        'Chemin',
                        'Code mag.',
                        'Magasin',
                        'Nb articles',
                        'Nb colis',
                        'Début',
                        'Heure fin',
                        'Durée',
                        'Suspensions',
                        'Actions',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })              

            var sNomPopin = "Synthèse des articles manquants dans les listes à servir du jour";
            test.describe(' Popin [' + sNomPopin.toUpperCase() + ']',  async () => {

                test ('Button [SYNTHESE DES ARTICLES MANQUANTS] - Click',  async () => {
                    await fonction.clickAndWait(pagePickingAValider.buttonSynthese, page);
                })

                test (' Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
                })

                test (' DataGrid [ARTICLES] - Check', async () => {

                    var oDataGrid = {
                        element     : pagePickingAValider.pDataGridArticle,    
                        desc        : 'ARTICLES',
                        verbose     : false, 
                        column      : [
                            '0',
                            'Article', 
                            'Nombre magasins',
                            'Colis manquants',
                        ]
                    }
                    await fonction.dataGridHeaders(oDataGrid);
                })
               
                test (' DataGrid [LISTE A SERVIR] - Check', async () => {

                    var oDataGrid = {
                        element     : pagePickingAValider.pDataGridListeAServir,    
                        desc        : 'LISTE A SERVIR',
                        verbose     : false, 
                        column      : [
                            'Liste à servir',
                            'Magasin', 
                            'Colis manquants',
                        ]
                    }
                    await fonction.dataGridHeaders(oDataGrid);
                })

                test ('Link [FERMER] - Click',  async () => {
                    await pagePickingAValider.pPlinkAnnulerArtManq.click();
                })

                test (' Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), false);
                })
            })

        }) // End test.describe Onglet

        test.describe('Onglet [LISTES PREPAREES]',  async () => {

            test ('Onglet [LISTES PREPAREES] - Click',  async () => {
                await menu.clickOnglet(sCurrentPage, 'listesPreparees', page);
            })

            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page); 
            })

            test ('Button [IMPRIMER] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingExpediee.buttonImprimer);
            })
            
            test ('Button [VISUALISER] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingExpediee.buttonVisualiser);
            })
           
            test ('Button [SYNTHESE DES ARTICLES MANQUANTS] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingExpediee.buttonSynthese);
            })  
          
            test ('InputField [SEARCH ALL] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingExpediee.inputSearchAll);
            })                                  
        
            test ('Button [FILTERS] - Click',  async () =>{
                await fonction.clickAndWait(pagePickingExpediee.buttonFilters, page);           
            })
            
            test ('CheckBox [PREPARATEUR] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingExpediee.checkBoxPreparateur);  
            }) 
  
            test ('CheckBox [TOURNEE] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingExpediee.checkBoxTournee);
            })          
            
            test ('CheckBox [NUM LISTE] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingExpediee.checkBoxNumListe);
            })
            
            test ('CheckBox [CHEMIN] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingExpediee.checkBoxChemin);
            })
            
            test ('CheckBox [MAGASIN] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingExpediee.checkBoxMagasin);
            })
          
            test ('CheckBox [UNIQUEMENT ANOMALIES] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingExpediee.checkBoxAnomalie);
            })
           
            test ('Link [FERMER] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingExpediee.linkFermer); 
            })

            test ('Link [FERMER] - Click', async () => {
                await fonction.clickElement(pagePickingExpediee.linkFermer); 
            })

            test ('DataGrid [LISTES EN COURS] - Check', async () => {

                var oDataGrid = 
                {
                    element     : pagePickingExpediee.dataGridListesExpediees,    
                    desc        : 'LISTES EN COURS',
                    verbose     :  false , 
                    column      : [
                        '0',
                        '',
                        '',
                        '',
                        'Préparateur',
                        'Ordre',
                        'Liste à servir',
                        'Chemin',
                        'Code mag.',
                        'Magasin',
                        'Nb articles',
                        'Nb colis',
                        'Début',
                        'Heure fin',
                        'Durée',
                        'Suspensions',
                        'Actions',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })
            
            var sNomPopin = "Synthèse des articles manquants dans les listes à servir du jour";
            test.describe(' Popin [' + sNomPopin.toUpperCase() + ']',  async () => {

                test ('Button [SYNTHESE DES ARTICLES MANQUANTS] - Click',  async () => {
                    await fonction.clickAndWait(pagePickingExpediee.buttonSynthese, page);
                })
    
                test (' Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
                })
                
                test (' DataGrid [ARTICLES] - Check', async () => {

                    var oDataGrid = {
                        element     : pagePickingAValider.pDataGridArticle,    
                        desc        : 'ARTICLES',
                        verbose     : false, 
                        column      : [
                            '0',
                            'Article', 
                            'Nombre magasins',
                            'Colis manquants',
                        ]
                    }
                    await fonction.dataGridHeaders(oDataGrid);
                })
               
                test (' DataGrid [LISTE A SERVIR] - Check', async () => {

                    var oDataGrid = {
                        element     : pagePickingAValider.pDataGridListeAServir,    
                        desc        : 'LISTE A SERVIR',
                        verbose     : false, 
                        column      : [
                            'Liste à servir',
                            'Magasin', 
                            'Colis manquants',
                        ]
                    }
                    await fonction.dataGridHeaders(oDataGrid);
                })

                test ('Link [FERMER] - Click',  async () => {
                    await fonction.clickElement(pagePickingExpediee.pPlinkAnnulerArtManq);
                })

                test (' Popin [' + sNomPopin.toUpperCase() + '] - Is not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), false);
                })
            })

        }) // End test.describe Onglet

        test.describe('Onglet [LISTES ANNULEES]',  async () => {

            test ('Onglet [LISTES ANNULEES] - Click',  async () => {
                await menu.clickOnglet(sCurrentPage, 'listesAnnulees', page);
            })
            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);  
            })
            
            test ('Button [IMPRIMER] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingAnnulee.buttonImprimer);
            })
        
            test ('Button [VISUALISER] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingAnnulee.buttonVisualiser);
            })

            test ('InputField [SEARCH ALL] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingAnnulee.inputSearchAll);
            })                                 
           
            test ('Button [FILTERS] - Click',  async () =>{
                await fonction.clickAndWait(pagePickingAnnulee.buttonFilters, page);
            })

            test ('CheckBox [NUM LISTE] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingAnnulee.checkBoxNumListe);
            })
            
            test ('CheckBox [CHEMIN] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingAnnulee.checkBoxChemin);
            })
            
            test ('CheckBox [MAGASIN] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingAnnulee.checkBoxMagasin);
            })
         
            test ('Link [FERMER] - Is Visible', async () => {
                await fonction.isDisplayed(pagePickingAnnulee.linkFermer);
            })

            test ('Link [FERMER] - Click', async () => {
                await fonction.clickElement(pagePickingAnnulee.linkFermer);
            })

            test ('DataGrid [LISTES EN COURS] - Check', async () => {

                var oDataGrid = 
                {
                    element     : pagePickingAnnulee.dataGridListesAnnulees,    
                    desc        : 'LISTES EN COURS',
                    verbose     :  false , 
                    column      : [
                        '0',
                        'Liste à servir',
                        'Annulée à',
                        'Chemin',
                        'Code mag.',
                        'Magasin',
                        'Nb articles',
                        'Nb colis',
                        'Actions',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid); 
            })
 

        }) // End test.describe Onglet

    })  // End test.describe Page

    test.describe.skip ('Page [PRODUCTIVITE]', async () => {
        
        var sCurrentPage = 'productivite';

        test ('Page [PRODUCTIVITE] - Click', async () => {
            await menu.click(sCurrentPage, page);
        })

        test.describe('Onglet [GESTION PREPARATEURS]', async () => {

            test ('Onglet [GESTION PREPARATEURS] - Click', async () => {
               await menu.clickOnglet(sCurrentPage, 'gestionPreparateurs', page);
            })

            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })
           
            test ('Button [CREER UN PREPARATEUR] - Is Visible', async () => {
                await fonction.isDisplayed(pageProdGestionPreparateurs.buttonCreerPreparateur); 
            })
    
            test ('Button [MODIFIER UN PREPARATEUR] - Is Visible', async () => {
                await fonction.isDisplayed(pageProdGestionPreparateurs.buttonPreparateurUpdate);
            })           
           
            test ('Button [SUPPRIMER UN PREPARATEUR] - Is Visible', async () => {
                await fonction.isDisplayed(pageProdGestionPreparateurs.buttonPreparateurDelete);
            })
            
            test ('InputField [RECHERCHER PREPARATEUR] - Is Visible', async () => {
                await fonction.isDisplayed(pageProdGestionPreparateurs.buttonPreparateurDelete); 
            })                                               

            test ('DataGrid [LISTES DES PREPARATEURS] - Check', async () => {

                var oDataGrid = 
                {
                    element     :pageProdGestionPreparateurs.dataGridPreparateurs,    
                    desc        : 'LISTES DES PREPARATEURS',
                    verbose     : false,
                    column      :   
                        [
                            'Nom',
                            'Prénom',
                            'Matricule',
                            'Code',
                            'Date d\'entrée',
                            'Statut',
                            'Contrat réceptionnaire',
                            'Temps partiel',
                            'Équipe',
                            'Actif',
                            'Responsable',
                            'Réceptionnaire',
                            'Chargeur',
                            'Magasinier',
                            'Préparation en vocal',
                            'Actions'
                        ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })
            
            var sNomPopin = "Création d'un préparateur";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test ('Button [CREER UN PREPARATEUR] - Click', async () => {
                    await fonction.clickAndWait(pageProdGestionPreparateurs.buttonCreerPreparateur, page);
                })
        
                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, 'CREATION D\'UN PREPARATEUR', true);
                })

                test ('InputField [NOM] - Is visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPinputCrePreNom);
                })

                test ('InputField [PRENOM] - Is visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPinputCrePrePrenom);
                })

                test ('InputField [MATRICULE] - Is visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPinputCrePreMatricule);
                })

                test ('InputField [CODE] - Is visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPinputCrePreMatricule);
                })

                test ('DataPicker [DATE D\'ENTREE] - Is visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPdatepickerCrePreEntree);
                })

                test ('ListBox [STATUT] - Check', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPlistBoxCrePreStatut);
                })
                test ('ListBox [EQUIPE] - Check', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPlistBoxCrePreEquipe);
                })

                test ('CheckBox [CONTRAT RECEPTIONNAIRE] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPcheckBoxCrePreContratRecep);
                })

                test ('CheckBox [TEMPS PARTIEL] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPcheckBoxCrePreTpsPartiel);
                })

                test ('CheckBox [ACTIF] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPcheckBoxCrePreActif);
                })

                test ('CheckBox [RESPONSABLE] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPcheckBoxCrePreResponsable);
                })

                test ('CheckBox [RECEPTIONNAIRE] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPcheckBoxCrePreReception);
                })

                test ('CheckBox [CHARGEUR] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPcheckBoxCrePreChargeur);
                })

                test ('CheckBox [MAGASINIER] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPcheckBoxCrePreMagasinier);
                })

                test ('CheckBox [PREPARTION EN VOCAL] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPcheckBoxCrePrePrepaVocal);
                })

                test ('CheckBox [CHAMPONNAY] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPlateformeColumn.nth(0));
                })

                test ('CheckBox [CREMCENTRE] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPlateformeColumn.nth(1));
                })

                test ('CheckBox [CREMILAN] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPlateformeColumn.nth(2));
                })

                test ('CheckBox [CREMLOG] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPlateformeColumn.nth(3));
                })

                test ('CheckBox [MILANOFI] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPlateformeColumn.nth(4));
                })
                
                test ('CheckBox [SAFIM] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPlateformeColumn.nth(5));
                })

                test ('CheckBox [SETTALA] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPlateformeColumn.nth(6));
                })

                test ('CheckBox [St-CYR-EN-VAL] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPlateformeColumn.nth(7));
                })

                test ('CheckBox [STOCKANDCO] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPlateformeColumn.nth(8));
                })

                test ('CheckBox [SUDLOG 10°] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPlateformeColumn.nth(9));
                })

                test ('CheckBox [SUDLOG 2°] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPlateformeColumn.nth(10));
                })

                test ('Button [CREER] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPbuttonCrePreCreer)
                })

                test ('Button [ANNULER] - Is Visible', async () => {
                    await fonction.isDisplayed(pageProdGestionPreparateurs.pPlinkCrePreAnnuler)
                })

                test ('Button [ANNULER] - Click', async () => {
                    await fonction.clickElement(pageProdGestionPreparateurs.pPlinkCrePreAnnuler);
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible ', async () => {
                    await fonction.popinVisible(page, 'CREATION D\'UN PREPARATEUR', false);
                })
            })
            
        })  // End test.describe Onglet               

        test.describe('Onglet [IMPORT TEMPS DE PRESENCE]', async () => {

            test ('Onglet [IMPORT TEMPS DE PRESENCE] - Click', async () => {
               await menu.clickOnglet(sCurrentPage, 'importTempsPresence', page);
            })

            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })

            test ('Button [CHOISISEZ UN FICHIER] - Is Visible', async () => {
                await fonction.isDisplayed(pageProdImportTPresencePage.buttonUploader); 
            })
               
            test ('Button [IMPORTER] - Is Visible', async () => {
                await fonction.isDisplayed(pageProdImportTPresencePage.buttonImporter);  
            })      
                                                        
            test ('Column Content [RESULTAT IMPORT] - Check', async () => {

                var oColumn = 
                {
                    element     :pageProdImportTPresencePage.tableResImpText,    
                    desc        : 'RESULTAT IMPORT',
                    column      :   
                        [
                            'Statut de l\'import',
                            'Message',
                            'Date d\'import',
                            'Préparateurs importés',
                            'Préparateurs inconnus',
                        ]
                }
                await fonction.dataGridHeaders(oColumn);
            })

            test ('DataGrid [TEMPS DE PRESENCE] - Check', async () => {

                var oDataGrid = 
                {
                    element     :pageProdImportTPresencePage.tableTPresence,    
                    desc        : 'TEMPS DE PRESENCE',
                    column      :   
                        [
                            'Date',
                            'Plateforme',
                            'Temps importés',
                        ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })

        })// End test.describe Onglet

        test.describe('Onglet [VALIDATION JOURNEE DE PREPARATION]', async () => {

            test ('Onglet VALIDATION JOURNEE DE PREPARATION] - Click', async () => {
               await menu.clickOnglet(sCurrentPage, 'validationJournee', page);
            })

            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })
        
            test ('Button [VALIDER LA JOURNEE] - Is Visible', async () => {
                await fonction.isDisplayed(pageProdValidationJrneePrepa.buttonValider);
            })
            
            test ('Button [INVALIDER LA JOURNEE] - Is Visible', async () => {
                await fonction.isDisplayed(pageProdValidationJrneePrepa.buttonInvalider);
            })
           
            test ('Link [IMPORT] - Is Visible', async () => {
                await fonction.isDisplayed(pageProdValidationJrneePrepa.linkImporter); 
            })        
        }) // End test.describe Onglet

        test.describe('Onglet [GESTION DES PARAMETRES]', async () => {

            test ('Onglet [GESTION DES PARAMETRES] - Click', async () => {
               await menu.clickOnglet(sCurrentPage, 'gestionParametres', page);
            })

            test ('Button [ENREGISTRER] - Is Visible', async () => {
                await fonction.isDisplayed(pageProdGestionParametres.buttonEnregistrer);
            })
        
            test ('Button [ANNULER] - Is Visible', async () => {
                await fonction.isDisplayed(pageProdGestionParametres.buttonAnnuler); 
            })
         
            test ('InputField [DUREE MINIMALE PREPARATION] - Is Visible', async () => {
                await fonction.isDisplayed(pageProdGestionParametres.inputDuree);
            })
        
            test ('InputField [TEMPS DE PAUSE] - Is Visible', async () => {
                await fonction.isDisplayed(pageProdGestionParametres.inputTempsPause);
            })
            
            test ('InputField [TEMPS PORTAGE] - Is Visible', async () => {
                await fonction.isDisplayed(pageProdGestionParametres.inputTempsPortage);  
            })

            test ('Column Content [PARAMETRES DE PRODUCTIVITE] - Check', async () => {

                var oColumn = 
                {
                    element     :pageProdGestionParametres.columnParametres,    
                    desc        : 'PARAMETRES DE PRODUCTIVITE',
                    verbose     : false,
                    column      :   
                        [
                            'Durée minimale d \'une préparation (minutes)',
                            'Temps de pause (minutes)',
                            'Temps portage / temps roulage',
                        ]
                }
                await fonction.dataGridHeaders(oColumn); 
            })

        }) // End test.describe Onglet

    })  // End test.describe Page

    test.describe.skip ('Page [AUTRES TRAVAUX]', async () => {

        var sCurrentPage = 'travaux';

        test ('Page [AUTRES TRAVAUX] - Click', async () => {
            await menu.click(sCurrentPage, page);
        })
      
        test.describe('Onglet [TACHES DU JOUR]', async () => {

            test ('Onglet [TACHES DU JOUR] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'tacheDuJour', page);
            })

            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })

            test ('Button [CREER UNE TACHE] - Is Visible', async () => {
                await fonction.isDisplayed(pageAurtresTacheDuJour.buttonTacheAdd);
            })
          
            test ('Button [MODIFIER UNE TACHE] - Is Visible', async () => {
                await fonction.isDisplayed(pageAurtresTacheDuJour.buttonTacheUpdate); 
            }) 
             
            test ('Button [SUPPRIMER UNE TACHE] - Is Visible', async () => {
                await fonction.isDisplayed(pageAurtresTacheDuJour.buttonTacheDelete);
            })

            test ('Button [IMPRIMER LES AUTRES TACHES] - Is Visible', async () => {
                await fonction.isDisplayed(pageAurtresTacheDuJour.buttonImpAutresTaches);
            })
             
            test ('DataGrid [LISTES DES TACHES] - Check', async () => {

                var oDataGrid = 
                {
                    element     : pageAurtresTacheDuJour.dataGridListetaches,    
                    desc        : 'LISTES DES TACHES',
                    verbose     : false,
                    column      :   
                        [
                            'Code préparateur',
                            'Nom',
                            'Prénom',
                            'Équipe',
                            'Tâche',
                            'Heure de début',
                            'Heure de fin',
                            'Durée',
                            'Commentaire',
                            'Actions',
                        ]
                }
                await fonction.dataGridHeaders(oDataGrid);   
            })

            test.describe('Popin [CREER UNE TACHE]', async () => {

                test ('Button [CREER UNE TACHE] - Click', async () => {
                    await fonction.clickAndWait(pageAurtresTacheDuJour.buttonTacheAdd, page);
                }) 

                test ('Popin [CREER UNE TACHE] - Is Visible', async () => {
                    await fonction.popinVisible(page, 'CREER UNE TACHE', true);
                })
               
                test ('Label [ERROR] -  Is Not Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);
                })
        
                test ('Button [CREER] - Is Visible', async () => {
                    await fonction.isDisplayed(pageAurtresTacheDuJour.pButtonEnregistrer);
                })
                
                test ('Button [ANNULER] - Is Visible', async () => {
                    await fonction.isDisplayed(pageAurtresTacheDuJour.pButtonAnnuler);
                })
      
                test ('InputField [PREPARATEUR] - Is Visible', async () => {
                    await fonction.isDisplayed(pageAurtresTacheDuJour.pInputPrepareteur);
                })
                
                test ('InputField [HEURE DEBUT] - Is Visible', async () => {
                    await fonction.isDisplayed(pageAurtresTacheDuJour.pInputHeureDebut);
                })

                test ('InputField [MINUTE DEBUT] - Is Visible', async () => {
                    await fonction.isDisplayed(pageAurtresTacheDuJour.pInputMinuteDebut);
                })
                
                test ('InputField [HEURE FIN] - Is Visible', async () => {
                    await fonction.isDisplayed(pageAurtresTacheDuJour.pInputHeureFin);
                })
            
                test ('InputField [MINUTE FIN] - Is Visible', async () => {
                    await fonction.isDisplayed(pageAurtresTacheDuJour.pInputMinuteFin);
                })
             
                test ('Listbox [TACHE] - Check', async () => {
                    await fonction.isDisplayed(pageAurtresTacheDuJour.pListBoxTache);
                })
                
                test ('TextArea [COMMENTAIRE] - Is Visible', async () => {
                    await fonction.isDisplayed(pageAurtresTacheDuJour.pTextAreaCommentaire);
                })
                
                test ('Button [ANNULER] - Click', async () => {
                    await fonction.clickElement(pageAurtresTacheDuJour.pButtonAnnuler);
                })                
    
                test ('Popin [CREER UNE TACHE] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, 'CREER UNE TACHE', false);
                })

            })  // End test.describe Popin  
  
            test.describe('Popin [IMPRESSION DES AUTRES TACHES]', async () => {

                test ('Button [IMPRIMER LES AUTRES TACHES] - Click', async () => {
                    await fonction.clickAndWait(pageAurtresTacheDuJour.buttonImpAutresTaches, page);
                })

                test ('Popin [IMPRESSION DES AUTRES TACHES] - Is Visible', async () => {
                    await fonction.popinVisible(page, 'IMPRESSION DES AUTRES TACHES', true);
                })

                test ('InputField [ATTENTE] - Is Visible', async () => {
                    await fonction.isDisplayed(pageAurtresTacheDuJour.pInputFieldNombreImp.nth(0))
                })

                test.skip('InputField [NOMBRE IMPRESSION] > 0', async () => {
                    page.waitForTimeout(250);
                    var iNbInput = await pageAurtresTacheDuJour.pInputFieldNombreImp.count();
                    console.log('Nb Input : ' + iNbInput);
                    expect(iNbInput).toBeGreaterThan(0);
                })

                test ('Button [IMPRIMER] - Is Visible', async () => {
                    await fonction.isDisplayed(pageAurtresTacheDuJour.pButtonImprimer)
                })

                test ('Button [FERMER] - Click', async () => {
                    await fonction.clickElement(pageAurtresTacheDuJour.pLinkFermer);
                })

                test ('Popin [IMPRESSION DES AUTRES TACHES] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, 'IMPRESSION DES AUTRES TACHES', false);
                })
            })// End test.describe Popin 

        })  // End test.describe Onglet               

        test.describe('Onglet [HISTORIQUE]', async () => {

            test ('Onglet [HISTORIQUE] - Click', async () => {
               await menu.clickOnglet(sCurrentPage, 'historique', page);
            })

            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })

            test ('DatePicker [DATE DEBUT] - Is Visible', async () => {
                await fonction.isDisplayed(pageAurtresTravTHistorique.datePickerFrom);    
            })
           
            test ('DatePicker [DATE FIN] - Is Visible', async () => {
                await fonction.isDisplayed(pageAurtresTravTHistorique.datePickerTo);       
            })                     
            
            test ('ListBox [TACHES] - Check', async () => {
                await fonction.isDisplayed(pageAurtresTravTHistorique.listBoxTache);    
            })
           
            test ('InputField [SEARCH PREPARATEUR] - Is Visible', async () => {
                await fonction.isDisplayed(pageAurtresTravTHistorique.inputSearchPreparateur);       
            })
            
            test ('InputField [EQUIPE] - Is Visible', async () => {
                await fonction.isDisplayed(pageAurtresTravTHistorique.inputSearchEquipe);       
            })

            test ('Button [RECHERCHER] - Is Visible', async () => {
                await fonction.isDisplayed(pageAurtresTravTHistorique.buttonRechercher);     
            })                                 

            test ('DataGrid [HISTORIQUE DES TACHES] - Check', async () => {

                var oDataGrid = 
                {
                    element     : pageAurtresTravTHistorique.dataGridListesTaches,    
                    desc        : 'HISTORIQUE DES TACHES',
                    verbose     : false,
                    column      :   
                        [
                            'Date tâche',
                            'Code préparateur',
                            'Nom',
                            'Prénom',
                            'Équipe',
                            'Tâche',
                            'Heure de début',
                            'Heure de fin',
                            'Durée',
                            'Pause',
                            'Commentaire',
                            'Actions'
                        ]
                }
                await fonction.dataGridHeaders(oDataGrid);     
            })

        }) // End test.describe Onglet

    })  // End test.describe Page

    test.describe('Page [REFERENTIEL]', async () => {

        var sCurrentPage = 'referentiel';

        test ('Page [REFERENTIEL] - Click', async () => {
            await menu.click(sCurrentPage, page);
        })
       
        test.describe('Onglet [EXPLOITATION DE PRODUCTIVITE]', async () => {

            test ('Onglet [EXPLOITATION DE PRODUCTIVITE] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'exploitationProductivite', page);
            })

            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })
            
            test ('Button [DEFINIR EXCFEPTION] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefExceptionProductivite.buttonDefinirException);  
            })
          
            test ('Button [RETIRER EXCFEPTION] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefExceptionProductivite.buttonRetirerException);
            })                    
       
            test ('ListBox [GROUPE ARTICLE] - Check', async () => {
                await fonction.isDisplayed(pageRefExceptionProductivite.listBoxGroupeArticle.first());
            })
  
            test ('InputField [SEARCH ARTICLE] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefExceptionProductivite.inputSearchArticle);
            })

            test ('CheckBox [AFFICHER UNIQUEMENT EXCEPTIONS] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefExceptionProductivite.checkBoxAfficherExceptions);  
            })

            test ('DataGrid [LISTES DES ARTICLES] - Check', async () => {

                var oDataGrid = 
                {
                    element  : pageRefExceptionProductivite.dataGridListesTaches,    
                    desc     : 'LISTES DES ARTICLES',
                    verbose  : false,
                    column   : [
                        '0',
                        'Code article',
                        'Désignation article',
                        'Famille',
                        'Exception',
                        'Actions',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })

        })  // End test.describe Onglet               

        test.describe('Onglet [CHEMIN ECLATEMENT]', async () => {

            test ('Onglet [CHEMIN ECLATEMENT] - Click', async () => {
               await menu.clickOnglet(sCurrentPage, 'cheminEclatement', page);
            })

            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })

            test ('Button [ENREGISTRER] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefCheminEclatement.buttonEnregistrer); 
            })
  
            test ('Button [CLONER] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefCheminEclatement.buttonCloner);  
            })                     
       
            test ('Button [DESACTIVER] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefCheminEclatement.buttonDesactiver); 
            })   
            
            test ('Button [EXPORTER] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefCheminEclatement.buttonExporter); 
            }) 

            test ('Button [IMPORTER] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefCheminEclatement.buttonImporter); 
            }) 

            test ('DataGrid [LISTES DES CHEMINS D\'ECLATEMENT] - Check', async () => {

                var oDataGrid = 
                {
                    element     : pageRefCheminEclatement.dataGridListesChemins,    
                    desc        : 'LISTES DES CHEMINS D\'ECLATEMENT',
                    verbose     : false,
                    column      : [
                        '0',
                        'Code',
                        'Nom',
                        'Quai',
                        'Emp',
                        // 'Emplacement',
                        'Ordre',
                        'Vague',
                        'Éligible fond palette',
                        'Rayon',
                        'Triangle',
                        'Rond',
                        'Carré',
                        'Étoile',
                        'Plus',
                        'Moins',
                        'Date livraison dégroupée',
                        'État',
                        'Actions',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })

        }) // End test.describe Onglet

        test.describe('Onglet [CHEMIN DE PICKING]', async () => {

            test ('Onglet [CHEMIN DE PICKING] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'cheminPicking', page);
            })

            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })

            test ('InputField [FILTRE EMPLACEMENT] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefCheminPicking.inputSearchEmplacement); 
            })
               
            test ('InputField [AJOUT EMPLACEMENT] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefCheminPicking.inputAllee);
            })  

            test ('InputField [ORDRE] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefCheminPicking.inputOrdre); 
            })                               
           
            test ('InputField [CODE DESIGN / ARTICLE] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefCheminPicking.inputCodeArticle);  
            })                      
        
            test ('Button [CREER CHEMIN] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefCheminPicking.buttonCreerChemin);
            })                    
          
            test ('Button [AJOUTER EMPLACEMENT] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefCheminPicking.buttonAjouterEmplacement); 
            })

            test ('Button [RECALCULER ORDRE] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefCheminPicking.buttonRecalculerOrdre);
            })                                             

            test ('DataGrid [LISTES DES TACHES] - Check', async () => {
                var oDataGrid = {
                    element     :pageRefCheminPicking.dataGridListesTaches,    
                    desc        : 'LISTES DES TACHES',
                    column      :  [
                        'Désignation',
                        'Ordre',
                        'Zone vocale',
                        'Fusion des clients',
                        'Actions'
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            }) 

            test ('DataGrid [LISTES DES CHEMINS D\'ECLATEMENT] - Check', async () => {
                var oDataGrid = {
                    element     :pageRefCheminPicking.dataGridListesChemin,    
                    desc        : 'LISTES DES CHEMINS D\'ECLATEMENT',
                    column      :  [
                        'Emplacement',
                        'Allée',
                        'Ordre',
                        'Article',
                        'Principal',
                        'Catégorie',
                        'Neutralisé',
                        'Actions'
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })

            test.describe('Popin [CREER UN CHEMIN]', async () => {

                test ('Button [CREER CHEMIN] - Click', async () => {
                    await fonction.clickAndWait(pageRefCheminPicking.buttonCreerChemin, page);
                }) 

                test ('[CREER UN CHEMIN] - Is Visible', async () => {
					await fonction.popinVisible(page,'CREER UN CHEMIN', true);
				}) 

                test ('InputField [DESIGNATION] - Is Visible', async () => {
                    await fonction.isDisplayed(pageRefCheminPicking.pPinputNomChemDesignation)
                })

                test ('InputField [ORDRE] - Is Visible', async () => {
                    await fonction.isDisplayed(pageRefCheminPicking.pPinputNomChemOrdre)
                })

                test ('CheckBox [FUSION DES CLIENTS] - Is Visible', async () => {
                    await fonction.isDisplayed(pageRefCheminPicking.pCheckBoxFusionClient)
                })

                test ('Button [ENREGISTRER] - Is Visible', async () => {
                    await fonction.isDisplayed(pageRefCheminPicking.pPbuttonNomChemCreer)
                })

                test ('Button [ANNULER] - Is Visible', async () => {
                    await fonction.isDisplayed(pageRefCheminPicking.pPbuttonAnnuler)
                })

                test ('Button [ANNULER] - Click', async () => {
                    await fonction.clickElement(pageRefCheminPicking.pPbuttonAnnuler);
                })

                 test ('[CREER UN CHEMIN] - Is Not Visible', async () => {
					await fonction.popinVisible(page,'CREER UN CHEMIN', false);
				})

            }) // End Popin

        }) // End test.describe Onglet

        test.describe('Onglet [TOURNEES DE PICKING]', async () => {

            test ('Onglet [TOURNEES DE PICKING] - Click', async () => {
               await menu.clickOnglet(sCurrentPage, 'tourneesPicking', page);
            })

            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })           
         
            test ('InputField [MAGASIN A APPLIQUER] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefRTourneePicking.inputMagasin); 
            }) 
        
            test ('InputField [FILTRE MAGASIN] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefRTourneePicking.inputFiltreMagasin); 
            })
       
            test ('Button [APPLIQUER] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefRTourneePicking.buttonAppliquer); 
            })
            
            test ('InputFields [ORDRE + TOURNEE] - (14 Items) Are Visible', async () => {
                expect(await pageRefRTourneePicking.inputOrdreTournee.count()).toEqual(14);      // Nombre de champs input "ORDRE" + "TOURNEE"
            })
            
            test ('DataGrid [JOURS SEMAINE] - Check', async () => {

                var oDataGrid = 
                {
                    element     : pageRefRTourneePicking.headersSemaine,    
                    desc        : 'JOURS SEMAINE',
                    verbose     : false,
                    column      :   
                        [
                            'Lundi',
                            'Mardi',
                            'Mercredi',
                            'Jeudi',
                            'Vendredi',
                            'Samedi',
                            'Dimanche',
                        ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })

            test ('DataGrid [LISTES DES TOURNEES] - Check', async () => {
                var oDataGrid = 
                {
                    element     : pageRefRTourneePicking.dataGridTournees,    
                    desc        : 'LISTES DES TOURNEES',
                    verbose     : false,
                    column      :   
                        [
                            '0',
                            'Magasin',
                            'Rayon',
                            'LundiOrdre / Tournée', 
                            'MardiOrdre / Tournée',
                            'MercrediOrdre / Tournée',
                            'JeudiOrdre / Tournée',
                            'VendrediOrdre / Tournée',
                            'SamediOrdre / Tournée',
                            'DimancheOrdre / Tournée',
                        ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })

        }) // End test.describe Onglet

        test.describe('Onglet [PARAMETRES D\'IMPRESSION]', async () => {

            test ('Onglet [PARAMETRES D\'IMPRESSION] - Click', async () => {
               await menu.clickOnglet(sCurrentPage, 'parametresImpression', page);
            })

            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })

            test ('Button [ENREGISTRER] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefParametresImpression.buttonEnregistrer); 
            })
           
            test ('ListBox [IMPRIMANTES ETIQUETTES] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefParametresImpression.listBoxImpressionEtiquettes);   
            })
            
            test ('ListBox [IMPRIMANTES FEUILLES] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefParametresImpression.listBoxImpressionFeuilles);   
            })

            test ('Button [PLUS] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefParametresImpression.buttonPlus);   
            })                                                      

            test ('Column Content [PARAMETRES D\'IMPRESSION] - Check', async () => {
                
                var oColumn = 
                {
                    element     : pageRefParametresImpression.columnParemetresImpression,    
                    desc        : 'PARAMETRES D\'IMPRESSION',
                    verbose     : false,
                    column      : [
                        'Imprimante par défaut pour l\'impression d\'étiquettes',
                        'Imprimante par défaut pour l\'impression de feuilles de préparation',
                    ]
                }
                await fonction.dataGridHeaders(oColumn)
            })

            test ('DataGrid [PARAMETRES D\'IMPRESSION DES ETIQUETTES DES PALETTES]', async () => {
                var oDataGrid = 
                {
                    element     : pageRefParametresImpression.tableparamImpEtiqpalettes,    
                    desc        : 'PARAMETRES D\'IMPRESSION DES ETIQUETTES DES PALETTES',
                    verbose     : false,
                    column      : [
                        'Plateforme expédition',
                        'Imprimante par défaut',
                        '',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid)
            })

        }) // End test.describe Onglet

        test.describe('Onglet [PARAMETRES VOCAUX]', async () => {

            test ('Onglet [PARAMETRES VOCAUX] - Click', async () => {
               await menu.clickOnglet(sCurrentPage, 'parametresVocaux', page);
            })
            
            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })

            test ('Button [ENREGISTRER LES MODIFICATIONS]', async () => {
                await fonction.isDisplayed(pageRefParametresVocaux.buttonEnregistrerModif);
            })

            test ('DataGrid [CODE / RAYON / DESIGNATION]', async () => {

                var oDataGrid = 
                {
                    element     : pageRefParametresVocaux.dataGridListesTaches,    
                    desc        : 'CODE / RAYON / DESIGNATION]',
                    verbose     : false,
                    column      :   
                        [
                            'Code',
                            'Rayon',
                            'Désignation',
                            'Nom vocal',
                            'Consigne picking',
                        ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })

        }) // End test.describe Onglet

        test.describe('Onglet [REFERENTIEL ARTICLES]', async () => {

            test ('Onglet [REFERENTIEL ARTICLES] - Click', async () => {
               await menu.clickOnglet(sCurrentPage, 'referentielArticles', page);
            })

            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })
    
            test ('InputField [ARTICLE] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefReferentielArticle.inputArticle);
            })

            test ('ListBox [GROUPE ARTICLE] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefReferentielArticle.inputArticle);
            })

            test ('CheckBox [ENVOYER CONSIGNE A LA VOCALE] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefReferentielArticle.checkBoxEnvoyerConsigne);
            })

            test ('Button [RECHERCHER] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefReferentielArticle.buttonRechercher);
            })

            test ('Button [ENREGISTRER] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefReferentielArticle.buttonEnregistrerModif);
            })

            test ('DataGrid [ARTICLES] - Check', async () => {

                var oDataGrid = 
                {
                    element     : pageRefReferentielArticle.dataGridListesTaches,    
                    desc        : 'DataGrid [ARTICLES]',
                    verbose     : false,
                    column      :   
                        [
                            '0',
                            'Code article',
                            'Désignation article',
                            'Seuil fond de palette',
                            'Consigne palette',
                            'Consigne',
                            'Actions',
                        ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })

        }) // End test.describe Onglet

        test.describe('Onglet [MODE DE PREPARATION ET EXCEPTIONS]', async () => {

            test ('Onglet [MODE DE PREPARATION ET EXCEPTIONS] - Click', async () => {
               await menu.clickOnglet(sCurrentPage, 'modePreparationExceptions', page);
            })

            test ('Label [ERROR] -  Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })

            test ('Button [CREER UNE EXCEPTION] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefModePrepaExcep.buttonCreerException);
            })
           
            test ('InputField [ARTICLE] - Is Visible', async () => {
                await fonction.isDisplayed(pageRefModePrepaExcep.inputArticle);    
            })    

            test ('DataGrid [LISTE DES GROUPES] - Check', async () => {

                var oDataGrid = 
                {
                    element     : pageRefModePrepaExcep.dataGridListeGroupes,    
                    desc        : 'LISTE DES GROUPES',
                    verbose     : false,
                    column      : [
                        '0',
                        'Groupe article',
                        'Mode préparation',
                        'Exception(s)',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })      

            test ('DataGrid [LISTE DES ARTICLES] - Check', async () => {
                
                var oDataGrid = 
                {
                    element     : pageRefModePrepaExcep.dataGridListearticles,    
                    desc        : 'LISTE DES ARTICLES',
                    verbose     : false,
                    column      : [
                        'Mode',
                        'Code article',
                        'Désignation article',
                        'Date début',
                        'Date fin',
                        'Actions',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })

        }) // End test.describe Onglet

    })  // End test.describe Page

    test.describe('Page [ADMIN]', async () => {    

		var sNomPage = 'admin';

		test ('Page [ADMIN] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		test.describe("Onglet [ADMINISTRATION]", async() => {

			test("Onglet [ADMINISTRATION] - Click ", async() => {
				await menu.clickOnglet(sNomPage, 'administration', page);
			})
		})

		test.describe("Onglet [DIFFUSION]", async() => {

			test("Onglet [DIFFUSION] - Click ", async() => {
				await menu.clickOnglet(sNomPage, 'diffusion', page);
			})
		})

		test.describe("Onglet [CHANGELOG]", async() => {

			test("Onglet [CHANGELOG] - Click ", async() => {
				await menu.clickOnglet(sNomPage, 'changelog', page);
			})
		})

		test.describe("Onglet [COMMUNICATION UTILISATEUR]", async() => {

			test("Onglet [COMMUNICATION UTILISATEUR] - Click ", async() => {
				await menu.clickOnglet(sNomPage, 'communicationUtilisateur', page);
			})

			test ('Ipnut and button [Is - visble] - Check', async () => {
				await fonction.isErrorDisplayed(false, page);                            // Pas d'erreur affichée à priori au chargement de l'onglet        
			})
		})

		test.describe("Onglet [CHANGELOG]", async() => {

			test("Onglet [VOCAL] - Click ", async() => {
				await menu.clickOnglet(sNomPage, 'vocal', page);
			})
		})

	})  // End test.describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})