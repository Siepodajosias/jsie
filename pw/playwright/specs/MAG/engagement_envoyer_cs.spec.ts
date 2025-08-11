/**
 * 
 * @author JOSIAS SIE
 *  Since 28 - 04 - 2025
 */

const xRefTest      = "MAG_ENG_SND";
const xDescription  = "Envoyer l'engagement au CS";
const xIdTest       =  2140;
const xVersion      = '3.5';

var info:CartoucheInfo = {
	desc            : xDescription,
	appli           : 'MAGASIN',
	version         : xVersion,        
	refTest         : [xRefTest],
	idTest          : xIdTest,
	help            : [],
	params          : ['groupeArticle','nom','ville'],
	fileName        : __filename
}

//----------------------------------------------------------------------------------------

import { expect, test, type Page}from '@playwright/test';

import { TestFunctions }         from "@helpers/functions";
import { Log }                   from "@helpers/log";
import { Help }                  from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }           from '@pom/MAG/menu.page';
import { CommandesEngagements }  from '@pom/MAG/commandes-engagements.page';

import { CartoucheInfo }         from '@commun/types';

//-------------------------------------------------------------------------------------

let page                          : Page;

let menu                          : MenuMagasin;
let pageCmdEng                    : CommandesEngagements;
const log                         = new Log();
const fonction                    = new TestFunctions(log);

//----------------------------------------------------------------------------------------
var sGroupeArticle                = fonction.getInitParam('groupeArticle',fonction.getLocalConfig('groupeArticleEngagement'));
var sNomEngagement                = fonction.getInitParam('nom', fonction.getLocalConfig('assortimentEngagement') + fonction.getToday('FR'));
const sDesignationAssortiment     = sNomEngagement + ' (' + sGroupeArticle +')';
const aListeMagasins              = fonction.getInitParam('ville', fonction.getLocalConfig('listeVilles'));
//-----------------------------------------------------------------------------------------
process.env.ROLE                  = 'RESPONSABLE RAYON';// Connexion par défaut avec le profil ayant le Role RESPONSABLE RAYON
//-----------------------------------------------------------------------------------------
const iQuantite        :number    = 20;
const sStatutAfairer   :string    = 'A faire';
const sStatutEnCours   :string    = 'En cours';
const sStatutEnvoye    :string    = 'Envoyé CS';

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page            = await browser.newPage(); 
	menu            = new MenuMagasin(page, fonction);
	pageCmdEng      = new CommandesEngagements(page);
	const helper    = new Help(info, testInfo, page);
	await helper.init();
})
 
test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test ('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe ('Page [ACCUEIL]', async () => {
		test('Link [BROWSER SECURITY WARNING] - Click', async () => {
			await fonction.waitTillHTMLRendered(page);
			var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
			if(isVisible){
				await menu.removeArlerteMessage(page);
			}else{
				log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
				test.skip();
			}
		})
	})

	test.describe ('Page [COMMANDES]', async () => {
		var pageName:string = 'commandes';

		test('Page [COMMANDES] - Click', async () => {
			await menu.click(pageName, page);
		})

		test('Label [ERREUR][0] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
			await fonction.isErrorDisplayed(false, page);
		})                            

		test.describe ('Onglet [ENGAGEMENTS]', async () => {     

			test('Onglet [ENGAGEMENTS] - Click', async () => {   
				await menu.clickOnglet(pageName, 'engagements', page);
			})

			test('Label [ERREUR][1] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
				await fonction.isErrorDisplayed(false, page);
			})                                 

			aListeMagasins.forEach(async (sMagasin:string) => {
				test ('ListBox [MAGASIN] = "' + sMagasin + '"', async () => {
					await menu.selectVille(sMagasin, page);
				})

				test.describe ('Datagrid [ENGAGEMENT][MAGASIN] = "' + sMagasin + '"', async () => {
					test('Input [ENGAGEMENT] = "' + sNomEngagement + '"', async () => {
						await fonction.sendKeys(pageCmdEng.inputFiltreEngagement, sNomEngagement, false, 'Engagement'); 
						await fonction.waitForDomStable(page);  
					})
	
					test('Td [STATUT ENGAGEMENT] = "' + sStatutAfairer + '"', async () => {
						expect(await pageCmdEng.tdStatutEngagement.locator('span').textContent()).toEqual(sStatutAfairer);   
					})
	
					test('Tr [ENGAGEMENT][STATUT A FAIRE] - Click', async () => {
						await fonction.clickAndWait(pageCmdEng.tdLibelleEngagement.locator('span:text-is("'+sDesignationAssortiment+'")'), page);   
					})
				})

				test.describe ('Datagrid [ARTICLES OUVERTS A LA COMMANDE][MAGASIN] = "' + sMagasin + '"', async () => {
					test('Datagrid [ARTICLES COMMANDE] - Is Visible', async () => {
						await fonction.isDisplayed(pageCmdEng.dataGridEngagements);
					})
	
					test('Input [QUANTITES ENGAGEMENT] = "' + iQuantite + '"', async () => {
						var iNbrInput:number = await pageCmdEng.inputQuantiteEngagement.count();
						for(let i=0;i<iNbrInput; i++){
							await fonction.sendKeys(pageCmdEng.inputQuantiteEngagement.nth(i), iQuantite, false, 'Quantite');
						}
					})  
	
					test('Button [ENREGISTRER] - Click', async () => {
						await fonction.clickAndWait(pageCmdEng.buttonEngeristrer, page);
					}) 
	
					test('Td [STATUT ENGAGEMENT] [' + sMagasin + '] = "'+sStatutEnCours+'"', async () => {
						expect(await pageCmdEng.tdStatutEngagement.locator('span').textContent()).toEqual(sStatutEnCours);   
					})
				})            
	
				test('Button [ENVOYER AU CS][MAGASIN] = "' + sMagasin + '"- Click', async () => {
					await fonction.clickAndWait(pageCmdEng.buttonEnvoyerAuCS, page);
				}) 

				test('** wait until spinner off 2 [' + sMagasin + '] **', async () => {
					await fonction.waitForSpinner(pageCmdEng.spinner);
				})   
				
				test('Td [STATUT ENGAGEMENT] [' + sMagasin + '] = "'+sStatutEnvoye+'"', async () => {
					await fonction.waitForDomStable(page);
					expect(await pageCmdEng.tdStatutEngagement.locator('span').textContent()).toEqual(sStatutEnvoye);   
				})
			})
											
			test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
				await fonction.isErrorDisplayed(false, page); 
			})                            
		})  // En describe Onglet
	}) // end describe Page

	test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})