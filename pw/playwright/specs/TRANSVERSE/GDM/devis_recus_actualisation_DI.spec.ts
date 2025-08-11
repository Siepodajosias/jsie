/**
 * @author Mathis NGUYEN
 * @description Bout en bout nominal du curatif P12
 * @since 2024-07-03
 * 
 */
const xRefTest      = "E2E_GDM_NOM";
const xDescription  = "Bout en bout nominal du curatif P12";
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

const sNewStadeAvancement = '1-Intervention demandée'

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

const sDateConfirmee = formatDateToJJMMAAAA(yesterday)
const sConfirmationEmail = 'Oui'
const sDescription = 'Descriptif clair\nDemande d\'intervention'

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

            test.describe ('Onglet [DETAIL]', async () => {

                test('Button [MODIFIER DETAIL DEMANDE D\'INTERVENTION] - Click', async () => {
                    await page.getByRole('button', { name: 'Modifier' }).click();
                    await page.waitForTimeout(5000)
                })

                test('Listbox [STADE AVANCEMENT]  = "' + sNewStadeAvancement + '"', async () => {
                    await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_cmbStadesAvancement_Arrow').click();
                    await page.getByText(sNewStadeAvancement).click();
                })

                test('Date Confirmée - Choose', async () => {
                    await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_dpDateConfirmation_dateInput').click();
                    await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_dpDateConfirmation_dateInput').fill(sDateConfirmee);
                    await page.getByText('Début / Fin / Confirmée').click(); //refresh
                    await page.waitForTimeout(5000)
                });

                test.describe ('Email au site', async () => {

                    test('Radio Box [ENVOYER EMAIL SITE DEMANDE] = "' + sConfirmationEmail + '" - Select', async () => {
                        await page.frameLocator('iframe[name="wndEnvoyerEmailSiteConfirmer"]').getByRole('button', { name: sConfirmationEmail }).click();
                    })

                    test ('CheckBox [ENVOYER MAIL SITE] - Select', async () => {
                        expect(page.frameLocator('iframe[name="wndDemandeInterventionEmailPriseEnChargeEnvoyer"]').getByLabel('Envoyer un e-mail au Site ?')).toBeChecked();
                        await page.frameLocator('iframe[name="wndDemandeInterventionEmailPriseEnChargeEnvoyer"]').getByLabel('Envoyer un e-mail au Site ?').check();
                    })

                    test ('Button [VALIDER EMAIL SITE] - Click', async () => {
                        await page.frameLocator('iframe[name="wndDemandeInterventionEmailPriseEnChargeEnvoyer"]').getByRole('button', { name: 'Valider' }).click();
                        await page.waitForTimeout(5000)
                    })

                    test ('Button [FERMER EMAIL SITE] - Click', async () => {
                        await page.frameLocator('iframe[name="wndEnvoiDemandePatienter"]').getByRole('button', { name: 'Fermer' }).click();
                    })
                })

                test('InputField [Description]  = "' + sDescription + '"', async () => {
                    await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_tbDescription').click();
                    await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_tbDescription').fill(sDescription);
                })

                test('Button [VALIDER] - Click', async () => {
                    await page.getByRole('button', { name: 'Valider' }).click();
                })

                test.describe ('Email au fournisseur', async () => {
                    test ('CheckBox [ENVOYER MAIL FOURNISSEUR] = "' + sMail + '" - Select', async () => {
                        await page.getByRole('group', { name: 'Envoi' }).getByLabel(sMail).check();
                    })
                    
                    test ('Button [ENVOYER EMAIL FOURNISSEUR] - Click', async () => {
                        await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_btnRelancerDemandeIntervention').click();
                    })

                    test ('Button [VALIDER EMAIL FOURNISSEUR] - Click', async () => {
                        await page.frameLocator('iframe[name="wndParametresRapportDefinir"]').getByRole('button', { name: 'Valider' }).click();
                        await page.waitForTimeout(5000)
                    })

                    test ('Button [FERMER EMAIL FOURNISSEUR] - Click', async () => {
                        await page.frameLocator('iframe[name="wndEnvoiDemandeResultat"]').getByRole('button', { name: 'Fermer' }).click();
                    })
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

