/**
 * 
 * @author JC CALVIERA
 * @since 2024-03-01
 * 
 */
const xRefTest      = "** Référence Dynamique **";      
const xDescription  = "** Référence Dynamique **";
const xIdTest       =  0.0;
const xVersion      = "3.6";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon', 'jdd'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page, expect}       from '@playwright/test';

import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { EsbFunctions }                 from '@helpers/esb';
import { Log }                          from '@helpers/log';
import { JddFile }                      from '@helpers/file';

import { MenuAchats }                   from '@pom/ACH/menu.page';
import { PageRefFou }                   from '@pom/ACH/referentiel_fournisseurs.page';

import { CartoucheInfo, TypeEsb } 		from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
 
var pageReferentielFour : PageRefFou;
var menu                : MenuAchats;
let esb                 : EsbFunctions;
let jddFile             : JddFile;

const log               = new Log;
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------
fonction.importJdd()

var oData:any           = {};

let sNomFournisseur: string;
const sRayon            = fonction.getInitParam('rayon', 'Fruits et légumes');  
const sJdd              = fonction.getInitParam('jdd', 'FL');  

//-- Références du test dynamiques ---------------------------------------------------

const aInfosTests       = {
    'FL' : {
        'xRefTest'      : 'ACH_FOU_AFL',
        'xDescription'  : 'Création d\'un Fournisseur FL',
        'xIdTest'       : 246,
        'sJddFile'      : '../../_data/ACH/Fournisseurs/fournisseur_FL.json',
    },
    'FG': {
        'xRefTest'      : 'ACH_FOU_AFG',
        'xDescription'  : 'Création d\'un Fournisseur FG',
        'xIdTest'       : 9182,
        'sJddFile'      : '../../_data/ACH/Fournisseurs/fournisseur_FG.json',
    }, 
    'Italie': {
        'xRefTest'      : 'ACH_FOU_AIT',
        'xDescription'  : 'Création d\'un Fournisseur Italien',
        'xIdTest'       : 9183,
        'sJddFile'      : '../../_data/ACH/Fournisseurs/fournisseur_Italie.json',
    },                    
};

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {

    //-- Modification à la volée des informations du test
    if (aInfosTests[sJdd] !== undefined) {
        info.refTest= aInfosTests[sJdd]['xRefTest'];
        info.desc   = aInfosTests[sJdd]['xDescription'];
        info.idTest = aInfosTests[sJdd]['xIdTest'];
    } else {
        throw new Error('Ooops : Le paramètre RAYON passé en argument est inconnu !');
    }

    page                = await browser.newPage();
    menu                = new MenuAchats(page, fonction);    
    pageReferentielFour = new PageRefFou(page);
    esb                 = new EsbFunctions(fonction);
    const helper        = new Help(info, testInfo, page);
    await helper.init();

    jddFile             = new JddFile(testInfo);
    oData               = jddFile.readJson(aInfosTests[sJdd]['sJddFile']);
    fonction.addDataSheet('ImportJdd', 'Read',  aInfosTests[sJdd]['sJddFile']);

    if (process.env.E2E !== undefined && process.env.E2E !== '') {
        sNomFournisseur = fonction.getInitParam('fournisseur', 'TA_Fournisseur_Recette1');
    } else {
        sNomFournisseur = oData.FOURNISSEUR.NOM
    }
})
 
test.afterAll(async({}, testInfo) => {
    await fonction.close(testInfo);
})
 
