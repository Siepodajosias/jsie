/**
 * 
 * @author JOSIAS SIE
 * @since 2023-12-01
 *  
 */
const xRefTest      = "SOC_CLI_LSO";
const xDescription  = "Créer un client associé à une société";
const xIdTest       = 8118;
const xVersion      = '3.11';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'SOCIETES',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['typeClient','rayon','abreviation','plateForme','codeUVACRegion','codeUVACCommune','numeroEnregistrement','fournisseur','collectifTiers','typeEcheance','typeReglement','raisonSociale','designation','strategie','filieres'],
	fileName    : __filename
}

//------------------------------------------------------------------------------------

import { test, type Page }                  from '@playwright/test';

import { Help }                             from '@helpers/helpers';
import { TestFunctions }                    from '@helpers/functions';
import { Log }                              from '@helpers/log';

import { MenuSociete }                      from '@pom/SOC/menu.page';
import { PageClients }                      from '@pom/SOC/clients.page';

import { AutoComplete, CartoucheInfo } 		from '@commun/types/index';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuSociete;

let pageClient          : PageClients;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------ 

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage();
	menu                = new MenuSociete(page, fonction);    
	pageClient          = new PageClients(page);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//--------------------USER------------------------------------------------------------
process.env.ROLE            = 'COMPTABLE';// Connexion par défaut avec le profil ayant le Role COMPTABLE
//------------------------------------------------------------------------------------

var oData:any               = fonction.importJdd();
 
const sTypeClient           = fonction.getInitParam('typeClient', 'Magasin');  
const iCodeUVACRegion       = fonction.getInitParam('codeUVACRegion', '16'); 
const iCodeUVACCommune      = fonction.getInitParam('codeUVACCommune','105');
const iNumeroEnregistrement = fonction.getInitParam('numeroEnregistrement','8823');
const sRayon                = fonction.getInitParam('rayon', 'Frais Généraux');
var   sPlateForme           = fonction.getInitParam('plateForme', 'Cremlog');
const sFournisseur          = fonction.getInitParam('fournisseur', 'Prosol Gestion');
const sCollectifTiers       = fonction.getInitParam('collectifTiers', 'CLI MSES GROUPE');
const sTypeEcheance         = fonction.getInitParam('typeEcheance', 'Date de facture');
const sTypeReglement        = fonction.getInitParam('typeReglement', 'Compensation');
const sAbreviation          = fonction.getInitParam('abreviation', 'FF');

var   sRaisonSociale        = fonction.getInitParam('raisonSociale', '');
var   sLieuDeVente          = fonction.getInitParam('designation','');
var   sCodeLieuDeVente    	= fonction.getInitParam('codeLieuVente', ''); 
var   sStrategie         	= fonction.getInitParam('strategie', 'Discount'); //Standard
var   sFilieres            	= fonction.getInitParam('filieres', 'Chargée le samedi / livrée le dimanche');

const iJourEcheance         = 1;
const iNbJourEche           = 1;
var sCompteTiers            = ''; 

var data = {
	sRaisonSociale  : '',
	sDesignation    : '',
	sCodeClient     : '',
	sCodeLieuDeVente: ''
}
//------------------------------------------------------------------------------------  

if (oData !== undefined) {  
	var sDesignationE2E     = oData.sDesignation;      // L'élément recherché est la désignation du lieu de vente préalablement créé dans le E2E                                 // On est dans le cadre d'un E2E. Récupération des données temporaires
	var sRaisonSocialeE2E   = oData.sRaisonSociale;    // L'élément recherché est la raison sociale préalablement créé dans le E2E
	var sCodeLieuDeVenteE2E = oData.sCodeLieuDeVente 	// L'élément recherché est le code du lieu de vente préalablement créé dans le E2E

		sRaisonSociale      = sRaisonSocialeE2E;       // Récupération de la raison sociale 
		sLieuDeVente        = sDesignationE2E;         // Récupération de la désignation du lieu de vente
		sCodeLieuDeVente    =  sCodeLieuDeVenteE2E     // Récupération du code du lieu de vente

	log.set('E2E - Désignation : ' + sDesignationE2E);
	log.set('E2E - Code Lieu de Vente : ' + sCodeLieuDeVenteE2E); 
	log.set('E2E - Raison Sociale : '+ sRaisonSocialeE2E);
}  

