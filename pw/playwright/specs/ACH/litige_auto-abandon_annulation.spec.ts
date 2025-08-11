/**
 * 
 * 
 * @author JC CALVIERA, SIAKA KONE
 * @since 2023-11-07
 * 
 */
const xRefTest      = "ACH_LIT_ANN";
const xDescription  = "Annuler l'abandon d'un litige";
const xIdTest       =  4891;
const xVersion      = '3.4';

var info = {
    desc    : xDescription,
    appli   : 'ACH',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : ['Successeur de ACH_LIT_ABA'],
    params  : ['rayon'],
    fileName: __filename
};

//------------------------------------------------------------------------------------
import { test, type Page, expect }  from '@playwright/test';

import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';

import { MenuAchats }               from '@pom/ACH/menu.page';
import { PageLitLitAut }            from '@pom/ACH/litiges_litiges-automatiques.page';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;

let pageLitige      : PageLitLitAut;

var log             = new Log();
var fonction        = new TestFunctions(log);

//------------------------------------------------------------------------------------
var oData:any       = fonction.importJdd();        // Récupération du JDD et des données du E2E en cours si ils existent
//------------------------------------------------------------------------------------
const sRayon        = fonction.getInitParam('rayon','Fruits et légumes');
const sCodeArticle  = fonction.getInitParam('listeArticles','V393');
var sNumeroLot      = fonction.getInitParam('numLot','0904');

var sDossierAchat   = '-- Tous --';
//------------------------------------------------------------------------------------

if (oData !== undefined) {
    var sNumLotE2E  = oData.aLots[sCodeArticle];  
    sNumeroLot      = sNumLotE2E;                            // Récupération du numero du lot                     
    log.set('E2E - Numéro du lot : ' + sNumeroLot);
    log.set('Code Article : ' + sCodeArticle); 
}

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    pageLitige      = new PageLitLitAut(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [LITIGES]', () => {

        var sPageName:string   = 'litiges';
       
        test('ListBox [RAYON] = "' + sRayon + '"', async () => {
            await menu.selectRayonByName(sRayon, page);
        })

        test('Page [LITIGES] - Click', async () => {
            await menu.click(sPageName, page); 
        })
       
        test ('Error Message - Is Hidden', async () =>  {
            await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
        })

        test.describe('Onglet [LITIGES AUTOMATIQUES]', async () => {

            test('ListBox [DOSSIER d\'ACHAT] = "' + sDossierAchat + '"', async() => {
                await pageLitige.listBoxDossierAchat.selectOption(sDossierAchat);
            })

            test ('Check Box [AFFICHER TOUS LES LITIGES] - Click', async () => {
                await fonction.clickElement(pageLitige.checkBoxToutAfficher);
            })

            test('Input [NUMERO DE LOT] ="' + sNumeroLot +'"', async () => {
                await pageLitige.tdNumLot.first().waitFor();
                await fonction.sendKeys(pageLitige.inputFieldLot, sNumeroLot); 
                await fonction.wait(page, 500); //Attendre que le filtre soit effectif;
            })

            test('CheckBox [LITIGE]['+ sNumeroLot +']', async () =>{
                await fonction.clickElement(pageLitige.tdNumLot.nth(0));
            })

            test ('Button [ANNULER UN ABANDON] - Click', async () => {
                await fonction.wait(page, 500);                                         // Attente rafraîchissement de la liste coté front
                await fonction.clickAndWait(pageLitige.buttonAnnulerAbandon, page);
                log.set('Annulation Abandon Litige Num Lot : ' + sNumeroLot);
            })

            test ('Check Box [AFFICHER TOUS LES LITIGES] - Unclick', async () => {
                await fonction.clickElement(pageLitige.checkBoxToutAfficher);
            })

            test('Input [NUMERO DE LOT 2] ="' + sNumeroLot +'"', async () => {
                await pageLitige.tdNumLot.first().waitFor();
                await fonction.sendKeys(pageLitige.inputFieldLot, sNumeroLot); 
                await fonction.wait(page,500); //Attendre que le filtre soit effectif;
            })

            test ('Litige Auto [Num Lot="' + sNumeroLot + '"] - Is Visible', async () => {
                await fonction.wait(page, 500);                                         // Attente rafraîchissement de la liste coté front
                await expect(page.locator('span:text("' + sNumeroLot + '")').first()).toBeVisible();
            })
        })  // End Describe Onglet

    })  // End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})