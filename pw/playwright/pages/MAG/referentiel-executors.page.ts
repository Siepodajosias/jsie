/**
 * Appli    : MAGASIN
 * Page     : REFERENTIEL
 * Onglet   : UTILISATEURS
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */
import { Page} from '@playwright/test';

export class ReferentielExecutors{

    public readonly buttonRafaichir        = this.page.locator('legend:NOT(.executor) button');
    public readonly buttonExecutorRafaichir= this.page.locator('legend.executor button');
    public readonly buttonSupprimer        = this.page.locator('.tasks-actions button');

    public readonly datagridExecutors      = this.page.locator('p-table .p-datatable-wrapper table > thead.p-datatable-thead > tr').nth(0).locator('th');

    constructor(public readonly page: Page) {}
    
}