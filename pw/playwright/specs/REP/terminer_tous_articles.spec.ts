/** 
 *
 * @author JC CALVIERA
 * @since 2025-01-14 
 * 
*/
const xRefTest      = "REP_REP_TER";  
const xDescription  = "Terminer la répartition de tous les articles";
const xIdTest       =  9769;
const xVersion      = "3.6"; 
   
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'REPARTITION',
    version     : xVersion,
    refTest     : [xRefTest], 
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme','rayon'],
    fileName    : __filename
};  

//------------------------------------------------------------------------------------

import { expect, test, type Page }  from '@playwright/test';

import { Help }                     from '@helpers/helpers.js';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';

import { MenuRepartition }          from '@pom/REP/menu.page';
import { ArticlesArticlesPage }     from '@pom/REP/articles-articles.page.js';
import { RepartitionPage }          from '@pom/REP/repartition.page.js';

import { CartoucheInfo } 			from '@commun/types/index';

//------------------------------------------------------------------------------------
let page                : Page;
let menu                : MenuRepartition;

let pageArticle         : ArticlesArticlesPage;
let pageRepartition     : RepartitionPage;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuRepartition(page, fonction);    
    pageArticle         = new ArticlesArticlesPage(page);
    pageRepartition     = new RepartitionPage(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------ 

const sPlateforme       = fonction.getInitParam('plateforme', 'Chaponnay');
const sRayon            = fonction.getInitParam('rayon', 'Fruits et légumes');

//------------------------------------------------------------------------------------

/**
 * @description appuie sur le bouton "Terminer et afficher le suivant" tant qu'il est visible et actif.
 */
var terminer = async () =>{

    const bButtonEnabled = await pageRepartition.buttonTerminerEtSuivant.isEnabled();
    const sArticle = fonction.cleanTexte(await pageRepartition.infosArticle.textContent());

    if (bButtonEnabled) {

        //-- On clique sur le bouton "Terminer et afficher le suivant"
        await fonction.clickAndWait(pageRepartition.buttonTerminerEtSuivant, page, 3600000);
        
        //-- Attente disparition du spinner
        await expect(pageRepartition.pSpinner).not.toBeVisible({timeout:60000});

        //-- Une popin s'affiche dans certains cas. Si oui, on clique sur le bouton "Oui"
        if (await pageRepartition.pButtonOui.isVisible({timeout:5000})){
            await fonction.clickAndWait(pageRepartition.pButtonOui, page);
        }

        //console.log(sArticle);
        log.set(sArticle);
        await terminer();

    } else {

        log.set('Action terminée (bouton "TERMINER ET SUIVANT" innactif) avec l\'article : ' + sArticle);

    }

}

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {  

   test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
       await context.clearCookies();
       await fonction.openUrl(page);
   })

   test ('Connexion', async() => {
       await fonction.connexion(page);
   })

    test.describe ('Page [ACCUEIL]', async () => {

        test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {
            await menu.selectPlateforme(sPlateforme, page);
        })

        test ('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menu.selectRayon(sRayon, page);               // Sélection du rayon
            log.set('Rayon : ' + sRayon);
        })

    })

    test.describe ('Page [ARTICLES]', async () => {

        var sCurrentPage = 'articles';

        test ('Page [REPARTITION]', async () => {
            await menu.click(sCurrentPage, page);  
        })    
       
        test ('CheckBox [ARTICLES][0] - Click', async () => {
            await fonction.clickElement(pageArticle.checkBoxArticles.first());
        })

        test ('Button [REPARTIR L\'ARTICLE] click', async () => {
              await fonction.clickAndWait(pageArticle.buttonRepartir, page);
        })
        
    })

    test.describe ('Page [REPARTITION]', async () => {

        test ('** Traitement **', async () => {
            test.setTimeout(3600000);    // 1 heure
            await terminer();
        })

    }) // end describle

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
    
}) // end describle 