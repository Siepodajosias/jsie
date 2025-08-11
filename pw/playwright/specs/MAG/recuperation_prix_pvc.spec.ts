/**
 *
 * @author JOSIAS SIE
 * @since 2025-03-07
 * 
 */
const xRefTest      = "MAG_RPM_PVC";
const xDescription  = " Récupération du prix PVC magasin";
const xIdTest       =  9964;
const xVersion      = "3.2";

//------------------------------------------------------------------------------------    
var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'MAGASIN',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['ville','groupeArticle','codeArticle'],
	fileName    : __filename
}
//------------------------------------------------------------------------------------
import { test, type Page }from '@playwright/test';

import { TestFunctions }  from "@helpers/functions";
import { Log }            from "@helpers/log";
import { Help }           from '@helpers/helpers';

import { CartoucheInfo }  from '@commun/types';
import { MenuMagasin }    from '@pom/MAG/menu.page';
import { PrixGestion }    from '@pom/MAG/prix-gestion.page';

import { JddFile }        from '@helpers/file';
//-------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuMagasin;
let pagePrixGestion : PrixGestion;

var jddFile         : JddFile;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------
const sLieuVente    = fonction.getInitParam('ville', 'Agde (F718)'); 
var sGroupeArticle  = fonction.getInitParam('groupeArticle', 'Frais LS'); 
var sCodeArticle    = fonction.getInitParam('codeArticle', 'L17B'); 
//------------------------------------------------------------------------------------   
const sJddFile      = '../../_data/_tmp/MAG/prix_pvc_magasin.json';  

var oData = {
	sPrix   : 0,
	sPrixMoy: 0
}

//------------------------------------------------------------------------------------ 
test.beforeAll(async ({ browser }, testInfo) => {
	page            = await browser.newPage(); 
	menu            = new MenuMagasin(page, fonction);
	pagePrixGestion = new PrixGestion(page);
	jddFile         = new JddFile(testInfo);
	const helper    = new Help(info, testInfo, page);
	await helper.init();
	jddFile.debug(true);	//-- Affichage des données de debuggage
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {
  
	test('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})
	
	test('Connexion', async () => {
		await fonction.connexion(page);
	})

    test.describe ('Page [PRIX]', async () => {
	   
	    test('Link [BROWSER SECURITY WARNING] - Click', async () => {
			var isVisible = await menu.linkBrowserSecurity.isVisible();
			if (isVisible) {
				var isActive = await menu.linkBrowserSecurity.isEnabled();
				if(isActive){
					await fonction.clickElement(menu.linkBrowserSecurity);
				}
			}
		})

		test('Popin [PRIX] - Click', async () => {
			await menu.removeArlerteMessage(page);
		})

		var pageName:string = 'prix';
		test('Page [ALERTES] - Click', async () => {
		   await menu.click(pageName, page);                       
		}) 

		test('ListBox [VILLE] = "' + sLieuVente + '"', async () => {
		   await menu.selectVille(sLieuVente, page);
		})
	  
		test('Label [ERREUR] - Is Not Visible', async () => {         // Pas d'erreur affichée à priori au chargement de la page
		   await fonction.isErrorDisplayed(false, page);
		}) 

		test('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
			await fonction.selectListBoxByLabel(pagePrixGestion.listBoxGrpArticle, sGroupeArticle, page);
		})

		test('ListBox [CODE ARTICLE] = "' + sCodeArticle + '"', async () => {
			await fonction.sendKeys(pagePrixGestion.inputArticle, sCodeArticle, false, 'Code article');
			log.set('Code article : ' + sCodeArticle);
			await fonction.wait(page, 500);
		})

		test('Span [PVC MAGASIN]', async () => {
			var sTextePvc         = await pagePrixGestion.tdPvcMagasin.locator('span').textContent();
			var sTexteDesignation = await pagePrixGestion.tdDésignationMagasin.locator('span').textContent();
			var iNbrAukilo        = Number(sTexteDesignation.match(/\d+/g));
            var iPrix             = parseFloat(sTextePvc.replace(',','.'));
			oData.sPrixMoy        = (iPrix*1000) / iNbrAukilo;
			oData.sPrix           = iPrix;
			log.set('Prix PVC magasin : ' + oData.sPrix);
			log.set('Prix Moyen : ' + oData.sPrixMoy);
		})

    }) // End describe Page

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
		jddFile.writeJson(sJddFile, oData);
	})

}) // End describe