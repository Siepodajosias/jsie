/**
 * 
 * FACTURATION APPLICATION > Demandes d'avoir client.
 * 
 * @author JOSIAS SIE
 * @since 2025-06-23
 */

const xRefTest      = "FAC_REG_FAC";
const xDescription  = "Facturer les régularisations";
const xIdTest       =  4933;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'FACTURATION',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['groupeArticle','rayon','plateforme'],
    fileName    : __filename
}

//-------------------------------------------------------------------------------------------------------------------

import { expect, test, type Page }              from '@playwright/test';

import { Help }                                 from '@helpers/helpers';
import { TestFunctions }                        from '@helpers/functions';
import { Log }                                  from '@helpers/log';
import { MenuFacturation }                      from '@pom/FAC/menu.page';
import { RegularisationRegularisationEffectuee }from '@pom/FAC/regularisation-regularisation_effectuees.page';
import { FacturationListeFactures }             from '@pom/FAC/facturation-liste_factures.page';
import { CartoucheInfo }                        from '@commun/types';

//-------------------------------------------------------------------------------------------------------------------

let page                                 : Page;

let menu                                 : MenuFacturation;
let regularisationRegularisationEffectuee: RegularisationRegularisationEffectuee; 
let facturationListeFactures             : FacturationListeFactures;
const log                                = new Log();
const fonction                           = new TestFunctions(log);

//------------------------------------------------------------------------------------

var oData:any           = fonction.importJdd(); //Import du JDD pour le bout en bout  

var sPtfDistribution    = fonction.getInitParam('plateforme', 'Cremlog');
const sRayon            = fonction.getInitParam('rayon', 'Crèmerie');
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Coupe / Corner');

//------------------------------------------------------------------------------------
const sCentraleAchat    = `Le Fromager des Halles`
const sMessageConfir    = `Êtes-vous sûr de vouloir envoyer la facturation jusqu'au`
//------------------------------------------------------------------------------------

