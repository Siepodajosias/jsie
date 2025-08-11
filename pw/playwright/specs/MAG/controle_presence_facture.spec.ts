/**
* 
* @author JOSIAS SIE
* @since 2024-02-06
* 
*/
const xRefTest      = "MAG_FAC_VER";
const xDescription  = "Vérifier la présence des factures en magasin";
const xIdTest       =  7223;
const xVersion      = '3.4';
  
var info = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['listeMagasins', 'groupeArticle'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page, expect}        from '@playwright/test';

import { TestFunctions }                 from "@helpers/functions";
import { Log }                           from "@helpers/log";
import { Help }                          from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { StockLivraison }                from "@pom/MAG/stock-livraisons.page";
import { FacturationBlDefinitif }        from '@pom/MAG/facturation-bl_definitif.page';
import { MenuMagasin }                   from '@pom/MAG/menu.page';

//------------------------------------------------------------------------------------

let page          : Page;

let menu          : MenuMagasin;
let pageStkLivr   : StockLivraison;
let pageFacturat  : FacturationBlDefinitif;

const log         = new Log();
const fonction    = new TestFunctions(log);

//------------------------------------------------------------------------------------    
fonction.importJdd();

const sFileJdd          = fonction.getLocalConfig('jddLieuxVente');
const varianteLieuVente = fonction.readFile(sFileJdd);

const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Fruits et légumes');
var   aListeMagasin     = fonction.getInitParam('listeMagasins', '');
var   aCodesArticlesE2E = fonction.getInitParam('listeArticles', '');
var   sCommandeQte      = fonction.getInitParam('rndCommandeMin', '10');

var   iCommandeQte:any;
//------------------------------------------------------------------------------------  

// La liste des lieux de vente cible peut être :
//    * Soit celle contenue dans le fichier de conf par défaut de l'application (array)
//    * Soit celle contenue dans le JDD (array)
//    * Soit celle passée en argument (string). Ex "ville1 , ville2 , ville3".
// Dans ce dernier cas, cette chaîne doit être transofmrée en tableau pour pouvoir être traitée.

if (typeof(aListeMagasin) === 'string' ) {
    aListeMagasin = aListeMagasin.split(',');
}

var b1stSelect = true;
// La chaîne de la liste des magasins doit être transformée en tableau pour pouvoir être traitée.
aCodesArticlesE2E = aCodesArticlesE2E.split(',');

if(typeof(sCommandeQte) === 'string'){
    iCommandeQte = parseInt(sCommandeQte);
}else{
    iCommandeQte = sCommandeQte;
}

if (iCommandeQte > 0) {
    var iEcartCommandeQte = 1;}
else {
    var iEcartCommandeQte = 0;}

sCommandeQte    = iCommandeQte.toString();
// Date de livraison à rechercher
var maDate          = new Date();
maDate.setDate(maDate.getDate() - 1);
var sDateBL         = fonction.addZero(maDate.getDate()) + " / " + fonction.addZero(maDate.getMonth() + 1);
    
//------------------------------------------------------------------------------------
  
