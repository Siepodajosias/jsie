/**
 * 
 * PREPARATION PAGE > Menu
 * 
 * @author Vazoumana Diarrassouba & JOSIAS SIE
 * @version 3.7
 * 
 */

import { TestFunctions } from "@helpers/functions";
import { Locator, Page } from "@playwright/test";

export class MenuPreparation {

    public menu                         : any
    public onglets                      : any

    private verboseMode                 : boolean;

    public readonly listBoxPlateforme   : Locator;
    public readonly listBoxUser         : Locator;

    public readonly linkDeconnexion     : Locator;
    public readonly alertVersionMessage : Locator;

    private readonly fonction           : TestFunctions;

    constructor (page: Page, fonction:TestFunctions = null) {

        this.menu   = {
            accueil         : '#IDnavbar1  .item0 a',
            eclatement      : '#IDnavbar1  .item1 a',
            productivite    : '#IDnavbar1  .item2 a',
            travaux         : '#IDnavbar1  .item3 a',
            admin           : '#IDnavbar1  .item4 a',
            referentiel     : '#IDnavbar1  .item5 a',
            picking         : '#IDnavbar1  .item6 a',
            menubadge       : '#IDnavbar1  .menu-badgeage a'  
        };

        this.onglets = {
            //-----------------------Page eclatement------------------------------
            eclatement: {
                feuillesAPreparer        : page.locator('[ng-click="displayTab(\'A_PREPARER\')"] a'),
                feuillesEnCours          : page.locator('[ng-click="displayTab(\'EN_COURS\')"] a'),
                feuillesPreparees        : page.locator('[ng-click="displayTab(\'PREPARE\')"] a'),
                feuillesAnnulees         : page.locator('[ng-click="displayTab(\'ANNULE\')"] a')
            },

            //-----------------------Page picking---------------------------------
            picking: {
                listesAPreparer          : page.locator('[ng-click="displayTab(\'A_PREPARER\')"] a'),
                listesEnCours            : page.locator('[ng-click="displayTab(\'EN_COURS\')"] a'),
                listesAValider           : page.locator('[ng-click="displayTab(\'A_VALIDER\')"] a'),
                listesPreparees          : page.locator('[ng-click="displayTab(\'PREPARE\')"] a'),
                listesAnnulees           : page.locator('[ng-click="displayTab(\'ANNULE\')"] a')
            },
   
            //-----------------------Page productivite-----------------------------
            productivite: {
                gestionPreparateurs      : page.locator('li[ng-click="mettreAJourTableau()"] a'),
                importTempsPresence      : page.locator('li[ng-click="afficherTabImportTempsDePresence()"] a'),
                validationJournee        : page.locator('li[ng-click="afficherListeAnomalies(datePrepaTimestamp)"] a'),
                gestionParametres        : page.locator('li[ng-click="afficherParametresProductivite()"] a')
            },

            //-----------------------Page travaux----------------------------------
            travaux: {
                tacheDuJour              : page.locator('li[role="presentation"]').nth(0),
                historique               : page.locator('li[role="presentation"]').nth(1)
            },

            //-----------------------Page referentiel-------------------------------
            referentiel: {
                exploitationProductivite : page.locator('[ng-click="showTab(\'EXCEPTIONS\')"] a'),
                cheminEclatement         : page.locator('[ng-click="showTab(\'CHEMIN_PREP\')"] a'),
                cheminPicking            : page.locator('[ng-click="showTab(\'CHEMIN_PREP_PICKING\')"] a'),
                tourneesPicking          : page.locator('[ng-click="showTab(\'TOURNEES_PICKING\')"] a'),
                parametresImpression     : page.locator('[ng-click="showTab(\'PARAM_IMPRESSION\')"] a'),
                parametresVocaux         : page.locator('[ng-click="showTab(\'PARAM_VOCAUX\')"] a'),
                referentielArticles      : page.locator('[ng-click="showTab(\'REFERENTIEL_ARTICLES\')"] a'),
                modePreparationExceptions: page.locator('[ng-click="showTab(\'MODE_PREPARATION_ET_EXCEPTIONS\')"] a')
            },

            //-----------------------Page admin------------------------------------
            admin: {
                administration           : page.locator('a[href="#administration"]'),
                diffusion                : page.locator('a[href="#diffusion"]'),
                changelog                : page.locator('a[href="#changelog"]'),
                communicationUtilisateur : page.locator('a[href="#communicationUtilisateur"]'),
                vocal                    : page.locator('a[href="#vocal"]')
            }
        }

        this.listBoxPlateforme  = page.locator('[ng-model="plateforme"]');
        this.listBoxUser        = page.locator('.dropdown-toggle');

        this.linkDeconnexion    = page.locator('[ng-click="deconnexion();"]');
        this.alertVersionMessage= page.locator('.app-update');
        
        this.fonction           = fonction;

        if (fonction !== null)  { 
            this.verboseMode    = fonction.isVerbose();
        } else {
            this.verboseMode    = false;
        }
        
    }

    /**
     * 
     * Click sur l'onglet {ongletName} situé sur la page {pageName}
     * 
     * @param {string} pageName L'identifiant du menu     
     * @param {string} ongletName L'identifiant de l'Onglet
     * @param {Page} page
     * 
     */
    public async clickOnglet(pageName:string, ongletName:string, page:Page, delay:number = 5000, verbose:boolean = this.verboseMode){

        if (verbose) {
            console.log('');
            this.fonction.cartouche("-- Onglet : ",ongletName);
        }

        if (this.onglets[pageName][ongletName]) {
            if (this.onglets[pageName][ongletName]) {
                await this.fonction.clickElement(this.onglets[pageName][ongletName]);
                this.fonction.checkTraductions(this.onglets[pageName][ongletName].textContent());
                await this.fonction.waitTillHTMLRendered(page, delay, verbose);
            } else {
                throw new Error('Ooops : Onglet "' + ongletName + '" inconnu dans la page "' + pageName + '".')
            }
        }
    }

    /**
     * 
     * Click sur le bouton {cible} du menu
     * 
     * @param {string} cible L'identifiant du menu
     * @param {Page} page
     * 
     */
    public async click(cible: string, page: Page, delay:number = 5000, verbose:boolean = this.verboseMode) {        

        if (verbose) {
            console.log('');
            this.fonction.cartouche("-- Page : ",cible);
        }
        // On verifie si une alerte est visible si oui on la ferme.
        if (await this.alertVersionMessage.isVisible()) {
            console.log('Alerte visible');
            const element = page.locator('.app-update');              
            await element.evaluate((node) => node.classList.add('ng-hide'));
            console.log('Ajout de l\'attribut hidden');   
        }

        if (typeof(this.menu[cible]) === 'string' )
        {  
            await page.locator(this.menu[cible]).click();
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);
        } else {
            throw new Error('Ooops : Elément du menu "' + cible + '" inconnu')
        }
    } 

    
    /**
     * 
     * Sélectionne la plateforme (Liste déroulante située dans le menu)
     * 
     * @param {string(3)} idPlateforme 
     */
    public async selectPlateforme(idPlateforme: string, page: Page) {
        await this.listBoxPlateforme.selectOption({label: idPlateforme });
        await this.fonction.highlightSelector(this.listBoxPlateforme);
        await this.fonction.addDataSheet('ListBox', 'Plateforme', idPlateforme);
        await this.fonction.waitTillHTMLRendered(page, 30000, false);
    }

}
