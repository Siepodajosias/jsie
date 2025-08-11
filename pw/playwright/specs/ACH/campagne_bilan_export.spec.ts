/**
 * @author JC CALVIERA
 * @since   2021-01-22
 * 
 */
const xRefTest      = "ACH_CAM_EXP";
const xDescription  = "Export du bilan d'une campagne";
const xIdTest       =  2627;
const xVersion      = '3.1';
 
var info = {
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

import { test, type Page, expect}   from '@playwright/test';
import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';

//-- PageObject ----------------------------------------------------------------------

import { MenuAchats }               from '@pom/ACH/menu.page'; 
import { PageAnaCmp }               from '@pom/ACH/analyse_campagne.page';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuAchats;
let pageCpgne           : PageAnaCmp;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page                = await browser.newPage();
    menu                = new MenuAchats(page, fonction);
    pageCpgne           = new PageAnaCmp(page); 
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------  

const sRayon          	= fonction.getInitParam('rayon', 'Fruits et légumes');

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', async () => {  
    
    test ('- Start -', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    });

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async () => {
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ANALYSE]', async () => {

        var sNomPage = 'analyse';
        var download:any;

        test ('ListBox [RAYON] = "' + sRayon + '"', async () => {                    
            await menu.selectRayonByName(sRayon, page);
        })

        test ('Page [ANALYSE] - Click', async() => {
            await menu.click(sNomPage, page, 60000);                
        })

        test ('Message [ERREUR] - Is NOT Visible', async() => {
            await fonction.isErrorDisplayed(false, page);                
        })

        test ('CheckBox [CAMPAGNE][0] - Click', async() => {
            await fonction.clickElement(pageCpgne.checkBoxListeCampagnes.first());                
        })

        test ('Button [TELECHARGE LE BILAN] - Click', async() => {
            [download] = await Promise.all([
                page.waitForEvent('download'),
                pageCpgne.buttonTelechargerBilan.click(),
            ]);
            await fonction.waitTillHTMLRendered(page);                
        })

        test ('Download File [EXTENSION] = "csv"', async () => {
            await fonction.downloadedFile(download,'csv', 100)
        })

    }) // end test.describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

}) 