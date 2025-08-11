/**
 * @author Mathis NGUYEN
 * @description Bout en bout nominal du curatif P18
 * @since 2024-07-03
 * 
 */
const xRefTest      = "E2E_GDM_NOM";
const xDescription  = "Bout en bout nominal du curatif P18";
const xIdTest       =  844;
const xVersion      = '3.0'; 

//------------------------------------------------------------------------------------

const fs = require('fs');

import { expect, test, type Page}   from '@playwright/test';

//------------------------------------------------------------------------------------

let page                  	: Page;

//------------------------------------------------------------------------------------

const sStadeAvancement = '-Terminé prestataire'
const sQualifiees = 'Oui'

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
            await page.getByRole('link', { name: 'Accès à la gestion des Demandes d\'intervention Interventions' }).click();
          })

        test.describe ('Onglet [INTERVENTIONS]', async () => {

            test('InputField [N°] = "' + iDI + '"', async () => {
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ntbID').click();
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ntbID').fill(iDI.trim());
            })

            test.describe ('Filtre A', async () => {
                test('List Box [STADE D\'AVANCEMENT] = "' + sStadeAvancement + '"', async () => {
                    await page.getByRole('link', { name: 'Filtre A' }).click();
                    await page.locator('#cphDefaut_cphDefaut_cphContenu_cmbStadesAvancement_Arrow').click();

                    //Check this one
                    await page.getByLabel('-Terminé prestataire').check();

                    //Ensure the rest are unchecked
                    await page.getByLabel('-Devis demandé').uncheck();
                    await page.getByLabel('-Devis en attente validation').uncheck();
                    await page.getByLabel('-Intervention demandée').uncheck();
                    await page.getByLabel('-Terminée - attente facture').uncheck();
                    await page.getByLabel('-Terminé - facturée ou sous contrat').uncheck();
                    await page.getByLabel('-Intervention annulée').uncheck();
                    await page.getByLabel('-Terminée facture bloquée').uncheck();
                    await page.getByLabel('- Réintervention').uncheck();
                    await page.getByLabel('Attente validation magasin').uncheck();
                })
            
            })

            test.describe ('Filtre B', async () => {
                test('List Box [QUALIFIEES] = "' + sQualifiees + '"', async () => {
                    await page.getByRole('link', { name: 'Filtre B' }).click();
                    await page.locator('#cphDefaut_cphDefaut_cphContenu_cmbQualifiee_Arrow').click();
                    await page.locator('#cphDefaut_cphDefaut_cphContenu_cmbQualifiee_DropDown').getByText(sQualifiees).click();
                })
            })

            test('Button [MODIFIER DEMANDE D\'INTERVENTION]  = "' + iDI + '" - Click', async () => {
                await page.getByRole('button', { name: 'Editer' }).click();
            })

            test('Button [QUALIFICATIONS] - Click', async () => {
                await page.getByRole('link', { name: 'La demande a été qualifiée' }).click();
            })

            test.describe ('Onglet [QUALIFICATIONS]', async () => {

                test('InputField [QUALIFICATEUR] - Check', async () => {
                    expect(await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_ucQualifications_gvQualifications_ctl00_ctl04_tbQualificateur').inputValue()).toBeTruthy();
                })
            
                test('ListBox [INTERVENTION TERMINEE] - Check', async () => { 
                expect(await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_ucQualifications_gvQualifications_ctl00_ctl04_cmbReponse_0_Input').inputValue()).toBeTruthy();
                })
        
                test('Date Intervention - Check', async () => {
                expect(await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_ucQualifications_gvQualifications_ctl00_ctl06_dpReponse_1_dateInput').inputValue()).toBeTruthy();
                });
        
                test('ListBox [NOTE GLOBALE INTERVENTION] - Check', async () => { 
                expect(await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_ucQualifications_gvQualifications_ctl00_ctl08_cmbReponse_2_Input').inputValue()).toBeTruthy();
                })
        
                test('ListBox [BON INTERVENTION SIGNE] - Check', async () => { 
                expect(await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_ucQualifications_gvQualifications_ctl00_ctl10_cmbReponse_3_Input').inputValue()).toBeTruthy();
                })
        
                test('InputField [DUREE INTERVENTION] - Check', async () => {
                expect(await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_ucQualifications_gvQualifications_ctl00_ctl12_tbReponse_4').textContent()).toBeTruthy();
                })
        
                test('InputField [COMENTAIRE] - Check', async () => {
                expect(await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_ucQualifications_gvQualifications_ctl00_ctl14_tbReponse_5').textContent()).toBeTruthy();
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

