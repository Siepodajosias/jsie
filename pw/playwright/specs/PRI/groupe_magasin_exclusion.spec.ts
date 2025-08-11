/**
 * @desc Exclusion automatique d'un magasin
 * 
 * @author JOSIAS SIE
 *  Since 2024-09-25
 */

const xRefTest      = "PRI_MAG_MEG";
const xDescription  = "Exclusion automatique d'un magasin d'un groupe de magasin";
const xIdTest       =  9491;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRICING',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon','nomGroupe','magasinExclu'],
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
var   sMagasinExclu   = fonction.getInitParam('magasinExclu', '');

//----------------------------------------------------------------------------------------
if (oData !== undefined) {  
	var sNomGroupeE2E = oData.sNomGroupe; // L'élément recherché est le nom du groupe de magasin préalablement créé dans le E2E
	sNomGroupeMg      = sNomGroupeE2E;

	log.set('Nom du groupe de magasin : '+ sNomGroupeMg);
}

sMagasinExclu         = sMagasinExclu ? sMagasinExclu : 'TA_lieu vente. ' + fonction.getToday('FR',-1);
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
            await menuPage.selectRayonByName(sRayon, page);  // Sélection du rayon
            log.set('Rayon : ' + sRayon);
        })

        test('Label [ERREUR] - Is Not Visible', async () => {// Pas d'erreur affichée à priori au chargement de la page
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
    
            test('Button [SELECTIONNES] - Click', async () => {
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

            //-- Recuperation du groupe de magasin exclus. 
            test.describe('Div [GESTION MAGASINS][EXCLUS]', async () => {
                test('Input [ABREVIATION] = "' + sMagasinExclu + '"', async () => {
                    await fonction.sendKeys(pageGestMag.thAbreviation, sMagasinExclu, false, 'Désignation du lieu de vente');
                })
    
                test('Tr [LISTE MAGASIN] - Check', async () => {
                    const iNbre = await pageGestMag.dataListeMagasinSelectable.count();
                    expect(iNbre).toEqual(0);
                })
            })
        })
    })  //-- End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})