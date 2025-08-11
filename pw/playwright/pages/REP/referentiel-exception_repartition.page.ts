/**
 * 
 * REPARTITION PAGE > REFERENTIEL / ONGLET >  EXCEPTION DE REPARTITION AUTOMATIQUE
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.1
 * 
 */

import { Locator, Page } from "@playwright/test"

export class RefExceptionRepartitionAutoPage {

     //--------------------------------------------------------------------------------------------------------------
     public readonly inputFiltreArticle               : Locator //.locator('div.container-article .filtre-article input');
     public readonly inputFiltreMagasin               : Locator //.locator('div.container-magasin .filtre-article input');
     public readonly dataGridArticle                  : Locator //.locator('#dg-articles-exception-repart-auto th');
     public readonly dataGridMagasin                  : Locator //.locator('#dg-magasins-exception-repart-auto th');
 
     public readonly checkBoxCptDataGridArticle       : Locator //.locator('#dg-articles-exception-repart-auto th input');
     public readonly checkBoxDataGridListeArticles    : Locator //.locator('#dg-articles-exception-repart-auto td input');
     public readonly checkBoxCptDataGridMagasin       : Locator //.locator('#dg-magasins-exception-repart-auto th input');
     public readonly checkBoxDataGridListeMagasins    : Locator //.locator('#dg-magasins-exception-repart-auto td input');
 
     public readonly buttonCreerExceptionArticle      : Locator //.locator('[ng-click="openPopupCreationExceptionArticle()"]');
     public readonly buttonCreerExceptionMagasin      : Locator //.locator('[ng-click="openPopupCreationExceptionMagasin()"]');
     public readonly buttonCreerException             : Locator   
     public readonly buttonSupprimerExceptionArticle  : Locator //.locator('[ng-click="supprimerExceptionArticle(dgArticles.selection)"]');
     public readonly buttonSupprimerExceptionMagasin  : Locator //.locator('[ng-click="supprimerExceptionMagasin(dgMagasins.selection)"]');
     public readonly buttonSupprimerException         : Locator
     public readonly dataGridHeaders                  : Locator //.locator('#dg-articles-exception-repart-auto th');
     public readonly dataGridDesignations             : Locator //.locator('td.datagrid-designationArticle');
     public readonly dataGridCodeArticle              : Locator //.locator('td.datagrid-codeArticle');
 
     //-- Popin : Création d'exception Article ----------------------------------------------------------------------
     public readonly pPopinCreationExcepArticle       : Locator
     public readonly pButtonEnregistrer               : Locator //.locator('div.modal.hide.in > div.modal-footer > button');   
     public readonly pButtonFermer                    : Locator //.locator('div.modal.hide.in > div.modal-footer > a'); 
 
     public readonly pInputArticle                    : Locator //.locator('[ng-model="search.articleFiltre"]');
     public readonly pInputException                  : Locator //.locator('[ng-model="exception.valeur"]');
 
     public readonly pListBoxTypeException            : Locator //.locator('[ng-model="exception"]');
 
     public readonly pAutoCompleteArticles            : Locator //.locator('.gfit-autocomplete-results li');
 
     //-- Popin : Création d'exception Magasin ----------------------------------------------------------------------
     public readonly pPopinCreationExcepMagasin       : Locator
     public readonly pButtonEnregistrerMagasin        : Locator //.locator('div.modal.hide.in > div.modal-footer > button');   
     public readonly pButtonFermerMagasin             : Locator //.locator('div.modal.hide.in > div.modal-footer > a'); 
 
     public readonly pInputMagasin                    : Locator //.locator('[ng-model="search.magasinFiltre"]');
 
     public readonly pListBoxTypeExceptionMagasin     : Locator //.locator('[ng-model="exception"]');
 
     public readonly pAutoCompleteMagasins            : Locator //.locator('.gfit-autocomplete-results li');    
     
     //--------------------------------------------------------------------------------------------------------------

     constructor(page:Page){

          //--------------------------------------------------------------------------------------------------------------
          this.inputFiltreArticle                = page.locator('div.container-article .filtre-article input');
          this.inputFiltreMagasin                = page.locator('div.container-magasin .filter-input');
          this.dataGridArticle                   = page.locator('#dg-articles-exception-repart-auto th');
          this.dataGridMagasin                   = page.locator('#dg-magasins-exception-repart-auto th');

          this.checkBoxCptDataGridArticle        = page.locator('#dg-articles-exception-repart-auto th input');
          this.checkBoxDataGridListeArticles     = page.locator('#dg-articles-exception-repart-auto td input');
          this.checkBoxCptDataGridMagasin        = page.locator('#dg-magasins-exception-repart-auto th input');
          this.checkBoxDataGridListeMagasins     = page.locator('#dg-magasins-exception-repart-auto td input');

          this.buttonCreerExceptionArticle       = page.locator('[ng-click="openPopupCreationExceptionArticle()"]');
          this.buttonCreerExceptionMagasin       = page.locator('[ng-click="openPopupCreationExceptionMagasin()"]');
          this.buttonCreerException              = page.locator('[ng-click="openPopupCreationExceptionArticle()"]');   
          this.buttonSupprimerExceptionArticle   = page.locator('[ng-click="supprimerExceptionArticle(dgArticles.selection)"]');
          this.buttonSupprimerExceptionMagasin   = page.locator('[ng-click="supprimerExceptionMagasin(dgMagasins.selection)"]');
          this.buttonSupprimerException          = page.locator('[ng-click="supprimerExceptionArticle(dgArticles.selection)"]');

          this.dataGridHeaders                   = page.locator('#dg-articles-exception-repart-auto th');
          this.dataGridDesignations              = page.locator('td.datagrid-designationArticle');
          this.dataGridCodeArticle               = page.locator('td.datagrid-codeArticle');

          //-- Popin : Création d'exception Article ----------------------------------------------------------------------
          this.pPopinCreationExcepArticle        = page.locator('.modal-backdrop')
          this.pButtonEnregistrer                = page.locator('div.modal.hide.in > div.modal-footer > button');   
          this.pButtonFermer                     = page.locator('div.modal.hide.in > div.modal-footer > a'); 

          this.pInputArticle                     = page.locator('[ng-model="search.articleFiltre"]');
          this.pInputException                   = page.locator('[ng-model="exception.valeur"]');

          this.pListBoxTypeException             = page.locator('[ng-model="exception"]');

          this.pAutoCompleteArticles             = page.locator('.gfit-autocomplete-results li');

          //-- Popin : Création d'exception Magasin ----------------------------------------------------------------------
          this.pPopinCreationExcepMagasin        = this.pPopinCreationExcepArticle
          this.pButtonEnregistrerMagasin         = page.locator('div.modal.hide.in > div.modal-footer > button');   
          this.pButtonFermerMagasin              = page.locator('div.modal.hide.in > div.modal-footer > a'); 

          this.pInputMagasin                     = page.locator('[ng-model="search.magasinFiltre"]');

          this.pListBoxTypeExceptionMagasin      = page.locator('[ng-model="exception"]');

          this.pAutoCompleteMagasins             = page.locator('.gfit-autocomplete-results li');    
    
          //--------------------------------------------------------------------------------------------------------------
     }
}