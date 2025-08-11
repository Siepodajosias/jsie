/**
 * Appli    : DONS
 * Menu     : ACCUEIL
 * Onglet   : ACCUEIL
 * 
 * 
 * @author JOSIAS SIE
 * @version 3.1
 * 
 */
import { Page }             from "@playwright/test";
import { TestFunctions }    from "@helpers/functions";

export class Authentification { 

    public readonly jUsername               = this.page.locator('[name="login"]');  
    public readonly jPassword               = this.page.locator('[name="password"]'); 
    public readonly LabelError              = this.page.locator('.text-danger'); 
    
    public readonly connexionButton         = this.page.locator('div.actions button');
    public readonly buttonSupprimerCache    = this.page.locator('#clear[type="submit"]');

    private fonction  = new TestFunctions();

    constructor(public readonly page: Page) {}

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