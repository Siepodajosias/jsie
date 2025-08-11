/**
 * Appli    : NOMENCLATURE
 * Page     : NOMENCLATURE
 * Onglet   : ---
 * 
 * @author  JOSIAS SIE
 * @version 3.0
 * 
 */

import { Page } from "@playwright/test"

export class Nomenclature {

    public readonly inputSearchNomenclature = this.page.locator('filter-tree input').nth(0);
    public readonly inputSearchAccesDirect  = this.page.locator('filter-tree input').nth(1);

    public readonly buttonDeplacerArticles  = this.page.locator('.footerBar button');    

    public readonly pModalDialog            = this.page.locator('.modal-dialog .modal-content');

    public readonly inputDesignation        = this.page.locator('.nomenclature input');


    constructor(public readonly page: Page) {}
}