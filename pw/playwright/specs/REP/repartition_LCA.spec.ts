/**
 * 
 * PRICING APPLICATION > CONNEXION
 * 
 * @author Vazoumana Diarrassouba
 * @since 2023/10/11
 * 
 */

import { test, type Page }                  from '@playwright/test';
import { CartoucheInfo }                    from '@commun/types';

import { Help }                             from '@helpers/helpers';
import { TestFunctions }                    from '@helpers/functions';
import { Log }                              from '@helpers/log';

import { Credential }                       from '@conf/credential.conf';

import { Authentificationpage }             from '@pom/COMMUN/authentification.page';
import { MenuRepartition }                  from '@pom/REP/menu.page';

const xRefTest      = "REP_LCA_CHK";
const xDescription  = "Examine la Liste de Contrôle d'Accès REPARTITION";
const xIdTest       =  1613;
const xVersion      = '3.7';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'REP',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

let page                : Page;
let log                 : Log;

let pageObjectAuth      : Authentificationpage;

let menu                : MenuRepartition;

const fonction          = new TestFunctions();
const profil            = 'lunettes';
const userCredential    = new Credential(profil);

var profilData          = userCredential.getData();

fonction.recordDatas(false);		//-- Inutile de créer une fiche de données

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();    
    log                 = new Log();

    pageObjectAuth      = new Authentificationpage(page);
    menu                = new MenuRepartition(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})


test.afterAll(async({}, testInfo) => {
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
    ]

    test('Ouverture URL :' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

    test.describe('Login - Wrong Parameters', async () => {
		
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
			})	
		})
	})       

    test.describe('Login - Right Parameters', async () => {

		var login 		= profilData.login;
		var password	= profilData.password;
		
		test('Login: [ ' + login + ' ] / Pwd: [ ' + password + ' ]', async () => {
			await pageObjectAuth.setJUsername(login);
			await pageObjectAuth.setJPassword(password);
			await pageObjectAuth.clickConnexionButton(page);	  
		})

        test('ListBox [USER] - Is Visible', async () => {
            menu.listBoxUser.isVisible();
        })
	})
   
    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
    
})