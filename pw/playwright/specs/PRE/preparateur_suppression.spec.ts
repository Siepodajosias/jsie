/**
 * 
 * @author JC CALVIERA
 * @since 2024-01-26
 * 
 */

const xRefTest      = "PRE_PRE_SUP";
const xDescription  = "Supprimer un préparateur";
const xIdTest       =  2027;
const xVersion      = '3.6';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PREPARATION',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['A exécuter après le Test PRE_PRE_MOD'],
    params      : ['plateforme'],
    fileName    : __filename
}

//------------------------------------------------------------------------------------

import { test, type Page, expect }      from '@playwright/test';

import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';

import { MenuPreparation }              from '@pom/PRE/menu.page';
import { ProdGestionPreparateursPage }  from '@pom/PRE/productivite-gestion_preparateurs.page';

import { CartoucheInfo }                from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuPreparation;
let pageGestion         : ProdGestionPreparateursPage;

//------------------------------------------------------------------------------------

const log               = new Log();
const fonction          = new TestFunctions(log);

const sPlateforme       = fonction.getInitParam('plateforme', 'Chaponnay');
const sNomParam         = fonction.getLocalConfig('nomPreparateur');
const sNom              = sNomParam;

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage();
    menu        = new MenuPreparation(page, fonction);
    pageGestion = new ProdGestionPreparateursPage(page);
    const helper= new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']' , () => {
    
    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [PRODUCTIVITE]', async () => {   
        
        var iNbResponses = 0;
        var sRefPreparateur:string = '';

        var sNomPage:string = 'productivite';
        test ('Page [PRODUCTIVITE] - Click', async () => {
            await menu.click(sNomPage, page);
        })
        
        test ('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);
        }) 

        test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {            
            await menu.selectPlateforme(sPlateforme, page);                     // Sélection d'une plateforme 
            log.set('Plateforme : ' + sPlateforme);
        })

        test.describe ('Onglet [GESTION PREPARATEUR]', async () => {   

            var sNomOnglet:string = 'Gestion préparateur'
            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage,'gestionPreparateurs', page);         
            })

            test ('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 
            
            test ('CheckBox [ACTIF] = Uncheck', async () => {
                await fonction.clickElement(pageGestion.checkBoxActif);
                await fonction.wait(page, 250);         // On attend que le liste se raffraîchisse
                await fonction.clickElement(pageGestion.checkBoxActif);
                await fonction.wait(page, 250);         // On attend que le liste se raffraîchisse
            })

            test ('Input [NOM PREPARATEUR] = "' + sNom + '"', async () => {
                await fonction.sendKeys(pageGestion.inputSearchPreparateur, sNom, false, 'Nom Préparateur');
                await fonction.wait(page, 500);         // On attend que le liste se raffraîchisse
            })
    
            test ('CheckBox [PREPARATEUR][0] - Click', async () => { 
                await fonction.clickElement(pageGestion.trListePreparateurs.nth(0));
                iNbResponses = await pageGestion.trListePreparateurs.count();
                log.set('Nombre de réponses filtrées AVANT suppression : ' + iNbResponses);
            })

            var sNomPopin:string = 'SUPPRESSION DU PREPARATEUR';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test ('Button [SUPPRIMER UN PREPARATEUR] - Click', async () => {
                    await fonction.clickAndWait(pageGestion.buttonPreparateurDelete, page);        

                    // AExtraction du numéro du préparateur
                    var sMessageAlerte = await pageGestion.pPlabelMessageAlerte.textContent();                                            
                    sRefPreparateur = sMessageAlerte?.match(/\d{5}/)[0];     

                    log.set('Code Préparateur Supprimé : ' + sRefPreparateur);

                }) 
                
                test ('Button [CONFIRMER] - Click', async () => {
                    await fonction.clickAndWait(pageGestion.pPbuttonSupPreConfirmer, page);
                })                

            }) //-- End Popin       

        }) //-- End Describe Onglet  

        var sNomOnglet:string = 'Import temps de présence'
        test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async () => {   

            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage,'importTempsPresence', page);         
            })

            test ('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 

        }) //-- End Describe Onglet  

        sNomOnglet = 'Gestion préparateur'
        test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async () => {   

            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage,'gestionPreparateurs', page);         
            })

            test ('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 

            test ('CheckBox [ACTIF] = Uncheck', async () => {
                await fonction.clickElement(pageGestion.checkBoxActif);
                await fonction.wait(page, 250);         // On attend que le liste se raffraîchisse
                await fonction.clickElement(pageGestion.checkBoxActif);
                await fonction.wait(page, 250);         // On attend que le liste se raffraîchisse
            })

            test ('Input [CODE] = **Num Dynamique**', async () => {
                await fonction.sendKeys(pageGestion.inputSearchCode, sRefPreparateur, false, 'Code Préparateur');
                await fonction.wait(page, 500);         // On attend que le liste se raffraîchisse
                var iNbResponsesNow = await pageGestion.trListePreparateurs.count();
                log.set('Nombre de réponses filtrées APRES suppression : ' + iNbResponsesNow);
                expect(await pageGestion.trListePreparateurs.count()).toBeLessThan(iNbResponses);
            }) 

        }) //-- End Describe Onglet  

    }) //-- End Describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})  