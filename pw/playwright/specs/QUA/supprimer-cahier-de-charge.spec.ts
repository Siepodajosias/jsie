/**
 * 
 * @author SIAKA KONE
 * @since 2024-12-06
 * 
 */

const xRefTest      = "QUA_ART_SCD";
const xDescription  = "Supprimer un cahier de charges à un article/ famille / sous-famille";
const xIdTest       =  7426;
const xVersion      = '3.3';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'QUALITE',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['codeArticle','rayon'],
	fileName    : __filename
};

import {  test, expect, type Page }         from '@playwright/test';
import { CartoucheInfo }                    from '@commun/types';

import { Help }                  			from '@helpers/helpers';
import { TestFunctions }         			from '@helpers/functions';
import { Log }                   			from '@helpers/log';

import { MenuQualite }           			from '@pom/QUA/menu.page';
import { ReferentielArticles }              from '@pom/QUA/referentiel-articles.page';

let page                					: Page;
let menu                					: MenuQualite;
let pageReferentielArticles                 : ReferentielArticles;

const log               					= new Log();
const fonction          					= new TestFunctions(log);

// Exploitation des paramètres passés en argument OU ceux présents dans le fichier de configuration Local
const sCodeArticle                         = fonction.getInitParam('codeArticle','5254');//L1N8
const sRayon                               = fonction.getInitParam('rayon', 'Fruits et légumes');

test.beforeAll(async ({ browser }, testInfo) => {
    page            						= await browser.newPage();
    menu            						= new MenuQualite(page, fonction);
    pageReferentielArticles                 = new ReferentielArticles(page);
    const helper    						= new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

test.describe.serial ('[' + xRefTest + ']', () =>  {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () =>  {
        await fonction.connexion(page);
    })

    test.describe ('Page [REFERENTIEL]', async () => {

        var sNomPage:string = 'referentiel';

        test ('Menu [' + sNomPage.toUpperCase() + '] - Click', async () =>  {
			await menu.click(sNomPage, page);
		})
        
        var sNomOnglet:string = 'articles';
		test.describe ('Onglet['+sNomOnglet.toUpperCase()+']', async () =>  {

            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage, sNomOnglet, page);
			})

            test ('ListBox [RAYON] = "' + sRayon + '"', async () =>{
                await fonction.clickElement(pageReferentielArticles.listBoxRayon);
                await fonction.clickElement(menu.listeBoxDropdowItem.filter({hasText:sRayon}));
            })

            test ('InputField [CODE ARTICLE] = "'+sCodeArticle+'"', async () => { 
                await fonction.sendKeys(pageReferentielArticles.datagridInputCodeArticle,sCodeArticle, false, 'Code Article');
                await fonction.wait(page, 500);//Attendre que le filtre soit appliqué;
            })

            test ('CheckBox [' + sNomOnglet + ']- Click', async () => { 
                //await fonction.clickElement(pageReferentielArticles.checkboxCocherArticles.nth(1));// On y reviendra après la correction du bug;
                await fonction.clickElement(pageReferentielArticles.datagridListeArticles.first());//A utiliser en attendant que la correction soit apportée;
            }) 

            var sNomPopin:string = 'Modification de l\'article ' + sCodeArticle;
            test.describe ('Popin [' + sNomPopin + '] - Click', async () => {

                test ('Button [MODIFIER] - Click', async () => {     
                    await fonction.clickAndWait(pageReferentielArticles.buttonModifierArticle, page);
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page,sNomPopin.toUpperCase(), true);
                })

                test ('** Until spinner off **', async () => {
                    await fonction.waitForSpinner(pageReferentielArticles.pPMaSpinner, 180000);
                })

                test ('Button [SUPPRIMER - AJOUTER UN CAHIER DE CHARGES A UN ARTICLES] - Click', async () => {
                    await fonction.clickElement(pageReferentielArticles.pPMaButtonSupprimerArticle);   
                })
                
                test ('Button [SUPPRIMER - AJOUTER UN CAHIER DE CHARGES A LA FAMILLE] - Click', async () => {
                    await fonction.clickElement(pageReferentielArticles.pPMaButtonSupprimerFamille); 
                })

                test ('Button [ENREGISTRER] - Click', async () => {  
                    await fonction.clickAndWait(pageReferentielArticles.pPMaButtonEnregistrer, page);
                })

                test ('** Wait Until Spinner Off **', async () => {
                    await fonction.waitForSpinner(pageReferentielArticles.pPMaSpinner);
                });

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page,sNomPopin.toUpperCase(), false);
                })
            }) 
        })
    })

    test ('Déconnexion', async () =>  {
        await fonction.deconnexion(page);
    })

})