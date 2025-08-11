/**
 * 
 * FACTURATION PAGE > ACCUEIL
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page, test } from "@playwright/test"

export class AccueilPage {

    public readonly LabelWelcomeMessage:Locator

    constructor(page:Page){

        this.LabelWelcomeMessage            = page.locator('H3');
    }
}