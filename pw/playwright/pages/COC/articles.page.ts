/**
 * Appli    : CONCURRENCE
 * Menu     : ARTICLES
 * Onglet   : ARTICLES
 * 
 * 
 * @author JOSIAS SIE
 * @version 3.2
 * 
 */
import { Page }    from "@playwright/test"

export class Articles {

    public readonly dataGridEntierArticles                   = this.page.locator('.p-datatable-scrollable-table');//('.p-datatable-scrollable-view');
    public readonly dataGridEnteteArticles                   = this.page.locator('.p-datatable-thead tr.ng-star-inserted th[role="columnheader"]');
    public readonly dataGridHeaderCheckBoxArticles           = this.page.locator('#header-selection');
    public readonly dataGridHeaderCheckBoxArticlesChoix      = this.page.locator('p-tablecheckbox');
    public readonly dataGridHeaderCodeArticle                = this.page.locator('#header-code');
    public readonly dataGridHeaderDesignationArticle         = this.page.locator('#header-designation');
    public readonly dataGridHeaderDesignationPerso           = this.page.locator('#header-designation-personnalisee');
    public readonly dataGridHeaderInstruction                = this.page.locator('#header-instruction');
    public readonly dataGridHeaderGroupeArticle              = this.page.locator('.p-datatable-thead th').nth(5);
    public readonly dataGridHeaderCategorie                  = this.page.locator('.p-datatable-thead th').nth(6);
    public readonly dataGridHeaderActif                      = this.page.locator('#header-active');
    public readonly dataGridInputFiltreCodeArticle           = this.page.locator('#filtre-code input');
    public readonly dataGridInputFiltreDesignationArticle    = this.page.locator('#filtre-designation input') ;
    public readonly dataGridInputFiltreDesignationPerso      = this.page.locator('#filtre-designation-personnalisee input');
    public readonly dataGridInputFiltreInstruction           = this.page.locator('#filtre-instruction input');
    public readonly dataGridFiltreListBoxGroupeArticle       = this.page.locator('.p-datatable-thead th').nth(14);
    public readonly dataGridFiltreListBoxGroupeArticleChoix  = this.page.locator('ul li');
    public readonly dataGridFiltreListBoxGroupeCategorie     = this.page.locator('.p-datatable-thead th').nth(15);
    public readonly dataGridFiltreListBoxGroupeCategorieChoix= this.page.locator('ul li');
    public readonly dataGridFiltreListBoxGroupeActif         = this.page.locator('#filtre-actif');
    public readonly dataGridFiltreListBoxGroupeActifChoix    = this.page.locator('ul li');
    public readonly dataGridButtonVider                      = this.page.locator('#filtre-actions button');//('p-button[icon="fas fa-times"]');
    public readonly buttonActiverArticle                     = this.page.locator('.footerBar p-button[icon="fas fa-check"]');//('app-footer-bar em.fas.fa-check');
    public readonly buttonDesactiverArticle                  = this.page.locator('.footerBar p-button[icon="fas fa-times"]');//('app-footer-bar em.fas.fa-times');
    public readonly buttonModifierArticle                    = this.page.locator('.footerBar p-button[icon="fas fa-pencil-alt"]');//('app-footer-bar em.fas.fa-pencil-alt');
    public readonly buttonAssocierCategorie                  = this.page.locator('.footerBar p-button[icon="fas fa-link"]');//('app-footer-bar em.fas.fa-link');
    //Après avoir cliqué sur le bouton modifier 
    public readonly pPinputFieldDesignationPerso             = this.page.locator('div.container input.text-style');
    public readonly pPinputFieldInstruction                  = this.page.locator('div.container textarea.text-style') ;
    public readonly pPlistBoxCategorie                       = this.page.locator('p-multiselect').nth(1);
    public readonly pPlistBoxChoix                           = this.page.locator('ul li');
    public readonly pPcheckBoxActif                          = this.page.locator('p-checkbox .p-checkbox-box');
    public readonly pButtonCloseFiltersearch                 = this.page.locator('timesicon > .p-multiselect-close-icon')
    public readonly pPbuttonEnregistrer                      = this.page.locator('p-footer button').nth(0) ;
    public readonly pPbuttonAnnuler                          = this.page.locator('p-footer button').nth(1);
    //Après avoir cliqué sur le bouton Associer catégorie
    public readonly pPlistBoxAssocierCategorie               = this.page.locator('p-multiselect').nth(1);//('div.container span.pi');
    public readonly pPlistChoixCategorie                     = this.page.locator('ul li');
    public readonly pPbuttonEnregistrerAssociation           = this.page.locator('p-footer button').nth(0);
    public readonly pPbuttonAnnulerAssociation               = this.page.locator('p-footer button').nth(1);

    constructor(public readonly page: Page) {}
}