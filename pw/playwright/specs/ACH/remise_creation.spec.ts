/**
 * 
 * @author JC CALVIERA
 * @since 2024-02-22
 * 
 */

const xRefTest      = "**"; // Ref Dynamique, Cf plus bas
const xDescription  = "**";
const xIdTest       =  0.0;
const xVersion      = '3.3';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACH',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }          from '@playwright/test';

import { Help }                     from '@helpers/helpers.js';
import { TestFunctions }            from '@helpers/functions.js';
import { Log }                      from '@helpers/log.js';

import { PageRefFou }               from '@pom/ACH/referentiel_fournisseurs.page';
import { MenuAchats }               from '@pom/ACH/menu.page';

import { CartoucheInfo }            from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuAchats;
let pageRef             : PageRefFou;

const log               = new Log();
const fonction          = new TestFunctions(log);

fonction.recordDatas();

//------------------------------------------------------------------------------------

const sRayon            = fonction.getInitParam('RAYON', 'Fruits et légumes');
const sApplication      = fonction.getRandomArray(['A la base', 'En cascade']);
const rMontantRemise    =  Math.floor(fonction.random() * 20) + 1;

const aInfosTests       = {
    'Poissonnerie'  : {
        'xRefTest'      : 'ACH_REF_POI',
        'xDescription'  : 'Définir des remises et des taxes - article POI',
        'xIdTest'       : 4914
    },
    'BCT'           : {
        'xRefTest'      : 'ACH_REF_ABC',
        'xDescription'  : 'Définir des remises et des taxes - article BCT',
        'xIdTest'       : 2723
    }, 
    'Epicerie'      : {
        'xRefTest'      : 'ACH_REF_AEP',
        'xDescription'  : 'Définir des remises et des taxes - article Epicerie',
        'xIdTest'       : 2722
    },
    'Frais Généraux': {
        'xRefTest'      : 'ACH_REF_AFG',
        'xDescription'  : 'Définir des remises et des taxes - article Frais Généraux',
        'xIdTest'       : 2724
    },  
    'Fruits et légumes': {
        'xRefTest'      : 'ACH_ART_ACR',
        'xDescription'  : 'Création d\'une remise Article',
        'xIdTest'       : 2721
    },                
};

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page    = await browser.newPage();
    menu    = new MenuAchats(page, fonction);
    pageRef = new PageRefFou(page);   
    
    //-- Modification à la volée des informations du test
    if (aInfosTests[sRayon] !== undefined) {
        info.refTest= aInfosTests[sRayon]['xRefTest'];
        info.desc   = aInfosTests[sRayon]['xDescription'];
        info.idTest = aInfosTests[sRayon]['xIdTest'];
    }

    const helper= new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACCUEIL]', async () => {

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {
            await menu.selectRayonByName(sRayon, page);
        })

    }); // End PAGE Accueil

    test.describe('Page [REFERENTIEL]', async () => {

        var sPageName   = 'referentiel';
        var sOngletName = 'fournisseurs';

        test('Page [REFERENTIEL] - Click', async () => {
            await menu.click(sPageName, page);
        })

        test ('Error Message - Is Hidden', async () =>  {
            await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la page/onglet/popin
        })

        test.describe('Onglet [FOURNISSEURS]', async () => {

            test('Onglet [FOURNISSEURS] - Click', async () => {
                await menu.clickOnglet(sPageName, sOngletName, page);
            })

            test ('Error Message - Is Hidden', async () =>  {
                await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la page/onglet/popin
            })

            test('CheckBox [FOURNISSEURS][rnd] - Click', async () => {
                const iNbFournisseurs = await pageRef.checkBoxListeFournisseurs.count();
                const iPosFournisseur = Math.floor(fonction.random() * iNbFournisseurs);
                const sLibelleFournisseur = await pageRef.tdDesignationFournisseur.nth(iPosFournisseur).textContent();
                log.set('Founisseur : ' + sLibelleFournisseur);
                await fonction.addDataSheet('CheckBox', 'Fournisseur', sLibelleFournisseur);
                await fonction.clickElement(pageRef.tdDesignationFournisseur.nth(iPosFournisseur));
            });

            test('Button [REMISE]  - Click', async () => {
                await fonction.clickElement(pageRef.buttonRemise);
            });

            var sNomPopin = "Saisie des prix catalogue, remises & taxes pour le fournisseur xxxx";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>{

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible - Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test ('Error Message - Is Hidden', async () =>  {
                    await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la page/onglet/popin
                })

                test('ListBox [TYPE DE REMISE/TAXE][rnd] - Select', async () => {
                    const iNbChoix = await pageRef.pListBoxTypeRemiseTaxe.locator('option').count();
                    const iPosChoix = Math.floor(fonction.random() * (iNbChoix - 1)) + 1;
                    const sChoixRemise = await pageRef.pListBoxTypeRemiseTaxe.locator('option').nth(iPosChoix).textContent();
                    log.set('Type Remise : ' + sChoixRemise);
                    await pageRef.pListBoxTypeRemiseTaxe.selectOption(sChoixRemise);
                });

                test('InputField [% ou €] = rnd' , async () => {
                    const bElementClickable = await pageRef.pInputPourcentage.isEnabled();
                    if (bElementClickable) {
                        await fonction.sendKeys(pageRef.pInputPourcentage, rMontantRemise, false, 'Montant Remise');
                        log.set('Montant de remise : ' + rMontantRemise);
                    } else {
                        log.set('Montant de remise : CHAMP NON MODIFIABLE');
                    }
                })

                test('ListBox [APPLICATION] = rnd', async () => {
                    const bListBoxModifiable = await pageRef.pListBoxApplications.isEnabled();
                    if (bListBoxModifiable) {
                        await fonction.selectOption(pageRef.pListBoxApplications, sApplication, 'TypeApplication');
                        log.set('type d\'application : ' + sApplication);
                    } else {
                        log.set('type d\'application : CHAMP NON MODIFIABLE');
                    }
                });

                test('DatePeacker [DEBUT] = Premier Jour', async () => {
                    const bDateEnabled = await pageRef.pDatePickerFromIcon.isVisible();
                    if (bDateEnabled) {
                        await fonction.clickElement(pageRef.pDatePickerFromIcon);
                        const bDateModifiable = await pageRef.pDatePickerDaysList.first().isEnabled();
                        if (bDateModifiable) {
                            await fonction.clickElement(pageRef.pDatePickerDaysList.first());
                        } else {
                            log.set('Date de début : CHAMP NON MODIFIABLE');
                        }
                    } else {
                        log.set('Date de début : CHAMP NON MODIFIABLE');
                    }
                })

                test('DatePeacker [FIN] = Dernier Jour', async () => {
                    const bDateEnabled = await pageRef.pDatePickerToIcon.isVisible();
                    if (bDateEnabled) {
                        await fonction.clickElement(pageRef.pDatePickerToIcon);
                        const bDateModifiable = await pageRef.pDatePickerDaysList.last().isEnabled();
                        if (bDateModifiable) {
                            await fonction.clickElement(pageRef.pDatePickerDaysList.last());
                        } else {
                            log.set('Date de fin : CHAMP NON MODIFIABLE');
                        }
                    } else {
                        log.set('Date de début : CHAMP NON MODIFIABLE');
                    }
                })

                test('CheckBox [AFFICHER LES ARTICLES INCOMPLETS]  - Click', async () => {
                    await fonction.clickCheckBox(pageRef.pCheckBoxAjoutAlaLigne, 0.5, false);
                })

                test('Button [ + ]  - Click', async () => {
                    await fonction.clickElement(pageRef.pButtonPlusRemise);
                });

                test('Button [ENREGISTRER ET FERMER]  - Click', async () => {
                    await fonction.clickAndWait(pageRef.pButtonEnregsitrerFermer, page);
                });

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden - Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })

            }); // End Popin

        }); // End ONGLET

    }); // End PAGE

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

});
