/**
 * @desc Association automatique d'un magasin
 * 
 * @author JOSIAS SIE
 *  Since 2024-09-26
 */

const xRefTest      = "PRI_MAG_MIG";
const xDescription  = "Association automatique d'un magasin à un groupe de magasin";
const xIdTest       =  9492;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRICING',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon','nomGroupe','magasinInclus'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, expect, type Page }  from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';

import { GestionsMagasinPage }      from '@pom/PRI/gestions_magasins.page';
import { MenuPricing }              from '@pom/PRI/menu.page.js';
import { CartoucheInfo }            from '@commun/types';

//----------------------------------------------------------------------------------------

let page        : Page;
let menuPage    : MenuPricing;

let pageGestMag : GestionsMagasinPage;

const log       = new Log();
const fonction  = new TestFunctions(log);

//----------------------------------------------------------------------------------------

var oData:any         = fonction.importJdd();

const sRayon          = fonction.getInitParam('rayon','Fruits et légumes');
var   sNomGroupeMg    = fonction.getInitParam('nomGroupe', ''); 
var   sMagasinInclus  = fonction.getInitParam('magasinInclus', '');

//----------------------------------------------------------------------------------------
if (oData !== undefined) {  
	var sNomGroupeE2E = oData.sNomGroupe; // L'élément recherché est le nom du groupe de magasin préalablement créé dans le E2E
	sNomGroupeMg      = sNomGroupeE2E;

	log.set('Nom du groupe de magasin : '+ sNomGroupeMg);
}

sMagasinInclus      = sMagasinInclus ? sMagasinInclus : 'TA_lieu vente. ' + fonction.getToday('FR',-1);
//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menuPage        = new MenuPricing(page, fonction);
    pageGestMag     = new GestionsMagasinPage(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [GESTION DES MAGASINS]', async () => {    

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menuPage.selectRayonByName(sRayon, page);     // Sélection du rayon
            log.set('Rayon : ' + sRayon);
        })

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })

        var sNomPage = 'gestion';
        test('Onglet [GROUPE DE MAGASINS] - Click', async () => {
            await menuPage.click(sNomPage, page);
        })

        test.describe('Div [GESTION MAGASINS]', async () => {

            test('InputField [NOM DU GROUPE] = "' + sNomGroupeMg + '"', async () => {
                await fonction.sendKeys(pageGestMag.inputNomGroupeMag, sNomGroupeMg, false, 'Nom groupe magasin');
            })
    
            test('Td [NOM DU GROUPE] = "' + sNomGroupeMg + '" - Check', async () => {
                var sNom = await pageGestMag.tdNomMagasinSelectionnable.first().textContent();
                expect(sNom).toBe(sNomGroupeMg);
            })
    
            test('Td [NOM DU GROUPE] - Click', async () => {
                await fonction.clickElement(pageGestMag.tdNomMagasinSelectionnable.first());
            })
    
            test('Button [SELECTIONNES] - Check', async () => {
                await fonction.clickAndWait(pageGestMag.buttonSelectionnes, page);
            })

            //-- Vérifier que les magasins selectionnés sont cochés;
            test('Tr [MAGASINS] [COCHE] " - Check', async () => {
                var nbre  = await pageGestMag.pPaginatorGroupeMagasin.count();
                for(let i = 0; i < nbre; i++){
                    await fonction.clickElement(pageGestMag.pPaginatorGroupeMagasin.nth(i));
                    var iNbrMagasin = await pageGestMag.dataListeMagasinSelectable.count();
                    for(let i = 0; i < iNbrMagasin; i++){
                        await fonction.isDisplayed(pageGestMag.checkBoxMagasins.nth(i));
                    }
                }
            })

            //-- Recuperation du groupe de magasin inclus. 
            test.describe('Div [GESTION MAGASINS][INCLUS]', async () => {
                test('Input [ABREVIATION] = "' + sMagasinInclus + '"', async () => {
                    await fonction.sendKeys(pageGestMag.thAbreviation, sMagasinInclus, false, 'Désignation du lieu de vente');
                })
    
                test('Td [ABREVIATION] - Check', async () => {
                    const texte = await pageGestMag.dataListeMagasinSelectable.locator('td.col-abreviation').textContent();
                    expect(texte).toEqual(sMagasinInclus);
                })
    
                //-- Vérifier que le magasin selectionné est cochés;
                test('Tr [MAGASINS] [COCHE] " - Check', async () => {
                    await fonction.isDisplayed(pageGestMag.checkBoxMagasins.first());
                })

                //-- Vérifier que les magasins selectionnés sont surlignés;
                test('Tr [MAGASINS] [SURLIGNES] " - Check', async () => {
                    const tdLigneSelectionnes =  pageGestMag.dataListeMagasinSelectable;
                    await expect(tdLigneSelectionnes).toHaveAttribute('data-p-highlight', 'true');
                })
            })
        })
    })  //-- End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})