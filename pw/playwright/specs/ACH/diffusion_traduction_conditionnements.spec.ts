/**
 * 
 * 
 * @author JC CALVIERA
 * @since 2023-11-03
 * 
 */

const xRefTest      = "ACH_DIF_TCO";
const xDescription  = "Diffuser les Traductions des Conditionnements";
const xIdTest       =  2100;
const xVersion      = '3.3';

var info:CartoucheInfo = {
    desc    : xDescription,
    appli   : 'ACH',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : [],
    params  : [],
    fileName: __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }  from '@playwright/test';

import { Help }             from '@helpers/helpers';
import { TestFunctions }    from '@helpers/functions';
import { Log }              from '@helpers/log';
import { EsbFunctions }     from '@helpers/esb'

import { MenuAchats }       from '@pom/ACH/menu.page';
import { PageAdmDif }       from '@pom/ACH/admin_diffusion.page';

import { CartoucheInfo, TypeEsb } from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;
let esb             : EsbFunctions;

let pageAdm         : PageAdmDif;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    esb             = new EsbFunctions(fonction);
    pageAdm         = new PageAdmDif(page);
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

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

    test.describe('Page [ADMIN]', () => {

        var sPageName = 'admin';

        test('Page [ADMIN] - Click', async () => {
            await menu.click(sPageName, page); 
        })
       
        test ('Error Message - Is Hidden', async () =>  {
            await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
        })

        test.describe('Onglet [DIFFUSION]', async () =>  {

            test ('Onglet [DIFFUSION] - Click', async () =>  {
                await menu.clickOnglet(sPageName, 'diffusion', page);
            })   

            test ('Error Message - Is Hidden', async () =>  {
                await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
            })

            test ('Button [DIFFUSER TOUS LES CONDITIONNEMENTS] - Click', async () =>  {
                await pageAdm.buttonDifTradCond.click();
            })

        })  // End Describe Onglet

    })  // End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

    test.describe('Check Flux', async () => {   

        test('** CHECK FLUX **', async () =>  {

            const oFlux:TypeEsb = { 
                            FLUX : [
                                {
                                    NOM_FLUX    : "EnvoyerCaracteristique_Trad",
                                    TITRE       : 'Caractéristique : Conditionnement%'
                                }
                            ],
                            WAIT_BEFORE     : 125000,                 // Optionnel
                            VERBOSE_MOD     : false,                  // Optionnel car écrasé globalement
                            STOP_ON_FAILURE : true
            };

            await esb.checkFlux(oFlux, page);

        })

    })

})