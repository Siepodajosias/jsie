/**
 * Appli    :BUDGET
 * Menu     :PARAMETRAGE
 * Onglet   :COEFFICIENTS DE PROGRESSION
 * 
 * 
 * @author SIAKA KONE
 * @version 3.2
 * 
 */

import { Locator, Page } from "@playwright/test";

export class ParametrageCoeffProgression {

    public readonly listBoxAnneeExercice                                  : Locator; //('#anneeExercice');
    public readonly listBoxDirectionExploition                            : Locator; //('#exploitation');
    public readonly listBoxDirectionExploitionItem                        : Locator; //('#exploitation > option');
    public readonly listBoxGroupeArticle                                  : Locator; //('#groupeArticle');
    public readonly listBoxGroupeArticleItem                              : Locator; //('#groupeArticle > option');
    public readonly listBoxFiltre                                         : Locator; //('ul.p-column-filter-row-items li');

    public readonly dataTableCoefficientProgression                       : Locator; //('.p-datatable-scrollable-view'); //.p-datatable-scrollable-view .p-datatable-wrapper
    public readonly inputFiltreCoeff                                      : Locator; //('p-columnfilter input');
    public readonly inputdataTableAllInput                                : Locator; //('.p-datatable-scrollable-view tbody input ');
    public readonly inputUvcClientCoeffAncMag                             : Locator; //('input[formcontrolname="coefficientProgressionUvcPourcentage"]');
    public readonly inputUvcClientUvcClienNouvMag                         : Locator; //('input[formcontrolname="nombreUvcParClient"]');
    public readonly inputCaUvcCoeffNouvMag                                : Locator; //('input[formcontrolname="coefficientProgressionCaUvcPourcentage"]');
    public readonly inputCaUvcCaUvNouvMag                                 : Locator; //('input[formcontrolname="caUvc"]');
    public readonly inputProgressionMargeTheorique                        : Locator; //('input[formcontrolname="margeTheoriquePourcentage"]');
    public readonly inputProgressionMarTheoCoeffMag                       : Locator; //('input[formcontrolname="coefficientProgressionMargeTheoriquePoints"]');

    public readonly buttonEnregistrer                                     : Locator; //('.p-button-label');
    public readonly buttonInitialiser                                     : Locator;
    public readonly buttonFiltre                                          : Locator; //('button.p-column-filter-menu-button');
    public readonly buttonExporterTemplate                                : Locator; //('p-footer .btn.btn-primary.ml-2.p-button.p-component').nth(1)
    public readonly buttonImporter                                        : Locator; //('p-footer .btn.btn-primary.ml-2.p-button.p-component').nth(2)

    // Poppin:création d'un nouvel exercice
    public readonly pRadioButtonOui                                       : Locator;
    public readonly pRadioButtonNon                                       : Locator;

    public readonly pButtonCreerExercice                                  : Locator;

    public readonly pAppSpinnerCreerExercice                              : Locator; //('.app-spinner');

    //Poppin:Initialisation à partir d'une direction d'exploitation et d'un groupe article 
    public readonly pListboxDirectionExploitation                         : Locator; //('#directionExploitation');
    public readonly pListboxDirectionExploitationItem                     : Locator; //('.p-dropdown-items-wrapper .ng-tns-c76-7 p-dropdownitem li span ');
    public readonly pListboxGroupeArticle                                 : Locator; //('#groupeArticle');
    public readonly pListboxGroupeArticleItem                             : Locator; //('.p-dropdown-items-wrapper  .p-dropdown-items.ng-tns-c76-42 li span');                                 : Locator; //('#groupeArticle');
    public readonly pButtonInitialiser                                    : Locator; //('.p-dialog-footer.ng-tns-c60-6.ng-star-inserted  button');

    constructor(page: Page) {

        this.listBoxAnneeExercice                                        = page.locator('#anneeExercice');
        this.listBoxDirectionExploition                                  = page.locator('#exploitation');
        this.listBoxDirectionExploitionItem                              = page.locator('#exploitation > option');
        this.listBoxGroupeArticle                                        = page.locator('#groupeArticle').nth(0);
        this.listBoxGroupeArticleItem                                    = page.locator('#groupeArticle > option')
        this.listBoxFiltre                                               = page.locator('ul.p-column-filter-row-items li');

        this.dataTableCoefficientProgression                             = page.locator('.p-datatable-scrollable-view'); 

        this.inputFiltreCoeff                                            = page.locator('p-columnfilter input');
        this.inputdataTableAllInput                                      = page.locator('.p-datatable-scrollable-view tbody input ');
        this.inputUvcClientCoeffAncMag                                   = page.locator('input[formcontrolname="coefficientProgressionUvcPourcentage"]');
        this.inputUvcClientUvcClienNouvMag                               = page.locator('input[formcontrolname="nombreUvcParClient"]');
        this.inputCaUvcCoeffNouvMag                                      = page.locator('input[formcontrolname="coefficientProgressionCaUvcPourcentage"]');
        this.inputCaUvcCaUvNouvMag                                       = page.locator('input[formcontrolname="caUvc"]');
        this.inputProgressionMargeTheorique                              = page.locator('input[formcontrolname="margeTheoriquePourcentage"]');
        this.inputProgressionMarTheoCoeffMag                             = page.locator('input[formcontrolname="coefficientProgressionMargeTheoriquePoints"]');

        this.buttonEnregistrer                                           = page.locator('.p-button-label').nth(0);
        this.buttonInitialiser                                           = page.locator('.p-button-label').nth(1);
        this.buttonExporterTemplate                                      = page.locator('p-footer .btn.btn-primary.ml-2.p-button.p-component').nth(1);
        this.buttonImporter                                              = page.locator('p-footer .btn.btn-primary.ml-2.p-button.p-component').nth(2);
        this.buttonFiltre                                                = page.locator('button.p-column-filter-menu-button');
    
        // Poppin:création d'un nouvel exercice
        this.pRadioButtonOui                                            = page.locator('div.p-radiobutton.p-component').nth(0);
        this.pRadioButtonNon                                            = page.locator('div.p-radiobutton.p-component').nth(1);

        this.pButtonCreerExercice                                        = page.locator('button.btn.btn-primary.btn-md.button.mr-2');
        this.pAppSpinnerCreerExercice                                    = page.locator('.app-spinner');

        //Poppin:Initialisation à partir d'une direction d'exploitation et d'un groupe article 
        this.pListboxDirectionExploitation                               = page.locator('#directionExploitation');
        this.pListboxDirectionExploitationItem                           = page.locator('.p-dropdown-items-wrapper p-dropdownitem li span ');
        this.pListboxGroupeArticle                                       = page.locator('#groupeArticle').nth(1);
        this.pListboxGroupeArticleItem                                   = page.locator('.p-dropdown-items-wrapper  li span') 
        
        this.pButtonInitialiser                                          = page.locator('button.btn.btn-primary.btn-md.button.mr-2');

    }

}
