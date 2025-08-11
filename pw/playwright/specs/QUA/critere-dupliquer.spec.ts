/**
 * 
 * @author SIAKA KONE
 * @since 2024-12-09
 * 
 */

const xRefTest      = "QUA_DET_ACQ";
const xDescription  = "Dupliquer le Critère d'un Questionnaire";
const xIdTest       =  7299;
const xVersion      = '3.5';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'QUALITE',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['nomQuestionnaire','designationCritere','rubrique','rayon','objet','codeCritere','typeCritere','groupeRubrique'],
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

let page                            : Page;
let menu                            : MenuQualite;
let pageReferentielQuestionnaires   : ReferentielQuestionnaires;
let pageReferentielDetailQuestion   : ReferentielDetailQuestion;

const log                           = new Log();
const fonction                      = new TestFunctions(log);

// Exploitation des paramètres passés en argument OU ceux présents dans le fichier de configuration Local
const sJddFile                      = fonction.getLocalConfig('jddReferentielQuestionnaire');
const data                          = fonction.readFile(sJddFile);

const sNomQuestionnaire             = fonction.getInitParam('nomQuestionnaire', 'TA_Questionnaire_Duplique_'+fonction.getToday());
const sDesignationcritere           = fonction.getInitParam('designationcritere','Procédure (P) '+ fonction.getToday()); 
const sRubrique                     = fonction.getInitParam('rubrique', 'Chambre Froide'); // data.sRubrique
const sRayon                        = fonction.getInitParam('rayon', data.sRayon);  
const sObjet                        = fonction.getInitParam('objet', data.sObjet);//data.objet
const sCodecritere                  = fonction.getInitParam('codeCritere','PRO0257_'+ fonction.getToday()); 
const sTypeCritere                  = fonction.getInitParam('typeCritere', 'Conforme / Acceptable / Non conforme');//Liste des valeurs
const sGroupeRubrique               = fonction.getInitParam('groupeRubrique','Procédure (P)'); // //Détail

//------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                            = await browser.newPage();
    menu                            = new MenuQualite(page, fonction);
    pageReferentielQuestionnaires   = new ReferentielQuestionnaires(page);
    pageReferentielDetailQuestion   = new ReferentielDetailQuestion(page);
    const helper                    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------------

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

        test ('ListBox [RAYON]= "' + sRayon + '" - Select', async () => {
            await fonction.clickElement(pageReferentielQuestionnaires.listBoxRayon);
            await fonction.clickAndWait(menu.listeBoxDropdowItem.filter({hasText:sRayon}), page);
        })

        test ('Button [RECHERCHER] - Click', async () => {
            await fonction.clickAndWait(pageReferentielQuestionnaires.buttonRechercherQuestionnaire, page);
        })

        test ('ListBox [OBJET] = "' + sObjet + '" - Select', async () => {
            await fonction.clickElement(pageReferentielQuestionnaires.datagridlistBoxObjet);
            await fonction.clickAndWait(menu.listeBoxDropdowItem.filter({hasText:sObjet}), page);
        })

        test ('InputField [NOM QUESTIONNAIRE] = "' + sNomQuestionnaire + '"', async () =>  {
            await fonction.sendKeys(pageReferentielQuestionnaires.datagridinputnomquestionnaire, sNomQuestionnaire, false, 'Nom Questionnaire');  
            await fonction.wait(page, 500); //Attendre que le filtre soit effectif;         
        })

        test ('CheckBox [LISTE QUESTIONNAIRE][1]- Click', async () => {
            await fonction.clickElement(pageReferentielQuestionnaires.checkboxCocherQuestionnaire.nth(0));          
        })
        
        var sNomOnglet:string = 'Détail d\'un questionnaire';

		test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', async () =>  {

            test ('Button [MODIFIER QUESTIONNAIRE ] - Click', async () =>  {           
                await fonction.clickAndWait(pageReferentielQuestionnaires.buttonModifier, page);         
            })
            
            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Is Visible', async () =>  { //-- Selectionné par défaut;
                await menu.isOngletPresent(sNomOnglet);
            })

            test ('CheckBox [LISTE CRITERE][0] - Click', async () => {
                await fonction.clickElement(pageReferentielDetailQuestion.checkboxCocherCritere);           
            })

            var sNomPopin:string = 'Duplication d\'un critère';
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test ('Button [DUPLIQUER CRITERE] - Click', async () => {
                    await fonction.clickAndWait(pageReferentielDetailQuestion.buttonDupliquerCritere, page);
                }) 

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page,sNomPopin.toUpperCase(), true);
                })

                test ('InputField [CODE CRITERE] = "' + sCodecritere + '"', async () => {
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPDcInputCode, sCodecritere, false, 'Code Critere');          
                    log.set('Code Critère : ' + sCodecritere); 
                })

                test ('InputField [DESIGNATION CRITERE] = "' + sDesignationcritere + '"', async () => {
                    await fonction.sendKeys(pageReferentielDetailQuestion.pPDcInputDesignation, sDesignationcritere, false, 'Designation Critere');
                    log.set('Designation Critère : ' + sDesignationcritere);
                }) 

                test ('Button [DUPLIQUER] - Click', async () => {           
                    await fonction.clickAndWait(pageReferentielDetailQuestion.pPDcButtonDupliquer, page);           
                }) 
                
                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page,sNomPopin.toUpperCase(), false);
                })
            })

            test.describe ('Vérification Enregistement', async () => {

                test ('Datagridinput [CODE CRITERE] = "'+ sCodecritere + '"', async () => {                   
                    await fonction.sendKeys(pageReferentielDetailQuestion.datagridFiltreCodecritere, sCodecritere.slice(-21,-3), false, 'Code Critere'); //sCodecritere.slice(0,7)
                    await fonction.wait(page, 250);
                })

                test ('Label [GROUPE RUBRIQUE] = "' + sGroupeRubrique + '" - Check', async () => {
                    expect(await pageReferentielDetailQuestion.datagridGroupeRubrique.first().textContent()).toContain(sGroupeRubrique);
                })
    
                test ('Label [RUBRIQUE] = "' + sRubrique + '" - Check', async () => {
                    expect(await pageReferentielDetailQuestion.datagridRubrique.first().textContent()).toContain(sRubrique);
                })
    
                test ('Label [CODE CRITERE] = "' + sCodecritere + '" - Check', async () => {
                    await fonction.waitTillHTMLRendered(page)                      // Attend que la page soit complètement chargée
                    expect(await pageReferentielDetailQuestion.datagridCodecritere.first().textContent()).toContain(sCodecritere);                    
                })

                test ('Label [DESIGNATION CRITERE] = "' + sDesignationcritere + '" - Check', async () => {
                    expect(await pageReferentielDetailQuestion.datagridDesignationcritere.first().textContent()).toContain(sDesignationcritere);
                })

                test ('Label [TYPE CRITERE] = "' + sTypeCritere + '" - Check', async () => {
                    expect(await pageReferentielDetailQuestion.datagridTypeCritere.first().textContent()).toContain(sTypeCritere);
                })

                const sValeurPossible:string = 'Conforme, Acceptable, Non conforme';
                test ('Label [VALEURS POSSIBLES] = "' + sValeurPossible + '" - Check', async () => {
                    expect(await pageReferentielDetailQuestion.datagridValeurPossible.first().textContent()).toContain(sValeurPossible);
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