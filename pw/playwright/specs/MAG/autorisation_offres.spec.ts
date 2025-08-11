/**
 * 
 * @author JOSIAS SIE
 * @since 2024-05-14
 * 
 */
const xRefTest      = "MAG_AUT_PLO";
const xDescription  = "Activation / Désactivation Offres et Autorisations";
const xIdTest       =  7560;
const xVersion      = '3.0';

//------------------------------------------------------------------------------------    

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['ville', 'codeLieuVente','groupeArticle'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }         from '@playwright/test';

import { TestFunctions }           from "@helpers/functions.js";
import { Log }                     from "@helpers/log.js";
import { Help }                    from '@helpers/helpers.js'; 

import { MenuMagasin }             from '@pom/MAG/menu.page.js';
import { PrixGestion }             from '@pom/MAG/prix-gestion.page.js';     
import { AutorisationsPrixLocaux } from '@pom/MAG/autorisations-prix_locaux.page.js';     
import { CartoucheInfo }           from '@commun/types';

//------------------------------------------------------------------------------------

let page             : Page;
const log            = new Log();
const fonction       = new TestFunctions(log);

let menu             : MenuMagasin;
let pagePrixGestion  : PrixGestion;
let pageAutPrixLocaux: AutorisationsPrixLocaux;

//------------------------------------------------------------------------------------

// Exploitation des paramètres passés en argument OU ceux présents dans le fichier de configuration Local
const villeCible     = fonction.getInitParam('ville','Malemort (G914)');
const sCodeLieuVente = fonction.getInitParam('codeLieuVente', 'GF911PO');
const sGroupeArticle = fonction.getInitParam('groupeArticle', 'Coupe / Corner');
//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page             = await browser.newPage(); 
	pagePrixGestion  = new PrixGestion(page);
	menu             = new MenuMagasin(page, fonction);
	pageAutPrixLocaux= new AutorisationsPrixLocaux(page);
	const helper     = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//-------------------------------------------------------------------------------------

