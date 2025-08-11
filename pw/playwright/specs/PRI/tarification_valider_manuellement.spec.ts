/**
 * @desc Valider manuellement les tarifications
 * 
 * @author SIAKA KONE
 *  Since 2024-09-20
 */

const xRefTest      = "PRI_TAR_VAL";
const xDescription  = "Valider manuellement les tarifications";
const xIdTest       =  7229;
const xVersion      = '3.6';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRICING',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, expect, type Page}from '@playwright/test';
import { CartoucheInfo }         from '@commun/types';
import { TestFunctions }         from '@helpers/functions';
import { Log }                   from '@helpers/log.js';
import { Help }                  from '@helpers/helpers.js';

//-- PageObject ----------------------------------------------------------------------

import { MenuPricing }           from '@pom/PRI/menu.page';
import { TarificationPage }      from '@pom/PRI/tarification_tarification.page';

//----------------------------------------------------------------------------------------

let page        : Page;
let menuPage    : MenuPricing;
let pageTarif   : TarificationPage;

const log       = new Log();
const fonction  = new TestFunctions(log);

//----------------------------------------------------------------------------------------
const sRayon    = fonction.getInitParam('rayon','Fruits et légumes');
//----------------------------------------------------------------------------------------

let iNbreTarif:number;
let aCodeArticles:any;
let aGroupeMagasin:any;

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
        
        test('Page [TARIFICATION] - Click', async () => {
            await menuPage.click('tarification', page);
        })

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })

        //Vérifier que par défaut je suis sur la date du jour;
        const sDateJour:string   = fonction.getToday('FR', 0 ,' / ');
        test('DatePicker [DATE EDITION] ="' + sDateJour + '"', async () => {
            expect(await pageTarif.inputDateEdition.inputValue()).toBe(sDateJour);
        })

        test('** Wait Until Spinner Off **', async () => {
            await fonction.waitForSpinner(pageTarif.pPcalcMargeSpinner.first())
        })

        //Vérifier que j'ai plusieurs pages de tarification à valider;
        test('Button [PAGINATION] >= 2', async () => {
            expect(await pageTarif.buttonNbrePage.count()).toBeGreaterThanOrEqual(2);
        })

        //Vérifier que par défaut je suis sur la première page;
        test('Button [PAGINATION] = 1', async () => {
            await expect(pageTarif.buttonNbrePage.first()).toHaveAttribute('aria-current','page');
        })

        //Vérifier que la prémière ligne de la tarification est selectionnée;
        test('Tr [TARIFICATIONS] - Check', async () => {//Ce bloc est à revoir, car il est en déphasage avec les nouvelles modifications sur la fonction (menuPage.click) 
            await expect(pageTarif.tableBody.first()).toHaveAttribute('data-p-highlight', 'true');
            //Vérifier que le curseur est par défaut sur le champ PVC TTC de la première ligne;
            const isFocused = await pageTarif.inputPVCTTC.nth(0).evaluate((pvcttc) => document.activeElement === pvcttc);
            await fonction.wait(page, 500);
            expect(isFocused).toBe(true);
        })

        //Nombre de ligne par page par défaut (15);
        test('Tr [NOMBRE DE LIGNE] - Check', async () => {
            expect(await pageTarif.inputPVCTTC.count()).toBe(15);
        })

        test('Get Liste article et Groupe magasin', async () => {
            aCodeArticles = await pageTarif.tdLabelCodeArticle.allInnerTexts();
            aGroupeMagasin = await pageTarif.tdLabelGroupeMag.allInnerTexts();
            log.set('Liste des articles : ' + aCodeArticles);
            log.set('Liste des Groupes magasin : ' + aGroupeMagasin);
        })
       
        test('Button [COLONNE A AFFICHER] - Click', async () => {
            await fonction.clickAndWait(pageTarif.buttonColonnes, page);
        })

        test('CheckBox [COLONNES A AFFICHER] - Click', async () => {
            var isVisible = await pageTarif.checkBoxColonneAAfficher.isVisible();
            if(!isVisible){
                await fonction.clickAndWait(pageTarif.checkBoxColonneAffiche, page);
            }
        })

        //--Saisie de toutes les lignes de tarification de la page;
        test('InputField [PRIX CESSION HT & PVC TTC] - Type', async () => {
            iNbreTarif = await pageTarif.inputPVCTTC.count();
            log.set('Nombre de ligne : ' + iNbreTarif);
            for( let i=0; i<iNbreTarif; i++) {

                var sPvcTtcTheorique:string = await pageTarif.tableBody.locator('td:nth-child(16)').nth(i).textContent();
                var rPrixTheorique:number = parseFloat(sPvcTtcTheorique.replace(',','.')) - 0.10;
                var rPrixCessionHt = rPrixTheorique.toFixed(2).toString().replace('.',',');
                log.set('Prix de cessionHT : ' + rPrixCessionHt);
                log.set('Prix TTC : ' + sPvcTtcTheorique);

                await pageTarif.inputMargePtf.nth(i).press('Tab');//Tabuler pour aller sur le champ de saisi de prix cession HT;

                await fonction.sendKeys(pageTarif.inputPrixCessionHT.nth(i), rPrixCessionHt, false, 'prix cession');
                await fonction.wait(page,500);
                await pageTarif.inputPrixCessionHT.nth(i).press('Tab');//Tabuler pour aller sur le champ de saisi de la marge magasin;
                
                await pageTarif.inputMargeMag.nth(i).press('Tab');//Tabuler pour aller sur le champ de saisi du PVC TTC;
                await fonction.sendKeys(pageTarif.inputPVCTTC.nth(i), sPvcTtcTheorique, false,'pvc ttc' );
                await fonction.wait(page,500);
            }
        })

        //-- Vérifier que toutes les tarifications sont complétées;
        test('InputField [PRIX CESSION HT & PVC TTC] - Check', async () => {
            for( let i=0; i<iNbreTarif; i++) {
                expect(await pageTarif.inputPVCTTC.nth(i).inputValue()).not.toBeNull();
                expect(await pageTarif.inputPrixCessionHT.nth(i).inputValue()).not.toBeNull();
            }
        })

        //--Vérifier que toutes les tarifications de la page sont cochées;
        test('Tr [TARIFICATIONS] #1 - Check', async () => {
            for( let i=0; i<iNbreTarif; i++) {
                await expect(pageTarif.tableBody.first()).toHaveAttribute('data-p-highlight', 'true');
            }
        })

        test('Label [NBRE MAGASINS SELECTIONNES] #3 - Check', async () => {
            expect((await pageTarif.theadNombreLigneTarifSelectionne.textContent()).trim()).toBe("15");
        })

        //---Aller à la page suivante;
        test('Button [>] - Click', async () => {
            await fonction.clickAndWait(pageTarif.buttonNextPage, page)
        })

        //---Vérifier que les tarifications des autres pages ne sont pas sélectionnées
        test('Tr [TARIFICATIONS] #2 - Check', async () => {
            for( let i=0; i<iNbreTarif; i++) {
                await expect(pageTarif.tableBody.nth(i)).not.toHaveAttribute('data-p-highlight', 'true');
            }
        })

        //---Valider tarifications;
        test('Button [VALIDER] - Click', async () => {
            await fonction.clickAndWait(pageTarif.buttonValider, page);
        })

        for(let i=0; i<15; i++) {

            //--Vérifier que les tarifications validées disparaissent de l'écran;
            test('InputField [CODE ARTICLE][' + i + '] - Type', async () => {
                await fonction.sendKeys(pageTarif.inputArticle, aCodeArticles[i], false, 'Code Article');
                await fonction.wait(page, 500);//Attendre que le filtre soit appliqué;
            })

            test('ListBox [GRPE MAGASIN][' + i + ']', async () => {

                if(i==0 ) { 

                    await fonction.clickElement(pageTarif.tdListeBoxGpreArticle.first());
                    await fonction.wait(page, 500);//Attendre que le filtre soit appliqué;

                    await fonction.clickElement(page.locator('p-multiselectitem  li span:text-is("' + aGroupeMagasin[i%15] + '")'));
                    await fonction.clickElement(pageTarif.pPcalcMargeIconClose);
                }
                
                //Nous sommes dans un cadre où le groupe de magasin a changé;
                if((i>0 && aGroupeMagasin[i] != aGroupeMagasin[i-1])) { 
                    
                    //Supprimer la selection du groupe de magasin précédent;
                    await fonction.clickElement(pageTarif.tdListeBoxGpreArticle.first());
                    await fonction.clickElement(page.locator('p-multiselectitem  li span:text-is("' + aGroupeMagasin[i-1] + '")'));
                    
                    await fonction.clickElement(page.locator('p-multiselectitem  li span:text-is("' + aGroupeMagasin[i] + '")'));
                    await fonction.clickElement(pageTarif.pPcalcMargeIconClose);
                }
            })

            //-- Les lignes  disparaissent de l'écran;
            test('Td [LIGNE TARIFICATION][' + i + '] - Is Not Visible', async () => {
                await fonction.sendKeys(pageTarif.inputArticle, aCodeArticles[i], false, 'Code Article');
                await fonction.wait(page, 1000);//Attendre que le filtre soit appliqué;
                await expect(pageTarif.dataGridArticlesSelectable).toBeHidden();
            })

        }

        test('InputField, ListBox [CODE ARTICLE, GROUPE MAG] - Clear', async () => {
            //--Annuler les filtres appliqués à la page précédente (Article);
            await pageTarif.inputArticle.clear();

            //--Annuler les filtres appliqués à la page précédente (Groupe de magasin);
            await fonction.clickElement(pageTarif.tdListeBoxGpreArticle.first());
            await fonction.clickElement(pageTarif.pPCheckBoxAllGroupeFav);
            await fonction.clickElement(pageTarif.pPCheckBoxAllGroupeFav);
            await fonction.clickElement(pageTarif.pPcalcMargeIconClose);
            await fonction.wait(page,1000);//Attendre que le filtre soit appliqué;
        })

        //--Filtrer sur les tarifications validées;
        test('CheckBox [TARIF A VALIDER] - Click x 2', async () => { 
            await fonction.clickElement(pageTarif.checkBoxStatutTarif);
            await fonction.clickElement(pageTarif.checkBoxStatutTarif);
        })

        for(let i=0; i<15; i++) {

            //Vérifier que le PC et PVC est en gras;
            test('td [PRIX CESSION HT][' + i + '] - Is Bold', async () => {
                await fonction.isDisplayed(pageTarif.tdPrixCessionHtGras.nth(i));
            })

            test('td [PVC TTC][' + i + '] - Is Bold', async () => {
                await fonction.isDisplayed(pageTarif.tdPvcTtcGras.nth(i));
            })

            //Vérifier que les champs ne sont plus saisissables;
            test('InputField [MARGE PLT, PC, MARGE MAG, PVC][' + i + '] - Are Not Visible', async () => {
                await expect(pageTarif.inputMargePtf.nth(i)).not.toBeVisible();
                await expect(pageTarif.inputPrixCessionHT.nth(i)).not.toBeVisible();
                await expect(pageTarif.inputMargeMag.nth(i)).not.toBeVisible();
                await expect(pageTarif.inputPVCTTC.nth(i)).not.toBeVisible();
            })
            
            //Vérifier que toutes les tarifications de la page sont validées;
            test('Icon [TARIFIE ET VALIDE][' + i + '] - Is Visible', async () => {
                await fonction.isDisplayed(pageTarif.dataGridArticlesSelectable.locator('td em.fa-check').nth(i));
            })
        }

    })  //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})

