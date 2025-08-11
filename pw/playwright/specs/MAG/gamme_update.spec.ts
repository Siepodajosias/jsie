/**
 * @author Mathis NGUYEN
 * @description Modifier une gamme
 * @since 2024-05-14
 * 
 */
const xRefTest      = "MAG_GPE_UPD";
const xDescription  = "Modifier une gamme";
const xIdTest       =  9294;
const xVersion      = '3.1';
 
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

import { MenuMagasin }              from '@pom/MAG/menu.page';
import { AutorisationsGammes }      from '@pom/MAG/autorisations-gammes.page';

import { CartoucheInfo, AutoComplete } from '@commun/types';
//------------------------------------------------------------------------------------

let page                  	: Page;
let menu                  	: MenuMagasin;
let pageGammes              : AutorisationsGammes;

const log                 	= new Log();
const fonction            	= new TestFunctions(log);

//------------------------------------------------------------------------------------

const sEnseigne                     = fonction.getInitParam('enseigne', 'Biofrais')

//--- Used to identify the gamme we want to update
const sDesignationMod               = fonction.getLocalConfig('gammeToUpdate')
const sRayonMod                     = fonction.getInitParam('rayon', 'Crèmerie') //sRayonMod MUST BE COHERENT with gamme having sDesignationMod designation !!
//----------

const sDesignationNew               = 'TA_Designation5';
const sMagasinContientNew           = 'TA_';
const sMagasinContientPasNew        = sEnseigne;
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

            test ('CheckBox [GAMMES][first + last] - Select', async () => {
                await fonction.clickElement(pageGammes.gammeRows.first());
                await fonction.clickElement(pageGammes.gammeRows.last());
                await expect(pageGammes.buttonModifier).toBeDisabled(); //expect that updating is not possible
            });

            test ('CheckBox [GAMMES][first] - Unselect', async () => {
                await fonction.clickElement(pageGammes.gammeRows.first());
            });

            test ('CheckBox [GAMMES][last] - Unselect', async () => {
                await fonction.clickElement(pageGammes.gammeRows.last());
            });

            test ('CheckBox [GAMMES] - Select', async () => {
                let bFound = false;
                const rows = pageGammes.gammeRows
                const rowCount = await rows.count();

                for (let i = 0; i < rowCount; i++) {
                    const row = rows.nth(i);
                    
                    const currentRayon = await row.locator('td.col-rayon').textContent();
                    const currentDesignation = await row.locator('td.col-designation').textContent();
                    
                    if (currentRayon.trim() === sRayonMod && currentDesignation.trim() === sDesignationMod) { //if both rayon and designation match, then we have Found the gamme to update
                        await fonction.clickElement(row);
                        bFound = true;
                        break;
                    }
                }
                expect(bFound).toBe(true);
            });

            
            test ('Button [MODIFIER GAMME] - Click', async () => {
                await fonction.clickAndWait(pageGammes.buttonModifier, page);
            })

            var sNomPopin = 'Modification d\'une gamme';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomOnglet, true);
                })

                test ('InputField [DESIGNATION] = "' + sDesignationNew + '"', async () => {
                    await fonction.sendKeys(pageGammes.pPAddInputDesignation, sDesignationNew); //use new designation
                });

                test ('AutoComplete [MAGASIN CONTIENT] = "' + sMagasinContientNew + '"', async () =>  {
                    const autoComplete:AutoComplete = {
                        libelle         : 'Magasin',
                        inputLocator    : pageGammes.pPAddInputContient,
                        inputValue      : sMagasinContientNew,
                        choiceSelector  : 'ngb-typeahead-window button.dropdown-item',
                        page            : page
                    }
                    await fonction.autoComplete(autoComplete);
                })

                test ('AutoComplete [MAGASIN CONTIENT PAS] = "' + sMagasinContientPasNew + '"', async () =>  {
                    const autoComplete:AutoComplete = {
                        libelle         : 'Magasin',
                        inputLocator    : pageGammes.pPAddInputContientPas,
                        inputValue      : sMagasinContientPasNew,
                        choiceSelector  : 'ngb-typeahead-window button.dropdown-item',
                        page            : page
                    }
                    await fonction.autoComplete(autoComplete);
                })


                test ('Button [ENREGISTRER GAMME] - Click', async () => {
                    await fonction.clickAndWait(pageGammes.pPAddButtonEnregistrer, page);

                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () => {
                    await fonction.popinVisible(page, sNomOnglet, false); //expect no error : gamme is updated
                })

            })

            test ('DataGrid [VALUES] - Check', async () => {

                const expectedValues = [ //expected modified content
                    {   header: 'Enseignes', 
                        content: sEnseigne
                    },
                    { 
                        header: 'Contient aussi', 
                        content: sMagasinContientNew 
                    },
                    { 
                        header: 'Ne contient pas', 
                        content: sMagasinContientPasNew 
                    }
                ];

                let bFound = false;
                const rows = pageGammes.gammeRowsDesignation;
                const rowCount = await rows.count();

                for (let i = 0; i < rowCount; i++) {
                    const currentDesignation = await rows.nth(i).textContent();
                    if (currentDesignation.trim() === sDesignationNew) { //if designation match, then we have found the gamme we gave updated
                        let dataGridValues = await fonction.getDataGridValues2(page,2,i+1) //get now all the values of the modified row
                        for (const { header, content } of expectedValues) {
                            for (const element of dataGridValues) {
                                if (element.sHeader.trim() === header) {
                                    expect(element.sContenu.trim()).toContain(content); //expect right modifications
                                }
                            }
                        }
                        bFound = true;
                        break;
                    }
                }   
                expect(bFound).toBe(true); //expect gamme to update to be found

            })

        })

    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})