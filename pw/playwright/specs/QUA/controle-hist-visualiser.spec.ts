/**
 * 
 * @author SIAKA KONE
 * @since 2024-12-30
 * 
 */

const xRefTest      = "QUA_HIST_VCT";
const xDescription  = "Visualiser un contrôle";
const xIdTest       =  7163;
const xVersion      = '3.1';

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

            var sNomPopin:string = 'Contrôle terminé le ...';
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test ('Button [VISUALISER UN CONTROLE] - Click', async () =>  {
                    await fonction.clickAndWait(pageControlesHistoriques.buttonVisualiserControle, page);
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })
                var sNomOnglet:string = 'Bilan Contrôle';
                test ('Onglet ['+sNomOnglet+'] - Is Visible', async () =>  {
                    await fonction.isDisplayed(pageControlesHistoriques.pPOngletDetail);
                })              
                test.describe ('Onglet [' + sNomOnglet + ']', async () =>  { 
      
                    test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () =>  {
                        await fonction.clickElement(pageControlesHistoriques.pPOngletBilanControle);
                    })
                                
                    test ('Button [ANNULER] - Click', async () =>  {
                        await fonction.clickElement(pageControlesHistoriques.pPChistButtonFermer);
                    })
                })
                
                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })

            })
            
        })
    })

    test ('Déconnexion', async () =>  {
        await fonction.deconnexion(page);
    })

})