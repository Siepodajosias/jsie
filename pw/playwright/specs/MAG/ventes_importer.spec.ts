/**
 * @author JOSIAS SIE
 * @description Importation des ventes d'une journée (Remontée des ventes)
 * @since 2024-09-02
 * 
 */
const xRefTest      = "MAG_VTE_IMP";
const xDescription  = "Flux : Importation ventes d'une journée";
const xIdTest       =  1570;
const xVersion      = '3.3';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : ['codeMagasin','rayon','typeVente','date'],
    fileName    : __filename
}

//------------------------------------------------------------------------------------

import { expect, test, type Page}          from '@playwright/test';

import { Help }                            from '@helpers/helpers';
import { TestFunctions }                   from '@helpers/functions';
import { Log }                             from '@helpers/log';
import { VentesJournee }                   from '@pom/MAG/ventes-journee.page';

import { ApiClient }                       from '@helpers/api';

import { CartoucheInfo, APIRequestObject } from '@commun/types';

import * as fs                             from 'fs';
import * as path                           from 'path';

//------------------------------------------------------------------------------------

let page                : Page;
let pageVentes          : VentesJournee;

const log               = new Log();
const fonction          = new TestFunctions(log);

const sUrlEsbProd       = 'http://esb.prod.tibco.prosol.pri:9091/';// http://172.30.24.1:9091/ ; http://172.27.8.180:9091/

//------------------------------------------------------------------------------------

const sCodeMagasin  = fonction.getInitParam('codeMagasin', '404')// 404 (ALES), 211 (Albi) 
const sRayon        = fonction.getInitParam('rayon', 'PO')// PO (Poissonnerie), CR (Crèmerie)
const sTypeVente    = fonction.getInitParam('typeVente', 'journee');
const sDate         = fonction.getInitParam('date', fonction.getToday('US', 0, '-'));

const sDateMin      = sDate + 'T00:00:00';
const sDateMax      = sDate + 'T' + fonction.getHeure() + ':59';

//------------------------------------------------------------------------------------

const conFileName   = fonction.getLocalConfig('conFileName');
const urlJournee    = fonction.getLocalConfig('urlJournee');

const filePath      = path.join(conFileName, urlJournee);

//------------------------------------------------------------------------------------
//API Flux
const apiRequestFluxMagasin: APIRequestObject = {
    baseUrl: sUrlEsbProd,
    authMethod: 'No Auth',
}
const apiClientFluxMagasin = new ApiClient(apiRequestFluxMagasin, sTypeVente);
let xmlResponse            = null;

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    pageVentes      = new VentesJournee(page);
	const helper    = new Help(info, testInfo, page);
	await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------  

test.describe.serial('[' + xRefTest + ']', async () => {

    test.describe ('Récupération des ventes', async () => {

        var sFlowId:string;

        log.set('Date Début : ' + sDateMin);
        log.set('Date Fin   : ' + sDateMax);

        test ('Interrogation ESB', async () => {

            await page.goto(sUrlEsbProd + "execution?filtre=null&dateMin=" + sDateMin + "&dateMax=" + sDateMax + "&derniereLigne=undefined&filtreDescription=" + sCodeMagasin + sRayon + "&flux=EnvoyerVentes_Mag&groupe=Sigale%20-%20Magasin&noaction=true");

            sFlowId = await pageVentes.tdFlowId.first().textContent();
            log.set('FlowId : ' + sFlowId);
        })

        test ('Récuperer le XML', async () => {
            const params = {
                'flowid' : 'EnvoyerVentes_Mag.' + sFlowId.trim(),
            };
            var response = await apiClientFluxMagasin.get("infostart", null, params);
            xmlResponse  = await response.text();

            expect(xmlResponse).toBeTruthy();

            fs.writeFileSync(filePath, xmlResponse, 'utf-8');
        })
    })
})