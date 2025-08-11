/**
 * Appli    : STOCK
 * Menu     : REFERENTIEL
 * Onglet   : ARTICLES
 * 
 * author JOSIAS SIE
 * 
 * @version 3.2
 * 
 */

import { Page }          from "@playwright/test";

export class ReferentielArticles {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly inputFiltreArticle         = this.page.locator('.recherche-referentiel-articles p-autocomplete input');
    public readonly inputEmplacementReception  = this.page.locator('.emplacement-reception-container p-autocomplete');
    public readonly inputSeuilRotation         = this.page.locator('.seuil-rotation-container input');
    public readonly inputPlateForme            = this.page.locator('input.filter-input').nth(0);
    public readonly inputGroupeArticle         = this.page.locator('input.filter-input').nth(1);
    public readonly inputModePreparation       = this.page.locator('input.p-multiselect-filter');

    public readonly buttonEnregistrerParam     = this.page.locator('[ng-click="enregistrer()"]');
    public readonly buttonActions              = this.page.locator('.actions-container p-button');
    public readonly buttonEnregistrer          = this.page.locator('.form-btn-section button');
    public readonly buttonRechercher           = this.page.locator('button span.pi-search');

    public readonly dataGridReferentiel        = this.page.locator('p-table.tableau-articles tr:nth-child(1) th');
    public readonly dataGridParametreGArticle  = this.page.locator('table.table-condensed thead th');
    public readonly trArticleModPReparatPicking= this.page.locator('.p-datatable-tbody .p-selectable-row');

    public readonly listBoxGroupeArticle       = this.page.locator('sigale-recherche-referentiel-articles p-multiselect').nth(0);
    public readonly listBoxModePreparation     = this.page.locator('sigale-recherche-referentiel-articles p-multiselect').nth(1);

    public readonly checkBoxArticles           = this.page.locator('.p-selectable-row p-tablecheckbox');
    public readonly checkBoxModePreparat       = this.page.locator('p-multiselectitem div.p-checkbox-box');
    public readonly toggleButtonClassiqueReduite= this.page.locator('.type-etiquette-container p-selectbutton');
    public readonly toggleButtonReduite         = this.page.locator('[ng-click="switchTypeEtiquette(true)"]');

    //----------------------------------------------------------------------------------------------------------------    

    constructor(public readonly page: Page) {}  

}