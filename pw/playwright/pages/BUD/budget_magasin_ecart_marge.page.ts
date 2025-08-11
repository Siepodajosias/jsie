/**
 * Appli    : BUDGET
 * Page     : BUDGET MAGASIN
 * Onglet   : ECART DE MARGE
 * 
 * 
 * @author SIAKA KONE
 * @version 3.0
 * 
 */

import { Locator, Page } from "@playwright/test";

export class BudgetMagEcartMarge {
    
    public readonly listboxbmAnneeExercice                      : Locator; //('#anneeExercice');
    public readonly listboxbmDirectionExploitation              : Locator; //('#exploitation');
    public readonly listboxbmRegion                             : Locator; //('#region');
    public readonly listboxSecteur                              : Locator; //('#secteur');
    public readonly listboxbmMagasin                            : Locator; //('#magasin');

    public readonly switchbmVueConsolide                        : Locator; //('.p-inputswitch-slider').eq(0);
    public readonly switchbmPerimetreConstant                   : Locator; //('.p-inputswitch-slider').eq(1);

    public readonly dataGridGroupeArticle                       : Locator; //('p-accordion');
    public readonly dataGrid                                    : Locator; //('.p-accordion-tab');

    public readonly ButtontypeDeSaisie                                : Locator; //('div[role="button"].p-button.p-component.p-ripple');

    public readonly tableGroupeArticle                          : Locator; //('table[role="grid"]');
    public readonly tableInformationsEcartsMarge                : Locator; //('table-informations-ecarts-marge');

    public readonly headerGroupeArticle                         : Locator; //('p-accordiontab p-header');

    public readonly inputbmCoefficientProgression               : Locator; //('.p-inputtext.p-component.ng-pristine.ng-valid.p-filled.ng-touched');
    public readonly inputbmAnnee                                : Locator; //('.p-inputtext.p-component.ng-pristine.ng-valid.p-filled.ng-touched');
    public readonly inputbmCommentaire                          : Locator; //('.full-width.hauteur-ligne.p-inputtext.p-component.ng-pristine.ng-valid');
    public readonly inputFieldBudgetAnnuel                      : Locator; //('p-celleditor .cellule-ecarts-marge');
    public readonly inputFieldBudget                            : Locator; //('input[formcontrolname="ecartMargeBudgete"]');
    public readonly inputFieldBudgetSai                         : Locator; //('[formcontrolname="ecartMargeBudgete"]');
    public readonly inputFieldBudgetNbrCli                      : Locator; //('input[formcontrolname="nombreClientsBudgetes"]');
    
    public readonly buttonbmEnregistrer                         : Locator; //('.p-button-label'); 
    
    public readonly labelDanger                                 : Locator; //('budgets-magasins .alert-danger');

    constructor(page:Page) {

        this.listboxbmAnneeExercice                             = page.locator('#anneeExercice');
        this.listboxbmDirectionExploitation                     = page.locator('#exploitation');
        this.listboxbmRegion                                    = page.locator('#region');
        this.listboxSecteur                                     = page.locator('#secteur');
        this.listboxbmMagasin                                   = page.locator('#magasin');

        this.switchbmVueConsolide                               = page.locator('.p-inputswitch-slider').nth(0);
        this.switchbmPerimetreConstant                          = page.locator('.p-inputswitch-slider').nth(1);

        this.dataGridGroupeArticle                              = page.locator('p-accordion');
        this.dataGrid                                           = page.locator('.p-accordion-tab');
        
        this.ButtontypeDeSaisie                                       = page.locator('div[role="button"].p-button.p-component.p-ripple');

        this.tableGroupeArticle                                 = page.locator('table[role="grid"]');
        this.tableInformationsEcartsMarge                       = page.locator('table-informations-ecarts-marge');

        this.headerGroupeArticle                                = page.locator('p-accordiontab p-header');

        this.inputbmCoefficientProgression                      = page.locator('.p-inputtext.p-component.ng-pristine.ng-valid.p-filled.ng-touched');
        this.inputbmAnnee                                       = page.locator('.p-inputtext.p-component.ng-pristine.ng-valid.p-filled.ng-touched');
        this.inputbmCommentaire                                 = page.locator('.full-width.hauteur-ligne.p-inputtext.p-component.ng-pristine.ng-valid');
        this.inputFieldBudgetAnnuel                             = page.locator('p-celleditor .cellule-ecarts-marge');
        this.inputFieldBudget                                   = page.locator('input[formcontrolname="ecartMargeBudgete"]');
        this.inputFieldBudgetSai                                = page.locator('[formcontrolname="ecartMargeBudgete"]');
        this.inputFieldBudgetNbrCli                             = page.locator('input[formcontrolname="nombreClientsBudgetes"]');
        
        this.buttonbmEnregistrer                                = page.locator('.p-button-label'); 
    
        this.labelDanger                                        = page.locator('budgets-magasins .alert-danger');
    }
}
