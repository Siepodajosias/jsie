/**
 * 
 * @author SIAKA KONE
 *  Since 2024-10-28
 * 
 */

const xRefTest      = "STO_REC_LIV";
const xDescription  = "Réceptionner une livraison pour un rayon/gpe article";
const xIdTest       =  4472;
const xVersion      = '3.3';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateformeReception', 'search', 'groupeArticle', 'controlPoids'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}        from '@playwright/test';

import { TestFunctions }                 from "@helpers/functions";
import { Log }                           from "@helpers/log";
import { Help }                          from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                     from '@pom/STO/menu.page';
import { ReceptionAttendue }             from '@pom/STO/reception-attendue.page';
import { ReceptionTermine }              from '@pom/STO/reception-terminee.page';

import { CartoucheInfo } 	             from '@commun/types/index.js';

//----------------------------------------------------------------------------------------

let page             : Page;

let menu             : MenuStock;
let pageRecepAttdu   : ReceptionAttendue;
let pageReceptermne  : ReceptionTermine;

const log            = new Log();
const fonction       = new TestFunctions(log);

var oData            = fonction.importJdd();             // Récupération du JDD et des données du E2E en cours si ils existent

// Exploitation des paramètres passés dans le JDD E2E -OU- passés en argument -OU- ceux présents dans le fichier de configuration Local
var sPlateforme      = fonction.getInitParam('plateformeReception','Chaponnay');
var sInputSearch     = fonction.getInitParam('search');  
const sGpeArticle    = fonction.getInitParam('groupeArticle','Fruits et légumes');
const bCtrlpoids     = fonction.getInitParam('controlPoids','non'); 
 
//------------------------------------------------------------------------------------
// NOTE RAF
// gérer le cas de non conformité au BL (dans un autre TA) : quantités recues différentes de celles attendues
//
//
// Controle du poids seulement pour Frais LS et Coupe Corner sur Cremlog et Cremcentre, lorsque ctrlPoids = oui
//------------------------------------------------------------------------------------

// Relevé de température camion
const iTempArr = 3;
const iTempMil = 2;
const iTempFon = 1;

// Création d'une référence de BL fictif pour faciliter sa tracibilité
var maDate           = new Date();
var sRefBL           = 'TA_BL-' +  fonction.getToday();
var sRefBL2          = 'TA_BL2-' +  fonction.getToday();
var aTraca2          = ['Coupe / Corner', 'IT - Coupe / Corner', 'Frais LS', 'Négoce', 'Traiteur de la mer', 'Boucherie', 'Charcuterie', 'Traiteur BC'];
//------------------------------------------------------------------------------------    

if (oData !== undefined) {                          // On est dans le cadre d'un E2E. Récupération des données temporaires
    sInputSearch = oData.sBonLivraison;              // L'élément recherché est le numéro de BL préalablement créé dans le E2E
    log.set('Numéro de BL : ' + sInputSearch);
    sRefBL = sInputSearch;                            // On connait le numéro de BL qui doit être suivi
}

// Initialisation de la tracabilité des articles = attribution d'un niveau de tracabilité par groupe article :
// * Pas de tracabilité     : IT - Frais LS, IT - Fraîche découpe, Fraîche découpe, Fruits et légumes, Consommable, Matériel informatique, Sac
// * 01                     : IT - Traiteur DM
// * 02                     : Coupe / Corner, IT - Coupe / Corner, Frais LS, Négoce, Traiteur de la mer, Boucherie, Charcuterie, Traiteur BC
// * 03                     : Marée
// * 04                     : IT - Négoce

log.set('Réception sans transit sur '+ sPlateforme);
log.set('Groupe article = ' + sGpeArticle);

var iTraca = 0;

if(aTraca2.indexOf(sGpeArticle) != -1){
    iTraca = 2;
}else if (sGpeArticle ==  'Marée') {
    iTraca = 3;
} else if (sGpeArticle ==  'Macelleria') { 
    iTraca = 4;
}else if (sGpeArticle ==  'Epicerie') { 
    iTraca = 1;
}else {
    log.set('Pas de tracabilité sur les articles');
}

