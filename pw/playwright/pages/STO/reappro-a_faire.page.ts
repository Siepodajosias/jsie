/**
 * Appli    : STOCK
 * Menu     : REAPPRO
 * Onglet   : A FAIRE
 * 
 * author JOSIAS SIE
 * 
 * @version 3.0
 * 
 */

import { Page } from "@playwright/test"

export class ReapproAFaire{
    public readonly buttonAnnuler          = this.page.locator('.form-btn-section button');
    public readonly dataGridListeReappro   = this.page.locator('app-reappro-a-faire tr:nth-child(1) th');

    constructor(public readonly page: Page) {} 
}