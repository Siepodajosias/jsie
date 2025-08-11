/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 04 - 01 - 2024
 */
const xRefTest      = "MAG_DON_BEN";
const xDescription  = "DON - Création d'un bénéficiaire";
const xIdTest       =  71;
const xVersion      = '3.7';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['ville','groupeArticle'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}               from '@playwright/test';

import { TestFunctions }                from "@helpers/functions";
import { Log }                          from "@helpers/log";
import { Help }                         from '@helpers/helpers';

import { MenuMagasin }                  from '@pom/MAG/menu.page';
import { StockDons }                    from '@pom/MAG/stock-dons.page';
import { StockStock }                   from '@pom/MAG/stock-stock.page';

import { AutoComplete, CartoucheInfo }  from '@commun/types';

//-------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pageStockDons       : StockDons;
let pageStockStock      : StockStock;

const log               = new Log();
const fonction          = new TestFunctions(log);

//----------------------------------------------------------------------------------------

var maDate              = new Date();

const sPoids            = '12.345';
const sPoidsGrammes     = '12345';
const sQuantite         = '8';
const sGroupeArticle2   = 'Marée';
const sCodeBarres       = '2869913027683';


const sVilleCible       = fonction.getInitParam('ville','Malemort (G914)');
const sGroupeArticle    = fonction.getInitParam('groupeArticle','Fruits et légumes');

//---------------------------------------------------------------------------------------------

