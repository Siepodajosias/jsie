/**
 * Appli    : STOCK
 * Page     : STOCK
 * Onglet   : SITUATION DES PALETTES
 * 
 * author JOSIAS SIE 
 * 
 * @version 3.7
 * 
 */

import { Page }          from "@playwright/test";

export class StockSituation{

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly inputPalette               = this.page.locator('.critere .sigale-input-container .p-inputtext').nth(0);
    public readonly inputNumLot                = this.page.locator('.critere .sigale-input-container .p-inputtext').nth(1);
    public readonly inputFournisseur           = this.page.locator('p-autocomplete input.p-autocomplete-input').nth(0);
    public readonly inputArticle               = this.page.locator('p-autocomplete input.p-autocomplete-input').nth(1);//('#recherche-article');
    public readonly inputAll                   = this.page.locator('.sigale-input-container input');

    public readonly trListePalettes             = this.page.locator('tbody.p-datatable-tbody tr.p-selectable-row');//('.situation-palettes-resultats td input');

    public readonly toggleManquante            = this.page.locator('[aria-label="Manquante"]');//('[ng-click="switchEtat(\'MANQUANTE\')"]');
    public readonly toggleBloquee              = this.page.locator('[aria-label="Bloquée"]');
    public readonly toggleEnAttente            = this.page.locator('[aria-label="En attente"]');
    public readonly toggleRechercher           = this.page.locator('button.p-ripple.p-element.p-button.p-component');
    public readonly dataGridColumnCodeArticle  = this.page.locator('td.colonne-codeArticle span');

    public readonly buttonRechercher           = this.page.locator('button span.pi-search');
    public readonly buttonMasquerPalettes      = this.page.locator('.palette-a-zero .p-checkbox-box');
    public readonly buttonAfficherDeplacement  = this.page.locator('.form-btn-section .btn-primary').nth(0);

    public readonly buttonMettreEnAttente      = this.page.locator('.form-btn-section .btn-primary').nth(1);
    public readonly buttonRendreDisponible     = this.page.locator('.form-btn-section .btn-primary').nth(2);

    public readonly buttonRechercherLot        = this.page.locator('.div-btn-rechercher button')

    public readonly tdQuantiteLot              = this.page.locator('tbody tr td.datagrid-nbColisEnStock span');

    public readonly dataGridListePalettes      = this.page.locator('.p-datatable-thead tr.first-line th');//('.situation-palettes-resultats th');

    public readonly autoCompleteArticle        = this.page.locator('.gfit-autocomplete-results li');

    public readonly spinner                    = this.page.locator('i.app-spinner');

    //-- Popin : Historique des mouvements de la palette {NumPalette} ------------------------------------------------
    public readonly pToggleDeplacement         = this.page.locator('[aria-label="Déplacement"] span.p-button-label');//('[ng-click="switchMouvement(\'DEPLACEMENT\')"]');
    public readonly pToggleMouvement           = this.page.locator('[aria-label="Mouvement de stock"] span.p-button-label');//('[ng-click="switchMouvement(\'MOUVEMENT\')"]');

    public readonly pDataGridMvtPalettes       = this.page.locator('.table-mouvements-palette .p-datatable-thead tr.first-line th');//('.mouvements-palette th');

    public readonly pLinkFermer                = this.page.locator('button.p-button-link');

    //----------------------------------------------------------------------------------------------------------------    
    constructor(public readonly page: Page) {}  
}