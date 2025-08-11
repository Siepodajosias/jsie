/**
 * 
 * @author JC CALVIERA
 *  Since 2024-04-02
 */

const xRefTest      = "MAG_BON_NEW";
const xDescription  = "Création d'un bon d'emballage";
const xIdTest       =  77;
const xVersion      = '3.5';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['ville'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

const { writeFile } = require('fs');

import { expect, test, type Page }      from '@playwright/test';

import { TestFunctions }                from "@helpers/functions";
import { Log }                          from "@helpers/log";
import { Help }                         from '@helpers/helpers';

import { MenuMagasin }                  from '@pom/MAG/menu.page';
import { EmballagesStock }              from '@pom/MAG/emballages-stock.page';

import { AutoComplete, CartoucheInfo }  from '@commun/types';

//-------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pageEmballage       : EmballagesStock;

const log               = new Log();
const fonction          = new TestFunctions(log);

//-----------------------------------------------------------------------------------------

const sJddFile           = fonction.getGlobalConfig('jddEmballage');

const sReferenceVille    = fonction.getInitParam('ville','Marly (G543)');

const sNomRespChargt     = 'RespChgt';
const sNomChauffeur      = 'NomChr';
const sHeureArrivee      = '01';
const sMinuteArrivee     = '01';
const sHeureDepart       = '02';
const sMinuteDepart      = '02';
const sNombrePiles1      = '4';
const sNombreEmballages1 = '8';
const sObservbations     = 'Obs1';
const sObservbation2     = 'Obs1';
const sTypeEmballage1    = 'CHEP1 - Palette chep 100*120 (bleues)';

const sNombrePiles2      = '1';
const sNombreEmballages2 = '1';
const sTypeEmballage2    = 'PLASTIQUE - Palettes plastiques';

// On va créer un objet oData à partir du quel on va stocker les données qui vont intéresser la suite du processus dans l'application stock
var aReferenceVille = sReferenceVille.split(' ');
var oData:any = {
    sNumeroBon :'',
    sNomLieuVente : aReferenceVille[0],
    sCodeLieuVente: aReferenceVille[1].replace('(','').replace(')',''),
    sQteEmballage: sNombreEmballages1,
    sTypeEmballage: sTypeEmballage1,
    sTransporteur: '',
};

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageEmballage   = new EmballagesStock(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [ACCUEIL]', async () => {

        test('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if(isVisible){
                await menu.removeArlerteMessage(page);
            }else{
                log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                test.skip();
            }
        })
    })

    test.describe('Page [EMBALLAGE]', async () => {

        var sNomPage = 'emballages';

        test ('Page [EMBALLAGES] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 

        test ('ListBox [VILLE] = "' + oData.sNomLieuVente + '"', async () => {
            await menu.selectVille(oData.sNomLieuVente, page);
        })

        test.describe('Onglet [STOCK ET BONS]', async () => {

            test ('Onglet [STOCK ET BONS] - Click', async () =>  {
                await menu.clickOnglet(sNomPage, 'stockBons', page);
            }) 

            test ('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 

            var sNomPopin = "Création d'un bon d'emballage";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

                test ('Button [CREER BON] - Click', async () => {
                    await fonction.clickElement(pageEmballage.buttonCreerBon);
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible - Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                //---------------------------- ENREGISTREMENT 1 -------------------------------------

                test ('inputField [RESPONSABLE DU CHARGEMENT] = "' + sNomRespChargt +'"', async() =>{
                    await fonction.sendKeys(pageEmballage.pPinputRespChargement, sNomRespChargt, false, 'Resp. Chargement');
                })
                
                test ('inputField [RESPONSABLE DU CHAUFFEUR] = "' + sNomChauffeur + '"', async() =>{
                    await fonction.sendKeys(pageEmballage.pPinputNomChauffeur, sNomChauffeur, false, 'Resp. Chauffeur');
                })

                test ('inputField [HEURE ARRIVEE] = "' + sHeureArrivee + '"', async() =>{
                    await fonction.sendKeys(pageEmballage.pPinputHeureArrivee, sHeureArrivee, false, 'Heure Arrivée');
                })

                test ('inputField [MINUTE ARRIVEE] = "' + sMinuteArrivee + '"', async() =>{
                    await fonction.sendKeys(pageEmballage.pPinputMinuteArrivee, sMinuteArrivee, false, 'Minute Arrivée');
                })

                test ('inputField [HEURE DEPART] = "' + sHeureDepart + '"', async() =>{
                    await fonction.sendKeys(pageEmballage.pPinputHeureDepart, sHeureDepart, false, 'Heure Départ');
                })

                test ('inputField [MINUTE DEPART] = "' + sMinuteDepart + '"', async() =>{
                    await fonction.sendKeys(pageEmballage.pPinputMinuteDepart, sMinuteDepart, false, 'Minute Départ');
                })

                test ('inputField [OBSERVATIONS 1] = "' + sObservbations + '"', async() =>{
                    await fonction.sendKeys(pageEmballage.pPtextAreaObservationsEmb, sObservbations, false, 'Obsertvation 1');
                })

                test ('AutoComplete [TRANSPORTEUR] = rnd', async () =>  {
                    const autoComplete:AutoComplete = {
                        libelle         : 'Transporteur',
                        inputLocator    : pageEmballage.pPinputTransporteur,
                        inputValue      : 'trans',
                        choicePosition  : 0,
                        verbose         : false,
                        waitBefore      : 250,
                        page            : page
                    }
                    await fonction.autoComplete(autoComplete);
                    oData.sTransporteur = await pageEmballage.pPinputTransporteur.inputValue();
                })

                test ('ListBox [TYPE D\'EMBALLAGE]# = "' + sTypeEmballage1 + '"', async () => {
                    await fonction.listBoxByLabel(pageEmballage.pPlistBoxTypeEmballage, sTypeEmballage1, page);
                }) 

                test ('inputField [NOMBRE DE PILES]# = "' + sNombrePiles1 + '"', async() =>{
                    await fonction.sendKeys(pageEmballage.pPinputNombrePiles, sNombrePiles1, false, 'Nombre de piles 1');
                })

                test ('inputField [NOMBRE EMBALLAGES]# = "' + sNombreEmballages1 + '"', async() =>{
                    await fonction.sendKeys(pageEmballage.pPinputNombreEmballages, sNombreEmballages1, false, 'Nombre d\'emballages 1');
                })

                test ('inputField [OBSERVATIONS 2] = "' + sObservbation2 + '"', async() =>{
                    await fonction.sendKeys(pageEmballage.pPtextAreaObservationsLigne, sObservbation2, false, 'Observation 2');
                })

                test ('Button [AJOUTER] - Click#', async () => {
                    await fonction.clickAndWait(pageEmballage.pPbuttonAjouter, page);
                })

                //-------------------------- ENREGISTREMENT 2 ------------------------------------------------

                test ('ListBox [TYPE D\'EMBALLAGE]## = "' + sTypeEmballage2 + '"', async () => {
                    await fonction.listBoxByLabel(pageEmballage.pPlistBoxTypeEmballage, sTypeEmballage2, page);
                }) 

                test ('inputField [NOMBRE DE PILES]## = "' + sNombrePiles2 + '"', async() =>{
                    await fonction.sendKeys(pageEmballage.pPinputNombrePiles, sNombrePiles2, false, 'Nombre de Piles 2');
                })

                test ('inputField [NOMBRE EMBALLAGES]## = "' + sNombreEmballages2 + '"', async() =>{
                    await fonction.sendKeys(pageEmballage.pPinputNombreEmballages, sNombreEmballages2, false, 'Nombre Emballage 2');
                })

                test ('Button [AJOUTER] - Click##', async () => {
                    await fonction.clickAndWait(pageEmballage.pPbuttonAjouter, page);
                })

                // -------------------------- SUPPRESSION DE L'ENREGISTREMENT 2 -------------------------

                test('Tr [EMBALLAGE][' + sTypeEmballage2 + '] => Supprimer', async () => {
                    var iTimeout = 60000;
                    test.setTimeout(iTimeout);
                    var iNbEmballageInit    = await pageEmballage.pPdataGridLigneEmballage.count();
                    await pageEmballage.pPdataGridLigneEmballage.last().hover();
                    await fonction.wait(page, 250);
                    await fonction.clickAndWait(pageEmballage.pPdataGridActionSupprime.last(), page);
                    var iNbEmballageFin = await pageEmballage.pPdataGridLigneEmballage.count();
                    expect(iNbEmballageFin).toBeLessThan(iNbEmballageInit);
                })

                //-----------------------------------------------------------------------------------------

                test ('Button [VALIDER ET IMPRIMER] - Click', async () => {
                    await fonction.noHtmlInNewTab(page, pageEmballage.pPbuttonValiderImprimer);
                    log.set('Document téléchargé');
                })

                test('Header [Date] - Click', async () => {
                    // Trier les dates par ordre décroissant
                    await fonction.clickElement(pageEmballage.datagridHeaderDate);
                    await fonction.wait(page, 250);
                })

                test('JDD [EMBALLAGE BON] - Save', async ({},testInfo) => {
                    const sNumBon = await pageEmballage.tdNumBon.last().textContent();
                    oData.sNumeroBon = sNumBon;
                    log.set('Bon créé : ' + sNumBon);
                    //-- Ecriture du libellé dans un fichier de JDD au format JSON pour récupératiuon des tests suivants
                    writeFile(testInfo.config.rootDir + sJddFile, JSON.stringify(oData, null, 2), (error) => {
                        if (error) {
                        console.log('An error has occurred ', error);
                        return;
                        }
                        log.set('Enregistrement de la donnée dans le fichier : ' + sJddFile);
                        fonction.addDataSheet('File', 'Write', sJddFile);
                    });
                })
            })
        })
    })

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})