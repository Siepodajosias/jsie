/**
 * 
 * @author Esli Ariel BAHILI
 *  Since 24 - 02 - 2025
 */

const xRefTest     = "MAG_ACT_ADI";
const xDescription = "Annuler une actualité diffusée";
const xIdTest      = 9676;
const xVersion     = '3.1 ';

var info:CartoucheInfo = {
    desc    : xDescription,
    appli   : 'MAGASIN',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : [],
    params  : ['titreActualite'],
    fileName: __filename
};

//----------------------------------------------------------------------------------------

import { expect, test, type Page }  from '@playwright/test';

import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';
import { Help }                     from '@helpers/helpers';

import { CartoucheInfo }            from '@commun/types';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }              from '@pom/MAG/menu.page';
import { AutorisationsActualite }   from '@pom/MAG/autorisations-actualite.page';
import { AccueilActualites }        from '@pom/MAG/accueil-actualites.page';

//----Variables--------------------------------------------------------------------------------------------------------------------------------------------

let page                     : Page;
let menu                     : MenuMagasin;
let pageActualites           : AutorisationsActualite;
let accueilActualites        : AccueilActualites;

const log                    = new Log();
const fonction               = new TestFunctions(log);

//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page			    = await browser.newPage();
    menu			    = new MenuMagasin(page, fonction);
    pageActualites 	    = new AutorisationsActualite(page);
    accueilActualites   = new AccueilActualites(page);

    const helper        = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({ }, testInfo) => {
    await fonction.close(testInfo);
})

//-------------------------------------------------------------------------------------

process.env.ROLE                = 'REPARTITEUR';

//-----------------------------------------------------------------------------------------

const sTitres:string            = fonction.getInitParam('titreActualite', 'TA_Actualité - 1,TA_Actualité - 2,TA_Actualité - 3,TA_Actualité - 4');
const aTitres:string[]          = sTitres.split(',');
const sMagasin:string           = fonction.getLocalConfig('actualiteMagasin');

//----Fonction--------------------------------------------------------------------------------

/**
 * @description Cette procédure permet de sélectionner une actualité en passant son titre en paramètre avec un titre unique aux noms
 * @param titre 
 * @param id 
 */
