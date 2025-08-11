/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 16 - 01 - 2024
 */

const xRefTest      = "MAG_STK_VER";
const xDescription  = "Vérifier la présence de la livraison du lendemain";
const xIdTest       =  977;
const xVersion      = '3.8';

var info = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['listeMagasins','groupeArticle'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}        from '@playwright/test';

import { TestFunctions }                 from "@helpers/functions";
import { Log }                           from "@helpers/log";
import { Help }                          from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }                   from '@pom/MAG/menu.page';
import { StockLivraison }                from '@pom/MAG/stock-livraisons.page';

//-------------------------------------------------------------------------------------

let page          : Page;

let menu          : MenuMagasin;
let pageStockLiv  : StockLivraison;

const log         = new Log();
const fonction    = new TestFunctions(log);

//----------------------------------------------------------------------------------------

fonction.importJdd();

const maDate            = new Date();

var aListeVilles        = fonction.getInitParam('listeMagasins', 'Annonay');
const sGroupeArticle    = fonction.getInitParam('groupeArticle','Frais LS');

const sFileJdd          = fonction.getLocalConfig('jddLieuxVente');
const varianteLieuVente = fonction.readFile(sFileJdd);

//-----------------------------------------------------------------------------------------

// La liste des lieux de vente cible peut être :
//    * Soit celle contenue dans le fichier de conf par défaut de l'application (array)
//    * Soit celle contenue dans le JDD (array)
//    * Soit celle passée en argument (string). Ex "ville1 , ville2 , ville3".
// Dans ce dernier cas, cette chaîne doit être transofmrée en tableau pour pouvoir être traitée.

if (typeof(aListeVilles) === 'string' ) {
    aListeVilles = aListeVilles.split(',');
}

var b1stSelect = true;
//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageStockLiv    = new StockLivraison(page);
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
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

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
        test ('Page [STOCK] - Click', async () => {
            await menu.click(pageName,page);
        })

        // par défaut on est sur l'onglet Livraisons   
        // mais on clique quand même dessus pour s'assurer que l'alerte sanitaire (si présente) ne parasite pas l'affichage
        test ('Onglet [LIVRAISONS] - Click', async () => {
            await menu.clickOnglet(pageName, 'livraisons', page);
        })

        // le choix de la date de livraison et du groupe article est persistant lorsqu'on change de magasin 
        // pas de préparation le dimanche, le script ne doit pas etre planifié le dimanche, 
        // dans le calendrier la date du jour ne peut pas etre le dimanche, donc le lendemain est toujours sur la meme ligne que la date du jour
        test ('Datepicker [DATE LIVRAISON] = "lendemain"', async () => {  
            await pageStockLiv.buttonDatePickAffich.click();
            var iDateDuJour = maDate.getDate();
            var iNbJour   = await pageStockLiv.datePickerDays.count();
            if(iNbJour == iDateDuJour){ // Si le jour - j est le dernier jour du mois il faut selection le premier jour du mois prochain
                await pageStockLiv.datePickerJourActifs.nth(iDateDuJour).click();
            }else{

                var isEnabled = await pageStockLiv.datePickerDays.nth(iDateDuJour).isEnabled(); // Il s'agit de la date du jour + 1 car la fonction nth commence par nth(0)
                if(isEnabled){
                    await pageStockLiv.datePickerDays.nth(iDateDuJour).click();
                }else{
                    log.set('J+1 est un lundi, impossible controler le BL : cas preparation le dimanche non prévu');
                }
            }

            await fonction.addDataSheet('ListBox', 'Groupe Article', sGroupeArticle);            
        }) 

        aListeVilles.forEach(async (sLieuDeVente:string, index:number) => {

            console.log('Lieu de vente: ' + sLieuDeVente);
            // Le lieu de vente peut contenir le suffixe parasite " (FRESH)".
            sLieuDeVente = sLieuDeVente.replace(' (Fresh)', '');
            sLieuDeVente = varianteLieuVente[sLieuDeVente];

            test.describe ('Onglet [LIVRAISONS][' + index + ']', () => {
    
                test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de l'onglet
                    await fonction.isErrorDisplayed(false, page);
                })                                 
        
                test ('ListBox [LIEU DE VENTE][' + index + '] = "' + sLieuDeVente + '"', async () =>{
                    await menu.selectVille(sLieuDeVente, page);
                })

                test ('ListBox [GROUPE ARTICLE][' + index + '] = "' + sGroupeArticle + '" - Click', async () => {    
                    // le filtre sur groupe article est persistant en changeant de magasin
                    // il ne faut pas filtrer à nouveau après avoir changé de magasin sinon on enlève le filtre
                    // on attend un seul BL par groupe article
                    await fonction.clickElement(pageStockLiv.buttonFiltreGpeArticle);
                    var eSelectorGrpArticle = pageStockLiv.lisBoxFltreGrpeArtItem.filter({hasText: sGroupeArticle}).nth(0); 
                    var isVisible = await eSelectorGrpArticle.isVisible();
                    if (isVisible) {
                        if (b1stSelect) {       // le groupe article n'a pas encore été sélectionné

                            await fonction.clickAndWait(eSelectorGrpArticle,page);
                            await pageStockLiv.lisBoxFltreGrpeIcon.click();
                            b1stSelect = false;
                        }
                    } else {
                        log.set('Groupe article "' + sGroupeArticle + '" absent pour le lieu de vente "' + sLieuDeVente + '"');
                        b1stSelect = true;
                    } 
                }) 

                test ('Datagrid [STATUT BL][' + index + '] = Prévisionnel', async () => {            

                    var statutPresent  = await pageStockLiv.dataGridStatutBL1st.first().isVisible();
                    if (statutPresent) {
                        
                        var sStatut = await pageStockLiv.dataGridStatutBL1st.first().textContent();
                        expect(sStatut).toBe('Prévisionnel');
                    }else{

                        throw new Error('BL plateforme absent pour le lieu de vente "' + sLieuDeVente + '"');  
                    }
                })

            }); // end describe

        })

    }); // end describe

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})