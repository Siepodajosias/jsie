/**
 * @author Vazoumana DIARRASSOUBA
 * @since 2024-04-05
 *  
 */
const xRefTest      = "FAC_LIV_ECA";
const xDescription  = "Justifier les écarts de livraison";
const xIdTest       =  88;
const xVersion      = "3.3";
   
var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'FACTURATION',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [''],
	params      : ['rayon, groupeArticle, plateFormeDistribution','listeMagasins'],
	fileName    : __filename
};

import { test, type Page, expect }    from '@playwright/test';
import { Help }                       from '@helpers/helpers';
import { TestFunctions }              from '@helpers/functions';
import { Log }                        from '@helpers/log';

import { MenuFacturation }            from '@pom/FAC/menu.page';
import { LivraisonsEcartsLivraison }  from '@pom/FAC/livraisons_effectuees-ecarts_livraisons.page';

import { CartoucheInfo } 		      from '@commun/types/index';
//------------------------------------------------------------------------------------

let page                : Page;

var pageEcartsLivraison : LivraisonsEcartsLivraison;
var menu        	    : MenuFacturation;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
	page                = await browser.newPage();
	menu                = new MenuFacturation(page, fonction);    
	pageEcartsLivraison = new LivraisonsEcartsLivraison(page);
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------ 

fonction.importJdd();      // Récupération du JDD et des données du E2E en cours si ils existent
	
const sRayon               = fonction.getInitParam('rayon', 'Fruits et légumes');
const sGroupeArticle       = fonction.getInitParam('groupeArticle', 'Fruits et légumes');
var sPlateforme            = fonction.getInitParam('plateformeDistribution', 'Chaponnay');
var aListeMagasins         = fonction.getInitParam('listeMagasins','Bergerac,Bron' ); 
var aCodesArticlesE2E      = fonction.getInitParam('listeArticles', '5600,9200');

// Solution de contournement : lorsque la casse est différente d'une appli à une autre (Ex pour SugLog et Sudlog)
// Au final le problème reste sur Sudlog  ==> forcage
if (sPlateforme == 'SudLog 10°') { 
	sPlateforme = 'Sudlog 10°';
}

// La chaîne de la liste des magasins doit être transformée en tableau pour pouvoir être traitée.
aCodesArticlesE2E = aCodesArticlesE2E.split(',');


//const sCodeArtAjout = '5300'    L'ajout d'article sera traité ultérieurement
const sSelection = sRayon + ' - ' + sGroupeArticle;
//const aCodesArtAJustifier = [aCodesArticlesE2E[0],aCodesArticlesE2E[1],sCodeArtAjout];
var aCodesArtAJustifier = [];
if (aCodesArticlesE2E[0] != "") {
	aCodesArtAJustifier = [aCodesArticlesE2E[0],aCodesArticlesE2E[1]];
}
//const aJustification = ["Perte plateforme","Gain plateforme","Erreur non justifiée"];
const aJustification = ["Perte plateforme","Gain plateforme"];

//------------------------------------------------------------------------------------ 

