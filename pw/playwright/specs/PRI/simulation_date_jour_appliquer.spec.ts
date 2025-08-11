/**
 * @desc Appliquer en date du jour (J) la simulation faite à J
 * 
 * @author Abdoul SARBA
 *  Since 2025-07-14
 */

const xRefTest                      = "PRI_SIM_JAJ";
const xDescription                  = "Appliquer en date du jour (J) la simulation faite à J";
const xIdTest                       = 7389;
const xVersion                      = '3.0';

var info: CartoucheInfo = {
    desc                            : xDescription,
    appli                           : 'PRICING',
    version                         : xVersion,
    refTest                         : [xRefTest],
    idTest                          : xIdTest,
    help                            : [],
    params                          : [],
    fileName                        : __filename
};

//----------------------------------------------------------------------------------------

import { test, expect, type Page } from '@playwright/test';
import { CartoucheInfo }           from '@commun/types';
import { TestFunctions }           from '@helpers/functions';
import { Log }                     from '@helpers/log.js';
import { Help }                    from '@helpers/helpers.js';

//-- PageObject ----------------------------------------------------------------------
import { MenuPricing }             from '@pom/PRI/menu.page';
import { TarificationPage }        from '@pom/PRI/tarification_tarification.page';
import { SimulationPrixPage }      from '@pom/PRI/tarification_simulation-prix.page';

//----------------------------------------------------------------------------------------

let page                           : Page;
let menuPage                       : MenuPricing;
let pageTarif                      : TarificationPage;
let pageTarifSimulation            : SimulationPrixPage;

const log                          = new Log();
const fonction                     = new TestFunctions(log);

var maDate                         = new Date();

const jourSuivant                  = new Date(maDate);
const auJourdhui                   = new Date(maDate);
//----------------------------------------------------------------------------------------
const sRayon                       = fonction.getInitParam('rayon', 'Crèmerie');

var sListeArticles                 = fonction.getInitParam('listeArticles', 'L0WW,L1SD,C1VC,L1RT');
var sListeStrategies               = fonction.getInitParam('strategie', 'Paris IM,Discount,Standard');

const aListeArticles  : string[]   = sListeArticles.split(',');
const aListeStrategies: string[]   = sListeStrategies.split(',');
const sPrixCession    : string     = "30,88";
const sPvc            : string     = "40,88";
const sDateApplication: string     = fonction.getToday('FR', 0, ' / ');
//----------------------------------------------------------------------------------------

/**
 * Cette fonction permet de selectionner le jour suivant dans le calendrier de la simulation et de verifier que le jour en cours est en vert (simulation enregistrée) sur le calendrier 
 */
const selectJourVerifierSimulation = async () => {
    jourSuivant.setDate(maDate.getDate() + 1);                                             // Je calcule le jour suivant

    if(maDate.getMonth() < jourSuivant.getMonth()){                                      // Je vérifie si on doit changer de mois pour le jour suivant
        await fonction.clickElement(pageTarifSimulation.datePickerSimulation);
        await fonction.clickElement(pageTarifSimulation.datePickerFirstDayInMonth);
    }

    await fonction.clickElement(pageTarifSimulation.datePickerSimulation);             // Je clique sur le jour suivant
    await fonction.clickElement(pageTarifSimulation.datePickerTrday.locator('td span > span:text-is("'+jourSuivant.getDate()+'")').first());
    await fonction.clickElement(pageTarifSimulation.datePickerSimulation);
    await fonction.waitForDomStable(page);

    if(jourSuivant.getMonth() > auJourdhui.getMonth()){                            // je vérifie si on doit revenir au mois précédent
        await fonction.clickElement(pageTarifSimulation.datePickerSimulation);
        await fonction.clickElement(pageTarifSimulation.datePickerLinkPrev); 
    }
    await fonction.clickAndWait(pageTarifSimulation.datePickerSimulation, page); // J'ouvre le calendrier a nouveau
    await fonction.waitForDomStable(page);
    
    await expect(pageTarifSimulation.datePickerTrday.locator('td span > span:text-is("'+auJourdhui.getDate()+'")').first()).toHaveAttribute('class', /date-avec-info/); // je verifie si le jour actuel est en vert, c'est caracterisé par la classe "date-avec-info"
};

