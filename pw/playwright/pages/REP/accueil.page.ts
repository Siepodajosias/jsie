/**
 * 
 * REPARTITION PAGE > ACCUEIL
 * 
 * @author JC CALVIERA
 * @version 3.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class Accueil {

    //--------------------------------------------------------------------------------------------------------------

    public readonly dataGridHeaders     : Locator;

    public readonly spinner             : Locator;   

    //--------------------------------------------------------------------------------------------------------------

    constructor(page:Page){

        this.dataGridHeaders            = page.locator('#table-recapitulatif  thead tr th')

        this.spinner                    = page.locator('div.progressRingCentre:NOT(.ng-hide)');   

    }

}