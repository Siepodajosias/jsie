/**
* 
* @author JOSIAS SIE
* @since 2024-10-07
*  
*/
const xRefTest      = "SOC_CLI_MSA";
const xDescription  = "Modifier un client lié à une société";
const xIdTest       = 6320;
const xVersion      = '3.0';
       
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'SOCIETES',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['typeClient','rayon','designation','strategie'],
    fileName    : __filename
}
   
//------------------------------------------------------------------------------------

import { expect, test, type Page }from '@playwright/test';

import { Help }                   from '@helpers/helpers';
import { TestFunctions }          from '@helpers/functions';
import { Log }                    from '@helpers/log';

import { MenuSociete }            from '@pom/SOC/menu.page';
import { PageClients }            from '@pom/SOC/clients.page';

import { CartoucheInfo }          from '@commun/types/index';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuSociete;

let pageClient          : PageClients;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------ 

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuSociete(page, fonction);    
    pageClient          = new PageClients(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})
    
//------------------------------------------------------------------------------------

const sTypeClient       = fonction.getInitParam('typeClient','Magasin');
const sRayon            = fonction.getInitParam('rayon','Fruits et légumes');
var   sLieuDeVente      = fonction.getInitParam('designation','');
var   sStrategie        = fonction.getInitParam('strategie', 'Discount'); //Standard

//------------------------------------------------------------------------------------ 

sLieuDeVente            = sLieuDeVente ? sLieuDeVente : 'TA_lieu vente. ' + fonction.getToday('FR',-1);
const sAdresse1         = 'TA Adresse 1 ' + fonction.getToday('FR')+' '+fonction.getHMS(':');

//------------------------------------------------------------------------------------ 

