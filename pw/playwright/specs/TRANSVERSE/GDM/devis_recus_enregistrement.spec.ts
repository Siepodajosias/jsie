/**
 * @author Mathis NGUYEN
 * @description Bout en bout nominal du curatif P10
 * @since 2024-07-03
 * 
 */
const xRefTest      = "E2E_GDM_NOM";
const xDescription  = "Bout en bout nominal du curatif P10";
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

const sReference = 'NC';
const today = new Date();
const sDateReception = formatDateToJJMMAAAA(today);
const sFournitures = '1';
const sDeplacement = '1';
const sHeureX = '1';
const sTauxHoraire = '1';
const sEtat = 'Reçu'

const sAttachmentPath = 'C:\\pw\\playwright\\specs\\TRANSVERSE\\GDM\\attachments\\HelloWorld.txt'; //PATH TO UPDATE !
const sCommentaire = "Commentaire Pièce Jointe"

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
                    await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_gvDevis_ctl00 tbody tr', { has: page.locator('td', { hasText: iDDI })}).locator('td:nth-child(9) input').click();
                })

                var sNomPopin = 'Modification d\'un devis de la demande d\'intervention ' + iDI;
                test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {
                    test('InputField [REFERENCE]  = "' + sReference + '"', async () => {
                        await page.frameLocator('iframe[name="wndEditerDevis"]').getByLabel('Référence').click();
                        await page.frameLocator('iframe[name="wndEditerDevis"]').getByLabel('Référence').fill(sReference);
                    })

                    test('Date réception - Choose', async () => {
                        await page.frameLocator('iframe[name="wndEditerDevis"]').locator('#cphDefaut_cphDefaut_dpDateReception_dateInput').click();
                        await page.frameLocator('iframe[name="wndEditerDevis"]').locator('#cphDefaut_cphDefaut_dpDateReception_dateInput').fill(sDateReception);
                    });

                    test('InputField [FOURNITURES]  = "' + sFournitures + '"', async () => {
                        await page.frameLocator('iframe[name="wndEditerDevis"]').getByLabel('Fournitures').click();
                        await page.frameLocator('iframe[name="wndEditerDevis"]').getByLabel('Fournitures').fill(sFournitures);
                    })

                    test('InputField [DEPLACEMENT]  = "' + sDeplacement + '"', async () => {
                        await page.frameLocator('iframe[name="wndEditerDevis"]').getByLabel('Déplacement').click();
                        await page.frameLocator('iframe[name="wndEditerDevis"]').getByLabel('Déplacement').fill(sDeplacement);
                    })

                    test('InputField [HEURE X]  = "' + sHeureX + '"', async () => {
                        await page.frameLocator('iframe[name="wndEditerDevis"]').getByLabel('heures X').click();
                        await page.frameLocator('iframe[name="wndEditerDevis"]').getByLabel('heures X').fill(sHeureX);
                    })

                    test('InputField [TAUX HORAIRE]  = "' + sTauxHoraire + '"', async () => {
                        await page.frameLocator('iframe[name="wndEditerDevis"]').getByLabel('taux horaire').click();
                        await page.frameLocator('iframe[name="wndEditerDevis"]').getByLabel('taux horaire').fill(sTauxHoraire);
                    })

                    test('Listbox [ETAT]  = "' + sEtat + '" - Check', async () => {
                        expect(await page.frameLocator('iframe[name="wndEditerDevis"]').locator('#cphDefaut_cphDefaut_cmbEtat_Input').inputValue()).toBe(sEtat);
                    })

                    test ('Button [VALIDER] - Click', async () => {
                        await page.frameLocator('iframe[name="wndEditerDevis"]').getByRole('button', { name: 'Valider' }).click();
                        await page.waitForTimeout(5000)
                    })

                })

                test('Datagrid [VALUES] - Check', async () => {
                    expect (await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_gvDevis_ctl00 tbody tr', { has: page.locator('td', { hasText: iDDI })}).locator('td:nth-child(8)').textContent()).toBe(sEtat);
                })

                test ('Attachment', async () => {
                    await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_gvDevis_ctl00 tbody tr', { has: page.locator('td', { hasText: iDDI })}).click();
                    await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_gvDocuments_ctl00_ctl02_ctl00_btnAjouter').click();
                    await page.frameLocator('iframe[name="wndDocumentAjouter"]').locator('#cphDefaut_cphDefaut_uplFichierfile0').click();
                    await page.frameLocator('iframe[name="wndDocumentAjouter"]').locator('#cphDefaut_cphDefaut_uplFichierfile0').setInputFiles(sAttachmentPath);
                    await page.frameLocator('iframe[name="wndDocumentAjouter"]').getByLabel('Commentaires').fill(sCommentaire);
                    await page.frameLocator('iframe[name="wndDocumentAjouter"]').getByRole('button', { name: 'Annuler' }).click();
                    //await page.frameLocator('iframe[name="wndDocumentAjouter"]').getByRole('button', { name: 'Valider' }).click(); //let "Annuler" for now because app is bugged
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

