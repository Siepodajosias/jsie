/**
 * Appli    : STOCK
 * Menu     : REFERENTIEL
 * Onglet   : DIMENSIONS COLIS A VALIDER
 * 
 * author JOSIAS SIE
 * 
 * @version 3.1
 * 
 * 
 */

import { Page }          from "@playwright/test";

export class ReferentielDimensionColisAValider {

    //----------------------------------------------------------------------------------------------------------------    
    public readonly buttonValider              = this.page.locator('button em.icon-ok');
    public readonly buttonRefuser              = this.page.locator('button em.icon-remove');

    public readonly dataGridHistoriqueImports  = this.page.locator('dimensions-colis-a-valider-wrapper tr:nth-child(1) th');
    
    //----------------------------------------------------------------------------------------------------------------   
    constructor(public readonly page: Page) {}    
}