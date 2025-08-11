
/**
 * 
 * @author SIAKA KONE
 * @since 2024-12-31
 */

const xRefTest      = "TRA_IHM_GLB";
const xDescription  = "Examen de l'IHM Traduction";
const xIdTest       =  7249;
const xVersion      = '3.4';


var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'TRA',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};


import {  expect, test, type Page }         from '@playwright/test';
import { CartoucheInfo, TypeListOfElements} from '@commun/types';

import { Help }                  			from '@helpers/helpers';
import { TestFunctions }         			from '@helpers/functions';
import { Log }                   			from '@helpers/log';

//------------------------------------------------------------------------------------------//

import { MenuTraduction }                   from '@pom/TRA/menu.page';
import { Accueil }                          from '@pom/TRA/accueil.page';
import { Dictionnaire }                     from '@pom/TRA/dictionnaire.page';
import { Admin }                            from '@pom/TRA/admin.page';

//------------------------------------------------------------------------------------

let page                : Page;
let pageAccueil         : Accueil;
let pageDictionnaire    : Dictionnaire;
let pageAdmin           : Admin;
let menu                : MenuTraduction;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();    
    menu                = new MenuTraduction(page, fonction);
    pageAccueil         = new Accueil(page);
    pageDictionnaire    = new Dictionnaire(page);
    pageAdmin           = new Admin(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.beforeEach(async ({}, testInfo) => {
    await fonction.trace(testInfo);
    await fonction.checkConsole(page, testInfo, false);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () =>  {

    test('Ouverture URL :' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () =>  {
        await fonction.connexion(page);
    })

    test.describe ('Page [ACCUEIL]', async () =>  {

        var sNomPage:string = 'accueil';
        test ('Menu [ACCUEIL] - Click', async () =>  {
            await menu.click(sNomPage, page);
        })

        test ('Page [ACCUEIL] - Is Visible', async () =>  {
            await fonction.isDisplayed(pageAccueil.labelWelcomeMessage);
        })
        
    })

    //--------------------------PAGE DICTIONNAIRE------------------------------------------------------------------//

    test.describe ('Page [DICTIONNAIRE]', async () => {

        var sNomPage:string = 'dictionnaire';
        test ('Menu [DICTIONNAIRE] - Click', async () =>  {
            await menu.click(sNomPage, page);
        })

        test ('DataGrid [ZONE ETAT TRADUCTION ELEMENT] - Check', async () => {
            await fonction.waitForDomStable(page, 500, 10000);
            var oDataGrid:TypeListOfElements = {
                element     : pageDictionnaire.daraGridElementEtatTraduction,
                desc        : 'ZONE ETAT TRADUCTION ELEMENT',
                verbose		: false,
                column      : [
                                "Type", 
                                "Code", 
                                "Traduit / Validé", 
                                "Actions"
                            ]
            }
            await fonction.dataGridHeaders(oDataGrid);
        })

        test ('DataGrid [ZONE TRADUCTION ELEMENT] - Check', async () =>  {
            var oDataGrid:TypeListOfElements = {
                element     : pageDictionnaire.dataGridElementTraduction,
                desc        : 'ZONE TRADUCTION ELEMENT',
                verbose		: false,
                column      : [
                                "Caractéristique", 
                                "Texte de référence", 
                                "Traduction"
                            ]
            }
            await fonction.dataGridHeaders(oDataGrid);
        })

        test ('Button [ >> ] - Click', async () =>  {
            await fonction.clickElement(pageDictionnaire.buttonPaginationDernierePage);
        })

        test ('Label [DERNIERE PAGE] - Is Visible', async () =>  {
            await fonction.isDisplayed(pageDictionnaire.buttonPaginationValeurDernierePage);
        })

        test ('Thead [TYPE] - Click', async () =>  {
            await fonction.clickElement(pageDictionnaire.theadFiltreType);
        })

        test ('Thead [CODE] - Is Visible', async () =>  {
            await fonction.isDisplayed(pageDictionnaire.theadFiltreCode);
        })

        test ('Thead [TRADUIT/VALIDE] - Is Visible', async () =>  {
            await fonction.isDisplayed(pageDictionnaire.theadFiltreTraduitValider);
        })

        test ('ListBox [TYPE] - Click', async () =>  {
            await fonction.clickElement(pageDictionnaire.dataGridListBoxTypeElement);
        })

        test ('InputField [TYPE] - Is Visible', async () =>  {            
            await fonction.isDisplayed(pageDictionnaire.dataGridInputRechercheTypeElement);
        })

        test ('InputField [CODE] - Is Visible', async () =>  {
            await fonction.isDisplayed(pageDictionnaire.dataGridInputCode.first());
        })

        test ('Button [CRITERE RECHERCHE] - Is Visible', async () =>  {
            await fonction.isDisplayed(pageDictionnaire.dataGridButtonFiltreCritereRecherche);
        })

        test ('ListBox [CRITERE RECHERCHE]  - Click ', async () =>  {
            await fonction.clickElement(pageDictionnaire.dataGridButtonFiltreCritereRecherche);
        })

        test ('ListBox [CRITERE RECHERCHE] >= 7 ', async () =>  {
            expect(await pageDictionnaire.dataGridListBoxCritereRecherche.count()).toBeGreaterThanOrEqual(7);
        })

        test ('CheckBox [ETAT] - Is Visible', async () =>  {
            await fonction.isDisplayed(pageDictionnaire.dataGidCheckboxEtatTraduction);
        })

        test ('Tr [ELEMENT A TRADUIRE][0] - Click', async () =>  {
            await fonction.clickAndWait(pageDictionnaire.dataGridUnElementAtraduire.first(), page);
        })

        test ('Tr [TRADUCTION DESIGNATION] >= 1', async () =>  {            
            expect(await pageDictionnaire.dataGridTableauTraduction.count()).toBeGreaterThanOrEqual(1);
        })

        test ('InputField [TRADUCTION DESIGNATION] - Is Visible', async () =>  {
            await fonction.isDisplayed(pageDictionnaire.dataGridInputTraduction);
        })

        test ('Button [SAUVEGARDER] - Is Visible', async () =>  {
            await fonction.isDisplayed(pageDictionnaire.buttonSauvegarder);
        })

    })

    //--------------------------PAGE ADMIN----------------------------------------------------------------------//

    test.describe ('Page [ADMIN]' , async () =>  {

        var sNomPage:string = 'admin';
        test ('Menu [ADMIN] - Click', async () =>  {
            await menu.click(sNomPage, page);
        })

        test ('Button [DESACTIVER/REACTIVER ACCES APPLICATION] - Is Visible', async () =>  {
            await fonction.isDisplayed(pageAdmin.buttonActiverDesactiveAccesAppli);
        })

        test ('ListBox [CACHE] - Is Visible', async () =>  {
            await fonction.isDisplayed(pageAdmin.listBoxSelectCache);
        })

        test ('ListBox [SELECT OPTION] >= 6', async () => {
            expect(await pageAdmin.listBoxSelectOpen.count()).toBeGreaterThanOrEqual(6);
        })

        test ('Button [SUPPRIMER] - Is Visible', async () =>  {
            await fonction.isDisplayed(pageAdmin.buttonSupprimerCache);
        })

        test ('Button [VOIR API AVEC SWAGGER] - Is Visible', async () =>  {
            await fonction.isDisplayed(pageAdmin.buttonVoirApiSwagger);
        })

    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
    
})