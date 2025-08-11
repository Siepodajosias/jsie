/**
 * @author  Vazoumana DIARRASSOUBA
 * @since   31-10-2023
 * 
 */

const xRefTest      = "STO_SIT_REF";
const xDescription  = "Refuser un lot";
const xIdTest       =  8329; 
const xVersion      = '3.10';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'STO',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme','rayon','fournisseur'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------
const { writeFile } = require('fs');
import { test, type Page}                   from '@playwright/test';

import { TestFunctions }                    from "@helpers/functions";
import { Log }                              from "@helpers/log";
import { EsbFunctions }                     from "@helpers/esb";
import { Help }                             from '@helpers/helpers';

import { MenuStock }                        from "@pom/STO/menu.page";
import { StockSituationDeStocks }           from "@pom/STO/stock-situations-de-stocks.page";

import { CartoucheInfo, TypeEsb }           from '@commun/types';

//-----------------------------------------------------------------------------------------

let page                 : Page;

let menu                 : MenuStock;
let stockSituationStocks : StockSituationDeStocks;

const log        = new Log();
const fonction   = new TestFunctions(log);
const esb        = new EsbFunctions(fonction);

//----------------------------------------------------------------------------------------

var iNbColisEnStock:number  = 0;
var maDate                  = new Date();
var sCommentaire            = "TA Commentaire du refus" + '-' + maDate.getFullYear().toString() + fonction.addZero(maDate.getMonth() + 1).toString() + fonction.addZero(maDate.getDate()).toString() ;

const plateforme            = fonction.getInitParam('plateforme','Cremlog');
const sRayon                = fonction.getInitParam('rayon','Fruits et légumes');
const sFournisseur          = fonction.getInitParam('fournisseur', '');

const sJddFile              = fonction.getLocalConfig('jddLitiges');

// -----------------------------------------------------------------------------------------

