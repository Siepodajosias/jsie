/**
 * 
 * @author SIAKA KONE
 *  Since 2024-04-19
 */

const xRefTest      = "PRI_TAR_***";
const xDescription  = "Envoyer la tarification";
const xIdTest       =  78;
const xVersion      = '3.2';

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

import { test, expect, type Page}        from '@playwright/test';
import { CartoucheInfo }                 from '@commun/types';
import { TestFunctions }                 from '@helpers/functions';
import { Log }                           from '@helpers/log.js';
import { Help }                          from '@helpers/helpers.js';

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
const sRayon    = fonction.getInitParam('rayon','Fruits et légumes');
//-------------------------------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page      = await browser.newPage(); 
    menuPage  = new MenuPricing(page, fonction);
    pageTarif = new TarificationPage(page);
    const helper = new Help(info, testInfo, page);
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
        });        
    })  //-- End Describe Page

    test.describe('Page [TARIFICATION]', async () => {    

        test('Page [TARIFICATION] - Click', async () => {
            await menuPage.click('tarification', page);
        });

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        });

        const sNomPopin:string = 'CONFIRMATION ENVOI DES TARIFICATIONS';
        test.describe('Popin [' + sNomPopin + ']', async () => {

            test('Button [TARIFS MAGASINS] - Click', async () => {
                await fonction.clickAndWait(pageTarif.buttonTarifsMagasin, page);
            });

            test('Popin [' + sNomPopin + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            }); 

            test('Label [ERREUR] - Is Not Visible', async () => {   
                await fonction.isErrorDisplayed(false, page);
            });

            test('Button [ENVOYER PARTIELLEMENT] - Click', async () => {
                await fonction.clickAndWait(pageTarif.pButtonEnvoiPartiel, page);
            }); 
            
            test('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            }); 

            test('** Wait Until Spinner Off **', async () => {
                const iDelayTimeOut = 180000;
                test.setTimeout(iDelayTimeOut);         //-- Attendre que le spinner disparaisse !
                await expect(pageTarif.spinnerTarification).not.toBeVisible({timeout:iDelayTimeOut});
            });   
        });  // End describe Popin      
    });  //-- End Describe Page

    
    test('Déconnexion', async () => {
        await fonction.deconnexion(page)
    });
})

