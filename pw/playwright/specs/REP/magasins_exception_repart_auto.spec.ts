/**
 * 
 * @desc Créer un groupe de magasin
 * 
 * @author SIAKA KONE
 * @since 2024-04-16
 * 
 */

const xRefTest      = 'REP_REF_EXM , REP_REF_EXS';
const xDescription  = "Création Suppression d'un magasin en exception de répartition automatique";
const xIdTest       =  2319;
const xVersion      = '3.3';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'REP',
    version     : xVersion,    
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme','rayon','groupeArticle','typeException'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------
import { test, type Page, expect }      from '@playwright/test';
import { CartoucheInfo }                from '@commun/types';
import { TestFunctions }                from '@helpers/functions.js';
import { Help }                         from '@helpers/helpers.js';
import { Log }                          from '@helpers/log.js';

import { MenuRepartition }              from '@pom/REP/menu.page.js';
import {RefExceptionRepartitionAutoPage} from '@pom/REP/referentiel-exception_repartition.page';
//------------------------------------------------------------------------------------
let page                        : Page;
let menu                        : MenuRepartition;
let pageRefExcepRepartAuto      : RefExceptionRepartitionAutoPage;
//------------------------------------------------------------------------------------
const log               = new Log();
const fonction          = new TestFunctions(log);
//------------------------------------------------------------------------------------

const sPlateforme       = fonction.getInitParam('plateforme','Cremcentre');
const sRayon            = fonction.getInitParam('rayon','Crèmerie');
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Frais LS');
const sTypeExcept       = fonction.getInitParam('typeException','Magasin prioritaire (100% en UD)');
const aMagasins         = ['Bergerac', 'Rambouillet', 'Malemort'];
//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                    = await browser.newPage();
    menu                    = new MenuRepartition(page, fonction);
    pageRefExcepRepartAuto  = new RefExceptionRepartitionAutoPage(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
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

        test('ListBox [GROUPEARTICLE] = "' + sGroupeArticle + '"', async () => {            
            await menu.selectGroupeArticleByName(sGroupeArticle, page);               // Sélection du groupe article
            log.set('Groupe Article : ' + sGroupeArticle);
        });
    
        var sNomPage:string = 'referentiel';
        test ('Page [' + sNomPage.toUpperCase() + '] - Click', async () => {
            await menu.click(sNomPage, page);
        }); 

        test('Label [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);      // Pas d'erreur affichée à priori au chargement de la page                
        });

        test.describe ('Onglet [EXCEPTION DE REPARTITION AUTOMATIQUE]', async () => {

            test('Onglet [GROUPE DE MAGASINS] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'exception', page);
            });

            test('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);      // Pas d'erreur affichée à priori au chargement de la page                
            }); 
            
            test.describe('** traitement **', async () =>{

                const sNomPopin:string = "Création d'une exception article";
                aMagasins.forEach(async(sMagasin:string) => {

                    test('InputField [DESIGNATION MAGASIN] = "' + sMagasin + '"', async () =>{
                        await fonction.sendKeys(pageRefExcepRepartAuto.inputFiltreMagasin, sMagasin);
                        await fonction.wait(page, 1000);
                    });

                    test('Datagrid [SUPPRESSION]['+sMagasin+']', async () =>{
                        const iPurge : number = await pageRefExcepRepartAuto.checkBoxDataGridListeMagasins.count();
                        if(iPurge == 1){
                            await fonction.clickElement(pageRefExcepRepartAuto.checkBoxDataGridListeMagasins.first());
                            await fonction.clickElement(pageRefExcepRepartAuto.buttonSupprimerExceptionMagasin);
                            log.set('Purge du magasin : ' + sMagasin);
                        } else {
                            log.set('Purge du magasin : ' + sMagasin + ' ignorée');
                        }
                    });

                     // Une fois certain que le magasin n'est pas présent, on peut l'ajouter

                    test('Button [CREER UNE EXCEPTION MAGASIN]['+sMagasin+']', async () =>{
                        await fonction.clickAndWait(pageRefExcepRepartAuto.buttonCreerExceptionMagasin, page);
                    });

                    test('Popin [' + sNomPopin.toUpperCase() + ']['+sMagasin+'] - Is Visible -Check', async () => {
                        await fonction.popinVisible(page, sNomPopin, true);
                    }); 

                    test('AutoComplete [MAGASIN] = "' + sMagasin + '"', async () => {
                        var bEnabled:boolean = await pageRefExcepRepartAuto.pInputMagasin.isEnabled();
                        if(bEnabled){
                            await pageRefExcepRepartAuto.pInputMagasin.clear();
                            var oData = {
                                libelle         :'MAGASIN',
                                inputLocator    : pageRefExcepRepartAuto.pInputMagasin,
                                inputValue      : sMagasin,
                                choiceSelector  :'li.gfit-autocomplete-result',
                                choicePosition  : 0,
                                typingDelay     : 100,
                                waitBefore      : 500,
                                page            : page,
                            };
                            await fonction.autoComplete(oData);
                            log.set('| Désignation Magasin > ' + sMagasin);
                        }
                    });

                    test('ListBox [TYPE EXCEPTION][' + sMagasin + '] = "' + sTypeExcept + '" - Select', async () => {
                        await fonction.selectListBoxByLabel(pageRefExcepRepartAuto.pListBoxTypeExceptionMagasin, sTypeExcept, page);
                    })

                    test('Button [ENREGISTRER]['+sMagasin+']', async () =>{
                        await fonction.clickAndWait(pageRefExcepRepartAuto.pButtonEnregistrerMagasin, page);
                        log.set('Ajout du magasin : ' + sMagasin);
                    });

                    test('Popin [' + sNomPopin.toUpperCase() + ']['+sMagasin+'] - Is Not Visible - Check', async () => {
                        await fonction.popinVisible(page, sNomPopin, false);
                    });

                    // Une fois le magasin ajouté, on doit pouvoir le retrouver afin de le supprimer

                    test('InputField [DESIGNATION MAGASIN] 2 = "' + sMagasin + '"', async () =>{
                        await fonction.sendKeys(pageRefExcepRepartAuto.inputFiltreMagasin, sMagasin);
                        await fonction.wait(page, 1000);
                    });

                    test('Suppression magasin ['+sMagasin+']', async () =>{
                        const iPurge:number = await pageRefExcepRepartAuto.checkBoxDataGridListeMagasins.count();
                        expect(iPurge).toBe(1);
                        await fonction.clickElement(pageRefExcepRepartAuto.checkBoxDataGridListeMagasins.first());
                        await fonction.clickElement(pageRefExcepRepartAuto.buttonSupprimerExceptionMagasin);
                        log.set('Magasin : ' + sMagasin + ' supprimé');
                        log.set('---');
                    });
                });
            });
        });

        test('Déconnexion', async () => {
            await fonction.deconnexion(page);
        });
    })
})