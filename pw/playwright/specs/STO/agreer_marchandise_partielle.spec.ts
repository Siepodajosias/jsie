/**
 * @author  Josias SIE
 * @since   30-10-2023
 * 
 */
const xRefTest      = "STO_AGR_PAR";  
const xDescription  = "Accepter partiellement la marchandise reçue";
const xIdTest       =  266;
const xVersion      = '3.3'; 

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,
    refTest     : [xRefTest], 
    idTest      : xIdTest, 
    help        : [],         
    params      : ['plateFormeReception', 'acheteur' , 'fournisseur','quantiteRefusee', 'numLot','motif'],
    fileName    : __filename
}; 

//------------------------------------------------------------------------------------

import { test, type Page }             from '@playwright/test';

import { Help }                        from '@helpers/helpers';
import { TestFunctions }               from '@helpers/functions';
import { Log }                         from '@helpers/log';
import { CartoucheInfo }               from '@commun/types';
//-- PageObject ----------------------------------------------------------------------
import { MenuStock }                   from '@pom/STO/menu.page'; 
import { AgreerMarchandisePartielle }  from '@pom/STO/agreer-marchandise_partielle.page.js';

//------------------------------------------------------------------------------------

let page                  : Page;
let menu                  : MenuStock;
let pageLotAgreer         : AgreerMarchandisePartielle;

const fonction            = new TestFunctions();
const log                 = new Log();
// Varibles ---- ---------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
     page                 = await browser.newPage();
     menu                 = new MenuStock(page, fonction);
     pageLotAgreer        = new AgreerMarchandisePartielle(page); 
     const helper      = new Help(info, testInfo, page);
     await helper.init();
});

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})
  
//------------------------------------------------------------------------------------

var oData:any           = fonction.importJdd();        // Récupération du JDD et des données du E2E en cours si ils existent

// Exploitation des paramètres passés dans le JDD E2E -OU- passés en argument OU ceux présents dans le fichier de configuration Local
const sPlateforme       = fonction.getInitParam('plateFormeReception', 'Chaponnay');
const sAcheteur         = fonction.getInitParam('acheteur', 'LUNETTES Kevin');
const sFournisseur      = fonction.getInitParam('fournisseur','Dole exotics'); 
const sCodeArticle      = fonction.getInitParam('listeArticles','5254');
const sQuantiteRefuses  = fonction.getInitParam('quantiteRefusee','5');  
var sNumeroLot    		= fonction.getInitParam('numLot', '5');  
const sMotif            = fonction.getInitParam('motif','Taille / calibre');

//------------------------------------------------------------------------------------    

