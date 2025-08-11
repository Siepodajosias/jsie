/**
 * 
 * @author ABDOUL SARBA
 *  Since 2025-05-26
 */

const xRefTest      = "MAG_AUT_SLR";
const xDescription  = "Supprimer la régionalisation";
const xIdTest       =  9412;
const xVersion      = '3.4';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['groupeArticle','listeArticles'],
    fileName    : __filename
};

//--------------------------------------------------------------------------------------

import { expect, test, type Page }     from '@playwright/test';
   
import { TestFunctions }               from "@helpers/functions";
import { Log }                         from "@helpers/log";
import { Help }                        from '@helpers/helpers';
   
import { MenuMagasin }                 from '@pom/MAG/menu.page';
import { CartoucheInfo }               from '@commun/types';
import { AutorisationsRecomOuverture } from '@pom/MAG/autorisations-recommandations_ouverture.page';
import { AutorisationsAchatsCentrale } from '@pom/MAG/autorisations-achats_centrale.page';

//----------------------------------------------------------------------------------------
let page                               : Page;

let menu                               : MenuMagasin;
let pageAutoRecomOuverture             : AutorisationsRecomOuverture;
let pageAutoAchatCentrale              : AutorisationsAchatsCentrale;

const log                              = new Log();
const fonction                         = new TestFunctions(log);


//-----------------------------------------------------------------------------------------
var sGroupeArticle                     = fonction.getInitParam('groupeArticle', fonction.getLocalConfig('groupeArticleRegionalise')); 
var sDesignationAssortiment            = fonction.getInitParam('designationAssortiment', fonction.getLocalConfig('assortimentRegionalise'));
var aListeArticles                     = fonction.getInitParam('listeArticles',fonction.getLocalConfig('articleRegionalise'));         // Liste d'articles à regionaliser
//-------------------------------------------------------------------------------------
test.beforeAll(async ({ browser }, testInfo) => {
    page                   = await browser.newPage(); 
    menu                   = new MenuMagasin(page, fonction);
    pageAutoRecomOuverture = new AutorisationsRecomOuverture(page);
    pageAutoAchatCentrale  = new AutorisationsAchatsCentrale(page);

    const helper           = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});
