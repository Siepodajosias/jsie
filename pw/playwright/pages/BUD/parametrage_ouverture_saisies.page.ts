/**
 * Appli    : BUDGET
 * Menu     : PARAMETRAGE
 * Onglet   : OUVERTURES DES SAISIES
 * 
 * 
 * @author SIAKA KONE
 * @version 3.1
 * 
 */

import { Locator, Page } from "@playwright/test";

export class ParametrageOverturesSaisies {

    public readonly listboxAnneeExercice                            : Locator; //('#anneeExercice'); 
    public readonly inputOuvertSaisie                               : Locator; //('tr > td:nth-child(2) > :nth-child(1) span.p-inputswitch-slider');

    //- Liste les directions d'exploitation---------------------------------------------------------------------------------//
    public readonly dataTableHeader                                 : Locator; //('thead.p-datatable-thead');
    public readonly dataGridOuvertureSaisie                         : Locator; //('.p-datatable-wrapper [role="grid"]');
    public readonly dataTableparamDirection                         : Locator; //('.p-datatable-wrapper.ng-star-inserted');

    public readonly dataTableOuvertureSaisie                        : Locator; //('.p-datatable-wrapper');
    public readonly dataGridOuvertureHead                           : Locator; //('thead th');

    //- Ouvre des directions d'exploitation en saisie----------------------------------------------------------------------//
    public readonly switchparamBancoFresco                          : Locator; //('[formControlname="ouvertEnSaisie"]').nth(0);
    public readonly switchparamFresh                                : Locator; //('[formControlname="ouvertEnSaisie"]').nth(1);
    public readonly switchparamGrandFraisCremerie                   : Locator; //('[formControlname="ouvertEnSaisie"]').nth(2);
    public readonly switchparamGrandFraisFL                         : Locator; //('[formControlname="ouvertEnSaisie"]').nth(3);
    public readonly switchparamMonMarche                            : Locator; //('[formControlname="ouvertEnSaisie"]').nth(4);
    public readonly switchparamNonDefini                            : Locator; //('[formControlname="ouvertEnSaisie"]').nth(5);

    public readonly theadDirectionExploitationSort                  : Locator; //('thead th[aria-sort]');

    public readonly switchButtonActif                               : Locator; //('div.p-inputswitch-checked span.p-inputswitch-slider');
    public readonly witchButtonNonActif                             : Locator; //('div:NOT(.p-inputswitch-checked) > span.p-inputswitch-slider');

    //- Listes ds switch buttons par colonnes---------------------------------------------------------------------------------//
    public readonly switchButtonSaisieatterissage                   : Locator; //('table > tbody > tr > td:nth-child(2) > p-celleditor .p-inputswitch.p-component .p-inputswitch-slider ')
    public readonly switchButtonOuvertSaisieIniial                  : Locator; //('table > tbody > tr > td:nth-child(3) > p-celleditor .p-inputswitch.p-component .p-inputswitch-slider ')
    public readonly switchOuvertSaisieIniial                        : Locator; //('table > tbody > tr > td:nth-child(3) > p-celleditor .p-inputswitch.p-component .p-inputswitch-slider ')
    public readonly switchDejaOuvertSaisie                          : Locator; //('table > tbody > tr > td:nth-child(4) > p-celleditor .p-inputswitch.p-component .p-inputswitch-slider ')
    public readonly switchButtonNouvelAtterissage                   : Locator; //('table > tbody > tr > td:nth-child(6) > p-inputswitch .p-inputswitch-slider')
    
    //- Enregistre les modifications sur les directions d'exploitation-------------------------------------------------------//
    public readonly buttonEnregistrer                               : Locator;
    public readonly buttonCreerNouvelExercice                       : Locator;
    public readonly buttonCreerReforescast                          : Locator;

    public readonly onglest                                         : Locator; //('p-tabmenu ul li[role="tab"]');

    public readonly spinner                                         : Locator; //('.p-spinner.p-datatable-loading-icon.pi-spin');

    constructor(page: Page) {

        this.listboxAnneeExercice                            = page.locator('#anneeExercice');
        this.inputOuvertSaisie                               = page.locator('tr > td:nth-child(2) > :nth-child(1) span.p-inputswitch-slider');
    
        //- Liste les directions d'exploitation---------------------------------------------------------------------------------//
        this.dataTableHeader                                 = page.locator('thead.p-datatable-thead');
        this.dataGridOuvertureSaisie                         = page.locator('.p-datatable-wrapper [role="grid"]');
        this.dataTableparamDirection                         = page.locator('.p-datatable-wrapper.ng-star-inserted');
    
        this.dataTableOuvertureSaisie                        = page.locator('.p-datatable-wrapper');
        this.dataGridOuvertureHead                           = page.locator('thead th');
    
        //- Ouvre des directions d'exploitation en saisie----------------------------------------------------------------------//
        this.switchparamBancoFresco                          = page.locator('[formControlname="ouvertEnSaisie"]').nth(0);
        this.switchparamFresh                                = page.locator('[formControlname="ouvertEnSaisie"]').nth(1);
        this.switchparamGrandFraisCremerie                   = page.locator('[formControlname="ouvertEnSaisie"]').nth(2);
        this.switchparamGrandFraisFL                         = page.locator('[formControlname="ouvertEnSaisie"]').nth(3);
        this.switchparamMonMarche                            = page.locator('[formControlname="ouvertEnSaisie"]').nth(4);
        this.switchparamNonDefini                            = page.locator('[formControlname="ouvertEnSaisie"]').nth(5);
    
        this.theadDirectionExploitationSort                  = page.locator('thead th[aria-sort]');
    
        this.switchButtonActif                               = page.locator('div.p-inputswitch-checked span.p-inputswitch-slider');
        this.witchButtonNonActif                             = page.locator('div:NOT(.p-inputswitch-checked) > span.p-inputswitch-slider');
        
        //- Listes ds switch buttons par colonnes---------------------------------------------------------------------------------//
        this.switchButtonSaisieatterissage                   = page.locator('table > tbody > tr > td:nth-child(2) > p-celleditor .p-inputswitch.p-component input '); 
        this.switchButtonOuvertSaisieIniial                  = page.locator('table > tbody > tr > td:nth-child(3) > p-celleditor .p-inputswitch.p-component input');
        this.switchOuvertSaisieIniial                        = page.locator('table > tbody > tr > td:nth-child(3) > p-celleditor .p-inputswitch.p-component ');
        this.switchDejaOuvertSaisie                          = page.locator('table > tbody > tr > td:nth-child(4) > p-celleditor .p-inputswitch.p-component input ');
        this.switchButtonNouvelAtterissage                   = page.locator('table > tbody > tr > td:nth-child(6) > p-inputswitch .p-inputswitch-slider');
        
        //- Enregistre les modifications sur les directions d'exploitation-------------------------------------------------------//
        this.buttonEnregistrer                               = page.locator('button.btn-primary').nth(0);
        this.buttonCreerNouvelExercice                       = page.locator('button.btn-primary').nth(1);
        this.buttonCreerReforescast                          = page.locator('button.btn-primary').nth(2);
    
        this.onglest                                         = page.locator('p-tabmenu ul li[role="tab"]');

        this.spinner                                         = page.locator('.p-spinner.p-datatable-loading-icon');
    }
}
