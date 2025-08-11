/**
 * 
 * @author JOSIAS SIE
 * @since 2024-12-12
 *  
 */
const xRefTest      = "DON_DET_CMD";
const xDescription  = "Création d'un DON";
const xIdTest       = 4713;
const xVersion      = '3.0.1';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'DONS',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,    
	help        : [],
	params      : ['societeDonatrice', 'beneficiaire', 'montant', 'commentaire'],
	fileName    : __filename
}

//------------------------------------------------------------------------------------//

import { expect, test, type Page }   from '@playwright/test';

import { Help }                      from '@helpers/helpers';
import { TestFunctions }             from '@helpers/functions';
import { Log }                       from '@helpers/log';

import { MenuDon }                   from '@pom/DON/menu.page';
import { DetailDons }                from '@pom/DON/dons-detail-dons.page';

import { AutoComplete, CartoucheInfo}from '@commun/types/index';

//------------------------------------------------------------------------------------//

let page                : Page;
let menu                : MenuDon;
let pageDonsDetail      : DetailDons;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------//

const sJddFile          = fonction.getLocalConfig('jddDetailDon');
const data              = fonction.readFile(sJddFile);

//-----------------------------------------------------------------------------------//

var sSocieteDonatrice   = fonction.getInitParam('societeDonatrice', data.sSocieteDonatrice);
var sBeneficiaire       = fonction.getInitParam('beneficiaire', data.sBeneficiaire);
var iMontantDon         = fonction.getInitParam('montant', data.iMontantDon);
var sCommentaire        = fonction.getInitParam('commentaire', 'TA_Commentaire ajouté le ' + fonction.getToday('FR') + ' ' + fonction.getBadChars());

//----------------------------------------------------------------------------------//

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage();
	menu                = new MenuDon(page, fonction);    
	pageDonsDetail      = new DetailDons(page);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

