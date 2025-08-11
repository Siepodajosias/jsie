/**
 * 
 * @author JOSIAS SIE
 * @since 2025-01-13
 *  
 */
const xRefTest      = "SOC_SCT_TSS";
const xDescription  = "Contrôler les saisies pour la TVA et les numéros Siren et Siret";
const xIdTest       = 9726;
const xVersion      = '3.7';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'SOCIETES',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['raisonSociale','formeJuridique', 'activite','compteAttente','baseComptable','compteBancaire'],
    fileName    : __filename
}

//------------------------------------------------------------------------------------

import { test, type Page, expect }             from '@playwright/test';

import { Help }                                from '@helpers/helpers.js';
import { TestFunctions }                       from '@helpers/functions.js';
import { Log }                                 from '@helpers/log.js';
import { EsbFunctions }                        from '@helpers/esb.js';

import { MenuSociete }                         from '@pom/SOC/menu.page.js';
import { PageSocietes }                        from '@pom/SOC/societes.page.js';

import { CartoucheInfo, TypeEsb }              from '@commun/types/index';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuSociete;

let pageSociete         : PageSocietes;

const log               = new Log();
const fonction          = new TestFunctions(log);
let esb                 : EsbFunctions;
//------------------------------------------------------------------------------------ 

var sRaisonSociale  	= fonction.getInitParam('raisonSociale', '');
var sFormeJuridique 	= fonction.getInitParam('formeJuridique', 'Société En Nom Collectif');                                          
const sActivite         = fonction.getInitParam('activite', 'Magasin');
const sCompteAttente    = fonction.getInitParam('compteAttente', '4110000');
const sBaseComptable    = fonction.getInitParam('baseComptable', 'PROSOL2');
const sCompteBancaire   = fonction.getInitParam('compteBancaire', '5121000 - BNL');

sRaisonSociale      	=  sRaisonSociale ? sRaisonSociale : 'TA_societe. ' + fonction.getToday('FR')+' '+fonction.getHMS(':');

//--------------------Randomisation des valeurs---------------------------------------

const iDelaiEncaisse    = Math.floor((fonction.random() * 119) + 1);
var iCleSiret:any       = Math.floor((fonction.random() * 8777877777) + 1);
var iNumSiren:any       = Math.floor((fonction.random() * 10000000000000));
var rTvaCee:any         = Math.floor((fonction.random() * 77777777777777) + 9);
var iCodeSite:any       = Math.floor((fonction.random() * 87778) + 1);

var sAbreviation        = 'TA_abreviation. ' + fonction.getToday('FR');
//---------------------------METHODE N°1----------------------------------------------    

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

