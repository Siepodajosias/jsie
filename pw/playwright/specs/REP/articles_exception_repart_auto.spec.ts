/**
 * 
 * @desc Créer un groupe de magasin
 * 
 * @author SIAKA KONE
 * @since 2024-04-15
 * 
 */
const xRefTest      = 'REP_REF_EXA, REP_REF_EXS';
const xDescription  = "Création Suppression Article Exception Répart Auto";
const xIdTest       =  1822;
const xVersion      = '3.3';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'REP',
    version     : xVersion,    
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme','rayon'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------
const { writeFile } = require('fs');
import { test, type Page, expect }          from '@playwright/test';

import { AutoComplete, CartoucheInfo }      from '@commun/types';

import { TestFunctions }                    from '@helpers/functions';
import { Help }                             from '@helpers/helpers';
import { Log }                              from '@helpers/log';

import { MenuRepartition }                  from '@pom/REP/menu.page';
import {RefExceptionRepartitionAutoPage}    from '@pom/REP/referentiel-exception_repartition.page';
//------------------------------------------------------------------------------------
let page                        : Page;
let menu                        : MenuRepartition;
let pageRefExcepRepartAuto      : RefExceptionRepartitionAutoPage;
//------------------------------------------------------------------------------------
const log               = new Log();
const fonction          = new TestFunctions(log);
//------------------------------------------------------------------------------------

const sPlateforme       = fonction.getInitParam('plateforme','Chaponnay');
const sRayon            = fonction.getInitParam('rayon','Fruits et légumes');

const sJddFile          = fonction.getLocalConfig('jddPlateformes');

const oData2            = fonction.readFile(sJddFile);
const aCodesArticles    = [5300, 5070, 5400];
const iValeur           = 8888;

