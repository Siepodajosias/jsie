/**
 * @author JOSIAS SIE
 * @since 2024-04-26
 */

const xRefTest      = "MAG_INV_Z01";
const xDescription  = "Réaliser un inventaire de zone";
const xIdTest       =  2227;
const xVersion      = '3.8';

//------------------------------------------------------------------------------------ 
var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'MAGASIN',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['ville', 'zone'],
	fileName    : __filename
};
//------------------------------------------------------------------------------------
import { expect, test, type Page } from '@playwright/test';

import { TestFunctions }           from "@helpers/functions";
import { Log }                     from "@helpers/log";
import { Help }                    from '@helpers/helpers';    

import { MenuMagasin }             from '@pom/MAG/menu.page';
import { StockStock }              from '@pom/MAG/stock-stock.page';

import { CartoucheInfo }           from '@commun/types';

//-------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuMagasin;
let pageStockStock  : StockStock;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------
var pageCourante    = 0;

// Exploitation des paramètres passés en argument OU ceux présents dans le fichier de configuration Local
var villeCible      = fonction.getInitParam('ville', 'Malemort (G914)');
var groupeArticle   = fonction.getInitParam('zone', 'Poissonnerie');

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page            = await browser.newPage(); 
	menu            = new MenuMagasin(page, fonction);
	pageStockStock  = new StockStock(page);
	const helper    = new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//-------------------------------------------------------------------------------------

var ladate  = new Date()
var jour:any= ladate.getDate();
if (jour < 10) {
	jour = '0' + jour;
}                    
var mois:any= ladate.getMonth() + 1;
if (mois < 10) {
	mois = '0' + mois;
}
var annee           = ladate.getFullYear();
var messageAttendu  = ' validé le ' + jour + ' / ' + mois + ' / ' + annee + ' à ';
var dateMvtAttendue = jour + ' / ' + mois + ' / ' + annee;

const sProfilAdmin  = 'lunettes';         // profil administrateur
process.env.ROLE    = 'RESPONSABLE RAYON';// Connexion par défaut avec le profil ayant le Role RR
var oData = {
	bAlreadyExists : false
}

//------------------------------------------------------------------------------------

var checkCurrentPage = async (pageCourante:any) => {

	log.set('Traitement Page ' + (Number.parseInt(pageCourante) + 1));
	var nbElem = await pageStockStock.trListeArticles.count();
	
	for(let index=0;index<nbElem;index++){
		await fonction.wait(page, 700);
		await pageStockStock.trListeArticles.nth(index).scrollIntoViewIfNeeded();
		var lastQuantity:any = await pageStockStock.trListeArticles.nth(index).locator('.datagrid-derniereQuantiteComptee > span').textContent();
		var present          = await pageStockStock.trListeArticles.nth(index).locator('.datagrid-quantiteComptee > input').isVisible();
		// Le champ Input est présent, on le rempli avec la dernière valeur comptée
		if (present) {
			if (lastQuantity == '') {                                          // Dans la cas ou l'article est nouveau et n'a jamais été inventorié
				lastQuantity = 1;
			} else {
				lastQuantity = lastQuantity.replace(' ', '');                  // Si écriture séparteur de milliers = espace (Ex 1 048 => 1048)
			}
			await fonction.wait(page, 700); 
			await pageStockStock.trListeArticles.nth(index).locator('.datagrid-quantiteComptee > input').clear();                                 // temporisation légère pour éviter les blocages
			await fonction.wait(page, 700);  
			var eElemQc = pageStockStock.trListeArticles.nth(index).locator('.datagrid-quantiteComptee > input');
			await fonction.sendKeys(eElemQc, lastQuantity, false, 'Quantité comptee');

			await fonction.wait(page, 700);                                    // temporisation légère pour éviter les blocages 
		}

		var lastQuantityKg:any = await pageStockStock.trListeArticles.nth(index).locator('td.datagrid-derniereQuantiteUdComptee > span').textContent();
		var isVisible          = await pageStockStock.trListeArticles.nth(index).locator('.datagrid-quantiteUdComptee > input').isVisible();
		// Le deuxième champ Input est présent, on le rempli avec la dernière valeur comptée                                    
		if (isVisible) {                                              
			if (lastQuantityKg == '') {                                        // Dans la cas ou l'article est nouveau et n'a jamais été inventorié
				var lastQuantityGr:any = 1;                                    // 1 Gr moini car on ne peut pas avoir un colis de 0 Gr...
			} else {
				var aBouts = lastQuantityKg.match(/\d+/g);
				var lastQuantityGr:any = aBouts[0] * 1000;
				if (aBouts[1] != undefined) {
					lastQuantityGr = aBouts[0] + '.' + aBouts[1] * 1000;
				}
			}

			await pageStockStock.trListeArticles.nth(index).locator('.datagrid-quantiteUdComptee > input').clear();
			await fonction.wait(page, 700);                                   // temporisation légère pour éviter les blocages 
			var eElemQUdC  = pageStockStock.trListeArticles.nth(index).locator('.datagrid-quantiteUdComptee > input');
			await fonction.sendKeys(eElemQUdC, lastQuantityGr, false, 'Quantité comptee');

			await fonction.wait(page, 700);                                   // temporisation légère pour éviter les blocages 
		} 
	}

	await fonction.wait(page, 700);

	var pagination = pageStockStock.divPagnination;
	var className  = await pagination.last().getAttribute('class');

	if (className === 'disabled') {
		log.set('OK : Fin traitement-----------------------------------------------');
		await fonction.clickElement(pageStockStock.buttonEnregistrerInventaire, page);

		var lastInputQtCmptee      = pageStockStock.trListeArticles.last().locator('.datagrid-quantiteComptee > input');
		var lastInputQtCmpteeValue = await pageStockStock.trListeArticles.last().locator('.datagrid-quantiteComptee > input').inputValue();
		if(lastInputQtCmpteeValue === ''){  // Il arrive souvent que la première valeur saisie dans le dernier champ ne soit pas prise en compte. D'où cette condition.

			await fonction.sendKeys(lastInputQtCmptee, lastQuantity, false, 'Quantité comptee'); // Cette fois la siasie sera faite de façon sequentielle.
			await fonction.wait(page, 700);
		}
	} else {
		await fonction.clickElement(pagination.locator('a').last(), page);                    
		await checkCurrentPage(pageCourante);
	}
}    

