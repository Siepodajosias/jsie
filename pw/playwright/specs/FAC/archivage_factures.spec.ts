/**
 * 
 * @author Vazoumana DIARRASSOUBA
 * @since 2024-06-24
 * 
 */

const xRefTest      = "FAC_FAC_ALF";
const xDescription  = "Archiver les factures";
const xIdTest       =  9341;
const xVersion      = '3.4';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'FACTURATION',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon','groupeArticle','listeClients', 'centraleAchat'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { expect, test, type Page }      from '@playwright/test';

import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { EsbFunctions }                 from '@helpers/esb';
import { Log }                          from '@helpers/log';

import { MenuFacturation }              from '@pom/FAC/menu.page';
import { FacturationListeFactures }     from '@pom/FAC/facturation-liste_factures.page';

import { AutoComplete, CartoucheInfo }  from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuFacturation;
let pageFactures        : FacturationListeFactures;

let esb                 : EsbFunctions;

const log               = new Log();
const fonction          = new TestFunctions(log);
//------------------------------------------------------------------------------------

fonction.importJdd(); //Import du JDD pour le bout en bout  

const sRayon            = fonction.getInitParam('rayon', 'Fruits et légumes');
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Fruits et légumes');
const aListeClients     = fonction.getInitParam('listeClients', 'GF137FL');  
const sCentraleAchat    = fonction.getInitParam('centraleAchat','Prosol SAS');
// Date de facture à rechercher à j-3
var maDate              = new Date();
maDate.setDate(maDate.getDate() - 2);
//Pour un client toutes les pièces peuvent être archivées
var sClient = aListeClients[0];
//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuFacturation(page, fonction);
    pageFactures    = new FacturationListeFactures(page);
    esb             = new EsbFunctions(fonction);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe ('Page [ACCUEIL]', async () => {

        test ('ListBox [RAYON - GPE ART] = "' + sRayon + ' - ' + sGroupeArticle + '"', async () => {            
            await menu.selectRayonGroupeArticle(sRayon, sGroupeArticle, page);                         // Sélection du rayon passé en paramètre
        });

    });  //-- End Describe Page

    test.describe ('Page [FACTURATION]', async () => {

        let sCurrentPage = 'facturation';

        test ('Page [FACTURATION]', async () => {
            await menu.click(sCurrentPage, page);
        });

        test.describe ('Onglet [LISTE DES FACTURES]', async () => {

            test ('Onglet [LISTE DES FACTURES] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'listeFactures', page);
            });

            test ('Filtre [GROUPE ARTICLE] : '+ sGroupeArticle, async () => {
                await fonction.clickElement(pageFactures.listBoxGpeArticle);
                await pageFactures.listBoxGpeArticle.selectOption({label: sGroupeArticle});
            });

            test ('DatePeacker [PERIODE DU][01][MOIS - 1] - Click ', async () => {
                await fonction.clickElement(pageFactures.datePickerFrom);
                await fonction.clickElement(pageFactures.datePickerPreviousMonth);
                await fonction.clickElement(pageFactures.datePickerEnabledDays.nth(0));
            });   

            test ('ToggleButton [FACTURE] - Click', async () => {
                await fonction.clickElement(pageFactures.toggleButtonFacture);
            });
                           
            test ('InputField [TIERS]  = "'+ sClient + '"', async () => {

                var oData:AutoComplete = {
                    libelle         :'TIERS',
                    inputLocator    : pageFactures.inputTiers,
                    inputValue      : sClient,
                    choiceSelector  :'li.gfit-autocomplete-result',
                    choicePosition  : 0,
                    typingDelay     : 100,
                    waitBefore      : 500,
                    clear           : true,
                    page            : page,
                };
                await fonction.autoComplete(oData);
            });

            test ('Button [RECHERCHER] - Click #', async () => {
                await fonction.clickAndWait(pageFactures.buttonRechercher, page);
            });

            test ('td [FACTURES][' + sClient + '] >= 1', async () => {
                await pageFactures.dataGridDateFacture.last().waitFor({state:'visible'});                   
                var iNbFacturesTrouvees = await pageFactures.dataGridDateFacture.count();
                log.separateur();              
                expect(iNbFacturesTrouvees).toBeGreaterThan(0);
            });

            test ('Header [ARCHIVEE] - Click', async () => {
                //-- Tri par par factures non archivées
                await fonction.clickElement(pageFactures.headerArchivee, page);
            })

            var sNomPopin = 'Confirmation de la comptabilisation et de l\'archivage';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + '][' + sClient + ']', async () =>{

                test ('Button [COMPTABILISER & ARCHIVER LES PIECES] - Click', async () => {
                    await fonction.clickAndWait(pageFactures.buttonComptabiliserAcrhiver, page);
                });

                test ('ListBox [CENTRALE D\'ACHAT][' + sCentraleAchat + '] - Select', async () => {
                    await fonction.clickElement(pageFactures.pListBoxCentraleAchat);
                    var choix = pageFactures.pListBoxCentraleAchatItem.filter({hasText:sCentraleAchat});
                    await fonction.clickAndWait(choix, page);
                });

                test ('Button [COMPTABLISER & ARCHIVER] - Click', async () => {
                    var iTimeout = 300000;
                    test.setTimeout(iTimeout); // Le temps de chargement après le click est souvent long donc il faut changer le temps d'exécution du test
                    var spinner  = pageFactures.pSpinnerImage
                    await fonction.clickAndWait(pageFactures.pButtonComptabiliserArchiver, page); 
                    await spinner.waitFor({state:'detached', timeout:iTimeout});
                });
            });

            // On click à nouveau sur le bouton rechercher pour actualiser les données après archivage.
            test ('Button [RECHERCHER] - Click ##', async () => {
                await fonction.clickAndWait(pageFactures.buttonRechercher, page);
            });

            // On verifie si la facture a été archivée
            test ('Td [ARCHIVEE] = "Ok"', async () => {
                await fonction.isDisplayed(pageFactures.dataGridArchiveeIcon.first());
            });

            test ('Icon [VISUALISER LES FACTURES][' + sClient + '] - Click', async () => {
                await pageFactures.dataGridLigneFacture.last().hover();
                await fonction.wait(page, 250);
                await fonction.noHtmlInNewTab(page, pageFactures.dataGridLigneFactureEyeIcon.last());
            });
        });
    });

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
    
});