/**
 * 
 * @author SIAKA KONE
 * @since 2024-11-27
 * 
 */

const xRefTest      = "QUA_MOB_AUM";
const xDescription  = "Gerer Les Univers";
const xIdTest       =  6643;
const xVersion      = '3.0';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'QUALITE',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['lieuDeVente'],
	fileName    : __filename
};

import {  test, type Page }                 from '@playwright/test';
import { CartoucheInfo }                    from '@commun/types';

import { Help }                  			from '@helpers/helpers';
import { TestFunctions }         			from '@helpers/functions';
import { Log }                   			from '@helpers/log';

import { MenuQualite }           			from '@pom/QUA/menu.page';
import { ReferentielMobiliers }             from '@pom/QUA/referentiel-mobiliers.page';

let page                					: Page;
let menu                					: MenuQualite;
let pageReferentielMobiliers                : ReferentielMobiliers;

const log               					= new Log();
const fonction          					= new TestFunctions(log);

// Exploitation des paramètres passés en argument OU ceux présents dans le fichier de configuration Local

const sLieudeVente                         = fonction.getInitParam('lieuDeVente', 'TA_lieu vente'); 

test.beforeAll(async ({ browser }, testInfo) => {
    page            						= await browser.newPage();
    menu            						= new MenuQualite(page, fonction);
    pageReferentielMobiliers                = new ReferentielMobiliers(page);
    const helper    						= new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

test.describe.serial ('[' + xRefTest + ']', async () =>  {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () =>  {
        await fonction.connexion(page);
    })

    var sNomPage:string = 'referentiel';

    test.describe ('Page [' + sNomPage.toUpperCase() + ']', async () => {

        test ('Menu [' + sNomPage.toUpperCase() + '] - Click', async () =>  {
			await menu.click(sNomPage, page);
		})
        
        var sNomOnglet:string = 'mobiliers';

		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async () =>  {

            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage, sNomOnglet, page);
			})

            test ('ListBox [LIEUX DE VENTE] = "' + sLieudeVente + '"', async () => {  
                await fonction.clickElement(pageReferentielMobiliers.listBoxLieuVente);
                await fonction.sendKeys(pageReferentielMobiliers.inputLieuVente, sLieudeVente, false, 'Lieu De Vente');
                await fonction.clickElement(pageReferentielMobiliers.pdropdownLieuVente.nth(0));
            }) 

            var sNomPopin:string = 'Gestion des univers';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test ('Button [GERER LES ELEMENTS]- Click', async () => {  
                    await fonction.clickAndWait(pageReferentielMobiliers.buttonGererlesUnivers, page);
                }) 

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page,sNomPopin.toUpperCase(), true);
                })

                test ('Button [ANNULER] - Click', async () => {  
                    await fonction.clickAndWait(pageReferentielMobiliers.pPGuvbuttonAnnuler, page);
                }) 

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page,sNomPopin.toUpperCase(), false);
                })

            })   

        })
    })

    test ('Déconnexion', async () =>  {
        await fonction.deconnexion(page);
    })

})