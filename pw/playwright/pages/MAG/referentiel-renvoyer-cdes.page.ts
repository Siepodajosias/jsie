/**
 * Appli    : MAGASIN
 * Page     : REFERENTIEL
 * Onglet   : UTILISATEURS
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */
import { Page } from '@playwright/test';

export class ReferentielRenvoyerCdes{

    public readonly datePickerDateCommande     = this.page.locator('#datepicker-date-commande .input-date');
    public readonly inputGroupeArticle         = this.page.locator('#input-groupe');
    public readonly inputAssortiment           = this.page.locator('#input-assortiment');
    public readonly buttonRechercher           = this.page.locator('[ng-click="rechercher()"]');
    public readonly buttonRenvoyerCommandesSel = this.page.locator('.form-btn-section .containerBT button');
    public readonly datagridCommandes          = this.page.locator('datagrid:nth-child(3) .datagrid-wrapper table > thead > tr > th');
    constructor(public readonly page: Page) {}
    
}