test.describe.serial ('[' + xRefTest + ']', () => {
    
    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async() => {
        await fonction.connexion(page);
    })

    test('P-dialog [ALERT][ERREUR][PAGE] - Check', async () => {
        await fonction.isErrorDisplayed(false, page);      // Pas d'erreur affichée à priori au chargement de la page 
    })

    test.describe ('Page [CLIENT]', async () => {    
        var pageName = 'clients';

        test("Menu [CLIENTS] - Click ", async () => {
            await menu.click(pageName, page);
        })

        test('P-dialog [ALER ERREUR][PAGE CLIENTS] - Check', async () => {
            await fonction.isErrorDisplayed(false, page); // Pas d'erreur affichée à priori au chargement de la page 
        }) 

        test.describe ('Datagrid [CLIENT]', () => {
            test ('Input [FILTRE][LIEU DE VENTE] ='+ sLieuDeVente, async () => {
                await fonction.sendKeys(pageClient.datagridInputFiltre.nth(0), sLieuDeVente, false, 'Client');
            })

            test ('Input [FILTRE] [TYPE CLIENT] ='+ sTypeClient, async () => {
                await fonction.sendKeys(pageClient.datagridInputFiltre.nth(2), sTypeClient, false, 'Type Client'); 
            })

            test ('Tr [CLIENT][0] - Click', async () => {
                await fonction.wait(page, 250);
                await pageClient.pPcreateButtonLabel.filter({hasText:sRayon}).nth(0).click();
            })

            test ('Button [MODIFIER UN CLIENT] - Click', async () => {
                await fonction.clickElement(pageClient.buttonModifierClient);
            })
        })

        var sNomPopin = "Modification d'un client";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {
            var iIndex = null;
            test('Popin [' + sNomPopin + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            }) 

            test ('Li [RAYON] [' + sRayon + '] - Check', async () => {
                await fonction.wait(page, 350);
                var sTexte = await pageClient.pPcreateButtonActif.nth(0).textContent();
                expect(sTexte).toContain(sRayon);
            })

            test ('ListBox [STRATEGIE] ['+sStrategie+'] - Click', async () => {
                await fonction.wait(page, 250);
                var sSelectorButtonPlus = pageClient.pPcreateButtonPlus;
                var iNbElement  = await sSelectorButtonPlus.count();
                for (let i = 0; i < iNbElement; i++) {
                    var sElement= sSelectorButtonPlus.nth(i);
                    var sTexte  = await sElement.textContent();
                    if (sTexte.includes('Fruits et légumes')) {
                        await fonction.clickAndWait(sElement, page);
                        iIndex = i + 1;

                        // Stratégie 
                        await fonction.wait(page, 250);
                        var   eStrategies    = page.locator('p-tabpanel:nth-child(' + iIndex + ') p-dropdown[formcontrolname="strategie"] .p-dropdown-trigger');
                        await fonction.clickElement(eStrategies);          

                        var isClickable = await pageClient.pPcreateListBox.first().isEnabled();
                        if(isClickable){
                            //On sélectionne le choix cible selon son libellé
                            await fonction.clickElement(pageClient.pPcreateListBox.locator('span:text-is("'+sStrategie+'")'));
                            await fonction.wait(page,250);
                        }
                    }
                }
            })

            // Vérifie que le rayon ne peut pas être modifié.
            test ('p-dropdown [RAYON] [' + sRayon + '] - Check', async () => {
                await fonction.wait(page, 250);
                var eRayon = page.locator('p-tabpanel:nth-child(' + iIndex + ') p-dropdown[formcontrolname="rayon"] div').nth(0);
                await expect(eRayon).toHaveClass('p-dropdown p-component p-inputwrapper p-disabled p-inputwrapper-filled');
            })

            // Vérifie que l'abreviation ne peut pas être modifié.
            test ('ListBox [ABREVIATION RAYON] - Check', async () => {
                await fonction.wait(page, 250);
                var   eAbreviation = page.locator('p-tabpanel:nth-child('+iIndex+') p-dropdown[formcontrolname="abreviationRayon"] div').nth(0);
                await expect(eAbreviation).toHaveClass('p-dropdown p-component p-inputwrapper p-disabled');
            })

            // Vérifie la modification de la strategie.
            test ('ListBox [STRATEGIE] - Check', async () => {
                var sTexte = await page.locator('p-tabpanel:nth-child('+iIndex+') p-dropdown[formcontrolname="strategie"] div span').textContent();
                expect(sTexte).toEqual(sStrategie);
            })

            // Vérifie qu'on peut enregistrer.
            test ('Button [ENREGISTRER] - Check', async () => {
                await expect(pageClient.pPcreateBtnEnregistrer).toBeEnabled();
            })
            
            //--------------------------------------------------------------------------------------------------------------------------------

            test ('Input [ADRESSE] - Click', async () => {
                await fonction.wait(page, 250);
                var sSelectorButton = pageClient.pPcreateButtonPlus;
                var iNbElement   = await sSelectorButton.count();
                for (let i = 0; i < iNbElement; i++) {
                    var sElement = sSelectorButton.nth(i);
                    var sTexte   = await sElement.textContent();
                    if (sTexte.includes('Client')) {
                        await fonction.clickAndWait(sElement, page);
        
                        // Adresse
                        await pageClient.pPcreateInputAdresse.waitFor({state:'visible'});
                        await fonction.sendKeys(pageClient.pPcreateInputAdresse, sAdresse1, false, 'Adresse');
                    }
                }
            })

            test ('CheckBox [LIE A UNE SOCIETE] - Check', async () => {
                await expect(pageClient.pPcreateCheckBoxLieSoc.locator('div.p-disabled')).toHaveClass('p-checkbox-box p-highlight p-disabled');
            })

            test ('Input [SOCIETE] - Check', async () => {
                await expect(pageClient.pPcreateAutoCompSociete.locator('input')).toHaveAttribute('disabled');
            })

            test ('Input [CODE CLIENT] - Check', async () => {
                await expect(pageClient.pPcreateInputCodeCLient).toHaveAttribute('disabled');
            })

            test ('Input [ANCIEN CODE CLIENT] - Check', async () => {
                await expect(pageClient.pPcreateInputAncienCodeCLient).toHaveAttribute('disabled');
            })

            test ('Input [DONNEES COMPTABLES] - Check', async () => {
                await expect(pageClient.pPcreateInputTVACEE).toHaveAttribute('disabled');
            })

            test ('Input [E-MAIL] - Check', async () => {
                await expect(pageClient.pPcreateInputEmails.locator('div')).toHaveClass('p-chips p-component p-input-wrapper p-disabled p-inputwrapper-filled');
            })

            test ('Button [ENREGISTRER] - Click', async () => { 
                await fonction.clickAndWait(pageClient.pPcreateBtnEnregistrer, page);
                var present         = await pageClient.pErrorMessage.isVisible();
                if (present) {
                    var error:any   = await pageClient.pErrorMessage.textContent();
                    var errorMessage= error.substr(0,6);
                    if(errorMessage === "[9100]" || errorMessage === "[6002]"){
                        await fonction.clickElement(pageClient.pPcreateLinkAnnuler);
                    }
                }
            })

            test('Popin [' + sNomPopin + '] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            })
        })
    })  //-- End test.describePage

    test('Déconnexion', async() => {
        // Si on est dans le cadre d'un E2E, sauvegarde des données pour le scénario suivant
        await fonction.deconnexion(page);
    })
})  //-- End Describe   
