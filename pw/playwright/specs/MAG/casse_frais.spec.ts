/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 28 - 11 - 2023
 */

const xRefTest      = "MAG_PRI_CAF";
const xDescription  = "Effectuer un cassé frais";
const xIdTest       =  302;
const xVersion      = '3.3';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['codeArticle', 'groupeArticle', 'prix', 'ville','nombreUniteCassees'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}       from '@playwright/test';

import { TestFunctions }                from "@helpers/functions";
import { Log }                          from "@helpers/log";
import { EsbFunctions }                 from '@helpers/esb';
import { Help }                         from '@helpers/helpers';

import { MenuMagasin }                  from '@pom/MAG/menu.page';
import { PrixGestion }                  from '@pom/MAG/prix-gestion.page';

import { AutoComplete, CartoucheInfo, TypeEsb }  from '@commun/types';

//-------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pagePrxGestion      : PrixGestion;
let esb                 : EsbFunctions;

const log               = new Log();

const fonction          = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const sNomVille          = fonction.getInitParam('ville','Istres (F715)');
const sCodeArticle       = fonction.getInitParam('codeArticle','L'); // On choisit un code arbitraire ici pour être sûr qu'au moins un article sera selectionné après la recherche
const sGroupeArticle     = fonction.getInitParam('groupeArticle','Frais LS');
const sNouveauPrix       = fonction.getInitParam('prix','4.48');
const sNombreUniteCassees= fonction.getInitParam('nombreUniteCassees','7');

const sCommentaire      = 'TA_CasseFrais Motif ' + fonction.getToday() + ' ' + fonction.getBadChars();
//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pagePrxGestion  = new PrixGestion(page);
    esb             = new EsbFunctions(fonction);    
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe ('Page [ACCUEIL]', async () => {

        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if(isVisible){
                await menu.removeArlerteMessage(page);
            }else{
                log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                test.skip();
            }
        })

        test ('ListBox [LIEU DE VENTE] = "' + sNomVille + '"', async () => {
            await menu.selectVille(sNomVille, page);
        })
    })

    test.describe ('Page [PRIX]', async () => {     

        var sNomPage = 'prix';
        test ('Page [PRIX] - Click', async () => {
            await menu.click(sNomPage, page);
        })

        test.describe ('Onglet [GESTION DES PRIX]', async () => {
    
            test ('Label [ERREUR] - Is NOT Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })  

            test ('ListBox [GROUPE] = "' + sGroupeArticle + '"', async () => {
                await fonction.listBoxByLabel(pagePrxGestion.listBoxGrpArticle, sGroupeArticle, page);
            })

            test ('Button [CASSE FRAIS] - Click', async () => {
                await fonction.clickAndWait(pagePrxGestion.buttonCasseFrais, page);
            })

            var sNomPopin = "Changement de prix de type Offre";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible - Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test ('InputField [ARTICLE] = "' + sCodeArticle + '"', async () => {
                    var oData:AutoComplete = {
                        libelle         :'ARTICLE',
                        inputLocator    : pagePrxGestion.pPInputArticle,
                        inputValue      : sCodeArticle,
                        choiceSelector  :'li.gfit-autocomplete-result',
                        choicePosition  : 0,
                        typingDelay     : 100,
                        waitBefore      : 500,
                        page            : page,
                    };
                    await fonction.autoComplete(oData);
                })

                test ('Button [ + ] - Click', async () => {
                    await fonction.clickAndWait(pagePrxGestion.pPoffreButtonPlus, page);
                })

                test ('InputField [NOUVEAU PVC] = "' + sNouveauPrix + '"', async () => {
                    await fonction.sendKeys( pagePrxGestion.pPinputArticleCasseFNewPrix, sNouveauPrix, false, 'Nouveau PVC');
                })

                test ('Input [NOMBRE D\'UNITES CASSEES] = "' + sNombreUniteCassees + '"', async () => {
                    await fonction.sendKeys(pagePrxGestion.pPinputArticleCasseFNbColis, sNombreUniteCassees, false, 'Nb Unités cassées');
                })

                test ('TextArea [MOTIF] = "' + sCommentaire + '"', async () => {
                    await fonction.sendKeys(pagePrxGestion.pPoffreTextAreaCommentaire, sCommentaire, false, 'Motif');
                })

                test ('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pagePrxGestion.pPoffreButtonEnregistrer, page);
                })

                test ('Optionnel - Message Erreur [6121] - Visible', async () => {                        
                    // [6121] Impossible de faire une offre '-30%' sur l'article T016 - Filet de Colin d'Alaska* 220g car il est vendu à l'unité. Vous pouvez néanmoins faire un cassé frais.
                    if(await pagePrxGestion.pPoffreMessageErreur.isVisible()){
                        // Si il y a une erreur, il faut que cel soit celle attendue
                        var sLibErreur = await pagePrxGestion.pPoffreMessageErreur.textContent();
                        if(sLibErreur){
                            log.set('### RETOUR ERREUR IHM : ' + sLibErreur.toString().replace(/(\r\n|\n|\r)/gm,"") + ' ###');                            
                            expect(sLibErreur.indexOf('6121') !== -1).toBe(true);
                            await fonction.clickElement(pagePrxGestion.pPoffreButtonFermer);  
                        }                  
                    }else{
                        log.set('Pas de message d\'erreur affiché');
                        test.skip();
                    }
                })
            })

            test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible - Check', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            })

        })

    }); // end describe
  
    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

    test ('Check Flux :',async () =>{
        var oFlux:TypeEsb   =  { 
            "FLUX" : [ 
                {
                    "NOM_FLUX"  : "EnvoyerTarifMagasin_Relais"
                }
            ],
            "WAIT_BEFORE"   : 5000,                 // Optionnel
        };

        await esb.checkFlux(oFlux,page);
    })

})