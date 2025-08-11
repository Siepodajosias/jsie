/**
 * Appli    : QUALITE
 * PAGE     : CONTROLES
 * Onglet   : TEMPERATURE
 * 
 * 
 * @author SIAKA KONE
 * @version 3.2
 * 
 */

import { Locator, Page } from "@playwright/test";
import { TestFunctions } from "@helpers/functions";

export class ControlesTemperatures {

    public readonly datepickerControleTemperature      : Locator; //('.p-datepicker-trigger'); 
    public readonly datepickerControleTemperature1     : Locator; //('.p-monthpicker ');

    public readonly listBoxLieudeVente                 : Locator; //('app-selection-lieu-vente [role="button"]');
    public readonly inputLieuVente                     : Locator; //('div.p-dropdown-header div.p-dropdown-filter-container');
    public readonly pdropdownLieuVente                 : Locator; //('p-dropdownitem');

    public readonly datagridControleTemperature        : Locator; //(' div.p-datatable'); //tableau des arrivages 
    public readonly datagridheadControleTemperature    : Locator; //(' div.p-datatable th.text-center '); // les entêtes du tableau des arrivages à vérifier
    public readonly dataGridDonneeTemperature          : Locator; //(' p-table .p-datatable-scrollable-body.ng-star-inserted .p-datatable-tbody');


    public readonly datagridListBoxPeriodeJournee      : Locator; //('#filtre-periode-journee [role="button"]');
    public readonly datagridListBoxStatut              : Locator; //('#filtre-statut [role="button"]');

    public readonly datagridInputnonConformite         : Locator; //('#filtre-non-conformites [role="button"]');
    public readonly datagridInputTauxderealisation     : Locator; //('#filtre-taux-de-realisation [role="button"]');
    public readonly datagridInputControleur            : Locator; //('#filtre-controleur [role="button"]');

    public readonly buttonDemarrerControle             : Locator; //('.footerBar button > em.fas.fa-play');
    public readonly buttonReprendreControle            : Locator; //('.footerBar button > em.fas.fa-forward'); 
    public readonly buttonVisualiserControle           : Locator; //('.footerBar button > em.fas.fa-eye'); 
    public readonly buttonImprimerResultat             : Locator; //('.footerBar button > em.fas.fa-print'); 
    public readonly buttonCorrigerControle             : Locator; //('.footerBar button > em.fas.fa-pencil-alt');  

    public readonly checkBoxControleTemperature        : Locator; //(' tr:nth-child(1) > td:nth-child(1) p-tablecheckbox > div'); //checkbox  masquer les contrôles

    public readonly ButtonAnnuler                      : Locator; //('.p-dialog-footer button.p-button-text');

    //-- POPIN : CONTROLE EN COURS --------------------------------------------------------------------------------------//

    public readonly pPCecPopinControleEnCours           : Locator; //('.p-dialog-content');
    public readonly pPCecOngletchambreFroide            : Locator; //('li.ng-star-inserted a.p-tabview-nav-link').eq(1);
    public readonly pPCecInputControleur                : Locator; //('app-info-controle-temperature #input-controleur');   
    public readonly pPCecInputControlDegre              : Locator; //('app-intervalle input[type="number"]'); 
    public readonly pPCecInputControlDiv                : Locator; //('div.mobilier input'); 
    public readonly pPCecInputControlDegreChambreFroide : Locator; //('app-intervalle input:NOT(.ng-untouched)'); 
    
    public readonly pPCecButtonCorrigerControle          : Locator; //('app-footer-controle-temperature > .ng-star-inserted');
    public readonly pPCecButtonEnregistrer               : Locator; //('p-footer > app-footer-controle-temperature > button:nth-child(1)')  }  
    public readonly pPCecButtonTerminer                  : Locator; //('p-footer > app-footer-controle-temperature > button:nth-child(2)')  }  
    public readonly pPCecButtonAnnuler                   : Locator; //('p-footer > app-footer-controle-temperature .p-button-text');
    public readonly pPCecButtonFermer                    : Locator; //('.p-button-text');

