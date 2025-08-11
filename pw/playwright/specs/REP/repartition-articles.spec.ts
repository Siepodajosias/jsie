/**
 * 
 * @author Vazoumana DIARRASSOUBA
 * @since 2024-03-21
 * 
 */
const xRefTest     = "REP_REC_LIV";
const xDescription = "Répartition d'un article";
const xIdTest      = 5631;
const xVersion     = '3.4';

var info = {
    desc    : xDescription,
    appli   : 'REPARTITION',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : [],
    params  : ['plateformeReception', 'rayon', 'numlot', 'E2E'],
    fileName: __filename
};

//------------------------------------------------------------------------------------

import { expect, test, type Page } from '@playwright/test';

import { TestFunctions }           from '@helpers/functions';
import { Help }                    from '@helpers/helpers';
import { Log }                     from '@helpers/log';

import { MenuRepartition }         from '@pom/REP/menu.page';
import { ArticlesArticlesPage }    from '@pom/REP/articles-articles.page';

//------------------------------------------------------------------------------------
let page                    : Page;
let menu                    : MenuRepartition;
let pageArticlesArticles    : ArticlesArticlesPage;
//------------------------------------------------------------------------------------
const log                   = new Log();
const fonction              = new TestFunctions(log);
//------------------------------------------------------------------------------------
var oData: any              = fonction.importJdd(); //Import du JDD pour le bout en bout
//------------------------------------------------------------------------------------
const sPlateforme           = fonction.getInitParam('plateformeReception', 'Chaponnay');
const sRayon                = fonction.getInitParam('rayon', 'Fruits et légumes');
var sCodeArticle            = fonction.getInitParam('codeArticle','');

const iNbRepartition:number = 3;