var oData = {
    sNumeroLot : null,
};

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page                    = await browser.newPage(); 

    menu                    = new MenuStock(page, fonction);
    stockSituationStocks    = new StockSituationDeStocks(page);
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + '] - ' + xDescription + ' : ', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper      = new Help(info, testInfo, page);
        await helper.init();
    });

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test('ListBox [PLATEFORME] = "' + plateforme + '"', async() => {            
        await menu.selectPlateforrme(page, plateforme);                       // Sélection d'une plateforme par défaut
    })

    test.describe('Page [STOCK]', async () => {    

        var currentPage  = 'stock';

        test('Page [STOCK] - Click', async () => {
            await menu.click(currentPage, page); 
        })
              
        test.describe('Onglet [SITUATION DE STOCK]', () => {   

            test.describe('Section [RECHERCHER LOT] ', () =>{

                test('ListBox [RAYON] = "' + sRayon + '"', async () => {
                    await stockSituationStocks.selectRayon(sRayon, page);
                })

                test('Button [RECHERCHER]  -  Click', async () => {
                    await stockSituationStocks.buttonRechercher.waitFor();
                    await fonction.clickAndWait(stockSituationStocks.buttonRechercher, page, 50000);
                })
            })

            test.describe('Table [ STOCK]', () => {

               test('Table_row [STOCK] - Click', async ({}, testInfo) => {
                    await stockSituationStocks.dataGridStockLine.first().waitFor()
                    const iNombreLigne = await stockSituationStocks.dataGridStockLine.count();
                    var aFournisseur   = await stockSituationStocks.dataGridColumnFournisseur.allTextContents();
                    if(sFournisseur != undefined && sFournisseur !=''){

                        for(let i = 0; i < iNombreLigne; i++){

                            var sFOurnisseur = aFournisseur[i];
                            if(sFOurnisseur.match(sFournisseur)){

                                const sCibleNumeroLot = await stockSituationStocks.dataGridColumnNumeroLot.nth(i).textContent();
                                await fonction.clickElement(stockSituationStocks.dataGridStockLine.nth(i));
                                oData.sNumeroLot = sCibleNumeroLot;
                                log.set('Numero de lot selectionné : ' + sCibleNumeroLot);
                                break;
                            }

                            if((i == iNombreLigne - 1) && (!sFOurnisseur.match(sFournisseur))){

                                log.set('Aucun ligne de stock avec la designation Fournisseur: ' + sFournisseur);
                                const iCibleIndex = Math.floor(fonction.random() * iNombreLigne);   
                                const sCibleNumeroLot = await stockSituationStocks.dataGridColumnNumeroLot.nth(iCibleIndex).textContent();
                                await fonction.clickElement(stockSituationStocks.dataGridStockLine.nth(iCibleIndex));
                                oData.sNumeroLot = sCibleNumeroLot;
                                log.set('Numero de lot selectionné : ' + sCibleNumeroLot);
                            }
                        }
                    }else{

                        const iCibleIndex = Math.floor(fonction.random() * iNombreLigne);   
                        const sCibleNumeroLot = await stockSituationStocks.dataGridColumnNumeroLot.nth(iCibleIndex).textContent();
                        await fonction.clickElement(stockSituationStocks.dataGridStockLine.nth(iCibleIndex));
                        oData.sNumeroLot = sCibleNumeroLot;
                        log.set('Numero de lot selectionné : ' + sCibleNumeroLot);
                    }
                    //-- Ecriture du libellé dans un fichier de JDD au format JSON pour récupératiuon des tests suivants
                    writeFile(testInfo.config.rootDir + sJddFile, JSON.stringify(oData, null, 2), (error) => {
                        if (error) {
                        console.log('An error has occurred ', error);
                        return;
                        }
                        log.set('Enregistrement de la donnée dans le fichier : ' + sJddFile);
                        fonction.addDataSheet('File', 'Write', sJddFile);
                    });
                })

                test('Button [REFUSER] - Click', async () => {
                    await fonction.clickElement(stockSituationStocks.buttonRefuserColis);
                })

                test.describe('Popin [REFUS DU LOT XXXX]', () =>{ 

                    test.describe('Cas > max autorisé', () => {
                        
                        test('Column [NOMBRE DE COLIS EN STOCK] - Is Visible', async () => {
                            var sText = await stockSituationStocks.pColumnColisEnStock.nth(0).textContent();
                            if(sText){
                                iNbColisEnStock = parseInt(sText);
                                log.set("Nombre de colis en stock :" + iNbColisEnStock);
                            }
                        }) 

                        test('InputField [COLIS REFUSES] = "Nombre colis existant + 1"', async () => {
                            await stockSituationStocks.pInputRefuserColis.nth(0).clear();
                            await fonction.sendKeys( stockSituationStocks.pInputRefuserColis.nth(0), (iNbColisEnStock +1).toString(), false, 'Colis Refusés');
                        })

                        test('ListBox [SELECTIONNER UN MOTIF][rnd] - Click', async () => {

                            let motif = stockSituationStocks.pListBoxtifMotifDeRefusItem;
                            
                            await fonction.clickElement(stockSituationStocks.pListBoxtifMotifDeRefus.first());
                            await motif.count().then(async (iChoixMotif) => {
                                let iMCible =  Math.floor(fonction.random() * iChoixMotif); 
                                motif.nth(iMCible).textContent().then(async (sChoix) => {
                                    log.set("Motif selectionné : " + sChoix);
                                    await fonction.clickElement(motif.nth(iMCible));
                                    fonction.addDataSheet('ListBox', 'Motif', sChoix);
                                })
                            })
                        })

                        test('TextArea [COMMENTAIRE] ="' + sCommentaire + '"', async () => {
                            const bEditable = await stockSituationStocks.pTextAreaSaisieCommentaireRefus.isEditable();
                            if(bEditable){
                                await fonction.sendKeys(stockSituationStocks.pTextAreaSaisieCommentaireRefus, sCommentaire, false, sCommentaire);
                            }
                        }) 

                        test('Button [REFUSER] - Click', async () => {
                            await fonction.clickAndWait(stockSituationStocks.pButtonRefuser, page);
                        })
        
                        test('Popin [REFUSER COLIS] - Is Visible - Check', async () => {
                            await fonction.popinVisible(page, 'REFUSER COLIS', true);
                        })    
                    })

                    test.describe('Cas nominal', async () =>{

                        test('InputField [COLIS REFUSES] = "1"', async () => {
                            await fonction.sendKeys(stockSituationStocks.pInputRefuserColis.nth(0), '1', false, 'Colis Refusés');
                        })

                        test('pButton [REFUSER] - Click', async () => {
                            await fonction.clickElement(stockSituationStocks.pButtonRefuser);
                        })

                        test('Popin [REFUSER COLIS] - Is Not Visible - Check', async () => {
                            await fonction.waitTillHTMLRendered(page, 40000);
                            await fonction.popinVisible(page, 'REFUSER COLIS', false);
                        }) 
                    })
                })
            })
        })      

    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

    test('Check Flux', async () =>{
        var oFlux:TypeEsb   =  { 
            FLUX : [ 
                {
                    NOM_FLUX        : "EnvoyerMouvement_Prepa"
                },
                
                {
                    NOM_FLUX        : "EnvoyerMouvement_Prefac"
                }, 
                {
                    NOM_FLUX        : "ChangerQuantitesLots"
                },
                {
                    NOM_FLUX        : "EnvoyerMouvement_Achat",
                },
            ],
            WAIT_BEFORE   : 3000,                 // Optionnel
        };
        await esb.checkFlux(oFlux,page);
    })
    
})