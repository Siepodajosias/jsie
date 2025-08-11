/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 19 - 12 - 2023
 */

const xRefTest      = "MAG_MDL_ADD";
const xDescription  = "Création / Export modèle de commande";
const xIdTest       =  1353;
const xVersion      = '3.3';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['groupeArticle'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}               from '@playwright/test';

import { TestFunctions }                from "@helpers/functions";
import { Log }                          from "@helpers/log";
import { Help }                         from '@helpers/helpers';

import { MenuMagasin }                  from '@pom/MAG/menu.page';
import { AutorisationsModelesCommande } from '@pom/MAG/autorisations-modeles_commande.page';

import { AutoComplete, CartoucheInfo }  from '@commun/types';

//-------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuMagasin;
let pageAutModCmde  : AutorisationsModelesCommande;

const log           = new Log();
const fonction      = new TestFunctions(log);

//----------------------------------------------------------------------------------------

var maDate           = new Date();

const nomModele      = 'TEST-AUTO_mdc-225' + maDate.getDate() + (maDate.getMonth() + 1) + maDate.getFullYear();
var aCodesArticles   =  [5400, 5800, 5100, 5300, 7400];
const quantite       = 8;

const sGroupeArticle = process.env.GROUPEARTICLE || 'Fruits et légumes';

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageAutModCmde  = new AutorisationsModelesCommande(page);
})
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });

