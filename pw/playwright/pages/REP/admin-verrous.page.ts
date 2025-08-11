/**
 * 
 * REPARTITION PAGE > ADMIN / ONGLET > VERROUS
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * @since 2024-06-14
 */

import { Page } from "@playwright/test"

export class AdminVerrousPage {

     public readonly inputPlateforme          = this.page.locator('#input-filter-plateforme'); 
     public readonly inputArticle             = this.page.locator('#input-filter-article input');
     public readonly datagridVerrous          = this.page.locator('table tr > th');

     public readonly buttonRafraichirTableau  = this.page.locator('button[ng-click="recupereTousVerrousActifs()"]');
     public readonly buttonSupprimerVerrous   = this.page.locator('button[ng-click="supprimerVerrous()"]');  
        
     constructor(public readonly page: Page) {};
}