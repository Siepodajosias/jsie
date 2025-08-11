/**
 * 
 * @author ABDOUL SARBA
 * @since 2025-04-28
 * 
 */

const xRefTest     = "BUD_CHA_MSH";
const xDescription = "Charger la masse salariale et les heures travaillées";
const xIdTest      = 9348;
const xVersion     = '3.3';

var info: CartoucheInfo = {
    desc        : xDescription,
    appli       : 'BUDGET',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Step 5/6', 'Pipeline_BUD - E2E_Création du nouvel exercice avec atterrissage'],
    params      : ['directionExploitation'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------------------------------------------------

import { expect, test, type Page }  from '@playwright/test';

import { CartoucheInfo }            from '@commun/types';

import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';

import { MenuBudgets }              from '@pom/BUD/menu.page';
import { ParametrageChargement }    from '@pom/BUD/parametrage_chargement.page';

import * as fs                      from 'fs';
import * as path                    from 'path';

//----------------------------------------------------------------------------------------------------------------------------------

let page                    : Page;
let menu                    : MenuBudgets;
let parametrageChargement   : ParametrageChargement;

//----------------------------------------------------------------------------------------------------------------------------------

const log                   = new Log();
const fonction              = new TestFunctions(log);

var oData:any               = fonction.importJdd();                     // Import du JDD pour le bout en bout 

var sDirectionsExploitation = fonction.getInitParam('directionExploitation','fresh.,Grand Frais BCV,Grand Frais Crèmerie,Grand Frais FL');

const filePathImport        = path.join(fonction.getLocalConfig('conFileName'), fonction.getLocalConfig('pathMasseSal'));
const filePathExport        = path.join(fonction.getLocalConfig('conFileName'), fonction.getLocalConfig('pathTemp'));

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
 * Les fichiers sont placés dans le répertoire C:/pw/playwright/_data/BUD/Budget_masse_salariale et ont pour nom massesalariale<direction>.csv
 * où <direction> est le nom de la direction sans espace.
 */
var ChargerMasseSalariale = async () => {

    const aDirectionsExploitation = sDirectionsExploitation.split(',');

    //-- Création du répertoire d'accueil des fichiers exportés si innexistant
    try {
	    fs.mkdirSync(filePathExport);
    } catch (err) {
        if (err.code !== 'EEXIST') {
            console.error('Erreur lors de la création du répertoire :', err);
        } else {
            console.log('Le répertoire existe déjà :', filePathExport);
        }
    }

    for (const sDirection of aDirectionsExploitation) {

        //-- Import du fichier des masses salariales
        const [fileChooser] = await Promise.all([
            page.waitForEvent('filechooser'),
            fonction.clickElement(parametrageChargement.buttonParcourir.nth(1))
        ]);

        //-- Suppression des espaces contenus dans le libellé de la direction d'exploitation
        const sFichier = sDirection.replace(/\s+/g, '');

        //-- Chemin complet du fichier à importer
        const sCheminFichierImport = `${filePathImport}${sFichier}.csv`;
        console.log(' [i]  Chargement du fichier : ' + sCheminFichierImport);

        //-- Récupération des données du fichier CSV
        var csvData = fs.readFileSync(sCheminFichierImport, 'utf-8');

        //-- Substitution des variables dans le fichier CSV
        csvData = csvData.replace(/{AnneeCourante}/gm, sAnneeCourante);
        csvData = csvData.replace(/{AnneePrecedente}/gm, sAnneePrecedente);
        csvData = csvData.replace(/{AnneeSuivante}/gm, sAnneeSuivante);
        
        //-- Chemin complet du fichier à Exporter
        const sCheminFichierExport = `${filePathExport}massesalariale_${sFichier}.csv`;

        //-- Écriture du fichier CSV avec les données remplacées
        fs.writeFileSync(sCheminFichierExport, csvData, 'utf-8');
        console.log(' [i] Sauvegarde du fichier : ' + sCheminFichierExport);

        //-- Import du Fichier
        await fileChooser.setFiles(sCheminFichierExport);

        //-- Nom théorique attendu dans la zone de confirmation d'enregistrement
        const sFileName =`massesalariale${sFichier}.csv`;

        await expect(parametrageChargement.fichierChargerRecementMassSalariale).toContainText(sFileName); 

        await fonction.isDisplayed(parametrageChargement.iconeSuccessChargement.nth(1));  

    }

}

//---------------------------------------------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                    = await browser.newPage();
    menu                    = new MenuBudgets(page, fonction);
    parametrageChargement   = new ParametrageChargement(page);
    const helper            = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({ }, testInfo) => {
    await fonction.close(testInfo);
});

//---------------------------------------------------------------------------------------------------------------------------------
test.describe.serial('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [PARAMETRAGE]', async () => {

        var sNomPage:string = 'parametrage';

        test ('Menu [' + sNomPage.toUpperCase() + '] - Click', async () => {
            await menu.click(sNomPage, page);
        });

        var sNomOnglet:string = 'chargement';
        test.describe('Onglet [' + sNomOnglet.toUpperCase() + ']', async () => {

            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'chargement', page);
            })

            test ('Button [EXPORTER TEMPLATE COUTS] - Click', async () => {
                await fonction.clickElement(parametrageChargement.buttonExporterTemplateMsEtHt);
            })

            test ('** Traitement ** ', async () => {        
                await ChargerMasseSalariale();
            });

            test ('Button [TABLEAU RECAPITULATIF] - Click', async () => {
                await fonction.clickAndWait(parametrageChargement.buttonRecapitulatifCode,page);
            })

            test ('Button [FERMER] - Click', async () => {
                await fonction.clickAndWait(parametrageChargement.pButtonFermer,page);
            })  

        })

    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})