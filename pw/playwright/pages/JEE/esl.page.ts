/**
 * Appli    : JEEGY
 * Page     : ESLs
 * Onglet   : ---
 * 
 * @author JC CALVIERA
 * @version 3.1
 * 
 */

import { Page } from "@playwright/test"

export class Esl {

    public readonly LabelWelcomeMessage     = this.page.locator('H3');
    public readonly inputFieldEsl           = this.page.locator('#srch-term');

    public readonly buttondEsl              = this.page.locator('#btn-search-esl');

    public readonly tdBodyEsl               = this.page.locator('tbody td a.fa-search');
    public readonly tdBodyData              = this.page.locator('table.objects-table-selector td');
    public readonly tdFieldList             = this.page.locator('div.cd-panel-container tbody td:nth-child(2)');
    public readonly tdLibelle               = this.tdBodyData.nth(3);
    public readonly tdPrix                  = this.tdBodyData.nth(4);
    public readonly tdEslCode               = this.tdBodyData.nth(0);

    public readonly iconLoupe               = this.page.locator('a.fa-search');


    //---------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {}
}