const sAdresse1 = 'adresse-1.' + fonction.getToday('FR')+'@prosol.fr';
const sAdresse2 = 'adresse-2.' + fonction.getToday('FR')+'@prosol.fr';

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
test.describe.serial ('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async() => {
        await fonction.connexion(page);
    })

    test('P-dialog [ALERT][ERREUR][PAGE] - Check', async () => {
        await fonction.isErrorDisplayed(false, page);                     // Pas d'erreur affichée à priori au chargement de la page 
    })

    test.describe ('Page [ORGANISATION]', async () => {    

        var pageName:string = 'societes';

        test("Menu [LIEUX] - Click ", async() => {
            await menu.click(pageName, page);
        })

        test('P-dialog [ALER ERREUR][PAGE SOCIETES] - Check', async () => {
            await fonction.isErrorDisplayed(false, page);                 // Pas d'erreur affichée à priori au chargement de la page
        }) 

        test('Button [CREER UNE SOCIETE] - Click', async () => {
            await fonction.clickAndWait(pageSociete.buttonCreerSociete, page);
        })

        var sNomPopin:string = "Création d'une société";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

			//Les valeurs des champs permettant d'enregistrer la société (Siège social).

			test.describe ('Rubrique [SIEGE SOCIAL]', async () => {
				test('Input [RAISON SOCIALE]', async () => {
					await fonction.sendKeys(pageSociete.pPcreateInputRaisonSoc, sRaisonSociale, false, 'Désignation société');
				})
				
				test('CheckBox [LIEE A UN LIEU] - Click', async () => {
					await fonction.clickElement(pageSociete.pPcreateLieLieu);
				})
				
				test('InputField [ABREVIATION] = '+ sAbreviation +'', async () => {
					await fonction.sendKeys(pageSociete.pPcreateInputAbreviation, sAbreviation, false, 'Abréviation');
				})

				test('ListBox [ACTIVITE] ['+ sActivite +']', async () => {
					await fonction.ngClickListBox(pageSociete.pPcreateListBoxActivite, sActivite);
				})

				test('DatePicker [DATE PREMIERE REPARTIION][rnd] - Click', async () => {
					await fonction.clickElement(pageSociete.pPcreateDatePickerExer);
					await fonction.clickElement(pageSociete.pPcreateDatePickerToday);
				})

				test('Input [CODE SITE][Rnd]', async () => {
					await fonction.sendKeys(pageSociete.pPcreateInputCodeSite, iCodeSite, false, 'Code site');
				})

				test('ListBox [FORME JURIDIQUE] - Select', async () => {
					await fonction.ngClickListBox(pageSociete.pPcreateListBoxFormJuri, sFormeJuridique, pageSociete.pPcreateListBoxItem);
				})

				test('Button [ENREGISTRER] - Check', async () => {
					await expect(pageSociete.pPcreateBtnEnregistrer).toBeEnabled();
				})
		    })

			//Les valeurs aleatoires pour les champs : Cle siret et Numéro siren.

			test.describe ('Rubrique [VALEURS ALEATOIRES][CLE SIRET][NUMERO SIREN]', async () => {
				test('Input [CLE SIRET][Rnd]', async () => {
					var sCleSiret = iCleSiret.toString().slice(0,6);
					await fonction.sendKeys(pageSociete.pPcreateInputSiret, sCleSiret, false, 'Clé siret');
				})

				test('Label, button [NUMERO SIREN AND ENREGISTRER] - Check', async () => {
					await expect(pageSociete.pLabelleRequired.nth(0)).toBeVisible();
					await expect(pageSociete.pPcreateBtnEnregistrer).toBeDisabled();
				})

				test('Input [NUMERO SIREN][Rnd]', async () => {
					iNumSiren = iNumSiren.toString().slice(0,9);
					await fonction.sendKeys(pageSociete.pPcreateInputSiren, iNumSiren, false, 'SIREN');
				})

				test('Small, button [NUMERO SIREN AND ENREGISTRER] - Check', async () => {
					await fonction.wait(page, 250);
					await expect(pageSociete.pIconError).toBeVisible();
					await expect(pageSociete.pPErrorMessage).toBeVisible();
					await expect(pageSociete.pPcreateBtnEnregistrer).toBeDisabled();
				})
		    })

			//Les valeurs des champs : Cle siret et Numéro siren celon l'agorithme de luhn.

			test.describe ('Rubrique [VALEURS CELON ALGORITHME DE LUHN][CLE SIRET][NUMERO SIREN]', async () => {

				test('Input [NUMERO SIREN][Rnd]', async () => {
					iNumSiren          = iNumSiren.toString().slice(0,8);
					var sChiffreControl= calculChiffreControlLuhn(iNumSiren);
					iNumSiren          = iNumSiren + sChiffreControl;
					await fonction.sendKeys(pageSociete.pPcreateInputSiren, iNumSiren, false, 'Numéro SIREN');
					log.set('Numéro Siren : ' + iNumSiren);
				})

				test('Label [NUMERO SIREN] - Check', async () => {
					await fonction.wait(page, 250);
					await expect(pageSociete.pIconSuccess.nth(0)).toBeVisible();
				})

				test('Label, small, button [CLE SIRET AND ENREGISTRER] - Check', async () => {
					await expect(pageSociete.pIconError).toBeVisible();
					await expect(pageSociete.pPErrorMessage).toBeVisible();
					await expect(pageSociete.pPcreateBtnEnregistrer).toBeDisabled();
				})

				test('Input [CLE SIRET][Rnd]', async () => {
					iCleSiret          = iCleSiret.toString().slice(0,4);
					var sChiffreControl= calculChiffreControlLuhn(iNumSiren + iCleSiret);
					iCleSiret          = iCleSiret + sChiffreControl;
					await fonction.sendKeys(pageSociete.pPcreateInputSiret, iCleSiret, false, 'Clé siret');
					log.set('Clé siret : ' + iCleSiret);
				})

				test('Label [CLE SIRET AND ENREGISTRER] - Check', async () => {
					await fonction.wait(page, 250);
					await expect(pageSociete.pIconSuccess.nth(1)).toBeVisible();
					await expect(pageSociete.pPcreateBtnEnregistrer).toBeEnabled();
				})
		    })

			//Les valeurs aleatoires et celon l'agorithme de luhn du champs : TVA CEE.

			test.describe ('Rubrique [VALEURS ALEATOIRES][TVA CEE]', async () => {
				test('Input [TVA CEE][TA][Rnd]', async () => {
					await fonction.sendKeys(pageSociete.pPcreateInputTVACEE, "TA" + rTvaCee.toString().slice(0,11), false, 'TVA CEE (TA)');
				})

				test('Label [TVA CEE AND ENREGISTRER][TA] - Check', async () => {
					await fonction.wait(page, 250);
					await expect(pageSociete.pIconError).toBeVisible();
					await expect(pageSociete.pPErrorMessage).toBeVisible();
					await expect(pageSociete.pPcreateBtnEnregistrer).toBeDisabled();
				})

				test('Input [TVA CEE][FR][Rnd]', async () => {
					await fonction.sendKeys(pageSociete.pPcreateInputTVACEE, "FR" + rTvaCee.toString().slice(0,11), false, 'TVA CEE (FR)');
				})

				test('Label [TVA CEE AND ENREGISTRER][FR] - Check', async () => {
					await fonction.wait(page, 250);
					await expect(pageSociete.pIconError).toBeVisible();
					await expect(pageSociete.pPErrorMessage).toBeVisible();
					await expect(pageSociete.pPcreateBtnEnregistrer).toBeDisabled();
				})

				test('Input [VALEURS CELON ALGORITHME DE LUHN][TVA CEE][Rnd]', async () => {
					var cle:any       = (12 + 3 * (iNumSiren % 97)) % 97;
					if(cle.toString().length == 1){
						cle = '0'+cle;
					}
					rTvaCee           = "FR"+cle+iNumSiren;   
					await fonction.sendKeys(pageSociete.pPcreateInputTVACEE, rTvaCee, false, 'TVA CEE');
					log.set('TVA CEE : ' + rTvaCee);
				})
			})

			test('ListBox [COMPTE BANCAIRE] - Select', async () => {
				await fonction.ngClickListBox(pageSociete.pPcreateListBoxCptBanq, sCompteBancaire, pageSociete.pPcreateListBoxItem);
			})

			test('ListBoxItem [COMPTE D\'ATTENTE] - Select', async () => {
				await fonction.ngClickListBox(pageSociete.pPcreateListBoxCptAtten, sCompteAttente, pageSociete.pPcreateListBoxItem);
			})

			test('ListBox [BASE COMPTABLE] - Select', async () => {
				await fonction.ngClickListBox(pageSociete.pPcreateListBoxBaseCpt, sBaseComptable, pageSociete.pPcreateListBoxItem);
			})

			test('Input [DELAI ENCAISSEMENT][Rnd]', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputDelaiEncai, iDelaiEncaisse, false, 'Délai d\'encaissement');
			})

			test('Input [ADRESSE EMAIL][1] ['+ sAdresse1 +']', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputEmail, sAdresse1, false, 'E-mail');
				await page.press('p-chips[formcontrolname="emails"]', 'Enter');
			})

			test('Input [ADRESSE EMAIL][2] ['+ sAdresse2 +']', async () => {
				await fonction.sendKeys(pageSociete.pPcreateInputEmail, sAdresse2, false, 'E-mail');
				await page.press('p-chips[formcontrolname="emails"]', 'Enter');
			})

			test('Button [ENREGISTRER] - Click', async () => {
				await fonction.clickAndWait(pageSociete.pPcreateLinkAnnuler, page);
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

			test('Button [ALERT] [BUTTON][0] - Click', async () => {
				var isVisible = await pageSociete.pPcreateButtonAlert.nth(0).isVisible();
				if(isVisible){
					await fonction.clickElement(pageSociete.pPcreateButtonAlert.nth(0));
				}
			})
        })
    })   //-- End test.describe Page

    test('Déconnexion', async() => {
        await fonction.deconnexion(page);
    })

    test('** CHECK FLUX **', async () => {
		var oFlux:TypeEsb = { 
			"FLUX" : [
				{
					"NOM_FLUX" : "EnvoyerSociete_Don",
				},
				{
					"NOM_FLUX" : "EnvoyerSociete_X3",
				},
				{
					"NOM_FLUX" : "EnvoyerSociete_Prefac",
				}
			],
			"WAIT_BEFORE"      : 5000,
		}
		await esb.checkFlux(oFlux, page);
	})
})  //-- End test.describe