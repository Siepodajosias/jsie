/**
 * 
 * @author JC CALVIERA
 * @since 2024-03-08
 * 
 */
const xRefTest      = "**";	//--  Référence Dynamique
const xDescription  = "**";	//--  Référence Dynamique
const xIdTest       =  0.0;
const xVersion      = "3.10";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page, expect, Locator} 	from '@playwright/test';

import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { EsbFunctions }                 from '@helpers/esb';
import { Log }                          from '@helpers/log';

import { MenuAchats }                   from '@pom/ACH/menu.page';
import { PageAspAsp }                   from '@pom/ACH/achats-sur_place_achats-sur-place.page';

import { CartoucheInfo, TypeEsb, AutoComplete } from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
 
var pageASP             : PageAspAsp;
var menu                : MenuAchats;
let esb                 : EsbFunctions;

const log               = new Log;
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

const sRayon            = fonction.getInitParam('rayon', 'Epicerie');  
var sBonLivraison       = 'TA_ASP-{trigramme}-' + fonction.getToday('US');
const rPrixAchat        = 12.34;
const rPrixCession      = 56.78;
const iQuantite         = 88;
const iPoids            = 99;    
var sBL               	= 'TA_BL-{trigramme}-'+  fonction.getToday('us');
const sLetters 			= 'altesanobic';

var sCentraleAchat    :string;

//-- Références du test dynamiques ---------------------------------------------------

const aInfosTests       = {
    'BCT' : {
        'xRefTest'      : 'ACH_ASP_BCT',
        'xDescription'  : 'Effectuer un achat sur place (Boucherie)',
        'xIdTest'       : 1112,
		'centrale'		: 'BCT 500',
		'flux'			: ['EnvoyerLot_Pricing', 'EnvoyerBonSurPlace_Mag', 'EnvoyerBonSurPlace_Prefac']
    },
    'Crèmerie': {
        'xRefTest'      : 'ACH_ASP_CRM',
        'xDescription'  : 'Effectuer un achat sur place (Crèmerie)',
        'xIdTest'       : 196,
		'centrale'		: 'Le Fromager des Halles',
		'flux'			: ['EnvoyerLotsCREM_Pricing', 'EnvoyerBonSurPlace_Mag', 'EnvoyerBonSurPlace_Prefac', 'EnvoyerAchat_Alusta']
    }, 
    'Epicerie': {
        'xRefTest'      : 'ACH_ASP_EPI',
        'xDescription'  : 'Effectuer un achat sur place (Epicerie)',
        'xIdTest'       : 9183,
		'centrale'		: 'Le Fromager des Halles',
		'flux'			: ['EnvoyerLotsCREM_Pricing', 'EnvoyerBonSurPlace_Mag', 'EnvoyerBonSurPlace_Prefac', 'EnvoyerAchat_Alusta']
    },                    
    'Fruits et légumes': {
        'xRefTest'      : 'ACH_ASP_FEL',
        'xDescription'  : 'Effectuer un achat sur place (Fruits & Légumes)',
        'xIdTest'       : 1111,
		'centrale'		: 'Prosol SAS',
		'flux'			: ['EnvoyerBonSurPlace_Prefac', 'EnvoyerLot_Pricing', 'EnvoyerBonSurPlace_Mag', 'EnvoyerAchat_Alusta']
    },                    
    'Frais Généraux': {
        'xRefTest'      : 'ACH_ASP_FGE',
        'xDescription'  : 'Effectuer un achat sur place (Frais Généraux)',
        'xIdTest'       : 1114,
		'centrale'		: 'Prosol Gestion',
		'flux'			: ['EnvoyerLot_Pricing', 'EnvoyerBonSurPlace_Mag', 'EnvoyerBonSurPlace_Prefac', 'EnvoyerAchat_Alusta']	
    },                    
    'Poissonnerie': {
        'xRefTest'      : 'ACH_ASP_POI',
        'xDescription'  : 'Effectuer un achat sur place (Poissonnerie)',
        'xIdTest'       : 1115,
		'centrale'		: 'World Maréchal',
		'flux'			: ['EnvoyerTarifMagasin_Prefac', 'EnvoyerTarif_Mag']
    }               
};

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuAchats(page, fonction);    
    pageASP             = new PageAspAsp(page);
    esb                 = new EsbFunctions(fonction);

	//-- Modification à la volée des informations et variables du test
	if (aInfosTests[sRayon] !== undefined) {
		info.refTest 	= aInfosTests[sRayon]['xRefTest'];
		info.desc 		= aInfosTests[sRayon]['xDescription'];
		info.idTest 	= aInfosTests[sRayon]['xIdTest'];
		sCentraleAchat	= aInfosTests[sRayon]['centrale'];		
		sBonLivraison	= sBonLivraison.replace('{trigramme}', fonction.getGlobalConfig('aTriRayon')[sRayon]);
		sBL				= sBL.replace('{trigramme}', fonction.getGlobalConfig('aTriRayon')[sRayon]);
	} else {
		throw new Error('Ooops : Le paramètre RAYON passé en argument est inconnu !');
	}

    const helper        = new Help(info, testInfo, page);
    await helper.init();

})
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})
 
