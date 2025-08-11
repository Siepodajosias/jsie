/**
 * Appli    : STOCK
 * Menu     : REAPPRO
 * Onglet   : REAPPRO TERMINE
 * 
 * author JOSIAS SIE
 * 
 * @version 3.0
 * 
 */

import { Page } from "@playwright/test"

export class ReapproTermne{

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly dataGridListeReappro               = this.page.locator('reappro-wrapper tr:nth-child(1) th');

    public readonly datePickerDateDesMissions          = this.page.locator('p-calendar');

    //----------------------------------------------------------------------------------------------------------------    

    constructor(public readonly page: Page) {} 
}