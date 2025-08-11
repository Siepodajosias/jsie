/**
 * @author JOSIAS SIE
 * @since   02-11-2023
 * 
 */
const xRefTest      = "ACH_REC_PAL1.2";
const xDescription  = "Vérifier quantité receptionner et agréées";
const xIdTest       =  8091;
const xVersion      = '3.2';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : ['rayon','quantiteReceptionner','quantiteAchetee','quantiteAgrees','numAchatLong'],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { test, type Page, expect }           from '@playwright/test';
import { Help }                              from '@helpers/helpers';
import { TestFunctions }                     from '@helpers/functions';
import { Log }                               from '@helpers/log';
import { CartoucheInfo }                     from '@commun/types';
//-- PageObject ----------------------------------------------------------------------

import { MenuAchats }                        from '@pom/ACH/menu.page'; 
import { VerifierQuantiteReceptionnerAgrees }from '@pom/ACH/verifier-quantite_receptionner_agrees.page.js';

//------------------------------------------------------------------------------------
let page                  : Page;
let menu                  : MenuAchats;
let pageAchat             : VerifierQuantiteReceptionnerAgrees;

const fonction            = new TestFunctions();
const log                 = new Log();
// Varibles ---- ---------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                 = await browser.newPage();
    menu                 = new MenuAchats(page, fonction);
    pageAchat            = new VerifierQuantiteReceptionnerAgrees(page); 
    const helper = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------  
var oData: any             = fonction.importJdd();        // Récupération du JDD et des données du E2E en cours si ils existent

// Exploitation des paramètres passés dans le JDD E2E -OU- passés en argument OU ceux présents dans le fichier de configuration Local

const sRayon               = fonction.getInitParam('rayon','Fruits et légumes');
const sQuantiteReceptionner= fonction.getInitParam('quantiteReceptionner','90');
const sQuantiteAchetee     = fonction.getInitParam('quantiteAchetee', '100');
const sQuantiteAgrees      = fonction.getInitParam('quantiteAgrees', '85');
var   sNumeroAchat         = fonction.getInitParam('numAchatLong', '');
//------------------------------------------------------------------------------------    

if (oData !== undefined) {                          // On est dans le cadre d'un E2E. Récupération des données temporaires
    var sNumAchatE2E = oData.sNumAchatLong;        // L'élément recherché est le numéro d'achat préalablement créé dans le E2E  
    sNumeroAchat     = sNumAchatE2E;              // Récupération du numero long de l'achat             
    log.set('E2E - Numéro achat : ' + sNumAchatE2E );
}

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', async () => {  

    test('Ouverture URL: ' + fonction.getApplicationUrl(), async({context}) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACCUEIL]', async () => {

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {                    
            await menu.selectRayonByName(sRayon, page);
        })

        test.describe('Onglet [RECHERCHE LOT]', async () => {

            test('Input [NUMERO ACHAT] = "' + sNumeroAchat + '"', async () => {
                if(sNumeroAchat){
                    await fonction.sendKeys(pageAchat.inputNumeroAchat, sNumeroAchat);
                    log.set('E2E - Numéro achat : ' + sNumeroAchat);
                }
            })
            
            test('Button [RECHERCHER] - Click', async () => {
                await fonction.clickAndWait(pageAchat.buttonRechercher, page);
            })
            
            test.describe('DataGrid [LOTS RECEPTIONNER]', async () => {
                
                test('Td [NUMERO DE LOT] - Click', async () => {
                    await fonction.clickAndWait(pageAchat.tdNumeroLot, page);
                })

                test('DataGrid [LOTS RECEPTIONNER] [SECONDAIRE] - Check', async () => {
                    await pageAchat.datagridLotReceptionner.first().waitFor({state:'visible'}); // Attendez que le premier élément soit visible
                    if(pageAchat.datagridLotReceptionner.first() != undefined){
                        const quantiteAchetee = await pageAchat.tdQuantiteAchetee.textContent();
                        expect(quantiteAchetee).toEqual(sQuantiteAchetee);

                        const quantiteReceptionner = await pageAchat.tdQuantiteReceptionner.textContent();
                        expect(quantiteReceptionner).toEqual(sQuantiteReceptionner);

                        const quantiteAgrees = await pageAchat.tdQuantiteAgrees.textContent();
                        expect(quantiteAgrees).toEqual(sQuantiteAgrees);

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