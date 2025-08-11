/**
 * Page     : STOCK 
 * Menu     : STOCK
 * Onglet   : HISTORIQUE DES MOUVEMENTS
 * 
 * author JC CALVIERA
 * 
 * @version 3.1
 * 
 * 
 */

import { Page }          from "@playwright/test";

export class StockMouvements{

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonAfficherMvt          = this.page.locator('.form-btn-section button');
    public readonly buttonRechercher           = this.page.locator('button span.pi-search');    

    public readonly inputFiltreNumLot          = this.page.locator('app-recherche-historique-mouvements sigale-input');
    public readonly inputFiltreArticle         = this.page.locator('p-autocomplete input');    
    public readonly pMultiselectPlateformeDist = this.page.locator('app-recherche-historique-mouvements p-multiselect');

    public readonly datePickerReceptionFrom    = this.page.locator('p-calendar input').nth(0);
    public readonly datePickerReceptionTo      = this.page.locator('p-calendar input').nth(1);

    public readonly dataGridLots               = this.page.locator('.first-line th');
    
    //----------------------------------------------------------------------------------------------------------------    
    constructor(public readonly page: Page) {} 
}