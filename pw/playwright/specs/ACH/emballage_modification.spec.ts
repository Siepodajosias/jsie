/**
 * 
 * @author JC CALVIERA
 * @since 2024-03-29
 * 
 */
const xRefTest      = "ACH_EMB_UPD";
const xDescription  = "Modification d'un Code Emballage";
const xIdTest       =  1750;
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
import { EsbFunctions }     from '@helpers/esb.js';

import { MenuAchats }       from '@pom/ACH/menu.page.js';
import { PageRefEmb }       from '@pom/ACH/referentiel_emballages.page';

import { CartoucheInfo, TypeEsb } from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
 
var pageEmb         : PageRefEmb;
var menu            : MenuAchats;
let esb             : EsbFunctions;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }) => {
    page    = await browser.newPage();
    menu    = new MenuAchats(page, fonction);    
    pageEmb = new PageRefEmb(page);
    esb     = new EsbFunctions(fonction);
})
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

const sRayon:string     = fonction.getInitParam('rayon', 'Frais généraux');        
const iLongueur:number  = 88.88;
const iLargeur:number   = 77.77;
const iHauteur:number   = 99.99;

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

            test ('Button [MODIFIER] - Click', async () => {
                await fonction.clickElement(pageEmb.buttonModifier);
            })

            test.describe ('Popin [MODIFICATION D\'UN EMBALLAGE]', async() => {

                test('Popin [CREATION D\'UN EMBALLAGE] - Is Visible', async () =>  {
                  await fonction.popinVisible(page, 'CREATION D\'UN EMBALLAGE', true);
                })

                test('Toggle Button [VOLUME FIXE] - Click (Optionnel)', async () =>  {
                    if (await pageEmb.pInputLongueur.isEnabled()) {
                        test.skip();
                    } else {
                        await fonction.clickElement(pageEmb.toggleButtonVolumeFixe);
                    }
                })

                test('InputField [LONGUEUR] = "' + iLongueur + '"', async () =>  {
                    await fonction.sendKeys(pageEmb.pInputLongueur, iLongueur);
                })

                test('InputField [LARGEUR] = "' + iLargeur + '"', async () =>  {
                    await fonction.sendKeys(pageEmb.pInputLargeur, iLargeur);
                })

                test('InputField [HAUTEUR] = "' + iHauteur + '"', async () =>  {
                    await fonction.sendKeys(pageEmb.pInputHauteur, iHauteur);
                })

                test ('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pageEmb.pButtonCreer, page);
                })

                test('Popin [CREATION D\'UN EMBALLAGE] - Is Hidden', async () =>  {
                  await fonction.popinVisible(page, 'CREATION D\'UN EMBALLAGE', false);
                })

            })  // End Popin

       })  // End  Onglet

    })  // End  Page

    test('Déconnexion', async () => {
      await fonction.deconnexion(page);
    });

    test('** CHECK FLUX **', async () => {
       fonction.wait(page, 1000);

            var oFlux:TypeEsb = { 
               "FLUX" : [
                   {
                        NOM_FLUX    : "EnvoyerEmballage_Stock",
                        TITRE       : /Emballage*/
                   }, 
                   {
                        NOM_FLUX    : "EnvoyerCaracteristique_Trad",
                        TITRE       : /Caractéristique : Emballage -*/
                    },                     
                ],
               WAIT_BEFORE  : 3000,               
               VERBOSE_MOD  : false
            };

           await esb.checkFlux(oFlux, page);

    })

})  // End describe