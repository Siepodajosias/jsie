/**
 * 
 * TRADUCTION PAGE > MENU
 * 
 * @author SIAKA KONE & JOSIAS
 * @version 3.1
 * 
 */

import { TestFunctions } from "@helpers/functions";
import { Locator, Page } from "@playwright/test"

export class MenuTraduction {

    private readonly menu                   : any;
    public readonly page                    : Page;
    private verboseMode                     : boolean;

    public readonly listBoxUser             : Locator;
    public readonly linkDeconnexion         : Locator;
    private readonly linkPages              : Locator

    private readonly fonction               : TestFunctions;

    constructor (page: Page, fonction:TestFunctions = null) {

        this.menu = {
            accueil         : 0,
            dictionnaire    : 1,
            admin           : 2
        };

        this.linkPages          = page.locator('.navbar-nav.mr-auto a');
        this.listBoxUser        = page.locator('#dropdownBasic1');
        this.linkDeconnexion    = page.locator('.dropdown-item.btn.btn-link');

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

        if (typeof(this.menu[cible]) === 'number' ) {  
            await this.fonction.clickElement(this.linkPages.nth(this.menu[cible]));
            await this.fonction.waitTillHTMLRendered(page, 50000, this.verboseMode);
        } else {
            throw new Error('TypeError: Elément du menu "' + cible + '" inconnu');
        }
    } 

    /**
     * 
     * @param {Page} page
     * @description Traduction en anglais.
     * 
     */
    public async traductionAnglais(page:Page) {
        await this.fonction.clickElement(page.locator('.p-dropdown-trigger'));
        await this.fonction.clickElement(page.locator('li[aria-label="English"]'));
    }

    /**
     * 
     * @param {Page} page
     * @description Traduction en italien.
     * 
     */
    public async traductionItalien(page:Page) {
        await this.fonction.clickElement(page.locator('.p-dropdown-trigger'));
        await this.fonction.clickElement(page.locator('li[aria-label="Italiano"]'));
    }
}