/**
 * 
 * @author SIAKA KONE
 * @since 2024-11-14
 * 
 */

const xRefTest      = "QUA_IHM_GLB";
const xDescription  = "Examen Global de l'IHM - Sigale Qualité";
const xIdTest       =  4611;
const xVersion      = '3.7';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'QUALITE',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['plateforme'],
	fileName    : __filename
};

import { test, type Page }                  from '@playwright/test';

import { CartoucheInfo, TypeListOfElements} from '@commun/types';

import { Help }                  			from '@helpers/helpers';
import { TestFunctions }         			from '@helpers/functions';
import { Log }                   			from '@helpers/log';

import { MenuQualite }           			from '@pom/QUA/menu.page';

import { Accueil } 							from '@pom/QUA/accueil.page';

import { ControlesArrivages } 				from '@pom/QUA/controles-arrivages.page';
import { ControlesHistoriques } 			from '@pom/QUA/controles-historiques.page';
import { ControlesMagasins }                from '@pom/QUA/controles-magasins.page';
import { ControlesTemperatures } 			from '@pom/QUA/controle-temperature.page';

import { PlanificationArrivages } 			from '@pom/QUA/planification-arrivages.page';

import { ReferentielArticles } 				from '@pom/QUA/referentiel-articles.page';
import { ReferentielQuestionnaires } 		from '@pom/QUA/referentiel-questionnaires.page';
import { ReferentielDetailQuestion } 		from '@pom/QUA/referentiel-detail_questionnaire.page';
import { ReferentielMobiliers } 			from '@pom/QUA/referentiel-mobiliers.page';

let page                					: Page;
let menu                					: MenuQualite;
let pageAccueil                             : Accueil;
let pageControlesArrivages           		: ControlesArrivages;
let pageControlesHistoriques                : ControlesHistoriques;
let pageControlesMagasins            		: ControlesMagasins;
let pageControlesTemperatures        		: ControlesTemperatures;
let pagePlanificationArrivages       		: PlanificationArrivages;
let pageReferentielQuestionnaires    		: ReferentielQuestionnaires;
let pageReferentielDetailQuestion    		: ReferentielDetailQuestion;
let pageReferentielArticles          		: ReferentielArticles;
let pageReferentielMobiliers         		: ReferentielMobiliers;

const log               					= new Log();
const fonction          					= new TestFunctions(log);

var sRayon									= fonction.getInitParam('rayon',"Crèmerie");
var sPlateforme                             = fonction.getInitParam('plateforme','Chaponnay');//Cremcentre Cremlog

//-- Détermination de la date du samedi précédent --------------------------------------------
const today                 = new Date();
const dayOfWeek             = today.getDay();               // Obtenir le jour actuel (0 = dimanche, 6 = samedi)
const daysSinceLastSaturday = (dayOfWeek + 1) % 7;          // Nombre de jours depuis le dernier samedi
const daysToSubtract        = daysSinceLastSaturday || 7;   // Si aujourd'hui est samedi, on soustrait 7 jours
const previousSaturday      = new Date(today);
previousSaturday.setDate(today.getDate() - daysToSubtract);
const sSamediPrecedent      = previousSaturday.getDate();


//------------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            						= await browser.newPage();
    menu            						= new MenuQualite(page, fonction);
	pageAccueil                       		= new Accueil(page);
    pageControlesArrivages           		= new ControlesArrivages(page);
    pageControlesHistoriques         		= new ControlesHistoriques(page);
    pageControlesMagasins            		= new ControlesMagasins(page);
    pageControlesTemperatures        		= new ControlesTemperatures(page);
    pagePlanificationArrivages       		= new PlanificationArrivages(page);
    pageReferentielQuestionnaires    		= new ReferentielQuestionnaires(page);
    pageReferentielDetailQuestion    		= new ReferentielDetailQuestion(page);
    pageReferentielArticles          		= new ReferentielArticles(page);
    pageReferentielMobiliers         		= new ReferentielMobiliers(page);
    const helper    						= new Help(info, testInfo, page);
    await helper.init();
});

