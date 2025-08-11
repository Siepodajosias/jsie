/**
 * 
 * @author JC CALVIERA
 * @since 2025-07-07
 * 
 */

const xRefTest      = "TRS_JEE_PRI";
const xDescription  = "Récupération données étiquettes électroniques";
const xIdTest       =  7611;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'JEEGY',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['codeEsl', 'prix', 'prixMoy'],
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

var sCodeEsl            = fonction.getInitParam('codeEsl',"A502EE94"); 
var sPrix               = fonction.getInitParam('prix',"4.48"); 
var sPrixMoy            = fonction.getInitParam('prixMoy',"8.96");

const oData             = require("C:/pw/playwright/_data/_tmp/MAG/prix_pvc_magasin.json");

process.env.USER        = 'supervisor';

if (oData !== undefined) {                        
	sPrix   = oData.sPrix;
    sPrixMoy= oData.sPrixMoy;
} 
//-- '11.92' => 'soit 11,92€ le Kg'
const sPrixMo = 'soit ' + sPrixMoy.toString().replace(".", ",") + '€ le Kg';

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

    test ('td [PRICE] = "' + sPrix + '"', async ()=>{  
        const sDatas = await pageEsl.tdPrix.textContent();            
        expect(fonction.cleanTexte(sDatas).trim()).toContain(sPrix.toString());
    })

    test ('Icon [LOUPE]  - Click', async ()=>{  
        await fonction.clickAndWait(pageEsl.iconLoupe, page);
    })

    test ('Label [PRIX MOYEN] = "' + sPrixMo + '"', async ()=>{             
        const aDatas = await pageEsl.tdFieldList.allInnerTexts();        
        expect(aDatas.includes(sPrixMo)).toBeTruthy();
    })

    test ('Déconnexion', async () => {
        await menu.deconnexion();
    })
    
})