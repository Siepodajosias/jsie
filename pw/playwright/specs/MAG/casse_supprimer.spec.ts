/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 29 - 11 - 2023
 * 
 */

const xRefTest      = "MAG_CAS_SUP";
const xDescription  = "Supprimer la casse";
const xIdTest       =  7541;
const xVersion      = '3.0.1';

var info = {
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

import { test, type Page, expect}        from '@playwright/test';

import { TestFunctions }                 from "../../utils/functions";
import { Log }                           from "../../utils/log";
import { Help }                          from '../../utils/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }                   from '../../pages/MAG/menu.page';
import { StockCasse }                    from '../../pages/MAG/stock-casse.page';

//-------------------------------------------------------------------------------------

let page           : Page;

let menu           : MenuMagasin;
let pageStockCasse : StockCasse;

const log          = new Log();
const fonction     = new TestFunctions(log);

//----------------------------------------------------------------------------------------


const aGroupeArticle    = ['Marée', 'Coupe / Corner', 'Frais LS', 'Elaborés'];

const sNomVille         = process.env.VILLE || 'Istres (F715)';

//-----------------------------------------------------------------------------------------

var traitement = async (sGroupeArticle:string, index:number) => {

    test('ListBox [GROUPE ARTICLE][' + index + '] = "'+ sGroupeArticle + '"', async () => {
        await fonction.listBoxByLabel(pageStockCasse.listBoxGrpArticle, sGroupeArticle, page);
    })
  
    test('ChecBox [ARTICLE][0][' + index + '] - Click', async () => {
        await fonction.clickElement(pageStockCasse.tdDesignation.first());

        var infoLigne = '';
        var nbColonnne = await pageStockCasse.tdListeInfoCasseLigneFirst.count();
        for (var x=0; x < nbColonnne; x++) {
            var InfoColonne = await pageStockCasse.tdListeInfoCasseLigneFirst.nth(x).textContent();
            if(InfoColonne){
                infoLigne = infoLigne + InfoColonne +' | ';
            }
        }  
        log.set('Donnée: ' + infoLigne);
    })

    test('Button [SUPPRIMER UNE CASSE][' + index + '] - Click', async () => {
        var isActive = await pageStockCasse.buttonSupprimerCasse.isEnabled();
        if (isActive){
            var sMontantI = await pageStockCasse.labelMontantTotalCasse.textContent();
            if(sMontantI){
                log.set('Montant avant traitement : ' + sMontantI);
                sMontantI = sMontantI.replace('€', '');
                sMontantI = sMontantI.replace(/\s/g, '');
                sMontantI = sMontantI.replace(',', '.');
                var iMontantInitial = parseFloat(sMontantI);
                await fonction.clickElement(pageStockCasse.buttonSupprimerCasse);
                await fonction.clickAndWait(pageStockCasse.pButtonOui, page);

                var sMontantT = await pageStockCasse.labelMontantTotalCasse.textContent();

                if(sMontantT){
                    log.set('Montant après traitement : ' + sMontantT);
                    sMontantT = sMontantT.replace('€', '');
                    sMontantT = sMontantT.replace(/\s/g, '');
                    sMontantT = sMontantT.replace(',', '.');
                    var iNouveauMontant = parseFloat(sMontantT);
                    expect(iMontantInitial).toBeGreaterThan(iNouveauMontant);
                    log.separateur();
                } 
            }
        }else{
            log.set('Button [SUPPRIMER UNE CASSE] - Click: ACTION ANNULEE');
            test.skip();
            log.separateur();
        }
    })    
}
//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageStockCasse  = new StockCasse(page);
});

test.afterAll(async ({}, testInfo) => {
    fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    });

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACCUEIL]', async () => {

        test('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if(isVisible){
                await menu.removeArlerteMessage(page);
            }else{
                log.set('Link [BROWSER SECURITY WARNING] - Click: ACTION ANNULEE');
                test.skip();
            }
        })

        test.describe('Page [STOCK]', () => { 

            var sNomPage = 'stock';
            test('Page [STOCK] - Click', async () => {
                await menu.click(sNomPage, page);
            })
    
            test('ListBox [LIEU DE VENTE] = "' + sNomVille + '"', async() =>{
                await menu.selectVille(sNomVille, page);
            })
    
            test('Onglet [CASSE] - Click', async() => {
                await menu.clickOnglet(sNomPage, 'casse', page);
            })
    
            test.describe('Onglet [CASSE]', () => {
       
                test('Header [DATE] - Click x 2', async () => {                     // Tri par ordre anti chronologique
                    await fonction.clickElement(pageStockCasse.thHeaderDate);                   // 2 fois pour être dans le bon ordre
                    await fonction.clickElement(pageStockCasse.thHeaderDate);
                    log.separateur();
                })

                aGroupeArticle.forEach(async (sGroupeArticle, index) =>{
                    await traitement(sGroupeArticle, index);
                })
            }); // end describe
        }); // end describe

        test('Déconnexion', async () => {
            await fonction.deconnexion(page);
        });
    })
})