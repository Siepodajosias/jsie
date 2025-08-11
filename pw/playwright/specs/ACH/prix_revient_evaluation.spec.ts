/**
 * 
 * @author JC CALVIERA
 * @since 2024-02-23
 * 
 */

const xRefTest      = "";   // Modification des données à la volée   
const xDescription  = "";   // Cf. Bloc "Références Dynamiques"
const xIdTest       = 0.0;  // ci-dessous
const xVersion      = '3.2';

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

import { test, type Page }          from '@playwright/test';

import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';

import { PageAnaEvaPri }            from '@pom/ACH/analyse_evaluation-prix-revient.page';
import { MenuAchats }               from '@pom/ACH/menu.page';

import { GlobalConfigFile }         from '@conf/commun.conf';

import { AutoComplete, CartoucheInfo } from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuAchats;
let pageEval            : PageAnaEvaPri;

const log               = new Log();
const fonction          = new TestFunctions(log);
const globalConfig      = new GlobalConfigFile();

//------------------------------------------------------------------------------------

const sRayon            = fonction.getInitParam('RAYON', 'Fruits et légumes');
const iPrixAchat        = Math.floor(fonction.random() * 8) + 1;
const iNbUnitesColis    = Math.floor(fonction.random() * 8) + 1;
const sLettre           = fonction.getRandomLetter();
const iPosAutocomplete  = Math.floor(fonction.random() * 10);

//--- Références Dynamiques ----------------------------------------------------------

