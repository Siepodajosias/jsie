/**
 * 
 * @author Siaka KONE
 * @since 2024-01-12
 * 
 */

const xRefTest      = "PRE_ECL_FLS";
const xDescription  = "Préparer une feuille FL manuellement";
const xIdTest       =  60;
const xVersion      = '3.4.RC1';

var info = {
    desc        : xDescription,
    appli       : 'PRE',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateformeReception'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }                      from '@playwright/test';
import { Help }                                 from '@helpers/helpers';
import { TestFunctions }                        from '@helpers/functions';
import { Log }                                  from '@helpers/log';

import { MenuPreparation }                      from '@pom/PRE/menu.page';
import { SuiviEclatfeuilleAPreparerPage }       from '@pom/PRE/eclatement-feuilles_a_preparer.page';
import { SuiviEclatfeuilleEnCoursPage }         from '@pom/PRE/eclatement-feuilles_en_cours.page';
import { SuiviEclatfeuillesPrepareesExpPage }   from '@pom/PRE/eclatement-feuilles_preparees.page';

import { AutoComplete }                         from '@commun/types';

//------------------------------------------------------------------------------------

let page                                : Page;
let menu                                : MenuPreparation;
let pageSuiviEclatfeuilleAPreparer      : SuiviEclatfeuilleAPreparerPage;
let pageSuiviEclatfeuilleEnCours        : SuiviEclatfeuilleEnCoursPage;
let pageSuiviEclatfeuillesPrepareesExp  : SuiviEclatfeuillesPrepareesExpPage;

const log               = new Log();
const fonction          = new TestFunctions(log);

// Dates de début et de fin initiales
const dateDebut         = new Date(); // Heure courante
const dateFin           = new Date(); // Heure courante

// Soustraire une minute à la date de fin
const dateFinAjustee    = new Date(dateFin.getTime() - 60000);

// Soustraire deux minutes à la date de fin
const dateDebutAjustee  = new Date(dateDebut.getTime() - 120000);

//------------------------------------------------------------------------------------
var oData:any           = fonction.importJdd(); //Import du JDD pour le bout en bout
//------------------------------------------------------------------------------------
var sPlateforme         =  fonction.getInitParam('plateformeReception','Chaponnay');
 //------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                                = await browser.newPage();
    menu                                = new MenuPreparation(page, fonction);
    pageSuiviEclatfeuilleAPreparer      = new SuiviEclatfeuilleAPreparerPage(page);
    pageSuiviEclatfeuilleEnCours        = new SuiviEclatfeuilleEnCoursPage(page);
    pageSuiviEclatfeuillesPrepareesExp  = new SuiviEclatfeuillesPrepareesExpPage(page);
    const helper                        = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

 //------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']' , () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    if(oData !== undefined) {                                  // On est dans le cadre d'un E2E. Récupération des données temporaires       
        var aCodesArticles      = Object.keys(oData.aLots);  
        var aFeuilleE2E         = oData.aFeuille;       
        log.set('E2E - Liste des articles : ' + aCodesArticles);         
    }

    //------------------------------------------------------------------------------------
    test.describe ('Page [SUIVI ECLATEMENT]', async () => {   
        
        var sNomPage = 'eclatement';
        test ('Page [SUIVI ECLATEMENT] - Click', async () => {
            await menu.click(sNomPage, page);
        }); 
        
        test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {    
            sPlateforme = sPlateforme.charAt(0).toUpperCase() + sPlateforme.slice(1).toLowerCase();
            if(sPlateforme === 'St-cyr-en-val'){// L'ecriture au niveau de la plateforme "St-cyr-en-val" a changé en "St cyr en val" donc on va adapter le script au changement.
                
                sPlateforme = sPlateforme.split('-');
                sPlateforme = sPlateforme.join(' ');
            }
            await menu.selectPlateforme(sPlateforme, page);                     // Sélection d'une plateforme 
            log.set('Plateforme : ' + sPlateforme);
        });

        aCodesArticles.forEach((sCodeArticle:string) => {

            test.describe ('Article "' + sCodeArticle + '"', async () => { 

                var sNomOnglet = 'feuilles à préparer'
                test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async () => {   
            
                    test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                        await menu.clickOnglet(sNomPage,'feuillesAPreparer', page);         
                    });
        
                    test ('Input [NUMERO FEUILLE] = "'+  aFeuilleE2E[sCodeArticle] + '"', async () => {
                        await fonction.sendKeys(pageSuiviEclatfeuilleAPreparer.inputSearchAll, aFeuilleE2E[sCodeArticle], false, 'Numéro Feuille');
                        await fonction.wait(page, 500);
                    });

                    test ('Icon [PENCIL] - Modifier',  async () => {
                        await pageSuiviEclatfeuilleAPreparer.dataTableFeuillesAPrepareer.first().hover();
                        await fonction.clickAndWait(pageSuiviEclatfeuilleAPreparer.iconPencil.first(), page);
                    });
        
                    test.describe ('Popup [MODIFICATION DE LA FEUILLE]', async () => {   
                    
                        var sStatut = 'En cours';
                        test ('ListBox [STATUT] = "' + sStatut + '"', async () => { 
                            await pageSuiviEclatfeuilleAPreparer.pListBoxStatut.selectOption({label:sStatut});
                            await fonction.addDataSheet('ListBox', 'Statut Feuille', sStatut);
                        });

                        test ('Input [DEBUT][HEURE] = "'+  aFeuilleE2E[sCodeArticle] + '"', async () => {
                            await fonction.sendKeys(pageSuiviEclatfeuilleAPreparer.pInputHoraireDebHeure, fonction.addZero(dateDebutAjustee.getHours()), false, 'Heure Début');
                        });

                        test ('Input [DEBUT][MINUTE] = "'+  aFeuilleE2E[sCodeArticle] + '"', async () => {
                            await fonction.sendKeys(pageSuiviEclatfeuilleAPreparer.pInputHoraireDebMin, fonction.addZero(dateDebutAjustee.getMinutes()), false, 'Minute Début');
                        });

                        test ('ListBox [PREPARATEUR][0] - Select', async () => { 
                            await pageSuiviEclatfeuilleAPreparer.pListBoxPreparateur.selectOption({index:1});
                        });

                        test ('Button [VALIDER] - Click', async () => {
                            await fonction.clickAndWait(pageSuiviEclatfeuilleAPreparer.pButtonValiderModif, page);
                        });

                    });
                    
                });

                sNomOnglet = 'feuilles en cours'
                test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async () => {   
            
                    test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                        await fonction.wait(page, 500);
                        await menu.clickOnglet(sNomPage,'feuillesEnCours', page);         
                    });
        
                    test ('Input [NUMERO FEUILLE] = "'+  aFeuilleE2E[sCodeArticle] + '"', async () => {
                        await fonction.sendKeys(pageSuiviEclatfeuilleEnCours.inputSearchAll, aFeuilleE2E[sCodeArticle], false, '** Skip **');
                        await fonction.wait(page, 500);
                    });

                    test ('Icon [PENCIL] - Modifier',  async () => {
                        await pageSuiviEclatfeuilleEnCours.dataTableFeuillesEnCours.first().hover();
                        await fonction.clickAndWait(pageSuiviEclatfeuilleEnCours.iconPencil, page);
                    });
        
                    test.describe ('Pop Up [MODIFICATION DE LA FEUILLE]', async () => {   
                    
                        var sStatut2 = 'Préparé';
                        test ('ListBox [STATUT] = "' + sStatut2 + '"', async () => { 
                            await pageSuiviEclatfeuilleEnCours.pListBoxStatut.selectOption({label:sStatut2});
                        });

                        test ('Input [FIN][HEURE] = "'+  fonction.addZero(dateFinAjustee.getHours()) + '"', async () => {
                            await fonction.sendKeys(pageSuiviEclatfeuilleEnCours.pInputHoraireFinHeure, fonction.addZero(dateFinAjustee.getHours()), false, 'Heure Fin');
                        });

                        test ('Input [FIN][MINUTE] = "'+ fonction.addZero(dateFinAjustee.getMinutes()) + '"', async () => {
                            await fonction.sendKeys(pageSuiviEclatfeuilleEnCours.pInputHoraireFinMin, fonction.addZero(dateFinAjustee.getMinutes()), false, 'Minute Fin');
                        });

                        test ('InputField [EMPLACEMENT STOCK RESIDUEL] = "rnd"', async () => {
                            const bAvailable = await pageSuiviEclatfeuilleEnCours.pInputEmplaceStockResiduel.isEnabled();
                            if (bAvailable) {

                                const oData:AutoComplete = {
                                    libelle         : 'Selected Article',
                                    inputLocator    : pageSuiviEclatfeuilleEnCours.pInputEmplaceStockResiduel,
                                    inputValue      : fonction.getRandomLetter(),
                                    choiceSelector  : '.gfit-autocomplete-result',
                                    typingDelay     : 100,
                                    waitBefore      : 750,
                                    page            : page,
                                    clear           : true
                                };
                                await fonction.autoComplete(oData);

                            }

                        });

                        test ('Button [VALIDER] - Click', async () => {
                            await fonction.clickAndWait(pageSuiviEclatfeuilleEnCours.pButtonValiderModif, page);
                        });

                    });

                });

                sNomOnglet = 'feuilles préparées';
                test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async () => {   
            
                    test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                        await fonction.wait(page, 500);
                        await menu.clickOnglet(sNomPage,'feuillesPreparees', page);         
                    });
        
                    test ('Input [NUMERO FEUILLE] = "'+  aFeuilleE2E[sCodeArticle] + '"', async () => {
                        await fonction.sendKeys(pageSuiviEclatfeuillesPrepareesExp.inputSearchAll, aFeuilleE2E[sCodeArticle], false, '** Skip **');
                        await fonction.wait(page, 500);
                    });

                    test ('Icon [PENCIL] - Modifier',  async () => {
                        pageSuiviEclatfeuillesPrepareesExp.dataTableFeuillesPreparees.first().hover();
                        await fonction.clickAndWait(pageSuiviEclatfeuillesPrepareesExp.iconPencil.first(), page);
                    });
        
                    test.describe ('Popup [MODIFICATION DE LA FEUILLE]', async () => {   

                        test ('Button [VALIDER] - Click', async () => {
                            await fonction.clickAndWait(pageSuiviEclatfeuillesPrepareesExp.pButtonValiderModif, page);
                        });

                    });

                });

            })

        }); //-- End Describe Onglet  

    }); //-- End Describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

});   