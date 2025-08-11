/**
 * Page MAGASIN > COMMANDES
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */
import { Page} from '@playwright/test';

export class SuiviGenerationsAC {
    

    public readonly selectGroupeArticle     = this.page.locator('#input-groupe-article-generation-commandes-assortiment');        
    public readonly inputAssortiment        = this.page.locator('#input-assortiment-generation-commandes');        
    public readonly buttonGenerer           = this.page.locator('[ng-click="genererCommandes()"]');      
    public readonly datePickerDateGeneration= this.page.locator('#datepicker-date-generation input');
    public readonly buttonRechercher        = this.page.locator('[ng-click="rechercherAc(true)"]');
    public readonly datagridGenererCommandes= this.page.locator('datagrid:nth-child(1) .datagrid-wrapper .datagrid-table-wrapper table > thead > tr > th');
    constructor(public readonly page: Page) {};
};