/**
 * 
 * @author JC CALVIERA
 *  Since 2024-04-04
 */

const xRefTest      = "MAG_VTE_EE1";
const xDescription  = "Création d'un événement exceptionnel";
const xIdTest       =  2818;
const xVersion      = '3.2';

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

        var sNomPage = 'ventes';

        test ('Page [VENTES] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 

        test ('ListBox [LIEU DE VENTE] = "' + sNomVille + '"', async () => {
            await menu.selectVille(sNomVille, page);
        })

        var sNomOnglet = "EVENEMENTS EXCEPTIONNELS";

        test.describe ('Onglet [' + sNomOnglet + ']', async() => {

            test ('Onglet [EVENEMENTS EXCEPTIONNELS] - Click', async() => {
                await menu.clickOnglet(sNomPage, 'evenementsExceptionnels', page);
            })

            test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de l'onglet
                await fonction.isErrorDisplayed(false, page);
            }) 
            
            test ('Button [AJOUTER] - Click', async () => {
                await fonction.clickElement(pageVentes.buttonAjouter);
            })

            var sNomPopin = "Créer un vévénement exceptionnel";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {


                test ('Radio Button [LE GROUPE ARTICLE] - Select', async() => {
                    await fonction.clickElement(pageVentes.pPCreaEvRadioGroupeArticle);
                })

                test ('ListBox [GROUPE ARTICLE] = "'+sGroupeArticle+'"', async() => {
                    await pageVentes.pPCreaEvListBoxGroupeArti.selectOption(sGroupeArticle);
                    await fonction.addDataSheet('ListBox', 'Groupe Article', sGroupeArticle);
                })

                test ('Date Picker [DATE OU PERIODE] - Click', async() =>{                    
                    await fonction.clickElement(pageVentes.pPCreaEvDatePickerPeriode);
                })

                test ('Calendar [JOURS DU MOIS][first] - Click', async () => {
                    await fonction.clickElement(pageVentes.pPCreaEvTdJoursActifs.first());
                })

                test ('Calendar [JOURS DU MOIS][last] - Click', async () => {
                    await fonction.clickElement(pageVentes.pPCreaEvTdJoursActifs.last());
                })

                test ('ListBox [TYPE][rnd] - Click', async () => {
                    await fonction.selectRandomListBoxOption(pageVentes.pPCreaEvListBoxType, false, 'Raison Vente');
                })

                test ('InputField [COMMENTAIRE] = "' + sCommentaire + '"', async () => {
                    await fonction.sendKeys(pageVentes.pPCreaEvTextAreaCommentaire, sCommentaire, false, 'Commentaire');
                })

                test ('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pageVentes.pPCreaEvButtonEnregistrer, page);
                })

            }); //-- Popin

        }); //-- Onglet  

    }); //-- Page

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

    test('** CHECK FLUX **', async () => {
        await fonction.wait(page, 1000);
 
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