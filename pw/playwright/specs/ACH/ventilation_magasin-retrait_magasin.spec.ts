/**
 * 
 * 
 * @author JC CALVIERA
 * @since 2023-11-06
 * 
 */
const xRefTest      = "ACH_VNM_RET";
const xDescription  = "Retirer un (ou plusieurs) magasins d'une ventilation magasin";
const xIdTest       =  2188;
const xVersion      = '3.4';

var info:CartoucheInfo = {
    desc    : xDescription,
    appli   : 'ACHATS',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : ['Successeur de ACH_VNM_ATT'],
    params  : ['rayon'],
    fileName: __filename
};

//------------------------------------------------------------------------------------

import { test, type Page, expect }from '@playwright/test';

//-- Helpers
import { Help }                   from '@helpers/helpers';
import { TestFunctions }          from '@helpers/functions';
import { Log }                    from '@helpers/log'

import { MenuAchats }             from '@pom/ACH/menu.page';
import { PageBesVenMag }          from '@pom/ACH/besoins_ventilation-magasins.page';
import { CartoucheInfo }          from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;

let pageVenMag      : PageBesVenMag;

var log             = new Log();
var fonction        = new TestFunctions(log);

//------------------------------------------------------------------------------------
const sRayon        = fonction.getInitParam('rayon', 'Fruits et légumes');

const sFileJdd      = fonction.getLocalConfig('jddVentilMagasins');
const oDatas        = fonction.readFile(sFileJdd);
//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    pageVenMag      = new PageBesVenMag(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [BESOINS]', () => {

        var sPageName:string = 'besoins';

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {
            await menu.selectRayonByName(sRayon, page);
        })

        test('Page [BESOINS] - Click', async () => {
            await menu.click(sPageName, page); 
        })
       
        test ('Error Message - Is Hidden', async () =>  {
            await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
        })

        test.describe('Onglet [VENTILATIONS DES MAGASINS]', async () =>  {

            var iNbMagasins:number = 0;

            test ('Onglet [VENTILATIONS DES MAGASINS] - Click', async () =>  {
                await menu.clickOnglet(sPageName, 'ventilationsMagasins', page);
            })   

            test ('Error Message - Is Hidden', async () =>  {
                await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
            })

            test ('Label ["' + oDatas.LIBELLE + '"] - Click', async () =>  {
                var iNbrPagination = await pageVenMag.dataGridVentilationsPagination.count();
                for(let i = 0; i < iNbrPagination; i++){
                    await fonction.wait(page, 1000);
                    var iNbrVentilation = await pageVenMag.dataGridTdListeVentilations.locator('span:text-is("'+oDatas.LIBELLE+'")').count();
                    if(iNbrVentilation > 0){
                        await fonction.clickAndWait(pageVenMag.dataGridTdListeVentilations.locator('span:text-is("'+oDatas.LIBELLE+'")'), page);
                        break;
                    }else{
                        await fonction.clickElement(pageVenMag.dataGridPaginationNext);
                    }
                }
            })             

            test ('CheckBox [MAGASIN SELECTED][rnd] - Click', async () =>  {
                await fonction.wait(page, 250);
                await pageVenMag.dataGridTdListeMagasinsSelected.first().waitFor();         // 
                iNbMagasins = await pageVenMag.dataGridTdListeMagasinsSelected.count();
                var rnd = Math.floor(fonction.random() * iNbMagasins);
                var sLibelleMagasin = await pageVenMag.dataGridTdListeMagasinsSelected.nth(rnd).textContent();
                log.set('Rnd : ' + rnd + '/' + iNbMagasins);
                //log.set('Magasin #'+cpt+'/'+iNbMagasins+' séléctionné : ' + sLibelleMagasin);
                log.set('Magasin séléctionné : ' + sLibelleMagasin);
                await fonction.clickElement(pageVenMag.dataGridTdListeMagasinsSelected.nth(rnd));
            })

            test ('Button [RETIRER (1) MAGASIN] - Click', async () =>  {
                await fonction.clickElement(pageVenMag.buttonModifierMagasin);
            })

            test ('Nb magasins = Nb magasin - 1', async () =>  {
                await pageVenMag.dataGridTdListeMagasinsSelected.first().waitFor();
                const iNbMagasinsRestants = await pageVenMag.dataGridTdListeMagasinsSelected.count();
                log.set('Nb magasin après suppression : ' + iNbMagasinsRestants);
                expect(iNbMagasinsRestants).toBe(iNbMagasins - 1);
            })

        })  // End Describe Onglet

    })  // End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});
})