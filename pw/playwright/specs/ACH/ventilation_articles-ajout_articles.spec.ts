/**
 * 
 * 
 * @author JC CALVIERA
 * @since 2023-11-07
 * 
 */
const xRefTest      = "ACH_VNA_ATT";
const xDescription  = "Attribuer un article (ou plusieurs) dans une ventilation article";
const xIdTest       =  1763;
const xVersion      = '3.2';

var info = {
    desc    : xDescription,
    appli   : 'ACH',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : ['Successeur de ACH_VNA_ADD'],
    params  : ['rayon'],
    fileName: __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }  from '@playwright/test';

import { Help }             from '@helpers/helpers';
import { TestFunctions }    from '@helpers/functions';
import { Log }              from '@helpers/log'

import { MenuAchats }       from '@pom/ACH/menu.page';
import { PageBesVenArt }    from '@pom/ACH/besoins_ventilation-articles.page';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;

let pageVenArt      : PageBesVenArt;

var log             = new Log();
var fonction        = new TestFunctions(log);

//------------------------------------------------------------------------------------
const sRayon        = fonction.getInitParam('rayon', 'Fruits et légumes');
const iNbSelect     = 5;

const sJddFile      = fonction.getLocalConfig('jddVentilArticles');
const oDatas        = fonction.readFile(sJddFile);
//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    pageVenArt      = new PageBesVenArt(page);
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
        log.set('Libellé ventilation article cible : ' + oDatas.LIBELLE);
    });

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [BESOINS]', () => {

        var sPageName = 'besoins';

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {
            await menu.selectRayonByName(sRayon, page);
        })

        test('Page [BESOINS] - Click', async () => {
            await menu.click(sPageName, page); 
        })
       
        test ('Error Message - Is Hidden', async () =>  {
            await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
        })

        test.describe('Onglet [VENTILATIONS DES ARTICLES]', async () =>  {

            test ('Onglet [VENTILATIONS DES ARTICLES] - Click', async () =>  {
                await menu.clickOnglet(sPageName, 'ventilationsArticles', page);
            })   

            test ('Error Message - Is Hidden', async () =>  {
                await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
            })

            test ('Label ["' + oDatas.LIBELLE + '"] - Click', async () =>  {
                await fonction.clickElement(page.locator('span:text("' + oDatas.LIBELLE + '")'));
            })             

            for (var cpt=0; cpt < iNbSelect; cpt++){
                test ('CheckBox [ARTICLE][rnd #' + cpt + '] - Click', async () =>  {

                    await pageVenArt.dataGridTdListeCodes.first().waitFor();         // 
                    const iNbArticles = await pageVenArt.dataGridTdListeCodes.count();
                    var rnd = Math.floor(fonction.random() * iNbArticles);
                    var sLibelleArticle = await pageVenArt.dataGridTdListeCodes.nth(rnd).textContent();
                    log.set('Rnd : ' + rnd + '/' + iNbArticles);
                    //log.set('Magasin #'+cpt+'/'+iNbArticles+' séléctionné : ' + sLibelleArticle);
                    log.set('Article séléctionné : ' + sLibelleArticle);
                    await fonction.clickElement(pageVenArt.dataGridTdListeCodes.nth(rnd));

                })
            }

            test ('Button [ATTRIBUER (' + iNbSelect + ') MAGASINS] - Click', async () =>  {
                await pageVenArt.buttonAttribuerArticle.click();
            })

        })  // End Describe Onglet


    })  // End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})