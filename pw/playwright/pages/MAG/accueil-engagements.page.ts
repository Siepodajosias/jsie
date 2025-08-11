/**
 * Appli    : MAGASIN
 * Page     : ACCUEIL
 * Onglet   : Etat des commandes
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */

import { Page } from "@playwright/test"

export class AccueilEngagements {

    public readonly checkBoxEngaEnCours      = this.page.locator('#engagementsCoursSaisie');
    public readonly checkBoxEngaSpecifique   = this.page.locator('#engagementsSpecifique');
    public readonly checkBoxEngaExpedPeriode = this.page.locator('#engagementExpeditionPeriode');

    public readonly inputEngaSpecifique      = this.page.locator('div.recherche-specifique input.form-control');

    public readonly datePickerEngagSpecifique= this.page.locator('div.recherche-periode p-calendar input');

    public readonly buttonActualiser         = this.page.locator('button.bouton-actualiser');

    public readonly dataGridAssortiments     = this.page.locator('div.table-engagement thead th.center');
    public readonly dataGridMagasins         = this.page.locator('div.table-magasin thead th.center');

    constructor(public readonly page: Page) {}
}