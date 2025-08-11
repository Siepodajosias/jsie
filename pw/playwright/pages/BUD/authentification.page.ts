/**
 * Appli    : BUDGET
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

    public readonly jUsername           : Locator; //('.input-group [name="login"]');  
    public readonly jPassword           : Locator; //('.input-group [name="password"]'); 
    public readonly labelError          : Locator; //('.text-danger')} 
    
    public readonly connexionButton     : Locator; //('div.actions button') }

    public fonction                     = new TestFunctions();

    constructor(page : Page) {

        this.jUsername                  = page.locator('.input-group [name="login"]');  
        this.jPassword                  = page.locator('.input-group [name="password"]'); 
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
