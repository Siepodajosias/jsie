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

export class ReferentielParametrage{

    public readonly buttonEnregistrer  = this.page.locator('.form-btn-section .containerBT button');

    public readonly dataGridParametrage= this.page.locator('p-table .p-datatable-wrapper table > thead.p-datatable-thead > tr:nth-child(1) th');
 

    constructor(public readonly page: Page) {}
    
}