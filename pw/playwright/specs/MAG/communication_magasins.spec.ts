  /**
   * @author Abdoul SARBA
   * Since 04/02/2025 
   */

  const xRefTest      = "MAG_ADM_COM"
  const xDescription  = "Gestion du message d'information affiché à destination de tous les magasins."
  const xIdTest       = 9731
  const xVersion      = '3.5'

  var info:CartoucheInfo  = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};

//----Import------------------------------------------------------------------------------------------------------------------------------------------------

import test, { expect, Page } from "@playwright/test"
import { TestFunctions }      from "@helpers/functions"
//----PageObject--------------------------------------------------------------------------------------------------------------------------------------------

import { Communication }      from "@pom/MAG/communication.page"
import { MenuMagasin }        from "@pom/MAG/menu.page";

import { Log }                from "@helpers/log";
import { Help }               from "@helpers/helpers";


import { CartoucheInfo }      from "@commun/types";


//----Variables--------------------------------------------------------------------------------------------------------------------------------------------

let page                     : Page;
let menu                     : MenuMagasin;
let pageCommunication        : Communication;

const log                    = new Log();
const fonction               = new TestFunctions(log);


var sDateAujourdhui          :string       =   fonction.getToday("FR",0,"/")
const MESSAGE_FRANCAIS       :string       = `Test Automatique - Communication Magasin du ${sDateAujourdhui} - Rien à signaler`;
var sMessageEnItalien        :string       = `Test Automatico - Comunicazione Store del ${sDateAujourdhui} - Nulla da segnalare`;
var sMessageDiffuse          :string       = "Le message a été enregistré et diffusé";
var sMessageSupprimeItalien  :string       = "Il messaggio é stato cancellato";



//----beforeAll & afterAll-----------------------------------------------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser },testInfo) => {
    page                     = await browser.newPage();
    pageCommunication        = new Communication(page);
    
    
    // functionAriaSnapShot     = new FunctionAria(page);
    menu                     = new MenuMagasin(page,fonction);

    const helper             = new Help(info, testInfo, page);
    await helper.init();
    
})

test.afterAll(async ({},testInfo) => {
    await fonction.close(testInfo);   
})

