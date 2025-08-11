/**
 *
 * @author JOSIAS SIE
 * @since 2024-04-25
 * 
 */
const xRefTest      = "MAG_PAS_PRX";
const xDescription  = "Notification d'un changement de prix";
const xIdTest       =  7285;
const xVersion      = "3.0";

//------------------------------------------------------------------------------------    
var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'MAGASIN',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['ville'],
	fileName    : __filename
};
//------------------------------------------------------------------------------------

import { expect, test, type Page } from '@playwright/test';

import { TestFunctions }   from "@helpers/functions";
import { Log }             from "@helpers/log";
import { Help }            from '@helpers/helpers';

import { CartoucheInfo }   from '@commun/types';
import { MenuMagasin }     from '@pom/MAG/menu.page';
import { PrixGestion }     from '@pom/MAG/prix-gestion.page.js';

//-------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuMagasin;
let pagePrixGestion : PrixGestion;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------

const aGroupeArticle= ['Frais LS', 'Coupe / Corner'];
//------------------------------------------------------------------------------------

const sLieuVente    = fonction.getInitParam('ville', 'Gaillarde (G911)'); 

//------------------------------------------------------------------------------------   

test.beforeAll(async ({ browser }, testInfo) => {
	page            = await browser.newPage(); 
	menu            = new MenuMagasin(page, fonction);
	pagePrixGestion = new PrixGestion(page);
	const helper    = new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

var oData = {
	iNbPastillesMenu : 0,
	iNbPastillesOnglet : 0,
	bErreur : false
}

/**
* 
* @returns {interger} Nb Pastilles du compteur local
* @param {string} sLocalisation zone concernée
* @description On affiche le nombre de pastille mémorisé à un instant T
*/
var getNbPastilles = (sLocalisation = 'menu') => {
	var iRetour = oData.iNbPastillesMenu;
	if (sLocalisation === 'onglet') {
		iRetour =  oData.iNbPastillesOnglet;
	}
	//Log.set("Local OUT : " + iRetour);
	return iRetour;
}

/**
 * 
 * @param {interger} iNbPastillesMenu 
 * @description Le nombre de pastille à mémoriser
 */
var setNbPastilles = (iNbPastilles: any, sLocalisation = 'menu') => {
	if (sLocalisation === 'onglet') {
		oData.iNbPastillesOnglet = iNbPastilles;
	} else {
		oData.iNbPastillesMenu = iNbPastilles;
	}
	//Log.set("Local IN : " + iNbPastilles);
}

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {
  
	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	});
	
	test ('Connexion', async () => {
		await fonction.connexion(page);
	});

   test.describe('Page [PRIX]', () => {
	   
	   //-- Message d'avertissement (Check Browser) spécifique à l'application SIGALE Magasin
	   //-- Click sur le lien de confirmation pour faire disparaître le message d'alerte 
	   test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
			var isVisible = await menu.linkBrowserSecurity.isVisible();
			if (isVisible) {
				var isActive = await menu.linkBrowserSecurity.isEnabled();
				if(isActive){
					await fonction.clickElement(menu.linkBrowserSecurity);
				}
			}
		});

		test ('Popin [PRIX] - Click', async () => {
			await menu.removeArlerteMessage(page);
		});

		var pageName    = 'prix';
										  
		test ('Page [ALERTES] - Click', async () => {
		   await menu.click(pageName, page);                            // On ouvre la page
		}) 

		test ('ListBox [VILLE] = "' + sLieuVente + '"', async () => {   // On sélectionne le lieu de vent cible

		   await menu.selectVille(sLieuVente, page);
		   log.set('Lieu de vente : ' + sLieuVente);
		   var iNbPastilles = await menu.getPastilles(pageName, page);

		   setNbPastilles(iNbPastilles);                               // Mémorisation en Local du nb de pastilles dans le menu AVANT traitements
		   log.set('Nb Pastilles initialement dans le menu : ' + iNbPastilles);
		})
	  
		test ('Label [ERREUR] - Is Not Visible', async () => {         // Pas d'erreur affichée à priori au chargement de la page
		   await fonction.isErrorDisplayed(false, page);
		}) 

	   aGroupeArticle.forEach((sGroupeArticle) => {
		   test.describe ('** Traitement Groupe Article = "' + sGroupeArticle + '" **', () => {        
				test ('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
				   log.set('Groupe Article : ' + sGroupeArticle);
				   await fonction.selectListBoxByLabel(pagePrixGestion.listBoxGrpArticle, sGroupeArticle, page);
				})
			   
				test ('Button [IMPRIMER LES CHANGEMENTS] - Click (optionnel)', async () => {
					await pagePrixGestion.buttonImprimer.hover();
					var isVisible = await pagePrixGestion.buttonImprimerChangement.isEnabled();
					if(isVisible){

					log.set('Click Bouton IMPRIMER');
					await fonction.wait(page, 3500);
					await fonction.clickElement(pagePrixGestion.buttonImprimerChangement, page);
					var iCompteurInitial = getNbPastilles();
						if (iCompteurInitial > 0) {
							var iNouveauCompteur = await menu.getPastilles(pageName, page);
							expect(Math.floor(iCompteurInitial)).toBeGreaterThanOrEqual(Math.floor(iNouveauCompteur)); // Vérification du décompte
							log.set('Nb Pastilles dans le menu : ' + iNouveauCompteur + ' (APRES traitement)');
						} else {
							log.set('Pas de Pastille visible');
						}

					}else{
						log.set('Bouton IMPRIMER innactif pour le groupe article ' + sGroupeArticle);
					}           
				})  
		   })
		})  // End ForEach

		test ('Pastile Menu [PRIX] = "0"', async () => {
		   await fonction.wait(page, 3500);
		   var iDernierCompteur = await menu.getPastilles(pageName, page);
		   expect(iDernierCompteur).toEqual(0);
		})
   }) // End describe Page

   test ('Déconnexion', async () => {
	await fonction.deconnexion(page);
   });

}) // End describe