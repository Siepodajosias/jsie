/**
 * 
 * REPARTITION PAGE > ARTICLES / ONGLET > CONSIGNES DE REPARTITION
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class ArticlesConsignesRepartitionPage {

    //--------------------------------------------------------------------------------------------------------------
    public readonly dataGridHeaders              : Locator  //.all(by.css('th.center');

    public readonly inputFieldConsignes          : Locator  //(by.css('.filter-input');
    
    public readonly buttonEditInstruction        : Locator  //(by.css('[ng-click="modifier(selection)"]');
    public readonly buttonCreateInstruction      : Locator  //(by.css('[ng-click="creer()"]');

    //-- Popin : Saisie de consigne article ------------------------------------------------------------------------
    public readonly pPopinSaisieConsigneArticle  : Locator
    public readonly pButtonValider               : Locator  //(by.id('btn-valider-modification');
    public readonly pButtonAnnuler               : Locator  //(by.css('#popup-modifier-consigne div.modal-footer > a');     

    public readonly pInputArticle                : Locator  //(by.id('input-article');
    public readonly pInputValiditeDebut          : Locator  //(by.id('input-debut-validite');
    public readonly pInputValiditeFin            : Locator  //(by.id('input-fin-validite');
    
    public readonly pTextAreaConsigne            : Locator  //(by.id('input-consigne');

    public readonly pDatePeackerDebut            : Locator  //.all(by.css('.form-modification-consigne .icon-calendar').nth(0);
    public readonly pDatePeackerFin              : Locator  //.all(by.css('.form-modification-consigne .icon-calendar').nth(1);

    public readonly pTdDatePeackerDay            : Locator  //.all(by.css('.datepicker-days td');
    public readonly pDatePeackerMonth            : Locator  //(by.css('.datepicker-days .datepicker-switch');

    public readonly pAutoCompleteArticles        : Locator  //.all(by.css('.gfit-autocomplete-results li');
    
    //--------------------------------------------------------------------------------------------------------------


    constructor(page:Page){
        
        //--------------------------------------------------------------------------------------------------------------
        this.dataGridHeaders               = page.locator('th.center');

        this.inputFieldConsignes           = page.locator('.filter-input');

        this.buttonEditInstruction         = page.locator('[ng-click="modifier(selection)"]');
        this.buttonCreateInstruction       = page.locator('[ng-click="creer()"]');

        //-- Popin : Saisie de consigne article ------------------------------------------------------------------------
        this.pPopinSaisieConsigneArticle   = page.locator('.modal-backdrop')
        this.pButtonValider                = page.locator('#btn-valider-modification');
        this.pButtonAnnuler                = page.locator('#popup-modifier-consigne div.modal-footer > a');     

        this.pInputArticle                 = page.locator('#input-article');
        this.pInputValiditeDebut           = page.locator('#input-debut-validite');
        this.pInputValiditeFin             = page.locator('#input-fin-validite');

        this.pTextAreaConsigne             = page.locator('#input-consigne');

        this.pDatePeackerDebut             = page.locator('.form-modification-consigne .icon-calendar').nth(0);
        this.pDatePeackerFin               = page.locator('.form-modification-consigne .icon-calendar').nth(1);

        this.pTdDatePeackerDay             = page.locator('.datepicker-days td');
        this.pDatePeackerMonth             = page.locator('.datepicker-days .datepicker-switch');

        this.pAutoCompleteArticles         = page.locator('.gfit-autocomplete-results li');

        //--------------------------------------------------------------------------------------------------------------
    }
}