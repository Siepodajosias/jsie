/**
 * 
 * PREPARATION PAGE > PRODUCTIVITE / ONGLET > VALIDATION JOURNEE DE PREPARATION DU ...
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class ProdValidationJrneePrepaPage {

    
    public readonly buttonValider    : Locator   // .locator('[ng-click="validerJourneePreparation()"]');
    public readonly buttonInvalider  : Locator   // .locator('[ng-click="invaliderJourneePreparation()"]');      
    
    public readonly linkImporter     : Locator   // .locator('[ng-click="$event.preventDefault(); afficherTabImport();"]'); 

    constructor(page:Page){
        
        this.buttonValider    = page.locator('[ng-click="validerJourneePreparation()"]');
        this.buttonInvalider  = page.locator('[ng-click="invaliderJourneePreparation()"]');      
        
        this.linkImporter     = page.locator('[ng-click="$event.preventDefault(); afficherTabImport();"]'); 
    }
}