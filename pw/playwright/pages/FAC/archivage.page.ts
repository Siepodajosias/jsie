/**
 * 
 * FACTURATION PAGE > ARCHIVAGE
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page, test } from "@playwright/test"

export class ArrivagePage {

    public readonly buttonRechercher                        : Locator

    public readonly listBoxStatutLot                        : Locator
    public readonly datePickerFrom                          : Locator
    public readonly datePickerTo                            : Locator

    constructor(page:Page){
        
        this.buttonRechercher                               = page.locator('p-button.recherche-factures button');

        this.listBoxStatutLot                               = page.locator('div.rechercher-archives p-dropdown');
    
        this.datePickerFrom                                 = page.locator('p-calendar input').nth(0);
        this.datePickerTo                                   = page.locator('p-calendar input').nth(1);
    }
}