//------------------------------------------------------------------------------------

/**
 * Retourne un boolean si le rayon et la filière passée en paramètre est trouvés.
 * 
 * @param rayon 
 * @param filiere 
 * @returns {bCheck}
 */
var checkRayonFiliere = async (rayon:any, filiere:any) => {
	var bCheck:boolean= false;

	const aFiliere = fonction.getLocalConfig('filiere');
	bCheck = (aFiliere[rayon].includes(filiere));
	return bCheck;
}    

/**
 * Récupère le fournisseur en fonction du rayon passé en paramètre.
 * 
 * @param rayon 
 * @returns {sFournisseur}
 */
var getRayonFournisseur = async (rayon:string) => {
	var sFournisseur  = '';

	const aFournisseur= fonction.getLocalConfig('fournisseur');
	sFournisseur      = aFournisseur[rayon];
	return sFournisseur;
}

/**
 * Récupère la plateforme en fonction de filière passé en paramètre.
 * 
 * @param rayon 
 * @returns {sPlateforme}
 */
var getPlateformeFilière = async (filiere:any) => {
	var sPlateforme = '';
	var aPlateforme = fonction.getLocalConfig('plateforme');

	const keys  = Object.keys(aPlateforme);
	sPlateforme = keys.find((key: string | number) => aPlateforme[key].includes(filiere)); 
	return sPlateforme;
}

//------------------------------------------------------------------------------------ 