if (oData !== undefined) {                                  // On est dans le cadre d'un E2E. Récupération des données temporaires
    var aCodesArticle = Object.keys(oData.aLots);
    var aLotsE2E      = Object.values(oData.aLots);
    var sNumAchatE2E  = oData.sNumAchatLong;
    oData.aNomMagasin = {};
    log.set('E2E - Liste des articles : ' + aCodesArticle);
}
var repartArticle = async (iCpt: number) => {
    log.set('Répartition article : ' + aCodesArticle[iCpt]);
    await fonction.sendKeys(pageArticlesArticles.inputFieldCodeArticle, aCodesArticle[iCpt], false, 'Article'); // Je saisie  l'article  
    await fonction.waitForDomStable(page); // délai pour laisser le temps à la ligne d'apparaitre

    const iResultCount:number = await pageArticlesArticles.listResults.count();  // Je verifie que des lignes d'articles sont disponibles
    if (iResultCount === 0) {
        throw new Error(`Aucun résultat trouvé pour l'article ${aCodesArticle[iCpt]}`);
    }

    await fonction.clickElement(pageArticlesArticles.listResults.first());
    await fonction.clickAndWait(pageArticlesArticles.buttonRepartir, page);

    var iNbLots:number = await pageArticlesArticles.dataGridNumeroLot.count();// Je rechrche  et je sélectionne le lot
    log.set(`Nombre de lots disponibles : ${iNbLots}`);

    let iIndexLot:number  = 0;
    let bLotTrouve:boolean = false;

    while (iIndexLot < iNbLots) {
        var sText:string = await pageArticlesArticles.dataGridNumeroLot.nth(iIndexLot).textContent();
        log.set(`Lot ${iIndexLot}: ${sText} (recherché: ${aLotsE2E[iCpt]})`);

        if (sText === aLotsE2E[iCpt]) {
            await fonction.clickElement(pageArticlesArticles.dataGridNumeroLot.nth(iIndexLot));
            bLotTrouve = true;
            break;
        }
        iIndexLot++;
    }

    if (!bLotTrouve) {
        throw new Error(`Lot ${aLotsE2E[iCpt]} non trouvé pour l'article ${aCodesArticle[iCpt]}`);
    }

    await fonction.waitForDomStable(page);

    
    const iNbMagasinsAffiches:number = await pageArticlesArticles.datagridRepartTdMagasin.count(); // Je vérifie qu'il y a  des magasins 

    if (iNbMagasinsAffiches === 0) {                                                     /** Dans le cadre de l'E2E , j'ai toujours besoin d'avoir des magasins sur quoi repartir , a cet effet je decoche le checkbox pour lister les autres magasins */
        const checkboxAfficherMagasins = pageArticlesArticles.datagridCheckBoxMagasin; // j'affiche les magasin qui ont commandé
        const isChecked = await checkboxAfficherMagasins.isChecked();

        if (isChecked) {
            await fonction.clickElement(checkboxAfficherMagasins);
            await fonction.waitForDomStable(page);                                         // Attendre que la liste se mette à jour
        }
    }

    await fonction.sendKeys(pageArticlesArticles.inputFieldColisMagasin, iNbRepartition, false, 'Quantité à répartir');
    await fonction.clickAndWait(pageArticlesArticles.buttonRepartirUneFois, page);
    const sNomMagasin: string = await pageArticlesArticles.datagridRepartTdMagasin.textContent(); /** Processus normale de repartion s'il ya deja des magasin*/
    oData.aNomMagasin[aCodesArticle[iCpt]] = sNomMagasin;

    log.set('Article ' + aCodesArticle[iCpt] + ' repartit');
    await fonction.clickAndWait(pageArticlesArticles.buttonSauverEtValider, page);
    await fonction.clickElement(pageArticlesArticles.buttonTerminer);             //** J'utilise clickElement au lieu de clickAndWait, car problème de timeOut avec le htmlRendered (le temps est trop court) contenu dans le clickAndWait */

    const bIsVisible:boolean = await pageArticlesArticles.pPalerteButtonOui.isVisible();
    if(bIsVisible){
        await fonction.clickElement(pageArticlesArticles.pPalerteButtonOui);    // Si le button "oui" pour valider l'alerte est visible , je clique la dessus
    }

    await fonction.waitForDomStable(page);                                 // j'attends que la page soit prête pour le prochain article
}
 //------------------------------------------------------------------------------------
 
 test.beforeAll(async ({ browser }, testInfo) => {
    page                    = await browser.newPage();
    menu                    = new MenuRepartition(page, fonction);
    pageArticlesArticles    = new ArticlesArticlesPage(page);
    const helper            = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']' , () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe ('Page [ARTICLES]',async () => { 

        var sNomPage = 'articles';
        test ('Page [ARTICLES] - Click', async () => {
            await menu.click(sNomPage, page);
        }); 

        test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {            
            await menu.selectPlateforme(sPlateforme, page);                     // Sélection d'une plateforme par défaut
            log.set('Plateforme : ' + sPlateforme);
            log.set('Nombre de lot à agréer : ' + aLotsE2E.length);
        });

        test ('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menu.selectRayon(sRayon, page);               // Sélection du rayon
            log.set('Rayon : ' + sRayon);
        })

        if(sNumAchatE2E != undefined){

            if (oData !== undefined) {    
                
                aCodesArticle.forEach((sCodeArticle:string, index:number) => {
                    
                    test ('Répartition [CODE ARTICLE] = ' + sCodeArticle, async () => {     // cas des E2E
                        await repartArticle(index);
                    })
                    
                })

            } else {
        
                if (sCodeArticle != undefined) {              // On effectue une recherche sur la base d'un code article précis
        
                    test ('InputField [CODE ARTICLE] = "' + sCodeArticle + '"', async () => {
                        await fonction.sendKeys(pageArticlesArticles.inputFieldCodeArticle, sCodeArticle, false, 'Code article');
                        await fonction.waitForDomStable(page);
                    })
                } else {                                                    //On exploite le premier article "répartitionnable"...
        
                    test ('Header [QUANTITE A AGREE] - Click x2', async () => {
                        await fonction.clickElement(pageArticlesArticles.headerQteAgree);      // Pour cela on fait un filtre sur la colonne "Nb lots à répartir"
                        await fonction.waitForDomStable(page);
                        await fonction.clickElement(pageArticlesArticles.headerQteAgree);      // Deux fois...
                    })
                }
            
                test ('CheckBox [ARTICLES][first] - Click', async  () => {
                    await fonction.clickElement(pageArticlesArticles.listResults.first());           
                })
            
                test ('Button [REPARTIR ARTICLE] - Click', async () => {
                    await fonction.clickAndWait(pageArticlesArticles.buttonRepartir, page);            
                })
        
                test.describe ('Page [REPARTITION] - Click', async () => {        
        
                    test ('CheckBox [LOTS A REPARTIR] - First', async  () => {                  // Sélection du 1er lot
                        await fonction.clickElement(pageArticlesArticles.dataGridNumeroLot.first());
                    })
        
                    test ('ListBox [TYPE MAGASIN] = "Afficher tous les magasins" - Click', async () => {  // Afficher meme les magasins sans commande (gestion du cas où on a pas de commande)
                        await fonction.clickElement(pageArticlesArticles.linkTousMagasins);               
                    })
        
                    test ('Filtre [ENTONNOIR] = "Afficher les magasins standards" - Click', async () => {  // Sélection des magasins standards pour éviter le cas des hotels prioritaires
                        await fonction.clickElement(pageArticlesArticles.buttonFilterMagasin);
                        await fonction.clickElement(pageArticlesArticles.linkMagStandards);
                    })
                    
                    test ('Input [QTE A REPARTIR] = 1 ', async () => {
                        await fonction.sendKeys(pageArticlesArticles.inputFieldColisMagasin, 1, false, 'Quantité à Répartir');        
                    })
        
                    test ('Button [REPARTIR] - Click', async () => {
                        await fonction.clickElement(pageArticlesArticles.buttonRepartirUneFois);               
                    })
        
                    test ('Button [SAUVEGARDER] - Click', async () => {
                        await fonction.clickElement(pageArticlesArticles.buttonSauvegarder);
                    })
        
                    test ('Label [REPARTITION  SAUVEGARDEE A] - Is Visible', async () => {
                        expect(await pageArticlesArticles.labelSauvegarde.textContent()).toContain('Répartition sauvegardée à');
                    })
                        
                    test ('Button [VALIDER LOT(S)] - Click', async () => {
                        await fonction.clickAndWait(pageArticlesArticles.buttonValider, page);               
                    })
        
                    test.describe ('Popin [CONFIRMATION VALIDATION]', async () => {
        
                        test ('Popin [CONFIRMATION VALIDATION] - Is Visible', async () => {
                            await fonction.popinVisible(page, 'CONFIRMATION VALIDATION', true);
                        })
                        
                        test ('Label [ERREUR] -Is Not Visible', async () => {
                            await fonction.isErrorDisplayed(false, page);                            // Pas d'erreur affichée à priori au chargement de la popin
                        })
        
                        test ('Popin Button [VALIDER] - Click', async () => {
                            await fonction.clickAndWait(pageArticlesArticles.buttonPopinValider, page);
                        })
        
                        test ('Popin [CONFIRMATION VALIDATION] - Is Not Visible', async () => {
                            await fonction.popinVisible(page, 'CONFIRMATION VALIDATION', false);
                        })
                    })  // End describe Popin
        
                    test ('Button [TERMINER] - Click', async () => {
                        await fonction.clickAndWait(pageArticlesArticles.buttonTerminer, page);
                    }) 
                    
                    test.describe ('Popin [ALERTES DE REPARTITION]', async () => {
        
                        test ('Button [OUI] - Click Conditionnel', async () => {
                            var isVisible = await pageArticlesArticles.pPalerteButtonOui.isVisible();
                            if(isVisible){        
                                await fonction.clickElement(pageArticlesArticles.pPalerteButtonOui);
                            }
                        }) 
                    })
                  
                })
            }
        }
         await fonction.writeData(oData);
    });

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });   
})