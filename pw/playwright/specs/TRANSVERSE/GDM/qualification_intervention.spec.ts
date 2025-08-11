/**
 * @author Mathis NGUYEN
 * @description Bout en bout nominal du curatif P17
 * @since 2024-07-03
 * 
 */
const xRefTest      = "E2E_GDM_NOM";
const xDescription  = "Bout en bout nominal du curatif P17";
const xIdTest       =  844;
const xVersion      = '3.0';   

//------------------------------------------------------------------------------------

const fs = require('fs');

import { expect, test, type Page}   from '@playwright/test';

//------------------------------------------------------------------------------------

let page                  	: Page;

//------------------------------------------------------------------------------------

function formatDateToJJMMAAAA(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const today = new Date();

const sQualificateur = "Qualificateur";
const sInterventionTerminée = 'OUI';
const sDateIntervention = formatDateToJJMMAAAA(today)
const sNoteGlobale = "BON";
const sBonInterventionSigné = "OUI";
const sDureeIntervention = "60"
const sCommentaire = "Commentaire Qualification"

let iPDI = JSON.parse(fs.readFileSync("specs/TRANSVERSE/GDM/gdm_data.json", 'utf-8')).iPDI;

const expectedColor = 'rgb(237, 108, 106)'
let oldBgColor = '';
let newBgColor = '';

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

      test('Button [QUESTION EN ATTENTE] - Click', async () => {
        oldBgColor = await page.locator('table#cphDefaut_cphDefaut_cphContenu_gvPreDemandesInterventionFolders_ctl00 tbody tr', { has: page.locator('td', { hasText: iPDI })}).locator('td:nth-child(1)').evaluate((elem) => {
          const computedStyle = getComputedStyle(elem);
          return computedStyle.borderLeftColor;
        });
        expect(oldBgColor).toBe(expectedColor)
        await page.locator('table#cphDefaut_cphDefaut_cphContenu_gvPreDemandesInterventionFolders_ctl00 tbody tr', { has: page.locator('td', { hasText: iPDI })}).locator('a').nth(6).click() //... so bad
      })

      test('InputField [QUALIFICATEUR] = "' + sQualificateur + '"', async () => {
        await page.locator('#cphDefaut_cphDefaut_cphContenu_ucQualifications_gvQualifications_ctl00_ctl04_tbQualificateur').click();
        await page.locator('#cphDefaut_cphDefaut_cphContenu_ucQualifications_gvQualifications_ctl00_ctl04_tbQualificateur').fill(sQualificateur);
      })

      test('ListBox [INTERVENTION TERMINEE] = "' + sInterventionTerminée + '"', async () => { 
        await page.locator('#cphDefaut_cphDefaut_cphContenu_ucQualifications_gvQualifications_ctl00_ctl04_cmbReponse_0_Arrow').click();
        await page.locator('#cphDefaut_cphDefaut_cphContenu_ucQualifications_gvQualifications_ctl00_ctl04_cmbReponse_0_DropDown').getByText(sInterventionTerminée).click();
      })

      test('Date Intervention - Choose', async () => {
        await page.locator('#cphDefaut_cphDefaut_cphContenu_ucQualifications_gvQualifications_ctl00_ctl06_dpReponse_1_dateInput').click();
        await page.locator('#cphDefaut_cphDefaut_cphContenu_ucQualifications_gvQualifications_ctl00_ctl06_dpReponse_1_dateInput').fill(sDateIntervention);
      });


      test('ListBox [NOTE GLOBALE INTERVENTION] = "' + sNoteGlobale + '"', async () => { 
        await page.locator('#cphDefaut_cphDefaut_cphContenu_ucQualifications_gvQualifications_ctl00_ctl08_cmbReponse_2_Input').click();
        await page.getByText(sNoteGlobale, { exact: true }).click();
      })

      test('ListBox [BON INTERVENTION SIGNE] = "' + sBonInterventionSigné + '"', async () => { 
        await page.locator('#cphDefaut_cphDefaut_cphContenu_ucQualifications_gvQualifications_ctl00_ctl10_cmbReponse_3_Input').click();
        await page.locator('#cphDefaut_cphDefaut_cphContenu_ucQualifications_gvQualifications_ctl00_ctl10_cmbReponse_3_DropDown').getByText(sBonInterventionSigné).click();
      })

      test('InputField [DUREE INTERVENTION] = "' + sDureeIntervention + '"', async () => {
        await page.locator('#cphDefaut_cphDefaut_cphContenu_ucQualifications_gvQualifications_ctl00_ctl12_tbReponse_4').click();
        await page.locator('#cphDefaut_cphDefaut_cphContenu_ucQualifications_gvQualifications_ctl00_ctl12_tbReponse_4').fill(sDureeIntervention);
      })

      test('InputField [COMMENTAIRE] = "' + sCommentaire + '"', async () => {
        await page.locator('#cphDefaut_cphDefaut_cphContenu_ucQualifications_gvQualifications_ctl00_ctl14_tbReponse_5').click();
      await page.locator('#cphDefaut_cphDefaut_cphContenu_ucQualifications_gvQualifications_ctl00_ctl14_tbReponse_5').fill(sCommentaire);
      })

      test ('Button [VALIDER] - Click', async () => {
        await page.getByRole('button', { name: 'Valider' }).click();
        await page.waitForTimeout(5000)

        newBgColor = await page.locator('table#cphDefaut_cphDefaut_cphContenu_gvPreDemandesInterventionFolders_ctl00 tbody tr', { has: page.locator('td', { hasText: iPDI })}).locator('td:nth-child(1)').evaluate((elem) => {
          const computedStyle = getComputedStyle(elem);
          return computedStyle.borderLeftColor;
        });
        expect(newBgColor).not.toBe(oldBgColor)
      })

    })

    test('Déconnexion', async () => {
      await page.getByRole('link', { name: '' }).click();
      await page.waitForURL("https://grandfraistest.stackr-cloud.com/GDM/GDM_Net_Mobility/Modules/General/Authentification/Pages/Authentifier.aspx");
    })

})

