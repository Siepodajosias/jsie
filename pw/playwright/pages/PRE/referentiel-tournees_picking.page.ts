/**
 * 
 * PREPARATION PAGE > REFERENTIEL / ONGLET > TOURNEES DE PICKING 
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class RefRTourneePickingPage {

    public readonly inputMagasin        : Locator  // .locator('#magasin-rayon-id');
    public readonly inputFiltreMagasin  : Locator  // .locator('[ng-model="ngModel"]');  
    public readonly inputOrdreTournee   : Locator  // .locator('table.table-modif-tournee > tbody > tr > td > input');       // Champs "Ordre" + "tournee"
    
    public readonly headersSemaine      : Locator  // .locator('.table-tournee > th');

    public readonly buttonAppliquer     : Locator  // .locator('[ng-click="appliquer();save();"]');    

    public readonly dataGridTournees    : Locator  // .locator('.tableau-referentiel-tournees .datagrid-table-wrapper > table > thead > tr > th');

    constructor(page: Page){

        this.inputMagasin        = page.locator('#magasin-rayon-id');
        this.inputFiltreMagasin  = page.locator('[ng-model="ngModel"]');  
        this.inputOrdreTournee   = page.locator('table.table-modif-tournee > tbody > tr > td > input');       // Champs "Ordre" + "tournee"
        
        this.headersSemaine      = page.locator('.table-tournee > th');

        this.buttonAppliquer     = page.locator('[ng-click="appliquer();save();"]');    

        this.dataGridTournees    = page.locator('.tableau-referentiel-tournees .datagrid-table-wrapper > table > thead > tr > th');
    }
}