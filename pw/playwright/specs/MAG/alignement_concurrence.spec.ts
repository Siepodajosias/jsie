/**
 * 
 * @author JC CALVIERA
 *  Since 2024-04-09
 */

const xRefTest      = "MAG_PRI_CON";
const xDescription  = "Effectuer une concurence";
const xIdTest       =  299;
const xVersion      = '3.6';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['ville','groupeArticle', 'listeArticles', 'codeMagasin'],
    fileName    : __filename
};

//-------------------------------------------------------------------------------------

import { test, expect, type Page }          from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';
import { EsbFunctions }             from '@helpers/esb';
import { JddFile }                  from '@helpers/file';

import { MenuMagasin }              from '@pom/MAG/menu.page';
import { PrixGestion }              from '@pom/MAG/prix-gestion.page';
import { AutorisationsPrixLocaux }  from '@pom/MAG/autorisations-prix_locaux.page';

import { AutoComplete, CartoucheInfo, TypeEsb }   from '@commun/types';

//-------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pagePrix            : PrixGestion;
let pageAutoPrixLocaux  : AutorisationsPrixLocaux;
let esb                 : EsbFunctions;
let jddFile             : JddFile;

const log               = new Log();
const fonction          = new TestFunctions(log);

//-----------------------------------------------------------------------------------------

var sNomVille               = fonction.getInitParam('ville', 'Tours (G182)');
const sGroupeArticle        = fonction.getInitParam('groupeArticle', 'Marée'); 
const aArticle              = fonction.getInitParam('listeArticles', 'M020,M022'); 
const sCodeMagasin          = fonction.getInitParam('codeMagasin','GF182PO');
const sJddFile              = fonction.getGlobalConfig('jddAlignementConcu');
const sNomEnseigne          = 'TA_align-concurrence Enseigne ' + sGroupeArticle + ' ' + aArticle + ' ' + fonction.getToday();
const sRoleResponsableRayon = 'RESPONSABLE RAYON';
const aCodeArticle          = aArticle.split(',');

