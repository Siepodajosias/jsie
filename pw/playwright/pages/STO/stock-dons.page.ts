/**
 * Appli    : STOCK
 * Page     : STOCK
 * Onglet   : DONS
 * 
 * author JOSIAS SIE
 * 
 * @version 3.1
 * 
 */

import { Page }          from "@playwright/test";

export class StockDons{

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonRechercher           = this.page.locator('[ng-click="loadDons()"]');
    public readonly buttonCreerDon             = this.page.locator('[ng-click="ouvrirPopupDons()"]');
    public readonly buttonCreerRecu            = this.page.locator('[ng-click="ouvrirPopupCreationRecu()"]');
    public readonly buttonImprimerRecu         = this.page.locator('[ng-click="openPopupImpressionRecuDons()"]');
    public readonly buttonImprimerRecap        = this.page.locator('[ng-click="openPopupImpressionRecapitulatifDons()"]');
    public readonly buttonTransformerEnCasse   = this.page.locator('[ng-click="supprimerDons(dgDons.selection)"]');

    public readonly datePickerFrom             = this.page.locator('.datepicker-wrapper').nth(0);
    public readonly datePickerTo               = this.page.locator('.datepicker-wrapper').nth(1);

    public readonly checkBoxMasquerDons        = this.page.locator('#checkbox-toggle-dons');
    public readonly checkBoxListeDons          = this.page.locator('.datagrid-wrapper td input');

    public readonly listBoxDonateur            = this.page.locator('#filtre-donateur');
    public readonly listBoxBeneficiaire        = this.page.locator('#filtre-beneficiaire');
    public readonly listBoxGroupeArticle       = this.page.locator('#filtre-groupe-article');

    public readonly dataGridDons               = this.page.locator('.dons-resultats th');
    public readonly dataGridColisEnStock       = this.page.locator('th.datagrid-nbColisEnStock');
    public readonly tdListeNumeroLot           = this.page.locator('td.datagrid-numeroLot');

    public readonly toasterMessage             = this.page.locator('.toast-message'); 

    //-- Popin : Création de dons ------------------------------------------------------------------------------------ 
    public readonly pPinputArticleDon          = this.page.locator('#recherche-article');
    public readonly pPinputFournisseurDon      = this.page.locator('#recherche-fournisseur');
    public readonly pPinputNumLotDon           = this.page.locator('input[ng-model="lot.numero"]');
    public readonly pPinputPaletteDon          = this.page.locator('input[ng-model="numeroPaletteRecherche"]');        

    public readonly pPcheckBoxArticleDonable   = this.page.locator('.datagrid-palettes td input:not(.ng-valid)');

    public readonly pPdataGrid1                = this.page.locator('.block-datagrid').nth(0).locator('.datagrid-palettes th');
    public readonly pPdataGrid2                = this.page.locator('.block-datagrid').nth(1).locator('.datagrid-palettes th');    

    public readonly pPbuttonRechercherDon      = this.page.locator('[ng-click="rechercherPalettes()"]');    
    public readonly pPbuttonEnregistrerDon     = this.page.locator('.popup-creation-dons .modal-footer button');
    public readonly pPbuttonAjouterDon         = this.page.locator('[ng-click="donnerPalettes()"]');

    public readonly pPlinkAnnulerDon           = this.page.locator('.popup-creation-dons .modal-footer a');  

    public readonly pPautoCompleteDon          = this.page.locator('.gfit-autocomplete-results li');    

    public readonly pPtdNumLotDon              = this.page.locator('td.datagrid-numeroLotLong');

    //-- Popin : Création d'un reçu ----------------------------------------------------------------------------------  
    public readonly pPlistBoxBenefRecu         = this.page.locator('p-dropdown#selecteurBeneficiaire');

    public readonly pPlisteChoixBenef          = this.page.locator('p-dropdownitem li');

    public readonly pPbuttonCreerRecu          = this.page.locator('p-footer p-button button:NOT(.p-button-link)');

    //-- Popin : Imprimer un reçu ------------------------------------------------------------------------------------
    public readonly pPlistBoxDonateurImpRecu   = this.page.locator('#donateur');    
    public readonly pPlistBoxBenefImpRecu      = this.page.locator('#beneficiaire');
    
    public readonly pPbuttonImprimerRecu       = this.page.locator('.popup-impression-recu-dons .modal-footer button');

    public readonly pPlinkAnnulerImprimerRecu  = this.page.locator('.popup-impression-recu-dons .modal-footer a');

    public readonly pPDatePeackerImprimerRecu  = this.page.locator('.popup-impression-recu-dons .icon-calendar');
    public readonly pDatePeackerButtonPrev     = this.page.locator('.datepicker-days th.prev')
    public readonly pDatePeackerSwitchLabel    = this.page.locator('.datepicker-days th.datepicker-switch')
    public readonly pDatePeackerLabelDays      = this.page.locator('.datepicker-days tbody tr td:Not(.old)')

    public readonly pPmonthImprimerRecu        = this.page.locator('.datepicker-switch').nth(0);    

    public readonly pPdayImprimerRecu          = this.page.locator('td span.month');

    //-- Popin : Imprimer un recap -----------------------------------------------------------------------------------
    public readonly pPlistBoxDonateurImpRecap  = this.page.locator('#donateur');    
    public readonly pPlistBoxBenefImpRecap     = this.page.locator('#beneficiaire');
    
    public readonly pPbuttonImprimerRecap      = this.page.locator('.popup-impression-recapitulatif-dons .modal-footer button');

    public readonly pPDatePeackerImprimerRecap = this.page.locator('.popup-impression-recapitulatif-dons .icon-calendar');
    public readonly pLinkAnnulerImprimerRecap  = this.page.locator('.popup-impression-recapitulatif-dons .modal-footer a')

    public readonly pPyearImprimerRecap        = this.page.locator('.datepicker-switch').nth(1);    

    public readonly pPmonthImprimerRecap       = this.page.locator('td span.month');    

    //----------------------------------------------------------------------------------------------------------------    

    constructor(public readonly page: Page) {}  
}