/**
 * @author JC CALVIERA
 * @desc Recherche la liste des triplets. Précurseur du test "ACH_FRS_SUP6 - Supprimer un triplet sur un article vendu dans le vue calendrier d'approvisionnement"
 * @since 2025-06-26
 * 
 */
const xRefTest      = "ACH_CAL_VIS";
const xDescription  = "Visualiser les articles achetables dans la vue calendrier";
const xIdTest       =  10027;
const xVersion      = '3.0';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : ['Précurseur du test "ACH_FRS_SUP6"'],         
    params      : ['dossierAchat','centraleAchat','plateforme','rayon','fournisseur'],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { test, type Page}   from '@playwright/test';

import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { Log }              from '@helpers/log.js';

import { MenuAchats }       from '@pom/ACH/menu.page.js'; 
import { PageRefArt }       from '@pom/ACH/referentiel_articles.page';
import { PageAchCalApp }    from '@pom/ACH/achats_calendrier-approvisionnement.page';

import { CartoucheInfo }    from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuAchats;
let pageReferentielArt  : PageRefArt;
let pageAchCalApp       : PageAchCalApp;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

fonction.importJdd();

const sDossierAchat     = fonction.getInitParam('dossierAchat', fonction.getLocalConfig('dossierAchatCrossdock'));
const sCentraleAchat    = fonction.getInitParam('centraleAchat', 'BCT 500');
const sPlateforme       = fonction.getInitParam('plateforme', 'Cremlog');
const sRayon            = fonction.getInitParam('rayon', 'BCT');
var sFournisseur        = fonction.getInitParam('fournisseur', 'Sas Les Ateliers Ⓔ');

var oData:any = {
    sDossierAchat   : sDossierAchat,
    sCentraleAchat  : sCentraleAchat,
    sPlateforme     : sPlateforme,
    sRayon          : sRayon,
    sFournisseur    : sFournisseur,
    aCodeArticle    : [],
    aPrixCatalogue  : [],
    aDestinataire   : {},
}

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuAchats(page, fonction);
    pageReferentielArt  = new PageRefArt(page);
    pageAchCalApp       = new PageAchCalApp(page);
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

    test.describe('Page [ACHATS]', async () => {

        var sNomPage:string = 'achats'; 

        test ('ListBox [RAYON] = "' + sRayon + '"', async () => {                    
            await menu.selectRayonByName(sRayon, page);
        })
        
        test ('Page [ACHATS] - Click', async() => {
            await menu.click(sNomPage, page, 60000);                
        })

        test ('ListBox [DOSSIER D\'ACHAT] = "' + sDossierAchat + '"', async() => {
            await fonction.listBoxByLabel(pageAchCalApp.listBoxDossierAchat, sDossierAchat, page);
        })

        test ('ListBox [CENTRALE D\'ACHAT = "' + sCentraleAchat + '"', async () => {
            await fonction.listBoxByLabel(pageAchCalApp.listBoxCentraleAchat, sCentraleAchat, page);
        })

        test ('DataGrid [PLATEFORME] = "' + sPlateforme + '"', async() => {            
            await fonction.clickAndWait(pageAchCalApp.tdListPlateformes.locator('span:text-is("' + sPlateforme + '")'), page);
        })

        test.skip ('Pictogram [BASCULER CROSSDOCKING] - Click', async() => {            
            await pageAchCalApp.tdListActionsSelected.hover();
            await fonction.clickAndWait(pageAchCalApp.pictoBasculerCrossDock, page);
        })

        test ('DataGrid [FOURNISSEUR] = "' + sFournisseur + '"', async() => {
            await fonction.clickAndWait(pageAchCalApp.tdListFournisseurs.locator('span:text-is("' + sFournisseur + '")'), page);
        })

        test ('TD [ARTICLE] - Fetch', async () => {
            
            const eListeArticles = await pageAchCalApp.tdListArticles.all();

            for (const eArticle of eListeArticles) {
                const sCodeArticle = await eArticle.textContent();
                const sCode = sCodeArticle.split('-')[0].trim();
                if(!oData.aCodeArticle.includes(sCode)) {
                    oData.aCodeArticle.push(sCode);
                    log.set('Article sélectionné : ' + sCode);
                }
            }

        })

    })

    //-- Enregistrement des données pour le E2E
    await fonction.writeData(oData);

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})