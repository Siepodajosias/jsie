/**
 * 
 * PRICING APPLICATION
 * 
 * @author Vazoumana Diarrassouba
 * @since 2023/09/29
 * 
 */

const xRefTest      = "REP_IHM_GLB";
const xDescription  = "Examen de l'IHM Répartition";
const xIdTest       =  360;
const xVersion      = '3.13';

var isPending       = false
var currentDate     = new Date();

var info            = {
	desc        : xDescription,
	appli       : 'REPARTITION',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['plateformeReception','rayon'],
	fileName    : __filename
}

//------------------------------------------------------------------------------------

import { test, type Page, expect }           from '@playwright/test';

import { Help }                              from '@helpers/helpers';
import { TestFunctions }                     from '@helpers/functions';
import { Log }                               from '@helpers/log';

import { MenuRepartition }                   from '@pom/REP/menu.page';

import { Accueil }                          from '@pom/REP/accueil.page';

import { LotsPage }                          from '@pom/REP/lots.page';

import { ArticlesArticlesPage }              from '@pom/REP/articles-articles.page';
import { ArticlesConsignesRepartitionPage }  from '@pom/REP/articles-consignes_repartition.page';
import { ArticleRepartitionEnErreurPage }    from '@pom/REP/articles-repartitions_erreur.page';
import { ArticleMoyennePage }                from '@pom/REP/articles-moyennes.page';

import { RepartitionPage }                   from '@pom/REP/repartition.page';


import { OrdRepAEnvoyerPage }                from '@pom/REP/ordres-a_envoyer.page';
import { OrdRepEnvoyesPage }                 from '@pom/REP/ordres-envoyes.page';
import { OrdRepAnnulesPage }                 from '@pom/REP/ordres-annules.page';

import { RefGroupesMagasinPage }             from '@pom/REP/referentiel-groupes_magasins.page';
import { RefExceptionRepartitionAutoPage }   from '@pom/REP/referentiel-exception_repartition.page';
import { RefRepartitionAutoPage }            from '@pom/REP/referentiel-repartition_automatique.page';
import { AdminVerrousPage       }            from '@pom/REP/admin-verrous.page';

//------------------------------------------------------------------------------------

let page                              : Page;

let menuPage                          : MenuRepartition;

let pageAccueil                       : Accueil;

let pageLots                          : LotsPage;

let pageArticlesArticles              : ArticlesArticlesPage;
let pageArticlesConsignesRepartition  : ArticlesConsignesRepartitionPage;
let pageArticleRepartEnErreur         : ArticleRepartitionEnErreurPage;
let pageArticleMoyennes               : ArticleMoyennePage;

let pageRepartition                   : RepartitionPage;

let pageOrdRepEnvoyer                 : OrdRepAEnvoyerPage;
let pageOrdRepEnvoyes                 : OrdRepEnvoyesPage;
let pageOrdRepAnnules                 : OrdRepAnnulesPage;

let pageRefGroupesMagasin             : RefGroupesMagasinPage;
let pageRefExceptionRepartitionAuto   : RefExceptionRepartitionAutoPage;
let pageRefRepartitionAuto            : RefRepartitionAutoPage;
let pageAdminVerrous                  : AdminVerrousPage;

let log                               : Log;
const fonction                        = new TestFunctions(log);

//------------------------------------------------------------------------------------
fonction.recordDatas(false);		//-- Inutile de créer une fiche de données

const sPlateforme                     = fonction.getInitParam('plateformeReception','Chaponnay');
const sRayon                          = fonction.getInitParam('rayon','Fruits et légumes');  
//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {

	page                               = await browser.newPage();

	menuPage                           = new MenuRepartition(page, fonction);
    log                                = new Log();

	pageRepartition                    = new RepartitionPage(page);
	pageLots                           = new LotsPage(page);
	pageAccueil                        = new Accueil(page);
	pageArticlesArticles               = new ArticlesArticlesPage(page);
	pageArticlesConsignesRepartition   = new ArticlesConsignesRepartitionPage(page);
	pageArticleRepartEnErreur          = new ArticleRepartitionEnErreurPage(page);
	pageArticleMoyennes                = new ArticleMoyennePage(page);
	pageOrdRepEnvoyer                  = new OrdRepAEnvoyerPage(page);
	pageOrdRepEnvoyes                  = new OrdRepEnvoyesPage(page);
	pageOrdRepAnnules                  = new OrdRepAnnulesPage(page);
	pageRefGroupesMagasin              = new RefGroupesMagasinPage(page);
	pageRefExceptionRepartitionAuto    = new RefExceptionRepartitionAutoPage(page);
	pageRefRepartitionAuto             = new RefRepartitionAutoPage(page);
	pageAdminVerrous                   = new AdminVerrousPage(page);

	const helper                       = new Help(info, testInfo, page);
	await helper.init();

})

//------------------------------------------------------------------------------------

