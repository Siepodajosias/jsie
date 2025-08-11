/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 04 - 01 - 2024
 */

const xRefTest      = "MAG_DON_CAS";
const xDescription  = "DON - Transformer en casse";
const xIdTest       =  1136;
const xVersion      = '3.3';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['ville', 'groupeArticle'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}   from '@playwright/test';

import { TestFunctions }    from "@helpers/functions";
import { Log }              from "@helpers/log";
import { Help }             from '@helpers/helpers';

import { MenuMagasin }      from '@pom/MAG/menu.page';
import { StockDons }        from '@pom/MAG/stock-dons.page';

import { CartoucheInfo }    from '@commun/types';

//-------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pageStockDons       : StockDons;

const log               = new Log();
const fonction          = new TestFunctions(log);

//----------------------------------------------------------------------------------------

var maDate           = new Date();
var sContenuNumBon   = fonction.getToday('US');

const sVilleCible    = fonction.getInitParam('ville','Malemort (G914)');
const sGroupeArticle = fonction.getInitParam('groupeArticle','Marée');

//---------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageStockDons   = new StockDons(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [ACCUEIL]', async () => {

        test('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if(isVisible){

                await menu.removeArlerteMessage(page);
            }else{
                
                log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                test.skip();
            }
        })
    })
 
    test.describe('Page [STOCK]', async () => {

        var pageName:string= 'stock';
        var iNbDons:any    = 0;

        test('Page [STOCK] - Click', async () => {
            await menu.click(pageName,page);
        })

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })   

        test('ListBox [VILLE] = "' + sVilleCible + '"', async () => {
            await menu.selectVille(sVilleCible, page);
        })   

        test.describe ('Onglet [DONS]', async() => {

            test('Onglet [DONS] - click', async () => {
                await menu.clickOnglet(pageName, 'dons', page);
            })
    
            test('Label [ERREUR] - Is Not Visible', async () => {      // Pas d'erreur affichée à priori au chargement de l'onglet
                await fonction.isErrorDisplayed(false, page);
            }) 

            test('ListBox [GOUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
                await fonction.listBoxByLabel(pageStockDons.listBoxGrpArticle, sGroupeArticle, page);
            })

            // Selectionner la date du jour pour faciliter la recherche du dond dans la liste
            test('DatePicker [PERIODE DU] = "' + maDate.getDate()+ '"', async () => {
                await fonction.clickElement(pageStockDons.datePickerFromIcon);
                var iNbJourActifs = await pageStockDons.datePickerDays.count();
                for (let iIndexJour = 0; iIndexJour < iNbJourActifs; iIndexJour ++){
                    var sJour = await pageStockDons.datePickerDays.nth(iIndexJour).textContent();
                    if(sJour == maDate.getDate().toString()){
                        await fonction.clickElement(pageStockDons.datePickerDays.nth(iIndexJour));
                        break;
                    }
                }
            })

            test('Lignes [DONS][...' + sContenuNumBon + '...] - Click"', async () =>{
                iNbDons = await pageStockDons.tdNumeroBon.count();
                for(let iIndexLigne = iNbDons - 1; iIndexLigne >= 0; iIndexLigne --){
                    var sNumeroDons = await pageStockDons.tdNumeroBon.nth(iIndexLigne).innerText();
                    if(sNumeroDons.includes(sContenuNumBon)){

                        await fonction.clickElement(pageStockDons.tdNumeroBon.nth(iIndexLigne));
                        log.set('Sélection DON #' + (iIndexLigne + 1) + '/' + iNbDons);

                        var sNumBon = await pageStockDons.tdNumeroBon.nth(iIndexLigne).innerText();
                        log.set('Numéro Bon : ' + sNumBon);
                        
                        var sDateDon = await pageStockDons.tdDateDon.nth(iIndexLigne).innerText();
                        log.set('Date Don : ' + sDateDon);

                        var sNomBenef = await pageStockDons.tdBeneficiaireDon.nth(iIndexLigne).innerText();
                        log.set('Bénéficiare : ' + sNomBenef);

                        var sGroupe = await pageStockDons.tdGroupe.nth(iIndexLigne).innerText();
                        log.set('Groupe : ' + sGroupe);

                        var sCodeArticle = await pageStockDons.tdCodeArticle.nth(iIndexLigne).innerText();
                        log.set('Code Article : ' + sCodeArticle);

                        var sDesignArticle = await pageStockDons.tdDesignationArticle.nth(iIndexLigne).innerText();
                        log.set('Désignation Article : ' + sDesignArticle);
                    
                        var sQteUnit = await pageStockDons.tdQuantiteUnitaire.nth(iIndexLigne).innerText();
                        log.set('Quantité Unitaire : ' + sQteUnit);

                        var sPoids = await pageStockDons.tdPoids.nth(iIndexLigne).innerText();
                        log.set('Quantité Unitaire : ' + sPoids);
                        break;
                    } else {
                        log.set('Ignoré : ' + sNumeroDons);
                        console.log('Ignoré : ' + sNumeroDons);
                        
                    }
                }
            })

            var sNomPopin:string = "Confirmer la transformation des dons en casse";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + '] ', async () => {

                test('ChechBox [DON][first] - Click"', async () =>{
                    if (iNbDons > 0) {
                        await fonction.clickElement(pageStockDons.checkBoxFirstResponse);
                    } else {
                        log.set('Aucun don sélectionnable');
                        test.skip();
                    }
                })

                test('Button [TRANSFORMER EN CASSE] - Click', async () =>{
                    if (iNbDons > 0) {
                        await fonction.clickAndWait(pageStockDons.buttonTransformerCasse, page);
                    } else {
                        test.skip();
                    }
                })
                
                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    if (iNbDons > 0) {
                        await fonction.popinVisible(page, sNomPopin, true);
                    } else {
                        test.skip();
                    }
                })

                test('Button [OUI] - Click', async () =>{
                    if (iNbDons > 0) {
                        await fonction.clickAndWait(pageStockDons.pButtonTransformerOui, page);
                    } else {
                        test.skip();
                    }
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    if (iNbDons > 0) {
                        await fonction.popinVisible(page, sNomPopin, false);
                    } else {
                        test.skip();
                    }
                })
            })

        }) // End Describe Onglet

    }) // End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})