if (oData !== undefined) {  // On est dans le cadre d'un E2E. Récupération des données temporaires      
    var sCodeClient = oData.sCodeClient 	 
    var sCodeArticle= oData.sCodeArticle 
    var iNumeroBL   = oData.iNumeroBL 

    log.set('E2E - Code client : ' + sCodeClient); 
} 

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                                 = await browser.newPage();
    menu                                 = new MenuFacturation(page, fonction) ;
    regularisationRegularisationEffectuee= new RegularisationRegularisationEffectuee(page);
    facturationListeFactures             = new FacturationListeFactures(page);
    const helper                         = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', async () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({context}) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [REGULARISATION]', async () => {    
      
        let sCurrentPage:string = 'regularisation';

        test('Page [REGULARISATION] - Click', async () => {
            await menu.click(sCurrentPage, page);
        })

        test('ListBox [PLATEFORME] ="' + sPtfDistribution + '"', async () => {
            await menu.selectPlateformeByLabel(sPtfDistribution, page);
        })

        test('ListBox [RAYON - GROUPE ARTICLE] = "' + sRayon + ' - ' + sGroupeArticle + '"', async () => {            
            await menu.selectRayonGroupeArticle(sRayon, sGroupeArticle, page); // Sélection du rayon passé en paramètre
        })

        test.describe ('Onglet [REGULARISATIONS EFFECTUEES]', async () => {

            test('Onglet [REGULARISATIONS EFFECTUEES] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'regularisationsEffectuees', page);
            })

            test('InputField [SEARCH ARTICLE] ="' + sCodeArticle + '"', async () => {
                await fonction.sendKeys(regularisationRegularisationEffectuee.inputSearchArticle, sCodeArticle, false, 'Code article'); 
                await fonction.waitForDomStable(page);
            })
         
            test('Button [RECHERCHER] - Click', async () => {
                await fonction.clickAndWait(regularisationRegularisationEffectuee.buttonRechercher, page);
            })

            test('** Wait Until Spinner Off **', async () => {
                await fonction.waitForSpinner(facturationListeFactures.imgSpinnerLoading, 180000);
            })

            test('Tr [REGULARISATION] > 0', async () => {
                expect(await regularisationRegularisationEffectuee.trRegularisations.count()).toBeGreaterThan(0); 
            })

            test('Button [FACTURER REGULARISATIONS] - Click', async () => {
                await fonction.clickAndWait(regularisationRegularisationEffectuee.buttonFacturerLesRegul, page);
            })

            var sNomPopin:string = "ENVOYER LES FACTURES DE REGULARISATION";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {
                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test('I [DATE FACTURATION] - Click', async () => {
                    await fonction.clickAndWait(regularisationRegularisationEffectuee.piDateFacturation, page);
                    await fonction.clickElement(regularisationRegularisationEffectuee.pTrDayFacturation.locator('td:NOT(.disabled)').first(), page);
                })  

                test('Div [MESSAGE CONFIRMATION] - Expect', async () => {
                    expect(await regularisationRegularisationEffectuee.pDivMessageConfirmation.textContent()).toContain(sMessageConfir);
                })  
                
                test('Button [FACTURER] - Click', async () => {
                    await fonction.clickAndWait(regularisationRegularisationEffectuee.pButtonFacturer, page);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })
            })  // End describe Popin
        })  // End describe Onglet
    })  //-- End Describe Page

    test.describe ('Page [FACTURATION]', async () => {    
        
        var sCurrentPage:string = 'facturation';

        test ('Page [FACTURATION] - Click', async () => {
            await menu.click(sCurrentPage, page);
        })

        test.describe ('Onglet [LISTE DES FACTURES]', async () => {

            test ('Onglet [LISTE DES FACTURES] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'listeFactures', page);
            })

            test('Button [COMPTABILISER & ARCHIVERS] - Click', async () => {
                await fonction.clickAndWait(facturationListeFactures.buttonComptabiliserAcrhiver, page);
            })
                        
            var sNomPopin:string = "Confirmation de la comptabilisation et de l'archivage";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {
                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test('** Wait Until Spinner Off #1 **', async () => {
                    await fonction.waitForSpinner(facturationListeFactures.spanSpinnerLoading, 180000);
                })

                test('Li [CENTRALE ACHAT] - Click', async () => {
                    await fonction.clickAndWait(facturationListeFactures.pListBoxCentraleAchat, page);
                    await fonction.clickElement(facturationListeFactures.pListBoxCentraleAchatItem.locator('span:text-is("'+sCentraleAchat+'")'), page);
                })  

                test('Button [COMPTABILISER & ARCHIVERS] - Click', async () => {
                    await fonction.clickAndWait(facturationListeFactures.pButtonComptabiliserArchiver, page);
                    if (await facturationListeFactures.divAlertErreurConfirmation.isVisible()) {
                        var error:any     = await facturationListeFactures.divAlertErreurConfirmation.locator('div').textContent();
                        var errorMessage  = error.substr(0,6);
                        if(errorMessage === "[5151]"){
                            log.set(fonction.colorLog(error,'yellow'));
                        }
                    }
                })

                test('** Wait Until Spinner Off #2 **', async () => {
                    await fonction.waitForSpinner(facturationListeFactures.spanSpinnerLoading, 180000);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })
            })  // End describe Popin

            test.describe ('Datagrid [LISTE DES FACTURATIONS]', async () => {
                test('Input [NUMERO BL] = "'+iNumeroBL+'"', async ()=> {
                    await fonction.sendKeys(facturationListeFactures.inputNumeroBL, iNumeroBL, false, 'Numéro BL');
                    await fonction.waitForDomStable(page);
                })

                test('Button [RECHERCHER] - Click', async()=> {
                    await fonction.clickAndWait(facturationListeFactures.buttonRechercher,page);
                })

                test('** Wait Until Spinner Off **', async () => {
                    await fonction.waitForSpinner(facturationListeFactures.imgSpinnerLoading, 180000);
                })

                test('Tr [LISTE FACTURATIONS] > 0', async ()=> {
                    expect(await facturationListeFactures.dataGridLigneFacture.count()).toBeGreaterThan(0);
                })
            })  // End describe Popin
        })  // End describe Onglet
    })  //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})
