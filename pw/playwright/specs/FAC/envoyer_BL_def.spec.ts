/**
 * 
 * @author Siaka KONE
 * @since 2024-01-24
 * 
 */

const xRefTest      = "FAC_LIR_BLD";
const xDescription  = "Envoyer les bons de livraison définitifs";
const xIdTest       =  82;
const xVersion      = '3.2';

var info = {
    desc        : xDescription,
    appli       : 'FAC',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateformeReception','rayon','groupeArticle','listeMagasins','listeArticles','nbMagExterne'],
    fileName    : __filename
};


import { expect, test, type Page }              from '@playwright/test';
import { Help }                                 from '@helpers/helpers';
import { TestFunctions }                        from '@helpers/functions';

import { EffectuesLivraisonRelles }             from '@pom/FAC/livraisons_effectues-livraisons_reelles.page';
import { MenuFacturation }                      from '@pom/FAC/menu.page';
import { Log }                                  from '@helpers/log';


let page                                        : Page;
let menu                                        : MenuFacturation;
let effectuesLivraisonRelles                    : EffectuesLivraisonRelles;

const log               = new Log();
const fonction          = new TestFunctions(log);
//------------------------------------------------------------------------------------
var oData:any           = fonction.importJdd(); //Import du JDD pour le bout en bout  
//------------------------------------------------------------------------------------
var sPtfDistribution    = fonction.getInitParam('plateformeDistribution', 'Chaponnay');
const sRayon            = fonction.getInitParam('rayon', 'Fruits et légumes');
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Fruits et légumes');
const aListeVilles      = fonction.getInitParam('listeMagasins', '');
var   aCodesArticlesE2E = fonction.getInitParam('listeArticles', '');
const sNbMagExterne     = fonction.getInitParam('nbMagExterne', '0');

const sRayonGroupeArt       = sRayon + ' - ' + sGroupeArticle;
const iNbMagasin            = aListeVilles.length;

var  iNbMagSansLesExternes:any;
if(typeof(sNbMagExterne) === 'string'){
    iNbMagSansLesExternes = iNbMagasin - parseInt(sNbMagExterne);
}else{
    iNbMagSansLesExternes = iNbMagasin - sNbMagExterne;
}           

 // Solution de contournement : lorsque la casse est différente d'une appli à une autre (Ex pour SugLog et Sudlog)
// Au final le problème reste sur Sudlog  ==> forcage
if (sPtfDistribution == 'SudLog 10°') { 
    sPtfDistribution = 'Sudlog 10°';
}

// La chaîne de la liste des magasins doit être transformée en tableau pour pouvoir être traitée.
aCodesArticlesE2E = aCodesArticlesE2E.split(',');

//--------------------------------------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                        = await browser.newPage();
    menu                        = new MenuFacturation(page, fonction);
    effectuesLivraisonRelles    = new EffectuesLivraisonRelles(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//--------------------------------------------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    if(oData !== undefined) {                                  // On est dans le cadre d'un E2E. Récupération des données temporaires
        var aCodesArticles      = Object.keys(oData.aLots);       
        log.set('E2E - Liste des articles : ' + aCodesArticles);     
    }

    test.describe ('Page [LIVRAISONS EFFECTUEES]', async () => {

        let sCurrentPage = 'livEffectuees';

        test ('Page [LIVRAISONS PREVUES]', async () => {
            await menu.click(sCurrentPage, page);
        });

        test ('Onglet [LIVRAISONS REELLES] - Click', async () => {
            await menu.clickOnglet(sCurrentPage, 'livraisonsRelles', page);
        });

        test ('ListBox [PLATEFORME] ="' + sPtfDistribution + '"', async () => {
            await menu.selectPlateformeByLabel(sPtfDistribution, page);
        });

        test ('ListBox [RAYON - GROUPE ARTICLE] ="' + sRayonGroupeArt + '"', async() => {
            await menu.selectRayonGroupeArticle(sRayon,sGroupeArticle, page);
        });

        if (aCodesArticlesE2E[0] != "") { // Cas du E2E
            
            test.describe ('Recherche [BL] articles répartis', async () => {
            
                aCodesArticlesE2E.forEach((sCodeArticle:string) => {

                    test ('InputField [SEARCH ARTICLE] ="' + sCodeArticle + '"', async () => {
                        await fonction.sendKeys(effectuesLivraisonRelles.inputSearchArticle, sCodeArticle, false, 'Code Article');
                        await fonction.wait(page, 500);
                    });
    
                    test ('Button [RECHERCHER][' + sCodeArticle + '] - Click', async () => {
                        await fonction.clickAndWait(effectuesLivraisonRelles.buttonRechercher, page);
                    });
                    
                    aListeVilles.forEach((nomVille : string) =>{
                        test ('InputField [SEARCH MAGASIN][' + sCodeArticle + '] ="' + nomVille + '"', async () => {
                            await fonction.sendKeys(effectuesLivraisonRelles.inputSearchMagasin, nomVille, false, 'Lieu de Vente');
                            await fonction.wait(page, 500);
                        });
        
                        test ('Button [RECHERCHER][' + sCodeArticle + '][' + nomVille + '] - Click', async () => {
                            await fonction.clickAndWait(effectuesLivraisonRelles.buttonRechercher, page);
                        });  

                        test ('Check [BL][' + sCodeArticle + ' - Designation][' + nomVille + '] existe', async () => {
                            var sColonneArticle = await page.locator('tbody tr td').nth(4).textContent();
                            sColonneArticle     = sColonneArticle.trim();
                            const iNombreBl = await page.locator('tbody tr td[title="' + sColonneArticle + '"]').count();
                            expect(iNombreBl).toBe(1);
                        });
                    });
                });
            });

            test.describe ('Envoyer la facturation', async () => {

                test ('Button [ENVOYER LA FACTURATION] - Click', async () => {
                    await fonction.clickAndWait(effectuesLivraisonRelles.buttonEnvoyerFacturation, page); 
                });
        
                var sNomPopin = 'Résultat du lissage de marge'
                test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {
        
                    test ('Popin [' + sNomPopin.toUpperCase() + ']  - Is Visible', async () => {
                        await fonction.popinVisible(page, sNomPopin, true);
                    });

                    test ('Button [ENVOYER LA TARIFICATION] - Click', async () => {
                        await fonction.clickAndWait(effectuesLivraisonRelles.pPconfirmationEnvoi, page); //confirmation de l'envoi
                    });

                    test ('** Wait Until Spinner Off **', async () => {
                        var iDelaiTest = 120000;
                        test.setTimeout(iDelaiTest);
                        expect(effectuesLivraisonRelles.pPspinner).not.toBeVisible({timeout:iDelaiTest});
                    })

                    test ('Count [NB REPONSES] - Check', async () => {
                        const iNbMagLiss = await effectuesLivraisonRelles.pPlissageDesignMagasins.count();
                        expect(iNbMagLiss).toBe(iNbMagSansLesExternes);
                    });

                    test ('Button [FERMER] - Click', async () => {
                        await fonction.clickAndWait(effectuesLivraisonRelles.pPlissageButtonFermer, page);
                    });

                    test ('Popin [' + sNomPopin.toUpperCase() + ']  - Is Not Visible', async () => {
                        await fonction.popinVisible(page, sNomPopin, false);
                    });

                });

            });

        } else {
            log.set('BL non transmis');
        }
        
    });

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
    
});
