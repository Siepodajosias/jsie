/**
 * @author SIAKA KONE
 * @desc Acheter & Confirmer un achat BCT / Saprimex (CrossDock)
 * @since 2024-04-30
 * 
 */
const xRefTest      = "ACH_CRD_AEC";
const xDescription  = "Acheter & Confirmer un achat BCT / Saprimex (CrossDock)";
const xIdTest       =  5165;
const xVersion      = '3.14';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : ['dossierAchat', 'plateforme','rayon','centraleAchat','fournisseur'],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { expect, test, type Page}   from '@playwright/test';

import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { EsbFunctions }             from '@helpers/esb';
import { Log }                      from '@helpers/log';

import { MenuAchats }               from '@pom/ACH/menu.page'; 
import { PageAchAchFour }           from '@pom/ACH/achats_achats-fournisseurs.page';
import { PageAchCalApp }            from '@pom/ACH/achats_calendrier-approvisionnement.page';

import { CartoucheInfo, TypeEsb }   from '@commun/types';
//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuAchats;
let pageAchAchFour      : PageAchAchFour;
let pageAchCalApp       : PageAchCalApp;
let esb                 : EsbFunctions;

const log               = new Log();
const fonction          = new TestFunctions(log);

var oData:any           = fonction.importJdd();        // Récupération du JDD et des données du E2E en cours si ils existent

//------------------------------------------------------------------------------------
var sDossierAchat       = fonction.getInitParam('dossierAchat', fonction.getLocalConfig('dossierAchatCrossdock'));
var sPlateforme         = fonction.getInitParam('plateforme', 'Cremlog');      
var sRayon              = fonction.getInitParam('rayon', 'BCT');  
var sCentraleAchat      = fonction.getInitParam('centraleAchat', 'BCT 500');
var sFournisseur        = fonction.getInitParam('fournisseur', 'Sas Les Ateliers Ⓔ');

var iNbChamps:number;

const regex             = /[^a-zA-Z\s]+/g;
const sIncoterm         = 'D - Départ exp.';
var sFournisseurClean   = sFournisseur.replace(regex,'');
var sDestinataire       : string;

if(oData !== undefined) {
    sDossierAchat = oData.sDossierAchat;
    sPlateforme = oData.sPlateforme;
    sRayon = oData.sRayon;
    sFournisseurClean = oData.sFournisseur.replace(regex,'');
}

const maDate            = new Date();
//------------------------------------------------------------------------------------

var doubleCheck = async (iPos:number) => {
   
    //-- Click sur le Calibre cible
    await fonction.clickElement(pageAchCalApp.pPiniListBoxVarie.nth(iPos));
    await fonction.wait(page, 1000);

     //-- Récupération Nom Conditionnement affiché
    var sNomConditionnement = await pageAchCalApp.pPiniListBoxConditionnement.textContent();
    log.set('Conditionnement : ' + sNomConditionnement);
    if(sNomConditionnement !='' && sNomConditionnement != 'Aucun résultat trouvé'){
        await fonction.clickElement(pageAchCalApp.pPiniListBoxConditionnement);
        const iNbeEltm:number = await pageAchCalApp.pPiniListBoxVarie.count();
        if(iNbeEltm > 0) {
            await fonction.clickElement(pageAchCalApp.pPiniListBoxVarie.last());
        } else {
            await fonction.clickElement(pageAchCalApp.pPiniListBoxCalibre);
            iPos++;
            await doubleCheck(iPos);
        }
    } 
}

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuAchats(page, fonction);
    pageAchCalApp       = new PageAchCalApp(page);
    pageAchAchFour      = new PageAchAchFour(page);
    esb                 = new EsbFunctions(fonction);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------  
