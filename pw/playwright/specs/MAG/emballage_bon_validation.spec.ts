/**
 * 
 * @author JC CALVIERA
 *  Since 2024-04-02
 */

const xRefTest      = "MAG_BON_VAL";
const xDescription  = "Validation d'un Bon d'Emballage Retour";
const xIdTest       =  80;
const xVersion      = '3.3';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['ville'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}   from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';

import { MenuMagasin }              from '@pom/MAG/menu.page';
import { EmballagesSuivi }          from '@pom/MAG/emballages-suivi.page';

import { CartoucheInfo }            from '@commun/types';

//-------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pageEmballage       : EmballagesSuivi;

const log               = new Log();
const fonction          = new TestFunctions(log);

//-----------------------------------------------------------------------------------------
const sJddFile          = fonction.getGlobalConfig('jddEmballage');
var oData               = fonction.readFile(sJddFile);

var sNumeroBon          = oData.sNumeroBon;
var sReferenceVile      = oData.sNomLieuVente + ' (' + oData.sCodeLieuVente + ')';
const sNomVille         = fonction.getInitParam('ville', sReferenceVile);

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageEmballage   = new EmballagesSuivi(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    let sNumBonInitial:string;
    let sNumBon:string;

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [STOCK]', async () => {

        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            await menu.pPopinAlerteSanitaire.isVisible().then(async (isVisible) => {
                if(isVisible){
                    await menu.removeArlerteMessage(page);
                }else{
                    log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                    test.skip();
                }
            })
        })

        var sNomPage = 'emballages';

        test ('Page [STOCK] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 

        test ('ListBox [VILLE] = "' + sNomVille + '"', async () => {
            await menu.selectVille(sNomVille, page);
        })

        test.describe('Onglet [SUIVI DES BONS]', async () => {

            test ('Onglet [SUIVI DES BONS] - Click', async () =>  {
                await menu.clickOnglet(sNomPage, 'suiviBons', page);
            }) 

            test ('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 

            test ('Toggle [A VALIDER] - Click', async () => {         
                await fonction.clickElement(pageEmballage.toggleButtonAValider);     
            })  

            test('Header [Date] - Click', async () => {
                // Trier les dates par ordre décroissant
                await fonction.clickElement(pageEmballage.dataGridHeaderDate);
                await fonction.wait(page, 250);
            })

            test ('CheckBox [BON A VALIDER][LAST] - Click', async () => {
                await fonction.clickElement(pageEmballage.tdNumeroBons.last());
                sNumBonInitial = await pageEmballage.tdNumeroBons.last().textContent();
                log.set('Bon Sélectionné Numéro : ' + sNumBonInitial);
                expect(sNumBonInitial).toBe(sNumeroBon);
            })

            test ('Button [A VALIDER] - Click', async () => {
                await fonction.clickAndWait(pageEmballage.buttonValider, page);
            })

            test ('Check [BON A VALIDER][LAST] - Is NOT Visible', async() => {
                if (await pageEmballage.tdNumeroBons.count()) {
                    sNumBon = await pageEmballage.tdNumeroBons.last().textContent();
                    log.set('Emballage A Valider restant sur la dernière ligne : ' + sNumBon);
                } else{
                    log.set('Plus aucun emballage A Valider');
                    test.skip();
                }
            })

            test ('Toggle [VALIDES] - Click', async () => {         
                await fonction.clickElement(pageEmballage.toggleButtonValides);     
            })  

            test ('Check [BON VALIDE][*] - Is Visible', async() => {
                await expect(pageEmballage.tdNumeroBons.locator('span:text-is("' + sNumBonInitial + '")')).toBeVisible();
            })
        })
    })

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});
})