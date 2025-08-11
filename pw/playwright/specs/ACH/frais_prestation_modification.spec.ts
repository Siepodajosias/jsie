/**
 * 
 * @author JC CALVIERA
 * @since 2024-02-27
 * 
 */
const xRefTest      = "ACH_AFP_UPD";
const xDescription  = "Modifier des Frais de prestation à part";
const xIdTest       =  7564;
const xVersion      = "3.2";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Successeur de [ACH_AFP_ADD]'],
    params      : ['plateforme', 'rayon'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page}   from '@playwright/test';

import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { Log }              from '@helpers/log.js';
import { EsbFunctions }     from '@helpers/esb'

import { MenuAchats }       from '@pom/ACH/menu.page.js';
import { PageAchFraiFac }   from '@pom/ACH/achats_frais-factures-a-part.page';

import { CartoucheInfo, TypeEsb } from '@commun/types';

//------------------------------------------------------------------------------------

let page                    : Page;
 
var pageFrais               : PageAchFraiFac;
var menu                    : MenuAchats;
let esb                     : EsbFunctions;

const log                   = new Log();
const fonction              = new TestFunctions(log);

const sRayon:string         = fonction.getInitParam('RAYON', 'Fruits et légumes');

const rMontant:number       = 7.777;
const sNumFacture:string    = 'TA_FraisPresta_' + fonction.getToday();

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }) => {
    page        = await browser.newPage();
    menu        = new MenuAchats(page, fonction);    
    pageFrais   = new PageAchFraiFac(page);
    esb         = new EsbFunctions(fonction);
})
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

   test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper    = new Help(info, testInfo, page);
        fonction.setTartTime(testInfo);
        await helper.init();
   });

   test('Ouverture URL : ' + fonction.getApplicationUrl(), async () => {
       await fonction.openUrl(page);
   });

   test('Connexion', async() => {
       await fonction.connexion(page);
   })
  
    test.describe('Page [ACHATS]', async() => {

       var pageName:string      = 'achats';

       test('ListBox [RAYON] = "' + sRayon + '"', async() => {
            await menu.selectRayonByName(sRayon, page);
        });

       test("Menu [ACHATS] - Click ", async () => {
           await menu.click(pageName, page);
       })

       test.describe('Onglet [FRAIS FACTURES A PART]', async() => {

            test ('Onglet [FRAIS FACTURES A PART] - Click', async () => {
                await menu.clickOnglet(pageName, 'fraisFactures',page);                
            })   

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            test ('Button [RECHERCHER] - Click', async () => {
                await fonction.clickAndWait(pageFrais.buttonRechercher, page);
            })

            test ('Header [NUM ACHAT] - Click x 2', async () => {
                await fonction.clickElement(pageFrais.thHeaderNumAchat);
                await fonction.clickElement(pageFrais.thHeaderNumAchat);
            })

            test ('InputField [FILTRE BL] = "' + sNumFacture + '"', async () => {
                await fonction.sendKeys(pageFrais.inputFiltreBL, sNumFacture);
                log.set('Numéro BL : ' + sNumFacture);
            })

            test ('Liste [FRAIS][0] - Click', async () => {
                await fonction.clickElement(pageFrais.trLignesFrais.first());
                const sNumAchat:string = await pageFrais.trLignesFrais.first().locator('td').first().textContent();
                log.set('Numero achat : ' + sNumAchat);
            })

            test ('Button [MODIFIER DES FRAIS] - Click', async () => {
                await fonction.clickAndWait(pageFrais.buttonModifierDesFrais, page);
            })

            const sNomPopin:string = "Modification d'un achat de prestation";
            test.describe ('Popin ' + sNomPopin.toUpperCase() + ']', async() => {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () =>  {
                  await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
                })
                
                test('Message [ERREUR] - Is Not Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);                           // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
                })

                test ('Pictograme [MODIFIER] - Click', async () => {
                    await pageFrais.pPcreachaTdActions.first().hover({timeout:1000});     // Survol Souris (hover)
                    await fonction.clickAndWait(pageFrais.pPcreachaPictoModifier.first(), page);
                })

                test ('InputField [MONTANT] = "' + rMontant + '"', async () => {
                    await fonction.sendKeys(pageFrais.pPcreachaInputMontantModif, rMontant);
                    log.set('Nouveau Montant : ' + rMontant);
                })

                test ('Button [VALIDER] - Click', async () => {
                    await fonction.clickElement(pageFrais.pPcreachaButtonValider);
                })

                test ('Button [MODIFIER L\'ACHAT] - Click', async () => {
                    await fonction.clickAndWait(pageFrais.pPcreachaButtonCreerAchat, page);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () =>  {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), false, 3000);
                })

            })

       })  // End  Onglet

    })  // End  Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

    test.describe('Check Flux', async () => {   

        test('** CHECK FLUX **', async () =>  {

            const oFlux:TypeEsb = { 
                FLUX : [
                    {
                        NOM_FLUX    : 'EnvoyerAchat_Alusta',
                        TITRE       : 'Achat N°%'
                    }
                ],
                WAIT_BEFORE     : 3000,                     // Optionnel
                VERBOSE_MOD     : false,                    // Optionnel car écrasé globalement
            };

            await esb.checkFlux(oFlux, page);

        })

    })

})  // End describe