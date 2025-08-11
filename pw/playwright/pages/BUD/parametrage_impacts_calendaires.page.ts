/**
 * Appli    : BUDGET
 * Menu     : PARAMETRAGE
 * Onglet   : IMPACTS CALENDAIRES
 * 
 * 
 * @author SIAKA KONE
 * @version 3.0
 * 
 */

import { Locator, Page } from "@playwright/test";

export class ParametrageImpactsCalendaires {

    public readonly mistboxparamImpactCalendaireAnneeExercice   : Locator; //('#anneeExercice') };  
    public readonly dataTableparamDirection                     : Locator; //('.p-datatable-wrapper.ng-star-inserted');
    public readonly buttonEnregistrer                           : Locator; //('.p-button-label');
    public readonly dataHeader                                  : Locator; //('thead th');
    public readonly dataGrid                                    : Locator; //('.p-datatable-wrapper');
    public readonly inputimpactCalendaireFermeDimanchePourcen   : Locator; //('input[formcontrolname="impactCalendaireFermeDimanchePourcentage"]')
    public readonly inputimpactCalendaireOuvertDimanchePourcen  : Locator; //('input[formcontrolname="impactCalendaireOuvertDimanchePourcentage"]')
    
         
    constructor(page: Page) {

        this.mistboxparamImpactCalendaireAnneeExercice          = page.locator('#anneeExercice');  
        this.dataTableparamDirection                            = page.locator('.p-datatable-wrapper.ng-star-inserted');
        this.buttonEnregistrer                                  = page.locator('.p-button-label');
        this.dataHeader                                         = page.locator('thead th');
        this.dataGrid                                           = page.locator('.p-datatable-wrapper');
        this.inputimpactCalendaireFermeDimanchePourcen          = page.locator('input[formcontrolname="impactCalendaireFermeDimanchePourcentage"]');
        this.inputimpactCalendaireOuvertDimanchePourcen         = page.locator('input[formcontrolname="impactCalendaireOuvertDimanchePourcentage"]');
    }
}
