/**
 * 
 * @author SIAKA KONE
 * @since 2024-12-26
 * 
 */

const xRefTest      = "QUA_TMP_RCT";
const xDescription  = "Reprendre un contrôle Température";
const xIdTest       =  6633;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'QUALITE',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['lieuDeVente','statut','periode'],
    fileName    : __filename
};

import { test,  type Page }                 from '@playwright/test';
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

const sLieuDeVente                          = fonction.getInitParam('lieuDeVente', data.sLieuDeVente);
const sStatut                               = fonction.getInitParam('statut','En cours');
const sPeriode                              = fonction.getInitParam('periode',data.sPeriode);
const sTemperature                          = fonction.getInitParam('temperature', data.sTemperature); 

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

test.describe.serial ('[' + xRefTest + ']', () => {

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
            
            test ('CheckBox [TEMPERATURES][0] - Click', async () => {
                await fonction.clickElement(pageControlesTemperatures.checkBoxControleTemperature);
            })
                  
            //--POPIN CONTROLE EN COURS -------------------------------------------
            var sNomPopin:string = "CONTROLE EN COURS";
            test.describe('Popin ['+sNomPopin+']', async () =>  { 

                test ('Button [REPRENDRE CONTROLE] - Click', async () => {
                    await fonction.clickAndWait(pageControlesTemperatures.buttonReprendreControle, page);
                }) 
                
                test ('Popin ['+sNomPopin+'] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test ('InputField [ELEMENT 20] = "'+sTemperature+'"', async () =>  {
                    await fonction.sendKeys(pageControlesTemperatures.pPCecInputControlDegre.nth(20), sTemperature, false, 'Temperature');
                })

                test ('Button [TERMINER] - Click', async () => {
                    await fonction.clickAndWait(pageControlesTemperatures.pPCecButtonTerminer, page);
                })

                test ('Popin ['+sNomPopin+'] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })
                
            })
           
        })
    })

    test ('Déconnexion', async () =>  {
        await fonction.deconnexion(page);
    })

})