/**
 * Appli    : STOCK
 * Menu     : STOCK
 * Onglet   : REFUS
 * 
 * author JOSIAS SIE
 * 
 * @version 3.1
 * 
 */

import { Page }          from "@playwright/test";

export class StockRefus{

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonImprimerBonReprise   = this.page.locator('button em.icon-print');
    public readonly buttonDeclarerReprise      = this.page.locator('button em.icon-plus-sign');
    public readonly buttonSaisirConsigne       = this.page.locator('button em.pi-comment');
    public readonly buttonRechercher           = this.page.locator('button span.pi-search');
    public readonly buttonSaisieEnMasse        = this.page.locator('button span.pi-check');

    public readonly datePickerRefusDu          = this.page.locator('p-calendar input').nth(0);
    public readonly datePickerRefusAu          = this.page.locator('p-calendar input').nth(1);

    public readonly inputNumLot                = this.page.locator('input#filtre-numeroLotCourt');
    public readonly inputNumPalette            = this.page.locator('input#filtre-numeroPalette');
    public readonly inputCodeArticle           = this.page.locator('input#filtre-codeArticle');
    public readonly inputArticle               = this.page.locator('input#filtre-designationArticle');
    public readonly inputFournisseur           = this.page.locator('input#filtre-designationFournisseur');
    public readonly inputAuteur                = this.page.locator('input#filtre-rapporteurNomPrenom');
    public readonly inputQuantiteRefusee       = this.page.locator('input#filtre-quantite');
    public readonly inputSaisieMasse           = this.page.locator('p-autocomplete.emplacement-refus-global-autocomplete input');

    public readonly listBoxMotif               = this.page.locator('th.colonne-designationMotifRefus p-multiselect');
    public readonly listBoxTypeReprise         = this.page.locator('th.colonne-designationTypeReprise p-multiselect');

    public readonly dataGridRefus              = this.page.locator('thead tr.first-line th');

    public readonly tdNumerosLots              = this.page.locator('td.colonne-numeroLotCourt');

    //----------------------------------------------------------------------------------------------------------------    
    constructor(public readonly page: Page) {}  
}