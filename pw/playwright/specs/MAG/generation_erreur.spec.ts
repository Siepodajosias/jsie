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
const xVersion      = '3.3';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAG',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }  from '@playwright/test';

import { Help }             from '@helpers/helpers';
import { TestFunctions }    from '@helpers/functions';
import { Log }              from '@helpers/log';

import { MenuMagasin }      from '@pom/MAG/menu.page';
import { StockStock }       from '@pom/MAG/stock-stock.page';

import { CartoucheInfo }    from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuMagasin;
let log             : Log;

let pageStock       : StockStock
var villeCible      = 'Malemort (G914)';       // Données propre uniquement à ce script

var fonction        = new TestFunctions(log);

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuMagasin(page, fonction);
    log             = new Log();

    pageStock       = new StockStock(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACCUEIL]', async () => {

        test ('Link [FERMER] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            await menu.pPopinAlerteSanitaire.isVisible().then(async (isVisible) => {
                if(isVisible){
                    await menu.removeArlerteMessage(page);
                }
            })
        })
    })

    test.describe('Page [STOCK]', () => {

        var pageName = 'stock';

        test ('Page [STOCK] - Click', async () => {
            await menu.click(pageName, page); 
        })
       
        test ('ListBox [VILLE] = "' + villeCible + '"', async() =>{
            await menu.selectVille(villeCible, page);
        })

        test ('Label [ERROR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);                       //<<<<<<<<<<<<<<<<<<<<< Pas d'erreur attendue à ce niveau !!!
        })
        
        test ('Onglet [STOCK] - Click', async () => {
            await menu.clickOnglet(pageName, 'stock', page);
        })
        
        test.describe('Onglet [STOCK]', () => {

            test ('ListBox [GROUPE ARTICLE / ZONE] = "Fruits et légumes"', async () => {
                await fonction.selectOption(pageStock.listBoxGroupeArticle, 'Fruits et légumes');
            })

            test ('** Wait Until Spinner Off **', async () => {
                await fonction.waitForSpinner(pageStock.spinner);
            })

            test ('Button [ANNULER INVENTAIRE] - Click Optionnel', async () => {
                const isButtonAnnulerInventaireEnnabled = await pageStock.buttonAnnulerInventaire.isEnabled();
                if(isButtonAnnulerInventaireEnnabled){
                    await fonction.clickElement(pageStock.buttonAnnulerInventaire);
                    await fonction.clickElement(pageStock.pPbuttonOk);
                } else {
                    log.set('Le bouton [ANNULER INVENTAIRE] n\'est pas activé');
                    test.skip();
                }
            })

            test ('Button [DEMARRER L\'INVENTAIRE] - Click Optionnel', async () => {
                const isButtonDemarrerInventaireEnabled = await pageStock.buttonDemarrerInventaire.isEnabled();
                // Si le bouton n'est pas actif, on le rend actif afin qu'il soit cliquable.                   
                if (isButtonDemarrerInventaireEnabled === false){
                    await fonction.clickElement(pageStock.buttonDemarrerInventaire); 
                    await fonction.clickElement(pageStock.popinButtonDemarrer);                         
                } else {
                    log.set('Le bouton [DEMARRER L\'INVENTAIRE] n\'est pas activé');
                    test.skip();
                }
            })

            test ('Button [VALIDER L\'INVENTAIRE] - Click', async () => {
                await fonction.clickAndWait(pageStock.buttonValiderInventaire, page);               
            })

            test ('Label [ERROR] - Is Visible', async () => {                        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Erreur attendue à ce niveau !!!   
                await fonction.isErrorDisplayed(true, page);           
            })   
            
        })  // End Describe

    })  // End Describe

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})