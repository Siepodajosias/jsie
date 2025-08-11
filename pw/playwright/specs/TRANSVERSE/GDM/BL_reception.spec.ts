/**
 * @author Mathis NGUYEN
 * @description Bout en bout nominal du curatif P15
 * @since 2024-07-03
 * 
 */
const xRefTest      = "E2E_GDM_NOM";
const xDescription  = "Bout en bout nominal du curatif P15";
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
const sStadeAvancement = '-Intervention demandée'
const sQualifiees = 'Non'
const sNewStadeAvancement = '-Terminé prestataire'

const today = new Date();
const sDateDebut = formatDateToJJMMAAAA(today)
const sDateFInReelle = formatDateToJJMMAAAA(today)

const expectedColor = 'rgb(51, 51, 255)';


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
                    await page.getByLabel('-Intervention demandée').check();

                    //Ensure the rest are unchecked
                    await page.getByLabel('-Devis demandé').uncheck();
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

            test('Datagrid [VALUES] = "' + iDI + '" - Select', async () => {
                await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucDemandesInterventionList_gvDemandesIntervention_ctl00 tbody tr', { has: page.locator('td', { hasText: iDI })}).locator('td:nth-child(15) input').click();
            })

            test.describe ('Onglet [DETAIL]', async () => {

                test('Button [MODIFIER DETAIL DEMANDE D\'INTERVENTION] - Click', async () => {
                    await page.getByRole('button', { name: 'Modifier' }).click();
                    await page.waitForTimeout(5000)
                })

                test('Listbox [STADE AVANCEMENT]  = "' + sNewStadeAvancement + '"', async () => {
                    await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_cmbStadesAvancement_Arrow').click();
                    await page.getByText(sNewStadeAvancement).click();
                })

                test('Date Début - Choose', async () => {
                    await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_dpDateReelleDebut_dateInput').click();
                    await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_dpDateReelleDebut_dateInput').fill(sDateDebut);
                    await page.getByText('Date debut/fin réelle').click(); //refresh
                    await page.waitForTimeout(5000)
                });

                test('Date Fin Réelle - Choose', async () => {
                    await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_dpDateReelleFin_dateInput').click();
                    await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_dpDateReelleFin_dateInput').fill(sDateFInReelle);
                    await page.getByText('Date debut/fin réelle').click(); //refresh
                    await page.waitForTimeout(5000)
                });

                test('Button [VALIDER] - Click', async () => {
                    await page.getByRole('button', { name: 'Valider' }).click();
                    await page.waitForTimeout(5000)
                })

            })

        })
    })

    test.describe ('Check Validation', async () => {
        test.describe ('Page [ACCUEIL #2]', async () => {

            test('Page [ACCUEIL] - Click & Hover #2', async () => {
                await page.getByRole('link', { name: 'Accès au module maintenance' }).click();
                await page.getByRole('link', { name: 'Curatif', exact: true }).hover();
                await page.getByRole('link', { name: 'Accès à la gestion des Demandes d\'intervention Interventions' }).click();
            })
    
            test.describe ('Onglet [INTERVENTIONS #2]', async () => {
    
                test('InputField [N°] = "' + iDI + '" #2', async () => {
                    await page.locator('#cphDefaut_cphDefaut_cphContenu_ntbID').click();
                    await page.locator('#cphDefaut_cphDefaut_cphContenu_ntbID').fill(iDI.trim());
                })
    
                test.describe ('Filtre A #2', async () => {
                    test('List Box [STADE D\'AVANCEMENT] = "' + sNewStadeAvancement + '" #2', async () => {
                        await page.getByRole('link', { name: 'Filtre A' }).click();
                        await page.locator('#cphDefaut_cphDefaut_cphContenu_cmbStadesAvancement_Arrow').click();

                        //Check this one
                        await page.getByLabel('-Terminé prestataire').check();

                        //Ensure the rest are unchecked
                        await page.getByLabel('-Intervention demandée').uncheck();
                        await page.getByLabel('-Devis demandé').uncheck();
                        await page.getByLabel('-Devis en attente validation').uncheck();
                        await page.getByLabel('-Terminée - attente facture').uncheck();
                        await page.getByLabel('-Terminé - facturée ou sous contrat').uncheck();
                        await page.getByLabel('-Intervention annulée').uncheck();
                        await page.getByLabel('-Terminée facture bloquée').uncheck();
                        await page.getByLabel('- Réintervention').uncheck();
                        await page.getByLabel('Attente validation magasin').uncheck();
                    })
                
                })
    
                test.describe ('Filtre B #2', async () => {
                    test('List Box [QUALIFIEES] = "' + sQualifiees + '" #2', async () => {
                        await page.getByRole('link', { name: 'Filtre B' }).click();
                        await page.locator('#cphDefaut_cphDefaut_cphContenu_cmbQualifiee_Arrow').click();
                        await page.locator('#cphDefaut_cphDefaut_cphContenu_cmbQualifiee_DropDown').getByText(sQualifiees).click();
                    })
                })
    
                test('Datagrid [VALUES] - Check #2', async () => {
                    expect (page.locator('table#cphDefaut_cphDefaut_cphContenu_ucDemandesInterventionList_gvDemandesIntervention_ctl00 tbody tr', { has: page.locator('td', { hasText: iDI })})).toBeVisible();
                    const color = await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucDemandesInterventionList_gvDemandesIntervention_ctl00 tbody tr', { has: page.locator('td', { hasText: iDI })}).locator('td:nth-child(2) div').evaluate(element => getComputedStyle(element).backgroundColor);
                    expect(color).toBe(expectedColor);
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

