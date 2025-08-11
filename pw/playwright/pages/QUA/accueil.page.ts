/**
 * Appli    : QUALITE
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

    public readonly labelWelcomeMessage         : Locator; //('.footerBar > button'); 

    constructor(page: Page) {
        this.labelWelcomeMessage                 = page.locator('home div.titre div'); 
    }

}

