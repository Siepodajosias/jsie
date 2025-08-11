/**
 * @author  Josias SIE
 * @since   25-06-2024
 * 
 */
const xRefTest      = "STO_EMB_CRE";  
const xDescription  = "Consulter les réceptions des emballages";
const xIdTest       =  9260;
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
import { Authentificationpage }      from '@pom/COMMUN/authentification.page';

import { Credential }                from '@conf/credential.conf';

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
const sProfilGestionnaireEmb= 'jcc-recette5';// profil Gestionnaire d'emballage
//------------------------------------------------------------------------------------
test.describe.serial('[' + xRefTest + ']', async () => {  
	
	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();		
		await fonction.openUrl(page);
	})

	test ('Connexion', async () => {
		const userCredential= new Credential(sProfilGestionnaireEmb);
		var profilData      = userCredential.getData();

		await pageObjectAuth.setJUsername(sProfilGestionnaireEmb);
		await pageObjectAuth.setJPassword(profilData.password);
		await pageObjectAuth.clickConnexionButton(page);

		await fonction.addDataSheet('Profil', 'Login' , sProfilGestionnaireEmb);

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

				test('Td [NUMERO BL] = "' + sNumeroBl + '"', async () => {
					await fonction.wait(page,350);
					const numeroBl   = await pageEmballage.spanNumeroBl.textContent();
					expect(numeroBl).toContain(sNumeroBl);
				})

				test('Td [TRANSPORTEUR] = "' + sTransporteur + '"', async () => {
					await fonction.wait(page,350);
					const transporteur  = await pageEmballage.spanTransporteur.textContent();
					expect(transporteur).toContain(sTransporteur);
				})

				test('Td [RECEPTIONNAIRE] = "' + sReceptionnaire + '"', async () => {
					await fonction.wait(page,350);
					const receptionnaire  = await pageEmballage.spanReceptionnaire.textContent();
					expect(receptionnaire).toContain(sReceptionnaire);
				})
			})
		})
	})

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})// end describe
	
}) 