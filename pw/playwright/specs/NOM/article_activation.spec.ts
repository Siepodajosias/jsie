/**
 * 
 * @description Activation d'un article
 * 
 * @author JC CALVIERA
 *  Since 2023-11-15
 */

const xRefTest      = "NOM_ART_ABL";
const xDescription  = "Activation d'un Article";
const xIdTest       =  1596;
const xVersion      = '3.2';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'NOMENCLATURE',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['codeArticle'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}       from '@playwright/test';

import { TestFunctions }        from "@helpers/functions";
import { Log }                  from "@helpers/log";
import { EsbFunctions }         from "@helpers/esb";
import { Help }                 from '@helpers/helpers';

import { MenuNomenclature }     from "@pom/NOM/menu.page";
import { Article }              from "@pom/NOM/articles.page";

import { CartoucheInfo, TypeEsb } from '@commun/types';

//----------------------------------------------------------------------------------------

let page        : Page;

let menu        : MenuNomenclature;
let pageNom     : Article;
let esb         : EsbFunctions;

let bStatut     : boolean;

const log       = new Log();
const fonction  = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const codeArticle   = fonction.getInitParam('codeArticle');     // Récupération via fichier conf local par défaut

//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page        = await browser.newPage(); 
    esb         = new EsbFunctions(fonction);
    menu        = new MenuNomenclature(page, fonction);
    pageNom     = new Article(page);
    bStatut     = false;            // Auucune action à faire par défaut
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']' , () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        fonction.setTartTime(testInfo); 
        await helper.init();
    });

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ARTICLE]', async () => {    

        var currentPage  = 'articles';

        test('Page [ARTICLE] - Click', async () => {
            await menu.click(currentPage, page); 
        })
              
        test('InputField [ARTICLE] = "' + codeArticle + '"', async () => {
            await fonction.sendKeys(pageNom.inputArticle, codeArticle);
        })

        test('Button [RECHERCHER] - Click', async () => {
            await fonction.clickAndWait(pageNom.buttonRechercher, page);
        })

        test('CheckBox [ARTICLE][0] - Click', async () => {
            await fonction.clickElement(pageNom.tdListeResultats.nth(0));
        })

        test('Button [MODIFIER] - Click', async () => {
            await fonction.clickAndWait(pageNom.buttonModifier, page);
        })

        var sNomPopin = "Modification de l'article " + codeArticle;
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {            

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            })

            test('Button [ACTIF] - Activation', async () => {

                const sStatut = await pageNom.pPmodifArtButtonActif.getAttribute('class');

                if (sStatut !== null) {              

                    if(sStatut.match(/bg-primary/gi) == null) {
                        bStatut = true;
                        log.set('Statut actuel bouton ACTIF : DESACTIVE');    
                        await fonction.clickElement(pageNom.pPmodifArtButtonActif);   
                        log.set('-> Activation bouton ACTIF');                          
                    } else {                       
                        log.set('Statut actuel bouton ACTIF  : ACTIF');    
                    }
                }

            })

            test('Button [ACHETABLE] - Activation', async () => {

                const sStatut = await pageNom.pPmodifArtButtonAchat.getAttribute('class');

                if (sStatut !== null) {              

                    if(sStatut.match(/bg-primary/gi) == null) {
                        bStatut = true;
                        log.set('Statut actuel bouton ACHETABLE : DESACTIVE');    
                        await fonction.clickElement(pageNom.pPmodifArtButtonAchat);   
                        log.set('-> Activation bouton ACHETABLE');                          
                    } else {                       
                        log.set('Statut actuel bouton ACHETABLE : ACTIF');    
                    }
                }

            }) 

            test('Button [COMMANDABLE] - Activation', async () => {

                const sStatut = await pageNom.pPmodifArtButtonCommand.getAttribute('class');

                if (sStatut !== null) {              

                    if(sStatut.match(/bg-primary/gi) == null) {
                        bStatut = true;
                        log.set('Statut actuel bouton COMMANDABLE : DESACTIVE');    
                        await fonction.clickElement(pageNom.pPmodifArtButtonCommand);   
                        log.set('-> Activation bouton COMMANDABLE');                          
                    } else {                       
                        log.set('Statut actuel bouton COMMANDABLE : ACTIF');    
                    }
                }

            }) 
            
            test('Button [VENDABLE] - Activation', async () => {

                const sStatut = await pageNom.pPmodifArtButtonVend.getAttribute('class');

                if (sStatut !== null) {              

                    if(sStatut.match(/bg-primary/gi) == null) {
                        bStatut = true;
                        log.set('Statut actuel bouton VENDABLE : DESACTIVE');    
                        await fonction.clickElement(pageNom.pPmodifArtButtonVend);   
                        log.set('-> Activation bouton VENDABLE');                          
                    } else {                       
                        log.set('Statut actuel bouton VENDABLE : ACTIF');    
                    }
                }

            })             

            test('Button [ENREGSITRER] - Click', async () => {  

                if (bStatut) {
                    // Enregistrement
                    await fonction.clickElement(pageNom.pPmodifArtButtonEnreg);
                } else {
                    log.set('Aucun Enregistrement Réalisé');
                    await fonction.clickElement(pageNom.pPmodifArtLinkAnnuler);
                }

            })

            test('Button [OUI] - Click (Optionnel)', async () => {  

                if (bStatut) {
                    // Affichage conditionnel message de demande de confirmation
                    await fonction.wait(page, 2000);
                    const bIsMessageVisible = await pageNom.pPmodifArtButtonOui.isVisible({timeout:1000});
                    if (bIsMessageVisible) {
                        await fonction.clickAndWait(pageNom.pPmodifArtButtonOui, page);
                    }
                } else {
                    test.skip();
                }

            })

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            })

        })

    })

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

    test('** CHECK FLUX **', async () =>  {

        if (bStatut) {

            const oFlux:TypeEsb = { 
                FLUX : [
                    {
                        NOM_FLUX    : "Diffuser_Article",
                        TITRE       : 'Article N°' + codeArticle
                    }, 
                    {
                        NOM_FLUX    : "EnvoyerDataArticle_VIF",
                        TITRE       : 'Article N°' + codeArticle
                    }, 
                    {
                        NOM_FLUX    : "EnvoyerArticle_Axelor",
                        TITRE       : 'Article N°' + codeArticle
                    }, 
                    {
                        NOM_FLUX    : "EnvoyerArticle_Concu",
                        TITRE       : 'Article N°' + codeArticle
                    }, 
                    {
                        NOM_FLUX    : "EnvoyerArticle_Don",
                        TITRE       : 'Article N°' + codeArticle
                    }, 
                    {
                        NOM_FLUX    : "EnvoyerArticle_Qualite",
                        TITRE       : 'Article N°' + codeArticle
                    }, 
                    {
                        NOM_FLUX    : "EnvoyerArticle_Mag",
                        TITRE       : 'Article N°' + codeArticle
                    }, 
                    {
                        NOM_FLUX    : "EnvoyerArticle_Pricing",
                        TITRE       : 'Article N°' + codeArticle
                    }, 
                    {
                        NOM_FLUX    : "EnvoyerArticle_Prepa",
                        TITRE       : 'Article N°' + codeArticle
                    }, 
                    {
                        NOM_FLUX    : "EnvoyerArticle_Repart",
                        TITRE       : 'Article N°' + codeArticle
                    }, 
                    {
                        NOM_FLUX    : "EnvoyerArticle_Stock",
                        TITRE       : 'Article N°' + codeArticle
                    }, 
                    {
                        NOM_FLUX    : "EnvoyerArticle_Achat",
                        TITRE       : 'Article N°' + codeArticle
                    } 
                ],
                WAIT_BEFORE     : 10000,                // Optionnel
            };

            await esb.checkFlux(oFlux, page);

        } else {

            log.set('Check Flux : ACTION ANNULEE');
            test.skip();

        }

    });
   
});