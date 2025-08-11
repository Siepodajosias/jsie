/**
 * @desc Edition et affectation des magasins pour les stratégies permanentes
 * 
 * @author SIAKA KONE
 *  Since 2024-10-08
 */

const xRefTest      = "PRI_MAG_ESP";
const xDescription  = "Edition et affectation des magasins pour les stratégies permanentes";
const xIdTest       =  9493;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRI',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon','groupeMagasin'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, expect, type Page }  from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';

import { GestionsMagasinPage }      from '@pom/PRI/gestions_magasins.page';
import { MenuPricing }              from '@pom/PRI/menu.page.js';

import { CartoucheInfo }            from '@commun/types';

//----------------------------------------------------------------------------------------

let page        : Page;
let menuPage    : MenuPricing;

let pageGestMag : GestionsMagasinPage;

const log       = new Log();
const fonction  = new TestFunctions(log);

//----------------------------------------------------------------------------------------
const sRayon    = fonction.getInitParam('rayon','Fruits et légumes');
const sNomGrp   = fonction.getInitParam('groupeMagasin','Tous GF');

var iNbreMag:number;

//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menuPage        = new MenuPricing(page, fonction);
    pageGestMag     = new GestionsMagasinPage(page, fonction);
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

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [GESTION DES MAGASINS]', async () => {    

        test ('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menuPage.selectRayonByName(sRayon, page);               // Sélection du rayon
            log.set('Rayon : ' + sRayon);
        })

        test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })

        test ('Onglet [GROUPE DE MAGASINS] - Click', async () => {
            await menuPage.click('gestion', page);
        })

        test ('Td [NOM DU GROUPE] > 0', async () => {
            expect(await pageGestMag.tdNomMagasinSelectionnable.count()).toBeGreaterThan(0);
        })

        test ('InputField [NOM DU GROUPE] = "' + sNomGrp + '"', async () => {
            await fonction.sendKeys(pageGestMag.inputNomGroupeMag, sNomGrp, false, 'Nom groupe magasin');
        })

        test ('Td [NOM DU GROUPE] = "' + sNomGrp + '"', async () => {
            expect(await pageGestMag.tdNomMagasinSelectionnable.first().textContent()).toBe(sNomGrp);
        })

        test ('Td [NOM DU GROUPE][0] #1 - Click', async () => {
            await fonction.clickElement(pageGestMag.tdNomMagasinSelectionnable.first());
        })

        test ('IconPencil [MODIFIER] #1 - click', async () => {
            await fonction.clickAndWait(pageGestMag.buttonModifGrpMagasin, page);
        })

        //-- On s'assure que le groupe possède bien les bonnes règles d'appartenance
        var sNomPopin:string = 'Edition du groupe "' + sNomGrp + '" (permanent) #1';
        test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

            test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            }) 

            test ('Listbox [ENSEIGNE] = "Autres"', async () => {
                await pageGestMag.setRegleAppartenance('Enseigne', 'Autres');
            })

            test ('Listbox [STRATEGIE] = "Discount"', async () => {
                await pageGestMag.setRegleAppartenance('Stratégie', 'Discount');
            })

            test ('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageGestMag.pButtonGroupeEnregistrer, page);
            })

            test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            }) 

        })

        //--Affichage des magasins selectionnés
        test ('Button [SELECTIONNES] - Click', async () => {
            await fonction.clickAndWait(pageGestMag.buttonSelectionnes, page);
        })

        //-- Vérifier que les magasins selectionnés sont surlignés et cochés;
        test ('Tr [MAGASINS] - Check', async () => {
            iNbreMag  = await pageGestMag.dataListeMagasinSelectable.count();
            for(let i = 0; i < iNbreMag; i++){
                //log.set('Ligne sélectionnée : ' + i);
                await expect(pageGestMag.dataListeMagasinSelectable.nth(i)).toHaveAttribute('data-p-highlight', 'true');
            }
        })

        //Vérifier qu'on ne peut pas les décocher;
        test ('Tr [MAGASIN] - Not Selectable', async () => {
            for(let i = 0; i < iNbreMag; i++){
                //log.set('Ligne non selectionnable 0 : ' + i);
                await expect(pageGestMag.dataListeMagasinSelectable.nth(i)).toHaveClass(/ligne-non-selectionnable/);
            }
        })

        //--Affichage des magasins non selectionnés
        test ('Button [NON SELECTIONNES] - Click', async () => {
            await fonction.clickAndWait(pageGestMag.buttonSelectionnes, page);//Déselectionner le bouton selectionnes;
            await fonction.clickAndWait(pageGestMag.buttonNonSelectionnes, page);
        })

        //-- Vérifier que les magasins ne sont pas cochés;
        test ('Tr [MAGASIN] #1 - Check', async () => {
            iNbreMag  = await pageGestMag.dataListeMagasinSelectable.count();
            for(let i = 0; i < iNbreMag; i++){
                //log.set('Ligne non cochée : ' + i);
                await expect(pageGestMag.dataListeMagasinSelectable.nth(i)).toHaveAttribute('data-p-highlight', 'false');
            }
        })

        //Vérifier qu'on ne peut pas les cocher;
        test ('Tr [MAGASIN] #1 - Not Selectable', async () => {
            for(let i = 0; i < iNbreMag; i++){
                //log.set('Ligne non selectionnable : ' + i);
                await expect(pageGestMag.dataListeMagasinSelectable.nth(i)).toHaveClass(/ligne-non-selectionnable/);
            }
        })

        test ('Td [NOM DU GROUPE][0] #2 - Click', async () => {
            await fonction.clickElement(pageGestMag.tdNomMagasinSelectionnable.first());
        })

        test ('IconPencil [MODIFIER] #2 - click', async () => {
            await fonction.clickAndWait(pageGestMag.buttonModifGrpMagasin, page);
        })

        var sNomPopin:string = 'Edition du groupe "' + sNomGrp + '" (permanent) #2';
        test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

            test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            }) 

            //Vérifier qu'on ne peut pas modifier ni le nom, ni la description , ni le type de groupe
            test ('InputField [NOM] = "' + sNomGrp + '" - Disabled', async () => {
                await expect(pageGestMag.pInputGroupeNom).toBeDisabled();
            })

            test ('InputField [DESCRIPTION] - Disabled', async () => {
                await expect(pageGestMag.pInputGroupeDescription).toBeDisabled();
            })

            test ('Button [REGLES D\'APPARTENANCE] - Disabled', async () => {
                await expect(pageGestMag.pPButtonRegleAppartenance).toHaveClass(/p-disabled/);
            })

            test ('Button [ANNULER] - Click', async () => {
                await fonction.clickAndWait(pageGestMag.pButtonGroupeAnnuler, page);
            })

            test ('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            }) 

        })

    })  //-- End Describe Page

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})