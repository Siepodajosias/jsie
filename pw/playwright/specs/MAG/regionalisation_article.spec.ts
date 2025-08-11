/**
 * 
 * @author ABDOUL SARBA
 *  Since 2025-05-22
 */

const xRefTest     = "MAG_AUT_RDA";
const xDescription = "Régionaliser des articles";
const xIdTest      = 9566;
const xVersion     = '3.5';

var info: CartoucheInfo = {
    desc    : xDescription,
    appli   : 'MAGASIN',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : [],
    params  : ['groupeArticle', 'listeArticles', 'designationAssortiment'],
    fileName: __filename
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
//-----------------------------------------------------------------------------------------
//je declare cet objet je veux boucler dessus pour verifier 
let aArticlesParRegion: Record<string, string[]> = {};
let aEntetesParRegion : Record<string, string[]> = {};
//-----------------------------------------------------------------------------------------
/*
cette fonction  permet de régionaliser les articles
Elle récupère la sélection actuelle, ouvre la liste déroulante si nécessaire, récupère les régions disponibles, 
calcule la répartition des articles par région, puis traite chaque région
Pour chaque article, elle applique les actions de régionalisation correspondantes au type de région choisie 
*/
var regionaliserArticles = async () => {
    // Je recupere la sélection actuelle
    let sCurrentSelection:string = await pageAutoRecomOuverture.pListBoxTypeRegionalisation.innerText();
    if (sCurrentSelection !== "régions Prosol") {                                                      // j'ouvrir la liste déroulante si nécessaire
        await fonction.clickElement(pageAutoRecomOuverture.pListBoxTypeRegionalisation);
    }  

    const iNbRegions: number   = await pageAutoRecomOuverture.pListBoxTypeRegionalisationItem.count(); //Je récupère toutes les régions disponibles 
    const aRegions  : string[] = [];
    for (let i = 0; i < iNbRegions; i++) {
        const sRegionName:string = await pageAutoRecomOuverture.pListBoxTypeRegionalisationItem.nth(i).innerText(); // Je calcule la répartition des articles par région, si j'ai beaucoup d'articles faut que je les répartisse
        aRegions.push(sRegionName);
    }

    const nbArticles = aListeArticles.length;
    const repartition = calculerRepartition(nbArticles, iNbRegions, aRegions);

    aArticlesParRegion = {};
    for (const region of repartition) {                                                                               // Je traite pour chaque région 
        const sCurrentRegionSelection: string = await pageAutoRecomOuverture.pListBoxTypeRegionalisation.innerText();// je verifie si je doit changer de région
        const bNeedToChangeRegion    : boolean= sCurrentRegionSelection !== region.typeRegionalisation;
        if (bNeedToChangeRegion) {
            await fonction.clickElement(pageAutoRecomOuverture.pListBoxTypeRegionalisation);
            await fonction.clickElement(pageAutoRecomOuverture.pListBoxTypeRegionalisationItem.filter({ hasText: region.typeRegionalisation }).first());
            await fonction.clickElement(pageAutoRecomOuverture.pChevronIconRegionalisation);
        }
        if (!aArticlesParRegion[region.typeRegionalisation]) {
            aArticlesParRegion[region.typeRegionalisation] = [];
        }
        
        for (const article of region.articles) {                                                                // Je traite les articles de cette région
            await fonction.sendKeys(pageAutoRecomOuverture.pDataGridInputCodeRegionalisa, article, false, 'Code Article');
            await fonction.waitForDomStable(page);                      // J'attends que le tableau se charge après la saisie pour eviter la selection de la mauvaise ligne                
            await cocherCheckboxesActives(region.typeRegionalisation); // je ccche les checkboxes actives

            aArticlesParRegion[region.typeRegionalisation].push(article);
        }
    }
    log.set('En-têtes par région:' + aEntetesParRegion);
};
aArticlesParRegion = {};
aEntetesParRegion  = {}; 

// Fonction pour récupérer les en-têtes des colonnes
const recupererEntetes = async () => {
    const aEntetes: string[]= [];                                                                     
    const iNbTh   : number  = await pageAutoRecomOuverture.pDataGridThCriteresRegionalisa.count(); // Je sélectionne spécifiquement les th de type critère (colonnes de personnes)
    for (let i = 0; i < iNbTh; i++) {
        const sTexteEntete: string = await pageAutoRecomOuverture.pDataGridThCriteresRegionalisa.nth(i).innerText();
        aEntetes.push(sTexteEntete.trim());
    }
    return aEntetes;
};

// Fonction pour détecter et cocher les checkboxes actives
const cocherCheckboxesActives = async (typeRegion: string) => {

    const aEntetes: string[]       = await recupererEntetes(); // je recupere les en-têtes une seule fois par région

    const iNbLignesActives: number = await pageAutoRecomOuverture.pDataGridTrRegionalisation.count(); // Je récupére uniquement les lignes actives 
    let iCheckboxesCochees: number = 0;
    const iMaxCheckboxes  : number = 3;    // le nombre de checkbox max par ligne , est au choix 

    if (!aEntetesParRegion[typeRegion]) { // j'nitialise le tableau des en-têtes pour cette région si nécessaire
        aEntetesParRegion[typeRegion] = [];
    }

    let i = 0;
    while (i < iNbLignesActives && iCheckboxesCochees < iMaxCheckboxes) {
        const ligneActive = pageAutoRecomOuverture.pDataGridTrRegionalisation.nth(i);
        // Chercher les checkboxes dans cette ligne active
        const checkboxesDansLigne            = ligneActive.locator('td p-checkbox');
        const iNbCheckboxesDansLigne: number = await checkboxesDansLigne.count();

        // Cocher les checkboxes de cette ligne (jusqu'à atteindre la limite)
        let j = 0;
        while (j < iNbCheckboxesDansLigne && iCheckboxesCochees < iMaxCheckboxes) {
            const checkbox = checkboxesDansLigne.nth(j);

            try {
                const bIsVisible: boolean = await checkbox.isVisible();
                if (bIsVisible) {
                    await checkbox.waitFor({ state: 'visible', timeout: 2000 });
                    await fonction.clickElement(checkbox, page);
                    iCheckboxesCochees++;

                    // Si les checkboxes sont dans l'ordre des colonnes
                    const iIndexColonne = j;

                    if (iIndexColonne < aEntetes.length) {
                        const sEnteteAssocie = aEntetes[iIndexColonne];
                        if (sEnteteAssocie && !aEntetesParRegion[typeRegion].includes(sEnteteAssocie)) {
                            aEntetesParRegion[typeRegion].push(sEnteteAssocie);
                        }
                    }
                }
            } catch (error) {
                log.set(`Erreur lors du clic sur checkbox ${j} de la ligne ${i}:${error}`);
            }
            j++; 
        } // Fin de la boucle while
        i++;
    } // Fin de la boucle while
    return iCheckboxesCochees;
};



/**
 * Calcul la répartition des articles sur les régions.
 *
 * @param {number} nbArticles Le nombre d'articles total.
 * @param {number} nbRegions Le nombre de régions.
 * @param {any}    aRegions La liste des régions.
 */
const calculerRepartition = (iNbArticles: number, nbRegions: number, aRegions: any) => {
    const aRepartition        = [];
    let iArticleIndex: number = 0;

    for (let iRegionIndex = 0; iRegionIndex < nbRegions; iRegionIndex++) {
        const iArticlesRestants  = iNbArticles - iArticleIndex;
        const iRegionsRestantes  = nbRegions - iRegionIndex;
        const iNbPourCetteRegion = Math.ceil(iArticlesRestants / iRegionsRestantes);

        const iDebutArticle = iArticleIndex;
        const iFinArticle: number = Math.min(iDebutArticle + iNbPourCetteRegion, iNbArticles);

        aRepartition.push({
            iRegionIndex,
            debut: iDebutArticle,
            fin: iFinArticle,
            typeRegionalisation: aRegions[iRegionIndex],
            articles: aListeArticles.slice(iDebutArticle, iFinArticle)
        });

        iArticleIndex = iFinArticle;
    }
    return aRepartition;
};


/**
 * Vérifie si les articles de la liste sont correctement regionalisés.
 * Pour cela, on parcourt la liste des articles et on vérifie si les icônes de recommandation sont visibles.
 * On utilise les différentes actions de vérification en fonction du type de région.
 * 
 */
var verifierArticlesRegionalises = async () => {
    // Selon le type de région choisie, je dois faire des actions de verification differentes
    // Maintenant chaque action boucle sur les en-têtes associés à la région
    const actionsParTypeRegion = {

        'Régions Prosol': async (article: string, aEntetes: string[]) => {
            try {
                // Boucler sur chaque en-tête de cette région
                for (const entete of aEntetes) {
                    // Action de recherche pour cet en-tête
                    await fonction.clickElement(pageAutoAchatCentrale.pListBoxRegionProsol.first());
                    // Rechercher spécifiquement cet en-tête dans la liste
                    const optionEntete = pageAutoAchatCentrale.pCheckboxMultiselectItem.filter({ hasText: entete });
                    if (await optionEntete.count() > 0) {
                        await fonction.clickElement(optionEntete.first());
                    }
                    await fonction.clickElement(pageAutoAchatCentrale.pListBoxRegionProsol.first());
                    // Attendre un peu entre chaque traitement, pour que je DOM soit stable
                    await fonction.waitForDomStable(page);
                }

                const visibleIcons         = pageAutoAchatCentrale.pPdataGridListeRecord.locator('i.pi-bookmark-fill:visible');
                const visibleCount: number = await visibleIcons.count();
                expect(visibleCount).toBeGreaterThan(0);
                // Je verifie que  chaque icône visible
                for (let i = 0; i < visibleCount; i++) {
                    const currentIcon = visibleIcons.nth(i);
                    await currentIcon.scrollIntoViewIfNeeded();
                    await expect(currentIcon).toBeVisible();
                }

            } catch (error) {
                log.set(`Erreur lors du traitement des Régions Prosol pour l'article ${article}:${error.message}`);
                throw error;
            }
        },

        'Secteurs Prosol': async (article: string, aEntetes: string[]) => {
            try {
                // Boucler sur chaque en-tête  de cette région
                for (const entete of aEntetes) {
                 log.set(`Traitement Secteurs Prosol - Article: ${article}, En-tête: ${entete}`);

                    // Action de recherche pour cet en-tête
                    await fonction.clickElement(pageAutoAchatCentrale.pListBoxSecteur.first());
                    // Rechercher spécifiquement cet en-tête dans la liste
                    const optionEntete = pageAutoAchatCentrale.pCheckboxMultiselectItem.filter({ hasText: entete });
                    if (await optionEntete.count() > 0) {
                        await fonction.clickElement(optionEntete.first());
                    }
                    await fonction.clickElement(pageAutoAchatCentrale.pListBoxSecteur.first());
                    // Attendre un peu entre chaque traitement
                    await fonction.waitForDomStable(page);
                }

                const visibleIcons         = pageAutoAchatCentrale.pPdataGridListeRecord.locator('i.pi-bookmark-fill:visible');
                const visibleCount: number = await visibleIcons.count();
                expect(visibleCount).toBeGreaterThan(0);
                // Je verifie que  chaque icône visible
                for (let i = 0; i < visibleCount; i++) {
                    const currentIcon = visibleIcons.nth(i);
                    await currentIcon.scrollIntoViewIfNeeded();
                    await expect(currentIcon).toBeVisible();
                }
            } catch (error) {
                log.set(`Erreur lors du traitement des Secteurs Prosol pour l'article ${article}:${error.message}`);
                throw error;
            }
        },

        'Nouvelles régions': async (article: string, aEntetes: string[]) => {
            try {
                // Boucler sur chaque en-tête  de cette région
                for (const entete of aEntetes) {
                    log.set(`Traitement Nouvelles régions - Article: ${article}, En-tête: ${entete}`);

                    // Action de clic pour cet en-tête - chercher le toggle correspondant
                    const toggleSpecifique = pageAutoAchatCentrale.pToggleGroupeMagasins.first().filter({ hasText: entete });
                    if (await toggleSpecifique.count() > 0) {
                        await fonction.clickElement(toggleSpecifique.first());
                    }

                    // Attendre un peu entre chaque traitement
                    await fonction.waitForDomStable(page);
                }

                const visibleIcons        = pageAutoAchatCentrale.pPdataGridListeRecord.locator('i.pi-bookmark-fill:visible');
                const iVisibleCount:number = await visibleIcons.count();
                expect(iVisibleCount).toBeGreaterThan(0);
                // Vérifier chaque icône visible
                for (let i = 0; i < iVisibleCount; i++) {
                    const currentIcon = visibleIcons.nth(i);
                    await currentIcon.scrollIntoViewIfNeeded();
                    await expect(currentIcon).toBeVisible();
                }
            } catch (error) {
               log.set(`Erreur lors du traitement des Nouvelles régions pour l'article ${article}:${error.message}` );
                throw error;
            }
        }
    };

    for (const [typeRegion, articles] of Object.entries(aArticlesParRegion)) {
        // Récupérer les en-têtes pour cette région
        const entetesRegion = aEntetesParRegion[typeRegion] || [];

        for (const article of articles) {
            //J'insère le code article dans le champ de recherche
            await fonction.sendKeys(pageAutoAchatCentrale.dataGridHeaderCdeArt, article, false, 'Code Article');
            await fonction.waitForDomStable(page); // Attente pour que les autres lignes disparaissent

            // je selectionne ma linge d'article
            await fonction.clickElement(pageAutoAchatCentrale.trLignesArticles.first());

            // Je clique l'icone pour modfier 
            await fonction.clickElement(pageAutoAchatCentrale.pictoModiferLigne, page);

            //** wait for spinner */
            await fonction.waitForSpinner(pageAutoAchatCentrale.pPspinner);

            // je selectionne le type de régionalisation 
            await actionsParTypeRegion[typeRegion](article, entetesRegion);

            // Je ferme la popin de modification
            await fonction.clickElement(pageAutoAchatCentrale.pPButtonFermer, page);
        }
    }
}
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
})

