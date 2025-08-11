/**
 * 
 * AUTHENTIFICATION_NOM PAGE
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page}     from "@playwright/test"

import { TestFunctions }    from "../../utils/functions"


export class AuthentificationNomPage {
    
    public readonly jUsername        : Locator  //.all(by.css('.login input').nth(0);        
    public readonly jPassword        : Locator  //.all(by.css('.login input').nth(1);         
    public readonly connexionButton  : Locator  //(by.css('button');
    public readonly erreur           : Locator  //(by.css('.text-danger');     

    public readonly headerMenu       : Locator  //(by.id('dropdownBasic1');
    public readonly listBoxUser      : Locator  //(by.id('dropdownBasic1'); 

    private fonction             = new TestFunctions()

    constructor(page:Page){

        this.jUsername          = page.locator('.login input').nth(0);        
        this.jPassword          = page.locator('.login input').nth(1);         
        this.connexionButton    = page.locator('button');
        this.erreur             = page.locator('.text-danger');     

        this.headerMenu         = page.locator('#dropdownBasic1');
        this.listBoxUser        = page.locator('#dropdownBasic1'); 
    }

    //-----------------------------------------------------------------------------------------------------------------------------

    /**
     * 
     * Saisie le login {value} dans le champ Login
     * 
     * @param {string} value 
     * @param {Page}   page
     */
    public async setJUsername(value:string, page:Page) {
        this.fonction.waitTillHTMLRendered(page, 30000, false)
        await this.jUsername.clear();
        await this.jUsername.fill(value);
    }


    /**
     * 
     * Saisie le mot de passe {value= dans le champ Password}
     * 
     * @param {string} value 
     * @param {Page}   page
     */
    public async setJPassword(value:string, page:Page) {
        this.fonction.waitTillHTMLRendered(page, 30000, false)
        await this.jPassword.clear();
        await this.jPassword.fill(value);  
    }


    /**
     * Soummet de le formulaire de connexion
     * @param {Page}   page
     */
    public async clickConnexionButton(page:Page) {
        await this.fonction.clickAndWait(this.connexionButton, page);
    }


    /**
     * Vérifie si un message d'erreur est affiché
     */
    public async isErrorDisplayed() {
        return this.erreur.isVisible();
    }


    /**
     * Vérifie que le menu (header) de la page d'accueil est bien affiché.
     * Dans ce cas, signifie que l'on est bien authentifié.
     */
    public isConnected() {
        var obj :any;
        return this.headerMenu.count().then((count) => count > 0).then(function(present){
            obj.retour = present;
            return obj;
        })
    }
}