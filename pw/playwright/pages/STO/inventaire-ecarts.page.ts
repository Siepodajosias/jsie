/**
 * Appli    : STOCK
 * Menu     : STOCK
 * Onglet   : ANALYSE DES ECARTS
 * 
 * author JOSIAS SIE
 * 
 * @version 3.1
 * 
 */

import { Page } from "@playwright/test"

export class InventaireEcarts{

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonImprimerEcarts                = this.page.locator('[ng-click="imprimerEcarts()"]');
    public readonly buttonJustifierSelection            = this.page.locator('[ng-click="justifierEcarts(dg.selection)"]');    

    public readonly inputFiltreArticlePalette           = this.page.locator('input.filter-input');

    public readonly checkBoxArticle                     = this.page.locator('#filter-article');
    public readonly checkBoxPalette                     = this.page.locator('#filter-palettes');
    public readonly checkBoxTousselection               = this.page.locator('.liste-ecarts div.datagrid-table-wrapper > table > thead > tr > th > input');
    public readonly checkBoxtr                          = this.page.locator('.liste-ecarts div.datagrid-table-wrapper > table > tbody > tr > td > input');

    public readonly listBoxZone                         = this.page.locator('#filtre-zone');
    public readonly listBoxJustification                = this.page.locator('#motif_');

    public readonly textAreaCommentaire                 = this.page.locator('textarea.commentaire-ecart');
    public readonly motifJustification                  = this.page.locator('#motif_')

    public readonly dataGridEcartsLignes                = this.page.locator('.liste-ecarts div.datagrid-table-wrapper > table > tbody > tr td.datagrid-article-designation');
    public readonly dataGridEcartsLignesCode            = this.page.locator('.liste-ecarts div.datagrid-table-wrapper > table > tbody > tr td.datagrid-article-code');
    public readonly dataGridEcartsLignesQtethrique      = this.page.locator('.liste-ecarts div.datagrid-table-wrapper > table > tbody > tr td.datagrid-quantitePrevue')
    public readonly dataGridEcartsLignesEcart           = this.page.locator('.liste-ecarts div.datagrid-table-wrapper > table > tbody > tr td.datagrid-ecart');
    public readonly dataGridEcarts                      = this.page.locator('.liste-ecarts div.datagrid-table-wrapper > table > thead > tr > th');

    //----------------------------------------------------------------------------------------------------------------    

    constructor(public readonly page: Page) {} 
}
