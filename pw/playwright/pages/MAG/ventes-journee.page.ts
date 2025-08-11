/**
 * Appli    : MAGASIN
 * Menu     : VENTES
 * Onglet   : VENTES D'UNE JOURNEE
 * 
 * @author JOSIAS SIE
 * @version 3.4
 * @since 12/09/2023
 * 
 */

import { Page,} from '@playwright/test';

export class VentesJournee {

    //----------------------------------------------------------------------------------------------------------------    

    public readonly inputSearchArticle         = this.page.locator('.recherche-article > span > input');

    public readonly listBoxGrpArticle          = this.page.locator('p-multiselect-wrapper[name="multiselectGroupeArticle"]');
    public readonly listBoxFamille             = this.page.locator('p-multiselect-wrapper[name="multiselectFamilleArticle"]');

    
    public readonly datePickerVentesDu         = this.page.locator('#datepicker-date-ventes-debut i.icon-calendar');
    public readonly datePickerVentesAu         = this.page.locator('#datepicker-date-ventes-fin');
    public readonly inputArticle               = this.page.locator('[ng-item="autocomplete.article"]');
    public readonly buttonExporter             = this.page.locator('div.bottom-fixed button').nth(0);
    public readonly iconClear                  = this.page.locator('[ng-click="autocomplete.clearAutocomplete()"]');

    public readonly datePickerVentesFrom       = this.page.locator('span.datepicker-wrapper > input').nth(0);
    public readonly datePickerVentesTo         = this.page.locator('span.datepicker-wrapper > input').nth(1);

    public readonly datePickerVentesFromPicto  = this.page.locator('span.datepicker-wrapper i.icon-calendar').nth(0);
    public readonly datePickerVentesToPicto    = this.page.locator('span.datepicker-wrapper i.icon-calendar').nth(1);
    
    public readonly dataGridListeVentes        = this.page.locator('.liste-ventes div.datagrid-table-wrapper > table > thead > tr > th'); 

    public readonly tdPVCMagasin               = this.page.locator('td.datagrid-pvc');
    public readonly tdQuantiteVendue           = this.page.locator('td.datagrid-quantiteVendue');
    public readonly tdMontantTtc               = this.page.locator('td.datagrid-montantTtc');
    public readonly tdActiveDays               = this.page.locator('td.day:NOT(.old)');
    public readonly tdToDays                   = this.page.locator('td.active.day:NOT(.disabled)');

    public readonly labelTotalVentes           = this.page.locator('.montant-ttc-ventes span');
    public readonly labelTotalDesVentes        = this.page.locator('div.montant-ttc-ventes');    
    public readonly labelQuantitesVendues      = this.page.locator('div.quantite-totale-ventes span');    

    public readonly paginationLastPage         = this.page.locator('div.pagination.pagination-centered > ul > li > a').nth(13);

    public readonly pictoClearFilter           = this.page.locator('[ng-click="clearFilter()"]').nth(1);
    public readonly pictoMoisPrecedent         = this.page.locator('div.datepicker th.prev').nth(0);
    public readonly pictoCloseSelect           = this.page.locator('button .p-multiselect-close-icon');

    public readonly radioButtonPeriode         = this.page.locator('#input-filtre-recherche-date');
    public readonly radioButtonPromotion       = this.page.locator('#input-filtre-recherche-promo-seulement');

    public readonly checkBoxChoix              = this.page.locator('p-multiselectitem');

    public readonly buttonRechecher            = this.page.locator('[ng-click="rechercherVentes()"]');
    public readonly errorMessage               = this.page.locator('.feedback-error:NOT(.ng-hide)');
    public readonly tdFlowId                   = this.page.locator('table:nth-child(1) tbody tr[tabindex="1"] td:nth-child(1)');
    
    constructor(public readonly page: Page) {}

}