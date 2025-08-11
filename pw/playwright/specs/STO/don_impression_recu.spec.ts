/**
 * 
 * @desc Créer un don
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 13 - 11 - 2023
 */

const xRefTest      = "STO_DON_IRE";
const xDescription  = "Imprimer un reçu";
const xIdTest       =  1890;
const xVersion      = '3.2';

var info:CartoucheInfo = {
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

import { test, type Page}                from '@playwright/test';

import { TestFunctions }                 from "@helpers/functions";
import { Log }                           from "@helpers/log";
import { Help }                          from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                     from "@pom/STO/menu.page";
import { StockDons }                     from "@pom/STO/stock-dons.page";
import { CartoucheInfo }                 from '@commun/types';

//----------------------------------------------------------------------------------------

let page        : Page;

let menu        : MenuStock;
let pageDon     : StockDons;

const log       = new Log();
const fonction  = new TestFunctions(log);

//----------------------------------------------------------------------------------------
const plateforme  = fonction.getInitParam('plateforme','Cremcentre');
//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page      = await browser.newPage(); 

    menu      = new MenuStock(page, fonction);
    pageDon   = new StockDons(page);

    const helper        = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

test.describe.serial ('[' + xRefTest + '] - ' + xDescription + ' : ', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test('ListBox [PLATEFORME] = "' + plateforme + '"', async() => {            
        await menu.selectPlateforrme(page, plateforme);                       // Sélection d'une plateforme par défaut
    })

    test.describe('Page [STOCK]', async () => {    

        var currentPage:string  = 'stock';

        test('Page [STOCK] - Click', async () => {
            await menu.click(currentPage, page); 
        })

        test.describe('Onglet [DONS] >', async () => {        
            
            test('Onglet [DONS] - Click', async () => {
                await menu.clickOnglet(currentPage, 'dons', page);
            })

            test('Button [INPRIMER UN RECU] - Click', async () =>  {
                await fonction.clickAndWait(pageDon.buttonImprimerRecu, page, 40000);
            })
    
            var sNomPopin:string = 'IMPRIMER UN RECU';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>  {            
    
                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible -Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })      
                
                test('ListBox [BENEFICIARE][rnd] - Click', async () =>  {
                    var iNbChoix = await pageDon.pPlistBoxBenefImpRecu.locator('option').count()
                    var rnd = Math.floor(fonction.random() * iNbChoix);
                    var sChoix = await pageDon.pPlistBoxBenefImpRecu.locator('option').nth(rnd).textContent()
                    if (sChoix){
                        log.set('Bénéficiare : ' + sChoix);
                        await fonction.listBoxByLabel(pageDon.pPlistBoxBenefImpRecu, sChoix, page)
                    }
                })                          
                
                test('DatePeacker [MOIS DON][Janvier] - Click', async () =>  {
    
                    var verifie = false
    
                    await fonction.clickElement(pageDon.pPDatePeackerImprimerRecu);
                    while (!verifie){
                        await fonction.clickElement(pageDon.pDatePeackerButtonPrev);
                        var mois  = await pageDon.pDatePeackerSwitchLabel.textContent();
                        if(mois?.match('Janvier')){
                            verifie = true
                        }
                    }
                    if(verifie){
                        await fonction.clickElement(pageDon.pDatePeackerLabelDays.nth(0));
                    }
                }) 
    
                test('Button [IMPRIMER] - Click', async () => {
                    await fonction.clickElement(pageDon.pPbuttonImprimerRecu);
                })
    
                test('Link [ANNULER] - Click Conditionnel', async () => {
                    if (await pageDon.pPlinkAnnulerImprimerRecu.isVisible()){
                        await fonction.clickElement(pageDon.pPlinkAnnulerImprimerRecu);
                    }else {
                        console.log('Link [ANNULER] - Click: ANNULER');
                        test.skip();
                    }
                })
                
                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible -Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })                          
            })
        })//-- End Describe Onglet    
    }) //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
})