var oData = {
    aPvcCentrale :{},
    aNouveauPrix :{},
    codeMagasin  : sCodeMagasin
}

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage(); 
    menu                = new MenuMagasin(page, fonction);
    pagePrix            = new PrixGestion(page);
    pageAutoPrixLocaux  = new AutorisationsPrixLocaux(page);
    esb                 = new EsbFunctions(fonction);
    jddFile             = new JddFile(testInfo);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

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
    })

    test.describe ('Page [AUTORISATIONS]', async () => { 

        //-- Message d'avertissement (Check Browser) spécifique à l'application SIGALE Magasin
        //-- Click sur le lien de confirmation pour faire disparaître le message d'alerte
        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            var isVisible   = await menu.linkBrowserSecurity.isVisible();
            if (isVisible) {
               var isActive = await menu.linkBrowserSecurity.isEnabled();
               if(isActive){
                   await menu.linkBrowserSecurity.click();
               }
            }
        })
       
        test ('Popin [ALERT][ACCUEIL] - Click', async () => {
            await fonction.wait(page,500);
            await menu.removeArlerteMessage(page);
            await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de l'onglet
        })

		var pageName:string = 'autorisations';   

		test ('Page [AUTORISATIONS] - Click', async () => {
			await menu.click(pageName, page);
		})

        test.describe ('Onglet [PRIX LOCAUX]', async () => {        
	 
            test ('Onglet [PRIX LOCAUX] - Click', async () => {
                await menu.clickOnglet(pageName, 'prixLocaux', page);
            }) 
    
            test ('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 
    
            test ('InputField [CODE / DESIGNATION] = "' + sCodeMagasin + '" - Check', async () => { //sCodeMagasin
                await fonction.sendKeys(pageAutoPrixLocaux.inputCodeDesignMagasin,sCodeMagasin, false, 'Code magasin');
                await fonction.wait(page, 500);
            })

            test ('Tr [MAGASIN][0] - Click', async () => {
                await fonction.clickElement(pageAutoPrixLocaux.trListeMagasin);
            })

            test ('CheckBox [ALIGNEMENT CONCURRENCE] - Check', async () => {
                if(await pageAutoPrixLocaux.checkBoxAuthAlignConc.isChecked()) {
                    log.set('Alignement concurrence déjà autorisé')
                } else {
                    await fonction.clickElement(pageAutoPrixLocaux.checkBoxAuthAlignConc);
                    await fonction.clickAndWait(pageAutoPrixLocaux.buttonEnregistrer, page);
                }
            })

        }) // Onglet PRIX LOCAUX 
    
    })

    test ('Changement Profil [' + sRoleResponsableRayon + ']', async ()=>{
        await fonction.changeProfilByRole(info.appli, sRoleResponsableRayon, page);
    })

    test.describe ('Page [PRIX]', async () => {

        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            await menu.pPopinAlerteSanitaire.isVisible().then(async (isVisible) => {
                if(isVisible){
                    await menu.removeArlerteMessage(page);
                }else{
                    log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                    test.skip();
                }
            })
        })

        var sNomPage:string = 'prix';

        test ('Page [PRIX] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 

        test ('ListBox [LIEU DE VENTE] = "' + sNomVille + '"', async () => {
            await menu.selectVille(sNomVille, page);
        })
        
        test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        }) 

        //--Selection d'un groupe magasin;
        test ('ListBox [GROUPE] = "' + sGroupeArticle + '"', async() => {
            await pagePrix.listBoxGrpArticle.selectOption(sGroupeArticle);
        })

        test ('Td [CODE ARTICLE] #1 - Check', async() => {
            await fonction.wait(page, 500); // Attendre que le filtre s'applique;
            expect(await pagePrix.tdCodeArticle.count()).toBeGreaterThan(0);
        })

        test ('Td [PVC MAGASIN] #1 - Check', async() => {
            expect(await pagePrix.tdCodeArticle.first().textContent()).not.toBeNull();
        })

        test ('Td [MAJ PRIX CENTRAL] #1 - Check', async() => {
            expect(await pagePrix.tdDateMajPrixCentral.first().textContent()).not.toBeNull();
        })
        
        test ('Button [CONCURRENCE] - Click', async () => {
            await fonction.clickAndWait(pagePrix.buttonConcurrence, page);
        })

        var sNomPopin:string = 'CHANGEMENT DE PRIX DE TYPE CONCURRENCE';
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

            let rNouveauPrix:number;

            test ('Popin [' + sNomPopin + '] - Is Visible', async () =>  {
                await fonction.popinVisible(page, sNomPopin, true);
            })

            test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la popin
                await fonction.isErrorDisplayed(false, page);
            })

            const sMessage:string = 'Pour tout changement de prix à la hausse, aucun autre changement de prix sur cet article ne pourra être effectué pendant 30min.';
            test ('Label [INFOS HAUSSE PRIX] - Check', async() => {
                expect((await pagePrix.pPlabelInfosHausPrix.textContent()).trim()).toBe(sMessage);
            })

            test ('InputField [ENSEIGNE CONCURRENTE] = "' + sNomEnseigne + '"', async () => {
                await fonction.sendKeys(pagePrix.pPinputNomEnseigne, sNomEnseigne, false, 'Enseigne');
            })

            aCodeArticle.forEach((sArticle:string, index:number) => {
                
                test ('InputField [ARTICLE]['+ sArticle +'] = "1"', async () => {
                    var oData:AutoComplete = {
                        libelle         :'ARTICLE',
                        inputLocator    : pagePrix.pPinputArticle,
                        inputValue      : sArticle,
                        selectRandom    : true,
                        typingDelay     : 100,
                        waitBefore      : 500,
                        page            : page
                    };

                    await fonction.autoComplete(oData);
                })
    
                test ('Button [ + ]['+ sArticle +'] - Click', async () => {
                    await fonction.clickAndWait(pagePrix.pPbuttonPlus, page);
                    if (await pagePrix.pPoffreMessageErreur.isVisible()) {
                        log.set('Message erreur : ' + await pagePrix.pPoffreMessageErreur.textContent());
                    }
                })

                test ('CheckBox [ARTICLE]['+ sArticle +'] - Is Checked', async () => {
                    expect(pagePrix.pPdataGridArticle.nth(index)).toHaveClass('selectionne');
                })
    
                test ('Td [CODE ARTICLE['+ sArticle +'] - Check', async () => {
                    expect(await pagePrix.pPtdCodeArticle.nth(index).textContent()).toBe(sArticle);
                })
    
                test ('Input [PVC CENTRAL]['+ sArticle +'] - Check', async () => {
                    expect(await pagePrix.pPinputPvcCentrale.inputValue()).not.toBeNull();
                    oData.aPvcCentrale[sArticle] = await pagePrix.pPinputPvcCentrale.inputValue();
                })
    
                test ('InputField [NOUVEAU PVC]['+ sArticle +'] = "PVC Centrale - 0.01 €"', async() => {
                    await pagePrix.pPinputNouveauPvc.waitFor();
                    const rAncienPrix = await pagePrix.pPinputPvcCentrale.inputValue();
                    rNouveauPrix = parseFloat(rAncienPrix.replace(',', '.')) - 0.01;
                    await fonction.sendKeys(pagePrix.pPinputNouveauPvc, rNouveauPrix.toFixed(2), false, 'Pvc central');
                    oData.aNouveauPrix[sArticle] = rNouveauPrix.toFixed(2);
                })
    
                test ('Textarea [QUALITE]['+ sArticle +'] = "' + sNomEnseigne + '"', async() => {
                    await fonction.sendKeys(pagePrix.pPinputQualite, sNomEnseigne, false, 'Enseigne');    
                })
    
                test ('InputField [PVC ENSEIGNE]['+ sArticle +'] = "PVC Centrale - 0.01 €"', async() => {
                    await pagePrix.pPinputPvcEnseigne.waitFor();
                    await fonction.sendKeys(pagePrix.pPinputPvcEnseigne, rNouveauPrix.toFixed(2), false, 'Pvc enseigne');
                })
            });

            test ('JDD [ALIGNEMENT CONCURRENCE] - Save', async () => {
                //-- On mémorise les données;
                jddFile.debug(true);
                jddFile.writeJson(sJddFile, oData);
            })
         
            test ('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pagePrix.pPbuttonEnregistrer, page);
            })

            test ('Popin [' + sNomPopin + '] - Is Not Visible', async () =>  {
                await fonction.popinVisible(page, sNomPopin, false);
            })
        }); //-- Popin

        aCodeArticle.forEach((sCodeArticle:string) => {

            test ('InputField [ARTICLE] = "' + sCodeArticle + '"', async () => {
                await fonction.sendKeys(pagePrix.inputArticle, sCodeArticle, false, 'Code article');
                await fonction.wait(page,500);
            })

            test ('Td [PVC MAGASIN][' + sCodeArticle + '] - Check', async () => {
                expect(await pagePrix.tdPvcMagasin.textContent()).toBe(oData.aNouveauPrix[sCodeArticle].replace('.', ','));
            })

            test ('Td [PRIX UNITAIRE CENTRALE][' + sCodeArticle + '] - Check', async () => {
                expect(await pagePrix.tdPvcCentral.textContent()).toBe(oData.aPvcCentrale[sCodeArticle]);
            })
        })

    }); //-- Page

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})

    test ('** CHECK FLUX **', async () => {

        var oFlux:TypeEsb = { 
            "FLUX" : [
                {
                        NOM_FLUX    : "Diffuser_TarifMagasin",
                        TITRE       : /Tarif du*/
                },                      
                {
                        NOM_FLUX    : "EnvoyerTarif_Mag",
                        TITRE       : /Tarif du*/
                },                      
                {
                        NOM_FLUX    : "EnvoyerTarifMagasin_Prefac",
                        TITRE       : /Tarif du*/
                },                      
                {
                        NOM_FLUX    : "Envoyer_Mail",
                        TITRE       : /Sujet : Demande d'alignement du magasin*/
                },                      
                {
                        NOM_FLUX    : "EnvoyerTarifMagasin_Relais",
                        TITRE       : /Tarif du*/
                },                      
            ],
            WAIT_BEFORE  : 2000,               
            VERBOSE_MOD  : false,
            STOP_ON_FAILURE : false,
        };

        await esb.checkFlux(oFlux, page);

     })
     
})
