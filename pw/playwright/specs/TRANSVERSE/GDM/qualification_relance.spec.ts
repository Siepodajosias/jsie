/**
 * @author Mathis NGUYEN
 * @description Bout en bout nominal du curatif 16
 * @since 2024-07-03
 * 
 */
const xRefTest      = "E2E_GDM_NOM";
const xDescription  = "Bout en bout nominal du curatif P16";
const xIdTest       =  844;
const xVersion      = '3.0';  

//------------------------------------------------------------------------------------

const fs = require('fs');

import { expect, test, type Page}   from '@playwright/test';

//------------------------------------------------------------------------------------

let page                  	: Page;

//------------------------------------------------------------------------------------
const sStadeAvancement = '-Terminé prestataire'

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
            await page.getByRole('link', { name: 'Relance Qualifications Sites' }).click();
        })

        test.describe ('Onglet [QUALIFICATIONS SITE]', async () => {

            test('List Box [STADE D\'AVANCEMENT] = "' + sStadeAvancement + '"', async () => {
                await page.locator('#cphDefaut_cphDefaut_cphContenu_cmbStadesAvancement_Arrow').click();

                //Check this one
                await page.getByLabel('-Terminé prestataire').check();

                //Ensure the rest are unchecked
                await page.getByLabel('-Intervention demandée').uncheck();
                await page.getByLabel('-Devis demandé').uncheck();
                await page.getByLabel('-Devis en attente validation').uncheck();
                await page.getByLabel('-Terminée - attente facture').uncheck();
                await page.getByLabel('-Terminé - facturée ou sous contrat').uncheck();
                await page.getByLabel('-Terminée facture bloquée').uncheck();
                await page.getByLabel('- Réintervention').uncheck();
                await page.getByLabel('Attente validation magasin').uncheck();

                await page.locator('#cphDefaut_cphDefaut_cphContenu_cmbStadesAvancement_Arrow').click(); //restart
                await page.waitForTimeout(5000);
            })
            

            test('Datagrid [VALUES] - Select', async () => {
                expect(page.locator('table#cphDefaut_cphDefaut_cphContenu_gvRelancesDemandesInterventionNonQualifiees_ctl00 tbody tr', { has: page.locator('td', { hasText: iDI })})).toBeVisible();
                await page.locator('table#cphDefaut_cphDefaut_cphContenu_gvRelancesDemandesInterventionNonQualifiees_ctl00 tbody tr', { has: page.locator('td', { hasText: iDI })}).locator('td:nth-child(1) input').click();
            })

            test.describe ('Email Site', async () => {
                test('CheckBox [COPIE RESPONSABLE SEGMENTATION] - Check', async () => {
                    await page.getByLabel('Copie responsable segmentation').check();
                })

                test('Button [ENVOYER MAIL SITE] - Click', async () => {
                    await page.getByRole('button', { name: 'Envoi e-mail Site' }).click();
                })

                test('Button [FERMER MAIL SITE] - Click', async () => {
                    page.once('dialog', dialog => {
                        dialog.dismiss().catch(() => {});
                    });
                })
        
            })
        })

    })

    test('Déconnexion', async () => {
        await page.waitForTimeout(5000)
        await page.locator('#cphDefaut_cphDefaut_btnDeconnexion').click();
        await page.waitForURL("https://grandfraistest.stackr-cloud.com/GDM/GDM_Net/Modules/General/Authentification/Pages/Authentifier.aspx");
    })
})

