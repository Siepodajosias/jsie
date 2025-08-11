/**
 * APPLI    : ACHATS
 * MENU     : Litiges
 * ONGLET   : Litiges Manuels
 * 
 * 
 * @author JC CALVIERA
 * @version 3.3
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageLitLitMan {

    public readonly buttonRechercher                : Locator;   //(by.css('.rechercher > button');
    public readonly buttonCreerUneDAV               : Locator;   //(by.css('[ng-click="creerDemandeAvoir(lotSelectionne)"]');

    public readonly inputFieldFiltreCodeArticle     : Locator;   //(by.id('lots-demande-avoir-input-article');
    public readonly inputFieldFiltreCodeLot         : Locator;   //(by.id('lots-demande-avoir-input-lot');
    public readonly inputFieldFiltreFournisseur     : Locator;
    public readonly inputFieldFiltrePlateforme      : Locator;   //(by.id('lots-demande-avoir-input-plateforme');
    public readonly inputFieldFiltreMagasin         : Locator;

    public readonly liAutocomplete                  : Locator;   //.all(by.css('li.gfit-autocomplete-result > b');

    public readonly checkBoxListeLitiges            : Locator;   //.all(by.css('.lots-demande-avoir-liste tbody tr input');
    public readonly checkBoxListeLitigesDispo       : Locator;

    public readonly dataGridAchatsSurPlace          : Locator;   //.all(by.css('.lots-demande-avoir-liste .datagrid-table-wrapper > table > thead > tr > th');

    public readonly datePickerFrom                  : Locator;   //.all(by.css('i.icon-calendar').nth(0);
    public readonly datePickerTo                    : Locator;   //.all(by.css('i.icon-calendar').nth(1);

    public readonly pictoMoisPrecedent              : Locator;   //(by.css('div.datepicker-days th.prev');

    public readonly tdActivesDays                   : Locator;   //.all(by.css('td.day:NOT(.old):NOT(.new)');

    //-- Popin : Création d'une demande d'avoir ---------------------------------------------------------------------------------------------
    public readonly pPbuttonCreer                   : Locator;   //.all(by.css('#form-creation-demande-avoir .modal-footer button:not(.ng-hide)').nth(0);    
    public readonly pPbuttonCreerApprouver          : Locator;   //.all(by.css('#form-creation-demande-avoir .modal-footer button:not(.ng-hide)').nth(1);

    public readonly pPinputQuantiteRefusee          : Locator;   //(by.id('creer-demande-avoir-qteAvoir');
    public readonly pPinputPrixAchatDefinitif       : Locator;   //(by.id('creer-demande-avoir-prixAccepte');

    public readonly pPtextAreaObservation           : Locator;   //(by.id('creer-demande-avoir-observation');

    public readonly pPlistBoxTypeAvoir              : Locator;   //(by.id('creer-demande-avoir-type');

    public readonly pPmessageErreur                 : Locator;   //(by.css('div.feedback-error:NOT(.ng-hide)');

    public readonly pPlinkAnnuler                   : Locator;   //(by.css('div.modal-footer > a');

    //----------------------------------------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {
        
        this.page = page;
        
        this.buttonRechercher               = page.locator('.rechercher > button');
        this.buttonCreerUneDAV              = page.locator('[ng-click="creerDemandeAvoir(lotSelectionne)"]');
    
        this.inputFieldFiltreCodeArticle    = page.locator('[ng-model="search.nomArticle"]');
        this.inputFieldFiltreCodeLot        = page.locator('[ng-model="search.lot"]');
        this.inputFieldFiltreFournisseur    = page.locator('[ng-model="search.nomFournisseur"]');
        this.inputFieldFiltrePlateforme     = page.locator('[ng-model="search.nomPlateforme"]');
        this.inputFieldFiltreMagasin        = page.locator('[ng-model="search.nomMagasin"]');
    
        this.liAutocomplete                 = page.locator('li.gfit-autocomplete-result > b');
    
        this.checkBoxListeLitiges           = page.locator('.lots-demande-avoir-liste tbody tr input');
        this.checkBoxListeLitigesDispo      = page.locator('td.datagrid-numeroFacture > span:NOT(.icon-lock)');
    
        this.dataGridAchatsSurPlace         = page.locator('.lots-demande-avoir-liste .datagrid-table-wrapper > table > thead > tr > th');
    
        this.datePickerFrom                 = page.locator('i.icon-calendar').nth(0);
        this.datePickerTo                   = page.locator('i.icon-calendar').nth(1);
    
        this.pictoMoisPrecedent             = page.locator('div.datepicker-days th.prev');
    
        this.tdActivesDays                  = page.locator('td.day:NOT(.old):NOT(.new)');       
        
        //-- Popin : Création d'une demande d'avoir ---------------------------------------------------------------------------------------------
        this.pPbuttonCreer                  = page.locator('#form-creation-demande-avoir .modal-footer button:not(.ng-hide)').nth(0);    
        this.pPbuttonCreerApprouver         = page.locator('#form-creation-demande-avoir .modal-footer button:not(.ng-hide)').nth(1);
    
        this.pPinputQuantiteRefusee         = page.locator('input[id="creer-demande-avoir-qteAvoir"]');
        this.pPinputPrixAchatDefinitif      = page.locator('input[id="creer-demande-avoir-prixAccepte"]');
    
        this.pPtextAreaObservation          = page.locator('id=creer-demande-avoir-observation');
    
        this.pPlistBoxTypeAvoir             = page.locator('id=creer-demande-avoir-type');
    
        this.pPmessageErreur                = page.locator('div.feedback-error:NOT(.ng-hide)');
    
        this.pPlinkAnnuler                  = page.locator('div.modal-footer > a');

    }

}