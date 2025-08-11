/**
 * 
 * @author Esli Ariel BAHILI
 *  Since 24 - 02 - 2025
 */

const xRefTest     = "MAG_ACT_DIF";
const xDescription = "Diffusion d'une actualité aux magasins";
const xIdTest      = 9671;
const xVersion     = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['titreActualite'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { expect, test, type Page }          from '@playwright/test';

import { TestFunctions }                    from '@helpers/functions';
import { Log }                              from '@helpers/log';
import { Help }                             from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }                      from '@pom/MAG/menu.page';
import { AutorisationsActualite }           from '@pom/MAG/autorisations-actualite.page';
import { AccueilActualites }                from '@pom/MAG/accueil-actualites.page';

import { CartoucheInfo }                    from '@commun/types';

//----Variables--------------------------------------------------------------------------------------------------------------------------------------------

let page                    : Page;
let menu                    : MenuMagasin;
let pageActualites          : AutorisationsActualite;
let accueilActualites       : AccueilActualites;

const log                   = new Log();
const fonction              = new TestFunctions(log);

//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page			    = await browser.newPage();
    menu			    = new MenuMagasin(page, fonction);
    pageActualites 	    = new AutorisationsActualite(page);
    accueilActualites   = new AccueilActualites(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({ }, testInfo) => {
    await fonction.close(testInfo);
})

//-------------------------------------------------------------------------------------

process.env.ROLE            = 'REPARTITEUR';

//-----------------------------------------------------------------------------------------

const sTitres:string        = fonction.getInitParam('titreActualite', 'TA_Actualité - 1,TA_Actualité - 2,TA_Actualité - 3,TA_Actualité - 4');
const aTitres:string[]      = sTitres.split(',');
const sMagasin:string       = fonction.getLocalConfig('actualiteMagasin');

//----Fonction--------------------------------------------------------------------------------

/**
 * @description Cette procédure permet de sélectionner une actualité en passant son titre en paramètre
 * @param titre 
 */
var selectionActualite = async (titre:string) => {
    test(`InputField Filtre [TITRE] = "${titre}"`, async () => {
        await fonction.sendKeys(pageActualites.inputFiltreTitre, titre, false, 'Valeur Recherchée');
        await fonction.wait(page, 250);
    });
    
    test(`Button [SELECT ACTUALITE ${titre}] - Click`, async () => {
        await fonction.clickAndWait(pageActualites.Listeactualite, page);
    });
}

//-----------------------------------------------------------------------------------------
test.describe.serial ('[' + xRefTest + ']', () => {
    
    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({context}) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion [Répartiteur] : ' + fonction.getApplicationUrl(), async ({}) => {
        await fonction.connexion(page);
        await menu.removeArlerteMessage(page);
    })

    test.describe('Page [ACCUEIL] - Repartiteur', async () => {

        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if (isVisible) {
                await menu.removeArlerteMessage(page);
            } else {
                log.set('Link [BROWSER SECURITY WARNING] - Click: ACTION ANNULEE');
                test.skip();
            }
        })

    });    
    
    test.describe('Page [AUTORISATIONS]', () => {
        var pageName:string = 'autorisations';

        test('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(pageName, page);
        })

        test.describe('Onglet [ACTUALITE]', async () => {

            test('Onglet [ACTUALITE]', async () => {
                await menu.clickOnglet(pageName, 'actualite', page);
            })

            test ('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            });

            // Cliquer sur le bouton "diffusées" pour afficher seulement les actualités non diffusées
            test('Button [DIFFUSEES] - Click', async () => {
                await fonction.clickAndWait(pageActualites.buttonDiffusees, page);
            })

            //Diffuser une actualité
            test.describe('Diffuser l\'actualité - par défaut', () => {

                //Selectionner l'actualité par défaut
                selectionActualite(aTitres[0]);
                //Diffuser l'actualité
                test('Button [DIFFUSER] - Click', async () => {
                    await fonction.clickAndWait(pageActualites.buttonDiffuser, page);
                })

            })

            //Diffuser une actualité
            test.describe('Diffuser une actualité - 1', () => {

                //Selectionner l'actualité 1
                selectionActualite(aTitres[1]);
                //Diffuser l'actualité
                test('Button [DIFFUSER] - Click', async () => {
                    await fonction.clickAndWait(pageActualites.buttonDiffuser, page);
                })

            })
            
            //Diffuser les actualités 2 et 3
            test.describe('Diffuser plusieurs actualités', () => {

                //Sélectionner les actualités 2 et 3
                for (let i = 2; i < aTitres.length; i++) {
                    selectionActualite(aTitres[i]);
                }

                //Vider le filtre
                test ('Filtre [TITRE] - Clear', async () => {
                    await fonction.sendKeys(pageActualites.inputFiltreTitre, '', false, 'Valeur Recherchée');
                    await fonction.wait(page, 250);
                })

                //Diffuser les 2 actualités
                test('Button [DIFFUSER] - Click', async () => {
                    await fonction.clickAndWait(pageActualites.buttonDiffuser, page);
                })

            })

        })
        
    })

    //Connexion magasin responsable de programme
    test('Connexion [Responsable de Rayon]', async ({context}) => {
        context.clearCookies();
        await fonction.changeProfilByRole(info.appli, 'RESPONSABLE RAYON', page);
        await menu.removeArlerteMessage(page);
    })

    test.describe('Page [ACCUEIL] - Responsable', async () => {

        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if (isVisible) {
                await menu.removeArlerteMessage(page);
            } else {
                log.set('Link [BROWSER SECURITY WARNING] - Click: ACTION ANNULEE');
                test.skip();
            }
        })

    })    

    test.describe('Vérifier la diffusion', () => {

        test ('listBox [MAGASIN] = "' + sMagasin + '"', async() => {
            await fonction.selectOption(accueilActualites.selectMagasin, sMagasin);
            await fonction.wait(page, 250);
        })

        test('Input Filtre [RECHERCHER] = "' + aTitres[1] + '"' , async() => {
            await fonction.sendKeys(accueilActualites.inputRecherche, aTitres[1], false, 'Valeur Recherchée');
            await fonction.clickAndWait(accueilActualites.buttonRechercher, page);
        })

        test('Label [TITRE ACTUALITE] - Is visible', async() => {
            await expect(accueilActualites.titreActualite).toBeVisible();
        })

    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})
