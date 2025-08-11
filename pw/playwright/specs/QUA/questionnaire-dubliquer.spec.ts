/**
 * 
 * @author SIAKA KONE
 * @since 2024-12-02
 * 
 */

const xRefTest      = "QUA_QUE_DQU";
const xDescription  = "Dupliquer un questionnaire";
const xIdTest       =  4631;
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

import {  test, type Page }                 from '@playwright/test';
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

// Exploitation des paramètres passés en argument OU ceux présents dans le fichier de configuration Local

const sNomQuestionnaire                     = fonction.getInitParam('nomQuestionnaire', 'TA_Questionnaire_Duplique_'+ fonction.getToday());
const sRayon                                = fonction.getInitParam('rayon', 'Crèmerie'); 
const sDescripQuestion                      = fonction.getInitParam('descriptionQuestionnaire', 'Duplication de Questionnaire des Tests Automatiques');
const sQuestionRech                         = fonction.getInitParam('nomQuestionnaire', 'TA_Questionnaire_Mag_');

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

            test ('InputField [NOM QUESTIONNAIRE] = "' + sQuestionRech + '"', async () =>  {
                await fonction.sendKeys(pageReferentielQuestionnaires.datagridinputnomquestionnaire, sQuestionRech, false, 'Nom Questionnaire');  
                await fonction.wait(page, 500); //Attendre que le filtre soit effectif;         
            })

            test ('CheckBox [LISTE QUESTIONNAIRE][1]- Click', async () => {
                await fonction.clickElement(pageReferentielQuestionnaires.checkboxCocherQuestionnaire.nth(0));          
            })

        })

        var sNomPopin:string = "DUPLICATION D'UN QUESTION";
        test.describe ('Popin [' + sNomPopin + ']', async () => {   
            
            test ('Button [DUPLIQUER QUESTIONNAIRE] - Click', async () => {           
                await fonction.clickAndWait(pageReferentielQuestionnaires.buttonDupliquer, page);       
            })

            test ('Popin [' + sNomPopin + '] - Is Visible', async () => {
                await fonction.popinVisible(page,sNomPopin.toUpperCase(), true);
            })

            test ('InputField [NOM QUESTIONNAIRE] = "' + sNomQuestionnaire + '"', async () => {
                await fonction.sendKeys(pageReferentielQuestionnaires.pPDqInputNomQuestionnaire, sNomQuestionnaire, false, 'Nom Questionnaire');           
            })

            test ('InputField [DESCRIPTION QUESTIONNAIRE] = "' + sDescripQuestion + '"', async () => {
                await fonction.sendKeys(pageReferentielQuestionnaires.pPDqTextareaDescription, sDescripQuestion, false, 'Description Questionnaire');
            }) 

            test ('Button [CONFIRMER DUPLICATION DU QUESTIONNAIRE] - Click', async () => {           
                await fonction.clickAndWait(pageReferentielQuestionnaires.pPDqButtonDuppliquer, page);        
            })
            
            test ('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                await fonction.popinVisible(page,sNomPopin.toUpperCase(), false);
            })
        })

    })

    test ('Déconnexion', async () =>  {
        await fonction.deconnexion(page);
    })

})