/**
 * Appli    : MAGASIN
 * Page     : STOCK
 * Onglet   : STOCK(S) FIN DE JOURNEE
 * 
 * @author  JOSIAS SIE
 * @version 3.1
 * @since   13/09/2023
 * 
 */

import { Page,} from '@playwright/test';

export class StockStockFinJournee {

    //----------------------------------------------------------------------------------------------------------------    

    public readonly  listBoxGroupeArticle       = this.page.locator('#groupeArticle');

    public readonly  checkBoxFinJourneeNonRens  = this.page.locator('#input-filtre-stock-fin-journee');
    public readonly  checkBoxFinJourneeNonRensJV= this.page.locator('#input-filtre-stock-fin-semaine');
    public readonly  checkBoxTousArticles       = this.page.locator('#input-filtre-tout-article');

    public readonly  buttonEnregistrer          = this.page.locator('.form-btn-section button');

    public readonly  dgListeArticles            = this.page.locator('#listeArticlesStockRenseigne thead tr:nth-child(1) th');

    public readonly  trListeArticles            = this.page.locator('div.lignes-articles-stock-renseigne tr.ng-valid');

    public readonly  inputStockFinJournee       = this.page.locator('input[name="stockFinJournee"]');
    public readonly  inputStockFinJourneeObli   = this.page.locator('div.required input');
    public readonly  inputStockFinSemaine       = this.page.locator('input[name="stockFinSemaine"]');

    public readonly  spinner                    = this.page.locator('i.app-spinner');


    //----------------------------------------------------------------------------------------------------------------
    
    constructor(public readonly page: Page) {}
}