/**
 * @desc Association manuelle d'un magasin à un groupe de magasin
 * 
 * @author SIAKA KONE
 *  Since 2024-09-12
 */

const xRefTest      = "PRI_MAG_ASO";
const xDescription  = "Association manuelle d'un magasin à un groupe de magasin";
const xIdTest       =  353;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRI',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon'],
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
const maDate    = new Date();

//----------------------------------------------------------------------------------------
const sRayon    = fonction.getInitParam('rayon','Crèmerie');
const sCodeMag  = fonction.getInitParam('listeMagasins','FL718CR,GC432CR,GC198CR,GC437CR,GC211CR');//-- Liste des magasins à selectionner;

const aCodeClient    = sCodeMag.split(',');
const sNomGrp        = 'TEST-AUTO_GrpMag-' + fonction.getToday('us') + '_' + maDate.getHours();
const sNewCodeClient = 'GC145CR';

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
            await menuPage.selectRayonByName(sRayon, page);               // Sélection du rayon
            log.set('Rayon : ' + sRayon);
        })

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })

        test('Onglet [GROUPE DE MAGASINS] - Click', async () => {
            await menuPage.click('gestion', page);
        })

        //--Vérifier que les magasins sont affichés;
        test('Td [NOM DU GROUPE][0] - Click', async () => {
            expect(await pageGestMag.tdNomMagasinSelectionnable.count()).toBeGreaterThan(0);
        })

        //-- Slection du groupe de magasin;
        test('InputField [NOM DU GROUPE] = "' + sNomGrp + '"', async () => {
            await fonction.sendKeys(pageGestMag.inputNomGroupeMag, sNomGrp, false, 'Nom groupe magasin');
            await fonction.wait(page, 500); // Attendre que le filtre s'applique;
        })

        test('Td [NOM DU GROUPE] ="' + sNomGrp + '" - Check', async () => {
            expect(await pageGestMag.tdNomMagasinSelectionnable.first().textContent()).toBe(sNomGrp);
        })

        test('Td [NOM DU GROUPE][0] #1 - Click', async () => {
            await fonction.clickElement(pageGestMag.tdNomMagasinSelectionnable.first());
        })

         //--Affichage des magasins selectionnés
         test('Button [SELECTIONNES] - Click', async () => {
            await fonction.clickAndWait(pageGestMag.buttonSelectionnes, page);
        })

         //-- Vérifier que les magasins selectionnés sont surlignés et cochés;
         aCodeClient.forEach((sCode:string) => {
            test('Tr [MAGASIN] = "' + sCode + '" - Check', async () => {
                await expect(pageGestMag.dataListeMagasinSelectable.filter({hasText:sCode})).toHaveAttribute('data-p-highlight', 'true');
            })
        })

        //--Affichage tous les magasins;
        test('Button [SELECTIONNES] - Unclick', async () => {
            await fonction.clickAndWait(pageGestMag.buttonSelectionnes, page);
        })

        //--Ajout d'un nouveau magasin au groupe,
        test('CheckBox [' + sNewCodeClient + ']', async () => {
            await fonction.clickElement(pageGestMag.dataListeMagasinSelectable.filter({hasText:sNewCodeClient}));
        })

        //--Retrait d'un magasin du groupe,(Le dernier de la liste avant ajout)
        test('CheckBox [' + aCodeClient[aCodeClient.length - 1] + ']', async () => {
            await fonction.clickElement(pageGestMag.dataListeMagasinSelectable.filter({hasText:aCodeClient[aCodeClient.length - 1]}));
        })

        //--Enregistrement des modification;
        test('Button [ASSOCIER LES MAGASINS AU GROUPE] - Click', async () => {
            await fonction.clickAndWait(pageGestMag.buttonAssocierMagasin, page);
        })

         //--- Vérifier que le groupe de magasin est déselectionné;
        test('Tr [GROUPE DE MAGASIN] = "' + sNomGrp + '" - Check', async () => {
            await fonction.sendKeys(pageGestMag.inputNomGroupeMag, sNomGrp, false, 'Nom groupe magasin');
            await fonction.wait(page, 500); // Attendre que le filtre s'applique;
            await expect(pageGestMag.dataListeGroupeMagSelectable.first()).not.toHaveAttribute('data-p-highlight', 'true');
        })

        //--Selection à nouveau du groupe magasin;
        test('InputField [NOM DU GROUPE] #1 = "' + sNomGrp + '"', async () => {
            await fonction.sendKeys(pageGestMag.inputNomGroupeMag, sNomGrp, false, 'Nom groupe magasin');
            await fonction.wait(page, 500); // Attendre que le filtre s'applique;
        })

        test('Td [NOM DU GROUPE][0] #2 - Click', async () => {
            await fonction.clickElement(pageGestMag.dataListeGroupeMagSelectable.first());
        })

        //--Affichage des magasins selectionnés
        test('Button [SELECTIONNES] #1 - Click', async () => {
            await fonction.clickAndWait(pageGestMag.buttonSelectionnes, page);
        })

        //---Le magasin retiré ne doit pas être visible;
        test('CheckBox [' + aCodeClient[aCodeClient.length - 1] + '] Is Not Visible', async () => {
            await expect(pageGestMag.dataListeMagasinSelectable.filter({hasText:aCodeClient[aCodeClient.length - 1]})).not.toBeVisible();
        })

        //-- Vérifier que le magasin nouvelement associé est bien selectionné et surlignés;
        test('Tr [MAGASIN] = "' + sNewCodeClient + '" - Check', async () => {
            await expect(pageGestMag.dataListeMagasinSelectable.filter({hasText:sNewCodeClient})).toHaveAttribute('data-p-highlight', 'true');
        })
    })  //-- End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})