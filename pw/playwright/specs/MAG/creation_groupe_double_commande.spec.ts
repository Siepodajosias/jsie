/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 19 - 12 - 2023
 */

const xRefTest      = "MAG_CMD_DBL";
const xDescription  = "Création d'une Groupe de Double Commandes XXX";
const xIdTest       =  110;
const xVersion      = '3.3';

var info = {
	desc        : xDescription,
	appli       : 'MAGASIN',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['idCodeRayon', 'Cadende', 'listeVilles', 'groupeArticle','typeAssortiment'],
	fileName    : __filename
}

//----------------------------------------------------------------------------------------

import { test, type Page}                from '@playwright/test';

import { TestFunctions }                 from "@helpers/functions";
import { Log }                           from "@helpers/log";
import { Help }                          from '@helpers/helpers';

import { GlobalConfigFile }              from '@conf/commun.conf';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }                   from '@pom/MAG/menu.page';
import { AutorisationsParametrage }      from '@pom/MAG/autorisations-parametrage.page';

//-------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuMagasin;
let pageAutParam    : AutorisationsParametrage;

const log           = new Log();
const fonction      = new TestFunctions(log);
const globalConfig  = new GlobalConfigFile();

const globalData    = globalConfig.getData();

//----------------------------------------------------------------------------------------

var maDate           = new Date();

const dateJour       = fonction.getToday('us');

var iNumJourSemaine  = maDate.getDay();     
var joursSemaine     = globalData.joursSemaine;

//-----------------------------------------------------------------------------------------

const sCodeRayon        = fonction.getInitParam('idCodeRayon','FL');  
const sGroupeArticle    = fonction.getInitParam('groupeArticle','Fruits et légumes');
const sTypeAssortiment  = fonction.getInitParam('typeAssortiment','Achats centrale');   
var aListeVilles        = fonction.getInitParam('listeVilles', 'Ahuy,Borny,Dijon');
const sDebutCommande    = fonction.getInitParam('heureDebut', '00:00');   
const sFinCommande      = fonction.getInitParam('heureFin','23:59');  
const sDesignGrpAssort  = fonction.getInitParam('nomAssortiment','TA_' + sTypeAssortiment + ' ' + sGroupeArticle + ' ' + dateJour);

const [cmdHeureStart, cmdMinuteStart]   = sDebutCommande.split(':');
const [cmdHeureEnd, cmdMinuteEnd]       = sFinCommande.split(':');

//-----------------------------------------------------------------------------------------   

// La liste des lieux de vente cible peut être :
//    * Soit celle contenue dans le fichier de conf par défaut de l'application (array)
//    * Soit celle contenue dans le JDD (array)
//    * Soit celle passée en argument (string). Ex "ville1 , ville2 , ville3".
// Dans ce dernier cas, cette chaîne doit être transofmrée en tableau pour pouvoir être traitée.
if (typeof(aListeVilles) === 'string' ) {
	aListeVilles = aListeVilles.split(',');
}

//---------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page            = await browser.newPage(); 
	menu            = new MenuMagasin(page, fonction);
	pageAutParam    = new AutorisationsParametrage(page);
	const helper    = new Help(info, testInfo, page);
	await helper.init();
})
 
