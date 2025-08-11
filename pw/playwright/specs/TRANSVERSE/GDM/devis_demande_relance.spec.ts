/**
 * @author Mathis NGUYEN
 * @description Bout en bout nominal du curatif P9
 * @since 2024-07-03
 * 
 */
const xRefTest      = "E2E_GDM_NOM";
const xDescription  = "Bout en bout nominal du curatif P9";
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

const sEtat = "En attente"
const sStadeAvancement = '-Devis demandé';
const sNonRelanceeDepuis = '6'
const sMail = 'E-mail'

let iDDI = JSON.parse(fs.readFileSync("specs/TRANSVERSE/GDM/gdm_data.json", 'utf-8')).iDDI;


//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
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
            await page.getByRole('link', { name: 'Relances devis' }).click();
          })

        test.describe ('Onglet [RELANCES DEVIS]', async () => {

            test('List Box [ETAT] = "' + sEtat + '"', async () => {
                await page.locator('#cphDefaut_cphDefaut_cphContenu_cmbEtat_Arrow').click();
                await page.getByText(sEtat, { exact: true }).click();
            })

            test('List Box [STADE D\'AVANCEMENT] = "' + sStadeAvancement + '"', async () => {
                await page.locator('#cphDefaut_cphDefaut_cphContenu_cmdStadesDemandeIntervention_Arrow').click();
                await page.getByText(sStadeAvancement).click();
            })

            test('InputField [NON RELANCÉE DEPUIS] = "' + sNonRelanceeDepuis + '"', async () => {
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ntbDepuis').click();
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ntbDepuis').fill(sNonRelanceeDepuis);
                await page.locator('#cphDefaut_cphDefaut_cphContenu_gvRelancesDemandesDevis_GridData').click(); //for refresh
            })

            test('Datagrid [LISTE DEVIS] = "' + iDDI + '" - Select', async () => {
                await page.locator('table#cphDefaut_cphDefaut_cphContenu_gvRelancesDemandesDevis_ctl00 tbody tr', { has: page.locator('td', { hasText: iDDI })}).click()
            })

            test('Radio Box [EMAIL]  = "' + sMail + '" - Select', async () => {
                await page.getByLabel(sMail).check();
            })

            test ('Button [ENVOI] - Click', async () => {
                await page.getByRole('button', { name: 'Envoi' }).click();
                await page.waitForTimeout(5000)
            })
            
            test ('Button [VALIDER] - Click', async () => {
                await page.frameLocator('iframe[name="wndParametresRapportDefinir"]').getByRole('button', { name: 'Valider' }).click();
                await page.waitForTimeout(5000)
            })

            test('Datagrid [VALUES] - Check', async () => {
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ntbDepuis').click();
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ntbDepuis').fill('0');
                await page.locator('#cphDefaut_cphDefaut_cphContenu_gvRelancesDemandesDevis_GridData').click(); //for refresh
                expect (await page.locator('table#cphDefaut_cphDefaut_cphContenu_gvRelancesDemandesDevis_ctl00 tbody tr', { has: page.locator('td', { hasText: iDDI })}).locator('td:nth-child(13)').textContent()).toEqual(formatDateToJJMMAAAA(new Date()))
            })
        })
    })

    test('Déconnexion', async () => {
        await page.waitForTimeout(5000)
        await page.locator('#cphDefaut_cphDefaut_btnDeconnexion').click();
        await page.waitForURL("https://grandfraistest.stackr-cloud.com/GDM/GDM_Net/Modules/General/Authentification/Pages/Authentifier.aspx");
    })
})

