/**
 * @author Mathis NGUYEN
 * @description "Ajouter des recommandations d'ouverture à un article";
 * @since 2024-07-15
 * 
 */
const xRefTest      = "MAG_GPE_REC";
const xDescription  = "Ajouter des recommandations d'ouverture à un article";
const xIdTest       =  9438;
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

import { CartoucheInfo }            from '@commun/types';
//------------------------------------------------------------------------------------

let page                  	: Page;
let menu                  	: MenuMagasin;
let pageRecomOuverture      : AutorisationsRecomOuverture;
let pageAutoAC              : AutorisationsAchatsCentrale;

var jddFile                 : JddFile;


const log                 	= new Log();
const fonction            	= new TestFunctions(log);

const sJddFile              = fonction.getLocalConfig('jddGammeRecom');     //used to store the code of an article, if it is chosen randomly, for further use in gamme_recommandation_ouverture.suppression.spec.ts

//------------------------------------------------------------------------------------
fonction.importJdd()

const sImportDatas      = fonction.getInitParam('E2E', '');                   // Used to determine if specific actions have to be done (when E2E is defined)
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Marée')     // Add recommandations on this groupeArticle...
const sArticles         = fonction.getInitParam('listeArticles', '');         //--- Variables below will only be used if we pass the E2E parameter !

const aListeArticles    = sArticles.split(',');
const sArticle          = aListeArticles[0]                                   //... for this article IF E2E or explicit value is given ELSE it will be a random one

const sDesignGrpAssort  = fonction.getInitParam('nomAssortiment', 'TA_AchCentrale - FL10 - Chaponnay (Fruits et légumes)');  // Check this assortiment by ...

const sGammes           = fonction.getInitParam('listeGammes', 'TA_Designation3,TA_Designation4');       
const aListeGammes      = sGammes.split(',');                                                           // ... filtering by theses gammes

