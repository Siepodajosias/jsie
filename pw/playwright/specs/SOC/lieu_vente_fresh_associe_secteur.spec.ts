/**
 * 
 * @author JOSIAS SIE
 * @since 2025-06-11
 *  
 */
const xRefTest      = "SOC_ORG_ALF";
const xDescription  = "Associer un lieu de vente Fresh à un secteur";
const xIdTest       = 9930;
const xVersion      = '3.2';
    
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'SOCIETES',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['codeLieuVente','groupeArticle','directionExploitation'],
    fileName    : __filename
}

//------------------------------------------------------------------------------------

import { test, type Page }            from '@playwright/test';

import { Help }                       from '@helpers/helpers';
import { TestFunctions }              from '@helpers/functions';
import { Log }                        from '@helpers/log';

import { MenuSociete }                from '@pom/SOC/menu.page';
import { PageOrganisation }           from '@pom/SOC/organisation.page';

import { AutoComplete, CartoucheInfo }from '@commun/types/index';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuSociete;

let pageOrganisation    : PageOrganisation;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------ 

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuSociete(page, fonction);    
    pageOrganisation    = new PageOrganisation(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

var oData:any         = fonction.importJdd();

var sCodeLieuDeVente  = fonction.getInitParam('codeLieuVente', '');  
var sDirectionExp     = fonction.getInitParam('directionExploitation','Fresh.');
var sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Frais LS,Coupe / Corner,Fruits et Légumes,Fraiche découpe,Marée,Consommable,Sac,Boucherie,Charcuterie,Traiteur de la terre,Traiteur de la mer');

//------------------------------------------------------------------------------------    

if (oData !== undefined) {                           // On est dans le cadre d'un E2E. Récupération des données temporaires
    sCodeLieuDeVente        =  oData.sCodeLieuDeVente// Récupération du code du lieu de vente fresh
    log.set('E2E - Code Lieu de Vente : ' + sCodeLieuDeVente); 
}

var oCodeEntite = {
    'Consommable': ['CR', 'FL', 'GIE'],
    'Sac': ['CR', 'FL', 'GIE'],
    'Traiteur de la terre': ['PO'],
    'Traiteur de la mer': ['PO']
}

//------------------------------------------------------------------------------------ 

test.describe.serial ('[' + xRefTest + ']', () => {

    test('Ouverture URL :' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test('Message [ERREUR] - Is Not Visible', async () => {
        await fonction.isErrorDisplayed(false, page);         // Pas d'erreur affichée à priori au chargement de la page 
    })

    test.describe ('Page [ORGANISATION]', async () => {    

        var pageName:string = 'organisation';

        test("Menu [CLIENTS] - Click ", async () => {
            await menu.click(pageName, page);
        })

        test('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);   // Pas d'erreur affichée à priori au chargement de la page 
        })

        test('Input [FILTRE][ACCEDER A] = '+ sDirectionExp, async () => {
            await fonction.sendKeys(pageOrganisation.inputAccederA, sDirectionExp, false, 'Accéder à');
            log.set("Direction d'exploitation : " + sDirectionExp);
        })
 
        test('Span [ICON][PLUS][DIRECTIONEXPLOITATION] - Click', async () => {
            await fonction.wait(page, 350);
            await fonction.clickAndWait(pageOrganisation.boutonPlus, page);
        })

        test('Span [ICON][PLUS][REGION] - Click', async () => {
            await fonction.clickAndWait(pageOrganisation.boutonPlus, page);
        })

        test('Icon [ V ][Secteur] - Click', async () => {
            await fonction.clickElement(pageOrganisation.secterIconChevronDown.locator('chevrondownicon').nth(0));
        })

        test('Link [AJOUTER LIEU DE VENTE] - Click', async () => {
            await fonction.clickElement(pageOrganisation.iconAjouterLieuDeVente);
            await fonction.waitTillHTMLRendered(page);
        })

        var sNomPopin:string = "Ajout d'un lieu de vente";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {           
            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            })

            test('InputField [AUTOCOMPLETE][LIEU DE VENTE] = "' + sCodeLieuDeVente + '"', async () => {
                var oData:AutoComplete = {
                    libelle         :'LIEU DE VENTE',
                    inputLocator    : pageOrganisation.pPalvAutoCompleteLDV,
                    inputValue      : sCodeLieuDeVente,
                    choiceSelector  : 'ngb-typeahead-window button',
                    choicePosition  : 0,
                    typingDelay     : 150,
                    waitBefore      : 1000,
                    page            : page,
                }
                
                await fonction.autoComplete(oData);
            })

            test.describe ('Datagrid [GROUPE ARTICLE CONSOLIDES]', async () => {
                const aGroupearticle = sGroupeArticle.split(',');
                for (const gpeArticle of aGroupearticle) {
                    test(`Tr [GROUPES ARTICLES] [${gpeArticle}]`, async () => {
                        await fonction.sendKeys(pageOrganisation.pTdGroupeArticle, gpeArticle, false, 'Groupe Article');
                        await fonction.wait(page, 800);

                        if (oCodeEntite[gpeArticle] && oCodeEntite[gpeArticle].length > 0) {
                           for (const pourEntite of oCodeEntite[gpeArticle]) {
                               await fonction.sendKeys(pageOrganisation.pTdPourEntite, pourEntite, false, 'Pour entité');
                               await fonction.wait(page, 800);
                               await fonction.clickAndWait(pageOrganisation.pTrGroupeArticleClde, page);
                               log.set(`Groupe article : ${gpeArticle} (${pourEntite})`);
                               await pageOrganisation.pTdPourEntite.clear();
                            }
                        } else {
                          await fonction.clickAndWait(pageOrganisation.pTrGroupeArticleClde, page);
                        }
                    })
                }
            })

            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageOrganisation.pPalvButtonEnregistrer, page);
            })

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
               await fonction.popinVisible(page, sNomPopin, false);
            }) 
        })

    })  //-- End Describe Page

    test('Déconnexion', async() => {
        await fonction.deconnexion(page);
    })
})  //-- End Describe
