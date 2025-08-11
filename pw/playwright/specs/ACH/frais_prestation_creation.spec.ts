/**
 * 
 * @author JC CALVIERA
 * @since 2024-02-26
 * 
 */
const xRefTest      = "ACH_AFP_ADD";
const xDescription  = "Ajouter des Frais de prestation à part";
const xIdTest       =  7562;
const xVersion      = "3.2";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Précurseur de de [ACH_AFP_UPD]'],
    params      : ['plateforme', 'rayon'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }	from '@playwright/test';

import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { Log }              from '@helpers/log.js';
import { EsbFunctions }     from '@helpers/esb'

import { MenuAchats }       from '@pom/ACH/menu.page.js';
import { PageAchFraiFac }   from '@pom/ACH/achats_frais-factures-a-part.page';

import { AutoComplete, CartoucheInfo, TypeEsb, TypeListBox } from '@commun/types';

//------------------------------------------------------------------------------------

let page                    : Page;
 
var pageFrais               : PageAchFraiFac;
var menu                    : MenuAchats;
let esb                     : EsbFunctions;

const log                   = new Log();
const fonction              = new TestFunctions(log);

const sRayon:string         = fonction.getInitParam('RAYON', 'Fruits et légumes');
const sPlateforme:string    = fonction.getInitParam('PLATEFORME', 'Chaponnay');

const sLettre:string        = 'e';
const rMontant:number       = 8.888;
const sNumFacture:string    = 'TA_FraisPresta_' + fonction.getToday();

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage();
    menu        = new MenuAchats(page, fonction);    
    pageFrais   = new PageAchFraiFac(page);
    esb         = new EsbFunctions(fonction);
    const helper= new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

   test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

   test('Connexion', async() => {
       await fonction.connexion(page);
   })
  
    test.describe('Page [ACHATS]', async() => {

       var pageName:string = 'achats';

       test('ListBox [RAYON] = "' + sRayon + '"', async() => {
            await menu.selectRayonByName(sRayon, page);
        });

       test("Menu [ACHATS] - Click ", async () => {
           await menu.click(pageName, page);
       })

       test.describe('Onglet [FRAIS FACTURES A PART]', async() => {

            test ('Onglet [FRAIS FACTURES A PART] - Click', async () => {
                await menu.clickOnglet(pageName, 'fraisFactures',page);                
            })   

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            test ('Button [ACHETER DES FRAIS] - Click', async () => {
                await fonction.clickAndWait(pageFrais.buttonAcheterDesFrais, page);
            })

            const sNomPopin:string = "Création d'un achat de prestation";
            test.describe ('Popin ' + sNomPopin.toUpperCase() + ']', async() => {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () =>  {
                  await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
                })
                
                test('Message [ERREUR] - Is Not Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);                           // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
                })

                test ('DatePicker [DATE DE L\'ACHAT] - Click', async () => {
                    await fonction.clickElement(pageFrais.pPcreachaDatePicker);
                })

                test ('Day [AUJOURD\'HUI] - Click', async () => {
                    await fonction.clickAndWait(pageFrais.pPcreachaTdToday, page);
                })

                test ('AutoComplete [FOURNISSEUR] = "' + sLettre + '"', async () => {
                    log.set('Lettre Injectée : ' + sLettre);
                    var oData:AutoComplete = {
                        libelle         :'FOURNISSEUR',
                        inputLocator    : pageFrais.pPcreachaInputFournisseur,
                        inputValue      : sLettre,
                        choiceSelector  :'button.dropdown-item',
                        choicePosition  : 1,
                        typingDelay     : 100,
                        waitBefore      : 500,
                        page            : page,
                    };
                    await fonction.autoComplete(oData);
                })

                test ('ListBox [ACHETEUR][rnd]  - Select', async () => {
                    const oData:TypeListBox = {
                        sLibelle        : 'Acheteur',
                        sInput          : pageFrais.pPcreachaListBoxAcheteur,
                        sSelectorChoice : 'p-dropdownitem',
                        bVerbose        : false,
                        bIgnoreFirstline: false,
                        iWaitFor        : 0,
                        page            : page
                    }
                    await fonction.selectRandomListBox(oData);
                })       

                test ('ListBox [PLATEFORME DE RECEPTION]  = "' + sPlateforme + '"', async () => {
                    await fonction.clickElement(pageFrais.pPcreachaListBoxPtfRecep);
                    await fonction.wait(page, 500);
                    await pageFrais.pPcreachaListBoxPtfRecep.locator('p-dropdownitem li span:text-is("' + sPlateforme + '")').click();                    
                    log.set('Plateforme de Réception Sélectionnée : ' + sPlateforme);
                })       
                
                test ('ListBox [TYPE DE FRAIS][rnd]  - Select', async () => {
                    const oData:TypeListBox = {
                        sLibelle        : 'Type de Frais',
                        sInput          : pageFrais.pPcreachaListBoxTypeFrais,
                        sSelectorChoice : 'p-dropdownitem li',
                        bVerbose        : false,
                        bIgnoreFirstline: true,
                        iWaitFor        : 0,
                        page            : page
                    }
                    await fonction.selectRandomListBox(oData);
                })                 

                test ('InputField [NUM BL] = "' + sNumFacture + '"', async () => {
                    await fonction.sendKeys(pageFrais.pPcreachaInputNumBL, sNumFacture);
                    log.set('Numéro BL : ' + sNumFacture);
                })

                test ('InputField [MONTANT] = "' + rMontant + '"', async () => {
                    await fonction.sendKeys(pageFrais.pPcreachaInputMontant, rMontant);
                    log.set('Montant : ' + rMontant);
                })

                test ('Button [AJOUTER] - Click', async () => {
                    await fonction.clickElement(pageFrais.pPcreachaButtonAjouter);
                })

                test ('Button [CREER L\'ACHAT] - Click', async () => {
                    await fonction.clickAndWait(pageFrais.pPcreachaButtonCreerAchat, page);
                })

            })

       })  // End  Onglet

    })  // End  Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

    test.describe('Check Flux', async () => {   

        test('** CHECK FLUX **', async () =>  {

            const oFlux:TypeEsb = { 
                            FLUX : [
                                {
                                    NOM_FLUX    : 'Facture_Alusta_X3',
                                    TITRE       : 'Transfert facture de alusta vers X3'
                                },
                                {
                                    NOM_FLUX    : 'EnvoyerAchat_Alusta',
                                    TITRE       : 'Achat N°%'
                                }
                            ],
                            WAIT_BEFORE     : 3000,                 // Optionnel
                            VERBOSE_MOD     : false,                  // Optionnel car écrasé globalement
            };

            await esb.checkFlux(oFlux, page);

        })

    })

})  // End describe