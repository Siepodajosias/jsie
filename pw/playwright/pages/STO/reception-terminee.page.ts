/**
 * Page STOCK > RECEPTION > Receptions Terminées
 * 
 * author JOSIAS SIE
 * 
 * @version 3.2
 * 
 */


import { Page }          from "@playwright/test";
import { TestFunctions } from '../../utils/functions.js';

export class ReceptionTermine{

    public fonction             = new TestFunctions();
    //----------------------------------------------------------------------------------------------------------------    
  
    public readonly listBLResults          = this.page.locator('td.datagrid-numeroBL > span');
    public readonly thDebutChargement      = this.page.locator('th.datagrid-debutDechargement');

    //public readonly listBLResults          = this.page.locator('td.datagrid-numeroBL');

    public readonly buttonVoirRecpTerm     = this.page.locator('popup-reception-wrapper');
    public readonly buttonDeclarerNewRecp  = this.page.locator('[ng-click="declarerNouvelleLivraison(dg.selection[0])"]');
    public readonly buttonImprimerEtiq     = this.page.locator('[ng-click="openPopupImpression(dg.selection[0])"]');

    public readonly datePickerReception    = this.page.locator('input.input-date');

    public readonly dataGridReceptions     = this.page.locator('.tab-pane div.datagrid-table-wrapper > table').nth(0).locator('thead > tr > th'); 
    public readonly listRecTerminees       = this.page.locator('.table-receptions-terminees .datagrid-wrapper td input');

    public readonly rechercheBlAchatFourn  = this.page.locator('[placeholder="Numéro de BL / Numéro achat / Fournisseur"]').nth(1);
    public readonly inputNumeroBL          = this.page.locator('input.filter-input');

    public readonly checkBoxNumBL          = this.page.locator('#checkbox-numeroBL');
    public readonly checkBoxNumeroAchat    = this.page.locator('#checkbox-numerosAchat');
    public readonly checkBoxFournisseur    = this.page.locator('#checkbox-fournisseurs');

    //-- Pop up reception terminée ----------------------------------------------------------------------------------- 
    public readonly linkFermer             = this.page.locator('.p-dialog-footer p-button button.p-button-link');

     constructor(public readonly page: Page) {}  
    //---------------------------------------------------------------------------------------------------------------- 

    public async clickButtonDebutChargement() {
        await this.fonction.clickElement(this.thDebutChargement);
    }

}