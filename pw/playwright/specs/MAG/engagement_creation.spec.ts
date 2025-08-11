/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 19 - 12 - 2023
 */

const xRefTest      = "MAG_ENG_NEW";
const xDescription  = "Création d'un Engagement";
const xIdTest       =  978;
const xVersion      = '3.15';

var info:CartoucheInfo = {
    desc            : xDescription,
    appli           : 'MAGASIN',
    version         : xVersion,        
    refTest         : [xRefTest],
    idTest          : xIdTest,
    help            : [],
    params          : ['groupeArticle','nom'],
    fileName        : __filename
}

//----------------------------------------------------------------------------------------

import { expect, test, type Page}        from '@playwright/test';

import { TestFunctions }                 from "@helpers/functions";
import { Log }                           from "@helpers/log";
import { Help }                          from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }                   from '@pom/MAG/menu.page';
import { AutorisationsParametrage }      from '@pom/MAG/autorisations-parametrage.page';

import { CartoucheInfo }                 from '@commun/types';
//-------------------------------------------------------------------------------------

let   page          					     : Page;

let   menu          					     : MenuMagasin;
let   pageAutParam  					     : AutorisationsParametrage;

const log                                    = new Log();
const fonction                               = new TestFunctions(log);
const dToday                                 = new Date();
const dFirtDay                               = new Date(dToday);
const dLastDay                               = new Date(dToday);

//----------------------------------------------------------------------------------------
const sGroupeArticle        :string          = fonction.getInitParam('groupeArticle',fonction.getLocalConfig('groupeArticleEngagement'));
const sNomEngagement        :string          = fonction.getInitParam('nom', fonction.getLocalConfig('assortimentEngagement'));
// Timing
const iHeureDebut           :number          = dToday.getHours() + 1;
const iMinuteDebut          :number          = dToday.getMinutes();
const iHeureFin             :number          = dToday.getHours() + 2;
const iMinuteFin            :number          = dToday.getMinutes();

const iRepartPourcentDebut  :number          = 20;
const iRepartPourcentInt    :number          = 30;
const iRepartPourcentFin    :number          = 50;
const sLabelEngagement      :string          = sNomEngagement + fonction.getToday('FR');
//-----------------------------------------------------------------------------------------
process.env.ROLE                             = 'REPARTITEUR';// Connexion par défaut avec le profil ayant le Role REPARTITEUR
//-----------------------------------------------------------------------------------------

/**
 * Cette fonction choisie l'intervalle de date d'expedition.
 */

const selectToDate = async () => {
    dFirtDay.setDate(dToday.getDate()+1);
    dLastDay.setDate(dToday.getDate()+3);

    if(dToday.getMonth() < dFirtDay.getMonth()){
        await fonction.clickElement(pageAutParam.datePickerNext);
    }
    await fonction.clickElement(pageAutParam.datePickerDay.locator('span:text-is("'+dFirtDay.getDate()+'")'));
    if(dToday.getMonth() < dLastDay.getMonth() && dToday.getMonth() < dFirtDay.getMonth()){
        await fonction.clickElement(pageAutParam.datePickerNext);
    }
    await fonction.clickElement(pageAutParam.datePickerDay.locator('span:text-is("'+dLastDay.getDate()+'")'));
};

