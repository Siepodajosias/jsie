/**
 * 
 * @desc Créer un don
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 13 - 11 - 2023
 */

const xRefTest      = "STO_DON_IRC";
const xDescription  = "Imprimer un recap";
const xIdTest       =  1893;
const xVersion      = '3.2';

var info = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}   from '@playwright/test';

import { TestFunctions }    from "@helpers/functions";
import { Log }              from "@helpers/log";
import { Help }             from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }        from "@pom/STO/menu.page";
import { StockDons }        from "@pom/STO/stock-dons.page";

//----------------------------------------------------------------------------------------

let page        : Page;

let menu        : MenuStock;
let pageDon     : StockDons;

const log       = new Log();
const fonction  = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const plateforme  = process.env.PLATEFORME || 'Cremcentre';

//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page      = await browser.newPage(); 
    menu      = new MenuStock(page, fonction);
    pageDon   = new StockDons(page);
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        fonction.setTartTime(testInfo);
        await helper.init();
    });

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test('ListBox [PLATEFORME] = "' + plateforme + '"', async() => {            
        await menu.selectPlateforrme(page, plateforme);                       // Sélection d'une plateforme par défaut
    })

    test.describe('Page [STOCK]', async () => {    

        var currentPage  = 'stock';

        test('Page [STOCK] - Click', async () => {
            await menu.click(currentPage, page); 
        })

        test.describe('Onglet [DONS] >', async () => {        
            
            test('Onglet [DONS] - Click', async () => {
                await menu.clickOnglet(currentPage, 'dons', page);
            })

            test('Button [INPRIMER UN RECAPITULATIF] - Click', async () => {
                await fonction.clickAndWait(pageDon.buttonImprimerRecap, page, 40000);
            })

            var sNomPopin = 'IMPRIMER UN RECAPITULATIF';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>  {            

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible - Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })     
                
                test ('ListBox [BENEFICIARE][rnd] - Click', async () =>  {
                    var iNbChoix = await pageDon.pPlistBoxBenefImpRecap.locator('option').count();
                    var rnd = Math.floor(fonction.random() * iNbChoix);
                    var sChoix = await pageDon.pPlistBoxBenefImpRecap.locator('option').nth(rnd).textContent();
                    if(sChoix){
                        log.set('Bénéficiare : ' + sChoix);
                        await fonction.listBoxByLabel(pageDon.pPlistBoxBenefImpRecap, sChoix, page);
                    }
                })                          

                test('DatePeacker [MOIS DON][Janvier] - Click', async () =>  {
                    await pageDon.pPDatePeackerImprimerRecap.click();
                    await pageDon.pPmonthImprimerRecap.first().click();
                }) 

                test('Button [IMPRIMER] - Click', async () => {
                    await fonction.clickElement(pageDon.pPbuttonImprimerRecap);
                })

                test('Link [ANNULER] - Click Conditionnel', async () => {
                    if (await pageDon.pLinkAnnulerImprimerRecap.isVisible()){
                        await pageDon.pLinkAnnulerImprimerRecap.click();
                    }else {
                        console.log('Link [ANNULER] - Click');
                        test.skip();
                    }
                })
                
                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible -Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })     

            })    

        }) //-- End Describe Onglet 

    }) //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})