    public readonly fonction = new TestFunctions();
    
    constructor(page: Page) {

        this.datepickerControleTemperature      = page.locator('.p-datepicker-trigger'); 
        this.datepickerControleTemperature1     = page.locator('.p-monthpicker ');

        this.listBoxLieudeVente                 = page.locator('app-selection-lieu-vente [role="button"]');
        this.inputLieuVente                     = page.locator('input.p-dropdown-filter');//('div.p-dropdown-header div.p-dropdown-filter-container');
        this.pdropdownLieuVente                 = page.locator('p-dropdownitem');
       
        this.datagridControleTemperature        = page.locator(' div.p-datatable'); //tableau des arrivages 
        this.datagridheadControleTemperature    = page.locator(' div.p-datatable th.text-center '); // les entêtes du tableau des arrivages à vérifier
        this.dataGridDonneeTemperature          = page.locator(' div.p-datatable .p-datatable-tbody');


        this.datagridListBoxPeriodeJournee      = page.locator('#filtre-periode-journee [role="button"]');
        this.datagridListBoxStatut              = page.locator('#filtre-statut [role="button"]');

        this.datagridInputnonConformite         = page.locator('#filtre-non-conformites [role="button"]');
        this.datagridInputTauxderealisation     = page.locator('#filtre-taux-de-realisation [role="button"]');
        this.datagridInputControleur            = page.locator('#filtre-controleur [role="button"]');

        this.buttonDemarrerControle             = page.locator('.footerBar button > em.fas.fa-play');
        this.buttonReprendreControle            = page.locator('.footerBar button > em.fas.fa-forward'); 
        this.buttonVisualiserControle           = page.locator('.footerBar button > em.fas.fa-eye'); 
        this.buttonImprimerResultat             = page.locator('.footerBar button > em.fas.fa-print'); 
        this.buttonCorrigerControle             = page.locator('.footerBar button > em.fas.fa-pencil-alt');  

        this.checkBoxControleTemperature        = page.locator('tbody .p-checkbox .p-checkbox-box');//(' tr:nth-child(1) > td:nth-child(1) p-tablecheckbox > div'); //checkbox  masquer les contrôles

        this.ButtonAnnuler                      = page.locator('.p-dialog-footer button.p-button-text');

        //-- POPIN : CONTROLE EN COURS --------------------------------------------------------------------------------------//

        this.pPCecPopinControleEnCours            = page.locator('.p-dialog-content');
        this.pPCecOngletchambreFroide             = page.locator('li.ng-star-inserted a.p-tabview-nav-link').nth(1);
        this.pPCecInputControleur                 = page.locator('app-info-controle-temperature #input-controleur');   
        this.pPCecInputControlDegre               = page.locator('app-intervalle input[type="number"]'); 
        this.pPCecInputControlDiv                 = page.locator('div.mobilier input'); 
        this.pPCecInputControlDegreChambreFroide  = page.locator('app-intervalle input:NOT(.ng-untouched)'); 
        
        this.pPCecButtonCorrigerControle          = page.locator('app-footer-controle-temperature > .ng-star-inserted');
        this.pPCecButtonEnregistrer               = page.locator('p-footer > app-footer-controle-temperature > button:nth-child(1)');  
        this.pPCecButtonTerminer                  = page.locator('p-footer > app-footer-controle-temperature > button:nth-child(2)');  
        this.pPCecButtonAnnuler                   = page.locator('p-footer > app-footer-controle-temperature .p-button-text');
        this.pPCecButtonFermer                    = page.locator('.p-button-text');
        
    }

    /**
     * 
     * @param sLieuDeVente lieu de vente à selectionner;
     */

    public async selectLieuDeVenteByName(sLieuDeVente:string) {
        await this.fonction.clickElement(this.listBoxLieudeVente);
        await this.fonction.sendKeys(this.inputLieuVente, sLieuDeVente, false, 'Lieu De Vente');
        await this.fonction.clickElement(this.pdropdownLieuVente.nth(0));
    }

}

