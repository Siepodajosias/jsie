/**
 * 
 * PRICING PAGE > STRATEGIES ARTICLES
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.6
 * 
 */

import { Locator, Page } from "@playwright/test"

export class StrategiesArticlesPage {
    
    public readonly buttonEnregistrer                                   :Locator  //'button span.icon-pencil');

    public readonly listBoxGroupeArticle                                :Locator  //'groupeArticle');
    public readonly listBoxGroupeMagasins                               :Locator  //'groupeMagasin');
    
    public readonly pDropdownGroupeArticles                             :Locator  //'groupeArticle');
    public readonly pDropdownGroupeMagasins                             :Locator  //'groupeMagasin');
    
    public readonly dataGridListeArticles                               :Locator  //'p-table[datakey="code"] th.text-center'); 
    public readonly dataGridListeGroupesMagasins                        :Locator  //'p-table[datakey="id"] th.text-center'); 
    public readonly pDataGridListeGroupesMagasins                       :Locator;
    public readonly dataGridListeArticleMagasin                         :Locator;
    public readonly pMultiselectFiltre                                  :Locator;
    public readonly inputCode                                           :Locator;
    public readonly inputDesignation                                    :Locator;
    public readonly pDropdownVend                                       :Locator;
    public readonly pDropdownCom                                        :Locator;
    public readonly pDropdownitem                                       :Locator;
    public readonly thDesignation                                       :Locator;
    public readonly divElertInfo                                        :Locator;
    public readonly pCheckboxBox                                        :Locator;
    public readonly buttonPselectbutton                                 :Locator;
    public readonly tdGroupeArticle                                     :Locator;
    public readonly dataGridListeMagasin                                :Locator;
    public readonly pDataGridListeMagasin                               :Locator;
    public readonly pSpinnerOn                                          :Locator;
    public readonly buttonPagination                                    :Locator;
    public readonly buttonModifierAssociation                           :Locator;
    public readonly pPselectbuttonOnglets                               :Locator;
    public readonly pSpanDesignationArticle                             :Locator;
    public readonly tdDesignationArticle                                :Locator;
    public readonly tdCodeArticle                                       :Locator;
    public readonly trGroupeArticle                                     :Locator;
    public readonly pButtonEnregistrer                                  :Locator;
    public readonly inputNomGroupe                                      :Locator;
    public readonly checkboxGroupeMag                                   :Locator;
    public readonly pCheckboxGroupeMag                                  :Locator;
    public readonly checkboxCocheSelection                              :Locator;
    public readonly emWarning                                           :Locator;
    public readonly pEmWarning                                          :Locator;
    public readonly emFormulaire                                        :Locator;
    constructor(page: Page){

        this.buttonEnregistrer                                          = page.locator('button span.icon-pencil');
        this.pButtonEnregistrer                                         = page.locator('.p-dialog-footer p-button button');
        this.listBoxGroupeArticle                                       = page.locator('[for="groupeArticle"]');
        this.listBoxGroupeMagasins                                      = page.locator('[for="groupeMagasin" ]');
    
        this.pDropdownGroupeArticles                                    = page.locator('div#groupeArticle');
        this.pDropdownGroupeMagasins                                    = page.locator('div#groupeMagasin');

        this.dataGridListeArticles                                      = page.locator('p-table[datakey="code"] th.text-center'); 
        this.dataGridListeGroupesMagasins                               = page.locator('p-table[datakey="id"] th.text-center'); 

        this.pDataGridListeGroupesMagasins                              = page.locator('.p-dialog p-table[datakey="id"] th.text-center');


        this.dataGridListeArticleMagasin                                = page.locator('tbody[role="rowgroup"] tr[data-p-highlight="false"]');
        this.dataGridListeMagasin                                       = page.locator('#groupeMagasinDG .p-datatable-table .p-selectable-row');
        this.pDataGridListeMagasin                                      = page.locator('.p-dialog #groupeMagasinDG .p-datatable-table .p-selectable-row');
        this.pMultiselectFiltre                                         = page.locator('p-multiselect .p-multiselect-trigger');
        this.inputCode                                                  = page.locator('.col-code-article input');
        this.pDropdownVend                                              = page.locator('.col-vendable-article p-dropdown');
        this.pDropdownCom                                               = page.locator('.col-commandable-article p-dropdown');
        this.thDesignation                                              = page.locator('th.col-designation-article').nth(0);
        this.divElertInfo                                               = page.locator('div.alert-info');
        this.pCheckboxBox                                               = page.locator('p-tablecheckbox .p-checkbox-box');
        this.buttonPselectbutton                                        = page.locator('p-selectbutton .p-selectbutton div');
        this.tdGroupeArticle                                            = page.locator('td.col-nb-groupes-magasins-article');
        this.tdDesignationArticle                                       = page.locator('td.col-designation-article');
        this.tdCodeArticle                                              = page.locator('td.col-code-article')
        this.pSpinnerOn                                                 = page.locator('i.app-spinner');
        this.inputDesignation                                           = page.locator('.col-designation-article input');
        this.pDropdownitem                                              = page.locator('p-dropdownitem li');
        this.buttonPagination                                           = page.locator('span.p-paginator-pages button');
        this.buttonModifierAssociation                                  = page.locator('.form-btn-section .containerBT button');
        this.pPselectbuttonOnglets                                      = page.locator('.p-dialog-content p-selectbutton .p-selectbutton span');
        this.pSpanDesignationArticle                                    = page.locator('.container-formulaire span');
        this.trGroupeArticle                                            = page.locator('tr.p-highlight');
        this.inputNomGroupe                                             = page.locator('.p-dialog p-columnfilterformelement input');
        this.checkboxGroupeMag                                          = page.locator('.p-dialog p-tablecheckbox');
        this.pCheckboxGroupeMag                                         = page.locator('.p-dialog tr:NOT(.p-highlight) p-tablecheckbox')
        this.checkboxCocheSelection                                     = page.locator('.p-dialog .p-datatable-thead .p-checkbox-box');
        this.emWarning                                                  = page.locator('em.fa-exclamation-triangle');
        this.pEmWarning                                                 = page.locator('.col-nom em');
        this.emFormulaire                                               = page.locator('.container-formulaire');
    }
}