/**
 * 
 * @author SIAKA KONE
 *  Since 2024-04-22
 */

const xRefTest      = "PRI_MRG_PER";
const xDescription  = "Affichage des Marges pour une période";
const xIdTest       =  1925;
const xVersion      = '3.1';

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
import { test, expect , type Page}       from '@playwright/test';

import { TestFunctions }                 from '@helpers/functions';
import { Log }                           from '@helpers/log.js';
import { Help }                          from '@helpers/helpers.js';
import { CartoucheInfo }                 from '@commun/types';

//-- PageObject ----------------------------------------------------------------------

import { MenuPricing }                   from '@pom/PRI/menu.page';
import { TarificationPage }              from '@pom/PRI/tarification_tarification.page';

//----------------------------------------------------------------------------------------

let page        : Page;
let menuPage    : MenuPricing;

let pageTarif   : TarificationPage;

const log       = new Log();
const fonction  = new TestFunctions(log);

//-------------------------------------------------------------------------------------------------------------------
const sRayon    = fonction.getInitParam('rayon','Crèmerie');
//-------------------------------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page      = await browser.newPage(); 
    menuPage  = new MenuPricing(page, fonction);
    pageTarif = new TarificationPage(page);
    const helper= new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//-----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
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
            log.set('Rayon : ' + sRayon);
        });        
    });  //-- End Describe Page

    test.describe('Page [TARIFICATION]', async () => {    

        test('Page [TARIFICATION] - Click', async () => {
            await menuPage.click('tarification', page);
        });

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        });

        const sNomPopin:string = 'CALCUL DES MARGES SUR UNE PERIODE';
        test.describe('Popin [' + sNomPopin + ']', async () => {

            test('Button [MARGES SUR UNE PERIDOE] - Click', async () => {
                await fonction.clickAndWait(pageTarif.buttonMargesSurPeriode, page);
            });

            test('Popin [' + sNomPopin + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            }); 

            test ('** Wait Until Spinner Off - Marge**', async () => {  
                const iDelayTimeOut = 180000;
                test.setTimeout(iDelayTimeOut);         //-- L'ffichage peut durer plusieurs minutes !  
                await expect(pageTarif.pPspinnerMargePeriode.first()).not.toBeVisible({timeout:iDelayTimeOut});
            }); 

            test('Button [CALCULER LES MARGES HEBDOMADAIRES] - Click', async () => {
                await fonction.clickAndWait(pageTarif.pPbuttonCalculerMarges, page);
            });

            test('** Wait Until Spinner Off - hebdomadaire**', async () => {   
                const iDelayTimeOut = 300000;
                test.setTimeout(iDelayTimeOut);         //-- Le calcul peut durer plusieurs minutes !
                await expect(pageTarif.pPspinnerMargePeriode.first()).not.toBeVisible({timeout:iDelayTimeOut});
            });

            test('** Check table displayed **', async () => { 
                const iDelayTimeOut = 300000;
                test.setTimeout(iDelayTimeOut);         //-- Le temps d'affichage peut prendre plus de temps !  
                await expect(pageTarif.pPtableResultatMarges).toBeVisible({timeout:iDelayTimeOut}); 
            });

            test('Link [FERMER] - Click', async () => {
                await fonction.clickElement(pageTarif.pPlinkFermerMargePeriode);
            });

            test('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            }); 

        });  // End describe Popin      
    });  //-- End Describe Page

    
    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
})

