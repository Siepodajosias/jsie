/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 01 - 12 - 2023
 */

const xRefTest      = "MAG_AUT_CAD";
const xDescription  = "Exporter un Cadencier";
const xIdTest       =  1711;
const xVersion      = '3.8';

var info = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}               from '@playwright/test';

import { TestFunctions }                from "@helpers/functions";
import { Log }                          from "@helpers/log";
import { Help }                         from '@helpers/helpers';

import { MenuMagasin }                  from '@pom/MAG/menu.page';
import { AutorisationsAchatsCentrale }  from '@pom/MAG/autorisations-achats_centrale.page';
import { AutoComplete }              from '@commun/types';

//-------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuMagasin;
let pageAutAchCent  : AutorisationsAchatsCentrale;

const log           = new Log();
const fonction      = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const aLettres      = ['...','~','§','a','e','i','o','m','p','l','s','r'];
const iNbEssaiMax   = 10;

//-----------------------------------------------------------------------------------------

var searchByTable = async (aTable:string[], locator:any) => {

    var valeurRecherchee = '';
    log.set('---------------  RECHERCHE DE VALEUR POUR LE CHAMP AUTOCOMPLETE  ---------------')
    for (let i = 0; i < aTable.length - 1; i++){
        var searchResult = 'li.gfit-autocomplete-result';
        await locator.clear();
        await locator.pressSequentially(aTable[i]);
        await fonction.wait(page, 2000);
        var iNbReponses = await page.locator(searchResult).count();
        var isVisible = await page.locator(searchResult).first().isVisible();
        console.log(aTable[i]);
        console.log(iNbReponses);
        console.log(isVisible);
        if (iNbReponses > 0){
            valeurRecherchee = aTable[i];
            break;
        }else{
            log.set('Aucune correspondance trouvé pour la valeur : ' + aTable[i])
        }
    }
    log.separateur()
    return valeurRecherchee;
}
//----------------------------------------------------------------------------------------

/**
 * 
 * @param {integer} iNbAssortiments 
 * @param {integer} iNumEssai 
 * @description Recherche récursive d'un assortiment jusqu'à ce qu'il contiennne des données
 */
var selectAssortiment = async (iNbAssortiments:number, iNumEssai: number = 0) => {
    var iAssortCible = Math.floor(fonction.random() * iNbAssortiments);
    iNumEssai = iNumEssai + 1;
    log.set("Essai #" + iNumEssai);
    log.set("Cible : " + iAssortCible +"/" + iNbAssortiments);
    await pageAutAchCent.trLignesAssortiments.nth(iAssortCible).click();
    var lignesArticlesIsVisible = await pageAutAchCent.trLignesArticles.first().isVisible();
    if(lignesArticlesIsVisible){
        var iNbLignes = await pageAutAchCent.trLignesArticles.count();
        if (iNumEssai < iNbEssaiMax && iNbLignes > 1) {
            selectAssortiment(iNbAssortiments, iNumEssai);
            log.separateur();
        } else {
            var sLibelleAssortiment = await pageAutAchCent.trLignesAssortiments.nth(iAssortCible).textContent();
            log.set("Assortiment : " + sLibelleAssortiment);                        
            log.set("Nombre d'articles : " + iNbLignes);
        }
    }else{
        log.set('AUCUNE LIGNE D\'ARTICLES');
    }
}

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageAutAchCent  = new AutorisationsAchatsCentrale(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    // var bDocumentTelechargeable = true;
    var bTestsExecutable        = false;
    var download:any;

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

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

    test.describe('Page [AUTORISATIONS]', async () => {

        var pageName = 'autorisations';

        test('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(pageName, page); 
        })
        
        test.describe ('Onglet [ACHAT CENTRALE]', async () => {        

            test('Onglet [ACHAT CENTRALE] - Click', async () => {
                await menu.clickOnglet(pageName, 'autorisationAchatCentrale', page);
            })

            test('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })         

            test('td [ASSORTIMENT][rnd] - Click', async() => {
                var isVisible = await pageAutAchCent.trLignesAssortiments.first().isVisible();
                if (isVisible){
                    var iNbAssortiments = await pageAutAchCent.trLignesAssortiments.count();
                    log.set("Nombre d'assortiments : " + iNbAssortiments);
                    selectAssortiment(iNbAssortiments);
                }
            })

            test('Button [EXPORTER CADENCIER] - Click', async () => {
                await fonction.clickAndWait(pageAutAchCent.buttonExporter, page); 
            })

            var sNomPopin = 'EXPORT DU CADENCIER'
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', () => {
               
                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible - Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test('InputField [AUTOCOMPLETE][MAGASIN][Rnd]', async () => {
                    
                    var val = await searchByTable(aLettres, pageAutAchCent.pInputMagasin);

                    if(val != undefined && val !=''){

                        bTestsExecutable = true;
                        log.set('InputField [AUTOCOMPLETE][MAGASIN][Rnd] = "'+val + '"' );
                        var oData:AutoComplete = {
                            libelle         : 'MAGASIN',
                            inputLocator    : pageAutAchCent.pInputMagasin,
                            clear           : true,
                            inputValue      : val,
                            choiceSelector  : 'li.gfit-autocomplete-result',
                            choicePosition  : 0,
                            typingDelay     : 100,
                            waitBefore      : 500,
                            page            : page,
                        };
                        await fonction.autoComplete(oData);

                    }else{

                        log.set('InputField [AUTOCOMPLETE][MAGASIN][Rnd]: ACTION ANNULEE');
                        test.skip();
                    }
                })

                test('Button [EXPORTER] - Click', async () => {
                    var isEnabled = await pageAutAchCent.pPbuttonExporter.isEnabled();
                    if(bTestsExecutable){
                        if (isEnabled){
                            [download] = await Promise.all([
                                page.waitForEvent('download'),
                                pageAutAchCent.pPbuttonExporter.click(),
                            ]);
    
                            log.set('Document téléchargeable !');
                        }else{
                            log.set('Button [EXPORTER] - Click : ACTION ANNULEE');
                            // bDocumentTelechargeable = false;
                            test.skip();
                        }
                    }else {
                        log.set('Button [EXPORTER] - Click : ACTION ANNULEE');
                        test.skip();
                    }
                })

                test('Link [ANNULER] - Click Conditionnel', async () => {
                    if (await pageAutAchCent.pExportButtonFermer.isVisible()){
                        await pageAutAchCent.pExportButtonFermer.click();
                    }else {
                        console.log('Link [ANNULER] - Click: ANNULER')
                        test.skip()
                    }
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible - Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })

                test('Download File [EXTENSION] = "csv"', async () => {
                    if (bTestsExecutable) {
                        fonction.downloadedFile(download,'csv', 100)
                    } else {
                        log.set('Download File [EXTENSION] = "csv": ACTION ANNULEE')
                        test.skip();
                    }
                })

            })

        })

    }) // End describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
})