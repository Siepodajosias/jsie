/**
 * @author Mathis NGUYEN
 * @description Supprimer une gamme
 * @since 2024-05-21
 * 
 */
const xRefTest      = "MAG_GPE_DEL";
const xDescription  = "Supprimer une gamme";
const xIdTest       =  9220;
const xVersion      = '3.3';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : [],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { expect, test, type Page}       from '@playwright/test';

import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';

import { MenuMagasin }                  from '@pom/MAG/menu.page';
import { AutorisationsGammes }          from '@pom/MAG/autorisations-gammes.page';
import { AutorisationsRecomOuverture }  from '@pom/MAG/autorisations-recommandations_ouverture.page';
import { AutorisationsAchatsCentrale }  from '@pom/MAG/autorisations-achats_centrale.page';  

import { CartoucheInfo } from '@commun/types';
//------------------------------------------------------------------------------------

let page                  	: Page;
let menu                  	: MenuMagasin;
let pageGammes              : AutorisationsGammes;
let pageRecomOuverture      : AutorisationsRecomOuverture;
let pageAutoAC              : AutorisationsAchatsCentrale;

const log                 	= new Log();
const fonction            	= new TestFunctions(log);

//------------------------------------------------------------------------------------
fonction.importJdd()

//--- Used to identify the gammes we want to delete (Note : The ORDER cannot be changed !)
const sDesignationDel1  = fonction.getLocalConfig('gammesToDelete')[0]; // Gamme without any RECO, deleted with sDesignationDel2
const sDesignationDel2  = fonction.getLocalConfig('gammesToDelete')[1]; // Gamme with a RECO, deleted with sDesignationDel1
const sDesignationDel3  = fonction.getLocalConfig('gammesToDelete')[2]; // Gamme with a RECO, FL, with assortiment check, deleted with sDesignationDel4
const sDesignationDel4  = fonction.getLocalConfig('gammesToDelete')[3];  // Gamme with a RECO, FL, with assortiment check, deleted with sDesignationDel3
const sDesignationDel5  = fonction.getLocalConfig('gammesToDelete')[4]; // Gamme without any RECO, deleted alone
//----------

//--- Used to do the assortiment check
const sDesignGrpAssort  = fonction.getInitParam('nomAssortiment', 'TA_AchCentrale - FL10 - Chaponnay');
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Fruits et légumes');
const sArticles         = fonction.getInitParam('listeArticles', '5600,5800,5900,6000,6100,6900,6300,6400,6600,7100,7300,7600');
const aListeArticles    = sArticles.split(',');
const sArticle          = aListeArticles[0];
//----------

//--- Used to identify gammes that have recommandations, to check that their respective designation is deleted on the recommandation page (in the datagrid)
const sDesignationMod1 = fonction.getLocalConfig('gammeToRecomm')[0]

const sGroupeArticle2  = fonction.getInitParam('groupeArticle2', 'Marée') // Gamme sDesignationMod1 is related to this groupArticle

const sDesignationMod2 = fonction.getLocalConfig('gammeToRecomm')[1] 
                                                                        // we are not using a new parameter for groupArticle related to Gamme sDesignationMod2 because the value is the one of the assortiment check
const sDesignationMod3 = fonction.getLocalConfig('gammeToRecomm')[2]
                                                                        // we are not using a new parameter for groupArticle related to Gamme sDesignationMod2 because the value is the one of the assortiment check

const gammesDetailsToCheck = [
    { 
        sGroupeArticle: sGroupeArticle,                                 // we use the value from the assortiment check here
        sDesignations: [sDesignationMod2, sDesignationMod3]
    },
    { 
        sGroupeArticle: sGroupeArticle2,
        sDesignations: [sDesignationMod1],
    }
];
//----------

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuMagasin(page, fonction);
    pageRecomOuverture  = new AutorisationsRecomOuverture(page); 
    pageGammes          = new AutorisationsGammes(page);
    pageAutoAC          = new AutorisationsAchatsCentrale(page);
	const helper 		= new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------  

