/**
 * 
 * @author SIAKA KONE
 *  Since 2024-04-18
 */

const xRefTest      = "PRI_ADM_DIF";
const xDescription  = "Diffuser les Magasins";
const xIdTest       =  4841;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRI',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}       from '@playwright/test';

import { TestFunctions }        from "@helpers/functions";
import { Log }                  from "@helpers/log";
import { Help }                 from '@helpers/helpers';
import { EsbFunctions }         from '@helpers/esb';

import { MenuPricing }          from '@pom/PRI/menu.page.js';
import { AdministrationPage }   from '@pom/PRI/admin_administration.page';

import { CartoucheInfo, TypeEsb } from '@commun/types';

//----------------------------------------------------------------------------------------

let page        : Page;
let menuPage    : MenuPricing;
let esb         : EsbFunctions;

let pageAdmin   : AdministrationPage;

const log       = new Log();
const fonction  = new TestFunctions(log);

//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage(); 
    esb         = new EsbFunctions(fonction);
    menuPage    = new MenuPricing(page, fonction);
    pageAdmin   = new AdministrationPage(page);
    const helper = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//-----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ADMIN]',  () => {    

        test('Page [ADMIN] - Click', async () => {
            await menuPage.click('admin',page);
        });

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        });   

        test('Button [DIFFUSER LES ELEMENTS A TRADUIRE] - Click', async () => {
            await fonction.clickAndWait(pageAdmin.buttonDiffuserMagasins, page);
        }); 

        test('Wait [10000]', async () => {
            await fonction.wait(page, 10000);                   // Attente fin d'affichage d'un toaster parasite
        });


    })  //-- End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

    test.describe('Check Flux', async () => {   

        test('** CHECK FLUX **', async () =>  {

            const oFlux:TypeEsb = { 
                            FLUX : [
                                {
                                    NOM_FLUX    : "EnvoyerMagasin_Prefac"
                                },
                                
                                {
                                    NOM_FLUX    : "EnvoyerMagasin_Achat"
                                }  
                            ],
                            WAIT_BEFORE     : 30000,            // Optionnel
                            VERBOSE_MOD     : false             // Optionnel car écrasé globalement
            };

            await esb.checkFlux(oFlux, page);

        });

    });
})