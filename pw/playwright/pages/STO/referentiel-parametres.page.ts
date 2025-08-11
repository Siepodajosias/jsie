/**
 * Appli    : STOCK
 * Menu     : REFERENTIEL
 * Onglet   : PARAMETRES D'IMPRESSION
 * 
 * author JOSIAS SIE
 * 
 * @version 3.0
 * 
 */

import { Page }          from "@playwright/test";

export class ReferentielParametres{

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonEnregistrer             = this.page.locator('[ng-click="enregistrer()"]');

    public readonly listBoxImprimFeuilles         = this.page.locator('select[ng-model="imprimanteFeuilleSelectionnee"]');
    public readonly listBoxImprimEtiquettes       = this.page.locator('select[ng-model="imprimanteEtiquetteSelectionnee"]');    
    public readonly listBoxImprimEtiquettesReduit = this.page.locator('select[ng-model="imprimanteEtiquetteReduiteSelectionnee"]');

    //----------------------------------------------------------------------------------------------------------------    
    constructor(public readonly page: Page) {}   
}