/**
 * 
 * @author SARBA ABDOUL
 * @since 2025-05-21
 *  
 */
const xRefTest      = "SOC_LVE_SOC_LVE_AUT";
const xDescription  = "Créer un lieu de vente autre que Grand frais";
const xIdTest       =  6161;
const xVersion      = '3.0';
    
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'SOCIETES',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['enseigne', 'designation','typeDeLieu','ville'],
    fileName    : __filename
}

//------------------------------------------------------------------------------------

import { expect, test, type Page }  from '@playwright/test';

import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';
import { EsbFunctions }             from '@helpers/esb';

import { MenuSociete }              from '@pom/SOC/menu.page'
import { PageLieuxVente }			from '@pom/SOC/lieux-de-vente.page';

import { CartoucheInfo, TypeEsb } 	from '@commun/types/index';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuSociete;

let pageLieuxVente      : PageLieuxVente;
let esb                 : EsbFunctions;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

fonction.importJdd();

const sEnseigne     = fonction.getInitParam('enseigne','Fresh');
var sDesignation    = fonction.getInitParam('designation', ''); 
var sTypeDeLieu     = fonction.getInitParam('typeDeLieu', 'Magasin');
const sVille        = fonction.getInitParam('ville','TA Ville Machin - /L\'ile'+ fonction.getBadChars());
sDesignation        = sDesignation ? sDesignation : 'TA_lieu vente. ' + fonction.getToday('FR');

const sAdresse1     = 'TA Adresse 1 ' + fonction.getToday('FR');
const sAdresse2     = 'TA Adresse 2 ' + fonction.getToday('FR');
const sPays         = 'France';
const sCodePostal   = '88888';
const sLatitude     = '45.081378';
const sLongitude    = '1.545757';


var oData = {
    sDesignation    : '',
    sCodeLieuDeVente  : ''
}

