/**
 * 
 * PREPARATION PAGE > SUIVI ECLATEMENT / ONGLET > FEUILLES PREPAREES EXP DU ...
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class SuiviEclatfeuillesPrepareesExpPage {

    public readonly buttonImprimer             : Locator   //.locator('[ng-click="imprimerSelection(false)"]');
    public readonly buttonVisualiser           : Locator   //.locator('[ng-click="visualiserSelection()"]');
    public readonly buttonSyntCorrectPrepa     : Locator
    public readonly buttonFilters              : Locator   //.locator('.filters-container button');    
    public readonly contAction                 : Locator   //.locator('.contAction');
    public readonly iconPencil                 : Locator   //.locator('.icon-pencil');  

    public readonly linkFermer                 : Locator   //.locator('[ng-click="close($event);"]');

    public readonly inputSearchMagasin         : Locator   //.locator('[ng-model="filtreMagasin"]');
    public readonly inputSearchAll             : Locator   //.locator('[ng-model="ngModel"]');    

    public readonly listBoxGroupeArticle       : Locator   //.locator('#filtre-groupe-article');
    public readonly listBoxUnitesPreparation   : Locator   //.locator('#filtre-unite-preparation');

    public readonly checkBoxPreparateur        : Locator   //.locator('#filter-0');
    public readonly checkBoxNumFeuille         : Locator   //.locator('#filter-1');
    public readonly checkBoxArticle            : Locator   //.locator('#filter-2');
    public readonly checkBoxFournisseur        : Locator   //.locator('#filter-3');
    public readonly checkBoxNumPalette         : Locator   //.locator('#filter-4');    
    public readonly checkBoxNumLot             : Locator   //.locator('#filter-5');

    public readonly dataGridFeuillesPreparees  : Locator   //.locator('.datagrid-table-wrapper > table').nth(0).locator('thead > tr > th');   
    public readonly dataTableFeuillesPreparees : Locator 

    //Pop up Modification de la feuille
    public readonly pInputRaisonModif          : Locator   //.locator('[ng-model="feuilleAModifier.raison"]');    
    public readonly pButtonValiderModif        : Locator   //.locator('#btn-valider-modification'); 

    constructor(page: Page){

        this.buttonImprimer             = page.locator('[ng-click="imprimerSelection(false)"]');
        this.buttonVisualiser           = page.locator('[ng-click="visualiserSelection()"]');
        this.buttonSyntCorrectPrepa     = page.locator('synthese-des-corrections-wrapper button')
        this.buttonFilters              = page.locator('.filters-container button');    
        this.contAction                 = page.locator('.contAction');
        this.iconPencil                 = page.locator('.icon-pencil');  

        this.linkFermer                 = page.locator('[ng-click="close($event);"]');

        this.inputSearchMagasin         = page.locator('[ng-model="filtreMagasin"]');
        this.inputSearchAll             = page.locator('[ng-model="ngModel"]');    

        this.listBoxGroupeArticle       = page.locator('#filtre-groupe-article');
        this.listBoxUnitesPreparation   = page.locator('#filtre-unite-preparation');

        this.checkBoxPreparateur        = page.locator('#filter-0');
        this.checkBoxNumFeuille         = page.locator('#filter-1');
        this.checkBoxArticle            = page.locator('#filter-2');
        this.checkBoxFournisseur        = page.locator('#filter-3');
        this.checkBoxNumPalette         = page.locator('#filter-4');    
        this.checkBoxNumLot             = page.locator('#filter-5');

        this.dataGridFeuillesPreparees  = page.locator('.datagrid-table-wrapper > table').nth(0).locator('thead > tr > th');  
        this.dataTableFeuillesPreparees = page.locator('.feuilles-preparees tbody tr');


        //Pop up Modification de la feuille
        this.pInputRaisonModif          = page.locator('[ng-model="feuilleAModifier.raison"]');    
        this.pButtonValiderModif        = page.locator('#btn-valider-modification');
    }
}