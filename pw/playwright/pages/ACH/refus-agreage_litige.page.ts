/**
 * APPLI    : ACHATS
 * MENU     : Litiges
 * ONGLET   : Litiges automatiques
 * 
 * 
 * @author JOSIAS SIE
 * 
 * @version 3.0
 * 
 */
import { Page }    from "@playwright/test"

export class RefusAgreageLitige {

    //-- Page : Litiges / litiges automatiques ----------------------------------------------------------

    public readonly datepickerDate                = this.page.locator('.datepicker-wrapper i.icon-calendar');
    public readonly datagridLitigeAgreage         = this.page.locator('table tbody tr');
    public readonly spanNatureLitige              = this.page.locator('table tbody .datagrid-libelleMotifs span');
    public readonly spanQuantiteLitige            = this.page.locator('table tbody .datagrid-quantiteLitige span');
    public readonly datepickerDateJour            = this.page.locator('.today.day');
    public readonly inputNumeroLot                = this.page.locator('input[ng-change="onChange()"]').nth(0);

    constructor(public readonly page: Page) {}
}