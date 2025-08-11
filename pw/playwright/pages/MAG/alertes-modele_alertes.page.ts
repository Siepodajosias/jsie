/**
 * Appli    : MAGASIN
 * Page     : ALERTES
 * Onglet   : MODELE ALERTES
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * @since 11/09/2023
 * 
 */

import { Page } from "@playwright/test"

export class AlertesModeleAlertes {

	public readonly buttonEnregistrer        = this.page.locator('.containerBT button');

	public readonly listBoxGroupeArticle     = this.page.locator('#groupeArticle');

	constructor(public readonly page: Page) {}
}