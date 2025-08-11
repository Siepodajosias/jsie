/**
 * 
 * 
 * @author JC CALVIERA
 * @since 2023-11-03
 * 
 */
const xRefTest      = "ACH_VNA_ADD";
const xDescription  = "Créer une ventilation article";
const xIdTest       =  1727;
const xVersion      = '3.3';

var info:CartoucheInfo = {
    desc    : xDescription,
    appli   : 'ACH',
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
import { Log }              from '@helpers/log';
import { CartoucheInfo }    from '@commun/types';

import { MenuAchats }       from '@pom/ACH/menu.page';

//-- Pages Objects
import { PageBesVenArt }    from '@pom/ACH/besoins_ventilation-articles.page';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;

let pageVenArt      : PageBesVenArt;

var log             = new Log();
var fonction        = new TestFunctions(log);

//------------------------------------------------------------------------------------
const sRayon        = process.env.RAYON ||'Fruits et légumes';
const sJddFile      = fonction.getLocalConfig('jddVentilArticles');

const today         = new Date();
const rCoef         = Math.floor(fonction.random() * 10) + 1;
var sDesignation    = 'Test_auto - ventil art - ' + sRayon + '-' + fonction.getToday('FR');

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    pageVenArt      = new PageBesVenArt(page);
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    });

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [BESOINS]', () => {

        var sPageName = 'besoins';

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {
            await menu.selectRayonByName(sRayon, page);
        })

        test('Page [BESOINS] - Click', async () => {
            await menu.click(sPageName, page); 
        })
       
        test ('Error Message - Is Hidden', async () =>  {
            await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
        })

        test.describe('Onglet [VENTILATIONS DES ARTICLES]', async () =>  {

            test ('Onglet [VENTILATIONS DES ARTICLES] - Click', async () =>  {
                await menu.clickOnglet(sPageName, 'ventilationsArticles', page);
            })   

            test ('Error Message - Is Hidden', async () =>  {
                await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin               
            })

            var sNomPopin = "Création d'une ventilation article";
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () =>  {

                test('Button [CREER UNE VENTILATION] - Click', async () =>  {
                    await fonction.clickAndWait(pageVenArt.buttonCreerUneVentilation, page);        
                    await fonction.popinVisible(page, sNomPopin);    
                })

                test('Error Message - Is Hidden', async () =>  {
                    await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
                })

                test('InputField [DESIGNATION] = "' + sDesignation + '-xxx"', async () =>  {
                    sDesignation = sDesignation + '-' + fonction.addZero(today.getMilliseconds().toString());
                    log.set('Désignation : ' + sDesignation);
                    await fonction.sendKeys(pageVenArt.pPinputDesignation, sDesignation, false, 'Désignation');
                })

                test('InputField [COEFFICIENT DE SECURITE] = "x"', async ({}, testInfo) =>  {
                    log.set('Coef : ' + rCoef.toString());
                    await fonction.sendKeys(pageVenArt.pPinputCoefficient, rCoef.toString(), false, 'Coef Sécurité');

                    //-- Ecriture du libellé dans un fichier de JDD au format JSON pour récupératiuon des tests suivants
                    const sJsonData = { LIBELLE: sDesignation, COEF: rCoef.toString() };
                    writeFile(testInfo.config.rootDir + sJddFile, JSON.stringify(sJsonData, null, 2), (error) => {
                        if (error) {
                          console.log('An error has occurred ', error);
                          return;
                        }
                        log.set('Enregistrement de la donnée dans le fichier : ' + sJddFile);
                        fonction.addDataSheet('File', 'Write', sJddFile);
                    });
                })

                test('Button [ENREGISTRER] - Click', async () =>  {
                    await fonction.clickAndWait(pageVenArt.pPbuttonEnregistrer, page);        
                    await fonction.popinVisible(page, sNomPopin, false);    
                })                

            })

        })  // End Describe Onglet

    })  // End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})