/**
 * 
 * @author JC CALVIERA
 * @since 2024-02-26
 * 
 */
const xRefTest      = "ACH_FRA_DEL";
const xDescription  = "Supprimer des exceptions aux frais de structure";
const xIdTest       =  2650;
const xVersion      = "3.1";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Successeur de [ACH_FRA_UPD]'],
    params      : ['rayon'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page, expect}   from '@playwright/test';

import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { Log }              from '@helpers/log.js';

import { MenuAchats }       from '@pom/ACH/menu.page.js';
import { PageRefFrais }     from '@pom/ACH/referentiel_frais.page';

import { CartoucheInfo }    from '@commun/types';

//------------------------------------------------------------------------------------

let page                    : Page;
 
var pageFrais               : PageRefFrais;
var menu                    : MenuAchats;

const log                   = new Log();
const fonction              = new TestFunctions(log);

const sRayon                = fonction.getInitParam('RAYON', 'Fruits et légumes');  // ("Fruits et légumes" OU "Poissonnerie" uniquement)

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);    
    pageFrais       = new PageRefFrais(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async() => {
       await fonction.connexion(page);
    })
  
    test.describe('Page [REFERENTIEL]', async() => {

        var pageName:string      = 'referentiel';
        var rFraisInitial:number = 0;
        var sIdArticle:string    = '';
        var sPlateforme:string   = '';
        var iNbFrais:number      = 0;

        test('ListBox [RAYON] = "' + sRayon + '"', async() => {
            await menu.selectRayonByName(sRayon, page);
        });

        test("Menu [REFERENTIEL] - Click ", async () => {
            await menu.click(pageName, page);
        })

        test.describe ('Onglet [FRAIS]', async() => {

            test ('Onglet [FRAIS] - Click', async () => {
                await menu.clickOnglet(pageName, 'frais',page);                
            })   

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            test ('Header DataGrid [FRAIS DE STRUCTURE] - Click x 2', async () => {
                await fonction.clickElement(pageFrais.dataGridFraisStructureThFrais);
                await fonction.clickElement(pageFrais.dataGridFraisStructureThFrais);
                await fonction.wait(page, 10500);                                                      // On attend que la liste se raffraîchisse
            })

            test ('CheckBox [EXCEPTIONS AUX FRAIS DE STRUCTURE][0] - Click', async () => {

                await fonction.clickElement(pageFrais.checkBoxFraisStructure.first());

                sIdArticle = await pageFrais.dataGridFraisStructureTdIdArticle.first().textContent();
                log.set('Code Article : ' + sIdArticle);

                const sDesignation = await pageFrais.dataGridFraisStructureTdDesign.first().textContent();
                log.set('Désignation Article : ' + sDesignation);

                sPlateforme = await pageFrais.dataGridFraisStructureTdPtf.first().textContent();  
                log.set('Plateforme : ' + sPlateforme);                

                rFraisInitial = parseFloat(await pageFrais.dataGridFraisStructureTdFrais.first().textContent());      
                log.set('Frais : ' + rFraisInitial.toString());
            })
            
            test ('InputField [FILTRE ARTICLE]#1 = "Article Cible"', async () => {
                await fonction.sendKeys(pageFrais.inputFiltreArticleStructure, sIdArticle);
                await fonction.wait(page, 2500);                                                      // On attend que la liste se raffraîchisse
            })

            test ('InputField [FILTRE PLATEFORME]#1 = "Plateforme Cible"', async () => {
                await fonction.sendKeys(pageFrais.inputFiltreArticlePlateforme, sPlateforme);
                await fonction.wait(page, 2500);                                                      // On attend que la liste se raffraîchisse
                iNbFrais = await pageFrais.checkBoxFraisStructure.count();
                log.set('Nombre de frais pouvant répondre à ces filtres AVANT suppression : ' + iNbFrais.toString());
            })

            test ('Button [SUPPRIMER UNE EXCEPTION POUR STRUCTURE] - Click', async () => {
                await fonction.clickElement(pageFrais.buttonExceptionStructureDel);
            })

            const sNomPopin = "Suppression d'un frais de structure";
            test.describe ('Popin ' + sNomPopin.toUpperCase() + ']', async() => {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () =>  {
                  await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
                })

                test ('Button [OUI] - Click', async () => {
                    await fonction.clickElement(pageFrais.pPsuppFraisStrucButtonOui);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () =>  {
                  await fonction.popinVisible(page, sNomPopin.toUpperCase(), false);
                })

            })  // End Popin

            test ('InputField [FILTRE ARTICLE]#2 = "Article Cible"', async () => {
                await fonction.sendKeys(pageFrais.inputFiltreArticleStructure, sIdArticle);
                await fonction.wait(page, 2500);                                                      // On attend que la liste se raffraîchisse
            })

            test ('InputField [FILTRE PLATEFORME]#2 = "Plateforme Cible"', async () => {
                await fonction.sendKeys(pageFrais.inputFiltreArticlePlateforme, sPlateforme);
                await fonction.wait(page, 2500);                                                      // On attend que la liste se raffraîchisse
            })
            
            test ('CheckBox [FRAIS DE STRUCTURE][Article Cible][Plateforme Cible] - Is NOT Found', async () => {
                const iNbFraisApresSupp:number = await pageFrais.checkBoxFraisStructure.count();
                log.set('Nombre de frais pouvant répondre à ces filtres APRES suppression : ' + iNbFraisApresSupp.toString());
                expect.soft(iNbFraisApresSupp).toEqual(iNbFrais - 1);
            })

       })  // End  Onglet

    })  // End  Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})  // End describe