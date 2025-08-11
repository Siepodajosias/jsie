/**
 * @desc Ajouter des exceptions aux règles d'appartenance
 * 
 * @author JOSIAS SIE
 *  Since 2024-09-24
 */

const xRefTest      = "PRI_MAG_GEA";
const xDescription  = "Ajouter des exceptions aux règles d'appartenance d'un groupe de magasin";
const xIdTest       =  9496;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRICING',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon','nomGroupe','critere','magasinInclus','magasinExclu'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, expect, type Page }    from '@playwright/test';

import { TestFunctions }              from "@helpers/functions";
import { Log }                        from "@helpers/log";
import { Help }                       from '@helpers/helpers';

import { GestionsMagasinPage }        from '@pom/PRI/gestions_magasins.page';
import { MenuPricing }                from '@pom/PRI/menu.page.js';
import { AutoComplete, CartoucheInfo }from '@commun/types';

//----------------------------------------------------------------------------------------

let page        : Page;
let menuPage    : MenuPricing;

let pageGestMag : GestionsMagasinPage;

const log       = new Log();
const fonction  = new TestFunctions(log);

//----------------------------------------------------------------------------------------

var oData:any         = fonction.importJdd();

const sRayon          = fonction.getInitParam('rayon','Fruits et légumes');
var   sNomGroupeMg    = fonction.getInitParam('nomGroupe', ''); 
const sCritere        = fonction.getInitParam('critere','Stratégie,Enseigne,Plateforme');
var   sMagasinInclus  = fonction.getInitParam('magasinInclus', ''); 
var   sMagasinExclu   = fonction.getInitParam('magasinExclu', '');

//----------------------------------------------------------------------------------------

if (oData !== undefined) {  
	var sNomGroupeE2E = oData.sNomGroupe // L'élément recherché est le nom du groupe de magasin préalablement créé dans le E2E
	sNomGroupeMg      = sNomGroupeE2E

	log.set('Nom du groupe de magasin : '+ sNomGroupeMg);
}

const aRegle          = fonction.getLocalConfig('regleAppartenance');

