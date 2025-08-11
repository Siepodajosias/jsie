/**
 * 
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 16 - 11 - 2023
 */

const xRefTest      = "STO_GES_CRE";
const xDescription  = "Création d'un gestionnaire d'emballage";
const xIdTest       =  1692;
const xVersion      = '3.1';

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

import { test, type Page}           from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                from "@pom/STO/menu.page";
import { EmballageReferentiel }     from '@pom/STO/emballage-referentiel.page';

//----------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuStock;
let pageEmballageRef: EmballageReferentiel;

const log           = new Log();
const fonction      = new TestFunctions(log);

//----------------------------------------------------------------------------------------

var maDate          = new Date();
const sCode         = 'TA-' + maDate.getDate();
const sDesignation  = 'TEST_AUTO - Désignation ' + maDate.getDate();
const sRaisonScle   = 'TEST_AUTO - Raison Sociale ' + maDate.getDate();
const sTelephone    = '01 02 03 04 05';
const sAdresse      = 'TEST_AUTO - Adresse d\'un gestionnaire #1 ';
const sComplement   = 'TEST_AUTO - Complément Adresse d\' du gestionnaire #1 ';
const iCodePostal   = '97432';
const sVille        = 'TA de l\'île';

const plateforme    = process.env.PLATEFORME || 'Cremcentre';

//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuStock(page, fonction);
    pageEmballageRef= new EmballageReferentiel(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
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

        test.describe('Onglet [MOUVEMENTS DES EMBALLAGES]', async () =>  {        
            
            test('Onglet [REFERENTIEL] - Click', async () =>  {
                await menu.clickOnglet(currentPage, 'referentiel', page);                
            })   
      
            test('Button [CREER UNE GESTIONNAIRE] - Click', async () =>  {
                await fonction.clickAndWait(pageEmballageRef.buttonCreerGestionnaire, page, 40000);
            })

            var sNomPopin = "Création d'un gestionnaire";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>  {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible - Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test('InputField [CODE] = "' + sCode + '"', async () => {
                    await fonction.sendKeys(pageEmballageRef.pPinputGestCode, sCode);
                })
                
                test('InputField [DESIGNATION] = "' + sDesignation + '"', async () => {
                    await fonction.sendKeys(pageEmballageRef.pPinputGestDesignation, sDesignation);
                })
                
                test('InputField [RAISON SOCIALE] = "' + sRaisonScle + '"', async () => {
                    await fonction.sendKeys(pageEmballageRef.pPinputGestRaisonSociale, sRaisonScle);
                })
                
                test('InputField [TELEPHONE] = "' + sTelephone + '"', async () => {
                    await fonction.sendKeys(pageEmballageRef.pPinputGestTelephone, sTelephone);
                })
                
                test('InputField [ADRESSE] = "' + sAdresse + '"', async () => {
                    await fonction.sendKeys(pageEmballageRef.pPinputGestAdresse, sAdresse);
                })
                
                test('InputField [COMPLETMENT ADRESSE] = "' + sComplement + '"', async () => {
                    await fonction.sendKeys(pageEmballageRef.pPinputGestComplement, sComplement);
                })
                
                test('InputField [CODE POSTAL] = "' + iCodePostal + '"', async () => {
                    await fonction.sendKeys(pageEmballageRef.pPinputGestCodePostal, iCodePostal);
                })
                
                test('InputField [VILLE] = "' + sVille + '"', async () => {
                    await fonction.sendKeys(pageEmballageRef.pPinputGestVille, sVille);
                })

                test('Button [ENREGISTRER] - Click', async () =>  {
                    await fonction.clickAndWait(pageEmballageRef.pPbuttonGestEnregistrer, page);
                })

                test('Link [ANNULER] - Click Conditionnel', async () => {
                    if (await pageEmballageRef.pPlinkGestAnnuler.isVisible()){
                        await pageEmballageRef.pPlinkGestAnnuler.click();
                    }else {
                        console.log('Link [ANNULER] - Click : ANNULE');
                        test.skip();
                    }
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible - Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, false,30000);
                })

            })

        })  //-- End Describe Onglet 

    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})
