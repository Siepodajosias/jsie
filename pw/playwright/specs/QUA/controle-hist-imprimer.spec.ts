/**
 * 
 * @author SIAKA KONE
 * @since 2024-12-30
 * 
 */

const xRefTest      = "QUA_HIS_IMP";
const xDescription  = "Imprimer un contrôle";
const xIdTest       =  7162;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'QUALITE',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};

import {  test,  type Page }                from '@playwright/test';
import { CartoucheInfo }                    from '@commun/types';

import { Help }                  			from '@helpers/helpers';
import { TestFunctions }         			from '@helpers/functions';
import { Log }                   			from '@helpers/log';

import { MenuQualite }           			from '@pom/QUA/menu.page';
import { ControlesHistoriques }             from '@pom/QUA/controles-historiques.page';

let page                					: Page;
let menu                					: MenuQualite;
let pageControlesHistoriques                : ControlesHistoriques;

const log               					= new Log();
const fonction          					= new TestFunctions(log);

test.beforeAll(async ({ browser }, testInfo) => {
    page            						= await browser.newPage();
    menu            						= new MenuQualite(page, fonction);
    pageControlesHistoriques                = new ControlesHistoriques(page);
    const helper    						= new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

test.describe.serial ('[' + xRefTest + ']', async () =>   {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () =>  {
        await fonction.connexion(page);
    })

    test.describe ('Page [CONTROLE]', async () => {

        var sNomPage:string = 'controles';

        test ('Menu [' + sNomPage.toUpperCase() + '] - Click', async () =>  {
            await menu.click(sNomPage, page);
        })

        var sNomOnglet:string = 'Historique des contrôles';
        test.describe ('Onglet[' + sNomOnglet.toUpperCase() + ']', async () =>  {

            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () =>  {
                await menu.clickOnglet(sNomPage, 'historiquesControles', page);
            })

            test ('Datepicker [HISTORIQUE DES CONTROLES] - Click', async () =>  {
                await fonction.clickElement(pageControlesHistoriques.datepickerHistArrivagesDLC);
                await fonction.clickElement(pageControlesHistoriques.datepickerHistAujourdhui.nth(0));   
            })        
  
            test ('Button [RECHERCHER] - Click', async () =>  {
                await fonction.clickAndWait(pageControlesHistoriques.buttonRechercherHistorique, page);
            })
  
            test ('CheckBox [ARRIVAGE][0] - Click', async () =>  {      // On coche l'arrivage précédent qui le statut terminé
                await fonction.clickElement(pageControlesHistoriques.checkBoxCocherUnArrivage.nth(0));
            })
            
            test ('Button [IMPRIMER] - Click', async () =>  {
                await fonction.noHtmlInNewTab(page, pageControlesHistoriques.buttonImprimerResultat);
            })
            
        })
    })

    test ('Déconnexion', async () =>  {
        await fonction.deconnexion(page);
    })

})