test.describe.serial('[' + xRefTest + ']', async () => {
    
    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [AUTORISATIONS]', async () => {

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

        var sPageName = 'autorisations';

        test ('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(sPageName, page);
        })

        test.describe ('Onglet [GAMMES]', async () => {

            var sNomOnglet = 'gammes';
            test ('Onglet [GAMMES] - Click', async () => {
                await menu.clickOnglet(sPageName, sNomOnglet, page);
            })

            var sNomPopin = 'Suppression d\'une gamme';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {
                
                test ('CheckBox [GAMMES][' + sDesignationDel5 + '] - Select', async () => {
                    await fonction.clickElement(pageGammes.gammeRowsDesignation.filter({ hasText: sDesignationDel5 }));                    
                });

                test ('Button [SUPPRIMER UNE GAMME] - Click', async () => {
                    await fonction.clickAndWait(pageGammes.buttonSupprimer, page);
                })

                var sNomPopin2 = 'Confirmer la suppression d\'une gamme'
                test ('Popin [' + sNomPopin2.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomOnglet, true);
                })

                test ('Button [CONFIRMER SUPPRIMER GAMME] - Click', async () => {
                    await fonction.clickAndWait(pageGammes.pPConfirmSuppressYes, page);
                })

                test ('Popin [' + sNomPopin2.toUpperCase() + '] - Is Hidden', async () => {
                    await fonction.popinVisible(page, sNomOnglet, false); //expect no error : gamme is deleted
                })
                
                test ('td [' + sDesignationDel5 + '] - Is NOT Visible', async () => {                    
                    const filteredRows = pageGammes.gammeRowsDesignation.filter({ hasText: sDesignationDel5 });
                    expect(await filteredRows.count()).toEqual(0); //expect it doesnt exist anymore
                })

                test ('CheckBox [GAMMES]['+sDesignationDel1+'] - Click', async () => {
                    await fonction.clickElement(pageGammes.gammeRowsDesignation.filter({ hasText: sDesignationDel1 }));
                });

                test ('CheckBox [GAMMES]['+sDesignationDel2+'] - Click', async () => {
                    await fonction.clickElement(pageGammes.gammeRowsDesignation.filter({ hasText: sDesignationDel2 }));
                });

                test ('Button [SUPPRIMER PLUSIEURES GAMMES] - Click', async () => {
                    await fonction.clickAndWait(pageGammes.buttonSupprimer, page);
                })

                var sNomPopin3 = 'Confirmer la suppression de plusieurs gammes'
                test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                    test ('Popin [' + sNomPopin3.toUpperCase() + '] - Is Visible', async () => {
                        await fonction.popinVisible(page, sNomOnglet, true);
                    })

                    test ('Button [CONFIRMER SUPPRIMER PLUSIEURS GAMMES] - Click', async () => {
                        await fonction.clickAndWait(pageGammes.pPConfirmSuppressYes, page);
                    })

                    test ('Button [RE-CONFIRMER SUPPRIMER PLUSIEURS GAMMES (RECOMM. OUV)] - Click', async () => {
                        await fonction.clickAndWait(pageGammes.pPReConfirmSuppress.nth(1), page);
                    })

                    test ('Popin [' + sNomPopin2.toUpperCase() + '] - Is Hidden', async () => {
                        await fonction.popinVisible(page, sNomOnglet, false); //expect no error : gammes are deleted
                    })

                })
                  
                test ('td [' + sDesignationDel1 + '] - Is NOT Visible', async () => {
                    const filteredRows = pageGammes.gammeRowsDesignation.filter({ hasText: sDesignationDel1 });
                    expect(await filteredRows.count()).toEqual(0);
                })

                test ('td [' + sDesignationDel2 + '] - Is NOT Visible', async () => {
                    const filteredRows = pageGammes.gammeRowsDesignation.filter({ hasText: sDesignationDel2 });
                    expect(await filteredRows.count()).toEqual(0);
                })

                test ('CheckBox [GAMMES][' + sDesignationDel4 + '] - Click', async () => {
                    await fonction.clickElement(pageGammes.gammeRowsDesignation.filter({ hasText: sDesignationDel3 }));
                });

                test ('Button [SUPPRIMER GAMME COLONNE ACTION] - Click', async () => {
                    const rows = pageGammes.gammeRowsDesignation;
                    const rowCount = await rows.count();

                    for (let i = 0; i < rowCount; i++) {
                        const currentDesignation = await rows.nth(i).textContent();
                        if (currentDesignation.trim() === sDesignationDel3) { //if designation match, then we have found the gamme to delete
                            await fonction.clickAndWait(pageGammes.buttonSupprimerAction.nth(i), page);
                            break;
                        }
                    }
                })

                var sNomPopin4 = 'Confirmer la suppression d\'une gamme COLONNE ACTION'
                test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                    test ('Popin [' + sNomPopin4.toUpperCase() + '] - Is Visible', async () => {
                        await fonction.popinVisible(page, sNomOnglet, true);
                    })

                    test ('Button [CONFIRMER SUPPRIMER GAMME COLONNE ACTION] - Click', async () => {
                        await fonction.clickAndWait(pageGammes.pPConfirmSuppressYes, page);
                    })

                    test ('Button [RE-CONFIRMER SUPPRIMER GAMME COLONNE ACTION (RECOMM. OUV)] - Click', async () => {
                        await fonction.clickAndWait(pageGammes.pPReConfirmSuppress.nth(1), page);
                    })

                    test ('Popin [' + sNomPopin4.toUpperCase() + '] - Is Hidden', async () => {
                        await fonction.popinVisible(page, sNomOnglet, false); //expect no error : gamme is deleted
                    })
                        
                })

                test ('td [' + sDesignationDel3 + '] - Is NOT Visible', async () => {
                    const filteredRows = pageGammes.gammeRowsDesignation.filter({ hasText: sDesignationDel3 });
                    expect(await filteredRows.count()).toEqual(0); //expect it doesnt exist anymore
                })

            })

        })

        test.describe ('Onglet [ACHATS CENTRALE]', async () => {
            var sNomOnglet = 'autorisationAchatCentrale';
            test ('Onglet [ACHATS CENTRALE] - Click', async () => {
                await menu.clickOnglet(sPageName, sNomOnglet, page);
            })

            test ('Input [ASSORTIMENTS] [' + sDesignGrpAssort + ']', async () => {
                await fonction.sendKeys(pageAutoAC.inputAssortiment, sDesignGrpAssort, false, 'Assortiment');
            })

            test ('CheckBox [ASSORTIMENT][0] = ' + sDesignGrpAssort + ' - Click', async () => {
                await fonction.wait(page,250);
                var sText:string = sDesignGrpAssort + ' (' + sGroupeArticle + ')'
                await fonction.clickElement(pageAutoAC.checkBoxAssortiments.locator('td:text-is("'+sText+'")'));
            })

            test ('Input [CODE ARTICLE][' + sArticle + ']', async () => {
                await fonction.sendKeys(pageAutoAC.dataGridHeaderCdeArt, sArticle, false, 'Code Article');
                await fonction.waitTillHTMLRendered(page)
            })

            test('DataGrid [ARTICLES DE L\'ASSORTIMENT][first] - Click', async () => {
                await fonction.clickElement(pageAutoAC.trLignesArticles.first());
            })

            var nomPopin = 'Modification d\'une ligne de l\'assortiment';
            test.describe('Popin [' + nomPopin.toUpperCase() + '] ', async () => {

                test('Button [MODIFIER LA LIGNE] - Click', async () => {
                    await fonction.clickAndWait(pageAutoAC.buttonModifierLigne, page);
                })

                test('Popin [' + nomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await pageAutoAC.pPopinEnregLAssortFL.isVisible();
                })

                test('Button [GAMME] = "' + sDesignationDel4 + ' - Click', async () => { //Filter by Gamme
                    await fonction.clickAndWait(pageAutoAC.pPToggleGamme.filter({ hasText: sDesignationDel4 }).first(), page);
                })

                test ('DataGrid [VALUES] - Check', async () => { //Check pictogramme
                    const rows = pageAutoAC.pPDataGridMagasin.locator('table tbody tr')
                    const rowCount = await rows.count();

                    for (let i = 0; i < rowCount; i++) {
                        const row = rows.nth(i);
                        expect(await row.locator('i.pi-bookmark-fill.ng-star-inserted').count()).toBe(1); //expect to see a pictogram
                    }
                })

                test('Button [GAMME] = "' + sDesignationDel4 + ' - UnClick', async () => { //Filter by Gamme
                    await fonction.clickAndWait(pageAutoAC.pPToggleGamme.filter({ hasText: sDesignationDel4 }).first(), page);
                })

                test('Button [FERMER] - Click', async () => {
                    await fonction.clickElement(pageAutoAC.pPButtonFermer);
               })

            })

        })

        test.describe ('Onglet [GAMMES #2]', async () => {

            var sNomOnglet = 'gammes';
            test ('Onglet [GAMMES #2] - Click', async () => {
                await menu.clickOnglet(sPageName, sNomOnglet, page);
            })

            var sNomPopin = 'Suppression d\'une gamme';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ' #2]', async () => {
                
                test ('CheckBox [GAMMES][' + sDesignationDel4 + '] - Select', async () => {
                    await fonction.clickElement(pageGammes.gammeRowsDesignation.filter({ hasText: sDesignationDel4 }));                    
                });

                test ('Button [SUPPRIMER UNE GAMME #2] - Click', async () => {
                    await fonction.clickAndWait(pageGammes.buttonSupprimer, page);
                })

                var sNomPopin2 = 'Confirmer la suppression d\'une gamme'
                test ('Popin [' + sNomPopin2.toUpperCase() + '] - Is Visible #2', async () => {
                    await fonction.popinVisible(page, sNomOnglet, true);
                })

                test ('Button [CONFIRMER SUPPRIMER GAMME #2] - Click', async () => {
                    await fonction.clickAndWait(pageGammes.pPConfirmSuppressYes, page);
                })

                test ('Button [RE-CONFIRMER SUPPRIMER GAMME (RECOMM. OUV) #2] - Click', async () => {
                    await fonction.clickAndWait(pageGammes.pPReConfirmSuppress.nth(1), page);
                })

                test ('Popin [' + sNomPopin2.toUpperCase() + '] - Is Hidden #2', async () => {
                    await fonction.popinVisible(page, sNomOnglet, false); //expect no error : gamme is deleted
                })
                
                test ('td [' + sDesignationDel4 + '] - Is NOT Visible', async () => {                    
                    const filteredRows = pageGammes.gammeRowsDesignation.filter({ hasText: sDesignationDel4 });
                    expect(await filteredRows.count()).toEqual(0); //expect it doesnt exist anymore
                })

            })

        })

        test.describe ('Onglet [RECOMMANDATION D\'OUVERTURE]', async () => {
            var sNomOnglet = 'recomOuverture';
            test ('Onglet [RECOMMANDATIONS D\'OUVERTURE] - Click', async () => {
                await menu.clickOnglet(sPageName, sNomOnglet, page);
            })

            gammesDetailsToCheck.forEach((gamme, index) => {

                test ('ListBox [GROUPE ARTICLE] = "' + gamme.sGroupeArticle + ' #' + index + ' "', async () => {
                    await fonction.ngClickListBox(pageRecomOuverture.listBoxGroupeArticle, gamme.sGroupeArticle, pageRecomOuverture.listBoxChoixGroupeArticle);
                    await fonction.waitTillHTMLRendered(page);
                });

                test ('** Wait Until Spinner Off #' + index + '**', async () => {
                    var iDelaiTest = 120000;
                    test.setTimeout(iDelaiTest);
                    await expect(page.locator('i.app-spinner')).not.toBeVisible({timeout:iDelaiTest});
                })

                gamme.sDesignations.forEach((sDesignation) => {
                    test('Datagrid [VALUES] - Check Not Visible - ' + sDesignation + ' #' + index, async () => {
                        const thSubHeaders = pageRecomOuverture.dataGridListeRecomSub;
                        const thSubHeadersCount = await thSubHeaders.count();
                        let bFound = false;
            
                        for (let iCpt = 0; iCpt < thSubHeadersCount; iCpt++) {
                            const sTextContent = await thSubHeaders.nth(iCpt).textContent();
                            if (sTextContent?.trim() === sDesignation.trim()) {
                                bFound = true;
                                break;
                            }
                        }
            
                        // Expect to not have found it 
                        expect(bFound).toBe(false);
                    });
                });

            })

        })

    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})