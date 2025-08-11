/**
 * 
 * @author SIAKA KONE
 * @since 2024-12-06
 * 
 */

const xRefTest      = "QUA_ART_TRA";
const xDescription  = "Trier les articles";
const xIdTest       =  5187;
const xVersion      = '3.1';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'QUALITE',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['codeArticle','labelDesignationArticle','labelGroupeArticle','labelFamille','labelsousFamille','rayon'],
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
const sCodeArticle                         = fonction.getInitParam('codeArticle','L1N8');
const sLabelDesignationArticle             = fonction.getInitParam('labelDesignationArticle', 'Yaourt citron 140g FDP');
const sLabelGroupeArticle                  = fonction.getInitParam('labelGroupeArticle', 'Frais LS');
const sLabelFamille                        = fonction.getInitParam('labelFamille', 'Yaourt');
const sLabelsousFamille                    = fonction.getInitParam('labelsousFamille', 'Yaourt fruit');
const sRayon                               = fonction.getInitParam('rayon', 'Crèmerie');

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
                await fonction.clickElement(pageReferentielArticles.datagridLabelCodeArticle);
            }) 

            test.describe ('Vérification', async () => {

                test ('Label [Code article] = "'+sCodeArticle+'" - Check', async () => {
                    expect(await pageReferentielArticles.datagridLabelCodeArticle.textContent()).toContain(sCodeArticle);
                })
    
                test ('Label [Désignation article] = "'+sLabelDesignationArticle+'"- Check', async () => {
                    expect(await pageReferentielArticles.datagridLabelDesignationArticle.textContent()).toContain(sLabelDesignationArticle);
                })
    
                test ('Label [Groupe article] = "'+sLabelGroupeArticle+'" - Check', async () => {
                    expect(await pageReferentielArticles.datagridLabelListBoxGroupeArticle.textContent()).toContain(sLabelGroupeArticle);
                })
    
                test ('Label [Famille] ="'+sLabelFamille+'" - Check', async () => {
                    expect(await pageReferentielArticles.datagridLabelFamille.textContent()).toContain(sLabelFamille);
                })
    
                test ('Label [Sous Famille] ="'+sLabelsousFamille+'" - Check', async () => {
                    expect(await pageReferentielArticles.datagridLabelsousFamille.textContent()).toContain(sLabelsousFamille);
                })
            }) 
        })
    })

    test ('Déconnexion', async () =>  {
        await fonction.deconnexion(page);
    })

})