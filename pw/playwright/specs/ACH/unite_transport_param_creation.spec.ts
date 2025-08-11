/**
 * 
 * @author JC CALVIERA
 * @since 2024-02-29
 * 
 */
const xRefTest      = "ACH_TSP_APR";
const xDescription  = "Créer un paramétrage (unité de transport)";
const xIdTest       =  1759;
const xVersion      = "3.7";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Précurseur de [ACH_TSP_SPR]'],
    params      : [],
    fileName    : __filename
};

import { test, type Page }           from '@playwright/test';

import { Help }                      from '@helpers/helpers';
import { TestFunctions }             from '@helpers/functions';
import { Log }                       from '@helpers/log';

import { MenuAchats }                from '@pom/ACH/menu.page';
import { PageRefUniTrp }             from '@pom/ACH/referentiel_unites-transport.page';

import { CartoucheInfo, TypeListBox }from '@commun/types';

//------------------------------------------------------------------------------------

let page                    : Page;
 
var pageUnites              : PageRefUniTrp;
var menu                    : MenuAchats;

const log                   = new Log();
const fonction              = new TestFunctions(log);
const rCoef                 = 8.88;
const iNbEssaisMax          = 12;   //-- Nombre d'essais max pour la création d'un paramétrage si une erreur est affichée

var sUniteTransport         = null;
var oData:any               = fonction.importJdd();

var data = {
    iNbElem : null,
    iPos : null,
    bActif : null,
    sGroupe : null,
    sPlateforme : null,
    sUniteTransport : null,
    rCoef : null,
    sNature : null
}

//------------------------------------------------------------------------------------  

if (oData !== undefined) {                   // On est dans le cadre d'un E2E. Récupération des données temporaires 
	sUniteTransport = oData.sUniteTransport; // L'élément recherché est la désignation du lieu de vente préalablement créé dans le E2E                                

	log.set('E2E - Unite de transport : ' + sUniteTransport);
}

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage();
    menu        = new MenuAchats(page, fonction);    
    pageUnites  = new PageRefUniTrp(page);
    const helper= new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
       await context.clearCookies();
       await fonction.openUrl(page);
    });

    test('Connexion', async() => {
       await fonction.connexion(page);
    })
  
    test.describe('Page [REFERENTIEL]', async() => {

        var pageName:string = 'referentiel';

        test("Menu [REFERENTIEL] - Click ", async () => {
            await menu.click(pageName, page);
        })

        test('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
        })

       test.describe('Onglet [UNITES DE TRANSPORT]', async() => {

            test ('Onglet [UNITES DE TRANSPORT] - Click', async () => {
                await menu.clickOnglet(pageName, 'unitesTransport',page);                
            })   

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            test ('Button [CREER UN PARAMETRAGE] - Click', async () => {
                data.iNbElem = await pageUnites.dataGridListeParamGroupe.count();
                log.set('Nb Paramètres AVANT ajout : ' + data.iNbElem);
                await fonction.clickAndWait(pageUnites.buttonCreerParametrage, page);
            })

            const sNomPopin:string = "Création d'un paramétrage d'unité de transport";
            test.describe ('Popin ' + sNomPopin.toUpperCase() + ']', async() => {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () =>  {
                  await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
                })

                test('** Traitement rnd **', async () => {   

                    test.setTimeout(120000);                            //-- 2 minutes
                    var iNbEssai:number = 0;

                    do {

                        iNbEssai++;

                        log.separateur();
                        log.set('Essai #' + iNbEssai.toString());

                        //-- LB Groupe
                        var oList:TypeListBox = {
                            sLibelle        : 'Groupe',
                            sInput          : pageUnites.pPlistBoxAddParamGroupe,
                            sSelectorChoice : 'p-dropdownitem li span',
                            bVerbose        : true,
                            bIgnoreFirstline: false,
                            iWaitFor        : 0,
                            page            : page,
                            bChained        : false
                        }
                        data.sGroupe = await fonction.selectRandomListBox(oList);

                        //-- LB Plateforme
                        oList = {
                            sLibelle        : 'Plateforme',
                            sInput          : pageUnites.pPlistBoxAddParamPlateforme,
                            sSelectorChoice : 'p-dropdownitem li span',
                            bVerbose        : true,
                            bIgnoreFirstline: false,
                            iWaitFor        : 0,
                            page            : page,
                            bChained        : false
                        }
                        data.sPlateforme = await fonction.selectRandomListBox(oList);

                        //-- LB Unité de transport

                        if(sUniteTransport != null){
                            await fonction.clickElement(pageUnites.pPlistBoxAddParamUniteTransp);
                            await fonction.clickElement(pageUnites.pPlistBoxAddItems.locator('span:text-is("'+sUniteTransport+'")'))
                        }else{
                            oList = {
                                sLibelle        : 'Unité de Transport',
                                sInput          : pageUnites.pPlistBoxAddParamUniteTransp,
                                sSelectorChoice : 'p-dropdownitem li span',
                                bVerbose        : true,
                                bIgnoreFirstline: false,
                                iWaitFor        : 0,
                                page            : page,
                                bChained        : false
                            }
                            sUniteTransport = await fonction.selectRandomListBox(oList);
                        }
                        data.sUniteTransport= sUniteTransport;
                        
                        //-- LB Nature Marchandise
                        oList = {
                            sLibelle        : 'Nature',
                            sInput          : pageUnites.pPlistBoxAddParamNature,
                            sSelectorChoice : 'p-dropdownitem li span',
                            bVerbose        : true,
                            bIgnoreFirstline: false,
                            iWaitFor        : 0,
                            page            : page,
                            bChained        : false
                        }
                        data.sNature = await fonction.selectRandomListBox(oList);
                        
                        data.rCoef = rCoef;
                        log.set('Coefficient de foisonnement : ' + data.rCoef); 
                        await fonction.sendKeys(pageUnites.pPinputAddParamCoef, rCoef.toString(), false, 'Coefficient Foisonnement');

                        data.bActif = (fonction.random() > 0.5);
                        
                        if (data.bActif > 0.5) {
                            await fonction.clickElement(pageUnites.pPcheckBoxAddParamActif);
                            log.set('Actif : OUI');
                            fonction.addDataSheet('CheckBox', 'Statut', 'Actif');
                        } else {
                            log.set('Actif : NON');
                            fonction.addDataSheet('CheckBox', 'Statut', 'Inactif');
                        }

                        await fonction.clickAndWait(pageUnites.pPbuttonAddParamCreer, page);
                        var isVisible = await pageUnites.errorMessage.isVisible();

                        if(isVisible){
                            var sErrorMessage= await pageUnites.errorMessage.locator('div').textContent();
                            sErrorMessage= sErrorMessage.slice(0,6);
                            log.set('Code Erreur affichée : ' + sErrorMessage);
                            if(sErrorMessage == "[4122]"){
                                await fonction.clickElement(pageUnites.pPlinkAddAnnuler);               //-- Fermeture de la popin
                                await fonction.clickAndWait(pageUnites.buttonCreerParametrage, page);   //-- Réouverture de la popin 
                            }
                        } else {
                            log.set('Pas d\'erreur affichée');
                        }

                    } while(isVisible && iNbEssai < iNbEssaisMax);   //-- On boucle tant qu'une erreur est affichée et que l'on n'a pas atteint le nombre d'essais max

                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () =>  {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), false, 3000);
                })

            })  // End Popin

       })  // End  Onglet

       await fonction.writeData(data);

    })  // End  Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})  // End describe