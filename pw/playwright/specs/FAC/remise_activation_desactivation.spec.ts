/**
 * 
 * @author JC CALVIERA
 * @since 2024-03-26
 * 
 */

const xRefTest      = "FAC_REM_ADR";
const xDescription  = "Activation / Désactivation d'une Remise";
const xIdTest       =  2696;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'FAC',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
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

        test ('ListBox [RAYON - GROUPE ARTICLE] = "' + sRayon + ' - Tous"', async() => {
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

                let iNbLignesRemises:number;
                let iNbLignesRemisesActives:number;

                test ('Button [RECHERCHER] - Click', async() => {
                    await fonction.clickAndWait(pageRemises.buttonRechercheRemise, page);
                })

                test ('Message [ERREUR] #1 - Is Not Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);               // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
                })

                test ('th [ACTIF] - Click', async() => {
                    await fonction.clickElement(pageRemises.thActif);
                    await fonction.wait(page, 250);                                     //-- Attente raffraîchissement liste    

                    iNbLignesRemises = await pageRemises.tdListeRemises.count();
                    log.set('Nombre de remises total : ' + iNbLignesRemises);

                    iNbLignesRemisesActives = await pageRemises.tdListeRemisesActives.count();
                    log.set('Nombre de remises Actives : ' + iNbLignesRemisesActives);
                })

                test.describe ('ACTIF <==> DESACTIF', async()=> {

                    test ('th [ACTIF] - Click', async() => {        
                        if (iNbLignesRemisesActives > 0) {                   
                            await fonction.clickElement(pageRemises.thActif);
                            await fonction.wait(page, 250);                                     //-- Attente raffraîchissement liste    
                        } else {
                            test.skip();
                        }
                    })

                    test ('Remises [ACTIVES][0] - Click', async() => {
                        await fonction.clickElement(pageRemises.tdListeRemises.first());
                    })

                    test ('Button [ACTIVER / DESACTIVER UNE REMISE] - Click', async() => {
                        if (iNbLignesRemisesActives > 0) { 
                            await fonction.clickAndWait(pageRemises.buttonActivDesactivRemise, page);
                            log.set('Action : DESACTIVATION');
                        }else {
                            await fonction.clickAndWait(pageRemises.buttonActivDesactivRemise, page);
                            log.set('Action : ACTIVATION');
                        }
                    })

                    var sNomPopin = "Désactivation d'une remise";
                    test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

                        test ('Button [VALIDER] - Click', async() => {
                            if (iNbLignesRemisesActives > 0) {
                                await fonction.clickAndWait(pageRemises.pPdesctivButtonValider, page);
                            } else {
                                test.skip();
                            }
                        })

                    })

                    test ('Nombre Annonces ACTIVES - Check', async() => {
                        var iNewCount = await pageRemises.tdListeRemisesActives.count();
                        if (iNbLignesRemisesActives > 0) {                           
                            log.set('Nombre de remises Actives APRES Désactivation : ' + iNewCount);
                            expect(iNewCount).toBeLessThan(iNbLignesRemisesActives);                            
                        } else {
                            log.set('Nombre de remises Actives APRES Activation : ' + iNewCount);
                            expect(iNewCount).toBeGreaterThan(iNbLignesRemisesActives);
                        }
                    })

                })

            })

        });

    });

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

});
