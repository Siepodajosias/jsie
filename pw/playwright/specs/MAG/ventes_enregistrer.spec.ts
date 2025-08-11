/**
 * @author JOSIAS SIE
 * @description Transmission des ventes d'une journée (Remontée des ventes)
 * @since 2024-09-03
 * 
 */
const xRefTest      = "MAG_VTE_ENR";
const xDescription  = "Flux :  Enregistrer les ventes d'une journée dans Sigale";
const xIdTest       =  9561;
const xVersion      = '3.3';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : ['codeMagasin','rayon','typeVente','ville'],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { expect, test, type Page}          from '@playwright/test';

import { Help }                            from '@helpers/helpers';
import { TestFunctions }                   from '@helpers/functions';
import { Log }                             from '@helpers/log';
import { ApiClient }                       from '@helpers/api';

import { Credential }                      from '@conf/credential.conf';

import { CartoucheInfo, APIRequestObject } from '@commun/types';
import { MenuMagasin }                     from '@pom/MAG/menu.page';

import * as fs                             from 'fs';
import * as path                           from 'path';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuMagasin;

const log               = new Log();
const fonction          = new TestFunctions(log);

const profil            = 'lunettes';
const userCredential    = new Credential(profil);
var profilData          = userCredential.getData();

//------------------------------------------------------------------------------------

const sCodeMagasin  = fonction.getInitParam('codeMagasin', '211');// 211 (Albi), 404 (ALES) 
const sRayon        = fonction.getInitParam('rayon', 'CR');// CR (Crèmerie), PO (Poissonnerie)
const sTypeVente    = fonction.getInitParam('typeVente', 'statique');

const sDate         = fonction.getToday('US', 0, '-');
const sDateXml      = sDate + ' ' + fonction.getHeure() + ':59';

//------------------------------------------------------------------------------------
const sNomVille       = fonction.getInitParam('ville', 'Albi (G211)');
const conFileName     = fonction.getLocalConfig('conFileName');
const urlStatique     = fonction.getLocalConfig('urlStatique');
const urlJournee      = fonction.getLocalConfig('urlJournee');

var filePathStatique  = path.join(conFileName, urlStatique);
var filePathJour      = path.join(conFileName, urlJournee);
var xmlData           = fs.readFileSync(filePathJour, 'utf-8');

//------------------------------------------------------------------------------------

const aEnvironnement = {
    'integration'   : 'http://magasin.int.sigale.prosol.pri/',
    'integration2'  : 'http://app1.int2.sigale.prosol.pri:9087/',
    'formation'     : 'http://app1.form.sigale.prosol.pri:9087/',
    'fab'           : 'http://app1.fab.sigale.prosol.pri:9087/',
    'preprod'       : 'http://magasin-app1.prep.sigale.prosol.pri:80/'
}

//API Ventes
const apiRequestVentesMagasin: APIRequestObject = {
    baseUrl: aEnvironnement[fonction.environnement],
    authMethod: 'No Auth',
}
const apiClientVentesMagasin = new ApiClient(apiRequestVentesMagasin, sTypeVente);

let xmlResponse = null;

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuMagasin(page, fonction);
	const helper    = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------  

test.describe.serial('[' + xRefTest + ']', async () => {

    test ('Ouverture URL'+ fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACCUEIL]', async () => {

        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible= await menu.pPopinAlerteSanitaire.isVisible();
            if(isVisible){
                await menu.removeArlerteMessage(page);
            }else{
                log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                test.skip();
            }
        })

        test('ListBox [LIEU DE VENTE] = "' + sNomVille + '"', async () => {
			await menu.selectVille(sNomVille, page);
		})
    })

    test.describe('Page [VENTES]', async () => {

        var sNomPage = 'ventes';

        test ('Page [VENTES] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 

        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if(isVisible){
                await menu.removeArlerteMessage(page);
            }else{
                log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                test.skip();
            }
        })

        test ('Transmission des ventes', async () => {
            test.setTimeout(180000);
            if(sTypeVente =='statique'){
                xmlData = fs.readFileSync(filePathStatique, 'utf-8');
                xmlData = xmlData.replace(/{date}/gm, sDateXml);
            }
            xmlResponse = xmlData;

            const bodyCredentials= { login: profilData.login, password: profilData.password };
            var jsonResponse     = await apiClientVentesMagasin.post(`ws/auth`, null, JSON.stringify(bodyCredentials), null);
    
            const jwtToken = jsonResponse.headers.get('authorization').split(' ')[1];
            expect(jwtToken).toBeDefined();

            const body     = xmlResponse;
    
            const headerOptions = {
                'Authorization' :  `Bearer ${jwtToken}`,
                'Content-Type' : 'application/xml'
            }
    
            await apiClientVentesMagasin.post(`ws/magasins/${sCodeMagasin}${sRayon}/ventes`, headerOptions, body, null);
        })
    }); // end describe

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
})