/**
 * Appli    : NOMENCLATURE
 * Page     : COMPOSITION
 * Onglet   : ---
 * 
 * @author  JOSIAS SIE
 * @version 3.1
 * 
 */

import { Page } from "@playwright/test"

export class Composition {

    public readonly inputArticle            = this.page.locator('#codeDesignationArticle input');
    public readonly inputFamille            = this.page.locator('#famille input');
    public readonly inputSousFamille        = this.page.locator('#sousFamille input');

    public readonly listBoxRayon            = this.page.locator('#rayon');
    public readonly listBoxGroupe           = this.page.locator('#groupe');

    public readonly buttonRechercher        = this.page.locator('#btnRechercher');
    public readonly buttonVider             = this.page.locator('#btnVider');
    public readonly buttonModifCompo        = this.page.locator('footerbar button');

    public readonly dataGridArticles        = this.page.locator('thead.p-datatable-thead th');

    //-- Popin : Compositions avec l'article XXX -------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {}
}