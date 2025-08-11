/**
 * 
 * @description Ajouter un label possible sur un article
 * 
 * @author JOSIAS SIE
 *  Since 2025-02-12
 */

const xRefTest      = "NOM_CAR_LAB";
const xDescription  = "Ajouter un label possible sur un article";
const xIdTest       =  9797;
const xVersion      = '3.6';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'NOMEMCLATURE',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['codeArticle', 'groupeArticle', 'label', 'caracteristique'],
    fileName    : __filename
}

//----------------------------------------------------------------------------------------

import { test, type Page, expect }             from '@playwright/test';

import { TestFunctions }                       from "@helpers/functions";
import { Log }                                 from "@helpers/log";
import { EsbFunctions }                        from "@helpers/esb";
import { Help }                                from '@helpers/helpers';

import { MenuNomenclature }                    from "@pom/NOM/menu.page";
import { Caracteristique }                     from '@pom/NOM/caracteristiques.page';
import { GroupeArticle }                       from '@pom/NOM/groupe-article.page';
import { Article }                             from "@pom/NOM/articles.page";

import { AutoComplete, CartoucheInfo, TypeEsb }from '@commun/types';

//----------------------------------------------------------------------------------------

let page           : Page;
let menu           : MenuNomenclature;
let pageArticle    : Article;
let pageGpArticle  : GroupeArticle;
let pageCaracterist: Caracteristique;
let esb            : EsbFunctions;

let sLibelle       : string|null;

const log          = new Log();
const fonction     = new TestFunctions(log);

