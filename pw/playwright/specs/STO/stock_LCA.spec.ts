/**
 * 
 * PRICING APPLICATION > CONNEXION
 * 
 * @author Vazoumana Diarrassouba
 * @since 2023/10/13
 * 
 */
const xRefTest      = "STO_LCA_CHK";
const xDescription  = "Examine la Liste de Contrôle d'Accès STOCK";
const xIdTest       =  1614;
const xVersion      = '3.6';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }                  from '@playwright/test';

import { Help }                             from '@helpers/helpers.js';
import { TestFunctions }                    from '@helpers/functions.js';
import { Log }                              from '@helpers/log';

import { Credential }                       from '@conf/credential.conf.js';

import { Authentificationpage }             from '@pom/COMMUN/authentification.page.js';

import { MenuStock }                        from '@pom/STO/menu.page.js';
import { CartoucheInfo }                    from '@commun/types/index.js';

//------------------------------------------------------------------------------------

let page                : Page;
let pageObjectAuth      : Authentificationpage;
let menu                : MenuStock;

const log				= new Log();
const fonction      	= new TestFunctions(log);

const profil            = 'lunettes';
const userCredential    = new Credential(profil);

var profilData          = userCredential.getData();

fonction.recordDatas(false);		//-- Inutile de créer une fiche de données

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();    
    pageObjectAuth      = new Authentificationpage(page);
    menu                = new MenuStock(page);
	const helper    	= new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    var injects			=  [
        ['', ''],
        ['Foo', 'Bar'],
        [profilData.login, ''],
        ['', profilData.password],
        ["' or '1' = '1", "' or '1' = '1"],
        ["' OR 1=1'); //", "' OR 1=1'); //"]
    ];

    test('Ouverture URL', async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test.describe('Login - Wrong Parameters', async () => {

        var index = 0

		injects.forEach(async (data) => {

			var login 		= data[0];
			var password 	= data[1];

			test('Login: [ ' + login + ' ] / Pwd: [ ' + password + ' ]', async () => {
                await pageObjectAuth.setJUsername(login);
                await pageObjectAuth.setJPassword(password);
                await pageObjectAuth.clickConnexionButton(page);

				// Après avoir cliqué sur le bouton connexion avec les identifiants erronés, assurer qu'on n'a pas pu se connecter;(On est toujours sur la page d'authentification).
                await fonction.isDisplayed(pageObjectAuth.jUsername);
                await fonction.isDisplayed(pageObjectAuth.jPassword);
                await fonction.isDisplayed(pageObjectAuth.connexionButton);
                index++
                // Quand nous avons ces coordonnées: login = "' OR 1=1'); //" et password = "' OR 1=1'); //"
                // Nous avons un gros messages d'erreur qui rend le bouton <<connexion>> invisible, d'où il faut faire le rafraîchissement de la page
                if(index == (injects.length)){   
                    await page.reload();
                    fonction.waitTillHTMLRendered(page);
                }
			}); 
		});
	});    

    test.describe('Login - Right Parameters', async () => {

		var login 		= profilData.login;
		var password	= profilData.password;
		
		test('Login: [ ' + login + ' ] / Pwd: [ ' + password + ' ]', async () => {
			await pageObjectAuth.setJUsername(login);
			await pageObjectAuth.setJPassword(password);
			await pageObjectAuth.clickConnexionButton(page);
		})

        test('ListBox [USER] - Is Visible', async () => {
            menu.listBoxUser.isVisible()
        })

	})
   
    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})