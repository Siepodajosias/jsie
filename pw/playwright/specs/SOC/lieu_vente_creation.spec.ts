/**
 * 
 * @author JOSIAS SIE
 * @since 2023-11-20
 *  
 */
const xRefTest      = "SOC_LVE_ADD";
const xDescription  = "Création d'un Lieu de Vente";
const xIdTest       =  3129;
const xVersion      = '3.9';
	
var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'SOCIETES',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['enseigne', 'designation','typeDeLieu','ville'],
	fileName    : __filename
}

//------------------------------------------------------------------------------------

import { expect, test, type Page }  from '@playwright/test';

import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';
import { EsbFunctions }             from '@helpers/esb';

import { MenuSociete }              from '@pom/SOC/menu.page'
import { PageLieuxVente }			from '@pom/SOC/lieux-de-vente.page';

import { CartoucheInfo, TypeEsb } 	from '@commun/types/index';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuSociete;

let pageLieuxVente      : PageLieuxVente;
let esb                 : EsbFunctions;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

fonction.importJdd();

var sEnseigne       = fonction.getInitParam('enseigne','Grand Frais');
var sDesignation    = fonction.getInitParam('designation', ''); 
var sTypeDeLieu     = fonction.getInitParam('typeDeLieu', 'Magasin');
var sVille          = fonction.getInitParam('ville','TA Ville Machin - /L\'ile');

const sAdresse1     = 'TA Adresse 1 ' + fonction.getToday('FR') + fonction.getBadChars();
const sAdresse2     = 'TA Adresse 2 ' + fonction.getToday('FR') + fonction.getBadChars();
const sCodePostal   = '88888';
const sLatitude     = '45.081378';
const sLongitude    = '1.545757';
const iCodeGie      = Math.floor((fonction.random() * 900) + 100);

var oData = {
	sDesignation    : '',
	sCodeLieuDeVente: ''
}

//------------------------------------------------------------------------------------
/**
 * Récupère le pays en fonction de l'enseigne passé en paramètre.
 * 
 * @param enseigne 
 * @returns {sPays}
 */
