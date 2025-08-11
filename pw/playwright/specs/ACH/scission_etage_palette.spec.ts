/**
 * 
 * 
 * @author JC CALVIERA
 * @since 2024-04-09
 * 
 */
const xRefTest      = "ACH_REF_COL";
const xDescription  = "Modifier le colisage d'un article (étage palette)";
const xIdTest       =  2972;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc    : xDescription,
    appli   : 'ACH',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : [],
    params  : ['groupeArticle', 'fournisseur', 'idArticle'],
    fileName: __filename
};

//------------------------------------------------------------------------------------

import { test, type Page, expect }  from '@playwright/test';

import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';

import { MenuAchats }               from '@pom/ACH/menu.page';

import { PageRefArt }               from '@pom/ACH/referentiel_articles.page';

import { AutoComplete, CartoucheInfo } from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;

let pageRef         : PageRefArt;

const log           = new Log();
const fonction      = new TestFunctions(log);

fonction.recordDatas();

//------------------------------------------------------------------------------------

const sGroupeArticle= fonction.getInitParam('groupeArticle', 'Fruits et légumes');
const sFournisseur  = fonction.getInitParam('fournisseur', 'Pom\'alpes');
const sArticle      = fonction.getInitParam('idArticle', '7374');     //'8096,8089,8136,8070,8062,8140,8071,8060,8088,8079,8110,8100,8086,8105'

const sRayon        = 'Fruits et légumes';

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    pageRef         = new PageRefArt(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    let iNbCouches:number;
    let aCouches:any=[];
    let sColisParCouche:string;
    let sCouches:string;
    
    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test ('ListBox [RAYON] = "' + sRayon + '"', async () => {
        await menu.selectRayonByName(sRayon, page);
    })

    test.describe ('Page [REFERENTIEL]', () => {

        var sPageName = 'referentiel';
    
        test ('Page [REFERENTIEL] - Click', async () => {
            await menu.click(sPageName, page); 
        })
       
        test ('Error Message - Is Hidden', async () =>  {
            await fonction.isErrorDisplayed(false, page);                                   // Pas d'erreur affichée à priori au chargement de la page
        })

        test ('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async() => {
            await fonction.selectOption(pageRef.listBoxGroupeArticle, sGroupeArticle, 'Groupe Article');
        })

        test ('InputField [ARTICLE] = "' + sArticle + '"', async() => {
            var oData:AutoComplete = {
                libelle         :'ARTICLE',
                inputLocator    : pageRef.inputFiltreArticle,
                inputValue      : sArticle,
                //choiceSelector  :'button.dropdown-item',
                choicePosition  : 0,
                typingDelay     : 100,
                waitBefore      : 500,
                page            : page,
            };
            await fonction.autoComplete(oData);
        })

        test ('InputField [FOURNISSEUR] = "' + sFournisseur + '"', async() => {
            var oData:AutoComplete = {
                libelle         :'FOURNISSEUR',
                inputLocator    : pageRef.inputFiltreFournisseur,
                inputValue      : sFournisseur,
                //choiceSelector  :'button.dropdown-item',
                choicePosition  : 0,
                typingDelay     : 100,
                waitBefore      : 500,
                page            : page,
            };
            await fonction.autoComplete(oData);
        })

        test ('Button [RECHERCHER] - Click', async () => {
            await fonction.clickElement(pageRef.buttonRechercher);
        })

        test ('CheckBox [ARTICLE][0] - Click', async () => {
            await fonction.clickElement(pageRef.checkBoxListeArticles.first());
        })

        test ('Button [MODIFIER] - Click', async () => {
            await fonction.clickElement(pageRef.buttonModifier);
        })

        var sNomPopin   = "Modification de l'article xxx";        
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

            test ('Popin [' + sNomPopin + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
            })

            test ('Error Message - Is Hidden', async () =>  {
                await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la page
            })

            test ('CheckBox [CONDITIONNEMENT][0] - Click', async() => {
                const sLibelleConditionnement = await pageRef.pPmodifTdDesignation.first().textContent();
                log.set('Libellé sélectionné : ' + sLibelleConditionnement);
                await fonction.clickElement(pageRef.pPmodifTdDesignation.first());

                await fonction.addDataSheet('CheckBox', 'Conditionnement', sLibelleConditionnement);

                const sLibellePaletisation = await pageRef.pPmodifTdPaletisation.first().textContent();
                log.set('Paletisation Initiale : ' + sLibellePaletisation);
            })

            test ('Pictogram [ETAGES PALETTES] - Click', async() => {
                await fonction.clickElement(pageRef.pPmodifPictoEtagesPalettes);
            })

            var sNomPopover = "Saisie des étages";
            test.describe ('Popover [' + sNomPopover.toUpperCase() + '] >', async() => {

                test ('Popover [' + sNomPopover.toUpperCase() + '] - Visible', async() => {    
                    await expect(pageRef.pPmodifCondSaisiPopover).toBeVisible();                                        
                })

                test ('Button [AJOUTER UN ETAGE] - Click', async() => {

                    sColisParCouche = await pageRef.pPmodifCondSaisiInputCPC.first().inputValue();
                    sCouches = await pageRef.pPmodifCondSaisiInputCouche.first().inputValue();
                    await fonction.clickElement(pageRef.pPmodifCondSaisiPButtAjout);

                    iNbCouches = parseInt(sCouches);

                    if (iNbCouches == 1) {
                        iNbCouches = 2;     // Sécurité pour éviter de spliter des 0.5 x 2
                    }
            
                    if (iNbCouches%2 == 0) {
                        aCouches[0] = iNbCouches / 2;
                        aCouches[1] = iNbCouches / 2;
                    } else {
                        aCouches[0] = (iNbCouches / 2) + 0.5;
                        aCouches[1] = (iNbCouches / 2) - 0.5;
                    }

                })

                test ('Input Field [ETAGE 1]', async() => {
                    await fonction.sendKeys(pageRef.pPmodifCondSaisiInputCouche.nth(0), aCouches[0]);
                    log.set('--- Nouvelle Palettisation ---');
                    log.set('Etage 1 : ' + sColisParCouche + 'x' + aCouches[0]); 
                })

                test ('Input Field [ETAGE 2]', async() => {
                    await fonction.sendKeys(pageRef.pPmodifCondSaisiInputCouche.nth(1), aCouches[1]);
                    log.set('--- Nouvelle Palettisation ---');
                    log.set('Etage 2 : ' + sColisParCouche + 'x' + aCouches[1]); 
                })

                test ('Button [VALIDER] - Click', async () => {
                    await fonction.clickElement(pageRef.pPmodifCondSaisiButtValider);
                })

                test.skip ('Button [AJOUTER] - Click', async () => {
                    await fonction.clickElement(pageRef.pPmodifButtonAjouter);
                })

                test ('Button [ENREGISTRER ET FERMER] - Click', async () => {
                    await fonction.clickElement(pageRef.pPmodifButtonEnregEtFermer);
                })

            }); // Popover

            test ('Popin [' + sNomPopin + '] - Is Hidden', async () => {
                await fonction.popinVisible(page, sNomPopin.toUpperCase(), false);
            })

        }); //-- Popin

    })  // End Describe Page

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})