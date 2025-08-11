/**
 * Appli    :BUDGET
 * Menu     :PARAMETRAGE
 * Onglet   :INFORMATIONS MAGASIN
 * 
 * 
 * @author SIAKA KONE
 * @version 3.0
 * 
 */

import { Locator, Page } from "@playwright/test";

export class ParametrageInformationsMagasin {

   
    public readonly listBoxAnneeExercice                        : Locator; //('#anneeExercice');

    public readonly liltreColonneparamDesignation               : Locator; //('.p-sortable-column-icon.pi.pi-fw.pi-sort-alt').nth(0);
    public readonly liltreColonneparamSaisieBudget              : Locator; //('.p-sortable-column-icon.pi.pi-fw.pi-sort-alt').nth(1);

    public readonly dataTableparamInformationMagasin            : Locator; //('.p-datatable-scrollable-view');

    public readonly inputparamStrategieBU                       : Locator; //('input[formcontrolname="strategie"]');


    public readonly iconeparamAlerte                            : Locator; //('.fa.fa-info-circle');

    public readonly labelAlerte                                 : Locator; //('.ml-2.msg-info');
    public readonly labelparamStrategieBU                       : Locator; //('.titre-param-generaux').nth(0);
    public readonly labelparamParametreGeneraux                 : Locator; //('.titre-param-generaux').nth(1);

    public readonly listBoxbDirectionExploitation               : Locator; //('#direction-exploitation');
    public readonly listBoxExploitation                         : Locator; //('p-dropdownitem li');
    public readonly inputbmGroupeArticle                        : Locator; //('.p-inputtext.p-component.ng-pristine.ng-valid.ng-touched');

    public readonly inputSeuilAlerteSaisie                      : Locator; //('input[formcontrolname="seuilAlerteClients"]');
    
    public readonly buttonEnregistrer                           : Locator; //('button .p-button-label');

    public readonly theadInfoMag                                : Locator; //('thead th');

    constructor(page: Page) {

        this.listBoxAnneeExercice                               = page.locator('#anneeExercice');

        this.liltreColonneparamDesignation                      = page.locator('.p-sortable-column-icon.pi.pi-fw.pi-sort-alt').nth(0);
        this.liltreColonneparamSaisieBudget                     = page.locator('.p-sortable-column-icon.pi.pi-fw.pi-sort-alt').nth(1);
    
        this.dataTableparamInformationMagasin                   = page.locator('.p-datatable-scrollable-view');
    
        this.inputparamStrategieBU                              = page.locator('input[formcontrolname="strategie"]');
    
    
        this.iconeparamAlerte                                   = page.locator('.fa.fa-info-circle');
    
        this.labelAlerte                                        = page.locator('.ml-2.msg-info');
        this.labelparamStrategieBU                              = page.locator('.titre-param-generaux').nth(0);
        this.labelparamParametreGeneraux                        = page.locator('.titre-param-generaux').nth(1);
    
        this.listBoxbDirectionExploitation                      = page.locator('#direction-exploitation');
        this.listBoxExploitation                                = page.locator('p-dropdownitem li');
        this.inputbmGroupeArticle                               = page.locator('.p-inputtext.p-component.ng-pristine.ng-valid.ng-touched');
    
        this.inputSeuilAlerteSaisie                             = page.locator('input[formcontrolname="seuilAlerteClients"]');
        
        this.buttonEnregistrer                                  = page.locator('button .p-button-label');
    
        this.theadInfoMag                                       = page.locator('thead th');
    }

}
