/**
 * Appli    : MAGASIN
 * Page     : ALERTES
 * Onglet   : HISTORIQUE CENTRALE
 * 
 * @author JOSIAS SIE
 * @version 3.1
 * 
 */

import { Page } from "@playwright/test"

export class AlertesHistoriqueCentrale {

    public readonly buttonRechercher        = this.page.locator('[ng-click="rechercherAlertes()"]');
    public readonly buttonSection           = this.page.locator('.form-btn-section button')

    public readonly datePickerFrom           = this.page.locator('.periode-debut .datepicker-wrapper > input');
    public readonly datePickerTo             = this.page.locator('.periode-fin .datepicker-wrapper > input');
    public readonly datePickerDLC            = this.page.locator('.date-dlc .datepicker-wrapper > input');


    public readonly listBoxGroupeArticle     = this.page.locator('#input-groupe');
    public readonly listBoxPilote            = this.page.locator('#input-login');
    
    public readonly inputFiltreArticle       = this.page.locator('.article input');
    public readonly inputFiltreFourn         = this.page.locator('.fournisseur input');
    public readonly inputFiltreNumLot        = this.page.locator('.numero-lotSigale input');
    public readonly inputFiltreNumFourn      = this.page.locator('.numero-lotFournisseur input');

    public readonly dataGridListeAlertes     = this.page.locator('.bloc-datagrid div.datagrid-table-wrapper > table > thead > tr > th');

    constructor(public readonly page: Page) {}
}