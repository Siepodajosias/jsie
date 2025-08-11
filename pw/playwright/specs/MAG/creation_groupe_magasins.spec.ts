/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 02 - 01 - 2024
 */

const xRefTest      = "MAG_GRP_MAG";
const xDescription  = "Création d'un groupe de magasins";
const xIdTest       =  1978;
const xVersion      = '3.4';

var info = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['rayon'],
    params      : [],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}                from '@playwright/test';

import { TestFunctions }                 from "@helpers/functions";
import { Log }                           from "@helpers/log";
import { Help }                          from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }                   from '@pom/MAG/menu.page';
import { AutorisationsGroupeMagasins }   from '@pom/MAG/autorisations-groupe_magasins.page';

//-------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuMagasin;
let pageAutGrpMag   : AutorisationsGroupeMagasins;

const log           = new Log();
const fonction      = new TestFunctions(log);

fonction.recordDatas();

//----------------------------------------------------------------------------------------

var maDate              = new Date();
const sDesignation      = 'TA_DesigGrpMag - ' + maDate.getFullYear() + (maDate.getMonth() + 1) + maDate.getDate() + '_' + maDate.getHours() + maDate.getMinutes();
const iNbMagAssocier    = 10;
const sRayon            = fonction.getInitParam('rayon', 'Fruits et légumes');

//---------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageAutGrpMag   = new AutorisationsGroupeMagasins(page);
})
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    })

    test ('Ouverture URL', async() => {
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [ACCUEIL]', async () => {

        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if(isVisible){
                await menu.removeArlerteMessage(page);
            }else{                
                log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                test.skip();
            }
        })
    })

    test.describe ('Page [AUTORISATIONS]', async () => {

        var pageName = 'autorisations';

        test ('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(pageName,page);
        })

        test ('Onglet [GROUPES DE MAGASINS] - Click', async () => {
            await menu.clickOnglet(pageName, 'groupeMagasins', page);
        })

        test ('ListBox [RAYON] = "' + sRayon + '"', async () => {
            await fonction.selectOption(pageAutGrpMag.listBoxRayon, sRayon, 'Rayon')
        })

        test.describe ('Onglet [GROUPES DE MAGASINS]', async () => {

            test ('Button [CREER UN GROUPE] - Click', async () => {                  
                await fonction.clickAndWait(pageAutGrpMag.buttonCreerGroupe, page);             
            })        

            var sNomPopin   = 'CREATION D\'UN GROUPE DE MAGASINS';
            test.describe ('Popin [' + sNomPopin + ']', async () => {

                test ('Popin [' + sNomPopin + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })
                
                test ('InputField [DESIGNATION] = "' + sDesignation + '"', async () => {
                    await fonction.sendKeys(pageAutGrpMag.pPinputDesignation, sDesignation, false, 'Désignation');
                })
                
                test ('ListBox [TYPE][rnd] - Select', async () => {
                    await fonction.selectRandomListBoxOption(pageAutGrpMag.pPlistBoxType, false, 'Type Groupe');
                })        

                test ('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pageAutGrpMag.pPbuttonEnregistrer, page);
                })

                test ('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })

            })  // End describe Popin

            test ('CheckBox [GROUPE DE MAGASIN][0] - Click', async () =>{
                await fonction.clickElement(pageAutGrpMag.checkBoxGroupeMagasins.nth(0));
            })

            test ('CheckBox [MAGASINS][rnd * ' + iNbMagAssocier + '] - Click', async () =>{
                test.setTimeout(90000);
                var iNbMag = await pageAutGrpMag.checkBoxListMagasins.count();
                console.log('Nb Magasin : ', iNbMag);
                for(var cpt=0; cpt < iNbMagAssocier; cpt++) {
                    var iNbMag = await pageAutGrpMag.checkBoxListMagasins.count();
                    var iCible    = (Math.floor(fonction.random() * iNbMag));
                    await pageAutGrpMag.checkBoxListMagasins.nth(iCible).scrollIntoViewIfNeeded();
                    var isVisible = await pageAutGrpMag.checkBoxListMagasins.nth(iCible).isVisible();
                    var isEnabled = await pageAutGrpMag.checkBoxListMagasins.nth(iCible).isEnabled();
                    if(isEnabled && isVisible){
                        await fonction.clickElement(pageAutGrpMag.checkBoxListMagasins.nth(iCible));
                        const sNomMagasin = await pageAutGrpMag.checkBoxListMagasins.nth(iCible).locator('td').nth(2).textContent();
                        await fonction.addDataSheet('CheckBox', 'Magasin #' + cpt.toString(), sNomMagasin);
                    }
                }
            })

            test ('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageAutGrpMag.buttonEnregistrer, page);
            })

        })  // End describe onglet

    }) //End describe page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})