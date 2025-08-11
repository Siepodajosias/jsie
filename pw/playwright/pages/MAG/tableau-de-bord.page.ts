/**
 * Appli    : MAGASIN
 * Page     : TABLEAU DE BORD
 * Onglet   : ---
 * 
 * @author JOSIAS SIE
 * @version 3.3
 * 
 */
import { Page} from '@playwright/test';

export class TableauDeBord {

    public readonly datePicker              = this.page.locator('p-calendar button');
    public readonly buttonVoirPhotos        = this.page.locator('div.form-btn-section button i.fa-camera');
    public readonly buttonValider           = this.page.locator('div.form-btn-section button i.fa-thumbs-up');
    public readonly buttonRefuser           = this.page.locator('div.form-btn-section button i.fa-thumbs-down');
    public readonly dataGridDemandesAvoir   = this.page.locator('p-table tr:nth-child(1) th');
    public readonly dataGridRowDemandesAvoir= this.page.locator('.p-datatable-tbody > tr');

    public readonly multiselectGroupeArticle= this.page.locator('p-multiselect[name="groupeArticle"]');
    public readonly inputGroupeArticle      = this.page.locator('input.p-multiselect-filter');
    public readonly liGroupeArticle         = this.page.locator('li.p-multiselect-item');

    public readonly trListeDamandeAvoir     = this.page.locator('.p-datatable-tbody tr.p-selectable-row');
    public readonly inputCodeArticle        = this.page.locator('.p-datatable-hoverable-rows .p-datatable-thead input.p-inputtext');
    public readonly buttonOui               = this.page.locator('.footer-confirmation button').nth(0);
    public readonly buttonNon               = this.page.locator('.footer-confirmation button').nth(1);
    public readonly pMessageConfirmation    = this.page.locator('.p-dialog-content .container-fluid p');
    public readonly pDivDateDemande         = this.page.locator('.multipleSelectSize .p-multiselect-trigger').nth(0);
    public readonly pDivDateBL              = this.page.locator('.multipleSelectSize .p-multiselect-trigger').nth(1);
    public readonly pIStatutAValider        = this.page.locator('i.fa-question-circle');
    public readonly pIStatutAccepter        = this.page.locator('img.custom-icon-dav');
    public readonly pIStatutEnvoyee         = this.page.locator('i.fa-share-square');
    public readonly pInputBL                = this.page.locator('input.p-multiselect-filter');
    public readonly pLiBL                   = this.page.locator('li.p-multiselect-item');
    public readonly spinner                 = this.page.locator('.app-spinner');  

    constructor(public readonly page: Page) {}
}