/**
 * 
 * @author JC CALVIERA
 * @since 2024-03-26
 * 
 */

const xRefTest      = "FAC_ADM_POF";
const xDescription  = "Désactivation de l'impression automatique des factures";
const xIdTest       =  2205;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'FAC',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon', 'groupeArticle'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }              from '@playwright/test';

import { Help }                         from '@helpers/helpers.js';
import { TestFunctions }                from '@helpers/functions.js';
import { Log }                          from '@helpers/log.js';

import { MenuFacturation }              from '@pom/FAC/menu.page';
import { AdminParametragepage }         from '@pom/FAC/admin-parametrage.page';

import { CartoucheInfo }                from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuFacturation;
let pageAdmin           : AdminParametragepage;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

const sRayon            = fonction.getInitParam('rayon', 'Fruits et légumes')
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Tous')

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuFacturation(page, fonction);
    pageAdmin       = new AdminParametragepage(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ADMIN]', async () => {

        let sCurrentPage = 'admin';

        test ('Page [ADMIN]', async () => {
            await menu.click(sCurrentPage, page);
        });

        test ('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);               // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
        })

        test.describe('Onglet [PARAMETRAGE]', async () =>{

            test ('Onglet [PARAMETRAGE] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'parametrage', page);
            })

            test ('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);               // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            test ('ListBox [RAYON] = "' + sRayon + ' - ' + sGroupeArticle + '"', async () => {            
                await menu.selectRayonGroupeArticle(sRayon, sGroupeArticle, page);           
                log.set('Rayon Cible : ' + sRayon);
            });

            test ('CheckBox [IMPRESSION AUTOMATIQUE DES FACTURES DES CLIENTS EXTERNES] - Uncheck', async () => { 
                if (await pageAdmin.checkBoxPrintFacCliExterne.isChecked()) {
                    await fonction.clickElement(pageAdmin.checkBoxPrintFacCliExterne);
                } else {
                    log.set('Ignore');
                }
            });

            test ('CheckBox [IMPRESSION SUR DEMANDE DES RELEVES DE FACTURES] - Uncheck', async () => { 
                if (await pageAdmin.checkBoxPrintReleveFac.isChecked()) {
                    await fonction.clickElement(pageAdmin.checkBoxPrintReleveFac);
                } else {
                    log.set('Ignore');
                }
            });

            test ('Button [ENREGISTRER] - Click', async() => {
                await fonction.clickAndWait(pageAdmin.buttonPrintEnregistrer, page);
            });

        });

    });

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

});