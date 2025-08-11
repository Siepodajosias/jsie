/**
 * 
 * @author JOSIAS SIE 
 * @since 2024-10-30
 * 
 */
const xRefTest      = "MAG_CDE_VBF";
const xDescription  = "Passer les commandes poisson sur l'enseigne Biofrais";
const xIdTest       =  9658;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['ville', 'nomAssortiment', 'groupeArticle','nombreArticle'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page, expect}from '@playwright/test';

import { TestFunctions }         from "@helpers/functions";
import { Log }                   from "@helpers/log";
import { EsbFunctions }          from "@helpers/esb";
import { Help }                  from '@helpers/helpers';

import { MenuMagasin }           from '@pom/MAG/menu.page';
import { CommandesCommande }     from '@pom/MAG/commandes-commande.page';

import { CartoucheInfo, TypeEsb }from '@commun/types';

//-------------------------------------------------------------------------------------

let page          : Page;

let menu          : MenuMagasin;
let pageCmdsCmd   : CommandesCommande;

let esb           : EsbFunctions;

const log         = new Log();
const fonction    = new TestFunctions(log);

//----------------------------------------------------------------------------------------  
var oData:any       = fonction.importJdd();

const sVilleCible   = fonction.getInitParam('ville', 'Biofrais (B933)'); //Annecy (Biofrais) (B003), Annemasse (Biofrais) (B004), Bonneville (Biofrais) (B002), Saint-Julien (Biofrais) (B001)
const sLibelleCmd   = fonction.getInitParam('nomAssortiment', 'Barquette (Marée)');
const sGroupeArticle= fonction.getInitParam('groupeArticle','Marée');
const iQuantiteCmd  = fonction.getInitParam('nombreArticle',3);
//----------------------------------------------------------------------------------------
var data  = {
    iNbCommande   : 0,
    iNbPrevision  : 0,
    sDateLivraison: '',
    sArticle      : {}
}

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

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })
 
    test('Connexion', async() => {
        await fonction.connexion(page);
    })

    test.describe ('Page [ACCUEIL]', async () => {

        test ('ListBox [VILLE] = "' + sVilleCible + '"', async () => {
            await menu.selectVille(sVilleCible, page);
        })
        
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

        test('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
            await fonction.listBoxByLabel(pageCmdsCmd.listBoxGrpArticle, sGroupeArticle, page);       
        })
        
        test ('** TRAITEMENT - [ALERTE]**', async () => {
            //-- Prise en compte du cas ou une alerte sanitaire s'afficherait en mode Modal !
            var isVisible = await menu.pPlabelAlerteSanitaire.isVisible();               
            if (isVisible) {   
                await menu.removeArlerteMessage(page);                     
            }  
        })

        test ('CheckBox [COMMANDE] =  ['+sLibelleCmd+']', async () => {
            var iNbLibelleCmd  = await pageCmdsCmd.dataGridLibelleCmd.count();
            if(iNbLibelleCmd > 0) {
                for(let i=0;i<iNbLibelleCmd;i++){
                    var libelleCmd = await pageCmdsCmd.dataGridLibelleCmd.locator('span').nth(i).textContent();
                    if(libelleCmd.includes(sLibelleCmd)){
                        await fonction.clickAndWait(pageCmdsCmd.dataGridLibelleCmd.nth(i), page);
                    }
                }
            }else{
                log.set('AUCUNE COMMANDE EXISTANTE');
                test.skip();
            }
        })

        test ('Td [DATE DE LIVRAISON]', async () => {    
            var sDate           = await pageCmdsCmd.tdDateLivraison.textContent();
            data.sDateLivraison = sDate.slice(8,12).trim();
        }) 

        test ('Input Fields [COMMANDE + PREVISION][rnd] - Remplissage', async () => {
                test.setTimeout(60000);
                var ligneIsVisible = await pageCmdsCmd.lignesArticles.first().isVisible();
                if (ligneIsVisible){
                    // Un temps mort pour attendre le chargement des differents champs
                    await pageCmdsCmd.inputQteCmdee.last().waitFor({state:'visible'});
                    await pageCmdsCmd.inputQtiePrev.last().waitFor({state:'visible'});

                    var nbLigneARemplir  = await pageCmdsCmd.lignesArticles.count();
                    var iNbreArticle     = 1;
                    for (let indexArticle= 0 ; indexArticle  < nbLigneARemplir; indexArticle ++){
                        var inputqteCmdIsVisible= await pageCmdsCmd.lignesArticles.nth(indexArticle).locator('.datagrid-quantiteCommandee > input').isVisible();
                        var qtePrevIsVisible    = await pageCmdsCmd.lignesArticles.nth(indexArticle).locator('td.datagrid-quantitePrevisionnelle > input').isVisible();
                        var nbColis:any;
                        var nbQuantCmd: any;

                        if(inputqteCmdIsVisible && qtePrevIsVisible){
                            var sNomArticle = await pageCmdsCmd.lignesArticles.nth(indexArticle).locator('td.datagrid-article-code').textContent();
                            var dataArticle = {
                                iNbCommande : undefined,
                                iNbPrevision: undefined
                            }

                            // --- Bloc commandes ----
                            var sConditionnement= await pageCmdsCmd.labelConditionnementD.nth(indexArticle).innerText(); 
                            var tabs        = sConditionnement.split(' ');                     // 3ème élément splité par un espace
                            var nbConditCmd = parseFloat(tabs[2]);                             // BO x 8 Unité(s) (1.25 Kg) => 8
                            nbQuantCmd      = nbConditCmd;

                            await fonction.sendKeys(pageCmdsCmd.lignesArticles.nth(indexArticle).locator('.datagrid-quantiteCommandee > input'), nbQuantCmd, false, 'Commandes');
                            nbColis = nbQuantCmd / nbQuantCmd; 

                            data.iNbCommande       = data.iNbCommande + nbColis;
                            dataArticle.iNbCommande= nbColis;

                            if(oData?.iNbCommande!=undefined && iNbreArticle == iQuantiteCmd){
                                data.iNbCommande  = data.iNbCommande + oData?.iNbCommande;
                            }
                            if(oData?.sArticle[sNomArticle] != undefined){
                                dataArticle.iNbCommande= nbColis + oData.sArticle[sNomArticle].iNbCommande;
                            }
                            log.set('Commande : ' + nbColis); 

                            // --- Bloc Prévisions ----
                            var nbPrevsion= nbQuantCmd*2;
                            await fonction.sendKeys(pageCmdsCmd.lignesArticles.nth(indexArticle).locator('td.datagrid-quantitePrevisionnelle > input'), nbPrevsion,false, 'Prévisions');
                            data.iNbPrevision       = data.iNbPrevision + (nbPrevsion / nbConditCmd);
                            dataArticle.iNbPrevision= nbPrevsion / nbConditCmd;

                            if(oData?.iNbPrevision!=undefined && iNbreArticle == iQuantiteCmd){
                                data.iNbPrevision  = data.iNbPrevision + oData?.iNbPrevision;
                            }
                            if(oData?.sArticle[sNomArticle] != undefined){
                                dataArticle.iNbPrevision= (nbPrevsion / nbConditCmd) + oData.sArticle[sNomArticle].iNbPrevision;
                            }
                            log.set('Prévisions : ' + nbPrevsion);

                            data.sArticle[sNomArticle] = dataArticle;
                            log.set('Article : ' + sNomArticle + ' index : ' + indexArticle);                        
                            if(iNbreArticle == iQuantiteCmd){
                                break;
                            }
                            iNbreArticle +=1;
                        }                       
                    }
                }else{
                    log.set('AUCUN REMPLISSAGE POSSIBLE');
                }  

                if(oData != undefined){
                    var sCodeArticles= Object.keys(oData.sArticle); 
                    sCodeArticles.forEach((codeArticle: string) => {
                        if(data.sArticle[codeArticle] == undefined){
                            dataArticle.iNbCommande   = oData.sArticle[codeArticle].iNbCommande;
                            dataArticle.iNbPrevision  = oData.sArticle[codeArticle].iNbPrevision;
                            data.sArticle[codeArticle]= dataArticle;
                        }
                    });
                }
        })

        test ('Button [ENVOYER COMMANDE] - Click', async () => {
            await fonction.clickAndWait(pageCmdsCmd.buttonEnvoyer, page);
        })

        test ('** Wait Until Spinner Off - Commande**', async () => {
            const iDelayTimeOut = 60000;
            test.setTimeout(iDelayTimeOut); //-- L'ffichage peut durer plusieurs minutes !  
            await expect(pageCmdsCmd.pPspinnerEnvoiCommande).not.toBeVisible({timeout:iDelayTimeOut});
        })

        test.describe ('Popin [ARTICLE NON COMMANDE]', async () => {
            test ('Button [CONFIRMER] - Click Optionnel', async () => {
                var isVisible = await pageCmdsCmd.pPconfArtNonComButConf.isVisible();               
                if(isVisible){  
                    await fonction.clickAndWait(pageCmdsCmd.pPconfArtNonComButConf, page);                                   
                }else{
                    log.set('Pas de message d\'avertissement affiché');
                    test.skip();
                }               
            })
        })

        test.describe ('Popin [ERREUR PROBABLE DE QUANTITE]', async () => {
            test ('Button [CONFIRMER L\'ENVOI] - Click Optionnel', async () => { 
                var isVisible = await pageCmdsCmd.pPerrProbaQteButConf.isVisible();                 
                if(isVisible){                                
                    await fonction.clickAndWait(pageCmdsCmd.pPerrProbaQteButConf, page);                                   
                }else{
                    log.set('Pas de message d\'avertissement "ERREUR PROBABLE" affiché');
                    test.skip();
                }
            })
        })

        test ('Label [DATE DERNIER ENVOI] - Visible', async () => {
            await fonction.wait(page, 4000); //Wait temporaire pour des questions d'environnement instable.

            var isVisible = await pageCmdsCmd.labelDernierEnvoi.first().isVisible();
            if(isVisible){
                var sText = await  pageCmdsCmd.labelDernierEnvoi.first().textContent();
                log.set('Lieu de Vente : ' + sVilleCible + ' - ' + sText);
            }else {
                log.set('La date du dernier envoi n\'est pas affichée');
                test.skip();
            }
        }) 
        await fonction.writeData(data);                             
    })

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

    test ('** CHECK FLUX **', async () =>  {
        const oFlux:TypeEsb = { 
            "FLUX" : [
                {
                    NOM_FLUX    : "Diffuser_CommandeRegroupement",
                    STOP_ON_FAILURE  : false
                },
                {
                    NOM_FLUX    : "EnvoyerCommande_Achat",
                    STOP_ON_FAILURE  : false,
                    STATUS: false
                },
                {
                    NOM_FLUX    : "EnvoyerCommandeMagasin",
                    STOP_ON_FAILURE  : false,
                    STATUS: false
                },
                {
                    NOM_FLUX    : "Diffuser_Commande",
                    STOP_ON_FAILURE  : false,
                    STATUS: false
                }
            ],
            WAIT_BEFORE     : 15000, // Optionnel
            STOP_ON_FAILURE : false
        }

        await esb.checkFlux(oFlux, page);
    })
})