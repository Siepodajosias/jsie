/**
 * 
 * @author JOSIAS SIE
 * @since 2024-12-26
 *  
 */
const xRefTest      = "DON_REC_IRE";
const xDescription  = "Imprimer récapitulatif";
const xIdTest       = 4721;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'DONS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,   
    help        : [],
    params      : [],
    fileName    : __filename
}

//--------------------------------------------------------------------------------------------// 

import { test, type Page }   from '@playwright/test';

import { Help }              from '@helpers/helpers';
import { TestFunctions }     from '@helpers/functions';
import { Log }               from '@helpers/log';

import { MenuDon }           from '@pom/DON/menu.page';
import { RecapitulatifsDons }from '@pom/DON/dons-recapitulatif.page';

import {CartoucheInfo }      from '@commun/types/index';

//--------------------------------------------------------------------------------------------//

let page                : Page;
let menu                : MenuDon;

let pageDonsRecap       : RecapitulatifsDons;

const log               = new Log();
const fonction          = new TestFunctions(log);

//---------------------------------------------------------------------------------------------//

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuDon(page, fonction);    
    pageDonsRecap       = new RecapitulatifsDons(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//---------------------------------------------------------------------------------------------//

test.describe.serial ('[' + xRefTest + '] - ' + xDescription + ' : ', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();		
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [DONS]',  async () => {

        var sNomPage:string  = 'dons';

        test('Page [DONS] - Click', async () => {
            await menu.click(sNomPage, page);
        })

        var sNomOnglet:string = 'RECAPITULATIF';
        test.describe ('Onglet [' + sNomOnglet + ']',  async () => {

            test('Onglet [' + sNomOnglet + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'recapitulatifs', page);
            })
    
            var nNomCasdeTest:string = 'IMPRIMER RECAPITULATIF';
            test.describe (' [' + nNomCasdeTest + ']',  async () => {
                test('CheckBox [LISTE DES RECAPITULATIFS][0] - Click', async () => {
                    await fonction.clickElement(pageDonsRecap.checkboxListeRecapitulatif.nth(0));
                    await fonction.isDisplayed(pageDonsRecap.iconListeRecapitulatif);
    
                    log.set('Bénéficiaire (ville) : ' + await pageDonsRecap.tdListeRecapitulatif.nth(0).textContent());
                    log.set('Société donatrice : ' + await pageDonsRecap.tdListeRecapitulatif.nth(0).textContent());
                    log.set('Poids total : ' + await pageDonsRecap.tdListeRecapitulatif.nth(0).textContent());
                    log.set('Valorisation initiale : ' + await pageDonsRecap.tdListeRecapitulatif.nth(0).textContent());
                })

                test('Button [IMPRIMER RECAPITULATIF] - Click',  async () => {
                    await fonction.clickElement(pageDonsRecap.buttonImprimerRecapitulatif, page);
                    await fonction.wait(page, 1000);
                })
            })
        })
    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})

