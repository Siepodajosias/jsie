/**
 * @author  SIAKA KONE
 * @since   2024-10-18
 * 
 */
const xRefTest      = "STO_PAR_REF";  
const xDescription  = "Paramétrer les imprimantes de refus d'agréage";
const xIdTest       =  6344;
const xVersion      = '3.1'; 
  
var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'STOCK',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,  
	help        : [],        
	params      : ['plateForme','impressionFeuille','impressionEtiquette'],
	fileName    : __filename
}
   
//------------------------------------------------------------------------------------

import { test, type Page} 		  from '@playwright/test';
import { Help }                   from '@helpers/helpers';
import { TestFunctions }          from '@helpers/functions';
import { Log }                    from '@helpers/log';
import { CartoucheInfo }          from '@commun/types';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }              				from '@pom/STO/menu.page'; 
import { ReferentielParametrageRefusAgreage } 	from '@pom/STO/referentiel-parametrage_refus_agreage.page';

//------------------------------------------------------------------------------------

let page                  : Page;
let menu                  : MenuStock;
let pageRefRefus          : ReferentielParametrageRefusAgreage;
const log                 = new Log();
const fonction            = new TestFunctions(log);

//------------------------------------------------------------------------------------
const sPlateforme         = fonction.getInitParam('plateforme', 'Chaponnay');
const sImpFeuilles        = fonction.getInitParam('impressionFeuille', 'CHA_FE_FICTIVE');
const sImpEtiquettes      = fonction.getInitParam('impressionEtiquette', 'CHA_ET_FICTIVE');

//------------------------------------------------------------------------------------

const sImprimanteFeuille:string 		= 'Imprimante feuille pour les ordres de déplacement';
const sImprimantePaletteRefus:string 	= 'Imprimante étiquette pour les palettes refusées';
const sImprimanteReliquatRefus:string 	= 'Imprimante étiquette pour le reliquat des palettes refusées';
const sEmplacementDepose:string 		= 'Emplacement de dépose des palettes refusées';
const sNombreEtiquette:string 			= 'Nombre d\'impression étiquettes palette';

const sEmplacement:string = '969';
const iNbreImprimante:number = 1;

test.beforeAll(async ({ browser }, testInfo) => {
	page                 = await browser.newPage();
	menu                 = new MenuStock(page, fonction);
	pageRefRefus      	 = new ReferentielParametrageRefusAgreage(page); 
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

		var sNomPage:string = 'referentiel';

		test ('Page [REFERENTIEL] - Click', async () => {
			await menu.click(sNomPage, page);
		})

		test.describe ('Onglet [PARAMETRES DES REFUS D\'AGREAGE]', async () => {        
			
			test ('Onglet [PARAMETRES DES REFUS D\'AGREAGE] - Click', async () => {
				await menu.clickOnglet(sNomPage, 'paramRefusAgreage', page);
			})   

			test('ListBox [' + sImprimanteFeuille.toUpperCase() + '] = "' + sImpFeuilles + '"', async () => {
				const sListBoxvalue=await  pageRefRefus.listBoxImprimOrdreDepl.innerText();
				if(sListBoxvalue !== ""){
					await fonction.clickElement(pageRefRefus.buttonClearInput.first())
					await fonction.ngClickListBox(pageRefRefus.listBoxImprimOrdreDepl, sImpFeuilles);
				}else {
					await fonction.ngClickListBox(pageRefRefus.listBoxImprimOrdreDepl, sImpFeuilles);
				}
				
			})

			test('InputField [' + sEmplacementDepose.toUpperCase() + '] = "' + sEmplacement + '"', async () => {
				if (await pageRefRefus.inputEmplDeposePaletteRefus.inputValue() == null) {
					await fonction.sendKeys(pageRefRefus.inputEmplDeposePaletteRefus, sEmplacement, false, 'Emplacement depose'); 
				} else {
					log.set('Valeur déjà renseignée pour ' + sEmplacementDepose.toUpperCase() + '.');
				}
			})

			test('ListBox [' + sImprimantePaletteRefus.toUpperCase() + '] = "' + sImpEtiquettes + '"', async () => {
				const sListBoxvalue=await  pageRefRefus.listBoxImprimPaletteRefus.innerText();
				if(sListBoxvalue!== ""){
					await fonction.clickElement(pageRefRefus.buttonClearInput.nth(1))
					await fonction.ngClickListBox(pageRefRefus.listBoxImprimPaletteRefus, sImpEtiquettes);
				}else {
					await fonction.ngClickListBox(pageRefRefus.listBoxImprimPaletteRefus, sImpFeuilles);
				}
			})

			test('ListBox [' + sImprimanteReliquatRefus.toUpperCase() + '] = "' + sImpEtiquettes + '"', async () => {
				const sListBoxvalue=await  pageRefRefus.listBoxImprimReliquatRefus.innerText()
				if(sListBoxvalue!== ""){
					await fonction.clickElement(pageRefRefus.buttonClearInput.nth(2))
					await fonction.ngClickListBox(pageRefRefus.listBoxImprimReliquatRefus, sImpEtiquettes);
				}else {
					await fonction.ngClickListBox(pageRefRefus.listBoxImprimReliquatRefus, sImpFeuilles);
				}
			})

			test('InputField [' + sNombreEtiquette.toUpperCase() + '] = "' + iNbreImprimante + '"', async () => {
				if (await pageRefRefus.inputImpressionEtiqPalette.inputValue() == null) {
					await fonction.sendKeys(pageRefRefus.inputImpressionEtiqPalette, iNbreImprimante, false, 'Emplacement depose'); 
				} else {
					log.set('Valeur déjà renseignée pour ' + sNombreEtiquette.toUpperCase() + '.');
				}
			})

			test ('Button [ENREGISTRER] - Click', async () => {
				await fonction.clickAndWait(pageRefRefus.buttonEnregistrer, page); 
			})       
		})	
	})  

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

}) 