/**
 * @author Mathis NGUYEN
 * @description Créer une gamme
 * @since 2024-05-14
 * 
 */
const xRefTest      = "MAG_GPE_ADD";
const xDescription  = "Créer une gamme";
const xIdTest       =  9219;
const xVersion      = '3.2';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : [],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { expect, test, type Page}   from '@playwright/test';

import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';
import { EsbFunctions }             from '@helpers/esb';

import { MenuMagasin }              from '@pom/MAG/menu.page';
import { AutorisationsGammes }      from '@pom/MAG/autorisations-gammes.page';

import { CartoucheInfo, AutoComplete } from '@commun/types';
//------------------------------------------------------------------------------------

let page                  	: Page;
let menu                  	: MenuMagasin;
let pageGammes              : AutorisationsGammes;
let esb                     : EsbFunctions;

const log                 	= new Log();
const fonction            	= new TestFunctions(log);

//------------------------------------------------------------------------------------

const sRayons       = fonction.getInitParam('listeRayons', 'Frais Généraux,Poissonnerie,Fruits et légumes, Crèmerie'); // Changing rayons and their order might fail the test !
const aRayons       = sRayons.split(',');


const sEnseigne     = fonction.getInitParam('enseigne', 'Biofrais')
const sEnseigne2    = fonction.getInitParam('enseigne2', 'Fresh by Banco Fresco')

//Define gammes to be created
const gammesDetails = [
    { 
        sRayon: aRayons[0],
        sDesignation: 'TA_Designation1',
        sEnseigne: sEnseigne,
        sMagasinContient: 'TA_',
        sMagasinContientPas: sEnseigne,
    },
    { 
        sRayon: aRayons[1],
        sDesignation: 'TA_Designation2',
        sEnseigne: sEnseigne
    },
    { 
        sRayon: aRayons[2],
        sDesignation: 'TA_Designation3',
        sEnseigne: sEnseigne
    },
    { 
        sRayon: aRayons[2],
        sDesignation: 'TA_Designation4',
        sEnseigne: sEnseigne2
    }
];


// Used to check rules (Note : last rule check will create a fifth gamme)
const sRayonTest         = aRayons[3]
const sEnseigneTest      = sEnseigne2
const sDesignationTest   = 'TA_DesignationTest'; //aimed to be modified as TA_Designation5 (see gamme_update.spec.ts) 
const sDesignationAutres = 'Autres';
const sDesignationAltri  = 'Altri';


//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuMagasin(page, fonction);
    pageGammes          = new AutorisationsGammes(page); 
	const helper 		= new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------  

