/**
 * @author Mathis NGUYEN
 * @description "Supprimer des recommandations d'ouverture à un article";
 * @since 2024-07-26
 * 
 */
const xRefTest      = "MAG_GPE_SRO";
const xDescription  = "Supprimer des recommandations d'ouverture à un article";
const xIdTest       =  9484;
const xVersion      = '3.2';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : [],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { expect, test, type Page}   from '@playwright/test';

import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';
import { JddFile }                  from '@helpers/file';

import { MenuMagasin }                  from '@pom/MAG/menu.page';
import { AutorisationsRecomOuverture }  from '@pom/MAG/autorisations-recommandations_ouverture.page';
import { AutorisationsAchatsCentrale }  from '@pom/MAG/autorisations-achats_centrale.page';  

import { CartoucheInfo } from '@commun/types';
//------------------------------------------------------------------------------------

let page                  	: Page;
let menu                  	: MenuMagasin;
let pageRecomOuverture      : AutorisationsRecomOuverture;
let pageAutoAC              : AutorisationsAchatsCentrale;

var jddFile                 : JddFile;


const log                 	= new Log();
const fonction            	= new TestFunctions(log);

const sJddFile              = fonction.getLocalConfig('jddGammeRecom');     //used to retrive the code of an article, if it was chosen randomly in gamme_recommandation_ouverture.spec.ts

//------------------------------------------------------------------------------------
fonction.importJdd()

const sImportDatas    = fonction.getInitParam('E2E', '');      // Used to determine if specific actions have to be done (when E2E is defined)
const sGroupeArticle  = fonction.getInitParam('groupeArticle', 'Marée')     // Delete recommandations on this groupeArticle...
const sArticles       = fonction.getInitParam('listeArticles', '');

const aListeArticles  = sArticles.split(',');
let sArticle          = aListeArticles[0]                                   //... for this article

//--- Variables below will only be used if we pass the E2E parameter !
const sDesignGrpAssort = fonction.getInitParam('nomAssortiment', 'TA_AchCentrale - FL10 - Chaponnay'); // Check this assortiment
//----------

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuMagasin(page, fonction);
    pageRecomOuverture  = new AutorisationsRecomOuverture(page);
    pageAutoAC          = new AutorisationsAchatsCentrale(page);
    jddFile             = new JddFile(testInfo);
	const helper 		= new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------  

test.describe.serial('[' + xRefTest + ']', async () => {
    
    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [AUTORISATIONS]', async () => {

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

        var sPageName = 'autorisations';

        test ('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(sPageName, page);
        })

        test.describe ('Onglet [RECOMMANDATIONS D\'OUVERTURE]', async () => {

            var sNomOnglet = 'recomOuverture';
            test ('Onglet [RECOMMANDATIONS D\'OUVERTURE] - Click', async () => {
                await menu.clickOnglet(sPageName, sNomOnglet, page);
            })

            test ('ListBox [DOSSIER D\'ACHAT] - Check', async () => {
                await expect(pageRecomOuverture.multiSelectDossierAchat).toBeVisible()
            });

            test ('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
                await fonction.ngClickListBox(pageRecomOuverture.listBoxGroupeArticle, sGroupeArticle, pageRecomOuverture.listBoxChoixGroupeArticle);
                await fonction.waitTillHTMLRendered(page);

            });

            test.describe ('CheckBox [Articles]', async () => {

                test ('** Wait Until Spinner Off **', async () => {
                    var iDelaiTest = 120000;
                    test.setTimeout(iDelaiTest);
                    await expect(page.locator('i.app-spinner')).not.toBeVisible({timeout:iDelaiTest});
                })

                test ('** Fill Code **', async () => {
                    if (sImportDatas === '' && sArticle === '') { //use json value if both parameters E2E and listeArticles are not given
                        let oData = {
                            iCodeArticle : null
                        }
                        oData = jddFile.readJson(sJddFile)
                        sArticle = oData.iCodeArticle
                    }
                    await fonction.sendKeys(pageRecomOuverture.dataGridListeRecomInputCode, sArticle, false, 'Article');
                    await fonction.waitTillHTMLRendered(page)
                    
                })

                test ('** Uncheck everything **', async () => {
                    //Perform the unchecks
                    const article = pageRecomOuverture.dataGridListeRecomElements.nth(0);
                    const checkboxes = article.locator('td div.p-checkbox-box');
                    const checkboxCount = await checkboxes.count();
                
                    for (let i = 0; i < checkboxCount; i++) { 
                        const checkbox = checkboxes.nth(i); //Check all the checkboxes
                        const bIsChecked = await checkbox.evaluate(element => element.getAttribute('class').includes('p-highlight'));
                        if (bIsChecked) {
                            await fonction.clickElement(checkbox);
                        }
                        const bIsUnchecked = await checkbox.evaluate(element => !element.getAttribute('class').includes('p-highlight'));
                        expect(bIsUnchecked).toBe(true);
                    }
                })
                    

            })

            test ('Button [ENREGISTRER]', async () => {
                await fonction.clickAndWait(pageRecomOuverture.buttonEnregistrer, page);
            })

        })

        if (sImportDatas !== '') {
            test.describe ('Onglet [ACHATS CENTRALE]', async () => {
                var sNomOnglet = 'autorisationAchatCentrale';
                test ('Onglet [ACHATS CENTRALE] - Click', async () => {
                    await menu.clickOnglet(sPageName, sNomOnglet, page);
                })

                test ('Input [ASSORTIMENTS] [' + sDesignGrpAssort + ']', async () => {
                    await fonction.sendKeys(pageAutoAC.inputAssortiment, sDesignGrpAssort, false, 'Assortiment');
                })
    
                test ('CheckBox [ASSORTIMENT][0] = ' + sDesignGrpAssort + ' - Click', async () => {
                    await fonction.wait(page,250);
                    var sText:string = sDesignGrpAssort + ' (' + sGroupeArticle + ')'
                    await fonction.clickElement(pageAutoAC.checkBoxAssortiments.locator('td:text-is("'+sText+'")'));
                })

                test ('Input [CODE ARTICLE][' + sArticle + ']', async () => {
					await fonction.sendKeys(pageAutoAC.dataGridHeaderCdeArt, sArticle, false, 'Code Article');
					await fonction.waitTillHTMLRendered(page)
				})

                test('DataGrid [ARTICLES DE L\'ASSORTIMENT][first] - Click', async () => {
                    await fonction.clickElement(pageAutoAC.trLignesArticles.first());
				})

                var nomPopin = 'Modification d\'une ligne de l\'assortiment';
                test.describe('Popin [' + nomPopin.toUpperCase() + '] ', async () => {

                    test('Button [MODIFIER LA LIGNE] - Click', async () => {
                        await fonction.clickAndWait(pageAutoAC.buttonModifierLigne, page);
                    })

                    test('Popin [' + nomPopin.toUpperCase() + '] - Is Visible', async () => {
                        await pageAutoAC.pPopinEnregLAssortFL.isVisible();
                    })

        
                    test ('DataGrid [VALUES] - Check', async () => { //Check pictogramme
                        const rows = pageAutoAC.pPDataGridMagasin.locator('table tbody tr')
                        const rowCount = await rows.count();

                        for (let i = 0; i < rowCount; i++) {
                            const row = rows.nth(i);
                            expect(await row.locator('i.pi-bookmark-fill.ng-star-inserted').count()).toBe(0); //expect to not see any pictogram
                        }
                    })


                    test('Button [FERMER] - Click', async () => {
                        await fonction.clickElement(pageAutoAC.pPButtonFermer);
                   })

                })

            })
        }
    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})