test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageStkLivr     = new StockLivraison(page);
    pageFacturat    = new FacturationBlDefinitif(page);
});
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    });

    test ('Ouverture URL', async() => {
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });
 
    test.describe ('Page [STOCK]', () => {

        var sNomPage = 'stock';  
        //-- Message d'avertissement (Check Browser) spécifique à l'application SIGALE Magasin
        //-- Click sur le lien de confirmation pour faire disparaître le message d'alerte 
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

        test ('Page [STOCK] - Click', async () => {
            await menu.click(sNomPage, page);
        })

        test.describe ('Onglet [LIVRAISONS]', () => {

            // par défaut on est sur l'onglet Livraisons   
            // mais on clique quand même dessus pour s'assurer que l'alerte sanitaire (si présente) ne parasite pas l'affichage
            test ('Onglet [LIVRAISONS] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'livraisons',page);
            })

            test ('Popin [ALERT][PAGE LIVRAISONS] - Click', async () => {
                await fonction.isErrorDisplayed(false, page);
            });

            aListeMagasin.forEach((listeMagasin: string, index:number) => {

                listeMagasin = listeMagasin.replace(' (Fresh)', '');
                listeMagasin = varianteLieuVente[listeMagasin];

                test ('ListBox [MAGASIN][' + index +'] = "' + listeMagasin + '"', async () => {
                    // Le magasin peut contenir le suffixe parasite " (FRESH)".
                    await menu.selectVille(listeMagasin, page);
                    await fonction.addDataSheet('ListBox', 'Groupe Article', sGroupeArticle);
                }) 
    
                // Selectionner le groupe article une seule fois
                if(index === 0){

                    test ('ListBox [GROUPE ARTICLE][' + index +'] = "' + sGroupeArticle + '" - Click', async () => {    
                        // le filtre sur groupe article est persistant en changeant de magasin
                        // il ne faut pas filtrer à nouveau après avoir changé de magasin sinon on enlève le filtre
                        // on attend un seul BL par groupe article
                        await fonction.clickElement(pageStkLivr.buttonFiltreGpeArticle);
                        await fonction.sendKeys(pageStkLivr.inputFiltrGroupeArticle, sGroupeArticle, false, '** Skip **');
                        await fonction.wait(page, 500); 
                        var eSelectorGrpArticle = pageStkLivr.lisBoxFltreGrpeArtItem.nth(0); 
                        var isVisible = await eSelectorGrpArticle.isVisible();
                        if (isVisible) {
                            if (b1stSelect) {       // le groupe article n'a pas encore été sélectionné
                                await eSelectorGrpArticle.click();
                                var IsIconVisible = await pageStkLivr.lisBoxFltreGrpeIcon.isVisible();
                                if(IsIconVisible){
    
                                    await pageStkLivr.lisBoxFltreGrpeIcon.click();
                                }
                                await fonction.wait(page, 1000);
                                b1stSelect = false;
                            }
                        } else {
                            log.set('Groupe article "' + sGroupeArticle + '" absent pour le lieu de vente "' + listeMagasin + '"');
                            b1stSelect = true;
                        } 
                    }) 
                }

                test ('Datagrid [STATUT BL][' + index +'] = Définitif', async () => {            
                    var present = await pageStkLivr.dataGridStatutBL1st.nth(0).isVisible();
                    expect(present).toBe(true);
                    if (present) {
                        var sStatut = await pageStkLivr.dataGridStatutBL1st.nth(0).textContent();
                        expect(sStatut).toBe('Définitif');
                    } else {
                        throw new Error('BL plateforme absent pour le lieu de vente "' + listeMagasin + '"');  
                    }
                })

            }); // end describe

        });

    }); // end describe
    
    test.describe ('Page [FACTURATION]', () => {
            
        var sNomPage = 'facturation';        

        test ('Page [FACTURATION] - Click', async () => {
            await menu.click(sNomPage, page);
        })

        // par défaut on est sur l'onglet BL définitifs   
        // mais on clique quand même dessus pour s'assurer que l'alerte sanitaire (si présente) ne parasite pas l'affichage
        test ('Onglet [BL DEFINITIFS] - Click', async () => {
            await menu.clickOnglet(sNomPage, 'blDefinitifs', page);
        })

        test ('Popin [ALERT][PAGE FACTURATION] - Click', async () => {
            await menu.removeArlerteMessage(page);
            await fonction.isErrorDisplayed(false, page);  // Pas d'erreur affichée à priori au chargement de l'onglet
        }); 

        test.describe ('Onglet [FACTURATION]', () => {

            aListeMagasin.forEach((listeMagasin: string, index:number) => {

                 // Le lieu de vente peut contenir le suffixe parasite " (FRESH)".
                listeMagasin = listeMagasin.replace(' (Fresh)', '');
                listeMagasin = varianteLieuVente[listeMagasin];
                test ('ListBox [MAGASIN][' + index + '] = "' + listeMagasin + '"', async () => {
                    await menu.selectVille(listeMagasin, page);
                })
    
                // sélection du dernier BL reçu
                test ('Datagrid [BL][' + index + '] - Last = '+ sDateBL + ' - Click', async () => {
                    var sJournee = await pageFacturat.dataGridListeBlJournee.last().textContent();
                    expect(sJournee).toBe(sDateBL);
                    await fonction.clickAndWait(pageFacturat.dataGridListeBlJournee.last(), page);
                })
                
                // cas du E2E, controle des articles présents dans la facture
                if (aCodesArticlesE2E[0] != "") {                  // Cas du E2E

                    test.describe ('Recherche [ARTICLE] dans la facture[' + listeMagasin + '] ', () => {

                        aCodesArticlesE2E.forEach((codeArticle: string) => {

                            test ('Filtre [ARTICLE][' + codeArticle + '] = '+ codeArticle, async () => {
                                await fonction.sendKeys(pageFacturat.inputFiltreArticle, codeArticle, false, '** Skip **');
                                await fonction.wait(page, 500);
                            })
    
                            test ('Check [QTE FACTUREE][' + codeArticle + ']', async () => {
                                if (codeArticle == aCodesArticlesE2E[0]) {  // cas de l'article en écart négatif

                                    var iQteEcartNeg = iCommandeQte - iEcartCommandeQte;
                                    var sQteEcartNeg = iQteEcartNeg.toString();
                                    
                                    var sQteFac = await pageFacturat.dataGridListeArticlesQteFac.nth(0).textContent();
                                    expect(sQteFac).toBe(sQteEcartNeg);
                                } else {

                                    if (codeArticle == aCodesArticlesE2E[1]) {       // cas de l'article en écart positif

                                        var iQteEcartPos = iCommandeQte + iEcartCommandeQte;
                                        var sQteEcartPos = iQteEcartPos.toString();
                                        
                                        var sQteFac = await pageFacturat.dataGridListeArticlesQteFac.nth(0).textContent();
                                        expect(sQteFac).toBe(sQteEcartPos);
                                    } else {

                                        var sQteFac = await pageFacturat.dataGridListeArticlesQteFac.nth(0).textContent();
                                        expect(sQteFac).toBe(sCommandeQte);
                                    }
                                }   
                            })
                        })
                    })

                }

            }) // end each ldv

        })

    }); // end describe
 
    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
    
}); // end describe