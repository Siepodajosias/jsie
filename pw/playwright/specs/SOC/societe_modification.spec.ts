/**
 * 
 * @author JOSIAS SIE
 * @since 2023-11-27
 *  
 */
const xRefTest      = "SOC_SCT_MOD";
const xDescription  = "Modifier une société (sans client) en lien avec un lieu de vente";
const xIdTest       = 8328;
const xVersion      = '3.15';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'SOCIETES',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['tvaCee','exonereInterfel','codeSite', 'produits','compteAttente','baseComptable','compteBancaire','capital','raisonSociale','universMetier'],
	fileName    : __filename
}

//------------------------------------------------------------------------------------

import { expect, test, type Page }          from '@playwright/test';

import { Help }                             from '@helpers/helpers';
import { TestFunctions }                    from '@helpers/functions';
import { Log }                              from '@helpers/log';
import { EsbFunctions }                     from '@helpers/esb';

import { MenuSociete }                      from '@pom/SOC/menu.page';
import { PageSocietes }                     from '@pom/SOC/societes.page';

import { CartoucheInfo, TypeEsb } 			from '@commun/types/index';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuSociete;

let pageSociete         : PageSocietes;
let esb                 : EsbFunctions;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------ 

test.beforeAll(async ({ browser }, testInfo) => {
	page                = await browser.newPage();
	menu                = new MenuSociete(page, fonction);    
	pageSociete         = new PageSocietes(page);
	esb                 = new EsbFunctions(fonction);
	const helper        = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

var oData:any           = fonction.importJdd();

var rTvaCee             = fonction.getInitParam('tvaCee', '');                       // Envoi d'une chaine voide pour déclencher la randomisation de cette valeur
var iCodeSite:any       = fonction.getInitParam('codeSite', '');                     // Envoi d'une chaine voide pour déclencher la randomisation de cette valeur
const sUniversMetier    = fonction.getInitParam('universMetier', 'Magasin');
const sProduits         = fonction.getInitParam('produits', 'FL et Poisson');// Libre service (pour l'enseigne fresh)
const sCompteAttente    = fonction.getInitParam('compteAttente', '5110000');
const sBaseComptable    = fonction.getInitParam('baseComptable', 'PROSOL2');
const sCompteBancaire   = fonction.getInitParam('compteBancaire', '5121700 - Banque populaire');
const iCapital          = fonction.getInitParam('capital', '777');
const sExonereInterfel  = fonction.getInitParam('exonereInterfel', '');
var   sRaisonSociale    = fonction.getInitParam('raisonSociale', '');

var sCodeSocieteCompt   = ""
const iNumDpt           = Math.floor((fonction.random() * 77) + 1);
const iNumRCS           = Math.floor((fonction.random() * 77778) + 1);
const iDelaiEncaisse    = Math.floor((fonction.random() * 119) + 1);
var   iNumSiren:any     = Math.floor((fonction.random() * 10000000000000));
//------------------------------------------------------------------------------------
const sAdresse1         = 'adresse-1.' + fonction.getToday('FR')+'@prosol.fr';
const sAdresse2         = 'adresse-2.' + fonction.getToday('FR')+'@prosol.fr';

//------------------------------------------------------------------------------------    

/**
 * Calcul le chiffre de contrôle pour une séquence de chiffre (38347078) selon l'algorithme de Luhn.
 * @param nombre 
 * @returns number
 */
var calculChiffreControlLuhn = (nombre: string) => {
    const digits= nombre.split("").reverse().map(Number);
    const somme = digits.reduce((cumul, digit, index) => {
        if (index % 2 === 0) {
            // Doublage des chiffres en position impaire
            const double = digit * 2;
            return cumul + (double > 9 ? double - 9 : double);
        } else {
            return cumul + digit;
        }
       }, 0
    );

    const control = (10 - (somme % 10)) % 10; // Rendre le total un multiple de 10
    return control;
}

//------------------------------------------------------------------------------------ 

// Randomisation du code direction compris entre TA000 et TA777
if (iCodeSite == '') {
	iCodeSite = Math.floor((fonction.random() * 87778) + 1);
	log.set('Code Site : ' + iCodeSite);
}

// Randomisation de la TVA CEE comprise entre 8.00 et 8.99
if (rTvaCee == '') {
	iNumSiren          = iNumSiren.toString().slice(0,8);
	var sChiffreControl= calculChiffreControlLuhn(iNumSiren);
	iNumSiren          = iNumSiren + sChiffreControl;
    var cle:any        = ((iNumSiren % 97) * 3  + 12 ) % 97;
	if(cle.toString().length == 1){
		cle = '0'+cle;
	}
	rTvaCee = "FR"+cle+iNumSiren;
	log.set('TVA CEE : ' + rTvaCee);
}    

//------------------------------------------------------------------------------------

if (oData !== undefined) {                           // On est dans le cadre d'un E2E. Récupération des données temporaires
	sCodeSocieteCompt    = oData.sCodeSociete
	var sRaisonSocialeE2E= oData.sRaisonSociale;     // L'élément recherché est la raison sociale préalablement créé dans le E2E
		sRaisonSociale   = sRaisonSocialeE2E;        // Récupération de la raison sociale 
	log.set('E2E - Raison Sociale : '+ sRaisonSocialeE2E);
	log.set('E2E - Code société comptable : ' + sCodeSocieteCompt);

}

//------------------------------------------------------------------------------------
process.env.ROLE         = 'COMPTABLE';// Connexion par défaut avec le profil ayant le Role COMPTABLE
//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

	test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

	test('Connexion', async () => {
		await fonction.connexion(page);
	})

	test('PMessage [ERREUR] - Is Not Visible', async () => {
		await fonction.isErrorDisplayed(false, page);                     // Pas d'erreur affichée à priori au chargement de la page 
	})

	test.describe ('Page [SOCIETES]', async () => {    

		var pageName:string = 'societes';

		test("Menu [SOCIETES] - Click ", async () => {
			await menu.click(pageName, page);
		})

		test('** Wait Until Spinner Off #1 **', async () => {
			await fonction.waitForSpinner(pageSociete.spinnerLoading, 180000);
		})

		test('Message [ERREUR] - Is Not Visible', async () => {
			await fonction.isErrorDisplayed(false, page);                 // Pas d'erreur affichée à priori au chargement de la page 
		}) 

		test.describe ('Datagrid [SOCIETE][first]', async () => {

			test ('Input [FILTRE][RAISON SOCIALE] ['+ sRaisonSociale +']', async () => {
				await fonction.sendKeys(pageSociete.tableInputFiltre.nth(3), sRaisonSociale, false, 'Raison Sociale'); 
			})

			test ('Tr [SOCIETE][0] - Click', async () => {
				await fonction.wait(page, 250);
				await fonction.clickElement(pageSociete.dataTrSocietesGest.nth(0));
			})

			test ('Icon [NON VALIDE] - Is Visible', async () => {
				await expect(pageSociete.iconNonValide).toBeVisible();
			})

			test ('Button [MODIFIER UNE SOCIETE] - Click', async () => {
				await fonction.clickAndWait(pageSociete.buttonModifierSociete, page);
			})
		})

		var sNomPopin:string = "Modification d'une société";
		test.describe ('Popin [' + sNomPopin.toUpperCase() + '][first]', async () => {

			test ('Popin [' + sNomPopin.toUpperCase() + '] - Is visble', async () => {
				await fonction.popinVisible(page, sNomPopin, true);
			})

			test ('Checkbox [LIEE A UN LIEU] - Is Enabled', async () => {
				await expect(pageSociete.pPcreateLieLieu.locator('div.p-disabled')).toBeEnabled();
			})

			test ('ListBox [UNIVERS METIER] ['+ sUniversMetier +']', async () => {
				await fonction.clickElement(pageSociete.pPcreateListBoxUniversMetier);
				await fonction.clickElement(pageSociete.pListBoxItem.locator('li').locator('span:text-is("'+sUniversMetier+'")'));

				await fonction.addDataSheet('ListBox', 'Univers Metier', sUniversMetier);
			})

			test ('ListBox [PRODUITS] ['+ sProduits +']', async () => {
				await fonction.clickElement(pageSociete.pPcreateListBoxProduits);
				await fonction.clickElement(pageSociete.pListBoxItem.locator('li').locator('span:text-is("'+sProduits+'")'));

				await fonction.addDataSheet('ListBox', 'Produits', sProduits);
			})

			test ('Span [CODE SOCIETE] - Expect', async () => {
				var sLabel   = await pageSociete.pPcreatePrefixeCode.textContent();
				var sEnseigne= await pageSociete.pPcreateListBoxEnseigne.locator('span').textContent();
				var sPrefixe = sEnseigne.charAt(0)+sProduits.charAt(0);
				expect(sLabel).toContain(sPrefixe.toUpperCase());
			})

			test ('Icon [CODE SOCIETE] = 0', async () => {
				expect(await pageSociete.iconCodeSociete.count()).toBe(0);
			})

			test ('Input [CODE SITE][Rnd]', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputCodeSite, iCodeSite, false, 'Code Site');
			})

			test ('Input [TVA CEE][Rnd]', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputTVACEE, rTvaCee, false, 'TVA CEE');
			})

			test ('ListBox [COMPTE D\'ATTENTE] - Click', async () => {
				await fonction.clickElement(pageSociete.pPcreateListBoxCptAtten);
			})

			if (sCompteAttente === '') {                                     // Pas de compte d'attente précis fournit, on sélectionne au hasard
				test ('ListBoxItem [COMPTE D\'ATTENTE] - Select', async () => {
					await fonction.ngClickRndListChoice(pageSociete.pListBoxItem, true);
				})
			}else{
				test ('ListBoxItem [COMPTE D\'ATTENTE] - Select', async () => {
					await fonction.clickElement(pageSociete.pPcreateListBoxItem.filter({hasText: sCompteAttente}).nth(0));
					await fonction.addDataSheet('ListBox', 'Compte d\'attente', sCompteAttente);
				})
			}

			test ('ListBox [BASE COMPTABLE] - Click', async () => {
				await fonction.clickElement(pageSociete.pPcreateListBoxBaseCpt);
			})

			if (sBaseComptable === '') {                                     // Pas de base comptable précis fournit, on sélectionne au hasard
				test ('ListBoxItem [BASE COMPTABLE] - Select', async () => {
					await fonction.ngClickRndListChoice(pageSociete.pListBoxItem, true);
				})
			}else{
				test ('ListBox [BASE COMPTABLE] - Select', async () => {
					await fonction.clickElement(pageSociete.pPcreateListBoxItem.filter({hasText: sBaseComptable}).nth(0));
					await fonction.addDataSheet('ListBox', 'Base Comptable', sBaseComptable);
				})
			}

			test ('Input [DELAI ENCAISSEMENT][Rnd]', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputDelaiEncai, iDelaiEncaisse, false, 'Délai Encaissement');
			})

			test ('Button [ENREGISTRER] - Click', async () => {
				await fonction.clickAndWait(pageSociete.pPcreateBtnEnregistrer, page);
				await fonction.wait(page, 250);
			})

			test ('Popin [' + sNomPopin.toUpperCase() + '] - Is not visble', async () => {
				await fonction.popinVisible(page, sNomPopin, false);
			}) 
		})

		test('** Wait Until Spinner Off #2 **', async () => {
			await fonction.waitForSpinner(pageSociete.spinnerLoading, 180000);
		})

		test.describe ('Datagrid [SOCIETE][second]', async () => {

			test ('Input [FILTRE][RAISON SOCIALE] ['+ sCodeSocieteCompt +']', async () => {
				await fonction.sendKeys(pageSociete.tableInputFiltre.nth(1), sCodeSocieteCompt, false, 'Raison Sociale'); 
			})

			test ('Tr [SOCIETE][0] - Click', async () => {
				await fonction.wait(page, 250);
				await fonction.clickElement(pageSociete.dataTrSocietesGest.nth(0));
			})

			test ('Icon [NON VALIDE] = 0', async () => {
				expect(await pageSociete.iconNonValide.count()).toBe(0);
			})

			test ('Button [MODIFIER UNE SOCIETE] - Click', async () => {
				await fonction.clickAndWait(pageSociete.buttonModifierSociete, page);
			})
		})

		test.describe ('Popin [' + sNomPopin.toUpperCase() + '][second]', async () => {

			test ('Popin [' + sNomPopin.toUpperCase() + '] - Is visble', async () => {
				await fonction.popinVisible(page, sNomPopin, true);
			})

			test ('DatePicker [DATE PREMIERE REPARTIION][rnd] - Click', async () => {
				await fonction.clickElement(pageSociete.pPcreateDatePickerExer);
				await fonction.clickElement(pageSociete.pPcreateDatePickerToday);
			})

			test ('Input [SIREN][Rnd]', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputSiren, iNumSiren, false, 'SIREN');
			})

			test ('Input [CODE SITE][Rnd]', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputCodeSite, iCodeSite, false, 'Code Site');
			})
			
			test ('Input [DEPARTEMENT][Rnd]', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputDpt, iNumDpt, false, 'Département');
			})

			test ('Input [LIEU RCS][Rnd]', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputLieuRCS, iNumRCS, false, 'Lieu RCS');
			})

			test ('Input [CAPITAL] ['+ iCapital +']', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputCapital, iCapital, false, 'Capital');
			})

			test ('ListBox [COMPTE BANCAIRE] - Click', async () => {
				await fonction.clickElement(pageSociete.pPcreateListBoxCptBanq);
			})

			if (sCompteBancaire === '') {                                     // Pas de compte bancaire précis fournit, on sélectionne au hasard
				test ('ListBoxItem [COMPTE BANCAIRE] - Select', async () => {
					await fonction.ngClickRndListChoice(pageSociete.pListBoxItem, true);
				})
			}else{
				test ('ListBoxItem [COMPTE BANCAIRE] - Select', async () => {
					await fonction.clickElement(pageSociete.pPcreateListBoxItem.filter({hasText: sCompteBancaire}).nth(0));
				})
			}

			test ('CheckBox [RECEVOIR RECETTES] - Click', async () => {
				await fonction.clickElement(pageSociete.pPcreateCheckBoxRecRece);
			})

			test ('CheckBox [FLUX ENCAISSEMENT] - Click', async () => {
				await fonction.clickElement(pageSociete.pPcreateCheckBoxFluxEnc);
			})
	
			if(sExonereInterfel != ''){
				test ('CheckBox [EXONERATION INTERFEL] - Click', async () => {
					await fonction.clickCheckBox(pageSociete.pPcreateCheckBoxINTERFEL, 0.5, false);
				})
			}
						
			test ('Input [ADRESSE EMAIL][1] ['+ sAdresse1 +']', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputEmail, sAdresse1, false, 'Email 1');
				await page.press('p-chips[formcontrolname="emails"]', 'Enter');
			})

			test ('Input [ADRESSE EMAIL][2] ['+ sAdresse2 +']', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputEmail, sAdresse2, false, 'Email 2');
				await page.press('p-chips[formcontrolname="emails"]', 'Enter');
			})
			
			test('Button [ENREGISTRER] - Click', async () => {
				await fonction.clickAndWait(pageSociete.pPcreateBtnEnregistrer, page);
				await fonction.wait(page, 250);

				var present = await pageSociete.pErrorMessage.isVisible();
				if (present) {
					var error:any = await pageSociete.pErrorMessage.textContent(); 
					var errorMessage = error.slice(0,6);
					if(errorMessage == '[9100]'){
						await fonction.clickElement(pageSociete.pPcreateLinkAnnuler);
					}
				}
			})

			test ('** Wait Until Spinner Off **', async () => {
				await fonction.waitForSpinner(pageSociete.pPcreateSpanSpinner);
			})

			test ('Popin [' + sNomPopin.toUpperCase() + '] - Is not visble', async () => {
				await fonction.popinVisible(page, sNomPopin, false);
			}) 
		})
	})  //-- End Describe Page

	test('Déconnexion', async() => {
		// Si on est dans le cadre d'un E2E, sauvegarde des données pour le scénario suivant
		await fonction.deconnexion(page);
	})

	test('** CHECK FLUX **', async () => { 
			var oFlux:TypeEsb = { 
				"FLUX" : [
					{
						"NOM_FLUX" : "EnvoyerSociete_Don",
						STOP_ON_FAILURE  : false
					},
					{
						"NOM_FLUX" : "EnvoyerSociete_X3",
						STOP_ON_FAILURE  : false
					},
					{
						"NOM_FLUX" : "EnvoyerSociete_Prefac",
						STOP_ON_FAILURE  : false
					}
				],
				"WAIT_BEFORE"      : 5000,
			}
		await esb.checkFlux(oFlux, page);
	})

})  //-- End Describe
