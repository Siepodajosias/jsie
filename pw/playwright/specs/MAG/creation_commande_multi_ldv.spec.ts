/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 06 - 12 - 2023
 */

const xRefTest      = "MAG_CMD_MLV";
const xDescription  = "Effectuer une commande pour plusieurs lieux de vente pour le Rayon xxx et pour la Commande yyy";
const xIdTest       =  83;
const xVersion      = '3.7';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Sensible à l\'heure du lancement',],
    params      : ['listeMagasins', 'groupeArticle', 'typeAssortiment', 'tauxSaisieCmde', 'E2E'],
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

import { CartoucheInfo, TypeEsb }     	from '@commun/types';

//-------------------------------------------------------------------------------------

let page          : Page;

let menu          : MenuMagasin;
let pageCmdsCmd   : CommandesCommande;

let esb           : EsbFunctions;

const log         = new Log();
const fonction    = new TestFunctions(log);

//----------------------------------------------------------------------------------------  

fonction.importJdd();

const sFileJdd          = fonction.getLocalConfig('jddLieuxVente');
const varianteLieuVente = fonction.readFile(sFileJdd);

var maDate              = new Date(); 
const dateJour          = maDate.getFullYear().toString().slice(-2) + fonction.addZero(maDate.getMonth() + 1) + fonction.addZero(maDate.getDate());

var aListeVilles        = fonction.getInitParam('listeMagasins', 'Bergerac,Bron');
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Tous');
const sTauxRemplissage  = fonction.getInitParam('tauxSaisieCmde', '0.5');
const sTypeAssortiment  = fonction.getInitParam('typeAssortiment', 'Achats centrale');
const sDesignGrpAssort  = fonction.getInitParam('nomAssortiment', 'TA_' + sTypeAssortiment + ' ' + sGroupeArticle + ' ' + dateJour + ':' + maDate.getDate().toString() + maDate.getHours());    // §§§-1 Ref Inter Scénarios 
var iRndCmdMax          = fonction.getInitParam('rndCommandeMax', '0');
var iRndCmdMin          = fonction.getInitParam('rndCommandeMin', '0');
//-----------------------------------------------------------------------------------------

// La liste des lieux de vente cible peut être :
//    * Soit celle contenue dans le fichier de conf par défaut de l'application (array)
//    * Soit celle contenue dans le JDD (array)
//    * Soit celle passée en argument (string). Ex "ville1 , ville2 , ville3".
// Dans ce dernier cas, cette chaîne doit être transofmrée en tableau pour pouvoir être traitée.

if (typeof(aListeVilles) === 'string' ) {
    aListeVilles = aListeVilles.split(',');
}

//-----------------------------------------------------------------------------------------

