/**
 * Appli    : STOCK
 * Page     : STOCK
 * Onglet   : SITUATION DES PALETTES
 * 
 * author JOSIAS SIE & ABDOUL SARBA
 * 
 * @version 3.0
 * 
 */


import { Page }          from "@playwright/test";
import { TestFunctions } from '@helpers/functions.js';

export class StockSituationDeStocks {

    public fonction = new TestFunctions();

    //-----------------------------------------------------------------------------------------------------------------------
    public readonly buttonRechercher            = this.page.locator('p-button .p-ripple.p-element.p-button.p-component');
    public readonly buttonRefuserColis          = this.page.locator('[ng-click="openPopupRefuserStock(dg.selection[0])"]') 
  
    public readonly inputNumPalette             = this.page.locator('sigale-input input').nth(1);   
    public readonly inputNumLotFournisseur      = this.page.locator('sigale-input input').nth(3);   
    public readonly inputNumLot                 = this.page.locator('sigale-input input').nth(5);   
    public readonly inputArticle                = this.page.locator('sigale-input input').nth(0);
    public readonly inputEmplacement            = this.page.locator('sigale-input input').nth(2);
    public readonly inputFournisseur            = this.page.locator('sigale-input input').nth(4);
  
    public readonly dataGridStockLine           = this.page.locator('div[ng-controller="SituationStockControleur"]  tbody tr')
    public readonly dataGridColumnNumeroLot     = this.page.locator('div[ng-controller="SituationStockControleur"] td[data-field="numeroLotCourt"] span')
    public readonly dataGridColumnFournisseur   = this.page.locator('td.datagrid-fournisseur-designation');
    public readonly dataGridColumnCodeArticle   = this.page.locator('div[ng-controller="SituationStockControleur"] td[data-field="article.code"] span')

    public readonly multiSelectRayon            = this.page.locator('.p-element.p-multiselect-label-container');
    public readonly multiSelectItemRayon        = this.page.locator('p-multiselectitem ');

    public readonly spinnerOn                   = this.page.locator('div.progressRingCentre:not(.ng-hide)');
    public readonly spinnerOff                  = this.page.locator('div.progressRingCentre.ng-hide');

    //------------------Popin: Refuser un colis ----------------------------------------------------------------------------------------
  
    public readonly pButtonRefuser              = this.page.locator('.bouton-refuser button')
    
    public readonly pColumnColisEnStock         = this.page.locator('.colonne-colisCourants span')
    public readonly pInputRefuserColis          = this.page.locator('.colonne-colisRefuses input')
    
    public readonly pListBoxtifMotifDeRefus     = this.page.locator('.colonne-motifRefus > p-dropdown .p-dropdown-trigger-icon')
    public readonly pListBoxtifMotifDeRefusItem = this.page.locator('.p-dropdown-items p-dropdownitem')
  
    public readonly pTextAreaSaisieCommentaireRefus = this.page.locator('.section textarea.p-inputtextarea')
  
    public readonly pPopupRefuserColis          = this.page.locator('.p-dialog-mask .popup-refuser-stock')
    public readonly pMultiselectCloseIcon       = this.page.locator('timesicon > .p-multiselect-close-icon')

    constructor(public readonly page: Page) {} 

    /**
     * 
     * Sélectionne le rayon (Liste déroulante située sur l'onglet Situation de stock (page stock))
     * 
     * @param cible 
     * @param page 
     */
    public async selectRayon(cible:string, page:Page){
      await this.fonction.clickElement(this.multiSelectRayon);
      await this.fonction.clickElement(this.multiSelectItemRayon.filter({hasText:cible}));
      await this.fonction.waitTillHTMLRendered(page, 30000, false);
    }
  }
  