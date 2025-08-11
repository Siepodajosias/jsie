/**
 * @author  SIAKA KONE
 * @since   2024-09-16
 * 
 */
const xRefTest      = "STO_REC_FLF";  
const xDescription  = "Réceptionner une livraison fournisseur FL";
const xIdTest       =  1716;
const xVersion      = '3.5'; 

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],        
    params      : ['plateformeReception','referenceBl', 'plateformeDistribution','plateformeReceptCode','plateformeDistribCode'],
    fileName    : __filename
}; 

//------------------------------------------------------------------------------------

import { test, type Page, expect }      from '@playwright/test';

import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';
import { EsbFunctions }                 from '@helpers/esb';

import { MenuStock }                    from '@pom/STO/menu.page'; 
import { ReceptionAttendue }            from '@pom/STO/reception-attendue.page';
import { ReceptionEnCours }             from '@pom/STO/reception-en_cours.page';
import { ReceptionTermine }             from '@pom/STO/reception-terminee.page';

import { CartoucheInfo, TypeEsb }       from '@commun/types';

//------------------------------------------------------------------------------------

let page                  : Page;
let menu                  : MenuStock;
let pageReceptionAttendue : ReceptionAttendue;
let pageReceptionEnCours  : ReceptionEnCours;
let pageReceptionTermine  : ReceptionTermine;
let esb                   : EsbFunctions;

const log                 = new Log();
const fonction            = new TestFunctions(log);

var oData:any             = fonction.importJdd();        // Récupération du JDD et des données du E2E en cours si ils existent

// Exploitation des paramètres passés dans le JDD E2E -OU- passés en argument OU ceux présents dans le fichier de configuration Local
var idPtfRecept         = fonction.getInitParam('plateformeReception','Chaponnay');
var sReferenceBl        = fonction.getInitParam('referenceBl','TA_BL ' + fonction.getToday() + ' ' + fonction.getBadChars()); // Création d'une référence de BL fictif pour faciliter sa tracibilité
var idPtfDistrib        = fonction.getInitParam('plateformeDistribution','Chaponnay'); 
const idPtfReceptCode   = fonction.getInitParam('plateformeReceptCode','CHA');
const idPtfDistribCode  = fonction.getInitParam('plateformeDistribCode','CHA');

const sTemperatureArriere = '10';
const sTemperatureMilieu  = '9';
const sTemperatureFond    = '8';

//------------------------------------------------------------------------------------    
if (oData !== undefined) {                              // On est dans le cadre d'un E2E. Récupération des données temporaires
    sReferenceBl          =  oData.sBonLivraison ;         
    log.set('E2E - Numéro Bl : ' + sReferenceBl);  
}
//------------------------------------------------------------------------------------

// Solution de contournement : lorsque la casse est différente d'une appli à une autre (Ex pour SugLog et Sudlog)
// Au final le problème reste sur Sudlog pour la destination des étiquettes ==> forcage
idPtfDistrib                = fonction.capitalizeFirstLetter(idPtfDistrib);
 
test.beforeAll(async ({ browser }, testInfo) => {
     page                   = await browser.newPage();
     menu                   = new MenuStock(page, fonction);
     pageReceptionAttendue  = new ReceptionAttendue(page);
     pageReceptionEnCours   = new ReceptionEnCours(page);
     pageReceptionTermine   = new ReceptionTermine(page);
     esb                    = new EsbFunctions(fonction);
     const helper           = new Help(info, testInfo, page);
     await helper.init();
});

