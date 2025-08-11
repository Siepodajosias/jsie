/**
 * 
 * @author ABDOUL SARBA
 * @since 2025-04-14
 * 
 */

const xRefTest      = "BUD_E2E_CNE";
const xDescription  = "Création d'un nouvel exercice";
const xIdTest       = 9620;
const xVersion      = '3.10';

var info: CartoucheInfo = {
    desc    : xDescription,
    appli   : 'BUDGET',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : [],
    params  : ['anneeExercice'],
    fileName: __filename
};

import { test, expect, type Page }      from '@playwright/test';

import { CartoucheInfo }                from '@commun/types';

import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';

import { MenuBudgets }                  from '@pom/BUD/menu.page';
import { ParametrageOverturesSaisies }  from '@pom/BUD/parametrage_ouverture_saisies.page';
import { ParametrageCoeffProgression }  from '@pom/BUD/parametrage_coefficient_progression.page';

//----------------------------------------------------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuBudgets;
let paramOuverture  : ParametrageOverturesSaisies;
let paramCoefProgres: ParametrageCoeffProgression;

//----------------------------------------------------------------------------------------------------------------------------------

var maDate          = new Date();
const log           = new Log();
const fonction      = new TestFunctions(log);

//----------------------------------------------------------------------------------------------------------------------------------

const iAnneeCourante= maDate.getFullYear();
var sAnneeExercice  = fonction.getInitParam('anneeExercice', String(iAnneeCourante + 1)); 

//---------------------------------------------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page    = await browser.newPage();
    menu    = new MenuBudgets(page, fonction);

    paramOuverture  = new ParametrageOverturesSaisies(page);
    paramCoefProgres= new paramCoefProgres(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({ }, testInfo) => {
    await fonction.close(testInfo);
});

//---------------------------------------------------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [PARAMETRAGE]', async () => {

        var sNomPage:string = 'parametrage';

        test ('Menu [' + sNomPage.toUpperCase() + '] - Click', async () => {
            await menu.click(sNomPage, page);
        });

        test.describe('Onglet [OUVERTURE DES SAISIES ]', async () => {

            var sNomOnglet:string = 'ouverture des saisies';

            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'ouvertureSaisie', page);
            });

            test ('Button [CREER UN NOUVEL EXERCICE (yyyy)] - Click', async () => {

                // Récupération du texte affiché sur le bouton. Ex : "Créer un nouvel exercice (2026)"
                const sTexteBouton:string = await paramOuverture.buttonCreerNouvelExercice.textContent();

                // Extraction des données : "Créer un nouvel exercice (2026)" => 2026
                const pattern: RegExp = /\((\d+)\)/;

                // Recherche du motif dans la chaîne
                const match: RegExpMatchArray | null = sTexteBouton.match(pattern);

                // Extraction de l'année proposée par défaut par l'application
                if (match) {
                    const iAnneeProposee: number = parseInt(match[1]);
                    log.set(sTexteBouton + ' => ' + iAnneeProposee);
                }

                // Si on ne passe aucun paramètre en argument, on récupèure l'année proposée par l'application
                if (process.env['anneeExercice'] === undefined) {
                    sAnneeExercice = iAnneeCourante.toString();
                }

                await fonction.clickAndWait(paramOuverture.buttonCreerNouvelExercice, page);

            });

            var sNomPopin:string = "Création d'un exercice";
            test.describe('Popin [' + sNomPopin + ']', async () => {

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                });
    
                test ('Radio Button [OUI] - Click', async () => {
                    await fonction.clickElement(paramCoefProgres.pRadioButtonOui);
                });
    
                test ('Button [CREER] - Click', async () => {    
                    await fonction.clickAndWait(paramCoefProgres.pButtonCreerExercice,page);
                });

                test ('** Wait for spinner **', async () => {    
                    await fonction.waitForSpinner(paramCoefProgres.pButtonCreerExercice,120000);
                });

            });

            test ('ListBox [EXERCICE][' + sAnneeExercice + '] - Is Visible', async () => {
                await expect(paramOuverture.listboxAnneeExercice).toContainText(sAnneeExercice, { timeout: 30000 });
                log.set("L'exercice " + sAnneeExercice + " est visible dans la liste déroulante des exercices.");
            });

            test ('Button [OUVERTURE EN SAISIE INITIALE] - Is Disabled', async () => {
                const iNbSwitch = await   paramOuverture.switchButtonOuvertSaisieIniial.count();
                for (let i = 0; i < iNbSwitch; i++) {
                    await expect(paramOuverture.switchButtonOuvertSaisieIniial.nth(i)).toHaveAttribute("aria-checked", "false");  
                }
            })
 
            test ('Button Toggle [SAISIE AVEC ATTERISSAGE "' + sAnneeExercice + '"] - Is Enabled', async () => {
                const iNbSwitch = await   paramOuverture.switchButtonSaisieatterissage.count();
                for(let i = 0; i < iNbSwitch; i++){
                    await expect(paramOuverture.switchButtonSaisieatterissage.nth(i)).toBeEnabled();
                }
            })

            test ('ListBox [EXERCICE] = "' + iAnneeCourante + '"', async () => {
                await paramCoefProgres.listBoxAnneeExercice.selectOption({index: 1});
            })

            test ('Button toggle [D.E OUVERT EN ATTER][' + iAnneeCourante + '][n] - Are Enabled',async () => {
                const iNbSwitch = await paramOuverture.switchButtonNouvelAtterissage.count();
                for(let i = 0; i< iNbSwitch; i++){
                    await expect(paramOuverture.switchButtonNouvelAtterissage.nth(i)).toBeEnabled();
                }
            })

        })

    })

    test.describe('Page [BUDGETS MAGASINS]', async () => {

        var sNomPage :string = 'budgetsMagasin';

        test ('Menu [' + sNomPage.toUpperCase() + '] - Click', async () => {
            await menu.click(sNomPage, page);
        });
        
        test ('ListBox [EXERCICE][' + sAnneeExercice + '] - Is Not Visible', async () => {
            await expect(paramCoefProgres.listBoxAnneeExercice).not.toContainText(sAnneeExercice);
        });

    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    }); 

})