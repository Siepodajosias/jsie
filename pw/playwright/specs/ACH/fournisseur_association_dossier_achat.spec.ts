/**
 * 
 * @author Mathis NGUYEN
 * @description Associer les articles du fournisseur à un dossier d'achat
 * @since 2024-06-10
 * 
 */
const xRefTest      = "ACH_DOS_AFF";
const xDescription  = "Associer les articles du fournisseur à un dossier d'achat";
const xIdTest       =  9163;
const xVersion      = '3.4';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : ['dossierAchat', 'rayon', 'fournisseur', 'listeArticles', 'E2E'],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { expect, test, type Page}   from '@playwright/test';

import { Help }             from '@helpers/helpers';
import { TestFunctions }    from '@helpers/functions';
import { Log }              from '@helpers/log';

import { MenuAchats }       from '@pom/ACH/menu.page'; 
import { PageRefDosAch }    from '@pom/ACH/referentiel_dossiers-achats.page';

import { AutoComplete, CartoucheInfo } 	from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuAchats;
let pageRefDosAch       : PageRefDosAch;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

fonction.importJdd();

const sNomDossierCap    = fonction.getInitParam('dossierAchat', 'TA_Dossier_Recette')                                         // En majuscule par défaut
const sNomDossier       = sNomDossierCap.charAt(0).toUpperCase() + sNomDossierCap.slice(1).toLowerCase();   // Minuscule sauf initiale
const sNomFournisseur   = fonction.getInitParam('fournisseur', 'TA_Fournisseur_Recette');
const sArticles         = fonction.getInitParam('listeArticles', '5600,5800,5900,6000,6100,9200,6300,6400,6600,7100,7300,7600');
const aListeArticles    = sArticles.split(',');
let iNbArticles         = 0;

const sRayon          	= 'Fruits et légumes';

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuAchats(page, fonction);
    pageRefDosAch       = new PageRefDosAch(page);
	const helper		= new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------  

test.describe.serial('[' + xRefTest + ']', async () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [REFERENTIEL]', async () => {

        test ('ListBox [RAYON] = "' + sRayon + '"', async() => {
            await menu.selectRayonByName(sRayon, page);
        });

        var sPageName = 'referentiel';
        test ('Page [REFERENTIEL] - Click', async () => {
            await menu.click(sPageName, page);
        })

        test.describe('Onglet [DOSSIERS D\'ACHAT]', async () => {

            var sNomOnglet = 'dossiersAchat';
            test ('Onglet [DOSSIERS D\'ACHAT]', async () => {
                await menu.clickOnglet(sPageName, sNomOnglet, page);
            })

            test ('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })

            test ('AutoComplete [FOURNISSEUR] = "' + sNomFournisseur + '"', async () => {
                const autoComplete:AutoComplete = {
                    libelle     : 'Fournisseur',
                    inputLocator: pageRefDosAch.inputFiltreFournisseur,
                    inputValue  : sNomFournisseur + '-' + fonction.getToday('US'),
                    page        : page
                };
                await fonction.autoComplete(autoComplete);
                await fonction.wait(page, 500);     // On attend que la liste se rafraîchisse
            });

            test ('DataGrid [VALUES] - Check ',  async () => {
                const aCodeArticle = (await pageRefDosAch.dataGridDossierAchatCode.allTextContents()).map(code => code.trim()); //get a tab of all code articles in the datagrid
                aListeArticles.forEach(article => {
                    const bArticleFound = aCodeArticle.includes(article);
                    expect(bArticleFound).toBe(true); //expect to found article in the tab
                });

                iNbArticles = aCodeArticle.length //store number of articles
            });

            test ('InputField [FILTRE ARTICLE] = "' + aListeArticles[0] + '"', async () =>  { //filter by one value
                await fonction.sendKeys(pageRefDosAch.inputFiltreArticle, aListeArticles[0], false, 'Fournisseur');
                await fonction.wait(page, 500);     // On attend que la liste se rafraîchisse
            })

            test ('DataGrid [VALUES] - Check #2',  async () => {
                const aCodeArticle = (await pageRefDosAch.dataGridDossierAchatCode.allTextContents()).map(code => code.trim()); //get a tab of all code articles in the datagrid
                const bIsOnlyOneValue = aCodeArticle.every(code => code === aListeArticles[0]); 
                expect (bIsOnlyOneValue).toBe(true) //expect an unique value in the tab
            });

            test ('InputField [FILTRE ARTICLE] = UNDO', async () =>  {
                await fonction.sendKeys(pageRefDosAch.inputFiltreArticle, "", false, '');
                await fonction.wait(page, 500);     // On attend que la liste se rafraîchisse
            })

            test ('CheckBox [ARTICLES][0 - n] - Click', async() => {
                // On sélectionne les articles à associer
                for (let cpt = 0; cpt < iNbArticles; cpt++) {  
                    await fonction.clickElement(pageRefDosAch.checkBoxListeArticles.nth(cpt));
                }
                expect(await pageRefDosAch.dataGridDossierAchat.first().textContent()).toEqual(iNbArticles.toString());
            })


            test ('Button [REAFFECTER ARTICLE] - Click', async () => {
                await fonction.clickElement(pageRefDosAch.buttonReaffecterArticle);
            })

            var sNomPopin = 'Changement de dossier d\'achat';
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomOnglet, true);
                })

                test ('ListBox [NOM DOSSIER ACHAT] = "' + sNomDossier + '"', async () => {
                    await pageRefDosAch.pListBoxNomDossierAchat.selectOption(sNomDossier);
                })

                test ('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pageRefDosAch.pButtonEnregistrerChangement, page);
                })

                test ('** Wait Until Spinner Off **', async () => {
                    await fonction.waitForSpinner(pageRefDosAch.spinner);
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })

            })


            test.describe ('Vérifier l\'affectation au dossier d\'achat', async () => {

                test ('AutoComplete [FOURNISSEUR] #2 = "' + sNomFournisseur + '"', async () => {
                    const autoComplete:AutoComplete = {
                        libelle     : 'Fournisseur',
                        inputLocator: pageRefDosAch.inputFiltreFournisseur,
                        inputValue  : sNomFournisseur + '-' + fonction.getToday('US'),
                        page        : page
                    };
                    await fonction.autoComplete(autoComplete);
                    await fonction.wait(page, 500);     // On attend que la liste se rafraîchisse
                });

                test ('td [ARTICLES] = "' + sNomDossier + '"', async() => {
                    
                    for (let cpt = 0; cpt < iNbArticles; cpt++) {                          
                        test.step('td [ARTICLES][#' + cpt.toString() + '] = "' + sNomDossier + '"', async () => {
                            expect(await pageRefDosAch.dataGridNomDossier.nth(cpt).textContent()).toBe(sNomDossier);
                        })                                
                    }

                })

            })
            
        })

    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})
