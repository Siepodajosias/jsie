/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 30 - 11 - 2023
 */

const xRefTest      = "MAG_AUP_UNL";
const xDescription  = "Déblocage d'une demande d'échange ou de demande d'avoir";
const xIdTest       =  6712;
const xVersion      = '3.0';

var info = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['groupeArticle'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}        from '@playwright/test';

import { TestFunctions }         from "../../utils/functions";
import { Log }                   from "../../utils/log";
import { Help }                  from '../../utils/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }           from '../../pages/MAG/menu.page';
import { AutorisationsBlocage }  from '../../pages/MAG/autorisations-blocage.page';

//-------------------------------------------------------------------------------------

let page         : Page;

let menu         : MenuMagasin;
let pageAutBloc  : AutorisationsBlocage;

const log        = new Log();
const fonction   = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const sGroupeArticle = process.env.GROUPEARTICLE || 'Coupe / Corner'; 

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageAutBloc     = new AutorisationsBlocage(page);
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });

test.describe ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    });

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
        await menu.removeArlerteMessage(page);
    });

    test.describe('Page [ACCUEIL]', async () => {

        test('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if(isVisible){
                await menu.removeArlerteMessage(page);
            }else{
                log.set('Link [BROWSER SECURITY WARNING] - Click: ACTION ANNULEE');
                test.skip();
            }
        })

    })

    test.describe('Page [AUTORISATIONS]', () => {

        var pageName = 'autorisations';

        test('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(pageName, page); 
        })

        test('Message [ERREUR][1] - Is NOT Visible', async () => {
            await fonction.isErrorDisplayed(false, page);
        })      

        test.describe ('Onglet [BLOCAGE]', async () =>  {        

            test('Onglet [BLOCAGE] - Click', async () =>  {
                await menu.clickOnglet(pageName, 'blocage', page);
            })

            test('Message [ERREUR][2] - Is NOT Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 

            test('CheckBox ['+sGroupeArticle+'] - Click', async () => {
                var nbElement = await pageAutBloc.tdLibelleGroupeArticle.count();
                for(let elt = 0; elt < nbElement; elt ++){
                    var sElementText = await pageAutBloc.tdLibelleGroupeArticle.nth(elt).textContent();
                    if(sElementText?.match(sGroupeArticle)){
                        await pageAutBloc.tdLibelleGroupeArticle.nth(elt).click();
                        break;
                    }
                }
            })
            
            test('Button [DEBLOQUER] - Click', async () =>  {
                var isEnabled = await pageAutBloc.buttonDebloquer.isEnabled();
                if(isEnabled){
                    await fonction.clickAndWait(pageAutBloc.buttonDebloquer,page);
                }else{
                    log.set('Groupe Article ' + sGroupeArticle + ' pas bloqué. action ignorée');
                    test.skip();
                }
            })

            test('Message [ERREUR][3] - Is NOT Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })

        })

    }) // End describe Page
    
    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});
    
})