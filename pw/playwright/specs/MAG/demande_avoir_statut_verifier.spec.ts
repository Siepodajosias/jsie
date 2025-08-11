/**
 * @author Yannick Boly
 * Since 21 - 06 - 2025
 * 
 */
const xRefTest      = 'MAG_DAV_STT';
const xIdTest       = 9934;
const xDescription  = 'Vérifier le statut de la demande d\'avoir après action côté Préfactu et action du CS';
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc           : xDescription,
    appli          : 'MAGASIN',
    version        : xVersion,
    refTest        : [xRefTest],
    idTest         : xIdTest,
    help           : [],
    params         : ['ville','groupeArticle'],
    fileName       : __filename
}

//---------------------------------------------------------------------------------------------------------------------------
import {  test, expect, Page }   from '@playwright/test';
import { CartoucheInfo }         from "@commun/types";
import { TestFunctions }         from "@helpers/functions";
import { Help }                  from "@helpers/helpers";
import { Log }                   from "@helpers/log";

//--PageObject---------------------------------------------------------------------------------------------------------------

import { MenuMagasin }           from "@pom/MAG/menu.page";
import { TableauDeBord }         from '@pom/MAG/tableau-de-bord.page';
import { FaturationDemandeAvoir }from '@pom/MAG/facturation-demande_avoir.page';

//---------------------------------------------------------------------------------------------------------------------------
let page             : Page;
let menu             : MenuMagasin;
let pageTableauBord  : TableauDeBord;
let pageFacturation  : FaturationDemandeAvoir;

const log            = new Log();
const fonction       = new TestFunctions(log);

//------------------------------------------------------------------------------------

var oData:any        = fonction.importJdd();

const sMagasin       = fonction.getInitParam('ville', 'Chaponnay'); //Bergerac (G550)
const sGroupeArticle = fonction.getInitParam('groupeArticle','Coupe / Corner');

//------------------------------------------------------------------------------------
process.env.ROLE     = 'CHEF SECTEUR'; // Connexion par défaut avec le profil ayant le Role CHEF SECTEUR
const sRoleUser      = 'RESPONSABLE RAYON';
const today          = fonction.getToday('FR',0, '/');
//---------------------------------------------------------------------------------------------------------------------------

if (oData !== undefined) {             // On est dans le cadre d'un E2E. Récupération des données temporaires
	var iDateLivraison= oData.iDateLivraison;                               
	var sCodeArticle  = oData.sCodeArticle 	        

	log.set('E2E - Date de livraison : ' + iDateLivraison);
	log.set('E2E - Code article : ' + sCodeArticle); 
} 

//------------------------------------------------------------------------------------

test.beforeAll(async({ browser }, testInfo)=>{
    page                 = await browser.newPage();
    menu                 = new MenuMagasin(page,fonction);
    pageTableauBord      = new TableauDeBord(page);
    pageFacturation      = new FaturationDemandeAvoir(page);
    const helper         = new Help(info, testInfo,page);
    await helper.init();
})

test.afterAll(async({}, testInfo) => {
    await fonction.close(testInfo);
})

//---------------------------------------------------------------------------------------------------------------------------

