/**
 * 
 * SOCIETES APPLICATION > CONTENU
 * 
 * @author Vazoumana Diarrassouba
 * @since 2023/09/05
 * 
 */

const xRefTest      = "SOC_IHM_GLB";
const xDescription  = "Examen de l'IHM Societe";
const xIdTest       =  3127;
const xVersion      = '3.8';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'SOC',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
}

//------------------------------------------------------------------------------------

import { test, type Page, expect }          from '@playwright/test';

import { Help }                             from '@helpers/helpers.js';
import { TestFunctions }                    from '@helpers/functions.js';
import { Log }                              from '@helpers/log.js';

import { MenuSociete }                      from '@pom/SOC/menu.page.js'
import { PageAccueil }                      from '@pom/SOC/accueil.page.js'
import { PageLieuxVente }                   from '@pom/SOC/lieux-de-vente.page.js';
import { PageOrganisation }                 from '@pom/SOC/organisation.page.js';
import { PageSocietes }                     from '@pom/SOC/societes.page.js';
import { PageClients }                      from '@pom/SOC/clients.page.js';
import { PageParametrage }                  from '@pom/SOC/parametrage.page.js';
import { PageAdminAdmin }                   from '@pom/SOC/admin_administration.page.js';
import { PageAdminDif }                     from '@pom/SOC/admin_diffusion.page.js';
import { PageAdminCom }                     from '@pom/SOC/admin_communication-utilisateurs.page.js';

import { CartoucheInfo, TypeListOfElements }from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuSociete;
let log                 : Log;

let societePage         : PageAccueil;
let pageLieuxVente      : PageLieuxVente;
let pageOrganisation    : PageOrganisation;
let pageSocietes        : PageSocietes;
let pageClients         : PageClients;
let pageParametrage     : PageParametrage;
let pageAdminAdmin      : PageAdminAdmin;
let pageAdminDif        : PageAdminDif;
let pageAdminCom        : PageAdminCom;

const fonction          = new TestFunctions(log);

fonction.recordDatas(false);		//-- Inutile de créer une fiche de données

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {

    page                = await browser.newPage();  
    log                 = new Log();
       
    societePage         = new PageAccueil(page);
    pageLieuxVente      = new PageLieuxVente(page);
    pageOrganisation    = new PageOrganisation(page);
    pageSocietes        = new PageSocietes(page);
    pageClients         = new PageClients(page);
    pageParametrage     = new PageParametrage(page);
    pageAdminAdmin      = new PageAdminAdmin(page);
    pageAdminDif        = new PageAdminDif(page);
    pageAdminCom        = new PageAdminCom(page);
    
    menu                = new MenuSociete(page,fonction); 
    await menu.searchNewElements(testInfo);

    const helper        = new Help(info, testInfo, page);
    await helper.init();

})

test.beforeEach(async ({}, testInfo) => {
    await fonction.trace(testInfo);
    await fonction.checkConsole(page, testInfo, false);
})

