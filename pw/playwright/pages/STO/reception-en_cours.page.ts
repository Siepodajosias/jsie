/**
 * Page STOCK > RECEPTION > RECEPTION EN COURS
 * 
 * author JOSIAS SIE
 * 
 * @version 3.1
 * 
 */

import { Page }          from "@playwright/test";

export class ReceptionEnCours {

    //----------------------------------------------------------------------------------------------------------------    
    public readonly buttonCompleter        = this.page.locator('popup-reception-wrapper');
    public readonly buttonImprimerEtiq     = this.page.locator('[ng-click="openPopupImpression(dg.selection[0])"]');
    public readonly buttonTerminer         = this.page.locator('[ng-click="openTerminerReception(dg.selection[0])"]');
    public readonly buttonReceptionnerScan = this.page.locator('[ng-click="openScanArticleReception()"]');
    public readonly dataGridReceptions     = this.page.locator('.table-receptions-encours div.datagrid-table-wrapper > table').nth(0).locator('thead > tr > th'); 
    public readonly listRecEnCours         = this.page.locator('.table-receptions-encours .datagrid-wrapper td input');
    
    public readonly rechercheBlAchatFourn  = this.page.locator('[placeholder="Numéro de BL / Fournisseur"]').nth(1);

    public readonly checkBoxNumBL          = this.page.locator('#checkbox-numerosBLLivraisonOuLots');
    public readonly checkBoxFournisseur    = this.page.locator('#checkbox-fournisseurs');
    public readonly inputNumeroBL          = this.page.locator('input.filter-input');

    //-- pop up Réception en cours -----------------------------------------------------------------------------    
    public readonly pButtonTerminer        = this.page.locator('#terminer-reception');
    //-- Boutons Footer
    

    //-- pop up Terminer la réception
    public readonly buttonConfTerminer     = this.page.locator('[title="Terminer sans imprimer les étiquettes"]');
    public readonly labelImpPourPlt        = this.page.locator('.imprimer-pour-plateforme-label');
    public readonly messageAlert           = this.page.locator('.pi-exclamation-triangle');
    

    constructor(public readonly page: Page) {}  

}