test.describe.serial ('['+ xDescription +']', ()=> {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({context})=> {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('connexion', async ()=> {
        await fonction.connexion(page);
    })

    test.describe('Page [ACCUEIL]', async () => {
        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if (isVisible) {
                await menu.removeArlerteMessage(page);
            } else {
                log.set('Link [BROWSER SECURITY WARNING] - Click: ACTION ANNULEE');
                test.skip();
            }
        })
    })

    test.describe ('Page [TABLEAU DE BORD]', async () => {

        var pageName:string = 'tableauBord'; 

        test('ListBox [VILLE] = "' + sMagasin + '"', async () => {  // On sélectionne le magasin cible.
            await menu.selectVille(sMagasin, page);
            log.set('Magasin : ' + sMagasin);
        })

        test('Menu [TABLEAU DE BORD] - Click', async () => {
            await menu.click(pageName, page);
        })

        test('** Wait Until Spinner Off **', async () => {
            await fonction.waitForSpinner(pageTableauBord.spinner, 180000);
        })

        test('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);
        }) 

        test.describe ('Datagrid [DEMANDE D\'AVOIR]', async () => {

            test('Tr [DEMANDE AVOIR] >=1 ', async ()=> {
                expect(await pageTableauBord.dataGridRowDemandesAvoir.count()).toBeGreaterThanOrEqual(1);
            })

            test('Multiselect [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
                await fonction.clickAndWait(pageTableauBord.multiselectGroupeArticle, page);
                await fonction.sendKeys(pageTableauBord.inputGroupeArticle, sGroupeArticle, false, 'Groupe article');
            })

            test('Li [GROUPE ARTICLE] - Click', async () => {
                await fonction.clickAndWait(pageTableauBord.liGroupeArticle, page);
            })
            //-----------------------------------------------------------------------------------------------------------

            test('Div [DATE DEMANDE] - Click', async () => {
                await fonction.clickAndWait(pageTableauBord.pDivDateDemande, page);
                await fonction.sendKeys(pageTableauBord.pInputBL, today.slice(0,4), false, 'Date de demande');
            })

            test('Li [DATE DEMANDE] - Click', async () => {
                await fonction.clickElement(pageTableauBord.pLiBL.first());
            })

            //-----------------------------------------------------------------------------------------------------------
            test('Div [DATE BL] = "' + iDateLivraison + '"', async () => {
                await fonction.clickAndWait(pageTableauBord.pDivDateBL, page);           
                await fonction.sendKeys(pageTableauBord.pInputBL, iDateLivraison.replace(/\s/g,""), false, 'Date de livraison');
            })

            test('Li [DATE BL] - Click', async () => {
                await fonction.clickElement(pageTableauBord.pLiBL.first());
            }) 

            //-----------------------------------------------------------------------------------------------------------
            test('Input [CODE ARTICLE] = "' + sCodeArticle + '"', async () => {
                await fonction.sendKeys(pageTableauBord.inputCodeArticle.nth(2), sCodeArticle, false, 'Code article');
                await fonction.waitForDomStable(page);
            })

            test('I [STATUT] = Acceptée', async () => {
                await expect(pageTableauBord.pIStatutAccepter.first()).toHaveAttribute('title',"Acceptée");
            })
        })
    })

    //Changement d'utilisateur (connexion avec le role : RESPONSABLE RAYON)
    test ('Changement Profil [' + sRoleUser + ']', async ()=> {
        await fonction.changeProfilByRole(info.appli, sRoleUser, page); 
    })

    test.describe ('Page [FACTURATION]', async ()=> {

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

        var pageName:string = 'facturation';
          
        test('Menu [FACTURATION] - Click', async ()=> {
            await menu.click(pageName, page);
        })

        test('ListBox [VILLE] = "' + sMagasin + '"', async () => {  // On sélectionne le magasin cible.
            await menu.selectVille(sMagasin, page);
            log.set('Magasin : ' + sMagasin);
        })

        test('Onglet [DEMANDE D\'AVOIR] - Click', async ()=> {
            await menu.clickOnglet(pageName,'demandeAvoir',page);
        })

        test('** Wait Until Spinner Off **', async () => {
            await fonction.waitForSpinner(pageFacturation.spinnerLoading, 180000);
        })

        test('Tr [DEMANDE D\'AVOIR] >=1 ', async ()=> {
            expect(await pageFacturation.dataGridListeArticles.count()).toBeGreaterThanOrEqual(1);
        })

        test.describe ('DataGrid [LISTE DEMANDE D\'AVOIR]', async () => { 
            //-----------------------------------------------------------------------------------------------------------

            test('Div [DATE DEMANDE] - Click', async () => {
                await fonction.clickAndWait(pageTableauBord.pDivDateDemande, page);
                await fonction.sendKeys(pageTableauBord.pInputBL, today.slice(0,4), false, 'Date de demande');
            })

            test('Li [DATE DEMANDE] - Click', async () => {
                await fonction.clickElement(pageTableauBord.pLiBL.first());
            })

            test('Input [CODE ARTICLE] = "' + sCodeArticle + '"', async () => {
                await fonction.sendKeys(pageFacturation.pInputCodeArticle, sCodeArticle, false ,'Code article');
                await fonction.waitForDomStable(page);
            }) 

            test('Tr [DEMANDE D\'AVOIR] >= 1', async () => {
                expect(await pageFacturation.pPTrListeDamandeAvoir.count()).toBeGreaterThanOrEqual(1);
            })     

            test('Img [STATUT] = Acceptée', async () => {
                expect(pageFacturation.pPTrListeDamandeAvoir.first().locator('td.center img.custom-icon-dav')).toHaveAttribute('title','Acceptée');
            })
        })
    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})
