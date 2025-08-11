/**
 * 
 * @author ABDOUL SARBA
 * @since 2025-06-13
 * 
 */

const xRefTest      = "PRE_PRE_SFP";
const xDescription  = "Scanner un support de préparation type feuille à préparer";
const xIdTest       =  2026;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PREPARATION',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme','codePreparateur','codeFeuille'],
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

let page                           : Page;
let menu                           : MenuPreparation;
let pagePreparateur                : ProdGestionPreparateursPage;

//------------------------------------------------------------------------------------

const log                          = new Log();
const fonction                     = new TestFunctions(log);

//------------------------------------------------------------------------------------
var oData:any                      = fonction.importJdd(); //Import du JDD pour le bout en bout
//------------------------------------------------------------------------------------
var sPlateforme                    = fonction.getInitParam('plateforme', fonction.getLocalConfig('plateforme'));
var sCodeFeuille                   = fonction.getInitParam('codeFeuille',fonction.getLocalConfig('codeFeuille'));
var sCodePreparateur               = fonction.getInitParam('codePreparateur',fonction.getLocalConfig('codePreparateur'));

const sStatutFeuilleEnCour : string= 'En cours';
const sStatutFeuillePrepare: string= 'Préparé';
const sSeconde             : string= "10 s";
const iEmplacement         : string= "03";

//------------------------------------------------------------------------------------
if(oData !== undefined) {     
    sCodePreparateur = oData.sCodePreparateur       // On est dans le cadre d'un E2E. Récupération des données temporaires
    sCodeFeuille     = oData.sCodeFeuille
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
    }) // Fin onglet describe

    test.describe('Page [SCAN BADGE]', async () => {

        test('Img [SCANNER BADGE] - Is  Visible', async () => {
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
            await fonction.waitForDomStable(page);
        })

        test('H2 [TIMER EN S] = "' + sSeconde + '"', async () => {
            var iNbseconde: string = await pagePreparateur.timer.textContent();
            expect(iNbseconde).toBe(sSeconde);    // je recupere la valeur du timer pour faire une comparaison 
        })

        test('Input [SUPPORT PREPARATION #1] = "' + sCodeFeuille + '"', async () => {
            await fonction.sendKeys(pagePreparateur.inputNumeroSupport, sCodeFeuille.toString(), false, 'Code Feuille');
        })

        test('Key [ENTER #2] - Press', async () => {
            await page.keyboard.press('Enter');      // Je simule le bouton "Entrer" du clavier
            await fonction.waitForDomStable(page);
        })

        test('** Wait Until Spinner Off **', async () => {
            await fonction.waitForSpinner(pagePreparateur.spinner);
        })

        test('Table [FEUILLE #1] - Is Displayed', async () => {
            await fonction.isDisplayed(pagePreparateur.datgridTdStatut);
        })

        test('Td [STATUT FEUILLE #1] = "' + sStatutFeuilleEnCour + '"', async () => {
            expect(await pagePreparateur.datgridTdStatut.textContent()).toBe(sStatutFeuilleEnCour)
        })

        
        test('Input [SUPPORT PREPARATION #2] = "' + sCodeFeuille + '"', async () => {
            await fonction.sendKeys(pagePreparateur.inputNumeroSupport, sCodeFeuille.toString(), false, 'Code Feuille'); /** Je saisie à nouveau le code et re-verifie le statut  */
        })

        test('Key [ENTER #3] - Press', async () => {
            await page.keyboard.press('Enter');         // Je simule le bouton "Entrer" du clavier
            await fonction.waitForDomStable(page);
        });

        test('** Wait Until Spinner Off 1 **', async () => {
            await fonction.waitForSpinner(pagePreparateur.spinner,12000);
        })

        test('Table [FEUILLE #2] - Is Displayed', async () => {
            await fonction.isDisplayed(pagePreparateur.datgridTdStatut);
        })
                 
        test('Input [EMPLACEMENT] = "' + iEmplacement + '"', async () => {                     /** Pour certains articles le stock de fin n'est pas egal 0, du coup un champ d'emplacement est affiché */
            const bIsDisplayed: boolean = await pagePreparateur.InputEmplacement.isVisible(); // si emplacement est affiché je saisie l'emplacement sinon je saute cette etape de l'execution
            if (bIsDisplayed) {
                await fonction.sendKeys(pagePreparateur.InputEmplacement, iEmplacement, false, 'Emplacement');
                await fonction.clickAndWait(pagePreparateur.emplacementItem.first(),page);
                log.set('Emplacement choisi: ' + iEmplacement);
            } else {
                test.skip();
            }
        })

        test('Button [VALIDER] - Click', async () => {                                      // Je clic sur le bouton "Valider" s'il est affiché sinon je saute l'execution
            const bIsDisplayed: boolean = await pagePreparateur.InputEmplacement.isVisible();
            if (bIsDisplayed) {
                await fonction.clickAndWait(pagePreparateur.buttonValider, page)
            } else {
                test.skip();
            }
        });

        test('** Wait Until Spinner Off  2 **', async () => {
            await fonction.waitForSpinner(pagePreparateur.spinner.first(),12000);
        })

        test('Td [STATUT FEUILLE  #2] = "' + sStatutFeuillePrepare + '"', async () => {       
            expect(await pagePreparateur.datgridTdStatut.textContent()).toBe(sStatutFeuillePrepare)
        })
         
        test.describe('Popup [MODIFICATION DE LA FEUILLE]', async () => { // Si la popup d'erreur s'affiche on clique sur retour sinon on  saute l'execution de l'etape
            test('Button [RETOUR] - Click', async () => { 
                const bIsDisplayed: boolean = await pagePreparateur.pPbuttonErrMatriculeRetour.isVisible();
                if (bIsDisplayed) {
                    await fonction.clickAndWait(pagePreparateur.pPbuttonErrMatriculeRetour, page);
                    log.set('Feuille  préparé avec le code :' + sCodeFeuille);
                }else{
                    test.skip();
                }
            });
        }); // Fin onglet describe
    })  // Fin onglet describe

    /** Pas de bouton de déconnexion pour la page de scan Pour SIGALE PREPARATION  */
})
