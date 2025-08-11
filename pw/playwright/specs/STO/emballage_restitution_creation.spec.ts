/**
 * 
 * @desc Création d'un bon de restitution des emballages
 * 
 * @author JC CALVIERA
 *  Since 2024-01-16
 */

const xRefTest      = "STO_EMB_CBR";
const xDescription  = "Création d'un bon de restitution des emballages";
const xIdTest       =  1561;
const xVersion      = '3.3';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme', 'destinataire'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page }          from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from "@helpers/helpers";

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                from "@pom/STO/menu.page";
import { EmballageRestitution }     from "@pom/STO/emballage-restitution.page";

import { CartoucheInfo }            from '@commun/types';

//----------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuStock;
let pageEmballage   : EmballageRestitution;

const log           = new Log();
const fonction      = new TestFunctions(log);

//----------------------------------------------------------------------------------------

var maDate          = new Date();

const sCommentaire  = 'TA_Observation-' + maDate.getFullYear() + fonction.addZero(maDate.getMonth() + 1) +  fonction.addZero(maDate.getDate()) + '_' +  fonction.addZero(maDate.getHours()) +  fonction.addZero(maDate.getMinutes()) + ' ... ';
const sChauffeur    = 'TA_Nom Chauffeur';
const sTransporteur = 'TA_Nom Transporteur';
const sChargeur     = 'TA_Nom Chargeur';
const sHeureStart   = '00:00';
const sHeureEnd     = fonction.addZero(maDate.getHours()) + ":" + fonction.addZero(maDate.getMinutes());    
const sNumCommande  = 'TA_Num Cmde ' + maDate.getFullYear() + fonction.addZero(maDate.getMonth() + 1) +  fonction.addZero(maDate.getDate());
const iNbEmballage  = 8;

const sPlateforme   = fonction.getInitParam('plateforme', 'Chaponnay');
const sDestinataire = fonction.getInitParam('destinataire', 'Hollande');

//------------------------------------------------------------------------------------   

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 

    menu            = new MenuStock(page, fonction);
    pageEmballage   = new EmballageRestitution(page);
            const helper = new Help(info, testInfo, page);
        await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async() => {            
        await menu.selectPlateforrme(page, sPlateforme);                       // Sélection d'une plateforme par défaut
    })

    test.describe ('Page [EMBALLAGE]', async () =>  {  

        var currentPage = 'emballage';

        test ('Page [EMBALLAGE] - Click', async () => {
            await menu.click(currentPage, page);  
        })
             
        test ('Label [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);                     
        })

        test.describe ('Onglet [LIVRAISON]', async () =>  {        
            
            test ('Onglet [LIVRAISON] - Click', async () =>  {
                await menu.clickOnglet(currentPage, 'livraison', page);                                         
            })   
      
            test ('Button [CREER UN BL] - Click', async () =>  {
                await fonction.clickAndWait(pageEmballage.buttonCreerUnBL, page, 40000);
            })

            var sNomPopin   = "Création d'un bon de restitution";
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

                test ('InputField [NUMERO DE COMMANDE] =', async () => {
                    await fonction.sendKeys( pageEmballage.pPinputNumCommandeRestitut, sNumCommande, false, 'Numéro de commande');
                })

                test ('InputField [CHARGEUR] = "' + sChargeur + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pPinputChargeurRestitut, sChargeur, false, 'Chargeur');
                })

                test ('InputField [HEURE ARRIVEE] = "Heure de début Dynamique"', async () => {
                    await fonction.sendKeys(pageEmballage.pPinputHeureStartRestitut, sHeureStart, false, 'Heure Arrivée');
                    log.set('Heure d\'arrivée : ' + sHeureStart);
                })

                test ('InputField [HEURE DEPART] = "Heure de fin Dynamique"', async () => {
                    await fonction.sendKeys(pageEmballage.pPinputHeureEndRestitut, sHeureEnd, false, 'Heure Départ');
                    log.set('Heure de départ : ' + sHeureEnd);
                })

                test ('InputField [OBSERVATIONS] = "Commentaire Dynamique"', async () => {
                    await fonction.sendKeys(pageEmballage.pPtextAreaObsRestitut, sCommentaire, false, 'Observation');
                    log.set('Commentaire : ' + sCommentaire);
                })

                test ('ListBox [DESTINATAIRE] = "' + sDestinataire + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pPinputDestinataireRestitut, sDestinataire, false, 'Destinataire');
                    await fonction.clickElement(pageEmballage.pPListeDestiRestitut.nth(0));
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