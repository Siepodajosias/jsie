/**
 * 
 * @author SIAKA KONE
 * @since 2024-05-22
 * 
 */
const xRefTest      = "MAG_AUT_AC3";
const xDescription  = "Suppression d'Articles à un Assortiment";
const xIdTest       =  1028;
const xVersion      = '3.3';
	
//------------------------------------------------------------------------------------ 
var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'MAGASIN',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['listeArticles','groupeArticle','nomAssortiment'],
	fileName    : __filename
}
//------------------------------------------------------------------------------------

import { expect, test, type Page }    from '@playwright/test';

import { TestFunctions }              from "@helpers/functions";
import { Log }                        from "@helpers/log";
import { Help }                       from '@helpers/helpers';

import { MenuMagasin }                from '@pom/MAG/menu.page'; 
import { AutorisationsAchatsCentrale }from '@pom/MAG/autorisations-achats_centrale.page';    

import { CartoucheInfo }              from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pageAutoAC          : AutorisationsAchatsCentrale;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------
const sListeArticles    = fonction.getInitParam('listeArticles', '5700,5800,5900,6000');
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Fruits et légumes');
const sDesignGrpAssort  = fonction.getInitParam('nomAssortiment', 'Fruits Et Légumes'); 
//------------------------------------------------------------------------------------

const aListeArticle 	= sListeArticles.split(',');

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage(); 
	pageAutoAC          = new AutorisationsAchatsCentrale(page);
	menu                = new MenuMagasin(page, fonction);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//-------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})
	
	test ('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe ('Page [AUTORISATIONS]', () => {
		
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

		test ('Popin [AUTORISATIONS] - Click', async () => {
			await menu.removeArlerteMessage(page);
		})

		var pageName:string = 'autorisations';

		test ('Page [STOCK] - Click', async () => {
			await menu.click(pageName, page);                         // On ouvre la page
		})

		test ('Label [ERREUR] - Is Not Visible', async () => {    // Pas d'erreur affichée à priori au chargement de la page
			await fonction.isErrorDisplayed(false, page);
		})

		test.describe ('Onglet [AUTORISATIONS ACHATS CENTRALE]', () => {     

            test ('Onglet [AUTORISATIONS ACHATS CENTRALE] - Click', async () => {
                await menu.clickOnglet(pageName, 'autorisationAchatCentrale', page);
            })  
 
            test ('Input [ASSORTIMENTS] [' + sDesignGrpAssort + ']', async () => {
                await fonction.sendKeys(pageAutoAC.inputAssortiment, sDesignGrpAssort, false, 'Désignation assortiment');
            })

			test ('CheckBox [ASSORTIMENT][0] = ' + sDesignGrpAssort + ' - Click', async () => {
				await fonction.wait(page,250);
				var sText:string = sDesignGrpAssort + ' (' + sGroupeArticle + ')'
				await fonction.clickElement(pageAutoAC.checkBoxAssortiments.locator('td:text-is("'+sText+'")'));
			})

			aListeArticle.forEach((sCodeArticle:string) => {

				test.describe ('Article : ' + sCodeArticle, () => {

					let iNbreLigne:number;

					test ('Input [CODE ARTICLE] = "' + sCodeArticle + '"', async () => {
						await fonction.sendKeys(pageAutoAC.dataGridHeaderCdeArt, sCodeArticle, false, 'Code article');
						await fonction.wait(page,300);
					})

					test ('td [ARTICLE][first] - Click (Optionnel)', async () => {
						test.setTimeout(120000);
						iNbreLigne = await pageAutoAC.trLignesArticles.count();
						log.set('Nombre de lignes ayant ce code article : ' + iNbreLigne);
						if(iNbreLigne > 0) {
							await fonction.clickElement(pageAutoAC.trLignesArticles.first());
						} else {
							log.set('Article : ' + sCodeArticle + ' Ignoré !');
							test.skip();
						}
					})

					test ('Button [SUPPRIMER] - Click (Optionnel)', async () => {
						let iDelay:number = 120000;
						test.setTimeout(iDelay);
						if(iNbreLigne > 0) {
							await fonction.clickAndWait(pageAutoAC.buttonSupprimerLigne, page, iDelay);
						} else {
							test.skip();
						}
					})

					var sNomPopin:string = 'CONFIRMER LA SUPPRESSION';
					test.describe ('Popin [' + sNomPopin + ']' + sCodeArticle, async () => {

						test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
							if(iNbreLigne > 0) {
								await fonction.popinVisible(page, sNomPopin , true);
							} else {
								test.skip();
							}								
						})
						
						test('Buton [OUI] - Click', async () => {
							if(iNbreLigne > 0) {
								await fonction.clickAndWait(pageAutoAC.pButtonConfirmOui, page); 
							} else {
								test.skip();
							}
						})

						test ('** Wait Until Spinner Off **', async () => {
							if(iNbreLigne > 0) {
								await fonction.waitForSpinner(pageAutoAC.pPspinner);
							} else {
								test.skip();
							}
						})
				
						test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
							if(iNbreLigne > 0) {
								await fonction.popinVisible(page, sNomPopin , false);
							} else {
								test.skip();
							}
						})

					})

				})

			})

			test.describe ('Check suppression tous les articles', async () => {

				aListeArticle.forEach((sCodeArticle:string) => {

					test.describe ('Article : ' + sCodeArticle, () => {

						test ('Input [CODE ARTICLE] = "' + sCodeArticle + '"', async () => {
							await fonction.sendKeys(pageAutoAC.dataGridHeaderCdeArt, sCodeArticle, false, 'Code article');
							await fonction.wait(page,300);
						})
		
						test ('Count [ARTICLES] = "0"', async () => {
							const iNbreLigne:number = await pageAutoAC.trLignesArticles.count();
							expect(iNbreLigne).toEqual(0);
						})

					})

				})

			})

		})  

	}) 

	test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})