test.describe.serial ('[' + xRefTest + ']', () => {

	test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();		
		await fonction.openUrl(page);
	})

	test('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe ('Page [DONS]', async () => {

		var sNomPage:string = 'dons';

		test('Page [DONS] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		var sNomOnglet:string = 'DETAIL DES DONS';
		test.describe ('Onglet [' + sNomOnglet + ']', async () => {

			test('Button [CREER] - Click', async () => {
				await fonction.clickAndWait(pageDonsDetail.buttonCreerDon, page);
			})

			var sNomPopin:string = 'CREER UN DON';
			test.describe ('Popin [' + sNomPopin + ']', async () => {

				test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin , true);
                })
				
				test('InputField [SOCIETE DONATRICE] = "' + sSocieteDonatrice + '"', async () => {
					var oData:AutoComplete = {
						libelle         :'SOCIETE DONATRICE',
						inputLocator    : pageDonsDetail.pPcdInputSocieteDonatrice,
						inputValue      : sSocieteDonatrice,
						choiceSelector  : 'button.dropdown-item:NOT(.btn-link)',
						choicePosition  : 0,
						typingDelay     : 100,
						waitBefore      : 500,
						page            : page,
					}
					await fonction.autoComplete(oData);
				})

				test('InputField [BENEFICIAIRE] = "' + sBeneficiaire + '"', async () => {
					var oData:AutoComplete = {
						libelle         :'BENEFICIAIRE',
						inputLocator    : pageDonsDetail.pPcdInputBeneficiaire,
						inputValue      : sBeneficiaire,
						choiceSelector  : 'button.dropdown-item:NOT(.btn-link)',
						choicePosition  : 0,
						typingDelay     : 100,
						waitBefore      : 500,
						page            : page,
					}
					await fonction.autoComplete(oData);
				})

				test('DatePicker [DATE] = "Aujourd\'hui"', async () => {
					await fonction.clickElement(pageDonsDetail.pPcddatePickerCreerDon, page);
					await fonction.clickElement(pageDonsDetail.datePickercdButtonAjourdhui);
				})

				test('InputField [MONTANT DU DON] = "' + iMontantDon + '"', async () => {
					await fonction.sendKeys(pageDonsDetail.pPcdInputMontantduDon, iMontantDon, false, "Montant du don"); 
				})

				test('TexteArea [COMMENTAIRE] = "' + sCommentaire + '"', async () => {
					await fonction.sendKeys(pageDonsDetail.pPtextAreaCommentaire, sCommentaire, false, 'Commentaire');
				})
											  
				test('Button [ENREGISTER] - Click', async () => {       
					await fonction.clickAndWait(pageDonsDetail.pPcdButtonEnregistrer, page); // On enregistre
				})

				test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
					await fonction.popinVisible(page, sNomPopin , false);
				})
			})

			test.describe ('VERIFICATION ENREGISTEMENT', async () => {
				var sTexte:string;
				test('InputField [SOCIETE DONATRICE] = "' + sSocieteDonatrice + '"', async () => {
					var oData:AutoComplete = {
						libelle         :'SOCIETE DONATRICE',
						inputLocator    : pageDonsDetail.inputSocieteDonatriceDetailDon,
						inputValue      : sSocieteDonatrice,
						choiceSelector  : 'button.dropdown-item:NOT(.btn-link)',
						choicePosition  : 0,
						typingDelay     : 100,
						waitBefore      : 500,
						page            : page,
					}
					await fonction.autoComplete(oData);
				})

				test('InputField [BENEFICIAIRE] = "' + sBeneficiaire + '"', async () => {
					var oData:AutoComplete = {
						libelle         :'BENEFICIAIRE',
						inputLocator    : pageDonsDetail.inputBeneficiaireDetailDon,
						inputValue      : sBeneficiaire,
						choiceSelector  : 'button.dropdown-item:NOT(.btn-link)',
						choicePosition  : 0,
						typingDelay     : 100,
						waitBefore      : 500,
						page            : page,
					}
					await fonction.autoComplete(oData);
				})

				test('Button [RECHERCHER LE DON] - Click', async () => {            
					await fonction.clickAndWait(pageDonsDetail.buttonRechercherlesDons, page);             
				})

				test('Header [DATE] - Click x 2', async () => {
					await fonction.clickElement(pageDonsDetail.dataGridDate);
					await fonction.clickElement(pageDonsDetail.dataGridDate);
				})

				test('Label [BENEFICIAIRE (VILLE)][0] = "' +sBeneficiaire + '" - Check', async () => {
					sTexte = await pageDonsDetail.dataGridListeBenefVille.nth(0).textContent();
					expect(sTexte.toUpperCase()).toContain(sBeneficiaire);
				})

				test('Label [SOCIETE DONATRICE][0] = "' + sSocieteDonatrice + '" - Check', async () => {
					sTexte = await pageDonsDetail.dataGridListeSctDonatrices.nth(0).textContent();
					expect(sTexte.toUpperCase()).toContain(sSocieteDonatrice);
				})

				var sDateDuJour = fonction.getToday('FR');
				test('Label [DATE][0]] = "' + sDateDuJour + '" - Check', async () => {
					sTexte = await pageDonsDetail.dataGridListeDates.nth(0).textContent();
					sTexte = sTexte.replace(/\//g, ''); // Suppression des / dans la date
					sTexte = sTexte.replace(/\s/g, ''); // Suppression des espaces
					expect(sTexte).toContain(sDateDuJour);
				})

				test('Label [VALORISATION][0]] = "' +iMontantDon + '" - Check', async () => {
					sTexte = await pageDonsDetail.dataGridListeMontants.nth(0).textContent();

					// La valeur affichée a été mise au format monétaire. Il faut la remettre au format numérique avant comparaison avec la valeur attentue
					// Ex : 8 888,888 € => 8888.888
					sTexte = sTexte.replace(/\s/g, ''); // Suppression des espaces
					sTexte = sTexte.replace(/€/g, '');  // Suppression du symbole monétaire
					sTexte = sTexte.replace(/,/g, '.'); // Substitutuion du séparateur de décimales
					expect(sTexte).toContain(iMontantDon.toString());
				})
			})
		})
	})

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})
