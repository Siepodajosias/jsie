/**
 * @author Mathis NGUYEN
 * @description Bout en bout nominal du curatif P11
 * @since 2024-07-03
 * 
 */
const xRefTest      = "E2E_GDM_NOM";
const xDescription  = "Bout en bout nominal du curatif P11";
const xIdTest       =  844;
const xVersion      = '3.0';

//------------------------------------------------------------------------------------
const fs = require('fs');

import { expect, test, type Page}   from '@playwright/test';

//------------------------------------------------------------------------------------

let page                  	: Page;

//------------------------------------------------------------------------------------

const sStadeAvancement = '-Devis demandé'
const sQualifiees = 'Non'

const sFournisseur = 'ZHINF'


let iDI = JSON.parse(fs.readFileSync("specs/TRANSVERSE/GDM/gdm_data.json", 'utf-8')).iDI;
let iDDI = JSON.parse(fs.readFileSync("specs/TRANSVERSE/GDM/gdm_data.json", 'utf-8')).iDDI;


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
                    await page.getByLabel('-Devis demandé').check();

                    //Ensure the rest are unchecked
                    await page.getByLabel('-Intervention demandée').uncheck();
                    await page.getByLabel('-Devis en attente validation').uncheck();
                    await page.getByLabel('-Terminé prestataire').uncheck();
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

            test('Button [MODIFIER DEMANDE D\'INTERVENTION] = "' + iDI + '" - Click', async () => {
                await page.getByRole('button', { name: 'Editer' }).click();
            })

            test('Button [DEVIS PRESTATAIRES] - Click', async () => {
                await page.getByRole('link', { name: 'Devis prestataires' }).click();
            })

            test.describe ('Onglet [DEVIS PRESTATAIRES]', async () => {
                test('Datagrid [LISTE DEVIS] = "' + iDDI + '" - Select', async () => {
                    await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_gvDevis_ctl00 tbody tr', { has: page.locator('td', { hasText: iDDI })}).click();
                })

                test('Button [ACCEPTER DEVIS] - Click', async () => {
                    await page.getByRole('button', { name: 'Accepter devis' }).click();
                    await page.waitForTimeout(10000)
                })
            })

            test.describe ('Onglet [DEVIS]', async () => {
                test('ListBox [FOURNISSEUR] - Check', async () => {
                    expect(await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_cmbFournisseursCodes_Input').inputValue()).toBe(sFournisseur);
                })

                test('InputField [REFERENCE DEVIS] - Check', async () => {
                    expect(await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_tbReferenceFournisseur').inputValue()).toBeTruthy()
                })

                test('InputField [COUT ESTIME] - Check', async () => {
                    expect(await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_ntbCoutEstime').inputValue()).toBeTruthy()
                })

                /*test('Color [STADE AVANCEMENT] - Check', async () => { // ???
                })*/
                
            })

        })
    })

    test('Déconnexion', async () => {
        await page.waitForTimeout(5000)
        await page.locator('#cphDefaut_cphDefaut_btnDeconnexion').click();
        await page.waitForURL("https://grandfraistest.stackr-cloud.com/GDM/GDM_Net/Modules/General/Authentification/Pages/Authentifier.aspx");
    })
})

