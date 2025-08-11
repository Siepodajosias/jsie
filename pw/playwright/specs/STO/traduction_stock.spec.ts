/**
 * @author  JC CALVIERA
 * @since   2023-11-13
 * 
 */

const xRefTest      = "STO_TRD_ITA";
const xDescription  = "Vérifie que les traductions STOCK sont présentes";
const xIdTest       =  3994; 
const xVersion      = '3.4';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'STO',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['plateforme'],
    params      : [],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}   from '@playwright/test';

import { TestFunctions }    from "@helpers/functions";
import { Log }              from "@helpers/log";
import { Help }             from '@helpers/helpers';

import { MenuStock }        from "@pom/STO/menu.page";
import { StockStock }       from "@pom/STO/stock-stock.page";
import { Accueil }          from "@pom/STO/accueil.page";

import { CartoucheInfo, TypeListOfElements } from '@commun/types';

//-----------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuStock;
let pageStock           : StockStock;
let pageAccueil         : Accueil;

const log               = new Log();
const fonction          = new TestFunctions(log);

// -----------------------------------------------------------------------------------------

const sPlateforme       = process.env.PLATEFORME || 'Cremilan';

// -----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage(); 

    menu        = new MenuStock(page, fonction);
    pageStock   = new StockStock(page);
    pageAccueil = new Accueil(page);
    const helper= new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

// -----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async() => {
       await fonction.connexion(page);
    })

    test.describe ('Page [ACCUEIL]', async () => {    

        test ('DataGrid [SYNTHESE FR] - Check', async () => {

            // Le chargement de la page se faire depuis la connexion (voir fonction "connexion");
            // fonction.waitTillHTMLRendered(page);        //-- On attend la fin du chargement de la page d'accueil
            await pageAccueil.dataGridRecaptitulatif.last().waitFor({state:'visible'}); // On va s'assurer que les données du dataGrid soient chargées

            var oDataGrid:TypeListOfElements = {
                element     : pageAccueil.dataGridRecaptitulatif,    
                desc        : 'Accueil',
                verbose     : false,
                column      :   
                     [
                        'Réceptions',
                        'Prévus',
                        'En cours de réception',
                        'Reçus',
                        'Reste',
                     ]
            }
            await fonction.dataGridHeaders(oDataGrid);
        })

        test ('ListBox [LANGUE] = \'IT\'', async () => {             
            await menu.selectLang('it', page);
        })

        test ('DataGrid [SYNTHESE IT] - Check', async () => {

            await pageAccueil.dataGridRecaptitulatif.last().waitFor({state:'visible'}); // On va également s'assurer que les données du dataGrid après traduction soient chargées;

            var oDataGrid:TypeListOfElements = {
                element     : pageAccueil.dataGridRecaptitulatif,    
                desc        : 'Accueil',
                verbose     : false,
                column      :   
                     [
                        'Ricezioni',
                        'Previsti',
                        'In corso di ricezione',
                        'Ricevuti',
                        'Residuo',
                     ]
            }
            await fonction.dataGridHeaders(oDataGrid);
        })

    })

    test.describe ('Page [STOCK]', async () => { 

        test.describe ('Page [STOCK]', async () => {    

            var pageName = 'stock';

            test ('Page [STOCK] - Check', async () => {
                await menu.click(pageName, page);
                await fonction.isErrorDisplayed(false, page);                            // Pas d'erreur affichée à priori au chargement de l'onglet 
            })

            test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {
                await menu.selectPlateformeByName(page, sPlateforme);
            })  

            test ('DataGrid [SYNTHESE IT] - Check', async () => {
                var oDataGrid:TypeListOfElements = {
                    element     : pageStock.dataGridDonneesStock,    
                    desc        : 'Accueil',
                    verbose     : false,
                    column      :   
                         [
                            '0',
                            'N° lotto',
                            'Data di ricezione',
                            'Fornitore',
                            'Codice articolo',
                            'Codice articolo',
                            'Condizionamento',
                            'Colli in stock',
                            'Pallet',
                            'Zone',
                            'Sentieri',
                            'Ubicazioni pallet',
                            'DLC',
                            'Piattaforma di distribuzione',
                            'Azione',
                         ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })

        })

    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
    
})