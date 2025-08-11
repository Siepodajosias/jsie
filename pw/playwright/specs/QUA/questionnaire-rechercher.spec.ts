/**
 * 
 * @author SIAKA KONE
 * @since 2024-12-02
 * 
 */

const xRefTest      = "QUA_QUE_RQU";
const xDescription  = "Rechercher un Questionnaire";
const xIdTest       =  9744;
const xVersion      = '3.1';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'QUALITE',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['nomQuestionnaire','descriptionQuestionnaire','rayon','objet'],
	fileName    : __filename
};

import {  test, expect, type Page }         from '@playwright/test';

import { CartoucheInfo }                    from '@commun/types';

import { Help }                  			from '@helpers/helpers';
import { TestFunctions }         			from '@helpers/functions';
import { Log }                   			from '@helpers/log';

import { MenuQualite }           			from '@pom/QUA/menu.page';
import { ReferentielQuestionnaires }        from '@pom/QUA/referentiel-questionnaires.page';

let page                					: Page;
let menu                					: MenuQualite;
let pageReferentielQuestionnaires           : ReferentielQuestionnaires;

const log               					= new Log();
const fonction          					= new TestFunctions(log);

const sJddFile                              = fonction.getLocalConfig('jddReferentielQuestionnaire');
const data                                  = fonction.readFile(sJddFile);

// Exploitation des paramètres passés en argument OU ceux présents dans le fichier de configuration Local

const sDescripQuestion                     = fonction.getInitParam('descriptionQuestionnaire', data.sDescripQuestion);
const sQuestionRech                        = fonction.getInitParam('nomQuestionnaire', data.sQuestionRech);
const sRayon                               = fonction.getInitParam('rayon', data.sRayon);  
const sObjet                               = fonction.getInitParam('objet',data.sObjet); 

//------------------------------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            						= await browser.newPage();
    menu            						= new MenuQualite(page, fonction);
    pageReferentielQuestionnaires           = new ReferentielQuestionnaires(page);
    const helper    						= new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']',  () =>  {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () =>  {
        await fonction.connexion(page);
    })

    var sNomPage:string = 'referentiel';

    test.describe ('Page [' + sNomPage.toUpperCase() + ']', async () => {

        test ('Menu [' + sNomPage.toUpperCase() + '] - Click', async () =>  {
			await menu.click(sNomPage, page);
		})
        
        var sNomOnglet:string = 'questionnaires';

		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async () =>  {

            test ('Menu [' + sNomOnglet.toUpperCase() + '] - Click', async () =>  {
                await menu.clickOnglet(sNomPage, sNomOnglet, page);
            })

            test ('ListBox [RAYON] = "' + sRayon + '" - Select', async () =>  {
                await fonction.clickElement(pageReferentielQuestionnaires.listBoxRayon);
                await fonction.clickAndWait(menu.listeBoxDropdowItem.filter({hasText:sRayon}), page);
            })

            test ('Button [RECHERCHER] - Click', async () => {
                await fonction.clickAndWait(pageReferentielQuestionnaires.buttonRechercherQuestionnaire, page);
            })

            test ('ListBox [OBJET]= "' + sObjet + '" - Select', async () =>  {
                await fonction.clickElement(pageReferentielQuestionnaires.datagridlistBoxObjet);
                await fonction.clickAndWait(menu.listeBoxDropdowItem.filter({hasText:sObjet}), page);
            })

            test ('InputField [NOM QUESTIONNAIRE] = "' + sQuestionRech + '"', async () =>  {
                await fonction.sendKeys(pageReferentielQuestionnaires.datagridinputnomquestionnaire, sQuestionRech, false, 'Nom Questionnaire');  
                await fonction.wait(page, 500); //Attendre que le filtre soit effectif;         
            })

        })

        test.describe ('Vérification Enregistement', async () => {

            test ('Label [Objet du questionnaire] = "' + sObjet + '" - Check', async () => {
                expect(await pageReferentielQuestionnaires.datagridObjet.last().textContent()).toContain(sObjet);
            })

            test ('Label [Questionnaire] = "' + sQuestionRech + '" - Check', async () => {
                expect(await pageReferentielQuestionnaires.datagridQuestionnaire.last().textContent()).toContain(sQuestionRech);
            })

            test ('Label [Description] = "' + sDescripQuestion + '" - Check', async () => {
                expect(await pageReferentielQuestionnaires.datagridDescription.last().textContent()).toContain(sDescripQuestion);
            })
        })

    })

    test ('Déconnexion', async () =>  {
        await fonction.deconnexion(page);
    })

})