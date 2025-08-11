/**
 * 
 * @desc Affichage du référentiel des article (Suite Bug #xxxx ) / S'assurer que pour chaque groupe articles il y a au moins plus d'un article / Ajoute des consignes pour chacuns des articles
 * @author JC CALVIERA
 * @since 2024-03-20
 * 
 */

const xRefTest      = "PRE_REF_ART";
const xDescription  = "Affichage du référentiel articles";
const xIdTest       =  2676;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRE',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page, expect }      from '@playwright/test';

import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';

import { MenuPreparation }              from '@pom/PRE/menu.page';
import { RefReferentielArticlePage }    from '@pom/PRE/referentiel-referentiel_articles.page';

import { CartoucheInfo }                from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuPreparation;
let pageRefArticle      : RefReferentielArticlePage;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

const sPlateforme       = fonction.getInitParam('plateforme', 'Cremcentre');
const iConsignePalette  = 8;
const sCommentaire      = 'TA_Commentaire ' + fonction.getToday();

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuPreparation(page, fonction);
    pageRefArticle  = new RefReferentielArticlePage(page);
    const helper    = new Help(info, testInfo, page);
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

    test.describe ('Page [REFERENTIEL]', async () => {   
        
        var sNomPage = 'referentiel';

        test ('Page [REFERENTIEL] - Click', async () => {
            await menu.click(sNomPage, page);
        }); 
        
        test ('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);
        }) 

        var sNomOnglet = 'Gestion préparateur'

        test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async () => {   

            let iRnd:number;
            let sSeuilFondPalette:string;
            let iSeuilFondPalette:number;

            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage,'referentielArticles', page);         
            });

            test ('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 

            test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => { 
                await menu.selectPlateforme(sPlateforme, page);
            });

            test ('CheckBox [ENVOYER CONSIGNES A LA VOCALE]- Click', async () => {
                await fonction.clickElement(pageRefArticle.checkBoxEnvoyerConsigne);
            });

            test ('Button [RECHERCHER]- Click', async () => {
                await fonction.clickAndWait(pageRefArticle.buttonRechercher, page);
            });

            test ('CheckBox [ARTICLE][rnd] - Click', async () => { 

                //-- Attente affichage première réponse
                await pageRefArticle.checkBoxArticles.first().waitFor();

                var iNbArticles = await pageRefArticle.checkBoxArticles.count();
                iRnd = Math.floor(fonction.random() * iNbArticles);
                await fonction.clickElement(pageRefArticle.checkBoxArticles.nth(iRnd));
                
                log.set('ID Article : ' + await pageRefArticle.tdCodeArticle.nth(iRnd).textContent());
                log.set('Designation Article : ' + await pageRefArticle.tdDesignationArticle.nth(iRnd).textContent());

                sSeuilFondPalette = await pageRefArticle.inputSeuilFondPalette.nth(iRnd).inputValue();
                sSeuilFondPalette = sSeuilFondPalette.replace(',', '');
                iSeuilFondPalette = Number(sSeuilFondPalette);
                log.set('Seuil Fond Palette AVANT Traitement : ' + sSeuilFondPalette);

            });

            test ('Input [SEUIL FOND PALETTE] = -1', async () => {                
                await fonction.sendKeys(pageRefArticle.inputSeuilFondPalette.nth(iRnd), iSeuilFondPalette - 1);
            });                

            test ('Input [CONSIGNE PALETTE] = "'+  iConsignePalette.toString() + '"', async () => {
                await fonction.sendKeys(pageRefArticle.inputConsignePalette.nth(iRnd), iConsignePalette, false);
            }); 

            test ('Input [CONSIGNE] = "'+  sCommentaire + '"', async () => {
                await fonction.sendKeys(pageRefArticle.inputConsignePalette.nth(iRnd), sCommentaire, false);
            }); 

            test ('Button [ENREGISTRER]- Click', async () => {
                await fonction.clickAndWait(pageRefArticle.buttonEnregistrerModif, page);
            });           
            
            test ('InputField [SEUIL FOND PALETTE]  = Valeur Initiale -1', async() => {
                const iNewSeuil = Number((await pageRefArticle.inputSeuilFondPalette.nth(iRnd).inputValue()).replace(',', ''));
                log.set('Seuil Fond Palette APRES Traitement : ' + iNewSeuil);
                expect(iSeuilFondPalette).toBeGreaterThan(iNewSeuil);
            });

        }); //-- End Describe Onglet  

    }); //-- End Describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

});   