/**
 * 
 * @desc Créer une entrée d'emballage
 * 
 * @author Vazoumana DIARRASSOUBA 
 *  Since 16 - 11 - 2023
 */

const xRefTest      = "STO_EMB_ENT";
const xDescription  = "Créer une entrée d'emballage";
const xIdTest       =  2143;
const xVersion      = '3.7';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme','chauffeur','transporteur','receptionnaire','commentaire','expediteur','numeroBl'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}       from '@playwright/test';

import { TestFunctions }                from "@helpers/functions.js";
import { Log }                          from "@helpers/log.js";
import { Help }                         from '@helpers/helpers.js';

import { MenuStock }                    from "@pom/STO/menu.page.js";
import { EmballageMouvementsEmballages }from '@pom/STO/emballage-mouvements_emballages.page.js';

import { AutoComplete, CartoucheInfo }  from '@commun/types';

//----------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuStock;
let pageEmballage   : EmballageMouvementsEmballages;

const log           = new Log();
const fonction      = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const sToday        = fonction.getToday('US');
const plateforme    = fonction.getInitParam('plateforme','Cremcentre');

var sNomChauffeur   = fonction.getInitParam('chauffeur','TEST_AUTO - Chauffeur. ');
var sNomTransp      = fonction.getInitParam('transporteur','TEST_AUTO - Transporteur. ');
var sNomRecep       = fonction.getInitParam('receptionnaire','TEST_AUTO - Réceptionnaire. ');
var sCommentaire    = fonction.getInitParam('commentaire','TEST_AUTO - Commentaire et observations. ');
const sExpediteur   = fonction.getInitParam('expediteur','SET');
var sNumBl          = fonction.getInitParam('numeroBl','TA - NumBl. ');

sNomChauffeur       = sNomChauffeur + sToday;
sNomTransp          = sNomTransp + sToday;
sNomRecep           = sNomRecep + sToday;
sCommentaire        = sCommentaire + sToday;
sNumBl              = sNumBl + fonction.getToday('US');
//----------------------------------------------------------------------------------------
const iNbEmballages = 8;
const sHeureArrivee = '01:01';
const sHeureDepart  = '02:02';
//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 

    menu            = new MenuStock(page, fonction);
    pageEmballage   = new EmballageMouvementsEmballages(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', async () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test('ListBox [PLATEFORME] = "' + plateforme + '"', async() => {            
        await menu.selectPlateforrme(page, plateforme);                       // Sélection d'une plateforme par défaut
    })

    test.describe('Page [EMBALLAGE]', async () =>  {  

        var iNbPalettes:number = 0
        var currentPage:string = 'emballage';

        test('Page [EMBALLAGE] - Click', async () => {
            await menu.click(currentPage, page);  
        })
             
        test('Label [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);                     
        })

        test.describe('Onglet [MOUVEMENTS DES EMBALLAGES]', async () =>  {        
            
            test('Onglet [MOUVEMENTS DES EMBALLAGES] - Click', async () =>  {
                await menu.clickOnglet(currentPage, 'mouvementsEmballages', page);                                        
            })   
      
            test('Button [CREER UNE ENTREE D\'EMBALLAGE] - Click', async () =>  {
                await pageEmballage.labelNbTotalPalettes.waitFor();             
                var sNbPalettes = await pageEmballage.labelNbTotalPalettes.textContent();
                if (sNbPalettes && parseInt(sNbPalettes) != undefined){
                    iNbPalettes = parseInt(sNbPalettes);
                    log.set('Nombre de palettes AVANT ajout : ' + iNbPalettes);
                } 
                await fonction.clickAndWait(pageEmballage.buttonCreerEntree, page, 40000);
            })

            var sNomPopin:string = "Créer une entrée d'emballage";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>  {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible -Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })   

                test('DatePeacker [ENTREE] = "' + sToday + '"', async () =>  {
                    await fonction.clickElement(pageEmballage.pDatePickerEntree);                    
                    await fonction.clickElement(pageEmballage.pTdTodayDateEntree);
                })

                test('InputField [NUMERO DE BL] =', async () => {
                    await fonction.sendKeys( pageEmballage.pInputEntreeNumBL, sNumBl);
                })
                
                test('InputField [CHAUFFEUR] = "' + sNomChauffeur + '"', async () => {
                   await fonction.sendKeys(pageEmballage.pInputEntreeChauffeur, sNomChauffeur);
                })
                
                test('InputField [TRANSPORTEUR] = "' + sNomTransp + '"', async () => {
                   await fonction.sendKeys(pageEmballage.pInputEntreeTransporteur, sNomTransp);
                })
                
                test('InputField [RECEPTIONNAIRE] = "' + sNomRecep + '"', async () => {
                   await fonction.sendKeys(pageEmballage.pInputReceptionnaire, sNomRecep);
                })
                
                test('InputField [HEURE ARRIVEE] = "' + sHeureArrivee + '"', async () => {
                   await fonction.sendKeys(pageEmballage.pInputSortieHeureArrivee, sHeureArrivee, false);
                })
            
                test('InputField [HEURE DEPART] = "' + sHeureDepart + '"', async () => {
                   await fonction.sendKeys(pageEmballage.pInputEntreeHeureDepart, sHeureDepart, false);
                })
                
                test('InputField [OBSERVATIONS] = "' + sCommentaire + '"', async () => {
                   await fonction.sendKeys(pageEmballage.pTextAreaEntreeObservations,sCommentaire);
                })
                                
                test('InputField [AUTOCOMPLETE][EXPEDITEUR] = "' + sExpediteur + '"', async () =>{
                    var oData:AutoComplete = {
                        libelle         :'EXPEDITEUR',
                        inputLocator    : pageEmballage.pInputDestinataire,
                        inputValue      : sExpediteur,
                        choiceSelector  :'button.dropdown-item',
                        choicePosition  : 1,
                        typingDelay     : 100,
                        waitBefore      : 500,
                        page            : page,
                    };
                    await fonction.autoComplete(oData);
                })

                test('InputField [TYPE EMBALLAGE] = "' + iNbEmballages + '"', async () =>  {
                    await pageEmballage.pInputListeTypeEmbEntree.first().waitFor();
                    await fonction.sendKeys(pageEmballage.pInputListeTypeEmbEntree.first(), iNbEmballages.toString());
                })

                test('Button [ENREGISTRER] - Click', async () =>  {
                    await fonction.clickAndWait(pageEmballage.pButtonEntreeEnregistrer, page);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible - Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })   

            })

            test('Label [TOTAL PALETTES] = "Nb Initial + ' + iNbEmballages + '"', async () =>  {
                const iTimetout:number = 90000;
				test.setTimeout(iTimetout);
                await expect(pageEmballage.spinnerMvtEmballage).not.toBeVisible({timeout:iTimetout});//-- Attente que le spinner disparaisse;
                var sNbPalettes = await pageEmballage.labelNbTotalPalettes.textContent();
                if (sNbPalettes && parseInt(sNbPalettes) != undefined){
                    log.set('Nombre de Palettes APRES ajout : ' + parseInt(sNbPalettes));
                    expect(parseInt(sNbPalettes)).toBeGreaterThan(iNbPalettes);
                }      
            })


        })  //-- End Describe Onglet  

    })  //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})