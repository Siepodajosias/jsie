/**
 * 
 * PREPARATION PAGE > SUIVI ECLATEMENT / ONGLET > FEUILLE EN COURS
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class SuiviEclatfeuilleEnCoursPage {

    public readonly buttonImprimer             : Locator  //.locator('[ng-click="imprimerSelection(true)"]');
    public readonly buttonVisualiser           : Locator  //.locator('[ng-click="visualiserSelection()"]');
    public readonly buttonFilters              : Locator  //.locator('.filters-container button'); 
    public readonly contAction                 : Locator  //.locator('.contAction');
    public readonly iconPencil                 : Locator  //.locator('.icon-pencil');   

    public readonly linkFermer                 : Locator  //.locator('[ng-click="close($event);"]');

    public readonly inputSearchMagasin         : Locator  //.locator('[ng-model="filtreMagasin"]');
    public readonly inputSearchAll             : Locator  //.locator('[ng-model="ngModel"]');    

    public readonly listBoxVague               : Locator  //.locator('#filtre-vague');
    public readonly listBoxGroupeArticle       : Locator  //.locator('#filtre-groupe-article');

    public readonly checkBoxPreparateur        : Locator  //.locator('#filter-0');
    public readonly checkBoxNumFeuille         : Locator  //.locator('#filter-1');
    public readonly checkBoxArticle            : Locator  //.locator('#filter-2');
    public readonly checkBoxFournisseur        : Locator  //.locator('#filter-3');
    public readonly checkBoxNumLot             : Locator  //.locator('#filter-4');

    public readonly dataGridFeuillesEnCours    : Locator  //.locator('.tab-feuilles-en-cours .datagrid-table-wrapper > table > thead > tr > th'); 
    public readonly dataTableFeuillesEnCours   : Locator   

    //Pop up Modification de la feuille
    public readonly pListBoxStatut             : Locator  //.locator('[ng-model="feuilleAModifier.statut"]');

    public readonly pInputHoraireFinHeure      : Locator  //.locator('.horaire').nth(2);
    public readonly pInputHoraireFinMin        : Locator  //.locator('.horaire').nth(3);
    public readonly pInputEmplaceStockResiduel : Locator  //.locator('#emplacements');
    public readonly pAutoCompEmplaceStockResid : Locator;
    
    public readonly pButtonValiderModif        : Locator  //.locator('#btn-valider-modification');

    constructor(page:Page){

        this.buttonImprimer              = page.locator('[ng-click="imprimerSelection(true)"]');
        this.buttonVisualiser            = page.locator('[ng-click="visualiserSelection()"]');
        this.buttonFilters               = page.locator('.filters-container button'); 
        this.contAction                  = page.locator('.contAction');
        this.iconPencil                  = page.locator('.icon-pencil');   

        this.linkFermer                  = page.locator('[ng-click="close($event);"]');

        this.inputSearchMagasin          = page.locator('[ng-model="filtreMagasin"]');
        this.inputSearchAll              = page.locator('[ng-model="ngModel"]');    

        this.listBoxVague                = page.locator('#filtre-vague');
        this.listBoxGroupeArticle        = page.locator('#filtre-groupe-article');

        this.checkBoxPreparateur         = page.locator('#filter-0');
        this.checkBoxNumFeuille          = page.locator('#filter-1');
        this.checkBoxArticle             = page.locator('#filter-2');
        this.checkBoxFournisseur         = page.locator('#filter-3');
        this.checkBoxNumLot              = page.locator('#filter-4');

        this.dataGridFeuillesEnCours     = page.locator('.tab-feuilles-en-cours .datagrid-table-wrapper > table > thead > tr > th');  
        this.dataTableFeuillesEnCours    = page.locator('.feuilles-encours tbody tr'); 

        //Pop up Modification de la feuille
        this.pListBoxStatut              = page.locator('[ng-model="feuilleAModifier.statut"]');

        this.pInputHoraireFinHeure       = page.locator('.horaire').nth(2);
        this.pInputHoraireFinMin         = page.locator('.horaire').nth(3);
        this.pInputEmplaceStockResiduel  = page.locator('#emplacements');
        this.pAutoCompEmplaceStockResid  = page.locator('.gfit-autocomplete-result');
        
        this.pButtonValiderModif         = page.locator('#btn-valider-modification');
    }
}