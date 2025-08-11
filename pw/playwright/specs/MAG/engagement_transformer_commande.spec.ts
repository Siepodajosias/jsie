/**
 * 
 * @author ABDOUL SARBA
 *  Since 02 - 05 - 2025
 */

const xRefTest     = "MAG_ENG_TRA";
const xDescription = "Transformation d'un engagement en commande";
const xIdTest      = 978;
const xVersion     = '3.15';

var info: CartoucheInfo = {
	desc           : xDescription,
	appli          : 'MAGASIN',
	version        : xVersion,
	refTest        : [xRefTest],
	idTest         : xIdTest,
	help           : [],
	params         : ['groupeArticle','typeAssortiment','cadence','nomAssortiment','ville','article','designation'],
	fileName       : __filename
};

//----------------------------------------------------------------------------------------

import { expect, test, type Page }              from '@playwright/test';

import { TestFunctions }                        from "@helpers/functions";
import { Log }                                  from "@helpers/log";
import { Help }                                 from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }                          from '@pom/MAG/menu.page';
import { CommandesCommande }                    from '@pom/MAG/commandes-commande.page';
import { AutorisationsParametrage }             from '@pom/MAG/autorisations-parametrage.page';
import { AutorisationsAchatsCentrale }          from '@pom/MAG/autorisations-achats_centrale.page';
import { GlobalConfigFile }                     from '@conf/commun.conf';

import { AutoComplete, CartoucheInfo, TypeEsb } from '@commun/types';
import { EsbFunctions }                         from '@helpers/esb';
//-------------------------------------------------------------------------------------

let page                                        : Page;
let menu                                        : MenuMagasin;
let pageAutAchCent                              : AutorisationsAchatsCentrale;
let pageAutParam                                : AutorisationsParametrage;
let pageCmdesCmd                                : CommandesCommande;
let esb                                         : EsbFunctions;

const log                                       = new Log();
const fonction                                  = new TestFunctions(log);
const globalConfig                              = new GlobalConfigFile();
const globalData                                = globalConfig.getData();

//----------------------------------------------------------------------------------------
var oData:any                                   = fonction.importJdd();                                // Récupération des données JDD
//----------------------------------------------------------------------------------------                                                                      
var maDate                                      = new Date();                                        // Formatage des heures et minutes

const futureDate                                = new Date(maDate.getTime() + 30 * 60000);         // Ajoute 30 minutes
var cmdMinutesLimit                             = new Date(maDate.getTime() + 6 * 60000);         //Ajoute de 6 minutes (temps limite pour la commande) après ce temps la commande sera fermée.
var cmdHeureStart                               = fonction.addZero(futureDate.getHours());
var cmdMinuteStart                              = fonction.addZero(futureDate.getMinutes());
var cmdHeureEnd                                 = fonction.addZero(futureDate.getHours() + 1); // 1 heure après
var cmdMinuteEnd                                = fonction.addZero(futureDate.getMinutes());
var cmdTmpLimitOuver                            = fonction.addZero(cmdMinutesLimit.getMinutes());
var heureActuelle                               = fonction.addZero(maDate.getHours());      // Heure actuelle
var MinuteActuelle                              = fonction.addZero(maDate.getMinutes());   // Minutes actuelles
var iNumJourSemaine                             = maDate.getDay();                        // Calcul des horaires 30 minutes après l'heure actuelle
var joursSemaine                                = globalData.joursSemaine;

const jourSuivant                               = new Date(maDate);
const auJourdhui                                = new Date(maDate);
const sGroupeArticle                            = fonction.getInitParam('groupeArticle', fonction.getLocalConfig('groupeArticleEngagement'));
var sNomEngagement                              = fonction.getInitParam('nom', fonction.getLocalConfig('assortimentEngagement') + fonction.getToday('FR'));
const sDesignGrpAssort                          = sNomEngagement + ' (' + sGroupeArticle +')';  // §§§-1 Ref Inter Scénarios  
const sCadence                                  = fonction.getInitParam('cadence', 'hebdo');  // jour = commande sur une journée ; hebdo = commande tous les jours (sauf dimanche) 
const aListeMagasins                            = fonction.getInitParam('ville', fonction.getLocalConfig('listeVilles'));
const assortimentCentraleAch                    = fonction.getInitParam('designation', fonction.getLocalConfig('assortimentCentraleAch') + ' (' + sGroupeArticle +')');

