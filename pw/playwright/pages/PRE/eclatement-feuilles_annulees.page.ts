/**
 * 
 * PREPARATION PAGE > SUIVI ECLATEMENT / ONGLET > FEUILLE ANNULEES DU ...
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class SuiviEclatfeuilleAnnuleesPage {

    public readonly buttonImprimer             : Locator    //.locator('[ng-click="imprimerSelection(false)"]');
    public readonly buttonVisualiser           : Locator    //.locator('[ng-click="visualiserSelection()"]');
    public readonly buttonFilters              : Locator    //.locator('.filters-container button');    

    public readonly linkFermer                 : Locator    //.locator('[ng-click="close($event);"]');
    
    public readonly inputSearchAll             : Locator    //.locator('[ng-model="filters.value"]');    

    public readonly listBoxGroupeArticle       : Locator    //.locator('#filtre-groupe-article');

    public readonly checkBoxPreparateur        : Locator    //.locator('#filter-0');
    public readonly checkBoxNumFeuille         : Locator    //.locator('#filter-1');
    public readonly checkBoxArticle            : Locator    //.locator('#filter-2');
    public readonly checkBoxFournisseur        : Locator    //.locator('#filter-3');  
    public readonly checkBoxNumLot             : Locator    //.locator('#filter-4');

    public readonly dataGridFeuillesAnnulees   : Locator    //.locator('.feuilles-annulees .datagrid-table-wrapper > table > thead > tr > th'); 

    constructor(page:Page){

        this.buttonImprimer             = page.locator('[ng-click="imprimerSelection(false)"]');
        this.buttonVisualiser           = page.locator('[ng-click="visualiserSelection()"]');
        this.buttonFilters              = page.locator('.filters-container button');    
    
        this.linkFermer                 = page.locator('[ng-click="close($event);"]');
        
        this.inputSearchAll             = page.locator('[ng-model="filters.value"]');    
    
        this.listBoxGroupeArticle       = page.locator('#filtre-groupe-article');
    
        this.checkBoxPreparateur        = page.locator('#filter-0');
        this.checkBoxNumFeuille         = page.locator('#filter-1');
        this.checkBoxArticle            = page.locator('#filter-2');
        this.checkBoxFournisseur        = page.locator('#filter-3');  
        this.checkBoxNumLot             = page.locator('#filter-4');
    
        this.dataGridFeuillesAnnulees   = page.locator('.feuilles-annulees .datagrid-table-wrapper > table > thead > tr > th'); 
    }
} 