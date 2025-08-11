/**
 * 
 * REPARTITION PAGE > LOTS
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.1
 * 
 */

import { Locator, Page } from "@playwright/test"

export class LotsPage {

    //--------------------------------------------------------------------------------------------------------------

    public readonly inputFieldLots         : Locator  //(by.css('.filter-wrapper > input');

    public readonly buttonScinder          : Locator;  
    public readonly buttonAnnulerScission  : Locator  //(by.css('.annuler-scission-btn');
    public readonly buttonArborescence     : Locator  //(by.css('[ng-click="afficherArborescenceLotSelectionne()"]');
    public readonly table                  : Locator  //(by.css('.table-condensed');
    public readonly selectStatutLot        : Locator  //(by.css('.table-condensed');

    public readonly dataGridHeaders        : Locator  //.all(by.css('.etats-lots div.datagrid-table-wrapper table th');

    public readonly checkBoxLots           : Locator  //.all(by.css('.etats-lots div.datagrid-table-wrapper > table > tbody > tr > td > input');   

    //-- Popin : Scission lot --------------------------------------------------------------------------------------
    public readonly pPopinScission         : Locator
    public readonly pButtonScinder         : Locator  //.all(by.css('div.modal.hide.in > div.modal-footer > button').nth(0);
    public readonly pButtonVider           : Locator  //.all(by.css('div.modal.hide.in > div.modal-footer > button').nth(1);    
    public readonly pButtonAnnuler         : Locator  //(by.css('div.modal.hide.in > div.modal-footer > a'); 
    public readonly pButtonPlus            : Locator  //(by.id('btn-ajouter-ligne'); 

    public readonly pListBoxTypeScission   : Locator  //(by.model('typeScission');

    public readonly pDataGridListeLots     : Locator  //.all(by.css('.scission-lot-form table > thead > tr > th');
    public readonly pDataGridListeLignes   : Locator  //.all(by.css('.scission-lot-lignes table > thead > tr > th');        
    
    //--------------------------------------------------------------------------------------------------------------

    constructor(page:Page){

         //--------------------------------------------------------------------------------------------------------------

        this.inputFieldLots         = page.locator('.filter-wrapper > input');

        this.buttonScinder          = page.locator('[ng-click="scinder()"]');    
        this.buttonAnnulerScission  = page.locator('.annuler-scission-btn');
        this.buttonArborescence     = page.locator('[ng-click="afficherArborescenceLotSelectionne()"]');
        this.table                  = page.locator('.table-condensed');

        this.selectStatutLot        = page.locator('#statutLot');

        this.dataGridHeaders        = page.locator('.etats-lots div.datagrid-table-wrapper table th');

        this.checkBoxLots           = page.locator('.etats-lots div.datagrid-table-wrapper > table > tbody > tr > td > input');   

        //-- Popin : Scission lot --------------------------------------------------------------------------------------

        this.pPopinScission         = page.locator('.modal-backdrop')
        this.pButtonScinder         = page.locator('div.modal.hide.in > div.modal-footer > button').nth(0);
        this.pButtonVider           = page.locator('div.modal.hide.in > div.modal-footer > button').nth(1);    
        this.pButtonAnnuler         = page.locator('div.modal.hide.in > div.modal-footer > a'); 
        this.pButtonPlus            = page.locator('#btn-ajouter-ligne'); 

        this.pListBoxTypeScission   = page.locator('[ng-model="typeScission"]');

        this.pDataGridListeLots     = page.locator('.scission-lot-form table > thead > tr > th');
        this.pDataGridListeLignes   = page.locator('.scission-lot-lignes table > thead > tr > th');        
        
        //--------------------------------------------------------------------------------------------------------------
    }
}