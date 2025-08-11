/**
 *  On aimerait savoir si une liste à servir existe apres que l'envoi de l'ordre de repartition
 * @author ABDOUL SARBA
 * @since 2025-06-14
 * 
 */

const xRefTest      = "PRE_VER_SPP";
const xDescription  = "vérifier la présence d'une liste à servir";
const xIdTest       =  10013;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PREPARATION',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme','designationMagasin','codePreparateur'],
    fileName    : __filename
}

//------------------------------------------------------------------------------------

import {  test, type Page }             from '@playwright/test';

import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';

import { MenuPreparation }              from '@pom/PRE/menu.page';
import { RefCheminPickingPage }         from '@pom/PRE/referentiel-chemin_picking.page';

import {  CartoucheInfo}                from '@commun/types';
import { SuiviPickListesAPreparerPage } from '@pom/PRE/picking-listes_a_preparer.page';

//------------------------------------------------------------------------------------

let page                                 : Page;
let menu                                 : MenuPreparation;
let pageChemin                           : RefCheminPickingPage;
let PageSuiviPickListesAPreparerPage     : SuiviPickListesAPreparerPage;

//------------------------------------------------------------------------------------
const log                                = new Log();
const fonction                           = new TestFunctions(log);
//------------------------------------------------------------------------------------
var oData:any                            = fonction.importJdd(); //Import du JDD pour le bout en bout
//------------------------------------------------------------------------------------
var sPlateforme                          = fonction.getInitParam('plateforme', fonction.getLocalConfig('plateforme'));
var sCodePreparateur                     = fonction.getInitParam('codePreparateur', fonction.getLocalConfig('codePreparateur'));
var sNomMagasin                          = fonction.getInitParam('designationMagasin','Puteaux (fresh)');
//------------------------------------------------------------------------------------
var data={
    sCodeListeAservice:'',
    sCodePreparateur  :'',
    sCodesArticle     :'',
}
//------------------------------------------------------------------------------------
if (oData !== undefined) {                                  // On est dans le cadre d'un E2E. Récupération des données temporaires
    var aCodesArticle        = Object.keys(oData.aLots);
        sNomMagasin          = oData.aNomMagasin[aCodesArticle[0]]; 
    log.set('E2E - Liste des articles : ' + aCodesArticle);
    log.set('E2E - Magasin  : ' + sNomMagasin);
} 
//------------------------------------------------------------------------------------
test.beforeAll(async ({ browser }, testInfo) => {
    page                            = await browser.newPage();
    menu                            = new MenuPreparation(page, fonction);
    pageChemin                      = new RefCheminPickingPage(page);
    PageSuiviPickListesAPreparerPage= new SuiviPickListesAPreparerPage(page);
    const helper                    = new Help(info, testInfo, page);
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

        var sNomPage:string = 'picking';

        test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async() => {
            await menu.selectPlateforme(sPlateforme, page);
            log.set('Plateforme : ' + sPlateforme);
        })

        test('Page [SUIVI PICKING] - Click', async () => {
            await menu.click(sNomPage, page); 
        })
        
        test('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);
        })

        test.describe('Onglet [LISTE A PREPARER]', async () => {

            var sNomOnglet: string = 'Liste à préparer';
            test('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'listesAPreparer', page);
            })

            test('Input [FILTRE MAGASIN] = "' + sNomMagasin + '"', async () => {
                await fonction.sendKeys(PageSuiviPickListesAPreparerPage.inputFilter, sNomMagasin, false, 'filtre magasin');
            })

            test('Td [LISTE A SERVIR] - Click', async () => {         
                const tdContent       : string = await PageSuiviPickListesAPreparerPage.dataGridCodeListe.first().textContent(); // Code Liste à servir
                const codeListeAServir: string = `A${tdContent}`;                                                               // concatenation avec un 'A' dans le cadre des types listes à servir
                await fonction.clickElement(PageSuiviPickListesAPreparerPage.dataGridCodeListe.first());

                log.set('Code Liste à servir : ' + codeListeAServir);
                data.sCodeListeAservice = codeListeAServir;    
                data.sCodePreparateur   = sCodePreparateur;
                data.sCodesArticle      = aCodesArticle[1];                                                             // Enregistrement du code de la feuille  
            });
            await fonction.writeData(data)                                                                             // Enregistrement des données
        }) // Fin du describe

    })   // Fin du describe 

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

}) //-- End Describe Page

    