test.afterAll(async ({}, testInfo) => {
     await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', async () => {   

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async() => {
       await fonction.connexion(page);
    })

    test.describe ('Page [RECEPTION]', async () => {

        var sNomPage:string = 'reception';
        test ('Page [RECEPTION] - Click', async () => {
            await menu.click(sNomPage, page);
        })

        test.describe ('Onglet [LIVRAISONS ATTENDUES]', async () => {

            idPtfRecept = idPtfRecept = fonction.capitalizeFirstLetter(idPtfRecept);
            test ('ListBox [PLATEFORME] = "' + idPtfRecept + '"', async () => {                    
                await menu.selectPlateforrme(page, idPtfRecept);
            })
 
            if (idPtfDistribCode == idPtfReceptCode) {                                              // Cas sans transit, réception direct frn sur ptf distrib
                log.set('Réception sans transit sur '+ idPtfRecept);
                test ('ListBox [ROUTAGE] = "Direct fournisseur"', async () =>{     
                    await fonction.selectListBoxByLabel(pageReceptionAttendue.listBoxRoutage,"Direct fournisseur", page);           
                })
            }
            else {                                                                          // Cas avec transit, réception frn sur ptf transit
                log.set('Réception transit sur '+ idPtfRecept +' pour '+ idPtfDistrib);
                if (idPtfDistrib != 'Non affectée') {
                    test ('ListBox [ROUTAGE] = "Pour ' + idPtfDistrib + '"' , async () =>{     // Check le routage est renseigné              
                        await fonction.selectListBoxByLabel(pageReceptionAttendue.listBoxRoutage,'Pour ' + idPtfDistrib, page);
                    })
                }
                else {
                    test ('ListBox [ROUTAGE] = Non affecté', async () =>{                      // Check le routage est Non affecté              
                        await fonction.selectListBoxByLabel(pageReceptionAttendue.listBoxRoutage,"Non affecté", page);
                    })
                }
            }

            test ('CheckBox [TTES LES LIVRAISONS] - Click', async () =>{                
                await fonction.clickElement(pageReceptionAttendue.checkBoxAffToutesLivr);
            })

            test ('Sort [CONFIRMEE] - Click X 2', async () => {
                await fonction.clickElement(pageReceptionAttendue.thConfirmee);
                await fonction.clickElement(pageReceptionAttendue.thConfirmee);
            })

            if (sReferenceBl != null) {                                                          // Cas filtre sur un numero de BL (paramètre ou E2E), transporteur, N° achat ou fournisseur
                test ('Input [SEARCH] = "'+  sReferenceBl + '"', async () => {
                    await fonction.sendKeys(pageReceptionAttendue.inputFilter, sReferenceBl, false, 'Référence BL');
                    await fonction.wait(page, 250);// Attendre l'application effective du filtre;
                })
            }

            test ('CheckBox [LIVRAISONS ATTENDUES][0] - Click', async () => {
                await fonction.clickElement(pageReceptionAttendue.listLivAttendues.first());
            })

            test ('Button [RECEPTIONNER] - Click', async () => {
                await fonction.clickElement(pageReceptionAttendue.buttonReceptionner);
            })

            test.describe('Popin [RECEPTION (ATTENDUE)]', async () => {

                test('Popin [RECEPTION (ATTENDUE)] - Is Visible', async () => {
                    await fonction.popinVisible(page, 'RECEPTION (ATTENDUE)', true);
                })

                test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
                    await fonction.isErrorDisplayed(false, page);
                })

                test ('Button [TERMINER] - Click', async () => {                                  // Check on ne peut pas terminer, il reste des champs obligatoires
                    await fonction.clickAndWait(pageReceptionAttendue.buttonTerminer, page);
                })
                
                if (oData !== undefined) {                                                      // On est dans le cadre d'un E2E. Le numéro de BL est celui du JDD
                    log.set('Numéro de BL : ' + sReferenceBl);                                   // Check le numéro de BL est déjà renseigné
                }
                else {                                                                          
                    test ('InputField [REFERENCE BL] = "' + sReferenceBl + '"', async () => {            // Numero de BL obligatoire
                        await fonction.sendKeys(pageReceptionAttendue.pInputRecepReferenceBL, sReferenceBl, false, 'Reference bl');
                        log.set('Numéro de BL : ' + sReferenceBl)
                    })
                }

                if (idPtfDistribCode == idPtfReceptCode) {                                              // Cas sans transit, réception direct frn sur ptf distrib
                    test ('ListBox [QUAI AFFECTE] - Select', async () => {                         // Quai obligatoire
                        await pageReceptionAttendue.selectQuaiAffecte();
                    }) 
                
                    test('ListBox [RECEPTIONNAIRE 1][Rnd] - Select', async () => {
                        await pageReceptionAttendue.selectReceptionnaire(pageReceptionAttendue.pListBoxRecepReceptionnaire1, pageReceptionAttendue.pListBoxItemReceptionnaire1);                                                           // Receptionnaire obligatoire
                    })
                }   // Else : cas transit. Check le quai et le receptionnaire sont renseignés par défaut
                
                test.describe ('Partie [COMPTAGE PALETTES]', async () => {

                    test ('Pictogramme [ + ] - Click', async () => {
                        await fonction.clickElement(pageReceptionAttendue.PictoPlusComptage);
                    })

                    test('QUANTITE EMBALLAGE = "' + 1 + '"', async () => {
                        await fonction.sendKeys(pageReceptionAttendue.InputQuantiteEmballage.first(), 1, false, 'Quantite emballage');
                    })

                })

                test ('Onglet [PALETTES FOURNISSEURS] - click', async () => {
                    await fonction.clickElement(pageReceptionAttendue.ongletPalettesFourn);
                })

                test ('CheckBox [TOUTES LES LIV] - Click', async () => {
                    await fonction.clickElement(pageReceptionAttendue.checkBoxAllRecep);
                })

                test.describe ('partie [SAISIE EN MASSE]', async () => {

                    if (idPtfDistribCode == idPtfReceptCode) {                                          // Cas sans transit, réception direct frn sur ptf distrib

                        test ('InputField [EMPLACEMENT] - Set', async () => {                      // Emplacements obligatoires
                            await pageReceptionAttendue.setEmplacements();
                        })
                    }
                    else {                                                                      // Else : cas transit. Check les emplacements sont renseignés par défaut
                        if (idPtfDistrib == 'Non affectée') {                                   // SAUF pour Non affecté car à ce jour aucun emplacement par défaut n'a été crée
                                                                                                // Emplacements obligatoires
                            if (idPtfRecept !== 'Rungis') {                                     // Exception pour Rungis qui n'a pas d'emplacements numérotés
                                test ('InputField [EMPLACEMENT] - Set', async () => {                  
                                    await pageReceptionAttendue.setEmplacements();
                                })
                            }
                            else {
                                test ('InputField [EMPLACEMENT][RUNGIS] - Set', async () => {      // Sélection emplacement Rungis   
                                    pageReceptionAttendue.setEmpRungis();
                                })
                            }
                        }  
                    }

                    test ('Button [APPLIQUER A TOUS] - Click', async () => {
                        await fonction.clickAndWait(pageReceptionAttendue.buttonAppliquerMasse, page);
                    })
                })

                test ('Button [SAUVEGARDER] - Click', async () => {
                    await fonction.clickAndWait(pageReceptionAttendue.buttonSauvegarder, page);
                })

                test ('Button [ETIQUETTE NON] - Click', async () => {
                    await fonction.clickAndWait(pageReceptionAttendue.buttonImprimerNon, page);
                })

                const sNomPopin:string = 'RECEPTION ATTENDU';
                test('Popin [' + sNomPopin + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })

            }) // end describe Popin           
                    
        }) // end describe Onglet

        test.describe ('Onglet [RECEPTIONS EN COURS]', async () => {

            test ('Onglet [RECEPTIONS EN COURS] - Click', async () => {
                await pageReceptionAttendue.clickOngletRecepEnCours();
            })

            test ('InputField [REFERENCE BL] = "' + sReferenceBl + '"', async () => {
                await fonction.sendKeys(pageReceptionEnCours.rechercheBlAchatFourn, sReferenceBl, false, 'Référence bl');
                await fonction.wait(page, 250); //Attendre que le filtre soit appliqué;
            })

            test ('CheckBox [RECEPTIONS EN COURS][0] - Click', async () => {
                await fonction.clickElement(pageReceptionEnCours.listRecEnCours.first());
            })

            test ('Button [COMPLETER] - Click', async () => {
                await fonction.clickAndWait(pageReceptionEnCours.buttonCompleter, page);
            })

            test ('Input [RELEVE DE TEMPERATURE ARRIERE] = "' + sTemperatureArriere + '"', async () => {
                await fonction.sendKeys(pageReceptionAttendue.inputTempArriere,sTemperatureArriere, false, 'Relevé Température Arrière');
             })

             test ('Input [RELEVE DE TEMPERATURE MILIEU] = "' + sTemperatureMilieu + '"', async () => {
                await fonction.sendKeys(pageReceptionAttendue.inputTempMilieu,sTemperatureMilieu, false, 'Relevé Température Milieu');
             })

             test ('Input [RELEVE DE TEMPERATURE FOND] = "' + sTemperatureFond + '"', async () => {
                await fonction.sendKeys(pageReceptionAttendue.inputTempFond,sTemperatureFond, false, 'Relevé Température Fond');
             })

            test ('Button [TERMINER] - Click', async () => {
                await fonction.clickAndWait(pageReceptionEnCours.pButtonTerminer, page);
            })

            test ('Check [ETIQUETTE][Pour ' + idPtfDistrib +' sur]', async () => {
                var sLabel = "Pour " + idPtfDistrib +" sur";
                expect(((await pageReceptionEnCours.labelImpPourPlt.textContent()).trim())).toBe(sLabel);
            })

            test ('Button [CONFIRMER TERMINER SANS ETIQUETTE] - Click', async () => {
                await fonction.clickAndWait(pageReceptionEnCours.buttonConfTerminer, page);
            })

        }) // end describe Onglet  

        test.describe ('Onglet [RECEPTIONS TERMINEES]', async () => {
            
            test ('Onglet [RECEPTIONS TERMINEES] - Click', async () => {
                await pageReceptionAttendue.clickOngletRecepTerminee();
            })
            
            test ('InputField [REFERENCE BL] = "' + sReferenceBl + '"', async () => {
                await fonction.sendKeys(pageReceptionTermine.rechercheBlAchatFourn, sReferenceBl, false, 'Référence bl');
                await fonction.wait(page, 250); //Attendre que le filtre soit appliqué;
            })

            test ('DataGrid [NUMERO BL] ="' + sReferenceBl + '"', async () => {
                expect(await pageReceptionTermine.listBLResults.last().textContent()).toBe(sReferenceBl);
            }) 

            test ('CheckBox [RECEPTIONS TERMINEES][0] - Click', async () => {
                await fonction.clickElement(pageReceptionTermine.listRecTerminees.first());
            })

            test ('Button [VOIR RECEPTION TERMINEE] - Visible', async () => {
                await fonction.clickElement(pageReceptionTermine.buttonVoirRecpTerm);
            })

            test ('Link [FERMER] - Click', async () => {
                await fonction.clickElement(pageReceptionTermine.linkFermer.first());
            })

        }) // end describe Onglet          

    }) // end describe Page

    //Enregistrement des données pour le E2E
    await fonction.writeData(oData);

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

    test ('Check Flux :',async ()=>{
        var oFlux:TypeEsb   =  { 
            "FLUX" : [ 
                {
                    "NOM_FLUX"  : "EnvoyerLot_Repart",
                    STOP_ON_FAILURE  : true
                }
            ],
            "WAIT_BEFORE"   : 3000,                 // Optionnel
        };
        
        await esb.checkFlux(oFlux,page);
    })
    
}) // end describe Test