function getPaysPourEnseigne(enseigne: string) {
	var sPays = '';
	var aPays = fonction.getLocalConfig('pays');

	const keys = Object.keys(aPays);
	sPays = keys.find((key: string | number) => aPays[key].includes(enseigne));
	return sPays;
}
var sPays = getPaysPourEnseigne(sEnseigne); 
//------------------------------------------------------------------------------------ 

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage();
	menu                = new MenuSociete(page, fonction);    
	pageLieuxVente      = new PageLieuxVente(page);
	esb                 = new EsbFunctions(fonction);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

	test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test('Connexion', async() => {
		await fonction.connexion(page);
	})

	test('Message [ERREUR] - Is Not Visible', async () => {
		await fonction.isErrorDisplayed(false, page); // Pas d'erreur affichée à priori au chargement de la page 
	}) 

	test.describe('Page [LIEUX VENTE]', async () => {    

		let pageMenu:string = "lieuxVente";

		test("Menu [LIEUX] - Click ", async () => {
			await menu.click(pageMenu, page);
		})

		test('** Wait Until Spinner Off #1 **', async () => {
			await fonction.waitForSpinner(pageLieuxVente.spinnerLoading, 180000);
		})

		test('Message [ERREUR] - Is Not Visible', async () => {
			await fonction.isErrorDisplayed(false, page); // Pas d'erreur affichée à priori au chargement de la page 
		}) 

		test('Button [CREER UN LIEU DE VENTE] - Click', async () => {
			await fonction.clickAndWait(pageLieuxVente.buttonCreerLieuVente, page);
		})

		var sNomPopin:string = "Création d'un lieu de vente";
		test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

			test('Popin [CREATION D\'UN LIEU] - Is Visible', async () => {
				await fonction.popinVisible(page, sNomPopin, true); // Pas d'erreur affichée à priori au chargement de la Popin
			})

			test('Button [ENREGISTRER] - Is Disabled', async () => {
				await expect(pageLieuxVente.pPcreateBtnEnregistrer).toBeDisabled();
			})

			test('ListBox [TYPE DE LIEU] ['+sTypeDeLieu+']', async () => {
				var text = await pageLieuxVente.pPcreateListBoxTypeLieu.locator('span').textContent();
				if(text != 'Magasin'){
					await fonction.clickAndWait(pageLieuxVente.pPcreateListBoxTypeLieu, page);
					await fonction.clickElement(page.locator('li[aria-label="'+sTypeDeLieu+'"]'));
				}
				await fonction.addDataSheet('ListBox', 'Type de Lieu', text);
			})

			test('ListBox [ENSEIGNE] ['+sEnseigne+']', async () => {
				if(sEnseigne != 'Grand Frais'){
					await fonction.clickAndWait(pageLieuxVente.pPcreateListBoxEnseigne, page)
					await fonction.clickElement(page.locator('li[aria-label="'+sEnseigne+'"]'));
				}
				await fonction.addDataSheet('ListBox', 'Enseigne', sEnseigne);
			})

			if (sEnseigne === 'Grand Frais') { // Les Enseignes "grand Frais" ont nécessairement un code GIE
				test('ListBox [ENSEIGNE] = "Grand Frais"', async () => {
					await fonction.sendKeys(pageLieuxVente.pPcreateInputCodeGie, iCodeGie, false, 'Code GIE');
				})
			}

			test('Input [LIEU DE VENTE] ['+sDesignation+']', async () => {
				await fonction.sendKeys(pageLieuxVente.pPcreateInputDesign, sDesignation, false, 'Lieu de Vente');
				oData.sDesignation = sDesignation;
			})

			test('ComboBox [CODE][rnd] - Click', async () => {
				await fonction.clickElement(pageLieuxVente.pPcreateInputCode);
				
				var isActive     = await pageLieuxVente.pPcreateComboBoxList.first().isEnabled();
				if(isActive){
					var iNbChoix = await pageLieuxVente.pPcreateComboBoxList.count();
					var iCible   = Math.floor(fonction.random() * iNbChoix );  
	
					var sChoix   = await pageLieuxVente.pPcreateComboBoxList.nth(iCible).textContent();
					log.set('ComboBox [CODE] : Sélection Elément ' + iCible + ' / ' + iNbChoix + ' = "' + sChoix + '"');
					await fonction.clickElement(pageLieuxVente.pPcreateComboBoxList.nth(iCible));
				}

				let sCodeLieuDeVente  = await pageLieuxVente.pPcreatePrefixeEnseigne.textContent() + sChoix;
				oData.sCodeLieuDeVente= sCodeLieuDeVente;
			})

			test('CheckBox [OUVERT DIMANCHE][rnd] - Select', async () => {
				await fonction.clickCheckBox(pageLieuxVente.pPcreateCheckBoxOuvDim, 0.5, false);
			})

			test('DatePicker [DATE OUVERTURE] = "Aujourd\'hui"', async () => {
				await fonction.clickElement(pageLieuxVente.pPcreateDatePeackerOuv);
				await fonction.clickElement(pageLieuxVente.pPcreateDateToday);
			})

			test('Input [CANAUX DE VENTE] [mon-marche.fr]', async () => {
				if(sEnseigne == 'Digital (Mon marché)'){
					await fonction.clickAndWait(pageLieuxVente.pPcreateListBoxCanaux, page);
					await fonction.clickElement(pageLieuxVente.pPcreateListBoxCanaux.locator('span:text-is("mon-marche.fr")'));
				}
			})

			test('Input [ADRESSE] ['+sAdresse1+']', async () => {
				await fonction.sendKeys(pageLieuxVente.pPcreateInputAdresse, sAdresse1, false, 'Adresse');
			})

			test('Input [ADRESSE COMPLEMENT] ['+sAdresse2+']', async () => {
				await fonction.sendKeys(pageLieuxVente.pPcreateInputAdresseCpt, sAdresse2, false, 'Complément Adresse');
			})

			test('Input [CODE POSTAL] ['+sCodePostal+']', async () => {
				await fonction.sendKeys(pageLieuxVente.pPcreateInputCodePostal, sCodePostal, false, 'Code Postal');
			})
			
			test('Input [VILLE] ['+sVille+']', async () => {
				await fonction.sendKeys(pageLieuxVente.pPcreateInputVille, sVille, false, 'Ville');
			})

			test('ListBox [PAYS] ['+sPays+']', async () => {     
				if(sPays != 'France'){
					await fonction.clickAndWait(pageLieuxVente.pPcreateListBoxPays, page);
					await fonction.clickElement(pageLieuxVente.pPcreateListBoxPaysItem.locator('span:text-is("'+sPays+'")'));
				}
				await fonction.addDataSheet('ListBox', 'Pays', sPays);
			})
			
			test('ListBox [REGION][rnd] - Select', async () => {
				var text = await pageLieuxVente.pPcreateListBoxRegion.locator('span').textContent();              
				if(text == ' '){
					await fonction.selectRandomListBoxLi(pageLieuxVente.pPcreateListBoxRegion, false, page);
				}
				await fonction.addDataSheet('ListBox', 'Région', text);
			})

			test('Input [LATITUDE] ['+sLatitude+']', async () => {
				await fonction.sendKeys(pageLieuxVente.pPcreateInputLatitude, sLatitude, false, 'Latitude');
			})

			test('Input [LONGITUDE] ['+sLongitude+']', async () => {
				await fonction.sendKeys(pageLieuxVente.pPcreateInputLongitude, sLongitude, false, 'Longitude');
			})
			
			test('Button [ENREGISTRER] - Click', async () => {
				await fonction.clickAndWait(pageLieuxVente.pPcreateBtnEnregistrer, page);
				
				var present          = await pageLieuxVente.pErrorMessage.isVisible();
				if (present) {
					var error:any    = await pageLieuxVente.pErrorMessage.textContent();
					var errorMessage = error.substr(1,6);
					if(errorMessage == '[9100]'){
						await fonction.clickElement(pageLieuxVente.pPcreateLinkAnnuler);
					}
				}
			})

			test('Popin [CREATION D\'UN LIEU] - Is Not Visible', async () => {
				await fonction.popinVisible(page, sNomPopin, false); // Pas d'erreur affichée à priori au chargement de la Popin
			})
		})

		test('** Wait Until Spinner Off #2 **', async () => {
			await fonction.waitForSpinner(pageLieuxVente.spinnerLoading, 180000);
		})

		test.describe ('Datagrid [LIEUX DE VENTE]', async () => {
			test('Input [FILTRE][LIEU DE VENTE] ['+ sDesignation +']', async () => {
				await fonction.sendKeys(pageLieuxVente.tableInputFiltre, sDesignation, false, 'Lieu de vente');
				await fonction.wait(page, 450);
			})

			test('Td [DESIGNATION (LIEU DE VENTE)] = "' + sDesignation + '"', async () => {
				expect(await pageLieuxVente.tdDesignation.first().textContent()).toEqual(sDesignation);
			})

			test('Td [OUVERTURE] - Expect', async () => {
				expect(await pageLieuxVente.tdOuverture.first().textContent()).toEqual(fonction.getToday("FR", 0, " / "));
			})

			test('Td [VALIDE][First] - Is Visible', async () => {
				await fonction.isDisplayed(pageLieuxVente.iValide.first());
			})
		})

		await fonction.writeData(oData);
	})  //-- End Describe Page

	test('Déconnexion', async() => {
		// Si on est dans le cadre d'un E2E, sauvegarde des données pour le scénario suivant
		await fonction.deconnexion(page);
	})

	test('** CHECK FLUX **', async () => {
		if (sDesignation) {
			var oFlux:TypeEsb = { 
				"FLUX" : [
					{
						"NOM_FLUX" : "Diffuser_LieuDeVente",
						 STOP_ON_FAILURE  : false
					} 
				],
				"WAIT_BEFORE"      : 3000,               
			}

			await esb.checkFlux(oFlux, page);
		} else {
			log.set('Check Flux : ACTION ANNULEE');
			test.skip();
		}
	})
})  //-- End Describe