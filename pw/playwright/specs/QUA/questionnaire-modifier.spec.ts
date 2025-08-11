/**
 * 
 * @author SIAKA KONE
 * @since 2024-12-02
 * 
 */

const xRefTest      = "QUA_QUE_MQU";
const xDescription  = "Modifier un questionnaire";
const xIdTest       =  4630;
const xVersion      = '3.1';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'QUALITE',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['nomQuestionnaire','rubrique','typeCritere','rayon','objet','descriptionQuestionnaire','groupeRubrique','questionnRecherche'],
	fileName    : __filename
};

import {  test, type Page }                 from '@playwright/test';
import { CartoucheInfo }                    from '@commun/types';

import { Help }                  			from '@helpers/helpers';
import { TestFunctions }         			from '@helpers/functions';
import { Log }                   			from '@helpers/log';

import { MenuQualite }           			from '@pom/QUA/menu.page';
import { ReferentielQuestionnaires }        from '@pom/QUA/referentiel-questionnaires.page';
import { ReferentielDetailQuestion }        from '@pom/QUA/referentiel-detail_questionnaire.page';

let page                					: Page;
let menu                					: MenuQualite;
let pageReferentielQuestionnaires           : ReferentielQuestionnaires;
let pageReferentielDetailQuestion           : ReferentielDetailQuestion;

const log               					= new Log();
const fonction          					= new TestFunctions(log);

const sJddFile                              = fonction.getLocalConfig('jddReferentielQuestionnaire');
const data                                  = fonction.readFile(sJddFile);

// Exploitation des paramètres passés en argument OU ceux présents dans le fichier de configuration Local
var sNomQuestionnaire                       = fonction.getInitParam('nomQuestionnaire', 'TA_Questionnaire_Modifie_'+fonction.getToday());
var sRubrique                               = fonction.getInitParam('rubrique', 'Chambre Froide'); 
var sTypeCritere                            = fonction.getInitParam('typeCritere', 'Echelle');
var sRayon                                  = fonction.getInitParam('rayon', data.sRayon);  
var sObjet                                  = fonction.getInitParam('objet', data.sObjet);
var sDescripQuestion                        = fonction.getInitParam('descriptionQuestionnaire', 'Modifier Questionnaire de test Automatique');
var sGroupeRubrique                         = fonction.getInitParam('groupeRubrique',"Bonnes Pratiques d'Hygiène (BPH)"); 
var sQuestionRech                           = fonction.getInitParam('nomQuestionnaire', 'TA_Questionnaire_Duplique_'+fonction.getToday());

var sCodeCritere   = 'CRI' + fonction.getToday();  
var sDesignCritere = 'Acceptation ' + fonction.getToday();

