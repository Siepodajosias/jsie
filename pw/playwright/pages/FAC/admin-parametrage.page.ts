/**
 * 
 * FACTURATION PAGE > ADMIN / ONGLET > PARAMETRAGE
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page, test } from "@playwright/test"

export class AdminParametragepage {

    public readonly listBoxImpressionAuto                           : Locator; 
    public readonly checkBoxPrintFacCliExterne                      : Locator;
    public readonly checkBoxPrintReleveFac                          : Locator;

    public readonly buttonPrintEnregistrer                          : Locator;

    constructor(page:Page){

        this.listBoxImpressionAuto                                   = page.locator('[ng-model="parametresImpressions.imprimanteParDefaut"]');

        this.checkBoxPrintFacCliExterne                              = page.locator('[ng-model="parametresImpressions.impressionAutoFacturesExternes"]');
        this.checkBoxPrintReleveFac                                  = page.locator('[ng-model="parametresImpressions.impressionAutoRelevesFactures"]');

        this.buttonPrintEnregistrer                                  = page.locator('[ng-click="enregistrerParametresImpression()"]');
    }
}