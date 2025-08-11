/**
 * 
 * @author JOSIAS SIE
 * @since 2024-12-18
 *  
 */
const xRefTest      = "DON_BEN_UPD";
const xDescription  = "Modification d'un Bénéficiaire";
const xIdTest       = 6565;
const xVersion      = '3.0.1';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'DONS',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      :  ['nom','adresse','adresseComplete','code','ville',
					'pays' ,'numero','email','contact','telephone','beneficiaire',
					'numeroSIREN','numeroNRA'],
	fileName    : __filename
}

//---------------------------------------------------------------------------------------------//

import { test, type Page }           from '@playwright/test';

import { Help }                      from '@helpers/helpers';
import { TestFunctions }             from '@helpers/functions';
import { Log }                       from '@helpers/log';

import { MenuDon }                   from '@pom/DON/menu.page';
import { BeneficiaireDons }          from '@pom/DON/beneficiares-beneficiaires.page';

import { AutoComplete, CartoucheInfo}from '@commun/types/index';

//---------------------------------------------------------------------------------------------// 

let page                : Page;
let menu                : MenuDon;

let pageBenefBenef      : BeneficiaireDons;

const log               = new Log();
const fonction          = new TestFunctions(log);

//---------------------------------------------------------------------------------------------//

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage();
	menu                = new MenuDon(page, fonction);    
	pageBenefBenef      = new BeneficiaireDons(page);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//---------------------------------------------------------------------------------------------//

const sJddFile          = fonction.getLocalConfig('jddBeneficiaire');
const data              = fonction.readFile(sJddFile);

//---------------------------------------------------------------------------------------------//

var sNomBenefrechercher    = fonction.getInitParam('nom', 'TA_Beneficiaire. ' + fonction.getToday('FR'));
var sNomBeneficiaire       = fonction.getInitParam('nom', 'TA_Beneficiaire. ' + fonction.getToday('FR') + ' ' + fonction.getBadChars());
var sAdresseBenef          = fonction.getInitParam('adresse', data.sAdresseBenef);
var sComplementAdresseBenef= fonction.getInitParam('adresseComplete', data.sComplementAdresseBenef);
var sCodePostalBenef       = fonction.getInitParam('code','75017');
var sVilleBenef            = fonction.getInitParam('ville', data.sVilleBenef);

var sPays                  = fonction.getInitParam('pays', data.sPays);
var sNumeroBenef           = fonction.getInitParam('numero', '7518');
var sEmailBenef            = fonction.getInitParam('email', data.sEmailBenef);
var sNomContactBenef       = fonction.getInitParam('contact', data.sNomContactBenef);
var sTelephoneBenef        = fonction.getInitParam('telephone', '0468606591');
var sBeneficiaire          = fonction.getInitParam('beneficiaire', data.sBeneficiaire);
var sNumSIRENBenef         = fonction.getInitParam('numeroSIREN', '311472356');
var sNumNRABenef           = fonction.getInitParam('numeroNRA', 'W763001985');

//---------------------------------------------------------------------------------------------//

