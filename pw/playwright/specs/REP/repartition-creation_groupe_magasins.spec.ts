/**
 * 
 * @desc Créer un groupe de magasin
 * 
 * @author SIAKA KONE
 * @since 2024-04-15
 * 
 */
const xRefTest      = "REP_REF_CGM";
const xDescription  = "Créer un groupe de magasin";
const xIdTest       =  457;
const xVersion      = '3.1.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'REP',
    version     : xVersion,    
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme','rayon','groupeArticle'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }              from '@playwright/test';
import { CartoucheInfo }                from '@commun/types';
import { TestFunctions }                from '@helpers/functions.js';
import { Help }                         from '@helpers/helpers.js';
import { Log }                          from '@helpers/log.js';

import { MenuRepartition }              from '@pom/REP/menu.page.js';
import {RefGroupesMagasinPage}          from '@pom/REP/referentiel-groupes_magasins.page';
//------------------------------------------------------------------------------------
let page                        : Page;
let menu                        : MenuRepartition;
let pageRefGrpeMagasin          : RefGroupesMagasinPage;
//------------------------------------------------------------------------------------
const log               = new Log();
const fonction          = new TestFunctions(log);
const maDate            = new Date();
//------------------------------------------------------------------------------------

const sPlateforme       = fonction.getInitParam('plateforme','Chaponnay');
const sRayon            = fonction.getInitParam('rayon','Fruits et légumes');
const sGroupeArticle    = fonction.getInitParam('groupeArticle', false); 
const aVillesCibles     = fonction.getLocalConfig('villesCibles');

const sNomGrpMag        = 'TEST-AUTO_GrpMag-' + fonction.getToday('FR') + '_' +  fonction.addZero(maDate.getHours());

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page                    = await browser.newPage();
    menu                    = new MenuRepartition(page, fonction);
    pageRefGrpeMagasin      = new RefGroupesMagasinPage(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']' , () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [REFERENTIEL]', async () => { 

        test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {            
            await menu.selectPlateforme(sPlateforme, page);                     // Sélection d'une plateforme 
            log.set('Plateforme : ' + sPlateforme);
        });
        
        test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menu.selectRayon(sRayon, page);               // Sélection du rayon
            log.set('Rayon : ' + sRayon);
        });
    
        if(sGroupeArticle != false){
            if(await menu.listBoxGroupeArticle.isVisible()){
                test('ListBox [GROUPEARTICLE] = "' + sGroupeArticle + '"', async () => {            
                    await menu.selectGroupeArticleByName(sGroupeArticle, page);               // Sélection du groupe article
                    log.set('Groupe Article : ' + sGroupeArticle);
                });
            }
        } else {
            log.set('Groupe Article : défaut'); 
        }

        var sNomPage = 'referentiel';
        test ('Page [' + sNomPage.toUpperCase() + '] - Click', async () => {
            await menu.click(sNomPage, page);
        }); 

        test('Label [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);      // Pas d'erreur affichée à priori au chargement de la page                
        });

        test.describe ('Onglet [GROUPE DE MAGASINS]', async () => {

            test('Onglet [GROUPE DE MAGASINS] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'groupes', page);
            });

            test('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);      // Pas d'erreur affichée à priori au chargement de la page                
            });                            

            test ('Button [CREER UN GROUPE] - Click', async () => {
                await fonction.clickAndWait(pageRefGrpeMagasin.buttonCreerGroupe, page);
            });

            test.describe ('Popin [CREATION D\'UN GOUPE DE MAGASIN]', async() => {

                test('Label [ERREUR] - Is Not Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);      // Pas d'erreur affichée à priori au chargement de la page                
                });  

                test('InputField [DESIGNATION] = "' + sNomGrpMag + '"', async() =>{
                    await fonction.sendKeys(pageRefGrpeMagasin.pInputDesignation, sNomGrpMag);
                });
                
                test('Button [ENREGISTRER] - Click', async() =>{
                    await fonction.clickAndWait(pageRefGrpeMagasin.pButtonEnregistrer, page);
                });
            });
   
            test('DataGrid [DESIGNATION] = "' + sNomGrpMag + '" - Click', async() => {
                await fonction.clickElement(pageRefGrpeMagasin.tdDesignation.locator('span:text-is("' + sNomGrpMag + '")'));
            });            

            aVillesCibles.forEach(async(ville:string) => {
                test('CheckBox [MAGASIN] = "' + ville + '"', async () => {    
                    await fonction.clickElement(pageRefGrpeMagasin.tdDesignationMag.locator('span:text-is("' + ville + '")'));       
                });
            });

            test('Button [ENREGISTRER] - Click', async() => {
                await fonction.clickAndWait(pageRefGrpeMagasin.buttonEnregistrer, page);
            });
        });

        test('Déconnexion', async () => {
            await fonction.deconnexion(page);
        });
    })
})