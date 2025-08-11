/**
 * Appli    : ACHATS
 * Page     : ADMIN
 * Onglet   : PARAMETRAGES
 * 
 * @author JOSIAS SIE
 * @version 3.1
 * 
 */

import { Locator, Page }    from "@playwright/test"

export class PageAdmParametrages {
  
    public readonly buttonEnregistrer   : Locator;
    public readonly dataGridParametrage : Locator;

    //----------------------------------------------------------------------------------------------------------------- 

    constructor(public readonly page: Page) {
        this.buttonEnregistrer          = page.locator('parametrage div.containerBT button');
        this.dataGridParametrage        = page.locator('.table-parametrage thead th.p-sortable-column'); //('p-table thead th.p-sortable-column');
    }

}