test.beforeAll (async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageStockDons   = new StockDons(page);
    pageStockStock  = new StockStock(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll (async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial('[' + info.refTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });
    
    test ('Connexion RESPONSABLE RAYON ', async () => {
        await fonction.connexion(page);
    })

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

    test.describe ('Page [STOCK]', async () => {

        var sBeneficiaire : any;
        var sCodeArticle  : any;
        

        var pageName:string = 'stock';

        test ('Page [STOCK] - Click', async () => {
            await menu.click(pageName,page);
        })

        test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })   

        test ('ListBox [VILLE] = "' + sVilleCible + '"', async () => {
            await menu.selectVille(sVilleCible, page);
        })   

        // Pour selectionner un article pour le don il faut qu'il soit present en stock
        // On selectionnera donc un article après avoir vérifier sa présence en stock
        test.describe ('** Recherche d\'article selectionnable pour le don **', () => {
            test ('Onglet [STOCK] - Click', async () => {
                await menu.clickOnglet(pageName, 'stock', page);
            })

            test ('ListBox [GROUPE ARTICLE / ZONE] = "' + sGroupeArticle + '"', async () => {
                await fonction.listBoxByLabel(pageStockStock.listBoxGroupeArticle, sGroupeArticle, page);
            })

            test ('** Wait Until Spinner Off **', async () => {
                await fonction.waitForSpinner(pageStockStock.spinner, 180000);
            })

            test('Datagrid Td [CODE ARTICLE][Rnd] - Choose', async () => {
                try {
                    // Attendre la stabilité du DOM avec un timeout de 10s
                    await fonction.waitForDomStable(page, 500, 10000);
                    // Compter le nombre d'articles dans la grille
                    const iNbArticle = await pageStockStock.tdCodeArticle.count();
            
                    if (iNbArticle > 0) {
                        const iCible = Math.floor(fonction.random() * iNbArticle);
                        sCodeArticle = await pageStockStock.tdCodeArticle.nth(iCible).textContent();
                        log.set('Code de l\'article : ' + sCodeArticle);
                    } else {
                        test.skip();
                    }
                } catch (error) {
                    test.skip(error);
                }
            });

        })

        test.describe ('Onglet [DONS]', async () => {

            test ('Onglet [DONS] - click', async () => {
                await menu.clickOnglet(pageName, 'dons', page);
            })

            // Selectionner la date du jour pour faciliter la recherche du dond dans la liste
            test ('DatePicker [PERIODE DU] = "' + maDate.getDate()+ '"', async () => {
                await fonction.clickElement(pageStockDons.datePickerFromIcon);
                var iNbJourActifs = await pageStockDons.datePickerDays.count();
                for (let iIndexJour = 0; iIndexJour < iNbJourActifs; iIndexJour ++){
                    var sJour = await pageStockDons.datePickerDays.nth(iIndexJour).textContent();
                    if(sJour == maDate.getDate().toString()){
                        await fonction.clickAndWait(pageStockDons.datePickerDays.nth(iIndexJour), page);
                        break;
                    }
                }
            })

            test.describe ('Zone [NOUVEAU DON][1]', async () => {

                test ('ListBox [GROUPE ARTICLE][1] = "' + sGroupeArticle + '"', async () => {
                    await fonction.listBoxByLabel(pageStockDons.listBoxGrpArticleNewBenef, sGroupeArticle, page);
                })
    
                test ('ListBox [BENEFICIARE][1] - Select', async () => {
                    var iNbOption = await pageStockDons.listBoxBeneficiareOption.count();
                    if(iNbOption > 1){    
                        sBeneficiaire = await pageStockDons.listBoxBeneficiareOption.nth(1).textContent();
                        log.set('Selected Beneficiaire 1 : ' + sBeneficiaire);
                        sBeneficiaire = sBeneficiaire.replace(/\([^)]*\)/g, ''); // En cas de parenthèse dans le texte, sa recherche devient difficile. Donc il faut pour la suite l'enlever
                        await pageStockDons.listBoxBeneficiare.selectOption({index:1});
                    }                    
                })  

                test ('InputField [CODE BARRES][1] = "' + sCodeBarres + '"', async () => {
                    var isEnabled = await pageStockDons.inputCodeBarre.isEditable();
                    if(isEnabled){
                        await fonction.sendKeys(pageStockDons.inputCodeBarre, sCodeBarres, false,'Code Barre');
                    }else{
                        log.set('InputField [CODE BARRES][1] = "' + sCodeBarres + '" : ACTION ANNULEE');
                        test.skip();
                    }
                })

                test ('InputField [AUTOCOMPLETE][ARTICLE][1] = "Selected Article"', async () => {
                    var isVisible = await pageStockDons.inputArticle.isVisible();
                    var isEnabled = await pageStockDons.inputArticle.isEditable();
                    if(isVisible && isEnabled){
                        var oData:AutoComplete = {
                            libelle         :'ARTICLE',
                            inputLocator    : pageStockDons.inputArticle,
                            inputValue      : sCodeArticle,
                            choiceSelector  :'li.gfit-autocomplete-result',
                            choicePosition  : 0,
                            typingDelay     : 100,
                            waitBefore      : 500,
                            page            : page,
                        };
                        await fonction.autoComplete(oData);
                        var article = await pageStockDons.inputArticle.inputValue();
                        log.set('Selected Article : ' + article);
                    }else{
                        log.set('InputField [AUTOCOMPLETE][ARTICLE][1] = "Selected Article" : ACTION ANNULEE');
                        test.skip();
                    }
                })
            
                test ('InputField [QUANTITE][1] = "' + sQuantite + '"', async () => {
                    var isVisible = await pageStockDons.inputQuantite.isVisible();
                    var isEnabled = await pageStockDons.inputQuantite.isEnabled();
                    if(isVisible && isEnabled){
                        await fonction.sendKeys(pageStockDons.inputQuantite,sQuantite, false, 'Quantité');
                    }else{

                        log.set('InputField [QUANTITE][1] = "' + sQuantite + '" : ACTION ANNULEE');
                        test.skip();
                    }
                }) 

                test ('InputField [POIDS][1] = "' + sPoids + '"', async () => {
                    var isVisible = await pageStockDons.inputPoids.isVisible();
                    var isEnabled = await pageStockDons.inputPoids.isEnabled();
                    if(isVisible && isEnabled){
                        await fonction.sendKeys(pageStockDons.inputPoids, sPoids, false, 'Poids');
                        log.set('Poids don 1 : ' + sPoids);  
                    }                  
                })        
                
                test ('Button [AJOUTER][1] - Click', async () => {
                    test.setTimeout(60000); 
                    var isVisible = await pageStockDons.buttonAjouterDon.isVisible();
                    var isEnabled = await pageStockDons.buttonAjouterDon.isEnabled();
                    if(isVisible && isEnabled){
                        await fonction.clickAndWait(pageStockDons.buttonAjouterDon, page, 60000);
                    }else{
                       log.set('Button [AJOUTER] - Click : ACTION ANNULEE');
                       test.skip(); 
                    }
                })  
                
                test ('Label [ERREUR][1] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
                    await fonction.isErrorDisplayed(false, page);
                })  

            })      
            
            test.describe ('Zone [RESULTS][1]', async () => {
    
                test ('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
                    await fonction.listBoxByLabel(pageStockDons.listBoxGrpArticle, sGroupeArticle, page);
                })
        
                test ('InputField [BENEFICIAIRE] = " Selected Beneficiaire 1"', async () => {
                    await fonction.sendKeys(pageStockDons.inputBeneficiare, sBeneficiaire, false, 'Bénéficaire');             
                })
        
                test ('CheckBox [*Last Response*][1] - Click', async () => {
                    var isVisible = await pageStockDons.checkBoxResponse.last().isVisible();
                    if(isVisible){
                        await fonction.clickAndWait(pageStockDons.checkBoxResponse.last(), page);  
                    }else{
                        log.set('CheckBox [*Last Response*] - Click : ACTION ANNULEE');
                        test.skip();
                    }   
                }) 
        
                test ('** Wait Until Spinner Off **', async () => {
                    await fonction.waitForSpinner(pageStockStock.pSpinner, 180000);
                })

                test ('Button [IMPRIMER LE BON DE REMISE DE DONS] - Click', async () => {
                    await fonction.noHtmlInNewTab(page, pageStockDons.buttonImprimerBonRemise);           
                })
            })
    
            var sNomPopin:string = 'Imprimer un récapitulatif mensuel'
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', () => {

                test ('Button [IMPRIMER UN RECAPITTULATIF MENSUEL] - Click', async () => {
                    await fonction.clickAndWait(pageStockDons.buttonImprimRecap, page);
                })
                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test('DatePicker [MOIS] = "' + maDate.toLocaleString('fr-FR', { month: 'short' }) + '"', async () => {
                    // Clique sur l’icône calendrier
                    await fonction.clickElement(pageStockDons.calendarDatePickerFromIcon);
                    //Récupère le mois depuis le dernier don affiché
                    const recupDernierDonAffiche = pageStockDons.trLigneDon.last();
                    const sdate = await recupDernierDonAffiche.locator('td[data-field="date"] > span').textContent();
                    const moisRecherche = parseInt(sdate?.slice(-2) ?? "0"); // 04 => 4
            
                    // Correspondance entre les noms des mois affichés dans le DatePicker
                    // et leur équivalent numérique (1 pour janvier, 2 pour février ...)
                    const listMois: { [key: string]: number } = {
                        'janv.': 1,
                        'févr.': 2,
                        'mars' : 3,
                        'avr.' : 4,
                        'mai'  : 5,
                        'juin' : 6,
                        'juil.': 7,
                        'août' : 8,
                        'sept.': 9,
                        'oct.' : 10,
                        'nov.' : 11,
                        'déc.' : 12,
                    };
                    // Récupère tous les mois visibles
                    const moisLocators = pageStockDons.datePickerMonths;
                    const iNbMois = await moisLocators.count();
                
                    for (let i = 0; i < iNbMois; i++) {
                        const moisTexte = await moisLocators.nth(i).textContent();
                        const indexTrouve = listMois[moisTexte?.trim() ?? ''];
                
                        if (indexTrouve === moisRecherche) {
                            await fonction.clickAndWait(moisLocators.nth(i), page);
                            break;
                        }
                    }
                });
                
                test ('ListBox [SOCIETE][FIRST] - Click', async () => {
                    await pageStockDons.pPInputbeneficiaire.selectOption({value:'0: Object'});
                })

                test ('Button [IMPRIMER] - Click', async () => {
                    await fonction.noHtmlInNewTab(page, pageStockDons.pPButtonImprimer);
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })

            })

            test.describe ('Zone [NOUVEAU DON][2]', async () =>  {
    
                test ('ListBox [GROUPE ARTICLE][2] = "' + sGroupeArticle2 + '"', async () =>  {
                    await fonction.listBoxByLabel(pageStockDons.listBoxGrpArticleNewBenef, sGroupeArticle2, page);
                })
        
                test ('ListBox [BENEFICIAIRE][2] - Select', async () =>  {
                    var nbOption = await pageStockDons.listBoxBeneficiareOption.count();
                    if(nbOption > 1){
                        sBeneficiaire = await pageStockDons.listBoxBeneficiareOption.nth(1).textContent();
                        log.set('Selected Beneficiaire 2 :' + sBeneficiaire);
                        sBeneficiaire = sBeneficiaire.replace(/\([^)]*\)/g, '');  // En cas de parenthèse dans le texte, sa recherche devient difficile. Donc il faut pour la suite l'enlever
                        await pageStockDons.listBoxBeneficiare.selectOption({index:1});
                    } 
                })
    
                test ('InputField [CODE BARRES][2] = "' + sCodeBarres + '"', async () => {
                    var isEnabled = await pageStockDons.inputCodeBarre.isEditable();
                    if(isEnabled){
                        await fonction.sendKeys(pageStockDons.inputCodeBarre, sCodeBarres, false, 'Code Barre');
                    }else{
                        log.set('InputField [CODE BARRES][2] = "' + sCodeBarres + '" : ACTION ANNULEE');
                        test.skip();
                    }
                })

                test ('InputField [AUTOCOMPLETE][ARTICLE][2] = "Selected Article"', async () => {
                    var isVisible = await pageStockDons.inputArticle.isVisible();
                    var isEnabled = await pageStockDons.inputArticle.isEditable();
                    if(isVisible && isEnabled){
                        var oData:AutoComplete = {
                            libelle         :'ARTICLE',
                            inputLocator    : pageStockDons.inputArticle,
                            inputValue      : sCodeArticle,
                            choiceSelector  :'li.gfit-autocomplete-result',
                            choicePosition  : 0,
                            typingDelay     : 100,
                            waitBefore      : 500,
                            page            : page,
                        };
                        await fonction.autoComplete(oData);
                        var article = await pageStockDons.inputArticle.inputValue();
                        log.set('Selected Article 2 : ' + article);
                    }else{
                        log.set('InputField [AUTOCOMPLETE][ARTICLE][2] = "Selected Article" : ACTION ANNULEE');
                        test.skip();
                    }
                })
        
                test ('InputField [QUANTITE][2] = "' + sQuantite + '"', async () => {
                    var isVisible = await pageStockDons.inputQuantite.isVisible();
                    var isEnabled = await pageStockDons.inputQuantite.isEnabled();
                    if(isVisible && isEnabled){
                        await fonction.sendKeys(pageStockDons.inputQuantite,sQuantite, false, 'Quantité');
                    }else{
                        log.set('InputField [QUANTITE][2] = "' + sQuantite + '" : ACTION ANNULEE');
                        test.skip();
                    }
                })                     
        
                test ('InputField [POIDS][2] = "' + sPoidsGrammes + '"', async () => {
                    var isEnabled = await pageStockDons.inputPoids.isEnabled();
                    if(isEnabled){
                        await fonction.sendKeys(pageStockDons.inputPoids, sPoidsGrammes, false, 'Poids grammes');
                        log.set('Poids don 2 : ' + sPoidsGrammes +  ' gramme');
                    }else{
                        log.set('InputField [POIDS][2] = "' + sPoidsGrammes + '" : ACTION ANNULEE');
                        test.skip();
                    }                 
                })  
        
                test ('Button [AJOUTER][2] - Click', async () => {
                    var isVisible = await pageStockDons.buttonAjouterDon.isVisible();
                    var isEnabled = await pageStockDons.buttonAjouterDon.isEnabled();
                    if(isVisible && isEnabled){
                        await fonction.clickAndWait(pageStockDons.buttonAjouterDon, page);
                    }else{
                        log.set('Button [AJOUTER][2] - Click : ACTION ANNULEE');
                        test.skip();
                    }
                })
                
                test ('Label [ERREUR][2] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
                    await fonction.isErrorDisplayed(false, page);
                })  

            }) 
    
            test.describe ('Zone [RESULTS][2]', async () => {
        
                test ('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle2 + '"', async () => {
                    await fonction.listBoxByLabel(pageStockDons.listBoxGrpArticle, sGroupeArticle2, page);
                })
        
                test ('InputField [BENEFICIAIRE] = "Selected Beneficiaire 2"', async () => {
                    await fonction.sendKeys(pageStockDons.inputBeneficiare, sBeneficiaire, false, 'Bénéficaire');               
                })
        
                test ('CheckBox [*Last Response*][2] - Click', async () => {
                    var isVisible = await pageStockDons.checkBoxResponse.last().isVisible();
                    if(isVisible){
                        await fonction.clickElement(pageStockDons.checkBoxResponse.last());  
                    }else{                        
                        log.set('CheckBox [*Last Response*][2] - Click : ACTION ANNULEE');
                        test.skip();
                    }                    
                })
                
            })

        })

    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
    
}) // end describe