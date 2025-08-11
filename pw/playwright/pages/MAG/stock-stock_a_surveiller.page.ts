/**
 * Appli    : MAGASIN
 * Page     : STOCK
 * Onglet   : Stock à surveiller
 * 
 * @author  JOSIAS SIE
 * @version 3.4
 * 
 */
import { Page} from '@playwright/test';

export class StockStockASurveiller {

    //----------------------------------------------------------------------------------------------------------------    

    public readonly buttonMouvementsStock      = this.page.locator('div.form-btn-section button i.fa-list');
    public readonly buttonImprimerDlcAControler= this.page.locator('div.form-btn-section button').nth(1);
    
    public readonly inputFiltreCodeArticle     = this.page.locator('th input.filter-style').nth(0);
    public readonly inputFiltreLibelleArticle  = this.page.locator('th input.filter-style').nth(1);

    public readonly listBoxTypeComportement    = this.page.locator('#input-groupe');

    public readonly dataGridAnomalies          = this.page.locator('#listeArticlesStockRenseigne thead tr:nth-child(1) th');

    public readonly checkBoxListeAnomalies     =this.page.locator('.p-selectable-row  div.spinner-checkbox');

    public readonly tdListeDesignations        = this.page.locator('#listeArticlesStockRenseigne table tbody tr td:nth-child(5)');

    // public readonly linkVentesSansStock        = this.page.locator('div[aria-label="Ventes sans stock"]'); 
    // public readonly linkDlcCourteManquante     = this.page.locator('div[aria-label="DLC courte manquante"]');
    // public readonly linkStockImportant         = this.page.locator('div[aria-label="Stock important"]');
    // public readonly linkStockNegatif           = this.page.locator('div[aria-label="Stock négatif"]');
    public readonly linkVentesSansStock        = this.page.locator('stock-a-surveiller-wrapper p-selectbutton span.p-button-label').nth(0); 
    public readonly linkDlcCourteManquante     = this.page.locator('stock-a-surveiller-wrapper p-selectbutton span.p-button-label').nth(1);
    public readonly linkStockImportant         = this.page.locator('stock-a-surveiller-wrapper p-selectbutton span.p-button-label').nth(2);
    public readonly linkStockNegatif           = this.page.locator('stock-a-surveiller-wrapper p-selectbutton span.p-button-label').nth(3);

    public readonly spinnerLoadingDatas        = this.page.locator('div.ui-table-loading');
    public readonly spinner                    = this.page.locator('i.app-spinner');

    //--Popin : Visualisation des mouvements de stock ----------------------------------------------------------------
    public readonly pPlistBoxConditionnementMvt= this.page.locator('div.visualiser-mouvements-stock-modal select'); 

    public readonly pPLinkFermerMvt            = this.page.locator('div.p-dialog-footer p-footer a');

    public readonly pPDataGridMvt              = this.page.locator('div.visualiser-mouvements-stock-modal tr:nth-child(1) th');

    public readonly pPtdDateMvt                = this.page.locator('td.datagrid-date');

    public readonly pPbuttonDeplierMvt         = this.page.locator('div.boutons-deplier-replier button.bouton-deplier');
    public readonly pPbuttonReplierMvt         = this.page.locator('div.boutons-deplier-replier button:NOT(.bouton-deplier)');

    //--Popin : IMPRIMER LES DLC A CONTROLER ------------------------------------------------------------------------
    public readonly pPimprimerDlcDatePicker    = this.page.locator('span.imprimer-dlc-controler p-calendar input');
    
    public readonly pPimprimerDlcListBoxZones  = this.page.locator('span.imprimer-dlc-controler p-multiselect');

    public readonly pPimprimerDlcButtonImprimer= this.page.locator('div.p-dialog-footer button');

    public readonly pPimprimerDlclinkAnnuler   = this.page.locator('div.p-dialog-footer a');

      listBoxGroupeArticle       = this.page.locator('#groupeArticle');

    constructor(public readonly page: Page) {}
}