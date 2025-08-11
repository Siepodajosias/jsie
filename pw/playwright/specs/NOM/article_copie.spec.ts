/**
 * 
 * @description Copier un article
 * 
 * @author JC CALVIERA
 *  Since 2023-11-15
 */

const xRefTest      = "NOM_ART_COP";
const xDescription  = "Copier un article";
const xIdTest       =  1592;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'NOMENCLATURE',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['codeArticle','typeArticle'],
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

import { AutoComplete, CartoucheInfo, TypeEsb } from '@commun/types';

//----------------------------------------------------------------------------------------

let page        : Page;

let menu        : MenuNomenclature;
let pageNom     : Article;
let esb         : EsbFunctions;

let sLibelle    : string|null;

const log       = new Log();
const fonction  = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const codeArticle   = fonction.getInitParam('codeArticle', '5300');
const typeArticle   = fonction.getInitParam('typeArticle', 'FL');

//----------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
    page        = await browser.newPage(); 
    esb         = new EsbFunctions(fonction);
    menu        = new MenuNomenclature(page, fonction);
    pageNom     = new Article(page);
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe ('[' + xRefTest + '] - ' + xDescription , () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        fonction.setTartTime(testInfo); 
        await helper.init();
    });

    test('Ouverture URL', async() => {
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
        
        test('InputField [AUTOCOMPLETE][ARTICLE] = "' + codeArticle + '"', async () => {
                    
            var oData:AutoComplete = {
                libelle         :'ARTICLE',
                inputLocator    : pageNom.inputArticle,
                inputValue      : codeArticle,
                choiceSelector  :'button.dropdown-item.ng-star-inserted',
                choicePosition  : 0,
                typingDelay     : 100,
                waitBefore      : 500,
                page            : page,
            };
            await fonction.autoComplete(oData);
        })

        test('Button [RECHERCHER] - Click', async () => {
            await fonction.clickAndWait(pageNom.buttonRechercher, page);
        })

        test ('CheckBox [ARTICLE][0] - Click', async () => {
            await fonction.clickElement(pageNom.tdListeResultats.first());
            sLibelle = 'TA_' + typeArticle + '-' + codeArticle + '-' + await pageNom.tdListeResultats.first().textContent() + '_' + Math.floor(fonction.random() * 1000 );
            log.set('Nom article : ' + sLibelle);
        })

        test ('Button [COPIER] - Click', async () => {
            await fonction.clickAndWait(pageNom.buttonCopier, page);
        })

        var sNomPopin = "Création de l'article";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {            

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            })

            test('InputField [AUTOCOMPLETE][CODE ARTICLE][0] = ""', async () => {
                    
                var oData:AutoComplete = {
                    libelle         :'Code ARTICLE',
                    inputLocator    : pageNom.pPmodifArtInputCodeArt,
                    inputValue      : '',                                   // On envoi une chaîne vide afin de déclencher le déroulement de la liste de propositions
                    choiceSelector  :'button.dropdown-item.active',
                    choicePosition  : 0,
                    typingDelay     : 100,
                    waitBefore      : 500,
                    page            : page,
                };
                await fonction.autoComplete(oData);
            })

            test ('InputField [DESIGNATION ARTICLE]',async () => {
                await fonction.sendKeys(pageNom.pPmodifArtInputLibArt, <string>sLibelle);
            })

            test ('Button [ENREGISTRER ET COPIER] - Click', async () => {
                await fonction.clickAndWait(pageNom.pPcreationButtonEnrCopy, page);
            })

            test ('Link [ANNULER] - Click', async () => {
                await fonction.clickElement(pageNom.pPmodifArtLinkAnnuler);
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

        const oFlux:TypeEsb = { 
            FLUX : [
                {
                    NOM_FLUX    : "Diffuser_Article",
                    TITRE       : 'Article N°'
                },  
                {
                    NOM_FLUX    : "EnvoyerArticle_Concu",
                    TITRE       : 'Article N°'
                }, 
                {
                    NOM_FLUX    : "EnvoyerArticle_Don",
                    TITRE       : 'Article N°'
                }, 
                {
                    NOM_FLUX    : "EnvoyerArticle_Don",
                    TITRE       : 'Article N°'
                }, 
                {
                    NOM_FLUX    : "EnvoyerArticle_Qualite",
                    TITRE       : 'Article N°'
                }, 
                {
                    NOM_FLUX    : "EnvoyerArticle_Externe",
                    TITRE       : 'Article N°'
                }, 
                {
                    NOM_FLUX    : "EnvoyerArticle_Mag",
                    TITRE       : 'Article N°'
                }, 
                {
                    NOM_FLUX    : "EnvoyerArticle_Prefac",
                    TITRE       : 'Article N°'
                }, 
                {
                    NOM_FLUX    : "EnvoyerArticle_Pricing",
                    TITRE       : 'Article N°'
                }, 
                {
                    NOM_FLUX    : "EnvoyerArticle_Prepa",
                    TITRE       : 'Article N°'
                }, 
                {
                    NOM_FLUX    : "EnvoyerArticle_Repart",
                    TITRE       : 'Article N°'
                }, 
                {
                    NOM_FLUX    : "EnvoyerArticle_Stock",
                    TITRE       : 'Article N°'
                }, 
                {
                    NOM_FLUX    : "EnvoyerArticle_Achat",
                    TITRE       : 'Article N°'
                }, 
                {
                    NOM_FLUX    : "EnvoyerCaracteristique_Trad",
                    TITRE       : "Caractéristique : Article -"
                }, 
            ],
            WAIT_BEFORE     : 10000,                // Optionnel
        };

        await esb.checkFlux(oFlux, page);

    })
   
})