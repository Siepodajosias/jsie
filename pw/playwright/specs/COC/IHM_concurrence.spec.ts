/**
 * @author Josias SIE
 * @description IHM Concurrence
 * @since 2024-11-14
 */

//------------------------------------------------------------------------------------  

const xRefTest      = "CON_IHM_GLB";
const xDescription  = "Examen de l'IHM Concurrence";
const xIdTest       =  7260;
const xVersion      =  '3.4';

var info:CartoucheInfo = {
	desc    : xDescription,
	appli   : 'CONCURRENCE',
	version : xVersion,
	refTest : [xRefTest],
	idTest  : xIdTest,
	help    : [],
	params  : ['rayon'],
	fileName: __filename
};

// Pages Object ---------------------------------------------------------------------
import { test, type Page, expect }          from '@playwright/test';  

import { MenuConcurrence }                  from '@pom/COC/menu.page';
import { Accueil }                          from '@pom/COC/accueil.page';
import { Admin }                            from '@pom/COC/admin.page';
import { Articles }                         from '@pom/COC/articles.page';
import { Categories }                       from '@pom/COC/categories.page';
import { Releves }                          from '@pom/COC/releves.page';

import { Help }                             from '@helpers/helpers';
import { TestFunctions }                    from '@helpers/functions';
import { Log }                              from '@helpers/log';

import { CartoucheInfo, TypeListOfElements }from '@commun/types';

//------------------------------------------------------------------------------------

let page         : Page;
let menu         : MenuConcurrence;

// Pages Object ---------------------------------------------------------------------
let pageAccueil  : Accueil;
let pageAdmin    : Admin;
let pageArticle  : Articles;
let pageCategorie: Categories;

let pageReleve   : Releves;

//------------------------------------------------------------------------------------

const log        = new Log();
const fonction   = new TestFunctions(log);

//--------------------Paramètre du choix du rayon-------------------------------
var sRayon       = fonction.getInitParam('rayon','Poissonnerie'); //'Poissonnerie' BCT
//------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {

	page          = await browser.newPage();
	menu          = new MenuConcurrence(page, fonction);
  
	pageAccueil   = new Accueil(page);
	pageAdmin     = new Admin(page);
	pageArticle   = new Articles(page);
	pageCategorie = new Categories(page);
	pageReleve    = new Releves(page);
  
	const helper  = new Help(info, testInfo, page);
	await helper.init();
	await menu.searchNewElements(testInfo);
})
  
test.beforeEach(async ({}, testInfo) => {
	await fonction.trace(testInfo);
	await fonction.checkConsole(page, testInfo, false);
})

test.afterAll(async ({}, testInfo) => {
	await menu.showNewElements();
	await fonction.close(testInfo);
})