test.beforeEach(async ({}, testInfo) => {
    await fonction.trace(testInfo);
    await fonction.checkConsole(page, testInfo, false);
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () =>  {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () =>  {
        await fonction.connexion(page);
    })
	
	test.describe ('Page [ACCUEIL]', async () =>  {
		
		var sNomPage:string = 'home';
		test ('Menu [ACCUEIL] - Click', async () =>  {
			await menu.click(sNomPage, page);
		})

		test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })

		test ('Label [BIENVENUE] - Is Visible', async () => {
            await fonction.isDisplayed(pageAccueil.labelWelcomeMessage);
        })

	})

	test.describe ('Page [CONTROLES]', async () =>  {

		var sNomPage1:string = 'controles';
		test ('Menu [BUDGET MAGASIN] - Click', async () =>  {
			await menu.click(sNomPage1, page);
		})

		var sNomOnglet0:string = 'arrivages';
		test.describe ('Onglet[' + sNomOnglet0.toUpperCase() + ']', async () =>  {

			test ('Onglet [' + sNomOnglet0.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage1, sNomOnglet0, page);
			})

			test ('DatePicker [ARRIVAGE DU] = "' + sSamediPrecedent + '"', async () => {
                await fonction.clickElement(pageControlesArrivages.datepickerArrivages);

                if (sSamediPrecedent > today.getDate()) {       // Si le samedi précédent est supérieur à la date actuelle, on bascule sur le mois précédent
                    await fonction.clickElement(pageControlesArrivages.buttonMoisPrecedent);
                }

                await fonction.clickElement(page.locator(`td[aria-label="${sSamediPrecedent}"]:NOT(.p-datepicker-other-month)`));
                await fonction.clickElement(page.locator(`td[aria-label="${sSamediPrecedent}"]:NOT(.p-datepicker-other-month)`));
            })

            test ('Button [DEMARRER UN CONTROLE] - Is Visible', async () => {
                await fonction.isDisplayed(pageControlesArrivages.buttonDemarrerControle);
            })

            test ('Button [REPRENDRE CONTROLE] - Is Visible', async () => {
                await fonction.isDisplayed(pageControlesArrivages.buttonReprendreControle);
            })

            test ('Button [VISUALISER CONTROLE] - Is Visible', async () => {
                await fonction.isDisplayed(pageControlesArrivages.buttonVisualiserControle);
            })

            test ('Button [IMPRIMER RESULTAT] - Is Visible', async () => {
                await fonction.isDisplayed(pageControlesArrivages.buttonImprimerResultat);
            })

            test ('Button [CORRIGER CONTROLE] - Is Visible', async () => {
                await fonction.isDisplayed(pageControlesArrivages.buttonCorrigerControle);
            })

            test ('Button [EXPORTER] - Is Visible', async () => {
                await fonction.isDisplayed(pageControlesArrivages.buttonExporter);
            })
        
            test ('ListBox [PLATEFORME] - Is Visible', async () => {
                await fonction.isDisplayed(pageControlesArrivages.listBoxPlateforme);
            })
            
            test ('ListBox [RAYON] - Is Visible', async () => {
                await fonction.isDisplayed(pageControlesArrivages.listBoxRayon);
            })

            test ('DataGrid [ARRIVAGES] - Check', async () => {
				var oDataGrid:TypeListOfElements = {
					element     : pageControlesArrivages.datagridheadArrivages,
					desc        : 'DataGrid [ARRIVAGES]',
					verbose		: false,
					column      : [
						"", 
                        "Date arrivage",
                        "Gencod", 
                        "Code article",
                        "Désignation article", 
                        "Fournisseur", 
                        "Acheteur", 
                        "Réceptionné", 
                        "DLCs", 
						"Emplacements palettes", 
						"Planifié", 
						"Résultat du contrôle", 
						"Statut", 
						"Actions",
						""         
					]
				}
				await fonction.dataGridHeaders(oDataGrid);
            })

            test ('Listbox [RECEPTIONNÉ] - Check', async () => {   
                await fonction.isDisplayed(pageControlesArrivages.datagridlistBoxReception);
            })

            test ('Listbox [PLANIFIÉ] - Check', async () => {     
				await fonction.isDisplayed(pageControlesArrivages.datagridlistBoxPlanifie);
            })

            test ('Listbox [RÉSULTAT DU CONTRÔLE] - Check', async () => {    
				await menu.checkListBox(pageControlesArrivages.datagridlistBoxResultatControle);
            })

            test ('Listbox [STATUT] - Check', async () => {    
                await menu.checkListBox(pageControlesArrivages.datagridlistBoxStatut);
            })
   
            test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {
                await menu.selectPlateformeByName(sPlateforme, page);
            })

            test ('CheckBox [RECEPTIONNÉ] - Unclick', async () => {   
                await fonction.clickElement(pageControlesArrivages.datagridArrivagecheckBoxRecep);
                await fonction.clickElement(pageControlesArrivages.datagridArrivagecheckBoxRecep);
            })

            test ('CheckBox [ARRIVAGE][0] - Click', async () => {      // On coche l'arrivage pour contrôle
                var bIsVisible = await pageControlesArrivages.checkBoxCocherUnArrivage0.isVisible();
                if(!bIsVisible){
                    await fonction.clickElement(pageControlesArrivages.datagridArrivagecheckBoxRecep);
                }
                await fonction.clickElement(pageControlesArrivages.checkBoxCocherUnArrivage0);
            })
                
            //--POPIN CONTROLE EN COURS -------------------------------------------
            var sNomPopin:string = "CONTROLE EN COURS";
            test.describe('Popin [' + sNomPopin + ']', async () => { 

                test ('Button [DEMARRER UN CONTROLE] - Click', async () => {
                    await fonction.clickAndWait(pageControlesArrivages.buttonDemarrerControle, page);
                })

                test ('Popin [' + sNomPopin + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);   
                })
            
                test ('IHM popin [' + sNomPopin + '] - Check', async () => {
                    await fonction.isDisplayed(pageControlesArrivages.pPCecLabelArticle);
                    await fonction.isDisplayed(pageControlesArrivages.pPCecLabelFournisseur);
                    await fonction.isDisplayed(pageControlesArrivages.pPCecLabelNumLot);
                    await fonction.isDisplayed(pageControlesArrivages.pPCecLabelDateReception);
                    await fonction.isDisplayed(pageControlesArrivages.pPCecLabelNomControleur);
                    await fonction.isDisplayed(pageControlesArrivages.pPCecSelectPalettes);
                    await fonction.isDisplayed(pageControlesArrivages.pPCecInputNumlotFournisseur);
                    await fonction.isDisplayed(pageControlesArrivages.pPCecDatepickerDLC);
                    await fonction.isDisplayed(pageControlesArrivages.pPCecButtonUpNbreUVC);
                    await fonction.isDisplayed(pageControlesArrivages.pPCecButtonDownNbreUVC);
                    await fonction.isDisplayed(pageControlesArrivages.pPCecButtonCahierDesCharges);
                    await fonction.isDisplayed(pageControlesArrivages.pPCecButtonAnnuler);                 
                })  

                var sNomOnglet:string = 'DETAIL';
                test.describe ('Onglet [' +  sNomOnglet + ']', async () => { 

                    test ('ListBox [QUESTIONNAIRE] - Check', async () => {  
						if (await pageControlesArrivages.pPCecInputQuestionnaire.locator('.p-disabled').count() > 0) {
							log.set('Questionnaire déjà selectionné');
						} else {
							await fonction.clickElement(pageControlesArrivages.pPCecListboxQuestionnaire);
							await fonction.isDisplayed(pageControlesArrivages.pPCecListboxQuestionnaire);
							await fonction.clickElement(pageControlesArrivages.pPCecListeQuestionnaire.last());
						}
                    })
    
                    test ('ListBox [PALETTE (EMPL)] - Is Visible', async () => {  
                        await fonction.isDisplayed(pageControlesArrivages.pPCecInputNumeroPalette);
                    })

                    test ('Date [ARRIVAGE] - Is Visible', async () => {
                        await fonction.isDisplayed(pageControlesArrivages.pPCecDatepickerDLC);
                    })  
    
                    test ('InputField [NUMERO DE LOT FOURNISSEUR] - Is Visible', async () => {
                        await fonction.isDisplayed(pageControlesArrivages.pPCecInputNumlotFournisseur); 
                    })

                    test ('ButtonUp [NOMBRE UVC] - Is Visible', async () => {
                        await fonction.isDisplayed(pageControlesArrivages.pPCecButtonUpNbreUVC); 
                    })
                })

                var sNomOnglet:string = 'BILAN CONTRÔLE';
                test.describe ('Onglet [' + sNomOnglet + ']', async () => { 

                    test ('Onglet [BILAN CONTRÔLE] - Click', async () => {
                        await fonction.clickElement(pageControlesArrivages.pPOngletBilanControle);
                    })

                    test ('IHM Onglet [' + sNomOnglet.toUpperCase() + '] - Check', async () => {
                        await fonction.isDisplayed(pageControlesArrivages.pPCecButtonOui);
                        await fonction.isDisplayed(pageControlesArrivages.pPCecButtonNon);                    
                        await fonction.isDisplayed(pageControlesArrivages.pPCecTextareaCommentaire);     
                    })
    
                    test ('Buttons [FOOTER] - Is Visible', async () => {
                        await fonction.isDisplayed(pageControlesArrivages.pPCecButtonDemanderValidation);
                    	await fonction.isDisplayed(pageControlesArrivages.pPCecButtonEnregistrer);
                    	await fonction.isDisplayed(pageControlesArrivages.pPCecButtonTerminer);
                        await fonction.clickElement(pageControlesArrivages.pPCecButtonAnnuler.nth(0));
                    })
                })

                test ('Popin ['+sNomPopin+'] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), false);   
                })

            })

		})

		var sNomOnglet1:string = 'Historique des contrôles';
		test.describe ('Onglet[' + sNomOnglet1.toUpperCase() + ']', async () =>  {

			test ('Onglet [' + sNomOnglet1.toUpperCase() + '] - Click', async () =>  { 
				await menu.clickOnglet(sNomPage1, 'historiquesControles', page);
			})

			test ('DatePicker [ARRIVAGE] - Check', async () => {
                await fonction.isDisplayed(pageControlesHistoriques.datagridHistArrivages);
            }) 

			test ('DatePicker [ARRIVAGE DLC] - Check', async () => {
                await fonction.isDisplayed(pageControlesHistoriques.datepickerHistArrivagesDLC);
            }) 
            
            test ('InputField [ARTICLE] - Is Visible', async () => {
                await fonction.isDisplayed(pageControlesHistoriques.inputFiltreArticle);
            })
            
            test ('InputField [FOURNISSEUR] - Is Visible', async () => {
                await fonction.isDisplayed(pageControlesHistoriques.inputFiltreFournisseur);
            })
            
            test ('InputField [NUM LOT FOURNISSEUR] - Is Visible', async () => {
                await fonction.isDisplayed(pageControlesHistoriques.inputFiltreNumlotfournisseur);
            })
            
            test ('Button [RECHERCHER HISTORIQUE] - Is Visible', async () => {
                await fonction.isDisplayed(pageControlesHistoriques.buttonRechercherHistorique);
            })
            
            test ('Button [VISUALISER CONTROLE] - Is Visible', async () => {
                await fonction.isDisplayed(pageControlesHistoriques.buttonVisualiserControle);
            })
            
            test ('Button [IMPRIMER RESULTATS] - Is Visible', async () => {
                await fonction.isDisplayed(pageControlesHistoriques.buttonImprimerResultat);
            })
            
            test ('ListBox [RAYON] - Check', async () => {
                await menu.checkListBox(pageControlesHistoriques.listBoxRayon);
            })

            test ('ListBox [PLATEFORME] - Check', async () => {
                await menu.checkListBox(pageControlesHistoriques.listBoxPlateforme);
            })

            test ('DataGrid [HISTORIQUE DES ARRIVAGES] - Check', async () => {
				var oDataGrid:TypeListOfElements = {
					element     : pageControlesHistoriques.datagridheadHistArrivages,
					desc        : 'DataGrid [HISTORIQUE DES ARRIVAGES]',
					verbose		: false,
					column      : [
						"",
						"Date du contrôle",
						"Code article",
						"Désignation article", 
						"Fournisseur",
						"Plateforme",
						"DLCs",
						"N° lot fournisseur",
						"Acheteur", 
						"Résultat",
						"Bon pour distribution",
						"Actions",
					]
				}
				await fonction.dataGridHeaders(oDataGrid);
            })

            test ('Datepicker [HISTORIQUE DES CONTROLES] - Click', async () => {
                await fonction.clickElement(pageControlesHistoriques.datepickerHistArrivagesDLC);
                await fonction.clickElement(pageControlesHistoriques.datepickerHistAujourdhui.nth(0));   
            })        
  
            test ('Button [RECHERCHER] - Click', async () => {
                await fonction.clickAndWait(pageControlesHistoriques.buttonRechercherHistorique, page);
            })
  
            test ('CheckBox [ARRIVAGE][0] - Click', async () => {      // On coche l'arrivage précédent qui le statut terminé
                await fonction.clickElement(pageControlesHistoriques.checkBoxCocherUnArrivage);
            })
  
            test ('Button [VISUALISER UN CONTROLE] - Click', async () => {
                await fonction.clickAndWait(pageControlesHistoriques.buttonVisualiserControle, page);
            })

            //--POPIN VISUALISER UN CONTROLE  --------------------------------------------------------------------------------//
            var sNomPopin:string = "Contrôle terminé le ..";
            test.describe('['+ sNomPopin.toUpperCase() +']', async () => {

                test ('Popin ['+sNomPopin+'] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);   
                })
      
                test ('IHM Popin [VISUALISER UN CONTROLE] - Check', async () => {
                    await fonction.isDisplayed(pageControlesHistoriques.pPVcSelectQuestionnaire);
                    await fonction.isDisplayed(pageControlesHistoriques.pPVcInputNumlotFournisseur);
                    await fonction.isDisplayed(pageControlesHistoriques.pPVcButtonUpNbreUVC);
                    await fonction.isDisplayed(pageControlesHistoriques.pPVcButtonDownNbreUVC);
                    await fonction.isDisplayed(pageControlesHistoriques.pPVcDatepickerDLC);
                    await fonction.isDisplayed(pageControlesHistoriques.pPVcButtonCahierDesCharges);
                    await fonction.isDisplayed(pageControlesHistoriques.pPVcButtonFermer);
                })

                test ('Button [FERMER] - Click', async () => {
                    await fonction.clickElement(pageControlesHistoriques.pPChistButtonFermer);
                })  
                
                test ('Popin ['+sNomPopin+'] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), false);   
                })
            })
			
		})

		var sNomOnglet2:string = 'magasins';
		test.describe ('Onglet[' + sNomOnglet2.toUpperCase() + ']', async () =>  {

			test ('Onglet ['+sNomOnglet2.toUpperCase()+ '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage1, sNomOnglet2, page);
			})

			test ('Button [RECHERCHER] - Click', async () =>  {  
                await fonction.clickAndWait(pageControlesMagasins.buttonRechercher, page);
            })

            test ('DataGrid [MAGASINS] - Check', async () =>  {
				var oDataGrid:TypeListOfElements = {
					element     : pageControlesMagasins.datagridheadMagasin,
					desc        : 'DataGrid [MAGASINS]',
					verbose		: false,
					column      : [
						"",
                        "Date du contrôle", 
                        "Date de début", 
                        "Date de fin",
                        "Enseigne", 
                        "Code lieu de vente", 
                        "Désignation lieu de vente", 
                        "Rayon", 
                        "Type de contrôle", 
                        "Questionnaire", 
                        "Note globale", 
                        "% conforme ou acceptable total", 
                        "Statut", 
                        "Contrôleur", 
                        "Actions"
					]
				}
				await fonction.dataGridHeaders(oDataGrid);

            })

            test ('IHM Onglet[MAGASINS] - Check', async () =>  {
                await fonction.isDisplayed(pageControlesMagasins.datepickerControleMagasin);
                await fonction.isDisplayed(pageControlesMagasins.ListboxLieudeVente);
                await fonction.isDisplayed(pageControlesMagasins.ListboxTypeControle);
                await fonction.isDisplayed(pageControlesMagasins.ListboxQuestionnaire);
                await fonction.isDisplayed(pageControlesMagasins.datagridControleMagasin);
                await fonction.isDisplayed(pageControlesMagasins.buttonCreerControle);
                await fonction.isDisplayed(pageControlesMagasins.buttonReprendreControle);
                await fonction.isDisplayed(pageControlesMagasins.buttonVisualiserControle);
                await fonction.isDisplayed(pageControlesMagasins.buttonCorrigerControle);
                await fonction.isDisplayed(pageControlesMagasins.buttonImprimerResultat);
            }) 
            
            var sNomPopin:string = 'CONTROLE EN COURS';
            test.describe('Popin['+ sNomPopin +']', async () =>  {

                test ('Button[CREER UN CONTROLE] - Click', async () =>  {
                    await fonction.clickAndWait(pageControlesMagasins.buttonCreerControle, page);
                })

                test ('Popin ['+sNomPopin+'] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);   
                })
            
                test ('IHM Popin[' + sNomPopin + '] - Check', async () =>  {
                    await fonction.isDisplayed(pageControlesMagasins.pPCecPopinControleEnCours);
                    await fonction.isDisplayed(pageControlesMagasins.pPCecListboxLieudeVente);
                    await fonction.isDisplayed(pageControlesMagasins.pPCecListboxControleur);
                    await fonction.isDisplayed(pageControlesMagasins.pPCecListboxTypedeControle);
                    await fonction.isDisplayed(pageControlesMagasins.pPCecListboxQuestionnaire);
                    await fonction.isDisplayed(pageControlesMagasins.pPCecdatepickerControle);
                    await fonction.isDisplayed(pageControlesMagasins.pPCecButtonPersPresenteRR);
                    await fonction.isDisplayed(pageControlesMagasins.pPCecButtonPersPresenteSecond);
                    await fonction.isDisplayed(pageControlesMagasins.pPCecButtonPersPresenteVG);
                    await fonction.isDisplayed(pageControlesMagasins.pPCecButtonPersPresenteAutre);
                    await fonction.isDisplayed(pageControlesMagasins.pPCecButtonEnregister);
                    await fonction.isDisplayed(pageControlesMagasins.pPCecButtonTerminer);
                    await fonction.isDisplayed(pageControlesMagasins.pPCecButtonAnnuler);
                }) 

                test ('Button[ANNULER] - Click', async () =>  {
                    await fonction.clickElement(pageControlesMagasins.pPCecButtonAnnuler);
                })

                test ('Popin ['+sNomPopin+'] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);   
                })
            }) 
	
		})

		var sNomOnglet3:string = 'temperatures';
		test.describe ('Onglet[' + sNomOnglet3.toUpperCase() + ']', async () =>  {

			test ('Onglet [' + sNomOnglet3.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage1, sNomOnglet3, page);
			})

			test ('ListBox [LIEU DE VENTE] - Check', async () =>  {   
                await menu.checkListBox(pageControlesTemperatures.listBoxLieudeVente);
            })

            test ('DataGrid [TEMPERATURES] - Check', async () =>  {
				var oDataGrid:TypeListOfElements = {
					element     : pageControlesTemperatures.datagridheadControleTemperature,
					desc        : 'DataGrid [TEMPERATURES]',
					verbose		: false,
					column      : [
						"",
                        "Date et heure du contrôle", 
                        "Enseigne", 
                        "Code lieu de vente", 
                        "Désignation lieu de vente", 
                        "Equipe", 
                        "Période de la journée", 
                        "Non conformités", 
                        "Statut", 
                        "Taux de réalisation", 
                        "Contrôleur", 
                        "Actions",
					]
				}
				await fonction.dataGridHeaders(oDataGrid);
            })

            test ('IHM Onglet[' + sNomOnglet3 + '] - Check', async () =>  {
                await fonction.isDisplayed(pageControlesTemperatures.datepickerControleTemperature);
                await fonction.isDisplayed(pageControlesTemperatures.listBoxLieudeVente);
                await fonction.isDisplayed(pageControlesTemperatures.datagridControleTemperature);
                await fonction.isDisplayed(pageControlesTemperatures.buttonDemarrerControle);
                await fonction.isDisplayed(pageControlesTemperatures.buttonReprendreControle);
                await fonction.isDisplayed(pageControlesTemperatures.buttonVisualiserControle);
                await fonction.isDisplayed(pageControlesTemperatures.buttonCorrigerControle);
                await fonction.isDisplayed(pageControlesTemperatures.buttonImprimerResultat);
            })   

		}) 
        
	})   

	test.describe ('Pages [PLANIFICATION]', async () =>  {
	   
		var sNomPage2:string = 'planification';
		test ('Menu [' + sNomPage2.toUpperCase() + '] - Click', async () =>  {
			await menu.click(sNomPage2, page);
		})

		var sNomOnglet:string = 'arrivages';
		test.describe ('Onglet[' + sNomOnglet.toUpperCase() + ']',async () =>  {
	
            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage2, sNomOnglet, page);
			})

			test ('IHM Onglet [' + sNomOnglet.toUpperCase() + '] - Check', async () =>  {
				await fonction.isDisplayed(pagePlanificationArrivages.listBoxPlateforme);
				await fonction.isDisplayed(pagePlanificationArrivages.buttonEnregistrer);
				await fonction.isDisplayed(pagePlanificationArrivages.buttonAjouterSemaine);
				await fonction.isDisplayed(pagePlanificationArrivages.buttonDuppliquer);
			})
			
			test ('ListBox [RAYON] = "' + sRayon + '"', async () =>  {
				await menu.selectRayonByName(sRayon, page);
			})
	
			test ('ListBox [PLATEFORME] - Check', async () =>  {
                await menu.checkListBox(pagePlanificationArrivages.listBoxPlateforme);
			})
	
			test ('Button [RECHERCHER] - Is Visible', async () =>  {
				await fonction.isDisplayed(pagePlanificationArrivages.buttonRechercher);
			})
		})
	})

    test.describe ('Pages [REFERENTIEL]', async () =>  {
	   
		var sNomPage2:string = 'referentiel';
		test ('Menu [' + sNomPage2.toUpperCase() + '] - Click', async () =>  {
			await menu.click(sNomPage2, page);
		})

		var sNomOnglet:string = 'questionnaires';
		test.describe ('Onglet[' + sNomOnglet.toUpperCase() + ']', async () =>  {
	
            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage2, sNomOnglet, page);
			})

            test ('Button [RECHERCHER] - Click', async () =>  {
                await fonction.clickAndWait(pageReferentielQuestionnaires.buttonRechercherQuestionnaire, page);
            })
            
            test ('DataGrid [QUESTIONNAIRES] - Check', async () =>  {
                var oDataGrid:TypeListOfElements = {
					element     : pageReferentielQuestionnaires.datagridheadQuestionnaires,
					desc        : 'DataGrid [QUESTIONNAIRES]',
					verbose		: false,
					column      : [
						"",
                        "Objet du questionnaire",
                        "Nom du questionnaire",
                        "Description",
                        "Actif",
                        "Actions"
					]
				}
				await fonction.dataGridHeaders(oDataGrid);
            })

            test ('ListBox [RAYON] - Check', async () =>  {
                await menu.checkListBox(pageReferentielQuestionnaires.listBoxRayon);
            })

            test ('DatagridListBox [OBJET] - Check', async () =>  {
                await menu.checkListBox(pageReferentielQuestionnaires.datagridlistBoxObjet);
            })

            test ('DatagridListBox [ACTIF] - Check', async () =>  {
                await menu.checkListBox(pageReferentielQuestionnaires.datagridlistBoxActif);
            })

            test ('IHM Onglet [' + sNomOnglet.toUpperCase() + '] - Check', async () =>  {
                await fonction.isDisplayed(pageReferentielQuestionnaires.listBoxRayon);
                await fonction.isDisplayed(pageReferentielQuestionnaires.datagridQuestionnaires);
                await fonction.isDisplayed(pageReferentielQuestionnaires.buttonCreerQuestionnaire);
                await fonction.isDisplayed(pageReferentielQuestionnaires.buttonModifier);
                await fonction.isDisplayed(pageReferentielQuestionnaires.buttonDupliquer);
                await fonction.isDisplayed(pageReferentielQuestionnaires.buttonGererRubrique);
                await fonction.isDisplayed(pageReferentielQuestionnaires.buttonImprimer);
            }) 
            
            test ('CheckBox [QUESTIONNAIRE][0] - Click', async () =>  {   
                await fonction.clickElement(pageReferentielQuestionnaires.checkboxCocherQuestionnaire.nth(1));
            })

            var sNomPopin:string = "DUPLICATION D\'UN QUESTIONNAIRE";
            test.describe('Popin [' + sNomPopin + ']', async () =>  {

                test ('Button [DUPLIQUER] - Click', async () =>  {   
                    await fonction.clickAndWait(pageReferentielQuestionnaires.buttonDupliquer, page);
                })

                test ('Popin [' + sNomPopin + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);   
                }) 

                test ('IHM Popin [' + sNomPopin + '] - Check', async () =>  {  
                    await fonction.isDisplayed(pageReferentielQuestionnaires.pPDqLabelQuestionnaireAdupliquer);
                    await fonction.isDisplayed(pageReferentielQuestionnaires.pPDqInputNomQuestionnaire);
                    await fonction.isDisplayed(pageReferentielQuestionnaires.pPDqTextareaDescription);
                    await fonction.isDisplayed(pageReferentielQuestionnaires.pPDqButtonDuppliquer);
                    await fonction.isDisplayed(pageReferentielQuestionnaires.pPDqButtonAnnuler);
                }) 

                test ('Button [ANNULER] - Click', async () =>  {                
                    await fonction.clickAndWait(pageReferentielQuestionnaires.pPDqButtonAnnuler, page);         
                })

                test ('Popin ['+sNomPopin+'] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);   
                }) 

            })

            var sNomPopin:string = "GERER DES RUBRIQUES";
            test.describe('Popin ['+sNomPopin+']', async () =>  { 
                
                test ('Button [' + sNomPopin + '] - Click', async () =>  {
                    await fonction.clickAndWait(pageReferentielQuestionnaires.buttonGererRubrique, page);
                })

                test ('Popin [' + sNomPopin + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);   
                }) 

                test ('IHM popin [' + sNomPopin + '] - Check', async () =>  {  
                    await fonction.isDisplayed(pageReferentielQuestionnaires.pPGrListBoxRayon);
                    await fonction.isDisplayed(pageReferentielQuestionnaires.pPGrListBoxObjet);
                    await fonction.isDisplayed(pageReferentielQuestionnaires.pPGrInputNouvelleRubrique);
                    await fonction.isDisplayed(pageReferentielQuestionnaires.pPGrButtonEnregistrer);
                    await fonction.isDisplayed(pageReferentielQuestionnaires.pPGrButtonAnnuler);
                    await fonction.isDisplayed(pageReferentielQuestionnaires.pPGrButtonAjouterRubrique);
                }) 

                test ('Button [GERRER LES UNIVERS] - Click', async () =>  {                
                    await fonction.clickElement(pageReferentielQuestionnaires.pPGrButtonAnnuler);         
                })

                test ('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);   
                }) 

            })

		})

        var sNomOnglet1:string = 'Détail d\'un questionnaire';
		test.describe ('Onglet[' + sNomOnglet1.toUpperCase() + ']', async () =>  {
	
            test ('Onglet [' + sNomOnglet1.toUpperCase() + '] - Is Visible', async () =>  { //-- Selectionné par défaut;
                await menu.isOngletPresent(sNomOnglet1);
			})

            test ('Button [CREER QUESTIONNAIRE] - Click', async () =>  {           
                await fonction.clickAndWait(pageReferentielQuestionnaires.buttonCreerQuestionnaire, page);           
            })

            test ('DataGrid [QUESTIONNAIRES] - Check', async () =>  {
                var oDataGrid:TypeListOfElements = {
					element     : pageReferentielDetailQuestion.datagridheadDetailsQuestionnaire,
					desc        : 'DataGrid [QUESTIONNAIRES]',
					verbose		: false,
					column      : [
						"",
                        "",
                        "Groupe rubrique",
                        "Rubrique",
                        "Code critère",
                        "Désignation critère",
                        "Type",
                        "Valeurs possibles",
                        "Critère obligatoire",
                        "Actions"
					]
				}
				await fonction.dataGridHeaders(oDataGrid);
            })

            test ('IHM Onglet [' + sNomOnglet.toLocaleUpperCase() + '] - Check', async () =>  {
                await fonction.isDisplayed(pageReferentielDetailQuestion.inputFieldNomQuestionnaire);
                await fonction.isDisplayed(pageReferentielDetailQuestion.listBoxRayon);
                await fonction.isDisplayed(pageReferentielDetailQuestion.listBoxObjet);
                await fonction.isDisplayed(pageReferentielDetailQuestion.datagridDetailsQuestionnaire);
                await fonction.isDisplayed(pageReferentielDetailQuestion.textAreaDescription);
                await fonction.isDisplayed(pageReferentielDetailQuestion.buttonEnregistrer);
                await fonction.isDisplayed(pageReferentielDetailQuestion.buttonAjouterCritere);
                await fonction.isDisplayed(pageReferentielDetailQuestion.buttonModifierCritere);
                await fonction.isDisplayed(pageReferentielDetailQuestion.buttonDupliquerCritere);
                await fonction.isDisplayed(pageReferentielDetailQuestion.buttonSupprimerCritere);
            })   

		})

        var sNomOnglet2:string = 'articles';
		test.describe ('Onglet[' + sNomOnglet2.toUpperCase() + ']', async () =>  {
	
            test ('Onglet [' + sNomOnglet2.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage2, sNomOnglet2, page);
			})

            test ('DataGrid [ARTICLES] - Check', async () =>  {
                var oDataGrid:TypeListOfElements = {
					element     : pageReferentielArticles.datagridheadArticles,
					desc        : 'DataGrid [ARTICLES]',
					verbose		: false,
					column      : [
                        "Code article", 
                        "Désignation article", 
                        "Groupe article", 
                        "Famille", 
                        "Sous famille", 
                        "Cahier des charges", 
                        "Questionnaire",
                        "Dernier contrôle",
                        "Prioritaire", 
                        "Actif", 
                        "Actions"
					]
				}
				await fonction.dataGridHeaders(oDataGrid);
            }) 

            test ('DatagridListBox [RAYON] - Check', async () =>  {
                await menu.checkListBox(pageReferentielArticles.listBoxRayon);
            })

            test ('DatagridListBox [GROUPE ARTICLE] - Check', async () =>  {
                await menu.checkListBox(pageReferentielArticles.datagridListBoxGroupeArticle);
            })

            test ('DatagridListBox [QUESTIONNAIRE] - Check', async () =>  {
                await menu.checkListBox(pageReferentielArticles.datagridListBoxQuestionnaires);
            })

            test ('DatagridListBox [PRIORITAIRE] - Check', async () =>  {
                await menu.checkListBox(pageReferentielArticles.datagridListBoxPrioritaire);
            })

            test ('DatagridListBox [ACTIF] - Check', async () =>  {
                await menu.checkListBox(pageReferentielArticles.datagridListBoxActif);
            })

            test ('IHM Onglet [' + sNomOnglet.toUpperCase() + '] - Check', async () =>  {    
                await fonction.isDisplayed(pageReferentielArticles.datagridArticles);
                await fonction.isDisplayed(pageReferentielArticles.datagridInputDesignationArticle);
                await fonction.isDisplayed(pageReferentielArticles.listBoxRayon);
                await fonction.isDisplayed(pageReferentielArticles.datagridListBoxGroupeArticle);
                await fonction.isDisplayed(pageReferentielArticles.datagridListBoxCahierdesCharges);
                await fonction.isDisplayed(pageReferentielArticles.datagridListBoxQuestionnaires);
                await fonction.isDisplayed(pageReferentielArticles.datagridListBoxPrioritaire);
                await fonction.isDisplayed(pageReferentielArticles.datagridListBoxActif);
                await fonction.isDisplayed(pageReferentielArticles.buttonModifierArticle);
            })  

		})

        var sNomOnglet3:string = 'mobiliers';
		test.describe ('Onglet[' + sNomOnglet3.toUpperCase() + ']', async () =>  {
	
            test ('Onglet [' + sNomOnglet3.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage2, sNomOnglet3, page);
			})

            test ('DataGrid [MOBILIERS] - Check', async () =>  {
                var oDataGrid:TypeListOfElements = {
					element     : pageReferentielMobiliers.datagridheadMobiliers,
					desc        : 'DataGrid [MOBILIERS]',
					verbose		: false,
					column      : [
						"",
                        "Enseigne", 
                        "Code lieu de vente", 
                        "Désignation lieu de vente",
                        "Equipe",
                        "Univers",
                        "Mobilier",
                        "Nombre d'éléments",
                        "Actions"
					]
				}
				await fonction.dataGridHeaders(oDataGrid);
            })

            test ('IHM Onglet [' + sNomOnglet3.toUpperCase() + '] - Check', async () =>  {  
                await fonction.isDisplayed(pageReferentielMobiliers.listBoxLieuVente);
                await fonction.isDisplayed(pageReferentielMobiliers.datagridMobiliers);
                await fonction.isDisplayed(pageReferentielMobiliers.checkboxMobiliers.first());
                await fonction.isDisplayed(pageReferentielMobiliers.datagridInputEquipe);
                await fonction.isDisplayed(pageReferentielMobiliers.datagridInputUnivers);
                await fonction.isDisplayed(pageReferentielMobiliers.datagridInputMobiliers);
                await fonction.isDisplayed(pageReferentielMobiliers.datagridInputNbreElement);
                await fonction.isDisplayed(pageReferentielMobiliers.buttonGererlesUnivers);
                await fonction.isDisplayed(pageReferentielMobiliers.buttonGererlesElement);
            })  
            
            var sNomPopin:string = "GESTION DES UNIVERS";
            test.describe('Popin [' + sNomPopin + ']', async () =>  { 
   
                test ('Button [GERRER LES UNIVERS] - Click', async () =>  {
                    await fonction.clickAndWait(pageReferentielMobiliers.buttonGererlesUnivers, page);
                })

                test ('Popin ['+sNomPopin+'] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);   
                })

                test ('IHM popin [' + sNomPopin + '] - Check', async () =>  {  
                    await fonction.isDisplayed(pageReferentielMobiliers.pPGuvPopinGestiondesUnivers);
                    await fonction.isDisplayed(pageReferentielMobiliers.pPGuvListboxEquipe);
                    await fonction.isDisplayed(pageReferentielMobiliers.pPGuvInputNouvelUnivers);
                    await fonction.isDisplayed(pageReferentielMobiliers.pPGuvbuttonAjouterUnivers);
                    await fonction.isDisplayed(pageReferentielMobiliers.datagridInputUnivers);
                    await fonction.isDisplayed(pageReferentielMobiliers.pPGuvbuttonEnregistrerUnivers);
                    await fonction.isDisplayed(pageReferentielMobiliers.pPGuvbuttonEnregistreFermer);
                    await fonction.isDisplayed(pageReferentielMobiliers.pPGuvbuttonAnnuler);
                    await fonction.isDisplayed(pageReferentielMobiliers.pPGuvTreeContainerUnivers);
                }) 

                test ('Button [ANNULER] - Click', async () =>  {                
                    await fonction.clickElement(pageReferentielMobiliers.pPGuvbuttonAnnuler);         
                })

                test ('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);   
                })
            })

            var sNomPopin:string = "GESTION DES ELEMENTS POUR ...";
            test.describe('Popin [' + sNomPopin + ']', async () =>  { 

                test ('Button [GERRER LES ELEMENTS] - Click', async () =>  {                
                    await fonction.clickAndWait(pageReferentielMobiliers.buttonGererlesElement, page);
                })

                test ('Popin [' + sNomPopin + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);   
                })

                test ('IHM popin [' + sNomPopin + '] - Check', async () =>  {  
                    await fonction.isDisplayed(pageReferentielMobiliers.pPGelPopinGestiondesElements);
                    await fonction.isDisplayed(pageReferentielMobiliers.pPGelbuttonEnregistrer);
                    await fonction.isDisplayed(pageReferentielMobiliers.pPGelbuttonAnnuler);
                    await fonction.isDisplayed(pageReferentielMobiliers.pPGelListboxEquipe);
                }) 

                test ('Button [ANNULER] - Click', async () =>  {                
                    await fonction.clickElement(pageReferentielMobiliers.pPGelbuttonAnnuler);         
                })

                test ('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);   
                })
            })
		})
	})

	test.describe ('Pages [ADMIN]', async () =>  {

		var sNomPage:string = 'admin';
		test ('Menu [' + sNomPage.toUpperCase() + '] - Click', async () =>  {
			await menu.click(sNomPage, page);
		})

		var sNomOnglet:string = 'administration';
		test.describe ('Onglet[' + sNomOnglet.toUpperCase() + ']', async () =>  {

			test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage, sNomOnglet, page);
			})

		})

		var sNomOnglet1:string = 'gestion des utilisateurs';
		test.describe ('Onglet[' + sNomOnglet1.toUpperCase() + ']', async () =>  {

			test ('Onglet [' + sNomOnglet1.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage, 'gestionUtilisateurs', page);
			})
		})

        var sNomOnglet2:string = 'communication utilisateurs';
		test.describe ('Onglet[' + sNomOnglet2.toUpperCase() + ']', async () =>  {

			test ('Onglet [' + sNomOnglet2.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage, 'communicationUtilisateurs', page);
			})
		})

        var sNomOnglet3:string = 'changelog';
		test.describe ('Onglet[' + sNomOnglet3.toUpperCase() + ']', async () =>  {

			test ('Onglet [' + sNomOnglet1.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage, sNomOnglet3, page);
			})
		})
	
	})
	
	test ('Déconnexion', async () =>  {
        await fonction.deconnexion(page);
    })

})