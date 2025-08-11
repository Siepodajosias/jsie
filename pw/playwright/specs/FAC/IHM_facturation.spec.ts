/**
 * 
 * FACTURATION APPLICATION > CONTENU
 * 
 * @author Vazoumana Diarrassouba
 * 
 */

const xRefTest      = "FAC_IHM_GLB";
const xDescription  = "Examen de l'IHM Facturation";
const xIdTest       =  574;
const xVersion      = '3.11';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'FAC',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};

//-------------------------------------------------------------------------------------------------------------------

import { test, type Page }                                  from '@playwright/test';

import { Help }                                             from '@helpers/helpers';
import { TestFunctions }                                    from '@helpers/functions';

import { MenuFacturation }                                  from '@pom/FAC/menu.page';

import { ArrivagePage }                                     from '@pom/FAC/archivage.page';

import { LivraisonPrevuePage }                              from '@pom/FAC/livraisons_prevues.page';

import { LivraisonsEcartsLivraison }                        from '@pom/FAC/livraisons_effectuees-ecarts_livraisons.page';
import { LivraisonsEffectuesRemises }                       from '@pom/FAC/livraisons_effectues-remises.page';
import { EffectuesLivraisonRelles }                         from '@pom/FAC/livraisons_effectues-livraisons_reelles.page';
import { LivraisonsEffectuesLivraisonsDirectes }            from '@pom/FAC/livraisons_effectues-livraisons_directes.page';

import { RegulationEcartAttente }                           from '@pom/FAC/regularisation-ecarts_attente.page';
import { RegulationDemandeAvoirPage }                       from '@pom/FAC/regularisation-demande_avoir.page';
import { RegulationEchangeMarchandisesPage }                from '@pom/FAC/regularisation-echange_marchandises.page';
import { RegularisationRegularisationEffectuee }            from '@pom/FAC/regularisation-regularisation_effectuees.page';
import { RegularisationAvoirComplementaires }               from '@pom/FAC/regularisation-avoirs_complementaires.page';

import { FacturationListeFactures }                         from '@pom/FAC/facturation-liste_factures.page';
import { FacturationListeReleves }                          from '@pom/FAC/facturation-liste_releves.page';
import { FacturationRecettesMagasins }                      from '@pom/FAC/facturation-recettes_magasins.page';
import { FacturationReferentielTiers }                      from '@pom/FAC/facturation-referntiel_tiers.page';
import { FacturationCompteBancaire }                        from '@pom/FAC/facturation-comptes-bancaire.page';

import { CartoucheInfo, TypeListOfElements }                from '@commun/types';

//-------------------------------------------------------------------------------------------------------------------

let page                                        : Page;

let menu                                        : MenuFacturation;

let arrivagePage                                : ArrivagePage;

let effectuesLivraisonRelles                    : EffectuesLivraisonRelles;

let livraisonPrevuePage                         : LivraisonPrevuePage;
let livraisonsEcartsLivraison                   : LivraisonsEcartsLivraison;
let livraisonsEffectuesLivraisonsDirectes       : LivraisonsEffectuesLivraisonsDirectes;
let livraisonsEffectuesRemises                  : LivraisonsEffectuesRemises; 

let regulationEchangeMarchandisesPage           : RegulationEchangeMarchandisesPage; 
let regulationEcartAttente                      : RegulationEcartAttente;
let regulationDemandeAvoirPage                  : RegulationDemandeAvoirPage;
let regularisationRegularisationEffectuee       : RegularisationRegularisationEffectuee; 
let regularisationAvoirComplementaires          : RegularisationAvoirComplementaires; 

let facturationListeFactures                    : FacturationListeFactures;
let facturationListeReleves                     : FacturationListeReleves; 
let facturationRecettesMagasins                 : FacturationRecettesMagasins;
let facturationReferentielTiers                 : FacturationReferentielTiers;
let facturationCompteBancaire                   : FacturationCompteBancaire;

const fonction                                  = new TestFunctions();

fonction.recordDatas(false);		//-- Inutile de créer une fiche de données

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    
    page                                        = await browser.newPage();
    menu                                        = new MenuFacturation(page, fonction) ;
    
    arrivagePage                                = new ArrivagePage(page);

    livraisonPrevuePage                         = new LivraisonPrevuePage(page);
    livraisonsEcartsLivraison                   = new LivraisonsEcartsLivraison(page);
    livraisonsEffectuesLivraisonsDirectes       = new LivraisonsEffectuesLivraisonsDirectes(page);
    livraisonsEffectuesRemises                  = new LivraisonsEffectuesRemises(page); 

    effectuesLivraisonRelles                    = new EffectuesLivraisonRelles(page);
 
    regulationDemandeAvoirPage                  = new RegulationDemandeAvoirPage(page);
    regulationEcartAttente                      = new RegulationEcartAttente(page);
    regulationEchangeMarchandisesPage           = new RegulationEchangeMarchandisesPage(page);
    regularisationRegularisationEffectuee       = new RegularisationRegularisationEffectuee(page);
    regularisationAvoirComplementaires          = new RegularisationAvoirComplementaires(page);

    facturationListeFactures                    = new FacturationListeFactures(page);
    facturationListeReleves                     = new FacturationListeReleves(page); 
    facturationRecettesMagasins                 = new FacturationRecettesMagasins(page);
    facturationReferentielTiers                 = new FacturationReferentielTiers(page);  
    facturationCompteBancaire                   = new FacturationCompteBancaire(page);

    await menu.searchNewElements(testInfo);

    const helper                                = new Help(info, testInfo, page);
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

