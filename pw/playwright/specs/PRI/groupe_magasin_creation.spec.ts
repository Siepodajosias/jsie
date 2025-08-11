/**
 * @desc Création d'un groupe de magasin
 * 
 * @author JOSIAS SIE
 *  Since 2024-09-16
 */

const xRefTest      = "PRI_MAG_GRA";
const xDescription  = "Création d'un groupe de magasins avec des règles d'appartenance (sans exception aux règles)";
const xIdTest       =  9489;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRICING',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon','nomGroupe','critere','pays'],
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
fonction.importJdd();

const sRayon          = fonction.getInitParam('rayon','Fruits et légumes');
var   sNomGroupeMg    = fonction.getInitParam('nomGroupe', ''); 
const sCritere        = fonction.getInitParam('critere','Stratégie,Enseigne,Plateforme');
const sPays           = fonction.getInitParam('pays','France');
sNomGroupeMg          = sNomGroupeMg ? sNomGroupeMg : 'TA_groupe_mag. ' + fonction.getToday('FR');

const sDescription    = 'Création d\'un groupe de magasins avec des règles d\'appartenance';
const iTauxCalculPvc  = 7;
const iMargePlateForme= 7.7;
const iFraisLivaison  = 7.77;

const aRegle          = fonction.getLocalConfig('regleAppartenance');
const aCriteres       = fonction.getLocalConfig('critere');
const aRegles         = ['égal à','différent de']
const sDesignation    = 'TA_lieu vente.';

