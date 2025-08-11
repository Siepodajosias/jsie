/**
 * Appli    : STOCK
 * Menu     : STOCK
 * Onglet   : OCCUPATION DES EMPLACEMENTS
 * 
 * author JOSIAS SIE
 * 
 * @version 3.0
 * 
 */

import { Page }          from "@playwright/test";

export class StockEmplacements{

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonMAJ                  = this.page.locator('[ng-click="loadOccupation()"]');
    public readonly buttonImpEmplaceVides      = this.page.locator('[ng-click="imprimerEmplacementsVides()"]');

    public readonly dataGridEmplacements       = this.page.locator('.tab-pane div.datagrid-table-wrapper > table > thead > tr > th');

    //----------------------------------------------------------------------------------------------------------------  
    constructor(public readonly page: Page) {}    
}