test.describe.serial ('[' + xRefTest + ']', async () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({context}) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe ('Page [ACCUEIL]', async () => {

         test ('ListBox [SELECTIONNER PLATEFORME] - Is Visible', async () => {
            await fonction.isDisplayed(menu.listBoxPlateforme);                   
         })

         test ('ListBox [SELECTIONNER RAYON] - Is Visible', async () => {
            await fonction.isDisplayed(menu.listBoxRayon);
         })

    })  //-- End Describe Page


    test.describe ('Page [LIVRAISONS PREVUES]', async () => {

        let sCurrentPage = 'livPrevues';

        test ('Page [LIVRAISONS PREVUES]', async () => {
            await menu.click(sCurrentPage, page);
        })

        test ('DatePicker [EXPEDITION MAGASIN]', async () => {
            await fonction.isDisplayed(livraisonPrevuePage.datePickerExpeditionMag);
        })
          
        test ('Button [ENVOYER LES LIVRAISONS]', async () => {
            await fonction.isDisplayed(livraisonPrevuePage.buttonEnvoyerLivraisons); 
        })
       
        test ('Button [SYNTHES DES PREPARATIONS]', async () => {
            await fonction.isDisplayed(livraisonPrevuePage.buttonSynthesePreparations); 
        }) 
         
        test ('Button [IMPRIMER LES BL PREVISIONNELS]', async () => {
            await fonction.isDisplayed(  livraisonPrevuePage.buttonImprimerBLPrev);
        })
          
        test ('Button [TRANSMETTRE LES BL PREVISIONNELS]', async () => {
            await fonction.isDisplayed(livraisonPrevuePage.buttonTransmettreBLPrev); 
        })
        
        test ('Button [RECHERCHER]', async () => {
            await fonction.isDisplayed(livraisonPrevuePage.buttonRechercher);
        }) 
        
        test ('InputField [SEARCH MAGASIN]', async () => {
            await fonction.isDisplayed(livraisonPrevuePage.inputSearchMagasin);
        }) 
        
        test ('InputField [SEARCH ARTICLE]', async () => {
            await fonction.isDisplayed(livraisonPrevuePage.inputSearchArticle);
        })  
          
        test ('CheckBox [AFFICHER UNIQUEMENT ECARTS PREP]', async () => {
            await fonction.isDisplayed(livraisonPrevuePage.checkboxAfficherEcartPrep);
        })

        test ('Datagrid [HEADERS] ', async () => {
            var oDataGrid:TypeListOfElements = 
            {
                element     : livraisonPrevuePage.dataGridListeLivraisons,    
                desc        : 'DataGrid [LISTE MAGASINS]',
                verbose     : false, 
                column      :   
                    [
                        'Numéro BF',
                        'Centrale achat',
                        'Code magasin',
                        'Désignation magasin',
                        'Code article',
                        'Désignation article',
                        'Numéro de lot',
                        'Calibre',
                        'Conditionnement',
                        'Quantité répartie',
                        'Quantité préparée',
                    ]
            }
            await fonction.dataGridHeaders(oDataGrid);       
        })

        test ('Button [SYNTHES DES PREPARATIONS] - Click', async () => {
            await fonction.clickElement(livraisonPrevuePage.buttonSynthesePreparations);
        })

        var sNomPopin = "Imprimer les bons de livraison prévisionnels";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

            test ('Button [IMPRIMER LES BL PREVISIONNELS] - Click', async () => {
                await fonction.clickAndWait(livraisonPrevuePage.buttonImprimerBLPrev, page)
            })

            test ('Popin ['+sNomPopin.toUpperCase()+'] - Is Visible', async () => {
                await livraisonPrevuePage.pPopinImprimerBLPrevisionnels.isVisible();
            })

             test ('Button [IMPRIMER]', async () => {
                await fonction.isDisplayed(livraisonPrevuePage.pPimprimerBlButtonImprimer); 
             })
             
            test ('Link [FERMER]', async () => {
                await fonction.isDisplayed(livraisonPrevuePage.pPimprimerBlLinkFermer); 
             })          
               
            test ('InputField [CODE MAGASIN]', async () => {
                await fonction.isDisplayed(livraisonPrevuePage.pPimprimerBlInputCodeMag); 
            })        
             
            test ('InputField [DESIGNATION MAGASIN]', async () => {
                await fonction.isDisplayed(livraisonPrevuePage.pPimprimerBlInputDesMag);
            }) 
               
            test ('DataGrid [Headers]', async () => {
                var oDataGrid:TypeListOfElements = {
                    element     : livraisonPrevuePage.pPimprimerBlDatagridMag,    
                    desc        : 'DataGrid [LISTE MAGASINS]',
                    verbose     : false, 
                    column      : 
                    [
                        '0',
                        'Code magasin',
                        'Désignation magasin',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })

            test ('Link [FERMER] - Click', async () => {
                await fonction.clickElement(livraisonPrevuePage.pPimprimerBlLinkFermer);
            })

            test ('Popin ['+sNomPopin.toUpperCase()+'] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            })

        })            

    })  //-- End Describe Page
          
    
    test.describe ('Page [LIVRAISONS EFFECTUEES]', async () => {    

        var sCurrentPage = 'livEffectuees';

        test ('Page [LIVRAISON EFFECTUEES] - Click', async () =>{
            await menu.click(sCurrentPage, page);
        })

        test.describe ('Onglet [ECARTS DE LIVRAISON]', async () => {

            test ('Onglet [ECARTS DE LIVRAISON] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'ecartsLivraison', page);
            })

            test ('DatePicker [EXPEDITION MAGASIN]', async () => {
                await fonction.isDisplayed(livraisonsEcartsLivraison.datePickerExpeditionMag);
            })
            
            test ('Button [CONSULTER LES CR DE LIVRAISON]', async () => {
                await fonction.isDisplayed(livraisonsEcartsLivraison.buttonConsulterCRLivraison);
            })
            
            test ('Button [REPORTER LA JUSTIFICATION]', async () => {
                await fonction.isDisplayed(livraisonsEcartsLivraison.buttonReporterJustification);
            })          
            
            test ('InputField [CODE / DESIGN. ARTICLE]', async () => {
                await fonction.isDisplayed(livraisonsEcartsLivraison.inputSearchCodeArticle); 
            }) 
              
            test ('InputField [CODE / NOM MAGASIN]', async () => {
                await fonction.isDisplayed(livraisonsEcartsLivraison.inputSearchMagasin);
            })                   
              
            test ('ListBox [ARTICLES] - Is Visible', async () => {
                livraisonsEcartsLivraison.listBoxArticles.isVisible()
            })                                
                                                          
            test ('DataGrid [HEADERS]', async () => {

                    var oDataGrid:TypeListOfElements = {
                        element     : livraisonsEcartsLivraison.dataGridListeEcartsArticles,    
                        desc        : 'DataGrid [ARTICLES EN ECART]',
                        verbose     : false, 
                        column      :   
                            [
                                '0',
                                'Code article',
                                'Designation',
                                'Écarts traités',          
                            ]
                    }
                    await fonction.dataGridHeaders(oDataGrid);
                    
                    oDataGrid = 
                    {
                        element     : livraisonsEcartsLivraison.dataGridListeEcartsConstates,    
                        desc        : 'DataGrid [ECARTS CONSTATES]',
                        verbose     : false, 
                        column      :   
                            [
                                '0',
                                'Liés',
                                'Type d\'écart',
                                'Code article',
                                'Désignation article',
                                'Code source',
                                'Désignation source',
                                'Numéro de lot',
                                'Quantité théorique',
                                'Quantité réelle',
                                'Écart',
                                'Obs.',
                                'Justifié',
                                'Motif',
                                'Actions',           
                            ]
                    }
                    await fonction.dataGridHeaders(oDataGrid);
            })
            //--------------------------------------------------------------------------------------------------------------------------         
                
            test.describe ('Popin [COMPTE-RENDU DE LIVRAISON DU ...]', async () => {

                test ('Button [CONSULTER LES CR DE LIVRAISON] - Click', async () => {
                   await fonction.clickAndWait( livraisonsEcartsLivraison.buttonConsulterCRLivraison,                    page)
                })
                
                test ('COMPTE-RENDU DE LIVRAISON DU ... - Is Visible', async () => {
                    livraisonsEcartsLivraison.pPopinComptesRendusLivraison.isVisible()
                })

                test ('DataGrid [HEADERS]', async () => {
                    var oDataGrid:TypeListOfElements = {
                        element     : livraisonsEcartsLivraison.pPdataGridCRLivraisaon,    
                        desc        : 'DataGrid [LISTE RECEPTIONS]',
                        verbose     : false, 
                        column      :   
                            [
                                'Code magasin',
                                'Désignation magasin',
                                'Commentaire du magasin',
                                'Groupe article',
                                'Reçu',       
                            ]
                    }
                    await fonction.dataGridHeaders(oDataGrid);
                }) 

                test ('Button [FERMER] - Click', async () => {
                    await fonction.clickElement(livraisonsEcartsLivraison.pPbuttonFermer);
                })

                test ('COMPTE-RENDU DE LIVRAISON DU ... - Is Not Visible', async () => {
                    await fonction.popinVisible(page, 'Compte-rendu de livraison', false);
                })

            })  // End describe Popin

        })  // End describe Onglet

        test.describe ('Onglet [LIVRAISONS RELLES]', async () => {

            test ('Onglet [LIVRAISONS RELLES] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'livraisonsRelles', page);
            })

            test.fixme ('Button [RESULTAT LISSAGE]', async () => {
                await fonction.isDisplayed(effectuesLivraisonRelles.buttonResultatLissage);
            })

            test.fixme ('Button [MODIFIER POIDS LOT]', async () => {
                await fonction.isDisplayed(effectuesLivraisonRelles.buttonModifierPoidsLot);
            })

            test.fixme ('Button [MODIFIER PRIX CESSION]', async () => {
                await fonction.isDisplayed(effectuesLivraisonRelles.buttonModifierPrixCession);
            })

            test ('Button [ENVOYER LA FACTURATION]', async () => {
                await fonction.isDisplayed(effectuesLivraisonRelles.buttonEnvoyerFacturation);
            })

            test.fixme ('Button [READRESSER DES LIVRAISONS]', async () => {
                await fonction.isDisplayed(effectuesLivraisonRelles.buttonReadresserLivraisons);
            })
            
            test ('Button [RECHERCHER]', async () => {
                await fonction.isDisplayed(effectuesLivraisonRelles.buttonRechercher);
            })
                    
            test ('InputField [MAGASIN]', async () => {
                await fonction.isDisplayed(effectuesLivraisonRelles.inputSearchMagasin);
            })
             
            test ('InputField [ARTICLE]', async () => {
                await fonction.isDisplayed(effectuesLivraisonRelles.inputSearchArticle);
            })                                                                                                                  
            
            test ('InputField [FILTRE NUMERO BF]', async () => {
                await fonction.isDisplayed(effectuesLivraisonRelles.inputFiltreNumeroBF);
            })                                                          
            
            test ('InputField [FILTRE MAGASIN]', async () => {
                await fonction.isDisplayed(effectuesLivraisonRelles.inputFiltreMagasin);
            })                                                          
            
            test ('InputField [FILTRE ARTICLE]', async () => {
                await fonction.isDisplayed(effectuesLivraisonRelles.inputFiltreArticle);
            })                                                          
            
            test ('InputField [FILTRE NUM LOT]', async () => {
                await fonction.isDisplayed(effectuesLivraisonRelles.inputFiltreNumeroLot);
            })                                                          
            
            test ('InputField [FILTRE QTE COLIS]', async () => {
                await fonction.isDisplayed(effectuesLivraisonRelles.inputFiltreQteColis);
            })                                                          
            
            test ('InputField [FILTRE QTE UC]', async () => {
                await fonction.isDisplayed(effectuesLivraisonRelles.inputFiltreQteUC);
            })                                                          
            
            test ('InputField [FILTRE PRIX CESSION]', async () => {
                await fonction.isDisplayed(effectuesLivraisonRelles.inputFiltrePrixCession);
            })                                                          
            
            test ('InputField [FILTRE TOTAL]', async () => {
                await fonction.isDisplayed(effectuesLivraisonRelles.inputFiltreTotal);
            })                                                          
            
            test ('InputField [FILTRE QTE UE]', async () => {
                await fonction.isDisplayed(effectuesLivraisonRelles.inputFiltreQteUE);
            })

            test ('DataGrid [HEADERS]', async () =>{
                var oDataGrid:TypeListOfElements = 
                {
                    element     : effectuesLivraisonRelles.dataGridListeLivraisons,    
                    desc        : 'DataGrid [LIVRAISONS RELLES]',
                    verbose     : false, 
                    column      :   
                        [
                            '0',
                            'Numéro BF',
                            'Centrale achat',
                            'Magasin',
                            'Article',
                            'N° lot',
                            'Calibre',
                            'Conditionnement',
                            'Qte (colis)',
                            'Quantité (UC)',
                            'Prix cession',
                            'Total',
                            'Quantité (UE)',
                            'Prix lissés',
                            'Type',
                        ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })
        })  // End describe Onglet

        test.describe ('Onglet [LIVRAISONS SUR PLATEFORME]', async () => {

            test ('Onglet [LIVRAISONS RELLES] - Click', async () =>{
                await menu.clickOnglet(sCurrentPage, 'livraisonsDirectes', page);
            })
            test ('Button [IMPRIMER LA FACTURE]', async () => {
                await fonction.isDisplayed(livraisonsEffectuesLivraisonsDirectes.buttonImprimerFacture);
            })
             
            test ('Button [MODIFIER]', async () => {
                await fonction.isDisplayed(livraisonsEffectuesLivraisonsDirectes.buttonModifier); 
                await fonction.waitTillHTMLRendered(page)
            })                                                         
            
            test ('Button [ENVOYER LA FACTURATION]', async () => {
                await fonction.isDisplayed(livraisonsEffectuesLivraisonsDirectes.buttonEnvoyerFacturation);
            })                                                         
            
            test ('DataGrid [HEADERS]', async () => {
                var oDataGrid:TypeListOfElements = 
                {
                    element     :livraisonsEffectuesLivraisonsDirectes.dataGridListeEcartsArticles,    
                    desc        : 'DataGrid [LIVRAISONS RELLES]',
                    verbose      : false, 
                    column      :   
                        [
                            '0',
                            'Numéro BF',
                            'Centrale d\'achat',
                            'Code tiers',
                            'Désignation tiers',
                            'Code article',
                            'Désignation article',
                            'N° lot',
                            'Calibre',
                            'Conditionnement',
                            'Quantité',
                            'Prix de revient',
                            'Prix de cession',
                            'Total',
                            'Numéro BF',
                            'Facturé',
                            'Actions',    
                        ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })
        })  // End describe Onglet
     
        test.describe ('Onglet [REMISES]', async () => {

            test ('Onglet [REMISES] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'remises', page);
            })
            test ('Button [RECHERCHER]', async () => {
                await fonction.isDisplayed(livraisonsEffectuesRemises.buttonRechercheRemise); 
            })
             
            test ('Button [CREER UNE REMISE]', async () => {
                await fonction.isDisplayed(livraisonsEffectuesRemises.buttonCreerRemise);
            })                                                        
              
            test ('Button [MODIFIER UNE REMISE]', async () => {
                await fonction.isDisplayed(livraisonsEffectuesRemises.buttonModifierRemise); 
            })                                                        
            
            test ('Button [ACTIVER / DESACTIVER UNE REMISE]', async () => {
                await fonction.isDisplayed(livraisonsEffectuesRemises.buttonActivDesactivRemise);
            })                                                         
            
            test ('InputField [ARTICLE]', async () => {
                await fonction.isDisplayed(livraisonsEffectuesRemises.inputArticle);
            })                                                                      
            
            test ('InputField [MAGASIN]', async () => {
                await fonction.isDisplayed(livraisonsEffectuesRemises.inputMagasin);
            })
            
            test ('DatePicker [DEBUT]', async () => {
                await fonction.isDisplayed(livraisonsEffectuesRemises.datePickerFrom);
            })
            
            test ('DatePicker [FIN]', async () => {
                await fonction.isDisplayed(livraisonsEffectuesRemises.datePickerTo);
            })
            
            test ('DataGrid [HEADERS]', async () => {
                var oDataGrid:TypeListOfElements = 
                {
                    element     :livraisonsEffectuesRemises.dataGridListeRemises,    
                    desc        : 'DataGrid [LISTE DES REMISES]',
                    verbose      : false, 
                    column      :   
                        [
                            '0',
                            'Groupe article',
                            'Type de remise',
                            'Taux de la remise',
                            'Période',
                            'Nombre de magasins',
                            'Remise à la ligne',
                            'Actif',
                            'Actions'      
                        ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })     

            let sNomPopin = "Création d'une remise";

            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>{
    
                test ('Button [CREER UNE REMISE] - Click', async () => {
                    fonction.clickAndWait(livraisonsEffectuesRemises.buttonCreerRemise, page);
                })
    
                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {                    
                    await livraisonsEffectuesRemises.pPopinCreationRemise.isVisible();
                })

                test ('InputField [CODE / DESIGN MAGASIN]', async () => {
                    await fonction.isDisplayed(livraisonsEffectuesRemises.pPcreatInputCodeDesignMag);
                })
                
                test ('InputField [CODE / DESIGN ARTICLE]', async () => {
                    await fonction.isDisplayed(livraisonsEffectuesRemises.pPcreatInputCodeDesignArt);
                })
                
                test ('InputField [TAUX]', async () => {
                    await fonction.isDisplayed(livraisonsEffectuesRemises.pPcreatInputTaux);
                })
                
                test ('Radio Button [REMISE EN PIED]', async () => {
                    await fonction.isDisplayed(livraisonsEffectuesRemises.pPcreatRadioRemisePied);
                })
                
                test ('Radio Button [REMISE A LA LIGNE]', async () => {
                    await fonction.isDisplayed(livraisonsEffectuesRemises.pPcreatRadioRemiseLigne);
                })
                
                test ('CheckBox [ACTIF]', async () => {
                    await fonction.isDisplayed(livraisonsEffectuesRemises.pPcreatCheckBoxActif);
                })
                
                test ('Button [ENREGISTRER]', async () => {
                    await fonction.isDisplayed(livraisonsEffectuesRemises.pPcreatButtonEnregistrer);
                })
                
                test ('DatePicker [DEBUT]', async () => {
                    await fonction.isDisplayed( livraisonsEffectuesRemises.pPcreatDatePickerFrom);
                })
                
                test ('DatePicker [FIN]', async () => {
                    await fonction.isDisplayed(livraisonsEffectuesRemises.pPcreatDatePickerTo);
                })
                                
                test ('Link [FERMER] - Click', async () => {
                    fonction.clickElement(livraisonsEffectuesRemises.pPcreatLinkFermer);
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                }) 

            })
        })
    })  //-- End Describe Page
        

   test.describe ('Page [REGULARISATION]', async () => {    
      
        let sCurrentPage = 'regularisation';

        test ('Page [REGULARISATION] - Click', async () =>{
            await menu.click(sCurrentPage, page);
        })

        test.describe ('Onglet [ECARTS EN ATTENTE]', async () =>{

            test ('Onglet [ECARTS EN ATTENTE] - Click', async () =>{
                await menu.clickOnglet(sCurrentPage, 'ecartsEnAttente', page);
            })

            test ('Button [CREER UN ECART]', async () => {
                await fonction.isDisplayed(regulationEcartAttente.buttonCreerUnEcart); 
            })

            test ('Button [MODIFIER]', async () => {
                await fonction.isDisplayed(regulationEcartAttente.buttonModifier); 
            })
           
            test ('Button [JUSTIFIER LES ECARTS]', async () => {
                await fonction.isDisplayed(regulationEcartAttente.buttonJustifierLesEcarts); 
            })
         
            test ('Button [ANNULER LA JUSTIFICATION]', async () => {
                await fonction.isDisplayed(regulationEcartAttente.buttonAnnulerJustification);
            })
            
            test ('Button [REFUSER LES ECARTS]', async () => {
                await fonction.isDisplayed(regulationEcartAttente.buttonRefuserLesEcarts);
            }) 
             
            test ('Button [REGULARISER LES ECARTS JUSTIFIES]', async () => {
                await fonction.isDisplayed( regulationEcartAttente.buttonRegulEcartsJustifies);
            })
            
            test ('InputField [CODE / DESIGN. ARTICLE]', async () => {
                await fonction.isDisplayed( regulationEcartAttente.inputSearch);
            })                                                          
             
            test ('ListBox [ARTICLES] - Is Visible', async () => {
                regulationEcartAttente.listBoxArticles.isVisible();
            })
                         
            test ('DataGrid [HEADERS]', async () => {
                var oDataGrid:TypeListOfElements = 
                {
                    element     : regulationEcartAttente.dataGridEcartsArticles,    
                    desc        : 'DataGrid [ARTICLES EN ECART]',
                    verbose      : false, 
                    column      :  [
                        '0',
                        'Code article',
                        'Designation',
                        'Écarts traités',     
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);

                oDataGrid = {
                    element     : regulationEcartAttente.dataGridEcartsConstates,    
                    desc        : 'DataGrid [ECARTS CONSTATES]',
                    verbose      : false, 
                    column      :   [
                        '0',
                        'Liés',
                        'Date de création',
                        'Type d\'écart',
                        'Code article',
                        'Désignation article',
                        'Code source',
                        'Désignation source',
                        'Numéro de lot',
                        'Quantité théorique',
                        'Quantité réelle',
                        'Écart',
                        'Obs.',
                        'Justifié',
                        'Motif',
                        'Régularisé',
                        'Actions',      
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })
            //-------------------------------------------------------------------------------------------------------------------------- 

            test.describe ('Popin [CREATION D\'UN ECART DE LIVRAISON]', async () => {

                test ('Button [CREER UN ECART] - Click', async () => {
                    await fonction.clickAndWait(regulationEcartAttente.buttonCreerUnEcart,                      page)
                })

                test ('InputField [TYPE ECART]', async () => {
                    await fonction.isDisplayed(regulationEcartAttente.pInputTypeEcart);
                })
                
                test ('InputField [ARTICLE]', async () => {
                    await fonction.isDisplayed(regulationEcartAttente.pInputArticle);
                }) 
                 
                test ('InputField [MAGASIN]', async () => {
                    await fonction.isDisplayed(regulationEcartAttente.pInputMagasin);
                })
                 
                test ('InputField [ECART]', async () => {
                    await fonction.isDisplayed(regulationEcartAttente.pInputEcart);
                })
                 
                test ('InputField [NB JOURS]', async () => {
                    await fonction.isDisplayed(regulationEcartAttente.pInputNbJours);
                })
                 
                test ('DatePicker [JOURS AVANT]', async () => {
                    await fonction.isDisplayed(regulationEcartAttente.pDatePicker);
                })
                 
                test ('Button [RECHERCHER]', async () => {
                    await fonction.isDisplayed(regulationEcartAttente.pButtonRechercher);
                })
                
                test ('Button [ENREGISTRER]', async () => {
                    await fonction.isDisplayed(regulationEcartAttente.pButtonEnregsitrer);
                })            
                
                test ('Button [FERMER]', async () => {
                    await fonction.isDisplayed(regulationEcartAttente.pButtonFermer);
                })
                
                test ('CheckBox [MASQUER LOTS EN STOCK]', async () => {
                    await fonction.isDisplayed(regulationEcartAttente.pCheckBox);
                })

                //-------------------------------------------------------------------------------------------------------------------------- 

                test ('DataGrid [HEADERS]', async () => {
                    var oDataGrid:TypeListOfElements = 
                    {
                        element     : regulationEcartAttente.pDataGridListeEcarts,    
                        desc        : 'DataGrid [LISTE LOTS]',
                        verbose      : false, 
                        column      :   
                            [
                                '0',
                                'N° de lot',
                                'Code fournisseur',
                                'Fournisseur',
                                'Date de répartition',
                                'Date de réception',
                                'Conditionnement',
                                'Origine',
                                'Quantité livrée au totale',
                                'Quantité livrée au client',
                                'Quantité livrée en Kg',
                                'Plateforme'
                            ]
                    }
                    await fonction.dataGridHeaders(oDataGrid);
                })                            
               
                //-------------------------------------------------------------------------------------------------------------------------- 

                test ('Button [FERMER] - Click', async () => {
                    fonction.clickElement(regulationEcartAttente.pButtonFermer);
                })

            })  // End describe Popin

        })  // End describe Onglet 
        
        test.describe ('Onglet [DEMANDES D\'AVOIR CLIENT]', async () => {

            test ('Onglet [DEMANDES D\'AVOIR CLIENT] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'demandesAvoirClient', page);
            })

            test ('Button [DEMANDES D\'AVOIR CLIENT]', async () => {
                await fonction.isDisplayed(regulationDemandeAvoirPage.buttonCreer);
            })
           
            test ('Button [MODIFIER]', async () => {
                await fonction.isDisplayed(regulationDemandeAvoirPage.buttonModifier); 
            })            
               
            test ('Button [REGULARISER]', async () => {
                await fonction.isDisplayed(regulationDemandeAvoirPage.buttonRegulariser);  
            })         
            
            test ('Button [ACCEPTER EN MASSE]', async () => {
                await fonction.isDisplayed(regulationDemandeAvoirPage.buttonAccepterEnMasse);
            })           
          
            test ('Button [CONSULTER]', async () => {
                await fonction.isDisplayed(regulationDemandeAvoirPage.buttonConsulter);
            })             
             
            test ('ListBox [DOSSIER D\'ACHAT]', async () => {
                await regulationDemandeAvoirPage.listBoxDossierAchat.isVisible();
            })
     
            test ('ListBox [DEMANDES]', async () => {
                await regulationDemandeAvoirPage.listBoxDemandes.isVisible();
            }) 
       
            test ('ListBox [TYPE DE DEMANDE]', async () => {
                await regulationDemandeAvoirPage.listBoxTypeDemande.isVisible();
            })  
    
            test ('InpuField [CODE / DESGN. CLIENT]', async () => {
                await fonction.isDisplayed(regulationDemandeAvoirPage.inputSearchClient); 
            })
            
            test ('InpuField [CODE / DESGN. ARTICLE]', async () => {
                await fonction.isDisplayed(regulationDemandeAvoirPage.inputSearchArticle); 
            })
                                                
            test ('DataGrid [HEADERS]', async () => {
                var oDataGrid:TypeListOfElements = 
                {
                    element     : regulationDemandeAvoirPage.dataGridClients,    
                    desc        : 'DataGrid [CLIENTS AVEC DEMANDE D\'AVOIR]',
                    verbose      : false, column      :   
                        [
                            '0',
                            'Code client',
                            'Désignation client',
                            'Nombre demandes',   
                        ]
                }
                await fonction.dataGridHeaders(oDataGrid);

                 //-------------------------------------------------------------------------------------------------------------------------- 
                oDataGrid = 
                {
                    element     : regulationDemandeAvoirPage.dataGridDemandedAvoir,    
                    desc        : 'DataGrid [DEMANDE D\'AVOIR]',
                    verbose     : false, 
                    column      :   
                        [
                            '0',
                            'Date expédition client',
                            'Date demande',
                            'Type demande',
                            'Motif',
                            'Client',
                            'Code article',
                            'Désignation article',
                            'Code fournisseur',
                            'Désignation fournisseur',
                            'N° lot',
                            'Quantité livrée',
                            'Quantité demandée en avoir',
                            'Quantité demandée en avoir (en kg)',
                            'Statut',
                            '',
                            'Actions',
                        ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })            
            
            //-------------------------------------------------------------------------------------------------------------------------- 

            test.describe ('Popin [CREATION D\'UNE DEMANDE D\'AVOIR]', async () => {

                test ('Button [CREER] - Click', async () => {
                    await fonction.clickAndWait(regulationDemandeAvoirPage.buttonCreer,                             page)
                })

                test ('InputField [ARTICLE]', async () => {
                    await fonction.isDisplayed(regulationDemandeAvoirPage.pInputArticle);
                })
                
                test ('InputField [MAGASIN]', async () => {
                    await fonction.isDisplayed(regulationDemandeAvoirPage.pInputMagasin); 
                })
                
                test ('InputField [NB JOURS]', async () => {
                    await fonction.isDisplayed(regulationDemandeAvoirPage.pInputNbJours);
                })
                
                test ('Button [ENREGISTRER]', async () => {
                    await fonction.isDisplayed(regulationDemandeAvoirPage.pButtonEnregsitrer);
                })
               
                test ('Button [FERMER]', async () => {
                    await fonction.isDisplayed(regulationDemandeAvoirPage.pButtonFermer); 
                })
                
                test ('Button [RECHERCHER]', async () => {
                    await fonction.isDisplayed(regulationDemandeAvoirPage.pButtonRechercher); 
                })
                
                test ('Button [MAGASIN]', async () => {
                    await fonction.isDisplayed(regulationDemandeAvoirPage.pButtonMagasin); 
                })
                
                test ('ListBox [TYPES DEMANDE]', async () => {
                    await fonction.isDisplayed(regulationDemandeAvoirPage.pListBoxTypeDemande);
                })
                
                test ('DatePicker [DATE DEMANDE]', async () => {
                    await fonction.isDisplayed(regulationDemandeAvoirPage.pDatePickerDateDemande);
                })
                
                test ('TextArea [OBSERVATIONS]', async () => {
                    await fonction.isDisplayed( regulationDemandeAvoirPage.pTextAreaObservations);  
                })                        
                             

                //-------------------------------------------------------------------------------------------------------------------------- 

                test ('DataGrid [HEADERS]', async () => {
                    var oDataGrid:TypeListOfElements = {
                    element     : regulationDemandeAvoirPage.pDataGridListeLots,    
                    desc        : 'DataGrid [LISTE DES LOTS]',
                    verbose      : false, 
                    column      :   
                        [
                            '0',
                            'N° de lot',
                            'Centrale d\'achat',
                            'Code fournisseur',
                            'Fournisseur',
                            'Date d\'expédition',
                            'Conditionnement',
                            'Origine',
                            'Quantité livrée au client',
                            'Quantité livrée en Kg',
                            'Lot sur place',
                        ]
                    }
                    await fonction.dataGridHeaders(oDataGrid);
                })
                
                //---------------------------------------------------------------------------------------------------------------------------

                test ('Button [FERMER] - Click', async () => {
                    fonction.clickElement(regulationDemandeAvoirPage.pButtonFermer);
                })             

            })  // End Describe Popin

        })  // End describe Onglet  
        
        test.describe ('Onglet [ECHANGES DE MARCHANDISE]', async () => {

            test ('Onglet [ECHANGES DE MARCHANDISE] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'echangesMarchandises', page);
            })

            test ('Button [ACCEPTER]', async () => {
                await fonction.isDisplayed(regulationEchangeMarchandisesPage.buttonAccepter);
            })
             
            test ('Button [REFUSER]', async () => {
                await fonction.isDisplayed(regulationEchangeMarchandisesPage.buttonRefuser);
            })                                    
            
            test ('CheckBox [AFFICHER UNIQ. ECHANGES]', async () => {
                await fonction.isDisplayed(regulationEchangeMarchandisesPage.checkBoxAfficherEcahnges);
            })                                     
           
            test ('InputField [SEARCH MAGASIN]', async () => {
                await fonction.isDisplayed(regulationEchangeMarchandisesPage.inputSearchMagasin); 
            })                                   
                                                            
            test ('DataGrid [HEADERS]', async () => {
                var oDataGrid:TypeListOfElements = 
                {
                    element     : regulationEchangeMarchandisesPage.dataGridDemandeEchanges,    
                    desc        : 'DataGrid [LISTE DEMANDES D\'ECHANGES]',
                    verbose      : false, 
                    column      :   
                        [
                            '0',
                            'Date échange',
                            'Code magasin orig.',
                            'Code magasin dest.',
                            'Désignation magasin orig.',
                            'Désignation magasin dest.',
                            'Code article',
                            'Désignation article',
                            'N° lots',
                            'Conditionnements',
                            'Quantité échangée (Colis)',
                            'Poids échangé (KG)',
                            'Acceptation',
                            'Motif de refus',
                            'Actions',
                        ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })

        })  // End describe Onglet 
        
        test.describe ('Onglet [REGULARISATIONS EFFECTUEES]', async () => {

            test ('Onglet [REGULARISATIONS EFFECTUEES] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'regularisationsEffectuees', page);
            })

            test ('InputField [SEARCH DESTINATAIRE]', async () => {
                await fonction.isDisplayed(regularisationRegularisationEffectuee.inputSearchMDestinataire); 
            })
            
            test ('InputField [SEARCH ARTICLE]', async () => {
                await fonction.isDisplayed( regularisationRegularisationEffectuee.inputSearchArticle); 
            })
         
            test ('InputField [SEARCH LOT]', async () => {
                await fonction.isDisplayed( regularisationRegularisationEffectuee.inputSearchlot);
            })
            
            test ('Button [CREER LITIGES FOURNISSEUR]', async () => {
                await fonction.isDisplayed( regularisationRegularisationEffectuee.buttonCreerLitigesFourn);
            })
            
            test ('Button [FACTURER REGULARISATIONS]', async () => {
                await fonction.isDisplayed( regularisationRegularisationEffectuee.buttonFacturerLesRegul);
            })
            
            test ('Button [CLOTURER PERIODE]', async () => {
                await fonction.isDisplayed( regularisationRegularisationEffectuee.buttonCloturerPeriode);
            })
            
            test ('Button [RECHERCHER]', async () => {
                await fonction.isDisplayed(regularisationRegularisationEffectuee.buttonRechercher);
            })
                                                             
            test ('DataGrid [HEADERS]', async () => {
                var oDataGrid:TypeListOfElements = {
                element     : regularisationRegularisationEffectuee.dataGridRegularisations,    
                desc        : 'DataGrid [LISTE DES REGULARISATIONS]',
                verbose     : false, 
                column      :   
                [
                        'Date',
                        'N° régul.',
                        'N° BF',
                        'Centrale d\'achat',
                        'Type',
                        'Origine',
                        'Code dest.',
                        'Désignation destinataire',
                        'N° de lot',
                        'Code article',
                        'Désignation article',
                        'Conditionnements',
                        'Quantité (colis)',
                        'Quantité (UC)',
                        'Prix unitaire',
                        'Prix total',
                        'Motif',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);

                oDataGrid = 
                {
                    element     : regularisationRegularisationEffectuee.dataGridRecapitulatif,    
                    desc        : 'DataGrid [RECAPITULATIF TOTAL]',
                    verbose      : false, 
                    column      :   
                        [
                            'Nature',
                            'Gain financier',
                            'Perte financière',
                            'Avoir',
                            'Facturation',
                            'dont  Échanges'
                        ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })           
            
            test.describe ('Popin [ENVOYER LES FACTURES DE REGULARISATION]', async () => {

                test ('Button [FACTURER LES FACTURES DE REGULARISATION] - Click', async () => {
                    await fonction.clickAndWait(regularisationRegularisationEffectuee.buttonFacturerLesRegul,       page)
                })

                test ('Button [FACTURER]', async () => {
                    await fonction.isDisplayed(regularisationRegularisationEffectuee.pButtonFacturer);
                })
                
                test ('Button [FERMER]', async () => {
                    await fonction.isDisplayed(regularisationRegularisationEffectuee.pButtonFermer);
                })
                
                test ('DatePicker [DATE FACTURATION]', async () => {
                    await fonction.isDisplayed(regularisationRegularisationEffectuee.pDatePickerDateDemande);
                })                        

                test ('Button [FERMER] - Click', async () => {
                    await fonction.clickElement(regularisationRegularisationEffectuee.pButtonFermer);
                })                
            })  // End describe Popin

            test.describe ('Popin [CONFIRMATION DE CLOTURE DE PERIODE]', async () => {

                test ('Button [CLOTURER LA PERIODE] - Click', async () => {
                    await fonction.clickAndWait(regularisationRegularisationEffectuee.buttonCloturerPeriode, page);
                })

                test ('Button [OIO]', async () => {
                    await fonction.isDisplayed(regularisationRegularisationEffectuee.pButtonOui);
                })
                
                test ('Button [FERMER]', async () => {
                    await fonction.isDisplayed(regularisationRegularisationEffectuee.pButtonFermerCloture);
                })
                
                test ('DatePicker [DATE FACTURATION]', async () => {
                    await fonction.isDisplayed(regularisationRegularisationEffectuee.pDatePickerDateFinPeriode);  
                })
                                      
                test ('Button [FERMER] - Click', async () => {
                    await fonction.clickElement(regularisationRegularisationEffectuee.pButtonFermerCloture);
                })               

            })  // End describe Popin

        })  // End describe Onglet
        
        test.describe ('Onglet [AVOIRS COMPLEMENTAIRES]', async () => {

            test ('Onglet [AVOIRS COMPLEMENTAIRES] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'avoirsComplementaires', page);
            })
           
            test ('Button [CREER UN AVOIR]', async () => {
                await fonction.isDisplayed(regularisationAvoirComplementaires.buttonCreerAvoir);  
            })
             
            test ('Button [RECHERCHER]', async () => {
                await fonction.isDisplayed(regularisationAvoirComplementaires.buttonRechercher);
            })                                              
             
            test ('DatePicker [FROM]', async () => {
                await fonction.isDisplayed(regularisationAvoirComplementaires.datePickerFrom);
            })
            
            test ('DatePicker [TO]', async () => {
                await fonction.isDisplayed(regularisationAvoirComplementaires.datePickerTo);
            })  
            
            test ('InputField [CODE / NOM TIERS]', async () => {
                await fonction.isDisplayed(regularisationAvoirComplementaires.inputCodeNomTiers);
            })
           
             test ('ListBox [TYPE TIERS] -Is Visible', async () => {
                await regularisationAvoirComplementaires.listBoxtypeTiers.isVisible();
             })
            
            //-------------------------------------------------------------------------------------------------------------------------- 
            
            test ('DataGrid [HEADERS]', async () => {
                var oDataGrid:TypeListOfElements = {
                    element     : regularisationAvoirComplementaires.dataGridDemandesAvoirCpt,    
                    desc        : 'DataGrid [LISTE DES AVOIRS COMPLEMENTAIRES]',
                    verbose     : false, 
                    column      :   
                    [
                            '0',
                            'Date',
                            'Groupe article',
                            'Centrale d\'achat',
                            'Code tiers',
                            'Abréviation',
                            'Raison sociale',
                            'Type tiers',
                            'Montant HT',
                            'Comptabilisé',
                            'Actions',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })         

            test.describe ('Popin [CREATION D\'UN AVOIR]', async () => {

                test ('Button [CREER UN AVOIR] - Click', async () => {
                    await fonction.clickAndWait(regularisationAvoirComplementaires.buttonCreerAvoir, page);
                })

                test ('Popin [CREATION D\'UN AVOIR] - Is Visible', async () => {
                    await regularisationAvoirComplementaires.pPopinCreationAvoir.isVisible();
                })

                test ('InputField [FACTURABLE]', async () => {
                    await fonction.isDisplayed(regularisationAvoirComplementaires.pInputFacturable);
                })
                
                test ('InputField [ARTICLE]', async () => {
                    await fonction.isDisplayed(regularisationAvoirComplementaires.pInputArticle);
                })
                
                test ('InputField [NB COLIS]', async () => {
                    await fonction.isDisplayed(regularisationAvoirComplementaires.pInputNbColis);
                })
                
                test ('InputField [MONTANT UNITAIRE]', async () => {
                    await fonction.isDisplayed(regularisationAvoirComplementaires.pInputMontantUnitaire);
                })
                
                test ('InputField [QUANTITE]', async () => {
                    await fonction.isDisplayed( regularisationAvoirComplementaires.pInputQuantite);  
                })
                
                test ('Button [ENREGISTRER]', async () => {
                    await fonction.isDisplayed(regularisationAvoirComplementaires.pButtonEnregsitrer);
                })              
                
                test ('Button [FERMER]', async () => {
                    await fonction.isDisplayed(regularisationAvoirComplementaires.pButtonFermer);
                })
                
                test ('Button [PLUS]', async () => {
                    await fonction.isDisplayed(regularisationAvoirComplementaires.pButtonPlus); 
                })
                 
                test ('TextArea [COMMENTAIRE]', async () => {
                    await fonction.isDisplayed(regularisationAvoirComplementaires.pTextAreaCommentaire);  
                })                    
                              
                //-------------------------------------------------------------------------------------------------------------------------- 
            
                test ('DataGrid [HEADERS]', async () => {
                    var oDataGrid:TypeListOfElements = {
                        element     : regularisationAvoirComplementaires.pDataGridListeArticles,    
                        desc        : 'DataGrid [LISTE DES LOTS]',
                        verbose     : false, 
                        column      : 
                        [
                            'Article',
                            'Nombre de Colis',
                            'Montant HT unitaire',
                            'Quantité',
                            'Unité de détail',
                            'Actions',
                        ]
                    }
                    await fonction.dataGridHeaders(oDataGrid);
                })

                test ('Button [FERMER] - Click', async () => {
                    await fonction.clickElement(regularisationAvoirComplementaires.pButtonFermer);
                })                

                test ('Popin [CREATION D\'UN AVOIR] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, "Création d'un avoir", false);
                })

            })  // End Describe Popin

        })  // End describe Onglet    

    })  //-- End Describe Page


    test.describe ('Page [FACTURATION]', () =>{    
      
        var sCurrentPage = 'facturation';

        test ('Page [FACTURATION] - Click', async () => {
            await menu.click(sCurrentPage, page);
        })

        test.describe ('Onglet [LISTE DES FACTURES]', async () =>{

            test ('Onglet [LISTE DES FACTURES] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'listeFactures', page);
            })

             test ('listBox [TYPE TIERS]', async () => {
                await facturationListeFactures.listBoxTypeTiers.isVisible();
             })
           
            test ('Button [RECHERCHER]', async () => {
                await fonction.isDisplayed(facturationListeFactures.buttonRechercher);
            })
            
            test ('Button [COMPTABILISER & ARCHIVERS]', async () => {
                await fonction.isDisplayed(facturationListeFactures.buttonComptabiliserAcrhiver);
            })
           
            test ('Button [VISUALISER LES FACTURES]', async () => {
                await fonction.isDisplayed( facturationListeFactures.buttonVisualiserFactures);
            })
            
            test ('Button [VISUALISER LES BL]', async () => {
                await fonction.isDisplayed(facturationListeFactures.buttonVisualiserBL);
            })
           
            test ('Button [GENERER UNE DEB VENTE]', async () => {
                await fonction.isDisplayed(facturationListeFactures.buttonGenereDEBvente);
            })
            
            test ('Button [GENERER UNE DEB ACHAT]', async () => {
                await fonction.isDisplayed(facturationListeFactures.buttonGenereDEBachat);
            })
            
            test ('Button [IMPRIMER LES FACTURES]', async () => {
                await fonction.isDisplayed(facturationListeFactures.buttonImprimerLesFactures);
            })
            
            test ('InputField [NUMERO BL]', async () => {
                await fonction.isDisplayed(facturationListeFactures.inputNumeroBL);
            })
            
            test ('InputField [NUMERO FACTURE]', async () => {
                await fonction.isDisplayed(facturationListeFactures.inputNumeroFacture);
            })
            
            test ('InputField [TIERS]', async () => {
                await fonction.isDisplayed(facturationListeFactures.inputTiers);
            })
            
            test ('InputField [MONTANT HT MINI]', async () => {
                await fonction.isDisplayed(facturationListeFactures.inputMontantMini);
            })
            
            test ('InputField [MONTANT HT MAXI]', async () => {
                await fonction.isDisplayed(facturationListeFactures.inputMontantMaxi);
            })
            
            test ('DatePicker [DEBUT]', async () => {
                await fonction.isDisplayed(facturationListeFactures.datePickerFrom);
            })
            
            test ('DatePicker [FIN]', async () => {
                await fonction.isDisplayed(facturationListeFactures.datePickerTo);
            })
           
            test ('Toggle [TOUS]', async () => {
                await fonction.isDisplayed(facturationListeFactures.toggleButtonTous);
            })
            
            test ('Toggle [AVOIR]', async () => {
                await fonction.isDisplayed(facturationListeFactures.toggleButtonAvoir);
            })
           
            test ('Toggle [FACTURE]', async () => {
                await fonction.isDisplayed(facturationListeFactures.toggleButtonFacture);
            })

            test ('DataGrid [HEADERS]', async () => {
                var oDataGrid:TypeListOfElements = {
                    element     : facturationListeFactures.dataGridListeFactures,    
                    desc        : 'DataGrid [LISTE DES AVOIRS COMPLEMENTAIRES]',
                    verbose      : false, 
                    column      : [
                        '0',
                        'Date',
                        'Numéro',
                        'Type',
                        'Code tiers',
                        'Abréviation',
                        'Raison sociale',
                        'Type tiers',
                        'Société',
                        'Montant HT',
                        'Archivée',
                        'Actions',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })

            var sNomPopin = "GENERATION DE FICHIER DEB VENTE PRO DOUANE DE FACTURE";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>{

                test ('Button [GENERER UNE DEB VENTE] - Click', async () => {
                    await facturationListeFactures.buttonGenereDEBvente.hover({timeout:1000});     // Survol Souris (hover)
                    await fonction.clickAndWait(facturationListeFactures.buttonGenereDEBventeFacture, page);
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await facturationListeFactures.pPopinGenerationFichierDebVPDFacture.isVisible();
                })
              
                test ('Button [PREVISUALISER DEB]', async () => {
                    await fonction.isDisplayed(facturationListeFactures.pVentFacButtonPrevisuDEB);
                })
                
                test ('Button [DEB FACTURE]', async () => {
                    await fonction.isDisplayed(facturationListeFactures.pVentFacButtonDEBFacture);  
                })
                
                test ('Button [ANNULER]', async () => {
                    await fonction.isDisplayed(facturationListeFactures.pVentFacButtonAnnuler);
                })              
                
                test ('InputField [DATE MOIS]', async () => {
                    await fonction.isDisplayed(facturationListeFactures.pVentFacInputDateMois);                      
                })
       
                test ('Button [ANNULER] - Click', async () => {
                    await fonction.clickElement(facturationListeFactures.pVentFacButtonAnnuler);
                })                

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })
            })  // End Describe Popin   
            
            sNomPopin = "GENERATION DE FICHIER DEB VENTE PRO DOUANE EN AVOIR";

            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>{

                test ('Button [GENERER UNE DEB DES AVOIRS] - Click', async () => {
                    await facturationListeFactures.buttonGenereDEBvente.hover({timeout:1000});     // Survol Souris (hover)
                    await fonction.clickAndWait(facturationListeFactures.buttonGenereDEBventeAvoir, page)
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await facturationListeFactures.pPopinGenerationFichierDebVPDAvoirs.isVisible();
                })
              
                test ('Button [DEB AVOIR]', async () => {
                    await fonction.isDisplayed(facturationListeFactures.pVentAvoirButtonDEBAvoirs);  
                })
 
                test ('Button [ANNULER]', async () => {
                    await fonction.isDisplayed(facturationListeFactures.pVentAvoirButtonAnnuler);
                })             
                
                test ('InputField [DATE MOIS]', async () => {
                    await fonction.isDisplayed(facturationListeFactures.pVentAvoirInputDateMois); 
                })  
                test ('Button [ANNULER] - Click', async () =>{
                    await fonction.clickElement(facturationListeFactures.pVentAvoirButtonAnnuler);
                })                                

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })
               
            })  // End Describe Popin   

        })  // End describe Onglet

        test.describe ('Onglet [LISTE DES RELEVES]', async () => {

            test ('Onglet [LISTE DES RELEVES] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'listeReleves', page);
            })

            test ('Button [RECHERCHER]', async () => {
                await fonction.isDisplayed(facturationListeReleves.buttonRechercher);
            })
            
            test ('Button [GENERER LES RELEVES]', async () => {
                await fonction.isDisplayed(facturationListeReleves.buttonGenererLesReleves);
            })
            
            test ('TYPES', async () => {
                await facturationListeReleves.listBoxType.isVisible();
            })
           
            test ('InputField [NUMERO DE RELEVE]', async () => {
                await fonction.isDisplayed(facturationListeReleves.inputNumeroReleve);
            })
            
            test ('InputField [CODE / NOM TIERS]', async () => {
                await fonction.isDisplayed(facturationListeReleves.inputCodeNomTiers);
            })
            
            test ('Datepicker [FROM]', async () => {
                await fonction.isDisplayed(facturationListeReleves.datePickerFrom);
            })
            
            test ('Datepicker [TO]', async () => {
                await fonction.isDisplayed(facturationListeReleves.datePickerTo); 
            })
                                   
            //-------------------------------------------------------------------------------------------------------------------------- 

            test ('DataGrid [HEADERS]', async () => {
                var oDataGrid:TypeListOfElements = {
                    element     : facturationListeReleves.dataGridListeReleves,    
                    desc        : 'DataGrid [LISTE DES RELEVES]',
                    verbose      : false, 
                    column      :   [
                        '0',
                        'Numéro',
                        'Date début',
                        'Date fin de relevé',
                        'Code tiers',
                        'Raison sociale Tiers',
                        'Type tiers',
                        'Société',
                        'Montant TTC',
                        'Archivé',
                        'Imprimé',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })
            
            //-------------------------------------------------------------------------------------------------------------------------- 

            test.describe ('Popin [GENERATION DES RELEVES DE FACTURES]', async () =>{

                test ('Button [GENERER LES RELEVES] - Click', async () => {
                    await fonction.clickAndWait(facturationListeReleves.buttonGenererLesReleves, page);
                })

                test ('Popin [GENERATION DES RELEVES DE FACTURES] - Is Visible ', async () => {
                    await facturationListeReleves.pPopinGenerationRelevesFactures.isVisible();
                })
    
                test ('Button [GENERER]', async () => {
                    await fonction.isDisplayed(facturationListeReleves.pButtonGenerer); 
                })
                
                test ('Button [FERMER]', async () => {
                    await fonction.isDisplayed(facturationListeReleves.pButtonFermer);
                })           
                
                test ('InputField [CODE TIERS]', async () => {
                    await fonction.isDisplayed(facturationListeReleves.pInputCodeTiers);
                })
                
                test ('DatePicker [FROM]', async () => {
                    await fonction.isDisplayed(facturationListeReleves.pDatePickerFrom); 
                })
                
                test ('DatePicker [TO]', async () => {
                    await fonction.isDisplayed(facturationListeReleves.pDatePickerTo);
                })                     
                
                test ('ListBox [TYPE TIERS]', async () => {
                    await facturationListeReleves.pListBoxTypeTiers.isVisible();
                })
                
                test ('ListBox [OPTIONS ENVOI]', async () => {
                    await facturationListeReleves.pListBoxOptionsEnvoi.isVisible();
                })
                
                test ('CheckBox [UNIQUEMENT TIERS SUR RELEVES]', async () => {
                    await fonction.isDisplayed(facturationListeReleves.pCheckBoxUniquementTiers);
                })
                
                test ('CheckBox [ARCHIVAGE]', async () => {
                    await fonction.isDisplayed(facturationListeReleves.pCheckBoxArchivage);
                })
                test ('Button [FERMER] - Click', async () =>{
                    await fonction.clickElement(facturationListeReleves.pButtonFermer);
                })                

                test ('Popin [GENERATION DES RELEVES DE FACTURES] - Is Not Visible ', async () => {
                    await fonction.popinVisible(page, "Génération des releves de factures", false);
                })

            })  // End Describe Popin

        })  // End describe Onglet

        test.describe ('Onglet [RECETTES MAGASINS]', async () => {

            test ('Onglet [RECETTES MAGASINS] - Click', async () =>{
                await menu.clickOnglet(sCurrentPage, 'recettesMagasins', page);
            })

            test ('Datepicker [FROM]', async () => {
                await fonction.isDisplayed(facturationRecettesMagasins.datePickerFrom);
            })
            
            test ('Datepicker [TO]', async () => {
                await fonction.isDisplayed(facturationRecettesMagasins.datePickerTo); 
            })
           
            test ('Button [COMPTABILISER]', async () => {
                await fonction.isDisplayed(facturationRecettesMagasins.buttonComptabiliser);
            })                      
       
            test ('Button [AFFICHER RECETTES MANQUANTES]', async () => {
                await fonction.isDisplayed(facturationRecettesMagasins.buttonAffRecettesManquantes);
            })
            
            test ('Button [CREER RECETTE]', async () => {
                await fonction.isDisplayed(facturationRecettesMagasins.buttonCreerRecette);
            })
            
            test ('Button [MODIFIER]', async () => {
                await fonction.isDisplayed(facturationRecettesMagasins.buttonModifier);
            })
           
            test ('Button [VISUALISER]', async () => {
                await fonction.isDisplayed(facturationRecettesMagasins.buttonVisualiser); 
            })
             
            test ('Link [COMPTABILISE OUI]', async () => {
                await fonction.isDisplayed(facturationRecettesMagasins.linkComptabiliseOui);
            })          
            
            test ('Link [COMPTABILISE NON]', async () => {
                await fonction.isDisplayed(facturationRecettesMagasins.linkComptabiliseNon);
            })

            test ('Link [CREATION MANUELLE OUI]', async () => {
                await fonction.isDisplayed(facturationRecettesMagasins.linkCreationManuelleOui);
            })
            
            test ('Link [CREATION MANUELLE NON]', async () => {
                await fonction.isDisplayed(facturationRecettesMagasins.linkCreationManuelleNon);
            })
            
            test ('InputField [SEARCH NOM SOCIETE]', async () => {
                await fonction.isDisplayed(facturationRecettesMagasins.inputSearchNomScte);
            })
            
            test ('DataGrid [HEADERS]', async () => {
                var oDataGrid:TypeListOfElements = {
                    element     : facturationRecettesMagasins.dataGridListeReleves,    
                    desc        : 'DataGrid [LISTE DES RELEVES]',
                    verbose      : false, column      :   [
                        '0',
                        'Code société',
                        'Raison sociale société',
                        'Date',
                        'CA total',
                        'Comptabilisées',
                        'Création/correction manuelle',
                        'Commentaires',
                        'Actions',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })

            test.describe ('Popin [RECETTES MANQUANTES SUR LA PERIODE DU... AU ...]', async () => {

                test ('Button [AFFICHER LES RECETTES MANQUANTES] - Click', async () => {
                    await fonction.clickAndWait(facturationRecettesMagasins.buttonAffRecettesManquantes, page)
                })

                test ('Popin [RECETTES MANQUANTES SUR LA PERIODE DU... AU ...] - Is Visible ', async () => {
                    await facturationRecettesMagasins.pPopinRecettesManquantesSurPeriodeDu.isVisible();
                })

                test ('Button [FERMER]', async () => {
                    await fonction.isDisplayed( facturationRecettesMagasins.pButtonFermerRecette);
                })
                  
                test ('DataGrid [HEADERS]',async () => {
                    var oDataGrid:TypeListOfElements = {
                        element     : facturationRecettesMagasins.pDataGridListesRecettes,    
                        desc        : 'DataGrid [LISTE DES RECETTES MANQUANTES]',
                        verbose     : false, 
                        column      : 
                        [
                            'Date',
                            'Code société',
                            'Raison sociale société',
                        ]
                    }
                    await fonction.dataGridHeaders(oDataGrid);
                })              

                test ('Button [FERMER] - Click', async () => {
                    await fonction.clickElement(facturationRecettesMagasins.pButtonFermerRecette);
                })                

                test ('Popin [RECETTES MANQUANTES SUR LA PERIODE DU... AU ...] - Is Not Visible ', async () => {
                    await fonction.popinVisible(page, "recettes manquantes sur la période...", false);
                })

            })  // End Describe Popin 

            test.describe ('Popin [CREATION D\'UNE RECETTE]', async () => {

                test ('Button [CREER RECETTE] - Click', async () => {
                    await fonction.clickAndWait(facturationRecettesMagasins.buttonCreerRecette, page)
                })

                test ('Popin [CREATION D\'UNE RECETTE] - Is Visible', async () => {
                    await facturationRecettesMagasins.pPopinCreationRecette.isVisible();
                })

                test ('Button [FERMER]', async () => {
                    await fonction.isDisplayed(facturationRecettesMagasins.pButtonFermerCreation);
                })
                
                test ('Button [ENREGISTRER]', async () => {
                    await fonction.isDisplayed(facturationRecettesMagasins.pButtonEnregistrerRecette); 
                })
          
                test ('InputField [SOCIETE]', async () => {
                    await fonction.isDisplayed(facturationRecettesMagasins.pInputSociete);
                })
                
                test ('InputField [NOMBRE CLIENT]', async () => {
                    await fonction.isDisplayed(facturationRecettesMagasins.pInputNbClients);
                })
               
                test ('InputField [RECETTE DU GIE]', async () => {
                    await fonction.isDisplayed(facturationRecettesMagasins.pInputRecetteGIE);
                })
    
                test ('InputField [DATE RECETTE]', async () => {
                    await fonction.isDisplayed(facturationRecettesMagasins.pInputDateRecette);
                })
                
                test ('ListBox[GROUPE COMPTABLE] - Is Visible', async () => {
                    let listBoxGroupeComptable = page.locator('#select-groupe-comptable');   //<<<<<<<<<< ???????????
                    await listBoxGroupeComptable.isVisible();
                })
                
                test ('ListBox [TAUX TVA]', async () => {
                    await fonction.isDisplayed(facturationRecettesMagasins.pListBoxTauxTVA);
                })
                
                test ('TextArea [COMMENTAIRE]', async () => {
                    await fonction.isDisplayed(facturationRecettesMagasins.pTextAreaCommentaireRecette);     
                })
                       
                 
                test ('DataGrid [HEADERS]', async () => {
                    var oDataGrid:TypeListOfElements = {
                        element     : facturationRecettesMagasins.pDataGridListesGrpComptable,    
                        desc        : 'DataGrid [LISTE DES GROUPES COMPTABLES]',
                        verbose      : false, 
                        column      :  [
                            'Groupe comptable',
                            'Numéro compte',
                            'Taux de TVA',
                            'Montant TTC',
                            'Montant HT',
                            'Nombre de clients',
                            'Actions',
                        ]
                    }
                    await fonction.dataGridHeaders(oDataGrid);
                })           
                
                //--------------------------------------------------------------------------------------------------------------------------   

                test ('Button [FERMER] - Click', async () =>{
                    await fonction.clickElement(facturationRecettesMagasins.pButtonFermerCreation);
                })                

                test ('Popin [CREATION D\'UNE RECETTE] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, "Création d'une recettte", false);
                })

            })  // End Describe Popin 

        })  // End describe Onglet               

        test.describe ('Onglet [REFERENTIEL TIERS]', async () =>{

            test ('Onglet [REFERENTIEL TIERS] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'referentielTiers', page);
            })

            test ('InputField [SEARCH]',async () => {
                await fonction.isDisplayed(facturationReferentielTiers.inputSearch);
            })

            test ('ListBox [TYPE DE TIERS] - Is Visible', async () => {
                await fonction.isDisplayed(facturationReferentielTiers.listBoxTypeTiers);
            })
           
            test ('DataGrid [HEADERS]', async () => {
                var oDataGrid:TypeListOfElements = {
                    element     :facturationReferentielTiers.dataGridListeTiers,    
                    desc        : 'DataGrid [LISTE DES TIERS]',
                    verbose     : false, 
                    column      :   
                    [
                        'Code',
                        'Abréviation',
                        'Raison sociale',
                        'Collectif',
                        'Valide',
                        'Actions',
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })

        })  // End describe Onglet

        test.describe ('Onglet [COMPTES BANCAIRES]', async () =>{

            test ('Onglet [COMPTES BANCAIRES] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'comptesBancaires', page);
            })
        
            test ('DataGrid [HEADERS]', async () => {
                var oDataGrid:TypeListOfElements = {
                    element     : facturationCompteBancaire.dataGridComptesBancaires,    
                    desc        : 'DataGrid [LISTE DES COMPTES BANCAIRES]',
                    verbose     : false, 
                    column      :   
                    [
                        'Numéro de compte',
                        'Journal de banque',
                        'Nom de banque'
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            }) 

        })  // End describe Onglet                            
     
    })  //-- End Describe Page


    test.describe ('Page [ARCHIVAGE]', async () =>{   

        test ('Page [ARCHIVAGE] - Click', async () => {
            await menu.click('archivage', page);
        })      

        test ('Button [RECHERCHER]', async () => {
            await fonction.isDisplayed(arrivagePage.buttonRechercher);
        })
       
        test ('Datepicker [FROM]', async () => {
            await fonction.isDisplayed(arrivagePage.datePickerFrom);
        })
     
        test ('Datepicker [TO]', async () => {
            await fonction.isDisplayed(arrivagePage.datePickerTo); 
        })
       
        test ('ListBox [STATUT]', async () => {
            await fonction.isDisplayed(arrivagePage.listBoxStatutLot);         
        })
      
    })  //-- End Describe Page


    test.describe ('Page [ADMIN]', async () => {    
      
        var sCurrentPage = 'admin';
        
        test ('Page [ADMIN] - Click', async () =>{
            await menu.click(sCurrentPage, page);
        })
        
        test.describe ('Onglet [ADMINISTRATION]', async () =>{

            test ('Onglet [ADMINISTRATION] - Click', async () =>{
                await menu.clickOnglet(sCurrentPage, 'administration',page);
            })  

        })  // End describe Onglet

        test.describe ('Onglet [PARAMETRAGE]', async () => {

            test ('Onglet [PARAMETRAGE] - Click', async () =>{
                await menu.clickOnglet(sCurrentPage, 'parametrage',page);
            })

        })  // End describe Onglet

        test.describe ('Onglet [PARAMETRAGE CONSTANTES]', async () => {

            test ('Onglet [PARAMETRAGE CONSTANTES] - Click', async () =>{
                await menu.clickOnglet(sCurrentPage, 'parametrageConstantes',page);
            })

            test ('DataGrid [PARAMETRAGES CONSTANTES][HEADERS]', async () => {
                var oDataGrid:TypeListOfElements = {
                    element     : facturationListeFactures.dataGridListeParametrageConst,    
                    desc        : 'DataGrid [LISTE DES PARAMETRAGES CONSTANTES]',
                    verbose      : false, 
                    column      : [
                        'Code',
                        'Désignation',
                        'Valeur',
                        'Rayon'
                    ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })

        })  // End describe Onglet

        test.describe ('Onglet [COMMUNICATION UTILISATEURS]', async () => {

            test ('Onglet [COMMUNICATION UTILISATEUR] - Click', async () =>{
                await menu.clickOnglet(sCurrentPage, 'communicationUtilisateurs',page);
            })

        })  // End describe Onglet

        test.describe ('Onglet [COMMUNICATION UTILISATEUR]', async () => {

            test ('Onglet [CHANGALOG] - Click', async () =>{
                await menu.clickOnglet(sCurrentPage, 'changelog',page);
            })

        })  // End describe Onglet

    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})