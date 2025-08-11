/** 
 * @desc Envoyer un ordre unitairement sans le fusionner avec d'autres
 * 
 * @see REP_ORD_ENV
 * @since 2024-01-08
 * 
 * @author JOSIAS SIE
 * 
*/
const xRefTest      = "REP_ORD_ENV";  
const xDescription  = "Envoyer un ordre unitairement sans le fusionner avec d'autres";
const xIdTest       =  415;
const xVersion      = "3.1.1"; 
   
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'REPARTITION',
    version     : xVersion,
    refTest     : [xRefTest], 
    idTest      : xIdTest,
    help        : [],
    params      : ['plateformeDistribution','rayon','numeroLot','numAchatCourt'],
    fileName    : __filename
};  

//------------------------------------------------------------------------------------

import { test, type Page, expect }          from '@playwright/test';

import { Help }                             from '@helpers/helpers';
import { TestFunctions }                    from '@helpers/functions';
import { Log }                              from '@helpers/log';
import { EsbFunctions }                     from '@helpers/esb';

import { MenuRepartition }                  from '@pom/REP/menu.page';
import { OrdRepAEnvoyerPage }               from '@pom/REP/ordres-a_envoyer.page';
import { OrdRepEnvoyesPage }                from '@pom/REP/ordres-envoyes.page';

import { CartoucheInfo, TypeEsb } 			from '@commun/types/index';

//------------------------------------------------------------------------------------
let page                : Page;
let menu                : MenuRepartition;

let pageOrdres          : OrdRepAEnvoyerPage;
let pageOrdresEnv       : OrdRepEnvoyesPage;
let esb                 : EsbFunctions;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page                = await browser.newPage();
    menu                = new MenuRepartition(page, fonction);    
    pageOrdres          = new OrdRepAEnvoyerPage(page);
    pageOrdresEnv       = new OrdRepEnvoyesPage(page);
    esb                 = new EsbFunctions(fonction);
})

test.afterAll(async ({}, testInfo) => {
    fonction.close(testInfo);
})

//------------------------------------------------------------------------------------ 
var oData: any          = fonction.importJdd();

const bTous             = 'oui';   // bTous = non : envoi du premier ordre de la liste; bTous = oui : envoi de tous les ordres dans la liste
// Exploitation des paramètres passés en argument OU ceux présents dans le fichier de configuration Local
var sNumAchatCourt      = fonction.getInitParam('numAchatCourt', '');
var  aNumeroLot:any     = fonction.getInitParam('numeroLot', '');

const sPlateforme       = fonction.getInitParam('plateformeReception', 'Chaponnay');
const sRayon            = fonction.getInitParam('rayon', 'Fruits et légumes');

//------------------------------------------------------------------------------------    

