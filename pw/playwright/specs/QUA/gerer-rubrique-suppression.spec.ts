/**
 * 
 * @author SIAKA KONE
 * @since 2024-11-27
 * 
 */

const xRefTest      = "QUA_QUE_SRU";
const xDescription  = "Gérer les rubriques - Suppression";
const xIdTest       =  5186;
const xVersion      = '3.0';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'QUALITE',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['rayon','objet'],
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

const sJddFile                             = fonction.getLocalConfig('jddRubrique');
const data                                 = fonction.readFile(sJddFile);

// Exploitation des paramètres passés en argument OU ceux présents dans le fichier de configuration Local
var sRayon                                 = fonction.getInitParam('rayon', data.sRayon);  
var sObjet                                 = fonction.getInitParam('objet', data.sObjet);

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

test.describe.serial ('[' + xRefTest + ']', async () =>  {

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

		test.describe ('Onglet [QUESTIONNAIRE]', async () =>  {

            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage, sNomOnglet, page);
			})

            var sNomPopin:string = 'Gérer les rubriques';
            
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test ('Button [GERER RUBRIQUE]- Click', async () => {  
                    await fonction.clickAndWait(pageReferentielQuestionnaires.buttonGererRubrique, page);
                }) 

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page,sNomPopin.toUpperCase(), true);
                })

                test ('ListBox [RAYON]= "' + sRayon + '" - Select', async () => {
                    await fonction.clickElement(pageReferentielQuestionnaires.pPGrListBoxRayon);
                    await fonction.clickElement(pageReferentielQuestionnaires.pPGrListRayon.filter({hasText:sRayon}));
                })

                test ('ListBox [OBJET]= "' + sObjet + '" - Select', async () => {
                    await fonction.ngClickListBox(pageReferentielQuestionnaires.pPGrListBoxObjet, sObjet);
                })

                test ('Icon [DEPLIER RUBRIQUE] - Click', async () => {
                    await fonction.clickElement(pageReferentielQuestionnaires.pPGrIconDeplierRubrique.last());
                })

                test ('Button [SUPPRIMER SOUS RUBRIQUE] - Click', async  () => {
                    await fonction.clickElement(pageReferentielQuestionnaires.pPGrButtonSupprimerRubrique.last());
                })

                test ('Button [SUPPRIMER RUBRIQUE] - Click',  async () => {
                    await fonction.clickElement(pageReferentielQuestionnaires.pPGrButtonSupprimerRubrique.last());
                })
    
                test ('Button [ENREGISTRER RUBRIQUE] - Click',  async () => {
                    await fonction.clickAndWait(pageReferentielQuestionnaires.pPGrButtonEnregistrer, page);          
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