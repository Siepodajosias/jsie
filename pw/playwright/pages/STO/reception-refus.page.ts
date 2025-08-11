/**
 * Page STOCK > RECEPTION > REFUS
 * 
 * author JOSIAS SIE
 * 
 * @version 3.0
 */

import { Page }          from "@playwright/test";

export class ReceptionRefus {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly inputFiltreFournisseur     = this.page.locator('input.filter-input');

    public readonly datePickerRefus            = this.page.locator('input.input-date');

    public readonly dataGridRefus              = this.page.locator('.table-refus div.datagrid-table-wrapper > table > thead > tr > th');

    //----------------------------------------------------------------------------------------------------------------    
    constructor(public readonly page: Page) {}  
}