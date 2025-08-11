/**
 * 
 * @author SIAKA KONE
 * @since 2024-11-29
 * 
 */

const xRefTest      = "QUA_QUE_CQU";
const xDescription  = "Créer un Questionnaire";
const xIdTest       =  4629;
const xVersion      = '3.0';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'QUALITE',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['nomQuestionnaire','descriptionQuestionnaire','designationcritere','rubrique','rayon','objet','codeCritere','typeControle','typeCritère','groupeRubrique'],
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

const sNomQuestionnaire                    = fonction.getInitParam('nomQuestionnaire', 'TA_Questionnaire_Mag_'+ fonction.getToday());
const sDescripQuestion                     = fonction.getInitParam('descriptionQuestionnaire', data.sDescripQuestion);
const sDesignationcritere                  = fonction.getInitParam('designationcritere','Procédure (P)'); 
const sRubrique                            = fonction.getInitParam('rubrique', data.sRubrique); 
const sRayon                               = fonction.getInitParam('rayon', data.sRayon);  
const sObjet                               = fonction.getInitParam('objet',data.sObjet); 
const sCodecritere                         = fonction.getInitParam('codeCritere','PRO0257'); 
const sTypeControle                        = fonction.getInitParam('typeControle','Audit quadri');
const sTypeCritere                         = fonction.getInitParam('typeCritere', 'Conforme / Acceptable / Non conforme');
const sGroupeRubrique                      = fonction.getInitParam('groupeRubrique','Procédure (P)');

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

            test ('ListBox [TYPE DE CONTROLE] = "' + sTypeControle + '" - Select', async () =>  {
                await fonction.clickElement(pageReferentielDetailQuestion.listTypeControle);
                await fonction.sendKeys(menu.inputMultiple,sTypeControle, false, 'Type Controle');
                await fonction.clickAndWait(pageReferentielDetailQuestion.listBoxMultiSelect, page);
                await fonction.clickElement(pageReferentielDetailQuestion.listTypeControle);
            })

            test ('InputField [DESCRIPTION QUESTIONNAIRE] = "' + sDescripQuestion + '"', async () =>  {
                await fonction.sendKeys(pageReferentielDetailQuestion.textAreaDescription, sDescripQuestion, false, 'Description Questionnaire');           
            })

            var sNomPopin:string = 'Création d\'un critère';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + '] = "' + sRubrique + '" - Click', async () =>  {

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

            var sRubChambreFroide:string = 'Chambre Froide';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + '] = "' + sRubChambreFroide + '" - Click', async () =>  {

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

                test ('ListBox [RUBRIQUES]= "' + sRubrique + '" - Select', async () =>  {
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcListBoxRubriques);
                    await fonction.clickAndWait(menu.listeBoxDropdowItem.filter({hasText:sRubChambreFroide}), page);
                })

                test ('InputField  [CODE CRITERE] = "CHA5684"', async () =>  {                   
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPAcInputCodeCritere, 'CHA5684', false, 'Code Critere');
                })

                test ('InputField  [DESIGNATION CRITERE] = "' + sRubChambreFroide + '"', async () =>  {                   
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPAcInputDesignationCritere, sRubChambreFroide, false, 'Designation Critere');     
                })

                test ('ListBox [TYPE CRITERE]= "' + sTypeCritere + '" - Select', async () =>  {
                    await fonction.ngClickListBox(pageReferentielDetailQuestion.pPAcListBoxType, sTypeCritere);
                })
                
                test ('Button [VALIDER] - Click', async () =>  {
                    await fonction.clickAndWait(pageReferentielDetailQuestion.pPAcButtonValider, page);          
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page,sNomPopin.toUpperCase(), false);
                })
            }) 

            var sRubAlerte:string = 'Alerte';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']  = "' + sRubAlerte + '" - Click', async () =>  {

                test ('Button [AJOUTER CRITERE] - Click', async () =>  {
                    await fonction.clickAndWait(pageReferentielDetailQuestion.buttonAjouterCritere, page);          
                })
                
                test ('Popin [' + sNomPopin.toUpperCase() + '] #2 - Is Visible', async () => {
                    await fonction.popinVisible(page,sNomPopin.toUpperCase(), true);
                })

                test ('ListBox [GROUPE RUBRIQUES] = "' + sGroupeRubrique + '" - Select', async () =>  {
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcListBoxGroupeRubriques);
                    await fonction.clickAndWait(menu.listeBoxDropdowItem.filter({hasText:sGroupeRubrique}), page);
                })

                test ('ListBox [RUBRIQUES]= "' + sRubrique + '" - Select', async () =>  {
                    await fonction.clickElement(pageReferentielDetailQuestion.pPAcListBoxRubriques);
                    await fonction.clickAndWait(menu.listeBoxDropdowItem.filter({hasText:sRubAlerte}), page);
                })

                test ('InputField  [CODE CRITERE] = "ALER5684"', async () =>  {                   
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPAcInputCodeCritere, 'ALER5684', false, 'Code Critere');
                })

                test ('InputField  [DESIGNATION CRITERE] = "' + sRubAlerte + '"', async () =>  {                   
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPAcInputDesignationCritere, sRubAlerte, false, 'Designation Critere' );     
                })

                test ('ListBox [TYPE CRITERE]= "' + sTypeCritere + '" - Select', async () =>  {
                    await fonction.ngClickListBox(pageReferentielDetailQuestion.pPAcListBoxType, sTypeCritere);
                })
                
                test ('Button [VALIDER] - Click', async () =>  {
                    await fonction.clickAndWait(pageReferentielDetailQuestion.pPAcButtonValider, page);          
                })

                test ('Button [ENREGISTRER] - Click', async () =>  {
                    await fonction.clickAndWait(pageReferentielDetailQuestion.buttonEnregistrer, page);          
                })
                
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