/**
 * 
 * @author JC CALVIERA
 *  Since 2024-04-12
 */

const xRefTest      = "MAG_AUP_FDP";
const xDescription  = "Ajout Frais de Port";
const xIdTest       =  2064;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['groupeArticle'],
    fileName    : __filename
};

//-------------------------------------------------------------------------------------

import { test, type Page }          from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';

import { MenuMagasin }              from '@pom/MAG/menu.page';
import { AutorisationsParametrage } from '@pom/MAG/autorisations-parametrage.page';

import { CartoucheInfo }            from '@commun/types';

//-------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pageParam           : AutorisationsParametrage;

const log               = new Log();
const fonction          = new TestFunctions(log);

//-----------------------------------------------------------------------------------------

const rPrix             = 8.88;
const iQuantite         = 777;
const aTypes            = ['QUANTITE COLIS', 'FIXE', 'TRANCHE'];
const sType             = fonction.getRandomArray(aTypes);
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Coupe / Corner'); 

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageParam        = new AutorisationsParametrage(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    let bJobToDo:boolean=false;

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [AUTORISATIONS]', async () => {

        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            await menu.pPopinAlerteSanitaire.isVisible().then(async (isVisible) => {
                if(isVisible){
                    await menu.removeArlerteMessage(page);
                }else{
                    log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                    test.skip();
                }
            })
        })

        var sNomPage = 'autorisations';

        test ('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 
        
        var sNomOnglet = "PARAMETRAGE";

        test.describe ('Onglet [' + sNomOnglet + ']', async() => {

            test ('Onglet [PARAMETRAGE] - Click', async() => {
                await menu.clickOnglet(sNomPage, 'parametrage', page);
            })

            test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de l'onglet
                await fonction.isErrorDisplayed(false, page);
            }) 
            
            test ('ListBox [TYPE] = "Livraisons directes"', async() => {            
                await pageParam.listBoxTypeAssortiment.selectOption("Livraisons directes");

            })
            
            test ('ListBox [GROUPE] = "' + sGroupeArticle + '"', async() => {            
                await pageParam.listBoxGroupeArticle.selectOption(sGroupeArticle);
                await fonction.wait(page, 250); //-- Attente raffraîchissement liste
            })

            test ('CheckBox [ASSORTIMENT][rnd] - Click', async() => {
                const iNbResponses = await pageParam.tdLibelleAssortiment.count();
                const rnd = Math.floor(fonction.random() * iNbResponses);
                const sArticle = await pageParam.tdLibelleAssortiment.nth(rnd).textContent();
                log.set('Article : ' + sArticle + '(Choix ' + rnd + '/' + iNbResponses.toString() + ')');
                await fonction.clickElement(pageParam.tdLibelleAssortiment.nth(rnd));
            })

            test ('Button [AJOUTER DES FRAIS DE PORT] - Click', async () => {
                await fonction.clickAndWait(pageParam.buttonAjoutFraisDePort, page);
            })

            var sNomPopin = 'AJOUT DES FRAIS DE PORT';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

                test ('CheckBox [MAGASIN CONCERNES][0] - Click', async() => {
                    const iNbMagasins = await pageParam.pPcheckBoxFdpListeMagasins.count();
                    log.set('Nombre de magasins concernés : ' + iNbMagasins);
                    if (iNbMagasins > 0) {                  // Des magasins sont présents, on peut sélectionner le premier et continuer le test
                        bJobToDo = true;                        
                        await fonction.clickElement(pageParam.pPcheckBoxFdpListeMagasins.first());
                    } else {                                // Aucun magasin présent, on ne peut pas continuer le test
                        log.set('*** Abandon Test ***');
                    }
                })

                test ('CheckBox [TYPE DE FRAIS] = "random"', async() => {
                    if (bJobToDo) {
                        log.set('Type : ' + sType)
                        if (sType === aTypes[0]) {
                            await fonction.clickElement(pageParam.pPradioFdpQuantiteColis);
                        } else if (sType === aTypes[1]) {
                            await fonction.clickElement(pageParam.pPradioFdpFixe);
                        } else if (sType === aTypes[2]) {
                            await fonction.clickElement(pageParam.pPradioFdpTranche);
                        }
                    } else {
                        test.skip();
                    }
                })

                test ('InputField [MONTANT] = "' + rPrix + '"', async() => {
                    if (bJobToDo) {
                        if (sType === aTypes[0]) {
                            await fonction.sendKeys(pageParam.pPinputFdpQuantiteColisPrix, rPrix);
                        } else if (sType === aTypes[1]) {
                            await fonction.sendKeys(pageParam.pPinputFdpFixePrix, rPrix);
                        } else if (sType === aTypes[2]) {
                            await fonction.sendKeys(pageParam.pPinputFdpTrancheUne.first(), rPrix);
                        }
                    } else {
                        test.skip();
                    }
                })

                test ('InputField [QUANTITE] = "' + iQuantite + '"', async() => {
                    if (bJobToDo) {
                        if (sType === aTypes[0]) {
                            await fonction.sendKeys(pageParam.pPinputFdpQuantiteColisQte, iQuantite);
                        } else if (sType === aTypes[2]) {
                            await fonction.sendKeys(pageParam.pPinputFdpTrancheHt.first(), iQuantite);
                        }
                    } else {
                        test.skip();
                    }
                })

                test ('Button [ENREGISTRER] - Click', async () => {
                    if (bJobToDo) {
                        await fonction.clickElement(pageParam.pPbuttonFdpEnregistrer);
                    } else {
                        await fonction.clickElement(pageParam.pPlinkFdpFermer);
                        test.skip();
                    }                        
                })

            }); //-- Popin

        }); //-- Onglet  

    }); //-- Page

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})