if (oData !== undefined) {                                  // On est dans le cadre d'un E2E. Récupération des données temporaires
    var sNumLotE2E  = oData.aLots[sCodeArticle];                        // L'élément recherché est le numéro du lot préalablement créé dans le E2E
    sNumeroLot      = sNumLotE2E                            // Récupération du numero du lot                     
    log.set('E2E - Numéro du lot : ' + sNumLotE2E);         
}

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']' , async () => {      
     
    test('Ouverture URL: ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe ('Page [RECEPTION]', async () => {

        var sNomPage = 'reception';
        test ('Page [RECEPTION] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 

        test.describe ('Onglet [LOTS A AGREER]', async () => {

            test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {                    
                await menu.selectPlateforrme(page, sPlateforme);
                log.set('Plateforme : ' + sPlateforme);
            })

            test('Onglet [LOTS A AGREER] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'LotsAAgreer', page);
            })

            test('Input [ACHETEUR] = "'+  sAcheteur + '"', async () => {
                await pageLotAgreer.setAcheteur(sAcheteur);
                log.set('Acheteur : ' + sAcheteur);
            })

            test('ListBox [FOURNISSEURS] = "' + sFournisseur + '"', async () => { 

                // Dépliage de la Liste Déroulante
                await fonction.clickAndWait(pageLotAgreer.listBoxFournisseurs, page);

                // Nombre de choix
                let iNbOptions = await pageLotAgreer.listBoxFournisseurs.locator('option').count();

                const sMajFournisseur = sFournisseur.toUpperCase();

                let sCible:string = '';

                for (let iCpt = 0; iCpt < iNbOptions; iCpt++) {

                    // Examen de chaque choix
                    var sChoix = await pageLotAgreer.listBoxFournisseurs.locator('option').nth(iCpt).textContent();

                    //Mise en Majuscule et suppression des espaces exédentaires
                    var sMajChoix = sChoix?.toUpperCase().replace(/\s+/g,' ').trim();
                    
                    // Comparaison du choix proposé en majuscule avec la cible (sFournisseur) en majuscule
                    if( sMajChoix == sMajFournisseur && sChoix !== null) {
                        //console.log(">>>>>>>>>>>>> Cible : " + sFournisseur + " - " + sChoix);
                        sCible = sChoix;
                        break;
                    }
                }

                // Sélection sur la base de la cible...
                if (sCible != '') {
                    await pageLotAgreer.listBoxFournisseurs.selectOption(sCible);
                }
                
                // Repliage de la Liste Déroulante
                await fonction.clickElement(pageLotAgreer.listBoxFournisseurs);

                log.set('Fournisseur : ' + sFournisseur);
            })

            test.describe('Datagrid [LOTS A AGREER][FOURNISSEUR] = "' + sNumeroLot +'"' , async () => {     

                test('Tr [LOTS A AGREER] - Click', async () => {
                    await pageLotAgreer.trNumeroLot.first().waitFor({state:'visible'}); // Attendez que le premier élément soit visible
                    if(pageLotAgreer.trNumeroLot.first() != undefined){
                        const selector = `:text("${sNumeroLot}")`;
                        await fonction.clickElement(page.locator(selector));
                        log.set('Numéro Lot : ' + sNumeroLot);
                    } 
                })

                test('Button [AGREER] - Click', async () => {
                    await fonction.clickAndWait(pageLotAgreer.buttonAgreer, page);
                })

                test.describe ('Popin [AGREAGE DU LOT]', async () => {   
                      
                    test('Tr [LOTS A AGREER] - Click', async () => {
                        await pageLotAgreer.trNumeroLot.first().waitFor({state:'visible'}); // Attendez que le premier élément soit visible
                        if(pageLotAgreer.trNumeroLot.first() != undefined){
                            await fonction.clickElement(pageLotAgreer.dataGridLotsAgreerDuLot.locator('tbody > tr'));
                        }
                    })

                    test('CheckBox [ARRIVAGE SELECTIONNE] - Click', async () => {
                        await fonction.clickElement(pageLotAgreer.pCheckBoxSelectionMultiple);
                    })

                    test('ListBox [MOTIF] - Select "Taille"', async () => {
                        await pageLotAgreer.pDataGridListeArrivage.first().waitFor({state:'visible'}); // Attendez que le premier élément soit visible 
                        if(pageLotAgreer.pDataGridListeArrivage.first() != undefined){
                            await fonction.clickAndWait(pageLotAgreer.pInputMotif, page);
                            await pageLotAgreer.pInputMotif.selectOption({label: sMotif});
                            await fonction.clickElement(pageLotAgreer.pInputMotif);
                        } 
                    })
                    
                    test('Button [APPLIQUER LA SELECTION] - Click', async () => {
                        await fonction.clickElement(pageLotAgreer.pButtonAppliquerSelection);
                    })

                    test('Input [COLIS REFUSES] - Select "' + sQuantiteRefuses + '"', async () => {
                        await fonction.clickAndWait(pageLotAgreer.pInputColisRefuses, page);
                        await fonction.sendKeys(pageLotAgreer.pInputColisRefuses, sQuantiteRefuses);
                        log.set('Quantité Refusée : ' + sQuantiteRefuses);
                    })
    
                    test('Button [SAUVEGARDER] - Click', async () => {
                        await fonction.clickElement(pageLotAgreer.pButtonSauvegarder);
                    })
                })
            })      
        }) // end test.describe Onglet          

    }) // end test.describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

}) // end test.describe Test