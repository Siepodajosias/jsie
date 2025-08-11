/**
 * @author  Josias SIE
 * @since   26-06-2024
 * 
 */
const xRefTest      = "STO_EMB_ARE";  
const xDescription  = "Annulation d'une réception d'emballage";
const xIdTest       =  9308;
const xVersion      = '3.3'; 
  
var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'STOCK',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,  
	help        : [],        
	params      : ['plateForme','numeroBl','transporteur', 'receptionnaire'],
	fileName    : __filename
} 
   
//------------------------------------------------------------------------------------

import { expect, test, type Page }   from '@playwright/test';
import { Help }                      from '@helpers/helpers';
import { TestFunctions }             from '@helpers/functions';
import { Log }                       from '@helpers/log';
import { CartoucheInfo }             from '@commun/types';
//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                 from '@pom/STO/menu.page'; 
import { ReceptionEmballageMagasin } from '@pom/STO/reception-emballage_magasin.page';
import { Credential }                from '@conf/credential.conf';
import { Authentificationpage }      from '@pom/COMMUN/authentification.page';

//------------------------------------------------------------------------------------

let page                  : Page;
let menu                  : MenuStock;
let pageEmballage         : ReceptionEmballageMagasin;
let pageObjectAuth        : Authentificationpage;
const log                 = new Log();
const fonction            = new TestFunctions(log);

// Exploitation des paramètres passés dans le JDD E2E -OU- passés en argument OU ceux présents dans le fichier de configuration Local
var data:any              = fonction.importJdd();

const sPlateforme         = fonction.getInitParam('plateForme', 'Chaponnay');
var sTransporteur         = fonction.getInitParam('transporteur', 'ALS Fresh Food');
var sNumeroBl             = fonction.getInitParam('numeroBl','TA_numeroBl');
var sReceptionnaire       = fonction.getInitParam('receptionnaire','TA_réceptionnaire. ');

//------------------------------------------------------------------------------------
var sStatut               = 'Annulé';
sReceptionnaire           = sReceptionnaire + fonction.getToday('FR');
//------------------------------------------------------------------------------------    

if (data !== undefined) {                  // On est dans le cadre d'un E2E. Récupération des données temporaires
    sTransporteur   = data.sTransporteur;  // L'élément recherché est le transporteur préalablement créé dans le E2E
    sNumeroBl       = data.sNumeroBl;      // L'élément recherché est le numéro BL préalablement créé dans le E2E
	sReceptionnaire = data.sReceptionnaire;// L'élément recherché est le réceptionnaire préalablement créé dans le E2E 
    log.set('E2E : ' + ' Transporteur '+sTransporteur+ ' Numéro BL '+ sNumeroBl+ ' Réceptionaire ' +sReceptionnaire);             
}

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	 page                 = await browser.newPage();
	 pageObjectAuth       = new Authentificationpage(page);
	 menu                 = new MenuStock(page, fonction);
	 pageEmballage        = new ReceptionEmballageMagasin(page);
	 const helper         = new Help(info, testInfo, page);
	 await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})
  
//------------------------------------------------------------------------------------
const sProfilResponsableEmb= 'jcc-recette7';// profil Responsable emballage
//------------------------------------------------------------------------------------
test.describe.serial('[' + xRefTest + ']', async () => {  
	
	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();		
		await fonction.openUrl(page);
	})

	test ('Connexion', async () => {
		const userCredential= new Credential(sProfilResponsableEmb);
		var profilData      = userCredential.getData();

		await pageObjectAuth.setJUsername(sProfilResponsableEmb);
		await pageObjectAuth.setJPassword(profilData.password);
		await pageObjectAuth.clickConnexionButton(page);

		await fonction.addDataSheet('Profil', 'Login' , sProfilResponsableEmb);

	}) // end describe

	test.describe('Page [EMBALLAGE]', async () => {

		var sNomPage:string = 'emballage';
		test ('Page [EMBALLAGE] - Click', async () => {
			await menu.click(sNomPage, page);
		}) 

		test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {                    
			await menu.selectPlateforrme(page, sPlateforme);
		})

		test.describe('Onglet [RECEPTION]', async () => {

			test('Datepicker [FILTRE][DATE DEBUT] ', async () => {
				await fonction.clickElement(pageEmballage.buttonDatepicker.nth(0));
				var isVisible = await pageEmballage.tdDatepickerToday.isEnabled();
				if(isVisible){
				  await fonction.clickElement(pageEmballage.tdDatepickerToday);
				}
			})

			test('Datepicker [FILTRE][DATE FIN]', async () => {
				await fonction.wait(page, 250);
				await fonction.clickElement(pageEmballage.buttonDatepicker.nth(1));
				var isVisible = await pageEmballage.tdDatepickerToday.isEnabled();
				if(isVisible){
				  await fonction.clickElement(pageEmballage.tdDatepickerToday);
				}
			})

			test.describe('Datagrid [RECEPTION EMBALLAGE]', async () => {

				test('Input [FILTRE][NUMERO BL] = "' + sNumeroBl + '"', async () => {
					await fonction.sendKeys(pageEmballage.tdFiltreNumeroBl, sNumeroBl, false, 'Num BL');
					await fonction.wait(page,250);
				})

				test('Input [FILTRE][TRANSPORTEUR] = "' + sTransporteur + '"', async () => {
					await fonction.sendKeys(pageEmballage.tdFiltreTransporteur, sTransporteur, false, 'Transporteur');
					await fonction.wait(page,250);
				})

				test('Input [FILTRE][RECEPTIONNAIRE] = "' + sReceptionnaire + '"', async () => {
					await fonction.sendKeys(pageEmballage.tdFiltreReceptionnaire, sReceptionnaire, false, 'Réceptionnaire');
				})

				test('tr [RECEPTION] - Click', async () => {
					await fonction.wait(page,250);
					const statut= await pageEmballage.spanStatutReception.textContent();
					if(statut === 'Terminé'){
					   await fonction.clickElement(pageEmballage.checkboxListeReception.first());
					}
				})

				test('Button [ANNULER] - Click', async () => {
					await fonction.wait(page,250);
					var isActive = await pageEmballage.buttonAnnuler.isEnabled();
					if(isActive){
					   await fonction.clickAndWait(pageEmballage.buttonAnnuler, page);
					}
				})

				test.describe('Popin [ANNULATION D\'UNE RECEPTION D\'EMBALLAGES] ', () => {
					test('Button [CONFIRMER] - Click', async () => {
						await fonction.clickAndWait(pageEmballage.pButtonConfirmer, page);
					})
				})
			})

			test.describe('Datagrid [RECEPTION]', async () => {

				test('Input [FILTRE][NUMERO BL] = "' + sNumeroBl + '"', async () => {
					await fonction.sendKeys(pageEmballage.tdFiltreNumeroBl, sNumeroBl, false, 'Num BL');
					await fonction.wait(page,250);
				})

				test('Input [FILTRE][RECEPTIONNAIRE] = "' + sReceptionnaire + '"', async () => {
					await fonction.sendKeys(pageEmballage.tdFiltreReceptionnaire, sReceptionnaire, false, 'Réceptionnaire');
					await fonction.wait(page,250);
				})

				test('Td [STATUT] = "' + sStatut + '"', async () => {
					const statut  = await pageEmballage.spanStatutReception.first().textContent();
					expect(statut).toContain(sStatut);
				})
			})
		})
	})

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})// end describe
	
}) 