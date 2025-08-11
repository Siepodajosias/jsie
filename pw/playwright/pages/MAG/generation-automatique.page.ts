/**
 * Page MAGASIN > COMMANDES
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */
import { Page} from '@playwright/test';

export class GenerationAutomatique {
    

    public readonly selectGroupeArticle   = this.page.locator('#input-groupe-article-generation-engagements');        
    public readonly inputEngagement       = this.page.locator('#input-assortiment-generation-engagements');        
    public readonly buttonGenerer         = this.page.locator('[ng-click="genererEngagementsCommandes()"]');      
    public readonly datePickerDateCommande= this.page.locator('#datepicker-date-commande-engagement input');
    public readonly buttonRechercher      = this.page.locator('[ng-click="rechercher()"]');
    public readonly datagridCommandes     = this.page.locator('datagrid:nth-child(5) .datagrid-wrapper .datagrid-table-wrapper table > thead > tr > th');
    constructor(public readonly page: Page) {};
};