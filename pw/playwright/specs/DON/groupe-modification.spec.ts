/**
 * 
 * @author JOSIAS SIE
 * @since 2024-12-27
 *  
 */
const xRefTest      = "DON_GRP_UPD";
const xDescription  = "Modifier un groupe";
const xIdTest       = 5173;
const xVersion      = '3.2';

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

var sNomGroupe          = fonction.getInitParam('nomGroupe','Ta_ajoutGroupe '+ fonction.getToday('FR') + ' ' + fonction.getBadChars());
var sModifierGroupe     = fonction.getInitParam('nom', 'Ta_ajoutGroupe modifié ' + fonction.getToday('FR') + ' ' + fonction.getBadChars());

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

test.describe.serial ('[' + xRefTest + '] - ' + xDescription + ' : ',  () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();		
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [BENEFICIAIRES]',  async () => {

        var sNomPage:string = 'beneficiaires';

        test ('Page [BENEFICIAIRES] - Click', async () => {
            await menu.click(sNomPage, page);
        })

        test.describe ('Onglet [BENEFICIAIRES]',  async () => {

            test ('Button [GERER GROUPES] - Click',  async () => {
                await fonction.clickAndWait(pageBenefBenef.buttonGererGroupe, page);
            })

            var sNomPopin:string = 'GERER DES GROUPES';
            test.describe ('[' + sNomPopin + ']',  async () => {
                
                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin , true);
                })

                test ('InputField [MODIFIER GROUPE] = "' + sModifierGroupe + '"',  async () => {

					const allGroup = await pageBenefBenef.pPggLigneGroupeBenef.all();
					let bGroupeTrouve = false;

                    for (const group of allGroup) {
                        const inputLocator = pageBenefBenef.getInputNomGroupeDansLigneGroupeBenef(group);
                        const sInputValeur = await inputLocator.inputValue();
                    
                        if (sInputValeur.trim() === sNomGroupe.trim()) {
                            await fonction.sendKeys(inputLocator, sModifierGroupe, false, 'Nom Groupe modifié');
                            bGroupeTrouve = true;
                            break;
                        }
                    }

					if (!bGroupeTrouve) {
						throw new Error(`Le groupe "${sNomGroupe}" n'a pas été trouvé dans la liste pour être modifié en "${sModifierGroupe}".`);
					}

                })

                test ('Button [ENREGISTRER] - Click',  async () => {
                    await fonction.clickAndWait(pageBenefBenef.pPggButtonEnregistrer, page);
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin , false);
                })

            })

        })

    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})