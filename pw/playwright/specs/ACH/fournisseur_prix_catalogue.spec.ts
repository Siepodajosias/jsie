/**
 * 
 * @author Mathis NGUYEN
 * @description Définir les prix catalogues du fournisseur
 * @since 2024-05-31
 * 
 */
const xRefTest      = "ACH_FOU_PRI";      
const xDescription  = "Définir les prix catalogues du fournisseur";
const xIdTest       =  249;
const xVersion      = "3.4";

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

import { MenuAchats }               from '@pom/ACH/menu.page';
import { PageRefFou }               from '@pom/ACH/referentiel_fournisseurs.page';

import { CartoucheInfo } 		    from '@commun/types';

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
 
test.afterAll(async ({}, testInfo) => {
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
                await fonction.sendKeys(pageReferentielFour.inputFiltreArticle, sNomFournisseur + '-' + fonction.getToday('US'), false, 'Nom Fournisseur');
                await fonction.wait(page, 500);     // On attend que la liste se rafraîchisse
            })

            test ('CheckBox [FOURNISSEUR] - Select', async () => {
                await fonction.clickElement(pageReferentielFour.tdDesignationFournisseur.filter({ hasText: sNomFournisseur.charAt(0).toUpperCase() + sNomFournisseur.slice(1).toLowerCase() + '-' + fonction.getToday('US') }));
            });

            const nomPopin = 'Saisir les prix catalogues, remises et taxes';

            test.describe('Popin [' + nomPopin.toUpperCase() + ']', async () => {

                test('Button [REMISE] - Click', async () => {
                    await fonction.clickAndWait(pageReferentielFour.buttonRemise, page);
                });

                test('Popin [' + nomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomOnglet, true);
                });

                aListeArticles.forEach((sArticle:string, i) => {

                    test.describe ('Ajout Article' + ' #' + i + ']', async () => {

                        let iPrixCatalogue;
                
                        test('AutoComplete [CODE DESIGNATION ARTICLE] = "' + sArticle + '" #' + i, async () => {
                            const autoComplete = {
                                libelle: 'Code ou Designation Article',
                                inputLocator: pageReferentielFour.pInputCodeOuDesignation,
                                inputValue: sArticle,
                                page: page
                            };
                            await fonction.autoComplete(autoComplete);
                        });
                
                        test('InputField [PRIX CATALOGUE] #' + i, async () => {
                            iPrixCatalogue = (Math.floor(fonction.random() * 10) + 1); // Random price between 1 and 10
                            await fonction.sendKeys(pageReferentielFour.pInputPrixCatalogue, iPrixCatalogue, false, 'Prix Catalogue');
                        });

                        const sUnitAchat:string = 'Colis';
                        test('ListBox [UNITE ACHAT] = "' + sUnitAchat + '" #' + i, async () => {
                            await fonction.selectListBoxByLabel(pageReferentielFour.pListBoxUniteAchat, sUnitAchat, page);
                        });

                        test('Button [AJOUTER PRIX CATALOGUE] - Click #' + i, async () => {
                            await fonction.clickAndWait(pageReferentielFour.pButtonPlusCatalogue, page);
                        });
                
                        test('DataGrid [VALUES] - Check #' + i, async () => {
                            const bArticleFound = (await pageReferentielFour.tdDesignationArticle.filter({ hasText: sArticle }).count()) === 1;
                            expect(bArticleFound).toEqual(true); //check if article was added to the list
                
                            const parent = pageReferentielFour.tdDesignationArticle.filter({ hasText: sArticle }).first().locator('..'); // Get parent element
                            const iPrixCatalogueFound = (await parent.locator(pageReferentielFour.tdPrixCatalogue).textContent()).trim();
                            expect(parseInt(iPrixCatalogueFound)).toEqual(iPrixCatalogue); //check if related price is ok
                        });
                    });
            
                });

                test('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pageReferentielFour.pButtonEnregsitrerFermer, page);
                });

                test ('Popin [' + nomPopin.toUpperCase() + '] - Is Hidden', async () => {
                    await fonction.popinVisible(page, sNomOnglet, false);
                });

                test.describe ('Vérifier le rattachement', async () => {
                    test('Button [REMISE] - Click #2', async () => {
                        await fonction.clickAndWait(pageReferentielFour.buttonRemise, page);
                    });

                    test ('DataGrid [VALUES] - Check Is Not Empty', async () => {
                        const rowCount = await pageReferentielFour.tdDesignationArticle.count();
                        expect(rowCount).toBeGreaterThan(0);
                    })

                    test('Button [ANNULER] - Click', async () => {
                        await fonction.clickAndWait(pageReferentielFour.pLinkAnnuler, page);
                    });
                });

            });

       })  // End Describe Onglet

    })  // End describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})  // End describe