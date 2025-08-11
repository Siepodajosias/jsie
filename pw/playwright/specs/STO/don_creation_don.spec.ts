/**
 * 
 * @desc Créer un don
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 10 - 11 - 2023
 */

const xRefTest      = "STO_DON_CRE";
const xDescription  = "Créer un don";
const xIdTest       =  1889;
const xVersion      = '3.12';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['codeArticle', 'plateforme', 'rayon'],
    fileName    : __filename
}

//----------------------------------------------------------------------------------------
const  { writeFile } = require('fs');
import { test, type Page }            from '@playwright/test';

import { TestFunctions }              from "@helpers/functions";
import { Log }                        from "@helpers/log";
import { EsbFunctions }               from "@helpers/esb";
import { Help }                       from '@helpers/helpers';

import { MenuStock }                  from "@pom/STO/menu.page";
import { StockDons }                  from "@pom/STO/stock-dons.page";
import { StockSituationDeStocks }     from '@pom/STO/stock-situations-de-stocks.page';

import { AutoComplete, CartoucheInfo }from '@commun/types';
import { StockSituation }             from '@pom/STO/stock-situation-palettes.page';

//----------------------------------------------------------------------------------------

let page                :Page;

let menu                : MenuStock;
let pageDon             : StockDons;
let pageSituationStock  : StockSituationDeStocks;
let pageStockSitu       : StockSituation;
let esb                 : EsbFunctions;

const log         = new Log();
const fonction    = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const plateforme  = fonction.getInitParam('plateforme','Cremcentre');
var idArticle     = fonction.getInitParam('codeArticle','C1M8');
const sRayon      = fonction.getInitParam('rayon','Crèmerie');

const sJddFile    = fonction.getLocalConfig('jddDons');

var aCodeArticle  = [];

