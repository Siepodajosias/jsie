/**
 * @desc Cas des magasins en tarification automatique
 * 
 * @author SIAKA KONE
 *  Since 2024-10-09
 */

const xRefTest      = "PRI_MAG_MTA";
const xDescription  = "Cas des magasins en tarification automatique";
const xIdTest       =  9493;
const xVersion      = '3.4';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRICING',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon','groupeMagasin','listeMagasins'],
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

const sNomGroupeMg  = 'TA_groupe_mag. ' + fonction.getToday('FR');

const sRayon        = fonction.getInitParam('rayon','Fruits et légumes');
const sNomGrp       = fonction.getInitParam('groupeMagasin', sNomGroupeMg);
const sCodeMag      = fonction.getInitParam('listeMagasins','G003701FL');//-- Code magasin (bellecote);

var iNbreMag:number;

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

        //--Vérifier que des magasins sont affichés;
        test('Td [NOM DU GROUPE] > 0', async () => {
            expect(await pageGestMag.tdNomMagasinSelectionnable.count()).toBeGreaterThan(0);
        })

        //--Modifier le magasin afin qu'il ne soit plus en tarification automatique;
        test('InputField [CODE] = "' +sCodeMag  + '"', async () => {
            await fonction.sendKeys(pageGestMag.theadInputCodeMagasin, sCodeMag, false, 'Code magasin');
        })

        test('Icon [TARIFICATION AUTOMATIQUE] - Click', async () => {
            var bIsvisible = await pageGestMag.theadIconTarifAuto.isVisible();
            if(!bIsvisible){
                await pageGestMag.dataListeMagasinSelectable.hover();
                await fonction.clickAndWait(pageGestMag.buttonModifMagasin, page);
    
                await fonction.clickElement(pageGestMag.pCheckBoxTarifNonAutomatique);
                await fonction.clickAndWait(pageGestMag.pButtonMagasinEnregistrer, page);
            }
        })  

        test('** Wait Until Spinner Off **', async () => {
            await fonction.waitForSpinner(pageGestMag.pSpinnerOn.first());
        }) 

        test('CheckBox [TARIFICATION AUTOMATIQUE] - Click', async () => {
            await fonction.clickElement(pageGestMag.theadCheckBoxTarifAuto);
        })

        test('IconPencil [MODIFIER MAGASIN] - click', async () => {
            await pageGestMag.dataListeMagasinSelectable.hover();
            await fonction.clickAndWait(pageGestMag.buttonModifMagasin, page);
        })

        var sNomPopin:string = 'Modification du magasin';
        test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            }) 

            test('CheckBox [TARIFICATION AUTOMATIQUE] - Click', async () => {
                await fonction.clickElement(pageGestMag.pCheckBoxTarifAutomatique);
            })

            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageGestMag.pButtonMagasinEnregistrer, page);
            })

            test('** Wait Until Spinner Off **', async () => {
                await fonction.waitForSpinner(pageGestMag.pSpinnerOn.first());
            }) 

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            }) 
        })

        //--Vérifier que le magasin MAG1 n'est plus en tarification automatique;
        test('Tr [MAGASIN] = 0', async () => {
            expect(await pageGestMag.dataListeMagasinSelectable.count()).toEqual(0);
        })

        //-- Slection du groupe de magasin ayant des règles d'appartenance;
        test('InputField [NOM DU GROUPE] = "' + sNomGrp + '"', async () => {
            await fonction.sendKeys(pageGestMag.inputNomGroupeMag, sNomGrp, false, 'Nom groupe magasin');
        })

        test('Td [NOM DU GROUPE] ="' + sNomGrp + '" - Check', async () => {
            expect(await pageGestMag.tdNomMagasinSelectionnable.first().textContent()).toBe(sNomGrp);
        })

        test('Td [NOM DU GROUPE][0] - Click', async () => {
            await fonction.clickElement(pageGestMag.tdNomMagasinSelectionnable.first());
        })

        //-- Modification du groupe de magasin ayant des règles d'appartenance;
        test('IconPencil [MODIFIER] - click', async () => {
            await fonction.clickAndWait(pageGestMag.buttonModifGrpMagasin, page);
        })

        var sNomPopin:string = 'Edition du groupe "' + sNomGrp + '" (permanent)';
        test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            }) 

            var sCritere:string = 'égal à';
            test('ListBox [FILIERE] = "'+ sCritere + '"', async () => {
                var iNbrCritere:number = await pageGestMag.pPdropdownCritereLabel.locator('span.label-critere').count();
                for(let i=0; i<iNbrCritere; i++) {
                    if(await pageGestMag.pPdropdownCritereLabel.locator('span.label-critere').nth(i).textContent() == 'Plateforme'){
                        await fonction.clickElement(pageGestMag.pPdropdownCritereTypeComparaison.locator('.p-dropdown-trigger').nth(i));
                        await fonction.clickElement(pageGestMag.pPmultiselectItemFiliere.locator('span:text-is("'+sCritere+'")'));
                    }
                }
            })
                
            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageGestMag.pButtonGroupeEnregistrer, page);
            })

            test('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            }) 
        })

        //--- Vérifier que le groupe de magasin n'est plus selectionné;
        test('Tr [GROUPE DE MAGASIN] = "' + sNomGrp + '" - Check', async () => {
            await fonction.sendKeys(pageGestMag.inputNomGroupeMag, sNomGrp, false, 'Nom groupe magasin');
            await expect(pageGestMag.dataListeGroupeMagSelectable.first()).toHaveAttribute('data-p-highlight', 'false');
        })

        //-- Selection à nouveau du même groupe magasin;
        test('Td [NOM DU GROUPE][0] #1 - Click', async () => {
            await fonction.clickElement(pageGestMag.tdNomMagasinSelectionnable.first());
        })

        //--Annuler le filtre sur les tarifications automatiques;
        test('CheckBox [TARIFICATION AUTOMATIQUE] - UnClick', async () => {
            await fonction.clickElement(pageGestMag.theadCheckBoxTarifAuto);
            await pageGestMag.theadInputCodeMagasin.clear();
        })

        //--Affichage des magasins selectionnés
        test('Button [SELECTIONNES] - Click', async () => {
            await fonction.clickAndWait(pageGestMag.buttonSelectionnes, page);
        })

        //-- Vérifier que les magasins selectionnés sont surlignés et cochés;
        test('Tr [MAGASINS] - Check', async () => {
            iNbreMag  = await pageGestMag.dataListeMagasinSelectable.count();
            for(let i = 0; i < iNbreMag; i++){
                log.set('Ligne sélectionnée first: ' + i);
                await expect(pageGestMag.dataListeMagasinSelectable.nth(i)).toHaveAttribute('data-p-highlight', 'true');
                await fonction.isDisplayed(pageGestMag.checkBoxMagasins.nth(i));//Magasin coché
            }
        })

        //-- Vérifier que je retrouve le magasin MAG1
        test('InputField [CODE] #1 = "' +sCodeMag  + '"', async () => {
            await fonction.sendKeys(pageGestMag.theadInputCodeMagasin, sCodeMag, false, 'Code magasin');
        })

        test('Td [CODE MAGASIN] = "' + sCodeMag + '" - Is Visible', async () => {
            await fonction.isDisplayed(pageGestMag.dataListeMagasinSelectable.filter({hasText:sCodeMag}));
        })
        
        //-- Modifier le magasin MAG1 de manière à ce qu'il devienne à nouveau en tarification automatique;
        test('IconPencil [MODIFIER MAGASIN] #1 - click', async () => {
            await pageGestMag.dataListeMagasinSelectable.hover();
            await fonction.clickAndWait(pageGestMag.buttonModifMagasin, page);
        })

        var sNomPopin:string = 'Modification du magasin';
        test.describe('Popin [' + sNomPopin.toUpperCase() + '] #1', async () => {

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            }) 

            //-- Mettre en tarification automatique;
            test('CheckBox [TARIFICATION AUTOMATIQUE] - Click', async () => {
                await fonction.clickElement(pageGestMag.pCheckBoxTarifNonAutomatique);
            })

            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageGestMag.pButtonMagasinEnregistrer, page);
            })

            test('** Wait Until Spinner Off **', async () => {
                await fonction.waitForSpinner(pageGestMag.pSpinnerOn.first());
            }) 

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            }) 

        })

        //--Filtrer sur les tarifications automatiques;
        test('CheckBox [TARIFICATION AUTOMATIQUE]  - 2 x Click', async () => {
            await fonction.clickElement(pageGestMag.theadCheckBoxTarifAuto);
            await fonction.clickElement(pageGestMag.theadCheckBoxTarifAuto);
        })

        //--Déselectionner des magasins selectionnés afin de voir la tarification autmatique;
        test('Button [SELECTIONNES] - UnClick', async () => {
            await fonction.clickAndWait(pageGestMag.buttonSelectionnes, page);
        })

        //--Vérifier que le magasin MAG1 est en tarification automatique;
        test('Tr [MAGASIN] = "' + sCodeMag  + '" - Is Visible', async () => {
            await fonction.isDisplayed(pageGestMag.dataListeMagasinSelectable.filter({hasText:sCodeMag}));
        })

        test('Td [NOM DU GROUPE][0] #2 - Click', async () => {
            await fonction.clickElement(pageGestMag.tdNomMagasinSelectionnable.first());
        })

        //--Afficher les magasins selectionnés;
        test('Button [SELECTIONNES] #1 - Click', async () => {
            await pageGestMag.theadInputCodeMagasin.clear();
            await fonction.clickElement(pageGestMag.theadCheckBoxTarifAuto);// Je veux voir les magasins surlignés et cochés;
            await fonction.clickAndWait(pageGestMag.buttonSelectionnes, page);
        })

        //-- Vérifier que les magasins selectionnés sont surlignés et cochés;
        test('Tr [MAGASINS] #1 - Check', async () => {
            iNbreMag  = await pageGestMag.dataListeMagasinSelectable.count();
            for(let i = 0; i < iNbreMag; i++){
                log.set('Ligne sélectionnée second : ' + i);
                await expect(pageGestMag.dataListeMagasinSelectable.nth(i)).toHaveAttribute('data-p-highlight', 'true');
                await fonction.isDisplayed(pageGestMag.checkBoxMagasins.nth(i));//Magasin coché
            }
        })

        //-- Le magasin MAG1 ne fait plus parti de la liste;
        test('InputField [CODE] #3 = "' +sCodeMag  + '"', async () => {
            await fonction.sendKeys(pageGestMag.theadInputCodeMagasin, sCodeMag, false, 'Code magasin');
        })

        test('Td [CODE MAGASIN] = "' + sCodeMag + '"  Is Not Visible', async () => {
            await expect(pageGestMag.dataListeMagasinSelectable.filter({hasText:sCodeMag})).not.toBeVisible();
        })

    })  //-- End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})