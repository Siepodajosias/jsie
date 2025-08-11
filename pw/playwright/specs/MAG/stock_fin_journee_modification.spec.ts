/**
 * 
 * @author JOSIAS SIE
 * @since 2024-04-24
 * 
 */
const xRefTest      = "MAG_SFJ_UPD";
const xDescription  = "Renseigner le SFJ ou le SFJ je/ve";
const xIdTest       =  3430;
const xVersion      = '3.0';

//------------------------------------------------------------------------------------    
var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'MAGASIN',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['ville', 'groupeArticle'],
	fileName    : __filename
};
//------------------------------------------------------------------------------------

import { test, type Page }          from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';
import { CartoucheInfo }            from '@commun/types';
import { MenuMagasin }              from '@pom/MAG/menu.page';
import { StockStockFinJournee }     from '@pom/MAG/stock-stock_fin_journee.page.js';

//------------------------------------------------------------------------------------
let page                : Page;

let menu                : MenuMagasin;
let pageStockStockFin   : StockStockFinJournee;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------
const iNbTirs           = 10;
const iStockMaxi        = 8;            // Stock Maxi (application random)
const iStockObligatoire = 88;           // Valeur par défaut du champ obligatoire
//------------------------------------------------------------------------------------    

const sNomVille         = fonction.getInitParam('ville', 'Malemort (G914)');
const sgroupeArticle    = fonction.getInitParam('groupeArticle', 'Marée');

//------------------------------------------------------------------------------------
test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage(); 
	menu                = new MenuMagasin(page, fonction);
	pageStockStockFin   = new StockStockFinJournee(page);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

var traitement = async (iTir:any) => {

	if (iTir <= iNbTirs) {

		var iNbLignes = await pageStockStockFin.inputStockFinJournee.count();

		if (iTir == 1) {
			log.set('Nb articles : ' + iNbLignes);
		}

		if (iNbLignes > 0) {

			var iLigne = Math.floor((fonction.random() * iNbLignes) + 0);
			var sInfo = '[' + iTir + '] - ';

			var sIdArticle = await pageStockStockFin.trListeArticles.nth(iLigne).locator('td').nth(0).textContent();
			sInfo = sInfo + sIdArticle + ' | ';

			var sLibelleArticle = await pageStockStockFin.trListeArticles.nth(iLigne).locator('td').nth(1).textContent();
			sInfo = sInfo + sLibelleArticle + ' | ';

			await fonction.wait(page, 350);
			var iStock = Math.floor((fonction.random() * iStockMaxi));
			await pageStockStockFin.inputStockFinJournee.nth(iLigne).clear();
			await fonction.sendKeys(pageStockStockFin.inputStockFinJournee.nth(iLigne), iStock);
			sInfo = sInfo + 'Fin Journee : ' + iStock + ' | ';

			await fonction.wait(page, 350);
			var iStock = Math.floor((fonction.random() * iStockMaxi));
			await pageStockStockFin.inputStockFinSemaine.nth(iLigne).clear();
			await fonction.sendKeys(pageStockStockFin.inputStockFinSemaine.nth(iLigne), iStock);
			sInfo = sInfo + 'Fin Semaine : ' + iStock ; 

			log.set(sInfo);

		} else {
			log.set('Aucun article pour le groupe article ' + sgroupeArticle);
			iTir = iNbTirs + 1;                                                             // pour sortie plus vite de la boucle
		}

		iTir = iTir + 1;

		await traitement(iTir);
	}
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

	test.describe('Page [STOCK]', () => {
		test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
			var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
			if(isVisible){
				await menu.removeArlerteMessage(page);
			}else{
				log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
				test.skip();
			}
		})      

		var sNomPage = 'stock';

		test ('Page [ALERTES] - Click', async () => {
			await menu.click(sNomPage, page);  
		})

		test ('ListBox [LIEU DE VENTE] = "' + sNomVille + '"', async () => {
			await menu.selectVille(sNomVille, page);
		})

		test('Onglet [STOCK DE FIN DE JOURNEE] - Click', async () => {
			await menu.clickOnglet(sNomPage, 'stockFinJournee', page);
		})

		test.describe('Onglet [STOCK DE FIN DE JOURNEE]', () => {
	
			test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
				await fonction.isErrorDisplayed(false, page);
				await fonction.wait(page, 5000);
			})

			test ('ListBox [GROUPE ARTICLE] = "' + sgroupeArticle + '" - Click', async () => {       
				var isActive = await pageStockStockFin.dgListeArticles.first().isEnabled();
				if(isActive){
					var isActive = await pageStockStockFin.listBoxGroupeArticle.locator('option').first().isEnabled();
					if(isActive){
						await fonction.selectListBoxByLabel(pageStockStockFin.listBoxGroupeArticle, sgroupeArticle, page);
					}
				}
			}) 

			test ('*** Traitement X ' + iNbTirs + ' fois ***', async () => {
				var isActive = await pageStockStockFin.dgListeArticles.first().isEnabled();
				if(isActive){
					var isVisible = await pageStockStockFin.inputStockFinJourneeObli.first().isVisible();
					if(isVisible){
						var iNbRequired = await pageStockStockFin.inputStockFinJourneeObli.count();
						// Saisie de tous les champs obligatoires
						await pageStockStockFin.inputStockFinJourneeObli.clear();
						await fonction.sendKeys(pageStockStockFin.inputStockFinJourneeObli, iStockObligatoire);
						log.set('Remplissage des ' + iNbRequired + ' champs obligatoires avec la valeur : ' + iStockObligatoire)
					}
					await traitement(1);
				}
			})

			test ('Button [ENREGISTRER] - Click', async () => {
				var isActive = await pageStockStockFin.buttonEnregistrer.isEnabled();
				if(isActive){
				   await fonction.clickElement(pageStockStockFin.buttonEnregistrer);
				}else{
					log.set('Pas d\'Enregistement Possible');
				}
			})
		}); // end describe
	}); // end describe

	test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

}); // end describe