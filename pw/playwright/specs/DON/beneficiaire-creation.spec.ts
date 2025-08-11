/**
 * 
 * @author JOSIAS SIE
 * @since 2024-12-11
 *  
 */
const xRefTest      = "DON_BEN_ADD";
const xDescription  = "Création d'un Bénéficiaire";
const xIdTest       = 4723;
const xVersion      = '3.1.1';

var info: CartoucheInfo = {
	desc        : xDescription,
	appli       : 'DONS',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,    
	help        : [],
	params      : ['nom','adresse','adresseComplete','code','ville',
				   'pays','numero','email','contact','telephone','beneficiaire',
				   'numeroSIREN','numeroNRA'],
	fileName    : __filename
}

//------------------------------------------------------------------------------------

import { expect, test, type Page }             from '@playwright/test';

import { Help }                                from '@helpers/helpers';
import { TestFunctions }                       from '@helpers/functions';
import { Log }                                 from '@helpers/log';
import { EsbFunctions }                        from '@helpers/esb';

import { MenuDon }                             from '@pom/DON/menu.page';
import { BeneficiaireDons }                    from '@pom/DON/beneficiares-beneficiaires.page';

import { AutoComplete, CartoucheInfo, TypeEsb }from '@commun/types/index';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuDon;

let pageBenefBenef      : BeneficiaireDons;
let esb                 : EsbFunctions;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------ 

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage();
	menu                = new MenuDon(page, fonction);    
	pageBenefBenef      = new BeneficiaireDons(page);
	esb                 = new EsbFunctions(fonction);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//----------------------------------------------------------------------------------//

const sJddFile          = fonction.getLocalConfig('jddBeneficiaire');
const data              = fonction.readFile(sJddFile);

//----------------------------------------------------------------------------------//

var sNomBeneficiaire       = fonction.getInitParam('nom', 'TA_Beneficiaire. ' + fonction.getToday('FR') + ' ' + fonction.getHMS(':') + ' ' + fonction.getBadChars());
var sAdresseBenef          = fonction.getInitParam('adresse', data.sAdresseBenef);
var sComplementAdresseBenef= fonction.getInitParam('adresseComplete', data.sComplementAdresseBenef);
var sCodePostalBenef       = fonction.getInitParam('code','75008');
var sVilleBenef            = fonction.getInitParam('ville', data.sVilleBenef);
var sPays                  = fonction.getInitParam('pays', data.sPays);
var sNumeroBenef           = fonction.getInitParam('numero','7508');
var sEmailBenef            = fonction.getInitParam('email', data.sEmailBenef);
var sNomContactBenef       = fonction.getInitParam('contact', data.sNomContactBenef);
var sTelephoneBenef        = fonction.getInitParam('telephone','0468606501');
var sBeneficiaire          = fonction.getInitParam('beneficiaire', data.sBeneficiaire);
var sNumSIRENBenef         = fonction.getInitParam('numeroSIREN','311472359');
var sNumNRABenef           = fonction.getInitParam('numeroNRA','W763001885');

//---------------------------------------------------------------------------------//