test.describe.serial ('[' + xRefTest + ']', () => {
	
	test ('-- Start --', async ({ context }, testInfo) => {
		await context.clearCookies();
		const helper    = new Help(info, testInfo, page);
		await helper.init();
	});

	test ('Ouverture URL', async () => {
		await fonction.openUrl(page);
	});

	test ('Connexion', async() => {
		await fonction.connexion(page);
	})

	test.describe ('Page [ACCUEIL]', function() {  

		test ('Popin [ALERT][ACCUEIL] - Click', async () => {
			await fonction.isErrorDisplayed(false, page);                             // Pas d'erreur affichée à priori au chargement de l'onglet
		});

		test ('ListBox [RAYON - GPE ART] = "' + sSelection + '"', async () => {            
			await menu.selectRayonGroupeArticle(sRayon, sGroupeArticle, page);       // Sélection du rayon passé en paramètre
		})     
		test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {            
			await menu.selectPlateformeByLabel(sPlateforme, page);                  // Sélection de la plateforme passée en paramètre
		})     

	})  //-- End Describe Page

	test.describe ('Page [LIV EFFECTUEES]', function() {    

		var sCurrentPage = 'livEffectuees';

		test ('Page [LIV EFFECTUEES] - Click', async () => {
			await menu.click(sCurrentPage, page);
		})
	 
		test ('CheckBox [MASQUER LES ARTICLES AVEC DE PETITS ECARTS NEGATIFS] - Click', async () => {
			await fonction.wait(page, 500);
			var checBox = await pageEcartsLivraison.checkBoxEcartNegatifs.isChecked();
			if (checBox){
				await fonction.clickElement(pageEcartsLivraison.checkBoxEcartNegatifs);
			}
		})

		if (aCodesArtAJustifier.length != 0) {    // Cas du E2E 
			
			aCodesArtAJustifier.forEach(function(sCodesArtAJustifier,iIndexLigneArticle) {

			// des écarts ont été générés lors des CR magasins sur les 2 premiers articles du JDD E2E
			// article 0 = Ecart négatif
				test.describe ('Justifier article '+ sCodesArtAJustifier, () => {  
				
					test ('Filtre [ARTICLE EN ECART] code article ='+ sCodesArtAJustifier, async () => {
						if (iIndexLigneArticle > 0){

							await fonction.clickAndWait(pageEcartsLivraison.dataGridListeEcartsArtCodeA.nth(0), page);  //désélection de l'article précédent
						}
						await fonction.sendKeys(pageEcartsLivraison.inputSearchCodeArticle, sCodesArtAJustifier, false, 'Code Article à Justifier');
						await fonction.wait(page, 500);
					})

					test ('Articles en écart [CHECKBOX] first - Click ', async () => {
						await fonction.clickAndWait(pageEcartsLivraison.dataGridListeEcartsArtCodeA.nth(0), page);
					})
					
					aListeMagasins.forEach(async (sNomVille:string, index:number) => {                  //je vérifie qu'on a bien un écart pour chaque ville du JDD

						test ('Datagrid [ECARTS CONSTATES]['+ index +'] - Click 1 : magasin = "' + sNomVille + '"', async () => {        

							await fonction.addDataSheet('CheckBox', 'Lieu de Vente', sNomVille);

							var iNbEcart = await pageEcartsLivraison.dataGridListeEcartsConMag.count();
							var aTextes  = await pageEcartsLivraison.dataGridListeEcartsConMag.allTextContents();
							for(let iIndex = 0; iIndex < iNbEcart; iIndex++){

								var sTexte = aTextes[iIndex];
								if(sTexte === sNomVille){

									await fonction.clickAndWait(pageEcartsLivraison.dataGridListeEcartsConMag.nth(iIndex), page);
									break;
								}
							}
						}) 

						test ('Button [REPORTER]['+ index +'] - clickable', async () => { 
							var btnReportIsEnable =  await pageEcartsLivraison.buttonReporterJustification.isEnabled();
							expect(btnReportIsEnable).toBe(true);
						})

						test ('Button [JUSTIFIER]['+ index +'] - clickable', async () => {
							var btnJustEcartIsEnable = await pageEcartsLivraison.buttonJustifierEcarts.isEnabled();
							expect(btnJustEcartIsEnable).toBe(true);
						})

						test ('Button [MODIFIER]['+ index +'] - clickable', async () => {
							var btnModifierIsEnable = await pageEcartsLivraison.buttonModifier.isEnabled();
							expect(btnModifierIsEnable).toBe(true);
						})

						test ('Button [REFUSER]['+ index +'] - clickable', async () => {
							var btnRefuserIsEnable = await pageEcartsLivraison.buttonRefuserEcarts.isEnabled();
							expect(btnRefuserIsEnable).toBe(true);
						})

						test ('ListBox [MOTIF JUSTIFICATION]['+ index +'] = '+ aJustification[iIndexLigneArticle], async () => {           
						   await pageEcartsLivraison.listeBoxEcartsConMotif.selectOption({label:aJustification[iIndexLigneArticle]});
						   await fonction.addDataSheet('ListBox','Motif de Justification', aJustification[iIndexLigneArticle]);
						}) 

						test ('Button [JUSTIFIER ECART]['+ index +']- Click', async () => {         
							await fonction.clickElement(pageEcartsLivraison.buttonJustifierEcarts); 			
						}) 

						// Après avoir cliqué sur le bouton "justifier ecart" Il faut à nouveau faire un click sur la même ligne pour la décocher avant de passer à la suivante
						test ('Datagrid [ECARTS CONSTATES]['+ index +'] - Click 2 : magasin = "' + sNomVille + '"', async () => {        
							var iNbEcart = await pageEcartsLivraison.dataGridListeEcartsConMag.count();
							var aTextes  = await pageEcartsLivraison.dataGridListeEcartsConMag.allTextContents();
							for(let iIndex = 0; iIndex < iNbEcart; iIndex++){

								var sTexte = aTextes[iIndex];
								if(sTexte === sNomVille){
									await fonction.clickAndWait(pageEcartsLivraison.dataGridListeEcartsConMag.nth(iIndex), page);
									break;
								}
							}
						}) 

					}); //-- End ForEach    
					
					test ('Check [ECARTS CONSTATES] : tous les magasins justifiés avec le meme motif', async () => {         
						var iNbMag   = await pageEcartsLivraison.dataGridListeEcartsConMag.count();
						var iNbIcoOk = await pageEcartsLivraison.dataGridListeEcartsConIcoOk.count();
						expect(iNbIcoOk).toBe(iNbMag);
							
						var elem     = pageEcartsLivraison.dataGridListeEcartsConMotif.filter({hasText: aJustification[iIndexLigneArticle]});
						var iNbMotif = await elem.count();
						expect(iNbMotif).toBe(iNbMag);                 
					}) 

					test ('Check [ARTICLES EN ECART] : écart traité', async () => {
						await pageEcartsLivraison.dataGridListeEcartsArtIcoOk.nth(0).isVisible();
						log.set('Ecarts traités pour article '+ sCodesArtAJustifier); 
					})
				})
			})  
		} else {
			log.set('Execution hors E2E : aucun traitement'); 
		}

	})  //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})