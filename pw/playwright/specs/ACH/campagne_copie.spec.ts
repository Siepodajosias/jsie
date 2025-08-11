/**
 * @author JC CALVIERA
 * @since   2021-01-22
 * 
 */
const xRefTest      = "ACH_CAM_COP";
const xDescription  = "Copie d'une campagne";
const xIdTest       =  2627;
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

import { test, type Page, expect}   from '@playwright/test';
import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';

//-- PageObject ----------------------------------------------------------------------

import { MenuAchats }               from '@pom/ACH/menu.page'; 
import { PageAnaCmp }               from '@pom/ACH/analyse_campagne.page';

//------------------------------------------------------------------------------------

let page                  : Page;
let menu                  : MenuAchats;
let pageCpgne             : PageAnaCmp;

const log                 = new Log();
const fonction            = new TestFunctions(log);

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

const sRayon          	= fonction.getInitParam('rayon', 'Fruits et légumes');

const sNomCampagne      = 'TEST-AUTO_Copie_Nom_Campagne-' + fonction.getToday();

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

    test.describe('Page [ANALYSE]', async () => {

        var sNomPage = 'analyse';
        var iNbCampagnes = 0; 

        test ('ListBox [RAYON] = "' + sRayon + '"', async () => {                    
            await menu.selectRayonByName(sRayon, page);
        })

        test ('Page [ANALYSE] - Click', async() => {
            await menu.click(sNomPage, page, 60000);                
        })

        test ('Message [ERREUR] - Is NOT Visible', async() => {
            await fonction.isErrorDisplayed(false, page);                
        })

        // On tri sur le statut afin déviter d'avoir en tête de colonne des campagne terminées qui ne sont plus modifiable
        test ('Header DataGrid [STATUT] - Click', async() => {
            await fonction.clickElement(pageCpgne.thHeaderStatut);      
            iNbCampagnes = await pageCpgne.tdNomCampagne.count();        
            log.set('Nombre de campagnes AVANT copie : ' + iNbCampagnes);  
        })

        test ('CheckBox [CAMPAGNE][0] - Click', async() => {
            await fonction.clickElement(pageCpgne.checkBoxListeCampagnes.first());                
        })

        test ('Button [COPIER] - Click', async() => {
            await fonction.clickElement(pageCpgne.buttonCopier);                
        })

        var sNomPopin = "Copie de la campagne XXXX";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

            test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async() => {       
                await fonction.popinVisible(page, sNomPopin);
            })

            test ('Message [ERREUR] - Is NOT Visible', async() => {
                await fonction.isErrorDisplayed(false, page);                
            })  
            
            test ('InputField [NOM DE LA CAMPAGNE] = rnd', async() => {
                await fonction.sendKeys(pageCpgne.pPcopieCpgneInputNomCampagne, sNomCampagne, false, 'Nom Campagne');       
                log.set('Nom de la campagne copiée : ' + sNomCampagne);         
            })            

            test ('DatePicker [DATE DEBUT][first] - Click', async() => {
                await fonction.clickElement(pageCpgne.pPcopieCpgneDatePickerDebut);                               
                await fonction.clickElement(pageCpgne.pPajoutCpgneDatePickerDays.first());               
            })

            test ('DatePicker [DATE FIN][last] - Click', async() => {
                await fonction.clickElement(pageCpgne.pPcopieCpgneDatePickerFin);               
                await fonction.clickElement(pageCpgne.pPajoutCpgneDatePickerDays.last());               
            })
            
            test ('Button [COPIER] - Click', async() => {
                await fonction.clickAndWait(pageCpgne.pPcopieButtonCopier, page);                
            })

        })

        test ('td [NOMBRE CAMPAGNE] = +1', async() => {
            var iNbCampagnesApresCopie = await pageCpgne.tdNomCampagne.count();
            expect(iNbCampagnesApresCopie).toBeGreaterThan(iNbCampagnes);  
            log.set('Nombre de campagnes APRES copie : ' + iNbCampagnesApresCopie);              
        })

    }) // end test.describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

}) 