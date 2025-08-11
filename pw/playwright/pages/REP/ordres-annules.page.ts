/**
 * 
 * REPARTITION PAGE > ORDRES REPARTITION / ONGLET >  ANNULES
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class OrdRepAnnulesPage {
    //--------------------------------------------------------------------------------------------------------------

    public readonly inputFiltre           : Locator  // .locator('.filter-input.filter-wrapper');
    public readonly checkboxOrdre         : Locator  // .locator('#checkbox-ordre');
    public readonly checkBoxLot           : Locator  // .locator('#checkbox-lot');
    public readonly checkboxArticle       : Locator  // .locator('#checkbox-article');
    public readonly checkboxFournisseur   : Locator  // .locator('#checkbox-fournisseur');

    public readonly textLegend            : Locator  // .locator('.legende-ordres');

    public readonly headerList            : Locator  // .locator('.table.table-striped.table-bordered.table-hover.table-condensed > thead > tr > th');

    //--------------------------------------------------------------------------------------------------------------

    constructor(page:Page){

        //--------------------------------------------------------------------------------------------------------------

        this.inputFiltre           = page.locator('.filter-input.filter-wrapper');
        this.checkboxOrdre         = page.locator('#checkbox-ordre');
        this.checkBoxLot           = page.locator('#checkbox-lot');
        this.checkboxArticle       = page.locator('#checkbox-article');
        this.checkboxFournisseur   = page.locator('#checkbox-fournisseur');

        this.textLegend            = page.locator('.legende-ordres');

        this.headerList            = page.locator('.table.table-striped.table-bordered.table-hover.table-condensed > thead > tr > th');

        //--------------------------------------------------------------------------------------------------------------
    }
}