var dtUnAn            = new Date(maDate.setDate(maDate.getDate() + 365));
var dtUnAnUnJour      = new Date(maDate.setDate(maDate.getDate() + 366));
const dateDLC1   = fonction.addZero(dtUnAn.getDate()).toString() + fonction.addZero(dtUnAn.getMonth() + 1).toString() + dtUnAn.getFullYear().toString().substr(-2);
const dateDLC2   = fonction.addZero(dtUnAnUnJour.getDate()).toString() + fonction.addZero(dtUnAnUnJour.getMonth() + 1).toString() + dtUnAnUnJour.getFullYear().toString().substr(-2);
const iPoidsInit = 1;

var oPds = {
    iPds       : 0,
}

//------------------------------------------------------------------------------------    
var setPoids = async (index:number, iPoids:number) => {       
    
    if (pageRecepAttdu.inputPoidsTotal.nth(index).isEnabled()) {

        await fonction.sendKeys(pageRecepAttdu.inputPoidsTotal.nth(index), iPoids, false, 'Poids total');
        oPds.iPds = iPoids;
                                        
        for(let iCpt=0; iCpt<500; iCpt++) {
            if( await pageRecepAttdu.inputAlertPoids.isVisible()) {
                iPoids = iPoids + 10;
                await fonction.sendKeys(pageRecepAttdu.inputPoidsTotal.nth(index), iPoids, false, 'Poids total');
            } else {
                iCpt=500;
                oPds.iPds = iPoids;
            }
        }

        var sDescription:string = await pageRecepAttdu.dataLibArticle.nth(index).textContent();
        log.set('Pour article ' + sDescription + ' le poids saisi est : '+oPds.iPds +' kg')
    }
}

//------------------------------------------------------------------------------------    

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage(); 
    menu                = new MenuStock(page, fonction);
    pageRecepAttdu      = new ReceptionAttendue(page);
    pageReceptermne     = new ReceptionTermine(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})
                          
