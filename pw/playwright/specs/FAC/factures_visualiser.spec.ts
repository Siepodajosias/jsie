/**
 * 
 * @author JC CALVIERA
 * @since 2024-02-08
 * 
 */

const xRefTest      = "FAC_FAC_VIS";
const xDescription  = "Visualiser les factures après comptabilisation";
const xIdTest       =  294;
const xVersion      = '3.10';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'FAC',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon','groupeArticle','listeClients','listeArticles'],
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

import { AutoComplete, CartoucheInfo, TypeEsb }  from '@commun/types';

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
const aListeClients     = fonction.getInitParam('listeClients', ['GF137FL', 'GF163FL']);    

// Date de facture à rechercher à j-3
var maDate              = new Date();
maDate.setDate(maDate.getDate() - 2);
var sDateBL         = fonction.addZero(maDate.getDate()) + " / " + fonction.addZero(maDate.getMonth() + 1) + " / " + fonction.addZero(maDate.getFullYear());
var sNumeroFacture  = '';
var aListeFactures:string[]  = [];
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
            log.set('Date attendue du BL : ' + sDateBL);
            log.separateur();
        });

    });  //-- End Describe Page

    test.describe ('Page [FACTURATION]', async () => {

        let sCurrentPage = 'facturation';

        test ('Page [FACTURATION]', async () => {
            await menu.click(sCurrentPage, page);
        });

        test.describe ('Onglet [LISTE DES FACTURES]', async () =>{

            test ('Onglet [LISTE DES FACTURES] - Click', async () => {
                await menu.clickOnglet(sCurrentPage, 'listeFactures', page);
            });

            test ('Filtre [GROUPE ARTICLE] : '+ sGroupeArticle, async () => {
                await pageFactures.listBoxGpeArticle.selectOption({label: sGroupeArticle});
                await fonction.addDataSheet('ListBox', 'Groupe Article', sGroupeArticle);
            });
                        
            test ('ToggleButton [FACTURE] - Click', async () => {
                await fonction.clickElement(pageFactures.toggleButtonFacture);
            });

            test ('Button [RECHERCHER FACTURE] - Click', async () => {
                await fonction.clickAndWait(pageFactures.toggleButtonFacture, page);
            });

            test ('Header [DATE] - Click', async () => {
                //-- Tri par date décroissante
                await fonction.clickElement(pageFactures.headerDate, page);
            });

            var iCpt = 0;
            aListeClients.forEach(function(client:string, index:number) {
                         
                 iCpt++;   

                test ('InputField [TIERS] : '+ client, async () => {

                    var oData:AutoComplete = {
                        libelle         :'TIERS',
                        inputLocator    : pageFactures.inputTiers,
                        inputValue      : client,
                        choiceSelector  :'li.gfit-autocomplete-result',
                        choicePosition  : 0,
                        typingDelay     : 100,
                        waitBefore      : 500,
                        clear           : true,
                        page            : page,
                    };
                    await fonction.autoComplete(oData);
                });

                test ('Button [RECHERCHER] - Click (#' + iCpt + ')', async () => {
                    await fonction.clickAndWait(pageFactures.buttonRechercher, page);
                });

                if(index === 0){

                    test ('DatePeacker [PIECE DU][' + client + '] = "' + sDateBL + "", async () => {
                        await fonction.clickElement(pageFactures.datePickerFrom);
                        var curreantDate     = maDate.getDate();
                        var iCurrentDayIndex = curreantDate - 1;
                        await fonction.clickElement(pageFactures.datePickerEnabledDays.nth(iCurrentDayIndex));
                    });    
                    
                    test ('DatePeacker [AU][' + client + '] = "' + sDateBL + "", async () => {
                        await fonction.clickElement(pageFactures.datePickerTo);
                        var curreantDate     = maDate.getDate();
                        var iCurrentDayIndex = curreantDate - 1;
                        await fonction.clickElement(pageFactures.datePickerEnabledDays.nth(iCurrentDayIndex));
                    });
    
                    test ('Button [RECHERCHER] - Click (##' + iCpt + ')', async () => {
                        await fonction.clickAndWait(pageFactures.buttonRechercher, page);
                    });
                }

                test ('td [FACTURES]['+client+'] >= 1 (#' + iCpt + ')', async () => {
                    await pageFactures.dataGridDateFacture.last().waitFor({state:'visible'});
                    var iNbFactures         = await pageFactures.dataGridDateFacture.count();                   
                    var iNbFacturesTrouvees = await pageFactures.dataGridDateFacture.filter({hasText:sDateBL}).count();
                    sNumeroFacture      = await pageFactures.dataGridNumeroFacture.last().textContent();
                    aListeFactures.push(sNumeroFacture); // On va ajouter chaque numéro de facture dans le tableau qui nous sera utile.
                    log.set('Nombre de factures trouvées pour la date du ' + sDateBL +' : ' + iNbFacturesTrouvees + '/' + iNbFactures);  
                    log.set('Numéro de la facture : ' + sNumeroFacture);  
                    log.separateur();              
                    expect(iNbFacturesTrouvees).toBeGreaterThan(0);
                });

                test ('Icon [VISUALISER LES FACTURES][' + client + '] - Click', async () => {
                    await pageFactures.dataGridLigneFacture.last().hover();
                    await fonction.wait(page, 250);
                    await fonction.noHtmlInNewTab(page, pageFactures.dataGridLigneFactureEyeIcon.last());
                });

            });

        });

    });

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

    test ('Check Flux:', async ()=>{
        test.setTimeout(600000);
        // On va vérifier l'envoie des flux pour chaque factures
        if(aListeFactures.length > 0){

            var sFluxDate   = fonction.addZero(maDate.getDate()) + "/" + fonction.addZero(maDate.getMonth() + 1) + "/" + fonction.addZero(maDate.getFullYear());
            var sNomFlux    = "Diffuser_EcrituresComptables";
            var iNombreFlux = 100;
            var aFlux :object[]= []; // un tableau d'objet qui sera utilisé pour vérifier les différents résultats recherchés pour le flux.
            for (const sNumeroFact of aListeFactures){

                var objectFlux = {

                    "NOM_FLUX"   : sNomFlux,
                    "DESCRIPTION": "FACTURE du " + sFluxDate + " N°"+sNumeroFact,
                    "NB_FLUX"     : iNombreFlux,
                };
                aFlux.push(objectFlux); // On ajoute chaque objet de flux créé dans le tableau
            };
        };

        // On procède maintenant au checking
        var oFlux:TypeEsb   =  { 

            "FLUX"            : aFlux,
            "WAIT_BEFORE"     : 3000,
            "VERBOSE_MOD"     : true,
            "STOP_ON_FAILURE" : true
        };
        await esb.seachByDescription(page, oFlux);
    });
    
});