//----------------------------------------------------------------------------------------
test.beforeAll(async ({ browser }, testInfo) => {
    page                           = await browser.newPage();
    menuPage                       = new MenuPricing(page, fonction);
    pageTarif                      = new TarificationPage(page);
    pageTarifSimulation            = new SimulationPrixPage(page);
    const helper                   = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({ }, testInfo) => {
    await fonction.close(testInfo);
});
//-----------------------------------------------------------------------------------------
test.describe.serial('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACCUEIL]', async () => {

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        });

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {
            await menuPage.selectRayonByName(sRayon, page);                       // Sélection du rayon passé en paramètre
        });
    });  //-- End Describe Page

    const sPageName:string='tarification';
    test.describe('Page [TARIFICATION]', async () => {
        test('Page [TARIFICATION] - Click', async () => {
            await menuPage.click(sPageName, page);
        });

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        });

        test('** Wait Until Spinner Off **', async () => {
            await fonction.waitForSpinner(pageTarif.pPcalcMargeSpinner, 180000);
        });

        test.describe('Onglet [SIMULATION]', async () => {
            const sOngletName: string = 'simulationPrix';
            test('Onglet [SIMULATION] - Click', async () => {
                menuPage.clickOnglet(sPageName, sOngletName, page);
            });

            test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
                await fonction.isErrorDisplayed(false, page);
            });

            test('Button [AFFICHER LIGNE MODIFIEE] - Click', async () => {
                await fonction.clickAndWait(pageTarifSimulation.checkBoxAffUniqLignesModif, page);
            });

            test('Button [RECHERCHER] - Click', async () => {
                await fonction.clickAndWait(pageTarifSimulation.buttonRechercher, page); /**Cliquer sur le bouton rechercher pour afficher toutes les lignes modifiées */
            });

            test('*** Wait Until Spinner Off #1 ***', async () => {
                await fonction.waitForSpinner(pageTarifSimulation.spinner.first(), 180000); /** ce temps long parce que les donnees prennent enorge de temps a charger */
            });

            aListeStrategies.forEach(async (sStrategie: string) => {       /** Boucle sur la liste des strategies, On clique sur les strategies mais pas tout ! */
                test('Multiselect [STRATEGIE][' + sStrategie + '] - Click', async () => {
                    await fonction.clickAndWait(pageTarifSimulation.dataGridThMultiSelectStrategie, page);
                    await fonction.clickAndWait(pageTarifSimulation.dataGridThMultiSelectItemStrategie.getByText(sStrategie, { exact: true }), page);
                    await fonction.clickAndWait(pageTarifSimulation.dataGridThCloseIconMultiSelect, page); //<--- fermeture de la petite popup
                });
            }); //-- Fin Boucle forEach

            
            aListeArticles.forEach((sArticle: string) => {                   /** Boucle sur la liste des articles */
                test('Input [ARTICLE][' + sArticle + '] - Click', async () => {
                    await fonction.sendKeys(pageTarifSimulation.dataGridInputCodeArticle, sArticle, false, 'Article');
                    await fonction.waitForDomStable(page, 3000);
                });
                
                aListeStrategies.forEach(async (sStrategie: string) => {
                    test('Td [STRATEGIE]['+sArticle+'][' + sStrategie + '] - Click', async () => {
                        await fonction.clickAndWait(pageTarifSimulation.dataGridTdSimulationStrategie.getByText(sStrategie, { exact: true }), page);
                    })
                }); //-- Fin Boucle forEach


                test('Input [NOUVEAU PRIX DE CESSION][' + sArticle + '] = "' + sPrixCession + '"', async () => {
                    const iNbInputPrixCession: number = await pageTarifSimulation.dataGridInputNouveauPrixCession.count();   // J'insere les nouveaux prix de cession
                    for (let i = 0; i < iNbInputPrixCession; i++) {
                        await fonction.sendKeys(pageTarifSimulation.dataGridInputNouveauPrixCession.nth(i), sPrixCession, false, 'Nouveau prix de Cession');
                    }
                });

                test('Input [NOUVEAU PVC][' + sArticle + '] = "' + sPvc + '"', async () => {
                    const iNbInputPvc: number = await pageTarifSimulation.dataGridInputNouveauPvc.count();               // J'insere les nouveaux PVC
                    for (let i = 0; i < iNbInputPvc; i++) {
                        await fonction.sendKeys(pageTarifSimulation.dataGridInputNouveauPvc.nth(i), sPvc, false, 'Nouveau pvc');
                    }
                });
            }); // Fermeture de la boucle forEach principale

            test('Button [APPLIQUER LES MODIFICATIONS] - Click', async () => {
                await pageTarifSimulation.buttonAppliquerModifications.hover(); // Ici pas de besoin de cliquer , je survole le bouton de modification pour faire afficher les listes 
            });

            test('Li [APPLIQUER LES PRIX DE CESSION ET PVC] - Click', async () => {
                await fonction.clickAndWait(pageTarifSimulation.appliquerPcessionPvc, page);
            });

            const sPopinName: string = 'Appliquer les prix de cession et les PVC';
            test.describe('Popin [' + sPopinName + ']', async () => {         /** Popin  Appliquer les prix de cession et les PVC */
                test('Popin [' + sPopinName + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sPopinName, true);
                });

                test('Input [DATE D\'APPLICATION ] = "' + sDateApplication + '"', async () => {
                    await fonction.waitForDomStable(page);  
                    const sDatevalue: string = await pageTarifSimulation.pDatePickerApplication.inputValue();
                    expect(sDatevalue).toBe(sDateApplication);
                });

                test('Input [DATE FIN  D\'APPLICATION ] - To Be Disabled"', async () => {       
                    await expect(pageTarifSimulation.pDatePickerFinApplication).toBeDisabled(); 
                });

                test('Icon [INFORMATION] - Is Displayed', async () => {                  
                    await fonction.isDisplayed(pageTarifSimulation.pIconInformation);
                });

                test('Button [PERMANANT] - Is Checked', async () => {
                    await fonction.waitForDomStable(page);
                    await expect(pageTarifSimulation.pTogglePermamant).toBeChecked();
                });

                test('Button [APPLIQUER LES MODIFICATIONS] - Click', async () => {
                    await fonction.clickAndWait(pageTarifSimulation.pButtonAppliquerModif, page);
                });

                test('** wait until spinner off **', async () => {
                    await fonction.waitForSpinner(pageTarifSimulation.pSpinner, 180000);
                });

                test('Popin [' + sPopinName + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sPopinName, false);
                });
            });

            test('*** Wait Until Spinner Off #2 ***', async () => {
                await fonction.waitForSpinner(pageTarifSimulation.spinner.first(), 180000);
            });

            test('Icon [PRIX DE CESSION ET PRIX PVC APPLIQUE] - Is Displayed', async () => {   
                const iNbIconApplique: number = await pageTarifSimulation.dataGridTdIconAppliquer.count();
                for (let i = 0; i < iNbIconApplique; i++) {
                    await fonction.isDisplayed(pageTarifSimulation.dataGridTdIconAppliquer.nth(i));
                }
            });
        }); // Fin describe

        const sOngletName: string = 'tarification';
        test.describe('Onglet [TARIFICATION]', async () => {
            test('Onglet [TARIFICATION] - Click', async () => {
                await menuPage.clickOnglet(sPageName, sOngletName, page);
            });

            test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
                await fonction.isErrorDisplayed(false, page);
            });

            test('** Wait Until Spinner Off #3 **', async () => {
                await fonction.waitForSpinner(pageTarif.dataGridSpinner.first(), 180000);
            });

            test('CheckBox [TOUS LES TARIFS] - Click', async () => {
                await fonction.clickAndWait(pageTarif.checkBoxStatutTarif, page);
            });

            aListeStrategies.forEach(async (sStrategie: string) => {       /** Boucle sur la liste des strategies, On clique sur les strategies mais pas tout ! */
                test('Td [STRATEGIE][' + sStrategie + '] - Click', async () => {
                    await fonction.clickAndWait(pageTarif.multiSelectLabelGrpeMag, page);
                    await fonction.clickAndWait(pageTarif.multiSelectItem.getByText(sStrategie, { exact: true }), page);
                    await fonction.clickAndWait(pageTarif.IconClose, page); //<--- fermeture de la petite popup
                });
            }); //-- Fin Boucle forEach

            aListeArticles.forEach((sArticle: string) => {                   /** Boucle sur la liste des articles */
                test('Input [ARTICLE]=' + sArticle + '', async () => {
                    await fonction.sendKeys(pageTarif.inputArticle, sArticle, false, 'Article');
                });
               
                test('Td [PRIX DE CESSION][' + sArticle + '] ="' + sPrixCession + '"', async () => {  // je verifie si les prix de cession correspondent à ce qui est affiché
                    const iNbPrixCession: number = await pageTarif.tdDgPrixCession.count();
                    for (let i = 0; i < iNbPrixCession; i++) {
                        const sPrixCession: string = await pageTarif.tdDgPrixCession.locator('span').nth(i).textContent();
                        expect(sPrixCession).toBe(sPrixCession);
                    }
                });

                test('Td [PVC][' + sArticle + '] ="' + sPvc + '"', async () => {                // je verifie si les prix PVC correspondent à ce qui est affiché
                    const iNbPvc: number = await pageTarif.tdDgPrixVenteTTC.count();
                    for (let i = 0; i < iNbPvc; i++) {
                        const sPrixPvc: string = await pageTarif.tdDgPrixVenteTTC.locator('span').nth(i).textContent();
                        expect(sPrixPvc).toBe(sPvc);
                    }
                });

                test('Toggle [PERMANANT][' + sArticle + '] - Click', async () => {           // Je verifie si les toggle permanant sont coché
                    const iNbTogglePermanant: number = await pageTarif.tdDgTogglePermanant.count();
                    for (let i = 0; i < iNbTogglePermanant; i++) {
                        await expect(pageTarif.tdDgTogglePermanant.nth(i)).toBeChecked();
                    }
                });
            }); // -- Fin Boucle forEach  

            test.describe('Onglet [SIMULATION]', async () => {
                const sOngletName: string = 'simulationPrix';
                test('Onglet [SIMULATION] - Click', async () => {
                    menuPage.clickOnglet(sPageName, sOngletName, page);
                });

                test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
                    await fonction.isErrorDisplayed(false, page);
                });

                test('Button [AFFICHER LIGNE MODIFIEE] - Click', async () => {
                    await fonction.clickAndWait(pageTarifSimulation.checkBoxAffUniqLignesModif, page);
                });

                test('Button [RECHERCHER] - Click', async () => {
                    await fonction.clickAndWait(pageTarifSimulation.buttonRechercher, page); /**Cliquer sur le bouton rechercher pour afficher toutes les lignes modifiées */
                });

                test('*** Wait Until Spinner Off #1 ***', async () => {
                    await fonction.waitForSpinner(pageTarifSimulation.spinner.first(), 180000);
                });

                test('CheckBox [FILTRE APPLIQUE] - Click', async () => {                    // Je clique sur la checkbox pour afficher les lignes modifiées
                    await fonction.clickAndWait(pageTarifSimulation.dataGridCheckBoxAppliquee, page);
                });

                aListeStrategies.forEach(async (sStrategie: string) => {       /** Boucle sur la liste des strategies, On clique sur les strategies mais pas tout ! */
                    test('Multiselect [STRATEGIE][' + sStrategie + '] - Click', async () => {
                        await fonction.clickAndWait(pageTarifSimulation.dataGridThMultiSelectStrategie, page);
                        await fonction.clickAndWait(pageTarifSimulation.dataGridThMultiSelectItemStrategie.getByText(sStrategie, { exact: true }), page);
                        await fonction.clickAndWait(pageTarifSimulation.dataGridThCloseIconMultiSelect, page);   //<--- fermeture de la petite popup
                    });
                }); //-- Fin Boucle forEach

                aListeArticles.forEach((sArticle: string) => {                   /** Boucle sur la liste des articles */
                    test('Input [ARTICLE][' + sArticle + '] - Click', async () => {
                        await fonction.sendKeys(pageTarifSimulation.dataGridInputCodeArticle, sArticle, false, 'Article');
                        await fonction.waitForDomStable(page, 3000);
                    });

                    aListeStrategies.forEach(async (sStrategie: string) => {       /** Boucle sur la liste des strategies, On clique sur les strategies mais pas tout ! */
                        test('Td [STRATEGIE][' + sArticle + '][' + sStrategie + '] - Click', async () => {
                            await fonction.clickAndWait(pageTarifSimulation.dataGridTdSimulationStrategie.getByText(sStrategie, { exact: true }), page);
                        })
                    }); //-- Fin Boucle forEach
                  
                    test('Em [PRIX DE CESSION ET PVC APPLIQUE][' + sArticle + '] - Is Visible', async () => {  // Je verifie si les lignes modifiées sont affichées
                        const iNbIconApplique: number = await pageTarifSimulation.dataGridTdIconAppliquer.count();
                        expect(aListeStrategies.length).toBe(iNbIconApplique);
                    });
                }); // Fermeture de la boucle forEach principale

                test(' *** TRAITEMENT  *** ', async () => {
                    await selectJourVerifierSimulation();
                });
 
            }); // Fin describe         
        });
   
    });  //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
});


