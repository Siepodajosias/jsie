/**
 * 
 * @author JC CALVIERA
 * @since 2024-02-28
 * 
 */
const xRefTest      = "ACH_TSP_SUP";
const xDescription  = "Supprimer une unité de Transport";
const xIdTest       =  1758;
const xVersion      = "3.2";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Successeur de [ACH_TSP_MOD]'],
    params      : [],
    fileName    : __filename
};

import { test, type Page, expect}   from '@playwright/test';

import { Help }             from '@helpers/helpers';
import { TestFunctions }    from '@helpers/functions';
import { Log }              from '@helpers/log';

import { MenuAchats }       from '@pom/ACH/menu.page';
import { PageRefUniTrp }    from '@pom/ACH/referentiel_unites-transport.page';
import { CartoucheInfo }    from '@commun/types';

//------------------------------------------------------------------------------------

let page                    : Page;
 
var pageref                 : PageRefUniTrp;
var menu                    : MenuAchats;

const log                   = new Log();
const fonction              = new TestFunctions(log);

const sNomUnite:string      = 'TEST-AUTO_UniteTransport-' + fonction.getToday();
const sNomUniteCapitalized  = sNomUnite.charAt(0).toUpperCase() + sNomUnite.slice(1).toLowerCase();

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }) => {
    page        = await browser.newPage();
    menu        = new MenuAchats(page, fonction);    
    pageref     = new PageRefUniTrp(page);
})
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

   test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper    = new Help(info, testInfo, page);
        await helper.init();
   });

   test('Ouverture URL : ' + fonction.getApplicationUrl(), async () => {
       await fonction.openUrl(page);
   });

   test('Connexion', async() => {
       await fonction.connexion(page);
   })
  
    test.describe('Page [REFERENTIEL]', async() => {

        var pageName:string = 'referentiel';

        test("Menu [REFERENTIEL] - Click ", async () => {
            await menu.click(pageName, page);
        })

        test('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
        })

       test.describe('Onglet [UNITES DE TRANSPORT]', async() => {

            test ('Onglet [UNITES DE TRANSPORT] - Click', async () => {
                await menu.clickOnglet(pageName, 'unitesTransport',page);                
            })   

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            test ('CheckBox [UNITE TRANSPORT][' + sNomUniteCapitalized + '] - Click', async () => {
                await fonction.clickElement(pageref.dataGridListeNomsUnites.filter({hasText:sNomUniteCapitalized}));
                fonction.addDataSheet('CheckBox', 'Unite de Transport', sNomUniteCapitalized);
            })

            test ('Button [SUPPRIMER UNE UNITE DE TRANSPORT] - Click', async () => {
                await fonction.clickElement(pageref.buttonSupprimerUniteTransport);
            })

            const sNomPopin:string = "Suppression d'une unité de transport";
            test.describe ('Popin ' + sNomPopin.toUpperCase() + ']', async() => {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () =>  {
                  await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
                })
                
                test('Message [ERREUR] - Is Not Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);                           // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
                })

                test ('Button [OK] - Click', async () => {
                    await fonction.clickAndWait(pageref.pPbuttonDelOk, page);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () =>  {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), false, 3000);
                })

            })  // End Popin

            test ('CheckBox [UNITE TRANSPORT][?] = "' + sNomUniteCapitalized + '"', async () => {
                await expect(pageref.dataGridListeNomsUnites.filter({hasText:sNomUniteCapitalized})).not.toBeVisible();
            })

       })  // End  Onglet

    })  // End  Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})  // End describe