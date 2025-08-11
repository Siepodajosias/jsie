/**
 * 
 * Appli    : PREPARATION 
 * PAGE     : AUTRES TRAVAUX
 * ONGLET   : TACHES DU JOUR  
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.4
 * 
 */

import { Locator, Page } from "@playwright/test"

export class AurtresTacheDuJourPage {

    
    public readonly buttonTacheAdd          : Locator;  // .locator('[ng-click="popupCreationModificationTache()"]');
    public readonly buttonTacheUpdate       : Locator;  // .locator('[ng-click="popupCreationModificationTache(tachesSelectionnees[0])"]');
    public readonly buttonTacheDelete       : Locator;  // .locator('[ng-click="supprimerTache(tachesSelectionnees[0])"]');   
    public readonly buttonImpAutresTaches   : Locator;
    
    public readonly inputSearchPreparateur  : Locator;  // .locator('[ng-model="ngModel"]');  

    public readonly listBoxTache            : Locator;  // .locator('#filtre-tache');

    public readonly checkBoxAfficherTermine : Locator;  // .locator('#checkbox-toggle-articles');    

    public readonly dataGridListetaches     : Locator;    // .locator('.taches-du-jour .datagrid-table-wrapper > table > thead > tr > th'); 
    public readonly dataGridInputCdeTache   : Locator;   // .locator('div.p-datatable-wrapper Table thead tr:nth-child(2) th.colonne-codePreparateur input')
    public readonly dataGridThListeTaches   : Locator;  // .locator('div.p-datatable-wrapper Table tbody tr'); 
    //-- Popin : Créer une tâche ---------------------------------------------------------------------------------------------
    public readonly pPopinCreerTache        : Locator;
    public readonly pButtonEnregistrer      : Locator;  // .locator('div.modal.hide.in > div.modal-footer > button').nth(0);  
    public readonly pButtonAnnuler          : Locator;  // .locator('div.modal.hide.in > div.modal-footer > a'); 

    public readonly pInputPrepareteur       : Locator;  // .locator('#preparateur-id');
    public readonly pInputHeureDebut        : Locator;  // .locator('[ng-model="model.heureDebut"]');
    public readonly pInputMinuteDebut       : Locator;  // .locator('[ng-model="model.minuteDebut"]');
    public readonly pInputHeureFin          : Locator;  // .locator('[ng-model="model.heureFin"]');
    public readonly pInputMinuteFin         : Locator;  // .locator('[ng-model="model.minuteFin"]');

    public readonly pListBoxTache           : Locator;  // .locator('#tache-id');

    public readonly pTextAreaCommentaire    : Locator;  // .locator('[ng-model="model.commentaire"]');

    public readonly pAutoCompleteNomPrepa   : Locator;  // .locator('.gfit-autocomplete-results li');

    //-- Popin : Impression des autres tâches ----------------------------------------------------------------------------------------------------------
    public readonly pPopinImpAutresTaches   : Locator;
    public readonly pInputFieldNombreImp    : Locator;
    public readonly pButtonImprimer         : Locator;
    public readonly pLinkFermer             : Locator;

    constructor(page:Page){
        
        this.buttonTacheAdd          = page.locator('.sigale-page-footer button').nth(0);
        this.buttonTacheUpdate       = page.locator('.sigale-page-footer button').nth(1);
        this.buttonTacheDelete       = page.locator('.sigale-page-footer button').nth(2);  
        this.buttonImpAutresTaches   = page.locator('.sigale-page-footer button').nth(3); 
        
        this.inputSearchPreparateur  = page.locator('[ng-model="ngModel"]');    

        this.listBoxTache            = page.locator('#filtre-tache');

        this.checkBoxAfficherTermine = page.locator('#checkbox-toggle-articles');    

        this.dataGridListetaches     = page.locator('tr.first-line > th');
        this.dataGridThListeTaches   = page.locator('div.p-datatable-wrapper Table tbody tr'); 
        this.dataGridInputCdeTache   = page.locator('div.p-datatable-wrapper Table thead tr:nth-child(2) th.colonne-codePreparateur input');
        
        //-- Popin : Créer une tâche ---------------------------------------------------------------------------------------------
        this.pPopinCreerTache        = page.locator('.modal-backdrop');
        this.pButtonEnregistrer      = page.locator('p-button[title="Enregistrer"]');  
        this.pButtonAnnuler          = page.locator('p-button').nth(1); 

        this.pInputPrepareteur       = page.locator('input[name="preparateur"]');
        this.pInputHeureDebut        = page.locator('[name="heure-debut-input"]');
        this.pInputMinuteDebut       = page.locator('[name="minute-debut-input"]');
        this.pInputHeureFin          = page.locator('[name="heure-fin-input"]');
        this.pInputMinuteFin         = page.locator('[name="minute-fin-input"]');

        this.pListBoxTache           = page.locator('#type').nth(0);

        this.pTextAreaCommentaire    = page.locator('#commentaire');

        this.pAutoCompleteNomPrepa   = page.locator('.gfit-autocomplete-results li');

        // -- Popin : Impression des tâches --------------------------------------------------------------------------------------------------
        this.pPopinImpAutresTaches   = page.locator('div.p-dialog-header');

        this.pInputFieldNombreImp    = page.locator('div.table-types-tache input');

        this.pButtonImprimer         = page.locator('p-footer button').nth(0);

        this.pLinkFermer             = page.locator('p-footer button').nth(1); //('p-footer a');

    }
    
}