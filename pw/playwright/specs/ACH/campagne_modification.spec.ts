/**
 * @author JC CALVIERA
 * @since   2021-01-22
 * 
 */
const xRefTest      = "ACH_CAM_MOD";
const xDescription  = "Modification d'une campagne";
const xIdTest       =  2626;
const xVersion      = '3.2';
 
var info:CartoucheInfo = {
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

import { test, type Page}   from '@playwright/test';

import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { Log }              from '@helpers/log.js';

import { MenuAchats }       from '@pom/ACH/menu.page.js'; 
import { PageAnaCmp }       from '@pom/ACH/analyse_campagne.page';

import { AutoComplete, CartoucheInfo } from '@commun/types';

//------------------------------------------------------------------------------------

let page                  : Page;
let menu                  : MenuAchats;
let pageCpgne             : PageAnaCmp;

const log                 = new Log();
const fonction            = new TestFunctions(log);

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuAchats(page, fonction);
    pageCpgne           = new PageAnaCmp(page); 
    const helper        = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------  

const sRayon        = fonction.getInitParam('rayon', 'Fruits et légumes');

const sCaracteres   = 'abcdefghijlmnoprstuv0123456789';
const iQuantite     = (Math.floor(fonction.random() * 100), 1) + 1;
const rPrix         = (Math.floor(fonction.random() * 10000)) / 100;

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', async () => {  
    
    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
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

        // On tri sur le statut afin déviter d'avoir en tête de colonne des campagne terminées qui ne sont plus modifiable
        test ('Header DataGrid [STATUT] - Click', async() => {
            await fonction.clickElement(pageCpgne.thHeaderStatut);                
        })

        test ('CheckBox [CAMPAGNE][0] - Click', async() => {
            await fonction.clickElement(pageCpgne.checkBoxListeCampagnes.first());                
        })

        test ('Button [MODIFIER] - Click', async() => {
            await fonction.clickElement(pageCpgne.buttonModifier);                
        })

        var sNomPopin = "Modification d'une campagne";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

            let bActionAnnulee:boolean = false;

            test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async() => {       
                await fonction.popinVisible(page, sNomPopin);
            })

            test ('Message [ERREUR] - Is NOT Visible', async() => {
                await fonction.isErrorDisplayed(false, page);                
            })  
            
            test ('AutoComplete [ARTICLE] = rnd', async () =>  {

                const autoComplete:AutoComplete = {
                    libelle         : 'Article',
                    inputLocator    : pageCpgne.pPajoutCpgneInputArticle,
                    inputValue      : fonction.getRandomLetter(sCaracteres),
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
                await fonction.selectRandomListBoxOption(pageCpgne.pPajoutCpgneListBoxUnite, true);
                const sUnite = await pageCpgne.pPajoutCpgneListBoxUnite.textContent();
                log.set('Unite : ' + sUnite);
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
                if (await pageCpgne.pPajoutCpgneButtonAjouter.isEnabled()) {
                    await fonction.clickElement(pageCpgne.pPajoutCpgneButtonAjouter);
                } else {
                    bActionAnnulee = true;
                }                
            })
            
            test ('Button [ENREGISTRER] - Click', async() => {
                if (bActionAnnulee === false) {
                    await fonction.clickElement(pageCpgne.pPajoutCpgneButtonEnregistrer);                
                }
            })

            test ('Button [ANNULER] - Click (optionnel)', async() => {
                if (bActionAnnulee === true) {
                    await fonction.clickElement(pageCpgne.pPajoutCpgneLinkNon);
                    log.set('Opération Annulée');
                } else {
                    test.skip();
                }                
            })

        })

    }) // end test.describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

}) 