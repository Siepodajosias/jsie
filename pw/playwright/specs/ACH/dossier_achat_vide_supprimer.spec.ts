/**
 * @author JC CALVIERA
 * @since   2024-03-07
 * 
 */
const xRefTest      = "ACH_DOS_SUP";
const xDescription  = "Supprimer un dossier d'achat vide";
const xIdTest       =  1755;
const xVersion      = '3.1';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : ['dossierAchat', 'rayon'],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { test, type Page, expect}   from '@playwright/test';

import { Help }             		from '@helpers/helpers.js';
import { TestFunctions }    		from '@helpers/functions.js';
import { Log }              		from '@helpers/log.js';

import { MenuAchats }       		from '@pom/ACH/menu.page.js'; 
import { PageRefDosAch }    		from '@pom/ACH/referentiel_dossiers-achats.page';

import { CartoucheInfo } 	        from '@commun/types';

//------------------------------------------------------------------------------------

let page                  	: Page;
let menu                  	: MenuAchats;
let pageRefDosAch         	: PageRefDosAch;

const log                 	= new Log();
const fonction            	= new TestFunctions(log);

//------------------------------------------------------------------------------------

const sNomDossier		= fonction.getInitParam('dossierAchat', 'Ta_ dossier achat vide');
const sRayon        	= fonction.getInitParam('rayon','Fruits et légumes');

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuAchats(page, fonction);
    pageRefDosAch       = new PageRefDosAch(page); 
	const helper 		= new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------  

test.describe.serial('[' + xRefTest + ']', async () => {  
    
    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [REFERENTIEL]', async () => {

        test('ListBox [RAYON] = "' + sRayon + '"', async() => {
            await menu.selectRayonByName(sRayon, page);
        })

        var sPageName = 'referentiel';
        test('Page [REFERENTIEL] - Click', async () => {
            await menu.click(sPageName, page);
        })

        test.describe('Onglet [DOSIERS D\'ACHAT]', async () => {

            var sNomOnglet = 'dossiersAchat';
            test('Onglet [DOSIERS D\'ACHAT]', async () => {
                await menu.clickOnglet(sPageName, sNomOnglet, page);
            })

            test('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })

			test('ListBox [DOSSIER D\'ACHAT] = "' + sNomDossier + '"', async () => {
				await pageRefDosAch.listBoxDossierAchat.selectOption(sNomDossier);
			})

            test('Button SUPPRIMER DOSSIER VIDE] - Click', async () => {
                await fonction.clickElement(pageRefDosAch.buttonSupprimerDossierVide);
            })

            var sNomPopin = 'SUPPRESSION D\'UN DOSSIER D\'ACHAT VIDE';
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomOnglet, true);
                })

                test('Button [SUPPRIMER] - Click', async () => {
                    await fonction.clickAndWait(pageRefDosAch.pButtonSupprimerDossierVide, page);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })
            })

			test('ListBox [DOSSIER D\'ACHAT] = "' + sNomDossier + '" - Is NOT Present', async () => {
                await fonction.clickElement(pageRefDosAch.listBoxDossierAchat);
                await fonction.wait(page, 250);
				//-- On s'attend à ce que le dossier d'achat ne spoit plus présent dans la liste. Donc position -1
				expect(await fonction.getPositionByText(pageRefDosAch.listBoxDossierAchat.locator('option'), sNomDossier)).toEqual(-1);
			})
        })
    })
 
    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})