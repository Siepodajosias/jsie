/**
 * 
 * APPLI    : PREPARATION 
 * PAGE     : REFERENTIEL
 * ONGLET   : PARAMETRES D'IMPRESSION
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.2
 * 
 */

import { Locator, Page } from "@playwright/test"

export class RefParametresImpressionPage {

    public readonly listBoxImpressionEtiquettes  : Locator;    //.locator('div.choix-plateforme-expedition');
    public readonly listBoxImpressionFeuilles    : Locator;    //.locator('div.choix-imprimante');    

    public readonly buttonEnregistrer            : Locator;    //.locator('div.tableBottom button');
    public readonly buttonPlus                   : Locator;    

    public readonly columnParemetresImpression   : Locator;    //.locator('td.description');
    public readonly tableparamImpEtiqpalettes    : Locator;

    constructor(page: Page) {

        this.listBoxImpressionEtiquettes  = page.locator('div.choix-plateforme-expedition');
        this.listBoxImpressionFeuilles    = page.locator('div.choix-imprimante');    
    
        this.buttonEnregistrer            = page.locator('div.tableBottom button');  
        this.buttonPlus                   = page.locator('p-button button.p-button-icon-only'); //('button em.fa-plus')  
    
        this.columnParemetresImpression   = page.locator('div.etiquette-feuille td.description');

        this.tableparamImpEtiqpalettes    = page.locator('p-table[datakey="plateformeDestination.code"] th');
    }

}