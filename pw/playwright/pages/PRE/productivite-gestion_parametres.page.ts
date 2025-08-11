/**
 * 
 * PREPARATION PAGE > PRODUCTIVITE / ONGLET > GESTION DES PARAMETRES
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class ProdGestionParametresPage {

    public readonly buttonEnregistrer  : Locator   //.locator('#btn-valider-parametres');
    public readonly buttonAnnuler      : Locator   //.locator('[ng-click="$event.preventDefault(); annuler()"]');

    public readonly columnParametres   : Locator   //.locator('div.parametreFields > table > tbody > tr > td.text.ng-binding');    
    
    public readonly inputDuree         : Locator   //.locator('#parametre-0');    
    public readonly inputTempsPause    : Locator   //.locator('#parametre-1');    
    public readonly inputTempsPortage  : Locator   //.locator('#parametre-4'); 
    
    constructor(page: Page){

        this.buttonEnregistrer  = page.locator('#btn-valider-parametres');
        this.buttonAnnuler      = page.locator('[ng-click="$event.preventDefault(); annuler()"]');

        this.columnParametres   = page.locator('div.parametreFields > table > tbody > tr > td.text.ng-binding');    
        
        this.inputDuree         = page.locator('#parametre-0');    
        this.inputTempsPause    = page.locator('#parametre-1');    
        this.inputTempsPortage  = page.locator('#parametre-4');  
    }
}