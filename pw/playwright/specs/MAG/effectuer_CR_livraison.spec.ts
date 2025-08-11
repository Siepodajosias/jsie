/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 16 - 01 - 2024
 */

const xRefTest      = "MAG_CRL_ECA";
const xDescription  = "Effectuer un compte rendu de livraison plateforme";
const xIdTest       =  84;
const xVersion      = '3.5';

var info = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['groupeArticle', 'listeMagasins'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}       from '@playwright/test';

import { TestFunctions }                from "@helpers/functions";
import { Log }                          from "@helpers/log";
import { Help }                         from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }                  from '@pom/MAG/menu.page';
import { StockLivraison }               from '@pom/MAG/stock-livraisons.page';

import { AutoComplete }                 from '@commun/types';

//-------------------------------------------------------------------------------------

let page          : Page;

let menu          : MenuMagasin;
let pageStockLiv  : StockLivraison;

const log         = new Log();
const fonction    = new TestFunctions(log);

//----------------------------------------------------------------------------------------

fonction.importJdd();

const sFileJdd          = fonction.getLocalConfig('jddLieuxVente');
const varianteLieuVente = fonction.readFile(sFileJdd);
const maDate            = new Date();
const sCommandeQte      = "10";

var aListeVilles        = fonction.getInitParam('listeMagasins','Chaponnay');
var aCodesArticlesE2E   = fonction.getInitParam('listeArticles', '7580,7438,5254');
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Fruits et légumes');

//-----------------------------------------------------------------------------------------

// La liste des lieux de vente cible peut être :
//    * Soit celle contenue dans le fichier de conf par défaut de l'application (array)
//    * Soit celle contenue dans le JDD (array)
//    * Soit celle passée en argument (string). Ex "ville1 , ville2 , ville3".
// Dans ce dernier cas, cette chaîne doit être transofmrée en tableau pour pouvoir être traitée.

if (typeof(aListeVilles) === 'string' ) {
    aListeVilles = aListeVilles.split(',');
}

if(typeof(aCodesArticlesE2E) === 'string'){
    aCodesArticlesE2E = aCodesArticlesE2E.split(',');
}
   
