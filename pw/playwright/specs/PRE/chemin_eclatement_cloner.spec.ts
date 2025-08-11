/**
 * 
 * @author JC CALVIERA
 * @since 2024-03-20
 * 
 */

const xRefTest      = "PRE_REF_CCL";
const xDescription  = "Chemin d'Eclatement - Cloner / désactiver";
const xIdTest       =  7185;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRE',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page, expect }      from '@playwright/test';

import { Help }                         from '@helpers/helpers.js';
import { TestFunctions }                from '@helpers/functions.js';
import { Log }                          from '@helpers/log.js';

import { MenuPreparation }              from '@pom/PRE/menu.page.js';
import { RefCheminEclatementPage }      from '@pom/PRE/referentiel-chemin_eclatement.page';

import { CartoucheInfo }                from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuPreparation;
let pageChemin          : RefCheminEclatementPage;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

const sPlateforme       = fonction.getInitParam('plateforme', 'Chaponnay');

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuPreparation(page, fonction);
    pageChemin  = new RefCheminEclatementPage(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']' , () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe ('Page [REFERENTIEL]', async () => {   
        
        var sNomPage = 'referentiel';

        test ('Page [REFERENTIEL] - Click', async () => {
            await menu.click(sNomPage, page);
        }); 
        
        test ('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);
        }) 

        var sNomOnglet = 'CHEMIN ECLATEMENT'

        test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async () => {   

            let iNbCheminsBis:number;
            let sCheminSelectionne:string;

            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage,'cheminEclatement', page);         
            })

            test ('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 

            test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => { 
                await menu.selectPlateforme(sPlateforme, page);
            })

            test ('Filtre [NOM CHEMIN] = "Bis"', async() => {
                await fonction.sendKeys(pageChemin.inputFiltreDesignation, "Bis");
                await fonction.wait(page, 250);     // Attente raffraîchissement liste coté front
                iNbCheminsBis = await pageChemin.tdCheminsClones.count();
                log.set('Nombre de chemins AVANT clonage : ' + iNbCheminsBis);
            })

            test ('Filtre [NOM CHEMIN] = ""', async() => {
                await fonction.sendKeys(pageChemin.inputFiltreDesignation, "");
                await fonction.wait(page, 250);     // Attente raffraîchissement liste coté front
            })

            test ('CheckBox [CHEMIN][rnd] - Click', async () => { 

                //-- Attente affichage première réponse
                await pageChemin.tdCheminsNonClones.first().waitFor();

                var iNbChemins = await pageChemin.tdCheminsNonClones.count();
                const iRnd = Math.floor(fonction.random() * iNbChemins);
                await fonction.clickElement(pageChemin.tdCheminsNonClones.nth(iRnd));
                
                sCheminSelectionne = await pageChemin.tdCheminsNonClones.nth(iRnd).textContent();
                log.set('Designation Chemin : ' + sCheminSelectionne);

            });

            test ('Button [CLONER]- Click', async () => {
                await fonction.clickAndWait(pageChemin.buttonCloner, page);
            });           
            
            var sNomPopin = 'Activer la double préparation d\'un magasin';

            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test ('Button [CONFIRMER]- Click', async () => {
                    await fonction.clickAndWait(pageChemin.pPActiverButtonConfirmer, page);
                });           

            })

            test ('Filtre [NOM CHEMIN] = "Nom Chemin Sélectionné + Bis"', async() => {
                await fonction.sendKeys(pageChemin.inputFiltreDesignation, sCheminSelectionne + " Bis");
                log.set('Designation Chemin : ' + sCheminSelectionne + " Bis");
                await fonction.wait(page, 500);     // Attente raffraîchissement liste coté front
                iNbCheminsBis = await pageChemin.tdCheminsClones.count();
                log.set('Nombre Chemins ayant le nom "' + sCheminSelectionne + ' Bis" AVANT désactivation : ' + iNbCheminsBis);
                expect(iNbCheminsBis).toEqual(1);
            })

            test ('CheckBox [CHEMIN][0] - Click', async () => { 
                //-- Attente affichage première réponse
                await pageChemin.tdCheminsClones.first().waitFor();
                await fonction.clickElement(pageChemin.tdCheminsClones.nth(0));
            });

            test ('Button [DESACTIVER]- Click', async () => {
                await fonction.clickAndWait(pageChemin.buttonDesactiver, page);
            }); 

            sNomPopin = 'Désactiver la double préparation d\'un magasin';

            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test ('Button [CONFIRMER]- Click', async () => {
                    await fonction.clickAndWait(pageChemin.pPdesactiverButtonConfirmer, page);
                });           

            })

            test ('Filtre [NOM CHEMIN] #2 = "Nom Chemin Sélectionné + Bis"', async() => {
                await fonction.wait(page, 500);     // Attente raffraîchissement liste coté front
                iNbCheminsBis = await pageChemin.tdCheminsClones.count();
                log.set('Nombre Chemins ayant le nom "' + sCheminSelectionne + ' Bis" APRES désactivation : ' + iNbCheminsBis);
                expect(iNbCheminsBis).toEqual(0);
            })

            test ('Message [ERREUR] #2 - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 

        }); //-- End Describe Onglet  

    }); //-- End Describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

});   