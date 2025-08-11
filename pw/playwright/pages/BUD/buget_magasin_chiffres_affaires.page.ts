/**
 * Appli    : BUDGET
 * Page     : BUDGET MAGASIN
 * Onglet   : CHIFFRES D'AFFAIRE
 * 
 * @author SIAKA KONE
 * @version 3.0
 */

import { Locator, Page } from "@playwright/test";

export class BudgetMagChiffreAffaire {
     
    public readonly listboxbmAnneeExercice                      : Locator; 
    public readonly listboxbmDirectionExploitation              : Locator; 
    public readonly listboxbmRegion                             : Locator; 
    public readonly listboxbmSecteur                            : Locator;
    public readonly listboxbmMagasin                            : Locator; 

    public readonly switchbmVueConsolide                        : Locator; 
    public readonly switchbmPerimetreConstant                   : Locator; 

    //- Onglet : 
    public readonly dataTablebmPerimetreConstant                : Locator; 
    public readonly dataTablebmFraicheDecoupe                   : Locator; 
    public readonly dataTablebmFruitsLegumes                    : Locator; 
    public readonly dataTablebmMaree                            : Locator; 
    public readonly dataTablebmTraiteurdeMer                    : Locator; 
    public readonly dataTablebmCoupeCorner                      : Locator; 

    public readonly tableGroupeArticle                          : Locator; 
    public readonly headerGroupeArticle                         : Locator; 

    constructor (page: Page) {

        this.listboxbmAnneeExercice                             = page.locator('#anneeExercice');
        this.listboxbmDirectionExploitation                     = page.locator('#exploitation');
        this.listboxbmRegion                                    = page.locator('#region');
        this.listboxbmSecteur                                   = page.locator('#secteur');
        this.listboxbmMagasin                                   = page.locator('#magasin');

        this.switchbmVueConsolide                               = page.locator('.p-inputswitch-slider').nth(0);
        this.switchbmPerimetreConstant                          = page.locator('.p-inputswitch-slider').nth(1);

        //- Onglet : 
        this.dataTablebmPerimetreConstant                       = page.locator('.p-datatable.p-component').nth(0);
        this.dataTablebmFraicheDecoupe                          = page.locator('.p-datatable.p-component').nth(1);
        this.dataTablebmFruitsLegumes                           = page.locator('.p-datatable.p-component').nth(2);
        this.dataTablebmMaree                                   = page.locator('.p-datatable.p-component').nth(3);
        this.dataTablebmTraiteurdeMer                           = page.locator('.p-datatable.p-component').nth(4);
        this.dataTablebmCoupeCorner                             = page.locator('.p-datatable.p-component').nth(5);

        this.tableGroupeArticle                                 = page.locator('p-accordiontab');
        this.headerGroupeArticle                                = page.locator('p-accordiontab p-header');
        
    }
             
}