/**
 * 
 * @author JC CALVIERA
 * @since 2024-03-21
 * 
 */

const xRefTest      = "FAC_REM_UPD";
const xDescription  = "Modification d'une Remise";
const xIdTest       =  2695;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'FAC',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Nb : Le taux est 88.888 % afin de serveur de traceur inter-tests'],
    params      : ['plateforme', 'rayon'],
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

const sPlateforme       = fonction.getInitParam('plateforme', 'Chaponnay');
const sRayon            = fonction.getInitParam('rayon', 'Fruits et légumes');
const sTaux             = fonction.getLocalConfig('rTauxRemise');
const sTauxModifie      = fonction.getLocalConfig('rTauxRemiseModifie');

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

            let iNbTauxTrouve:number;

            test ('Onglet [REMISES] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'remises', page);
            })

            test ('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);               // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            test ('Button [RECHERCHER] - Click', async() => {
                await fonction.clickElement(pageRemises.buttonRechercheRemise);
            })

            test ('Entete [TAUX DE REMISE] - Click x 2', async() => {
                await pageRemises.tdListeTaux.first().waitFor();
                await fonction.clickElement(pageRemises.thTaux);
                await fonction.wait(page, 250);
                await fonction.clickElement(pageRemises.thTaux);
            })

            test ('td [TAUX] = "' + sTaux + ' (count 1)"', async() => {
                iNbTauxTrouve = await pageRemises.tdListeTaux.locator('span:text-is("' + sTaux + '")').count();
                log.set('Nombre INITIAL de taux ayant une remise de ' + sTaux + '% : ' + iNbTauxTrouve.toString());
                await fonction.clickElement(pageRemises.tdListeTaux.locator('span:text-is("' + sTaux + '")').first());
            })

            var sNomPopin = "Création d'une remise";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test ('Button [MODIFIER UNE REMISE] - Click', async() => {
                    await fonction.clickAndWait(pageRemises.buttonModifierRemise, page);
                })

				test ('Message [ERREUR] - Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				}) 

				test ('InputField [TAUX] = "' + sTauxModifie + '"', async () => {
					await fonction.sendKeys(pageRemises.pPcreatInputTaux, sTauxModifie);
				}) 

				test ('CheckBox [ACTIF]  - Click rnd', async () => {
					await fonction.clickElement(pageRemises.pPcreatCheckBoxActif, 0.5);
				}) 

                test ('Button [ENREGISTRER] - Click', async() => {
                    await fonction.clickAndWait(pageRemises.pPcreatButtonEnregistrer, page);
                })

            })

            test ('td [TAUX] = "' + sTaux + ' (count 2)"', async() => {
                var iNewNbTauxTrouve = await pageRemises.tdListeTaux.locator('span:text-is("' + sTaux + '")').count();
                log.set('Nombre de taux ayant une remise de ' + sTaux + '% : ' + iNewNbTauxTrouve.toString() + ' après modification');
                expect(iNewNbTauxTrouve).toBeLessThan(iNbTauxTrouve);
            })

        });

    });

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

});
