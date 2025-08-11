/**
 * 
 * @description Définir ou Retirer une exception de productivité
 * @author JC CALVIERA
 * @since 2024-02-27
 * 
 */
const xRefTest      = "PRE_REF_PRO";
const xDescription  = "Définir ou Retirer une exception de productivité";
const xIdTest       =  2044;
const xVersion      = "3.0";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRE',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page, expect}       from '@playwright/test';

import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';

import { MenuPreparation }              from '@pom/PRE/menu.page';
import { RefExceptionProductivitePage } from '@pom/PRE/referentiel-exceptions_productivite.page';

import { CartoucheInfo }                from '@commun/types';

//------------------------------------------------------------------------------------

const sPlateforme           = 'Cremcentre';

//------------------------------------------------------------------------------------

let page                    : Page;
 
var pageExcep               : RefExceptionProductivitePage;
var menu                    : MenuPreparation;

const log                   = new Log();
const fonction              = new TestFunctions(log);

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage();
    menu        = new MenuPreparation(page, fonction);    
    pageExcep   = new RefExceptionProductivitePage(page);
    const helper= new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async () => {
        await fonction.openUrl(page);
    });

    test('Connexion', async({ context }) => {
        await context.clearCookies();
        await fonction.connexion(page);
    })
  
    test.describe('Page [REFERENTIEL]', async() => {

        var pageName:string      = 'referentiel';

        test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async() => {
            await menu.selectPlateforme(sPlateforme, page);
            log.set('Plateforme : ' + sPlateforme);
        });

        test("Menu [REFERENTIEL] - Click ", async () => {
           await menu.click(pageName, page);
        })
  
        test('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
        })

       test.describe('Onglet [EXCEPTIONS DE PRODUCTIVITE]', async() => {

            let rnd:number;
            let bAddException:boolean;

            test ('Onglet [EXCEPTIONS DE PRODUCTIVITE] - Click', async () => {
                await menu.clickOnglet(pageName, 'exploitationProductivite',page);                
            })   

            test ('Message [ERREUR] #1 - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            test ('ChecktBox [LISTE EXCEPTIONS][rnd] - Click', async() => {
                const iNbChoix = await pageExcep.checkBoxListeExceptions.count();
                rnd = Math.floor(fonction.random() * iNbChoix);
                const sChoix = await pageExcep.tdListeDesignations.nth(rnd).textContent();
                log.set('Article : ' + sChoix);
                //console.log(await pageExcep.trListeExceptions.nth(rnd).locator('td').allTextContents());
                await fonction.clickElement(pageExcep.checkBoxListeExceptions.nth(rnd));
            })

            test ('Button [AJOUTER/RETIRER EXCEPTION] - Click', async () => {
                bAddException = await pageExcep.buttonDefinirException.isEnabled();
                if (bAddException === true) {
                    log.set('Exception : AJOUT');
                    await fonction.clickElement(pageExcep.buttonDefinirException);
                    await fonction.wait(page, 250); //-- Délai anim css
                    expect(await pageExcep.tdListeExceptions.nth(rnd).locator('span.icon-ok').isVisible()).toBeTruthy();
                } else {
                    log.set('Exception : RETRAIT');
                    await fonction.clickElement(pageExcep.buttonRetirerException);
                    await fonction.wait(page, 250); //-- Délai anim css
                    expect(await pageExcep.tdListeExceptions.nth(rnd).locator('span.icon-ok').isVisible()).toBeFalsy();
                }
            })

            test ('Message [ERREUR] #2 - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            test ('Button [RETIRER/AJOUTER EXCEPTION] - Click', async () => {
                if (bAddException === false) {
                    log.set('Exception : AJOUT');
                    await fonction.clickElement(pageExcep.buttonDefinirException);
                    await fonction.wait(page, 250); //-- Délai anim css
                    expect(await pageExcep.tdListeExceptions.nth(rnd).locator('span.icon-ok').isVisible()).toBeTruthy();
                } else {
                    log.set('Exception : RETRAIT');
                    await fonction.clickElement(pageExcep.buttonRetirerException);
                    await fonction.wait(page, 250); //-- Délai anim css
                    expect(await pageExcep.tdListeExceptions.nth(rnd).locator('span.icon-ok').isVisible()).toBeFalsy();
                }
            })

            test ('Message [ERREUR] #3 - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

       })  // End  Onglet

    })  // End  Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})  // End describe