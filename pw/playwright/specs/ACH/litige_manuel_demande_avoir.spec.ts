/**
 * 
 * 
 * @author JC CALVIERA
 * @since 2024-04-08
 * 
 */
const xRefTest      = "ACH_LIT_MDA";
const xDescription  = "Transformer un Litige Manuel en Demande d'Avoir";
const xIdTest       =  1537;
const xVersion      = '3.3';

var info:CartoucheInfo = {
    desc    : xDescription,
    appli   : 'ACHATS',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : [],
    params  : ['plateforme', 'ville','rayon'],
    fileName: __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }                     from '@playwright/test';

import { Help }                                from '@helpers/helpers';
import { TestFunctions }                       from '@helpers/functions';
import { Log }                                 from '@helpers/log';
import { EsbFunctions }                        from '@helpers/esb';

import { MenuAchats }                          from '@pom/ACH/menu.page';

import { PageLitLitMan }                       from '@pom/ACH/litiges_litiges-manuels.page';

import { AutoComplete, CartoucheInfo, TypeEsb }from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;

let pageLitige      : PageLitLitMan;
let esb             : EsbFunctions;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------

const sPlateforme   = fonction.getInitParam('plateforme','RUNGIS');
const slieuVente    = fonction.getInitParam('ville','Fréjus');
const sRayon        = fonction.getInitParam('rayon','Fruits et légumes');
const sObservation  = 'TA_LitigeManuel - ' + fonction.getToday('US');
const sTypeAvoir    = 'Quantité';