//----------------------------------------------------------------------------------------
const sCodeArticle   = fonction.getInitParam('codeArticle','5070');
const sGroupeArticle = fonction.getInitParam('groupeArticle','Fruits et légumes');
const sLabel         = fonction.getInitParam('label','TA_caracteristique. ');
const sCaracteristque= fonction.getInitParam('caracteristique', 'TA_caracteristique. ' +fonction.getToday('FR'));
//----------------------------------------------------------------------------------------
const sCode          = 'TA_CODE_' + fonction.getToday('FR');
const sDesignation   = 'TA_designation_' + fonction.getToday('FR');
//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page           = await browser.newPage(); 
    esb            = new EsbFunctions(fonction);
    menu           = new MenuNomenclature(page, fonction);
    pageGpArticle  = new GroupeArticle(page);
    pageCaracterist= new Caracteristique(page);
    pageArticle    = new Article(page);
    const helper   = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']' , () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [CARACTERISTIQUE]', async () => {    

        var currentPage:string = 'caracteristiques';

        test ('Page [CARACTERISTIQUE] - Click', async () => {
            await menu.click(currentPage, page); 
        })              
        
        test ('InputField [DESIGNATION] = "' + sLabel + '"', async () => {
            await fonction.sendKeys(pageCaracterist.inputSearchDesignation, sLabel, false,'Label');
            await fonction.wait(page,250);
        })

        test ('Tr [CARACTERISTIQUE] >= 2', async () => {
            expect(await pageCaracterist.trCaracteristique.count()).toBeGreaterThanOrEqual(2);
        })

        test ('Tr [CARACTERISTIQUE][LABEL POSSIBLE] - Click', async () => {
            await fonction.clickAndWait(pageCaracterist.trCaracteristique.locator('.col-designation').filter({hasText: sCaracteristque}), page);
        })

        test ('Input [CODE] = "' + sCode + '"', async () => {
            await fonction.sendKeys(pageCaracterist.inputCode, sCode, false, 'Code');
            await fonction.wait(page, 250);
            log.set('Code : ' + sCode);
        })

        test ('Input [DESIGNATION] = "' + sDesignation + '"', async () => {
            await fonction.sendKeys(pageCaracterist.inputDesignation, sDesignation, false, 'Désignation');
            await fonction.wait(page, 250);
            log.set('Désignation : ' + sDesignation);
        })

        test ('Button [ + ] - Click', async () => {
            await fonction.clickAndWait(pageCaracterist.buttonPlus, page);
        })

        test.describe ('DataGrid [VALEURS]', async () => {           

            test ('InputField [CODE][DESIGNATION] = "' + sCode + '"', async () => {
                await fonction.sendKeys(pageCaracterist.inputCodeDesignation, sCode, false, 'Code');
                await fonction.waitForDomStable(page);
            })

            test ('Td [CODE] = "' + sCode + '"', async () => {
                expect(await pageCaracterist.tdCode.textContent()).toEqual(sCode);
            })

            test ('Td [DESIGNATION] = "' + sDesignation + '"', async () => {
                expect(await pageCaracterist.tdDesignation.textContent()).toEqual(sDesignation);
            })

        })

    })

    test.describe ('Page [GROUPE ARTICLE]', async () => {    

        var currentPage:string = 'groupeArticle';
        var bAlreadyCreated:boolean = false;

        test ('Page [ARTICLE] - Click', async () => {
            await menu.click(currentPage, page); 
        })              
        
        test ('Li [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
            await fonction.clickAndWait(pageGpArticle.nodeGroupesArticle.locator('span.p-treenode-label').filter({hasText: sGroupeArticle}), page);
        })

        test ('DataGrid [CARACTERISTIQUE] - Is Visible', async () => {
            await fonction.isDisplayed(pageGpArticle.dataGridCaracteristique);
            bAlreadyCreated = await pageGpArticle.tdCaracteristique.filter({hasText: sCaracteristque}).isVisible();
        })

        test ('InputField [CARACTERISTIQUE] = "' + sCaracteristque + '"', async () => {
            if (bAlreadyCreated === false) {
                var oData:AutoComplete = {
                    libelle         :'CARACTERISTIQUE',
                    inputLocator    : pageGpArticle.inputAssocierCarac,
                    inputValue      : sCaracteristque,
                    choiceSelector  :'.input button.dropdown-item',
                    choicePosition  : 0,
                    typingDelay     : 100,
                    waitBefore      : 500,
                    page            : page,
                }
                await fonction.autoComplete(oData);
            } else {
                log.set('Caracteristique "'+sCaracteristque+'" déjà présente. Création ignorée');
                test.skip();
            }
        })

        test ('Button [ + ] - Click', async () => {
            if (bAlreadyCreated === false) {
                await fonction.clickAndWait(pageGpArticle.buttonPlus, page);
            } else {
                test.skip();
            }
        })

        test ('InputField [CARACTERISTIQUE] #2 = "' + sCaracteristque + '"', async () => {
            if (bAlreadyCreated === false) {
                await fonction.sendKeys(pageGpArticle.inputCaracteristique, sCaracteristque, false, sCaracteristque);
                await fonction.waitForDomStable(page);
            } else {
                test.skip();
            }
        })

        test ('Td [CARACTERISTIQUE] = "' + sCaracteristque + '"', async () => {
            await expect(pageGpArticle.tdCaracteristique.filter({hasText: sCaracteristque})).toBeVisible();
        })

    })

    test.describe ('Page [ARTICLE]', async () => {    

        var currentPage:string  = 'articles';

        test ('Page [ARTICLE] - Click', async () => {
            await menu.click(currentPage, page); 
        })              
        
        test ('InputField [ARTICLE] = "' + sCodeArticle + '"', async () => {
            var oData:AutoComplete = {
                libelle         :'ARTICLE',
                inputLocator    : pageArticle.inputArticle,
                inputValue      : sCodeArticle,
                choiceSelector  :'button.dropdown-item.ng-star-inserted',
                choicePosition  : 0,
                typingDelay     : 100,
                waitBefore      : 500,
                page            : page,
            }
            await fonction.autoComplete(oData);
        })

        test ('Button [RECHERCHER] - Click', async () => {
            await fonction.clickAndWait(pageArticle.buttonRechercher, page);
        })

        test ('CheckBox [ARTICLE][0] - Click', async () => {
            await fonction.clickElement(pageArticle.tdListeResultats.first());
            sLibelle = sCodeArticle + ' - ' + await pageArticle.tdListeResultats.first().textContent();
            log.set('Nom article : ' + sLibelle);
        })

        test ('Button [MODIFIER] - Click', async () => {
            await fonction.clickAndWait(pageArticle.buttonModifier, page);
        })

        var sNomPopin:string = "Modification de l'article " + sCodeArticle;
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {          

            var sValeur:any;
            var sDate:any;
            var sNbrDay:any;
            var sToDay:any;
            var sDay:any;

            test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            })

            test.describe('Rubrique [LABEL POSSIBLE]', async () => {

                test ('InputField [CARACTERISTIQUE] = "' + sCaracteristque + '"', async () => {
                    await fonction.sendKeys(pageArticle.pPmodifArtInputGlobFilt, sCaracteristque, false, 'Caracteristique');
                    await fonction.waitForDomStable(page);
                    sValeur= await pageArticle.pModifInputValeurArticle.inputValue();
                    sDate  = fonction.getToday('FR');

                    sNbrDay= sValeur.slice(-8);
                    sToDay = sNbrDay.slice(0, 2);
                    sDay   = sDate.slice(0, 2);
                })
    
                test ('Button [VALEUR] - Click', async () => {
                    if(sValeur == '' || parseInt(sToDay) < parseInt(sDay)){
                       await fonction.clickAndWait(pageArticle.pPmodifArtButtonValArt, page);
                    }
                })

                test ('CheckBox [ALL] - Click', async () => {
                    if(sValeur == '' || parseInt(sToDay) < parseInt(sDay)){
                        var iNbr = await pageArticle.pPmodifArtButtonValArt.count();
                        if(iNbr > 0){
                            await fonction.clickAndWait(pageArticle.pModifArtRadioButtonAll, page);
                            await fonction.clickAndWait(pageArticle.pModifArtRadioButtonAll, page);
                        }
                    }
                })

                test ('InputField [CODE] = "' + sCode + '"', async () => {
                    if(sValeur == '' || parseInt(sToDay) < parseInt(sDay)){
                        await pageArticle.pInputFieldRechercher.pressSequentially(sCode);
                        await fonction.waitForDomStable(page);
                    }
                })
    
                test ('RadioButton [DESIGNATION] - Click', async () => {
                    if(sValeur == '' || parseInt(sToDay) < parseInt(sDay)){
                        await fonction.clickElement(pageArticle.pModifArtRadioButton);
                        await fonction.waitForDomStable(page);
                    }
                })
    
                test ('Button [OK] - Click', async () => {
                    if(sValeur == '' || parseInt(sToDay) < parseInt(sDay)){
                       await fonction.clickAndWait(pageArticle.pPmodifArtButtonOk, page);
                    }
                })

            })

            test.describe ('Rubrique [LABEL QUALITE]', async () => {

                test ('Button [CLEAR] - Click',async () => {
                    await fonction.clickElement(pageArticle.pPmodifClear);
                })

                test ('InputField [CARACTERISTIQUE] = "Label qualite"', async () => {
                    await fonction.sendKeys(pageArticle.pPmodifArtInputGlobFilt, 'Label qualite', false, 'Caracteristique');
                    await fonction.waitForDomStable(page);
                    sValeur= await pageArticle.pModifInputValeurArticle.inputValue();
                    sDate  = fonction.getToday('FR');

                    sNbrDay= sValeur.slice(-8);
                    sToDay = sNbrDay.slice(0, 2);
                    sDay   = sDate.slice(0, 2);
                })
    
                test ('Button [VALEUR] - Click', async () => {
                    if(sValeur == '' || parseInt(sToDay) < parseInt(sDay)){
                       await fonction.clickAndWait(pageArticle.pPmodifArtButtonValArt, page);
                    }
                })
        
                test ('CheckBox [ALL] - Click', async () => {
                    if(sValeur == '' || parseInt(sToDay) < parseInt(sDay)){
                        var iNbr = await pageArticle.pPmodifArtButtonValArt.count();
                        if(iNbr > 0){
                            await fonction.clickAndWait(pageArticle.pModifArtRadioButtonAll, page);
                            await fonction.clickAndWait(pageArticle.pModifArtRadioButtonAll, page);
                        }
                    }
                })

                test ('RadioButton [DESIGNATION]][0] - Click', async () => {
                    if(sValeur == '' || parseInt(sToDay) < parseInt(sDay)){
                        await fonction.clickElement(pageArticle.pModifArtRadioButton.first());
                        await fonction.wait(page, 250);
                    }
                })
    
                test ('Button [OK] - Click', async () => {
                    if(sValeur == '' || parseInt(sToDay) < parseInt(sDay)){
                        await fonction.clickAndWait(pageArticle.pPmodifArtButtonOk, page);
                    }
                })
            })

            test ('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageArticle.pPmodifArtButtonEnreg, page);
            })

            test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            })

        })

    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

    test ('** CHECK FLUX **', async () =>  {
        const oFlux:TypeEsb = { 
            FLUX : [
                {
                    NOM_FLUX    : "Diffuser_Article"
                } 
            ],
            WAIT_BEFORE     : 10000, // Optionnel
        };
        await esb.checkFlux(oFlux, page);
    })

})