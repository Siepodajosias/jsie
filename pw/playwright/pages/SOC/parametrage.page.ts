/**
 * 
 * Application  : SOCIETES 
 * Page         : PARAMETRAGE
 * 
 * @author CALVIERA Jean Christophe
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class PageParametrage {

    public buttonAjouterCompte          : Locator;

    public dataGridComptesBancaires     : Locator;


    constructor(page: Page){

        this.buttonAjouterCompte        = page.locator('div.p-datatable-header button');

        this.dataGridComptesBancaires   = page.locator('thead th');

    }

}