test.beforeAll(async ({ browser }, testInfo) => {
    page            						= await browser.newPage();
    menu            						= new MenuQualite(page, fonction);
    pageReferentielQuestionnaires           = new ReferentielQuestionnaires(page);
    pageReferentielDetailQuestion           = new ReferentielDetailQuestion(page);
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

        test ('ListBox [RAYON] = "' + sRayon + '" - Select', async () =>  {
            await fonction.clickElement(pageReferentielQuestionnaires.listBoxRayon);
            await fonction.clickAndWait(menu.listeBoxDropdowItem.filter({hasText:sRayon}), page);
        })

        test ('Button [RECHERCHER] - Click', async () => {
            await fonction.clickAndWait(pageReferentielQuestionnaires.buttonRechercherQuestionnaire, page);
        })

        test ('ListBox [OBJET]= "' + sObjet + '" - Select', async () => {
            await fonction.clickElement(pageReferentielQuestionnaires.datagridlistBoxObjet);
            await fonction.clickAndWait(menu.listeBoxDropdowItem.filter({hasText:sObjet}), page);
        })

        test ('InputField [NOM QUESTIONNAIRE] = "' + sQuestionRech + '"', async () =>  {
            await fonction.sendKeys(pageReferentielQuestionnaires.datagridinputnomquestionnaire, sQuestionRech, false, 'Nom Questionnaire');  
            await fonction.wait(page, 500); //Attendre que le filtre soit effectif;         
        })

        test ('CheckBox [LISTE QUESTIONNAIRE][1]- Click', async () => {
            await fonction.clickElement(pageReferentielQuestionnaires.checkboxCocherQuestionnaire.nth(0));          
        })

        var sNomOnglet:string = 'Détail d\'un questionnaire';

		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async () =>  {

            test ('Button [ MODIFIER QUESTIONNAIRE ] - Click', async () =>  {           
                await fonction.clickAndWait(pageReferentielQuestionnaires.buttonModifier, page);         
            })
            
            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Is Visible', async () =>  { //-- Selectionné par défaut;
                await menu.isOngletPresent(sNomOnglet);
			})

            test ('InputField [NOM QUESTIONNAIRE] = "' +sNomQuestionnaire +  '"', async () =>  {
                await fonction.sendKeys(pageReferentielDetailQuestion.inputFieldNomQuestionnaire, sNomQuestionnaire, false, 'Nom Questionnaire');         
            })

            test ('InputField [DESCRIPTION QUESTIONNAIRE] = "' +sDescripQuestion +  '"', async () =>  {
                await fonction.sendKeys(pageReferentielDetailQuestion.textAreaDescription, sDescripQuestion, false, 'Description Questionnaire');          
            })

            var sNomPopin:string = 'Création d\'un critère';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + '] - Click', async () =>  {

                test ('Button [AJOUTER CRITERE] - Click', async () =>  {
                    await fonction.clickAndWait(pageReferentielDetailQuestion.buttonAjouterCritere, page);          
                }) 

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page,sNomPopin.toUpperCase(), true);
                })

                test ('ListBox [GROUPE RUBRIQUES] = "' + sGroupeRubrique + '" - Select', async () =>  {
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcListBoxGroupeRubriques);
                    await fonction.clickAndWait(menu.listeBoxDropdowItem.filter({hasText:sGroupeRubrique}), page);
                })

                test ('ListBox [RUBRIQUES] = "' + sRubrique + '" - Select', async () =>  {
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcListBoxRubriques);
                    await fonction.clickAndWait(menu.listeBoxDropdowItem.filter({hasText:sRubrique}), page);
                })

                test ('InputField  [CODE CRITERE] = "' + sCodeCritere+ '"', async () =>  { 
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPAcInputCodeCritere,sCodeCritere, false, 'Code Critere');
                })
                
                test ('InputField  [DESIGNATION CRITERE] - Type', async () =>  {                   
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPAcInputDesignationCritere, sDesignCritere, false, 'Designation Critere');     
                })

                test ('ListBox [TYPE CRITERE]= "' + sTypeCritere + '" - Select', async () =>  {
                    await fonction.ngClickListBox(pageReferentielDetailQuestion.pPAcListBoxType, sTypeCritere);
                })

                test ('InputField [ECHELLE DE VALEUR DE] = "1"', async () =>  {
                    await pageReferentielDetailQuestion.pPAcInputEchelleValeurs1.pressSequentially('1');
                })

                test ('InputField [ECHELLE DE VALEUR A] = "5"', async () =>  {
                    await pageReferentielDetailQuestion.pPAcInputEchelleValeurs2.pressSequentially('5');
                })

                test ('Button [AJOUTER]  - Click', async () =>  {
                    await fonction.clickAndWait(pageReferentielDetailQuestion.pPAcButtonAjouterEchelle, page);                         
                })

                test ('RadioButton [CRITERE]  - Click', async () =>  {
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcRadioButtonConforme.nth(0)); 
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcRadioButtonAcceptable.nth(1));
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcRadioButtonNonConforme.nth(2));
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcRadioButtonConforme.nth(3));
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcRadioButtonAcceptable.nth(4));
                })
            
                test ('checkBox [CRITERE]  - Click', async () =>  {
                    await fonction.clickElement(pageReferentielDetailQuestion.pPcheckboxCommentObligatoire.nth(0)); 
                    await fonction.clickElement(pageReferentielDetailQuestion.pPcheckboxCommentObligatoire.nth(1));
                    await fonction.clickElement(pageReferentielDetailQuestion.pPcheckboxCommentObligatoire.nth(4));
                    await fonction.clickElement(pageReferentielDetailQuestion.pPcheckboxEliminatoire.nth(2));
                })
                
                test ('Button [VALIDER] - Click', async () =>  {
                    await fonction.clickAndWait(pageReferentielDetailQuestion.pPAcButtonValider, page);          
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page,sNomPopin.toUpperCase(), false);
                })

                test ('Button [ENREGISTRER] - Click', async () =>  {
                    await fonction.clickAndWait(pageReferentielDetailQuestion.buttonEnregistrer, page);          
                }) 
            }) 

        })
    })

    test ('Déconnexion', async () =>  {
        await fonction.deconnexion(page);
    })

})