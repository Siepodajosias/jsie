/**
 * Appli    : TRADUCTION
 * Menu     : ACCUEIL
 * Onglet   : ACCUEIL
 * 
 * 
 * @author SIAKA KONE
 * @version 3.0
 * 
 */

import { Locator, Page } from "@playwright/test";

export class Accueil { 

    public readonly labelWelcomeMessage   : Locator; //('.input-group [name="login"]');  
    
    constructor(page : Page) {

        this.labelWelcomeMessage          = page.locator('.titre div'); 
        
    }
}
