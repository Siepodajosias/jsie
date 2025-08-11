/**
 * 
 * @description Supprimer une caractéristique
 * 
 * @author JOSIAS SIE
 *  Since 2025-03-11
 */

const xRefTest      = "NOM_CAR_SUP";
const xDescription  = "Supprimer une caractéristique";
const xIdTest       =  1209;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'NOMEMCLATURE',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['caracteristique','label'],
    fileName    : __filename
}

//----------------------------------------------------------------------------------------

import { test, type Page, expect }from '@playwright/test';

import { TestFunctions }          from "@helpers/functions";
import { Log }                    from "@helpers/log";
import { Help }                   from '@helpers/helpers';

import { MenuNomenclature }       from "@pom/NOM/menu.page";
import { Caracteristique }        from '@pom/NOM/caracteristiques.page';

import { CartoucheInfo}           from '@commun/types';

//----------------------------------------------------------------------------------------

let page           : Page;
let menu           : MenuNomenclature;
let pageCaracterist: Caracteristique;

const log          = new Log();
const fonction     = new TestFunctions(log);

//----------------------------------------------------------------------------------------
var sCaracteristque= fonction.getInitParam('caracteristique', '');
var slabel         = fonction.getInitParam('label', 'label qualité');
//----------------------------------------------------------------------------------------
sCaracteristque    = sCaracteristque ? sCaracteristque : 'TA_caracteristique_modifier. ' + fonction.getToday('FR');
//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page           = await browser.newPage(); 
    menu           = new MenuNomenclature(page, fonction);
    pageCaracterist= new Caracteristique(page);
    const helper   = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + '] - ' + xDescription , () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [CARACTERISTIQUE]', async () => {    

        var currentPage:string = 'caracteristiques';

        test('Page [CARACTERISTIQUE] - Click', async () => {
            await menu.click(currentPage, page); 
        })              
        
        test.describe ('Div [CARACTERISTIQUE][LABEL QUALITE]', async () => { 
            test('InputField [DESIGNATION] = "' + slabel + '"', async () => {
                await fonction.sendKeys(pageCaracterist.inputSearchDesignation, slabel, false,'Caractéristique');
                await fonction.wait(page, 250);
            })
    
            test('Tr [CARACTERISTIQUE][LABEL POSSIBLE] - Click', async () => {
                await fonction.clickAndWait(pageCaracterist.trCaracteristique.locator('.col-designation').filter({hasText: slabel}), page);
            })
    
            test('Button [ACTIONS] - Click', async () => {
                await fonction.clickElement(pageCaracterist.buttonActionsSup);
            })
            
            var sNomPopin:string = "Confirmation";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {            
                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })
            
                test('Button [OUI] - Click', async () => {
                    await fonction.clickAndWait(pageCaracterist.buttonConfirmerSup.nth(0), page);
                    var errorMessage:any = await pageCaracterist.pErrorMessage.textContent();
                    var errorCode  = errorMessage.substr(0,6);
                    if(errorCode === "[9200]"){
                        expect(errorMessage).toContain('Suppression impossible.');
                        await fonction.clickAndWait(pageCaracterist.buttonConfirmerSup.nth(1), page);
                    }
                })
    
                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })

                test('Icon [CLEAR] - Click', async () => {
                    await fonction.clickAndWait(pageCaracterist.buttonClear.nth(0), page);
                })
            })
        })

        test.describe ('Div [CARACTERISTIQUE] ["' + sCaracteristque + '"]', async () => { 
            test('InputField [DESIGNATION] = "' + sCaracteristque + '"', async () => {
                await fonction.sendKeys(pageCaracterist.inputSearchDesignation.nth(0), sCaracteristque, false,'Caractéristique');
                await fonction.wait(page, 250);
            })
    
            test('Tr [CARACTERISTIQUE][LABEL POSSIBLE] - Click', async () => {
                await fonction.clickAndWait(pageCaracterist.trCaracteristique.locator('.col-designation').filter({hasText: sCaracteristque}), page);
            })
    
            test('Button [ACTIONS] - Click', async () => {
                await fonction.clickElement(pageCaracterist.buttonActionsSup);
            })
            
            var sNomPopin:string = "Confirmation";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {            
                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })
            
                test('Button [OUI] - Click', async () => {
                    await fonction.clickAndWait(pageCaracterist.buttonConfirmerSup.nth(0), page);
                })
    
                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })
            })
        })
    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})