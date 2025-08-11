/**
 * @author JC CALVIERA
 * @description Associer des articles à un dossier d'achat et contrôle du flux envoyé vers FACTURATION et REPARTITION
 * @since   2024-03-07
 * 
 */
const xRefTest      = "ACH_DOS_ASS";
const xDescription  = "Associer des articles à un dossier d'achat";
const xIdTest       =  255;
const xVersion      = '3.7';
 
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

import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';
import { EsbFunctions }             from '@helpers/esb';

import { MenuAchats }               from '@pom/ACH/menu.page'; 
import { PageRefDosAch }            from '@pom/ACH/referentiel_dossiers-achats.page';

import { CartoucheInfo, TypeEsb }   from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;
let pageRefDosAch   : PageRefDosAch;

const log           = new Log();
const fonction      = new TestFunctions(log);
const esb           = new EsbFunctions(fonction);

//------------------------------------------------------------------------------------

var oData:any       = fonction.importJdd();

var sNomDossierMaj  = fonction.getLocalConfig('dossierAchat');                      // En majuscule par défaut
var sNomDossierCap  = fonction.capitalizeFirstLetter(sNomDossierMaj);               // Minuscule sauf initiale
const iNbArticles   = 10;                                                           // nombre d'articles à associer

var sNomDossier     = fonction.getInitParam('dossierAchat', sNomDossierCap);
const sRayon        = fonction.getInitParam('rayon', 'Fruits et légumes');

if (oData !== undefined) {                                                          // On est dans le cadre d'un E2E. Récupération des données temporaires
    sNomDossier = fonction.capitalizeFirstLetter(oData.sDossierAchat);              // L'élément recherché est le nom du dossier d'achat préalablement créé dans le E2E             
    log.set('E2E - Nom Dossier : ' + sNomDossier );
}

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

test.describe.serial ('[' + xRefTest + ']', async () => {  
    
    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [REFERENTIEL]', async () => {

        test ('ListBox [RAYON] = "' + sRayon + '"', async() => {
            await menu.selectRayonByName(sRayon, page);
        });

        var sPageName = 'referentiel';
        test ('Page [REFERENTIEL] - Click', async () => {
            await menu.click(sPageName, page);
        })

        test.describe ('Onglet [DOSIERS D\'ACHAT]', async () => {

            var sNomOnglet = 'dossiersAchat';
            test ('Onglet [DOSIERS D\'ACHAT]', async () => {
                await menu.clickOnglet(sPageName, sNomOnglet, page);
            })

            test ('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })

            test ('CheckBox [ARTICLES][rnd x ' + iNbArticles + '] - Click', async() => {

                const iNbChoix = await pageRefDosAch.checkBoxListeArticles.count();
                let iChoix:number, iCpt:number = 0;
                let sNomArticle:string, sPtfDistrib:string, sNomDossier:string;
                let aChoix:any = [];

                // On sélectionne iNbArticles articles à associer
                do {
                    iChoix = Math.floor(fonction.random() * iNbChoix);

                    sNomArticle = await pageRefDosAch.dataGridDesignArticle.nth(iChoix).textContent();

                    //-- On sélectionne un article dont le la longueur du libellé soit > 2 caractères (on filtre les "." et "..")
                    //&& aChoix.includes(iCpt) === false
                    if (sNomArticle.length > 2 && aChoix.includes(iChoix) === false) {
                       
                        iCpt++;
                        aChoix.push(iChoix);

                        sNomDossier = await pageRefDosAch.dataGridNomDossier.nth(iChoix).textContent();
                        sPtfDistrib = await pageRefDosAch.dataGridPtfDistrib.nth(iChoix).textContent();

                        await fonction.clickElement(pageRefDosAch.checkBoxListeArticles.nth(iChoix));

                        log.set('Article : ' + sNomArticle + ' - Ptf Distrib : ' + sPtfDistrib + ' - Nom Dossier : \'' + sNomDossier + '\'');
                    }
                  
                 } while(iCpt < iNbArticles)

                expect(await pageRefDosAch.dataGridDossierAchat.first().textContent()).toEqual(iNbArticles.toString());
            })

            test ('Button [REAFFECTER ARTICLE] - Click', async () => {
                await fonction.clickElement(pageRefDosAch.buttonReaffecterArticle);
            })

            var sNomPopin = 'Changement de dossier d\'achat';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomOnglet, true);
                })

                test ('ListBox [NOM DOSSIER ACHAT] = "' + sNomDossier + '"', async () => {
                    await fonction.ngClickListBox(pageRefDosAch.pListBoxNomDossierAchat, sNomDossier, page.locator('[role="option"]'));
                    await fonction.waitTillHTMLRendered(page);
                })

                test ('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pageRefDosAch.pButtonEnregistrerChangement, page);
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })

            })

            test ('ListBox [DOSSIER ACHAT] = "' + sNomDossier + '"', async () => {
                await pageRefDosAch.listBoxDossierAchat.selectOption(sNomDossier);
                await fonction.wait(page, 500);
            })

            test ('td [ARTICLES][0-' + iNbArticles + '] = "' + sNomDossier + '"', async() => {
                expect(await pageRefDosAch.dataGridNomDossier.count()).toBe(iNbArticles);                             
            })

        })
		
    })
 
    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

	test ('** CHECK FLUX **', async () =>  {

		const oFlux:TypeEsb = { 
			FLUX : [
				{
					NOM_FLUX    : 'EnvoyerDossierAchat_Prefac',
					TITRE       : 'Dossier :%'
				},
				{
					NOM_FLUX    : 'EnvoyerDossierAchat_Qualite',
					TITRE       : 'Dossier :%'
				},
				{
					NOM_FLUX    : 'EnvoyerDossierAchat_Mag',
					TITRE       : 'Dossier :%'
				},
				{
					NOM_FLUX    : 'EnvoyerDossierAchat_Repart',
					TITRE       : 'Dossier :%'
				}
			],
			WAIT_BEFORE     : 10000,                 	// Optionnel
			VERBOSE_MOD     : false,                  	// Optionnel car écrasé globalement
		};

		await esb.checkFlux(oFlux, page);

	})

})