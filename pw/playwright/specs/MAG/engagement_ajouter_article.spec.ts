/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 23 - 04 - 2024
 */

const xRefTest      = "MAG_ENG_ADD";
const xDescription  = "Associer un article à un Engagement";
const xIdTest       =  1039;
const xVersion      = '3.9';

var info:CartoucheInfo = {
    desc            : xDescription,
    appli           : 'MAGASIN',
    version         : xVersion,        
    refTest         : [xRefTest],
    idTest          : xIdTest,
    help            : [],
    params          : ['groupeArticle','ville','nom','article'],
    fileName        : __filename
};

//----------------------------------------------------------------------------------------

import { expect, test, type Page}        from '@playwright/test';

import { TestFunctions }                 from '@helpers/functions';
import { Log }                           from '@helpers/log';
import { Help }                          from '@helpers/helpers';

import { MenuMagasin }                   from '@pom/MAG/menu.page';
import { AutorisationsEngagements }      from '@pom/MAG/autorisations-engagements.page';
import { AutorisationsParametrage }      from '@pom/MAG/autorisations-parametrage.page';

import { AutoComplete, CartoucheInfo }   from '@commun/types';

//-------------------------------------------------------------------------------------

let page                                 : Page;

let menu                                 : MenuMagasin;
let pageAutEngag                         : AutorisationsEngagements;
let pageAutParam                         : AutorisationsParametrage;

const log                                = new Log();
const fonction                           = new TestFunctions(log);
const today                              = new Date();
//-----------------------------------------------------------------------------  
fonction.importJdd()                                          // Récupération des données JDD                                    
//----------------------------------------------------------------------------------------
process.env.ROLE                         = 'REPARTITEUR';   // Connexion par défaut avec le profil ayant le Role REPARTITEUR
//----------------------------------------------------------------------------------------
var oData                                ={ article:[] }; // Initialisation de l'objet qui va contenir les données
var sGroupeArticle                       = fonction.getInitParam('groupeArticle',fonction.getLocalConfig('groupeArticleEngagement')); 
var sNomEngagement                       = fonction.getInitParam('nom', fonction.getLocalConfig('assortimentEngagement'));
sNomEngagement                           = sNomEngagement + fonction.getToday('FR');
const sDesignationAssort                 = sNomEngagement + ' (' + sGroupeArticle +')';
const aListeMagasins                     = fonction.getInitParam('ville',   fonction.getLocalConfig('listeVilles'));
var aArticlesCibles                      = fonction.getInitParam('article', fonction.getLocalConfig('articlesCibles'));
//----------------------------------------------------------------------------------------- 
const iHeureDebut  :number               = today.getHours();
const iMinuteDebut :number               = today.getMinutes();
today.setMinutes(iMinuteDebut + 15);
const iHeureFin    :number               = today.getHours();
const iMinuteFin   :number               = today.getMinutes();
const sLettres     :string               = 'clfmwyz1234567890abdeghjkprstuvqxns'; 
const iFeedbackInfo:string               = 'Assortiment en cours de génération ou saisie. En cas de modification des informations de commande, pensez à avertir le magasin et/ou le CS.'
//----------------------------------------------------------------------------------------- 
/**
 * Ajoute un article aléatoire à l'engagement.
 */
