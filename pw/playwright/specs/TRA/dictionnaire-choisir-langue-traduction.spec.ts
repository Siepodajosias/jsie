/**
 * 
 * @author JOSIAS SIE
 * @since 2025-01-06
 */
const xRefTest      = "TRA_DIC_TDP";
const xDescription  = "Traduction des Données de la Page";
const xIdTest       =  7245;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc    : xDescription,
    appli   : 'TRADUCTION',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : [],
    params  : [],
    fileName: __filename
}

//------------------------------ MODULES A IMPORTER ---------------------------------------//  

import { test, type Page }from '@playwright/test';
import { CartoucheInfo}   from '@commun/types';

import { Help }           from '@helpers/helpers';
import { TestFunctions }  from '@helpers/functions';
import { Log }            from '@helpers/log';

import { MenuTraduction } from '@pom/TRA/menu.page';

//-----------------------------------------------------------------------------------------//

let page                : Page;
let menu                : MenuTraduction;

const log               = new Log();
const fonction          = new TestFunctions(log);

//-----------------------------------------------------------------------------------------//

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();    
    menu                = new MenuTraduction(page, fonction);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async({}, testInfo) => {
    await fonction.close(testInfo);
})

//---------------------------------------------------------------------------------------//

test.describe.serial ('[' + xRefTest + '] - ' + xDescription.toUpperCase() + ' :', () => {

    test('Ouverture URL :' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () =>  {
        await fonction.connexion(page);
    })

    test.describe ('Page [ACCUEIL]', async () => {

        var sNomCasdeTest:string = 'Traduction des données en Italien';
        test.describe ('[' + sNomCasdeTest.toUpperCase() + ']', async () => {

            test('ListBox [TRADUCTION EN ITALIEN] - Click', async () => {
                await menu.traductionItalien(page);
            })
        })
    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})