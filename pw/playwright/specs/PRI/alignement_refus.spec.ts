/**
 * @desc Refuser une demande d'alignement hors crèmerie
 * 
 * @author SIAKA KONE
 *  Since 2024-04-17
 */

const xRefTest      = "PRI_ALI_REF";
const xDescription  = "Refuser une demande d'alignement (hors crèmerie)";
const xIdTest       =  4834;
const xVersion      = '3.5';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRI',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, expect, type Page}   from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';
import { EsbFunctions }             from '@helpers/esb';

import { AlignementsPage }          from '@pom/PRI/alignements.page';
import { MenuPricing }              from '@pom/PRI/menu.page';

import { CartoucheInfo, TypeEsb }   from '@commun/types';

//----------------------------------------------------------------------------------------

let page        : Page;
let menuPage    : MenuPricing;
let esb         : EsbFunctions;

let pageAlign   : AlignementsPage;

const log       = new Log();
const fonction  = new TestFunctions(log);

//----------------------------------------------------------------------------------------
const sRayon    = fonction.getInitParam('rayon','Poissonnerie');
const sJddFile  = fonction.getGlobalConfig('jddAlignementConcu'); 

const oData     = fonction.readFile(sJddFile);

const aCodeArticles   = Object.keys(oData.aNouveauPrix);
const sCodeMag = oData.codeMagasin;

