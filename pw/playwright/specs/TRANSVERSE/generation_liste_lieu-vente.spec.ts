/**
 * 
 * @author JC CALVIERA
 *  Since 2024-02-15
 */

const xRefTest      = "-- util --";
const xDescription  = "Création d'un fichier de conf 'lieu de vente' / 'lieu de vente avec code'";
const xIdTest       =  0;
const xVersion      = '3.0';

var info = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}   from '@playwright/test';

import { TestFunctions }    from "@helpers/functions";
import { Log }              from "@helpers/log";
import { Help }             from "@helpers/helpers";

import * as fs              from 'fs';
import * as path            from 'path';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }      from "@pom/MAG/menu.page";

//-------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuMagasin;

const log           = new Log();
const fonction      = new TestFunctions(log);

const sDirName      =  path.join(__dirname + '../../../conf/');
const sFileName     = 'lieu_vente.conf.json';

//---------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
})
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    })

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async() => {
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test('File [' + sFileName +'] - Create', async () => {
        
        var listBoxOption = menu.listBoxVille.locator('option');
        var iNbOption     = await listBoxOption.count();       

        log.set('Fichier généré : ' + sDirName + sFileName);
        log.set('Nombre de lieux de vente : ' + iNbOption);

        let oResults = {};

        for(let iIndexOption = 0; iIndexOption < iNbOption; iIndexOption++){

            // Exemple : "Agen Barbusse (G432)"
            var sLieuVenteComplet = await listBoxOption.nth(iIndexOption).textContent();

            // Exemple : " (G432)""
            var aCodeLieuDeVente = sLieuVenteComplet.match(/\s[(][A-Z]{1}\d{3}[)]/gm);

            // Exemple : "Agen Barbusse"
            var sLieuDeVente = sLieuVenteComplet.replace(aCodeLieuDeVente[0], '');

            oResults[sLieuDeVente]  = sLieuVenteComplet;

        }

        // Converting the object to JSON...
        var json = JSON.stringify(oResults, null, 4);

        // Affichage à l'écran pour info 
        console.log(json);

        // Ecriture du fichier
        fs.writeFile(sDirName + sFileName, json, function(err) {
            if(err) {
                console.log(err);
            }
        });

    })

})