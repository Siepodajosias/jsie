/**
 * Appli    : TRADUCTION
 * Menu     : ADMIN
 * Onglet   : ADMIN
 * 
 * 
 * @author SIAKA KONE
 * @version 3.1
 * 
 */

import { Locator, Page } from "@playwright/test";

export class Admin { 

    
    public readonly buttonVoirApiSwagger                 : Locator;//('.mx-auto .btn.btn-link');
    public readonly buttonSupprimerCache                 : Locator;//('#clear[type="submit"]');
    public readonly buttonActiverDesactiveAccesAppli     : Locator;//('statut button');

    public readonly listBoxSelectCache                   : Locator;//('#caches');
    public readonly listBoxSelectOpen                    : Locator;//('select option'); 
    
    constructor(page : Page) {

        this.buttonVoirApiSwagger                       = page.locator('.mx-auto .btn.btn-link');
        this.buttonSupprimerCache                       = page.locator('button#clear');
        this.buttonActiverDesactiveAccesAppli           = page.locator('statut button');

        this.listBoxSelectCache                         = page.locator('#caches');
        this.listBoxSelectOpen                          = page.locator('select option');
        
    }
}
