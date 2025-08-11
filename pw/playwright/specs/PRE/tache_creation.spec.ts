/**
 * 
 * @author JC CALVIERA
 * @since 2024-01-29
 * 
 */

const xRefTest      = "PRE_TAC_ADD";
const xDescription  = "Création d'une tâche";
const xIdTest       =  331;
const xVersion      = '3.4';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRE',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }              from '@playwright/test';

import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';

import { MenuPreparation }              from '@pom/PRE/menu.page';
import { AurtresTacheDuJourPage }       from '@pom/PRE/travaux-taches_jour.page';

import { AutoComplete, CartoucheInfo }  from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuPreparation;
let pageTravaux         : AurtresTacheDuJourPage;

//------------------------------------------------------------------------------------

const log               = new Log();
const fonction          = new TestFunctions(log);

const iDateRange        = 17;       // Range 00:00 - 18:00
const sCommentaire      = 'TA_commentaire-' + fonction.getToday();
const iHeureStart       = Math.floor(fonction.random() * iDateRange);
const iHeureEnd         = fonction.addZero(iHeureStart + Math.floor(fonction.random() * 5) +1 );
const iMinuteStart      = fonction.addZero(Math.floor(fonction.random() * 59));
const iMinuteEnd        = fonction.addZero(Math.floor(fonction.random() * 59));
const sLettre           = fonction.getRandomLetter();

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page        = await browser.newPage();
    menu        = new MenuPreparation(page, fonction);
    pageTravaux = new AurtresTacheDuJourPage(page);
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']' , () => {
    
    test ('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper    = new Help(info, testInfo, page);
        await helper.init();
    })

    test ('Ouverture URL', async() => {
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [AUTRES TRAVAUX]', async () => {   

        var sNomPage = 'travaux';
        test ('Page [AUTRES TRAVAUX] - Click', async () => {
            await menu.click(sNomPage, page);
        })
        
        test ('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);
        }) 

        var sNomPopin = 'CREER UNE TACHE';
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {
                
            test ('Button [CREER UNE TACHE]- Click', async () => {
                await fonction.clickElement(pageTravaux.buttonTacheAdd);
            }); 
            
            test ('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 

            test ('InputField [PREPARATEUR] = rnd', async () => {
                var oData:AutoComplete = {
                    libelle         :'PREPARATEUR',
                    inputLocator    : pageTravaux.pInputPrepareteur,
                    inputValue      : sLettre,
                    choiceSelector  :'li.p-autocomplete-item',
                    choicePosition  : 0,
                    typingDelay     : 100,
                    waitBefore      : 500,
                    page            : page,
                };
                const sNomPreparateur = await fonction.autoComplete(oData);
                log.set('Préparateur : ' + sNomPreparateur);
            })

            test ('ListBox [TACHE] = "rnd"', async () => { 
                await fonction.selectRandomListBoxLi(pageTravaux.pListBoxTache, false, page);
            })

            test ('Input [HEURE DEBUT] = rnd', async () => {
                await fonction.sendKeys(pageTravaux.pInputHeureDebut, fonction.addZero(iHeureStart), false, 'Heure Début');
            })

            test ('Input [MINUTE DEBUT] = rnd', async () => {
                await fonction.sendKeys(pageTravaux.pInputMinuteDebut, iMinuteStart, false, 'Minute Début');
                log.set('Heure début : ' + iHeureStart + ':' + iMinuteStart);
            })

            test ('Input [HEURE FIN] = rnd', async () => {
                await fonction.sendKeys(pageTravaux.pInputHeureFin, iHeureEnd, false, 'Heure Fin');
            })

            test ('Input [MINUTE FIN] = rnd', async () => {
                await fonction.sendKeys(pageTravaux.pInputMinuteFin, iMinuteEnd, false, 'Minute Fin');
                log.set('Heure début : ' + iHeureEnd + ':' + iMinuteEnd);
            })

            test ('Input [COMMENTAIRE] = "' + sCommentaire + '"', async () => {
                await fonction.sendKeys(pageTravaux.pTextAreaCommentaire, sCommentaire, false, 'Commentaire');
            })

            test ('Button [ENREGISTRER]- Click', async () => {
                await fonction.clickAndWait(pageTravaux.pButtonEnregistrer, page);
            })

        }); //-- End Popin

    }); //-- End Describe Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

});   