sMagasinInclus        = sMagasinInclus ? sMagasinInclus : 'TA_lieu vente. ' + fonction.getToday('FR');
sMagasinExclu         = sMagasinExclu ? sMagasinExclu : 'TA_lieu vente. ' + fonction.getToday('FR',-1);
//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menuPage        = new MenuPricing(page, fonction);
    pageGestMag     = new GestionsMagasinPage(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [GESTION DES MAGASINS]', async () => {    

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menuPage.selectRayonByName(sRayon, page);      // Sélection du rayon
            log.set('Rayon : ' + sRayon);
        })

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })

        var sNomPage = 'gestion';
        test('Onglet [GROUPE DE MAGASINS] - Click', async () => {
            await menuPage.click(sNomPage, page);
        })

        test.describe('Div [GESTION MAGASINS]', async () => {

            test('InputField [NOM DU GROUPE] = "' + sNomGroupeMg + '"', async () => {
                await fonction.sendKeys(pageGestMag.inputNomGroupeMag, sNomGroupeMg, false, 'Nom groupe magasin');
            })
    
            test('Td [NOM DU GROUPE] = "' + sNomGroupeMg + '" - Check', async () => {
                var sNom = await pageGestMag.tdNomMagasinSelectionnable.first().textContent();
                expect(sNom).toBe(sNomGroupeMg);
            })
    
            test('Td [NOM DU GROUPE] - Click', async () => {
                await fonction.clickElement(pageGestMag.tdNomMagasinSelectionnable.first());
            })
    
            test('Button [MODIFIER] - Click', async () => {
                await fonction.clickElement(pageGestMag.buttonGroupeMagasin);
            })
        })

        var sNomPopin:string = 'CREATION D\'UN GROUPE';
        test.describe('Popin [' + sNomPopin + ']', async () => {

            test('Popin [' + sNomPopin + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            }) 

            test.describe ('Fieldset [EXCEPTIONS A LA REGLES]', () => {

                test('Input [MAGASINS INCLUS] - Check', async () => {
                     var sTexte = await pageGestMag.pInputMagasinInclus.inputValue();
                     expect(sTexte).toEqual("");
                })

                test('Input [MAGASINS EXCLU] - Check', async () => {
                     var sTexte = await pageGestMag.pInputMagasinExclu.inputValue();
                     expect(sTexte).toEqual("");
                })

                test('Input [MAGASINS INCLUS] ['+ sMagasinInclus +']', async () => {
                    var oDataMag:AutoComplete = {
                        libelle         :'MAGASINS A INCLUS',
                        inputLocator    : pageGestMag.pInputMagasinInclus,
                        inputValue      : sMagasinInclus,
                        choiceSelector  : '.p-autocomplete-items li',
                        choicePosition  : 0,
                        typingDelay     : 100,
                        waitBefore      : 500,
                        page            : page
                    }
                    await fonction.autoComplete(oDataMag);
                })

                test('Input [MAGASINS EXCLU] ['+ sMagasinExclu +']', async () => {
                    var oDataMag:AutoComplete = {
                        libelle         : 'MAGASINS A EXCLU',
                        inputLocator    : pageGestMag.pInputMagasinExclu,
                        inputValue      : sMagasinExclu,
                        choiceSelector  : '.p-autocomplete-items li',
                        choicePosition  : 0,
                        typingDelay     : 100,
                        waitBefore      : 500,
                        page            : page
                    }
                    await fonction.autoComplete(oDataMag);
                })
            })

            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageGestMag.pButtonGroupeEnregistrer, page);
            })

            test('Popin [' + sNomPopin + '] - Is Not Visible', async () => { 
                await fonction.popinVisible(page, sNomPopin, false);
            })
        })

        test.describe('Div [GESTION MAGASINS][FILTRE]', async () => {

            test('InputField [NOM DU GROUPE] = "' + sNomGroupeMg + '"', async () => {
                await fonction.sendKeys(pageGestMag.inputNomGroupeMag, sNomGroupeMg, false, 'Nom groupe magasin');
            })
    
            test('Td [NOM DU GROUPE] = "' + sNomGroupeMg + '" - Check', async () => {
                var sNom = await pageGestMag.tdNomMagasinSelectionnable.first().textContent();
                expect(sNom).toBe(sNomGroupeMg);
            })
    
            test('Td [NOM DU GROUPE] - Click', async () => {
                await fonction.clickElement(pageGestMag.tdNomMagasinSelectionnable.first());
            })
    
            test('Button [SELECTIONNES] - Check', async () => {
                await fonction.clickAndWait(pageGestMag.buttonSelectionnes, page);
            })

            //-- Vérifier que les magasins selectionnés sont cochés;
            test('Tr [MAGASINS] [COCHE] " - Check', async () => {
                var iNbre = await pageGestMag.pPaginatorGroupeMagasin.count();
                for(let i = 0; i < iNbre; i++){
                    await fonction.clickElement(pageGestMag.pPaginatorGroupeMagasin.nth(i));
                    var iNbrMagasin = await pageGestMag.dataListeMagasinSelectable.count();
                    for(let i = 0; i < iNbrMagasin; i++){
                        const iNbrCheckbox = await pageGestMag.checkBoxMagasins.nth(i).count();
                        expect(iNbrCheckbox).toEqual(1);
                    }
                }
            })

            //-- Vérifier que les magasins selectionnés sont surlignés;
            test('Tr [MAGASINS] [SURLIGNES] " - Check', async () => {
                var iNbre = await pageGestMag.pPaginatorGroupeMagasin.count();
                for(let i = 0; i < iNbre; i++){
                    await fonction.clickElement(pageGestMag.pPaginatorGroupeMagasin.nth(i));
                    var iNbrMagasin = await pageGestMag.dataListeMagasinSelectable.count();
                    for(let i = 0; i < iNbrMagasin; i++){
                        const tdLigneSelectionnes = pageGestMag.dataListeMagasinSelectable.nth(i);
                        await expect(tdLigneSelectionnes).toHaveAttribute('data-p-highlight', 'true');
                    }
                }
            })

            //-- Vérification des règles d'appartenance sur les magasins selectionnés;
            test('Td [MAGASINS] [REGLES N°1] " - Check', async () => {
                var iNbre = await pageGestMag.pPaginatorGroupeMagasin.count();
                for(let i = 0; i < iNbre; i++){
                    await fonction.clickElement(pageGestMag.pPaginatorGroupeMagasin.nth(i));
                    var iNbrMagasin = await pageGestMag.dataListeMagasinSelectable.count();
                    for(let i = 0; i < iNbrMagasin; i++){
                        const texte = await pageGestMag.dataListeMagasinSelectable.locator('td.col-strategie').nth(i).textContent();
                        var regle   = aRegle['Stratégie']
                        expect(texte).toEqual(regle[0]);
                    }
                }
            })

            //-- Vérification des règles d'appartenance sur les magasins selectionnés;
            test('Td [MAGASINS] [REGLES N°2] " - Check', async () => {
                var iNbre = await pageGestMag.pPaginatorGroupeMagasin.count();
                for(let i = 0; i < iNbre; i++){
                  await fonction.clickElement(pageGestMag.pPaginatorGroupeMagasin.nth(i));
                  var iNbrMagasin = await pageGestMag.dataListeMagasinSelectable.count();
                  for(let i = 0; i < iNbrMagasin; i++){
                      const texte = await pageGestMag.dataListeMagasinSelectable.locator('td.col-enseigne').nth(i).textContent();
                      var regle   = aRegle['Enseigne']
                      expect(texte).toEqual(regle[0]);
                  }
                }
            })

            //-- Vérifier que tous les règles d'appartenance sont appelées;
            test('Div [REGLES D\'APPARTENANCE] " - Check', async () => {
                var sTextes = await pageGestMag.pAlertReglesAppartenance.textContent();
                var aCritere= sCritere.split (',');
                aCritere.forEach((critere: any) => {
                    var sValeurRegle = aRegle[critere];
                    expect(sTextes).toContain(sValeurRegle[0]);
                })
                expect(sTextes).toContain(sMagasinInclus);
                expect(sTextes).toContain(sMagasinExclu);
            })

            //-- Recuperation du groupe de magasin inclus. 
            test.describe('Div [GESTION MAGASINS][INCLUS]', async () => {
                test('Input [ABREVIATION] = "' + sMagasinInclus + '"', async () => {
                    await fonction.sendKeys(pageGestMag.thAbreviation, sMagasinInclus, false, 'Désignation du lieu de vente');
                })
    
                test('Td [ABREVIATION] - Check', async () => {
                    const sTexte = await pageGestMag.dataListeMagasinSelectable.locator('td.col-abreviation').textContent();
                    expect(sTexte).toEqual(sMagasinInclus);
                })
    
                //-- Vérifier que le magasin selectionné est cochés;
                test('Tr [MAGASINS] [COCHE] " - Check', async () => {
                    await fonction.isDisplayed(pageGestMag.checkBoxMagasins.first());
                })

                //-- Vérifier que les magasins selectionnés sont surlignés;
                test('Tr [MAGASINS] [SURLIGNES] " - Check', async () => {
                    const tdLigneSelectionnes = pageGestMag.dataListeMagasinSelectable;
                    await expect(tdLigneSelectionnes).toHaveAttribute('data-p-highlight', 'true');
                })
            })

            //-- Recuperation du groupe de magasin exclus. 
            test.describe('Div [GESTION MAGASINS][EXCLUS]', async () => {
                test('Input [ABREVIATION] = "' + sMagasinExclu + '"', async () => {
                    await fonction.sendKeys(pageGestMag.thAbreviation, sMagasinExclu, false, 'Désignation du lieu de vente');
                })
    
                test('Tr [LISTE MAGASIN] - Check', async () => {
                    const sTexte = await pageGestMag.dataListeMagasinSelectable.count();
                    expect(sTexte).toEqual(0);
                })
            })
        })
    })  //-- End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})