var oData = {
    plateforme : []
}

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page                    = await browser.newPage();
    menu                    = new MenuRepartition(page, fonction);
    pageRefExcepRepartAuto  = new RefExceptionRepartitionAutoPage(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']' , () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [REFERENTIEL]', async () => { 

        test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {            
            await menu.selectPlateforme(sPlateforme, page);                     // Sélection d'une plateforme 
            log.set('Plateforme : ' + sPlateforme);
        });
        
        test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menu.selectRayon(sRayon, page);               // Sélection du rayon
            log.set('Rayon : ' + sRayon);
        });
    
        var sNomPage = 'referentiel';
        test ('Page [' + sNomPage.toUpperCase() + '] - Click', async () => {
            await menu.click(sNomPage, page);
        }); 

        test('Label [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);      // Pas d'erreur affichée à priori au chargement de la page                
        });

        test.describe ('Onglet [EXCEPTION DE REPARTITION AUTOMATIQUE]', async () => {

            test('Onglet [GROUPE DE MAGASINS] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'exception', page);
            });

            test('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);      // Pas d'erreur affichée à priori au chargement de la page                
            }); 
            
            test.describe('** traitement **', async () =>{

                test('Get Liste plateforme', async ({}, testInfo) => {
                    const aListePlateforme = await menu.listBoxPlateforme.locator('option').allTextContents();
                    log.set('Liste de plateforme : ' + aListePlateforme);
                    oData.plateforme = aListePlateforme;

                    //-- Ecriture du libellé dans un fichier de JDD au format JSON pour récupératiuon des tests suivants
                    writeFile(testInfo.config.rootDir + sJddFile, JSON.stringify(oData, null, 2), (error) => {
                        if (error) {
                        console.log('An error has occurred ', error);
                        return;
                        }
                        log.set('Enregistrement de la donnée dans le fichier : ' + sJddFile);
                        fonction.addDataSheet('File', 'Write', sJddFile);
                    });
                });

                oData2.plateforme.forEach(async(sPlateforme:string)=>{

                    test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {
                        log.set('|');                         
                        log.set('| Plateforme   : ' + sPlateforme);
                        await menu.selectPlateforme(sPlateforme, page);
                    });

                    test('Datagrid [SUPPRESSION]['+sPlateforme+']', async () =>{
                        const iNbLignes : number = await pageRefExcepRepartAuto.dataGridDesignations.count();
                        if(iNbLignes > 0){
                            await fonction.clickElement(pageRefExcepRepartAuto.checkBoxCptDataGridArticle);
                            await fonction.clickElement(pageRefExcepRepartAuto.buttonSupprimerExceptionArticle);
                            log.set('| Suppression Données Prélable');
                            await fonction.wait(page, 500);//Attendre que la suppression soit effective
                            const iPurge : number = await pageRefExcepRepartAuto.dataGridDesignations.count();
                            expect(iPurge).toBe(0);
                        }
                    });

                    const sNomPopin:string = "Création d'une exception article";
                    aCodesArticles.forEach(async(sCodeArticle:number) => {

                        test('Button [CREER UNE EXCEPTION ARTICLE]['+sPlateforme+']['+sCodeArticle+']', async () =>{
                            await fonction.clickAndWait(pageRefExcepRepartAuto.buttonCreerExceptionArticle, page);
                        });

                        test('Popin [' + sNomPopin.toUpperCase() + ']['+sPlateforme+']['+sCodeArticle+'] - Is Visible -Check', async () => {
                            await fonction.popinVisible(page, sNomPopin, true);
                        }); 

                        test('AutoComplete [ARTICLE]['+sPlateforme+'] = "' + sCodeArticle + '"', async () => {
                            var bEnabled = await pageRefExcepRepartAuto.pInputArticle.isEnabled();
                            if(bEnabled){
                                await pageRefExcepRepartAuto.pInputArticle.clear();
                                var oData:AutoComplete = {
                                    libelle         :'ARTICLE',
                                    inputLocator    : pageRefExcepRepartAuto.pInputArticle,
                                    inputValue      : sCodeArticle.toString(),
                                    choiceSelector  :'li.gfit-autocomplete-result',
                                    choicePosition  : 0,
                                    typingDelay     : 100,
                                    waitBefore      : 500,
                                    page            : page,
                                };
                                await fonction.autoComplete(oData);
                                log.set('| Code Article > ' + sCodeArticle);
                            }
                        });

                        test('ListBox [TYPE EXCEPTION][' +sPlateforme+']['+sCodeArticle+'] = " last "', async () => {
                            const iNbreOpt = await pageRefExcepRepartAuto.pListBoxTypeException.locator('option').count();
                            await pageRefExcepRepartAuto.pListBoxTypeException.selectOption({index : (iNbreOpt - 1)});
                        });

                        test('InputField [VALEUR][' +sPlateforme+']['+sCodeArticle+'] = "' + iValeur + '"', async () =>{
                            await fonction.sendKeys(pageRefExcepRepartAuto.pInputException, iValeur, false, 'Valeur');
                            log.set('| Valeur       > ' + iValeur);
                        });

                        test('Button [ENREGISTRER][' +sPlateforme+']['+sCodeArticle+']', async () =>{
                            await fonction.clickAndWait(pageRefExcepRepartAuto.pButtonEnregistrer, page);
                        });

                        test('Popin [' + sNomPopin.toUpperCase() + ']['+sPlateforme+']['+sCodeArticle+'] - Is Not Visible - Check', async () => {
                            await fonction.popinVisible(page, sNomPopin, false);
                        });
                    });

                    test('Suppression données ['+sPlateforme+']', async () =>{
                        const iNbLignes:number = await pageRefExcepRepartAuto.dataGridDesignations.count();
                        if(iNbLignes > 0) {
                            await fonction.clickElement(pageRefExcepRepartAuto.checkBoxCptDataGridArticle);
                            await fonction.clickElement(pageRefExcepRepartAuto.buttonSupprimerExceptionArticle);
                            await fonction.wait(page, 500);//Attendre que la suppression soit effective
                            log.set('| Purge Données');
                            const iPurge:number = await pageRefExcepRepartAuto.dataGridDesignations.count();
                            expect(iPurge).toBe(0);
                        }
                    });
                });
            });
        });

        test('Déconnexion', async () => {
            await fonction.deconnexion(page);
        });

    });

})