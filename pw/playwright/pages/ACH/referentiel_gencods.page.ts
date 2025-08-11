/**
 * Appli    : ACHATS 
 * Page     : REFERENTIEL
 * Onglet   : GENCODS
 * 
 * 
 * @author JC CALVIERA
 * @version 3.0
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageRefGen {

    public readonly inputFiltreArticle         : Locator;   //(by.id('gencod-input-article');
    public readonly inputFiltreGencod          : Locator;   //(by.id('gencod-input-gencod');

    public readonly buttonCreer                : Locator;   //(by.css('[ng-click="openSaisieGencod()"]');
    public readonly buttonModifier             : Locator;   //(by.css('[ng-click="openSaisieGencod(dg.selection[0])"]');
    public readonly buttonSupprimer            : Locator;   //(by.css('[ng-click="openPopupSuppressionGencod(dg.selection[0])"]');

    public readonly dataGridGencods            : Locator;   //.all(by.css('.tab-gencods-div-gauche div.datagrid-table-wrapper > table > thead > tr > th');      
    public readonly dataGridArticles           : Locator;   //.all(by.css('.tab-gencods-div-droite div.datagrid-table-wrapper > table > thead > tr > th');   

    //-- Popin : Création d'un gencod ---------------------------------------------------------------------------------
    public readonly pInputArticle              : Locator;   //(by.id('saisie-gencod-input-article');
    public readonly pInputGencod               : Locator;   //(by.id('saisie-gencod-input-gencod');

    public readonly pButtonCreer               : Locator;   //.all(by.css('.modal-saisie-gencod .modal-footer button').get(0);
    public readonly pButtonVider               : Locator;   //.all(by.css('.modal-saisie-gencod .modal-footer button').get(1);    

    public readonly pLinkAnnuler               : Locator;   //(by.css('.modal-saisie-gencod .modal-footer a');

    public readonly pAutoCompleteArticle       : Locator;   //.all(by.css('.gfit-autocomplete-results li');

    public readonly pDataGridErreur            : Locator;   //(by.css('.confirmation-gencod-datagrid');         // Si cette DG s'affiche, s'est qu'il y a une erreur !

    public readonly pLinkOui                   : Locator;   //(by.css('[ng-click="$event.preventDefault(); enregistrerGencod(true);"]');

    public readonly pWarning                   : Locator;   //(by.css('.confirmation-gencod');
    
    //----------------------------------------------------------------------------------------------------------------- 

    constructor(public readonly page: Page) {
        
        this.inputFiltreArticle         = page.locator('#gencod-input-article');
        this.inputFiltreGencod          = page.locator('#gencod-input-gencod');
    
        this.buttonCreer                = page.locator('[ng-click="openSaisieGencod()"]');
        this.buttonModifier             = page.locator('[ng-click="openSaisieGencod(dg.selection[0])"]');
        this.buttonSupprimer            = page.locator('[ng-click="openPopupSuppressionGencod(dg.selection[0])"]');
    
        this.dataGridGencods            = page.locator('.tab-gencods-div-gauche div.datagrid-table-wrapper > table > thead > tr > th');      
        this.dataGridArticles           = page.locator('.tab-gencods-div-droite div.datagrid-table-wrapper > table > thead > tr > th');   
    
        //-- Popin : Création d'un gencod ---------------------------------------------------------------------------------
        this.pInputArticle              = page.locator('#saisie-gencod-input-article');
        this.pInputGencod               = page.locator('#saisie-gencod-input-gencod');
    
        this.pButtonCreer               = page.locator('.modal-saisie-gencod .modal-footer button').nth(0);
        this.pButtonVider               = page.locator('.modal-saisie-gencod .modal-footer button').nth(1);    
    
        this.pLinkAnnuler               = page.locator('.modal-saisie-gencod .modal-footer a');
    
        this.pAutoCompleteArticle       = page.locator('.gfit-autocomplete-results li');
    
        this.pDataGridErreur            = page.locator('.confirmation-gencod-datagrid');         // Si cette DG s'affiche, s'est qu'il y a une erreur !
    
        this.pLinkOui                   = page.locator('[ng-click="$event.preventDefault(); enregistrerGencod(true);"]');
    
        this.pWarning                   = page.locator('.confirmation-gencod');
        
        //-----------------------------------------------------------------------------------------------------------------
   
    }

}