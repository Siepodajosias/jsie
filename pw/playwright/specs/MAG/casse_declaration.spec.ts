/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 28 - 11 - 2023
 * 
 */

const xRefTest      = "MAG_CAS_REC";
const xDescription  = "Déclarer la casse";
const xIdTest       =  69;
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

import { test, type Page, expect}       from '@playwright/test';

import { TestFunctions }                from "@helpers/functions";
import { Log }                          from "@helpers/log";
import { Help }                         from '@helpers/helpers';

import { MenuMagasin }                  from '@pom/MAG/menu.page';
import { StockCasse }                   from '@pom/MAG/stock-casse.page';

import { CartoucheInfo }                from '@commun/types';

//-------------------------------------------------------------------------------------

let page           : Page;

let menu           : MenuMagasin;
let pageStockCasse : StockCasse;

const log          = new Log();
const fonction     = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const aData             = [
    ['Marée',           '2869913027683'],
    ['Marée',           '8710319520756'],
    ['Marée',           '2900246000001'],
    ['Coupe / Corner',  '3332621081036'],
    ['Coupe / Corner',  '2481513130015'],
    ['Frais LS',        '5694230575022'],
    ['Frais LS',        '3701002401631'],
    ['Elaborés',        '3456700231171'],
    ['Elaborés',        '3760088805016'],
]

const iQuantiteCasse    = 8;

const sNomVille         = fonction.getInitParam('ville', 'Istres (F715)');

//-----------------------------------------------------------------------------------------

var traitement = async (aData:any, index:number) => {

    var sGroupeArticle  = aData[0];
    var iCodeBarre      = aData[1];

    test ('ListBox [GROUPE ARTICLE][' + index + '] = "'+ sGroupeArticle + '"', async () => {
        await fonction.listBoxByLabel(pageStockCasse.listBoxGrpArticle, sGroupeArticle, page);
    })
  
    test ('SelectBox [NATURE][rnd][' + index +'] - Select', async () => {
        await fonction.clickElement(pageStockCasse.listBoxNature);
        var iNbChoix = await pageStockCasse.listBoxNatureOpt.count();
        var iCible   = Math.floor(fonction.random() * (iNbChoix - 1)) + 1;
        var sChoix   = await pageStockCasse.listBoxNatureOpt.nth(iCible).textContent();
        if(sChoix){

            await pageStockCasse.listBoxNature.selectOption({label:sChoix});
            log.set('Groupe Article : ' + sGroupeArticle);
            log.set('Nature : ' + sChoix);
            log.set('Gencod : ' + iCodeBarre);
        }else{

            log.set('SelectBox [NATURE][rnd][' + index +'] - Select : NON EFFECTUE')
        }
    })

    test ('InputField [CODE BARRES][' + index + '] = "' + iCodeBarre + '"', async () => {
        var isEditable = await pageStockCasse.inputGencod.isEditable();
        if(isEditable){
            
            await fonction.sendKeys(pageStockCasse.inputGencod,   iCodeBarre);
        }
    })

    test ('InputField [QUANTITE][' + index + '] = "'+iQuantiteCasse+'"', async () => {
        await fonction.clickAndWait(pageStockCasse.inputQuantite, page);
        var isEditable = await pageStockCasse.inputQuantite.isEditable();
        if(isEditable){

            await fonction.sendKeys(pageStockCasse.inputQuantite,'8');
        }
    })

    test ('Button [AJOUTER][' + index + '] - Click', async() => {

        var sMontantI = await pageStockCasse.labelMontantTotalCasse.textContent();
        if(sMontantI){

            log.set('Montant avant traitement : ' + sMontantI);
            sMontantI = sMontantI.replace('€', '');
            sMontantI = sMontantI.replace(/\s/g, '');
            sMontantI = sMontantI.replace(',', '.');
            var iMontantInitial = parseFloat(sMontantI);

            await fonction.clickAndWait(pageStockCasse.buttonAjouter, page, 40000);

			await fonction.wait(page, 250);		// Petite tempo le temps d'afficher le message d'erreur si besoin

            if(await pageStockCasse.labelFeedBackError.isVisible()){

                var message = await pageStockCasse.labelFeedBackError.textContent();
                if(message){
                    log.set(`Erreur : ${message}`);
                    log.separateur();
                    test.skip();
                }
            }else{

                await pageStockCasse.buttonSupprimerCasse.waitFor({state:'visible'});
                var sMontantT = await pageStockCasse.labelMontantTotalCasse.textContent();
                if(sMontantT){
                    log.set('Montant après traitement : ' + sMontantT);
                    sMontantT            = sMontantT.replace('€', '')
                    sMontantT            = sMontantT.replace(/\s/g, '');
                    sMontantT            = sMontantT.replace(',', '.')
                    var iNouveauMontant  = parseFloat(sMontantT);
                    expect(iNouveauMontant).toBeGreaterThan(iMontantInitial);
                    log.separateur();
                }
            } 
        }  
    })
}

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageStockCasse  = new StockCasse(page);
	const helper 	= new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async() => {
        await fonction.openUrl(page);
    });

    test ('Connexion', async ({ context }) => {
		await context.clearCookies();
        await fonction.connexion(page);
    });

    test.describe('Page [ACCUEIL]', async () => {

        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if(isVisible){
                await menu.removeArlerteMessage(page);
            }else{
                log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                test.skip();
            }
        });

        test.describe('Page [STOCK]', () => { 

            var sNomPage = 'stock';
            test ('Page [STOCK] - Click', async () => {
                await menu.click(sNomPage, page);
            });
    
            test ('ListBox [LIEU DE VENTE] = "' + sNomVille + '"', async() =>{
                await menu.selectVille(sNomVille, page);
            });
    
            test ('Onglet [CASSE] - Click', async() => {
                await menu.clickOnglet(sNomPage, 'casse', page);
            });
    
            test.describe('Onglet [CASSE]', () => {
       
                test ('Label [ERREUR] - Is NOT Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);
                    log.separateur();
                });  
    
                aData.forEach(async (aTab, index) => {

                    await traitement(aTab, index);
                });
            }); // end describe

        }); // end describe

        test ('Déconnexion', async () => {
            await fonction.deconnexion(page);
        });
    });
});