/**
 * 
 * @author JC CALVIERA & JOSIAS SIE
 *  Since 2024-04-10
 */

const xRefTest      = "MAG_VTE_JRN";
const xDescription  = "Lister les ventes d'une journée";
const xIdTest       =  100;
const xVersion      = '3.4';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['ville'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect }    from '@playwright/test';

import { TestFunctions }              from "@helpers/functions";
import { Log }                        from "@helpers/log";
import { Help }                       from '@helpers/helpers';

import { MenuMagasin }                from '@pom/MAG/menu.page';
import { VentesJournee }              from '@pom/MAG/ventes-journee.page';

import { CartoucheInfo }              from '@commun/types';

//-------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuMagasin;
let pageVentes      : VentesJournee;

const log           = new Log();
const fonction      = new TestFunctions(log);

//-----------------------------------------------------------------------------------------
const sNomVille     = fonction.getInitParam('ville', 'Albi (G211)');
//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage(); 
    menu        = new MenuMagasin(page, fonction);
    pageVentes  = new VentesJournee(page);
    const helper= new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [ACCUEIL]', async () => {

		test('Link [BROWSER SECURITY WARNING] - Click', async () => {
			await fonction.waitTillHTMLRendered(page);
			var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
			if(isVisible){
				await menu.removeArlerteMessage(page);
			}else{
				log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
				test.skip();
			}
		})

		test('ListBox [LIEU DE VENTE] = "' + sNomVille + '"', async () => {
			await menu.selectVille(sNomVille, page);
		})
	})

    test.describe('Page [VENTES]', async () => {

        var sNomPage = 'ventes';

        test('Page [VENTES] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 
        
        test.describe('Onglet [ANALYSE DES VENTES]', async () => {

            test('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 

            test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
                await fonction.waitTillHTMLRendered(page);
                var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
                if(isVisible){
                    await menu.removeArlerteMessage(page);
                }else{
                    log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                    test.skip();
                }
            })

            test('Button [EXPORTER] - Click', async() => {
                await fonction.clickAndWait(pageVentes.buttonExporter, page);
            })

            //-------------------------------Remontées des ventes pour une une journée------------------------------------------------------

            test('DatePicker [SUR LA PERIODE DU][journée] - Click', async () => {
                await fonction.clickElement(pageVentes.datePickerVentesDu);
            })

            test('Td [SUR LA PERIODE DU][journée] - Click', async () => {
                await fonction.clickElement(pageVentes.tdToDays, page);
            })

            test('DatePicker [SUR LA PERIODE AU][journée] - Click', async () => {
                await fonction.clickElement(pageVentes.datePickerVentesToPicto);
            })

            test('Td [SUR LA PERIODE AU][journée] - Click', async () => {
                await fonction.clickAndWait(pageVentes.tdToDays, page);
            })

            test('Button [RECHERCHER][journée] - Click', async() => {
                await fonction.clickAndWait(pageVentes.buttonRechecher, page);
            })

            test('Label [Montant TTC total des ventes] > 0 €', async() => {

                await pageVentes.labelTotalDesVentes.waitFor({state:'visible'});

                let now = new Date();
                let firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                let iNumOfDay = firstDayPrevMonth.getDay();     // The getDay() method returns the day of the week (from 0 to 6) of a date.

                if (iNumOfDay > 0) {
                    
                    const sTexte = await pageVentes.labelTotalDesVentes.textContent();
                    log.set(fonction.cleanTexte(sTexte));
                    log.set('Depuis le  : ' + firstDayPrevMonth);
                    const aBouts = sTexte.split(' : ');
                    const iMontant = Number(aBouts[1].replace(/[^0-9.-]+/g,""))
                    expect(iMontant).toBeGreaterThan(0);
                    
                } else {
                    log.set('Date choisie tombant un dimanche... Risque d\'absence de valeurs');
                }
            })

            //-------------------------------Remontées des ventes pour une période supérieure à une semaine------------------------------------

            test('DatePicker [SUR LA PERIODE DU][semaine] - Click', async () => {
                await fonction.clickElement(pageVentes.datePickerVentesFromPicto);
            })

            test('Pictogramme [ << ] - Click', async () => {
                await fonction.clickElement(pageVentes.pictoMoisPrecedent);
            })

            test('Td [SUR LA PERIODE DU] - Click', async () => {
                await fonction.clickElement(pageVentes.tdActiveDays.first());
            })

            test('DatePicker [SUR LA PERIODE AU][semaine] - Click', async () => {
                await fonction.clickElement(pageVentes.datePickerVentesToPicto);
            })

            test('Td [SUR LA PERIODE AU][semaine] - Click', async () => {
                await fonction.clickAndWait(pageVentes.tdToDays.last(), page);
            })

            test('Button [RECHERCHER][semaine] - Click', async() => {
                test.setTimeout(60000);
                await fonction.clickAndWait(pageVentes.buttonRechecher, page, 60000);
            })

            test('Div [MESSAGE D\'ERREUR] - Check', async() => {
                var isVisible = await pageVentes.errorMessage.isVisible();
                expect(isVisible).toBe(true);
            })
        })
    })

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})