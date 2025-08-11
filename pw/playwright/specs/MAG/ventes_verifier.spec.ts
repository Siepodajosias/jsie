/**
 * @author Mathis NGUYEN & JOSIAS SIE
 * @description Importation ventes d'une journée (Remontée des ventes)
 * @since 2024-06-24
 * 
 */
const xRefTest      = "MAG_VTE_VER";
const xDescription  = "Flux : Vérifier l'enregistrement des ventes dans Sigale";
const xIdTest       =  9562;
const xVersion      = '3.5';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : ['ville','rayon'],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { expect, test, type Page }    from '@playwright/test';
import { JSDOM }                      from 'jsdom';

import { Help }                       from '@helpers/helpers';
import { TestFunctions }              from '@helpers/functions';
import { Log }                        from '@helpers/log';

import { MenuMagasin }                from '@pom/MAG/menu.page';
import { VentesJournee }              from '@pom/MAG/ventes-journee.page';

import { CartoucheInfo }              from '@commun/types';
import * as fs                        from 'fs';
import * as path                      from 'path';

//------------------------------------------------------------------------------------

let page              : Page;

let menu              : MenuMagasin;
let pageVentes        : VentesJournee;

const log             = new Log();
const fonction        = new TestFunctions(log);

//------------------------------------------------------------------------------------

const sNomVille       = fonction.getInitParam('ville', 'Albi (G211)');// 211 (Albi), 404 (ALES)
const sRayon          = fonction.getInitParam('rayon', 'CR')// CR (Crèmerie), PO (Poissonnerie)
const sDate           = fonction.getInitParam('date', fonction.getToday('US', 0, '-'));

const sDateMin        = sDate + 'T00:00:00';
const sDateMax        = sDate + 'T' + fonction.getHeure() + ':59';

//------------------------------------------------------------------------------------

const conFileName     = fonction.getLocalConfig('conFileName');
const urlStatique     = fonction.getLocalConfig('urlStatique');

const filePathStatique= path.join(conFileName, urlStatique);
const xmlData         = fs.readFileSync(filePathStatique, 'utf-8');

//------------------------------------------------------------------------------------

let iTotalMontantTTC:number= 0;
let iNombreVentes:number   = 0;

let xmlResponse = xmlData;

// *************** PARAMETRES et FONCTIONS POUR LA VERIFICATION DE LA REMONTEE DES VENTES ***************

function getDateCalendar(dateString:string) {
    
    const date = new Date(dateString);
    
    const day  = date.getDate().toString();
    const monthIndex = date.getMonth();
    const year = date.getFullYear().toString();
    
    const months    = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'];
    const month     = months[monthIndex];
    
    return [day, month, year];
}

const aGroupes   = fonction.getLocalConfig('aGroupes');

const aNomGroupes= aGroupes[sRayon];

const [sDayFrom, sMonthFrom, sYearFrom] = getDateCalendar(sDateMin);
const [sDayTo, sMonthTo, sYearTo]       = getDateCalendar(sDateMax);

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuMagasin(page, fonction);
    pageVentes      = new VentesJournee(page);
	const helper    = new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------  

