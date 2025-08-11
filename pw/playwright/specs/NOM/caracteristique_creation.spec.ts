/**
 * 
 * @description Créer une caractéristique
 * 
 * @author JOSIAS SIE
 *  Since 2025-02-20
 */

const xRefTest      = "NOM_CAR_ADD";
const xDescription  = "Créer une caractéristique";
const xIdTest       =  1119;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'NOMEMCLATURE',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['designation', 'typeCaracteristique'],
    fileName    : __filename
}

//----------------------------------------------------------------------------------------

import { test, type Page, expect }         from '@playwright/test';

import { TestFunctions }                   from "@helpers/functions";
import { Log }                             from "@helpers/log";
import { Help }                            from '@helpers/helpers';

import { MenuNomenclature }                from "@pom/NOM/menu.page";
import { Caracteristique }                 from '@pom/NOM/caracteristiques.page';

import { CartoucheInfo, TypeListOfElements}from '@commun/types';

//----------------------------------------------------------------------------------------

let page           : Page;
let menu           : MenuNomenclature;
let pageCaracterist: Caracteristique;

const log          = new Log();
const fonction     = new TestFunctions(log);

//----------------------------------------------------------------------------------------
var sDesignation        = fonction.getInitParam('designation','');
var sTypeCaracteristique= fonction.getInitParam('typeCaracteristique','Code/désignation');

