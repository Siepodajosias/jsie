/**
 * Appli    : MAGASIN
 * Menu     : COMMANDES
 * Onglet   : ENGAGEMENTS
 * 
 * @author JOSIAS SIE
 * @version 3.2
 * 
 */

import { Page} from '@playwright/test';

export class CommandesEngagements {

    public readonly buttonEngeristrer      = this.page.locator('[ng-click="enregistrer()"]');
    public readonly buttonValider          = this.page.locator('[ng-click="valider()"]');  
    public readonly buttonEnvoyerAuCS      = this.page.locator('[ng-click="envoyer()"]');  

    public readonly listBoxEngagement      = this.page.locator('#select-engagement-filter');

    public readonly dataGridListesCmd      = this.page.locator('.liste-commandes th');     
    public readonly dataGridEngagements    = this.page.locator('#dg-lignes-engagements');

    public readonly tdLibelleEngagement    = this.page.locator('td.datagrid-designation');
    public readonly tdStatutEngagement     = this.page.locator('td.datagrid-statut-designation');
    public readonly tdCodeArticle          = this.page.locator('td.datagrid-article-code');
    public readonly tdLibelleArticle       = this.page.locator('td.datagrid-article-designation');
    public readonly dataGridTdquantiteInit = this.page.locator(' tr:nth-child(1) td[class^="datagrid-$quantite"]') 
    public readonly dataGridTdquantiteRef  = this.page.locator('table tbody tr td.datagrid-quantiteReference'); 

    public readonly trLignesEngagements    = this.page.locator('.liste-commandes tbody tr'); 
    public readonly trLignesArticles       = this.page.locator('#dg-lignes-engagements table tbody tr') 

    public readonly inputQuantiteEngagement= this.page.locator('td input.ng-valid');
    public readonly inputFiltreEngagement  = this.page.locator('.filtres-engagement input.filter-input');

    public readonly divMessageSuccess      = this.page.locator('div.gfit-success');
    public readonly spinner                = this.page.locator('i.app-spinner');
    constructor(public readonly page: Page) {};
}