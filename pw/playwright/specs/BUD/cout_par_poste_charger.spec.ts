/**
 * 
 * @author Abdoul SARBA
 * @since 2025-04-28
 * 
 */

const xRefTest     = "BUD_CHA_CPP ";
const xDescription = "Charger les couts par poste";
const xIdTest      = 7042;
const xVersion     = '3.5';

var info: CartoucheInfo = {
    desc        : xDescription,
    appli       : 'BUDGET',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Step 4/6', 'Pipeline_BUD - E2E_Création du nouvel exercice avec atterrissage'],
    params      : ["directionExploitation"],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------------------------------------------------

import { test, expect, type Page }  from '@playwright/test';

import { CartoucheInfo }            from '@commun/types';

import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';

import { MenuBudgets }              from '@pom/BUD/menu.page';
import { ParametrageChargement }    from '@pom/BUD/parametrage_chargement.page';

import * as path                    from 'path';
import * as fs                      from 'fs';

//----------------------------------------------------------------------------------------------------------------------------------

let page                    : Page;
let menu                    : MenuBudgets;
let parametrageChargement   : ParametrageChargement;

//----------------------------------------------------------------------------------------------------------------------------------

const log                   = new Log();
const fonction              = new TestFunctions(log);

var oData:any               = fonction.importJdd();                     // Import du JDD pour le bout en bout 

var sDirectionExploitation  = fonction.getInitParam('directionExploitation','fresh.,Grand Frais BCV,Grand Frais Crèmerie,Grand Frais FL');

const filePath              = path.join(fonction.getLocalConfig('conFileName'), fonction.getLocalConfig('pathCoutPoste'));

var iAnneeCourante:number;

if (oData !== undefined) {                                              // On est dans le cadre d'un E2E. Récupération des données temporaires
    iAnneeCourante          = oData.iAnneeExercice; 
    console.log('Année courante récupérée : ' + iAnneeCourante.toString());    
} else {
    const maDate            = new Date();
    iAnneeCourante          = maDate.getFullYear(); 
    console.log('Année courante calculée : ' + iAnneeCourante.toString());
}

const sAnneeCourante        = String(iAnneeCourante);
const sAnneePrecedente      = String(iAnneeCourante - 1);
const sAnneeSuivante        = String(iAnneeCourante + 1);

//---------------------------------------------------------------------------------------------------------------------------------

/**
 * Charge les coûts par poste pour les directions d'exploitation fresh., Grand Frais FL, Grand Frais Crèmerie, Grand Frais BCV
 * en important des fichiers de type CSV contenant les données du budget.
 * Les fichiers sont placés dans le répertoire C:/pw/playwright/_data/BUD/Budget_cout_par_post et ont pour nom coutparposte<direction>.csv
 * où <direction> est le nom de la direction sans espace.
 */
var ChargerCoutParPoste = async () => {

    const aDirectionExploitation = sDirectionExploitation.split(',');

    for (const direction of aDirectionExploitation) {

        // Import du fichier de coefficient de progression
        const [fileChooser] = await Promise.all([
            page.waitForEvent('filechooser'),
            await fonction.clickElement(parametrageChargement.buttonParcourir.first())
        ]);

        //-- Suppression des espaces contenus dans le libellé de la direction d'exploitation
        const sFichier = direction.replace(/\s+/g, '');

        //-- Chemin complet du fichier à importer
        const sCheminFichierImport = `${filePath}${sFichier}.csv`;
        console.log(' [i] Chargement du fichier : ' + sCheminFichierImport);

        //-- Récupération des données du fichier CSV
        var csvData = fs.readFileSync(sCheminFichierImport, 'utf-8');

        //-- Substitution des variables dans le fichier CSV
        csvData = csvData.replace(/{AnneeCourante}/gm, sAnneeCourante);
        csvData = csvData.replace(/{AnneePrecedente}/gm, sAnneePrecedente);
        csvData = csvData.replace(/{AnneeSuivante}/gm, sAnneeSuivante);

        //-- Chemin complet du fichier à Exporter
        const sCheminFichierExport = `coutparposte${sFichier}.csv`;

        //-- Écriture du fichier CSV avec les données remplacées
        fs.writeFileSync(sCheminFichierExport, csvData, 'utf-8');
        console.log(' [i] Sauvegarde du fichier : ' + sCheminFichierExport);

        //-- Import du Fichier
        await fileChooser.setFiles(sCheminFichierExport);
        console.log(' [i] Import du fichier : ' + sCheminFichierExport);

        await expect(parametrageChargement.fichierChargerRecementCoutPoste).toContainText(sCheminFichierExport);

        await fonction.isDisplayed(parametrageChargement.iconeSuccessChargement.first());      

    }

}

//---------------------------------------------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                          = await browser.newPage();
    menu                          = new MenuBudgets(page, fonction);
    parametrageChargement         = new ParametrageChargement(page);
    const helper                  = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({ }, testInfo) => {
    await fonction.close(testInfo);
})

//---------------------------------------------------------------------------------------------------------------------------------
test.describe.serial ('[' + xRefTest + ']', () => {

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

        test.describe ('Onglet [CHARGEMENT]', async () => {

            var sNomOnglet:string = 'chargement';
            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'chargement', page);
            })

            test ('Button [EXPORTER TEMPLATE COUTS] - Click', async () => {
                await fonction.clickAndWait(parametrageChargement.buttonExporterTemplateCout,page);
            })

            test ('** Traitement ** ', async () => {        
                await ChargerCoutParPoste();
            })

        })

    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})