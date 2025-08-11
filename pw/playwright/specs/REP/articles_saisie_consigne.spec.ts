/** 
 * 
 * @desc Saisie d'une consigne de réparttestion
 * 
 * @see REP_CON_ART
 * @since 2024-01-02
 * 
 * @author JOSIAS SIE
 * 
 * 
*/

const xRefTest      = "REP_CON_ART";
const xDescription  = "Saisie d'une consigne de répartition Création d'une consigne pour un article donnée, pour une période donnée.";
const xIdTest       =  2080;
const xVersion      = "3.1.1";
    
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'REPARTITION',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme', 'rayon','article'],
    fileName    : __filename
};

import { test, type Page }          		from '@playwright/test';

import { Help }                             from '@helpers/helpers.js';
import { TestFunctions }                    from '@helpers/functions.js';
import { Log }                              from '@helpers/log';

import { MenuRepartition }                  from '@pom/REP/menu.page.js';
import { ArticlesConsignesRepartitionPage } from '@pom/REP/articles-consignes_repartition.page.js';

import { AutoComplete, CartoucheInfo } 		from '@commun/types/index.js';

//------------------------------------------------------------------------------------
let page                : Page;
let menu                : MenuRepartition;

let pageConsigne        : ArticlesConsignesRepartitionPage;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------ 

test.describe.configure({ mode: 'serial'});

test.beforeAll(async ({ browser }) => {
    page                = await browser.newPage();
    menu                = new MenuRepartition(page, fonction);    
    pageConsigne        = new ArticlesConsignesRepartitionPage(page);
})

test.afterAll(async ({}, testInfo) => {
    fonction.close(testInfo);
})

   
// Exploitation des paramètres passés en argument OU ceux présents dans le fichier de configuration Local

const sPlateforme       = fonction.getInitParam('plateforme','Chaponnay');
const sRayon            = fonction.getInitParam('rayon', 'Fruits et légumes');
const sArticle          = fonction.getInitParam('article', '100');

const sConsigne         = 'TEST-AUTO_Consigne ' + fonction.getToday('FR') + fonction.getHMS() + ' - Ne Pas dépasser plus de x % sinon \' < \ # ! ';

//------------------------------------------------------------------------------------ 

test.describe('[' + xRefTest + ']', () => {
    
    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper    = new Help(info, testInfo, page);
        await helper.init();
    });

    test('Ouverture URL', async () => {
        await fonction.openUrl(page);
    });

    test('Connexion', async() => {
        await fonction.connexion(page);
    })
    // end describe

    test.describe ('Page [ARTICLES]', () => {  
        var pageName = 'articles';
                   
        test('Page [ARTICLES][1]', async () => {
            await menu.click(pageName, page);  
        });

        test('P-dialog [ALERT][ERREUR][PAGE ARTICLES] - Check', async () => {
            await fonction.isErrorDisplayed(false, page);                      // Pas d'erreur affichée à priori au chargement de la page 
        })

        test('ListBox [PLATEFORME]', async () => {
            await fonction.ngClickListBox(menu.listBoxPlateforme, sPlateforme);
        });

        test('ListBox [RAYON]', async () => {
            await fonction.ngClickListBox(menu.listBoxRayon, sRayon);
        });

        test ('Onglet [CONSIGNES DE REPARTITION] - Click', async () => {
            await menu.clickOnglet(pageName, 'consignes', page);
        })
    
        test('P-dialog [ALERT][ERREUR][PAGE] - Check', async () => {
            await fonction.isErrorDisplayed(false, page);                     // Pas d'erreur affichée à priori au chargement de la page 
        })
    
        var sNomPopin = 'SAISIE DE CONSIGNE ARTICLE';
    
        test.describe('Popin [' + sNomPopin + ']', () => {
    
            test ('Button [SAISIR UNE CONSIGNE] - Click', async () => {
                await fonction.clickAndWait(pageConsigne.buttonCreateInstruction, page);
            }) 
    
            test('Popin [' + sNomPopin + '] [1] - Is Not Visible', async () => {
                await fonction.popinVisible(page, "saisie de consigne article", true);   
            })
            
            test('P-dialog [ALERT][ERREUR][POPIN] - Check', async () => {
                await fonction.isErrorDisplayed(false, page);                  // Pas d'erreur affichée à priori au chargement de la page 
            })
        
            test('InputField [AUTOCOMPLETE][ARTICLES] ', async () => {
                var rnd   = Math.floor(fonction.random() * 1);
                var oData:AutoComplete = {
                    libelle         :'ARTICLES',
                    inputLocator    : pageConsigne.pInputArticle,
                    inputValue      : sArticle,
                    choiceSelector  : '.gfit-autocomplete-results li',
                    choicePosition  : rnd,
                    typingDelay     : 100,
                    waitBefore      : 500,
                    page            : page,
                };
                await fonction.autoComplete(oData);
            })
    
            test ('DatePeacker [DEBUT][rnd] - Click', async () => {
    
                await fonction.clickElement(pageConsigne.pDatePeackerDebut);
                
                var isVisible   = await pageConsigne.pTdDatePeackerDay.first().isVisible();
                if(isVisible){
    
                    var iPosDay = Math.floor(fonction.random() * 21);
                    var iDay    = pageConsigne.pTdDatePeackerDay.nth(iPosDay).textContent();
                    var sMois   = pageConsigne.pDatePeackerMonth.textContent();
                    log.set('Date Début : ' + iDay + ' ' + sMois);  
    
                    await pageConsigne.pTdDatePeackerDay.nth(iPosDay).click();
                }
            })
    
            test ('DatePeacker [FIN][rnd] - Click', async () => {
                if (fonction.random() > 0.5) {
                    await fonction.clickElement(pageConsigne.pDatePeackerFin);
    
                    var isVisible   = await pageConsigne.pTdDatePeackerDay.first().isVisible();
                    if(isVisible){
    
                        var iPosDay = Math.floor(fonction.random() * 21 + 21);
                        var iDay    = pageConsigne.pTdDatePeackerDay.nth(iPosDay).textContent();
                        log.set('Date Fin : ' + iDay); 
    
                        await pageConsigne.pTdDatePeackerDay.nth(iPosDay).click();
                    }
                } else {
                    log.set('Pas de Date Fin !');
                }
            })
    
            test ('TextArea [CONSIGNE] - Click', async () => {
                await fonction.sendKeys(pageConsigne.pTextAreaConsigne, sConsigne);
            })
    
            test('Button [VALIDER] - Click', async () => {
                await fonction.clickElement(pageConsigne.pButtonValider);
            })
    
            test('Popin [' + sNomPopin + '] [2] - Is NOT Visible', async () => {
                await fonction.popinVisible(page, "saisie de consigne article", false);
            })
        })
    }) // end describle

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
}) // end describle 