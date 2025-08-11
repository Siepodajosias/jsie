/**
 * Appli    : MAGASIN
 * Menu     : ALERTES
 * Onglet   : INFOS QUALITE
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * @since 11/09/2023
 * 
 */
import { Page } from "@playwright/test"

export class AlertesInfosQualite {

    public readonly datePeacker              = this.page.locator('span.p-calendar button');

    public readonly dataGridListeInfos       = this.page.locator('thead.p-datatable-thead tr:nth-child(1) th');

    public readonly listBoxType              = this.page.locator('p-multiselect[name="typeRemontee"]');
    public readonly listBoxMotif             = this.page.locator('p-multiselect[name="motif"]');
    public readonly filtreCodeMagasin        = this.page.locator('thead th input[type="text"]').nth(0);


    public readonly filtreMagasin            = this.page.locator('thead th input[type="text"]').nth(1);
    public readonly filtreNumLot             = this.page.locator('thead th input[type="text"]').nth(2);
    
    public readonly filtreCodeArticle        = this.page.locator('thead th input[type="text"]').nth(0);
    public readonly filtreArticle            = this.page.locator('thead th input[type="text"]').nth(1);
    public readonly buttonRepondre           = this.page.locator('button i.fa-envelope');
    public readonly buttonCommenter          = this.page.locator('button i.fa-comment');


    constructor(public readonly page: Page) {}
}