test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

	test('Ouverture URL'+ fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test('Connexion', async () => {
		await fonction.connexion(page);
		log.set('ID Code Rayon : ' + sCodeRayon);
		log.set('Groupe Article : ' + sGroupeArticle);
	})

	test.describe ('Page [ACCUEIL]', async () => {

		test('Link [BROWSER SECURITY WARNING] - Click', async () => {
			await fonction.waitTillHTMLRendered(page);
			var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
			if(isVisible){
				await menu.removeArlerteMessage(page);
			}else{                
				log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
				test.skip();
			}
		})
	})

	test.describe ('Page [AUTORISATIONS]', async () => {

		var pageName:string = 'autorisations';

		test('Page [AUTORISATIONS] - Click', async () => {
			await menu.click(pageName,page);
		})

		test('Onglet [PARAMETRAGE] - Click', async () => {  
			await menu.clickOnglet(pageName, 'parametrage', page);                 
		})

		test('InpuField [ASSORTIMENT] = "' + sDesignGrpAssort + '"', async () => {
			await fonction.sendKeys(pageAutParam.inputFieldFilter, sDesignGrpAssort, false, 'Assortiment');
			await fonction.wait(page, 250);
		})

		test('CheckBox [ASSORTIMENT] - Click', async () => {        
			await fonction.clickElement(pageAutParam.checkBoxListeAssortiments.nth(0)); 
		})

		var sNomPopin:string = "Popin [MODIFICATION / CREATION D'UN GROUPE DE COMMANDE";
		test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {
			
			test('Bouton [CREER GROUPE DE COMMANDE] - Click', async () => {  
				await fonction.clickAndWait(pageAutParam.buttonCreerGrpCmd, page);      
			})
	
			test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
				await fonction.popinVisible(page, sNomPopin, true);
			})
		
			var sGroupeCmde:string = 'TA_GrpCmde-' + sCodeRayon + '-' + dateJour;      
			test('InputField [NOM] = "' + sGroupeCmde + '"', async () => {
				await fonction.sendKeys(pageAutParam.pInputNom, sGroupeCmde, false, 'Nom Groupe Commande');
			}) 
		
			test('Date Picker [HEURE DEBUT] = "' + cmdHeureStart + '"', async () => {
				await fonction.sendKeys(pageAutParam.pDatePickerHeureDebut, cmdHeureStart, false, 'Heure Début');           
			})
			
			test('Date Picker [MINUTE DEBUT] = "' + cmdMinuteStart + '"', async () => {
				await fonction.sendKeys(pageAutParam.pDatePickerMinuteDebut, cmdMinuteStart, false, 'Minute Début');          
			})      
			
			test('Date Picker [HEURE FIN] = "' + cmdHeureEnd + '"', async () => {
				await fonction.sendKeys(pageAutParam.pDatePickerHeureFin, cmdHeureEnd, false, 'Heure Fin');     
			})
			
			test('Date Picker [MINUTE FIN] = "' + cmdMinuteEnd + '"', async () => {
				await fonction.sendKeys(pageAutParam.pDatePickerMinuteFin, cmdMinuteEnd, false, 'Minute Fin');          
			}) 

			test('Jour [COMMANDE J+1] = "' + joursSemaine[iNumJourSemaine-1] + '"', async () => {
				var iLigne   = iNumJourSemaine;
				var iCible   = iNumJourSemaine + 1;
				var mySelector= page.locator('table > tbody > tr:nth-child(' + iLigne + ') > td:nth-child(2) > p-dropdown');
				await fonction.clickElement(mySelector);
				await fonction.clickElement(pageAutParam.pPdropdownitemJourSemaine.locator('span:text-is("'+joursSemaine[iCible]+'")'));
			})

			test('Jour [COMMANDE J+2] = "' + joursSemaine[iNumJourSemaine] + '"', async () =>{  
				var iLigne   = iNumJourSemaine + 1;
				var iCible   = iNumJourSemaine + 2;
				var mySelector= page.locator('table > tbody > tr:nth-child(' + iLigne + ') > td:nth-child(2) > p-dropdown');
				await fonction.clickElement(mySelector);
				if(joursSemaine[iCible] == undefined){
					await fonction.clickElement(pageAutParam.pPdropdownitemJourSemaine.locator('span:text-is("Lundi")'));
				}else{
					await fonction.clickElement(pageAutParam.pPdropdownitemJourSemaine.locator('span:text-is("'+joursSemaine[iCible]+'")'));
				}
			})

			test('MultiSelect [DESIGNATION] - Click', async () => {
				await fonction.clickElement(pageAutParam.pTdDesignationMag);  
			})

			aListeVilles.forEach(async (ville:string, index:number) => {
				test('CheckBox [MAGASIN][' + index + '] = "' + sCodeRayon + ' ' + ville + '"', async () =>{    
					ville = ville.trim();                   // On se débarrasse d'éventuels espaces autour de la chaîne de caractères  
					log.set('Magasin Associé : ' + ville);   
					await fonction.sendKeys(pageAutParam.pPinputDesignation, ville, false, 'Ville');
					var iNbDesignationMag = await pageAutParam.pMutipleSelection.count();
					for (let iIndexDesignation = 0; iIndexDesignation < iNbDesignationMag; iIndexDesignation ++){
						var sDesignation = await pageAutParam.pMutipleSelection.nth(iIndexDesignation).innerText();
						if(sCodeRayon == 'FL' || sCodeRayon == 'PO'){
							if(sDesignation.includes(ville)){
								await fonction.clickElement(pageAutParam.pMutipleSelection.nth(iIndexDesignation));
								break;
							}
						}else{
							var sText = sCodeRayon + ' ' + ville;
							if(sDesignation.match(sText)){
								await fonction.clickElement(pageAutParam.pMutipleSelection.nth(iIndexDesignation));
								break;
							}
						}
					}    
				})
			})

			test('Bouton [ENREGISTRER] - Click', async () => {       
				await fonction.clickAndWait(pageAutParam.pButtonEnregistrer, page);                                                               
			})

			test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
				await fonction.popinVisible(page, sNomPopin, false, 40000);
			})
		})
	})

	test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})