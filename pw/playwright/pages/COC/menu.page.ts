/**
 * Page CONCURRENCE > MENU
 * 
 * @author JOSIAS SIE
 * @version 3.2
 * 
 */

import { TestFunctions }                    from "@helpers/functions";
import { FunctionAria }                     from "@helpers/ariaSnapshot";

import { Locator, Page, TestInfo }          from "@playwright/test"
import { AriaSnapshot }                     from '@commun/types';

export class  MenuConcurrence {

    public menu                     : any;

    public readonly page            : Page;
    public readonly listBoxUser     : Locator;
    public readonly linkDeconnexion : Locator;
    private readonly linkPages      : Locator;
    private readonly listRayon      : Locator;
    private readonly listRayonItem  : Locator;

    private verboseMode             : boolean;
    private bAriaSnapshot           : boolean = false; 

    private readonly fonction       : TestFunctions;
    private fonctionAria            : FunctionAria;

    constructor(page: Page, fonction:TestFunctions = null) {

        this.menu = {
            accueil         : 0,
            articles        : 1,
            releves         : 2,
            categories      : 3,
            admin           : 4
        }

        // --------------------------------------------------------------------------------
        this.listRayon      = page.locator('.nav-item div[aria-haspopup="listbox"]');
        this.listRayonItem  = page.locator('p-dropdownitem li[role="option"]');
        this.listBoxUser    = page.locator('#dropdownBasic1');// utilisateurDropdown
        this.linkDeconnexion= page.locator('.dropdown-item.btn.btn-link');
        this.linkPages      = page.locator('.navbar-nav a.nav-link');

        this.fonction           = fonction;
        this.page               = page;

        if (fonction !== null)  { 
            this.verboseMode = fonction.isVerbose();
        } else {
            this.verboseMode = false;
        }
    }

    /**
    * 
    * Click sur le bouton {pageName} du menu
    * 
    * @param {string} pageName 
    */
    public async click(pageName: string, page: Page, delay:number = 5000, verbose:boolean = this.verboseMode) {
       
        if (typeof(this.menu[pageName]) === 'number') {  

            if (this.verboseMode) {
                console.log('');
                this.fonction.cartouche("-- Page : ",pageName);
            }

            this.fonction.clickElement(this.linkPages.nth(this.menu[pageName]));

            await this.fonction.waitTillHTMLRendered(page, delay, verbose);
            
            //-- Si le paramètre "bAriaSnapshot" est activé, on examine la page.
            if(this.bAriaSnapshot){
                await this.fonctionAria.searchNewElements(pageName, 'NoExists');
            }

        } else {
            throw new Error('Ooops : Elément du menu "' + pageName + '" inconnu')
        }

    } 
            
    /**
     * 
     * @desc : Sélectionnne un rayon de la liste déroulante située dans le menu
     * @param {string} sLibelleRayon - Nom de du rayon (Exemple : 'Fruits et légumes')
     * @param {Page} page
     * 
     */
    public async choixRayon(sLibelleRayon: string) {
        await this.fonction.clickElement(this.listRayon);
        await this.fonction.clickElement(this.listRayonItem.filter({hasText:sLibelleRayon}).nth(0));
    }

    
    /**
     * 
     * @param tesTinfo 
     * @description : Recherche les nouveaux éléments de la page (ListBox, button, Input, etc.)
     */
    public async searchNewElements(tesTinfo:TestInfo ) {

        //-- On souhaite exploiter les fonctionnalités de la classe "FunctionAria"
        this.bAriaSnapshot  = true;

        const oData:AriaSnapshot = {
            page        : this.page,
            oTestInfo   : tesTinfo,
            fonction    : this.fonction
        }

        this.fonctionAria   = new FunctionAria(oData);

        //-- Propagation de l'information dans la classe "FunctionAria"
        if (this.verboseMode) {
            this.fonctionAria.verboseMod(true);
        }        

        //this.fonctionAria.verboseMod(true);

    }

    /**
     * 
     * @description : Affiche les nouveaux éléments de la page (ListBox, button, Input, etc.)
     */
    public async showNewElements(){
        return this.fonctionAria.showNewElements();
    }

}