/**
 * 
 * @author JC CALVIERA
 * @since 2024-02-23
 * 
 */
const xRefTest      = "ACH_FRA_***";
const xDescription  = "Créer des exceptions aux frais de structure";
const xIdTest       =  0.0; // Cf. Bloc "Références Dynamiques"
const xVersion      = "3.1";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Préccurseur de [ACH_FRA_UPD]'],
    params      : ['rayon'],
    fileName    : __filename
};

import { test, type Page}   from '@playwright/test';

import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { Log }              from '@helpers/log.js';

import { MenuAchats }       from '@pom/ACH/menu.page.js';
import { PageRefFrais }     from '@pom/ACH/referentiel_frais.page';

import { AutoComplete, CartoucheInfo }     from '@commun/types';

//------------------------------------------------------------------------------------

let page                    : Page;
 
var pageFrais               : PageRefFrais;
var menu                    : MenuAchats;

const log                   = new Log();
const fonction              = new TestFunctions(log);

const rMontant:number       = 8888.8888;
const sCaracteres:string    = 'abcdefghijlmnoprstuv0123456789';
const sLettre:string        = fonction.getRandomLetter(sCaracteres);

const sRayon                = fonction.getInitParam('RAYON', 'Fruits et légumes');  // ("Fruits et légumes" OU "Poissonnerie" uniquement)

//--- Références Dynamiques ----------------------------------------------------------

const aInfosTests       = {
    'Poissonnerie'  : {
        'xRefTest'      : 'ACH_FRA_APO',
        'xDescription'  : 'Créer des exceptions aux frais de structure Poissonnerie',
        'xIdTest'       : 9173
    },
    'Fruits et légumes': {
        'xRefTest'      : 'ACH_FRA_AFL',
        'xDescription'  : 'Créer des exceptions aux frais de structure FL',
        'xIdTest'       : 2630
    },                
};

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {

    page        = await browser.newPage();
    menu        = new MenuAchats(page, fonction);    
    pageFrais   = new PageRefFrais(page);
    const helper= new Help(info, testInfo, page);
    await helper.init();

    //-- Modification à la volée des informations du test
    if (aInfosTests[sRayon] !== undefined) {
        info.refTest = aInfosTests[sRayon]['xRefTest'];
        info.desc = aInfosTests[sRayon]['xDescription'];
        info.idTest = aInfosTests[sRayon]['xIdTest'];
    } else {
        throw new Error('Ooops : Le paramètre RAYON passé en argument est inconnu !');
    }

})
 
test.afterAll(async({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

   test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
    await context.clearCookies();
       await fonction.openUrl(page);
   });

   test ('Connexion', async() => {
       await fonction.connexion(page);
   })
  
    test.describe ('Page [REFERENTIEL]', async() => {

       var pageName = 'referentiel';

       test ('ListBox [RAYON] = "' + sRayon + '"', async() => {
            await menu.selectRayonByName(sRayon, page);
        });

       test("Menu [REFERENTIEL] - Click ", async () => {
           await menu.click(pageName, page);
       })

       test.describe ('Onglet [FRAIS]', async() => {

            test ('Onglet [FRAIS] - Click', async () => {
                await menu.clickOnglet(pageName, 'frais',page);                
            })   

            test ('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            test ('Button [CREER UNE EXCEPTION POUR STRUCTURE] - Click', async () => {
                await fonction.clickElement(pageFrais.buttonExceptionStructureAdd);
            })

            const sNomPopin = "Ajout d'un frais de structure";
            test.describe ('Popin ' + sNomPopin.toUpperCase() + ']', async() => {

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () =>  {
                  await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
                })

                test ('AutoComplete [ARTICLE] = "rnd"', async () => {
                    var oData:AutoComplete = {
                        libelle         :'ARTICLE',
                        inputLocator    : pageFrais.pPajoutFraisStrucInputArticle,
                        inputValue      : sLettre,
                        choiceSelector  :'li.gfit-autocomplete-result',
                        choicePosition  : 1,
                        typingDelay     : 100,
                        waitBefore      : 500,
                        page            : page,
                    };
                    const sArticleSelectionne = await fonction.autoComplete(oData);
                    log.set('Lettre Injectée : ' + sLettre);
                    log.set('Article sélectionné : ' + sArticleSelectionne);
                })

                test ('Input [FRAIS DE STRUCTURE] = "' + rMontant.toString() + '"', async () => {
                    await fonction.sendKeys(pageFrais.pPajoutFraisStrucInputMontant, rMontant.toString());
                    log.set("Frais de structure : " + rMontant.toString());
                })

                test ('ListBox [PLATEFORME DE RECEPTION][rnd]  - Select', async () => {
                    const iNbChoix = await pageFrais.pPajoutFraisStrucListBoxPtf.locator('option').count();
                    const iPosChoix = Math.floor(fonction.random() * (iNbChoix - 1)) + 1;
                    const sLibelleChoix = await pageFrais.pPajoutFraisStrucListBoxPtf.locator('option').nth(iPosChoix).textContent();
                    log.set('Plateforme Sélectionnée : ' + sLibelleChoix);
                    await pageFrais.pPajoutFraisStrucListBoxPtf.selectOption(sLibelleChoix);
                })

                test ('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickElement(pageFrais.pPajoutFraisStrucButtonEnreg);
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () =>  {
                  await fonction.popinVisible(page, sNomPopin.toUpperCase(), false);
                })

            })  // End Popin

       })  // End  Onglet

    })  // End  Page

    test ('Déconnexion', async () => {
      await fonction.deconnexion(page);
    });

})  // End describe