/**
 *
 * @author JOSIAS SIE
 * @since 2023-01-19
 *
 */
const xRefTest      = "MAG_AAC_FLS";    // FDE, ...
const xDescription  = "Association d'Articles à un Assortiment";
const xIdTest       =  108;
const xVersion      = "3.5";
   
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Successeur de [MAG_AUP_ASF]'],
    params      : ['listeArticles','listeMagasins','designationAssortiment','groupeArticle','designationGroupeArticle'],
    fileName    : __filename
};
 
import { test, type Page}               from '@playwright/test';

import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';

import { MenuMagasin }                  from '@pom/MAG/menu.page';
import { AutorisationsAchatsCentrale }  from '@pom/MAG/autorisations-achats_centrale.page';

import { AutoComplete, CartoucheInfo }                from '@commun/types';

//------------------------------------------------------------------------------------
 
let page                : Page;
 
var pageAutoAchCentrale : AutorisationsAchatsCentrale;
var menu                : MenuMagasin;
 
const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuMagasin(page, fonction);    
    pageAutoAchCentrale = new AutorisationsAchatsCentrale(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async({}, testInfo) => {
    await fonction.close(testInfo);
})
 
//------------------------------------------------------------------------------------
 
var maDate:any          = new Date();
const dateJour          = maDate.getFullYear().toString().substr(-2) + fonction.addZero(maDate.getMonth() + 1) + fonction.addZero(maDate.getDate());
 
//------------------------------------------------------------------------------------

fonction.importJdd();

var aListeArticles            = fonction.getInitParam('listeArticles', '5600,5800,6600');
var aListeMagasins:any        = fonction.getInitParam('listeMagasins', 'Bergerac,Bron'); 
var typeAssortiment           = fonction.getInitParam('typeAssortiment', 'Achats centrale');
const groupeArticle           = fonction.getInitParam('groupeArticle', 'Fruits et légumes');
const sDesignGrpAssort        = fonction.getInitParam('nomAssortiment', 'TA_' + typeAssortiment + ' ' + groupeArticle + ' ' + dateJour);    // §§§-1 Ref Inter Scénarios
 
//------------------------------------------------------------------------------------

const iColisMin               = '1';        // Seuil minimal commandable (facteur bloquant pour la validation d'une commande)
const iColisMax               = '888';      // Seuil maximal commandable (facteur bloquant pour la validation d'une commande)
const sComment                = 'TA_ Info à Communiquer - Assortiment : ' + sDesignGrpAssort;

//------------------------------------------------------------------------------------

var oData = {
    aCalibre            : {},
    aConditionnement    : {},
    sBackUp             : process.env.E2E || undefined  // marqueur servant à définir si le json doit être répliqué en tant que référant
};

/**
 * Dans le cadre d'un E2E, on doit conserver une copie des données créer initialement (calibres et conditionnements) afin
 * de pouvoir être retrouvé plus facilement qu'en passant par les fichiers de la veille.
 * L'attribut oData.sBackUp sert à mémoriser le nom du E2E à l'origine de cette création. Cette info est
 * ensuite transmise à fonction.writeData pour duplication du fichier dans le repertoire "_run-once".
 * 
 */

//------------------------------------------------------------------------------------
 
    // La liste des lieux de vente cible peut être :
    //    * Soit celle contenue dans le fichier de conf par défaut de l'application (array)
    //    * Soit celle contenue dans le JDD (array)
    //    * Soit celle passée en argument (string). Ex "ville1 , ville2 , ville3".
    // Dans ce dernier cas, cette chaîne doit être transofmrée en tableau pour pouvoir être traitée.
 
    if (typeof(aListeMagasins) === 'string' ) {
        aListeMagasins = aListeMagasins.split (',');
    }
 
    if (typeof(aListeArticles) === 'string' ) {
        aListeArticles = aListeArticles.split (',');
    }

 //------------------------------------------------------------------------------------
 
