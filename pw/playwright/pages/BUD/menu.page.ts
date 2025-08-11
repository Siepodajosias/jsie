/**
 * 
 * BUDGETS PAGE > MENU
 * 
 * @author SIAKA KONE
 * @version 3.2
 * 
 */

import { TestFunctions }  from "@helpers/functions";
import { Locator, Page } from "@playwright/test"

export class MenuBudgets {

    private readonly menu                   : any;
    public readonly onglets                 : any;
    public readonly page                    : Page;
    private verboseMode                     : boolean;

    public readonly listBoxUser             : Locator;
    public readonly linkDeconnexion         : Locator;
    public readonly alertVersionMessage     : Locator;

    private readonly linkPages              : Locator

    private readonly fonction               : TestFunctions;

    constructor (page: Page, fonction:TestFunctions = null) {

        this.menu = {
            accueil         :   0,
            budgetsMagasin  :   1,
            parametrage     :   2,
            admin           :   3
        };

        this.onglets = {
            budgetsMagasin    : {
                clients                  : page.locator('a[href="/budgets-magasins/clients"]'),
                ecartMarge               : page.locator('a[href="/budgets-magasins/ecarts-marge"]'),
                effectifs                : page.locator('a[href="/budgets-magasins/effectifs"]'),
                chiffreAffaire           : page.locator('a[href="/budgets-magasins/chiffres-affaire"]')
            },

            parametrage    : {
                ouvertureSaisie          : page.locator('a[href="/parametrage/ouverture-saisies"]'),
                impactCalendaire         : page.locator('a[href="/parametrage/impacts-calendaires"]'),
                perimetreConstant        : page.locator('a[href="/parametrage/perimetre-constant"]'),
                informationsMagasin      : page.locator('a[href="/parametrage/informations-magasin"]'),
                coefficientsProgression  : page.locator('a[href="/parametrage/coefficients-de-progression"]'),
                regroupement             : page.locator('a[href="/parametrage/regroupements"]'),
                chargement               : page.locator('a[href="/parametrage/chargements"]')
            },

            admin           : {
                administration           : page.locator('a[href="/admin/administration"]'),
                actions                  : page.locator('a[href="/admin/actions"]')
            }
        };

        this.linkPages          = page.locator('a.nav-link');
        this.listBoxUser        = page.locator('.dropdown-toggle');
        this.linkDeconnexion    = page.locator('.dropdown-item.btn.btn-link');
        this.alertVersionMessage= page.locator('app-update .alert .alert-danger');
        this.fonction           = fonction;

        if (fonction !== null)  { 
            this.verboseMode    = fonction.isVerbose();
        } else {
            this.verboseMode    = false;
        }

    }

    /**
     * 
     * @param {string} cible L'identifiant du menu
     * @param {Page} page
     * @description Click sur le bouton {cible} du menu
     * 
     */
    public async click(cible: string, page: Page) {     

        if (this.verboseMode) {
            console.log('');
            this.fonction.cartouche("-- Page : ",cible);
        }
         // On verifie si une alerte est visible si oui on la ferme.
         if (await this.alertVersionMessage.isVisible()) {
            console.log('Alerte visible');        
            const element = page.locator('.app-update');              
            await element.evaluate((node) => node.setAttribute('hidden',""));
            console.log('Ajout de l\'attribut hidden'); 
        }

        if (typeof(this.menu[cible]) === 'number' ) {  
            await this.fonction.clickElement(this.linkPages.nth(this.menu[cible]));
            await this.fonction.waitTillHTMLRendered(page, 50000, this.verboseMode);
        } else {
            throw new Error('TypeError: Elément du menu "' + cible + '" inconnu');
        }

       

    } 

    
    /**
    *  
    * @param {string} pageName    
    * @param {string} ongletName 
    * @description Click sur l'onglet {ongletName} situé sur la page {pageName}
    * 
    */
    public async clickOnglet(pageName: string, ongletName: string, page: Page, delay:number = 500000, verbose:boolean = this.verboseMode){

        if (verbose) {
            console.log('');
            this.fonction.cartouche("-- Onglet : ",ongletName);
        }
        try{  
            await this.fonction.clickElement(this.onglets[pageName][ongletName]);
            this.fonction.checkTraductions(await this.onglets[pageName][ongletName].textContent());            
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);
        } catch(erreor) {
            throw new Error('Ooops : Onglet "' + ongletName + '" inconnu dans la page "' + pageName + '".')
        }

    }
    
}