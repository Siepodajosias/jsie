/**
 * Appli    : STOCK
 * Menu     : Accueil
 * Onglet   : ---
 * 
 * author JOSIAS SIE
 * 
 * @version 3.0
 * 
 */

import { Page } from "@playwright/test"

export class Accueil {

    public readonly dataGridRecaptitulatif     = this.page.locator('p-table.recapitulatif').nth(0).locator('th');

    constructor(public readonly page: Page) {}    
}