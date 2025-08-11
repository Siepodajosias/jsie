/**
 * Appli    : QUALITE
 * PAGE     : ACCUEIL
 * Onglet   : ACCUEIL
 * 
 * 
 * @author SIAKA KONE
 * @since 2024-12-12
 * @version 3.2
 * 
 */

import { Locator, Page } from "@playwright/test";
import { TestFunctions } from "@helpers/functions";

export class Authentification {

    public readonly jUsername                   : Locator; //('[name="login"]');  
    public readonly jPassword                   : Locator; //('[name="password"]'); 
    public readonly labelError                  : Locator; //('.text-danger')} 
    
    public readonly connexionButton             : Locator; //('div.actions button') }
    public readonly buttonSupprimerCache        : Locator; //('#clear[type="submit"]') }

    private fonction  = new TestFunctions();

    constructor(page: Page) {

        this.jUsername                          = page.locator('[name="login"]');  
        this.jPassword                          = page.locator('[name="password"]'); 
        this.labelError                         = page.locator('.text-danger'); 
        
        this.connexionButton                    = page.locator('div.actions button');
        this.buttonSupprimerCache               = page.locator('#clear[type="submit"]');
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


    /**
     * Vérifie si un message d'erreur est affiché
     */
    public async isErrorDisplayed () {
        return await this.labelError.isVisible();
    }


}

