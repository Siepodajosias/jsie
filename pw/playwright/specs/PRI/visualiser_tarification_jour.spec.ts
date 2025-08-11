/**
 * @desc Visualiser les tarifications en date du jour
 * 
 * @author SIAKA KONE
 *  Since 2024-08-12
 */

const xRefTest      = "PRI_TAR_NOW";
const xDescription  = "Visualiser les tarifications en date du jour J";
const xIdTest       =  4877;
const xVersion      = '3.4';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRICING',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon','groupeArticle','enseigne'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, expect, type Page}           from '@playwright/test';
import { CartoucheInfo,TypeListOfElements}  from '@commun/types';
import { TestFunctions }                    from '@helpers/functions';
import { Log }                              from '@helpers/log.js';
import { Help }                             from '@helpers/helpers.js';

//-- PageObject ----------------------------------------------------------------------

import { MenuPricing }                      from '@pom/PRI/menu.page';
import { TarificationPage }                 from '@pom/PRI/tarification_tarification.page';

//----------------------------------------------------------------------------------------

let page        : Page;
let menuPage    : MenuPricing;
let pageTarif   : TarificationPage;

const log       = new Log();
const fonction  = new TestFunctions(log);
const maDate    = new Date();

//-------------------------------------------------------------------------------------------------------------------
const sRayon                        = fonction.getInitParam('rayon','Crèmerie');
const sGroupeArtcle                 = fonction.getInitParam('groupeArticle','Coupe / Corner');
const sEnseigne                     = fonction.getInitParam('enseigne', 'Grand Frais');

const sGrpeMagFav:string            = 'Premium';
const sGrpeMagFavAutre:string       = 'Discount';
const sGrpeMagFavSansTarif:string   = 'TEST-AUTO_GrpMag-' + fonction.getToday('us') + '_' + maDate.getHours();
const sPromotion:string             = 'TA-PROMO';
const sGroupeArticleLabel           = 'Tous';
const sEnseigneLabel                = 'Toutes';
const sRoleImportateurPrix:string   = 'IMPORTATEUR PRIX';
const sRoleTarificateur:string      = 'TARIFICATEUR';