//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [AUTORISATIONS]', async () => {

        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            await menu.pPopinAlerteSanitaire.isVisible().then(async (isVisible) => {
                if(isVisible){
                    await menu.removeArlerteMessage(page);
                }else{
                    log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                    test.skip();
                }
            })
        })

        var sNomPage:string = 'autorisations';

        test ('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 
    
        test.describe('Onglet [ RECOMMANDATION D\'OUVERTURE]', async () => {
            var sNomOnglet: string = 'recomOuverture';
            test('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, sNomOnglet, page);
            });

            test('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
                await fonction.clickElement(pageAutoRecomOuverture.listBoxGroupeArticle)
                await fonction.clickElement(pageAutoRecomOuverture.listBoxChoixGroupeArticle.filter({ hasText: sGroupeArticle }).first());
            });

            
            test('Input [ARTICLE] ="' +aListeArticles[0] +'"', async () => {
                await fonction.sendKeys(pageAutoRecomOuverture.dataGridListeRecomInputCode, aListeArticles[0], false, 'Code Article'); 
               await  fonction.waitForDomStable(page);     
            });

            test('waitForSpinner - Wait Until Spinner Off ', async () => {
                await fonction.waitForSpinner(pageAutoRecomOuverture.spinner);
            });

            test('Chexkbox [ARTICLE][' + aListeArticles[0] + '] - Click ', async () => { //Je decoche le premier article de ma liste d'articles qui a été regionalisé au paravant
                await fonction.clickAndWait(pageAutoRecomOuverture.dataGridTdcheckboxRegionaliser.first(),page);
            });

            test('CheckBox [ARTICLE][' + aListeArticles[0] + '] - Is Not Checked ', async () => {
                expect(pageAutoRecomOuverture.dataGridTdcheckboxRegionaliser.locator('input').isChecked()).toBeFalsy;
            });

            test('Button [REGIONALISER] - Click', async () => {
                await fonction.clickAndWait(pageAutoRecomOuverture.buttonRegionaliser,page);
            });

            test('** Wait Until Spinner Off 1 **', async () => {
                await fonction.waitForSpinner(pageAutoRecomOuverture.spinner);
            });
        });

        test.describe('Popin [REGIONALISATION DES ARTICLES]', async () => {

            var sNomPopin: string = 'Régionalisation des articles ' + sGroupeArticle;

            test('Popin [' + sNomPopin + ']- Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            })

            test('Input [CODE ARTICLE]="' + aListeArticles[0] + '"', async () => {  // je recherche par code article
             await fonction.sendKeys(pageAutoRecomOuverture.pDataGridInputCodeRegionalisa, aListeArticles[0], false, 'Code Article');
             await fonction.waitForDomStable(page);                                  // Attendre que les lignes disparaissent
            })

            test('Tr [ARTICLE][' + aListeArticles[0] + '] - Is Not Visible ', async () => { // Ligne ne doit pas etre visible dans la liste
                await expect(pageAutoRecomOuverture.pDataGridTrRegionalisation.first()).not.toBeVisible();
            })

            for (let i = 1; i < aListeArticles.length; i++) {
                const article = aListeArticles[i];
                test('Input [CODE ARTICLE] ="' + article + '"', async () => {
                    await fonction.sendKeys(pageAutoRecomOuverture.pDataGridInputCodeRegionalisa, article, false, 'Code Article');
                });
                test('Tr [ARTICLE][' + article + '] - Is Visible ', async () => {
                    await expect(pageAutoRecomOuverture.pDataGridTrRegionalisation.first()).toBeVisible();
                });
            } //-- Fin boucle for

            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageAutoRecomOuverture.pButtonEnregistrerRegionalisat, page);
            });
        }) //-- Fin Describe

        test.describe('Onglet [ ACHAT CENTRALE]', async () => {

            var sNomOnglet: string = 'autorisationAchatCentrale';
            test('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, sNomOnglet, page);
            });

            test('Input [GROUPE ARTICLE]= "' + sGroupeArticle + '"', async () => {
                await fonction.clickElement(pageAutoAchatCentrale.listBoxGroupeArticle);
                await fonction.sendKeys(pageAutoAchatCentrale.listBoxGrpeArtInput, sGroupeArticle, false, 'Groupe Article');
            });

            test('ListBox [GROUPE ARTICLE] - Click', async () => {
                await fonction.clickElement(pageAutoAchatCentrale.listBoxGrpeArtItem.nth(0));
                await fonction.clickElement(pageAutoAchatCentrale.listBoxGrpeArtIcon);
            });

            test('CheckBox [LISTE ASSORTIMENTS][' + sDesignationAssortiment + '] - Click', async () => {
                await fonction.clickAndWait(pageAutoAchatCentrale.checkBoxAssortiments.filter({ hasText: sDesignationAssortiment }).first(), page);
            });

            test('** Wait Until Spinner Off 1 **', async () => {
                await fonction.waitForSpinner(pageAutoAchatCentrale.spinner);
            });

            test('Input [ARTICLE] = "' + aListeArticles[0] + '"', async () => {
                await fonction.sendKeys(pageAutoAchatCentrale.dataGridHeaderCdeArt, aListeArticles[0], false, 'Code Article');
                await fonction.waitForDomStable(page);
            });

            test('Tr [ARTICLE][' + aListeArticles[0] +'] - Click', async () => {
                await fonction.clickElement(pageAutoAchatCentrale.trLignesArticles.first());
            })

            test('Picto [MODIFIER] - Click', async () => {
                await fonction.clickElement(pageAutoAchatCentrale.pictoModiferLigne, page);
            });

            test.describe('Popin [MODIFICATION D\'UNE LIGNE DE L\'ASSORTIMENT]', async () => {

                var sNomPopin: string = 'Modification d\'une ligne de l\'assortiment ';
                test('Popin [' + sNomPopin + '][' + aListeArticles[0] + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test('Button [TYPES MAGASINS] - Click', async () => {
                    const iPListBoxRegion = await pageAutoAchatCentrale.pToggleGroupeMagasins.count();
                    for (let i = 0; i < iPListBoxRegion; i++) {
                        const bIsVisible = await pageAutoAchatCentrale.pFiltreGroupeMagasins.locator('button').nth(i).isVisible();
                        if (bIsVisible) {
                            await pageAutoAchatCentrale.pFiltreGroupeMagasins.locator('button').nth(i).scrollIntoViewIfNeeded(); // On scrolle la liste pour s'assurer que tous les éléments sont visibles afin de cliquer 
                            await fonction.clickElement(pageAutoAchatCentrale.pFiltreGroupeMagasins.locator('button').nth(i));
                        }
                    } //-- fin boucle for 
                })

                test('Picto [RECOMMANDATION]['+ aListeArticles[0]+'] - Expect', async () => { /**Je vérifie que l’icône de recommandation d’ouverture est visible pour tous les articles, et non plus uniquement pour ceux issus des régions concernées par la régionalisation. */
                    const visibleIcons          = pageAutoAchatCentrale.pPdataGridListeRecord.locator('i.pi-bookmark-fill:visible');
                    const bVisibleCount: number = await visibleIcons.count();
                    expect(bVisibleCount).not.toBe(0);
                })

                test('Button [FERMER][' + aListeArticles[0] + '] - Click', async () => {
                    await fonction.clickAndWait(pageAutoAchatCentrale.pPButtonFermer, page);
                })

                test('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                });
            }) //-- Fin describe
        }) //-- Fin describe
    });

    // Déconnexion
    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
});