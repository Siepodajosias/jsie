/**
 * 
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 05 - 07 - 2024
 */

const xRefTest      = "STO_EMB_IBE";
const xDescription  = "Intégrer les expéditions des emballages par les magasins";
const xIdTest       =  9276;
const xVersion      = '3.3';

var info = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { expect, test, type Page}       from '@playwright/test';

import { TestFunctions }                from "@helpers/functions";
import { Log }                          from "@helpers/log";
import { Help }                         from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                     from "@pom/STO/menu.page";
import { EmballageMouvementsEmballages } from '@pom/STO/emballage-mouvements_emballages.page';

//----------------------------------------------------------------------------------------

let page             : Page;

let menu             : MenuStock;
let pageEmballageMvt : EmballageMouvementsEmballages;

const log            = new Log();
const fonction       = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const sJddFile           = fonction.getGlobalConfig('jddEmballage');
var oData                = fonction.readFile(sJddFile);

var maDate               = new Date();
var sJddMagasin          = oData.sNomLieuVente;
var sJddCodeMagasin      = oData.sCodeLieuVente
var sLieuVente           = sJddCodeMagasin + ' - ' + sJddMagasin;
var sJddTransporteur     = oData.sTransporteur;
var sJddNumeroBon        = oData.sNumeroBon;
var sQteEmballage        = oData.sQteEmballage;
var sDateBL              = fonction.addZero(maDate.getDate()) + " / " + fonction.addZero(maDate.getMonth() + 1) + " / " + fonction.addZero(maDate.getFullYear());

var sTypeMvt             = 'Expédition magasin'; // la désignation du type d'emballage est sensé correspondre à cette valeur.

//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page             = await browser.newPage(); 
    menu             = new MenuStock(page, fonction);
    pageEmballageMvt = new EmballageMouvementsEmballages(page);
    const helper     = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [EMBALLAGE]', async () =>  {    

        var currentPage = 'emballage';

        test('Page [EMBALLAGE] - Click', async () => {
            await menu.click(currentPage, page);  
        })
             
        test('Label [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);                     
        })

        test.describe('Onglet [MOUVEMENTS DES EMBALLAGES]', async () =>  {        
            
            test('Onglet [REFERENTIEL] - Click', async () =>  {
                await menu.clickOnglet(currentPage, 'mouvementsEmballages', page);                
            }) 
            
            test('ListBox [PLATEFORME] = "Toutes les plateformes"', async () => {
                // Si on a une plateforme selectionnnée, le click sur l'icone fermer nous renvoie à la valeur voulu sinon on ne fait rien et on a notre valeur.
                var isVisibleCLearicon = await pageEmballageMvt.listBoxPalteformeClearIcon.isVisible();
                if(isVisibleCLearicon){
                    await fonction.clickElement(pageEmballageMvt.listBoxPalteformeClearIcon);
                }
            })

            test('InputField [EXPEDITEUR/DESTINATAIRE] = "' + sLieuVente + '"', async () => {
                await fonction.sendKeys(pageEmballageMvt.inputExpDestinataire, sJddMagasin, false, 'Exp/Dest');
                await fonction.clickElement(pageEmballageMvt.buttonLieuVente.filter({hasText:sLieuVente}));
            })

            test('Button [RECHERCHER] - Click', async () => {
                await fonction.clickAndWait(pageEmballageMvt.buttonRechercher, page);
            })

            test('Tr [MOUVEMENT EMBALLAGE][LAST] - Check', async () => {
                // vérification de la date de l'emballage
                var datagridEmballageDate  = await pageEmballageMvt.datagridColumnDate.last().textContent();
                log.set('Date Emballage : ' + datagridEmballageDate);
                expect(datagridEmballageDate).toBe(sDateBL);

                // Le type de mouvement doit être Expédition magasin
                var datagridTypeEmballageTypeMvt = await pageEmballageMvt.datagridColumnTypeMvt.last().textContent();
                log.set('Type Mouvement : ' + datagridTypeEmballageTypeMvt);
                expect(datagridTypeEmballageTypeMvt).toBe(sTypeMvt);

                // verification de l'expéditeur qui est sensé être égal au lieu de vente dans Magasin
                var datagridEmballageExp   = await pageEmballageMvt.datagridColumnExpediteur.last().textContent();
                log.set('Expéditeur : ' + datagridEmballageExp);
                expect(datagridEmballageExp).toBe(sJddMagasin);

                // verification du destinataire qui doit correspond au transporteur dans Magasin
                var datagridEmballageDest  = await pageEmballageMvt.datagridColumnDestinataire.last().textContent();
                log.set('Destinataire : ' + datagridEmballageDest)
                expect(datagridEmballageDest).toBe(sJddTransporteur);

                // verification les numéro de BL
                var datagridEmballageNumBL = await pageEmballageMvt.datagridColumnNumeroBl.last().textContent();
                log.set('Numéro de Bon : ' + datagridEmballageNumBL)
                expect(datagridEmballageNumBL).toBe(sJddNumeroBon);

                // Verification de la quantite d'emballage qui  doit être affichée en négatif 
                var datagridEmballageQte   = await pageEmballageMvt.datagridColumnQuantite.last().textContent();
                log.set('Quantité Affiché : ' + datagridEmballageQte);
                expect(datagridEmballageQte).toBe('-' + sQteEmballage);
            })
        })
    }) 

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
    
})