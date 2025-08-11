/**
 * 
 * APPLICATION  : SOCIETES 
 * PAGE         : Admin
 * ONGLET       : Communication Utilisateurs
 * 
 * @author CALVIERA Jean Christophe
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class PageAdminCom {

    public buttonTraduireMessage    : Locator;

    // ToDo : A compléter !

    //---------------------------------------------------------------------------------------------------------

    constructor(page: Page){

        this.buttonTraduireMessage  = page.locator('div.bouton-traduction button');

    }

}