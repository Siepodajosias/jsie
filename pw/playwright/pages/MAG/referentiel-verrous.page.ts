/**
 * Appli    : MAGASIN
 * Page     : REFERENTIEL
 * Onglet   : VERROUS
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */
import { Page} from '@playwright/test';

export class ReferentielVerrous{

    public readonly buttonRafraichir           = this.page.locator('.bouton-rafraichir p-button');
    public readonly buttonSupprimer            = this.page.locator('.form-btn-section button');

    public readonly datagridListeVerrous       = this.page.locator('.p-datatable-thead tr').nth(0);


    constructor(public readonly page: Page) {}
    
}