/**
 * Appli    : STOCK
 * Menu     : Accueil
 * Onglet   : ---
 * 
 * author JOSIAS SIE
 * 
 * @version 3.3
 * 
 */

import { Page } from "@playwright/test"

export class ReferentielRangement {

    public readonly buttonModifier    = this.page.locator('.form-btn-section button');
    public readonly dataGridRangement = this.page.locator('tr.first-line th');
    public readonly inputCheminPicking= this.page.locator('.sigale-input-container input');
    public readonly trCheminPicking   = this.page.locator('tr.p-selectable-row');

    //------------------------------------------------------------------------------------------------

    public readonly pInputFieldPolitiqueRangement= this.page.locator('.p-dialog-content p-dropdown');
    public readonly pInputZoneRangement          = this.page.locator('.p-tree-filter-container input');
    public readonly pLiPolitiqueRangement        = this.page.locator('.p-dialog-content p-dropdown p-dropdownitem li');
    public readonly pCheckBoxZoneRangement       = this.page.locator('.p-dialog-content .p-checkbox-box');
    public readonly pButtonZoneRangement         = this.page.locator('button.p-tree-toggler');
    public readonly pSvgZoneRangement            = this.page.locator('.p-treenode-children .p-checkbox-box.p-highlight checkicon');
    public readonly pButtonEnregistrer           = this.page.locator('.p-dialog-footer p-button > button').nth(0);
    public readonly pButtonAnnuler               = this.page.locator('.p-dialog-footer p-button > button').nth(1);
    
    constructor(public readonly page: Page) {}    
}