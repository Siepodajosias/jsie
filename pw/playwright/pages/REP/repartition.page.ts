/**
 * 
 * REPARTITION PAGE > REPARTITION
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.3
 * 
 */

import { Locator, Page } from "@playwright/test"

export class RepartitionPage {
   //--------------------------------------------------------------------------------------------------------------

   public readonly  linkSelectArticle          : Locator  //.locator('[ng-click="choisirArticle($event, true)"]');
    
   public readonly infosRepartArticle          : Locator  //.locator('.infos-repartition-article');
   public readonly infosArticle                : Locator;
   public readonly infosRepartSomme            : Locator  //.locator('.infos-repartition-sommes');
   
   public readonly headerLotsList              : Locator  //.locator('div.repartition-lots-a-repartir div.datagrid-table-wrapper > table > thead > tr > th');
   public readonly headerlistMag               : Locator  //.locator('div.grille-repartition div.datagrid-table-wrapper > table > thead > tr > th');
   public readonly headerLotsValides           : Locator  //.locator('div.repartition-lots-valides div.datagrid-table-wrapper > table > thead > tr > th');

   public readonly listLotsARepartir           : Locator  //.locator('.repartition-lots-a-repartir');
   public readonly listLotsValides             : Locator  //.locator('.table.table-striped.table-bordered.table-hover.table-condensed').nth(1);
   public readonly listMag                     : Locator  //.locator('.table.table-striped.table-bordered.table-hover.table-condensed').nth(2);
   public readonly lotARepartir                : Locator

   public readonly checkboxLigneLotRepart      : Locator  //.locator('.table.table-striped.table-bordered.table-hover.table-condensed > tbody > tr > td > input').nth(0);
   public readonly checkBoxMagasin             : Locator  //.locator('#checkbox-magasin');
   public readonly checkBoxRegion              : Locator  //.locator('#checkbox-region');
   public readonly checkBoxSecteur             : Locator  //.locator('#checkbox-secteur');
   public readonly checkBoxLot                 : Locator  //.locator('#checkbox-lot');

   public readonly inputFilter                 : Locator  //.locator('.filter-input.grille-repartition-filtres-input.filter-wrapper.filter-wrapper');
   public readonly inputRepartitionVolume      : Locator  //.locator('#pourcentageRepartition');
   public readonly inputQteColisRepartir       : Locator  //.locator('#colisParMagasin');

   public readonly datePickerCommande          : Locator  //.locator('.datepicker-repartition');

   public readonly dropDownFiltre              : Locator  //.locator('.dropdown-filtres');

   public readonly buttonChangerPrev           : Locator  //.locator('[ng-click="changerPrevisions()"]');
   public readonly buttonChangerRepart         : Locator  //.locator('[ng-click="changerRepartition()"]');
   public readonly buttonAddLigneMagasin       : Locator  //.locator('[ng-click="ajouterLigneMagasinsAffiches()"]');
   public readonly buttonMasquerMagasinServis  : Locator  //.locator('[ng-click="masquerMagasinsServis()"]');
   public readonly buttonsFiltrePaysFrance     : Locator  //.locator('[ng-click="filtrerMagasinsParPays(pays)"]').nth(0);
   public readonly buttonsFiltrePaysItalie     : Locator  //.locator('[ng-click="filtrerMagasinsParPays(pays)"]').nth(1);
   public readonly buttonsFiltrePaysBelgique   : Locator  //.locator('[ng-click="filtrerMagasinsParPays(pays)"]').nth(2);
   public readonly buttonTerminerRepart        : Locator  //.locator('[ng-click="terminerRepartition()"');
   public readonly buttonTerminerEtSuivant     : Locator;
   public readonly buttonValiderRepart         : Locator  //.locator('[ng-click="validerRepartition()"]');
   public readonly buttonSauvegarderRepart     : Locator  //.locator('[ng-click="sauverRepartition()"]');
   public readonly buttonRepartirEnUneFois     : Locator  //.locator('.btn.btn-primary').nth(4);
   public readonly buttonEffacer               : Locator  //.locator('[ng-click="effacerRepartitionLot()"]');
   public readonly buttonRevenir               : Locator  //.locator('[ng-click="navigate()"]');
   public readonly buttonReprendreRepart       : Locator  //.locator('[ng-click="reprendreRepartition()"]');
   public readonly buttonSauvegarderValider    : Locator;

   public readonly pAttention                  : Locator;
   public readonly pButtonFermer               : Locator;
   public readonly pButtonValider              : Locator;
   public readonly pButtonOui                  : Locator;

