/**
 * @author  Josias SIE
 * @since   27-10-2023
 * 
 */
const xRefTest      = "STO_LIV_PAR";  
const xDescription  = "Réceptionner une livraison partielle";
const xIdTest       =  1721;
const xVersion      = '3.9'; 
  
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],        
    params      : ['plateFormeReception','referenceBl','quantite', 'emplacement','quantiteRecu','arriere','milieu','fond','numAchatCourt'],
    fileName    : __filename
}; 
   
//------------------------------------------------------------------------------------

import { test, type Page, expect }     from '@playwright/test';

import { Help }                        from '@helpers/helpers';
import { TestFunctions }               from '@helpers/functions';
import { Log }                         from '@helpers/log';

import { CartoucheInfo }               from '@commun/types';
//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                   from '@pom/STO/menu.page'; 
import { ReceptionLivraisonPartielle } from '@pom/STO/reception-livraison_partielle.page.js';
import { ReceptionAttendue }           from '@pom/STO/reception-attendue.page';

//------------------------------------------------------------------------------------

let page                  : Page;
let menu                  : MenuStock;
let pageReception         : ReceptionLivraisonPartielle;
let pageReceptionAttendue : ReceptionAttendue;
const log                 = new Log();
const fonction            = new TestFunctions(log);

// Varibles ---- ---------------------------------------------------------------------

var oData:any             = fonction.importJdd();        // Récupération du JDD et des données du E2E en cours si ils existent

// Exploitation des paramètres passés dans le JDD E2E -OU- passés en argument OU ceux présents dans le fichier de configuration Local
const sPlateforme         = fonction.getInitParam('plateformeReception', 'Chaponnay');
const sQuantite           = fonction.getInitParam('quantite','0');
const sEmplacement        = fonction.getInitParam('emplacement','0');
const iQuantiteRecu       = fonction.getInitParam('quantiteRecu', '90');
const sArriere            = fonction.getInitParam('arriere','7');
const sMilieu             = fonction.getInitParam('milieu','7');
const sFond               = fonction.getInitParam('fond','7');
var sNumeroAchatCourt     = fonction.getInitParam('numAchatCourt', '9754');
var sReferenceBl          = fonction.getInitParam('referenceBl', 'TA_BL ' + fonction.getToday('FR') + ' ' + fonction.getBadChars());  

//------------------------------------------------------------------------------------

const sHeureDechargement  = fonction.getHeure();
const sDateDlc            = fonction.getDLC();

//------------------------------------------------------------------------------------    

