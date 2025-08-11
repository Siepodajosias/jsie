/**
 * Appli    : CONCURRENCE
 * Menu     : ADMIN
 * Onglet   : ADMIN
 * 
 * 
 * @author JOSIAS SIE
 * @version 3.1
 * 
 */
import { Page }    from "@playwright/test"

export class Admin {

    public readonly buttonActiverDesactiveAccesAppli = this.page.locator('button[icon="pi pi-thumbs-down"]');//('button.btn.btn-medium.mx-auto');
    public readonly buttonSupprimerCache             = this.page.locator('button#clear');//('#clear[type="submit"]');
    public readonly buttonVoirApiSwagger             = this.page.locator('.mx-auto .btn.btn-link');
    public readonly listBoxSelectCache               = this.page.locator('#caches');
    public readonly listBoxSelectOpen                = this.page.locator('select option');

    constructor(public readonly page: Page) {}
}