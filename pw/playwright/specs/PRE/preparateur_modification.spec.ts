/**
 * 
 * @author JC CALVIERA
 * @since 2024-01-26
 * 
 */

const xRefTest      = "PRE_PRE_MOD";
const xDescription  = "Modifier un préparateur";
const xIdTest       =  2026;
const xVersion      = '3.6';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PREPARATION',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['A exécuter après le Test PRE_PRE_CRE'],
    params      : ['plateformeOrigine','plateforme'],
    fileName    : __filename
}

//------------------------------------------------------------------------------------

import { test, type Page }              from '@playwright/test';

import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';

import { MenuPreparation }              from '@pom/PRE/menu.page';
import { ProdGestionPreparateursPage }  from '@pom/PRE/productivite-gestion_preparateurs.page';

import { CartoucheInfo, TypeListBox }   from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuPreparation;
let pageGestion         : ProdGestionPreparateursPage;

//------------------------------------------------------------------------------------

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

const sPlateformeOrigine= fonction.getInitParam('plateformeOrigine', 'Chaponnay');
const sPlateforme       = fonction.getInitParam('plateforme', 'Cremlog');
const sNomParam         = fonction.getLocalConfig('nomPreparateur');
const sNom              = sNomParam.toUpperCase();
const sPrenom           = 'TEST-AUTO_Prenom_Modifié' + fonction.getToday('us');

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage();
    menu        = new MenuPreparation(page, fonction);
    pageGestion = new ProdGestionPreparateursPage(page);
    const helper= new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']' , () => {
    
    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [PRODUCTIVITE]', async () => {   
        
        var sNomPage:string = 'productivite';
        test ('Page [PRODUCTIVITE] - Click', async () => {
            await menu.click(sNomPage, page);
        })
        
        test ('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);
        }) 

        test ('ListBox [PLATEFORME] = "' + sPlateformeOrigine + '"', async () => {            
            await menu.selectPlateforme(sPlateformeOrigine, page);                     // Sélection d'une plateforme 
            log.set('Plateforme : ' + sPlateformeOrigine);
        })

        test.describe ('Onglet [GESTION PREPARATEUR]', async () => {   

            var sNomOnglet:string = 'Gestion préparateur'
            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage,'gestionPreparateurs', page);         
            })

            test ('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 
            
            test ('CheckBox [ACTIF] = Uncheck', async () => {
                await fonction.clickElement(pageGestion.checkBoxActif);
                await fonction.wait(page, 250);         // On attend que le liste se raffraîchisse
                await fonction.clickElement(pageGestion.checkBoxActif);
                await fonction.wait(page, 250);         // On attend que le liste se raffraîchisse
            })

            test ('Input [NOM PREPARATEUR] = "TEST-AUTO_Nom"', async () => {
                await fonction.sendKeys(pageGestion.inputSearchPreparateur, sNom, false, 'Nom Préparateur');
                await fonction.wait(page, 250);         // On attend que le liste se raffraîchisse
            })
    
            test ('CheckBox [PREPARATEUR][0] - Click', async () => { 
                await fonction.clickElement(pageGestion.trListePreparateurs.nth(0));
            })

            var sNomPopin = 'MODIFIER UN PREPARATEUR';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test ('Button [MODIFIER UN PREPARATEUR]- Click', async () => {
                    await fonction.clickAndWait(pageGestion.buttonPreparateurUpdate, page);
                })           

                test ('Input [NOM] = "'+  sNom + '"', async () => {
                    await fonction.sendKeys(pageGestion.pPinputCrePreNom, sNom, false, 'Nom');
                })              

                test ('Input [PRENOM] = "'+  sPrenom + '"', async () => {
                    await fonction.sendKeys(pageGestion.pPinputCrePrePrenom, sPrenom, false, 'Prénom');
                })               

                test ('ListBox [EQUIPE][rnd] - Select', async () => { 
                    const oList:TypeListBox = {
                        sLibelle        : 'Equipe',
                        sInput          : pageGestion.pPlistBoxCrePreEquipe,
                        sSelectorChoice : 'p-dropdownitem li span',
                        bVerbose        : true,
                        bIgnoreFirstline: false,
                        iWaitFor        : 0,
                        page            : page,
                        bChained        : false
                    }
                    await fonction.selectRandomListBox(oList);
                })

                test ('ListBox [STATUT][rnd] - Select', async () => { 
                    const oList:TypeListBox = {
                        sLibelle        : 'Statut',
                        sInput          : pageGestion.pPlistBoxCrePreStatut,
                        sSelectorChoice : 'p-dropdownitem li span',
                        bVerbose        : true,
                        bIgnoreFirstline: false,
                        iWaitFor        : 0,
                        page            : page,
                        bChained        : false
                    }
                    await fonction.selectRandomListBox(oList);;
                })
                
                test ('DatePeacker [DATE ENTREE] = "last day of month"', async () => {
                    await fonction.clickElement(pageGestion.pPdatepickerCrePreEntree);
                    const sDateEntree = await pageGestion.pPcalendarCrePre.last().textContent();
                    await fonction.clickElement(pageGestion.pPcalendarCrePre.last());
                    await fonction.addDataSheet('InputField', 'Date Entree', sDateEntree);
                })   

                test ('Toggle Button [ACTIF][rnd] - Click', async () => {
                    await fonction.clickToggleButton(pageGestion.pPcheckBoxCrePreActif, 0.5, false, 'Actif');
                })

                test ('Toggle Button [PREPARATEUR EN VOCAL][rnd] - Click', async () => {
                    await fonction.clickToggleButton(pageGestion.pPcheckBoxCrePrePrepaVocal, 0.5, false, 'Préparateur en Vocal');
                })

                test ('Toggle Button [RESPONSABLE][rnd] - Click', async () => {
                    await fonction.clickToggleButton(pageGestion.pPcheckBoxCrePreResponsable, 0.5, false, 'Responsable');
                })

                test ('Toggle Button [RECEPTIONNAIRE][rnd] - Click', async () => {
                    await fonction.clickToggleButton(pageGestion.pPcheckBoxCrePreReception, 0.5, false, 'Réceptionnaire');
                })

                test ('Toggle Button [TEMPS PARTIEL][rnd] - Click', async () => {
                    await fonction.clickToggleButton(pageGestion.pPcheckBoxCrePreTpsPartiel, 0.5, false, 'Temps Partiel');
                })

                test ('Toggle Button [CHARGEUR][rnd] - Click', async () => {
                    await fonction.clickToggleButton(pageGestion.pPcheckBoxCrePreChargeur, 0.5, false, 'Chargeur');
                })

                test ('Toggle Button [MAGASINIER][rnd] - Click', async () => {
                    await fonction.clickToggleButton(pageGestion.pPcheckBoxCrePreMagasinier, 0.5, false, 'Magasinier');
                })

                test ('CheckBox [PLATEFORME][rnd] - Select', async () => { 
                    var iNbChoix = await pageGestion.pPcheckBoxCrePreListPlatef.count();
                    // On essaye de cliquer sur un choix au hasard jusqu'à ce que le choix sélectionné soit différente de sPlateforme
                    do {
                        var iRnd = Math.floor(fonction.random() * (iNbChoix - 1) + 1);
                        var sChoix = await pageGestion.pPcheckBoxCrePreListPlatef.nth(iRnd).textContent();
                    } while (sChoix == sPlateforme);
                    log.set('Plateforme (rnd) : ' + sChoix);
                    await fonction.clickElement(pageGestion.pPcheckBoxCrePreListPlatef.nth(iRnd));
                    await fonction.addDataSheet('CheckBox', 'Plateforme', sChoix);
                })

                test ('CheckBox [PLATEFORME] = "' + sPlateforme + '" - Click', async () => { 
                    await fonction.clickElement(page.locator('p-checkbox label:text-is("' + sPlateforme + '")'));
                    log.set('Plateforme (2) : ' + sPlateforme);
                    await fonction.addDataSheet('CheckBox', 'Plateforme Obligatoire', sPlateforme);
                })  

                test ('Button [MODIFIER]- Click', async () => {
                    await fonction.clickAndWait(pageGestion.pPbuttonModPreModifier, page);
                })              

            })

        }) //-- End Describe Onglet  

    }) //-- End Describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})