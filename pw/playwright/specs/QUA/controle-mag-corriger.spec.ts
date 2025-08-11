/**
 * 
 * @author SIAKA KONE
 * @since 2024-11-25
 * 
 */

const xRefTest      = "QUA_MAG_COR";
const xDescription  = "Corriger un Contrôle Magasin";
const xIdTest       =  9739;
const xVersion      = '3.1';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'QUALITE',
	version     : xVersion,
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['statut','questionnaire','lieuDeVente','typeDeControle'],
	fileName    : __filename
};

import {  test,  type Page }                from '@playwright/test';

import { CartoucheInfo }                    from '@commun/types';

import { Help }                  			from '@helpers/helpers';
import { TestFunctions }         			from '@helpers/functions';
import { Log }                   			from '@helpers/log';

import { MenuQualite }           			from '@pom/QUA/menu.page';
import { ControlesMagasins }                from '@pom/QUA/controles-magasins.page';

import * as path from 'path';

let page                					: Page;
let menu                					: MenuQualite;
let pageControlesMagasins                   : ControlesMagasins;

const log               					= new Log();
const fonction          					= new TestFunctions(log);

const sJddFile                              = fonction.getLocalConfig('jddControleMagasin');
const aImages                               = fonction.getLocalConfig('aImages');
const sFille                                = path.join(__dirname + '../' + aImages[1]);

const data                                  = fonction.readFile(sJddFile);

const sStatut                               = fonction.getInitParam('statut', data.sStatut);
const sQuestionnaire                        = fonction.getInitParam('questionnaire',data.sQuestionnaire);
const sLieudeVente                          = fonction.getInitParam('lieuDeVente',data.sLieudeVente);
const sTypedeControle                       = fonction.getInitParam('typeDeControle',data.sTypedeControle);

//-----------------------------------------------------------------------------------------------------

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

//-----------------------------------------------------------------------------------------------------

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
        
		test.describe ('Onglet[MAGASINS]', async () =>  {

            var sNomOnglet:string = 'magasins';
            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () =>  {
				await menu.clickOnglet(sNomPage, sNomOnglet, page);
			})

            test ('ListBox [LIEU DE VENTE] = "'+ sLieudeVente + '"', async () =>  {
                await menu.selectLieuDeVenteByName(sLieudeVente, page);
            })

            test ('ListBox [TYPE DE CONTROLE] = "'+ sTypedeControle +'"', async () =>  {
                await menu.selectTypeDeControleByName(sTypedeControle, page);
            })

            test ('ListBox [QUESTIONNAIRE] = "'+ sQuestionnaire +'"', async () =>  {
                await menu.selectQuestionnaireByName(sQuestionnaire, page);
            })

            test ('Button [RECHERCHER] - Click', async () =>  {
                await fonction.clickAndWait(pageControlesMagasins.buttonRechercher, page);
            })

            test ('InputField [QUESTIONNAIRE]  = "'+ sQuestionnaire + '"', async () =>  { 
                await fonction.sendKeys(pageControlesMagasins.datagridInputQuestionnaire, sQuestionnaire, false, 'Questionnaire');
            })

            test ('ListBox [STATUT] - Select = "' + sStatut +'"', async () =>  { 
                await fonction.clickElement(pageControlesMagasins.datagridListboxStatut);
                await fonction.clickAndWait(menu.listeBoxDropdowItem.filter({hasText:sStatut}), page);
            })

            test ('CheckBox [ARRIVAGE][0] - Click', async () =>  {      // On coche l'arrivage précédent qui a le statut En cours 
                await fonction.clickElement(pageControlesMagasins.checkBoxControlesMagasin.nth(0));
            })
                 
            var sNomPopin:string = 'Contrôle en cours';
            test.describe('Popin ['+ sNomPopin.toUpperCase() +']', async () => {

                test ('Button [CORRIGER LE CONTROLE] - Click', async () => {
                    await fonction.clickAndWait(pageControlesMagasins.buttonCorrigerControle, page);
                }) 

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page,sNomPopin.toUpperCase(), true);
                })

                test ('Button [ALERTE] - Click', async () =>{
                    await fonction.clickElement(pageControlesMagasins.pPCecButtonConformeRubrique.nth(7));
                })

                test ('Button [PARCOURIR] - click', async () =>{
                    await pageControlesMagasins.pPCecButtonLoad.nth(2).setInputFiles(sFille);
                })
                test('ListBox [CONTROLEUR]- click',async ()=>{
                    await fonction.clickAndWait(pageControlesMagasins.pDropdown,page)
                    await fonction.clickElement(pageControlesMagasins.pDropdownElement)
                })

                var sNomOnglet1:string = ' Bilan du contrôle ';
                test.describe('Onglet ['+ sNomOnglet1.toUpperCase() +']', async () =>{

                    test ('Onglet ['+ sNomOnglet1.toUpperCase() +'] - Click', async () => {
                        await fonction.clickElement(pageControlesMagasins.pPCocongletgroupeBilanControle);
                    })

                    test ('TextArea [COMMENTAIRE GENERAL]', async () => {
                        await fonction.sendKeys(pageControlesMagasins.pPCecTextareaCommentaire, 'Corriger un controle Magasin', false, 'Commentaire');
                    })

                    test ('Button [CORRIGER LE CONTROLE] - Click', async () => {
                        await fonction.clickAndWait(pageControlesMagasins.pPCocButtonCorrigerControle, page);
                    })

                    test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                        await fonction.popinVisible(page,sNomPopin.toUpperCase(), false);
                    })
                })  
            })

        })
    })

    test ('Déconnexion', async () =>  {
        await fonction.deconnexion(page);
    })

})