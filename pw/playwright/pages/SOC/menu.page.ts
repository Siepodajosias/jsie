/**
 * 
 * SOCIETES PAGE > MENU
 * 
 * @author Vazoumana Diarrassouba, JOSIAS SIE & JCC
 * @version 3.7
 * 
 */

import { TestFunctions }                    from "@helpers/functions";
import { FunctionAria }                     from "@helpers/ariaSnapshot";

import { Locator, Page, TestInfo }          from "@playwright/test"
import { AriaSnapshot }                     from '@commun/types';

export class MenuSociete {

    public menu                             : any;
    public webService                       : any; 
    private onglets                         : any;
    private verboseMode                     : boolean;
    private bAriaSnapshot                   : boolean = false; 

    public readonly page                    : Page;
    public readonly listBoxUser             : Locator
    public readonly linkDeconnexion         : Locator
    public readonly alertVersionMessage     : Locator
    private readonly linkPages              : Locator


    private readonly fonction               : TestFunctions;
    private fonctionAria                    : FunctionAria;

    constructor (page: Page, fonction:TestFunctions = null, ) {

        this.menu   = {
            accueil             : 0,
            lieuxVente          : 1,
            organisation        : 2,
            societes            : 3,
            clients             : 4,
            parametrage         : 5,
            admin               : 6
        }

        this.onglets = {

            //-----------------------Page admin------------------------

            admin: {
                administration           : page.locator('a.p-tabview-nav-link').nth(0),
                diffusion                : page.locator('a.p-tabview-nav-link').nth(1),
                communicationUtilisateurs: page.locator('a.p-tabview-nav-link').nth(2),
                changeLog                : page.locator('a.p-tabview-nav-link').nth(3)
            }
        };

        this.listBoxUser        = page.locator('#dropdownBasic1');
        this.linkDeconnexion    = page.locator('button.dropdown-item');
        this.linkPages          = page.locator('a.nav-link');
        this.alertVersionMessage= page.locator('.app-update');

        this.fonction           = fonction;
        this.page               = page;

        if (fonction !== null)  { 
            this.verboseMode        = fonction.isVerbose();
        } else {
            this.verboseMode        = false;
        }
        
    }

    //----------------------------------------------------------------------------------

    /**
     * 
     * Click sur le menu dénomé {pageName}
     * 
     * @param {string} pageName L'identifiant du menu
     * @param {Page}   page
     * 
    */
    public async click(pageName: string, page: Page, delay:number = 50000, verbose:boolean = this.verboseMode) {

        if(typeof(this.menu[pageName]) == 'number'){

            if (verbose) {
                console.log('');
                this.fonction.cartouche("-- Page : ",pageName);
            }

            // On verifie si une alerte est visible si oui on la ferme.
            if (await this.alertVersionMessage.isVisible()) {
                console.log('Alerte visible');
                const element = page.locator('.app-update');              
                await element.evaluate((node) => node.setAttribute('hidden',""));
                console.log('Ajout de l\'attribut hidden');               
            } 
            
            //-- Détermination du nom de l'onglet par défaut
            var sNomOnglet = 'NotExists';
            if(this.onglets[pageName] !== undefined) {
                sNomOnglet = Object.keys(this.onglets[pageName])[0];
            }

            await this.fonction.clickElement(this.linkPages.nth(this.menu[pageName]));

            this.fonction.checkTraductions(await this.linkPages.nth(this.menu[pageName]).textContent());

            await this.fonction.waitTillHTMLRendered(page, delay, verbose);

            //-- Si le paramètre "bAriaSnapshot" est activé, on examine la page.
            if(this.bAriaSnapshot){
                await this.fonctionAria.searchNewElements(pageName, sNomOnglet);
            }

            //-- On click sur le premier onglet afin d'activer la coloration de l'onglet
            if (sNomOnglet !== 'NotExists')   {
                await this.fonction.clickElement(this.onglets[pageName][sNomOnglet]);
            }

        } else {
            throw new Error('JCC : Elément du menu "' + pageName + '" inconnu')
        }

    }


    /**
     * 
     * @desc : Click sur l'onglet {ongletName} situé sur la page {pageName} 
     * @param {string} pageName      
     * @param {string} ongletName 
     * @param {Page}   page
    */
    public async clickOnglet(pageName: string, ongletName:string, page:Page, delay:number = 500000, verbose:boolean = this.verboseMode) {

        if (this.onglets[pageName][ongletName]) {

            if (verbose) {
                console.log('');
                this.fonction.cartouche("-- Onglet : ",ongletName);
            }

            await this.fonction.clickElement(this.onglets[pageName][ongletName]);
            this.fonction.checkTraductions(this.onglets[pageName][ongletName].textContent());
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);

            //-- Si le paramètre "bAriaSnapshot" est activé, on examine la page.
            if(this.bAriaSnapshot){
                await this.fonctionAria.searchNewElements(pageName, ongletName)
            }

        } else {
            throw new Error('JCC : Onglet "' + ongletName + '" inconnu dans la page "' + pageName + '".')
        }
      
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