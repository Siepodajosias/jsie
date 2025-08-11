/**@helpers
 * @author JC CALVIERA
 * @since 2024-01-10
 * 
 */
const xRefTest      = "ACH_ACH_COM";
const xDescription  = "Ajout Commentaires Global + Articles";
const xIdTest       =  3146;
const xVersion      = "3.3";

var info = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest, 
    help        : [],           
    params      : ['rayon'],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { test, type Page}   from '@playwright/test';

import { Help }             from '@helpers/helpers';
import { TestFunctions }    from '@helpers/functions';
import { Log }              from '@helpers/log';

//-- PageObject ----------------------------------------------------------------------
import { MenuAchats }       from '@pom/ACH/menu.page'; 
import { PageAchAchFour }   from '@pom/ACH/achats_achats-fournisseurs.page';

//------------------------------------------------------------------------------------
let page                : Page;
let menu                : MenuAchats;
let pageFournisseur     : PageAchAchFour;

const log               = new Log();
const fonction          = new TestFunctions(log);

fonction.recordDatas();

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
     page               = await browser.newPage();
     menu               = new MenuAchats(page, fonction);
     pageFournisseur    = new PageAchAchFour(page); 
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});
  
//------------------------------------------------------------------------------------ 

const sCharPermis       = "0123 #{[|456789. azertyuiopq sdfgh&é'(-è_çà)=> \\ ; § % $ £ /*-+çà~ ";
const sRayon            = fonction.getInitParam('rayon', 'Fruits et légumes');
//------------------------------------------------------------------------------------    

var oData:any           = fonction.importJdd();                 // Récupération du JDD et des données du E2E en cours si ils existent

if (oData !== undefined) {                                      // On est dans le cadre d'un E2E. Récupération des données temporaires
    var sNumAchatE2E = oData.sNumAchatLong;                      // L'élément recherché est le numéro d'achat préalablement créé dans le E2E
    var sNumAchCours = sNumAchatE2E.substr(8);                  // Récupération du numero cours de l'achat                     
    log.set('E2E - Numéro Achat en Cours : ' + sNumAchCours);   
}

//------------------------------------------------------------------------------------

function getCommentaire(sPrefixe:string):string {
    var random_string   = sPrefixe + ' ' ;//+ fonction.getToday() + ' ';       
    var string_length = Math.floor((fonction.random() * 50) + 1); 
    for(let i = 0; i < string_length; i++) {
        random_string += sCharPermis[Math.floor((fonction.random() * sCharPermis.length))];
    }
    return random_string;        
}

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', async () => {  
    
    test('- Start -', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    });

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async () => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACHATS]', async() => {

        var pageName = 'achats';

        test('ListBox [RAYON] = "' + sRayon + '"', async() => {                    
            await menu.selectRayonByName(sRayon, page);
        })

        test ('Page [ACHATS] - Click', async() => {
            await menu.click(pageName, page);
        })

        test ('Onglet [ACHATS AUX FOURNISSEURS] - Click', async() =>{
            await menu.clickOnglet(pageName, 'achatsAuxFournisseurs', page);
        })

        test ('MultiSelect [ACHETEURS][Tous] - Click', async() => {
            await fonction.clickElement(pageFournisseur.multiSelectAcheteur);
            await fonction.clickElement(pageFournisseur.multiSelectAllChoices);
            await fonction.clickElement(pageFournisseur.multiSelectClose);
            await fonction.wait(page, 500);                                             // On attend le raffraîchissement de la liste
        })        

        test ('Liste [ACHATS][rnd/specific] - Click', async() => {

            if (oData !== undefined) {                                                  // Si un numéro d'achat est présent dans les données temporaires (E2E), on sélectionne cette cible

                log.set('Numéro d\'Achat Cible : ' + oData.sNumAchatLong);
                await fonction.sendKeys(pageFournisseur.multiSelectAchat, sNumAchCours, false,'Numéro d\'Achat Cible');
                var eCible  = page.locator('[title="' + oData.sNumAchatLong + '"]');        // Ligne Cible de l'achat cible     
                await fonction.clickElement(eCible);

            } else {                                                                    // Sinon on clique sur une ligne aléatoire

                var iNbLignes = await pageFournisseur.trLignesAcheteurs.count();
                var rnd = Math.floor(fonction.random() * iNbLignes);
                log.set('Click Ligne #' + rnd + '/' + iNbLignes);
                await fonction.clickElement(pageFournisseur.trLignesAcheteurs.nth(rnd));

                log.separateur();
                const aDatas = await pageFournisseur.trLignesAcheteurs.nth(rnd).locator('td').count();
                for(let iCpt = 0; iCpt < aDatas; iCpt++) {
                    log.set('Colonne #' + iCpt + ' : ' + await pageFournisseur.trLignesAcheteurs.nth(rnd).locator('td').nth(iCpt).textContent());
                }
                log.separateur();
            }

        })

        test ('Button [MODIFIER LE COMMENTAIRE DE L\'ACHAT] - Click', async() => {
            await fonction.clickAndWait(pageFournisseur.buttonModifierCommAchat, page);      
        })

        var sNomPopin = "Commentaire sur le bon de commande";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

            test('InputField [COMMENTAIRE GLOBAL] = "rnd"', async() => {
                var sComGlobal  = getCommentaire('TA Commentaire Global');
                log.set('Commentaire global : ' + sComGlobal);
                await fonction.sendKeys(pageFournisseur.pPcommInputGlobal, sComGlobal, false, 'Commentaire Global');            

            })
            
            test('InputField [COMMENTAIRE ARTICLE][x] = "rnd"', async() => {
                var iNbCommentaires = await pageFournisseur.pPcommInputGArticles.count();                
                log.set('Nb commentaires : ' + iNbCommentaires);

                for(let iCpt = 0; iCpt < iNbCommentaires; iCpt++) {
                    var sComArticle = getCommentaire('TA Commentaire Article');
                    log.set('Commentaire #' + (iCpt + 1) + ' - ' + sComArticle);
                    await fonction.sendKeys(pageFournisseur.pPcommInputGArticles.nth(iCpt), sComArticle, false, 'Commentaire Article');
                }

            })

            test('Button [ENREGISTRER] - Click', async() => {
                await fonction.clickElement(pageFournisseur.pPcommButtonEnregistrer);
            })

        })

    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

}) 