/**
 * Appli    : BUDGET
 * Menu     : PARAMETRAGE
 * Onglet   : REGROUPEMENT
 * 
 * 
 * @author SIAKA KONE
 * @version 3.0
 * 
 */

import { Locator, Page } from "@playwright/test";

export class ParametrageRegroupement {
  
    public readonly listBoxAnneeExercice                            : Locator; //('#anneeExercice');

    public readonly labelparamRegroupementGroupeArticle             : Locator; //('.titre-regroupement');

    public readonly spanparamMessageInfo                            : Locator; //('.msg-info');
    
    //-Tableau: liste des regroupements---------------------------------------------------------------------------------------------//
    public readonly dataTableparamRegroupements                     : Locator; //('.p-datatable-scrollable-view');

    public readonly selectTableparamRegroupement                    : Locator; //('.p-selectable-row.ng-star-inserted.p-highlight');

    //- Icon: Supprime ou modifie les regroupements par ligne dans le tableau -------------------------------------------------------//
    public readonly iconparamModifierRegroupement                   : Locator; //('.fas.fa-pencil-alt');

    //- Filtre les differentes colonnes des regroupements----------------------------------------------------------------------------//
    public readonly multiSelectDirectionExploitat                   : Locator; //('.p-multiselect-label');

    public readonly inputTextparamRegroupement                      : Locator; //('.p-inputtext.p-component.ng-star-inserted');
    public readonly inputTextparamGroupeArticle                     : Locator; //('.p-inputtext.p-component.ng-star-inserted');

    public readonly inputDirectionExploitation                      : Locator; //('input.p-multiselect-filter');
    public readonly inputFiltreRegroupement                         : Locator; //('input.p-inputtext').nth(0);
    public readonly inputFiltreGroupeArticleGere                    : Locator; //('input.p-inputtext').nth(1);

    public readonly checBoxHeader                                   : Locator; //('.p-multiselect-header .p-checkbox-box');
    public readonly checkBoxGroupeArticle                           : Locator; //('p-multiselectitem .p-checkbox-box');

    public readonly listBoxDirectionExploitation                    : Locator; //('ul li.p-column-filter-row-item');
    public readonly tableRow                                        : Locator; //('tbody tr.p-selectable-row');

    //- button d'ajout, de modification et de suppression des regroupement ----------------------------------------------------------//
    public readonly buttonAjouter                                   : Locator; //('.p-button-label').nth(0);
    public readonly buttonModifier                                  : Locator; //('.p-button-label').nth(1);
    public readonly buttonCSupprimer                                : Locator; //('.p-button-label').nth(2);
    public readonly buttonClose                                     : Locator; //('button.p-multiselect-close');
    public readonly buttonFilter                                    : Locator; //('button .pi-filter');

    public readonly pPbuttonDeplOneRight                            : Locator; //('.p-button-icon.pi-angle-right');
    public readonly pPbuttonDeplAllRight                            : Locator; //('.p-button-icon.pi-angle-double-right');
    public readonly pPbuttonDeplOneLeft                             : Locator; //('.p-button-icon.pi-angle-left');
    public readonly pPbuttonDeplAllLeft                             : Locator; //('.p-button-icon.pi-angle-double-left');
    public readonly pPbuttonAnnulerModification                     : Locator; //('edition-regroupement-modal button.btn-link');
    public readonly pPbuttonAnnulerSuppression                      : Locator; //('modal-confirmation button.btn-link');
    public readonly pPbuttonEnregistrer                             : Locator; //('button.btn-md');
    public readonly pPbuttonAnnuler                                 : Locator; //('edition-regroupement-modal .btn-link');
    public readonly pPbuttonSupprimerRegroupement                   : Locator; //('modal-confirmation .btn-primary.confirm');
    public readonly pPselectBoxExploitation                         : Locator; //('edition-regroupement-modal #direction');
    public readonly pPinuputDesignationRegroupement                 : Locator; //('edition-regroupement-modal #designation');
    public readonly pPinuputCodeRegroupement                        : Locator; //('edition-regroupement-modal #code');
    public readonly pPgroupeAffectation                             : Locator; //('ul[cdkdroplist][role="listbox"]'); //retourn une liste de groupe à affecter
    public readonly pPlistBoxExploitation                           : Locator; //('p-dropdownitem li');
    
