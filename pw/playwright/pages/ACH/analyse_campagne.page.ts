/**
 * Appli    : ACHATS
 * Menu     : ANALYSE
 * Onglet   : CAMPAGNE
 * 
 * 
 * @author JC CALVIERA
 * @version 3.2
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageAnaCmp {

    public readonly datePickerSearchCampagne        : Locator;   //(by.css('#formRechercheCampagne .datepicker-wrapper input');

    public readonly inputSearchFournisseur          : Locator;   //(by.id('recherche-campagne-fournisseur');
    public readonly inputSearchArticle              : Locator;   //(by.id('recherche-campagne-article');
    public readonly inputSearchAcheteur             : Locator;   //(by.id('recherche-campagne-acheteur');

    public readonly checkBoxListeCampagnes          : Locator;   //.all(by.css('.liste-campagnes td input');

    public readonly buttonSearchRechercher          : Locator;   //(by.css('[ng-click="rechercherCampagnes()"]');
    public readonly buttonCreer                     : Locator;   //(by.css('[ng-click="ouvrirPopupSaisieCampagne()"]');
    public readonly buttonVisualiser                : Locator;   //(by.css('[ng-click="ouvrirPopupVisualiserCampagne(dgCampagnes.selection[0])"]');
    public readonly buttonModifier                  : Locator;   //(by.css('[ng-click="ouvrirPopupSaisieCampagne(dgCampagnes.selection[0])"]');
    public readonly buttonCopier                    : Locator;   //(by.css('[ng-click="ouvrirPopupCopierCampagne(dgCampagnes.selection[0])"]');
    public readonly buttonBilanCampagne             : Locator;   //(by.css('[ng-click="ouvrirPopupBilanCampagne(dgCampagnes.selections[0])"]');
    public readonly buttonTelechargerBilan          : Locator;   //(by.css('[ng-click="telechargerBilan(dgCampagnes.selections[0])"]');

    public readonly dataGridCampagnes               : Locator;   //.all(by.css('.liste-campagnes datagrid.scrollable.ng-isolate-scope:NOT(.lignes-campagne) th'); 

    public readonly thHeaderStatut                  : Locator;   //(by.css('[data-attribut="statut"]');

    public readonly tdNomCampagne                   : Locator;

    //-- Popin : Ajout d'une campagne -------------------------------------------------------------------------------
    public readonly pPajoutCpgneInputNomCampagne    : Locator;   //(by.css('#form-saisie-campagne #campagne-nom');
    public readonly pPajoutCpgneInputFournisseur    : Locator;   //(by.css('#form-saisie-campagne #campagne-fournisseur');
    public readonly pPajoutCpgneInputArticle        : Locator;   //(by.id('nouvelle-ligne-article');
    public readonly pPajoutCpgneInputQuantite       : Locator;   //(by.id('quantite');
    public readonly pPajoutCpgneInputPrix           : Locator;   //(by.id('prixAchat');
    public readonly pPajoutCpgneInputMontantTotal   : Locator;   //(by.id('montantTotal');

    public readonly pPajoutCpgneAutoComplete        : Locator;   //.all(by.css('.gfit-autocomplete-results li');

    public readonly pPajoutCpgneDatePickerDebut     : Locator;   //(by.id('datepicker-date-debut');
    public readonly pPajoutCpgneDatePickerFin       : Locator;   //(by.id('datepicker-date-fin');
    public readonly pPajoutCpgneDatePickerDays      : Locator;   //.all(by.css('td.day');

    public readonly pPajoutCpgneListBoxUnite        : Locator;   //(by.id('nouvelle-ligne-unite-achat');

    public readonly pPajoutCpgneDataGridArticles    : Locator;   //.all(by.css('.lignes-campagne th');

    public readonly pPajoutCpgneButtonEnregistrer   : Locator;   //(by.css('#form-saisie-campagne .modal-footer button:NOT(.ng-hide)');
    public readonly pPajoutCpgneButtonAjouter       : Locator;   //(by.css('[ng-click="ajouterArticle()"]');

    public readonly pPajoutCpgneLinkNon             : Locator;   //(by.css('#form-saisie-campagne .modal-footer a');  

    public readonly pPajoutCpgneMessageErreur       : Locator;

    //-- Popin : Détails d'une campagne -------------------------------------------------------------------------------
    public readonly pPdetailCpgneLinkAnnuler        : Locator;   //(by.css('#form-saisie-campagne .modal-footer a');

    //-- Popin : Copie de la campagne xxxxxx --------------------------------------------------------------------------    
    public readonly pPcopieCpgneInputNomCampagne    : Locator;   //(by.css('#form-copier-campagne input.ng-valid-required');

    public readonly pPcopieCpgneDatePickerDebut     : Locator;   //.all(by.css('#form-copier-campagne .date-saisie-campagne input').nth(0);
    public readonly pPcopieCpgneDatePickerFin       : Locator;   //.all(by.css('#form-copier-campagne .date-saisie-campagne input').nth(1);

    public readonly pPcopieLabelNomCampagne         : Locator;   //(by.css('#form-copier-campagne h2');

    public readonly pPcopieButtonCopier             : Locator;   //(by.css('#form-copier-campagne .modal-footer button:NOT(.ng-hide)');

    //-- Popin : Bilan de la campagne ---------------------------------------------------------------------------------
    public readonly pPbilanTextAreaSuiviXXX         : Locator;   //(by.css('#popover-commentaire.ng-touched');

    public readonly pPbilanPictoSuiviVolume         : Locator;   //.all(by.css('.commentaire-quantite span');
    public readonly pPbilanPictoSuiviPrix           : Locator;   //.all(by.css('.commentaire-prix span');
    public readonly pPbilanPictoSuiviCA             : Locator;   //.all(by.css('.commentaire-ca span');

    public readonly pPBilanCpgneLinkFermer          : Locator;   //(by.css('#form-campagne-bilan .modal-footer a');     

    //---------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {
    
        this.page = page;

        this.datePickerSearchCampagne       = page.locator('#formRechercheCampagne .datepicker-wrapper input');

        this.inputSearchFournisseur         = page.locator('#recherche-campagne-fournisseur');
        this.inputSearchArticle             = page.locator('#recherche-campagne-article');
        this.inputSearchAcheteur            = page.locator('#recherche-campagne-acheteur');
    
        this.checkBoxListeCampagnes         = page.locator('.liste-campagnes td input');
    
        this.buttonSearchRechercher         = page.locator('[ng-click="rechercherCampagnes()"]');
        this.buttonCreer                    = page.locator('[ng-click="ouvrirPopupSaisieCampagne()"]');
        this.buttonVisualiser               = page.locator('[ng-click="ouvrirPopupVisualiserCampagne(dgCampagnes.selection[0])"]');
        this.buttonModifier                 = page.locator('[ng-click="ouvrirPopupSaisieCampagne(dgCampagnes.selection[0])"]');
        this.buttonCopier                   = page.locator('[ng-click="ouvrirPopupCopierCampagne(dgCampagnes.selection[0])"]');
        this.buttonBilanCampagne            = page.locator('[ng-click="ouvrirPopupBilanCampagne(dgCampagnes.selections[0])"]');
        this.buttonTelechargerBilan         = page.locator('[ng-click="telechargerBilan(dgCampagnes.selections[0])"]');
    
        this.dataGridCampagnes              = page.locator('.liste-campagnes datagrid.scrollable.ng-isolate-scope:NOT(.lignes-campagne) th'); 
    
        this.thHeaderStatut                 = page.locator('[data-attribut="statut"]');

        this.tdNomCampagne                  = page.locator('td.datagrid-nom');
    
        //-- Popin : Ajout d'une campagne -------------------------------------------------------------------------------
        this.pPajoutCpgneInputNomCampagne   = page.locator('#form-saisie-campagne #campagne-nom');
        this.pPajoutCpgneInputFournisseur   = page.locator('#form-saisie-campagne #campagne-fournisseur');
        this.pPajoutCpgneInputArticle       = page.locator('#nouvelle-ligne-article');
        this.pPajoutCpgneInputQuantite      = page.locator('#quantite');
        this.pPajoutCpgneInputPrix          = page.locator('#prixAchat');
        this.pPajoutCpgneInputMontantTotal  = page.locator('#montantTotal');
    
        this.pPajoutCpgneAutoComplete       = page.locator('.gfit-autocomplete-results li');
    
        this.pPajoutCpgneDatePickerDebut    = page.locator('#datepicker-date-debut i.icon-calendar');
        this.pPajoutCpgneDatePickerFin      = page.locator('#datepicker-date-fin i.icon-calendar');
        this.pPajoutCpgneDatePickerDays     = page.locator('td.day');
    
        this.pPajoutCpgneListBoxUnite       = page.locator('#nouvelle-ligne-unite-achat');
    
        this.pPajoutCpgneDataGridArticles   = page.locator('.lignes-campagne th');
    
        this.pPajoutCpgneMessageErreur      = page.locator('div.feedback-error:NOT(.ng-hide)');

        this.pPajoutCpgneButtonEnregistrer  = page.locator('#form-saisie-campagne .modal-footer button:NOT(.ng-hide)');
        this.pPajoutCpgneButtonAjouter      = page.locator('[ng-click="ajouterArticle()"]');
    
        this.pPajoutCpgneLinkNon            = page.locator('#form-saisie-campagne .modal-footer a');  
    
        //-- Popin : Détails d'une campagne -------------------------------------------------------------------------------
        this.pPdetailCpgneLinkAnnuler       = page.locator('#form-saisie-campagne .modal-footer a');
    
        //-- Popin : Copie de la campagne xxxxxx --------------------------------------------------------------------------    
        this.pPcopieCpgneInputNomCampagne   = page.locator('#form-copier-campagne input.ng-valid-required');
    
        this.pPcopieCpgneDatePickerDebut    = page.locator('#datepicker-start-date i.icon-calendar');
        this.pPcopieCpgneDatePickerFin      = page.locator('#datepicker-end-date i.icon-calendar');
    
        this.pPcopieLabelNomCampagne        = page.locator('#form-copier-campagne h2');
    
        this.pPcopieButtonCopier            = page.locator('#form-copier-campagne .modal-footer button:NOT(.ng-hide)');
    
        //-- Popin : Bilan de la campagne ---------------------------------------------------------------------------------
        this.pPbilanTextAreaSuiviXXX        = page.locator('#popover-commentaire.ng-touched');
    
        this.pPbilanPictoSuiviVolume        = page.locator('.commentaire-quantite span');
        this.pPbilanPictoSuiviPrix          = page.locator('.commentaire-prix span');
        this.pPbilanPictoSuiviCA            = page.locator('.commentaire-ca span');
    
        this.pPBilanCpgneLinkFermer         = page.locator('#form-campagne-bilan .modal-footer a');     

    }

}