/**
 * 
 * @author JC CALVIERA
 * @since 2024-02-27
 * 
 */
const xRefTest      = "PRE_REF_EXC";
const xDescription  = "Ajout / Suppression Mode de Préparation et Exceptions";
const xIdTest       =  2132;
const xVersion      = "3.2";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRE',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme', 'idArticle'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page, expect}   from '@playwright/test';

import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';
import { EsbFunctions }             from '@helpers/esb'

import { MenuPreparation }          from '@pom/PRE/menu.page';
import { RefModePrepaExcepPage }    from '@pom/PRE/referentiel-mode_preparation_exceptions.page';

import { AutoComplete, CartoucheInfo, TypeEsb }   from '@commun/types';

//------------------------------------------------------------------------------------

let page                    : Page;
 
var pageExcep               : RefModePrepaExcepPage;
var menu                    : MenuPreparation;
let esb                     : EsbFunctions;

const log                   = new Log();
const fonction              = new TestFunctions(log);

const sPlateforme:string    = fonction.getInitParam('plateforme', 'Cremcentre');
const sCodeArticle:string   = fonction.getInitParam('idArticle', 'C0OL');
const sGroupeArticle        = 'Coupe / Corner';

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage();
    menu        = new MenuPreparation(page, fonction);    
    pageExcep   = new RefModePrepaExcepPage(page);
    esb         = new EsbFunctions(fonction);
    const helper= new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async () => {
        await fonction.openUrl(page);
    });

    test('Connexion', async({ context }) => {
        await context.clearCookies();
        await fonction.connexion(page);
    })
  
    test.describe('Page [REFERENTIEL]', async() => {

        var pageName:string      = 'referentiel';

        test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async() => {
            await menu.selectPlateforme(sPlateforme, page);
            log.set('Plateforme : ' + sPlateforme);
        });

        test("Menu [REFERENTIEL] - Click ", async () => {
           await menu.click(pageName, page);
        })
  
        test('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
        })

       test.describe('Onglet [MODE DE PREPARATION ET EXCEPTIONS]', async() => {

            test ('Onglet [MODE DE PREPARATION ET EXCEPTIONS] - Click', async () => {
                await menu.clickOnglet(pageName, 'modePreparationExceptions',page);                
            })   

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            test ('CheckBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async() => {
                await fonction.clickElement(pageExcep.tdListeLibelleGrpArticle.locator('span:text-is("' + sGroupeArticle + '")'));
            })

            const sNomPopin:string = 'CREER UNE EXCEPTION DE PREPARATION';
            test.describe ('Popin ' + sNomPopin.toUpperCase() + ']', async() => {

                test ('Button [CREE UNE EXCEPTION] - Click', async() => {
                    await fonction.clickElement(pageExcep.buttonCreerException);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () =>  {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
                })
                
                test('Message [ERREUR] - Is Not Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);                           // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
                })

                test('AutoComplete [ARTICLE] = "' + sCodeArticle + '"', async () => {

                    log.set('Article : ' + sCodeArticle);
    
                    var oData:AutoComplete = {
                        libelle         :'ARTICLE',
                        inputLocator    : pageExcep.pInputArticleExp,
                        inputValue      : sCodeArticle,
                        choiceSelector  :'li.gfit-autocomplete-result',
                        choicePosition  : 0,
                        typingDelay     : 100,
                        waitBefore      : 100,
                        page            : page,
                    };
                    await fonction.autoComplete(oData);
    
                })

                test ('Date Peacker [FIN] = "rnd"', async () => {
                    const fillCalendar = fonction.random();
                    if (fillCalendar > 0.5) {

                        await fonction.clickElement(pageExcep.pIconCalendarFinExp);
                        const iNbAvalableDay = await pageExcep.pTdDaysEvalableExp.count();
                        const iPosDay = Math.floor(fonction.random() * iNbAvalableDay);
                        const sDay = await pageExcep.pTdDaysEvalableExp.nth(iPosDay).textContent();
                        log.set('Date de fin : ' + sDay);
                        await fonction.clickElement(pageExcep.pTdDaysEvalableExp.nth(iPosDay));

                    } else {
                        log.set('Date de fin non renseignée');
                    }
                })

                test ('Button [CREER] - Click', async () => {
                    await fonction.clickAndWait(pageExcep.pButtonCreerExp, page);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () =>  {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), false, 3000);
                })

            })

       })  // End  Onglet

       test.describe('** Suppression Données **', async() => {

            let iNbReponses:number;

            test ('InputField [ARTICLE] = "' + sCodeArticle + '"', async() => {
                await fonction.sendKeys(pageExcep.inputArticle, sCodeArticle);
                await fonction.wait(page, 250);     //-- Petite tempo le temps que la liste se raffraîchisse
            })

            test ('Pictogram [DELETE] - Click', async() => {
                iNbReponses = await pageExcep.tdListeActions.count();
                log.set('Nb Réponses AVANT suppression : ' + iNbReponses);
                await pageExcep.tdListeActions.first().hover({timeout:250});
                await fonction.clickAndWait(pageExcep.tdListeActions.first().locator('a[title="Supprimer"]').first(), page);
            })

            const sNomPopin:string = "Suppression d'une exception";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test ('Button [SUPPRIMER] - Click', async () => {
                    await fonction.clickAndWait(pageExcep.pSuppButtonSupprimer, page);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })
            })

            test ('td [CODE ARTICLE]['+sCodeArticle+'] = -1', async () => {
                expect(iNbReponses).toBeGreaterThan(await pageExcep.tdListeActions.count());
                iNbReponses = await pageExcep.tdListeActions.count();
                log.set('Nb Réponses APRES suppression : ' + iNbReponses);
            })

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);                           // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

       })

    })  // End  Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

    test('** CHECK FLUX **', async () =>  {

        const oFlux:TypeEsb = { 
            FLUX : [
                {
                    NOM_FLUX    : 'Diffuser_CheminPicking',
                },
                {
                    NOM_FLUX    : 'EnvoyerCheminPicking_Achat',
                },
                {
                    NOM_FLUX    : 'EnvoyerCheminPicking_Repart',
                },
                {
                    NOM_FLUX    : 'EnvoyerCheminPicking_Stock',
                },
            ],
            WAIT_BEFORE     : 5000,                     // Optionnel
            VERBOSE_MOD     : false,                    // Optionnel car écrasé globalement
        };

        await esb.checkFlux(oFlux, page);

    });

})  // End describe