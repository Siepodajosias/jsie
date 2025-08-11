/**
 * 
 * @author JC CALVIERA
 * @since 2024-01-29
 * 
 */

const xRefTest      = "PRE_REF_CHE";
const xDescription  = "Création d'un Chemin de Picking";
const xIdTest       =  1982;
const xVersion      = '3.2';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PREPARATION',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }          from '@playwright/test';

import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';
import { EsbFunctions }             from '@helpers/esb';

import { MenuPreparation }          from '@pom/PRE/menu.page';
import { RefCheminPickingPage }     from '@pom/PRE/referentiel-chemin_picking.page';

import { CartoucheInfo, TypeEsb } 	from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuPreparation;
let pageChemin          : RefCheminPickingPage;
let esb                 : EsbFunctions;

//------------------------------------------------------------------------------------

const log               = new Log();
const fonction          = new TestFunctions(log);

const sPlateforme       = fonction.getInitParam('plateforme', 'Cremlog');
const sNomChemin        = fonction.getLocalConfig('nomChemin');
var iOrdre              = Math.floor(fonction.random() * 998) + 1;

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage();
    menu        = new MenuPreparation(page, fonction);
    pageChemin  = new RefCheminPickingPage(page);
    esb         = new EsbFunctions(fonction);
    const helper= new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']' , () => {
    
    test('Ouverture URL : ' + fonction.getApplicationUrl(), async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async ({ context }) => {
        await context.clearCookies();
        await fonction.connexion(page);
    });

    test.describe ('Page [REFERENTIEL]', async () => {   

        var sNomPage:string = 'referentiel';

        test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async() => {
            await menu.selectPlateforme(sPlateforme, page);
            log.set('Plateforme : ' + sPlateforme);
        })

        test('Page [REFERENTIEL] - Click', async () => {
            await menu.click(sNomPage, page);
        });
        
        test('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);
        }) 

        var sNomOnglet:string = "CHEMIN DE PICKING";
        test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', () => {

            test('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'cheminPicking', page);
            });

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            });

            var sNomPopin:string = 'CREER UN CHEMIN';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {
                    
                test('Button [CREER UN CHEMIN]- Click', async () => {
                    await fonction.clickElement(pageChemin.buttonCreerChemin);
                });
                
                test('Message [ERREUR] - Is Not Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);
                });

                test('Input [DESIGNATION] = rnd', async () => {
                    await fonction.sendKeys(pageChemin.pPinputNomChemDesignation, sNomChemin + iOrdre.toString(), false, 'Nom chemin de picking');
                    log.set('Nom Chemin : ' + sNomChemin);
                });

                test('Input [ORDRE] = rnd', async () => {
                    await fonction.sendKeys(pageChemin.pPinputNomChemOrdre, iOrdre.toString(), false, 'Ordre');
                    log.set('Ordre : ' + iOrdre.toString());
                });

                test('Toggle Button [FUSION DES CLIENT] - Select', async () => {
                    await fonction.clickElement(pageChemin.pCheckBoxFusionClient);
                });

                test('Button [CREER]- Click', async () => {
                    await fonction.clickAndWait(pageChemin.pPbuttonNomChemCreer, page);
                }); 
            }); //-- End Popin
        }); //-- End Onglet
    }); //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

    test('Check Flux : ',async ()=>{
        var oFlux:TypeEsb   =  { 
            "FLUX" : [ 
                {
                    "NOM_FLUX"  : "EnvoyerNomCheminPicking_Stock"
                }
            ],
            "WAIT_BEFORE"   : 3000,                 // Optionnel
        };
        await esb.checkFlux(oFlux,page);
    })
});   