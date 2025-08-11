/**
 * 
 * @author JOSIAS SIE
 * @since 2024-12-27
 *  
 */
const xRefTest      = "DON_GRP_ADD";
const xDescription  = "Ajouter un groupe";
const xIdTest       = 4726;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'DONS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['nom'],
    fileName    : __filename
}

//--------------------------------------------------------------------------------------------// 

import { test, type Page } from '@playwright/test';

import { Help }            from '@helpers/helpers';
import { TestFunctions }   from '@helpers/functions';
import { Log }             from '@helpers/log';

import { MenuDon }         from '@pom/DON/menu.page';
import { BeneficiaireDons }from '@pom/DON/beneficiares-beneficiaires.page';

import { CartoucheInfo }   from '@commun/types/index';

//---------------------------------------------------------------------------------------------//

let page                : Page;
let menu                : MenuDon;

let pageBenefBenef      : BeneficiaireDons;

const log               = new Log();
const fonction          = new TestFunctions(log);

//---------------------------------------------------------------------------------------------//

var sNomGroupe          = fonction.getInitParam('nom', 'Ta_ajoutGroupe ' + fonction.getToday('FR') + ' ' + fonction.getBadChars());

//---------------------------------------------------------------------------------------------//

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuDon(page, fonction);    
    pageBenefBenef      = new BeneficiaireDons(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//--------------------------------------------------------------------------------------------//

test.describe.serial ('[' + xRefTest + '] - ' + xDescription + ' : ', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();		
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [BENEFICIAIRES]',  async () => {

        var sNomPage:string = 'beneficiaires';

        test('Page [BENEFICIAIRES] - Click', async () => {
            await menu.click(sNomPage, page);
        })

        test.describe ('Onglet [BENEFICIAIRES]',  async () => {

            test('Button [GERER GROUPES] - Click',  async () => {
                await fonction.clickAndWait(pageBenefBenef.buttonGererGroupe, page);
            })

            var sNomPopin:string = 'GERER DES GROUPES';
            test.describe ('[' + sNomPopin + ']',  async () => {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin , true);
                })

                test('InputField [AJOUTER GROUPE] = "' + sNomGroupe + '"',  async () => { 
                    const iNbChamps= await pageBenefBenef.pPggInputNomGroupeBenef.count(); 
                    await fonction.sendKeys(pageBenefBenef.pPggInputNomGroupeBenef.nth(iNbChamps-1),sNomGroupe , false, 'Nom du groupe');                                  
                })

                test('Button [ENREGISTRER] - Click',  async () => {
                    await fonction.clickAndWait(pageBenefBenef.pPggButtonEnregistrer, page);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin , false);
                })
            })
        })
    })
   
    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})
