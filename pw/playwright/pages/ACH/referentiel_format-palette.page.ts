/**
 * Appli    : ACHATS 
 * Page     : REFERENTIEL
 * Onglet   : FORMAT DE PALETTE
 * 
 * 
 * @author JC CALVIERA
 * @version 3.0
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageRefForPal {

    public readonly inputFiltreDesignation  : Locator;

    public readonly dataGridFormats         : Locator;   

    constructor(public readonly page: Page) {
        
        this.inputFiltreDesignation         = page.locator('div.article input');

        this.dataGridFormats                = page.locator('format-palette-wrapper th');
   
    }

}