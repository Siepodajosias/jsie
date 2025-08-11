/**
 * 
 * @author SIAKA KONE
 * @since 2024-11-14
 * 
 */

const xRefTest      = "QUA_MAG_DCT";
const xDescription  = "Démarrer un contrôle Magasin";
const xIdTest       =  9740;
const xVersion      = '3.1';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'QUALITE',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['lieuDeVente','controleur','typeDeControle','questionnaire'],
	fileName    : __filename
};

import {  test, type Page }                 from '@playwright/test';

import { CartoucheInfo }                    from '@commun/types';

import { Help }                  			from '@helpers/helpers';
import { TestFunctions }         			from '@helpers/functions';
import { Log }                   			from '@helpers/log';

import { MenuQualite }           			from '@pom/QUA/menu.page';
import { ControlesMagasins }                from '@pom/QUA/controles-magasins.page';

let page                					: Page;
let menu                					: MenuQualite;
let pageControlesMagasins                   : ControlesMagasins;

const log               					= new Log();
const fonction          					= new TestFunctions(log);

// Exploitation des paramètres passés en argument OU ceux présents dans le fichier de configuration Local
const sJddFile                             = fonction.getLocalConfig('jddControleMagasin');
const data                                 = fonction.readFile(sJddFile);

const sLieudeVente                         = fonction.getInitParam('lieuDeVente', data.sLieudeVente); 
const sControleur                          = fonction.getInitParam('controleur', data.sControleur);
const sTypedeControle                      = fonction.getInitParam('typeDeControle',data.sTypedeControle); 
const sQuestionnaire                       = fonction.getInitParam('questionnaire',data.sQuestionnaire); 

//-------------------------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            						= await browser.newPage();
    menu            						= new MenuQualite(page, fonction);
    pageControlesMagasins                   = new ControlesMagasins(page);
    const helper    						= new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//-------------------------------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () =>  {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () =>  {
        await fonction.connexion(page);
    })

    test.describe ('Page [CONTROLE]', async () => {

        var sNomPage:string = 'controles';

        test ('Menu [' + sNomPage.toUpperCase() + '] - Click', async () =>  {
			await menu.click(sNomPage, page);
		})
        
		test.describe ('Onglet [MAGASINS]', async () =>  {

            var sNomOnglet:string = 'magasins';
            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage, sNomOnglet, page);
			})

            var sNomPopin:string = 'Contrôle en cours';
            test.describe('Popin ['+ sNomPopin.toUpperCase() +']', async () => {

                test ('Button [CREER UN CONTROLE] - Click', async () => {
                    await fonction.clickAndWait(pageControlesMagasins.buttonCreerControle, page);
                }) 

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page,sNomPopin.toUpperCase(), true);
                })

                test ('ListBox [LIEU DE VENTE] = "'+ sLieudeVente + '"', async () => {           
                    await fonction.ngClickListBox(pageControlesMagasins.pPCecListboxLieudeVente, sLieudeVente);
                })

                test ('ListBox [TYPE DE CONTROLE] = "' + sTypedeControle + '"', async () => {            
                    await fonction.ngClickListBox(pageControlesMagasins.pPCecListboxTypedeControle, sTypedeControle);
                })

                test ('ListBox [QUESTIONNAIRE] = "' + sQuestionnaire + '"', async () => {        
                    await fonction.clickElement(pageControlesMagasins.pPCecListboxQuestionnaire);
                    await fonction.clickElement(pageControlesMagasins.listBoxDropDownItemQuestionnaire.filter({hasText:sQuestionnaire}).last());
                })

                test ('ListBox [CONTROLEUR] = "'+ sControleur + '"', async () => {         
                    await fonction.clickElement(pageControlesMagasins.pPCecListboxControleur);
                    await fonction.clickElement(menu.listeBoxDropdowItem.filter({hasText:sControleur}));
                })

                test ('Button [PERSONNES PRESENTES] - Click', async () => {
                    await fonction.clickElement(pageControlesMagasins.pPCecButtonPersPresenteRR);
                })

                test ('Button [ENREGISTRER] - Click', async () => {
                    test.setTimeout(90000);//Il arrive parfois que l'enregistrement prenne un plus de temps que le timeout par défaut;
                    await fonction.clickAndWait(pageControlesMagasins.pPCecButtonEnregister, page, 80000);
                })

                test ('Popin [' + sNomOnglet.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page,sNomOnglet.toUpperCase(), false);
                })
            })     

        })
    })

    test ('Déconnexion', async () =>  {
        await fonction.deconnexion(page);
    })

})