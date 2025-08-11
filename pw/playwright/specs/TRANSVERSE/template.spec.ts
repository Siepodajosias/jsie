/**
 * @author JC CALVIERA
 * @description Associer des articles à un dossier d'achat et contrôle du flux envoyé vers FACTURATION et REPARTITION
 * @since 2024-03-07
 * 
 */
const xRefTest      = "ACH_DOS_ASS";
const xDescription  = "Associer des articles à un dossier d'achat";
const xIdTest       =  255;
const xVersion      = '3.0';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : [],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { test, type Page}   from '@playwright/test';

import { Help }             from '@helpers/helpers';
import { TestFunctions }    from '@helpers/functions';
import { Log }              from '@helpers/log';
import { EsbFunctions }     from '@helpers/esb';

import { MenuAchats }       from '@pom/ACH/menu.page'; 
import { PageRefDosAch }    from '@pom/ACH/referentiel_dossiers-achats.page';

import { CartoucheInfo, TypeEsb } from '@commun/types';

//------------------------------------------------------------------------------------

let page                  	: Page;
let menu                  	: MenuAchats;
let pageRefDosAch         	: PageRefDosAch;
let esb                     : EsbFunctions;

const log                 	= new Log();
const fonction            	= new TestFunctions(log);

//------------------------------------------------------------------------------------

const sNomDossier           = 'Test-auto_dossierachat-' + fonction.getToday();
const iNbArticles           = 10;   // nombre d'articles à associer

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuAchats(page, fonction);
    pageRefDosAch       = new PageRefDosAch(page); 
	const helper 		= new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

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

            var sNomPopin = "Création d'un dossier d'achat";
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test('Button [CREER DOSSIER] - Click', async () => {
                    await fonction.clickAndWait(pageRefDosAch.buttonCreerDossier, page);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomOnglet, true);
                })

                test('InputField [NOM DOSSIER D\'ACHAT] = "' + sNomDossier + '"', async () => { 
                    await fonction.sendKeys(pageRefDosAch.pInputNomDossier, sNomDossier);
                    log.set('Nom du dossier d\'achat : ' + sNomDossier);
                })

                test('ListBox [RESPONSABLE][Rnd] - Select', async () => {
                    await pageRefDosAch.pListBoxResponsable.click();
                    var iNbLine = await pageRefDosAch.pListBoxResoonsableItem.count();
                    var iCible  = Math.floor(Math.random()*(iNbLine - 1) + 1);
                    var sText   = await pageRefDosAch.pListBoxResoonsableItem.nth(iCible).textContent();
                    log.set('Responsable : ' + sText);
                    await pageRefDosAch.pListBoxResoonsableItem.nth(iCible).click();
                })

                test('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pageRefDosAch.pButtonEnregistrerDossier, page);
                })

                test('Link [ANNULER] - Click Conditionnel', async () => {
                    var alertIsVisible = await pageRefDosAch.pFeedBackErrorDossier.isVisible();
                    var linkIsVisible  = await pageRefDosAch.pLinkAnnulerDossier.isVisible();
                    if(linkIsVisible){

                        if(alertIsVisible){
                            var sAlertMessage = await pageRefDosAch.pFeedBackErrorDossier.textContent();
                            log.set('Erreur : ' + sAlertMessage);
                        }
                        await fonction.clickAndWait(pageRefDosAch.pLinkAnnulerDossier, page);
                    }else{

                        log.set('Link [ANNULER] - Click Conditionnel : ACTION ANNULEE');
                        test.skip();
                    }

                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })

            }); //-- POPIN

        }); //-- ONGLET
		
    }); //-- PAGE
 

	test('** CHECK FLUX **', async () =>  {

		const oFlux:TypeEsb = { 
			FLUX : [
				{
					NOM_FLUX        : 'Facture_Alusta_X3',
					TITRE           : 'Transfert facture de alusta vers X3',
                    STOP_ON_FAILURE : true                          // Optionnel - Indique que le TA doit échouer si ce flux échoue
				},
				{
					NOM_FLUX    : 'EnvoyerAchat_Alusta',
					TITRE       : 'Achat N°%'
				}
			],
			WAIT_BEFORE     : 3000,                 	// Optionnel
			VERBOSE_MOD     : false,                  	// Optionnel car écrasé globalement
            STOP_ON_FAILURE : false                     // Optionnel - Indique que le TA doit échouer si AU MOINS 1 flux échoue
		};

		await esb.checkFlux(oFlux, page);

	})


    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})