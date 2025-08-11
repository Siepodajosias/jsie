/**
 * 
 * @desc Annulation d'un bon de restitution
 * 
 * @author JC CALVIERA
 *  Since 2024-01-16
 */

const xRefTest      = "STO_EMB_ABR";
const xDescription  = "Annulation d'un bon de restitution";
const xIdTest       =  1565;
const xVersion      = '3.4';

var info = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}   from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                from "@pom/STO/menu.page";
import { EmballageRestitution }     from '@pom/STO/emballage-restitution.page';

//----------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuStock;
let pageEmballage   : EmballageRestitution;

const log           = new Log();
const fonction      = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const sPlateforme   = fonction.getInitParam('Plateforme', 'Chaponnay');

// -----------------------------------------------------------------------------------------
const sToastMesage : string = "Opération réussie"
//------------------------------------------------------------------------------------   

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage(); 

    menu            = new MenuStock(page, fonction);
    pageEmballage   = new EmballageRestitution(page);
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    })

    test ('Ouverture URL', async() => {
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async() => {            
        await menu.selectPlateforrme(page, sPlateforme);                       // Sélection d'une plateforme par défaut
    })

    test.describe('Page [EMBALLAGE]', async () =>  {  

      
        var currentPage  : string = 'emballage';
        var sNumCommande : string | null = null;

        test ('Page [EMBALLAGE] - Click', async () => {
            await menu.click(currentPage, page);  
        })
             
        test ('Label [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);                     
        })

        test.describe('Onglet [LIVRAISON]', async () =>  {        
            
            test ('Onglet [LIVRAISON] - Click', async () =>  {
                await menu.clickOnglet(currentPage, 'livraison', page);                                         
            })   

            test('Multiselect [STATUT] = "Créé"', async () => {
                await fonction.clickElement(pageEmballage.multiSelectStatut);
                await fonction.clickElement(pageEmballage.multiSelectStatutItem.locator('span:text-is("Créé")'));    // filtrer sur les bons de livraisons créés
            })

            test('Button [multiselect-close] - Click', async () => {
                await fonction.clickAndWait(pageEmballage.buttonStatMultiselectClose,page); 
            })

            test ('DataGrid Header [Numero de commande][créé] - Click', async () =>  {
                await fonction.clickElement(pageEmballage.tdNumCommande.nth(0));
            })

            test('Td [STATUT] = "Créé"', async () => {
                var sStatutInitTexte = await pageEmballage.tdStatut.nth(0).textContent();
                sStatutInitTexte     = sStatutInitTexte.trim();
                log.set('Statut initial de la commande : ' + sStatutInitTexte);
                expect(sStatutInitTexte).toBe('Créé');
            })

            test ('Button [ANNULER UN BL] - Click', async () =>  {
                await fonction.clickAndWait(pageEmballage.buttonAnnulerBl, page);
            })

            var sNomPopin = "Annulation d'un bon de restitution";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>  {

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })   

                test ('Button [ANNULER UN BL] - Click', async () =>  {
                    await fonction.clickElement(pageEmballage.pPbuttonConfirmerAnnulation);
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is NOT Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                }) 
            })

            test('Multiselect [STATUT] = "Annulé"', async () => {
                await fonction.clickElement(pageEmballage.multiSelectStatut);
                await fonction.clickElement(pageEmballage.multiSelectStatutItem.locator('span:text-is("Annulé")'));    // filtrer sur les bons de livraisons annulés
            })

            test ('DataGrid Header [Numero de commande][Annulé] - Click', async () =>  {
                await fonction.clickElement(pageEmballage.tdNumCommande.nth(0));
            })

            test ('Td [STATUT] = "Annulé"', async () => {
                var sStatutFinalTexte = await pageEmballage.tdStatut.nth(0).textContent();
                sStatutFinalTexte     = sStatutFinalTexte.trim();
                log.set('Statut final de la commande : ' + sStatutFinalTexte);
                expect(sStatutFinalTexte).toBe('Annulé');
            })    
            
            //Visualisation du bon de livraison annulé dans une nouvelle page 
            test('Button [IMPRIMER] - Click ', async () => {
             await fonction.clickElement(pageEmballage.buttonImprimer, page);
            });

            //Verification du toast message d'impression
            test("Toast ['" + sToastMesage + "'] - Check", async () => {
                const sMessage = await pageEmballage.toastMessage.textContent();
                expect(sMessage).toBe(sToastMesage); 
            })
            
        })  //-- End Describe Onglet  

    })  //-- End Describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})