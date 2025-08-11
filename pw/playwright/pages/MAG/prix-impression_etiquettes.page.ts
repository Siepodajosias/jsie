/**
 * Appli    : MAGASIN
 * Page     : PRIX
 * Onglet   : IMPRESSION DES ETIQUETTES
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * @since 2023-09-14
 *  
 */

import { Page} from '@playwright/test';

export class PrixImpressionEtiquettes {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonImprimerEtiquette    = this.page.locator('impression-etiquettes-wrapper div.form-btn-section button');
 
    public readonly dataGridEtiquettes         = this.page.locator('impression-etiquettes-wrapper table thead th');     

    constructor(public readonly page: Page) {};
}