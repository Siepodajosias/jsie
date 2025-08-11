/**
 * 
 * @author JC CALVIERA
 * @since 2024-03-13
 * 
 */
const xRefTest      = "ACH_LIT_ADA";
const xDescription  = "Transformer un Litige Automatique en Demande d'Avoir";
const xIdTest       =  1536;
const xVersion      = "3.2";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page, expect }   from '@playwright/test';

import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { Log }              from '@helpers/log.js';
import { EsbFunctions }     from '@helpers/esb.js';

import { MenuAchats }       from '@pom/ACH/menu.page.js';
import { PageLitLitAut }    from '@pom/ACH/litiges_litiges-automatiques.page.js';
import { PageLitDemAvo }    from '@pom/ACH/litiges_demandes-avoir.page.js';

import { CartoucheInfo, TypeEsb }    from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
var pageLitAuto     : PageLitLitAut;
var pageLitDem      : PageLitDemAvo;
var menu            : MenuAchats;
var esb             : EsbFunctions;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------
var oData:any       = fonction.importJdd();        // Récupération du JDD et des données du E2E en cours si ils existent

const sRayon        = fonction.getInitParam('rayon', 'Traiteur');
const sCodeArticle  = fonction.getInitParam('listeArticles','V393');
var sNumeroLot      = fonction.getInitParam('numLot','0904');

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
    pageLitAuto     = new PageLitLitAut(page);
    pageLitDem      = new PageLitDemAvo(page);
    esb             = new EsbFunctions(fonction);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async() => {
       await fonction.connexion(page);
    })
  
    test.describe('Page [LITIGES]', async() => {

        var sPageName:string = 'litiges';

        test('ListBox [RAYON] = "' + sRayon + '"', async() => {
            await menu.selectRayonByName(sRayon, page);
        })

        test("Menu [LITIGES] - Click ", async () => {
            await menu.click(sPageName, page);
        })

        test.describe ('Onglet [LITIGES AUTOMATIQUES]', async() => {

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            test('CheckBox [AFFICHER TOUS LES LITIGES] - Click', async() => {
                await fonction.clickElement(pageLitAuto.checkBoxToutAfficher);
            })

            test('td [LITIGES] > 0', async () => {
                const iNbreLit:number = await pageLitAuto.tdNumLot.count();
                expect(iNbreLit).toBeGreaterThan(0);
            })

            test('Inputield [LOT] = "' + sNumeroLot + '"', async () => {                                
                await fonction.sendKeys(pageLitAuto.inputFieldLot.nth(0), sNumeroLot);
                await fonction.wait(page, 500);
            })

            const sNatureLitige:string = "Quantité non conforme au BL en réception";
            test('td [NATURE DU LITIGE] = "' + sNatureLitige + '"', async () => {
                expect(await pageLitAuto.tdNatureLitige.first().textContent()).toContain(sNatureLitige);
            })

            test('CheckBox [LITIGES] = "' + sNumeroLot + '" - Click', async() => {
                log.set('Numéro Lot : ' + sNumeroLot);
                await fonction.clickElement(pageLitAuto.tdNumLot.nth(0));
                await fonction.wait(page, 500);                    
            })

            test('Button [GENERER UNE DEMANDE D\'AVOIR] - Click', async() => {
                await fonction.clickAndWait(pageLitAuto.buttonGenererDAV, page);
            })

            test('CheckBox [AFFICHER TOUS LES LITIGES] - UnClick', async() => {
                await fonction.clickElement(pageLitAuto.checkBoxToutAfficher);
            })

            test('Inputield [LOT] = "' + sNumeroLot + '" #1', async () => {                                
                await fonction.sendKeys(pageLitAuto.inputFieldLot.nth(0), sNumeroLot);
                await fonction.wait(page, 500);
            })

            test('td [LITIGES] = 0', async () => {
                const iNbreLit:number = await pageLitAuto.tdNumLot.count();
                expect(iNbreLit).toEqual(0);//Vérifier que le litige transformé en demande d'avoir a disparu.
            })

            test('Button [GENERER UNE DEMANDE D\'AVOIR] - Is Disabled', async() => {
                await expect(pageLitAuto.buttonGenererDAV).toBeDisabled();
            })

        })  // End  Onglet
      
        test.describe ('Onglet [DEMANDE D\'AVOIR]', async() => {

            test('Onglet DEMANDE D\'AVOIR] - Click', async () => {
                await menu.clickOnglet(sPageName, 'demandeAvoir', page);
            })

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            test('InputField [LOT] = "' + sNumeroLot + '"', async () => {        
                await fonction.sendKeys(pageLitAuto.inputFieldLot, sNumeroLot.trim());
                await fonction.wait(page, 500);    //-- Attente raffraîchissement page
            })

            test('Check [NUM LOT] = "' + sNumeroLot + '"', async () => {        
                const sNumDemAvoir = await pageLitDem.tdNumDemandeAvoir.first().textContent();
                log.set('Numéro de demande d\'avoir générée : ' + sNumDemAvoir);
                expect(await pageLitDem.tdNumLot.first().textContent()).toBe(sNumeroLot);
            })

            test('CheckBox [NUMERO DE LOT][0] - Click', async () => { 
                await fonction.clickElement(pageLitDem.checkBoxListeDemandesAvoir.first());
            })
        
        })  // End  Onglet
      
    })  // End  Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

    test('** CHECK FLUX **', async () => {
       
        const oFlux:TypeEsb   =  { 
            "FLUX" : [
                {
                    NOM_FLUX    : "Diffuser_DemandeAvoirF",
                    TITRE       : "Demande avoir N°%"
                },                      
            ],
            WAIT_BEFORE  : 5000,               
            VERBOSE_MOD  : false
        };

        await esb.checkFlux(oFlux, page);
    })

})  // End describe