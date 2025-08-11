/**
 * Appli    : ACHATS 
 * Page     : REFERENTIEL
 * Onglet   : FRAIS DE TRANSPORT
 * 
 * 
 * @author JC CALVIERA
 * @version 3.0
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageRefFraTrp {

    public readonly buttonAjouterNouveauFrais      : Locator;

    public readonly dataGridFraisTransport         : Locator;

    //------------------------------------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {
        
        this.buttonAjouterNouveauFrais      = page.locator('form button.p-button');

        this.dataGridFraisTransport         = page.locator('thead th');
 
    }

}