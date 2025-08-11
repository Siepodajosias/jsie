/**
 * 
 * @author SIAKA KONE
 * @since 2024-12-24
 * 
 */

const xRefTest      = "QUA_TMP_COR";
const xDescription  = "Corriger un contrôle Température";
const xIdTest       =  7276;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'QUALITE',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['lieuDeVente','statut','periode','temperature'],
    fileName    : __filename
};

import {  test,  type Page }                from '@playwright/test';
import { CartoucheInfo }                    from '@commun/types';

import { Help }                  			from '@helpers/helpers';
import { TestFunctions }         			from '@helpers/functions';
import { Log }                   			from '@helpers/log';

import { MenuQualite }           			from '@pom/QUA/menu.page';
import { ControlesTemperatures }            from '@pom/QUA/controle-temperature.page';

let page                					: Page;
let menu                					: MenuQualite;
let pageControlesTemperatures               : ControlesTemperatures;

const log               					= new Log();
const fonction          					= new TestFunctions(log);

const sJddFile                              = fonction.getLocalConfig('jddControleTemperature');
const data                                  = fonction.readFile(sJddFile);

const sLieuDeVente                          = fonction.getInitParam('lieuDeVente',data.sLieuDeVente);
const sStatut                               = fonction.getInitParam('statut', data.sStatut);
const sPeriode                              = fonction.getInitParam('periode', data.sPeriode);
const sTemperature                          = fonction.getInitParam('temperature','4'); 

test.beforeAll(async ({ browser }, testInfo) => {
    page            						= await browser.newPage();
    menu            						= new MenuQualite(page, fonction);
    pageControlesTemperatures               = new ControlesTemperatures(page);
    const helper    						= new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

test.describe.serial ('[' + xRefTest + ']', () =>   {

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
        
        var sNomOnglet:string = 'temperatures';
        test.describe ('Onglet[' + sNomOnglet.toUpperCase() + ']', async () =>  {

            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () =>  {
                await menu.clickOnglet(sNomPage, sNomOnglet, page);
            })

            test ('ListBox [LIEU DE VENTE] = "'+sLieuDeVente+'"', async () =>  {         
                await pageControlesTemperatures.selectLieuDeVenteByName(sLieuDeVente);
            })
            
            test ('ListBox [MATIN/APRES-MIDI] ="'+sPeriode+'"', async () =>  {            
                await fonction.clickElement(pageControlesTemperatures.datagridListBoxPeriodeJournee);
                await fonction.clickElement(menu.listeBoxDropdowItem.filter({hasText:sPeriode}));
            })

            test ('ListBox [STATUT] = "' + sStatut + '"', async () =>  {           
                await fonction.clickElement(pageControlesTemperatures.datagridListBoxStatut);
                await fonction.clickAndWait(menu.listeBoxDropdowItem.filter({hasText:sStatut}), page);
            })
            
            test ('CheckBox [TEMPERATURES][0] - Click', async () =>  {
                await fonction.clickElement(pageControlesTemperatures.checkBoxControleTemperature);
            })
                  
            test ('Button [CORRIGER CONTROLE] - Click', async () =>  {
                await fonction.clickAndWait(pageControlesTemperatures.buttonCorrigerControle, page);
            }) 
            
            test ('InputField [CONTROLEUR]', async () =>  {
                await fonction.sendKeys(pageControlesTemperatures.pPCecInputControleur, 'Contrôleur correcteur', false, 'Controleur');
            })

            test ('InputField [ELEMENT] = "' + sTemperature + '"', async () =>  {
                for(let index = 0;index<2;index++){
                    await fonction.sendKeys(pageControlesTemperatures.pPCecInputControlDegre.nth(index), sTemperature, false, 'Temperature');
                }                    
            })
        
            test ('Button [CONFIRMER] - Click', async () =>  {
                await fonction.clickAndWait(pageControlesTemperatures.pPCecButtonCorrigerControle, page);
            })
           
        })
    })

    test ('Déconnexion', async () =>  {
        await fonction.deconnexion(page);
    })

})