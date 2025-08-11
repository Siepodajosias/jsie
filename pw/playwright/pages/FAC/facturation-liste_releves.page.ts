/**
 * 
 *  FACTURATION PAGE > FACTURATION / ONGLET > LISTES DES RELEVES
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page, test } from "@playwright/test"

export class FacturationListeReleves {
    
    public readonly buttonRechercher                                : Locator     
    public readonly buttonGenererLesReleves                         : Locator 

    public readonly listBoxType                                     : Locator    

    public readonly inputNumeroReleve                               : Locator    
    public readonly inputCodeNomTiers                               : Locator   

    public readonly datePickerFrom                                  : Locator     
    public readonly datePickerTo                                    : Locator    

    public readonly dataGridListeReleves                            : Locator    
    //-- Popin : Génération des relevés de factures --------------------------------------------------------------------

    public readonly pPopinGenerationRelevesFactures                 : Locator

    public readonly pButtonGenerer                                  : Locator     
    public readonly pButtonFermer                                   : Locator        

    public readonly pDatePickerFrom                                 : Locator      
    public readonly pDatePickerTo                                   : Locator     

    public readonly pListBoxTypeTiers                               : Locator     
    public readonly pListBoxOptionsEnvoi                            : Locator     

    public readonly pCheckBoxUniquementTiers                        : Locator 
    public readonly pCheckBoxArchivage                              : Locator
    public readonly pInputCodeTiers                                 : Locator
    
    constructor(page:Page){
        
        this.buttonRechercher                                       = page.locator('[ng-click="queryReleves()"]');
        this.buttonGenererLesReleves                                = page.locator('[ng-click="popupGenerationReleves.open = true"]');

        this.listBoxType                                            = page.locator('#input-filter-type-facturable');

        this.inputNumeroReleve                                      = page.locator('[ng-model="filter.numero"]').locator('[ng-model="ngModel"]');
        this.inputCodeNomTiers                                      = page.locator('.recherche-facturable > input');

        this.datePickerFrom                                         = page.locator('[ng-click="toggleDatepicker($event)"]').nth(0);
        this.datePickerTo                                           = page.locator('[ng-click="toggleDatepicker($event)"]').nth(1);

        this.dataGridListeReleves                                   = page.locator('.datagrid-table-wrapper > table > thead > tr > th');

        //-- Popin : Génération des relevés de factures --------------------------------------------------------------------

        this.pPopinGenerationRelevesFactures                        = page.locator('.modal-backdrop')

        this.pButtonGenerer                                         = page.locator('div.modal.hide.in > div.modal-footer > button');
        this.pButtonFermer                                          = page.locator('div.modal.hide.in > div.modal-footer > a');    

        this.pDatePickerFrom                                        = page.locator('input.input-date').nth(0);
        this.pDatePickerTo                                          = page.locator('input.input-date').nth(1);    

        this.pListBoxTypeTiers                                      = page.locator('#formGenerationReleves #input-filter-type-facturable');
        this.pListBoxOptionsEnvoi                                   = page.locator('#input-filter-type-envoi-document');

        this.pCheckBoxUniquementTiers                               = page.locator('#input-uniquement-releve');
        this.pCheckBoxArchivage                                     = page.locator('#input-archivage');

        this.pInputCodeTiers                                        = page.locator('#input-filter-code-facturable');
    }
}
