const xRefTest      = "xxx_xxx_xxx";// PAS VALABLE
const xDescription  = "Essai de verification des flux";
const xIdTest       =  0;// PAS VALABLE
const xVersion      = '0';// PAS VALABLE

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

import { EsbFunctions }         from '../../utils/esb';
import{ test, type Page}        from '@playwright/test';
import { Help }                 from "../../utils/helpers";
import { Log }                      from "@helpers/log";
import { TestFunctions }        from "../../utils/functions";
import { TypeEsb } from '@commun/types';


// var fs  = require('fs');
// const { DateTime } = require('luxon');

let page     : Page
let esb      : EsbFunctions
let log       = new Log();
let fonction = new TestFunctions(log);
/**
 * 
 */
test.beforeAll(async ({ browser }) => {
    page          = await browser.newPage();
    esb           = new EsbFunctions(fonction)
});

test.describe('vérification de flux', async () => {
    
    test('-- Start --', async ({ page, context }, testInfo) => {
        await context.clearCookies();
        const helper      = new Help(info, testInfo, page);
        fonction.setTartTime(testInfo);
        await helper.init();
    });

    test('Essai', async () =>{
        var oFlux:TypeEsb   =  { 
            "FLUX" : [ 
                {
                    "NOM_FLUX"  : "Echange_MMV2_Sigale",
                     STOP_ON_FAILURE  : true
                }, 
                {
                    "NOM_FLUX"  : "EnvoyerArticle_Concu",
                    STOP_ON_FAILURE  : true
                },  
                {
                    "NOM_FLUX" : "EnvoyerOrdrePreparation_Prepa",
                     STOP_ON_FAILURE  : true
                },                                                               
            ],
            "WAIT_BEFORE"   : 500,                 // Optionnel

            START_TIME : 1699959000173
        };
        await esb.checkFlux(oFlux, page)
    })

    // var oFlux:TypeEsb   =  { 
    //     "FLUX" : [ 
    //         {
    //             "NOM_FLUX"  : "EnvoyerLot_Stock"
    //         },
            
    //         {
    //             "NOM_FLUX"  : "EnvoyerLot_Repart"
    //         }
    //     ],
    //     "WAIT_BEFORE"   : 3000,                 // Optionnel
    // };
    // await esb.checkFlux(oFlux,page);

}) 