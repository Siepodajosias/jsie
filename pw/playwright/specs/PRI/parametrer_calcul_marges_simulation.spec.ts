/**
 * @author JOSIAS SIE
 *  Since 2025-07-14
 */

const xRefTest      = "PRI_SIM_PCM";
const xDescription  = "Paramétrer le calcul des marges sur la simulation - Choix marge hebdomadaire";
const xIdTest       =  7425;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRICING',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, expect, type Page}from '@playwright/test';
import { CartoucheInfo, TypeListOfElements }         from '@commun/types';
import { TestFunctions }         from '@helpers/functions';
import { Log }                   from '@helpers/log.js';
import { Help }                  from '@helpers/helpers.js';

//-- PageObject ----------------------------------------------------------------------

import { MenuPricing }           from '@pom/PRI/menu.page';
import { SimulationPrixPage }               from '@pom/PRI/tarification_simulation-prix.page.js';

//----------------------------------------------------------------------------------------

let page               : Page;
let menu               : MenuPricing;
let pageTarifSimulation: SimulationPrixPage;
const log              = new Log();
const fonction         = new TestFunctions(log);

//----------------------------------------------------------------------------------------
const sRayon           = fonction.getInitParam('rayon','Crèmerie');
//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page               = await browser.newPage(); 
    menu               = new MenuPricing(page, fonction);
    pageTarifSimulation= new SimulationPrixPage(page);
    const helper       = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [ACCUEIL]', async () => {   
        
        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })   

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {  
            await fonction.isDisplayed(menu.listBoxRayon)          
            await menu.selectRayonByName(sRayon, page);         // Sélection du rayon passé en paramètre
        })  
    })  //-- End Describe Page

    test.describe ('Page [TARIFICATION]', async () => {   
        var pageName:string = 'tarification';

        test('Page [TARIFICATION] - Click', async () => {
            await menu.click(pageName, page);
        })

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })

        test('** Wait Until Spinner Off **', async () => {
            await fonction.waitForSpinner(pageTarifSimulation.spinnerLoading.first())
        })

        test.describe ('Onglet [SIMULATION PRIX]', async () => {
    
            test('Onglet [SIMULATION PRIX] - Click', async () => {
                await menu.clickOnglet(pageName, 'simulationPrix', page);
            })

            test('Button [RECHERCHER] - Click', async () => {
                await fonction.clickAndWait(pageTarifSimulation.buttonRechercher, page);  
            })

            test('** Wait Until Spinner Off **', async () => {
                await fonction.waitForSpinner(pageTarifSimulation.spinnerLoading.first())
            })

            var sNomPopin:string = 'CALCUL DES MARGES SUR UNE PERIODE';
            test.describe ('Popin [' + sNomPopin + ']', async () => {
                test('Button [CALCULER LES MARGES] - Click', async () => {
                    await fonction.clickAndWait(pageTarifSimulation.buttonCalculerMarges, page);  
                })

                test('Popin [' + sNomPopin + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                }) 

                test.skip('Button [CALCULER LES MARGES HEBDOMADAIRES] - Click', async () => {
                    await fonction.clickAndWait(pageTarifSimulation.pButtonCalculerMargesHebdom, page);
                })

                test('Popin [' + sNomPopin + '] - Is Not Visible', async () => { 
                    await fonction.popinVisible(page, sNomPopin, false);
                })
            })

        })	//-- Onglet SIMULATION PRIX
    })  //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})

