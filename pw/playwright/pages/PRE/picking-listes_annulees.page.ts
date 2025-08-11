/**
 * 
 * PREPARATION PAGE > SUIVI PICKING / ONGLET > LISTES A ANNULEES DU ...
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class SuiviPickListesAnnuleesPage {

    public readonly buttonImprimer          : Locator   // .locator('[ng-click="imprimerSelection(true)"]');
    public readonly buttonVisualiser        : Locator   // .locator('[ng-click="visualiserSelection()"]');
    public readonly buttonFilters           : Locator   // .locator('.filters-container button');

    public readonly linkFermer              : Locator   // .locator('[ng-click="close($event);"]');    
    
    public readonly inputSearchAll          : Locator   // .locator('[ng-model="filters.value"]');    

    public readonly checkBoxNumListe        : Locator   // .locator('#filter-0');
    public readonly checkBoxChemin          : Locator   // .locator('#filter-1');
    public readonly checkBoxMagasin         : Locator   // .locator('#filter-2');  

    public readonly dataGridListesAnnulees  : Locator   // .locator('.liste-a-servir-annule .datagrid-table-wrapper > table > thead > tr > th');

    constructor(page:Page){

        this.buttonImprimer          = page.locator('[ng-click="imprimerSelection(true)"]');
        this.buttonVisualiser        = page.locator('[ng-click="visualiserSelection()"]');
        this.buttonFilters           = page.locator('.filters-container button');

        this.linkFermer              = page.locator('[ng-click="close($event);"]');    
        
        this.inputSearchAll          = page.locator('[ng-model="filters.value"]');    

        this.checkBoxNumListe        = page.locator('#filter-0');
        this.checkBoxChemin          = page.locator('#filter-1');
        this.checkBoxMagasin         = page.locator('#filter-2');  

        this.dataGridListesAnnulees  = page.locator('.liste-a-servir-annule .datagrid-table-wrapper > table > thead > tr > th');
    }
}