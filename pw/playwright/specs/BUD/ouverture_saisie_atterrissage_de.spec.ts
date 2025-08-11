/**
 * 
 * @author ABDOUL SARBA
 * @since 2025-04-29
 * 
 */

const xRefTest     = "BUD_OUV_ODE";
const xDescription = "Ouvrir la saisie avec atterrissage pour une direction d'exploitation";
const xIdTest      = 9279;
const xVersion     = '3.5';

var info: CartoucheInfo = {
    desc        : xDescription,
    appli       : 'BUDGET',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Step 6/6', 'Pipeline_BUD - E2E_Création du nouvel exercice avec atterrissage'],
    params      : ["directionExploitation"],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------------------------------------------------

import { expect, test, type Page }              from '@playwright/test';

import { CartoucheInfo }                        from '@commun/types';

import { Help }                                 from '@helpers/helpers';
import { TestFunctions }                        from '@helpers/functions';
import { Log }                                  from '@helpers/log';

import { MenuBudgets }                          from '@pom/BUD/menu.page';
import { BudgetMagClients } 	 			    from '@pom/BUD/budget_magasin_clients.page';
import { BudgetMagEcartMarge }   			    from '@pom/BUD/budget_magasin_ecart_marge.page';
import { ParametrageOverturesSaisies }          from '@pom/BUD/parametrage_ouverture_saisies.page';
import { ParametrageRegroupement }              from '@pom/BUD/parametrage_regroupement.page';
import { ParametrageCoeffProgression }          from '@pom/BUD/parametrage_coefficient_progression.page';
import { ParametrageImpactsCalendaires }        from '@pom/BUD/parametrage_impacts_calendaires.page';

//----------------------------------------------------------------------------------------------------------------------------------

let page                          : Page;
let menu                          : MenuBudgets;
let parametrageOuverture          : ParametrageOverturesSaisies;
let parametrageRegroupement       : ParametrageRegroupement;
let parametrageCoeffProgression   : ParametrageCoeffProgression;
let parametrageImpactsCalendaires : ParametrageImpactsCalendaires;
let budgetMagEcartMarge           : BudgetMagEcartMarge;
let budgetMagClients              : BudgetMagClients;

//----------------------------------------------------------------------------------------------------------------------------------

var maDate                      = new Date();
const log                       = new Log();
const fonction                  = new TestFunctions(log);

var sDirectionExploitation      = fonction.getInitParam('directionExploitation','fresh.,Grand Frais BCV,Grand Frais Crèmerie,Grand Frais FL');

const iAnneeCourante   = maDate.getFullYear();
const sAnneeExercice   = String(iAnneeCourante + 1);

//---------------------------------------------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                          = await browser.newPage();
    menu                          = new MenuBudgets(page, fonction);
    parametrageOuverture          = new ParametrageOverturesSaisies(page);
    parametrageRegroupement       = new ParametrageRegroupement(page);
    parametrageCoeffProgression   = new ParametrageCoeffProgression(page);
    parametrageImpactsCalendaires = new ParametrageImpactsCalendaires(page);
    budgetMagClients              = new BudgetMagClients(page);
    budgetMagEcartMarge           = new BudgetMagEcartMarge(page);
    const helper                  = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({ }, testInfo) => {
    await fonction.close(testInfo);
})

