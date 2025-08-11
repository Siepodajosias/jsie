/**
 * 
 * @author JOSIAS SIE
 * @since 2023-12-22
 *  
 */
const xRefTest      = "SOC_ORG_ADX";
const xDescription  = "Créer une Direction d'Exploitation";
const xIdTest       = 5136;
const xVersion      = "3.1";
    
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'SOCIETES',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['responsable', 'designation', 'code'],
    fileName    : __filename
}

//------------------------------------------------------------------------------------

import { test, type Page }                  from '@playwright/test';

import { Help }                             from '@helpers/helpers.js';
import { TestFunctions }                    from '@helpers/functions.js';
import { Log }                              from '@helpers/log.js';

import { MenuSociete }                      from '@pom/SOC/menu.page.js';
import { PageOrganisation }                 from '@pom/SOC/organisation.page.js';
import { EsbFunctions }                     from '@helpers/esb.js';

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

const sResponsable      = fonction.getInitParam('responsable','Mikael'); //JCC Recette9
var sCode               = fonction.getInitParam('code',''); 
var sDesignation        = fonction.getInitParam('designation', 'TA_Direction'); 

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
        await fonction.isErrorDisplayed(false, page);             // Pas d'erreur affichée à priori au chargement de la page 
        // Randomisation du code direction compris entre TA555 et TA777
        if (sCode == '') {
            sCode      = "TA" + Math.floor((fonction.random() * 900) + 99);
            log.set('Code : ' + sCode);
        }
    })

    test.describe('Page [ORGANISATION]', () => {    

        var pageName = 'organisation';

        test("Menu [CLIENTS] - Click ", async () => {
            await menu.click(pageName, page);
        })

        test('P-dialog [ALER ERREUR][PAGE CLIENTS] - Check', async () => {
            await fonction.isErrorDisplayed(false, page);         // Pas d'erreur affichée à priori au chargement de la page 
        })

        test ('Button [CREER DIRECTION] - Click', async () => {
            await pageOrganisation.buttonGererDirection.hover(); // Survol Souris (hover)
            await fonction.wait(page, 800);
            await fonction.clickAndWait(pageOrganisation.buttonCreer, page);
        })

        var sNomPopin = "Création d'une direction d'exploitation";
        test.describe ('Popin ['+ sNomPopin.toUpperCase() +']', () => {
                        
            test ('Input [CODE][rnd]', async () => {
                await fonction.sendKeys(pageOrganisation.pPinputCode, sCode);
            })

            test ('Input [DESIGNATION]['+ sDesignation +']', async () => {
                await fonction.sendKeys(pageOrganisation.pPinputDesignation, sDesignation);
            })

            test('InputField [AUTOCOMPLETE][NOM RESPONSABLE] ['+ sResponsable +']', async () => {
                var oData:AutoComplete = {
                    libelle         :'NOM RESPONSABLE',
                    inputLocator    : pageOrganisation.pPinputNomResponsable,
                    inputValue      : sResponsable,
                    choiceSelector  : 'ngb-typeahead-window button',
                    choicePosition  : 0,
                    typingDelay     : 100,
                    waitBefore      : 500,
                    page            : page,
                }
                await fonction.autoComplete(oData);
            })

            test ('CheckBox [TOUS GROUPES ARTICLES] - Check', async () => {
                await fonction.clickElement(pageOrganisation.pPcheckBoxAllGrpArticle);
            })

            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickElement(pageOrganisation.pPbuttonEnregistrer);
            })
        })
    })  //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

    test('** CHECK FLUX **', async () => {
        if (sCode) {
            var oFlux = { 
                "FLUX" : [
                    {
                        "NOM_FLUX" : "Diffuser_OrganisationDirection",
                        STOP_ON_FAILURE  : false
                    },
                    {
                        "NOM_FLUX" : "EnvoyerOrganisationDirection_Budget",
                        STOP_ON_FAILURE  : false
                    },
                    {
                        "NOM_FLUX" : "EnvoyerOrganisationDirection_Mag",
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