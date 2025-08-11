/**
 * 
 * @author SIAKA KONE
 * @since 2024-07-15
 * 
 */
const xRefTest      = "ACH_LIT_TRT2";
const xDescription  = "Traiter automatiquement un litige (batch OPCON)";
const xIdTest       =  236;
const xVersion      = "3.4";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon','listeArticles','fournisseur','plateformeReception'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------
import * as path            from 'path';

import { test, type Page, expect }  from '@playwright/test';

import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';
import { MenuAchats }               from '@pom/ACH/menu.page';
import { PageLitLitAut }            from '@pom/ACH/litiges_litiges-automatiques.page';
import { PageLitDemAvo }            from '@pom/ACH/litiges_demandes-avoir.page';
import * as fs                      from 'fs';

import { CartoucheInfo }            from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
var pageLitAuto     : PageLitLitAut;
var pageLitDem      : PageLitDemAvo;
var menu            : MenuAchats;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------
fonction.importJdd();
//------------------------------------------------------------------------------------

const sRayon            = fonction.getInitParam('rayon', 'Fruits et légumes');
const sCodeArticles     = fonction.getInitParam('listeArticles','8494');
const sFournisseur      = fonction.getInitParam('fournisseur','FRUIDOR LYON');
const sPlateformeRecep  = fonction.getInitParam('plateformeReception','Chaponnay');

const nomFichier        = process.env.E2E || 'E2E_FL_LIT';

const sJddFileVeille    = '../../_data/_tmp/' + fonction.getPrefixeEnvironnement() + '_' + nomFichier + '-' + fonction.getToday('us', -1) + '.json';
const sDateAuF:string   = fonction.getToday('FR', 0 ,' / ');
const sDateDuP:string   = fonction.getToday('FR', -7, ' / ');

//------------------------------------------------------------------------------------
    
