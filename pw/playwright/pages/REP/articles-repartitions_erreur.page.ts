/**
 * 
 * REPARTITION PAGE > ARTICLES / ONGLET > REPARTITIONS EN ERREUR
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class ArticleRepartitionEnErreurPage {
    //--------------------------------------------------------------------------------------------------------------
    
    public readonly dataGridHeaders   :Locator               //('.datagrid-table-wrapper > table > thead > tr > th'));      

    //--------------------------------------------------------------------------------------------------------------

    constructor(page: Page){

        this.dataGridHeaders  = page.locator('.datagrid-table-wrapper > table > thead > tr > th');
    }

}