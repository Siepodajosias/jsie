/**
 * 
 * 
 * @author JC CALVIERA
 * @since 2023-11-08
 * 
 */
const xRefTest      = "ACH_FAC_ARR";
const xDescription  = "Modifier le numéro de BL d'un arrivage";
const xIdTest       =  238;
const xVersion      = '3.9';

var info:CartoucheInfo = {
    desc    : xDescription,
    appli   : 'ACH',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : [],
    params  : ['fournisseur','rayon'],
    fileName: __filename
};

//------------------------------------------------------------------------------------
import { test, type Page, expect }  from '@playwright/test';

//-- Helpers
import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log'

import { MenuAchats }               from '@pom/ACH/menu.page';
import { PageHisArrLot }            from '@pom/ACH/historique_arrivages-lots.page';

import { AutoComplete, CartoucheInfo }  from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;

let pageHisArr      : PageHisArrLot;

var log             = new Log();
var fonction        = new TestFunctions(log);

var oData:any       = fonction.importJdd();                 // Récupération du JDD et des données du E2E en cours si ils existent
//------------------------------------------------------------------------------------
const sFournisseur  = fonction.getInitParam('fournisseur','01709');  // 01709 - capexo sa
const sRayon        = fonction.getInitParam('rayon','Fruits et légumes');
//------------------------------------------------------------------------------------

if(oData !== undefined) {                                  // On est dans le cadre d'un E2E. Récupération des données temporaires       
    var aListeLot  =  Object.keys(oData.aLots);  
    var sBl        = oData.sBonLivraison; 
    var sNumAchat  = oData.sNumAchatLong;
    var sBlFormate = sBl.match(/^(TA_BL \d{8})/)[0];
    var sBlModifie = sBlFormate + ' Modifie'     
    log.set('E2E - Liste des articles : ' + aListeLot);    
}

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    pageHisArr      = new PageHisArrLot(page);
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});
//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    })

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async() => {
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [HISTORIQUE]', () => {

        var sPageName:string = 'historique';

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {
            await menu.selectRayonByName(sRayon, page);
        })

        test('Page [HISTORIQUE] - Click', async () => {
            await menu.click(sPageName, page); 
        })
       
        test('Error Message - Is Hidden', async () =>  {
            await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
        })

        test ('AutoComplete [FOURNISSEUR] = "' + sFournisseur + '"', async () =>  {
            var sFournisseurFormat:string = sFournisseur
            const autoComplete:AutoComplete = {                                   
                libelle         : 'Fournisseur',
                inputLocator    : pageHisArr.inputFournCommande,
                inputValue      : sFournisseurFormat,
                page            : page,
                
            }

            await fonction.autoComplete(autoComplete);
        })

        test ('Button [RECHERCHER] - Click', async () => {
            await fonction.clickAndWait(pageHisArr.buttonRechercher, page);
        })

        test ('** Wait Until Spinner Off **', async () => {
            const iDelayTimeOut = 600000;
            test.setTimeout(iDelayTimeOut);         //-- Le spinner de chargement peut prendre plus de temps !
            await expect(pageHisArr.spinner).not.toBeVisible({timeout:iDelayTimeOut});
        });

        //-- Vérifier qu'au moins un lot est affiché pour ce fournisseur;
        test ('Td nombre [LOTS] > 0', async () => {    
            await pageHisArr.tdLotNumeroAchat.first().waitFor({state:"visible"});
            expect(await pageHisArr.tdLotNumeroAchat.count()).toBeGreaterThan(0);
        })

        //--Vérifier que Arrivages avec demande d'avoir n'est pas coché;
        test('CheckBox [ARRIVAGE AVEC DEMANDE AVOIR] - Check', async () => {
            expect(await pageHisArr.checkBoxArrivageAvecDA.isChecked()).toBe(false);
        })

        //--Vérifier que Arrivages sans facture n'est pas coché;
        test('CheckBox [ARRIVAGE SANS FACTURE] - Check', async () => {
            expect(await pageHisArr.checkBoxArrivageSansFacture.isChecked()).toBe(false);
        })

        // -- Je sélectionne un lot des lots agrées
        test ('InputField [BL] = "' + sBl+ '"', async () =>  {
            await fonction.sendKeys(pageHisArr.inputFiltreBL, sBl, false, 'Bon livraison');
            await fonction.wait(page, 500);
        })

        test ('Td [LOT] = "' + oData.aLots[aListeLot[0]] + '" - Click', async () => {
            await fonction.clickElement(pageHisArr.tdLotNumeroLot.filter({hasText:oData.aLots[aListeLot[0]]}).first());
        })

        test('Button [MODIFIER LE BL] - Click', async () =>  {
            await fonction.clickAndWait(pageHisArr.buttonModifierBL, page);        
        })

        var sNomPopin = "Modifier le BL des arrivages";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>  {

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);  
            })

            test('Error Message - Is Hidden', async () =>  {
                await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin               
            })

            //Je vois le N° de BL actuel dans Correction BL.
            test('InputField [CORRECTION BL] = "' + sBl + '" - Check', async () =>  {
                expect(await pageHisArr.pPinputModifBL.inputValue()).toBe(sBl);
            })

            test('InputField [CORRECTION BL] = "' + sBlModifie + '" - Modifier', async () =>  {
                await fonction.sendKeys(pageHisArr.pPinputModifBL, sBlModifie, false, 'Bon modifie');
            })

            test ('Button [ENREGISTRER] - Click', async () =>  {
                await fonction.clickAndWait(pageHisArr.pPbuttonModifBLEnregistrer, page);          
            }) 

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);  
            })
            
        })

        test ('InputField [ARTICLE] = "' + aListeLot[0] + '"', async () =>  {
            await fonction.sendKeys(pageHisArr.inputFiltreArticle, aListeLot[0], false, 'Code article');
        }) 

        test ('InputField [ACHAT] = "' + sNumAchat + '"', async () =>  {
            await fonction.sendKeys(pageHisArr.inputFiltreAchat, sNumAchat, false, 'Numero achat');
        }) 

        test ('InputField [BL] = "' + sBlModifie + '"', async () =>  {
            await fonction.sendKeys(pageHisArr.inputFiltreBL, sBlFormate, false, 'Bon modifie');
        })
       
        test ('Button [RECHERCHER (#1)] - Click', async () => {
            await fonction.clickAndWait(pageHisArr.buttonRechercher, page);
        })

        test ('td nombre [LOTS] = 1', async () => {
            expect(await pageHisArr.tdLotNumeroLot.count()).toBeGreaterThanOrEqual(1);
        })


    })  // End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})