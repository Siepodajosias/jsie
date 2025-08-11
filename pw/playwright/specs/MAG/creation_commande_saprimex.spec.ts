/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 06 - 12 - 2023
 */

const xRefTest      = "MAG_CMD_SAP";
const xDescription  = "Effectuer une commande magasin Saprimex - Rayon Boucherie";
const xIdTest       =  2718;
const xVersion      = '3.14';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['ville', 'groupeArticle'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}       from '@playwright/test';

import { TestFunctions }                from "@helpers/functions";
import { Log }                          from "@helpers/log";
import { EsbFunctions }                 from "@helpers/esb";
import { Help }                         from '@helpers/helpers';

import { MenuMagasin }                  from '@pom/MAG/menu.page';
import { CommandesCommande }            from '@pom/MAG/commandes-commande.page';

import { CartoucheInfo, TypeEsb } 		from '@commun/types';

//-------------------------------------------------------------------------------------

let page          : Page;

let menu          : MenuMagasin;
let pageCmdsCmd   : CommandesCommande;

let esb           : EsbFunctions;

const log         = new Log();
const fonction    = new TestFunctions(log);

//----------------------------------------------------------------------------------------  

const sVilleCible        = fonction.getInitParam('ville', 'Agde (F718)'); 
const sGroupeArticle     = fonction.getInitParam('groupeArticle','Boucherie');

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    esb             = new EsbFunctions(fonction);
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageCmdsCmd     = new CommandesCommande(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    var bSuiteTest = false;

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });
 
    test('Connexion', async() => {
        await fonction.connexion(page);
    })

    test.describe ('Page [ACCUEIL]', async () => {

        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if(isVisible){
                await menu.removeArlerteMessage(page);
            }else{
                log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                test.skip();
            }
        })
    })

    test.describe ('Page [COMMANDES]', async () => {

        test ('Page [COMMANDES] - Click', async () => {
            await menu.click('commandes', page);
        })

        test ('ListBox [VILLE] = "' + sVilleCible + '"', async () => {
            await menu.selectVille(sVilleCible, page);
        })

         // On attendra que le que tous les spinner ne soient pas visible
         var spinner = 

        test ('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
            if (sGroupeArticle != 'Tous') {
                await fonction.listBoxByLabel(pageCmdsCmd.elistBoxGrpArticle, sGroupeArticle, page);    
            }        
        })

        test ('Button [A FAIRE] - Click', async () => {
            //-- Prise en compte du cas ou une alerte sanitaire s'afficherait en mode Modal !
            var isVisible = await menu.pPlabelAlerteSanitaire.isVisible();               
            if (isVisible) {   
                await menu.removeArlerteMessage(page);                     
            }                  
            expect(await pageCmdsCmd.clickButtonAFaire()).toBe(true);
        })

        test ('CheckBox [COMMANDE] = "Saprimex. (Boucherie)"', async () => {
            var iNbLibelleCmd = await pageCmdsCmd.dataGridLibelleCmd.count();
            
            if(iNbLibelleCmd > 0) {

                for ( let iLibelleCmd = 0 ; iLibelleCmd < iNbLibelleCmd; iLibelleCmd++){
                    var sCible = await pageCmdsCmd.dataGridLibelleCmd.nth(iLibelleCmd).textContent();
                    if(sCible.match(/^Saprimex/gi)){ 
                        bSuiteTest = true
                        await fonction.clickAndWait(pageCmdsCmd.dataGridLibelleCmd.nth(iLibelleCmd), page);
                        break;  
                    }else if((iLibelleCmd == iNbLibelleCmd - 1) && !sCible?.match(/^Saprimex/gi)){
                        log.set('Acune correspondance à Saprimex dans la liste de commande');
                        test.skip();
                    }
                }

            }else{
                log.set('AUCUNE COMMANDE EXISTANTE');
                test.skip();
            }

        })

        test ('Input Fields [COMMANDE + PREVISION] - Remplissage', async () => {
            
            test.setTimeout(60000);

            if(bSuiteTest){

                var ligneIsVisible = await fonction.selectorToBeCharged(pageCmdsCmd.lignesArticles.last());
                if (ligneIsVisible){

                    // Un temps mort pour attendre le chargement des differents champs
                    await fonction.selectorToBeCharged(pageCmdsCmd.inputQteCmdee.last());
                    await fonction.selectorToBeCharged(pageCmdsCmd.inputQtiePrev.last());
                    var nbLigneARemplir  = await pageCmdsCmd.lignesArticles.count();
                    for ( let indexArticle  = 0 ; indexArticle  < nbLigneARemplir; indexArticle ++){
            
                        var inputqteCmdIsVisible  = await pageCmdsCmd.inputQteCmdee.nth(indexArticle).isVisible();
                        var nbColis:any;

                        if(inputqteCmdIsVisible){

                            var defaultValue = await pageCmdsCmd.inputQteCmdee.nth(indexArticle).inputValue();                       // Une valeur est elle déjà en place ?  
                            if (defaultValue == '') { 
                                                                                                                
                                var sConditionnement =  await pageCmdsCmd.labelConditionnementD.nth(indexArticle).innerText();
                                await pageCmdsCmd.inputQteCmdee.nth(indexArticle).clear();
                                var cmdMinisVisible = await pageCmdsCmd.labelCommandeMinimum.nth(indexArticle).isVisible();        // Récupération info Multiple                                          
                                if ( fonction.random() > 0.5 ) {                                                // une ligne sur deux pour alléger le volume de données

                                    if (cmdMinisVisible) {                                                  // Si l'info est présente, on l'intègre    

                                        var infoMultiple = await pageCmdsCmd.labelCommandeMinimum.nth(indexArticle).textContent();                                    
                                        nbColis = infoMultiple?.match(/[-]{0,1}[\d.]*[\d]+/g);              //  Multiple de commande : 8 Unité(s) => 8
                                        await fonction.sendKeys(pageCmdsCmd.inputQteCmdee.nth(indexArticle), nbColis[0]);                                            
                                    }else {                                                               // On la cherche ailleurs...

                                        var tabs = sConditionnement.split(' ');                            // 3ème élément splité par un espace
                                        nbColis = parseFloat(tabs[2]);                                     // BO x 8 Unité(s) (1.25 Kg) => 8
                                        if ( typeof(nbColis) != 'number') {                                // BO x 12.8 Kg => 1

                                            nbColis = 1;
                                        }                                 
                                        await fonction.sendKeys(pageCmdsCmd.inputQteCmdee.nth(indexArticle), nbColis);     
                                    }
                                } else {                                                                  // Pas de commande pour cet article

                                    await fonction.sendKeys(pageCmdsCmd.inputQteCmdee.nth(indexArticle), '0'); 
                                }
                            } 
                        }                                           
                        
                        // --- Bloc Prévisions ----
                        var qtePrevIsVisible = await pageCmdsCmd.inputQtiePrev.nth(indexArticle).isVisible();
                        if (qtePrevIsVisible) {                                                                 // Un champ Input est il présent ?

                            defaultValue = await pageCmdsCmd.inputQtiePrev.nth(indexArticle).inputValue();
                            if (defaultValue == '') {                                                           // Une valeur est elle déjà en place ?  

                                var sConditionnement =  await pageCmdsCmd.labelConditionnementD.nth(indexArticle).innerText();
                                await pageCmdsCmd.inputQtiePrev.nth(indexArticle).clear();
                                var cmdMinisVisible = await pageCmdsCmd.labelCommandeMinimum.nth(indexArticle).isVisible();     // Récupération info Multiple

                                if ( fonction.random() > 0.5 ) {                                                // une ligne sur deux pour alléger le volume de données

                                    if (cmdMinisVisible) {                                                      // Si l'info est présente, on l'intègre
                                        var infoMultiple = await pageCmdsCmd.labelCommandeMinimum.nth(indexArticle).textContent();                                            
                                        nbColis = infoMultiple?.match(/[-]{0,1}[\d.]*[\d]+/g);                  //  Multiple de commande : 8 Unité(s) => 8
                                        await fonction.sendKeys(pageCmdsCmd.inputQtiePrev.nth(indexArticle), nbColis[0], false);
                                    } else {                                                                    // On la cherche ailleurs...
                                        var tabs = sConditionnement.split(' ');                                 // 3ème élément splité par un espace
                                        nbColis = parseFloat(tabs[2]);                                          // BO x 8 Unité(s) (1.25 Kg) => 8

                                        if (typeof(nbColis) != 'number') {                                      // BO x 12.8 Kg => 1         
                                            nbColis = 1;
                                        } 
                                        await fonction.sendKeys(pageCmdsCmd.inputQtiePrev.nth(indexArticle), nbColis, false);                                    
                                    }

                                } else {                                                                        // Pas de prévision de commande pour cet article
                                    await fonction.sendKeys(pageCmdsCmd.inputQtiePrev.nth(indexArticle), '0', false);
                                }

                            }                              
                        }
                    } 

                }else{
                    log.set('AUCUN REMPLISSAGE POSSIBLE');
                    bSuiteTest = false;
                }  

            }else{
                log.set('Input Fields [COMMANDE + PREVISION] - Remplissage : ACTION ANNULEE');
                test.skip();
            }

        })

        test ('Button [ENVOYER COMMANDE] - Click', async () => {
            if(bSuiteTest){
                await fonction.clickAndWait(pageCmdsCmd.buttonEnvoyer, page);
            }else{
                log.set('Button [ENVOYER COMMANDE] - Click : ACTION ANNULEE');
                test.skip();
            }
        })

        test.describe.skip ('Popin [???]', async () => {
            test ('Button [CONFIRMER L\'ENVOI] - Click Optionnel', async () => { 
                if(bSuiteTest){
                    var isVisible = await pageCmdsCmd.pPconfArtNonComButConf.isVisible();               
                    if(isVisible){  
                        await fonction.clickAndWait(pageCmdsCmd.pPconfArtNonComButConf, page);                                   
                    }else{
                        log.set('Pas de message d\'avertissement "ERREUR PROBABLE DE QUANTITE" affiché');
                        test.skip();
                    }
                }else{
                    log.set('Button [CONFIRMER] - Click Optionnel : ACTION ANNULEE');
                    test.skip();
                }               
            })
        })

        test.describe ('Popin [ARTICLE NON COMMANDE]', async () => {
            test ('Button [CONFIRMER] - Click Optionnel', async () => { 
                if(bSuiteTest){
                    var isVisible = await pageCmdsCmd.pPconfArtNonComButConf.isVisible();               
                    if(isVisible){  
                        await fonction.clickAndWait(pageCmdsCmd.pPconfArtNonComButConf, page);                                   
                    }else{
                        log.set('Pas de message d\'avertissement affiché');
                        test.skip();
                    }
                }else{
                    log.set('Button [CONFIRMER] - Click Optionnel : ACTION ANNULEE');
                    test.skip();
                }               
            })
        })

        test.describe ('Popin [ERREUR PROBABLE DE QUANTITE]', async () => {
            test ('Button [CONFIRMER L\'ENVOI] - Click Optionnel', async () => { 
                if(bSuiteTest){
                    var isVisible = await pageCmdsCmd.pPerrProbaQteButConf.isVisible();                 
                    if(isVisible){                                
                        await fonction.clickAndWait(pageCmdsCmd.pPerrProbaQteButConf, page);                                   
                    }else{
                        log.set('Pas de message d\'avertissement "ERREUR PROBABLE" affiché');
                        test.skip();
                    }
                }else{
                    log.set('Button [ CONFIRMER L\'ENVOI ] - Click Optionnel : ACTION ANNULEE');
                    test.skip();
                }              
            })
        })

        test ('Label [DATE DERNIER ENVOI] - Visible', async () => {
            if(bSuiteTest){
                var isVisible = await pageCmdsCmd.labelDernierEnvoi.first().isVisible();
                if(isVisible){
                    var sText = await  pageCmdsCmd.labelDernierEnvoi.first().textContent();
                    log.set('Lieu de Vente : ' + sVilleCible + ' - ' + sText);
                }else {
                    log.set('La date du dernier envoi n\'est pas affichée');
                    test.skip();
                }
            }else{
                log.set('Label [DATE DERNIER ENVOI] - Visible: VERIFICATION ANNULEE');
                test.skip();
            }
        })        

        test ('Label [ERREUR] - Is Not Visible', async () => {  // Pas d'erreur [6116] affichée à la fin de l'action
            if(bSuiteTest){                
                await fonction.isErrorDisplayed(false, page);
            }else{
                log.set('Label [ERREUR] - Is Not Visible : VERIFICATION ANNULEE');
            }
        })                                    
    })

    test ('Page [STOCK] - Click', async () => {
        await menu.click('stock', page);
    })

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

    test ('** CHECK FLUX **', async () =>  {

        if (bSuiteTest) {

            const oFlux:TypeEsb = { 
                FLUX : [
                    {
                        NOM_FLUX    : "EnvoyerCommande_Achat",
                        STOP_ON_FAILURE  : true
                    }, 
                    {
                        NOM_FLUX    : "EnvoyerCommandeMagasin",
                        STOP_ON_FAILURE  : true
                    }, 
                    {
                        NOM_FLUX    : "Diffuser_Commande",
                        STOP_ON_FAILURE  : true
                    }, 
                    {
                        NOM_FLUX    : "EnvoyerVolumeCommande_Dart",
                        STOP_ON_FAILURE  : false
                    }
                ],
                WAIT_BEFORE     : 15000,                // Optionnel
                STOP_ON_FAILURE : false
            };
            await esb.checkFlux(oFlux, page);

        } else {

            log.set('Check Flux : ACTION ANNULEE');
            test.skip();

        }

    })
    
})