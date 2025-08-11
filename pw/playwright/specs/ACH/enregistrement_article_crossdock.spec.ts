/**
 * @author Vazoumana DIARRASSOUBA
 * @since   2024-05-06
 * 
 */
const xRefTest      = "ACH_CRD_ENG";
const xDescription  = "Enregistrer un achat BCT / Saprimex (CrossDock)";
const xIdTest       =  5164;
const xVersion      = '3.1';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : ['dossierAchat', 'plateforme'],         
    params      : [],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { test, type Page }from '@playwright/test';
import { Help }           from '@helpers/helpers.js';
import { TestFunctions }  from '@helpers/functions.js';
import { Log }            from '@helpers/log.js';
//-- PageObject ----------------------------------------------------------------------

import { MenuAchats }     from '@pom/ACH/menu.page'; 
import { PageAchat }      from '@pom/ACH/achats.page';
import { CartoucheInfo }  from '@commun/types';

//------------------------------------------------------------------------------------

let page                  : Page;
let menu                  : MenuAchats;
let pageAchat             : PageAchat;

const log                 = new Log();
const fonction            = new TestFunctions(log);
//------------------------------------------------------------------------------------

const sDossierAchat       = fonction.getInitParam('dossierAchat', fonction.getLocalConfig('dossierAchatCrossdock'));    
const sPlateforme         = fonction.getInitParam('plateforme', 'Cremlog'); 
const sFournisseur        = 'Sas Les Ateliers Ⓔ';

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                 = await browser.newPage();
    menu                 = new MenuAchats(page, fonction);
    pageAchat            = new PageAchat(page); 
    const helper         = new Help(info, testInfo, page);
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

    test('Connexion', async () => {
        await fonction.connexion(page);
    })
   
    test.describe('Page [ACHATS]', function() {

        test('ListBox [RAYON] = "BCT"', async() => {
            await menu.selectRayonByName('BCT', page);
        })
 
        test('Page [ACHATS] - Click', async () => {
            await menu.click('achats', page);
        })

        test('Label [ERREUR 1] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })        

        test('ListBox [DOSSIER D\'ACHAT] = "' + sDossierAchat + '"', async () => {
            await fonction.listBoxByLabel(pageAchat.listBoxDossierAchatCal, sDossierAchat, page);
        })

        test('DataGrid [PLATEFORME] = "' + sPlateforme + '"', async () => {
            await fonction.clickElement(pageAchat.tdListPlateformes.filter({hasText: sPlateforme}), page);
        })

        test('Pictogram [BASCULER CROSSDOCKING] - Click', async () => {
            test.setTimeout(90000);
            await pageAchat.tdListPlateformes.filter({hasText: sPlateforme}).hover({timeout:3000});
            await fonction.clickElement(pageAchat.pictoBasculerCrossDock, page);
        })

        test('DataGrid [FOURNISSEUR] = "' + sFournisseur + '"', async () => {
            await pageAchat.tdListFournisseurs.last().waitFor({state:'visible'})
            await fonction.clickAndWait(pageAchat.tdListFournisseurs.filter({hasText: sFournisseur}), page);
        })

        test('** Wait Until Spinner Off **', async () => {
            await fonction.waitForSpinner(pageAchat.imgSpinner, 90000);
        })

        test('Button [ENREGISTRER] - Click', async () => {
            var iNbChamps = await pageAchat.inputAAcheter.count();
            log.set('Nombre d\'articles : ' + iNbChamps);

            await fonction.clickAndWait(pageAchat.buttonEnregistrer, page);
        })

        test('Label [ERREUR 2] - Is Not Visible', async () => {   // Pas d'erreur affichée à la fin de l'action
            await fonction.isErrorDisplayed(false, page);
        })                            
    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
})