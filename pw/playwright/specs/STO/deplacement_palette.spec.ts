/**
 * 
 * @author Vazoumana DIARRASSOUBA
 * @Since 13 - 11 - 2023
 */

const xRefTest      = "STO_SIT_PAL";
const xDescription  = "Déplacer une palette";
const xIdTest       =  258;
const xVersion      = '3.6';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme','rayon'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}               from '@playwright/test';

import { TestFunctions }                from "@helpers/functions";
import { Log }                          from "@helpers/log";
import { EsbFunctions }                 from "@helpers/esb";
import { Help }                         from '@helpers/helpers';

import { MenuStock }                    from "@pom/STO/menu.page";
import { StockStock }                   from '@pom/STO/stock-stock.page';
import { StockSituationDeStocks }       from '@pom/STO/stock-situations-de-stocks.page';

import { AutoComplete, CartoucheInfo, TypeEsb }	from '@commun/types';

//-------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuStock;
let pageStock           : StockStock;
let pageSituationStock  : StockSituationDeStocks;
let esb                 : EsbFunctions;

const log       = new Log();
const fonction  = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const plateforme    = fonction.getInitParam('plateforme','Cremlog');
const sRayon        = fonction.getInitParam('rayon','Fruits et légumes');
const sCommentaire  = 'TEST-AUTO_DeplacementPaletteCommentaire-' + fonction.getToday();
const inouveauStock = 1;
const sMotif        = 'Casse';

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage(); 
    esb                 = new EsbFunctions(fonction);
    menu                = new MenuStock(page, fonction);
    pageStock           = new StockStock(page);
    pageSituationStock  = new StockSituationDeStocks(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test('ListBox [PLATEFORME] = "' + plateforme + '"', async() => {            
        await menu.selectPlateforrme(page, plateforme);      
    })

    test.describe('Page [STOCK]', async () => {    

        var currentPage:string = 'stock';

        test('Page [STOCK] - Click', async () => {
            await menu.click(currentPage, page); 
        })
              
        test.describe('Onglet [SITUATION DE STOCK]', async () => {        
            
            test('Onglet [SITUATION DE STOCK] - Click', async () => {
                await menu.clickOnglet(currentPage, 'stock',  page);
            })
            
            test ('ListBox [RAYON] = "' + sRayon + '"', async () => {
                await pageSituationStock.selectRayon(sRayon, page);
            })

            test('Button [RECHERCHER] - Click', async () => {
                var iTimeout = 300000;
                test.setTimeout(iTimeout);
                await fonction.clickAndWait(pageStock.buttonRechercher, page);
                await pageStock.spinnerOff.waitFor({state:'attached', timeout:iTimeout});
            })

            test('CheckBox [PALETTE][rnd] - Click', async () => {
                await pageStock.checkBoxListeLots.first().waitFor({state:'visible'});
                var iNbPalettes = await pageStock.checkBoxListeLots.count();
                var rnd = Math.floor(fonction.random() * iNbPalettes);
                var sNumeroLot = await pageStock.labelAllNumLots.nth(rnd).textContent();
                log.set('Sélection Lot : ' + sNumeroLot);
                await fonction.clickElement(pageStock.checkBoxListeLots.nth(rnd));                         
            })

            test('Button [MODIFIER LE STOCK] - Click', async () => {
                await fonction.clickAndWait(pageStock.buttonModifierStock, page, 40000);
            })

            var sNomPopin:string   = 'SAISIE DU LOT';
            test.describe ('Popin [' + sNomPopin + ']', async () => {     

                test('Popin [' + sNomPopin + '] - Is Visible -Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test('** INFO **', async () => {
                    var sNumPalette = await pageStock.pLabelNumeroPalette.nth(0).textContent();
                    if (typeof(sNumPalette) ==='string') {
                        sNumPalette = sNumPalette.replace(/\s+/g,' ').trim();
                    }
                    log.set('Sélection Palette : ' + sNumPalette);
                })
    
                test('InputField [COLIS COMPTES] = "'+ inouveauStock + '"', async () => {
                    await fonction.sendKeys(pageStock.pInputSaisieColisComptes.nth(0),  inouveauStock.toString());
                })

                test('InputField [AUTOCOMPLETE][rnd]', async () => {
                    
                    await pageStock.pInputSaisiePaletteFiltre.nth(0).clear();
                    const iRnd = Math.floor(fonction.random() * 9) + 1;
                    var oData:AutoComplete = {
                        libelle         :'ARTICLE',
                        inputLocator    : pageStock.pInputSaisiePaletteFiltre.nth(0),
                        inputValue      : '1',
                        choiceSelector  :'li.gfit-autocomplete-result',
                        choicePosition  : iRnd,
                        verbose         : false,
                        typingDelay     : 100,
                        waitBefore      : 500,
                        page            : page,
                    };
                    await fonction.autoComplete(oData);
                })

                test('ListBox [MOTIF] = "' + sMotif + '"', async () => {
                    if (await pageStock.pListBoxMotif.isEnabled()) {
                        await fonction.listBoxByLabel(pageStock.pListBoxMotif, sMotif, page);
                    } else {
                        log.set('Liste Déroulante "MOTIF" non sélectionnable');
                        test.skip();
                    }
                })

                test('COMMENTAIRE', async () => {
                    await fonction.sendKeys(pageStock.pTextAreaSaisieCommentaire,    sCommentaire);
                })  

                test('Button [SAUVEGARDER] - Click', async () => {
                    await fonction.clickAndWait(pageStock.pButtonSaisieSauvegarder, page);
                })

                test('Popin [' + sNomPopin + '] - Is Not Visible -Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })      

            })               

        })  //-- End Describe Onglet

    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

    test('** Check Flux **', async () =>{
        const oFlux:TypeEsb = { 
            "FLUX" : [ 
                {
                    NOM_FLUX  : "EnvoyerMouvement_Prepa"
                },                
                {
                    NOM_FLUX  : "EnvoyerMouvement_Prefac",
                }, 
                {
                    NOM_FLUX  : "ChangerQuantitesLots",
                },
            ],
            WAIT_BEFORE   : 3000,              
        };
        await esb.checkFlux(oFlux, page);
    })

})