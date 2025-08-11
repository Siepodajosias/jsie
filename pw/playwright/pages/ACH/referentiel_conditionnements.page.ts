/**
 * Appli    : ACHATS 
 * Page     : REFERENTIEL
 * Onglet   : CONDITIONNEMENTS
 * 
 * 
 * @author JC CALVIERA
 * @version 3.0
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageRefCond {

    public readonly inputFiltreArticle             : Locator;   //(by.id('conditionnement-input-article');

    public readonly autocompleteArticle            : Locator;   //.all(by.css('.conditionnement-input-article ul.gfit-autocomplete-results li');
    
    public readonly dataGridArticles               : Locator;   //.all(by.css('.table-conditionnements th'); 

    public readonly buttonCreer                    : Locator;   //(by.css('[ng-click="openSaisieConditionnement()"]');
    public readonly buttonModifier                 : Locator;   //(by.css('[ng-click="openSaisieConditionnement(dg.selection[0])"]');
    public readonly buttonInactiver                : Locator;   //(by.css('[ng-click="openPopupInactivation(dg.selection[0])"]');

    //-- Popin : Création d'un conditionnement ---------------------------------------------------------------------------------
    public readonly pInputDesignationCond          : Locator;   //(by.model('libelleConditionnement');
    public readonly pInputArticleCond              : Locator;   //(by.id('saisie-conditionnement-input-article');
    public readonly pInputPcbCond                  : Locator;   //(by.id('saisie-conditionnement-input-pcb');
    public readonly pInputPoidsMoyenColisCond      : Locator;   //(by.id('saisie-conditionnement-input-poids-moyen');
    public readonly pInputColisParCoucheCond       : Locator;   //(by.id('saisie-conditionnement-input-colis-couche');
    public readonly pInputCouchesParPaletteCond    : Locator;   //(by.id('saisie-conditionnement-input-couches-palette');
    public readonly pInputEan14Cond                : Locator;   //(by.id('saisie-conditionnement-input-ean14');  
    public readonly pInputLongueurCond             : Locator;   //(by.id('saisie-conditionnement-input-longueur');
    public readonly pInputLargeurCond              : Locator;   //(by.id('saisie-conditionnement-input-largeur');
    public readonly pInputHauteurCond              : Locator;   //(by.id('saisie-conditionnement-input-hauteur');

    public readonly pListBoxCalibreCond            : Locator;   //(by.id('saisie-conditionnement-select-calibre');
    public readonly pListBoxEmballageCond          : Locator;   //(by.id('saisie-conditionnement-select-emballage');
    public readonly pListBoxUniteDetailCond        : Locator;   //(by.id('saisie-conditionnement-select-unite');
    public readonly pListBoxDescriptifCond         : Locator;   //(by.id('saisie-conditionnement-input-descriptif');
    public readonly pListBoxUniteSousEmballageCond : Locator;   //(by.id('saisie-conditionnement-select-unite-sous-emballage');

    public readonly pCheckBoxUniteEmballageCond    : Locator;   //(by.id('saisie-conditionnement-checkbox-applicable');

    public readonly pButtonCreerCond               : Locator;   //(by.css('#form-saisie-conditionnement .modal-footer button.btn-primary');
    public readonly pButtonViderCond               : Locator;   //(by.css('#form-saisie-conditionnement .modal-footer button:not(.btn-primary)');
    public readonly pLinkAnnuler                   : Locator;   //(by.css('#form-saisie-conditionnement .modal-footer a');
    
    //----------------------------------------------------------------------------------------------------------------- 

    constructor(public readonly page: Page) {
        
        this.inputFiltreArticle             = page.locator('#conditionnement-input-article');

        this.autocompleteArticle            = page.locator('.conditionnement-input-article ul.gfit-autocomplete-results li');
        
        this.dataGridArticles               = page.locator('.table-conditionnements th'); 
    
        this.buttonCreer                    = page.locator('[ng-click="openSaisieConditionnement()"]');
        this.buttonModifier                 = page.locator('[ng-click="openSaisieConditionnement(dg.selection[0])"]');
        this.buttonInactiver                = page.locator('[ng-click="openPopupInactivation(dg.selection[0])"]');
    
        //-- Popin : Création d'un conditionnement ---------------------------------------------------------------------------------
        this.pInputDesignationCond          = page.locator('[ng-model="libelleConditionnement"]');
        this.pInputArticleCond              = page.locator('#saisie-conditionnement-input-article');
        this.pInputPcbCond                  = page.locator('#saisie-conditionnement-input-pcb');
        this.pInputPoidsMoyenColisCond      = page.locator('#saisie-conditionnement-input-poids-moyen');
        this.pInputColisParCoucheCond       = page.locator('#saisie-conditionnement-input-colis-couche');
        this.pInputCouchesParPaletteCond    = page.locator('#saisie-conditionnement-input-couches-palette');
        this.pInputEan14Cond                = page.locator('#saisie-conditionnement-input-ean14');  
        this.pInputLongueurCond             = page.locator('#saisie-conditionnement-input-longueur');
        this.pInputLargeurCond              = page.locator('#saisie-conditionnement-input-largeur');
        this.pInputHauteurCond              = page.locator('#saisie-conditionnement-input-hauteur');
    
        this.pListBoxCalibreCond            = page.locator('#saisie-conditionnement-select-calibre');
        this.pListBoxEmballageCond          = page.locator('#saisie-conditionnement-select-emballage');
        this.pListBoxUniteDetailCond        = page.locator('#saisie-conditionnement-select-unite');
        this.pListBoxDescriptifCond         = page.locator('#saisie-conditionnement-input-descriptif');
        this.pListBoxUniteSousEmballageCond = page.locator('#saisie-conditionnement-select-unite-sous-emballage');
    
        this.pCheckBoxUniteEmballageCond    = page.locator('#saisie-conditionnement-checkbox-applicable');
    
        this.pButtonCreerCond               = page.locator('#form-saisie-conditionnement .modal-footer button.btn-primary');
        this.pButtonViderCond               = page.locator('#form-saisie-conditionnement .modal-footer button:not(.btn-primary)');
        this.pLinkAnnuler                   = page.locator('#form-saisie-conditionnement .modal-footer a');   

    }

}