test.describe.serial ('[' + xRefTest + ']', async () => {

    test.describe ('Récupération des ventes', async () => {

        log.set('Date Début : ' + sDateMin);
        log.set('Date Fin : ' + sDateMax);

        test ('Récuperer le XML', async () => {
            expect(xmlResponse).toBeTruthy();

            const dom = new JSDOM(xmlResponse, {
                contentType: "application/xml"
            });
            
            const ventes = dom.window.document.querySelectorAll('vente');
            
            ventes.forEach(vente => {
                const iMontantTTC = parseFloat(vente.querySelector('montant_ttc').textContent);
                iTotalMontantTTC += iMontantTTC;
                const iNombreUnite = parseFloat(vente.querySelector('quantite').textContent);
                iNombreVentes += iNombreUnite;
            });

            iTotalMontantTTC = Number(iTotalMontantTTC.toFixed(2))
            
            log.set('Nombre Ventes : ' + iNombreVentes);
            log.set('Total Montant TTC : ' + iTotalMontantTTC + " €");
        })
    })

    test.describe ('Vérification des ventes', async () => {

        test ('Ouverture URL'+ fonction.getApplicationUrl(), async ({ context }) => {
            await context.clearCookies();
            await fonction.openUrl(page);
        });
    
        test ('Connexion', async () => {
            await fonction.connexion(page);
        });
    
        test.describe ('Page [ACCUEIL]', async () => {
    
            test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
                await fonction.waitTillHTMLRendered(page);
                var isVisible= await menu.pPopinAlerteSanitaire.isVisible();
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

            test ('Page [VENTES] - Click', async () => {
                await menu.click(sNomPage, page);
            })  

            test.describe('Onglet [ANALYSE DES VENTES]', async () => {
       
                test ('Label [ERREUR] - Is Not Visible', async () => {
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

                test ('ListBox  [GROUPE ARTICLE] - Click', async() => {
                    await fonction.clickElement(pageVentes.listBoxGrpArticle); 
                })

                aNomGroupes.forEach((sNomGroupe: any) => {
                    test ('CheckBox [GROUPE ARTICLE] ["' + sNomGroupe + '"] - Click', async() => {                      
                        if (await pageVentes.checkBoxChoix.filter({ hasText: sNomGroupe }).isVisible()) {    
                            await fonction.clickElement(pageVentes.checkBoxChoix.filter({ hasText: sNomGroupe }));
                            log.set('Groupe Article : ' + sNomGroupe + ' Sélectionné');
                            await fonction.addDataSheet('CheckBox', 'Groupe Article', sNomGroupe);
                        } else {
                            log.set('Groupe Article : ' + sNomGroupe + ' Ignoré');
                        }
                    })
                });
    
                test ('ListBox  [GROUPE ARTICLE] - Close', async() => {
                    await fonction.clickElement(pageVentes.pictoCloseSelect);                  
                })
    
                test ('Date Picker [FROM] = "' + sYearFrom + "-" + sMonthFrom + "-" +sDayFrom + '"', async () => {         
                    await fonction.clickElement(pageVentes.datePickerVentesFromPicto);
                    await fonction.selectDateCalendar(page, sYearFrom, sMonthFrom, sDayFrom);
                    await fonction.addDataSheet('InputField', 'Date Début', sYearFrom + "-" + sMonthFrom + "-" +sDayFrom)
                });
    
                test ('Date Picker [TO] = "' + sYearTo + "-" + sMonthTo + "-" +sDayTo + '"', async () => {         
                    await fonction.clickElement(pageVentes.datePickerVentesToPicto);
                    await fonction.selectDateCalendar(page, sYearTo, sMonthTo, sDayTo);
                    await fonction.addDataSheet('InputField', 'Date Fin', sYearTo + "-" + sMonthTo + "-" +sDayTo)
                });
                
                test ('RadioButton [RECHERCHER] - Click', async() => {
                    await fonction.clickAndWait(pageVentes.buttonRechecher, page);
                })
        
                test ('Label [Montant TTC total des ventes] > 0 €', async() => {
        
                    await pageVentes.labelTotalDesVentes.waitFor({state:'visible'});

                    let now = new Date();
                    let firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    let iNumOfDay = firstDayPrevMonth.getDay();     // The getDay() method returns the day of the week (from 0 to 6) of a date.
        
                    if (iNumOfDay > 0) {
                        const sTexte = await pageVentes.labelTotalDesVentes.textContent();
                        const aBouts = sTexte.split(' : ');
                        const iMontant = Number(aBouts[1].replace(/,/g, '.').replace(/[^0-9.-]+/g,""));

                        log.set('Montant affiché : ' + iMontant.toString() + " €");

                        const sQuantites = await pageVentes.labelQuantitesVendues.textContent();
                        const aQuantites = sQuantites.split(' : ');
                        const iQuantite = Number(aQuantites[1].replace(/,/g, '.').replace(/[^0-9.-]+/g,""));

                        log.set('Quantités vendues : ' + iQuantite.toString() + " Unités");
                        expect.soft(iMontant).toEqual(iTotalMontantTTC);
                        //expect.soft(iQuantite).toEqual(iNombreVentes);
        
                    } else {
                        log.set('Date choisie tombant un dimanche... Risque d\'absence de valeurs');
                    }
                })
            }); // end describe
        }); // end describe
    
        test ('Déconnexion', async () => {
            await fonction.deconnexion(page);
        });

    })

})