/**
 * 
 * @author Vazoumana DIARRASSOUBA
 * @since 2024-11-07
 * 
 */
const xRefTest      = "ACH_FOU_REF";      
const xDescription  = "Définir les références articles fournisseur";
const xIdTest       =  251;
const xVersion      = "3.2";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon', 'fournisseur', 'groupeArticle', 'listeArticles'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { expect, test, type Page}       from '@playwright/test';

import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';

import { MenuAchats }                   from '@pom/ACH/menu.page';
import { PageRefFou }                   from '@pom/ACH/referentiel_fournisseurs.page';
import { PageRefArt }                   from '@pom/ACH/referentiel_articles.page';

import { AutoComplete, CartoucheInfo}   from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
 
var pageReferentielFour : PageRefFou;
var pageReferentielArt  : PageRefArt;
var menu                : MenuAchats;

const log               = new Log;
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

const sJddFile             = fonction.getLocalConfig('jddFournisseurFG');
const oData                = fonction.readFile(sJddFile);

const sRayon               = fonction.getInitParam('rayon', 'Frais Généraux');
const sGroupeArticle       = fonction.getInitParam('groupeArticle', '-- Tous --');
const sListeArticle        = fonction.getInitParam('listeArticles', 'F01Y,F02D,F02G');

var sNomFournisseur        = fonction.getInitParam('fournisseur', oData.FOURNISSEUR.NOM + '-' + fonction.getToday('US'));

var dateTest               = fonction.getToday('us');

var aListeArticle          = sListeArticle.split(',');

