/**
 * Appli    : ACHATS 
 * Page     : REFERENTIEL
 * Onglet   : APPROVISIONNEMENT AUTOMATIQUE
 * 
 * 
 * @author JC CALVIERA
 * @version 3.1
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageRefAppAut {

    public readonly buttonCreer                : Locator;   //(by.css('footer button i.icon-plus');
    public readonly buttonModifier             : Locator;   //(by.css('footer button i.icon-pencil');    

    public readonly inputFiltreCodeForunisseur : Locator;   //.all(by.css('th input').nth(1);
    public readonly inputFiltreDelaiAppro      : Locator;   //.all(by.css('th input').nth(2);
    public readonly inputFiltreNombreMagasin   : Locator;   //.all(by.css('th input').nth(3);
    public readonly inputFiltreNombreArticles  : Locator;   //.all(by.css('th input').nth(4);
    
    public readonly inputFiltreLibelle         : Locator;   //(by.css('p-columnfilter[field="designation"] input');
    public readonly inputFiltreDesignForunisseur: Locator;   //(by.css('p-columnfilter[field="designationFournisseur"] input');
    public readonly inputFiltreCentraleAchat   : Locator;   //(by.css('p-columnfilter[field="centraleAchat.raisonSociale"]');
    public readonly inputFiltrePtfDistribution : Locator;   //(by.css('p-columnfilter[field="plateformeDeDistribution.designation"]');
    public readonly inputFiltrePrepare         : Locator;   //(by.css('p-columnfilter[field="prepare"] p-tristatecheckbox');
    public readonly inputFiltreAutoconfirme    : Locator;   //(by.css('p-columnfilter[field="autoConfirme"] p-tristatecheckbox');
    public readonly inputFiltreActif           : Locator;   //(by.css('p-columnfilter[field="actif"] p-tristatecheckbox');

    public readonly dataGridFraisStructure     : Locator;   //.all(by.css('thead tr:nth-child(1) th'); 

    //--Popin : Création d'un approvisionnement automatique ------------------------------------------------------------------------------------
    public readonly pPinputIntitule            : Locator;   //(by.id('intitule-appro-auto');
    public readonly pPinputFournisseur         : Locator;   //(by.css('app-autocomplete[formcontrolname="fournisseur"] input');
    public readonly pPinputMagasinServi        : Locator;   //(by.css('.magasins-servis input.filter-input');
    public readonly pPinputArticle             : Locator;   //(by.css('div.ajouter-article input');
    public readonly pPinputFraisDouane         : Locator;   //.all(by.css('input[formcontrolname="fraisDouane"]');
    public readonly pPinputPrixTransport       : Locator;   //.all(by.css('input[formcontrolname="prixTransport"]');
    public readonly pPinputPrixAchat           : Locator;   //.all(by.css('input[formcontrolname="prixAchat"]');

    public readonly pPcheckBoxPrepare          : Locator;   //(by.id('input-prepare');
    public readonly pPcheckBoxAutoConfirme     : Locator;   //(by.id('input-auto-confirme');
    public readonly pPcheckBoxActif            : Locator;   //(by.id('input-actif');
    public readonly pPcheckBoxCrossDocking     : Locator;   //(by.id('input-crossdocking');
    //public readonly pPcheckBoxCrossDocking     : Locator;   //(by.model('approAuto.crossDocking');
    public readonly pPcheckBoxListeMagServi    : Locator;   //.all(by.css('p-tablecheckbox');
    public readonly pPcheckBoxAllMagasins      : Locator;   //(by.css('.table-magasins th input');

    public readonly pPdatePickerDebuApplication: Locator;   //(by.css('p-calendar[formcontrolname="dateDebut"]');
    public readonly pPdatePickerFinApplication : Locator;   //(by.css('p-calendar[formcontrolname="dateFin"]');
    public readonly pPdatePickerToday          : Locator;   //(by.css('td.p-datepicker-today');

    public readonly pPlistBoxDistribution      : Locator;   //(by.css('p-dropdown[id="plateforme-distribution-appro-auto"]');
    public readonly pPlistBoxDelaiAppro        : Locator;   //(by.id('delai-reception-anticipe');
    public readonly pPlistBoxHeureTraitement   : Locator;   //(by.id('heure-traitement');
    public readonly pPlistBoxOrigine           : Locator;   //.all(by.css('p-dropdown.ng-invalid[formcontrolname="origine"]');
    public readonly pPlistBoxCalibre           : Locator;   //.all(by.css('p-dropdown.ng-invalid[formcontrolname="calibre"]');
    public readonly pPlistBoxConditionnement   : Locator;   //.all(by.css('p-dropdown.ng-invalid[formcontrolname="conditionnement"]');
    public readonly pPlistBoxPlateformeRecp    : Locator;   //.all(by.css('p-dropdown.ng-invalid[formcontrolname="plateformeReception"]');
    public readonly pPlistBoxIncoterm          : Locator;   //.all(by.css('p-dropdown.ng-invalid[formcontrolname="incoterm"]');
    public readonly pPlistBoxUniteAchat        : Locator;   //.all(by.css('p-dropdown.ng-invalid[formcontrolname="uniteAchat"]');
    //public readonly pPlistBoxDelaiAchat        : Locator;   //.all(by.css('p-dropdown.ng-invalid[formcontrolname="origine"]');

    public readonly pPbuttonPlus               : Locator;   //(by.css('button span.fa-plus');
    public readonly pPbuttonEnregistrer        : Locator;   //(by.css('button.btn-enregistrer');
    public readonly pPbuttonMasquerErreur      : Locator;   //(by.css('div.feedback-error:NOT(.ng-hide) [ng-click="clearMessages()"]');
    public readonly pPbuttonRazInputArticle    : Locator;   //(by.css('[ng-click="remiseAZeroArticle()"]');

    public readonly pPlinkAnnuler              : Locator;   //(by.css('[ng-click="onClickClose($event)"]');

    public readonly pPautocompleteFournisseur  : Locator;   //.all(by.css('ngb-typeahead-window button');
    public readonly pPautocompleteArticle      : Locator;   //.all(by.css('ngb-typeahead-window button');

    public readonly pPListeChoix               : Locator;   //.all(by.css('p-dropdownitem li span');

    public readonly pPlabelDesignationMagasin  : Locator;   //(by.css('tr.p-highlight td:nth-child(2)');
    public readonly pPlabelDesignationArticle  : Locator;   //(by.css('table tr.ng-touched td:nth-child(2)');
    public readonly pPlabelMessageErreur       : Locator;   //(by.css('.feedback-error:NOT(.ng-hide)');

    //------------------------------------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {

        this.buttonCreer                = page.locator('footer button i.icon-plus');
        this.buttonModifier             = page.locator('footer button i.icon-pencil');    
    
        this.inputFiltreCodeForunisseur = page.locator('th input').nth(1);
        this.inputFiltreDelaiAppro      = page.locator('th input').nth(2);
        this.inputFiltreNombreMagasin   = page.locator('th input').nth(3);
        this.inputFiltreNombreArticles  = page.locator('th input').nth(4);
        
        this.inputFiltreLibelle         = page.locator('p-columnfilter[field="designation"] input');
        this.inputFiltreDesignForunisseur= page.locator('p-columnfilter[field="designationFournisseur"] input');
        this.inputFiltreCentraleAchat   = page.locator('p-columnfilter[field="centraleAchat.raisonSociale"]');
        this.inputFiltrePtfDistribution = page.locator('p-columnfilter[field="plateformeDeDistribution.designation"]');
        this.inputFiltrePrepare         = page.locator('p-columnfilter[field="prepare"] p-tristatecheckbox');
        this.inputFiltreAutoconfirme    = page.locator('p-columnfilter[field="autoConfirme"] p-tristatecheckbox');
        this.inputFiltreActif           = page.locator('p-columnfilter[field="actif"] p-tristatecheckbox');
    
        this.dataGridFraisStructure     = page.locator('thead tr:nth-child(1) th'); 
    
        //--Popin : Création d'un approvisionnement automatique ------------------------------------------------------------------------------------
        this.pPinputIntitule            = page.locator('#intitule-appro-auto');
        this.pPinputFournisseur         = page.locator('app-autocomplete[formcontrolname="fournisseur"] input');
        this.pPinputMagasinServi        = page.locator('.magasins-servis input.filter-input');
        this.pPinputArticle             = page.locator('div.ajouter-article .autocomplete input');
        this.pPinputFraisDouane         = page.locator('input[formcontrolname="fraisDouane"]');
        this.pPinputPrixTransport       = page.locator('input[formcontrolname="prixTransport"]');
        this.pPinputPrixAchat           = page.locator('input[formcontrolname="prixAchat"]');
    
        this.pPcheckBoxPrepare          = page.locator('#input-prepare');
        this.pPcheckBoxAutoConfirme     = page.locator('#input-auto-confirme');
        this.pPcheckBoxActif            = page.locator('#input-actif');
        this.pPcheckBoxCrossDocking     = page.locator('#input-crossdocking');
        //this.pPcheckBoxCrossDocking     = element(by.model('approAuto.crossDocking');
        this.pPcheckBoxListeMagServi    = page.locator('p-tablecheckbox');
        this.pPcheckBoxAllMagasins      = page.locator('.table-magasins th input');
    
        this.pPdatePickerDebuApplication= page.locator('p-calendar[formcontrolname="dateDebut"]');
        this.pPdatePickerFinApplication = page.locator('p-calendar[formcontrolname="dateFin"]');
        this.pPdatePickerToday          = page.locator('td.p-datepicker-today');
    
        this.pPlistBoxDistribution      = page.locator('p-dropdown[id="plateforme-distribution-appro-auto"]');
        this.pPlistBoxDelaiAppro        = page.locator('#delai-reception-anticipe');
        this.pPlistBoxHeureTraitement   = page.locator('#heure-traitement');
        this.pPlistBoxOrigine           = page.locator('p-dropdown[formcontrolname="origine"]');
        this.pPlistBoxCalibre           = page.locator('p-dropdown[formcontrolname="calibre"]');
        this.pPlistBoxConditionnement   = page.locator('p-dropdown[formcontrolname="conditionnement"]');
        this.pPlistBoxPlateformeRecp    = page.locator('p-dropdown[formcontrolname="plateformeReception"]');
        this.pPlistBoxIncoterm          = page.locator('p-dropdown[formcontrolname="incoterm"]');
        this.pPlistBoxUniteAchat        = page.locator('p-dropdown[formcontrolname="uniteAchat"]');
    
        this.pPbuttonPlus               = page.locator('button span.fa-plus');
        this.pPbuttonEnregistrer        = page.locator('button.btn-enregistrer');
        this.pPbuttonMasquerErreur      = page.locator('div.feedback-error:NOT(.ng-hide) [ng-click="clearMessages()"]');
        this.pPbuttonRazInputArticle    = page.locator('[ng-click="remiseAZeroArticle()"]');
    
        this.pPlinkAnnuler              = page.locator('[ng-click="onClickClose($event)"]');
    
        this.pPautocompleteFournisseur  = page.locator('ngb-typeahead-window button');
        this.pPautocompleteArticle      = page.locator('ngb-typeahead-window button');
    
        this.pPListeChoix               = page.locator('p-dropdownitem li span');
    
        this.pPlabelDesignationMagasin  = page.locator('tr.p-highlight td:nth-child(2)');
        this.pPlabelDesignationArticle  = page.locator('table tr.ng-touched td:nth-child(2)');
        this.pPlabelMessageErreur       = page.locator('.feedback-error:NOT(.ng-hide)');
    
        //------------------------------------------------------------------------------------------------------------------------------------------

    }

}