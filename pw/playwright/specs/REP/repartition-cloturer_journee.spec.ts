/**
 * 
 * @author SIAKA KONE
 * @since 2023-01-12
 * 
 */
const xRefTest      = "REP_ART_CLO";
const xDescription  = "Clôturer la journée de répartition";
const xIdTest       =  416;
const xVersion      = '3.2';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'REP',
    version     : xVersion,    
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateformeReception','rayon'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }              from '@playwright/test';
import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';

import { MenuRepartition }              from '@pom/REP/menu.page';
import { ArticlesArticlesPage }         from '@pom/REP/articles-articles.page';

import { CartoucheInfo }                from '@commun/types';

//------------------------------------------------------------------------------------
let page                : Page;
let menu                : MenuRepartition;
let pageArticlesArticles: ArticlesArticlesPage;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------
fonction.importJdd(); //Import du JDD pour le bout en bout
//------------------------------------------------------------------------------------
const sPlateforme       = fonction.getInitParam('plateformeReception','Chaponnay');
const sRayon            = fonction.getInitParam('rayon','Fruits et légumes');  // Fruits et légumes
//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page                    = await browser.newPage();
    menu                    = new MenuRepartition(page, fonction);
    pageArticlesArticles    = new ArticlesArticlesPage(page);
    const helper            = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']' , () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    //------------------------------------------------------------------------------------
    test.describe ('Page [ARTICLES]',async () => { 
        
        var sNomPage = 'articles';

        test ('Page [ARTICLES] - Click', async () => {
            await menu.click(sNomPage, page);
        });  
        
        test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {            
            await menu.selectPlateforrme(sPlateforme, page);                     // Sélection d'une plateforme par défaut
            log.set('Plateforme : ' + sPlateforme);
        });

        test ('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menu.selectRayon(sRayon, page);                               // Sélection du rayon
            log.set('Rayon : ' + sRayon);
        });

        test.describe ('Onglet [ARTICLES]', async () => {   
            
            var sNomOnglet = 'articles'

            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'articles', page);         
            });

            test ('Button [CLOTURER JOURNEE] - Click', async () => {
                await fonction.clickAndWait(pageArticlesArticles.buttonCloturer, page);
            });

            test ('Confirmer [OUI] - Click', async () => {
                await fonction.clickAndWait(pageArticlesArticles.pButtonOui, page);
            });

        });  //-- End Describe Onglet  

    }); //-- End Describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

});   