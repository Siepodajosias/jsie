/**
 * @author Mathis NGUYEN
 * @description Bout en bout nominal du curatif P3
 * @since 2024-07-03
 * 
 */
const xRefTest      = "E2E_GDM_NOM";
const xDescription  = "Bout en bout nominal du curatif P3";
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

const sPriseEnCharge = '-'
const sQuestionReponse = 'Attente de réponse'

const sQuestionRelance = "Question\nRelance_" + formatDateToISO(new Date());
let iPDI = JSON.parse(fs.readFileSync("specs/TRANSVERSE/GDM/gdm_data.json", 'utf-8')).iPDI;
let sQuestion = JSON.parse(fs.readFileSync("specs/TRANSVERSE/GDM/gdm_data.json", 'utf-8')).sQuestion;


//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page                = await browser.newPage();
});

//------------------------------------------------------------------------------------  

test.describe.serial('[' + xRefTest + ']', async () => {

    test('Ouverture URL Web Central', async () => {
        await page.goto('https://grandfraistest.stackr-cloud.com/GDM/GDM_Net/Modules/General/Authentification/Pages/Authentifier.aspx?raison=AuthentificationRequise&pageDemandee=aHR0cHM6Ly9ncmFuZGZyYWlzdGVzdC5zdGFja3ItY2xvdWQuY29tOjQ0My9HRE0vR0RNX05ldC9Nb2R1bGVzL0dlbmVyYWwvQWNjdWVpbC9QYWdlcy9EZWZhdWx0LmFzcHg=');
    })

    test('Connexion', async () => {
        await page.locator('#cphDefaut_AuthentifierForm_tbNomUtilisateur').fill('vheurtel');
        await page.locator('#cphDefaut_AuthentifierForm_tbMotDePasse').click();
        await page.locator('#cphDefaut_AuthentifierForm_tbMotDePasse').fill('PROSOL');
        await page.getByRole('button', { name: 'Connexion' }).click();
        await page.waitForTimeout(5000)
    })

    test.describe ('Page [ACCUEIL]', async () => {

        test('Page [ACCUEIL] - Click & Hover', async () => {
            await page.getByRole('link', { name: 'Accès au module maintenance' }).click();
            await page.getByRole('link', { name: 'Curatif', exact: true }).hover();
            await page.getByRole('link', { name: 'Pré-demandes d\'intervention' }).click();
          })

        test.describe ('Onglet [PRÉ-DEMANDES D\'INTERVENTION]', async () => {
            
            test('List Box [PRISE EN CHARGE] = "' + sPriseEnCharge + '"', async () => {
                await page.locator('#cphDefaut_cphDefaut_cphContenu_cmbPriseEnCharge_Arrow').click();
                await page.locator('#cphDefaut_cphDefaut_cphContenu_cmbPriseEnCharge_DropDown').getByText(sPriseEnCharge).click();
            })

            test('Radio Box [QUESTIONS/RÉPONSES] = "' + sQuestionReponse + '"', async () => {
                await page.getByText(sQuestionReponse).click();
                //Refresh problem
                await page.waitForTimeout(5000);
                await page.reload();
                await page.waitForTimeout(5000);

                expect(await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucPreDemandesInterventionLister_gvPredemandesInterventions_ctl00 tbody tr', { has: page.locator('td', { hasText: "En cours" })}).count()).toBe(0)
                expect(await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucPreDemandesInterventionLister_gvPredemandesInterventions_ctl00 tbody tr', { has: page.locator('td', { hasText: "Terminée" })}).count()).toBe(0)
                expect(await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucPreDemandesInterventionLister_gvPredemandesInterventions_ctl00 tbody tr', { has: page.locator('td', { hasText: "Sans suite" })}).count()).toBe(0)
                expect(await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucPreDemandesInterventionLister_gvPredemandesInterventions_ctl00 tbody tr', { has: page.locator('td', { hasText: "En attente" })}).count()).toBeGreaterThan(0)
            })

            test('DataGrid [PRÉ-DEMANDE] = "' + iPDI + '" - Select', async () => {
                await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucPreDemandesInterventionLister_gvPredemandesInterventions_ctl00 tbody tr', { has: page.locator('td', { hasText: iPDI })}).click()
            })

            test('Button [MODIFIER QUESTION] - Click', async () => {
                await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucPredemandeInterventionMessagesLister_gvPredemandeInterventionMessages_ctl00 tbody tr', { has: page.locator('td', { hasText: sQuestion })}).locator('td:nth-child(8) input').click()
            })

            test('InputField [QUESTION]', async () => {
                await page.frameLocator('iframe[name="wndMessageEditer"]').getByLabel('Description').click();
                await page.frameLocator('iframe[name="wndMessageEditer"]').getByLabel('Description').fill(sQuestionRelance);

                // *************** STORE sQuestionRelance (Needed for future identification) ***************

                const jsonContent = {
                    sQuestionRelance
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
                      console.log(`Enregistrement de la question relancée ${sQuestionRelance} dans le fichier : gdm_data.json`);
                    });
                });

                // **********************************************************************************
            })

            test ('CheckBox [ENVOYER MAIL SITE] - Select', async () => {
                await page.frameLocator('iframe[name="wndMessageEditer"]').locator('#cphDefaut_cphDefaut_cbEnvoyerQuestionReponseSite').check();
            })

            test ('Button [VALIDER] - Click', async () => {
                await page.frameLocator('iframe[name="wndMessageEditer"]').getByRole('button', { name: 'Valider' }).click();
            })
        })
    })

    test('Déconnexion', async () => {
        await page.waitForTimeout(5000)
        await page.locator('#cphDefaut_cphDefaut_btnDeconnexion').click();
        await page.waitForURL("https://grandfraistest.stackr-cloud.com/GDM/GDM_Net/Modules/General/Authentification/Pages/Authentifier.aspx");
    })
})

