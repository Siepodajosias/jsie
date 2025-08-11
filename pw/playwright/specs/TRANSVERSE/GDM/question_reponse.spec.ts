/**
 * @author Mathis NGUYEN
 * @description Bout en bout nominal du curatif P4
 * @since 2024-07-03
 * 
 */
const xRefTest      = "E2E_GDM_NOM";
const xDescription  = "Bout en bout nominal du curatif P4";
const xIdTest       =  844;
const xVersion      = '3.0';  

//------------------------------------------------------------------------------------
const fs = require('fs');

import { expect, test, type Page}   from '@playwright/test';
//------------------------------------------------------------------------------------

let page                  	: Page;

//------------------------------------------------------------------------------------
function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  const milliseconds = ('00' + date.getMilliseconds()).slice(-3);


  const offset = -date.getTimezoneOffset();
  const offsetSign = offset >= 0 ? '+' : '-';

  const offsetHours = ('0' + Math.abs(offset / 60)).slice(-2);
  const offsetMinutes = '00'
  
  const isoDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetSign}${offsetHours}:${offsetMinutes}`;

  return isoDate;
}

const sAuteur = "Test_AUTO_Répondeur";
const sObjet = "Objet";
const sReponse = "Réponse_" + formatDateToISO(new Date());;

let oldBgColor = "";
let newBgColor = "";

let iPDI = JSON.parse(fs.readFileSync("specs/TRANSVERSE/GDM/gdm_data.json", 'utf-8')).iPDI;
let sQuestionRelance = JSON.parse(fs.readFileSync("specs/TRANSVERSE/GDM/gdm_data.json", 'utf-8')).sQuestionRelance;

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

      test('Button [QUESTION EN ATTENTE] = "' + iPDI + '" - Click', async () => {
        await page.locator('table#cphDefaut_cphDefaut_cphContenu_gvPreDemandesInterventionFolders_ctl00 tbody tr', { has: page.locator('td', { hasText: iPDI })}).locator('a').nth(6).click() //... so bad
      })

      test.describe ('Onglet [VISUALISATION]', async () => {
        test('Button [EDITER] - Click', async () => {
          oldBgColor = await page.locator('table#cphDefaut_cphDefaut_cphContenu_gvPredemandeInterventionMessages_ctl00 tbody tr', { has: page.locator('td', { hasText: sQuestionRelance })}).evaluate((elem) => {
              const computedStyle = getComputedStyle(elem);
              return computedStyle.backgroundColor;
          }); //store color before update

          await page.locator('table#cphDefaut_cphDefaut_cphContenu_gvPredemandeInterventionMessages_ctl00 tbody tr', { has: page.locator('td', { hasText: sQuestionRelance })}).locator('a').click()
          await page.getByRole('link', { name: 'Editer' }).click();
          await page.waitForTimeout(5000);
        })

        test('InputField [AUTEUR] = "' + sAuteur + '"', async () => {
          await page.frameLocator('iframe[name="wndMessageEditer"]').locator('#cphDefaut_cphDefaut_tbAuteurReponse').click();
          await page.frameLocator('iframe[name="wndMessageEditer"]').locator('#cphDefaut_cphDefaut_tbAuteurReponse').fill(sAuteur);
        })
        test('InputField [OBJET] = "' + sObjet + '"', async () => { 
          await page.frameLocator('iframe[name="wndMessageEditer"]').locator('#cphDefaut_cphDefaut_tbObjetReponse').click();
          await page.frameLocator('iframe[name="wndMessageEditer"]').locator('#cphDefaut_cphDefaut_tbObjetReponse').fill(sObjet);
        })
        test('InputField [REPONSE]', async () => { 
          await page.frameLocator('iframe[name="wndMessageEditer"]').locator('#cphDefaut_cphDefaut_tbCorpsReponse').click();
          await page.frameLocator('iframe[name="wndMessageEditer"]').locator('#cphDefaut_cphDefaut_tbCorpsReponse').fill(sReponse);

          // *************** STORE sReponse (Needed for future identification) ***************

          const jsonContent = {
            sReponse
          };

          fs.readFile("specs/TRANSVERSE/GDM/gdm_data.json", 'utf8', (error, data) => {
              if (error) {
                console.log('An error occurred while reading the file :', error);
                return;
              }
          
              let jsonData = JSON.parse(data);
              Object.assign(jsonData, jsonContent);
          
              fs.writeFile("specs/TRANSVERSE/GDM/gdm_data.json", JSON.stringify(jsonData, null, 4), (error) => {
                if (error) {
                  console.log('An error occurred while writing to the file:', error);
                  return;
                }
                console.log(`Enregistrement de la réponse ${sReponse} dans le fichier : gdm_data.json`);
              });
          });

          // **********************************************************************************
        })

        test ('Button [VALIDER] - Click', async () => {
          await page.frameLocator('iframe[name="wndMessageEditer"]').getByRole('button', { name: 'Valider' }).click();

          //Refresh problem
          await page.waitForTimeout(5000)
          await page.reload();
          await page.waitForTimeout(5000)

          newBgColor = await page.locator('table#cphDefaut_cphDefaut_cphContenu_gvPredemandeInterventionMessages_ctl00 tbody tr', { has: page.locator('td', { hasText: sQuestionRelance })}).evaluate((elem) => {
            const computedStyle = getComputedStyle(elem);
            return computedStyle.backgroundColor;
          });

          expect(newBgColor).not.toBe(oldBgColor)
        })
      })

    })

    test('Déconnexion', async () => {
      await page.getByRole('link', { name: '' }).click();
      await page.waitForURL("https://grandfraistest.stackr-cloud.com/GDM/GDM_Net_Mobility/Modules/General/Authentification/Pages/Authentifier.aspx");
  })

})