test.describe.serial ('[' + xRefTest + ']', () => {

	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();		
		await fonction.openUrl(page);
	})

	test ('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe('Page [BENEFICIAIRES]', async () => {

		var sNomPage:string = 'beneficiaires';

		test('Page [BENEFICIAIRES] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		test.describe('Onglet [BENEFICIAIRES]', async () => {

			var nNomCasdeTest:string = 'CREER UN BENEFICAIRE';
			test.describe('[' + nNomCasdeTest + ']', async () => {

				test('Button [CREER BENEFICIAIRE] - Click', async () => {
					await fonction.clickAndWait(pageBenefBenef.buttonCreerBeneficiaire, page);
				})

				var sNomPopin:string = 'CREATION D\'UN BENEFICIAIRE';
				test.describe ('Popin [' + sNomPopin + ']', async () => {

					test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
						await fonction.popinVisible(page, sNomPopin , true);
					})

					test('InputField [NOM BENEFICIAIRE]', async () => {
						await fonction.sendKeys(pageBenefBenef.pPcbInputNomBenef, sNomBeneficiaire, false, 'Nom du bénéficiaire'); 
					})
					
					test('InputField [ADRESSE BENEFICIAIRE] = "' + sAdresseBenef + '"', async () => {
						await fonction.sendKeys(pageBenefBenef.pPcbInputAdresseBenef, sAdresseBenef, false, 'Adresse du bénéficiaire'); 
					})

					test('InputField [COMPLEMENT ADRESSE] = "' + sComplementAdresseBenef + '"', async () => {
						await fonction.sendKeys(pageBenefBenef.pPcbInputComplementAdresse, sComplementAdresseBenef, false, 'Adresse complète'); 
					})

					test('InputField [CODE POSTAL BENEFICIAIRE] = "' + sCodePostalBenef + '"', async () => {
						await fonction.sendKeys(pageBenefBenef.pPcbInputCodePostal, sCodePostalBenef, false, 'Code postal du bénéficiaire'); 
					})

					test('InputField [VILLE BENEFICIAIRE] = "' + sVilleBenef + '"', async () => {
						await fonction.sendKeys(pageBenefBenef.pPcbInputVille, sVilleBenef, false, 'Ville du bénéficiaire'); 
					})

					test('ListBox [PAYS BENEFICIAIRE] = "' + sPays + '" - Select', async () => {
						await fonction.clickElement(pageBenefBenef.pPcbListBoxPays);
						await fonction.clickElement(pageBenefBenef.pPcbListBoxItem.locator('span:text-is("'+sPays+'")'));
					})
				
					test('InputField [NUMERO BENEFICIAIRE] = "' + sNumeroBenef + '"', async () => {
						await fonction.sendKeys(pageBenefBenef.pPcbInputNumero, sNumeroBenef, false, 'Numéro du bénéficiaire'); 
					})

					test('DatePicker [DATE] = "Aujourd\'hui"', async () => {
						await fonction.clickElement(pageBenefBenef.pPcbdatePicker);
						await fonction.clickElement(pageBenefBenef.datePickercbButtonAjourdhui);
					})

					test('InputField [EMAIL BENEFICIAIRE] = "' + sEmailBenef + '"', async () => {
						await fonction.sendKeys(pageBenefBenef.pPcbInputEmail.locator('input'), sEmailBenef, false, 'Email du bénéficiaire'); 
					})
					
					test('InputField [EMAIL BENEFICIAIRE.EDITION.LABEL_EMAIL_RECAPITULATIFS] = "' + sEmailBenef + '"', async () => {
						await fonction.sendKeys(pageBenefBenef.pPcbInputBeneficiaireEmailRecap, sEmailBenef, false, 'Email du bénéficiaire'); 
					})
					test('InputField [BENEFICIAIRE.EDITION.LABEL_EMAIL_ATTESTATIONS] = "' + sEmailBenef + '"', async () => {
						await fonction.sendKeys(pageBenefBenef.pPcbInputBeneficiaireEmailAttes, sEmailBenef, false, 'Email du bénéficiaire'); 
					})

					test('InputField [NOM CONTACT BENEFICIAIRE] = "' + sNomContactBenef + '"', async () => {
						await fonction.sendKeys(pageBenefBenef.pPcbInputNomContact, sNomContactBenef, false, 'Non contact du bénéficiaire'); 
					})

					test('InputField [TELEPHONE BENEFICIAIRE] = "' + sTelephoneBenef + '"', async () => {
						await fonction.sendKeys(pageBenefBenef.pPcbInputTelephone, sTelephoneBenef, false, 'Téléphone du bénéficiaire'); 
					})

					test('ListBox [GROUPE][first]" - Select', async () => {
						await fonction.clickElement(pageBenefBenef.pPcbListBoxGroupe)
						await fonction.clickElement(pageBenefBenef.pPcbListBoxItem.first());
					})

					test('InputField [BENEFICIAIRE] = "' + sBeneficiaire + '"', async () => {
						var oData:AutoComplete = {
							libelle         :'BENEFICIAIRE',
							inputLocator    : pageBenefBenef.pPcbInputOperepourleCompte,
							inputValue      : sBeneficiaire,
							choiceSelector  : 'button.dropdown-item:NOT(.btn-link)',
							choicePosition  : 0,
							typingDelay     : 100,
							waitBefore      : 500,
							page            : page,
						}
						await fonction.autoComplete(oData);
					})

					test("RadioButton [OBJET DE L'ASSOCIATION FONDATION]" , async () => {
						await fonction.clickElement(pageBenefBenef.pPcbRadiobuttonAssociatAideAliment); 
					})
					
					test('InputField [NUMERO SIREN] = "' + sNumSIRENBenef + '"', async () => {
						await fonction.sendKeys(pageBenefBenef.pPcbInputNumSIREN, sNumSIRENBenef, false, 'Numéro SIREN'); 
					})

					test('InputField [NUMERO NRA] = "' + sNumNRABenef + '"', async () => {
						await fonction.sendKeys(pageBenefBenef.pPcbInputNumNRA, sNumNRABenef, false, 'Numéro NRA'); 
					})

					test('Button [ENREGISTRER] - Click', async () => {
						await fonction.clickAndWait(pageBenefBenef.pPcbButtonEnregistrer, page);                        
					})

					test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
						await fonction.popinVisible(page, sNomPopin , false);
					})
				})

				var sTexte:string;
				test.describe ("[VERIFICATION DE LA CREATION D'UN BENEFICIAIRE]", async () => {

					test('Input [BENEFICIAIRE]', async () => { 
						 await fonction.sendKeys(pageBenefBenef.dataGridInputNomBeneficiaire, "Ta_beneficiaire. " + fonction.getToday('FR'), false, 'Désignation');
					 })

					test('Input [VILLE] = "' + sVilleBenef + '"', async () => {
						 await fonction.sendKeys(pageBenefBenef.dataGridInputVille, sVilleBenef, false, 'Ville');  
					})

					test('Input [RAISON SOCIALE]', async () => { 
						 await fonction.sendKeys(pageBenefBenef.dataGridInputSociete, 'Prosol sas');  
					})

					test('Label [BENEFICIAIRE (VILLE)] - Check', async () => {
						 await fonction.wait(page, 800);
						 sTexte = await pageBenefBenef.dataGridLabelBeneficiaire.textContent();
						 expect(sTexte).toContain('Ta_beneficiaire.');
					})

					test('Label [VILLE] - Check', async () => {
						 sTexte = await pageBenefBenef.dataGridLabelVille.textContent();
						 expect(sTexte).toContain(sVilleBenef);
					})
	
					test('Label [SOCIETE DONATRICE] - Check', async () => {
						 sTexte = await pageBenefBenef.dataGridLabelSocieteDonatrice.textContent();
						 expect(sTexte).toContain('Prosol sas');
					})
				})
			})    
		})
	})

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

	test('** CHECK FLUX **', async () => {
		var oFlux:TypeEsb = { 
			"FLUX" : [
				{
					"NOM_FLUX" : "Diffuser_BeneficiaireDons",
					STOP_ON_FAILURE  : false
				},
				{
					"NOM_FLUX" : "EnvoyerBeneficiaireDons_Stock",
					STOP_ON_FAILURE  : false
				},
				{
					"NOM_FLUX" : "EnvoyerBeneficiaireDons_Mag",
					STOP_ON_FAILURE  : false
				}
			],
			"WAIT_BEFORE"      : 5000,
		}
		await esb.checkFlux(oFlux, page);
	})
})
