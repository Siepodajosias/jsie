/**
 * 
 * @author Siaka KONE
 * @since 2024-01-12
 * 
 */

const xRefTest      = "FAC_LIP_BLP";
const xDescription  = "Envoyer les bons de livraison prévisionnels";
const xIdTest       =  81;
const xVersion      = '3.2';

var info = {
    desc        : xDescription,
    appli       : 'FAC',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateformeReception','rayon','groupeArticle','listeMagasins'],
    fileName    : __filename
};


import { expect, test, type Page }              from '@playwright/test';
import { Help }                                 from '@helpers/helpers';
import { TestFunctions }                        from '@helpers/functions';
import { LivraisonPrevuePage}                   from '@pom/FAC/livraisons_prevues.page';
import { MenuFacturation }                      from '@pom/FAC/menu.page';
import { Log }                                  from '@helpers/log';

let page                                        : Page;
let menu                                        : MenuFacturation;
let pageLivPrev                                 : LivraisonPrevuePage;

const log               = new Log();
const fonction          = new TestFunctions(log);
//------------------------------------------------------------------------------------
var oData:any           = fonction.importJdd(); //Import du JDD pour le bout en bout  
//------------------------------------------------------------------------------------
var sPtfReception       = fonction.getInitParam('plateformeReception', 'Chaponnay'); 
const sRayon            = fonction.getInitParam('rayon', 'Fruits et légumes');
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Fruits et légumes');
const aListeVilles      = fonction.getInitParam('listeMagasins', 'Bergerac');
const sRayonGroupeArt   = sRayon + ' - ' + sGroupeArticle;

if (sPtfReception == 'SudLog 10°') { 
    sPtfReception = 'Sudlog 10°';
}

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page                    = await browser.newPage();
    menu                    = new MenuFacturation(page, fonction);
    pageLivPrev             = new LivraisonPrevuePage(page);
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper    = new Help(info, testInfo, page);
        await helper.init();
    });

    test ('Ouverture URL', async() => {
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    if(oData !== undefined) {                                  // On est dans le cadre d'un E2E. Récupération des données temporaires
        var aCodesArticles      = Object.keys(oData.aLots);
        var sNumAchatE2E        = oData.sNumAchatLong;         
        log.set('E2E - Liste des articles : ' + aCodesArticles);  
        log.set('E2E - Liste des villes : ' + aListeVilles);   
    }

    test.describe ('Page [LIVRAISONS PREVUES]', async () => {

        let sCurrentPage = 'livPrevues';

        test ('Page [LIVRAISONS PREVUES]', async () => {
            await menu.click(sCurrentPage, page);
        });

        test ('ListBox [PLATEFORME DE RECEPTION] ="' + sPtfReception + '"', async () => {
            await menu.selectPlateformeByLabel(sPtfReception, page);
        });

        test ('ListBox [RAYON - GROUPE ARTICLE] ="' + sRayonGroupeArt + '"', async() => {
            await menu.selectRayonGroupeArticle(sRayon,sGroupeArticle, page);
        });
        
        if(sNumAchatE2E != null) { // Cas du E2E

            test.describe ('Recherche [BL] articles répartis', async () => {
            
                aCodesArticles.forEach((sCodeArticle:string) => {
                    test ('InputField [SEARCH ARTICLE] ="' + sCodeArticle + '"', async () => {
                        await fonction.sendKeys(pageLivPrev.inputSearchArticle, sCodeArticle, false, 'Code Article');
                    });

                    aListeVilles.forEach((nomVille : string) => {

                        test ('InputField [SEARCH MAGASIN]['+sCodeArticle+'] ="' + nomVille + '"', async () => {
                            await fonction.sendKeys(pageLivPrev.inputSearchMagasin, nomVille, false, 'Lieu de Vente');
                        });
        
                        test ('Button [RECHERCHER]['+sCodeArticle+']['+nomVille+'] - Click', async () => {
                            await fonction.clickAndWait(pageLivPrev.buttonRechercher, page);
                        });  

                        test ('Check [BL]['+sCodeArticle+']['+nomVille+'] existe', async () => {
                            const iNombreBl = await page.locator('.p-datatable-tbody tr.ng-star-inserted td[title="'+sCodeArticle+'"]').count();
                            expect(iNombreBl).toBe(1);
                        });
                        
                    });

                });

            });
    
            test.describe ('Transmission des BL prévisionnels', function() {

                test ('Click [BUTTON] Envoi BL prev ', async () => {
                    await fonction.clickAndWait(pageLivPrev.buttonEnvoyerLivraisons, page);
                })

                test ('Pop up confirmation : envoi des BL prev du rayon '+sRayon+' pour la plateforme '+sPtfReception, async () => {
                    var alerteIsVisible = await pageLivPrev.pPconfirmationAlertMess.isVisible() ;//on attend que le message s'affiche
                    if(alerteIsVisible){
                        var messAttendu = (await pageLivPrev.pPconfirmationAlertMess.textContent()).trim();
                        const mess100 = '100% des lignes de BL prévisionnels ont un tarif magasin';
                        expect(messAttendu).toBe(mess100);
                    }
                })

                test ('Pop up confirmation [CLICK] oui ', async () => {
                    var isVisible = await pageLivPrev.pPbuttonConfirmOui.isVisible();
                    if(isVisible){
                        await fonction.clickAndWait(pageLivPrev.pPbuttonConfirmOui, page);  //confirmation de l'envoi
                        var message = await  pageLivPrev.messageConfirmation.isVisible();
                        expect(message).toBe(true);
                    }
                })

            })

        } else {
            log.set('BL non transmis');
        }
    });

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
});
