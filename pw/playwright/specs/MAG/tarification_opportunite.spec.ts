/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 03 - 05 - 2024
 */

const xRefTest      = "MAG_OPP_TAR";  
const xDescription  = "Tarification d'Articles à une Opportunité";
const xIdTest       =  2667;
const xVersion      = "3.0";
   
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['codeArticle'],
    fileName    : __filename
};
 
import { test, type Page}               from '@playwright/test';

import { Help }                         from '@helpers/helpers.js';
import { TestFunctions }                from '@helpers/functions.js';
import { Log }                          from '@helpers/log.js';

import { MenuMagasin }                  from '@pom/MAG/menu.page.js';
import { AutorisationsOppotunites }     from '@pom/MAG/autorisations-opportunites.page';

import { CartoucheInfo }                from '@commun/types';

//------------------------------------------------------------------------------------
 
let page                : Page;
 
var pageAutoOpportunite : AutorisationsOppotunites;
var menu                : MenuMagasin;
 
const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuMagasin(page, fonction);    
    pageAutoOpportunite = new AutorisationsOppotunites(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})
 
//------------------------------------------------------------------------------------

const groupeArticle      = fonction.getInitParam('groupeArticle','Fruits et légumes');

const dateJour           = fonction.getToday('fr',0,'-');
const sDesignationGroupe = 'TEST-AUTO_Opportunité ' + groupeArticle + ' ' + dateJour;

//------------------------------------------------------------------------------------
var traitement = async (iCpt:any) => {

    var sNomVille = await pageAutoOpportunite.tableColumnLibVille.nth(iCpt).textContent();
    sNomVille     = sNomVille.trim();
    await fonction.clickElement(pageAutoOpportunite.tableColumnLibVille.nth(iCpt));     // Click

    var sPrixCession = (iCpt + 1).toString() + '.00'
    await fonction.sendKeys(pageAutoOpportunite.pPtarifInputPrixCession.nth(iCpt), sPrixCession, false, 'Prix Cession');
    await fonction.wait(page, 500);

    var iPVC = Math.floor((iCpt + 1) * 111) / 100;
    await fonction.sendKeys(pageAutoOpportunite.pPtarifInputPVC.nth(iCpt), iPVC, false, 'Tarif PVC');               
    
    await fonction.clickElement(pageAutoOpportunite.pPtarifListeButtonAffGrp.nth(iCpt));
    await fonction.wait(page, 500);

    await fonction.clickElement(pageAutoOpportunite.tableColumnLibVille.nth(iCpt));     // Unclick

    log.set('Ville #' + iCpt + ' : ' + sNomVille + ' - Prix Cession : ' + sPrixCession + ' - PVC : ' + iPVC);
}

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {
 
    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });
 
    test('Connexion', async() => {
        await fonction.connexion(page);
    })
    
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
        test ('Page [AUTORISATION] - Click', async () => {
            await menu.click(pageName, page);
        })

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })
 
        test.describe('Onglet [OPPORTUNITES]', () => {
 
            test ('Onglet [OPPORTUNITES] - Click', async () => {
                await menu.clickOnglet(pageName, 'opportunites', page);
            }) 

            test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de l'onglet
                await fonction.isErrorDisplayed(false, page);
            })

            test ('Input [ASSORTIMENTS] [' + sDesignationGroupe + ']', async () => {
                await fonction.sendKeys(pageAutoOpportunite.inputAssortiment, sDesignationGroupe, false, 'Assortiment');
                await fonction.wait(page, 500);
            })

            
            test('CheckBox [ASSORTIMENT][rnd] - Click', async () =>  {                 
                var iNbAssortiments = await pageAutoOpportunite.trAssortiments.count();
                log.set('Nb Assortiments de type Opportunite dans la liste : ' + iNbAssortiments);
                var rnd = Math.floor(fonction.random() * iNbAssortiments);
                var sLibelleAssort = await pageAutoOpportunite.trAssortiments.nth(rnd).textContent();
                log.set('Assortiment Sélectionné : ' + sLibelleAssort);
                await fonction.clickAndWait(pageAutoOpportunite.trAssortiments.nth(rnd), page);                                    
            })


            test('CheckBox [LIGNE ARTICLE][0] - Click', async () => {                    
                await fonction.clickElement(pageAutoOpportunite.checkBoxListeArticles.first(), page);        	
            })   
            
            test('Button [TARIFER] - Click', async () =>  {         
                await fonction.clickAndWait(pageAutoOpportunite.buttonTarifer, page);     
            }) 

            var sNomPopin = "Tarification de l'article XXXXX dans l'opportunité YYYYY";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + '] >', async () => {

                test('Popin ['+ sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })
           
                test('** Traitement **', async () => {
                    for (var iCpt=0; iCpt < 5; iCpt++) {

                        await traitement(iCpt);
                    }
                })

                test('Bouton [ENREGISTRER popin] - Click', async () =>  {   
                    await fonction.clickAndWait(pageAutoOpportunite.pPtarifButtonEnregistrer, page);     
                })

                test('Popin ['+ sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })        
            }) // end popin
        }) //end onglet
    }) // end page

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})