var setAlreadyStart = () => {
	oData.bAlreadyExists = true;
}

var getAlreadyStart = () => {
	return oData.bAlreadyExists;
}

//------------------------------------------------------------------------------------    

if (groupeArticle === undefined) {
	throw new Error('Ooops : Code Groupe Article [' + groupeArticle + '] Inconnu');
} 

// Doit etre lancé aprés 12H : la date d'inventaire par défaut est la date du jour

test.describe.serial ('[' + xRefTest + ']', () => {

	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	});
	
	test ('Connexion RESPONSABLE RAYON ', async () => {
		await fonction.connexion(page);
	}) // end describe

	test.describe('Page [STOCK][RR]', () => {
		
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

		test ('Popin [STOCK] - Click', async () => {
			await menu.removeArlerteMessage(page);
		});

		var pageName:string = 'stock';

		test ('Page [STOCK] - Click', async () => {
			await menu.click(pageName, page);                         // On ouvre la page
		})

		test ('Label [ERREUR][1] - Is Not Visible', async () => {    // Pas d'erreur affichée à priori au chargement de la page
			await fonction.isErrorDisplayed(false, page);
		})

		var long = villeCible.length - 7;                            // Le code magasin ne s'affiche pas pour le profil (RR), on le supprime.

		test ('ListBox [VILLE] = "' + villeCible.substring(0, long) + '"', async () => {
			await menu.selectVille(villeCible.substring(0, long), page);
		})  
		
		test.describe ('Onglet [STOCK]', () => {        

			test ('Onglet [STOCK] - Click', async () => {
				await menu.clickOnglet(pageName, 'stock', page);
			}) 

			test ('ListBox [GROUPE ARTICLE] = "' + groupeArticle + '"', async () => {
				await fonction.selectListBoxByLabel(pageStockStock.listBoxGroupeArticle, groupeArticle, page);
			}) 

			test ('** Wait Until Spinner Off **', async () => {
				await fonction.waitForSpinner(pageStockStock.spinner, 120000);
			})

			test ('Label [ERREUR][2] - Is Not Visible', async () => {              // Pas d'erreur affichée à priori au chargement de l'onglet
				await fonction.isErrorDisplayed(false, page);
			})

			test ('Button [ANNULER INVENTAIRE] - Click (if Enabled)', async () => {    //Si un inventaire est déjà en cours, on l'annule

				//-- Est il visible ?
				if (await pageStockStock.buttonAnnulerInventaire.isVisible()) {

					//-- Est il actif ?
					var enable  = await pageStockStock.buttonAnnulerInventaire.isEnabled();
					if (enable) {
						await fonction.clickAndWait(pageStockStock.buttonAnnulerInventaire, page);
					}
					await fonction.wait(page,700);
					
				}

				var present = await pageStockStock.pPbuttonOk.isVisible();
				if (present) {
					await fonction.clickAndWait(pageStockStock.pPbuttonOk, page);
				}

			})

			var sNomPopin:string = "DEMARRAGE INVENTAIRE";
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', () => {  

				test ('Button [DEMARRER INVENTAIRE] - Click', async () => {
					await fonction.clickAndWait(pageStockStock.buttonDemarrerInventaire, page); 
				})

				test ('Popin [DEMARRAGE INVENTAIRE][1] - Check', async () =>  {
					await fonction.popinVisible(page,'DEMARRAGE INVENTAIRE');
				})

				test ('Button [DEMARRER] - Click', async () => {
					await fonction.clickAndWait(pageStockStock.popinButtonDemarrer,page);

					// ??? - [6161] Impossible de créer un inventaire pour le ... car il existe déjà un inventaire de type comptable (Boucherie) à la date du ...
					var alertIsVisible = await pageStockStock.messageErreur.isVisible();
					if (alertIsVisible) {
						// ??? - [6161] Impossible de créer un inventaire pour le ... car il existe déjà un inventaire de type comptable (Boucherie) à la date du ...
						var sMessageErreur = await pageStockStock.messageErreur.textContent();
						log.set('Message : ' + sMessageErreur);
						setAlreadyStart();
						await fonction.clickAndWait(pageStockStock.popinLinkAnnuler, page);
					}
				})

				test ('Popin [DEMARRAGE INVENTAIRE][2] - Check', async () =>  {
					await fonction.popinVisible(page,'DEMARRAGE INVENTAIRE', false);
				})

			})

			test ('** CHECK SAISIE INCOMPLETE [0] = message [6115]**', async () => {   // Check : on ne renseigne que le 1er article
				if (getAlreadyStart() === false ) {
					var lastQuantity:any = await pageStockStock.tdDernQuantiteComptee.nth(0).textContent();
					var present          = await pageStockStock.inputQuantiteComptee.nth(0).isVisible();
					// Le champ Input est présent, on le rempli avec la dernière valeur comptée
					if (present) {

						if (lastQuantity == '') {                   // Dans la cas ou l'article est nouveau et n'a jamais été inventorié
							lastQuantity = 1;
						}
						
						await pageStockStock.inputQuantiteComptee.nth(0).clear();
						await fonction.wait(page, 250);             // temporisation légère pour éviter les blocages                         
						await fonction.sendKeys(pageStockStock.inputQuantiteComptee.nth(0), lastQuantity, false, 'Quantié Comptee');
						await fonction.wait(page, 700);             // temporisation légère pour éviter les blocages 
					}  
					
					await fonction.clickAndWait(pageStockStock.buttonValiderInventaire, page);

					var error = await pageStockStock.ErrorMessage.textContent();
					expect(error.slice(0,6)).toBe('[6115]');
				}
			})

			test ('** LANCEMENT TRAITEMENT **', async () => {
				test.setTimeout(2000000);
				if (getAlreadyStart() === false ) {
					await checkCurrentPage(pageCourante);
				}
			})

			test ('Button [VALIDER INVENTAIRE] - Click', async () => {
				test.setTimeout(60000);
				if (getAlreadyStart() === false ) {
					await fonction.clickAndWait(pageStockStock.buttonValiderInventaire, page, 60000);
				}
			})
			
			test ('Label [ERREUR][3] - Is Not Visible', async () => {     // Pas d'erreur affichée à priori au chargement de la page
				await fonction.isErrorDisplayed(false, page);
			})

			test ('Label [MESSAGE CONFIRMATION] contient "' + messageAttendu + '"', async () => {
				if (getAlreadyStart() === false ) {
					var messageAttendu = await pageStockStock.messageConfirmation.textContent();
					messageAttendu     = messageAttendu.trim();
					expect(messageAttendu).toContain(messageAttendu);
				}
			})
		})  // End Describe Onglet
	})  // End Describe Page           

	//------------------------------------------------------------------------------------------------------------------------------------------

	test ('Connexion (admin) ', async () => {
		await fonction.changeProfil('MAG', sProfilAdmin, page);
		await fonction.addDataSheet('Role', 'Rôle', 'Admin');
	}); // end describe

	test.describe ('Page [STOCK][Admin]', () => {
		
		//-- Message d'avertissement (Check Browser) spécifique à l'application SIGALE Magasin
		//-- Click sur le lien de confirmation pour faire disparaître le message d'alerte 
		test ('Link [BROWSER SECURITY WARNING][Admin] - Click', async () => {
			await fonction.waitTillHTMLRendered(page);
			var isVisible    = await menu.linkBrowserSecurity.isVisible();
			if (isVisible) {
				var isActive = await menu.linkBrowserSecurity.isEnabled();
				if(isActive){
					await fonction.clickElement(menu.linkBrowserSecurity);
				}
			}
		});

		var pageName:string = 'stock';

		test ('Page [STOCK] - Click', async () => {
			await menu.click(pageName, page);                            // On ouvre la page
		})

		test ('Label [ERREUR][1] - Is Not Visible', async () => { // Pas d'erreur affichée à priori au chargement de la page
			await fonction.isErrorDisplayed(false, page);
		})

		test ('ListBox [VILLE] = "' + villeCible + '"', async () => {
			await menu.selectVille(villeCible, page);
			log.set('Lieu de Vente : ' + villeCible);
		}) 
		
		test.describe ('Onglet [STOCK]', () => {        

			test ('Onglet [STOCK] - Click', async () => {
				await menu.clickOnglet(pageName, 'stock', page);
				log.set('Nom Zone : ' + groupeArticle);
			}) 

			test ('ListBox [GROUPE ARTICLE] = "' + groupeArticle + '"', async () => {
				await fonction.selectListBoxByLabel(pageStockStock.listBoxGroupeArticle, groupeArticle, page);
			}) 
								  
			test ('Label [ERREUR][2] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de l'onglet
				await fonction.isErrorDisplayed(false, page);
			})

			if (groupeArticle != 'Fruits et légumes') {                        // Le bouton n'est pas présent pour le FL

				test ('CheckBox [ARTICLES][rnd] - Click', async () => {
					await fonction.clickElement(pageStockStock.checkBoxListeArticles.last());
				})

				test ('Button [MOUVEMENTS DE STOCK] - Click', async () => {
					await fonction.clickAndWait(pageStockStock.buttonMouvementStock, page);
				})

				var nomPopin:string    = 'VISUALISATION DES MOUVEMENTS DE STOCK';

				test.describe ('Popin [' + nomPopin + ']', () => {
					test ('Popin [VISUALISATION DES MOUVEMENTS DE STOCK][1] - Check', async () =>  {
						await fonction.popinVisible(page, nomPopin);
					})

					test ('Td [NATURE][Last] = "Inventaire de zone"', async () => {
						if (getAlreadyStart() === false ) {
							// Alerte Sélecteur Môche !!! - Récup dernière ligne du tableau et la 7ème colonne...
							var sElem = await pageStockStock.pPtrNatureMvt.last().locator('td').nth(6).textContent();
							if(sElem !=' '){
								expect(sElem.trim()).toBe('Inventaire de zone');
							}
						}
					})

					test ('Td [DATE][Last] = '+ dateMvtAttendue, async () => {
						if (getAlreadyStart() === false ) {
							var dateMvt       = await pageStockStock.pPtrNatureMvt.last().locator('td').nth(0).textContent();
							expect(dateMvt.slice(0,14)).toBe(dateMvtAttendue);
						}
					})

					test ('Link [FERMER] - Click', async () => {
						await fonction.clickElement(pageStockStock.pPlinkFermer);
					})                

					test ('Popin [VISUALISATION DES MOUVEMENTS DE STOCK][2] - Check', async () =>  {
						await fonction.popinVisible(page, nomPopin, false);
					})
				})
			}
		})
	})

	test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});
	
}) // end describe