/**
 * 
 * @author ABDOUL SARBA
 *  Since 2025-05-26
 */

const xRefTest      = "MAG_AUT_MLR";
const xDescription  = "Modifier la régionalisation";
const xIdTest       =  9413;
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

import { test, type Page }             from '@playwright/test';
   
import { TestFunctions }               from "@helpers/functions";
import { Log }                         from "@helpers/log";
import { Help }                        from '@helpers/helpers';
   
import { MenuMagasin }                 from '@pom/MAG/menu.page';
import { CartoucheInfo }               from '@commun/types';
import { AutorisationsRecomOuverture } from '@pom/MAG/autorisations-recommandations_ouverture.page';


//----------------------------------------------------------------------------------------
let page                               : Page;

let menu                               : MenuMagasin;
let pageAutoRecomOuverture             : AutorisationsRecomOuverture;

const log                              = new Log();
const fonction                         = new TestFunctions(log);
//-----------------------------------------------------------------------------------------
var sGroupeArticle                     = fonction.getInitParam('groupeArticle', fonction.getLocalConfig('groupeArticleRegionalise')); 
var aListeArticles                     = fonction.getInitParam('listeArticles',fonction.getLocalConfig('articleRegionalise')); // Liste d'articles à regionaliser

// Je déclare cet objet je veux boucler dessus pour la vérification de la régionalisation
let oArticlesParRegion= {}; // Si l'objet n'existe pas, on initialise un objet vide

/**
 * Modifie la régionalisation des articles de la liste d'articles.
 * 1. Récupère la sélection actuelle.
 * 2. Ouvre la liste déroulante si nécessaire.
 * 3. Récupère toutes les régions disponibles.
 * 4. Décoche tous les articles de la liste d'article dans toutes les régions.
 * 5. Coche les articles dans leur région ciblée.
 * 
 */
var modifierRegionalisation = async () => {
    await fonction.waitForDomStable(page);
    // Je récupére la sélection actuelle
    let sCurrentSelection:string = await pageAutoRecomOuverture.pListBoxTypeRegionalisation.innerText();
    
    // J'ouvrir la liste déroulante si nécessaire
    if (sCurrentSelection !== "régions Prosol") {
        await fonction.clickElement(pageAutoRecomOuverture.pListBoxTypeRegionalisation);
    }
    
    // Je recupere toutes les régions disponibles
    const iNbRegions: number        = await pageAutoRecomOuverture.pListBoxTypeRegionalisationItem.count();
    const aRegions  : string[]      = [];
    
    for (let i = 0; i < iNbRegions; i++) {
        const rRegionName = await pageAutoRecomOuverture.pListBoxTypeRegionalisationItem.nth(i).innerText();
        aRegions.push(rRegionName);
    }
    
    log.set(`${iNbRegions} régions disponibles: ${aRegions.join(', ')}`);

    oArticlesParRegion = {}; // Réinitialiser l'objet

    //J'appelle ma fonction qui va decocher tous les articles de la liste d'article dans toutes les régions
    for (const article of aListeArticles) {
        await decocherArticleDansToutesLesRegions(article, aRegions);
    }

   //J'appelle ma fonction qui va cocher les articles dans leur region ciblé 
    for (let articleIndex = 0; articleIndex < aListeArticles.length; articleIndex++) {
        const article     = aListeArticles[articleIndex];
        await cocherArticleDansRegionCible(article, articleIndex, aRegions);
    }
};

// Fonction je vais utiliser pour cocher ou décocher les checkboxes
const gererCheckboxesPourRegion = async (action: 'decocher' | 'cocher') => {
    const iNbLignesActives  :number = await pageAutoRecomOuverture.pDataGridTrRegionalisation.count();
    let iCheckboxesModifiees:number = 0;
    
    for (let i = 0; i < iNbLignesActives; i++) {
        const ligneActive                   = pageAutoRecomOuverture.pDataGridTrRegionalisation.nth(i);
        const iNbCheckboxesDansLigne:number = await ligneActive.locator('td p-checkbox').count();
        
        for (let j = 0; j < iNbCheckboxesDansLigne; j++) {
            const checkbox = ligneActive.locator('td p-checkbox').nth(j);
            
            try {
                const isVisible: boolean = await checkbox.isVisible();
                if (isVisible) {
                    await checkbox.waitFor({ state: 'visible', timeout: 2000 });
                    const isChecked: boolean = await checkbox.locator('input').isChecked().catch(() => false);
                    
                    if (action === 'decocher' && isChecked) {
                        await fonction.clickElement(checkbox, page);
                        iCheckboxesModifiees++;
                    } else if (action === 'cocher' && !isChecked) {
                        await fonction.clickElement(checkbox, page);
                        iCheckboxesModifiees++;
                    }
                }
            } catch (error) {
                log.set(`Erreur lors du ${action} de checkbox ${j} de la ligne ${i}: ${error.message}`);
            }
        }
    }
    return iCheckboxesModifiees;
};

//Fonction pour changer de région
const changerRegion = async (sRegionCible: string) => {
    const sCurrentRegionSelection:string = await pageAutoRecomOuverture.pListBoxTypeRegionalisation.innerText();

    if (sCurrentRegionSelection !== sRegionCible) {
        try {
            await fonction.clickElement(pageAutoRecomOuverture.pListBoxTypeRegionalisation);
            await fonction.clickElement(pageAutoRecomOuverture.pListBoxTypeRegionalisationItem.filter({hasText: sRegionCible}).first());
            await fonction.clickElement(pageAutoRecomOuverture.pChevronIconRegionalisation);
            return true;
        } catch (error) {
            log.set(`Erreur lors du changement vers la région ${sRegionCible}: ${error.message}`);
            return false;
        }
    } else {
        // Si je suis  déjà sur la bonne région, je  clic sur le chevron pour déplier
        await fonction.waitForDomStable(page);
        await fonction.clickAndWait(pageAutoRecomOuverture.pChevronIconRegionalisation,page,120000);
        return true;
    }
};

