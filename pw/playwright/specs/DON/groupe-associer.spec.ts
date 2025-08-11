/**
 * 
 * @author JOSIAS SIE
 * @since 2024-12-27
 *  
 */
const xRefTest      = "DON_BEN_ASG";
const xDescription  = "Associer un groupe";
const xIdTest       = 6570;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'DONS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['nomGroupe'],
    fileName    : __filename
}

//--------------------------------------------------------------------------------------------// 

import { expect, test, type Page }from '@playwright/test';

import { Help }                   from '@helpers/helpers';
import { TestFunctions }          from '@helpers/functions';
import { Log }                    from '@helpers/log';

import { MenuDon }                from '@pom/DON/menu.page';
import { BeneficiaireDons }       from '@pom/DON/beneficiares-beneficiaires.page';

import { CartoucheInfo }          from '@commun/types/index';

//--------------------------------------------------------------------------------------------// 

let page                : Page;
let menu                : MenuDon;

let pageBenefBenef      : BeneficiaireDons;

const log               = new Log();
const fonction          = new TestFunctions(log);

//--------------------------------------------------------------------------------------------//

var sNomGroupe          = fonction.getInitParam('nomGroupe','Ta_ajoutGroupe modifié '+ fonction.getToday('FR') + ' ' + fonction.getBadChars());

//-------------------------------------------------------------------------------------------//

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

//-------------------------------------------------------------------------------------------//

test.describe.serial ('[' + xRefTest + '] - ' + xDescription + ' : ', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();		
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [BENEFICIAIRES]',  async () => {

        var sNomPage:string = 'beneficiaires';

        test('Page [BENEFICIAIRES] - Click', async () => {
            await menu.click(sNomPage, page);
        })

        test.describe ('Onglet [BENEFICIAIRES]',  async () => {

            test('CheckBox [LISTE BENEFICIARES][0] - Click',  async () => {
                await fonction.clickElement(pageBenefBenef.checboxListeBeneficiaire.nth(0));
            })
            
            test('CheckBox [LISTE BENEFICIARES][1] - Click',  async () => {
                await fonction.clickElement(pageBenefBenef.checboxListeBeneficiaire.nth(1));
            })

            test('Button [ASSOCIER AU GROUPE] - Click',  async () => {
                await fonction.clickAndWait(pageBenefBenef.buttonAssocierGroupe, page);
            })

            var sNomPopin:string = 'Associer les bénéficiaires à un groupe';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']',  async () => {
                
                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin , true);
                })

                test('ListBox [GROUPE] = "' + sNomGroupe + '" - Select',  async () => {
                    await fonction.clickElement(pageBenefBenef.pPagListBoxGroupe);
                    await fonction.clickElement(pageBenefBenef.pPagListBoxItemGroupe.filter({hasText: sNomGroupe}));
                })

                test('Button [ENREGISTRER] - Click',  async () => {
                    await fonction.clickAndWait(pageBenefBenef.pPagButtonEnregistrer, page);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin , false);
                })

                test('Column [GROUPE][0] = "' + sNomGroupe + '" - Check',  async () => {  
                    var sLabelGroupe = await pageBenefBenef.pTdGroupe.nth(0 ).textContent();
                    expect(sLabelGroupe).toContain(sNomGroupe);
                })

                test('Column [GROUPE][1] = "' + sNomGroupe + '" - Check',  async () => {  
                    var sLabelGroupe = await pageBenefBenef.pTdGroupe.nth(1).textContent();
                    expect(sLabelGroupe).toContain(sNomGroupe);
                })
            })
        })
    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})