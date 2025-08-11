/**
 * @author Josias SIE
 */

const xRefTest      = "DON_IHM_GLB";
const xDescription  = "Examen de l'IHM Sigale DON";
const xIdTest       = 4962;
const xVersion      = '3.6';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'DONS',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['societeDonatrice'],
	fileName    : __filename
};

//--------------------------------------------------------------------------------------//

import { test, type Page, expect }	from '@playwright/test';

import { Help }						from '@helpers/helpers';
import { TestFunctions }			from '@helpers/functions';
import { Log }						from '@helpers/log';
import { JddFile }					from '@helpers/file';

import { MenuDon }					from '@pom/DON/menu.page';
import { AccueilDons }				from '@pom/DON/accueil-dons.page';
import { DetailDons }				from '@pom/DON/dons-detail-dons.page';
import { RecapitulatifsDons }		from '@pom/DON/dons-recapitulatif.page';
import { BeneficiaireDons }			from '@pom/DON/beneficiares-beneficiaires.page';
import { SuiviAttestationsDons }	from '@pom/DON/beneficiaire-suivi-attestations.page';

import { AutoComplete, CartoucheInfo, TypeListOfElements } from '@commun/types';

//--------------------------------------------------------------------------------------//

let page                : Page;
let menu                : MenuDon;

// Pages Object ------------------------------------------------------------------------//

let pageAccueil         : AccueilDons;
let pageDonsDetail      : DetailDons;
let pageDonsRecap       : RecapitulatifsDons;
let pageBenefBenef      : BeneficiaireDons;
let pageBenefSuiviAttest: SuiviAttestationsDons;

//---------------------------------------------------------------------------------------//

const log               = new Log();
const fonction          = new TestFunctions(log);
var jddFile             : JddFile;

//---------------------------------------------------------------------------------------//
const jddRecapt         = fonction.getLocalConfig('jddRecaptitulatif');
//---------------------------------------------------------------------------------------//
var sSocieteDonatrice   = fonction.getInitParam('societeDonatrice', '');
//---------------------------------------------------------------------------------------//

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage();
	menu                = new MenuDon(page, fonction);
  
	pageAccueil         = new AccueilDons(page);
	pageDonsDetail      = new DetailDons(page);
	pageDonsRecap       = new RecapitulatifsDons(page);
	pageBenefBenef      = new BeneficiaireDons(page);
	pageBenefSuiviAttest= new SuiviAttestationsDons(page);
	jddFile             = new JddFile(testInfo);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
});

test.beforeEach(async ({}, testInfo) => {
	await fonction.trace(testInfo);
	await fonction.checkConsole(page, testInfo, false);
})

test.afterAll(async ({}, testInfo) => {
  await fonction.close(testInfo);
});

//---------------------------------------------------------------------------------------//

