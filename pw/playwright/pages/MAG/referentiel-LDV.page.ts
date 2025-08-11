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

export class ReferentielLDV{

    public readonly buttonEnregistrer          = this.page.locator('.form-btn-section .containerBT button');

    public readonly dataGridLieuVente          = this.page.locator('.p-datatable-thead th.p-element');

    constructor(public readonly page: Page) {}
    
}