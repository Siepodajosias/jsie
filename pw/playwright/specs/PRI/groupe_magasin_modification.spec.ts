/**
 * @desc Modification des règles d'appartenance
 * 
 * @author JOSIAS SIE
 *  Since 2024-09-17
 */

const xRefTest      = "PRI_MAG_MRA";
const xDescription  = "Modification des règles d'appartenance d'un groupe de magasin";
const xIdTest       =  9499;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRICING',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon','nomGroupe','critere','critereModifier','critereAjouter','critereSupprimer','critereEgalite'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, expect, type Page }from '@playwright/test';

import { TestFunctions }          from "@helpers/functions";
import { Log }                    from "@helpers/log";
import { Help }                   from '@helpers/helpers';

import { GestionsMagasinPage }    from '@pom/PRI/gestions_magasins.page.js';
import { MenuPricing }            from '@pom/PRI/menu.page.js';
import { CartoucheInfo }          from '@commun/types';

//----------------------------------------------------------------------------------------

let page        : Page;
let menuPage    : MenuPricing;

let pageGestMag : GestionsMagasinPage;

const log       = new Log();
const fonction  = new TestFunctions(log);

//----------------------------------------------------------------------------------------
var oData:any           = fonction.importJdd();

const sRayon            = fonction.getInitParam('rayon','Fruits et légumes');
var   sNomGroupeMg      = fonction.getInitParam('nomGroupe', ''); 
const sCritere          = fonction.getInitParam('critere','Stratégie,Enseigne,Plateforme');
const sModifierCritere  = fonction.getInitParam('critereModifier','Stratégie');
const sAjoutCritere     = fonction.getInitParam('critereAjouter','Pays');
const sSupprimeCritere  = fonction.getInitParam('critereSupprimer','Enseigne');
const sEgaliteCritere   = fonction.getInitParam('critereEgalite','Plateforme');

const aRegles           = fonction.getLocalConfig('regleAppartenance');
var aRegle              = ['égal à','différent de']
const sRegle            =  aRegles[sModifierCritere];
const aRegleModification= [sRegle[1], aRegles[sAjoutCritere], aRegles[sEgaliteCritere]];
//----------------------------------------------------------------------------------------

