/**
 *  On aimerait savoir si une feuille de preparation existe dans la datagrid apres que l'envoi de l'ordre de repartition est été faite en amont
 * @author ABDOUL SARBA
 * @since 2025-06-14
 * 
 */

const xRefTest      = "PRE_VER_SFP";
const xDescription  = "vérifier la présence d'une feuille de preparation";
const xIdTest       =  10014;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PREPARATION',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme','article','codePreparateur'],
    fileName    : __filename
}

//------------------------------------------------------------------------------------

import {  test, type Page }               from '@playwright/test';

import { Help }                           from '@helpers/helpers';
import { TestFunctions }                  from '@helpers/functions';
import { Log }                            from '@helpers/log';

import { MenuPreparation }                from '@pom/PRE/menu.page';
import { RefCheminPickingPage }           from '@pom/PRE/referentiel-chemin_picking.page';

import {  CartoucheInfo}                  from '@commun/types';
import { SuiviEclatfeuilleAPreparerPage } from '@pom/PRE/eclatement-feuilles_a_preparer.page';

//------------------------------------------------------------------------------------

let page                               : Page;
let menu                               : MenuPreparation;
let pageChemin                         : RefCheminPickingPage;
let PageSuiviEclatfeuilleAPreparerPage : SuiviEclatfeuilleAPreparerPage;

//------------------------------------------------------------------------------------
const log                              = new Log();
const fonction                         = new TestFunctions(log);
//------------------------------------------------------------------------------------
var oData:any                          = fonction.importJdd(); //Import du JDD pour le bout en bout
//------------------------------------------------------------------------------------
var sPlateforme                        = fonction.getInitParam('plateforme', fonction.getLocalConfig('plateforme'));
var sCodePreparateur                   = fonction.getInitParam('codePreparateur', fonction.getLocalConfig('codePreparateur'));
var sCodesArticle                      = fonction.getInitParam('article','L20W');

//------------------------------------------------------------------------------------
var data={
    sCodeFeuille      :'',
    sCodeArticle      :'',  
    sCodePreparateur  :'', 
}
//------------------------------------------------------------------------------------
if (oData !== undefined) {                                             // On est dans le cadre d'un E2E. Récupération des données temporaires
    var sCodesArticle        = oData.sCodesArticle;
    log.set('E2E - Liste des articles : ' + sCodesArticle);
} 
//------------------------------------------------------------------------------------
test.beforeAll(async ({ browser }, testInfo) => {
    page                              = await browser.newPage();
    menu                              = new MenuPreparation(page, fonction);
    pageChemin                        = new RefCheminPickingPage(page);
    PageSuiviEclatfeuilleAPreparerPage= new SuiviEclatfeuilleAPreparerPage(page);
    const helper                      = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})
//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']' , () => {
    
    test('Ouverture URL : ' + fonction.getApplicationUrl(), async() => {
        await fonction.openUrl(page);
    })

    test('Connexion', async ({ context }) => {
        await context.clearCookies();
        await fonction.connexion(page);
    })

    test.describe('Page [ACCEUIL]', async () => {   

        var sNomPage:string = 'eclatement';
        test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async() => {
            await menu.selectPlateforme(sPlateforme, page);
            log.set('Plateforme : ' + sPlateforme);
        })

        test('Page [SUIVI ECLATEMENT] - Click', async () => {
            await menu.click(sNomPage, page);
        })
        
        test('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);
        })

        test.describe('Onglet [FEUILLES A PREPARER]', async () => {

            var sNomOnglet: string = 'feuillesAPreparer';
            test('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, sNomOnglet, page);
            })

            test('Input [FILTRE ARTICLE] = "' + sCodesArticle + '"', async () => {
                await fonction.sendKeys(PageSuiviEclatfeuilleAPreparerPage.inputSearchAll, sCodesArticle, false, 'filtre article');
            })

            test('Td [LISTE A SERVIR] - Click', async () => {         
                const codeFeuilleAprep       : string = await PageSuiviEclatfeuilleAPreparerPage.dataTableCodeFuillesAPrepareer.first().textContent(); // Code Liste à servir
                await fonction.clickElement(PageSuiviEclatfeuilleAPreparerPage.dataTableFeuillesAPrepareer.first());

                log.set('Code feuille à preparer : ' + codeFeuilleAprep);
                data.sCodeFeuille    = codeFeuilleAprep;
                data.sCodePreparateur= sCodePreparateur;// Enregistrement du code de la liste à servir dans les données temporaires
            });
            await fonction.writeData(data) // Enregistrement des données
        }) // Fin du describe
    }) //Fin du describe  
 
    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

}) //-- End Describe Page

    
