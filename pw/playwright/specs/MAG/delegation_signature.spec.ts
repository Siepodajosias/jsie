/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 02 - 01 - 2024
 */

const xRefTest      = "MAG_ROL_DLG";
const xDescription  = "Délégation de Signature";
const xIdTest       =  4009;
const xVersion      = '3.4';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['profil'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}               from '@playwright/test';

import { TestFunctions }                from "@helpers/functions";
import { Log }                          from "@helpers/log";
import { Help }                         from '@helpers/helpers';

import { Credential }                   from '@conf/credential.conf';

import { MenuMagasin }                  from '@pom/MAG/menu.page';
import { AccueilCommandes }             from '@pom/MAG/accueil-commandes.page';

import { AutoComplete, CartoucheInfo }  from '@commun/types';

//-------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pageAccueil         : AccueilCommandes;

const log               = new Log();
const fonction          = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const sProfilDefaut     = 'lunettes';

const sProfil           = fonction.getInitParam('profil', 'jcc-recette2');

//---------------------------------------------------------------------------------------------

var oDatas = {
    aMenuUser1 : [],
    aMenuUser2 : [],
    aLieuxVenteUser1 : [],
    aLieuxVenteUser2 : [],
    aLieuxVenteUserPost2 : [],
};

var getMenu = function() {
    log.set('--------------- Info données ---------------');
    for (let key in oDatas) {
        if (oDatas.hasOwnProperty(key)) {
            let value = oDatas[key];
            log.set('| ' + key + ' :');
            log.set('| ' + value);
        }
    }     
};

var setDatas = function(key:string, value:string){
    oDatas[key].push(value);
};

//---------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page        = await browser.newPage(); 
    menu        = new MenuMagasin(page, fonction);
    pageAccueil = new AccueilCommandes(page);
})
 
