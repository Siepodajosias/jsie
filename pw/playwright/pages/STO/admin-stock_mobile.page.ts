/**
 * Appli    : STOCK
 * Menu     : ADMINISTRATION
 * Onglet   : STOCK MOBILE
 * 
 * author JC CALVIERA
 * 
 * @version 3.0
 * 
 */
import { Page } from "@playwright/test"

export class AdminStockMobile {
    
    public readonly toggleEmplacementsOptimaux = this.page.locator('.gfit-switch-slider');
    public readonly posEmplacementsOptimaux    = this.page.locator('.gfit-switch-slider span');

    public readonly buttonEmplacementsOptimaux = this.page.locator('#btn-update-emplacement-optimal');

    constructor(public readonly page: Page) {}    
}
