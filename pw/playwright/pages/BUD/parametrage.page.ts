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

export class Parametrage {

    public readonly ListboxparamAnneeCoeffProgrExercice                   : Locator; //('#anneeExercice');
    public readonly ListboxparamCoeffProgrDirectionExploition             : Locator; //('#exploitation');
    public readonly ListboxparamCoeffProgrGroupeArticle                   : Locator; //('#groupeArticle');

    public readonly DataTableparamCoefficientProgression                  : Locator; //('.p-datatable-wrapper.ng-star-inserted');

    public readonly InputTextparamPuvcCoeffProgression                    : Locator; //('.text-right.p-inputtext.p-component.ng-star-inserted').nth(0);
    public readonly InputTextparamPuvcUvcClient                           : Locator; //('.text-right.p-inputtext.p-component.ng-star-inserted').nth(1);
    public readonly InputTextparamPCauvcCoeffProgression                  : Locator; //('.text-right.p-inputtext.p-component.ng-star-inserted').nth(2);
    public readonly InputTextparamPuvcCaUvc                               : Locator; //('.text-right.p-inputtext.p-component.ng-star-inserted').nth(3);

    public readonly BoutonEnregistrer                                     : Locator; //('.btn.btn-primary.p-button.p-component');

    constructor(page : Page) {

        this.ListboxparamAnneeCoeffProgrExercice                   = page.locator('#anneeExercice');
        this.ListboxparamCoeffProgrDirectionExploition             = page.locator('#exploitation');
        this.ListboxparamCoeffProgrGroupeArticle                   = page.locator('#groupeArticle');

        this.DataTableparamCoefficientProgression                  = page.locator('.p-datatable-wrapper.ng-star-inserted');

        this.InputTextparamPuvcCoeffProgression                    = page.locator('.text-right.p-inputtext.p-component.ng-star-inserted').nth(0);
        this.InputTextparamPuvcUvcClient                           = page.locator('.text-right.p-inputtext.p-component.ng-star-inserted').nth(1);
        this.InputTextparamPCauvcCoeffProgression                  = page.locator('.text-right.p-inputtext.p-component.ng-star-inserted').nth(2);
        this.InputTextparamPuvcCaUvc                               = page.locator('.text-right.p-inputtext.p-component.ng-star-inserted').nth(3);

        this.BoutonEnregistrer                                     = page.locator('.btn.btn-primary.p-button.p-component');
    }
}
export default Parametrage;