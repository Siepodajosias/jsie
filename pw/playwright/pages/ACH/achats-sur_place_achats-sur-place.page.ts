/**
 * Appli    : ACHATS
 * Menu     : ACHATS SUR PLACE
 * Onglet   : ACHATS SUR PLACE
 * 
 * 
 * @author JC CALVIERA
 * @version 3.2
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageAspAsp {

    public readonly buttonCreer                    : Locator;   //(by.css('[ng-click="ouvrirPopupCreationAchatsSurPlace()"]');

    public readonly datePickerAchat                : Locator;   //(by.id('achats-sur-place-input-date-achat');

    public readonly inputFieldFiltreCodeArticle    : Locator;   //.all(by.css('.filtre-article-fournisseur-magasin > input').nth(0);
    public readonly inputFieldFiltreFournisseur    : Locator;   //.all(by.css('.filtre-article-fournisseur-magasin > input').nth(1);
    public readonly inputFieldFiltreMagasin        : Locator;   //.all(by.css('.filtre-article-fournisseur-magasin > input').nth(2);    

    public readonly dataGridAchatsSurPlace         : Locator;   //.all(by.css('.table-achats-sur-place .datagrid-table-wrapper > table > thead > tr > th');
    public readonly dataGridListeAchatsSurPlace    : Locator;   //.all(by.css('.table-achats-sur-place .datagrid-table-wrapper > table > tbody > tr');    
    
    //--- POPIN : Création d'un achat sur place -----------------------------------------------------------------------------------------------    
    public readonly pPdatePickerReceoptionMagasin  : Locator;   //(by.id('achats-sur-place-input-date-reception');

    public readonly pPbuttonEnregistrer            : Locator;   //.all(by.css('#form-creation-achats-sur-place > modal > div > div.modal-footer > button').nth(0);
    public readonly pPbuttonAnnuler                : Locator;   //(by.css('#form-creation-achats-sur-place > modal > div > div.modal-footer > a');
    public readonly pPbuttonPlus                   : Locator;   //(by.css('button.ajouter-achat-sur-place');

    public readonly pPinputDesignationArticle      : Locator;   //(by.id('achats-sur-place-input-article');
    public readonly pPinputDesignationFournisseur  : Locator;   //(by.id('achat-sur-place-input-fournisseur');
    public readonly pPinputDesignationMagasin      : Locator;   //(by.id('achat-sur-place-input-magasin');
    public readonly pPinputBonLivraison            : Locator;   //(by.id('achats-sur-place-input-numero-bl');
    public readonly pPinputLotPrixAchat            : Locator;   //.all(by.model('lot.prixAchat');
    public readonly pPinputLotPrixCession          : Locator;   //.all(by.model('lot.prixCession');
    public readonly pPinputLotQuantite             : Locator;   //.all(by.model('lot.quantite');
    public readonly pPinputLotNumeroBL             : Locator;   //.all(by.model('lot.numeroBL');
    public readonly pPinputLotPoidsReel            : Locator;   //.all(by.model('lot.poidsReel');

    public readonly pPautocompleteArticle          : Locator;   //.all(by.css('ul.gfit-autocomplete-results > li');
    public readonly pPautocompleteFournisseur      : Locator;   //.all(by.css('.gfit-autocomplete-results').nth(1).all(by.css('li');    
    public readonly pPautocompleteMagasin          : Locator;   //.all(by.css('.gfit-autocomplete-results').nth(2).all(by.css('li');

    public readonly pPdataGridCreationAchatSurPlace: Locator;   //.all(by.css('#table-nouveau-lot-sur-place > thead > tr > th');
    public readonly pPdataGridListeAchatSurPlace   : Locator;   //.all(by.css('#table-nouveau-lot-sur-place > thead > tr');

    public readonly pPlistBoxLotCategorie          : Locator;   //.all(by.model('lot.categorie');
    public readonly pPlistBoxLotVariete            : Locator;   //.all(by.model('lot.variete');
    public readonly pPlistBoxLotCalibre            : Locator;   //.all(by.model('lot.calibreConditionnement.calibre');
    public readonly pPlistBoxLotConditionnement    : Locator;   //.all(by.model('lot.calibreConditionnement.conditionnementDesignation');
    public readonly pPlistBoxLotOrigine            : Locator;   //.all(by.model('lot.origine');
    public readonly pPlistBoxLotUniteAchat         : Locator;   //.all(by.model('lot.uniteAchat');        
    public readonly pPlistBoxCentraleAchat         : Locator;   //(by.id('achat-sur-place-select-centrale-achat');    
    
    public readonly pPspinnerLoadPage              : Locator;
    public readonly pPFooterSpinnerLoadData         : Locator;

    //----------------------------------------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {
        
        this.page = page;
        
        this.buttonCreer                    = page.locator('[ng-click="ouvrirPopupCreationAchatsSurPlace()"]');

        this.datePickerAchat                = page.locator('#achats-sur-place-input-date-achat');
    
        this.inputFieldFiltreCodeArticle    = page.locator('.filtre-article-fournisseur-magasin > input').nth(0);
        this.inputFieldFiltreFournisseur    = page.locator('.filtre-article-fournisseur-magasin > input').nth(1);
        this.inputFieldFiltreMagasin        = page.locator('.filtre-article-fournisseur-magasin > input').nth(2);    
    
        this.dataGridAchatsSurPlace         = page.locator('.table-achats-sur-place .datagrid-table-wrapper > table > thead > tr > th');
        this.dataGridListeAchatsSurPlace    = page.locator('.table-achats-sur-place .datagrid-table-wrapper > table > tbody > tr');    
        
        //--- POPIN : Création d'un achat sur place -----------------------------------------------------------------------------------------------    
        this.pPdatePickerReceoptionMagasin  = page.locator('#achats-sur-place-input-date-reception');
    
        this.pPbuttonEnregistrer            = page.locator('#form-creation-achats-sur-place > modal > div > div.modal-footer > button').nth(0);
        this.pPbuttonAnnuler                = page.locator('#form-creation-achats-sur-place > modal > div > div.modal-footer > a');
        this.pPbuttonPlus                   = page.locator('button.ajouter-achat-sur-place');
    
        this.pPinputDesignationArticle      = page.locator('#achats-sur-place-input-article');
        this.pPinputDesignationFournisseur  = page.locator('#achat-sur-place-input-fournisseur');
        this.pPinputDesignationMagasin      = page.locator('#achat-sur-place-input-magasin');
        this.pPinputBonLivraison            = page.locator('#achats-sur-place-input-numero-bl');
        this.pPinputLotPrixAchat            = page.locator('[ng-model="lot.prixAchat"]');
        this.pPinputLotPrixCession          = page.locator('[ng-model="lot.prixCession"]');
        this.pPinputLotQuantite             = page.locator('[ng-model="lot.quantite"]');
        this.pPinputLotNumeroBL             = page.locator('[ng-model="lot.numeroBL"]');
        this.pPinputLotPoidsReel            = page.locator('[ng-model="lot.poidsReel"]');
    
        this.pPautocompleteArticle          = page.locator('ul.gfit-autocomplete-results > li');
        this.pPautocompleteFournisseur      = page.locator('.gfit-autocomplete-results:nth(1) li');    
        this.pPautocompleteMagasin          = page.locator('.gfit-autocomplete-results:nth(2) li');
    
        this.pPdataGridCreationAchatSurPlace= page.locator('#table-nouveau-lot-sur-place > thead > tr > th');
        this.pPdataGridListeAchatSurPlace   = page.locator('#table-nouveau-lot-sur-place > thead > tr');
    
        this.pPlistBoxLotCategorie          = page.locator('[ng-model="lot.categorie"]');
        this.pPlistBoxLotVariete            = page.locator('[ng-model="lot.variete"]');
        this.pPlistBoxLotCalibre            = page.locator('[ng-model="lot.calibreConditionnement.calibre"]');
        this.pPlistBoxLotConditionnement    = page.locator('[ng-model="lot.calibreConditionnement.conditionnementDesignation"]');
        this.pPlistBoxLotOrigine            = page.locator('[ng-model="lot.origine"]');
        this.pPlistBoxLotUniteAchat         = page.locator('[ng-model="lot.uniteAchat"]');        
        this.pPlistBoxCentraleAchat         = page.locator('#achat-sur-place-select-centrale-achat');       

        this.pPspinnerLoadPage              = page.locator('.progressRingCentre:NOT(.ng-hide)');      
        this.pPFooterSpinnerLoadData        = page.locator('img[ng-show]:not(.ng-hide)'); 

    }

}