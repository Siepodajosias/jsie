/**
 * @author Vazoumana DIARRASSOUBA, SIAKA KONE
 * @desc Supprimer un triplet sur un article_Article vendu dans le vue calendrier d'approvisionnement
 * @since 2024-07-23
 * 
 */
const xRefTest      = "ACH_FRS_SUP6";
const xDescription  = "Supprimer un triplet sur un article vendu dans le vue calendrier d'approvisionnement";
const xIdTest       =  7174;
const xVersion      = '3.9';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : ['Successeur de [ACH_CAL_VIS] dans le cadre d\'un E2E'],         
    params      : ['plateforme','rayon','groupeArticle','fournisseur','ignore','listeArticles','nbArticles'],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { test, type Page}              from '@playwright/test';

import { Help }                        from '@helpers/helpers.js';
import { TestFunctions }               from '@helpers/functions.js';
import { Log }                         from '@helpers/log.js';

import { MenuAchats }                  from '@pom/ACH/menu.page.js'; 
import { PageRefArt }                  from '@pom/ACH/referentiel_articles.page';

import { AutoComplete, CartoucheInfo } from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuAchats;
let pageReferentielArt  : PageRefArt;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

var oData:any           = fonction.importJdd();         // Récupération du JDD et des données du E2E en cours si ils existent
  
var sPlateforme         = fonction.getInitParam('plateforme', 'Cremlog');
var sRayon              = fonction.getInitParam('rayon', 'BCT');
var sGroupeArticle      = fonction.getInitParam('groupeArticle', '-- Tous --');
var sFournisseur        = fonction.getInitParam('fournisseur', 'Sas Les Ateliers Ⓔ');
const sIgnoreListe      = fonction.getInitParam('ignore', 'B02L,B02B,B09B');
const sListeArticles    = fonction.getInitParam('listeArticles', 'B0AF,B0AE');
const iNbArticles       = fonction.getInitParam('nbArticles', '2');

//------------------------------------------------------------------------------------

if(oData !== undefined) {                               //-- Si le JDD contient des données créées préalablement dans le cadre d'un E2E, on les utilise
    sPlateforme         = oData.sPlateforme;
    sRayon              = oData.sRayon;
    sGroupeArticle      = oData.sGroupeArticle; 
    sFournisseur        = oData.sFournisseur;
} else {                                                //-- Sinon on utilise les paramètres passés en argument 
    oData = {
        aCodeArticle    : sListeArticles.split(','),
    }
}

//-- Retrait des caractères spéciaux du nom du fournisseur pour l'utiliser dans les saisies automatiques
var sFournisseurClean   = sFournisseur.replace(/[^a-zA-Z\s]+/g, '').trim(); 

//-- préparation de la liste des articles à ignorer
var aIgnoreListe        = sIgnoreListe.split(',');   
aIgnoreListe            = aIgnoreListe.map(function(x){ return x.trim();});   

//-- Retrait des articles à ignorer de la liste des articles
oData.aCodeArticle      = oData.aCodeArticle.filter((item) => !aIgnoreListe.includes(item));

//-- On limite le nombre d'articles à iNbArticles
oData.aCodeArticle      = oData.aCodeArticle.slice(0, iNbArticles);

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuAchats(page, fonction);
    pageReferentielArt  = new PageRefArt(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', async () => {  

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [ACCUEIL]', async () => {

        test ('ListBox [RAYON] = "' + sRayon + '"', async () => {
            await menu.selectRayonByName(sRayon, page);
        })
    })

    test.describe ('Page [REFERENTIEL]', async () => {

        var pageName:string    = 'referentiel';
        
        test ("Menu [REFERENTIEL] - Click ", async () => {
           await menu.click(pageName, page);
        })

        test.describe ('Onglet [ARTICLES]', async () => {

            test ('Onglet [ARTICLES] - Click', async () => {
                await menu.clickOnglet(pageName, 'articles',page);
            })
    
            test ('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
                await pageReferentielArt.listBoxGroupeArticle.selectOption({label: sGroupeArticle});
            })

            oData.aCodeArticle.forEach(async (sCodeArticle:string) => {

                test ('InputField [ARTICLE] = "' + sCodeArticle + '" - Selected Article', async () => {
                    var oData:AutoComplete = {
                        libelle         :'Selected Article',
                        inputLocator    : pageReferentielArt.autoCompleteArts,
                        inputValue      : sCodeArticle,
                        choiceSelector  :'.gfit-autocomplete-results li',
                        choicePosition  : 0,
                        typingDelay     : 100,
                        waitBefore      : 750,
                        page            : page,
                        clear           : true
                    };
                    await fonction.autoComplete(oData);
                    await fonction.wait(page, 500); //-- Attente rechargement dataGrid
                })
    
                test ('Pictogramme [SAISIES AUTOMATIQUES][' + sCodeArticle + '] - Click', async () => {
                    await pageReferentielArt.tdDgActions.hover({timeout:250})
                    await fonction.clickAndWait(pageReferentielArt.tdDgActions.locator('a[title="Saisies automatiques"]'), page);
                })
    
                var sNomPopin:string ='Données saisies automatiquement lors d\'un achat pour l\'article XXXX';
                test.describe('Popin [' + sNomPopin.toUpperCase() + '][' + sCodeArticle + ']', async () => {
    
                    test ('Popin [' + sNomPopin.toUpperCase() + '][' + sCodeArticle + '] - Is Visible', async () => {
                        await fonction.popinVisible(page, sNomPopin, true);
                    })
    
                    test ('InputField [DESIGNATION FOURNISSEUR][' + sCodeArticle + '] = "' + sFournisseurClean + '"', async () => {
                        await fonction.sendKeys(pageReferentielArt.pPInputDesignationFournisseur, sFournisseurClean);
                        await fonction.wait(page, 500);
                    })

                    test ('td [PLATEFORME RECEPTION ET DISTRIBUTION][' + sCodeArticle + '] = "' + sPlateforme + '"', async () => {
                        const tdPlformeRecept =  pageReferentielArt.pPDatagridDonneeSaisiAuto.filter({hasText:sPlateforme})
                        await fonction.clickElement(tdPlformeRecept.filter({hasText:sPlateforme}));
                    })
                   
                    test ('Button [SUPPRIMER ET FERMER][' + sCodeArticle + '] - Click', async () => {
                        await fonction.clickAndWait(pageReferentielArt.pPButtonSupprimerEtFermer, page);
                    })

                    test ('Popin [' + sNomPopin.toUpperCase() + '][' + sCodeArticle + '] - Is Not Visible', async () => {
                        await fonction.popinVisible(page, sNomPopin, false);
                    })

                })

            })

        })

    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})