/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 22- 04 - 2024
 */

const xRefTest      = "MAG_STS_MVT";
const xDescription  = "Vérifier l'écran stock à surveiller";
const xIdTest       =  1194;
const xVersion      = '3.5';

var info = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { expect, test, type Page}       from '@playwright/test';

import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';
import { Help }                         from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }                  from '@pom/MAG/menu.page';
import { StockStockASurveiller }        from '@pom/MAG/stock-stock_a_surveiller.page';

//-------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuMagasin;
let pageStockSurv   : StockStockASurveiller;

const log           = new Log();
const fonction      = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const sNomVille     = fonction.getInitParam('ville', 'Istres (F715)');

//---------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageStockSurv   = new StockStockASurveiller(page);
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

    test.describe('Page [STOCK]', async () => {

        var pageName:string = 'stock';

        test ('Page [STOCK] - Click', async () => {
            await menu.click(pageName, page);
        })

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })   

        test('ListBox [VILLE] = "' + sNomVille + '"', async () => {
            await menu.selectVille(sNomVille, page);
        })

        test.describe ('Onglet [STOCK A SURVEILLER]', () => {        

            test('Onglet [STOCK A SURVEILLER] - Click', async () => {
                await menu.clickOnglet(pageName, 'stockASurveiller', page);
            })

            test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de l'onglet
                await fonction.isErrorDisplayed(false, page);
            })                              

            test('Sous-Onglet [STOCK INPORTANT] - Click', async () => {
                await fonction.clickAndWait(pageStockSurv.linkStockImportant, page);
            })
            
            test('** Wait Until Spinner Off **', async () => {
                await fonction.waitForSpinner(pageStockSurv.spinnerLoadingDatas);
            })

            test('CheckBox [ARTICLE][first] - Click ', async () =>{
                var iNbArticles = await pageStockSurv.checkBoxListeAnomalies.count();
                await fonction.clickElement(pageStockSurv.checkBoxListeAnomalies.first());
                var sNomArticle = await pageStockSurv.tdListeDesignations.first().textContent();
                log.set('Article : ' + sNomArticle);                        
                expect(iNbArticles).toBeGreaterThan(0);
            })

            test('Button [MOUVEMENTS DE STOCK] - Click', async () => {
                await fonction.clickAndWait(pageStockSurv.buttonMouvementsStock, page);
            })

            var sNomPopin:string = "Visualisation des mouvements de stock";
            test.describe ('Popin [' + sNomPopin + ']', async () => {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test('DataGrid [HISTORIQUE] - Is Visible', async () => {
                    var iNbMvt = await pageStockSurv.pPtdDateMvt.count();
                    if (iNbMvt > 0) {
                        log.set('Nb Mouvements : ' + iNbMvt);
                        expect(iNbMvt).toBeGreaterThan(0);
                    } else {
                        // Dans certains cas il est nécessaire de changer le conditionnement car celui par défaut ne contient aucune donnée
                    }
                })

                test('Button [FERMER] - Click', async () => {
                    await fonction.clickAndWait(pageStockSurv.pPLinkFermerMvt, page);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })
            })
        })
    }) // End describe Page

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
    
})