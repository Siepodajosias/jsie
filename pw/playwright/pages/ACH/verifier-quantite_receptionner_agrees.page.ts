/**
 * APPLI    : ACHATS
 * MENU     : Home
 * ONGLET   : Recherche lot
 * 
 * 
 * @author JOSIAS SIE
 * 
 * @version 3.0
 * 
 */
import { Page }    from "@playwright/test"

export class VerifierQuantiteReceptionnerAgrees {

    //-- Page : home / Recherche lot ---------------------------------------------------------------------------------------

    public readonly tdQuantiteAchetee              = this.page.locator('.table-bordered:NOT(.table-condensed) tr.ng-scope td').nth(4);
    public readonly tdQuantiteReceptionner         = this.page.locator('.table-bordered:NOT(.table-condensed) tr.ng-scope td').nth(5);
    public readonly tdQuantiteAgrees               = this.page.locator('.table-bordered:NOT(.table-condensed) tr.ng-scope td').nth(6);
    public readonly datagridLotReceptionner        = this.page.locator('.table-bordered:NOT(.table-condensed) tr.ng-scope');
    public readonly tdNumeroLot                    = this.page.locator('table tr.row-achat td.recherche-rapide-no-lot p');
    public readonly buttonRechercher               = this.page.locator('div.filtres button');
    public readonly inputNumeroAchat               = this.page.locator('span.filter-wrapper input').nth(0);

    constructor(public readonly page: Page) {}
}