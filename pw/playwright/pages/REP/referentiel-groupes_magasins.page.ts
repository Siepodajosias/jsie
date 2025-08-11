/**
 * 
 * REPARTITION PAGE > REFERENTIEL / ONGLET >  GROUPES DE MAGASINS
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.1
 * 
 */

import { Locator, Page } from "@playwright/test"

export class RefGroupesMagasinPage {

       //--------------------------------------------------------------------------------------------------------------
       public readonly inputFiltre                  : Locator  //.locator('.filter-input.filter-wrapper');

       public readonly headerGrpMagList             : Locator  //.locator('.groupes-magasins div.datagrid-table-wrapper > table > thead > tr > th');
       public readonly headerMagList                : Locator  //.locator('.magasins div.datagrid-table-wrapper > table > thead > tr > th');

       public readonly buttonCreerGroupe            : Locator  //.locator('[ng-click="openPopupSaisieGroupeMagasin()"]');
       public readonly buttonModifierGroupe         : Locator  //.locator('[ng-click="openPopupSaisieGroupeMagasin(groupeSelectionne)"]');
       public readonly buttonEnregistrer            : Locator  //.locator('[ng-click="enregistrerMagasinsGroupeSelectionne()"]');

       public readonly tdDesignation                : Locator  //.locator('td.datagrid-designation');
       public readonly tdDesignationMag             : Locator

       //-- Popin : Création d'un groupe magasin ----------------------------------------------------------------------
       public readonly pPopinCreationGroupeMagasin  : Locator
       public readonly pButtonEnregistrer           : Locator  //.locator('div.modal.hide.in > div.modal-footer > button');   
       public readonly pButtonAnnuler               : Locator  //.locator('div.modal.hide.in > div.modal-footer > a'); 

       public readonly pInputDesignation            : Locator  //.locator('[ng-model="popupSaisieGroupeMagasin.groupeMagasin.designation"]');

       public readonly pCheckBoxActif               : Locator  //.locator('#input-actif');
       //--------------------------------------------------------------------------------------------------------------

       constructor(page:Page){

           //--------------------------------------------------------------------------------------------------------------
           this.inputFiltre                  = page.locator('.filter-input.filter-wrapper');

           this.headerGrpMagList             = page.locator('.groupes-magasins div.datagrid-table-wrapper > table > thead > tr > th');
           this.headerMagList                = page.locator('.magasins div.datagrid-table-wrapper > table > thead > tr > th');

           this.buttonCreerGroupe            = page.locator('[ng-click="openPopupSaisieGroupeMagasin()"]');
           this.buttonModifierGroupe         = page.locator('[ng-click="openPopupSaisieGroupeMagasin(groupeSelectionne)"]');
           this.buttonEnregistrer            = page.locator('[ng-click="enregistrerMagasinsGroupeSelectionne()"]');

           this.tdDesignation                = page.locator('td.datagrid-designation');
           this.tdDesignationMag             = page.locator('.magasins td.datagrid-designation');

           //-- Popin : Création d'un groupe magasin ----------------------------------------------------------------------
           this.pPopinCreationGroupeMagasin  = page.locator('.modal-backdrop')
           this.pButtonEnregistrer           = page.locator('div.modal.hide.in > div.modal-footer > button');   
           this.pButtonAnnuler               = page.locator('div.modal.hide.in > div.modal-footer > a'); 

           this.pInputDesignation            = page.locator('[ng-model="popupSaisieGroupeMagasin.groupeMagasin.designation"]');

           this.pCheckBoxActif               = page.locator('#input-actif');
           //--------------------------------------------------------------------------------------------------------------
       }
}