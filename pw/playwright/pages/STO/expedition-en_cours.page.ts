/**
 * Appli    : STOCK
 * Menu     : EXPEDITION
 * Onglet   : EXPEDITIONS EN COURS
 * 
 * author JC CALVIERA
 * 
 * @version 3.0
 * 
 * 
 */

import { Page } from "@playwright/test"

export class ExpeditionEnCours {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonImprimerPlan             = this.page.locator('[ng-click="imprimerPlanChargement(dg.selection[0])"]');
    public readonly buttonVisualiserPlan           = this.page.locator('[ng-click="imprimerPlanChargement(dg.selection[0],true)"]');
    public readonly buttonimprimerBL               = this.page.locator('[ng-click="imprimerBonLivraison(dg.selection[0])"]');
    public readonly buttonVisualiserBL             = this.page.locator('[ng-click="imprimerBonLivraison(dg.selection[0],true)"]');
    public readonly buttonModifier                 = this.page.locator('[ng-click="editerExpedition(dg.selection[0])"]');
    public readonly buttonAbandonner               = this.page.locator('[ng-click="openConfirmationAbandon(dg.selection[0])"]');          
    public readonly buttonTerminer                 = this.page.locator('[ng-click="openTerminerExpedition(dg.selection[0])"]');         

    public readonly dataGridExpeCours              = this.page.locator('.tab-pane div.datagrid-table-wrapper > table').nth(0).locator('thead > tr > th');

    //----------------------------------------------------------------------------------------------------------------    
    constructor(public readonly page: Page) {}    
}