//---------------------------------------------------------------------------------------------------------------------------------
test.describe.serial('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    var sNomPage:string = 'parametrage';
    test.describe ('Page [PARAMETRAGE]', async () => {

        test ('Menu [' + sNomPage.toUpperCase() + '] - Click', async () => {
            await menu.click(sNomPage, page);
        })

        var sNomOnglet:string = 'ouverture des saisies';
        test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async () => {

            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'ouvertureSaisie', page);
            })

            test ('Button [OUVERTURE SAISIE INITIALE][n] - Click', async () => {
                const aDirectionExploitations = sDirectionExploitation.split(',');     
                for(let i = 2; i < aDirectionExploitations.length+2; i++){
                    await expect(parametrageOuverture.switchButtonOuvertSaisieIniial.nth(i)).toHaveAttribute("aria-checked", "false");
                    await expect(parametrageOuverture.switchDejaOuvertSaisie.nth(i)).toHaveAttribute("aria-checked", "false");
                    await expect(parametrageOuverture.switchButtonSaisieatterissage.nth(i)).toHaveAttribute("aria-checked", "true");
                    await fonction.clickAndWait(parametrageOuverture.switchOuvertSaisieIniial.nth(i),page);
                }
            })

            test ('Button [ENREGISTRER] - Click', async () => {
                const responsePromise = page.waitForResponse(resp =>
                    resp.url().includes(`ouverture-saisies?annee=${sAnneeExercice}`) &&
                    resp.status() === 200
                );
                await fonction.clickAndWait(parametrageOuverture.buttonEnregistrer, page);
                await fonction.waitForSpinner(parametrageOuverture.spinner);
                const response = await responsePromise;
                log.set(` [i] Réponse reçue: ${response.url()} - Status: ${response.status()}`);
                expect(response.status()).toBe(200);
            })


            test ('Switch [DEJA OUVERT EN SAISIE INITIALE][n] - Is Checked', async () => {
                const aDirectionExploitations = sDirectionExploitation.split(',');
                for(let i = 2; i < aDirectionExploitations.length+2; i++){
                    await expect(parametrageOuverture.switchDejaOuvertSaisie.nth(i)).toHaveAttribute("aria-checked", "true",);
                }
            })

        })

        test.describe ('Onglet [REGROUPEMENT]', async () => {

            var sNomOnglet: string = 'regroupement';
            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'regroupement', page);
            })

            test ('Button [MODIFIER] - Is Disabled',async () => {
                await expect(parametrageRegroupement.buttonModifier).toBeDisabled();
            })

        })

        sNomOnglet = 'Coefficent de Progression';
        test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async () => {

            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'coefficientsProgression', page);
            })

            test ('Input [COEFFICIENT DE PROGRESSION] - Is Visible', async () => {
                const aDirectionExploitations= sDirectionExploitation.split(',');
                for(let i = 0; i < aDirectionExploitations.length +2; i++) {
                    const iNbDataTable = await parametrageCoeffProgression.inputdataTableAllInput.count();
                    for (let i = 0; i < iNbDataTable; i++) {
                        await fonction.isDisplayed(parametrageCoeffProgression.inputdataTableAllInput.nth(i));
                    }
                }
            })

        })

        sNomOnglet = 'Impacts Calendaires';        
        test.describe('Onglet [' + sNomOnglet.toUpperCase() + ']', async () => {

            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'impactCalendaire', page);
            })

            test ('Input [FERMES LE DIMANCHE][n] - Is Visible', async () => {
                const iNbInput= await parametrageImpactsCalendaires.inputimpactCalendaireFermeDimanchePourcen.count();
                for (let i  = 0; i < iNbInput; i++) {
                    await fonction.isDisplayed(parametrageImpactsCalendaires.inputimpactCalendaireFermeDimanchePourcen.nth(i));
                }
            })

            test ('Input [OUVERTS LE DIMANCHE][n] - Is Visible', async () => {
                const iNbInput= await parametrageImpactsCalendaires.inputimpactCalendaireOuvertDimanchePourcen.count();
                for (let i  = 0; i < iNbInput; i++) {
                    await fonction.isDisplayed(parametrageImpactsCalendaires.inputimpactCalendaireOuvertDimanchePourcen.nth(i));
                }
            })

            test ('Button [ENREGISTER] - Is Disabled', async () => {
                await expect(parametrageImpactsCalendaires.buttonEnregistrer).toBeDisabled();
            })

        })

    })

    sNomPage = 'budgetsMagasin';
    test.describe ('Page [BUDGETS MAGASINS]', async () => {

        test ('Menu [' + sNomPage.toUpperCase() + '] - Click', async () => {
            await menu.click(sNomPage, page);
        })

        test ('List Box [EXPLOITATION][4] - Select', async () => {
            const aDirectionExploitations= sDirectionExploitation.split(',');
            await fonction.clickElement(budgetMagEcartMarge.listboxbmDirectionExploitation);
            await budgetMagEcartMarge.listboxbmDirectionExploitation.selectOption({label: aDirectionExploitations[3]})
        })

        test ('List Box [REGION][1] - Select', async () => {
            await fonction.clickElement(budgetMagEcartMarge.listboxbmRegion);
            await budgetMagEcartMarge.listboxbmRegion.selectOption({index:1})
        })

        test ('List Box [SECTEUR][1] - Select', async () => {
            await fonction.clickElement(budgetMagEcartMarge.listboxSecteur);
            await budgetMagEcartMarge.listboxSecteur.selectOption({index:1})
        })

        test ('List Box [MAGASIN][1] - Select', async () => {
            await fonction.clickElement(budgetMagEcartMarge.listboxbmMagasin);
            await budgetMagEcartMarge.listboxbmMagasin.selectOption({index:1})
        })
        
        test ('Button [TYPE DE SAISIE ][1] - Click', async () => {
            await fonction.clickAndWait(budgetMagEcartMarge.ButtontypeDeSaisie.nth(1), page);
        })

        test ('Input [ATTERISSAGE][1 à X] - Is enabled', async () => {
            const iNbInput:number= await budgetMagClients.inputFieldnombreAtterissage.count();
            for (let i  = 0; i < iNbInput; i++) {
                await expect(budgetMagClients.inputFieldnombreAtterissage.nth(i)).toBeEnabled();
            }
        })  

    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})