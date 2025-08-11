/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 16 - 11 - 2023
 */

const xRefTest      = "STO_EMB_SOR";
const xDescription  = "Créer une sortie d'emballage";
const xIdTest       =  2144;
const xVersion      = '3.3';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}       from '@playwright/test';

import { TestFunctions }                from "@helpers/functions";
import { Log }                          from "@helpers/log";
import { Help }                         from '@helpers/helpers';

import { MenuStock }                    from "@pom/STO/menu.page";
import { EmballageMouvementsEmballages }from '@pom/STO/emballage-mouvements_emballages.page';

import { AutoComplete, CartoucheInfo }	from '@commun/types';

//----------------------------------------------------------------------------------------

let page          : Page;

let menu          : MenuStock;
let pageEmballage : EmballageMouvementsEmballages;

const log         = new Log();
const fonction    = new TestFunctions(log);

//----------------------------------------------------------------------------------------

var maDate            = new Date();
const sToday          = fonction.addZero(maDate.getDate()) + ' / ' + fonction.addZero(maDate.getMonth() + 1) + ' / ' + maDate.getFullYear();
const sNomChauffeur   = 'TEST_AUTO - Chauffeur ' + sToday;
const sNomTransp      = 'TEST_AUTO - Transporteur ' + sToday;
const sNomChargeur    = 'TEST_AUTO - Chargeur ' + sToday;
const sNomFournisseur = 'SETAM';
const sCommentaire    = 'TEST_AUTO - Commentaire et observations ' + sToday;
const sNumBl          = 'TA - NumBl' + maDate.getFullYear() + fonction.addZero(maDate.getMonth() + 1) + fonction.addZero(maDate.getDate());
const iNbEmballages   = 8;
const sHeureArrivee   = '01:01';
const sHeureDepart    = '02:02';

const plateforme      = fonction.getInitParam('plateforme','Cremcentre');

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

//----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

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
        
        var iNbPalettes       = 0  

        var currentPage = 'emballage';

        test('Page [EMBALLAGE] - Click', async () => {
            await menu.click(currentPage, page);  
        })
             
        test('Label [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);                     
        })

        test.describe('Onglet [MOUVEMENTS DES EMBALLAGES]', async () =>  {        
            
            test('Onglet [MOUVEMENTS DES EMBALLAGES] - Click', async () =>  {
                await menu.clickOnglet(currentPage, 'mouvementsEmballages', page);   
                await pageEmballage.labelNbTotalPalettes.waitFor();             
                var sNbPalettes = await pageEmballage.labelNbTotalPalettes.textContent();
                if (sNbPalettes && parseInt(sNbPalettes) != undefined){
                    iNbPalettes = parseInt(sNbPalettes);
                    log.set('Nombre de palettes avant ajout : ' + iNbPalettes); 
                }                     
            }) 

            test('Button [CREER UNE SORTIE D\'EMBALLAGE] - Click', async () =>  {
                await fonction.clickAndWait(pageEmballage.buttonCreerSortie, page, 40000);
            })

            var sNomPopin:string = "Créer une sortie d'emballage";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>  {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible - Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test('DatePeacker [SORTIE] = "' + sToday + '"', async () =>  {
                    await pageEmballage.pDatePickerSortie.click();                    
                    await pageEmballage.pTdTodayDateSortie.click();
                })

                test('Autocomplete [FOURNISSEUR] = "' + sNomFournisseur + '"', async () =>  {
                    var oData:AutoComplete = {
                        libelle         :'EXPEDITEUR',
                        inputLocator    : pageEmballage.pInputFournisseur,
                        inputValue      : sNomFournisseur,
                        choiceSelector  :'button.dropdown-item',
                        choicePosition  : 1,
                        typingDelay     : 100,
                        waitBefore      : 500,
                        page            : page,
                    };
                    await fonction.autoComplete(oData);
                })

                test('InputField [NUMERO DE BL] = "' + sNumBl + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pInputSortieNumBL, sNumBl);
                })
               
                test('InputField [CHAUFFEUR] = "' + sNomChauffeur + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pInputSortieChauffeur, sNomChauffeur);
                })
                
                test('InputField [TRANSPORTEUR] = "' + sNomTransp + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pInputSortieTransporteur, sNomTransp);
                })
                
                test('InputField [CHARGEUR] = "' + sNomChargeur + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pInputChargeur, sNomChargeur);
                })
                
                test('InputField [HEURE ARRIVEE] = "' + sHeureArrivee + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pInputSortieHeureArrivee,  sHeureArrivee, false);
                })
                
                test('InputField [HEURE DEPART] = "' + sHeureDepart + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pInputSortieHeureDepart, sHeureDepart, false);
                })
                
                test('InputField [OBSERVATIONS] = "' + sCommentaire + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pTextAreaSortieObservations, sCommentaire);
                })
               
                test('InputField [TYPE EMBALLAGE] = "' + iNbEmballages + '"', async () =>  {
                    await pageEmballage.pInputListeTypeEmbSortie.first().waitFor()
                    await fonction.sendKeys(pageEmballage.pInputListeTypeEmbSortie.first(), iNbEmballages.toString());
                })

                test('Button [ENREGISTRER] - Click', async () =>  {
                    await fonction.clickAndWait(pageEmballage.pButtonSortieEnregistrer, page);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible - Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, false, 30000);
                })
            })

            test('Label [TOTAL PALETTES] = "Nb Initial > Nb Final', async () =>  {
                const iTimetout:number = 90000;
				test.setTimeout(iTimetout);
                await expect(pageEmballage.spinnerMvtEmballage).not.toBeVisible({timeout:iTimetout});//-- Attente que le spinner disparaisse;
                await pageEmballage.labelNbTotalPalettes.waitFor();
                var sNbPalettes  = await pageEmballage.labelNbTotalPalettes.textContent();
                if (sNbPalettes && parseInt(sNbPalettes) != undefined){
                    log.set('Nombre de Palettes après ajout : ' + parseInt(sNbPalettes));
                    expect(parseInt(sNbPalettes)).toBeLessThan(iNbPalettes);      
                }    
            })

        })

    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})