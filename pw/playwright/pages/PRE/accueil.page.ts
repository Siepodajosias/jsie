/**
 * 
 * PREPARATION PAGE > ACCUEIL
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class PreparationAccueilPage {

    public readonly buttonRafraichir       : Locator  //(by.css('button em.icon-refresh');

    public readonly datePickerJournee      : Locator  //.all(by.css('.datepicker-calendar').nth(1);

    public readonly listBoxGroupeArticle   : Locator  //(by.id('filtre-groupe-article');
    public readonly listBoxUnitesPrepa     : Locator  //(by.id('filtre-unite-preparation');

    public readonly recapEclatementCourant : Locator
    public readonly recapPickingCourant    : Locator

    public readonly inputHeure             : Locator  //.all(by.css('.calendar-date > form > span > input').nth(2);
    public readonly inputMinute            : Locator  //.all(by.css('.calendar-date > form > span > input').nth(3);

    constructor(page:Page){

        this.buttonRafraichir        = page.locator('button em.icon-refresh');

        this.datePickerJournee       = page.locator('.datepicker-calendar').nth(1);
    
        this.listBoxGroupeArticle    = page.locator('#filtre-groupe-article');
        this.listBoxUnitesPrepa      = page.locator('#filtre-unite-preparation');

        this.recapEclatementCourant  = page.locator('#recapitulatif-eclatement-courant table thead tr th')
        this.recapPickingCourant     = page.locator('#recapitulatif-picking-courant table thead tr th')
    
        this.inputHeure              = page.locator('.calendar-date > form > span > input').nth(2);
        this.inputMinute             = page.locator('.calendar-date > form > span > input').nth(3);
    }
}