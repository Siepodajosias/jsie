/**
 * 
 * @author JOSIAS SIE
 * @since 2024-11-01
 * 
 */
const xRefTest      = "MAG_CDE_CBF";
const xDescription  = "Contrôles des besoins de la Marée pour les magasin Biofrais (enseigne)";
const xIdTest       =  9661;
const xVersion      = "3.1";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['codeMagasin','rayon'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { expect, test, type Page }    from '@playwright/test';

import { Help }                       from '@helpers/helpers.js';
import { TestFunctions }              from '@helpers/functions.js';
import { Log }                        from '@helpers/log.js';

import { MenuAchats }                 from '@pom/ACH/menu.page.js';
import { PageBesBesMag }              from '@pom/ACH/besoins_besoins-magasin.page';

import { AutoComplete, CartoucheInfo }from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
var pageBesoins     : PageBesBesMag;
var menu            : MenuAchats;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------  
var oData:any       = fonction.importJdd();

const sRayon        = fonction.getInitParam('rayon','Poissonnerie');
const sCodeMagasin  = fonction.getInitParam('codeMagasin', 'BA001PO,BM001PO,BF002PO,BF003PO,BF004PO');

if (oData !== undefined) {                      // On est dans le cadre d'un E2E. Récupération des données temporaires.
	var sCommande        = oData.iNbCommande;   // L'élément recherché est le nombre de commande préalablement créé dans le E2E.                                
	var sPrevision       = oData.iNbPrevision;  // L'élément recherché est le nombre de prévision préalablement créé dans le E2E.
    var sDateLivr        = oData.sDateLivraison;// Récupération de la date de livraison. 
	var sListeCodeArticle= Object.keys(oData.sArticle); 	   // L'élément recherché est le code article préalablement créé dans le E2E.

	log.set('E2E - Nombre de commande : ' + sCommande);
	log.set('E2E - Nombre de prévision: ' + sPrevision); 
}  

//------------------------------------------------------------------------------------
process.env.ROLE    = 'ACHETEUR';// Connexion par défaut avec le profil ayant le Role ACHETEUR
//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);    
    pageBesoins     = new PageBesBesMag(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async() => {
       await fonction.connexion(page);
    })
  
    test.describe('Page [BESOINS MAGASIN]', async() => {

        var pageName:string   = 'besoins';

        test('ListBox [RAYON] = "' + sRayon + '"', async() => {
            await menu.selectRayonByName(sRayon, page);
        })

        test("Menu [BESOINS MAGASIN] - Click ", async () => {
            await menu.click(pageName, page);
        })

        test.describe ('Onglet [BESOINS MAGASIN]', async() => {

            test ('Onglet [BESOINS MAGASIN] - Click', async () => {
                await menu.clickOnglet(pageName, 'besoinsMagasin', page);                
            })   

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            test ('Datepicker [DATE D\'EXPEDITION MAGASIN]', async () => {
                await fonction.clickElement(pageBesoins.datePickerExpedition);
            })

            test('Toggle Button [ACTIF] - Click rnd', async() => {
                var iDateExpedition = parseInt(sDateLivr) - 1;
                await fonction.clickAndWait(pageBesoins.datePickerSelectDay.locator('span:text-is("'+iDateExpedition+'")'), page);
            }) 

            sListeCodeArticle.forEach((codeArticle: string) => {
                test('AutoComplete [ARTICLE] = ['+codeArticle+']', async () => {
                    await fonction.clickElement(pageBesoins.iconClearArticle);
                    var oData:AutoComplete = {
                        libelle         :'ARTICLE',
                        inputLocator    : pageBesoins.inputCodeArticle,
                        inputValue      : codeArticle,
                        choiceSelector  :'.dropdown-item',
                        choicePosition  : 0,
                        typingDelay     : 100,
                        waitBefore      : 500,
                        page            : page
                    }
                    await fonction.autoComplete(oData);
                })

                // Vérification des commandes et prévisions des magasins Biofrais.

                test.describe ('Div [BESOINS MAGASIN] ['+codeArticle+']', async() => {
                    var aMagasin= sCodeMagasin.split (',');
                    aMagasin.forEach((magasin: any) => {
    
                    test ('Input [FILTRE][MAGASIN]['+magasin+']', async () => {
                        await fonction.sendKeys(pageBesoins.inputFiltreMagasin.nth(0), magasin);
                        await fonction.wait(page, 350);
                        log.set('Code magasin : ' + magasin);
                    })
    
                    if(magasin == 'BA001PO'){
                        test ('Td [COMMANDE] + [PREVISION] - Check', async () => {
                            await fonction.clickElement(pageBesoins.iconPlateformeDistribution);
                            var sNbrBesoin  = await pageBesoins.dataGridListeBesoin.count();
                            for(let i=0; i < sNbrBesoin; i++){
                                var sNbrCmmd= await pageBesoins.dataGridListeBesoin.nth(i).locator('td.text-end').nth(2).textContent();
                                expect(parseInt(sNbrCmmd)).toEqual(oData.sArticle[codeArticle].iNbCommande);
        
                                var sNbrPrev= await pageBesoins.dataGridListeBesoin.nth(i).locator('td.text-end').nth(3).textContent();
                                expect(parseInt(sNbrPrev)).toEqual(oData.sArticle[codeArticle].iNbPrevision);
                            }
                        })

                    }else{
                        test ('Tr [LISTE][BESOINS MAGASIN] ['+magasin+'] - Check', async () => {
                            var sNbrBesoin  = await pageBesoins.dataGridListeBesoin.count();
                            expect(sNbrBesoin).toEqual(0);
                        })
                    }
                    })
                })
            });
        })  // End  Onglet
    })  // End  Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
})  // End describe