/**
 * 
 * @author SIAKA KONE
 * @since 2024-12-26
 * 
 */

const xRefTest      = "QUA_TMP_DCT";
const xDescription  = "Demarer un contrôle Température";
const xIdTest       =  6630;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'QUALITE',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['lieuDeVente','statut','periode','equipe','controleur','temperature'],
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
const sStatut                               = fonction.getInitParam('statut','A faire');
const sPeriode                              = fonction.getInitParam('periode',data.sPeriode);// 
const sEquipe                               = fonction.getInitParam('equipe','Grand Frais Crèmerie');
const sControleur                           = fonction.getInitParam('controleur','ROLLAND Antoine');
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
            
            test ('Column [EQUIPE] = "' +sEquipe + '" - Click', async () =>  {  
                await fonction.clickElement(pageControlesTemperatures.dataGridDonneeTemperature.locator('tr td:nth-child(6)').filter({hasText:sEquipe}).last());
            })
                  
            //--POPIN CONTROLE EN COURS -------------------------------------------
            var sNomPopin:string = "CONTROLE EN COURS";
            test.describe('Popin ['+sNomPopin+']', async () =>  { 

                test ('Button [DEMARRER] - Click', async () =>  {
                    await fonction.clickAndWait(pageControlesTemperatures.buttonDemarrerControle, page);
                }) 

                test ('Popin ['+sNomPopin+'] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })
                
                test ('InputField [CONTROLEUR] = "' + sControleur + '"', async () =>  {
                    await fonction.sendKeys(pageControlesTemperatures.pPCecInputControleur, sControleur, false, 'Controleur');
                })
                
                var sNomOnglet:string = 'RAYON';
                test.describe('Onglet ['+sNomOnglet+']  >', async () =>  { 

                    test ('InputField [ELEMENT] = "' + sTemperature + '"', async () =>  {
                        for(let index = 0;index<20;index++){
                            await fonction.sendKeys(pageControlesTemperatures.pPCecInputControlDegre.nth(index), sTemperature, false, 'Temperature');
                        } 
                    })
                })

                var sNomOnglet:string = 'CHAMBRE FROIDE';
                test.describe('Onglet ['+sNomOnglet+']', async () =>  {

                    test ('Onglet ['+sNomOnglet+'] = "'+sTemperature+'"', async () =>  {
                        await fonction.clickElement(pageControlesTemperatures.pPCecOngletchambreFroide);
                    })

                    test ('InputField [ELEMENT 1] = "'+sTemperature+'"', async () =>  {
                        await fonction.sendKeys(pageControlesTemperatures.pPCecInputControlDegre.nth(21), sTemperature, false, 'Temperature');
                    })
                })

                test ('Button  [ENREGISTRER] - Click ', async () =>  {
                    await fonction.clickAndWait(pageControlesTemperatures.pPCecButtonEnregistrer, page);
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