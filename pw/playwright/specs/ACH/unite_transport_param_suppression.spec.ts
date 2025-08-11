/**
 * 
 * @author JC CALVIERA
 * @since 2024-02-28
 * 
 */
const xRefTest      = "ACH_TSP_SPR";
const xDescription  = "Supprimer un paramétrage (unité de transport)";
const xIdTest       =  1761;
const xVersion      = "3.4";

var info = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Précurseur et successeur de [ACH_TSP_APR].', 'Dans un cas essaye de supprimer un paramètre aléatoire, ', 'et dans le second cas supprime les paramètres préalablement créés.'],
    params      : [],
    fileName    : __filename
};

import { test, type Page}   from '@playwright/test';

import { Help }             from '@helpers/helpers';
import { TestFunctions }    from '@helpers/functions';
import { Log }              from '@helpers/log';

import { MenuAchats }       from '@pom/ACH/menu.page';
import { PageRefUniTrp }    from '@pom/ACH/referentiel_unites-transport.page';

//------------------------------------------------------------------------------------

let page                    : Page;
 
var pageUnites              : PageRefUniTrp;
var menu                    : MenuAchats;

const log                   = new Log();
const fonction              = new TestFunctions(log);

var oData:any               = fonction.importJdd();

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
    })

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

            test ('Header [COEF FOISONNEMENT] - Click x 2', async() => {

                //-- Le système de pagination n'étant pas visible (actuellement), on trie les données afin de faire remonter les données cible en tête de liste
                await fonction.clickElement(pageUnites.headerCoef);
                await fonction.wait(page, 250);

                await fonction.clickElement(pageUnites.headerCoef);
                await fonction.wait(page, 250);
            })

            if (oData !== undefined) {
                test ('CheckBox [UNITE TRANSPORT][E2E] - Click', async () => {
                    var iNbElem        = await pageUnites.dataGridListeParamGroupe.count();
                    for(let i=0;i<iNbElem;i++){
                        var sNomGroupe = await pageUnites.dataGridListeParamGroupe.nth(i).textContent();
                        var sPlateforme= await pageUnites.dataGridListeParamPlateforme.nth(i).textContent();

                        if(sNomGroupe.toLowerCase() == oData.sGroupe.toLowerCase() && sPlateforme.toLowerCase() == oData.sPlateforme.toLowerCase()){
                            await fonction.clickElement(pageUnites.dataGridListeParamCoef.nth(i));
                            break;
                        }
                    }

                    log.set('Nombre de lignes : ' + oData.iNbElem.toString());
                    log.set('Paramètre actif : ' + oData.bActif);
                    log.set('Nom Groupe : ' + oData.sGroupe);
                    log.set('Plateforme : ' + oData.sPlateforme);
                    log.set('Unité de transport : ' + oData.sUniteTransport);
                    log.set('Coefficient de foisonnement : ' + oData.rCoef);
                    log.set('Nature de la marchandise : ' + oData.sNature);
                })
            } else {
                //-- On sélectione un paramètre au hasard
                test ('CheckBox [UNITE TRANSPORT][rnd] - Click', async () => {
                    oData.iNbElem = await pageUnites.dataGridListeParamGroupe.count();
                    log.set('Nombre de lignes : ' + oData.iNbElem.toString());

                    oData.iPos = Math.floor(fonction.random() * oData.iNbElem);
                    log.set('Ligne cible : ' + oData.iPos.toString());

                    oData.bActif = await pageUnites.dataGridListeActif.nth(oData.iPos).isVisible();
                    log.set('Paramètre actif : ' + oData.bActif);

                    oData.sGroupe = await pageUnites.dataGridListeParamGroupe.nth(oData.iPos).textContent();
                    log.set('Nom Groupe : ' + oData.sGroupe);

                    oData.sPlateforme  = await pageUnites.dataGridListeParamPlateforme.nth(oData.iPos).textContent();
                    log.set('Plateforme : ' + oData.sPlateforme);

                    oData.sUniteTransport = await pageUnites.dataGridListeParamUniteTransp.nth(oData.iPos).textContent();
                    log.set('Unité de transport : ' + oData.sUniteTransport);

                    oData.rCoef = await pageUnites.dataGridListeParamCoef.nth(oData.iPos).textContent();
                    log.set('Coefficient de foisonnement : ' + oData.rCoef);

                    oData.sNature    = await pageUnites.dataGridListeParamMarchandise.nth(oData.iPos).textContent();
                    log.set('Nature de la marchandise : ' + oData.sNature);

                    await fonction.clickElement(pageUnites.dataGridListeParamCoef.nth(oData.iPos));
                })
            }

            test ('Button [SUPPRIMER UN PARAMETRE D\'UNE UNITE DE TRANSPORT] - Click', async () => {
                await fonction.clickElement(pageUnites.buttonSupprimerParametrage);
            })

            const sNomPopin:string = "Suppression d'un paramètrage d'unité de transport";
            test.describe('Popin ' + sNomPopin.toUpperCase() + ']', async() => {
                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () =>  {
                  await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
                })

                test('Button [OK] - Click', async () => {
                    await fonction.clickAndWait(pageUnites.pPbuttonDelParamOk, page);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () =>  {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), false, 3000);
                })
            })  // End Popin
        })  // End  Onglet
    })  // End  Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})  // End describe