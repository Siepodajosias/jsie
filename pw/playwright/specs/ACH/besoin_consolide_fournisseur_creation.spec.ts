/**
 * 
 * @author JC CALVIERA
 * @since 2024-03-12
 * 
 */
const xRefTest      = "ACH_BES_PRM";
const xDescription  = "Paramétrer les besoins consolidés avec la fenêtre de paramétrage";
const xIdTest       =  1518;
const xVersion      = "3.2";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Ne pas tirer sur le rayon Poisson ou Crèmerie !'],
    params      : ['rayon'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }  from '@playwright/test';

import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { Log }              from '@helpers/log.js';

import { MenuAchats }       from '@pom/ACH/menu.page.js';
import { PageBesConFou }    from '@pom/ACH/besoins_besoins-consolides-fournisseur.page';

import { AutoComplete, CartoucheInfo } from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
var pageBesoins     : PageBesConFou;
var menu            : MenuAchats;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------

const sLibelle      = 'TA_Libelle ' + fonction.getToday('fr');
const sIdClient     = 'TA_IdentForunisseur ' + fonction.getToday('fr');
const iNbjours      = Math.floor(fonction.random() * 10);
const sRayon        = 'Fruits et légumes';
const sCentrale     = 'Prosol SAS'; 
const sLettre       = fonction.getRandomLetter('abcdefghijklmnopqrstuvwxyz0123456789');

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);    
    pageBesoins     = new PageBesConFou(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async() => {
       await fonction.connexion(page);
    })
  
    test.describe('Page [BESOINS MAGASIN]', async() => {

        var pageName:string      = 'besoins';

        test('ListBox [RAYON] = "' + sRayon + '"', async() => {
            await menu.selectRayonByName(sRayon, page);
        });

        test("Menu [BESOINS MAGASIN] - Click ", async () => {
            await menu.click(pageName, page);
        })

        test.describe ('Onglet [BESOINS CONSOLIDES FOURNISSEURS]', async() => {

            test ('Onglet [BESOINS CONSOLIDES FOURNISSEURS] - Click', async () => {
                await menu.clickOnglet(pageName, 'besoinsConsolidesFournisseur', page);                
            })   

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            const sNomPopin = "Création d'un besoin consolidé fournisseur";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

                test ('Button [CREER UN BESOIN CONSOLIDE FOURNISSEUR] - Click', async () => {
                    await fonction.clickElement(pageBesoins.buttonCreerBesoinConsolFourn);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () =>  {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
                })
                
                test ('InputField [DUREE RECEPTION ANTICIPEE] = "rnd"', async () => {
                    await fonction.sendKeys(pageBesoins.pPinputDureeReceptionAnticipe, iNbjours);
                    log.set('Durée de Réception Anticipée : ' + iNbjours);
                })

                test ('ListBox [CENTRALE D\'ACHAT] = "' + sCentrale + '"', async () => {
                    await fonction.clickElement(pageBesoins.pPlistBoxCEntraleAchat);
                    await fonction.wait(page, 500);
                    await page.locator('p-dropdownitem li span:text-is("' + sCentrale + '")').click();                    
                    log.set('Centrale d\'Achat Sélectionnée : ' + sCentrale);
                })

                test ('InputField [LIBELLE] = "' + sLibelle + '"', async () => {
                    await fonction.sendKeys(pageBesoins.pPinputLibelle, sLibelle + '-' + fonction.getHMS());
                    log.set('Libellé : ' + sLibelle + '-' + fonction.getHMS());
                })

                test ('InputField [IDENTIFIANT CLIENT] = "' + sIdClient + '"', async () => {
                    await fonction.sendKeys(pageBesoins.pPinputIdentifiantClient, sIdClient);
                })

                test('AutoComplete [FOURNISSEUR] = "rnd"', async () => {

                    //sLettre = '3019';                                     // On peut forcer la donnée pour utiliser un article précis
                    log.set('Lettre injectée : ' + sLettre);
    
                    var oData:AutoComplete = {
                        libelle         :'FOURNISSEUR',
                        inputLocator    : pageBesoins.pPinputFoursisseur,
                        inputValue      : sLettre,
                        choiceSelector  :'ngb-typeahead-window button',
                        //choicePosition  : iPosAutocomplete,
                        typingDelay     : 100,
                        waitBefore      : 500,
                        page            : page,
                    };
                    const sChoix = await fonction.autoComplete(oData);
    
                })

                test ('ListBox [PLATEFORME DE DISTRIBUTION][rnd]  - Select', async () => {
                    await fonction.selectRandomListBoxLi(pageBesoins.pPlistBoxPlateforme, false, page, pageBesoins.sListeChoix);
                    log.set('PLATEFORME DE DISTRIBUTION : ' + await pageBesoins.pPlistBoxPlateforme.textContent());
                    await fonction.wait(page, 250); //-- Anim
                })

                test ('ListBox [VENTILATION ARTICLES][rnd]  - Select', async () => {
                    await fonction.selectRandomListBoxLi(pageBesoins.pPlistBoxVentilationArticle, false, page, pageBesoins.sListeChoix);
                    log.set('VENTILATION ARTICLES : ' + await pageBesoins.pPlistBoxVentilationArticle.textContent());
                    await fonction.wait(page, 250); //-- Anim
                })

                test ('ListBox [VENTILATION MAGASINS][rnd]  - Select', async () => {
                    await fonction.selectRandomListBoxLi(pageBesoins.pPlistBoxVentilationMagasins, false, page, pageBesoins.sListeChoix);
                    log.set('VENTILATION MAGASINS : ' + await pageBesoins.pPlistBoxVentilationMagasins.textContent());
                    await fonction.wait(page, 250); //-- Anim
                })

                test ('ListBox [TYPE ENVOI][rnd]  - Select', async () => {
                    await fonction.selectRandomListBoxLi(pageBesoins.pPlistBoxTypeEnvoi, false, page, pageBesoins.sListeChoix);
                    log.set('TYPE ENVOI : ' + await pageBesoins.pPlistBoxTypeEnvoi.textContent());
                    await fonction.wait(page, 250); //-- Anim
                })

                test('Toggle Button [ACTIF] - Click rnd', async() => {
                    await fonction.clickElement(pageBesoins.pToggleSwitchActif, 0.5);
                })

                test('Toggle Button [COMPTE STOCK PLATEFORME] - Click rnd', async() => {
                    await fonction.clickElement(pageBesoins.pToggleSwitchStockPlateforme, 0.5);
                })

                test('Toggle Button [TRANSMISSION PVC] - Click rnd', async() => {
                    await fonction.clickElement(pageBesoins.pToggleSwitchTransmissionPVC, 0.5);
                })

                test('Toggle Button [STRAT SANS PRIX] - Click rnd', async() => {
                    await fonction.clickElement(pageBesoins.pToggleSwitchStrategieSansPrix, 0.5);
                })

                test('Toggle Button [CROSS-DOCK] - Click rnd', async() => {
                    await fonction.clickElement(pageBesoins.pToggleSwitchCrossDock, 0.5);
                })

                test ('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pageBesoins.pButtonEnregistrer, page);
                })

                test ('Button [ANNULER] #1 - Click (Optionnel)', async () => {
                    if (await pageBesoins.pMessageErreur.isVisible()) {
                        log.set('Message d\'Erreur Affiché : ' + await pageBesoins.pMessageErreur.textContent());
                        log.set('Enregistrement Annulé');
                        await fonction.clickElement(pageBesoins.pButtonAnnuler);
                    } else {                        
                        test.skip();
                    }
                })

                test ('Button [ANNULER] #2 - Click (Optionnel)', async () => {
                    if (await pageBesoins.pMessageWarning.isVisible()) {
                        log.set('Message d\'Information Affiché : ' + await pageBesoins.pMessageWarning.textContent());
                        log.set('Enregistrement Annulé');
                        await fonction.clickElement(pageBesoins.pButtonAnnuler);
                    } else {                        
                        test.skip();
                    }
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () =>  {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), false);
                })

            })  // End Popin

       })  // End  Onglet

    })  // End  Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})  // End describe