/**
 * Page NOMENCLATURE > MENU
 * 
 * @author JOSIAS SIE
 * @version 3.4
 * 
 */

import { TestFunctions } from "@helpers/functions";
import { Locator, Page } from "@playwright/test"

export class MenuNomenclature {

    public menu                        : any;
    public onglets                     : any;
    private verboseMode                : boolean;
  
    public readonly listBoxUser        : Locator;
    public readonly linkDeconnexion    : Locator;
    public readonly alertVersionMessage: Locator;
    private readonly linkPages         : Locator;

    //------------------------------------------------------------------------------------------

    private readonly fonction        : TestFunctions;

    constructor (page: Page, fonction:TestFunctions = null) {

        this.menu = {
            accueil             : 0,
            articles            : 1,
            groupeArticle       : 2,
            caracteristiques    : 3,
            nomenclature        : 4,
            composition         : 5,
            admin               : 6
        }

        this.onglets = {
            //-----------------------Page administration------------------------------
            admin: {
                administration          : page.locator('a[href="/admin/administration"]'),
                communicationUtlisateurs: page.locator('a[href="/admin/communication"]'),
                parametrage             : page.locator('a[href="/admin/parametrage"]'),
                Changelog               : page.locator('a[href="/admin/changelog"]')
            }
        }

        this.listBoxUser        = page.locator('#dropdownBasic1');
        this.linkDeconnexion    = page.locator('.dropdown-menu button');
        this.linkPages          = page.locator('a.nav-link');
        this.alertVersionMessage= page.locator('.app-update');

        this.fonction           = fonction;

        if (fonction !== null)  { 
            this.verboseMode        = fonction.isVerbose();
        } else {
            this.verboseMode        = false;
        }

    }

    //------------------------------------------------------------------------------------------

    /**
    * 
    * Click sur l'onglet {ongletName} situé sur la page {pageName}
    * 
    * @param {string} pageName      
    * @param {string} ongletName 
    */
    public async clickOnglet(pageName: string, ongletName: string, page: Page, delay:number = 5000, verbose:boolean = this.verboseMode){

        if (verbose) {
            console.log('');
            this.fonction.cartouche("-- Onglet : ",ongletName);
        }
        // On verifie si une alerte est visible si oui on la ferme.
        if (await this.alertVersionMessage.isVisible()) {
            console.log('Alerte visible');
            const element = page.locator('.app-update');              
            await element.evaluate((node) => node.setAttribute("hidden",''));
            console.log('Ajout de l\'attribut hidden');          
        }
        
        if (this.onglets[pageName][ongletName]) {
            await this.fonction.clickElement(this.onglets[pageName][ongletName]);
            this.fonction.checkTraductions(this.onglets[pageName][ongletName].textContent());
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);
        } else {
            throw new Error('Ooops : Onglet "' + ongletName + '" inconnu dans la page "' + pageName + '".')
        }

    }  

    /**
    * 
    * Click sur le bouton {cible} du menu
    * 
    * @param {string} cible 
    */
    public async click(cible: string, page: Page, delay:number = 5000, verbose:boolean = this.verboseMode) {

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
        
        if (typeof(this.menu[cible]) === 'number')
        {  
            this.linkPages.nth(this.menu[cible]).click();
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);
        } else {
            throw new Error('Ooops : Elément du menu "' + cible + '" inconnu')
        }

    }  

}