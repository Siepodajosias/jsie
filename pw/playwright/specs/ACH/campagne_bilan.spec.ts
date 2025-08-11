/**
 * @author JC CALVIERA
 * @since   2021-01-22
 * 
 */
const xRefTest      = "ACH_CAM_BIL";
const xDescription  = "Bilan d'une campagne";
const xIdTest       =  2628;
const xVersion      = '3.1';
 
var info = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : ['rayon'],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { test, type Page }  from '@playwright/test';
import { Help }             from '@helpers/helpers';
import { TestFunctions }    from '@helpers/functions';
import { Log }              from '@helpers/log';
//-- PageObject ----------------------------------------------------------------------

import { MenuAchats }       from '@pom/ACH/menu.page'; 
import { PageAnaCmp }       from '@pom/ACH/analyse_campagne.page';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuAchats;
let pageCpgne           : PageAnaCmp;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

const sRayon          	= fonction.getInitParam('rayon', 'Fruits et légumes');

const sCommentVolume    = 'TEST-AUTO Commentaire du suivi du VOLUME réalisé le : ' + fonction.getToday() + ' ! % #';
const sCommentPrix      = 'TEST-AUTO Commentaire du suivi du PRIX réalisé le : ' + fonction.getToday() + ' ! \' < % #';
const sCommentCA        = 'TEST-AUTO Commentaire du suivi du CA réalisé le : ' + fonction.getToday() + ' ! \' < % #';

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page                 = await browser.newPage();
    menu                 = new MenuAchats(page, fonction);
    pageCpgne            = new PageAnaCmp(page); 
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', async () => {  
    
    test ('- Start -', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    });

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async () => {
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe ('Page [ANALYSE]', async () => {

        var sNomPage = 'analyse';

        test ('ListBox [RAYON] = "' + sRayon + '"', async () => {                    
            await menu.selectRayonByName(sRayon, page);
        })

        test ('Page [ANALYSE] - Click', async() => {
            await menu.click(sNomPage, page, 60000);                
        })

        test ('Message [ERREUR] - Is NOT Visible', async() => {
            await fonction.isErrorDisplayed(false, page);                
        })

        test ('CheckBox [CAMPAGNE][0] - Click', async() => {
            await fonction.clickElement(pageCpgne.checkBoxListeCampagnes.first());                
        })

        test ('Button [BILAN DE CAMPAGNE] - Click', async() => {
            await fonction.clickElement(pageCpgne.buttonBilanCampagne);                
        })

        var sNomPopin = "Bilan de la campagne";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

            test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async() => {       
                await fonction.popinVisible(page, sNomPopin);
            })

            test ('Message [ERREUR] - Is NOT Visible', async() => {
                await fonction.isErrorDisplayed(false, page);                
            })  

            test ('Pictogramme [COMMENTAIRE SUIVI DE VOLUME][0] - Click', async() => {
                await fonction.clickElement(pageCpgne.pPbilanPictoSuiviVolume.first());                
            }) 

            test.describe ('Commentaire du suivi du VOLUME', async() => {
                
                test ('InputField [VOLUME]', async() => {
                    await fonction.sendKeys(pageCpgne.pPbilanPictoSuiviVolume.first().locator('textarea').first(), sCommentVolume, false, 'Volume');                
                })                  

                test ('Button [ENREGISTRER] - Click', async() => {
                    await fonction.clickElement(pageCpgne.pPbilanPictoSuiviVolume.first().locator('button').first());                
                })

            })

            test ('Pictogramme [COMMENTAIRE SUIVI DE PRIX][0] - Click', async() => {
                await fonction.clickElement(pageCpgne.pPbilanPictoSuiviPrix.first());                
            }) 

            test.describe ('Commentaire du suivi du PRIX', async() => {
                
                test ('InputField [PRIX]', async() => {
                    await fonction.sendKeys(pageCpgne.pPbilanPictoSuiviPrix.first().locator('textarea').first(), sCommentPrix, false, 'Prix');                
                })                  

                test ('Button [ENREGISTRER] - Click', async() => {
                    await fonction.clickElement(pageCpgne.pPbilanPictoSuiviPrix.first().locator('button').first());                
                })

            })

            test ('Pictogramme [COMMENTAIRE SUIVI DE CA][0] - Click', async() => {
                await fonction.clickElement(pageCpgne.pPbilanPictoSuiviCA.first());                
            }) 

            test.describe ('Commentaire du suivi du CA', async() => {
                
                test ('InputField [CA]', async() => {
                    await fonction.sendKeys(pageCpgne.pPbilanPictoSuiviCA.first().locator('textarea').first(), sCommentCA, false, 'CA');                
                })                  

                test ('Button [ENREGISTRER] - Click', async() => {
                    await fonction.clickElement(pageCpgne.pPbilanPictoSuiviCA.first().locator('button').first());                
                })

            })

            test ('Button [FERMER] - Click', async() => {
                await fonction.clickElement(pageCpgne.pPBilanCpgneLinkFermer);                
            })

        })

        test ('Popin [' + sNomPopin.toUpperCase() + '] - Is NOT Visible', async() => {       
            await fonction.popinVisible(page, sNomPopin, false);
        })

    }) // end test.describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

}) 