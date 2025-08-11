/**
 * @desc Refuser une demande d'alignement crèmerie
 * 
 * @author SIAKA KONE
 *  Since 2024-09-11
 */

const xRefTest      = "PRI_ALI_RAC";
const xDescription  = "Refuser une demande d'alignement Crèmerie";
const xIdTest       =  9516;
const xVersion      = '3.5';

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
const sRayon    = fonction.getInitParam('rayon','Crèmerie');
const sJddFile  = fonction.getGlobalConfig('jddAlignementConcu'); 

const oData         = fonction.readFile(sJddFile);
const aCodeArticles = Object.keys(oData.aNouveauPrix);
const sCodeMag      = oData.codeMagasin; 
const sMotifRefus   = 'PVC trop bas VS PVC constaté';
const sCommentaire  = 'Alignement refusé car PVC demandé trop bas par rapport au PVC constaté à la concurrence';

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
            test('InputField [CODE ARTICLE] = "' + sCodeArticle + '"', async () => {
                await fonction.sendKeys(pageAlign.inputCodeMagasinArticle, sCodeArticle, false, 'Code Article');
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
        })
       
        test('InputField [CODE ARTICLE] #1 = "' + aCodeArticles[aCodeArticles.length - 1] + '"', async () => {
            await fonction.sendKeys(pageAlign.inputCodeMagasinArticle, aCodeArticles[aCodeArticles.length - 1], false, 'Code Article');//
            await fonction.wait(page, 500);
        })

        test('Pictograme [REFUSER][0] - Click', async () => {
            await pageAlign.tdColActionDdeAlign.first().hover();
            await fonction.clickAndWait(pageAlign.pictogramAlignementRefuser.first(), page);
        })

        const sNomPopin:string = "Refus de l'alignement sur l'article " + aCodeArticles[aCodeArticles.length - 1]
        test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            })

            //--Commentaire saisissable;
            test('TextArea [COMMENTAIRE] - Is Editable', async () => {
                await expect(pageAlign.pPTextAreaCommentaireRefus).toBeEditable();
            })

            test('ListBox [MOTIF DU REFUS] = "' + sMotifRefus + '"', async () => {
                await fonction.ngClickListBox(pageAlign.pPListBoxMotif, sMotifRefus, pageAlign.pPListeMotif);
            })

            test('TextArea [COMMENTAIRE] = "'+ sCommentaire +'" - Check', async () => {
                log.set('Commantaire : ' + await pageAlign.pPTextAreaCommentaireRefus.inputValue());
                expect(await pageAlign.pPTextAreaCommentaireRefus.inputValue()).toEqual(sCommentaire);
            })

            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageAlign.pPButtonEnregistrer, page);
            })

            test('** Wait Until Spinner Off **', async () => {
                await fonction.waitForSpinner(pageAlign.pSpinnerOn.first());
            })

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            })
        })

        //--Vérifier que l'article disparait de la liste après avoir refusé l'alignement;
        test('InputField [CODE ARTICLE] #2 = "' + aCodeArticles[aCodeArticles.length - 1] + '"', async () => {
            await fonction.sendKeys(pageAlign.inputCodeMagasinArticle, aCodeArticles[aCodeArticles.length - 1] , false, 'Code Article');
            await fonction.wait(page, 500);
        })

        test('Td [ACTIONS] - Is Not Visible', async () => {
            await expect(pageAlign.tdColActionDdeAlign).not.toBeVisible();
        })
    })  //-- End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

    test('** CHECK FLUX **', async () =>  {

        var sDate = fonction.getToday('FR', 0, '/');

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