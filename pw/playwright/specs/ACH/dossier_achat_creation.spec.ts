/**
 * @author Vazoumana DIARRASSOUBA
 * @since   2024-02-20
 * 
 */
const xRefTest      = "ACH_DOS_ADD";
const xDescription  = "Créer un dossier d'achat";
const xIdTest       =  254;
const xVersion      = '3.11';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : ['dossierAchat', 'responsable', 'rayon', 'E2E'],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { expect, test, type Page}   from '@playwright/test';

import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';

import { MenuAchats }               from '@pom/ACH/menu.page'; 
import { PageRefDosAch }            from '@pom/ACH/referentiel_dossiers-achats.page';

import { CartoucheInfo } 	        from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuAchats;
let pageRefDosAch       : PageRefDosAch;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

fonction.importJdd();

var  sNomDossierCap     = fonction.getLocalConfig('dossierAchat');              //-- En majuscule par défaut
sNomDossierCap          = fonction.capitalizeFirstLetter(sNomDossierCap);       //-- Minuscule sauf première lettre
const iNbEssais:number  = 50;                                                   //-- Nombre d'essais avant d'abandonner... 
const aRespExclus       = ['RECETTE1 Jcc', 'LUNETTES Kevin'];                   //-- Liste d'exclusion des Responsables admissibles

var sNomDossier         = fonction.getInitParam('dossierAchat', sNomDossierCap);         
var sNomResponsable     = fonction.getInitParam('responsable', 'lunettes');
const sRayon          	= fonction.getInitParam('rayon', 'Fruits et légumes');

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuAchats(page, fonction);
    pageRefDosAch       = new PageRefDosAch(page);
	const helper		= new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------  

test.describe.serial ('[' + xRefTest + ']', async () => {

    let oData = {
        sDossierAchat   : '',
        sNomResponsable : '',
        sBackUp         : process.env.E2E || undefined
    };

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [REFERENTIEL]', async () => {

        test ('ListBox [RAYON] = "' + sRayon + '"', async() => {
            await menu.selectRayonByName(sRayon, page);
        });

        var sPageName = 'referentiel';
        test ('Page [REFERENTIEL] - Click', async () => {
            await menu.click(sPageName, page);
        })

        test.describe ('Onglet [DOSSIERS D\'ACHAT]', async () => {

            var sNomOnglet = 'dossiersAchat';
            test ('Onglet [DOSSIERS D\'ACHAT]', async () => {
                await menu.clickOnglet(sPageName, sNomOnglet, page);
            })

            test ('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })

            var sNomPopin = 'Création d\'un dossier d\'achat';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test ('Button [CREER DOSSIER] - Click', async () => {
                    await fonction.clickAndWait(pageRefDosAch.buttonCreerDossier, page);
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomOnglet, true);
                })

                if (sNomResponsable === 'random') {

                    sNomDossier = 'Ta_Dossier Achat Random-' + fonction.getToday('us');

                    test ('InputField [NOM DOSSIER D\'ACHAT] = "' + sNomDossier + '"', async () => { 

                        test.setTimeout(600000);        //-- La recherche par ittédarions successives peut être long...

                        await fonction.sendKeys(pageRefDosAch.pInputNomDossier, sNomDossier, false, 'Nom Dossier Achat');
                        log.set('Nom du dossier d\'achat : ' + sNomDossier);

                        let bTrouve:boolean;
                        let iEssai:number       = 0
                        let iCandidat:number    = 0;

                        await fonction.clickAndWait(pageRefDosAch.pListBoxResponsable, page);               //-- On déplie la LB pour la chargéer
                        const iNbCandidats:number = await pageRefDosAch.pListBoxResponsableItem.count();    //-- et compter son nombre d'élements
                        const aResponsables = await pageRefDosAch.pListBoxResponsableItem.allTextContents() //-- On récupère la liste de tous les candidats                       

                        do {

                            bTrouve = false;
                            iEssai++;

                            //-- On évite de créer un dossier avec un nom de responsable "réervé" par un autre TA....
                            do {
                                iCandidat = Math.floor(fonction.random() * iNbCandidats);
                                sNomResponsable = aResponsables[iCandidat]; 
                            } while(aRespExclus.includes(sNomResponsable))

                            await fonction.clickElement(pageRefDosAch.pListBoxResponsableItem.nth(iCandidat));

                            log.set('Essai : ' + iEssai.toString() + '/' + iNbEssais.toString() + ' - Candidat : ' + sNomResponsable);
                            console.log('Essai : ' + iEssai.toString() + '/' + iNbEssais.toString() + ' - Candidat : ' + sNomResponsable);

                            //-- Spoumission du formulaire
                            await fonction.clickAndWait(pageRefDosAch.pButtonEnregistrerDossier, page);

                            //-- Apparition d'un message d'erreur ?
                            bTrouve = await pageRefDosAch.pFeedBackErrorDossier.isHidden();

                            if (!bTrouve) {
                                await fonction.clickElement(pageRefDosAch.pFeedBackErrorPictoClose);    //-- Fermeture du message d'avertissement
                                await fonction.clickAndWait(pageRefDosAch.pListBoxResponsable, page);   //-- Dépliage de la LB pour la prochaine sélection
                            }

                        } while(bTrouve == false && iEssai < iNbEssais)

                        if (iEssai >= iNbEssais) {
                            throw new Error('Ooops : Recherche infructueuse après ' + iNbEssais.toString() + ' essais.');
                        } else {
                            oData.sNomResponsable = sNomResponsable;
                            await fonction.addDataSheet('InputField', 'Nom Responsable', sNomResponsable);
                            log.set('Nom Responsable : ' + sNomResponsable);
                        }

                    })

                } else {

                    test ('InputField [NOM DOSSIER D\'ACHAT] = "' + sNomDossier + '"', async () => { 
                        await fonction.sendKeys(pageRefDosAch.pInputNomDossier, sNomDossier, false, 'Nom Dossier Achat');
                        log.set('Nom du dossier d\'achat : ' + sNomDossier);
                    })
    
                    test ('ListBox [RESPONSABLE] = "' + sNomResponsable + '"', async () => { 
                        await fonction.clickElement(pageRefDosAch.pListBoxResponsable);
                        await pageRefDosAch.pListBoxResponsableItem.filter({ hasText: sNomResponsable}).nth(0).click();
                    })
    
                    test ('Button [ENREGISTRER Dossier] - Click', async () => {
                        await fonction.clickAndWait(pageRefDosAch.pButtonEnregistrerDossier, page);
                        var alertIsVisible = await pageRefDosAch.pFeedBackErrorDossier.isVisible();
                        expect(alertIsVisible).toEqual(false)
                    })

                }

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })

            })
            
            test ('ListBox [DOSSIER D\'ACHAT] = "' + sNomDossier + '"', async () => { 
                await fonction.clickAndWait(pageRefDosAch.listBoxDossierAchat, page);
                const sDossierCible = fonction.capitalizeFirstLetter(sNomDossier);
                await fonction.listBoxByLabel(pageRefDosAch.listBoxDossierAchat, sDossierCible, page);
            })

            test ('DataGrid [VALUES] - Check Is Empty', async () => {
                const rowCount = await pageRefDosAch.dataGridDossierAchatElements.count();
                expect(rowCount).toEqual(0);
            })

            //Enregistrement des données pour le E2E
            oData.sDossierAchat     = sNomDossier;
            oData.sNomResponsable   = sNomResponsable;

            //console.log(oData);

            await fonction.writeData(oData);

        })

    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})
