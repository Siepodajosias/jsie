/**
 * 
 * @author JC CALVIERA
 * @since 2024-01-26
 * 
 */

const xRefTest      = "PRE_PRE_CRE";
const xDescription  = "Créer un préparateur";
const xIdTest       =  2025;
const xVersion      = '3.6';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PREPARATION',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme'],
    fileName    : __filename
}

//------------------------------------------------------------------------------------

import { test, type Page }              from '@playwright/test';

import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';

import { MenuPreparation }              from '@pom/PRE/menu.page';
import { ProdGestionPreparateursPage }  from '@pom/PRE/productivite-gestion_preparateurs.page';

import { AutoComplete, CartoucheInfo, TypeListBox }  from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuPreparation;
let pageGestion         : ProdGestionPreparateursPage;

//------------------------------------------------------------------------------------

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

const sPlateforme       = fonction.getInitParam('plateforme', 'Chaponnay');

const sNomParam         = fonction.getLocalConfig('nomPreparateur');
const sNom              = sNomParam;
const sPrenom           = 'TEST-AUTO_Prenom' + fonction.getToday('us');
const iFailCode         = '000';        // code existe déjà en base
const iFailMatricule    = 7777777;      // Matricule existe déjà en base
const iLongueurMatricule= 7;            // Le matricule est composé de 7 caractères
var iCptTentative       = 0;
const iMaxTentative     = 10;

//------------------------------------------------------------------------------------

//-- On essaye 'iMaxTentative' fois de trouver un matricule aléatoirement
var createMatricule = async() => {

    var sMatricule = '';
    for (let iCpt=0; iCpt < iLongueurMatricule; iCpt++){
        sMatricule = sMatricule + Math.floor(fonction.random() * 10).toString();
    }

    log.set('Try Matricule Preparateur : ' + sMatricule);

    await fonction.sendKeys(pageGestion.pPinputCrePreMatricule, sMatricule, false, 'Essai Matricule');
    await fonction.clickElement(pageGestion.pPbuttonCrePreCreer);

    iCptTentative++; 
    
    // Si le message indiquant que le code magasin existe déjà, on retente sa chance...
    var bVisible = await pageGestion.pPfeedBackErrorMessage.isVisible();

    if (bVisible && iCptTentative < iMaxTentative) {
        createMatricule();
    } else {
        if (iCptTentative == iMaxTentative) {
            throw new Error('Ooops : Arret après ' + iMaxTentative + ' essais par sécurité...')
        } else {
            await fonction.addDataSheet('InputField', 'Matricule', sMatricule);
            return sMatricule;
        }
    }

}
  
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

        test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {            
            await menu.selectPlateforme(sPlateforme, page);                     // Sélection d'une plateforme 
            log.set('Plateforme : ' + sPlateforme);
        })

        test.describe ('Onglet [GESTION PREPARATEUR]', async () => {   

            var sNomOnglet:string = 'Gestion préparateur'
            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage,'gestionPreparateurs', page);         
            })

            test ('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 

            test ('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => { 
                await menu.selectPlateforme(sPlateforme, page);
            })

            var sNomPopin:string = 'CREER UN PREPARATEUR';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test ('Button [CREER UN PREPARATEUR]- Click', async () => {
                    await fonction.clickAndWait(pageGestion.buttonCreerPreparateur, page);
                })           

                test ('Input [NOM] = "'+  sNom + '"', async () => {
                    await fonction.sendKeys(pageGestion.pPinputCrePreNom, sNom, false, 'Nom Préparateur');
                    log.set('Nom Préparateur : ' + sNom);
                })                

                test ('Input [PRENOM] = "'+  sPrenom + '"', async () => {
                    await fonction.sendKeys(pageGestion.pPinputCrePrePrenom, sPrenom, false, 'Prénom Préparateur');
                })                

                test ('Input [MATRICULE] = "'+  iFailMatricule + '"', async () => {
                    await fonction.sendKeys(pageGestion.pPinputCrePreMatricule, iFailMatricule, false, 'Matricule'); // pas la peine de méoriser la donnée de test
                }) 

                test ('AutoComplete [CODE] = "'+  iFailCode + '"', async () => {
                    var oData:AutoComplete = {
                        libelle         :'CODE',
                        inputLocator    : pageGestion.pPinputCode.locator('input'),
                        inputValue      : iFailCode,
                        choiceSelector  : '.p-autocomplete-item',
                        selectRandom    : true,
                        typingDelay     : 100,
                        waitBefore      : 500,
                        page            : page
                    }
                    await fonction.autoComplete(oData);
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
                
                test ('DatePeacker [DATE ENTREE] = "1st day of month"', async () => {
                    await fonction.clickElement(pageGestion.pPdatepickerCrePreEntree);
                    const sDateEntree = await pageGestion.pPcalendarCrePre.first().textContent();
                    await fonction.clickElement(pageGestion.pPcalendarCrePre.first());
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

                test ('Input [Matricule][CODE] = rnd', async () => {
                    createMatricule();
                })   

            })

        }) //-- End Describe Onglet  

    }) //-- End Describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})  