/**
 * Appli    : ACHATS
 * Menu     : BESOINS MAGAINS
 * Onglet   : VENTILLATION DES MAGASINS
 * 
 * 
 * @author JC CALVIERA
 * @version 3.1
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageBesVenMag {

    public readonly buttonCreerVentilationMag      : Locator;   //(by.css('[ng-click="openPopupSaisieVentilationMagasin()"]');
    public readonly buttonModifierVentilationMag   : Locator;   //(by.css('[ng-click="openPopupSaisieVentilationMagasin(ventilationSelectionnee)"]');
    public readonly buttonAttribuerMagasin         : Locator;   //(by.css('[ng-click="attribuerSelection()"]');
    public readonly buttonModifierMagasin          : Locator;   //(by.css('[ng-click="retirerSelection()"]');
         
    public readonly inputMagasin                   : Locator;   //(by.id('ventilation');
    public readonly inputCodeMagasin               : Locator;   //(by.model('filtreMagasin.value');
    public readonly inputCodeMagasinSelected       : Locator;   //(by.css('.magasins-selectionnes input');

    public readonly listBoxGroupesMagasins         : Locator;   //(by.id('input-groupe-plateforme');

    public readonly dataGridListeVentilations      : Locator;   //.all(by.css('.ventilations-magasin th'); 
    public readonly dataGridTdListeVentilations    : Locator;   //.all(by.css('.ventilations-magasin td.datagrid-designation');
    public readonly dataGridVentilationsPagination : Locator;
    public readonly dataGridPaginationNext         : Locator;
    public readonly dataGridListeMagasins          : Locator;   //.all(by.css('.magasins th'); 
    public readonly dataGridTdListeMagasins        : Locator;   //.all(by.css('.magasins td.datagrid-designation');         
    public readonly dataGridListeMagasinsSelected  : Locator;   //.all(by.css('.magasinsSelectionnes th'); 
    public readonly dataGridTdListeMagasinsSelected: Locator;   //.all(by.css('.magasinsSelectionnes td.datagrid-designation');    

    //--- POPIN : Création d'une ventilation Magasin -----------------------------------------------------------------------------------------------
    public readonly pPbuttonFermer                 : Locator;   //(by.css('div.popup-saisie-ventilation-magasin > div > a');
    public readonly pPbuttonEnregistrer            : Locator;   //(by.css('.modal-footer > button');
    
    public readonly pPinputDesignation             : Locator;   //(by.model('popupSaisieVentilationMagasin.ventilationMagasin.designation');

    //-- POPIN : Modification d'une ventilation magasin ---------------------------------------------------------------------------------------------
    public readonly pPinputModifDesignation        : Locator;   //(by.model('popupSaisieVentilationMagasin.ventilationMagasin.designation');

    public readonly pPbuttonModifEnregistrer       : Locator;   //(by.css('.modal-footer > button');

    //----------------------------------------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {
        
        this.page = page;
        
        this.buttonCreerVentilationMag      = page.locator('[ng-click="openPopupSaisieVentilationMagasin()"]');
        this.buttonModifierVentilationMag   = page.locator('[ng-click="openPopupSaisieVentilationMagasin(ventilationSelectionnee)"]');
        this.buttonAttribuerMagasin         = page.locator('[ng-click="attribuerSelection()"]');
        this.buttonModifierMagasin          = page.locator('[ng-click="retirerSelection()"]');
             
        this.inputMagasin                   = page.locator('#ventilation');
        this.inputCodeMagasin               = page.locator('filtreMagasin.value');
        this.inputCodeMagasinSelected       = page.locator('.magasins-selectionnes input');
    
        this.listBoxGroupesMagasins         = page.locator('#input-groupe-plateforme');
    
        this.dataGridListeVentilations      = page.locator('.ventilations-magasin th'); 
        this.dataGridTdListeVentilations    = page.locator('.ventilations-magasin td.datagrid-designation');
        this.dataGridVentilationsPagination = page.locator('.ventilations-magasin div.pagination [ng-click="goToPage(p);"] a');
        this.dataGridPaginationNext         = page.locator('.ventilations-magasin div.pagination [ng-click="nextPage();"] a');
        this.dataGridListeMagasins          = page.locator('.magasins th'); 
        this.dataGridTdListeMagasins        = page.locator('.magasins td.datagrid-designation');        
        this.dataGridListeMagasinsSelected  = page.locator('.magasinsSelectionnes th'); 
        this.dataGridTdListeMagasinsSelected= page.locator('.magasinsSelectionnes td.datagrid-designation');    
    
        //--- POPIN : Création d'une ventilation Magasin -----------------------------------------------------------------------------------------------
        this.pPbuttonFermer                 = page.locator('div.popup-saisie-ventilation-magasin > div > a');
        this.pPbuttonEnregistrer            = page.locator('.modal-footer > button');
        
        this.pPinputDesignation             = page.locator('[ng-model="popupSaisieVentilationMagasin.ventilationMagasin.designation"]');
    
        //-- POPIN : Modification d'une ventilation magasin ---------------------------------------------------------------------------------------------
        this.pPinputModifDesignation        = page.locator('[ng-model="popupSaisieVentilationMagasin.ventilationMagasin.designation"]');
    
        this.pPbuttonModifEnregistrer       = page.locator('.modal-footer > button');

    }

}