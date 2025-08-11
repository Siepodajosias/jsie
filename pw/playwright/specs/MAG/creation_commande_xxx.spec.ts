/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 18 - 12 - 2023
 */

const xRefTest      = "MAG_CMD_SAP";
const xDescription  = "Effectuer une commande magasin pour le Rayon xxx pour la Commande yyy";
const xIdTest       =  2752;
const xVersion      = '3.5.5';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Sensible à l\'heure du lancement - Check heures definie assortiments',],
    params      : ['ville', 'groupeArticle', 'nomCommande', 'tauxSaisieCmde'],
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

import { CartoucheInfo, TypeEsb }       from '@commun/types';

//-------------------------------------------------------------------------------------

let page          : Page;

let menu          : MenuMagasin;
let pageCmdsCmd   : CommandesCommande;

let esb           : EsbFunctions;

const log         = new Log();
const fonction    = new TestFunctions(log);

//----------------------------------------------------------------------------------------  

const sVilleCible       = fonction.getInitParam('ville', 'Agde (F718)');
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Tous');
const sTauxRemplissage  = fonction.getInitParam('tauxSaisieCmde','0.5');
const sNomCmmande       = fonction.getInitParam('nomCommande', 'Volaille');

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    esb             = new EsbFunctions(fonction);
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

    var bWorkToDo           = false;
    var dTauxRemplissage    = parseFloat(sTauxRemplissage);

    test ('Ouverture URL'+ fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [ACCUEIL]', async () => {

        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if(isVisible){
                await menu.removeArlerteMessage(page);
            }else{
                log.set('Link [BROWSER SECURITY WARNING] - Click: ACTION ANNULEE');
                test.skip();
            }
        })
    })

    test.describe('Page [COMMANDES]', async () => {
 
        test ('Page [COMMANDES] - Click', async () => {
            await menu.click('commandes', page);
        });  

        test ('ListBox [VILLE] = "' + sVilleCible + '"', async () => {
            await menu.selectVille(sVilleCible, page);
        })

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

        test ('CheckBox [COMMANDE] = "' + sNomCmmande + '"', async () => {    

            //await fonction.selectorToBeCharged(pageCmdsCmd.dataGridLibelleCmd.last());
    
            const aResponses:any = await pageCmdsCmd.dataGridLibelleCmd.allTextContents();

            if (aResponses.length > 0) {

                var iNbCommandes = aResponses.length;   //await pageCmdsCmd.dataGridLibelleCmd.count();
                var aIndexCmdeCorespd:number[] = [];    
                log.set('Nombre de commandes : ' + iNbCommandes);

                for(let iIndexCommande = 0; iIndexCommande < iNbCommandes; iIndexCommande++){
        
                    var sNomCommande = await pageCmdsCmd.dataGridLibelleCmd.nth(iIndexCommande).textContent();
                    sNomCmmande.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');              // Nettoyage de chaîne par sécurité                
                    var regex = new RegExp("^" + sNomCmmande + "", "gi");

                    if (sNomCommande?.match(regex)) {    
                        log.set('Commande à Faire : ' + sNomCommande + ' <-------');
                        bWorkToDo = true;
                        aIndexCmdeCorespd.push(iIndexCommande);
                    } else {    
                        log.set('Ignorée : ' + sNomCommande);
                    }
        
                    if(iIndexCommande == iNbCommandes - 1 ){
                        if(bWorkToDo){
                            await fonction.clickAndWait(pageCmdsCmd.dataGridLibelleCmd.nth(aIndexCmdeCorespd[0]), page);
                        }else{        
                            log.set('*** Aucune Commande réalisable avec ces critères ***');
                        }
                    }

                }

            }else {
                log.set('*** Aucune Commande réalisable avec ces critères ***');
                bWorkToDo = false;
            }

        }) 
    
        test ('Input Fields [COMMANDE] + [PREVISION] - Remplissage', async () => {

            const iTimetout:number = 1200000;
            test.setTimeout(iTimetout);

            if (bWorkToDo){
    
                var ligneArticleIsVisible = await fonction.selectorToBeCharged(pageCmdsCmd.lignesArticles.last());

                if(ligneArticleIsVisible){
    
                    var iNbArticles = await pageCmdsCmd.lignesArticles.count();

                    log.separateur();
                    log.set('Nombre d\'articles : ' + iNbArticles);

                    for(let iIndexArticle = 0; iIndexArticle < iNbArticles; iIndexArticle++){
    
                        var nbColis:any;
                        var articleIsVisible = await  pageCmdsCmd.inputQteCmdee.nth(iIndexArticle).isVisible();

                        if(articleIsVisible){
    
                            var defaultValue = await pageCmdsCmd.inputQteCmdee.nth(iIndexArticle).inputValue();
                            var sCodeArticle =  await pageCmdsCmd.labelCodetD.nth(iIndexArticle).innerText();

                            log.separateur();
                            log.set('# ' + iIndexArticle + ' - Code Article : ' + sCodeArticle);

                            if (defaultValue == '' || defaultValue == '0') {                                      // Une valeur est elle déjà en place ?
    
                                var sConditionnement=  await pageCmdsCmd.labelConditionnementD.nth(iIndexArticle).innerText();                                
                                await pageCmdsCmd.inputQteCmdee.nth(iIndexArticle).clear();
                                var cmdMinisVisible = await pageCmdsCmd.labelCommandeMinimum.nth(iIndexArticle).isVisible();        // Récupération info Multiple

                                if ( fonction.random() <  dTauxRemplissage) {
    
                                    if(cmdMinisVisible){
    
                                        var infoMultiple = await pageCmdsCmd.labelCommandeMinimum.nth(iIndexArticle).textContent();                                    
                                        nbColis = infoMultiple?.match(/[-]{0,1}[\d.]*[\d]+/g);              //  Multiple de commande : 8 Unité(s) => 8
                                        await fonction.sendKeys(pageCmdsCmd.inputQteCmdee.nth(iIndexArticle), Math.round(nbColis[0]), false, 'Nombre de colis');
                                        log.set('Nombre de colis : ' + Math.round(nbColis[0]));

                                    }else {                                                                 // On la cherche ailleurs...
    
                                        var tabs = sConditionnement.split(' ');                             // 3ème élément splité par un espace
                                        nbColis = parseFloat(tabs[2]);                                      // BO x 8 Unité(s) (1.25 Kg) => 8

                                        if ( typeof(nbColis) != 'number') {                                 // BO x 12.8 Kg => 1    
                                            nbColis = 1;
                                        }                                 

                                        await fonction.sendKeys(pageCmdsCmd.inputQteCmdee.nth(iIndexArticle), Math.round(nbColis), false, 'Nombre de colis');     
                                        log.set('Nombre de colis : ' + Math.round(nbColis));

                                    }

                                } else {                                                                    // Pas de commande pour cet article    
                                    await fonction.sendKeys(pageCmdsCmd.inputQteCmdee.nth(iIndexArticle), '0', false, 'Nombre de colis'); 
                                    log.set('Nombre de colis : 0');
                                }

                            }else{    
                                log.set('Article #' + iIndexArticle + ' valeur déjà saisie : ' + defaultValue);
                                continue;                                
                            }

                        }else{    
                            log.set('Article #' + iIndexArticle + ' non visible');
                            continue;
                        }
    
                        //-- Quantités prévisionelles --
                        var qtePrevIsVisible = await pageCmdsCmd.inputQtiePrev.nth(iIndexArticle).isVisible();

                        if (qtePrevIsVisible) {                                                                 // Un champ Input est il présent ?
    
                            defaultValue = await pageCmdsCmd.inputQtiePrev.nth(iIndexArticle).inputValue();
                            if (defaultValue == '' || defaultValue == '0') {                                                           // Une valeur est elle déjà en place ?   
    
                                var sConditionnement =  await pageCmdsCmd.labelConditionnementD.nth(iIndexArticle).innerText();
                                await pageCmdsCmd.inputQtiePrev.nth(iIndexArticle).clear();
                                var cmdMinisVisible = await pageCmdsCmd.labelCommandeMinimum.nth(iIndexArticle).isVisible();     // Récupération info Multiple

                                if ( fonction.random() > 0.5 ) {                                                // une ligne sur deux pour alléger le volume de données
    
                                    if (cmdMinisVisible) {                                                      // Si l'info est présente, on l'intègre
    
                                        var infoMultiple = await pageCmdsCmd.labelCommandeMinimum.nth(iIndexArticle).textContent();                                            
                                        nbColis = infoMultiple?.match(/[-]{0,1}[\d.]*[\d]+/g);                  //  Multiple de commande : 8 Unité(s) => 8
                                        await fonction.sendKeys(pageCmdsCmd.inputQtiePrev.nth(iIndexArticle), Math.round(nbColis[0]), false, 'Nombre de colis');
                                        log.set('Nombre de colis Prev : ' + Math.round(nbColis[0]));

                                    } else {                                                                    // On la cherche ailleurs...
    
                                        var tabs = sConditionnement.split(' ');                                 // 3ème élément splité par un espace
                                        nbColis = parseFloat(tabs[2]);                                                     // BO x 8 Unité(s) (1.25 Kg) => 8
    
                                        if (typeof(nbColis) != 'number') {                                      // BO x 12.8 Kg => 1       
                                            nbColis = 1;
                                        }  

                                        await fonction.sendKeys(pageCmdsCmd.inputQtiePrev.nth(iIndexArticle), Math.round(nbColis), false, 'Nombre de colis'); 
                                        log.set('Nombre de colis Prev : ' + Math.round(nbColis));

                                    }

                                } else {                                                                        // Pas de prévision de commande pour cet article
                                    await fonction.sendKeys(pageCmdsCmd.inputQtiePrev.nth(iIndexArticle), '0', false, 'Nombre de colis');
                                    log.set('Nombre de colis Prev : 0');
                                }

                            }else{    
                                log.set('Article (prev) #' + iIndexArticle + ' valeur déjà saisie : ' + defaultValue);
                                continue;
                            }  

                        }else{    
                            log.set('Article (prev) #' + iIndexArticle + ' non visible');
                            continue;
                        }
    
                        //-- Quantités prévisionelles suivantes --
                        var qtePrevSuivIsVisible = await pageCmdsCmd.inputQtePrevSuiv.nth(iIndexArticle).isVisible();

                        if (qtePrevSuivIsVisible) {                                                             // Un champ Input est il présent ?
    
                            defaultValue = await pageCmdsCmd.inputQtePrevSuiv.nth(iIndexArticle).inputValue();
                            if (defaultValue == '') {                                                           // Une valeur est elle déjà en place ?   
    
                                var sConditionnement =  await pageCmdsCmd.labelConditionnementD.nth(iIndexArticle).innerText();
                                await pageCmdsCmd.inputQtePrevSuiv.nth(iIndexArticle).clear();
                                var cmdMinisVisible = await pageCmdsCmd.labelCommandeMinimum.nth(iIndexArticle).isVisible();     // Récupération info Multiple

                                if ( fonction.random() > 0.5 ) {                                                // une ligne sur deux pour alléger le volume de données
    
                                    if (cmdMinisVisible) {                                                      // Si l'info est présente, on l'intègre
    
                                        var infoMultiple = await pageCmdsCmd.labelCommandeMinimum.nth(iIndexArticle).textContent();                                            
                                        nbColis = infoMultiple?.match(/[-]{0,1}[\d.]*[\d]+/g);                  //  Multiple de commande : 8 Unité(s) => 8
                                        await fonction.sendKeys(pageCmdsCmd.inputQtePrevSuiv.nth(iIndexArticle), Math.round(nbColis[0]), false, 'Nombre de colis');
                                        log.set('Nombre de colis Prev Suivante : ' + Math.round(nbColis[0]));

                                    } else {                                                                    // On la cherche ailleurs...
    
                                        var tabs = sConditionnement.split(' ');                                 // 3ème élément splité par un espace
                                        nbColis = parseFloat(tabs[2]);                                                     // BO x 8 Unité(s) (1.25 Kg) => 8
    
                                        if (typeof(nbColis) != 'number') {                                      // BO x 12.8 Kg => 1         
    
                                            nbColis = 1;
                                        }  
                                        await fonction.sendKeys(pageCmdsCmd.inputQtePrevSuiv.nth(iIndexArticle), Math.round(nbColis), false, 'Nombre de colis');   
                                        log.set('Nombre de colis Prev Suivante : ' + Math.round(nbColis));

                                    }

                                } else {                                                                         // Pas de prévision de commande pour cet article    
                                    await fonction.sendKeys(pageCmdsCmd.inputQtePrevSuiv.nth(iIndexArticle), '0', false, 'Nombre de colis');
                                    log.set('Nombre de colis Prev Suivante : 0');
                                }

                            }else{    
                                continue;
                            }       

                        }else{    
                            continue;
                        }

                    }

                }else{    
                    log.set('AUCUN REMPLISSAGE POSSIBLE');
                    bWorkToDo = false;
                } 

            }else{
                log.set('Input Fields [COMMANDE + PREVISION] - Remplissage: ACTION ANNULEE');
                test.skip();
            }

        })
    
        test ('Button [ENVOYER COMMANDE] - Click', async () => {
            if(bWorkToDo){
                await fonction.clickAndWait(pageCmdsCmd.buttonEnvoyer, page);
            }else{
                log.set('Button [ENVOYER COMMANDE] - Click: ACTION ANNULEE');
                test.skip();
            }
        })
    
        test ('Button [ CONFIRMER ] - Click Optionnel', async () => { 
            if(bWorkToDo){    
                var isVisible = await pageCmdsCmd.pPconfArtNonComButConf.isVisible();
                if(isVisible){      
                    await fonction.clickElement(pageCmdsCmd.pPconfArtNonComButConf);                                   
                }else{    
                    log.set('Pas de message d\'avertissement "ARTICLES NON COMMANDES" affiché');
                    test.skip();
                }
            }else{    
                log.set('Button [ CONFIRMER ] - Click Optionnel: ACTION ANNULEE');
                test.skip();
            }               
        })
    
        test ('Button [ CONFIRMER L\'ENVOI ] - Click Optionnel', async () => { 
            if(bWorkToDo){    
                var isVisible = await pageCmdsCmd.pPerrProbaQteButConf.isVisible();  
                if(isVisible){                              
                    await fonction.clickElement(pageCmdsCmd.pPerrProbaQteButConf);                                   
                }else{    
                    log.set('Pas de message d\'avertissement "ERREUR PROBABLE" affiché');
                    test.skip();
                }
            }else{    
                log.set('Button [ CONFIRMER L\'ENVOI ] - Click Optionnel : ACTION ANNULEE');
                test.skip();
            }              
        })
    
        test ('Label [ERREUR] - Is Not Visible', async () => {  // Pas d'erreur [6116] affichée à la fin de l'action
            if(bWorkToDo){
                
                await fonction.isErrorDisplayed(false, page);
            }else{
    
                log.set('Label [ERREUR] - Is Not Visible: VERIFICATION ANNULEE');
            }
        }) 

        test ('** Wait Until Spinner Off **', async () => {
            await fonction.waitForSpinner(pageCmdsCmd.pPspinnerEnvoiCommande);
        }) 

        test ('** Wait Until Message Success Off **', async () => {
            await fonction.waitForSpinner(pageCmdsCmd.pPMessageSuccess);
        }) 

    })

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

    test ('** CHECK FLUX **', async () =>  {

        if (bWorkToDo) {
            const oFlux:TypeEsb = { 
                FLUX : [
                    {
                        NOM_FLUX    : "EnvoyerCommandeMagasin",
                    }, 
                    {
                        NOM_FLUX    : "EnvoyerCommande_Achat",
                    }, 
                    {
                        NOM_FLUX    : "EnvoyerCommandeMagasin_Prepa",
                    }
                ],
                WAIT_BEFORE     : 3000,                // Optionnel
            };
            await esb.checkFlux(oFlux, page);
        } else {
            log.set('Check Flux : ACTION ANNULEE');
            test.skip();
        }

    })

})