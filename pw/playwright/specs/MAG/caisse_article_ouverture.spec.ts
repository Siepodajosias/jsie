/**
 * 
 * @author JC CALVIERA
 *  Since 2024-04-02
 */

const xRefTest      = "MAG_PRI_OAC";
const xDescription  = "Ouvrir un Article en Caisse";
const xIdTest       =  300;
const xVersion      = '3.3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['ville','groupeArticle', 'codeArticle'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}   from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';
import { EsbFunctions }             from "@helpers/esb";

import { MenuMagasin }              from '@pom/MAG/menu.page';
import { PrixGestion }              from '@pom/MAG/prix-gestion.page';

import { AutoComplete, CartoucheInfo, TypeEsb } from '@commun/types';

//-------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pagePrix            : PrixGestion;
let esb                 : EsbFunctions;

const log               = new Log();
const fonction          = new TestFunctions(log);

//-----------------------------------------------------------------------------------------

const villeCible        = fonction.getInitParam('ville', 'Tours (G182)');
const idArticle         = fonction.getInitParam('codeArticle', '8217');
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Fruits et légumes'); 

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    esb             = new EsbFunctions(fonction);
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pagePrix        = new PrixGestion(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe ('Page [PRIX]', async () => {

        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            await menu.pPopinAlerteSanitaire.isVisible().then(async (isVisible) => {
                if(isVisible){
                    await menu.removeArlerteMessage(page);
                }else{
                    log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                    test.skip();
                }
            })
        })

        var sNomPage = 'prix';

        test ('Page [PRIX] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 

        test ('ListBox [VILLE] = "' + villeCible + '"', async () => {
            await menu.selectVille(villeCible, page);
        })
        
        test ('ListBox [GROUPE] = "' + sGroupeArticle + '"', async() => {
            await fonction.selectOption(pagePrix.listBoxGrpArticle, sGroupeArticle, 'Groupe Article');
        })

        test ('Button [OUVRIR EN CAISSE] - Click', async () => {
            await fonction.clickAndWait(pagePrix.buttonOuvrirCaisse, page);
        })

        var sNomPopin   = 'OUVERTURE EN CAISSE';        
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>{

            test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible - Check', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            })

            test ('InputField [ARTICLE] = "' + idArticle + '"', async () => {
                var oData:AutoComplete = {
                    libelle         :'ARTICLE',
                    inputLocator    : pagePrix.pPInputArticle,
                    inputValue      : idArticle,
                    choiceSelector  :'li.gfit-autocomplete-result',
                    choicePosition  : 0,
                    typingDelay     : 100,
                    waitBefore      : 500,
                    page            : page,
                };
                await fonction.autoComplete(oData);
            })

            test ('Button [ + ] - Click', async () => {
                await fonction.clickAndWait(pagePrix.pPbuttonPlusOEC, page);
            })

            // On décrémente le prix de 1 centime afin de pouvoir renouveler l'opération plusieurs fois si possible
            test ('Input [NOUVEAU PVC] = "Prix actuel - 0.01"', async() => {
                if (await pagePrix.pPinputNouveauPvcOEC.isEnabled()) {
                    const rAncienPrix = await pagePrix.pPinputPvcActuel.inputValue();
                    log.set('Prix Initial : ' + parseFloat(rAncienPrix.replace(',', '.')) + '€');
                    await fonction.addDataSheet('InputField', 'Prix Initial', parseFloat(rAncienPrix.replace(',', '.')));
                    const rNouveauPrix = Math.floor((parseFloat(rAncienPrix.replace(',', '.')) - 0.01) * 100) / 100;
                    log.set('Nouveau Prix : ' + rNouveauPrix + '€');
                    await fonction.sendKeys(pagePrix.pPinputNouveauPvcOEC, rNouveauPrix, false, 'Nouveau Prix');
                } else {
                    log.set('Prix Non modifiable : "Impossible de modifier les informations de tarification car le prix a été récemment défini par la centrale"');
                }
            })

            // OPTIONNEL : Origine obligatoire. Parfois pas sélectionnée par défaut.
            test ('ListBox [ORIGINE][Last] - Select', async() => {
                if (await pagePrix.pPlistBoxOrigine.isEnabled()) {
                    await pagePrix.pPlistBoxOrigine.selectOption({ index: 1 });
                } else {
                    test.skip();
                }
            })

            // OPTIONNEL : Variete obligatoire. Parfois pas sélectionnée par défaut.
            test ('ListBox [VARIETE][Last] - Select', async() => {
                if (await pagePrix.pPlistBoxVariete.isEnabled()) {
                    await pagePrix.pPlistBoxVariete.selectOption({ index: 1 });
                } else {
                    test.skip();
                }
            })

            // OPTIONNEL : Catégorie obligatoire. Parfois pas sélectionnée par défaut.
            test ('ListBox [CATEGORIE][Last] - Select', async() => {
                if (await pagePrix.pPlistBoxCategorie.isEnabled()) {
                    await pagePrix.pPlistBoxCategorie.selectOption({ index: 1 });
                } else {
                    test.skip();
                }
            })

            test ('Button [ENREGISTRER] - Click', async () => {
                // Souvent sur le click du bouton enregister, on un moment de "temps mort" avant la fermerture de la popin, ensuite vient le chargement des données
                // On va donc attendre que le spinner soit invisible pour éviter une eventuelle erreur causée par ces deux cas ci-dessus
                const responsePromise = page.waitForResponse(resp => resp.url().includes('/ws/lieux-vente/') && resp.status() === 204);
                await fonction.clickAndWait(pagePrix.pPbuttonEnregistrerOEC, page);
                await responsePromise;
            })

            test.skip ('** Wait Until Spinner Off **', async () => {
                await fonction.waitForSpinner(pagePrix.pPspinner, 300000);
            });

            test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden - Check', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            })

        })

        test ('InputField [ARTICLE] = "' + idArticle + '"', async() => {
            await fonction.sendKeys(pagePrix.inputArticle, idArticle, false, 'Article');
            await fonction.wait(page, 250);     //-- Temporisation le temps que la liste se raffraîchisse
        })

        test ('CheckBox [ARTICLE][0] - Is Visible', async () => {
            expect(await pagePrix.checkBoxDataGrid.count()).toEqual(1);
        })

    })

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

    test ('** CHECK FLUX **', async () =>  {
            
        const oFlux:TypeEsb = { 
            FLUX : [
                {
                    NOM_FLUX    : "EnvoyerTarifMagasin_Relais"
                }, 
                {
                    NOM_FLUX    : "Diffuser_TarifRelaisLocal"
                }
            ],
            WAIT_BEFORE     : 3000,                // Optionnel
        };
        await esb.checkFlux(oFlux, page);
    
    })

})