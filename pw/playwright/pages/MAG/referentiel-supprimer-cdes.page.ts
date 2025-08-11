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

export class ReferentielSupprimerCdes{

    public readonly datePickerDateCommande     = this.page.locator('#commande-date .input-date');
    public readonly inputGroupeArticle         = this.page.locator('#input-commande-groupe-article');
    public readonly inputCommande              = this.page.locator('#input-commande-id');
    public readonly inputCommandeAssortiment   = this.page.locator('#input-commande-assortiment');
    public readonly inputCodeClientsMagasins   = this.page.locator('#input-commande-codes-magasins');

    public readonly buttonRenvoyerCommandesSel = this.page.locator('.form-btn-section .containerBT button');

    constructor(public readonly page: Page) {}
}