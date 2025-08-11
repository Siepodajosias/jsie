/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 03 - 05 - 2024
 */

const xRefTest      = "MAG_OPP_DEL";
const xDescription  = "Suppression d'une Opportunité";
const xIdTest       =  2706;
const xVersion      = '3.1';

var info = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
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
import { AutorisationsParametrage }      from '@pom/MAG/autorisations-parametrage.page';

//-------------------------------------------------------------------------------------

let page          : Page;

let menu          : MenuMagasin;
let pageAutParam  : AutorisationsParametrage;

const log         = new Log();
const fonction    = new TestFunctions(log);

//----------------------------------------------------------------------------------------
var localData           = fonction.getLocalConfig();
var designationGroupe   = localData.designationGroupe;


//------------------------------------------------------------------------------------   
test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageAutParam    = new AutorisationsParametrage(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACCUEIL]', async () => {

        test('Link [BROWSER SECURITY WARNING] - Click', async () => {
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

    test.describe('Page [AUTORISATIONS]', async () => {
        
        var pageName = 'autorisations';

        test('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(pageName,page);
        })

        test.describe('Onglet [PARAMETRAGE]', async () => {

            test('Onglet [PARAMETRAGE] - Click', async () =>  {                            
                await menu.clickOnglet(pageName, 'parametrage', page);
            })
    
            test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de l'onglet
                await fonction.isErrorDisplayed(false, page);
            })

            test('ListBox [TYPE ASSORTIMENT] ="Opportunité"', async () => {
                await pageAutParam.checkBoxListeAssortiments.last().waitFor({state:'visible'});
                await fonction.listBoxByLabel(pageAutParam.listBoxTypeAssortiment, 'Opportunité', page);
            })

            test('InputField [ASSORTIMENT] = "' + designationGroupe + '"', async () => {
                await fonction.sendKeys(pageAutParam.inputFieldFilter, designationGroupe);
                await fonction.wait(page, 500);
            })
    
            test('CheckBox [ASSORTIMENT][First] - Click', async () =>  {                  
                await fonction.clickAndWait(pageAutParam.checkBoxListeAssortiments.first(), page);                                 
            })
    
            var sNomPopin = "Confirmer la suppression";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + '] >', async() => {
    
                test('Bouton [SUPPRIMER ASSORTIMENT] - Click', async () =>  {         
                    await fonction.clickAndWait(pageAutParam.buttonSupprimerAssort, page);                                                
                })
    
                test('Popin [CONFIRMER LA SUPRESSION] - Is Visible', async () => {
                    await fonction.popinVisible(page, 'CONFIRMER LA SUPRESSION', true);
                })
    
                test('Bouton [OUI] - Click', async() => {   
                    await fonction.clickAndWait(pageAutParam.popinConfirmerSuppression, page);     
                });

                test ('** Wait Until Spinner Off **', async () => {
                    await fonction.waitForSpinner(pageAutParam.pIconspinner);
                })
                
                test('Popin [CONFIRMER LA SUPRESSION] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, 'CONFIRMER LA SUPRESSION', false);
                })       
            }) // end popin 
        }) //end Onglet     
    }) // end Page

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})