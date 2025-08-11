/**
 * 
 * @author JC CALVIERA
 * @since 2024-02-26
 * 
 */
const xRefTest      = "ACH_FRA_UPD";
const xDescription  = "Modifier des exceptions aux frais de structure";
const xIdTest       =  2649;
const xVersion      = "3.2";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Successeur de [ACH_FRA_NEW]'],
    params      : ['rayon'],
    fileName    : __filename
};

import { test, type Page, expect}   from '@playwright/test';

import { Help }             from '@helpers/helpers';
import { TestFunctions }    from '@helpers/functions';
import { Log }              from '@helpers/log';

import { MenuAchats }       from '@pom/ACH/menu.page';
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

    page        = await browser.newPage();
    menu        = new MenuAchats(page, fonction);    
    pageFrais   = new PageRefFrais(page);
    const helper= new Help(info, testInfo, page);
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

       var pageName             = 'referentiel';
       var rFraisInitial:number = 0;
       var rNouveauFrais:number = 0;

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
                await fonction.wait(page, 1500);                                                      // On attend que la liste se raffraîchisse
            })

            test ('CheckBox [EXCEPTIONS AUX FRAIS DE STRUCTURE][0] - Click', async () => {

                await fonction.clickElement(pageFrais.checkBoxFraisStructure.first());

                const sIdArticle = await pageFrais.dataGridFraisStructureTdIdArticle.first().textContent();
                log.set('ID Article modifié : ' + sIdArticle);

                const sDesignation = await pageFrais.dataGridFraisStructureTdDesign.first().textContent();
                log.set('Désignation Article modifié : ' + sDesignation);

                const sPlateforme = await pageFrais.dataGridFraisStructureTdPtf.first().textContent();  
                log.set('Plateforme Initiale : ' + sPlateforme);                

                rFraisInitial = parseFloat(await pageFrais.dataGridFraisStructureTdFrais.first().textContent());      
                log.set('Frais Initial : ' + rFraisInitial.toString());
            })

            test ('Button [MODIFIER UNE EXCEPTION POUR STRUCTURE] - Click', async () => {
                await fonction.clickElement(pageFrais.buttonExceptionStructureUpd);
            })

            const sNomPopin = "Modification d'un frais de structure";
            test.describe ('Popin ' + sNomPopin.toUpperCase() + ']', async() => {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () =>  {
                  await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
                })

                test ('Input [FRAIS DE STRUCTURE] = "Frais Initial  + 1"', async () => {
                    rNouveauFrais = rFraisInitial + 1;
                    await fonction.sendKeys(pageFrais.pPajoutFraisStrucInputMontant, rNouveauFrais.toString());
                    log.set("Frais de structure : " + rNouveauFrais.toString());
                })

                test ('ListBox [PLATEFORME DE RECEPTION][rnd]  - Select', async () => {
                    const iNbChoix = await pageFrais.pPajoutFraisStrucListBoxPtf.locator('option').count();
                    const iPosChoix = Math.floor(fonction.random() * (iNbChoix - 1)) + 1;
                    const sLibelleChoix = await pageFrais.pPajoutFraisStrucListBoxPtf.locator('option').nth(iPosChoix).textContent();
                    log.set('Plateforme Sélectionnée : ' + sLibelleChoix);
                    await pageFrais.pPajoutFraisStrucListBoxPtf.selectOption(sLibelleChoix);
                })

                test ('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickElement(pageFrais.pPajoutFraisStrucButtonEnreg);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () =>  {
                  await fonction.popinVisible(page, sNomPopin.toUpperCase(), false);
                })

            })  // End Popin

            test ('td [FRAIS DE STRUCTURE][0] = "Frais Initial  + 1"', async () => {
                const sFrais = await pageFrais.dataGridFraisStructureTdFrais.first().textContent();      
                log.set('Frais Modifié : ' + sFrais);
                expect(sFrais).toEqual(rNouveauFrais.toString() + ' €')
            })

       })  // End  Onglet

    })  // End  Page

    test('Déconnexion', async () => {
      await fonction.deconnexion(page);
    });

})  // End describe