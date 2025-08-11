/**
 * 
 * AUTHENTIFICATION PAGE  
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.3
 * 
 */

import { Locator, Page}     from "@playwright/test"

import { TestFunctions }    from "../../utils/functions"


export class Authentificationpage {
    
    public readonly jUsername               : Locator;       
    public readonly jPassword               : Locator;       
    public readonly erreur                  : Locator;        
    public readonly connexionButton         : Locator;
    public readonly headerMenu              : Locator;
    public readonly listBoxUser             : Locator;
    public readonly inputUserName           : Locator;
    public readonly linkAutreOption         : Locator;

    private fonction            = new TestFunctions()

    constructor(page:Page){
        this.jUsername          = page.locator('#input-login');        
        this.jPassword          = page.locator('#input-password');        
        this.erreur             = page.locator('[ng-show="erreur"]:NOT(.ng-hide)');        
        this.connexionButton    = page.locator('*css=button, input[type="button"], input[type="submit"] >> text="Connexion"');
        this.headerMenu         = page.locator('[ng-model ="rayon"]');              
        this.listBoxUser        = page.locator('.login-utilisateur');    
        this.linkAutreOption    = page.locator('i.pi-chevron-down');    
        this.inputUserName      = this.jUsername;
    }


    /**
     * 
     * Saisie le login {value} dans le champ Login
     * 
     * @param {any} value 
     */
    public async setJUsername (value:any) {
        await this.jUsername.clear();
        await this.jUsername.fill(value);
    }


    /**
     * 
     * Saisie le mot de passe {value= dans le champ Password}
     * 
     * @param {string} value 
     */
    public async setJPassword (value:any) {
        await this.jPassword.clear();
        await this.jPassword.fill(value);
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
        return await this.erreur.isVisible();
    }


    /**
     * Vérifie que le menu (header) de la page d'accueil est bien affiché.
     * Dans ce cas, signifie que l'on est bien authentifié.
     */
    public async isConnected() {
        var obj :any;
        return await this.headerMenu.count().then((count) => count > 0).then(function(present){
            obj.retour = present;
            return obj;
        })
    }

}