/**
 * 
 * @author  ABDOUL SARBA
 *  Since 18 - 04 - 2025
 * 
 */

const xRefTest      = "STO_ANA_ECA";
const xDescription  = "Ajouter un motif de justification d’un écart de stock d'une palette";
const xIdTest       =  1687;
const xVersion      = '3.1';

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

import { test, type Page, expect}                from '@playwright/test';

import { TestFunctions }                         from "../../utils/functions";
import { Help }                                  from '../../utils/helpers';


//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                             from "../../pages/STO/menu.page";
import { InventaireInventaire }                  from '../../pages/STO/inventaire-inventaire.page';
import { InventaireEcarts }                      from '@pom/STO/inventaire-ecarts.page';


//----------------------------------------------------------------------------------------

let page              : Page;

let menu              : MenuStock;
let pageInventaire    : InventaireInventaire;
let pageIventaireEcart: InventaireEcarts; 

const fonction       = new TestFunctions();



//----------------------------------------------------------------------------------------
const plateforme    = process.env.PLATEFORME || 'Cremcentre';


//----------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
    page                = await browser.newPage(); 

    menu                = new MenuStock(page, fonction);
    pageInventaire      = new InventaireInventaire(page);
    pageIventaireEcart  = new InventaireEcarts(page);
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------



//------------------------------------------------------------------------------------------
test.describe ('[' + xRefTest + ']', () => {
    
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

    // Sélection d'une plateforme par défaut
    test('ListBox [PLATEFORME] = "' + plateforme + '"', async() => {            
        await menu.selectPlateforrme(page, plateforme);                       
    })

    var sCurrentPage  = 'inventaire';
    test('Page [INVENTAIRE] - Click', async () => {
        await menu.click(sCurrentPage, page); 
    })

    test.describe('Onglet [ANALYSE DES ECARTS]', () => {
        
        test ('Onglet [ANALYSE DES ECARTS] - Click', async () => {
            await menu.clickOnglet(sCurrentPage, 'ecarts', page);
        });

        test('CheckBox [ALL][TABLEAU ECART INVETAIRE ] - click',async ()=>{
            await fonction.clickElement(pageIventaireEcart.checkBoxTousselection.first())
        });

        test('CheckBox [TABLEAU ECART INVETAIRE] - check', async()=>{
            var iDatagridCheckBoxLength=await pageIventaireEcart.checkBoxtr.count();
            for(let i=0; i<iDatagridCheckBoxLength;i++){
                 expect(pageIventaireEcart.checkBoxtr.nth(i)).toBeChecked();
             }
        });

        test('Button [IMPRIMER LES ECARTS] - click',async ()=>{
            await fonction.noHtmlInNewTab(page,pageIventaireEcart.buttonImprimerEcarts);
        });

        var sMotif ="Erreur de réception";
        test('ListBox [MOTIF DE JUSTIFICATION] = "'+sMotif+'"', async ()=>{
            await fonction.selectListBoxByLabel(pageIventaireEcart.motifJustification,sMotif,page);
        });

        var sCommentaire = "Test automatisé en commentaire";
        test('Textarea [COMMENTAIRE] ="' + sCommentaire+"'",async ()=>{
            await fonction.sendKeys(pageIventaireEcart.textAreaCommentaire,sCommentaire);
        });

        test('Button [JUSTIFICATION DE LA SELECTION ECRAT] - click', async ()=>{
            await fonction.clickAndWait(pageIventaireEcart.buttonJustifierSelection,page);
        });

     })
        
        // Déconnexion
    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
})