test.beforeEach(async ({}, testInfo) => {
	await fonction.trace(testInfo);
	await fonction.checkConsole(page, testInfo, false);
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

	test.describe ('Page [ACCUEIL]', async() => {

		test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {            
			await menuPage.selectPlateforme(sPlateforme, page);                     // Sélection d'une plateforme par défaut
		})

		test ('ListBox [RAYON] = "' + sRayon + '"', async () => {            
			await menuPage.selectRayon(sRayon, page, 60000);                              // Sélection du rayon
		})

		test ('** Wait Until Spinner Off **', async () => {
			await fonction.waitForSpinner(pageAccueil.spinner);
		});

		test (' DataGrid [RECAPITULATIF] - Check', async () => {
			var oDataGrid = {
				element     : pageAccueil.dataGridHeaders,    
				desc        : 'RECAPITULATIF',
				verbose     : false, 
				column      : [
					'Résumé journée',
					'Commandes magasins', 
					'Achetés fournisseurs',
					'A répartir',
					'Agréés',
					'En cours de répartition',
					'Répartis',
					'En cours de préparation',
					'Préparés',       
				]
			}
			await fonction.dataGridHeaders(oDataGrid);
		})

	})  //-- End describe Page

	test.describe ('** Check Statut répartition **', async () => {

		test ('Page [REPARTITION] - Click', async () => {
			await menuPage.click('repartition', page);
		})

		test ('***', () => {
			if (!pageRepartition.linkSelectArticle) {
				isPending = true;
			}
		})
	})  //-- End describe Page

	test.describe ('Page [LOTS]', async () => {

		test ('Page [LOTS] - Click', async () => {
			await menuPage.click('lots', page); 
		})

		test ('Label [ERROR] -  Is Not Visible', async () => {
			await fonction.isErrorDisplayed(false, page);
		})

		test ('Select [STATUT LOT] - Click', async () =>  {
			await pageLots.selectStatutLot.selectOption({label:'A répartir'});
			await fonction.waitTillHTMLRendered(page, 30000, false);
		}) 

		test ('InputField [LOTS] - Is Visible', async () => {
			await fonction.isDisplayed(pageLots.inputFieldLots);
		}) 
	
		test ('Button [SCINDER] - Is Visible', async () => {
			await fonction.isDisplayed(pageLots.buttonScinder); 
		})

		test ('Button [ANNULER SCISSION] - Is Visible', async () => {
			await fonction.isDisplayed(pageLots.buttonAnnulerScission);
		})       
		
		test ('Button [AFFICHER ARBORESCENCE]- Is Visible', async () => {
			await fonction.isDisplayed(pageLots.buttonArborescence);
		})       

		test ('DataGrid [LOTS] - Check', async () => {
			var aCheckTable = {
				element  : pageLots.dataGridHeaders,
				desc     : 'LOTS',
				verbose  : false,
				column   : [
					'0',
					'N° de lot',
					'Famille',
					'Code article',
					'Désignation article',
					'Poids moyen colis',
					'Fournisseur',
					'Date de création',
					'Acheteur',
					'Date d\'arrivage',
					'DLC',
					'Ech.',
					'Arrivé',
					'Agréage',
					'Statut',
					'Prix revient',
					'Quantité',
					'Actions',
				]
			}
			await fonction.dataGridHeaders(aCheckTable);
		})
				
		test ('CheckBox [ARTICLE][0] - Click', async () =>  {
			await fonction.clickElement(pageLots.checkBoxLots.nth(0));
		})        

		test.describe ('Popin [SCISSION LOT]', async () =>  {
		   
			test ('Button [SCINDER] - Click', async () =>  {
			   await fonction.clickAndWait(pageLots.buttonScinder, page);
			}) 

			test ('Popin [SCISSION LOT] - Is Visible', async () => {
				await fonction.popinVisible(page, "scisison lot");
			})

			test ('Label [ERROR] -  Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			})
		
			test ('Button [SCINDER] - Is Visible', async () => {
				await fonction.isDisplayed(pageLots.pButtonScinder); 
			})
			
			test ('Button [VIDER] - Is Visible', async () => {
				await fonction.isDisplayed(pageLots.pButtonVider);
			})             
			
			test ('Button [ANNULER] - Is Visible', async () => {
				await fonction.isDisplayed(pageLots.pButtonAnnuler);
			})
			
			test ('Button [PLUS] - Is Visible', async () => {
				await fonction.isDisplayed(pageLots.pButtonPlus);
			})
		
			test ('DataGrid [LISTE LOTS] - Check', async () => {
				var oDataGrid = {
					element     : pageLots.pDataGridListeLots,    
					desc        : 'LISTE LOTS',
					verbose     : false, 
					column      :   [
						'N° de lot',
						'Famille',
						'Code article',
						'Article',
						'Quantité',
						'Famille',
						'Article',
						'Quantité',
					]
				}
				await fonction.dataGridHeaders(oDataGrid);
			})

			test ('DataGrid [FAMILLE] - Check', async () => {
				var oDataGrid = {
					element     : pageLots.pDataGridListeLignes,    
					desc        : 'FAMILLE',
					verbose     : false, 
					column      : [
						'Famille',
						'Article',
						'Quantité',
					]
				}
				await fonction.dataGridHeaders(oDataGrid);   
			})                    
									
			test ('Button [ANNULER] - Click', async () =>  {
				await fonction.clickElement(pageLots.pButtonAnnuler);
			})                

			test ('Popin [SCISSION LOT] - Is Not Visible', async () => {
				await fonction.popinVisible(page, "scisison lot", false);   
			})   

		})  // End describe Popin  

	})//End describe Page

	test.describe ('Page [ARTICLES]', async () => {  

		var sCurrentPage = 'articles';

		test ('Page [ARTICLES] - Click ', async () => {
			await menuPage.click(sCurrentPage, page);
		})
		
		test ('Label [ERROR] -  Is Not Visible', async () =>{
			await fonction.isErrorDisplayed(false, page);
		})                              
	
		test.describe ('Onglet [ARTICLES]', async () => {

			test ('Onglet [ARTICLES] - Click', async () => {
				await menuPage.clickOnglet(sCurrentPage, 'articles', page);
			})

			test ('Label [ERROR] -  Is Not Visible', async () =>{
				await fonction.isErrorDisplayed(false, page);
			})  
			
			test ('InputField [Articles] - Is Visible', async () => {
				await fonction.isDisplayed(pageArticlesArticles.inputFieldCodeArticle);   
			})
			
			test ('ListBox [GROUPE ARTICLE] - Is Visible', async () => {
				await fonction.isDisplayed(pageArticlesArticles.groupeArticleListBox);    
			})             
			
			test ('CheckBox [TOUS ARTICLES] - Is Visible', async () => {
				await fonction.isDisplayed(pageArticlesArticles.checkBoxTousArticle);   
			})         
			
			test ('Button [MOYENNE] - Is Visible', async () => {
				await fonction.isDisplayed(pageArticlesArticles.buttonMoyenne);   
			})            
			
			test ('Button [REPARTIR] - Is Visible', async () => {
				await fonction.isDisplayed(pageArticlesArticles.buttonRepartir);     
			})
			
			test ('Button [ENREGISTRER]  - Is Visible', async () => {
				await fonction.isDisplayed(pageArticlesArticles.buttonEnregistrer);
			})
		
			test ('Button [CLOTURER] - Is Visible', async () => {
				await fonction.isDisplayed(pageArticlesArticles.buttonCloturer);      
			})
			
			test ('DatePicker [JOURNEE EXPEDITION] - Is Visible', async () => {
				await fonction.isDisplayed(pageArticlesArticles.dateDatePicker);   
			})                      
							  
			test ('Button [REPARTITION AUTOMATIQUE] - Is Visible', async () => {
				await fonction.isDisplayed(pageArticlesArticles.buttonRepartitionAuto); 
			})
				  
			test ('DataGrid [ARTICLES] - Check', async () => {
				var aCheckTable = {
					element     : pageArticlesArticles.dataGridHeaders,
					desc        : 'ARTICLES',
					verbose     : false, 
					column      : [
						'0',
						'Code',
						'Désignation',
						'',
						'Stock',
						'Quantité agréée',
						'Commandé magasins',
						'Achats',
						'Réparti',
						'Reste à répartir',
						'Statut Répartition',
						'Statut Préparation',
						'Nb lots à rep.',
						'',
						'Consigne',
						'Commentaire',
						'Actions'
					]
				}
				await fonction.dataGridHeaders(aCheckTable);                                     
			})

		}) //-- End describe Onglet

		test.describe ('Onglet [CONSIGNES DE REPARTITION]', async () => {

			test ('Onglet [CONSIGNES DE REPARTITION] - Click', async () => {
				await menuPage.clickOnglet(sCurrentPage, 'consignes', page);
			})

			test ('Label [ERROR] -  Is Not Visible', async () =>{
				await fonction.isErrorDisplayed(false, page);
			})   

			test ('InputField [CONSIGNES] - Is Visible', async () => {
				await fonction.isDisplayed(pageArticlesConsignesRepartition.inputFieldConsignes);        
			})
		   
			test ('Button [MODIFIER CONSIGNE] - Is Visible', async () => {
				await fonction.isDisplayed(pageArticlesConsignesRepartition.buttonEditInstruction);        
			})
			
			test ('Button [SAISIR CONSIGNE] - Is Visible', async () => {
				await fonction.isDisplayed(pageArticlesConsignesRepartition.buttonCreateInstruction);          
			})

			test ('DataGrid [CONSIGNES] - Check', async () => {
				var aCheckTable = {
					element     : pageArticlesConsignesRepartition.dataGridHeaders,
					desc        : 'CONSIGNES',
					verbose     : false, 
					column      : [
						"Code",
						"Famille",
						"Désignation",
						"Consigne",
						"Date de début",
						"Date de fin",
						"Actions" 
					]
				}       
				await fonction.dataGridHeaders(aCheckTable);       
			})             

			test.describe ('Popin [SAISIE DE CONSIGNE ARTICLE]', async () => {

				test ('Button [SAISIR UNE CONSIGNE] - Click', async () => {
					await fonction.clickAndWait( pageArticlesConsignesRepartition.buttonCreateInstruction, page);
				}) 
	
				test ('Popin [SAISIE DE CONSIGNE ARTICLE] - Is Visible ', async () => {
					await fonction.popinVisible(page, "saisie de consigne article");
				})
			   
				test ('Label [ERROR] -  Is Not Visible', async () =>{
					await fonction.isErrorDisplayed(false, page);
				}) 
   
				test ('Button [VALIDER] - Is Visible', async () => {
					await fonction.isDisplayed(pageArticlesConsignesRepartition.pButtonValider);         
				})
				
				test ('Button [ANNULER] - Is Visible', async () => {
					await fonction.isDisplayed(pageArticlesConsignesRepartition.pButtonAnnuler);    
				})            
			   
				test ('InputField [ARTICLE] - Is Visible', async () => {
					await fonction.isDisplayed(pageArticlesConsignesRepartition.pInputArticle);   
				})
			
				test ('InputField [DEBUT DE L\'APPLICATION] - Is Visible', async () => {
					await fonction.isDisplayed(pageArticlesConsignesRepartition.pInputValiditeDebut);     
				})
		 
				test ('InputField [FIN DE L\'APPLICATION] - Is Visible', async () => {
					await fonction.isDisplayed(pageArticlesConsignesRepartition.pInputValiditeFin); 
				})
		  
				test ('TextArea [CONSIGNE] - Is Visible', async () => {
					await fonction.isDisplayed(pageArticlesConsignesRepartition.pTextAreaConsigne); 
				})
																					
				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickElement(pageArticlesConsignesRepartition.pButtonAnnuler);
				})                

				test ('Popin [SAISIE DE CONSIGNE ARTICLE] - Is Not Visible ', async () => {
					await fonction.popinVisible(page, "saisie de consigne article", false); 
				})

			})  // End describe Popin  

		})  //-- End describe Onglet

		test.describe ('Onglet [REPARTITION EN ERREUR]', async () => {
				
			test ('Onglet [REPARTITION EN ERREUR] - Click', async () => {
				await menuPage.clickOnglet(sCurrentPage, 'repartition', page);
			})

			test ('Label [ERROR] -  Is Not Visible', async () =>{
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('DataGrid [REPARTITION EN ERREUR] - Check', async () => {
				var aCheckTable = {
					element     : pageArticleRepartEnErreur.dataGridHeaders,
					desc        : 'REPARTITION EN ERREUR',
					verbose     : false, 
					column      : [
						"Numéro de lot",
						"Code article",
						"Désignation article",
						"Actions" 
					]
				}    
				await fonction.dataGridHeaders(aCheckTable);
			})

		})  //-- End describe Onglet    

		test.describe ('Onglet [MOYENNES]', async () =>{

			test ('Onglet [MOYENNES] - Click', async () => {
				await menuPage.clickOnglet(sCurrentPage, 'moyennes', page);
			})
		
			test ('Label [ERROR] -  Is Not Visible', async () =>{
				await fonction.isErrorDisplayed(false, page);
			})     

			if (isPending == false) {

				test ('Link [LISTE DES ARTICLES] - Is Visible', async () => {
					await fonction.isDisplayed(pageArticleMoyennes.linkSelectArticle);
				})

			} else {

				test ('DataGrid [MOYENNES] - Check', async () => {
					var aCheckTable = {
						element     : pageArticleMoyennes.headerMoyenneList,
						desc        : 'MOYENNES',
						verbose     : false, 
						column      : [
							'0',
							'Numéro de lot',
							'Plateforme',
							'Fournisseur',
							'Date arrivage',
							'Quantité',
							'Prix de revient',
							'Moyenne',
						]
					}               
					await fonction.dataGridHeaders(aCheckTable);
				})          

				// Test.countDisplayedElements('Boutton [AFFECTER A]', pageArticleMoyennes.buttonsAffecterA, 6);
				// Test.countDisplayedElements('TexteArea [COMMENTAIRES]', pageArticleMoyennes.textareaCommentaire, 6); 
			}
			
		}) //-- End describe Onglet

	}) //-- End describe Page
	
	test.describe ('Page [REPARTITION]', async () => { 

		test ('Page [REPARTITION] - Click', async () => {
			await menuPage.click('repartition', page)           
		})
	   
		test ('Label [ERROR] -  Is Not Visible', async () =>{
			await fonction.isErrorDisplayed(false, page);
		})              

		if (isPending == false) {   // Auncune répartition en cours
			
			test ('Link [LISTE DES ARTICLES] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.linkSelectArticle.nth(0))       
			})

		} else {

			test ('Label [INFOS ARTICLE] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.infosRepartArticle);         
			})
			
			test ('Label [SOMMES] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.infosRepartSomme);         
			})
			
			test ('DataGrid [LISTE DES LOTS A REPARTIR] - Check', async () => {
				var aCheckTable = {
					element     : pageRepartition.headerLotsList,
					desc        : 'LISTE DES LOTS A REPARTIR',
					verbose     : false, 
					column      : [
						'0',
						'Cs',
						'N° lot',
						'Fournisseur',
						'Statut',
						'Arrivage du',
						'Origine',
						'Prov.',
						'Dispo',
						'Prix de revient',
						'Moy.',
						'Poids réel colis',
						'A répartir',
						'Réparti',
						'Reste à répartir',
						'Actions',
					]
				} 
				await fonction.dataGridHeaders(aCheckTable);                  
			})    

			test ('DataGrid [LISTE DES LOTS A VALIDER] - Check', async () => {
				var aCheckTable = {
					element     : pageRepartition.headerLotsValides,
					desc        : 'LISTE DES LOTS A VALIDER',
					verbose     : false, 
					column      : [
						'Cs',
						'N° lot',
						'Fournisseur',
						'Statut',
						'Arrivage du',
						'Origine',
						'Prov.',
						'Prix de revient',
						'Moy.',
						'Poids réel colis',
						'A répartir',
						'Réparti',
						'Reste à répartir',
						'Actions',
					]
				}  
				await fonction.dataGridHeaders(aCheckTable);    
			})

			test ('Input [FILTRE MAGASIN] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.inputFilter);       
			})
		   
			test ('Checkbox [MAGASIN] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.checkBoxMagasin);        
			})
		   
			test ('Checkbox [REGION] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.checkBoxRegion);         
			})
			  
			test ('Checkbox [SECTEUR] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.checkBoxSecteur);         
			})        
			
			test ('CheckBox [LOT] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.checkBoxLot);        
			})
		  
			test ('Button [CHANGER PREVISION] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.buttonChangerPrev);       
			})
		   
			test ('DatePicker [DATE COMMANDE] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.datePickerCommande);        
			})
		   
			test ('Button [CHANGER MODE DE REPARTITION] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.buttonChangerRepart);        
			})
		   
			test ('Button [AJOUTER LIGNE MAGASIN] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.buttonAddLigneMagasin);         
			})
		   
			test ('Button [MASQUER MAGASINS SERVIS] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.buttonMasquerMagasinServis);       
			})           
			
			test ('Buttons [FILTRE PAYS FRANCE] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.buttonsFiltrePaysFrance);        
			})
		   
			test ('Buttons [FILTRE PAYS ITALIE] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.buttonsFiltrePaysItalie);        
			})
		   
			test ('Buttons [FILTRE PAYS BELGIQUE] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.buttonsFiltrePaysBelgique);        
			})
			
			test ('DataGrid [LISTE DES MAGASINS] - Check', async () => {
				var aCheckTable = {
					element     : pageRepartition.headerlistMag,
					desc        : 'LISTE DES MAGASINS',
					verbose     : false, 
					column      : [
						'',
						'',
						'Prio.',
						'Ordre',
						'Magasin',
						'Straté-gie',
						'E/N',
						'Promo',
						'Prév. J+1',
						'Stock',
						`Com.  ${(currentDate.getDate())-1} '/' ${currentDate.getMonth()}`,
						'Rép.',
						'+/-',
						'Solde',
						'Lot',
						'Actions',
					]
				}  
				await fonction.dataGridHeaders(aCheckTable);       
			})
					
			test ('Input [REPARTITION DU VOLUME] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.inputRepartitionVolume);       
			})
		   
			test ('Input [REPARTIR NB COLIS PAR MAGASIN] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.inputQteColisRepartir);       
			})

			test ('Button [REPARTIR EN UNE FOIS] - Check Text Content', async () => {
				var text = await pageRepartition.buttonRepartirEnUneFois.textContent();
				expect(text).toBe('Répartir en une fois'); 
			})

			test ('Button [EFFACER] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.buttonEffacer);        
			})
		   
			test ('Button [VALIDER LE(S) LOT(S)] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.buttonValiderRepart);          
			})
			
			test ('Button [TERMINER] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.buttonTerminerRepart);        
			})
			
			test ('Button [SAUVEGARDER] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.buttonSauvegarderRepart);       
			})
		   
			test ('Button [REVENIR] - Is Visible', async () => {
				await fonction.isDisplayed(pageRepartition.buttonRevenir);        
			})

		} //-- fin de si isPending

	})  //-- End describe Page
	
	test.describe ('Page [ORDRES REPARTITION]', async () => {    

		var sCurrentPage = 'ordres';

		test ('Page [ORDRES REPARTITION] - Click', async () => {
			await menuPage.click(sCurrentPage, page);
		})

		test ('Label [ERROR] -  Is Not Visible', async () => {
			await fonction.isErrorDisplayed(false, page);
		})                         

		test.describe ('Onglet [A ENVOYER]', async ()  => {

			test ('Onglet [A ENVOYER] - Click', async ()  => {
				await menuPage.clickOnglet(sCurrentPage, 'a_envoyer', page);
			})

			test ('Label [ERROR] -  Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			}) 

			test ('Input [FILTRE] - Is Visible', async () => {
				await fonction.isDisplayed(pageOrdRepEnvoyer.inputFiltre);
			})
		
			test ('Checkbox [LOT] - Is Visible', async () => {
				await fonction.isDisplayed(pageOrdRepEnvoyer.checkBoxLot);
			})
		 
			test ('Checkbox [ARTICLE] - Is Visible', async () => {
				await fonction.isDisplayed(pageOrdRepEnvoyer.checkboxArticle);
			})
	   
			test ('Checkbox [FOURNISSEUR] - Is Visible', async () => {
				await fonction.isDisplayed(pageOrdRepEnvoyer.checkboxFournisseur);
			})
		   
			test ('DataGrid [ORDRES] - Check', async () => {
				var aCheckTable = {
					element     : pageOrdRepEnvoyer.headerList,
					desc        : 'ORDRES',
					verbose     : false, 
					column      : [
						'0',
						'N° de lot',
						'Famille',
						'Code',
						'Désignation',
						'Fournisseur',
						'Origine',
						'Quantité reçue et agréée suffisante',
						'Fusionnable',
						'N° achat',
						'Achat auto. préparé',
						'Actions',
					]
				}        
				await fonction.dataGridHeaders(aCheckTable);
			})
	  
			test ('Button [ENVOYER SANS FUSIONNER] - Is Visible', async () => {
				await fonction.isDisplayed(pageOrdRepEnvoyer .buttonEnvoyerSansFusionner);
			})
	 
			test ('Button [FUSIONNER ET ENVOYER] - Is Visible', async () => {
				await fonction.isDisplayed(pageOrdRepEnvoyer.buttonFusionnerEtEnvoyer);
			})
	  
			test ('Button [ANNULER] - Is Visible', async () => {
				await fonction.isDisplayed(pageOrdRepEnvoyer.buttonAnnuler);
			})

		})  //-- End describe Onglet

		test.describe ('Onglet [ENVOYES]', async () => {

			test ('Onglet [ENVOYES] - Click', async () => {
				await menuPage.clickOnglet(sCurrentPage, 'envoyes', page);
			})

			test ('Label [ERROR] -  Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			})                      

			test ('Input [FILTRE] - Is Visible', async () => {
				await fonction.isDisplayed(pageOrdRepEnvoyes.inputFiltre);
			})
		
			test ('Checkbox [ORDRE] - Is Visible', async () => {
				await fonction.isDisplayed(pageOrdRepEnvoyes.checkboxOrdre);
			})    
		  
			test ('Checkbox [LOT] - Is Visible', async () => {
				await fonction.isDisplayed(pageOrdRepEnvoyes.checkBoxLot);
			})
	   
			test ('Checkbox [ARTICLE] - Is Visible', async () => {
				await fonction.isDisplayed(pageOrdRepEnvoyes.checkboxArticle); 
			})
		   
			test ('Checkbox [FOURNISSEUR] - Is Visible', async () => {
				await fonction.isDisplayed(pageOrdRepEnvoyes.checkboxFournisseur);
			})
			
			test ('Text [LEGENDE] - Is Visible', async () => {
				await fonction.isDisplayed(pageOrdRepEnvoyes.textLegend);
			})

			test ('DataGrid [ORDRES ENVOYES] - Check', async () => {
				var aCheckTable = {
					element     : pageOrdRepEnvoyes.headerList,
					desc        : 'ORDRES ENVOYES',
					verbose     : false, 
					column      : [
						'0',
						'N° d\'Ordre',
						'N° de lot',
						'Famille',
						'Code',
						'Désignation',
						'Fournisseur',
						'Origine',
						'Statut Préparation',
						'N° achat',
						'Achat auto. préparé',
						'Actions',
					]
				}       
				await fonction.dataGridHeaders(aCheckTable);
			})

			test ('Button [ANNULES] - Is Visible', async () => {
				await fonction.isDisplayed(pageOrdRepEnvoyes.buttonAnnuler);
			})    

		}) //-- End describe Onglet
			
		test.describe ('Onglet [ANNULES]', async () => {

			test ('Onglet [ANNULES] - Click', async () => {
				await menuPage.clickOnglet(sCurrentPage, 'annules', page);
			})
			
			test ('Label [ERROR] -  Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			})                           

			test ('Input [FILTRE] - Is Visible', async () => {
				await fonction.isDisplayed(pageOrdRepAnnules.inputFiltre);  
			})
			
			test ('Checkbox [ORDRE] - Is Visible', async () => {
				await fonction.isDisplayed(pageOrdRepAnnules.checkboxOrdre);
			})  
		 
			test ('Checkbox [LOT] - Is Visible', async () => {
				await fonction.isDisplayed(pageOrdRepAnnules.checkBoxLot);
			})
		   
			test ('Checkbox [ARTICLE] - Is Visible', async () => {
				await fonction.isDisplayed(pageOrdRepAnnules.checkboxArticle);
			})
		  
			test ('Checkbox [FOURNISSEUR] - Is Visible', async () => {
				await fonction.isDisplayed(pageOrdRepAnnules.checkboxFournisseur);
			})
		   
			test ('Text [LEGENDE] - Is Visible', async () => {
				await fonction.isDisplayed(pageOrdRepAnnules.textLegend);
			})
		  
			test ('DataGrid [ORDRES ANNULES] - Check', async () => {
				var aCheckTable = {
					element     : pageOrdRepAnnules.headerList,
					desc        : 'ORDRES ANNULES',
					verbose     : false, 
					column      : [
						"N° d'Ordre",
						"N° de lot",
						"Famille",
						"Code",
						"Désignation",
						"Fournisseur",
						"Origine",
						"Annulé par",
						"Heure d'annulation" 
					]
				}
				await fonction.dataGridHeaders(aCheckTable);
			})

		}) //-- End describe Onglet

	}) //-- End describe Page        

	test.describe ('Page [REFERENTIEL]', async () => {    

		var sCurrentPage:string = 'referentiel';

		test ('Page [REFERENTIEL] - Click', async () => {
			await menuPage.click(sCurrentPage, page);
		})
	   	
		test.describe ('onglet [GROUPE DE MAGASINS]', async () => {    

			test ('Onglet [GROUPE DE MAGASINS] - Click', async () => {
				await menuPage.clickOnglet(sCurrentPage, 'groupes', page);
			})

			test ('Label [ERROR] -  Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			})              
			
			test ('DataGrid [LISTE GROUPES MAGASINS] - Check', async () => {
				var aCheckTable = {
					element     : pageRefGroupesMagasin.headerGrpMagList,
					desc        : 'LISTE GROUPES MAGASINS',
					verbose     : false, 
					column      : [
						'0',
						'Désignation',
						'Actif',
						'Actions',
					]
				}
				await fonction.dataGridHeaders(aCheckTable);
			}) 
			
			test ('DataGrid [LISTE DES MAGASINS] - Check', async () => {
				var aCheckTable = {
					element     : pageRefGroupesMagasin.headerMagList,
					desc        : 'LISTE DES MAGASINS',
					verbose     : false, 
					column      : [
						'0',
						'Code',
						'Désignation',
						'Externe',
						'Region',
						'Secteur',
					]
				}
				await fonction.dataGridHeaders(aCheckTable)
			})

			test ('Input [FILTRE] - Is Visible', async () => {
				await fonction.isDisplayed(pageRefGroupesMagasin.inputFiltre);
			})

			test ('Button [CREER UN GROUPE] - Is Visible', async () => {
				await fonction.isDisplayed(pageRefGroupesMagasin.buttonCreerGroupe);
			})

			test ('Button [MODIFIER UN GROUPE] - Is Visible', async () => {
				await fonction.isDisplayed(pageRefGroupesMagasin.buttonModifierGroupe);
			}) 

			test ('Button [ENREGISTRER] - Is Visible', async () => {
				await fonction.isDisplayed(pageRefGroupesMagasin.buttonEnregistrer);
			})
	  
			test.describe ('Popin [CREER UN GROUPE MAGASIN]', async () => {

				test ('Button [CREER UN GROUPE] - Click', async () => {
					await fonction.clickAndWait(pageRefGroupesMagasin.buttonCreerGroupe, page)
				}) 

				test ('Popin [CREER UN GROUPE MAGASIN] - Is Visible ', async () => {
					await fonction.popinVisible(page, "creer un groupe de magasins");
				})
	
				test ('Label [ERROR] -  Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				})                 

				test ('Button [ENREGISTRER] - Is Visible', async () => {
					await fonction.isDisplayed(pageRefGroupesMagasin.pButtonEnregistrer); 
				})
				
				test ('Button [ANNULER] - Is Visible', async () => {
					await fonction.isDisplayed(pageRefGroupesMagasin.pButtonAnnuler);
				})            
				
				test ('InputField [DESIGNATION] - Is Visible', async () => {
					await fonction.isDisplayed(pageRefGroupesMagasin.pInputDesignation);
				})
			
				test ('CheckBox [ACTIF] - Is Visible', async () => {
					await fonction.isDisplayed(pageRefGroupesMagasin.pCheckBoxActif);   
				})
					
				test ('Button [ANNULER] - Click', async () => {
					await fonction.clickElement(pageRefGroupesMagasin.pButtonAnnuler);
				})                
	
				test ('Popin [CREER UN GROUPE MAGASIN] - Is Not Visible ', async () => {
					await fonction.popinVisible(page, "creer un groupe de magasins", false);
				})

			})  // End describe Popin                    

		})  //-- End describe Onglet  

		test.describe ('Onglet [EXCEPTION DE REPARTITION AUTOMATIQUE]', async () => {    

			test ('Onglet [EXCEPTION DE REPARTITION AUTOMATIQUE] - Click', async () => {
				await menuPage.clickOnglet(sCurrentPage, 'exception', page);
			})

			test ('Label [ERROR] -  Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			})                      

			test ('Input [CODE OU DESIGNATION ARTICLE]- Is Visible', async () => {
				await fonction.isDisplayed(pageRefExceptionRepartitionAuto.inputFiltreArticle);
			})
		 
			test ('Button [CREER UNE EXCEPTION ARTICLE]- Is Visible', async () => {
				await fonction.isDisplayed(pageRefExceptionRepartitionAuto.buttonCreerExceptionArticle);
			})
	  
			test ('Button [SUPPRIMER EXCEPTION ARTICLE] - Is Visible', async () => {
				await fonction.isDisplayed(pageRefExceptionRepartitionAuto.buttonSupprimerExceptionArticle);
			})

			test ('DataGrid [ARTICLES EN EXCEPTION] - Check', async () => {
					var aCheckTable = {
					element     : pageRefExceptionRepartitionAuto.dataGridArticle,
					desc        : 'ARTICLES EN EXCEPTION',
					verbose     : false, 
					column      : [
						'0',
						'Code',
						'Désignation',
						'Type d\'exception',
						'Valeur',
						'Actions'
					]
				}
				await fonction.dataGridHeaders(aCheckTable);
			})

			test ('DataGrid [MAGASINS EN EXCEPTION] - Check', async () => {
				var aCheckTable = {
					element     : pageRefExceptionRepartitionAuto.dataGridMagasin,
					desc        : 'MAGASINS EN EXCEPTION',
					verbose     : false, 
					column      : [
						'0',
						'Code',
						'Désignation',
						'Type d\'exception',
						'Actions'
					]
				}
				await fonction.dataGridHeaders(aCheckTable);
			})
			
			test ('Input [CODE OU DESIGNATION MAGASIN] - Is Visible', async () => {
				await fonction.isDisplayed(pageRefExceptionRepartitionAuto.inputFiltreMagasin);
			})
			
			test ('Button [CREER UNE EXCEPTION MAGASIN] - Is Visible', async () => {
				await fonction.isDisplayed(pageRefExceptionRepartitionAuto.buttonCreerExceptionMagasin);
			})
			
			test ('Button [SUPPRIMER EXCEPTION MAGASIN] - Is Visible', async () => {
				await fonction.isDisplayed(pageRefExceptionRepartitionAuto.buttonSupprimerExceptionMagasin);
			})
				 
			test.describe ('Popin [CREATION D\'EXCEPTION ARTICLE]', async () => {

				test ('Button [CREER UNE EXCEPTION ARTICLE] - Click', async () => {
					await fonction.clickAndWait(pageRefExceptionRepartitionAuto.buttonCreerException, page)
				}) 

				test ('Popin [CREATION D\'EXCEPTION ARTICLE] - Is Visible ', async () => {
					await fonction.popinVisible(page, "creation d'exception article");
				})
			
				test ('Label [ERROR] -  Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				})

				test ('InputField [ARTICLE] - Is Visible', async () => {
					await fonction.isDisplayed(pageRefExceptionRepartitionAuto.pInputArticle);
				})
				
				test ('InputField [VALEUR] - Is Visible', async () => {
					await fonction.isDisplayed(pageRefExceptionRepartitionAuto.pInputException); 
				})
			   
				test ('ListBox [TYPE EXCEPTION] - Is Visible', async () => {
					await fonction.isDisplayed(pageRefExceptionRepartitionAuto.pListBoxTypeException);
				})               
				
				test ('Button [ENREGISTRER] - Is Visible', async () => {
					await fonction.isDisplayed(pageRefExceptionRepartitionAuto.pButtonEnregistrer);
				})
			   
				test ('Link [FERMER] - Is Visible', async () => {
					await fonction.isDisplayed(pageRefExceptionRepartitionAuto.pButtonFermer);
				})
				
				test ('Link [FERMER] - Click', async () => {
					await fonction.clickElement(pageRefExceptionRepartitionAuto.pButtonFermer);
				})                 

				test ('Popin [CREATION D\'EXCEPTION ARTICLE] - Is Not Visible ', async () => {
					await fonction.popinVisible(page, "creation d'exception article", false);
				})  

			})  //-- End describe Popin Article
			
			test.describe ('Popin [CREATION D\'EXCEPTION MAGASIN]', async () => {

				test ('Button [CREER UNE EXCEPTION MAGASIN] - Click', async () => {
					await fonction.clickAndWait(pageRefExceptionRepartitionAuto.buttonCreerExceptionMagasin, page)
				}) 

				test ('Popin [CREATION D\'EXCEPTION MAGASIN] - Is Visible ', async () => {
					await fonction.popinVisible(page, "creation d'exception magasin");
				})

				test ('InputField [MAGASIN] - Is Visible', async () => {
					await fonction.isDisplayed(pageRefExceptionRepartitionAuto.pInputMagasin);
				})

				test ('ListBox [TYPE EXCEPTION] - Is Visible', async () => {
					await fonction.isDisplayed(pageRefExceptionRepartitionAuto.pListBoxTypeExceptionMagasin);
				}) 

				test ('Button [ENREGISTRER] - Is Visible', async () => {
					await fonction.isDisplayed(pageRefExceptionRepartitionAuto.pButtonEnregistrerMagasin);
				})
			   
				test ('Link [FERMER] - Is Visible', async () => {
					await fonction.isDisplayed(pageRefExceptionRepartitionAuto.pButtonFermerMagasin);
				})

				test ('Link [FERMER- Click', async ()  => {
					await fonction.clickElement(pageRefExceptionRepartitionAuto.pButtonFermerMagasin);
				}) 

				test ('Popin [CREATION D\'EXCEPTION MAGASIN] - Is Not Visible ', async () => {
					await fonction.popinVisible(page, "creation d'exception magasin", false);
				})

			})//-- End describe Popin Magasin

		})  //-- End describe Onglet

		test.describe ('Onglet [REPARTITION AUTOMATIQUE]', async () => {    

			test ('Onglet [REPARTITION AUTOMATIQUE] - Click', async () => {
				await menuPage.clickOnglet(sCurrentPage, 'repartition', page);
			})

			test ('Label [ERROR] -  Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			})                      

			test ('Button [Is visible] - Check', async () => {
				await fonction.isDisplayed(pageRefRepartitionAuto.buttonCreer);
				await fonction.isDisplayed(pageRefRepartitionAuto.buttonModifier);
				await fonction.isDisplayed(pageRefRepartitionAuto.buttonActiver);
				await fonction.isDisplayed(pageRefRepartitionAuto.buttonDesactiver);
				await fonction.isDisplayed(pageRefRepartitionAuto.buttonSupprimer);
			})
		 
			test ('DataGrid [ARTICLES EN EXCEPTION] - Check', async () => {
					var aCheckTable = {
					element     : pageRefRepartitionAuto.dataGridGroupeArticle,
					desc        : 'ARTICLES EN EXCEPTION',
					verbose     : false, 
					column      : [
						'0',
						'Groupe article',
						'Famille',
						'Sous famille',
						'Dernière sous famille',
						'Article',
						'Gestion des ruptures',
						'Autoriser plusieurs lots par magasin',
						'Répartir lots non reçus (éclatement)',
						'Répartir lots non reçus (picking)',
						'Terminer répartition sans stock',
						'Actif',
						'Actions'
					]
				}
				await fonction.dataGridHeaders(aCheckTable);
			})

			var nomPopin:string = 'CREATION D\'UN PARAMETRAGE DE REPARTITION AUTOMATIQUE';
			test.describe ('Popin [' + nomPopin + ']', async () => {

				test ('Button [CREER] - Click', async () => {
					await fonction.clickAndWait(pageRefRepartitionAuto.buttonCreer, page)
				}) 

				test ('Popin [' + nomPopin + ']' + '- Is Visible', async () => {
					await fonction.popinVisible(page, nomPopin, true);
				})
			
				test ('Label [ERROR] -  Is Not Visible', async () => {
					await fonction.isErrorDisplayed(false, page);
				})

				test ('InputField and checkBox [Is Visible] - Check', async () => {
					await fonction.isDisplayed(pageRefRepartitionAuto.pInputGroupeArticle);
					await fonction.isDisplayed(pageRefRepartitionAuto.pInputFamille);
					await fonction.isDisplayed(pageRefRepartitionAuto.pInputSousFamille);
					await fonction.isDisplayed(pageRefRepartitionAuto.pInputDerniereSousFamille);
					await fonction.isDisplayed(pageRefRepartitionAuto.pInputArticle);
					await fonction.isDisplayed(pageRefRepartitionAuto.pInputGestionRupture);
					await fonction.isDisplayed(pageRefRepartitionAuto.pInputswitchAutoriser); 
					await fonction.isDisplayed(pageRefRepartitionAuto.pInputswitchRepartir);
					await fonction.isDisplayed(pageRefRepartitionAuto.pInputswitchRepartirLots);
					await fonction.isDisplayed(pageRefRepartitionAuto.pInputswitchTerminer);
				})
				
				test ('Link [ANNULER] - Click', async () => {
					await fonction.clickElement(pageRefRepartitionAuto.pButtonFermer);
				})                 

				test ('Popin [' + nomPopin + ']' + '- Is Not Visible ', async () => {
					await fonction.popinVisible(page, nomPopin, false);
				})  
			})  //-- End describe Popin Article
		})  //-- End describe Onglet
	})  //-- End describe Page   

	test.describe ('Page [ADMIN]', async () => {    

		var sCurrentPage:string = 'admin';

		test ('Page [ADMIN] - Click', async () => {
			await menuPage.click(sCurrentPage, page);
		})
	   
		test.describe ('Onglet [ADMINISTRATION]', async () => {

			test ('Onglet [ADMINISTRATION] - Click', async () => {
				await menuPage.clickOnglet(sCurrentPage, 'administration', page);
			})
		})  //-- End describe Onglet  
	
		test.describe ('onglet [VERROUS]', async () => {    

			test ('Onglet [VERROUS] - Click', async () => {
				await menuPage.clickOnglet(sCurrentPage, 'verrous', page);
			})

			test ('Label [ERROR] -  Is Not Visible', async () => {
				await fonction.isErrorDisplayed(false, page);
			})        
			
			test ('Button and input [Is - visble] - Check', async () => {
				await fonction.isErrorDisplayed(false, page);                            // Pas d'erreur affichée à priori au chargement de l'onglet   

				await fonction.isDisplayed(pageAdminVerrous.inputPlateforme);
				await fonction.isDisplayed(pageAdminVerrous.inputArticle);        
				await fonction.isDisplayed(pageAdminVerrous.buttonSupprimerVerrous);        
				await fonction.isDisplayed(pageAdminVerrous.buttonRafraichirTableau)        
			})   

			test ('DataGrid [LISTES DES VERROUS] - Check', async () => {
                var oDataGrid = {
                    element     : pageAdminVerrous.datagridVerrous,    
                    desc        : 'LISTES DES VERROUS',
                    verbose     : false,
                    column      :   
                        [
                            '0',
                            'Plateforme',
                            'Article',
                            'Login',
                            'Date d\'expiration'
                        ]
                }
                await fonction.dataGridHeaders(oDataGrid);   
            })
		})  //-- End describe Onglet  

		test.describe ('Onglet [CHANGELOG]', async ()  => {    

			test ('Onglet [CHANGELOG] - Click', async () => {
				await menuPage.clickOnglet(sCurrentPage, 'changelog', page);
			})
		})  //-- End describe Onglet

		test.describe ('Onglet [COMMUNICATION UTILISATEURS]', async () => {    

			test ('Onglet [COMMUNICATION UTILISATEURS] - Click', async () => {
				await menuPage.clickOnglet(sCurrentPage, 'communicationUtilisateur', page);
			})
		})  //-- End describe Onglet
	})  //-- End describe Page 
	
	test ('Déconnexion', async () => {
		 await fonction.deconnexion(page);
	});

})

