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

export class ReferentielModifierEngagements{

    public readonly datePickerDateLivraison      = this.page.locator('#datepicker-date-1-transfere-quantite-entre-2-dates .input-date');
    public readonly datePickerNoulDateLivraison  = this.page.locator('#datepicker-date-2-transfere-quantite-entre-2-dates .input-date');
    public readonly inputGroupeArticle           = this.page.locator('#input-groupe-article-transfere-quantite-entre-2-dates');
    public readonly inputGroupeArticleRetraiter  = this.page.locator('#input-groupe-article-retraiter-engagement-en-masse');
    public readonly inputEngagement              = this.page.locator('#input-engagement-transfere-quantite-entre-2-dates');
    public readonly inputRecalculerEngagement    = this.page.locator('#input-engagement-retraiter-engagement-en-masse');
    public readonly checkBoxRecalculerEngagement = this.page.locator('#input-recalculer-engagement');
    public readonly checkBoxRenvoyerEngagement   = this.page.locator('#input-renvoyer-engagement');

    public readonly inputCodesArticles           = this.page.locator('#input-articles-transfere-quantite-entre-2-dates');
    public readonly inputCodeClientsMagasins     = this.page.locator('#input-magasins-transfere-quantite-entre-2-dates');
    public readonly inputCodesRefGamme           = this.page.locator('#input-references-gamme-transfert-quantite-entre-2-dates');

    constructor(public readonly page: Page) {}
}