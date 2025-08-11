/**
 * 
 * @author JOSIAS SIE
 * @since 2024-10-14
 * 
 */
const xRefTest      = "ACH_TSP_MPR";
const xDescription  = "Modifier un paramétrage (unité de transport)";
const xIdTest       =  1760;
const xVersion      = "3.0";

var info = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Précurseur et successeur de [ACH_TSP_APR].', 'Dans un cas essaye de supprimer un paramètre aléatoire, ', 'et dans le second cas modifié les paramètres préalablement créés.'],
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
const rCoef                 = 7.77;

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
                })

            } else {
                //-- On sélectione un paramètre au hasard
                test ('CheckBox [UNITE TRANSPORT][rnd] - Click', async () => {
                    oData.iPos = Math.floor(fonction.random() * await pageUnites.dataGridListeParamCoef.count());
                    log.set('Ligne cible : ' + oData.iPos.toString());

                    await fonction.clickElement(pageUnites.dataGridListeParamCoef.nth(oData.iPos));
                })
            }

            test ('Button [MODIFIER LE PARAMETRAGE] - Click', async () => {
                await fonction.clickElement(pageUnites.buttonModifierParametrage);
            })

            const sNomPopin:string = "Modification d'un paramètrage d'unité de transport";
            test.describe('Popin ' + sNomPopin.toUpperCase() + ']', async() => {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () =>  {
                  await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
                })

                test('** Traitement rnd **', async () => {         
                    var iNbEssai:number = 0;
                    do {
                        iNbEssai++;
    
                        log.separateur();
                        log.set('Essai #' + iNbEssai.toString());
        
                        oData.rCoef = rCoef;
                        log.set('Coefficient de foisonnement : ' + oData.rCoef); 
                        await fonction.sendKeys(pageUnites.pPinputAddParamCoef, rCoef.toString(), false, 'Coefficient Foisonnement');
    
                        oData.bActif= (fonction.random() > 0.5);
                        
                        if (oData.bActif > 0.5) {
                            await fonction.clickElement(pageUnites.pPcheckBoxAddParamActif);
                            log.set('Actif : OUI');
                            await fonction.addDataSheet('CheckBox', 'Statut', 'Actif');
                        } else {
                            log.set('Actif : NON');
                            await fonction.addDataSheet('CheckBox', 'Statut', 'Inactif');
                        }
    
                        await fonction.clickAndWait(pageUnites.pPbuttonAddParamCreer, page);
    
                        //-- Une erreur est elle affichée ?
                        var bIsErrorVisible = await pageUnites.errorMessage.isVisible();
    
                    } while(bIsErrorVisible);
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