//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async() => {
       await fonction.connexion(page);
    })
  
    test.describe('Page [ACCUEIL]', async () => {

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {
            await menu.selectRayonByName(sRayon, page);
        })

    })

    test.describe('Page [REFERENTIEL]', async () => {

       var pageName = 'referentiel';

       test("Menu [REFERENTIEL] - Click ", async () => {
           await menu.click(pageName, page);
       })

       test.describe('Onglet [FOURNISSEURS]', async () => {

            test ('Onglet [FOURNISSEURS] - Click', async () => {
                await menu.clickOnglet(pageName, 'fournisseurs',page);
            })   

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page); // Par défaut, aucune erreur remontée au chargement de l'onglet
            })

            test('Button [CREER] - Click', async () => {
                await fonction.clickElement(pageReferentielFour.buttonCreer);
            })

            test.describe('Popin [CREATION D\'UN FOURNISSEUR]', () => {
                
                //-- Une popover intitulé Création d'un fournisseur  
                test('Popin [CREATION D\'UN FOURNISSEUR] - Is Visible', async () =>  {
                    await fonction.popinVisible(page, 'CREATION D\'UN FOURNISSEUR', true);
                })

                //-- Je ne peux pas enregistrer (car les informations obligatoires ne sont pas saisies)
                test('Button [ENREGISTRER] - Is NOT Enabled', async () =>  {
                    await expect(pageReferentielFour.pButtonEnregistrerFourn).toBeDisabled();
                })

                //-- Le bouton Actif est sélectionné par défaut
                test('Toggle Button [ACTIF] - Is Checked', async () =>  {
                    await expect(pageReferentielFour.pToggleActif).toHaveClass('p-inputswitch p-component p-inputswitch-checked');
                })

                //-- Le bouton Controle dimension colis est sélectionné par défaut
                test('Toggle Button [CONTROLE DIMENSION COLIS] - Is Checked', async () =>  {
                    await expect(pageReferentielFour.pToggleActif).toHaveClass('p-inputswitch p-component p-inputswitch-checked');
                })

                //-- Le bouton Agréage automatique n'est pas sélectionné par défaut
                test('Toggle Button [AGREAGE AUTOMATIQUE] - Check', async () =>  {
                    
                    if (sRayon != 'Fruits et légumes') {
                        await expect(pageReferentielFour.pToggleAgreageAuto).toHaveClass('p-inputswitch p-component p-inputswitch-checked');
                    } else {
                        await expect(pageReferentielFour.pToggleAgreageAuto).toHaveClass('p-inputswitch p-component');
                    }
                })

                //-- le bouton Rapprocher les factures est sélectionné par défaut
                test('Toggle Button [RAPPROCHER LES FACTURES] - Is Checked', async () =>  {
                    await expect(pageReferentielFour.pToggleRapprocherFactures).toHaveClass('p-inputswitch p-component p-inputswitch-checked');
                })

                //-- La langue utilisée est par défaut ***
                test('ListBox [LANGUE UTILISEE] = "Langue"', async () =>  {
                    log.set('Langue : ' + oData.FOURNISSEUR.LANGUE);
                    //-- Par défaut au chargement du Formulaire
                    expect(await pageReferentielFour.pListBoxLangueFourn.textContent()).toBe('Français');
                    //-- Ecrasement de la valeur par défaut si necessaire
                    await pageReferentielFour.selectListBox(page, pageReferentielFour.pListBoxLangueFourn, oData.FOURNISSEUR.LANGUE);
                    fonction.addDataSheet('ListBox', 'Langue Utilisée', oData.FOURNISSEUR.LANGUE);
                })

                //-- La Devise de paiemant par défaut est Euro
                test('ListBox [DEVISE DE PAIEMENT] = "Devise"', async () =>  {
                    log.set('Devise : ' + oData.FOURNISSEUR.DEVISE);
                    expect(await pageReferentielFour.pListBoxDeviseFourn.textContent()).toBe(oData.FOURNISSEUR.DEVISE);
                })

                //-- Le sCollectif par défaut est HorsGroupe
                test('ListBox [COLLECTIF] = "Collectif"', async () =>  {
                    log.set('Collectif : ' + oData.FOURNISSEUR.COLLECTIF);
                    expect(await pageReferentielFour.pListBoxCollectifFourn.textContent()).toBe(oData.FOURNISSEUR.COLLECTIF);
                })

                //-- La typologie par défaut est Autres structures
                test('ListBox [TYPOLOGIE] = "Typologie"', async () =>  {
                    log.set('Typologie : ' + oData.FOURNISSEUR.TYPOLOGIE);
                    expect(await pageReferentielFour.plistBoxTypologieFourn.textContent()).toBe(oData.FOURNISSEUR.TYPOLOGIE);
                })

                //-- Le pays Introduction de marchandise par défaut est France
                test('ListBox [INTRODUCTION MARCHANDISE] = "Introduction Marchandise"', async () =>  {
                    log.set('Introduction Marchandise : ' + oData.FOURNISSEUR.INTRO_MARCHAND);
                    //-- Par défaut au chargement du Formulaire
                    expect(await pageReferentielFour.pListBoxMarchandiseFourn.textContent()).toBe('France');
                    //-- Ecrasement de la valeur par défaut si necessaire
                    await pageReferentielFour.selectListBox(page, pageReferentielFour.pListBoxMarchandiseFourn, oData.FOURNISSEUR.INTRO_MARCHAND);
                    fonction.addDataSheet('ListBox', 'Introduction Marchandise', oData.FOURNISSEUR.INTRO_MARCHAND);
                })

                //-- le nom de la société = le nom du fournisseur (à définir)
                test('InputField [NOM DE LA SOCIETE] = "Nom Fournisseur"', async () =>  {
                    log.set('Fournisseur : ' + sNomFournisseur + '-' + fonction.getToday('US'));
                    await fonction.sendKeys(pageReferentielFour.pInputNomSocieteFourn, sNomFournisseur + '-' + fonction.getToday('US'), false, 'Nom Fournisseur');
                })

                //-- l'adresse
                test('InputField [ADRESSE] = "Adresse"', async () =>  {
                    log.set('Adresse : ' + oData.FOURNISSEUR.ADRESSE + '-' + fonction.getToday('US'));
                    await fonction.sendKeys(pageReferentielFour.pInputAdresseFourn, oData.FOURNISSEUR.ADRESSE + '-' + fonction.getToday('US'), false, 'Adresse Fournisseur');
                })                

                //-- Le complément de l'adresse
                test('InputField [COMPLEMENT ADRESSE] = "Complement Adresse"', async () =>  {
                    log.set('Adresse : ' + oData.FOURNISSEUR.COMPLEMENT + '-' + fonction.getToday('US'));
                    await fonction.sendKeys(pageReferentielFour.pInputComplementFourn, oData.FOURNISSEUR.COMPLEMENT, false, 'Complément Adresse');
                })                

                //-- le code postal et la commune
                test('InputField [CODE POSTAL] = "Code Postal"', async () =>  {
                    log.set('Code Postal : ' + oData.FOURNISSEUR.CODE_POSTAL);
                    await fonction.sendKeys(pageReferentielFour.pInputCodePostalFourn, oData.FOURNISSEUR.CODE_POSTAL, false, 'Code Postal');
                }) 

                test('InputField [COMMUNE] = "Commune"', async () =>  {
                    log.set('Commune : ' + oData.FOURNISSEUR.COMMUNE);
                    await fonction.sendKeys(pageReferentielFour.pInputCommune, oData.FOURNISSEUR.COMMUNE, false, 'Commune');
                }) 

                //-- le pays = ${pays}
                test('ListBox [PAYS] = "Pays"', async () =>  {
                    log.set('Pays : ' + oData.FOURNISSEUR.PAYS);
                    await pageReferentielFour.selectListBox(page, pageReferentielFour.plistBoxPaysFourn.first(), oData.FOURNISSEUR.PAYS);
                    fonction.addDataSheet('ListBox', 'Pays', oData.FOURNISSEUR.PAYS);
                }) 

                //-- Commentaire
                test('InputField [COMMENTAIRE] = "Commentaire"', async () =>  {
                    log.set('Téléphone : ' + oData.FOURNISSEUR.COMMENTAIRE);
                    await fonction.sendKeys(pageReferentielFour.pTextAreaComFourn, oData.FOURNISSEUR.COMMENTAIRE, false, 'Commentaire');
                })

                //-- Le téléphone
                test('InputField [TELEPHONE] = "Téléphone"', async () =>  {
                    log.set('Téléphone : ' + oData.FOURNISSEUR.TELEPHONE);
                    await fonction.sendKeys(pageReferentielFour.pInputTelFourn, oData.FOURNISSEUR.TELEPHONE, false, 'Téléphone');
                })

                //-- la centrale d'achat = ${centrale}
                test('ListBox [CENTRALE D\'ACHAT] = "Centrale d\'Achat"', async () =>  {
                    log.set('centrale d\'Achat : ' + oData.FOURNISSEUR.CENTRALE_ACHAT);
                    await pageReferentielFour.selectListBox(page, pageReferentielFour.pListBoxCentraleAchat, oData.FOURNISSEUR.CENTRALE_ACHAT);
                    fonction.addDataSheet('ListBox', 'Centrale d\'Achat', oData.FOURNISSEUR.CENTRALE_ACHAT);
                }) 

                //-- le Régime de TVA = ${TVA} 
                test('ListBox [REGIME TVA] = "Régime TVA"', async () =>  {
                    log.set('Régime TVA : ' + oData.FOURNISSEUR.REGIME);  
                    await pageReferentielFour.selectListBox(page, pageReferentielFour.pListBoxRegimeTvaFourn, oData.FOURNISSEUR.REGIME);
                    fonction.addDataSheet('ListBox', 'Régime TVA', oData.FOURNISSEUR.REGIME);
                })

                //-- Le bouton Enregistrer est disponible
                test('Button [ENREGISTRER] - Is Enabled', async () =>  {
                    await expect(pageReferentielFour.pButtonEnregistrerFourn).toBeEnabled();
                })

                //-- je choisi le Mode d'envoi de commande = ${mode}
                test('ListBox [MODE ENVOI COMMANDE] = "Mode Envoi Commande"', async () =>  {
                    log.set('Mode Envoi Commande : ' + oData.FOURNISSEUR.MODE_ENV_CMDE);
                    await pageReferentielFour.pListBoxModeEnvCmde.scrollIntoViewIfNeeded();                            
                    await fonction.clickElement(pageReferentielFour.pListBoxModeEnvCmde);
                    await fonction.wait(page, 125);
                    // Ggggrrrrrrrr.... Cette LB n'est pas dy même type que les autres....
                    //await pageReferentielFour.selectListBox(page, pageReferentielFour.pListBoxModeEnvCmde, ' ' + oData.FOURNISSEUR.MODE_ENV_CMDE + ' ');
                    await page.locator('p-dropdownitem li span:text-is(" ' + oData.FOURNISSEUR.MODE_ENV_CMDE.trim() + ' ")').click();
                    fonction.addDataSheet('ListBox', 'Mode Envoi Commande', oData.FOURNISSEUR.MODE_ENV_CMDE);
                })                

                //-- j'ajoute une adresse e-mail d'envoi des achats
                test('InputField [EMAIL] = "Email"', async () =>  {
                    log.set('Email : ' + oData.FOURNISSEUR.EMAIL);
                    await fonction.sendKeys(pageReferentielFour.pInputEmailEnvAchats, oData.FOURNISSEUR.EMAIL, false, 'Email');
                    await page.keyboard.press('Enter');
                })

                //-- J'enregistre
                test('Button [ENREGISTRER] - Click', async () =>  {
                    await fonction.clickAndWait(pageReferentielFour.pButtonEnregistrerFourn, page);
                })

                //-- la pop up Création d'un fournisseur est fermée
                test('Popin [CREATION D\'UN FOURNISSEUR] - Is NOT Visible', async () =>  {
                    await fonction.popinVisible(page, 'CREATION D\'UN FOURNISSEUR', false);
                })

            })

            //-- Je filtre sur le nom du nouveau fournisseur
            test('InputField [FILTRE FOURNISSEUR] = "Nom Fournisseur"', async () =>  {
                await fonction.sendKeys(pageReferentielFour.inputFiltreArticle, sNomFournisseur + '-' + fonction.getToday('US'));
                await fonction.wait(page, 500);     // On attend que la liste se raffraîchisse
            })

            //-- Le fournisseur est affiché dans la liste 
            test('td [FOURNISSEUR][0] = "Nom Fournisseur"', async () =>  {
                expect(await pageReferentielFour.tdDesignationFournisseur.first().textContent()).toBe(sNomFournisseur.charAt(0).toUpperCase() + sNomFournisseur.slice(1).toLowerCase() + '-' + fonction.getToday('US'));
            })

            //-- il est actif
            test('td [ACTIF][0] = "Actif"', async () =>  {
                await expect(pageReferentielFour.tdFournisseursActifs.first()).toBeVisible();
            })

            //-- l'adresse e-mail d'achat est affichée 
            test('td [EMAIL][0] = "Email Fournisseur"', async () =>  {
                expect(await pageReferentielFour.tdFournisseursEmailsAchats.first().textContent()).toBe(oData.FOURNISSEUR.EMAIL);
            })

       })  // End Describe Onglet

    })  // End describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

    test('** CHECK FLUX **', async () => {

        var oFlux:TypeEsb = { 
            "FLUX" : [
                {
                    "NOM_FLUX" : "EnvoyerFournisseur_Pricing",
                },
                {
                    "NOM_FLUX" : "EnvoyerFournisseur_Prepa",
                },
                {
                    "NOM_FLUX" : "EnvoyerFournisseur_Stock",
                },
                {
                    "NOM_FLUX" : "EnvoyerFournisseur_Repart",
                },
                {
                    "NOM_FLUX" : "EnvoyerFournisseur_X3",
                },
                {
                    "NOM_FLUX" : "EnvoyerFournisseur_Pricing",
                },
                {
                    "NOM_FLUX" : "EnvoyerFournisseur_Mag",
                }   
            ],
            "WAIT_BEFORE"      : 5000,               
        };

        await esb.checkFlux(oFlux, page);
        
    })

})  // End describe