if (oData !== undefined) {                              // On est dans le cadre d'un E2E. Récupération des données temporaires
    var sNumAchatE2E      = oData.sNumAchat || oData.sNumAchatLong;           // L'élément recherché est le numéro d'achat préalablement créé dans le E2E
    sNumeroAchatCourt     = sNumAchatE2E.substring(sNumAchatE2E.length - 4);  // Récupération des quatre derniers caractères du numero d'achat  
    sReferenceBl          = oData.sBonLivraison;
    
    log.set('E2E - Numéro Bl : ' + sReferenceBl);
    log.set('E2E - Numéro d\'achat court : ' + sNumeroAchatCourt);  
}

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
     page                  = await browser.newPage();
     menu                  = new MenuStock(page, fonction);
     pageReception         = new ReceptionLivraisonPartielle(page); 
     pageReceptionAttendue = new ReceptionAttendue(page);
     const helper    = new Help(info, testInfo, page);
     await helper.init();
});

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
}) 
//------------------------------------------------------------------------------------
test.describe.serial('[' + xRefTest + ']', async () => {  

    test('Ouverture URL: ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [RECEPTION]', async () => {

        var sNomPage = 'reception';
        test ('Page [RECEPTION] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 

        test.describe('Onglet [LIVRAISONS ATTENDUES]', async () => {

            test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {                    
                await menu.selectPlateforrme(page, sPlateforme);
            })
            
            test.skip ('Sort [CONFIRMEE] - Click X 2', async () => {
                await fonction.clickElement(pageReceptionAttendue.thConfirmee);
                await fonction.clickElement(pageReceptionAttendue.thConfirmee);
            })

            if (sReferenceBl != null) {                                                          // Cas filtre sur un numero de BL (paramètre ou E2E), transporteur, N° achat ou fournisseur
                test ('Input [SEARCH] = "'+  sReferenceBl + '"', async () => {
                    await fonction.sendKeys(pageReceptionAttendue.inputFilter, sReferenceBl, false, 'Reference bl');
                    await fonction.wait(page,250);// Attendre l'application effective du filtre;
                })
            }

            test ('CheckBox [LIVRAISONS ATTENDUES][0] - Click', async () => {
                await fonction.clickElement(pageReceptionAttendue.listLivattendueNachat.locator(`span:has-text("${sNumeroAchatCourt}")`)); // Sélection de la ligne de livraison attendue
            })

            test('Button [RECEPTIONNER] - Click', async () => {
                await fonction.clickElement(pageReception.buttonReceptionner);
            })

            test.describe('Popin [RECEPTION ATTENDUE] ', () => {

                test('Button [TERMINER] - Click', async () => {
                    await fonction.clickAndWait(pageReception.pButtonTerminer, page);
                })

                test.describe('Onglet [INFORMATIONS GENERALES] ', async () => {
                   
                    test('ListBox, input and textArea [Is - visible] - check', async () => { 
                        await fonction.isDisplayed(pageReception.pInputHeureArrivee);
                        await fonction.isDisplayed(pageReception.pListBoxTransporteur);
                        await fonction.isDisplayed(pageReception.pListBoxQuaiAffecte);
                        await fonction.isDisplayed(pageReception.pListBoxReceptionnaire1);
                        await fonction.isDisplayed(pageReception.pListBoxReceptionnaire2);
                        await fonction.isDisplayed(pageReception.pInputReferenceBl);
                        await fonction.isDisplayed(pageReception.pInputHeureDebutDechargement);
                        await fonction.isDisplayed(pageReception.pTextAreaCommentaire);
                    })
                    
                    test('ListBox [QUAI AFFECTE] - click', async () => { 
                        await fonction.clickElement(pageReception.pListBoxQuaiAffecte);
                        const bVisible:boolean = await pageReception.pListBoxItemQuaiAffecte.nth(0).isVisible();
                        if(bVisible) {
                            await fonction.clickElement(pageReception.pListBoxItemQuaiAffecte.nth(0));
                        }
                    }) 
    
                    test('ListBox [RECEPTIONNAIRE 1] - click', async () => {  
                        await fonction.clickElement(pageReception.pListBoxReceptionnaire1);
                        await fonction.clickElement(pageReception.pListBoxItemReceptionnaire1);                       
                    })
    
                    test('Input [REFERENCE BL] = ' + sReferenceBl , async () => {
                        await fonction.sendKeys(pageReception.pInputReferenceBl, sReferenceBl, false, 'Reference bl'); 
                    })

                    test('Input [HEURE DE DECHARGEMENT]', async () => {
                        await fonction.sendKeys(pageReception.pInputHeureDebutDechargement, sHeureDechargement, false, 'Heure dechargement'); 
                    }) 

                    test('Input [ARRIERE]', async () => {
                        await fonction.sendKeys(pageReception.pPInputArriere, sArriere, false, 'Temperature arriere'); 
                    })

                    test('Input [MILIEU]', async () => {
                        await fonction.sendKeys(pageReception.pPInputMilieu, sMilieu, false, 'Temperature milieu'); 
                    })

                    test('Input [FOND]', async () => {
                        await fonction.sendKeys(pageReception.pPInputFond, sFond, false, 'Temperature fond'); 
                    })

                    test('Input [COMPTAGE PALETTES] [QUANTITE] = '+ sQuantite, async () => { 
                        await fonction.sendKeys(pageReception.pInputQuantite.first(), sQuantite, false, 'Quantite receptionnee'); 
                    })
                })
    
                test.describe ('Onglet [PALETTES FOURNISSEURS] ', async () => { 
                                            
                    test('TabView [PALETTES FOURNISSEURS] - Click ', async () => {  
                        await fonction.clickAndWait(pageReception.pOngletPaletteFournisseur.nth(1), page);
                    }) 
    
                    test('CheckBox [TOUT][SAISIE EN MAX] - Click ', async () => {                                 
                        await fonction.clickElement(pageReception.pCheckBoxSaisieEnMax);
                    })
    
                    test('Input [DLC]', async () => {
                        const isActive = await pageReception.pInputDLC.isEnabled();
                        if(isActive){
                            await fonction.sendKeys(pageReception.pInputDLC, sDateDlc, false, 'Dlc');
                        }else{
                            log.set('Pas de DLC enregistrée');
                        }
                    })

                    test('Input [EMPLACEMENT] = ' + sEmplacement , async () => { 
                        await fonction.sendKeys(pageReception.pInputEmplacementGlobal, sEmplacement, false, 'Emplacement');
                        await fonction.clickElement(pageReception.pInputItemEmplacementGlobal); 
                    }) 

                    test('Button [APPLIQUER] - Click', async () => {  
                        await fonction.clickElement(pageReception.pButtonAppliquer); 
                    })

                    test('Input [QUANTITE RECUE] = ' + iQuantiteRecu , async () => {
                        await pageReception.pInputQuantiteRecu.first().waitFor({state:'visible'}); // Attendez que le premier élément soit visible
                        if(pageReception.pInputQuantiteRecu.first() != undefined){
                            const iNbChoix = await pageReception.pInputQuantiteRecu.count();
                            var iCible = 0;
                            while(iCible < iNbChoix){

                                if (iCible == 0) {    
                                    await fonction.sendKeys(pageReception.pInputQuantiteRecu.nth(0), iQuantiteRecu, false, 'Quante recue');            
                                }else{
                                    await fonction.sendKeys(pageReception.pInputQuantiteRecu.nth(iCible), '0', false, 'Quante recue');
                                }
                                iCible = iCible + 1;
                            }
                        }                       
                    })
                })
    
                test.describe('TERMINER', () => {

                    test('Button [TERMINER] - Click', async () => {
                        await fonction.clickElement(pageReception.pButtonTerminer);
                    })

                    test('Button [TERMINER LA RECEPTION] - Click', async () => {
                        await pageReception.pPopupTerminerReception.waitFor({state:'visible'}); // Attendez que l'élément soit visible
                        if(pageReception.pPopupTerminerReception != undefined){
                            await fonction.clickElement(pageReception.pPbuttonRadioConformeBL.nth(1));
                            await fonction.clickElement(pageReception.pPbuttonTerminer);
                        }
                    })

                })

            })

        })
 
        test.describe('Onglet [RECEPTIONS TERMINEES]', async () => {

            test('TabView [RECEPTIONS TERMINEES] - Click ', async () => {
                await fonction.clickAndWait(pageReception.ongletReceptionTerminer, page);
            }) 

            test('Input [NUMERO D\'ACHAT] [RECHERCHER] = '+ sNumeroAchatCourt, async () => {
                if(sNumeroAchatCourt){
                    await pageReception.inputNumeroAchatReceptionTerminees.pressSequentially(sNumeroAchatCourt); 
                    await fonction.wait(page, 800);
                }
            })

            test('Tr [LIVRAISON] - Select', async () => {
                await fonction.clickElement(pageReception.dataGridReception.last());
            })

            test('Td [STATUT] [RECEPTION ACHAT] [INCOMPLETE] - Check', async () => {
                const statut = await pageReception.spanStatutReceptionAchat.textContent();
                expect(statut).toContain('Incomplète');
            })

            test('Button [DECLARER NOUVELLE RECEPTION] - Click', async () => {
                await fonction.clickAndWait(pageReception.buttonDeclarerNouvelleReception, page);
                const statut = await pageReception.spanStatutReceptionAchat.textContent();
                expect(statut).toContain('Partielle');
            })

        })

    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
}) 