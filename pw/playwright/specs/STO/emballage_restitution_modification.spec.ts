/**
 * 
 * @desc Modification d'un bon de restitution des emballages
 * 
 * @author JC CALVIERA
 *  Since 2024-01-16
 */

const xRefTest      = "STO_EMB_MBR";
const xDescription  = "Modification d'un bon de restitution des emballages";
const xIdTest       =  1563;
const xVersion      = '3.2';

var info = {
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

import { test, type Page}           from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                from "@pom/STO/menu.page";
import { EmballageRestitution }     from '@pom/STO/emballage-restitution.page';

//----------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuStock;
let pageEmballage   : EmballageRestitution;

const log           = new Log();
const fonction      = new TestFunctions(log);

//----------------------------------------------------------------------------------------

var maDate                 = new Date();
       
const sCommentaire         = 'TA_Observation-' + maDate.getFullYear() + fonction.addZero(maDate.getMonth() + 1) +  fonction.addZero(maDate.getDate()) + '_' +  fonction.addZero(maDate.getHours()) +  fonction.addZero(maDate.getMinutes())  + ' Modifié';
const sChauffeur           = 'TA_Nom Chauffeur Modifié';
const sTransporteur        = 'TA_Nom Transporteur Modifié';
const sChargeur            = 'TA_Nom Chargeur Modifié';
const sHeureStart          = '00:08';
const sHeureEnd            = fonction.addZero(maDate.getHours()) + ":" + fonction.addZero(maDate.getMinutes());    
const sNumCommande         = 'TA_Num Cmde ' + maDate.getFullYear() + fonction.addZero(maDate.getMonth() + 1) +  fonction.addZero(maDate.getDate());
const iNbEmballage:number  = 9;

const sPlateforme   = fonction.getInitParam('Plateforme', 'Chaponnay');

//------------------------------------------------------------------------------------   

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage(); 

    menu            = new MenuStock(page, fonction);
    pageEmballage   = new EmballageRestitution(page);
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    })

    test ('Ouverture URL', async() => {
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async() => {            
        await menu.selectPlateforrme(page, sPlateforme);                       // Sélection d'une plateforme par défaut
    })

    test.describe('Page [EMBALLAGE]', async () =>  {  

        var currentPage:string = 'emballage';

        test ('Page [EMBALLAGE] - Click', async () => {
            await menu.click(currentPage, page);  
        })
             
        test ('Label [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);                     
        })

        test.describe('Onglet [LIVRAISON]', async () =>  {        
            
            test ('Onglet [LIVRAISON] - Click', async () =>  {
                await menu.clickOnglet(currentPage, 'livraison', page);                                         
            })   

            test('Multiselect [STATUT] = "Créé"', async () => {
                await fonction.clickElement(pageEmballage.multiSelectStatut);
                await fonction.clickElement(pageEmballage.multiSelectStatutItem.locator('span:text-is("Créé")'));    // filtrer sur les bons de livraisons créés
            })

            test('Button [multiselect-close] - Click', async () => {
                await fonction.clickAndWait(pageEmballage.buttonStatMultiselectClose, page);
            })


            test ('Row [NUMERO DE COMMANDE][' + sNumCommande + '] - Click', async () =>  {
                await fonction.clickElement(pageEmballage.tdNumCommande.filter({hasText:sNumCommande}).nth(0));
            })

            test ('Button [MODIFIER UN BL] - Click', async () =>  {
                await fonction.clickAndWait(pageEmballage.buttonModifierUnBL, page);
            })

            var sNomPopin:string   = "Modification d'un bon de restitution";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>  {

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible -Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })   

                test ('InputField [CHAUFFEUR] = "' + sChauffeur + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pPinputChauffeurRestitut, sChauffeur, false, 'Chauffeur');
                })

                test ('InputField [TRANSPORTEUR] = "' + sTransporteur + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pPinputTransporteurRestitut, sTransporteur, false, 'Transporteur');
                })

                test ('InputField [CHARGEUR] = "' + sChargeur + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pPinputChargeurRestitut, sChargeur, false, 'Chargeur');
                })

                test ('InputField [HEURE ARRIVEE] = "' + sHeureStart + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pPinputHeureStartRestitut, sHeureStart, false, 'Heure Arrivée');
                })

                test ('InputField [HEURE DEPART] = "' + sHeureEnd + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pPinputHeureEndRestitut, sHeureEnd, false, 'Heure Départ');
                })

                test ('InputField [OBSERVATIONS] = "' + sCommentaire + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pPtextAreaObsRestitut, sCommentaire, false, 'Observation');
                })

                test ('InputField [QUANTITE EMBALLAGE] = "' + iNbEmballage + '"', async () => {
                    var iNbTypesEmballages = await pageEmballage.pPinputQantitesRestitut.count(); 
                    var rnd = Math.floor(fonction.random() * iNbTypesEmballages - 1);
                    var sTypeEmballage = await pageEmballage.pPlabelTypeEmbRestitut.nth(rnd).textContent();
                    log.set('Emballage : ' + sTypeEmballage + ' | Quantité : ' + iNbEmballage);
                    await fonction.sendKeys(pageEmballage.pPinputQantitesRestitut.nth(rnd), iNbEmballage, false, 'Qté Emballage');
                })

                test ('Button [ENREGISTRER] - Click', async () =>  {
                    await fonction.noHtmlInNewTab(page, pageEmballage.pPbuttonEnregistrerRestitut);
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is NOT Visible -Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                }) 

            })

        })  //-- End Describe Onglet  

    })  //-- End Describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})