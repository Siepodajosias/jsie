/**
 * Appli    : STOCK
 * Menu     : REAPPRO
 * Onglet   : EN COURS
 * 
 * author JOSIAS SIE
 * 
 * @version 3.0
 * 
 */

import { Page } from "@playwright/test"

export class ReapproEnCours{
    
    public readonly buttonAnnuler          = this.page.locator('.form-btn-section button');
    public readonly dataGridListeReappro   = this.page.locator('app-reappro-en-cours tr:nth-child(1) th');

    constructor(public readonly page: Page) {} 
}