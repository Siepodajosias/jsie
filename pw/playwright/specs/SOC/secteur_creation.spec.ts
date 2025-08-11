/**
 * 
 * @author JOSIAS SIE
 * @since 2023-12-19
 *  
 */
const xRefTest      = "SOC_ORG_ASC";
const xDescription  = "Créer/Exporter un secteur";
const xIdTest       = 5140;
const xVersion      = '3.2';
    
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'SOCIETES',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['responsable', 'designation', 'code', 'region'],
    fileName    : __filename
}

//------------------------------------------------------------------------------------

import { test, type Page }                  from '@playwright/test';

import { Help }                             from '@helpers/helpers';
import { TestFunctions }                    from '@helpers/functions';
import { Log }                              from '@helpers/log';
import { EsbFunctions }                     from '@helpers/esb';

import { MenuSociete }                      from '@pom/SOC/menu.page';
import { PageOrganisation }                 from '@pom/SOC/organisation.page';

import { AutoComplete, CartoucheInfo }      from '@commun/types/index';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuSociete;

let pageOrganisation    : PageOrganisation;
let esb                 : EsbFunctions;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------ 

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuSociete(page, fonction);    
    pageOrganisation    = new PageOrganisation(page);
    esb                 = new EsbFunctions(fonction);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

const sResponsable  = fonction.getInitParam('responsable','Damien'); //JCC Recette2
var sCode           = fonction.getInitParam('code', ''); 
var sDesignation    = fonction.getInitParam('designation', 'TA_Secteur'); 
var sRegion         = fonction.getInitParam('region', 'TA_Region'); 

//------------------------------------------------------------------------------------ 

test.describe.serial('[' + xRefTest + ']', () => {
  
    test('Ouverture URL :' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

    test('Connexion', async() => {
        await fonction.connexion(page);
    })

    test('P-dialog [ALERT][ERREUR][PAGE] - Check', async () => {
        await fonction.isErrorDisplayed(false, page);                     // Pas d'erreur affichée à priori au chargement de la page 
        // Randomisation du code direction compris entre TA555 et TA777
        if (sCode == '') {
            sCode = "TASEC" + Math.floor((fonction.random() * 900) + 99);
            log.set('Code : ' + sCode);
        }
    })

    test.describe('Page [ORGANISATION]', async () => {    

        var pageName = 'organisation';

        test("Menu [CLIENTS] - Click ", async () => {
            await menu.click(pageName, page);
        })

        test('P-dialog [ALER ERREUR][PAGE CLIENTS] - Check', async () => {
            await fonction.isErrorDisplayed(false, page);      // Pas d'erreur affichée à priori au chargement de la page 
        })
        test ('Button [CREER SECTEUR] - Click', async () => {
            await pageOrganisation.buttonGererSecteur.hover(); // Survol Souris (hover)
            await fonction.wait(page, 800);
            await fonction.clickElement(pageOrganisation.buttonCreer);
        })

        var sNomPopin = "Création d'un secteur";
        test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

            test ('ListBox [REGION] ['+ sRegion +']', async () => {
                await fonction.clickElement(pageOrganisation.pPseclistBoxRegion);

                await pageOrganisation.pListBoxRegion.first().waitFor({state:'visible'});
                var   region = new RegExp(sRegion, 'gi');
                await pageOrganisation.pListBoxRegion.filter({hasText: region}).nth(0).click();
            })
          
            test ('Input [CODE][rnd]', async () => {
                await fonction.sendKeys(pageOrganisation.pPsecInputCodeSecteur, sCode, false, 'Code'); 
            })

            test ('Input [DESIGNATION] ['+sDesignation+']', async () => {
               await fonction.sendKeys(pageOrganisation.pPsecInputDesignRegion, sDesignation, false, 'Désignation');
            })

            test('InputField [AUTOCOMPLETE][RESPONSABLE] ['+ sResponsable +']', async () => {
                var oData:AutoComplete = {
                    libelle         :'RESPONSABLE',
                    inputLocator    : pageOrganisation.pPsecAutoCompleteResp,
                    inputValue      : sResponsable,
                    choiceSelector  : 'ngb-typeahead-window button',
                    choicePosition  : 0,
                    typingDelay     : 100,
                    waitBefore      : 500,
                    page            : page,
                }
                await fonction.autoComplete(oData);
            })

            test ('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickElement(pageOrganisation.pPsecButtonEnregistrer);
                await fonction.wait(page, 250);

                var present = await pageOrganisation.pErrorMessage.isVisible();
                if (present) {
                    var error:any    = await pageOrganisation.pErrorMessage.textContent(); 
                    var errorMessage = error.substr(1,6);
                    if(errorMessage == '[9100]'){
                        await fonction.clickElement(pageOrganisation.pPregLinkAnnuler);
                    }
                }
            })
        })
    })  //-- End Describe Page

    test('Déconnexion', async () => {
        log.set("Code : " + sCode);
        log.set("Designation : " + sDesignation);
        log.set("Responsable : " + sResponsable);
        await fonction.deconnexion(page);
    })

    test('** CHECK FLUX **', async () => {
        if (sCode) {
            var oFlux = { 
                "FLUX" : [
                    {
                        "NOM_FLUX" : "Diffuser_OrganisationSecteur",
                        STOP_ON_FAILURE  : false
                    },
                    {
                        "NOM_FLUX" : "EnvoyerSecteurProsol_Pricing",
                        STOP_ON_FAILURE  : false
                    },
                    {
                        "NOM_FLUX" : "EnvoyerOrganisationSecteur_Budget",
                        STOP_ON_FAILURE  : false
                    },
                    {
                        "NOM_FLUX" : "EnvoyerOrganisationSecteur_Mag",
                        STOP_ON_FAILURE  : false
                    },
                    {
                        "NOM_FLUX" : "EnvoyerOrganisationSecteur_Qualite",
                        STOP_ON_FAILURE  : false
                    }
                ],
                "WAIT_BEFORE"      : 5000,
            }
            await esb.checkFlux(oFlux, page);
        } else {
            log.set('Check Flux : ACTION ANNULEE');
            test.skip();
        }
    })
    
})  //-- End Describe