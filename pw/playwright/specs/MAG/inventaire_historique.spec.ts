/**
 * @author JOSIAS SIE
 * @since 2024-04-26
 */

const xRefTest      = "MAG_STK_VHI";
const xDescription  = "Visualiser l'historique d'un inventaire";
const xIdTest       =  314;
const xVersion      = '3.4';

//------------------------------------------------------------------------------------ 
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
//------------------------------------------------------------------------------------
import {test, type Page }          from '@playwright/test';

import { TestFunctions }           from "@helpers/functions";
import { Log }                     from "@helpers/log";
import { Help }                    from '@helpers/helpers';    

import { MenuMagasin }             from '@pom/MAG/menu.page';
import { StockHistorique }         from '@pom/MAG/stock-historique.page';

import { CartoucheInfo }           from '@commun/types';

//-------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pageStockHisto      : StockHistorique;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------
// Exploitation des paramètres passés en argument OU ceux présents dans le fichier de configuration Local
var villeCible              = fonction.getInitParam('ville','Albi');

var ladate                  = new Date()
const dateInventaireDuJour  = fonction.addZero(ladate.getDate()) + ' / ' + fonction.addZero(ladate.getMonth() + 1);

const sFileJdd              = fonction.getLocalConfig('jddLieuxVente');
const varianteLieuVente     = fonction.readFile(sFileJdd);
//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	page            = await browser.newPage(); 
	menu            = new MenuMagasin(page, fonction);
	pageStockHisto  = new StockHistorique(page);
	const helper    = new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [ACCUEIL]', async () => {

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
    })

    test.describe ('Page [STOCK]', () => {

        var pageName = 'stock';

		test ('Page [STOCK]- Click', async () => {
			await menu.click(pageName, page);                            // On ouvre la page
		})

		test ('Label [ERREUR] - Is Not Visible', async () => { // Pas d'erreur affichée à priori au chargement de la page
			await fonction.isErrorDisplayed(false, page);
		})

        villeCible = villeCible.replace(' (Fresh)', '');
        villeCible = varianteLieuVente[villeCible];
		test ('ListBox [VILLE] = "' + villeCible + '"', async () => {
			await menu.selectVille(villeCible, page);
		})   
		
		test.describe ('Onglet [HISTORIQUE DES INVENTAIRE]', () => {        

            let iNbInventaireSelectionne:number = 0;

			test ('Onglet [HISTORIQUE DES INVENTAIRE] - Click', async () => {
				await menu.clickOnglet(pageName, 'histoInventaire', page);
			})  
								  
			test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de l'onglet
				await fonction.isErrorDisplayed(false, page);
			})

            test ('Header [DATE INVENTAIRE] - Click x 2', async () =>  {
                await fonction.clickElement(pageStockHisto.thHeaderDatesInventaires);
                await fonction.clickElement(pageStockHisto.thHeaderDatesInventaires);
            })
        
            test ('Check [DATE VALIDATION INVENTAIRE][0] = "'+ dateInventaireDuJour +'"', async () =>  {
                var iNbDateInventaire   = await pageStockHisto.tdListeDatesValidInventaire.count();
                var aTextDateInventaire = await pageStockHisto.tdListeDatesValidInventaire.allTextContents();

                for(let i=0; i < iNbDateInventaire; i++){
                    var sTextDateInventaire = aTextDateInventaire[i].slice(0, 7);
                    if(sTextDateInventaire === dateInventaireDuJour){
                        await fonction.clickAndWait(pageStockHisto.tdListeDatesValidInventaire.nth(i), page);
                        iNbInventaireSelectionne++;
                    }
                }
            })

            test ('InputField [FILTRE ARTICLE] - Is Visible', async () => {
                if (iNbInventaireSelectionne > 0){
                    await fonction.isDisplayed(pageStockHisto.inputFiltreArticle);   
                } else {
                    log.set('Aucun inventaire trouvé pour la date du jour');
                    test.skip();
                }
            })

        })

    })

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})