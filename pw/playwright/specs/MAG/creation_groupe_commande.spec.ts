/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 19 - 12 - 2023
 */

const xRefTest      = "MAG_AUP_GPF";
const xDescription  = "Création d'un Groupe de Commandes XX";
const xIdTest       =  109;
const xVersion      = '3.6';

var info = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['idCodeRayon', 'Cadende', 'listeMagasins', 'groupeArticle','typeAssortiment'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}                from '@playwright/test';

import { TestFunctions }                 from "@helpers/functions";
import { Log }                           from "@helpers/log";
import { Help }                          from '@helpers/helpers';

import { GlobalConfigFile }              from '@conf/commun.conf';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }                   from '@pom/MAG/menu.page';
import { AutorisationsParametrage }      from '@pom/MAG/autorisations-parametrage.page';

//-------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuMagasin;
let pageAutParam    : AutorisationsParametrage;


const log           = new Log();
const fonction      = new TestFunctions(log);
const globalConfig  = new GlobalConfigFile();

const globalData    = globalConfig.getData();

//----------------------------------------------------------------------------------------

var maDate           = new Date();

const xFix           = ':' + maDate.getDate().toString() + maDate.getHours();
const dateJour       = maDate.getFullYear().toString().slice(-2) + fonction.addZero(maDate.getMonth() + 1) + fonction.addZero(maDate.getDate());

var iNumJourSemaine  = maDate.getDay();     
var joursSemaine     = globalData.joursSemaine;

//-----------------------------------------------------------------------------------------

fonction.importJdd();

const sCodeRayon        = fonction.getInitParam('idCodeRayon', 'FL');  
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Fruits et légumes');
const sTypeAssortiment  = fonction.getInitParam('typeAssortiment', 'Achats centrale'); 
const sDesignGrpAssort  = fonction.getInitParam('nomAssortiment', 'TA_' + sTypeAssortiment + ' ' + sGroupeArticle + ' ' + dateJour );    // §§§-1 Ref Inter Scénarios  
const sCadence          = fonction.getInitParam('cadence', 'hebdo');         // jour = commande sur une journée ; hebdo = commande tous les jours (sauf dimanche) 
var aListeVilles        = fonction.getInitParam('listeMagasins', 'Bergerac,Bron');
const sDebutCommande    = fonction.getInitParam('heureDebut', '00:00');    
const sFinCommande      = fonction.getInitParam('heureFin','23:59'); 

var cmdHeureStart       = sDebutCommande.split(':')[0];
var cmdMinuteStart      = sDebutCommande.split(':')[1];
var cmdHeureEnd         = sFinCommande.split(':')[0];
var cmdMinuteEnd        = sFinCommande.split(':')[1];

//-----------------------------------------------------------------------------------------   

// La liste des lieux de vente cible peut être :
//    * Soit celle contenue dans le fichier de conf par défaut de l'application (array)
//    * Soit celle contenue dans le JDD (array)
//    * Soit celle passée en argument (string). Ex "ville1 , ville2 , ville3".
// Dans ce dernier cas, cette chaîne doit être transofmrée en tableau pour pouvoir être traitée.

if (typeof(aListeVilles) === 'string' ) {
    aListeVilles = aListeVilles.split(',');
}

//---------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageAutParam    = new AutorisationsParametrage(page);
})
 
