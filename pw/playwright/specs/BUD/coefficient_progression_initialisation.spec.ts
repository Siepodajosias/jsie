/**
 * 
 * @author ABDOUL SARBA
 * @since 2025-04-26
 * 
 */

const xRefTest     = "BUD_OUV_POE";
const xDescription = "Paramétrer avant ouverture des saisies sur DE existante";
const xIdTest      = 7044;
const xVersion     = '3.3';

var info: CartoucheInfo = {
    desc        : xDescription,
    appli       : 'BUDGET',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Step 2/6', 'Pipeline_BUD - E2E_Création du nouvel exercice avec atterrissage'],
    params      : ["directionExploitation"],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------------------------------------------------

import { test, type Page }              from '@playwright/test';

import { CartoucheInfo }                from '@commun/types';

import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';

import { MenuBudgets }                  from '@pom/BUD/menu.page';
import { ParametrageCoeffProgression }  from '@pom/BUD/parametrage_coefficient_progression.page';

import * as fs                          from 'fs';
import * as path                        from 'path';

//----------------------------------------------------------------------------------------------------------------------------------

let page                    : Page;
let menu                    : MenuBudgets;
let paramCoeffProg          : ParametrageCoeffProgression;

//----------------------------------------------------------------------------------------------------------------------------------

const log                   = new Log();
const fonction              = new TestFunctions(log);

var oData:any               = fonction.importJdd();                     // Import du JDD pour le bout en bout 

var sDirectionExploitation  = fonction.getInitParam('directionExploitation','fresh.,Grand Frais BCV,Grand Frais Crèmerie,Grand Frais FL');

const filePathImport        = path.join(fonction.getLocalConfig('conFileName'), fonction.getLocalConfig('pathCoefficient'));
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
 * Importe les coefficients de progression pour les directions d'exploitation et les groupes d'articles
 * @description
 * 1. Importe le fichier de coefficients de progression pour chaque direction d'exploitation
 * 2. Modifie à la volée les dates de l'année courante, précédente et suivante dans le fichier CSV
 * 3. Initialise les coefficients de progression pour chaque groupe d'article
 * 4. Enregistre les coefficients de progression
 */
var importCoeff = async () => {

    var aDirectionExploitation = sDirectionExploitation.split(',');

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

    for (const direction of aDirectionExploitation) {

        await fonction.clickElement(paramCoeffProg.listBoxDirectionExploition);

        await paramCoeffProg.listBoxDirectionExploition.selectOption({ label: direction });

        await fonction.clickElement(paramCoeffProg.buttonExporterTemplate);

        // Import du fichier de coefficient de progression
        const [fileChooser] = await Promise.all([
            page.waitForEvent('filechooser'),
            fonction.clickElement(paramCoeffProg.buttonImporter)
        ]);

        //-- Suppression des espaces contenus dans le libellé de la direction d'exploitation
        const sFichier = direction.replace(/\s+/g, '');

        //-- Chemin complet du fichier à importer
        const sCheminFichierImport = `${filePathImport}${sFichier}.csv`;
        console.log(' [i] Chargement du fichier : ' + sCheminFichierImport);

        //-- Récupération des données du fichier CSV
        var csvData = fs.readFileSync(sCheminFichierImport, 'utf-8');

        //-- Substitution des variables dans le fichier CSV
        csvData = csvData.replace(/{AnneeCourante}/gm, sAnneeCourante);
        csvData = csvData.replace(/{AnneePrecedente}/gm, sAnneePrecedente);
        csvData = csvData.replace(/{AnneeSuivante}/gm, sAnneeSuivante);

        //-- Chemin complet du fichier à Exporter
        const sCheminFichierExport = `${filePathExport}coefProgression_${sFichier}.csv`;

        //-- Écriture du fichier CSV avec les données remplacées
        fs.writeFileSync(sCheminFichierExport, csvData, 'utf-8');
        console.log(' [i] Sauvegarde du fichier : ' + sCheminFichierExport);

        //-- Import du Fichier
        await fileChooser.setFiles(sCheminFichierExport);
        console.log(' [i] Import du fichier : ' + sCheminFichierExport);

        const iNbgroupeArticle  = await paramCoeffProg.listBoxGroupeArticleItem.count();

        for (let i = 0; i < iNbgroupeArticle; i++) {

            const sOptionValue  = await paramCoeffProg.listBoxGroupeArticleItem.nth(i).getAttribute('value');
            
            if (sOptionValue) {

                // Clique sur le select + sélectionne l'option par value
                await fonction.clickElement(paramCoeffProg.listBoxGroupeArticle);
                await paramCoeffProg.listBoxGroupeArticle.selectOption(sOptionValue);

                await fonction.clickElement(paramCoeffProg.buttonInitialiser);

                // choix de la direction d'exploiation dans la poppin
                await fonction.clickElement(paramCoeffProg.pListboxDirectionExploitation);
                await fonction.clickElement(paramCoeffProg.pListboxDirectionExploitationItem.filter({ hasText: direction }));

                // choix du groupe d'article dans la poppin
                await fonction.clickElement(paramCoeffProg.pListboxGroupeArticle);
                await fonction.clickElement(paramCoeffProg.pListboxGroupeArticleItem.first());
                await fonction.clickElement(paramCoeffProg.pButtonInitialiser);

                //clique sur le bouton [ENREGISTRER]
                await fonction.clickElement(paramCoeffProg.buttonEnregistrer);
            }

        }

    }

}

//---------------------------------------------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuBudgets(page, fonction);
    paramCoeffProg  = new ParametrageCoeffProgression(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({ }, testInfo) => {
    await fonction.close(testInfo);
});

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

        test.describe ('Onglet [COEFFICIENTS DE PROGRESSION]', async () => {

            var sNomOnglet:string = 'Coefficent de Progression';
            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'coefficientsProgression', page);
            })

            test ('** [TRAITEMENT] ** ', async () => {
                test.setTimeout(1200000);
                await importCoeff();
            })

        })

    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})
