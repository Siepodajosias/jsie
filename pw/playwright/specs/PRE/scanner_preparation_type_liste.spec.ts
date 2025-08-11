/**
 * 
 * @author ABDOUL SARBA
 * @since 2025-06-13
 * 
 */

const xRefTest      = "PRE_PRE_SPL";
const xDescription  = "Scanner un support de préparation type liste à servir";
const xIdTest       =  2026;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PREPARATION',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme','codePreparateur','codeListeServir'],
    fileName    : __filename
}

//------------------------------------------------------------------------------------

import { expect, test, type Page }      from '@playwright/test';

import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';

import { MenuPreparation }              from '@pom/PRE/menu.page';

import { CartoucheInfo }                from '@commun/types';
import { ProdGestionPreparateursPage }  from '@pom/PRE/preparateur.page';

//------------------------------------------------------------------------------------

let page                          : Page;
let menu                          : MenuPreparation;
let pagePreparateur               : ProdGestionPreparateursPage;

//------------------------------------------------------------------------------------

const log                         = new Log();
const fonction                    = new TestFunctions(log);

//------------------------------------------------------------------------------------
var oData:any                     = fonction.importJdd(); //Import du JDD pour le bout en bout
//------------------------------------------------------------------------------------
var sPlateforme                   = fonction.getInitParam('plateforme',fonction.getLocalConfig('plateforme'));
var sCodePreparateur              = fonction.getInitParam('codePreparateur',fonction.getLocalConfig('codePreparateur'));
var sCodeListeAservice            = fonction.getInitParam('codeListeServir',fonction.getLocalConfig('codeListeServir'));

const sStatutListePrepare: string = 'Préparé';
const sStatutListeEnCours: string = 'En cours';
const sSeconde           :string  = "10 s";
//------------------------------------------------------------------------------------
if(oData !== undefined) {
    sCodePreparateur   = oData.sCodePreparateur                                  // On est dans le cadre d'un E2E. Récupération des données temporaires
    sCodeListeAservice = oData.sCodeListeAservice
} 
// ------------------------------------------------------------------------------------
test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuPreparation(page, fonction);
    pagePreparateur = new ProdGestionPreparateursPage(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async () => {
        await fonction.openUrl(page);
    })

    test('Connexion', async ({ context }) => {
        await context.clearCookies();
        await fonction.connexion(page);
    })

    test.describe('Page [ACCUEIL]', async () => {

        test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {
            await menu.selectPlateforme(sPlateforme, page);
            log.set('Plateforme : ' + sPlateforme);
        });

        var pageName: string = 'menubadge';                    /** La page SCAN D'UN BADGE pointe vers  sur un autre onglet du NAVIGATEUR  */
        test("Menu [SCAN BADGE] - Click", async () => {       //Je passe  à un autre onglet (page scan d'un badge) du NAGIVATEUR
            const [newPage] = await Promise.all([
                page.context().waitForEvent('page'),
                menu.click(pageName, page)
            ]);

            await newPage.waitForLoadState();
            page            = newPage;
            pagePreparateur = new ProdGestionPreparateursPage(page);
        });
    })

    test.describe('Page [SCAN BADGE]', async () => {

        test('Img [SCANNER BADGE] - Is Visible', async () => {
            await fonction.isDisplayed(pagePreparateur.iconsPreparations.nth(0));
        })

        test('Img [ENTRE CODE] - Is Visible', async () => {
            await fonction.isDisplayed(pagePreparateur.iconsPreparations.nth(1));
        })

        test('InputField [CODE PREPARATEUR] = "' + sCodePreparateur + '"', async () => {
            await fonction.sendKeys(pagePreparateur.inputCodeIdentification, sCodePreparateur, false, 'Matricule Preparateur');
        })

        test('Key [ENTER #1] - Press', async () => {
            await page.keyboard.press('Enter');      // Je simule le bouton "Entrer" du clavier 
            await fonction.waitForDomStable(page)
        })

        test('H2 [TIMER EN S] = "' + sSeconde + '"', async () => {
            var sNbseconde: string = await pagePreparateur.timer.textContent();
            expect(sNbseconde).toBe(sSeconde);    // je recupere la valeur du timer pour faire une comparaison 
        })

        test('Input [SUPPORT PREPARATION #1] = "' + sCodeListeAservice + '"', async () => {
            await fonction.sendKeys(pagePreparateur.inputNumeroSupport, sCodeListeAservice.toString(), false, 'Code Liste');
        })

        test('Key [ENTER #2] - Press', async () => {
            await page.keyboard.press('Enter');      // Je simule le bouton "Entrer" du clavier
            await fonction.waitForDomStable(page);
        })

        test('** Wait Until Spinner Off **', async () => {
            await fonction.waitForSpinner(pagePreparateur.spinner);
        })

        test('Table [LISTE A SERVIR #1] - Is Displayed', async () => {
            await fonction.isDisplayed(pagePreparateur.datgridTdStatut);
        })

        test('Td [STATUT LISTE A SERVIR #1] = "' + sStatutListeEnCours + '"', async () => {
            expect(await pagePreparateur.datgridTdStatut.textContent()).toBe(sStatutListeEnCours)
        })

        /** Je saisie à nouveau le code et reverifie le statut  */
        test('Input [SUPPORT PREPARATION #2] = "' + sCodeListeAservice + '"', async () => {
            await fonction.sendKeys(pagePreparateur.inputNumeroSupport, sCodeListeAservice.toString(), false, 'Code Liste');
        })

        test('Key [ENTER #3] - Press', async () => {
            await page.keyboard.press('Enter');         // Je simule le bouton "Entrer" du clavier
            await fonction.waitForDomStable(page);
        });

        test('** Wait Until Spinner Off 1 **', async () => {
            await fonction.waitForSpinner(pagePreparateur.spinner);
        })

        test('Table [LISTE A SERVIR #2] - Is Displayed', async () => {
            await fonction.isDisplayed(pagePreparateur.datgridTdStatut);
        })

        test('Td [STATUT LISTE A SERVIR #2] = "' + sStatutListePrepare + '"', async () => {       
            expect(await pagePreparateur.datgridTdStatut.textContent()).toBe(sStatutListePrepare)
        })
        
        test.describe('Popup [MODIFICATION DE LA FEUILLE]', async () => {
            test('Button [RETOUR] - Click', async () => {
                await fonction.clickAndWait(pagePreparateur.pPbuttonErrMatriculeRetour, page);
                log.set('Listes à servir préparé avec le code :' + sCodeListeAservice);
            });
        }); // Fin du describe
    })     // Fin du describe

    /** Pas de bouton de déconnexion pour la page de scan Pour SIGALE PREPARATION  */
})