test.afterAll(async({}, testInfo) => {
	await menu.showNewElements();    
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : '+ fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async() => {
        await fonction.connexion(page);
    })

    test.describe ('Page [ACCUEIL]', async() =>{
        test ('Label [TITRE] - Is Visible', async() => {
            let message = await societePage.messageBienvenue.textContent();
            expect(message).toContain('bienvenue sur l\'application SIGALE Sociétés');
        })
    })

    test.describe ('PAGE [LIEUX]', async() =>{

        let pageMenu ="lieuxVente";

        test ("Menu [LIEUX] - Click ", async() => {
            await menu.click(pageMenu, page);
        })

        test ("Button [CREER LIEU VENTE]  - Is Visible", async() => {
            await fonction.isDisplayed(pageLieuxVente.buttonCreerLieuVente);
        })

        test ("DataGrid [LIEUX] ", async ({}, testInfo) => {
            var oDataGrid:TypeListOfElements = {
                element     : pageLieuxVente.dataGridLieuxDeVente,    
                desc        : testInfo.line,
                verbose     : false,
                column      :   [
                    'Code',
                    'Désignation',
                    'Type de lieu',
                    'Ouverture',
                    'Nb sociétés',
                    'Valide',
                    'Actif',
                    'Actions',         
                ]
            }
            await fonction.dataGridHeaders(oDataGrid)
        })

        test ("DataGrid [CODES CLIENTS] ", async ({}, testInfo) => {
            var oDataGrid:TypeListOfElements = {
                element     : pageLieuxVente.dataGridCodesClient,    
                desc        : testInfo.line,
                verbose     : false,
                column      : [
                    'Code client',
                    'Rayon',
                    'Fournisseur',
                    'Anomalie',     
                ]
            }
            await fonction.dataGridHeaders(oDataGrid)
        })

        var sNomPopin = "Création d'un lieu de vente";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() =>{
                    
            test ('Button [CREER UN LIEU DE VENTE] - Click', async() => {
                await fonction.clickAndWait(pageLieuxVente.buttonCreerLieuVente, page);
            })

            test ('Popin ['+ sNomPopin + '] - Is Visible', async() =>{
                await fonction.popinVisible(page, sNomPopin);
            })          

            test ('InputField [DESIGNATION] - Is Visible', async() => {
                await fonction.isDisplayed(pageLieuxVente.pPcreateInputDesign);
            })
            
            test ('InputField [CODE GIE]', async() => {
                await fonction.isDisplayed(pageLieuxVente.pPcreateInputCodeGie);                
            })
            
            test ('InputField [ADRESSE 1] - Is Visible', async() => {
                await fonction.isDisplayed(pageLieuxVente.pPcreateInputAdresse);
            })
            
            test ('InputField [ADRESSE 2] - Is Visible', async() => {
                await fonction.isDisplayed(pageLieuxVente.pPcreateInputAdresseCpt)   
            })

            test ('InputField [CODE POSTAL] - Is Visible', async() => {
                await fonction.isDisplayed(pageLieuxVente.pPcreateInputCodePostal);
            })
            
            test ('InputField [VILLE] - Is Visible', async() => {
                await fonction.isDisplayed(pageLieuxVente.pPcreateInputVille);
            })
            
            test ('InputField [LATITUDE] - Is Visible', async() => {
                await fonction.isDisplayed(pageLieuxVente.pPcreateInputLatitude);
            })
            
            test ('InputField [LONGITUDE] - Is Visible', async() => {
                await fonction.isDisplayed(pageLieuxVente.pPcreateInputLongitude);
            })
            
            test ('InputField [CODE] - Is Visible', async() => {
                await fonction.isDisplayed(pageLieuxVente.pPcreateInputCode); 
            })
              
            test ('DatePicker [OUVERTURE] - Is Visible', async() => {
                await fonction.isDisplayed(pageLieuxVente.pPcreateDatePeackerOuv);
            })   
                 
            test ('DatePicker [FERMETURE] - Is Visible', async() => {
                await fonction.isDisplayed(pageLieuxVente.pPcreateDatePeackerFerm); 
            })     
            
            test ('List Box [ENSEIGNE] - Is Visible', async() => {
                await pageLieuxVente.pPcreateListBoxEnseigne.isVisible();
            })     
    
            test ('List Box [CANAUX] - Is Visible', async() => {
                await fonction.isDisplayed(pageLieuxVente.pPcreateListBoxCanaux);
            })
            
            test ('List Box [PAYS] - Is Visible', async() => {
                await fonction.isDisplayed(pageLieuxVente.pPcreateListBoxPays);
            })
            
            test ('List Box [REGION] - Is Visible', async() => {
                await fonction.isDisplayed(pageLieuxVente.pPcreateListBoxRegion);
            })
            
            test ('Check Box [ACTIF] - Is Visible', async() => {
                await fonction.isDisplayed(pageLieuxVente.pPcreateCheckBoxActif);
            })
    
            test ('Check Box [OUVERT LE DIMANCHE] - Is Visible', async() => {
                await fonction.isDisplayed(pageLieuxVente.pPcreateCheckBoxOuvDim); 
            })         
            
            test ('Button [ENREGISTRER] - Is Visible', async() => {
                await fonction.isDisplayed(pageLieuxVente.pPcreateBtnEnregistrer);
            })     
                     
            test ('Link [ANNULER] - Click', async() => {
                await fonction.clickElement(pageLieuxVente.pPcreateLinkAnnuler);
            })     
            
            test ('Popin ['+ sNomPopin + '] - Is Hidden', async() =>{
                await fonction.popinVisible(page, sNomPopin, false);
            })

        })

    })

    test.describe ('Page [ORGANISATION]', async() =>{    

        var pageMenu = 'organisation';

        test ("Menu [ORGANISATION] - Click ", async() => {
            await menu.click(pageMenu, page);                                                                                                
        })

        test ('Button [GERER DIRECTION] - Is Visible', async() => {
            await fonction.isDisplayed(pageOrganisation.buttonGererDirection);
        })
        
        test ('Button [GERER REGIONS] - Is Visible', async() => {
            await fonction.isDisplayed(pageOrganisation.buttonGererRegion);
        })
        
        test ('Button [GERER SECTEUR] - Is Visible', async() => {
            await fonction.isDisplayed(pageOrganisation.buttonGererSecteur);
        })
        
        test ('InputField [ACCEDER A] - Is Visible', async() => {
            await fonction.isDisplayed(pageOrganisation.inputAccederA);
        })
        
        var sNomPopin = "Création d'une direction d'exploitation";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() =>{

            test ('Button [CREER DIRECTION] - Click', async() => {
                await pageOrganisation.buttonGererDirection.hover({timeout:1000});
                await pageOrganisation.buttonCreerDirection.click();
            })

            test ('Popin ['+ sNomPopin + '] - Is Visible', async() =>{
                await fonction.popinVisible(page, sNomPopin);
            })

            test ('InputField [CODE] - Is Visible', async() => {
                await fonction.isDisplayed(pageOrganisation.pPinputCode);
            })
            
            test ('InputField [DESIGNATION] - Is Visible', async() => {
                await fonction.isDisplayed(pageOrganisation.pPinputDesignation); 
            })
            
            test ('InputField [NOM RESPONSABLE] - Is Visible', async() => {
                await fonction.isDisplayed(pageOrganisation.pPinputNomResponsable);
            })
            
            test ('InputField [LISTE ADJOINTS] - Is Visible', async() => {
                await fonction.isDisplayed(pageOrganisation.pPinputListeAdjoints);
            })
            
            test ('Button [ENREGISTRER] - Is Visible', async() => {
                await fonction.isDisplayed(pageOrganisation.pPbuttonEnregistrer);
            })
            
            test ('CheckBox [TOUS GROUPES ARTICLE] - Is Visible', async() => {
                await fonction.isDisplayed(pageOrganisation.pPcheckBoxAllGrpArticle);
            })
            
            test ('Link [ANNULER] - Click', async() => {
                await fonction.clickElement(pageOrganisation.pPlinkAnnuler);
            })
        })

        sNomPopin = "Création d'une région";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() =>{

            test ('Button [CREER REGION] - Click', async() => {
                await pageOrganisation.buttonGererRegion.hover({timeout:1000});
                await fonction.clickElement(pageOrganisation.buttonCreerRegion);
            })

            test ('Popin ['+ sNomPopin + '] - Is Visible', async() =>{
                await fonction.popinVisible(page, sNomPopin);
            })

            test ('ListBox [DIRECTION EXPLOITATION] - Is Visible', async() => {
                await fonction.isDisplayed(pageOrganisation.pPregListBoxDirExploit);               
            })
            
            test ('ListBox [TECHNICIEN OUVERTURE] - Is Visible', async() => {
                await fonction.isDisplayed(pageOrganisation.pPregListBoxTechOuvert); 
            })  
            
            test ('InputField [CODE] - Is Visible', async() => {
                await fonction.isDisplayed(pageOrganisation.pPregInputCodeRegion);  
            })
            
            test ('InputField [DESIGNATION] - Is Visible', async() => {
                await fonction.isDisplayed(pageOrganisation.pPregInputDesignRegion);
            })          
            
            test ('InputField [DIRECTION REGION] - Is Visible', async() => {
                await fonction.isDisplayed(pageOrganisation.pPregAutoCompleteDirReg); 
            })
            
            test ('Button [ENREGISTRER] - Is Visible', async() => {
                await fonction.isDisplayed(pageOrganisation.pPregButtonEnregistrer);
            })
            
            test ('Link [ANNULER] - Click', async() => {
                await fonction.clickElement(pageOrganisation.pPregLinkAnnuler);
            })

        })

        sNomPopin = "Création d'un secteur";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() =>{

            test ('Button [CREER SECTEUR] - Click', async() => {
                await pageOrganisation.buttonGererSecteur.hover({timeout:1000});
                await fonction.clickElement(pageOrganisation.buttonCreerSecteur);
            })

            test ('Popin ['+ sNomPopin + '] - Is Visible', async() =>{
                await fonction.popinVisible(page, sNomPopin);
            })

            test ('ListBox [REGION] - Is Visible', async() => {
                await fonction.isDisplayed(pageOrganisation.pPseclistBoxRegion);
            })
            
            test ('InputField [CODE] - Is Visible', async() => {
                await fonction.isDisplayed(pageOrganisation.pPsecInputCodeSecteur);
            })
            
            test ('InputField [DESIGNATION] - Is Visible', async() => {
                await fonction.isDisplayed(pageOrganisation.pPsecInputDesignRegion);
            })            
            
            test ('InputField [RESPONSABLE] - Is Visible', async() => {
                await fonction.isDisplayed(pageOrganisation.pPsecAutoCompleteResp);
            })
            
            test ('Button [ENREGISTRER] - Is Visible', async() => {
                await fonction.isDisplayed(pageOrganisation.pPregButtonEnregistrer);  
            })
            
            test ('Link [ANNULER] - Click', async() => {
                await fonction.clickElement(pageOrganisation.pPsecLinkAnnuler);
            })

        })

    })

    test.describe ('Page [SOCIETES]', async() =>{    

        let pageMenu = "societes";

        test ("Menu [SOCIETES] - Click ", async() => {
            await menu.click(pageMenu, page);
        })
        
        test ('Button [CREER UNE SOCIETE] - Is Visible', async() => {
            await fonction.isDisplayed(pageSocietes.buttonCreerSociete);
        })
        
        test ('Button [MODIFIER UNE SOCIETE] - Is Visible', async() => {
            await fonction.isDisplayed(pageSocietes.buttonModifierSociete);
        })
        
        test ('Button [MODIFIER LES ASSOCIATIONS] - Is Visible', async() => {
            await fonction.isDisplayed(pageSocietes.buttonModifierEnMasse);
        })
        
        //-------------------------------------------------------------------------------------------------------------------------- 
        test ('DataGrid [SOCIETES EN GESTION] - Check', async ({}, testInfo) => {
            var oDataGrid:TypeListOfElements= {
                element     : pageSocietes.dataGridSocietesGest,    
                desc        : testInfo.line,
                verbose     : false,
                column      :   
                    [
                        'Ancien code',
                        'Code',
                        'Lieu / Abréviation',
                        'Raison sociale',
                        'Univers métier',
                        'Produits',
                        'Non valide',
                        'Actions',   
                    ]
            }
            await fonction.dataGridHeaders(oDataGrid);
        })
        //--------------------------------------------------------------------------------------------------------------------------

        test ('DataGrid [CODES CLIENTS] - Check', async ({}, testInfo) => {
            var oDataGrid:TypeListOfElements = {
                element     : pageSocietes.dataGridCodesClients,    
                desc        : testInfo.line,
                verbose     : false,
                column      :   
                    [
                        'Code client',
                        'Rayon',
                        'Fournisseur',
                        'Anomalie',     
                    ]
            }
            await fonction.dataGridHeaders(oDataGrid);
        })
        //--------------------------------------------------------------------------------------------------------------------------          

        var sNomPopin = "Création d'une société";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() =>{

            test ('Button [CREER SOCIETE] - Click', async() => {
                await fonction.clickElement(pageSocietes.buttonCreerSociete);
            })

            test ('Popin ['+ sNomPopin + '] - Is Visible', async() =>{
                await fonction.popinVisible(page, sNomPopin);
            })

            test ('InputField [RAISON SOCIALE] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateInputRaisonSoc);
            })
            
            test ('InputField [ADRESSE] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateInputAdresse);
            })
            
            test ('InputField [COMPLEMENT ADRESSE] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateInputCplAdresse);
            })
            
            test ('InputField [CODE POSTAL] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateInputCodePostal);
            })
            
            test ('InputField [VILLE] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateInputVille);
            })
            
            test ('InputField [LATITUDE] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateInputLatitude);
            })
            
            test ('InputField [LONGITUDE] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateInputLongitude);
            })
            
            test ('InputField [CODE SITE COMPTABLE] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateInputCodeSite);
            })
            
            test ('InputField [TVA CEE] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateInputTVACEE);
            })
            
            test ('InputField [SIREN] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateInputSiren);
            })
            
            test ('InputField [SIRET] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateInputSiret);
            })
            
            test ('InputField [CODE APE] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateInputCodeAPE);
            })
            
            test ('InputField [DEPARTEMENT] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateInputDpt);
            })
            
            test ('InputField [LIEU RCS] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateInputLieuRCS);
            })
            
            test ('InputField [NOMBRE DE PARTS] - Is Visible', async() => {
                await fonction.isDisplayed( pageSocietes.pPcreateInputNbrParts);
            })
            
            test ('InputField [CAPITAL] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateInputCapital);
            })
           
            test ('InputField [EMAILS] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateInputEmails);
            })
            
            test ('CheckBox [IMPRESSION] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateCheckBoxImpres);
            })
           
            test ('CheckBox [EXONERE TVA] - Is Visible', async() => {
                fonction.isDisplayed(pageSocietes.pPcreateCheckBoxExoTVA);
            })
            
            test ('CheckBox [EXONERE INTERFEL] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateCheckBoxINTERFEL);
            })
            
            test ('CheckBox [RECEVOIR RECETTES] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateCheckBoxRecRece);
            })
            
            test ('CheckBox [FLUX ENCAISSEMENT] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateCheckBoxFluxEnc);
            })
                       
            test ('ListBox [ENSEIGNE] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateListBoxEnseigne);
            })

            test ('ListBox [UNIVERS METIER] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateListBoxUniversMetier);
            })
            
            test ('ListBox [PAYS] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateListBoxPays);
            })
            
            test ('ListBox [REGION] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateListBoxRegion);
            })
            
            test ('ListBox [FORME JURIDIQUE] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateListBoxFormJuri);
            })
            
            test ('ListBox [COMPTE BANCAIRE] - Is Visible', async() => {
                await pageSocietes.pPcreateListBoxCptBanq.isVisible();
            })
            
            test ('ListBox [COMPTE D\'ATTENTE] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateListBoxCptAtten);
            })
            
            test ('ListBox [BASE COMPTABLE] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateListBoxBaseCpt);
            })
            
            test ('Button [ENREGISTRER] - Is Visible', async() => {
                await fonction.isDisplayed(pageSocietes.pPcreateBtnEnregistrer);
            })

            test ('Link [ANNULER] - Click', async() => {
                await fonction.clickElement(pageSocietes.pPcreateLinkAnnuler);       // !!! L'élément n'est pas visible car hors du cadre !!!
            })

            test ('Popin ['+ sNomPopin + '] - Is Hidden', async() =>{
                await fonction.popinVisible(page, sNomPopin, false);
            })

        })

    })

    test.describe ('Page [CLIENTS]', async() =>{    

        let pageMenu = "clients";

        test ("Menu [SOCIETES] - Click ", async() => {
            await menu.click(pageMenu, page);
        })                            

        test ('Button [CREER UN CLIENT] - Is Visible', async() => {
            await fonction.isDisplayed(pageClients.buttonCreerClient);
        })
        
        test ('Button [MODIFIER UN CLIENT] - Is Visible', async() => {
            await fonction.isDisplayed(pageClients.buttonModifierClient);
        })
        
        test ('Button [MODIFIER EN MASSE] - Is Visible', async() => {
            await fonction.isDisplayed(pageClients.buttonModifierEnMasse);
        })
        
        //-------------------------------------------------------------------------------------------------------------------------- 
        test ('DataGrid [CLIENTS]', async ({}, testInfo) => {
            var oDataGrid:TypeListOfElements = {
            element     : pageClients.dataGridClients,    
            desc        : testInfo.line,
            verbose     : false,
            column      :   
                [
                    'Lieu de vente ou Abréviation / Rayon',
                    'Raison sociale / Fournisseur',
                    'Type client',
                    'Code CEE / Code lieu de vente / Code client',
                    'Ancien code client',
                    'Actions',       
                ]
            }
            await fonction.dataGridHeaders(oDataGrid);
        })
        
        //--------------------------------------------------------------------------------------------------------------------------  

        var sNomPopin = "Création d'un client";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

            test ('Button [CREER CLIENT] - Click', async() => {
                await fonction.clickElement(pageClients.buttonCreerClient);
            })
            
            test ('Popin ['+ sNomPopin + '] - Is Visible', async() =>{
                await fonction.popinVisible(page, sNomPopin);
            })

            test ('InputField [SOCIETE] - Is Visible', async() => { 
                await fonction.isDisplayed(pageClients.pPcreateAutoCompSociete);
            })
            
            test ('InputField [RAISON SOCIALE] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateInputRaisonSoc);  
            })
          
            test ('InputField [ADRESSE] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateInputAdresse); 
            })
            
            test ('InputField [COMPLEMENT ADRESSE] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateInputCplAdresse);
            })      
            
            test ('InputField [CODE POSTAL] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateInputCodePostal);                                      // "first()" pour correction "Expected [ true ] to be true"
            })
               
            test ('InputField [VILLE] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateInputVille);                                      // "first()" pour correction "Expected [ true ] to be true"
            })
                                                                                        
            test ('InputField [EMAILS] - Is Visible', async() => {
                fonction.isDisplayed(pageClients.pPcreateInputEmails);
            })
            
            test ('InputField [JOUR D\'ECHEANCE] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateInputJoursEch);
            })
                        
            test ('InputField [NB JOURS ECHEANCE] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateInputNbJoursEch);
            })
            
            test ('InputField [COMPTE TIERS] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateInputCptTiers);
            })
            
            test ('InputField [CODE CLIENT] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateInputCodeCLient);
            })
            
            test ('InputField [TVA CEE] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateInputTVACEE);
            })
            
            test ('InputField [AXE ANALYTIQUE] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateInputAxeAna);
            })

            test ('CheckBox [LIE A UNE SOCIETE] - Is Visible ', async() => {
                await fonction.isDisplayed(pageClients.pPcreateCheckBoxLieSoc);
            })
            
            test ('CheckBox [IMPRESSION] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateCheckBoxImpres);
            })
            
            test ('CheckBox [EXONERE TVA] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateCheckBoxExoTVA); 
            })

            test ('CheckBox [EXONERE INTERFEL] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateCheckBoxINTERFEL);
            })
            
            test ('CheckBox [AVEC RELEVE FACTURE] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateCheckBoxReleve); 
            })
           
            test ('ListBox [TYPE CLIENT] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateListBoxTypeCli);  
            })
            
            test ('ListBox [PAYS] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateListBoxPays);
            })
            
            test ('ListBox [REGION GEOGRAPHIQUE] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateListBoxRegion); 
            })
            
            test ('ListBox [COLLECTIF TIERS] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateListBoxColTiers);
            })
            
            test ('ListBox [TYPE ECHEANCE] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateListBoxTypeEch);
            })
            
            test ('ListBox [TYPE REGLEMENT] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateListBoxTypeReg);
            })
            
            test ('Button [ENREGISTRER] - Is Visible', async() => {
                await fonction.isDisplayed(pageClients.pPcreateBtnEnregistrer);
            })
            
            test ('Link [ANNULER] - Click', async() => {
                await fonction.clickElement(pageClients.pPcreateLinkAnnuler);
            })

        })

    })

    test.describe ('Page [PARAMETRAGE]', async() =>{    

        let pageMenu = "parametrage";

        test ("Menu [PARAMETRAGE] - Click ", async() => {
            await menu.click(pageMenu, page);
        }) 

        test ('Button [AJOUTER UN NOUVEAU COMPTE] - Is Visible', async() => {
            await fonction.isDisplayed(pageParametrage.buttonAjouterCompte);
        })

        //-------------------------------------------------------------------------------------------------------------------------- 
        test ('DataGrid [COMPTES BANCAIRES]', async ({}, testInfo) => {
            var oDataGrid:TypeListOfElements = {
                element     : pageParametrage.dataGridComptesBancaires,    
                desc        : testInfo.line,
                verbose     : false,
                column      :   
                [
                    'Numéro de compte',
                    'Journal de banque',
                    'Code de banque',
                    'Nom de banque',
                    'Actions',      
                ]
            }
                await fonction.dataGridHeaders(oDataGrid);
        })
        
        //-------------------------------------------------------------------------------------------------------------------------- 
        
    })

    test.describe ('Page [ADMIN]', async() =>{    

        let pageMenu = "admin";

        test ("Menu [ADMIN] - Click ", async() => {
            await menu.click(pageMenu, page);
        }) 
        
        test.describe ("Onglet [ADMINISTRATION]", async() => {

            test ("Onglet [ADMINISTRATION] - Click ", async() => {
                await menu.clickOnglet(pageMenu, 'administration', page);
            })

            test ('Button [RECHARGER LE CACHE DES TRADUCTIONS] - Is Visible', async() => {
                await fonction.isDisplayed(pageAdminAdmin.buttonRechargerCache);
            })            

        })

        test.describe ("Onglet [DIFFUSION]", async() => {

            test ("Onglet [DIFFUSION] - Click ", async() => {
                await menu.clickOnglet(pageMenu, 'diffusion', page);
            })
            
            test ('Button [DIFFUSER LES CLIENTS] - Is Visible', async() => {
                await fonction.isDisplayed(pageAdminDif.buttonDifClients);
            })

            test ('Button [DIFFUSER LES ORGANISATIONS] - Is Visible', async() => {
                await fonction.isDisplayed(pageAdminDif.buttonDifOrganisation);
            })

            test ('Button [DIFFUSER LES LIEUX DE VENTE] - Is Visible', async() => {
                await fonction.isDisplayed(pageAdminDif.buttonDifLieuxDeVente);
            })

            test ('ListBox [ORGANISATIONS] - Is Visible', async() => {
                await fonction.isDisplayed(pageAdminDif.listBoxOrganisations);
            })

            test ('ListBox [CLIENTS] - Is Visible', async() => {
                await fonction.isDisplayed(pageAdminDif.listBoxClients);
            })

            test ('ListBox [RAYONS] - Is Visible', async() => {
                await fonction.isDisplayed(pageAdminDif.listBoxRayons);
            })

        })
        
        test.describe ("Onglet [COMMUNICATION UTILISATEURS]", async() => {

            test ("Onglet [COMMUNICATION UTILISATEURS] - Click ", async() => {
                await menu.clickOnglet(pageMenu, 'communicationUtilisateurs', page);
            })    

            test ('Button [TRADUIRE LE MESSAGE] - Is Visible', async() => {
                await fonction.isDisplayed(pageAdminCom.buttonTraduireMessage);
            })

        })

        test.describe ("Onglet [CHANGE LOG]", async() => {

            test ("Onglet [CHANGE LOG] - Click ", async() => {
                await menu.clickOnglet(pageMenu, 'changeLog', page);
            })

        })

    })    

    test ('Déconnexion', async() => {
        await fonction.deconnexion(page);
    })

})