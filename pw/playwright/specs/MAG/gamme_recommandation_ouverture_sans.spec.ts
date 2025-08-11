/**
 * 
 * @author ABDOUL SARBA
 *  Since 2025-05-23
 */

const xRefTest     = "MAG_GPE_RSG";
const xDescription = "Paramétrer toutes les reco d'ouverture pour un article (rayon sans référence de gamme)";
const xIdTest      = 9970;
const xVersion     = '3.6';

var info: CartoucheInfo = {
    desc      : xDescription,
    appli     : 'MAGASIN',
    version   : xVersion,
    refTest   : [xRefTest],
    idTest    : xIdTest,
    help      : [],
    params    : ['groupeArticle', 'listeArticles', 'designationAssortiment'],
    fileName  : __filename
};

//-----------------------------------------------------------------------------------------
import { expect, test, type Page }     from '@playwright/test';

import { TestFunctions }               from "@helpers/functions";
import { Log }                         from "@helpers/log";
import { Help }                        from '@helpers/helpers';

import { MenuMagasin }                 from '@pom/MAG/menu.page';
import { CartoucheInfo }               from '@commun/types';
import { AutorisationsRecomOuverture } from '@pom/MAG/autorisations-recommandations_ouverture.page';
import { AutorisationsAchatsCentrale } from '@pom/MAG/autorisations-achats_centrale.page';
//-------------------------------------------------------------------------------------------
let page                               : Page;

let menu                               : MenuMagasin;
let pageAutoRecomOuverture             : AutorisationsRecomOuverture;
let pageAutoAchatCentrale              : AutorisationsAchatsCentrale;
 
