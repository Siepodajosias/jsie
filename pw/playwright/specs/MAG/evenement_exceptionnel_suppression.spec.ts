/**
 * 
 * @author JC CALVIERA
 *  Since 2024-04-05
 */

const xRefTest      = "MAG_VTE_EED";
const xDescription  = "Suppression d'un événement exceptionnel";
const xIdTest       =  5941;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['ville','groupeArticle'],
    fileName    : __filename
};

//-------------------------------------------------------------------------------------

import { test, type Page }              from '@playwright/test';

import { TestFunctions }                from "@helpers/functions";
import { Log }                          from "@helpers/log";
import { Help }                         from '@helpers/helpers';
import { EsbFunctions }                 from '@helpers/esb';

import { MenuMagasin }                  from '@pom/MAG/menu.page';
import { VentesEvenementsExceptionneles }from '@pom/MAG/ventes-evenements_exceptionneles.page';

import { CartoucheInfo, TypeEsb }       from '@commun/types';

//-------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pageVentes          : VentesEvenementsExceptionneles;
let esb                 : EsbFunctions;

const log               = new Log();
const fonction          = new TestFunctions(log);

//-----------------------------------------------------------------------------------------

const sNomVille         = fonction.getInitParam('ville', 'Tours (G182)');
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Frais LS'); 
const sCommentaire      = 'TA_Evénnement Exceptionnel - ' + sGroupeArticle + ' - ' + fonction.getToday('US') + ' /!\\ #1 \';';

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageVentes      = new VentesEvenementsExceptionneles(page);
    esb             = new EsbFunctions(fonction);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [VENTES]', async () => {

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

        var sNomPage:string = 'ventes';

        test ('Page [VENTES] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 

        test ('ListBox [LIEU DE VENTE] = "' + sNomVille + '"', async () => {
            await menu.selectVille(sNomVille, page);
        })
        
        var sNomOnglet:string = "EVENEMENTS EXCEPTIONNELS";

        test.describe ('Onglet [' + sNomOnglet + ']', async() => {

            test ('Onglet [EVENEMENTS EXCEPTIONNELS] - Click', async() => {
                await menu.clickOnglet(sNomPage, 'evenementsExceptionnels', page);
            })

            test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de l'onglet
                await fonction.isErrorDisplayed(false, page);
            }) 
            
            test ('Input Filtre [COMMENTAIRE] = "' + sCommentaire + '"', async() => {
                await fonction.sendKeys(pageVentes.inputFiltreCommentaire, sCommentaire, false, 'Commentaire');
            })
            
            test ('check Box [SELECT ALL] - Click', async() => {
                await fonction.clickElement(pageVentes.checkBoxAll);
            })

            test ('Button [SUPPRIMER] - Click', async () => {
                await fonction.clickElement(pageVentes.buttonSupprimer);
            })

            var sNomPopin:string = "Confirmation de suppression";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible - Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test ('Button [SUPPRIMER] - Click', async () => {
                    await fonction.clickAndWait(pageVentes.pPConfSupButtonSupprimer, page);
                })
                
                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden - Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })

                test ('** Wait Until Spinner Off **', async () => {
                    await fonction.waitForSpinner(pageVentes.pPspinner);
                });

            }); //-- Popin

        }); //-- Onglet  

    }); //-- Page

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

    test('** CHECK FLUX **', async () => {
        fonction.wait(page, 1000);
 
             var oFlux:TypeEsb = { 
                "FLUX" : [
                    {
                         NOM_FLUX   : "EnvoyerEvenementExceptionnel_Budget",
                         TITRE      : /Evenement du magasin*/
                    },                      
                 ],
                WAIT_BEFORE  : 2000,               
                VERBOSE_MOD  : false
             };
 
            await esb.checkFlux(oFlux, page);
 
     })

})