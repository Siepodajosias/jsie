/**
 * @author Mathis NGUYEN
 * @description Bout en bout nominal du curatif P19
 * @since 2024-07-03
 * 
 */
const xRefTest      = "E2E_GDM_NOM";
const xDescription  = "Bout en bout nominal du curatif P19";
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

const today = new Date();

const sStadeAvancement = '-Terminé prestataire'
const sQualifiees = 'Oui'

const sNumeroFacture = '1234'
const sDateFacture = formatDateToJJMMAAAA(today)
const sNewStadeAvancement = '-Terminé - facturée ou sous contrat'

const expectedColor = 'rgb(255, 255, 255)'

let iDI = JSON.parse(fs.readFileSync("specs/TRANSVERSE/GDM/gdm_data.json", 'utf-8')).iDI;
let montantHT = '';

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

            test('Button [MODIFIER DEMANDE D\'INTERVENTION]  = "' + iDI + '" - Select', async () => {
                await page.getByRole('button', { name: 'Editer' }).click();
            })

            test('Button [FACTURES] - Click', async () => {
                await page.getByRole('link', { name: 'Factures' }).click();
                await page.waitForTimeout
            })

            test.describe ('Onglet [QUALIFICATIONS]', async () => {
              test('Button [AJOUTER FACTURE] - Click', async () => {
                await page.getByRole('button', { name: 'Ajouter' }).click();
              })

              const sNomPopin = "Ajout d'une facture";
                
              test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {
                test('InputField [MONTANT HT] - Check', async () => {
                  expect(await page.frameLocator('iframe[name="wndFactureEditer"]').getByLabel('Montant HT').inputValue()).toBeTruthy();
                  montantHT = (await page.frameLocator('iframe[name="wndFactureEditer"]').getByLabel('Montant HT').inputValue()).replace('€', '').trim();
                })
      
                test('Date Début Reelle - Check', async () => {
                  expect(await page.frameLocator('iframe[name="wndFactureEditer"]').locator('#cphDefaut_cphDefaut_ucFacture_ucFactureDemandeIntervention_dpDateDebutReelle_dateInput').inputValue()).toBeTruthy();
                });

                test('Date Fin Reelle - Check', async () => {
                  expect(await page.frameLocator('iframe[name="wndFactureEditer"]').locator('#cphDefaut_cphDefaut_ucFacture_ucFactureDemandeIntervention_dpDateFinReelle_dateInput').inputValue()).toBeTruthy();
                });

                test('ListBox [STADE AVANCEMENT] - Check' , async () => { 
                  expect(await page.frameLocator('iframe[name="wndFactureEditer"]').locator('#cphDefaut_cphDefaut_ucFacture_ucFactureDemandeIntervention_cmbStadesAvancement_Input').inputValue()).toBe('3-Terminé prestataire');
                })

                test('InputField [N° Facture] = "' + sNumeroFacture + '"', async () => {
                  await page.frameLocator('iframe[name="wndFactureEditer"]').getByLabel('Numéro').fill(sNumeroFacture);
                })

                test('Date Facture - Choose', async () => {
                  await page.frameLocator('iframe[name="wndFactureEditer"]').locator('#cphDefaut_cphDefaut_ucFacture_dpDateFacture_dateInput').click();
                  await page.frameLocator('iframe[name="wndFactureEditer"]').locator('#cphDefaut_cphDefaut_ucFacture_dpDateFacture_dateInput').fill(sDateFacture);
                });

                test('ListBox [STADE AVANCEMENT] = "' + sNewStadeAvancement + '" - Select' , async () => { 
                  await page.frameLocator('iframe[name="wndFactureEditer"]').locator('#cphDefaut_cphDefaut_ucFacture_ucFactureDemandeIntervention_cmbStadesAvancement_Arrow').click();
                  await page.frameLocator('iframe[name="wndFactureEditer"]').getByText(sNewStadeAvancement).click();
                })

                test ('Button [VALIDER] - Click', async () => {
                  await page.frameLocator('iframe[name="wndFactureEditer"]').getByRole('button', { name: 'Valider' }).click();
                  await page.waitForTimeout(5000)
                })

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
                test('List Box [STADE D\'AVANCEMENT] = "' + sNewStadeAvancement + '"', async () => {
                    await page.getByRole('link', { name: 'Filtre A' }).click();
                    await page.locator('#cphDefaut_cphDefaut_cphContenu_cmbStadesAvancement_Arrow').click();

                    //Check this one
                    await page.getByLabel('-Terminé - facturée ou sous contrat').check();

                    //Ensure the rest are unchecked
                    await page.getByLabel('-Terminé prestataire').uncheck();
                    await page.getByLabel('-Devis demandé').uncheck();
                    await page.getByLabel('-Intervention demandée').uncheck();
                    await page.getByLabel('-Devis en attente validation').uncheck();
                    await page.getByLabel('-Terminée - attente facture').uncheck();
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

            test('Datagrid [Values] - Check', async () => {
              expect (page.locator('table#cphDefaut_cphDefaut_cphContenu_ucDemandesInterventionList_gvDemandesIntervention_ctl00 tbody tr', { has: page.locator('td', { hasText: iDI })})).toBeVisible();
              const color = await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucDemandesInterventionList_gvDemandesIntervention_ctl00 tbody tr', { has: page.locator('td', { hasText: iDI })}).locator('td:nth-child(2) div').evaluate(element => getComputedStyle(element).backgroundColor);
              expect(color).toBe(expectedColor);
              expect((await page.locator('table#cphDefaut_cphDefaut_cphContenu_ucDemandesInterventionList_gvDemandesIntervention_ctl00 tbody tr', { has: page.locator('td', { hasText: iDI })}).locator('td:nth-child(12)').textContent()).trim()).toBe(montantHT);
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