if (oData !== undefined) {                         // On est dans le cadre d'un E2E. Récupération des données temporaires
    var sNumAchatE2E = oData.sNumAchatLong;        // L'élément recherché est le numéro d'achat préalablement créé dans le E2E
    var aListeLot    =  Object.keys(oData.aLots);  
    sNumAchatCourt   = sNumAchatE2E.substr(8);
    aNumeroLot       = aListeLot;      
    log.set('E2E - Liste des codes articles : ' + aListeLot + ' Numéro achat long : ' + sNumAchatE2E);  
}

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {  

    test ('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper    = new Help(info, testInfo, page);
        await helper.init();
    });

    test ('Ouverture URL', async () => {
        await fonction.openUrl(page);
    });

    test ('Connexion', async() => {
        await fonction.connexion(page);
    })
    // end describe

    test.describe ('Page [ORDRES A ENVOYER]', async () => {

        var sCurrentPage = 'ordres';
        test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {
            await menu.selectPlateforme(sPlateforme, page);
        })

        test ('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menu.selectRayon(sRayon, page);               // Sélection du rayon
            log.set('Rayon : ' + sRayon);
        });
        
        test ('Page [ORDRES REPARTITION]', async () => {
            await menu.click(sCurrentPage, page);  
        });    

        test ('Onglet [A ENVOYER] click', async () => {
            await menu.clickOnglet(sCurrentPage, 'a_envoyer',page);
        })
        
        test ('Button [ENVOYER SANS FUSIONNER] - Check', async () => {
            await fonction.isDisplayed(pageOrdres.buttonEnvoyerSansFusionner);
            await fonction.isDisplayed(pageOrdres.buttonFusionnerEtEnvoyer);
            await fonction.isDisplayed(pageOrdres.buttonAnnuler);
        })

        //Sélection de la 1ere ligne ou de toutes les lignes
        test ('checkbox [TOUS?] - click'+ bTous, async () => {
           if (bTous == 'oui') {
               await fonction.clickElement(pageOrdres.checkboxEnteteTableau);
            } else {
               await fonction.clickElement(pageOrdres.checkboxLigneArticlesList);
            }
        })

        test ('Button [ENVOYER SANS FUSIONNER][0] click', async () => {
              await fonction.clickAndWait(pageOrdres.buttonEnvoyerSansFusionner, page);
        })

        test ('Onglet [ENVOYES] click', async () => {
              await menu.clickOnglet(sCurrentPage, 'envoyes', page);
        })

        if (aNumeroLot != null) {    // Cas du E2E : controle que les ordres envoyés pour les articles correspondent bien aux lots et achats du E2E
            
            test.describe ('Controle [ORDRES] envoyés : ', () => {
                    
                aNumeroLot.forEach((sCodeArticle: any) => {
                    var iIndexNumLot = aNumeroLot.indexOf(sCodeArticle);
                    test ('Filtre sur code article :'+ sCodeArticle + ' [INDEX]=' + iIndexNumLot, async () => {
                        // on recherche uniquement sur article ==> on décoche les autres checkbox
                        await fonction.clickElement(pageOrdresEnv.checkboxOrdre);
                        await fonction.clickElement(pageOrdresEnv.checkBoxLot);
                        await fonction.clickElement(pageOrdresEnv.checkboxFournisseur);
                        await fonction.sendKeys(pageOrdresEnv.inputFiltre, sCodeArticle, false, 'Article');
                        await fonction.wait(page, 1000);
                    })
                    
                    test ('Check code article : ' + sCodeArticle + ' et N° lot : ' + oData.aLots[sCodeArticle], async () => {
                        var sNumAchCour   = await pageOrdresEnv.datagridNumAchat.nth(1).textContent();
                        await fonction.wait(page, 250);
                        expect(sNumAchCour).toBe(sNumAchatCourt);

                        var sNumLots: any = await pageOrdresEnv.datagridNumLot.nth(1).textContent();
                        var sNumLots: any = await sNumLots.substr(0,4); 
                        var sNumLot : any = oData.aLots[sCodeArticle]; 
                        await fonction.wait(page, 250);
                        expect(sNumLots).toBe(sNumLot);
                    })

                    test ('Récupération N° de feuille [INDEX] = ' + iIndexNumLot, async () => {
                        var sNumOrdre: any = await pageOrdresEnv.datagridNumOrdre.nth(1).textContent();
                        oData.aFeuille[sCodeArticle] = sNumOrdre;
                    })
                })
            })
        }

        await fonction.writeData(oData);

    }) // end describle

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

    test ('** CHECK FLUX **', async () => {
        if (sNumAchatCourt && aNumeroLot) {
            var oFlux:TypeEsb = { 
                "FLUX" : [
                    {
                        "NOM_FLUX" : "EnvoyerOrdrePreparation_Prepa",
                        STOP_ON_FAILURE  : true
                    }
                ],
                "WAIT_BEFORE"      : 5000,
            };
            await esb.checkFlux(oFlux, page);
        } else {
            log.set('Check Flux : ACTION ANNULEE');
            test.skip();
        }
    })
    
}) // end describle 