test.describe.serial ('[' + xRefTest + ']', () => {
	
	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();		
		await fonction.openUrl(page);
	})

	test ('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe ('Page [BENEFICIAIRES]', async () => {

		var sNomPage:string = 'beneficiaires';

		test('Page [BENEFICIAIRES] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		test.describe ('Onglet [BENEFICIAIRES]', async () => {

			test('Header [NOM DU BENEFICIAIRE] = "' + sNomBenefrechercher + '"', async () => {
				await fonction.sendKeys(pageBenefBenef.dataGridInputNomBeneficiaire, sNomBenefrechercher, false, 'Nom');
				await fonction.wait(page,700);
			})

			test('CheckBox [LISTE BENEFICIARES][0] - Click', async () => {
				await fonction.clickElement(pageBenefBenef.checboxListeBeneficiaire.nth(0));
			})

			var nNomCasdeTest:string = 'MODIFIER UN BENEFICAIRE';
			test.describe ('[' + nNomCasdeTest + ']', async () => {          

				test('Button [MODIFIER] - Click', async () => {
					await fonction.clickAndWait(pageBenefBenef.buttonModifierBeneficiaire, page);
				})

				test('Popin [' + nNomCasdeTest.toUpperCase() + '] - Is Visible', async () => {
					await fonction.popinVisible(page, nNomCasdeTest , true);
				})

				test('InputField [NOM] = "' + sNomBeneficiaire + '"', async () => {  
					await fonction.sendKeys(pageBenefBenef.pPmbInputNomBeneficiaire, sNomBeneficiaire, false,'Nom'); 
				})

				test('InputField [ADRESSE] = "' + sAdresseBenef + '"', async () => {
					await fonction.sendKeys(pageBenefBenef.pPmbInputAdresseBeneficiaire, sAdresseBenef, false, 'Adresse'); 
				})

				test('InputField [COMPLEMENT ADRESSE] = "' + sComplementAdresseBenef + '"', async () => {
					await fonction.sendKeys(pageBenefBenef.pPmbInputComplementAdresse, sComplementAdresseBenef, false,'Complement adresse'); 
				})

				test('InputField [CODE POSTAL] = "' + sCodePostalBenef + '"', async () => {
					await fonction.sendKeys(pageBenefBenef.pPmbInputCodePostal, sCodePostalBenef, false, 'Code postal'); 
				})

				test('InputField [VILLE] = "' + sVilleBenef + '"', async () => {
					await fonction.sendKeys(pageBenefBenef.pPmbInputVille, sVilleBenef, false, 'Ville'); 
				})

				test('ListBox [PAYS] = "' + sPays + '" - Select', async () => {
					await fonction.clickElement(pageBenefBenef.pPcbListBoxPays);
					await fonction.clickElement(pageBenefBenef.pPcbListBoxItem.locator('span:text-is("'+sPays+'")'));
				})

				test('InputField [NUMERO] = "' + sNumeroBenef + '"', async () => {
					await fonction.sendKeys(pageBenefBenef.pPmbInputNumero, sNumeroBenef, false, 'Numéro'); 
				})

				test('DatePicker [DATE] = "Aujourd\'hui"', async () => {
					await fonction.clickElement(pageBenefBenef.pPmbdatePicker);
					await fonction.clickElement(pageBenefBenef.datePickermbButtonAjourdhui);
				})

				test('InputField [EMAIL] = "' + sEmailBenef + '"', async () => {
					await fonction.clickElement(pageBenefBenef.pPmbIconEmail.nth(0));
					await fonction.sendKeys(pageBenefBenef.pPmbInputEmail.locator('input'), sEmailBenef, false, 'E-mail'); 
				})

				test('InputField [NOM CONTACT] = "' + sNomContactBenef + '"', async () => {
					await fonction.sendKeys(pageBenefBenef.pPmbInputNomContact, sNomContactBenef, false, 'Nom contact'); 
				})

				test('InputField [TELEPHONE] = "' + sTelephoneBenef + '"', async () => {
					await fonction.sendKeys(pageBenefBenef.pPmbInputTelephone, sTelephoneBenef, false, 'Téléphone'); 
				})

				test('ListBox [GROUPE][first]" - Select', async () => {
					await fonction.clickElement(pageBenefBenef.pPcbListBoxGroupe)
					await fonction.clickElement(pageBenefBenef.pPcbListBoxItem.first());
				})

				test('InputField [OPERE POUR LE COMPTE ] = "' + sBeneficiaire + '"', async () => {
					var oData:AutoComplete = {
						libelle         :'OPERE POUR LE COMPTE ',
						inputLocator    : pageBenefBenef.pPmbInputOperepourleCompte,
						inputValue      : sBeneficiaire,
						choiceSelector  : 'button.dropdown-item:NOT(.btn-link)',
						choicePosition  : 0,
						typingDelay     : 100,
						waitBefore      : 500,
						clear           : true,
						page            : page,
					}
					await fonction.autoComplete(oData);
				})

				test("RadioButton [Objet de l'association fondation][0] - Click" , async () => {
					await fonction.clickElement(pageBenefBenef.pPmbRadiobuttonAssociatAideAliment); 
				})

				test("RadioButton [Objet de l'association fondation][1] - Click" , async () => {
					await fonction.clickElement(pageBenefBenef.pPmbRadiobuttonOeuvreOrgGeneral); 
				})
				
				test('InputField [NUMERO SIREN ] = "' + sNumSIRENBenef + '"', async () => {
					await fonction.sendKeys(pageBenefBenef.pPmbInputNumSIREN, sNumSIRENBenef, false, 'Numéro SIREN'); 
				})

				test('InputField [NUMERO NRA ] = "' + sNumNRABenef + '"', async () => {
					await fonction.sendKeys(pageBenefBenef.pPmbInputNumNRA, sNumNRABenef, false, 'Numéro NRA'); 
				})

				test('Button [ENREGISTRER] - Click', async () => {
					await fonction.clickAndWait(pageBenefBenef.pPmbButtonEnregistrer, page);
				})

				test('Popin [' + nNomCasdeTest.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, nNomCasdeTest , false);
				})
			})    
		})
	})
   
	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})