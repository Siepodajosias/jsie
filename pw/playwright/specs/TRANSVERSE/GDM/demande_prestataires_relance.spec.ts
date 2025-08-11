/**
 * @author Mathis NGUYEN
 * @description Bout en bout nominal du curatif P14
 * @since 2024-07-03
 * 
 */
const xRefTest      = "E2E_GDM_NOM";
const xDescription  = "Bout en bout nominal du curatif P14";
const xIdTest       =  844;
const xVersion      = '3.0';  

//------------------------------------------------------------------------------------
const fs = require('fs');

import { expect, test, type Page}   from '@playwright/test';

//------------------------------------------------------------------------------------

let page                  	: Page;

//------------------------------------------------------------------------------------

const sStadeAvancement = '-Intervention demandée';
const sNonRelanceeDepuis = '0'
const sDerniersMois = '6'
const sMail = 'E-mail'

let iDI = JSON.parse(fs.readFileSync("specs/TRANSVERSE/GDM/gdm_data.json", 'utf-8')).iDI;


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
            await page.getByRole('link', { name: 'Relances intervention' }).click();
          })

        test.describe ('Onglet [RELANCES INTERVENTION]', async () => {

            test('List Box [STADE D\'AVANCEMENT] = "' + sStadeAvancement + '"', async () => {
                await page.locator('#cphDefaut_cphDefaut_cphContenu_cmbStadesAvancement_Arrow').click();

                //Check this one
                await page.getByLabel('-Intervention demandée').check();

                //Ensure the rest are unchecked
                await page.getByLabel('-Devis demandé').uncheck();
                await page.getByLabel('-Devis en attente validation').uncheck();
                await page.getByLabel('- Réintervention').uncheck();
                await page.getByLabel('Attente validation magasin').uncheck();
            })

            test('InputField [AFFICHER DERNIER MOIS] = "' + sDerniersMois + '"', async () => {
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ntbDerniersMois').click();
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ntbDerniersMois').fill(sDerniersMois);
            })

            test('InputField [NON RELANCÉE DEPUIS] = "' + sNonRelanceeDepuis + '"', async () => {
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ntbNonRelanceeDepuis').click();
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ntbNonRelanceeDepuis').fill(sNonRelanceeDepuis);
                await page.locator('#cphDefaut_cphDefaut_cphContenu_gvRelancesDemandesIntervention_GridData').click(); //for refresh
            })

            test('Datagrid [LISTE DEVIS] = "' + iDI + '" - Select', async () => {
                await page.locator('table#cphDefaut_cphDefaut_cphContenu_gvRelancesDemandesIntervention_ctl00 tbody tr', { has: page.locator('td', { hasText: iDI })}).click()
            })

            test.describe ('Email au prestataire', async () => {
                test('Radio Box [EMAIL] = "' + sMail + '"', async () => {
                    await page.getByLabel(sMail).check();
                })
                
                test ('Button [ENVOYER EMAIL PRESTATAIRE] - Click', async () => {
                    await page.getByRole('button', { name: 'Envoi' }).click();
                })

                test ('Button [VALIDER EMAIL PRESTATAIRE] - Click', async () => {
                    await page.frameLocator('iframe[name="wndParametresRapportDefinir"]').getByRole('button', { name: 'Valider' }).click();
                    await page.waitForTimeout(5000);
                })

                test ('Button [FERMER EMAIL PRESTATAIRE] - Click', async () => {
                    await page.frameLocator('iframe[name="wndEnvoiDemandeResultat"]').getByRole('button', { name: 'Fermer' }).click();
                    await page.waitForTimeout(5000)
                })
            })

            test('Datagrid [VALUES] - Check', async () => {
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ntbNonRelanceeDepuis').click();
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ntbNonRelanceeDepuis').fill('1');
                await page.locator('#cphDefaut_cphDefaut_cphContenu_gvRelancesDemandesIntervention_GridData').click(); //for refresh
                expect(page.locator('table#cphDefaut_cphDefaut_cphContenu_gvRelancesDemandesIntervention_ctl00 tbody tr', { has: page.locator('td', { hasText: iDI })})).not.toBeVisible()
            })
        })
    })

    test('Déconnexion', async () => {
        await page.waitForTimeout(5000)
        await page.locator('#cphDefaut_cphDefaut_btnDeconnexion').click();
        await page.waitForURL("https://grandfraistest.stackr-cloud.com/GDM/GDM_Net/Modules/General/Authentification/Pages/Authentifier.aspx");
    })
})

