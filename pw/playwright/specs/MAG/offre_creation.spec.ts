/**
 * 
 * @author JC CALVIERA
 *  Since 2024-04-04
 */

const xRefTest      = "MAG_PRI_OFR";
const xDescription  = "Paramétrer une offre sur un article";
const xIdTest       =  591;
const xVersion      = '3.2';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['ville','groupeArticle'],
    fileName    : __filename
}

//-------------------------------------------------------------------------------------

import { test, type Page, expect }    from '@playwright/test';

import { TestFunctions }              from "@helpers/functions.js";
import { Log }                        from "@helpers/log.js";
import { Help }                       from '@helpers/helpers.js';

import { MenuMagasin }                from '@pom/MAG/menu.page.js';
import { PrixGestion }                from '@pom/MAG/prix-gestion.page.js';

import { AutoComplete, CartoucheInfo }from '@commun/types';

//-------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pagePrix            : PrixGestion;

const log               = new Log();
const fonction          = new TestFunctions(log);

//-----------------------------------------------------------------------------------------

const sCommentaire      = 'TA_Motif ' + fonction.getToday('US') + ' <-% /!\\ #1 \';';
const iNbUnites         = 8;

const sNomVille         = fonction.getInitParam('ville', 'Tours (G182)');
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Coupe / Corner'); 

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pagePrix        = new PrixGestion(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [PRIX]', async () => {

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

        var sNomPage = 'prix';

        test ('Page [PRIX] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 

        test ('ListBox [VILLE] = "' + sNomVille + '"', async () => {
            await menu.selectVille(sNomVille, page);
        })
        
        var sNomOnglet = "GESTION DES PRIX";

        test.describe ('Onglet [' + sNomOnglet + ']', async() => {

            test ('Onglet [GESTION DES PRIX] - Click', async() => {
                await menu.clickOnglet(sNomPage, 'gestionPrix', page);
            })

            test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de l'onglet
                await fonction.isErrorDisplayed(false, page);
            }) 
            
            test ('ListBox [GROUPE] = "' + sGroupeArticle + '"', async() => {            
                await pagePrix.listBoxGrpArticle.selectOption(sGroupeArticle);
            })

            test ('Button [OFFRE] - Click', async () => {
                await fonction.clickElement(pagePrix.buttonOffre);
            })

            var sNomPopin = "Changement de prix de type Offre";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

                test ('AutoComplete [ARTICLE] = "e"', async() => {
                    var oData:AutoComplete = {
                        libelle         :'ARTICLE',
                        inputLocator    : pagePrix.pPinputArticle,
                        inputValue      : 'e',
                        selectRandom    : true,
                        typingDelay     : 100,
                        waitBefore      : 500,
                        page            : page
                    }
                    await fonction.autoComplete(oData);
                })

                test ('Button [ + ] - Click', async () => {
                    await fonction.clickAndWait(pagePrix.pPoffreButtonPlus, page);
                })

                test ('Radio Button [OFFRE][rnd] - Click', async() => {
                    var isVisible = await pagePrix.pPoffreMessageErreur.isVisible();
                    if (isVisible) {
                        const sLibErreur = await pagePrix.pPoffreMessageErreur.textContent();
                        log.set('### RETOUR ERREUR IHM : ' + fonction.cleanTexte(sLibErreur) + ' ###');
                        expect(sLibErreur.indexOf('6120') !== -1).toBe(true);
                        await fonction.clickElement(pagePrix.pPoffreButtonFermer);
                    } else {
                        log.set('Groupe Article : ' + sGroupeArticle);

                        const rnd = Math.floor(fonction.random() * 3);
                        await fonction.clickElement(pagePrix.pPoffreRadioButtonOffre.nth(rnd));
                        const sOffreSelected = await pagePrix.pPoffreLibelleOffre.nth(rnd).textContent();
                        log.set('Offre : ' + fonction.cleanTexte(sOffreSelected));
    
                        const sCodeArticle = await pagePrix.pPoffreTdCodearticle.first().textContent();
                        log.set('Code Article : ' + sCodeArticle);
    
                        const sLibelleArticle = await pagePrix.pPoffreTdDesignation.first().textContent();
                        log.set('Code Libelle : ' + sLibelleArticle);
                    }
                })

                test ('InputField [NOMBRE D\'UNITES CONCERNES PAR L\'OFFRE] = "' + iNbUnites + '" (Optionnel)', async() => {  
                    var isVisible = await pagePrix.pPoffreInputNbColis.isVisible();                  
                    if (isVisible){
                        await fonction.sendKeys(pagePrix.pPoffreInputNbColis, iNbUnites);
                    } else {
                        test.skip();
                    }
                })

                test ('TextArea [MOTIF] = "' + sCommentaire + '"', async () => {
                    var isVisible = await pagePrix.pPoffreTextAreaCommentaire.isVisible();                  
                    if (isVisible){
                        await fonction.sendKeys(pagePrix.pPoffreTextAreaCommentaire, sCommentaire, false);
                    } else {
                        test.skip();
                    }
                })

                test ('Button [ENREGISTRER] - Click', async () => {
                    var isActive = await pagePrix.pPoffreButtonEnregistrer.isVisible();                  
                    if (isActive){
                        await fonction.clickElement(pagePrix.pPoffreButtonEnregistrer);
                    } else {
                        test.skip();
                    }
                })

                test ('Optionnel - Message Erreur [6121] - Visible', async () => {
                    var isVisible = await pagePrix.pPoffreMessageErreur.isVisible();
                    if (isVisible) {
                        const sLibErreur = await pagePrix.pPoffreMessageErreur.textContent();
                        log.set('### RETOUR ERREUR IHM : ' + fonction.cleanTexte(sLibErreur) + ' ###');
                        expect(sLibErreur.indexOf('6121') !== -1).toBe(true);
                        await fonction.clickElement(pagePrix.pPoffreButtonFermer);
                    } else {
                        test.skip();
                    }
                })

            }) //-- Popin

        }) //-- Onglet  

    }) //-- Page

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})