//------------------------------------------------------------------------------------ 

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuSociete(page, fonction);    
    pageLieuxVente      = new PageLieuxVente(page);
    esb                 = new EsbFunctions(fonction);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

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
        await fonction.isErrorDisplayed(false, page); // Pas d'erreur affichée à priori au chargement de la page 
    }) 

    test.describe('Page [LIEUX VENTE]', async () => {    

        let pageMenu:string ="lieuxVente";

        test("Menu [LIEUX] - Click ", async () => {
            await menu.click(pageMenu, page);
        })

        test('P-dialog [ALER ERREUR][PAGE LIEUX] - Check', async () => {
            await fonction.isErrorDisplayed(false, page); // Pas d'erreur affichée à priori au chargement de la page 
        }) 

        test('Button [CREER UN LIEU DE VENTE] - Click', async () => {
            await fonction.clickElement(pageLieuxVente.buttonCreerLieuVente);
        })

        var sNomPopin:string = "Création d'un lieu de vente";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

            test('Popin [CREATION D\'UN LIEU] - Check', async () => {
                await fonction.popinVisible(page, sNomPopin, true); // Pas d'erreur affichée à priori au chargement de la Popin
            })
            
            test('ListBox [TYPE DE LIEU] [' + sTypeDeLieu + ']', async () => {
                var text = await pageLieuxVente.pPcreateListBoxTypeLieu.locator('span').textContent();
                if (text != 'Magasin') {
                    await fonction.clickAndWait(pageLieuxVente.pPcreateListBoxTypeLieu, page);
                    await fonction.clickElement(page.locator('li[aria-label="' + sTypeDeLieu + '"]'));
                }
                await fonction.addDataSheet('ListBox', 'Type de Lieu', text);
            })

            test('ListBox [ENSEIGNE] [' + sEnseigne + ']', async () => {
                var text = await pageLieuxVente.pPcreateListBoxEnseigne.locator('span').textContent();

                await fonction.clickAndWait(pageLieuxVente.pPcreateListBoxEnseigne, page)
                await fonction.clickElement(page.locator('li[aria-label="' + sEnseigne + '"]'));

                await fonction.addDataSheet('ListBox', 'Enseigne', text);
            })

            test('Input [DESIGNATION LIEU DE VENTE] [' + sDesignation + ']', async () => {
                await fonction.sendKeys(pageLieuxVente.pPcreateInputDesign, sDesignation, false, 'Désignation Lieu de Vente');
                oData.sDesignation = sDesignation;
            })

            test('CheckBox [ACTIF] - check', async () => {
                expect(await pageLieuxVente.pPcreateCheckBoxActif.isChecked()).toBe(true);
            })

            test('CheckBox [OUVERT DIMANCHE] - check', async () => {
                expect(await pageLieuxVente.pPcreateCheckBoxOuvDim.isChecked()).toBe(true);
            })

            test('ComboBox [CODE][rnd] - Click', async () => {
                await fonction.clickElement(pageLieuxVente.pPcreateInputCode);

                var isActive = await pageLieuxVente.pPcreateComboBoxList.first().isEnabled();
                if (isActive) {
                    var iNbChoix = await pageLieuxVente.pPcreateComboBoxList.count();
                    var iCible = Math.floor(fonction.random() * iNbChoix);

                    var sChoix = await pageLieuxVente.pPcreateComboBoxList.nth(iCible).textContent();
                    log.set('ComboBox [CODE] : Sélection Elément ' + iCible + ' / ' + iNbChoix + ' = "' + sChoix + '"');
                    await fonction.clickElement(pageLieuxVente.pPcreateComboBoxList.nth(iCible));
                }

                let sCodeLieuDeVente = await pageLieuxVente.pPcreatePrefixeEnseigne.textContent() + sChoix;
                oData.sCodeLieuDeVente = sCodeLieuDeVente;
            })
            
            test('Input [CODE LIEU DE VENTE] [' + oData.sCodeLieuDeVente + ']- Check', async () => {
                const sInputCodeGfitValue =  await pageLieuxVente.pPcreateInputCodeGfit.inputValue();
                console.log('Code Lieu de Vente : '+ oData.sCodeLieuDeVente);
                expect(sInputCodeGfitValue).toBe( oData.sCodeLieuDeVente);
                
            })

            test('DatePicker [DATE OUVERTURE] = "Aujourd\'hui"', async () => {
                await fonction.clickElement(pageLieuxVente.pPcreateDatePeackerOuv);
                await fonction.clickElement(pageLieuxVente.pPcreateDateToday);
            })
            
            test('Input [ADRESSE] [' + sAdresse1 + ']', async () => {
                await fonction.sendKeys(pageLieuxVente.pPcreateInputAdresse, sAdresse1, false, 'Adresse');
            })

            test('Input [ADRESSE COMPLEMENT] [' + sAdresse2 + ']', async () => {
                await fonction.sendKeys(pageLieuxVente.pPcreateInputAdresseCpt, sAdresse2, false, 'Complément Adresse');
            })

            test('Input [CODE POSTAL] [' + sCodePostal + ']', async () => {
                await fonction.sendKeys(pageLieuxVente.pPcreateInputCodePostal, sCodePostal, false, 'Code Postal');
            })

            test('Input [VILLE] [' + sVille + ']', async () => {
                await fonction.sendKeys(pageLieuxVente.pPcreateInputVille, sVille, false, 'Ville');
            })

            test('ListBox [PAYS] = "'+sPays+'"', async () => {
                var text = await pageLieuxVente.pPcreateListBoxPays.locator('span').textContent();
                if (text != 'France') {
                    await fonction.clickAndWait(pageLieuxVente.pPcreateListBoxPays, page);
                    await fonction.clickElement(pageLieuxVente.pPcreateListBoxPaysItem);
                }
                await fonction.addDataSheet('ListBox', 'Pays', text);
            })

            test('ListBox [REGION][rnd] - Select', async () => {
                var text = await pageLieuxVente.pPcreateListBoxRegion.locator('span').textContent();
                if (text == ' ') {
                    await fonction.selectRandomListBoxLi(pageLieuxVente.pPcreateListBoxRegion, false, page);
                }
                await fonction.addDataSheet('ListBox', 'Région', text);
            })

            test('Input [LATITUDE] [' + sLatitude + ']', async () => {
                await fonction.sendKeys(pageLieuxVente.pPcreateInputLatitude, sLatitude, false, 'Latitude');
            })

            test('Input [LONGITUDE] [' + sLongitude + ']', async () => {
                await fonction.sendKeys(pageLieuxVente.pPcreateInputLongitude, sLongitude, false, 'Longitude');
            })

            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageLieuxVente.pPcreateBtnEnregistrer, page);

                var present = await pageLieuxVente.pErrorMessage.isVisible();
                if (present) {
                    var error: any = await pageLieuxVente.pErrorMessage.textContent();
                    var errorMessage = error.substr(1, 6);
                    if (errorMessage == '[9100]') {
                        await fonction.clickElement(pageLieuxVente.pPcreateLinkAnnuler);
                    }
                }
            })

            test('Popin [CREATION D\'UN LIEU] - Check', async () => {
                await fonction.popinVisible(page, sNomPopin, false); // Fermeture de la poppin
            })

            test.describe('Datagrid [LIEUX VENTE]', async () => {

                test('Input [CODE] =' + oData.sCodeLieuDeVente + '', async () => {
                    await fonction.sendKeys(pageLieuxVente.dataGridLieuxDeVente, oData.sCodeLieuDeVente, false, 'Code Lieu de Vente');
                })

                test('Input  [DESIGNATION] =' + oData.sDesignation + '', async () => {
                   await fonction.sendKeys(pageLieuxVente.pPcreateInputDesign, oData.sDesignation, false, 'Désignation Lieu de Vente');
                })
            })
        })

        test(' Input [CODE LIEU DE VENTE] = ' + oData.sCodeLieuDeVente + '', async () => {
          await fonction.sendKeys(pageLieuxVente.dataGridCodeLieuxVente, oData.sCodeLieuDeVente, false, 'Code Lieu de Vente');
        })

        test('Input [DESIGNATION LIEU DE VENTE] = ' + oData.sDesignation + '', async () => {
            await fonction.sendKeys(pageLieuxVente.dataGridDesignLieuxVente, oData.sDesignation, false, 'Désignation Lieu de Vente');
        })
        test('td [LIEU DE VENTE] - click', async () => {
            await fonction.clickElement(pageLieuxVente.dataGridTdNbsocieLieuxVente);
        })
    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
})