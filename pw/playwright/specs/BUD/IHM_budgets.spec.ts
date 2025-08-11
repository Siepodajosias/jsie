/**
 * 
 * @author SIAKA KONE
 * @since 2024-10-21
 * 
 */

const xRefTest      = "BUD_IHM_GLB";
const xDescription  = "Examen Global de l'IHM - Sigale Budget";
const xIdTest       =  4963;
const xVersion      = '3.10';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'BUDGETS',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['exploitation','groupeArticle'],
	fileName    : __filename
};

import {  test, expect, type Page }         from '@playwright/test';

import { CartoucheInfo, TypeListOfElements} from '@commun/types';

import { Help }                  			from '@helpers/helpers';
import { TestFunctions }         			from '@helpers/functions';
import { Log }                   			from '@helpers/log';

import { MenuBudgets }           			from '@pom/BUD/menu.page';

import { Accueil } 							from '@pom/BUD/accueil.page';

import { BudgetMagClients } 	 			from '@pom/BUD/budget_magasin_clients.page';
import { BudgetMagEffectifs }    			from '@pom/BUD/budget_magasin_effectis.page';
import { BudgetMagEcartMarge }   			from '@pom/BUD/budget_magasin_ecart_marge.page';

import { ParametrageOverturesSaisies } 		from '@pom/BUD/parametrage_ouverture_saisies.page';
import { ParametragePerimetreConstant } 	from '@pom/BUD/parametrage_perimetre_constant.page';
import { ParametrageImpactsCalendaires } 	from '@pom/BUD/parametrage_impacts_calendaires.page';
import { ParametrageInformationsMagasin } 	from '@pom/BUD/parametrage_informations_magasin.page';
import { ParametrageCoeffProgression } 		from '@pom/BUD/parametrage_coefficient_progression.page';
import { ParametrageRegroupement } 			from '@pom/BUD/parametrage_regroupement.page';
import { ParametrageChargement } 			from '@pom/BUD/parametrage_chargement.page';

import { Admin }                 			from '@pom/BUD/admin.page';
import { AdminActions } 					from '@pom/BUD/admin_actions.page';

let page                					: Page;
let menu                					: MenuBudgets;
let pageAdmin           					: Admin;
let pageAdminActions                		: AdminActions;
let accueil             					: Accueil;
let budgetMagClient                 		: BudgetMagClients;
let budgetMagEffectifs              		: BudgetMagEffectifs;

let budgetMagEcartMarge             		: BudgetMagEcartMarge;
let parametrageOuverture            		: ParametrageOverturesSaisies;
let parametragePerimetreConstant    		: ParametragePerimetreConstant;
let parametrageImpactsCalendaires   		: ParametrageImpactsCalendaires;
let parametrageInformationsMagasin  		: ParametrageInformationsMagasin;
let parametrageCoeffProgression     		: ParametrageCoeffProgression;
let parametrageRegroupement         		: ParametrageRegroupement;
let parametrageChargement           		: ParametrageChargement;

const log               					= new Log();
const fonction          					= new TestFunctions(log);
var maDate              					= new Date();

const iAnnee      							= maDate.getFullYear();
const sAnnee								= iAnnee.toString();
const sAnneePrecedente						= String(iAnnee - 1);
const sAnneeMoinsDeux						= String(iAnnee - 2);


var sDirection								= fonction.getInitParam('exploitation','Grand Frais FL'); //Grand Frais Crèmerie ,fresh. //TA_Direction
var sGroupeArticle      					= fonction.getInitParam('groupeArticle','Fruits et légumes'); //Fruits et légumes

//---------------------------------------------------------------------------------------------------------------------------------




