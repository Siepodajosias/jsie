/**
 * @author JC CALVIERA
 * @since   2021-01-22
 * 
 */
const xRefTest      = "ACH_CAM_NEW";
const xDescription  = "Créer une nouvelle campagne";
const xIdTest       =  2629;
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

import { MenuAchats }       from '@pom/ACH/menu.page'; 
import { PageAnaCmp }       from '@pom/ACH/analyse_campagne.page';

import { AutoComplete }     from '@commun/types';

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

const sRayon        = fonction.getInitParam('rayon', 'Fruits et légumes');

const sNomCampagne  = 'TEST-AUTO_Nom_Campagne-' + fonction.getToday();
const sCaracteres   = 'abcdefghijlmnoprstuv0123456789';
const iQuantite     = (Math.floor(fonction.random() * 100), 1) + 1;
const rPrix         = (Math.floor(fonction.random() * 10000)) / 100;

//------------------------------------------------------------------------------------

var getRandomLettre = function() {
    return sCaracteres.substr(Math.floor(fonction.random() * sCaracteres.length), 1);
}

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

        test ('Button [CREER] - Click', async() => {
            await fonction.clickElement(pageCpgne.buttonCreer);                
        })

        var sNomPopin = "Ajout d'une campagne";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

            test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async() => {       
                await fonction.popinVisible(page, sNomPopin);
            })

            test ('Message [ERREUR] - Is NOT Visible', async() => {
                await fonction.isErrorDisplayed(false, page);                
            })  

            test ('InputField [NOM CAMPAGNE] = "'+sNomCampagne+'"', async() => {
                await fonction.sendKeys(pageCpgne.pPajoutCpgneInputNomCampagne, sNomCampagne, false, 'Nom Campagne');                
            })

            test ('AutoComplete [FOURNISSEUR] = rnd', async () =>  {

                const autoComplete:AutoComplete = {
                    libelle         : 'Fournisseur',
                    inputLocator    : pageCpgne.pPajoutCpgneInputFournisseur,
                    inputValue      : getRandomLettre(),
                  //choiceSelector  : 'li.gfit-autocomplete-result',
                  //choicePosition  : 0;
                    verbose         : true,
                  //typingDelay     : 100,
                  //waitBefore      : 500,
                    page            : page
                }
    
                await fonction.autoComplete(autoComplete);
            })

            test ('DatePicker [DATE DEBUT][first] - Click', async() => {
                await fonction.clickElement(pageCpgne.pPajoutCpgneDatePickerDebut);                               
                await fonction.clickElement(pageCpgne.pPajoutCpgneDatePickerDays.first());               
            })

            test ('DatePicker [DATE FIN][last] - Click', async() => {
                await fonction.clickElement(pageCpgne.pPajoutCpgneDatePickerFin);               
                await fonction.clickElement(pageCpgne.pPajoutCpgneDatePickerDays.last());               
            })
            
            test ('AutoComplete [ARTICLE] = rnd', async () =>  {

                const autoComplete:AutoComplete = {
                    libelle         : 'Article',
                    inputLocator    : pageCpgne.pPajoutCpgneInputArticle,
                    inputValue      : getRandomLettre(),
                  //choiceSelector  : 'li.gfit-autocomplete-result',
                  //choicePosition  : 0;
                    verbose         : true,
                  //typingDelay     : 100,
                  //waitBefore      : 500,
                    page            : page
                }
    
                await fonction.autoComplete(autoComplete);
            })

            test ('ListBox [UNITE] - Click', async() => {
                await fonction.clickElement(pageCpgne.pPajoutCpgneListBoxUnite);    
            })            

            test ('ListBox [UNITE] = rnd', async() => {
                var iNbChoix = await page.locator('#nouvelle-ligne-unite-achat option').count();       
                var iRnd = Math.floor(fonction.random() * (iNbChoix - 1)) + 1;                             
                var sUnite = await page.locator('#nouvelle-ligne-unite-achat option').nth(iRnd).textContent();

                //-- Impossible de tpouver le DOM correspondant aux choix de la LB. A creuser...

                //await page.locator('#nouvelle-ligne-unite-achat option').nth(iRnd).click();
                //await pageCpgne.pPajoutCpgneListBoxUnite.locator('option:has-text("'+sUnite+'")').click();
                //await fonction.sendKeys(pageCpgne.pPajoutCpgneListBoxUnite, sUnite);

                for (let iCpt = 0; iCpt < iRnd; iCpt++) {
                    await page.keyboard.press('ArrowDown');
                }
                log.set('Unite : ' + sUnite);
                fonction.addDataSheet('InputField', 'Unité', sUnite);
            })            
            
            test ('InputField [QUANTITE] = rnd', async() => {
                await fonction.sendKeys(pageCpgne.pPajoutCpgneInputQuantite, iQuantite, false, 'Quantité');       
                log.set('Quantité : ' + iQuantite);         
            })
            
            test ('InputField [PRIX] = rnd', async() => {
                await fonction.sendKeys(pageCpgne.pPajoutCpgneInputPrix, rPrix, false, 'Prix');         
                log.set('Prix : ' + rPrix);        
            })
            
            test ('Button [AJOUTER] - Click', async() => {
                await fonction.clickElement(pageCpgne.pPajoutCpgneButtonAjouter);                
            })
            
            test ('Button [ENREGISTRER] - Click', async() => {
                await fonction.clickElement(pageCpgne.pPajoutCpgneButtonEnregistrer);                
            })

        })

    }) // end test.describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

}) 