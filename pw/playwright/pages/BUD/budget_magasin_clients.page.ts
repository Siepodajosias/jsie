/**
 * Appli    : BUDGET
 * Page     : BUDGET MAGASIN
 * Onglet   : CLIENTS
 * 
 * 
 * @author SIAKA KONE
 * @version 3.1
 * 
 */

import { Locator, Page } from "@playwright/test";

export class BudgetMagClients {

    public readonly listboxbmAnneeExercice               : Locator;
    public readonly listboxbmAnneeExerciceOption         : Locator;
    public readonly listboxbmDirectionExploitation       : Locator;
    public readonly listboxbmRegion                      : Locator;  
    public readonly listboxbmSecteur                     : Locator;         
    public readonly listboxbmMagasin                     : Locator;                        
 
    public readonly switchbmVueConsolide                 : Locator;               
    public readonly switchbmPerimetreConstant            : Locator;                  
     
    public readonly accordionsbmClients                  : Locator; 
 
    public readonly dataGridGroupeArticle                : Locator; 
    public readonly dataGrid                             : Locator; 
    public readonly dataGridHeader                       : Locator; 
    public readonly dataTable                            : Locator; 
    public readonly divBudgetsMagasins                   : Locator; 
    
    public readonly headerGroupeArticle                  : Locator; 
 
    public readonly inputFieldCoeffProgression           : Locator; 
    public readonly inputFieldNombreClient               : Locator; 
    public readonly inputFieldnombreAtterissage          : Locator;
    public readonly inputFieldNombreClientBud            : Locator; 
    public readonly inputFieldCommentaire                : Locator; 
 
    public readonly checkBoxCannibalisation              : Locator; 
 
    public readonly buttonbmEnregistrer                  : Locator;
    public readonly buttonCoeffProgression               : Locator; 
    public readonly buttonNombreClient                   : Locator; 
    public readonly buttonOnglets                        : Locator; 
 
    public readonly tableGroupeArticle                   : Locator; 

     constructor(page:Page) {

        this.listboxbmAnneeExerciceOption                = page.locator('#anneeExercice > option');
        this.listboxbmAnneeExercice                      = page.locator('#anneeExercice');
        this.listboxbmDirectionExploitation              = page.locator('#exploitation');
        this.listboxbmRegion                             = page.locator('#region');
        this.listboxbmSecteur                            = page.locator('#secteur');
        this.listboxbmMagasin                            = page.locator('#magasin');

        this.switchbmVueConsolide                        = page.locator('.p-inputswitch-slider').nth(0);
        this.switchbmPerimetreConstant                   = page.locator('.p-inputswitch-slider').nth(1);
        
        //- affiche ou cache les données d'un budgets clients
        this.accordionsbmClients                         = page.locator('.p-accordion-toggle-icon');

        //-Tableaux: Liste les budgets pour les differents rayons------------------------------------------------------------------------------------------------------//

        this.dataGridGroupeArticle                       = page.locator('p-accordion');
        this.dataGrid                                    = page.locator('.p-accordion-tab');
        this.dataGridHeader                              = page.locator('.p-accordion-tab div[role="region"]');
        this.dataTable                                   = page.locator ('.p-accordion-tab div[role="region"]');
        this.divBudgetsMagasins                          = page.locator ('budgets-magasins');
    
        this.headerGroupeArticle                         = page.locator('p-accordiontab p-header');

        this.inputFieldCoeffProgression                  = page.locator('p-celleditor input[formcontrolname="coefficientProgressionPourcentageBudgete"]');
        this.inputFieldNombreClient                      = page.locator('p-celleditor input[formcontrolname="nombreClientsBudgetes"]');
        this.inputFieldNombreClientBud                   = page.locator('[formcontrolname="nombreClientsBudgetes"]');
        this.inputFieldnombreAtterissage                 = page.locator('[formcontrolname="nombreClientsAtterrissage"]');
        this.inputFieldCommentaire                       = page.locator('p-celleditor input[formcontrolname="commentaire"]');

        this.checkBoxCannibalisation                     = page.locator('p-celleditor p-checkbox[formcontrolname="cannibalisation"]');

        this.buttonbmEnregistrer                         = page.locator('.p-button-label');
        this.buttonCoeffProgression                      = page.locator('.p-menuitem-text').nth(0);
        this.buttonNombreClient                          = page.locator('p-selectbutton .p-button').nth(1);
        this.buttonOnglets                               = page.locator('a[role="presentation"]');

        this.tableGroupeArticle                          = page.locator('table[role="grid"]');
    }
        
 }
 