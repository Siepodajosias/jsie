/**
 * 
 * PREPARATION PAGE > REFERENTIEL / ONGLET > PARAMETRES VOCAUX
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.1
 * 
 */

import { Locator, Page } from "@playwright/test"

export class RefParametresVocauxPage {


    public readonly buttonEnregistrerModif  : Locator;   

    public readonly dataGridListesTaches    : Locator;  

    constructor(page:Page){ 

        this.buttonEnregistrerModif  = page.locator('div.sigale-page-footer button');    

        this.dataGridListesTaches    = page.locator('parametres-vocaux-wrapper table th.p-element');  
    }
}