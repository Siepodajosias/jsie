/**
 * @author JOSIAS SIE
 * @since   02-11-2023
 * 
 */
const xRefTest      = "ACH_LIT_AGR";
const xDescription  = "Refus agréage Litige";
const xIdTest       =  8088;
const xVersion      = '3.6';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest, 
    help        : [],           
    params      : ['rayon','quantiteRefusee','quantiteNonConforme', 'numLot','dossierAchat','motif'],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { test, type Page, expect }     from '@playwright/test';
import { Help }                        from '@helpers/helpers';
import { TestFunctions }               from '@helpers/functions';
import { Log }                         from '@helpers/log';
import { CartoucheInfo }               from '@commun/types';
//-- PageObject ----------------------------------------------------------------------
import { MenuAchats }                  from '@pom/ACH/menu.page'; 
import { RefusAgreageLitige }          from '@pom/ACH/refus-agreage_litige.page';
import { PageLitLitAut }               from '@pom/ACH/litiges_litiges-automatiques.page'

//------------------------------------------------------------------------------------
let page                  : Page;
let menu                  : MenuAchats;
let pageLitige            : RefusAgreageLitige;
let pageLitigeAuto        : PageLitLitAut;

const fonction            = new TestFunctions();
const log                 = new Log();
// Varibles ---- ---------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
     page                 = await browser.newPage();
     menu                 = new MenuAchats(page, fonction);
     pageLitige           = new RefusAgreageLitige(page); 
     pageLitigeAuto       = new PageLitLitAut(page);
     const helper = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})
  
//------------------------------------------------------------------------------------ 

var oData:any             = fonction.importJdd();        // Récupération du JDD et des données du E2E en cours si ils existent
// Exploitation des paramètres passés dans le JDD E2E -OU- passés en argument OU ceux présents dans le fichier de configuration Local

const sRayon               = fonction.getInitParam('rayon','Fruits et légumes');
const sQuantiteRefuses     = fonction.getInitParam('quantiteRefusee','5');
const sQuantiteNonConforme = fonction.getInitParam('quantiteNonConforme', '10');
const sCodeArticle         = fonction.getInitParam('listeArticles','5254');
const sDossierAchat        = fonction.getInitParam('dossierAchat','Tous');
const sMotif               = fonction.getInitParam('motif','Mauvaise qualité');
var sNumeroLot    		   = fonction.getInitParam('numLot','W929');

var sDossierAcha = '-- ' + sDossierAchat + ' --';
//------------------------------------------------------------------------------------    

if (oData !== undefined) {                              // On est dans le cadre d'un E2E. Récupération des données temporaires
    var sNumLotE2E  = oData.aLots[sCodeArticle];                    // L'élément recherché est le numéro du lot préalablement créé dans le E2E
    sNumeroLot      = sNumLotE2E;                       // Récupération du numero du lot                     
    log.set('E2E - Numéro du lot : ' + sNumLotE2E);   
}

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', async () => {  
    
    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [LITIGES]', async () => {

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {                    
            await menu.selectRayonByName(sRayon, page);
        })

        var pageName = 'litiges';
        test ('Page [LITIGES] - Click', async () => {
            await menu.click(pageName, page);
        })

        test.describe('Onglet [LITIGES AUTOMATIQUES]', async () => {

            test('', async () => {
                await fonction.listBoxByLabel(pageLitigeAuto.listBoxDossierAchat, sDossierAcha, page);
            })

            test('Input [NUMERO DE LOTS] = "' + sNumeroLot +'"' , async () => { //
                if(sNumeroLot){
                    await fonction.sendKeys(pageLitige.inputNumeroLot, sNumeroLot); 
                    await fonction.wait(page, 500);
                    log.set('Numéro de lot : ' + sNumeroLot);
                }
                
            })

            test.describe('DataGrid [LISTE] [LITIGE AGREAGE]', async () => {   

                test('Datepicker [TYPE DE LITIGE] [REFUS AGREAGE] - Click', async () => { 
                    await pageLitige.datagridLitigeAgreage.first().waitFor({state:'visible'}); // Attendez que le premier élément soit visible
                    if(pageLitige.datagridLitigeAgreage.first() != undefined){
                        await fonction.clickAndWait(pageLitige.datagridLitigeAgreage.nth(0), page);
                        const quantite = await pageLitige.spanQuantiteLitige.nth(0).textContent();
                        expect(quantite).toEqual(sQuantiteRefuses);
                        const nature = await pageLitige.spanNatureLitige.nth(0).textContent();
                        const sMotifCombine:string = "Refus à l'agréage (" + sMotif + ")";
                        expect(nature).toContain(sMotifCombine);
                    }
                    else{
                        //log('log : Elément ngListBoxAbsent');
                    }
                })

                test('Datepicker [TYPE DE LITIGE] [QUANTITE NON CONFORME] - Click', async () => {
                    await pageLitige.datagridLitigeAgreage.first().waitFor({state:'visible'}); // Attendez que le premier élément soit visible
                    if(pageLitige.datagridLitigeAgreage.first() != undefined){
                        await fonction.clickElement(pageLitige.datagridLitigeAgreage.first());
                        await fonction.clickAndWait(pageLitige.datagridLitigeAgreage.nth(1), page);
                        const quantite = await pageLitige.spanQuantiteLitige.nth(1).textContent();
                        expect(quantite).toEqual(sQuantiteNonConforme);
                        const nature = await pageLitige.spanNatureLitige.nth(1).textContent();
                        expect(nature).toContain("Quantité non conforme au BL");                            
                    }else{
                        //log('log : Elément ngListBoxAbsent');
                    }
                })
            })
        })
    }) // end test.describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
}) 