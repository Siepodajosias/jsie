/**
 * 
 * @author SIAKA KONE
 * @since 2024-12-04
 * 
 */

const xRefTest      = "QUA_DET_CAN";
const xDescription  = "Ajouter un critère de type Conforme / Acceptable / Non conforme";
const xIdTest       =  6656;
const xVersion      = '3.1';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'QUALITE',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['nomQuestionnaire','groupeRubrique','rubrique','rayon','objet'],
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

// Exploitation des paramètres passés en argument OU ceux présents dans le fichier de configuration Local
const sJddFile                             = fonction.getLocalConfig('jddReferentielQuestionnaire');
const data                                 = fonction.readFile(sJddFile);

const sNomQuestionnaire                   = fonction.getInitParam('nomQuestionnaire', 'TA_QuestionnaireArrivage_'+ fonction.getToday());
const sGroupeRubrique                     = fonction.getInitParam('groupeRubrique','Détail'); 
const sRubrique                           = fonction.getInitParam('rubrique', 'Citron'); 
const sRayon                              = fonction.getInitParam('rayon', 'Fruits et légumes');  
const sObjet                              = fonction.getInitParam('objet', data.objet);

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
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>  {

                var sDesignationcritere:string= 'critère Conforme / Acceptable / Non conforme';
                var sCodecritere:string       = 'CRI0257';
                var sTypeCritere:string       = 'Conforme / Acceptable / Non conforme';

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

                test ('InputField  [CODE CRITERE] = "' + sCodecritere + '"', async () =>  {                   
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPAcInputCodeCritere, sCodecritere, false, 'Code Critere');
                })

                test ('InputField  [DESIGNATION CRITERE] = "' + sDesignationcritere + '"', async () =>  {                   
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPAcInputDesignationCritere, sDesignationcritere, false, 'Designation Critere');     
                })

                test ('ListBox [TYPE CRITERE]= "' + sTypeCritere + '" - Select', async () =>  {
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcListBoxType);
                    await fonction.clickAndWait(menu.listeBoxDropdowItem.filter({hasText:sTypeCritere}), page);
                })
                
                test ('Button [VALIDER] - Click', async () =>  {
                    await fonction.clickAndWait(pageReferentielDetailQuestion.pPAcButtonValider, page);          
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page,sNomPopin.toUpperCase(), false);
                })
            }) 

            test.describe ('Popin ' + sNomPopin.toUpperCase() + '] #1', async () => {

                var sTypeCritere:string        = 'Echelle';
                var sCodecritere:string        ='CRI0287'; 
                var sDesignationcritere:string = 'type Echelle';

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
                
                test ('checkBox [CRITERE]  - Click', async () => {
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
            
            test.describe ('Popin [' + sNomPopin.toUpperCase() + '] #2', async () => {

                var sTypeCritere:string = 'Intervalle';
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

                test ('InputField  [CODE CRITERE] = "CRI0245"', async () => {                   
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPAcInputCodeCritere,'CRI0245', false, 'Code Critere');
                })

                test ('InputField  [DESIGNATION CRITERE] - Click', async () => {                   
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPAcInputDesignationCritere,'critère liste valeurs');     
                })

                test ('ListBox [TYPE CRITERE]= "' + sTypeCritere + '" - Select', async () => {
                    await fonction.ngClickListBox(pageReferentielDetailQuestion.pPAcListBoxType, sTypeCritere);
                })

                var sValInf:string = 'Inférieur';
                test ('ListBox [INTERVALLE DES VALEURS INF]= "' + sValInf + '" - Select', async () => {
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcListBoxChoixIntervalleInf.nth(0));
                    await fonction.clickAndWait(menu.listeBoxDropdowItem.filter({hasText:sValInf}).first(), page);
                })    

                test ('InputField  [ INTERVALLE] = "3"', async () => {                   
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPAcInputIntervallegauche,'3', false,'Valeur Intervalle');
                })

                var sValSup:string = 'Supérieur';
                test ('ListBox [INTERVALLE DES VALEURS SUP]= "' + sValSup + '" - Select', async () => {
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcListBoxChoixIntervalleSup.nth(0));
                    await fonction.clickAndWait(menu.listeBoxDropdowItem.filter({hasText:sValSup}).first(), page);
                })

                test ('InputField  [ INTERVALLE] = "1"', async () => {                   
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPAcInputIntervalledroite,'1');
                })

                test ('Button  [ AJOUTER INTERVALLE] - Click', async () => {                   
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcButtonAjouterIntervalle);
                })
                
                    
                test ('RadioButton [CRITERE]  - Click', async () => {    
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcRadioButtonConforme.nth(0)); 
                })
                
                test ('checkBox [CRITERE]  - Click', async () => {
                    await fonction.clickElement(pageReferentielDetailQuestion.pPcheckboxCommentObligatoire.nth(0)); 
                })
                
                test ('Button [VALIDER] - Click', async () => {
                    await fonction.clickAndWait(pageReferentielDetailQuestion.pPAcButtonValider, page);          
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page,sNomPopin.toUpperCase(), false);
                })
            })
           
            test.describe ('Popin [' + sNomPopin.toUpperCase() + '] #3', async () => {

                var sTypeCritere:string = 'Liste des valeurs';
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

                test ('InputField  [CODE CRITERE] = "CRI0249LS"', async () => {                   
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPAcInputCodeCritere,'CRI0249LS', false, 'Code Critere'); //CRI0245
                })

                test ('InputField  [DESIGNATION CRITERE]', async () => {                   
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPAcInputDesignationCritere,'critère liste valeursssS', false, 'Designation Critere');    
                })

                test ('ListBox [TYPE CRITERE]= "' + sTypeCritere + '" - Select', async () => {
                    await fonction.ngClickListBox(pageReferentielDetailQuestion.pPAcListBoxType, sTypeCritere);
                })

                test ('InputField [AJOUTER VALEUR ] = "1"', async () => {
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPAcInputajouterValeurs,'1', false,'Valeur Ajoutee');
                })
                
                test ('Button [AJOUTER VALEUR ]  - Click', async () => {
                    await fonction.clickAndWait(pageReferentielDetailQuestion.pPAcButtonAjouterValeur, page);
                })

                test ('RadioButton [CRITERE]  - Click', async () => {
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcRadioButtonConforme.nth(0)); 
                })
                
                test ('checkBox [CRITERE]  - Click', async () => {
                    await fonction.clickElement(pageReferentielDetailQuestion.pPcheckboxCommentObligatoire.nth(0)); 
                })
                
                test ('Button [VALIDER] - Click', async () => {
                    await fonction.clickAndWait(pageReferentielDetailQuestion.pPAcButtonValider, page);          
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page,sNomPopin.toUpperCase(), false);
                })
            })
           
            test.describe ('Popin [' + sNomPopin.toUpperCase() + '] #4', async () => {

                var sTypeCritere:string = 'Oui / Non';

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

                test ('InputField  [CODE CRITERE] = "CRI0245L"' , async () => {                   
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPAcInputCodeCritere,'CRI0245L', false, 'Code Critere');
                })

                test ('InputField  [DESIGNATION CRITERE]', async () => {                   
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPAcInputDesignationCritere,'critère Oui / Non T', false, 'Designation Critere');     
                })

                test ('ListBox [TYPE CRITERE]= "' + sTypeCritere + '" - Select', async () => {
                    await fonction.ngClickListBox(pageReferentielDetailQuestion.pPAcListBoxType, sTypeCritere);
                })
            
                test ('RadioButton [CRITERE]  - Click', async () => {
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcRadioButtonConforme.nth(0)); 
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcRadioButtonNonConforme.nth(1));
                })
               
                test ('checkBox [CRITERE][FIRST]  - Click', async () => {
                    await fonction.clickElement(pageReferentielDetailQuestion.pPcheckboxCommentObligatoire.nth(0)); 
                })
                
                test ('Button [VALIDER] - Click', async () => {
                    await fonction.clickAndWait(pageReferentielDetailQuestion.pPAcButtonValider, page);          
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page,sNomPopin.toUpperCase(), false);
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