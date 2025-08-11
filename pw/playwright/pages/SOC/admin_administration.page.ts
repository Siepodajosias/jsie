/**
 * 
 * APPLICATION  : SOCIETES 
 * PAGE         : Admin
 * ONGLET       : Administration
 * 
 * @author CALVIERA Jean Christophe
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class PageAdminAdmin {

    public buttonRechargerCache         : Locator;

    //---------------------------------------------------------------------------------------------------------

    constructor(page: Page){

        this.buttonRechargerCache        = page.locator('traduction button');

    }

}