//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage(); 
    esb         = new EsbFunctions(fonction);
    menuPage    = new MenuPricing(page, fonction);
    pageAlign   = new AlignementsPage(page);
    const helper = new Help(info, testInfo, page);
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

    test.describe('Page [ALIGNEMENTS]', async () => {    

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menuPage.selectRayonByName(sRayon, page);               // Sélection du rayon
            log.set('Rayon : ' + sRayon);
        })

        test('Page [ALIGNEMENTS] - Click', async () => {
            await menuPage.click('alignements',page);
        })

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })

        const sDateJour:string   = fonction.getToday('FR', 0 ,' / ');
        test('DatePicker [DATE EDITION] ="' + sDateJour + '" - Check', async () => {
            expect(await pageAlign.inputDatePicker.inputValue()).toBe(sDateJour);
        })

        test('CheckBox [MASQUER MAGASINS SANS ALIGNEMENT A TRAITER] - Check', async () => {
            expect(pageAlign.checkBoxMasquerMagSansAlign).toHaveAttribute('data-p-highlight','true');
        })

        test('CheckBox [MASQUER ALIGNEMENTS REPONDUS] - Check', async () => {
            expect(pageAlign.checkBoxMasquerAlignRepondu).toHaveAttribute('data-p-highlight','true');
        })

        test('InputField [CODE] = "' + sCodeMag + '"', async () => {
            await fonction.sendKeys(pageAlign.inputCodeMagasinMagasin, sCodeMag, false, 'Code Magasin');
            await fonction.wait(page, 500);// Attendre que le filtre s'applique;
        })

        test('Td [CODE MAGASIN] - Check', async () => {
            expect(await pageAlign.tdCodeMagasin.textContent()).toBe(sCodeMag);
        })

        test('Pictogramme [ACTIONS] - Check', async () => { 
            await pageAlign.tdCodeMagasin.hover();
            await fonction.isDisplayed(pageAlign.pictogramMagasinAccepter);
        })
        
        test('CheckBox [LISTE MAGASIN][0] - Click', async () => {
            await fonction.clickAndWait(pageAlign.checkBoxMagasin.first(), page);
        })

        aCodeArticles.forEach((sCodeArticle:string) => {
            if(aCodeArticles.indexOf(sCodeArticle) == 0 ) {
                //--Je maitrise ce JDD. Je sais qu'il n'est pas encore traité;
                test('InputField [CODE ARTICLE] = "' + sCodeArticle + '"', async () => {
                    await fonction.sendKeys(pageAlign.inputCodeMagasinArticle, sCodeArticle, false, 'Code article');
                    await fonction.wait(page, 500);
                })
    
                test('Td [ACTIONS][' + sCodeArticle + '] - Is Visible', async () => {
                    await fonction.isDisplayed(pageAlign.tdColActionDdeAlign);
                })
    
                test('Pictogramme [ACTIONS][' + sCodeArticle + '] - Check', async () => {
                    await pageAlign.dataGridTrListeArticles.nth(1).hover();
                    await fonction.isDisplayed(pageAlign.pictogramAlignementAccepeter);
                    await fonction.isDisplayed(pageAlign.pictogramAlignementRefuser);
                })
            }
        })

        //--Décocher le filtre
        test('CheckBox [MASQUER LES ALIGNEMENTS REPONDUS] - Unclik', async () => {
            await fonction.clickElement(pageAlign.checkBoxMasquerAlignRepondu);
        })

        //--Celle dejà traitée est maintenant visible;
        test('InputField [CODE ARTICLE] #1 = "' + aCodeArticles[aCodeArticles.length - 1] + '"', async () => {
            await fonction.sendKeys(pageAlign.inputCodeMagasinArticle, aCodeArticles[aCodeArticles.length - 1], false, 'Code article');
            await fonction.wait(page, 500);
        })

        //--La coche est visible pour la demande d'alignement traitée;
        test('Icon [ACCEPTE] - Is Visible', async () => {
            const tdIconAccept = pageAlign.dataGridTrListeAlignement.filter({has:pageAlign.tdIconAccepte}).last();
            await fonction.isDisplayed(tdIconAccept);
        })

        test('Td [PVC APPLICABLE UNITE][' + aCodeArticles[0] + '] - Is Not Editable', async () => {
            const tdIconAccept = pageAlign.dataGridTrListeAlignement.filter({has:pageAlign.tdIconAccepte}).last();
            expect(tdIconAccept.locator('td.text-right input')).not.toBeVisible();
        })

        //--Cocher le filtre
        test('CheckBox [MASQUER LES ALIGNEMENTS REPONDUS] - Clik', async () => {
            await fonction.clickElement(pageAlign.checkBoxMasquerAlignRepondu);
        })

        //--Refuser le premier alignement de la liste;
        test('InputField [CODE ARTICLE] #2 = "' + aCodeArticles[0] + '"', async () => {
            await fonction.sendKeys(pageAlign.inputCodeMagasinArticle, aCodeArticles[0], false, 'Code article');
            await fonction.wait(page, 500);
        })

        test('Pictograme [REFUSER][0] - Click', async () => {
            await pageAlign.tdColActionDdeAlign.first().hover();
            await fonction.clickAndWait(pageAlign.pictogramAlignementRefuser.first(), page);
        })
        
        //-- Checker qu'il disparait de la liste;
        test('InputField [CODE ARTICLE] #3 = "' + aCodeArticles[0] + '"', async () => {
            await fonction.sendKeys(pageAlign.inputCodeMagasinArticle, aCodeArticles[0], false, 'Code article');
            await fonction.wait(page, 500);
        })

        test('Td [ACTIONS] #1 - Is Not Visible', async () => {
            await expect(pageAlign.tdColActionDdeAlign).not.toBeVisible();
        })

        //--Refuser les alignements restant;
        test('Pictogramme [REFUSER] - Click', async () => {
            await pageAlign.inputCodeMagasinArticle.clear();// Supprimer le filtre;
            const iNbreAlignement:number = await pageAlign.tdColActionDdeAlign.count();
            for(let i=0; i<iNbreAlignement; i++) {
                await fonction.clickAndWait(pageAlign.pictogramAlignementRefuser.first(), page);
            }
        })

        //--Vérifier que le magasin a disparu
        test('InputField [CODE] #1 = "' + sCodeMag + '"', async () => {
            await fonction.sendKeys(pageAlign.inputCodeMagasinMagasin, sCodeMag, false, 'Code magasin');
            await fonction.wait(page, 500);// Attendre que le filtre s'applique;
        })

        test('Td [CODE MAGASIN] - Is Not Visible', async () => {
            await expect(pageAlign.tdCodeMagasin).not.toBeVisible();
        })

        //--Décocher le filtre
        test('CheckBox [MASQUER LES MAGASINS SANS ALIGNEMENT A TRAITER] - Unclik', async () => {
            await fonction.clickElement(pageAlign.checkBoxMasquerMagSansAlign);
        })

        //--Vérifier que le magasin apparait à nouveau;
        test('InputField [CODE] #2 = "' + sCodeMag + '"', async () => {
            await fonction.sendKeys(pageAlign.inputCodeMagasinMagasin, sCodeMag, false, 'Code magasin');
            await fonction.wait(page, 500);// Attendre que le filtre s'applique;
        })

        test('Td [CODE MAGASIN] = "' + sCodeMag + '" - Check', async () => {
            expect(await pageAlign.tdCodeMagasin.textContent()).toBe(sCodeMag);
        })

        //---Plus d'article affiché à droite pour les alignements;
        test('Td [ACTION] = "' + 0 + '" - Check', async () => {
            expect(await pageAlign.tdColActionDdeAlign.count()).toBe(0);
        })

        //--Décocher le filtre afin d'afficher les alignements traités;
        test('CheckBox [MASQUER LES ALIGNEMENTS REPONDUS] #1 - Unclik', async () => {
            await fonction.clickElement(pageAlign.checkBoxMasquerAlignRepondu);
        })

        test('CheckBox [LISTE MAGASIN][0]  - Click', async () => {
            await fonction.clickAndWait(pageAlign.checkBoxMagasin.first(), page);
        })

        //--Vérifier que les articles traités apparaissent;
        aCodeArticles.forEach((sCodeArticle:string) => {
            test('InputField [CODE ARTICLE] #4 = "' + sCodeArticle + '"', async () => {
                await fonction.sendKeys(pageAlign.inputCodeMagasinArticle, sCodeArticle, false, 'Code article');
                await fonction.wait(page, 500);// Attendre que le filtre s'applique;
            })

            test('Td [ACTIONS][' + sCodeArticle + '] #1 - Is Visible', async () => {
                await fonction.isDisplayed(pageAlign.tdColActionDdeAlign.last());
            })
        })

        //--L'article dont l'alignement a été refusé;
        test('InputField [CODE ARTICLE] #5 = "' + aCodeArticles[0] + '"', async () => {
            await fonction.sendKeys(pageAlign.inputCodeMagasinArticle, aCodeArticles[0], false, 'Code article');
            await fonction.wait(page, 500);
        })

        //--Vérifier l'apparition de la croix pour les alignements refusés;
        test('Icon [REFUSE] - Is Visible', async () => {
            const tdIconRefus = pageAlign.dataGridTrListeAlignement.filter({has:pageAlign.tdIconRefuse}).last();
            await fonction.isDisplayed(tdIconRefus);
        })

        test('Td [PVC APPLICABLE UNITE][' + aCodeArticles[0] + '] - Is Editable', async () => {
            expect(pageAlign.tdPvcApplicableUnite.last()).toBeEditable();
        })

    })  //-- End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

    test.describe('Check Flux', async () => {   

        test('** CHECK FLUX **', async () =>  {

            var maDate  = new Date();
            var sDate   = fonction.addZero(maDate.getDate() + '/' + fonction.addZero(maDate.getMonth() + 1) + '/' + maDate.getFullYear());

            const oFlux:TypeEsb = { 
                FLUX : [
                    {
                        NOM_FLUX    : 'EnvoyerTarif_Mag',
                        TITRE       : 'Tarif du ' + sDate + ' magasin'
                    },
                    {
                        NOM_FLUX    : 'RepondreDemandeChangementPrix_Mag',
                        TITRE       : 'Répondre alignement'
                    },
                    {
                        NOM_FLUX    : 'EnvoyerTarifMagasin_Prefac',
                        TITRE       : 'Tarif du ' + sDate + ' magasin'
                    }
                ],
                                
                WAIT_BEFORE     : 30000,            // Optionnel
                VERBOSE_MOD     : false             // Optionnel car écrasé globalement
            };

            await esb.checkFlux(oFlux, page);

        })

    })
    
})