test.describe.serial('[' + xRefTest + ']', async () => {  

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [ACHATS]', async () => {

        var sNomPage:string = 'achats'; 

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {                    
            await menu.selectRayonByName(sRayon, page);
        })
        
        test('Page [ACHATS] - Click', async() => {
            await menu.click(sNomPage, page, 60000);                
        })

        test('Label [ERREUR] - Is Not Visible', async () => {     // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })
        
        test('ListBox [DOSSIER D\'ACHAT] = "' + sDossierAchat + '"', async() => {
            await fonction.listBoxByLabel(pageAchCalApp.listBoxDossierAchat, sDossierAchat, page);
        })
        
        test('ListBox [CENTRALE D\'ACHAT', async () => {
            await fonction.listBoxByLabel(pageAchCalApp.listBoxCentraleAchat, sCentraleAchat, page);
        })

        const sDateAchat:string   = fonction.getToday('FR', 0 ,' / ');
        test('DatePicker [ACHATS A EFFECTUER DU] ="' + sDateAchat + '"', async () => {
            const sDateJour:string = await pageAchCalApp.inputDatePicker.inputValue();
            expect(sDateJour).toBe(sDateAchat);
        })

        test('DataGrid [PLATEFORME] = "' + sPlateforme + '"', async() => {            
            await fonction.clickAndWait(pageAchCalApp.tdListPlateformes.locator('span:text-is("' + sPlateforme + '")'), page);
            log.set('Plateforme sélectionnée : ' + sPlateforme);
        })

        test('Pictogram [BASCULER CROSSDOCKING] - Click', async() => {            
            await pageAchCalApp.tdListActionsSelected.hover();
            await fonction.clickAndWait(pageAchCalApp.pictoBasculerCrossDock, page);
        })

        test('DataGrid [FOURNISSEUR] = "' + sFournisseur + '"', async() => {
            await fonction.clickAndWait(pageAchCalApp.tdListFournisseurs.locator('span:text-is("' + sFournisseur + '")'), page);
            log.set('Plateforme sélectionnée : ' + sFournisseur);
        })

        if(oData !== undefined) {
            oData.aCodeArticle.forEach((sCodeArticle:string) => {
                test('InputField [ACHETE][' + sCodeArticle + '] = "' + 4 + '"', async() => {
                    test.setTimeout(60000);
                    iNbChamps = await pageAchCalApp.inputQteAchetee.count();
                    log.set('Nombre d\'articles : ' + iNbChamps);

                    var lignesFiltreArticles = pageAchCalApp.dataGridCrossDockbody.filter({ hasText: sCodeArticle });

                    if (oData.aCodeArticle.indexOf(sCodeArticle) == 0) {
                        //-- Filtrer sur le premier article du JDD;
                        var lignesFiltreArticles = pageAchCalApp.dataGridCrossDockbody.filter({ hasText: sCodeArticle });

                        //-- Récupération des destinataires;
                        sDestinataire = (await lignesFiltreArticles.filter({hasText:'(Fresh)'}).nth(0).locator('td.colonne-destinataire').textContent()).trim();
                        oData.aDestinataire[sDestinataire] = oData.aCodeArticle;
                        sDestinataire = (await lignesFiltreArticles.filter({hasText:'(Fresh)'}).nth(1).locator('td.colonne-destinataire').textContent()).trim();
                        oData.aDestinataire[sDestinataire] = oData.aCodeArticle;
                    } 

                    const inputQteAchetee = lignesFiltreArticles.filter({hasText:'(Fresh)'}).locator('[ng-model="ligneArticleDestinataire.quantiteAchetee"]');
                                
                    await inputQteAchetee.nth(0).scrollIntoViewIfNeeded();
                    await fonction.sendKeys(inputQteAchetee.first(), 4, false, 'Quantite achetee');
                    await inputQteAchetee.nth(1).scrollIntoViewIfNeeded();
                    await fonction.sendKeys(inputQteAchetee.nth(1), 4, false, 'Quantite achetee');
                    log.set('Nombre de ligne pour le filtre : ' +  await lignesFiltreArticles.filter({hasText:'(Fresh)'}).count());
                })
            });
        }
       
        test('Button [ACHETER ET CONFIRMER] - Click', async () => {
            await fonction.clickAndWait(pageAchCalApp.buttonAcheterConfirmer, page);
        })

        if(oData == undefined){
            var sNomPopin:string = "Date de récupération des PVC";
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test('Button [ENREGISTRER] - Click', async() => {
                    await fonction.clickAndWait(pageAchCalApp.pPiniButtonEnregistrer, page);
                })

                test('** Wait Until Spinner Off **', async () => {
                    await fonction.waitForSpinner(pageAchAchFour.pPspinnerCrossdock.first(), 180000);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })
            })
        }

        if(oData !== undefined) {
            var sNomPopin:string = 'Initialiser les données des nouveaux articles';
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {
    
                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })
    
                oData.aCodeArticle.forEach((sCodeArticle:string, index:number) => {
    
                    test('ListBox [CALIBRE][CONDITIONNEMENT][' + sCodeArticle + '] - Select', async () => {
                        await fonction.clickElement(pageAchCalApp.pPiniListBoxCalibre.nth(index));
                        if(await pageAchCalApp.pPiniListBoxVarie.count() > 0) {
                            await doubleCheck(0);
                        }
                    })
        
                    test ('ListBox [ORIGINEE][0][' + sCodeArticle + ']', async () => {
                        await fonction.clickElement(pageAchCalApp.pPiniListBoxOrigine.nth(index));
                        const iNbreElmt = await pageAchCalApp.pPiniListBoxVarie.count();
                        if(iNbreElmt > 0){
                            await fonction.clickElement(pageAchCalApp.pPiniListBoxVarie.nth(0));
                            await fonction.wait(page, 1000);
                            if(iNbreElmt === 1){ // Si la listBox contient un seul element, après la selection de l'element, le listBox reste Ouvert.
                                await fonction.clickElement(pageAchCalApp.pPiniListBoxOrigine); // Ce click va fermer cette listbox avant d'aller à l'étape suivante
                            }
                        } else {
                            log.set("Origne déjà utilisé et grisé " + iNbreElmt);
                            test.skip();
                        }
                    })
        
                    test('ListBox [INCOTERM][' + sCodeArticle + '] = "' + sIncoterm + '"', async () => {
                        await fonction.clickElement(pageAchCalApp.pPiniListBoxIncoterm.nth(index));
                        await fonction.clickElement(pageAchCalApp.pPiniListBoxVarie.filter({hasText:sIncoterm}).nth(0));
                        await fonction.wait(page, 1000);
                    })
        
                    test('Label [PRIX ACHAT][' + sCodeArticle + '] - Get', async () => {
                        var sPrixAchat:string = await pageAchCalApp.pPlabelPrixPrixAchat.nth(index).textContent(); 
                        if(!oData.aPrixCatalogue.includes(sPrixAchat)) {
                            oData.aPrixCatalogue.push(sPrixAchat);
                        }
                        
                        log.set('Prix d\'achat : ' + oData.aPrixCatalogue[index]);
                    })
                })
              
                test('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pageAchCalApp.pPiniButtonEnregistrer, page)
                })
    
                //Enregistrer les données;
                await fonction.writeData(oData);
            })
        
            var sNomPopin:string = "Date de récupération des PVC";
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () =>{

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test('Button [ENREGISTRER] - Click', async() => {
                    await fonction.clickAndWait(pageAchCalApp.pPiniButtonEnregistrer, page);
                })

                test('** Wait Until Spinner Off **', async () => {
                    await fonction.waitForSpinner(pageAchAchFour.pPspinnerCrossdock.first(), 180000);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })
            })

            const sNomOnglet:string = "ACHATS AUX FOURNISSEURS";
            test.describe ('Onglet [ACHATS AUX FOURNISSEURS]', async() => {
    
                test('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                    await menu.clickOnglet(sNomPage, 'achatsAuxFournisseurs', page);
                })
    
                test ('Date Picker [DATE RECEPTION PLATEFORME] - Click', async () => {
                    await fonction.clickElement(pageAchAchFour.fAcheterDatePicker);
                })
    
                test('DatePicker [DATE RECEPTION PLATEFORME] - Click', async () => {
                    const iIndexLendemain = maDate.getDate();
                    const bVisible:boolean = await pageAchAchFour.fAcheterDateActive.nth(iIndexLendemain).isVisible();
                    if(bVisible) {
                        await fonction.clickElement(pageAchAchFour.fAcheterDateActive.nth(iIndexLendemain));
                        await fonction.wait(page, 2000);
                    } else {
                        await fonction.clickElement(pageAchAchFour.fAcheterNextMonth);
                        await fonction.clickElement(pageAchAchFour.fAcheterDateActive.first());
                    }
                })
    
                test('Icon [ACHETEUR] - Click', async () => {
                    await fonction.clickElement(pageAchAchFour.iconSupprFiltreUser);
                    var aListeLot =  Object.keys(oData.aDestinataire);
                    log.set('Liste destinataire : ' + aListeLot);
                })
    
                Object.keys(oData.aDestinataire).forEach((sDestinataire:string) => {
    
                    if(Object.keys(oData.aDestinataire).indexOf(sDestinataire) == 0) {
    
                        test('InputField [FOURNISSEUR][' + sDestinataire + '] = "' + sFournisseurClean + '"', async ()=> {
                            await fonction.sendKeys(pageAchAchFour.fAcheterInputFourn, sFournisseurClean.trim(), false, 'Fournisseur');
                            await fonction.wait(page, 500);
                        })
    
                        test('ListBox [PLATEFORME DE RECEPTION][' + sDestinataire + '] = "' + sPlateforme + '"', async () => {
                            await fonction.clickElement(pageAchAchFour.multiSelectPtfReception);
                            await fonction.sendKeys(pageAchAchFour.inputMultiFiltre.first(), sPlateforme, false, 'Plateforme de Reception');
                            await fonction.wait(page, 500);
                            await fonction.clickElement(pageAchAchFour.multiSelectAllChoices.nth(0));
                            await fonction.clickElement(pageAchAchFour.multiSelectClose);
                        })
            
                        test('ListBox [PLATEFORME DE DISTRIBUTION][' + sDestinataire + '] = "' + sPlateforme + '"', async () => {
                            await fonction.clickElement(pageAchAchFour.multiSelectPtfDistribution);
                            await fonction.sendKeys(pageAchAchFour.inputMultiFiltre.first(), sPlateforme, false, 'Plateforme de Distribution');
                            await fonction.wait(page, 500);
                            await fonction.clickElement(pageAchAchFour.multiSelectAllChoices.nth(0));
                            await fonction.clickElement(pageAchAchFour.multiSelectClose);
                            await fonction.wait(page, 1000);
                        })
             
                        test('ListBox [TYPE ACHAT][' + sDestinataire + ']', async () => {
                            await fonction.clickElement(pageAchAchFour.multiSelectTypeAchat);
                            await fonction.clickElement(pageAchAchFour.multiSelectTypeAchVide);
                            await fonction.clickElement(pageAchAchFour.multiSelectClose);
                            await fonction.wait(page, 1000);
                        })
                    }
                    
                    test('ListBox [DESTINATAIRE][' + sDestinataire + ']', async () => {
                        await fonction.clickElement(pageAchAchFour.multiSelectDestinataire);
                        await fonction.sendKeys(pageAchAchFour.inputMultiFiltre.first(), sDestinataire.trim(), false, 'Destinataire');
                        await fonction.wait(page, 500);
                        await fonction.clickElement(pageAchAchFour.multiSelectAllChoices.nth(0));
                        await fonction.clickElement(pageAchAchFour.multiSelectClose);
                        await fonction.wait(page, 1000);
                    })
        
                    test('Td [ARTICLE A ACHETER][LAST][' + sDestinataire + '] - Click', async () => {
                        await fonction.clickElement(pageAchAchFour.tdListAchat.last());
                    })
        
                    test('Button [MODIFIER][' + sDestinataire + '] - Click', async () => {
                        await fonction.clickAndWait(pageAchAchFour.buttonModifier, page);
                    })
        
                    oData.aCodeArticle.forEach((sCodeArticle:string, index:number) => {
                        test('Input [CODE ARTICLE][' + sDestinataire + '] = "' + sCodeArticle + '"',async () => {
                            await fonction.sendKeys(pageAchAchFour.pPinputFiltreCodeArticle, sCodeArticle, false, 'Code Article');
                            await fonction.wait(page, 1000);//Attendre que le filtre soit effectif;
                        })
            
                        test('Td [ACHETE (COLIS)][' + sDestinataire + '][' + sCodeArticle + '] - Check', async () => {
                            const sNbreLot:string = await pageAchAchFour.tdNumeroLotAchete.inputValue();
                            expect(parseInt(sNbreLot)).toBe(4);
                        })
            
                        test('Td [PRIX ACHAT][' + sDestinataire + '][' + sCodeArticle + '] - Check', async () => {
                            const sPrixAchat:string = await pageAchAchFour.inputPrixAchat.inputValue();
                            expect(parseFloat(sPrixAchat)).toBe(parseFloat(oData.aPrixCatalogue[index].replace(',', '.')));
                        })
                    });
    
                    test('Button [RETOUR A LA LISTE][' + sDestinataire + '] - Click', async () => {
                        await fonction.clickAndWait(pageAchAchFour.fAcheterbuttonRetourListe, page);
                    })
                })
            })
        }
       
    }) // end test.describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

    test('** CHECK FLUX **', async () => {
        var oFlux:TypeEsb = { 
            "FLUX" : [ 
                {
                    "NOM_FLUX"  : "EnvoyerLot_Prepa",
                    
                },
                {
                    "NOM_FLUX"  : "EnvoyerLot_Prefac",
                    
                },
                {
                    "NOM_FLUX"  : "EnvoyerLot_Stock",
                    
                },
                {
                    "NOM_FLUX"  : "EnvoyerLot_Repart",
                    
                },
                
            ],
            "WAIT_BEFORE"   : 10000,            // Optionnel    
        };

        await esb.checkFlux(oFlux, page);

    })

}) 