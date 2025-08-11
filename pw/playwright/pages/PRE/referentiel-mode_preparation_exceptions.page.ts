/**
 * 
 * APPLI    : PREPARATION 
 * PAGE     : REFERENTIEL 
 * ONGLET   : MODE DE PREPARATION ET EXCEPTION
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.2
 * 
 */

import { Locator, Page } from "@playwright/test"

export class RefModePrepaExcepPage {

    public readonly inputArticle                : Locator;     

    public readonly buttonCreerException        : Locator;

    public readonly dataGridListeGroupes        : Locator;
    public readonly dataGridListearticles       : Locator;

    public readonly tdListeLibelleGrpArticle    : Locator;     
    public readonly tdListeActions              : Locator;     

    //-- Popin : Créer une exception de préparation --------------------------------------------------------------------------
    public readonly pInputArticleExp            : Locator;

    public readonly pAutocompleteArticleExp     : Locator; 

    public readonly pButtonCreerExp             : Locator;
    
    public readonly pIconCalendarDebutExp       : Locator;
    public readonly pIconCalendarFinExp         : Locator;    

    public readonly pTdDaysEvalableExp          : Locator;

    //-- Suppression d'une exception -----------------------------------------------------------------------------------------
    public readonly pSuppButtonSupprimer        : Locator;

    constructor(page:Page){
         
        this.inputArticle               = page.locator('[ng-model="ngModel"]');  

        this.buttonCreerException       = page.locator('button[ng-click="afficherPopupCreationModificationExceptionPreparation(groupeArticlePlateformeSelectionne[0], true)"]');    

        this.dataGridListeGroupes       = page.locator('.tab-groupe-article-plateforme .datagrid-table-wrapper > table > thead > tr > th');
        this.dataGridListearticles      = page.locator('.tab-articles-exception-mode-de-preparation .datagrid-table-wrapper > table > thead > tr > th'); 

        this.tdListeLibelleGrpArticle   = page.locator('td.datagrid-groupeArticleVO-designation');
        this.tdListeActions             = page.locator('td.actiontd');

        //-- Popin : Créer une exception de préparation --------------------------------------------------------------------------
        this.pInputArticleExp           = page.locator('#article-id');

        this.pAutocompleteArticleExp    = page.locator('.gfit-autocomplete-results li');

        this.pButtonCreerExp            = page.locator('form div.modal-footer button:not(.ng-hide)');
        
        this.pIconCalendarDebutExp      = page.locator('.icon-calendar').nth(0);
        this.pIconCalendarFinExp        = page.locator('.icon-calendar').nth(1);    

        this.pTdDaysEvalableExp         = page.locator('td.day:not(.disabled)');     // Journées clickables dans le calendrier

        //-- Suppression d'une exception -----------------------------------------------------------------------------------------
        this.pSuppButtonSupprimer       = page.locator('form[id="form-confirmation-suppression-exception"] div.modal-footer button:not(.ng-hide)');

    }
}