/**
 * 
 * PREPARATION PAGE > SUIVI PICKING / ONGLET > LISTES PREPAREES EXP. DU ...
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class SuiviPickListesPrepareesExPage {

    public readonly buttonImprimer             : Locator  //('[ng-click="imprimerSelection(true)"]');
    public readonly buttonVisualiser           : Locator  //('[ng-click="visualiserSelection()"]');
    public readonly buttonSynthese             : Locator  //('[ng-click="openPopupSyntheseArticlesManquants()"]');
    public readonly buttonFilters              : Locator  //('.filters-container button');

    public readonly linkFermer                 : Locator  //('[ng-click="close($event);"]');    
    
    public readonly inputSearchAll             : Locator  //('[ng-model="filters.value"]');    

    public readonly checkBoxPreparateur        : Locator  //('#filter-0');    
    public readonly checkBoxTournee            : Locator  //('#filter-1');
    public readonly checkBoxNumListe           : Locator  //('#filter-2');
    public readonly checkBoxChemin             : Locator  //('#filter-3');
    public readonly checkBoxMagasin            : Locator  //('#filter-4');  
    public readonly checkBoxAnomalie           : Locator  //('#filtre-anomalies-checkbox');

    public readonly dataGridListesExpediees    : Locator  //('.liste-a-servir-prepare .datagrid-table-wrapper > table > thead > tr > th'); 

    //-- Popin : Synthèse des articles manquants dans les listes à servir du jour ------------------------------------------------------
    public readonly pPlinkAnnulerArtManq       : Locator  //('.popup-synthese-articles-manquants .modal-footer a'); 
    public readonly pPopinSyntArtManq          : Locator
    public readonly pDataGridArticle           : Locator
    public readonly pDataGridListeAServir      : Locator

    constructor(page:Page){

        this.buttonImprimer           = page.locator('[ng-click="imprimerSelection(true)"]');
        this.buttonVisualiser         = page.locator('[ng-click="visualiserSelection()"]');
        this.buttonSynthese           = page.locator('[ng-click="openPopupSyntheseArticlesManquants()"]');
        this.buttonFilters            = page.locator('.filters-container button');

        this.linkFermer               = page.locator('[ng-click="close($event);"]');    
        
        this.inputSearchAll           = page.locator('[ng-model="filters.value"]');    

        this.checkBoxPreparateur      = page.locator('#filter-0');    
        this.checkBoxTournee          = page.locator('#filter-1');
        this.checkBoxNumListe         = page.locator('#filter-2');
        this.checkBoxChemin           = page.locator('#filter-3');
        this.checkBoxMagasin          = page.locator('#filter-4');  
        this.checkBoxAnomalie         = page.locator('#filtre-anomalies-checkbox');

        this.dataGridListesExpediees  = page.locator('.liste-a-servir-prepare .datagrid-table-wrapper > table > thead > tr > th'); 

        //-- Popin : Synthèse des articles manquants dans les listes à servir du jour ------------------------------------------------------
        this.pPlinkAnnulerArtManq     = page.locator('.popup-synthese-articles-manquants .modal-footer a'); 
        this.pPopinSyntArtManq        = page.locator('.modal-backdrop')
        this.pDataGridArticle         = page.locator('[defaultsorter="article"] table thead tr th')
        this.pDataGridListeAServir    = page.locator('[defaultsorter="numeroListeAServir"] table thead tr th')
    }
}