const ajouterArticleEngagementAleatoire = async () => {
    const iRndPos      : number = Math.floor(Math.random() * sLettres.length);
    const sRandomLetter: string = sLettres.substring(iRndPos, iRndPos + 1);

    // Auto-complétion pour trouver un article
    const oAutoComplete: AutoComplete = {
        libelle        : 'ARTICLE',
        inputLocator   : pageAutEngag.inputArticle,
        inputValue     : sRandomLetter,
        choiceSelector : 'div.autocomplete-article app-autocomplete button.dropdown-item:last-child',
        choicePosition : 0,
        typingDelay    : 100,
        waitBefore     : 500,
        page           : page,
    };
    const sArticleCode: string = await fonction.autoComplete(oAutoComplete);

    await fonction.clickElement(pageAutEngag.buttonPlus, page);                                                    // J'ouvre la popin d'engagement en cliquant sur le bouton "+"
    const iNbChoixCalibre: number   = await pageAutEngag.pPListBoxCalibre.locator('option').count();              // Je sélectionne le calibre et le conditionnement
    const aNomCalibre    : string[] = await pageAutEngag.pPListBoxCalibre.locator('option').allTextContents();

    for (let iNb = 0; iNb < iNbChoixCalibre; iNb++) {                                                         // Boucle pour les calibres et les conditionnements
        const sNomCalibre = aNomCalibre[iNb];
        if (sNomCalibre !== '') {
            await pageAutEngag.pPListBoxCalibre.selectOption({ index: iNb });
            await fonction.waitTillHTMLRendered(page);
            const iNbChoixConditionnement: number = await pageAutEngag.pPListBoxCond.locator('option').count();
            const iIndexSelectionne      : number = iNbChoixConditionnement - 1;
            const sNomConditionnement    : string = await pageAutEngag.pPListBoxCond.locator('option').nth(iIndexSelectionne).textContent();
            if (sNomConditionnement !== '') {
                await pageAutEngag.pPListBoxCond.selectOption({ index: iIndexSelectionne });
                log.set('Conditionnement : ' + sNomConditionnement);
                break;
            }
        }
    }
    log.set('Calibres disponibles : ' + iNbChoixCalibre);

    await fonction.clickElement(pageAutParam.pPlistBoxDesignation.nth(0));                         //Je sélectionne des magasins
    for (const magasin of aListeMagasins) {
        await fonction.sendKeys(pageAutParam.pPinputEnrFilter, magasin, false, 'Magasin');
        if (await pageAutParam.pPcheckBoxEnrFilter.first().isVisible()) {
            await fonction.clickAndWait(pageAutParam.pPcheckBoxEnrFilter.first(), page, 1200000);
        }
    }
    await fonction.clickElement(pageAutParam.pPpictoEnrClose);                                                // Je ferme l'inupt de recherche de magasin
    await fonction.clickAndWait(pageAutParam.pPcheckBoxEnrAllMag.nth(0), page, 12000000);                    //  Je coche tous les magasins que j'ai recherché
    await fonction.clickAndWait(pageAutParam.pButtonEnregistrer, page, 12000000);                           // Si l'article existe deja dans un autre engagment, j'annule l'enregistrement et je cherche un autre article
    if (await pageAutParam.pPalerteTop.isVisible()) {
        await fonction.clickElement(pageAutParam.buttonParamAnnuler, page);
    } else {
        oData.article.push(sArticleCode.substring(0, 4));
    }                                                                                            // Ajout du code de l'article à la liste des article que je vais utiliser par la suite
    if (await pageAutEngag.pDatagridIncoherence.isVisible()) {                                  // Si la Popupd'incoherence des dates s'affiche alors je clique sur "Confirmer"
        await fonction.clickAndWait(pageAutEngag.pButtonConfirmDataGrid, page, 12000000);
    }
};

//-----------------------------------------------------------------------------------------
test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage(); 
    menu                = new MenuMagasin(page, fonction);
    pageAutEngag        = new AutorisationsEngagements(page);
    pageAutParam        = new AutorisationsParametrage(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})
