/**
 * 
 * @desc Créer un don
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 14 - 11 - 2023
 */

const xRefTest      = "STO_DON_SUP";
const xDescription  = "Supprimer un don et transformation en casse";
const xIdTest       =  1895;
const xVersion      = '3.7';

var info = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme', 'groupeArticle'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}        from '@playwright/test';

import { TestFunctions }                 from "@helpers/functions";
import { Log }                           from "@helpers/log";
import { Help }                          from '@helpers/helpers';

//-- PageObject --------------------------------------------------------------------------

import { MenuStock }                     from "@pom/STO/menu.page";
import { StockDons }                     from "@pom/STO/stock-dons.page";

//----------------------------------------------------------------------------------------

let page        : Page;

let menu        : MenuStock;
let pageDon     : StockDons;

let iNbDons     : number;

const log       = new Log();
const fonction  = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const sJddFile      = fonction.getLocalConfig('jddDons');
var oData           = fonction.readFile(sJddFile);        // Récupération du nom de la ventilation créée à l'étape précédente

//----------------------------------------------------------------------------------------
const plateforme    = fonction.getInitParam('plateforme','Cremcentre');
//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page    = await browser.newPage(); 

    menu    = new MenuStock(page, fonction);
    pageDon = new StockDons(page);

    iNbDons = 0;

});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    });

    test('Ouverture URL', async() => {
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

        test.describe('Onglet [DONS]', async () => {        
            
            test('Onglet [DONS] - Click', async () => {
                await menu.clickOnglet(currentPage, 'dons', page);
            })

            test('** Nb Dons AVANT Casse **', async () => {
                iNbDons = await pageDon.checkBoxListeDons.count();
                expect(iNbDons).toBeGreaterThan(0);   // Normalement, un don a été créé préalablement par le test STO_DON_CRE
                await fonction.clickElement(pageDon.tdListeNumeroLot.filter({hasText:oData.sNumLot}).nth(0));
                log.set('Numéro Lot Article Sélectionné : ' + oData.sNumLot);
                log.set('Nombre de dons avant casse : ' + iNbDons);
                await fonction.addDataSheet('InputField', 'Lot donné', oData.sNumLot);
            })

            test('Button [TRANSFORMER EN CASSE] - Click', async () =>  {
                if (iNbDons > 0){
                    await fonction.clickAndWait(pageDon.buttonTransformerEnCasse, page);
                } else{
                    console.log('Button [TRANSFORMER EN CASSE] - Click : ANNULEE');
                    test.skip();
                }
            })

            test('Toaster [OK] - Is Visible', async () =>  {
                if(iNbDons > 0){
                    await pageDon.toasterMessage.isVisible().then((visible) => {
                        expect(visible).toBe(true);
                    }) 
                }else {
                    console.log('Toaster [OK] - Is NOT Visible : les actions liées ont été annulées');
                    test.skip();
                }              
            }) 

            test('** Nb Dons APRES Casse **', async () => {
                //-- Si il n'y a qu'un don décéremtable, la datagrig n'affichera aucune ligne. Ne pose plus de problème à partir de 2 dons initialement présents
                if(iNbDons > 1){
                    await pageDon.checkBoxListeDons.first().waitFor();
                    var iNbChoix = await pageDon.checkBoxListeDons.count();
                    log.set('Nombre de dons après casse : ' + iNbChoix);
                    expect(iNbChoix).toBeLessThan(iNbDons);   // Normalement, un don a été créé décrémenté de la liste 
                }else {
                    log.set('Nombre de dons après casse : ' + 0);
                    test.skip();
                } 
            }) 

        })

    })  //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})