/**
 * 
 * @author JC CALVIERA
 * 
 */
const xRefTest      = "ACH_EMB_ADD";
const xDescription  = "Création d'un Code Emballage";
const xIdTest       =  253;
const xVersion      = "3.1";

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

const sRayon:string = fonction.getInitParam('rayon', 'Frais Généraux');        

const sDesignEmb    = 'TA_emballage-' + fonction.getToday(); 
const rFraisUnit    = 12.34;
const sAllowedRange = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
var iCptTentative   = 0;

//------------------------------------------------------------------------------------

/**
 * 
 * @param min 
 * @param max 
 * @returns Un entier aléatoire compris entre min et max
 */
var entierAleatoire = function(min:number, max:number):number {    
    return Math.floor(fonction.random() * (max - min + 1)) + min;
}

/**
 * 
 * @returns Un code emballage aléatoire
 */
var getCodeEmballage = async function():Promise<string> {
    // On récupère la liste des tous les codes emballages existants
    const aCurrents = await pageEmb.tdCodeEmballage.allTextContents();

    do {
        var sCodeEmballage = sAllowedRange[entierAleatoire(0, sAllowedRange.length - 1)] + sAllowedRange[entierAleatoire(0, sAllowedRange.length - 1)];
        log.set('Code Emballage Essai #' + iCptTentative + ' : ' + sCodeEmballage);    
    } while (aCurrents.indexOf(sCodeEmballage) > 0);

    return sCodeEmballage;
}

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

            test ('Button [CREER] - Click', async () => {
                await fonction.clickElement(pageEmb.buttonCreer);
            })

            test.describe ('Popin [CREATION D\'UN EMBALLAGE]', async() => {

                test('Popin [CREATION D\'UN EMBALLAGE] - Is Visible', async () =>  {
                  await fonction.popinVisible(page, 'CREATION D\'UN EMBALLAGE', true);
                })

                test('InputField [DESIGNATION] = "rnd"', async () =>  {
                    await fonction.sendKeys(pageEmb.pInputDesignation, sDesignEmb);
                })

                test('InputField [FRAIS UNITAIRES] = ' + rFraisUnit.toString(), async () =>  {
                    await fonction.sendKeys(pageEmb.pInputFraisUnitaires, rFraisUnit.toString());
                })

                test('InputField [ABREVIATION] = rnd', async () =>  {
                    await fonction.sendKeys(pageEmb.pInputAbreviation, await getCodeEmballage());
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