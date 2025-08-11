/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 06 - 12 - 2023
 */

const xRefTest      = "MAG_OPP_NEW";
const xDescription  = "Création d'un assortiment de type Opportunité";
const xIdTest       =  2664;
const xVersion      = '3.3';

var info = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['groupeArticle','typeOpportunite'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}          from '@playwright/test';

import { TestFunctions }           from "../../utils/functions";
import { Log }                     from "../../utils/log";
import { Help }                    from '../../utils/helpers';

//-- PageObject --------------------------------------------------------------------------

import { MenuMagasin }             from '../../pages/MAG/menu.page';
import { AutorisationsParametrage }from '../../pages/MAG/autorisations-parametrage.page';

//----------------------------------------------------------------------------------------

let page          : Page;

let menu          : MenuMagasin;
let pageAutParam  : AutorisationsParametrage;

const log         = new Log();
const fonction    = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const groupeArticle      = fonction.getInitParam('groupeArticle','Fruits et légumes');
const typeOpportunite    = fonction.getInitParam('typeOpportunite','Opportunité magasin');

const typeAssortiment    = 'Opportunité';
const dateJour           = fonction.getToday('fr',0,'-');
const sDesignationGroupe = 'TEST-AUTO_Opportunité ' + groupeArticle + ' ' + dateJour;

const sHeureDebut        = '23';
const sMinuteDebut       = '59';

//-----------------------------------------------------------------------------------------

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

test.describe.serial('[' + xRefTest + ']', () => {

    test ('Ouverture URL'+ fonction.getApplicationUrl(), async ({ context }) => {
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

    test.describe('Page [AUTORISATIONS]', () => {
        
        var pageName = 'autorisations';

        test('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(pageName,page);
        })

        test.describe ('Onglet [PARAMETRAGE]', () => {

            test('Onglet [PARAMETRAGE] - Click', async () => {
                log.set('-------------------------  CREATION DE L\'ASSORTIMENT  -------------------------');
                await menu.clickOnglet(pageName, 'parametrage', page);
            })

            test('Button [CREER ASSORTIMENT] - Click', async () => {  
                await fonction.clickAndWait(pageAutParam.buttonCreerAssort, page);
            })

            test('CheckBox [TYPE] = "' + typeAssortiment + '"', async () => { 
                var iNbChoix = await pageAutParam.checkBoxTypeLabel.count();
                for(let elmt = 0; elmt < iNbChoix; elmt++){

                    var sText = await pageAutParam.checkBoxTypeLabel.nth(elmt).textContent();
                    if(sText.trim() === typeAssortiment){

                        await pageAutParam.checkBoxTypeLabel.locator('input').nth(elmt).check();
                        break;
                    }
                }  
            })                   

            test('ListBox [GROUPE ARTICLE] = "' + groupeArticle + '"', async () => {   
                await fonction.listBoxByLabel(pageAutParam.listBoxOrigine, groupeArticle, page);                      
            })  

            test('InputField [DESIGNATION] = "' + sDesignationGroupe + '"', async () => {     
                await fonction.sendKeys(pageAutParam.inputDesignation, sDesignationGroupe, false, 'Designation groupe article');                                                             
            })        
            
            test('DatePicker [FIN DE SAISIE] = "' + dateJour + '"', async () => {
                await fonction.clickElement(pageAutParam.datePickerFinSaisieIcon.nth(0));
                await fonction.clickElement(pageAutParam.datePickerTodayOpport);
            })

            test('InputField [HEURE DEBUT] = "' + sHeureDebut + '"', async () => {
                await fonction.sendKeys(pageAutParam.inputHeureDebutOpport, sHeureDebut, false, 'Heure de debut');
            })

            test('InputField [MINUTE DEBUT] = "'+sMinuteDebut+'"', async () => {
                await fonction.sendKeys(pageAutParam.inputMinuteDebutOpport, sMinuteDebut, false, 'Minute debut');   
            })

            test('DatePicker [EXPEDITION] = "Last Day of the month"', async () => {
                await fonction.clickElement(pageAutParam.datePickerExpeditionIcon.nth(1));
                await fonction.clickElement(pageAutParam.datePickerActiveDay.last());
            })

            test('Select [TYPE D\'OPPORTUNITE] = "'+typeOpportunite+'"', async () => {
                await pageAutParam.selectTypeOpportunite.selectOption({label: typeOpportunite});
            })

            test ('Button [ENREGISTRER] - Click', async () => {   
                await fonction.clickAndWait(pageAutParam.buttonEnregistrer, page);
                log.set('Opération a été effectuée avec succès : l\'assortiment est maintenant créé');
            })        

            test('Label [ERREUR] - Is NOT Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 
        })
    })
    
    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})