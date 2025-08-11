/**
 * Appli    : MAGASIN 
 * Menu     : AUTORISATIONS
 * Onglet   : AUTORISATIONS LIVRAISONS DIRECTES
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */
import { Page} from '@playwright/test';

export class AutorisationsLivraisonsDirectes {

    public readonly buttonCloner           = this.page.locator('autorisations-ld-wrapper div.form-btn-section button').nth(0);
    public readonly buttonInitEngagement   = this.page.locator('autorisations-ld-wrapper div.form-btn-section button').nth(1);
    public readonly buttonSupprimerLigne   = this.page.locator('autorisations-ld-wrapper div.form-btn-section button').nth(2);
    public readonly buttonModifierLigne    = this.page.locator('autorisations-ld-wrapper div.form-btn-section button').nth(3);
    public readonly buttonAjoutModRemise   = this.page.locator('autorisations-ld-wrapper div.form-btn-section button').nth(4);
    public readonly buttonFuturPrix        = this.page.locator('autorisations-ld-wrapper div.form-btn-section button').nth(5);
    public readonly buttonExporterCadencier= this.page.locator('autorisations-ld-wrapper div.form-btn-section button').nth(6);

    public readonly buttonPlus             = this.page.locator('button i.fa-plus');

    public readonly inputAssortiment       = this.page.locator('p-table[id="assortimentDg"] th input');
    public readonly inputFamille           = this.page.locator('p-table[id="assortimentLigneDg"] tr:nth-child(2) th input.p-element').nth(0);
    public readonly inputSousFamille       = this.page.locator('p-table[id="assortimentLigneDg"] tr:nth-child(2) th input.p-element').nth(1);
    public readonly inputCodeArticle       = this.page.locator('p-table[id="assortimentLigneDg"] tr:nth-child(2) th input.p-element').nth(2);
    public readonly inputDesignationArticle= this.page.locator('p-table[id="assortimentLigneDg"] tr:nth-child(2) th input.p-element').nth(3);

    public readonly listBoxGroupeArticle        = this.page.locator('p-multiselect');

    public readonly checkBoxChoix               = this.page.locator('p-multiselectitem div.p-checkbox-box');

    public readonly pictoCloseGroupeArticle     = this.page.locator('span.p-multiselect-close-icon');

    //public readonly dataGridListeAssort    = this.page.locator('.assortiments-ld th');     
    public readonly dataGridLignesAssort   = this.page.locator('p-table[id="assortimentLigneDg"] tr:nth-child(1) th');    
    
    public readonly trAssortiments         = this.page.locator('p-table[id="assortimentDg"] tr.p-element');

    constructor(public readonly page: Page) {};

    //------------------------------------------------------------------------------------------------------------------------------

    public async multiSelectGroupeArticle(sGroupeArticle:string){
        await this.listBoxGroupeArticle.click();
        await this.inputGroupeArticle.pressSequentially(sGroupeArticle);
        await this.checkBoxChoix.nth(0).click();
        await this.pictoCloseGroupeArticle.click();
    }
}