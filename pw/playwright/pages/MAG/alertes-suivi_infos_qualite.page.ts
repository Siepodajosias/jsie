/**
 * Appli    : MAGASIN
 * Menu     : ALERTES
 * Onglet   : SUIVI INFOS QUALITE MAGASIN
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * @since 11/09/2023
 * 
 */

import { Page } from "@playwright/test"

export class AlertesSuiviInfoQualite {

    public readonly datePeacker              = this.page.locator('span.p-calendar button');

    public readonly dataGridListeInfos       = this.page.locator('div.datagrid thead tr:nth-child(1) th');

    public readonly checkBoxObservation      = this.page.locator('p-tristatecheckbox').nth(0);


    public readonly checkBoxCommentaire      = this.page.locator('p-tristatecheckbox').nth(1);
    public readonly filtreCodeMagasin        = this.page.locator('thead th input[type="text"]').nth(0);
    
    public readonly filtreMagasin            = this.page.locator('thead th input[type="text"]').nth(1);
    public readonly filtreArticle            = this.page.locator('thead th input[type="text"]').nth(4);

    public readonly filtreNumLot             = this.page.locator('thead th input[type="text"]').nth(2);
    public readonly filtreCodeArticle        = this.page.locator('thead th input[type="text"]').nth(3);

    public readonly listBoxFiltreType        = this.page.locator('p-multiselect[name="typeRemontee"]');
    public readonly listBoxFiltreMotif       = this.page.locator('p-multiselect[name="motif"]');

    public readonly buttonRepondre           = this.page.locator('.containerBT button i.fa-envelope');
    public readonly buttonCommenter          = this.page.locator('.containerBT button i.fa-comment');
    public readonly buttonVoirPhoto          = this.page.locator('.containerBT button i.fa-camera');

    constructor(public readonly page: Page) {}
}