test.describe ('[' + xRefTest + ']', () => {

    var bCommandeExiste   = false;
    var bDonneeASupprimer = false;
    var downloadProcess   : any;

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    })

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    })

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
                
                log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                test.skip();
            }
        })
    })

    test.describe('Page [AUTORISATIONS]', async () => {

        var pageName = 'autorisations';

        test('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(pageName,page);
        })

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })     
        
        test.describe('Onglet [MODELE DE COMMANDE]', async () => {     

            test('Onglet [MODELE DE COMMANDE] - Click', async () => {       
                await menu.clickOnglet(pageName, 'modelesCommande', page);
            })

            test('Label [ERREUR] - Is Not Visible', async () => {      // Pas d'erreur affichée à priori au chargement de l'onglet
                await fonction.isErrorDisplayed(false, page);
            })                         

            //-- Sécurité dans le cas ou le nom du modèle de commande exista déjà
            test.describe('*** VERIFICATION DE L\'EXISTENCE DU MODELE DE COMMANDE', () => { 

                test('InputFiled [MODELE] = "' + nomModele + '"', async () => {
                    await fonction.sendKeys(pageAutModCmde.inputModele, nomModele);
                })
        
                test('Tr [COMMANDE] = "' + nomModele + '" - Check', async () => {
                    log.set(' ------------------  VERIFICATION DE L\'EXISTENCE DE L\'ASSORTIMENT  --------------');
                    var NbResults = await pageAutModCmde.checkBoxModeles.count();
                    if (NbResults == 0) {

                        log.set('Aucun modèle de commande correspond à "' + nomModele + '"');
                    }else{ 

                        bCommandeExiste = true;
                        log.set('Le modèle de commande "' + nomModele + '" existe déjà');
                    }     
                    log.separateur();
                })
            })

            test('Button [CREER MODELE] - Click', async () => {
                if(bCommandeExiste){

                    log.set('Button [CREER MODELE] - Click : ACTION ANNULEE');
                    test.skip();
                }else{

                    await fonction.clickAndWait(pageAutModCmde.buttonCreerModele, page);
                }
            })

            test('InputField [DESIGNATION] = "' + nomModele + '"', async () => {
                if(bCommandeExiste){

                    log.set('InputField [DESIGNATION] = "' + nomModele + '" : ACTION ANNULEE');
                    test.skip();
                }else{

                    await fonction.sendKeys(pageAutModCmde.pInputDesignation, nomModele);
                }
            })

            test('ListBox [GROUPE ARTICLE] = "'+ sGroupeArticle + '"', async () => {
                if(bCommandeExiste){

                    log.set('InputField [DESIGNATION] = "' + sGroupeArticle + '" : ACTION ANNULEE');
                    test.skip();
                }else{

                    await fonction.listBoxByLabel(pageAutModCmde.pListBoxGroupeArticle, sGroupeArticle, page);   
                }
            })

            test('Button [ENREGISTRER][PREMIER] - Click', async () => {
                if(bCommandeExiste){

                    log.set('Button [ENREGISTRER][PREMIER] - Click : ACTION ANNULEE');
                    test.skip();
                }else{
                    
                    await fonction.clickAndWait(pageAutModCmde.pButtonEnregistrer, page);
                    log.set('L\' opération a été effectuée avec succès : le modèle de commande est maintenant créé');
                }
            })

            test('CheckBox [MODELE][0] - Click', async () => {
                if(bCommandeExiste){

                    log.set('CheckBox [MODELE][0] - Click : ANNULEE');
                    test.skip();
                }else{

                    await fonction.clickAndWait(pageAutModCmde.checkBoxModeles.nth(0), page);
                }
            })
            
            test.describe('Supression Anciennes Données', () => {

                test('ListBox [DOSSIER D\'ACHAT] = "Tous"', async () => {
                    if(bCommandeExiste){

                        log.set('ListBox [DOSSIER D\'ACHAT] = "Tous" : ACTION ANNULEE');
                        test.skip();
                    }else{
                        await fonction.listBoxByLabel(pageAutModCmde.listBoxDossierAchat, 'Tous', page);
                    }
                })

                test('CheckBox [TOUS ARTICLES] - Click', async () => {
                    if(bCommandeExiste){

                        log.set('CheckBox [TOUS ARTICLES] - Click : ACTION ANNULEE');
                        test.skip();
                    }else{

                        var ligneIsVisible = await pageAutModCmde.labelAucuneLigneCmd.isVisible();
                        if(ligneIsVisible){ // Verifier l'existence de ligne de commande

                            log.set('Aucune ligne de modèle de commande à supprimer');
                        }else{

                            bDonneeASupprimer = true;
                            await fonction.clickElement(pageAutModCmde.checkBoxAllArticles);
                        }
                    }
                })

                test('Button [SUPPRIMER ARTICLE] - Click', async () => {
                    if(bCommandeExiste ){

                        log.set('Button [SUPPRIMER ARTICLE] - Click : ACTION ANNULEE');
                        test.skip();
                    }else{

                        if(bDonneeASupprimer){

                            await fonction.clickElement(pageAutModCmde.buttonSupprimerArticle);
                        }else{

                            log.set('Button [SUPPRIMER ARTICLE] - Click : ACTION ANNULEE');
                            test.skip();
                        }
                    }
                })

                var sNomPopin = "Confirmer la suppression";
                test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>{

                    test('Button [OUI] - Click', async () => {
                        if(bCommandeExiste){
                          
                            log.set('Button [OUI] - Click : ACTION ANNULEE');
                            test.skip();
                        }else{
    
                            if(bDonneeASupprimer){

                                await fonction.clickAndWait(pageAutModCmde.pButtonOui, page);
                            }else{

                                log.set('Button [OUI] - Click : ACTION ANNULEE');
                                test.skip();
                            }
                        }
                    })
                })
            })
       
            aCodesArticles.forEach((codeArticle, index) => {

                test.describe ('** Examen du code article "' + codeArticle + '" **', async () => {

                    test('InputField [AUTOCOMPLETE][ARTICLE][' + index + '] = "' + codeArticle + '"', async () => {
                        if(bCommandeExiste){

                            log.set('InputField [AUTOCOMPLETE][ARTICLE] = "' + codeArticle + '" : ACTION ANNULEE');
                            test.skip();
                        }else{

                            var oData:AutoComplete = {
                                libelle         :'ARTICLE',
                                inputLocator    : pageAutModCmde.inputAutoCompleteArticle,
                                inputValue      : codeArticle.toString(),
                                choiceSelector  :'li.gfit-autocomplete-result',
                                choicePosition  : 0,
                                typingDelay     : 100,
                                waitBefore      : 500,
                                page            : page,
                            };
                            await fonction.autoComplete(oData);
                        }
                    })

                    test('Button [ + ][' + index + '] - Click', async () => {
                        if(bCommandeExiste){

                            log.set('Button [ + ] - Click : ACTION ANNULEE');
                            test.skip();
                        }else{
    
                            await fonction.clickAndWait(pageAutModCmde.buttonPlus, page);
                        }
                    })

                    test.describe ('Popin [AJOUT D\'UN ARTICLE][' + index + ']', async () => {

                        test('Popin [AJOUT D\'UN ARTICLE][' + index + '] - Is Visible', async () => {
                            if(bCommandeExiste){

                                log.set('Popin [AJOUT D\'UN ARTICLE] - Is Visible : VERIFICATION ANNULEE');
                                test.skip();
                            }else{
    
                                await fonction.popinVisible(page,'AJOUT D\'UN ARTICLE', true);
                            }
                        })
                        
                        test('Label [ERREUR][' + index + '] - Is Not Visible', async () => {         // Pas d'erreur affichée à priori au chargement de la popin
                            if(bCommandeExiste){

                                log.set('Label [ERREUR] - Is Not Visible : VERIFICATION ANNULE');
                                test.skip();
                            }else{
    
                                await fonction.isErrorDisplayed(false, page);
                            }
                        }) 
            
                        test('ListBox [CALIBRE][' + index + '][0] - Click', async () => {
                            if(bCommandeExiste){

                                log.set('ListBox [CALIBRE][0] - Click : ACTION ANNULEE');
                                test.skip();
                            }else{
    
                                var iNbOptions = await pageAutModCmde.pListBoxCalibreOption.count();
                                if(iNbOptions == 1){

                                    await pageAutModCmde.pListBoxCalibre.selectOption({index: 0});
                                }else{

                                    await pageAutModCmde.pListBoxCalibre.selectOption({index: 1});
                                }
                            }
                        })

                        test('ListBox [CONDITIONNEMENT][' + index + '][1] - Click', async () => {    
                            if(bCommandeExiste){

                                log.set('ListBox [CONDITIONNEMENT][0] - Click : ACTION ANNULEE');
                                test.skip();
                            }else{
    
                                var iNbOptions = await pageAutModCmde.pListBoxConditionnementOption.count();
                                if(iNbOptions == 1){

                                    await pageAutModCmde.pListBoxConditionnement.selectOption({index: 0});
                                }else{
                                    
                                    await pageAutModCmde.pListBoxConditionnement.selectOption({index: 1});
                                }
                            }  
                        })

                        test('InputField [QUANTITE][' + index + '] = "' + quantite + '"', async () => {
                            if(bCommandeExiste){

                                log.set('InputField [QUANTITE] = "' + quantite + '" : ACTION ANNULEE');
                                test.skip();
                            }else{
        
                                await fonction.sendKeys(pageAutModCmde.pInputQuantite, quantite);
                            }
                        })

                        test('Button [ENREGISTRER][SECOND][' + index + '] - Click', async () => {
                            if(bCommandeExiste){

                                log.set('Button [ENREGISTRER] - Click : ACTION ANNULEE');
                                test.skip();
                            }else{
    
                                await fonction.clickAndWait(pageAutModCmde.pButtonEnregistrerArticle, page);
                            }
                        })

                        test('Popin [AJOUT D\'UN ARTICLE][' + index + '] - Is Not Visible', async () => {
                            if(bCommandeExiste){

                                log.set('Popin [AJOUT D\'UN ARTICLE] - Is Not Visible : VERIFICATION ANNULEE');
                                test.skip();
                            }else{
    
                                await fonction.popinVisible(page,'AJOUT D\'UN ARTICLE', false);
                            }
                        })  
                    })
                }) 
            }) // End For
      

            test('Button [ENREGISTRER][TROISIEME] - Click', async () => {
                if(bCommandeExiste){

                    log.set('Button [ENREGISTRER] - Click : ACTION ANNULEE');
                    test.skip();
                }else{

                    await fonction.clickAndWait(pageAutModCmde.buttonEnregistrer, page); 
                }
            })

            // Suppression du premier article de la liste
            test('InputField [ARTICLE FILTER] ="' + aCodesArticles[0] +'"', async () => {
                if(bCommandeExiste){

                    log.set('InputField [ARTICLE FILTER] ="' + aCodesArticles[0] +'" : ACTION ANNULEE');
                    test.skip();
                }else{

                    await fonction.sendKeys(pageAutModCmde.inputFiltreModele, aCodesArticles[0]);
                }
            })

            test('InputField [LIGNE COMMANDES][0] - Click', async () => {
                if(bCommandeExiste){

                    log.set('InputField [LIGNE COMMANDES][0] - Click : ACTION ANNULEE');
                    test.skip();
                }else{

                    await pageAutModCmde.inputLignesCommandes.nth(0).click();
                }
            })

            test('Button [SUPPRIMER ARTICLE] - Click', async () => {
                if(bCommandeExiste){

                    log.set('Button [SUPPRIMER ARTICLE] - Click : ACTION ANNULEE');
                    test.skip();
                }else{

                    await pageAutModCmde.buttonSupprimerArticle.click();
                }
            })

            test.describe ('Popin [CONFIRMER LA SUPPRESSION] > ', async () => {

                test('Popin [CONFIRMER LA SUPPRESSION] - Is Visible', async () => {
                    if(bCommandeExiste){

                        log.set('Popin [CONFIRMER LA SUPPRESSION] - Is Visible : VERIFICATION ANNULEE');
                        test.skip();
                    }else{

                        await fonction.popinVisible(page,'CONFIRMER LA SUPPRESSION', true);
                    }
                })  

                test('Button [SUPPRIMER ARTICLE] - Click', async () => {
                    if(bCommandeExiste){

                        log.set('Button [SUPPRIMER ARTICLE] - Click : ACTION ANNULEE');
                        test.skip();
                    }else{

                        await fonction.clickAndWait(pageAutModCmde.pButtonOui, page);
                    }
                })                

                test('Popin [CONFIRMER LA SUPPRESSION] - Is Not Visible', async () => {
                    if(bCommandeExiste){

                        log.set('Popin [CONFIRMER LA SUPPRESSION] - Is Not Visible : VERIFICATION ANNULEE');
                        test.skip();
                    }else{

                        await fonction.popinVisible(page,'CONFIRMER LA SUPPRESSION', false);
                    }
                })
            })

            test('Button [EXPORTER MODELE] - Click', async () => {
                var isEnabled = await pageAutModCmde.buttonExporterModele.isEnabled();
                if(bCommandeExiste){

                    log.set('Button [EXPORTER] - Click : ACTION ANNULEE');
                    test.skip();
                }else {

                    if (isEnabled){

                        [downloadProcess] = await Promise.all([
                            page.waitForEvent('download'),
                            pageAutModCmde.buttonExporterModele.click(),
                        ]);
                        log.set('Document téléchargeable !');
                    }else{

                        log.set('Button [EXPORTER] - Click : ACTION ANNULEE');
                        test.skip();
                    }
                }
            })
    
            test('Download File [EXTENSION] = "csv"', async () => {
                if (bCommandeExiste) {

                    log.set('Download File [EXTENSION] = "csv": ACTION ANNULEE');
                    test.skip();
                } else {

                    await fonction.downloadedFile(downloadProcess,'csv', 100);
                }
            })
        })  // End describe Onglet
    })

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})