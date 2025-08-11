/**
 * 
 * @author SIAKA KONE
 * @since 2023-11-22
 * 
 */
const xRefTest      = "STO_AGR_ALL";
const xDescription  = "Accepter toute la marchandise reçue";
const xIdTest       =  265;
const xVersion      = '3.2';

var info = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,    
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateformeReception','fournisseur','acheteur'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }              from '@playwright/test';
import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';

import { MenuStock }                    from '@pom/STO/menu.page'; 
import { ReceptionAgreer }              from '@pom/STO/reception-agreer.page';
import { AgreerMarchandisePartielle }   from '@pom/STO/agreer-marchandise_partielle.page';

//------------------------------------------------------------------------------------
let page                        : Page;
let menu                        : MenuStock;
let pageReceptionLotAgreer      : ReceptionAgreer;
let pageAgreage                 : AgreerMarchandisePartielle;

//------------------------------------------------------------------------------------
const log           = new Log();
const fonction      = new TestFunctions(log);
//------------------------------------------------------------------------------------
var oData:any       = fonction.importJdd();             //Import du JDD pour le bout en bout
//------------------------------------------------------------------------------------
var sPlateforme     = fonction.getInitParam('plateformeReception','Chaponnay');
const sAcheteur     = fonction.getInitParam('acheteur','LUNETTES Kevin');
const sFournisseur  = fonction.getInitParam('fournisseur',"LES FRUITS ROUGES DE L'AISNE");  // ALP'UNION Dole exotics GAEC PETIT Tirel Roger SARL
//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page                    = await browser.newPage();
    menu                    = new MenuStock(page, fonction);
    pageReceptionLotAgreer  = new ReceptionAgreer(page);
    pageAgreage             = new AgreerMarchandisePartielle(page);
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']' , () => {

    test ('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper    = new Help(info, testInfo, page);
        await helper.init();
    });

    test ('Ouverture URL', async() => {
          await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    if(oData !== undefined) {                                  // On est dans le cadre d'un E2E. Récupération des données temporaires       
        var aListeLot =  Object.keys(oData.aLots);        
        log.set('E2E - Liste des articles : ' + aListeLot);    
    }

    //------------------------------------------------------------------------------------
    test.describe ('Page [RECEPTION]',() => {   

        sPlateforme = sPlateforme.charAt(0).toUpperCase() + sPlateforme.slice(1).toLowerCase();
        test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {            
            await menu.selectPlateforrme(page, sPlateforme);                     // Sélection d'une plateforme par défaut
        });

        var sNomPage = 'reception';
        test ('Page [RECEPTION] - Click', async () => {
            await menu.click(sNomPage, page);
        });    

        test.describe ('Onglet [LOTS A AGREER]', async () => {   

            test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {                    
				await menu.selectPlateforrme(page, sPlateforme);
				log.set('Plateforme : ' + sPlateforme);
			});

            var sNomOnglet = 'Lot à agréer'
            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'LotsAAgreer', page);         
            });

            test ('Input [ACHETEUR] = "'+  sAcheteur + '"', async () => {
                await fonction.sendKeys(pageReceptionLotAgreer.inputFiltreAcheteur, sAcheteur, false, 'Acheteur');
			});

            var selectFourniseur = async () =>{
                test.step('ListBox [FOURNISSEURS] = "' + sFournisseur + '"', async () => { 

                    // Dépliage de la Liste Déroulante
                    await fonction.clickAndWait(pageReceptionLotAgreer.listBoxFournisseurs, page);
    
                    // Nombre de choix
                    let iNbOptions = await pageReceptionLotAgreer.listBoxFournisseurs.locator('option').count();
    
                    const sMajFournisseur = sFournisseur.toUpperCase();
    
                    let sCible:string = '';
    
                    for (let iCpt = 0; iCpt < iNbOptions; iCpt++) {
    
                        // Examen de chaque choix
                        var sChoix = await pageReceptionLotAgreer.listBoxFournisseurs.locator('option').nth(iCpt).textContent();
    
                        //Mise en Majuscule et suppression des espaces exédentaires
                        var sMajChoix = sChoix?.toUpperCase().replace(/\s+/g,' ').trim();
                        
                        // Comparaison du choix proposé en majuscule avec la cible (sFournisseur) en majuscule
                        if( sMajChoix == sMajFournisseur && sChoix !== null) {
                            //console.log(">>>>>>>>>>>>> Cible : " + sFournisseur + " - " + sChoix);
                            sCible = sChoix;
                            break;
                        }
                    }
    
                    // Sélection sur la base de la cible...
                    if (sCible != '') {
                        await pageReceptionLotAgreer.listBoxFournisseurs.selectOption(sCible);
                        await fonction.addDataSheet('ListBox', 'Lot A Agréer', sCible);
                    }
                    
                    // Repliage de la Liste Déroulante
                    await pageReceptionLotAgreer.listBoxFournisseurs.click();
                });
            }

            test ('ListBox [FOURNISSEURS] = "' + sFournisseur + '"', async () => {
                test.setTimeout(60000); 
                await selectFourniseur();
                log.set('Nombre de lot à agréer : ' + aListeLot.length);
                await fonction.wait(page,10000); //Attendre que le filtre soit effectif.
            });

            test.describe ('Datagrid [LOTS A AGREER][FOURNISSEUR] = "' + sFournisseur +'"', async () => {   
                if(aListeLot[0] != null) {
                    aListeLot.forEach((sLot:string)=>{
                        test.describe ('Tr [LOTS A AGREER][' + oData.aLots[sLot] +'] - Click', async () =>{
                            
                            test ('ListBox [FOURNISSEURS] = "' + sFournisseur + '"', async () => { 
                                if(aListeLot.indexOf(sLot)>0){
                                    await selectFourniseur();
                                    await fonction.wait(page,10000);//Attendre que le filtre soit effectif.
                                }
                            });
                            
                            test ('Tr [LOTS A AGREER]'+'[' + oData.aLots[sLot] +']'+' - Click', async () => {
                                await pageReceptionLotAgreer.tdLotAagreer.first().waitFor(); // Attendre que le premier élément soit visible
                                await pageReceptionLotAgreer.tdLotAagreer.filter({hasText:oData.aLots[sLot]}).nth(0).click();
                                await fonction.addDataSheet('CheckBox', 'Lot A Agréer', oData.aLots[sLot]);
                            });
    
                            test ('Button [AGREER]'+'[' + oData.aLots[sLot] +']'+' - Click', async () => {
                                await pageReceptionLotAgreer.buttonAgreer.waitFor({state:'visible'});
                                await fonction.clickElement(pageReceptionLotAgreer.buttonAgreer);
                            });
    
                            test.describe ('Popin [AGREAGE DU LOT][' + oData.aLots[sLot] + ']', () =>{
    
                                test ('CheckBox [ARRIVAGE SELECTIONNE]'+'[' + oData.aLots[sLot] +']'+' - Click', async () => {
                                    await fonction.clickElement(pageAgreage.pCheckBoxSaisieRefus.nth(0));
                                });
                                
                                test ('Button [SAUVEGARDER]'+'[' + oData.aLots[sLot] +']'+' - Click', async () => {
                                    await pageReceptionLotAgreer.pButtonSauvegarder.waitFor({state:'visible'});
                                    await pageReceptionLotAgreer.pButtonSauvegarder.click();
                                });
        
                                test ('Button [CONFIRMER OUI]'+'[' + oData.aLots[sLot] +']'+' - Click', async () => {
                                    await fonction.clickAndWait(pageReceptionLotAgreer.pButtonConfirmeSauv.nth(0), page);
                                });
                            });
                        });
                    });
                }
			});

        });  //-- End Describe Onglet  

    }); //-- End Describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

});   