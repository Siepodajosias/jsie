/**
 * 
 * @author ABDOUL SARBA
 * @since 2025-04-26
 * 
 */

const xRefTest     = "BUD_ICA_RIC";
const xDescription = "Renseigner les impacts calendaires sur les mois de l'exercice comptable";
const xIdTest      = 6901;
const xVersion     = '3.6';

var info: CartoucheInfo = {
    desc        : xDescription,
    appli       : 'BUDGET',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Step 1/6', 'Pipeline_BUD - E2E_Création du nouvel exercice avec atterrissage'],
    params      : ['impactCalendaire'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------------------------------------------------

import { test, type Page }                  from '@playwright/test';

import { CartoucheInfo }                    from '@commun/types';

import { Help }                             from '@helpers/helpers';
import { TestFunctions }                    from '@helpers/functions';
import { Log }                              from '@helpers/log';

import { MenuBudgets }                      from '@pom/BUD/menu.page';
import { ParametrageImpactsCalendaires }    from '@pom/BUD/parametrage_impacts_calendaires.page';
import { ParametrageOverturesSaisies }      from '@pom/BUD/parametrage_ouverture_saisies.page';

//----------------------------------------------------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuBudgets;
let paramImpact         : ParametrageImpactsCalendaires;
let paramOuverture      : ParametrageOverturesSaisies;

const log               = new Log();
const fonction          = new TestFunctions(log);

fonction.importJdd();                                                   // Import du JDD pour le bout en bout  

var sImpactCalendaire   = fonction.getInitParam('impactCalendaire', '2');

var oData = {
    iAnneeExercice: 0,                                                  // Année de l'exercice comptable
    bExerciceCree: false,                                               // Indique si l'exercice comptable a déjà été créé
}

//---------------------------------------------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuBudgets(page, fonction);
    paramImpact     = new ParametrageImpactsCalendaires(page);
    paramOuverture  = new ParametrageOverturesSaisies(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({ }, testInfo) => {
    await fonction.close(testInfo);
})

//---------------------------------------------------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [PARAMETRAGE]', async () => {

        var sNomPage:string = 'parametrage';
        test ('Menu [' + sNomPage.toUpperCase() + '] - Click', async () => {
            await menu.click(sNomPage, page);
        })

        const sNomOnglet:string = 'Impacts Calendaires';
        test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async () => {

            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () =>  {

                //-- Si l'exercice est déjà créé, le bouton de création d'exercice n'est pas visible
                oData.bExerciceCree = await paramOuverture.buttonCreerNouvelExercice.isVisible({timeout: 5000});

                if (oData.bExerciceCree) {

                    log.set('L\'exercice comptable existe déjà, on ne le recrée pas.');

                    //-- Récupération de la valeur de l'année de l'exercice comptable depuis l'information contenue dans la liste déroulante "Année Exercice"
                    const sAnneeExercice:string = await paramOuverture.listboxAnneeExercice.locator('option').first().textContent();
                    oData.iAnneeExercice = parseInt(sAnneeExercice.trim());

                } else {

                    log.set('L\'exercice comptable n\'existe pas, on le crée.');

                    //-- Récupération du texte affiché sur le bouton. Ex : "Créer un nouvel exercice (2026)"
                    const sTexteBouton:string = await paramOuverture.buttonCreerNouvelExercice.textContent();

                    //-- Extraction des données : "Créer un nouvel exercice (2026)" => 2026
                    const pattern: RegExp = /\((\d+)\)/;

                    //-- Recherche du motif dans la chaîne
                    const match: RegExpMatchArray | null = sTexteBouton.match(pattern);

                    //-- Extraction de l'année proposée par défaut par l'application
                    oData.iAnneeExercice = parseInt(match[1]);
                    log.set(sTexteBouton + ' => ' + oData.iAnneeExercice.toString());

                }

                //-- Préparation de l'objet devant être sauvegardé dans le JDD
                log.set('Année de l\'exercice comptable : ' + oData.iAnneeExercice.toString());

                await menu.clickOnglet(sNomPage, 'impactCalendaire', page);

            })

            test ('Input [POURCENTAGE FERME LE DIMANCHE][1 à x] = "' + sImpactCalendaire + '"', async () => {
                var iNbInput:number= await paramImpact.inputimpactCalendaireFermeDimanchePourcen.count();
                for (let i  = 0; i < iNbInput; i++) {
                    await fonction.sendKeys(paramImpact.inputimpactCalendaireFermeDimanchePourcen.nth(i), sImpactCalendaire, false, '% Fermé Dimanche ['+i.toString()+']'); 
                }
            })

            test ('Input [POURCENTAGE OUVERT LE DIMANCHE][1 à x] = "' + sImpactCalendaire + '"', async () => {
                var iNbInput:number = await paramImpact.inputimpactCalendaireOuvertDimanchePourcen.count();
                for (let i  = 0; i < iNbInput; i++) {
                    await fonction.sendKeys(paramImpact.inputimpactCalendaireOuvertDimanchePourcen.nth(i),sImpactCalendaire, false, '% Ouvert Dimanche ['+i.toString()+']');
                }
            })

            test ('Button [ENREGISTER] - Click', async () => {
                if (await paramImpact.buttonEnregistrer.isEnabled()) {
                    await fonction.clickAndWait(paramImpact.buttonEnregistrer,page);
                } else {
                    log.set('Le bouton [ENREGISTRER] n\'est pas activé, aucune modification à enregistrer.');
                    test.skip();
                }
            })

        })

        //-- Enregistrement des données pour le E2E
        await fonction.writeData(oData);

    })

    test ('Déconnexion', async () => {
         await fonction.deconnexion(page)
    })

})