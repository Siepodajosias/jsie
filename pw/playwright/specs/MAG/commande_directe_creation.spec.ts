/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 04 - 12 - 2023
 */

const xRefTest      = "MAG_PAS_CLD";
const xDescription  = "Notification d'une commande LD à passer";
const xIdTest       =  7287;
const xVersion      = '3.3.1';

var info = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['ville', 'fournisseur'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}        from '@playwright/test';

import { TestFunctions }                 from "../../utils/functions";
import { Log }                           from "../../utils/log";
import { Help }                          from '../../utils/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }                   from '../../pages/MAG/menu.page';
import { CommandesCommandeDirecte }      from '../../pages/MAG/commandes-commande_directe.page';

//-------------------------------------------------------------------------------------

let page          : Page;

let menu          : MenuMagasin;
let pageCmDirecte : CommandesCommandeDirecte;

const log         = new Log();
const fonction    = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const sLieuVente    = process.env.VILLE || 'Gaillarde (G911)';
const sFournisseur  = process.env.FOURNISSEUR || 'random';

//-----------------------------------------------------------------------------------------

var oData = {
    iNbPastillesMenu : 0,
    iNbPastillesOnglet : 0,
    bErreur : false
};

var getNbPastilles = (sLocalisation = 'menu') => {
    if (sLocalisation === 'onglet') {
        return oData.iNbPastillesOnglet;
    } else {
        return oData.iNbPastillesMenu;
    }
};

var setNbPastilles = (iNbPastilles, sLocalisation = 'menu') => {
    if (sLocalisation === 'onglet') {
        oData.iNbPastillesOnglet = iNbPastilles;
    } else {
        oData.iNbPastillesMenu = iNbPastilles;
    }
};

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageCmDirecte   = new CommandesCommandeDirecte(page);
});

test.afterAll(async ({}, testInfo) => {
    fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });
