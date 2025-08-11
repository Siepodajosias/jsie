/**
 * 
 * APPLI    : PRICING
 * PAGE     : PLAN PROMO
 * ONGLET   : COMMUNICATION
 * 
 * @author ESLI ARIEL BAHILI
 * @version 3.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class PlanPromoCommunication {

    public readonly datePickerPeriode          = this.page.locator('form.form-recherche p-calendar');
    public readonly dropDownEnseigne           = this.page.locator('form.form-recherche p-multiselect');

    public readonly dataGridCom                = this.page.locator('table.p-datatable-table thead.p-datatable-thead tr:nth-child(1) th');

    public readonly buttonCreer                = this.page.locator('footer.form-btn-section button').nth(0);
    public readonly buttonDupliquer            = this.page.locator('footer.form-btn-section button').nth(1);
    public readonly buttonSupprimer            = this.page.locator('footer.form-btn-section button').nth(2);

    // -- Popin - Créer un temps fort
    public readonly typeOperation              = this.page.locator('div.p-dialog .infos p-selectbutton .p-button').nth(0);
    public readonly typeEvenement              = this.page.locator('div.p-dialog .infos p-selectbutton .p-button').nth(1);

    public readonly inputNom                   = this.page.locator('div.p-dialog .infos #saisie-nom');
    public readonly datePickerDates            = this.page.locator('div.p-dialog .infos p-calendar');
    public readonly dropDownEnseignes          = this.page.locator('div.p-dialog .infos p-multiselect');
    public readonly inputCommentaire           = this.page.locator('div.p-dialog .infos #saisie-commentaire');

    public readonly buttonFL                   = this.page.locator('div.p-dialog .selection-rayons .rayons p-togglebutton').nth(0);
    public readonly buttonPoissonnerie         = this.page.locator('div.p-dialog .selection-rayons .rayons p-togglebutton').nth(1);
    public readonly buttonCremerie             = this.page.locator('div.p-dialog .selection-rayons .rayons p-togglebutton').nth(2);
    public readonly buttonEpicerie             = this.page.locator('div.p-dialog .selection-rayons .rayons p-togglebutton').nth(3);
    public readonly buttonBCT                  = this.page.locator('div.p-dialog .selection-rayons .rayons p-togglebutton').nth(4);
    public readonly buttonTraiteur             = this.page.locator('div.p-dialog .selection-rayons .rayons p-togglebutton').nth(5);
    public readonly buttonBoulangerie          = this.page.locator('div.p-dialog .selection-rayons .rayons p-togglebutton').nth(6);

    public readonly dataGridMedia              = this.page.locator('div.p-dialog .p-datatable-wrapper thead th');

    public readonly buttonFermer               = this.page.locator('div.p-dialog .p-dialog-header .p-dialog-header-icons button');
    public readonly buttonEnregistrer          = this.page.locator('div.p-dialog .p-dialog-footer p-button').nth(0);
    public readonly buttonAnnuler              = this.page.locator('div.p-dialog .p-dialog-footer p-button').nth(1);

    constructor(public readonly page: Page) {}
}