test.describe.serial('[' + xRefTest + ']', async () => {

	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();		
		await fonction.openUrl(page);
	})

	test ('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe ('Page [ACCUEIL]', async () => {

		var sNomPage = 'home';

		test ('Menu [ACCUEIL] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		test ('Page [ACCUEIL] - Is Visible', async () => {
			await expect(pageAccueil.labelWelcomeMessage).toBeVisible();
		})
	})

	test.describe ('Page [DONS]', async () =>  {

		var sNomPage    = 'dons';
		let bActionnable= false;
		test ('Page [DONS] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		test ('** Wait Until Spinner Off **', async () => {
			await fonction.waitForSpinner(menu.iSpinner);
		})

		var sNomOnglet = 'DETAIL DES DONS';
		test.describe ('Onglet [' + sNomOnglet + ']', async () => {

			test ('Input, ListBox and button [Is Visible] - Check', async () => {
				await fonction.isDisplayed(pageDonsDetail.inputNumeroduBonDetailDon);
				await fonction.isDisplayed(pageDonsDetail.inputSocieteDonatriceDetailDon);
				await fonction.isDisplayed(pageDonsDetail.inputBeneficiaireDetailDon);
				await fonction.isDisplayed(pageDonsDetail.listBoxGroupeArticle);
				await fonction.isDisplayed(pageDonsDetail.buttondatePickerPeriodeDons);
				await fonction.isDisplayed(pageDonsDetail.buttonRechercherlesDons);
				await fonction.isDisplayed(pageDonsDetail.buttonCreerDon);
				await fonction.isDisplayed(pageDonsDetail.buttonModifierDon);
				await fonction.isDisplayed(pageDonsDetail.buttonSupprimerDon);
			})

			test ('DataGrid [LISTE DETAIL DONS] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageDonsDetail.dataGridListeDetailDon,    
					desc        : 'DataGrid [LISTE DETAIL DONS]',
					verbose     : false,
					column      :   
					[  "",
						"Numéro du bon",
						"Bénéficiaire (Ville)",
						"Société donatrice",
						"Date",
						"Groupe article",
						"Valorisation",
						"Type de don",
						"Actions"
					 ]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			})

			//---Datepicker: pour choisir la période du Don {dd/mm/yyyy}------------------------------------------- //
			var sNomPopin = 'PERIODE DU DON';
			test.describe ('DatePicker [' + sNomPopin + ']', async () => {

				test ('Button [PERIODE DU DON] - Click', async () => {
					await fonction.clickAndWait(pageDonsDetail.buttondatePickerPeriodeDons, page);
				})

				test ('DatePicker [Is Visible] - Check', async () => {                   
					await fonction.isDisplayed(pageDonsDetail.datePickerPeriodeDon);
					await fonction.isDisplayed(pageDonsDetail.datePickerListBoxMois);
					await fonction.isDisplayed(pageDonsDetail.datePickerListBoxAnnee);
					await fonction.isDisplayed(pageDonsDetail.datePickerListBoxJour.first());
					await fonction.isDisplayed(pageDonsDetail.datePickerButtonAjourdhui);
					await fonction.isDisplayed(pageDonsDetail.datePickerButtonAnnuler);
				})

				test ('Link [ANNULER] - Click', async () => {
					await fonction.clickAndWait(pageDonsDetail.datePickerButtonAnnuler, page);
				})
			})

			//---Popin: pour Creer un Don -------------------------------------------------------------------- //
			var sNomPopin = 'CREER UN DON';
			test.describe ('Popin [' + sNomPopin + ']',  async () => {

				test ('Button [CREER UN DON] - Click', async () => {
					await fonction.clickAndWait(pageDonsDetail.buttonCreerDon, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Check', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})
				
				test ('Input, Button, TextArea and DatePicker [Is - visible] - Check', async () => {
					await fonction.isDisplayed(pageDonsDetail.pPcdInputSocieteDonatrice);
					await fonction.isDisplayed(pageDonsDetail.pPcdInputBeneficiaire);
					await fonction.isDisplayed(pageDonsDetail.pPmddatePickerModifierDon);
					await fonction.isDisplayed(pageDonsDetail.pPcdInputMontantduDon);
					await fonction.isDisplayed(pageDonsDetail.pPtextAreaCommentaire);
					await fonction.isDisplayed(pageDonsDetail.pPcdButtonEnregistrer);
				})

				//---Datepicker: pour choisir la période du Don sur le pop-up Creer Don {dd/mm/yyyy}-----------------------------------------------------//             
				test ('DatePicker [PERIODE DU DON] - Click', async () => {
					await fonction.clickAndWait(pageDonsDetail.pPcddatePickerCreerDon, page);
				})

				test ('DatePicker [Is - visible] - Check', async () => {
					await fonction.isDisplayed(pageDonsDetail.datePickerCreerDon);
					await fonction.isDisplayed(pageDonsDetail.datePickercdListBoxMois);
					await fonction.isDisplayed(pageDonsDetail.datePickercdListBoxAnnee);
					await fonction.isDisplayed(pageDonsDetail.datePickercdListBoxJour.first());
					await fonction.isDisplayed(pageDonsDetail.datePickercdButtonAjourdhui);
					await fonction.isDisplayed(pageDonsDetail.datePickercdButtonAnnuler);
				})
				
				test ('Link-DatePicker [ANNULER] - Click', async () => {
					await fonction.clickElement(pageDonsDetail.datePickercdButtonAnnuler);
				})
				//-------------------------------------------------------------------------------------------------------------//

				test ('Button [ANNULER] - Click', async () => {                  
					await fonction.clickAndWait(pageDonsDetail.pPcdButtonAnnuler, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , false);
				})
			})

			//---Popin: Modifier un Don -----------------------------------------------------------------------//
			var sNomPopin = 'MODIFIER UN DON';
			test.describe ('[' + sNomPopin + ']', async () => {
				
				test ('** Wait Until Spinner Off **', async () => {
					await fonction.waitForSpinner(menu.iSpinner);
				})

				test ('Header [DATE] - Click x 2', async () => {
					await fonction.clickElement(pageDonsDetail.dataGridDate);
					await fonction.clickElement(pageDonsDetail.dataGridDate);
				})

				test ('Header [TYPE DON] - Click x 2', async () => {
					await fonction.clickElement(pageDonsDetail.dataGridTypeDon);
					await fonction.clickElement(pageDonsDetail.dataGridTypeDon);
				})
	
				test ('CheckBox [LISTE DONS][0] - Click', async () => {
					await fonction.clickElement(pageDonsDetail.checboxListedesDons.nth(0));
				})
	
				test ('Button [MODIFIER] - Click', async () => {
					const bIsChecked = await pageDonsDetail.buttonModifierDon.isEnabled();
					if(bIsChecked){ // il y a des dons pour lesquels aucun action peut être faite d'où le bouton modifier est souvent grisé
						bActionnable = true;
						await fonction.clickAndWait(pageDonsDetail.buttonModifierDon, page);
					}else{
						log.set('Le bouton "Modifer" n\'est pas éditable');
					}                 
				})

				test ('Popin, Input, button and DatePicker [Is - visible] - Check', async () => {
					if(bActionnable){
						await fonction.isDisplayed(pageDonsDetail.pPopinModifierUnDon);
						await fonction.isDisplayed(pageDonsDetail.pPmdInputSocieteDonatrice);
						await fonction.isDisplayed(pageDonsDetail.pPmdInputBeneficiaire)
						await fonction.isDisplayed(pageDonsDetail.pPmddatePickerModifierDon);
						await fonction.isDisplayed(pageDonsDetail.pPmdInputMontantduDon);
						await fonction.isDisplayed(pageDonsDetail.pPmdInputCommentaireModifierDon);
						await fonction.isDisplayed(pageDonsDetail.pPmdButtonEnregistrer);
					}
				})
				//---Datepicker: pour choisir la période du Don sur le pop-up Creer Don {dd/mm/yyyy}-----------------------------------------------------//             
				test ('DatePicker [PERIODE DU DON] - Click', async () => {
					if(bActionnable){
						await fonction.clickElement(pageDonsDetail.pPmddatePickerModifierDon);
					}
				})

				test ('DatePicker [Is - visible] - Check', async () => {
					if(bActionnable){
						await fonction.isDisplayed(pageDonsDetail.datePickerModifierDon);
						await fonction.isDisplayed(pageDonsDetail.datePickermdListBoxMois);
						await fonction.isDisplayed(pageDonsDetail.datePickermdListBoxAnnee);
						await fonction.isDisplayed(pageDonsDetail.datePickermdListBoxJour.first());
						await fonction.isDisplayed(pageDonsDetail.datePickermdButtonAjourdhui);
						await fonction.isDisplayed(pageDonsDetail.datePickermdButtonAnnuler);
					}
				})

				test ('Link-DatePicker [ANNULER] - Click', async () => {
					if(bActionnable){
						await fonction.clickElement(pageDonsDetail.datePickermdButtonAnnuler);   
					}
				})
				//-------------------------------------------------------------------------------------------------------------//
				test ('Button [ANNULER] - Click', async () => {
					if(bActionnable){
						await fonction.clickElement(pageDonsDetail.pPmdButtonAnnuler);
					}
				})
			})

			//---Popin: Supprimer un Don ---------------------------------------------------------------------//
			var sNomPopin = 'SUPPRIMER UN DON';
			test.describe.skip ('Popin [' + sNomPopin + ']', async () => {

				let isActive:boolean;

				test ('Button [SUPPRIMER] - Click', async () => {
					isActive = await pageDonsDetail.buttonSupprimerDon.isEnabled();
					if(isActive){
						await fonction.clickAndWait(pageDonsDetail.buttonSupprimerDon, page);
					}else{
						log.set('Le bouton "Supprimer" n\'est pas actif');
						bActionnable = false;
					}
				})

				test ('** Wait Until Spinner Off (IN) **', async () => {
					await fonction.waitForSpinner(menu.iSpinner);
				})

				test ('Popin and button [Is - visible] - Check', async () => {
					if(bActionnable){
						await fonction.isDisplayed(pageDonsDetail.pPopinSupprimerUnDon);
						await fonction.isDisplayed(pageDonsDetail.pPsdButtonSupprimer);
					} else {
						test.skip();
					}
				})

				test ('Button [ANNULER] - Click', async () => {
					if(bActionnable){
						await fonction.clickElement(pageDonsDetail.pPsdButtonAnnuler);
					} else {
						test.skip();
					}
				})

				test ('** Wait Until Spinner Off (OUT)**', async () => {
					await fonction.waitForSpinner(menu.iSpinner);
				})

			})

		})

		var sNomOnglet = 'RECAPITULATIF';
		test.describe ('Onglet [' + sNomOnglet + ']', async () => {

			test ('Onglet [' + sNomOnglet + '] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'recapitulatifs', page);
			})

			test ('** Wait Until Spinner Off **', async () => {
				await fonction.waitForSpinner(menu.iSpinner);
			})

			test ('Button, Input and CheckBox [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageDonsRecap.inputBeneficiaireRecapitulatif);
				await fonction.isDisplayed(pageDonsRecap.inputSocieteDonatriceRecapitulatif);
				await fonction.isDisplayed(pageDonsRecap.buttondatePickerPeriodeDonsRecap);
				await fonction.isDisplayed(pageDonsRecap.buttonAttestNonRenseigne);
				await fonction.isDisplayed(pageDonsRecap.buttonAttestEnvoyerOui);
				await fonction.isDisplayed(pageDonsRecap.buttonAttestEnvoyerNon);
				await fonction.isDisplayed(pageDonsRecap.buttonRechercherRecapitulatif);
				await fonction.isDisplayed(pageDonsRecap.buttonCorrigerpoids);
				await fonction.isDisplayed(pageDonsRecap.buttonVisualiserDetail);
				await fonction.isDisplayed(pageDonsRecap.buttonAjouterValorisation);
				await fonction.isDisplayed(pageDonsRecap.buttonRenvoyerRecapitulatif);
				await fonction.isDisplayed(pageDonsRecap.buttonImprimerRecapitulatif);
				await fonction.isDisplayed(pageDonsRecap.buttonAnnulerRecapitulatif);
				await fonction.isDisplayed(pageDonsRecap.checkboxListeRecapitulatif.first());
			})

			test ('DataGrid [LISTE DES RECAPITULATIFS] - Check', async () => {
				var oDataGrid:TypeListOfElements = 
				{
					element     : pageDonsRecap.dataGridListeRecapitulatif,    
					desc        : 'DataGrid [LISTE DES RECAPITULATIFS]',
					verbose     : false,
					column      :   
						[  "",
							"Bénéficiaire (ville)",
							"Société donatrice",
							"Lieu de ramasse",
							"Période",
							"Poids total",
							"Valorisation initiale",
							"Valorisation corrigée",
							"Attestation envoyée",
							"Actions"
						]
				}
					await fonction.dataGridHeaders(oDataGrid);
			})

			//---Datepicker: pour choisir la période du Don {dd/mm/yyyy}-----------------------------------------------//            
			var sNomPopin = 'PERIODE DU DON';
			test.describe ('Button [' + sNomPopin + ']', async () => {

				test ('DatePicker [' + sNomPopin + '] - Click', async () => {
					await fonction.clickElement(pageDonsRecap.buttondatePickerPeriodeDonsRecap);
				})

				test ('DatePicker [Is - visible] - Check', async () => {
					await fonction.isDisplayed(pageDonsRecap.datePickerPeriodeDonsRecap);
					await fonction.isDisplayed(pageDonsRecap.datePickerListBoxAnnee)
					await fonction.isDisplayed(pageDonsRecap.datePickerButtonAjourdhui);
				})

				test ('Link [ANNULER] - Click', async () => {
					await fonction.clickAndWait(pageDonsRecap.datePickerButtonAnnuler, page);
				})

			})

			//---Popin Corriger Poids----------------------------------------------------------------------------------//
			var sNomPopin = 'CORRIGER POIDS';
			test.describe ('Popin [' + sNomPopin + ']', async () => {

				test ('** Wait Until Spinner Off **', async () => {
					await fonction.waitForSpinner(menu.iSpinner);
				})

				test ('Header [ATTESTATION ENVOYEE] - Click', async () => {
					await fonction.clickElement(pageDonsRecap.dataGridAttestationEnvoye);
				})

				test ('Header [LIEU DE RAMASSE] - Click', async () => {
					await fonction.clickElement(pageDonsRecap.dataGridlieuDeRamasse);
				})

				test ('CheckBox [LISTE DES RECAPtestULATIFS][0] - Click', async () => {
					await fonction.clickElement(pageDonsRecap.checkboxListeRecapitulatif.nth(0));
				})

				test ('Button [' + sNomPopin + '] - Click', async () => {
					await fonction.clickAndWait(pageDonsRecap.buttonCorrigerpoids, page);
				})

				test (' Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
				})

				test ('Button and Input [Is - visible] - Check', async () => {
					await fonction.isDisplayed(pageDonsRecap.pPcpInputNouveauPoids);
					await fonction.isDisplayed(pageDonsRecap.pPcpButtonEnregister);
				})

				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickAndWait(pageDonsRecap.pPcpButtonAnnuler, page);
				})

				test (' Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin.toUpperCase(), false);
				})

			})

			//---Popin  Visualiser le Détail ----------------------------------------------------------------------------//
			var sNomPopin = 'VISUALISER DETAIL';
			test.describe ('Popin [' + sNomPopin + ']', async () => {

				test ('Button [' + sNomPopin + '] - Click', async () => {
					await fonction.clickAndWait(pageDonsRecap.buttonVisualiserDetail, page);
				})

				test (' Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
						await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
				})

				test ('DataGrid [VISUALISER DETAIL] - Check', async () => {
					var oDataGrid:TypeListOfElements = 
					{
						element     : pageDonsRecap.pPvrDataGridListeDetail,    
						desc        : 'DataGrid [VISUALISER DETAIL]',
						verbose     : false,
						column      :   
							[  "N° du bon",
								"Date",
								"Article",
								"Quantité (Un)",
								"Poids (kg)",
								"Prix Unitaire",
								"Montant total (€)"
							]
					}
						await fonction.dataGridHeaders(oDataGrid);
				})

				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickAndWait(pageDonsRecap.pPvrButtonFermer, page);
				})

				test (' Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin.toUpperCase(), false);
				})

			})

			//---Popin  Renvoyer récaptestulatif(s) ----------------------------------------------------------------------//
			var sNomPopin = 'RENVOYER RECAPITULATIF(S)';
			test.describe ('Popin [' + sNomPopin + ']', async () => {

				test ('Button [RENVOYER RECAPITULATIF(S)] - Click', async () => {
					await fonction.clickAndWait(pageDonsRecap.buttonRenvoyerRecapitulatif, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})

				test ('Button [Is - visible] - Check', async () => {
					await fonction.isDisplayed(pageDonsRecap.pPopinRenvoiRecapDon);
					await fonction.isDisplayed(pageDonsRecap.pPrrdButtonConfirmer);
				})

				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickAndWait(pageDonsRecap.pPrrdButtonAnnuler, page);
				})

				test (' Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin.toUpperCase(), false);
				})

			})

			//---Popin Ajouter une valorisation -----------------------------------------------------------------------//        
			var sNomPopin = 'AJOUTER VALORISATION';
			test.describe ('Popin [' + sNomPopin + ']', async () => {

				test ('CheckBox [LISTE DES RECAPITULATIFS][0] - UnClick', async () => {
					await fonction.clickElement(pageDonsRecap.checkboxListeRecapitulatif.nth(0));
					var oData        = jddFile.readJson(jddRecapt);
					sSocieteDonatrice= oData.sSocieteDonatrice;
				})

				test ('InputField [SOCIETE DONATRICE] = "' + sSocieteDonatrice + '"', async () => {
					var oData:AutoComplete = {
						libelle         :'SOCIETE',
						inputLocator    : pageDonsRecap.inputSocieteDonatriceRecapitulatif,
						inputValue      : sSocieteDonatrice,
						choiceSelector  : '.dropdown-menu button[role="option"]',
						choicePosition  : 0,
						typingDelay     : 100,
						waitBefore      : 500,
						page            : page,
					}
						await fonction.autoComplete(oData);
				})

				test ('Button [RECHERCHER RECAPITULATIF] - Click', async () => {
					await fonction.clickAndWait(pageDonsRecap.buttonRechercherRecapitulatif, page);
				})

				test ('** Wait Until Spinner Off **', async () => {
					await fonction.waitForSpinner(menu.iSpinner);
				})

				test ('Header [ATTESTATION ENVOYE] - Click', async () => {
					await fonction.clickElement(pageDonsRecap.dataGridAttestationEnvoye);
				})

				test ('Header [VALORISATION CORRIGEE] - Click', async () => {
					await fonction.clickElement(pageDonsRecap.dataGridValorisationCorrigee);
				})

				test ('CheckBox [LISTE DES RECAPITULATIFS][rnd] - Click', async () => {
					await fonction.clickElement(pageDonsRecap.checkboxListeRecapitulatif.first());
					await fonction.isDisplayed(pageDonsRecap.iconListeRecapitulatif);
					await expect(pageDonsRecap.trListeRecapitulatif).toHaveClass('p-selectable-row ng-star-inserted p-highlight');
				})

				test ('Button [AJOUTER VALORISATION] - Click', async () => {
					await fonction.clickAndWait(pageDonsRecap.buttonAjouterValorisation, page);
				})

				test (' Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
				})

				test ('Button [Is - visible] - Check', async () => {
					await fonction.isDisplayed(pageDonsRecap.pPopinAjouterValorisation);
					await fonction.isDisplayed(pageDonsRecap.pPavButtonGroupeArticle);
					await fonction.isDisplayed(pageDonsRecap.pPavButtonEnregistrer);
				})

				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickAndWait(pageDonsRecap.pPavButtonAnnuler, page);
				})

				test (' Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin.toUpperCase(), false);
				})

			})

		})

	})

	test.describe ('Page [BENEFICIAIRES]', async () => {

		var sNomPage = 'beneficiaires';

		test ('Page [BENEFICIAIRES] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		test.describe ('Onglet [BENEFICIAIRES]', async () => {

			test ('** Wait Until Spinner Off **', async () => {
				await fonction.waitForSpinner(menu.iSpinner);
			})

			test ('CheckBox, Button and DataGrid [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageBenefBenef.checboxListeBeneficiaire.nth(0));
				await fonction.isDisplayed(pageBenefBenef.dataGridCodeBeneficiaire);
				await fonction.isDisplayed(pageBenefBenef.dataGridInputNomBeneficiaire);
				await fonction.isDisplayed(pageBenefBenef.dataGridInputVille);
				await fonction.isDisplayed(pageBenefBenef.dataGridListBoxGroupeBenef);
				await fonction.isDisplayed(pageBenefBenef.dataGridInputSociete);
				await fonction.isDisplayed(pageBenefBenef.dataGridListBoxStatutBenef);
				await fonction.isDisplayed(pageBenefBenef.buttonCreerBeneficiaire);
				await fonction.isDisplayed(pageBenefBenef.buttonModifierBeneficiaire);
				await fonction.isDisplayed(pageBenefBenef.buttonAssocierGroupe);
				await fonction.isDisplayed(pageBenefBenef.buttonGererGroupe);
				await fonction.isDisplayed(pageBenefBenef.buttonSupprimerBeneficiaire);
				await fonction.isDisplayed(pageBenefBenef.buttonBloquerBeneficiaire);
				await fonction.isDisplayed(pageBenefBenef.buttonDebloquerBeneficiaire);
				await fonction.isDisplayed(pageBenefBenef.buttonEnvoyerAttestion);
			})

			test ('DataGrid [LISTE DES BENEFICIAIRES] - Check', async () => {
				var oDataGrid:TypeListOfElements = {
					element     : pageBenefBenef.dataGridListeBeneficiaire,    
					desc        : 'DataGrid [BENEFICIAIRES]',
					verbose     : false,
					column      :   
						[  "Code",
							"Nom du bénéficiaire",
							"Ville",
							"Groupe",
							"Sociétés",
							"Statut",
							"Actions"
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			})

			//---Popin: Creer Bénéficiaire--------------------------------------------------------------------------//            
			var sNomPopin = 'CREER BENEFICAIRE';
			test.describe ('Popin [' + sNomPopin + ']', async () => {

				test ('Button [CREER BENEFICIAIRE] - Click', async () => {
					await fonction.clickAndWait(pageBenefBenef.buttonCreerBeneficiaire, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})

				test ('DataGrid [ZONE SOCIETE] - Check', async () => {
					var oDataGrid:TypeListOfElements = {
						element     : pageBenefBenef.pPcbdataGridZoneSoc,    
						desc        : 'DataGrid [ZONE SOCIETE]',
						verbose     : false,
						column      :   
							[  "Code société",
								"Société",
								"Convention signée",
								"Actions"
							]
					}
					await fonction.dataGridHeaders(oDataGrid); 
				})

				test ('InputField [NOM] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbInputNomBenef);
				})

				test ('InputField [ADRESSE] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbInputAdresseBenef);
				})

				test ('InputField [COMPLEMENT ADRESSE] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbInputComplementAdresse);
				})

				test ('InputField [CODE POSTAL] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbInputCodePostal);
				})

				test ('InputField [VILLE] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbInputVille);
				})

				test ('InputField [NUMERO] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbInputNumero);
				})

				test ('InputField [EMAIL] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbInputEmail);
				})

				test ('InputField [NOM CONTACT] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbInputNomContact);
				})

				test ('InputField [TELEPHONE] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbInputTelephone);
				})

				test ('InputField [N° SIREN] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbInputNumSIREN);
				})

				test ('InputField [N° RNA] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbInputNumNRA);
				})

				test ('InputField [DESIGNATION] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbInputCodeDesignation);
				})

				test ('TextArea [OPERE POUR LE COMPTE] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbInputOperepourleCompte);
				})

				test ('ListBox [PAYS] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbListBoxPays);
				})

				test ('ListBox [GROUPE] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbListBoxGroupe);
				})

				test ('Date Picker [DATE] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbdatePicker);
				})

				test ('Radio Button [BOI-TVA-DED-60-30-20200826] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbRadiobuttonOeuvreOrgGeneral);
				})

				test ('Radio Button [ASSOCIATION...] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbRadiobuttonAssociatAideAliment);
				})

				test ('Radio Button [OEUVRE OU ORGANISME D\'INTERET GENERAL] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbRadiobuttonOeuvreBoiTvaDed);
				})

				test ('CheckBox [DEBLOQUE] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbCheckboxDebloquer);
				})

				test ('CheckBox [GENERER DOC FISCAUX] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbCheckboxgenererDocFiscaux);
				})

				test ('CheckBox [ATTESTATION AVEC MONTANT] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbCheckboxAttestatAvecMontant);
				})

				test ('Button [PARCOURIR] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbButtonPacourirDocument);
				})

				test ('Button [ENREGISTRER] - Is Visible', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPcbButtonEnregistrer);
				})

				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickAndWait(pageBenefBenef.pPcbButtonAnnuler, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , false);
				})
			})

			//---Popin: Modifier Bénéficiaire----------------------------------------------------------------------//
			var sNomPopin = 'MODIFIER UN BENEFICAIRE ';
			test.describe ('Popin [' + sNomPopin + ']', async () => {

				test ('CheckBox [LISTE BENEFICIARES][0] - Click', async () => {
					await fonction.clickElement(pageBenefBenef.checboxListeBeneficiaire.nth(0));
				})

				test ('Button [MODIFIER] - Click', async () => {
					await fonction.clickAndWait(pageBenefBenef.buttonModifierBeneficiaire, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})

				test ('Input, DatePicker, Radio, CheckBox and Button [Is - visible] - Check', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPopinModifierUnBeneficiaire);
					await fonction.isDisplayed(pageBenefBenef.pPmbInputNomBeneficiaire);
					await fonction.isDisplayed(pageBenefBenef.pPmbInputAdresseBeneficiaire);
					await fonction.isDisplayed(pageBenefBenef.pPmbInputComplementAdresse);
					await fonction.isDisplayed(pageBenefBenef.pPmbInputCodePostal);
					await fonction.isDisplayed(pageBenefBenef.pPmbInputVille);
					await fonction.isDisplayed(pageBenefBenef.pPmbInputNumero);
					await fonction.isDisplayed(pageBenefBenef.pPmbInputEmail);
					await fonction.isDisplayed(pageBenefBenef.pPmbInputNomContact);
					await fonction.isDisplayed(pageBenefBenef.pPmbInputTelephone);
					await fonction.isDisplayed(pageBenefBenef.pPmbInputNumSIREN);
					await fonction.isDisplayed(pageBenefBenef.pPmbInputNumNRA);
					await fonction.isDisplayed(pageBenefBenef.pPmbInputCodeDesign);
					await fonction.isDisplayed(pageBenefBenef.pPmbInputOperepourleCompte);
					await fonction.isDisplayed(pageBenefBenef.pPmbdatePicker);
					await fonction.isDisplayed(pageBenefBenef.pPmbRadiobuttonOeuvreOrgGeneral);
					await fonction.isDisplayed(pageBenefBenef.pPmbRadiobuttonAssociatAideAliment);
					await fonction.isDisplayed(pageBenefBenef.pPcbRadiobuttonOeuvreBoiTvaDed);
					await fonction.isDisplayed(pageBenefBenef.pPmbButtonPacourirDocument);
					await fonction.isDisplayed(pageBenefBenef.pPmbCheckboxDebloquer);
					await fonction.isDisplayed(pageBenefBenef.pPmbCheckboxGenererDocFiscaux);
					await fonction.isDisplayed(pageBenefBenef.pPmbCheckboxAttestAvecMontant);
					await fonction.isDisplayed(pageBenefBenef.pPmbButtonEnregistrer);

					await fonction.isDisplayed(pageBenefBenef.pPmbListBoxPays);
					await fonction.isDisplayed(pageBenefBenef.pPmbListBoxGroupe);
				})

				test ('DataGrid [ZONE SOCIETE] - Check', async () => {
					var oDataGrid:TypeListOfElements = {
						element     : pageBenefBenef.pPmddataGridZoneSociete,    
						desc        : 'DataGrid [ZONE SOCIETE]',
						verbose     : false,
						column      :   
							[   "Code société",
								"Société",
								"Convention signée",
								"Actions"
							]
					}
					await fonction.dataGridHeaders(oDataGrid); 
				})

				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickAndWait(pageBenefBenef.pPmbButtonAnnuler, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , false);
				})
			})

			//---Popin: Gérer Groupe -----------------------------------------------------------------------------//
			var sNomPopin = 'GERER DES GROUPES';
			test.describe ('Popin [' + sNomPopin + ']', async () => {

				test ('Button [GERER GROUPES] - Click', async () => {
					await fonction.clickAndWait(pageBenefBenef.buttonGererGroupe, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})

				test ('Input and Button [Is - visible] - Check', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPggInputNomGroupeBenef.first());
					await fonction.isDisplayed(pageBenefBenef.pPggButtonEnregistrer);
				})

				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickAndWait(pageBenefBenef.pPggButtonAnnuler, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , false);
				})
			})

			//---Popin: Supprimer Bénéficiaire--------------------------------------------------------------------//
			var sNomPopin = 'SUPPRIMER UN BENEFICIAIRE';
			test.describe ('Popin [' + sNomPopin + ']', async () => {

				test ('Button [SUPPRIMER] - Click', async () => {
					await fonction.clickAndWait(pageBenefBenef.buttonSupprimerBeneficiaire, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})

				test ('Button [SUPPRIMER] - Check', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPsbButtonSupprimer);
				})

				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickAndWait(pageBenefBenef.pPsbButtonAnnuler, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , false);
				})
			})

			//---Popin: Envoyer Attestations----------------------------------------------------------------------//
			var sNomPopin = 'ENVOIE ATTESTATION';
			test.describe ('Popin [' + sNomPopin + ']', async () => {

				test ('Button [' + sNomPopin + '] - Click', async () => {
					await fonction.clickAndWait(pageBenefBenef.buttonEnvoyerAttestion, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})

				test ('Button, DatePicker [Is - visible] - Check', async () => {
					await fonction.isDisplayed(pageBenefBenef.pPeadatePicker);
					await fonction.isDisplayed(pageBenefBenef.pPeaButtonEnvoyer);
				})

				test ('DatePicker [DATE] = "Aujourd\'hui"', async () => {
					await fonction.clickElement(pageBenefBenef.pPeadatePicker);
					await fonction.clickElement(pageBenefBenef.pPeadatePickerAujourdhui);    
				})

				test ('DatePicker [DATE] - UnClick', async () => {
					await fonction.clickElement(pageBenefBenef.pPeadatePicker);           
				})

				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickAndWait(pageBenefBenef.pPeaButtonAnnuler, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , false);
				})
			})
			
		})

		var sNomOnglet = 'SUIVI DES ATTESTATIONS';
		test.describe ('Onglet [' + sNomOnglet + ']', async () => {

			test ('Onglet [' + sNomOnglet + '] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'suiviAttestations', page);
			})

			test ('** Wait Until Spinner Off **', async () => {
				await fonction.waitForSpinner(menu.iSpinner);
			})

			test ('Button [PERIODE] - Check, Click', async () => {
				await fonction.isDisplayed(pageBenefSuiviAttest.buttonPeriodeDons);
				await fonction.clickElement(pageBenefSuiviAttest.buttonPeriodeDons);
				await fonction.clickElement(pageBenefSuiviAttest.datePickerButtonAnnuler);
			})

			test ('Input, button and DataGrid [Is - visible] - Check', async () => {
				await fonction.isDisplayed(pageBenefSuiviAttest.inputBeneficiaireAttestation);
				await fonction.isDisplayed(pageBenefSuiviAttest.inputSocieteDonatriceAttestation);
				await fonction.isDisplayed(pageBenefSuiviAttest.dataGridInputBenef);
				await fonction.isDisplayed(pageBenefSuiviAttest.dataGridInputVille);
				await fonction.isDisplayed(pageBenefSuiviAttest.dataGridInputSocDonatrice);
				await fonction.isDisplayed(pageBenefSuiviAttest.datePickerDebutPeriode);
				await fonction.isDisplayed(pageBenefSuiviAttest.datePickerFinPeriode);
				await fonction.isDisplayed(pageBenefSuiviAttest.dataGridListBoxValorisation);
				await fonction.isDisplayed(pageBenefSuiviAttest.buttonRelancer);
				await fonction.isDisplayed(pageBenefSuiviAttest.buttonEnregistrerReception)
				await fonction.isDisplayed(pageBenefSuiviAttest.buttonAttestationSigne);
				await fonction.isDisplayed(pageBenefSuiviAttest.buttonAnnulerReception);
				await fonction.isDisplayed(pageBenefSuiviAttest.buttonDeclarerJamaisRecu);
				await fonction.isDisplayed(pageBenefSuiviAttest.buttonExporterValorisation);
				await fonction.isDisplayed(pageBenefSuiviAttest.buttonImprimerAttestation);
			})

			test ('DataGrid [SUIVI DES ATTESTATIONS] - Check', async () => {
				var oDataGrid:TypeListOfElements = {
					element     : pageBenefSuiviAttest.dataGridAttestations,    
					desc        : 'DataGrid [SUIVI DES ATTESTATIONS]',
					verbose     : false,
					column      :   
						[   
							"Code",
							"Bénéficiaire",
							"Ville",
							"Société donatrice",
							"Début période",
							"Fin période",
							"Poids total",
							"Valorisation",
							"Statut",
							"Date relance",
							"Actions"
						]
				}
				await fonction.dataGridHeaders(oDataGrid); 
			})

			//-- Popin : Confirmation de relance -------------------------------------------------------------------------//
			var sNomPopin = 'CONFIRMATION DE LA RELANCE';
			test.describe ('Popin [' + sNomPopin + ']', async () =>  {
			   
				test ('Header [STATUS] - Click', async () => {
					await fonction.clickElement(pageBenefSuiviAttest.dataGridStatut);
				})

				test ('CheckBox [LISTE DES ATTESTATIONS][0] - Click', async () => {
					await fonction.clickElement(pageBenefSuiviAttest.checkBoxAttestations.nth(0));
				})

				test ('Button [RELANCER] - Click', async () => {
					await fonction.clickAndWait(pageBenefSuiviAttest.buttonRelancer, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})

				test ('Buttton [Is - visible] - Check', async () => {
					await fonction.isDisplayed(pageBenefSuiviAttest.pPopinConfirmationRelance);
					await fonction.isDisplayed(pageBenefSuiviAttest.pPcrButtonConfirmer);
				})

				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickAndWait(pageBenefSuiviAttest.pPcrButtonAnnuler, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , false);
				})
			})

			//-- Popin : Enregistrer Réception --------------------------------------------------------------------------//
			var sNomPopin = 'ENREGISTRER RECEPTION';
			test.describe ('Popin [' + sNomPopin + ']', async () => {

				test ('Button [' + sNomPopin + '] - Click', async () => {
					await fonction.clickAndWait(pageBenefSuiviAttest.buttonEnregistrerReception, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})

				test ('Button [Is - visible] - Check', async () => {
					await fonction.isDisplayed(pageBenefSuiviAttest.pPerButtonAtestationSigne.first());
					await fonction.isDisplayed(pageBenefSuiviAttest.pPerButtonEnregisterRecep);
				})

				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickAndWait(pageBenefSuiviAttest.pPerButtonAnnulerRecep, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , false);
				})
			})

			//-- Popin :  Déclarer jamais reçu  -----------------------------------------------------------------------//
			var sNomPopin = 'DECLARER JAMAIS RECU';
			test.describe ('Popin [' + sNomPopin + ']', async () => {

				test ('Button [DECLARER JAMAIS RECU] - Click', async () => {
					await fonction.clickAndWait(pageBenefSuiviAttest.buttonDeclarerJamaisRecu, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})

				test ('Buton [Is - visible] - Check', async () => {
					await fonction.isDisplayed(pageBenefSuiviAttest.pPopinDeclarerjamaisrecu);
					await fonction.isDisplayed(pageBenefSuiviAttest.pPdajrButtonConfirmer);
				})

				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickAndWait(pageBenefSuiviAttest.pPdajrButtonAnnuler, page);
				})

				test ('CheckBox [LISTE DES RECAPITULATIFS][first] - UnCick', async () => {
					await fonction.clickElement(pageBenefSuiviAttest.checkBoxAttestations.nth(0));
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , false);
				})
			})

			//--Annullation de la Réception--------------------------------------------------------------------------------//
			var sNomPopin = 'ANNULLER RECEPTION ';
			test.describe ('Popin [' + sNomPopin + ']', async () => {

				test ('Header [STATUS] - Click', async () => {
					await fonction.clickElement(pageBenefSuiviAttest.dataGridStatut);
				})
	
				test ('Header [DATE DE RELANCE] - Click', async () => {
					await fonction.clickElement(pageBenefSuiviAttest.dataGridDataRelance);
				})
	
				test ('CheckBox [LISTE DES ATTESTATIONS][0] - Click', async () => {
					await fonction.clickElement(pageBenefSuiviAttest.checkBoxAttestations.nth(0));
				})

				test ('Button [ANNULLER RECEPTION] - Click', async () => {
					await fonction.clickAndWait(pageBenefSuiviAttest.buttonAnnulerReception, page);
				})
			
				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , true);
				})

				test ('Button [Is - visible] - Check', async () => {
					await fonction.isDisplayed(pageBenefSuiviAttest.pPopinAnnullerReception);
					await fonction.isDisplayed(pageBenefSuiviAttest.pParButtonConfirmer);
				})

				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickAndWait(pageBenefSuiviAttest.pParButtonAnnuler, page);
				})

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , false);
				})
			})

			//--Imprimer attestions-----------------------------------------------------------------------------------//
			var sNomPopin = 'IMPRIMER ATTESTATIONS';
			test.describe ('Popin [' + sNomPopin + ']', async () => {
				test ('Button [' + sNomPopin + '] - Click', async () => {
					await fonction.noHtmlInNewTab(page, pageBenefSuiviAttest.buttonImprimerAttestation);
					await fonction.wait(page, 8000);
				})
			})

			//--Exporter Valorisation--------------------------------------------------------------------------------//
			var sNomPopin = 'EXPORTER VALORISATION';
			test.describe ('Popin [' + sNomPopin + ']', async () => {
				test ('Button ['+sNomPopin+'] - Click', async () => {
					await fonction.clickElement(pageBenefSuiviAttest.buttonExporterValorisation);
				})  
			})
		})

	})

	test.describe ('Page [ADMIN]', async () => {

		var sNomPage = 'admin';

		test ('Page [ADMIN] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		test ('Onglet [ADMIN] - Click', async () => {
			await menu.clickOnglet(sNomPage, 'administration', page);
		})

		test ('Onglet [CHANGELOG] - Click', async () => {
		   await menu.clickOnglet(sNomPage, 'changelog', page);
		})
	})

	test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})
