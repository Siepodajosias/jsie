/**
 *
 * @author JOSIAS SIE
 * @since 2024-04-23
 * 
 */
const xRefTest      = "MAG_PAS_ENG";
const xDescription  = "Notification d'un engagement à passer";
const xIdTest       =  7278;
const xVersion      = '3.0';

//------------------------------------------------------------------------------------    
var info:CartoucheInfo = {
	desc       : xDescription,
	appli      : 'MAGASIN',
	version    : xVersion,
	refTest    : [xRefTest],
	idTest     : xIdTest,
	help       : [],
	params     : ['ville'],
	fileName   : __filename
};
//------------------------------------------------------------------------------------
  
import { expect, test, type Page }  from '@playwright/test';

import { TestFunctions }            from "@helpers/functions.js";
import { Log }                      from "@helpers/log.js";
import { Help }                     from '@helpers/helpers';
import { CartoucheInfo }            from '@commun/types';
import { MenuMagasin }              from '@pom/MAG/menu.page.js';
import { CommandesEngagements }     from '@pom/MAG/commandes-engagements.page.js';
	 
//-------------------------------------------------------------------------------------

let page             : Page;

let menu             : MenuMagasin;
let pageCommandesEng : CommandesEngagements;

const log            = new Log();
const fonction       = new TestFunctions(log);
//------------------------------------------------------------------------------------

const iQuantite      = 8;
//------------------------------------------------------------------------------------

const sLieuVente     = fonction.getInitParam('ville', 'Gaillarde (G911)'); //Bergerac (G550)

//------------------------------------------------------------------------------------

var oData = {
	iNbPastillesMenu : 0,
	iNbPastillesOnglet : 0,
	bErreur : false
}