test.describe ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    });

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACCUEIL]', async () => {

        test('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            await menu.pPopinAlerteSanitaire.isVisible().then(async (isVisible) => {
                if(isVisible){
                    await menu.removeArlerteMessage(page);
                }else{
                    log.set('Link [BROWSER SECURITY WARNING] - Click: ACTION ANNULEE');
                    test.skip();
                }
            })
        })
    })

    test.describe('Page [COMMANDE]', async () => {

        var pageName    = 'commandes';
        var ongletName  = 'achatSurPlace';

        test('Page [COMMANDE] - Click', async () => {
            await menu.click(pageName, page);                                           // On ouvre la page
        })

        test('ListBox [VILLE] = "' + sLieuVente + '"', async () => {                    // On sélectionne le lieu de vent cible
            await menu.selectVille(sLieuVente, page);
            log.set('Lieu de vente : ' + sLieuVente);          

            var iNbPastilles = await menu.getPastilles(pageName, page);                  // Mémorisation nb de pastilles dans le menu AVANT traitement
            setNbPastilles(iNbPastilles, 'menu');                                        // Mémorisation en Local

            var iNbPastilles = await menu.getPastilles(pageName, page, ongletName);      // Mémorisation nb de pastilles dans l'onglet AVANT traitement
            setNbPastilles(iNbPastilles, 'onglet');                                      // Mémorisation en Local

        })

        test('Label [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);
        })      

        test.describe ('Onglet [COMMANDE DIRECTE]', async () => {        

            test('Onglet [COMMANDE DIRECTE] - Click', async () => {
                await menu.clickOnglet(pageName, ongletName, page);                      // On ouvre l'onglet
            })

            test('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 

            test('ListBox [FOURNISSEUR] = "' + sFournisseur + '"', async () =>{

                if (sFournisseur === 'random') {

                    await pageCmDirecte.listBoxFoursisseur.click();
                    var iNbElements = await pageCmDirecte.listBoxFournisseurOpt.count();
                    var iCible = Math.floor(fonction.random() * (iNbElements - 1)) + 1;
                    var sNomFournisseur = await pageCmDirecte.listBoxFournisseurOpt.nth(iCible).innerText();
                    await pageCmDirecte.listBoxFoursisseur.selectOption({label:sNomFournisseur});
                    log.set('Fournisseur : ' + sNomFournisseur + ' - (Choix : '+iCible+'/'+iNbElements+')');

                } else {

                    await fonction.listBoxByLabel(pageCmDirecte.listBoxFoursisseur, sFournisseur, page);
                    log.set('Fournisseur : ' + sFournisseur);
                }

            })
            
            test('Button [ + ] - Click', async () => {

                await fonction.clickAndWait(pageCmDirecte.ButtonPlus, page);
                var warningIsVisible = await pageCmDirecte.messageWarning.first().isVisible();
                var erreurIsVisible  = await pageCmDirecte.messageErreur.first().isVisible();

                if(warningIsVisible) {

                    var sMessage = await pageCmDirecte.messageWarning.first().textContent();
                    log.set('Message Avertissement Affiché : ' + sMessage);
                    oData.bErreur = true;
                
                }else if (erreurIsVisible) {

                    // Pas de message d'avertissement affiché mais peut être un message d'erreur
                    var sMessage = await pageCmDirecte.messageErreur.first().textContent();
                    log.set('Message Erreur Affiché : ' + sMessage);
                    oData.bErreur = true; 
                }else {

                    log.set('Pas de message d\'erreur ni d\'avertissement affiché')
                }
            })

            test('DataGrid [COMMANDES][0] - Click', async () => {
                if (oData.bErreur === false) {

                    var iNbChoix = await pageCmDirecte.tdLibellesCommandes.count();
                    var iCible = Math.floor(fonction.random() * iNbChoix);
                    var sLibelleCommande = await pageCmDirecte.tdLibellesCommandes.nth(iCible).textContent();
                    log.set('Commande : ' + sLibelleCommande + ' - (Choix : '+iCible+'/'+iNbChoix+')');
                    pageCmDirecte.tdLibellesCommandes.nth(iCible).click();
                } else {

                    log.set('Commande : ACTION ANNULEE');
                }
            })

            test('Button [ENREGISTRER] - Click', async () => {
                if (oData.bErreur === false) {

                    await fonction.clickAndWait(pageCmDirecte.ButtonEnregister, page);
                } else {
                    
                    log.set('Enregistrement : ACTION ANNULEE');
                }
            })

            test('Pastilles [MENU] - Check', async () => {
                if (oData.bErreur === false) {

                    var iNbPastillesLocal = getNbPastilles('menu');                              // Affichage compteur Local
                    log.set('Nb Pastilles MENU avant traitement : ' + iNbPastillesLocal);
                    var iNbPastilles = await menu.getPastilles(pageName, page)                   // Mémorisation nb de pastilles dans le menu AVANT traitement                            
                    log.set('Nb Pastilles MENU après traitement : ' + iNbPastilles);
                    expect(iNbPastilles).toBeGreaterThan(iNbPastillesLocal);   
                } else {

                    log.set('Comparaison pastilles MENU : ACTION ANNULEE');
                }
            })

            test('Pastilles [ONGLET] - Check', async () => {
                if (oData.bErreur === false) {

                    var iNbPastillesLocal = getNbPastilles('onglet');                           // Affichage compteur Local
                    log.set('Nb Pastilles ONGLET avant traitement : ' + iNbPastillesLocal);
                    var iNbPastilles = await menu.getPastilles(pageName, page)                 // Mémorisation nb de pastilles dans l'onglet AVANT traitement
                    log.set('Nb Pastilles ONGLET après traitement : ' + iNbPastilles);
                    expect(iNbPastilles).toBeGreaterThan(iNbPastillesLocal);

                } else {

                    log.set('Comparaison pastilles ONGLET : ACTION ANNULEE');
                }
            })
        })
    }) // End describe Page
})