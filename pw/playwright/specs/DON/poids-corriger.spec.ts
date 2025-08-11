/**
 * 
 * @author JOSIAS SIE
 * @since 2024-12-23
 *  
 */

const xRefTest      = "DON_REC_CPO";
const xDescription  = "Corriger le poids";
const xIdTest       = 4718;
const xVersion      = '3.3';

var info: CartoucheInfo = {
    desc    : xDescription,
    appli   : 'DONS',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : [],
    params  : ['poids'],
    fileName: __filename
}

//--------------------------------------------------------------------------------------------// 

import { test, type Page }      from '@playwright/test';

import { Help }                 from '@helpers/helpers';
import { TestFunctions }        from '@helpers/functions';
import { Log }                  from '@helpers/log';

import { MenuDon }              from '@pom/DON/menu.page';
import { RecapitulatifsDons }   from '@pom/DON/dons-recapitulatif.page';

import { CartoucheInfo }        from '@commun/types/index';


//---------------------------------------------------------------------------------------------//

let page: Page;
let menu: MenuDon;

let pageDonsRecap: RecapitulatifsDons;

const log      = new Log();
const fonction = new TestFunctions(log);

//---------------------------------------------------------------------------------------------//

var iNouveauPoids   = fonction.getInitParam('poids', '70');

//---------------------------------------------------------------------------------------------//

const sDate         = new Date();
sDate.setMonth(sDate.getMonth() - 5);
const sTargetYear   = sDate.getFullYear();
const sTargetMonth  = sDate.getMonth();
//---------------------------------------------------------------------------------------------//

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuDon(page, fonction);
    pageDonsRecap   = new RecapitulatifsDons(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({ }, testInfo) => {
    await fonction.close(testInfo);
})

//---------------------------------------------------------------------------------------------//

test.describe.serial('[' + xRefTest + '] - ' + xDescription, () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [DONS]', async () => {

        var sNomPage: string = 'dons';

        test ('Page [DONS] - Click', async () => {
            await menu.click(sNomPage, page);
        })

        var sNomOnglet: string = 'RECAPITULATIF';
        test.describe ('Onglet [' + sNomOnglet + ']', async () => {

            test ('Onglet [' + sNomOnglet + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'recapitulatifs', page);
            })

            test ('Button [PERIODE DES DONS] - Click', async () => {
                await fonction.clickElement(pageDonsRecap.buttondatePickerPeriodeDonsRecap);
            });

            test ('LitsBox [ANNEE] = "' + sTargetYear.toString() + '"', async () => {
                await pageDonsRecap.datePickerListBoxAnnee.selectOption({ label: sTargetYear.toString() });
            });

            test ('td [MOIS][' + sTargetMonth + '] - Click', async () => {
                await fonction.clickElement(pageDonsRecap.datePickerMonth.nth(sTargetMonth));
            });

            test ('Link [AUJOURDHUI] - Click', async () => {
                await fonction.clickElement(pageDonsRecap.datePickerButtonAjourdhui);
            });

            test ('Button [ATTESTATION ENVOYEE][OUI] - Click', async () => {
                await fonction.waitForSpinner(menu.iSpinner);
                await fonction.clickElement(pageDonsRecap.buttonAttestEnvoyerOui);
            })

            test ('Button [RECHERCHER LES RECAPITULATIFS] - Click', async () => {
                await fonction.waitForSpinner(menu.iSpinner);
                await fonction.clickElement(pageDonsRecap.buttonRechercherRecapitulatif);
            })

            test ('Header [ATTESTATION ENVOYEE] - Click', async () => {
                await fonction.waitForSpinner(menu.iSpinner);
                await fonction.clickElement(pageDonsRecap.dataGridAttestationEnvoye);
            })

            test ('Header [LIEU DE RAMASSE] - Click', async () => {
                await fonction.waitForSpinner(menu.iSpinner);
                await fonction.clickElement(pageDonsRecap.dataGridlieuDeRamasse);
            })

            test ('CheckBox [LISTE DES RECAPITULATIFS][0] - Click', async () => {
                await fonction.waitForSpinner(menu.iSpinner);
                await fonction.clickElement(pageDonsRecap.checkboxListeRecapitulatif.nth(0));
            })

            test ('Button [CORRIGER POIDS] - Click', async () => {
                await fonction.clickAndWait(pageDonsRecap.buttonCorrigerpoids, page);
            })

            var sNomPopin: string = 'CORRECTION DU POIDS';
            test.describe ('Popin [' + sNomPopin + ']', async () => {

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test ('InputField [NOUVEAU POIDS] = "' + iNouveauPoids + '"', async () => {
                    await pageDonsRecap.pPcpInputNouveauPoids.fill(iNouveauPoids);
                    await fonction.wait(page, 200);
                })

                test ('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pageDonsRecap.pPcpButtonEnregister, page);
                })

                test ('Div [ALERTE] - Check', async () => {
                    var isVisible = await pageDonsRecap.pPrrdAlerteDetail.isVisible();
                    if (isVisible) {
                        var sMessage = await pageDonsRecap.pPrrdAlerteDetail.locator("div.alert-danger").textContent();
                        var sCodeMessage = sMessage.slice(0, 7);
                        if (sCodeMessage.trim() === "[3003]") {
                            await fonction.clickAndWait(pageDonsRecap.pPcpButtonAnnuler, page);
                        }
                    }
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })

            })

        })

    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})