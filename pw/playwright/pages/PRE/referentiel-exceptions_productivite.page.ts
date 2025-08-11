/**
 * 
 * APPLI    : PREPARATION 
 * PAGE     : REFERENTIEL
 * ONGLET   : EXCEPTION DE PRODUCTIVITE
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.1
 * 
 */

import { Locator, Page } from "@playwright/test"

export class RefExceptionProductivitePage {

    public readonly buttonDefinirException      : Locator;    // .all(by.css('[ng-click="btnModifier()"]')).get(0);
    public readonly buttonRetirerException      : Locator;    // .all(by.css('[ng-click="btnModifier()"]')).get(1);
    
    public readonly inputSearchArticle          : Locator;    // (by.model('ngModel'));  

    public readonly listBoxGroupeArticle        : Locator
    
    public readonly checkBoxAfficherExceptions  : Locator;    // (by.id('checkbox-toggle-articles')); 
    public readonly checkBoxListeExceptions     : Locator;    // .all(by.css('.exceptions-productivites td input'));

    public readonly tdListeDesignations         : Locator;    // .all(by.css('td.datagrid-designationFormatee'));
    public readonly tdListeExceptions           : Locator;    // .all(by.css('td.datagrid-exceptionProductivite'));

    public readonly trListeExceptions           : Locator;

    public readonly dataGridListesTaches        : Locator;    // .all(by.css('.tableau-article th')); 

    constructor(page:Page){

        this.buttonDefinirException      = page.locator('[ng-click="btnModifier()"]').nth(0);
        this.buttonRetirerException      = page.locator('[ng-click="btnModifier()"]').nth(1);
        
        this.inputSearchArticle          = page.locator('[ng-model="ngModel"]');  
        
        this.listBoxGroupeArticle        = page.locator('#filtre-groupe-article');

        this.checkBoxAfficherExceptions  = page.locator('#checkbox-toggle-articles'); 
        this.checkBoxListeExceptions     = page.locator('.exceptions-productivites td input');
    
        this.tdListeDesignations         = page.locator('td.datagrid-designationFormatee');
        this.tdListeExceptions           = page.locator('td.datagrid-exceptionProductivite');

        this.trListeExceptions           = page.locator('datagrid.tab-referentiel-articles tr');
    
        this.dataGridListesTaches        = page.locator('.tableau-article th'); 
    }
    
}