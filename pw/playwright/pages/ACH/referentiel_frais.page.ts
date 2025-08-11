/**
 * Appli    : ACHATS 
 * Page     : REFERENTIEL
 * Onglet   : FRAIS
 * 
 * 
 * @author JC CALVIERA
 * @version 3.0
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageRefFrais {

    public readonly inputFiltreArticleStructure    : Locator;   //.all(by.css('input.filter-input').nth(0);
    public readonly inputFiltreArticlePlateforme   : Locator;   //.all(by.css('input.filter-input').nth(1);
    public readonly inputFiltreArticleTransport    : Locator;   //.all(by.css('input.filter-input').nth(2);

    public readonly dataGridFraisStructure         : Locator;   //.all(by.css('.table-frais-structure div.datagrid-table-wrapper > table > thead > tr > th');    
    public readonly dataGridFraistransport         : Locator;   //.all(by.css('.table-frais-transport div.datagrid-table-wrapper > table > thead > tr > th'); 

    public readonly dataGridFraisStructureThFrais  : Locator;   //(by.css('th.datagrid-fraisStructure');   

    public readonly dataGridFraisStructureTdIdArticle : Locator;   //.all(by.css('.table-frais-structure td.datagrid-article-code');
    public readonly dataGridFraisStructureTdDesign : Locator;   //.all(by.css('.table-frais-structure td.datagrid-article-designation');
    public readonly dataGridFraisStructureTdPtf    : Locator;   //.all(by.css('.table-frais-structure td.datagrid-plateformeReception');
    public readonly dataGridFraisStructureTdFrais  : Locator;   //.all(by.css('.table-frais-structure td.datagrid-fraisStructure');
    
    public readonly checkBoxFraisStructure         : Locator;   //.all(by.css('.table-frais-structure td input');

    public readonly buttonExceptionStructureAdd    : Locator;   //(by.css('[ng-click="openFraisStructureSaisie()"]');
    public readonly buttonExceptionStructureUpd    : Locator;   //(by.css('[ng-click="openFraisStructureSaisie(dg.selection[0])"]');
    public readonly buttonExceptionStructureDel    : Locator;   //(by.css('[ng-click="openFraisStructureSuppression(dg.selection[0])"]');

    //-- Popin : Ajout d'un frais de structure --------------------------------------------------------------------------------------------------
    public readonly pPajoutFraisStrucInputArticle  : Locator;   //(by.id('article-frais-structure');
    public readonly pPajoutFraisStrucInputMontant  : Locator;   //(by.id('frais-structure-montant');

    public readonly pPajoutFraisStrucListBoxPtf    : Locator;   //(by.id('plateforme-frais-structure');

    public readonly pPajoutFraisStrucButtonEnreg   : Locator;   //(by.css('#form-frais-structure-saisie .modal-footer button:NOT(.ng-hide)');

    public readonly pPajoutFraisStrucBLinkAnnuler  : Locator;   //(by.css('#form-frais-structure-saisie .modal-footer a');

    public readonly pPajoutFraisStrucAutoCompArt   : Locator;   //.all(by.css('ul.gfit-autocomplete-results > li');

    //-- Popin : Suppression d'une exception aux frais de structure -------------------------------------------------------------------------------
    public readonly pPsuppFraisStrucButtonOui      : Locator;   //(by.css('.popup-supprimer-frais-structure .modal-footer button:NOT(.ng-hide)');

    public readonly pPsuppFraisStrucBLinkNon       : Locator;   //(by.css('.popup-supprimer-frais-structure .modal-footer a'); 
    
    //----------------------------------------------------------------------------------------------------------------- 

    constructor(public readonly page: Page) {

        this.inputFiltreArticleStructure    = page.locator('input.filter-input').nth(0);
        this.inputFiltreArticlePlateforme   = page.locator('input.filter-input');
        this.inputFiltreArticleTransport    = page.locator('input.filter-input').nth(2);
    
        this.dataGridFraisStructure         = page.locator('.table-frais-structure div.datagrid-table-wrapper > table > thead > tr > th');    
        this.dataGridFraistransport         = page.locator('.table-frais-transport div.datagrid-table-wrapper > table > thead > tr > th'); 
    
        this.dataGridFraisStructureThFrais  = page.locator('th.datagrid-fraisStructure');   
    
        this.dataGridFraisStructureTdIdArticle = page.locator('.table-frais-structure td.datagrid-article-code');
        this.dataGridFraisStructureTdDesign = page.locator('.table-frais-structure td.datagrid-article-designation');
        this.dataGridFraisStructureTdPtf    = page.locator('.table-frais-structure td.datagrid-plateformeReception');
        this.dataGridFraisStructureTdFrais  = page.locator('.table-frais-structure td.datagrid-fraisStructure');
        
        this.checkBoxFraisStructure         = page.locator('.table-frais-structure td input');
    
        this.buttonExceptionStructureAdd    = page.locator('[ng-click="openFraisStructureSaisie()"]');
        this.buttonExceptionStructureUpd    = page.locator('[ng-click="openFraisStructureSaisie(dg.selection[0])"]');
        this.buttonExceptionStructureDel    = page.locator('[ng-click="openFraisStructureSuppression(dg.selection[0])"]');
    
        //-- Popin : Ajout d'un frais de structure --------------------------------------------------------------------------------------------------
        this.pPajoutFraisStrucInputArticle  = page.locator('#article-frais-structure');
        this.pPajoutFraisStrucInputMontant  = page.locator('#frais-structure-montant');
    
        this.pPajoutFraisStrucListBoxPtf    = page.locator('#plateforme-frais-structure');
    
        this.pPajoutFraisStrucButtonEnreg   = page.locator('#form-frais-structure-saisie .modal-footer button:NOT(.ng-hide)');
    
        this.pPajoutFraisStrucBLinkAnnuler  = page.locator('#form-frais-structure-saisie .modal-footer a');
    
        this.pPajoutFraisStrucAutoCompArt   = page.locator('ul.gfit-autocomplete-results > li');
    
        //-- Popin : Suppression d'une exception aux frais de structure -------------------------------------------------------------------------------
        this.pPsuppFraisStrucButtonOui      = page.locator('.popup-supprimer-frais-structure .modal-footer button:NOT(.ng-hide)');
    
        this.pPsuppFraisStrucBLinkNon       = page.locator('.popup-supprimer-frais-structure .modal-footer a'); 

    }

}