/**
 * 
 * @description Ajouter le code CEE à un article
 * 
 * @author SIAKA KONE
 *  Since 2024-05-15
 */

const xRefTest      = "NOM_ART_CCE";
const xDescription  = "Ajouter code cee";
const xIdTest       =  9282;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'NOM',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['codeArticle','caracteristique'],
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
const sCodeArticle      = fonction.getInitParam('codeArticle','E1AP');
const sCaracteristque   = fonction.getInitParam('caracteristique', 'code CEE');
//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage(); 
    esb         = new EsbFunctions(fonction);
    menu        = new MenuNomenclature(page, fonction);
    pageNom     = new Article(page);
    const helper= new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + '] - ' + xDescription , () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ARTICLE]', async () => {    

        var currentPage:string  = 'articles';

        test('Page [ARTICLE] - Click', async () => {
            await menu.click(currentPage, page); 
        })              
        
        test('InputField [AUTOCOMPLETE][ARTICLE] = "' + sCodeArticle + '"', async () => {
                    
            var oData:AutoComplete = {
                libelle         :'ARTICLE',
                inputLocator    : pageNom.inputArticle,
                inputValue      : sCodeArticle,
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
            sLibelle = sCodeArticle + ' - ' + await pageNom.tdListeResultats.first().textContent();
            log.set('Nom article : ' + sLibelle);
        })

       test ('Button [MODIFIER] - Click', async () => {
            await fonction.clickAndWait(pageNom.buttonModifier, page);
        })

        var sNomPopin:string = "Modification de l'article " + sCodeArticle;
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {            

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            })

            test('InputField [CARACTERISTIQUE] = "' + sCaracteristque + '"', async () => {
                await fonction.sendKeys(pageNom.pPmodifArtInputGlobFilt, sCaracteristque);
                await fonction.wait(page, 500);//Attendre que le flitre soit effectif;
            })

            test('Button [VALEUR] - Click', async () => {
                await fonction.clickAndWait(pageNom.pPmodifArtButtonValArt, page);
            })

            test('RadioButton [CARACTERISTIQUE] - Click', async () => {
                const iNbreCaractque:number = await pageNom.pPmodifArtRadioButton.count();
                const iRndPos = Math.floor(fonction.random()*iNbreCaractque);
                log.set('Random position : ' + iRndPos)
                await fonction.clickElement(pageNom.pPmodifArtRadioButton.nth(iRndPos));
            })

            test('Button [OK] - Click', async () => {
                await fonction.clickAndWait(pageNom.pPmodifArtButtonOk, page);
            })

            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageNom.pPmodifArtButtonEnreg, page);
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