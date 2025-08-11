/**
* 
* @author AbdouL SARBA
*  Since 30 - 04 - 2025
*/
 
const xRefTest      = "MAG_ENG_VAL";
const xDescription  = "Valider un engagement";
const xIdTest       =  1045;
const xVersion      = '3.5';
 
var info:CartoucheInfo = {
    desc            : xDescription,
    appli           : 'MAGASIN',
    version         : xVersion,        
    refTest         : [xRefTest],
    idTest          : xIdTest,
    help            : [],
    params          : ['groupeArticle','nom','ville'],
    fileName        : __filename
}
 
//----------------------------------------------------------------------------------------
 
import { expect, test, type Page}from '@playwright/test';
 
import { TestFunctions }         from "@helpers/functions";
import { Log }                   from "@helpers/log";
import { Help }                  from '@helpers/helpers';
 
//-- PageObject ----------------------------------------------------------------------
 
import { MenuMagasin }           from '@pom/MAG/menu.page';
import { CommandesEngagements }  from '@pom/MAG/commandes-engagements.page';
 
import { CartoucheInfo }         from '@commun/types';
 
//-------------------------------------------------------------------------------------
let page                         : Page;
 
let menu                         : MenuMagasin;
let pageCmdEng                   : CommandesEngagements;
 
const log                        = new Log();
const fonction                   = new TestFunctions(log);
// ---------------------------------------------------------------------------------------
var oData:any=fonction.importJdd();        // Récupération du JDD et des données du E2E en cours si ils existent
//----------------------------------------------------------------------------------------

var sGroupeArticle               = fonction.getInitParam('groupeArticle',fonction.getLocalConfig('groupeArticleEngagement'));
var sNomEngagement               = fonction.getInitParam('nom', fonction.getLocalConfig('assortimentEngagement') + fonction.getToday('FR'));
const sDesignationAssortiment    = sNomEngagement + ' (' + sGroupeArticle +')';
const aListeMagasins             = fonction.getInitParam('ville', fonction.getLocalConfig('listeVilles'));
 
const sStatutValide     :string  = 'Validé CS';
const sStatutEnvoye     :string  = 'Envoyé CS';
const sValeurListBoxTOus:string  = 'Tous';
// -------------------------------------------------------------------------------------------
process.env.ROLE                 = 'CHEF SECTEUR';// Connexion par défaut avec le profil ayant le Role CHEF SECTEUR
//-------------------------------------------------------------------------------------------

 oData = {
   aArticle : oData.article,
   quantites: []
}
/**
 * Récupère les valeurs Quantité initiale de la datagrid des engagements
 * et les stocke dans l'objet oData quantites
 *
 */
var recupValeurData = async () => {
  const aQuantiteInitiale:string[] = await pageCmdEng.dataGridTdquantiteInit.allTextContents(); 
    oData.quantites.push({
      quantiteInitiale: aQuantiteInitiale,
    });
  log.set(`Quantité initiale : ${aQuantiteInitiale}` );
}

// -------------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageCmdEng      = new CommandesEngagements(page);
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
        test('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            if(await menu.pPopinAlerteSanitaire.isVisible()){
                await menu.removeArlerteMessage(page);
            }else{
                log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                test.skip();
            }
        })
    })
 
    test.describe ('Page [COMMANDES]', async () => {
        var sPageName:string = 'commandes';
 
        test('Page [COMMANDES] - Click', async () => {
            await menu.click(sPageName, page);
        })
 
        test('Label [ERREUR #0] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })                            
 
        test.describe ('Onglet [ENGAGEMENTS]', async () => {     
 
            test('Onglet [ENGAGEMENTS] - Click', async () => {   
                await menu.clickOnglet(sPageName, 'engagements', page);
            })
 
            test('Label [ERREUR #1] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
                await fonction.isErrorDisplayed(false, page);
            })        
            test('ListBox [FILTRE ENGAGEMENT] - Select', async () => {
                await fonction.selectOption(pageCmdEng.listBoxEngagement, sValeurListBoxTOus)
            })                         
 
            aListeMagasins.forEach(async (sMagasin:string) => {
            test('ListBox [MAGASIN] = "' + sMagasin + '"', async () => {
                await menu.selectVille(sMagasin, page);
            })

            test.describe('Datagrid [ENGAGEMENT MAGASIN] = "' + sMagasin + '"', async () => {

                test('Input [ENGAGEMENT] = "' + sNomEngagement + '"', async () => {
                    await fonction.sendKeys(pageCmdEng.inputFiltreEngagement, sNomEngagement, false, 'Engagement');
                    await fonction.waitForDomStable(page);
                })
                test('Td [STATUT ENGAGEMENT] = "' + sStatutEnvoye + '"', async () => {
                    expect(await pageCmdEng.tdStatutEngagement.locator('span').last().textContent()).toEqual(sStatutEnvoye);
                })
                test('Tr [ENGAGEMENT STATUT  ENVOYÉ AU CS] - Click', async () => {
                    await fonction.clickAndWait(pageCmdEng.tdLibelleEngagement.locator('span:text-is("' + sDesignationAssortiment + '")'), page);
                })
            })

            test.describe('Datagrid [ARTICLES OUVERTS A LA COMMANDE MAGASIN] = "' + sMagasin + '"', async () => {

                test('Datagrid [ARTICLES COMMANDE] - Is Visible', async () => {
                    await fonction.isDisplayed(pageCmdEng.dataGridEngagements);
                });
                test('Button [VALIDER] - Click', async () => {
                    await fonction.clickAndWait(pageCmdEng.buttonValider, page);
                });
            })

            test('Td [STATUT ENGAGEMENT] [' + sMagasin.toUpperCase() + '] = "' + sStatutValide + '"', async () => {
                await fonction.waitForDomStable(page);
                expect(await pageCmdEng.tdStatutEngagement.locator('span').last().textContent()).toEqual(sStatutValide);
            })
            }) // Fin boucle forEach

            test('** Traitement  **', async () => {
                await recupValeurData();     /***Ici la fonction recupere les valeurs de la datagrid telles que les quantite a expedier, ceci sera  pour la verification dans la suite */
            })
 
            test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
                await fonction.isErrorDisplayed(false, page); 
            })                
            await fonction.writeData(oData);                      // Enregistrement des don nées pour le E2E                      
        })  // Fin Onglet describe
    })     // Fin  Page describe
 
    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})