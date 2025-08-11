/**
 * 
 * @author ABDOUL SARBA
 *  Since 2025-05-26
 */

const xRefTest      = "MAG_GPE_SRO";
const xDescription  = "Supprimer toutes les reco d'ouverture pour un article";
const xIdTest       =  9484;
const xVersion      = '3.0';

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
var aListeArticles                     = fonction.getInitParam('listeArticles',fonction.getLocalConfig('articleRegionalise')); // Liste d'articles à regionaliser
var sDossierAchat                      = fonction.getInitParam('dossierAchat', fonction.getLocalConfig('dossierAchatRegionalise'));
//-----------------------------------------------------------------------------------------
test.beforeAll(async ({ browser }, testInfo) => {
    page                               = await browser.newPage(); 
    menu                               = new MenuMagasin(page, fonction);
    pageAutoRecomOuverture             = new AutorisationsRecomOuverture(page);
    pageAutoAchatCentrale              = new AutorisationsAchatsCentrale(page);

    const helper                       = new Help(info, testInfo, page);
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

        test('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            await menu.pPopinAlerteSanitaire.isVisible().then(async (isVisible) => {
                if (isVisible) {
                    await menu.removeArlerteMessage(page);
                } else {
                    log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                    test.skip();
                }
            })
        })

        var sNomPage: string = 'autorisations';

        test('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(sNomPage, page);
        })

        test.describe('Onglet [ RECOMMANDATION D\'OUVERTURE]', async () => {
            var sNomOnglet: string = 'recomOuverture';
            test('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, sNomOnglet, page);
            });

            test('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {         // Je choisie un groupe article
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

            aListeArticles.forEach((article: any) => {   /** Je boucle sur chaque code article de la liste pour décocher les caracteristiques Gammes,plateformes,strategies... */ 
                test('Input  [CODE ARTICLE] = "' + article + '"', async () => {
                    await fonction.sendKeys(pageAutoRecomOuverture.dataGridListeRecomInputCode, article, false, 'Code Article');
                    await fonction.waitForDomStable(page)
                });

                test('CheckBox [TYPE MAGASIN][' + article + '] - Click', async () => {
                    const iNbCheckBox: number = await pageAutoRecomOuverture.dataGridTdCheckBox.count();      // iNbCheckBox contient le nombre  de cases à décocher                
                    for (let i = 0; i < iNbCheckBox; i++) {
                        const isChecked = await pageAutoRecomOuverture.dataGridTdCheckBox.nth(i).locator('input').isChecked();
                        if (isChecked) {                                                                     // On ne clique que si la case est cochée
                            await fonction.clickElement(pageAutoRecomOuverture.dataGridTdCheckBox.nth(i)); // click sur la case à décocher, 
                        }
                    }
                })

                test('CheckBox [ARTICLE][' + article + '] - Is Not Checked ', async () => {
                    const iNbCheckBox: number = await pageAutoRecomOuverture.dataGridTdCheckBox.count();
                    for (let i = 0; i < iNbCheckBox; i++) {
                        expect(pageAutoRecomOuverture.dataGridTdCheckBox.nth(i).locator('input').isChecked()).toBeFalsy;
                    }
                });
            }) // Fin forEach

        });

        test('Button [ENREGISTRER] - Click', async () => {               // Je clique sur Enregistrer
            await fonction.clickAndWait(pageAutoRecomOuverture.buttonEnregistrer, page);
        });

        test('** Wait Until Spinner Off 1 **', async () => {
            await fonction.waitForSpinner(pageAutoRecomOuverture.spinner);
        });

        test.describe('Onglet [ ACHAT CENTRALE]', async () => {

            var sNomOnglet: string = 'autorisationAchatCentrale';
            test('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, sNomOnglet, page);
            });

            test('Input [GROUPE ARTICLE]= "' + sGroupeArticle + '"', async () => {    // Je choisie un groupe article
                await fonction.clickElement(pageAutoAchatCentrale.listBoxGroupeArticle);
                await fonction.sendKeys(pageAutoAchatCentrale.listBoxGrpeArtInput, sGroupeArticle, false, 'Groupe Article');
            });

            test('ListBox [GROUPE ARTICLE] - Click', async () => {               // Je choisie un groupe article
                await fonction.clickElement(pageAutoAchatCentrale.listBoxGrpeArtItem.nth(0));
                await fonction.clickElement(pageAutoAchatCentrale.listBoxGrpeArtIcon);
            });

            test('CheckBox [LISTE ASSORTIMENTS][' + sDesignationAssortiment + '] - Click', async () => {     // Je choisie un assortiment
                await fonction.clickAndWait(pageAutoAchatCentrale.checkBoxAssortiments.filter({ hasText: sDesignationAssortiment }).first(), page);
            });

            test('ListBox [DOSSIER ACHAT] - Click', async () => {                                         // Je choisie un dossier achat
               await fonction.selectOption(pageAutoAchatCentrale.listBoxDossierAchat, sDossierAchat);
            });

            test('** Wait Until Spinner Off 1 **', async () => {
                await fonction.waitForSpinner(pageAutoAchatCentrale.spinner);
            });

            aListeArticles.forEach((article: any) => {  /** Je boucle sur chaque code article de la liste pour verifier l'article contenu dans l'assortiment ne possede plus l'icone recommanders... */ 

                test('Input [ARTICLE] = "' + article + '" - Click', async () => {
                    await fonction.sendKeys(pageAutoAchatCentrale.dataGridHeaderCdeArt, article, false, 'Code Article');
                    await fonction.waitForDomStable(page)
                });

                test('Tr [ARTICLE][' + article + ']- Click', async () => {
                    await fonction.clickElement(pageAutoAchatCentrale.trLignesArticles.first());
                })

                test('Picto [MODIFIER]['+article+'] - Click', async () => {
                    await fonction.clickElement(pageAutoAchatCentrale.pictoModiferLigne, page);
                });

                test.describe('Popin [MODIFICATION D\'UNE LIGNE DE L\'ASSORTIMENT]', async () => {

                    var sNomPopin: string = 'Modification d\'une ligne de l\'assortiment ';
                    test('Popin [' + sNomPopin + '][' + article + '] - Is Visible', async () => {
                        await fonction.popinVisible(page, sNomPopin, true);
                    })

                    test('Picto [RECOMMANDATION][' + article + '] - Is Not Visible', async () => { // Je verifie que l'icone recommander n'est visible plus  en fonction des filtres 
                        const visibleIcons          = pageAutoAchatCentrale.pPdataGridListeRecord.locator('i.pi-bookmark-fill:visible');
                        const iVisibleCount: number = await visibleIcons.count();
                        expect(iVisibleCount).toBe(0);
                    })

                    test('Button [FERMER][' + article + '] - Click', async () => {
                        await fonction.clickAndWait(pageAutoAchatCentrale.pPButtonFermer, page);
                    })

                    test('Popin [' + sNomPopin + '][' + article + '] - Is Not Visible', async () => {
                        await fonction.popinVisible(page, sNomPopin, false);
                    });
                })
            })
        })
    });

    // Déconnexion
    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
});