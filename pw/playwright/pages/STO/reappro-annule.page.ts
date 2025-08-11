/**
 * Appli    : STOCK
 * Menu     : REAPPRO
 * Onglet   : REAPPRO ANNULE
 * 
 * author JOSIAS SIE
 * 
 * @version 3.0
 * 
 */

import { Page } from "@playwright/test"

export class ReapproAnnule{

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly dataGridListeReappro               = this.page.locator('thead tr.first-line th');

    public readonly datePickerDateDesMissions          = this.page.locator('p-calendar');

    //----------------------------------------------------------------------------------------------------------------    
    constructor(public readonly page: Page) {}    
}