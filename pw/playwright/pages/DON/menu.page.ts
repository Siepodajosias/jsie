/**
 * Page DON > MENU
 * 
 * @author JOSIAS SIE
 * @version 3.1
 * 
 * 
 */

import { TestFunctions }              from '@helpers/functions';
import { expect, Page, Locator }      from '@playwright/test';

export class MenuDon {

    public menu                    : any;
    public onglets                 : any;
    private verboseMode            : boolean;
    private readonly fonction      : TestFunctions;
    
    public readonly listBoxUser    : Locator;
    public readonly linkDeconnexion: Locator;
    public readonly iSpinner       : Locator;
    private readonly linkPages     : Locator;
    //------------------------------------------------------------------------------------------//

    constructor(page: Page, fonction:TestFunctions = null) {

        this.menu = {
            home            : 0,
            dons            : 1,
            beneficiaires   : 2,
            admin           : 3
        }

        this.onglets = {
            dons         : {
                detailDons       : page.locator('a[href="/dons/liste-don"]'),
                recapitulatifs   : page.locator('a[href="/dons/liste-recapitulatif"]')
            },
            beneficiaires: {
                beneficiaires    : page.locator('a[href="/beneficiaires/liste-beneficiaire"]'),
                suiviAttestations: page.locator('a[href="/beneficiaires/suivi-attestation"]')
            },
            admin        : {
                administration   : page.locator('a[href="/admin/administration"]'),
                changelog        : page.locator('a[href="/admin/app-version"]')
            }
        };

        // --------------------------------------------------------------------------------
        this.listBoxUser    = page.locator('#main-button-utilisateur');
        this.linkDeconnexion= page.locator('#main-button-logout');
        this.linkPages      = page.locator('.navbar-nav a.nav-link');
        this.iSpinner       = page.locator('.app-spinner');
        this.fonction       = fonction;
        
        if (fonction !== null)  { 
            this.verboseMode= fonction.isVerbose();
        } else {
            this.verboseMode= false;
        }
    }

    //------------------------------------------------------------------------------------------//

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
        
        if (typeof(this.menu[cible]) === 'number'){  
            await this.fonction.clickElement(this.linkPages.nth(this.menu[cible]));
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);
        } else {
            throw new Error('Ooops : Elément du menu "' + cible + '" inconnu');
        }
    }  

    /**
    * 
    * Click sur l'onglet {ongletName} situé sur la page {pageName}
    * 
    * @param {string} pageName   Le nom de la page
    * @param {string} ongletName Le nom de l'onglet
    */
    public async clickOnglet(pageName: string, ongletName: string, page: Page, delay:number = 500000, verbose:boolean = this.verboseMode){

        if (verbose) {
            console.log('');
            this.fonction.cartouche("-- Onglet : ",ongletName);
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
     * Vérifie si l'onglet est visible.
     * 
     * @param {string} pageName
     * @param {string} ongletName 
     * @param {Locator} page  
     */
    public async visibleOnglet(pageName: string, ongletName: string, page: Page){
        var index = this.onglets[pageName].indexOf(ongletName);    // Position de l'onglet dans la barre des onglets
        if (index > -1) {  
            expect(page.locator('.p-tabmenu.p-component .p-menuitem-link').nth(index)).toBeVisible();          
        } else {
            throw new Error(' Onglet "' + ongletName + '" inconnu dans la page "' + pageName + '".');
        }
    }
}