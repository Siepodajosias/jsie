/**
 * 
 * @author ABDOUL SARBA
 * @since 2025-06-17
 * 
 */

const xRefTest      = "PRE_PRE_SPT";
const xDescription  = "Scanner un support de préparation type tache";
const xIdTest       =  2832;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PREPARATION',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme','codePreparateur','codeTache'],
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
import { AurtresTacheDuJourPage }       from '@pom/PRE/travaux-taches_jour.page';

//------------------------------------------------------------------------------------
let page                     : Page;
let originalPage             : Page; 
let menu                     : MenuPreparation;
let pagePreparateur          : ProdGestionPreparateursPage;
let pageTravaux              : AurtresTacheDuJourPage;
//------------------------------------------------------------------------------------
const log                    = new Log();
const fonction               = new TestFunctions(log);
//------------------------------------------------------------------------------------
var sPlateforme              = fonction.getInitParam('plateforme', 'Cremcentre');
var sCodePreparateur         = fonction.getInitParam('codePreparateur', fonction.getLocalConfig('codePreparateur'));
var sCodeTache               = fonction.getInitParam('codeTache',fonction.getLocalConfig('codeTache'));
const sSeconde    :string    = "10 s";
//------------------------------------------------------------------------------------
var data={
    sDebutTache :'',
    sFinTache   :''
} 
// ------------------------------------------------------------------------------------
test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    originalPage    = page;                                 // Sauvegarde de l'onglet actuel pour plutard 
    menu            = new MenuPreparation(page, fonction);
    pagePreparateur = new ProdGestionPreparateursPage(page);
    pageTravaux     = new AurtresTacheDuJourPage(page);
    
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

        var pageName: string = 'menubadge';                /** La page SCAN D'UN BADGE pointe vers  sur un autre onglet du NAVIGATEUR  */
        test("Menu [SCAN BADGE] - Click", async () => {   //Je passe  à un autre onglet (page scan d'un badge) du NAGIVATEUR 
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
            await page.keyboard.press('Enter');                 // Je simule le bouton "Entrer" du clavier 
            await fonction.waitForDomStable(page);
        })

        test('H2 [TIMER EN S] = "' + sSeconde + '"', async () => {
            var iNbseconde: string = await pagePreparateur.timer.textContent();
            expect(iNbseconde).toBe(sSeconde);              // Je recupere la valeur du timer pour faire une comparaison 
        })

        test('Input [SUPPORT PREPARATION #1] = "' + sCodeTache + '"', async () => {
            await fonction.sendKeys(pagePreparateur.inputNumeroSupport, sCodeTache.toString(), false, 'Code Tache');
        })

        test('Key [ENTER #2] - Press', async () => {
            await page.keyboard.press('Enter');         // Je simule le bouton "Entrer" du clavier
        })

        test('** Wait Until Spinner Off **', async () => {
            await fonction.waitForSpinner(pagePreparateur.spinner);
        })
        test.describe('Popup [MODIFICATION DE LA FEUILLE]', async () => { // Si la popup d'erreur s'affiche on clique sur retour sinon on  saute l'execution de l'etape
            test('Button [RETOUR #1] - Click', async () => {
                const bIsDisplayed: boolean = await pagePreparateur.pPbuttonErrMatriculeRetour.isVisible();
                if (bIsDisplayed) {
                    await fonction.clickAndWait(pagePreparateur.pPbuttonErrMatriculeRetour, page);
                } else {
                    test.skip();
                }
            });
        }); // Fin onglet describe
        test('Table [FEUILLE  #1] - Is Displayed', async () => {
            await fonction.isDisplayed(pagePreparateur.datgridTdStatut);
        })

        test('Td [HEURE DEBUT #1] - Is Visible ', async () => {
            expect(pagePreparateur.datagridTdHeureDebut).toBeVisible();
            const sHeureDebut: string = await pagePreparateur.datagridTdHeureDebut.textContent();
            data.sDebutTache          = sHeureDebut;
        })

        test('Input [SUPPORT PREPARATION #2] = "' + sCodeTache + '"', async () => {
            await fonction.sendKeys(pagePreparateur.inputNumeroSupport, sCodeTache.toString(), false, 'Code Tache'); /** Je saisie à nouveau le code et re-verifie le statut  */
        })

        test('Key [ENTER #3] - Press', async () => {
            await page.keyboard.press('Enter');
            await fonction.waitForDomStable(page);
        });

        test('** Wait Until Spinner Off 1 **', async () => {
            await fonction.waitForSpinner(pagePreparateur.spinner);
        })

        test('Table [FEUILLE #2] - Is Displayed', async () => {
            await fonction.isDisplayed(pagePreparateur.datgridTdStatut);
        })

        test('** Wait Until Spinner Off  2 **', async () => {
            await fonction.waitForSpinner(pagePreparateur.spinner.first(),120000);
        })

        test('Td [HEURE DEBUT #2] - Is Visible', async () => {       
            expect(pagePreparateur.datagridTdHeureDebut).toBeVisible();
            const sHeureDebut: string = await pagePreparateur.datagridTdHeureDebut.textContent();  /** L'heure de debut de la noUvelle tache correspond à l'heure de fin de la tache precedente */
            data.sFinTache            = sHeureDebut;                           
        })
        
        test.describe('Popup [MODIFICATION DE LA FEUILLE]', async () => {
            test('Button [RETOUR #2] - Click', async () => { 
                const bIsDisplayed: boolean = await pagePreparateur.pPbuttonErrMatriculeRetour.isVisible(); // si la popup d'erreur s'affiche on clique sur retour sinon on saute 
                if (bIsDisplayed) {
                    await fonction.clickAndWait(pagePreparateur.pPbuttonErrMatriculeRetour, page);
                    log.set('Tache  préparé avec le code :' + sCodeTache);
                }else{
                    test.skip();
                }
            });
        }); // Fin onglet describe
       
        await fonction.writeData(data);
    }) // Fin onglet describe

    test.describe('Page [AUTRES TRAVAUX]', async () => {
        
         test('Page [SCAN BADGE] - Click', async () => {
            await page.close();                                      // Je ferme l'onglet actuel (SCAN BADGE) DU NAVIGATEUR
            log.set('Onglet SCAN BADGE fermé');           
        });

        var sNomPage = 'travaux';
        test('Page [AUTRES TRAVAUX] - Click', async () => {       /** Je reviens sur le premier onglet du NAVIGATEUR */ 
            page = originalPage;                                 // Réinitialiser les objets page avec le premier onglet
            menu = new MenuPreparation(page, fonction);
            await menu.click(sNomPage, page);
        })

        test('Input [CODE PREPARATEUR] = "' + sCodePreparateur + '"', async () => {
            await fonction.sendKeys(pageTravaux.dataGridInputCdeTache, sCodePreparateur, false, 'Code Preparateur');
        })

        test('Tr [TACHE] - Click', async () => {
            await fonction.clickElement(pageTravaux.dataGridThListeTaches.nth(-2));        //Je clique sur l'avant derniere ligne, car les lignes sont classés par ordre croissant
        })                                                                                // La derniere ligne correspond a une tache en cours

        test('Td [HEURE DEBUT][HEURE FIN] - Is Contained', async () => {
            const LigneTache                = pageTravaux.dataGridThListeTaches.nth(-2);
            const sTdHeureDebut: string     = await LigneTache.locator('td').nth(5).textContent(); 
            const sHeurefin    : string     = await LigneTache.locator('td').nth(6).textContent(); 

            expect(sTdHeureDebut.trim().replace(/\s/g, '')).toBe(data.sDebutTache.replace(/\s/g, '')); // je retire les espaces pour les comparer
            expect(sHeurefin.trim().replace(/\s/g, '')).toBe(data.sFinTache.replace(/\s/g, ''));

            log.set('Tache  préparé avec le code :' + sCodeTache);
            log.set('Status de la tache : Préparé');
        });

    }); // Fin onglet describe
    
    test('Déconnexion', async () => { 
        await fonction.deconnexion(page);   //Déconnexion
    })
})
