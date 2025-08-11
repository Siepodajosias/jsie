/**
 * Appli    : MAGASIN
 * Page     : ACCUEIL
 * Onglet   : Suivi des engagements
 * 
 * @author Esli Ariel BAHILI
 * @version 3.1
 * 
 */

import { Page } from "@playwright/test"

export class AccueilSuiviEngagements {

    public readonly dataGridArticles    = this.page.locator('table.p-datatable-table thead tr:nth-child(1) th');
    
    public readonly spinner             = this.page.locator('i.app-spinner');

    constructor(public readonly page: Page) {}
    
}