test.describe ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})
	
	test ('Connexion', async () => {
		await fonction.connexion(page);
	})

    test.describe('Page [ACCUEIL]', () => {
        
		//-- Message d'avertissement (Check Browser) spécifique à l'application SIGALE Magasin
		//-- Click sur le lien de confirmation pour faire disparaître le message d'alerte 
		test ('Link [BROWSER SECURITY WARNING][RR] - Click', async () => {
			var isVisible = await menu.linkBrowserSecurity.isVisible();
			if (isVisible) {
				var isActive = await menu.linkBrowserSecurity.isEnabled();
				if(isActive){
					await fonction.clickElement(menu.linkBrowserSecurity);
				}
			}
		})

        test ('ListBox [VILLE] = "' + villeCible + '"', async () => {
            await menu.selectVille(villeCible, page);
        })  
    })

    //---

    test.describe('Page [AUTORISATION][First]', () => {

        var pageName = 'autorisations';

        test ('Page [AUTORISATION] - Click', async () => {
			await menu.click(pageName, page);                                // On ouvre la page
		})

		test ('Label [ERREUR][AUTORISATION] - Is Not Visible', async () => { // Pas d'erreur affichée à priori au chargement de la page
			await fonction.isErrorDisplayed(false, page);
		})
        
        test.describe ('Onglet [PARAMETRAGE]', () => {        

            test('Onglet [PARAMETRAGE] - Click', async () => {
                await menu.clickOnglet(pageName, 'prixLocaux', page);
            })

            test ('Input [DESIGNATION MAGASIN] = "' + sCodeLieuVente + '"', async () => {
                await fonction.sendKeys(pageAutPrixLocaux.inputCodeDesignMagasin, sCodeLieuVente);
                await fonction.wait(page, 250);
            }) 

            test ('td [DESIGNATION][0] - Click', async () => {
                await fonction.clickAndWait(pageAutPrixLocaux.tdListeLibellesLDV.first(), page);
            })

            test ('CheckBox [TOUTES OFFRES] - Uncheck', async () => {
                var bChecked = await pageAutPrixLocaux.checkBoxAllOffres.getAttribute('checked');
                if (bChecked) {
                    await fonction.clickElement(pageAutPrixLocaux.checkBoxAllOffres);      // Uncheck all
                }
            })

            test ('CheckBox [AUTORISATION CASSE FRAIS] - Uncheck', async () => {
                var bChecked = await pageAutPrixLocaux.checkBoxAuthCasseFrais.getAttribute('checked');
                if (bChecked) {
                    await fonction.clickElement(pageAutPrixLocaux.checkBoxAuthCasseFrais); // Uncheck all
                }
            })

            test ('CheckBox [AUTORISATION ALIGNEMENT CONCURRENCE] - Uncheck', async () => {
                var bChecked = await pageAutPrixLocaux.checkBoxAuthAlignConc.getAttribute('checked');
                if (bChecked) {
                    await fonction.clickElement(pageAutPrixLocaux.checkBoxAuthAlignConc);  // Uncheck all
                }
            })

            test ('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickElement(pageAutPrixLocaux.buttonEnregistrer);
            })
        })
    })
    
    //---

    test.describe('Page [PRIX]', () => {

        var pageName = 'prix';

        test ('Page [PRIX] - Click', async () => {
			await menu.click(pageName, page);                           // On ouvre la page
		})

		test ('Label [ERREUR][PRIX][1] - Is Not Visible', async () => { // Pas d'erreur affichée à priori au chargement de la page
			await fonction.isErrorDisplayed(false, page);
		})

        test.describe ('Onglet [GESTION DES PRIX]', () => {        

            test ('Onglet [GESTION DES PRIX] - Click', async () => {
                await menu.clickOnglet(pageName, 'gestionPrix', page);
            })

            test ('Filtre [GROUPE ARTICLE] : '+ sGroupeArticle, async () => {
                await fonction.clickElement(pagePrixGestion.listBoxGrpArticle);
                await pagePrixGestion.listBoxGrpArticle.selectOption({label: sGroupeArticle});
            })

            test('Button [OFFRE] [Is - visible] - Check', async () => {
                await fonction.isDisplayed(pagePrixGestion.buttonOffre);
            })
        })
    })
    
    //---
        
    test.describe('Page [AUTORISATION]', () => {

        var pageName = 'autorisations';

        test ('Page [AUTORISATION] - Click', async () => {
			await menu.click(pageName, page);                                // On ouvre la page
		})

		test ('Label [ERREUR][AUTORISATION] - Is Not Visible', async () => { // Pas d'erreur affichée à priori au chargement de la page
			await fonction.isErrorDisplayed(false, page);
		})

        test.describe ('Onglet [PARAMETRAGE]', () => {        

            test ('Onglet [PARAMETRAGE] - Click', async () => {
                await menu.clickOnglet(pageName, 'prixLocaux', page);
            })

            test ('Input [DESIGNATION MAGASIN] = "' + sCodeLieuVente + '"', async () => {
                await fonction.sendKeys(pageAutPrixLocaux.inputCodeDesignMagasin, sCodeLieuVente);
                await fonction.wait(page, 350);
            })

            test ('td [DESIGNATION][0] - Click', async () => {
                await fonction.clickAndWait(pageAutPrixLocaux.tdListeLibellesLDV.first(), page);
            })

            test ('CheckBox [TOUTES OFFRES] - Check', async () => {
                var bChecked = await pageAutPrixLocaux.checkBoxAllOffres.getAttribute('checked');
                if (bChecked) {

                } else {
                    await fonction.clickElement(pageAutPrixLocaux.checkBoxAllOffres);      // Check all
                }
            })

            test ('CheckBox [AUTORISATION CASSE FRAIS] - Check', async () => {
                var bChecked = await pageAutPrixLocaux.checkBoxAuthCasseFrais.getAttribute('checked');
                if (bChecked) {

                } else {
                    await fonction.clickElement(pageAutPrixLocaux.checkBoxAuthCasseFrais); // Check all
                }
            })

            test('CheckBox [AUTORISATION ALIGNEMENT CONCURRENCE] - Check', async () => {
                var bChecked = await pageAutPrixLocaux.checkBoxAuthAlignConc.getAttribute('checked');
                if (bChecked) {

                } else {
                    await fonction.clickElement(pageAutPrixLocaux.checkBoxAuthAlignConc);  // Check all
                }
            })

            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickElement(pageAutPrixLocaux.buttonEnregistrer);
            })
        })
        //---
    }) // end describe Page

	test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});
}) // end describe