if (oData !== undefined) {  
	var sNomGroupeE2E   = oData.sNomGroupe; // L'élément recherché est le nom du groupe de magasin préalablement créé dans le E2E
	sNomGroupeMg        = sNomGroupeE2E;

	log.set('Nom du groupe de magasin : '+ sNomGroupeMg);
}

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
            await menuPage.selectRayonByName(sRayon, page);  // Sélection du rayon
            log.set('Rayon : ' + sRayon);
        })

        test('Label [ERREUR] - Is Not Visible', async () => {// Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })

        var sNomPage = 'gestion';
        test('Onglet [GROUPE DE MAGASINS] - Click', async () => {
            await menuPage.click(sNomPage, page);
        })

        test.describe ('Div [GESTION MAGASINS]', async () => {

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
        test.describe ('Popin [' + sNomPopin + ']', async () => {

            test('Popin [' + sNomPopin + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            }) 

            test.describe ('Fieldset [REGLES D\'APPARTENANCE]', () => {
				var aCritere  = sCritere.split (',');
				aCritere.forEach((critere: any) => {
                    var iIndex= aCritere.indexOf(critere);

                    test('P-dropdown [REGLES D\'APPARTENANCE] ['+iIndex+'] - Click', async () => {
                        var sTexte = await pageGestMag.pPdropdownCritereLabel.locator('span.label-critere').allInnerTexts();
                        for(let i = 0; i < aCritere.length; i++){
                            expect(sTexte).toContain(critere);
                        }
                    })
				})

                // -- Modifier une nouvelle règle d'appartenance;

                test('P-multiselect [REGLES A MODIFIER] - Click', async () => {
                    var iNbr  = await pageGestMag.pPdropdownCritereLabel.locator('span.label-critere').count();
                    for(let i = 0; i < iNbr; i++){
                        var sTexte= await pageGestMag.pPdropdownCritereLabel.locator('span.label-critere').nth(i).textContent();
                        if(sTexte == sModifierCritere){
                            await fonction.clickElement(pageGestMag.pPdropdownCritereLabel.locator('[formcontrolname="valeurs"]').nth(i));
                            await fonction.clickElement(pageGestMag.pPmultiselectItemRegle.locator('.p-checkbox-icon'));

                            await fonction.sendKeys(pageGestMag.pInputPmultiselectFiltre, sRegle[1], false, 'Regle');
                            await pageGestMag.pPmultiselectItemRegle.first().waitFor({state:'visible'});
                            await fonction.clickElement(pageGestMag.pPmultiselectItemRegle);
                            await fonction.clickElement(pageGestMag.pPmultiselectClose);
                        }
                    }
                })

                // -- Ajouter une nouvelle règle d'appartenance;

                test('P-dropdown [CRITERE] = ['+sAjoutCritere+']', async () => {
                    await fonction.clickElement(pageGestMag.pDropdownCritere.first());

                    await pageGestMag.pDropdownitemCritere.first().waitFor({state:'visible'});
                    await fonction.clickElement(pageGestMag.pDropdownitemCritere.locator('span:text-is("'+sAjoutCritere+'")'));
                })

                test('Button [AJOUTER UN CRITERE] - Click', async () => {
                    await fonction.clickElement(pageGestMag.pButtonAjouterCritere);
                })

                test('P-multiselect [REGLE] ="' + aRegles[sAjoutCritere] + '"', async () => {
                    var iNbr = await pageGestMag.pPdropdownCritereLabel.locator('span.label-critere').count();
                    if(sAjoutCritere == 'Plateforme'){
                        await fonction.clickElement(pageGestMag.pPmultiselectFiliere);
                        await pageGestMag.pPmultiselectItemFiliere.first().waitFor({state:'visible'});
                        var regleFiliere = aRegles['filière'];
                        await fonction.clickElement(pageGestMag.pPmultiselectItemFiliere.locator('span:text-is("'+regleFiliere[0]+'")'));
                    }

                    for(let i = 0; i < iNbr; i++){
                        var sTexte= await pageGestMag.pPdropdownCritereLabel.locator('span.label-critere').nth(i).textContent();
                        if(sTexte == sAjoutCritere){
                            await fonction.clickElement(pageGestMag.pPdropdownCritereLabel.locator('[formcontrolname="valeurs"]').nth(i));
                            var regle = aRegles[sAjoutCritere];
                            await fonction.sendKeys(pageGestMag.pInputPmultiselectFiltre, regle[0], false, 'Critère');
                            await pageGestMag.pPmultiselectItemRegle.first().waitFor({state:'visible'});
                            await fonction.clickElement(pageGestMag.pPmultiselectItemRegle);
                            await fonction.clickElement(pageGestMag.pPmultiselectClose);
                        }
                    }
                })

                // -- Supprimer une règle d'appartenance;

                test('P-multiselect [REGLES A SUPPRIMER] - Click', async () => {
                    var iNbr  = await pageGestMag.pPdropdownCritereLabel.locator('span.label-critere').count();
                    for(let i = 0; i < iNbr; i++){
                        var sTexte= await pageGestMag.pPdropdownCritereLabel.locator('span.label-critere').nth(i).textContent();
                        if(sTexte == sSupprimeCritere){
                            await fonction.clickElement(pageGestMag.pPdropdownCritereLabel.locator('i.fa-times').nth(i));
                            break;
                        }
                    }
                })

                test('P-multiselect [REGLE D\'EGALITE] ['+sEgaliteCritere+'] - Click', async () => {
                    var iNbr  = await pageGestMag.pPdropdownCritereLabel.locator('span.label-critere').count();
                    for(let i = 0; i < iNbr; i++){
                        var sTexte= await pageGestMag.pPdropdownCritereLabel.locator('span.label-critere').nth(i).textContent();
                        if(sTexte == sEgaliteCritere){
                            var sTexte = await pageGestMag.pPdropdownCritereTypeComparaison.locator('span').nth(i).textContent();
                            var regle= aRegle[0];
                            if(sTexte== regle){
                                regle= aRegle[1];
                            }
                            await fonction.clickElement(pageGestMag.pPdropdownCritereTypeComparaison.nth(i));
                            await pageGestMag.pPdropdownItemCritereType.first().waitFor({state:'visible'});
                            await fonction.clickElement(pageGestMag.pPdropdownItemCritereType.locator('span:text-is("'+regle+'")'));
                        }
                    }
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
    
            test('Button [SELECTIONNES] - Click', async () => {
                await fonction.clickAndWait(pageGestMag.buttonSelectionnes, page);
            })

            //-- Vérifier que les magasins selectionnés sont cochés;
            test('Tr [MAGASINS] [COCHE] " - Check', async () => {
                var iNbre = await pageGestMag.pPaginatorGroupeMagasin.count();
                for(let i = 0; i < iNbre; i++){
                    await fonction.clickElement(pageGestMag.pPaginatorGroupeMagasin.nth(i));
                    var iNbrMagasin = await pageGestMag.dataListeMagasinSelectable.count();
                    for(let i = 0; i < iNbrMagasin; i++){
                        await fonction.isDisplayed(pageGestMag.checkBoxMagasins.nth(i));
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

            //-- Vérifier que tous les règles d'appartenance sont appelées;
            test('Div [REGLES D\'APPARTENANCE] " - Check', async () => {
                var sTextes = await pageGestMag.pAlertReglesAppartenance.textContent();
                aRegleModification.forEach((sValeurs: string) => {
                   expect(sTextes).toContain(sValeurs.toString());
                })
            })

            //-- Vérification des règles d'appartenance sur les magasins selectionnés;
            test('Td [MAGASINS] [REGLES N°1] " - Check', async () => {
                var iNbre = await pageGestMag.pPaginatorGroupeMagasin.count();
                for(let i = 0; i < iNbre; i++){
                    await fonction.clickElement(pageGestMag.pPaginatorGroupeMagasin.nth(i));
                    const sTexte = await pageGestMag.dataListeMagasinSelectable.locator('td.col-strategie').allTextContents();
                    expect(sTexte.toString()).toContain(sRegle.toString());
                }
            })

            //-- Vérification des règles d'appartenance sur les magasins selectionnés;
            test('Td [MAGASINS] [REGLES N°2] " - Check', async () => {
                var iNbre  = await pageGestMag.pPaginatorGroupeMagasin.count();
                var regle = aRegles['Enseigne'];
                for(let i = 0; i < iNbre; i++){
                    await fonction.clickElement(pageGestMag.pPaginatorGroupeMagasin.nth(i));
                    var iNbrMagasin= await pageGestMag.dataListeMagasinSelectable.count();
                    for(let i = 0; i < iNbrMagasin; i++){
                        var sTexte = await pageGestMag.dataListeMagasinSelectable.locator('td.col-enseigne').nth(i).textContent();
                        expect(sTexte).toEqual(regle[0]);
                    }
                }
            })
        })
    })  //-- End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})