//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {
    
    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [ACCUEIL]', async () => {
        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);           
            if(await menu.pPopinAlerteSanitaire.isVisible()){
                await menu.removeArlerteMessage(page);
            }else{
                log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                test.skip();
            }
        })
    }) // -- Fin describe

    test.describe('Page [AUTORISATIONS]', async () => {

        var sPageName: string = 'autorisations';

        test('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(sPageName, page);
        })

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })

        test.describe('Onglet [ENGAGEMENTS]', async () => {
            const sNomPopin: string = "Confirmer la suppression";
            
            test('Onglet [ENGAGEMENTS] - Click', async () => {
                await menu.clickOnglet(sPageName, 'engagements', page);
            })

            test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de l'onglet
                await fonction.isErrorDisplayed(false, page);
            })

            test('InputField [ASSORTIMENT] = "' + sNomEngagement + '"', async () => {
                await fonction.sendKeys(pageAutEngag.inputAssortiment, sNomEngagement, false, 'Assortiment');
                await fonction.waitForDomStable(page);
            })

            test('CheckBox [LISTE ASSORTIMENTS][' + sDesignationAssort + '] - Click', async () => {
                var iNbLibelleAssort: number = await pageAutEngag.checkBoxListeAssort.count();
                if (iNbLibelleAssort > 0) {
                    for (let iLibelleAssort = 0; iLibelleAssort < iNbLibelleAssort; iLibelleAssort++) {
                        var sCible: string  = await pageAutEngag.checkBoxListeAssort.nth(iLibelleAssort).textContent();
                        if (sCible.includes(sDesignationAssort)) {
                            await fonction.clickAndWait(pageAutEngag.checkBoxListeAssort.nth(iLibelleAssort), page);
                            break;
                        } else if ((iLibelleAssort == iNbLibelleAssort - 1) && !sCible.includes(sDesignationAssort)) {
                            throw new Error('Aucune correspondance à engagement dans la liste de commande');
                        }
                    }
                } else {
                    throw new Error('AUCUNE COMMANDE EXISTANTE');
                }
            })

            test('** Suppression Conditionnelle **', async () => {

                // Si le test a déjà été lancé, il se peut que l'article soit déjà associé à l'engagement.
                // On supprime donc tous les articles déjà présents
                var sText: string = await pageAutEngag.labelNbArticles.textContent();
                if (!sText.includes('0')) {
                    // Click sur la checkBoxAll s'il existe au moins un article
                    await fonction.clickElement(pageAutEngag.checkBoxAllArticles);
                    await fonction.clickAndWait(pageAutEngag.buttonSupprimerLigne, page);
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
                    await fonction.clickAndWait(pageAutEngag.pPButtonOui, page);

                } else {
                    log.set('Aucun article à supprimer');
                    test.skip();
                }

            })

            test.describe('Association', async () => {

                aArticlesCibles.forEach((sData: string) => {    /** Boucle sur la liste des articles , pour les ajouter dans l'engagement **/
                    test('InputField [ARTICLE] = "' + sData + '"', async () => {
                        var oData: AutoComplete = {
                            libelle       : 'ARTICLE',
                            inputLocator  : pageAutEngag.inputArticle,
                            inputValue    : sData.toString(),
                            choiceSelector: 'div.autocomplete-article app-autocomplete button.dropdown-item:last-child',
                            choicePosition: 0,
                            typingDelay   : 150,
                            waitBefore    : 750,
                            page          : page,
                        };
                        await fonction.autoComplete(oData);
                    })

                    test.describe('Article : ' + sData, async () => {

                        test('Button [ + ] - Click', async () => {
                            await fonction.clickAndWait(pageAutEngag.buttonPlus, page);
                        })

                        var sNomPopin: string = 'ENREGISTREMENT D\'UNE LIGNE DE l\'ASSORTIMENT ' + sNomEngagement;

                        test.describe('Popin : [' + sNomPopin + ']', async () => {

                            test('Popin [' + sNomPopin + '] - Is Visible', async () => {
                                await fonction.popinVisible(page, sNomPopin, true);
                            })

                            test('Select [CALIBRE] + [CONDITIONNEMENT]', async () => {
                                var iNbChoixCalibre: number  = await pageAutEngag.pPListBoxCalibre.locator('option').count();
                                var aNomCalibre    : string[]= await pageAutEngag.pPListBoxCalibre.locator('option').allTextContents();
                                for (var iNb = 0; iNb < iNbChoixCalibre; iNb++) {                                   
                                    if (aNomCalibre[iNb] != '') {
                                        await pageAutEngag.pPListBoxCalibre.selectOption({ index: iNb });
                                        await fonction.waitForDomStable(page);
                                        var iNbChoixConditionnement: number = await pageAutEngag.pPListBoxCond.locator('option').count();
                                        var iIndexSelectionne      : number = iNbChoixConditionnement - 1;
                                        var sNomConditionnement    : string = await pageAutEngag.pPListBoxCond.locator('option').nth((iIndexSelectionne)).textContent();
                                        if (sNomConditionnement != '') {
                                            await pageAutEngag.pPListBoxCond.selectOption({ index: (iIndexSelectionne) });
                                            log.set('Conditionnement : ' + sNomConditionnement);
                                            break;
                                        }
                                    }
                                }
                                log.set('Calibres disponibles : ' + iNbChoixCalibre);
                            });

                            test.describe('Datagrid [MAGASIN]', () => {
                                test('Input [DESIGNATION] - Click', async () => {
                                    await fonction.clickElement(pageAutParam.pPlistBoxDesignation.nth(0));
                                })
                                aListeMagasins.forEach(async (magasin: string) => {                   /**Insertion des magasins */
                                    test('Multiselect [DESIGNATION][MAGASIN] = ' + magasin + '', async () => {
                                        await fonction.sendKeys(pageAutParam.pPinputEnrFilter, magasin, false, 'Magasin');
                                        if (await pageAutParam.pPcheckBoxEnrFilter.first().isVisible()) {
                                            await fonction.clickAndWait(pageAutParam.pPcheckBoxEnrFilter.first(),page);
                                        }
                                    })
                                }) //-- Fin Foreach
                                test('Checkbox [ALL] - Click', async () => {
                                    await fonction.clickElement(pageAutParam.pPpictoEnrClose);
                                    await fonction.clickAndWait(pageAutParam.pPcheckBoxEnrAllMag.nth(0),page);
                                })
                            }) //-- Fin describe

                            test('Button [ENREGISTRER] - Click', async () => {
                                await fonction.clickAndWait(pageAutEngag.pPButtonEnregsitrer, page);
                                if (await pageAutParam.pPalerteTop.isVisible()) {
                                    await fonction.clickAndWait(pageAutParam.buttonParamAnnuler, page);
                                }
                            })

                            test('Button [CONFIRMER] - Click', async () => {
                                if (await pageAutEngag.pDatagridIncoherence.isVisible()) {
                                    await fonction.clickAndWait(pageAutEngag.pButtonConfirmDataGrid, page);
                                    await fonction.waitForDomStable(page);
                                }
                            })

                            test('** Wait for Spinner Off **', async () => {
                                await fonction.waitForSpinner(pageAutEngag.spanSpinner);
                            });

                            test('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                                await fonction.popinVisible(page, sNomPopin, false,30000);
                            })
                        }) // -- Fin describe

                        test('Checkbox [ARTICLE] > 0', async () => {                         
                           if (await pageAutEngag.pPtableCeckboxArticle.count() > 0) {
                                oData.article.push(sData); // Ajout de l'article au tableau 
                            } 
                        })
                    })
                }) // -- Fin Foreach 
                  //  Ajout d'articles aléatoires
                 // (uniquement si on n'a pas assez d'articles valides)
                test('** TRAITEMENT **', async () => {
                    test.setTimeout(6000000);                            //-- le traitement peut prendre du temps
                    let sTentatives     : number = 0;
                    const sMaxTentatives: number = 15;

                    while (oData.article.length < aArticlesCibles.length && sTentatives < sMaxTentatives) { /**Ici  tant que je n'ai pas le nombre d'articles valides dans mon objets oData, je boucle sur la fonction */
                        try {
                            if (page.isClosed()) {
                                throw new Error('Page fermée');
                            }
                            await ajouterArticleEngagementAleatoire();
                            sTentatives = 0;                         // Je reinitialise les tentatives
                        } catch (error) {
                            sTentatives++;
                            log.set(`Tentative ${sTentatives} échouée: ${error.message}`);
                            if (sTentatives >= sMaxTentatives) {
                                throw new Error(`Impossible d'ajouter un article après ${sMaxTentatives} tentatives`);
                            }
                            await fonction.waitForDomStable(page); // j'attends que ma page se stabilise
                        }
                    }
                });

            })  // En describe Onglet

            test.describe('Onglet [PARAMETRAGE]', async () => {

                test('Onglet [PARAMETRAGE] - Click', async () => {
                    await menu.clickOnglet(sPageName, 'parametrage', page);
                })

                test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de l'onglet
                    await fonction.isErrorDisplayed(false, page);
                })

                test('Select [ENGAGEMENTS] = "Engagements"', async () => {
                    await pageAutParam.listBoxTypeAssortiment.selectOption({ label: 'Engagements' });
                })

                test('InputField [ASSORTIMENT] = "' + sNomEngagement + '"', async () => {
                    await fonction.sendKeys(pageAutParam.inputFieldFilter, sNomEngagement, false, 'Désignation');
                    await fonction.waitForDomStable(page);
                })

                test('td [ASSORTIMENTS] - Click', async () => {
                    await fonction.clickAndWait(pageAutParam.dataGridListTdDesignation.filter({ hasText: sDesignationAssort }), page);
                })

                test.describe('Div [INFORMATION DE COMMANDE - ENGAGEMENTS]', async () => {

                    test('Button [DEBUT][LAST DAY] - Click', async () => {
                        await fonction.clickElement(pageAutParam.datePickerDebutEng);
                    })

                    test('DatePicker [DEBUT][LAST DAY] - Click', async () => {
                        await fonction.clickElement(pageAutParam.datePickerDaySpan);
                    })

                    test('Button [FIN][LAST DAY] - Click', async () => {
                        await fonction.clickElement(pageAutParam.datePickerFinEng);
                    })

                    test('DatePicker [FIN][LAST DAY] - Click', async () => {
                        await fonction.clickElement(pageAutParam.datePickerDaySpan);
                    })

                    test('InputField [HEURE DEBUT] = "' + iHeureDebut + '"', async () => {
                        await fonction.sendKeys(pageAutParam.inputHeureDebut, iHeureDebut, false, 'Heure Début');
                    })

                    test('InputField [MINUTE DEBUT] = "' + iMinuteDebut + '"', async () => {
                        await fonction.sendKeys(pageAutParam.inputMinuteDebut, iMinuteDebut, false, 'Minute Début');
                    })

                    test('InputField [HEURE FIN] = "' + iHeureFin + '"', async () => {
                        await fonction.sendKeys(pageAutParam.inputHeureFin, iHeureFin, false, 'Heure Fin');
                    })

                    test('InputField [MINUTE FIN] = "' + iMinuteFin + '"', async () => {
                        await fonction.sendKeys(pageAutParam.inputMinuteFin, iMinuteFin, false, 'Minute Fin');
                    })

                    test('Button [ENREGISTRER] - Click', async () => {
                        await fonction.clickAndWait(pageAutParam.buttonEnregistrer, page);
                    })

                    test('Button [CONFIRMER] - Click', async () => {
                        if(await pageAutParam.pPalerteIncoherenceDate.isVisible()) {             // si la popup d'alerte est visible je clique sur le bouton confirmer
                            await fonction.clickAndWait(pageAutParam.pPalertButtonIncoConfirmer, page);
                        }
                    });

                    test('Div [FEEDBACK INFORMATION] = "' + iFeedbackInfo + '"', async () => {
                        expect(await pageAutParam.divFeedbackInfo.locator('li').textContent()).toEqual(iFeedbackInfo);
                    })
                }) //-- Fin Describe

                await fonction.writeData(oData);                                             // Enregistrement des données pour le E2E  
            })  // Fin  Onglet describe

            test('Déconnexion', async () => {
                await fonction.deconnexion(page);
            })
        }) // Fin   Page describe
    })
})
