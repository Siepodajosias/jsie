/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 05 - 04 - 2024
 */

const xRefTest      = "PRI_TAR_ETD";
const xDescription  = "Envoyer la tarification définitive";
const xIdTest       =  6572;
const xVersion      = '3.5';

var info = {
    desc        : xDescription,
    appli       : 'PRI',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['groupeArticle'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { expect, test, type Page}        from '@playwright/test';

import { TestFunctions }                 from '@helpers/functions';
import { Log }                           from '@helpers/log';
import { Help }                          from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuPricing }                   from '@pom/PRI/menu.page';
import { TarificationPage }              from '@pom/PRI/tarification_tarification.page';

//----------------------------------------------------------------------------------------

let page        : Page;
let menuPage    : MenuPricing;

let pageTarif   : TarificationPage;


const log       = new Log();
const fonction  = new TestFunctions(log);

//----------------------------------------------------------------------------------------

var oData:any        = fonction.importJdd();

const sGroupeArticle = fonction.getInitParam('groupeArticle','Fruits et légumes');


if (oData !== undefined) {                      // On est dans le cadre d'un E2E. Récupération des données temporaires
    var sNumAchatE2E = oData.sNumAchatLong;       
    log.set('E2E - Numéro achat : ' + sNumAchatE2E);      
}

//--------------------------------------------------------------------------------------------------------------------

var validTarifLigne = async  (iTimeOut:number) => {

    test.setTimeout(iTimeOut);

    await fonction.selectorToBeCharged(pageTarif.trTarification.last());

    // On cherchera le nombre de ligne de tarification à valider 
    var sStatTarif       = await pageTarif.statistiqueTexte.textContent(); // Recupération du texte des statistiques
    var aStatTarif       = sStatTarif.split('|'); // décomposition du texte à partir du "pipe" en tableau
    var aTarifAValider   = aStatTarif[0].split(':'); // On récupère le premier element du tableau et on le découpe en un autre tableau à partir du cartère ':'    
    var iNbTarifAValider = parseInt(aTarifAValider[1].trim()); //On a le nombre de ligne de tarification à valider, après un trim() et une conversion du texte.

    if(iNbTarifAValider > 0){ 

        if(iNbTarifAValider > 30){ // Si le nombre de ligne à valider est superieur à 30 on va augmenter le timeout
        
            test.setTimeout(iTimeOut + iTimeOut);
        }else{
            
        }

        await pageTarif.tdDgPrixVenteTheorique.first().waitFor({state:'visible'});

        //check presence PVC TTC
        var sTarifTheorique = await pageTarif.tdDgPrixVenteTheorique.first().textContent();
        var sPVprec = await pageTarif.tdDgPrixVentePrecedent.first().textContent();
        sPVprec = sPVprec.trim();
        if (sPVprec === '') { 

            //Il s'agit d'un nouveau tarif, on renseigne le PVC avec le PVC Théorique
            var isVisiblePVC = await pageTarif.inputPVCTTC.first().isVisible();
            if(isVisiblePVC){
                await fonction.sendKeys(pageTarif.inputPVCTTC.first(), sTarifTheorique);
                await fonction.wait(page, 500);   
            }         
        }else {    
            //impossible de récupérer la valeur PVC TTC, c pkoi on regarde PVC prec
            //Le tarif existe déjà, on laisse l'ancien PVC qui est automatiquement appliqué
        } 
        // check presence PC HT
        var sPCHT = await pageTarif.inputPrixCessionHT.first().inputValue();
        if (sPCHT != '') {

            //le PC HT est renseigné, il n'y a rien a faire
        }else {

            var isVisiblePrixCession = await pageTarif.inputPrixCessionHT.first().isVisible();
            if(isVisiblePrixCession){
                await fonction.sendKeys(pageTarif.inputPrixCessionHT.first(), '1'); //on force à 1 par défaut pour avoir un PC et pouvoir valider
                await fonction.wait(page, 500);
            } 
        }           
        var sCodeArt = await pageTarif.tdDgArticleCode.first().textContent();
        log.set('Validation tarif article ' + sCodeArt);
     
        await fonction.clickAndWait(pageTarif.buttonValider, page); // validation du tarif

        // Attente de la disparition des spinners
        expect(pageTarif.pPcalcMargeSpinner.nth(0)).not.toBeVisible({timeout:iTimeOut});
        expect(pageTarif.pPcalcMargeSpinner.nth(1)).not.toBeVisible({timeout:iTimeOut});

        // On va verifier que le nombre de lignes de tarification soit décrémenté de 1 après le clique sur le bouton valider 
        var sStatTarifRestant       = await pageTarif.statistiqueTexte.textContent(); // Recupération encore une fois du texte des statistiques de validation
        var aStatTarifRestant       = sStatTarifRestant.split('|'); // décomposition du texte à partir du "pipe" en tableau
        var aTarifAValiderRestant   = aStatTarifRestant[0].split(':'); // On récupère le premier element du tableau et on le découpe en un autre tableau à partir du cartère ':'    
        var iNbTarifAValiderRestant = parseInt(aTarifAValiderRestant[1].trim()); //On a le nombre de ligne de tarification à valider, après un trim() et une conversion du texte.

        iNbTarifAValider = iNbTarifAValider - 1;

        expect(iNbTarifAValider).toBe(iNbTarifAValiderRestant);

        if(iNbTarifAValider === 0){
          // La fonction s'arrête
        }else{
            await validTarifLigne(iTimeOut);
        }
    } 
}

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page      = await browser.newPage(); 

    menuPage  = new MenuPricing(page, fonction);
    pageTarif = new TarificationPage(page);
});

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

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [ACCUEIL]',  () => {    

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })   

        test('ListBox [RAYON] = "' + sGroupeArticle + '"', async () => {            
            await menuPage.selectRayonByName(sGroupeArticle, page);                       // Sélection du rayon passé en paramètre
        })        
    })  //-- End Describe Page

    test.describe('Page [TARIFICATION]', function() {    

        test('Page [TARIFICATION] - Click', async () => {
            await menuPage.click('tarification', page);
        })

        test.describe('Validation des tarifs ', () => {            // le 1er tarif à valider est automatiquement coché
                                                                   // on valide tous les tarifs du jour pour le rayon sélectionné
            test('Application du PVC TTC Théorique', async () =>{
                await validTarifLigne(600000); // l'argument 200000 est est le timeout de depart du test de depart qui sera incrementé en fonction du nombre de lignes de tarifcation
            })  
        })  // End describe Validation  

        test.describe('Popin [CONFIRMATION ENVOI DES TARIFICATIONS]', () => {

            test('Button [TARIFS MAGASINS] - Click', async () => {
                await fonction.clickAndWait(pageTarif.buttonTarifsMagasin, page);
            })

            test('Label [ERREUR] - Is Not Visible', async () => {   
                await fonction.isErrorDisplayed(false, page);
            })

            test('Button [ENVOYER DEFINITIVEMENT] - Click', async () => {
                if (sNumAchatE2E !== undefined) {

                    await fonction.clickAndWait(pageTarif.pButtonEnvoiDefinitif, page);
                }
                else {

                    await fonction.clickAndWait(pageTarif.pButtonEnvoiAnnuler, page);
                    log.set('E2E - Les tarifs n\'ont pas été envoyés');
                }
            })                  
        })  // End describe Popin      
    })  //-- End Describe Page

    
    test('Déconnexion', async () => {
        await fonction.deconnexion(page)
    });
    
})