test.describe.serial('[' + xRefTest + ']', async () => {
    
    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [AUTORISATIONS]', async () => {

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

        var sPageName = 'autorisations';

        test ('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(sPageName, page);
        })

        test.describe ('Onglet [GAMMES]', async () => {

            var sNomOnglet = 'gammes';
            test ('Onglet [GAMMES] - Click', async () => {
                await menu.clickOnglet(sPageName, sNomOnglet, page);
            })


            // *************** CREATING 3 GAMMES ***************

            gammesDetails.forEach((gamme, i) => {

                const nomPopin = 'Création d\'une gamme';
            
                test.describe ('Popin [' + nomPopin.toUpperCase() + ' #' + (i + 1) + ']', async () => {
            
                    test ('Button [CREER GAMME] - Click', async () => {
                        await fonction.clickAndWait(pageGammes.buttonCreer, page);
                    });
            
                    test ('Popin [' + nomPopin.toUpperCase() + '] - Is Visible', async () => {
                        await fonction.popinVisible(page, sNomOnglet, true);
                    });
            
                    test ('ListBox [RAYON] = "' + gamme.sRayon + '"', async () => {
                        await fonction.ngClickListBox(pageGammes.pPAddListBoxRayon, gamme.sRayon, pageGammes.pPAddListChoixRayons);
                    });
            
                    test ('InputField [DESIGNATION] = "' + gamme.sDesignation + '"', async () => {
                        await fonction.sendKeys(pageGammes.pPAddInputDesignation, gamme.sDesignation, false, 'Désignation');
                    });
            
                    test ('CheckBox [ENSEIGNES] - Select', async () => {
                        await fonction.clickElement(pageGammes.pPAddTdEnseignes.filter({ hasText: gamme.sEnseigne }));
                    });
            
                    if (gamme.sMagasinContient && gamme.sMagasinContientPas) {        

                        test ('AutoComplete [MAGASIN CONTIENT] = "' + gamme.sMagasinContient + '"', async () =>  {
                            const autoComplete:AutoComplete = {
                                libelle         : 'Magasin',
                                inputLocator    : pageGammes.pPAddInputContient,
                                inputValue      : gamme.sMagasinContient,
                                choiceSelector  : 'ngb-typeahead-window button.dropdown-item',
                                page            : page
                            };
                            await fonction.autoComplete(autoComplete);
                        });

                        test ('AutoComplete [MAGASIN CONTIENT PAS] = "' + gamme.sMagasinContientPas + '"', async () =>  {
                            const autoComplete:AutoComplete = {
                                libelle         : 'Magasin',
                                inputLocator    : pageGammes.pPAddInputContientPas,
                                inputValue      : gamme.sMagasinContientPas,
                                choiceSelector  : 'ngb-typeahead-window button.dropdown-item',
                                page            : page
                            };
                            await fonction.autoComplete(autoComplete);
                        });
                        
                    }
            
                    test ('Button [ENREGISTRER GAMME] - Click', async () => {
                        await fonction.clickAndWait(pageGammes.pPAddButtonEnregistrer, page);
                    });

                    test ('Popin [' + nomPopin.toUpperCase() + '] - Is Hidden', async () => {
                        await fonction.popinVisible(page, sNomOnglet, false);
                    });

                });
                
            });

            // ***********************************************************************************************************


            // Checking rules (Note : "same" is relative to gamme of index 1)

            var sNomPopin2 = 'Création d\'une gamme de Test';
            test.describe ('Popin [' + sNomPopin2.toUpperCase() + ']', async () => { 

                test ('Button [CREER GAMME Test] - Click', async () => {
                    await fonction.clickAndWait(pageGammes.buttonCreer, page);
                })


                // *************** GAMME TEST #T1 : CHECK THAT CREATING GAMME USING SAME RAYON / SAME SIGN IS NOT POSSIBLE ***************

                test ('ListBox [RAYON #T1] = "' + gammesDetails[0].sRayon + '"', async () => {
                    await fonction.ngClickListBox(pageGammes.pPAddListBoxRayon, gammesDetails[0].sRayon, pageGammes.pPAddListChoixRayons);  //using same rayon
                })

                test ('CheckBox [ENSEIGNES #T1] - Select', async () => {
                    await fonction.clickElement(pageGammes.pPAddTdEnseignes.filter({ hasText: sEnseigneTest })); //select to wait for element to appear
                    const disabledCheckBoxCount = await pageGammes.pPAddTdEnseignesDisabled.count();
                    expect(disabledCheckBoxCount).toBeGreaterThanOrEqual(1);
                    await fonction.clickElement(pageGammes.pPAddTdEnseignes.filter({ hasText: sEnseigneTest })); //unselect it
                })

                // ***********************************************************************************************************


                // *************** GAMME TEST #T2 : CHECK THAT CREATING GAMME USING SAME RAYON / SAME DESIGNATION RAISE AN ERROR ***************

                
                test ('InputField [DESIGNATION #T2] = "' + gammesDetails[0].sDesignation + '"', async () => {
                    await fonction.sendKeys(pageGammes.pPAddInputDesignation, gammesDetails[0].sDesignation, false, 'Désigantion #T2'); //using same designation
                });

                test ('CheckBox [ENSEIGNES #T2] - Select', async () => {
                    await fonction.clickElement(pageGammes.pPAddTdEnseignes.filter({ hasText: sEnseigneTest })); //using now other sign
                })

                test ('Button [ENREGISTRER GAMME #T2] - Click', async () => {
                    await fonction.clickAndWait(pageGammes.pPAddButtonEnregistrer, page);
                })

                test ('Alerte [ENREGISTRER GAMME #T2] - is Visible', async () => {
                    await fonction.isDisplayed(pageGammes.pPAlert); //expect an error : gamme cannot be saved
                });

                // ***********************************************************************************************************


                // *************** GAMME TEST #T3 : CHECK THAT CREATING GAMME USING SAME RAYON / OTHER DESIGNATION / OTHER SIGNS BUT SAME SHOPS RAISE AN ERROR ***************


                test ('InputField [DESIGNATION #T3] = "' + sDesignationTest + '"', async () => {
                    await fonction.sendKeys(pageGammes.pPAddInputDesignation, sDesignationTest, false, 'Désigantion #T3'); //using now other designation
                });

                test ('AutoComplete [MAGASIN CONTIENT #T3] = "' + gammesDetails[0].sMagasinContient + '"', async () =>  {
                    const autoComplete:AutoComplete = {
                        libelle         : 'Magasin',
                        inputLocator    : pageGammes.pPAddInputContient,
                        inputValue      : gammesDetails[0].sMagasinContient,
                        choiceSelector  : 'ngb-typeahead-window button.dropdown-item',
                        page            : page
                    }
                    await fonction.autoComplete(autoComplete); //using same shop
                })

                test ('Alerte [ENREGISTRER GAMME #T3] - is Visible', async () => {
                    await fonction.isDisplayed(pageGammes.pPAlert); //expect an error : gamme cannot be saved
                });

                // ***********************************************************************************************************


                // *************** GAMME TEST #T4 : CHECK THAT CREATING GAMME USING DESIGNATION "Autres" or "Altri" RAISE AN ERROR ***************

                test ('ListBox [RAYON #T4] = "' + sRayonTest + '"', async () => {
                    await fonction.ngClickListBox(pageGammes.pPAddListBoxRayon, sRayonTest, pageGammes.pPAddListChoixRayons); //using now other rayon 
                })

                test ('CheckBox [ENSEIGNES #T4] - Select', async () => {
                    await fonction.clickElement(pageGammes.pPAddTdEnseignes.filter({ hasText: sEnseigneTest }));  //unselect previous sign
                    await fonction.clickElement(pageGammes.pPAddTdEnseignes.filter({ hasText: gammesDetails[0].sEnseigne }));  //using now same sign
                })

                test ('InputField [DESIGNATION #T4] = "' + sDesignationAutres + '"', async () => {
                    await fonction.sendKeys(pageGammes.pPAddInputDesignation, sDesignationAutres, false, 'Désigantion #T4'); //using designation "Autres"
                });

                test ('Button [ENREGISTRER GAMME #T4] - Click', async () => {
                    await fonction.clickAndWait(pageGammes.pPAddButtonEnregistrer, page);
                })

                test ('Alerte [ENREGISTRER GAMME #T4] - is Visible', async () => {
                    await fonction.isDisplayed(pageGammes.pPAlert); //expect an error : gamme cannot be saved
                });

                test ('InputField [DESIGNATION #T4bis] = "' + sDesignationAltri + '"', async () => {
                    await fonction.sendKeys(pageGammes.pPAddInputDesignation, sDesignationAltri, false, 'Désigantion #T4Bis'); //using designation "Altri"
                });

                test ('Button [ENREGISTRER GAMME #T4bis] - Click', async () => {
                    await fonction.clickAndWait(pageGammes.pPAddButtonEnregistrer, page);
                })

                test ('Alerte [ENREGISTRER GAMME #T4bis] - is Visible', async () => {
                    await fonction.isDisplayed(pageGammes.pPAlert); //expect an error : gamme cannot be saved
                });

                // ***********************************************************************************************************

                // *************** GAMME TEST #T5 : CHECK THAT CREATING GAMME USING OTHER RAYON BUT SAME DESIGNATION WORKS ***************

                test ('InputField [DESIGNATION #T5] = "' + gammesDetails[0].sDesignation + '"', async () => {
                    await fonction.sendKeys(pageGammes.pPAddInputDesignation, gammesDetails[0].sDesignation, false, 'Désigantion #T5'); //using same designation
                });

                test ('Button [ENREGISTRER GAMME #T5] - Click', async () => {
                    await fonction.clickAndWait(pageGammes.pPAddButtonEnregistrer, page);
                    await fonction.popinVisible(page, sNomOnglet, false); //expect no error : gamme is created
                })

                // ***********************************************************************************************************
            })
        })
    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})