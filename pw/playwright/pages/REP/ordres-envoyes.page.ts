/**
 * 
 * APPLI    : REPARTITION 
 * PAGE     : ORDRES REPARTITION 
 * ONGLET   : ENVOYES
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class OrdRepEnvoyesPage {

    //--------------------------------------------------------------------------------------------------------------

    public readonly inputFiltre                  : Locator;   //.locator('.filter-input.filter-wrapper');

    public readonly checkboxOrdre                : Locator;   //.locator('#checkbox-ordre');
    public readonly checkBoxLot                  : Locator;   //.locator('#checkbox-lot');
    public readonly checkboxArticle              : Locator;   //.locator('#checkbox-article');
    public readonly checkboxFournisseur          : Locator;   //.locator('#checkbox-fournisseur');

    public readonly textLegend                   : Locator;   //.locator('.legende-ordres');

    public readonly listResults                  : Locator;   //.locator('.paginator > table > tbody > tr');           // lignes de résultats
    public readonly headerList                   : Locator;   //.locator('div.datagrid-table-wrapper > table > thead > tr > th');

    public readonly datagridNumLot               : Locator;   //.locator('.datagrid-numeroLot');
    public readonly datagridNumAchat             : Locator;   //.locator('.datagrid-numeroAchat');
    public readonly datagridNumOrdre             : Locator;   //.locator('.datagrid-numeroOrdre');

    public readonly buttonEnvoyerSansFusionner   : Locator;   //.locator('[ng-click="verifierEnvoiGroupe()"]');
    public readonly buttonFusionnerEtEnvoyer     : Locator;   //.locator('[ng-click="verifierEnvoiGroupe()"]');
    public readonly buttonAnnuler                : Locator;   //.locator('[ng-click="ordresAnnules = ordresSelectionnes; affecterMessageConfirmation(ordresAnnules); popupAnnulation = true;"]');

    //--------------------------------------------------------------------------------------------------------------

    constructor(page:Page){

        this.inputFiltre                 = page.locator('.filter-input.filter-wrapper');

        this.checkboxOrdre               = page.locator('#checkbox-ordre');
        this.checkBoxLot                 = page.locator('#checkbox-lot');
        this.checkboxArticle             = page.locator('#checkbox-article');
        this.checkboxFournisseur         = page.locator('#checkbox-fournisseur');

        this.textLegend                  = page.locator('.legende-ordres');

        this.listResults                 = page.locator('.paginator > table > tbody > tr');           // lignes de résultats
        this.headerList                  = page.locator('div.datagrid-table-wrapper > table > thead > tr > th');

        this.datagridNumLot              = page.locator('.datagrid-numeroLot');
        this.datagridNumAchat            = page.locator('.datagrid-numeroAchat');
        this.datagridNumOrdre            = page.locator('.datagrid-numeroOrdre');

        this.buttonEnvoyerSansFusionner  = page.locator('[ng-click="verifierEnvoiGroupe()"]');
        this.buttonFusionnerEtEnvoyer    = page.locator('[ng-click="afficherPopupFusion(ordresSelectionnes)"]');
        this.buttonAnnuler               = page.locator('[ng-click="ordresAnnules = ordresSelectionnes; affecterMessageConfirmation(ordresAnnules); popupAnnulation = true;"]');

    }

}