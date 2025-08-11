/**
 * @author Vazoumana DIARRASSOUBA
 * @since   2024-02-20
 * 
 */
const xRefTest      = "ACH_DOS_ASS";
const xDescription  = "Associer des articles à un dossier d'achat";
const xIdTest       =  255;
const xVersion      = '3.0';
 
var info = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : [],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { test, type Page, expect}   from '@playwright/test';
import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { Log }              from '@helpers/log.js';
import { EsbFunctions }     from '@helpers/esb';
//-- PageObject ----------------------------------------------------------------------

import { MenuAchats }       from '@pom/ACH/menu.page.js'; 
import { PageRefDosAch }    from '@pom/ACH/referentiel_dossiers-achats.page';

//------------------------------------------------------------------------------------

let page                  : Page;
let menu                  : MenuAchats;
let pageRefDosAch         : PageRefDosAch;

const log                 = new Log();
const fonction            = new TestFunctions(log);
const esb                 = new EsbFunctions(fonction);
//------------------------------------------------------------------------------------

const maDate              = new Date();
const dateJour            = maDate.getFullYear().toString().slice(-2) + fonction.addZero(maDate.getMonth() + 1) + fonction.addZero(maDate.getDate());
const iNbArticles         = 10;  // nombre d'articles à associer
var sNomDossier           = 'TA_ Dossier Achat' + dateJour;

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page                 = await browser.newPage();
    menu                 = new MenuAchats(page, fonction);
    pageRefDosAch        = new PageRefDosAch(page); 
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------  

test.describe.serial('[' + xRefTest + ']', async () => {  
    
    test('- Start -', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    })

    test('Ouverture URL', async () => {
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [REFERENTIEL]', async () => {

        var sPageName = 'referentiel';
        test('Page [REFERENTIEL] - Click', async () => {
            await menu.click(sPageName, page);
        })

        test.describe('Onglet [DOSIERS D\'ACHAT]', async () => {

            var sNomOnglet = 'dossiersAchat';
            test('Onglet [DOSIERS D\'ACHAT]', async () => {
                await menu.clickOnglet(sPageName, sNomOnglet, page);
            })

            test('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })

            test('CheckBox [ARTICLES][0-10] - Click', async () => {
                // On sélectionne nbArticles articles à associer
                for (let cpt = 0; cpt < iNbArticles; cpt++) {  
                    await pageRefDosAch.checkBoxListeArticles.nth(cpt).click();
                }
                var compteur = await pageRefDosAch.dataGridDossierAchat.nth(0).textContent()
                expect(compteur).toBe(iNbArticles.toString());
            })
        })
    })
})