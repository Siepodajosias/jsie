/**
 * Appli    : MAGASIN
 * Page     : AUTORISATIONS
 * Onglet   : BLOCAGE
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */

import { Page } from '@playwright/test';

export class AutorisationsBlocage {

    public readonly buttonBloquer              = this.page.locator('[ng-click="majBlocageDemandeEchange(dgBlocage.selections[0], true)"]');
    public readonly buttonDebloquer            = this.page.locator('[ng-click="majBlocageDemandeEchange(dgBlocage.selections[0], false)"]');

    public readonly dataGridListeAssort        = this.page.locator('.blocage div.datagrid-table-wrapper > table > thead > tr > th');  

    public readonly tdLibelleGroupeArticle     = this.page.locator('td.datagrid-designation');      
    
    public readonly pictoLigneBloquee          = this.page.locator('tr.selectionne td.datagrid-facturationBloquee i.icon-lock');
    
    constructor(public readonly page: Page) {}
}