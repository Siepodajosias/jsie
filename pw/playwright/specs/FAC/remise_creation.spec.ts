/**
 * 
 * @author JC CALVIERA
 * @since 2024-03-21
 * 
 */

const xRefTest      = "FAC_REM_ADD";
const xDescription  = "Création d'une Remise";
const xIdTest       =  2694;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'FAC',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['groupeArticle', 'plateforme', 'rayon'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { expect, test, type Page }      from '@playwright/test';

import { Help }                         from '@helpers/helpers.js';
import { TestFunctions }                from '@helpers/functions.js';
import { Log }                          from '@helpers/log.js';

import { MenuFacturation }              from '@pom/FAC/menu.page';
import { LivraisonsEffectuesRemises }   from '@pom/FAC/livraisons_effectues-remises.page';

import { CartoucheInfo }                from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuFacturation;
let pageRemises         : LivraisonsEffectuesRemises;

const log               = new Log();
const fonction          = new TestFunctions(log);
//------------------------------------------------------------------------------------

const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Fruits et légumes');
const sPlateforme       = fonction.getInitParam('plateforme', 'Chaponnay');
const sRayon            = fonction.getInitParam('rayon', 'Fruits et légumes');
const sTaux             = fonction.getLocalConfig('rTauxRemise');

//------------------------------------------------------------------------------------



test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuFacturation(page, fonction);
    pageRemises     = new LivraisonsEffectuesRemises(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });


    test.describe('Page [ACCUEIL]', async () => {

        test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {            
            await menu.selectPlateformeByLabel(sPlateforme, page);           
            log.set('Plateforme : ' + sPlateforme);
        })

        test ('ListBox [RAYON - GROUPE ARTICLE] ="' + sRayon + ' - Tous"', async() => {
            await menu.selectRayonGroupeArticle(sRayon, 'Tous', page);
        });

    });  //-- End Describe Page

    test.describe('Page [LIVRAISONS EFFECTUEES]', async () => {

        let sCurrentPage = 'livEffectuees';

        test ('Page [LIVRAISONS EFFECTUEES]', async () => {
            await menu.click(sCurrentPage, page);
        });

        test ('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);               // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
        })

        test.describe('Onglet [REMISES]', async () =>{

            test ('Onglet [REMISES] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'remises', page);
            })

            test ('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);               // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            const sNomPopin = "Création d'une remise";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() =>{

                let bRemiseEnLigne:boolean = false;

                test ('Button [CREER UNE REMISE] - Click', async() => {
                    await fonction.clickElement(pageRemises.buttonCreerRemise);
                })

                test ('Message [ERREUR] #1 - Is Not Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);               // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
                })

                test ('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async() => {
                    await pageRemises.pPcreatListBoxGrpArticle.selectOption(sGroupeArticle);
                    log.set('Groupe Article : ' + sGroupeArticle);             
                })

                test ('Radio Button [REMISE ... ] - rnd Selected', async () => {
                    if(fonction.random() > 0.5) {
                        await fonction.clickElement(pageRemises.pPcreatRadioRemisePied);
                        log.set('Type de remise : Remise en pied de page');
                    } else {
                        await fonction.clickElement(pageRemises.pPcreatRadioRemiseLigne);
                        log.set('Type de remise : Remise à la ligne');
                        bRemiseEnLigne = true;
                    }
                })

                test ('CheckBox [ARTICLES][rnd] - Click (Optionnel)', async() => {
                    if (bRemiseEnLigne) {
                        await pageRemises.pPcreatCheckBoxArticles.first().waitFor();
                        const iNbArticles = await pageRemises.pPcreatCheckBoxArticles.count();
                        const iRnd = Math.floor(fonction.random() * iNbArticles);
                        log.set('Nombre d\'articles : ' + iNbArticles);

                        const sCodeArticle = await pageRemises.pPcreatTdDesignArticles.nth(iRnd).textContent();
                        await fonction.clickElement(pageRemises.pPcreatCheckBoxArticles.nth(iRnd));
                        log.set('Sélection article : ' + sCodeArticle);

                    } else {
                        test.skip();
                    }
                })

                test ('InputField [TAUX] = "' + sTaux + '"', async() => {
                    await fonction.sendKeys(pageRemises.pPcreatInputTaux, sTaux);
                    log.set('Taux : ' + sTaux);
                })

                test ('CheckBox [ACTIF] - rnd Click', async() => {
                    await fonction.clickCheckBox(pageRemises.pPcreatCheckBoxActif, 0.5, false);
                })

                test ('CheckBox [ALL MAGASIN] - Unchek', async() => {
                    const sCompteur = await pageRemises.pPcreatHeadersMagasins.nth(0).textContent();
                    log.set('Nombre de magsins initialement sélectionnés : ' + sCompteur);
                    if (sCompteur !== '0') {
                        await fonction.clickElement(pageRemises.pPcreatHeadersMagasins.nth(0).locator('input'));
                        log.set('Désélection "Tous Magasins"');
                    }
                    
                })

                test ('CheckBox [MAGASINS][rnd] - Click', async() => {

                    await pageRemises.pPcreatCheckBoxMagasins.first().waitFor();
                    const iNbMagasins = await pageRemises.pPcreatCheckBoxMagasins.count();
                    const iRnd = Math.floor(fonction.random() * iNbMagasins);

                    log.set('Nombre de Magasins Total Proposé : ' + iNbMagasins);
                    await fonction.clickElement(pageRemises.pPcreatCheckBoxMagasins.nth(iRnd));
                    const sDesignMagasin = await pageRemises.pPcreatTdDesignMagasins.nth(iRnd).textContent();
                    log.set('Sélection Magasin : ' + sDesignMagasin);

                })

                test ('DatePicker [FIN] = rnd', async() => {

                    const rTypeDate = fonction.random();

                    if (rTypeDate < 0.33) { 
                        log.set('Date de Fin : Néant');
                    } else if (rTypeDate > 0.66) {
                        log.set('Date de Fin : Dernier jour du mois du calendrier');
                        await fonction.clickElement(pageRemises.pPcreatDatePickerTo);
                        await fonction.wait(page, 250);
                        await fonction.clickElement(pageRemises.pPcalendarToday.last());
                    } else {
                        log.set('Date de Fin : Aujourd\'hui');
                        await fonction.clickElement(pageRemises.pPcreatDatePickerTo);
                        await fonction.wait(page, 250);
                        await fonction.clickElement(pageRemises.pPcalendarToday.first());
                    }

                })

                test ('Button [ENREGISTRER] - Click', async() => {
                    await fonction.clickAndWait(pageRemises.pPcreatButtonEnregistrer, page);
                })

                test ('Message [ERREUR] #2 - Is Not Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);               // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
                })

            })

        });

    });

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

});
