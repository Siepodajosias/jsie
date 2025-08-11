/**
 * Appli    : MAGASIN
 * Menu     : AUTORISATIONS
 * Onglet   : MODELES ASSORTIMENTS
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */
import { Page} from '@playwright/test';

export class AutorisationsModelesAssortiment {

    public readonly inputAssortiment           = this.page.locator('p-table[id="assortimentDg"] th input');
    public readonly inputFamille               = this.page.locator('p-table[id="assortimentLigneDg"] tr:nth-child(2) th input.p-element').nth(0);
    public readonly inputSousFamille           = this.page.locator('p-table[id="assortimentLigneDg"] tr:nth-child(2) th input.p-element').nth(1);
    public readonly inputCodeArticle           = this.page.locator('p-table[id="assortimentLigneDg"] tr:nth-child(2) th input.p-element').nth(2);
    public readonly inputDesignationArticle    = this.page.locator('p-table[id="assortimentLigneDg"] tr:nth-child(2) th input.p-element').nth(3);

    public readonly inputArticle               = this.page.locator('div.autocomplete-article input');

    public readonly buttonPlus                 = this.page.locator('button i.fa-plus');
    public readonly buttonClonerLesAutoristions= this.page.locator('autorisations-modele-assortiment-wrapper div.form-btn-section button').nth(0);
    public readonly buttonSupprimerLigne       = this.page.locator('autorisations-modele-assortiment-wrapper div.form-btn-section button').nth(1);
    public readonly buttonModifierLigne        = this.page.locator('autorisations-modele-assortiment-wrapper div.form-btn-section button').nth(2);
    public readonly buttonExporterCadencier    = this.page.locator('autorisations-modele-assortiment-wrapper div.form-btn-section button').nth(3);
    public readonly buttonReinitialisation     = this.page.locator('autorisations-modele-assortiment-wrapper div.form-btn-section button').nth(4);

    //public readonly dataGridListeAssortiments  = this.page.locator('.assortiments-ace th');
    public readonly dataGridListeFamilles      = this.page.locator('p-table[id="assortimentLigneDg"] tr:nth-child(1) th');

    public readonly trAssortiments             = this.page.locator('p-table[id="assortimentDg"] tr.p-element');

    constructor(public readonly page: Page) {};

}