/**
 * Appli    : BUDGET
 * Page     : ADMIN
 * Onglet   : ADMINISTRATIONS
 * 
 * 
 * @author SIAKA KONE
 * @version 3.0
 * 
 */

import {Locator, Page }  from '@playwright/test';

export class AdminActions {
    
    
    public readonly buttonRecalculer                 : Locator;

    public readonly listBoxExerciceComptable         : Locator;
    public readonly listBoxDirectionExploitation     : Locator;
    public readonly listBoxLieuxVente                : Locator;

    public readonly listeAnnees                      : Locator;

    public readonly inputFiltre                      : Locator;

    public readonly checkBoxHeader                   : Locator;
    public readonly checkBoxDE                       : Locator;

    constructor(page: Page) {

        this.buttonRecalculer                       = page.locator('#clear');
        
        this.listBoxExerciceComptable               = page.locator('#exercices');
        this.listBoxDirectionExploitation           = page.locator('#directions');
        this.listBoxLieuxVente                      = page.locator('#lieuxVente');

        this.listeAnnees                            = page.locator('.p-dropdown-items p-dropdownitem');

        this.inputFiltre                            = page.locator('input.p-multiselect-filter');

        this.checkBoxHeader                         = page.locator('.p-multiselect-header .p-checkbox');
        this.checkBoxDE                             = page.locator('.p-multiselect-item .p-checkbox');

    }
}


