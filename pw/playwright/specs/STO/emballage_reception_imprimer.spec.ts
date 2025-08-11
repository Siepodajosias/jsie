/**
 * @author  Josias SIE
 * @since   15-07-2024
 * 
 */
const xRefTest      = "STO_PAR_IMP";  
const xDescription  = "Visualisation et Sélection des imprimantes pour les feuilles et les étiquettes (grandes et petites)";
const xIdTest       =  2067;
const xVersion      = '3.2'; 
  
var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'STOCK',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,  
	help        : [],        
	params      : ['plateForme','impressionFeuille','impressionEtiquette','impressionEtiquetteReduite'],
	fileName    : __filename
}
   
//------------------------------------------------------------------------------------

import { expect, test, type Page} from '@playwright/test';
import { Help }                   from '@helpers/helpers';
import { TestFunctions }          from '@helpers/functions';
import { Log }                    from '@helpers/log';
import { CartoucheInfo }          from '@commun/types';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }              from '@pom/STO/menu.page'; 
import { ReferentielParametres }  from '@pom/STO/referentiel-parametres.page';

//------------------------------------------------------------------------------------

let page                  : Page;
let menu                  : MenuStock;
let pageRefParamImp       : ReferentielParametres;
const log                 = new Log();
const fonction            = new TestFunctions(log);

//------------------------------------------------------------------------------------
const sPlateforme           = fonction.getInitParam('plateForme', 'Chaponnay');
const sImpFeuilles          = fonction.getInitParam('impressionFeuille', 'CHA_FE_FICTIVE');
const sImpEtiquettes        = fonction.getInitParam('impressionEtiquette', 'CHA_ET_FICTIVE');
const sImpEtiquettesReduites= fonction.getInitParam('impressionEtiquetteReduite', '');
//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
	 page                 = await browser.newPage();
	 menu                 = new MenuStock(page, fonction);
	 pageRefParamImp      = new ReferentielParametres(page);
	 const helper         = new Help(info, testInfo, page);
	 await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})
  
//------------------------------------------------------------------------------------
test.describe.serial('[' + xRefTest + ']', async () => {  
	
	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();		
		await fonction.openUrl(page);
	})

	test('Connexion', async () => {
        await fonction.connexion(page);
    })

	test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {                    
		await menu.selectPlateforrme(page, sPlateforme);
	})

	test.describe ('Page [REFERENTIEL]', async () => {    

		var sNomPage = 'referentiel';

		test ('Page [REFERENTIEL] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		test.describe ('Onglet [PARAMETRES D\'IMPRESSION]', async () => {        
			
			test ('Onglet [PARAMETRES D\'IMPRESSION] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'parametres', page);
			})   

			test('Select [IMPRIMANTE D\'IMPRESSION DE FEUILLES]['+sImpFeuilles+'] - Select', async () => {
				if(sImpFeuilles !=''){
					await pageRefParamImp.listBoxImprimFeuilles.selectOption({label: sImpFeuilles});
					log.set(`Imprimante sélectionnée : ${sImpFeuilles}`);
					fonction.addDataSheet('ListBox', 'impression Feuilles', sImpFeuilles.trim());
				} else {
					await pageRefParamImp.listBoxImprimFeuilles.selectOption({index: 0});
					log.set('Aucune imprimante pour les feuilles n\'a été parametré.');
				}
			})

			test('Select [IMPRIMANTE D\'IMPRESSION D\'ETIQUETTES]['+sImpEtiquettes+'] - Select', async () => {
				if(sImpEtiquettes !=''){
					await pageRefParamImp.listBoxImprimEtiquettes.selectOption({label: sImpEtiquettes});
					log.set(`Imprimante sélectionnée : ${sImpEtiquettes}`);
					fonction.addDataSheet('ListBox', 'Impression Etiquettes', sImpEtiquettes.trim());
				} else {
					await pageRefParamImp.listBoxImprimEtiquettes.selectOption({index: 0});
					log.set('Aucune imprimante pour les etiquettes n\'a été parametré.');
				}
			}) 

			test('Select [IMPRIMANTE D\'IMPRESSION D\'ETIQUETTES REDUITES]['+sImpEtiquettesReduites+'] - Select', async () => {
				const selectBox      = pageRefParamImp.listBoxImprimEtiquettesReduit;
				const nbOption       = await pageRefParamImp.listBoxImprimEtiquettesReduit.locator('option').count();
				const selectedOption = selectBox.locator('option:checked');
				const text           = await selectedOption.textContent();

				if(sImpEtiquettesReduites !=''){
					await pageRefParamImp.listBoxImprimEtiquettesReduit.selectOption({label: sImpEtiquettesReduites});
					log.set(`Imprimante sélectionnée : ${sImpEtiquettesReduites}`);
					fonction.addDataSheet('ListBox', 'Impression Etiquettes Réduites', sImpEtiquettesReduites.trim());
				} else {
					if (text == '' && nbOption > 1 ) {					
						await pageRefParamImp.listBoxImprimEtiquettesReduit.selectOption({index: 0});
						log.set('Aucune imprimante pour les etiquettes réduites n\'a été parametré.');
					}
				}
			}) 
		})	// End ONGLET 
		
		test('Button [ENREGISTRER] - Click', async () => {
			var isActive = await pageRefParamImp.buttonEnregistrer.isEnabled();
			if(isActive){
				await fonction.clickAndWait(pageRefParamImp.buttonEnregistrer, page);
				var isNotActive = await pageRefParamImp.buttonEnregistrer.isDisabled();
				expect(isNotActive).toBe(true);
			}
		})
	})  //-- End Page

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})// end describe

}) 