const iQteRefusee:number= 1;
const rPrixAchDef:number= 0.01;
const iNbEssais:number  = 50;

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    pageLitige      = new PageLitLitMan(page);
    esb             = new EsbFunctions(fonction);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    var bExamFlux:boolean = true;
    
    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe ('Page [LITIGES]', () => {

        var sPageName:string = 'litiges';
    
        test ('ListBox [RAYON] = "' + sRayon + '"', async () => {
            await menu.selectRayonByName(sRayon, page);
        })

        test ('Page [LITIGES] - Click', async () => {
            await menu.click(sPageName, page); 
        })
       
        test ('Error Message - Is Hidden', async () =>  {
            await fonction.isErrorDisplayed(false, page);                                   // Pas d'erreur affichée à priori au chargement de la page
        })

        test.describe ('Onglet [LITIGES MANUELS]', async () => {

            test ('Onglet [LITIGES MANUELS] - Click', async () => {
                await menu.clickOnglet(sPageName, 'litigeManu', page);                
            })

            test ('Error Message - Is Hidden', async () =>  {
                await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la page
            })

            test.skip ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async() => {
                var oData:AutoComplete = {
                    libelle         :'PLATEFORME',
                    inputLocator    : pageLitige.inputFieldFiltrePlateforme,
                    inputValue      : sPlateforme,
                    //choiceSelector  :'button.dropdown-item',
                    choicePosition  : 0,
                    typingDelay     : 100,
                    waitBefore      : 500,
                    page            : page,
                };
                await fonction.autoComplete(oData);
            })

            test ('ListBox [MAGASIN] = "' + slieuVente + '"', async() => {
                var oData:AutoComplete = {
                    libelle         :'MAGASIN',
                    inputLocator    : pageLitige.inputFieldFiltreMagasin,
                    inputValue      : slieuVente,
                    //choiceSelector  :'button.dropdown-item',
                    choicePosition  : 0,
                    typingDelay     : 100,
                    waitBefore      : 500,
                    page            : page,
                };
                await fonction.autoComplete(oData);
            })

            test ('DatePicker [DU] - Click()', async() => {
                await fonction.clickElement(pageLitige.datePickerFrom);
            })

            test ('Pictogramme [ << ] - Click()', async() => {
                await fonction.clickElement(pageLitige.pictoMoisPrecedent);
            })

            test ('Day [01] - Click()', async() => {
                await fonction.clickElement(pageLitige.tdActivesDays.first());
            })

            test ('Button [RECHERCHER] - Click', async() => {
                await fonction.clickAndWait(pageLitige.buttonRechercher, page);
                await fonction.wait(page, 250);                                                 //-- Attente raffraîchissement liste coté front
            })

            test ('CheckBox [LITIGES MANUELS][rnd] - Click', async() => {

                let iEssai:number = 0;
                let rnd:number;
                let bButtonActif:boolean = false;
                const iNbLignes = await pageLitige.checkBoxListeLitiges.count();

                do {

                    iEssai++;
                    rnd = Math.floor(fonction.random() * iNbLignes);
                    await fonction.clickElement(pageLitige.checkBoxListeLitiges.nth(rnd));
                    bButtonActif = await pageLitige.buttonCreerUneDAV.isEnabled();

                } while(bButtonActif == false && iEssai < iNbEssais)
                
                if (bButtonActif == false) {
                    bExamFlux = false;
                    test.skip();
                } else {
                    await fonction.getDataGridValues(page, 1, rnd + 1);                         // On récupère la liste des données sélectionnées
                }                
            })

            test ('Button [CREER UNE DEMANDE D\'AVOIR] - Click', async () => {
                await fonction.clickElement(pageLitige.buttonCreerUneDAV);
            })

            var sNomPopin:string = 'CREATION D\'UNE DEMANDE D\'AVOIR';        
            test.describe ('Popin [' + sNomPopin + ']', async() => {

                test ('Popin [' + sNomPopin + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test ('Error Message - Is Hidden', async () =>  {
                    await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la page
                })

                test ('ListBox [TYPE D\'AVOIR] = "' + sTypeAvoir + '"', async () =>  {
                    if (await pageLitige.pPlistBoxTypeAvoir.isEnabled()){
                        await fonction.clickElement(pageLitige.pPlistBoxTypeAvoir);
                        if (await pageLitige.pPlistBoxTypeAvoir.locator('option').first().isEnabled()){
                            await fonction.clickElement(pageLitige.pPlistBoxTypeAvoir.locator('option[label="' + sTypeAvoir + '"]'));
                        }
                    } else {
                        test.skip();
                    }                    
                })

                test ('TextArea [OBSERVATION] = "' + sObservation + '"', async() => {
                    await fonction.sendKeys(pageLitige.pPtextAreaObservation, sObservation, false, 'Observation');
                })

                test ('InputField [QUANTITE REFUSEE] = "' + iQteRefusee + '"', async() => {
                    if (await pageLitige.pPinputQuantiteRefusee.isVisible()) {
                        if (await pageLitige.pPinputQuantiteRefusee.isEnabled()) {
                            await fonction.sendKeys(pageLitige.pPinputQuantiteRefusee, iQteRefusee, false, 'Qté Refusée');
                        }
                    }
                })

                test ('InputField [PRIX D\'ACHAT DEFINITIF] = "' + rPrixAchDef + '"', async() => {
                    const bEnabled = await pageLitige.pPinputPrixAchatDefinitif.isEnabled();

                    if (bEnabled) {
                        await fonction.sendKeys(pageLitige.pPinputPrixAchatDefinitif, rPrixAchDef, false, 'Prix Achat Définitf');
                    }
                })

                test ('Button [CREER ET APPROUVER] - Click', async () => {
                    await fonction.clickAndWait(pageLitige.pPbuttonCreerApprouver, page);
                })

                test ('Message [AVERTISSEMENT] - Visible (?) - Option', async() => {
                    if (await pageLitige.pPmessageErreur.isVisible()) {
                        const sTexte = await pageLitige.pPmessageErreur.textContent();
                        log.set('Message d\'Avertissement affiché : ' + sTexte);
                        await fonction.clickElement(pageLitige.pPlinkAnnuler);
                        bExamFlux = false;
                    } else {
                        test.skip();
                    }
                })

                test ('Popin [' + sNomPopin + '] - Is Hidden', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })
            })
        })  // End Describe Onglet
    })  // End Describe Page

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

    test('** CHECK FLUX **', async () => {

        if (bExamFlux) {
             var oFlux:TypeEsb = { 
                "FLUX" : [
                    {
                        NOM_FLUX   : "EnvoyerLot_Prepa",
                    }, 
                    {
                        NOM_FLUX   : "EnvoyerLot_Prefac",
                    }, 
                    {
                        NOM_FLUX   : "EnvoyerLot_Pricing",
                    }, 
                    {
                        NOM_FLUX   : "EnvoyerLot_Repart",
                    }, 
                    {
                        NOM_FLUX   : "EnvoyerAchat_Alusta",
                    }, 
                    {
                        NOM_FLUX   : "EnvoyerLot_Stock",
                    },                      
                    {
                        NOM_FLUX   : "Envoyer_Mail",
                    },                      
                ],
                WAIT_BEFORE  : 15000,               
                VERBOSE_MOD  : false
            };
 
            await esb.checkFlux(oFlux, page);
        }
    })
})