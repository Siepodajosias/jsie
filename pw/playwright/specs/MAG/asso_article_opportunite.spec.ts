/**
 *
 * @author JOSIAS SIE
 * @since 2023-01-19
 *
 */
const xRefTest      = "MAG_OPP_ADD";    // FDE, ...
const xDescription  = "Association d'Articles à une Opportunité";
const xIdTest       =  2666;
const xVersion      = "3.3";
   
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['groupeArticle', 'codeArticle', 'listeMagasins'],
    fileName    : __filename
};
 
import { test, type Page}               from '@playwright/test';

import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';

import { MenuMagasin }                  from '@pom/MAG/menu.page';
import { AutorisationsOppotunites }     from '@pom/MAG/autorisations-opportunites.page';

import { AutoComplete, CartoucheInfo }  from '@commun/types';

//------------------------------------------------------------------------------------
 
let page                : Page;
 
var pageAutoOpportunite : AutorisationsOppotunites;
var menu                : MenuMagasin;
 
const log               = new Log();
const fonction          = new TestFunctions(log);


//------------------------------------------------------------------------------------
var localData           = fonction.getLocalConfig(); 
var maDate              = new Date(); 

const groupeArticle     = localData.aGroupesArticles[fonction.getInitParam('groupeArticle')];        // 'FL' => 'Fruits et légumes'
const idArcticle        = fonction.getInitParam('codeArticle', '5600');
const villesCibles      = fonction.getInitParam('listeMagasins', ['Bergerac', 'Bron', 'Compiègne', 'Gaillarde', 'Mérignac']);

const iColisMin         = 1;
const iColisMax         = 888;
const iColisDispo       = 100;

const xFix              = ':' + maDate.getDate().toString();
const dateJour          = fonction.getToday('fr',0,'-');
const sDesignationGroupe= 'TEST-AUTO_Opportunité ' + groupeArticle + ' ' + dateJour;
const sComment          = 'TEST-AUTO_ Info à Communiquer '+  dateJour + ' ' + xFix;

//------------------------------------------------------------------------------------

log.set('Article Cible : ' + idArcticle);

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
 
