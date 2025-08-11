/**
 * 
 * APLI     : PREPARATION 
 * PAGE     : REFERENTIEL
 * ONGLET   : REFERENTIEL ARTICLES 
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.4
 * 
 */

import { Locator, Page } from "@playwright/test"

export class RefReferentielArticlePage {

    public readonly inputArticle            : Locator;  
    public readonly inputListeConsignes     : Locator;
    public readonly inputSeuilFondPalette   : Locator;   
    public readonly inputConsignePalette    : Locator;   
    public readonly inputConsigne           : Locator;   

    public readonly buttonEnregistrerModif  : Locator;   
    public readonly buttonRechercher        : Locator;   

    public readonly dataGridListesTaches    : Locator; 
    public readonly dataGridListesCodes     : Locator; 

    public readonly listBoxGroupeArticle    : Locator;   

    public readonly checkBoxEnvoyerConsigne : Locator;   
    public readonly checkBoxArticles        : Locator;   

    public readonly tdCodeArticle           : Locator;   
    public readonly tdDesignationArticle    : Locator;   

    //---------------------------------------------------------------------------------------------------

    constructor(page:Page){

        this.inputArticle           = page.locator('div.input-article input');  
        this.inputListeConsignes    = page.locator('td.datagrid-consigne input');
        this.inputSeuilFondPalette  = page.locator('td.colonne-seuil input');   
        this.inputConsignePalette   = page.locator('td.colonne-consignePalette input');   
        this.inputConsigne          = page.locator('td.colonne-consignePalette input');    
    
        this.buttonEnregistrerModif = page.locator('.sigale-page-footer button');    
        this.buttonRechercher       = page.locator('p-button button.p-button'); //('button[icon="pi pi-search"]');    
    
        this.dataGridListesTaches   = page.locator('p-table[datakey="codeArticle"] tr.first-line th'); 
        this.dataGridListesCodes    = page.locator('td.datagrid-codeArticle'); 
    
        this.listBoxGroupeArticle   = page.locator('[ng-model="groupeArticle"]');

        this.checkBoxEnvoyerConsigne= page.locator('div.envoyer-consigne p-checkbox');
        this.checkBoxArticles       = page.locator('td p-tablecheckbox');

        this.tdCodeArticle          = page.locator('td.colonne-codeArticle');   
        this.tdDesignationArticle   = page.locator('td.colonne-designationArticle');  
        
    }
}