var oData = {
    sCodeArticle : null,
    sNumLot: null
}

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage(); 
    esb                 = new EsbFunctions(fonction);
    menu                = new MenuStock(page, fonction);
    pageDon             = new StockDons(page);
    pageSituationStock  = new StockSituationDeStocks(page);
    pageStockSitu       = new StockSituation(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + '] - ' + xDescription + ' : ', () => {

    test('Ouverture URL :' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test ('ListBox [PLATEFORME] = "' + plateforme + '"', async() => {            
        await menu.selectPlateforrme(page, plateforme); // Sélection d'une plateforme par défaut
    })

    test.describe ('Page [STOCK]', async () => {    

        var currentPage:string  = 'stock';

        test ('Page [STOCK] - Click', async () => {
            await menu.click(currentPage, page); 
        })
                
        test.describe ('Onglet [SITUATION DE PALETTES]', () => {   

            test ('Onglet [SITUATION DES PALETTES] - Click', async () => {
                await menu.clickOnglet(currentPage, 'situation', page);
            })   

            test ('Toggle [BLOQUEE] - Click', async () =>{
                await fonction.clickElement(pageStockSitu.toggleBloquee);
            })

            test ('Toggle [EN ATTENTE] - Click', async () =>{
                await fonction.clickElement(pageStockSitu.toggleEnAttente);
            })

            test ('Button [RECHERCHER] - Click', async () => {
                await fonction.clickAndWait(pageStockSitu.toggleRechercher, page);
            })

            test ('** Wait Until Spinner Off **', async () => {
                await fonction.waitForSpinner(pageStockSitu.spinner);
            })

            test ('Get numero lot et code article', async () => {
                const sCodeArticle = await pageStockSitu.dataGridColumnCodeArticle.allTextContents();
                if(sCodeArticle != null){
                    aCodeArticle = sCodeArticle;
                }
            })
        })

        test.describe ('Onglet [SITUATION DE STOCK]', () => {   

            test ('Onglet [SITUATION DES PALETTES] - Click', async () => {
                await menu.clickOnglet(currentPage, 'stock', page);
            }) 

            test ('ListBox [RAYON] = "'+sRayon+'"', async () => {
                await fonction.clickElement(pageSituationStock.multiSelectRayon);
                await fonction.clickElement(pageSituationStock.multiSelectItemRayon.locator('span:text-is("'+sRayon+'")'));
            })

            test('Button [FERMER MULTISELECT]',async ()=>{
                await fonction.clickElement(pageSituationStock.pMultiselectCloseIcon)
            })

            test ('Button [RECHERCHER] - Click', async () => {
                await fonction.clickAndWait(pageSituationStock.buttonRechercher, page);
            })

            test ('** Wait Until Spinner Off **', async () => {
                await fonction.waitForSpinner(pageSituationStock.spinnerOn);
            })

            test ('DataGrid Header [COLIS EN STOCK] - Click x 2', async () => {
                await fonction.clickElement(pageDon.dataGridColisEnStock);
                await fonction.clickElement(pageDon.dataGridColisEnStock);
            })

            test ('Span [NUMERO LOT] [CODE ARTICLE]', async ({}, testInfo) => {
                var iNbr = await pageSituationStock.dataGridColumnCodeArticle.count();
                for(let i=0; i< iNbr; iNbr++){
                    var sCodeArticle = await pageSituationStock.dataGridColumnCodeArticle.nth(i).textContent();
                    if(aCodeArticle.includes(sCodeArticle)){
                        log.set('L\'article avec le code : ' + sCodeArticle + ' est soit manquant, soit bloqué, ou soit en attente');
                    }else{
                        const sNumLot    = await pageSituationStock.dataGridColumnNumeroLot.nth(i).textContent();
                        if(sCodeArticle != null){
                            idArticle    = sCodeArticle;
                        }
                       
                        oData.sCodeArticle= sCodeArticle;
                        oData.sNumLot     = sNumLot;
                        log.set('Code article : ' + sCodeArticle);
                        log.set('Numéro lot : ' + sNumLot);

                        //-- Ecriture du libellé dans un fichier de JDD au format JSON pour récupératiuon des tests suivants
                        writeFile(testInfo.config.rootDir + sJddFile, JSON.stringify(oData, null, 2), async (error:any) => {
                            if (error) {
                              console.log('An error has occurred ', error);
                              return;
                            }
                            log.set('Enregistrement de la donnée dans le fichier : ' + sJddFile);
                            await fonction.addDataSheet('File', 'Write', sJddFile);
                        });
                        break;
                    }
                }
            })
        })

        test.describe ('Onglet [DONS]', async () => {        
            
            test ('Onglet [DONS] - Click', async () => {
                await menu.clickOnglet(currentPage, 'dons', page);
            })   

            test ('Button [CREER UN DON] - Click', async () => {
                await fonction.clickAndWait(pageDon.buttonCreerDon, page, 40000);
            })

            var sNomPopin:string = 'CREATION D\'UN DON';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {            

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                if(idArticle != null){
                    test ('InputField [AUTOCOMPLETE][ARTICLE]', async () => {
                        log.set('Article pour lautocomplete : ' + idArticle);
                        var oData:AutoComplete = {
                            libelle         :'ARTICLE',
                            inputLocator    : pageDon.pPinputArticleDon,
                            inputValue      : idArticle,
                            choiceSelector  :'li.gfit-autocomplete-result',
                            choicePosition  : 0,
                            typingDelay     : 100,
                            waitBefore      : 500,
                            page            : page,
                        };
                        await fonction.autoComplete(oData);
                    })
    
                    test ('InputField [LOT] = "' + oData.sNumLot + '"', async () => {
                        await fonction.sendKeys(pageDon.pPinputNumLotDon, oData.sNumLot, false, 'Lot');
                    })
    
                    test ('Button [RECHERCHER] - Click', async () => {
                        await fonction.clickAndWait(pageDon.pPbuttonRechercherDon, page, 50000);
                    })
    
                    test ('CheckBox[ARTICLE][0] - Click', async () => {
                        await fonction.clickElement(pageDon.pPcheckBoxArticleDonable.nth(0));
                    })
    
                    test ('Button [AJOUTER] - Click', async () => {
                        await fonction.clickElement(pageDon.pPbuttonAjouterDon);
                    })
    
                    test ('Button [ENREGISTRER] - Click', async () => {
                        await fonction.clickAndWait(pageDon.pPbuttonEnregistrerDon, page);
                    })
                }

                else {
                    log.set('Aucun lot disponible pour pouvoir créer le Don');
                }
            })
        })
    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

    test ('** CHECK FLUX **', async () =>  {

        if (idArticle != null) {

            const oFlux = { 
                FLUX : [
                    {
                        NOM_FLUX    : "EnvoyerMouvement_Prepa",
                    }, 
                    {
                        NOM_FLUX    : "EnvoyerMouvement_Prefac",
                    }, 
                    {
                        NOM_FLUX    : "ChangerQuantitesLots",
                    }, 
                ],
                WAIT_BEFORE     : 3000,  // Optionnel
            };

            await esb.checkFlux(oFlux, page);
        } else {
            log.set('Check Flux : ACTION ANNULEE');
            test.skip();
        }
    })
})