var oData = {
    sNomGroupe        : ''
}

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

        var sNomPopin:string = 'CREATION D\'UN GROUPE';
        test.describe ('Popin [' + sNomPopin + ']', async () => {

            test('Button [CREER UN GROUPE DE MAGASIN] - Click', async () => {
                await fonction.clickAndWait(pageGestMag.buttonCreerGroupeMagasin, page);
            })

            test('Popin [' + sNomPopin + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            }) 

            test('Button [ENREGISTRER] - Check', async () => {
                await expect(pageGestMag.pButtonGroupeEnregistrer).toBeDisabled();
            })

            test('Button [SELECTION MANUELLE] - Check', async () => {
                await expect(pageGestMag.pPButtonSelectionManuelle).toHaveAttribute('aria-checked',"true");
            })

            test('Button [REGLES D\'APPARTENANCE] - Click', async () => {
                await fonction.clickElement(pageGestMag.pPButtonRegleAppartenance);
            })

            test('Button [ENREGISTRER] - Is Disabled', async () => {
                await expect(pageGestMag.pButtonGroupeEnregistrer).toBeDisabled();
            })

            test('InputField [NOM GROUPE MAGASIN] ="' + sNomGroupeMg + '"', async () => {
                await fonction.sendKeys(pageGestMag.pInputGroupeNom, sNomGroupeMg, false, 'Nom groupe magasin');
                oData.sNomGroupe = sNomGroupeMg;
            })

            test('InputField [MARGE PLATEFORME] ="' + iMargePlateForme + '"', async () => {
                await fonction.sendKeys(pageGestMag.pInputGroupeMargePlateforme, iMargePlateForme, false, 'Marge plateforme');
            })

            test('InputField [FRAIS LIVRAISON] ="' + iFraisLivaison + '"', async () => {
                await fonction.sendKeys(pageGestMag.pInputGroupeFraisLivraison, iFraisLivaison, false, 'Frais livraison');
            })

            test('InputField [CALCUL PVC] ="' + iTauxCalculPvc + '"', async () => {
                await fonction.sendKeys(pageGestMag.pInputGroupeTauxCalculPVC, iTauxCalculPvc, false, 'pvc');
            })

            test('InputField [PAYS DE CALCUL PVC] - Check', async () => {
                var selectorPays = pageGestMag.pLabelPaysPourCalculPVC;
                await expect(selectorPays).toHaveAttribute('aria-label', 'France');
            })

            test('InputField [PAYS DE CALCUL PVC] ="' + sPays + '"', async () => {
                var sTexte = await pageGestMag.pLabelPaysPourCalculPVC.textContent();
                if(sTexte !='France'){
                    await fonction.clickAndWait(pageGestMag.pInputPaysPourCalculPVC, page);
       
                    await pageGestMag.pInputPaysItemPourCalculPVC.first().waitFor({state:'visible'});
                    await fonction.clickElement(pageGestMag.pInputPaysItemPourCalculPVC.locator('span:text-is("'+sPays+'")'));
                }
            })

            test('InputField [DESCRIPTION] ="' + sDescription + '"', async () => {
                await fonction.sendKeys(pageGestMag.pInputGroupeDescription, sDescription, false, 'Description du groupe magasin');
            })

            test('Button [ENREGISTRER] - Is Not Active', async () => {
                await expect(pageGestMag.pButtonGroupeEnregistrer).toBeDisabled();
            })

            test('P-dropdown [CRITERE] - Check', async () => {
                await fonction.clickAndWait(pageGestMag.pDropdownCritere.first(), page);
       
                await pageGestMag.pDropdownitemCritere.first().waitFor({state:'visible', timeout: 50000});
                var sTexte        = await pageGestMag.pDropdownitemCritere.locator('span').allInnerTexts();
                for(let i = 0; i < aCriteres.length; i++){
                    expect(sTexte).toContain(aCriteres[i]);
                }
                await fonction.clickAndWait(pageGestMag.pDropdownCritere.first(), page);
            })

            test.describe ('Fieldset [REGLES D\'APPARTENANCE]', () => {
				var aCritere   = sCritere.split (',');
                var sPreCritere: string;
				aCritere.forEach((critere: any) => {
                    var sRegle= aRegle[critere];
                    var iIndex= aCritere.indexOf(critere);

                    test('P-dropdown [CRITERE] ="' + critere + '"', async () => {
                            await fonction.clickElement(pageGestMag.pDropdownCritere.first());

                            await pageGestMag.pDropdownitemCritere.first().waitFor({state:'visible'});
                            if(iIndex > 0){
                                var iNb = await pageGestMag.pDropdownitemCritere.locator('span:text-is("'+sPreCritere+'")').count();
                                expect(iNb).toEqual(0);
                            }
                            await fonction.clickElement(pageGestMag.pDropdownitemCritere.locator('span:text-is("'+critere+'")'));
                    })

                    test('Button [AJOUTER UN CRITERE] ['+iIndex+'] - Click', async () => {
                        await fonction.clickElement(pageGestMag.pButtonAjouterCritere);
                    })

                    if(iIndex == 0){
                        test('P-multiselect [REGLE] ['+iIndex+'] - Check', async () => {
                                await fonction.clickElement(pageGestMag.pPdropdownCritereTypeComparaison);
                
                                await pageGestMag.pPdropdownItemCritereType.first().waitFor({state:'visible'});
                                var sTexte= await pageGestMag.pPdropdownItemCritereType.locator('span').allInnerTexts();
                                for(let i = 0; i < aRegles.length; i++){
                                    expect(sTexte).toContain(aRegles[i]);
                                }
                        })
                    }

                    test('P-multiselect [REGLE] ="' + sRegle[0] + '"', async () => {
                        if(critere == 'Plateforme'){
                            await fonction.clickElement(pageGestMag.pPmultiselectFiliere);
                            await pageGestMag.pPmultiselectItemFiliere.first().waitFor({state:'visible'});
                            var   regle = aRegle['filière'];
                            await fonction.clickElement(pageGestMag.pPmultiselectItemFiliere.locator('span:text-is("'+regle[0]+'")'));
                        }
                        await fonction.clickElement(pageGestMag.pPmultiselectRegle.nth(iIndex));

                        await fonction.sendKeys(pageGestMag.pInputPmultiselectFiltre, sRegle[0], false, 'Regle');
                        await pageGestMag.pPmultiselectItemRegle.first().waitFor({state:'visible'});
                        await fonction.clickElement(pageGestMag.pPmultiselectItemRegle);
                        await fonction.clickElement(pageGestMag.pPmultiselectClose);
                        sPreCritere = critere;
                    })

                    if(iIndex == 0){
                        test('Button [ENREGISTRER] - Check', async () => {
                            var isActive = await pageGestMag.pButtonGroupeEnregistrer.isEnabled();
                            expect(isActive).toBe(true);
                        })
                    }
				})
			})

            test ('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageGestMag.pButtonGroupeEnregistrer, page);
            })

            test('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            })
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
    
            test('Button [SELECTIONNES] - Check', async () => {
                await fonction.clickAndWait(pageGestMag.buttonSelectionnes, page);
            })

            //-- Vérifier que les magasins selectionnés sont cochés;
            test('Tr [MAGASINS] [COCHE] " - Check', async () => {
                var iNbre  = await pageGestMag.pPaginatorGroupeMagasin.count();
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

            //-- Vérification des règles d'appartenance sur les magasins selectionnés;
            test('Td [MAGASINS] [REGLES N°1] " - Check', async () => {
                var iNbre  = await pageGestMag.pPaginatorGroupeMagasin.count();
                var regle = aRegle['Stratégie'];
                for(let i = 0; i < iNbre; i++){
                    await fonction.clickElement(pageGestMag.pPaginatorGroupeMagasin.nth(i));
                    var iNbrMagasin = await pageGestMag.dataListeMagasinSelectable.count();
                    for(let i = 0; i < iNbrMagasin; i++){
                        var sTexte  = await pageGestMag.dataListeMagasinSelectable.locator('td.col-strategie').nth(i).textContent();
                        expect(sTexte).toEqual(regle[0]);
                    }
                }
            })

            //-- Vérification des règles d'appartenance sur les magasins selectionnés;
            test('Td [MAGASINS] [REGLES N°2] " - Check', async () => {
                var iNbre  = await pageGestMag.pPaginatorGroupeMagasin.count();
                var regle = aRegle['Enseigne'];
                for(let i = 0; i < iNbre; i++){
                  await fonction.clickElement(pageGestMag.pPaginatorGroupeMagasin.nth(i));
                  var iNbrMagasin = await pageGestMag.dataListeMagasinSelectable.count();
                  for(let i = 0; i < iNbrMagasin; i++){
                      var sTexte = await pageGestMag.dataListeMagasinSelectable.locator('td.col-enseigne').nth(i).textContent();
                      expect(sTexte).toEqual(regle[0]);
                  }
                }
            })

            //-- Vérifier que tous les règles d'appartenance sont appelées;
            test('Div [REGLES D\'APPARTENANCE] " - Check', async () => {
                var sTexte  = await pageGestMag.pAlertReglesAppartenance.textContent();
				var aCritere= sCritere.split (',');
				aCritere.forEach((critere: any) => {
                    var sValeurRegle = aRegle[critere];
                    expect(sTexte).toContain(sValeurRegle[0]);
				})
            })

            //-- Vérifier que les checkBox ne peuvent pas être cocher ou décocher;
            test('CheckBox [MAGASINS] - Check', async () => {
                var iNbre = await pageGestMag.pPaginatorGroupeMagasin.count();
                for(let i = 0; i < iNbre; i++){
                    await fonction.clickElement(pageGestMag.pPaginatorGroupeMagasin.nth(i));
                    var iNbrMagasin = await pageGestMag.dataListeMagasinSelectable.count();
                    for(let i = 0; i < iNbrMagasin; i++){
                    var selector = pageGestMag.dataListeMagasinSelectable.locator('.col-selection .p-checkbox-disabled').nth(i);
                    await expect(selector).toHaveClass('p-checkbox p-component p-checkbox-disabled');
                    }
                }
            })

            //-- Vérifier que'on ne peut pas associer les magasins au groupe;
            test('Button [ASSOCIER LES MAGASINS AU GROUPE] - Check', async () => {
                await expect(pageGestMag.buttonAssocierMagasin).toBeDisabled();
            })

            //-- Vérifier que le checkBox all est coché;
            test('CheckBox [MAGASINS (TOUS LES MAGASINS)] - Check', async () => {
                await expect(pageGestMag.theadCheckBoxAllMagasin).toHaveClass('p-checkbox-box p-disabled p-highlight');
            })
            
             //-- Vérification du nombre de magasins affichés en haut et le nombre de lignes;
            test('Div [NBRE MAGASINS SELECTIONNES] - Check', async () => { 
                var sNbre  = await page.textContent('thead[role="rowgroup"] th.col-selection.text-center div.ng-star-inserted');
                var nbre   = await pageGestMag.pPaginatorGroupeMagasin.count();
                const iNbre= parseInt(sNbre.trim());
                var iNbrMagasin = null;
                for(let i = 0; i < nbre; i++){
                  await fonction.clickElement(pageGestMag.pPaginatorGroupeMagasin.nth(i));
                  iNbrMagasin += await pageGestMag.dataListeMagasinSelectable.count();
                }
                expect(iNbre).toEqual(iNbrMagasin);
            })

            //-- Recuperation des groupes de magasins créés dans Sigale Sociétés. 
            test('Input [ABREVIATION] = "' + sDesignation + '"', async () => {
                await fonction.sendKeys(pageGestMag.thAbreviation, sDesignation, false, 'Désignation du lieu de vente');
            })

            test('Td [ABREVIATION] - Check', async () => {
                let iNbrMagasin = await pageGestMag.dataListeMagasinSelectable.count();
                let dateActuelle: Date = new Date(); // Date du jour   
                const jourActuelEnTimeStamp = dateActuelle.getTime(); // Conversion en timestamp
            
                for (let i = 0; i < iNbrMagasin; i++) {
                    let sTexte = await pageGestMag.dataListeMagasinSelectable.locator('td.col-abreviation').nth(i).textContent();
                    const datePrecedent = sTexte.slice(-8); // Prend les 8 derniers caractères
                    const jour = parseInt(datePrecedent.slice(0, 2));
                    const mois = parseInt(datePrecedent.slice(2, 4)) - 1;
                    const annee = parseInt(datePrecedent.slice(4, 8));
            
                    // Création d'un objet Date à partir des valeurs extraites
                    const datePrecedenteEnTimeStamp = new Date(annee, mois, jour).getTime();
                    expect(jourActuelEnTimeStamp).toBeGreaterThan(datePrecedenteEnTimeStamp);
                }
            });            
        })

        await fonction.writeData(oData);
    })  //-- End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})