//------------------------------------------------------------------------------

  test.describe.serial ('[' + xRefTest + ']', async () => {
	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();		
		await fonction.openUrl(page);
	});

	test ('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe ('Page [ACCUEIL] ', async () => {

		var sNomPage = 'accueil';
		test ('Menu [' + sNomPage.toUpperCase() + '] - Click', async () => {
			await menu.click(sNomPage ,page);
		})

		test ('Page [ACCUEIL] - Is Visible', async () => {
			await fonction.isDisplayed(pageAccueil.labelWelcomeMessage);
		})
	})

	test.describe ('Page [ARTICLES] ', async () => {

		var sNomPage = 'articles';
		test ('Menu [' + sNomPage.toUpperCase() + '] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		test ('DataGrid [ARTICLES] - Check', async () => {
			var oDataGrid:TypeListOfElements = 
			{
				element     : pageArticle.dataGridEnteteArticles,    
				desc        : 'DataGrid [ARTICLES]',
				verbose     : false,
				column      :   
					[
						'Groupe article',
						'Code article',
						'Désignation article',
						'Désignation personnalisée',
						'Instruction',
						'Référence de gamme',
						'Catégorie',
						'Actif'
					]
			}
			await fonction.dataGridHeaders(oDataGrid); 
		})

		test ('DataGrid [TABLEAU ENTIER] - Is Visible',async () => {
			await fonction.isDisplayed(pageArticle.dataGridEntierArticles);
		})

		test ('CheckBox [SELECT] - Is Visible',async () => {
			await fonction.isDisplayed(pageArticle.dataGridHeaderCheckBoxArticles);
		})

		test ('Thead [CODE ARTICLE] - Is Visible',async () => {
			await fonction.isDisplayed(pageArticle.dataGridHeaderCodeArticle);
		})

		test ('Thead [DESIGNATION ARTICLE] - Is Visible', async () => {
			await fonction.isDisplayed(pageArticle.dataGridHeaderDesignationArticle);
		})

		test ('Thead [DESIGNATION PERSONNALISEE] - Is Visible',async () => {
			await fonction.isDisplayed(pageArticle.dataGridHeaderDesignationPerso);
		})

		test ('Thead [INSTRUCTION] - Is Visible',async () => {
		   await fonction.isDisplayed(pageArticle.dataGridHeaderInstruction);
		})

		test ('Thead [GROUPE ARTICLE] - Is Visible',async ()=>{
			await fonction.isDisplayed(pageArticle.dataGridHeaderGroupeArticle);
		})

		test ('Thead [CATEGORIE] - Is Visible', async ()=> {
		   await fonction.isDisplayed(pageArticle.dataGridHeaderCategorie);
		})

		test ('Thead [ACTIF] - Is Visible',async ()=>{
			await fonction.isDisplayed(pageArticle.dataGridHeaderActif);
		})

		test ('InputField [CODE ARTICLE] - Is Visible',async ()=>{
			await fonction.isDisplayed(pageArticle.dataGridInputFiltreCodeArticle);
		})

		test ('InputField [DESIGNATION ARTICLE] - Is Visible',async ()=>{
			await fonction.isDisplayed(pageArticle.dataGridInputFiltreDesignationArticle);
		})

		test ('InputField [DESIGNATION PERSONNALISEE] - Is Visible',async ()=>{
			await fonction.isDisplayed(pageArticle.dataGridInputFiltreDesignationPerso);
		})

		test ('InputField [INSTRUCTION] - Is Visible',async ()=>{
			await fonction.isDisplayed(pageArticle.dataGridInputFiltreInstruction);
		})

		test ('ListBox [GROUPE ARTICLE] - Is Visible',async ()=>{
			await fonction.clickElement(pageArticle.dataGridFiltreListBoxGroupeArticle)
			await fonction.isDisplayed(pageArticle.dataGridFiltreListBoxGroupeArticle);
		})

		test ('ListBox [CATEGORIE] - Is Visible',async ()=>{
			await fonction.clickElement(pageArticle.dataGridFiltreListBoxGroupeCategorie)
			await fonction.isDisplayed(pageArticle.dataGridFiltreListBoxGroupeCategorie);
		})

		test ('ListBox [ACTIF] - Is Visible',async ()=>{
			await fonction.clickElement(pageArticle.dataGridFiltreListBoxGroupeActif)
			await fonction.isDisplayed(pageArticle.dataGridFiltreListBoxGroupeActif);
		})

		test ('Button [VIDER] - Is Visible',async ()=>{
			await fonction.isDisplayed(pageArticle.dataGridButtonVider);
		})

		test ('Button [ACTIVER] - Is Visible',async ()=>{
			await fonction.isDisplayed(pageArticle.buttonActiverArticle);
		})

		test ('Button [DESACTIVER] - Is Visible',async ()=> {
			await fonction.isDisplayed(pageArticle.buttonDesactiverArticle);
		})

		test ('Button [MODIFIER] - Is Visible',async ()=>{
			await fonction.isDisplayed(pageArticle.buttonModifierArticle);
		})

		test ('Button [ASSOCIER] - Is Visible',async ()=>{
			await fonction.isDisplayed(pageArticle.buttonAssocierCategorie);
		})

		test ('ListBox [CHOIX RAYON] - Select',async ()=>{
			await menu.choixRayon(sRayon);
		})

		test ('CheckBox [CHOIX ARTICLE] - Click', async () => { 
		   await fonction.clickElement(pageArticle.dataGridHeaderCheckBoxArticlesChoix.nth(0));
		})

		test ('Button [MODIFIER] - Click', async () => { 
			await fonction.clickElement(pageArticle.buttonModifierArticle);
		})

		test.describe ('Popin [MODIFIER]',async () =>{

			test ('InputField [DESIGNATION PERSONNALISEE] - Is Visible', async () => {
				await fonction.isDisplayed(pageArticle.pPinputFieldDesignationPerso);
			})

			test ('TextArea [INSTRUCTION] - Is Visible', async () => {
				await fonction.isDisplayed(pageArticle.pPinputFieldInstruction);
			})

			test ('ListBox [CATEGORIE] - Is Visible', async () => {
				await fonction.isDisplayed(pageArticle.pPlistBoxCategorie);
			})

			test ('CheckBox [ACTIF] - Is Visible', async () => {
				await fonction.isDisplayed(pageArticle.pPcheckBoxActif);
			})

			test ('ListBox [CHOIX CATEGORIE] - Is Visible', async () => {
				await fonction.clickElement(pageArticle.pPlistBoxCategorie);
				expect(await pageArticle.pPlistBoxChoix.count()).toBeGreaterThanOrEqual(1);
				await fonction.clickElement(pageArticle.pPlistBoxChoix.nth(0));
			})

			test ('Button [ENREGISTRER] - Is Visible', async () => {
				await fonction.isDisplayed(pageArticle.pPbuttonEnregistrer);
			})

			test ('Button [ANNULER] - Is Visible', async () => {
				await fonction.isDisplayed(pageArticle.pPbuttonAnnuler);
			})

			test ('Button [FERMER FILTRE RCHERCHE] -Click', async () => {
				await fonction.clickElement(pageArticle.pButtonCloseFiltersearch);
			})

			test ('Button [FERMER POPIN] -Click', async () => {
				await fonction.clickElement(pageArticle.pPbuttonAnnuler);
			})

			test ('Button [ASSOCIER CATEGORIE] - Click', async () => { 
				await fonction.clickElement(pageArticle.buttonAssocierCategorie);
			})
		})

		test.describe ('Popin  [ASSOCIER CATEGORIE]',async () =>{

			test ('ListBox [CATEGORIE] - Is Visible', async () => {
				await fonction.isDisplayed(pageArticle.pPlistBoxAssocierCategorie);
			})

			test ('Button [ENREGISTRER] - Is Visible', async () => {
				await fonction.isDisplayed(pageArticle.pPbuttonEnregistrerAssociation);
			})

			test ('Button [ANNULER] - Is Visible', async () => {
				await fonction.isDisplayed(pageArticle.pPbuttonAnnulerAssociation);
			})
		   
			test ('ListBox [CHOIX CATEGORIE] - Is Visible', async () => {
				await fonction.clickElement(pageArticle.pPlistBoxAssocierCategorie);
				expect(await pageArticle.pPlistChoixCategorie.count()).toBeGreaterThanOrEqual(1);
				await fonction.clickElement(pageArticle.pPlistChoixCategorie.nth(0));
			})
			test ('Button [FERMER FILTRE RCHERCHE ASSO.] -Click', async () => {
				await fonction.clickElement(pageArticle.pButtonCloseFiltersearch);
			})

			test ('Button [FERMER POPIN] -Click', async () => {
				await fonction.clickElement(pageArticle.pPbuttonAnnulerAssociation);
			})
		})
	})

	test.describe ('Page [RELEVES]', async () =>  {
		var sNomPage = 'releves';
		var nbReleve: any;
		test ('Menu [' + sNomPage.toUpperCase() + '] - Click', async () => {
		   await  menu.click(sNomPage, page);
		})
	   
		test ('ListBox [CHOIX RAYON] = "' + sRayon + '"',async ()=>{
			await menu.choixRayon(sRayon);
		})

		test ('button [RELEVE DU] - Is Visible', async () => {
			await fonction.isDisplayed(pageReleve.buttonDateReleve);
		})

		test ('InputFiled [LIEU DE VENTE] - Is Visible',async () => {
			await fonction.isDisplayed(pageReleve.inputLieuVente)
		})

		test ('InputFiled [ARTICLE] - Is Visible',async () => {
			await fonction.isDisplayed(pageReleve.inputArticle);
		})

		test ('InputFiled [PRIX AU KILO SUPERIEUR A ] - Is Visible',async ()=>{
			await fonction.isDisplayed(pageReleve.inputPrixKiloSup);
		})

		test ('InputFiled [PRIX AU KILO INFERIEUR A ] - Is Visible',async ()=>{
			await fonction.isDisplayed(pageReleve.inputPrixKiloInf);
		})

		test ('button [RECHERCHER] - Is Visible',async ()=>{
			await fonction.isDisplayed(pageReleve.buttonRechercheReleve);
		})

		test ('Button [DEBUT PLAGE] - Click',async () => {
			await fonction.clickElement(pageReleve.buttonDateReleve);
			await fonction.clickElement(pageReleve.calendarTable.nth(0));
		})

		test ('Button [DATE JOUR] - Click',async () => {
			await fonction.clickElement(pageReleve.selectDateToday);
		})

		test ('button [RECHERCHER] - Click',async ()=>{
			await fonction.clickAndWait(pageReleve.buttonRechercheReleve, page);
		})

		test ('button [SUPPRIMER] - Is Visible',async ()=>{
			await fonction.isDisplayed(pageReleve.buttonSupprimerReleve);
		})

		test ('button [CORRIGER] - Is Visible',async ()=>{
			await fonction.isDisplayed(pageReleve.buttonCorrigerReleve);
		})

		test.skip ('DataGrid [RELEVES] - Check', async () => {
			var oDataGrid:TypeListOfElements = 
			{
				element     : pageReleve.dataGridEnteteReleve,    
				desc        : 'DataGrid [RELEVES]',
				verbose     : false,
				column      :   
					[
						'Date',
						'Lieu de vente',
						'Code article',
						'Désignation article',
						'Catégorie',
						'Enseigne',
						'Département',
						'Prix à l\'unité',
						'Poids ou quantité',
						'Origine',
						'Prix au kg',
						'Type de vente',
						'Promotion'
					]
			}
			await fonction.dataGridHeaders(oDataGrid); 
		})

		test.describe ('Test Conditionnel  [SUPPRIMER RELEVE]',async () => {
	
			test ('CheckBox [CHOIX RELEVE] - Click',async () => {
				nbReleve = await pageReleve.dataGridReleve.locator('p-tablecheckbox .p-checkbox-icon').count();
				if(nbReleve > 0) {  
					await fonction.clickElement(pageReleve.dataGridCheckBox.nth(0));
				}
				else{
					log.set('Aucun relevé disponible');
				}
			})

			test ('Button [SUPPRIMER] - Click',async () =>{
				if(nbReleve > 0) {  
					await fonction.clickElement(pageReleve.buttonSupprimerReleve);
				}
				else{
					log.set('Aucun relevé disponible');
				}
			})

			test.describe ('Popin  [SUPPRIMER]',async () => {

				test ('Button [OUI] - Is Visible',async () =>{
					if(nbReleve > 0) {    
					await fonction.isDisplayed(pageReleve.pPbuttonSupprimerRelever);
					}
					else{
						log.set('Aucun relevé disponible');
					}
				})
	
				test ('Button [NON] - Is Visible',async () =>{
					if(nbReleve > 0) {  
						await fonction.isDisplayed(pageReleve.pPbuttonAnnuleSuppressionRelever);
					}
					else{
						log.set('Aucun relevé disponible');
					}
				})
	
				test ('Button [FEMER POPIN] - Click',async () => {
					if(nbReleve > 0) {  
						await fonction.clickElement(pageReleve.pPbuttonAnnuleSuppressionRelever);
					}
					else{
						log.set('Aucun relevé disponible');
					}
				})
			})
		})
		
		test.describe ('Test Conditionnel  [CORRIGER RELEVE]',async () => {

			test ('Button [CORRIGER] - Click',async () =>{
				if(nbReleve > 0) {  
					await fonction.clickElement(pageReleve.buttonCorrigerReleve);
				}
				else{
					log.set('Aucun relevé disponible');
				}
			})

			test.describe ('Popin  [CORRIGER]',async () =>{

				test ('InputField [DIFFERENTS CHAMPS DE SAISIE] - Is Visible',async ()=>{
					if(nbReleve > 0) {  
						let aLength= await pageReleve.pPmodal.locator('input[pinputtext]:NOT(.p-disabled)').count();
						log.set("aLen = " + aLength);
						for(let i=0;i<aLength;i++) {
							await pageReleve.pPinputField.nth(i).scrollIntoViewIfNeeded();
							await fonction.isDisplayed(pageReleve.pPinputField.nth(i));
						}
					}
					else{
						log.set('Aucun relevé disponible');
					}
				})

				test ('Button [TYPE DE VENTE / PROMOTION] - Is Visible',async () =>{
					if(nbReleve > 0) {   
						let aLength = await pageReleve.pPmodal.locator('div div button.btn').count();
						log.set("aLength " + aLength);
						if(aLength > 0) {                 
							await fonction.isDisplayed(pageReleve.pPbuttonPromotionTypeVente);
						}
					}
					else{
						log.set('Aucun relevé disponible');
					}
				})

				test ('Icon  [QUALITE] - Is Visible',async () => {
					if(nbReleve > 0) { 
						var iNbLabel = await pageReleve.pPlabelPromotionTypeVente.count();
						for(let i=0;i<iNbLabel; i++){
							var sLabelPromotion = await pageReleve.pPlabelPromotionTypeVente.nth(i).textContent();
							let sLabel='Qualité'
							if (sLabelPromotion.includes(sLabel)) {
								await fonction.isDisplayed(pageReleve.pPqualite.nth(i));
							} else {
								log.set('Ce relevé ne contient pas le critère ' + sLabel);
							}
						}
					}else{
						log.set('Aucun relevé disponible');
					}
				})
  
				test ('TextArea [COMMENTAIRE] - Is Visible',async () => {
					if(nbReleve > 0) {  
						let aLength = await pageReleve.pPmodal.locator('textarea#commentaire').count();
						if(aLength > 0) {                 
							await pageReleve.pPtextAreaFieldCommentaire.scrollIntoViewIfNeeded();
							await fonction.isDisplayed(pageReleve.pPtextAreaFieldCommentaire);
						}
					}
					else{
						log.set('Aucun relevé disponible');
					}
				})

				test ('Button [ENREGISTRER] - Click',async () =>{
					if(nbReleve > 0) {   
						await fonction.isDisplayed(pageReleve.pPbuttonEnregistrer);
					}
					else{
						log.set('Aucun relevé disponible');
					}
				})

				test ('Button [ANNULER] - Click',async () =>{
					if(nbReleve > 0) {   
						await fonction.isDisplayed(pageReleve.pPbuttonAnnuler);
					}else{
						log.set('Aucun relevé disponible');
					}
				})
	
				test ('Button [FEMER POPIN] - Click',async () =>{
					if(nbReleve > 0) {   
						await fonction.clickElement(pageReleve.pPbuttonAnnuler);
					}
					else{
						log.set('Aucun relevé disponible');
					}
				})
			})
		}) 
	})

	test.describe ('Page [CATEGORIES]', async () =>  {
		
		var sNomPage = 'categories';
		test ('Menu [' + sNomPage.toUpperCase() + '] - Click', async () => {
		   await menu.click(sNomPage, page);
		})
	   
		test ('ListBox [CHOIX RAYON] = "' + sRayon + '"',async ()=> {
			await menu.choixRayon(sRayon);
		})

		test ('button [CREER] - Is Visible',async ()=>{
			await fonction.isDisplayed(pageCategorie.buttonCreerCategorie);
		})

		test ('dataGrid [TABLEAU] - Is Visible',async ()=>{
			await fonction.isDisplayed(pageCategorie.dataGridEntierCategorie);
		})

		test ('DataGrid [CATEGORIE] - Check', async () => {
			var oDataGrid:TypeListOfElements = 
			{
				element     : pageCategorie.dataGridEnteteCategorie,    
				desc        : 'DataGrid [CATEGORIE]',
				verbose     : false,
				column      :   
					[
						'',
						'Catégorie',
						'Actif',
						'Date de début',
						'Date de fin',
						'Marque',
						'Producteur',
						'Numéro d\'agrément',
						'Prix à l\'unité',
						'Poids ou Quantité',
						'Origine',
						'Prix au kg',
						'Type de vente',
						'Promotion (Oui/Non)',
						'Fournisseur',
						'Qualité',
						'Commentaire',
						'Actions'
					]
			}
			await fonction.dataGridHeaders(oDataGrid); 
		})

		test ('checkBox [TABLEAU] - Is Visible',async ()=>{
			await fonction.isDisplayed(pageCategorie.dataGridCheckBoxCategorie);
		})

		test ('theader [CATEGORIE] -Is Visible',async ()=>{
			await fonction.isDisplayed(pageCategorie.dataGridHeaderCategorie);
		})

		test ('InputField [CATEGORIE] -Is Visible',async ()=>{
			await fonction.isDisplayed(pageCategorie.dataGridInputFilterCategorie);
		})

		test ('button [MODIFIER] - Is Visible',async ()=>{
			await fonction.isDisplayed(pageCategorie.buttonModifierCategorie);
		})

		test ('button [CREER] - Click',async ()=>{
			await fonction.clickAndWait(pageCategorie.buttonCreerCategorie, page);
		})

		test.describe ('Popin  [CREER]', async () =>{

			test ('InputField [DESIGNATION CATEGORIE] - Is Visible',async () => {
				await fonction.isDisplayed(pageCategorie.pPinputFieldDesignationCategorie);
			})

			test ('Switched-button [ACTIVER] - Is Visible',async () => {
				await fonction.isDisplayed(pageCategorie.buttonActiverCategorie);
			})

			test ('ListBox [EQUIPE] - Is Visible',async () => {
				await fonction.isDisplayed(pageCategorie.pPlistBoxEquipe);
				await fonction.clickElement(pageCategorie.pPlistBoxEquipe);
			})

			test ('CheckBox [EQUIPE] - Is Visible',async () => {
				await fonction.isDisplayed(pageCategorie.pPcheckBoxEquipe.first());
				await fonction.clickElement(pageCategorie.pPcheckBoxEquipe.nth(0));
				await fonction.clickElement(pageCategorie.pPCloseInputField);
			})

			test ('CheckBox [CHAMPS A AFFICHER] - Is Visible',async () => {
				await fonction.isDisplayed(pageCategorie.pPcheckBoxChampAff.first());
			})

			test ('InputField [CHAMPS A AFFICHER] - Is Visible',async () => {
				await fonction.wait(page,250);
				for(let i=0;i<=11;i++) {
					await fonction.clickElement(pageCategorie.pPcheckBoxChampAff.nth(i));
					await fonction.isDisplayed(pageCategorie.pPtextareaChampAff.nth(i));
				}
			})

			test ('Button [ENREGISTRER] - Is Visible',async () => {
				await fonction.isDisplayed(pageCategorie.pPbuttonEnregistrer);
			})

			test ('Button [ANNULER] - Click',async () => {
				await fonction.clickElement(pageCategorie.pPbuttonAnnuler);
			})

		})

		test.describe ('Popin  [MODIFIER]',async () => {

			test ('DataGrid [CHOIX CATEGORIE][0] - Click',async () => {
				await fonction.clickElement(pageCategorie.dataGridCheckBoxCategorieChoix.nth(0));
			})

			test ('Button [MODIFIER] - Click',async () => {
				await fonction.clickElement(pageCategorie.buttonModifierCategorie);
			})

			test ('InputField [DESIGNATION CATEGORIE] - Is Visible',async () => {
				await fonction.isDisplayed(pageCategorie.pPinputFieldDesignationCategorie);
			})

			test ('ListBox [EQUIPE] - Click',async () => {
				var isVisible = await pageCategorie.pPlistBoxEquipe.isVisible();
				if(isVisible){
				  await fonction.clickElement(pageCategorie.pPlistBoxEquipe);
				  await fonction.clickElement(pageCategorie.pPCloseInputField);
				}
				await fonction.wait(page, 1200);  // A cause de la transition CSS (0.2 s)
			})

			test ('CheckBox [CHAMPS A AFFICHER] - Is Visible',async () => {
				await fonction.isDisplayed(pageCategorie.pPcheckBoxChampAff.first());
			})

			test ('InputField [CHAMPS A AFFICHER] - Is Visible',async () => {
				var isVisible = await pageCategorie.pPcheckBoxCheckedChampAff.first().isVisible();
				if(isVisible){
					await fonction.isDisplayed(pageCategorie.pPtextareaChampAff.first());
				}
			})

			test ('Button [ENREGISTRER] - Is Visible',async () => {
				await fonction.isDisplayed(pageCategorie.pPbuttonEnregistrer);
			})

			test ('Button [ANNULER] - Is Visible',async () => {
				await fonction.isDisplayed(pageCategorie.pPbuttonAnnuler);
			})

			test ('Button [ANNULER] - Click',async () => {
				await fonction.clickElement(pageCategorie.pPbuttonAnnuler);
			})

			test ('Button [GERER LES ORIGINES] - Click',async () => {
				await fonction.clickElement(pageCategorie.buttonGererOrigine);
			})

		})
	
		test.describe ('Popin  [GERER LES ORIGINES] ', async () => {

			test ('InputField [DESIGNATION ORIGINE] - Is Visible', async () => {
				await fonction.isDisplayed(pageCategorie.pPinputFieldDesignationOrigine);
			})

			var sActiver='Activer le buton + '
			test ('InputField [DESIGNATION ORIGINE] = "' + sActiver + '"',async () => {
				await fonction.sendKeys(pageCategorie.pPinputFieldDesignationOrigine, sActiver, false, 'Designation origine');
			})

			test ('InputField [FILTRE ORIGINE] - Is Visible',async () => {
				await fonction.isDisplayed(pageCategorie.pPinputFiltreOrigine);
			})
			
			test ('Button [ENREGISTRER] - Is Visible',async () => {
				await fonction.isDisplayed(pageCategorie.pPbuttonEnregistrer);
			})

			test ('Button [ANNULER] - Is Visible',async () => {
				await fonction.isDisplayed(pageCategorie.pPbuttonAnnuler);
			})

			test ('Button [ANNULER] - Click',async () => {
				await fonction.clickElement(pageCategorie.pPbuttonAnnuler);
			})

		})

	})

	test.describe ('Page [ADMIN]', async () =>  {

		var sNomPage = 'admin';
		test ('Menu [' + sNomPage.toUpperCase() + '] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		test ('Button [DESACTIVER/REACTIVER ACCES APPLICATION] - Is Visible',async () => {
			await fonction.isDisplayed(pageAdmin.buttonActiverDesactiveAccesAppli);
		})

		test ('ListBox [CACHE] - Is Visible',async () => {
			await fonction.isDisplayed(pageAdmin.listBoxSelectCache);
		})

		test ('ListBox [SELECT OPTION] - Is Visible',async () =>{
			expect(await pageAdmin.listBoxSelectOpen.count()).toBeGreaterThanOrEqual(5);
		})

		test ('Button [SUPPRIMER] - Is Visible',async () => {
			await fonction.isDisplayed(pageAdmin.buttonSupprimerCache);
		})

		test ('Button [VOIR API AVEC SWAGGER] - Is Visible',async () => {
			await fonction.isDisplayed(pageAdmin.buttonVoirApiSwagger);
		})

	})

	test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})