//-----Corps du test-----------------------------------------------------------------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    // Ouverture vers l'url
    test("Ouverture de l'url", async () => {
        await fonction.openUrl(page);
    });

    //Connexion à Magasin
    test ('Connexion', async () => {
        await fonction.connexion(page);
    })
    
    // Retirer le message d'alerte 
    test ('Popin [ALERTES] - Click', async () => {
        await menu.removeArlerteMessage(page);
    });

    // Page admin
    test.describe("Page [ADMIN]", async ()=>{
        var pageName = "referentiel";
        test("Page [ADMIN] - Click", async () => {
            await menu.click(pageName, page);
        })

        test("Onglet [COMM.MAGASINS] - Click", async () => {
            await menu.clickOnglet(pageName, "communication", page);
        })

        test('form [FORMULAIRE DE COMMUNICATION] - Is Visible', async () => {
            await fonction.isDisplayed(pageCommunication.communicationForm);
        })

        test("TextField [MESSAGE D'INFORMATION] = " + MESSAGE_FRANCAIS +"\"", async () => {
            await fonction.sendKeys(pageCommunication.textareaMessageFr, MESSAGE_FRANCAIS, false, "Message d'information"); 
        })
        
        test("Button [TRADUIRE] - Click",async ()=>{
            await fonction.clickAndWait(pageCommunication.buttonTraduireMessage, page);
        })
        
        test("TextField [MESSAGE D'INFORMATION TRADUIT] = " + MESSAGE_FRANCAIS +"\"", async () => {
            const sContenuTextarea = await pageCommunication.textareaMessageIt.inputValue();
            expect(sContenuTextarea).toContain(sMessageEnItalien);
        });
                
        test("Button [COULEUR BLEU] - Click", async () => {
            const bIsChecked = await pageCommunication.pSelectCouleurBleue.evaluate(element => element.getAttribute('aria-checked').includes('false'));
            if (bIsChecked) {
                await fonction.clickElement(pageCommunication.pSelectCouleurBleue);
            }
        })
        
        test("Button [COMMUNIQUER] - Click", async () => {
            await fonction.clickElement(pageCommunication.buttonCommuniquer);
        })
        
        test("Toast [MESSAGE ENREGISTRÉ] - Is Visible", async () => {
            const sMessage = await pageCommunication.toastMessageInfo.textContent();
            expect(sMessage).toBe(sMessageDiffuse); 
        })

    })

    // page commande
    test.describe('Page [COMMANDE] ',async ()=>{
        var currentPage = "commandes";
        test("Page [COMMANDE] - Click", async () => {
            await menu.click(currentPage, page);
        })

        test('span [MESSAGE INFORMATION] - Is Visible', async ()=>{
            await fonction.isDisplayed(menu.spanMessageInfo)
            await expect(menu.spanMessageInfo).toHaveText(MESSAGE_FRANCAIS)
        })
      
        test('ListBox [LANGUE ITALIENNE] - Click', async () => {
            await menu.selectLang('it');
        })

        test('span [MESSAGE INFORMATION EN ITALIEN] - Is Visible', async ()=>{
            await fonction.isDisplayed(menu.spanMessageInfo)
            await expect(menu.spanMessageInfo).toHaveText(sMessageEnItalien)
        })

    })

   
    test.describe('Page [ADMIN] ',async ()=>{
        var pageName = "referentiel";
        test ('Popin [ALERTES] - Click', async () => {
            await menu.removeArlerteMessage(page);
        });

        test("Page [ADMIN] - Click", async () => {
            await menu.click(pageName, page);
        })

        test("Onglet [COMM.MAGASINS] - Click", async () => {
            await menu.clickOnglet(pageName, "communication", page);
        }) 

        test('form [FORMULAIRE DE COMMUNICATION] - Is Visible', async () => {
            await fonction.isDisplayed(pageCommunication.communicationForm);
        })

        test('TextField [MESSAGE D\'INFORMATION TRADUIT]= "' + MESSAGE_FRANCAIS +"'", async()=>{          
            const sContenuTextarea = await pageCommunication.textareaMessageFr.inputValue();
            expect(sContenuTextarea).toContain(MESSAGE_FRANCAIS);
        })

        test('TextField [MESSAGE D\'INFORMATION TRADUIT] = "' + sMessageEnItalien +"'", async()=>{
            const sContenuTextarea = await pageCommunication.textareaMessageIt.inputValue();
            expect(sContenuTextarea).toContain(sMessageEnItalien);
        })

        test('Button [SUPPRIMER] - Click', async () => {
            await fonction.clickElement(pageCommunication.buttonSupprimer);
        })

        test("Toast [MESSAGE ENREGISTRÉ] - Is Visible", async () => {
            await fonction.waitForDomStable(page);
            await expect(pageCommunication.toastMessage).toContainText(sMessageSupprimeItalien); 
        })

        test("TextField [MESSAGGIO D'INFORAZIONE (FRANCAIS)] - Is Empty", async () => {
            const sContenuTextarea= await pageCommunication.textareaMessageFr.inputValue();
            expect(sContenuTextarea).toBe("");   
        })

        test("TextField [MESSAGGIO D'INFORAZIONE (ITALIANO)] - Is Empty", async () => {
            const sContenuTextarea= await pageCommunication.textareaMessageIt.inputValue();
            expect(sContenuTextarea).toBe("");
        })

        test('Button [TRADUIRE] - Is Disabled', async () => {
            await expect(pageCommunication.buttonTraduireMessage).toBeDisabled(); 
        })

        test('Button [COMMUNIQUER] - Is Disabled', async () => {
            await expect(pageCommunication.buttonCommuniquer).toBeDisabled(); 
        })

        test('Button [SUPPRIMER] - Is Disabled', async () => {
            await expect(pageCommunication.buttonSupprimer).toBeDisabled(); 
        })
     
     })

    
     test('Deconnexion', async () => {
        await fonction.deconnexion(page);
     })
 
})