/**
 * 
 * @author Mathis NGUYEN
 * @description Récupérer les ref. catalogues dans ref. articles fournisseur
 * @since 2024-06-10
 * 
 */
const xRefTest      = "ACH_FOU_RCC";      
const xDescription  = "Récupérer les ref. catalogues dans ref. articles fournisseur";
const xIdTest       =  9161;
const xVersion      = "3.2";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon', 'fournisseur', 'listeArticles', 'E2E'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { expect, test, type Page}   from '@playwright/test';

import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';
import { EsbFunctions }             from '@helpers/esb';

import { MenuAchats }                   from '@pom/ACH/menu.page';
import { PageRefFou }                   from '@pom/ACH/referentiel_fournisseurs.page';

import { CartoucheInfo } 		from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
 
var pageReferentielFour : PageRefFou;
var menu                : MenuAchats;
let esb                 : EsbFunctions;

const log               = new Log;
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------
fonction.importJdd();

const sNomFournisseur   = fonction.getInitParam('fournisseur', 'TA_Fournisseur_Recette');
const sRayon            = fonction.getInitParam('rayon', 'Fruits et légumes');

const sArticles          = fonction.getInitParam('listeArticles', '5600,5800,5900,6000,6100,9200,6300,6400,6600,7100,7300,7600');
const aListeArticles     = sArticles.split(',');

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuAchats(page, fonction);    
    pageReferentielFour = new PageRefFou(page);
    esb                 = new EsbFunctions(fonction);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async({}, testInfo) => {
    await fonction.close(testInfo);
})
 
//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async() => {
       await fonction.connexion(page);
    })
  
    test.describe('Page [ACCUEIL]', async () => {

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {
            await menu.selectRayonByName(sRayon, page);
        })

    })

    test.describe('Page [REFERENTIEL]', async () => {

       var pageName    = 'referentiel';

       test("Menu [REFERENTIEL] - Click ", async () => {
           await menu.click(pageName, page);
       })

       test.describe('Onglet [FOURNISSEURS]', async () => {

        var sNomOnglet = 'fournisseurs';

            test ('Onglet [FOURNISSEURS] - Click', async () => {
                await menu.clickOnglet(pageName, sNomOnglet, page);
            })   

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page); // Par défaut, aucune erreur remontée au chargement de l'onglet
            })

            test('InputField [FILTRE FOURNISSEUR] = "' + sNomFournisseur + '"', async () =>  {
                await fonction.sendKeys(pageReferentielFour.inputFiltreArticle, sNomFournisseur + '-' + fonction.getToday('US'), false, 'Fournisseur');
                await fonction.wait(page, 500);     // On attend que la liste se rafraîchisse
            })

            test ('CheckBox [FOURNISSEUR] - Select', async () => {
                await fonction.clickElement(pageReferentielFour.tdDesignationFournisseur.filter({ hasText: sNomFournisseur.charAt(0).toUpperCase() + sNomFournisseur.slice(1).toLowerCase() + '-' + fonction.getToday('US') }));
            });

            const nomPopin = 'Saisir le référentiel article';

            test.describe('Popin [' + nomPopin.toUpperCase() + ']', async () => {

                test('Button [REFERENCE ARTICLE] - Click', async () => {
                    await fonction.clickAndWait(pageReferentielFour.buttonReferenceArticle, page);
                });

                test('Popin [' + nomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomOnglet, true);
                });

                test('Button [ARTICLE AJOUT LISTE] - Click', async () => {
                    await fonction.clickAndWait(pageReferentielFour.pPrefArtButtonAjoutListe, page);
                });

                test('DataGrid [VALUES] - Check', async () => {
                    const aCodeArticleTab = (await pageReferentielFour.pPrefArtDataGridCode.allTextContents()).map(code => code.trim()); //get a tab of all code articles in the datagrid
                    aListeArticles.forEach(article => {
                        const bArticleFound = aCodeArticleTab.includes(article);
                        expect(bArticleFound).toBe(true); //expect to found article in the tab
                    });
                });

                test('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pageReferentielFour.pPrefArtButtonAnregistrer, page);
                });

                test ('Popin [' + nomPopin.toUpperCase() + '] - Is Hidden', async () => {
                    await fonction.popinVisible(page, sNomOnglet, false);
                });

                test.describe ('Vérifier le rattachement', async () => {
                    test('Button [REFERENCE ARTICLE] - Click #2', async () => {
                        await fonction.clickAndWait(pageReferentielFour.buttonReferenceArticle, page);
                    });

                    test ('DataGrid [VALUES] - Check Is Not Empty', async () => {
                        const rowCount = await pageReferentielFour.pPrefArtDataGridCode.count();
                        expect(rowCount).toBeGreaterThan(0);
                    })

                    test('Button [ANNULER] - Click', async () => {
                        await fonction.clickAndWait(pageReferentielFour.pPrefArtlinkAnnuler, page);
                    });
                });

            });

       })  // End Describe Onglet

    })  // End describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})  // End describe