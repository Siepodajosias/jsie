/**
 * 
 * PRICING PAGE > MENU
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.4
 * 
 */

import { TestFunctions }                    from "@helpers/functions";
import { FunctionAria }                     from "@helpers/ariaSnapshot";

import { Locator, Page, TestInfo }          from "@playwright/test"
import { AriaSnapshot }                     from '@commun/types';

export class MenuPricing {

    private readonly menu                   : any;
    public readonly onglets                 : any;
    public readonly page                    : Page;
    private verboseMode                     : boolean;
    private bAriaSnapshot                   : boolean = false; 

    public readonly listBoxRayon            : Locator;
    public readonly listBoxUser             : Locator;
    public readonly linkDeconnexion         : Locator;
    public readonly alertVersionMessage     : Locator;

    private readonly fonction               : TestFunctions;
    private fonctionAria                    : FunctionAria;

    constructor (page: Page, fonction:TestFunctions = null) {

        this.menu = {
            accueil         :'#main-navbar .item0 a',
            tarification    :'#main-navbar .item1 a',
            planPromo       :'.rubrique-plan-promo',
            alignements     :'#main-navbar .item2 a',
            gestion         :'#main-navbar .item3 a',
            strategies      :'#main-navbar .item4 a',
            admin           :'#main-navbar .item6 a'
        };

        this.onglets = {
            tarification    : {
                tarification                : page.locator('a[href="#tarification"]'),
                simulationPrix              : page.locator('a[href="#simulation"]'),
                prixPrevisionnels           : page.locator('a[href="#prix-previsionnels"]')
            },
            planPromo       : {
                promotions                  : page.locator('ul.p-tabview-nav li').nth(0),
                communication               : page.locator('ul.p-tabview-nav li').nth(1)
            },
            admin           : {
                administration              : page.locator('a[role="tab"]').nth(0),
                communicationUtilisateurs   : page.locator('a[role="tab"]').nth(1),
                operationsAdmin             : page.locator('a[role="tab"]').nth(2),
                changelog                   : page.locator('a[role="tab"]').nth(3),
                parametrages                : page.locator('a[role="tab"]').nth(4)
            }
        };

        this.listBoxRayon       = page.locator('[ng-model="rayon"]');
        this.listBoxUser        = page.locator('.dropdown-toggle');
        this.linkDeconnexion    = page.locator('[ng-click="deconnexion();"]');
        this.alertVersionMessage= page.locator('.app-update');

        this.fonction           = fonction;
        this.page               = page;

        if (fonction !== null)  { 
            this.verboseMode    = fonction.isVerbose();
        } else {
            this.verboseMode    = false;
        }

    }

    /**
     * 
     * @param {string} pageName L'identifiant du menu
     * @param {Page} page
     * @description Click sur le bouton {pageName} du menu
     * 
     */
    public async click(pageName: string, page: Page) {     
        // On verifie si une alerte est visible si oui on la ferme.
        if (await this.alertVersionMessage.isVisible()) {
            console.log('Alerte visible');
            const element = page.locator('.app-update');              
            await element.evaluate((node) => node.classList.add('ng-hide'));
            console.log('Ajout de l\'attribut hidden');           
        }

        if (typeof(this.menu[pageName]) === 'string' ) {  

            if (this.verboseMode) {
                console.log('');
                this.fonction.cartouche("-- Page : ",pageName);
            }

            //-- Détermination du nom de l'onglet par défaut
            var sNomOnglet = 'NotExists';
            if(this.onglets[pageName] !== undefined) {
                sNomOnglet = Object.keys(this.onglets[pageName])[0];
            }

            await page.locator(this.menu[pageName]).click();

            await this.fonction.waitTillHTMLRendered(page, 50000, this.verboseMode);

            //-- Si le paramètre "bAriaSnapshot" est activé, on examine la page.
            if(this.bAriaSnapshot){
                await this.fonctionAria.searchNewElements(pageName, sNomOnglet);
            }

            //-- On click sur le premier onglet afin d'activer la coloration de l'onglet
            // if (sNomOnglet !== 'NotExists')   {
            //     await this.fonction.clickElement(this.onglets[pageName][sNomOnglet]);
            // }

        } else {
            throw new Error('TypeError: Elément du menu "' + pageName + '" inconnu');
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

        try{  

            if (verbose) {
                console.log('');
                this.fonction.cartouche("-- Onglet : ",ongletName);
            }

            await this.fonction.clickElement(this.onglets[pageName][ongletName]);
            await this.fonction.checkTraductions(await this.onglets[pageName][ongletName].textContent());            
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);

            //-- Si le paramètre "bAriaSnapshot" est activé, on examine la page.
            if(this.bAriaSnapshot){
                await this.fonctionAria.searchNewElements(pageName, ongletName)
            }

        } catch(erreor) {
            throw new Error('Ooops : Onglet "' + ongletName + '" inconnu dans la page "' + pageName + '".')
        }

    }
    
    /**
     * 
     * @param sRayon Le libellé du rayon
     * @param page 
     * @description Sélectionne le rayon via la liste déroulante située dans le menu
     */
    public async selectRayonByName(sRayon:string, page:Page) {
        await this.listBoxRayon.selectOption({label:sRayon});
        await this.fonction.waitTillHTMLRendered(page, 30000);
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