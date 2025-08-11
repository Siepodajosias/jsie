/**
 * APPLI    : ACHATS
 * MENU     : Litiges
 * ONGLET   : Litiges Automatiques
 * 
 * 
 * @author JC CALVIERA
 * @version 3.3
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageLitLitAut {

    public readonly buttonGenererDAV                : Locator;   //(by.css('[ng-click="genererDemandeAvoir(selection)"]');
    public readonly buttonAbandonnerLitige          : Locator;   //(by.css('[ng-click="abandonnerLitige(selection)"]');
    public readonly buttonAnnulerAbandon            : Locator;   //(by.css('[ng-click="reprendreLitige(selection)"]');
    public readonly buttonimprimerBonReprise        : Locator;   //(by.css('[ng-click="imprimerBonReprise(selection)"]');

    public readonly datePickerFrom                  : Locator;   //(by.id('litiges-input-date-debut');
    public readonly datePickerTo                    : Locator;   //(by.id('litiges-input-date-fin');

    public readonly checkBoxToutAfficher            : Locator;   //(by.id('checkbox-toggle-afficher-tous-les-litiges');
    public readonly checkBoxListeLitiges            : Locator;   //.all(by.css('div.datagrid-table-wrapper > table > tbody > tr > td > input');

    public readonly tdNumLot                       : Locator;   //.all(by.css('td.datagrid-numeroLot');
    public readonly tdAbandon                      : Locator;
    public readonly tdNatureLitige                 : Locator;

    public readonly inputFieldLot                   : Locator;   //(by.css('input[placeholder="Lot"]');
    public readonly inputFieldArticle               : Locator;   //(by.css('input[placeholder="Article"]');
    public readonly inputFieldFournisseur           : Locator;   //(by.css('input[placeholder="Fournisseur"]');
    public readonly inputFieldPlateforme            : Locator;   //(by.css('input[placeholder="Plateforme"]');
    public readonly inputFieldNumeroBonLivraison    : Locator;   //(by.css('input[placeholder="Bon de livraison"]');

    public readonly dataGridAchatsSurPlace          : Locator;   //.all(by.css('.litiges-liste .datagrid-table-wrapper > table > thead > tr > th');

    public readonly headerAbandon                   : Locator;

    public readonly listBoxDossierAchat             : Locator;
    //----------------------------------------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {
        
        this.buttonGenererDAV               = page.locator('[ng-click="genererDemandeAvoir(selection)"]');
        this.buttonAbandonnerLitige         = page.locator('[ng-click="abandonnerLitige(selection)"]');
        this.buttonAnnulerAbandon           = page.locator('[ng-click="reprendreLitige(selection)"]');
        this.buttonimprimerBonReprise       = page.locator('[ng-click="imprimerBonReprise(selection)"]');
    
        this.datePickerFrom                 = page.locator('input#litiges-input-date-debut');
        this.datePickerTo                   = page.locator('input#litiges-input-date-fin');
    
        this.checkBoxToutAfficher           = page.locator('[ng-model="filtre.tousLesLitiges"]');
        this.checkBoxListeLitiges           = page.locator('div.datagrid-table-wrapper > table > tbody > tr > td > input');
    
        this.tdNumLot                       = page.locator('td.datagrid-numeroLot');
        this.tdAbandon                      = page.locator('[data-field="statut"] span i');
        this.tdNatureLitige                 = page.locator('td.datagrid-libelleMotifs');
    
        this.inputFieldLot                  = page.locator('input[placeholder="Lot"]');
        this.inputFieldArticle              = page.locator('input[placeholder="Article"]');
        this.inputFieldFournisseur          = page.locator('input[placeholder="Fournisseur"]');
        this.inputFieldPlateforme           = page.locator('input[placeholder="Plateforme"]');
        this.inputFieldNumeroBonLivraison   = page.locator('input[placeholder="Bon de livraison"]');
    
        this.dataGridAchatsSurPlace         = page.locator('thead th');

        this.headerAbandon                  = page.locator('th[data-attribut="statut"]');

        this.listBoxDossierAchat            = page.locator('#litiges-input-dossier-achat');
    }

}