/**
 * 
 * @author SIAKA KONE
 *  Since 2024-05-16
 */

const xRefTest      = "MAG_ROL_CHK";
const xDescription  = "Examen des Rôles - MAGASIN";
const xIdTest       =  1121;
const xVersion      = '3.2';

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

import { expect, test, type Page}   from '@playwright/test';

import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';
import { Help }                     from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }              from '@pom/MAG/menu.page';
import { StockDons }                from '@pom/MAG/stock-dons.page';
import { CartoucheInfo }            from '@commun/types';

//-------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuMagasin;
let pageStockDons   : StockDons;

const log           = new Log();
const fonction      = new TestFunctions(log);

//----------------------------------------------------------------------------------------
// Exploitation des paramètres passés en argument OU ceux présents dans le fichier de configuration Local
var villeCible      = fonction.getInitParam('ville');
    
test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageStockDons   = new StockDons(page);
    const helper = new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    const pageName:string    = 'stock';

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
		await fonction.connexion(page);
	});

    test.describe ('Règle Métier : MAG-LCA-002', async () => {

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

        test ('Page [STOCK] - Click', async () => {
            await menu.click(pageName, page);
        })

        test ('ListBox [VILLE] = "' + villeCible + '"', async () => {
            await menu.selectVille(villeCible, page);
        })  
        
        test ('Onglet [DONS] - Click', async () => {
            await menu.clickOnglet(pageName, 'dons', page);
        })

        test ('[AC1] - Print Is NOT Available', async () => {
            const sNumBon:string = await pageStockDons.tdNumeroBon.first().textContent();
            await fonction.clickElement(pageStockDons.checkBoxListeDons.nth(1));
            expect(await pageStockDons.buttonImprimRecap.isEnabled()).toBe(true);
            log.set('Numero de bon : ' + sNumBon);
        })

    })

    test.describe ('ROLE = "PILOTE ALERTE"' , async () =>{

        const sPageName:string = 'alertes';

        test ('Changer profil', async ()=>{
            await fonction.changeProfilByRole(info.appli, 'PILOTE ALERTE', page); 
        })

        test ('Page [ALERTE ET QUALITE] - Click', async () => {
            await fonction.wait(page, 10000);
            await menu.click(sPageName, page);
        })

        test.describe ('Règle Métier : MAG-LCA-001', async () => {

            test ('Onglet [SUIVI CENTRALE]', async () => {
                await menu.isOngletPresent('Suivi général ');
            })

            test ('Onglet [HISTORIQUE CENTRALE]', async () => {
                await menu.isOngletPresent('Historique général ');
            })

            test ('Onglet [TRAITEMENT MAGASIN]', async () => {
                await menu.isOngletPresent('Traitement magasin ', false);
            })

            test ('Onglet [HISTORIQUE MAGASIN]', async () => {
                await menu.isOngletPresent('Historique magasin ');
            })

        })

    })

    test.describe('ROLE = "COMPTABILITE FISCALE"' , async () =>{
        
        const sRole:string = 'COMPTABILITE FISCALE';
        const sPageName:string = 'stock';

        test ('Changer profil', async ()=>{
            await fonction.changeProfilByRole(info.appli, sRole, page); 
            await fonction.waitTillHTMLRendered(page);            
        })

        test ('Onglet [SUIVI CENTRALE]', async () => {
            await menu.isOngletPresent('alertes ', false);
        })

        test ('Page [ALERTE ET QUALITE] - Click', async () => {
            await menu.click(sPageName, page);
        })

        test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })

        test.describe ('Règle Métier : MAG-LCA-002', async () => {

            test ('[AC2] - Error message [9006] Is Hidden', async () => { // Pas d'erreur affichée à priori au chargement de la page
                await fonction.isErrorDisplayed(false, page);
            })

            test ('[AC1] - Print Is Available', async () => {
                const sNumeroBon:string = await pageStockDons.tdNumeroBon.nth(0).textContent();
                if (sNumeroBon != '') {
                    await fonction.clickElement(pageStockDons.checkBoxListeDons.first());
                    expect(await pageStockDons.buttonImprimerBonRemise.isEnabled()).toBe(true);   // Bouton Imprimer Recu Actif
                    expect(await pageStockDons.buttonImprimRecap.isEnabled()).toBe(true);  // Bouton Imprimer Recapitulatif Actif  
                } else {
                    log.set('[INFO] : Pas de données disponibles pour exécuter le cas AC1 - ' + sRole);
                } 
            }) 

        })

    })

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})