//Fonction pour rechercher et décocher un article dans toutes les régions, en fonction de la liste d'article je parcours jusqu'a tout decocher dans toutes les régions
const decocherArticleDansToutesLesRegions = async (sArticle: string, aRegions: string[]) => {    
    for (const sRegion of aRegions) {
        const bRegionChangee:boolean = await changerRegion(sRegion);
        if (!bRegionChangee) continue;
        
        try {
            await fonction.sendKeys(pageAutoRecomOuverture.pDataGridInputCodeRegionalisa, sArticle, false, 'Code Article');
            await fonction.waitForDomStable(page);
            
            const iNbDecochees:number = await gererCheckboxesPourRegion('decocher');
            if (iNbDecochees > 0) {
                log.set(`L'article ${sArticle} est de base regionalisé sur  ${sRegion}`);
            }
        } catch (error) {
            log.set(`  - Erreur lors du décochage de ${sArticle} en région ${sRegion}: ${error.message}`);
        }
    } //end for
};

//Fonction pour déterminer la région cible selon l'index inversé
const obtenirRegionCible = (iArticleIndex: number, aRegions:string[]): number => {
    switch(iArticleIndex) {
        case 0: // Premier article -> Nouvelles régions (index 2)
            return 2;
        case 1: // Deuxième article -> Secteurs Prosol (index 0)  //** NB: Ordre de parcours tel qu'indiquer dans le cas de test   */
            return 0;
        case 2: // Troisième article -> Régions Prosol (index 1)
            return 1;
        default: 
            // Pour tout autre article, utilisation de l'index par défaut
            return iArticleIndex % aRegions.length;
    }
};

//Fonction je vais utiliser pour cocher un article dans sa région cible
const cocherArticleDansRegionCible = async (sArticle: string, iArticleIndex: number, aRegions:string[]) => {
    const iRegionCibleIndex:number         = obtenirRegionCible(iArticleIndex, aRegions);
    const sRegionCible    :string     = aRegions[iRegionCibleIndex];      
    
    const bRegionChangee:boolean    = await changerRegion(sRegionCible);
    if (bRegionChangee) {
        try {
            await fonction.sendKeys(pageAutoRecomOuverture.pDataGridInputCodeRegionalisa, sArticle, false, 'Code Article');
            await fonction.waitForDomStable(page);
            
            await gererCheckboxesPourRegion('cocher');
            log.set(` L'article ${sArticle}  est maintenant regionalisé sur  ${sRegionCible}`);
            
            //Enregistrer l'article dans sa nouvelle région
            if (!oArticlesParRegion[sRegionCible]) {
                oArticlesParRegion[sRegionCible] = [];
            }
            oArticlesParRegion[sRegionCible].push(sArticle);
            
        } catch (error) {
            log.set(`  - Erreur lors du cochage de ${sArticle} en région ${sRegionCible}: ${error.message}`);
        }
    }
};

//-----------------------------------------------------------------------------------------
test.beforeAll(async ({ browser }, testInfo) => {
    page                   = await browser.newPage(); 
    menu                   = new MenuMagasin(page, fonction);
    pageAutoRecomOuverture = new AutorisationsRecomOuverture(page);

    const helper           = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})
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

            var sNomOnglet:string = 'recomOuverture';

            test('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, sNomOnglet, page);
            });

            test('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
               await fonction.clickElement(pageAutoRecomOuverture.listBoxGroupeArticle)
               await fonction.clickElement(pageAutoRecomOuverture.listBoxChoixGroupeArticle.filter( {hasText:sGroupeArticle}).first());
            });

            //Je boucle sur la liste d'article pour vérifier si les articles sont cochés
            aListeArticles.forEach(async (article: any) => {
                test('Input [ARTICLE][' + article + ']', async () => {
                    await fonction.sendKeys(pageAutoRecomOuverture.dataGridListeRecomInputCode, article, false, 'Code Article');
                    await fonction.waitForDomStable(page); //Attente pour eviter les conflits de clics
                });

                test('CheckBox [ARTICLE][' + article + '] - Is Checked', async () => {
                    await pageAutoRecomOuverture.dataGridTdcheckboxRegionaliser.locator('input').isChecked();
                });
            }); //-- Fin forEach

            test('** Wait Until Spinner Off 1 **', async () => { 
                await fonction.waitForSpinner(pageAutoRecomOuverture.spinner);
            });

            test('Button [REGIONALISER] - click', async () => {
                await fonction.clickAndWait(pageAutoRecomOuverture.buttonRegionaliser, page);
            });

            test('** Wait Until Spinner Off 2 **', async () => { 
                await fonction.waitForSpinner(pageAutoRecomOuverture.spinner);
            });

            test('** TRAITEMENT  **', async () => {
                test.setTimeout(120000);         // Augmentation du timeout pour permettre le traitement de la régionalisation
                await modifierRegionalisation(); // Appel de la fonction de régionalisation : on regionalise les articles de la liste
            });

            test('Button [ENREGISTRER] - Click', async () => { 
                await fonction.clickAndWait(pageAutoRecomOuverture.pButtonEnregistrerRegionalisat, page);
            });

        });
    });

    // Déconnexion
    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
});