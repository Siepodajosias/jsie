/**
 * 
 * @author JC CALVIERA
 * @since 2024-03-13
 * 
 */
const xRefTest      = "ACH_GLD_ADD";
const xDescription  = "Créer un Groupe de livraison directe";
const xIdTest       =  1733;
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

import { test, type Page }  from '@playwright/test';

import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { Log }              from '@helpers/log.js';

import { MenuAchats }       from '@pom/ACH/menu.page.js';
import { PageAspGld }       from '@pom/ACH/achats-sur_place_groupes-livraison-directe.page';

import { CartoucheInfo }    from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
var pageAspLivDir   : PageAspGld;
var menu            : MenuAchats;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------

const sNomGroupe    = 'Ta_groupe-liv-directe_' + fonction.getToday('US') + '-' + fonction.getHMS();
var sNomRayon       = fonction.getInitParam('rayon', '');

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);    
    pageAspLivDir   = new PageAspGld(page);

    const helper    = new Help(info, testInfo, page);
    await helper.init();

    if (sNomRayon === '') {
        sNomRayon = fonction.getRandomArray(['Poissonnerie', 'Fruits et légumes', 'BCT'], true);       // Sélection d'un rayon au hasard
    }

})
 
test.afterAll(async({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async() => {
       await fonction.connexion(page);
    })
  
    test.describe('Page [ACHATS SUR PLACE]', async() => {

        var sPageName:string = 'achatsSurPlace';

        test('ListBox [RAYON] = "**Rayon**"', async() => {
            await menu.selectRayonByName(sNomRayon, page);
            log.set('Rayon : ' + sNomRayon);
        });

        test("Menu [ACHATS SUR PLACE] - Click ", async () => {
            await menu.click(sPageName, page);
        })

        test.describe ('Onglet [GROUPES DE LIVRAISON DIRECTE]', async() => {

            test ('Onglet [FRAIS FACTURES A PART] - Click', async () => {
                await menu.clickOnglet(sPageName, 'groupesLivraisonDirecte', page);                
            })  

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            var sNomPopin = "CREATION D'UN GROUPE DE LIVRAISON DIRECTE";
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

                test('Button [CREER UN GROUPE] - Click', async() => {
                    await fonction.clickElement(pageAspLivDir.buttonCreerGroupe);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () =>  {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
                })

                test('Message [ERREUR] - Is Not Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
                })

                test('InputField [DESIGNATION] = "**Nom groupe**"', async() => {
                    await fonction.sendKeys(pageAspLivDir.pPinputDesignation, sNomGroupe);
                    log.set('Désignation : ' + sNomGroupe);
                })

                test('Button [ENREGISTRER] - Click', async() => {
                    await fonction.clickAndWait(pageAspLivDir.pPbuttonEnregistrer, page);              
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is NOT Visible', async () =>  {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), false);
                })

            })

            test('Column [NOM DU GROUPE][**Nom groupe**] - Click', async() => {         
                await fonction.clickElement(pageAspLivDir.pPtdNomGroupe.locator('span:text-is("' + sNomGroupe + '")'));
            })

            test('Column [DESIGNATION MAGASIN][0] - Click', async() => {         
                await fonction.clickElement(pageAspLivDir.tdDesignationMagasins.first());
            })

            test('Button [ENREGISTRER] - Click', async() => { 
                await fonction.clickAndWait(pageAspLivDir.buttonEnregistrer, page);
            })

        })  // End  Onglet
      
    })  // End  Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})  // End describe