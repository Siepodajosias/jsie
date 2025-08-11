/**
 * Appli    : PRICING
 * Page     : ADMINISTRATION
 * Onglet   : Paramétrage
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */

import { Page } from "@playwright/test";

export class AdminParametrage {

    public readonly buttonEnregistrer       = this.page.locator('.containerBT button');

    public readonly trHeaderParametrages    = this.page.locator('table > thead[role="rowgroup"] > tr').nth(1);

    constructor(public readonly page: Page) {}
}