const log                              = new Log();
const fonction                         = new TestFunctions(log);
//-----------------------------------------------------------------------------------------
var sGroupeArticle                     = fonction.getInitParam('groupeArticle', fonction.getLocalConfig('groupeArticleRegionalise')); 
var sDesignationAssortiment            = fonction.getInitParam('designationAssortiment', fonction.getLocalConfig('assortimentRegionalise'));
var aListeArticles                     = fonction.getInitParam('listeArticles',fonction.getLocalConfig('articleRegionalise')); // Liste d'articles à regionaliser
var sDossierAchat                      = fonction.getInitParam('dossierAchat', fonction.getLocalConfig('dossierAchatRegionalise'));
//-----------------------------------------------------------------------------------------
test.beforeAll(async ({ browser }, testInfo) => {
    page                   = await browser.newPage();
    menu                   = new MenuMagasin(page, fonction);
    pageAutoRecomOuverture = new AutorisationsRecomOuverture(page);
    pageAutoAchatCentrale  = new AutorisationsAchatsCentrale(page);
    const helper           = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({ }, testInfo) => {
    await fonction.close(testInfo);
});

//-----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACCUEIL]', async () => {

        test('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if (isVisible) {
                await menu.removeArlerteMessage(page);
            } else {
                log.set('Link [BROWSER SECURITY WARNING] - Click: ACTION ANNULEE');
                test.skip();
            }
        })

    })

    test.describe('Page [AUTORISATIONS]', () => {

        var sNomPage: string = 'autorisations';
        test('Page [AUTORISATIONS] - Click', async () => {
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
            test('** Wait Until Spinner Off 1 **', async () => {
                await fonction.waitForSpinner(pageAutoRecomOuverture.spinner);
            })

            test('ListBox [DOSSIER ACHAT] = "' + sDossierAchat + '"', async () => {       // Je choisie un dossier achat
                await fonction.clickElement(pageAutoRecomOuverture.multiSelectDossierAchat)
                await fonction.clickElement(pageAutoRecomOuverture.multiSelectDossierAchatItem.filter({ hasText: sDossierAchat }).first());
            });

            aListeArticles.forEach((article: any) => {  /**on boucle sur chaque code article de la liste pour cocher les caracteristiques Gammes,plateformes,strategies...*/
                test('Input  [CODE ARTICLE] = "' + article + '"', async () => {
                    await fonction.sendKeys(pageAutoRecomOuverture.dataGridListeRecomInputCode, article, false, 'Code Article');
                    await fonction.waitForDomStable(page)
                });

                test('CheckBox [TYPE MAGASIN][' + article + '] - Click', async () => {
                    const iNbCheckBox: number = await pageAutoRecomOuverture.dataGridTdCheckBox.count();
                    await fonction.waitForDomStable(page) // iNbCheckBox contient le nombre  de cases à cocher
                    for (let i = 0; i < iNbCheckBox - 1; i++) {
                        await fonction.clickElement(pageAutoRecomOuverture.dataGridTdCheckBox.nth(i)); // click sur la case à cocher, sauf regionalisation
                    }
                })
            }) //-- Fin boucle forEach

            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageAutoRecomOuverture.buttonEnregistrer, page);
            });
        });

        test.describe('Onglet [ ACHAT CENTRALE]', async () => {
            var sNomOnglet: string = 'autorisationAchatCentrale';
            test('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, sNomOnglet, page);
            });

            test('Input [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
                await fonction.clickElement(pageAutoAchatCentrale.listBoxGroupeArticle);
                await fonction.sendKeys(pageAutoAchatCentrale.listBoxGrpeArtInput, sGroupeArticle, false, 'Groupe Article');
            });

            test('ListBox [GROUPE ARTICLE] - Click', async () => {
                await fonction.clickElement(pageAutoAchatCentrale.listBoxGrpeArtItem.nth(0));
                await fonction.clickElement(pageAutoAchatCentrale.listBoxGrpeArtIcon);
            });

            test('CheckBox [LISTE ASSORTIMENTS][' + sDesignationAssortiment + '] - Click', async () => {
                await fonction.clickAndWait(pageAutoAchatCentrale.checkBoxAssortiments.filter({ hasText: sDesignationAssortiment }).first(), page);
            })

            test('** Wait Until Spinner Off 1 **', async () => {
                await fonction.waitForSpinner(pageAutoAchatCentrale.spinner);
            })
                                                       
            aListeArticles.forEach((article: any) => {  /**Je boucle sur chaque code article de la liste pour verifier l'article contenu dans l'assortiment possede l'icone recommander */

                test('Input [CODE ARTICLE]=' + article + '', async () => {
                    await fonction.sendKeys(pageAutoAchatCentrale.dataGridHeaderCdeArt, article, false, 'Code Article');
                    await fonction.waitForDomStable(page); //attente pour eviter les conflicts de click , un click trop rapide peut cibler le mauvais element
                })

                test('Tr [ARTICLE][' + article + '] - Click', async () => {
                    await fonction.clickElement(pageAutoAchatCentrale.trLignesArticles.first());
                })

                test('Button [MODIFIER][' + article + '] - Click', async () => {
                    await fonction.clickAndWait(pageAutoAchatCentrale.pictoModiferLigne, page)
                });

                test.describe('Popin [MODIFICATION D\'UNE LIGNE DE L\'ASSORTIMENT]', async () => {

                    var sNomPopin: string = 'Modification d\'une ligne de l\'assortiment ';
                    test('Popin [' + sNomPopin + '][' + article + '] - Is Visible', async () => {
                        await fonction.popinVisible(page, sNomPopin, true);
                    })

                    test('Button [FILTRES STRATEGIES][' + article + '] - Click ', async () => {  // Je filtre par strategies
                        const iNbButtonFiltresStrat:number = await pageAutoAchatCentrale.pFiltreStrategies.locator('button').count();
                        for (let i = 0; i < iNbButtonFiltresStrat; i++) {
                            await fonction.clickElement(pageAutoAchatCentrale.pFiltreStrategies.locator('button').nth(i));
                        }
                    })

                    test('Button [FILTRES PLATFORMES][' + article + '] - Click ', async () => { // Je filtre par plateformes
                        const iNbButtonFiltresPlat:number = await pageAutoAchatCentrale.pFiltrePlatformes.locator('button').count();
                        for (let i = 1; i < iNbButtonFiltresPlat; i++) {
                            await fonction.clickElement(pageAutoAchatCentrale.pFiltrePlatformes.locator('button').nth(i));
                        }
                    })

                    test('Button [FILTRES GAMMES][' + article + '] - Click ', async () => { // Je filtre par Gammes (autres)
                        await fonction.clickElement(pageAutoAchatCentrale.pFiltreGammes.locator('button'));
                    })

                    test('Picto [RECOMMANDATION][' + article + '] - Is Visible', async () => {
                        const visibleIcons         = pageAutoAchatCentrale.pPdataGridListeRecord.locator('i.pi-bookmark-fill:visible');
                        const visibleCount: number = await visibleIcons.count();
                        expect(visibleCount).toBeGreaterThan(0);                      
                        for (let i = 0; i < visibleCount; i++) { //Je vérifie que chaque icône visible
                            const currentIcon = visibleIcons.nth(i);
                            await currentIcon.scrollIntoViewIfNeeded();
                            await expect(currentIcon).toBeVisible();
                        }
                    });

                    test('Button [FERMER][' + article + '] - Click', async () => {
                        await fonction.clickAndWait(pageAutoAchatCentrale.pPButtonFermer, page);
                    })
                })

            }); // end forEach
        });
    });
    // Déconnexion
    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
});