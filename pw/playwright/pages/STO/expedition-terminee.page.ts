/**
 * Appli    : STOCK
 * Page     : EXPEDITION
 * Onglet   : EXPEDITIONS TERMINEES
 * 
 * author JOSIAS SIE
 * 
 * @version 3.0
 * 
 * 
 */

import { Page } from "@playwright/test"

export class ExpeditionTermine{

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonImrpimerBL               = this.page.locator('[ng-click="imprimer(dg.selection[0])"]'); 
    public readonly buttonVisualiserBL             = this.page.locator('[ng-click="visualiser(dg.selection[0])"]'); 
    public readonly buttonConsulterDetail          = this.page.locator('[ng-click="visualiserExpedition(dg.selection[0])"]');                

    public readonly dataGridExpeTermine            = this.page.locator('.tab-pane div.datagrid-table-wrapper > table').nth(0).locator('thead > tr > th');

    public readonly checkBoxExpeditions            = this.page.locator('.tab-pane div.datagrid-table-wrapper > table').nth(0).locator('tbody > tr > td > input');

    public readonly datePickerJourneeExpedition    = this.page.locator('span.datepicker-expeditions-terminees > span');
    public readonly datePickerLinkPrev             = this.page.locator('div.datepicker-days > table > thead > tr > th.prev');                        // bouton mois précédent du calendrier
    public readonly datePickerFirstDay             = this.page.locator('div.datepicker-days > table > tbody > tr:nth-child(1) > td:nth-child(1)');   // premier jour du calendrier

    //----------------------------------------------------------------------------------------------------------------
    
    constructor(public readonly page: Page) {}  
}