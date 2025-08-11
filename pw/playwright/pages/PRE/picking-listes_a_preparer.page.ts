/**
 * 
 * Appli    : PREPARATION 
 * PAGE     : SUIVI PICKING 
 * ONGLET   : LISTES A PREPARER.
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.2
 * 
 */

import { Locator, Page } from "@playwright/test"

export class SuiviPickListesAPreparerPage {

    public readonly buttonImprimer              : Locator;   //.locator('[ng-click="imprimerSelection(true)"]');
    public readonly buttonVisualiser            : Locator;   //.locator('[ng-click="visualiserSelection()"]');
    public readonly buttonPreparerVocal         : Locator;   //.locator('[ng-click="preparerEnVocal(dg.selections)"]');
    public readonly buttonPreparerManuellement  : Locator;   //.locator('[ng-click="preparerManuellement(dg.selection)"]');    
    public readonly buttonFilters               : Locator;   //.locator('.filters-container button');

    public readonly linkFermer                  : Locator;   //.locator('[ng-click="close($event);"]');

    public readonly inputSearchAll              : Locator;   //.locator('[ng-model="filters.value"]');    
    public readonly inputFilter                 : Locator;   //.locator('.fit.filters-container span input')   

    public readonly checkBoxTournee             : Locator;   //.locator('#filter-0');
    public readonly checkBoxNumListe            : Locator;   //.locator('#filter-1');
    public readonly checkBoxChemin              : Locator;   //.locator('#filter-2');
    public readonly checkBoxMagasin             : Locator;   //.locator('#filter-3');  

    public readonly dataGridFeuillesAPreparer   : Locator;   //.locator('.liste-a-servir-apreparer .datagrid-table-wrapper > table > thead > tr > th'); 
    public readonly dataGridCodeListe           : Locator;   //.locator('.liste-a-servir-apreparer .datagrid-table-wrapper > table > tbody > tr > td.datagrid-numeroSupportPrepa');  
    
    constructor(page:Page) {

        this.buttonImprimer              = page.locator('[ng-click="imprimerSelection(true)"]');
        this.buttonVisualiser            = page.locator('[ng-click="visualiserSelection()"]');
        this.buttonPreparerVocal         = page.locator('[ng-click="preparerEnVocal(dg.selections)"]');
        this.buttonPreparerManuellement  = page.locator('[ng-click="preparerManuellement(dg.selection)"]');    
        this.buttonFilters               = page.locator('.filters-container button');

        this.linkFermer                  = page.locator('[ng-click="close($event);"]');

        this.inputSearchAll              = page.locator('[ng-model="filters.value"]');
        this.inputFilter                 = page.locator('.fit.filters-container span input')               

        this.checkBoxTournee             = page.locator('#filter-0');
        this.checkBoxNumListe            = page.locator('#filter-1');
        this.checkBoxChemin              = page.locator('#filter-2');
        this.checkBoxMagasin             = page.locator('#filter-3');  

        this.dataGridFeuillesAPreparer   = page.locator('.liste-a-servir-apreparer .datagrid-table-wrapper > table > thead > tr > th');    
        this.dataGridCodeListe           = page.locator('.liste-a-servir-apreparer .datagrid-table-wrapper > table > tbody > tr > td.datagrid-numeroSupportPrepa');    
    }
}