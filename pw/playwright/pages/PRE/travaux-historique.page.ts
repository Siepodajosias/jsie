/**
 * 
 * PREPARATION PAGE > AUTRES TRAVAUX / ONGLET > HISTORIQUE 
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.2
 * 
 */

import { Locator, Page } from "@playwright/test"

export class AurtresTravTHistoriquePage {

    public readonly datePickerFrom         : Locator //.locator('#input-start-date');
    public readonly datePickerTo           : Locator //.locator('#input-end-date');    
    
    public readonly inputSearchPreparateur : Locator //.locator('#preparateur-id');  
    public readonly inputSearchEquipe      : Locator //.locator('#preparateur-id');  

    public readonly listBoxTache           : Locator //.locator('#filtre-tache');

    public readonly buttonRechercher       : Locator //.locator('[ng-click="rechercherTachesHistorique()"]');    

    public readonly dataGridListesTaches   : Locator //.locator('#form-taches-historique .datagrid-table-wrapper > table > thead > tr > th');   

    constructor(page:Page){

        this.datePickerFrom          = page.locator('button.p-datepicker-trigger').nth(0); //('p-calendar.sigale-datepicker').nth(0);
        this.datePickerTo            = page.locator('button.p-datepicker-trigger').nth(1); //('p-calendar.sigale-datepicker').nth(1);    
        
        this.inputSearchPreparateur  = page.locator('input.p-autocomplete-input');  
        this.inputSearchEquipe       = page.locator('p-multiselect.ng-pristine'); 

        this.listBoxTache            = page.locator('[optionlabel="designation"]'); //('select.ng-pristine').nth(1);

        this.buttonRechercher        = page.locator('p-button button.p-button'); //('button.btn-recherche-tache-historique');    

        this.dataGridListesTaches    = page.locator('.p-datatable-wrapper > table > thead > tr.first-line > th'); 
    }
}