/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 06 - 12 - 2023
 */

const xRefTest      = "MAG_AUP_ASF";
const xDescription  = "Création d'un assortiment Achat Centrale";
const xIdTest       =  107;
const xVersion      = '3.12';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['groupeArticle', 'typeAssortiment', 'nomAssortiment', 'E2E'],
    fileName    : __filename
}

//----------------------------------------------------------------------------------------

import { test, type Page}             from '@playwright/test';

import { TestFunctions }              from "@helpers/functions";
import { Log }                        from "@helpers/log";
import { Help }                       from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }                from '@pom/MAG/menu.page';
import { AutorisationsParametrage }   from '@pom/MAG/autorisations-parametrage.page';
import { AutorisationsAchatsCentrale }from '@pom/MAG/autorisations-achats_centrale.page';

import { CartoucheInfo }              from '@commun/types';

//-------------------------------------------------------------------------------------

let page          : Page;

let menu          : MenuMagasin;
let pageAutParam  : AutorisationsParametrage;
let pageAutoAC    : AutorisationsAchatsCentrale;

const log         = new Log();
const fonction    = new TestFunctions(log);

//----------------------------------------------------------------------------------------

fonction.importJdd();

var maDate              = new Date();
const dateJour          = fonction.getToday('us');

const groupeArticle     = fonction.getInitParam('groupeArticle', 'Fruits et légumes');
const typeAssortiment   = fonction.getInitParam('typeAssortiment', 'Achats centrale');
const designationGroupe = fonction.getInitParam('nomAssortiment', 'TA_' + typeAssortiment + " " + groupeArticle + ' ' + dateJour + ':' + maDate.getDate().toString() + maDate.getHours());
// nomAssortiment
//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageAutParam    = new AutorisationsParametrage(page);
    pageAutoAC      = new AutorisationsAchatsCentrale(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
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
        
        var bAssortimentExiste:boolean = true;
        var pageName: string = 'autorisations';

        test ('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(pageName,page);
        })
        
        test.describe ('*** VERIFICATION DE L\'EXISTENCE DE L\'ASSORTIMENT ', async () => {

            test ('InpuField [ASSORTIMENT] = "' + designationGroupe + '"', async () =>{
                await fonction.sendKeys(pageAutoAC.inputAssortiment, designationGroupe, false, 'Nom Assortiment');
                await fonction.wait(page, 800);
            })

            test ('Tr [ASSORTIMENT] = "' + designationGroupe + '" - Check', async () => {
                const iNbr = await pageAutoAC.trAssortimentParRech.count();
                if (iNbr > 0) {
                    log.set('L\'assortiment "' + designationGroupe + '" existe déjà');
                    bAssortimentExiste = false;
                }
            })
        })

        test ('Onglet [PARAMETRAGE] - Click', async () => {
            if(bAssortimentExiste){
                await menu.clickOnglet(pageName, 'parametrage', page);
            }
        })

        test.describe ('Onglet [PARAMETRAGE]', async () => {

            test ('Button [CREER ASSORTIMENT] - Click', async () => { 
                if(bAssortimentExiste){ 
                    await fonction.clickElement(pageAutParam.buttonCreerAssort);
                }
            })

            test ('** Wait Until Spinner Off **', async () => {
                await fonction.waitForSpinner(pageAutParam.spinner);
            })

            test ('CheckBox [TYPE] = "' + typeAssortiment + '"', async () => {   
                if(bAssortimentExiste){
                    var iNbChoix = await pageAutParam.checkBoxTypeLabel.count();
                    for(let elmt = 0; elmt < iNbChoix; elmt++){

                        var sText = await pageAutParam.checkBoxTypeLabel.nth(elmt).textContent();
                        if(sText?.trim() == typeAssortiment){
                            await pageAutParam.checkBoxTypeLabel.nth(elmt).check();
                            await fonction.addDataSheet('CheckBox', 'Type Assortiment', typeAssortiment);
                            break;
                        }
                    }  
                } 
            })

            test ('ListBox [GROUPE ARTICLE] = "' + groupeArticle + '"', async () => {  
                if(bAssortimentExiste){ 
                    await fonction.listBoxByLabel(pageAutParam.listBoxOrigine, groupeArticle, page, 'Groupe Article');  
                }                      
            })  

            test ('InputField [DESIGNATION] = "' + designationGroupe + '"', async () => {  
                if(bAssortimentExiste){   
                    await fonction.sendKeys(pageAutParam.inputDesignation, designationGroupe, false, 'Designation groupe');
                }                                                           
            })

            test ('Button [ENREGISTRER] - Click', async () => {   
                if(bAssortimentExiste){
                    await fonction.clickAndWait(pageAutParam.buttonEnregistrer, page);
                }
            })      

            test ('Label [ERREUR] - Is NOT Visible', async () => {
                if(bAssortimentExiste){
                    await fonction.isErrorDisplayed(false, page);
                }
            }) 

        })

    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})