test.beforeAll(async ({ browser }, testInfo) => {
    page            						= await browser.newPage();
    menu            						= new MenuBudgets(page, fonction);
    pageAdmin       						= new Admin(page);
	pageAdminActions                        = new AdminActions(page);
	accueil         						= new Accueil(page);
	budgetMagClient 						= new BudgetMagClients(page);
	budgetMagEffectifs  					= new BudgetMagEffectifs(page);
	budgetMagEcartMarge               		= new BudgetMagEcartMarge(page);
	parametrageOuverture              		= new ParametrageOverturesSaisies(page);
	parametragePerimetreConstant      		= new ParametragePerimetreConstant(page);
	parametrageImpactsCalendaires     		= new ParametrageImpactsCalendaires(page);
	parametrageInformationsMagasin    		= new ParametrageInformationsMagasin(page);
	parametrageCoeffProgression       		= new ParametrageCoeffProgression(page);
	parametrageRegroupement           		= new ParametrageRegroupement(page);
	parametrageChargement             		= new ParametrageChargement(page);
    const helper    						= new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//---------------------------------------------------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () =>  {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () =>  {
        await fonction.connexion(page);
    })
	
	test.describe ('Page [ACCUEIL]', async () =>  {
		
		var sNomPage = 'accueil';
		test ('Menu [ACCUEIL] - Click', async () =>  {
			await menu.click(sNomPage, page);
		})

		test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })

		test ('Page [ACCUEIL] - Is Visible', async () => {
			await fonction.isDisplayed(accueil.labelWelcomeMessage);
		})

	})

	test.describe ('Page [BUDGETS MAGASIN]', async () =>  {

		var sNomPage1 = 'budgetsMagasin';
		test ('Menu [BUDGET MAGASIN] - Click', async () =>  {
			await menu.click(sNomPage1, page);
		})

		test ('ListBox [ANNEE] = "' + sAnnee + '"', async () => {
			await budgetMagClient.listboxbmAnneeExercice.selectOption({index:0});

		})

		test ('ListBox [EXPLOITATION] = "' + sDirection + '"', async () => {
			await fonction.listBoxByLabel(budgetMagClient.listboxbmDirectionExploitation, sDirection, page);
		})

		test ('ListBox [REGION][First] - Select', async () => {
			if (await budgetMagClient.listboxbmRegion.isEditable()) {
				await budgetMagClient.listboxbmRegion.selectOption({index:1});
				await fonction.wait(page,250);
			} 
		})

		test ('ListBox [SECTEUR][First] - Select', async () => {
			if (await budgetMagClient.listboxbmSecteur.isEditable()) {
				await budgetMagClient.listboxbmSecteur.selectOption({index:1});
				await fonction.wait(page,250);
			}
		})

		test ('ListBox [MAGASIN][First] - Select', async () => {
			if (await budgetMagClient.listboxbmMagasin.isEditable()) {
				await budgetMagClient.listboxbmMagasin.selectOption({index:1});
			}
		})

		var sNomOnglet0 = 'clients';
		test.describe ('Onglet['+sNomOnglet0.toUpperCase()+']',async () =>  {

			test ('Onglet [' + sNomOnglet0.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage1, sNomOnglet0, page);
			})

			test ('Button [COEFF DE PROGRESSION] - Is Visible', async () => {
				await fonction.clickAndWait(budgetMagClient.buttonCoeffProgression, page);
			})
			
			test.describe ('Datagrid [GROUPE ARTICLE][DE]', async () => {

				//-- Désactivation examen DataGrid car contexte tro fluctuent/dépendant des données introduites
				test.skip ('Datagrid [GROUPE ARTICLE] - Check', async () => {

					test.setTimeout(180000);
					const iNbreDataGrid         :number  = await budgetMagClient.dataGridHeader.count();
					let   iNbreColonne          :number  = await budgetMagClient.dataGridHeader.nth(0).locator('.p-datatable-thead > tr > th').count();
					const anneeActuelle         : any    = await budgetMagClient.listboxbmAnneeExerciceOption.nth(0).innerText() //récupération de l'annee actuelle (excercie)
					const iAnneePasser          :number  = anneeActuelle-1
					const iAnneeMoinsdeuxpasser :number  = anneeActuelle-2
					
					for ( let iCpt = 0; iCpt < iNbreDataGrid; iCpt++ ) {
					
						const bAriaHiddenValue = await budgetMagClient.dataTable.nth(iCpt).getAttribute('aria-hidden');
						log.set(iCpt + ' : ' + bAriaHiddenValue);

						if (bAriaHiddenValue) {
							await fonction.clickElement(budgetMagClient.headerGroupeArticle.nth(iCpt));
						}
						
					// si le nombre de  colonnes est egale à 14 on entre dans cette condition
						if (iNbreColonne === 14) {
							var oDataGrid: TypeListOfElements = {
								element: budgetMagClient.dataGridHeader.nth(iCpt).locator('.p-datatable-thead > tr > th'),
								desc: 'DataGrid [GROUPE ARTICLE]',
								verbose: false,
								column: [
								  "Mois",
								  ""+iAnneeMoinsdeuxpasser, 
								  ""+iAnneePasser, 
								  "Impact calendaire",
								  "Atterrissage "+iAnneePasser, 
								  "Coeff. de progr Atterrissage "+iAnneePasser, 
								  anneeActuelle, 
								  "Coeff. de progression",
								 "Poids des mois"+anneeActuelle, 
								  "Évol. Atterrissage " + iAnneePasser + " vs. " + iAnneeMoinsdeuxpasser,
								  "Évol." + anneeActuelle + "vs. Atterrissage " + iAnneePasser,
								  "Cannib.",
								  "Commentaire",
								  "Ev. Exc."
								],
							  };
							oDataGrid.column = oDataGrid.column.map((col:string) => col.trim());
							await fonction.dataGridHeaders(oDataGrid);
						}else {
							// si les colonnes ne sont pas égales à 14 on entre dans cette condition
							var oDataGrid: TypeListOfElements = {
								element: budgetMagClient.dataGridHeader.nth(iCpt).locator('.p-datatable-thead > tr > th'),
								desc: 'DataGrid [GROUPE ARTICLE]',
								verbose: false,
								column: [
								  "Mois",
								  ""+iAnneeMoinsdeuxpasser, 
								  ""+iAnneePasser, 
								  "Impact calendaire",
								  ''+anneeActuelle,
								//   "Coeff. de progr Atterrissage " + iAnneePasser, 
								  "Atterrissage 2024", 
								  "Coeff. de progression",
								  "Poids des mois Atterrissage"+anneeActuelle, 
								  "Évol. " + iAnneePasser + " vs. "+iAnneeMoinsdeuxpasser, 
								  "Évol. Atterrissage"+anneeActuelle + "vs. " + iAnneePasser, 
								  "Cannib.", 
								  "Commentaire",
								  "Événements exceptionnels"
								]
							  };
							oDataGrid.column = oDataGrid.column.map((col:string) => col.trim());
							await fonction.dataGridHeaders(oDataGrid);
						}
						
	
						
					}

				})
				

			})

		})

		var sNomOnglet1 = 'ecarts de marge';
		test.describe ('Onglet['+sNomOnglet1.toUpperCase()+']',async () =>  {

			test ('Onglet [' + sNomOnglet1.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage1, 'ecartMarge', page);
			})

			test.describe ('Saisie des Ecarts de marge pour les differents GA'.toUpperCase(), async () => {

				test ('Table [GROUPE ARTICLE] - Is Visible', async () => {
					await fonction.isDisplayed(budgetMagEcartMarge.tableInformationsEcartsMarge.first());
				})

				test ('Button [ENREGISTRER] - Is Visible', async () => {
					await fonction.isDisplayed(budgetMagEcartMarge.buttonbmEnregistrer);
				})

				test.describe ('Groupe article '.toUpperCase(), async () => {

					//-- Désactivation examen DataGrid car contexte tro fluctuent/dépendant des données introduites
					test.skip ('Datagrid [GROUPE ARTICLE] - Check', async () => {

						test.setTimeout(180000);
						const iNbreDataGrid         :number  = await budgetMagClient.dataGridHeader.count();
						const   iNbreColonne        :number  = await budgetMagClient.dataGridHeader.nth(0).locator('.p-datatable-thead > tr > th').count();
						const anneeActuelle         : any    = await budgetMagClient.listboxbmAnneeExerciceOption.nth(0).innerText() //Récupération de l'annee (exercice) actuelle
					    const iAnneePasser          :number  = anneeActuelle-1
					    const iAnneeMoinsdeuxpasser :number  = anneeActuelle-2

						for ( let iCpt = 0; iCpt < iNbreDataGrid; iCpt++ ) {

							const bAriaHiddenValue = await budgetMagClient.dataTable.nth(iCpt).getAttribute('aria-hidden');

							if (bAriaHiddenValue) {
								await fonction.clickElement(budgetMagClient.headerGroupeArticle.nth(iCpt));
							}
						
							// Si les colonnes sont égales à 12 on entre dans cette condition

							if (iNbreColonne === 12) {
								var oDataGrid:TypeListOfElements = {
									element     : budgetMagClient.dataGridHeader.nth(iCpt).locator('.p-datatable-thead > tr > th'),    
									desc        : 'DataGrid [GROUPE ARTICLE]',
									verbose		: false,
									column      : [
										"Mois",
										""+iAnneeMoinsdeuxpasser, 
										"Marge théorique "+iAnneePasser,
										""+iAnneePasser,
										"Valorisation "+iAnneePasser + " en €",
										"Budget"+anneeActuelle,
										// "Valorisation " + sAnnee + " en €",
										"Atterrissage" + anneeActuelle,
										"Valorisation Atterrissage"+anneeActuelle+"en €",
										""+iAnneePasser + " vs. "+iAnneeMoinsdeuxpasser, 
										"Atterrissage"+anneeActuelle+"vs. "+iAnneePasser,
										"Commentaire",
										"Événements exceptionnels"          
									]
								}
								oDataGrid.column = oDataGrid.column.map((col:string) => col.trim());
								await fonction.dataGridHeaders(oDataGrid);

							}else {			

							// si les colonnes ne sont pas 12 on entre dans cette condition

							var oDataGrid:TypeListOfElements = {
								element     : budgetMagClient.dataGridHeader.nth(iCpt).locator('.p-datatable-thead > tr > th'),    
								desc        : 'DataGrid [GROUPE ARTICLE]',
								verbose		: false,
								column      : [
									"Mois",
									""+iAnneeMoinsdeuxpasser, 
									"Marge théorique "+iAnneePasser,
									""+iAnneePasser,
									"Valorisation "+iAnneePasser+" en €",
									"Budget"+anneeActuelle,
									"Valorisation"+anneeActuelle+"en €",
									""+iAnneePasser + " vs. " + iAnneeMoinsdeuxpasser, 
									""+anneeActuelle+"vs. "+iAnneePasser,
									"Commentaire",
									"Événements exceptionnels"          
								]
						
							}

							// ici j'élimine les espaces inutiles
							oDataGrid.column = oDataGrid.column.map((col:string) => col.trim());
							await fonction.dataGridHeaders(oDataGrid);

							}
							
												
						}
					})

				})

			})
			
		})

		var sNomOnglet2 = 'effectifs';
		test.describe ('Onglet['+sNomOnglet2.toUpperCase()+']',async () =>  {

			test ('Onglet ['+sNomOnglet2.toUpperCase()+ '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage1, sNomOnglet2, page);
			})
			
			test.describe('[REGROUPEMENT]', async () => {

				test ('Button [REGROUPEMENT] - Click', async () => {
					await fonction.clickAndWait(budgetMagEffectifs.buttonRegroupement.first(), page);
				})

				test ('Table [TABLEAUX] - Is Visible', async () => {
					await fonction.isDisplayed(budgetMagEffectifs.tableRecapitulatif);
				})
	
				test ('Table [RECAPITULATIF HEURE] - Is Visible', async () => {
					await fonction.isDisplayed(budgetMagClient.tableGroupeArticle.nth(2));
				})

				test ('Table [TABLEAUX RECAPITULATIFS] - Is Visible', async () => {
					await fonction.isDisplayed(budgetMagClient.tableGroupeArticle.nth(3));
				})
	
				test.describe('Type de poste', async () => {

					test ('Button [RESPONSABLE DE RAYON] - Is Visible', async () => {
						await fonction.isDisplayed(budgetMagEffectifs.buttonTypePoste.nth(0));
					})

					// test ('Button [ADJOINT DE RAYON] - Is Visible', async () => {
					// 	await fonction.isDisplayed(budgetMagEffectifs.buttonTypePoste.nth(1)); retirée
					// })

					test ('Button [SECOND DE RAYON] - Is Visible', async () => {
						await fonction.isDisplayed(budgetMagEffectifs.buttonTypePoste.nth(1));
					})

					test ('Button [VENDEUR/GONDOLIER] - Is Visible', async () => {
						await fonction.isDisplayed(budgetMagEffectifs.buttonTypePoste.nth(2));
					})

					test.describe('List [BUTTON][TYPE DE POSTE] - Click', async () => {
						
						test ('Button [RESPONSABLE DE RAYON] - Click', async () => {
							await fonction.clickAndWait(budgetMagEffectifs.buttonTypePoste.nth(0), page);							
						})

						// test ('Button [ADJOINT DE RAYON] - Click', async () => {
						// 	await fonction.clickAndWait(budgetMagEffectifs.buttonTypePoste.nth(1), page); retirée
						// })

						test ('Button [SECOND DE RAYON] - Click', async () => {
							await fonction.clickAndWait(budgetMagEffectifs.buttonTypePoste.nth(1), page);
						})

						test ('Button [VENDEUR / GONDOLIER] - Click', async () => {
							await fonction.clickAndWait(budgetMagEffectifs.buttonTypePoste.nth(2), page);
						})
					})
				})
			})
		})

		var sNomOnglet3 = 'chiffres d\'Affaire';
		test.describe ('Onglet['+sNomOnglet3.toUpperCase()+']',async () =>  {

			test ('Onglet [' + sNomOnglet3.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage1, 'chiffreAffaire', page);
			})

			test.describe ('Groupe article', () => {

				//-- Désactivation examen DataGrid car contexte tro fluctuent/dépendant des données introduites
				test.skip ('Datagrid [DATAGRID GROUPE ARTICLE] - Check', async () => {

					test.setTimeout(180000);
					const iNbreDataGrid:number = await budgetMagClient.dataGridHeader.count();
					let aColumn:any;

					for ( let iCpt = 0; iCpt < iNbreDataGrid; iCpt++ ) {
						const bAriaHiddenValue = await budgetMagClient.dataTable.nth(iCpt).getAttribute('aria-hidden');
						const sText = await budgetMagClient.headerGroupeArticle.nth(iCpt).locator('span:NOT(.ng-star-inserted)').textContent();
						if (bAriaHiddenValue) {
							await fonction.clickElement(budgetMagClient.headerGroupeArticle.nth(iCpt));
						}

						if(sText === "Fruits et légumes"){

							aColumn = [
								"Mois", 
								"Poids "+sAnneeMoinsDeux+" | poids mois", 
								"Poids "+sAnneePrecedente+" | poids mois", 
								"Budget poids "+sAnnee+" | poids mois", 
								"CA "+sAnneeMoinsDeux+" | poids mois", 
								"CA "+sAnneePrecedente+" | poids mois", 
								"Budget CA "+sAnnee+" | poids mois", 
								"Évol. CA "+sAnneePrecedente+" vs. "+sAnneeMoinsDeux, 
								"Évol. CA "+sAnnee+" vs. " + sAnneePrecedente
							];

						} else {
							
							aColumn = [
								"Mois", 
								"UVC "+sAnneeMoinsDeux+" | poids mois", 
								"UVC "+sAnneePrecedente+" | poids mois", 
								"Budget UVC "+sAnnee+" | poids mois", 
								"CA "+sAnneeMoinsDeux+" | poids mois", 
								"CA "+sAnneePrecedente+" | poids mois", 
								"Budget CA "+sAnnee+" | poids mois", 
								"Évol. CA "+sAnneePrecedente+" vs. "+sAnneeMoinsDeux, 
								"Évol. CA "+sAnnee+" vs. " + sAnneePrecedente
							];

						}

						var oDataGrid:TypeListOfElements = {
							element     : budgetMagClient.dataGridHeader.nth(iCpt).locator('.p-datatable-thead > tr > th'),    
							desc        : 'DataGrid [GROUPE ARTICLE]',
							verbose		: false,
							column		: aColumn     
						}

						await fonction.dataGridHeaders(oDataGrid);
					}
				})
			})

		}) 

	})   
		
	test.describe ('Pages [PARAMETRAGE]', async () =>  {
	   
		var sNomPage2 = 'parametrage';
		test ('Menu [' + sNomPage2.toUpperCase() + '] - Click', async () =>  {
			await menu.click(sNomPage2, page);
		})

		test ('ListBox [ANNEE] = "' + sAnnee + '"', async () => {
			await fonction.listBoxByLabel(budgetMagClient.listboxbmAnneeExercice, sAnnee.toString(), page);
		})

		var sNomOnglet = 'ouverture des saisies';
		test.describe ('Onglet['+sNomOnglet.toUpperCase()+']',async () =>  {
	
            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage2, 'ouvertureSaisie', page);
			})

			test ('Thead [DIRECTION EXPLOITATION] - Click', async () => {
				await fonction.clickElement(parametrageOuverture.theadDirectionExploitationSort);
			})
	
			test ('SwitchButton [ACTIF] -Is Visisble', async () => {
				await fonction.isDisplayed(parametrageOuverture.switchButtonActif.first());
			})
	
			test ('SwitchButton [INACTIF] -Is Visisble', async () => {
				await fonction.isDisplayed(parametrageOuverture.witchButtonNonActif.first());
			})
	
			test ('Button [ENREGISTRER] - Is Visible', async () => {
				await fonction.isDisplayed(parametrageOuverture.buttonEnregistrer);
			})
	
			test ('Button [CREER NOUVELL EXERCICE] - Is Visible', async () => {
				await fonction.isDisplayed(parametrageOuverture.buttonCreerNouvelExercice);
			})

		})

		var sNomOnglet1 = 'impacts calendaires';
		test.describe ('Onglet['+sNomOnglet1.toUpperCase()+']',async () =>  {

			test ('Onglet [' + sNomOnglet1.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage2, 'impactCalendaire', page);
			})

			test ('DataGridHead [IMPACT CALENDAIRE] - Check element', async () => {
				
				var oDataGrid:TypeListOfElements = {
					element     : parametrageImpactsCalendaires.dataHeader,    
					desc        : 'DataGrid [IMPACT CALENDAIRE]',
					verbose		: false,
					column      : [
						"Mois", 
						"Fermés le dimanche", 
						"Ouverts le dimanche"         
					]
				}

				await fonction.dataGridHeaders(oDataGrid);
			})

			test ('DataGrid [IMPACT CALENDAIRE] - Is Visisble', async () => {
				await fonction.isDisplayed(parametrageImpactsCalendaires.dataGrid);
			})

			test ('Button [ENREGISTRER] - Is Visible', async () => {
				await fonction.isDisplayed(parametrageImpactsCalendaires.buttonEnregistrer);
			})

		})

		var sNomOnglet2 = 'perimetre constant';
		test.describe ('Onglet['+sNomOnglet2.toUpperCase()+']',async () =>  {

			test ('Onglet [' + sNomOnglet2.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage2, 'perimetreConstant', page);
			})

			test ('DataGridHead [PERIMETRE CONSTANT] - Check element', async () =>  {
			
				var oDataGrid:TypeListOfElements = {
					element     : parametragePerimetreConstant.dataGridHeader,    
					desc        : 'DataGrid [PERIMETRE CONSTANT]',
					verbose		: false,
					column      : [
						"Lieu de vente",
						"Enseigne", 
						"Saisie du budget", 
						"PC BCT","PC Boulangerie",
						"PC Crèmerie", 
						"PC Epicerie", 
						"PC Fruits et légumes", 
						"PC Poissonnerie", 
						"PC Traiteur", 
						"Date d'ouverture"         
					]
				}

				await fonction.dataGridHeaders(oDataGrid);
				
			})

			test ('InputFiled [LIEU DE VENTE] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametragePerimetreConstant.inputFiltreLieuVente);
			})

			test ('InputField [DATE OUVERTURE] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametragePerimetreConstant.inputFiltreDateOuverture);
			})

			test ('Button [LIEU DE VENTE] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametragePerimetreConstant.buttonFiltre.nth(0));
			})

			test ('ListBox [LIEU DE VENTE] - Is Visible', async () =>  {
				await fonction.clickElement(parametragePerimetreConstant.buttonFiltre.nth(0));
				await fonction.isDisplayed(parametragePerimetreConstant.listBoxFiltre.first());
			})

			test ('MultiSelect [ENSEIGNE] - Click', async () =>  {
				await fonction.clickElement(parametragePerimetreConstant.multiSelect);
			})

			test ('InputField [ENSEIGNE] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametragePerimetreConstant.inputFiltreEnseigne);
			})

			test ('CheckBox [ENSEIGNE] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametragePerimetreConstant.checkBoxEnseigne.first());
			})

			test ('CheckBoxAll [ENSEIGNE] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametragePerimetreConstant.checkBoxAllEnseigne);
			})

			test ('Icon [ENSEIGNE] - Click', async () =>  {
				await fonction.clickAndWait(parametragePerimetreConstant.iconCloseFiltreEnseigne, page);
			})

			test ('CheckBox [FILTRE ENTETE] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametragePerimetreConstant.checkBoxFiltreHeader.first());
			})

			test ('CheckBox [SAISIE BUDGET] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametragePerimetreConstant.checkBoxFiltreSaisieBudget.first());
			})

			test ('CheckBox [RAYONS] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametragePerimetreConstant.checkBoxFiltreRayons.first());
			})

			test ('Button [DATE OUVERTURE] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametragePerimetreConstant.buttonFiltre.nth(1));
			})

			test ('ListBox [DATE OUVERTURE] - Is Visible', async () =>  {
				await fonction.clickElement(parametragePerimetreConstant.buttonFiltre.nth(1));
				await fonction.isDisplayed(parametragePerimetreConstant.listBoxFiltre.first());
			})

			test ('Button [CALENDRIER] - Click', async () =>  {
				await fonction.clickElement(parametragePerimetreConstant.buttonCalendar);
			})

			test ('dataCalendar [CALENDRIER] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametragePerimetreConstant.calendar);
			})

			test ('Button [ENREGISTRER] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametragePerimetreConstant.buttonEnregistrer);
			})

			test ('Button [COPIER EXERCICE "+sAnneeMoinsDeux+"] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametragePerimetreConstant.buttonCopierExercice);
			})
		
		})
	
		var sNomOnglet3 = 'informations Magasin';
		test.describe ('Onglet['+sNomOnglet3.toUpperCase()+']',async () =>  {

			test ('Onglet [' + sNomOnglet3.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage2, 'informationsMagasin', page);
			})

			test ('InputField [SEUIL ALERTE SAISIE CLIENTS]- Is Visible', async () =>  {
				await fonction.isDisplayed(parametrageInformationsMagasin.inputSeuilAlerteSaisie);
			})

			test ('ListBox [DIRECTION EXPLOITATION] - Click', async () =>  {
				await fonction.clickElement(parametrageInformationsMagasin.listBoxbDirectionExploitation);
				await fonction.clickElement(parametrageInformationsMagasin.listBoxExploitation.filter({hasText:sDirection}));
			})

			test ('DataGridHead [STRATEGIE BU] - Check element', async () =>  {
				
				var oDataGrid:TypeListOfElements = {
					element     : parametrageInformationsMagasin.theadInfoMag,    
					desc        : 'DataGrid [STRATEGIE BU]',
					verbose		: false,
					column      : [
						"Groupe article", 
						"Stratégie BU"       
					]
				}

				await fonction.dataGridHeaders(oDataGrid);
			})

			test ('InputField [STRATEGIE BU] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametrageInformationsMagasin.inputparamStrategieBU.first());
			})

			test ('Button [ENREGISTRER] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametrageInformationsMagasin.buttonEnregistrer);
			})
		})  

		var sNomOnglet4 = 'coefficients de progression';
		test.describe ('Onglet['+sNomOnglet4.toUpperCase()+']',async () =>  {

			test ('Onglet [' + sNomOnglet4.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage2, 'coefficientsProgression', page);
			})

			test ('ListBox [DIRECTION EXPLOITATION] = "' + sDirection + '"', async () =>  {
				await fonction.listBoxByLabel(parametrageCoeffProgression.listBoxDirectionExploition, sDirection, page);
			})

			test ('ListBox [GROUPE ARTICLE] = "'+sGroupeArticle+'"', async () =>  {
				await fonction.listBoxByLabel(parametrageCoeffProgression.listBoxGroupeArticle, sGroupeArticle, page);
			})

			test ('DataGrid [COEFFICIENT DE PROGRESSION] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametrageCoeffProgression.dataTableCoefficientProgression);
			})

			test ('InputField [COEFFICIENT] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametrageCoeffProgression.inputFiltreCoeff.last());
			})

			test ('Icon [PROGRESSION DE KG PAR CLIENT COEFF (ANCIEN MAG)] - Click', async () =>  {
				await fonction.clickElement(parametrageCoeffProgression.buttonFiltre.nth(0));
				await fonction.isDisplayed(parametrageCoeffProgression.listBoxFiltre.first());
			})

			test ('Icon [PROGRESSION DE KG PAR CLIENT KG PAR CLIENT (NOUVEAU MAG)] - Click', async () =>  {
				await fonction.clickElement(parametrageCoeffProgression.buttonFiltre.nth(1));
				await fonction.isDisplayed(parametrageCoeffProgression.listBoxFiltre.first());
			})

			test ('Icon [PROGRESSION DE CA PAR KG COEFF (ANCIEN MAG)] - Click', async () =>  {
				await fonction.clickElement(parametrageCoeffProgression.buttonFiltre.nth(2));
				await fonction.isDisplayed(parametrageCoeffProgression.listBoxFiltre.first());
			})

			test ('Icon [PROGRESSION DE CA PAR KG CA PAR KG (NOUVEAU MAG)] - Click', async () =>  {
				await fonction.clickElement(parametrageCoeffProgression.buttonFiltre.nth(3));
				await fonction.isDisplayed(parametrageCoeffProgression.listBoxFiltre.first());
			})
			
			test ('Button [ENREGISTRER] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametrageCoeffProgression.buttonEnregistrer);
			}) 

			test ('Button [INITIALISER] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametrageCoeffProgression.buttonInitialiser);
			}) 

		})  

		var sNomOnglet5 = 'regroupement';
		test.describe ('Onglet['+sNomOnglet5.toUpperCase()+']', async () =>  {

			test ('Onglet [' + sNomOnglet5.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage2, sNomOnglet5, page);
			})

			test ('DataGrid [REGROUPEMENT] - Check element', async () =>  {
				var oDataGrid:TypeListOfElements = {
					element     : parametrageRegroupement.dataGridRegroupement,    
					desc        : 'DataGrid [REGROUPEMENT]',
					verbose		: false,
					column      : [
						"Direction d'exploitation",
						"Regroupement", 
						"Groupes article gérés",
						"Actions"       
					]
				}

				await fonction.dataGridHeaders(oDataGrid);
			})

			test ('Table [REGROUPEMENT] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametrageRegroupement.dataGridTable);
			})

			test ('Multiselect [DIRECTION EXPLOITATION] - Click', async () =>  {
				await fonction.clickElement(parametrageRegroupement.multiSelectDirectionExploitat);
			})

			test ('InputField [DIRECTION EXPLOITATION] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametrageRegroupement.inputDirectionExploitation);
			})

			test ('CheckBox [DIRECTION EXPLOITATION (EN TETE)] - Is Visisble', async () =>  {
				await fonction.isDisplayed(parametrageRegroupement.checBoxHeader);
			})

			test ('CheckBox [GROUPE ARTICLE] - Is Visisble', async () =>  {
				await fonction.isDisplayed(parametrageRegroupement.checkBoxGroupeArticle.first());
			})

			test ('Button [X] - Click', async () =>  {
				await fonction.clickElement(parametrageRegroupement.buttonClose);
			})

			test ('InputField [REGROUPEMENT] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametrageRegroupement.inputFiltreRegroupement);
			})

			test ('Button [REGROUPEMENT] - Click', async () =>  {
				await fonction.clickElement(parametrageRegroupement.buttonFilter.nth(0));
			})

			test ('ListBox [REGROUPEMENT] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametrageRegroupement.listBoxDirectionExploitation.first());
			})

			test ('InputField [GROUPE ARTICLE GERE] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametrageRegroupement.inputFiltreGroupeArticleGere);
			})

			test ('Button [GROUPE ARTICLE GERE] - Click', async () =>  {
				await fonction.clickElement(parametrageRegroupement.buttonFilter.nth(1));
			})

			test ('ListBox [REGROUPEMENT] #1 - Is Visible', async () =>  {
				await fonction.isDisplayed(parametrageRegroupement.listBoxDirectionExploitation.first());
			})

			test ('Button [AJOUTER] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametrageRegroupement.buttonAjouter);
			})

			test ('Button [MODIFIER] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametrageRegroupement.buttonModifier);
			})

			test ('Button [SUPPRIMER] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametrageRegroupement.buttonCSupprimer);
			})

		})

		var sNomOnglet6 = 'chargement';
		test.describe ('Onglet['+sNomOnglet6.toUpperCase()+']',async () =>  {

			test ('Onglet [' + sNomOnglet6.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage2, sNomOnglet6, page);
			})

			test ('Button [PARCOURIR] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametrageChargement.buttonParcourir.first()); 
			})

			test ('Button [EXPORTER TEMPLATE COUTS] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametrageChargement.buttonExporterTemplateCout);
			})

			test ('Button [EXPORTER TEMPLATE MS ET HT] - Is Visible', async () =>  {
				await fonction.isDisplayed(parametrageChargement.buttonExporterTemplateMsEtHt);
			})

			var sNomPopin = "Codes utilisés dans les chargements de fichier";
			test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

				test ('Button [RECAPITULATIF DES CODES] - Click', async () =>  {
					await fonction.clickAndWait(parametrageChargement.buttonRecapitulatifCode, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
				})

				test ('DataGrid [DIRECTIONS D\'EXPLOITATION] - Check', async () =>  {
				
					var oDataGrid:TypeListOfElements = {
						element     : parametrageChargement.pDataGridDE.locator('th'),    
						desc        : 'DataGrid [DIRECTIONS D\'EXPLOITATION]',
						verbose		: false,
						column      : [
							'Code',
							'Dir. d\'exploitation',       
						]
					}
	
					await fonction.dataGridHeaders(oDataGrid);
				})

				test ('DataGrid [GROUPES ARTICLES] - Check', async () =>  {
				
					var oDataGrid:TypeListOfElements = {
						element     : parametrageChargement.pDataGridGroupeArticles.locator('th'),    
						desc        : 'DataGrid [DIRECTIONS D\'EXPLOITATION]',
						verbose		: false,
						column      : [
							'Code',
							'Groupe article',       
						]
					}
	
					await fonction.dataGridHeaders(oDataGrid);
				})

				test ('DataGrid [POSTES] - Check', async () =>  {
				
					var oDataGrid:TypeListOfElements = {
						element     : parametrageChargement.pDataGridPostes.locator('th'),    
						desc        : 'DataGrid [POSTES]',
						verbose		: false,
						column      : [
							'Code',
							'Poste'     
						]
					}
	
					await fonction.dataGridHeaders(oDataGrid);
				})

				test ('DataGrid [CONTRATS] - Check', async () =>  {
				
					var oDataGrid:TypeListOfElements = {
						element     : parametrageChargement.pDataGridContrats.locator('th'),    
						desc        : 'DataGrid [CONTRATS]',
						verbose		: false,
						column      : [
							'Code',
							'Contrat'       
						]
					}
	
					await fonction.dataGridHeaders(oDataGrid);
				})

				test ('DataGrid [REGROUPEMENTS] - Check', async () =>  {
				
					var oDataGrid:TypeListOfElements = {
						element     : parametrageChargement.pDataGridRegroupements.locator('th'),    
						desc        : 'DataGrid [REGROUPEMENTS]',
						verbose		: false,
						column      : [
							'Direction d\'exploitation',
							'Code',
							'Regroupement',
							'Groupes article'       
						]
					}
	
					await fonction.dataGridHeaders(oDataGrid);
				})

				test ('DataGrid [LIEUX DE VENTE] - Check', async () =>  {
				
					var oDataGrid:TypeListOfElements = {
						element     : parametrageChargement.pDataGridLieuxVente.locator('th'),    
						desc        : 'DataGrid [LIEUX DE VENTE]',
						verbose		: false,
						column      : [
							'Code',
							'Lieu de vente'       
						]
					}

					await fonction.dataGridHeaders(oDataGrid);
				})

				test ('InputField [CODE, DESIGNATION] - Are Visible', async () => {
					await fonction.isDisplayed(parametrageChargement.pInputFiltreCodeDE);
					await fonction.isDisplayed(parametrageChargement.pInputFiltreDesignationDE);
					await fonction.isDisplayed(parametrageChargement.pInputFiltreCodeGroupeArticle);
					await fonction.isDisplayed(parametrageChargement.pInputFiltreDesignGroupeArticle);
					await fonction.isDisplayed(parametrageChargement.pInputFiltreCodePoste);
					await fonction.isDisplayed(parametrageChargement.pInputFiltreDesignationPoste);
					await fonction.isDisplayed(parametrageChargement.pInputFiltreCodeContrats);
					await fonction.isDisplayed(parametrageChargement.pInputFiltreDesignationContrats);
					await fonction.isDisplayed(parametrageChargement.pInputFiltreCodeRegroupements);
					await fonction.isDisplayed(parametrageChargement.pInputFiltreDesignationRegroupements);
					await fonction.isDisplayed(parametrageChargement.pInputFiltreDesignationGrpeArticle);
					await fonction.isDisplayed(parametrageChargement.pInputFiltreCodeLieuxVente);
					await fonction.isDisplayed(parametrageChargement.pInputFiltreDesignationLieuxVente);
				})

				test ('Button [CODE, DESIGNATION] - Are Visible', async () => {
					await fonction.isDisplayed(parametrageChargement.pButtonFiltreCodeDE);
					await fonction.isDisplayed(parametrageChargement.pButtonFiltreDesignationDE);
					await fonction.isDisplayed(parametrageChargement.pButtonFiltreCodePoste);
					await fonction.isDisplayed(parametrageChargement.pButtonFiltreDesignationPoste);
					await fonction.isDisplayed(parametrageChargement.pButtonFiltreCodeContrats);
					await fonction.isDisplayed(parametrageChargement.pButtonFiltreDesignationContrats);
					await fonction.isDisplayed(parametrageChargement.pButtonFiltreCodeRegroupements);
					await fonction.isDisplayed(parametrageChargement.pButtonFiltreDesignationRegroupements);
					await fonction.isDisplayed(parametrageChargement.pButtonFiltreDesignationGrpeArticle);
					await fonction.isDisplayed(parametrageChargement.pButtonFiltreCodeLieuxVente);
					await fonction.isDisplayed(parametrageChargement.pButtonFiltreDesignationLieuxVente);
					await fonction.clickElement(parametrageChargement.pButtonFiltreCodeDE);
				})

				test ('ListBox [ENSEIGNE] - Is Visible', async () => {
					await fonction.isDisplayed(parametrageChargement.pListeBoxEnseigne);
				})

				test ('ListBox [DIRECTION D\EXPLOITATION] - Click', async () => {
					await fonction.clickElement(parametrageChargement.pListeBoxRegroupementDE);
				})

				test ('CheckBox, Input [DIRECTION D\EXPLOITATION] - Is Visible', async () => {
					await fonction.isDisplayed(parametrageChargement.pInputRegroupementDE);
					await fonction.isDisplayed(parametrageChargement.pCheckBoxRegroupementDE.first());
					await fonction.isDisplayed(parametrageChargement.pCheckBoxAllRegroupementDE);
				})

				test ('Button [FERMER] - Click', async () =>  {
					await fonction.clickAndWait(parametrageChargement.pButtonFermer, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin.toUpperCase(), false);
				})

			})
		})  
	})

	test.describe ('Pages [ADMIN]', async () =>  {

		var sNomPage = 'admin';

		test ('Menu [' + sNomPage.toUpperCase() + '] - Click', async () =>  {
			await menu.click(sNomPage, page);
		})

		var sNomOnglet = 'administration';
		test.describe ('Onglet['+sNomOnglet.toUpperCase()+']',async () =>  {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage, sNomOnglet, page);
			})
			
			test ('Button [DESACTIVER/REACTIVER ACCES APPLICATION] - Is Visible', async () =>  {
				await fonction.isDisplayed(pageAdmin.buttonActiverDesactiveAccesAppli);
			})
	
			test ('ListBox [CACHE] - Is Visible', async () =>  {
				await fonction.isDisplayed(pageAdmin.listBoxSelectCache);
			})
	
			test ('ListBox [SELECT OPTION] >= 5', async () =>  {
				expect(await pageAdmin.listBoxSelectOpen.count()).toBeGreaterThanOrEqual(5);
			})
	
			test ('Button [SUPPRIMER] - Is Visible', async () =>  {
				await fonction.isDisplayed(pageAdmin.buttonSupprimerCache);
			})
	
			test ('Button [DIFFUSER ELEMENTS TRADUISIBLES] - Is Visible', async () =>  {
				await fonction.isDisplayed(pageAdmin.buttonDiffuserEltTraduisible);
			})
	
			test ('Button [RECHARGER LE CACHE DES TRADUCTIONS] - Is Visible', async () =>  {
				await fonction.isDisplayed(pageAdmin.buttonRechargerCache);
			})
	
			test ('Button [VOIR API AVEC SWAGGER] - Is Visible', async () =>  {
				await fonction.isDisplayed(pageAdmin.buttonVoirApiSwagger);
			})

		})

		var sNomOnglet1 = 'actions';
		test.describe ('Onglet['+sNomOnglet1.toUpperCase()+']',async () =>  {

			test ('Onglet [' + sNomOnglet1.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage, sNomOnglet1, page);
			})

			test ('ListBox [EXERCICE COMPTABLE] - Is Visible', async () => {
				await fonction.clickElement(pageAdminActions.listBoxExerciceComptable);
				await fonction.isDisplayed(pageAdminActions.listeAnnees.first());
			})

			test ('ListBox,Input,CheckBox [DIRECTION EXPLOITATION] - Are Visible', async () => {
				await fonction.clickElement(pageAdminActions.listBoxDirectionExploitation);
				await fonction.isDisplayed(pageAdminActions.inputFiltre);
				await fonction.isDisplayed(pageAdminActions.checkBoxHeader);
				await fonction.isDisplayed(pageAdminActions.checkBoxDE.first());
			})

			test ('ListBox [LIEUX DE VENTE] - Is Visible', async () => {
				await fonction.isDisplayed(pageAdminActions.listBoxLieuxVente);
			})

			test ('Button [VOIR API AVEC SWAGGER] - Is Visible', async () =>  {
				await fonction.isDisplayed(pageAdminActions.buttonRecalculer);
			})
		})
	
	})
	
	test ('Déconnexion', async () =>  {
        await fonction.deconnexion(page);
    });

})