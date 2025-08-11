/**
 * @desc Création d'une Promotion
 * 
 * @author SIAKA KONE
 *  Since 2024-04-18
 */

const xRefTest      = "PRI_PRO_POI";
const xDescription  = "Création d'une Promotion";
const xIdTest       =  1931;
const xVersion      = '3.9';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRICING',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon','codeArticle','ville','designation'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { expect, test, type Page}              from '@playwright/test';

import { TestFunctions }                       from "@helpers/functions";
import { Log }                                 from "@helpers/log";
import { Help }                                from '@helpers/helpers';
import { EsbFunctions }                        from '@helpers/esb';

import { TarificationPage }                    from '@pom/PRI/tarification_tarification.page';
import { MenuPricing }                         from '@pom/PRI/menu.page';

import { AutoComplete, CartoucheInfo, TypeEsb }from '@commun/types';

//----------------------------------------------------------------------------------------

let page        : Page;
let menuPage    : MenuPricing;
let esb         : EsbFunctions;

let pageTarif   : TarificationPage;

const log       = new Log();
const fonction  = new TestFunctions(log);

//----------------------------------------------------------------------------------------
const sRayon        = fonction.getInitParam('rayon','Poissonnerie');
const sCodeArticle  = fonction.getInitParam('codeArticle','M11O');   
const sVilleRef     = fonction.getInitParam('ville','Toulouse'); 
var sNomPromo       = fonction.getInitParam('designation','TA_PROMO'); 

const dateDuJour:string    = fonction.getToday('FR', 0, ' / ');
const sPrixCession:string  = '8.88';
const sPrixVenteCli:string = '9.99';

sNomPromo           = sNomPromo + '_' + sCodeArticle + '_' + fonction.getHMS(); // Ajout d'un suffixe pour le nom de la promo

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage(); 
    esb         = new EsbFunctions(fonction);
    menuPage    = new MenuPricing(page, fonction);
    pageTarif   = new TarificationPage(page);
    const helper= new Help(info, testInfo, page);
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
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [TARIFICATION]', async () => {  
        
        test ('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menuPage.selectRayonByName(sRayon, page);               // Sélection du rayon
            log.set('Rayon : ' + sRayon);
        });

        test ('Page [TARIFICATION] - Click', async () => {
            await menuPage.click('tarification', page);
        });

        test ('** Wait Until Spinner Off **', async () => {
            await fonction.waitForSpinner(pageTarif.pPcalcMargeSpinner, 180000);
        })

        test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        });

        test ('CheckBox [PROMOTION A VALIDER]', async ()=>{
            const CheckBoxestVisible = await pageTarif.checkBoxAvalider.isVisible();
            expect(CheckBoxestVisible).toBe(true);
        })

        test ('Button [TARIFICATION] - Click', async () => {
            await fonction.clickAndWait(pageTarif.buttonTarification, page, 60000);
        });

        var sNomPopin:string = 'AJOUT DE TARIFICATION';
        test.describe('Popin [' + sNomPopin + ' - ' + sRayon + ']', async () => {

            test ('Popin [' + sNomPopin + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin + ' - ' + sRayon, true);
            }); 

            test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
                await fonction.isErrorDisplayed(false, page);
            });

            test ('AutoComplete [ARTICLE] = "' + sCodeArticle + '"', async () => {

                var bEnabled = await pageTarif.pInputArticle.isEnabled();
                if(bEnabled){
                    var oData = {
                        libelle         :'ARTICLE',
                        inputLocator    : pageTarif.pInputArticle,
                        inputValue      : sCodeArticle,
                        clear           : true,
                        choiceSelector  :'li.gfit-autocomplete-result',
                        choicePosition  : 0,
                        typingDelay     : 250,
                        waitBefore      : 1000,
                        page            : page
                    };
                    await fonction.autoComplete(oData);
                }

            });

            test ('InputField [NOM PROMO] = "*', async () => {
                await fonction.sendKeys(pageTarif.pPinputNomPromo, sNomPromo, false, 'Nom Promo');
                log.set('NOM PROMO : ' + sNomPromo);
            });

            test ('ListBox [TYPE][rnd]', async () =>{
                await fonction.selectOption(pageTarif.pPlistBoxTypePromo, 'JOUR')
            });

            test ('Label [DATE JOUR] = "' + dateDuJour + '"', async () => {
                const texteComplet = await pageTarif.recupDateDuJour.textContent();
                const dateDebutPromo = texteComplet?.replace('du : ', '').trim();
                expect(dateDebutPromo).toBe(dateDuJour);
            });

            test ('DatePicker [PROMOTION] - Click', async () => {
                await fonction.clickElement(pageTarif.pDatePickerPromo);
                await fonction.clickElement(pageTarif.pTdDatePickerPromo);
            });

            test ('InputField [PRIX DE CESSION HT] = "' + sPrixCession + '"', async () => {
                await fonction.sendKeys(pageTarif.pPinputPrixCessionHT, sPrixCession, false, 'Prix de Cession HT');
            });

            test ('InputField [PRIX VENTE CLIENT TTC] = "' + sPrixVenteCli + '"', async () => {
                await fonction.sendKeys(pageTarif.pPinputPVCTtc, sPrixVenteCli, false, 'Prix de Vente Client TTC');
                await fonction.wait(page, 500);
            });

            test ('AutoComplete [MAGASIN] = "' + sVilleRef + '"', async () => {

                var bEnabled = await pageTarif.pPinputMagasin.isEnabled();
                if(bEnabled){
                    var oData:AutoComplete = {
                        libelle         :'MAGASIN',
                        inputLocator    : pageTarif.pPinputMagasin,
                        inputValue      : sVilleRef,
                        clear           : true,
                        choiceSelector  :'li.gfit-autocomplete-result',
                        choicePosition  : 0,
                        typingDelay     : 250,
                        waitBefore      : 1000,
                        page            : page
                    };
                    await fonction.autoComplete(oData);
                }

            });

            test ('CheckBox [LISTE MAGASIN][ALL] - Click', async () => {
                await fonction.wait(page, 500);
                await fonction.clickElement(pageTarif.pPcheckBoxThListeMagasin.first());
            });

            test ('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageTarif.pPbuttonSauvegarder, page);
            });

            test ('** Wait Until Spinner Off **', async () => {
                await fonction.waitForSpinner(pageTarif.pPcalcMargeSpinner, 180000);
            });

            test ('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin + ' - ' + sRayon, false);
            });

            test ('Tarification [*] - Is Visible', async ()=>{
                const ligneTarificationAjoutee = pageTarif.tableBody.locator(`td:has-text("${sNomPromo}")`).first();
                expect(ligneTarificationAjoutee).toBeVisible()
            })

        });

    });  //-- End Describe Page

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

    test ('** CHECK FLUX **', async () =>  {
        const oFlux:TypeEsb = { 
            FLUX : [
                {
                    NOM_FLUX    : 'EnvoyerPromotion_Mag',
                    TITRE       : 'Promotion article N°' + sCodeArticle
                }
            ],
                            
            WAIT_BEFORE     : 30000,            // Optionnel
            VERBOSE_MOD     : false             // Optionnel car écrasé globalement
        };
        await esb.checkFlux(oFlux, page);
    });

})