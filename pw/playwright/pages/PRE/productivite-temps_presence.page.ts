/**
 * 
 * PREPARATION PAGE > PRODUCTIVITE / ONGLET > IMPORT TEMPS DE PRESENCE 
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class ProdImportTPresencePage {

    public readonly buttonImporter  : Locator  //.locator('.upload-btns > div > input.btn-primary');
    public readonly buttonUploader  : Locator  //.locator('.upload-btns > div > input.file-input');

    public readonly tableResImpText : Locator
    public readonly tableTPresence  : Locator

    constructor(page:Page){

        this.buttonImporter  = page.locator('.upload-btns > div > input.btn-primary');
        this.buttonUploader  = page.locator('.upload-btns > div > input.file-input');
        
        this.tableResImpText = page.locator('.recapitulatif table tr .text')
        this.tableTPresence  = page.locator('.temps-de-presence thead tr th')
    }
}