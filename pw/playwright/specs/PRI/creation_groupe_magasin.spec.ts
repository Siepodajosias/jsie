/**
 * @desc Création d'un groupe de magasin
 * 
 * @author SIAKA KONE
 *  Since 2024-04-17
 */

const xRefTest      = "PRI_MAG_GRP";
const xDescription  = "Création d'un groupe de magasins avec saisie manuelle";
const xIdTest       =  352;
const xVersion      = '3.4';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRICING',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, expect, type Page }  from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';

import { GestionsMagasinPage }      from '@pom/PRI/gestions_magasins.page';
import { MenuPricing }              from '@pom/PRI/menu.page';
import { CartoucheInfo }            from '@commun/types';

//----------------------------------------------------------------------------------------

let page        : Page;
let menuPage    : MenuPricing;

let pageGestMag : GestionsMagasinPage;

const log       = new Log();
const fonction  = new TestFunctions(log);
const maDate    = new Date();

//----------------------------------------------------------------------------------------
const sRayon    = fonction.getInitParam('rayon','Crèmerie');
const sCodeMag  = fonction.getInitParam('listeMagasins','FL718CR,GC432CR,GC198CR,GC437CR,GC211CR');//-- Liste des magasins à selectionner;

const aCodeClient   = sCodeMag.split(',');
const sNomGrp       = 'TEST-AUTO_GrpMag-' + fonction.getToday('us') + '_' + maDate.getHours();
const sDescGrp      = 'TEST-AUTO_GrpMag-' + fonction.getToday('us') + '_' + maDate.getHours() + ' Descrptif';
const iCalculPvc    = 8;
const rMargePlate   = 8.8;
const rFraisLiv     = 8.88;

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menuPage        = new MenuPricing(page, fonction);
    pageGestMag     = new GestionsMagasinPage(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [GESTION DES MAGASINS]', async () => {    

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menuPage.selectRayonByName(sRayon, page);               // Sélection du rayon
            log.set('Rayon : ' + sRayon);
        })

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })

        test('Onglet [GROUPE DE MAGASINS] - Click', async () => {
            await menuPage.click('gestion', page);
        })

        test('Button [CREER UN GROUPE DE MAGASIN] - Click', async () => {
            await fonction.clickAndWait(pageGestMag.buttonCreerGroupeMagasin, page);
        })

        var sNomPopin:string = 'CREATION D\'UN GROUPE';

        test.describe('Popin [' + sNomPopin + ']', async () => {

            test('Popin [' + sNomPopin + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            }) 

            test('Button [SELECTION MANUELLE] - Check', async () => {
                await expect(pageGestMag.pPButtonSelectionManuelle).toHaveAttribute('aria-checked',"true");
            })

            test('Button [ENREGISTRER] - Is Disabled', async () => {
                await expect(pageGestMag.pButtonGroupeEnregistrer).toBeDisabled();
            })

            test('InputField [NOM] ="' + sNomGrp + '"', async () => {
                await fonction.sendKeys(pageGestMag.pInputGroupeNom, sNomGrp, false, 'Nom groupe magasin');
            })

            test('InputField [DESCRIPTION] ="' + sDescGrp + '"', async () => {
                await fonction.sendKeys(pageGestMag.pInputGroupeDescription, sDescGrp, false, 'Description groupe magasin');
            })

            test('InputField [CALCUL PVC] ="' + iCalculPvc + '"', async () => {
                await fonction.sendKeys(pageGestMag.pInputGroupeTauxCalculPVC, iCalculPvc, false, 'pvc');
            })

            test('InputField [MARGE PLATEFORME] ="' + rMargePlate + '"', async () => {
                await fonction.sendKeys(pageGestMag.pInputGroupeMargePlateforme, rMargePlate, false, 'Marge plateforme');
            })

            test('InputField [FRAIS LIVRAISON] ="' + rFraisLiv + '"', async () => {
                await fonction.sendKeys(pageGestMag.pInputGroupeFraisLivraison, rFraisLiv, false, 'Frais livraison');
            })

            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageGestMag.pButtonGroupeEnregistrer, page);
            })

            test('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            })
        })

        test('InputField [NOM DU GROUPE] = "' + sNomGrp + '"', async () => {
            await fonction.sendKeys(pageGestMag.inputNomGroupeMag, sNomGrp, false, 'Nom groupe magasin');
            await fonction.wait(page, 500); // Attendre que le filtre s'applique;
        })

        test('Td [NOM DU GROUPE] ="' + sNomGrp + '" - Check', async () => {
            expect(await pageGestMag.tdNomMagasinSelectionnable.first().textContent()).toBe(sNomGrp);
        })

        test('Td [NOM DU GROUPE][first] - Click', async () => {
            await fonction.clickAndWait(pageGestMag.tdNomMagasinSelectionnable.first(), page);
        })

        //--- Vérifier qu'aucun magasin n'est selectionné;
        test('Label [NBRE MAGASINS SELECTIONNES] - Check', async () => {
            expect((await pageGestMag.theadNombreMagasinSelectionne.textContent()).trim()).toBe("");
        })

        //-- Vérifier que le checkBox n'est pas coché; 'p-checkbox-box p-highlight';
        test('CheckBox [MAGASINS (TOUS LES MAGASINS)] - Check', async () => {
            await expect(pageGestMag.theadCheckBoxAllMagasin).not.toHaveClass('p-checkbox-box p-highlight');
        })

        aCodeClient.forEach((sCode:string) => {
            test('CheckBox [' + sCode + ']', async () => {
                await fonction.clickElement(pageGestMag.tdCodeClient.filter({hasText:sCode}));
            })

            //-- Vérifier que les magasins selectionnés sont surlignés;
            test('Tr [MAGASIN] = "' + sCode + '" - Check', async () => {
                const tdLigneSelectionnes =  pageGestMag.dataListeMagasinSelectable.filter({ hasText: sCode });
                await expect(tdLigneSelectionnes).toHaveAttribute('data-p-highlight', 'true');
            })
        })

        test('Label [NBRE MAGASINS SELECTIONNES] #1 - Check', async () => {
            expect((await pageGestMag.theadNombreMagasinSelectionne.textContent()).trim()).toBe(aCodeClient.length.toString());
        })

        test('Button [ASSOCIER LES MAGASINS AU GROUPE] - Click', async () => {
            await fonction.clickAndWait(pageGestMag.buttonAssocierMagasin, page);
        })

         //--- Vérifier que tous les magasins selectionnés ont été déselectionné;
        test('Label [NBRE MAGASINS SELECTIONNES] #2 - Check', async () => {
            expect((await pageGestMag.theadNombreMagasinSelectionne.textContent()).trim()).toBe("");
        })

        //--- Vérifier que le groupe de magasin est déselectionné;
        test('Tr [GROUPE DE MAGASIN] = "' + sNomGrp + '" - Check', async () => {
            await fonction.sendKeys(pageGestMag.inputNomGroupeMag, sNomGrp, false, 'Nom groupe magasin');
            await fonction.wait(page, 500); // Attendre que le filtre s'applique;
            await expect(pageGestMag.dataListeGroupeMagSelectable.first()).not.toHaveAttribute('data-p-highlight', 'true');
        })

        //--Selection à nouveau du groupe magasin;
        test('InputField [NOM DU GROUPE] #1 = "' + sNomGrp + '"', async () => {
            await fonction.sendKeys(pageGestMag.inputNomGroupeMag, sNomGrp, false, 'Nom groupe magasin');
            await fonction.wait(page, 500); // Attendre que le filtre s'applique;
        })

        test('Td [NOM DU GROUPE][0] #1 - Click', async () => {
            await fonction.clickElement(pageGestMag.dataListeGroupeMagSelectable.first());
        })

        //--Affichage des magasin selectionnés
        test('Button [SELECTIONNES] - Click', async () => {
            await fonction.clickAndWait(pageGestMag.buttonSelectionnes, page);
        })

        //-- Vérifier que le checkBox est coché; 'p-checkbox-box p-highlight';
        test('CheckBox [MAGASINS (TOUS LES MAGASINS)] #1 - Check', async () => {
            await expect(pageGestMag.theadCheckBoxAllMagasin).toHaveClass('p-checkbox-box p-highlight');
        })

        //-- Vérifier que les magasins selectionnés sont surlignés;
        aCodeClient.forEach((sCode:string) => {
            test('Tr [MAGASIN] #1 = "' + sCode + '" - Check', async () => {
                const tdLigneSelectionnes =  pageGestMag.dataListeMagasinSelectable.filter({hasText:sCode});
                await expect(tdLigneSelectionnes).toHaveAttribute('data-p-highlight', 'true');
            })
        })

        test('Label [NBRE MAGASINS SELECTIONNES] #3 - Check', async () => {
            expect((await pageGestMag.theadNombreMagasinSelectionne.textContent()).trim()).toBe(aCodeClient.length.toString());
        })

    })  //-- End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})