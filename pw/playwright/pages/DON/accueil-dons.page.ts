/**
 * Appli    : DONS
 * Menu     : ACCUEIL
 * Onglet   : HOME
 * 
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */
import { Page }    from "@playwright/test"

export class AccueilDons { 

    public readonly  labelWelcomeMessage = this.page.locator('home div.titre div');

    constructor(public readonly page: Page) {}           
}

