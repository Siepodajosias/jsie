/**
 * 
 * @author SIAKA KONE
 * @since 2024-12-05
 * 
 */

const xRefTest      = "QUA_DET_ACE";
const xDescription  = "Ajouter un critère de type échelle";
const xIdTest       =  6661;
const xVersion      = '3.0';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'QUALITE',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      :  ['nomQuestionnaire','groupeRubrique','codeCritere','typeCritere','designationCritere','valeurPossible','rubrique','rayon','objet'],
	fileName    : __filename
};

import {  test, expect, type Page }         from '@playwright/test';
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

// Exploitation des paramètres passés en argument OU ceux présents dans le fichier de configuration Local
const sJddFile                             = fonction.getLocalConfig('jddReferentielQuestionnaire');
const data                                 = fonction.readFile(sJddFile);

var sNomQuestionnaire                      = fonction.getInitParam('nomQuestionnaire', 'TA_QuestionnaireTypeEchelle_'+ fonction.getToday());
var sGroupeRubrique                        = fonction.getInitParam('groupeRubrique','Détail'); 
var sCodecritere                           = fonction.getInitParam('codeCritere','CRI0287'); 
var sTypeCritere                           = fonction.getInitParam('typeCritere', 'Echelle');
var sDesignationcritere                    = fonction.getInitParam('designationCritere','type Echelle'); 
var sRubrique                              = fonction.getInitParam('rubrique', 'Emballage'); 
var sRayon                                 = fonction.getInitParam('rayon', data.sRayon);  
var sObjet                                 = fonction.getInitParam('objet', data.objet);

