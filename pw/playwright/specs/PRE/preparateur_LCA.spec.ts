/**
 * 
 * 
 * @author JC CALVIERA
 * @since 2023-11-16
 * 
 */

const xRefTest      = "PRE_SCN_LCA";
const xDescription  = "Authentification sur la page preparateur.html";
const xIdTest       =  2068;
const xVersion      = '3.6';

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

import { test, type Page, expect }          from '@playwright/test';

import { Help }                             from '@helpers/helpers.js';
import { TestFunctions }                    from '@helpers/functions.js';
import { Log }                              from '@helpers/log';

import { ProdGestionPreparateursPage }      from '@pom/PRE/preparateur.page.js';

import { CartoucheInfo }                    from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let log                 : Log;

let pagePreparateur     : ProdGestionPreparateursPage;

const fonction          = new TestFunctions(log);
const iCodeIdentification = 21001;               // << Matricule du préparateur

//------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();    
    log                 = new Log();
    pagePreparateur     = new ProdGestionPreparateursPage(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe ('[' + xRefTest + ']', async () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl() + '#/preparateur.html?codePlateforme=CHA', async({ context }) => {
        await context.clearCookies();
        //-- Url spécifique de connexion du préparateur
        const sUrl = fonction.getApplicationUrl() + '#/preparateur.html?codePlateforme=CHA';
        fonction.setApplicationUrl(sUrl);
        await fonction.openUrl(page);
    });

    test ('InputField [MATRICULE] = "WrongMatricule"', async() => {
        await fonction.sendKeys(pagePreparateur.inputCodeIdentification, 'WrongMatricule');           
    })
   
    test ('Key [ENTER #1] - Press', async() => {
        await page.keyboard.press('Enter');         
        await fonction.wait(page, 3500);
    })

    test ('Message [ERREUR 9998] - Is Visible', async() => {
        const sMessage = await pagePreparateur.messageErreur.textContent();
        log.set('Message Refus Authentification :  ' + sMessage);
        expect(await pagePreparateur.messageErreur.textContent()).toContain('Erreur[9998]');
    })

    test('Ré- Ouverture URL', async() => {
        await fonction.wait(page, 10000);   // attente disparition message 9998 précédent
        //-- Url spécifique de connexion du préparateur
        const sUrl = fonction.getApplicationUrl() + '#/preparateur.html?codePlateforme=CHA';
        fonction.setApplicationUrl(sUrl);
        await fonction.openUrl(page);
    });

    test ('InputField [MATRICULE] = "' + iCodeIdentification + '"', async() => {    
        await fonction.sendKeys(pagePreparateur.inputCodeIdentification, iCodeIdentification);  
    })

    test ('Key [ENTER #2] - Press', async() => {
        await fonction.wait(page, 3500);
        await page.keyboard.press('Enter');     
        //await fonction.wait(page, 1500);
    })

    test ('Message [BIENVENUE] - Is Visible', async() => {
        await expect(page.getByText(/BONJOUR/gi).first()).toBeVisible();
    })

    test ('InputField [NUMERO FEUILLE] = "000000"', async() => { 
        await pagePreparateur.inputNumeroSupport.waitFor();
        await fonction.sendKeys(pagePreparateur.inputNumeroSupport, '000000'); 
    })

    test ('Key [ENTER #4] - Press', async() => {
        await page.keyboard.press('Enter');         
        await fonction.wait(page, 2500);
    })

    test ('Message [ERREUR 0035] - Is Visible', async() => {
        const sMessage = await pagePreparateur.messageErreur.textContent();
        log.set('Message Anomalie Scan :  ' + sMessage);
        expect(await pagePreparateur.messageErreur.isVisible()).toBeTruthy();
    })

}) 