test.describe.serial('[' + xRefTest + ']', () => {
  
	test('Ouverture URL :' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test('Connexion', async() => {
		await fonction.connexion(page);
	})
	// end describe

	test('Message [ERREUR] - Is Not Visible', async () => {
		await fonction.isErrorDisplayed(false, page);                     // Pas d'erreur affichée à priori au chargement de la page 
	})

	test.describe("Page [CLIENT]", async () => {    

		var pageName:string = 'clients';

		test("Menu [CLIENTS] - Click ", async() => {
			await menu.click(pageName, page);
		})

		test('** Wait Until Spinner Off #1 **', async () => {
			await fonction.waitForSpinner(pageClient.spinnerLoading, 180000);
		})

		test('Message [ERREUR] - Is Not Visible', async () => {
			await fonction.isErrorDisplayed(false, page);                 // Pas d'erreur affichée à priori au chargement de la page 
		}) 

		test ('Button [CREER CLIENT] - Click', async () => {
			await fonction.clickElement(pageClient.buttonCreerClient);
		})

		var sNomPopin:string = "Création d'un client";
		test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {
			test.describe('Sous Onglet [CLIENT]', async () => {
							   
				test('InputField [AUTOCOMPLETE][SOCIETE] = "' + sRaisonSociale + '"', async () => {
					var oData:AutoComplete = {
						libelle         :'SOCIETE',
						inputLocator    : pageClient.pPcreateAutoCompSociete.locator('input').first(),
						inputValue      : sRaisonSociale,
						choiceSelector  : 'ngb-typeahead-window button',
						choicePosition  : 0,
						typingDelay     : 100,
						waitBefore      : 500,
						page            : page,
					}
					await fonction.autoComplete(oData);
					data.sRaisonSociale = sRaisonSociale;
				})

				test ('ListBox [TYPE][CLIENT] = '+ sTypeClient, async () => {
					await fonction.ngClickListBox(pageClient.pPcreateListBoxTypeCli, sTypeClient);
				}) 
				
				test ('Input [JOUR D\'ECHEANCE] = '+ iJourEcheance, async () => {
					await fonction.sendKeys(pageClient.pPcreateInputJoursEch, iJourEcheance, false, 'Jour Echéance');
				}) 

				test ('Input [NB JOURS D\'ECHEANCE] = '+ iNbJourEche, async () => {
					await fonction.sendKeys(pageClient.pPcreateInputNbJoursEch, iNbJourEche, false, 'Nb Jours Echéance'); 
				})

				test ('CheckBox [AVEC REVELE FACTURE] - Click', async () => {
					await fonction.clickCheckBox(pageClient.pPcreateCheckBoxReleve, 0.5, false);
				})
								
				test ('InputField [UVAC REGION] = '+iCodeUVACRegion, async () => {
					var isVisible = await pageClient.pPcreateInputCodeUVACRegion.isVisible();
					if(isVisible){
						await pageClient.pPcreateInputCodeUVACRegion.clear();
						await fonction.sendKeys(pageClient.pPcreateInputCodeUVACRegion, iCodeUVACRegion, false, 'UVAC Région');
					}else{
						log.set('Pas de UVAC region');
					}
				})

				test ('InputField [UVAC COMMUNE] = '+iCodeUVACCommune, async () => {
					var isVisible = await pageClient.pPcreateInputCodeUVACCommune.isVisible();
					if(isVisible){
						await pageClient.pPcreateInputCodeUVACCommune.clear();
						await fonction.sendKeys(pageClient.pPcreateInputCodeUVACCommune, iCodeUVACCommune, false, 'UVAC Commune');
					}else{
						log.set('Pas de UVAC commune');
					}
				})

				test ('InputField [NUMERO ENREGISTREMENT] = '+iNumeroEnregistrement, async () => {
					var isVisible = await pageClient.pPcreateInputNumeroEnregistrement.isVisible();
					if(isVisible){
						await pageClient.pPcreateInputNumeroEnregistrement.clear();
						await fonction.sendKeys(pageClient.pPcreateInputNumeroEnregistrement, iNumeroEnregistrement, false, 'Num Enregistrement');
					}
					else{
						log.set('Pas de numéro d\'enregistrement');
					}
				})

				test ('Input [CODE CLIENT]',async () => {
					var codeClient = await pageClient.pPcreateInputCodeCLient.inputValue();
					if(codeClient !=''){
						sCompteTiers      		= codeClient
						data.sCodeClient  		= sCompteTiers;
						data.sDesignation 		= sLieuDeVente;
						data.sCodeLieuDeVente 	= sCodeLieuDeVente;
					}
				})
			})

			test.describe('Sous Onglet [CENTRALE D\'ACHAT]', async () => {
				var aRayon      = sRayon.split(',');
				var iTailTableau= 1;
				aRayon.forEach((rayon: any)=> {

				var iIndex      = aRayon.indexOf(rayon) + 3;
				var iIndexRayon = aRayon.indexOf(rayon) + 2;
				test.describe('Div [INFORMATION GENERALES]', async () => {
					test ('Button [CENTALE ACHAT] ['+rayon+'] - Click', async () => {
						var sButtonPlus= pageClient.pPbuttonAjouterCentraleAchat.nth(iIndexRayon);
						var isActive   = await sButtonPlus.isEnabled();
						if(isActive){
							await fonction.clickElement(sButtonPlus);
						}
					})

					test ('ListBox [RAYON] ['+rayon+'] - Click', async () => {
						// Rayon
						var sRayonCible = rayon;
						var eRayons     = page.locator('p-tabpanel:nth-child(' + iIndex + ') p-dropdown[formcontrolname="rayon"]');
						var isActive    = await eRayons.isEnabled();
						if(isActive){
							await fonction.clickElement(eRayons);
						}
	
						var isVisible   = await pageClient.pPcreateListBox.first().isVisible();
						if(isVisible){
							await pageClient.pPcreateListBox.filter({hasText: sRayonCible}).nth(0).click();
						}else{
							throw new Error('TypeError : Elément ngListBoxAbsent');
						}
					})
	
					test ('ListBox [FOURNISSEUR] ['+sFournisseur+'] ['+rayon+'] - Click', async () => {
						// Fournisseur
						await fonction.wait(page, 350);
						var eFournisseurs = page.locator('p-tabpanel:nth-child('+iIndex+') p-dropdown[formcontrolname="fournisseur"] .p-dropdown-trigger');
						await fonction.clickElement(eFournisseurs);
						var eFournisseur  = pageClient.pPcreateListBox;                                  // Liste déroulante actuellement ACTIVE (dépliée)
						await eFournisseur.first().waitFor({state:'visible'});
						
						var fournisseur = await getRayonFournisseur(rayon);
						if(fournisseur != ''){
							await eFournisseur.filter({hasText: fournisseur}).nth(0).click();
						}else{
							await eFournisseur.filter({hasText: sFournisseur}).nth(0).click();
						}
					})
	
					test ('ListBox [ABREVIATION RAYON] ['+sAbreviation+'] ['+rayon+'] - Click', async () => {
						if(rayon == "Frais Généraux"){ 
							// Abreviation rayon 
							await fonction.wait(page, 350);
							var eSelectorAbreviations = page.locator('p-tabpanel:nth-child('+iIndex+') p-dropdown[formcontrolname="abreviationRayon"] .p-dropdown-trigger');
							await fonction.clickElement(eSelectorAbreviations);
							
							var eSelectorAbreviation  = pageClient.pPcreateListBox;           
							await eSelectorAbreviation.first().waitFor({state:'visible'});
							await eSelectorAbreviation.filter({hasText: sAbreviation}).nth(0).click();
						}
					})
	
					test ('ListBox [STRATEGIE] ['+sStrategie+'] ['+rayon+'] - Click', async () => {
						// Stratégie 
						await fonction.wait(page, 350);
						var eStrategies = page.locator('p-tabpanel:nth-child('+iIndex+') p-dropdown[formcontrolname="strategie"] .p-dropdown-trigger');
						await fonction.clickAndWait(eStrategies, page);
					
						var isClickableCible = await pageClient.pPcreateListBox.first().isEnabled();
						if(isClickableCible){
							//On sélectionne le choix cible selon son libellé
						   await fonction.clickAndWait(pageClient.pPcreateListBox.locator('span:text-is("'+sStrategie+'")'), page);
						   await fonction.addDataSheet('ListBox', 'Stratégie', sStrategie);
						}else{
							log.set('Choix absent');
						}
					})
	
					test ('DatePicker [DATE PREMIERE REPARTITION] ['+rayon+'] - Click', async () => {
						//DatePicker
						await fonction.wait(page, 350);
						var eDatePicker = page.locator('p-tabpanel:nth-child('+iIndex+') p-calendar[formcontrolname="datePremiereRepartition"]');
						await fonction.clickElement(eDatePicker);
						await fonction.clickElement(pageClient.pPcreateTdDateToday);
					})
	
					test ('ListBox [COLLECTIF TIERS] ['+sCollectifTiers+'] ['+rayon+'] - Click', async () => {
						// collectif tiers 
						test.setTimeout(50000);
						var eCollectifTiers = page.locator('p-tabpanel:nth-child('+iIndex+') p-dropdown[formcontrolname="collectifTiers"] .p-dropdown-trigger');
						await fonction.clickElement(eCollectifTiers);
						var eCollectifTier  = pageClient.pPcreateListBox;           
	
						await eCollectifTier.first().waitFor({state:'visible'});
						await eCollectifTier.filter({hasText: sCollectifTiers}).nth(0).click();

						await fonction.addDataSheet('ListBox', 'Collectif Tiers', sCollectifTiers);
					})
	
					test ('ListBox [COMPTE TIERS] ['+sCompteTiers+'] ['+rayon+'] - Click', async () => {
						// Compte tiers 
						var eComptetiers = page.locator('p-tabpanel:nth-child('+iIndex+') input[formcontrolname="numeroCompteTiers"]');
						await fonction.clickElement(eComptetiers);
						await fonction.sendKeys(eComptetiers, sCompteTiers, false, 'Compte Tiers');
					})
	
					test ('ListBox [TYPE ECHEANCE] ['+sTypeEcheance+'] ['+rayon+'] - Click', async () => {
						// Type échéance 
						test.setTimeout(50000);
						var eTypeEchences = page.locator('p-tabpanel:nth-child('+iIndex+') p-dropdown[formcontrolname="typeEcheance"] .p-dropdown-trigger');
						await fonction.clickElement(eTypeEchences);
						var eTypeEchence  = pageClient.pPcreateListBox;
						
						await eTypeEchence.first().waitFor({state:'visible'});
						await eTypeEchence.filter({hasText: sTypeEcheance}).nth(0).click();

						await fonction.addDataSheet('ListBox', 'Type Echéance', sTypeEcheance);
					})
	
					test ('ListBox [TYPE REGLEMENT] ['+sTypeReglement+'] ['+rayon+'] - Click', async () => {
						// Type de règlement 
						test.setTimeout(50000);
						await fonction.wait(page, 350);
						var eTypeReglements = page.locator('p-tabpanel:nth-child('+iIndex+') p-dropdown[formcontrolname="typeReglement"] .p-dropdown-trigger');
						await fonction.clickElement(eTypeReglements);
						var eTypeReglement  = pageClient.pPcreateListBox; 

						await eTypeReglement.first().waitFor({state:'visible'});
						await eTypeReglement.filter({hasText: sTypeReglement}).nth(0).click();

						await fonction.addDataSheet('ListBox', 'Type Réglement', sTypeReglement);
					})
				})
				
				test.describe('Datagrid [FILIERE DE PREPARATION]', async () => {
	
					test('Dropdown [PREPARATION DU SAMEDI] ['+rayon+'] - Click', async () => {
						//--------- Préparation du samedi -----------------
						test.setTimeout(60000);
						// Boucle sur chacune des listes déroulantes cibles
						var element    = page.locator('p-tabpanel:nth-child(' + iIndex + ') p-table[sortfield="filierePreparation.designation"] table tbody.p-datatable-tbody td:nth-child(2)');
						var elements   = page.locator('p-tabpanel:nth-child(' + iIndex + ') p-table[sortfield="filierePreparation.designation"] table tbody.p-datatable-tbody td:nth-child(1)');
						var nbElements = await elements.count();

						// Utiliser une boucle for...of pour itérer sur chaque élément
						for(let i=0; i < nbElements; i++){
							// On se déplace sur la liste déroulante cible
							var text = await elements.nth(i).textContent();
								text = text.trim();
							if(await checkRayonFiliere(rayon,text)){
								await element.nth(i).hover();
								// On attend qu'elle soit cliquable
								var isClickable = await element.nth(i).isEnabled();
								if(isClickable){
									// On clique dessus afin de faire apparaître la liste de choix
									await element.nth(i).click();
									await fonction.wait(page,350);
									// On attend que le choix cible soit cliquable
									var isClickableCible = await pageClient.pPcreateListBox.first().isEnabled();
									if(isClickableCible){
									//On sélectionne le choix cible selon son libellé
									await fonction.clickElement(pageClient.pPcreateListBox.locator('span:text-is("'+sFilieres+'")'));
									await fonction.wait(page,350);

									await fonction.addDataSheet('ListBox', 'Préparation du Samedi', sFilieres);
									}else{
										log.set('Choix absent');
									}
								}else{
									log.set('Ligne PAS clickable');
								}
							}else{
								log.set('Choix absent');
							}
						}
					})

					test('Dropdown [PROCHAINE PLATEFORME] ['+rayon+'] - Click', async () => {
						//-------- Prochaine plateforme ----------
						test.setTimeout(60000);
						// Boucle sur chacune des listes déroulantes cibles
						var element    = page.locator('p-tabpanel:nth-child(' + iIndex + ') p-table[sortfield="filierePreparation.designation"] table tbody.p-datatable-tbody td:nth-child(4)');
						var elements   = page.locator('p-tabpanel:nth-child(' + iIndex + ') p-table[sortfield="filierePreparation.designation"] table tbody.p-datatable-tbody td:nth-child(1)');
						var nbElements = await elements.count();
						// Utiliser une boucle for...of pour itérer sur chaque élément
						for(let i=0; i < nbElements; i++){
							// On se déplace sur la liste déroulante cible
							var text = await elements.nth(i).textContent();
								text = text.trim();
							if(await checkRayonFiliere(rayon,text)){
								await element.nth(i).hover();
								// On attend qu'elle soit cliquable
								var isClickable = await element.nth(i).isEnabled();
								if(isClickable){
									// On clique dessus afin de faire apparaître la liste de choix
									await fonction.clickElement(element.nth(i));
									await fonction.wait(page,350);
									if(await getPlateformeFilière(text)){
										sPlateForme = await getPlateformeFilière(text);
									}

									await fonction.clickElement(pageClient.pPcreateListBox.locator('span:text-is("'+sPlateForme+'")'));
									await fonction.wait(page,350);

									await fonction.addDataSheet('ListBox', 'Prochaine Plateforme', sPlateForme);
								}else{
									log.set('Ligne PAS clickable');
								}
							}else{
								log.set('Choix absent');
							}
						}
					})

					test('DatePicker [DATE APPLICABILITE DE LA PLATEFORME] ['+rayon+'] - Click', async () => {
						//------ Date applicabilité de la plateforme ------------
						test.setTimeout(60000);
						// Boucle sur chacune des listes déroulantes cibles
						var element    = page.locator('p-tabpanel:nth-child(' + iIndex + ') p-table[sortfield="filierePreparation.designation"] table tbody.p-datatable-tbody td:nth-child(5)');
						var elements   = page.locator('p-tabpanel:nth-child(' + iIndex + ') p-table[sortfield="filierePreparation.designation"] table tbody.p-datatable-tbody td:nth-child(1)');
						var nbElements = await elements.count();
						// Utiliser une boucle for...of pour itérer sur chaque élément
						for(let i=0; i < nbElements; i++){
							// On se déplace sur la liste déroulante cible
							var text = await elements.nth(i).textContent();
								text = text.trim();
							if(await checkRayonFiliere(rayon,text)){
								await element.nth(i).hover();
								// On attend qu'elle soit cliquable
								var isClickable = await element.nth(i).isEnabled();
								if(isClickable){
									// On clique dessus afin de faire apparaître la liste de choix
									await fonction.clickElement(element.nth(i));
									await fonction.wait(page,350);
									var iNbChoix = await pageClient.pPcreateDateApplicabilitePlateForme.count();
									if(iNbChoix < 0 || iNbChoix == 0){
										await fonction.clickElement(pageClient.pDatePickerDateApplicabilitePlateForme);
									}

									await fonction.clickElement(pageClient.pPcreateDateApplicabilitePlateForme.nth(0));
								}else{
									log.set('Ligne PAS clickable');
								}
							}else{
								log.set('Choix absent');
							}
						}
					})
				})

				test('Button [PLUS][+][' + rayon + '] - Click', async () => {
					if(iTailTableau < aRayon.length){
						// Button +
						var sButtonPlus= pageClient.pPbuttonAjouterCentraleAchat.nth(1);
						var isActive   = await sButtonPlus.isEnabled();
						if(isActive){
							await fonction.clickElement(sButtonPlus);
							iTailTableau= iTailTableau + 1;
						}
					}
				})
			  })
			})

			test('Button [ENREGISTRER] - Click', async () => { 
				await fonction.clickAndWait(pageClient.pPcreateBtnEnregistrer, page);
				await fonction.wait(page, 350);
				
				var present = await pageClient.pErrorMessage.isVisible();
				if (present) {
				   var error:any     = await pageClient.pErrorMessage.textContent();
				   var errorMessage  = error.substr(0,6);
				   if(errorMessage === "[9100]" || errorMessage === "[6002]"){
					   await fonction.clickElement(pageClient.pPcreateLinkAnnuler);
				   }
				}
			})
		})
		await fonction.writeData(data);
	})  //-- End Describe Page

	test('Déconnexion', async() => {
		// Si on est dans le cadre d'un E2E, sauvegarde des données pour le scénario suivant
		await fonction.deconnexion(page);
	})

})  //-- End Describe