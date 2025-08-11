/**
 * 
 * REPARTITION PAGE > ORDRES REPARTITION / ONGLET >  A ENVOYER
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page} from "@playwright/test"

export class OrdRepAEnvoyerPage {

     //--------------------------------------------------------------------------------------------------------------

     public readonly inputFiltre                 : Locator  //(by.css('.filter-input.filter-wrapper'));
   
     public readonly listResults                 : Locator  //.all(by.css('.paginator > table > tbody > tr > th'));  
     public readonly headerList                  : Locator  //.all(by.css('div.datagrid-table-wrapper > table > thead > tr > th'));
 
     public readonly checkBoxLot                 : Locator  //(by.css('#checkbox-lot'));
     public readonly checkboxArticle             : Locator  //(by.css('#checkbox-article'));
     public readonly checkboxFournisseur         : Locator  //(by.css('#checkbox-fournisseur'));
     public readonly checkboxLigneArticlesList   : Locator  //.all(by.css('.table > tbody > tr > td > input')).get(0);
     public readonly checkboxEnteteTableau       : Locator  //.all(by.css('.table > thead > tr > th > input'));
 
     public readonly buttonEnvoyerSansFusionner  : Locator  //(by.css('[ng-click="verifierEnvoiGroupe()"]'));
     public readonly buttonFusionnerEtEnvoyer    : Locator  //(by.css('[ng-click="afficherPopupFusion(ordresSelectionnes)"]'));
     public readonly buttonAnnuler               : Locator  //(by.css('[ng-click="afficherPopupAnnulation(ordresSelectionnes)"]'));
     public readonly buttonEnvoyer               : Locator  //.all(by.css('.icon-envelope.no-anim')).get(0);
 
     public readonly ongletOrdresEnvoyés         : Locator  //.all(by.css('.nav-tabs > li > a')).get(1);

     
     constructor(page:Page){
        
         //--------------------------------------------------------------------------------------------------------------
         this.inputFiltre                 = page.locator('.filter-input.filter-wrapper');
   
         this.listResults                 = page.locator('.paginator > table > tbody > tr > th');  
         this.headerList                  = page.locator('div.datagrid-table-wrapper > table > thead > tr > th');
     
         this.checkBoxLot                 = page.locator('#checkbox-lot');
         this.checkboxArticle             = page.locator('#checkbox-article');
         this.checkboxFournisseur         = page.locator('#checkbox-fournisseur');
         this.checkboxLigneArticlesList   = page.locator('.table > tbody > tr > td > input').nth(0);
         this.checkboxEnteteTableau       = page.locator('.table > thead > tr > th > input');
     
         this.buttonEnvoyerSansFusionner  = page.locator('[ng-click="verifierEnvoiGroupe()"]');
         this.buttonFusionnerEtEnvoyer    = page.locator('[ng-click="afficherPopupFusion(ordresSelectionnes)"]');
         this.buttonAnnuler               = page.locator('[ng-click="afficherPopupAnnulation(ordresSelectionnes)"]');
         this.buttonEnvoyer               = page.locator('.icon-envelope.no-anim').nth(0);
     
         this.ongletOrdresEnvoyés         = page.locator('.nav-tabs > li > a').nth(1);
     }
}