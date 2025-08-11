/**
 * 
 * JEEGY PAGE > MENU
 * 
 * @author JC CALVIERA
 * @version 3.0
 * 
 */


import { Locator, Page }    from "@playwright/test"

export class MenuJeegy {

	public readonly linkLogOut:Locator      = this.page.locator('ul.navbar-right li > a > i.fa-sign-out');

    //-------------------------------------------------------------------------------------------------------
	constructor(public readonly page: Page) {}

    public async deconnexion() {
        await this.linkLogOut.click();
    }

}