test.describe.serial('[' + xRefTest + ']', () => {
 
    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })
 
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
       
        test('Popin [ALERT][ACCUEIL] - Click', async () => {
            await menu.removeArlerteMessage(page);
            await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de l'onglet
        });
 
        var pageName:string = 'autorisations';
        test ('Page [AUTORISATION] - Click', async () => {
            await menu.click(pageName, page);
        })
 
        test.describe('Onglet [OPPORTUNITES]', async() => {
 
            test ('Onglet [OPPORTUNITES] - Click', async () => {
                await menu.clickOnglet(pageName, 'opportunites', page);
            })  
 
            test ('Input [ASSORTIMENTS] [' + sDesignationGroupe + ']', async () => {
                await fonction.sendKeys(pageAutoOpportunite.inputAssortiment, sDesignationGroupe, false, 'Assortiment');
                await fonction.wait(page, 500);
            })
 
            test('CheckBox [ASSORTIMENT][last] - Click', async () => {                 
                var iNbAssortiments = await pageAutoOpportunite.trAssortiments.count();
                log.set('Nb Assortiments de type Opportunite dans la liste : ' + iNbAssortiments);
                var rnd = iNbAssortiments - 1;
                var sLibelleAssort = await pageAutoOpportunite.trAssortiments.nth(rnd).textContent();
                log.set('Assortiment Sélectionné : ' + sLibelleAssort);
                await fonction.clickAndWait(pageAutoOpportunite.trAssortiments.nth(rnd), page);                                       
            })

            test('** Purge Article si Nécessaire **', async() => {    
                var text = await pageAutoOpportunite.labelNbArticles.textContent();
                if (text.includes('0')) { 
                    log.set('Aucun Article déjà associé à cette opportunité');
                }else {
                    var iNbarticles = await pageAutoOpportunite.trArticles.count();
                    log.set(iNbarticles + ' Article(s) déjà associé(s) à cette opportunité');
                    await fonction.clickElement(pageAutoOpportunite.checkBoxCptArticle);
                    await fonction.clickAndWait(pageAutoOpportunite.buttonSupprimerLigne, page);
                    await fonction.clickAndWait(pageAutoOpportunite.pPconfSuppButtonOui, page);                              
                }
            }) 
            
            test('InputField [AUTOCOMPLETE][CODE][ARTICLE] = "' + idArcticle + '"',async () => {
                var isVisible: boolean  = await pageAutoOpportunite.inputArticle.isVisible();
                if(isVisible){
                    var oData:AutoComplete = {
                        libelle         :'ARTICLE',
                        inputLocator    : pageAutoOpportunite.inputArticle,
                        inputValue      : idArcticle,
                        choiceSelector  : 'div.autocomplete-article app-autocomplete button.dropdown-item',
                        choicePosition  : 0,
                        typingDelay     : 100,
                        waitBefore      : 500,
                        page            : page,
                    };
                    
                    await fonction.autoComplete(oData);
                }
            })            

            test ('Button [PLUS] - Click', async () => {
                await fonction.clickAndWait(pageAutoOpportunite.buttonPlus, page);
            })

            test.describe('Popin [ENREGISTREMENT LIGNE ASSORTIMENT]', () => {

                test('Popin [ENREGISTREMENT LIGNE ASSORTIMENT] - Is Visible', async () => {
                    await fonction.popinVisible(page, 'ENREGISTREMENT LIGNE ASSORTIMENT', true);
                }) 

                test('** Sélection Calibre / conditionnement **', async () => {
                    var iNbChoixCalibre   = await pageAutoOpportunite.pPSelectCalibre.locator(' option').count();

                    var aNomCalibre       = await pageAutoOpportunite.pPSelectCalibre.locator(' option').allTextContents();

                    for(var iNb = 0; iNb < iNbChoixCalibre; iNb++){

                        var sNomCalibre = aNomCalibre[iNb];

                        if(sNomCalibre !=''){
                            await pageAutoOpportunite.pPSelectCalibre.selectOption({index: iNb});
                            log.set('Calibres : ' + sNomCalibre);
                            await fonction.addDataSheet('InputField', 'Calibre', sNomCalibre);

                            await fonction.wait(page, 1000);
                            var selecteurConditionnement= pageAutoOpportunite.pPSelectConditionnement;
                            var iNbChoixConditionnement = await selecteurConditionnement.locator('option').count();
                            var sNomConditionnement     = await selecteurConditionnement.locator('option').nth(iNbChoixConditionnement - 1).textContent();
                            
                            if(sNomConditionnement !=''){
                                await selecteurConditionnement.selectOption({index: (iNbChoixConditionnement - 1)});
                                log.set('Conditionnement : ' + sNomConditionnement);
                                await fonction.addDataSheet('InputField', 'Conditionnement', sNomConditionnement);
                                break;
                            }
                        }
                    }
                })

                test('InputField [QUANTITE DISPONIBLE]', async () => {
                    await fonction.sendKeys(pageAutoOpportunite.pPenregInputQteDispo.nth(0), iColisDispo, false, 'Qté Dispo');
                })

                test('InputField [MINIMUM DE COMMANDE]', async () => {
                    await fonction.sendKeys(pageAutoOpportunite.pPenregInputMinCmde, iColisMin, false, 'Min Commande');  
                })

                test('InputField [MAXIMUM DE COMMANDE]', async () => {
                    await fonction.sendKeys(pageAutoOpportunite.pPenregInputMaxCmde, iColisMax, false, 'Max Commande');
                })

                test('InputField [INFO A COMMUNIQUER]', async () => {
                    await fonction.sendKeys(pageAutoOpportunite.pPenregTextaAreaInfoCom, sComment, false, 'Infos');
                })

                test('RoadioButton [TYPE COMMANDE][0] - Select', async () => {
                    await fonction.clickElement(pageAutoOpportunite.pPenregRadioButtonTypeCmde.nth(0));
                })

                test('Input [DESIGNATION] - Click',async () => {
                    //-- Utilisation des filtres
                    await fonction.clickElement(pageAutoOpportunite.pPlistBoxDesignation.nth(0));
                })

                villesCibles.forEach((ville:string) => {  
                       
                    test('P-multiselectitem [DESIGNATION][' + ville.toString() + ']', async () => {
                        await fonction.sendKeys(pageAutoOpportunite.pPinputEnrFilter, ville, false, 'Désignation');

                        var isVisible     = await pageAutoOpportunite.pPcheckBoxEnrFilter.first().isVisible();
                        if(isVisible){
                            await fonction.clickAndWait(pageAutoOpportunite.pPcheckBoxEnrFilter.first(), page);
                        }
                    })  
                })

                test('P-checkBox [ALL] - Click', async () => {
                    await fonction.clickElement(pageAutoOpportunite.pPpictoEnrClose);
                    await fonction.clickAndWait(pageAutoOpportunite.pPcheckBoxEnrAllMag.nth(0), page);
                })

                test('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pageAutoOpportunite.pPbuttonEnregistrer, page);

                    var isVisible  = await pageAutoOpportunite.pErrorMessage.isVisible();
                    if(isVisible){

                        await fonction.clickAndWait(pageAutoOpportunite.pPlinkFermer, page);
                    }else{

                        var isVisible = await pageAutoOpportunite.pPlinkEnregistrerOui.isVisible();
                        if (isVisible) {

                            log.set('Message d\'avertissement visible - Lien OUI cliqué');
                            await fonction.clickAndWait(pageAutoOpportunite.pPlinkEnregistrerOui, page);
                        }else{

                            log.set('Pas de Message d\'Avertissement Visible');
                            log.separateur();
                        }
                    }
                })     

                test('Popin [ENREGISTREMENT LIGNE ASSORTIMENT] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, 'ENREGISTREMENT LIGNE ASSORTIMENT', false);
                }) 
            }) // end Popin
        }) // end Onglet
    }) // end Page

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})
 