    public readonly dataGridRegroupement                            : Locator; //('thead th.text-center');
    public readonly dataGridTable                                   : Locator; //('.p-datatable-scrollable-view');

    constructor(page : Page) {

        this.listBoxAnneeExercice                             = page.locator('#anneeExercice');

        this.labelparamRegroupementGroupeArticle              = page.locator('.titre-regroupement');
    
        this.spanparamMessageInfo                             = page.locator('.msg-info');
        
        //-Tableau: liste des regroupements---------------------------------------------------------------------------------------------//
        this.dataTableparamRegroupements                      = page.locator('.p-datatable-scrollable-view');
    
        this.selectTableparamRegroupement                     = page.locator('.p-selectable-row.ng-star-inserted.p-highlight');
    
        //- Icon: Supprime ou modifie les regroupements par ligne dans le tableau -------------------------------------------------------//
        this.iconparamModifierRegroupement                    = page.locator('.fas.fa-pencil-alt');
    
        //- Filtre les differentes colonnes des regroupements----------------------------------------------------------------------------//
        this.multiSelectDirectionExploitat                    = page.locator('.p-multiselect-label');
    
        this.inputTextparamRegroupement                       = page.locator('.p-inputtext.p-component.ng-star-inserted');
        this.inputTextparamGroupeArticle                      = page.locator('.p-inputtext.p-component.ng-star-inserted');
    
        this.inputDirectionExploitation                       = page.locator('input.p-multiselect-filter');
        this.inputFiltreRegroupement                          = page.locator('input.p-inputtext').nth(0);
        this.inputFiltreGroupeArticleGere                     = page.locator('input.p-inputtext').nth(1);
    
        this.checBoxHeader                                    = page.locator('.p-multiselect-header .p-checkbox-box');
        this.checkBoxGroupeArticle                            = page.locator('p-multiselectitem .p-checkbox-box');
    
        this.listBoxDirectionExploitation                     = page.locator('ul li.p-column-filter-row-item');
        this.tableRow                                         = page.locator('tbody tr.p-selectable-row');
    
        //- button d'ajout, de modification et de suppression des regroupement ----------------------------------------------------------//
        this.buttonAjouter                                    = page.locator('.p-button-label').nth(0);
        this.buttonModifier                                   = page.locator('.p-button-label').nth(1);
        this.buttonCSupprimer                                 = page.locator('.p-button-label').nth(2);
        this.buttonClose                                      = page.locator('button.p-multiselect-close');
        this.buttonFilter                                     = page.locator('button .pi-filter');
    
        this.pPbuttonDeplOneRight                             = page.locator('.p-button-icon.pi-angle-right');
        this.pPbuttonDeplAllRight                             = page.locator('.p-button-icon.pi-angle-double-right');
        this.pPbuttonDeplOneLeft                              = page.locator('.p-button-icon.pi-angle-left');
        this.pPbuttonDeplAllLeft                              = page.locator('.p-button-icon.pi-angle-double-left');
        this.pPbuttonAnnulerModification                      = page.locator('edition-regroupement-modal button.btn-link');
        this.pPbuttonAnnulerSuppression                       = page.locator('modal-confirmation button.btn-link');
        this.pPbuttonEnregistrer                              = page.locator('button.btn-md');
        this.pPbuttonAnnuler                                  = page.locator('edition-regroupement-modal .btn-link');
        this.pPbuttonSupprimerRegroupement                    = page.locator('modal-confirmation .btn-primary.confirm');
        this.pPselectBoxExploitation                          = page.locator('edition-regroupement-modal #direction');
        this.pPinuputDesignationRegroupement                  = page.locator('edition-regroupement-modal #designation');
        this.pPinuputCodeRegroupement                         = page.locator('edition-regroupement-modal #code');
        this.pPgroupeAffectation                              = page.locator('ul[cdkdroplist][role="listbox"]'); //retourn une liste de groupe à affecter
        this.pPlistBoxExploitation                            = page.locator('p-dropdownitem li');
        
        this.dataGridRegroupement                             = page.locator('thead th.text-center');
        this.dataGridTable                                    = page.locator('.p-datatable-scrollable-view');
    }
}

