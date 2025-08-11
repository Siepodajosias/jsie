/**
 * 
 * @author JOSIAS SIE
 *  Since 10 - 07 - 2025
 * 
 */

const xRefTest      = "STO_MOD_PCE";
const xDescription  = "Modifier une catégorie d'emplacement pour une plateforme";
const xIdTest       =  10037;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme','categorie'],
    fileName    : __filename
}

//----------------------------------------------------------------------------------------

import { test, type Page}           from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                from "@pom/STO/menu.page";

import { CartoucheInfo }            from '@commun/types';
import { AdminCategorieEmplacement }from '@pom/STO/admin-categorie_emplacement.page';

//----------------------------------------------------------------------------------------

let page              : Page;
let menu              : MenuStock;
let pageAdminCategorie: AdminCategorieEmplacement;

const log      = new Log();
const fonction = new TestFunctions(log);

//----------------------------------------------------------------------------------------

var sPlateforme= fonction.getInitParam('plateforme', 'Cremlog');
var sCategorie = fonction.getInitParam('categorie',  'Dynamique');

//----------------------------------------------------------------------------------------

var sData = {
    lundi   :'Samazan',
    mardi   :'SAFIM',
    mercredi:'Rungis',
    jeudi   :'Novoris',
    vendredi:'Nord'
}

const today             = new Date();
const sNomJour          = fonction.getDayDate(today.getDay());
const sPlateformeModif  = sData[sNomJour];

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage(); 
    menu                = new MenuStock(page, fonction);
    pageAdminCategorie  = new AdminCategorieEmplacement(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('Ouverture URL :' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async() => {            
        await menu.selectPlateforrme(page, sPlateforme);                       // Sélection d'une plateforme par défaut
    })

    test.describe ('Page [ADMINISTRATEUR]', async() => {    

        var currentPage:string = 'admin';
        test('Page [ADMINISTRATEUR] - Click', async () => {
            await menu.click(currentPage, page);
        })
       
        test.describe ('Onglet [CATEGORIE D\'EMPLACEMENTS]', async() => {        
            
            test('Onglet [CATEGORIE EMPLACEMENT] - Click', async () => {
                await menu.clickOnglet(currentPage, 'categorieEmplacement', page);
            })   

            test('Error Message - Is Hidden', async () => {
                await fonction.isErrorDisplayed(false, page);                               	// Pas d'erreur affichée à priori au chargement de l'onglet
            }) 

            test.describe ('Datagrid [FILTRE]', async () => {
                test('Input [PLATEFORME] = "'+  sPlateforme + '"', async () => {
                    await fonction.clickAndWait(pageAdminCategorie.mutiselectPlateCateg.nth(0), page);
                    await fonction.sendKeys(pageAdminCategorie.inputFieldPlateCateg, sPlateforme, false, 'Plateforme');
                    await fonction.clickElement(pageAdminCategorie.checkboxPlateCateg.first());
                })

                test('Input [CATEGORIE] = "'+  sCategorie + '"', async () => {
                    await fonction.clickAndWait(pageAdminCategorie.mutiselectPlateCateg.nth(1), page);
                    await fonction.sendKeys(pageAdminCategorie.inputFieldPlateCateg, sCategorie, false, 'Catégorie');
                    await fonction.clickAndWait(pageAdminCategorie.checkboxPlateCateg.first(), page);
                })

                test('Tr [LISTE CATEGORIE EMPLACEMENT] - Click', async () => {
                    test.skip(await pageAdminCategorie.trCategorieEmpl.count() < 1);
                    await fonction.clickElement(pageAdminCategorie.trCategorieEmpl);
                })

                test('Button [MODIFIER] - Click', async () => {
                    test.skip(await pageAdminCategorie.trCategorieEmpl.count() < 1);
                    await fonction.clickAndWait(pageAdminCategorie.buttonModifier, page);
                })
            })

            var sNomPopin:string = 'Création d\'une nouvelle catégorie';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', () => {   
                test.beforeAll(async () => {
                    test.skip(await pageAdminCategorie.trCategorieEmpl.count() < 1);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                }) 

                test('Input [PLATEFORME] = "'+  sPlateformeModif + '"', async () => {
                    await fonction.clickAndWait(pageAdminCategorie.pDropdownPlateforme, page);
                    await fonction.sendKeys(pageAdminCategorie.pInputFieldPlateCateg, sPlateformeModif, false, 'Plateforme');
                    await fonction.clickElement(pageAdminCategorie.pLiPlateformeAndCateg);
                    log.set('Plateforme de modification :' + sPlateforme);
                })

                test('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pageAdminCategorie.pButtonEnregistrer, page);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })                      
            })
        })  //-- End Describe Onglet
    })  //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})