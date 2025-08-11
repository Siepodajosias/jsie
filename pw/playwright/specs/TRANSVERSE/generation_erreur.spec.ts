/**
 * 
 * PREPARATION APPLICATION > CONNEXION
 * 
 * @author Vazoumana Diarrassouba
 * @since 2023/10/11
 * 
 */

const xRefTest      = "MAG_STK_ERR";
const xDescription  = "Déclenche une erreur et s'assure que celle-ci est bien détectée";
const xIdTest       =  1123;
const xVersion      = '3.1';

var info = {
    desc    : xDescription,
    appli   : 'MAG',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : [],
    params  : [],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page, expect }  from '@playwright/test';

//-- Helpers

import { Help }             from '../../utils/helpers';
import { TestFunctions }    from '../../utils/functions.js';
import { Log }              from '../../utils/log';

import { MenuMagasin }      from '../../pages/MAG/menu.page';

//-- Pages Objects

import { StockStock }       from '../../pages/MAG/stock-stock.page';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuMagasin;
let log             : Log;

let pageStock       : StockStock
var villeCible      = 'Malemort (G914)';       // Donnée propre uniquement à ce script
const fonction      = new TestFunctions();

//------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {

    page            = await browser.newPage();
    menu            = new MenuMagasin(page);
    log             = new Log();

    pageStock       = new StockStock(page)
});

//------------------------------------------------------------------------------------

test.describe ('[' + xRefTest + ']', () => {

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

    test.describe('Page [ACCUEIL]', async () => {

        test('Link [FERMER] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            menu.pPopinAlerteSanitaire.isVisible().then(async (isVisible) => {
                if(isVisible){
                    console.log('MESSAGE D\'ALERTE SANITAIRE - Click')
                    await menu.removeArlerteMessage(page);
                }else{
                    console.log('AUCUN MESSAGE D\'ALERTE DETECTE')
                }
            })
        })
    })

    test.describe('Page [STOCK]', () => {

        var pageName = 'stock';

        test('Page [STOCK] - Click', async () => {
            await menu.click(pageName, page); 
        })
       
        test('ListBox [VILLE] = "' + villeCible + '"', async() =>{
            await menu.selectVille(villeCible, page);
        })

        test('Label [ERROR] - Is Not Visible', async () => {
            fonction.isErrorDisplayed(false, page);                    //<<<<<<<<<<<<<<<<<<<<< Pas d'erreur attendue à ce niveau !!!
        })
        
        test('Onglet [STOCK] - Click', async () => {
            await menu.clickOnglet(pageName, 'stock', page);
        })

        test('Validation prématurée de l\'inventaire', async () => {
            pageStock.buttonValiderInventaire.isEnabled().then(async (enabled) =>{                    
                if (enabled == false){
                    await pageStock.buttonDemarrerInventaire.click(); 
                    await pageStock.popinButtonDemarrer.click();                         
                }
            })
            await pageStock.buttonValiderInventaire.click();                   
        })

        test('Label [ERROR] - Is Visible', async () => {                //<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Erreur attendu à ce niveau !!!   
            fonction.isErrorDisplayed(true, page);           
        })                       

    })  // End Describe

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})