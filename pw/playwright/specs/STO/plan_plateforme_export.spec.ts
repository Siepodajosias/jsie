/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 20 - 11 - 2023
 * 
 */

const xRefTest      = "STO_PLA_EXP";
const xDescription  = "Exporter un plan plateforme";
const xIdTest       =  2173;
const xVersion      = '3.0';

var info = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}                from '@playwright/test';

import { TestFunctions }                 from "../../utils/functions";
import { Log }                           from "../../utils/log";
import { Help }                          from '../../utils/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                     from "../../pages/STO/menu.page";
import { AdminStockMobile }              from '../../pages/STO/admin-stock_mobile.page';
import { ReferentielPlanPlateForme }     from '../../pages/STO/referentiel-plan_plateforme.page';

//----------------------------------------------------------------------------------------

let page             : Page;

let menu             : MenuStock;
let pageAdminStockM  : AdminStockMobile;
let pageRefPlanPltf  : ReferentielPlanPlateForme;

const fonction       = new TestFunctions();
const log            = new Log();

//----------------------------------------------------------------------------------------
var maDate          = new Date();
const sCommentaire  = 'TEST-AUTO_Import Plan Commentaire - ' + maDate.getFullYear() + fonction.addZero(maDate.getMonth() + 1) + fonction.addZero(maDate.getDate());

const plateforme    = process.env.PLATEFORME || 'Cremlog';
//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page                = await browser.newPage(); 

    menu                = new MenuStock(page, fonction);
    pageAdminStockM     = new AdminStockMobile(page);
    pageRefPlanPltf     = new ReferentielPlanPlateForme(page);
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe ('[' + xRefTest + ']', () => {

    var actionnable = false

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    })

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test('ListBox [PLATEFORME] = "' + plateforme + '"', async() => {            
        await menu.selectPlateforrme(page, plateforme);                       // Sélection d'une plateforme par défaut
    })

    test.describe('Page [ADMIN]', async () => {

        test('Page [ADMIN] - Click', async () => {
            await menu.click('admin', page);
        })
       
        test.describe('Onglet [STOCK MOBILE]', async () => {        
            
            test('Onglet [STOCK MOBILE] - Click', async () => {
                await menu.clickOnglet('admin', 'stockMobile', page);
            })  

            test('Toggle [EMPLACEMENTS OPTIMAUX] - Click if needed', async () =>{
                var sColor = await pageAdminStockM.posEmplacementsOptimaux.nth(0).getAttribute('class');
                log.set('Style : ' + sColor);
                if (sColor == 'gfit-switch-left-value') {
                    log.set('Etat du bouton : INACTIF => Activation !');
                    await pageAdminStockM.toggleEmplacementsOptimaux.click();
                    await pageAdminStockM.buttonEmplacementsOptimaux.click();
                } else {
                    log.set('Etat du bouton : ACTIF => nop...');
                }
            })
        });
    });


    test.describe('Page [REFERENTIEL]', () => {    
        
        test('Page [REFERENTIEL] - Click', async () => {
            await menu.click('referentiel', page);
        })
        
        test.describe('Onglet [PLAN PLATEFORME] >', () => {        
            
            test('Onglet [PLAN PLATEFORME] - Click', async () => {
                await menu.clickOnglet('referentiel', 'planPlateforme', page);
            })   

            test('DataGrid [COMMENTAIRE]['+ sCommentaire + '] - Click', async () => {
                if (await pageRefPlanPltf.dataGridTdCommentaires.first().isVisible()){
                    actionnable = true;
                    var nbElement = await pageRefPlanPltf.dataGridTdCommentaires.count();
                    for (let elt = 0; elt < nbElement; elt++){
                        var text = await pageRefPlanPltf.dataGridTdCommentaires.nth(elt).textContent();
                        if(text == sCommentaire){
                            log.set('Commentaire :' + text);
                            await pageRefPlanPltf.dataGridTdCommentaires.nth(elt).click();
                            break;
                        }
                    } 
                }else{
                    log.set('AUCUN COMMENTAIRE EXISTANT');
                    test.skip();
                }
            })

            test('Button [EXPORTER UN PLAN DE LA PLATEFORME] - Click', async () => {
                if(actionnable && (await pageRefPlanPltf.buttonExporterUnPlan.isEnabled())){
                    await fonction.clickAndWait(pageRefPlanPltf.buttonExporterUnPlan, page);
                }else{
                    log.set('Button [EXPORTER UN PLAN DE LA PLATEFORME] - Click : ACTION ANNULEE');
                    test.skip();
                }
            })
        })  //-- End Describe Onglet              

    })  //-- End Describe Page
})