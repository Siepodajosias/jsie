/**
 * Appli    : STOCK
 * Menu     : REAPPRO
 * Onglet   : SUPERVISION
 * 
 * author JOSIAS SIE
 * 
 * @version 3.1
 * 
 */

import { Page } from "@playwright/test"

export class ReapproSupervision {//
    
    public readonly dataGridListeReappro   = this.page.locator('app-supervision tr:nth-child(1) th');

    public readonly buttonRafraichir       = this.page.locator('button span.pi-refresh');
    public readonly buttonCreerMission     = this.page.locator('.form-btn-section button');

    public readonly datePickerDate         = this.page.locator('p-calendar input');
  
    constructor(public readonly page: Page) {} 
    
}