sNomFournisseur            = sNomFournisseur.charAt(0).toUpperCase() + sNomFournisseur.slice(1).toLowerCase();

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuAchats(page, fonction);    
    pageReferentielFour = new PageRefFou(page);
    pageReferentielArt  = new PageRefArt(page);
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
    })

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

        var aDonneesArticleInit   = [];
        var aReferenceArtFourInit = [];

        test("Menu [REFERENTIEL] - Click ", async () => {
           await menu.click(pageName, page);
        })

        test.describe('Onglet [FOURNISSEURS]', async () => {

            test ('Onglet [FOURNISSEURS] - Click', async () => {
                await menu.clickOnglet(pageName, 'fournisseurs',page);
                log.set(' *********   Onglet FOURNISSEURS  *************** \n');
            })   

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page); // Par défaut, aucune erreur remontée au chargement de l'onglet
            })

            test('InputField [FILTRE FOURNISSEUR] = "' + sNomFournisseur + '"', async () =>  {
                await fonction.sendKeys(pageReferentielFour.inputFiltreArticle, sNomFournisseur );
                await fonction.wait(page, 500);     // On attend que la liste se rafraîchisse
            })

            test ('CheckBox [FOURNISSEUR] - Select', async () => {
                await fonction.clickElement(pageReferentielFour.tdDesignationFournisseur.filter({ hasText: sNomFournisseur}));
            })

            const sNomPopin = 'Référentiel articles du fournisseur ' + sNomFournisseur;
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test('Button [REFERENCE ARTICLE] - Click', async () => {
                    await fonction.clickAndWait(pageReferentielFour.buttonReferenceArticle, page);
                })

                // On fera une boucle qui permettra d'ajouter des references fournisseur aux différents articles.
                aListeArticle.forEach(async (sCodeArticle:string, index:number) => {

                    test ('InputField [CODE OU DESIGNATION ARTICLE] = "' + sCodeArticle + '"', async ()=> {
                        var oData:AutoComplete = {
                            libelle         :'CODE OU DESIGNATION ARTICLE',
                            inputLocator    : pageReferentielFour.pPrefArtInputDesignation,
                            inputValue      : sCodeArticle,
                            choiceSelector  :'ngb-typeahead-window button.dropdown-item',
                            choicePosition  : 0,
                            typingDelay     : 100,
                            waitBefore      : 750,
                            page            : page,
                        };
                        await fonction.autoComplete(oData);
                        var sDonneesArticleInit = await pageReferentielFour.pPrefArtInputDesignation.inputValue();
                        aDonneesArticleInit.push(sDonneesArticleInit);
                    })

                    // La reference sera de la sorte: date du jour - code article =  240711 - F02D . Comme ça on est sûr de ne jamais avoir des références articles identiques
                    // Même si on devait lancer le TA plusieurs fois avec différentes sériee d'articles.
                    var sReferenceFournisseur = dateTest + ' - ' + sCodeArticle;
                    test('InputField [REFERENCE] = "' + sReferenceFournisseur + '"', async () => { 
                        await fonction.sendKeys(pageReferentielFour.pPrefArtInputReference, sReferenceFournisseur);
                        log.set('Réference fournisseur article : ' + sReferenceFournisseur);
                        aReferenceArtFourInit.push(sReferenceFournisseur);
                        if(aListeArticle.length > 1){ // Lorsqu'on aura plus d'une référence article ajoutée, on va mettre un séparateur dans les logs pour mieux les distinguer.

                            log.separateur();
                        }
                    })

                    test('Button [+][' + index + '] - Click', async () => {
                        await fonction.clickAndWait(pageReferentielFour.pPrefArtButtonPlus, page);
                    })
                })

                test('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pageReferentielFour.pPrefArtButtonAnregistrer, page);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })
            })
        }) 
        
        test.describe('Onglet [ARTICLES]', async () => {

            test('Onglet [ARTICLES] - Click', async () =>{
                await menu.clickOnglet(pageName, 'articles',page);
                log.set(' \n *********   Onglet ARTICLES  *************** \n');
            })

            test('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
                await pageReferentielArt.listBoxGroupeArticle.selectOption({label: sGroupeArticle});
            })

            test.describe('Recherche par Article (s)', async () => {

                test('Info [RECHERCHE PAR ARTICLE] - Display', async () => {
                    log.set('             RECHERCHE PAR ARTICLE            \n');
                })

                // Cette boucle permettra de verifier les résultats pour chaque artilce.
                aListeArticle.forEach(async (sCodeArticle:string, index:number) => {

                    test('InputField [ARTICLE] = "' + sCodeArticle + '"', async () => {
                        var oData:AutoComplete = {
                            libelle         :'Filtre article',
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
                        await fonction.wait(page, 1000);
                    })
    
                    if(index === 0){ //-- Trier les fournisseurs par ordre décroissant et cela se fait une seule fois.
    
                        test('Th [FOURNISSEUR (S)] - Click', async () => {
                            await fonction.clickElement(pageReferentielArt.thDgFournisseurs);
                        })
                    }
    
                    test('Tr [ARTICLE][' + sCodeArticle + '] - Check', async () => {
                        // On verifie la désignation article
                        var sDonneesInit     = aDonneesArticleInit[index];                                  // Données contenant le code et la désignation article
                        var aDonneesInit     = sDonneesInit.split('-');                                     // Tableau séparateur du code et la désignation à partir du tiret.
                        var sDesignationInit = aDonneesInit[1].trim();                                      // Récupération de la désignation
                        var sDesignArt       = await pageReferentielArt.tdDgDesignationsArticles.last().textContent(); // Cette valeur est la désignation qui se trouve sur la ligne article actuelle.
                        expect(sDesignArt.toLowerCase()).toBe(sDesignationInit.toLowerCase());   // Comparaison des deux désignations en tenant compte de la casse.
                        log.set('Désignation article recherchée : ' + sDesignArt);
    
                        // On verifie si le fournisseur cible a un lien avec cet article.
                        var sFourns = await pageReferentielArt.tdDgFournisseur.last().textContent(); 
                        expect(sFourns).toContain(sNomFournisseur); // On verifie que les données dans la colonne Fournisseur pour cette ligne contiennent la valeur du fournisseur cible.
                        log.set('Fournisseur recherché : ' + sNomFournisseur);
    
                        // On verifie la référence article fournisseur si elle correspond à celle qui a été ajoutée 
                        var sReferenceArtFourInit = aReferenceArtFourInit[index]; 
                        var sRefArtFour           = await pageReferentielArt.tdDgRefArticleFournisseur.last().textContent();
                        sRefArtFour               = sRefArtFour.trim();
                        expect(sRefArtFour).toBe(sReferenceArtFourInit);
                        log.set('Référence article fournisseur recherchée : ' + sRefArtFour);

                        if(aListeArticle.length > 1){ // Lorsqu'on aura plus d'une référence article ajoutée, on va mettre un séparteur dans les logs pour mieux les distinguer.
    
                            log.separateur();
                        }
                    })
                })

                // Il faut faire un dernier nettoyage du champ qui filtre sur les articles avant de passer sur le filtre du fournisseur 
                test('InputField [ARTICLE] - Clear', async () => {
                    await pageReferentielArt.autoCompleteArts.clear();
                })
            })

            test.describe('Recherche par Fournisseur (s)', async () => {

                test('Info [RECHERCHE PAR FOURNISSEUR] - Display', async () => {
                    log.set('             RECHERCHE PAR FOURNISSEUR            \n');
                })

                test('InputField [FOURNISSEUR] = "' + sNomFournisseur + '"', async () => {
                    var oData:AutoComplete = {
                        libelle         :'Filtre Fournisseur',
                        inputLocator    : pageReferentielArt.autoCompleteFournisseur,
                        inputValue      : sNomFournisseur,
                        choiceSelector  :'.gfit-autocomplete-results li',
                        choicePosition  : 0,
                        typingDelay     : 100,
                        waitBefore      : 750,
                        page            : page,
                        clear           : true
                    };
                    await fonction.autoComplete(oData);
                    await fonction.wait(page, 1000);
                })

                test('Button [RECHERCHER] - Click', async () => {
                    await fonction.clickAndWait(pageReferentielArt.buttonRechercher, page);
                })

                test('Th [CODE ARTICLE] - Click', async () => {
                    // Filtrer les article par ordre croissant de sorte à facilement les répérer parmi tant d'autres
                    await fonction.clickElement(pageReferentielArt.thDgCodesArticle);
                })
 
                // On va Checker le N premières lignes qui correspondent aux N articles dont les références ont été récemment définies
                aListeArticle.forEach(async(sCodeArtilce:string, index:number) => {

                    test('Tr [' + sCodeArtilce + '][' + sNomFournisseur + '] - Check', async () => {
                        log.set('\n Lien ' + sCodeArtilce + ' - ' + sNomFournisseur + ' - Check');

                        // On verifie la désignation article
                        var sDonneesInit     = aDonneesArticleInit[index];                                  // Données contenant le code et la désignation article
                        var aDonneesInit     = sDonneesInit.split('-');                                     // Tableau séparateur du code et la désignation à partir du tiret.
                        var sDesignationInit = aDonneesInit[1].trim();                                      // Récupération de la désignation
                        var sDesignArt       = await pageReferentielArt.tdDgDesignationsArticles.nth(index).textContent(); // Cette valeur est la désignation qui se trouve sur la ligne article actuelle.
                        expect(sDesignArt.toLowerCase()).toBe(sDesignationInit.toLowerCase());   // Comparaison des deux désignations en tenant compte de la casse.
                        log.set('Désignation article recherchée : ' + sDesignArt);
    
                        // On verifie si le fournisseur cible a un lien avec cet article.
                        var sFourns = await pageReferentielArt.tdDgFournisseur.nth(index).textContent(); 
                        expect(sFourns).toContain(sNomFournisseur); // On verifie que les données dans la colonne Fournisseur pour cette ligne contiennent la valeur du fournisseur cible.
                        log.set('Fournisseur recherché : ' + sNomFournisseur);
    
                        // On verifie la référence article fournisseur si elle correspond à celle qui a été ajoutée 
                        var sReferenceArtFourInit = aReferenceArtFourInit[index]; 
                        var sRefArtFour           = await pageReferentielArt.tdDgRefArticleFournisseur.nth(index).textContent();
                        sRefArtFour               = sRefArtFour.trim();
                        expect(sRefArtFour).toBe(sReferenceArtFourInit);
                        log.set('Référence article fournisseur recherchée : ' + sRefArtFour);
                        if((aListeArticle.length > 1)  && (index != aListeArticle.length - 1)){ // Lorsqu'on aura plus d'une référence article ajoutée, on va mettre un séparteur dans les logs pour mieux les distinguer.
    
                            log.separateur();
                        }
                    })
                })
            })
        })
    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})
