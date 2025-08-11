/**
 * 
 * @desc Saisie de commentaires aléatoires liés aux articles
 * 
 * @author SIAKA KONE
 * @since 2024-04-12
 * 
 */
const xRefTest      = "REP_ART_COM";
const xDescription  = "Associer un commentaire à un article";
const xIdTest       =  2284;
const xVersion      = '3.1';

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

import { test, type Page }              from '@playwright/test';
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

const sPlateforme       = fonction.getInitParam('plateforme','Chaponnay');
const sRayon            = fonction.getInitParam('rayon','Fruits et légumes'); 
const sGroupeArticle    = fonction.getInitParam('groupeArticle', false); 
const sCharPermis       = "0123 #{[|456789. azertyuiopq sdfgh&é'(-è_çà)=> \\ ; § % $ £ /*-+çà~ ";

//------------------------------------------------------------------------------------

var getCommentaire = async () =>{
    //var random_ascii;
    var random_string:string   = 'TA_COM ' + fonction.getToday('FR') + fonction.getHMS() + ' ';       
    var string_length:number = Math.floor((fonction.random() * 50) + 1); 
    for(let i = 0; i < string_length; i++) {
        random_string += sCharPermis[Math.floor((fonction.random() * sCharPermis.length)) - 1]; //String.fromCharCode(random_ascii)
    }

    log.set('Chaîne injectée : ' + random_string);

    return random_string;
}

test.beforeAll(async ({ browser }, testInfo) => {
    page                    = await browser.newPage();
    menu                    = new MenuRepartition(page, fonction);
    pageArticlesArticles    = new ArticlesArticlesPage(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    fonction.close();
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

    test.describe('Page [ARTICLES]', async () => { 

        var sNomPage = 'articles';
        test ('Page [ARTICLES] - Click', async () => {
            await menu.click(sNomPage, page);
        }); 

        test('Label [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);                     
        });

        if(sPlateforme != false){
            test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {            
                await menu.selectPlateforme(sPlateforme, page);                     // Sélection d'une plateforme 
                log.set('Plateforme : ' + sPlateforme);
            });
        } else {
            log.set('Plateforme : défaut');
        }
        
        if(sRayon != false){
            test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
                await menu.selectRayon(sRayon, page);               // Sélection du rayon
                log.set('Rayon : ' + sRayon);
            });
        } else {
            log.set('Rayon : défaut');  
        }

        if(sGroupeArticle != false){
            if(await menu.listBoxGroupeArticle.isVisible()){
                test('ListBox [GROUPEARTICLE] = "' + sGroupeArticle + '"', async () => {            
                    await menu.selectGroupeArticleByName(sGroupeArticle, page);               // Sélection du groupe article
                    log.set('Groupe Article : ' + sGroupeArticle);
                });
            }
        } else {
            log.set('Groupe Article : défaut'); 
        }

        test('** Traitement **', async () => {
            const iNbChamps:number = await pageArticlesArticles.inputListeCommentaires.count();
            if (iNbChamps > 0) {
                log.set('Nombre de champs à remplir : ' + iNbChamps);
                for (var cpt=0; cpt < iNbChamps; cpt++) {
                    await fonction.sendKeys(pageArticlesArticles.inputListeCommentaires.nth(cpt), await getCommentaire(), false);
                }
            } else {
                log.set('Aucun champs à remplir');
            }
        });

        test('Button [ENREGISTRER] - Click', async () => {
            await fonction.clickAndWait(pageArticlesArticles.buttonEnregistrer, page);
        });

        test('Déconnexion', async () => {
            await fonction.deconnexion(page);
        });
    })
})