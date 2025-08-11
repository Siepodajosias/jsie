/**
 * Appli    : MAGASIN
 * Page     : REFERENTIEL
 * Onglet   : UTILISATEURS
 * 
 * @author JOSIAS SIE
 * @version 3.1
 * 
 */
import { Page } from '@playwright/test';

export class ReferentielStockDlc{

    public readonly lieuVente                  = this.page.locator('.input input');
    public readonly groupeArticle              = this.page.locator('#input-groupe-article');

    public readonly buttonAjouter              = this.page.locator('.select-groupe-article button');
    public readonly buttonAppliquerParametrage = this.page.locator('.form-btn-section .containerBT button');

    public readonly dataGridStockDlc           = this.page.locator('thead.p-datatable-thead tr:nth-child(1) th');

    //-- Popin : Confirmation   --------------------------------------------------------------------------------------
    public readonly pButtonConfimer            = this.page.locator('p-footer button');
    public readonly pLinkConfirAnnuler         = this.page.locator('p-footer a');  

    constructor(public readonly page: Page) {}
    
}