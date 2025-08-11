/**
 * Appli    : MAGASIN
 * Page     : PREPARATION
 * Onglet   : ---
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * @since 2023-09-14
 * 
 */

import { Page} from '@playwright/test';

export class Preparation {

    public readonly calendrier                 = this.page.locator('#periode');

    public readonly buttonAujourdhui           = this.page.locator('.form-periode button.btn');
    public readonly buttonVoirDetail           = this.page.locator('.form-btn-section button').nth(0);
    public readonly buttonImprimerPrepa        = this.page.locator('.form-btn-section button').nth(1);
    public readonly buttonImprimerBL           = this.page.locator('.form-btn-section button').nth(2);
    public readonly buttonTerminerPrepa        = this.page.locator('.form-btn-section button').nth(3);
    public readonly buttonLivrerAuClient       = this.page.locator('.form-btn-section button').nth(4);
    public readonly buttonAnnulerCommande      = this.page.locator('.form-btn-section button').nth(5);

    public readonly dataGridCommandes          = this.page.locator('thead.p-datatable-thead tr:nth-child(1) th');

    constructor(public readonly page: Page) {};
    
}