//----------------------------------------------------------------------------------------
const sDescription   = 'TA création d\'une caracteristique de type code/désignation. ' + fonction.getToday('FR');
sDesignation         = sDesignation ? sDesignation : 'TA_caracteristique. ' + fonction.getToday('FR');
//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page           = await browser.newPage(); 
    menu           = new MenuNomenclature(page, fonction);
    pageCaracterist= new Caracteristique(page);
    const helper   = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + '] - ' + xDescription , () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [CARACTERISTIQUE]', async () => {    

        var currentPage:string  = 'caracteristiques';

        test('Page [CARACTERISTIQUE] - Click', async () => {
            await menu.click(currentPage, page); 
        })              
        
        test('Button [CREER CARACTERISTIQUE] - Click', async () => {
            await fonction.clickAndWait(pageCaracterist.buttonCreerCaracterist, page);
        })

        var sNomPopin:string = "Création d'une caractéristique";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {            

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            })

            test('InputField [DESIGNATION] = "' + sDesignation + '"', async () => {
                await fonction.sendKeys(pageCaracterist.pInputDesignation, sDesignation, false, 'Désignation');
            })
            
            test.describe ('Rubrique [CHECK DES VALEURS]', async () => {  
                
                // Vérification du champs Type.
                test('Select [TYPE] - Click', async () => {
                    await fonction.clickAndWait(pageCaracterist.pListBoxTypeCarac, page);
                })
                
                test('Option [TYPE]#1 - Check', async ({}, testInfo) => {
                    var oDataGrid:TypeListOfElements = 
                    {
                        element     : page.locator('option[name="type.data"]'),    
                        desc        : testInfo.line.toString(),
                        verbose     : false,
                        column      :   
                            [
                                'Article',
                                'Code/désignation',
                                'Nombre décimal',
                                'Nombre entier',
                                'Oui/Non',
                                'Texte'
                            ]
                    }
                    await fonction.elementInList(oDataGrid); 
                    await pageCaracterist.pListBoxTypeCarac.selectOption({label: 'Nombre décimal'});
                    await fonction.wait(page, 800);
                })

                // Vérification du champs Mode de saisie.
                test('Select [MODE DE SAISIE] - Click', async () => {
                    await fonction.clickAndWait(pageCaracterist.pSelectModeSaisie, page);
                })
                
                test('Option [TYPE]#2 - Check', async ({}, testInfo) => {
                    var oDataGrid:TypeListOfElements = 
                    {
                        element     : page.locator('option[name="saisie"]'),    
                        desc        : testInfo.line.toString(),
                        verbose     : false,
                        column      :   
                            [
                                '',
                                'Libre (PCK, Valeur nutritionnelle)',
                                'Liste fixe de valeurs (Unité de détail)',
                                'Liste dynamique de valeurs (Variété, Label)'
                            ]
                    }
                    await fonction.elementInList(oDataGrid); 
                    await fonction.clickElement(pageCaracterist.pSelectModeSaisie);
                    await fonction.wait(page, 800);
                })

                // Type de caractéristique (Nombre décimal).
                test('CheckBox [UNE SEULE VALEUR PAR ARTICLE] - Check', async () => {
                    await expect(pageCaracterist.pInputSeuleValeurArticle).toHaveClass('col-1 form-check-input ng-untouched ng-pristine ng-valid');
                })

                test('CheckBox [VALEUR A USAGE UNIQUE] - Check', async () => {
                    await expect(pageCaracterist.pInputValeurUsageUnique).not.toHaveClass('col-1 form-check-input ng-valid ng-touched ng-dirty');
                })

                test('CheckBox [UNE SEULE VALEUR PAR ARTICLE] - Click', async () => {
                    await fonction.clickElement(pageCaracterist.pInputSeuleValeurArticle);
                    await fonction.clickElement(pageCaracterist.pInputSeuleValeurArticle);
                })

                test('CheckBox [VALEUR A USAGE UNIQUE] - Click', async () => {
                    await fonction.clickElement(pageCaracterist.pInputValeurUsageUnique);
                    await fonction.clickElement(pageCaracterist.pInputValeurUsageUnique);
                })

                test('CheckBox [VALEUR][MINIMUM][MAXIMUM] - Check', async () => {
                    await fonction.isDisplayed(pageCaracterist.pInputValeurMin);
                    await fonction.isDisplayed(pageCaracterist.pInputValeurMax);
                })

                // Type de caractéristique (texte).
                test('Select [TYPE]#2 - Click', async () => {
                    await pageCaracterist.pListBoxTypeCarac.selectOption({label: 'Texte'});
                    await fonction.wait(page, 500);
                })

                test('Input [TYPE] - Check', async () => {
                    await fonction.isDisplayed(pageCaracterist.pInputValeurTraduireNon);
                    await fonction.isDisplayed(pageCaracterist.pInputValeurTraduireOui);
                    await fonction.isDisplayed(pageCaracterist.pInputValeurTraduireOui_2);
                    await fonction.isDisplayed(pageCaracterist.pInputLongueurMax);
                })

                test('Input [DESCRIPTION] - Check', async () => {
                    await fonction.isDisplayed(pageCaracterist.pTexteAreaDescription);
                    await expect(pageCaracterist.pTexteAreaDescription).toHaveAttribute('required');
                    await fonction.wait(page, 800);
                })

                // Mode de saisie liste fixe de valeurs
                test('Select [TYPE]#3 - Click', async () => {
                    await pageCaracterist.pSelectModeSaisie.selectOption({label: 'Liste fixe de valeurs (Unité de détail)'});
                    await fonction.wait(page, 2000);
                })

                test('CheckBox [TYPE D\'AFFICHAGE] - Check', async () => {
                    await expect(pageCaracterist.pInputTypeAffichage).toHaveAttribute('required');
                })

                test('Input [TYPE D\'AFFICHAGE] - Check', async () => {
                    await fonction.isDisplayed(pageCaracterist.pInputTypeAffichage);
                    await fonction.isDisplayed(pageCaracterist.pInputAutocomplete);
                    await fonction.isDisplayed(pageCaracterist.pInputPopover);
                })
            })

            test.describe ('Rubrique [DES VALEURS]', async () => {              
                test('Select [TYPE] = "' + sTypeCaracteristique + '"', async () => {
                    await fonction.clickElement(pageCaracterist.pListBoxTypeCarac);
                    await pageCaracterist.pListBoxTypeCarac.selectOption({label: sTypeCaracteristique});
                })
    
                test('Input [VALEUR A USAGE UNIQUE] - Click', async () => {
                    await fonction.clickElement(pageCaracterist.pInputValeurUsageUnique);
                })
    
                test('Input [VALEUR(S) A TRADUIRE] - Click', async () => {
                    await fonction.clickElement(pageCaracterist.pInputValeurATraduire);
                })
    
                test('Textarea [DESCRIPTION] - Click', async () => {
                    await fonction.sendKeys(pageCaracterist.pTexteAreaDescription, sDescription, false, 'Description');
                })
    
                test('Input [TYPE D\'AFFICHAGE] - Click', async () => {
                    await fonction.clickElement(pageCaracterist.pInputTypeAffichage);
                })
            })

            test('Button [CREER] - Click', async () => {
                await fonction.clickAndWait(pageCaracterist.pButtonCreer, page);
            })

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            })
        })
    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})