/**
 * 
 * @author JC CALVIERA
 * @since 2024-03-29
 * 
 */
const xRefTest      = "ACH_EMB_DED";
const xDescription  = "Suppression d'un Code Emballage";
const xIdTest       =  9218;
const xVersion      = "3.0";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page}   from '@playwright/test';

import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { Log }              from '@helpers/log.js';

import { MenuAchats }       from '@pom/ACH/menu.page.js';
import { PageRefEmb }       from '@pom/ACH/referentiel_emballages.page';

import { CartoucheInfo, TypeEsb } from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
 
var pageEmb         : PageRefEmb;
var menu            : MenuAchats;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }) => {
    page    = await browser.newPage();
    menu    = new MenuAchats(page, fonction);    
    pageEmb = new PageRefEmb(page);
})
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

const sRayon:string     = fonction.getInitParam('rayon', 'Frais Généraux');        

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

   test('-- Start --', async ({ context }, testInfo) => {
    await context.clearCookies();
    const helper = new Help(info, testInfo, page);
    await helper.init();
   });

   test('Ouverture URL : ' + fonction.getApplicationUrl(), async () => {
       await fonction.openUrl(page);
   });

   test('Connexion', async() => {
       await fonction.connexion(page);
   })
  
    test.describe('Page [REFERENTIEL]', async() => {

        var pageName    = 'referentiel';
       
        test('ListBox [RAYON] = "' + sRayon + '"', async() => {                    
            await menu.selectRayonByName(sRayon, page);
        })

        test("Menu [REFERENTIEL] - Click ", async () => {
            await menu.click(pageName, page);
        })

       test.describe ('Onglet [EMBALLAGES]', async() => {

            test ('Onglet [EMBALLAGES] - Click', async () => {
                await menu.clickOnglet(pageName, 'emballages',page);                
            })   

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            test('InputField [DESIGNATION] = "TA_"', async () =>  {
                await fonction.sendKeys(pageEmb.inputLibelle, 'TA_');
            })

            test('td [EMBALLAGE][0] - Click', async () =>  {
                await fonction.wait(page, 250);     //-- Attente raffraîchissement de la liste
                await fonction.clickElement(pageEmb.tdCodeEmballage.first());
            })

            test ('Button [SUPPRIMER] - Click', async () => {
                await fonction.clickElement(pageEmb.buttonSupprimer);
            })

            var sNomPopin = "Confirmation de la suppression d'un emballage";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () =>  {
                  await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
                })

                test ('Button [SUPPRIMER] - Click', async () => {
                    await fonction.clickAndWait(pageEmb.pButtonSupprimer, page);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () =>  {
                  await fonction.popinVisible(page, sNomPopin.toUpperCase(), false);
                })

            })  // End Popin

       })  // End  Onglet

    })  // End  Page

    test('Déconnexion', async () => {
      await fonction.deconnexion(page);
    });

})  // End describe