/**
 * Page MAGASIN > EMBALLAGES > SUIV DES BONS
 * 
 * @author JOSIAS SIE
 * @version 3.0  
 * 
 */
import { Page} from '@playwright/test';

export class EmballagesSuivi {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonValider              = this.page.locator('[ng-click="valider(dgSuiviBons.selections[0])"]');  
    
    public readonly datePickerPeriodeFrom      = this.page.locator('span.datepicker-wrapper > input').nth(0);
    public readonly datePickerPeriodeTo        = this.page.locator('span.datepicker-wrapper > input').nth(1);   

    public readonly inputMagasin               = this.page.locator('.input-filtres > input').nth(0);
    public readonly inputtransporteur          = this.page.locator('.input-filtres > input').nth(1);    

    public readonly toggleButton               = this.page.locator('.btn-group > button');
    public readonly toggleButtonTous           = this.page.locator('[ng-click="onToggle($event, choice)"]').nth(0);
    public readonly toggleButtonValides        = this.page.locator('[ng-click="onToggle($event, choice)"]').nth(1);
    public readonly toggleButtonAValider       = this.page.locator('[ng-click="onToggle($event, choice)"]').nth(2);
    public readonly toggleButtonAnnules        = this.page.locator('[ng-click="onToggle($event, choice)"]').nth(3);

    public readonly dataGridListeBon           = this.page.locator('div.datagrid-table-wrapper > table').nth(1).locator('thead > tr > th');    
    public readonly dataGridHeaderDate         = this.page.locator('th[data-attribut="date"]');

    public readonly tdNumeroBons               = this.page.locator('td.datagrid-numero');

    constructor(public readonly page: Page) {};
}