//-----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
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

            test('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
                await fonction.clickElement(pageAutoRecomOuverture.listBoxGroupeArticle)
                await fonction.clickElement(pageAutoRecomOuverture.listBoxChoixGroupeArticle.filter({ hasText: sGroupeArticle }).first());
            });

            test('** Wait Until Spinner Off 1 **', async () => {
                await fonction.waitForSpinner(pageAutoRecomOuverture.spinner);
            });

            //On boucle sur les articles de la liste et on coche la regionalisation
            aListeArticles.forEach((article: any) => {
                test('Input [ARTICLE][' + article + ']', async () => {
                    await fonction.sendKeys(pageAutoRecomOuverture.dataGridListeRecomInputCode, article, false, 'Code Article');
                    await fonction.waitForDomStable(page); //Attente pour eviter les conflits de clics
                });

                test('CheckBox [ARTICLE][' + article + '] - Click', async () => {
                    await fonction.clickElement(pageAutoRecomOuverture.dataGridTdcheckboxRegionaliser);
                });
            }); // end foreach 

            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageAutoRecomOuverture.buttonEnregistrer, page);
            });

            test('** Wait Until Spinner Off 2 **', async () => {
                await fonction.waitForSpinner(pageAutoRecomOuverture.spinner);
            });

            test('Button [REGIONALISER] - Click', async () => {
                await fonction.clickAndWait(pageAutoRecomOuverture.buttonRegionaliser, page);
            });

            test('** Wait Until Spinner Off 3 **', async () => {
                await fonction.waitForSpinner(pageAutoRecomOuverture.spinner);
            });

            var sNomPopin: string = 'Régionalisation des articles du groupe ' + sGroupeArticle;
            test.describe('Poppin [' + sNomPopin + ']', async () => {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test('** TRAITEMENT  **', async () => {
                    await regionaliserArticles(); // Appel de la fonction de régionalisation : on regionalise les articles de la liste
                })

                test('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pageAutoRecomOuverture.pButtonEnregistrerRegionalisat, page);
                });

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                });
            });

        });

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

            test('** TRAITEMENT **', async () => {
                test.setTimeout(20000);                //-- le traitement peut prendre du temps    
                await verifierArticlesRegionalises(); // Appel de la fonction de vérification: on verifie les articles régionalisés
            });

            test('Tr [ARTICLE][FIRST] - Click', async () => {
                await fonction.clickElement(pageAutoAchatCentrale.trLignesArticles.first());
            });
        })
    })

    // Déconnexion
    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
})
