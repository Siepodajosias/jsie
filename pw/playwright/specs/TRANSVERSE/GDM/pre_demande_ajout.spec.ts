/**
 * @author Mathis NGUYEN
 * @description Bout en bout nominal du curatif P1
 * @since 2024-07-03
 * 
 */
const xRefTest      = "E2E_GDM_NOM";
const xDescription  = "Bout en bout nominal du curatif P1";
const xIdTest       =  844;
const xVersion      = '3.0';  

//------------------------------------------------------------------------------------

const fs = require('fs');
import { expect, test, type Page}   from '@playwright/test';

//------------------------------------------------------------------------------------

let page                  	: Page;

//------------------------------------------------------------------------------------

const sNomDemandeur = "Test_AUTO_Demandeur";
const sTheme = "ELECTRICITE";
const sDescriptif = "Descriptif";
const sAttachmentPath = 'C:\\pw\\playwright\\specs\\TRANSVERSE\\GDM\\attachments\\HelloWorld.txt'; //PATH TO UPDATE !!!

let elementsBefore = 0;
let elementsAfter = 0;
let sStatus = ""
let iPDI = "";

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page                = await browser.newPage();
});

//------------------------------------------------------------------------------------  

test.describe.serial('[' + xRefTest + ']', async () => {

    test('Ouverture URL Web Magasin', async () => {
        await page.goto('https://grandfraistest.stackr-cloud.com/GDM/GDM_Net_Mobility/Modules/General/Authentification/Pages/Authentifier.aspx?raison=AuthentificationRequise');
    })

    test('Connexion', async () => {
      await page.locator('#cphDefaut_ucAuthentifierUtilisateur_tbNomUtilisateur').click();
      await page.locator('#cphDefaut_ucAuthentifierUtilisateur_tbNomUtilisateur').press('PageDown');
      await page.locator('#cphDefaut_ucAuthentifierUtilisateur_tbNomUtilisateur').press('NumLock');
      await page.locator('#cphDefaut_ucAuthentifierUtilisateur_tbNomUtilisateur').fill('320FL');
      await page.locator('#cphDefaut_ucAuthentifierUtilisateur_tbMotDePasse').click();
      await page.locator('#cphDefaut_ucAuthentifierUtilisateur_tbMotDePasse').fill('320FL');
      await page.getByRole('button', { name: 'Connexion' }).click();
      await page.waitForTimeout(5000)
    })

    test.describe ('Page [PRÉ-DEMANDES]', async () => {

      test('Button [AJOUTER PRÉ-DEMANDE] - Click', async () => {
        //elementsBefore = await page.locator('table#cphDefaut_cphDefaut_cphContenu_gvPreDemandesInterventionFolders_ctl00 tbody tr').count(); //store elements before update
        await page.getByRole('link', { name: 'Ajouter' }).click();
        await page.waitForLoadState()
      })

      test.describe ('Onglet [MODIFICATION]', async () => {
        test('InputField [NOM DEMANDEUR] = "' + sNomDemandeur + '"', async () => {
          await page.getByLabel('Nom demandeur').click();
          await page.getByLabel('Nom demandeur').fill(sNomDemandeur);
          
        })

        test('ListBox [THEME] = "' + sTheme + '"', async () => { 
          await page.getByText('select').click();
          await page.getByText(sTheme).click();
        })

        test('InputField [DESCRIPTIF] = "' + sDescriptif + '"', async () => {
          await page.getByLabel('Descriptif').click();
          await page.getByLabel('Descriptif').fill(sDescriptif);
        })

        test('Attachment', async () => {
          await page.getByRole('link', { name: 'Ajouter' }).click();
          await page.frameLocator('iframe[name="wndDocumentAjouter"]').locator('#cphDefaut_cphDefaut_uplFichierfile0').click();
          await page.frameLocator('iframe[name="wndDocumentAjouter"]').locator('#cphDefaut_cphDefaut_uplFichierfile0').setInputFiles(sAttachmentPath);
          await page.frameLocator('iframe[name="wndDocumentAjouter"]').getByRole('button', { name: 'Valider' }).click();
        })

        test ('Button [VALIDER] - Click', async () => {
          await page.getByRole('button', { name: 'Valider' }).click();
          await page.waitForTimeout(5000)
        })
      })

      test('Datagrid [VALUES] - Check', async () => {
        /*elementsAfter = await page.locator('table#cphDefaut_cphDefaut_cphContenu_gvPreDemandesInterventionFolders_ctl00 tbody tr').count(); //store elements after update
        expect(elementsAfter).toEqual(elementsBefore + 1) //expect one more element than before*/

        sStatus = (await page.locator('table#cphDefaut_cphDefaut_cphContenu_gvPreDemandesInterventionFolders_ctl00 tbody tr:nth-child(1) td:nth-child(8)').textContent()).trim(); //first element by default...
        expect(sStatus).toBe("En attente") //expect the one more element to have "En attente" status 

        // *************** STORE iPDI (Pré-demande ID) (needed for future identification) ***************

        iPDI = (await page.locator('table#cphDefaut_cphDefaut_cphContenu_gvPreDemandesInterventionFolders_ctl00 tbody tr:nth-child(1) td:nth-child(3)').textContent()).trim(); //get the PDI of this one more element

        const jsonContent = {
          iPDI
        };

        fs.writeFile("specs/TRANSVERSE/GDM/gdm_data.json", JSON.stringify(jsonContent, null, 4), (error) => {
            if (error) {
              console.log('An error has occurred', error);
              return;
            }
            console.log(`Enregistrement du PDI ${iPDI} dans le fichier : gdm_data.json`);
        });

        // **********************************************************
      })

    })

    test('Déconnexion', async () => {
      await page.getByRole('link', { name: '' }).click();
      await page.waitForURL("https://grandfraistest.stackr-cloud.com/GDM/GDM_Net_Mobility/Modules/General/Authentification/Pages/Authentifier.aspx");
    })

})

