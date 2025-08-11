/**
 * @author Mathis NGUYEN
 * @description Bout en bout nominal du curatif P7
 * @since 2024-07-03
 * 
 */
const xRefTest      = "E2E_GDM_NOM";
const xDescription  = "Bout en bout nominal du curatif P7";
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

const sStadeAvancement = '-Devis demandé'
const sQualifiees = 'Non'

const sFournisseur = 'ZHINF'
const sActivite = 'ELECTRICITE/ ECLAIRAGE'
const sDescription = 'Descriptif clair\nDemande de devis'

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

const sDateSouhaitee = formatDateToJJMMAAAA(yesterday)
const sDateEnvoi = formatDateToJJMMAAAA(today)

let iDI = JSON.parse(fs.readFileSync("specs/TRANSVERSE/GDM/gdm_data.json", 'utf-8')).iDI;
let iDDI = "";

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
                test('Button [AJOUTER LISTE DEVIS] - Click', async () => {
                    await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_gvDevis_ctl00_ctl02_ctl00_tdAjouter').click();
                })

                test('ListBox [ACTIVITE] = -', async () => {
                    await page.frameLocator('iframe[name="wndEditerDevis"]').locator('#cphDefaut_cphDefaut_cmbBaseActivite_Arrow').click();
                    await page.frameLocator('iframe[name="wndEditerDevis"]').locator('#cphDefaut_cphDefaut_cmbBaseActivite_DropDown').getByText('-', { exact: true }).click(); //JUST TO RESET FILTERS
                })

                test('ListBox [FOURNISSEUR] = "' + sFournisseur + '"', async () => {
                    await page.frameLocator('iframe[name="wndEditerDevis"]').locator('#cphDefaut_cphDefaut_cmbFournisseursCodes_Arrow').click();
                    await page.frameLocator('iframe[name="wndEditerDevis"]').getByText(sFournisseur).click();
                })

                test('ListBox [ACTIVITE] = "' + sActivite  + '"', async () => {
                    await page.waitForTimeout(5000)
                    await page.frameLocator('iframe[name="wndEditerDevis"]').locator('#cphDefaut_cphDefaut_cmbBaseActivite_Arrow').click();
                    await page.frameLocator('iframe[name="wndEditerDevis"]').getByText(sActivite).click();
                })

                test('Date Souhaitée - Choose', async () => {
                    await page.frameLocator('iframe[name="wndEditerDevis"]').locator('#cphDefaut_cphDefaut_dpDateSouhaitee_dateInput').click();
                    await page.frameLocator('iframe[name="wndEditerDevis"]').locator('#cphDefaut_cphDefaut_dpDateSouhaitee_dateInput').fill(sDateSouhaitee)
                });


                test('Date Envoi - Choose', async () => {
                    await page.frameLocator('iframe[name="wndEditerDevis"]').locator('#cphDefaut_cphDefaut_dpDateEnvoi_dateInput').click();
                    await page.frameLocator('iframe[name="wndEditerDevis"]').locator('#cphDefaut_cphDefaut_dpDateEnvoi_dateInput').fill(sDateEnvoi);         
                });

                test('InputField [DESCRIPTION] = "' + sDescription  + '"', async () => { 
                    await page.frameLocator('iframe[name="wndEditerDevis"]').locator('#cphDefaut_cphDefaut_tbDescription').fill(sDescription);
                })

            })

            test ('Button [VALIDER] - Click', async () => {
                await page.frameLocator('iframe[name="wndEditerDevis"]').getByRole('button', { name: 'Valider' }).click();
                await page.waitForTimeout(5000)
            })

            test('Datagrid [VALUES] - Check', async () => {
                expect(await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_gvDevis_ctl00 tbody tr').count()).toBeGreaterThan(0)
            })

            // *************** STORE iDDI (Devis Demande ID) (needed for future identification) ***************

            test('Store iDDI', async () => {
                iDDI = (await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_gvDevis_ctl00 tbody tr:nth-child(1) td:nth-child(1)').textContent()).trim(); //first element by default...
                const jsonContent = {
                    iDDI
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
                        console.log(`Enregistrement du iDDI ${iDDI} dans le fichier : gdm_data.json`);
                    });
                });
            })

            // **********************************************************************************
        })
    })

    test('Déconnexion', async () => {
        await page.waitForTimeout(5000)
        await page.locator('#cphDefaut_cphDefaut_btnDeconnexion').click();
        await page.waitForURL("https://grandfraistest.stackr-cloud.com/GDM/GDM_Net/Modules/General/Authentification/Pages/Authentifier.aspx");
    })
})

