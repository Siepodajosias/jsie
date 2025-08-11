const xRefTest      = "xxx_xxx_xxx";
const xDescription  = "Do Nothing";
const xIdTest       =  0;
const xVersion      = '3.0';

var info = {
    desc    : xDescription,
    appli   : 'ACHATS',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : ['Script destiné à ne rien faire hormis charger les composants de base...'],
    params  : [],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }  from '@playwright/test';

import { Help }             from '@helpers/helpers';
import { TestFunctions }    from '@helpers/functions';
import { Log }              from '@helpers/log';
import { EsbFunctions }     from '@helpers/esb'
import { TypeEsb }          from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let esb                 : EsbFunctions;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    const helper    = new Help(info, testInfo, page);
    esb             = new EsbFunctions(fonction);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + '] - ' + xDescription , () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async() => {
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
        log.set('Foo : Bar');
    });

    test.describe.skip('Check Flux', async () => {   

        test('** CHECK FLUX **', async () =>  {

            var oFlux:TypeEsb = { 
                            FLUX : [
                                {
                                    NOM_FLUX    : "EnvoyerGencod_Stock",
                                    TITRE       : 'Envoyer gencod%'
                                }, 
                                {
                                    NOM_FLUX    : "EnvoyerGencod_Mag",
                                    TITRE       : 'Envoyer gencod%'
                                },
                                {
                                    NOM_FLUX    : "NoExists",
                                    TITRE       : 'No Exists'
                                },                                 
                            ],
                            WAIT_BEFORE     : 1000,                 // Optionnel
                            VERBOSE_MOD     : false,                // Optionnel car écrasé globalement
                            STOP_ON_FAILURE : false
            };

            await esb.checkFlux(oFlux, page);          

        })

    })

})