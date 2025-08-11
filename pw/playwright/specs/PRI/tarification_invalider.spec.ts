/**
 * @desc Invalider une tarification
 * 
 * @author SIAKA KONE
 *  Since 2024-09-17
 */

const xRefTest      = "PRI_TAR_INV";
const xDescription  = "Invalider une tarification";
const xIdTest       =  4807;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRICING',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon','nombreTarif'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, expect, type Page}           from '@playwright/test';
import { CartoucheInfo }                    from '@commun/types';
import { TestFunctions }                    from '@helpers/functions';
import { Log }                              from '@helpers/log.js';
import { Help }                             from '@helpers/helpers.js';

//-- PageObject ----------------------------------------------------------------------
import { MenuPricing }                      from '@pom/PRI/menu.page';
import { TarificationPage }                 from '@pom/PRI/tarification_tarification.page';
//----------------------------------------------------------------------------------------

let page        : Page;
let menuPage    : MenuPricing;
let pageTarif   : TarificationPage;

const log       = new Log();
const fonction  = new TestFunctions(log);

let aCodeArticles:any;
let aGroupeMagasin:any;

//----------------------------------------------------------------------------------------
const sRayon            = fonction.getInitParam('rayon','Fruits et légumes');
const iNbreTarification = fonction.getInitParam('nombreTarif', 30);
//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page      = await browser.newPage(); 
    menuPage  = new MenuPricing(page, fonction);
    pageTarif = new TarificationPage(page);
    const helper = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//-----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [ACCUEIL]', async () => {   
        
        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })   

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menuPage.selectRayonByName(sRayon, page);                       // Sélection du rayon passé en paramètre
        })       
    })  //-- End Describe Page

    test.describe('Page [TARIFICATION]', async () => {   
        
        test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menuPage.selectRayonByName(sRayon, page);                       // Sélection du rayon passé en paramètre
        }) 

        test('Page [TARIFICATION] - Click', async () => {
            await menuPage.click('tarification', page);
        })

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })

        //--La date d'édition est la date du jour par défaut;
        const sDateJour:string   = fonction.getToday('FR', 0 ,' / ');
        test('DatePicker [DATE EDITION] ="' + sDateJour + '"', async () => {
            expect(await pageTarif.inputDateEdition.inputValue()).toBe(sDateJour);
        })

        test('** Wait Until Spinner Off **', async () => {
            await fonction.waitForSpinner(pageTarif.pPcalcMargeSpinner, 180000);
        })

        //--Filtrer sur les tarifications validées;
        test('CheckBox [TARIF A VALIDER] - Click x 2', async () => { 
            await fonction.clickElement(pageTarif.checkBoxStatutTarif);
            await fonction.clickElement(pageTarif.checkBoxStatutTarif);
        })

        //--Check à faire : verifier la coche tarifier et valider; *
        for(let i=0; i<15; i++) {

            test('Icon [VALIDER][' + i + '] - Check', async () => {
                await fonction.isDisplayed(pageTarif.IconAccepte.nth(i));
            })
    
            //Les champs ne sont plus saisissables;
            test('InputField [MARGE PLT, PC, MARGE MAG, PVC][' + i + '] - Are Not Visible', async () => {
                await expect(pageTarif.inputMargePtf.nth(i)).not.toBeVisible();
                await expect(pageTarif.inputPrixCessionHT.nth(i)).not.toBeVisible();
                await expect(pageTarif.inputMargeMag.nth(i)).not.toBeVisible();
                await expect(pageTarif.inputPVCTTC.nth(i)).not.toBeVisible();
            })
            
            //Vérifier que les valeurs sont en gras;
            test('td [PRIX CESSION HT][' + i + '] - Is Bold', async () => {
                await fonction.isDisplayed(pageTarif.tdPrixCessionHtGras.nth(i));
            })
    
            test('td [PVC TTC][' + i + '] - Is Bold', async () => {
                await fonction.isDisplayed(pageTarif.tdPvcTtcGras.nth(i));
            })
        }
        
        for(let i=0; i<iNbreTarification; i++) {

            test('InputField [CODE ARTICLE][' + i + '] - Type', async () => {

                if(i%15==0){ //-- Nombre de tarification par page (15);
                    aCodeArticles = await pageTarif.tdLabelCodeArticle.allInnerTexts();
                    aGroupeMagasin = await pageTarif.tdLabelGroupeMag.allInnerTexts();
                    log.set('Liste des articles : ' + aCodeArticles);
                    log.set('Liste des Groupes magasin : ' + aGroupeMagasin);
                }

                if(i>14 && i%15==0) {

                    //--Annuler les filtres appliqués à la page précédente (Article);
                    await pageTarif.inputArticle.clear();

                    //--Annuler les filtres appliqués à la page précédente (Groupe de magasin);
                    await fonction.clickElement(pageTarif.tdListeBoxGpreArticle.first());
                    await fonction.clickElement(pageTarif.pPCheckBoxAllGroupeFav);
                    await fonction.clickElement(pageTarif.pPCheckBoxAllGroupeFav);
                    await fonction.clickElement(pageTarif.pPcalcMargeIconClose);
                    await fonction.wait(page,1000);//Attendre que le filtre soit appliqué;

                    aCodeArticles = await pageTarif.tdLabelCodeArticle.allInnerTexts();
                    aGroupeMagasin = await pageTarif.tdLabelGroupeMag.allInnerTexts();
                    log.set('Liste des articles : ' + aCodeArticles);
                    log.set('Liste des Groupes magasin : ' + aGroupeMagasin);
                }

                await fonction.sendKeys(pageTarif.inputArticle, aCodeArticles[i%15], false, 'Code Article');
                await fonction.wait(page, 500);//Attendre que le filtre soit appliqué;
            })
            
            test('ListBox [GRPE MAGASIN][' + i + ']', async () => {

                if(i%15==0 ) { 

                    await fonction.clickElement(pageTarif.tdListeBoxGpreArticle.first());
                    await fonction.wait(page, 500);//Attendre que le filtre soit appliqué;

                    await fonction.clickElement(page.locator('p-multiselectitem  li span:text-is("' + aGroupeMagasin[i%15] + '")'));
                    await fonction.clickElement(pageTarif.pPcalcMargeIconClose);
                }
                
                //Nous sommes dans un cadre où le groupe de magasin a changé;
                if((i%15>0 && aGroupeMagasin[i%15] != aGroupeMagasin[(i-1)%15])) { 
                    
                    //Supprimer la selection du groupe de magasin précédent;
                    await fonction.clickElement(pageTarif.tdListeBoxGpreArticle.first());
                    await fonction.clickElement(page.locator('p-multiselectitem  li span:text-is("' + aGroupeMagasin[(i-1)%15] + '")'));
                    
                    await fonction.clickElement(page.locator('p-multiselectitem  li span:text-is("' + aGroupeMagasin[i%15] + '")'));
                    await fonction.clickElement(pageTarif.pPcalcMargeIconClose);
                }
            })

            test('Icon [INVALIDER][' + i + '] - Click', async () => {
                await pageTarif.dataGridArticlesSelectable.first().hover();
                await fonction.clickAndWait(pageTarif.buttonActionInvaliderSauvegarder.first(), page) //.first()
            })

            //-- La ligne invalidée n'apparait plus;
            test('Td [LIGNE TARIFICATION][' + i + '] - Is Not Visible', async () => {
                await fonction.sendKeys(pageTarif.inputArticle, aCodeArticles[i%15], false, 'Code Article');
                await fonction.wait(page, 500);//Attendre que le filtre soit appliqué;
                await expect(pageTarif.dataGridArticlesSelectable).not.toBeVisible();
            })

            //-- Afficher les tarifications à valider;
            test('CheckBox [STATUT TARIF][' + i + '] - Clcik', async () => {
                await fonction.clickElement(pageTarif.checkBoxStatutTarif);
                await fonction.wait(page, 500);//Attendre que le filtre soit appliqué;
            })

            //-- La ligne invalidée apparait maintenant;
            test('Td [LIGNE TARIFICATION][' + i + '] - Is Visible', async () => {
                await fonction.sendKeys(pageTarif.inputArticle, aCodeArticles[i%15], false, 'Code Article');
                await fonction.wait(page, 500);//Attendre que le filtre soit appliqué;
                await fonction.isDisplayed(pageTarif.dataGridArticlesSelectable.first());
            })  

             //-- Le PV et le PVC sont saisissables;
            test('InputField [PC, PVC][' + i + '] - Are Editable', async () => {
                await expect(pageTarif.inputPrixCessionHT.first()).toBeEditable();
                await expect(pageTarif.inputPVCTTC.first()).toBeEditable();
            })

            //--Filtrer sur les tarifications validées afin de poursuivre pour les lignes suivantes;
            test('CheckBox [TARIF A VALIDER][' + i + '] - Click x 2', async () => { 
                await fonction.clickElement(pageTarif.checkBoxStatutTarif);
                await fonction.clickElement(pageTarif.checkBoxStatutTarif);
            })
        }

    })  //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})

