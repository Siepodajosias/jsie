/**
 * 
 * PREPARATION PAGE > SUIVI PICKING / ONGLET > LISTES A VALIDER.
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class SuiviPickListesAValider {

    public readonly buttonImprimer          : Locator  //.locator('[ng-click="imprimerSelection(true)"]');
    public readonly buttonVisualiser        : Locator  //.locator('[ng-click="visualiserSelection()"]');
    public readonly buttonValider           : Locator  //.locator('[ng-click="validerSelection()"]');
    public readonly buttonSynthese          : Locator  //.locator('[ng-click="openPopupSyntheseArticlesManquants()"]');
    public readonly buttonFilters           : Locator  //.locator('.filters-container button');

    public readonly linkFermer              : Locator  //.locator('[ng-click="close($event);"]');    
    
    public readonly inputSearchAll          : Locator  //.locator('[ng-model="filters.value"]');    

    public readonly checkBoxPreparateur     : Locator  //.locator('#filter-0');    
    public readonly checkBoxTournee         : Locator  //.locator('#filter-1');
    public readonly checkBoxNumListe        : Locator  //.locator('#filter-2');
    public readonly checkBoxChemin          : Locator  //.locator('#filter-3');
    public readonly checkBoxMagasin         : Locator  //.locator('#filter-4');  

    public readonly dataGridListesAValider  : Locator  //.locator('.liste-a-servir-avalider .datagrid-table-wrapper > table > thead > tr > th'); 

    //-- Popin : Synthèse des articles manquants dans les listes à servir du jour ------------------------------------------------------
    public readonly pPopinSyntArtManq       : Locator
    public readonly pPlinkAnnulerArtManq    : Locator  //.locator('.popup-synthese-articles-manquants .modal-footer a');
    public readonly pDataGridArticle        : Locator 
    public readonly pDataGridListeAServir   : Locator

    constructor(page: Page){
       
        this.buttonImprimer          = page.locator('[ng-click="imprimerSelection(true)"]');
        this.buttonVisualiser        = page.locator('[ng-click="visualiserSelection()"]');
        this.buttonValider           = page.locator('[ng-click="validerSelection()"]');
        this.buttonSynthese          = page.locator('[ng-click="openPopupSyntheseArticlesManquants()"]');
        this.buttonFilters           = page.locator('.filters-container button');

        this.linkFermer              = page.locator('[ng-click="close($event);"]');    

        this.inputSearchAll          = page.locator('[ng-model="filters.value"]');    

        this.checkBoxPreparateur     = page.locator('#filter-0');    
        this.checkBoxTournee         = page.locator('#filter-1');
        this.checkBoxNumListe        = page.locator('#filter-2');
        this.checkBoxChemin          = page.locator('#filter-3');
        this.checkBoxMagasin         = page.locator('#filter-4');  

        this.dataGridListesAValider  = page.locator('.liste-a-servir-avalider .datagrid-table-wrapper > table > thead > tr > th'); 

        //-- Popin : Synthèse des articles manquants dans les listes à servir du jour ------------------------------------------------------
        this.pPlinkAnnulerArtManq    = page.locator('.popup-synthese-articles-manquants .modal-footer a');
        this.pPopinSyntArtManq       = page.locator('.modal-backdrop')
        this.pDataGridArticle        = page.locator('[defaultsorter="article"] table thead tr th')
        this.pDataGridListeAServir   = page.locator('[defaultsorter="numeroListeAServir"] table thead tr th')

    }

}