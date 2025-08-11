/**
 * 
 * @desc Répartie automatiquement les lots de toute la plateforme sélectionnée
 * 
 * @author SIAKA KONE
 * @since 2024-04-11
 * 
 */
const xRefTest      = "REP_ART_AUT";
const xDescription  = "Répartition Automatique";
const xIdTest       =  204;
const xVersion      = '3.4.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'REP',
    version     : xVersion,    
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme','rayon','groupeArticle'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { expect, test, type Page }      from '@playwright/test';
import { CartoucheInfo }                from '@commun/types';
import { TestFunctions }                from '@helpers/functions.js';
import { Help }                         from '@helpers/helpers.js';
import { Log }                          from '@helpers/log.js';

import { MenuRepartition }              from '@pom/REP/menu.page.js';
import { ArticlesArticlesPage }         from '@pom/REP/articles-articles.page.js';

//------------------------------------------------------------------------------------
let page                        : Page;
let menu                        : MenuRepartition;
let pageArticlesArticles        : ArticlesArticlesPage;
//------------------------------------------------------------------------------------
const log               = new Log();
const fonction          = new TestFunctions(log);
//------------------------------------------------------------------------------------

const sPlateforme       = fonction.getInitParam('plateforme','Cremlog');
const sRayon            = fonction.getInitParam('rayon','Crèmerie'); 
const sGroupeArticle    = fonction.getInitParam('groupeArticle','Frais LS'); 

var iDelaiMaxi          = 3 * 60 * 1000; // Délai maxi à ne pas dépasser (en secondes)

 //------------------------------------------------------------------------------------
 var oTimestamp = {
    start : null, 
    end : null,
    nbLignes : 0
};

var getTime = async () =>{
    var maDate = new Date();

    if (oTimestamp.start == null) {
        oTimestamp.start = maDate;
        return 'START : ' + fonction.getHMS();
    } else {
        oTimestamp.end = maDate;
        return 'TIME : ' + fonction.getHMS();              
    }
}
 
test.beforeAll(async ({ browser }, testInfo) => {
    page                    = await browser.newPage();
    menu                    = new MenuRepartition(page, fonction);
    pageArticlesArticles    = new ArticlesArticlesPage(page);
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

    test.describe('Page [ARTICLES]',async () => { 

        var sNomPage = 'articles';
        test ('Page [ARTICLES] - Click', async () => {
            await menu.click(sNomPage, page);
        }); 

        test('Label [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);                     
        });

        test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {            
            await menu.selectPlateforme(sPlateforme, page);                     // Sélection d'une plateforme par défaut
            log.set('Rayon : ' + sPlateforme);
        });

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menu.selectRayon(sRayon, page);               // Sélection du rayon
            log.set('Rayon : ' + sRayon);
        });

        test('ListBox [GROUPEARTICLE] = "' + sGroupeArticle + '"', async () => {            
            await menu.selectGroupeArticleByName(sGroupeArticle, page);               // Sélection du groupe article
            log.set('Rayon : ' + sGroupeArticle);
        });

        test('Button [REPARTITION AUTO] - Click', async () => {
            const iDelayTimeOut:number = 120000;
            test.setTimeout(iDelayTimeOut);
            await expect(pageArticlesArticles.spinnerArticles).not.toBeVisible({timeout:iDelayTimeOut});  //Attendre que le spinner disparaisse avant de cliquer sur le bouton repartition automatique;
            log.set('REPARTITION AUTO - Click : ' + await getTime());
            await fonction.clickAndWait(pageArticlesArticles.buttonRepartitionAuto, page);
        });

        var sNomPopin:string = "Repartir automatiquement";
        test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible - Check', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            });

            test('Label [ERREUR] - Is Not Visible', async () => {  // Pas d'erreur affichée à priori au chargement de la popin
                await fonction.isErrorDisplayed(false, page);                     
            });
 
            const sModeGest:string = 'Trier les magasins par stock magasin';
            test('ListBox [GESTION DES RUPTURES] = "' +sModeGest+ '"', async () =>{
                log.set('REPARTIR QTE INSUFFISANTES SELON STOCK MAGASIN :' + getTime()); 
                await fonction.clickElement(pageArticlesArticles.pPDropDownGestRup);
                await fonction.clickElement(pageArticlesArticles.pPListBoxGestRup.filter({hasText : sModeGest}).first());
            });

            test('Button [REPARTIR AUTOMATIQUEMENT (Délai maxi autorisé : ' + iDelaiMaxi + ' secondes)] - Click', async () => {
                test.setTimeout(iDelaiMaxi);
                var starttime = Date.now();
                await fonction.clickAndWait(pageArticlesArticles.pPButtonRepartir, page, iDelaiMaxi);
                expect(Date.now() - starttime).toBeLessThan(iDelaiMaxi);                   // Délai maxi à ne pas dépasser
            });       

            /*test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible - Check', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            });*/   

            test ('** Fin Traitement **', function() {
                log.set('Début :  ' + oTimestamp.start); 
                log.set('Fin   :  ' + oTimestamp.end);                          
                log.set('Temps de traitement total    :  ' + (Math.abs(oTimestamp.start - oTimestamp.end) / 1000) + ' sec');
            });

            /*test('Déconnexion', async () => {
                await fonction.deconnexion(page);
            });*/
        });
    })
})