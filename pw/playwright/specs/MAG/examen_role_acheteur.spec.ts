/**
 * 
 * @author Vazoumana Diarrassouba
 * @since 2023/10/19
 * 
 */

const xRefTest      = "MAG_ROL_ACH";
const xDescription  = "Examen du rôle Acheteur";
const xIdTest       =  9010;
const xVersion      = '3.9';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['groupeArticle'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import{ test, type Page, expect }       from '@playwright/test';

import{ Help }                          from '@helpers/helpers';
import{ TestFunctions }                 from '@helpers/functions';

import{ Credential }                    from '@conf/credential.conf';

import{ Authentificationpage }          from '@pom/COMMUN/authentification.page';

import{ MenuMagasin }                   from '@pom/MAG/menu.page';   
import{ AlertesSuivi }                  from '@pom/MAG/alertes-suivi.page'; 
import{ AutorisationsAchatsCentrale  }  from '@pom/MAG/autorisations-achats_centrale.page';
import{ AlertesHistoriqueCentrale }     from '@pom/MAG/alertes-historique_centrale.page'; 

import { CartoucheInfo, TypeListOfElements } from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuMagasin;

// Pages Object ---------------------------------------------------------------------

let pageObjectAuth      : Authentificationpage;  

let pageAlerteSuivi     : AlertesSuivi; 
let pageAutoAchCentrale : AutorisationsAchatsCentrale;
let pageAlerteHisto     : AlertesHistoriqueCentrale;

// Varibles ---- ---------------------------------------------------------------------

const profil            = 'jcc-recette1';
const userCredential    = new Credential(profil);
const fonction          = new TestFunctions();

var profilData          = userCredential.getData();
var groupeArticle       = process.env.groupeArticle || 'Charcuterie';
var isAlertePresent     = false;

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {

    page                = await browser.newPage();
    menu                = new MenuMagasin(page, fonction);

    pageObjectAuth      = new Authentificationpage(page);

    pageAlerteSuivi     = new AlertesSuivi(page);
    pageAutoAchCentrale = new AutorisationsAchatsCentrale(page);
    pageAlerteHisto     = new AlertesHistoriqueCentrale(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ( { context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test.describe('Connexion', async () => {

        test('Role [ACHETEUR] = "'+profilData.login+'"', async () => {
            await pageObjectAuth.setJUsername(profilData.login);
            await pageObjectAuth.setJPassword(profilData.password);
            await pageObjectAuth.clickConnexionButton(page);
        })					  

    })

    test('Menu [PAGES] - Check', async () => {
        var oMenuContent:TypeListOfElements = {
            element : menu.menuInMenusItem,
            desc    : 'Page',
            column  : [
                'Accueil',
                'Alertes & qualité',
                'Autori-sations',
            ],
        };
        await fonction.elementInList(oMenuContent);
    })

    test.describe('Page [ALERTE & QUALITE]', () => {

        var pageAlerte = 'alertes';
        
        test('Page [ALERTE & QUALITE] - Click', async () => {
            await menu.click(pageAlerte, page);
        })

        test('Page [ALERTE & QUALITE][ONGLETS] - Check', async () => {
            var oPageOnglet:TypeListOfElements = {
                element : menu.ongletsAlertes,
                desc    : 'Onglet',
                verbose : false,
                column  : [
                    'Suivi général',
                    'Historique général',
                    'Suivi infos qualité',
                ],
            };
            await fonction.elementInList(oPageOnglet);
        })

        test.describe('Onglet [SUIVI CENTRALE]', () => {

            var ongletAlerte    = 'suiviCentrale';

            test('Onglet [SUIVI CENTRALE] - Click', async () => {
                await menu.clickOnglet(pageAlerte, ongletAlerte, page);
            })
            
            test.skip('Button [VOIR LE SUIVI] - Is Visible and Alone', async () => {
                var oOngletButton:TypeListOfElements = {
                    element : menu.ongletSCFooterBtn,
                    desc    : 'Button',
                    column  : ['Voir le suivi'],
                    verbose : false
                };
                await fonction.elementInList(oOngletButton);
            })

            test('Button [VOIR LE SUIVI] - Is Disabled', async () => {
                await menu.ongletSCFooterBtn.isDisabled();
            })

            test('ListBox [GROUPE ARTICLE] = "' + groupeArticle + '" - Click', async () => { 
                await pageAlerteSuivi.listBoxGroupeArticle.click();
                await pageAlerteSuivi.listBoxGroupeArticle.selectOption({label:groupeArticle});
                await fonction.addDataSheet('ListBox', 'Groupe Article', groupeArticle);
                await fonction.waitTillHTMLRendered(page);                       
            })

            test('DataGrid [LISTE D\'ALERTES][first] - Click', async () => {
                var nb = await pageAlerteSuivi.dataGridListeArticleElmt.count();
                if( nb > 0 ){
                    isAlertePresent = true;
                    await pageAlerteSuivi.dataGridListeArticleElmt.first().click();
                    console.log(`${nb} ALERTE(S) DISPONIBLE(S)`);  
                }else{
                    console.log('[INFO] Aucune alerte existante. Click est actions suivantes ignorées.');
                }
            })

            test.describe('Popin [SUIVI DE L\'ALERTE] - Check', async () => {

                test('Button [VOIR LE SUIVI] - Is Enabled', async () => {
                    test.skip(isAlertePresent === false);
                    await menu.ongletSCFooterBtn.isEnabled();
                })

                test('Button [VOIR LE SUIVI] - Click', async () => {
                    test.skip(isAlertePresent === false);
                    await fonction.clickAndWait(pageAlerteSuivi.buttonVoirSuivi, page);
                })
    
                test('Popin [SUIVI DE L\'ALERTE] - Is Visible', async () => {
                    test.skip(isAlertePresent === false);
                    await fonction.popinVisible(page, nomPopin, true);
                })

                test('Button [FERMER] - Click', async () => {
                    test.skip(isAlertePresent === false);
                    await fonction.clickElement(pageAlerteSuivi.pPlinkSuiviFermer);
                })

                var nomPopin = "Suivi de l'alerte";
                test('Popin [' + nomPopin.toUpperCase() + '] - Is NOT Visible', async () => {
                    test.skip(isAlertePresent === false);
                    await fonction.popinVisible(page, nomPopin, false)
                })

            })

        })
        
        test.describe('Onglet [HISTORIQUE CENTRALE]', () => {

            var ongletAlerte = 'historiqueCentrale';

            test('Onglet [HISTORIQUE CENTRALE] - Click', async () => {
                await menu.clickOnglet(pageAlerte, ongletAlerte, page);
            })

            test('Onglet [HISTORIQUE CENTRALE][FOOTER][SECTION] - Is NOT Visible', async () => {
                await expect(pageAlerteHisto.buttonSection.first()).toBeHidden();
            })
        })

    })

    test.describe('Page [AUTORISATIONS]', () => {

        var pageAuto = 'autorisations';

        test('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(pageAuto, page);
        })

        test('Page [AUTORISATIONS][ONGLETS] - Check', async () => {
            var oPageOnglet:TypeListOfElements = {
                element : menu.ongletsAuto,
                desc    :'Onglet',
                column  : ['Achats centrale'],
            };
            await fonction.elementInList(oPageOnglet);
        })

        test.describe('Onglet [ACHATS CENTRALE]', () => {

            var ongletAuto = 'autorisationAchatCentrale';

            test('Onglet [ACHATS CENTRALE] - Click', async () => {
                await menu.clickOnglet(pageAuto, ongletAuto, page);
            })

            test('Button [PREPARER COMMUNICATION] - Is Visible', async () => {
                await fonction.isDisplayed(menu.ongletACFooterBtn.nth(0));

                var sBoutonTexte = await menu.ongletACFooterBtn.nth(0).textContent();
                expect(sBoutonTexte).toBe(' Préparer communication ');
            })

            test('Button [CONSULTER LA LIGNE] - Is Visible', async () => {
                await fonction.isDisplayed(menu.ongletACFooterBtn.nth(1));

                var sBoutonTexte = await menu.ongletACFooterBtn.nth(1).textContent();
                expect(sBoutonTexte).toBe(' Consulter la ligne ');
            })

            test('Onglet [ACHATS CENTRALE][BOUTONS] - Check', async () => {
                var oOngletButton:TypeListOfElements = {
                    element : menu.ongletACFooterBtn,
                    desc    :'Button',
                    column  : [ 'Préparer communication','Consulter la ligne'],
                };
                await fonction.elementInList(oOngletButton);
            })
        })

        test('InputField [ASSORTIMENT] = "' + groupeArticle + '"', async () => {
            await fonction.sendKeys(pageAutoAchCentrale.inputAssortiment, groupeArticle, false, 'Assortiment');
            await fonction.wait(page, 500); // Attente raffraîchissement liste
        })

        test('DataGrid [ASSORTIMENTS][FIRST] - CLick', async () => {
            await fonction.clickAndWait(pageAutoAchCentrale.trLignesAssortiments.first(), page);
        })

        test('DataGrid [ARTICLES DE L\'ASSORTIMENT][first] - Click', async () => {
           await pageAutoAchCentrale.trLignesArticles.first().click();
        })

        var nomPopin = 'Modification d\'une ligne de l\'assortiment XXXX';
        test.describe('Popin [' + nomPopin.toUpperCase() + '] ', async () => {

            test('Button [CONSULTER LA LIGNE] - Click', async () => {
                await fonction.clickAndWait(pageAutoAchCentrale.buttonConsulterLigne, page);
            })
            test('Popin [' + nomPopin.toUpperCase() + '] - Is Visible', async () => {
                await pageAutoAchCentrale.pPopinEnregLAssortFL.isVisible();
            })

            test('Button [CARTE] - Click', async () => {
                await fonction.clickAndWait(pageAutoAchCentrale.pPbuttonCarte, page);
            })

            test('Carte [POSITION DE LA LIGNE] - Is Visible', async () => {
                await fonction.isDisplayed(pageAutoAchCentrale.pPCarte);
            })

            test('Button [FERMER] - Click', async () => {
                 await pageAutoAchCentrale.pPButtonFermer.click();
            })

            test('Popin [' + nomPopin.toUpperCase() + '] - Is NOT Visible', async () => {
                await fonction.popinVisible(page, nomPopin, false);
            })

        })

    })

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})