var aArticle                                    = fonction.getInitParam('article', fonction.getLocalConfig('articlesCibles')); // Article à créer dans le scénario

var  aQuantiteInitiale:string[]                 =[];                     // Quantité à previsionelle et quantité reference

if(oData !== undefined) {                                             // On est dans le cadre d'un E2E. Récupération des données temporaires.
	 aQuantiteInitiale = oData.quantites[0].quantiteInitiale;
	 aArticle          = oData.aArticle;
	 log.set("E2E - Les articles choisie aleatoirement sont:"+ aArticle);
	 log.set('E2E - Les quantités initiales sont           :'+ aQuantiteInitiale);	
}
//-----------------------------------------------------------------------------------------

/**
 * Fonction qui permet de changer de jour dans le calendrier de la commande.
 * La fonction gère les changements de mois en cliquant sur le bouton suivant/précédent.
 * La fonction gère également le cas où il faut revenir au mois précédent
 * 
 */
const changerDeJour = async () => {
    jourSuivant.setDate(maDate.getDate() + 1);                            // Je definis le jour suivant dans la variable dNextDay
    if(maDate.getMonth() < jourSuivant.getMonth()){			             // je vérifie si on doit changer de mois pour le jour suivant si oui je clique sur le bouton suivant
		await fonction.clickElement(pageCmdesCmd.datePickerCommande);
        await fonction.clickElement(pageCmdesCmd.datePickerFirstDay);
    }
    
	await fonction.clickElement(pageCmdesCmd.datePickerCommande); // Je clique  sur le jour suivant
    await fonction.clickElement(pageCmdesCmd.dateTrPickerDay.locator('td:text-is("'+jourSuivant.getDate()+'")').first());
	await fonction.clickElement(pageCmdesCmd.datePickerCommande);
	await fonction.waitForDomStable(page);

    if(jourSuivant.getMonth() > auJourdhui.getMonth()){			// Je vérifie  si on doit revenir au mois précédent si oui je clique sur le bouton precedant
		await fonction.clickElement(pageCmdesCmd.datePickerCommande);
        await fonction.clickElement(pageCmdesCmd.datePickerLinkPrev); 
    }
      
	await fonction.clickAndWait(pageCmdesCmd.datePickerCommande,page); // Je clique sur l'icone calendrier a nouveau pur le reouvrir
	await fonction.waitForDomStable(page);
    await fonction.clickElement(pageCmdesCmd.dateTrPickerDay.locator('td:text-is("'+auJourdhui.getDate()+'")').first());  // Je clique sur le jour actuelle 

};
//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page           = await browser.newPage();
	menu           = new MenuMagasin(page, fonction);
	pageCmdesCmd   = new CommandesCommande(page);
	pageAutAchCent = new AutorisationsAchatsCentrale(page);
	pageAutParam   = new AutorisationsParametrage(page);
	esb            = new EsbFunctions(fonction);
	const helper   = new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({ }, testInfo) => {
	await fonction.close(testInfo);
});

