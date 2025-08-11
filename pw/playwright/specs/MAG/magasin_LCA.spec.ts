/**
 * 
 * MAGASIN APPLICATION > CONNEXION
 * 
 * @author Vazoumana Diarrassouba
 * @since 2023/10/12
 * 
 */
const xRefTest      = "MAG_LCA_CHK";
const xDescription  = "Contrôle d'Accès - MAGASIN";
const xIdTest       =  1610;
const xVersion      = '3.7';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAG',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }                  from '@playwright/test';

import { Help }                             from '@helpers/helpers';
import { TestFunctions }                    from '@helpers/functions';
import { Log }                              from '@helpers/log';

import { Credential }                       from '@conf/credential.conf';

import { Authentificationpage }             from '@pom/COMMUN/authentification.page';
import { MenuMagasin }                      from '@pom/MAG/menu.page';

import { CartoucheInfo }                    from '@commun/types/index';

//------------------------------------------------------------------------------------

let page                : Page;
let log                 : Log;

let pageObjectAuth      : Authentificationpage;
let menu                : MenuMagasin;

const fonction          = new TestFunctions(log);
const profil            = 'lunettes';
const userCredential    = new Credential(profil);

var profilData          = userCredential.getData();
//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();    
    log                 = new Log();
    pageObjectAuth      = new Authentificationpage(page);
    menu                = new MenuMagasin(page, fonction);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

fonction.recordDatas(false);		//-- Inutile de créer une fiche de données

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

    test.describe ('Login - Right Parameters', async () => {

		const login     = profilData.login;
		const password	= profilData.password;
		
		test ('Login: [ ' + login + ' ] / Pwd: [ ' + password + ' ]', async () => {
			await pageObjectAuth.setJUsername(login);
			await pageObjectAuth.setJPassword(password);
			await pageObjectAuth.clickConnexionButton(page);					  
		})

	})

    test ('ListBox [USER] - Is Visible', async () => {
        await menu.listBoxUser.isVisible();
    })

    test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
        var isVisible = await menu.pPopinAlerteSanitaire.isVisible();       
        if(isVisible){
            await menu.removeArlerteMessage(page);
        }else{            
            log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
            test.skip();
        }
    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})