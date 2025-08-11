/**
 * Appli    : BUDGET
 * Menu     : PARAMETRAGE
 * Onglet   : PERIMETRE CONSTANT
 * 
 * 
 * @author SIAKA KONE
 * @version 3.1
 * 
 */

import { Locator, Page } from "@playwright/test";

export class ParametragePerimetreConstant {

    //- Selectionne l'année exercice du perimetre constant--------------------------------------------------------------------------//
    public readonly listBoxAnneeExercice                     : Locator; //('#anneeExercice');;

    //- Tableau: liste des perimètres constants-------------------------------------------------------------------------------------//
    public readonly dataTableparamPerimetreConstant          : Locator; //('.p-datatable.p-component.p-datatable-scrollable');

    public readonly inputparamDesignation                    : Locator; //('.p-column-filter.ng-tns-c90-12.p-column-filter-row');
    public readonly inputparamDateOuverture                  : Locator; //('.pi.pi-calendar');

    public readonly CheckboxparamPerimetreConstant           : Locator; //('.ng-untouched.ng-pristine div.p-checkbox.p-component');

    //- Filtre les colonne du tableau ------------------------------------------------------------------------------------------//
    public readonly filtreColonneparamDesignation            : Locator; //('th[psortablecolumn="designation"]');
    public readonly filtreColonneparamSaisieBudget           : Locator; //('th[psortablecolumn="saisieDuBudget"]');
    public readonly filtreColonneparamPcCremerie             : Locator; //('.p-sortable-column-icon.pi.pi-fw.pi-sort-alt').nth(2);
    public readonly filtreColonneparampcEpicerie             : Locator; //('.p-sortable-column-icon.pi.pi-fw.pi-sort-alt').nth(3);
    public readonly filtreColonneparampcFruitsLegumes        : Locator; //('.p-sortable-column-icon.pi.pi-fw.pi-sort-alt').nth(4);
    public readonly filtreColonneparampcPoissonnerie         : Locator; //('.p-sortable-column-icon.pi.pi-fw.pi-sort-alt').nth(5);
    public readonly filtreColonneparamDateOuverture          : Locator; //('.p-sortable-column-icon.pi.pi-fw.pi-sort-alt').nth(6);
    public readonly filtreDateparamDateOuverture             : Locator; //('th[psortablecolumn="dateOuverture"]');

    //- button: enregistrer, copier exercice des perimetres constants ----------------------------------------------------------//
    public readonly buttonEnregistrer                        : Locator; //('button.btn-primary').nth(0);
    public readonly buttonCopierExercice                     : Locator; //('button.btn-primary').nth(1);
    public readonly buttonFiltre                             : Locator; //('button.p-column-filter-menu-button');
    public readonly buttonCalendar                           : Locator; //('button .pi-calendar');

    public readonly multiSelect                              : Locator; //('p-multiselect');

    public readonly listBoxFiltre                            : Locator; //('ul.p-column-filter-row-items li');

    public readonly dataGridHeader                           : Locator; //('thead th[role="columnheader"]');
    public readonly calendar                                 : Locator; //('.p-datepicker-group');

    public readonly checkBoxEnseigne                         : Locator; //('p-multiselectitem .p-checkbox');
    public readonly checkBoxAllEnseigne                      : Locator; //('.p-multiselect-header .p-checkbox-box');
    public readonly checkBoxFiltreHeader                     : Locator; //('p-tristatecheckbox .p-checkbox-box');
    public readonly checkBoxFiltreSaisieBudget               : Locator; //('p-checkbox[formcontrolname="saisieDuBudget"]');  //.p-checkbox-box
    public readonly checkBoxFiltreRayons                     : Locator; //('p-checkbox[formcontrolname="constant"]'); // .p-checkbox-box
    

    public readonly iconCloseFiltreEnseigne                  : Locator; //('.p-multiselect-close-icon');

    public readonly inputFiltreLieuVente                     : Locator; //('p-columnfilterformelement input.p-inputtext').nth(0);
    public readonly inputFiltreDateOuverture                 : Locator; //('p-columnfilterformelement input.p-inputtext').nth(1); 
    public readonly inputFiltreEnseigne                      : Locator; //('input.p-multiselect-filter');

