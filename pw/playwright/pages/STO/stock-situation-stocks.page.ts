/**
 * Appli    : STOCK
 * Menu     : STOCK
 * Onglet   : SITUATION DE STOCK
 * 
 * author JOSIAS SIE
 * 
 * @version 3.1
 * 
 */

import { Page }          from "@playwright/test";

export class StockSituationStocks{
    //-----------------------------------------------------------------------------------------------------------------------
    public readonly buttonRechercher          = this.page.locator('button em.icon-search');
    public readonly buttonRefuserColis        = this.page.locator('[ng-click="openPopupRefuserStock(dg.selection[0])"]') 
  
    public readonly inputNumPalette           = this.page.locator('sigale-input input').nth(1);   
    public readonly inputNumLotFournisseur    = this.page.locator('sigale-input input').nth(3);   
    public readonly inputNumLot               = this.page.locator('sigale-input input').nth(5);   
    public readonly inputArticle              = this.page.locator('sigale-input input').nth(0);
    public readonly inputEmplacement          = this.page.locator('sigale-input input').nth(2);
    public readonly inputFournisseur          = this.page.locator('sigale-input input').nth(4);
  
    public readonly dataGridStockLine         = this.page.locator('div[ng-controller="SituationStockControleur"] tr');

    public readonly spinnerOn                 = this.page.locator('div.progressRingCentre:not(.ng-hide)');
  
    //------------------Popin: Refuser un colis ----------------------------------------------------------------------------------------
  
    
    public readonly pButtonRefuser                  = this.page.locator('.bouton-refuser button')
    
    public readonly pInputRefuserColis              = this.page.locator('.colonne-colisRefuses input')
    
    public readonly pColonneColisEnStock            = this.page.locator('.colonne-colisCourants span')
    public readonly pListBotifMotifDeRefus          = this.page.locator('.colonne-motifRefus > p-dropdown .p-dropdown-trigger-icon')
    public readonly pListBotifMotifDeRefusItem      = this.page.locator('.p-dropdown-items p-dropdownitem')
  
    public readonly pTextAreaSaisieCommentaireRefus = this.page.locator('.section textarea')
  
    public readonly pPopupRefuserColis              = this.page.locator('.p-dialog-mask .popup-refuser-stock')

    //----------------------------------------------------------------------------------------------------------------  
    constructor(public readonly page: Page) {}  
  }
  