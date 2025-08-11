/**
 * Appli    : ACHATS
 * Menu     : ACCUEIL
 * Onglet   : RECHERCHE LOT
 * 
 * 
 * @author JC CALVIERA
 * @version 3.0
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageAccReclot {

    public readonly buttonRechercher            :Locator;

    public readonly inputNumAchat               :Locator;
    public readonly inputNumLot                 :Locator;

    public readonly dataGridListeachats         :Locator;

    //--

    constructor(public readonly page: Page) {
        
        this.page = page;

        this.buttonRechercher            = page.locator('[ng-click="rechercher()"]');

        this.inputNumAchat               = page.locator('[ng-model="numeroAchat"]');
        this.inputNumLot                 = page.locator('[ng-model="numeroLot"]');
    
        this.dataGridListeachats         = page.locator('.accueil-recherche-rapide-admin th');;
    }



}