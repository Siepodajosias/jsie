/**
 * 
 * FACTURATION PAGE > REGULATION / ONGLET > ECART EN ATTENTE
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page, test } from "@playwright/test"

export class RegulationEcartAttente {
    public readonly buttonCreerUnEcart                              :Locator
    public readonly buttonModifier                                  :Locator
    public readonly buttonJustifierLesEcarts                        :Locator
    public readonly buttonAnnulerJustification                      :Locator
    public readonly buttonRefuserLesEcarts                          :Locator
    public readonly buttonRegulEcartsJustifies                      :Locator
    public readonly inputSearch                                     :Locator
    public readonly listBoxArticles                                 :Locator
    public readonly dataGridEcartsArticles                          :Locator
    public readonly dataGridEcartsConstates                         :Locator

    public readonly pInputTypeEcart                                 :Locator
    public readonly pInputArticle                                   : Locator
    public readonly InputArticle                                    :Locator
    public readonly pInputMagasin                                   :Locator
    public readonly pInputEcart                                     :Locator
    public readonly pInputNbJours                                   :Locator
    public readonly pDatePicker                                     :Locator
    public readonly pButtonRechercher                               : Locator
    public readonly pButtonEnregsitrer                              :Locator
    public readonly pButtonFermer                                   :Locator
    public readonly pCheckBox                                       :Locator
    public readonly pListBoxMotifCreation                           :Locator
    public readonly pDataGridListeEcarts                            :Locator

    constructor(page:Page){
        this.buttonCreerUnEcart                                      = page.locator('button[ng-click="ouvrirPopupSaisieEcart()"]');
        this.buttonModifier                                          = page.locator('button[ng-click="ouvrirPopupSaisieEcart(data.ecartsSelectionnes[0])"]');
        this.buttonJustifierLesEcarts                                = page.locator('button[ng-click="justifierEcarts(data.ecartsSelectionnes)"]');
        this.buttonAnnulerJustification                              = page.locator('button[ng-click="annulerJustification(data.ecartsSelectionnes[0])"]');
        this.buttonRefuserLesEcarts                                  = page.locator('button[ng-click="ouvrirPopupRefusEnMasse(data.ecartsSelectionnes)"]');
        this.buttonRegulEcartsJustifies                              = page.locator('button[spinner-click="regulariserEcarts()"]');
        
        this.inputSearch                                             = page.locator('.filter-input');

        this.listBoxArticles                                         = page.locator('.control-group > select');

        this.dataGridEcartsArticles                                  = page.locator('.ecarts-articles .datagrid-table-wrapper > table > thead > tr > th'); 
        this.dataGridEcartsConstates                                 = page.locator('.ecarts-constates .datagrid-table-wrapper > table > thead > tr > th'); 

        //-- Popin : Création d'un écart de livraison -------------------------------------------------------------------------------
        this.pInputTypeEcart                                         = page.locator('#input-type-ecart');
        this.pInputArticle                                           = page.locator('#input-article');
        this.pInputMagasin                                           = page.locator('#input-magasin');
        this.pInputEcart                                             = page.locator('#input-ecart');
        this.pInputNbJours                                           = page.locator('#input-jours');            

        this.pDatePicker                                             = page.locator('.recherche-lots .datepicker-wrapper .icon-calendar').nth(0);

        this.pButtonRechercher                                       = page.locator('[ng-click="rechercherLots()"]');
        this.pButtonEnregsitrer                                      = page.locator('div.modal.hide.in > div.modal-footer > button');
        this.pButtonFermer                                           = page.locator('div.modal.hide.in > div.modal-footer > a');

        this.pCheckBox                                               = page.locator('#filtre-repartis-id');

        this.pListBoxMotifCreation                                   = page.locator('#input-motif');

        this.pDataGridListeEcarts                                    = page.locator('.form-saisie-ecart table > thead > tr > th');
    }
}