//------------------------------------------------------------------------------------

const selectFirstElementIfEmpty = async (selector:Locator, sVarName:string):Promise<void> => {

	const aChoix = await selector.locator('option').allTextContents();

	if (aChoix[0] == '' && aChoix[0] !== undefined) {
		if (aChoix[1] != '' && aChoix[1] !== undefined) {
			log.set('Sélection choix : ' + aChoix[1]);
			await fonction.selectOption(selector, aChoix[1], sVarName);
		} else {
			log.set('/!\\ Liste dérourlante vide ! ');
		}
	} else {
		log.set('Catgéorie déjà sélectionnée (' + aChoix[0] + ')');
	}
	return;
}

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async() => {
       await fonction.connexion(page);
    })
  
    test.describe ('Page [ACCUEIL]', () => {

        test ('ListBox [RAYON] = "' + sRayon + '"', async () => {
            await menu.selectRayonByName(sRayon, page);
        })

    })

    test.describe ('Page [ACHATS SUR PLACE]', () => {

       	var pageName    = 'achatsSurPlace';
		let idCodeArticle:string;

       	test("Menu [ACHATS SUR PLACE] - Click ", async () => {
           await menu.click(pageName, page);
       	})

       	var sNomPopin = 'CREATION D\'UN ACHAT SUR PLACE';
       	test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

            test ('Button [CREER] - Click', async () => {
                await fonction.clickElement(pageASP.buttonCreer);
            })

           	test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
               await fonction.popinVisible(page, sNomPopin, true);
           	})

           	test ('Message [ERREUR] - Is Not Visible', async () => {
            	await fonction.isErrorDisplayed(false, page); // Par défaut, aucune erreur remontée au chargement de la popin / page / onglet
            })

			test ('AutoComplet [CODE OU DESIGNATION ARTICLE] = "rnd"', async () =>  {
				const iRndPos = Math.floor(fonction.random() * sLetters.length);
				
				var oData:AutoComplete = {
					libelle         :'ARTICLE',
					inputLocator    : pageASP.pPinputDesignationArticle,
					inputValue      : sLetters.substring(iRndPos, iRndPos + 1),
					choicePosition  : 0,
					typingDelay     : 100,
					waitBefore      : 500,
					page            : page,
				};
				const sNomArticle = await fonction.autoComplete(oData);
				const aCodeArticle = sNomArticle.split(' '); 				// 'T015 - Lot croûtons à l'ail 2+1 offert 300g'. => 'T015'
				idCodeArticle = aCodeArticle[0];  
				log.set('Article Sélectionné : ' + sNomArticle);
			}) 

			test ('AutoComplet [CODE FOURNISSEUR] = "rnd"', async () =>  {
				const iRndPos = Math.floor(fonction.random() * sLetters.length);

				var oData:AutoComplete = {
					libelle         :'FOURNISSEUR',
					inputLocator    : pageASP.pPinputDesignationFournisseur,
					inputValue      : sLetters.substring(iRndPos, iRndPos + 1),
					choicePosition  : 0,
					typingDelay     : 100,
					waitBefore      : 500,
					page            : page,
				};
				const sNomFournisseur = await fonction.autoComplete(oData);
				log.set('Fournisseur Sélectionné : ' + sNomFournisseur);
			}) 

			test ('AutoComplet [CODE MAGASIN] = "rnd"', async () =>  {
				const iRndPos = Math.floor(fonction.random() * sLetters.length);

				do {

					var oData:AutoComplete = {
						libelle         :'FOURNISSEUR',
						inputLocator    : pageASP.pPinputDesignationMagasin,
						inputValue      : sLetters.substring(iRndPos, iRndPos + 1),
						selectRandom	: true,
						typingDelay     : 100,
						waitBefore      : 500,
						page            : page,
					};
					var sNomMagasin = await fonction.autoComplete(oData);

					var bDataUtilisable = fonction.isProhibitedData(sNomMagasin);

					if (bDataUtilisable) {						
						await pageASP.pPinputDesignationMagasin.clear();				//-- On vide le champ autocomplete avant de pouvoir le remplir à nouveau
					} else {
						log.set('Magasin Sélectionné : ' + sNomMagasin);
					}

				} while(bDataUtilisable);

			}) 

			test ('ListBox [CENTRALE D\'ACHAT]  = "Selected Centrale d\'achat"', async () =>  {
				if (await pageASP.pPlistBoxCentraleAchat.isEnabled()) {
					await fonction.selectOption(pageASP.pPlistBoxCentraleAchat, sCentraleAchat, 'Centrale d\'Achat');
					log.set('Selected Centrale d\'achat : ' + sCentraleAchat);
				} else {
					log.set('Pas de liste déroulante "Centrale D\'achat"');
					test.skip();
				}
			})

			test ('InputField [BON LIVRAISON] = "' + sBonLivraison + '"', async () =>  {
				log.set('Bon de Livraison : ' + sBonLivraison);
				await fonction.sendKeys(pageASP.pPinputBonLivraison, sBonLivraison, false, 'Bon de Livraison');
			})

			test ('Button [ + ] - Click', async () =>  {
				await fonction.clickAndWait(pageASP.pPbuttonPlus, page);
			})

			test.describe ('Saisie Détail Article', () => {

				test ('ListBox [CATEGORIE][0] - Select', async () =>  {
                    if (await pageASP.pPlistBoxLotCategorie.isVisible()){
						await selectFirstElementIfEmpty(pageASP.pPlistBoxLotCategorie, 'Catégorie');
					} else {
						log.set('Liste déroulante "CATEGORIE" indisponible');
						test.skip();
					}
                })

				test ('ListBox [VARIETE][0] - Select', async () =>  {
                    if (await pageASP.pPlistBoxLotVariete.isVisible()){
						const iNbElements = await pageASP.pPlistBoxLotVariete.locator('option').count();
						if (iNbElements >= 1) {      // La liste déroulante contient des éléments
							log.set('Nombre de Variétés : ' + iNbElements);                                    
							selectFirstElementIfEmpty(pageASP.pPlistBoxLotVariete, 'Varieté'); 
						} else {
							log.set('Variété : - Auncune Sélectionnable -');
						}
					} else {
						log.set('Liste déroulante "CATEGORIE" indisponible');
						test.skip();
					}
                })

				test ('ListBox [CALIBRE][0] - Select', async () =>  {
                    if (await pageASP.pPlistBoxLotCalibre.isVisible()){
						await selectFirstElementIfEmpty(pageASP.pPlistBoxLotCalibre, 'Calibre');
					} else {
						log.set('Liste déroulante "CALIBRE" indisponible');
						test.skip();
					}
                })

				test ('ListBox [CONDITIONNEMENT][0] - Select', async () =>  {
                    if (await pageASP.pPlistBoxLotConditionnement.isVisible()){
						await selectFirstElementIfEmpty(pageASP.pPlistBoxLotConditionnement, 'Conditionnement');
					} else {
						log.set('Liste déroulante "CONDITIONNEMENT" indisponible');
						test.skip();
					}
                })

				test ('ListBox [ORIGINE][0] - Select', async () =>  {
                    if (await pageASP.pPlistBoxLotOrigine.isVisible()){
						await selectFirstElementIfEmpty(pageASP.pPlistBoxLotOrigine, 'Origine');
					} else {
						log.set('Liste déroulante "ORIGINE" indisponible');
						test.skip();
					}
                })

				test ('ListBox [UNITE D\'ACHAT][0] - Select', async () =>  {
                    if (await pageASP.pPlistBoxLotUniteAchat.isVisible()){
						await selectFirstElementIfEmpty(pageASP.pPlistBoxLotUniteAchat, 'Unité d\'Achat');
					} else {
						log.set('Liste déroulante "UNITE D\'ACHAT" indisponible');
						test.skip();
					}
                })

				test ('InputField [PRIX D\'ACHAT] = "' + rPrixAchat.toString() + '"', async () =>  {
					log.set('Prix d\'Achat : ' + rPrixAchat.toString());
					await fonction.sendKeys(pageASP.pPinputLotPrixAchat, rPrixAchat.toString(), false, 'Prix d\'Achat');
				})

				test ('InputField [PRIX DE CESSION] = "' + rPrixCession.toString() + '"', async () =>  {
					log.set('Prix de cession : ' + rPrixCession.toString());
					await fonction.sendKeys(pageASP.pPinputLotPrixCession, rPrixCession.toString(), false, 'Prix Cession');
				})

				test ('InputField [QUANTITE] = "' + iQuantite.toString() + '"', async () =>  {
					log.set('Quantité : ' + iQuantite.toString());
					await fonction.sendKeys(pageASP.pPinputLotQuantite, iQuantite.toString(), false, 'Quantité');
				})

				test ('InputField [POIDS] = "' + iPoids.toString() + '"', async () =>  {
					if (await pageASP.pPinputLotPoidsReel.isVisible() ) {
						log.set('Poids : ' + iPoids.toString());
						await fonction.sendKeys(pageASP.pPinputLotPoidsReel, iPoids.toString(), false, 'Poids');
					} else {
						log.set('Poids : Champ Absent');
						test.skip();
					}
				})

				test ('InputField [BL] = "' + sBL + '"', async () =>  {
					log.set('BL : ' + sBL);
					await fonction.sendKeys(pageASP.pPinputLotNumeroBL, sBL, false, 'Bon de Livraison');
				})

				test ('Button [ENREGISTRER] - Click', async () => {
					const iTimetout:number = 60000;
					test.setTimeout(iTimetout);
					await fonction.clickAndWait(pageASP.pPbuttonEnregistrer, page, iTimetout);
				})

				test ('** Wait Until Spinner Off **', async () => {
					const iDelayTimeOut = 600000;
					test.setTimeout(iDelayTimeOut);         //-- Le spinner de chargement peut prendre plus de temps !
					await expect(pageASP.pPFooterSpinnerLoadData).not.toBeVisible({timeout:iDelayTimeOut});
				});

				test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () => {
					await fonction.popinVisible(page, sNomPopin, false);
				})

			})

        })

		test ('** Wait Until Spinner Off **', async () => {
			await expect(pageASP.pPspinnerLoadPage).not.toBeVisible();
		});

		test ('Onglet [GROUPES DE LIVRAISON DIRECTE] - Click', async() => {
			await menu.clickOnglet(pageName, 'groupesLivraisonDirecte', page);
		})

		test ('Onglet [ACHATS SUR PLACE] - Click', async() => {
			await menu.clickOnglet(pageName, 'achatsSurPlace', page);
		})

		test ('InputField [CODE ARTICLE] = "***"', async () =>  {
			await pageASP.inputFieldFiltreCodeArticle.pressSequentially(idCodeArticle.trim(), {delay:1000});
			await fonction.waitTillHTMLRendered(page);
			await fonction.wait(page, 500);		//-- Temporisation le temps que le la liste se raffraîchisse
		})

		test ('td [NB ARTICLES] > 0', async () =>  {
			expect(await pageASP.dataGridListeAchatsSurPlace.count()).toBeGreaterThan(0);
		})

    })  // End describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

    test ('** CHECK FLUX **', async () => {

        var oFlux:TypeEsb = { 
            "FLUX" 			: [],
            "WAIT_BEFORE"   : 10000,               
        };

		//-- Sélection dynamique des flux à vérifier
		aInfosTests[sRayon]['flux'].forEach(sFlux => {
			oFlux.FLUX.push({"NOM_FLUX" : sFlux, "TITRE" : "Achat N°%"});
		});

        await esb.checkFlux(oFlux, page);
        
    })

})  // End describe