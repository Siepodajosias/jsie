/**
 * 
 * @author JC CALVIERA
 * @since 2024-02-23
 * 
 */
const xRefTest      = "ACH_GEN_ADD";
const xDescription  = "Création d'un Gencod";
const xIdTest       =  252;
const xVersion      = "3.2";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['codeArticle'],
    fileName    : __filename
};

import { test, type Page }  from '@playwright/test';

import { Help }             from '@helpers/helpers';
import { TestFunctions }    from '@helpers/functions';
import { Log }              from '@helpers/log';
import { EsbFunctions }     from '@helpers/esb';

import { MenuAchats }       from '@pom/ACH/menu.page';
import { PageRefGen }       from '@pom/ACH/referentiel_gencods.page';

import { AutoComplete, CartoucheInfo }     from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
 
var pageGencod      : PageRefGen;
var menu            : MenuAchats;
let esb             : EsbFunctions;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);    
    pageGencod      = new PageRefGen(page);
    esb             = new EsbFunctions(fonction);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

const sCodeArticle  = fonction.getInitParam('codeArticle', '5300');

//------------------------------------------------------------------------------------

/**
 * 
 * @param iGencod Code Emballage à tester
 * @returns Un Gencod qui n'a pas déjà été défini
 */
var createGencod = async function(iGencod:number, page:Page) {

    log.set('Gencod : ' + iGencod.toString());

    await pageGencod.pButtonVider.click();

    var oData:AutoComplete = {
        libelle         :'ARTICLE',
        inputLocator    : pageGencod.pInputArticle,
        inputValue      : sCodeArticle,
        choiceSelector  :'li.gfit-autocomplete-result',
        choicePosition  : 0,
        typingDelay     : 100,
        waitBefore      : 1000,
        page            : page,
    };
    var sLibelleArticle = await fonction.autoComplete(oData);

    log.set('Article : ' + sLibelleArticle);

    await fonction.sendKeys(pageGencod.pInputGencod, iGencod);

    await fonction.clickAndWait(pageGencod.pButtonCreer, page);

    // Si le message d'avertissement indiquant que le format EAN s'affiche, on click sur le bouton "Oui"
    var bIsVisible = await pageGencod.pWarning.isVisible();

    if (bIsVisible) {
        await fonction.clickAndWait(pageGencod.pLinkOui, page);
    }

    // Si le message indiquant que l'EAN existe déjà, on incrémente le code EAN et on retente sa chance...
    bIsVisible = await pageGencod.pDataGridErreur.isVisible();

    if (bIsVisible) {
        createGencod(iGencod + 1, page);
    } else {
        return iGencod;
    }

}

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });
  
    test.describe('Page [REFERENTIEL]', async() => {

        var pageName = 'referentiel';
        var iGencod  = fonction.getLocalConfig('gencod');

        test('ListBox [RAYON] = "Fruits et légumes"', async() => {
            await menu.selectRayonByName('Fruits et légumes', page);
        })

        test("Menu [REFERENTIEL] - Click ", async () => {
           await menu.click(pageName, page);
        })

       test.describe ('Onglet [GENCODS]', async() => {

            test ('Onglet [GENCODS] - Click', async () => {
                await menu.clickOnglet(pageName, 'gencods',page);                
            })   

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            test ('Button [CREER] - Click', async () => {
                await fonction.clickElement(pageGencod.buttonCreer);
            })

            test.describe ('Popin [CREATION D\'UN GENCOD]', async() => {

                test('Popin [CREATION D\'UN GENCOD] - Is Visible', async () =>  {
                  await fonction.popinVisible(page, 'CREATION D\'UN GENCOD', true);
                })

                test ('** Traitement **', async () => {
                   await createGencod(iGencod, page);
                })

                test('Popin [CREATION D\'UN EMBALLAGE] - Is Hidden', async () =>  {
                  await fonction.popinVisible(page, 'CREATION D\'UN GENCOD', false);
                })

            })  // End Popin

       })  // End  Onglet

    })  // End  Page

    test('Déconnexion', async () => {
      await fonction.deconnexion(page);
    });

    test('** CHECK FLUX **', async () => {

        var oFlux = { 
            "FLUX" : [
                {
                    NOM_FLUX    : "EnvoyerGencod_Mag",
                    TITRE       : /Envoyer gencod {iGencod} sur article*/
                }, 
                {
                    NOM_FLUX    : "EnvoyerGencod_Stock",
                    TITRE       : /Envoyer gencod {iGencod} sur article*/
                },                     
                {
                    NOM_FLUX    : "EnvoyerGencod_Pricing",
                    TITRE       : /Envoyer gencod {iGencod} sur article*/
                },                     
                {
                    NOM_FLUX    : "EnvoyerGencod_Axelor",
                    TITRE       : /Envoyer gencod {iGencod} sur article*/
                },                     
                {
                    NOM_FLUX    : "EnvoyerGencod_Qualite",
                    TITRE       : /Envoyer gencod {iGencod} sur article*/
                },                     
            ],
            WAIT_BEFORE  : 10000,               
            VERBOSE_MOD  : false
        };

        await esb.checkFlux(oFlux, page);

    })

})  // End describe