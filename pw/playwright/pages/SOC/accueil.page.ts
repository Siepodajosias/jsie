/**
 * 
 * SOCIETES PAGE > ACCUEIL
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page, test } from "@playwright/test"

export class PageAccueil {
    public messageBienvenue: Locator;


    constructor(page: Page){

        this.messageBienvenue = page.locator('.titre div')
    }
}