test.beforeAll(async ({ browser }, testInfo) => {
	page            = await browser.newPage(); 
	menu            = new MenuMagasin(page, fonction);
	pageCommandesEng= new CommandesEngagements(page);
	const helper    = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

/**
 * 
 * @returns {interger} Nb Pastilles du compteur local
 * @param {string} sLocalisation zone concernée
 * @description On affiche le nombre de pastille mémorisé à un instant T
 */
var getNbPastilles = (sLocalisation:any = 'menu') => {
	if (sLocalisation === 'onglet') {
		return oData.iNbPastillesOnglet;
	} else {
		return oData.iNbPastillesMenu;
	}
}

/**
 * 
 * @param {interger} iNbPastillesMenu 
 * @description Le nombre de pastille à mémoriser
 */
var setNbPastilles = async (iNbPastilles:any, sLocalisation:any = 'menu') => {
	if (sLocalisation === 'onglet') {
		oData.iNbPastillesOnglet = iNbPastilles;
	} else {
		oData.iNbPastillesMenu   = iNbPastilles;
	}
}

var setErreur = () => {
	oData.bErreur = true;
}

var getErreur = () => {
	return oData.bErreur;
}
//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {
  
	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
	 await context.clearCookies();
	 await fonction.openUrl(page);
	})
	
	test ('Connexion', async () => {
		await fonction.connexion(page);
	})

   test.describe('Page [COMMANDE]', () => {
	   
		test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
			var isVisible= await menu.pPopinAlerteSanitaire.isVisible();
			if(isVisible){
				await menu.removeArlerteMessage(page);
			}else{
				log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
				test.skip();
			}
		})

	   var pageName    = 'commandes';
	   var ongletName  = 'engagements';

	   test ('Page [ALERTES] - Click', async () => {
		   await menu.click(pageName, page);  
	   })  

	   test('ListBox [VILLE] = "' + sLieuVente + '"', async () => {    // On sélectionne le lieu de vent cible
		   await menu.selectVille(sLieuVente, page);
		   log.set('Lieu de vente : ' + sLieuVente);          

		   var iNbPastilles = await menu.getPastilles(pageName, page); // Mémorisation nb de pastilles dans le menu AVANT traitement
		   await  setNbPastilles(iNbPastilles, 'menu');                // Mémorisation en Local

		   var iNbPastilles = await menu.getPastilles(pageName, page, ongletName); // Mémorisation nb de pastilles dans l'onglet AVANT traitement
		   await setNbPastilles(iNbPastilles, 'onglet');                // Mémorisation en Local
		})

	   test ('Label [ERREUR] - Is Not Visible', async () => {           // Pas d'erreur affichée à priori au chargement de la page
		   await fonction.isErrorDisplayed(false, page);
	   })

	   test.describe ('Onglet [ENGAGEMENTS]', () => {        

		   test ('Onglet [ENGAGEMENTS] - Click', async () => {
			   await menu.clickOnglet(pageName, ongletName,page);    // On ouvre l'onglet
		   })

		   test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
			   await fonction.isErrorDisplayed(false, page);
		   }) 

		   test ('DataGrid [ENGAGEMENTS][A FAIRE][First] - Click', async () => {
				var nbTh = await pageCommandesEng.tdStatutEngagement.count();
				for(let index=0; index<nbTh; index++){
					var text = await pageCommandesEng.tdStatutEngagement.nth(index).locator('span').textContent();
					if(text ==='A faire'){
						await fonction.clickElement(pageCommandesEng.tdStatutEngagement.nth(index).locator('span:text-is("A faire")'));
						await fonction.wait(page, 350);
					}else {
						log.set('Pas d\'engagement disponible - ACTION ANNULEE');
						setErreur();
					}
				}
			})

		   test('InputField [QUANTITES][ALL] = "' + iQuantite + '"', async () => {
			   await fonction.wait(page,350);
				if (getErreur() === false) {
				   var isVisible = await pageCommandesEng.tdCodeArticle.first().isVisible();
				   if(isVisible){
					   var sCodeArticle = await pageCommandesEng.tdCodeArticle.first().textContent();
					   log.set('Code Article : ' + sCodeArticle);

					   var sLibelleArticle = await pageCommandesEng.tdLibelleArticle.first().textContent();
					   log.set('Libelle Article : ' + sLibelleArticle);
					   await pageCommandesEng.inputQuantiteEngagement.clear();
					   await fonction.sendKeys(pageCommandesEng.inputQuantiteEngagement, iQuantite);
					}
				} else {
				   log.set('Saisie : ACTION ANNULEE');
				}
			})

		   test ('Button [ENVOYER AU CS] - Click', async () => {
			   if (getErreur() === false) {
				   await fonction.clickElement(pageCommandesEng.buttonEnvoyerAuCS);
				} else {
				   log.set('Envoyer au CS : ACTION ANNULEE');
				}
			})

		   test ('Pastilles [MENU] - Check', async () => {
			   if (getErreur() === false) {
				   var iNbPastillesLocal = getNbPastilles('menu');                         // Affichage compteur Local
				   log.set('Nb Pastilles MENU avant traitement : ' + iNbPastillesLocal);
				   await menu.getPastilles(pageName, page).then((iNbPastilles)=> {         // Mémorisation nb de pastilles dans le menu AVANT traitement                            
					   log.set('Nb Pastilles MENU après traitement : ' + iNbPastilles);
					   expect(iNbPastillesLocal).toBeGreaterThan(iNbPastilles);
				   })
			   } else {
				   log.set('Comparaison pastilles MENU : ACTION ANNULEE');
			   }
			})

		   test ('Pastilles [ONGLET] - Check', async () => {
			   if (getErreur() === false) {
				   var iNbPastillesLocal = getNbPastilles('onglet');                           // Affichage compteur Local
				   log.set('Nb Pastilles ONGLET avant traitement : ' + iNbPastillesLocal);
				   await menu.getPastilles(pageName, page, ongletName).then((iNbPastilles) => {// Mémorisation nb de pastilles dans l'onglet AVANT traitement
					   log.set('Nb Pastilles ONGLET après traitement : ' + iNbPastilles);
					   expect(iNbPastillesLocal).toBeGreaterThan(iNbPastilles);
				   })
				} else {
				   log.set('Comparaison pastilles ONGLET : ACTION ANNULEE');
				}
			})
	   })
   }) // End describe Page

   test ('Déconnexion', async () => {
	await fonction.deconnexion(page);
   })

}) // End describe