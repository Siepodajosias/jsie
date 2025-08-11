/**
 * 
 * 
 * @author JC CALVIERA
 * @since 2023/11/01
 * 
 */

const xRefTest      = "MAG_PRI_TBT";
const xDescription  = "Envoyer tarifs pour balance de test";
const xIdTest       =  1075;
const xVersion      = '3.0';

var info = {
    desc    : xDescription,
    appli   : 'MAG',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : [],
    params  : ['ville', 'groupeArticle', 'idArticle'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }  from '@playwright/test';

//-- Helpers
import { Help }             from '../../utils/helpers';
import { TestFunctions }    from '../../utils/functions';

import { MenuMagasin }      from '../../pages/MAG/menu.page';

//-- Pages Objects
import { PrixGestion }      from '../../pages/MAG/prix-gestion.page';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuMagasin;

let pagePrix        : PrixGestion;

var fonction        = new TestFunctions();

//------------------------------------------------------------------------------------

var sVilleCible     = process.env.VILLE || 'Malemort (G914)';
var sGroupeArticle  = process.env.GROUPEARTICLE || 'Coupe / Corner';
var sIdArticle      = process.env.IDARTICLE || 'C2C1';

//------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {

    page            = await browser.newPage();
    menu            = new MenuMagasin(page, fonction);

    pagePrix        = new PrixGestion(page);
});

//------------------------------------------------------------------------------------

test.describe ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    });

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACCUEIL]', async () => {

        test('Link [FERMER] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            await menu.pPopinAlerteSanitaire.isVisible().then(async (isVisible) => {
                if(isVisible){
                    await menu.removeArlerteMessage(page);
                }
            })
        })
    })

    test.describe('Page [PRIX]', () => {

        var pageName = 'prix';

        test('Page [STOCK] - Click', async () => {
            await menu.click(pageName, page); 
        })
       
        test('ListBox [VILLE] = "' + sVilleCible + '"', async() =>{
            await menu.selectVille(sVilleCible, page);
        })
       
        test('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async() =>{
            await pagePrix.listBoxGrpArticle.selectOption(sGroupeArticle);
        })

        test('InputField [ARTICLE] = "' + sIdArticle + '"', async() =>{
            await pagePrix.inputArticle.fill(sIdArticle);
        })

        test('CheckBox[ARTICLE][0] - Click', async() =>{
            await pagePrix.tdCodeArticle.first().click();
        })

        test('Button [TRANSMETTRE BALANCE TEST] - Click', async() =>{
            await pagePrix.buttonTransmettreBalTest.click();
        })

        var sNomPopin   = 'TRANSMETTRE LES PRIX A LA BALANCE DE TEST';
        test.describe ('Popin [' + sNomPopin + ']', async () => {

            test ('Popin [' + sNomPopin + '] - Is Visible', async () =>  {
                await fonction.popinVisible(page, sNomPopin,  true);
            })

            test ('Error Message - Is Hidden', async () =>  {
                await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
            })

            test ('Button [PLUS] - Click', async () =>  {
                await pagePrix.pPButtonBalTestPlus.click();
            })

            test ('Button [TRANSMETTRE] - Click', async () =>  {
                await fonction.clickAndWait(pagePrix.pPButtonBalTestTransmettre, page);
            })

            test ('Popin [' + sNomPopin + '] - Is Hidden', async () =>  {
                await fonction.popinVisible(page, sNomPopin,  false);
            })

        })

        test('Message [OPERATION REUSSIE] - Is Visible', async() =>{
            await pagePrix.pPMessageConfirmTransmis.isVisible();
        })                        

    })  // End Describe

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})