   public readonly pSpinner                    : Locator;
   

   //--------------------------------------------------------------------------------------------------------------  

   constructor(page:Page){

      //--------------------------------------------------------------------------------------------------------------

      this.linkSelectArticle           = page.locator('[ng-click="choisirArticle($event, true)"]');
   
      this.infosRepartArticle          = page.locator('.infos-repartition-article');
      this.infosArticle                = page.locator('.infos-repartition-article h5 strong');
      this.infosRepartSomme            = page.locator('.infos-repartition-sommes');
      
      this.headerLotsList              = page.locator('div.repartition-lots-a-repartir div.datagrid-table-wrapper > table > thead > tr > th');
      this.headerlistMag               = page.locator('div.grille-repartition div.datagrid-table-wrapper > table > thead > tr > th');
      this.headerLotsValides           = page.locator('div.repartition-lots-valides div.datagrid-table-wrapper > table > thead > tr > th');
   
      this.listLotsARepartir           = page.locator('.repartition-lots-a-repartir');
      this.listLotsValides             = page.locator('.table.table-striped.table-bordered.table-hover.table-condensed').nth(1);
      this.listMag                     = page.locator('.table.table-striped.table-bordered.table-hover.table-condensed').nth(2);
      this.lotARepartir                = page.locator('[checkbox="checkboxLots"] tbody tr td.datagrid-numero');
   
      this.checkboxLigneLotRepart      = page.locator('.table.table-striped.table-bordered.table-hover.table-condensed > tbody > tr > td > input').nth(0);
      this.checkBoxMagasin             = page.locator('#checkbox-magasin');
      this.checkBoxRegion              = page.locator('#checkbox-region');
      this.checkBoxSecteur             = page.locator('#checkbox-secteur');
      this.checkBoxLot                 = page.locator('#checkbox-lot');
   
      this.inputFilter                 = page.locator('.filter-input.grille-repartition-filtres-input.filter-wrapper.filter-wrapper');
      this.inputRepartitionVolume      = page.locator('#pourcentageRepartition');
      this.inputQteColisRepartir       = page.locator('#colisParMagasin');
   
      this.datePickerCommande          = page.locator('.datepicker-repartition');
   
      this.dropDownFiltre              = page.locator('.dropdown-filtres');
   
      this.buttonChangerPrev           = page.locator('[ng-click="changerPrevisions()"]');
      this.buttonChangerRepart         = page.locator('[ng-click="changerRepartition()"]');
      this.buttonAddLigneMagasin       = page.locator('[ng-click="ajouterLigneMagasinsAffiches()"]');
      this.buttonMasquerMagasinServis  = page.locator('[ng-click="masquerMagasinsServis()"]');
      this.buttonsFiltrePaysFrance     = page.locator('[ng-click="filtrerMagasinsParPays(pays)"]').nth(0);
      this.buttonsFiltrePaysItalie     = page.locator('[ng-click="filtrerMagasinsParPays(pays)"]').nth(1);
      this.buttonsFiltrePaysBelgique   = page.locator('[ng-click="filtrerMagasinsParPays(pays)"]').nth(2);
      this.buttonTerminerRepart        = page.locator('[ng-click="terminerRepartition()"');
      this.buttonTerminerEtSuivant     = page.locator('[ng-click="verifierRepartitionMagasins(true)"]');
      this.buttonValiderRepart         = page.locator('[ng-click="validerRepartition()"]');
      this.buttonSauvegarderRepart     = page.locator('[ng-click="sauverRepartition()"]');
      this.buttonRepartirEnUneFois     = page.locator('.form-btn-section [title="Répartir le lot en une fois"]');
      this.buttonEffacer               = page.locator('[ng-click="effacerRepartitionLot()"]');
      this.buttonRevenir               = page.locator('[ng-click="navigate()"]');
      this.buttonReprendreRepart       = page.locator('[ng-click="reprendreRepartition()"]');
      this.buttonSauvegarderValider    = page.locator('[ng-click="sauverEtValiderRepartition()"]');

      this.pAttention                  = page.locator('.modal.hide.in');
      this.pButtonFermer               = page.locator('.modal-footer a.ng-binding');
      this.pButtonValider              = page.locator('.modal-valider-repartition .modal-footer [data-role="ok"]');
      this.pButtonOui                  = page.locator('.modal-valider-repartition .modal-footer [data-role="ok"]');

      this.pSpinner                    = page.locator('div.datagrid-container div.progressRingCentre:NOT(.ng-hide)');
      
      //--------------------------------------------------------------------------------------------------------------

   }

}