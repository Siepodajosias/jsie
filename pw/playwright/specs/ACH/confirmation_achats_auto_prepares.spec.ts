/**
 * 
 * @author SIAKA KONE
 * @since 2024-04-25
 * 
 */
const xRefTest      = "ACH_CAL_CAU";
const xDescription  = "Confirmer un Achat Auto Préparé";
const xIdTest       =  3141;
const xVersion      = '3.3';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,    
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon','typeAchat'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, expect, type Page }from '@playwright/test';

import { Help }                   from '@helpers/helpers';
import { TestFunctions }          from '@helpers/functions';
import { EsbFunctions }           from '@helpers/esb';
import { Log }                    from '@helpers/log';
import { PageAchAnalyse }         from '@pom/ACH/achats_analyse-journee.page';
import { PageAchAchFour }         from '@pom/ACH/achats_achats-fournisseurs.page';
import { MenuAchats }             from '@pom/ACH/menu.page';

import { CartoucheInfo, TypeEsb } from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
let pageAchAchFour  : PageAchAchFour;
let pageAchAnalyse  : PageAchAnalyse;
let menu            : MenuAchats;
let esb             : EsbFunctions;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------
const sRayon:string     = fonction.getInitParam('rayon', 'Fruits et légumes');
const sTypeAchat:string = fonction.getInitParam('typeAchat','Auto. Préparé');
//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    pageAchAchFour  = new PageAchAchFour(page);
    pageAchAnalyse  = new PageAchAnalyse(page);
    esb             = new EsbFunctions(fonction);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', ()=>{

    var oData = {
        sFournisseur    : '',
        sPlteformeDist  : '',
        sNumAchat       : ''
    };

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe ('Page [ACHATS]', async () => {

        test ('ListBox [RAYON] = "' + sRayon + '"', async() => {
            await menu.selectRayonByName(sRayon, page);
        });

        const pageName:string = 'achats';
        test ('Page [ACHATS] - Click', async () => {
            await menu.click(pageName, page);
        });

        var sNomOnglet:string = "ACHATS AUX FOURNISSEURS";
        test.describe ('Onglet [ACHATS AUX FOURNISSEURS]', async() => {

            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(pageName, 'achatsAuxFournisseurs', page);
            });

            test('Icon [SUPPRESSION FILTRE]', async () =>{
                await fonction.clickElement(pageAchAchFour.iconSupprFiltreUser);
            });

            test('ListBox [TYPE] = "' + sTypeAchat + '"', async () =>{
                await fonction.clickElement(pageAchAchFour.iconMultiSelect.nth(4));
                await fonction.sendKeys(pageAchAchFour.inputMultiFiltre, sTypeAchat, false, 'Type d\'achat');
                await fonction.clickElement(pageAchAchFour.multiSelectAllChoices.first());
                await fonction.clickAndWait(pageAchAchFour.multiSelectClose, page);
            });

            const sStatut:string = 'A confirmer';
            test('ListBox [STATUT] = "' + sStatut + '"', async () => {
                await fonction.clickElement(pageAchAchFour.iconMultiSelect.nth(5));
                await fonction.sendKeys(pageAchAchFour.inputMultiFiltre, sStatut, false, 'Satut');
                await fonction.clickElement(pageAchAchFour.multiSelectAllChoices.first());
                await fonction.clickAndWait(pageAchAchFour.multiSelectClose, page);
            });

            test('td [ARTICLE A ACHETER][0] - Click', async ()=> {
                expect(await pageAchAchFour.tdListAchat.count()).toBeGreaterThan(0);
                await fonction.clickElement(pageAchAchFour.tdListAchat.first());
                oData.sFournisseur  = await pageAchAchFour.tdListAchat.first().locator('td:nth-child(2)').first().textContent();
                oData.sNumAchat     = await pageAchAchFour.tdListAchat.first().locator('td:nth-child(3)').first().textContent();
                oData.sPlteformeDist= await pageAchAchFour.tdListAchat.first().locator('td:nth-child(5)').first().textContent();
                log.set('Fournisseur : ' + oData.sFournisseur);
                log.set('Numero achat : ' + oData.sNumAchat);
                log.set('Plateforme distribution : ' + oData.sPlteformeDist);
            });

            test('Button [MODIFIER] - Click', async () => {
                await fonction.clickAndWait(pageAchAnalyse.buttonModifier, page);
            });

            const sNomPopin:string = 'Détail de la préparation de l\'achat automatique n°';
            test.describe('Popin [' +sNomPopin.toUpperCase()+ ']', async () => {

                test('Popin [' + sNomPopin + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                }); 

                test('Label [FOURNISSEUR] - Check', async () => {
                    expect((await pageAchAchFour.pPlabelFournisseur.textContent()).toUpperCase()).toBe(oData.sFournisseur.toUpperCase());
                });

                test('Label [DATE EXPEDITION] - Check', async () => {
                    const sDateExp:string = fonction.getToday('FR', 0,' / ');
                    expect(await pageAchAchFour.pPlabelDateExpedition.textContent()).toBe(sDateExp);
                });

                test('Label [PLATEFORME DISTRIBUTION] - Check', async () => {
                    expect((await pageAchAchFour.pPlabelPlteDistribut.textContent()).toUpperCase()).toBe(oData.sPlteformeDist.toUpperCase());
                });

                test('DataGrid [PREPARATION] - Check', async () => {
                    await fonction.isDisplayed(pageAchAchFour.pPtablePreparation.first());
                });

                test('Button [IMPORTER UN FICHIER FOURNISSEUR] - Is Visible', async () => {
                    await fonction.isDisplayed(pageAchAchFour.pPbuttonImportFichFour);
                });

                test('Button [EXPORTER] - Is Visible', async () => {
                    await fonction.isDisplayed(pageAchAchFour.pPbuttonExporter);
                });

                test('Button [CONFIRMER ACHAT] - Click', async () => {
                    await fonction.clickAndWait(pageAchAchFour.pPbuttonConfirmerAchat, page);
                });

                test('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                });

            });

            test('InputField [NUMERO ACHAT] = "***"', async ()=> {
                await pageAchAchFour.fAcheterInputNumAchat.first().waitFor();
                await fonction.sendKeys(pageAchAchFour.fAcheterInputNumAchat, oData.sNumAchat.trim(), false, 'Numéro achat');
            });

            const sStatutTer:string = 'Confirmé';
            test('ListBox [STATUT] = "' + sStatutTer + '"', async () =>{
                await fonction.clickElement(pageAchAchFour.iconMultiSelect.nth(5));
                await fonction.sendKeys(pageAchAchFour.inputMultiFiltre, sStatutTer, false, 'Statut');
                await fonction.clickElement(pageAchAchFour.multiSelectAllChoices.first());
                await fonction.clickAndWait(pageAchAchFour.multiSelectClose, page);
            });

            test('td [ACHAT CONFIRME] = 1 - Check', async ()=> {
                await pageAchAchFour.fAcheterInputNumAchat.first().waitFor();
                expect(await pageAchAchFour.tdListAchat.count()).toEqual(1);
            });

        });
    });

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

    test ('Check Flux :',async ()=>{
        var oFlux:TypeEsb   =  { 
            "FLUX" : [ 
                {
                    "NOM_FLUX"  : "EnvoyerLot_Stock"
                },
                
                {
                    "NOM_FLUX"  : "EnvoyerLot_Repart"
                }
            ],
            "WAIT_BEFORE"   : 3000,                 // Optionnel
        };
        await esb.checkFlux(oFlux,page);
    });
});