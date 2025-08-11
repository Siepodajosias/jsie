/**
 * 
 * @author JC CALVIERA
 * @since 2024-02-28
 * 
 */
const xRefTest      = "ACH_TSP_MOD";
const xDescription  = "Modifier une unité de Transport";
const xIdTest       =  1757;
const xVersion      = "3.2";

var info = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Successeur de [ACH_TSP_ADD] et précurseur de [ACH_TSP_SUP]'],
    params      : [],
    fileName    : __filename
};

import { test, type Page, expect}   from '@playwright/test';

import { Help }             from '@helpers/helpers';
import { TestFunctions }    from '@helpers/functions';
import { Log }              from '@helpers/log';

import { MenuAchats }       from '@pom/ACH/menu.page';
import { PageRefUniTrp }    from '@pom/ACH/referentiel_unites-transport.page';

//------------------------------------------------------------------------------------

let page                    : Page;
 
var pageref                 : PageRefUniTrp;
var menu                    : MenuAchats;

const log                   = new Log();
const fonction              = new TestFunctions(log);

const sNomUnite:string      = 'TEST-AUTO_UniteTransport-' + fonction.getToday();
const sNomUniteMod:string   = sNomUnite + '_Updated';
const rVolume:number        = 8.88;
const rVolumeMod:number     = 7.77;
const sNomUniteCapitalized  = sNomUnite.charAt(0).toUpperCase() + sNomUnite.slice(1).toLowerCase();

fonction.importJdd();

var oData = {
    sUniteTransport : null
}

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage();
    menu        = new MenuAchats(page, fonction);    
    pageref     = new PageRefUniTrp(page);
    const helper= new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async ({}, testInfo) => {
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
            })

            test ('Button [MODIFIER UNE UNITE DE TRANSPORT] - Click #1', async () => {
                await fonction.clickElement(pageref.buttonModifierUniteTransport);
            })

            const sNomPopin:string = "Création d'une unité de transport";
            test.describe ('Popin ' + sNomPopin.toUpperCase() + '] - Appel #1', async() => {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () =>  {
                  await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
                })
                
                test('Message [ERREUR] - Is Not Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);                           // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
                })

                test ('InputField [NOM] = "' + sNomUniteMod + '"', async () => {
                    await fonction.sendKeys(pageref.pPinputAddNom, sNomUniteMod, false, "Nom Unité");
                    log.set('Transformation du nom "' + sNomUnite + '" en "' + sNomUniteMod + '"');
                })

                test ('InputField [VOLUME] = "' + rVolumeMod + '"', async () => {
                    await fonction.sendKeys(pageref.pPinputAddVolume, rVolumeMod, false, "Volume");
                    log.set('Transformation du volume "' + rVolume + '" en "' + rVolumeMod + '"');
                })

                test ('Button [OK] - Click', async () => {
                    await fonction.clickElement(pageref.pPbuttonAddOk);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () =>  {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), false, 3000);
                })

            })  // End Popin

            test ('Button [MODIFIER UNE UNITE DE TRANSPORT] - Click #2', async () => {
                await fonction.clickElement(pageref.buttonModifierUniteTransport);
            })

            test.describe ('Popin ' + sNomPopin.toUpperCase() + '] - Appel #2', async() => {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () =>  {
                  await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
                })
                
                test('Message [ERREUR] - Is Not Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);                           // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
                })

                test ('InputField [NOM] = "' + sNomUnite + '"', async () => {
                    await fonction.sendKeys(pageref.pPinputAddNom, sNomUnite, false, 'Nom Modifié');
                    oData.sUniteTransport = sNomUnite;
                    log.set('Transformation du nom "' + sNomUniteMod + '" en "' + sNomUnite + '"');
                })

                test ('InputField [VOLUME] = "' + rVolume + '"', async () => {
                    await fonction.sendKeys(pageref.pPinputAddVolume, rVolume, false, 'Volume Modifié');
                    log.set('Transformation du volume "' + rVolumeMod + '" en "' + rVolume + '"');
                })

                test ('Button [OK] - Click', async () => {
                    await fonction.clickElement(pageref.pPbuttonAddOk);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () =>  {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), false, 3000);
                })

            })  // End Popin

            test ('CheckBox [UNITE TRANSPORT][?] = "' + sNomUniteCapitalized + '"', async () => {
                await expect(pageref.dataGridListeNomsUnites.filter({hasText:sNomUniteCapitalized})).toBeVisible();
            })
       })  // End  Onglet

       await fonction.writeData(oData);
    })  // End  Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})  // End describe