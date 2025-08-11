/**
 * 
 * @author SIAKA KONE
 *  Since 2024-04-19
 */

const xRefTest      = "PRI_MRG_GLB";
const xDescription  = "Affichage des Marges Globales";
const xIdTest       =  1712;
const xVersion      = '3.3';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRI',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}   from '@playwright/test';

import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log.js';
import { Help }                     from '@helpers/helpers.js';

//-- PageObject ----------------------------------------------------------------------

import { MenuPricing }              from '@pom/PRI/menu.page';
import { TarificationPage }         from '@pom/PRI/tarification_tarification.page';

import { CartoucheInfo }            from '@commun/types';

//----------------------------------------------------------------------------------------

let page        : Page;
let menuPage    : MenuPricing;

let pageTarif   : TarificationPage;

const log       = new Log();
const fonction  = new TestFunctions(log);

//-------------------------------------------------------------------------------------------------------------------
const sRayon    = fonction.getInitParam('rayon','Fruits et légumes');
//-------------------------------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage(); 
    menuPage    = new MenuPricing(page, fonction);
    pageTarif   = new TarificationPage(page);
    const helper= new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe ('Page [ACCUEIL]', async () => {    

        test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        });   

        test ('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menuPage.selectRayonByName(sRayon, page);                       // Sélection du rayon passé en paramètre
            log.set('Rayon : ' + sRayon);
        });   

    });  //-- End Describe Page

    test.describe ('Page [TARIFICATION]', async () => {    

        test ('Page [TARIFICATION] - Click', async () => {
            await menuPage.click('tarification', page);
        });

        test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        });

        test ('DatePicker [EDITION TARIF] - Select 1st Month Day', async () => {
            await fonction.clickElement(pageTarif.datePickerEditionTarif);
        });

        test ('th [MONTH][previous] - Click', async () => {
            await fonction.clickElement(pageTarif.tdCalendarPreviousMonth);
        });

        test ('td [CALENDAR][0] - Click', async () => {
            await fonction.clickElement(pageTarif.tdCalendarValideDays.first());
        });

        const sNomPopin:string = 'CALCUL DES MARGES';
        test.describe ('Popin [' + sNomPopin + ']', () => {

            test ('Button [MARGES GLOBALES] - Click', async () => {
                await fonction.clickAndWait(pageTarif.buttonMargesGlobales, page);
            });

            test ('Popin [' + sNomPopin + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            }); 

            test ('ListBox [ENSEIGNE][all] - Click', async () => {
                await fonction.clickElement(pageTarif.pPcalcMargeCheckBoxAll.nth(1));
                const iNbEnseignes:number = await pageTarif.pPcalcMargeCheckBoxChoix.count();
                log.set('Nombre d\'enseignes : ' + iNbEnseignes.toString());
                await fonction.clickElement(pageTarif.pPcalcMargeCheckBoxChoix.first());
                await fonction.clickElement(pageTarif.pPcalcMargeIconClose);
            });

            test ('Switch [INCLURE LES EXTERNES] = "On"', async () => {
                await fonction.clickElement(pageTarif.pPcalcMargeSwitchLiensExt);
            });

            test ('Button [CALCULER] - Click', async () => {
                await fonction.clickAndWait(pageTarif.pPcalcMargeButtonCalculer, page);                
            });

            test('** Wait Until Spinner Off **', async () => {
                const iDelayTimeOut = 600000;
                test.setTimeout(iDelayTimeOut);         //-- Le calcul peut durer plusieurs minutes !
                await expect(pageTarif.pPcalcMargeSpinner.first()).not.toBeVisible({timeout:iDelayTimeOut});
            });            

            test ('td [MARGES] - Is Visible', async () =>{
                const iNbResults:number = await pageTarif.pPcalcTdMarges.count();
                log.set('Nombre de résultats affichés : ' + iNbResults.toString())
            });

            test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au calcul
                await fonction.isErrorDisplayed(false, page);
            });     

            test ('Link [FERMER] - Click', async () => {
                await fonction.clickElement(pageTarif.pPcalcMargeLinkFermer);
            });

            test ('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            }); 

        });  // End describe Popin      

    });  //-- End Describe Page

    
    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})