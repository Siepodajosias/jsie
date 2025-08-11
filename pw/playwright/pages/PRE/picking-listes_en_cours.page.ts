/**
 *
 * PREPARATION PAGE > SUIVI PICKING / ONGLET > LISTES EN COURS.
 *
 * @author Vazoumana Diarrassouba
 * @version 3.1
 *
 */
 
import { Locator, Page } from "@playwright/test"
 
export class SuiviPickListesEnCours {
 
    public readonly buttonImprimer          : Locator  //.locator('[ng-click="imprimerSelection(true)"]');
    public readonly buttonVisualiser        : Locator  //.locator('[ng-click="visualiserSelection()"]');
    public readonly buttonFilters           : Locator  //.locator('.filters-container button');
 
    public readonly linkFermer              : Locator  //.locator('[ng-click="close($event);"]');    
   
    public readonly inputSearchAll          : Locator  //.locator('[ng-model="filters.value"]');    
    public readonly inputSearchPreparateur  : Locator  //.locator('[ng-model="filters.value"]');    
 
    public readonly checkBoxPreparateur     : Locator  //.locator('#filter-0');    
    public readonly checkBoxTournee         : Locator  //.locator('#filter-1');
    public readonly checkBoxNumListe        : Locator  //.locator('#filter-2');
    public readonly checkBoxChemin          : Locator  //.locator('#filter-3');
    public readonly checkBoxMagasin         : Locator  //.locator('#filter-4');  
 
    public readonly dataGridFeuillesEnCours : Locator  //.locator('.liste-a-servir-encours .datagrid-table-wrapper > table > thead > tr > th');  
    public readonly dataGridListesEnCours : Locator  //
 
    constructor(page: Page){
 
        this.buttonImprimer           = page.locator('[ng-click="imprimerSelection(true)"]');
        this.buttonVisualiser         = page.locator('[ng-click="visualiserSelection()"]');
        this.buttonFilters            = page.locator('.filters-container button');
   
        this.linkFermer               = page.locator('[ng-click="close($event);"]');    
       
        this.inputSearchAll           = page.locator('[ng-model="filters.value"]');    
        this.inputSearchPreparateur   = page.locator('[ng-model="ngModel"]');    
   
        this.checkBoxPreparateur      = page.locator('#filter-0');    
        this.checkBoxTournee          = page.locator('#filter-1');
        this.checkBoxNumListe         = page.locator('#filter-2');
        this.checkBoxChemin           = page.locator('#filter-3');
        this.checkBoxMagasin          = page.locator('#filter-4');  
   
        this.dataGridFeuillesEnCours  = page.locator('.liste-a-servir-encours .datagrid-table-wrapper > table > thead > tr > th');  
        this.dataGridListesEnCours    = page.locator('table.table.table-striped.table-bordered.table-hover.table-condensed > tbody> tr');  
    }
}