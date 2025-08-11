/**
 * 
 * 
 * @author JC CALVIERA
 * @since 2023-11-07
 * 
 */
const xRefTest      = "ACH_VNM_MOD";
const xDescription  = "Modifier une ventilation article";
const xIdTest       =  1728;
const xVersion      = '3.2';

var info = {
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
import { Log }              from '@helpers/log'

//-- Pages Objects
import { MenuAchats }       from '@pom/ACH/menu.page';
import { PageBesVenArt }    from '@pom/ACH/besoins_ventilation-articles.page';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;

let pageVenArt      : PageBesVenArt;

var log             = new Log();
var fonction        = new TestFunctions(log);

//------------------------------------------------------------------------------------
const sRayon        = fonction.getInitParam('rayon', 'Fruits et légumes');

const sJddFile      = fonction.getLocalConfig('jddVentilArticles');
const oDatas        = fonction.readFile(sJddFile);
const rCoef         = Math.floor(fonction.random() * 10) + 1;
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

            test ('Label ["' + oDatas.LIBELLE + '"] - Click', async () =>  {
                await fonction.clickElement(page.locator('span:text("' + oDatas.LIBELLE + '")'));
            })             

            var sNomPopin = "Modification d'une ventilation article";
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () =>  {

                test('Button [MODIFIER UNE VENTILATION] - Click', async () =>  {
                    await fonction.clickAndWait(pageVenArt.buttonModifierUneVentilation, page);        
                    await fonction.popinVisible(page, sNomPopin);    
                })

                test('Error Message - Is Hidden', async () =>  {
                    await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
                })

                test('InputField [DESIGNATION] = "' + oDatas.LIBELLE + '-Updated"', async ({}, testInfo) =>  {
                    log.set('Désignation Initiale : ' + oDatas.LIBELLE);
                    log.set('Nouvelle Désignation : ' + oDatas.LIBELLE + '-Updated');
                    await fonction.sendKeys(pageVenArt.pPinputDesignation, oDatas.LIBELLE + '-Updated', false, 'Désignation Modifiée');

                    //-- Ecriture du libellé dans un fichier de JDD au format JSON pour récupératiuon des tests suivants
                    const sJsonData = { LIBELLE: oDatas.LIBELLE + '-Updated' };
                    writeFile(testInfo.config.rootDir + sJddFile, JSON.stringify(sJsonData, null, 2), (error) => {
                        if (error) {
                          console.log('An error has occurred ', error);
                          return;
                        }
                        log.set('Enregistrement de la donnée dans le fichier : ' + sJddFile);
                        fonction.addDataSheet('File', 'Write', sJddFile);
                    });
                })

                test('InputField [COEFFICIENT DE SECURITE] = "x"', async ({}, testInfo) =>  {
                    log.set('Coef : ' + rCoef.toString());
                    await fonction.sendKeys(pageVenArt.pPinputCoefficient, rCoef.toString(), false, 'Coef de sécurité');

                    //-- Ecriture du libellé dans un fichier de JDD au format JSON pour récupératiuon des tests suivants
                    const sJsonData = { LIBELLE: oDatas.LIBELLE + '-Updated', COEF: rCoef.toString() };
                    writeFile(testInfo.config.rootDir + sJddFile, JSON.stringify(sJsonData, null, 2), (error) => {
                        if (error) {
                          console.log('An error has occurred ', error);
                          return;
                        }
                        log.set('Enregistrement de la donnée dans le fichier : ' + sJddFile);
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