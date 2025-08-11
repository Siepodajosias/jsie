/**
 * 
 * 
 * @author JC CALVIERA
 * @since 2023-11-06
 * 
 */
const xRefTest      = "ACH_VNM_ATT";
const xDescription  = "Attribuer un (ou plusieurs) magasins d'une ventilation magasin";
const xIdTest       =  1731;
const xVersion      = '3.5';

var info: CartoucheInfo= {
    desc    : xDescription,
    appli   : 'ACHATS',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : ['Successeur de ACH_VNM_ADD'],
    params  : ['rayon'],
    fileName: __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }  from '@playwright/test';

//-- Helpers
import { Help }             from '@helpers/helpers';
import { TestFunctions }    from '@helpers/functions';
import { Log }              from '@helpers/log'

import { MenuAchats }       from '@pom/ACH/menu.page';

//-- Pages Objects
import { PageBesVenMag }    from '@pom/ACH/besoins_ventilation-magasins.page';
import { CartoucheInfo }    from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;

let pageVenMag      : PageBesVenMag;

var log             = new Log();
var fonction        = new TestFunctions(log);

//------------------------------------------------------------------------------------
const sRayon        = fonction.getInitParam('rayon', 'Fruits et légumes');
const iNbSelect     = 5;

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

            test ('Onglet [VENTILATIONS DES MAGASINS] - Click', async () =>  {
                await menu.clickOnglet(sPageName, 'ventilationsMagasins', page);
            })   

            test ('Error Message - Is Hidden', async () =>  {
                await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
            })

            test ('Label ["' + oDatas.LIBELLE + '"] - Click', async () =>  {
                var iNbrPagination = await pageVenMag.dataGridVentilationsPagination.count();
                for(let i = 0; i < iNbrPagination; i++){
                    await fonction.wait(page, 250);
                    var iNbrVentilation = await pageVenMag.dataGridTdListeVentilations.locator('span:text-is("'+oDatas.LIBELLE+'")').count();
                    if(iNbrVentilation > 0){
                        await fonction.clickAndWait(pageVenMag.dataGridTdListeVentilations.locator('span:text-is("'+oDatas.LIBELLE+'")'), page);
                        break;
                    }else{
                        await fonction.clickElement(pageVenMag.dataGridPaginationNext);
                    }
                }
            })             

            for (var cpt=0; cpt < iNbSelect; cpt++){
                test ('CheckBox #' + cpt + ' [MAGASIN][rnd] - Click', async () =>  {
                    await pageVenMag.dataGridTdListeMagasins.first().waitFor();
                    const iNbMagasins = await pageVenMag.dataGridTdListeMagasins.count();
                    var rnd = Math.floor(fonction.random() * iNbMagasins);
                    var sLibelleMagasin = await pageVenMag.dataGridTdListeMagasins.nth(rnd).textContent();
                    log.set('Rnd : ' + rnd + '/' + iNbMagasins);
                    //log.set('Magasin #'+cpt+'/'+iNbMagasins+' séléctionné : ' + sLibelleMagasin);
                    log.set('Magasin séléctionné : ' + sLibelleMagasin);
                    await fonction.clickElement(pageVenMag.dataGridTdListeMagasins.nth(rnd));
                })
            }

            test('Button [ATTRIBUER (' + iNbSelect + ') MAGASINS] - Click', async () =>  {
                await fonction.clickElement(pageVenMag.buttonAttribuerMagasin);
            })
        })  // End Describe Onglet
    })  // End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});
})