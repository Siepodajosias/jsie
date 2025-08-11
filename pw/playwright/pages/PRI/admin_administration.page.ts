/**
 * 
 * PRICING PAGE > ADMINISTRATION
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page} from "@playwright/test"

export class AdministrationPage {

    public readonly buttonDiffuserMagasins                      : Locator //('diffuser-magasins button');
    public readonly buttonDiffuserElemATraduire                 : Locator //('diffuser-elements-traduisibles button');

    constructor(page:Page){

        this.buttonDiffuserMagasins                             = page.locator('diffuser-magasins button');
        this.buttonDiffuserElemATraduire                        = page.locator('diffuser-elements-traduisibles button');
    }
}