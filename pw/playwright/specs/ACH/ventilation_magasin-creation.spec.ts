/**
 * 
 * 
 * @author JC CALVIERA
 * @since 2023-11-03
 * 
 */
const xRefTest      = "ACH_VNM_ADD";
const xDescription  = "Créer une ventilation magasin";
const xIdTest       =  1729;
const xVersion      = '3.5';

var info:CartoucheInfo = {
    desc    : xDescription,
    appli   : 'ACHATS',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : [],
    params  : ['rayon'],
    fileName: __filename
};

//------------------------------------------------------------------------------------
const { writeFile } = require('fs');

import { test, type Page }  from '@playwright/test';

//-- Helpers
import { Help }             from '@helpers/helpers';
import { TestFunctions }    from '@helpers/functions';
import { Log }              from '@helpers/log'

import { MenuAchats }       from '@pom/ACH/menu.page';
import { PageBesVenMag }    from '@pom/ACH/besoins_ventilation-magasins.page';
import { CartoucheInfo }    from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;

let pageVenMag      : PageBesVenMag;

var log             = new Log();
var fonction        = new TestFunctions(log);

//------------------------------------------------------------------------------------

const sRayon        = fonction.getInitParam('rayon', 'Fruits et légumes');

const sFileJdd      = fonction.getLocalConfig('jddVentilMagasins');

const today         = new Date();
var sDesignation    = 'Test_auto - ventil mag - ' + sRayon.toLowerCase() + '-' + fonction.getToday("US");
//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    pageVenMag      = new PageBesVenMag(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [BESOINS]', () => {

        var sPageName:string = 'besoins';

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {
            await menu.selectRayonByName(sRayon, page);
        })

        test('Page [BESOINS] - Click', async () => {
            await menu.click(sPageName, page); 
        })
       
        test ('Error Message - Is Hidden', async () =>  {
            await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
        })

        test.describe('Onglet [VENTILATIONS DES MAGASINS]', async () =>  {

            test ('Onglet [VENTILATIONS DES MAGASINS] - Click', async () =>  {
                await menu.clickOnglet(sPageName, 'ventilationsMagasins', page);
            })   

            test ('Error Message - Is Hidden', async () =>  {
                await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
            })

            var sNomPopin:string = "Création d'une ventilation magasins";
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () =>  {

                test('Button [CREER UNE VENTILATION] - Click', async () =>  {
                    await fonction.clickAndWait(pageVenMag.buttonCreerVentilationMag, page);          
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async() => {          
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test('Error Message - Is Hidden', async () =>  {
                    await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
                })

                test('InputField [DESIGNATION] = "'+sDesignation+'-xxx"', async ({}, testInfo) =>  {
                    sDesignation = sDesignation + '-' + fonction.addZero(today.getMilliseconds().toString());
                    log.set('Désignation : ' + sDesignation);
                    await fonction.sendKeys(pageVenMag.pPinputDesignation, sDesignation, false, 'Désignation');

                    //-- Ecriture du libellé dans un fichier de JDD au format JSON pour récupératiuon des tests suivants
                    const sJsonData = { LIBELLE: sDesignation };
                    writeFile(testInfo.config.rootDir + sFileJdd, JSON.stringify(sJsonData, null, 2), (error) => {
                        if (error) {
                          console.log('An error has occurred ', error);
                          return;
                        }
                        log.set('Enregistrement de la donnée dans le fichier : ' + sFileJdd);
                        fonction.addDataSheet('File', 'Write', sFileJdd);
                    });
                })

                test('Button [ENREGISTRER] - Click', async () =>  {
                    await fonction.clickAndWait(pageVenMag.pPbuttonEnregistrer, page);          
                })      
                
                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async() => {          
                    await fonction.popinVisible(page, sNomPopin, false);
                })
            })
        })  // End Describe Onglet
    })  // End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})