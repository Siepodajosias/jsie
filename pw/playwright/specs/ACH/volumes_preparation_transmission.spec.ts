/**
 * 
 * @author JC CALVIERA
 * @since 2024-03-11
 * 
 */
const xRefTest      = "ACH_ART_VOL";
const xDescription  = "Transmettre les volumes de préparation en nombre de palettes";
const xIdTest       =  3078;
const xVersion      = "3.1";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};

import { test, type Page }		        from '@playwright/test';

import { Help }                         from '@helpers/helpers.js';
import { TestFunctions }                from '@helpers/functions.js';
import { EsbFunctions }                 from '@helpers/esb.js';
import { Log }                          from '@helpers/log';

import { MenuAchats }                   from '@pom/ACH/menu.page.js';
import { PageAchAnalyse }               from '@pom/ACH/achats_analyse-journee.page';

import { CartoucheInfo, TypeEsb } 		from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
 
var pageAnalyse         : PageAchAnalyse;
var menu                : MenuAchats;
let esb                 : EsbFunctions;

const log               = new Log;
const fonction          = new TestFunctions(log);
const maDate:any        = new Date();

//------------------------------------------------------------------------------------

const sSujetEmail       = 'Sujet : Volume de préparation du ' + fonction.addZero(maDate.getDate()) + '/' + fonction.addZero(maDate.getMonth() + 1) + '/' + maDate.getFullYear();
const sRayon            = 'Fruits et légumes';

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuAchats(page, fonction);    
    pageAnalyse         = new PageAchAnalyse(page);
    esb                 = new EsbFunctions(fonction);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async({}, testInfo) => {
    await fonction.close(testInfo);
})
 
//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async() => {
       await fonction.connexion(page);
    })
  
    test.describe('Page [ACHATS]', () => {

       var pageName    = 'achats';

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {
            await menu.selectRayonByName(sRayon, page);
        })

        test("Menu [ACHATS] - Click ", async () => {
            await menu.click(pageName, page);
        })

        test ('Button [TRANSMETTRE LES VOLUMES] - Click', async () => {
            await fonction.clickElement(pageAnalyse.buttonTransmettre);
        })

        var sNomPopin = "Commentaire sur le bon de commande";
        test.describe('Popin [' + sNomPopin.toUpperCase() + ']', () => {

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () =>  {
                await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
            })

            test('Button [ENVOYER] - Click', async () => {
                await fonction.clickAndWait(pageAnalyse.pPenvoiButtonEnvoyer, page);
            })

            test('Message [ERREUR] - Is Visible (Optionnel)', async () => {
                if (await pageAnalyse.pPenvoiMessageErreur.isVisible()) {
                    const sMessageErreur = await pageAnalyse.pPenvoiMessageErreur.textContent();
                    log.set('Message Info affiché : ' + sMessageErreur);
                } else {
                    test.skip();
                }
            })

            test ('Button [FERMER] - Click (Optionnel)', async () => {
                test.setTimeout(120000);
                await fonction.clickAndWait(pageAnalyse.pPenvoiButtonFermer, page, 120000);
            })

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is NOT Visible', async () =>  {
                await fonction.popinVisible(page, sNomPopin.toUpperCase(), false);
            })

        })

    })  // End describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

    test('** CHECK FLUX **', async () => {

        var oFlux:TypeEsb = { 
            "FLUX" : [
                {
                    "NOM_FLUX"   : "Envoyer_Mail",
                    "TITRE"      : sSujetEmail
                },  
            ],
            "WAIT_BEFORE"        : 30000,               
        };

        await esb.checkFlux(oFlux, page);
        
    })

})  // End describe