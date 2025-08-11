/**
 * @author Mathis NGUYEN
 * @description Bout en bout nominal du curatif P5
 * @since 2024-07-03
 * 
 */
const xRefTest      = "E2E_GDM_NOM";
const xDescription  = "Bout en bout nominal du curatif P5";
const xIdTest       =  844;
const xVersion      = '3.0'; 

//------------------------------------------------------------------------------------
const fs = require('fs');

import { expect, test, type Page}   from '@playwright/test';

//------------------------------------------------------------------------------------

let page                  	: Page;

//------------------------------------------------------------------------------------

const sPriseEnCharge = '-'
const sQuestionReponse = 'Non lues'

let iPDI = JSON.parse(fs.readFileSync("specs/TRANSVERSE/GDM/gdm_data.json", 'utf-8')).iPDI;
let sReponse = JSON.parse(fs.readFileSync("specs/TRANSVERSE/GDM/gdm_data.json", 'utf-8')).sReponse;

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
                await page.waitForTimeout(5000);
                await page.reload();
                await page.waitForTimeout(5000);
            })

            test('DataGrid [PRÉ-DEMANDE] = "' + iPDI + '" - Select', async () => {
                await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucPreDemandesInterventionLister_gvPredemandesInterventions_ctl00 tbody tr', { has: page.locator('td', { hasText: iPDI })}).click()
            })

            test('Button [MODIFIER QUESTION] - Click', async () => {
                await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucPredemandeInterventionMessagesLister_gvPredemandeInterventionMessages_ctl00 tbody tr', { has: page.locator('td', { hasText: sReponse })}).locator('td:nth-child(8) input').click();
            })

            test('CheckBox [MARQUER COMME LU] - Select', async () => {
                await page.frameLocator('iframe[name="wndMessageEditer"]').getByLabel('Marquer comme lu').check();
            })

            test ('Button [VALIDER] - Click', async () => {
                await page.frameLocator('iframe[name="wndMessageEditer"]').getByRole('button', { name: 'Valider' }).click();
            })

            test('Radio Box [QUESTIONS/RÉPONSES #2] = "' + sQuestionReponse + '"', async () => {
                await page.getByText('Non lues').click();
                await page.waitForTimeout(5000);
                await page.reload();
                await page.waitForTimeout(5000);
            })

            test('DataGrid [VALUES] - Check', async () => {
                expect(page.locator('table#cphDefaut_cphDefaut_cphContenu_ucPreDemandesInterventionLister_gvPredemandesInterventions_ctl00 tbody tr', { has: page.locator('td', { hasText: iPDI })})).not.toBeVisible()
            })
        })
    })

    test('Déconnexion', async () => {
        await page.waitForTimeout(5000)
        await page.locator('#cphDefaut_cphDefaut_btnDeconnexion').click();
        await page.waitForURL("https://grandfraistest.stackr-cloud.com/GDM/GDM_Net/Modules/General/Authentification/Pages/Authentifier.aspx");
    })
})

