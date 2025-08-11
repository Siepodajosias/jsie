/**
 * Appli    : BUDGET
 * Page     : ADMIN
 * Onglet   : ADMINISTRATIONS
 * 
 * 
 * @author SIAKA KONE
 * @version 3.0
 * 
 */

import {Locator, Page }  from '@playwright/test';

export class Admin {
    
    public readonly buttonActiverDesactiveAccesAppli : Locator;
    public readonly buttonDiffuserEltTraduisible     : Locator;
    public readonly buttonRechargerCache             : Locator;
    public readonly buttonSupprimerCache             : Locator;
    public readonly buttonVoirApiSwagger             : Locator;

    public readonly listBoxSelectCache               : Locator;
    public readonly listBoxSelectOpen                : Locator;

    constructor(page: Page) {

        this.buttonActiverDesactiveAccesAppli       = page.locator('button.btn-medium.float-right').nth(0);
        this.buttonDiffuserEltTraduisible           = page.locator('button.btn-medium.float-right').nth(2);
        this.buttonRechargerCache                   = page.locator('button.btn-medium.float-right').nth(3);
        this.buttonSupprimerCache                   = page.locator('#clear[type="submit"]');
        this.buttonVoirApiSwagger                   = page.locator('.mx-auto .btn.btn-link');

        this.listBoxSelectCache                     = page.locator('#caches');
        this.listBoxSelectOpen                      = page.locator('select option');

    }
}


