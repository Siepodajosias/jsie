/**
 * Appli    : TRADUCTION
 * Menu     : ACCUEIL
 * Onglet   : ACCUEIL
 * 
 * 
 * @author SIAKA KONE
 * @version 3.1
 * 
 */

import { Locator, Page } from "@playwright/test";
import { TestFunctions } from "@helpers/functions";

export class Authentification { 

    public readonly jUsername           : Locator;  
    public readonly jPassword           : Locator; 
    public readonly labelError          : Locator;     
    public readonly connexionButton     : Locator;

    public fonction                     = new TestFunctions();

    constructor(page : Page) {
        this.jUsername                  = page.locator('input[name="login"]');  
        this.jPassword                  = page.locator('input[name="password"]'); 
        this.labelError                 = page.locator('.text-danger');        
        this.connexionButton            = page.locator('div.actions button');
    }

    /**
     * 
     * Saisie le login {value} dans le champ Login
     * 
     * @param {any} value 
     */
    public async setJUsername (value:any) {
        await this.fonction.sendKeys(this.jUsername, value, false, 'Username');
    }


    /**
     * 
     * Saisie le mot de passe {value= dans le champ Password}
     * 
     * @param {string} value 
     */
    public async setJPassword (value:any) {
        await this.fonction.sendKeys(this.jPassword, value, false, 'Password');
    }


    /**
     * Soummet de le formulaire de connexion
     */
    public async clickConnexionButton (page:Page) {
        await this.fonction.clickAndWait(this.connexionButton, page);
    }
    
}