let iTdBeforeRegCheckbox = 0;
let iTdBeforeGammeAutresCheckbox = 0;
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

    let oData = {
        iCodeArticle : null
    }
    
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
        
                test ('** Get number of tds **', async() => {
                    // Try to store number of td before Checkbox Gammes "Autres" and Checkbox Régionalisation
                    const thHeaderElements = pageRecomOuverture.dataGridListeRecom;

                    let iRowspanCountGammes = 0;
                    let iColspanSumGammes = 0;
                    let bFoundGammes = false;

                    let iRowspanCountReg = 0;
                    let iColspanSumReg = 0;
                    let bFoundReg = false;

                    const thHeaderCount = await thHeaderElements.count();
                    for (let i = 0; i < thHeaderCount; i++) {
                        const thHeaderElement = thHeaderElements.nth(i);
                        const thHeaderTextContent = await thHeaderElement.textContent();

                        if (thHeaderTextContent?.trim() === "Gammes") {
                            bFoundGammes = true;
                        } else if (thHeaderTextContent?.trim() === "Régionalisation") {
                            bFoundReg = true;
                        }

                        const rowspan = await thHeaderElement.getAttribute('rowspan');
                        if (rowspan) {
                            if (!bFoundGammes) {
                                iRowspanCountGammes++;
                            }
                            if (!bFoundReg) {
                                iRowspanCountReg++;
                            }
                        }

                        const colspan = await thHeaderElement.getAttribute('colspan');
                        if (colspan) {
                            if (!bFoundGammes) {
                                iColspanSumGammes += parseInt(colspan);
                            }
                            if (!bFoundReg) {
                                iColspanSumReg += parseInt(colspan);
                            }
                        }

                        if (bFoundGammes && bFoundReg) {
                            break;
                        }
                    }

                    // Expect to have found the headers "Gammes" and "Régionalisation"
                    expect(bFoundGammes).toBe(true);
                    expect(bFoundReg).toBe(true);

                    // Store the sum of the respective values
                    iTdBeforeRegCheckbox = iRowspanCountReg + iColspanSumReg; // this is the total number of td before the header "Régionalisation" and since Régionalisation DOES NOT contain subheaders, this is also the total number of td before the checkbox "Régionalisation"
                    let iBeforeGamme = iRowspanCountGammes + iColspanSumGammes; //this is the total number of td before the header "Gammes" and since Gammes DOES contain subheaders, we must consider them for our final result...
                    

                    //Loop now through the subheaders until we found the gamme "Autres" and increment the compteur 
                    const thSubHeaderElements = pageRecomOuverture.dataGridListeRecomSub;

                    let i = iColspanSumGammes; // Start from the first subheader after the header "Gammes"
                    let bFoundGammeAutres = false;

                    const thSubHeaderCount = await thSubHeaderElements.count();

                    while (i < thSubHeaderCount) {
                        const thSubHeaderTextContent = await thSubHeaderElements.nth(i).textContent();

                        if (thSubHeaderTextContent?.trim() === "Autres") {
                            bFoundGammeAutres = true;
                            break;
                        }

                        iBeforeGamme++;
                        i++;
                    }

                    //Expect to have found it 
                    expect(bFoundGammeAutres).toBe(true)

                    iTdBeforeGammeAutresCheckbox = iBeforeGamme; // this is now the total number of td before the checkbox "Autres"
                })

                test ('** Fill Code **', async () => {
                    if ((sImportDatas !== '') || (sArticle !== '')) {
                        await fonction.sendKeys(pageRecomOuverture.dataGridListeRecomInputCode, sArticle, false, 'Code');
                        await fonction.waitTillHTMLRendered(page)
                    } else {
                        test.skip()
                    }
                })

                test ('** Check an article **', async () => {
                    let indexArticle;
                    if (sImportDatas === '' && sArticle === '') { //use random value if both parameters E2E and listeArticles are not given
                        const countElements = await pageRecomOuverture.dataGridListeRecomElements.count()
                        indexArticle = Math.floor(fonction.random() * countElements)
                    } else {
                        indexArticle = 0
                    }

                    //Perform the checks for this random article
                    const article = pageRecomOuverture.dataGridListeRecomElements.nth(indexArticle);

                    //Get the code of the random article
                    const headers = pageRecomOuverture.dataGridListeRecom;
                    const headersCount = await headers.count();
                    let bCodeFound = false

                    for (let i = 0; i < headersCount; i++) {
                        const sCurrentHeader = (await headers.nth(i).textContent()).trim()
                        if (sCurrentHeader === "Code") {
                            oData.iCodeArticle = await article.locator('td').nth(i).textContent();
                            bCodeFound = true;
                        }
                    }

                    expect(bCodeFound).toBe(true);

                    //Perform the checks
                    const checkboxes = article.locator('div.p-checkbox-box');
                    const checkboxCount = await checkboxes.count();
                
                    for (let i = 0; i < checkboxCount; i++) { 
                        const checkbox = checkboxes.nth(i); //Check all the checkboxes
                        await fonction.clickElement(checkbox);
                    }

                    await fonction.clickElement(article.locator('td').nth(iTdBeforeRegCheckbox)); //Uncheck Régionalisation
                    await fonction.clickElement(article.locator('td').nth(iTdBeforeGammeAutresCheckbox)); //Uncheck Gamme Autres
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

                    aListeGammes.forEach((sGamme:string, i) => {
                        test.describe ('Check Gamme #' + i, async () => {
                            test('Button [GAMME] = "' + sGamme + ' - Click', async () => { //Filter by Gamme
                                await fonction.clickAndWait(pageAutoAC.pPToggleGamme.filter({ hasText: sGamme }).first(), page);
                            })
        
                            test ('DataGrid [VALUES] - Check #' + i, async () => { //Check pictogramme
                                const rows = pageAutoAC.pPDataGridMagasin.locator('table tbody tr')
                                const rowCount = await rows.count();

                                for (let i = 0; i < rowCount; i++) {
                                    const row = rows.nth(i);
                                    expect(await row.locator('i.pi-bookmark-fill.ng-star-inserted').count()).toBe(1); //expect to see a pictogram
                                }
                            })

                            test('Button [GAMME] = "' + sGamme + ' - UnClick', async () => { //Filter by Gamme
                                await fonction.clickAndWait(pageAutoAC.pPToggleGamme.filter({ hasText: sGamme }).first(), page);
                            })
                        });
                
                    });

                    test('Button [FERMER] - Click', async () => {
                        await pageAutoAC.pPButtonFermer.click();
                   })

                })

            })
        }
    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);

        jddFile.writeJson(sJddFile, oData);
    })

})