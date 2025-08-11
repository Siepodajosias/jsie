/**
 * 
 * @description Modifier une caractéristique
 * 
 * @author JOSIAS SIE
 *  Since 2025-03-12
 */

const xRefTest      = "NOM_CAR_CHG";
const xDescription  = "Modifier une caractéristique";
const xIdTest       =  1120;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'NOMEMCLATURE',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [], 
    params      : ['designation'],
    fileName    : __filename
}

//----------------------------------------------------------------------------------------

import { test, type Page}  from '@playwright/test';

import { TestFunctions }   from "@helpers/functions";
import { Log }             from "@helpers/log";
import { Help }            from '@helpers/helpers';

import { MenuNomenclature }from "@pom/NOM/menu.page";
import { Caracteristique } from '@pom/NOM/caracteristiques.page';

import { CartoucheInfo}    from '@commun/types';

//----------------------------------------------------------------------------------------

let page           : Page;
let menu           : MenuNomenclature;
let pageCaracterist: Caracteristique;

const log          = new Log();
const fonction     = new TestFunctions(log);

//----------------------------------------------------------------------------------------
var sDesignation       = fonction.getInitParam('designation','');

//----------------------------------------------------------------------------------------
const sDescription     = 'TA modification d\'une caracteristique de type code/désignation. ' + fonction.getToday('FR');
sDesignation           = sDesignation ? sDesignation : 'TA_caracteristique. ' + fonction.getToday('FR');
//----------------------------------------------------------------------------------------
const sDesignationModif= 'TA_caracteristique_modifier. ' + fonction.getToday('FR');
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

        var currentPage:string  = 'caracteristiques';

        test('Page [CARACTERISTIQUE] - Click', async () => {
            await menu.click(currentPage, page); 
        })              
        
        test('InputField [DESIGNATION] = "' + sDesignation + '"', async () => {
            await fonction.sendKeys(pageCaracterist.inputSearchDesignation, sDesignation, false,'Désignation');
            await fonction.wait(page,250);
        })

        test('Tr [CARACTERISTIQUE] - Click', async () => {
            await fonction.clickAndWait(pageCaracterist.trCaracteristique.locator('.col-designation').filter({hasText: sDesignation}), page);
        })

        test('Button [MODIFIER CARACTERISTIQUE] - Click', async () => {
            await fonction.clickAndWait(pageCaracterist.buttonModifCaracterist, page);
        })

        var sNomPopin:string = "Modification de la caractéristique";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {            

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            })

            test.describe ('Rubrique [DES VALEURS]', async () => {            
                test('InputField [DESIGNATION] = "' + sDesignationModif + '"', async () => {
                    await fonction.sendKeys(pageCaracterist.pInputDesignation, sDesignationModif, false, 'Désignation');
                })
    
                test('Input [VALEUR(S) A TRADUIRE] - Click', async () => {
                    await fonction.clickElement(pageCaracterist.pInputValeurATraduire);
                })
    
                test('Textarea [DESCRIPTION] - Click', async () => {
                    await fonction.sendKeys(pageCaracterist.pTexteAreaDescription, sDescription, false, 'Description');
                })
    
                test('Input [TYPE D\'AFFICHAGE] - Click', async () => {
                    await fonction.clickElement(pageCaracterist.pInputAutocomplete);
                })
            })

            test('Button [CREER] - Click', async () => {
                await fonction.clickAndWait(pageCaracterist.pButtonCreer, page);
            })

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            })
        })
    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})