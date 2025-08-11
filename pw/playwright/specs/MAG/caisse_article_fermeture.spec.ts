/**
 * 
 * @author JC CALVIERA
 *  Since 2024-04-02
 */

const xRefTest      = "MAG_PRI_FAC";
const xDescription  = "Fermer un Article en Caisse";
const xIdTest       =  303;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['ville','groupeArticle', 'codeArticle'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}   from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';
import { EsbFunctions }             from "@helpers/esb";

import { MenuMagasin }              from '@pom/MAG/menu.page';
import { PrixGestion }              from '@pom/MAG/prix-gestion.page';

import { CartoucheInfo, TypeEsb }   from '@commun/types';

//-------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pagePrix            : PrixGestion;
let esb                 : EsbFunctions;

const log               = new Log();
const fonction          = new TestFunctions(log);

//-----------------------------------------------------------------------------------------

const villeCible        = fonction.getInitParam('ville', 'Tours (G182)');
const idArticle         = fonction.getInitParam('codeArticle', '8217');
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Fruits et légumes'); 

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    esb             = new EsbFunctions(fonction);
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pagePrix        = new PrixGestion(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    var bAlreadyClosed:Boolean = false;

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [PRIX]', async () => {

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

        var sNomPage = 'prix';

        test ('Page [PRIX] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 

        test ('ListBox [VILLE] = "' + villeCible + '"', async () => {
            await menu.selectVille(villeCible, page);
        })
        
        test ('ListBox [GROUPE]["' + sGroupeArticle + '"]- Select', async() => {
            await pagePrix.listBoxGrpArticle.selectOption(sGroupeArticle);
        })

        test ('InputField [ARTICLE] #1 = "' + idArticle + '"', async() => {
            await fonction.sendKeys(pagePrix.inputArticle, idArticle);
            await fonction.wait(page, 500);     //-- Temporisation le temps que la liste se raffraîchisse
        })

        test ('CheckBox [ARTICLE][0] - Is Visible', async () => {
            if (await pagePrix.checkBoxDataGrid.count() > 0) {
                await fonction.clickElement(pagePrix.checkBoxDataGrid);
            } else {
                log.set('Article : ' + idArticle + ' déjà fermé');
                bAlreadyClosed = true;
                test.skip();
            }
        })

        test ('Button [FERMER EN CAISSE] - Click', async () => {
            if (bAlreadyClosed) {
                test.skip();
            } else { 
                await fonction.clickElement(pagePrix.buttonFermerCaisse);
            }
        })

        var sNomPopin   = 'CONFIRMER LE FERMETURE D\'UN ARTICLE EN CAISSE';        
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>{

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible - Check', async () => {
                if (bAlreadyClosed) {
                    test.skip();
                } else { 
                    await fonction.popinVisible(page, sNomPopin, true);
                }
            })

            test ('Button [OUI] - Click', async () => {
                if (bAlreadyClosed) {
                    test.skip();
                } else { 
                    await fonction.clickAndWait(pagePrix.pPbuttonFermerOui, page);
                }
            })

        })

        test ('InputField [ARTICLE] #2 = "' + idArticle + '"', async() => {
            if (bAlreadyClosed) {
                test.skip();
            } else { 
                await fonction.sendKeys(pagePrix.inputArticle, idArticle);
                await fonction.wait(page, 500);     //-- Temporisation le temps que la liste se raffraîchisse
            }
        })

        test ('CheckBox [ARTICLE][0] - Is NOT Visible', async () => {
            if (bAlreadyClosed) {
                test.skip();
            } else { 
                expect(await pagePrix.checkBoxDataGrid.count()).toEqual(0);
            }
        })

    })

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

    test ('** CHECK FLUX **', async () =>  {
        if (bAlreadyClosed) {
            test.skip();
        } else { 
            const oFlux:TypeEsb = { 
                FLUX : [
                    {
                        NOM_FLUX    : "FermerArticle_Caisse"
                    }, 
                    {
                        NOM_FLUX    : "Diffuser_FermetureArticleCaiss"
                    }
                ],
                WAIT_BEFORE     : 3000,                // Optionnel
            };
            await esb.checkFlux(oFlux, page);
        }
    })

})