const sCodeArtAjout = '5300';

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageStockLiv    = new StockLivraison(page);
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
            console.log('aCodesArticlesE2E :' + aCodesArticlesE2E);
        })

        // par défaut la date de livraison = la date du jour
        aListeVilles.forEach((sLieuDeVente:string, index:number) => {

            var bSuiteProcessus = false;
            // Le lieu de vente peut contenir le suffixe parasite " (Fresh)".
            sLieuDeVente = sLieuDeVente.replace(' (Fresh)', '');
            // Dans la page commande, la listbox des lieux de ventes contient des noms succédé d'un code. Il faut donc adapter notre liste de magasin à ceux-ci
            sLieuDeVente = varianteLieuVente[sLieuDeVente];
            test.describe ('Onglet [LIVRAISONS]['+ index +']' + sLieuDeVente, async () => {
    
                test ('Label [ERREUR]['+ index +'] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de l'onglet
                    await fonction.isErrorDisplayed(false, page);
                })                   

                test ('ListBox [LIEU DE VENTE][ERREUR]['+ index +'] = "' + sLieuDeVente + '"', async () =>{
                    await menu.selectVille(sLieuDeVente, page);
                })
                
                test ('ListBox [GROUPE ARTICLE][ERREUR]['+ index +'] = "' + sGroupeArticle + '" - Click', async () => {    
                    
                    await fonction.addDataSheet('ListBox', 'Groupe Article', sGroupeArticle);

                    // le filtre sur groupe article est persistant en changeant de magasin
                    // il ne faut pas filtrer à nouveau après avoir changé de magasin sinon on enlève le filtre
                    // on attend un seul BL par groupe article
                    await fonction.clickElement(pageStockLiv.buttonFiltreGpeArticle);
                    var eSelectorGrpArticle = pageStockLiv.lisBoxFltreGrpeArtItem.filter({hasText: sGroupeArticle}).nth(0); 
                    var isVisible = await eSelectorGrpArticle.isVisible();
                    if (isVisible) {

                        bSuiteProcessus = true;
                        await eSelectorGrpArticle.click();
                        await pageStockLiv.lisBoxFltreGrpeIcon.click();
                    } else {

                        log.set('Groupe article "' + sGroupeArticle + '" absent pour le lieu de vente "' + sLieuDeVente + '"');
                        throw new Error('Ooops: Groupe article "' + sGroupeArticle + '" absent pour le lieu de vente "' + sLieuDeVente);
                    } 
                }) 

                test ('Datagrid [STATUT 1st BL]['+ index +'] = Pour réception - click', async () => {   
                    if(bSuiteProcessus){
 
                        var isVisible = await pageStockLiv.dataGridListeBL.last().isVisible(); 
                        if (isVisible) {

                            var statutPresent  = await pageStockLiv.dataGridStatutBL1st.first().isVisible();
                            if (statutPresent) {

                                await pageStockLiv.dataGridStatutBL1st.last().waitFor();
                                var iNbLivraison   = await pageStockLiv.dataGridStatutBL1st.count();
                                for(let indexLivraison = 0; indexLivraison < iNbLivraison; indexLivraison++){

                                    // Verifier d'abord le type de la livraison ensuite son statut
                                    var sTypeLivraison  = await pageStockLiv.dataGridTypelivraison.nth(indexLivraison).textContent();
                                    var sStatut         = await pageStockLiv.dataGridStatutBL1st.nth(indexLivraison).textContent();
                                    var sdataGridGrpArt = await pageStockLiv.dataGridGroupeArticle.nth(indexLivraison).textContent();
                                    if(sdataGridGrpArt?.match(RegExp(sGroupeArticle)) && sTypeLivraison.match(/^Standard/gi) && sStatut?.match(/^Pour réception/gi) ){
                            
                                        await fonction.clickAndWait(pageStockLiv.dataGridListeBL.nth(indexLivraison), page);
                                        break;
                                    }else if(indexLivraison == iNbLivraison - 1){
                                       
                                        bSuiteProcessus = false;
                                        log.set('BL plateforme absent pour le lieu de vente "' + sLieuDeVente + '"');
                                        test.skip();
                                    }
                                }
                            } else {

                                bSuiteProcessus = false;
                                log.set('BL absent pour le lieu de vente "' + sLieuDeVente + '"');
                                test.skip();
                            }
                        } 
                    }else{

                        log.set('Datagrid [STATUT 1st BL]['+ index +'] = Pour réception - click: ACTION ANNULEE');
                        test.skip();
                    }
                })
         
                test ('Datagrid [FILTRE ARTICLE 0]['+ index +'] : '+ aCodesArticlesE2E[0], async () => {   

                    await fonction.addDataSheet('CheckBox', 'Article', aCodesArticlesE2E[0]);

                    if(bSuiteProcessus){

                        await fonction.sendKeys(pageStockLiv.dgArticleFiltreArticle.nth(0), aCodesArticlesE2E[0]);
                        await fonction.wait(page, 1000);
                        var bArcticleTrouver = await  pageStockLiv.dgArticleQteReelle.nth(0).isVisible();
                        if(!bArcticleTrouver){
                            bSuiteProcessus = false;
                            log.set('Aucun article trouvé pour le code: ' + aCodesArticlesE2E[0])
                        }
                    }else{

                        log.set('Datagrid [FILTRE ARTICLE 0]['+ index +'] : '+ aCodesArticlesE2E[0] + ' : ACTION ANNULEE');
                        test.skip();
                    }
                })
              
                test ('Input [QTE REELLE]['+ index +'] < QTE ATTENDUE ', async () => {   
                    if(bSuiteProcessus){

                        var iCommandeQte  = await pageStockLiv.dgArticleColonne.nth(5).textContent(); 
                        if (parseInt(iCommandeQte) > 0) {
                            var iEcartCommandeQte = 1;
                        }
                        else {
                            var iEcartCommandeQte = 0;
                        }
                        var iInputValue = parseInt(iCommandeQte) - iEcartCommandeQte;
                        var sEcartCommandeQte = iEcartCommandeQte.toString();
                        var isVisible = await pageStockLiv.dgArticleQteReelle.nth(0).isVisible();
                        if(isVisible){
                            await fonction.sendKeys(pageStockLiv.dgArticleQteReelle.nth(0), iInputValue.toString(), false, '** Skip **'); 
                            var sEcart = await pageStockLiv.dgArticleColonne.nth(7).textContent();
                            expect(sEcart).toBe('-'+ sEcartCommandeQte);
                        }
                    }else{

                        log.set('nput [QTE REELLE]['+ index +'] < QTE ATTENDUE : ACTION ANNULEE');
                        test.skip();
                    }        
                })

                test ('Datagrid [FILTRE ARTICLE 1]['+ index +'] : '+ aCodesArticlesE2E[1], async () => {  
                    if(bSuiteProcessus){

                        await fonction.sendKeys(pageStockLiv.dgArticleFiltreArticle.nth(0), aCodesArticlesE2E[1]); 
                        await fonction.wait(page, 1000);
                        var bArcticleTrouver = await  pageStockLiv.dgArticleQteReelle.nth(0).isVisible();
                        if(!bArcticleTrouver){

                            bSuiteProcessus = false;
                            log.set('Aucun article trouvé pour le code: ' + aCodesArticlesE2E[1])
                        }
                    }else{

                        log.set('Datagrid [FILTRE ARTICLE 1]['+ index +'] : '+ aCodesArticlesE2E[1] + ' : ACTION ANNULEE');
                        test.skip();
                    }          
                })

                test ('Input [QTE REELLE]['+ index +'] > QTE ATTENDUE', async () => {  
                    if(bSuiteProcessus){

                        var iCommandeQte       = await pageStockLiv.dgArticleColonne.nth(5).textContent(); 
                        
                        if (parseInt(iCommandeQte) > 0) {
    
                            var iEcartCommandeQte = 1;
                        }
                        else {
    
                            var iEcartCommandeQte = 0;
                        }
                        var iInputValue       = parseInt(iCommandeQte) + iEcartCommandeQte;
                        var sEcartCommandeQte = iEcartCommandeQte.toString();
                        var isVisible = await pageStockLiv.dgArticleQteReelle.nth(0).isVisible();
                        if(isVisible){

                            await fonction.sendKeys( pageStockLiv.dgArticleQteReelle.nth(0), iInputValue.toString(), false, '** Skip **'); 
                            var sEcart = await pageStockLiv.dgArticleColonne.nth(7).textContent()
                            expect(sEcart).toBe(sEcartCommandeQte);
                        }
                    }else{

                        log.set('Input [QTE REELLE]['+ index +'] > QTE ATTENDUE : ACTION ANNULEE');
                        test.skip();
                    }       
                })

                test ('Datagrid [FILTRE ARTICLE 2]['+ index +'] : '+ aCodesArticlesE2E[2], async () => {      
                    if(bSuiteProcessus){

                        await fonction.sendKeys(pageStockLiv.dgArticleFiltreArticle.nth(0), aCodesArticlesE2E[2], false, '** Skip **'); 
                        await fonction.wait(page, 1000);
                        var bArcticleTrouver = await  pageStockLiv.dgArticleQteReelle.nth(0).isVisible();
                        if(!bArcticleTrouver){

                            bSuiteProcessus = false;
                            log.set('Aucun article trouvé pour le code: ' + aCodesArticlesE2E[2])
                        }
                    }else{

                        log.set('Datagrid [FILTRE ARTICLE 2]['+ index +'] : '+ aCodesArticlesE2E[2] + ' : ACTION ANNULEE');
                        test.skip();
                    }       
                })

                test ('Input [QTE REELLE]['+ index +'] = QTE ATTENDUE', async () => {  
                    if(bSuiteProcessus){

                        var iCommandeQte        = await pageStockLiv.dgArticleColonne.nth(5).textContent();
                        var isVisible = await pageStockLiv.dgArticleQteReelle.nth(0).isVisible();
                        if(isVisible){

                            await fonction.sendKeys(pageStockLiv.dgArticleQteReelle.nth(0), iCommandeQte, false, '** Skip **'); 
                            var sEcart = await pageStockLiv.dgArticleColonne.nth(7).textContent()
                            expect(sEcart).toBe('0');
                        }
                    }else{

                        log.set('Input [QTE REELLE]['+ index +'] = QTE ATTENDUE : ACTION ANNULEE');
                        test.skip();
                    }           
                })

                test ('Info transport [TRANSPORTEUR]['+ index +'] : ajout a-premier de la liste', async () => {  
                    if(bSuiteProcessus){

                        // saisie 1er transporteur avec la lettre a
                        await pageStockLiv.buttonAjoutTransport.click(); 

                        var oData:AutoComplete = {
                            libelle         :'Transporteur',
                            inputLocator    : pageStockLiv.inputTransporteur,
                            inputValue      : 'a',
                            choiceSelector  :'button.dropdown-item',
                            choicePosition  : 0,
                            typingDelay     : 100,
                            clear           : true,
                            waitBefore      : 500,
                            page            : page,
                        };
                        await fonction.autoComplete(oData);
                        // saisie heure et min arrivée
                        if (maDate.getMinutes() == 0) {                                         // une heure d'écart entre arrivée et départ

                            await fonction.sendKeys( pageStockLiv.inputTransportHeures.nth(0), fonction.addZero(maDate.getHours() - 1), false, 'Heure Arrivée');
                            await fonction.sendKeys(pageStockLiv.inputTransportMinutes.nth(0), fonction.addZero(maDate.getMinutes()), false, 'Minute Arrivée');
                        } else {                                                                // une minute d'écart entre arrivée et départ

                            await fonction.sendKeys(pageStockLiv.inputTransportHeures.nth(0), fonction.addZero(maDate.getHours()), false, 'Heure Arrivée');
                            await fonction.sendKeys( pageStockLiv.inputTransportMinutes.nth(0), fonction.addZero(maDate.getMinutes() - 1), false, 'Minute Arrivée');
                        }
                        // saisie heure et min départ
                        await fonction.sendKeys(pageStockLiv.inputTransportHeures.nth(1), fonction.addZero(maDate.getHours()), false, 'Heure Départ');
                        await fonction.sendKeys(pageStockLiv.inputTransportMinutes.nth(1), fonction.addZero(maDate.getMinutes()), false, 'Heure Départ');
                    }else{
                        
                        log.set('Info transport [TRANSPORTEUR]['+ index +'] : ajout a-premier de la liste : ACTION ANNULEE');
                        test.skip();
                    }          
                })

                test ('Info transport [INCIDENTS]['+ index +'] = RIEN A SIGNALER', async () => {  
                    if(bSuiteProcessus){

                        var iNbLabel = await pageStockLiv.labelTransportIncidents.count();    
                        if(iNbLabel > 0){
                            for(let iIndexLabel = 0; iIndexLabel < iNbLabel; iIndexLabel){
                                var sText =  await pageStockLiv.labelTransportIncidents.nth(iIndexLabel).innerText();
                                if(sText.match(/^Rien à signaler/gi)){

                                    var isChecked = await pageStockLiv.checkBoxTransportCheck.isVisible();
                                    if(isChecked){

                                        // Do nothing
                                        break;
                                    }else{

                                        await pageStockLiv.labelTransportIncidents.nth(iIndexLabel).click();
                                        break;
                                    }

                                    
                                }
                            }
                        }  
                    }else{
                        
                        log.set('Info transport [INCIDENTS]['+ index +'] = RIEN A SIGNALER : ACTION ANNULEE');
                        test.skip();
                    }           
                })       

                test.describe ('Popin [AJOUTER UN ARTICLE]['+ index +']', async () => {

                    test ('Ajout [ARTICLE]['+ index +'] = ' + sCodeArtAjout, async () => { 
                        if(bSuiteProcessus){

                            var oData:AutoComplete = {
                                libelle         :'ARTICLE',
                                inputLocator    : pageStockLiv.inputAjoutArticle,
                                inputValue      : sCodeArtAjout,
                                choiceSelector  :'button.dropdown-item:last-child',
                                choicePosition  : 0,
                                typingDelay     : 100,
                                waitBefore      : 500,
                                page            : page,
                            };
                            await fonction.autoComplete(oData);
                            await fonction.clickAndWait(pageStockLiv.buttonAjoutArticle, page); 
                        }else{

                            log.set('Ajout [ARTICLE]['+ index +'] = ' + sCodeArtAjout + ' : ACTION ANNULEE');
                            test.skip();
                        }           
                    })

                    test ('Label [ERREUR]['+ index +'] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de l'onglet
                        if(bSuiteProcessus){

                            await fonction.isErrorDisplayed(false, page);
                        }else{

                            log.set('Label [ERREUR]['+ index +'] - Is Not Visible : VERIFICATION ANNULEE');
                            test.skip();
                        }
                    })
    
                    test ('Input [CONDITIONNEMENT] - select 1st row', async () => {
                        if(bSuiteProcessus){
     
                            await pageStockLiv.pPInputConditionnement.click();
                            await pageStockLiv.pPInputConditionnement.selectOption({index:0});
                        }else{

                            log.set('Input [CONDITIONNEMENT] - select 1st row : ACTION ANNULEE');
                            test.skip();
                        }     
                    })

                    test ('Input [QUANTITE] = '+ sCommandeQte, async () => { 
                        if(bSuiteProcessus){

                            await fonction.sendKeys(pageStockLiv.pPInputQuantite, sCommandeQte);
                        }else{
                            
                            log.set('Input [QUANTITE] = '+ sCommandeQte + ' : ACTION ANNULEE')
                            test.skip();
                        }           
                    })
                    
                    test ('Button [AJOUTER] - Click', async () => {      
                        if(bSuiteProcessus){

                            await fonction.clickAndWait(pageStockLiv.pPButtonAjouter, page);
                        }else{
                            
                            log.set('Button [AJOUTER] - Click : ACTION ANNULEE');
                            test.skip();
                        }      
                    })
                })

                test ('Datagrid [FILTRE ARTICLE] : check données article ajouté '+ sCodeArtAjout, async () => {   
                    if(bSuiteProcessus){

                        await fonction.sendKeys(pageStockLiv.dgArticleFiltreArticle.nth(0), sCodeArtAjout), false, '** Skip **'; 
                        await fonction.wait(page, 500);
                        // Origine = '-'
                        var sOrigine = await pageStockLiv.dgArticleColonne.nth(3).textContent();
                        expect(sOrigine).toBe('-');
                        // N° de lot = Inconnu
                        var sLot = await pageStockLiv.dgArticleColonne.nth(4).textContent();
                        expect(sLot).toBe('Inconnu');
                        // Quantité attendue = 0
                        var sQteAttendue = await pageStockLiv.dgArticleColonne.nth(5).textContent();
                        expect(sQteAttendue).toBe('0');
                        var sEcart = await pageStockLiv.dgArticleColonne.nth(7).textContent();
                        expect(sEcart).toBe(sCommandeQte); 
                    }else{
                       
                        log.set('Datagrid [FILTRE ARTICLE] : check données article ajouté '+ sCodeArtAjout + ': ACTION ANNULEE');
                        test.skip();
                    }         
                })

                test ('Button [ENREGISTRER ET ENVOYER] - Click', async () => {  
                    if(bSuiteProcessus){

                        await fonction.clickAndWait(pageStockLiv.buttonEnregistrerEnvoyer, page);
                    }else{

                        log.set('Button [ENREGISTRER ET ENVOYER] - Click : ACTION ANNULEE');
                        test.skip();
                    }          
                })

                test ('Label [DATE DERNIER ENVOI] - Visible', async () => {
                    if(bSuiteProcessus){

                        var text = await pageStockLiv.labelDernierEnvoi.textContent();
                        log.set('Ajout article : ' + sLieuDeVente + ' - ' + text);
                        log.separateur();
                    }else{
                        
                        log.set('Label [DATE DERNIER ENVOI] - Visible : ACTION ANNULEE');
                        test.skip();
                    }
                })

            }) // end describe

            log.separateur();

        }) // end boucle LDV
    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
    
})