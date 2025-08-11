/**
 * 
 * FACTURATION PAGE > REGULATION / ONGLET > AVOIRS COMPLEMENTAIRES
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page, test } from "@playwright/test"

export class RegularisationAvoirComplementaires {

    public readonly buttonCreerAvoir                                : Locator
    public readonly buttonRechercher                                : Locator

    public readonly datePickerFrom                                  : Locator
    public readonly datePickerTo                                    : Locator

    public readonly inputCodeNomTiers                               : Locator 
    
    public readonly listBoxtypeTiers                                : Locator       

    public readonly dataGridDemandesAvoirCpt                        : Locator 


    //-- Popin : Création d'un avoir -------------------------------------------------------------------------------------------

    public readonly pPopinCreationAvoir                             : Locator

    public readonly pButtonEnregsitrer                              : Locator      
    public readonly pButtonFermer                                   : Locator       
    public readonly pButtonPlus                                     : Locator       

    public readonly pInputFacturable                                : Locator     
    public readonly pInputArticle                                   : Locator        
    public readonly pInputNbColis                                   : Locator         
    public readonly pInputMontantUnitaire                           : Locator     
    public readonly pInputQuantite                                  : Locator        

    public readonly pDataGridListeArticles                          : Locator  

    public readonly pTextAreaCommentaire                            : Locator    

    constructor(page:Page){
        
        
    this.buttonCreerAvoir                                           = page.locator('[ng-click="ouvrirPopupAjoutAvoir(autocomplete.facturable)"]');
    this.buttonRechercher                                           = page.locator('[ng-click="queryAvoirs()"]');

    this.datePickerFrom                                             = page.locator('[ng-click="toggleDatepicker($event)"]').nth(0);
    this.datePickerTo                                               = page.locator('[ng-click="toggleDatepicker($event)"]').nth(1);

    this.inputCodeNomTiers                                          = page.locator('.recherche-facturable > input');
    
    this.listBoxtypeTiers                                           = page.locator('#input-filter-type-facturable');

    this.dataGridDemandesAvoirCpt                                   = page.locator('.datagrid-table-wrapper > table > thead > tr > th');


    //-- Popin : Création d'un avoir -------------------------------------------------------------------------------------------

    this.pPopinCreationAvoir                                        = page.locator('.modal-backdrop')

    this.pButtonEnregsitrer                                         = page.locator('div.modal.hide.in > div.modal-footer > button');
    this.pButtonFermer                                              = page.locator('div.modal.hide.in > div.modal-footer > a');
    this.pButtonPlus                                                = page.locator('[ng-click="ajouterLigneAvoir($event)"]');

    this.pInputFacturable                                           = page.locator('#input-tiers');
    this.pInputArticle                                              = page.locator('#input-article');
    this.pInputNbColis                                              = page.locator('#input-nb-colis');
    this.pInputMontantUnitaire                                      = page.locator('#input-mtt-unitaire');
    this.pInputQuantite                                             = page.locator('#input-quantite');    

    this.pDataGridListeArticles                                     = page.locator('.saisie-avoir table > thead > tr > th');

    this.pTextAreaCommentaire                                       = page.locator('#input-commentaire');
    }
}