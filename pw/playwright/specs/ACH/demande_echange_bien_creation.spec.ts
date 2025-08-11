/**
 * @author JC CALVIERA
 * @description Générer une DEB (Demande d'Echanges de Biens)
 * @since   2024-03-15
 * 
 */
const xRefTest      = "ACH_FAC_DEB";
const xDescription  = "Générer une demande d'échange de bien";
const xIdTest       =  240;
const xVersion      = '3.3';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACH',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : ['fournisseur'],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { test, type Page}               from '@playwright/test';

import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';

import { MenuAchats }                   from '@pom/ACH/menu.page'; 
import { PageHisArrLot }                from '@pom/ACH/historique_arrivages-lots.page';

import { AutoComplete, CartoucheInfo }  from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;
let pageHisto       : PageHisArrLot;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    pageHisto       = new PageHisArrLot(page); 
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------  

const sRayon        = 'Fruits et légumes';
const sCentraleAchat= 'Prosol SAS';
const sFournisseur  = fonction.getInitParam('fournisseur', '00015');


//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', async () => {  
    
    let downloadProcess: any;
    let bHistoriqueExiste:boolean;

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [HISTORIQUE]', async () => {

        var sNomPage = 'historique'; 

        test ('ListBox [RAYON] = "' + sRayon + '"', async () => {                    
            await menu.selectRayonByName(sRayon, page);
        })
        
        test ('Page [HISTORIQUE] - Click', async() => {
            await menu.click(sNomPage, page, 60000);                
        })
        
        test ('AutoComplete [FOURNISSEUR] = rnd', async () =>  {

            const autoComplete:AutoComplete = {
                libelle         : 'Article',
                inputLocator    : pageHisto.inputFournCommande,
                inputValue      : sFournisseur,
                //choiceSelector  : 'ngb-typeahead-window button',
                choicePosition  : 0,
                verbose         : false,
                //typingDelay     : 100,
                waitBefore      : 250,
                page            : page
            }

            await fonction.autoComplete(autoComplete);

        })

        test ('Button [RECHERCHER] - Click', async() => {
            await fonction.clickAndWait(pageHisto.buttonRechercher, page);                
        })

        test ('td [LOT][rnd] - Click', async () => {
            const iNbLignes = await pageHisto.tdLotNumeroAchat.count();
            const rnd = Math.floor(fonction.random() * iNbLignes);
            const sRefAchat = await pageHisto.tdLotNumeroAchat.nth(rnd).textContent();
            await fonction.clickElement(pageHisto.tdLotNumeroAchat.nth(rnd));
            log.set('Achat Sélectionné : ' + sRefAchat);
        })

        var sNomPopin = "Génération de fichier DEB PRO Douane - Prévisualisation";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

            test ('Button [GENERER UNE DEB] - Click', async() => {
                await fonction.clickElement(pageHisto.buttonGenererDEB);                
            })

            test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async() => {       
                await fonction.popinVisible(page, sNomPopin);
            })

            test ('Message [ERREUR] - Is NOT Visible', async() => {
                await fonction.isErrorDisplayed(false, page);                
            })

            test ('DatePeacker [MOIS] - Click', async() => {
                fonction.clickElement(pageHisto.pPdatePeackerGenDEB);
            })

            test ('td [MOIS][0] - Click', async() => {
                fonction.clickElement(pageHisto.pPdatePeackerGenDEBMonth.nth(-2));
            })
            
            test('LISTBOX [CENTRE D\'ACHAT]="'+sCentraleAchat+'"', async() => {
                 await pageHisto.selectListBox(page, pageHisto.pPcentraleAchat, sCentraleAchat);                
            })

            test('TOGGLE [TOUS LES RAYONS] - Click', async() => {
                await fonction.clickElement(pageHisto.pPtoggleTousRayons);
            })


            test ('** Wait Until Spinner Off **', async () => {
                await fonction.waitForSpinner(pageHisto.pPspinner);
            });

            test ('Button [PREVISUALISATION DEB] - Click', async() => {
                [downloadProcess] = await Promise.all([
                    page.waitForEvent('download'),
                    await fonction.clickAndWait(pageHisto.pPbuttonGenDEBPrevisu, page,1200000)
                ]);
                log.set('Document téléchargeable !');                     
                log.set('** DEB Prévisualisée **');                       
            })

            test ('Message [AVERTISSEMENT] #1 - Visible (?) - Option', async() => {
                if (await pageHisto.pPmessageErreur.isVisible()) {
                    log.set('Message d\'Avertissement affiché : ' + await pageHisto.pPmessageErreur.textContent());
                    await fonction.clickElement(pageHisto.pPlinkAnnuler);
                } else {
                    log.set('Pas de Message d\'Erreur');
                    bHistoriqueExiste = true;
                }
            })

            test ('Popin [' + sNomPopin.toUpperCase() + '] - Is NOT Visible', async() => {       
                await fonction.popinVisible(page, sNomPopin, false);
            })

            test ('Download File [EXTENSION] #1 = "csv"', async () => {
                if (bHistoriqueExiste === false) {
                    log.set('Download File [EXTENSION] = "csv": ACTION ANNULEE');
                    test.skip();
                } else {
                    await fonction.downloadedFile(downloadProcess,'csv', 100);
                }
            })

        })

        sNomPopin = "Génération de fichier DEB PRO Douane - Définitif";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

            test ('Button [GENERER UNE DEB] - Click', async() => {
                await fonction.clickElement(pageHisto.buttonGenererDEB);                
            })

            test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async() => {       
                await fonction.popinVisible(page, sNomPopin);
            })

            test ('Message [ERREUR] - Is NOT Visible', async() => {
                await fonction.isErrorDisplayed(false, page);                
            })

            test ('DatePeacker [MOIS] - Click', async() => {
                fonction.clickElement(pageHisto.pPdatePeackerGenDEB);
            })

            test ('td [MOIS][0] - Click', async() => {
                fonction.clickElement(pageHisto.pPdatePeackerGenDEBMonth.nth(-2));
            })
            
            test('LISTBOX [CENTRE D\'ACHAT]="'+sCentraleAchat+'"', async() => {
                 await pageHisto.selectListBox(page, pageHisto.pPcentraleAchat, sCentraleAchat);                
            })

            test('TOGGLE [TOUS LES RAYONS] - Click', async() => {
                await fonction.clickElement(pageHisto.pPtoggleTousRayons);
            })


            test ('Button [DEB DEFINITIF] - Click', async() => {
                [downloadProcess] = await Promise.all([
                    page.waitForEvent('download'),
                    await fonction.clickAndWait(pageHisto.pPbuttonGenDEBDefinitif, page,1200000)
                ]);
                log.set('Document téléchargeable !');                     
                log.set('** DEB Définitif **');           
                bHistoriqueExiste = true;
            })

            test ('Message [AVERTISSEMENT] #2 - Visible (?) - Option', async() => {
                if (await pageHisto.pPmessageErreur.isVisible()) {
                    log.set('Message d\'Avertissement affiché : ' + await pageHisto.pPmessageErreur.textContent());
                    await fonction.clickElement(pageHisto.pPlinkAnnuler);
                } else {
                    log.set('Pas de Message d\'Erreur');
                    bHistoriqueExiste = true;
                }
            })

            test ('Download File [EXTENSION] #2 = "csv"', async () => {
                if (bHistoriqueExiste === false) {
                    log.set('Download File [EXTENSION] = "csv": ACTION ANNULEE');
                    test.skip();
                } else {
                    await fonction.downloadedFile(downloadProcess,'csv', 100);
                }
            })

        })

    }) // end test.describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

}) 