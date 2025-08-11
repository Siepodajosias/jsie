/**
 * 
 * @desc Créer un don
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 16 - 11 - 2023
 */

const xRefTest      = "STO_EMB_CRE";
const xDescription  = "Création d'un type d'emballage";
const xIdTest       =  1693;
const xVersion      = '3.2';

var info = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}                from '@playwright/test';

import { TestFunctions }                 from "@helpers/functions";
import { Log }                           from "@helpers/log";
import { Help }                          from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                     from "@pom/STO/menu.page";
import { EmballageReferentiel }          from '@pom/STO/emballage-referentiel.page';

//----------------------------------------------------------------------------------------

let page             : Page;

let menu             : MenuStock;
let pageEmballageRef : EmballageReferentiel;

const log            = new Log();
const fonction       = new TestFunctions(log);

//----------------------------------------------------------------------------------------

var maDate          = new Date();
const sDesignation  = 'TEST_AUTO - Désign ' + maDate.getDate();
const iNbMaxParPile = Math.floor(fonction.random() * 9);

const plateforme    = process.env.PLATEFORME || 'Cremcentre';

//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage(); 
    menu                = new MenuStock(page, fonction);
    pageEmballageRef    = new EmballageReferentiel(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('Ouverture URL', async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test('ListBox [PLATEFORME] = "' + plateforme + '"', async() => {            
        await menu.selectPlateforrme(page, plateforme);                       // Sélection d'une plateforme par défaut
    })

    test.describe('Page [EMBALLAGE]', async () =>  {    

        var currentPage = 'emballage';

        test('Page [EMBALLAGE] - Click', async () => {
            await menu.click(currentPage, page);  
        })
             
        test('Label [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);                     
        })

        test.describe('Onglet [REFERENTIEL]', async () =>  { 

            test('Onglet [REFERENTIEL] - Click', async () => {
                await menu.clickOnglet(currentPage, 'referentiel', page);                
            })  

            test('Button [CREER UN TYPE D\'EMBALLAGE] - Click', async () => {
                await fonction.clickAndWait(pageEmballageRef.buttonCreerTypeEmballage, page, 40000);
            })

            var sNomPopin = "Création d'un type d'emballage";
            test.describe ('Popin [' + sNomPopin + ']', async () => {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible - Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test('ListBox [GESTIONNAIRE][rnd] - Select', async () => {
                    await pageEmballageRef.pPlistBoxTypeEmbGestionnaire.click();
                    var iNbResponses = await pageEmballageRef.pPlisteTypeEmbGestionnaires.count();
                    var rnd = Math.floor(fonction.random() * iNbResponses);
                    var sGestionnaire = await pageEmballageRef.pPlisteTypeEmbGestionnaires.nth(rnd).textContent();
                    log.set('Gestionnaire : ' + sGestionnaire);
                    if(sGestionnaire){
                        await pageEmballageRef.pPlistBoxTypeEmbGestionnaire.selectOption({label:sGestionnaire})
                        await pageEmballageRef.pPlistBoxTypeEmbGestionnaire.click();
                    }
                })

                test('DESIGNATION', async () => {
                    await fonction.sendKeys(pageEmballageRef.pPinputTypeEmbDesignation, sDesignation);
                })
                
                test('NB MAX PAR PILE', async () => {
                    await fonction.sendKeys(pageEmballageRef.pPinputTypeEmbMaxPile, iNbMaxParPile);  
                })
                               
                test('Toggle [GERER EN STOCK] = Random', async () => {
                   
                    var rnd = fonction.random();
                    if(rnd < 0.5) {
                        log.set('Gérer en stock : off');
                    } else {
                        log.set('Gérer en stock : on');
                        await pageEmballageRef.pPtoggleTypeEmbGestStock.nth(0).click();
                    }
                })

                test('Toggle [ASSOCIER DES EMBALLAGES] = Random', async () => {
                   
                    var rnd = fonction.random();
                    if(rnd < 0.5) {
                        log.set('Associer des emballages : off');
                    } else {
                        log.set('Associer des emballages : on');
                        await pageEmballageRef.pPtoggleTypeEmbGestStock.nth(1).click();
                    }
                })

                test('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pageEmballageRef.pPbuttonTypeEmbEnregistrer, page);
                })

                test('Link [ANNULER] - Click Conditionnel', async () => {
                    if (await pageEmballageRef.pPlinkTypeEmbAnnuler.isVisible()){
                        await pageEmballageRef.pPlinkTypeEmbAnnuler.click();
                    }else {
                        console.log('Link [ANNULER] - Click : ANNULE');
                        test.skip();
                    }
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible - Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, false, 30000);
                })
            })
        })
    })
})