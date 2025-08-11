/**
 * @author SIAKA KONE
 * @desc Effectuer un achat BCT / Saprimex (CrossDock)
 * @since 2024-05-02
 * 
 */
const xRefTest      = "ACH_CRD_BCT";
const xDescription  = "Effectuer un achat BCT / Saprimex (CrossDock)";
const xIdTest       =  2731;
const xVersion      = '3.2';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : ['dossierAchat', 'plateforme','rayon','fournisseur'],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { test, type Page, expect}                    from '@playwright/test';

import { Help }                                      from '@helpers/helpers.js';
import { TestFunctions }                             from '@helpers/functions.js';
import { EsbFunctions }                              from '@helpers/esb.js';
import { Log }                                       from '@helpers/log.js';

import { MenuAchats }                                from '@pom/ACH/menu.page.js'; 
import { PageAchCalApp }                             from '@pom/ACH/achats_calendrier-approvisionnement.page';

import { CartoucheInfo, TypeEsb, TypeListOfElements }from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;
let pageAchCalApp   : PageAchCalApp;
let esb             : EsbFunctions;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    pageAchCalApp   = new PageAchCalApp(page); 
    esb             = new EsbFunctions(fonction);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------  
const sDossierAchat = fonction.getInitParam('dossierAchat', fonction.getLocalConfig('dossierAchatCrossdock'));
const sPlateforme   = fonction.getInitParam('plateforme', 'Cremlog');      
const sRayon        = fonction.getInitParam('rayon', 'BCT');  
const sFournisseur  = fonction.getInitParam('fournisseur', 'Sas Les Ateliers Ⓔ');
//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', async () => {  
    
    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACHATS]', async () => {

        var sNomPage:string = 'achats'; 

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {                    
            await menu.selectRayonByName(sRayon, page);
        })
        
        test('Page [ACHATS] - Click', async() => {
            await menu.click(sNomPage, page, 60000);                
        })

        test('Label [ERREUR] - Is Not Visible', async () => {     // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        });
        
        test('ListBox [DOSSIER D\'ACHAT] = "' + sDossierAchat + '"', async() => {
            await fonction.listBoxByLabel(pageAchCalApp.listBoxDossierAchat, sDossierAchat, page);
        })

        test('DataGrid [PLATEFORME] = "' + sPlateforme + '"', async() => {            
            await fonction.clickAndWait(pageAchCalApp.tdListPlateformes.locator('span:text-is("' + sPlateforme + '")'), page);
            log.set('Plateforme sélectionnée : ' + sPlateforme);
        })

        test('Pictogram [BASCULER CROSSDOCKING] - Click', async() => {            
            await pageAchCalApp.tdListActionsSelected.hover();
            await fonction.clickAndWait(pageAchCalApp.pictoBasculerCrossDock, page);
        })

        test ('DataGrid [Destinataire/Article] - Check', async ({}, testInfo) => {
            var oDataGrid:TypeListOfElements = {
                element     : pageAchCalApp.dataGridCrossDocking,    
                desc        : testInfo.line.toString(),
                verbose     : false,
                column      :   
                    [
                        'Destinataire',
                        'Article',
                        '',
                        ''
                    ]
            }
            await fonction.dataGridHeaders(oDataGrid);
        })

        test('DataGrid [FOURNISSEUR] = "' + sFournisseur + '"', async() => {
            await fonction.clickAndWait(pageAchCalApp.tdListFournisseurs.locator('span:text-is("' + sFournisseur + '")'), page);
            log.set('Plateforme sélectionnée : ' + sFournisseur);
        })

        test('** Wait Until Spinner Off **', async () => {
            await fonction.waitForSpinner(pageAchCalApp.spinnerLoadPage, 90000);
            
        })

        test('DataGrid [Destinataire/Article] updated - Check', async () => {
            expect(await pageAchCalApp.dataGridCrossDockbody.count()).toBeGreaterThan(0);
        })

        test.skip('InputField [ACHETE][rnd] = "' + 4 + '"', async() => {
            test.setTimeout(600000);
            const iNbChamps:number = await pageAchCalApp.inputQteAchetee.count();
            log.set('Nombre d\'articles : ' + iNbChamps);
            for(let iCpt = 0 ; iCpt < iNbChamps; iCpt++) {
                const iRnd:number = Math.floor(fonction.random() * 10);
                if (iRnd < 1) {
                    await pageAchCalApp.inputQteAchetee.nth(iCpt).scrollIntoViewIfNeeded();
                    if( await pageAchCalApp.inputQteAchetee.nth(iCpt).isEnabled()) {
                        await fonction.sendKeys(pageAchCalApp.inputQteAchetee.nth(iCpt), '4');
                    }
                }
            }

        })

        test('Button [ENREGISTRER] - Click', async () => {
            await fonction.clickAndWait(pageAchCalApp.buttonEnregistrer, page);//('img:NOT(.timer)') locator spinner
        })

    }) // end test.describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

    test('** CHECK FLUX **', async () => {
        var oFlux:TypeEsb = { 
            "FLUX" : [ 
                {
                    "NOM_FLUX"  : "EnvoyerFournisseur_Prepa",
                    
                },
                {
                    "NOM_FLUX"  : "EnvoyerFournisseur_Mag",
                    
                },
                {
                    "NOM_FLUX"  : "EnvoyerFournisseur_Stock",
                    
                },
                {
                    "NOM_FLUX"  : "EnvoyerFournisseur_Repart",
                },
                {
                    "NOM_FLUX"  : "EnvoyerFournisseur_X3",
                },
            ],
            "WAIT_BEFORE"   : 10000,            // Optionnel    
        };

        await esb.checkFlux(oFlux, page);

    })

}) 