//-----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

	test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	});

	test('Connexion', async () => {
		await fonction.connexion(page);
	});

	test.describe('Page [ACCUEIL]', async () => {
		test('Link [BROWSER SECURITY WARNING] - Click', async () => {
			await fonction.waitTillHTMLRendered(page);
			if (await menu.pPopinAlerteSanitaire.isVisible()) {
				await menu.removeArlerteMessage(page);
			} else {
				log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
				test.skip();
			}
		});
	});

	test.describe('Page [AUTORISATIONS]', async () => {
		var pageName: string = 'autorisations';

		test('Page [AUTORISATIONS] - Click', async () => {
			await menu.click(pageName, page);
		});

		test('Label [ERREUR][0] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
			await fonction.isErrorDisplayed(false, page);
		});

		test.describe('Onglet [PARAMETRAGE]', async () => {

			test('Onglet [PARAMETRAGE] - Click', async () => {
				await menu.clickOnglet(pageName, 'parametrage', page);
			});

			test('Label [ERREUR][1] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
				await fonction.isErrorDisplayed(false, page);
			});

			test('Button [CREER ASSORTIMENT] - Click', async () => {
				await fonction.clickAndWait(pageAutParam.buttonCreerAssort, page);
			});

			test('Radio Button [TYPE ACHAT CENTRALE] - Click', async () => {
				await fonction.clickElement(pageAutParam.radioButtonachatCentrale);
			});

			test('ListBox [GROUPE] = "' + sGroupeArticle + '"', async () => {
				await fonction.listBoxByLabel(pageAutParam.listBoxOrigine, sGroupeArticle, page);
			});

			test('InputField [DESIGNATION] = "' + assortimentCentraleAch + '"', async () => {
				await fonction.sendKeys(pageAutParam.inputDesignation, assortimentCentraleAch, false, 'Désignation');
			});

			test('Radio Button [SAISIE OBLIGATOIRE] - Click', async () => {
				await fonction.clickElement(pageAutParam.checkBoxSaisieObligatoire);
			});

			test('Button [ENREGISTRER] - Is Enabled', async () => {
				expect(await pageAutParam.buttonEnregistrer.isEnabled()).toBe(true);
			});
			
			test('Button [ENREGISTRER] - Click', async () => {
				await fonction.clickAndWait(pageAutParam.buttonEnregistrer, page);
			});

			test('Button [ENREGISTRER] - Is Desabled', async () => {
				expect(await pageAutParam.buttonEnregistrer.isDisabled()).toBe(true);
			});
		})

		var sNomPopin:string = "Popin [MODIFICATION / CREATION D'UN GROUPE DE COMMANDE";
		test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

			test('Bouton [CREER GROUPE DE COMMANDE] - Click', async () => {
				await fonction.clickAndWait(pageAutParam.buttonCreerGrpCmd, page);
			});

			test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
				await fonction.popinVisible(page, sNomPopin, true);
			});

			var sGroupeCmde:string = sDesignGrpAssort;
			test('InputField [NOM] = "' + sGroupeCmde + '"', async () => {
				await fonction.sendKeys(pageAutParam.pInputNom, sGroupeCmde, false, 'Nom');
			});

			test('Date Picker [HEURE DEBUT] = "' + cmdHeureStart + '"', async () => {
				await fonction.sendKeys(pageAutParam.pDatePickerHeureDebut, cmdHeureStart, false, 'Heure Début');
			});

			test('Date Picker [MINUTE DEBUT] = "' + cmdMinuteStart + '"', async () => {
				await fonction.sendKeys(pageAutParam.pDatePickerMinuteDebut, cmdMinuteStart, false, 'Minute Début');
			});

			test('Date Picker [HEURE FIN] = "' + cmdHeureEnd + '"', async () => {
				await fonction.sendKeys(pageAutParam.pDatePickerHeureFin, cmdHeureEnd, false, 'Feure Fin');
			});

			test('Date Picker [MINUTE FIN] = "' + cmdMinuteEnd + '"', async () => {
				await fonction.sendKeys(pageAutParam.pDatePickerMinuteFin, cmdMinuteEnd, false, 'Minute Fin');
			});

			if (sCadence == 'jour') {                                                   // calendrier seulement pour commande aujourd'hui et prev demain
				test('Jour [COURANT] = "' + joursSemaine[iNumJourSemaine - 1] + '"', async () => {
						var iLigne:number = iNumJourSemaine;
						var iCible:number = iNumJourSemaine;

						await fonction.clickElement(pageAutParam.pListBoxExpedition.nth(iLigne));
						await fonction.clickElement(pageAutParam.choixJour(joursSemaine[iCible]));
						await fonction.addDataSheet('ListBox', 'jour Expédition', joursSemaine[iNumJourSemaine - 1] + ' -> ' + joursSemaine[iCible]);
				});

				test('Jour [LENDEMAIN] = "' + joursSemaine[iNumJourSemaine] + '"', async () => {
						var iLigne:number = iNumJourSemaine + 1;
						var iCible:number = iNumJourSemaine + 2;

						await fonction.clickElement(pageAutParam.pListBoxExpedition.nth(iLigne));
						await fonction.clickElement(pageAutParam.choixJour(joursSemaine[iCible]));
						await fonction.addDataSheet('ListBox', 'jour Expédition', joursSemaine[iNumJourSemaine - 1] + ' -> ' + joursSemaine[iCible]);
				});
			} else {         // calendrier avec commande tous les jours (sauf dimanche)

				for (let indice = 0; indice < 6; indice++) {
					test('Jour [COURANT] = "' + joursSemaine[indice] + '"', async () => {
							var iLigne:number = indice;
							var iCible:number = indice + 2;
							if (iCible === 7) {                                    // cas de commande le dimanche et livraison le lundi
								iCible = 1;
							}

							await fonction.clickElement(pageAutParam.pListBoxExpedition.nth(iLigne));
							await fonction.clickElement(pageAutParam.choixJour(joursSemaine[iCible]));
							await fonction.addDataSheet('ListBox', 'jour Expédition', joursSemaine[indice] + ' -> ' + joursSemaine[iCible]);
					});
				}
			}
			test('Input [DESIGNATION] - Click',async () => {
				await fonction.clickElement(pageAutParam.pPlistBoxDesignation.nth(0));
			}) 

			aListeMagasins.forEach(async (magasin:string) => {
				test('Multiselect [DESIGNATION][MAGASIN] = ' + magasin + '', async () => {
					await fonction.sendKeys(pageAutParam.pPinputDesignation.nth(0), magasin, false, 'Magasin');
					var bIsVisible:boolean= await pageAutParam.pPcheckBoxEnrFilter.first().isVisible();
					if(bIsVisible){
						await fonction.clickAndWait(pageAutParam.pPcheckBoxEnrFilter.first(), page);
					}
				})  
			})

			test('Checkbox [ALL] - Click', async () => {
				await fonction.clickElement(pageAutParam.pPpictoEnrClose);
				await fonction.clickAndWait(pageAutParam.pPcheckBoxEnrAllMag.nth(0), page);
			})

			test('Bouton [ENREGISTRER] - Click', async () => {
				await fonction.clickAndWait(pageAutParam.pButtonEnregistrer, page);
			});
		})

		test.describe('Onglet [ACHAT CENTRALE]', async () => {

			test('Onglet [ACHAT CENTRALE] - Click', async () => {
				await menu.clickOnglet(pageName, 'autorisationAchatCentrale', page);
			});

			test('ListBox [GROUPE ARTICLE] - click', async () => {
				await fonction.clickAndWait(pageAutAchCent.listBoxGroupeArticle, page)
			});

			test('ListBox [ARTICLE] = "' + sGroupeArticle + '"', async () => {
				var iNbGroupearticleListBox:number = await pageAutAchCent.listBoxGrpeArtItem.count();
				for (let i = 0; i < iNbGroupearticleListBox; i++) {
					var sDesignationText:string = await pageAutAchCent.listBoxGrpeArtItem.nth(i).innerText();
					if (sDesignationText == sGroupeArticle) {
						await fonction.clickElement(pageAutAchCent.listBoxGrpeArtItem.nth(i));
					}
				}
			});

			test('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
				await fonction.clickElement(pageAutAchCent.listBoxGroupeArticle);
			});

			test('InputField [ASSORTIMENT] = "' + assortimentCentraleAch + '"', async () => {
				await fonction.sendKeys(pageAutAchCent.inputAssortiment, assortimentCentraleAch, false, 'Assortiment');
			});

			test('DataGrid [ASSORTIMENTS][FIRST] - CLick', async () => {
				await fonction.waitForDomStable(page);
				await fonction.clickAndWait(pageAutAchCent.trLignesAssortiments.first(), page);
			});
			 
			aArticle.forEach((article:string) => {
				test('InputField [ARTICLE] = "' + article + '"', async () => {
					var oData:AutoComplete = {
						libelle         :'ARTICLE',
						inputLocator    : pageAutAchCent.inputArticle,
						inputValue      : article.toString(),
						choiceSelector  :'div.autocomplete-article app-autocomplete button.dropdown-item:last-child',
						choicePosition  : 0,
						typingDelay     : 150,
						waitBefore      : 750,
						page            : page,
					};
					await fonction.autoComplete(oData);
				})

				test('Button [ + ] [ARTICLE] = "' + article + '"- Click', async () =>  {                       
					await fonction.clickAndWait(pageAutAchCent.buttonPlus, page);
				})

				test('Select [CALIBRE][ARTICLE] = "' + article + '"', async () => { 
					await fonction.clickElement(pageAutAchCent.pPSelectCalibre);  // selectionner un calibre
					await pageAutAchCent.pPSelectCalibre.selectOption({index: 1});
			    });

				test('Select [CONDITIONNEMENT][ARTICLE] = "' + article + '"', async () => { 
					await fonction.clickElement(pageAutAchCent.pPSelectConditionnement); // selectionner un calibre et un conditionnement 
					await pageAutAchCent.pPSelectConditionnement.selectOption({index: 1});
			    });

				test.describe ('Datagrid [MAGASIN] : ' + article, async () =>  {
					test('Input [DESIGNATION][ARTICLE] = "' + article + '"- Click',async () => {
						await fonction.clickElement(pageAutParam.pPlistBoxDesignation.nth(0));
					}) 

					aListeMagasins.forEach(async (magasin:string) => {
						test('Multiselect [DESIGNATION][MAGASIN] = ' + magasin + '', async () => {
							await fonction.sendKeys(pageAutParam.pPinputDesignation.nth(0), magasin, false, 'Magasin');
							if(await pageAutParam.pPcheckBoxEnrFilter.first().isVisible()){
								await fonction.clickAndWait(pageAutParam.pPcheckBoxEnrFilter.first(), page);
							}
						})  
					})

					test('Checkbox [ALL] - Click', async () => {
						await fonction.clickElement(pageAutParam.pPpictoEnrClose);
						await fonction.clickAndWait(pageAutParam.pPcheckBoxEnrAllMag.nth(0), page);
					})

					test('Bouton [ENREGISTRER][ARTICLE] = "' + article + '"- Click', async () => {
						await fonction.clickAndWait(pageAutParam.pButtonEnregistrer, page);
						if (await pageAutParam.pPalertConditionMessageOui.isVisible()) {          // si le message d'alerte s'affiche, cliquer sur "oui"
							await fonction.clickElement(pageAutParam.pPalertConditionMessageOui);
						}
					});
				})
			})

			test.describe('Onglet [PARAMETRAGE]', async () => {

				test('Onglet [PARAMETRAGE] - Click', async () => {
					await menu.clickOnglet(pageName, 'parametrage', page);
				});

				test('Label [ERREUR][1] - Is Not Visible', async () => {        // Pas d'erreur affichée à priori au chargement de la page
					await fonction.isErrorDisplayed(false, page);
				});
				test('InputField [ASSORTIMENT] = "' + assortimentCentraleAch + '"', async () => {
					await fonction.sendKeys(pageAutParam.inputFieldFilter, assortimentCentraleAch, false, 'Assortiment');
				});

				test('DataGrid [ASSORTIMENTS][FIRST] - CLick', async () => {
					await fonction.waitForDomStable(page);
					await fonction.clickAndWait(pageAutParam.tdLibelleAssortiment.filter({ hasText: assortimentCentraleAch }).first(), page);
				});
				
				test('Datagrid [MODIFIER GROUPE COMMANDE] - Click', async () => {
					await fonction.clickAndWait(pageAutParam.dataGridListGrpCmd.first(), page);
				});

				test('Button Picto [MODIFIER GROUPE COMMANDE ] - click', async () => {
					await fonction.clickAndWait(pageAutParam.pictoModifier, page);
				});

				var sNomPopin: string = "MODIFICATION D'UN GROUPE DE COMMANDE";
				test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {
					test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
						await fonction.popinVisible(page, sNomPopin, true);
					});
					
					test('Date Picker [HEURE DEBUT] = "' + cmdHeureStart + '"', async () => {
						await fonction.sendKeys(pageAutParam.pDatePickerHeureDebut, heureActuelle, false, 'Heure Début'); // heure actuelle pour que la commande soit ouverte maintenant
					});
		
					test('Date Picker [MINUTE DEBUT] = "' + cmdMinuteStart + '"', async () => {
						await fonction.sendKeys(pageAutParam.pDatePickerMinuteDebut, MinuteActuelle, false, 'Minute Début'); 
					});
		
					test('Date Picker [HEURE FIN] = "' + cmdHeureEnd + '"', async () => {
						await fonction.sendKeys(pageAutParam.pDatePickerHeureFin, cmdHeureEnd, false, 'Heure Fin');
					});
		
					test('Date Picker [MINUTE FIN] = "' + cmdMinuteEnd + '"', async () => {
						await fonction.sendKeys(pageAutParam.pDatePickerMinuteFin, cmdTmpLimitOuver, false, 'Minute Fin'); // temps limite pour la fermeture de la commande
					});

					test('Button [ENREGISTRER] - Click x2', async () => {
						await fonction.clickElement(pageAutParam.pButtonEnregistrer, page);
						await fonction.clickElement(pageAutParam.pButtonEnregistrer, page);
						await fonction.waitForDomStable(page);
					});

					test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
						await fonction.popinVisible(page, sNomPopin, false, 12000);    //<-- excptionnellement le temps de fermeture de la popin est plus long
					});
				});
			});
		});
	});

	test.describe('Page [COMMANDES]', async () => {
		var sRole    :string    = 'RESPONSABLE RAYON';
		var sPageName:string    = 'commandes';

		test ('Changer profil', async () => {                           /**Ici on change de role pour pouvoir voir les commandes si elles contiennent  les quantités indiquées dans l'engagement initialement créé. */
			await fonction.changeProfilByRole(info.appli, sRole, page);
			await fonction.waitTillHTMLRendered(page);  
		})
		
		test('Page [COMMANDES] - Click', async () => {
			await menu.click(sPageName, page);
		});

		test('Label [ERREUR][0] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
			await fonction.isErrorDisplayed(false, page);
		});

		aListeMagasins.forEach(async (magasin:string) => {
			test.describe ('Div [MAGASIN] = "' + magasin + '"', async () =>  {

				test ('ListBox [MAGASIN] - Click', async () => {
					await menu.selectVille(magasin, page);
				})

				test('Button [A FAIRE] - Click', async () => {
					await fonction.clickAndWait(pageCmdesCmd.toggleStatut.nth(0), page);
				});

				test('** TRAITEMENT  **', async () => {
					await changerDeJour();
					await fonction.waitForDomStable(page); // On laisse le Dom se stabiliser avant de continuer
				});
				
				test('Datagrid [COMMANDES] - Click', async () => {					
					await fonction.clickAndWait(pageCmdesCmd.dataGridLibelleCmd.filter({ hasText: assortimentCentraleAch }).last(), page);
				});
				
				test('Button [FERMER PROMOTION][SECOND] - Click', async () => {
					if( await pageCmdesCmd.pPpromotion.isVisible()){
						await fonction.clickAndWait(pageCmdesCmd.pPbuttonfermerPromotion, page);
					}
					await fonction.waitForDomStable(page);
				});

				test('Td [QUANTITE PREVISIONNELLE][QUANTITE REFERENCE] = "' + aQuantiteInitiale + '"', async () => {     /**Les colonnes Commande et Prévision contiennent les quantités indiquées dans l'engagement initialement créé. */
					const sValeurQuantitePrev:string = await pageCmdesCmd.dataGridTdquantitePrev.first().textContent(); // Je recupere la quantité previsionnelle et la quantité de reference
					const sValeurQuantiteRef :string = await pageCmdesCmd.dataGridTdquantiteRef.first().textContent(); // Contenu dans les td de la datagrid
					const aValeursQuantites = [sValeurQuantitePrev,sValeurQuantiteRef].filter(v => v !== '');         // j'ajoute les valeurs non vides
					log.set(`Quantité prévisionnelle                                : ${sValeurQuantitePrev}`);
					log.set(`Quantité référence                                     : ${sValeurQuantiteRef}`);
					log.set(`Valeurs quantités trouvées                             : ${aValeursQuantites}`);
					const aValeursPresentes = aQuantiteInitiale.filter(sValeur => // Je vérifie la correspondance avec les valeurs attendues
						aValeursQuantites.includes(sValeur)					     /** Au moins (2) valeurs des  quantités initiales doivent apparaitres dans les quantités de la datagrid */
					);
					expect(aValeursPresentes.length).toBeGreaterThanOrEqual(2); // J'attends au moins 2 valeurs correspondantes 
					log.set(` ${aValeursPresentes.length} valeurs correspondantes trouvées`);
				});

				test('Button [ENVOYER LA COMMANDE] - Click', async () => {			                // j'envoie la commande 
					await fonction.clickAndWait(pageCmdesCmd.buttonEnvoyer, page);
				});
			})
		})
	});

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

	test('** CHECK FLUX **', async () => {
		var oFlux: TypeEsb = {
			"FLUX": [
				{
					"NOM_FLUX": "Diffuser_Commande",
					STOP_ON_FAILURE: false
				},

			],
			"WAIT_BEFORE": 5000,
		}
		await esb.checkFlux(oFlux, page);
	});
});