const aInfosTests       = {
    'Poissonnerie'  : {
        'xRefTest'      : 'ACH_EPR_POI',
        'xDescription'  : 'Définir des remises et des taxes - article POI',
        'xIdTest'       : 9173
    },
    'BCT'           : {
        'xRefTest'      : 'ACH_EPR_BCT',
        'xDescription'  : 'Evaluation Prix de Revient pour le rayon BCT',
        'xIdTest'       : 9172
    }, 
    'Epicerie'      : {
        'xRefTest'      : 'ACH_EPR_EPI',
        'xDescription'  : 'Définir des remises et des taxes - article Epicerie',
        'xIdTest'       : 9175
    },
    'Crèmerie'      : {
        'xRefTest'      : 'ACH_EPR_CRE',
        'xDescription'  : 'Définir des remises et des taxes - article Crèmerie',
        'xIdTest'       : 9174
    }, 
    'Fruits et légumes': {
        'xRefTest'      : 'ACH_EPR_FEL',
        'xDescription'  : 'Evaluation Prix de Revient pour le rayon FL',
        'xIdTest'       : 7137
    },                
};

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    pageEval        = new PageAnaEvaPri(page);   

    //-- Modification à la volée des informations du test
    if (aInfosTests[sRayon] !== undefined) {
        info.refTest = aInfosTests[sRayon]['xRefTest'];
        info.desc = aInfosTests[sRayon]['xDescription'];
        info.idTest = aInfosTests[sRayon]['xIdTest'];
    } else {
        throw new Error('Ooops : Le paramètre RAYON passé en argument est inconnu !');
    }

});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    });

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async() => {
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe ('Page [ACCUEIL]', async () => {

        test ('ListBox [RAYON] = "' + sRayon + '"', async () => {
            await menu.selectRayonByName(sRayon, page);
        })

    }); // End PAGE Accueil

    test.describe ('Page [ACHATS]', async () => {

        var sPageName = 'analyse';
        test ('Page [ACHATS] - Click', async () => {
            await menu.click(sPageName, page);
        })

        test ('Error Message - Is Hidden', async () =>  {
            await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la page/onglet/popin
        })

        test.describe ('Onglet [EVALUATION PRIX REVIENT]', async () => {

            var sOngletName = 'evaluationPrixRevient';

            test ('Onglet [EVALUATION PRIX REVIENT] - Click', async () => {
                await menu.clickOnglet(sPageName, sOngletName, page);                
            }) 

            test ('AutoComplete [ARTICLE] = "rnd"', async () => {

                let sChoix:string;
                let oData:AutoComplete;
                let iNbEssais:number= 20;
                let iEssais:number  = 0;

                do {

                    //sLettre = 'pas';                                     // On peut forcer la donnée pour utiliser un article précis
                    log.set('Lettre injectée : ' + sLettre);
                    iEssais++;

                    oData = {
                        libelle         :'ARTICLE',
                        inputLocator    : pageEval.inputArticle,
                        inputValue      : sLettre,
                        choiceSelector  :'button.dropdown-item',
                        choicePosition  : iPosAutocomplete,
                        typingDelay     : 100,
                        waitBefore      : 1000,
                        clear           : true,
                        page            : page,
                    };
                    sChoix = await fonction.autoComplete(oData);
                    log.set('Essai #' + iEssais + '/' + iNbEssais + ' : ' + sChoix);

                    if (iEssais === iNbEssais) {
                        break;
                    }

                } while(fonction.isProhibitedData(sChoix) === true)         //-- On évite de récupérer un JDD de type "Ne Pas utiliser"

                log.set('Choix sélectionné : ' + sChoix);

            })

            test ('InputField [PRIX D\'ACHAT] = "rnd"' , async () => {
                await fonction.sendKeys(pageEval.inputPrixAchats, iPrixAchat);
                log.set('Prix d\'achat : ' + iPrixAchat + '€');
            })

            test ('InputField [UNITE D\'ACHAT] = "rnd"' , async () => {
                await fonction.selectRandomListBoxLi(pageEval.listBoxUniteAchat, false, page);
            })

            test ('ListBox [CONDITIONNEMENT] = rnd (option)' , async () => {

                const bIsEnabled = await pageEval.listBoxConditionnement.isEnabled();

                if (bIsEnabled) {

                    await fonction.clickElement(pageEval.listBoxConditionnement);

                    const iNbChoix  = await pageEval.listBoxConditionnement.locator('p-dropdownitem li span').count();
                    const iPosChoix = Math.floor(fonction.random() * iNbChoix);

                    if (iNbChoix > 0) {
                        log.set('Conditionnement sélection choix : ' + iPosChoix + '/' + iNbChoix);

                        const sChoix = await pageEval.listBoxConditionnement.locator('p-dropdownitem li span').nth(iPosChoix).textContent();
                        log.set('Conditionnement : ' + sChoix);

                        await fonction.clickElement(pageEval.listBoxConditionnement.locator('p-dropdownitem li span').nth(iPosChoix));

                    } else {
                        var sMessageErreur = 'ListBox CONDITIONNEMENT vide !';
                        log.set(sMessageErreur);
                        throw new Error(sMessageErreur);
                    }

                } else {

                    log.set('Conditionnement non sélectionnable');
                }

            })

            test ('InputField [NB D\'UNITES PAR COLIS] = "rnd"' , async () => {
                const bIsVisible = await pageEval.inputNbUnitesParColis.isVisible();
                if (bIsVisible) {
                    await fonction.sendKeys(pageEval.inputNbUnitesParColis, iNbUnitesColis);
                    log.set('Nb unités par colis : ' + iNbUnitesColis);
                }else {
                    log.set('Nb unités par colis : - Néant -' );
                }
            })            

            test ('InputField [NB D\'UNITES PAR COLIS ARTICLE] = "rnd"' , async () => {
                const bIsVisible = await pageEval.inputNbUnitesParColisArticle.isVisible();
                if (bIsVisible) {
                    await fonction.sendKeys(pageEval.inputNbUnitesParColisArticle, iNbUnitesColis);
                    log.set('Nb unités par colis : ' + iNbUnitesColis);
                }else {
                    log.set('Nb unités par colis : - Néant -' );
                }
            })            

            test ('Button [EVALUER]  - Click', async () => {
                await fonction.clickAndWait(pageEval.buttonEvaluer, page);
            });

            test ('Error Message - Is Hidden', async () =>  {
                await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la page/onglet/popin
            })

            test ('Nb [RESPONSES] >= 0', async () =>  {
                const iNbResponses = await pageEval.tdLignesReponses.count();
                if (iNbResponses > 0) {
                    log.set('Nombre de réponses : ' + iNbResponses);
                } else {
                    log.set('Aucune donnée présente pour le rayon ' + sRayon );
                }
            })

        }); // End ONGLET

    }); // End PAGE

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

});
