/**
 *
 * @author JOSIAS SIE
 * @since 2024-04-25
 * 
 */
const xRefTest      = "MAG_PAS_ALT";
const xDescription  = "Notification d'une alerte sanitaire à traiter";
const xIdTest       =  7286;
const xVersion      = '3.1';

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

import { expect, test, type Page }  from '@playwright/test';

import { TestFunctions }            from "@helpers/functions.js";
import { Log }                      from "@helpers/log.js";
import { Help }                     from '@helpers/helpers.js';

import { CartoucheInfo }            from '@commun/types';
import { MenuMagasin }              from '@pom/MAG/menu.page.js';
import { AltertesTraitement }       from '@pom/MAG/alertes-traitement.page.js';

//-------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pageAlertes         : AltertesTraitement;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

const sLieuVente    = fonction.getInitParam('ville', 'Gaillarde (G911)'); 
const sCommentaire  = 'TA_Traitement Alerte Commentaire ' + fonction.getToday('FR') + fonction.getHMS();

//------------------------------------------------------------------------------------ 

test.beforeAll(async ({ browser }, testInfo) => {
	page            = await browser.newPage(); 
	menu            = new MenuMagasin(page, fonction);
	pageAlertes     = new AltertesTraitement(page);
	const helper    = new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

var traitement = async (iNbAlertes:any) => {       

    if (iNbAlertes > 0) {
                
        log.set('Traitement alerte #' + iNbAlertes);            
        await fonction.clickElement(pageAlertes.checkBoxAlertes.nth(iNbAlertes - 1));

        var aElements = page.locator('table tr:nth-child('+iNbAlertes+') td');
		var nbElements = await aElements.count();
		for(let i=0; i<nbElements; i++){
			var sLibelle  = await aElements.nth(i).textContent();
			if (sLibelle != ''){
				log.set('> ' + sLibelle);
			}			
		}

        var isActive  = await pageAlertes.buttonTraiter.isEnabled();
		if(isActive){
			await fonction.clickAndWait(pageAlertes.buttonTraiter, page);
		}

        var isVisible = await pageAlertes.pPtextAreaTraitComm.isVisible();
		if(isVisible){
			await fonction.sendKeys(pageAlertes.pPtextAreaTraitComm, sCommentaire + " #" + iNbAlertes);
		}

        await fonction.noHtmlInNewTab(page, pageAlertes.pPbuttonTraitFinaliser);
		await fonction.wait(page, 1000);
      
        var iNbAlerte = await pageAlertes.checkBoxAlertes.count();
		log.separateur(); 
		if (iNbAlerte > 0) {                       
			log.set('Nombre d\'alertes à traiter : ' + iNbAlerte);    
			await traitement(iNbAlerte);        
		} else {
			log.set('Plus aucune alerte à traiter pour le magasin : ' + sLieuVente);
        }

    } else {
        log.set('Aucune alerte à traiter pour le magasin : ' + sLieuVente);
    }
}

//------------------------------------------------------------------------------------

var oData = {
    iNbPastillesMenu : 0,
    iNbPastillesOnglet : 0
}

/**
 * 
 * @param {interger} iNbPastillesMenu 
 * @description Le nombre de pastille à mémoriser
 */
var setNbPastilles = (iNbPastilles: any, sLocalisation = 'menu') => {
    if (sLocalisation === 'onglet') {
        oData.iNbPastillesOnglet = iNbPastilles;
    } else {
        oData.iNbPastillesMenu = iNbPastilles;
    }
}

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {
  
   test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
	await context.clearCookies();
	await fonction.openUrl(page);
   });

	test ('Connexion', async () => {
		await fonction.connexion(page);
	});

   test.describe('Page [ALERTES]', () => {
       
        //-- Message d'avertissement (Check Browser) spécifique à l'application SIGALE Magasin
        //-- Click sur le lien de confirmation pour faire disparaître le message d'alerte 
        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            var isVisible = await menu.linkBrowserSecurity.isVisible();
            if (isVisible) {
                var isActive = await menu.linkBrowserSecurity.isEnabled();
                if(isActive){
                    await fonction.clickElement(menu.linkBrowserSecurity);
                }
            }
        });

        test ('Popin [ALERTES] - Click', async () => {
            await menu.removeArlerteMessage(page);
        });

       var pageName    = 'alertes';
       var ongletName  = 'traitementMagasin';

       test ('Page [ALERTES] - Click', async () => {
		 await menu.click(pageName, page);                           // On ouvre la page
	   })

       test('ListBox [VILLE] = "' + sLieuVente + '"', async () => {  // On sélectionne le lieu de vent cible
           await menu.selectVille(sLieuVente, page);
           log.set('Lieu de vente : ' + sLieuVente);
           log.separateur();
           var iNbPastilles = await menu.getPastilles(pageName, page);
           setNbPastilles(iNbPastilles);                            // Mémorisation en Local du nb de pastilles dans le menu AVANT traitements
           log.set('Nb Pastilles initialement dans le menu : ' + iNbPastilles);
        })

        test ('Label [ERREUR] - Is Not Visible', async () => {     // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })
         
        test.describe ('Onglet [TRAITEMENT MAGASIN]', () => {        
            test ('Onglet [TRAITEMENT MAGASIN] - Click', async () => {
               await menu.clickOnglet(pageName, ongletName, page);  // On ouvre l'onglet
            })
                     
            test ('Label [ERREUR] - Is Not Visible', async () => {  // Pas d'erreur affichée à priori au chargement de l'onglet
               await fonction.isErrorDisplayed(false, page);
            })

            test ('Toggle [A TRAITER] - Click', async () => {
               await fonction.clickElement(pageAlertes.toggleATraiter);
            })

            test ('Nb Pastille menu [ALERTES & QUALITE] - Check', async () => {
               var iNbPastilles = await menu.getPastilles(pageName, page);
               setNbPastilles(iNbPastilles);
               if (iNbPastilles > 0) {
                    await fonction.wait(page,350);
                    var iNbAlertes = await pageAlertes.checkBoxAlertes.count();
                    expect(iNbAlertes).toEqual(Math.floor(iNbPastilles));
                } else {
                   log.set('Pas d\'alerte Sanitaire à traiter. Pas de pastille.');
                }
            })

            test ('** TRAITEMENT **', async () => {
                await fonction.wait(page, 2500);
                var iNbAlertes = await pageAlertes.checkBoxAlertes.count();
                if (iNbAlertes > 0) {
       
                    log.set('Nombre d\'alertes à traiter : ' + iNbAlertes);
                    await traitement(iNbAlertes);
                    var iNbPastilles = await menu.getPastilles(pageName, page);

                    setNbPastilles(iNbPastilles);                   // Mémorisation en Local du nb de pastilles dans le menu AVANT traitements
                    log.set('Nouveau Nombre de Pastilles affiché : ' + iNbPastilles);
                    expect(iNbPastilles).toEqual(0);

                } else {
                    log.set('Aucune alerte à traiter pour le magasin : ' + sLieuVente);
                }
            })
        })
   }) // End describe Page

   test ('Déconnexion', async () => {
	await fonction.deconnexion(page);
   });

}) // End describe