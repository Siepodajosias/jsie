/**
 * Appli    : MAGASIN 
 * Page     : STOCK
 * onglet   : LIVRAISONS
 * 
 * @author JOSIAS SIE
 * @version 3.1
 * 
 */

import { Page } from '@playwright/test';

export class StockLivraison {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonImprimerBl           = this.page.locator('div.form-btn-section button i.fa-print');   
    public readonly buttonImprimerEcarts       = this.page.locator('button i.fa-list-alt');   
    public readonly buttonEnregistrer          = this.page.locator('button i.fa-hdd');   
    public readonly buttonEnregistrerEnvoyer   = this.page.locator('button i.fa-paper-plane');   
    public readonly buttonFiltreGpeArticle     = this.page.locator('.p-multiselect-trigger-icon').nth(0);
    public readonly buttonDatePickNextMonth    = this.page.locator('.p-datepicker-next-icon'); 
    public readonly buttonDatePickAffich       = this.page.locator('.p-element.p-ripple.p-datepicker-trigger.p-button-icon-only');     
    public readonly labelDernierEnvoi          = this.page.locator('.form-btn-section .ng-star-inserted').nth(6);                                      

    public readonly datePickerLivraison        = this.page.locator('p-calendar[name="dateCommande"]');
    public readonly datePickerCurrentDate      = this.page.locator('table.p-datepicker-calendar td.p-datepicker-today');
    public readonly datePickerDay              = this.page.locator('table.p-datepicker-calendar td a.ui-state-default');
    public readonly datePickerDays             = this.page.locator('table.p-datepicker-calendar td:NOT(.p-datepicker-other-month)');
    public readonly datePickerJourActifs       = this.page.locator('table.p-datepicker-calendar td');
    public readonly checkBoxLivraisons         = this.page.locator('.tableau-bon-livraison td > input');
    public readonly dataGridStatutBL1st        = this.page.locator('.p-datatable-tbody .p-selectable-row >td:nth-child(6)');
    public readonly dataGridCrEffBL1st         = this.page.locator('.p-datatable-tbody .p-selectable-row .fa-check').nth(0);
    public readonly dataGridTypelivraison      = this.page.locator('.p-datatable-tbody .p-selectable-row >td:nth-child(4)');
    public readonly dataGridGroupeArticle      = this.page.locator('.p-datatable-tbody .p-selectable-row >td:nth-child(1)');

    public readonly dataGridListesLivraisons   = this.page.locator('p-table#bonLivraisonDg thead tr:nth-child(1) th');
    public readonly dataGridListeBL            = this.page.locator('.p-datatable-tbody tr.p-selectable-row');
    
    public readonly dgArticleFiltreArticle     = this.page.locator('.p-treetable-thead >tr th.ng-star-inserted >input');
    public readonly dgArticleQteReelle         = this.page.locator('[formcontrolname="quantiteReelle"]');
    public readonly dgArticleColonne           = this.page.locator('.ligne-classique >td >span');

    public readonly buttonAjoutTransport       = this.page.locator('.btn-add-livraison');
    public readonly inputTransporteur          = this.page.locator('#transporteur  input[autocomplete]').nth(0);
    public readonly inputTransportHeures       = this.page.locator('[formcontrolname="heures"]');
    public readonly inputFiltrGroupeArticle    = this.page.locator('.p-multiselect-filter-container input');
    public readonly inputTransportMinutes      = this.page.locator('[formcontrolname="minutes"]');
    public readonly lisBoxFltreGrpeIcon        = this.page.locator('.p-multiselect-close-icon');
    public readonly lisBoxFltreGrpeArtItem     = this.page.locator('p-multiselectitem span:NOT(.p-checkbox-icon)');
    public readonly lisBoxFltreGrpeArt         = this.page.locator('.p-multiselect-filter');
    public readonly labelTransportIncidents    = this.page.locator('.checkbox-incidents .p-checkbox-label');
    public readonly multiselectitem            = this.page.locator('')
    public readonly checkBoxTransportIncidents = this.page.locator('.checkbox-incidents .p-checkbox-box');
    public readonly checkBoxTransportCheck     = this.page.locator('.checkbox-incidents .p-checkbox-box .pi-check');

    public readonly buttonAjoutArticle         = this.page.locator('#btn-ajout-article'); 
    public readonly inputAjoutArticle          = this.page.locator('.autocomplete-ajout-article .input input.form-control');

    //----------------- Popin ajouter un article au bon de livraison
    public readonly pPInputConditionnement     = this.page.locator('#conditionnement'); 
    public readonly pPInputQuantite            = this.page.locator('#input-quantite'); 
    public readonly pPButtonAjouter            = this.page.locator('.p-dialog-footer .p-button');

    public readonly pPDatePickerDLCFrnisseur   = this.page.locator('#formAjoutArticle button.p-datepicker-trigger');
    public readonly pPDatePickerDLCDay         = this.page.locator('.p-datepicker-calendar tbody td:NOT(.p-datepicker-other-month)');

    //------------------- Popin Implantation de l'article

    public readonly  pPButtonImplationArticle  = this.page.locator('.col-actions button[title="Définir implantation"]');
    public readonly pPButtonEnregistrer        = this.page.locator('p-footer button');

    public readonly   pPListBoxZone            = this.page.locator('#zoneImplantation');

    public readonly pPRadioPosition            = this.page.locator('.form-check-label');

    public readonly pPDatagridArticleRow       = this.page.locator('.articles-zone-selectionnee tbody tr');
    
    //------------------------------------------------------------------------------
    public readonly  listBoxGroupeArticle      = this.page.locator('#groupeArticle');


    constructor(public readonly page: Page) {}
    
}