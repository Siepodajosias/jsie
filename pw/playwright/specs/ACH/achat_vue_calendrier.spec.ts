/**
 * @author JC CALVIERA
 * @desc Effectuer un achat Crèmerie en vue calendrier
 * @since 2024-03-15
 * 
 */
const xRefTest      = "ACH_CRM_CAL";
const xDescription  = "Effectuer un achat Crèmerie en vue calendrier";
const xIdTest       =  22;
const xVersion      = '3.0';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACH',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : ['dossierAchat', 'plateformeDistribution'],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { test, type Page}   from '@playwright/test';

import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { EsbFunctions }     from '@helpers/esb.js';
import { Log }              from '@helpers/log.js';

import { MenuAchats }       from '@pom/ACH/menu.page.js'; 
import { PageAchCalApp }    from '@pom/ACH/achats_calendrier-approvisionnement.page';

import { CartoucheInfo, TypeEsb } from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;
let pageAchat       : PageAchCalApp;
let esb             : EsbFunctions;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    pageAchat       = new PageAchCalApp(page); 
    esb             = new EsbFunctions(fonction);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------  

const sDossierAchat = fonction.getInitParam('dossierAchat', 'Adf');        
const sRayon        = 'Crèmerie';
var sNomPlateforme  = fonction.getInitParam('plateformeDistribution', '');
const iQteAchetee   = 8;