test.afterAll(async ({}, testInfo) => {
    getMenu();
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    })

    test ('Ouverture URL', async() => {
        await fonction.openUrl(page);
    })

    test ('Connexion [User] = "' +sProfilDefaut + '" [1]', async () => {
        var GlobalData          = new Credential(sProfilDefaut);
        var infoProfil          = GlobalData.getData();
        fonction.setLogin(infoProfil.login);
        fonction.setPassword(infoProfil.password);
        await fonction.connexion(page);
        await fonction.addDataSheet('Profil', 'Profil', sProfilDefaut);
    })

    // Check USER 1
    test.describe ('Page [ACCUEIL]', async () => {

        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if(isVisible){

                await menu.removeArlerteMessage(page);
            }else{
                
                log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                test.skip();
            }
        })

        test ('Label [ERREUR][1] - Is Not Visible', async () => { // Pas d'erreur affichée à priori au chargement de l'onglet  
            await fonction.isErrorDisplayed(false, page);
        })

        test ('** Check MENU User 1 ' + sProfilDefaut + ' [1] **', async () => {
            var iNbMenu = await menu.menuInMenusItem.count();
            log.set('--------------- ** Check MENU User 1 ' + sProfilDefaut + ' ** ----------------------------');
            for(let iIndexMenu = 0; iIndexMenu < iNbMenu; iIndexMenu++){
               
                var sLibelleMenu = await menu.menuInMenusItem.nth(iIndexMenu).innerText();
                log.set('Menu [User1][' + (iIndexMenu + 1) +'] = ' + sLibelleMenu);
                setDatas('aMenuUser1', sLibelleMenu);
            }
            log.separateur();
        })

        test ('Link [USER][1] - Click', async () => {
            await fonction.clickElement(menu.listBoxUser);
        })

        var sNomPopin = "Délégation en mon absence";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + '][1]', function(){

            test ('Link [DELEGATION][1] - Click', async () => {
                await fonction.clickAndWait(menu.linkDelegation, page);
                await menu.removeArlerteMessage(page);
            })   

            test ('Popin [' + sNomPopin.toUpperCase() + '][1] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            })
                                         
            test ('Label [ERREUR][2] - Is Not Visible', async () => { // Pas d'erreur affichée au chargement de la page
                await fonction.isErrorDisplayed(false, page);
            })
      
            test ('** Check LISTE LIEUX DE VENTE User 1 ' + sProfilDefaut + '**', async () => { 
                var iNbLieuVente = await menu.pPdelegTdLieuxVentes.count();
                log.set('------ ** Check LISTE LIEUX DE VENTE User 1 ' + sProfilDefaut + ' [1] ** --------');
                for(let iIndexLV = 0; iIndexLV < iNbLieuVente; iIndexLV++){

                    var slieuDeVente = await menu.pPdelegTdLieuxVentes.nth(iIndexLV).innerText();
                    log.set('LieuVente[User1][' + (iIndexLV + 1) +'] = ' + slieuDeVente);
                    setDatas('aLieuxVenteUser1', slieuDeVente);
                }
                log.separateur();
            })

            test ('Link [ANNULER][1] - Click', async() => {
                await fonction.clickElement(menu.pPdelegLinkAnnuler);
            })

            test ('Popin [' + sNomPopin.toUpperCase() + '][1] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            })

        }) // End Popin

    })

    test ('Déconnexion [User] = "' +sProfilDefaut + ' [1]"', async () => {
        await fonction.deconnexion(page);
    })

     // Check USER 2
    test.describe ('Change [USER] = "'+sProfil+' [1]"', () => {
        
        test ('Connexion [User] = "' + sProfil + ' [1]"', async () => {
            var GlobalData          = new Credential(sProfil);
            var infoProfil          = GlobalData.getData();
        
            fonction.setLogin(infoProfil.login);
            fonction.setPassword(infoProfil.password);

            await fonction.connexion(page);
            await menu.removeArlerteMessage(page);
        })

        test ('** Check MENU User 2 ' + sProfil + '**', async () => {
            var iNbMenu = await menu.menuInMenusItem.count();
            log.set('----------------- ** Check MENU User 2 ' + sProfil + ' [1] ** ------------------------------');
            for(let iIndexMenu = 0; iIndexMenu < iNbMenu; iIndexMenu++){

                var sLibelleMenu = await menu.menuInMenusItem.nth(iIndexMenu).innerText();
                log.set('Menu [User2][' + (iIndexMenu + 1) +'] = ' + sLibelleMenu);
                setDatas('aMenuUser2', sLibelleMenu);
            }
            log.separateur();
        })

        test ('Link [USER][2] - Click', async () => {
            await fonction.clickElement(menu.listBoxUser);
        })

        var sNomPopin = "Délégation en mon absence";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + '][2]', function(){

            test ('Link [DELEGATION][2] - Click', async () => {
                await fonction.clickAndWait(menu.linkDelegation, page);
                await menu.removeArlerteMessage(page);
            })   

            test ('Popin [' + sNomPopin.toUpperCase() + '][2] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            })
                                         
            test ('Label [ERREUR][3] - Is Not Visible', async () => { // Pas d'erreur affichée au chargement de la page
                await fonction.isErrorDisplayed(false, page);
            })
      
            test ('** Check LISTE LIEUX DE VENTE User 2 ' + sProfil + ' [1]**', async () => { 
                var iNbLieuVente = await menu.pPdelegTdLieuxVentes.count();
                log.set('----------------- ** Check LISTE LIEUX DE VENTE 2 ' + sProfil + ' [1] ** ------------------------------');
                for(let iIndexLV = 0; iIndexLV < iNbLieuVente; iIndexLV++){

                    var slieuDeVente = await menu.pPdelegTdLieuxVentes.nth(iIndexLV).innerText();
                    log.set('LieuVente[User2][' + iIndexLV + 1 +'] = ' + slieuDeVente);
                    setDatas('aLieuxVenteUser2', slieuDeVente);
                }
                log.separateur();
            })

            test ('Link [ANNULER][2] - Click', async() => {
                await fonction.clickElement(menu.pPdelegLinkAnnuler);
            })

            test ('Popin [' + sNomPopin.toUpperCase() + '][2] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            })

        }) // End Popin
    })

    test ('Déconnexion [User] = "' +sProfil + '" [1]', async () => {
        await fonction.deconnexion(page);
    })

    // Affectation USER 1 -> USER 2
    test.describe ('Change [USER] = "'+sProfilDefaut+'" [2]', () => {   

        test ('Connexion [User] = "' + sProfilDefaut + '" [2]', async () => {
            var GlobalData  = new Credential(sProfilDefaut);
            var infoProfil  = GlobalData.getData();
            fonction.setLogin(infoProfil.login);
            fonction.setPassword(infoProfil.password);
            await fonction.connexion(page);
            await menu.removeArlerteMessage(page);
        })

        test ('Link [USER][3] - Click', async () => {
            await fonction.clickElement(menu.listBoxUser);
        })

        var sNomPopin = "Délégation en mon absence";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + '][3]', function(){

            test ('Link [DELEGATION][3] - Click', async () => {
                await fonction.clickAndWait(menu.linkDelegation, page);
                await menu.removeArlerteMessage(page);
            })   

            test ('Popin [' + sNomPopin.toUpperCase() + '][3] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            })

            test ('Label [ERREUR][4] - Is Not Visible', async () => { // Pas d'erreur affichée au chargement de la page
                await fonction.isErrorDisplayed(false, page);
            })

            test ('CheckBox [ALL] - Click', async () => {
                await fonction.clickElement(menu.pPdelegCheckBoxAllDeleg);
            })

            test ('InputField [AUTOCOMPLETE][DELEGUE A] = "' + sProfil + '"', async () => {
                    
                var oData:AutoComplete = {
                    libelle         :'ARTICLE',
                    inputLocator    : menu.pPdelegInputUser,
                    inputValue      : sProfil,
                    choiceSelector  :'li.gfit-autocomplete-result',
                    choicePosition  : 0,
                    typingDelay     : 100,
                    waitBefore      : 500,
                    page            : page,
                };
                await fonction.autoComplete(oData);
            })

            test ('Button [ + ] - Click', async() => {
                await fonction.clickElement(menu.pPdelegButtonPlus);
            })

            test ('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(menu.pPdelegButtonEnregist, page);
            })

            test ('Label [ERREUR][5] - Is Not Visible', async () => { // Pas d'erreur affichée à l'enregistrement  
                await fonction.isErrorDisplayed(false, page);
            })                               

            test ('** Wait Until Spinner Off **', async () => {
                await fonction.waitForSpinner(pageAccueil.pPspinner);
            }); 

            test ('Popin [' + sNomPopin.toUpperCase() + '][3] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            })

        })

        // Nouvel appel pour vérifier qu'il n'y est pas d'erreur 9999 (Cf. EQA 5704)
        test ('Link [USER][4] - Click', async () => {
            await fonction.clickElement(menu.listBoxUser);
        })

        var sNomPopin = "Délégation en mon absence";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + '][4]', async () => {

            test ('Link [DELEGATION][4] - Click', async () => {
                await fonction.clickAndWait(menu.linkDelegation, page);
                await menu.removeArlerteMessage(page);
            })   

            test ('Popin [' + sNomPopin.toUpperCase() + '][4] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            })

            test ('Label [ERREUR][6] - Is Not Visible', async () => { // Pas d'erreur affichée au chargement de la page
                await fonction.isErrorDisplayed(false, page);
            })

            test ('Link [ANNULER][3] - Click', async () => {
                await fonction.clickElement(menu.pPdelegLinkAnnuler);
            })

            test ('Popin [' + sNomPopin.toUpperCase() + '][4] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            })

        })

    })

    test ('Déconnexion [User] = "' +sProfilDefaut + '" [2]', async () => {
        await fonction.deconnexion(page);
    })

    // Check USER 2 avec nouveaux LDV
    test.describe ('Change [USER] = "'+sProfil+'" [2]', () => {
    
        test ('Connexion [User] = "' + sProfil + ' [2]"', async () => {     
            var GlobalData = new Credential(sProfil);
            var infoProfil = GlobalData.getData();
            fonction.setLogin(sProfil);
            fonction.setPassword(infoProfil.password);
            await fonction.connexion(page);
            await menu.removeArlerteMessage(page);
        })
 
        test ('Link [USER][5] - Click', async () => {
            await fonction.clickElement(menu.listBoxUser);
        })

        var sNomPopin = "Délégation en mon absence";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + '][5]', function(){

            test ('Link [DELEGATION][3] - Click', async () => {
                await fonction.clickAndWait(menu.linkDelegation, page);
                await menu.removeArlerteMessage(page);
            })   

            test ('Popin [' + sNomPopin.toUpperCase() + '][5] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            })

            test ('Label [ERREUR][7] - Is Not Visible', async () => { // Pas d'erreur affichée au chargement de la page
                await fonction.isErrorDisplayed(false, page);
            })

            test ('** Check LISTE LIEUX DE VENTE User 2' + sProfil + ' [2] **', async () => {
                var iNbLieuVente = await menu.pPdelegTdLieuxVentes.count();
                log.set('--------------- ** Check MENU User [2] ' + sProfilDefaut + ' [2] ** ----------------------------');
                for(let iIndexLV = 0; iIndexLV < iNbLieuVente; iIndexLV++){

                    var slieuDeVente = await menu.pPdelegTdLieuxVentes.nth(iIndexLV).innerText();
                    log.set('LieuVente[User2][' + (iIndexLV + 1) +'] = ' + slieuDeVente);
                    setDatas('aLieuxVenteUserPost2', slieuDeVente);
                }
                log.separateur();
            })

            test ('Link [ANNULER][4] - Click', async() => {
                await fonction.clickElement(menu.pPdelegLinkAnnuler);
            })

            test ('Popin [' + sNomPopin.toUpperCase() + '][5] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            })

        })

    })

    test ('Déconnexion [User] = "' +sProfil + '" [2]', async () => {
        await fonction.deconnexion(page);
    })

})