test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);    
    pageLitAuto     = new PageLitLitAut(page);
    pageLitDem      = new PageLitDemAvo(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async() => {
        await fonction.connexion(page);
    })
    
    test.describe('Page [LITIGES]', async () => {

        var sPageName:string = 'litiges';

        test ('ListBox [RAYON] = "' + sRayon + '"', async() => {
            await menu.selectRayonByName(sRayon, page);
        })

        test ('Menu [LITIGES] - Click', async () => {
            await menu.click(sPageName, page);
        })

        if(fs.existsSync(path.join(__dirname + '../' + sJddFileVeille))) { // S'assurer que le fichier de veille existe avant de faire les check.

            const oDataVeille       = fonction.readFile(sJddFileVeille);
            const sNumLot:string    = oDataVeille.aLots[sCodeArticles];
            const rPrixArticle = parseFloat(oDataVeille.aPrixAchat[sCodeArticles].replace(',', '.')).toFixed(3);
            const iMontantAvoir   =  (Number(rPrixArticle)*10).toFixed(2);  // Montant de la demande d'avoir pour les 10 colis non receptionnés;
           
            test.describe ('Onglet [DEMANDE D\'AVOIR]', async () => {

                test ('Onglet DEMANDE D\'AVOIR] - Click', async () => {
                    await menu.clickOnglet(sPageName, 'demandeAvoir', page);
                })
    
                test ('Message [ERREUR] - Is Not Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
                })
    
                test ('Check [DU JJ - 7] = "' + sDateDuP + '"', async () => {
                    expect(await pageLitDem.inputFieldDateDebut.inputValue()).toBe(sDateDuP);
                })
    
                test ('Check [AU JJ] = "' + sDateAuF + '"', async () => {
                    expect(await pageLitDem.inputFieldDateFin.inputValue()).toBe(sDateAuF);
                })
    
                test ('CheckBox [AFFICHER AUSSI LES DEMANDES TRAITES] - Click', async () => {
                    await fonction.clickElement(pageLitDem.checkBoxToutAfficher);
                })
    
                test ('InputField [LOT] = "' + sNumLot + '"', async () => {        
                    await fonction.sendKeys(pageLitAuto.inputFieldLot, sNumLot.trim(), false, 'Numero Lot');
                    await fonction.wait(page, 500); // Attendre que le filtre soit effectif;
                })
    
                test ('Check [DATE DEMANDE AVOIR] = "' + sDateAuF + '"', async () => {
                    const sDateJour:string = await pageLitDem.tdDateDemandeAvoir.first().textContent();
                    expect(sDateJour).toBe(sDateAuF);
                    log.set('Date jour : ' + sDateJour);
                })
    
                test ('Check [PLATEFORME RECEPTION] = "' + sPlateformeRecep + '"', async () => {
                    const sPlateformeRecept = await pageLitDem.tdPlateformeReception.first().textContent();
                    expect(sPlateformeRecept).toBe(sPlateformeRecep);
                    log.set('Plateforme reception : ' + sPlateformeRecept);
                })
    
                test ('Check [NUM LOT][0] = "' + sNumLot + '"', async () => {        
                    await fonction.wait(page, 1000);    //-- Attente raffraîchissement page
                    const sNumDemAvoir = await pageLitDem.tdNumDemandeAvoir.first().textContent();
                    log.set('Numéro de demande d\'avoir générée : ' + sNumDemAvoir);
                    expect(await pageLitDem.tdNumLot.first().textContent()).toBe(sNumLot);
                })
    
                test ('Check [CODE ARTICLE] = "' + sCodeArticles + '"', async () => {
                    expect(await pageLitDem.tdCodeArticle.first().textContent()).toBe(sCodeArticles);
                })
    
                const sDesignaytionArticle:string = 'Banane Des Antilles';
                test ('Check [DESIGNATION ARTICLE] = "' + sDesignaytionArticle + '"', async () => {
                    expect(await pageLitDem.tdDesignationArticle.first().textContent()).toBe(sDesignaytionArticle);
                })
    
                const sCodeFournisseur:string = '00015';
                test ('Check [CODE FOURNISSEUR] = "' + sCodeFournisseur + '"', async () => {
                    expect(await pageLitDem.tdCodeFournisseur.first().textContent()).toContain(sCodeFournisseur);
                })
    
                test ('Check [FOURNISSEUR] = "' + sFournisseur + '"', async () => {
                    expect(await pageLitDem.tdDesignFournisseur.first().textContent()).toBe(sFournisseur);
                })
    
                test ('Check [MONTANT] = "' + iMontantAvoir + '"', async () => {
                    expect(await pageLitDem.tdMontant.first().textContent()).toContain(iMontantAvoir);
                    log.set('Montant avoir : ' + iMontantAvoir);
                })
    
                const sQteLitige:string = '10';
                test ('Check [QUANTITE LITIGE] = "' + sQteLitige + '"', async () => {
                    expect(await pageLitDem.tdQteLitige.first().textContent()).toBe(sQteLitige);
                })
    
                const sType:string = 'Quantité';
                test ('Check [TYPE] = "' + sType + '"', async () => {
                    expect(await pageLitDem.tdType.first().textContent()).toBe(sType);
                })
    
                const sRaisonExcepte:string = "Colis manquants à l'arrivage";
                test ('Check [RAISON] = "' + sRaisonExcepte + '"', async () => {
                    expect(await pageLitDem.tdRaison.first().textContent()).toBe(sRaisonExcepte);
                })
    
                const sStatutExcepte:string = 'Approuvée';
                test ('Check [STATUT] = "' + sStatutExcepte + '"', async () => {
                    expect(await pageLitDem.tdStatut.first().textContent()).toBe(sStatutExcepte);
                })
    
                const sBlConcerne:string = 'TA_BL';
                test ('Check [BL CONCERNES] = "' + sBlConcerne + '"', async () => {
                    expect(await pageLitDem.tdBlConcernes.first().textContent()).toContain(sBlConcerne);
                })
            })  // End  Onglet

        } else {
            log.set('Pas de vérification car le TA qui génère le fichier n\'a pas été exécuté à la veille. Fichier ' + sJddFileVeille + ' absent.');
        }
        
    })  // End  Page

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})  // End describe