test.beforeAll(async ({ browser }, testInfo) => {
    page            					   = await browser.newPage();
    menu            					   = new MenuQualite(page, fonction);
    pageReferentielQuestionnaires          = new ReferentielQuestionnaires(page);
    pageReferentielDetailQuestion          = new ReferentielDetailQuestion(page);
    const helper    					   = new Help(info, testInfo, page);
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
        
        var sNomOnglet:string = 'Détail d\'un questionnaire';

		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async () =>  {

            test ('Button [ CREER QUESTIONNAIRE ] - Click', async () =>  {           
                await fonction.clickAndWait(pageReferentielQuestionnaires.buttonCreerQuestionnaire, page);           
            })

            test ('ListBox [RAYON]= "' + sRayon + '" - Select', async () =>  {
                await fonction.clickElement(pageReferentielQuestionnaires.pPGrListBoxRayonQuest);
                await fonction.clickAndWait(menu.listeBoxDropdowItem.filter({hasText:sRayon}), page);
            })

            test ('ListBox [OBJET]= "' + sObjet + '" - Select', async () =>  {
                await fonction.clickElement(pageReferentielDetailQuestion.listBoxObjet);
                await fonction.clickAndWait(menu.listeBoxDropdowItem.filter({hasText:sObjet}), page);
            })

            test ('InputField [NOM QUESTIONNAIRE] = "' + sNomQuestionnaire + '"', async () =>  {
                await fonction.sendKeys(pageReferentielDetailQuestion.inputFieldNomQuestionnaire, sNomQuestionnaire, false, 'Nom Questionnaire');           
            })

            var sDescripQuestion:string = 'Creer Questionnaire de test Automatique';
            test ('InputField [DESCRIPTION QUESTIONNAIRE] = "' + sDescripQuestion + '"', async () =>  {
                await fonction.sendKeys(pageReferentielDetailQuestion.textAreaDescription, sDescripQuestion, false, 'Description Questionnaire');           
            })

            var sNomPopin:string = 'Création d\'un critère';
            test.describe ('Popin ' + sNomPopin.toUpperCase() + ']', async () => {

                test ('Button [AJOUTER CRITERE] - Click', async () => {
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

                test ('InputField  [CODE CRITERE] = "' + sCodecritere + '"', async () => {                   
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPAcInputCodeCritere, sCodecritere, false, 'Code Critere');
                })

                test ('InputField  [DESIGNATION CRITERE] = "' + sDesignationcritere + '"', async () => {                
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPAcInputDesignationCritere, sDesignationcritere, false, 'Designation Critere');    
                })

                test ('ListBox [TYPE CRITERE]= "' + sTypeCritere + '" - Select', async () => {
                    await fonction.ngClickListBox(pageReferentielDetailQuestion.pPAcListBoxType, sTypeCritere);
                })

                test ('InputField [ECHELLE DE VALEUR DE] = "1"', async () => {
                    await pageReferentielDetailQuestion.pPAcInputEchelleValeurs1.pressSequentially('1'); //Avec le sendkeys, le bouton Ajouter reste grisé;                     
                })

                test ('InputField [ECHELLE DE VALEUR A] = "5"', async () => {
                    await pageReferentielDetailQuestion.pPAcInputEchelleValeurs2.pressSequentially('5'); //Avec le sendkeys, le bouton Ajouter reste grisé;                     
                })
                
                test ('Button [AJOUTER ECHELLE]  - Click', async () => {
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcButtonAjouterEchelle);                         
                })

                test ('RadioButton [CRITERE]  - Click', async () => {
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcRadioButtonConforme.nth(0)); 
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcRadioButtonAcceptable.nth(1));
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcRadioButtonNonConforme.nth(2));
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcRadioButtonConforme.nth(3));
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcRadioButtonAcceptable.nth(4));
                })
                
                test ('CheckBox [CRITERE]  - Click', async () => {
                    await fonction.clickElement(pageReferentielDetailQuestion.pPcheckboxCommentObligatoire.nth(0)); 
                    await fonction.clickElement(pageReferentielDetailQuestion.pPcheckboxCommentObligatoire.nth(1));
                    await fonction.clickElement(pageReferentielDetailQuestion.pPcheckboxCommentObligatoire.nth(4));
                    await fonction.clickElement(pageReferentielDetailQuestion.pPcheckboxEliminatoire.nth(2));
                })
                
                test ('Button [VALIDER] - Click', async () => {
                    await fonction.clickAndWait(pageReferentielDetailQuestion.pPAcButtonValider, page);          
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page,sNomPopin.toUpperCase(), false);
                })
            }) 

            test.describe ('Vérification Enregistement', async () => {

                test ('Label [GROUPE RUBRIQUE] = "'+sGroupeRubrique+'" - Check', async () => {
                    expect(await pageReferentielDetailQuestion.datagridGroupeRubrique.textContent()).toContain(sGroupeRubrique);
                })
    
                test ('Label [RUBRIQUE] = "'+sRubrique+'"- Check', async () => {
                    expect(await pageReferentielDetailQuestion.datagridRubrique.textContent()).toContain(sRubrique);
                })
    
                test ('Label [CODE CRITERE] = "'+sCodecritere+'" - Check', async () => {
                    expect(await pageReferentielDetailQuestion.datagridCodecritere.textContent()).toContain(sCodecritere);
                })

                test ('Label [DESIGNATION CRITERE] ="'+sDesignationcritere+'" - Check', async () => {
                    expect(await pageReferentielDetailQuestion.datagridDesignationcritere.textContent()).toContain(sDesignationcritere);
                })

                test ('Label [TYPE CRITERE] ="'+sTypeCritere+'" - Check', async () => {
                    expect(await pageReferentielDetailQuestion.datagridTypeCritere.textContent()).toContain(sTypeCritere);
                })

                var sValeurPossible = '1, 2, 3, 4, 5';
                test ('Label [VALEURS POSSIBLES] ="'+sValeurPossible+'" - Check', async () => {
                    expect(await pageReferentielDetailQuestion.datagridValeurPossible.textContent()).toContain(sValeurPossible);
                })
            })  
            
            test ('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageReferentielDetailQuestion.buttonEnregistrer, page);          
            }) 
        })
    })

    test ('Déconnexion', async () =>  {
        await fonction.deconnexion(page);
    })

})