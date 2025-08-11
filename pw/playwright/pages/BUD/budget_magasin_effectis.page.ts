/**
 * Appli    : BUDGET
 * Page     : BUDGET MAGASIN
 * Onglet   : EFFECTIFS
 * 
 * 
 * @author SIAKA KONE
 * @version 3.0
 * 
 */

import { Locator, Page } from "@playwright/test";

export class BudgetMagEffectifs {

    public readonly listboxbmAnneeExercice                      : Locator; //('#anneeExercice');;
    public readonly listboxbmDirectionExploitation              : Locator; //('#exploitation');;
    public readonly listboxbmRegion                             : Locator; //('#region');
    public readonly listboxbmSecteur                            : Locator; //('#region');
    public readonly listboxbmMagasin                            : Locator; //('#magasin');

    //------------------ ----------------------------------------------------------------------------//
    public readonly switchbmVueConsolide                        : Locator; //('.p-inputswitch-slider').eq(0);
    public readonly switchbmPerimetreConstant                   : Locator; //('.p-inputswitch-slider').eq(1);

    //- Liste les perimètre constant------------------------------------------------------//
    public readonly boutonRegroupement                          : Locator; //('.regroupement').eq(0);

    public readonly dataTablebmPerimetreConstant                : Locator; //('.p-datatable-wrapper.ng-star-inserted').eq(0);
    public readonly dataGridGroupeArticle                       : Locator; //('p-accordion');

    public readonly buttonRegroupement                          : Locator; //('.p-button .regroupement');
    public readonly buttonRegroupementFreshLS                   : Locator; //('.p-button .regroupement').eq(1);
    public readonly buttonTypePoste                             : Locator; //('p-selectbutton[name="poste"] [role="button"]');
    public readonly buttonTypeContrat                           : Locator; //('p-selectbutton[name="contrat"] [role="button"]');

    public readonly tableRecapitulatif                          : Locator; //('.tableaux-recap');
    public readonly tableGroupeArticle                          : Locator; //('table[role="grid"]');

    public readonly inputEtp                                    : Locator; //('p-celleditor input');
    public readonly inputHeureSup                               : Locator; //('p-celleditor input[formcontrolname="cdiHeuresSupplementaires"]');
    public readonly inputHeureCp                                : Locator; //('p-celleditor input[formcontrolname="cdiHeuresCp"]');
    public readonly inputHeureNormale                           : Locator; //('p-celleditor input[formcontrolname="cddHeuresNormales"]');
    public readonly inputHeureSupCdd                            : Locator; //('p-celleditor input[formcontrolname="cddHeuresSupplementaires"]');
    public readonly inputEtpCapPro                              : Locator; //('p-celleditor input[formcontrolname="capProEtp"]');
    public readonly inputHeureSupCapPro                         : Locator; //('p-celleditor input[formcontrolname="capProHeuresSupplementaires"]');
    public readonly inputHeuresCpCapPro                         : Locator; //('p-celleditor input[formcontrolname="capProHeuresCp"]');
    public readonly inputHeuresInterim                          : Locator; //('p-celleditor input[formcontrolname="interimHeures"]');
    public readonly inputAll                                    : Locator; //('p-celleditor input[formcontrolname]');

    public readonly iconCommentaire                             : Locator; //('popup-commentaire em');

    public readonly pPtextAreaCommentaire                       : Locator; //('textarea[formcontrolname="commentaire"]');
    public readonly pPbutton                                    : Locator; //('p-footer button span.p-button-label');      
    
    constructor(page: Page) {

        this.listboxbmAnneeExercice                             = page.locator('#anneeExercice');
        this.listboxbmDirectionExploitation                     = page.locator('#exploitation');
        this.listboxbmRegion                                    = page.locator('#region');
        this.listboxbmSecteur                                   = page.locator('#region');
        this.listboxbmMagasin                                   = page.locator('#magasin');

        //------------------ ----------------------------------------------------------------------------//
        this.switchbmVueConsolide                               = page.locator('.p-inputswitch-slider').nth(0);
        this.switchbmPerimetreConstant                          = page.locator('.p-inputswitch-slider').nth(1);

        //- Liste les perimètre constant------------------------------------------------------//
        this.boutonRegroupement                                 = page.locator('.regroupement').nth(0);

        this.dataTablebmPerimetreConstant                       = page.locator('.p-datatable-wrapper.ng-star-inserted').nth(0);
        this.dataGridGroupeArticle                              = page.locator('p-accordion');

        this.buttonRegroupement                                 = page.locator('.p-button .regroupement');
        this.buttonRegroupementFreshLS                          = page.locator('.p-button .regroupement').nth(1);
        this.buttonTypePoste                                    = page.locator('p-selectbutton[name="poste"] [role="button"]');
        this.buttonTypeContrat                                  = page.locator('p-selectbutton[name="contrat"] [role="button"]');

        this.tableRecapitulatif                                 = page.locator('.tableaux-recap');
        this.tableGroupeArticle                                 = page.locator('table[role="grid"]');

        this.inputEtp                                           = page.locator('p-celleditor input');
        this.inputHeureSup                                      = page.locator('p-celleditor input[formcontrolname="cdiHeuresSupplementaires"]');
        this.inputHeureCp                                       = page.locator('p-celleditor input[formcontrolname="cdiHeuresCp"]');
        this.inputHeureNormale                                  = page.locator('p-celleditor input[formcontrolname="cddHeuresNormales"]');
        this.inputHeureSupCdd                                   = page.locator('p-celleditor input[formcontrolname="cddHeuresSupplementaires"]');
        this.inputEtpCapPro                                     = page.locator('p-celleditor input[formcontrolname="capProEtp"]');
        this.inputHeureSupCapPro                                = page.locator('p-celleditor input[formcontrolname="capProHeuresSupplementaires"]');
        this.inputHeuresCpCapPro                                = page.locator('p-celleditor input[formcontrolname="capProHeuresCp"]');
        this.inputHeuresInterim                                 = page.locator('p-celleditor input[formcontrolname="interimHeures"]');
        this.inputAll                                           = page.locator('p-celleditor input[formcontrolname]');

        this.iconCommentaire                                    = page.locator('popup-commentaire em');

        this.pPtextAreaCommentaire                              = page.locator('textarea[formcontrolname="commentaire"]');
        this.pPbutton                                           = page.locator('p-footer button span.p-button-label'); 
        
    }
}