//-----------------------------------------------------------------------------------------
test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageAutParam    = new AutorisationsParametrage(page);
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
            if(await menu.pPopinAlerteSanitaire.isVisible()){
                await menu.removeArlerteMessage(page);
            }else{
                log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                test.skip();
            }
        })
    })

    test.describe ('Page [AUTORISATIONS]', async () => {
        var sPageName:string = 'autorisations';

        test ('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(sPageName, page);
        })

        test ('Label [ERREUR #0] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })                            

        test.describe ('Onglet [PARAMETRAGE]', async () => {     

            test ('Onglet [PARAMETRAGE] - Click', async () => {   
                await menu.clickOnglet(sPageName, 'parametrage', page);
            })

            test ('Label [ERREUR #1] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
                await fonction.isErrorDisplayed(false, page);
            })                            
  
            test ('Button [CREER ASSORTIMENT] - Click', async () => {
                await fonction.clickAndWait(pageAutParam.buttonCreerAssort, page);   
            })                

            test.describe ('Div [ENGAGEMENT]', async () => {

                test('Select [ENGAGEMENTS] = "Engagements"', async () => {
                    await pageAutParam.listBoxTypeAssortiment.selectOption({label:'Engagements'}); 
                })
            })

            test.describe ('Div [CREATION DE L\'ENGAGEMENT]', async () => {
                
                test ('Radio Button [TYPE ENGAGEMENT] - Click', async () => {
                    await fonction.clickElement(pageAutParam.radioButtonEngagement);
                })
  
                test ('ListBox [GROUPE] = "' + sGroupeArticle + '"', async () => {
                    await fonction.listBoxByLabel(pageAutParam.listBoxOrigine, sGroupeArticle, page);
                })

                test ('InputField [DESIGNATION] = "' + sLabelEngagement + '"', async () => {
                    await fonction.sendKeys(pageAutParam.inputDesignation, sLabelEngagement, false, 'Désignation'); 
                })

                test ('Button [ENREGISTRER] - Is Enable', async () => {
                    expect(await pageAutParam.buttonEnregistrer.isEnabled()).toBe(true);
                })   
                
                test("Button [DEBUT][LAST DAY] - Click", async () => {
                    await fonction.clickElement(pageAutParam.datePickerDebutEng);
                });

                test("DatePicker [DEBUT][LAST DAY] - Click", async () => {
                    await fonction.clickElement(pageAutParam.datePickerDaySpan);
                });

                test("Button [FIN][LAST DAY] - Click", async () => {
                    await fonction.clickElement(pageAutParam.datePickerFinEng);
                });

                test("DatePicker [FIN][LAST DAY] - Click", async () => {
                    await fonction.clickElement(pageAutParam.datePickerDaySpan);
                    await fonction.waitForDomStable(page);
                }); 
                
                test ('InputField [HEURE DEBUT] = "' + iHeureDebut + '"', async () => {
                    await fonction.sendKeys(pageAutParam.inputHeureDebut, iHeureDebut, false, 'Heure Début');
                })
    
                test ('InputField [MINUTE DEBUT] = "' + iMinuteDebut + '"', async () => {
                    await fonction.waitForDomStable(page);
                    await fonction.sendKeys(pageAutParam.inputMinuteDebut, iMinuteDebut, false, 'Minute Début'); 
                })
        
                test ('InputField [HEURE FIN] = "' + iHeureFin + '"', async () => {
                    await fonction.sendKeys(pageAutParam.inputHeureFin, iHeureFin, false, 'Heure Fin');  
                })

                test ('InputField [MINUTE FIN] = "' + iMinuteFin + '"', async () => {
                    await fonction.waitForDomStable(page);
                    await fonction.sendKeys(pageAutParam.inputMinuteFin, iMinuteFin, false, 'Minute Fin');  
                })
                    
                test ('CheckBox [POURCENTAGE DE REPARTITION] - Click', async () => {
                    await fonction.clickElement(pageAutParam.checkBoxPourcentageRepart);
                })

                test ('CheckBox [BLOQUER LA MODIFICATION DES POURCENTAGES DE REPARTITION] - Is Visible', async () => {
                    await fonction.isDisplayed(pageAutParam.checkBoxBloquerModifPourcen);
                })

                test ('CheckBox [BLOQUER LA MODIFICATION MANUELLE DES QUANTITE] - Is Visible', async () => {
                    await fonction.isDisplayed(pageAutParam.checkBoxBloquerModifManuel);
                })

                test ('Button [DATE D\'EXPEDITION] - Click', async () => {
                    await fonction.clickElement(pageAutParam.pCalendarPeriode); 
                })

                test ('DatePicker [DATE D\'EXPEDITION] - Click', async () => {
                    await selectToDate(); // Je choisie deux dates dans le tableau des dates d'expeditions
                }) 

                test ('Button [AJOUTER EXPEDITION] - Click', async () => {
                    await fonction.clickAndWait(pageAutParam.buttonAjouterExpedition, page);
                })

                test ('Input [AJOUTER EXPEDITION][1] = "' + iRepartPourcentDebut + '"', async () => {
                    await fonction.sendKeys(pageAutParam.inputDateExpedition.nth(0), iRepartPourcentDebut, false, 'Pourcentage repartition %');
                })

                test ('Input [AJOUTER EXPEDITION][2] = "' + iRepartPourcentInt + '"', async () => {
                    await fonction.sendKeys(pageAutParam.inputDateExpedition.nth(1), iRepartPourcentInt, false, 'Pourcentage repartition %');
                })

                test ('Input [AJOUTER EXPEDITION][3]  = "' + iRepartPourcentFin + '"', async () => {
                    await fonction.sendKeys(pageAutParam.inputDateExpedition.nth(2), iRepartPourcentFin, false, 'Pourcentage repartition %');
                })

                test ('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pageAutParam.buttonEnregistrer, page);
                })  
            })

            test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
                await fonction.isErrorDisplayed(false, page); 
            })                            
        })  // En describe Onglet

    }) // end describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})