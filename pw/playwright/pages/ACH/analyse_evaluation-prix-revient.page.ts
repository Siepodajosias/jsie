/**
 * Appli    : ACHATS 
 * Menu     : ANALYSE
 * Onglet   : EVALUATION PRIX REVIENT
 * 
 * 
 * @author JC CALVIERA
 * @version 3.0
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageAnaEvaPri {

    public readonly listBoxUniteAchat              : Locator;   //(by.css('[inputid="evaluation-unite-achat"]');
    public readonly listBoxCalibre                 : Locator;   //(by.css('[inputid="evaluation-calibre"]');
    public readonly listBoxConditionnement         : Locator;   //(by.css('[inputid="evaluation-conditionnement"]');
    public readonly listBoxPtfReception            : Locator;   //(by.css('[inputid="evaluation-plateforme-reception"]');
    public readonly listBoxPtfTransit              : Locator;   //(by.css('[inputid="evaluation-plateforme-transit"]');
    public readonly listBoxPtfDistribution         : Locator;   //(by.css('[inputid="evaluation-plateforme-distibution"]');

    public readonly inputPrixAchats                : Locator;   //(by.id('evaluation-prix-achat');
    public readonly inputArticle                   : Locator;   //(by.id('evaluation-article');
    public readonly inputNbUnitesParColisArticle   : Locator;   //(by.id('evaluation-nb-unite-colis-article');
    public readonly inputNbUnitesParColis          : Locator;   //(by.id('evaluation-nb-unite-colis');

    public readonly buttonEvaluer                  : Locator;   //(by.css('evaluation-prix-revient-wapper button.p-button');

    public readonly dgPlateformes                  : Locator;   //.all(by.css('p-table thead th.p-sortable-column');

    public readonly tdLignesReponses               : Locator;   //.all(by.css('p-table tbody tr');

    //---------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {
    
        this.page = page;
  
        this.listBoxUniteAchat              = page.locator('[inputid="evaluation-unite-achat"]');
        this.listBoxCalibre                 = page.locator('[inputid="evaluation-calibre"]');
        this.listBoxConditionnement         = page.locator('[inputid="evaluation-conditionnement"]');
        this.listBoxPtfReception            = page.locator('[inputid="evaluation-plateforme-reception"]');
        this.listBoxPtfTransit              = page.locator('[inputid="evaluation-plateforme-transit"]');
        this.listBoxPtfDistribution         = page.locator('[inputid="evaluation-plateforme-distibution"]');
    
        this.inputPrixAchats                = page.locator('#evaluation-prix-achat');
        this.inputArticle                   = page.locator('div.input input');//('#evaluation-article')
        this.inputNbUnitesParColisArticle   = page.locator('#evaluation-nb-unite-colis-article');
        this.inputNbUnitesParColis          = page.locator('#evaluation-nb-unite-colis');
    
        this.buttonEvaluer                  = page.locator('evaluation-prix-revient-wapper button.p-button');
    
        this.dgPlateformes                  = page.locator('p-table thead th.p-sortable-column');
    
        this.tdLignesReponses               = page.locator('p-table tbody tr');

    }

}