test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    })

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
        log.set('ID Code Rayon : ' + sCodeRayon);
        log.set('Groupe Article : ' + sGroupeArticle);
    });

    test.describe('Page [ACCUEIL]', async () => {

        test('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if(isVisible){
                await menu.removeArlerteMessage(page);
            }else{                
                log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                test.skip();
            }
        })
    })

    test.describe('Page [AUTORISATIONS]', async () => {

        var bAssortimentExiste = false;
        var pageName = 'autorisations';

        test('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(pageName,page);
        })

        test('Onglet [PARAMETRAGE] - Click', async () => {  
            await menu.clickOnglet(pageName, 'parametrage', page);                 
        })

        test('InpuField [ASSORTIMENT] = "' + sDesignGrpAssort + '"', async () => {
            await fonction.sendKeys(pageAutParam.inputFieldFilter, sDesignGrpAssort, false, 'Assortiment');
            await fonction.wait(page, 500);
        })

        test('CheckBox [ASSORTIMENT] - Click', async () => {      
            var isVisible = await pageAutParam.checkBoxListeAssortiments.first().isVisible();
            if(isVisible){
                bAssortimentExiste = true;
                await fonction.clickElement(pageAutParam.checkBoxListeAssortiments.nth(0));  
            }else{
                log.set('Aucun assortiment trouvé correspondant à "' + sDesignGrpAssort + '"');
                log.set('CheckBox [ASSORTIMENT] - Click: ATION ANNULEE');
                test.skip();
            }    
        })

        var sNomPopin = "Popin [MODIFICATION / CREATION D'UN GROUPE DE COMMANDE";
        test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {
            
            test('Bouton [CREER GROUPE DE COMMANDE] - Click', async () => {  
                if(bAssortimentExiste){
                    await fonction.clickAndWait(pageAutParam.buttonCreerGrpCmd, page, 40000);
                }else{
                    log.set('Bouton [CREER GROUPE DE COMMANDE] - Click : ACTION ANNULEE');
                    test.skip();
                }        
            })
    
            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                if(bAssortimentExiste){
                    await fonction.popinVisible(page, sNomPopin, true);
                }else{
                    log.set('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible : VERIFICATION ANNULEE');
                    test.skip();
                }
            })
        
            var sGroupeCmde         = sDesignGrpAssort;      
            test('InputField [NOM] = "' + sGroupeCmde + '"', async () => {
                if(bAssortimentExiste){
                    await fonction.sendKeys(pageAutParam.pInputNom, sGroupeCmde, false, 'Nom');
                }else{
                    log.set('InputField [NOM] = "' + sGroupeCmde + '" : ACTION ANNULEE');
                    test.skip();
                }
            }) 
        
            test('Date Picker [HEURE DEBUT] = "' + cmdHeureStart + '"', async () =>{
                if(bAssortimentExiste){
                    await fonction.sendKeys(pageAutParam.pDatePickerHeureDebut, cmdHeureStart, false, 'Heure Début');
                }else{
                    log.set('Date Picker [HEURE DEBUT] = "' + cmdHeureStart + '" : ACTION ANNULEE');
                    test.skip();
                }              
            })
            
            test('Date Picker [MINUTE DEBUT] = "' + cmdMinuteStart + '"', async () =>{
                if(bAssortimentExiste){
                    await fonction.sendKeys(pageAutParam.pDatePickerMinuteDebut, cmdMinuteStart, false, 'Minute Début');     
                }else{
                    log.set('Date Picker [MINUTE DEBUT] = "' + cmdMinuteStart + '" : ACTION ANNULEE');
                    test.skip();
                }          
            })      
            
            test('Date Picker [HEURE FIN] = "' + cmdHeureEnd + '"', async () =>{
                if(bAssortimentExiste){
                    await fonction.sendKeys(pageAutParam.pDatePickerHeureFin, cmdHeureEnd, false, 'Feure Fin');      
                }else{
                    log.set('Date Picker [HEURE FIN] = "' + cmdHeureEnd + '" : ACTION ANNULEE');
                    test.skip();
                }      
            })
            
            test('Date Picker [MINUTE FIN] = "' + cmdMinuteEnd + '"', async () =>{
                if(bAssortimentExiste){
                    await fonction.sendKeys(pageAutParam.pDatePickerMinuteFin, cmdMinuteEnd, false, 'Minute Fin');   
                }else{
                    log.set('Date Picker [MINUTE FIN] = "' + cmdMinuteEnd + '" : ACTION ANNULEE');
                    test.skip();
                }          
            }) 

            if (sCadence == 'jour') {                                                   // calendrier seulement pour commande aujourd'hui et prev demain
                test('Jour [COURANT] = "' + joursSemaine[iNumJourSemaine-1] + '"', async () =>{
                    if(bAssortimentExiste){
                        var ligne   = iNumJourSemaine;
                        var cible   = iNumJourSemaine ;

                        await fonction.clickElement(pageAutParam.pListBoxExpedition.nth(ligne));
                        await fonction.clickElement(pageAutParam.choixJour(joursSemaine[cible]));
                        await fonction.addDataSheet('ListBox', 'jour Expédition', joursSemaine[iNumJourSemaine-1] + ' -> ' + joursSemaine[cible]);

                    }else{
                        log.set('Jour [COURANT] = "' + joursSemaine[iNumJourSemaine-1] + '" : ACTION ANNULEE');
                        test.skip();
                    }
                })

                test('Jour [LENDEMAIN] = "' + joursSemaine[iNumJourSemaine] + '"', async () =>{  
                    if(bAssortimentExiste){
                        var ligne   = iNumJourSemaine + 1;
                        var cible   = iNumJourSemaine + 2;
                        
                        await fonction.clickElement(pageAutParam.pListBoxExpedition.nth(ligne));
                        await fonction.clickElement(pageAutParam.choixJour(joursSemaine[cible]));
                        await fonction.addDataSheet('ListBox', 'jour Expédition', joursSemaine[iNumJourSemaine-1] + ' -> ' + joursSemaine[cible]);

                    }else{
                        log.set('Jour [LENDEMAIN] = "' + joursSemaine[iNumJourSemaine] + '" : ACTION ANNULEE');
                        test.skip();
                    }
                })
            }else {         // calendrier avec commande tous les jours (sauf dimanche)
                                                                                     
                for (let indice = 1; indice < 6; indice++) {

                    test('Jour [COURANT] = "' + joursSemaine[indice] + '"', async () =>{
                        if(bAssortimentExiste){
                            var iLigne   = indice;
                            var iCible   = indice + 2;
                            if (iCible === 7) {                                    // cas de commande le dimanche et livraison le lundi
                                iCible = 1;
                                
                            }          

                            await fonction.clickElement(pageAutParam.pListBoxExpedition.nth(iLigne));
                            await fonction.clickElement(pageAutParam.choixJour(joursSemaine[iCible])); 
                            await fonction.addDataSheet('ListBox', 'jour Expédition', joursSemaine[indice] + ' -> ' + joursSemaine[iCible]);              

                        }else{
                            log.set('Jour [COURANT] = "' + joursSemaine[indice] + '" : ACTION ANNULEE');
                            test.skip();
                        }
                    })
                }
            }

            test('MultiSelect [DESIGNATION] - Click', async () => {
                if(bAssortimentExiste){
                    await fonction.clickElement(pageAutParam.pTdDesignationMag);  
                }else{
                    log.set('MultiSelect [DESIGNATION] - Click : ACTION ANNULEE');
                    test.skip();
                }
            })

            aListeVilles.forEach(async (ville:string, index:number) => {

                test('CheckBox [MAGASIN][' + index + '] = "' + sCodeRayon + ' ' + ville + '"', async () =>{    
                    if(bAssortimentExiste){

                        ville = ville.trim();                   // On se débarrasse des éventuels espaces autour de la chaîne de caractères  
                        log.set('Magasin Associé : ' + ville);   
                        await fonction.sendKeys(pageAutParam.pPinputDesignation, ville, false, 'Ville');
                        var iNbDesignationMag = await pageAutParam.pMutipleSelection.count();
                        for (let iIndexDesignation = 0; iIndexDesignation < iNbDesignationMag; iIndexDesignation ++){

                            var sDesignation = await pageAutParam.pMutipleSelection.nth(iIndexDesignation).innerText();

                            if(sCodeRayon == 'FL' || sCodeRayon == 'CC'){
                                if(sDesignation.includes(ville)){
                                    await fonction.clickAndWait(pageAutParam.pMutipleSelection.nth(iIndexDesignation), page);
                                    break;
                                }
                            }else{
                                var sText = sCodeRayon + ' ' + ville;
                                if(sDesignation.match(sText)){
                                    await fonction.clickAndWait(pageAutParam.pMutipleSelection.nth(iIndexDesignation), page);
                                    break;
                                }
                            }

                        }
           
                    }else{
                        log.set('CheckBox [MAGASIN][' + index + '] = "' + sCodeRayon + ' ' + ville + '" : ACTION ANNULEE');
                        test.skip();
                    }     
                })
            })

            test('Bouton [ENREGISTRER] - Click', async () => {       
                if(bAssortimentExiste){
                    await pageAutParam.pCheckBoxAllSelectMag.click();
                    await fonction.clickAndWait(pageAutParam.pButtonEnregistrer, page);  
                }else{
                    log.set('Bouton [ENREGISTRER] - Click: ACTION ANNULEE');
                    test.skip();
                }                                                              
            })

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                if(bAssortimentExiste){
                    await fonction.popinVisible(page, sNomPopin, false, 40000);
                }else{
                    log.set('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible: VERIFICATION ANNULEE');
                    test.skip();
                }
            })
        })
    })

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

})