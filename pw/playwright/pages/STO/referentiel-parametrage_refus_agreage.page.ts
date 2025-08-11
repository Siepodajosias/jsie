/**
 * Appli    : STOCK
 * Menu     : REFERENTIEL
 * Onglet   : PARAMETRAGE REFUS AGREAGE
 * 
 * author JC CALVIERA
 * 
 * @version 1.0
 * 
 * 
 */

import { Page }          from "@playwright/test";

export class ReferentielParametrageRefusAgreage {

    //----------------------------------------------------------------------------------------------------------------    
    public readonly buttonEnregistrer          = this.page.locator('div.form-btn-section button');

    public readonly listBoxImprimOrdreDepl     = this.page.locator('p-dropdown[name="imprimante-etiquette"]:NOT(#imprimante-etiquette)');
    public readonly listBoxImprimPaletteRefus  = this.page.locator('p-dropdown[name="imprimante-refusees"]');
    public readonly listBoxImprimReliquatRefus = this.page.locator('p-dropdown[name="imprimante-etiquette-reliquat"]');
    
    public readonly buttonClearInput           = this.page.locator('.p-dropdown-clear-icon.p-icon');
    
    public readonly inputEmplDeposePaletteRefus= this.page.locator('input[name="emplacement-deplacement-refus"]');
    public readonly inputImpressionEtiqPalette = this.page.locator('input[name="nbr-etiquette"]');
    
    //----------------------------------------------------------------------------------------------------------------  
    constructor(public readonly page: Page) {}     
}