    public readonly tbodyDataRow                             : Locator; //('tbody tr');

    // Poppin: Confirmation de la copie -----------------------------------------------------------------------------------------//
    public readonly pButtonConfCopieExercice                 : Locator; //('button.btn.btn-primary.confirm');

    constructor(page : Page) {

        this.listBoxAnneeExercice                            = page.locator('#anneeExercice');

        //- Tableau: liste des perimètres constants-------------------------------------------------------------------------------------//
        this.dataTableparamPerimetreConstant                 = page.locator('.p-datatable.p-component.p-datatable-scrollable');
    
        this.inputparamDesignation                           = page.locator('.p-column-filter.ng-tns-c90-12.p-column-filter-row');
        this.inputparamDateOuverture                         = page.locator('.pi.pi-calendar');
    
        this.CheckboxparamPerimetreConstant                  = page.locator('.ng-untouched.ng-pristine div.p-checkbox.p-component');
    
        //- Filtre les colonne du tableau ------------------------------------------------------------------------------------------//
        this.filtreColonneparamDesignation                   = page.locator('th[psortablecolumn="designation"]');
        this.filtreColonneparamSaisieBudget                  = page.locator('th[psortablecolumn="saisieDuBudget"]');
        this.filtreColonneparamPcCremerie                    = page.locator('.p-sortable-column-icon.pi.pi-fw.pi-sort-alt').nth(2);
        this.filtreColonneparampcEpicerie                    = page.locator('.p-sortable-column-icon.pi.pi-fw.pi-sort-alt').nth(3);
        this.filtreColonneparampcFruitsLegumes               = page.locator('.p-sortable-column-icon.pi.pi-fw.pi-sort-alt').nth(4);
        this.filtreColonneparampcPoissonnerie                = page.locator('.p-sortable-column-icon.pi.pi-fw.pi-sort-alt').nth(5);
        this.filtreColonneparamDateOuverture                 = page.locator('.p-sortable-column-icon.pi.pi-fw.pi-sort-alt').nth(6);
        this.filtreDateparamDateOuverture                    = page.locator('th[psortablecolumn="dateOuverture"]');
    
        //- button: enregistrer, copier exercice des perimetres constants ----------------------------------------------------------//
        this.buttonEnregistrer                               = page.locator('span.p-button-label').nth(1);
        this.buttonCopierExercice                            = page.locator('span.p-button-label').nth(2);
        this.buttonFiltre                                    = page.locator('button.p-column-filter-menu-button');
        this.buttonCalendar                                  = page.locator('button .pi-calendar');
    
        this.multiSelect                                     = page.locator('p-multiselect');
    
        this.listBoxFiltre                                   = page.locator('ul.p-column-filter-row-items li');
    
        this.dataGridHeader                                  = page.locator('thead th[role="columnheader"]');
        this.calendar                                        = page.locator('.p-datepicker-group');
    
        this.checkBoxEnseigne                                = page.locator('p-multiselectitem .p-checkbox');
        this.checkBoxAllEnseigne                             = page.locator('.p-multiselect-header .p-checkbox-box');
        this.checkBoxFiltreHeader                            = page.locator('p-tristatecheckbox .p-checkbox-box');
        this.checkBoxFiltreSaisieBudget                      = page.locator('p-checkbox[formcontrolname="saisieDuBudget"]');  //.p-checkbox-box
        this.checkBoxFiltreRayons                            = page.locator('p-checkbox[formcontrolname="constant"]'); // .p-checkbox-box
        
    
        this.iconCloseFiltreEnseigne                         = page.locator('.p-multiselect-close-icon');
    
        this.inputFiltreLieuVente                            = page.locator('p-columnfilterformelement input.p-inputtext').nth(0);
        this.inputFiltreDateOuverture                        = page.locator('p-columnfilterformelement input.p-inputtext').nth(1); 
        this.inputFiltreEnseigne                             = page.locator('input.p-multiselect-filter');
    
        this.tbodyDataRow                                    = page.locator('tbody tr');

        // Poppin: Confirmation de la copie -----------------------------------------------------------------------------------------//
        this.pButtonConfCopieExercice                        = page.locator('button.btn.btn-primary.confirm');
    }
}