if (sNomPlateforme === '') {
    sNomPlateforme = fonction.getRandomArray(['Cremcentre', 'Cremlog', 'SudLog 2°']);
}

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', async () => {  
    
    let sIdSignature:string;
    let bEdi:boolean;
    let bCheckFlux:boolean = false;
    let bPopinVisible:boolean = false;

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACHATS]', async () => {

        var sNomPage = 'achats'; 

        test ('ListBox [RAYON] = "' + sRayon + '"', async () => {                    
            await menu.selectRayonByName(sRayon, page);
        })
        
        test ('Page [ACHATS] - Click', async() => {
            await menu.click(sNomPage, page, 60000);                
        })
        
        test ('ListBox [DOSSIER D\'ACHAT] = "' + sDossierAchat + '"', async() => {
            await fonction.listBoxByLabel(pageAchat.listBoxDossierAchat, sDossierAchat, page);
        })

        test ('td [PLATEFORME][rnd] - Click', async() => {            
            await fonction.clickAndWait(pageAchat.tdListPlateformes.locator('span:text-is("' + sNomPlateforme + '")'), page);
            log.set('Plateforme sélectionnée : ' + sNomPlateforme);

            const sTrigramePlateforme = Object.keys(fonction.getGlobalConfig('idPlateforme')).find(k=>fonction.getGlobalConfig('idPlateforme')[k]===sNomPlateforme);
            sIdSignature = fonction.getToday('US') + sTrigramePlateforme;          
            log.set('Signature : ' + sIdSignature);
        })

        test ('td [FOURNISSEURS][rnd] - Click', async() => {            
            const iNbFournisseurs = await pageAchat.tdListFournisseurs.count();
            const rnd = Math.floor(fonction.random() * iNbFournisseurs);
            const sNomFournisseur = await pageAchat.tdListFournisseurs.nth(rnd).textContent();
            log.set('Fournisseur sélectionné : ' + sNomFournisseur);
            log.set('Mode Envoi EDI : ' + (sNomFournisseur[sNomFournisseur.length - 1] == 'Ⓔ'));
            bEdi = (sNomFournisseur[sNomFournisseur.length - 1] == 'Ⓔ');
            await fonction.clickAndWait(pageAchat.tdListFournisseurs.nth(rnd), page);
        })

        test ('InputField [A ACHETER][n] = "' + iQteAchetee + '"', async() => {
            const iNbInput = await pageAchat.inputAchete.count();            
            if (iNbInput > 0) {
                test.setTimeout(60000);                             //-- Le remplissage des champs peut être long selon leur nombre
                log.set('Nb articles sélectionnés : ' + iNbInput);
                for(let iCpt = 0; iCpt < iNbInput; iCpt++){
                    if (await pageAchat.inputAchete.nth(iCpt).isEnabled()) {
                        await fonction.sendKeys(pageAchat.inputAchete.nth(iCpt), iQteAchetee)
                    }                    
                }
                
            } else {
                log.set('Aucun article sélectionnable !');
            }
        })

        test ('Button [ACHETER ET CONFIRMER] - Click', async () => {
            if (await pageAchat.buttonAcheterConfirmer.isEnabled()) {
                bCheckFlux = true;
                await fonction.clickAndWait(pageAchat.buttonAcheterConfirmer, page);
                bPopinVisible = await pageAchat.pPiniButtonEnregistrer.isVisible();
            } else {
                log.set('Achat ANNULE !');
            }
        })

        var sNomPopin = "Initialiser les données des nouveaux articles (Optionnel)";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>{

            test ('ListBox [INCOTERM] - Select', async() => {
                if (bPopinVisible) {
                    const iNbLb = await pageAchat.pPiniListBoxIncoterm.count();
                    for (let iCpt = 0; iCpt < iNbLb; iCpt++) {
                        await fonction.selectRandomListBoxLi(pageAchat.pPiniListBoxIncoterm.nth(iCpt), false, page, 'p-dropdownitem li span');
                        await fonction.wait(page, 250);     //-- Petite temporisation pour tenir compte de l'animation css
                    }
                } else {
                    test.skip();
                }
            })

            test ('ListBox [PRIX D\'ACHAT EN] - Select', async() => {
                if (bPopinVisible) {
                    const iNbLb = await pageAchat.pPiniListBoxUniteAchat.count();
                    for (let iCpt = 0; iCpt < iNbLb; iCpt++) {
                        await fonction.selectRandomListBoxLi(pageAchat.pPiniListBoxUniteAchat.nth(iCpt), false, page, 'p-dropdownitem li span');
                        await fonction.wait(page, 250);     //-- Petite temporisation pour tenir compte de l'animation css
                    }
                } else {
                    test.skip();
                }
            })

            test ('Button [ENREGISTRER] - Click', async() => {
                if (bPopinVisible) {
                    await fonction.clickAndWait(pageAchat.pPiniButtonEnregistrer, page);
                } else {
                    test.skip();
                }
            })

            test ('Button [CONFIRMER] - Click', async() => {
                if (await pageAchat.pPbuttonAcheterConfOk.isVisible()) {
                    await fonction.clickAndWait(pageAchat.pPbuttonAcheterConfOk, page);
                } else {
                    test.skip();
                }
            })

            test ('Message [ERREUR] - Is Not Visible', async () => {

                if(await pageAchat.pPfeedBackErrorMessage.isVisible()){
                    var message = await pageAchat.pPfeedBackErrorMessage.textContent()
                    if(message){
                        log.set(`Erreur : ${message}`)
                        log.separateur();
                        test.skip();
                        bCheckFlux = false;
                    }
                } else {
                    test.skip();
                }
            })

        })


    }) // end test.describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

    test ('** CHECK FLUX **', async () => {

        if (bCheckFlux) {
            var oFlux:TypeEsb = { 
                "FLUX" : [ 
                    {
                        "NOM_FLUX"  : "EnvoyerLot_Prepa",
                        "TITRE"     : "Achat N°" + sIdSignature + "%"
                    },
                    {
                        "NOM_FLUX"  : "EnvoyerLot_Prepa",
                        "TITRE"     : "Achat N°" + sIdSignature + "%"
                    },
                    {
                        "NOM_FLUX"  : "EnvoyerLot_Prefac",
                        "TITRE"     : "Achat N°" + sIdSignature + "%"
                    },
                    {
                        "NOM_FLUX"  : "EnvoyerLot_Stock",
                        "TITRE"     : "Achat N°" + sIdSignature + "%"
                    },
                    {
                        "NOM_FLUX"  : "EnvoyerLot_Repart",
                        "TITRE"     : "Achat N°" + sIdSignature + "%"
                    },
                    {
                        "NOM_FLUX"  : "EnvoyerAchat_Alusta",
                        "TITRE"     : "Achat N°" + sIdSignature + "%"
                    },
                    {
                        "NOM_FLUX"  : "ExporterConfirmationAchat_Achat",
                        "TITRE"     : "Exporter confirmation achat N°" + sIdSignature + "%"
                    },
                    {
                        "NOM_FLUX"  : "EnvoyerMailAchat_Achat",
                        "TITRE"     : "Envoyer mail achat N°" + sIdSignature + "%"
                    },
                    {
                        "NOM_FLUX"  : "Envoyer_Mail",
                        "TITRE"     : "%" + sIdSignature
                    },
                ],
                "WAIT_BEFORE"   : 10000,               
            };

            //-- Flux Spécifique aux articles EDI
            if (bEdi) {
                oFlux.FLUX.push(                    {
                    "NOM_FLUX"  : "EnvoyerCommande_EDI",
                    "TITRE"     : "Commande EDI : Achat N°" + sIdSignature + "%"
                });
            }

            //-- Flux Spécifique à la plateforme Cremlog
            if (sNomPlateforme === 'Cremlog') {
                oFlux.FLUX.push(                    {
                    "NOM_FLUX"  : "EnvoyerLot_Pricing",
                    "TITRE"     : "Achat N°" + sIdSignature + "%"
                });
            }

            //-- Flux Spécifique à la plateforme Cremcentre
            if (sNomPlateforme === 'Cremcentre') {
                oFlux.FLUX.push(                    {
                    "NOM_FLUX"  : "EnvoyerLotsCREM_Pricing",
                    "TITRE"     : "Achat N°" + sIdSignature + "%"
                });
            }

            await esb.checkFlux(oFlux, page);

        } else {

            log.set('Examen Flux : ANNULE');

        }

    })

}) 