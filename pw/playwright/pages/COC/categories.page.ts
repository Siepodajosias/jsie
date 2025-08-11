/**
 * Appli    : CONCURRENCE
 * Menu     : CATEGORIES
 * Onglet   : CATEGORIES
 * 
 * 
 * @author JOSIAS SIE
 * @version 3.1
 * 
 */

import { Page }    from "@playwright/test"

export class Categories {

    public readonly dataGridEntierCategorie            = this.page.locator('p-table[selectionmode="multiple"]') 
    public readonly dataGridEnteteCategorie            = this.page.locator('.p-datatable-thead tr.ng-star-inserted th.text-center') 
    public readonly dataGridCheckBoxCategorie          = this.page.locator('#header-selection .p-checkbox-box');//('#header-selection [role="checkbox"]') 
    public readonly dataGridCheckBoxCategorieChoix     = this.page.locator('tbody tr p-tablecheckbox') 
    public readonly dataGridHeaderCategorie            = this.page.locator('#header-categorie') 
    public readonly dataGridInputFilterCategorie       = this.page.locator('#filtre-categorie input') 

    public readonly buttonCreerCategorie               = this.page.locator('.footerBar button.btn-primary:NOT(.p-disabled)');//('button.sans-icone') 
    public readonly buttonModifierCategorie            = this.page.locator('.footerBar p-button[icon="fas fa-pencil-alt"]');//('[role="toolbar"] button .fas') 
    public readonly buttonGererOrigine                 = this.page.locator('.footerBar p-button[icon="fas fa-flag"]');//('app-footer-bar button').nth(2) 

    public readonly buttonActiverCategorie             = this.page.locator('p-inputswitch .p-inputswitch-slider')

    //Après avoir cliqué sur les boutons créer ou modifier 
    public readonly pPinputFieldDesignationCategorie   = this.page.locator('#categorie-label') 
    public readonly pPlistBoxEquipe                    = this.page.locator('p-multiselect') 
    public readonly pPinputFieldRechercheEquipe        = this.page.locator('.p-multiselect-filter-container input') 
    public readonly pPcheckBoxEquipe                   = this.page.locator('p-multiselectitem .p-checkbox-box')  //'p-multiselectitem .p-checkbox-box .p-checkbox-icon' '.p-multiselect-item .p-checkbox-box .p-checkbox-icon'
    public readonly pPCloseInputField                  = this.page.locator('button.p-multiselect-close') // 'button.p-multiselect-close'
    public readonly pPcheckBoxChampAff                 = this.page.locator('.mx-2 .p-checkbox-box') 
    public readonly pPcheckBoxCheckedChampAff          = this.page.locator('.mx-2 .p-checkbox-box[aria-checked="true"]') 
    public readonly pPcheckBoxNotCheckedChampAff       = this.page.locator('.mx-2 .p-checkbox-box[aria-checked="false"]')
    public readonly pPtextareaChampAff                 = this.page.locator('div textarea')
    public readonly pPbuttonEnregistrer                = this.page.locator('p-footer button').nth(0) 
    public readonly pPbuttonAnnuler                    = this.page.locator('p-footer button').nth(1) 
    public readonly pPmodal                            = this.page.locator('div[pfocustrap]')    //'p-multiselectitem .p-checkbox-box .p-checkbox-icon' 

    //Après avoir cliqué sur les boutons gerer les origines

    public readonly pPinputFieldDesignationOrigine     = this.page.locator('div[pfocustrap] input#origine') 
    public readonly pPbuttonAddOrigine                 = this.page.locator('p-button button.btn-plus') 
    public readonly pPinputFiltreOrigine               = this.page.locator('th#filtre-code') 

    public readonly checkBoxCategorie                  = this.page.locator('.p-datatable-scrollable-view') 
    
    constructor(public readonly page: Page) {}
}

