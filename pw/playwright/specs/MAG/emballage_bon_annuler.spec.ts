/**
 * 
 * @author Vazoumana DIARRASSOUBA
 * Since 2024-07-04
 * 
 */

const xRefTest      = "MAG_BON_ABE";
const xDescription  = "Annulation d'un bon d'emballage";
const xIdTest       =  9275;
const xVersion      = '3.2';

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

import { expect, test, type Page }  from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';

import { MenuMagasin }              from '@pom/MAG/menu.page';
import { EmballagesStock }          from '@pom/MAG/emballages-stock.page';

import { CartoucheInfo}             from '@commun/types';

//-------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pageEmballage       : EmballagesStock;

const log               = new Log();
const fonction          = new TestFunctions(log);

//-----------------------------------------------------------------------------------------

const sNomVille          = fonction.getInitParam('ville','Mersch (G288)');

const sJddFile           = fonction.getGlobalConfig('jddEmballage');
var oData                = fonction.readFile(sJddFile);

var sNumeroBon           = oData.numeroBon;

var iNombreBonsInitial: number;
//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageEmballage   = new EmballagesStock(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACCUEIL]', async () => {

        test('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if(isVisible){
                await menu.removeArlerteMessage(page);
            }else{
                log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                test.skip();
            }
        })
    })

    test.describe('Page [EMBALLAGE]', async () => {

        var sNomPage = 'emballages';

        test ('Page [EMBALLAGES] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 

        test ('ListBox [VILLE] = "' + sNomVille + '"', async () => {
            await menu.selectVille(sNomVille, page);
        })

        test.describe('Onglet [STOCK ET BONS]', async () => {

            test ('Onglet [STOCK ET BONS] - Click', async () =>  {
                await menu.clickOnglet(sNomPage, 'stockBons', page);
            }) 

            test ('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 

            test('Tr [BON][' + sNumeroBon + '] - Click', async() => {
                iNombreBonsInitial  = await pageEmballage.tdNumBon.count();
                await fonction.clickElement(pageEmballage.tdNumBon.filter({hasText:sNumeroBon}));
            })

            var sNomPopin ="Confirmer l'annulation d'un bon d'emballages";
            test.describe('Popin [' + sNomPopin.toLocaleUpperCase() + ']', async () => {

                test('Button [ANNULER] - Click', async () => {
                    await fonction.clickAndWait(pageEmballage.buttonAnnuler, page);
                })

                test('Popin [' + sNomPopin.toLocaleUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test('Button [OUI] - Click', async () => {
                    await fonction.clickAndWait(pageEmballage.pPbuttonOui, page);
                })

                test('Popin [' + sNomPopin.toLocaleUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })
            })

            test('Annulaition Bon - OK', async () => {
                var iNombreBonsFinal  = await pageEmballage.tdNumBon.count();
                expect(iNombreBonsFinal).toBeLessThan(iNombreBonsInitial);
            })
        })
    })

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})