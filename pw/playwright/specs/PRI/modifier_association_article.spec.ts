/**
 * @desc Modifier les associations Articles / Groupes de magasins
 * 
 * @author JOSIAS SIE
 *  Since 2025-04-09
 */

const xRefTest      = "PRI_ART_GMO";
const xDescription  = "Modifier les associations Articles / Groupes de magasins";
const xIdTest       =  9574;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRICING',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon','groupeArticle','nomGroupe'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, expect, type Page }          from '@playwright/test';

import { TestFunctions }                    from "@helpers/functions";
import { Log }                              from "@helpers/log";
import { Help }                             from '@helpers/helpers';

import { StrategiesArticlesPage }           from '@pom/PRI/strategies_articles.page.js';
import { MenuPricing }                      from '@pom/PRI/menu.page.js';
import { CartoucheInfo, TypeListOfElements }from '@commun/types';

//----------------------------------------------------------------------------------------

let page          : Page;
let menuPage      : MenuPricing;

let pageStrategies: StrategiesArticlesPage;

const log         = new Log();
const fonction    = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const sRayon          = fonction.getInitParam('rayon','Fruits et légumes');
var   sGroupeArticle  = fonction.getInitParam('groupeArticle', 'Fruits et légumes');
var   sNomGroupeMag   = fonction.getInitParam('nomGroupe', '');