var selectionActualite = async (titre:string, id?:string) => {
    test (`InputField Filtre [TITRE] = "${titre}" #${id}`, async () => {
        await fonction.sendKeys(pageActualites.inputFiltreTitre, titre, false, 'Valeur Recherchée');
        await fonction.wait(page, 250);
    });
    
    test (`Button [SELECT ACTUALITE ${titre}${id}] - Click`, async () => {
        await fonction.clickAndWait(pageActualites.Listeactualite, page);
    });
}

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {
    
    test ('Ouverture URL', async ({context}) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion répartiteur : ' + fonction.getApplicationUrl(), async ({}) => {
        await fonction.connexion(page);
        await menu.removeArlerteMessage(page);
    })

    test.describe ('Page [ACCUEIL] - Repartiteur', async () => {

        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if (isVisible) {
                await menu.removeArlerteMessage(page);
            } else {
                log.set('Link [BROWSER SECURITY WARNING] - Click: ACTION ANNULEE');
                test.skip();
            }
        });

    })  

    test.describe ('Page [AUTORISATIONS]', () => {
        var pageName:string = 'autorisations'

        test ('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(pageName, page);
        })

        test.describe ('Onglet [ACTUALITE]', async () => {

            test ('Onglet [ACTUALITE]', async () => {
                await menu.clickOnglet(pageName, 'actualite', page)
            })

            test ('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            });

            // Cliquer sur le bouton "non diffusées" pour afficher seulement les actualités diffusées
            test ('Button [NON DIFFUSEES] - Click', async () => {
                await fonction.clickAndWait(pageActualites.buttonNonDiffusees, page);
            })

            //Annuler une actualité
            test.describe ('Annuler une actualité diffusée', () => {
                
                //Selectionner le titre1
                selectionActualite(aTitres[1], ' - 1 ');

                //annuler l'actualité
                test ('Button [ANNULER] - Click', async () => {
                    await fonction.clickAndWait(pageActualites.buttonAnnuler, page);
                })

                //confirmer l'annulation de l'actualité
                test ('Button [OUI] - Click', async () => {
                    await fonction.clickAndWait(pageActualites.pButtonOui, page);
                })

                test.describe ('Vérifier l\'annulation', () => {

                    //Selectionner le titre1
                    selectionActualite(aTitres[1], ' - 1 ');

                    test ('Button [MODIFIER] - Click', async () => {
                        await fonction.clickAndWait(pageActualites.buttonModifier, page);
                    });

                    var nomPopin:string = 'Modification d\'une actualité'.toUpperCase();
                    test.describe ('Popin [' + nomPopin + ']', async () => {

                        //vérifier l'absence du bouton enregistrer
                        test ('Button [ENREGISTRER] - Is Not Visible', async () => {
                            await expect(pageActualites.parentButtonAcutalitesDiffusees).toBeVisible();
                        })

                        //vérifier la présence du message "Diffusion annulée le XX/XX/XXXX à XX:XX par [...]"
                        test ('Label ["Diffusion annulée le XX/XX/XXXX à XX:XX par [...]"] - Is NOT Empty', async () => {
                            await expect(pageActualites.messageAnnulation).not.toBeEmpty();
                        })

                        test ('Button [FERMER] - Click', async () => {
                            await fonction.clickAndWait(pageActualites.fermerPopin, page);
                        });

                        test ('Popin [' + nomPopin + '] - Is Not Visible', async () => {
                            await fonction.popinVisible(page, nomPopin, false);  
                        })    

                    })
                    
                    //Selectionner le titre1
                    selectionActualite(aTitres[1], ' - 3 ');

                    test ('Label [DATE ET HEURE D\'ANNULATION] - Is Not Empty', async () => {
                        await expect(pageActualites.tdDateHeureAnnulation).not.toBeEmpty();
                    })

                    //déselectionner l'actualité déjà annulée
                    selectionActualite(aTitres[1], ' - 4 ');

                })

            })
            
            //annuler les actualités 2 et 3
            test.describe ('Annuler plusieurs actualités', () => {

                //Sélectionner les actualités 2 et 3
                for (let i = 2; i < aTitres.length; i++) {
                    selectionActualite(aTitres[i]);
                }
                
                //Vider le filtre
                test ('Filtre [TITRE] - Clear', async () => {
                    //await fonction.sendKeys(pageActualites.inputFiltreTitre, '', false, 'Valeur Recherchée')
                    await pageActualites.inputFiltreTitre.clear();
                    await fonction.wait(page, 250);
                })

                //annuler les actualités
                test ('Button [ANNULER] - Click', async () => {
                    await fonction.clickAndWait(pageActualites.buttonAnnuler, page);
                })

                //confirmer l'annulation de l'actualité
                test ('Button [OUI] - Click', async () => {
                    await fonction.clickAndWait(pageActualites.pButtonOui, page);
                })

            })

        })
        
    })

    //Connexion magasin responsable de programme
    test ('Connexion (Responsable de rayon)', async () => {
        await fonction.changeProfilByRole(info.appli, 'RESPONSABLE RAYON', page);
    })

    test.describe ('Page [ACCUEIL] - Responsable', async () => {

        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if (isVisible) {
                await menu.removeArlerteMessage(page);
            } else {
                log.set('Link [BROWSER SECURITY WARNING] - Click: ACTION ANNULEE');
                test.skip();
            }
        })

    })    

    test.describe ('Vérifier l\'annulation', () => {

        test ('ListBox [MAGASIN] = "' + sMagasin + '"', async() => {
            await fonction.selectOption(accueilActualites.selectMagasin, sMagasin);
            await fonction.wait(page, 250)
        })

        test ('Input Filtre [RECHERCHER] = "' + aTitres[1] + '"' , async() => {
            await fonction.sendKeys(accueilActualites.inputRecherche, aTitres[1], false, 'Valeur Recherchée');
            await fonction.clickAndWait(accueilActualites.buttonRechercher, page);
        })

        test ('Label [ACTUALITE ANNULEE] - Is Visible', async() => {
            await expect(accueilActualites.overlayMessageAnnulee).toBeVisible();
        })

    })

    test.describe ('Archiver une actualité diffusée', () => {

        test ('ListBox [MAGASIN] = "' + sMagasin + '"', async() => {
            await fonction.selectOption(accueilActualites.selectMagasin, sMagasin);
            await fonction.wait(page, 250)
        })

        test ('Input Filtre [RECHERCHER] = "' + aTitres[0], async() => {
            await fonction.sendKeys(accueilActualites.inputRecherche, aTitres[0], false, 'Valeur Recherchée');
            await fonction.clickAndWait(accueilActualites.buttonRechercher, page);
        })  
        
        test ('Button [ARCHIVER] - Click', async() => {
            await fonction.clickAndWait(accueilActualites.buttonArchiver, page);
        })
    
    })

    test.describe('Iteration #2 - Répartiteur', () => {
        
        //Connexion répartiteur pour annuler l'actualité archiver
        test ('Connexion répartiteur', async () => {
            await fonction.changeProfilByRole(info.appli, 'REPARTITEUR', page);
        })

        test.describe ('Page [ACCUEIL] - Repartiteur', async () => {

            test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
                await fonction.waitTillHTMLRendered(page);
                var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
                if (isVisible) {
                    await menu.removeArlerteMessage(page);
                } else {
                    log.set('Link [BROWSER SECURITY WARNING] - Click: ACTION ANNULEE');
                    test.skip();
                }
            });

        });

        test.describe ('Page [AUTORISATIONS]', () => {
            var pageName:string = 'autorisations'

            test ('Page [AUTORISATIONS] - Click', async () => {
                await menu.click(pageName, page);
            })

            test.describe ('Onglet [ACTUALITE]', async () => {

                test ('Onglet [ACTUALITE]', async () => {
                    await menu.clickOnglet(pageName, 'actualite', page)
                })

                test ('Message [ERREUR] - Is Not Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);
                });

                // Cliquer sur le bouton "non diffusées" pour afficher seulement les actualités diffusées
                test ('Button [DIFFUSEES] - Click', async () => {
                    await fonction.clickAndWait(pageActualites.buttonNonDiffusees, page);
                })

            })

            //Annuler l'actualité archivée
            test.describe ('Annuler une actualité - 2', () => {
                    
                //Selectionner le titre
                selectionActualite(aTitres[0]);

                //annuler l'actualité
                test ('Button [ANNULER] - Click', async () => {
                    await fonction.clickAndWait(pageActualites.buttonAnnuler, page);
                })

                //confirmer l'annulation de l'actualité
                test ('Button [OUI] - Click', async () => {
                    await fonction.clickAndWait(pageActualites.pButtonOui, page);
                })

            })

        })

    })

    test.describe('Iteration #2 - Responsable de rayon', () => {

        //Connexion magasin responsable de programme
        test ('Connexion (Responsable de rayon)', async () => {
            await fonction.changeProfilByRole(info.appli, 'RESPONSABLE RAYON', page);
        })

        test.describe ('Page [ACCUEIL] - Responsable', async () => {

            test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
                await fonction.waitTillHTMLRendered(page);
                var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
                if (isVisible) {
                    await menu.removeArlerteMessage(page);
                } else {
                    log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                    test.skip();
                }
            })

        })

        test.describe ('Vérifier que l\'actualité archivée puis annulée s\'affiche', () => {

            test ('ListBox [MAGASIN] = "' + sMagasin + '"', async() => {
                await fonction.selectOption(accueilActualites.selectMagasin, sMagasin);
                await fonction.wait(page, 250)
            })

            test ('Input Filtre [RECHERCHER] = "' + aTitres[0], async() => {
                await fonction.sendKeys(accueilActualites.inputRecherche, aTitres[0], false, 'Valeur Recherchée');
                await fonction.clickAndWait(accueilActualites.buttonRechercher, page);
            })

            test ('Label [ACTUALITE ANNULEE] - Is Visible', async() => {
                await expect(accueilActualites.overlayMessageAnnulee).toBeVisible();
            })

        })

    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})
