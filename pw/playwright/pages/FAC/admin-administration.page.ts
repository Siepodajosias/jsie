/**
 * 
 * FACTURATION PAGE > ADMIN / ONGLET > ADMINISTRATION
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page, test } from "@playwright/test"

export class AdminAdministration {

    
    public readonly buttonDiffuserFacturables               : Locator

    public readonly inputPoidsFacture                       : Locator

    constructor(page:Page){
        this.buttonDiffuserFacturables                      = page.locator('[ng-click="exporterFacturablesValides()"]');

        this.inputPoidsFacture                              = page.locator('#input-poids-modifPoids');
    }
}