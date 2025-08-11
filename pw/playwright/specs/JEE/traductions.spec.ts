/**
 * 
 * @author JC CALVIERA
 * @since 2025-07-07
 * 
 */

const xRefTest      = "TRS_JEE_TRA";
const xDescription  = "Récupération données étiquettes électroniques traduites en Italien";
const xIdTest       =  10030;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'JEEGY',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['codeEsl', 'libelle'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { expect, test, type Page }      from '@playwright/test';

import { Help }                         from '@helpers/helpers';
import { TestFunctions }                from '@helpers/functions';
import { Log }                          from '@helpers/log';

import { MenuJeegy }                    from '@pom/JEE/menu.page';
import { Esl }                          from '@pom/JEE/esl.page';

import { CartoucheInfo }                from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuJeegy;
let pageEsl             : Esl;

const log               = new Log();
const fonction          = new TestFunctions(log);
//------------------------------------------------------------------------------------

const sCodeEsl          = fonction.getInitParam('codeEsl',"A502EE94"); 
const sLibelle          = fonction.getInitParam('libelle',"MOZZARELLA ITALIANA 125G"); 

process.env.USER        = 'supervisor';

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuJeegy(page);
    pageEsl         = new Esl(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test ('Input [RECHERCHE] = "' + sCodeEsl + '"', async ()=>{
        await fonction.sendKeys(pageEsl.inputFieldEsl, sCodeEsl);                 
    })

    test ('Button [RECHERCHE] - Click', async ()=>{  
        await fonction.clickAndWait(pageEsl.buttondEsl, page);            
    })

    test ('td [ESL CODE] = "' + sCodeEsl + '"', async ()=>{  
        const sDatas = await pageEsl.tdEslCode.textContent();            
        expect(fonction.cleanTexte(sDatas).trim()).toContain(sCodeEsl.toString());
    })

    test ('td [LIBELLE] = "' + sLibelle + '"', async ()=>{  
        const sDatas = await pageEsl.tdLibelle.textContent();            
        expect(fonction.cleanTexte(sDatas).trim()).toContain(sLibelle.toString());
    })

    test ('Icon [LOUPE]  - Click', async ()=>{  
        await fonction.clickAndWait(pageEsl.iconLoupe, page);
    })

    test ('Label [INTEM NAME] = "' + sLibelle + '"', async ()=>{             
        const aDatas = await pageEsl.tdFieldList.allInnerTexts();        
        expect(aDatas.includes(sLibelle)).toBeTruthy();
    })

    test ('Déconnexion', async () => {
        await menu.deconnexion();
    })
    
})