/**
 * 
 * FACTURATION PAGE > REGULATION / ONGLET > ECHANGE DE MARCHANDISE
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page, test } from "@playwright/test"

export class RegulationEchangeMarchandisesPage {

    public readonly buttonAccepter                                          :Locator
    public readonly buttonRefuser                                           :Locator    

    public readonly checkBoxAfficherEcahnges                                :Locator

    public readonly inputSearchMagasin                                      :Locator
    public readonly inputSearchArticle                                      :Locator     

    public readonly dataGridDemandeEchanges                                 :Locator

    constructor(page:Page){
        
        this.buttonAccepter                                                 = page.locator('[ng-click="accepterDemandes(dg.selection)"]');
        this.buttonRefuser                                                  = page.locator('[ng-click="ouvrirPopupRefus(dg.selection[0])"]');    
    
        this.checkBoxAfficherEcahnges                                       = page.locator('#toutes-demandes');
    
        this.inputSearchMagasin                                             = page.locator('[ng-model="filtreMagasin"]').locator('[ng-model="ngModel"]');
        this.inputSearchArticle                                             = page.locator('[ng-model="filtreArticle"]').locator('[ng-model="ngModel"]');    
    
        this.dataGridDemandeEchanges                                        = page.locator('.datagrid-table-wrapper > table > thead > tr > th');  
    }
}