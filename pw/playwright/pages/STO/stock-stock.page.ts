/**
 * Appli    : STOCK
 * Page     : STOCK
 * Onglet   : SITUATION DE STOCK
 * 
 * author JOSIAS SIE
 * 
 * @version 3.3
 * 
 */

import { Page }          from "@playwright/test";

export class StockStock{
    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonAfficherMvt           = this.page.locator('[ng-click="openPopupHistoriqueMouvementsLot(dg.selection[0])"]');
    public readonly buttonModifierStock         = this.page.locator('[ng-click="modifierStockLot(dg.selection[0])"]');
    public readonly buttonRefuser               = this.page.locator('[ng-click="openPopupRefuserStock(dg.selection[0])"]');
    public readonly buttonImprimerEtiquette     = this.page.locator('[ng-click="openPopupImpression(dg.selection[0])"]');
    public readonly buttonModifPlateformeDistri = this.page.locator('[ng-click="openPopupTransfertLot(dg.selection[0])"]');
    public readonly buttonRechercher            = this.page.locator('button span.pi-search');

    public readonly inputNumPalette             = this.page.locator('sigale-input input').nth(1);   
    public readonly inputNumLotFournisseur      = this.page.locator('sigale-input input').nth(3);   
    public readonly inputNumLot                 = this.page.locator('sigale-input input').nth(5);   
    public readonly inputArticle                = this.page.locator('sigale-input input').nth(0);
    public readonly inputEmplacement            = this.page.locator('sigale-input input').nth(2);
    public readonly inputFournisseur            = this.page.locator('sigale-input input').nth(4);

    public readonly multiSelectRayon            = this.page.locator('p-multiselect[innerstyleclass="rayon-multiselect"]');

    public readonly checkBoxListeLots           = this.page.locator('datagrid td input');

    public readonly labelAllNumLots             = this.page.locator('td.datagrid-numeroLotCourt span');

    public readonly datePickerDLC               = this.page.locator('filtre-recherche-situation-stock-wrapper p-calendar input');

    public readonly dataGridStock               = this.page.locator('datagrid[defaultsorter="numeroLotCourt"] thead th');     
    public readonly dataGridDonneesStock        = this.page.locator('datagrid:nth-child(2) th');

    public readonly checkBoxSituationStock      = this.page.locator('div.datagrid-table-wrapper > table').nth(0).locator('tbody > tr > td');

    public readonly spinnerOn                   = this.page.locator('div.progressRingCentre:not(.ng-hide)');
    public readonly spinnerOff                  = this.page.locator('div.progressRingCentre.ng-hide');

    //-- Popin : Historique des mouvements du lot XXXX ---------------------------------------------------------------
    public readonly pButtonFermer              = this.page.locator('button.p-button-link span');

    public readonly pDataGridHistoriqueMvt     = this.page.locator('table > thead > tr.first-line > th');

    //-- Popin : Saisie du stock -------------------------------------------------------------------------------------
    public readonly pButtonSaisieSauvegarder   = this.page.locator('div.modal.hide.in > div.modal-footer > button').nth(0);  
    public readonly pButtonSaisieAnnuler       = this.page.locator('div.modal.hide.in > div.modal-footer > a');  

    public readonly pInputSaisiePaletteFiltre  = this.page.locator('input[ng-model="palette.emplacementFiltre"]');
    public readonly pInputSaisieEmplacement    = this.page.locator('input[ng-model="emplacementGlobal.filtre"]');
    public readonly pInputSaisieColisComptes   = this.page.locator('input[ng-model="palette.colisCourants"]');    

    public readonly pCheckBoxEnvoiDirect       = this.page.locator('#envoi-direct-id');
    public readonly pLabelNumeroPalette        = this.page.locator('td.saisie-lot-colonne-numero')

    public readonly pListBoxTypeTiers          = this.page.locator('select[ng-model="situationStock.typeTiers"]');
    public readonly pListBoxTiers              = this.page.locator('select[ng-model="situationStock.tiers"]');
    public readonly pListBoxMotif              = this.page.locator('select[ng-model="situationStock.motif"]');

    public readonly pAutocompleteSaisieEmp     = this.page.locator('li.gfit-autocomplete-result');

    public readonly pTextAreaSaisieCommentaire = this.page.locator('#commentaire');

    public readonly pDataGridEtatStock         = this.page.locator('.lot-palettes > table > thead > tr > th');    

    //-- Popin : Impression des étiquettes --------------------------------------------------------------------------    
    public readonly pButtonImprimerEtiquettes  = this.page.locator('div.modal.hide.in > div.modal-footer > button').nth(0);
    public readonly pButtonAnnulerEtiquettes   = this.page.locator('div.modal.hide.in > div.modal-footer > a');   
    //public readonly pButtonAppliquerATous      = this.page.locator('[ng-click="applyAll(nbImpressions);"]');

    public readonly pListBoxImprimante         = this.page.locator('select[ng-model="model.imprimante"]');

    //public readonly pInputNbrImpressions       = this.page.locator('nbImpressions');

    //-- Popin : Modification de la plateforme de distribution du lot XXXX ------------------------------------------    
    public readonly pButtonPlateformeModifier  = this.page.locator('div.modal.hide.in > div.modal-footer > button').nth(0);  
    public readonly pButtonPlateformeAnnuler   = this.page.locator('div.modal.hide.in > div.modal-footer > a');    

    public readonly pListBoxChoixPalteforme    = this.page.locator('select[ng-model="choix.plateforme"]');
    public readonly pListBoxChoixImprimante    = this.page.locator('select[ng-model="choix.imprimante"]');

    public readonly pInputNbrImpressionsPltfrm = this.page.locator('input[ng-model="choix.nombreEtiquettes"]');    

    public readonly pDataGridPalettesDuLot     = this.page.locator('.table-transfert table > thead > tr > th'); 

    //----------------------------------------------------------------------------------------------------------------    

    constructor(public readonly page: Page) {} 
}