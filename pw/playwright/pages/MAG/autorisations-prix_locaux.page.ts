/**
 * Appli    : MAGASIN
 * Page     : AUTORISATIONS
 * onglet   : PRIX LOCAUX
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */
import { Page} from '@playwright/test';

export class AutorisationsPrixLocaux {

    public readonly buttonEnregistrer      = this.page.locator('[ng-click="enregistrer()"]');

    public readonly inputCodeDesignMagasin = this.page.locator('.filtres > span > input');

    public readonly dataGridListeMagasins  = this.page.locator('.offres .span8 th');      

    public readonly checkBoxAllOffres      = this.page.locator('datagrid[contenu="dgTypesOffres.contenu"] thead input');
    public readonly checkBoxOffres         = this.page.locator('datagrid[contenu="dgTypesOffres.contenu"] tbody input');
    public readonly checkBoxAuthCasseFrais = this.page.locator('#input-autorisation-casse-frais');
    public readonly checkBoxAuthAlignConc  = this.page.locator('#input-autorisation-alignement-concurrence');

    public readonly trListeOffresSelected  = this.page.locator('tbody tr.selectionne');
    public readonly trListeMagasin         = this.page.locator('[contenu="dgMagasins.contenu"] tbody tr');

    public readonly tdListeLibellesLDV     = this.page.locator('td.datagrid-designation');

    constructor(public readonly page: Page) {};
}