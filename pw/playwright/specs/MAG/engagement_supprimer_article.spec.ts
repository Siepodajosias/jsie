/**
 * 
 * @author JOSIAS SIE
 * @since 2024-05-10
 * 
 */
const xRefTest      = "MAG_ENG_DEL";
const xDescription  = "Supprimer un article d'un Engagement";
const xIdTest       =  1041;
const xVersion      = '3.3';
	
//------------------------------------------------------------------------------------ 
var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'MAGASIN',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['groupeArticle'],
	fileName    : __filename
};
//------------------------------------------------------------------------------------

import { expect, test, type Page } from '@playwright/test';

import { TestFunctions }           from "@helpers/functions";
import { Log }                     from "@helpers/log";
import { Help }                    from '@helpers/helpers';

import { MenuMagasin }             from '@pom/MAG/menu.page'; 
import { AutorisationsEngagements }from '@pom/MAG/autorisations-engagements.page';     
import { CartoucheInfo }           from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pageAutEngagement   : AutorisationsEngagements;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------
var sGroupeArticle             = fonction.getInitParam('groupeArticle','Fruits et légumes');
var sNomEngagement             = fonction.getLocalConfig('assortimentEngagement');
sNomEngagement                 = sNomEngagement + fonction.getToday('FR');
const sDesignationAssortiment  = sNomEngagement + ' (' + sGroupeArticle +')';

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage(); 
	pageAutEngagement   = new AutorisationsEngagements(page);
	menu                = new MenuMagasin(page, fonction);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//-------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	});
	
	test ('Connexion', async () => {
		await fonction.connexion(page);
	});

	test.describe('Page [AUTORISATIONS]', () => {
		
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
		});

		test ('Popin [AUTORISATIONS] - Click', async () => {
			await menu.removeArlerteMessage(page);
		});

		var pageName:string = 'autorisations';

		test ('Page [STOCK] - Click', async () => {
			await menu.click(pageName, page);                         // On ouvre la page
		})

		test ('Label [ERREUR][1] - Is Not Visible', async () => {    // Pas d'erreur affichée à priori au chargement de la page
			await fonction.isErrorDisplayed(false, page);
		})

		test.describe('Onglet [ENGAGEMENTS]', () => {     

			test ('Onglet [ENGAGEMENTS] - Click', async () => {       
				await menu.clickOnglet(pageName, 'engagements', page);
			})

			test ('Label [ERREUR][2] - Is Not Visible', async () => { // Pas d'erreur affichée à priori au chargement de l'onglet
				await fonction.isErrorDisplayed(false, page);
			})                          
  
			test('Input [ASSORTIMENT] = "' + sNomEngagement + '"', async () => {
				await fonction.sendKeys(pageAutEngagement.inputAssortiment, sNomEngagement, false, 'Designation assortiment');
				await fonction.wait(page, 500);
			})  

			test ('CheckBox [LISTE ASSORTIMENTS][' + sDesignationAssortiment + '] - Click', async () => {
				var iNbLibelleAssort = await pageAutEngagement.checkBoxListeAssort.count();
                if(iNbLibelleAssort > 0) {

                    for ( let iLibelleAssort = 0 ; iLibelleAssort < iNbLibelleAssort; iLibelleAssort++){
                        var sCible = await pageAutEngagement.checkBoxListeAssort.nth(iLibelleAssort).textContent();
                        if(sCible.includes(sDesignationAssortiment)){ 

                            await fonction.clickAndWait(pageAutEngagement.checkBoxListeAssort.nth(iLibelleAssort), page);
                            break;  
                        }else if((iLibelleAssort == iNbLibelleAssort - 1) && !sCible.includes(sDesignationAssortiment)){

                            throw new Error('Acune correspondance à Saprimex dans la liste de commande');
                        }
                    }
                }else{

                    throw new Error('AUCUNE COMMANDE EXISTANTE');
                }
			})

			test ('ListBox [DOSSIER D\'ACHAT] = "Tous"', async () => {
				var isActive = await pageAutEngagement.listBoxDossierAchat.isEnabled();
				if(isActive){
					await pageAutEngagement.listBoxDossierAchat.selectOption({index:0})
				}
			})
			
			test ('CheckBox [ALL ARTICLES] - Click', async () => {
				await fonction.clickElement(pageAutEngagement.checkBoxAllArticles);
			})

			test ('Button [SUPPRIMER LIGNE] - Click', async () => {
				await fonction.clickAndWait(pageAutEngagement.buttonSupprimerLigne, page);
			})

			test.describe ('Popin [CONFIRMER LA SUPPRESSION]', () => {
				test ('Popin [CONFIRMER LA SUPPRESSION][1] - Check', async () =>  {
					await fonction.popinVisible(page,'CONFIRMER LA SUPPRESSION', true);
				})

				test ('Button [OUI] - Click', async () => {
					await fonction.clickAndWait(pageAutEngagement.pPButtonOui, page);
				})

				test ('** Wait Until Spinner Off **', async () => {
					await fonction.waitForSpinner(pageAutEngagement.spanSpinner);
				})

				test ('Popin [CONFIRMER LA SUPPRESSION][2] - Check', async () =>  {
					await fonction.popinVisible(page,'CONFIRMER LA SUPPRESSION', false);
				})
			})

			test ('Count [ARTICLES] = "0"', async () => {
				var nbArticles = await pageAutEngagement.checkBoxListeArticles.count();
				expect(nbArticles).toEqual(0);
			})
		})  // En describe Onglet
	}) // end describe Page

	test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});
}) // end describe