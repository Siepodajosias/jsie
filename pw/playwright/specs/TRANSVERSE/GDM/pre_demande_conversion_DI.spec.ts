/**
 * @author Mathis NGUYEN
 * @description Bout en bout nominal du curatif P6
 * @since 2024-07-03
 * 
 */
const xRefTest      = "E2E_GDM_NOM";
const xDescription  = "Bout en bout nominal du curatif P6";
const xIdTest       =  844;
const xVersion      = '3.0';  

//------------------------------------------------------------------------------------
const fs = require('fs');

import { expect, test, type Page}   from '@playwright/test';

//------------------------------------------------------------------------------------

let page                  	: Page;

//------------------------------------------------------------------------------------

const sPriseEnCharge = '-'
const sQuestionReponse = 'Toutes'

const sActivite = 'ELECTRICITE/ ECLAIRAGE';
const sDegreUrgence = 'non urgent (1 Mois)';
const sStadeAvancement = '-Devis demandé';
const sRaison = 'Maintenance curative';
const sEntiteBudgetaire = 'MAINTENANCE'
const sDescription = "Descriptif clair"
const sCommentaire = 'Commentaire'

let iPDI = JSON.parse(fs.readFileSync("specs/TRANSVERSE/GDM/gdm_data.json", 'utf-8')).iPDI;
let sStatus = ''
let iDI = "";

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
                //Refresh Problem
                await page.waitForTimeout(5000);
                await page.reload();
                await page.waitForTimeout(5000);
            })

            test('Button [MODIFIER PRÉ-DEMANDE]  = "' + iPDI + '" - Click', async () => {
                await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucPreDemandesInterventionLister_gvPredemandesInterventions_ctl00 tbody tr', { has: page.locator('td', { hasText: iPDI })}).locator('td:nth-child(14) input').click()
            })

            test('Button [CONVERTIR EN DI] - Click', async () => {
                await page.frameLocator('iframe[name="wndPreDemandeInterventionEditer"]').getByRole('button', { name: 'Convertir en demande d\'' }).click();
            })

            test('ListBox [ACTIVITE] = "' + sActivite + '"', async () => {
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_cmbActivite_Arrow').click();
                await page.getByText(sActivite).click();
            })

            test('ListBox [DEGRE D\'URGENCE] = "' + sDegreUrgence + '"', async () => {
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_cmbDegresUrgence_Arrow').click();
                await page.getByText(sDegreUrgence).click();
            })

            test('ListBox [STADE AVANCEMENT] = "' + sStadeAvancement + '"', async () => {
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_cmbStadesAvancement_Arrow').click();
                await page.getByText(sStadeAvancement).click(); 
            })

            test('ListBox [RAISON] = "' + sRaison + '"', async () => {
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_cmbRaison_Arrow').click();
                await page.getByText(sRaison).click();
            })

            test('ListBox [ENTITE BUDGETAIRE] = "' + sEntiteBudgetaire + '"', async () => {
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_cmbBudgetEntite_Arrow').click();
                await page.getByText(sEntiteBudgetaire, { exact: true }).click();
            })

            test('InputField [DESCRIPTION] = "' + sDescription + '"', async () => {
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_tbDescription').click();
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_tbDescription').fill(sDescription);
            })

            test('InputField [COMMENTAIRE] = "' + sCommentaire + '"', async () => { 
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_tbCommentaire').click();
                await page.locator('#cphDefaut_cphDefaut_cphContenu_ucUserControlCourant_tbCommentaire').fill(sCommentaire);
            })

            test ('Button [VALIDER] - Click', async () => {
                await page.getByRole('button', { name: 'Valider' }).click();
                await page.waitForTimeout(5000)
            })

            test ('Button [FERMER] - Click', async () => {
                await page.getByRole('button', { name: 'Fermer' }).click();
                await page.waitForTimeout(5000)
            })

            test('Datagrid [VALUES] - Check', async () => {
                sStatus = (await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucPreDemandesInterventionLister_gvPredemandesInterventions_ctl00 tbody tr', { has: page.locator('td', { hasText: iPDI })}).locator('td:nth-child(10)').textContent()).trim()
                expect(sStatus).toBe("En cours")
            })

            test('Button [CONVERTIR EN DI] - Check', async () => {
                await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucPreDemandesInterventionLister_gvPredemandesInterventions_ctl00 tbody tr', { has: page.locator('td', { hasText: iPDI })}).locator('td:nth-child(14) input').click()
                await page.waitForTimeout(5000);
                expect(page.frameLocator('iframe[name="wndPreDemandeInterventionEditer"]').getByRole('button', { name: 'Convertir en demande d\'' })).toBeDisabled();
                await page.frameLocator('iframe[name="wndPreDemandeInterventionEditer"]').getByRole('button', { name: 'Fermer' }).click();
            })
        })
    })

    test('Déconnexion', async () => {
        await page.waitForTimeout(5000)
        await page.locator('#cphDefaut_cphDefaut_btnDeconnexion').click();
        await page.waitForURL("https://grandfraistest.stackr-cloud.com/GDM/GDM_Net/Modules/General/Authentification/Pages/Authentifier.aspx");
    })

    // *************** STORE iDI (Demande ID) (needed for future identification) (need to connect to URL Web Magasin) ***************

    test('Ouverture URL Web Magasin', async () => {
        await page.goto('https://grandfraistest.stackr-cloud.com/GDM/GDM_Net_Mobility/Modules/General/Authentification/Pages/Authentifier.aspx?raison=AuthentificationRequise');
    })

    test('Connexion #2', async () => {
      await page.locator('#cphDefaut_ucAuthentifierUtilisateur_tbNomUtilisateur').click();
      await page.locator('#cphDefaut_ucAuthentifierUtilisateur_tbNomUtilisateur').press('PageDown');
      await page.locator('#cphDefaut_ucAuthentifierUtilisateur_tbNomUtilisateur').press('NumLock');
      await page.locator('#cphDefaut_ucAuthentifierUtilisateur_tbNomUtilisateur').fill('320FL');
      await page.locator('#cphDefaut_ucAuthentifierUtilisateur_tbMotDePasse').click();
      await page.locator('#cphDefaut_ucAuthentifierUtilisateur_tbMotDePasse').fill('320FL');
      await page.getByRole('button', { name: 'Connexion' }).click();
      await page.waitForTimeout(5000)
    })

    test.describe ('Page [PRÉ-DEMANDES]', async () => {
        test('Store iDI', async () => {
            iDI = (await page.locator('table#cphDefaut_cphDefaut_cphContenu_gvPreDemandesInterventionFolders_ctl00 tbody tr', { has: page.locator('td', { hasText: iPDI })}).locator('td:nth-child(4)').textContent()).trim(); //get the iDI
            const jsonContent = {
                iDI
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
                    console.log(`Enregistrement du iDI ${iDI} dans le fichier : gdm_data.json`);
                });
            });
        })
    })

    test('Déconnexion #2', async () => {
        await page.getByRole('link', { name: '' }).click();
        await page.waitForURL("https://grandfraistest.stackr-cloud.com/GDM/GDM_Net_Mobility/Modules/General/Authentification/Pages/Authentifier.aspx");
    })

    // **********************************************************************************
})

