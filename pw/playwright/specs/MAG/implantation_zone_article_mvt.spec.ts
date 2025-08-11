/**
 * 
 * @author JC CALVIERA
 *  Since 2024-04-10
 */

const xRefTest      = "MAG_IMP_ADD";
const xDescription  = "Ajouter un article dans l'implantation";
const xIdTest       =  1081;
const xVersion      = '3.2';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['ville'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page }          from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';

import { MenuMagasin }              from '@pom/MAG/menu.page';
import { Stockimplantation }        from '@pom/MAG/stock-implantation.page';

import { AutoComplete, CartoucheInfo } from '@commun/types';

//-------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuMagasin;
let pageImplant     : Stockimplantation;

const log           = new Log();
const fonction      = new TestFunctions(log);

//-----------------------------------------------------------------------------------------

const sNomVille         = fonction.getInitParam('ville', 'Tours (G182)');
const sNomZoneA51       = 'Poissonnerie';
const sNomZoneDepart    = 'Articles sans zone';
//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage(); 
    menu        = new MenuMagasin(page, fonction);
    pageImplant = new Stockimplantation(page);
    const helper= new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [STOCK]', async () => {

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

        var sNomPage = 'stock';

        test ('Page [STOCK] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 

        test ('ListBox [LIEU DE VENTE] = "' + sNomVille + '"', async () => {
            await menu.selectVille(sNomVille, page);
        })

        test.describe('Onglet [IMPLANTATION]', async () => {

            let sChoix:string;
            let iNbChoix:number = 0;
            let sZoneInitiale:string;

            test ('Onglet [IMPLANTATION] - Click', async () =>  {
                await menu.clickOnglet(sNomPage, 'implantation', page);
            }) 

            test ('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 

            // Il faut bien s'assurer qu'il y ait une zone de départ différente de poisonnerie sinon le premier changement de zone ne serait pas possible;
            test('ListBox [ZON] #1 = "' + sNomZoneDepart + '"', async () => {
                await fonction.selectOption(pageImplant.listBoxRayon, sNomZoneDepart, 'Zone #1');
            })

            test ('DataGrid [DESCRIPTION][rnd] - Click', async() => {
                if (await pageImplant.tdLibelleDesignation.last().isVisible()) {
                    iNbChoix  = await pageImplant.tdLibelleDesignation.count();           
                    sZoneInitiale = await pageImplant.listBoxRayon.inputValue();
                    const iCible = Math.floor(fonction.random() * iNbChoix );
                    sChoix = await pageImplant.tdLibelleDesignation.nth(iCible).textContent();
                    log.set('Sélection Elément : ' + iCible + ' / ' + iNbChoix + ' = "' + sChoix + '" situé dans la zone ' + sZoneInitiale);
                    await fonction.clickElement(pageImplant.tdLibelleDesignation.nth(iCible));
                } else {
                    log.set('Pas de données sur le rayon par défaut. Test annulé');
                    test.skip();
                }
            })

            test ('Button [CHANGER ZONE] #1 - Click', async () => {
                if (iNbChoix > 0) {
                    await fonction.clickAndWait(pageImplant.buttonZoneChanger, page);
                } else {
                    test.skip();
                }
            })

            var sNomPopin = "Changement de zone #1";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + '] >', async() => {

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible - Check', async () => {
                    if (iNbChoix > 0) {
                        await fonction.popinVisible(page, sNomPopin, true);
                    } else {
                        test.skip();
                    }
                })

                test ('ListBox [NOUVELLE ZONE] = "' + sNomZoneA51 + '"', async() => {
                    if (iNbChoix > 0) {
                        log.set('Déplacement vers la zone : ' + sNomZoneA51);
                        await fonction.selectOption(pageImplant.pPlistBoxChangeZone, sNomZoneA51, 'Nouvelle Zone');
                    } else {
                        test.skip();
                    }
                })

                test ('Button [ENREGISTRER] - Click', async () => {
                    if (iNbChoix > 0) {
                        await fonction.clickAndWait(pageImplant.pPbuttonChangeEnregistrer, page);
                    } else {
                        test.skip();
                    }
                })
                
                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden - Check', async () => {
                    if (iNbChoix > 0) {
                        await fonction.popinVisible(page, sNomPopin, false);
                    } else {
                        test.skip();
                    }
                })

            })

            test ('ListBox [ZONE] #2 = "' + sNomZoneA51 + '"', async() => {
                if (iNbChoix > 0) {
                    await fonction.selectOption(pageImplant.listBoxRayon, sNomZoneA51, 'Zone #2');
                } else {
                    test.skip();
                }
            })

            test ('Input [ALLER A LA PAGE] = "article selectionne"', async() => {
                if(sChoix && sChoix !== ''){
                    sChoix = sChoix.replace(/\*/g, ''); // Les caractères spéciaux ne sont pas pris en compte par l'input autoComplete donc il faux adapter les données
                }
                
                if (iNbChoix > 0) {
                    var oData:AutoComplete = {
                        libelle         :'ARTICLE',
                        inputLocator    : pageImplant.inputPage,
                        inputValue      : sChoix,
                        //choiceSelector  : 'div.autocomplete-article app-autocomplete button.dropdown-item',
                        choicePosition  : 0,
                        typingDelay     : 150,
                        waitBefore      : 700,
                        page            : page,
                    };
                    
                    await fonction.autoComplete(oData);
                } else {
                    test.skip();
                }
            })

            test ('Button [CHANGER ZONE] #2 - Click', async () => {
                if (iNbChoix > 0) {
                    await fonction.clickAndWait(pageImplant.buttonZoneChanger, page);
                } else {
                    test.skip();
                }
            })

            var sNomPopin = "Changement de zone #2";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + '] >', async() => {

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible - Check', async () => {
                    if (iNbChoix > 0) {
                        await fonction.popinVisible(page, sNomPopin, true);
                    } else {
                        test.skip();
                    }
                })

                test ('ListBox [NOUVELLE ZONE] Select = "Zone Initiale"', async() => {
                    if (iNbChoix > 0) {
                        await fonction.selectOption(pageImplant.pPlistBoxChangeZone, sZoneInitiale, 'Zone Initiale');
                        log.set('Retour vers la zone : ' + sZoneInitiale);
                    } else {
                        test.skip();
                    }
                })

                test ('Button [ENREGISTRER] - Click', async () => {
                    if (iNbChoix > 0) {
                        await fonction.clickAndWait(pageImplant.pPbuttonChangeEnregistrer, page);
                    } else {
                        test.skip();
                    }
                })
                
                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden - Check', async () => {
                    if (iNbChoix > 0) {
                        await fonction.popinVisible(page, sNomPopin, false);
                    } else {
                        test.skip();
                    }
                })

            })
        })

    })

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})