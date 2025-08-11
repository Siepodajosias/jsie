/**
 * Page MAGASIN > COMMANDES
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */
import { Page} from '@playwright/test';

export class Commandes {
    

    public readonly jUsername          = this.page.locator('#input-login');        
    public readonly jPassword          = this.page.locator('#input-password');        
    public readonly erreur             = this.page.locator('[ng-show="erreur"]');        
    public readonly connexionButton    = this.page.locator('Connexion');


    setJUsername(value: string) {
        this.jUsername.clear();
        this.jUsername.fill(value);
    };


    setJPassword(value: string) {
        this.jPassword.clear();
        this.jPassword.fill(value);
    };


    clickConnexionButton() {
        this.connexionButton.click();
    };


    isErrorDisplayed() {
        //return this.erreur.isDisplayed();
    }

    constructor(public readonly page: Page) {};

};