test.describe.serial ('[' + xRefTest + ']', () => {  

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [RECEPTION]', async () => {

        test ('Page [RECEPTION] -Click', async () => {
            await menu.click('reception', page);
        })

        test.describe ('Onglet [LIVRAISONS ATTENDUES]', async () => {

            sPlateforme = sPlateforme.charAt(0).toUpperCase() + sPlateforme.slice(1).toLowerCase();
            test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {                    
                await menu.selectPlateforrme(page, sPlateforme);
            })

            const sModeRoutage:string = "Direct fournisseur";
            test ('ListBox [ROUTAGE] = "' + sModeRoutage+ '"', async () =>{                                         // Cas sans transit, réception direct frn sur ptf distrib
                await fonction.selectListBoxByLabel(pageRecepAttdu.listBoxRoutage, sModeRoutage, page);                               
            })

            test ('CheckBox [TTES LES LIVRAISONS] - Click', async () => {                
                await fonction.clickElement(pageRecepAttdu.checkBoxAffToutesLivr);
            })

            test ('Sort [CONFIRMEE] - Click X 2', async () => {
                await fonction.clickElement(pageRecepAttdu.thConfirmee);
                await fonction.clickElement(pageRecepAttdu.thConfirmee);
            })

            if (sInputSearch != null) {                                                                          // Cas filtre sur un numero de BL (paramètre ou E2E), transporteur, N° achat ou fournisseur
                test ('Input [SEARCH] = "'+  sInputSearch + '"', async () => {
                    await fonction.sendKeys(pageRecepAttdu.inputFilter, sInputSearch, false, 'Référence BL');
                    await fonction.wait(page, 250);//Attendre l'application effective du filtre;
                })
            }

            test ('CheckBox [LIVRAISONS ATTENDUES][0] - Click', async () => {
                await fonction.clickElement(pageRecepAttdu.listLivAttendues.first());
            })

            test ('Button [RECEPTIONNER] - Click', async () => {
                await fonction.clickAndWait(pageRecepAttdu.buttonReceptionner, page);
            })

            test.describe('Popin [RECEPTION (ATTENDUE)]', async () => {

                test ('Popin [RECEPTION (ATTENDUE)] - Is Visible', async () => {
                    await fonction.popinVisible(page, 'RECEPTION (ATTENDUE)', true);
                })

                test ('Label[ERREUR] - Is NOT Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);
                })

                test ('Button [TERMINER] - Click', async () => {                                                  // Check on ne peut pas terminer, il reste des champs obligatoires
                    await fonction.clickAndWait(pageRecepAttdu.buttonTerminer, page);
                })
                
                if (oData !== undefined) {                                                                      // On est dans le cadre d'un E2E. Le numéro de BL est celui du JDD
                    log.set('Numéro de BL : ' + sInputSearch);                                                   // Check le numéro de BL est déjà renseigné
                }
                else {                                                                          
                    test ('InputField [REFERENCE BL] = "' + sRefBL + '"', async () => {                            // Numero de BL obligatoire
                        await fonction.sendKeys(pageRecepAttdu.pInputRecepReferenceBL, sRefBL, false, 'Référence BL');// inputFilter
                        log.set('Numéro de BL : ' + sRefBL);
                    })
                }

                test ('ListBox [QUAI AFFECTE] - Select', async () => {
                    // await fonction.ngClickRndListChoice(pageRecepAttdu.pListBoxRecepQuai);
                    await pageRecepAttdu.selectQuaiAffecte();                                                              // Quai obligatoire
                }) 

                test ('ListBox [RECEPTIONNAIRE] - Select', async () => {
                    await pageRecepAttdu.selectReceptionnaire(pageRecepAttdu.pListBoxRecepReceptionnaire1, pageRecepAttdu.pListBoxItemReceptionnaire1);                                                           // Receptionnaire obligatoire);                                                           // Receptionnaire obligatoire
                })

                test ('InputField [TEMPERATURE ARRIERE] - Select', async () => {
                    await fonction.sendKeys(pageRecepAttdu.inputTempArriere, iTempArr, false, 'Temperature arriere');                                                           
                })

                test ('InputField [TEMPERATURE MILIEU] - Select', async () => {
                    await fonction.sendKeys(pageRecepAttdu.inputTempMilieu, iTempMil, false, 'Temperature milieu');                                                           
                })

                test ('InputField [TEMPERATURE FOND] - Select', async () => {
                    await fonction.sendKeys(pageRecepAttdu.inputTempFond, iTempFon, false, 'Temperature fond');                                                           
                })
                                
                test.describe ('Partie [COMPTAGE PALETTES]', async () => {

                    test ('Pictogramme [ + ] - Click', async () => {
                        await fonction.clickElement(pageRecepAttdu.PictoPlusComptage);                                                                 
                    })

                    test('InputField [QUANTITE EMBALLAGE] = "' + 1 + '"', async () => {
                        await fonction.sendKeys(pageRecepAttdu.InputQuantiteEmballage.nth(0), 1, false, 'Quantite emballage');
                    })
                })

                test ('Onglet [PALETTES FOURNISSEURS] - click', async () => {
                    await fonction.clickElement(pageRecepAttdu.ongletPalettesFourn);
                })

                test.describe ('Partie [SAISIE EN MASSE]', async () => {

                    test ('CheckBox [TOUTES LES LIV] - Click', async () => {
                        await fonction.clickElement(pageRecepAttdu.checkBoxAllRecep);
                    })
                    
                    test ('InputField [EMPLACEMENT] - Set', async () => {                                          // Emplacements obligatoires
                        await pageRecepAttdu.setEmplacements();
                    })

                    test('Button [PB] - Click', async () => { //Si on doit choisir la validation d'emballage;
                        if(await pageRecepAttdu.buttonMassePB.isVisible()) {
                            await fonction.clickElement(pageRecepAttdu.buttonMassePB);
                        }
                    })

                    test.describe ('Check [TRACABILITE][SET1] = 0'+ iTraca, async () => {
                        
                        if (iTraca == 0) {                                                                      // Pas de tracabilité
                            test ('Check [DLC] - non saisissable ', async () => {
                                expect(await pageRecepAttdu.inputDlcPasOblig.nth(0).isEnabled()).toBe(false);              // Check la DLC n'est pas obligatoire et non saisissable      
                            })
                            
                            test ('Check [LOT] - non saisissable ', async () => { 
                                expect(await pageRecepAttdu.inputLotPasOblig.nth(0).isEnabled()).toBe(false);              // Check le lot n'est pas obligatoire et non saisissable     
                            })
                        }

                        if (iTraca == 1) {                                                                      // Niveau tracabilité = 01
                            test ('Check [DLC] - non saisissable ', async () => {
                                expect(await pageRecepAttdu.inputDlcPasOblig.nth(0).isEnabled()).toBe(false);              // Check la DLC n'est pas obligatoire et non saisissable      
                            })
                            
                            test ('Check [LOT] - non saisissable ', async () => { 
                                expect(await pageRecepAttdu.inputLotPasOblig.nth(0).isEnabled()).toBe(false);              // Check le lot n'est pas obligatoire et non saisissable     
                            })
                        }

                        if (iTraca == 2) {                                                                      // Niveau tracabilité = 02
                            test ('InputField [DLC1] - obligatoire - Set = '+ dateDLC1, async () => {
                                expect(await pageRecepAttdu.inputDlcOblig.nth(0).isEnabled()).toBe(true);                  // Check la DLC est obligatoire et saisissable
                                await fonction.sendKeys(pageRecepAttdu.inputDlc, dateDLC1, false, 'DLC 1');
                            })
                            
                            test ('InputField [LOT1] - facultatif - Set = '+ sRefBL, async () => { 
                                expect(await pageRecepAttdu.inputLotPasOblig.nth(0).isEnabled()).toBe(true);               // Check le lot n'est pas obligatoire mais saisissable 
                                await fonction.sendKeys(pageRecepAttdu.inputLotPasOblig, sRefBL, false, 'Référence BL');
                            })
                        }

                        if (iTraca == 3) {                                                                      // Niveau tracabilité = 03
                            test ('InputField [DLC1] - obligatoire - Set = '+ dateDLC1, async () => {
                                expect(await pageRecepAttdu.inputDlcOblig.nth(0).isEnabled()).toBe(true);                  // Check la DLC est obligatoire et saisissable
                                await fonction.sendKeys(pageRecepAttdu.inputDlc, dateDLC1, false, 'Référence BL');
                            })
                            
                            test ('InputField [LOT1] - facultatif - Set = '+ sRefBL, async () => { 
                                expect(await pageRecepAttdu.inputLotPasOblig.nth(0).isEnabled()).toBe(true);               // Check le lot n'est pas obligatoire mais saisissable 
                                await fonction.sendKeys(pageRecepAttdu.inputLotPasOblig, sRefBL, false, 'Référence BL');
                            })
                        }

                        if (iTraca == 4) {                                                                      // Niveau tracabilité = 04
                            test ('InputField [DLC1] - obligatoire - Set = '+ dateDLC1, async () => {
                                expect(await pageRecepAttdu.inputDlcOblig.nth(0).isEnabled()).toBe(true);                  // Check la DLC est obligatoire et saisissable
                                await fonction.sendKeys(pageRecepAttdu.inputDlc, dateDLC1, false, 'Référence BL');
                            })

                            test ('InputField [LOT1] - obligatoire - Set = '+ sRefBL, async () => { 
                                expect(await pageRecepAttdu.inputLotOblig.nth(0).isEnabled()).toBe(true);                  // Check le lot est obligatoire et saisissable 
                                await fonction.sendKeys(pageRecepAttdu.inputLotOblig, sRefBL, false, 'Référence BL');
                            })
                        }
                    })
                    
                    test ('Button [APPLIQUER A TOUS][SET1] - Click', async () => {
                        await fonction.clickAndWait(pageRecepAttdu.buttonAppliquerMasse, page);
                    })

                    test.describe ('Check [TRACABILITE][SET2] = 0'+ iTraca, async () => {
                        
                        if (iTraca == 2) {                                                                      // Niveau tracabilité = 02   
                            test ('InputField [DLC2] - Set = '+ dateDLC2, async () => {                            // Check saisie possible d'une 2eme DLC
                                expect(await pageRecepAttdu.inputDlcOblig.nth(0).isEnabled()).toBe(true);                  // Check la 2eme DLC est saisissable
                                await fonction.sendKeys(pageRecepAttdu.inputDlc, dateDLC2, false, 'Date DLC2');
                            }) 
                            
                            test ('InputField [LOT2] - facultatif - Set = '+ sRefBL2, async () => { 
                                expect(await pageRecepAttdu.inputLotPasOblig.nth(0).isEnabled()).toBe(true);               // Check le 2eme lot n'est pas obligatoire mais saisissable 
                                await fonction.sendKeys(pageRecepAttdu.inputLotPasOblig, sRefBL2, false, 'Référence BL2');
                            })
                        }

                        if (iTraca == 3) {                                                                      // Niveau tracabilité = 03
                            test ('Check [DLC2] - non saisissable ', async () => {
                                expect(await pageRecepAttdu.inputDlcOblig.nth(0).isEnabled()).toBe(false);                 // Check la 2eme DLC est non saisissable
                            })

                            test ('InputField [LOT2] - facultatif - Set = '+ sRefBL2, async () => { 
                                expect(await pageRecepAttdu.inputLotPasOblig.nth(0).isEnabled()).toBe(true);               // Check le 2eme lot n'est pas obligatoire mais saisissable 
                                await fonction.sendKeys(pageRecepAttdu.inputLotPasOblig, sRefBL2, false, 'Référence BL2');
                            })
                        }

                        if (iTraca == 4) {                                                                      // Niveau tracabilité = 04
                            test ('Check [DLC2] - non saisissable ', async () => {
                                expect(await pageRecepAttdu.inputDlcOblig.nth(0).isEnabled()).toBe(false);                 // Check la 2eme DLC est non saisissable
                            })

                            test ('Check [LOT2] - non saisissable ', async () => { 
                                expect(await pageRecepAttdu.inputLotOblig.nth(0).isEnabled()).toBe(false);                 // Check le 2eme lot n'est pas saisissable 
                            })
                        } 
                    })
                    
                    if ((iTraca == 2) || (iTraca == 3)) { 
                        
                        test ('Button [APPLIQUER A TOUS][SET2] - Click', async () => {
                            await fonction.clickAndWait(pageRecepAttdu.buttonAppliquerMasse, page);
                        })
                    }

                    if ((sPlateforme == 'Cremlog') ||  (sPlateforme == 'Cremcentre')) {                       // Sur ces plateformes la saisie du poids est obligatoire (pour tous les groupes articles gérés par la plateforme)
                        log.set('Controle de la saisie des poids = ' + bCtrlpoids);
                        test.describe ('Check [POIDS][PLATEFORME] = '+ sPlateforme, async () => {
                            
                            if (bCtrlpoids == 'oui') {                                                          // Tous les articles à réceptionner sont gérés au poids

                                test ('Check [POIDS][ALL] - obligatoire - Set pds mini ', async () => {            // Le poids est obligatoire pour tous les articles
                                    var iNbreElmt:number = await pageRecepAttdu.inputPoidsTotal.count();
                                    for(let elt = 0; elt <iNbreElmt; elt++){
                                        await fonction.isDisplayed(pageRecepAttdu.inputPoidsOblig.nth(elt));
                                        await setPoids(elt, iPoidsInit);   
                                    }
                                })
                            
                            }
                            else {                                                                              // On ne sait pas quels articles sont gérés au poids
                                          
                                test ('InputField [POIDS] - Set pds mini si obligatoire ', async () => {           // On saisit un poids dans les champs saisissables sans controle
                                    
                                    var iNbreElmt:number = await pageRecepAttdu.inputPoidsTotal.count();
                                    for( let elt = 0; elt < iNbreElmt; elt ++) {
                                        await setPoids(elt,iPoidsInit);
                                    }
                                })
                                
                            } 
                        })  
                    }
                })
                
                test ('Button [TERMINER] #1 - Click', async () => {
                    await fonction.clickAndWait(pageRecepAttdu.buttonTerminer, page);
                })

                test ('Button [CONFIRMER TERMINER SANS ETIQUETTE] - Click', async () => {
                    await fonction.clickAndWait(pageRecepAttdu.buttonConfTerminer, page);
                })

                test ('Popin [RECEPTION (ATTENDUE)] - Is Not Visible - Check', async () => {
                    await fonction.popinVisible(page, 'RECEPTION (ATTENDUE)', false);
                })

            }) // end test.describe Popin           
                    
        }) // end test.describe Onglet


        test.describe ('Onglet [RECEPTIONS TERMINEES]', async () => {
            
            test ('Onglet [RECEPTIONS TERMINEES] - Click', async () => {
                await pageRecepAttdu.clickOngletRecepTerminee();
            })
            
            test ('InputField [REFERENCE BL] = "' + sRefBL + '"', async () => {
                await fonction.sendKeys(pageReceptermne.rechercheBlAchatFourn, sRefBL, false, 'Référence BL');
                await fonction.wait(page, 250); // Temporisation le temps que la liste se mette à jour
            })

            test ('DataGrid [NUMERO BL] ="' + sRefBL + '"', async () => {
                expect(await pageReceptermne.listBLResults.last().textContent()).toBe(sRefBL);
            }) 

        }) // end test.describe Onglet          

    }) // end test.describe Page


    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

}) // end test.describe Test