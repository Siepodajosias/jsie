/**
 * 
 * @author SIAKA KONE
 * @since 2024-12-20
 * 
 */

const xRefTest       = "QUA_PAR_LPL";
const xDescription   = "Lister les planifications";
const xIdTest        =  4623;
const xVersion       = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'QUALITE',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme','rayon'],
    fileName    : __filename
};

import {  test, type Page }                 from '@playwright/test';
import { CartoucheInfo }                    from '@commun/types';

import { Help }                  			from '@helpers/helpers';
import { TestFunctions }         			from '@helpers/functions';
import { Log }                   			from '@helpers/log';

import { MenuQualite }           			from '@pom/QUA/menu.page';
import { PlanificationArrivages }           from '@pom/QUA/planification-arrivages.page';

let page                					: Page;
let menu                					: MenuQualite;
let pagePlanification                       : PlanificationArrivages;

const log               					= new Log();
const fonction          					= new TestFunctions(log);

// Exploitation des paramètres passés en argument OU ceux présents dans le fichier de configuration Local

const sPlateforme                           = fonction.getInitParam('plateforme','Cremcentre');
const sRayon                                = fonction.getInitParam('rayon', 'Crèmerie');

test.beforeAll(async ({ browser }, testInfo) => {
    page            						= await browser.newPage();
    menu            						= new MenuQualite(page, fonction);
    pagePlanification                       = new PlanificationArrivages(page);
    const helper    						= new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

test.describe.serial ('[' + xRefTest + ']',  () =>  {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () =>  {
        await fonction.connexion(page);
    })

    var sNomPage:string = 'planification';

    test.describe ('Page [' + sNomPage.toUpperCase() + ']', async () => {

        test ('Menu [' + sNomPage.toUpperCase() + '] - Click', async () =>  {
            await menu.click(sNomPage, page);
        })
        
        test ('ListBox [RAYON] = "' + sRayon + '"', async () => {
            await menu.selectRayonByName(sRayon, page);
        })
        
        test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {//selectionner une plateforme
            await menu.selectPlateformeByName(sPlateforme, page);
        })

        test ('Button [RECHERCHER] - Click', async () => {
            await fonction.clickAndWait(pagePlanification.buttonRechercher, page);
        })  
        
        test ('Datagrid [SEMAINE PLANIFICATION] - Is Visible', async () => {
            await fonction.isDisplayed(pagePlanification.datagridPlanificationSemaine.first());  
        })  
        
    })

    test ('Déconnexion', async () =>  {
        await fonction.deconnexion(page);
    })

})