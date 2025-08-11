/**
 * 
 * @author JC CALVIERA
 *  Since 2024-02-21
 */

const xRefTest      = "MAG_ECH_DEL";
const xDescription  = "Suppression d'une Autorisation de demande d'échange";
const xIdTest       =  2705;
const xVersion      = '3.2';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Successeur de [MAG_ECH_ADD]'],
    params      : [],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}     from '@playwright/test';

import { TestFunctions }              from "@helpers/functions";
import { Log }                        from "@helpers/log";
import { Help }                       from '@helpers/helpers';

import { MenuMagasin }                from '@pom/MAG/menu.page';
import { AutorisationsEchanges }      from '@pom/MAG/autorisations-echanges.page';

import { AutoComplete, CartoucheInfo }from '@commun/types';

//-------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuMagasin;
let pageEchange     : AutorisationsEchanges;

const log           = new Log();
const fonction      = new TestFunctions(log);

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage(); 
    menu        = new MenuMagasin(page, fonction);
    pageEchange = new AutorisationsEchanges(page);
    const helper= new Help(info, testInfo, page);
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
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACCUEIL]', async () => {

		test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
			await fonction.waitTillHTMLRendered(page);
			var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
			if(isVisible){
				await menu.removeArlerteMessage(page);
			}else{
				log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
				test.skip();
			}
		})
        
	})

    test.describe('Page [AUTORISATIONS]', async () => {

        var sNomPage = 'autorisations';

        test ('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 

        test.describe('Onglet [ECHANGES]', async () => {

            test ('Onglet [ECHANGES] - Click', async () =>  {
                await menu.clickOnglet(sNomPage, 'echanges', page);
            }) 

            test ('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 

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

            const aCouplesMagasins = fonction.getLocalConfig('aAutoriEchanges');
            var iIndex  = 0;

            aCouplesMagasins.forEach(function(aCouple:any){

                var sMagCedant:string  = aCouple[0];
                var sMagCible:string   = aCouple[1];
                var bLdvTrouve:boolean = true;
                iIndex++;

                test.describe('Itération [#' + iIndex + ']', async () => {

                    test ('InputField [MAGASIN CEDANT #' + iIndex + ']  - Clear', async () => {
                        await pageEchange.inputMagasinCedant.clear();
                    })

                    test ('InputField [MAGASIN CEDANT #' + iIndex + '] = "' + sMagCedant + '"', async () => {
                        
                        log.set('Traitement association : '+ sMagCedant + ' --> ' + sMagCible);

                        var oData:AutoComplete = {
                            libelle         :'ARTICLE',
                            inputLocator    : pageEchange.inputMagasinCedant,
                            inputValue      : sMagCedant,
                            choiceSelector  :'li.gfit-autocomplete-result',
                            choicePosition  : 0,
                            typingDelay     : 100,
                            waitBefore      : 500,
                            page            : page,
                        };
                        await fonction.autoComplete(oData);
                        await fonction.wait(page, 1000);        // On attend le raffraîchissement de la page
                    })

                    test ('td [CODE]["'+sMagCible+'"] - Click', async () => {
                        log.set('Magasin Cible à Supprimer : ' + sMagCible);
                        bLdvTrouve = await pageEchange.tdListeCodeMagCible.getByText(sMagCible, { exact: true }).isVisible();
                        if(bLdvTrouve){
                            await  fonction.clickAndWait(pageEchange.tdListeCodeMagCible.getByText(sMagCible, { exact: true }), page);
                        }
                    })

                    test ('Button [SUPPRIMER] - Click #' + iIndex + '', async () => {
                        if(bLdvTrouve){
                            await fonction.clickElement(pageEchange.buttonSupprimer);
                        } else {
                            log.set('Le magasin cible [' + sMagCible + '] n\'a pas été trouvé');
                            test.skip();
                        }
                    })

                    test ('td [CODE]["'+sMagCible+'"] - Is NOT Visible', async () => {
                        await expect(pageEchange.tdListeCodeMagCible.getByText(sMagCible, { exact: true })).not.toBeVisible();                        
                    })

                })

            })

        })

    })

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})