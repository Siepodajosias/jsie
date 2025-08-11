/**
 * 
 * @author SIAKA KONE
 * @since 2023-11-13
 * 
 */
const xRefTest      = "STO_MVT_STO";
const xDescription  = "Afficher les mouvements de stock";
const xIdTest       =  1953;
const xVersion      = '3.7';

var info = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,    
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['nombreColis','plateforme','listeArticles','numLot'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page, expect }  from '@playwright/test';
import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';

import { MenuStock }                from '@pom/STO/menu.page'; 
import { StockSituation }           from '@pom/STO/stock-situation-palettes.page';

//------------------------------------------------------------------------------------
let page            : Page;
let menu            : MenuStock;
let pageMvtStock    : StockSituation;
//------------------------------------------------------------------------------------
const log           = new Log();
const fonction      = new TestFunctions(log);

 //Données chargées
 var oData:any           =  fonction.importJdd();

const sNbColis      = fonction.getInitParam('nombreColis','85');
const sPlateforme   = fonction.getInitParam('plateforme','Chaponnay');
const sCodeArticle  = fonction.getInitParam('listeArticles','5254');
var sNumeroLot      = fonction.getInitParam('numLot','0904');
//------------------------------------------------------------------------------------

if (oData !== undefined) {
    var sNumLotE2E  = oData.aLots[sCodeArticle];  
    sNumeroLot      = sNumLotE2E;                            // Récupération du numero du lot                     
    log.set('E2E - Numéro du lot : ' + sNumeroLot);
    log.set('Code Article : ' + sCodeArticle); 
}

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuStock(page, fonction);
    pageMvtStock    = new StockSituation(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']' , () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [STOCK]', async () => {   
        
        test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {            
            await menu.selectPlateforrme(page, sPlateforme);                     // Sélection d'une plateforme par défaut
        });

        var currentPage:string = 'stock';
        test ('Page [RECEPTION] - Click', async () => {
            await menu.click(currentPage, page);
        });    

        test.describe('Onglet [SITUATION DE STOCK]', async () => {        

            test('Inputield [NUMERO LOT] = "' + sNumeroLot + '"', async () => {                                
                await fonction.sendKeys(pageMvtStock.inputAll.nth(5), sNumeroLot);
            });

            test('Button [RECHERCHER] - Click', async () => {
                await fonction.clickAndWait(pageMvtStock.buttonRechercherLot, page);
            });

            test('Check quantité', async () => {
                var sNbrColis:string = await pageMvtStock.tdQuantiteLot.textContent();
                expect(sNbrColis).toEqual(sNbColis); 
            });
        })  //-- End Describe Onglet  

    }); //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

});   