test.describe.serial('[' + xRefTest + ']', () => {
 
    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });
 
    test('Connexion', async() => {
        await fonction.connexion(page);
    })
 
    test.describe('Page [AUTORISATIONS]', async () => {
       
        //-- Message d'avertissement (Check Browser) spécifique à l'application SIGALE Magasin
        //-- Click sur le lien de confirmation pour faire disparaître le message d'alerte
        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            var isVisible   = await menu.linkBrowserSecurity.isVisible();
            if (isVisible) {
               var isActive = await menu.linkBrowserSecurity.isEnabled();
               if(isActive){
                   await menu.linkBrowserSecurity.click();
               }
            }
        });
       
        test('Popin [ALERT][ACCUEIL] - Click', async () => {
            await menu.removeArlerteMessage(page);
            await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de l'onglet
        });
 
        var pageName = 'autorisations';
        test ('Page [AUTORISATION] - Click', async () => {
            await menu.click(pageName, page);
        })
 
        test.describe('Onglet [AUTORISATIONS ACHATS CENTRALE]', () => {
 
            test ('Onglet [AUTORISATIONS ACHATS CENTRALE] - Click', async () => {
                await menu.clickOnglet(pageName, 'autorisationAchatCentrale', page);
            })  
 
            test ('Input [ASSORTIMENTS] [' + sDesignGrpAssort + ']', async () => {
                await fonction.sendKeys(pageAutoAchCentrale.inputAssortiment, sDesignGrpAssort, false, 'Assortiment');
            })
 
            test ('CheckBox [ASSORTIMENTS][0] - Click', async () => {
                await fonction.wait(page, 550);
                await fonction.clickAndWait(pageAutoAchCentrale.checkBoxAssortiments.first(), page);
            })
 
            //-- On efface tout avant de lancer le test afin de (re)partir sur une base propre
            test ('CheckBox [TOUT SELECTIONNER] - Click', async () => {
                var iNbArticles:any = await pageAutoAchCentrale.dataGridHeaders.first().textContent();
                if (iNbArticles == 0) {
                    log.set('Pas d\'anciens assortiments à supprimer');
                } else {
                    await fonction.clickElement(pageAutoAchCentrale.checkBoxAllAssortiments);
                }
            })
 
            test ('Button [SUPPRIMER] - click < OPTIONNEL', async () => {
                var isActive = await pageAutoAchCentrale.buttonSupprimerLigne.isEnabled();
                if(isActive){
                    await fonction.clickElement(pageAutoAchCentrale.buttonSupprimerLigne);
                }
            })          
           
            test.describe('Div [MODIFICATION D\'UNE LIGNE DE L\'ASSORTIMENT]', async () => {
                aListeArticles.forEach((sCodeArticle: string) => {
                    var iIndex          = aListeArticles.indexOf(sCodeArticle);
                    test('InputField [AUTOCOMPLETE][CODE][ARTICLE] = "' + sCodeArticle + '"',async () => {
                        var isVisible: boolean  = await pageAutoAchCentrale.inputArticle.isVisible();
                        if(isVisible){
                            var oData:AutoComplete = {
                                libelle         :'ARTICLE',
                                inputLocator    : pageAutoAchCentrale.inputArticle,
                                inputValue      : sCodeArticle,
                                choiceSelector  : 'div.autocomplete-article app-autocomplete button.dropdown-item',
                                choicePosition  : 0,
                                typingDelay     : 150,
                                waitBefore      : 700,
                                page            : page,
                            };
                            
                            await fonction.autoComplete(oData);
                        }
                    })
 
                    test ('Button [PLUS][ARTICLE N° = ' + iIndex + '] - Click', async () => {
                        var isActive = await pageAutoAchCentrale.buttonPlus.isEnabled();
                        if(isActive){
                            await fonction.clickAndWait(pageAutoAchCentrale.buttonPlus, page);
                        }else
                        {
                            log.set('Aucun article à enregistrer');
                        }
                    })
 
                    var sNomPopin = "Modification d\'une ligne de l\'assortiment xxxxx";
                    test.describe('Popin [' + sNomPopin.toUpperCase() + '][Popin N° ' + iIndex + ']', async () => {

                        test('Select [CALIBRE] [CONDITIONNEMENT] [ARTICLE N° = ' + iIndex + ']', async () => {
                            var iNbChoixCalibre = await pageAutoAchCentrale.pPSelectCalibre.locator('option').count();
 
                            var aNomCalibre = await pageAutoAchCentrale.pPSelectCalibre.locator('option').allTextContents();
 
                            for(var iNb = 0; iNb < iNbChoixCalibre; iNb++){
 
                                var sNomCalibre = aNomCalibre[iNb];
 
                                if(sNomCalibre !=''){
                                    oData.aCalibre[sCodeArticle] = sNomCalibre;
                                    await pageAutoAchCentrale.pPSelectCalibre.selectOption({index: iNb});
                                    log.set('Calibres : ' + sNomCalibre);
                                    fonction.addDataSheet('ListBox', 'Calibre', sNomCalibre);

                                    await fonction.wait(page, 1000);
                                    var iNbChoixConditionnement = await pageAutoAchCentrale.pPSelectConditionnement.locator('option').count();
                                    var sNomConditionnement = await pageAutoAchCentrale.pPSelectConditionnement.locator('option').nth(iNbChoixConditionnement - 1).textContent();
                                   
                                    if(sNomConditionnement !=''){

                                        oData.aConditionnement[sCodeArticle] = sNomConditionnement;
                                        await pageAutoAchCentrale.pPSelectConditionnement.selectOption({index: (iNbChoixConditionnement - 1)});
                                        log.set('Conditionnement : ' + sNomConditionnement);
                                        fonction.addDataSheet('ListBox', 'Conditionnement', sNomConditionnement);

                                        break;
                                    }
                                }
                            }
                            log.set('Calibres disponibles : ' + iNbChoixCalibre);
                        })
  
                        test('Input [MIN.][COLIS]['+iColisMin+'][ARTICLE N° = ' + iIndex + ']', async () => {
                            var isVisible = await pageAutoAchCentrale.pPinputEnrMinColis.isVisible();
                            if(isVisible){
                                await fonction.sendKeys(pageAutoAchCentrale.pPinputEnrMinColis, iColisMin, false, 'Nombre Colis Mini');
                                log.set('Nombre Colis Mini : ' + iColisMin);
                            }
                        })
 
                        test('Input [MAX.][COLIS]['+iColisMax+'][ARTICLE N° = ' + iIndex + ']', async () => {
                            var isVisible = await pageAutoAchCentrale.pPinputEnrMaxColis.isVisible();
                            if(isVisible){
                                await fonction.sendKeys(pageAutoAchCentrale.pPinputEnrMaxColis, iColisMax, false, 'Nombre Colis Maxi');
                                log.set('Nombre Colis Maxi : ' + iColisMax);
                            }
                        })
 
                        test('TextArea [COMMENTAIRE][ARTICLE N° = ' + iIndex + ']', async () => {
                            var sCommentaireLocal = sComment + ' Article #' + sCodeArticle;
                            var isActive = await pageAutoAchCentrale.pPtextAreaEnrComment.isEnabled();
                            if(isActive){
                                await fonction.sendKeys(pageAutoAchCentrale.pPtextAreaEnrComment, sCommentaireLocal, false, 'Commentaire');
                                log.set('Commentaire : ' + sCommentaireLocal);
                            }
                        })
 
                        test.describe('Li [MAGASIN][ARTICLE N° = ' + iIndex + ']', () => {
                            test('Input [DESIGNATION][ARTICLE N° = ' + iIndex + ']',async () => {
                                //-- Utilisation des filtres
                                await fonction.clickElement(pageAutoAchCentrale.pPlistBoxDesignation.nth(0));
                            }) 
                            aListeMagasins.forEach(async (magasin:string) => {
                                var iIndexMagasin     = aListeMagasins.indexOf(magasin); 
                                test('P-multiselectitem [DESIGNATION][Magasin N° = ' + iIndexMagasin + ']', async () => {
                                    await fonction.sendKeys(pageAutoAchCentrale.pPinputEnrFilter, magasin, false, 'Magasin');
 
                                    var isVisible     = await pageAutoAchCentrale.pPcheckBoxEnrFilter.first().isVisible();
                                    if(isVisible){
                                        await fonction.clickAndWait(pageAutoAchCentrale.pPcheckBoxEnrFilter.first(), page);
                                    }
                                })  
                            });
 
                            test('P-checkBox [ALL][ARTICLE N° = ' + iIndex + ']', async () => {
                                await pageAutoAchCentrale.pPpictoEnrClose.click();
                                await fonction.clickAndWait(pageAutoAchCentrale.pPcheckBoxEnrAllMag.nth(0), page);
                            })
                        })
                    })
 
                    test('Button [ENREGISTRER][ARTICLE N° = ' + iIndex + '] - Click', async () => {
                        await fonction.clickAndWait(pageAutoAchCentrale.pPbuttonEnregistrer, page);
                        var isVisible     = await pageAutoAchCentrale.pErrorMessage.isVisible();
                        if(isVisible){
                            await fonction.clickElement(pageAutoAchCentrale.pPlinkFermer);
                        }
                    })

                    test('Button[OUI][Alerte Conditonnement][' + sCodeArticle + '] - Click', async () => {
                        var isVisibleAlerteConditionnement = await pageAutoAchCentrale.pPlinkEnregistrerOui.isVisible();
                        if (isVisibleAlerteConditionnement) {
                            log.set('Alerte, différence de conditionnement - Lien OUI cliqué');
                            await fonction.clickAndWait(pageAutoAchCentrale.pPlinkEnregistrerOui, page);
                        }else {
                            log.set('Pas de Message  d\'alerte conditionnement visible');
                            log.separateur();
                            test.skip();
                        }
                    })

                    test('Button[OUI][Alerte Min /Max / Mult][' + sCodeArticle + '] - Click', async () => {
                        var isVisibleAlerteMinMaxMult = await pageAutoAchCentrale.pPlinkMinMaxEnregOui.isVisible();
                        if(isVisibleAlerteMinMaxMult){
                            log.set('Alerte, différence de Min / MAX / Mult - Lien OUI cliqué');
                            await fonction.clickAndWait(pageAutoAchCentrale.pPlinkMinMaxEnregOui, page)
                        }else {
                            log.set('Pas de Message d\'alerte Min / Max / Mult visible');
                            log.separateur();
                            test.skip();
                        }
                    })
                });
                    log.set('Liste des codes articles : ' + aListeArticles);
                    log.set('Liste des magasins : ' + aListeMagasins);
            })
        }); // end describe

        //-- On enregistre les données temporaires
        await fonction.writeData(oData);

    }); //-- End test.describe Page
 
    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

}); // end describe