sNomGroupeMag         = sNomGroupeMag ? sNomGroupeMag : 'TA_groupe_mag. ' + fonction.getToday('FR');
//----------------------------------------------------------------------------------------
var sDivMessage       = ' Veuillez sélectionner un article dans la liste. ';
var sElertInfo        = 'Les modifications apportées impacteront l\'ensemble des articles'
var sSpanMessageErreur= 'Des tarifications sont en cours pour ces articles et stratégies'
//----------------------------------------------------------------------------------------
var sDesignationArticle = "";
var sCodeArticle        = "";
var aNbrMagasin         = [];
var iNbreGroupeMagasin  = 0;
//----------------------------------------------------------------------------------------
test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menuPage        = new MenuPricing(page, fonction);
    pageStrategies  = new StrategiesArticlesPage(page);
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

    test.describe ('Page [STRATEGIES ARTICLES]', async () => {    

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menuPage.selectRayonByName(sRayon, page);      // Sélection du rayon
            log.set('Rayon : ' + sRayon);
        })

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })

        var sNomPage:string = 'strategies';
        test('Page [STRATEGIES ARTICLES] - Click', async () => {
            await menuPage.click(sNomPage, page);
        })

        test('** Wait Until Spinner Off **', async () => {
            await fonction.waitForSpinner(pageStrategies.pSpinnerOn);
        })

        test.describe ('Div [STRATEGIES ARTICLES] #1', async () => {
            test ('DataGrid [LISTE ARTICLES] - Check', async () => {
                var oDataGrid:TypeListOfElements = {
                    element     : pageStrategies.dataGridListeArticles,    
                    desc        : 'DataGrid [LISTE ARTICLES]',
                    column      :   
                        [
                            '0',
                            'Famille',
                            'Sous-famille',
                            'Réf. de gamme',
                            'Code',
                            'Désignation',
                            'Vend.',
                            'Com.',
                            'Nb groupes',
                            'Nb magasins',     
                        ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })

            test('P-multiselect [FAMILLE] - Click', async () => {
                await fonction.clickElement(pageStrategies.pMultiselectFiltre.nth(1));
            })

            test('P-multiselect [SOUS-FAMILLE] - Click', async () => {
                await fonction.clickElement(pageStrategies.pMultiselectFiltre.nth(2));
            })

            test('P-multiselect [REF. DE GAMME] - Click', async () => {
                await fonction.clickElement(pageStrategies.pMultiselectFiltre.nth(3));
            })

            test('Input [CODE] - Click', async () => {
                await fonction.clickElement(pageStrategies.inputCode);
            })

            test('Input [DESIGNATION] - Click', async () => {
                await fonction.clickElement(pageStrategies.inputDesignation);
            })

            test('P-dropdown [VEND.] - Click', async () => {
                await fonction.clickElement(pageStrategies.pDropdownVend);
            })

            test('P-dropdown [COM.] - Click', async () => {
                await fonction.clickElement(pageStrategies.pDropdownCom);
            })

            test.describe('Div [FILTRE][GROUPE ARTICLE/GROUPE MAGASIN]', async () => {
                test('P-dropdown [GROUPE ARTICLE]['+sGroupeArticle+'] - Click', async () => {
                    await fonction.clickAndWait(pageStrategies.pDropdownGroupeArticles, page);
                    await fonction.clickElement(pageStrategies.pDropdownitem.locator('span:text-is("'+sGroupeArticle+'")'));
                })
    
                test('P-dropdown [GROUPE MAGASIN] - Click x2', async () => {
                    await fonction.clickAndWait(pageStrategies.pDropdownGroupeMagasins, page);
                    await fonction.clickAndWait(pageStrategies.pDropdownGroupeMagasins, page);
                })
            })

            test('Th [DESIGNATION] - Click x2', async () => {
                await fonction.clickElement(pageStrategies.thDesignation);
                await fonction.clickElement(pageStrategies.thDesignation);
            })

            test('Div [ELERT INFO]['+sDivMessage+'] - Check', async () => {
                expect(await pageStrategies.divElertInfo.textContent()).toContain(sDivMessage);
            })

            test('CheckBox [GROUPE ARTICLE] [Nb groupe = 2] - Click', async () => {
                test.setTimeout(60000);
                var iNbrPagination = await pageStrategies.buttonPagination.count();
                for(let i = 1; i < iNbrPagination; i++){
                    var iNbr = await pageStrategies.tdGroupeArticle.filter({ hasText: '2'}).nth(0).count();
                    if(iNbr > 0){
                        await fonction.clickAndWait(pageStrategies.tdGroupeArticle.filter({hasText: '2'}).nth(0), page);
                        sCodeArticle        = await pageStrategies.trGroupeArticle.locator('td.col-code-article').textContent();
                        sDesignationArticle = await pageStrategies.trGroupeArticle.locator('td.col-designation-article').textContent();
                        break;
                    }else{
                        await fonction.clickAndWait(pageStrategies.buttonPagination.nth(i), page);
                    }
                }
            })
        })  

        test.describe ('Div [GROUPE MAGASIN] #1', async () => {

            test ('DataGrid [LISTE GROUPE MAGASIN] - Check', async () => {
                var oDataGrid:TypeListOfElements = {
                    element     : pageStrategies.dataGridListeGroupesMagasins,    
                    desc        : 'DataGrid [LISTE GROUPE MAGASIN]',
                    column      :   
                        [
                            'Nom du groupe',
                            'Nb magasins',  
                            'Nb articles pour rayon'  
                        ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })

            test('Button [SELECTIONNES] - Check', async () => {
                expect(await pageStrategies.buttonPselectbutton.nth(0).locator('span').textContent()).toEqual('Sélectionnés');
            })

            test('Button [NOM SELECTIONNES] - Check', async () => {
                expect(await pageStrategies.buttonPselectbutton.nth(1).locator('span').textContent()).toEqual('Non sélectionnés');
            })

            test('Button [SELECTIONNES] - Click', async () => {
                await fonction.clickAndWait(pageStrategies.buttonPselectbutton.nth(0), page);
            })

            //-- Vérifier que les magasins selectionnés sont surlignés;
            test('Tr [MAGASINS] [SURLIGNES] " - Check', async () => {
                var iNbre = await pageStrategies.dataGridListeMagasin.count();
                for(let i = 0; i < iNbre; i++){
                    const tdLigneSelectionnes = pageStrategies.dataGridListeMagasin.nth(i);
                    await expect(tdLigneSelectionnes).toHaveAttribute('data-p-highlight', 'true');
                    aNbrMagasin.push(await tdLigneSelectionnes.locator('.col-nom-groupe-magasin').textContent());
                }
            })

            test('Button [SELECTIONNES] - UnClick', async () => {
                await fonction.clickAndWait(pageStrategies.buttonPselectbutton.nth(0), page);
            })

            test('Button [NON SELECTIONNES] - Click', async () => {
                await fonction.clickAndWait(pageStrategies.buttonPselectbutton.nth(1), page);
            })

            //-- Vérifier que les magasins selectionnés ne sont pas surlignés;
            test('Tr [MAGASINS] [NON SURLIGNES] " - Check', async () => {
                var iNbre = await pageStrategies.dataGridListeMagasin.count();
                for(let i = 0; i < iNbre; i++){
                    const tdLigneSelectionnes = pageStrategies.dataGridListeMagasin.nth(i);
                    await expect(tdLigneSelectionnes).toHaveAttribute('data-p-highlight', 'false');
                }
            })

            test('Button [NON SELECTIONNES] - UnClick', async () => {
                await fonction.clickAndWait(pageStrategies.buttonPselectbutton.nth(1), page);
            })
        })

        var sNomPopin:string = 'Modification des associations Article / Groupes magasins';
        test.describe ('Popin [' + sNomPopin + '] #1', async () => {

            test('Button [MODIFIER LES ASSOCIATIONS] - Click', async () => {
                await fonction.clickAndWait(pageStrategies.buttonModifierAssociation, page);
            })

            test('Popin [' + sNomPopin + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            }) 

                //-- Vérifier les onglets et options de la popine;
            test('Span [ONGLETS/OPTION][Modifier les associations] - Check', async () => {
                expect(await pageStrategies.pPselectbuttonOnglets.nth(0).textContent()).toEqual('Modifier les associations');
            })

            test('Span [ONGLETS/OPTION][Ajouter un groupe de magasins] - Check', async () => {
                expect(await pageStrategies.pPselectbuttonOnglets.nth(1).textContent()).toEqual('Ajouter un groupe de magasins');
            })

            test('Span [ONGLETS/OPTION][Retirer un groupe de magasins] - Check', async () => {
                expect(await pageStrategies.pPselectbuttonOnglets.nth(2).textContent()).toEqual('Retirer un groupe de magasins');
            })

            //-- Vérifier le code et la désignation de l'article sélectionné;
            test('Span [CODE/DESIGNATION] [DESIGNATION ARTICLE][' + sDesignationArticle + '] - Check', async () => {
                expect(await pageStrategies.pSpanDesignationArticle.textContent()).toContain(sDesignationArticle);
            })

            test('Span [CODE/DESIGNATION][CODE ARTICLE][' + sCodeArticle + '] - Check', async () => {
                expect(await pageStrategies.pSpanDesignationArticle.textContent()).toContain(sCodeArticle);
            })

            test('CheckBox [COCHE DES SELECTION] - Check', async () => {
                await fonction.isDisplayed(pageStrategies.checkboxCocheSelection);
            })

            test ('DataGrid [LISTE GROUPE ARTICLE] - Check', async () => {
                var oDataGrid:TypeListOfElements = {
                    element     : pageStrategies.pDataGridListeGroupesMagasins,    
                    desc        : 'DataGrid [LISTE GROUPE ARTICLE]',
                    column      :   
                        [
                            '2',
                            'Nom du groupe',
                            'Nb magasins',
                            'Nb articles pour rayon'     
                        ]
                }
                await fonction.dataGridHeaders(oDataGrid);
            })

            test('Span [ONGLETS/OPTION][MODIFIER LES ASSOCIATIONS] - Click x2', async () => {
                await fonction.clickElement(pageStrategies.pPselectbuttonOnglets.nth(0));
                await fonction.clickElement(pageStrategies.pPselectbuttonOnglets.nth(0));
            })
            
            //-- Vérifier que les magasins selectionnés sont surlignés (Popine);
            test ('Input [NOM DU GROUPE] - Check', async () => {
                test.setTimeout(60000);
                for(let i = 0; i < aNbrMagasin.length; i++){
                    await fonction.sendKeys(pageStrategies.inputNomGroupe, aNbrMagasin[i].trim(), false, 'Nom du groupe');
                    await fonction.wait(page, 2000);
                    //expect(pageStrategies.pDataGridListeMagasin.nth(i)).toHaveAttribute('data-p-highlight', 'true', { timeout: 20000 });
                }
            })

            test('Button [ENREGISTRER] - Check', async () => {
                expect(await pageStrategies.pButtonEnregistrer.nth(0).isEnabled()).toBe(false);
            })

            test('Input [NOM DU GROUPE][' + sNomGroupeMag + '] - Check', async () => {
                await fonction.sendKeys(pageStrategies.inputNomGroupe, sNomGroupeMag, false, 'Nom du groupe');
                await fonction.wait(page, 500);
            })

            test('CheckBox [GROUPE MAGASIN] - Click', async () => {
                await fonction.clickElement(pageStrategies.checkboxGroupeMag);
            })
            
            test ('Th [LISTE GROUPE ARTICLE] - Check', async () => {
                const iNbrGroupeMag = (await pageStrategies.pDataGridListeGroupesMagasins.nth(0).textContent()).trim();
                expect(parseInt(iNbrGroupeMag)).toEqual(3);
            })

            test ('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageStrategies.pButtonEnregistrer.nth(0), page);
            })

            test('Popin [' + sNomPopin + '] - Is Not Visible', async () => { 
                await fonction.popinVisible(page, sNomPopin, false);
            })
        })

        test.describe ('Div [GROUPE MAGASIN] #2', async () => {
            test('Button [SELECTIONNES] - Click', async () => {
                await fonction.wait(page, 1000);
                await fonction.clickAndWait(pageStrategies.buttonPselectbutton.nth(0), page);
            })

            //-- Vérifier le nombre de magasins selectionnés (Mise à jour).
            test('Tr [GROUPE MAGASIN]" - Check', async () => {
                await fonction.wait(page, 1000);
                expect(await pageStrategies.dataGridListeMagasin.count()).toEqual(3);
            })

            //-- Vérifier que les magasins selectionnés sont surlignés.
            test('Tr [MAGASINS MAGASIN][SURLIGNES] " - Check', async () => {
                test.setTimeout(60000);
                await fonction.wait(page, 4000);
                var iNbre = await pageStrategies.dataGridListeMagasin.count();
                for(let i = 0; i < iNbre; i++){
                    const tdLigneSelectionnes = pageStrategies.dataGridListeMagasin.nth(i);
                    await expect(tdLigneSelectionnes).toHaveAttribute('data-p-highlight', 'true', { timeout: 20000 });
                }
            })
        })

        test.describe ('Div [STRATEGIES ARTICLES] #2', async () => {
            //-- Vérifier que le nombre de magasins lié à l'article selectionné a été mis à jour;
            test('Td [NB MAGASINS]" - Check', async () => {
                var iNbrPagination = await pageStrategies.buttonPagination.count();
                for(let i = 1; i < iNbrPagination; i++){
                    var iNbr = await pageStrategies.trGroupeArticle.locator('td.col-designation-article').filter({ hasText: sDesignationArticle}).nth(0).count();
                    if(iNbr > 0){
                        // const iNbrGroupeMag = (await pageStrategies.trGroupeArticle.locator('td.col-nb-groupes-magasins-article').textContent()).trim();
                        // expect(parseInt(iNbrGroupeMag)).toEqual(3);
                        break;
                    }else{
                        await fonction.clickAndWait(pageStrategies.buttonPagination.nth(i), page);
                    }
                }
            })

            test('CheckBox [GROUPE ARTICLE] - Click', async () => {
                await fonction.clickElement(pageStrategies.tdGroupeArticle.nth(0), page);
                await fonction.clickElement(pageStrategies.tdGroupeArticle.nth(2), page);
            })
        })

        test.describe ('Div [GROUPE MAGASIN] #3', async () => {
            //-- Vérifier que les magasins selectionnés sont surlignés;
            test('Tr [MAGASINS] [SURLIGNES] " - Check', async () => {
                await fonction.wait(page, 800);
                iNbreGroupeMagasin = await pageStrategies.dataGridListeMagasin.count();
                for(let i = 0; i < iNbreGroupeMagasin; i++){
                    const tdLigneSelectionnes = pageStrategies.dataGridListeMagasin.nth(i);
                    await expect(tdLigneSelectionnes).toHaveAttribute('data-p-highlight', 'true');
                }
            })

            test('Em [WARNING]" - Check', async () => {
                for(let i = 0; i < iNbreGroupeMagasin; i++){
                    await fonction.isDisplayed(pageStrategies.emWarning.nth(i));
                }
            })
        })

        test.describe('Popin [' + sNomPopin + '] #2', async () => {
            test('Button [MODIFIER LES ASSOCIATIONS] - Click', async () => {
                await fonction.clickAndWait(pageStrategies.buttonModifierAssociation, page);
                await fonction.wait(page, 2000);
            })

            test('Popin [' + sNomPopin + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            }) 

            test('Span [ONGLETS/OPTION][MODIFIER LES ASSOCIATIONS] - Click x2', async () => {
                await fonction.clickElement(pageStrategies.pPselectbuttonOnglets.nth(0));
                await fonction.clickElement(pageStrategies.pPselectbuttonOnglets.nth(0));
            })
    
            test('Span [LISTE ARTICLE] - Check', async () => {
                const iNbrArticle = await pageStrategies.emFormulaire.locator('span').textContent();
                expect(parseInt(iNbrArticle.trim().slice(0,1))).toEqual(3);
            })
    
            test('Em [INFO] - Check', async () => {
                await fonction.isDisplayed(pageStrategies.emFormulaire.locator('em.fa-info-circle'));
            })

            test('Div [ELERT INFO] - Check', async () => {
                expect((await pageStrategies.emFormulaire.locator('.alert-warning').textContent()).trim()).toEqual(sElertInfo);
            })
    
            test('DataGrid [LISTE GROUPE MAGASIN][' + iNbreGroupeMagasin + '] - Check', async () => {
                const iNbrGroupeMag = (await pageStrategies.pDataGridListeGroupesMagasins.nth(0).textContent()).trim();
                expect(parseInt(iNbrGroupeMag)).toEqual(iNbreGroupeMagasin);
            })

            test('Button [ENREGISTRER] - Check', async () => {
                expect(await pageStrategies.pButtonEnregistrer.nth(0).isEnabled()).toBe(false);
            })

            test('CheckBox [GROUPE MAGASIN][G5] - Click', async () => {
                await fonction.clickElement(pageStrategies.pCheckboxGroupeMag.nth(0));
            })

            test('CheckBox [GROUPE MAGASIN][G6] - Click', async () => {
                await fonction.clickElement(pageStrategies.pCheckboxGroupeMag.nth(1));
            })

            test('Input [NOM DU GROUPE][' + sNomGroupeMag + '] - Check', async () => {
                await fonction.sendKeys(pageStrategies.inputNomGroupe, sNomGroupeMag, false, 'Nom du groupe');
                await fonction.wait(page, 500);
            })

            test('CheckBox [GROUPE MAGASIN] - Click', async () => {
                await fonction.clickAndWait(pageStrategies.checkboxGroupeMag, page);
            })

            test('DataGrid [LISTE GROUPE MAGASIN] - Check', async () => {
                await fonction.wait(page, 500);
                const iNbrGroupeMag = (await pageStrategies.pDataGridListeGroupesMagasins.nth(0).textContent()).trim();
                expect(parseInt(iNbrGroupeMag)).toEqual(iNbreGroupeMagasin+1);
            })

            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageStrategies.pButtonEnregistrer.nth(0), page);
            })

            test('Popin [' + sNomPopin + '] - Is Not Visible', async () => { 
                await fonction.popinVisible(page, sNomPopin, false);
            })
        })

        test.describe ('Div [GROUPE MAGASIN] #4', async () => {
            test.skip('Button [SELECTIONNES] - Click', async () => {
                await fonction.wait(page, 1000);
                await fonction.clickAndWait(pageStrategies.buttonPselectbutton.nth(0), page);
            })

            test('DataGrid [LISTE GROUPE MAGASIN][' + iNbreGroupeMagasin + '] - Check', async () => {
                expect(await pageStrategies.dataGridListeMagasin.count()).toEqual(iNbreGroupeMagasin);
            })

            //-- Vérifier que les magasins selectionnés sont surlignés;
            test('Tr [MAGASINS] [SURLIGNES] " - Check', async () => {
                test.setTimeout(60000);
                await fonction.wait(page, 4000);
                var iNbre = await pageStrategies.dataGridListeMagasin.count();
                for(let i = 0; i < iNbre; i++){
                    const tdLigneSelectionnes = pageStrategies.dataGridListeMagasin.nth(i);
                    await expect(tdLigneSelectionnes).toHaveAttribute('data-p-highlight', 'true', { timeout: 20000 });
                }
            })

            test('Em [WARNING] " - Check', async () => {
                test.setTimeout(60000);
                await fonction.wait(page, 1000);
                iNbreGroupeMagasin = await pageStrategies.dataGridListeMagasin.count();
                for(let i = 0; i < iNbreGroupeMagasin; i++){
                    await expect(pageStrategies.emWarning.nth(i)).not.toBeVisible();
                }
            })
        })

        test.describe ('Popin [' + sNomPopin + '] #3', async () => {
            test('Button [MODIFIER LES ASSOCIATIONS] - Click', async () => {
                await fonction.clickAndWait(pageStrategies.buttonModifierAssociation, page);
            })

            test('Popin [' + sNomPopin + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            }) 
    
            test('DataGrid [LISTE GROUPE MAGASIN][' + iNbreGroupeMagasin + '] - Check', async () => {
                await fonction.wait(page, 500);
                const iNbrGroupeMag = (await pageStrategies.pDataGridListeGroupesMagasins.nth(0).textContent()).trim();
                expect(parseInt(iNbrGroupeMag)).toEqual(iNbreGroupeMagasin);
            })

            //-- Vérifier que les magasins selectionnés sont surlignés;
            test('Tr [MAGASINS] [SURLIGNES] " - Check', async () => {
                iNbreGroupeMagasin = await pageStrategies.pDataGridListeMagasin.count();
                for(let i = 0; i < iNbreGroupeMagasin; i++){
                    await expect(pageStrategies.pEmWarning.nth(i)).not.toBeVisible();
                }
            })

            test ('Button [ANNULER] - Click', async () => {
                await fonction.clickAndWait(pageStrategies.pButtonEnregistrer.nth(1), page);
            })

            test('Popin [' + sNomPopin + '] - Is Not Visible', async () => { 
                await fonction.popinVisible(page, sNomPopin, false);
            })
        })

        test.describe ('Div [STRATEGIES ARTICLES] #3', async () => {
            //-- Vérifier que le nombre de magasins lié à l'article selectionné a été mis à jour;
            test('Tr [MAGASINS] [SURLIGNES] " - Check', async () => {
                var iNbrPagination = await pageStrategies.buttonPagination.count();
                for(let i = 1; i < iNbrPagination; i++){
                    var iNbr = await pageStrategies.trGroupeArticle.locator('td.col-designation-article').filter({ hasText: sDesignationArticle}).nth(0).count();
                    if(iNbr > 0){
                        // const iNbrGroupeMag = (await pageStrategies.trGroupeArticle.locator('td.col-nb-groupes-magasins-article').textContent()).trim();
                        // expect(parseInt(iNbrGroupeMag)).toEqual(3);
                        break;
                    }else{
                        await fonction.clickAndWait(pageStrategies.buttonPagination.nth(i), page);
                    }
                }
            })

            test('CheckBox [GROUPE ARTICLE] - Click', async () => {
                await fonction.clickAndWait(pageStrategies.tdGroupeArticle.nth(0), page);
                await fonction.clickAndWait(pageStrategies.tdGroupeArticle.nth(1), page);
                iNbreGroupeMagasin = await pageStrategies.dataGridListeMagasin.count();
            })
        })

        test.describe ('Popin [' + sNomPopin + '] #4', async () => {
            test('Button [MODIFIER LES ASSOCIATIONS] - Click', async () => {
                await fonction.clickAndWait(pageStrategies.buttonModifierAssociation, page);
            })

            test('Popin [' + sNomPopin + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            }) 
    
            test('Span [ONGLETS/OPTION][MODIFIER LES ASSOCIATIONS] - Click x2', async () => {
                await fonction.clickElement(pageStrategies.pPselectbuttonOnglets.nth(0));
                await fonction.clickElement(pageStrategies.pPselectbuttonOnglets.nth(0));
            })

            test('Input [NOM DU GROUPE][' + sNomGroupeMag + '] - Check', async () => {
                await fonction.sendKeys(pageStrategies.inputNomGroupe, sNomGroupeMag, false, 'Nom du groupe');
                await fonction.wait(page, 500);
            })

            test('CheckBox [GROUPE MAGASIN] - Click', async () => {
                await fonction.clickAndWait(pageStrategies.checkboxGroupeMag, page);
            })

            test('DataGrid [LISTE GROUPE MAGASIN][' + iNbreGroupeMagasin + '] - Check', async () => {
                await fonction.wait(page, 1000);
                const iNbrGroupeMag = (await pageStrategies.pDataGridListeGroupesMagasins.nth(0).textContent()).trim();
                expect(parseInt(iNbrGroupeMag)).toEqual(iNbreGroupeMagasin+1);
            })

            test ('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageStrategies.pButtonEnregistrer.nth(0), page);
            })

            //-- Vérifier le méssage d'erreur.
            test.skip('Div [MESSAGE D\'ERREUR] - Check', async () => {
                expect(await pageStrategies.pDataGridListeMagasin.textContent()).toEqual(sSpanMessageErreur);
            })

            test.skip('Button [ENREGISTRER] - Check', async () => {
                expect(await pageStrategies.pButtonEnregistrer.nth(0).isEnabled()).toBe(false);
            }) 

            test('Popin [' + sNomPopin + '] - Is Not Visible', async () => { 
                await fonction.popinVisible(page, sNomPopin, false);
            })
        })
    })  //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.wait(page, 3000);
		await fonction.deconnexion(page);
	})
})