let iNbreTarification:number;
//-------------------------------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page      = await browser.newPage(); 
    menuPage  = new MenuPricing(page, fonction);
    pageTarif = new TarificationPage(page);
    const helper = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//-----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [ACCUEIL]', async () => {   
        
        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })   

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menuPage.selectRayonByName(sRayon, page);                       // Sélection du rayon passé en paramètre
        })       
    })  //-- End Describe Page

    test.describe('Page [TARIFICATION]', async () => {   
        
        test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menuPage.selectRayonByName(sRayon, page);                       // Sélection du rayon passé en paramètre
        }) 

        test('Page [TARIFICATION] - Click', async () => {
            await menuPage.click('tarification', page);
        })

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })

        const sDateJour:string   = fonction.getToday('FR', 0 ,' / ');
        test('DatePicker [DATE EDITION] ="' + sDateJour + '"', async () => {
            expect(await pageTarif.inputDateEdition.inputValue()).toBe(sDateJour);
        })

        test('ListBox [GROUPE ARTICLE] - Check', async () => {
            expect(await pageTarif.listBoxGroupeArticle.textContent()).toBe(sGroupeArticleLabel);
        })

        test('ListBox [ENSEIGNE] - Check', async () => {
            expect(await pageTarif.listBoxGroupeMagasin.textContent()).toBe(sEnseigneLabel);
        })

        test('** Wait Until Spinner Off **', async () => {
            await fonction.waitForSpinner(pageTarif.pPcalcMargeSpinner, 180000);
        })

        test('CheckBox [TARIF A VALIDER] - Is Visible', async () => {
            await fonction.isDisplayed(pageTarif.checkBoxTarifAValider);
        })

        test('CheckBox [TARIF A VALIDER] - Click', async () => { //Cliquer pour afficher toutes les tarifications
            await fonction.clickElement(pageTarif.checkBoxTarifAValider);
        })

        test('Td [ACTIONS] - Check', async () => {
            await pageTarif.dataGridArticlesSelectable.first().hover();
            await fonction.isDisplayed(pageTarif.buttonActionArreterTarification.first());
            await fonction.isDisplayed(pageTarif.buttonActionHistorique.first());
        })

        test('ListBox [GROUPE ARTICLE] = "' + sGroupeArtcle + '"', async () => {
            await fonction.clickElement(pageTarif.listBoxGroupeArticle);
            await fonction.clickElement(pageTarif.dropdownItem.filter({hasText:sGroupeArtcle}).first());
        })

        //---Vérification de l'affichage unique des articles du groupe article
        test('Td [CODE ARTICLE] - Check', async () => {
            await fonction.wait(page, 500); // Attendre que le filtre soit effectif;
            const aCodeArticle = await pageTarif.tdLabelCodeArticle.allTextContents();
            aCodeArticle.forEach((sCodeArticle:String) => {
                expect(sCodeArticle.trim().charAt(0)).toBe('C'); //Les articles du groupe article coupe / corner ont pour initial 'C';
            })
        })

        test('ListBox [ENSEIGNES] = "' + sEnseigne + '"', async () => {
            await fonction.clickElement(pageTarif.listBoxGroupeMagasin);
            await fonction.sendKeys(pageTarif.inputEnseigne, sEnseigne, false , 'Enseigne');
            await fonction.clickElement(pageTarif.multiSelectItemEnseigne.first());
            await fonction.clickElement(pageTarif.pPcalcMargeIconClose);
        })

        //--Vérification du grpe mag appartenant à l'enseigne
        test('Td [GROUPE MAGASIN] - Check', async () => {
            const aGroupeMagasin = await pageTarif.tdLabelGroupeMag.allTextContents();
            var sTextGrpeMagasin = '';
            aGroupeMagasin.forEach((grpMag) => {
                sTextGrpeMagasin += ',' + grpMag;
            })

            expect(sTextGrpeMagasin).toContain(sPromotion);
        })

        test('Button [COLONNE A AFFICHER] - Click', async () => {
            await fonction.clickAndWait(pageTarif.buttonColonnes, page);
        })

        test('CheckBox [COLONNES A AFFICHER] - Click', async () => {
            var isVisible = await pageTarif.checkBoxColonneAAfficher.isVisible();
            if(isVisible){
                await fonction.clickAndWait(pageTarif.checkBoxColonneAAfficher, page);
            }
        })

        test('DataGrid [LISTE DES MAGASINS] - Check', async () => {
            var oDataGrid:TypeListOfElements = 
            {
                element     : pageTarif.dataGridListeArticles,    
                desc        : 'DataGrid [LISTE DES MAGASINS]',
                column      :   
                    [
                        "** skip **",
                        "** skip **",//Groupe de magasin1
                        "Code article",
                        "** skip **",//Désignation article4
                        "% Marge Ptf",
                        "Prix cession HT",
                        "% Marge magasin",
                        "PVC TTC",
                        "",
                        "",
                        "Actions",            
                    ]
            }

            await fonction.dataGridHeaders(oDataGrid);
        })

        test('Page [TARIFICATION] #1 - Click', async () => { //Cliquer sur la page tarification avant de se déconnecter afin que les modifications soient pries en compte;
            await menuPage.click('tarification', page);
        })

        test.describe('Profil [' + sRoleImportateurPrix + ']', async () => {

            test('Changer profil', async ()=>{
                await fonction.changeProfilByRole(info.appli, sRoleImportateurPrix, page); 
            })

            test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
                await menuPage.selectRayonByName(sRayon, page);                       // Sélection du rayon passé en paramètre
            })

            test('Page [TARIFICATION] - Click', async () => {
                await menuPage.click('tarification', page);
            })
    
            test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
                await fonction.isErrorDisplayed(false, page);
            })

            test('DataGrid [LISTE DES MAGASINS] - Check', async () => {
                var oDataGrid:TypeListOfElements = 
                {
                    element     : pageTarif.dataGridListeArticles, // On doit voir toutes les colonnes    
                    desc        : 'DataGrid [LISTE DES MAGASINS]',
                    column      :   
                        [
                            "** skip **",
                            "** skip **",  //Groupe de magasin1
                            "** skip **",  //Famille2          
                            "** skip **",  //Sous-famille3     
                            "Référence de gamme", 
                            "Code article", 
                            "** skip **",    
                            "CA hebdo.",              
                            "** skip **",               
                            "Px rvt HT moy préc", 
                            "Px rvt HT moy",      
                            "% Marge Ptf",        
                            "Prix cession HT",    
                            "% Marge magasin",    
                            "PVC TTC préc",       
                            "PVC TTC théorique",  
                            "PVC TTC",            
                            "Par",   
                            "** skip **",   //Unité6          
                            "",                            
                            "",                   
                            "Permanent",          
                            "Période",            
                            "",                   
                            "Actions",                
                        ]
                }

                await fonction.dataGridHeaders(oDataGrid);
            })
        })

        test.describe('Profil [' + sRoleTarificateur + ']', async () => {

            test('Changer profil', async ()=>{
                await fonction.changeProfilByRole(info.appli, sRoleTarificateur, page); 
            })

            test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
                await menuPage.selectRayonByName(sRayon, page);                       // Sélection du rayon passé en paramètre
            })

            test('Page [TARIFICATION] - Click', async () => {
                await menuPage.click('tarification', page);
            })

            test('ListBox [RAYON] #1 = "' + sRayon + '"', async () => {            
                await menuPage.selectRayonByName(sRayon, page);  // Sélection du rayon passé en paramètre                 
            })

            test('Page [TARIFICATION] #1 - Click', async () => {
                await menuPage.click('tarification', page);
            })

            test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
                await fonction.isErrorDisplayed(false, page);
            })

            test('Button [COLONNE A AFFICHER] - Click', async () => {
                await fonction.clickAndWait(pageTarif.buttonColonnes, page);
            }) 

            test('CheckBox [COLONNES A AFFICHER] - Click', async () => {
                var isVisible = await pageTarif.checkBoxColonneAAfficher.isVisible();
                if(isVisible){
                    await fonction.clickAndWait(pageTarif.checkBoxColonneAAfficher, page);
                }
                await fonction.clickElement(pageTarif.buttonColonnes);
            })

            test('** Wait Until Spinner Off **', async () => {
                await fonction.waitForSpinner(pageTarif.pPcalcMargeSpinner, 180000);
            })

            test('DataGrid [LISTE DES MAGASINS] - Check', async () => { //Cercher à comprendre pourquoi toutes les colonnes s'affichent
                var oDataGrid:TypeListOfElements = 
                {
                    element     : pageTarif.dataGridListeArticles,     
                    desc        : 'DataGrid [LISTE DES MAGASINS]',
                    column      :   
                        [
                            "** skip **",
                            "** skip **",//Groupe de magasin1
                            "Code article",
                            "** skip **", //Désignation article4
                            "% Marge Ptf",
                            "Prix cession HT",
                            "% Marge magasin",
                            "PVC TTC",
                            "",
                            "",
                            "Actions",            
                        ]
                }

                await fonction.dataGridHeaders(oDataGrid);
            })

            test('CheckBox [TARIF A VALIDER] - Click', async () => { //Cliquer pour afficher toutes les tarifications
                await fonction.clickElement(pageTarif.checkBoxTarifAValider);
                iNbreTarification = await pageTarif.dataGridArticlesSelectable.count();
                log.set('Nombre de tarification avant la selection : ' + iNbreTarification);
            })

            var sNomPopin:string = 'Paramétrage';

            test.describe('Popin [' + sNomPopin + ']', async () => {

                test('Button [PARAMETRAGE] - Click', async () => {
                    await fonction.clickElement(pageTarif.buttonParametrage);
                })

                test('ListBox [GROUPE MAGASIN FAVORIS] - Click', async () => {
                    await fonction.clickElement(pageTarif.pPGroueMagFavoris);
                })

                //--Checker qu'on ne voit pas les promotions
                test('InputField [GRPE MAGASIN FAVORIS] = "'+ sPromotion +'"', async () => {
                    await fonction.sendKeys(pageTarif.pPInputGroupeMagFav, sPromotion, false, 'Promotion');
                    await fonction.wait(page, 500); //Attendre que le filtre s'applique effectivement;
                })

                test('CheckBox [GROUPE FAVORIS][0] - Is Not Visible', async () => {
                    await expect(pageTarif.pPcheckBoxGroupeFav.first()).not.toBeVisible();
                })

                test('InputField [GRPE MAGASIN FAVORIS] = "'+ sPromotion +'" - Clear', async () => {
                    await pageTarif.pPInputGroupeMagFav.clear();
                })

                test('CheckBox [GROUPE MAG ALL] - Click', async () => {
                    await fonction.clickElement(pageTarif.pPCheckBoxAllGroupeFav);
                })

                test('Button [APPLIQUER] - Click', async () => {
                    await fonction.clickAndWait(pageTarif.pPButtonAppliquer, page);
                })

                test('** Wait Until Spinner Off **', async () => {
                    await fonction.waitForSpinner(pageTarif.pPcalcMargeSpinner, 180000);
                })

                test('CheckBox [TARIF A VALIDER] #1 - Click', async () => { //Cliquer pour afficher toutes les tarifications
                    await fonction.clickElement(pageTarif.checkBoxTarifAValider);
                })

                //--Vérifier que même les promos sont visibles
                test('Td [GROUPE MAGASIN] - Check', async () => {
                    const aGroupeMagasin = await pageTarif.tdLabelGroupeMag.allTextContents();
                    var sTextGrpeMagasin = '';
                    aGroupeMagasin.forEach((grpMag) => {
                        sTextGrpeMagasin += ',' + grpMag;
                    })
        
                    expect(sTextGrpeMagasin).toContain(sPromotion);
                })
        
                //---Selection d'un seul groupe de magasin
                test('Button [PARAMETRAGE] #2 - Click', async () => {
                    await fonction.clickElement(pageTarif.buttonParametrage);
                })

                test('ListBox [GROUPE MAGASIN FAVORIS] #2 - Click', async () => {
                    await fonction.clickElement(pageTarif.pPGroueMagFavoris);
                })

                //--Deselection de tous les groupes de magasin
                test('CheckBox [GROUPE MAG DESELECT ALL] - Click', async () => {
                    await fonction.clickElement(pageTarif.pPCheckBoxAllGroupeFav);
                })

                // -- Filtrer sur un seul groupe magasin
                test('InputField [GRPE MAGASIN FAVORIS] = " '+ sGrpeMagFav +'"', async () => {
                    await fonction.sendKeys(pageTarif.pPInputGroupeMagFav, sGrpeMagFav, false, 'Groupe favoris');
                    await fonction.wait(page, 500);
                })

                test('CheckBox [GROUPE FAVORIS][0] - Click', async () => {
                    await fonction.clickElement(pageTarif.pPcheckBoxGroupeFav.first());
                })

                test('Button [APPLIQUER] #1 - Click', async () => {
                    await fonction.clickAndWait(pageTarif.pPButtonAppliquer, page);
                })

                test('** Wait Until Spinner Off (#1)**', async () => {
                    await fonction.waitForSpinner(pageTarif.pPcalcMargeSpinner, 180000);
                })

                //---Fin selection groupe magasin----

                test('CheckBox [TARIF A VALIDER] #2 - Click', async () => { //Cliquer pour afficher toutes les tarifications
                    await fonction.clickElement(pageTarif.checkBoxTarifAValider);
                })

                //--Check de l'affichage

                test('Td [GROUPE MAGASIN] "' +sGrpeMagFav+ '" - Check', async () => {
                    const aGroupeMagasin = await pageTarif.tdLabelGroupeMag.allInnerTexts();
                    var text = '';
                    aGroupeMagasin.forEach((grpMag) => {
                        text += ',' + grpMag;
                    })
        
                    expect(text).toContain(sGrpeMagFav);
                })

                test('Td [GROUPE MAGASIN] "' +sPromotion+ '" - Check', async () => {
                    const aGroupeMagasin = await pageTarif.tdLabelGroupeMag.allInnerTexts();
                    var text = '';
                    aGroupeMagasin.forEach((grpMag) => {
                        text += ',' + grpMag;
                    })
        
                    expect(text).toContain(sPromotion);
                })

                test('Td [GROUPE ARTICLE] - Check', async () => {// S'assurer que le nombre de tarification a été reduit suite à l'application du filtre;
                    expect(await pageTarif.dataGridArticlesSelectable.count()).toBeLessThanOrEqual(iNbreTarification);
                })
            })
        })

        test.describe('Profil [' + sRoleImportateurPrix + '] #1', async () => {

            test('Changer profil', async ()=>{
                await fonction.changeProfilByRole(info.appli, sRoleImportateurPrix, page); 
            })

            test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
                await menuPage.selectRayonByName(sRayon, page);                       // Sélection du rayon passé en paramètre
            })

            test('Page [TARIFICATION] - Click', async () => {
                await menuPage.click('tarification', page);
            })

            test('ListBox [RAYON] #1 = "' + sRayon + '"', async () => {            
                await menuPage.selectRayonByName(sRayon, page);                       // Sélection du rayon passé en paramètre
            })

            test('Button [PARAMETRAGE] - Click', async () => {
                await fonction.clickElement(pageTarif.buttonParametrage);
            })

            test('ListBox [GROUPE MAGASIN FAVORIS] - Check', async () => {
                expect(await pageTarif.pPGroueMagFavoris.first().textContent()).toBe('Aucun');
            })

            test('** Wait Until Spinner Off (#1)**', async () => {
                await fonction.waitForSpinner(pageTarif.pPcalcMargeSpinner, 180000);
            })

            test('CheckBox [TARIF A VALIDER] - Click', async () => { //Cliquer pour afficher toutes les tarifications
                await fonction.clickElement(pageTarif.checkBoxTarifAValider);
            })

            //-- On doit voir tous les groupes de magasin sans tenir compte de la stratégie appliquée;
            test('Td [GROUPE ARTICLE] - Check', async () => {
                expect(await pageTarif.dataGridArticlesSelectable.count()).toBeGreaterThan(0);
            })
        })

        test.describe('Profil [' + sRoleTarificateur + '] #1', async () => {

            test('Changer profil', async ()=>{
                await fonction.changeProfilByRole(info.appli, sRoleTarificateur, page); 
            })

            test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
                await menuPage.selectRayonByName(sRayon, page);                       // Sélection du rayon passé en paramètre
            })

            test('Page [TARIFICATION] - Click', async () => {
                await menuPage.click('tarification', page);
            })

            test('ListBox [RAYON] #1 = "' + sRayon + '"', async () => {            
                await menuPage.selectRayonByName(sRayon, page);                       // Sélection du rayon passé en paramètre
            }) 

            test('** Wait Until Spinner Off**', async () => {
                await fonction.waitForSpinner(pageTarif.pPcalcMargeSpinner, 180000);
            })

            test('CheckBox [TARIF A VALIDER] - Click', async () => { //Cliquer pour afficher toutes les tarifications
                await fonction.clickElement(pageTarif.checkBoxTarifAValider);
            })

            //-- On doit voir tous les groupes de magasin tenant compte de mes favoris;
            test('Td [GROUPE ARTICLE] - Check', async () => {
                expect(await pageTarif.dataGridArticlesSelectable.count()).toBeGreaterThan(0);
            })

            //--Filtrer sur le groupe magasin
            test('ListBox [GRPE MAGASIN] = "' + sGrpeMagFav + '"', async () => {
                await fonction.clickElement(pageTarif.tdListeBoxGpreArticle.first());
                await fonction.sendKeys(pageTarif.pPInputGroupeMagFav.first(), sGrpeMagFav, false, 'Groupe favoris');
                await fonction.clickElement(pageTarif.pPcheckBoxGroupeFav.first());
            })

            test('Button [X] #1 - Click', async () => {
                await fonction.clickAndWait(pageTarif.pPButtonClose, page);
            })

            //--Checker l'affichage après le filtre. Je ne dois voir que les grpes mag que j'ai filtré
            test('Td [GROUPE DE MAGASIN] = "' + sGrpeMagFav + '" - Check', async () => {
                await fonction.wait(page, 500); // Attendre que le filtre soit effectif;
                const aGroupeMag = await pageTarif.tdLabelGroupeMag.allTextContents();
                aGroupeMag.forEach((sGrpeMag:String) => {
                    expect(sGrpeMag.trim()).toBe(sGrpeMagFav); //Les articles du groupe article coupe / corner ont pour initial 'C';
                })
            })

            //---Selectionner toutes les stratégies-----------
            test('Button [PARAMETRAGE] #1 - Click', async () => {
                await fonction.clickElement(pageTarif.buttonParametrage);
            })

            test('ListBox [GROUPE MAGASIN FAVORIS] - Click', async () => {
                await fonction.clickElement(pageTarif.pPGroueMagFavoris);
            })

            test('CheckBox [GROUPE MAG ALL] - Click', async () => {
                await fonction.clickElement(pageTarif.pPCheckBoxAllGroupeFav.first());
            })

            test('Button [APPLIQUER] - Click', async () => {
                await fonction.clickAndWait(pageTarif.pPButtonAppliquer, page);
            })

            test('CheckBox [TARIF A VALIDER] #2 - Click', async () => { //Cliquer pour afficher toutes les tarifications
                await fonction.clickElement(pageTarif.checkBoxTarifAValider);
            })

            //-- Checker que le filtre appliqué demeure;
            test('Label [GROUPE MAGASIN] - Check', async () => {
                expect(await pageTarif.multiSelectLabelGrpeMag.first().textContent()).toBe(sGrpeMagFav);
            })

            // -- Selectionner un seul groupe de magasin favoris;
            test('Button [PARAMETRAGE] #2 - Click', async () => {
                await fonction.clickElement(pageTarif.buttonParametrage);
            })

            test('ListBox [GROUPE MAGASIN FAVORIS] #2 - Click', async () => {
                await fonction.clickElement(pageTarif.pPGroueMagFavoris);
            })

            test('CheckBox [GROUPE MAG DESELECT ALL] - Click', async () => {
                await fonction.clickElement(pageTarif.pPCheckBoxAllGroupeFav.first());
            })

            test('ListBox [GRPE MAGASIN] = "' + sGrpeMagFavAutre + '"', async () => {
                await fonction.sendKeys(pageTarif.pPInputGroupeMagFav, sGrpeMagFavAutre, false, 'Groupe favoris');
                await fonction.clickElement(pageTarif.pPcheckBoxGroupeFav.first());
            })

            test('Button [APPLIQUER] #1 - Click', async () => {
                await fonction.clickAndWait(pageTarif.pPButtonAppliquer, page);
            })

            test('CheckBox [TARIF A VALIDER] #3 - Click', async () => { //Cliquer pour afficher toutes les tarifications
                await fonction.clickElement(pageTarif.checkBoxTarifAValider);
            })

            test('Label [GROUPE MAGASIN] #1 - Check', async () => {
                expect(await pageTarif.multiSelectLabelGrpeMag.first().textContent()).toBe(sEnseigneLabel);
            })

            //--- Vérifier avec une strategie sans tarification;
            test('Button [PARAMETRAGE] #3 - Click', async () => {
                await fonction.clickElement(pageTarif.buttonParametrage);
            })

            test('ListBox [GROUPE MAGASIN FAVORIS] #3 - Click', async () => {
                await fonction.clickElement(pageTarif.pPGroueMagFavoris);
            })

            test('CheckBox [GROUPE MAG DESELECT ALL] #1 - Click', async () => {
                await fonction.clickElement(pageTarif.pPCheckBoxAllGroupeFav.first());
                await fonction.clickElement(pageTarif.pPCheckBoxAllGroupeFav.first());
            })

            test('InputField [GRPE MAGASIN FAVORIS] #1 = "'+ sGrpeMagFavSansTarif +'"', async () => {
                await fonction.sendKeys(pageTarif.pPInputGroupeMagFav, sGrpeMagFavSansTarif, false, 'Groupe favoris sans tarification');
            })

            test('CheckBox [GROUPE FAVORIS][0] #1 - Click', async () => {
                await fonction.clickElement(pageTarif.pPcheckBoxGroupeFav.first());
            })
            
            test('Button [APPLIQUER] #2- Click', async () => {
                await fonction.clickAndWait(pageTarif.pPButtonAppliquer, page);
            })

            //--Vérifier l'affichage des promotions bien que nous ayon un groupe magasin sans tarification;
            test('Td [GROUPE MAGASIN] #1 - Check', async () => {
                const aGroupeMagasin = await pageTarif.tdLabelGroupeMag.allInnerTexts();
                var text = '';
                aGroupeMagasin.forEach((grpMag) => {
                    text += ',' + grpMag;
                })
    
                expect(text).toContain(sPromotion);
            })

            //-- Afficher toutes les colonnes à la fin du TA pour qu'au prochain lancement, on ait toutes les colonnes affichées par défaut;
            test('Button [COLONNE A AFFICHER] - Click', async () => {
                await fonction.clickAndWait(pageTarif.buttonColonnes, page);
            })
    
            test('CheckBox [COLONNES A AFFICHER] - Click', async () => {
                await fonction.clickElement(pageTarif.checkBoxColonneAffiche);
            })

            test('Page [TARIFICATION] #1 - Click', async () => { //Cliquer sur la page tarification avant de se déconnecter afin que les modifications soient pries en compte;
                await menuPage.click('tarification', page);
            })
        })
  
    })  //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})

