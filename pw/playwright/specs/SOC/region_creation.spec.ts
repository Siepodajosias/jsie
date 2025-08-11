/**
 * 
 * @author JOSIAS SIE
 * @since 2023-12-21
 *  
 */
const xRefTest      = "SOC_ORG_ARG";
const xDescription  = "Créer une Région";
const xIdTest       = 7418;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'SOCIETES',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['directionRegion','responsable', 'designation', 'code', 'directionExploitation'],
    fileName    : __filename
}

//------------------------------------------------------------------------------------

import { test, type Page }                  from '@playwright/test';

import { Help }                             from '@helpers/helpers.js';
import { TestFunctions }                    from '@helpers/functions.js';
import { Log }                              from '@helpers/log.js';
import { EsbFunctions }                     from '@helpers/esb.js';

import { MenuSociete }                      from '@pom/SOC/menu.page.js';
import { PageOrganisation }                 from '@pom/SOC/organisation.page.js';

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

const sDirRegion    = fonction.getInitParam('directionRegion', 'Mikael'); //JCC Recette4
var sCode           = fonction.getInitParam('code',''); 
var sDesignation    = fonction.getInitParam('designation','TA_Region'); 
var sDirExploit     = fonction.getInitParam('directionExploitation', 'TA_Direction'); 

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {
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
            sCode = "TAREG" + Math.floor((fonction.random() * 900) + 99);
            log.set('Code : ' + sCode);
        }
    })

    test.describe('Page [ORGANISATION]', () => {    
        var pageName = 'organisation';

        test("Menu [CLIENTS] - Click ", async () => {
            await menu.click(pageName, page);
        })

        test('P-dialog [ALER ERREUR][PAGE CLIENTS] - Check', async () => {
            await fonction.isErrorDisplayed(false, page);      // Pas d'erreur affichée à priori au chargement de la page 
        })

        test('Button [CREER REGION] - Click', async () => {
            await pageOrganisation.buttonGererRegion.hover(); // Survol Souris (hover)
            await fonction.wait(page, 800);
            await fonction.clickAndWait(pageOrganisation.buttonCreer, page);
        })

        var sNomPopin = "Création d'une région";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', () => {

            test ('ListBox [DIRECTION EXPLOITATION] ['+ sDirExploit +']', async () => {
                await fonction.clickElement(pageOrganisation.pPregListBoxDirExploit);

                await pageOrganisation.pListBoxRegion.first().waitFor({state:'visible'});
                await pageOrganisation.pListBoxRegion.filter({hasText: sDirExploit}).nth(0).click();
            })

            test ('Input [CODE][rnd] - Select', async () => {
                await fonction.sendKeys(pageOrganisation.pPregInputCodeRegion, sCode); 
            })

            test ('Input [DESIGNATION] ['+ sDesignation +']', async () => {
                await fonction.sendKeys(pageOrganisation.pPregInputDesignRegion, sDesignation);
            })

            test('InputField [AUTOCOMPLETE][DIRECTION DE REGION] [' + sDirRegion + ']', async () => {
                var oData:AutoComplete = {
                    libelle         :'DIRECTION DE REGION',
                    inputLocator    : pageOrganisation.pPregAutoCompleteDirReg,
                    inputValue      : sDirRegion,
                    choiceSelector  : 'ngb-typeahead-window button',
                    choicePosition  : 0,
                    typingDelay     : 100,
                    waitBefore      : 500,
                    page            : page,
                }
                await fonction.autoComplete(oData);
            })

            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickElement(pageOrganisation.pPbuttonEnregistrer);
            })
        })
    })  //-- End Describe Page

    test('Déconnexion', async () => {
        log.set("Code : " + sCode);
        log.set("Designation : " + sDesignation);
        log.set("Direction de Région : " + sDirRegion);
        await fonction.deconnexion(page);
    })

    test('** CHECK FLUX **', async () => {
        if (sCode) {
            var oFlux = { 
                "FLUX" : [
                    {
                        "NOM_FLUX" : "Diffuser_OrganisationRegion",
                        STOP_ON_FAILURE  : false
                    },
                    {
                        "NOM_FLUX" : "EnvoyerRegionProsol_Pricing",
                        STOP_ON_FAILURE  : false
                    },
                    {
                        "NOM_FLUX" : "EnvoyerOrganisationRegion_Mag",
                        STOP_ON_FAILURE  : false
                    },
                    {
                        "NOM_FLUX" : "EnvoyerOrganisationRegion_Budget",
                        STOP_ON_FAILURE  : false
                    },
                    {
                        "NOM_FLUX" : "EnvoyerOrganisationRegion_Qualite",
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