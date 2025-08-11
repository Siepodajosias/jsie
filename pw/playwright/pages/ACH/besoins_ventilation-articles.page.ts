/**
 * Appli    : ACHATS
 * Menu     : BESOINS MAGAINS
 * Onglet   : VENTILLATION DES ARTICLES
 * 
 * 
 * @author JC CALVIERA
 * @version 3.0
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageBesVenArt {

    public readonly spinner                        : Locator;

    public readonly buttonCreerUneVentilation      : Locator;    //(by.css('[ng-click="openPopupSaisieVentilationArticle()"]');
    public readonly buttonModifierUneVentilation   : Locator;    //(by.css('[ng-click="openPopupSaisieVentilationArticle(ventilationSelectionnee)"]');
    public readonly buttonAttribuerArticle         : Locator;    //(by.css('[ng-click="attribuerSelection()"]');
    public readonly buttonRetirerArticle           : Locator;    //(by.css('[ng-click="retirerSelection()"]');

    public readonly inputArticleVentilation        : Locator;    //(by.id('ventilation');
    public readonly inputArticleArticle            : Locator;    //(by.model('filtreArticle.value');
    public readonly inputFournisseur               : Locator;    //(by.id('input-fournisseur');
    public readonly inputArticleSelectionne        : Locator;    //(by.model('filtreArticleSelectionne.value');

    public readonly listBoxGroupe                  : Locator;    //(by.id('input-groupe');

    public readonly dataGridListeVentilations      : Locator;    //.all(by.css('.datagrid-ventilations th'); 
    public readonly dataGridTdListeVentilations    : Locator;    //.all(by.css('.datagrid-ventilations td.datagrid-designation'); 
    public readonly dataGridListeArticles          : Locator;    //.all(by.css('.datagrid-tous-articles th'); 
    public readonly dataGridTdListeArticles        : Locator;    //.all(by.css('.datagrid-tous-articles td.datagrid-designation');     
    public readonly dataGridTdListeCodes           : Locator;    //.all(by.css('.datagrid-tous-articles td.datagrid-code');     
    public readonly dataGridListeArticlesSelected  : Locator;    //.all(by.css('.datagrid-articles-ventilation th'); 
    public readonly dataGridTdListeCodesSelected   : Locator;    //.all(by.css('.datagrid-articles-ventilation td.datagrid-code');        

    //--- POPIN : Création d'une ventilation article -----------------------------------------------------------------------------------------------
    public readonly pPbuttonFermer                 : Locator;    //(by.css('div.popup-saisie-ventilation-article > div > a');
    public readonly pPbuttonEnregistrer            : Locator;    //(by.css('.modal-footer > button');

    public readonly pPinputDesignation             : Locator;    //(by.model('popupSaisieVentilationArticle.ventilationArticle.designation');
    public readonly pPinputCoefficient             : Locator;    //(by.model('popupSaisieVentilationArticle.ventilationArticle.coefficientSecurite');

    //----------------------------------------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {
        
        this.page = page;
        
        this.buttonCreerUneVentilation      = page.locator('button[ng-click="openPopupSaisieVentilationArticle()"]');
        this.buttonModifierUneVentilation   = page.locator('[ng-click="openPopupSaisieVentilationArticle(ventilationSelectionnee)"]');
        this.buttonAttribuerArticle         = page.locator('[ng-click="attribuerSelection()"]');
        this.buttonRetirerArticle           = page.locator('[ng-click="retirerSelection()"]');
    
        this.inputArticleVentilation        = page.locator('#ventilation');
        this.inputArticleArticle            = page.locator('input.articles-tous');
        this.inputFournisseur               = page.locator('#input-fournisseur');
        this.inputArticleSelectionne        = page.locator('span[ng-model="filtreArticleSelectionne.value"] input');
    
        this.listBoxGroupe                  = page.locator('#input-groupe');
    
        this.dataGridListeVentilations      = page.locator('.datagrid-ventilations th'); 
        this.dataGridTdListeVentilations    = page.locator('.datagrid-ventilations td.datagrid-designation'); 
        this.dataGridListeArticles          = page.locator('.datagrid-tous-articles th'); 
        this.dataGridTdListeArticles        = page.locator('.datagrid-tous-articles td.datagrid-designation');     
        this.dataGridTdListeCodes           = page.locator('.datagrid-tous-articles td.datagrid-code');     
        this.dataGridListeArticlesSelected  = page.locator('.datagrid-articles-ventilation th'); 
        this.dataGridTdListeCodesSelected   = page.locator('.datagrid-articles-ventilation td.datagrid-code');        
    
        //--- POPIN : Création d'une ventilation article -----------------------------------------------------------------------------------------------
        this.pPbuttonFermer                 = page.locator('div.popup-saisie-ventilation-article > div > a');
        this.pPbuttonEnregistrer            = page.locator('.modal-footer > button');
    
        this.pPinputDesignation             = page.locator('[ng-model="popupSaisieVentilationArticle.ventilationArticle.designation"]');
        this.pPinputCoefficient             = page.locator('[ng-model="popupSaisieVentilationArticle.ventilationArticle.coefficientSecurite"]');

    }

}