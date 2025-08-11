/**
 * 
 * @author ABDOUL SARBA
 * @since 2025-04-28
 * 
 */

const xRefTest     = "BUD_PCO_CEP";
const xDescription = "Copier le périmètre constant de l'exercice précédent";
const xIdTest      = 7045;
const xVersion     = '3.3.1';

var info: CartoucheInfo = {
    desc        : xDescription,
    appli       : 'BUDGET',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Step 3/6', 'Pipeline_BUD - E2E_Création du nouvel exercice avec atterrissage'],
    params      : [],
    fileName    : __filename
};

import { test,  type Page }            from '@playwright/test';

import { CartoucheInfo }               from '@commun/types';

import { Help }                        from '@helpers/helpers';
import { TestFunctions }               from '@helpers/functions';
import { Log }                         from '@helpers/log';

import { MenuBudgets }                 from '@pom/BUD/menu.page';
import { Accueil }                     from '@pom/BUD/accueil.page';
import { ParametragePerimetreConstant} from '@pom/BUD/parametrage_perimetre_constant.page';
import { Admin }                       from '@pom/BUD/admin.page';
import { AdminActions }                from '@pom/BUD/admin_actions.page';

//----------------------------------------------------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuBudgets;
let pageAdmin       : Admin;
let pageAdminActions: AdminActions;
let accueil         : Accueil;
let paramPerim      : ParametragePerimetreConstant;

const log           = new Log();
const fonction      = new TestFunctions(log);

//---------------------------------------------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuBudgets(page, fonction);
    pageAdmin       = new Admin(page);
    pageAdminActions= new AdminActions(page);
    accueil         = new Accueil(page);
    paramPerim      = new ParametragePerimetreConstant(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({ }, testInfo) => {
    await fonction.close(testInfo);
})

//---------------------------------------------------------------------------------------------------------------------------------
test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [PARAMETRAGE]', async () => {

        var sNomPage:string = 'parametrage';
        test ('Menu [' + sNomPage.toUpperCase() + '] - Click', async () => {
            await menu.click(sNomPage, page);
        })

        test.describe ('Onglet [PERIMETRE CONSTANT]', async () => {

            var sNomOnglet:string = 'Perimetre Constant';
            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'perimetreConstant', page);
            })

            test ('Button [COPIER L\'EXERCICE yyyy] - Click', async () => {
                const sMessage = await paramPerim.buttonCopierExercice.textContent();
                const iAnneeExercice = sMessage?.match(/\d{4}/);
                log.set('Année de l\'exercice à copier : ' + iAnneeExercice);
                await fonction.clickElement(paramPerim.buttonCopierExercice);
            })

            test ('Button [CONFIRMER LA COPIE] - Click', async () => {
                await fonction.clickAndWait(paramPerim.pButtonConfCopieExercice,page);
            })

        })

    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    }) 

})