var saisirCommande = async (sLieuDeVente:string, bSuiteTest:boolean = false) => {

    const iDelay:number = 120000;
    test.setTimeout(iDelay);
    
    // Le lieu de vente peut contenir le suffixe parasite " (FRESH)".
    log.set('Lieu de Vente : ' + sLieuDeVente);
    log.separateur();

    await menu.selectVille(sLieuDeVente, page);

    if (sGroupeArticle != 'Tous') {
        await pageCmdsCmd.selectGroupeArticle(sGroupeArticle);
    } 
    
    //-- Prise en compte du cas ou une alerte sanitaire s'afficherait en mode Modal !
    var isVisible = await menu.pPlabelAlerteSanitaire.isVisible();               
    if (isVisible) {   
        await menu.removeArlerteMessage(page);                     
    }  

    expect(await pageCmdsCmd.clickButtonAFaire()).toBe(true); 

    var iNbLibelle = await pageCmdsCmd.dataGridLibelleCmd.count();
    
    if(iNbLibelle > 0){

        console.log('Nom de commande recherchée : ' + sDesignGrpAssort);
        log.set('Nom de commande recherchée : ' + sDesignGrpAssort);

        for(let iIndexLibelle = 0; iIndexLibelle < iNbLibelle; iIndexLibelle++){

            var sTexte = await pageCmdsCmd.dataGridLibelleCmd.nth(iIndexLibelle).textContent();
            console.log('Commande proposée : ' + sTexte);

            if(sTexte?.match(sDesignGrpAssort)){
                console.log('### Commande Trouvée ! ###');
                bSuiteTest = true;
                await fonction.clickAndWait(pageCmdsCmd.dataGridLibelleCmd.nth(iIndexLibelle), page);
                break;
            }
        }    
        
    }

    if(bSuiteTest){

        await pageCmdsCmd.lignesArticles.last().waitFor();
        var iNbArticles = await pageCmdsCmd.lignesArticles.count();
        log.set('Nombre d\'articles : ' + iNbArticles);

        for (let iIndexLigneArticle = 0; iIndexLigneArticle < iNbArticles; iIndexLigneArticle++){

            await pageCmdsCmd.lignesArticles.nth(iIndexLigneArticle).click();
            var iNbColis:any;
            var sCodeArticle = await pageCmdsCmd.tdCodeArticle.nth(iIndexLigneArticle).textContent();
            log.set("Article : " + sCodeArticle);
    
            var isVisiblecmndeMin = await pageCmdsCmd.labelCommandeMinimum.isVisible();   // Récupération info Multiple   

            // Détermination nombre de colis minimal
            if (isVisiblecmndeMin) {                                                // Si l'info est présente, on l'intègre
    
                var infoMultiple = await pageCmdsCmd.labelCommandeMinimum.textContent();  
    
                var nbColis = infoMultiple?.match(/[-]{0,1}[\d.]*[\d]+/g);          //  Multiple de commande : 8 Unité(s) => 8 
                if(nbColis != undefined && nbColis != null){
                    iNbColis = nbColis[0];         
                    log.set(fonction.cleanTexte(infoMultiple) + " => " + iNbColis);
                }

                // Randomisation du nombre de colis commandés dans une fourchette min - max (si ces bornes existents)
                if (parseInt(iRndCmdMin) > 0 && parseInt(iRndCmdMax) > 0) {
                    if (parseInt(iRndCmdMin) < iNbColis) {
                        log.set('INFO : /!\\ Randomisation : La borne inférieure (' + iRndCmdMin + ') est inférieure au mulitple minimal requis (' + iNbColis + '). Utilisation du multiple minimal');
                        iRndCmdMin = iNbColis;
                    }
                    iNbColis = Math.floor(fonction.random() * (parseInt(iRndCmdMax) - parseInt(iRndCmdMin))) + parseInt(iRndCmdMin);
                }

            } else {                                                    // On la cherche ailleurs...
    
                log.set("Etiquette multiple absente");
                var sConditionnement = await pageCmdsCmd.labelConditionnementD.nth(iIndexLigneArticle).innerText();
                log.set("Désignation : " + sConditionnement);
                var tabs = sConditionnement.split(' ');                 // 3ème élément splité par un espace
                iNbColis = tabs[2];                                     // BO x 8 Unité(s) (1.25 Kg) => 8
                if ( typeof(nbColis) != 'number') {                     // BO x 12.8 Kg => 1         
                    iNbColis = 1;
                }                     

                // Randomisation du nombre de colis commandés dans une fourchette min - max (si ces bornes existents)
                if (parseInt(iRndCmdMin) > 0 && parseInt(iRndCmdMax) > 0) {
                    iNbColis = Math.floor(fonction.random() * (parseInt(iRndCmdMax) - parseInt(iRndCmdMin))) + parseInt(iRndCmdMin);
                } 

            }
    
            //-- Quantité Commandées --
            var inputqteCmdIsVisible  = await pageCmdsCmd.inputQteCmdee.nth(iIndexLigneArticle).isVisible();
    
            if (inputqteCmdIsVisible) {                                             // Un champ Input est il présent ?
    
                var defaultValue = await pageCmdsCmd.inputQteCmdee.nth(iIndexLigneArticle).inputValue();   

                if (defaultValue == '') {                                                                                                                                                       
                    if ( fonction.random() < parseFloat(sTauxRemplissage) ) {       // une ligne sur X pour alléger le volume de données    
                        log.set("Quantité Commandées : " + iNbColis);
                        await fonction.sendKeys(pageCmdsCmd.inputQteCmdee.nth(iIndexLigneArticle), iNbColis, false, 'Quantité Commandée');        
                    } else {                                                        // Pas de commande pour cet article    
                        log.set("Quantité Commandées : 0");
                        await fonction.sendKeys(pageCmdsCmd.inputQteCmdee.nth(iIndexLigneArticle), '0', false, 'Quantité Commandée'); 
                    }
                }
            }
    
            //-- Quantités prévisionelles --
            var qtePrevIsVisible = await pageCmdsCmd.inputQtiePrev.nth(iIndexLigneArticle).isVisible();
            if (qtePrevIsVisible) {                                                 // Un champ Input est il présent ?
    
                defaultValue = await pageCmdsCmd.inputQtiePrev.nth(iIndexLigneArticle).inputValue();

                if (defaultValue == '') {                                      
                    if (fonction.random() < parseFloat(sTauxRemplissage)) {         // une ligne sur X pour alléger le volume de données    
                        log.set("Quantités Prévisionelles : " + iNbColis);
                        await fonction.sendKeys(pageCmdsCmd.inputQtiePrev.nth(iIndexLigneArticle), iNbColis, false, 'Quantité Prévisionnelle');                                   
                    } else {                                                        // Pas de prévision de commande pour cet article
                        log.set("Quantités Prévisionelles 0");
                        await fonction.sendKeys(pageCmdsCmd.inputQtiePrev.nth(iIndexLigneArticle), '0', false, 'Quantité Prévisionnelle'); 
                    }
                }   

            }
            log.separateur();
        }
    
        expect(await pageCmdsCmd.clickButtonAFaire()).toBe(true);                   // Désactivation bouton A FAIRE aprés avoir passé commande
        await fonction.clickAndWait(pageCmdsCmd.buttonEnvoyer, page, iDelay); 
        var isVisibleAlerteErrQte = await pageCmdsCmd.pPalerteErrQte.isVisible();   // Controle sur les quantités commandées par rapport aux ventes des dernières semaines. Pas tester pour l'instant, on confirme par défaut si la pop up s'affiche.
        
        if (isVisibleAlerteErrQte) {
            await fonction.clickAndWait(pageCmdsCmd.pPbuttonErrConfirmer, page);
        }
    
        var labelDernierEnvoi = await pageCmdsCmd.labelDernierEnvoi.first().innerText();
        if(labelDernierEnvoi){
            log.set('Lieu de Vente : ' + sLieuDeVente + ' - ' + labelDernierEnvoi); // /!\ Affichage Pas systématique
        }

    }else{

        log.set('Aucune commande rétrouvée pour le lieu de vente : ' + sLieuDeVente);
        //throw new Error('Ooops: Aucune commande rétrouvée pour le lieu de vente ' + sLieuDeVente);

    }
};

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    esb             = new EsbFunctions(fonction);
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageCmdsCmd     = new CommandesCommande(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async ({}, testInfo) => {
    fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    var bSuiteTest = false; 

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
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
            
            log.set('Groupe Article : ' + sGroupeArticle);
            fonction.addDataSheet('ListBox', 'Groupe Article', sGroupeArticle);

            log.set('Nom Commande : ' + sDesignGrpAssort);

            await menu.click('commandes', page);
        })

        aListeVilles.forEach((sLieuDeVente:string) => {
            sLieuDeVente = sLieuDeVente.replace(' (Fresh)', '');
            sLieuDeVente = varianteLieuVente[sLieuDeVente];
            if (sLieuDeVente !== undefined) {
                test ('** Lieu de vente ' + sLieuDeVente+ ': Traitement de commande **', async () => {            
                    await saisirCommande(sLieuDeVente, bSuiteTest);  
                }) 
            } else {
                console.log('Oooops : lieu de vente non trouvé !');
            }
        })     
        
        test ('Label [ERREUR] - Is Not Visible', async () => {  // Pas d'erreur [6116] affichée à la fin de l'action
            await fonction.isErrorDisplayed(false, page);
        })

    })

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

    test ('** CHECK FLUX **', async () =>  {
            
        const oFlux:TypeEsb = { 
            FLUX : [
                {
                    NOM_FLUX    : "EnvoyerCommandeMagasin",
                    STOP_ON_FAILURE  : true
                }, 
                {
                    NOM_FLUX    : "EnvoyerCommande_Achat",
                    STOP_ON_FAILURE  : true
                },
                {
                    NOM_FLUX    : "EnvoyerVolumeCommande_Dart",
                    STOP_ON_FAILURE  : true
                }
            ],
            WAIT_BEFORE     : 3000,                // Optionnel
        };
        await esb.checkFlux(oFlux, page);
    
    })

})