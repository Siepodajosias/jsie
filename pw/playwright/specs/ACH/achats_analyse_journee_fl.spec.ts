/**
 * 
 * @author SIAKA KONE
 * @since 2024-07-08
 * 
 */
const xRefTest      = "ACH_FL1_ART";
const xDescription  = "Effectuer un achat FL (Analyse journée)";
const xIdTest       =  21; 
const xVersion      = '3.17.12';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,    
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Doit être lancé après la création des triplets (achat vue fournisseur) et la création du dossier d\'achat'],
    params      : ['fournisseur','plateformeReception','plateformeDistribution','listeArticles','listeMagasins','nbColisEstimes','rayon','dossierAchat', 'E2E'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { expect, test, type Page }  from '@playwright/test';

import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { EsbFunctions }             from '@helpers/esb';
import { Log }                      from '@helpers/log';

import { PageAchAnalyse }           from '@pom/ACH/achats_analyse-journee.page';
import { PageAchAchFour }           from '@pom/ACH/achats_achats-fournisseurs.page';
import { MenuAchats }               from '@pom/ACH/menu.page';

import { CartoucheInfo, TypeEsb }   from '@commun/types';
//------------------------------------------------------------------------------------

let page                : Page;
let pageAchAnalyse      : PageAchAnalyse;
let pageAchAchFour      : PageAchAchFour;
let menu                : MenuAchats;
let esb                 : EsbFunctions;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------
fonction.importJdd();   //Import du JDD pour le bout en bout  
//------------------------------------------------------------------------------------

const sFournisseur      = fonction.getInitParam('fournisseur', 'Fine Fruits Company'); // L\'atelier des fruits et legumes  Sicodis
const sPtfDistribut     = fonction.getInitParam('plateformeDistribution', 'Chaponnay');
var sNbColis            = fonction.getInitParam('nbColisEstimes', '10');
const sPtfReception     = fonction.getInitParam('plateformeReception', 'Chaponnay');
var sReferenceBl        = fonction.getInitParam('referenceBl','TA_BL ' + fonction.getToday() + ' ' + fonction.getBadChars()); // Création d'une référence de BL fictif pour faciliter sa tracibilité
const sRayon            = fonction.getInitParam('rayon', 'Fruits et légumes');
const aCodeArticles     = fonction.getInitParam('listeArticles', '5254');
const aListeMagasins    = fonction.getInitParam('listeMagasins', 'Bergerac,Bron');
const sE2E              = fonction.getInitParam('E2E', '');                   // Used to determine if specific actions have to be done (when E2E is defined)
var sDossierAchat       = fonction.capitalizeFirstLetter(fonction.getInitParam('dossierAchat', 'Tous'));

const maDate            = new Date();
const sDateJour:string  = fonction.addZero(maDate.getDate()) + ' / ' + fonction.addZero(maDate.getMonth() + 1);
const aJddE2E           = [
                            'E2E_FL10_CHA',
                            'E2E_FL10_SCY',
                            'E2E_FL10_SUD',
                            'E2E_FL10_2CL'
                        ];
const sUniteAchat       = 'Colis';
const rPrixTransport    = 1.000;

var sIncoterm           = '';
var aCodesArticles      = aCodeArticles.split(',');
var iNbMagasin          = aListeMagasins.length;

if(iNbMagasin > 0){
    sNbColis = (parseInt(sNbColis)*iNbMagasin).toString();
}

if(sPtfReception == sPtfDistribut){
    sIncoterm = 'D - Départ exp.';
} else {
    sIncoterm = 'P - Départ PF';
}

//-- Est-on dans le cadre d'un E2E ?
if (aJddE2E.includes(sE2E)) {
    const pathBackUp = '../../_run-once/' + fonction.environnement + '/' + sE2E + '.json';
    log.set('Fichier E2E : ' + pathBackUp);
    const oBackUp = fonction.readFile(pathBackUp);
    sDossierAchat = oBackUp.sDossierAchat;
    log.set('Dossier d\'Achat Choisi par Défaut : ' + sDossierAchat);
} else {
    log.set('Hors Contexte E2E car ne fait pas partie de la liste d\'inclusion');
}
//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {

    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    pageAchAnalyse  = new PageAchAnalyse(page);
    pageAchAchFour  = new PageAchAchFour(page);
    esb             = new EsbFunctions(fonction);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    var oData = {
        aLots           : {},
        sNumAchat       : '',
        sNumAchatLong   : '',
        sBonLivraison   : '',
        aFeuille        : {},
        aCalibre        : {},
        aConditionnement: {},
        aPrixAchat      : {}
    };

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
        log.set('Nombre de magasin : ' + iNbMagasin);
    })
  
    test.describe ('Page [ACHATS]', async () => {

        test ('ListBox [RAYON] ="' + sRayon + '"', async() => {
            await menu.selectRayonByName(sRayon, page);
        })

        var pageName:string = 'achats';
        test ('Page [ACHATS] - Click', async () => {        
            const iDelayTimeOut = 600000;
            test.setTimeout(iDelayTimeOut);                     //-- Le spinner de chargement peut prendre plus de temps !
            await menu.click(pageName, page, iDelayTimeOut);    //-- En mode "Tout afficher", le temps de traitement peut être particulièrement long !
        })

        var sNomOnglet:string = "ANALYSE JOURNEE";
        test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async () => {

           test ('Onglet [' + sNomOnglet + '] - Is Visible', async () => {
                await menu.isOngletPresent('Analyse journée');        
            })

            test ('DatePicker [EXPEDITION MAGASIN] = "' + sDateJour + '"', async () => {
                const sDateExpe:string = await pageAchAnalyse.inputDateExpeMag.inputValue();
                expect(sDateExpe).toContain(sDateJour);
            })

            test ('ListBox [DOSSIER D\'ACHAT] = "' + sDossierAchat + '"', async () =>{
                await fonction.clickElement(pageAchAnalyse.listBoxDossierAchat);
                await fonction.clickElement(pageAchAnalyse.listBoxDossierAchatItem.filter({hasText:sDossierAchat})); 
            })

            test ('CheckBox [AFFICHER TOUS LES ARTICLES] - Click ', async () => {
                await pageAchAnalyse.buttonParametrage.hover();
                const bIsChecked = await pageAchAnalyse.switchButton.evaluate(element => element.getAttribute('class').includes('p-element ng-untouched ng-pristine ng-valid'));

                if (bIsChecked === false) {
                    log.set('Affichage tous les articles : ACTIVATION');
                    await fonction.clickAndWait(pageAchAnalyse.switchButton, page);
                } else {
                    log.set('Affichage tous les articles : DEJA ACTIVE');
                }                                  
            })

            test ('InputField [PLATEFORME DE RECEPTION] = "' + sPtfReception + '"', async () => {
                await fonction.clickElement(pageAchAnalyse.selectBoxPlateforme);
                await fonction.sendKeys(pageAchAnalyse.inputFiltrePlateforme, sPtfReception, false, 'Plateforme Reception');
                await fonction.clickElement(pageAchAnalyse.listBoxPlateforme.filter({hasText:sPtfReception}).nth(0));
                await fonction.clickElement(pageAchAnalyse.closeListePlateforme);
            })

            test ('Count [NOMBRE ARTCLE DU DOSSIER]  = ' + aCodesArticles.length.toString(), async ()=> {
                if(fonction.getLogin() == 'jcc-recette1') { //On veut s'assurer qu'il n'y a que les articles du dossier d'achat associer au user Acheteur
                    await fonction.wait(page, 500);
                    const iNbreArticleDossier:number = await pageAchAnalyse.tdListeAchat.count();
                    expect(iNbreArticleDossier).toBe(aCodesArticles.length);//aCodesArticles.length
                } else {
                    test.skip();
                }
            })

            aCodesArticles.forEach(async (sArticle:string) =>{

                test.describe ('Article [' + sArticle + ']', async () => {

                    test ('InputField [CODE] = "' + sArticle + '"', async () => {
                        await fonction.sendKeys(pageAchAnalyse.inputFiltreIdArticle, sArticle, false, 'Code Article');
                        await fonction.wait(page, 500);
                    })
        
                    test ('td [ARTICLE A ACHETER][0]  - Click', async ()=> {
                        await fonction.clickElement(pageAchAnalyse.tdListeAchat.nth(0));
                    })
        
                    test ('Button [MODIFIER] - Click',async () => {
                        await fonction.clickAndWait(pageAchAnalyse.buttonModifier, page);
                    })

                    var sNomPopin:string = "Detail achat";
                    test.describe ('Popin [' + sNomPopin.toUpperCase() + ' - ' + sArticle + ']', async () => {

                        test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                            await fonction.popinVisible(page, sNomPopin, true);
                        })

                        test.skip ('Check [DATE PREPARATION] = "' + sDateJour + '"', async () => {
                            const sDatePrepa:string = await pageAchAnalyse.datePreparation.textContent();
                            expect(sDatePrepa).toContain(sDateJour);
                        })

                        test ('** Wait Until Spinner Off **', async () => {
                            await fonction.waitForSpinner(pageAchAchFour.spinnerLoading.first());
                        });   

                        test ('Check Plateforme Reception', async () => {
                            const currentPltDist = pageAchAnalyse.pPButtoncurrentPltfDistri.filter({hasText:sPtfDistribut});//  sPtfDistribut
                            await expect(currentPltDist).toHaveClass("p-element p-button p-component ng-star-inserted");
                            await fonction.clickAndWait(currentPltDist, page);
                            //await fonction.wait(page, 1000);
                        })

                        test ('InputField [COLIS ESTIME] = "' + sNbColis + '"', async () => {
                            await pageAchAnalyse.pPdetailtdLigneAchat.first().waitFor();
                            //Selectionner la ligne
                            const tdFournisseur = pageAchAnalyse.pPdetailtdLigneAchat.filter({hasText:fonction.capitalizeFirstLetter(sFournisseur)});
                            const bEnabled:boolean = await tdFournisseur.nth(0).locator('input[formcontrolname="estimeColis"]').isEnabled();
                            var iPosition:number = 0;
                            if(!bEnabled) {             // Si la première ligne est inactive, on passe à la suivante
                                iPosition = 1;
                            }
                            oData.aPrixAchat[sArticle] = await tdFournisseur.nth(iPosition).locator('td:nth-child(11)').textContent(); // Enregistrer le prix d'achat;
                            await fonction.sendKeys(tdFournisseur.nth(iPosition).locator('input[formcontrolname="estimeColis"]'), sNbColis, false, 'Nombre Colis Estime');
                            log.set('Dernier prix achat : ' + oData.aPrixAchat[sArticle]);
                        })

                        test ('Button [ENREGISTRER] - Click', async () => {
                            test.setTimeout(180000); 
                            await pageAchAnalyse.pPdetailButtonEnregistrers.waitFor({state:"visible"});
                            await fonction.clickAndWait(pageAchAnalyse.pPdetailButtonEnregistrers, page);
                        })

                        test ('Button [MODIFIER] - Click',async () => {
                            test.setTimeout(180000);                                            // Augmentation du délai du test car > au délai global défini (42 sec)
                            await pageAchAnalyse.buttonModifier.waitFor({state:"visible"});
                            await fonction.clickAndWait(pageAchAnalyse.buttonModifier,page,60000);
                        })

                        test ('Label [NUMERO ACHAT & LOT] ="' + sArticle + '"', async () => {
                            await pageAchAnalyse.pPdetailtdLigneAchat.first().waitFor();
                            const tdFournisseur = pageAchAnalyse.pPdetailtdLigneAchat.filter({hasText:sFournisseur});

                            const bEnabled:boolean = await tdFournisseur.nth(0).locator('input[formcontrolname="estimeColis"]').isEnabled();
                            var iPosition:number = 0;
                            if(!bEnabled) {
                                iPosition = 1;
                            }
                            const numAchat  = await tdFournisseur.nth(iPosition).locator('td.text-center:nth-child(2)').textContent();
                            const numLot    = await tdFournisseur.nth(iPosition).locator('td.text-center:nth-child(18)').textContent();

                            oData.aLots[sArticle] = numLot;

                            if(aCodesArticles.indexOf(sArticle) == 0){
                                oData.sNumAchat= numAchat;
                                oData.sBonLivraison= sReferenceBl;
                                log.set('Numéro d\'Achat : ' + numAchat);
                            } else {
                                expect(numAchat).toBe(oData.sNumAchat);
                            }
                        })
        
                        test ('Button [FERMER] - Click', async ()=>{
                            await fonction.clickAndWait(pageAchAnalyse.pPdetailButtonFermer, page);
                        })

                    })

                })

            }); //-- foreach
        
        })

        var sNomOnglet:string = "ACHATS AUX FOURNISSEURS";
        test.describe ('Onglet [' + sNomOnglet +']', async () => {

            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(pageName, 'achatsAuxFournisseurs', page);
            })

            test ('InputField [NUMERO ACHAT] = "' + oData.sNumAchat + '"', async ()=> {
                await pageAchAchFour.fAcheterInputNumAchat.first().waitFor();
                await fonction.sendKeys(pageAchAchFour.fAcheterInputNumAchat, oData.sNumAchat.trim(), false, 'Numero Achat');
                await fonction.wait(page, 500);
            })

            const sStatut:string = 'A effectuer';
            test ('Label [STAUT] = "'+sStatut+'"', async () => {
                const sStatutAch:string = await pageAchAchFour.tdStatutAchat.textContent();
                expect(sStatutAch).toBe(sStatut);
            })

            test ('td [ARTICLE A ACHETER][0] - Click', async () => {
                await fonction.clickElement(pageAchAchFour.tdListAchat.nth(0));
            })

            test ('Button [MODIFIER] - Click', async () => {
                await fonction.clickAndWait(pageAchAnalyse.buttonModifier, page);
            })

            test ('Input [ACHETEUR] - Is Enabled', async () => {
                const bEnabled = await pageAchAchFour.inputAcheteur.isEditable();
                expect(bEnabled).not.toBe(true);

                const numAchatL = await pageAchAnalyse.labelNumAchat.textContent();
                oData.sNumAchatLong = numAchatL;
                log.set('Numero d\'achat long : ' + numAchatL);
            })
            

            //-- Paramétrage individuel de chaque article
            aCodesArticles.forEach(async (sCodeArticle:string) => {

                test.describe ('Article [' + sCodeArticle + ']', async () => {

                    test ('Input [CODE ARTICLE] = "' + sCodeArticle + '"',async () => {
                        await fonction.sendKeys(pageAchAchFour.pPinputFiltreCodeArticle, sCodeArticle, false, 'Code Article');
                        await fonction.wait(page, 1000);//Attendre que le filtre soit effectif;
                    })

                    test ('ListBox [ORIGINEE][0] = "'+ sCodeArticle + '"', async () => {
                        await fonction.clickElement(pageAchAchFour.fAcheterListBoxOrigine.nth(0));
                        const iNbreElmt = await pageAchAchFour.listBoxVarie.count();
                        if(iNbreElmt > 0){
                            await fonction.clickAndWait(pageAchAchFour.listBoxVarie.nth(0), page);
                        } else {
                            log.set("Origne déjà utilisé et grisé : " + iNbreElmt);
                            test.skip();
                        }
                    });

                    test ('InputField [QUANTIET LOT] = "' + sNbColis + '"', async () => {
                        const sNbreLot:string = await pageAchAchFour.inputColisEstime.inputValue();
                        expect(sNbreLot).toBe(sNbColis);
                    })
        
                    test ('ListBox [PLATEFORME DISTRIBUTION] = "' + sPtfDistribut + '"', async () => {
                        await fonction.clickElement(pageAchAchFour.listBoxPtfDistribution);
                        await fonction.clickElement(pageAchAchFour.listBoxVarie.filter({hasText:sPtfDistribut}).nth(0));
                        await fonction.addDataSheet('ListBox', 'Ptf Distribution', sPtfDistribut);
                    })
        
                    test ('ListBox [INCOTERM] = "' + sIncoterm + '"', async () => {
                        await fonction.clickElement(pageAchAchFour.fAcheterListBoxIncoterm);
                        await fonction.clickElement(pageAchAchFour.listBoxVarie.filter({hasText:sIncoterm}).nth(0));
                        await fonction.addDataSheet('ListBox', 'Incoterm', sIncoterm);
                    })
        
                    test ('ListBox [UNITE PRIX ACHAT] = "'+ sUniteAchat +'"', async () =>{
                        await fonction.clickElement(pageAchAchFour.fAcheterListBoxUniteAchat);
                        await fonction.clickElement(pageAchAchFour.listBoxVarie.filter({hasText:sUniteAchat}).nth(0));
                        await fonction.addDataSheet('ListBox', 'Unite Prix Achat', sUniteAchat);
                    })

                })

            }); //-- foreach

            test ('Button [BASCULER COLIS ESTIME] - Click', async () => { 
                await fonction.clickElement(pageAchAchFour.pPbuttonBasculerColisEst);
            })

            test ('Colis acheté [NUMERO LOT] = "' + sNbColis +'"', async () => {
                const sQteAchete:string = await pageAchAchFour.tdNumeroLotAchete.inputValue();
                expect(sQteAchete).toBe(sNbColis);
            })

            test ('Button [ENREGISTRER] - Is Enabled',async ()=>{
                const bEnabled:boolean = await pageAchAchFour.fAcheterbuttonEnregistrer.isEnabled();
                expect(bEnabled).toBe(true);
            })

            test ('Button [ACHETER] - Click',async ()=>{
                await fonction.clickAndWait(pageAchAchFour.buttonAchater, page);
            })

            test ('Confirmation [ACHETER] - Click (Optionnel)', async () => {
                var isElementVisible:boolean = await pageAchAchFour.pPconfirmButtonAcheter.isVisible();
                test.setTimeout(60000);
                if(isElementVisible){
                    await fonction.clickAndWait(pageAchAchFour.pPconfirmButtonAcheter, page, 60000);
                    log.set('Confirmation d\'achat malgré l\'alerte');
                }else{
                    test.skip();
                }
            })

            test ('** Wait Until Spinner Off **', async () => {
                await fonction.waitForSpinner(pageAchAchFour.spinner3.last());
            });

            const sStatuAch:string = 'A confirmer';
            test ('Label [STAUT] = "'+sStatut+'" #1', async () => {
                expect(await pageAchAchFour.labelStatutAchat.textContent()).toBe(sStatuAch);
            })

            test ('Button [ENREGISTRER] - Is Disabled',async ()=> {
                await expect(pageAchAchFour.fAcheterbuttonEnregistrer).toBeDisabled();
            })

            test ('Message [Attention ! Le changement d\'incoterm du lot...] - Is Visible', async () => {
                const sMessAlerte1:string = "Attention ! Le changement d'incoterm du lot";
                const sMessAlerte2:string = "nécessite que le prix de transport soit renseigné dans la saisie du lot.";
                if(sPtfReception == sPtfDistribut) {
                    const sAlert:string = await pageAchAchFour.labelAlerte.textContent();
                    expect(sAlert).toContain(sMessAlerte1);
                    expect(sAlert).toContain(sMessAlerte2);
                }
            })

            test ('Button [CONFIRMETR] #1 - Is Disabled', async () => {
                await expect(pageAchAchFour.buttonConfirmerAchat).toBeDisabled();
            })

            aCodesArticles.forEach(async (sCodeArticle:string) => {

                test.describe ('Articles [' + sCodeArticle + ']', async () => {

                    test ('Input [CODE ARTICLE] = "' + sCodeArticle + '"',async () => {
                        await fonction.sendKeys(pageAchAchFour.pPinputFiltreCodeArticle, sCodeArticle, false, '');
                        await fonction.wait(page, 500);
                    })

                    test ('Label [NUMERO LOT] = "'+ sCodeArticle +'"', async () =>{
                        const sNumLot = await pageAchAchFour.fAcheterLabelNumLot.textContent();
                        log.set('Numero de lot pour l\'article '+ sCodeArticle + ' : '+ sNumLot);
                        expect(sNumLot).toBe(oData.aLots[sCodeArticle]);
                    })

                    test ('CheckBox [ALL] - Click', async () => {
                        await fonction.clickElement(pageAchAchFour.pPcheckBoxAllLot);
                    })
    
                    test ('Button [VOIR DETAIL] - Click', async () => {
                        await fonction.clickAndWait(pageAchAchFour.pPbuttonDetailLot, page);
                    })

                    test.describe ('Popin [DETAIL LOTS]', async () => {

                        test ('Popin [DETAIL LOTS] - Is Visible', async () => {
                            await fonction.popinVisible(page, 'DETAIL LOTS', true);
                        })

                        test ('Icon [CONFIRMER COLIS] - Click', async () => {
                            await fonction.clickAndWait(pageAchAchFour.pPiconConfirmerColis, page);
                        })

                        test ('Icon [CONFIRMER COLIS] - Is Not Visible', async () => {
                            const bVisible:boolean = await pageAchAchFour.pPiconConfirmerColis.isVisible();
                            expect(bVisible).not.toBe(true);
                        })

                        test ('InputField [BON DE LIVRAISON]', async () => {
                            await fonction.sendKeys(pageAchAchFour.pPsaisieInputBL, oData.sBonLivraison, false, 'Bon De Livraison');
                        })
        
                        test ('InputField [POIDS CONFIRME LOT] = "***"' , async () => {
                            const poidsTheoriqueValue:string = await pageAchAchFour.pPinputPoidsTheorique.inputValue();
                            const poidsTotal:boolean = await pageAchAchFour.pPinputPoidsTotal.isEnabled();
                            if (poidsTotal){
                                await fonction.sendKeys(pageAchAchFour.pPinputPoidsTotal, poidsTheoriqueValue, false, 'Poids theorique');
                            } else {
                                log.set('Le poids du lot n\'est pas saisissable .');
                            }
                        })
    
                        test ('InputField [PRIX TRANSPORT] = "'+ rPrixTransport +'"' , async () => {
                            const bPrixTransport:boolean = await pageAchAchFour.pPsaisieInputPrixTransport.isEnabled();
                            if (bPrixTransport){
                                await fonction.sendKeys(pageAchAchFour.pPsaisieInputPrixTransport, rPrixTransport, false, 'Prix Transport');
                            } else {
                                log.set('Le prix du transport n\'est pas saisissable pour l`\'article : ' +sCodeArticle);
                            }
                        })
        
                        test ('Button [ENREGISTRER] - Click', async () => {
                            await fonction.clickAndWait(pageAchAchFour.pPbuttonEnregistrerDeLot, page);
                            const bPresent:boolean = await pageAchAchFour.alertErreur.isVisible();
                            if(bPresent){
                                await fonction.clickElement(pageAchAchFour.pPbuttonAlertOuiNon.nth(0));
                            } else {
                               log.set('Conformité de prix de revient');
                            }
                        })
 
                    })
                    
                })

            }); //-- foreach

            test ('** Wait Until Spinner Off ** #1', async () => {
                await fonction.waitForSpinner(pageAchAchFour.spinnerLoading.first());
            });

            test ('Button [CONFIRMER] - Click', async () => {
                await fonction.clickAndWait(pageAchAchFour.buttonConfirmerAchat, page);
            })    
            
            test ('** Wait Until Spinner Off ** #2', async () => {
                await fonction.waitForSpinner(pageAchAchFour.spinner2.first());
            });

            const sStatuAcha:string = 'Confirmé';
            test ('Label [STAUT] = "' + sStatuAcha + '"', async () => {
                expect(await pageAchAchFour.labelStatutAchat.textContent()).toBe(sStatuAcha);
            })

            test ('Button [RETOUR A LA LISTE] - Click', async () => {
                await fonction.clickAndWait(pageAchAchFour.fAcheterbuttonRetourListe, page);
            })

            //Enregistrement des données pour le E2E
            await fonction.writeData(oData);

        })

    });

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

    test ('Check Flux :',async () =>{
        var oFlux:TypeEsb   =  { 
            "FLUX" : [ 
                {
                    "NOM_FLUX"  : "EnvoyerLot_Stock"
                },
                
                {
                    "NOM_FLUX"  : "EnvoyerLot_Repart"
                }
            ],
            "WAIT_BEFORE"   : 5000,                 // Optionnel
        };

        await esb.checkFlux(oFlux,page);
    })

})
   