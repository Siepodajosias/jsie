/**
 * Appli    : MAGASIN
 * Menu     : COMMANDES
 * Onglet   : OPPORTUNITES
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */
import { Page} from '@playwright/test';

export class CommandesOpportunites {

    //----------------------------------------------------------------------------------------------------------------    

    public readonly listBoxGroupeArticle       = this.page.locator('#input-groupe');    
    public readonly listBoxStatus              = this.page.locator('#select-opportunite-filter');    

    public readonly inputFamilleArticle        = this.page.locator('.filtres > span > input.filter-input');    

    public readonly dataGridListesCmd          = this.page.locator('.liste-commandes th');
    public readonly dataGridLignesCmd          = this.page.locator('.lignes-commandes th');

    public readonly buttonEnvoyerLaCommande    = this.page.locator('[ng-click="envoyer()"]');
    public readonly buttonEnregsitrer          = this.page.locator('[ng-click="enregistrer()"]');

    //----------------------------------------------------------------------------------------------------------------    

    constructor(public readonly page: Page) {};
}